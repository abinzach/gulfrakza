"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  MoveVertical,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useLocale } from "@/i18n/provider"

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
                    ? "bg-[#d8f7ff] font-semibold text-[#08778c] dark:bg-[#164f5d]/40 dark:text-[#67e8f9]"
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
  const locale = useLocale()
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
  const categoryScrollRef = useRef<HTMLDivElement | null>(null)
  const [categoryScrollIndicators, setCategoryScrollIndicators] = useState({
    showTop: false,
    showBottom: false,
  })

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

  useEffect(() => {
    const container = categoryScrollRef.current
    if (!container) return

    const updateIndicators = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const maxScroll = Math.max(scrollHeight - clientHeight, 0)
      setCategoryScrollIndicators({
        showTop: scrollTop > 4,
        showBottom: scrollTop < maxScroll - 4,
      })
    }

    updateIndicators()
    container.addEventListener("scroll", updateIndicators)
    window.addEventListener("resize", updateIndicators)

    return () => {
      container.removeEventListener("scroll", updateIndicators)
      window.removeEventListener("resize", updateIndicators)
    }
  }, [categoryTree])

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
  const activeFilterCount = [selectedCategorySlug, ...selectedFeatures, ...selectedBrands].filter(Boolean).length

  return (
    <div className="min-h-screen bg-slate-50 py-4 dark:bg-gray-900 sm:py-8">
      {/* Mobile Filter Backdrop */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setShowMobileFilters(false)}
          aria-hidden="true"
        />
      )}
      
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-3 sm:gap-6 sm:px-4 lg:px-6">
        <header className="mt-10 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:space-y-4 sm:p-5 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by product name, spec, or use case"
                aria-label="Search products"
                className="h-11 rounded-full border-slate-200 bg-slate-50 pl-10 text-[15px] shadow-none focus-visible:ring-[#0899b4] dark:border-slate-800 dark:bg-slate-950 sm:h-10 sm:rounded-md"
              />
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-2 sm:flex sm:flex-wrap sm:gap-3">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setShowMobileFilters(!showMobileFilters)}
                 aria-expanded={showMobileFilters}
                 aria-controls="product-filters"
                 className="h-10 justify-center gap-2 rounded-full border-slate-200 bg-white px-4 shadow-sm lg:hidden"
               >
                 <SlidersHorizontal className="h-4 w-4" />
                 Filters
                 {activeFilterCount > 0 && (
                   <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#08778c] text-xs text-white">
                     {activeFilterCount}
                   </span>
                 )}
               </Button>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as CatalogSortOption)}
                aria-label="Sort products"
                className="h-10 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0899b4] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 sm:rounded-md"
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

         <div className="grid gap-4 lg:grid-cols-[300px_1fr] lg:gap-6">
           <aside id="product-filters" className={`fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm space-y-6 overflow-y-auto rounded-r-3xl border border-gray-200 bg-white p-5 shadow-2xl transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:static lg:z-auto lg:w-auto lg:max-w-none lg:rounded-2xl lg:bg-white lg:shadow-sm ${showMobileFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${showMobileFilters ? "block" : "hidden lg:block"}`}>
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
                     className="text-sm font-medium text-[#08778c] hover:text-[#08778c] dark:text-[#35d2e9] dark:hover:text-[#67e8f9] lg:hidden"
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
                      className="text-xs font-normal text-[#08778c] hover:underline dark:text-[#35d2e9]"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div
                    ref={categoryScrollRef}
                    className="max-h-[360px] overflow-y-auto pr-1"
                  >
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
                  {categoryScrollIndicators.showTop && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 lg:from-gray-50 lg:via-gray-50/80" />
                  )}
                  {categoryScrollIndicators.showBottom && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 lg:from-gray-50 lg:via-gray-50/80" />
                  )}
                </div>
                {categoryScrollIndicators.showBottom && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <MoveVertical className="h-3.5 w-3.5" />
                    Scroll to explore categories
                  </p>
                )}
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

          <section className="space-y-3 sm:space-y-4">
            <div className="space-y-2 px-1 sm:space-y-3 sm:px-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 sm:text-sm sm:normal-case sm:tracking-normal sm:text-gray-700 sm:dark:text-gray-300">
                  {sortedProducts.length} result{sortedProducts.length === 1 ? "" : "s"}
                  {sortedProducts.length !== products.length && (
                    <span className="font-normal text-slate-400 dark:text-gray-500">
                      {" "}of {products.length}
                    </span>
                  )}
                </p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-[#08778c] sm:hidden"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {selectedCategoryNode && selectedCategoryPathLabel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategorySlug(null)}
                    className="shrink-0 gap-2 rounded-full"
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
                    className="shrink-0 gap-2 rounded-full"
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
                    className="shrink-0 gap-2 rounded-full"
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
              <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900 sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 sm:border-y-0 sm:bg-transparent lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => {
                  // Extract 3-level category hierarchy from categoryTrail
                  const category = product.categoryTrail[0]?.title || product.primaryCategory || "General"
                  const itemCategory = product.categoryTrail[2]?.title || product.leafCategory || category

                  const baseFeatureList =
                    product.features.length > 0 ? product.features : product.featureTokens
                  const featureHighlights = baseFeatureList.slice(0, 3)
                  const stockToneClass = product.isInStock ? "bg-emerald-500" : "bg-gray-400"
                  const stockToneLabel = product.isInStock ? "Ready to ship" : "Stock refreshes soon"
                  const productHref = `/${locale}/products/${product.slug}`

                  return (
                    <NextLink
                      key={product.id}
                      href={productHref}
                      aria-label={`Open ${product.title}`}
                      onMouseDown={(event) => {
                        if (
                          event.defaultPrevented ||
                          event.button !== 0 ||
                          event.metaKey ||
                          event.ctrlKey ||
                          event.shiftKey ||
                          event.altKey
                        ) {
                          return
                        }
                        event.preventDefault()
                        router.push(productHref)
                      }}
                      onClick={(event) => {
                        if (
                          event.defaultPrevented ||
                          event.button !== 0 ||
                          event.metaKey ||
                          event.ctrlKey ||
                          event.shiftKey ||
                          event.altKey
                        ) {
                          return
                        }
                        event.preventDefault()
                        router.push(productHref)
                      }}
                      className="group grid cursor-pointer grid-cols-[112px_minmax(0,1fr)] gap-3 bg-white px-1 py-3 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0899b4] dark:bg-gray-900 dark:hover:bg-gray-800/70 sm:flex sm:h-full sm:flex-col sm:overflow-hidden sm:rounded-xl sm:border sm:border-slate-200 sm:p-0 sm:hover:border-slate-300 sm:hover:shadow-sm dark:sm:border-gray-800"
                    >
                      <div className="relative h-32 overflow-hidden bg-white p-2 dark:bg-gray-950 sm:aspect-square sm:h-auto sm:w-full sm:p-4">
                        <Image
                          src={product.imageSrc || "/logo-rakza.png"}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 112px, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col py-0.5 pr-2 sm:p-4">
                        <div className="mb-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                          {product.brand && (
                            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-xs">
                              {product.brand}
                            </p>
                          )}
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stockToneClass}`} />
                          <span className="truncate text-[11px] font-medium text-gray-500 dark:text-gray-400">
                            {stockToneLabel}
                          </span>
                        </div>
                
                        <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-gray-950 transition-colors group-hover:text-[#08778c] dark:text-gray-100 dark:group-hover:text-[#35d2e9] sm:mb-2 sm:min-h-[2.5rem] sm:text-sm sm:font-normal sm:leading-tight">
                          {product.title}
                        </h3>

                        <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                          {itemCategory}
                        </p>

                        {featureHighlights.length > 0 && (
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 sm:mb-3">
                            <ul className="space-y-0.5">
                              {featureHighlights.slice(0, 2).map((feature) => (
                                <li key={feature} className="line-clamp-1">
                                  <span className="text-gray-300 sm:text-gray-500">•</span> {feature}
                                </li>
                              ))}
                            </ul>
                            </div>
                          )}

                        <div className="flex-1" />
                      </div>
                    </NextLink>
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
