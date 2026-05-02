import { Fragment } from "react"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react"
import type { Metadata } from "next"
import Script from "next/script"
import Image from "next/image"
import { notFound } from "next/navigation"

import GetQuoteButton from "@/app/components/GetQuoteButton"
import ProductGallery from "@/app/components/Product/ProductGallery"
import ProductQuickActions from "@/app/components/Product/ProductQuickActions"
import ProductSectionNav from "@/app/components/Product/ProductSectionNav"
import MobileStickyBar from "@/app/components/Product/MobileStickyBar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { fetchCatalogData, fetchProductDetail } from "@/lib/catalog"
import { isLocale, type Locale, locales } from "@/i18n/config"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import { siteUrl } from "@/lib/constants"

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const { products } = await fetchCatalogData()
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : "en"
  const product = await fetchProductDetail(slug, activeLocale)

  if (!product) {
    return {
      title: "Product not found | GulfRakza",
    }
  }

  const fallbackTitle = `${product.title} | GulfRakza`
  const title = product.seoTitle || fallbackTitle
  const description = product.seoDescription || product.description
  const image = product.imageSrc
  const baseProductPath = `/${activeLocale}/products/${slug}`
  const canonicalUrl = `${siteUrl}${baseProductPath}`
  const languageAlternates = locales.reduce<Record<string, string>>((acc, loc) => {
    acc[loc] = `${siteUrl}/${loc}/products/${slug}`
    return acc
  }, {})
  languageAlternates["x-default"] = `${siteUrl}/products/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: image ? [{ url: image, width: 1200, height: 630, alt: product.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageValue = value as { asset?: unknown; alt?: string }
      if (!imageValue?.asset) return null
      const imageUrl = urlFor(imageValue).width(1400).fit("max").quality(85).url()
      if (!imageUrl) return null
      return (
        <div className="relative my-6 h-0 overflow-hidden rounded-xl border border-gray-200 bg-white pb-[56.25%] dark:border-gray-700 dark:bg-gray-900">
          <Image
            src={imageUrl}
            alt={imageValue.alt || "Product media"}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-contain"
          />
        </div>
      )
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
    ),
    h2: ({ children }) => (
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">{children}</ol>
    ),
  },
  marks: {
    externalLink: ({ children, value }) => {
      const linkValue = value as { href?: string; openInNewTab?: boolean } | undefined
      if (!linkValue?.href) {
        return <span>{children}</span>
      }
      return (
        <a
          href={linkValue.href}
          target={linkValue.openInNewTab ? "_blank" : undefined}
          rel={linkValue.openInNewTab ? "noopener noreferrer" : undefined}
          className="text-[#08778c] underline decoration-dotted underline-offset-4 transition hover:text-[#0bbfe0]"
        >
          {children}
        </a>
      )
    },
  },
}

const formatFileSize = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return ""
  const units = ["B", "KB", "MB", "GB"]
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  const value = size % 1 === 0 ? size.toFixed(0) : size.toFixed(1)
  return `${value} ${units[unitIndex]}`
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug, locale } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : "en"
  const product = await fetchProductDetail(slug, activeLocale)

  if (!product) {
    notFound()
  }

  // Fetch related products from catalog
  const { products: allProducts } = await fetchCatalogData(activeLocale)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.primaryCategory === product.primaryCategory)
    .slice(0, 8)

  const catalogBreadcrumb = [
    { label: "Products", href: "/products" },
    ...product.categoryTrail
      .filter((segment) => Boolean(segment.slug))
      .map((segment) => ({
        label: segment.title,
        href: `/products?category=${encodeURIComponent(segment.slug)}`,
      })),
    { label: product.title, href: null },
  ]

  const category = product.categoryTrail[0]?.title || product.primaryCategory || "General"
  const subcategory = product.categoryTrail[1]?.title || ""
  const itemCategory = product.categoryTrail[2]?.title || product.leafCategory || category
  const productPath = `/${activeLocale}/products/${product.slug}`
  const productUrl = `${siteUrl}${productPath}`
  const imageGallery = Array.from(new Set([product.imageSrc, ...product.gallery])).filter(Boolean)
  const isProductAvailable = product.stockStatus === "in_stock"
  const stockLabel = isProductAvailable ? "Ready to ship" : "Available on request"

  // Sub-nav sections — long-form content only (sizes & downloads now live in hero)
  const sections: Array<{ id: string; label: string }> = []
  if (product.richBody.length > 0) sections.push({ id: "overview", label: "Overview" })
  if (product.specs.length > 0) sections.push({ id: "specifications", label: "Specifications" })
  if (product.features.length > 0) sections.push({ id: "features", label: "Features" })

  // Trust strip items
  const trustItems = [
    { icon: ShieldCheck, label: "Quality assured" },
    { icon: Truck, label: "Ships from KSA" },
    { icon: Package, label: "Bulk pricing" },
    { icon: FileText, label: "RFQ in 24h" },
  ]

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.sku ?? undefined,
    url: productUrl,
    image: imageGallery,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    category: product.leafCategory ?? product.primaryCategory ?? undefined,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "SAR",
      availability: isProductAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      businessFunction: "https://purl.org/goodrelations/v1#Sell",
    },
    additionalProperty:
      product.specs.length > 0
        ? product.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.key,
            value: spec.values.join(", "),
          }))
        : undefined,
  }
  const breadcrumbItems = [
    {
      name: activeLocale === "ar" ? "الرئيسية" : "Home",
      item: `${siteUrl}/${activeLocale}`,
    },
    {
      name: activeLocale === "ar" ? "كتالوج المنتجات" : "Product Catalog",
      item: `${siteUrl}/${activeLocale}/products`,
    },
    ...product.categoryTrail
      .filter((segment) => Boolean(segment.slug))
      .map((segment) => ({
        name: segment.title,
        item: `${siteUrl}/${activeLocale}/products?category=${encodeURIComponent(segment.slug)}`,
      })),
    {
      name: product.title,
      item: productUrl,
    },
  ]
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50/50 pb-24 pt-16 dark:bg-gray-950 lg:pb-12">
        {/* Breadcrumb */}
        <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 sm:py-4">
            <Breadcrumb>
              <BreadcrumbList>
                {catalogBreadcrumb.map((item, index) => {
                  const isLast = index === catalogBreadcrumb.length - 1
                  return (
                    <Fragment key={`${item.label}-${index}`}>
                      <BreadcrumbItem>
                        {isLast || !item.href ? (
                          <BreadcrumbPage className="text-xs sm:text-sm">
                            {item.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              href={item.href}
                              className="text-xs sm:text-sm"
                              scroll={false}
                            >
                              {item.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < catalogBreadcrumb.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero — Gallery + Summary (everything actionable lives here) */}
        <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
            {/* Gallery */}
            <ProductGallery
              images={imageGallery}
              title={product.title}
              brand={product.brand}
              stockBadge={{ label: stockLabel, available: isProductAvailable }}
            />

            {/* Summary column */}
            <div className="flex flex-col">
              {/* Category trail */}
              {product.categoryTrail.length > 0 && (
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {product.categoryTrail.map((s) => s.title).join(" › ")}
                </p>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
                {product.title}
              </h1>

              {/* Inline meta */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                {product.brand && (
                  <span>
                    Brand{" "}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {product.brand}
                    </span>
                  </span>
                )}
                {product.brand && product.sku && (
                  <span className="text-gray-300 dark:text-gray-700">·</span>
                )}
                {product.sku && (
                  <span>
                    SKU{" "}
                    <span className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {product.sku}
                    </span>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {product.description}
              </p>

              {/* SIZES — inline, compact pill grid */}
              {product.sizeVariants.length > 0 && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" />
                        Available sizes
                      </span>
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {product.sizeVariants.length} option
                      {product.sizeVariants.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizeVariants.map((variant) => {
                      const isVariantAvailable =
                        typeof variant.stock === "number"
                          ? variant.stock > 0
                          : false
                      return (
                        <span
                          key={variant.label}
                          title={
                            isVariantAvailable
                              ? "Ready to ship"
                              : "Available on request"
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            isVariantAvailable
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-900/30 dark:text-emerald-200"
                              : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isVariantAvailable
                                ? "bg-emerald-500"
                                : "bg-gray-400"
                            }`}
                          />
                          {variant.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Trust strip */}
              <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-4">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-[#08778c] dark:text-[#35d2e9]" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              {/* Primary + secondary CTAs */}
              <div className="mt-6 space-y-3">
                <GetQuoteButton
                  productName={product.title}
                  productCategory={category}
                  productSubcategory={subcategory}
                  productItemCategory={itemCategory}
                />
                <ProductQuickActions
                  productName={product.title}
                  productCategory={[category, subcategory, itemCategory]
                    .filter(Boolean)
                    .join(" / ")}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Min. order qty:{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    1
                  </span>{" "}
                  · Volume discounts on request · Typical RFQ response within 24
                  hours
                </p>
              </div>

              {/* DOWNLOADS — inline, compact card list */}
              {product.resources.length > 0 && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <Download className="h-3.5 w-3.5" />
                      Downloads &amp; resources
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {product.resources.length} file
                      {product.resources.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {product.resources.map((resource) => {
                      const metaParts = [
                        resource.extension
                          ? resource.extension.toUpperCase()
                          : undefined,
                        formatFileSize(resource.size),
                      ].filter(Boolean)

                      return (
                        <li key={resource.url}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={resource.filename}
                            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 transition hover:border-[#08778c] hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:hover:bg-gray-800"
                          >
                            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#08778c]/10 text-[#08778c] transition group-hover:bg-[#08778c] group-hover:text-white dark:bg-[#08778c]/20 dark:text-[#35d2e9]">
                              <FileText className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {resource.title}
                              </p>
                              {metaParts.length > 0 && (
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  {metaParts.join(" · ")}
                                </p>
                              )}
                            </div>
                            <Download className="h-4 w-4 flex-shrink-0 text-gray-400 transition group-hover:text-[#08778c] dark:group-hover:text-[#35d2e9]" />
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Long-form sections (Overview / Specs / Features) */}
        {sections.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <ProductSectionNav sections={sections} />

            <div className="space-y-12 pb-12">
              {/* Overview */}
              {product.richBody.length > 0 && (
                <section
                  id="overview"
                  className="scroll-mt-32 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8"
                >
                  <header className="mb-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#08778c]/10 text-[#08778c] dark:bg-[#08778c]/20 dark:text-[#35d2e9]">
                      <FileText className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">
                      Detailed Overview
                    </h2>
                  </header>
                  <div className="max-w-3xl space-y-4">
                    <PortableText
                      value={product.richBody}
                      components={portableTextComponents}
                    />
                  </div>
                </section>
              )}

              {/* Specifications */}
              {product.specs.length > 0 && (
                <section
                  id="specifications"
                  className="scroll-mt-32 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8"
                >
                  <header className="mb-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#08778c]/10 text-[#08778c] dark:bg-[#08778c]/20 dark:text-[#35d2e9]">
                      <Layers className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">
                      Specifications
                    </h2>
                  </header>
                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                      {product.specs.map((spec, idx) => (
                        <div
                          key={spec.key}
                          className={`grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4 ${
                            idx % 2 === 0
                              ? "bg-gray-50/50 dark:bg-gray-800/30"
                              : "bg-white dark:bg-gray-900"
                          }`}
                        >
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {spec.key}
                          </dt>
                          <dd className="text-sm text-gray-900 sm:col-span-2 dark:text-gray-100">
                            {spec.values.join(", ")}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </section>
              )}

              {/* Features */}
              {product.features.length > 0 && (
                <section
                  id="features"
                  className="scroll-mt-32 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8"
                >
                  <header className="mb-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#08778c]/10 text-[#08778c] dark:bg-[#08778c]/20 dark:text-[#35d2e9]">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">
                      Key Features
                    </h2>
                  </header>
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">
                    You might also like
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    More from {category}
                  </p>
                </div>
                <Link
                  href="/products"
                  className="hidden items-center gap-1 text-sm font-semibold text-[#08778c] hover:text-[#0bbfe0] dark:text-[#35d2e9] sm:inline-flex"
                >
                  View catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => {
                  const trail = relatedProduct.categoryTrail
                    .map((s) => s.title)
                    .filter(Boolean)
                    .slice(0, 2)
                    .join(" › ")
                  return (
                    <Link
                      key={relatedProduct.id}
                      href={
                        relatedProduct.detailsHref ||
                        `/products/${relatedProduct.slug}`
                      }
                      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-[#08778c]/40 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                        <Image
                          src={relatedProduct.imageSrc || "/logo-rakza.png"}
                          alt={relatedProduct.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        {relatedProduct.brand && (
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {relatedProduct.brand}
                          </p>
                        )}
                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-[#08778c] dark:text-gray-100 dark:group-hover:text-[#35d2e9]">
                          {relatedProduct.title}
                        </h3>
                        {trail && (
                          <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                            {trail}
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                relatedProduct.isInStock
                                  ? "bg-emerald-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            {relatedProduct.isInStock
                              ? "Ready to ship"
                              : "On request"}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-[#08778c] dark:group-hover:text-[#35d2e9]" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile sticky bottom CTA */}
      <MobileStickyBar
        imageSrc={product.imageSrc}
        title={product.title}
        productName={product.title}
        productCategory={category}
        productSubcategory={subcategory}
        productItemCategory={itemCategory}
      />

      <Script id={`product-schema-${product.slug}`} type="application/ld+json">
        {JSON.stringify(productSchema)}
      </Script>
      <Script id={`breadcrumb-schema-${product.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
    </>
  )
}
