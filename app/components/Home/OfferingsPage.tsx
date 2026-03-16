/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { useLocale, useTranslations } from "@/i18n/provider";
import React from "react";
import { cn } from "@/lib/utils";
import data from "../../Product_Categories.json";
import { Link } from "@/navigation";

interface Category {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  subcategories?: any[];
}

interface CategoriesData {
  categories: Category[];
}

const getCategorySlug = (link: string, title: string) => {
  const parts = link?.split("/").filter(Boolean);
  if (parts && parts.length > 0) return parts[parts.length - 1];
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
};

const OfferingsPage: React.FC = () => {
  const { categories } = data as CategoriesData;
  const locale = useLocale();
  const t = useTranslations("home.offerings");

  const getLocalizedText = (relativeKey: string, fallback: string) => {
    const translation = t(relativeKey);
    const namespacedKey = `home.offerings.${relativeKey}`;
    return translation === namespacedKey ? fallback : translation;
  };

  return (
    <section className="bg-white py-24 font-inter lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs font-medium tracking-[0.2em] uppercase text-gray-400">
            {t("eyebrow")}
          </p>
          <h2 className="text-4xl font-semibold leading-[1.1] tracking-tight text-[#111] lg:text-5xl">
            {t("headingLine1")}
            <br />
            {t("headingLine2")}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#6b6b6b]">
            {t("description")}
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const slug = getCategorySlug(category.link, category.title);
            const localizedTitle = getLocalizedText(
              `categoryCards.${slug}.title`,
              category.title
            );

            return (
              <Link key={category.title} href={category.link}>
                <div
                  className={cn(
                    "group relative overflow-hidden rounded-2xl bg-[#1a1a1a]",
                    "aspect-[4/3]"
                  )}
                >
                  {/* Background image */}
                  <Image
                    src={category.imageSrc}
                    alt={localizedTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="mb-1.5 text-[10px] font-medium tracking-[0.2em] uppercase text-white/40">
                      {locale === "ar" ? "منتجاتنا" : "Products"}
                    </p>
                    <h3 className="font-raleway text-lg font-semibold text-white">
                      {localizedTitle}
                    </h3>
                  </div>

                  {/* Arrow on hover */}
                  <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/0 transition-all duration-300 group-hover:bg-white/15">
                    <svg
                      className="h-4 w-4 translate-x-0 translate-y-0 text-white/0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17L17 7M17 7H7M17 7v10"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OfferingsPage;
