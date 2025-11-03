import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import GetQuoteButton from "@/app/components/GetQuoteButton"
import { fetchCatalogData, fetchProductDetail } from "@/lib/catalog"
import { Link } from "@/navigation"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { products } = await fetchCatalogData()
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductDetail(slug)

  if (!product) {
    return {
      title: "Product not found | Gulf Rakza Trading",
    }
  }

  const title = `${product.title} | Gulf Rakza Trading`
  const description = product.description
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

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await fetchProductDetail(slug)

  if (!product) {
    notFound()
  }

  // Fetch related products from catalog
  const { products: allProducts } = await fetchCatalogData()
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
