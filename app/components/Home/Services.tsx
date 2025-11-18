"use client";

import React, { useMemo, useState } from "react";
import { useLocale, useTranslations } from "@/i18n/provider";
import { FaHelmetSafety, FaPeopleGroup } from "react-icons/fa6";
import { TbChecklist } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import {
  GridPatternCard,
  GridPatternCardBody,
} from "@/components/ui/card-with-grid-ellipsis-pattern";
import QuoteModal from "../GetQuote";
import { DarkGridHero } from "./DarkGrid";
import { Link } from "@/navigation";
import { getCategories, type Locale } from "@/lib/services";

export default function ServicesSection() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const t = useTranslations("home.services");
  const locale = useLocale();

  const categories = useMemo(() => {
    return getCategories(locale as Locale);
  }, [locale]);

  return (
    <>
      <section
        id="services"
        className="relative flex h-[60vh] items-center justify-center bg-gray-900 text-center font-inter"
      >
        <div className="absolute inset-0 bg-cover bg-center" />
        <div className="absolute inset-0 bg-black opacity-50" />
        <DarkGridHero title={t("heroHeading")} description={t("heroDescription")} />
      </section>

      <section className="bg-gray-50 py-16 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 font-inter">
          <h2 className="mb-16 text-center text-5xl font-semibold lg:text-left">
            {t("sectionHeading")}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((category) => {
              return (
                <Link key={category.id} href={`/services#${category.id}`}>
                  <GridPatternCard className="h-full group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <GridPatternCardBody className="h-full">
                      <h3 className="mb-1 text-lg font-bold text-foreground group-hover:text-cyan-600 transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="text-sm text-foreground/60">{category.description}</p>
                    </GridPatternCardBody>
                  </GridPatternCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-center font-inter text-5xl font-semibold lg:text-left">
            {t("whyHeading")}
          </h2>
          <p className="font-raleway text-lg text-gray-600 lg:text-left">{t("whyDescription")}</p>
          <div className="mt-20 flex flex-wrap justify-center gap-10 font-inter lg:gap-32">
            <div className="flex flex-col items-center">
              <FaPeopleGroup className="mb-2 h-24 w-24 text-cyan-600" />
              <span className="font-bold text-gray-700">{t("pillars.expertise")}</span>
            </div>
            <div className="flex flex-col items-center">
              <TbChecklist className="mb-2 h-24 w-24 text-cyan-600" />
              <span className="font-bold text-gray-700">{t("pillars.quality")}</span>
            </div>
            <div className="flex flex-col items-center">
              <FaHelmetSafety className="mb-2 h-24 w-24 text-cyan-600" />
              <span className="font-bold text-gray-700">{t("pillars.safety")}</span>
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
