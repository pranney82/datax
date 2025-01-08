import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

interface JobTreadResponse {
    createUploadRequest: {
      createdUploadRequest: {
        url: string;
        id: string;
      }
    }
  }
  
  interface UploadUrlResult {
    uploadUrl: string;
    uploadId: string;
  }

async function getOrgGrantKey(jtOrgId: string): Promise<string | null> {
  try {
    // Query orgs collection for document where orgID matches JobTread org ID
    const orgsRef = collection(db, 'orgs')
    const q = query(orgsRef, where('orgID', '==', jtOrgId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.error('No matching organization found for:', jtOrgId)
      return null
    }

    // Get the first matching document
    const orgDoc = querySnapshot.docs[0]
    return orgDoc.data()?.grantKey || null
  } catch (error) {
    console.error('Error fetching org grant key:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const webhookData = await request.json()
    const jtOrgId = webhookData.createdEvent.organization.id

    // Get the grantKey for this organization
    const grantKey = await getOrgGrantKey(jtOrgId)
    if (!grantKey) {
      await addDoc(collection(db, 'coverphotoLogs'), {
        date: new Date().toISOString(),
        status: 'error',
        error: 'Could not find matching organization',
        orgId: jtOrgId
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 400 }
      )
    }

    // Extract the required data from webhook payload
    const jobData = {
      jobId: webhookData.createdEvent.job.id,
      locationId: webhookData.createdEvent.location.id,
      orgId: webhookData.createdEvent.organization.id,
    }

    // Add null checks
    if (!jobData.jobId || !jobData.locationId || !jobData.orgId) {
      console.error('Missing required data:', jobData)
      return NextResponse.json({ 
        error: 'Missing required data',
        received: jobData 
      }, { status: 400 })
    }

    // Get the location details using the locationId
    const locationDetails = await getLocationDetails(
      jobData.locationId, 
      jobData.orgId,
      grantKey
    )

    if (!locationDetails?.address) {
      await addDoc(collection(db, 'coverphotoLogs'), {
        date: new Date().toISOString(),
        status: 'error',
        error: 'Could not retrieve location address',
        jobId: jobData.jobId,
        locationId: jobData.locationId
      })
      return NextResponse.json(
        { error: 'Could not retrieve location address' },
        { status: 400 }
      )
    }

    // Forward the processed data to the main cover photo logic
    try {
      await main(
        locationDetails.address,
        jobData.jobId,
        jobData.orgId,
        grantKey
      )
      
      await addDoc(collection(db, 'coverphotoLogs'), {
        date: new Date().toISOString(),
        status: 'success',
        address: locationDetails.address,
        jobId: jobData.jobId,
        source: 'webhook'
      })

      return NextResponse.json({ status: 'ok' })
    } catch (error) {
      await addDoc(collection(db, 'coverphotoLogs'), {
        date: new Date().toISOString(),
        status: 'error',
        error: (error as Error).message,
        jobId: jobData.jobId,
        source: 'webhook'
      })

      throw error
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getLocationDetails(locationId: string, orgId: string, grantKey: string) {
  // First query to get location details
  const locationQuery = {
    query: {
      "$": { "grantKey": grantKey },
      "organization": {
        "$": { "id": orgId }
      },
      "location": {
        "$": { "id": locationId },
        "formattedAddress": {}
      }
    }
  }

  try {
    const response = await fetch('https://api.jobtread.com/pave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationQuery)
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch location details: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Location API response:', data)

    // Check if we have the formatted address
    const formattedAddress = data?.location?.formattedAddress
    if (!formattedAddress) {
      throw new Error('Location formatted address missing')
    }

    return {
      address: formattedAddress
    }
  } catch (error) {
    console.error('Error fetching location details:', error)
    return null
  }
}

// Step 1: Fetch the Google Street View image
const getStreetViewImage = async ( address: string ): Promise<Uint8Array | null> => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${address}&key=${apiKey}&fov=70`;
  
    try {
      const response = await fetch(streetViewUrl);
      //console.log("response: ", response);
      if (!response.ok) {
        throw new Error(`Error fetching Street View image: ${response.statusText}`);
      }
  
      // Convert response to a buffer
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
  
      // Log the file size for verification
      console.log(`Fetched Street View image of size: ${uint8Array.length} bytes`);
  
      return uint8Array;
    } catch (error) {
      console.error("Error fetching Google Street View image:", error);
      return null;
    }
  };

// Step 2: Upload the image to JobTread
const uploadToJobTread = async (
    imageBuffer: Uint8Array, 
    jtGoogleUploadUrl: string
  ): Promise<boolean> => {
      if (!imageBuffer) {
          console.error("No image buffer to upload.");
          return false;
      }
  
      try {
          const response = await fetch(jtGoogleUploadUrl, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'image/png',
                  'x-goog-content-length-range': `${imageBuffer.length},${imageBuffer.length}`
              },
              body: imageBuffer
          });
  
          if (!response.ok) {
              const errorText = await response.text();
              console.error('Error response:', errorText);
              return false;
          }
  
          console.log("File uploaded successfully to JobTread.");
          return true;
      } catch (error) {
          console.error("Error uploading to Google:", error);
          return false;
      }
  };
  
  // Step 3: Get the JobTread query URL
  const getJobTreadQueryUrl = async (
    fileSize: number, 
    orgId: string, 
    grantKey: string
  ): Promise<UploadUrlResult | null> => {
      const query = {
          query: {
              "$": { "grantKey": grantKey },
              "createUploadRequest": {
                  "$": {
                      "organizationId": orgId,
                      "type": "image/png",
                      "size": fileSize
                  },
                  "createdUploadRequest": {
                      "id": {},
                      "url": {},
                      "downloadUrl": {},
                      "headers": {}
                  }
              }
          }
      };
      
      try {
          const response = await fetch('https://api.jobtread.com/pave', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(query)
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json() as JobTreadResponse;
          console.log("JT response: ", data);
  
          const uploadUrl = data.createUploadRequest.createdUploadRequest.url;
          const uploadId = data.createUploadRequest.createdUploadRequest.id;
          return { uploadUrl, uploadId };
      } catch (error) {
          console.error("Error fetching JobTread upload URL: ", error);
          return null;
      }
  };
  
  // Step 4: Update job in JobTread
  const updateJobTread = async (
    jobId: string, 
    uploadId: string, 
    orgId: string, 
    grantKey: string
  ): Promise<JobTreadResponse | null> => {
      const query = {
          query: {
              "$": { "grantKey": grantKey },
              "organization": {
                  "$": {
                      "id": orgId
                  }
              },
              "updateJob": {
                  "$": {
                      "coverPhoto": {
                          "uploadRequestId": uploadId
                      },
                      "id": jobId
                  },
                  "job": {
                      "coverPhotoUrl": {},
                      "id": {},
                      "name": {},
                      "$": {
                          "id": jobId
                      }
                  }
              }
          }
      };
      
      try {
          console.log("Attempting to update JobTread with:", {
              jobId,
              uploadId,
              orgId,
              grantKey: grantKey ? "present" : "missing"
          });
  
          const response = await fetch('https://api.jobtread.com/pave', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(query)
          });
  
          if (!response.ok) {
              const errorText = await response.text();
              console.error("JobTread update failed:", {
                  status: response.status,
                  statusText: response.statusText,
                  responseBody: errorText,
                  endpoint: 'https://api.jobtread.com/pave'
              });
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log("JobTread update successful:", data);
          return data;
      } catch (error) {
          console.error("Error updating job in JobTread:", {
              error: (error as Error).message,
              stack: (error as Error).stack,
              jobId,
              uploadId
          });
          return null;
      }
  };
  
  // Main function to run both steps
  const main = async (
    address: string,
    jobId: string,
    orgId: string,
    grantKey: string
  ): Promise<void> => {
      const imageBuffer = await getStreetViewImage(address);
      if (!imageBuffer) {
        throw new Error('Failed to fetch Street View image');
      }
    
      const uploadUrlResult = await getJobTreadQueryUrl(imageBuffer.length, orgId, grantKey);
      if (!uploadUrlResult) {
        throw new Error('Failed to get upload URL');
      }
    
      const uploadSuccess = await uploadToJobTread(imageBuffer, uploadUrlResult.uploadUrl);
      if (!uploadSuccess) {
        throw new Error('Failed to upload image');
      }
      
      await updateJobTread(jobId, uploadUrlResult.uploadId, orgId, grantKey);
  };
  