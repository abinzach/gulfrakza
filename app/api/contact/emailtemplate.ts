// app/api/contact/emailtemplate.ts

interface EmailContentInput {
  email: string;
  subject: string;
  message: string;
  fullName?: string;
  phone?: string;
  formType?: 'contact' | 'quote';
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatMultiline = (value: string): string =>
  escapeHtml(value).replace(/\r?\n/g, '<br>');

export function createEmailContent({
  email,
  subject,
  message,
  fullName,
  phone,
  formType = 'contact',
}: EmailContentInput): string {
  const heading =
    formType === 'quote' ? 'New Quote Request' : 'Contact Form Submission';
  const introText =
    formType === 'quote'
      ? 'A new quote request has been submitted through the website.'
      : 'A new message has been submitted through the contact form.';

  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeName = fullName ? escapeHtml(fullName) : '';
  const safePhone = phone ? escapeHtml(phone) : '';
  const safeMessage = formatMultiline(message);

  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${heading}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #1d1d1f;
              background-color: #f5f5f7;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            }
            .header {
              background: linear-gradient(135deg, #08778c, #0f5f70);
              padding: 30px 10px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-weight: 600;
              font-size: 24px;
              letter-spacing: -0.5px;
            }
            .content {
              padding: 30px;
              background-color: #ffffff;
            }
            .message-container {
              background-color: #f5f5f7;
              border-radius: 8px;
              padding: 20px;
              margin-top: 8px;
            }
            .field {
              margin-bottom: 16px;
            }
            .field-label {
              font-weight: 600;
              font-size: 12px;
              color: #6e6e73;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            }
            .field-value {
              font-size: 16px;
              color: #1d1d1f;
              word-break: break-word;
            }
            .footer {
              background-color: #f5f5f7;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #86868b;
              border-top: 1px solid #e5e5e7;
            }
            @media only screen and (max-width: 620px) {
              .container { width: 100% !important; border-radius: 0; }
              .content { padding: 20px; }
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

                ${
                  safeName
                    ? `<div class="field">
                        <div class="field-label">From</div>
                        <div class="field-value">${safeName} &lt;${safeEmail}&gt;</div>
                      </div>`
                    : `<div class="field">
                        <div class="field-label">From</div>
                        <div class="field-value">${safeEmail}</div>
                      </div>`
                }

                ${
                  safePhone
                    ? `<div class="field">
                        <div class="field-label">Phone</div>
                        <div class="field-value">${safePhone}</div>
                      </div>`
                    : ''
                }

                <div class="field">
                  <div class="field-label">Subject</div>
                  <div class="field-value">${safeSubject}</div>
                </div>

                <div class="field">
                  <div class="field-label">Message</div>
                  <div class="message-container">
                    <div class="field-value">${safeMessage}</div>
                  </div>
                </div>
              </div>
              <div class="footer">
                <p>
                  &copy; ${new Date().getFullYear()} Gulf Rakza. All rights reserved.<br>
                  This is an automated notification from gulfrakza.com — please reply directly to this email to respond to the sender.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
}
