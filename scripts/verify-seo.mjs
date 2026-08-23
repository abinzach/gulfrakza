import { readFile, access } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const failures = []
const checks = []

const read = (file) => readFile(path.join(root, file), "utf8")
const expect = (condition, message) => {
  checks.push(message)
  if (!condition) failures.push(message)
}
const exists = async (file) => {
  try {
    await access(path.join(root, file))
    return true
  } catch {
    return false
  }
}

const [sitemap, productPage, localeLayout, robots, llms] = await Promise.all([
  read("app/sitemap.ts"),
  read("app/(site)/[locale]/products/[slug]/page.tsx"),
  read("app/(site)/[locale]/layout.tsx"),
  read("app/robots.ts"),
  read("public/llms.txt"),
])

expect(!sitemap.includes("new Date()"), "Sitemap does not manufacture a fresh last-modified date")
expect(sitemap.includes("flattenCategoryTree"), "Sitemap includes populated category pages")
expect(sitemap.includes("fetchServiceCategories"), "Sitemap includes service detail pages")
expect(productPage.includes("serializeJsonLd"), "Product JSON-LD is safely serialized in server HTML")
expect(!productPage.includes("priceCurrency"), "Product schema does not publish an Offer without a price")
expect(localeLayout.includes("linkedin.com/company/gulfrakza"), "Organization schema links to the external company profile")
expect(robots.includes("OAI-SearchBot") && robots.includes("PerplexityBot"), "Search-oriented AI crawlers are explicitly allowed")
expect(llms.includes("Product availability and commercial terms require direct confirmation"), "llms.txt separates stable facts from commercial claims")
expect(await exists("app/(site)/[locale]/products/category/[...path]/page.tsx"), "Crawlable product category route exists")
expect(await exists("app/(site)/[locale]/services/[slug]/page.tsx"), "Crawlable service detail route exists")
expect(await exists("public/92d87e57f41a4da1a731350b6d388e0f.txt"), "IndexNow key is publicly verifiable")

if (failures.length > 0) {
  console.error(`SEO verification failed (${failures.length}/${checks.length}):`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`SEO verification passed (${checks.length} checks).`)
