/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { useLocale, useTranslations } from "@/i18n/provider";
import React from "react";
import { cn } from "@/lib/utils";
import data from "../../Product_Categories.json";
import { Link } from "@/navigation";

interface Item {
  title: string;
  description: string;
  link: string;
  imageSrc: string;
  specs?: { [key: string]: any };
}

interface Subcategory {
  title: string;
  description: string;
  items: Item[];
}

interface Category {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  subcategories?: Subcategory[];
}

interface CategoriesData {
  categories: Category[];
}

const OfferingsPage: React.FC = () => {
  const { categories } = data as CategoriesData;
  const locale = useLocale();
  const t = useTranslations("home.offerings");

  return (
    <section className="bg-gray-50 py-10 font-inter dark:bg-gray-900 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center lg:text-left">
        <h2 className="text-4xl font-semibold lg:text-5xl">{t("headingLine1")}</h2>
        <h2 className="mb-4 text-4xl font-semibold text-cyan-600 lg:text-5xl">
          {t("headingLine2")}
        </h2>
        <p className="mb-12 max-w-2xl text-lg text-gray-800 lg:text-left">
          {t("description")}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.title} href={category.link}>
              <div className="group h-full cursor-pointer rounded border border-dashed border-gray-500 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:bg-gray-950">
                <Image
                  width={64}
                  height={64}
                  src={category.imageSrc}
                  alt={category.title}
                  className="mx-auto mb-4 h-16"
                />
                <h3
                  className={cn(
                    "mb-2 text-left font-raleway text-xl font-semibold transition-colors duration-300 group-hover:text-cyan-600",
                    locale === "ar" ? undefined : "uppercase",
                  )}
                >
                  {category.title}
                </h3>
                <p className="mb-4 text-left font-raleway text-sm text-gray-700">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferingsPage;
