import { PortableText, type PortableTextComponents } from "@portabletext/react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config"
import { contact, siteUrl } from "@/lib/constants"
import { fetchServiceCategories, fetchServiceDetail } from "@/lib/services-sanity"
import type { ServiceDetail } from "@/lib/services-sanity"
import { getAllServiceSlugs, getServiceBySlug } from "@/lib/services"
import { serializeJsonLd } from "@/lib/seo/json-ld"

type ServicePageProps = { params: Promise<{ locale: string; slug: string }> }

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-10 text-2xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold">{children}</h3>,
    normal: ({ children }) => <p className="mt-4 leading-8 text-slate-700">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc space-y-2 ps-6 text-slate-700">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 ps-6 text-slate-700">{children}</ol>,
  },
}

const getService = async (slug: string, locale: Locale): Promise<ServiceDetail | null> => {
  try {
    const sanityService = await fetchServiceDetail(slug, locale)
    if (sanityService) return sanityService
  } catch {
    // Use the version-controlled bilingual catalog if authenticated Sanity reads are unavailable.
  }

  const localService = getServiceBySlug(slug, locale)
  if (!localService) return null
  return {
    id: localService.id,
    slug: localService.id,
    title: localService.title,
    description: localService.description,
    imageSrc: localService.imageSrc,
    body: [],
    hasArabicTitle: true,
    hasArabicDescription: true,
    isArabicIndexable: true,
    category: localService.category
      ? { id: localService.category, slug: "", title: localService.category }
      : undefined,
  }
}

export async function generateStaticParams() {
  try {
    const categories = await fetchServiceCategories("en")
    const slugs = Array.from(new Set(categories.flatMap((category) => category.services.map((service) => service.slug))))
    const allSlugs = Array.from(new Set([...slugs, ...getAllServiceSlugs()]))
    return locales.flatMap((locale) => allSlugs.map((slug) => ({ locale, slug })))
  } catch {
    return locales.flatMap((locale) => getAllServiceSlugs().map((slug) => ({ locale, slug })))
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale
  const service = await getService(slug, activeLocale)
  if (!service) return { title: "Service not found | GulfRakza" }

  const title = service.seoTitle || (activeLocale === "ar" ? `${service.title} | جلف ركزة` : `${service.title} in Saudi Arabia | GulfRakza`)
  const baseDescription = service.seoDescription || service.description
  const description = baseDescription.length >= 110
    ? baseDescription
    : activeLocale === "ar"
      ? `${baseDescription} تقدم جلف ركزة الدعم الفني وعروض الخدمات للمشاريع الصناعية في الدمام والمملكة العربية السعودية.`
      : `${baseDescription} GulfRakza provides technical scoping and proposals for industrial projects in Dammam and across Saudi Arabia.`
  const canonical = `${siteUrl}/${activeLocale}/services/${slug}`

  return {
    title,
    description,
    robots: activeLocale === "ar" && !service.isArabicIndexable
      ? { index: false, follow: true }
      : undefined,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/services/${slug}`,
        ar: `${siteUrl}/ar/services/${slug}`,
        "x-default": `${siteUrl}/en/services/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: activeLocale === "ar" ? "ar_SA" : "en_US",
      images: service.imageSrc ? [{ url: service.imageSrc }] : [{ url: `${siteUrl}/og-image.jpg` }],
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { locale, slug } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale
  const service = await getService(slug, activeLocale)
  if (!service) notFound()

  const serviceUrl = `${siteUrl}/${activeLocale}/services/${slug}`
  const absoluteImage = service.imageSrc
    ? service.imageSrc.startsWith("http") ? service.imageSrc : `${siteUrl}${service.imageSrc.startsWith("/") ? "" : "/"}${service.imageSrc}`
    : undefined
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: serviceUrl,
    image: absoluteImage,
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
    provider: {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#organization`,
      name: "GulfRakza",
      url: siteUrl,
      telephone: contact.phoneMobileE164,
      address: { "@type": "PostalAddress", addressLocality: "Dammam", addressCountry: "SA" },
    },
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: activeLocale === "ar" ? "الرئيسية" : "Home", item: `${siteUrl}/${activeLocale}` },
      { "@type": "ListItem", position: 2, name: activeLocale === "ar" ? "الخدمات" : "Services", item: `${siteUrl}/${activeLocale}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: serviceUrl },
    ],
  }

  return (
    <article className="bg-white text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
          <Link href={`/${activeLocale}`} className="hover:underline">{activeLocale === "ar" ? "الرئيسية" : "Home"}</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href={`/${activeLocale}/services`} className="hover:underline">{activeLocale === "ar" ? "الخدمات" : "Services"}</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span aria-current="page">{service.title}</span>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            {service.category && <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">{service.category.title}</p>}
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{service.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-700">{service.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${contact.emailSales}?subject=${encodeURIComponent(`Service enquiry: ${service.title}`)}`} className="rounded-full bg-cyan-800 px-6 py-3 font-semibold text-white hover:bg-cyan-900">
                {activeLocale === "ar" ? "اطلب عرضًا" : "Request a proposal"}
              </a>
              <a href={`tel:${contact.phoneMobileE164}`} className="rounded-full border border-slate-300 px-6 py-3 font-semibold hover:border-cyan-800 hover:text-cyan-800">
                {activeLocale === "ar" ? "اتصل بنا" : "Call our team"}
              </a>
            </div>
          </div>
          {service.imageSrc && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
              <Image src={service.imageSrc} alt={service.title} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            </div>
          )}
        </div>

        <div className="mt-14 max-w-3xl border-t border-slate-200 pt-10">
          {service.body.length > 0 ? (
            <PortableText value={service.body} components={portableTextComponents} />
          ) : (
            <>
              <h2 className="text-2xl font-bold">{activeLocale === "ar" ? "نطاق الخدمة" : "Service scope"}</h2>
              <p className="mt-4 leading-8 text-slate-700">{service.description}</p>
              <p className="mt-4 leading-8 text-slate-700">
                {activeLocale === "ar"
                  ? "يتولى فريق جلف ركزة مراجعة متطلبات الموقع والنطاق والجدول الزمني قبل تقديم العرض الفني والتجاري."
                  : "GulfRakza reviews the site requirements, scope, and schedule before issuing a technical and commercial proposal."}
              </p>
            </>
          )}
          {(service.reviewedBy || service.lastReviewedAt) && (
            <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              {service.reviewedBy && <span>{activeLocale === "ar" ? "راجعه فنيًا: " : "Technically reviewed by: "}<strong>{service.reviewedBy}</strong></span>}
              {service.reviewedBy && service.lastReviewedAt && <span aria-hidden="true"> · </span>}
              {service.lastReviewedAt && <time dateTime={service.lastReviewedAt}>{activeLocale === "ar" ? "آخر مراجعة: " : "Last reviewed: "}{new Intl.DateTimeFormat(activeLocale === "ar" ? "ar-SA" : "en-SA", { dateStyle: "medium" }).format(new Date(service.lastReviewedAt))}</time>}
            </div>
          )}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
    </article>
  )
}
