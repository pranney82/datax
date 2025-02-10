import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'

interface WebhookPayload {
  event: string
  job: {
    id: string
    name: string
    total: number
    invoice?: string
    location: {
      formattedAddress?: string
      account?: {
        name?: string
      }
    }
    customer?: {
      name?: string
    }
  }
  organization: {
    id: string
  }
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as WebhookPayload
    
    // Extract job information
    const {
      job: { 
        id: jobId, 
        name: projectName,
        total: contractSum,
        location,
        customer
      },
      organization: { id: orgId }
    } = payload

    // Format the AIA form data
    const formData = {
      owner: customer?.name || '',
      contractor: location?.account?.name || '',
      project: projectName,
      architect: '',  // Could be added as a custom field in JobTread
      applicationNo: '1',  // Could be incremented based on previous applications
      periodTo: new Date().toISOString().split('T')[0],
      projectNos: jobId,
      contractDate: new Date().toISOString().split('T')[0],
      contractFor: 'Construction Services',
      originalContractSum: contractSum.toFixed(2),
      changeOrders: '0.00',
      contractSumToDate: contractSum.toFixed(2),
      totalCompletedStored: contractSum.toFixed(2),
      retainagePercentage: '10',
      retainageAmount: (contractSum * 0.1).toFixed(2),
      totalEarnedLessRetainage: (contractSum * 0.9).toFixed(2),
      previousCertificates: '0.00',
      currentPaymentDue: (contractSum * 0.9).toFixed(2),
      balanceToFinish: (contractSum * 0.1).toFixed(2),
    }

    // Generate PDF
    const browser = await puppeteer.launch({
      headless: true
    })
    
    const page = await browser.newPage()
    
    await page.setViewport({
      width: 816,
      height: 1056,
      deviceScaleFactor: 2
    })

    // Generate the HTML content
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              margin: 0;
              padding: 40px;
            }
            .header {
              text-align: center;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
            }
            .value {
              border-bottom: 1px solid black;
              padding: 4px 0;
            }
            .section {
              border: 1px solid black;
              padding: 20px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>APPLICATION AND CERTIFICATE FOR PAYMENT</div>
            <div>AIA DOCUMENT G702</div>
          </div>
          
          <div class="grid">
            <div>
              <div class="label">TO OWNER:</div>
              <div class="value">${formData.owner}</div>
            </div>
            <div>
              <div class="label">PROJECT:</div>
              <div class="value">${formData.project}</div>
            </div>
            <div>
              <div class="label">FROM CONTRACTOR:</div>
              <div class="value">${formData.contractor}</div>
            </div>
            <div>
              <div class="label">VIA ARCHITECT:</div>
              <div class="value">${formData.architect}</div>
            </div>
          </div>

          <div class="section">
            <div class="label">CONTRACTOR'S APPLICATION FOR PAYMENT</div>
            <div style="margin: 10px 0;">
              Application is made for payment, as shown below, in connection with the Contract.
              Continuation Sheet, AIA Document G703, is attached.
            </div>

            <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px;">
              <div class="label">1. ORIGINAL CONTRACT SUM</div>
              <div class="value">$${formData.originalContractSum}</div>

              <div class="label">2. Net change by Change Orders</div>
              <div class="value">$${formData.changeOrders}</div>

              <div class="label">3. CONTRACT SUM TO DATE</div>
              <div class="value">$${formData.contractSumToDate}</div>

              <div class="label">4. TOTAL COMPLETED & STORED TO DATE</div>
              <div class="value">$${formData.totalCompletedStored}</div>

              <div class="label">5. RETAINAGE</div>
              <div class="value">${formData.retainagePercentage}% = $${formData.retainageAmount}</div>

              <div class="label">6. TOTAL EARNED LESS RETAINAGE</div>
              <div class="value">$${formData.totalEarnedLessRetainage}</div>

              <div class="label">7. LESS PREVIOUS CERTIFICATES FOR PAYMENT</div>
              <div class="value">$${formData.previousCertificates}</div>

              <div class="label">8. CURRENT PAYMENT DUE</div>
              <div class="value">$${formData.currentPaymentDue}</div>

              <div class="label">9. BALANCE TO FINISH, INCLUDING RETAINAGE</div>
              <div class="value">$${formData.balanceToFinish}</div>
            </div>
          </div>
        </body>
      </html>
    `

    await page.setContent(html, {
      waitUntil: 'networkidle0'
    })

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.4in',
        right: '0.4in',
        bottom: '0.4in',
        left: '0.4in'
      }
    })

    await browser.close()

    console.log('Processing AIA billing for job:', { jobId, projectName, invoice: payload.job.invoice })

    // Log the operation
    await addDoc(collection(db, 'aiabillingLogs'), {
      date: new Date().toISOString(),
      status: 'success',
      jobId,
      invoice: payload.job.invoice || 'N/A',
      email: payload.organization.id // Using org ID as identifier
    })

    // Get organization's grantKey from Firebase
    const orgDoc = await getDoc(doc(db, 'orgs', orgId))
    if (!orgDoc.exists()) {
      throw new Error('Organization not found')
    }

    const orgData = orgDoc.data()
    const grantKey = orgData.grantKey

    if (!grantKey) {
      throw new Error('Organization grantKey not found')
    }

    // Upload PDF to JobTread via Pave API
    try {
      const formData = new FormData()
      formData.append('file', new Blob([pdf], { type: 'application/pdf' }), `AIA_G702_${jobId}.pdf`)
      
      const uploadResponse = await fetch('https://api.jobtread.com/pave', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${grantKey}`,
        },
        // Don't set Content-Type header, let the browser set it with the boundary
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload PDF to JobTread')
      }

      return new NextResponse('Webhook processed and PDF uploaded successfully', { status: 200 })
    } catch (uploadError) {
      console.error('Error uploading PDF:', uploadError)
      throw uploadError // This will be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    
    // Log the error if we have job information
    try {
      const payload = await req.json() as WebhookPayload
      await addDoc(collection(db, 'aiabillingLogs'), {
        date: new Date().toISOString(),
        status: 'failed',
        jobId: payload.job?.id || 'unknown',
        invoice: payload.job?.invoice || 'unknown',
        email: payload.organization?.id || 'unknown',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
    } catch (logError) {
      console.error('Error logging failure:', logError)
    }

    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}