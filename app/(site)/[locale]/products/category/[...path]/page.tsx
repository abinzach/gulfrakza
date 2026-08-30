import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"

import SanityImage from "@/app/components/SanityImage"
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config"
import { fetchCatalogData, findCategoryByPath, flattenCategoryTree } from "@/lib/catalog"
import { siteUrl } from "@/lib/constants"
import { serializeJsonLd } from "@/lib/seo/json-ld"

type CategoryPageProps = {
  params: Promise<{ locale: string; path: string[] }>
}

const categoryPath = (locale: Locale, path: string[]) =>
  `/${locale}/products/category/${path.map(encodeURIComponent).join("/")}`

export async function generateStaticParams() {
  const { categoryTree } = await fetchCatalogData("en")
  const paths = flattenCategoryTree(categoryTree)
    .filter((category) => category.productCount > 0)
    .map((category) => category.path.map((segment) => segment.slug))

  return locales.flatMap((locale) => paths.map((path) => ({ locale, path })))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, path } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale
  const { categoryTree } = await fetchCatalogData(activeLocale)
  const category = findCategoryByPath(categoryTree, path)
  if (!category || category.productCount === 0) notFound()

  const canonical = `${siteUrl}${categoryPath(activeLocale, path)}`
  const baseDescription = category.description || ""
  const regionalDescription = activeLocale === "ar"
    ? `تصفح منتجات ${category.title} الصناعية المتاحة من جلف ركزة للاستفسار وعروض الأسعار في الدمام والمملكة العربية السعودية.`
    : `Browse ${category.title} products available for technical enquiry and quotation from GulfRakza in Dammam and across Saudi Arabia.`
  const description = baseDescription.length >= 110 ? baseDescription : `${baseDescription} ${regionalDescription}`.trim()
  const title = activeLocale === "ar"
    ? `${category.title} في الدمام | جلف ركزة`
    : `${category.title} Supplier in Dammam | GulfRakza`
  const alternatePath = category.path.map((segment) => segment.slug)
  const languages: Record<string, string> = {
    en: `${siteUrl}${categoryPath("en", alternatePath)}`,
    "x-default": `${siteUrl}${categoryPath("en", alternatePath)}`,
  }
  if (category.isArabicIndexable) {
    languages.ar = `${siteUrl}${categoryPath("ar", alternatePath)}`
  }

  return {
    title,
    description,
    robots: activeLocale === "ar" && !category.isArabicIndexable ? { index: false, follow: true } : undefined,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: activeLocale === "ar" ? "ar_SA" : "en_US",
      images: [{ url: category.heroImageUrl || `${siteUrl}/og-image.jpg` }],
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, path } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale
  const { categoryTree, products } = await fetchCatalogData(activeLocale)
  const category = findCategoryByPath(categoryTree, path)
  if (!category || category.productCount === 0) notFound()

  const categoryProducts = products.filter((product) => product.categorySlugs.includes(category.slug))
  const populatedChildren = category.children.filter((child) => child.productCount > 0)
  const canonicalPath = categoryPath(activeLocale, path)
  const regionalIntro = activeLocale === "ar"
    ? `حلول ${category.title} للمنشآت الصناعية والمقاولين وفرق الصيانة في المنطقة الشرقية وجميع أنحاء المملكة.`
    : `${category.title} solutions for industrial facilities, contractors, and maintenance teams in the Eastern Province and across Saudi Arabia.`
  const intro = category.description && category.description.length >= 80
    ? category.description
    : `${category.description || ""} ${regionalIntro}`.trim()
  const breadcrumbs = [
    { name: activeLocale === "ar" ? "الرئيسية" : "Home", item: `${siteUrl}/${activeLocale}` },
    { name: activeLocale === "ar" ? "المنتجات" : "Products", item: `${siteUrl}/${activeLocale}/products` },
    ...category.path.map((segment, index) => ({
      name: segment.title,
      item: `${siteUrl}${categoryPath(activeLocale, category.path.slice(0, index + 1).map((item) => item.slug))}`,
    })),
  ]
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: intro,
    url: `${siteUrl}${canonicalPath}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categoryProducts.length,
      itemListElement: categoryProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/${activeLocale}/products/${product.slug}`,
        name: product.title,
      })),
    },
  }

  return (
    <div className="min-h-screen bg-[#f4f5f5] pt-16 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-700 bg-[#101315] text-white">
        <div className="mx-auto w-[calc(100%-3rem)] max-w-7xl py-10 sm:py-14 lg:w-[calc(100%-6rem)] lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm text-slate-400">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumbs.map((item, index) => (
                <li key={item.item} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page">{item.name}</span>
                  ) : (
                    <Link href={new URL(item.item).pathname} className="hover:text-cyan-300 hover:underline">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            {activeLocale === "ar" ? "توريد صناعي في السعودية" : "Industrial supply in Saudi Arabia"}
          </p>
          <h1 className="max-w-5xl text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">{category.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{intro}</p>
          <p className="mt-6 border-l-2 border-cyan-400 pl-4 font-mono text-sm tabular-nums text-slate-300">
            {activeLocale === "ar"
              ? `${categoryProducts.length} منتجًا متاحًا للاستفسار وعروض الأسعار.`
              : `${categoryProducts.length} products available for technical enquiry and quotation.`}
          </p>
        </div>
      </section>

      <section aria-labelledby="category-products" className="mx-auto w-[calc(100%-3rem)] max-w-7xl py-10 lg:w-[calc(100%-6rem)] lg:py-14">
        {populatedChildren.length > 0 && (
          <div className="mb-14">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-300 pb-4 dark:border-slate-700">
              <h2 className="text-2xl font-black tracking-tight">
              {activeLocale === "ar" ? `فئات ${category.title}` : `Browse ${category.title} categories`}
              </h2>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
                {populatedChildren.length} {activeLocale === "ar" ? "فئات" : "categories"}
              </span>
            </div>
            <div className="grid border-l border-t border-slate-300 bg-transparent dark:border-slate-700 sm:grid-cols-2 lg:grid-cols-3">
              {populatedChildren.map((child) => (
                <Link
                  key={child.id}
                  href={categoryPath(activeLocale, child.path.map((segment) => segment.slug))}
                  className="group flex min-h-40 flex-col border-b border-r border-slate-300 bg-white p-5 transition hover:bg-slate-950 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-950"
                >
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="text-lg font-black tracking-tight">{child.title}</h3>
                    <ArrowRight className="h-5 w-5 shrink-0 text-cyan-700 transition-transform group-hover:translate-x-1 group-hover:text-cyan-300" />
                  </div>
                  {child.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 group-hover:text-slate-300 dark:text-slate-300 dark:group-hover:text-slate-700">{child.description}</p>}
                  <p className="mt-auto pt-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-800 group-hover:text-cyan-300 dark:text-cyan-300 dark:group-hover:text-cyan-800">
                    {activeLocale === "ar" ? `${child.productCount} منتج` : `${child.productCount} products`}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-slate-300 pb-4 dark:border-slate-700">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-800 dark:text-cyan-300">
              {activeLocale === "ar" ? "قائمة المنتجات" : "Product list"}
            </p>
            <h2 id="category-products" className="text-2xl font-black tracking-tight">
            {activeLocale === "ar" ? `منتجات ${category.title}` : `${category.title} products`}
            </h2>
          </div>
          <Link href={`/${activeLocale}/products?category=${encodeURIComponent(category.slug)}`} className="inline-flex min-h-11 items-center gap-3 border border-slate-950 bg-slate-950 px-4 text-sm font-bold text-white transition hover:border-cyan-800 hover:bg-cyan-800 dark:border-white dark:bg-white dark:text-slate-950">
            {activeLocale === "ar" ? "فتح فلاتر الكتالوج" : "Open catalog filters"}
            <ArrowRight className={`h-4 w-4 ${activeLocale === "ar" ? "rotate-180" : ""}`} />
          </Link>
        </div>
        <div className="grid border-l border-t border-slate-300 bg-transparent dark:border-slate-700 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryProducts.map((product, index) => {
            const productHref = `/${activeLocale}/products/${product.slug}`
            const highlights = product.specs.slice(0, 2)
            return (
              <article key={product.id} className="group flex min-w-0 flex-col border-b border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
                <Link href={productHref} className="relative block aspect-[4/3] overflow-hidden border-b border-slate-200 bg-[#fafafa] dark:border-slate-800 dark:bg-slate-950">
                  <SanityImage src={product.imageSrc || "/logo-rakza.png"} alt={product.title} fill priority={index < 4} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-contain p-6 transition group-hover:scale-[1.025]" />
                  <span className={`absolute left-0 top-0 border-b border-r px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] ${product.isInStock ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "border-slate-400 bg-white text-slate-700"}`}>
                    {product.isInStock ? (activeLocale === "ar" ? "متوفر" : "Available") : (activeLocale === "ar" ? "حسب الطلب" : "On request")}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  {product.brand && <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-800 dark:text-cyan-300">{product.brand}</p>}
                  <h3 className="mt-2 text-lg font-black leading-snug tracking-[-0.02em]">
                    <Link href={productHref} className="decoration-cyan-600 decoration-2 underline-offset-4 hover:underline">{product.title}</Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>
                  {highlights.length > 0 && (
                    <dl className="mt-4 border-t border-slate-200 text-xs dark:border-slate-800">
                      {highlights.map((spec) => (
                        <div key={spec.key} className="grid grid-cols-2 gap-3 border-b border-slate-200 py-2.5 dark:border-slate-800">
                          <dt className="font-semibold text-slate-500">{spec.key}</dt>
                          <dd className="text-right font-medium">{spec.values.join(", ")}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <Link href={productHref} className="mt-auto flex min-h-11 items-center justify-between border border-slate-950 bg-slate-950 px-4 pt-0 text-sm font-bold text-white transition hover:bg-cyan-800 dark:border-white dark:bg-white dark:text-slate-950">
                    {activeLocale === "ar" ? "عرض المنتج" : "View product"}
                    <ArrowRight className={`h-4 w-4 ${activeLocale === "ar" ? "rotate-180" : ""}`} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionSchema) }} />
    </div>
  )
}
