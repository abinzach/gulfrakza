import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import FlyoutNav from "@/app/components/Navbar";
import EmailInquiry from "@/app/components/MailEnquiry";
import WhatsAppInquiry from "@/app/components/WhatsappEnquiry";
import { Footerdemo } from "@/components/ui/footer-section";
import { I18nProvider } from "@/i18n/provider";
import { getMessages, isLocale, locales } from "@/i18n/config";
import { contact, siteUrl } from "@/lib/constants";
import LocalePreferenceSync from "@/app/components/LocalePreferenceSync";
import { Analytics } from "@/app/components/Analytics";
import { CookieConsent } from "@/app/components/CookieConsent";
import { fetchCatalogData } from "@/lib/catalog";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LayoutParams = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  const common = messages.common;

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const localePrefix = `/${locale}`;

  const pathWithLocale = normalizedPath.startsWith(localePrefix)
    ? normalizedPath
    : normalizedPath === "/"
      ? localePrefix
      : `${localePrefix}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;

  const pathSuffix = pathWithLocale.slice(localePrefix.length) || "";
  const canonicalPath = pathWithLocale;

  const alternateLanguages = locales.reduce<Record<string, string>>((acc, current) => {
    const targetPath =
      pathSuffix.length > 0
        ? `/${current}${pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`}`
        : `/${current}`;
    acc[current] = `${siteUrl}${targetPath}`;
    return acc;
  }, {});
  alternateLanguages["x-default"] = `${siteUrl}${pathSuffix || "/"}`;

  return {
    title: common.brand.metaTitle,
    description: common.brand.metaDescription,
    keywords: common.metadata.keywords,
    manifest: "/site.webmanifest",
    verification: {
      google: "ZbwU2zvwMUj6zvUDKN1NnqwHt-jzSE-MZGu9K2jooeA",
    },
    alternates: {
      canonical: `${siteUrl}${canonicalPath}`,
      languages: alternateLanguages,
    },
    openGraph: {
      title: common.brand.metaTitle,
      description: common.brand.ogDescription,
      url: `${siteUrl}${canonicalPath}`,
      siteName: "GulfRakza",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: common.brand.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: common.brand.metaTitle,
      description: common.brand.twitterDescription,
      images: [`${siteUrl}/twitter-og-image.jpg`],
    },
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      ],
    },
    other: {
      "msapplication-TileColor": "#0e7490",
      "theme-color": "#0a0a0a",
    },
  };
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  const { categoryTree } = await fetchCatalogData(locale);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <Analytics />
      <CookieConsent />
      <LocalePreferenceSync locale={locale} />
      <FlyoutNav categoryTree={categoryTree} />
      {/* Skip-to-content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-neutral-950 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <WhatsAppInquiry />
      <EmailInquiry />
      <Footerdemo />
      <Script id="schema-script" type="application/ld+json">
        {JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "GulfRakza",
            "alternateName": "Rakzah Gulf Trading Establishment",
            "legalName": "Rakzah Gulf Trading Establishment",
            "description": messages.common.brand.schemaDescription,
            "url": siteUrl,
            "logo": `${siteUrl}/logo-rakza.png`,
            "image": `${siteUrl}/og-image.jpg`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "2nd Floor, Office #9, Salem Balhamer Building, Al Tubayshi District",
              "addressLocality": "Dammam",
              "addressRegion": "Eastern Province",
              "postalCode": "32233",
              "addressCountry": "SA",
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "26.4367",
              "longitude": "50.1039"
            },
            "telephone": contact.phoneMobileE164,
            "email": contact.emailPrimary,
            "priceRange": "$$",
            "areaServed": [
              {
                "@type": "City",
                "name": "Dammam",
                "description": "Primary service area - headquarters location"
              },
              {
                "@type": "City",
                "name": "Khobar"
              },
              {
                "@type": "City",
                "name": "Dhahran"
              },
              {
                "@type": "City",
                "name": "Jubail"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Eastern Province",
                "containedIn": {
                  "@type": "Country",
                  "name": "Saudi Arabia"
                }
              },
              {
                "@type": "Country",
                "name": "Saudi Arabia",
                "description": "Serving industrial customers across the Kingdom of Saudi Arabia"
              }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Industrial Supplies & Integrated Engineering Solutions",
              "itemListElement": [
                {
                  "@type": "OfferCatalog",
                  "name": "Safety Equipment & PPE",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Product",
                        "name": "Personal Protective Equipment"
                      }
                    }
                  ]
                },
                {
                  "@type": "OfferCatalog",
                  "name": "Integrated Engineering Solutions",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Scaffolding Services"
                      }
                    }
                  ]
                }
              ]
            },
            "sameAs": [
              "https://www.gulfrakza.com"
            ]
          },
          null,
          2,
        )}
      </Script>
    </I18nProvider>
  );
}
