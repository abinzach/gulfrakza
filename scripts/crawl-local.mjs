const baseUrl = process.env.SEO_BASE_URL || "http://localhost:3100"
const productionOrigin = "https://www.gulfrakza.com"

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`)
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`)
const sitemap = await sitemapResponse.text()
const productionUrls = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1])
if (productionUrls.length === 0) throw new Error("Sitemap contains no URLs")

const duplicates = productionUrls.filter((url, index) => productionUrls.indexOf(url) !== index)
if (duplicates.length) throw new Error(`Duplicate sitemap URLs: ${duplicates.join(", ")}`)
if (productionUrls.some((url) => url.includes("?"))) throw new Error("Sitemap contains parameterized URLs")

const failures = []
let jsonLdBlocks = 0
const internalLinks = new Set()
for (const batchStart of Array.from({ length: Math.ceil(productionUrls.length / 8) }, (_, index) => index * 8)) {
  const batch = productionUrls.slice(batchStart, batchStart + 8)
  await Promise.all(batch.map(async (productionUrl) => {
    const path = productionUrl.replace(productionOrigin, "")
    const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" })
    if (response.status !== 200) {
      failures.push(`${path}: HTTP ${response.status}`)
      return
    }
    const html = await response.text()
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&")
      if (href.startsWith("/en/") || href === "/en" || href.startsWith("/ar/") || href === "/ar") {
        internalLinks.add(href.split("#")[0])
      }
    }
    const canonicals = Array.from(html.matchAll(/<link rel="canonical" href="([^"]+)"/g), (match) => match[1])
    if (canonicals.length !== 1) failures.push(`${path}: expected one canonical, found ${canonicals.length}`)
    else if (canonicals[0] !== productionUrl) failures.push(`${path}: canonical is ${canonicals[0]}`)
    const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length
    if (h1Count !== 1) failures.push(`${path}: expected one H1, found ${h1Count}`)
    const scripts = Array.from(html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs), (match) => match[1])
    for (const value of scripts) {
      try {
        JSON.parse(value.replaceAll("&quot;", '"').replaceAll("&amp;", "&"))
        jsonLdBlocks += 1
      } catch {
        failures.push(`${path}: invalid JSON-LD`)
      }
    }
  }))
}

for (const batchStart of Array.from({ length: Math.ceil(internalLinks.size / 12) }, (_, index) => index * 12)) {
  const batch = Array.from(internalLinks).slice(batchStart, batchStart + 12)
  await Promise.all(batch.map(async (path) => {
    const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" })
    if (response.status >= 400) failures.push(`${path}: broken internal link (${response.status})`)
  }))
}

if (!productionUrls.some((url) => url.includes("/products/category/"))) failures.push("No category URLs in sitemap")
if (!productionUrls.some((url) => /\/services\/(?!category\/)[^/]+$/.test(url))) failures.push("No service detail URLs in sitemap")

if (failures.length) {
  console.error(`Crawl verification failed (${failures.length} issues):`)
  failures.slice(0, 50).forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`Crawl verification passed: ${productionUrls.length} URLs, ${internalLinks.size} internal targets, ${jsonLdBlocks} valid JSON-LD blocks.`)
