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

    let grantKey, locid, zestimateField, zestimateUrlField, address, jtOrgId

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
      address = manualRequest.address.replace(/(,\s*|\s+)USA$/, '').trim() as string
    }

    console.log('Pre-Bridge API call values:', { 
     jtOrgId,
     grantKey, 
     locid, 
     zestimateField, 
     zestimateUrlField, 
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

    console.log('Bridge API response:', { zestimate, zestimateURL })
    console.log('JT API call values:', { grantKey, locid, zestimateField, zestimateUrlField, zestimate, zestimateURL })
    // Update location in JT
    await fetch(`https://api.jobtread.com/pave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          "$": { "grantKey": grantKey },
          ...updateLocJT({ 
            locID: locid, 
            zestimateField, 
            zestimate: zestimate || '', 
            zestimateUrlField, 
            zestimateURL: zestimateURL || ''
          })
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