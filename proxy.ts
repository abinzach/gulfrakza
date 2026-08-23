import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar"] as const;
const defaultLocale = "en";
const localeCookieName = "locale";

type Locale = (typeof locales)[number];

function extractLocaleFromPath(pathname: string): Locale | null {
  const potential = pathname.split("/")[1];
  return locales.includes(potential as Locale) ? (potential as Locale) : null;
}

function resolvePreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  return cookieLocale && locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeFromPath = extractLocaleFromPath(pathname);

  if (!localeFromPath) {
    const preferredLocale = resolvePreferredLocale(request);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${preferredLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|studio|.*\\..*).*)"],
};
