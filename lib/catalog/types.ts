import type { PortableTextBlock } from "next-sanity"

export type CatalogStockStatus = "in_stock" | "out_of_stock"

export interface CatalogSpec {
  key: string
  values: string[]
}

export interface CatalogCategoryNode {
  id: string
  title: string
  slug: string
  description?: string
  heroImageUrl?: string | null
  path: Array<{ title: string; slug: string }>
  productCount: number
  updatedAt?: string
  hasArabicTitle: boolean
  hasArabicDescription: boolean
  isArabicIndexable: boolean
  children: CatalogCategoryNode[]
}

export interface CatalogSizeVariant {
  label: string
  stock: number | null
}

export interface CatalogResourceAsset {
  title: string
  url: string
  filename?: string
  extension?: string
  size?: number
  mimeType?: string
}

export interface CatalogProduct {
  id: string
  slug: string
  title: string
  description: string
  brand: string | null
  imageSrc: string
  features: string[]
  featureTokens: string[]
  specs: CatalogSpec[]
  categoryTrail: Array<{ title: string; slug: string }>
  categorySlugs: string[]
  primaryCategory?: string
  leafCategory?: string
  detailsHref?: string
  position: number
  stockStatus: CatalogStockStatus
  isInStock: boolean
  usesVariantStock: boolean
  totalStock: number | null
  sizeVariants: CatalogSizeVariant[]
  updatedAt?: string
  hasArabicTitle: boolean
  hasArabicDescription: boolean
  isArabicIndexable: boolean
}

/**
 * The subset of `CatalogProduct` the catalog grid actually renders or filters
 * on. Everything the listing does not read — stock variants, review metadata,
 * the Arabic indexability flags, the precomputed href — is dropped before the
 * array crosses into the client component, because every retained field is
 * serialised into the HTML once per product.
 */
export type CatalogListingProduct = Pick<
  CatalogProduct,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "brand"
  | "imageSrc"
  | "features"
  | "featureTokens"
  | "specs"
  | "categoryTrail"
  | "categorySlugs"
  | "primaryCategory"
  | "leafCategory"
  | "isInStock"
  // Backs the default "Recommended" sort order.
  | "position"
>

export interface CatalogProductDetail {
  id: string
  slug: string
  title: string
  description: string
  brand: string | null
  sku: string | null
  primaryCategory?: string
  leafCategory?: string
  imageSrc: string
  gallery: string[]
  features: string[]
  specs: CatalogSpec[]
  categoryTrail: Array<{ title: string; slug: string }>
  stockStatus: CatalogStockStatus
  isInStock: boolean
  usesVariantStock: boolean
  totalStock: number | null
  sizeVariants: CatalogSizeVariant[]
  detailsHref: string
  richBody: PortableTextBlock[]
  resources: CatalogResourceAsset[]
  seoTitle?: string | null
  seoDescription?: string | null
  updatedAt?: string
  hasArabicTitle: boolean
  hasArabicDescription: boolean
  isArabicIndexable: boolean
  reviewedBy?: string | null
  lastReviewedAt?: string | null
}

export interface CatalogData {
  categoryTree: CatalogCategoryNode[]
  products: CatalogProduct[]
  featureFilters: string[]
  brandFilters: string[]
}
