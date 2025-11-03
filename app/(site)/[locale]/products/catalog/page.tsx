import type { Metadata } from "next"

import { fetchCatalogData } from "@/lib/catalog"

import CatalogPageClient from "./catalog-client"
import { parseFiltersFromSearchParams } from "./filter-helpers"

export const metadata: Metadata = {
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
  alternates: {
    canonical: "https://www.gulfrakza.com/products/catalog",
  },
  openGraph: {
    title: "Explore Gulf Rakza's Industrial Product Catalog",
    description:
      "Search, filter, and compare the full lineup of Gulf Rakza Trading industrial products including PPE, safety systems, lifting solutions, and specialized equipment.",
    url: "https://www.gulfrakza.com/products/catalog",
    siteName: "Gulf Rakza Trading",
    type: "website",
    images: [
      {
        url: "https://www.gulfrakza.com/og/product-catalog.jpg",
        width: 1200,
        height: 630,
        alt: "Gulf Rakza industrial product catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gulf Rakza Industrial Product Catalog",
    description:
      "Discover PPE, lifting gear, marine supplies, and industrial equipment from Gulf Rakza Trading.",
    images: ["https://www.gulfrakza.com/twitter/product-catalog.jpg"],
  },
}

type CatalogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
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

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { products, categoryTree, featureFilters, brandFilters } = await fetchCatalogData()

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
