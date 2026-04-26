# 🔍 GulfRakza Website Audit Report

**Date:** 26 April 2026  
**Audited by:** Cline  
**Scope:** Public-facing Next.js 15 site (Sanity Studio excluded), full-stack covering UI/UX, SEO, performance, accessibility, security, i18n/RTL, content, and DevOps.  
**Production URL:** https://www.gulfrakza.com  
**Stack:** Next.js 15.1.6 · React 19 · Tailwind 3 + shadcn/Radix · Framer Motion · Sanity 4 (CMS) · Nodemailer · custom i18n (EN/AR + RTL)

---

## ✅ Implementation Verification Checklist — STATUS: COMPLETE

**Verified/updated:** 27 April 2026  
**Validation:** `npx tsc --noEmit` returns 0 errors; `npm run build` completes successfully.

The detailed audit below contains original findings for traceability. This checklist is the current implementation status after checking the codebase directly.

### Previously implemented and verified

- [x] Fix homepage offering links to locale-aware `/products?category=...` URLs.
- [x] Make homepage `page.tsx` a Server Component.
- [x] Keep a single SEO-friendly homepage `<h1>` and demote services section heading to `<h2>`.
- [x] Remove hidden `text-transparent` product catalog `<h1>`.
- [x] Centralize phone/email values in `lib/constants.ts`.
- [x] Replace UAE phone copy in the quote modal with the Saudi contact number.
- [x] Move Google fonts to `next/font` and remove render-blocking `@import`.
- [x] Remove old `dist/`/icon build artifacts from the app surface and ignore generated output.
- [x] Disallow `/studio` and `/api` in `robots.ts`.
- [x] Add accessible labels and brand-colored styling for WhatsApp/email FABs.
- [x] Remove dead footer social anchors until real profile URLs exist.
- [x] Add security/cache headers and image AVIF/WebP configuration in `next.config.ts`.
- [x] Add env-driven GTM/GA4/Clarity analytics stubs.
- [x] Replace low-contrast `bg-cyan-600` CTA backgrounds with `bg-cyan-700`.
- [x] Compress `public/logo-rakza.png` and consolidate manifest/icon references.
- [x] Translate the about page `<h1>`/hero alt text through locale messages.
- [x] Harden `/api/contact` with validation, length limits, sanitization, honeypot, safe `replyTo`, and escaped email HTML.
- [x] Remove missing favicon/apple/safari link references.
- [x] Add legacy `/products/:category` redirects.
- [x] Add service detail route, Service schema, and services sitemap coverage.

### Pending items found in this pass, now completed

- [x] Removed the duplicate `I18nProvider` wrapper from `/about-us`; the locale layout provider is now the only provider.
- [x] Made `/services` resilient when Sanity is unavailable by catching service-category fetch failures and falling back to local JSON.
- [x] Made `/services/[slug]` resolve local fallback service slugs, so links rendered from fallback data no longer 404.
- [x] Added local fallback service slugs to `generateStaticParams()` and `sitemap.ts`.
- [x] Normalized `x-default` hreflang targets to language-neutral URLs.
- [x] Simplified organization JSON-LD to `LocalBusiness`, added `priceRange`, and wired phone/email to `lib/constants.ts`.
- [x] Added product `Offer` schema with SAR currency, availability, URL, and sell business function.
- [x] Added missing product catalog sort/filter ARIA wiring (`aria-label`, `aria-expanded`, `aria-controls`).
- [x] Added `/api/contact` per-IP/email rate limiting and time-based bot detection.
- [x] Added form-start timestamps and honeypot payloads to both contact and quote flows.
- [x] Added no-op-safe conversion events for contact submits, quote submits, quote opens, WhatsApp FAB clicks, and email FAB clicks.
- [x] Added an analytics cookie consent gate so GTM/GA/Clarity load only after visitor acceptance.
- [x] Converted Privacy Policy and Terms pages to Server Components with localized metadata.
- [x] Replaced the Terms jurisdiction placeholder with Kingdom of Saudi Arabia copy in EN/AR.

---

## ✅ Day-1 Quick Wins — STATUS: COMPLETE (20/20)

All 20 quick-win action items below have been implemented in this pass. TypeScript compiles cleanly (`npx tsc --noEmit` returns 0 errors).

| # | Action | Status |
|---|---|---|
| 1 | Fix 9 broken homepage offerings links → `/products?category=...` | ✅ |
| 2 | Make homepage `<h1>` SEO-friendly (and demote DarkGrid `<h1>` → `<h2>`) | ✅ |
| 3 | Make homepage `page.tsx` a Server Component | ✅ |
| 4 | Remove `text-transparent` from products `<h1>`; add keyword-rich heading + intro | ✅ |
| 5 | Fix UAE phone `+971 56 123 4567` in QuoteModal → KSA mobile from constants | ✅ |
| 6 | Drop "Liter" font; convert Inter/Raleway/Hanken to `next/font` (no more `@import` blocking) | ✅ |
| 7 | Remove `dist/` (10 MB) + `build-log.txt` from repo, add to `.gitignore` | ✅ |
| 8 | Add `Disallow: /studio` and `Disallow: /api` to `app/robots.ts` | ✅ |
| 9 | Add `aria-label` to WhatsApp + Email FABs; brand colors + correct icon sizing | ✅ |
| 10 | Disable 4 dead-anchor footer social links (E-E-A-T fix) | ✅ |
| 11 | Unify phone numbers + emails into `lib/constants.ts` (`contact` export) — Navbar, GetQuote, FABs, API all consume it | ✅ |
| 12 | Security headers in `next.config.ts`: CSP-Report-Only, Permissions-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS + immutable Cache-Control on `/brands/*` and `/images/*` | ✅ |
| 13 | Google Tag Manager + GA4 stub (env-driven Analytics component, no-op until configured) | ✅ |
| 14 | Microsoft Clarity stub (env-driven, same component) | ✅ |
| 15 | Replace `bg-cyan-600` with `bg-cyan-700` for WCAG AA contrast (8 files patched) | ✅ |
| 16 | Compress `logo-rakza.png` (612 kB → 26 kB) and remove redundant `app/icon.svg` (831 kB) — **1.4 MB / 98% reduction** | ✅ |
| 17 | Translate `<h1>` in `about-client.tsx` (EN + AR + heroAlt) | ✅ |
| 18 | Consolidate `app/manifest.json` + `public/site.webmanifest` into a single canonical manifest | ✅ |
| 19 | Harden `/api/contact`: input validation, length limits, control-char sanitization, honeypot, `replyTo`, env var rename (`EMAIL_PASSWORD`/`EMAIL_USER` with backward compat), HTML escaping in template, "Charlie Varga" footer removed | ✅ |
| 20 | Replace 404'ing `<link>` references (`apple-touch-icon.png`, `favicon-16x16.png`, `safari-pinned-tab.svg`) with assets that actually exist; add `/products/:category` 301 redirect as SEO safety net | ✅ |

**Bonus deliverables:**
- ✨ Created `app/components/Analytics.tsx` (single component for GTM, GA4, Clarity — opt-in via `NEXT_PUBLIC_*` env vars)
- ✨ Added `/products/:category` and `/{locale}/products/:category` 301 redirects in `next.config.ts` so any inbound link / cached Google result for old hierarchical URLs resolves correctly with the category filter
- ✨ Set `images.formats: ['image/avif','image/webp']` in `next.config.ts` so brand PNG logos automatically get served as AVIF/WebP
- ✨ Removed unused `useEffect` Hook from `services-listing-client.tsx` was attempted (deferred — keep diff minimal)
- ✨ The original `dist/` and `icon.svg` are backed up under `.pre-audit-backup/` (gitignored) in case you ever need them

**Net wins:**
- 🚀 Saved roughly **1.4 MB on the favicon/logo path** alone
- 🚀 Eliminated all **render-blocking Google Font `@import`s**
- 🚀 Eliminated the **9 broken homepage links** (huge crawl-equity recovery)
- 🚀 Single canonical h1 per page with **keyword-rich, location-targeted text**
- 🚀 Contact form now **survives bot floods** instead of spamming `info@`
- 🚀 Brand consistency restored: **one phone, one email**
- 🚀 Analytics stack ready to go live: just set `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_CLARITY_ID` in Vercel env

---


---

## 🚨 Executive Summary — Top 15 Critical Issues

| # | Severity | Area | Issue | Impact |
|---|---|---|---|---|
| 1 | 🔴 Critical | SEO / Perf | Homepage `/[locale]/page.tsx` is `"use client"` | Highest-traffic page is unnecessarily client-rooted. Hurts streaming, increases JS, harms CWV/SEO. |
| 2 | 🔴 Critical | SEO | Two `<h1>` on the homepage — Hero h1 + DarkGridHero h1 in the Services section | Google de-prioritizes pages without a single clear topical h1. |
| 3 | 🔴 Critical | SEO | All 4 footer social links are `href="#"` and Schema.org `sameAs` only contains the website itself | Loss of E-E-A-T signals; prevents Knowledge Panel formation. |
| 4 | 🔴 Critical | SEO | 9 dead links from homepage offerings grid — `/products/safety`, `/products/welding`, etc. Routes don't exist (only `/products/[slug]` for products). | Massive crawl-equity bleed from your most-visited page. |
| 5 | 🔴 Critical | SEO | Sitemap omits services subtree, all category-browse URLs, and any future `/services/[slug]`. | Most commercially valuable URLs not surfaced for indexing. |
| 6 | 🔴 Critical | Security | `/api/contact` has zero abuse protection — no rate limit, no captcha, no honeypot, no input length cap | Anyone can spam your `info@gulfrakza.com` inbox; risks Gmail SMTP suspension. |
| 7 | 🔴 Critical | Security / Brand | `emailtemplate.ts` ships "automated message for Charlie Varga" footer | Brand credibility hit on every contact email sent. |
| 8 | 🔴 Critical | Security | `/studio` (Sanity) returns HTTP 200 publicly and isn't disallowed in robots | Internal CMS UI publicly indexable. |
| 9 | 🔴 Critical | Perf | Three Google Fonts via `@import` in `globals.css` — Hanken Grotesk + Raleway + Liter (Liter unused) | Render-blocking; LCP penalty 200–600 ms on mobile 4G. |
| 10 | 🔴 Critical | Perf / UX | Hero section auto-plays a multi-MB MP4 with no poster, no preload, no responsive sources | LCP > 4 s on mobile 4G; #1 reason your site feels slow. |
| 11 | 🔴 Critical | UX / a11y | WhatsApp + Email FABs lack `aria-label` and overlap content on small screens | Conversions lost; fails WCAG 4.1.2. |
| 12 | 🔴 Critical | Brand consistency | 3 different phone numbers, 3 different emails across the site: `+966557197311` (WA), `+966 558 975 494` (footer), `+971 56 123 4567` (Quote modal — wrong country!) and `info@`, `sales@`, `privacy@` | Confuses prospects; hurts local SEO and Google Business Profile NAP consistency. |
| 13 | 🔴 Critical | i18n | `app/manifest.json` hardcoded `"lang":"en","dir":"ltr"` + parallel `public/site.webmanifest` exists | Arabic users get an English PWA manifest; dual sources of truth. |
| 14 | 🔴 Critical | Build | `/dist/` (10 MB old static build) is committed and deployed | Repo bloat; conflicting assets shipped. |
| 15 | 🟠 High | Perf | 30 components are `"use client"` including pure presentational sections | Larger-than-necessary first-load JS bundle. |

---

## 📊 Category Scorecard

| Category | Current | Target |
|---|---|---|
| 🎨 UI / Visual Design | 62 / 100 | 90 |
| 🧭 UX / Conversion | 55 / 100 | 90 |
| 🔍 SEO | 48 / 100 | 90 |
| ⚡ Performance / CWV | 40 / 100 | 85 |
| ♿ Accessibility (WCAG 2.2 AA) | 52 / 100 | 90 |
| 🌐 i18n / Arabic / RTL | 70 / 100 | 90 |
| 🔐 Security | 45 / 100 | 90 |
| 🧱 Code Quality / Architecture | 58 / 100 | 85 |
| 📈 Analytics & Measurement | 5 / 100 (nothing installed) | 90 |
| 📝 Content Quality | 65 / 100 | 85 |

**Overall site grade: 50 / 100 (D+)** — solid foundations (Next 15 App Router, i18n with RTL, Sanity-driven catalog, sensible IA) but the implementation is leaking ranking signals, performance, and conversions.

---

# 1. 🏗️ Architecture & Code Quality

### 🔴 Critical
- `app/(site)/[locale]/page.tsx` declares `"use client"` but only renders six already-client components. Convert to RSC so the rest of the tree can stream HTML.
- 30 files are `"use client"` including pure presentational sections (`OfferingsPage`, the testimonial card, `Footerdemo`, brand logo carousel). Most should be RSC.
- `AboutUsPage` re-wraps children in `<I18nProvider>` even though the locale layout already does. Double provider = wasted work + state-isolation traps.

### 🟠 High
- Dual UI library footprint: `styled-components` is in deps but Tailwind + Radix + shadcn cover everything. Remove if unused (~14 kB gz saved).
- `react-icons` AND `lucide-react` both ship. Pick one.
- `navigation.ts` re-exports `navigation.client.tsx` — every import of `Link/usePathname` pulls in a client module, even from RSCs.
- `useTranslations` hook throws with no fallback if there's no provider, forcing every consuming component to be `"use client"`. Add a server-side `getTranslations(locale)` reading JSON synchronously.
- `i18n/provider.tsx` uses `useEffect` to set `lang/dir` on `<html>` after hydration — but root layout already sets these. Dead code.
- `fetchCatalogData` invoked twice on every product detail page (related products + navbar mega menu).
- `OfferingsPage` reads `Product_Categories.json` but the navbar reads from Sanity — two sources of truth.

### 🟡 Medium
- `messages/*/common.json` "common" wraps everything; pages do `useTranslations("common.nav")` with dotted strings → no type safety.
- `OfferingsPage` typed as `specs?: { [key: string]: any }` with `eslint-disable @typescript-eslint/no-explicit-any` — clean up.
- `tsconfig.json target: ES2017` — bumping to ES2020 saves 2-3 kB of polyfills.
- `build-log.txt` (11 lines) is a truncated build artifact committed to the repo.

### 🟢 Low
- `Services.tsx` renders `<div className="absolute inset-0 bg-cover bg-center" />` with no actual background image set.
- `AboutUsContent` is an empty shell `() => <div />` left in `Navbar.tsx:334-336`.

---

# 2. ⚡ Performance & Core Web Vitals

### 🔴 Critical

| # | Issue | Evidence | Fix |
|---|---|---|---|
| P1 | Hero video LCP killer — autoplays multi-MB MP4 with no `poster`, no responsive sources, no `preload` strategy | `HeroSection.tsx:18-30` | `<video poster=...avif preload="none">` + lazy-replace via IntersectionObserver. 720p WebM for mobile. |
| P2 | Render-blocking Google Fonts via `@import` — Raleway, Hanken Grotesk, Liter (unused) | `app/globals.css:1-2` | Migrate ALL fonts to `next/font/google`. Drop Liter. |
| P3 | No `images.formats: ['image/avif','image/webp']` config; brand PNGs (3M, ABB, Henkel up to 120 kB) re-served as PNG | `next.config.ts` | Add `formats` array + tuned `deviceSizes`/`imageSizes`. |
| P4 | `/public/logo-rakza.png` is 612 kB at 2817×2809 px for 24×24 / 64×64 visual size | `du -sh` | Replace with optimized 256-px PNG (~15 kB) + SVG for navbar. |
| P5 | `app/icon.svg` is 831 kB (rasterized-as-SVG) | `app/icon.svg` | Re-export as clean vector ≤ 4 kB. |
| P6 | 35 brand logos × 3 lane copies = 100+ `<Image>` mounted on first paint | `BrandLogo.tsx` | 2 copies per lane only, `decoding="async"`. Or single sprite SVG. |
| P7 | No `Cache-Control: immutable` on `/images/*` and `/brands/*` | `next.config.ts` (no `headers()` block) | Add `headers()` returning long max-age + immutable. |

### 🟠 High
- `Services.tsx` registers `ResizeObserver` + `requestAnimationFrame` to draw a single decorative gradient line. Use pure CSS.
- `Testimonial.tsx` framer-motion progress bar auto-advances every 5 s and rerenders all 5 cards.
- `BrandLogo.tsx` keeps 3 infinite Framer Motion animations running forever on the home + about pages.
- `Navbar.tsx` `useScroll` + `useMotionValueEvent` fires per scroll frame. Add a guard once threshold reached.
- `fetchCatalogData()` runs on every locale-layout render. Slim down `categoriesQuery` for the menu use-case.
- Product detail page calls `fetchCatalogData()` AND `fetchProductDetail()` for related products. Use `*[_type=="product" && primaryCategory == \$cat][0..7]`.

### 🟡 Medium
- No `priority` attribute on the LCP image of `/about-us`.
- `bg-grid-pattern` in `tailwind.config.ts` is a 30 KB inline data-URL SVG repeated site-wide. Move to a real file.
- No `next/font` CSS variable usage — pages use class strings like `font-inter`. Wire fonts into Tailwind theme.

### 🟢 Low
- Framer Motion is used for trivial fades (mega-menu Logo wrappers) where CSS transitions would be lighter.

---

# 3. 🔍 SEO Audit (deep)

### 🔴 Critical

#### 3.1 Indexability & rendering
- Homepage fully client-rendered ⇒ Hollow first paint until JS executes. Convert top-level pages to RSC.
- Multiple `<h1>` on homepage: Hero h1 + `DarkGridHero` h1.
- Homepage `<h1>` is just a tagline ("Connecting Markets, Empowering Growth") — no keyword. Rewrite to `<h1>Industrial Supplies, PPE & Safety Equipment in Dammam, Saudi Arabia</h1>`.
- About-us `<h1>` hardcoded English — Arabic users see English h1.
- `<h1>All Products</h1>` on `/products` has `text-transparent` (`catalog-client.tsx:333`) — invisible to users AND hidden text to Google = SEO penalty risk.

#### 3.2 Metadata
- Per-page metadata: ✅ on `/about-us`, `/products`, `/products/[slug]`, `/services`. ❌ Missing on `/privacy-policy`, `/terms-of-service`, `/not-found`, `/services/[slug]` (route doesn't exist).
- Same `keywords` meta site-wide.
- `x-default` hreflang points to `/en/products` etc. — best practice is the language-neutral root.
- Twitter and OG images are duplicates (both 92 kB).
- No Bing/Yandex verification.

#### 3.3 Structured Data (JSON-LD)
- `@type: ["Organization","LocalBusiness","Store"]` triple-typing is redundant. Use just `LocalBusiness` and add `priceRange: "\$\$"`.
- `sameAs` only contains its own URL — useless.
- `hasOfferCatalog` is symbolic only (one PPE item, one Scaffolding item).
- Missing on home: `WebSite` schema with `SearchAction`, `BreadcrumbList`, optional `FAQPage`.
- Product schema ✅ exists, but no `offers` block, `availability`, or `aggregateRating`. Add `offers: { availability: "InStock", businessFunction: "Sell", url, priceCurrency: "SAR" }`.
- No `Service` schema on services page or per-service pages.

#### 3.4 URL & internal linking
- 9 broken internal links from homepage offerings: `/products/safety`, `/products/welding`, etc. — should be `/products?category=safety`.
- Service detail pages don't exist.
- All 4 footer social links are `href="#"`.
- Sitemap missing: category-filtered URLs, service detail pages, future blog.
- Robots: `Disallow: /admin/` (which doesn't exist) but allows `/studio` and `/api`. Add both.

#### 3.5 Content / E-E-A-T
- Service descriptions are generic marketing copy. No certifications, completed projects, team bios, client logos with case studies, or ARAMCO/SABIC vendor approvals.
- About page is one paragraph.
- Testimonials are anonymous ("Mohammed A.", "Sara K.").
- Privacy Policy points contact to `privacy@gulfrakza.com` — ensure mailbox exists.

### 🟠 High
- Sitemap priorities: services 0.85 vs products 0.9 — flip them.
- No GA4/GTM/Plausible = no rank tracking, no conversion proof.
- OG image is JPG at 92 kB.

### 🟡 Medium
- `<meta name="theme-color">` `#ffffff` but the navbar is `bg-neutral-950`. Set `#0a0a0a`.
- Middleware always 307s `/` → `/en` — `Accept-Language` parsing for first-time visitors would be SEO-friendlier.

### 🟢 Low
- Legacy `keywords` meta could be removed; harmless.
- Both `/manifest.json` and `/site.webmanifest` reachable. Consolidate.

---

# 4. 🎨 UI / UX / Visual Design

### 🔴 Critical
- Brand identity is undecided. 8 different visual styles in one homepage scroll: video hero → light dashed-border grid → black DarkGrid with cyan beams → white "Why Choose Us" → black CTA strip → white brand carousel → white testimonials → white form.
- "Why Choose Our Services" pillar line is computed from DOM measurements and mis-aligns when fonts arrive late. On longer Arabic text, the line frequently overshoots.
- No clear primary CTA hierarchy. Hero alone has *two* equally weighted CTAs ("Explore our products" + "Contact Us") plus persistent navbar "Get a quote", floating WhatsApp + floating Email, and "Get a Quote" button on the services CTA strip — 5 CTAs visible above the fold on mobile.
- FABs (WhatsApp + Email) are glassy white circles with black icons — invisible against the white contact form section. Use filled brand color.
- `MailEnquiry`'s 50 px envelope icon overflows its 64 px button because of `border-4 + px-4 py-2`.

### 🟠 High
- Mismatched border-radius scale ranging from `rounded-md` to `rounded-2xl` to `rounded-[28px]` (mega-menu) to `rounded-[24px]` (Quote modal). Establish 3 tokens.
- Mismatched shadow language from `shadow-sm` to `shadow-2xl` to `shadow-[0_25px_70px_rgba(0,0,0,0.5)]`.
- Font soup: Inter (body), Raleway (some descriptions), Hanken Grotesk ("Why Choose Us" only), Liter (loaded but unused). Pick TWO typefaces.
- Hero overlay is flat `rgba(0,0,0,0.5)` — looks dated. Use `from-black/70 via-black/40 to-black/10`.
- Offerings cards use `border-dashed` — looks like wireframe placeholders.
- `uppercase` only on English offering card titles introduces locale inconsistency.
- Services cards' `GridPatternCard` at `bg-[length:30px_30px]` overpowers thin content.
- Testimonials cards stack with hard-coded scale offsets creating visible stair-step jitter. 5 s auto-advance is too fast (industry standard 7-10 s). No pause-on-hover.
- Quote modal is huge (`max-w-4xl`) with a left form column + dark right info panel. On Arabic the right info-panel `bg-gradient-to-b` doesn't account for RTL.
- Modal close button low contrast over the dark info-panel side.
- No empty-state imagery for "no products found".
- Footer 4th column ("Follow Us") is mostly empty.

### 🟡 Medium
- Cyan brand color `bg-cyan-600` (#0891b2) on white text scores 3.2:1 WCAG contrast — fails AA. Use `cyan-700` (#0e7490, 4.6:1).
- No sticky add-to-quote on long product pages.
- No image gallery zoom/lightbox on product pages.
- No skeleton loaders during Sanity image fetches.

### 🟢 Low
- "GULF**RAKZA**" wordmark kerning between `font-extralight` and `font-semibold` is uneven on small sizes.
- `InteractiveHoverButton` text container is fixed `w-64` — Arabic translations get clipped.

---

# 5. ♿ Accessibility (WCAG 2.2 AA)

### 🔴 Critical
- No skip-to-content link.
- `role="banner"` on a `<section>` in the hero is invalid (banner is for `<header>`).
- WhatsApp + Email FABs have NO `aria-label`.
- "Get a quote" navbar button has no `aria-haspopup="dialog"`.
- Mega-menu opens on `mouseEnter` only — keyboard inaccessible.
- Brand carousel `alt` text is the filename (e.g. `alt="Mitsubishi_Electric_logo.svg.avif"`) — should be brand names or empty for decorative.
- Testimonial selector has `aria-label="Testimonial 1"` ✅ but no `aria-current` on active card and no `aria-live="polite"` on the carousel region.

### 🟠 High
- Color contrast failures:
  - `text-foreground/60` on services cards: ~2.8:1 — fail
  - `text-slate-500` on white for testimonial subtitles: ~3.7:1 — fail
  - `text-white/70` in Quote modal info panel: ~3.4:1 — fail
  - `bg-cyan-600` button white text: ~3.2:1 — fail
- No focus-visible styles on most custom buttons (FABs, mobile menu trigger, testimonial dots).
- Form errors have no `aria-describedby` linking inputs to their error text.
- Mobile drawer X button has no `aria-label`.
- `prefers-reduced-motion` ignored everywhere — infinite brand carousel + testimonial autoplay + DarkGrid beams + interactive hover + 404-page gear spinners all run regardless.

### 🟡 Medium
- Sort `<select>` on /products has no `<label>` (uses neither `<label>` nor explicit `aria-label`).
- Breadcrumb shadcn ✅ correct ARIA.
- Catalog `Checkbox` shadcn ✅ correct ARIA.
- Testimonial autoplay has no pause-on-focus/hover (WCAG 2.2.2).
- Mobile menu opens but focus is not trapped — Tab can escape.

### 🟢 Low
- `sr-only` is used in a few places ✅.
- Testimonial / product cards use `<div>` instead of `<article>`.

---

# 6. 📱 Responsive & Cross-device

### 🟠 High
- FABs cover the contact submit button on iPhone SE (375 px).
- Quote modal exceeds viewport height on mobile because the right info-panel renders above the form on small screens; nested `overflow-y-auto` causes nested scrollbars.
- Hero `<h1>` `text-4xl md:text-5xl` is too large at 320 px — needs `text-3xl sm:text-4xl md:text-5xl`.
- Service category sticky sidebar `top-32` doesn't follow the navbar's shrink from `py-6` → `py-3`, creating a jump.
- Catalog category tree `max-h-[360px]` clips deep trees on mobile drawers.
- Testimonial selector bars are 6 px tall — fails WCAG 2.5.5 (44×44 px target).

### 🟡 Medium
- Spec tables stack vertically on mobile ✅. RTL alignment ✅. No horizontal scroll fallback.
- `LocaleSwitcher` mobile variant `max-w-[180px]` truncates Arabic labels.

### 🟢 Low
- iPad portrait (768×1024) gets the mobile layout because sidebar disappears at `lg:` (1024 px). Consider `md:` switch.

---

# 7. 🌐 Internationalization & Arabic / RTL

### 🔴 Critical
- `app/manifest.json` `lang/dir` hardcoded English/LTR.
- Brand carousel forces `dir="ltr"` on its `<section>` — necessary for animation math but creates a direction-flip discontinuity in RTL pages.
- Multiple gradients (`bg-gradient-to-r`) don't flip in RTL: hero overlay, Quote-modal info panel.
- About-us `<h1>` hardcoded English — Arabic users see English.
- Phone formatting in Arabic footer mixes Eastern-Arabic indic digits and Western digits, plus inconsistent LRM marks.

### 🟠 High
- No `services/[slug]` page in either locale.
- Locale switcher uses Arabic letter `ع` for Arabic — culturally OK, but `EN/ع` looks asymmetric.
- Hero animated text is split into 4 spans for English typographic weight pattern (light-bold-light-bold). Arabic can't replicate the rhythm.
- `OfferingsPage` conditionally `uppercase` only for English — no other page is locale-case-aware.
- No explicit `lang="..."` on injected content of a different language (numbers, brand-name fragments).

### 🟡 Medium
- Numbers/dates not formatted via `Intl.NumberFormat("ar-SA")`.
- Arabic copy uses straight quotes `"` where Arabic punctuation `« »` would be more natural.
- ARIA labels in locale switcher are translated ✅.

---

# 8. 🔐 Security

### 🔴 Critical
- `/api/contact` has zero abuse protection. No rate limit, no captcha, no honeypot, no CSRF. Attacker can spam at 1000 req/sec; `from: email` echoes user input.
- Env var named `process.env.PASSWORD` holds the Gmail App Password. Convention is `EMAIL_PASSWORD` or `SMTP_PASS`.
- `.env` is in your Cursor open tabs — confirm it's not committed (`git ls-files | grep ^\.env`). If it is, rotate the password NOW.
- No security headers configured — missing CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options. (Vercel adds HSTS automatically.)
- `/studio` (Sanity) is on the same origin and indexable.

### 🟠 High
- Email subject is templated from raw user input — sanitize: `subject.replace(/[\r\n]/g, '')`.
- No body-size / field-length limits on the API.
- External links from PortableText only get `rel="noopener noreferrer"` when `openInNewTab` is true. Always include `noopener` for external links.
- No dependency vulnerability scan in CI.

### 🟡 Medium
- `console.error(error)` only — consider Sentry.
- `dangerouslySetInnerHTML` is unused (good).
- Sanity public reads are tokenless ✅.

### 🟢 Low
- `transporter.sendMail` blocks the request — switch to a queue (QStash, Vercel Cron).

---

# 9. 🧪 Forms & Conversion

### 🔴 Critical
- Contact form has 3 fields; Quote form has 5+ fields. Two parallel lead flows. Pick a canonical one.
- `+971 56 123 4567` is hardcoded as the Quote modal "Call us" CTA (`GetQuote.tsx:553`) — that's a UAE number; your business is Saudi Arabia.
- No success page redirect or `gtag('event','lead')` firing — conversion can never be measured.

### 🟠 High
- No autoresponder to the user.
- Phone field is `type="tel"` ✅ but no client-side format validation. Add a country code dropdown defaulting to KSA.
- No PDPL/GDPR consent checkbox above submit (KSA PDPL is in force since Sept 2023).
- All hardcoded phones/emails should live in `lib/constants.ts`.

### 🟡 Medium
- Success message slides in from `x: -2000` — visibly late on slow devices. Use a fade.
- After success, no obvious "send another" affordance.
- Service-required validation message is `text-amber-600` and never animates in.

---

# 10. 📊 Analytics & Tracking

### 🔴 Critical
- Nothing is installed. No GA4, no GTM, no Plausible, no Vercel Analytics, no Microsoft Clarity, no Hotjar, no Sentry, no PostHog. **You cannot diagnose low Google rankings without measurement.**

### 🟠 High
- No GSC monitoring cadence beyond the verification meta.
- No Bing Webmaster.
- No event tracking on hero CTA clicks, "Get a quote" opens, WhatsApp/Email FAB clicks, form submissions, product views, language switches.
- No cookie consent banner.

### 🟡 Medium
- No UTM tagging strategy for offline materials (GBP posts, brochure QRs).

### Minimum recommended stack
1. **Google Tag Manager** (free, single script tag).
2. **GA4** via GTM.
3. **Microsoft Clarity** (free heatmaps + session replays).
4. **Vercel Analytics** (already free with hosting).
5. **Sentry** (free tier).
6. **Cookie banner** (cookieyes or self-built).

---

# 11. 🧰 DevOps / Build

### 🔴 Critical
- `/dist/` (10 MB) committed to repo. Looks like a leftover from a different build system. Delete after confirming nothing references it.
- Three icons in repo: `app/favicon.ico`, `app/icon.svg` (831 kB!), `app/icon.png`, `app/apple-icon.png`. Plus `public/favicon-32x32.png`, `public/web-app-manifest-*.png`. Missing on disk but referenced in `<link>` tags: `apple-touch-icon.png`, `favicon-16x16.png`, `safari-pinned-tab.svg` — confirmed 404 via curl.

### 🟠 High
- `build-log.txt` (truncated 11-line build artifact) committed.
- `Services Website.xlsx` and `sanity.cli.js` (`.js`, not `.ts`) committed.
- No CI/CD config. Vercel does build-on-push but no test gate.
- No tests at all.

### 🟡 Medium
- `package.json` doesn't pin Node engine. Add `"engines": { "node": ">=18.18" }`.
- README likely needs updates.

### 🟢 Low
- `pnpm studio` script default port 3333 — document.

---

# 12. 📝 Content Quality

### 🟠 High
- Service descriptions are 1 line each. Generic marketing fluff. Each service should be 600-1200 words.
- No blog or resources section.
- Testimonials are unverifiable.
- About page is one paragraph.
- No projects / case studies.
- Privacy Policy mentions `privacy@gulfrakza.com` while contact info uses `info@` and `sales@`.

### 🟡 Medium
- `Terms of Service` references `[Your Jurisdiction]` placeholder.
- Many product/category descriptions in Sanity look auto-generated/duplicated.
- Empty product categories ("Workwear" `productCount: 0`).

---

# 13. 🔗 Links & Navigation Integrity

### 🔴 Critical
- 9 dead homepage offerings links.
- 4 dead anchors in footer social icons.
- `/services/[slug]` directory exists but no `page.tsx`.
- `href="#contact-us"` from the home hero "Contact Us" button works only on `/`.

### 🟠 High
- 301 redirects in `next.config.ts` for old hierarchical URLs ✅.

---

# 14. 📦 Image Audit Summary

| Asset | Size | Type | Recommendation |
|---|---|---|---|
| `public/logo-rakza.png` | 612 kB | PNG 2817×2809 | Replace with SVG (~5 kB) + 256-px PNG fallback |
| `app/icon.svg` | 831 kB | SVG (rasterized?) | Re-export as clean vector (~3 kB) |
| `public/og-image.jpg` | 92 kB | JPG | OK; could be WebP at ~60 kB |
| `public/twitter-og-image.jpg` | 92 kB | JPG | Likely identical to og-image |
| `public/images/services/cathodic.jpeg` | 131 kB | JPEG | Convert to AVIF (~30 kB) |
| `public/images/services/hvac.jpeg` | 319 kB | JPEG | Convert to AVIF (~70 kB) |
| `public/images/services/mechanical.jpeg` | 329 kB | JPEG | Convert to AVIF (~75 kB) |
| `public/images/services/thumb-9.avif` | 355 kB | AVIF | Re-encode at q60 |
| `public/images/services/thumb-10.avif` | 471 kB | AVIF | Resize to 800w |
| `public/brands/Henkel-Logo.png` | 120 kB | PNG | ≤ 30 kB AVIF |
| `public/brands/3M-logo.png` | 108 kB | PNG | ≤ 25 kB |
| `public/brands/powerliftlogo.png` | 96 kB | PNG | ≤ 25 kB |
| `public/brands/Lalizas_logo.png` | 92 kB | PNG | ≤ 25 kB |
| `public/images/categories/industrial_electric.png` | **0 bytes!** | broken | Remove or replace |
| Total `/images` + `/brands` | 5.4 MB | mixed | Target < 1.5 MB |

---

# 🚀 Quick-Win Action Plan (≤ 30 min each, ranked by impact)

1. Fix the 9 broken offerings links — change `/products/safety` to `/products?category=safety` in `Product_Categories.json`. (15 min)
2. Make the homepage `<h1>` SEO-friendly — `<h1>Industrial Supplies, PPE & Safety Equipment in Dammam</h1>`. (15 min)
3. Make the homepage `page.tsx` a Server Component — remove `"use client"`. (5 min)
4. Remove `text-transparent` from the products `<h1>`. (1 min)
5. Fix the UAE phone `+971 56 123 4567` in QuoteModal to your Saudi number. (2 min)
6. Drop "Liter" font and convert all 3 Google Fonts to `next/font`. (20 min)
7. Remove `dist/` from the repo and `.gitignore` it. (5 min)
8. Add `Disallow: /studio` and `Disallow: /api` to `app/robots.ts`. (1 min)
9. Add `aria-label` to WhatsApp + Email FABs. (2 min)
10. Fix all 4 footer social links — remove or `rel="nofollow"` to real social profiles. (10 min)
11. Unify phone numbers and emails in `lib/constants.ts`. (15 min)
12. Add `next.config.ts` `headers()` for CSP (`report-only`), Permissions-Policy, X-Content-Type-Options, Referrer-Policy. (25 min)
13. Add Google Tag Manager + GA4 stub. (15 min)
14. Add Microsoft Clarity for free session replays. (5 min)
15. Replace `bg-cyan-600` CTAs with `bg-cyan-700` for WCAG contrast. (5 min)
16. Compress `logo-rakza.png` and `icon.svg`. (10 min)
17. Translate `<h1>` in `about-client.tsx`. (5 min)
18. Fix `app/manifest.json` — locale-aware or consolidate to `site.webmanifest` only. (15 min)
19. Sanitize `subject` in API route — `.replace(/[\r\n]/g, '')`. (1 min)
20. Add the missing icons (`apple-touch-icon.png`, `favicon-16x16.png`, `safari-pinned-tab.svg`) or remove their `<link>` references. (10 min)

---

# 🛠️ Strategic Improvements (multi-day, ranked by ROI)

### Tier 1 — must do this quarter
1. Add real per-service detail pages with 800+ words, project case studies, FAQs, certifications, `Service` schema. **Biggest SEO ranking lever.**
2. Re-architect to RSC-first. Convert Home, Footer, Offerings, Services to server components. Reduce JS bundle 40-60%.
3. Hero LCP rebuild — replace autoplay video with poster AVIF + lazy-load video on intersect; mobile WebM. Target LCP < 2.5 s on 4G.
4. Install full analytics stack and set up a weekly review cadence.
5. Image overhaul — re-encode all images as AVIF/WebP with proper `sizes/srcset`, drop hero images > 200 kB.
6. Add proper rate limiting + bot protection on `/api/contact` (Vercel Edge Middleware + Upstash Ratelimit + invisible hCaptcha). Implement autoresponder.
7. Spam-protect contact + quote forms with honeypot field + time-based bot detection + rate limit (3/min/IP).
8. Fix Arabic experience completely — verify RTL on every page, translate hardcoded strings, consider Arabic-only typography (Tajawal, Cairo, IBM Plex Sans Arabic).

### Tier 2 — next 1-2 quarters
9. Build a blog/resources section in Sanity (industrial buying guides, regulation explainers, certification overviews). 2 articles/week.
10. Add real testimonials with company logo, name, role, LinkedIn, optionally video.
11. Add a projects/case-studies module in Sanity with industry tags, photo galleries, schema.org `CreativeWork`.
12. Programmatic SEO for products — unique copy, real specs, downloadable datasheets, "Brands we carry" page per brand with `Brand` schema.
13. Mobile-first design system overhaul — pick 2 fonts, 3 radii, 3 elevations, 5-step color scale.
14. Cookie consent + KSA PDPL compliance — banner, document data flows, DPA contact email.

### Tier 3 — nice-to-haves
15. PWA install banner + offline fallback page.
16. Algolia or Sanity Search for products.
17. Customer login for repeat-buyer quote history.
18. Multi-currency display (SAR / USD / AED).
19. A/B testing with Vercel Edge Config.

---

# 📁 File-by-file evidence index

| File | Severity | Issue summary |
|---|---|---|
| `app/(site)/[locale]/page.tsx:1` | 🔴 | `"use client"` on the homepage |
| `app/components/Home/HeroSection.tsx:14` | 🔴 | `role="banner"` on `<section>` (invalid) |
| `app/components/Home/HeroSection.tsx:17-30` | 🔴 | LCP-heavy autoplay video, no `poster` |
| `app/components/Home/HeroSection.tsx:41` | 🟠 | `<h1>` is just tagline — no SEO keywords |
| `app/components/Home/DarkGrid.tsx:39` | 🔴 | Second `<h1>` rendered on home (services hero) |
| `app/components/Home/OfferingsPage.tsx:77` | 🔴 | Links to `/products/safety` etc. that don't exist |
| `app/components/Home/BrandLogo.tsx:9` | 🟠 | Hardcoded `dir="ltr"`; alt text is filename |
| `app/components/Home/Testimonial.tsx:79` | 🟠 | 5-second auto-advance with no pause-on-hover |
| `app/components/MailEnquiry.tsx:24` / `WhatsappEnquiry.tsx:18` | 🔴 | FABs missing `aria-label` |
| `app/components/Navbar.tsx:275-277` | 🟠 | Mega-menu opens on `mouseEnter` only |
| `app/components/Navbar.tsx:740-743` | 🟠 | Phone/email constants hardcoded |
| `app/components/GetQuote.tsx:544-557` | 🔴 | UAE phone `+971 56 123 4567` |
| `app/api/contact/route.ts:6-34` | 🔴 | No rate limit, no captcha, env var named `PASSWORD` |
| `app/api/contact/emailtemplate.ts:144` | 🔴 | "automated message for Charlie Varga" |
| `app/(site)/[locale]/layout.tsx:96-98` | 🟠 | References missing `apple-touch-icon.png`, `safari-pinned-tab.svg` |
| `app/(site)/[locale]/layout.tsx:55-56` | 🟡 | `x-default` hreflang set to localized URL |
| `app/(site)/[locale]/about-us/about-client.tsx:23` | 🟠 | Hardcoded English `<h1>` |
| `app/(site)/[locale]/products/catalog-client.tsx:333` | 🔴 | `text-transparent` on `<h1>All Products</h1>` |
| `app/manifest.json:37-38` | 🔴 | `lang/dir` hardcoded English/LTR |
| `app/globals.css:1-2` | 🔴 | `@import` 3 Google Fonts (one unused) |
| `app/sitemap.ts:75-89` | 🟠 | Missing services, category-filter URLs, future blog |
| `app/robots.ts:8-9` | 🟠 | Missing `/studio`, `/api` disallows |
| `next.config.ts` (no `headers()`) | 🔴 | No security headers configured |
| `tailwind.config.ts:60-61` | 🟡 | Inline 30 kB SVG patterns |
| `i18n/provider.tsx:25-36` | 🟡 | `useEffect` setting lang/dir is dead code |
| `lib/catalog/index.ts:497-509` | 🟠 | Catalog refetched per layout render |
| `package.json:39` | 🟡 | `styled-components` likely unused |
| `public/logo-rakza.png` | 🔴 | 612 kB at 2817×2809 |
| `app/icon.svg` | 🔴 | 831 kB SVG |
| `public/images/categories/industrial_electric.png` | 🟠 | 0 bytes (broken image) |
| `dist/*` | 🟠 | 10 MB old build artifact committed |
| `Services Website.xlsx` | 🟢 | Spreadsheet committed in repo root |

---

# 🎯 Recommended order of operations

1. **Day 1 (quick wins):** items 1-20 from the Quick-Win Action Plan. ~6 hours of focused work; expected impact: measurable Core Web Vitals improvement, immediate SEO sanity restored, contact-form spam protection, zero broken links.
2. **Week 1-2:** Tier 1 items 1-5 (service detail pages, RSC refactor, hero LCP, analytics, image overhaul).
3. **Week 3-4:** Tier 1 items 6-8 (security hardening, Arabic polish).
4. **Month 2-3:** Tier 2 (blog, testimonials, case studies, design system).
5. **Quarterly review:** re-run this audit using Lighthouse CI + a manual pass.

---

**End of audit.** This document is intended as a single source of truth — feel free to convert each row into a Linear/Jira ticket and assign owners. If you'd like, the next step is to implement the Day-1 quick wins in order and re-test, or focus on a specific section first (e.g. all SEO fixes).
