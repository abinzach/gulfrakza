import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/i18n/config";
import { serviceCategoriesQuery } from "@/sanity/lib/serviceQueries";

// IMPORTANT:
// Your Sanity project currently allows public reads for `category` + `product`,
// but `serviceCategory` + `service` are not readable without a token.
// So we use a server-side token if present.
//
// Recommended: create a dedicated read token (Viewer role) and set
// `SANITY_READ_TOKEN` in your hosting environment.
const readToken = process.env.SANITY_READ_TOKEN || process.env.SANITY_WRITE_TOKEN;

const serviceClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: readToken,
});

export type ServiceLocale = "en" | "ar";

type LocalizedString = { en?: string | null; ar?: string | null };
type LocalizedText = { en?: string | null; ar?: string | null };

type RawService = {
  _id: string;
  slug?: string | null;
  title?: LocalizedString | null;
  description?: LocalizedText | null;
  imageSrc?: string | null;
  heroImage?: unknown;
  order?: number | null;
};

type RawServiceCategory = {
  _id: string;
  slug?: string | null;
  title?: LocalizedString | null;
  description?: LocalizedText | null;
  imageSrc?: string | null;
  heroImage?: unknown;
  order?: number | null;
  services?: RawService[] | null;
};

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageSrc?: string;
  heroImageUrl?: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageSrc?: string;
  heroImageUrl?: string;
  services: ServiceItem[];
}

const pickLocalized = (
  value: LocalizedString | LocalizedText | null | undefined,
  locale: Locale,
): string | undefined => {
  if (!value) return undefined;
  const en = typeof value.en === "string" ? value.en.trim() : undefined;
  const ar = typeof value.ar === "string" ? value.ar.trim() : undefined;
  return locale === "ar" ? ar || en : en || ar;
};

const safeSlug = (value?: string | null) => (value?.trim() ? value.trim() : "");

const resolveImageUrl = (heroImage?: unknown): string | undefined => {
  if (!heroImage) return undefined;
  try {
    return urlFor(heroImage).width(1400).quality(70).auto("format").url();
  } catch {
    return undefined;
  }
};

/**
 * Fetch service categories + nested services from Sanity.
 * This returns the exact shape `ServicesListingClient` expects today.
 */
export async function fetchServiceCategories(locale: Locale): Promise<ServiceCategory[]> {
  const raw = await serviceClient.fetch<RawServiceCategory[]>(serviceCategoriesQuery);

  return (raw ?? []).map((category) => {
    const categoryHeroImageUrl = resolveImageUrl(category.heroImage);
    const categoryImageSrc = category.imageSrc?.trim() || categoryHeroImageUrl;
    const services = (category.services ?? [])
      .slice()
      .sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999))
      .map<ServiceItem>((service) => {
        const serviceHeroUrl = resolveImageUrl(service.heroImage);
        return {
          id: safeSlug(service.slug) || service._id,
          slug: safeSlug(service.slug) || service._id,
          title: pickLocalized(service.title, locale) || "Untitled",
          description: pickLocalized(service.description, locale) || "",
          imageSrc: service.imageSrc?.trim() || serviceHeroUrl,
          heroImageUrl: serviceHeroUrl,
        };
      });

    return {
      id: safeSlug(category.slug) || category._id,
      slug: safeSlug(category.slug) || category._id,
      title: pickLocalized(category.title, locale) || "Untitled",
      description: pickLocalized(category.description, locale) || "",
      imageSrc: categoryImageSrc,
      heroImageUrl: categoryHeroImageUrl,
      services,
    };
  });
}
