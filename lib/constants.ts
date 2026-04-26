export const siteUrl = "https://www.gulfrakza.com"
export const localeCookieName = "locale"
export const localePreferenceStorageKey = "preferredLocale"
export const localeSwitchScrollStorageKey = "localeSwitchScrollY"

// ---------------------------------------------------------------------------
// Single source of truth for company contact information.
// Update values here and they propagate to navbar, footer, FABs, modals,
// schema.org JSON-LD, and the contact API.
// ---------------------------------------------------------------------------
export const contact = {
  // Sales / general inquiries email — primary public address
  emailPrimary: "info@gulfrakza.com",
  emailSales: "sales@gulfrakza.com",
  emailPrivacy: "privacy@gulfrakza.com",

  // Saudi mobile number used for WhatsApp + the "Call us" CTA
  // E.164 format (no spaces) for `tel:` and WhatsApp URLs
  phoneMobileE164: "+966557197311",
  phoneMobileDisplay: "+966 55 719 7311",

  // Landline (printed in the footer)
  phoneLandlineE164: "+966138816957",
  phoneLandlineDisplay: "+966 13 881 6957",
} as const
