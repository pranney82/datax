import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { address, jobId, orgId, grantKey, email } = body

    if (!address || !jobId || !orgId || !grantKey || !email) {
      await addDoc(collection(db, 'coverphotoLogs'), {
        date: new Date().toISOString(),
        email,
        status: 'error',
        error: 'Missing required parameters'
      })

      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    try {
      await main(address, jobId, orgId, grantKey, email)
      
      // Log successful execution
      await addDoc(collection(db, 'coverphotoLogs'), {
        date: new Date().toISOString(),
        email,
        status: 'success',
        address,
        jobId
      })

      return NextResponse.json({ status: 'ok' })
    } catch (error) {
      // Log error
      await addDoc(collection(db, 'coverphotoLogs'), {
        date: new Date().toISOString(),
        email,
        status: 'error',
        error: (error as Error).message,
        address,
        jobId
      })

      throw error
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
  grantKey: string,
  email: string
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
            grantKey: grantKey ? "present" : "missing",
            email
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
            uploadId,
            email
        });
        return null;
    }
};

// Main function to run both steps
const main = async (
  address: string,
  jobId: string,
  orgId: string,
  grantKey: string,
  email: string
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
    
    await updateJobTread(jobId, uploadUrlResult.uploadId, orgId, grantKey, email);
};
