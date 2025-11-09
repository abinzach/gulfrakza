import { notFound } from "next/navigation";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export async function getMessages(locale: Locale) {
  switch (locale) {
    case "en":
      return (await import("@/messages/en")).default;
    case "ar":
      return (await import("@/messages/ar")).default;
    default:
      notFound();
  }
}
