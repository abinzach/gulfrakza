import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

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
    <div className="bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-600">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumbs.map((item, index) => (
                <li key={item.item} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page">{item.name}</span>
                  ) : (
                    <Link href={new URL(item.item).pathname} className="hover:text-cyan-700 hover:underline">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            {activeLocale === "ar" ? "توريد صناعي في السعودية" : "Industrial supply in Saudi Arabia"}
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">{category.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{intro}</p>
          <p className="mt-4 text-sm text-slate-600">
            {activeLocale === "ar"
              ? `${categoryProducts.length} منتجًا متاحًا للاستفسار وعروض الأسعار.`
              : `${categoryProducts.length} products available for technical enquiry and quotation.`}
          </p>
        </div>
      </section>

      <section aria-labelledby="category-products" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {populatedChildren.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold">
              {activeLocale === "ar" ? `فئات ${category.title}` : `Browse ${category.title} categories`}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {populatedChildren.map((child) => (
                <Link
                  key={child.id}
                  href={categoryPath(activeLocale, child.path.map((segment) => segment.slug))}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-cyan-600 hover:shadow-sm"
                >
                  <h3 className="font-semibold text-slate-950">{child.title}</h3>
                  {child.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{child.description}</p>}
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-cyan-800">
                    {activeLocale === "ar" ? `${child.productCount} منتج` : `${child.productCount} products`}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 id="category-products" className="text-2xl font-bold">
            {activeLocale === "ar" ? `منتجات ${category.title}` : `${category.title} products`}
          </h2>
          <Link href={`/${activeLocale}/products?category=${encodeURIComponent(category.slug)}`} className="text-sm font-semibold text-cyan-800 hover:underline">
            {activeLocale === "ar" ? "فتح فلاتر الكتالوج" : "Open catalog filters"}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Link href={`/${activeLocale}/products/${product.slug}`} className="group block">
                <div className="relative aspect-[4/3] bg-white">
                  <Image src={product.imageSrc} alt={product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-contain p-5 transition group-hover:scale-[1.03]" />
                </div>
                <div className="border-t border-slate-100 p-5">
                  {product.brand && <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{product.brand}</p>}
                  <h3 className="mt-1 text-lg font-semibold group-hover:text-cyan-800">{product.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{product.description}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionSchema) }} />
    </div>
  )
}
