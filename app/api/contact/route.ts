// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createEmailContent } from './emailtemplate';
import { contact } from '@/lib/constants';

// Hard limits to mitigate abuse / header injection
const MAX_EMAIL_LEN = 320;
const MAX_SUBJECT_LEN = 200;
const MAX_MESSAGE_LEN = 5000;
const MAX_NAME_LEN = 200;
const MAX_PHONE_LEN = 32;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const MIN_FORM_AGE_MS = 2500;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const getClientIp = (req: NextRequest): string => {
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return (
    forwardedFor ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  );
};

const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  existing.count += 1;
  return true;
};

const pruneRateLimits = () => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
};

// Strip CR/LF (and other control chars) so user input cannot inject email headers
const sanitizeHeader = (value: unknown, maxLen: number): string => {
  if (typeof value !== 'string') return '';
  return value.replace(/[\r\n\t\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLen);
};

const sanitizeBody = (value: unknown, maxLen: number): string => {
  if (typeof value !== 'string') return '';
  return value.slice(0, maxLen);
};

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON payload.' },
      { status: 400 },
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const raw = body as Record<string, unknown>;

  const email = sanitizeHeader(raw.email, MAX_EMAIL_LEN);
  const subject = sanitizeHeader(raw.subject, MAX_SUBJECT_LEN);
  const message = sanitizeBody(raw.message, MAX_MESSAGE_LEN);
  const fullName = sanitizeHeader(raw.fullName, MAX_NAME_LEN);
  const phone = sanitizeHeader(raw.phone, MAX_PHONE_LEN);
  const formStartedAt = typeof raw.formStartedAt === 'number' ? raw.formStartedAt : null;
  const formType: 'contact' | 'quote' =
    raw.formType === 'quote' ? 'quote' : 'contact';

  pruneRateLimits();
  const clientIp = getClientIp(req);
  const rateLimitKey = `${clientIp}:${email || 'anonymous'}`;
  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again in a minute.' },
      { status: 429 },
    );
  }

  if (
    formStartedAt !== null &&
    Number.isFinite(formStartedAt) &&
    Date.now() - formStartedAt < MIN_FORM_AGE_MS
  ) {
    // Pretend success so scripted submissions do not get a useful signal.
    return NextResponse.json({ success: true }, { status: 200 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, message: 'A valid email address is required.' },
      { status: 400 },
    );
  }
  if (!subject) {
    return NextResponse.json(
      { success: false, message: 'Subject is required.' },
      { status: 400 },
    );
  }
  if (!message) {
    return NextResponse.json(
      { success: false, message: 'Message is required.' },
      { status: 400 },
    );
  }

  // Honeypot field — bots will populate it; humans never see it
  if (typeof raw.website === 'string' && raw.website.length > 0) {
    // Pretend success so bots don't retry
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const smtpUser = process.env.EMAIL_USER || process.env.EMAIL;
  const smtpPass = process.env.EMAIL_PASSWORD || process.env.PASSWORD;

  if (!smtpUser || !smtpPass) {
    console.error('Contact API: SMTP credentials are not configured.');
    return NextResponse.json(
      { success: false, message: 'Mail service is currently unavailable.' },
      { status: 503 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subjectPrefix =
    formType === 'quote'
      ? `Quote Request from ${email}`
      : `New message from ${email}`;

  const mailOptions = {
    from: smtpUser, // authenticated mailbox; do NOT use untrusted user input
    replyTo: email, // so "Reply" goes back to the lead
    to: contact.emailPrimary,
    subject: `${subjectPrefix}: ${subject}`,
    html: createEmailContent({
      email,
      subject,
      message,
      fullName,
      phone,
      formType,
    }),
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact API send error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message. Please try again later.' },
      { status: 500 },
    );
  }
}

export const runtime = 'nodejs';
