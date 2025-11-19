import React from "react";
import type { Metadata } from "next";

import { getMessages, isLocale, type Locale, defaultLocale, locales } from "@/i18n/config";
import { getCategories } from "@/lib/services";
import ServicesListingClient from "./services-listing-client";
import { siteUrl } from "@/lib/constants";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

const defaultHeroHeading = "Industrial Services & Solutions across the GCC";
const defaultHeroDescription =
  "Explore turnkey safety, cathodic protection, HVAC, and civil contracting services engineered for energy, infrastructure, and industrial operators.";
const defaultSectionHeading = "Our Service Offerings";
const defaultMetaTitle = "Industrial Services & Contracting | Gulf Rakza Trading";
const defaultMetaDescription =
  "Discover Gulf Rakza Trading’s comprehensive industrial services portfolio: safety, access, HVAC, corrosion protection, civil works, and more tailored for Saudi Arabia and the GCC.";

type ServicesSectionMessages = {
  heroHeading?: string;
  heroDescription?: string;
  sectionHeading?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const messages = await getMessages(activeLocale);
  const servicesSection = messages?.home?.services as ServicesSectionMessages | undefined;

  const heroHeading = servicesSection?.heroHeading || defaultHeroHeading;
  const heroDescription = servicesSection?.heroDescription || defaultHeroDescription;
  const title = servicesSection?.metaTitle || defaultMetaTitle || heroHeading;
  const description = servicesSection?.metaDescription || defaultMetaDescription || heroDescription;

  const canonicalPath = `/${activeLocale}/services`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const languageAlternates = locales.reduce<Record<string, string>>((acc, currentLocale) => {
    acc[currentLocale] = `${siteUrl}/${currentLocale}/services`;
    return acc;
  }, {});
  languageAlternates["x-default"] = `${siteUrl}/en/services`;

  const localeTag = activeLocale === "ar" ? "ar_SA" : "en_US";

  return {
    title,
    description,
    keywords: [
      "industrial services",
      "Gulf Rakza services",
      "safety services Saudi Arabia",
      "cathodic protection solutions",
      "industrial maintenance GCC",
      "civil contracting Saudi Arabia",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Gulf Rakza Trading",
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

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const messages = await getMessages(activeLocale);
  
  const categories = getCategories(activeLocale);

  // Extract localized hero text
  const servicesSection = messages?.home?.services as ServicesSectionMessages | undefined;
  const heroHeading = servicesSection?.heroHeading || defaultHeroHeading;
  const heroDescription = servicesSection?.heroDescription || defaultHeroDescription;
  const sectionHeading = servicesSection?.sectionHeading || defaultSectionHeading;

  return (
    <ServicesListingClient 
      categories={categories}
      heroHeading={heroHeading}
      heroDescription={heroDescription}
      sectionHeading={sectionHeading}
    />
  );
}
