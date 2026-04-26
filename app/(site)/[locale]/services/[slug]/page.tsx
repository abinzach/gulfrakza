import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

import type { Locale } from "@/i18n/config";
import { isLocale, locales } from "@/i18n/config";
import {
  fetchServiceBySlug,
  fetchServiceSlugs,
  type ServiceDetail,
} from "@/lib/services-sanity";
import {
  getAllServiceSlugs as getLocalServiceSlugs,
  getCategories as getLocalServiceCategories,
  getServiceBySlug as getLocalServiceBySlug,
} from "@/lib/services";
import { siteUrl } from "@/lib/constants";

type PageParams = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  // Generate params across all locales so pages can be statically optimized.
  // Local JSON slugs are always included so fallback services do not become 404s
  // when Sanity is unreachable during build.
  let slugs = getLocalServiceSlugs();
  try {
    slugs = Array.from(new Set([...slugs, ...(await fetchServiceSlugs())]));
  } catch {
    // keep local slugs
  }
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

async function fetchServiceDetail(locale: Locale, slug: string): Promise<ServiceDetail | null> {
  try {
    const sanityService = await fetchServiceBySlug(locale, slug);
    if (sanityService) {
      return sanityService;
    }
  } catch {
    // ignore and fall back to local JSON
  }

  const localLocale = locale === "ar" ? "ar" : "en";
  const localService = getLocalServiceBySlug(slug, localLocale);
  if (!localService) {
    return null;
  }

  const localCategory = getLocalServiceCategories(localLocale).find((category) =>
    category.services.some((service) => service.id === slug),
  );

  return {
    id: localService.id,
    slug: localService.id,
    title: localService.title,
    description: localService.description,
    imageSrc: localService.imageSrc,
    category: localCategory
      ? {
          id: localCategory.id,
          slug: localCategory.id,
          title: localCategory.title,
          description: localCategory.description,
          imageSrc: localCategory.imageSrc,
        }
      : undefined,
  };
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : "en";

  const service = await fetchServiceDetail(activeLocale, slug);
  if (!service) {
    return { title: "Service not found | GulfRakza" };
  }

  const title = service.seoTitle || `${service.title} | GulfRakza Services`;
  const description = service.seoDescription || service.description;
  const canonicalPath = `/${activeLocale}/services/${service.slug}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  const languageAlternates = locales.reduce<Record<string, string>>((acc, loc) => {
    acc[loc] = `${siteUrl}/${loc}/services/${service.slug}`;
    return acc;
  }, {});
  languageAlternates["x-default"] = `${siteUrl}/services/${service.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: service.imageSrc
        ? [{ url: service.imageSrc, width: 1200, height: 630, alt: service.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: service.imageSrc ? [service.imageSrc] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageParams) {
  const { locale, slug } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : "en";

  const service = await fetchServiceDetail(activeLocale, slug);
  if (!service) {
    notFound();
  }

  const canonicalPath = `/${activeLocale}/services/${service.slug}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: canonicalUrl,
    provider: {
      "@type": "LocalBusiness",
      name: "GulfRakza",
      url: siteUrl,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Eastern Province",
      containedIn: {
        "@type": "Country",
        name: "Saudi Arabia",
      },
    },
    serviceType: service.category?.title,
    image: service.imageSrc ? [service.imageSrc] : undefined,
  };

  const hasBody = Array.isArray(service.body) && service.body.length > 0;

  return (
    <>
      <main className="min-h-screen bg-white pt-20 dark:bg-gray-950">
        <header className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-7">
              {service.category?.title ? (
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
                  {service.category.title}
                </p>
              ) : null}
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {service.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
                {service.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              {service.imageSrc ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {hasBody ? (
            <article className="prose prose-slate max-w-none dark:prose-invert">
              <PortableText value={service.body ?? []} />
            </article>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
              <h2 className="text-xl font-semibold">More details coming soon</h2>
              <p className="mt-2 text-sm leading-relaxed">
                We’re currently expanding this page with a full scope, compliance notes, typical
                timelines, and FAQs. For now, you can request a quote and our team will respond with
                a tailored proposal.
              </p>
            </div>
          )}
        </section>
      </main>

      <Script id={`service-schema-${service.slug}`} type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </Script>
    </>
  );
}
