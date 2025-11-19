import { groq } from "next-sanity"
import type { PortableTextBlock } from "next-sanity"

import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import type { Locale } from "@/i18n/config"

import type {
  CatalogCategoryNode,
  CatalogData,
  CatalogProduct,
  CatalogProductDetail,
  CatalogSpec,
  CatalogResourceAsset,
} from "./types"

interface RawLocalizedString {
  en?: string | null
  ar?: string | null
}

interface RawLocalizedBlocks {
  en?: PortableTextBlock[] | null
  ar?: PortableTextBlock[] | null
}

interface RawResourceAsset {
  title?: RawLocalizedString | null
  url?: string | null
  originalFilename?: string | null
  extension?: string | null
  size?: number | null
  mimeType?: string | null
}

interface RawCategory {
  _id: string
  slug?: string | null
  title?: RawLocalizedString | null
  summary?: RawLocalizedString | null
  order?: number | null
  heroImage?: unknown
  parent?: {
    _id: string
  } | null
}

interface RawProductSpecification {
  label?: RawLocalizedString | null
  value?: RawLocalizedString | null
}

interface RawSizeVariant {
  label?: string | null
  stock?: number | null
}

interface RawProduct {
  _id: string
  slug?: string | null
  title?: RawLocalizedString | null
  summary?: RawLocalizedString | null
  brand?: RawLocalizedString | null
  sku?: string | null
  heroImage?: unknown
  gallery?: Array<unknown> | null
  features?: Array<RawLocalizedString | null> | null
  specifications?: Array<RawProductSpecification | null> | null
  body?: RawLocalizedBlocks | null
  resources?: Array<RawResourceAsset | null> | null
  categoryPath?: Array<{
    _id: string
    slug?: string | null
    title?: RawLocalizedString | null
    parent?: { _id: string | null } | null
  } | null> | null
  status?: string | null
  stockStatus?: string | null
  sizeVariants?: Array<RawSizeVariant | null> | null
  seoTitle?: RawLocalizedString | null
  seoDescription?: RawLocalizedString | null
}

interface CategoryNodeRecord {
  id: string
  slug: string
  title: string
  summary?: string
  order: number
  parentId: string | null
  heroImage: unknown
  heroImageUrl?: string
  children: string[]
}

const categoriesQuery = groq`
  *[_type == "category"]{
    _id,
    "slug": slug.current,
    title,
    summary,
    order,
    heroImage,
    parent->{ _id }
  }
`

const productsQuery = groq`
  *[_type == "product" && coalesce(status, "active") != "archived"]{
    _id,
    "slug": slug.current,
    title,
    brand,
    summary,
    heroImage,
    features,
    specifications,
    stockStatus,
    sizeVariants[]{
      label,
      stock
    },
    categoryPath[]->{
      _id,
      "slug": slug.current,
      title,
      parent->{ _id }
    },
    status
  }
`

const productDetailQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    title,
    brand,
    summary,
    sku,
    body,
    heroImage,
    gallery[]{
      ...
    },
    features,
    specifications,
    stockStatus,
    sizeVariants[]{
      label,
      stock
    },
    resources[]{
      title,
      "url": file.asset->url,
      "originalFilename": file.asset->originalFilename,
      "extension": file.asset->extension,
      "size": file.asset->size,
      "mimeType": file.asset->mimeType
    },
    categoryPath[]->{
      _id,
      "slug": slug.current,
      title,
      parent->{ _id }
    },
    seoTitle,
    seoDescription,
    status
  }
`

const pickLocalizedString = (value?: RawLocalizedString | null, locale: Locale = "en") => {
  if (!value) return undefined
  const english = value.en?.trim()
  const arabic = value.ar?.trim()

  if (locale === "ar") {
    return arabic || english || undefined
  }

  return english || arabic || undefined
}

const pickLocalizedBlocks = (
  value?: RawLocalizedBlocks | null,
  locale: Locale = "en",
): PortableTextBlock[] => {
  if (!value) return []
  const english = Array.isArray(value.en) ? (value.en as PortableTextBlock[]) : []
  const arabic = Array.isArray(value.ar) ? (value.ar as PortableTextBlock[]) : []

  if (locale === "ar") {
    return arabic.length > 0 ? arabic : english
  }

  return english.length > 0 ? english : arabic
}

const normalizeResources = (
  resources: Array<RawResourceAsset | null> | null | undefined,
  locale: Locale,
): CatalogResourceAsset[] => {
  if (!resources) return []

  const normalized: CatalogResourceAsset[] = []

  resources.forEach((entry) => {
    if (!entry) return
    const title = pickLocalizedString(entry.title, locale)
    const url = entry.url?.trim()
    if (!title || !url) return

    normalized.push({
      title,
      url,
      filename: entry.originalFilename ?? undefined,
      extension: entry.extension ?? undefined,
      size: typeof entry.size === "number" ? entry.size : undefined,
      mimeType: entry.mimeType ?? undefined,
    })
  })

  return normalized
}

const buildImageUrl = (source: unknown) => {
  if (!source) return undefined
  try {
    return urlFor(source).width(800).height(600).fit("max").quality(80).url()
  } catch {
    return undefined
  }
}

const sortByOrderAndTitle = (
  a: CategoryNodeRecord,
  b: CategoryNodeRecord,
  locale: Locale = "en",
) => {
  const orderA = Number.isFinite(a.order) ? (a.order as number) : Number.POSITIVE_INFINITY
  const orderB = Number.isFinite(b.order) ? (b.order as number) : Number.POSITIVE_INFINITY

  if (orderA !== orderB) {
    return orderA - orderB
  }

  return a.title.localeCompare(b.title, locale)
}

interface CatalogContext {
  nodeById: Map<string, CategoryNodeRecord>
  nodeBySlug: Map<string, CategoryNodeRecord>
  topLevelNodes: CategoryNodeRecord[]
  getAncestors: (node: CategoryNodeRecord) => CategoryNodeRecord[]
}

const buildCatalogContext = (rawCategories: RawCategory[], locale: Locale): CatalogContext => {
  const categoryRecords: CategoryNodeRecord[] = []
  const localeAwareSort = (a: CategoryNodeRecord, b: CategoryNodeRecord) =>
    sortByOrderAndTitle(a, b, locale)

  rawCategories.forEach((category) => {
    const slug = category.slug?.trim()
    const title = pickLocalizedString(category.title, locale)

    if (!category._id || !slug || !title) {
      return
    }

    const heroImageUrl = buildImageUrl(category.heroImage)

    categoryRecords.push({
      id: category._id,
      slug,
      title,
      summary: pickLocalizedString(category.summary, locale),
      order: typeof category.order === "number" ? (category.order as number) : Number.POSITIVE_INFINITY,
      parentId: category.parent?._id ?? null,
      heroImage: category.heroImage,
      heroImageUrl,
      children: [],
    })
  })

  const nodeById = new Map<string, CategoryNodeRecord>()
  const nodeBySlug = new Map<string, CategoryNodeRecord>()

  categoryRecords.forEach((record) => {
    nodeById.set(record.id, record)
    nodeBySlug.set(record.slug, record)
  })

  categoryRecords.forEach((record) => {
    if (!record.parentId) return
    const parent = nodeById.get(record.parentId)
    if (parent && !parent.children.includes(record.id)) {
      parent.children.push(record.id)
    }
  })

  const ancestorCache = new Map<string, CategoryNodeRecord[]>()

  const getAncestors = (node: CategoryNodeRecord): CategoryNodeRecord[] => {
    if (ancestorCache.has(node.id)) {
      return ancestorCache.get(node.id) ?? []
    }

    const ancestors: CategoryNodeRecord[] = []
    let current: CategoryNodeRecord | undefined = node

    while (current?.parentId) {
      const parent = nodeById.get(current.parentId)
      if (!parent) break
      ancestors.unshift(parent)
      current = parent
    }

    ancestorCache.set(node.id, ancestors)
    return ancestors
  }

  const topLevelNodes = categoryRecords.filter((node) => !node.parentId).sort(localeAwareSort)

  return { nodeById, nodeBySlug, topLevelNodes, getAncestors }
}

interface NormalizeOptions {
  featureSet?: Set<string>
  brandSet?: Set<string>
  productCountMap?: Map<string, number>
}

const normalizeProduct = (
  product: RawProduct,
  context: CatalogContext,
  locale: Locale,
  options: NormalizeOptions = {},
): CatalogProduct | null => {
  const title = pickLocalizedString(product.title, locale)
  const slug = product.slug?.trim()

  if (!product._id || !title || !slug) {
    return null
  }

  const rawTrail = (product.categoryPath ?? [])
    .map((category) => {
      if (!category?._id || !category.slug) return null
      const categoryTitle = pickLocalizedString(category.title, locale)
      if (!categoryTitle) return null
      return {
        id: category._id,
        slug: category.slug,
        title: categoryTitle,
      }
    })
    .filter((item): item is { id: string; slug: string; title: string } => Boolean(item?.slug && item.title))

  let categoryTrail = rawTrail

  const leafSlug = rawTrail[rawTrail.length - 1]?.slug
  const leafNode = leafSlug ? context.nodeBySlug.get(leafSlug) : undefined

  if (leafNode) {
    const ancestors = context.getAncestors(leafNode)
    const normalized = [
      ...ancestors.map((ancestor) => ({
        id: ancestor.id,
        slug: ancestor.slug,
        title: ancestor.title,
      })),
      {
        id: leafNode.id,
        slug: leafNode.slug,
        title: leafNode.title,
      },
    ]
    categoryTrail = normalized
  }

  const normalizedTrail = categoryTrail.map(({ slug, title }) => ({ slug, title }))

  const categorySlugs = normalizedTrail.map((entry) => entry.slug).filter(Boolean)

  if (options.productCountMap) {
    const uniqueSlugs = new Set(categorySlugs)
    uniqueSlugs.forEach((slugValue) => {
      const map = options.productCountMap as Map<string, number>
      map.set(slugValue, (map.get(slugValue) ?? 0) + 1)
    })
  }

  const categoryNodesForTrail = [...normalizedTrail]
    .reverse()
    .map((entry) => context.nodeBySlug.get(entry.slug))
    .filter((node): node is CategoryNodeRecord => Boolean(node))

  const imageSrc =
    buildImageUrl(product.heroImage) ||
    categoryNodesForTrail.find((node) => node.heroImageUrl)?.heroImageUrl ||
    "/logo-rakza.png"

  const description =
    pickLocalizedString(product.summary, locale) ||
    categoryNodesForTrail.find((node) => node.summary)?.summary ||
    `${title} supplied by Gulf Rakza Trading.`

  const productFeatureTokens = new Set<string>()
  const featureList: string[] = []

  ;(product.features ?? []).forEach((feature) => {
    const token = pickLocalizedString(feature, locale)
    if (token) {
      productFeatureTokens.add(token)
      if (!featureList.includes(token)) {
        featureList.push(token)
      }
      options.featureSet?.add(token)
    }
  })

  const specifications: CatalogSpec[] = []
  ;(product.specifications ?? []).forEach((spec) => {
    const label = pickLocalizedString(spec?.label, locale)
    const value = pickLocalizedString(spec?.value, locale)
    if (!label || !value) return
    specifications.push({
      key: label,
      values: [value],
    })
    productFeatureTokens.add(value)
    options.featureSet?.add(value)
  })

  const sizeVariants = (product.sizeVariants ?? [])
    .map((variant) => {
      const label = variant?.label?.trim()
      if (!label) return null
      const stockValue =
        typeof variant?.stock === "number" && Number.isFinite(variant.stock) && variant.stock >= 0
          ? Math.floor(variant.stock)
          : null
      return {
        label,
        stock: stockValue,
      }
    })
    .filter((variant): variant is { label: string; stock: number | null } => Boolean(variant))

  const usesVariantStock = sizeVariants.length > 0
  const totalStock = usesVariantStock
    ? sizeVariants.reduce((sum, variant) => sum + (variant.stock ?? 0), 0)
    : null

  const brand = pickLocalizedString(product.brand, locale) ?? null
  if (brand) {
    options.brandSet?.add(brand)
  }

  let stockStatus: CatalogProduct["stockStatus"] =
    product.stockStatus === "out_of_stock" ? "out_of_stock" : "in_stock"

  if (usesVariantStock) {
    stockStatus = totalStock !== null && totalStock > 0 ? "in_stock" : "out_of_stock"
  }

  const isInStock = stockStatus === "in_stock"

  const primaryCategory = normalizedTrail[0]?.title
  const leafCategory = normalizedTrail[normalizedTrail.length - 1]?.title

  return {
    id: product._id,
    slug,
    title,
    description,
    brand,
    imageSrc,
    features: featureList,
    featureTokens: Array.from(productFeatureTokens),
    specs: specifications,
    categoryTrail: normalizedTrail,
    categorySlugs,
    primaryCategory,
    leafCategory,
    detailsHref: `/products/${slug}`,
    position: 0,
    stockStatus,
    isInStock,
    usesVariantStock,
    totalStock,
    sizeVariants,
  }
}

export const fetchCatalogData = async (locale: Locale = "en"): Promise<CatalogData> => {
  const [rawCategories, rawProducts] = await Promise.all([
    client.fetch<RawCategory[]>(
      categoriesQuery,
      {},
      { cache: "force-cache", next: { revalidate: 300 } },
    ),
    client.fetch<RawProduct[]>(
      productsQuery,
      {},
      { cache: "force-cache", next: { revalidate: 300 } },
    ),
  ])

  const context = buildCatalogContext(rawCategories, locale)
  const featureSet = new Set<string>()
  const brandSet = new Set<string>()
  const productCountMap = new Map<string, number>()

  const productEntries: CatalogProduct[] = []

  rawProducts.forEach((rawProduct) => {
    const normalized = normalizeProduct(rawProduct, context, locale, {
      featureSet,
      brandSet,
      productCountMap,
    })

    if (normalized) {
      normalized.position = productEntries.length
      productEntries.push(normalized)
    }
  })

  const sortedProducts = productEntries.sort((a, b) => a.title.localeCompare(b.title, locale))
  sortedProducts.forEach((product, index) => {
    product.position = index
  })

  const buildTreeNode = (
    node: CategoryNodeRecord,
    ancestorPath: Array<{ slug: string; title: string }>,
  ): CatalogCategoryNode => {
    const path = [
      ...ancestorPath,
      {
        slug: node.slug,
        title: node.title,
      },
    ]

    const children = node.children
      .map((childId) => context.nodeById.get(childId))
      .filter((child): child is CategoryNodeRecord => Boolean(child))
      .sort((a, b) => sortByOrderAndTitle(a, b, locale))
      .map((child) => buildTreeNode(child, path))

    return {
      id: node.id,
      title: node.title,
      slug: node.slug,
      description: node.summary,
      heroImageUrl: node.heroImageUrl,
      path,
      productCount: productCountMap.get(node.slug) ?? 0,
      children,
    }
  }

  const categoryTree = context.topLevelNodes.map((node) => buildTreeNode(node, []))

  const featureFilters = Array.from(featureSet).sort((a, b) => a.localeCompare(b, locale))
  const brandFilters = Array.from(brandSet).sort((a, b) => a.localeCompare(b, locale))

  return {
    categoryTree,
    products: sortedProducts,
    featureFilters,
    brandFilters,
  }
}

export const fetchProductDetail = async (
  slug: string,
  locale: Locale = "en",
): Promise<CatalogProductDetail | null> => {
  const [rawCategories, rawProduct] = await Promise.all([
    client.fetch<RawCategory[]>(
      categoriesQuery,
      {},
      { cache: "force-cache", next: { revalidate: 300 } },
    ),
    client.fetch<RawProduct | null>(
      productDetailQuery,
      { slug },
      { cache: "force-cache", next: { revalidate: 300 } },
    ),
  ])

  if (!rawProduct) {
    return null
  }

  const context = buildCatalogContext(rawCategories, locale)
  const baseProduct = normalizeProduct(rawProduct, context, locale)

  if (!baseProduct) {
    return null
  }

  const sku = rawProduct.sku?.trim() || null
  const richBody = pickLocalizedBlocks(rawProduct.body, locale)
  const resources = normalizeResources(rawProduct.resources, locale)
  const seoTitle = pickLocalizedString(rawProduct.seoTitle, locale) ?? null
  const seoDescription = pickLocalizedString(rawProduct.seoDescription, locale) ?? null

  const gallerySources = rawProduct.gallery ?? []
  const galleryUrls = gallerySources
    .map((source) => buildImageUrl(source))
    .filter((url): url is string => Boolean(url))

  const heroFirst = baseProduct.imageSrc ? [baseProduct.imageSrc] : []
  const gallery = Array.from(new Set([...heroFirst, ...galleryUrls]))

  return {
    id: baseProduct.id,
    slug: baseProduct.slug,
    title: baseProduct.title,
    description: baseProduct.description,
    brand: baseProduct.brand,
    primaryCategory: baseProduct.primaryCategory,
    leafCategory: baseProduct.leafCategory,
    imageSrc: baseProduct.imageSrc,
    gallery,
    features: baseProduct.features,
    specs: baseProduct.specs,
    categoryTrail: baseProduct.categoryTrail,
    stockStatus: baseProduct.stockStatus,
    isInStock: baseProduct.isInStock,
    usesVariantStock: baseProduct.usesVariantStock,
    totalStock: baseProduct.totalStock,
    sizeVariants: baseProduct.sizeVariants,
    detailsHref: baseProduct.detailsHref ?? `/products/${baseProduct.slug}`,
    sku,
    richBody,
    resources,
    seoTitle,
    seoDescription,
  }
}
