// app/api/contact/emailTemplate.ts

export function createEmailContent(email: string, subject: string, message: string) {
    return `
      <html>
        <head>
          <style>
            body { font-family: Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f4f4f4; padding: 10px; text-align: center; }
            .content { padding: 20px 0; }
            .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 0.8em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <p><strong>From:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>This is an automated message from your contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }