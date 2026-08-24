import { Fragment } from "react"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { ArrowRight, CheckCircle2, Download, FileText, Package } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import GetQuoteButton from "@/app/components/GetQuoteButton"
import MobileStickyBar from "@/app/components/Product/MobileStickyBar"
import ProductGallery from "@/app/components/Product/ProductGallery"
import ProductQuickActions from "@/app/components/Product/ProductQuickActions"
import ProductSectionNav from "@/app/components/Product/ProductSectionNav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { siteUrl } from "@/lib/constants"
import { fetchCatalogData, fetchProductDetail } from "@/lib/catalog"
import { serializeJsonLd } from "@/lib/seo/json-ld"
import { isLocale, type Locale } from "@/i18n/config"
import { urlFor } from "@/sanity/lib/image"

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>
}

const productCopy = {
  en: {
    products: "Products",
    brand: "Brand",
    sku: "SKU / model",
    availability: "Availability",
    productType: "Product type",
    inStock: "In stock",
    onRequest: "Available on request",
    keySpecifications: "Decision specifications",
    availableSizes: "Available sizes",
    option: "option",
    options: "options",
    resources: "Documents and resources",
    file: "file",
    files: "files",
    requestTitle: "Request pricing and availability",
    requestBody: "Include quantity, required delivery date, and any compliance or documentation requirements.",
    missingDetail: "Need a specification that is not listed? Add it to the enquiry and the GulfRakza team can confirm it with the quotation.",
    technicalInformation: "Technical information",
    overview: "Overview",
    specifications: "Specifications",
    features: "Features and applications",
    reviewedBy: "Technically reviewed by:",
    lastReviewed: "Last reviewed:",
    relatedProducts: "Related products",
    moreFrom: "More from",
    viewCatalog: "View catalog",
    image: "Image",
    of: "of",
    openImage: "Open image",
    closeImage: "Close image",
    previousImage: "Previous image",
    nextImage: "Next image",
  },
  ar: {
    products: "المنتجات",
    brand: "العلامة التجارية",
    sku: "رقم الصنف / الموديل",
    availability: "التوفر",
    productType: "نوع المنتج",
    inStock: "متوفر",
    onRequest: "متوفر عند الطلب",
    keySpecifications: "المواصفات الأساسية للاختيار",
    availableSizes: "المقاسات المتاحة",
    option: "خيار",
    options: "خيارات",
    resources: "المستندات والموارد",
    file: "ملف",
    files: "ملفات",
    requestTitle: "اطلب السعر وحالة التوفر",
    requestBody: "أرفق الكمية وتاريخ التسليم المطلوب وأي متطلبات للامتثال أو المستندات.",
    missingDetail: "هل تحتاج إلى مواصفة غير مدرجة؟ أضفها إلى الاستفسار ليؤكدها فريق جلف ركزة ضمن عرض السعر.",
    technicalInformation: "المعلومات الفنية",
    overview: "نظرة عامة",
    specifications: "المواصفات",
    features: "الميزات والاستخدامات",
    reviewedBy: "تمت المراجعة الفنية بواسطة:",
    lastReviewed: "آخر مراجعة:",
    relatedProducts: "منتجات ذات صلة",
    moreFrom: "المزيد من",
    viewCatalog: "عرض الكتالوج",
    image: "صورة",
    of: "من",
    openImage: "تكبير الصورة",
    closeImage: "إغلاق الصورة",
    previousImage: "الصورة السابقة",
    nextImage: "الصورة التالية",
  },
} as const

export async function generateStaticParams() {
  const { products } = await fetchCatalogData()
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : "en"
  const product = await fetchProductDetail(slug, activeLocale)

  if (!product) {
    return { title: "Product not found | GulfRakza" }
  }

  const fallbackTitle = `${product.title} | GulfRakza`
  const title = product.seoTitle || fallbackTitle
  const baseDescription = product.seoDescription || product.description
  const description = baseDescription.length >= 110
    ? baseDescription
    : activeLocale === "ar"
      ? `${baseDescription} متاح للاستفسار الفني وعروض الأسعار من جلف ركزة في الدمام والمملكة العربية السعودية.`
      : `${baseDescription} Available for technical enquiry and quotation from GulfRakza in Dammam, Saudi Arabia.`
  const image = product.imageSrc
  const baseProductPath = `/${activeLocale}/products/${slug}`
  const canonicalUrl = `${siteUrl}${baseProductPath}`
  const languageAlternates: Record<string, string> = {
    en: `${siteUrl}/en/products/${slug}`,
    "x-default": `${siteUrl}/en/products/${slug}`,
  }
  if (product.isArabicIndexable) {
    languageAlternates.ar = `${siteUrl}/ar/products/${slug}`
  }

  return {
    title,
    description,
    robots: activeLocale === "ar" && !product.isArabicIndexable
      ? { index: false, follow: true }
      : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: image ? [{ url: image, width: 1600, height: 1200, alt: product.title }] : undefined,
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
      const imageUrl = urlFor(imageValue).width(1600).fit("max").quality(88).url()
      if (!imageUrl) return null
      return (
        <figure className="relative my-8 aspect-video overflow-hidden border border-[var(--color-rule)] bg-[var(--color-surface)]">
          <Image
            src={imageUrl}
            alt={imageValue.alt || "Product media"}
            fill
            sizes="(max-width: 1024px) calc(100vw - 48px), 860px"
            className="object-contain"
          />
        </figure>
      )
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="max-w-[70ch] text-base leading-7 text-[var(--color-ink-2)]">{children}</p>
    ),
    h2: ({ children }) => (
      <h3 className="font-hanken text-2xl font-semibold text-[var(--color-ink)]">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="font-hanken text-xl font-semibold text-[var(--color-ink)]">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-5 max-w-[70ch] list-disc space-y-2 text-[var(--color-ink-2)]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="ml-5 max-w-[70ch] list-decimal space-y-2 text-[var(--color-ink-2)]">{children}</ol>
    ),
  },
  marks: {
    externalLink: ({ children, value }) => {
      const linkValue = value as { href?: string; openInNewTab?: boolean } | undefined
      if (!linkValue?.href) return <span>{children}</span>
      return (
        <a
          href={linkValue.href}
          target={linkValue.openInNewTab ? "_blank" : undefined}
          rel={linkValue.openInNewTab ? "noopener noreferrer" : undefined}
          className="font-medium text-[var(--color-accent-strong)] underline decoration-dotted underline-offset-4 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
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
  const copy = productCopy[activeLocale]
  const product = await fetchProductDetail(slug, activeLocale)

  if (!product) notFound()

  const { products: allProducts } = await fetchCatalogData(activeLocale)
  const relatedProducts = allProducts
    .filter((item) => item.id !== product.id && item.primaryCategory === product.primaryCategory)
    .slice(0, 4)

  const catalogBreadcrumb = [
    { label: copy.products, href: `/${activeLocale}/products` },
    ...product.categoryTrail
      .filter((segment) => Boolean(segment.slug))
      .map((segment, index) => ({
        label: segment.title,
        href: `/${activeLocale}/products/category/${product.categoryTrail.slice(0, index + 1).map((item) => encodeURIComponent(item.slug)).join("/")}`,
      })),
    { label: product.title, href: null },
  ]

  const category = product.categoryTrail[0]?.title || product.primaryCategory || "General"
  const subcategory = product.categoryTrail[1]?.title || ""
  const itemCategory = product.categoryTrail[2]?.title || ""
  const productType = product.leafCategory || subcategory || category
  const productPath = `/${activeLocale}/products/${product.slug}`
  const productUrl = `${siteUrl}${productPath}`
  const imageGallery = Array.from(new Set([product.imageSrc, ...product.gallery])).filter(Boolean)
  const isProductAvailable = product.stockStatus === "in_stock"
  const stockLabel = isProductAvailable ? copy.inStock : copy.onRequest
  const isSparseProduct =
    product.specs.length === 0 &&
    product.features.length === 0 &&
    product.richBody.length === 0 &&
    product.resources.length === 0

  const sections: Array<{ id: string; label: string }> = []
  if (product.richBody.length > 0) sections.push({ id: "overview", label: copy.overview })
  if (product.specs.length > 0) sections.push({ id: "specifications", label: copy.specifications })
  if (product.features.length > 0) sections.push({ id: "features", label: copy.features })

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    mainEntityOfPage: productUrl,
    name: product.title,
    description: product.description,
    sku: product.sku ?? undefined,
    url: productUrl,
    image: imageGallery,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    category: product.leafCategory ?? product.primaryCategory ?? undefined,
    additionalProperty: product.specs.length > 0
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
      .map((segment, index) => ({
        name: segment.title,
        item: `${siteUrl}/${activeLocale}/products/category/${product.categoryTrail.slice(0, index + 1).map((item) => encodeURIComponent(item.slug)).join("/")}`,
      })),
    { name: product.title, item: productUrl },
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
      <main className="min-h-screen bg-[var(--color-paper)] pb-24 pt-16 font-inter text-[var(--color-ink)] lg:pb-12">
        <div className="border-b border-[var(--color-rule)] bg-[var(--color-surface)]">
          <div className="mx-auto w-[calc(100%-3rem)] max-w-7xl overflow-x-auto py-3 lg:w-[calc(100%-6rem)]">
            <Breadcrumb>
              <BreadcrumbList className="flex-nowrap whitespace-nowrap">
                {catalogBreadcrumb.map((item, index) => {
                  const isLast = index === catalogBreadcrumb.length - 1
                  return (
                    <Fragment key={`${item.label}-${index}`}>
                      <BreadcrumbItem className="whitespace-nowrap">
                        {isLast || !item.href ? (
                          <BreadcrumbPage className="max-w-64 truncate text-xs sm:max-w-96 sm:text-sm">
                            {item.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              href={item.href}
                              className="whitespace-nowrap text-xs active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] sm:text-sm"
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

        <header className="border-b border-[var(--color-rule)] bg-[var(--color-paper-2)]">
          <div className="mx-auto grid w-[calc(100%-3rem)] max-w-7xl grid-cols-[minmax(0,1fr)] gap-7 py-7 lg:w-[calc(100%-6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.42fr)] lg:items-end lg:gap-12 lg:py-10">
            <div className="min-w-0">
              {product.categoryTrail.length > 0 && (
                <p className="mb-3 text-xs font-semibold tracking-[0.08em] text-[var(--color-accent-strong)]">
                  {product.categoryTrail.map((segment) => segment.title).join(" › ")}
                </p>
              )}
              <h1 className="min-w-0 [overflow-wrap:anywhere] font-hanken text-3xl font-semibold leading-[1.06] tracking-[-0.035em] text-[var(--color-ink)] sm:text-4xl lg:text-5xl">
                {product.title}
              </h1>
            </div>

            <dl className="border-t border-[var(--color-rule-strong)] text-sm tabular-nums">
              {product.brand && (
                <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-b border-[var(--color-rule)] py-3">
                  <dt className="text-xs font-semibold text-[var(--color-muted)]">{copy.brand}</dt>
                  <dd className="min-w-0 break-words font-semibold text-[var(--color-ink)]">{product.brand}</dd>
                </div>
              )}
              {product.sku && (
                <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-b border-[var(--color-rule)] py-3">
                  <dt className="text-xs font-semibold text-[var(--color-muted)]">{copy.sku}</dt>
                  <dd className="min-w-0 break-words font-mono text-xs font-semibold text-[var(--color-ink)]">{product.sku}</dd>
                </div>
              )}
              <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-b border-[var(--color-rule)] py-3">
                <dt className="text-xs font-semibold text-[var(--color-muted)]">{copy.availability}</dt>
                <dd className="flex min-w-0 items-center gap-2 font-semibold text-[var(--color-ink)]">
                  <span className={`h-2 w-2 flex-shrink-0 ${isProductAvailable ? "bg-[var(--color-success)]" : "bg-[var(--color-muted)]"}`} aria-hidden="true" />
                  {stockLabel}
                </dd>
              </div>
              <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-b border-[var(--color-rule)] py-3">
                <dt className="text-xs font-semibold text-[var(--color-muted)]">{copy.productType}</dt>
                <dd className="min-w-0 break-words font-semibold text-[var(--color-ink)]">{productType}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div id="pdp-sticky-sentinel" aria-hidden="true" />

        <section className="mx-auto w-[calc(100%-3rem)] max-w-7xl py-8 lg:w-[calc(100%-6rem)] lg:py-12">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.16fr)_minmax(23rem,0.84fr)] lg:gap-12">
            <ProductGallery
              images={imageGallery}
              title={product.title}
              labels={{
                openImage: copy.openImage,
                closeImage: copy.closeImage,
                previousImage: copy.previousImage,
                nextImage: copy.nextImage,
                image: copy.image,
                of: copy.of,
              }}
            />

            <aside className="min-w-0 space-y-7 lg:sticky lg:top-24 lg:self-start">
              <p className="max-w-[62ch] text-base leading-7 text-[var(--color-ink-2)]">
                {product.description}
              </p>

              <section id="pdp-primary-quote" className="border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-5 sm:p-6" aria-labelledby="quote-title">
                <h2 id="quote-title" className="font-hanken text-xl font-semibold text-[var(--color-ink)]">
                  {copy.requestTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{copy.requestBody}</p>
                <div className="mt-5 space-y-3">
                  <GetQuoteButton
                    productName={product.title}
                    productCategory={category}
                    productSubcategory={subcategory}
                    productItemCategory={itemCategory}
                  />
                  <ProductQuickActions
                    productName={product.title}
                    productCategory={[category, subcategory, itemCategory].filter(Boolean).join(" / ")}
                    locale={activeLocale}
                  />
                </div>
              </section>

              {product.specs.length > 0 && (
                <section aria-labelledby="decision-specs-title">
                  <h2 id="decision-specs-title" className="mb-3 font-hanken text-lg font-semibold text-[var(--color-ink)]">
                    {copy.keySpecifications}
                  </h2>
                  <dl className="border-t border-[var(--color-rule-strong)] text-sm">
                    {product.specs.slice(0, 4).map((spec) => (
                      <div key={spec.key} className="grid grid-cols-[minmax(7.5rem,0.48fr)_minmax(0,1fr)] gap-4 border-b border-[var(--color-rule)] py-3">
                        <dt className="font-medium text-[var(--color-muted)]">{spec.key}</dt>
                        <dd className="min-w-0 break-words font-semibold text-[var(--color-ink)]">{spec.values.join(", ")}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {product.sizeVariants.length > 0 && (
                <section aria-labelledby="sizes-title">
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <h2 id="sizes-title" className="inline-flex items-center gap-2 font-hanken text-lg font-semibold text-[var(--color-ink)]">
                      <Package className="h-4 w-4" aria-hidden="true" />
                      {copy.availableSizes}
                    </h2>
                    <span className="whitespace-nowrap text-xs tabular-nums text-[var(--color-muted)]">
                      {product.sizeVariants.length} {product.sizeVariants.length === 1 ? copy.option : copy.options}
                    </span>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {product.sizeVariants.map((variant) => {
                      const isVariantAvailable = typeof variant.stock === "number" && variant.stock > 0
                      return (
                        <li
                          key={variant.label}
                          className={`inline-flex min-h-10 items-center gap-2 border px-3 py-2 text-xs font-semibold ${
                            isVariantAvailable
                              ? "border-[var(--color-success)] bg-[var(--color-success-paper)] text-[var(--color-success)]"
                              : "border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink-2)]"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 ${isVariantAvailable ? "bg-[var(--color-success)]" : "bg-[var(--color-muted)]"}`} aria-hidden="true" />
                          {variant.label}
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}

              {product.resources.length > 0 && (
                <section aria-labelledby="resources-title">
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <h2 id="resources-title" className="inline-flex items-center gap-2 font-hanken text-lg font-semibold text-[var(--color-ink)]">
                      <Download className="h-4 w-4" aria-hidden="true" />
                      {copy.resources}
                    </h2>
                    <span className="whitespace-nowrap text-xs tabular-nums text-[var(--color-muted)]">
                      {product.resources.length} {product.resources.length === 1 ? copy.file : copy.files}
                    </span>
                  </div>
                  <ul className="border-t border-[var(--color-rule-strong)]">
                    {product.resources.map((resource) => {
                      const metaParts = [
                        resource.extension ? resource.extension.toUpperCase() : undefined,
                        formatFileSize(resource.size),
                      ].filter(Boolean)

                      return (
                        <li key={resource.url} className="border-b border-[var(--color-rule)]">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={resource.filename}
                              className="group flex min-h-14 items-center gap-3 py-3 active:bg-[var(--color-paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
                          >
                            <FileText className="h-5 w-5 flex-shrink-0 text-[var(--color-accent-strong)]" aria-hidden="true" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent-strong)]">
                                {resource.title}
                              </span>
                              {metaParts.length > 0 && (
                                <span className="block text-xs tabular-nums text-[var(--color-muted)]">{metaParts.join(" · ")}</span>
                              )}
                            </span>
                            <Download className="h-4 w-4 flex-shrink-0 text-[var(--color-muted)]" aria-hidden="true" />
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}

              {isSparseProduct && (
                <p className="border-t border-[var(--color-rule)] pt-4 text-sm leading-6 text-[var(--color-muted)]">
                  {copy.missingDetail}
                </p>
              )}
            </aside>
          </div>
        </section>

        {sections.length > 0 && (
          <section className="border-t border-[var(--color-rule-strong)] bg-[var(--color-surface)]">
          <div className="mx-auto grid w-[calc(100%-3rem)] max-w-7xl grid-cols-[minmax(0,1fr)] gap-8 py-10 lg:w-[calc(100%-6rem)] lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14 lg:py-14">
              <ProductSectionNav sections={sections} label={copy.technicalInformation} />

              <div className="min-w-0 border-t border-[var(--color-rule-strong)]">
                {product.richBody.length > 0 && (
                  <section id="overview" className="scroll-mt-32 border-b border-[var(--color-rule)] py-8 sm:py-10">
                    <h2 className="mb-6 font-hanken text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
                      {copy.overview}
                    </h2>
                    <div className="space-y-5">
                      <PortableText value={product.richBody} components={portableTextComponents} />
                    </div>
                  </section>
                )}

                {product.specs.length > 0 && (
                  <section id="specifications" className="scroll-mt-32 border-b border-[var(--color-rule)] py-8 sm:py-10">
                    <h2 className="mb-6 font-hanken text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
                      {copy.specifications}
                    </h2>
                    <dl className="border-t border-[var(--color-rule-strong)] text-sm sm:text-base">
                      {product.specs.map((spec, index) => (
                        <div
                          key={spec.key}
                          className={`grid grid-cols-1 gap-1 border-b border-[var(--color-rule)] px-3 py-3 sm:grid-cols-[minmax(11rem,0.42fr)_minmax(0,1fr)] sm:gap-8 sm:px-4 ${
                            index % 2 === 0 ? "bg-[var(--color-paper-2)]" : "bg-[var(--color-surface)]"
                          }`}
                        >
                          <dt className="font-medium text-[var(--color-muted)]">{spec.key}</dt>
                          <dd className="min-w-0 break-words font-medium text-[var(--color-ink)]">{spec.values.join(", ")}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}

                {product.features.length > 0 && (
                  <section id="features" className="scroll-mt-32 border-b border-[var(--color-rule)] py-8 sm:py-10">
                    <h2 className="mb-6 font-hanken text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
                      {copy.features}
                    </h2>
                  <ul className="grid grid-cols-[minmax(0,1fr)] border-l border-t border-[var(--color-rule)] sm:grid-cols-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex min-w-0 items-start gap-3 border-b border-r border-[var(--color-rule)] p-4 text-sm leading-6 text-[var(--color-ink-2)]">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-success)]" aria-hidden="true" />
                          <span className="min-w-0 break-words">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {(product.reviewedBy || product.lastReviewedAt) && (
                  <section aria-label={activeLocale === "ar" ? "مراجعة المحتوى" : "Content review"} className="border-b border-[var(--color-rule)] py-6 text-sm text-[var(--color-muted)]">
                    {product.reviewedBy && (
                      <span>{copy.reviewedBy} <strong className="text-[var(--color-ink)]">{product.reviewedBy}</strong></span>
                    )}
                    {product.reviewedBy && product.lastReviewedAt && <span aria-hidden="true"> · </span>}
                    {product.lastReviewedAt && (
                      <time dateTime={product.lastReviewedAt}>
                        {copy.lastReviewed} {new Intl.DateTimeFormat(activeLocale === "ar" ? "ar-SA" : "en-SA", { dateStyle: "medium" }).format(new Date(product.lastReviewedAt))}
                      </time>
                    )}
                  </section>
                )}
              </div>
            </div>
          </section>
        )}

        {sections.length === 0 && (product.reviewedBy || product.lastReviewedAt) && (
          <section aria-label={activeLocale === "ar" ? "مراجعة المحتوى" : "Content review"} className="mx-auto w-[calc(100%-3rem)] max-w-7xl border-t border-[var(--color-rule)] py-6 text-sm text-[var(--color-muted)] lg:w-[calc(100%-6rem)]">
            {product.reviewedBy && (
              <span>{copy.reviewedBy} <strong className="text-[var(--color-ink)]">{product.reviewedBy}</strong></span>
            )}
            {product.reviewedBy && product.lastReviewedAt && <span aria-hidden="true"> · </span>}
            {product.lastReviewedAt && (
              <time dateTime={product.lastReviewedAt}>
                {copy.lastReviewed} {new Intl.DateTimeFormat(activeLocale === "ar" ? "ar-SA" : "en-SA", { dateStyle: "medium" }).format(new Date(product.lastReviewedAt))}
              </time>
            )}
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="border-t border-[var(--color-rule-strong)] bg-[var(--color-paper-2)]">
            <div className="mx-auto w-[calc(100%-3rem)] max-w-7xl py-10 sm:py-14 lg:w-[calc(100%-6rem)]">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-hanken text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
                    {copy.relatedProducts}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{copy.moreFrom} {category}</p>
                </div>
                <Link
                  href={`/${activeLocale}/products`}
                  className="hidden min-h-11 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[var(--color-accent-strong)] active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] sm:inline-flex"
                >
                  {copy.viewCatalog}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] border-l border-t border-[var(--color-rule)] bg-transparent sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => {
                  const trail = relatedProduct.categoryTrail.map((segment) => segment.title).filter(Boolean).slice(0, 2).join(" › ")
                  return (
                    <Link
                      key={relatedProduct.id}
                      href={`/${activeLocale}/products/${relatedProduct.slug}`}
                      className="group flex min-w-0 flex-col overflow-hidden border-b border-r border-[var(--color-rule)] bg-[var(--color-surface)] active:bg-[var(--color-paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-inset"
                    >
                      <div className="relative aspect-[4/3] min-w-0 overflow-hidden border-b border-[var(--color-rule)] bg-[var(--color-paper)]">
                        <Image
                          src={relatedProduct.imageSrc || "/logo-rakza.png"}
                          alt={relatedProduct.title}
                          fill
                          sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-5"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col p-4">
                        {relatedProduct.brand && (
                          <p className="mb-1 truncate text-xs font-semibold text-[var(--color-muted)]">{relatedProduct.brand}</p>
                        )}
                        <h3 className="line-clamp-2 min-w-0 font-hanken text-base font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent-strong)]">
                          {relatedProduct.title}
                        </h3>
                        {trail && <p className="mt-1 truncate text-xs text-[var(--color-muted)]">{trail}</p>}
                        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                          <span className="inline-flex min-w-0 items-center gap-2 truncate text-xs font-medium text-[var(--color-muted)]">
                            <span className={`h-1.5 w-1.5 flex-shrink-0 ${relatedProduct.isInStock ? "bg-[var(--color-success)]" : "bg-[var(--color-muted)]"}`} aria-hidden="true" />
                            {relatedProduct.isInStock ? copy.inStock : copy.onRequest}
                          </span>
                          <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--color-muted)]" aria-hidden="true" />
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

      <MobileStickyBar
        imageSrc={product.imageSrc}
        title={product.title}
        productName={product.title}
        productCategory={category}
        productSubcategory={subcategory}
        productItemCategory={itemCategory}
      />

      <script
        id={`product-schema-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productSchema) }}
      />
      <script
        id={`breadcrumb-schema-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
    </>
  )
}
