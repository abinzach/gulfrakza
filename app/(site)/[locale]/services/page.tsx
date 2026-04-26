import React from "react";
import type { Metadata } from "next";

import { getMessages, isLocale, type Locale, defaultLocale, locales } from "@/i18n/config";
import { fetchServiceCategories, type ServiceCategory } from "@/lib/services-sanity";
import { getCategories as getLocalServiceCategories } from "@/lib/services";
import ServicesListingClient from "./services-listing-client";
import { siteUrl } from "@/lib/constants";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

const defaultHeroHeading = "Integrated Engineering Solutions";
const defaultHeroDescription =
  "Field-ready engineering support for industrial projects, shutdowns, infrastructure works, and facility operations across Saudi Arabia.";
const defaultSectionHeading = "Integrated Engineering Solutions";
const defaultMetaTitle = "Integrated Engineering Solutions | Scaffolding, Fabrication | GulfRakza Dammam";
const defaultMetaDescription =
  "GulfRakza delivers integrated engineering solutions in Dammam, Saudi Arabia: scaffolding, steel fabrication, civil works, rope access, safety training, cathodic protection, HVAC, and mechanical support.";

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
  languageAlternates["x-default"] = `${siteUrl}/services`;

  const localeTag = activeLocale === "ar" ? "ar_SA" : "en_US";

  return {
    title,
    description,
    keywords: [
      "industrial services Dammam",
      "scaffolding services Saudi Arabia",
      "steel fabrication Dammam",
      "rope access services Eastern Province",
      "civil works Dammam",
      "safety training Saudi Arabia",
      "industrial contracting GCC",
      "PEB shed fabrication Dammam",
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

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const messages = await getMessages(activeLocale);

  // Services are now sourced from Sanity so the Studio can add/edit/reorder
  // categories and their child services without code changes.
  let categories: ServiceCategory[] = [];
  try {
    categories = await fetchServiceCategories(activeLocale);
  } catch {
    // ignore and fall back to local JSON below
  }
  if (categories.length === 0) {
    // If Sanity is empty (fresh project), fall back to the existing local JSON
    // so the /services page never becomes blank.
    const fallback = getLocalServiceCategories(activeLocale === "ar" ? "ar" : "en");
    categories = fallback.map((category) => ({
      id: category.id,
      slug: category.id,
      title: category.title,
      description: category.description,
      imageSrc: category.imageSrc,
      services: category.services.map((service) => ({
        id: service.id,
        slug: service.id,
        title: service.title,
        description: service.description,
        imageSrc: service.imageSrc,
      })),
    }));
  }

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
