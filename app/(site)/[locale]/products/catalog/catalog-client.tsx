"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ArrowUpRight, ChevronDown, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react"

import GetQuoteButton from "@/app/components/GetQuoteButton"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Link } from "@/navigation"

import type { CatalogCategoryNode, CatalogProduct } from "@/lib/catalog/types"
import {
  buildSearchParamsFromFilters,
  type CatalogFilterState,
  type CatalogSortOption,
} from "./filter-helpers"

interface CatalogPageClientProps {
  products: CatalogProduct[]
  categoryTree: CatalogCategoryNode[]
  featureFilters: string[]
  brandFilters: string[]
  initialFilters: CatalogFilterState
}

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Name A - Z", value: "name-asc" },
  { label: "Name Z - A", value: "name-desc" },
]

const featureId = (feature: string) =>
  `feature-${feature.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

const brandId = (brand: string) =>
  `brand-${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

const flattenCategoryTree = (nodes: CatalogCategoryNode[]) => {
  const map = new Map<string, CatalogCategoryNode>()
  const walk = (list: CatalogCategoryNode[]) => {
    list.forEach((node) => {
      map.set(node.slug, node)
      if (node.children.length > 0) {
        walk(node.children)
      }
    })
  }
  walk(nodes)
  return map
}

const renderCategoryTree = (
  nodes: CatalogCategoryNode[],
  expanded: Set<string>,
  onToggleExpand: (slug: string) => void,
  onSelect: (slug: string) => void,
  selectedSlug: string | null,
) => {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => {
        const isExpanded = expanded.has(node.slug)
        const hasChildren = node.children.length > 0
        const isSelected = selectedSlug === node.slug

        return (
          <li key={node.slug}>
            <div className="flex items-start gap-2">
              {hasChildren ? (
                <button
                  type="button"
                  aria-label={isExpanded ? "Collapse category" : "Expand category"}
                  onClick={() => onToggleExpand(node.slug)}
                  className="mt-1 text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <span className="mt-1 h-4 w-4" />
              )}
              <button
                type="button"
                onClick={() => onSelect(node.slug)}
                className={`flex flex-1 items-center justify-between rounded-md px-2 py-1 text-left text-sm transition ${
                  isSelected
                    ? "bg-cyan-100 font-semibold text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>{node.title}</span>
                <span className="ml-3 text-xs text-slate-500 dark:text-slate-400">
                  {node.productCount}
                </span>
              </button>
            </div>
            {hasChildren && isExpanded && (
              <div className="ml-5 border-l border-slate-200 pl-3 dark:border-slate-800">
                {renderCategoryTree(node.children, expanded, onToggleExpand, onSelect, selectedSlug)}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function CatalogPageClient({
  products,
  categoryTree,
  featureFilters,
  brandFilters,
  initialFilters,
}: CatalogPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const basePath = pathname

  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(
    initialFilters.categorySlug,
  )
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFilters.features)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters.brands)
  const [sortOrder, setSortOrder] = useState<CatalogSortOption>(initialFilters.sortOrder)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    () => new Set(categoryTree.map((node) => node.slug)),
  )
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const lastQueryRef = useRef(buildSearchParamsFromFilters(initialFilters))

  const categoryLookup = useMemo(() => flattenCategoryTree(categoryTree), [categoryTree])

  const selectedCategoryNode = selectedCategorySlug
    ? categoryLookup.get(selectedCategorySlug) ?? null
    : null

  useEffect(() => {
    const state: CatalogFilterState = {
      searchTerm,
      categorySlug: selectedCategorySlug,
      features: selectedFeatures,
      brands: selectedBrands,
      sortOrder,
    }

    const queryString = buildSearchParamsFromFilters(state)

    if (queryString !== lastQueryRef.current) {
      const nextUrl = queryString ? `${basePath}?${queryString}` : basePath
      lastQueryRef.current = queryString
      router.replace(nextUrl, { scroll: false })
    }
  }, [
    searchTerm,
    selectedCategorySlug,
    selectedFeatures,
    selectedBrands,
    sortOrder,
    router,
    basePath,
  ])

  useEffect(() => {
    if (!selectedCategoryNode) return

    setExpandedNodes((prev) => {
      const next = new Set(prev)
      let changed = false
      selectedCategoryNode.path.forEach(({ slug }) => {
        if (!next.has(slug)) {
          next.add(slug)
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [selectedCategoryNode])

  const toggleExpandedNode = (slug: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug((previous) => (previous === slug ? null : slug))
    // Close mobile filters after selection
    if (window.innerWidth < 1024) {
      setTimeout(() => setShowMobileFilters(false), 300)
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategorySlug && !product.categorySlugs.includes(selectedCategorySlug)) {
        return false
      }

      if (
        selectedFeatures.length > 0 &&
        !selectedFeatures.every((feature) => product.featureTokens.includes(feature))
      ) {
        return false
      }

      if (
        selectedBrands.length > 0 &&
        (!product.brand || !selectedBrands.includes(product.brand))
      ) {
        return false
      }

      if (normalizedSearch) {
        const haystack = [
          product.title,
          product.description,
          product.brand ?? "",
          product.primaryCategory ?? "",
          product.leafCategory ?? "",
          product.categoryTrail.map((segment) => segment.title).join(" "),
          product.featureTokens.join(" "),
          product.specs.map((spec) => [spec.key, ...spec.values].join(" ")).join(" "),
        ]
          .join(" ")
          .toLowerCase()

        if (!haystack.includes(normalizedSearch)) {
          return false
        }
      }

      return true
    })
  }, [products, selectedCategorySlug, selectedFeatures, selectedBrands, normalizedSearch])

  const sortedProducts = useMemo(() => {
    switch (sortOrder) {
      case "name-asc":
        return [...filteredProducts].sort((a, b) => a.title.localeCompare(b.title))
      case "name-desc":
        return [...filteredProducts].sort((a, b) => b.title.localeCompare(a.title))
      default:
        return [...filteredProducts].sort((a, b) => a.position - b.position)
    }
  }, [filteredProducts, sortOrder])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategorySlug(null)
    setSelectedFeatures([])
    setSelectedBrands([])
    setSortOrder("relevance")
  }

  const removeFeature = (feature: string) => {
    setSelectedFeatures((prev) => prev.filter((item) => item !== feature))
  }

  const removeBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.filter((item) => item !== brand))
  }

  const selectedCategoryPathLabel = selectedCategoryNode
    ? selectedCategoryNode.path.map((segment) => segment.title).join(" → ")
    : null

  return (
    <div className="min-h-screen bg-white py-8 dark:bg-gray-900">
      {/* Mobile Filter Backdrop */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setShowMobileFilters(false)}
          aria-hidden="true"
        />
      )}
      
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 lg:px-6">
        <header className="space-y-4 border-b border-gray-200 pb-6 dark:border-gray-700">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              All Products
            </h1>
           
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by product name, spec, or use case"
                aria-label="Search products"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setShowMobileFilters(!showMobileFilters)}
                 className="flex items-center gap-2 lg:hidden"
               >
                 <SlidersHorizontal className="h-4 w-4" />
                 Filters
                 {(selectedCategorySlug || selectedFeatures.length > 0 || selectedBrands.length > 0) && (
                   <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-600 text-xs text-white">
                     {[selectedCategorySlug, ...selectedFeatures, ...selectedBrands].filter(Boolean).length}
                   </span>
                 )}
               </Button>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as CatalogSortOption)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                 className="hidden items-center gap-2 sm:flex"
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            </div>
          </div>
        </header>

         <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
           <aside className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm space-y-6 overflow-y-auto rounded-r-lg border border-gray-200 bg-white p-6 shadow-xl transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 lg:static lg:z-auto lg:w-auto lg:max-w-none lg:rounded-lg lg:bg-gray-50 lg:shadow-none ${showMobileFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${showMobileFilters ? "block" : "hidden lg:block"}`}>
             <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700 lg:border-0 lg:pb-0">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-slate-100">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
               </div>
               <div className="flex items-center gap-2">
                 {(selectedCategorySlug || selectedFeatures.length > 0 || selectedBrands.length > 0) && (
                   <button
                     type="button"
                     onClick={resetFilters}
                     className="text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 lg:hidden"
                   >
                     Clear all
                   </button>
                 )}
                 <button
                   type="button"
                   onClick={() => setShowMobileFilters(false)}
                   className="lg:hidden"
                   aria-label="Close filters"
                 >
                   <X className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                 </button>
               </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  <span>Browse by category</span>
                  {selectedCategorySlug && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategorySlug(null)}
                      className="text-xs font-normal text-cyan-600 hover:underline dark:text-cyan-400"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="max-h-[360px] overflow-y-auto pr-1">
                  {categoryTree.length > 0 ? (
                    renderCategoryTree(
                      categoryTree,
                      expandedNodes,
                      toggleExpandedNode,
                      handleCategorySelect,
                      selectedCategorySlug,
                    )
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No categories found. Set up categories in Sanity to begin filtering.
                    </p>
                  )}
                </div>
              </div>
              {featureFilters.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Product attributes
                  </p>
                  <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                    {featureFilters.map((feature) => (
                      <label
                        key={feature}
                        htmlFor={featureId(feature)}
                        className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <Checkbox
                          id={featureId(feature)}
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={(checked) => {
                            setSelectedFeatures((prev) => {
                              if (checked === true) {
                                if (prev.includes(feature)) {
                                  return prev
                                }
                                return [...prev, feature]
                              }
                              return prev.filter((item) => item !== feature)
                            })
                          }}
                        />
                        <span>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {brandFilters.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Brands
                  </p>
                  <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                    {brandFilters.map((brand) => (
                      <label
                        key={brand}
                        htmlFor={brandId(brand)}
                        className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <Checkbox
                          id={brandId(brand)}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            setSelectedBrands((prev) => {
                              if (checked === true) {
                                if (prev.includes(brand)) {
                                  return prev
                                }
                                return [...prev, brand]
                              }
                              return prev.filter((item) => item !== brand)
                            })
                          }}
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <section className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {sortedProducts.length} result{sortedProducts.length === 1 ? "" : "s"}
                {sortedProducts.length !== products.length && (
                  <span className="text-gray-500 dark:text-gray-500">
                    {" "}of {products.length} total
                  </span>
                )}
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedCategoryNode && selectedCategoryPathLabel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategorySlug(null)}
                    className="gap-2"
                  >
                    Category: {selectedCategoryPathLabel}
                    <X className="h-3 w-3" />
                  </Button>
                )}
                {selectedFeatures.map((feature) => (
                  <Button
                    key={feature}
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(feature)}
                    className="gap-2"
                  >
                    {feature}
                    <X className="h-3 w-3" />
                  </Button>
                ))}
                {selectedBrands.map((brand) => (
                  <Button
                    key={brand}
                    variant="outline"
                    size="sm"
                    onClick={() => removeBrand(brand)}
                    className="gap-2"
                  >
                    Brand: {brand}
                    <X className="h-3 w-3" />
                  </Button>
                ))}
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {products.length === 0
                    ? "No products available"
                    : "No products found"}
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {products.length === 0
                    ? "Check back soon for new products."
                    : "Try adjusting your filters or search terms."}
                </p>
                {products.length !== 0 && (
                  <Button onClick={resetFilters} className="mt-4">
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => {
                  // Extract 3-level category hierarchy from categoryTrail
                  const category = product.categoryTrail[0]?.title || product.primaryCategory || "General"
                  const subcategory = product.categoryTrail[1]?.title || ""
                  const itemCategory = product.categoryTrail[2]?.title || product.leafCategory || category

                  const baseFeatureList =
                    product.features.length > 0 ? product.features : product.featureTokens
                  const featureHighlights = baseFeatureList.slice(0, 3)
                  const stockQuantityDisplay =
                    product.usesVariantStock && product.totalStock !== null
                      ? `${product.totalStock} unit${product.totalStock === 1 ? "" : "s"} available`
                      : null

                  return (
                    <div
                      key={product.id}
                      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                      {/* Product Image Container */}
                      <Link
                        href={product.detailsHref || "#"}
                        className="relative block aspect-square overflow-hidden bg-white p-4 dark:bg-gray-900"
                      >
                          <Image
                            src={product.imageSrc || "/logo-rakza.png"}
                            alt={product.title}
                            fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Stock Badge - positioned absolutely */}
                        {!product.isInStock && (
                          <div className="absolute right-2 top-2">
                            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                              Out of Stock
                            </span>
                        </div>
                        )}
                      </Link>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col p-4">
                        {/* Brand */}
                          {product.brand && (
                          <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              {product.brand}
                            </p>
                          )}
                
                        {/* Product Title */}
                        <Link href={product.detailsHref || "#"}>
                          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-normal leading-tight text-gray-900 transition-colors hover:text-cyan-600 dark:text-gray-100 dark:hover:text-cyan-400">
                            {product.title}
                          </h3>
                        </Link>

                        {/* Features/Specs */}
                        {featureHighlights.length > 0 && (
                          <div className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                            <ul className="space-y-0.5">
                              {featureHighlights.slice(0, 2).map((feature) => (
                                <li key={feature} className="truncate">
                                  • {feature}
                                </li>
                              ))}
                            </ul>
                            </div>
                          )}

                        {/* Stock Availability */}
                        {product.isInStock && (
                          <p className="mb-3 text-xs font-medium text-green-600 dark:text-green-400">
                            ✓ In Stock
                            {stockQuantityDisplay && (
                              <span className="ml-1 text-gray-500 dark:text-gray-400">
                                ({stockQuantityDisplay})
                              </span>
                            )}
                          </p>
                        )}

                        {/* Spacer to push buttons to bottom */}
                        <div className="flex-1" />

                        {/* Action Buttons */}
                        <div className="mt-3 space-y-2">
                          <GetQuoteButton
                            productName={product.title}
                            productCategory={category}
                            productSubcategory={subcategory}
                            productItemCategory={itemCategory}
                          />
                        {product.detailsHref && (
                          <Link
                            href={product.detailsHref}
                              className="flex w-full items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                              View Details
                              <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
