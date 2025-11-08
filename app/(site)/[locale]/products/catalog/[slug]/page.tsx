import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { Download } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import GetQuoteButton from "@/app/components/GetQuoteButton"
import { fetchCatalogData, fetchProductDetail } from "@/lib/catalog"
import { isLocale, type Locale } from "@/i18n/config"
import { Link } from "@/navigation"
import { urlFor } from "@/sanity/lib/image"

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
      title: "Product not found | Gulf Rakza Trading",
    }
  }

  const fallbackTitle = `${product.title} | Gulf Rakza Trading`
  const title = product.seoTitle || fallbackTitle
  const description = product.seoDescription || product.description
  const image = product.imageSrc

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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

const stockStatusStyles = {
  in_stock: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
  out_of_stock: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200",
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
          className="text-cyan-600 underline decoration-dotted underline-offset-4 transition hover:text-cyan-500"
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

  const stockBadgeClass = stockStatusStyles[product.stockStatus]
  const breadcrumb = [
    { label: "Products", href: "/products/catalog" },
    ...product.categoryTrail
      .filter((segment) => Boolean(segment.slug))
      .map((segment) => ({
        label: segment.title,
        href: `/products/catalog?category=${encodeURIComponent(segment.slug)}`,
      })),
    { label: product.title },
  ]

  const category = product.categoryTrail[0]?.title || product.primaryCategory || "General"
  const subcategory = product.categoryTrail[1]?.title || ""
  const itemCategory = product.categoryTrail[2]?.title || product.leafCategory || category

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-[1600px] px-6 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            {breadcrumb.map((item, index) => (
              <span key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-gray-500 transition hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
                )}
                {index < breadcrumb.length - 1 && (
                  <span className="text-gray-300 dark:text-gray-700">/</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Sticky Image */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <Image
                src={product.imageSrc}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8"
              />
            </div>
            {product.gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.gallery.slice(0, 4).map((imageUrl) => (
                  <div
                    key={imageUrl}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded border border-gray-200 bg-white transition hover:border-cyan-500 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Image src={imageUrl} alt={product.title} fill className="object-cover p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Scrollable Content */}
          <div className="space-y-8">
            {/* Product Info */}
            <div className="space-y-4">
              {product.brand && (
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {product.brand}
                </p>
              )}
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {product.title}
              </h1>
              
              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold ${stockBadgeClass}`}
                >
                  {product.stockStatus === "in_stock" ? "✓ In Stock" : "Out of Stock"}
                </span>
                {product.totalStock !== null && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.totalStock} unit{product.totalStock === 1 ? "" : "s"} available
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {product.description}
              </p>

              <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800/50 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    SKU / Model
                  </p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                    {product.sku ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Primary Category
                  </p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                    {category}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Category Path
                  </p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                    {product.categoryTrail.length > 0
                      ? product.categoryTrail.map((segment) => segment.title).join(" / ")
                      : category}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Availability
                  </p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                    {product.stockStatus === "in_stock" ? "In stock" : "Out of stock"}
                    {product.totalStock !== null && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        ({product.totalStock} unit{product.totalStock === 1 ? "" : "s"})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-3 border-y border-gray-200 py-6 dark:border-gray-700">
              <GetQuoteButton
                productName={product.title}
                productCategory={category}
                productSubcategory={subcategory}
                productItemCategory={itemCategory}
              />
              <Link
                href="/products/catalog"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                ← Back to Catalog
              </Link>
            </div>

            {product.richBody.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Detailed Overview
                </h2>
                <div className="space-y-4">
                  <PortableText value={product.richBody} components={portableTextComponents} />
                </div>
              </div>
            )}

            {/* Features */}
            {product.features.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Key Features
                </h2>
                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <svg className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specs.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Specifications
                </h2>
                <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                  {product.specs.map((spec) => (
                    <div key={spec.key} className="grid grid-cols-3 gap-4 px-4 py-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {spec.key}
                      </dt>
                      <dd className="col-span-2 text-sm text-gray-900 dark:text-gray-100">
                        {spec.values.join(", ")}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variants */}
            {product.sizeVariants.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Available Sizes
                </h2>
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Size
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Stock
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                      {product.sizeVariants.map((variant) => (
                        <tr key={variant.label}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {variant.label}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {variant.stock !== null ? `${variant.stock} units` : "Contact for availability"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {product.resources.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Downloads & Resources
                </h2>
                <ul className="space-y-3">
                  {product.resources.map((resource) => {
                    const metaParts = [
                      resource.filename,
                      resource.extension ? resource.extension.toUpperCase() : undefined,
                      formatFileSize(resource.size),
                    ].filter(Boolean)

                    return (
                      <li key={resource.url}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={resource.filename}
                          className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-cyan-500 dark:border-gray-700 dark:bg-gray-800"
                        >
                          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                            <Download className="h-5 w-5" />
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {resource.title}
                            </p>
                            {metaParts.length > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {metaParts.join(" • ")}
                              </p>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                            Download
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mx-auto max-w-[1600px] px-6 py-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Related Products
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => {
                return (
                  <Link
                    key={relatedProduct.id}
                    href={relatedProduct.detailsHref || `/products/catalog/${relatedProduct.slug}`}
                    className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
                      <Image
                        src={relatedProduct.imageSrc || "/logo-rakza.png"}
                        alt={relatedProduct.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      {relatedProduct.brand && (
                        <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                          {relatedProduct.brand}
                        </p>
                      )}
                      <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-cyan-600 dark:text-gray-100 dark:group-hover:text-cyan-400">
                        {relatedProduct.title}
                      </h3>
                      <div className="mt-auto">
                        <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                          relatedProduct.isInStock 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {relatedProduct.isInStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
