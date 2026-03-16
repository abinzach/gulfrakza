"use client";

import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useLocale, useTranslations } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import QuoteModal from "../GetQuote";
import { Link } from "@/navigation";
import { getCategories, type Locale } from "@/lib/services";

const pillars = [
  { key: "expertise", number: "01" },
  { key: "quality", number: "02" },
  { key: "safety", number: "03" },
];

export default function ServicesSection() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const t = useTranslations("home.services");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const categories = useMemo(() => getCategories(locale as Locale), [locale]);

  return (
    <>
      {/* ── Dark service list ── */}
      <section
        id="services"
        className="bg-black py-24 font-inter lg:py-32"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20">

            {/* Left: sticky heading */}
            <div className="mb-16 lg:mb-0 lg:sticky lg:top-28 lg:self-start">
              <p className="mb-4 text-xs font-medium tracking-[0.2em] uppercase text-white/35">
                {t("eyebrow")}
              </p>
              <h2 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white lg:text-5xl">
                {t("heroHeading")}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/50">
                {t("heroDescription")}
              </p>
              <Button
                onClick={() => setIsQuoteModalOpen(true)}
                className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90"
              >
                {t("ctaButton")}
              </Button>
            </div>

            {/* Right: service rows */}
            <div className="divide-y divide-white/8">
              {categories.map((category, index) => (
                <Link key={category.id} href={`/services#${category.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isRTL ? -16 : 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    className="group flex items-start justify-between py-7"
                  >
                    <div className="flex-1">
                      <span className="mb-2 block font-inter text-[10px] font-medium tracking-[0.2em] uppercase text-white/25">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-inter text-xl font-semibold text-white transition-colors group-hover:text-white/75">
                        {category.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/40">
                        {category.description}
                      </p>
                    </div>
                    <svg
                      className={`mt-1 h-5 w-5 flex-shrink-0 text-white/20 transition-all duration-200 group-hover:text-white/50 ${isRTL ? "mr-4 rotate-180 group-hover:-translate-x-1" : "ml-4 group-hover:translate-x-1"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why us — white ── */}
      <section
        className="bg-white py-24 font-inter lg:py-32"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] uppercase text-gray-400">
            {t("whyEyebrow")}
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-[#111] lg:text-5xl">
            {t("whyHeading")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#6b6b6b]">
            {t("whyDescription")}
          </p>

          <div className="mt-16 grid grid-cols-1 gap-14 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <span className="mb-4 font-inter text-xs font-medium tracking-[0.2em] uppercase text-gray-300">
                  {pillar.number}
                </span>
                <h3 className="mb-3 font-inter text-xl font-semibold tracking-tight text-[#111]">
                  {t(`pillars.${pillar.key}`)}
                </h3>
                <p className="text-sm leading-relaxed text-[#6b6b6b]">
                  {t(`pillarDetails.${pillar.key}`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <QuoteModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
    </>
  );
}
