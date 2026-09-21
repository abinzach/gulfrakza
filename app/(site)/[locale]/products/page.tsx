import type { Metadata } from "next"

import { fetchCatalogData, toCatalogListingProduct } from "@/lib/catalog"
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config"
import { siteUrl } from "@/lib/constants"

import CatalogPageClient from "./catalog-client"

const catalogMeta = {
  title: "Industrial Products Catalog | PPE, Safety & Lifting Equipment | GulfRakza",
  description:
    "Browse GulfRakza's complete catalog of industrial products in Dammam, Saudi Arabia. Compare PPE, safety systems, lifting gear, welding equipment, marine supplies, and more for industrial operations across the Kingdom.",
  keywords: [
    "industrial products Dammam",
    "PPE supplier Saudi Arabia",
    "safety equipment Dammam",
    "industrial supplies Eastern Province",
    "lifting equipment Saudi Arabia",
    "welding supplies Dammam",
    "marine equipment Saudi Arabia",
    "GulfRakza products",
  ],
  ogTitle: "Industrial Products Catalog | PPE & Safety Equipment | GulfRakza Dammam",
  ogDescription:
    "Search, filter, and compare GulfRakza's full lineup of industrial products including PPE, safety systems, lifting solutions, and specialized equipment in Dammam, Saudi Arabia.",
  twitterTitle: "Industrial Products Catalog | GulfRakza Dammam",
  twitterDescription:
    "Discover PPE, lifting gear, marine supplies, and industrial equipment from GulfRakza in Dammam, Saudi Arabia.",
  ogImage: `${siteUrl}/og-image.jpg`,
  twitterImage: `${siteUrl}/twitter-og-image.jpg`,
}

const arabicCatalogMeta = {
  title: "كتالوج المنتجات الصناعية | معدات السلامة والرفع | جلف ركزة",
  description:
    "تصفح كتالوج جلف ركزة للمنتجات الصناعية في الدمام: معدات الوقاية والسلامة، معدات الرفع واللحام، والمستلزمات البحرية المتاحة للتوريد في المملكة العربية السعودية.",
  keywords: [
    "معدات صناعية الدمام",
    "معدات السلامة السعودية",
    "معدات الوقاية الشخصية الدمام",
    "معدات الرفع السعودية",
    "مستلزمات المصانع المنطقة الشرقية",
  ],
  ogTitle: "كتالوج المنتجات الصناعية ومعدات السلامة | جلف ركزة",
  ogDescription: "اكتشف منتجات السلامة والرفع واللحام والمستلزمات الصناعية المتاحة من جلف ركزة في الدمام.",
  twitterTitle: "كتالوج المنتجات الصناعية | جلف ركزة",
  twitterDescription: "منتجات صناعية ومعدات سلامة متاحة للتوريد في الدمام والمملكة العربية السعودية.",
  ogImage: `${siteUrl}/og-image.jpg`,
  twitterImage: `${siteUrl}/twitter-og-image.jpg`,
}

// Deliberately no `searchParams` here or in `generateMetadata`: reading it
// opts the route into dynamic rendering, which made every filter permutation a
// fresh ~2.3 MB origin render instead of an edge-cache hit. Filters are parsed
// on the client in `CatalogPageClient`. Crawlers are kept off the filtered URLs
// by the canonical below plus the `Disallow` rules in `app/robots.ts`.
type CatalogPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const { locale } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale
  const localizedMeta = activeLocale === "ar" ? arabicCatalogMeta : catalogMeta

  const canonicalPath = `/${activeLocale}/products`
  const canonicalUrl = `${siteUrl}${canonicalPath}`
  const languageAlternates = locales.reduce<Record<string, string>>((acc, currentLocale) => {
    acc[currentLocale] = `${siteUrl}/${currentLocale}/products`
    return acc
  }, {})
  languageAlternates["x-default"] = `${siteUrl}/en/products`

  const localeTag = activeLocale === "ar" ? "ar_SA" : "en_US"

  return {
    title: localizedMeta.title,
    description: localizedMeta.description,
    keywords: localizedMeta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title: localizedMeta.ogTitle,
      description: localizedMeta.ogDescription,
      url: canonicalUrl,
      siteName: "GulfRakza",
      type: "website",
      locale: localeTag,
      images: [
        {
          url: localizedMeta.ogImage,
          width: 1200,
          height: 630,
          alt: localizedMeta.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: localizedMeta.twitterTitle,
      description: localizedMeta.twitterDescription,
      images: [localizedMeta.twitterImage],
    },
  }
}

export default async function ProductsPage({ params }: CatalogPageProps) {
  const { locale } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale

  const { products, categoryTree, featureFilters, brandFilters } =
    await fetchCatalogData(activeLocale)

  return (
    <CatalogPageClient
      products={products.map(toCatalogListingProduct)}
      categoryTree={categoryTree}
      featureFilters={featureFilters}
      brandFilters={brandFilters}
    />
  )
}
