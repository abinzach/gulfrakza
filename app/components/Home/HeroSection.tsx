"use client";

import { useLocale, useTranslations } from "@/i18n/provider";
import { Link } from "@/navigation.client";
import { trackEvent } from "@/app/components/analytics-events";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const t = useTranslations("home.hero");
  const misc = useTranslations("common.misc");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setReduceMotion(mediaQuery.matches);
    update();

    // Safari < 14
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      // Start loading slightly before it scrolls into view.
      { root: null, rootMargin: "200px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[720px] w-full overflow-hidden bg-neutral-950 md:h-[100svh]"
      aria-label={t("ariaLabel")}
    >
      {/*
        LCP-first strategy:
        - Paint a static poster image first (fast to decode).
        - Lazy-load the heavy video only once the hero is near the viewport.
        - Respect prefers-reduced-motion by never autoplaying video.
      */}
      <Image
        src="/images/services/hero-1.avif"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute left-0 top-0 h-full w-full object-cover object-center"
      />

      {shouldLoadVideo && !reduceMotion ? (
        <video
          className="absolute left-0 top-0 h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/images/services/hero-1.avif"
          aria-hidden="true"
        >
          <source
            src="https://ik.imagekit.io/l3eswz12s/Gulf%20Rakza/hero_vid?updatedAt=1739108938597"
            type="video/mp4"
          />
          {misc("videoFallback")}
        </video>
      ) : null}

      <noscript>
        <div className="absolute left-0 top-0 h-full w-full">
          <div className="h-full w-full bg-gray-800" />
        </div>
      </noscript>

      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.68)_42%,rgba(0,0,0,0.34)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.14)_28%,rgba(0,0,0,0.68)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[720px] w-full max-w-7xl items-center px-4 pb-12 pt-32 text-white sm:px-6 lg:h-[100svh] lg:px-8 lg:pt-28">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className={isRTL ? "text-right" : "text-left"}>
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#d8f7ff] backdrop-blur">
              {t("eyebrow")}
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-normal text-white sm:text-5xl lg:text-6xl">
              {t("h1")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {t("description")}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                onClick={() => trackEvent("hero_primary_cta_click", { target: "products" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-black/20 transition hover:bg-[#eefcff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                {t("primaryCta")}
                <ArrowRight className={isRTL ? "h-4 w-4 rotate-180" : "h-4 w-4"} aria-hidden="true" />
              </Link>
              <a
                href="#contact-us"
                onClick={() => trackEvent("hero_secondary_cta_click", { target: "contact" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                title={misc("contactTitle")}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {t("secondaryCta")}
              </a>
            </div>

            <p className="mt-5 text-sm font-medium text-[#d8f7ff]/90">{t("supportLine")}</p>
          </div>

          <div className="hidden border-l border-white/20 pl-6 lg:block">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#a5f3fc]">
              {t("proofHeading")}
            </p>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-3 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t(`proof${item}Title`)}</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">{t(`proof${item}Body`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:hidden">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-t border-white/20 pt-3">
                <p className="text-sm font-semibold text-white">{t(`proof${item}Title`)}</p>
                <p className="mt-1 text-xs leading-5 text-white/70">{t(`proof${item}Body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
