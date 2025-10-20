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
  path: Array<{ title: string; slug: string }>
  productCount: number
  children: CatalogCategoryNode[]
}

export interface CatalogSizeVariant {
  label: string
  stock: number | null
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
}

export interface CatalogProductDetail {
  id: string
  slug: string
  title: string
  description: string
  brand: string | null
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
}

export interface CatalogData {
  categoryTree: CatalogCategoryNode[]
  products: CatalogProduct[]
  featureFilters: string[]
  brandFilters: string[]
}
