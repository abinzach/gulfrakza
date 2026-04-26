"use client";

import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import {
  GridPatternCard,
  GridPatternCardBody,
} from "@/components/ui/card-with-grid-ellipsis-pattern";
import QuoteModal from "../GetQuote";
import Link from "next/link";

type ServiceCategoryLite = {
  id: string;
  title: string;
  description: string;
};

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
      <span className="text-cyan-600">{highlight}</span>
      {after}
    </>
  );
};

export default function ServicesClient({ categories }: { categories: ServiceCategoryLite[] }) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const t = useTranslations("home.services");
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const markerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [lineMetrics, setLineMetrics] = useState({ top: 0, left: 0, width: 0, travel: 0 });

  const useFiveCardLayout = categories.length === 5;
  const pillars = useMemo(
    () => [
      { key: "expertise" },
      { key: "quality" },
      { key: "safety" },
    ],
    [],
  );

  useEffect(() => {
    const updateLineMetrics = () => {
      const container = timelineRef.current;
      const firstMarker = markerRefs.current[0];
      const lastMarker = markerRefs.current[pillars.length - 1];

      if (!container || !firstMarker || !lastMarker) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const firstRect = firstMarker.getBoundingClientRect();
      const lastRect = lastMarker.getBoundingClientRect();

      const top = firstRect.top - containerRect.top + firstRect.height / 2;
      const left = firstRect.left - containerRect.left + firstRect.width / 2;
      const right = lastRect.left - containerRect.left + lastRect.width / 2;
      const width = Math.max(0, right - left);
      const streakWidth = 40;
      const travel = Math.max(0, width - streakWidth);

      setLineMetrics((current) => {
        if (
          Math.abs(current.top - top) < 0.5 &&
          Math.abs(current.left - left) < 0.5 &&
          Math.abs(current.width - width) < 0.5 &&
          Math.abs(current.travel - travel) < 0.5
        ) {
          return current;
        }
        return { top, left, width, travel };
      });
    };

    const animationFrame = window.requestAnimationFrame(updateLineMetrics);
    window.addEventListener("resize", updateLineMetrics);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateLineMetrics);
      if (timelineRef.current) {
        resizeObserver.observe(timelineRef.current);
      }
      markerRefs.current.forEach((element) => {
        if (element) {
          resizeObserver?.observe(element);
        }
      });
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateLineMetrics);
      resizeObserver?.disconnect();
    };
  }, [pillars.length]);

  const hasLineMetrics = lineMetrics.width > 0;

  return (
    <>
      <section id="services" className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 font-inter">
          <h2 className="mb-16 text-center text-5xl font-semibold">
            {renderEngineeringSolutionsTitle(t("sectionHeading"))}
          </h2>
          <div
            className={
              useFiveCardLayout
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6"
                : "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
            }
          >
            {categories.map((category, index) => {
              const layoutClass = useFiveCardLayout
                ? index < 3
                  ? "md:col-span-2"
                  : index === 3
                    ? "md:col-span-2 md:col-start-2"
                    : "md:col-span-2 md:col-start-4"
                : "";

              return (
                <div key={category.id} className={layoutClass}>
                  <Link href={`/services#${category.id}`}>
                    <GridPatternCard className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg">
                      <GridPatternCardBody className="h-full text-center">
                        <h3 className="mb-1 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-cyan-600">
                          {category.title}
                        </h3>
                        <p className="text-sm text-foreground/60">{category.description}</p>
                      </GridPatternCardBody>
                    </GridPatternCard>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-4 text-center font-inter">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">
            {t("whyHeading")}
          </h2>
          <p className="mx-auto mt-5 font-raleway text-3xl leading-relaxed text-slate-600">
            {t("whyDescription")}
          </p>

          <div ref={timelineRef} className="relative mx-auto mt-12 max-w-5xl">
            {hasLineMetrics && (
              <div
                className="pointer-events-none absolute h-px bg-gradient-to-r from-cyan-200 via-cyan-500/60 to-cyan-200"
                style={{
                  top: `${lineMetrics.top}px`,
                  left: `${lineMetrics.left}px`,
                  width: `${lineMetrics.width}px`,
                }}
              />
            )}
            {hasLineMetrics && (
              <motion.div
                className="pointer-events-none absolute h-[2px] w-10 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.95)]"
                style={{ top: `${lineMetrics.top}px`, left: `${lineMetrics.left}px` }}
                animate={{ x: [0, lineMetrics.travel, 0], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
                aria-hidden
              />
            )}

            <ol className="grid grid-cols-3 gap-5 sm:gap-8">
              {pillars.map((pillar, index) => (
                <li key={pillar.key} className="relative px-4 text-center">
                  <span
                    ref={(element) => {
                      markerRefs.current[index] = element;
                    }}
                    className="relative z-10 inline-block h-3 w-3 rounded-full bg-cyan-700"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-hanken text-[1.5rem] font-light leading-tight tracking-[-0.01em] text-cyan-600 md:text-[1.85rem]">
                    {t(`pillars.${pillar.key}`)}
                  </h3>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-black py-12 text-center font-inter text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="mb-4 text-4xl font-bold text-white">{t("ctaHeading")}</h3>
          <p className="mb-6">{t("ctaDescription")}</p>
          <Button
            className="rounded-full bg-white px-6 py-3 font-medium text-black hover:bg-gray-100"
            onClick={() => setIsQuoteModalOpen(true)}
          >
            {t("ctaButton")}
          </Button>

          <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
        </div>
      </section>
    </>
  );
}
