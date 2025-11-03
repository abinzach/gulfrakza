import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar"] as const;
const defaultLocale = "en";
const localeCookieName = "locale";

type Locale = (typeof locales)[number];

const appendVaryForAcceptLanguage = (response: NextResponse) => {
  const existing = response.headers.get("Vary");
  if (!existing) {
    response.headers.set("Vary", "Accept-Language");
    return;
  }
  if (!existing.split(",").map((value) => value.trim()).includes("Accept-Language")) {
    response.headers.set("Vary", `${existing}, Accept-Language`);
  }
};

function extractLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split("/");
  const potential = segments[1];
  return locales.includes(potential as Locale) ? (potential as Locale) : null;
}

function getLocaleFromHeader(headerValue: string | null): Locale | null {
  if (!headerValue) return null;

  const candidates = headerValue
    .split(",")
    .map((part) => {
      const [tagPart, qPart] = part.trim().split(";q=");
      const tag = tagPart?.toLowerCase();
      const q = qPart ? Number.parseFloat(qPart) : 1;
      return { tag, q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const candidate of candidates) {
    if (!candidate.tag) continue;
    const base = candidate.tag.split("-")[0];
    if (locales.includes(base as Locale)) {
      return base as Locale;
    }
  }

  return null;
}

function resolvePreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const headerLocale = getLocaleFromHeader(
    request.headers.get("accept-language")
  );
  if (headerLocale) {
    return headerLocale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  const localeFromPath = extractLocaleFromPath(pathname);

  if (!localeFromPath) {
    const preferredLocale = resolvePreferredLocale(request);
    const normalizedPath = pathname === "/" ? "" : pathname;
    const redirectURL = new URL(
      `/${preferredLocale}${normalizedPath}`,
      request.url
    );
    redirectURL.search = nextUrl.search;
    redirectURL.hash = nextUrl.hash;
    const response = NextResponse.redirect(redirectURL);
    appendVaryForAcceptLanguage(response);
    response.headers.set("x-pathname", pathname);
    return response;
  }

  const response = NextResponse.next();

  appendVaryForAcceptLanguage(response);

  // Add pathname to headers so root layout can access it
  response.headers.set("x-pathname", pathname);
  
  const existingCookie = request.cookies.get(localeCookieName)?.value;

  if (existingCookie !== localeFromPath) {
    response.cookies.set(localeCookieName, localeFromPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, studio)
    "/((?!api|_next|studio|.*\\..*).*)",
  ],
};
