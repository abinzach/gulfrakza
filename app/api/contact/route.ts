// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createEmailContent } from './emailtemplate';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, subject, message, formType = 'contact' } = body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: "info@gulfrakza.com",
    subject: formType === 'quote' 
      ? `Quote Request from ${email}: ${subject}`
      : `New message from ${email}: ${subject}`,
    html: createEmailContent(email, subject, message, formType), // Pass formType to the template
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
export const runtime = 'nodejs';