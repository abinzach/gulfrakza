import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config"
import { getCategories as getLocalCategories } from "@/lib/services"
import { fetchServiceCategories, type ServiceCategory } from "@/lib/services-sanity"
import { siteUrl } from "@/lib/constants"
import { serializeJsonLd } from "@/lib/seo/json-ld"

type ServiceCategoryPageProps = { params: Promise<{ locale: string; slug: string }> }

const getCategories = async (locale: Locale): Promise<ServiceCategory[]> => {
  try {
    const categories = await fetchServiceCategories(locale)
    if (categories.length > 0) return categories
  } catch {
    // Fall through to the version-controlled bilingual service catalog.
  }
  return getLocalCategories(locale).map((category) => ({
    id: category.id,
    slug: category.id,
    title: category.title,
    description: category.description,
    imageSrc: category.imageSrc,
    hasArabicTitle: true,
    hasArabicDescription: true,
    isArabicIndexable: true,
    services: category.services.map((service) => ({
      id: service.id,
      slug: service.id,
      title: service.title,
      description: service.description,
      imageSrc: service.imageSrc,
      hasArabicTitle: true,
      hasArabicDescription: true,
      isArabicIndexable: true,
    })),
  }))
}

export async function generateStaticParams() {
  const categories = await getCategories("en")
  return locales.flatMap((locale) => categories.map((category) => ({ locale, slug: category.slug })))
}

export async function generateMetadata({ params }: ServiceCategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale
  const category = (await getCategories(activeLocale)).find((item) => item.slug === slug)
  if (!category) notFound()
  const canonical = `${siteUrl}/${activeLocale}/services/category/${slug}`
  const title = activeLocale === "ar" ? `${category.title} | جلف ركزة` : `${category.title} in Saudi Arabia | GulfRakza`
  const description = category.description.length >= 110
    ? category.description
    : `${category.description} ${activeLocale === "ar" ? "خدمات صناعية للمشاريع والمنشآت في الدمام والمملكة العربية السعودية." : "Industrial project support for facilities in Dammam and across Saudi Arabia."}`
  const languages: Record<string, string> = {
    en: `${siteUrl}/en/services/category/${slug}`,
    "x-default": `${siteUrl}/en/services/category/${slug}`,
  }
  if (category.isArabicIndexable) languages.ar = `${siteUrl}/ar/services/category/${slug}`

  return {
    title,
    description,
    robots: activeLocale === "ar" && !category.isArabicIndexable ? { index: false, follow: true } : undefined,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, type: "website", images: [{ url: category.imageSrc || `${siteUrl}/og-image.jpg` }] },
  }
}

export default async function ServiceCategoryPage({ params }: ServiceCategoryPageProps) {
  const { locale, slug } = await params
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale
  const category = (await getCategories(activeLocale)).find((item) => item.slug === slug)
  if (!category) notFound()

  const pageUrl = `${siteUrl}/${activeLocale}/services/category/${slug}`
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: category.services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.title,
        url: `${siteUrl}/${activeLocale}/services/${service.slug}`,
      })),
    },
  }

  return (
    <div className="bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
            <Link href={`/${activeLocale}`} className="hover:underline">{activeLocale === "ar" ? "الرئيسية" : "Home"}</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href={`/${activeLocale}/services`} className="hover:underline">{activeLocale === "ar" ? "الخدمات" : "Services"}</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page">{category.title}</span>
          </nav>
          <h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-5xl">{category.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{category.description}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">{activeLocale === "ar" ? "الخدمات المتاحة" : "Available services"}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((service) => (
            <article key={service.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {service.imageSrc && <div className="relative aspect-[16/9]"><Image src={service.imageSrc} alt={service.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /></div>}
              <div className="p-5">
                <h3 className="text-lg font-semibold"><Link href={`/${activeLocale}/services/${service.slug}`} className="hover:text-cyan-800 hover:underline">{service.title}</Link></h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    </div>
  )
}
