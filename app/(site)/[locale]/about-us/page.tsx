import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale, defaultLocale, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/constants";
import AboutUsClient from "./about-client";

interface AboutUsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutUsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const messages = await getMessages(activeLocale);
  const aboutMessages = messages?.about as { metaTitle?: string; metaDescription?: string } | undefined;

  const title = aboutMessages?.metaTitle || "About GulfRakza | Leading Industrial Supplier | Dammam, Saudi Arabia";
  const description = aboutMessages?.metaDescription || "Learn about GulfRakza - your trusted partner for industrial supplies in Dammam, Saudi Arabia.";

  const canonicalPath = `/${activeLocale}/about-us`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const languageAlternates = locales.reduce<Record<string, string>>((acc, currentLocale) => {
    acc[currentLocale] = `${siteUrl}/${currentLocale}/about-us`;
    return acc;
  }, {});
  languageAlternates["x-default"] = `${siteUrl}/about-us`;

  const localeTag = activeLocale === "ar" ? "ar_SA" : "en_US";

  return {
    title,
    description,
    keywords: [
      "about GulfRakza",
      "industrial supplier Dammam",
      "Rakzah Gulf Trading Establishment",
      "industrial supplies Saudi Arabia",
      "about us",
      "company profile",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "GulfRakza",
      locale: localeTag,
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/twitter-og-image.jpg`],
    },
  };
}

export default async function AboutUsPage({ params }: AboutUsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return <AboutUsClient />;
}
