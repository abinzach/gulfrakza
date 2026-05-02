"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import {
  GridPatternCard,
  GridPatternCardBody,
} from "@/components/ui/card-with-grid-ellipsis-pattern";
import QuoteModal from "../GetQuote";
import Link from "next/link";
import { BadgeCheck, ShieldCheck, Wrench } from "lucide-react";

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
      <span className="text-[#08778c]">{highlight}</span>
      {after}
    </>
  );
};

export default function ServicesClient({ categories }: { categories: ServiceCategoryLite[] }) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const t = useTranslations("home.services");

  const useFiveCardLayout = categories.length === 5;
  const pillars = useMemo(
    () => [
      { key: "expertise", icon: Wrench, label: "01" },
      { key: "quality", icon: BadgeCheck, label: "02" },
      { key: "safety", icon: ShieldCheck, label: "03" },
    ],
    [],
  );

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
                        <h3 className="mb-1 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-[#08778c]">
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

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 font-inter">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f7f9fb] shadow-[0_24px_80px_rgba(15,23,42,0.07)]">
            <div className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.055)_1px,transparent_1px)] [background-size:48px_48px]" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/80 to-transparent" />

            <div className="relative grid lg:grid-cols-[0.92fr_1.08fr]">
              <div className="bg-white/85 p-6 sm:p-8 lg:p-10 xl:p-12">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#08778c]">
                  {t("whyEyebrow")}
                </span>
                <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  {t("whyHeading")}
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 lg:text-lg">
                  {t("whyDescription")}
                </p>
                <div className="mt-10 hidden h-px w-full bg-gradient-to-r from-slate-300 via-slate-200 to-transparent lg:block" />
                <p className="mt-5 hidden max-w-sm text-sm leading-6 text-slate-500 lg:block">
                  Practical delivery support for industrial teams that need clear scopes,
                  controlled execution, and dependable site readiness.
                </p>
              </div>

              <div className="p-4 sm:p-6 lg:p-10 xl:p-12">
                <div className="relative">
                  <div className="absolute left-5 top-8 hidden h-[calc(100%-4rem)] w-px bg-slate-200 sm:block" />
                  <div className="space-y-4">
                    {pillars.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <article
                        key={pillar.key}
                        className="group relative rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm transition-all duration-300 hover:border-[#a5f3fc] hover:bg-white hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:ml-10 sm:p-6"
                      >
                        <span className="absolute -left-[3.25rem] top-6 hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors group-hover:border-[#a5f3fc] group-hover:text-[#08778c] sm:flex">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex items-start gap-4">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-[#eefcff] group-hover:text-[#08778c] sm:hidden">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                                {pillar.label}
                              </span>
                              <span className="h-px w-8 bg-slate-200" />
                            </div>
                            <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                              {t(`pillars.${pillar.key}`)}
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              {t(`pillarDetails.${pillar.key}`)}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                    })}
                  </div>
                </div>
              </div>
            </div>
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
