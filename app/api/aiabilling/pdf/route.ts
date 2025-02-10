import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(req: Request) {
  try {
    const formData = await req.json()
    
    const browser = await puppeteer.launch({
      headless: true
    })
    
    const page = await browser.newPage()
    
    // Set the viewport to letter size (8.5" x 11")
    await page.setViewport({
      width: 816, // 8.5 inches at 96 DPI
      height: 1056, // 11 inches at 96 DPI
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
              <div class="value">${formData.originalContractSum}</div>

              <div class="label">2. Net change by Change Orders</div>
              <div class="value">${formData.changeOrders}</div>

              <div class="label">3. CONTRACT SUM TO DATE</div>
              <div class="value">${formData.contractSumToDate}</div>

              <div class="label">4. TOTAL COMPLETED & STORED TO DATE</div>
              <div class="value">${formData.totalCompletedStored}</div>

              <div class="label">5. RETAINAGE</div>
              <div class="value">${formData.retainagePercentage}% = ${formData.retainageAmount}</div>

              <div class="label">6. TOTAL EARNED LESS RETAINAGE</div>
              <div class="value">${formData.totalEarnedLessRetainage}</div>

              <div class="label">7. LESS PREVIOUS CERTIFICATES FOR PAYMENT</div>
              <div class="value">${formData.previousCertificates}</div>

              <div class="label">8. CURRENT PAYMENT DUE</div>
              <div class="value">${formData.currentPaymentDue}</div>

              <div class="label">9. BALANCE TO FINISH, INCLUDING RETAINAGE</div>
              <div class="value">${formData.balanceToFinish}</div>
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

    // Return the PDF with appropriate headers
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=AIA_G702.pdf'
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}