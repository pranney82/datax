import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { updateLocJT } from '../../x/toolbox/zillow/zquery'

interface WebhookEvent {
  createdEvent?: {
    createdAt: string;
    organization?: {
      id: string;
    };
    data?: {
      next?: {
        id: string;
        formattedAddress: string;
      };
    };
  };
}

interface ManualRequest {
  grantKey: string;
  locid: string;
  zestimateField: string;
  zestimateUrlField: string;
  address: string;
  yearBuiltField: string;
  yearbuilt: string;
  bedBathField: string;
  bedbath: string;
  livingAreaField: string;
  livingArea: string;
  latestSalePriceField: string;
  latestSalePrice: string;
}

type WebhookData = WebhookEvent | ManualRequest;


export async function POST(request: Request) {
  try {
    const webhookData = await request.json() as WebhookData;
    
    // Debug info object we'll include in responses
    const debug = {
      isWebhook: 'createdEvent' in webhookData,
      receivedData: webhookData,
      extractedIds: {}
    }

    const isWebhook = 'createdEvent' in webhookData
    //console.log('Request type:', { isWebhook, webhookData })

    let grantKey, locid, zestimateField, zestimateUrlField, address, jtOrgId, yearBuiltField, yearbuilt, bedBathField, bedbath, livingAreaField, livingArea, latestSalePriceField, latestSalePrice

    if (isWebhook) {
      jtOrgId = webhookData.createdEvent?.organization?.id
      const locationId = webhookData.createdEvent?.data?.next?.id
      const locationData = webhookData.createdEvent?.data?.next
      
      console.log('Webhook path values:', { jtOrgId, locationId, locationData })

      if (!jtOrgId || !locationId || !locationData) {
        return NextResponse.json({
          error: 'Missing required webhook data',
          debug
        }, { status: 400 })
      }

      // Get org data from our DB
      //console.log('Fetching org data for:', jtOrgId)
      const orgsRef = collection(db, 'orgs')
      const q = query(orgsRef, where('orgID', '==', jtOrgId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('No matching organization found')
      }

      const orgDoc = querySnapshot.docs[0]
      const orgData = orgDoc.data() 
      console.log('Org data:', orgData.uid);
      // Set the values from our DB
      grantKey = orgData.grantKey
      locid = locationId
      zestimateField = orgData.zestimateField
      zestimateUrlField = orgData.zillowUrlField
      yearBuiltField = orgData.yearBuiltField
      bedBathField = orgData.bedBathField
      livingAreaField = orgData.livingAreaField
      latestSalePriceField = orgData.latestSalePriceField

      // Use the address directly from webhook data
      address = locationData.formattedAddress.replace(/(,\s*|\s+)USA$/, '').trim() as string
    } else {
      // This is from our frontend (singlerun.tsx)
      const manualRequest = webhookData as ManualRequest;
      grantKey = manualRequest.grantKey
      locid = manualRequest.locid
      zestimateField = manualRequest.zestimateField
      //notice this is zillowUrlField which is the same as webhook zstimateUrlField but I missed the typo and now we're stuck. 
      zestimateUrlField = manualRequest.zestimateUrlField
      yearBuiltField = manualRequest.yearBuiltField
      bedBathField = manualRequest.bedBathField
      livingAreaField = manualRequest.livingAreaField
      latestSalePriceField = manualRequest.latestSalePriceField
      address = manualRequest.address.replace(/(,\s*|\s+)USA$/, '').trim() as string
    }

    console.log('Pre-Bridge API call values:', { 
     jtOrgId,
     grantKey, 
     locid, 
     zestimateField, 
     zestimateUrlField, 
     yearBuiltField,
     bedBathField,
     livingAreaField,
     latestSalePriceField,
     address 
    })

    //Bridge API call using address
    console.log('Calling Bridge API with address:', address)

    const bridgeResponse = await fetch(
      `https://api.bridgedataoutput.com/api/v2/zestimates_v2/zestimates?access_token=${process.env.NEXT_PUBLIC_BRIDGE_API_TOKEN}&address=${encodeURIComponent(address || '')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(async (res) => {
      if(!res.ok) {
        throw new Error(`Bridge API responded with status: ${res.status}`);
      }
      return res.json();
    });
    
    const zestimate = bridgeResponse?.bundle?.[0]?.zestimate;
    const zestimateURL = bridgeResponse?.bundle?.[0]?.zillowUrl;

    //console.log('Bridge API response:', { zestimate, zestimateURL })

    //calling the bridge pub api 
    const bridgeResponse2 = await fetch(
      `https://api.bridgedataoutput.com/api/v2/pub/parcels?access_token=${process.env.NEXT_PUBLIC_BRIDGE_API_TOKEN}&address.full=${encodeURIComponent(address || '')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(async (res) => {
      if(!res.ok) {
        throw new Error(`Bridge API responded with status: ${res.status}`);
      }
      return res.json();
    });
    
    //console.log('Building:', bridgeResponse2?.bundle?.[0]?.building);
    //console.log('Sales items:', bridgeResponse2?.bundle?.filter((item: { salesPrice: number | null }) => item.salesPrice !== null));

    yearbuilt = bridgeResponse2?.bundle?.[0]?.building?.[0]?.yearBuilt;
    const bedrooms = bridgeResponse2?.bundle?.[0]?.building?.[0]?.bedrooms;
    const fullBaths = bridgeResponse2?.bundle?.[0]?.building?.[0]?.fullBaths;
    const halfBaths = bridgeResponse2?.bundle?.[0]?.building?.[0]?.halfBaths;

    // Calculate total bathrooms (add 0.5 for each half bath)
    const totalBathrooms = (fullBaths || 0) + ((halfBaths || 0) * 0.5);
    bedbath = `${bedrooms} bed, ${totalBathrooms} bath`;

    livingArea = bridgeResponse2?.bundle?.[0]?.areas?.find(
      (area: { type: string }) => area.type === "Zillow Calculated Finished Area"
    )?.areaSquareFeet;
    const transactionURL = bridgeResponse2?.bundle?.[0]?.transactionsUrl;

    // console.log('Bridge API response2:', { 
    //     yearbuilt, 
    //     bedrooms,
    //     bedbath,
    //     livingArea, 
    // });

    //one more bridge call for transactions
    const bridgeResponse3 = await fetch(
      `${transactionURL}?access_token=${process.env.NEXT_PUBLIC_BRIDGE_API_TOKEN}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(async (res) => {
      if(!res.ok) {
        throw new Error(`Bridge API responded with status: ${res.status}`);
      }
      return res.json();
    });

    //console.log('Bridge API response3:', bridgeResponse3);

    latestSalePrice = bridgeResponse3?.bundle
      ?.filter((item: { salesPrice: number | null }) => item.salesPrice !== null)
      ?.sort((a: { recordingDate: string }, b: { recordingDate: string }) => 
        new Date(b.recordingDate).getTime() - new Date(a.recordingDate).getTime()
      )?.[0]?.salesPrice;

    //console.log('Latest sale price:', latestSalePrice);

    // Create an object with only the fields that have values
    const updateFields: Record<string, string> = {
      locID: locid // This is required, so we'll always include it
    };

    // Only add fields if they have both a field name and a value
    if (zestimateField && zestimate) {
      updateFields.zestimateField = zestimateField;
      updateFields.zestimate = zestimate;
    }

    if (zestimateUrlField && zestimateURL) {
      updateFields.zestimateUrlField = zestimateUrlField;
      updateFields.zestimateURL = zestimateURL;
    }

    if (yearBuiltField && yearbuilt) {
      updateFields.yearBuiltField = yearBuiltField;
      updateFields.yearbuilt = yearbuilt;
    }

    if (bedBathField && bedbath) {
      updateFields.bedBathField = bedBathField;
      updateFields.bedbath = bedbath;
    }

    if (livingAreaField && livingArea) {
      updateFields.livingAreaField = livingAreaField;
      updateFields.livingArea = livingArea;
    }

    if (latestSalePriceField && latestSalePrice) {
      updateFields.latestSalePriceField = latestSalePriceField;
      updateFields.latestSalePrice = latestSalePrice;
    }

    console.log('Update fields:', updateFields);

    // Then use the filtered fields in the query
    await fetch(`https://api.jobtread.com/pave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          "$": { "grantKey": grantKey },
          ...updateLocJT(updateFields)
        }
      })
    }).then(async (res) => {
      if(!res.ok) {
        const errorBody = await res.text();
        throw new Error(`JT API Location Update responded with status: ${res.status}. Body: ${errorBody}`);
      }
      return res.json();
    });

    return NextResponse.json({ 
      success: true,
      debug 
    });

  } catch (error) {
    return NextResponse.json({
      error: (error as Error).message || 'Error processing request',
      debug: {
        errorDetails: error,
        stack: (error as Error).stack
      }
    }, { status: 500 })
  }
}