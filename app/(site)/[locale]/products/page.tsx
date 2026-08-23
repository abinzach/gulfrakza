import type { Metadata } from "next"

import { fetchCatalogData } from "@/lib/catalog"
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config"
import { siteUrl } from "@/lib/constants"

import CatalogPageClient from "./catalog-client"
import { parseFiltersFromSearchParams } from "./filter-helpers"

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

type CatalogPageProps = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params, searchParams }: CatalogPageProps): Promise<Metadata> {
  const { locale } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale
  const localizedMeta = activeLocale === "ar" ? arabicCatalogMeta : catalogMeta
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const hasFilters = Boolean(resolvedSearchParams && Object.values(resolvedSearchParams).some((value) =>
    Array.isArray(value) ? value.some(Boolean) : Boolean(value),
  ))

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
    robots: hasFilters ? { index: false, follow: true } : undefined,
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

const buildURLSearchParams = (params?: Record<string, string | string[] | undefined>) => {
  const searchParams = new URLSearchParams()
  if (!params) {
    return searchParams
  }

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "undefined") return
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (typeof entry === "string") {
          searchParams.append(key, entry)
        }
      })
    } else {
      searchParams.append(key, value)
    }
  })

  return searchParams
}

export default async function ProductsPage({ params, searchParams }: CatalogPageProps) {
  const { locale } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale

  const { products, categoryTree, featureFilters, brandFilters } =
    await fetchCatalogData(activeLocale)

  const resolvedSearchParams = searchParams ? await searchParams : undefined

  const initialFilters = parseFiltersFromSearchParams(buildURLSearchParams(resolvedSearchParams))

  return (
    <CatalogPageClient
      products={products}
      categoryTree={categoryTree}
      featureFilters={featureFilters}
      brandFilters={brandFilters}
      initialFilters={initialFilters}
    />
  )
}
