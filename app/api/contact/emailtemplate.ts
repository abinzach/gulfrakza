// app/api/contact/emailTemplate.ts

export function createEmailContent(email: string, subject: string, message: string, formType: 'contact' | 'quote' = 'contact') {
    const heading = formType === 'quote' ? 'New Quote Request' : 'Contact Form Submission';
    const introText = formType === 'quote' 
      ? 'A new quote request has been submitted through the website.'
      : 'A new message has been submitted through the contact form.';
    
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${heading}</title>
          <style>
            /* Base styles */
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #1d1d1f;
              background-color: #f5f5f7;
              margin: 0;
              padding: 0;
            }
            
            /* Container */
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            }
            
            /* Header */
            .header {
              background: linear-gradient(135deg, #0891b2, #0e7490);
              padding: 30px 10px;
              text-align: center;
              color: white;
            }
            
            .logo {
              margin-bottom: 15px;
            }
            
            .header h1 {
              margin: 0;
              font-weight: 600;
              font-size: 24px;
              letter-spacing: -0.5px;
            }
            
            /* Content */
            .content {
              padding: 30px;
              background-color: #ffffff;
            }
            
            .message-container {
              background-color: #f5f5f7;
              border-radius: 8px;
              padding: 20px;
              margin-top: 20px;
            }
            
            .field {
              margin-bottom: 15px;
            }
            
            .field-label {
              font-weight: 600;
              font-size: 14px;
              color: #6e6e73;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            
            .field-value {
              font-size: 16px;
              color: #1d1d1f;
            }
            
            /* Footer */
            .footer {
              background-color: #f5f5f7;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #86868b;
              border-top: 1px solid #e5e5e7;
            }
            
            /* Responsive */
            @media only screen and (max-width: 620px) {
              .container {
                width: 100% !important;
                border-radius: 0;
              }
              
              .content {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div style="padding: 20px;">
            <div class="container">
              <div class="header">
               
                <h1>${heading}</h1>
              </div>
              
              <div class="content">
                <p style="font-size: 16px; color: #1d1d1f; margin-top: 0;">
                  ${introText}
                </p>
                
                <div class="field">
                  <div class="field-label">From</div>
                  <div class="field-value">${email}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Subject</div>
                  <div class="field-value">${subject}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Message</div>
                  <div class="message-container">
                    <div class="field-value">${message.replace(/\\n/g, '<br>')}</div>
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <p>
                  &copy; ${new Date().getFullYear()} Gulf Rakza. All rights reserved.<br>
                  This is an automated message for Charlie Varga. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }