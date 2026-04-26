"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import QuoteModal from "@/app/components/GetQuote";
import { cn } from "@/lib/utils";
import { ServiceCategory } from "@/lib/services";
import { Link } from "@/navigation.client";
import { useTranslations } from "@/i18n/provider";

interface ServicesListingClientProps {
  categories: ServiceCategory[];
  heroHeading: string;
  heroDescription: string;
  sectionHeading: string;
}

const renderEngineeringSolutionsTitle = (title: string) => {
  const englishHighlight = "Engineering Solutions";
  const arabicHighlight = "الحلول الهندسية";
  const highlight = title.includes(englishHighlight)
    ? englishHighlight
    : title.includes(arabicHighlight)
      ? arabicHighlight
      : "";

  if (!highlight) {
    return title;
  }

  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-cyan-300">{highlight}</span>
      {after}
    </>
  );
};

export default function ServicesListingClient({
  categories,
  heroHeading,
  heroDescription,
  sectionHeading,
}: ServicesListingClientProps) {
  const tNav = useTranslations("common.nav");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteContext, setQuoteContext] = useState<{
    initialProduct?: {
      name?: string;
      category?: string;
    };
    serviceOptions?: Array<{
      id: string;
      title: string;
    }>;
    initialSelectedServiceIds?: string[];
  } | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [categoryImageStep, setCategoryImageStep] = useState<Record<string, number>>({});
  const gallerySlides = useMemo(
    () =>
      categories.slice(0, 5).map((category) => ({
        id: category.id,
        title: category.title,
        tagline: category.description,
        imageSrc:
          category.imageSrc ||
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=80",
      })),
    [categories],
  );

  // Simple scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((cat) => document.getElementById(cat.id));
      const scrollPosition = window.scrollY + 200; // Offset

      for (const section of sections) {
        if (
          section &&
          section.offsetTop <= scrollPosition &&
          section.offsetTop + section.offsetHeight > scrollPosition
        ) {
          setActiveCategory(section.id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  useEffect(() => {
    if (gallerySlides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % gallerySlides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [gallerySlides.length]);

  useEffect(() => {
    if (activeSlide > gallerySlides.length - 1) {
      setActiveSlide(0);
    }
  }, [activeSlide, gallerySlides.length]);

  const scrollToCategory = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const buildServiceOptions = (category: ServiceCategory) =>
    category.services.map((service) => ({
      id: service.id,
      title: service.title,
    }));

  const buildServiceHref = (serviceId: string) => {
    // Prefer slug if present (Sanity-backed). Fallback to id.
    // Also preserves locale thanks to locale-aware Link.
    const slugValue = (serviceId || "").trim();
    return `/services/${encodeURIComponent(slugValue)}`;
  };

  const handleRequestCategory = (category: ServiceCategory) => {
    setQuoteContext({
      initialProduct: {
        category: category.title,
      },
      serviceOptions: buildServiceOptions(category),
      initialSelectedServiceIds: [],
    });
    setIsQuoteModalOpen(true);
  };

  const handleRequestService = (category: ServiceCategory, serviceId: string) => {
    const selected = category.services.find((service) => service.id === serviceId);
    if (!selected) {
      return;
    }

    setQuoteContext({
      initialProduct: {
        name: selected.title,
        category: category.title,
      },
      serviceOptions: buildServiceOptions(category),
      initialSelectedServiceIds: [selected.id],
    });
    setIsQuoteModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 font-sans pb-32">
      {/* Gallery Hero */}
      <section className="relative h-[62vh] min-h-[420px] overflow-hidden bg-gray-900">
        {gallerySlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === activeSlide ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={index !== activeSlide}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/45" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-end px-4 pb-14 sm:px-6 lg:px-8">
          <div className="w-full">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan-300">
              {sectionHeading}
            </p>

            <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
              {renderEngineeringSolutionsTitle(heroHeading)}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-200 md:text-xl">
              {heroDescription}
            </p>

          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 lg:pt-24">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
                Categories
              </h3>
              <nav className="space-y-2 border-l border-gray-100 dark:border-gray-800">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`#${category.id}`}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToCategory(e, category.id)}
                    className={cn(
                      "block pl-6 py-2 text-sm transition-all duration-300 border-l-2 -ml-[2px]",
                      activeCategory === category.id
                        ? "border-cyan-600 text-cyan-600 font-medium"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300"
                    )}
                  >
                    {category.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Navigation (Horizontal) */}
          <div className="lg:hidden sticky top-20 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`#${category.id}`}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => scrollToCategory(e, category.id)}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-all",
                    activeCategory === category.id
                      ? "bg-cyan-700 text-white shadow-md shadow-cyan-600/20"
                      : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100"
                  )}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-20">
              {categories.map((category) => {
                const imageCandidates = [
                  category.imageSrc,
                  category.services[0]?.imageSrc,
                  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80",
                ].filter((item): item is string => Boolean(item));
                const step = categoryImageStep[category.id] ?? 0;
                const safeStep = Math.min(step, imageCandidates.length - 1);
                const categoryImageSrc = imageCandidates[safeStep];

                return (
                  <section
                    key={category.id}
                    id={category.id}
                    className="scroll-mt-32"
                  >
                    <div className="mb-8">
                      <h2 className="mb-3 flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                        <span className="block h-1 w-8 rounded-full bg-cyan-700"></span>
                        {category.title}
                      </h2>
                      <p className="max-w-3xl pl-11 text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                        <div className="relative h-56 overflow-hidden rounded-xl bg-gray-100 md:col-span-5 md:h-full md:min-h-[280px] dark:bg-gray-800">
                          <Image
                            src={categoryImageSrc}
                            alt={category.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover"
                            priority={false}
                            onError={() => {
                              if (safeStep < imageCandidates.length - 1) {
                                setCategoryImageStep((current) => ({
                                  ...current,
                                  [category.id]: safeStep + 1,
                                }));
                              }
                            }}
                          />
                        </div>

                        <div className="md:col-span-7">
                          <div className="mb-4 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRequestCategory(category)}
                              className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-cyan-800"
                            >
                              <span className="inline-flex h-4 w-4 items-center justify-center text-[13px] leading-none" aria-hidden="true">
                                &#xFDFC;
                              </span>
                              {tNav("getQuote")}
                            </button>
                          </div>

                          <ul className="space-y-2">
                            {category.services.map((service) => (
                              <li key={service.id}>
                                <div className="group flex w-full items-stretch justify-between rounded-xl border border-gray-200 bg-white transition-colors hover:border-cyan-500 hover:bg-cyan-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-cyan-500/60 dark:hover:bg-cyan-950/30">
                                  <Link
                                    href={buildServiceHref(service.id)}
                                    className="flex-1 px-4 py-3 text-left"
                                    aria-label={service.title}
                                  >
                                    <span className="text-sm font-medium text-gray-800 transition-colors group-hover:text-cyan-700 dark:text-gray-100 dark:group-hover:text-cyan-300">
                                      {service.title}
                                    </span>
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() => handleRequestService(category, service.id)}
                                    className="m-1 inline-flex items-center gap-2 rounded-full bg-cyan-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-cyan-800"
                                  >
                                    {tNav("getQuote")}
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <QuoteModal 
        open={isQuoteModalOpen} 
        onOpenChange={setIsQuoteModalOpen}
        initialProduct={quoteContext?.initialProduct}
        serviceOptions={quoteContext?.serviceOptions}
        initialSelectedServiceIds={quoteContext?.initialSelectedServiceIds}
      />
    </main>
  );
}
