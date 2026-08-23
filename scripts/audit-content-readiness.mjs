import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "polviyaz",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-10-01",
  useCdn: false,
})

const products = await client.fetch(`*[_type == "product" && coalesce(status, "active") != "archived"]{
  "slug": slug.current,
  title,
  summary,
  body,
  features,
  specifications,
  seoTitle,
  seoDescription,
  indexArabic,
  reviewedBy,
  lastReviewedAt,
  sourceLinks
}`)

const hasText = (value) => typeof value === "string" && value.trim().length > 0
const rows = products.map((product) => {
  const englishSummaryLength = product.summary?.en?.trim().length || 0
  const arabicTitle = product.title?.ar?.trim() || ""
  const englishTitle = product.title?.en?.trim() || ""
  return {
    slug: product.slug || "missing-slug",
    englishSummaryLength,
    hasDetailedEnglish: Array.isArray(product.body?.en) && product.body.en.length > 0,
    hasFeatures: Array.isArray(product.features) && product.features.length > 0,
    hasSpecifications: Array.isArray(product.specifications) && product.specifications.length > 0,
    hasEnglishSeo: hasText(product.seoTitle?.en) && hasText(product.seoDescription?.en),
    arabicReady: Boolean(
      product.indexArabic &&
      arabicTitle &&
      arabicTitle !== englishTitle &&
      hasText(product.summary?.ar)
    ),
    hasReviewEvidence: hasText(product.reviewedBy) && hasText(product.lastReviewedAt),
    hasSources: Array.isArray(product.sourceLinks) && product.sourceLinks.length > 0,
  }
})

const count = (predicate) => rows.filter(predicate).length
console.log(`Content readiness (${rows.length} active products)`)
console.log(`- English summary >= 110 characters: ${count((row) => row.englishSummaryLength >= 110)}/${rows.length}`)
console.log(`- Detailed English body: ${count((row) => row.hasDetailedEnglish)}/${rows.length}`)
console.log(`- Features or specifications: ${count((row) => row.hasFeatures || row.hasSpecifications)}/${rows.length}`)
console.log(`- Complete English SEO fields: ${count((row) => row.hasEnglishSeo)}/${rows.length}`)
console.log(`- Arabic explicitly approved and distinct: ${count((row) => row.arabicReady)}/${rows.length}`)
console.log(`- Technical review evidence: ${count((row) => row.hasReviewEvidence)}/${rows.length}`)
console.log(`- Claim/specification sources: ${count((row) => row.hasSources)}/${rows.length}`)

const priority = rows
  .filter((row) => row.englishSummaryLength < 110 || !row.hasDetailedEnglish || !(row.hasFeatures || row.hasSpecifications))
  .slice(0, 20)
if (priority.length) {
  console.log("\nPriority content queue:")
  priority.forEach((row) => console.log(`- ${row.slug}`))
}
