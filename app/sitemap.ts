import { MetadataRoute } from "next"

import { fetchCatalogData } from "@/lib/catalog"

const baseUrl = "https://www.gulfrakza.com"

const toAbsoluteUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path
  }
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

const flattenCategories = <T extends { children: T[] }>(nodes: T[]): T[] => {
  const list: T[] = []
  const walk = (items: T[]) => {
    items.forEach((item) => {
      list.push(item)
      if (item.children.length > 0) {
        walk(item.children)
      }
    })
  }
  walk(nodes)
  return list
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categoryTree, products } = await fetchCatalogData()

  const entries: MetadataRoute.Sitemap = []
  const seen = new Set<string>()
  const lastModified = new Date()

  const pushEntry = (
    url: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => {
    if (seen.has(url)) return
    seen.add(url)
    entries.push({
      url,
      lastModified,
      changeFrequency,
      priority,
    })
  }

  pushEntry(`${baseUrl}/`, 1, "monthly")
  pushEntry(`${baseUrl}/about-us`, 0.8, "monthly")
  pushEntry(`${baseUrl}/products`, 0.8, "weekly")
  pushEntry(`${baseUrl}/products/catalog`, 0.9, "weekly")
  pushEntry(`${baseUrl}/privacy-policy`, 0.4, "yearly")
  pushEntry(`${baseUrl}/terms-of-service`, 0.4, "yearly")

  const allCategories = flattenCategories(categoryTree)

  allCategories.forEach((category) => {
    const pathSegments = category.path.map((segment) => segment.slug).filter(Boolean)
    if (pathSegments.length === 0) return

    const categoryPath = `/products/${pathSegments.join("/")}`
    pushEntry(toAbsoluteUrl(categoryPath), 0.6, "monthly")
  })

  products.forEach((product) => {
    if (!product.detailsHref) return
    pushEntry(toAbsoluteUrl(product.detailsHref), 0.5, "monthly")
  })

  return entries
}
