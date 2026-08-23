# GulfRakza SEO & AI Search Implementation Plan

**Domain:** https://www.gulfrakza.com  
**Primary market:** Dammam, Eastern Province, Saudi Arabia  
**Languages:** English and Arabic  
**Prepared:** 2026-08-23  
**Status:** Implementation-ready plan based on the live-site and repository audit

---

## 1. Objective

Build a search architecture in which every important GulfRakza product, category, and service intent has one crawlable, indexable, technically correct, evidence-rich page in English and—only when a complete translation is available—Arabic.

The plan is designed to improve:

- Non-branded Google visibility in Saudi Arabia.
- Eligibility for Google AI Overviews and AI Mode citations.
- Visibility in Bing/Copilot, ChatGPT Search, and Perplexity.
- Local visibility in Dammam and the Eastern Province.
- Qualified RFQs, calls, email enquiries, and WhatsApp enquiries.

This plan does **not** promise a specific ranking or use invented search volumes. Final keyword prioritization must use real Google Search Console and, where available, Google Ads Keyword Planner data filtered to Saudi Arabia.

---

## 2. Audit Baseline

Record these numbers before implementation so later changes can be evaluated honestly.

### Current technical baseline

- 56 sitemap URLs.
- 12 localized core/legal URLs.
- 22 English product URLs and 22 Arabic product URLs.
- No indexable product-category landing pages.
- No individual service landing pages.
- All 56 audited URLs return HTTP 200.
- All audited URLs have self-referencing canonicals.
- English, Arabic, and `x-default` hreflang links are present.
- Product catalog pages have no `<h1>` in the live HTML.
- Sitemap `lastmod` uses the current request time rather than the real content modification time.
- 21 of 22 Arabic product titles are identical to the English title.
- 16 of 22 English products have descriptions shorter than 70 characters.
- None of the 22 product pages currently exposes the available Detailed Overview, Specifications, or Key Features sections.
- Core pages currently return `Cache-Control: no-store`.
- Product `Offer` JSON-LD contains currency and availability but no price.
- JSON-LD is client-managed rather than emitted as a literal server-rendered script.

### Current synthetic Lighthouse baseline

| Page | Performance | SEO checklist | LCP | Transfer size |
|---|---:|---:|---:|---:|
| `/en` | 91 | 100 | 3.0 s | 3,747 KiB |
| `/en/products` | 91 | 100 | 3.5 s | 541 KiB |
| Sample product | 92 | 100 | 3.3 s | 517 KiB |

Lighthouse SEO 100 is only a technical checklist result. It does not measure content quality, topical authority, local prominence, query relevance, or ranking ability.

### Baseline capture checklist

- [ ] Export the last 16 months of Google Search Console page/query data.
- [ ] Filter and separately export Saudi Arabia traffic.
- [ ] Separate branded queries (`gulfrakza`, `gulf rakza`, legal-name variations) from non-branded queries.
- [ ] Export Search Console indexing/page-status data.
- [ ] Export Search Console Core Web Vitals data.
- [ ] Record Google Business Profile calls, website clicks, direction requests, and search terms if a profile exists.
- [ ] Export GA4 organic landing-page conversions.
- [ ] Record Bing Webmaster Tools indexed pages and search performance.
- [ ] Save current sitemap URL list and status/canonical/hreflang results.
- [ ] Save Lighthouse JSON reports for the three baseline pages.

### Gate 0 — do not proceed until

- [ ] Baseline exports are stored outside the application repository in a secure reporting location.
- [ ] The team knows which events represent an RFQ, phone call, email enquiry, and WhatsApp enquiry.
- [ ] At least one responsible person owns Search Console, GA4, Google Business Profile, and Bing Webmaster Tools access.

---

## 3. Rules for the Entire Project

### Always do

- [ ] Use information verified by GulfRakza staff, manufacturers, technical sheets, certificates, or completed project records.
- [ ] Design pages for industrial buyers, procurement teams, engineers, HSE teams, and project managers.
- [ ] Make important content available in server-rendered text.
- [ ] Use ordinary crawlable links for navigation.
- [ ] Keep structured data identical to the visible page content.
- [ ] Publish a localized URL only when its principal content is genuinely localized.
- [ ] Use the legal business name, public brand, address, and telephone numbers consistently.
- [ ] Record the source and verification date for technical claims.
- [ ] Preserve or redirect every URL that has already acquired search signals.
- [ ] Test one controlled batch before applying a change to every product.

### Never do

- [ ] Do not generate hundreds of generic articles or city doorway pages.
- [ ] Do not create pages for categories with zero real products or services.
- [ ] Do not invent prices, ratings, reviews, certifications, clients, stock, delivery times, project outcomes, or years of experience.
- [ ] Do not publish automatically translated technical content without Arabic review.
- [ ] Do not mark English fallback content as an Arabic page.
- [ ] Do not use `llms.txt` as a substitute for normal SEO.
- [ ] Do not add FAQ schema merely to chase rich results.
- [ ] Do not repeat exact keywords unnaturally.
- [ ] Do not change URLs solely to insert more keywords.
- [ ] Do not buy bulk backlinks or submit the company to low-quality directories.
- [ ] Do not use `new Date()` as the modification time for unchanged sitemap entries.
- [ ] Do not put an `Offer` in Product schema without a genuine visible offer and required data.
- [ ] Do not move to the next phase when its gate has failed.

---

## 4. Phase 1 — Measurement, Build Safety, and Release Controls

### Goal

Create a repeatable verification process before making SEO-sensitive route, metadata, or content changes.

### Work checklist

- [ ] Confirm `main` is clean and synchronized with `origin/main`.
- [ ] Document the production deployment workflow and rollback workflow.
- [ ] Confirm the Sanity production dataset and project ID.
- [ ] Update the lint script from deprecated `next lint` to the supported ESLint command for the installed Next.js version.
- [ ] Add a single `verify` script that runs TypeScript, lint, and production build checks.
- [ ] Add a route verification script or test that can check:
  - [ ] HTTP status.
  - [ ] Index/noindex state.
  - [ ] Canonical URL.
  - [ ] HTML language and direction.
  - [ ] Exactly one meaningful H1.
  - [ ] Hreflang self-reference and return links.
  - [ ] Presence and validity of expected JSON-LD.
- [ ] Keep a fixture list containing representative URLs:
  - [ ] English home.
  - [ ] Arabic home.
  - [ ] English catalog.
  - [ ] Arabic catalog.
  - [ ] English category.
  - [ ] Arabic category.
  - [ ] English product.
  - [ ] Arabic product.
  - [ ] English service.
  - [ ] Arabic service.
  - [ ] A deliberately missing route.

### Suggested verification commands

```sh
npm ci
npx tsc --noEmit
npx eslint .
npm run build
git diff --check
```

### Do not

- [ ] Do not combine architecture, translation, schema, and performance changes in one unreviewable release.
- [ ] Do not rely only on Lighthouse SEO scoring.
- [ ] Do not deploy without a documented rollback commit.

### Test checklist

- [ ] Clean dependency installation succeeds.
- [ ] TypeScript passes.
- [ ] ESLint passes or has an explicitly reviewed existing-warning baseline.
- [ ] Production build passes.
- [ ] Existing 56 sitemap URLs still return their intended status.
- [ ] A missing product returns a real 404, not a soft-404 page with status 200.
- [ ] Test output identifies a deliberately broken canonical or hreflang fixture.
- [ ] Deployment preview matches the production routing environment.

### Gate 1 — do not proceed until

- [ ] All automated checks can be run with one documented command.
- [ ] Existing-route regressions are detectable.
- [ ] Rollback instructions have been tested in a preview/staging environment.

---

## 5. Phase 2 — Fix Crawlability, Sitemap Accuracy, and Rendering

### Goal

Make technical signals accurate, stable, and inexpensive for crawlers to process.

### 2.1 Correct sitemap modification dates

#### Do

- [ ] Add `_updatedAt` to Sanity product/category/service queries.
- [ ] Use the content document's real `_updatedAt` as sitemap `lastModified`.
- [ ] Maintain real modification dates for static pages.
- [ ] Include only canonical, indexable, HTTP-200 URLs.
- [ ] Remove incomplete localized pages from the sitemap until they are publishable.
- [ ] Add future category and service pages only after they pass their publication gates.

#### Do not

- [ ] Do not use the time the sitemap was requested.
- [ ] Do not update `lastModified` because a global footer, analytics script, or build identifier changed.
- [ ] Do not include redirected, noindexed, empty, or missing URLs.

#### Test

- [ ] Request the sitemap twice several minutes apart; unchanged URLs retain identical `lastmod` values.
- [ ] Update one test product in Sanity; only that product's `lastmod` changes after revalidation.
- [ ] Every sitemap URL returns 200.
- [ ] Every sitemap URL is canonical to itself.
- [ ] No sitemap URL contains a query string.
- [ ] XML validates and remains below sitemap protocol limits.

### 2.2 Remove unnecessary dynamic rendering

#### Do

- [ ] Remove request-header dependencies used only to construct pathname metadata.
- [ ] Generate canonicals from route parameters and known route structure.
- [ ] Restructure locale handling so `lang` and `dir` remain correct without forcing every page to `no-store`.
- [ ] Keep Sanity content on controlled ISR/revalidation.
- [ ] Add tag-based or webhook-triggered revalidation for changed Sanity documents.

#### Do not

- [ ] Do not cache personalized or authenticated content publicly.
- [ ] Do not trade correct language attributes for caching.
- [ ] Do not serve stale stock claims indefinitely.

#### Test

- [ ] Production responses no longer return `private, no-store` for public content pages.
- [ ] English pages render `lang="en" dir="ltr"`.
- [ ] Arabic pages render `lang="ar" dir="rtl"`.
- [ ] A Sanity update becomes visible within the agreed revalidation window.
- [ ] Canonicals remain correct on nested product, category, and service routes.
- [ ] Logged-out responses never contain preview/draft content.

### 2.3 Server-render structured data

#### Do

- [ ] Emit literal server-rendered `<script type="application/ld+json">` elements.
- [ ] Give the Organization a stable `@id`, such as `https://www.gulfrakza.com/#organization`.
- [ ] Use `Organization` for the company entity and `LocalBusiness` only where its physical/local attributes are relevant.
- [ ] Add the verified LinkedIn company profile to `sameAs`.
- [ ] Keep Product and Breadcrumb JSON-LD page-specific.
- [ ] Remove the incomplete Product `Offer` until a genuine visible price/offer is available.

#### Do not

- [ ] Do not add properties that are not visible or verifiable.
- [ ] Do not put generic five-star ratings into schema.
- [ ] Do not use the company homepage as its own `sameAs` value.
- [ ] Do not use an availability status that contradicts the visible stock state.

#### Test

- [ ] JSON-LD exists in the initial server HTML with JavaScript disabled.
- [ ] JSON parses without errors.
- [ ] Google's Rich Results Test reports no Product/Breadcrumb critical errors.
- [ ] Schema.org Validator reports no syntax errors.
- [ ] Product name, SKU, brand, image, availability, and URL match visible content.
- [ ] Arabic schema uses Arabic names only where those names are genuinely translated.
- [ ] Breadcrumb items resolve to canonical, indexable pages.

### Gate 2 — do not proceed until

- [ ] Sitemap dates are stable and truthful.
- [ ] Public content can be cached/revalidated safely.
- [ ] JSON-LD is present in initial HTML and passes validation.
- [ ] Existing indexed URLs have not been accidentally redirected or noindexed.

---

## 6. Phase 3 — Build Indexable Product and Service Architecture

### Goal

Create landing pages that match actual Saudi buyer intents and link cleanly to the products/services GulfRakza can supply.

### 3.1 Choose pages from evidence

Use this order of evidence:

1. Actual revenue and RFQ history.
2. Search Console Saudi query/impression data.
3. Current verified inventory and supplier relationships.
4. Sales-team and technical-team priorities.
5. Saudi Keyword Planner data.
6. Competitor coverage as a gap check—not as content to copy.

### Initial candidate product pages

Create only the pages supported by real inventory and expertise. Candidates from the current catalog include:

- [ ] Fall protection equipment.
- [ ] Safety footwear.
- [ ] Safety helmets and head protection.
- [ ] Lifelines and fall arresters.
- [ ] Lifting hooks, shackles, and winches.
- [ ] Welding PPE.
- [ ] Industrial generators.

Example routes:

```text
/en/products/fall-protection
/en/products/fall-protection/lifelines
/en/products/ppe/safety-footwear
/en/products/lifting/shackles-and-hooks

/ar/products/fall-protection
/ar/products/fall-protection/lifelines
/ar/products/ppe/safety-footwear
/ar/products/lifting/shackles-and-hooks
```

Arabic slugs may be localized later if the team can maintain stable redirects and content operations. Language quality matters more than inserting Arabic words into the URL.

### Initial candidate service pages

- [ ] Safety services.
- [ ] Cathodic protection.
- [ ] Scaffolding.
- [ ] Steel fabrication.
- [ ] Civil works.
- [ ] HVAC installation and maintenance.
- [ ] Mechanical maintenance/bolt torquing.
- [ ] Safety training.

### Page requirements checklist

Each indexable category page must have:

- [ ] One specific H1.
- [ ] A concise, useful introduction written for the buyer.
- [ ] Real child categories and/or products linked with `<a href>`.
- [ ] Product count greater than zero.
- [ ] Relevant brands actually supplied.
- [ ] Applicable standards or selection factors verified by a technical reviewer.
- [ ] Delivery/service-area information.
- [ ] RFQ requirements or selection guidance.
- [ ] Unique title and description.
- [ ] Self-canonical.
- [ ] Breadcrumbs linking to indexable parents.
- [ ] Correct language alternate only when the alternate is complete.
- [ ] Original or licensed relevant image with useful alt text.
- [ ] Visible last-reviewed/updated date tied to a real review.

Each indexable service page must additionally have:

- [ ] Clear scope and exclusions.
- [ ] Industries served.
- [ ] Process and deliverables.
- [ ] Safety/quality controls.
- [ ] Service locations actually covered.
- [ ] Required client inputs.
- [ ] Real project evidence or team expertise.
- [ ] Relevant certifications only when verified.
- [ ] A service-specific enquiry CTA.

### Internal-linking checklist

- [ ] Homepage links to priority category and service pages.
- [ ] Product menu uses anchors rather than filter-only buttons for indexable nodes.
- [ ] Category pages link to every indexable child product.
- [ ] Products link back to their canonical category pages.
- [ ] Breadcrumb schema and visible breadcrumbs use the same URLs.
- [ ] Related-product links remain language-localized.
- [ ] Arabic links do not redirect through English.
- [ ] No important page requires form submission or internal search to be discovered.

### Redirect checklist

- [ ] Inventory current legacy category URLs.
- [ ] Map each legacy URL to the most relevant new canonical category—not always the catalog root.
- [ ] Use permanent redirects only when the mapping is stable and equivalent.
- [ ] Avoid redirect chains.
- [ ] Preserve query filters for users without presenting them as indexable landing pages.

### Do not

- [ ] Do not create pages for zero-product categories.
- [ ] Do not create one page for every keyword variation.
- [ ] Do not create near-identical Dammam, Khobar, Jubail, and Dhahran pages.
- [ ] Do not copy manufacturer or competitor descriptions.
- [ ] Do not index internal search result pages.
- [ ] Do not canonicalize real category pages back to the catalog.

### Test checklist

- [ ] New category/service pages return 200 and a meaningful H1.
- [ ] View-source contains primary copy and product/service links.
- [ ] Every linked product is reachable without JavaScript.
- [ ] Every breadcrumb URL returns 200 and is self-canonical.
- [ ] Filtered catalog URLs canonicalize to the correct unfiltered landing page where appropriate.
- [ ] Empty categories return 404/noindex or remain unpublished.
- [ ] Crawl depth from homepage to a product is no more than three meaningful link steps where practical.
- [ ] No redirect chains exceed one hop.
- [ ] Search Console URL Inspection sees the same main content as a browser.

### Gate 3 — do not proceed until

- [ ] At least one complete category cluster works end-to-end in English.
- [ ] Googlebot can crawl home → category → product through anchors.
- [ ] No empty/duplicate category page is indexable.
- [ ] Redirects and canonicals pass automated tests.

---

## 7. Phase 4 — Make Arabic Localization Trustworthy

### Goal

Ensure every indexed `/ar/` page is useful to an Arabic-speaking Saudi buyer and is not merely an English fallback with an Arabic URL.

### Publication policy

An Arabic page may be indexable only when all principal content is translated and reviewed. Navigation/footer translation alone is insufficient.

### Required Arabic fields

- [ ] Title/H1.
- [ ] Meta title and description.
- [ ] Summary and detailed body.
- [ ] Category and breadcrumb names.
- [ ] Features.
- [ ] Specification labels and language-sensitive values.
- [ ] Stock/availability labels.
- [ ] Size/variant labels where localization is relevant.
- [ ] RFQ instructions and CTA text.
- [ ] Resource/download titles.
- [ ] Image alt text.
- [ ] Structured-data text values.

### Application changes

- [ ] Add a content-completeness function for each localized document type.
- [ ] Stop silently falling back from Arabic principal content to English.
- [ ] If Arabic is incomplete:
  - [ ] Do not generate an Arabic product/category/service URL, or
  - [ ] Return `noindex` and omit it from hreflang/sitemap until complete.
- [ ] Add Sanity validation warnings/errors for missing Arabic fields on documents marked ready for Arabic publication.
- [ ] Add an explicit publication-state field if necessary: draft, English-ready, Arabic-ready.

### Translation quality checklist

- [ ] Reviewed by a fluent Arabic speaker familiar with industrial/procurement terminology.
- [ ] Saudi terminology is natural and consistent.
- [ ] Brand/model identifiers remain unchanged.
- [ ] Standards such as EN/ANSI/SASO are not mistranslated.
- [ ] Technical units remain correct.
- [ ] RTL layout is visually checked on mobile and desktop.
- [ ] Punctuation, mixed Arabic/Latin model names, and numerals display correctly.
- [ ] Arabic copy communicates the same scope and limitations as English.

### Hreflang checklist

- [ ] Each English page lists itself and its complete Arabic counterpart.
- [ ] Each Arabic page returns the same set of reciprocal links.
- [ ] Incomplete Arabic URLs do not appear as alternates.
- [ ] `x-default` points to the intended fallback/selector behavior.
- [ ] Canonicals remain within the same language version.
- [ ] No Arabic canonical points to an English page unless the Arabic URL is deliberately retired.

### Do not

- [ ] Do not use browser auto-translation as published content.
- [ ] Do not translate certifications or model codes into something technically different.
- [ ] Do not expose English titles under Arabic hreflang merely to double URL count.
- [ ] Do not publish an Arabic page until a human has reviewed the rendered page.

### Test checklist

- [ ] Automated comparison flags identical English/Arabic titles and descriptions.
- [ ] Automated check flags English fallback in required Arabic fields.
- [ ] Human reviewer approves the first complete category cluster.
- [ ] Arabic catalog has an Arabic H1, title, description, filters, result labels, and CTAs.
- [ ] Arabic product breadcrumbs and related links stay under `/ar/`.
- [ ] Google URL Inspection identifies the Arabic page as Arabic content.
- [ ] Hreflang return links pass for every published pair.

### Gate 4 — do not proceed until

- [ ] The first Arabic category cluster has zero English principal-content fallbacks.
- [ ] Human Arabic QA is signed off.
- [ ] Only complete Arabic URLs appear in sitemap and hreflang.

---

## 8. Phase 5 — Enrich Product Pages in Controlled Batches

### Goal

Turn thin product records into useful procurement pages that can rank, convert, and support accurate AI citations.

### Sanity content model checklist

- [ ] Manufacturer/brand.
- [ ] Model.
- [ ] SKU.
- [ ] Manufacturer part number where applicable.
- [ ] Country of origin.
- [ ] Short summary.
- [ ] Detailed description.
- [ ] Use cases/industries.
- [ ] Features.
- [ ] Structured specifications.
- [ ] Applicable standard/certification.
- [ ] Certification evidence/document.
- [ ] Compatibility/limitations.
- [ ] Sizes and variants.
- [ ] Stock state or truthful lead-time state.
- [ ] Warranty/return information where applicable.
- [ ] Product resources/data sheets.
- [ ] Image gallery and alt text.
- [ ] SEO title/description overrides.
- [ ] English-ready and Arabic-ready status.
- [ ] Technical reviewer.
- [ ] Last verified date.
- [ ] Source/evidence notes kept internally where appropriate.

### Product-page visible-content checklist

- [ ] Unique H1 with correct product/model.
- [ ] Category path.
- [ ] Brand and SKU/model.
- [ ] Buyer-focused description.
- [ ] Specifications rendered as semantic table or definition list.
- [ ] Features and limitations.
- [ ] Standards/certification statement with evidence.
- [ ] Availability/lead-time language.
- [ ] Downloadable technical resources.
- [ ] Delivery coverage.
- [ ] RFQ requirements.
- [ ] Related products from the correct category.
- [ ] Named technical review or verification date where suitable.

### First content batch

Start with no more than five products representing commercially important and technically supportable inventory, for example:

- [ ] High-ankle S3 safety shoe.
- [ ] Low-ankle S3 safety shoe.
- [ ] Horizontal lifeline.
- [ ] Rope grab fall arrester.
- [ ] Retractable fall-arrester block.

Choose the final five from revenue/RFQ/Search Console evidence.

### Product schema rules

- [ ] Use Product schema for verifiable product identity.
- [ ] Include real SKU/MPN/brand/image/category where available.
- [ ] Include `Offer` only if a real visible purchasable offer exists.
- [ ] If prices are genuinely published, keep price, currency, availability, and visible content synchronized.
- [ ] Do not add AggregateRating until genuine eligible reviews exist and are visible.
- [ ] Do not mark a generic company testimonial as a product review.

### Do not

- [ ] Do not fill fields with generic AI-generated prose.
- [ ] Do not copy manufacturer text verbatim without rights and added GulfRakza value.
- [ ] Do not say “certified” without identifying and verifying the certification.
- [ ] Do not mark all products “ready to ship” unless inventory supports it.
- [ ] Do not create fake SKU values just to satisfy schema.
- [ ] Do not publish `price: 0`, “price on request” as a numeric price, or invisible schema prices.

### Test checklist for each product

- [ ] Technical reviewer confirms every specification and standard.
- [ ] Sales/operations confirms availability language.
- [ ] English editorial review passes.
- [ ] Arabic technical review passes before Arabic publication.
- [ ] Title, H1, canonical, description, hreflang, and schema are unique/correct.
- [ ] Initial HTML contains the important product information.
- [ ] Images load with dimensions and useful alt text.
- [ ] Downloads return 200 and have meaningful filenames/titles.
- [ ] Rich Results Test has no critical error.
- [ ] Product is linked from an indexable category.
- [ ] Product appears once in the sitemap per complete language version.
- [ ] RFQ, email, phone, and WhatsApp actions work and preserve the product context.

### Batch gate

- [ ] Release the first five products.
- [ ] Monitor rendering, indexing, engagement, and enquiries for at least two crawl cycles or an agreed observation period.
- [ ] Correct the content model/template before applying it to the remaining products.

### Gate 5 — do not proceed until

- [ ] The first batch passes technical, English, Arabic, and commercial QA.
- [ ] No false product/schema claims have been published.
- [ ] Search Console can index the enriched pages without enhancement errors.

---

## 9. Phase 6 — Build Service Pages and Original Authority Content

### Goal

Demonstrate real GulfRakza expertise beyond a generic list of services.

### Service-page content checklist

- [ ] Exact service scope.
- [ ] Problems addressed.
- [ ] Deliverables.
- [ ] Process/method.
- [ ] Equipment and materials used.
- [ ] Applicable standards and safety controls.
- [ ] Industries served.
- [ ] Geographic coverage.
- [ ] Required client inputs.
- [ ] Typical constraints and exclusions.
- [ ] Named responsible team expertise.
- [ ] Real project photos or diagrams.
- [ ] Relevant case study.
- [ ] Service-specific enquiry form/context.

### High-value original resource candidates

Create resources only when GulfRakza can add first-hand or technical value:

- [ ] Fall-protection equipment RFQ checklist for Saudi industrial sites.
- [ ] EN 353-2 and ANSI Z359 selection/comparison guide reviewed by a qualified person.
- [ ] S1/S2/S3 safety-footwear procurement guide.
- [ ] Lifeline and fall-arrester inspection/procurement checklist.
- [ ] Shutdown/project industrial-supply planning checklist.
- [ ] Case study covering a real sourcing or engineering-support problem.

### Case-study minimum evidence

- [ ] Client name with permission, or a truthful anonymized sector/location description.
- [ ] Real project period.
- [ ] Problem and constraints.
- [ ] GulfRakza scope.
- [ ] Products/services supplied.
- [ ] Standards/quality controls.
- [ ] Quantified result only when documented.
- [ ] Original photographs/documents when permitted.
- [ ] Named internal reviewer.

### Do not

- [ ] Do not publish generic “Top 10 safety tips” content.
- [ ] Do not rewrite competing articles.
- [ ] Do not mass-produce question pages for query fan-out.
- [ ] Do not imply Aramco, SABIC, Civil Defence, ISO, or manufacturer approval without evidence and permission.
- [ ] Do not expose confidential customer or project information.
- [ ] Do not create fake authors or reviewers.

### Test checklist

- [ ] Service page answers a real sales/procurement question better than the current combined services page.
- [ ] Claims have source records and reviewer sign-off.
- [ ] Page has unique title/H1/canonical and correct alternates.
- [ ] Page is linked from navigation, the services hub, and relevant products/resources.
- [ ] Case-study privacy/permission review passes.
- [ ] Main answer, supporting evidence, tables, and headings are readable without JavaScript.
- [ ] AI/search crawler access is not blocked.
- [ ] Enquiry actions include the originating service/resource context.

### Gate 6 — do not proceed until

- [ ] At least two priority service pages and one evidence-backed resource/case study are live.
- [ ] Every technical claim has an owner and verification source.
- [ ] Pages have begun receiving impressions or have been successfully indexed before scaling the template.

---

## 10. Phase 7 — Local SEO and Entity Consistency

### Goal

Make GulfRakza an unambiguous, verifiable Dammam business entity across the website and trusted external platforms.

### Establish the canonical NAP record

Confirm and approve one record containing:

- [ ] Real-world public business name.
- [ ] Legal name.
- [ ] Full street/building/office address.
- [ ] District, city, region, postal code, country.
- [ ] Landline.
- [ ] Primary mobile/WhatsApp number.
- [ ] Primary sales email.
- [ ] Opening hours.
- [ ] Map pin/coordinates.
- [ ] Company registration number where appropriate.
- [ ] Founded year.
- [ ] Official website and social profiles.

### Platform checklist

- [ ] Verify/claim Google Business Profile.
- [ ] Use the real-world business name without keyword stuffing.
- [ ] Select accurate primary and secondary categories.
- [ ] Add exact address, service area, hours, phones, website, products/services, photos, and logo.
- [ ] Verify/claim Bing Places.
- [ ] Update the GulfRakza LinkedIn company page.
- [ ] Correct old phone/address information on reputable profiles.
- [ ] Add the verified LinkedIn URL to site structured data.
- [ ] Pursue manufacturer distributor/partner directories only where the relationship is real.
- [ ] Pursue relevant Saudi chamber/industry/supplier directories.
- [ ] Establish a genuine customer-review request and response process.

### Website entity checklist

- [ ] Header/footer/contact/about/schema all use the approved NAP.
- [ ] Brand spelling is intentional: `GulfRakza` versus `Gulf Rakza`.
- [ ] Legal name is consistent.
- [ ] Map coordinates match the actual office.
- [ ] `sameAs` lists only genuine external entity profiles.
- [ ] Opening hours match Business Profile.
- [ ] Copyright year updates automatically or displays a correct range.

### Do not

- [ ] Do not add city/service keywords to the Google Business Profile name unless part of real-world branding.
- [ ] Do not create fake offices or virtual locations.
- [ ] Do not buy reviews.
- [ ] Do not review-gate dissatisfied customers.
- [ ] Do not submit to hundreds of irrelevant directories.
- [ ] Do not publish customer logos without permission.

### Test checklist

- [ ] Search the brand and legal name; important results show the same NAP.
- [ ] Website, Google Business Profile, Bing Places, and LinkedIn match.
- [ ] Phone links dial the approved number.
- [ ] WhatsApp links open the approved account with correct enquiry context.
- [ ] Map pin resolves to the actual office.
- [ ] Organization/LocalBusiness schema validates and matches visible content.
- [ ] Review-request process complies with platform policy.

### Gate 7 — do not proceed until

- [ ] Canonical NAP is approved by management.
- [ ] Website and primary business profiles match.
- [ ] Legacy phone/address variants have a documented correction plan.

---

## 11. Phase 8 — AI Search and Bing Freshness Integration

### Goal

Make complete, evidence-rich content discoverable and measurable across AI-assisted search without using unsupported hacks.

### Crawler checklist

- [ ] Googlebot is allowed for indexable public content.
- [ ] OAI-SearchBot is allowed.
- [ ] Bingbot is allowed.
- [ ] PerplexityBot is allowed.
- [ ] CDN/firewall logs confirm these crawlers are not receiving accidental 403/429 responses.
- [ ] Draft, Studio, API, and administrative routes remain appropriately protected.

Explicit bot-specific `Allow` rules are optional when the wildcard rule already allows access. Add them only for operational clarity—not as a ranking tactic.

### Bing/IndexNow checklist

- [ ] Verify the domain in Bing Webmaster Tools.
- [ ] Submit the corrected sitemap.
- [ ] Implement IndexNow for publish, meaningful update, and deletion events.
- [ ] Trigger IndexNow from controlled Sanity publish/revalidation workflows.
- [ ] Do not ping unchanged URLs.
- [ ] Enable/review Bing AI Performance reporting.
- [ ] Track cited pages and grounding queries.

### Google/AI measurement checklist

- [ ] Review Search Console's Generative AI report when available to the property.
- [ ] Track citations separately from ordinary ranking where tools allow.
- [ ] Compare cited pages with non-cited but indexed pages.
- [ ] Improve missing evidence, clarity, or completeness—not artificial keyword density.
- [ ] Track ChatGPT/Perplexity/Bing referral traffic in analytics.

### Do not

- [ ] Do not create `llms.txt` expecting a Google ranking improvement.
- [ ] Do not add unsupported “AI schema.”
- [ ] Do not rewrite every paragraph into tiny artificial answer chunks.
- [ ] Do not seek fake mentions or citations.
- [ ] Do not expose private data to crawlers.

### Test checklist

- [ ] Fetch representative pages with each supported crawler user agent and confirm intended status/content.
- [ ] IndexNow key ownership validates.
- [ ] Publishing one test page sends one correct IndexNow event.
- [ ] Deleting/retiring a test URL sends the correct update and returns the planned status/redirect.
- [ ] Bing Webmaster Tools accepts the sitemap without errors.
- [ ] Analytics identifies AI referral sources and associated conversions.

### Gate 8 — do not proceed until

- [ ] Crawlers can access public content without accessing private routes.
- [ ] IndexNow events are accurate and deduplicated.
- [ ] Bing/AI measurement has an owner and monthly review cadence.

---

## 12. Phase 9 — Page Experience and Performance

### Goal

Keep the strong existing responsiveness while bringing real-user LCP into the good range and reducing unnecessary transfer size.

### Priority performance work

- [ ] Measure real-user Core Web Vitals first.
- [ ] Test the homepage with the hero video disabled on mobile.
- [ ] Compress/transcode the 8.1 MB hero video into appropriate responsive variants.
- [ ] Load video after user interaction or idle time where it does not harm the experience.
- [ ] Keep the optimized poster as the LCP element.
- [ ] Review the need for three font families and numerous weights.
- [ ] Remove unused font weights.
- [ ] Keep product/category images correctly sized and compressed.
- [ ] Preserve zero/near-zero CLS.
- [ ] Review third-party analytics impact after consent.

### Performance budgets

Use these as release guardrails, then refine with real-user data:

- [ ] Mobile LCP target: at or below 2.5 seconds at the 75th percentile.
- [ ] CLS target: at or below 0.1.
- [ ] INP target: at or below 200 ms.
- [ ] No material regression from the baseline Lighthouse scores.
- [ ] Homepage initial transfer should not automatically download the full hero video on mobile.

### Do not

- [ ] Do not remove useful product detail to reduce page weight.
- [ ] Do not lazy-load the LCP poster.
- [ ] Do not optimize only for desktop.
- [ ] Do not treat a single Lighthouse run as field performance.
- [ ] Do not add intrusive interstitials that obscure main content.

### Test checklist

- [ ] Run Lighthouse mobile at least three times per representative page and use the median.
- [ ] Test on a throttled mid-range mobile profile.
- [ ] Confirm poster loads before video.
- [ ] Confirm reduced-motion users never autoplay the video.
- [ ] Confirm mobile does not download the full video unless intended.
- [ ] Compare WebPageTest/network waterfall before and after.
- [ ] Review Search Console Core Web Vitals after enough field data accumulates.
- [ ] Verify analytics, cookie consent, RFQ, and navigation remain functional.

### Gate 9 — do not proceed until

- [ ] Performance changes improve or preserve conversion behavior.
- [ ] No accessibility or content regression was introduced.
- [ ] Field-data monitoring is active.

---

## 13. Release Process for Every Phase

### Before coding/content entry

- [ ] Define the exact URLs/documents in scope.
- [ ] Assign technical, editorial, Arabic, commercial, and technical-review owners.
- [ ] Record current URL behavior and metrics.
- [ ] Define rollback behavior.

### Before merge

- [ ] TypeScript passes.
- [ ] ESLint passes.
- [ ] Production build passes.
- [ ] SEO route checks pass.
- [ ] Structured data passes.
- [ ] English editorial review passes.
- [ ] Arabic review passes for Arabic pages.
- [ ] Technical claims review passes.
- [ ] Preview deployment is manually reviewed on mobile and desktop.
- [ ] `git diff --check` passes.
- [ ] No unrelated changes are included.

### After production deployment

- [ ] Smoke-test representative routes.
- [ ] Verify status, canonical, hreflang, H1, index state, and JSON-LD from production.
- [ ] Verify sitemap changes.
- [ ] Submit/inspect only important changed URLs in Search Console.
- [ ] Confirm IndexNow events where implemented.
- [ ] Check application/server errors.
- [ ] Check analytics events.
- [ ] Annotate the release date in reporting.

### Rollback triggers

Rollback or hotfix immediately if:

- [ ] Previously valid URLs return unintended 404/500 responses.
- [ ] Canonicals point to the wrong language/page.
- [ ] Production emits unintended `noindex`.
- [ ] Arabic pages canonicalize to English unexpectedly.
- [ ] Sitemap includes preview/private/redirected URLs.
- [ ] Structured data publishes false prices, ratings, certifications, or stock.
- [ ] RFQ/contact/WhatsApp conversions stop working.
- [ ] Performance or rendering regresses materially.

---

## 14. Suggested 90-Day Sequence

### Days 1–14

- [ ] Complete Phase 1 verification controls.
- [ ] Capture analytics/search baseline.
- [ ] Correct sitemap `lastmod`.
- [ ] Server-render and validate JSON-LD.
- [ ] Remove invalid Offer data.
- [ ] Add localized catalog H1/title/description.
- [ ] Approve canonical NAP record.

### Days 15–35

- [ ] Launch one English category cluster.
- [ ] Add crawlable category links and correct breadcrumbs.
- [ ] Enrich the first five product pages.
- [ ] Fix caching/revalidation.
- [ ] Test redirects/canonicals thoroughly.

### Days 36–55

- [ ] Complete human-reviewed Arabic version of the first cluster.
- [ ] Suppress incomplete Arabic product/category pages from sitemap/hreflang/indexing.
- [ ] Launch two priority service pages.
- [ ] Publish one evidence-backed case study or buyer resource.

### Days 56–75

- [ ] Expand only the templates that passed the first-batch gates.
- [ ] Complete Google Business Profile/Bing Places/NAP corrections.
- [ ] Implement IndexNow.
- [ ] Add verified external profiles to entity schema.

### Days 76–90

- [ ] Review indexing and query data.
- [ ] Compare enriched pages with untouched control pages.
- [ ] Review AI citations/grounding queries where available.
- [ ] Optimize hero video and remaining performance bottlenecks.
- [ ] Set the next-quarter page priorities from real Saudi search and conversion data.

---

## 15. Success Metrics

Evaluate progress by business and search outcomes, not page count.

### Leading indicators

- [ ] Valid indexed category and service pages.
- [ ] Non-branded Saudi impressions.
- [ ] Number of queries per enriched landing page.
- [ ] Correct English/Arabic selection in search.
- [ ] Crawl/index coverage without duplicate or alternate-page errors.
- [ ] Product/Breadcrumb structured-data validity.
- [ ] AI citations and cited-page count where measurable.
- [ ] Google Business Profile visibility and actions.

### Business outcomes

- [ ] Organic RFQs.
- [ ] Organic qualified phone calls.
- [ ] Organic WhatsApp enquiries.
- [ ] Organic email enquiries.
- [ ] Enquiry-to-quote rate by landing page.
- [ ] Quote value/revenue influenced by organic search where CRM data permits.

### Quality controls

- [ ] Percentage of indexable Arabic pages with complete human-reviewed translations: target 100%.
- [ ] Percentage of indexable product pages with verified specifications and reviewer: target 100%.
- [ ] Percentage of sitemap URLs with truthful `lastmod`: target 100%.
- [ ] Percentage of priority URLs reachable through crawlable internal links: target 100%.
- [ ] NAP consistency across primary controlled profiles: target 100%.

---

## 16. Final Definition of Done

The first implementation program is complete only when:

- [ ] Every priority commercial intent has one canonical indexable page.
- [ ] Home → category/service → product/detail navigation is crawlable without JavaScript.
- [ ] No empty category is indexable.
- [ ] No incomplete English-fallback page is presented as Arabic.
- [ ] Every published Arabic alternate has reciprocal valid hreflang.
- [ ] Product and service claims have evidence and responsible reviewers.
- [ ] Sitemap dates represent real content changes.
- [ ] Structured data is server-rendered, valid, visible-content-aligned, and non-deceptive.
- [ ] Google/Bing/local business profiles use consistent entity information.
- [ ] Organic RFQ/call/email/WhatsApp conversions are measurable by landing page.
- [ ] Search and AI visibility is reviewed monthly against the saved baseline.

---

## Authoritative References

- [Google: Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: Ecommerce site navigation structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure)
- [Google: Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Google: Localized page versions and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: Local Business Profile ranking guidance](https://support.google.com/business/answer/7091)
- [OpenAI: Publisher and developer search guidance](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
- [Bing: AI Performance in Webmaster Tools](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
- [Bing: Sitemaps in AI-powered search](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search)
- [Perplexity: Crawler guidance](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)

