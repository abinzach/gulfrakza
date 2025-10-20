export type CatalogSortOption = "relevance" | "name-asc" | "name-desc"

export interface CatalogFilterState {
  searchTerm: string
  categorySlug: string | null
  features: string[]
  brands: string[]
  sortOrder: CatalogSortOption
}

const sortOptions: CatalogSortOption[] = ["relevance", "name-asc", "name-desc"]

const createDefaultFilters = (): CatalogFilterState => ({
  searchTerm: "",
  categorySlug: null,
  features: [],
  brands: [],
  sortOrder: "relevance",
})

const sortAndUnique = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))

export const parseFiltersFromSearchParams = (
  params: URLSearchParams,
): CatalogFilterState => {
  const state = createDefaultFilters()

  const category = params.get("category")
  state.categorySlug = category ? category.trim() || null : null

  const parseMultiValue = (key: string) =>
    sortAndUnique(
      params
        .getAll(key)
        .flatMap((entry) => entry.split(","))
        .map((entry) => entry.trim())
        .filter(Boolean),
    )

  state.features = parseMultiValue("features")
  state.brands = parseMultiValue("brands")

  const search = params.get("search")
  state.searchTerm = search ? search.trim() : ""

  const sort = params.get("sort") as CatalogSortOption | null
  if (sort && sortOptions.includes(sort)) {
    state.sortOrder = sort
  }

  return state
}

export const buildSearchParamsFromFilters = (state: CatalogFilterState): string => {
  const params = new URLSearchParams()

  if (state.categorySlug) {
    params.set("category", state.categorySlug)
  }

  const sortedFeatures = sortAndUnique(state.features)
  sortedFeatures.forEach((feature) => {
    params.append("features", feature)
  })

  const sortedBrands = sortAndUnique(state.brands)
  sortedBrands.forEach((brand) => {
    params.append("brands", brand)
  })

  const trimmedSearch = state.searchTerm.trim()
  if (trimmedSearch) {
    params.set("search", trimmedSearch)
  }

  if (state.sortOrder !== "relevance") {
    params.set("sort", state.sortOrder)
  }

  return params.toString()
}
