"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import QuoteModal from "@/app/components/GetQuote";
import { cn } from "@/lib/utils";
import { ServiceCategory } from "@/lib/services";
import { Link } from "@/navigation.client";
import { useTranslations } from "@/i18n/provider";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface ServicesListingClientProps {
  categories: ServiceCategory[];
  heroHeading: string;
  heroDescription: string;
  sectionHeading: string;
}

const categoryListImages: Record<string, string> = {
  "safety-services": "/images/services/safety.jpeg",
  "cathodic-protection": "/images/services/cathodic.jpeg",
  "hvac-services": "/images/services/hvac.jpeg",
  "mechanical-engineering-services": "/images/services/mechanical.jpeg",
};

const renderHighlightedTitle = (title: string) => {
  const englishHighlight = "Engineering Solutions";
  const arabicHighlight = "الحلول الهندسية";
  const highlight = title.includes(englishHighlight)
    ? englishHighlight
    : title.includes(arabicHighlight)
      ? arabicHighlight
      : "";
  if (!highlight) return title;
  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-cyan-400">{highlight}</span>
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
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteContext, setQuoteContext] = useState<{
    initialProduct?: { name?: string; category?: string };
    serviceOptions?: Array<{ id: string; title: string }>;
    initialSelectedServiceIds?: string[];
  } | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [categoryImageStep, setCategoryImageStep] = useState<Record<string, number>>({});

  const gallerySlides = useMemo(
    () =>
      categories.slice(0, 5).map((cat) => ({
        id: cat.id,
        title: cat.title,
        imageSrc:
          cat.imageSrc ||
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=80",
      })),
    [categories],
  );

  useEffect(() => {
    if (gallerySlides.length <= 1) return;
    const id = setInterval(() => setActiveSlide((s) => (s + 1) % gallerySlides.length), 5000);
    return () => clearInterval(id);
  }, [gallerySlides.length]);

  useEffect(() => {
    if (activeSlide > gallerySlides.length - 1) setActiveSlide(0);
  }, [activeSlide, gallerySlides.length]);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 140;
      for (const cat of categories) {
        const el = document.getElementById(cat.id);
        if (el && el.offsetTop <= scrollY && el.offsetTop + el.offsetHeight > scrollY) {
          setActiveCategory(cat.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [categories]);

  const scrollToCategory = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 108;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const buildServiceOptions = (cat: ServiceCategory) =>
    cat.services.map((s) => ({ id: s.id, title: s.title }));

  const handleRequestCategory = (category: ServiceCategory) => {
    setQuoteContext({
      initialProduct: { category: category.title },
      serviceOptions: buildServiceOptions(category),
      initialSelectedServiceIds: [],
    });
    setIsQuoteModalOpen(true);
  };

  const handleRequestService = (category: ServiceCategory, serviceId: string) => {
    const svc = category.services.find((s) => s.id === serviceId);
    if (!svc) return;
    setQuoteContext({
      initialProduct: { name: svc.title, category: category.title },
      serviceOptions: buildServiceOptions(category),
      initialSelectedServiceIds: [svc.id],
    });
    setIsQuoteModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans dark:bg-gray-950">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[52vh] min-h-[360px] max-h-[520px] overflow-hidden bg-gray-950">
        {gallerySlides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              i === activeSlide ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={i !== activeSlide}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35" />

        <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-8 pt-24 sm:px-10 sm:pt-28 lg:px-20">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-400 sm:mb-4 sm:text-xs">
              {sectionHeading}
            </span>
            <h1 className="text-2xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-5xl">
              {renderHighlightedTitle(heroHeading)}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300 sm:mt-4 sm:text-base md:text-lg">
              {heroDescription}
            </p>
          </div>

          {/* Slide indicators — large enough touch area */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {gallerySlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="flex h-8 items-center px-1"
                >
                  <span
                    className={cn(
                      "block rounded-full transition-all duration-500",
                      i === activeSlide
                        ? "h-0.5 w-6 bg-cyan-400"
                        : "h-0.5 w-2.5 bg-white/35",
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="font-mono text-xs tabular-nums text-white/50">
              <span className="text-white/90">{String(activeSlide + 1).padStart(2, "0")}</span>
              {" — "}
              {String(gallerySlides.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      {/* ── Page body ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

        {/* Mobile tabs — sticky, full-width, proper touch height */}
        <div className="sticky top-0 z-40 -mx-4 mb-6 border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95 lg:hidden">
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`#${cat.id}`}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  scrollToCategory(e, cat.id)
                }
                className={cn(
                  "relative shrink-0 px-4 py-3.5 text-xs font-semibold transition-colors duration-200 whitespace-nowrap",
                  activeCategory === cat.id
                    ? "text-cyan-700 dark:text-cyan-400"
                    : "text-gray-500 dark:text-gray-400",
                )}
              >
                {cat.title}
                {activeCategory === cat.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-700 dark:bg-cyan-400" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-10 lg:gap-14">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                Categories
              </p>
              <nav className="space-y-0.5 border-l border-gray-200 dark:border-gray-800">
                {categories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`#${cat.id}`}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                      scrollToCategory(e, cat.id)
                    }
                    className={cn(
                      "group -ml-[2px] flex items-baseline gap-2.5 border-l-2 py-2.5 pl-4 text-sm transition-all duration-200",
                      activeCategory === cat.id
                        ? "border-cyan-700 font-semibold text-cyan-700 dark:border-cyan-400 dark:text-cyan-400"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] transition-colors",
                        activeCategory === cat.id
                          ? "text-cyan-600 dark:text-cyan-500"
                          : "text-gray-300 group-hover:text-gray-400 dark:text-gray-600",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {cat.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            <div className="space-y-10 sm:space-y-14">
              {categories.map((category, catIdx) => {
                const imageCandidates = [
                  categoryListImages[category.id],
                  category.imageSrc,
                  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=80",
                ].filter(Boolean) as string[];
                const step = categoryImageStep[category.id] ?? 0;
                const safeStep = Math.min(step, imageCandidates.length - 1);
                const catImage = imageCandidates[safeStep];

                return (
                  <section
                    key={category.id}
                    id={category.id}
                    className="scroll-mt-[108px] lg:scroll-mt-28"
                  >
                    {/* Category banner — quote CTA always inside */}
                    <div className="relative mb-4 h-40 overflow-hidden rounded-xl sm:mb-5 sm:h-48 md:h-56 md:rounded-2xl">
                      <Image
                        src={catImage}
                        alt={category.title}
                        fill
                        sizes="(max-width: 1280px) 100vw, 900px"
                        className="object-cover"
                        onError={() => {
                          if (safeStep < imageCandidates.length - 1) {
                            setCategoryImageStep((prev) => ({
                              ...prev,
                              [category.id]: safeStep + 1,
                            }));
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <span className="mb-0.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                              {String(catIdx + 1).padStart(2, "0")}
                            </span>
                            <h2 className="text-base font-bold text-white sm:text-xl md:text-2xl">
                              {category.title}
                            </h2>
                            <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-gray-300 sm:line-clamp-2 sm:text-xs md:text-sm">
                              {category.description}
                            </p>
                          </div>
                          {/* Quote CTA always in banner */}
                          <button
                            onClick={() => handleRequestCategory(category)}
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-cyan-700/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition hover:bg-cyan-600 active:scale-95 sm:px-4 sm:py-2.5 sm:text-xs"
                          >
                            {tNav("getQuote")}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile: compact list rows (fast scanning, proper touch targets) */}
                    <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900 sm:hidden">
                      {category.services.map((service) => (
                        <li key={service.id}>
                          <button
                            onClick={() => handleRequestService(category, service.id)}
                            className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors active:bg-cyan-50 dark:active:bg-cyan-950/30"
                          >
                            <span className="text-sm font-medium leading-snug text-gray-800 dark:text-gray-100">
                              {service.title}
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Tablet/Desktop: card grid */}
                    <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3">
                      {category.services.map((service) => (
                        <div
                          key={service.id}
                          className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-cyan-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cyan-800/60"
                        >
                          <h3 className="mb-2 text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-400">
                            {service.title}
                          </h3>
                          {service.description && (
                            <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-500 line-clamp-2 dark:text-gray-400">
                              {service.description}
                            </p>
                          )}
                          <button
                            onClick={() => handleRequestService(category, service.id)}
                            className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-700 transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                          >
                            {tNav("getQuote")}
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {catIdx < categories.length - 1 && (
                      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800 sm:mt-10" />
                    )}
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
