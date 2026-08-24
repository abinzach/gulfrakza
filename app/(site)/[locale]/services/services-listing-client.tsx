"use client";

/* Hallmark · genre: modern-minimal · macrostructure: Catalogue · theme: GulfRakza Technical Sheet · enrichment: Sanity service photography · nav: inherited · footer: inherited */
/* Hallmark · pre-emit critique: P4 H5 E5 S5 R5 V4 */

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import QuoteModal from "@/app/components/GetQuote";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/lib/services-sanity";
import { Link } from "@/navigation.client";
import { useTranslations } from "@/i18n/provider";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface ServicesListingClientProps {
  categories: ServiceCategory[];
  heroHeading: string;
  heroDescription: string;
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
      <span className="text-[var(--color-accent)]">{highlight}</span>
      {after}
    </>
  );
};

export default function ServicesListingClient({
  categories,
  heroHeading,
  heroDescription,
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
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);
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
    if (gallerySlides.length <= 1 || isGalleryPaused) return;
    const id = setInterval(() => setActiveSlide((s) => (s + 1) % gallerySlides.length), 5000);
    return () => clearInterval(id);
  }, [gallerySlides.length, isGalleryPaused]);

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
    <main className="min-h-screen bg-[var(--color-paper)] font-sans text-[var(--color-ink)]">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative h-[52vh] min-h-[360px] max-h-[520px] overflow-hidden bg-gray-950"
        onMouseEnter={() => setIsGalleryPaused(true)}
        onMouseLeave={() => setIsGalleryPaused(false)}
        onFocusCapture={() => setIsGalleryPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsGalleryPaused(false);
          }
        }}
      >
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
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-8 pt-24 sm:px-10 sm:pt-28 lg:px-20">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--color-accent)] sm:mb-4 sm:text-xs">
              {tNav("services")}
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
                  className="flex h-11 min-w-11 items-center justify-center px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:opacity-70"
                >
                  <span
                    className={cn(
                      "block h-0.5 w-6 transition-colors duration-300",
                      i === activeSlide
                        ? "bg-[var(--color-accent)]"
                        : "bg-white/35",
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
        <div className="sticky top-16 z-40 -mx-4 mb-6 border-y border-[var(--color-rule)] bg-[var(--color-surface)]/95 backdrop-blur-md lg:hidden">
          <div className="flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:h-0">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`#${cat.id}`}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  scrollToCategory(e, cat.id)
                }
                className={cn(
                  "relative flex min-h-11 shrink-0 items-center px-4 py-3.5 text-xs font-semibold transition-colors duration-200 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]",
                  activeCategory === cat.id
                    ? "text-[var(--color-accent-strong)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                )}
              >
                {cat.title}
                {activeCategory === cat.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-accent)]" />
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
              <nav className="space-y-0.5 border-l border-[var(--color-rule)]">
                {categories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`#${cat.id}`}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                      scrollToCategory(e, cat.id)
                    }
                    className={cn(
                      "group -ml-[2px] flex min-h-11 items-center gap-2.5 border-l-2 py-2.5 pl-4 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                      activeCategory === cat.id
                        ? "border-[var(--color-accent)] font-semibold text-[var(--color-accent-strong)]"
                        : "border-transparent text-[var(--color-muted)] hover:border-[var(--color-rule-strong)] hover:text-[var(--color-ink)]",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] transition-colors",
                        activeCategory === cat.id
                          ? "text-[var(--color-accent-strong)]"
                          : "text-[var(--color-rule-strong)]",
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
                    <div className="relative mb-4 h-40 overflow-hidden border border-[var(--color-rule)] sm:mb-5 sm:h-48 md:h-56">
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
                      <div className="absolute inset-0 bg-black/60" />

                      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <span className="mb-0.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                              {String(catIdx + 1).padStart(2, "0")}
                            </span>
                            <h2 className="text-base font-bold text-white sm:text-xl md:text-2xl">
                              <Link href={`/services/category/${category.slug}`} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] hover:underline">
                                {category.title}
                              </Link>
                            </h2>
                            <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-gray-300 sm:line-clamp-2 sm:text-xs md:text-sm">
                              {category.description}
                            </p>
                          </div>
                          {/* Quote CTA always in banner */}
                          <button
                            onClick={() => handleRequestCategory(category)}
                            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 bg-[var(--color-accent-strong)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-ink)] transition-colors hover:bg-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:opacity-80 sm:px-4 sm:py-2.5 sm:text-xs whitespace-nowrap"
                          >
                            {tNav("getQuote")}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile: compact list rows (fast scanning, proper touch targets) */}
                    <ul className="divide-y divide-[var(--color-rule)] overflow-hidden border border-[var(--color-rule)] bg-[var(--color-surface)] sm:hidden">
                      {category.services.map((service) => (
                        <li key={service.id}>
                          <Link
                            href={`/services/${service.slug}`}
                            className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-paper-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)] active:bg-[var(--color-paper-2)]"
                          >
                            <span className="text-sm font-medium leading-snug text-[var(--color-ink)]">
                              {service.title}
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--color-accent-strong)]" />
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Tablet/Desktop: card grid */}
                    <div className="hidden border-l border-t border-[var(--color-rule)] sm:grid sm:grid-cols-2">
                      {category.services.map((service) => (
                        <div
                          key={service.id}
                          className="group relative flex min-w-0 flex-col border-b border-r border-[var(--color-rule)] bg-[var(--color-surface)] p-5 transition-colors duration-200 hover:bg-[var(--color-paper-2)]"
                        >
                          <h3 className="mb-2 min-w-0 text-sm font-semibold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-strong)] [overflow-wrap:anywhere]">
                            <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-focus)]">
                              {service.title}
                            </Link>
                          </h3>
                          {service.description && (
                            <p className="mb-4 flex-1 text-xs leading-relaxed text-[var(--color-muted)] line-clamp-2">
                              {service.description}
                            </p>
                          )}
                          <button
                            onClick={() => handleRequestService(category, service.id)}
                            className="relative z-10 mt-auto inline-flex min-h-11 items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-strong)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:opacity-70 whitespace-nowrap"
                          >
                            {tNav("getQuote")}
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {catIdx < categories.length - 1 && (
                      <div className="mt-8 h-px bg-[var(--color-rule)] sm:mt-10" />
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
