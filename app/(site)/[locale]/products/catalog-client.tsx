"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  PackageSearch,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"

import SanityImage from "@/app/components/SanityImage"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useLocale } from "@/i18n/provider"

import type { CatalogCategoryNode, CatalogListingProduct } from "@/lib/catalog/types"
import {
  buildSearchParamsFromFilters,
  parseFiltersFromSearchParams,
  type CatalogFilterState,
  type CatalogSortOption,
} from "./filter-helpers"

interface CatalogPageClientProps {
  products: CatalogListingProduct[]
  categoryTree: CatalogCategoryNode[]
  featureFilters: string[]
  brandFilters: string[]
}

const sortOptions: Array<{ label: string; value: CatalogSortOption }> = [
  { label: "Recommended", value: "relevance" },
  { label: "Product name: A–Z", value: "name-asc" },
  { label: "Product name: Z–A", value: "name-desc" },
]

const defaultFilters: CatalogFilterState = {
  searchTerm: "",
  categorySlug: null,
  features: [],
  brands: [],
  sortOrder: "relevance",
}

const controlId = (prefix: string, value: string) =>
  `${prefix}-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

const flattenCategoryTree = (nodes: CatalogCategoryNode[]) => {
  const map = new Map<string, CatalogCategoryNode>()
  const walk = (list: CatalogCategoryNode[]) => {
    list.forEach((node) => {
      map.set(node.slug, node)
      walk(node.children)
    })
  }
  walk(nodes)
  return map
}

interface CategoryTreeProps {
  nodes: CatalogCategoryNode[]
  expanded: Set<string>
  selectedSlug: string | null
  counts: Map<string, number>
  idPrefix: string
  onToggleExpand: (slug: string) => void
  onSelect: (slug: string) => void
  depth?: number
}

function CategoryTree({
  nodes,
  expanded,
  selectedSlug,
  counts,
  idPrefix,
  onToggleExpand,
  onSelect,
  depth = 0,
}: CategoryTreeProps) {
  const visibleNodes = nodes.filter((node) => node.productCount > 0)

  return (
    <ul className={depth === 0 ? "divide-y divide-slate-200 dark:divide-slate-800" : "border-l border-slate-200 dark:border-slate-800"}>
      {visibleNodes.map((node) => {
        const isExpanded = expanded.has(node.slug)
        const hasChildren = node.children.some((child) => child.productCount > 0)
        const isSelected = selectedSlug === node.slug
        const count = counts.get(node.slug) ?? 0
        const id = controlId(`${idPrefix}-category`, node.id)

        return (
          <li key={node.id}>
            <div
              className={`group flex min-h-11 items-center border-l-2 transition-colors ${
                isSelected
                  ? "border-cyan-600 bg-cyan-50 text-cyan-950 dark:bg-cyan-950/30 dark:text-cyan-100"
                  : "border-transparent text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
              }`}
            >
              {hasChildren ? (
                <button
                  type="button"
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.title}`}
                  aria-expanded={isExpanded}
                  onClick={() => onToggleExpand(node.slug)}
                  className="flex h-11 w-9 shrink-0 items-center justify-center text-slate-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-600 dark:hover:text-white"
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                <span className="w-9 shrink-0" aria-hidden="true" />
              )}

              <Checkbox
                id={id}
                aria-label={`Filter by ${node.title}`}
                checked={isSelected}
                onCheckedChange={() => onSelect(node.slug)}
                className="rounded-none border-slate-400 data-[state=checked]:border-cyan-700 data-[state=checked]:bg-cyan-700"
              />
              <label
                htmlFor={id}
                className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 py-2.5 pl-3 pr-3 text-sm"
              >
                <span className={isSelected ? "font-semibold" : "font-medium"}>{node.title}</span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                  {count}
                </span>
              </label>
            </div>

            {hasChildren && isExpanded && (
              <div className="ml-9">
                <CategoryTree
                  nodes={node.children}
                  expanded={expanded}
                  selectedSlug={selectedSlug}
                  counts={counts}
                  idPrefix={idPrefix}
                  onToggleExpand={onToggleExpand}
                  onSelect={onSelect}
                  depth={depth + 1}
                />
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
}: CatalogPageClientProps) {
  const locale = useLocale()
  const pathname = usePathname()
  // Filters start at their defaults so the server-rendered markup is identical
  // for every visitor — that is what keeps this page in the edge cache instead
  // of re-rendering on the origin for each query string. The URL is read on
  // mount below and applied client-side.
  const [searchTerm, setSearchTerm] = useState(defaultFilters.searchTerm)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(defaultFilters.categorySlug)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(defaultFilters.features)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(defaultFilters.brands)
  const [sortOrder, setSortOrder] = useState<CatalogSortOption>(defaultFilters.sortOrder)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    () => new Set(categoryTree.map((node) => node.slug)),
  )
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)


  const isArabic = locale === "ar"
  const copy = isArabic
    ? {
        eyebrow: "كتالوج التوريد الصناعي",
        title: "اعثر على المنتج المناسب للموقع",
        intro: "صفِّ حسب الفئة أو العلامة التجارية أو المواصفات، ثم أرسل طلب عرض سعر مباشرة إلى فريق جلف ركزة.",
        search: "ابحث بالمنتج أو المواصفة أو الاستخدام",
        filters: "الفلاتر",
        categories: "الفئات",
        attributes: "مواصفات المنتج",
        brands: "العلامات التجارية",
        clear: "مسح الكل",
        results: "نتائج",
        showResults: "عرض المنتجات",
        noResults: "لا توجد منتجات مطابقة",
        noResultsBody: "جرّب إزالة فلتر أو استخدام عبارة بحث أوسع.",
        viewProduct: "عرض المنتج",
        available: "متوفر",
        onRequest: "حسب الطلب",
        activeFilters: "الفلاتر المطبقة",
      }
    : {
        eyebrow: "Industrial supply catalog",
        title: "Find the right product for the job",
        intro: "Filter by category, brand, or specification, then send a focused quotation request to the GulfRakza team.",
        search: "Search product, specification, or application",
        filters: "Filters",
        categories: "Categories",
        attributes: "Product attributes",
        brands: "Brands",
        clear: "Clear all",
        results: "results",
        showResults: "Show products",
        noResults: "No matching products",
        noResultsBody: "Remove a filter or try a broader search term.",
        viewProduct: "View product",
        available: "Available",
        onRequest: "On request",
        activeFilters: "Applied filters",
      }

  const categoryLookup = useMemo(() => flattenCategoryTree(categoryTree), [categoryTree])
  const selectedCategoryNode = selectedCategorySlug ? categoryLookup.get(selectedCategorySlug) ?? null : null

  const currentFilters = useMemo<CatalogFilterState>(
    () => ({
      searchTerm,
      categorySlug: selectedCategorySlug,
      features: selectedFeatures,
      brands: selectedBrands,
      sortOrder,
    }),
    [searchTerm, selectedCategorySlug, selectedFeatures, selectedBrands, sortOrder],
  )

  const writeUrl = useCallback(
    (next: CatalogFilterState, method: "push" | "replace") => {
      const query = buildSearchParamsFromFilters(next)
      const nextUrl = query ? `${pathname}?${query}` : pathname
      const currentUrl = `${window.location.pathname}${window.location.search}`
      if (nextUrl === currentUrl) return

      if (method === "push") window.history.pushState({}, "", nextUrl)
      else window.history.replaceState({}, "", nextUrl)
    },
    [pathname],
  )

  const applyFilters = useCallback(
    (patch: Partial<CatalogFilterState>, method: "push" | "replace" = "push") => {
      const next = { ...currentFilters, ...patch }
      setSearchTerm(next.searchTerm)
      setSelectedCategorySlug(next.categorySlug)
      setSelectedFeatures(next.features)
      setSelectedBrands(next.brands)
      setSortOrder(next.sortOrder)
      writeUrl(next, method)
    },
    [currentFilters, writeUrl],
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      writeUrl({ ...currentFilters, searchTerm }, "replace")
    }, 250)
    return () => window.clearTimeout(timeout)
  }, [currentFilters, searchTerm, writeUrl])

  useEffect(() => {
    const restoreFromUrl = () => {
      const restored = parseFiltersFromSearchParams(new URLSearchParams(window.location.search))
      setSearchTerm(restored.searchTerm)
      setSelectedCategorySlug(restored.categorySlug)
      setSelectedFeatures(restored.features)
      setSelectedBrands(restored.brands)
      setSortOrder(restored.sortOrder)
    }
    // Also run once on mount: the page is prerendered without filters so that a
    // single cached copy serves every query string, which means the incoming
    // `?category=`/`?brands=`/… has to be applied here on the client.
    restoreFromUrl()
    window.addEventListener("popstate", restoreFromUrl)
    return () => window.removeEventListener("popstate", restoreFromUrl)
  }, [])

  useEffect(() => {
    if (!selectedCategoryNode) return
    setExpandedNodes((previous) => {
      const next = new Set(previous)
      selectedCategoryNode.path.forEach((segment) => next.add(segment.slug))
      return next
    })
  }, [selectedCategoryNode])

  useEffect(() => {
    if (!showMobileFilters) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowMobileFilters(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [showMobileFilters])

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const matchesSearch = useCallback(
    (product: CatalogListingProduct) => {
      if (!normalizedSearch) return true
      const haystack = [
        product.title,
        product.description,
        product.brand ?? "",
        product.primaryCategory ?? "",
        product.leafCategory ?? "",
        product.categoryTrail.map((segment) => segment.title).join(" "),
        product.featureTokens.join(" "),
        product.specs.map((spec) => [spec.key, ...spec.values].join(" ")).join(" "),
      ].join(" ").toLowerCase()
      return haystack.includes(normalizedSearch)
    },
    [normalizedSearch],
  )

  const filteredProducts = useMemo(
    () => products.filter((product) => {
      if (selectedCategorySlug && !product.categorySlugs.includes(selectedCategorySlug)) return false
      if (selectedFeatures.length > 0 && !selectedFeatures.every((feature) => product.featureTokens.includes(feature))) return false
      if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand))) return false
      return matchesSearch(product)
    }),
    [products, selectedCategorySlug, selectedFeatures, selectedBrands, matchesSearch],
  )

  const sortedProducts = useMemo(() => {
    if (sortOrder === "name-asc") return [...filteredProducts].sort((a, b) => a.title.localeCompare(b.title))
    if (sortOrder === "name-desc") return [...filteredProducts].sort((a, b) => b.title.localeCompare(a.title))
    return [...filteredProducts].sort((a, b) => a.position - b.position)
  }, [filteredProducts, sortOrder])

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    products.forEach((product) => {
      if (!matchesSearch(product)) return
      if (selectedFeatures.length > 0 && !selectedFeatures.every((feature) => product.featureTokens.includes(feature))) return
      if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand))) return
      product.categorySlugs.forEach((slug) => counts.set(slug, (counts.get(slug) ?? 0) + 1))
    })
    return counts
  }, [products, matchesSearch, selectedFeatures, selectedBrands])

  const featureCounts = useMemo(() => {
    const counts = new Map<string, number>()
    featureFilters.forEach((feature) => counts.set(feature, 0))
    products.forEach((product) => {
      if (!matchesSearch(product)) return
      if (selectedCategorySlug && !product.categorySlugs.includes(selectedCategorySlug)) return
      if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand))) return
      product.featureTokens.forEach((feature) => {
        if (counts.has(feature)) counts.set(feature, (counts.get(feature) ?? 0) + 1)
      })
    })
    return counts
  }, [featureFilters, products, matchesSearch, selectedCategorySlug, selectedBrands])

  const brandCounts = useMemo(() => {
    const counts = new Map<string, number>()
    brandFilters.forEach((brand) => counts.set(brand, 0))
    products.forEach((product) => {
      if (!product.brand || !matchesSearch(product)) return
      if (selectedCategorySlug && !product.categorySlugs.includes(selectedCategorySlug)) return
      if (selectedFeatures.length > 0 && !selectedFeatures.every((feature) => product.featureTokens.includes(feature))) return
      counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1)
    })
    return counts
  }, [brandFilters, products, matchesSearch, selectedCategorySlug, selectedFeatures])

  const toggleExpandedNode = (slug: string) => {
    setExpandedNodes((previous) => {
      const next = new Set(previous)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const selectCategory = (slug: string) => applyFilters({ categorySlug: selectedCategorySlug === slug ? null : slug })

  const toggleFeature = (feature: string, checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...selectedFeatures, feature]))
      : selectedFeatures.filter((item) => item !== feature)
    applyFilters({ features: next })
  }

  const toggleBrand = (brand: string, checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...selectedBrands, brand]))
      : selectedBrands.filter((item) => item !== brand)
    applyFilters({ brands: next })
  }

  const resetFilters = () => applyFilters(defaultFilters)
  const activeFilterCount = (searchTerm.trim() ? 1 : 0) + (selectedCategorySlug ? 1 : 0) + selectedFeatures.length + selectedBrands.length
  const hasActiveFilters = activeFilterCount > 0
  const selectedCategoryLabel = selectedCategoryNode?.path.map((segment) => segment.title).join(" / ")

  const renderFilterPanel = (idPrefix: "desktop" | "mobile") => (
    <>
      <div className="border-b border-slate-300 px-5 py-4 dark:border-slate-700">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-950 dark:text-white">
            <SlidersHorizontal className="h-4 w-4 text-cyan-700 dark:text-cyan-400" />
            {copy.filters}
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={resetFilters} className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-800 underline-offset-4 hover:underline dark:text-cyan-300">
              {copy.clear}
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-slate-300 dark:divide-slate-700">
        <section aria-labelledby={`${idPrefix}-category-filter-title`} className="py-2">
          <h2 id={`${idPrefix}-category-filter-title`} className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {copy.categories}
          </h2>
          {categoryTree.length > 0 ? (
            <CategoryTree
              nodes={categoryTree}
              expanded={expandedNodes}
              selectedSlug={selectedCategorySlug}
              counts={categoryCounts}
              idPrefix={idPrefix}
              onToggleExpand={toggleExpandedNode}
              onSelect={selectCategory}
            />
          ) : (
            <p className="px-5 pb-4 text-sm text-slate-500">No categories available.</p>
          )}
        </section>

        {featureFilters.length > 0 && (
          <details open className="group py-2">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 marker:hidden dark:text-slate-400">
              {copy.attributes}
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4">
              {featureFilters.map((feature) => {
                const id = controlId(`${idPrefix}-feature`, feature)
                const count = featureCounts.get(feature) ?? 0
                const checked = selectedFeatures.includes(feature)
                return (
                  <div key={feature} className="flex min-h-10 items-start gap-3 border-b border-slate-100 py-2 last:border-b-0 dark:border-slate-800">
                    <Checkbox id={id} aria-label={`Filter by attribute ${feature}`} checked={checked} disabled={count === 0 && !checked} onCheckedChange={(value) => toggleFeature(feature, value === true)} className="mt-0.5 rounded-none" />
                    <label htmlFor={id} className="flex min-w-0 flex-1 cursor-pointer justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span>{feature}</span>
                      <span className="font-mono text-[11px] tabular-nums text-slate-400">{count}</span>
                    </label>
                  </div>
                )
              })}
            </div>
          </details>
        )}

        {brandFilters.length > 0 && (
          <details open className="group py-2">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 marker:hidden dark:text-slate-400">
              {copy.brands}
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4">
              {brandFilters.map((brand) => {
                const id = controlId(`${idPrefix}-brand`, brand)
                const count = brandCounts.get(brand) ?? 0
                const checked = selectedBrands.includes(brand)
                return (
                  <div key={brand} className="flex min-h-10 items-start gap-3 border-b border-slate-100 py-2 last:border-b-0 dark:border-slate-800">
                    <Checkbox id={id} aria-label={`Filter by brand ${brand}`} checked={checked} disabled={count === 0 && !checked} onCheckedChange={(value) => toggleBrand(brand, value === true)} className="mt-0.5 rounded-none" />
                    <label htmlFor={id} className="flex min-w-0 flex-1 cursor-pointer justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span>{brand}</span>
                      <span className="font-mono text-[11px] tabular-nums text-slate-400">{count}</span>
                    </label>
                  </div>
                )
              })}
            </div>
          </details>
        )}
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#f4f5f5] pb-16 pt-16 text-slate-950 dark:bg-slate-950 dark:text-white">
      {showMobileFilters && (
        <button type="button" aria-label="Close filters" onClick={() => setShowMobileFilters(false)} className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden" />
      )}

      <section className="border-b border-slate-300 bg-[#101315] text-white dark:border-slate-700">
        <div className="mx-auto w-[calc(100%-3rem)] max-w-7xl py-10 sm:py-12 lg:w-[calc(100%-6rem)]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.72fr)] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">{copy.eyebrow}</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{copy.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{copy.intro}</p>
            </div>

            <div>
              <label htmlFor="catalog-search" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{copy.search}</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  ref={searchInputRef}
                  id="catalog-search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={copy.search}
                  className="h-14 rounded-none border-slate-600 bg-white pl-12 pr-12 text-base text-slate-950 shadow-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => { setSearchTerm(""); searchInputRef.current?.focus() }}
                    aria-label="Clear search"
                    className="absolute right-0 top-0 flex h-14 w-12 items-center justify-center text-slate-500 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-[calc(100%-3rem)] max-w-7xl py-5 lg:w-[calc(100%-6rem)] lg:py-8">
        <div className="mb-4 grid grid-cols-[1fr_auto] gap-3 border-y border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 lg:hidden">
          <Button type="button" variant="outline" onClick={() => setShowMobileFilters(true)} aria-expanded={showMobileFilters} aria-controls="mobile-catalog-filters" className="h-11 justify-start rounded-none border-slate-300 bg-white px-4 dark:border-slate-700 dark:bg-slate-900">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {copy.filters}
            {activeFilterCount > 0 && <span className="ml-auto bg-cyan-700 px-2 py-0.5 font-mono text-xs text-white">{activeFilterCount}</span>}
          </Button>
          <select
            value={sortOrder}
            onChange={(event) => applyFilters({ sortOrder: event.target.value as CatalogSortOption })}
            aria-label="Sort products"
            className="h-11 border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>

        <aside
          id="mobile-catalog-filters"
          role={showMobileFilters ? "dialog" : undefined}
          aria-modal={showMobileFilters ? true : undefined}
          aria-label="Product filters"
          className={`fixed inset-y-0 left-0 z-50 flex w-[92vw] max-w-md flex-col bg-white shadow-2xl transition-transform duration-200 dark:bg-slate-950 lg:hidden ${showMobileFilters ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-300 px-5 dark:border-slate-700">
            <span className="text-sm font-black uppercase tracking-[0.15em]">{copy.filters}</span>
            <button type="button" onClick={() => setShowMobileFilters(false)} aria-label="Close filters" className="flex h-11 w-11 items-center justify-center border border-slate-300 dark:border-slate-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{renderFilterPanel("mobile")}</div>
          <div className="grid shrink-0 grid-cols-[auto_1fr] gap-2 border-t border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
            <Button type="button" variant="outline" onClick={resetFilters} className="h-12 rounded-none px-4">{copy.clear}</Button>
            <Button type="button" onClick={() => setShowMobileFilters(false)} className="h-12 rounded-none bg-cyan-800 text-white hover:bg-cyan-700">
              {copy.showResults} · {sortedProducts.length}
            </Button>
          </div>
        </aside>

        <div className="grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="hidden self-start border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]">{renderFilterPanel("desktop")}</aside>

          <section aria-label="Catalog results" className="min-w-0">
            <div className="mb-4 border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
              <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <p aria-live="polite" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <span className="font-mono text-base font-black tabular-nums text-slate-950 dark:text-white">{sortedProducts.length}</span>{" "}{copy.results}
                  {sortedProducts.length !== products.length && <span className="font-normal text-slate-500"> / {products.length} total</span>}
                </p>
                <div className="hidden items-center gap-3 lg:flex">
                  <label htmlFor="catalog-sort" className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Sort</label>
                  <select
                    id="catalog-sort"
                    value={sortOrder}
                    onChange={(event) => applyFilters({ sortOrder: event.target.value as CatalogSortOption })}
                    className="h-10 border border-slate-300 bg-white px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:border-slate-700 dark:bg-slate-900"
                  >
                    {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{copy.activeFilters}</span>
                    {searchTerm.trim() && (
                      <button type="button" onClick={() => setSearchTerm("")} className="inline-flex min-h-8 items-center gap-2 border border-slate-300 bg-slate-50 px-3 text-xs font-semibold hover:border-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-white">“{searchTerm.trim()}” <X className="h-3.5 w-3.5" /></button>
                    )}
                    {selectedCategoryLabel && (
                      <button type="button" onClick={() => applyFilters({ categorySlug: null })} className="inline-flex min-h-8 items-center gap-2 border border-cyan-700 bg-cyan-50 px-3 text-xs font-semibold text-cyan-950 hover:bg-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-100">{selectedCategoryLabel} <X className="h-3.5 w-3.5" /></button>
                    )}
                    {selectedFeatures.map((feature) => (
                      <button key={feature} type="button" onClick={() => toggleFeature(feature, false)} className="inline-flex min-h-8 items-center gap-2 border border-slate-300 bg-slate-50 px-3 text-xs font-semibold hover:border-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-white">{feature} <X className="h-3.5 w-3.5" /></button>
                    ))}
                    {selectedBrands.map((brand) => (
                      <button key={brand} type="button" onClick={() => toggleBrand(brand, false)} className="inline-flex min-h-8 items-center gap-2 border border-slate-300 bg-slate-50 px-3 text-xs font-semibold hover:border-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-white">{brand} <X className="h-3.5 w-3.5" /></button>
                    ))}
                    <button type="button" onClick={resetFilters} className="min-h-8 px-2 text-xs font-bold text-cyan-800 underline-offset-4 hover:underline dark:text-cyan-300">{copy.clear}</button>
                  </div>
                </div>
              )}
            </div>

            {sortedProducts.length === 0 ? (
              <div className="border border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <PackageSearch className="mx-auto h-10 w-10 text-slate-400" />
                <h2 className="mt-5 text-2xl font-black tracking-tight">{copy.noResults}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.noResultsBody}</p>
                <Button type="button" onClick={resetFilters} className="mt-6 rounded-none bg-slate-950 px-6 text-white hover:bg-cyan-800 dark:bg-white dark:text-slate-950">{copy.clear}</Button>
              </div>
            ) : (
              <div className="grid border-l border-t border-slate-300 bg-transparent dark:border-slate-700 sm:grid-cols-2 xl:grid-cols-3">
                {sortedProducts.map((product, index) => {
                  const productHref = `/${locale}/products/${product.slug}`
                  const categoryLabel = product.categoryTrail.at(-1)?.title || product.leafCategory || product.primaryCategory || "Industrial product"
                  const specHighlights = product.specs.slice(0, 3)
                  const featureHighlights = product.features.slice(0, 3)

                  return (
                    <article key={product.id} className="group flex min-w-0 flex-col border-b border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
                      <Link href={productHref} className="relative block aspect-[4/3] overflow-hidden border-b border-slate-200 bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-600 dark:border-slate-800 dark:bg-slate-950">
                        <SanityImage src={product.imageSrc || "/logo-rakza.png"} alt={product.title} fill priority={index < 3} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.025]" />
                        <span className={`absolute left-0 top-0 border-b border-r px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] ${product.isInStock ? "border-emerald-700 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200" : "border-slate-400 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}>
                          {product.isInStock ? copy.available : copy.onRequest}
                        </span>
                      </Link>

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-800 dark:text-cyan-300">
                          {product.brand || categoryLabel}
                        </p>
                        <h2 className="mt-2 text-lg font-black leading-snug tracking-[-0.02em] text-slate-950 dark:text-white">
                          <Link href={productHref} className="decoration-cyan-600 decoration-2 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600">{product.title}</Link>
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>

                        {(specHighlights.length > 0 || featureHighlights.length > 0) && (
                          <dl className="mt-5 border-t border-slate-200 text-xs dark:border-slate-800">
                            {specHighlights.length > 0
                              ? specHighlights.map((spec) => (
                                  <div key={spec.key} className="grid grid-cols-[minmax(90px,0.8fr)_minmax(0,1fr)] gap-3 border-b border-slate-200 py-2.5 dark:border-slate-800">
                                    <dt className="font-semibold text-slate-500">{spec.key}</dt>
                                    <dd className="text-right font-medium text-slate-900 dark:text-slate-100">{spec.values.join(", ")}</dd>
                                  </div>
                                ))
                              : featureHighlights.map((feature, index) => (
                                  <div key={feature} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 border-b border-slate-200 py-2.5 dark:border-slate-800">
                                    <dt className="font-mono text-slate-400">{String(index + 1).padStart(2, "0")}</dt>
                                    <dd className="font-medium text-slate-800 dark:text-slate-200">{feature}</dd>
                                  </div>
                                ))}
                          </dl>
                        )}

                        <div className="mt-auto pt-5">
                          <Link href={productHref} className="inline-flex min-h-11 w-full items-center justify-between border border-slate-950 bg-slate-950 px-4 text-sm font-bold text-white transition hover:border-cyan-800 hover:bg-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 dark:border-white dark:bg-white dark:text-slate-950 dark:hover:border-cyan-300 dark:hover:bg-cyan-300">
                            {copy.viewProduct}
                            <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
                          </Link>
                        </div>
                      </div>
                    </article>
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
