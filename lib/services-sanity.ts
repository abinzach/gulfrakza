import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/i18n/config";
import type { PortableTextBlock } from "next-sanity";
import { serviceCategoriesQuery, serviceDetailQuery } from "@/sanity/lib/serviceQueries";

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
type LocalizedBlocks = { en?: PortableTextBlock[] | null; ar?: PortableTextBlock[] | null };

type RawService = {
  _id: string;
  _updatedAt?: string;
  slug?: string | null;
  title?: LocalizedString | null;
  description?: LocalizedText | null;
  imageSrc?: string | null;
  heroImage?: unknown;
  order?: number | null;
  body?: LocalizedBlocks | null;
  seoTitle?: LocalizedString | null;
  seoDescription?: LocalizedText | null;
  category?: {
    _id: string;
    slug?: string | null;
    title?: LocalizedString | null;
  } | null;
  indexArabic?: boolean | null;
  reviewedBy?: string | null;
  lastReviewedAt?: string | null;
};

type RawServiceCategory = {
  _id: string;
  _updatedAt?: string;
  slug?: string | null;
  title?: LocalizedString | null;
  description?: LocalizedText | null;
  imageSrc?: string | null;
  heroImage?: unknown;
  order?: number | null;
  services?: RawService[] | null;
  indexArabic?: boolean | null;
};

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageSrc?: string;
  heroImageUrl?: string;
  updatedAt?: string;
  hasArabicTitle: boolean;
  hasArabicDescription: boolean;
  isArabicIndexable: boolean;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageSrc?: string;
  heroImageUrl?: string;
  updatedAt?: string;
  hasArabicTitle: boolean;
  hasArabicDescription: boolean;
  isArabicIndexable: boolean;
  services: ServiceItem[];
}

export interface ServiceDetail extends ServiceItem {
  body: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
  category?: { id: string; slug: string; title: string };
  reviewedBy?: string;
  lastReviewedAt?: string;
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

const pickLocalizedBlocks = (value: LocalizedBlocks | null | undefined, locale: Locale) => {
  if (!value) return [];
  const en = Array.isArray(value.en) ? value.en : [];
  const ar = Array.isArray(value.ar) ? value.ar : [];
  return locale === "ar" ? (ar.length > 0 ? ar : en) : (en.length > 0 ? en : ar);
};

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
          updatedAt: service._updatedAt,
          hasArabicTitle: Boolean(service.title?.ar?.trim()),
          hasArabicDescription: Boolean(service.description?.ar?.trim()),
          isArabicIndexable: Boolean(
            service.indexArabic &&
            service.title?.ar?.trim() &&
            service.description?.ar?.trim() &&
            service.title?.ar?.trim() !== service.title?.en?.trim()
          ),
        };
      });

    return {
      id: safeSlug(category.slug) || category._id,
      slug: safeSlug(category.slug) || category._id,
      title: pickLocalized(category.title, locale) || "Untitled",
      description: pickLocalized(category.description, locale) || "",
      imageSrc: categoryImageSrc,
      heroImageUrl: categoryHeroImageUrl,
      updatedAt: category._updatedAt,
      hasArabicTitle: Boolean(category.title?.ar?.trim()),
      hasArabicDescription: Boolean(category.description?.ar?.trim()),
      isArabicIndexable: Boolean(
        category.indexArabic &&
        category.title?.ar?.trim() &&
        category.description?.ar?.trim() &&
        category.title?.ar?.trim() !== category.title?.en?.trim()
      ),
      services,
    };
  });
}

export async function fetchServiceDetail(slug: string, locale: Locale): Promise<ServiceDetail | null> {
  const service = await serviceClient.fetch<RawService | null>(serviceDetailQuery, { slug });
  if (!service) return null;

  const resolvedSlug = safeSlug(service.slug);
  const title = pickLocalized(service.title, locale);
  if (!resolvedSlug || !title) return null;
  const heroImageUrl = resolveImageUrl(service.heroImage);

  return {
    id: service._id,
    slug: resolvedSlug,
    title,
    description: pickLocalized(service.description, locale) || "",
    imageSrc: service.imageSrc?.trim() || heroImageUrl,
    heroImageUrl,
    updatedAt: service._updatedAt,
    hasArabicTitle: Boolean(service.title?.ar?.trim()),
    hasArabicDescription: Boolean(service.description?.ar?.trim()),
    isArabicIndexable: Boolean(
      service.indexArabic &&
      service.title?.ar?.trim() &&
      service.description?.ar?.trim() &&
      service.title?.ar?.trim() !== service.title?.en?.trim()
    ),
    body: pickLocalizedBlocks(service.body, locale),
    seoTitle: pickLocalized(service.seoTitle, locale),
    seoDescription: pickLocalized(service.seoDescription, locale),
    category: service.category
      ? {
          id: service.category._id,
          slug: safeSlug(service.category.slug) || service.category._id,
          title: pickLocalized(service.category.title, locale) || "Services",
        }
      : undefined,
    reviewedBy: service.reviewedBy?.trim() || undefined,
    lastReviewedAt: service.lastReviewedAt || undefined,
  };
}
