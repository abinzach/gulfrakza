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

const siteUrl = "https://www.gulfrakza.com";

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

  const headersList = headers();
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
  alternateLanguages["x-default"] = `${siteUrl}${canonicalPath}`;

  return {
    title: common.brand.metaTitle,
    description: common.brand.metaDescription,
    keywords: common.metadata.keywords,
    manifest: "/site.webmanifest",
    verification: {
      google: "yOVCMHesyWms8TWeRX-79cIke_xi-07BdN_cfV25MeI",
    },
    alternates: {
      canonical: `${siteUrl}${canonicalPath}`,
      languages: alternateLanguages,
    },
    openGraph: {
      title: common.brand.metaTitle,
      description: common.brand.ogDescription,
      url: `${siteUrl}${canonicalPath}`,
      siteName: "Rakzah Gulf Trading Establishment",
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
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" }],
    },
    other: {
      "msapplication-TileColor": "#da532c",
      "theme-color": "#ffffff",
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

  return (
    <I18nProvider locale={locale} messages={messages}>
      <FlyoutNav />
      <main>{children}</main>
      <WhatsAppInquiry />
      <EmailInquiry />
      <Footerdemo />
      <Script id="schema-script" type="application/ld+json">
        {JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Rakzah Gulf Trading Establishment",
            "description": messages.common.brand.schemaDescription,
            "url": siteUrl,
            "logo": `${siteUrl}/logo.png`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "2nd Floor, Salem Balhamer Building, Al Tubayshi District",
              "addressLocality": "Dammam",
              "postalCode": "32416",
              "addressCountry": "SA",
            },
            "telephone": "+966558975494",
            "email": "sales@gulfrakza.com",
          },
          null,
          2,
        )}
      </Script>
    </I18nProvider>
  );
}
