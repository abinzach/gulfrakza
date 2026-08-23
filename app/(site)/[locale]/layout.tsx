import type { Metadata } from "next";
import { Suspense } from "react";
import { Hanken_Grotesk, Inter, Raleway } from "next/font/google";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import FlyoutNav from "@/app/components/Navbar";
import EmailInquiry from "@/app/components/MailEnquiry";
import WhatsAppInquiry from "@/app/components/WhatsappEnquiry";
import { Footerdemo } from "@/components/ui/footer-section";
import { I18nProvider } from "@/i18n/provider";
import { getDirection, getMessages, isLocale, locales } from "@/i18n/config";
import { contact, siteUrl } from "@/lib/constants";
import LocalePreferenceSync from "@/app/components/LocalePreferenceSync";
import { Analytics } from "@/app/components/Analytics";
import { CookieConsent } from "@/app/components/CookieConsent";
import { fetchCatalogData } from "@/lib/catalog";
import { serializeJsonLd } from "@/lib/seo/json-ld";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const hanken = Hanken_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-hanken" });

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

  const alternateLanguages = locales.reduce<Record<string, string>>((acc, current) => {
    acc[current] = `${siteUrl}/${current}`;
    return acc;
  }, {});
  alternateLanguages["x-default"] = `${siteUrl}/en`;

  return {
    metadataBase: new URL(siteUrl),
    title: common.brand.metaTitle,
    description: common.brand.metaDescription,
    keywords: common.metadata.keywords,
    manifest: "/site.webmanifest",
    verification: {
      google: "ZbwU2zvwMUj6zvUDKN1NnqwHt-jzSE-MZGu9K2jooeA",
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      title: common.brand.metaTitle,
      description: common.brand.ogDescription,
      url: `${siteUrl}/${locale}`,
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
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    other: {
      "msapplication-TileColor": "#0bbfe0",
      "theme-color": "#0bbfe0",
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
  const dir = getDirection(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={`${inter.variable} ${raleway.variable} ${hanken.variable}`}>
      <body className={`${inter.className} bg-white`}>
      <I18nProvider locale={locale} messages={messages}>
      <Analytics />
      <CookieConsent />
      <LocalePreferenceSync locale={locale} />
      <Suspense
        fallback={
          <nav aria-label="Primary" className="fixed top-0 z-50 w-full bg-neutral-950 px-6 py-4 text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <a href={`/${locale}`} className="text-xl font-semibold">GULFRAKZA</a>
              <div className="flex gap-5 text-sm font-medium">
                <a href={`/${locale}/services`}>{messages.common.nav.services}</a>
                <a href={`/${locale}/products`}>{messages.common.nav.products}</a>
              </div>
            </div>
          </nav>
        }
      >
        <FlyoutNav categoryTree={categoryTree} />
      </Suspense>
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
      <script
        id="schema-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${siteUrl}/#organization`,
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
              "latitude": 26.4367,
              "longitude": 50.1039
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
              "https://www.linkedin.com/company/gulfrakza/"
            ]
          },
          ),
        }}
      />
      </I18nProvider>
      </body>
    </html>
  );
}
