# GulfRakza Product Catalog UX Case Study

Research date: 25 August 2026

Scope: product listing pages (PLP), category listings, product detail pages (PDP), industrial procurement behavior, mobile filtering, accessibility, and search visibility.

## Problem statement

The current catalog presents category names inside the filter rail as links to standalone category pages. A buyer therefore clicks what appears to be a filter and unexpectedly leaves the catalog. Product cards also expose too little procurement information, while the product page distributes important facts across several rounded cards without a strong technical-information hierarchy.

The redesign must let buyers narrow the current result set without a page transition, keep filter state shareable through the URL, preserve crawlable category pages for search engines, and make product comparison possible before opening every product.

## Research method

- Reviewed 15 product-listing, filtering, and product-detail implementations across industrial supply, electronics distribution, home improvement, and published design case studies.
- Prioritized live industrial catalogs and evidence-backed UX research over visual-trend galleries.
- Inspected visible page structure, interaction labels, result counts, facet behavior, card content, specification presentation, calls to action, and mobile patterns.
- Used Behance and other portfolio case studies only for layout exploration. They were not treated as usability evidence.
- Mobbin did not expose a useful set of publicly inspectable desktop industrial catalog examples during this pass, so it was not used as evidence.

## Comparative review

| Reference | Page type | Useful pattern | What GulfRakza should take | What not to copy |
| --- | --- | --- | --- | --- |
| [Baymard product-list research](https://baymard.com/research/ecommerce-product-lists) | PLP benchmark | Facets, sorting, list information, applied-filter feedback | Treat filtering, sorting, and card information as one system | Generic one-size-fits-all retail cards |
| [Baymard applied filters](https://baymard.com/blog/how-to-design-applied-filters) | Filtering | Removable filter summary above results | Show every active choice and a clear reset | Hidden state or filters that silently navigate |
| [Hilti grinders and sanders](https://www.hilti.com/c/CLS_POWER_TOOLS_7125/CLS_GRINDERS_SANDERS_7125) | Industrial PLP | Product count, category-specific facets, list/grid control, key specs on results | Use application and technical attributes beside each product | Hilti's ecommerce-only purchase controls that do not fit an RFQ catalog |
| [Grainger safety](https://www.grainger.com/category/safety) | Industrial category/PLP | Deep category coverage and procurement-first taxonomy | Make categories scannable and show counts | Excessive merchandising modules before results |
| [McMaster-Carr lifts](https://www.mcmaster.com/products/lifts/) | Industrial category | Dense, plain-language category descriptions | Use concise “what it is for” descriptions | Its visually dated density at small screens |
| [McMaster-Carr lifting devices](https://www.mcmaster.com/products/lifting-devices/) | Industrial PLP | Searchable technical facets and numeric attributes | Surface filters that match buyer vocabulary | Exposing every possible attribute at once |
| [RS site safety](https://my.rs-online.com/web/c/site-safety/) | Industrial PLP | Search within long facets, counts, product type and availability | Add counts and scalable facet groups | Overly tall filter columns without progressive disclosure |
| [DigiKey result table](https://www.digikey.com/en/products/result?s=N4Ig7CBcoIYE5QIwA5ECYA0IYBcmKwAcBLJAZgE4wK0BWMAXwaA) | Technical PLP | Comparison-ready columns, stock, packaging, lifecycle and specifications | Make model/spec data visible before PDP entry | A wide data table for GulfRakza's mixed catalog and mobile audience |
| [DigiKey product detail](https://www.digikey.com/en/products/detail/taiyo-yuden/LLMGA201208T221RG/16661819) | Technical PDP | Manufacturer number, concise description, datasheet and attribute table | Put identifiers, resources and specs close to the title | Component-distributor pricing density that GulfRakza cannot support |
| [Mouser smart filtering](https://www.mouser.com/en/searchtools/) | Technical PLP | Prevents dead-end combinations by disabling impossible options | Recalculate counts and avoid misleading zero-result choices | Complex engineering controls where product data is incomplete |
| [Mouser filter result](https://www.mouser.com/c/passive-components/filters/?circuit+type=C+Filter) | Technical PLP | Search within results, result count, selectable views and parametric facets | Keep search and filters visibly connected to results | Spreadsheet-scale columns on general industrial categories |
| [Uline category index](https://www.uline.com/Product/CategoryIndex) | Industrial navigation | Direct, inventory-oriented category naming | Favor clear nouns and fast scanning | Extremely long undifferentiated directory pages |
| [Zoro industrial filters](https://www.zoro.com/general-purpose-filter/c/6581/) | Industrial PLP | Familiar filter/sort entry point and category shortcuts | Keep controls conventional and immediately recognizable | Promotional clutter around product selection |
| [SelectBlinds PLP redesign case study](https://experience.jasonniemoth.com/portfolio/ecommerce-product-landing-page-redesign/) | Tested PLP redesign | Filtering and product preview without leaving the page; reported gains from testing | Make the page update in place and keep comparison context | Assuming another site's conversion figures predict GulfRakza results |
| [Behance PLP case study](https://www.behance.net/gallery/62869201/Ecommerce-Product-Listing-Page-UX-Case-study-UI) | Visual/UX case study | Major decision information on each result and a legible left rail | Use restrained spacing and stronger content hierarchy | Fashion-specific ratings, price treatments, and decorative minimalism |
| [Cause Cart filter case study](https://www.courtneymartindesign.com/cause-cart) | UX case study | Checkbox multi-select and explicit separation of filter concepts | Use familiar checkbox semantics for facets | Novel filter language that buyers must learn |
| [iPrice filter redesign](https://habr.com/en/articles/505436/) | UX case study | Applied-filter overview and sticky access to filtering/sorting | Keep selected state visible while scrolling | A permanently sticky interface that consumes too much mobile height |
| [Baymard PDP research](https://baymard.com/research/product-page) | PDP benchmark | Images, product facts, specs, resources and cross-navigation must form one decision flow | Use a two-column summary followed by a sticky table of contents and long-form sections | Hiding technical facts inside tabs or accordions by default |

## Evidence-backed design principles

1. **Filtering stays in context.** A category choice updates the visible products, count, filter summary, and URL query string. It does not open the SEO category page.
2. **Navigation and filtering are visually distinct.** Breadcrumbs and category landing links navigate. Checkboxes and filter rows refine.
3. **State is visible and reversible.** Applied-filter chips sit above results; each can be removed independently; “Clear all” appears only when needed.
4. **The URL remains useful.** Query parameters make filtered views shareable and support browser history without a full document reload. Filtered query URLs remain `noindex,follow`; canonical category pages remain crawlable.
5. **Cards support decisions.** Each result shows brand, name, category, availability, and up to three real features/specifications from Sanity.
6. **Industrial density is deliberate.** Square geometry, rules, compact spacing, tabular numerals, and restrained cyan accents create a procurement-tool feel without becoming a spreadsheet.
7. **Mobile filtering is a task flow.** The drawer stays open while selections are made, shows the live result count, and closes only through an explicit “Show results” action.
8. **The PDP resolves the buyer's first questions above the fold.** What is it, who makes it, what is the model/SKU, is it available, what are the essential specs, and how do I request a quote?
9. **Technical content remains indexable.** Specifications and rich descriptions remain server-rendered in the page, not hidden behind client-only tabs.
10. **No fabricated commercial data.** The interface uses only Sanity-backed content and existing business contact actions. It does not invent price, certifications, lead time, ratings, or minimum quantities.

## Chosen direction: Industrial Procurement Desk

The visual direction is a clean technical catalog: warm white and slate surfaces, black section bars, cyan used only for selection/focus, square corners, thin rules, compact metadata, and generous image canvases. The page should feel closer to a well-designed equipment datasheet than a consumer marketplace.

### Product listing anatomy

1. Compact catalog header with search and a factual result summary.
2. Desktop filter rail with real category checkboxes/rows, counts, expandable groups, product attributes, and brands.
3. Mobile filter drawer with explicit close, reset, and “Show N products” controls.
4. Applied-filter summary and sort control directly above results.
5. Information-rich responsive result cards with a visible “View product” affordance.
6. Purpose-built empty state explaining which filters can be removed.

### Product detail anatomy

1. Breadcrumb strip.
2. Two-column product stage: structured gallery left; procurement summary right.
3. Brand, category, product name, SKU, availability, description, sizes, key specifications, quote action, and contact options in one coherent reading order.
4. Full-width sticky section navigation.
5. Long-form overview, specification table, features, downloads, review information, and related products with square, technical styling.

## Deliberate exclusions

- Do not delete or redirect SEO category pages.
- Do not use category-card clicks as filter controls.
- Do not add ratings, prices, discounts, countdowns, fake scarcity, made-up certifications, or made-up stock promises.
- Do not hide specifications behind tabs that Google or users may miss.
- Do not use pill-shaped containers, excessive shadows, gradient card backgrounds, or hover-only information.
- Do not implement infinite scroll; the current catalog size does not justify the discoverability and history tradeoffs.
- Do not add a comparison feature until consistent structured specifications exist across categories.

## Acceptance tests

### Filtering

- [ ] Clicking any category name or its checkbox changes results on the same page.
- [ ] No category filter control routes to `/products/category/...`.
- [ ] The selected category is visibly checked and appears in the applied-filter summary.
- [ ] Product count updates immediately.
- [ ] Search, brand, and attribute filters combine correctly.
- [ ] Removing one applied filter leaves the others intact.
- [ ] Clear all restores the full catalog.
- [ ] The URL query string updates without scrolling to the top.
- [ ] Reloading a filtered URL restores the same state.
- [ ] Browser back/forward restores previous filter states.

### Product listing UI

- [ ] Cards use only real product data.
- [ ] Product names, images, category, availability, and useful attributes remain readable at 320 px.
- [ ] Desktop filter rail remains usable at 1024 px and above.
- [ ] Mobile drawer has keyboard focusable controls and an explicit result action.
- [ ] Focus indicators are visible and color contrast is sufficient.
- [ ] Empty results clearly explain recovery.

### Product detail UI

- [ ] The first viewport communicates identity, availability, essential facts, and RFQ action.
- [ ] Gallery controls have accessible names and keyboard operation.
- [ ] All available specifications, features, body content, and resources render.
- [ ] Section navigation lands below the fixed header.
- [ ] Mobile sticky action does not cover content.
- [ ] Related products preserve usable image and title hierarchy.

### SEO and engineering

- [ ] The unfiltered catalog and category pages remain indexable.
- [ ] Filter query pages remain `noindex,follow` and canonicalize to the catalog.
- [ ] Category pages retain crawlable product links.
- [ ] Product and breadcrumb JSON-LD remain valid and server-rendered.
- [ ] No console errors or hydration warnings.
- [ ] Lint, TypeScript, and production build pass.
