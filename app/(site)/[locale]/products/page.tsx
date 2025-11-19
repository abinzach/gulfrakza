import type { Metadata } from "next"

import { fetchCatalogData } from "@/lib/catalog"
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config"
import { siteUrl } from "@/lib/constants"

import CatalogPageClient from "./catalog-client"
import { parseFiltersFromSearchParams } from "./filter-helpers"

const catalogMeta = {
  title: "Industrial Products Catalog | Gulf Rakza Trading",
  description:
    "Browse the complete Gulf Rakza Trading product catalog. Compare PPE, safety systems, lifting gear, welding equipment, marine supplies, and more tailored for industrial operations across the GCC.",
  keywords: [
    "industrial product catalog",
    "Gulf Rakza products",
    "PPE supplier Saudi Arabia",
    "industrial safety equipment",
    "marine equipment Saudi Arabia",
    "industrial lifting gear",
  ],
  ogTitle: "Explore Gulf Rakza's Industrial Product Catalog",
  ogDescription:
    "Search, filter, and compare the full lineup of Gulf Rakza Trading industrial products including PPE, safety systems, lifting solutions, and specialized equipment.",
  twitterTitle: "Gulf Rakza Industrial Product Catalog",
  twitterDescription:
    "Discover PPE, lifting gear, marine supplies, and industrial equipment from Gulf Rakza Trading.",
  ogImage: `${siteUrl}/og/product-catalog.jpg`,
  twitterImage: `${siteUrl}/twitter/product-catalog.jpg`,
}

type CatalogPageProps = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const { locale } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale

  const canonicalPath = `/${activeLocale}/products`
  const canonicalUrl = `${siteUrl}${canonicalPath}`
  const languageAlternates = locales.reduce<Record<string, string>>((acc, currentLocale) => {
    acc[currentLocale] = `${siteUrl}/${currentLocale}/products`
    return acc
  }, {})
  languageAlternates["x-default"] = `${siteUrl}/${defaultLocale}/products`

  const localeTag = activeLocale === "ar" ? "ar_SA" : "en_US"

  return {
    title: catalogMeta.title,
    description: catalogMeta.description,
    keywords: catalogMeta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title: catalogMeta.ogTitle,
      description: catalogMeta.ogDescription,
      url: canonicalUrl,
      siteName: "Gulf Rakza Trading",
      type: "website",
      locale: localeTag,
      images: [
        {
          url: catalogMeta.ogImage,
          width: 1200,
          height: 630,
          alt: "Gulf Rakza industrial product catalog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: catalogMeta.twitterTitle,
      description: catalogMeta.twitterDescription,
      images: [catalogMeta.twitterImage],
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
