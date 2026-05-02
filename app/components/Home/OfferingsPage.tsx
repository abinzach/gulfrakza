import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import data from "../../Product_Categories.json";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/config";

interface Item {
  title: string;
  description: string;
  link: string;
  imageSrc: string;
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

const getCategorySlug = (link: string, title: string) => {
  const parts = link?.split("/").filter(Boolean);
  if (parts && parts.length > 0) {
    return parts[parts.length - 1];
  }
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");
};

const getNestedValue = (obj: unknown, path: string): unknown => {
  if (!obj) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (acc as any)[key];
  }, obj);
};

const OfferingsPage = async ({ locale }: { locale: Locale }) => {
  const { categories } = data as CategoriesData;
  const messages = await getMessages(locale);

  const getLocalizedText = (relativeKey: string, fallback: string) => {
    const value = getNestedValue(messages?.home?.offerings, relativeKey);
    return typeof value === "string" && value.trim().length > 0 ? value : fallback;
  };

  return (
    <section className="bg-gray-50 py-10 font-inter dark:bg-gray-900 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center lg:text-left">
        <h2 className="text-4xl font-semibold lg:text-5xl">
          {getLocalizedText("headingLine1", "Empower your operations")}
        </h2>
        <h2 className="mb-4 text-4xl font-semibold text-[#08778c] lg:text-5xl">
          {getLocalizedText("headingLine2", "with our solutions")}
        </h2>
        <p className="mb-12 max-w-2xl text-lg text-gray-800 lg:text-left">
          {getLocalizedText(
            "description",
            "From safety equipment to hydraulic systems, we offer a comprehensive selection of products tailored to meet your industrial needs.",
          )}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => {
            const slug = getCategorySlug(category.link, category.title);
            const localizedTitle = getLocalizedText(`categoryCards.${slug}.title`, category.title);
            const localizedDescription = getLocalizedText(
              `categoryCards.${slug}.description`,
              category.description,
            );

            return (
              <Link
                key={category.title}
                href={`/${locale}/products?category=${encodeURIComponent(slug)}`}
              >
                <div className="group h-full cursor-pointer rounded border border-dashed border-gray-500 bg-white p-6 transition-shadow duration-300 hover:shadow-lg dark:bg-gray-950">
                  <Image
                    width={64}
                    height={64}
                    src={category.imageSrc}
                    alt={localizedTitle}
                    className="mx-auto mb-4 h-16"
                  />
                  <h3
                    className={cn(
                      "mb-2 text-left font-raleway text-xl font-semibold transition-colors duration-300 group-hover:text-[#08778c]",
                      locale === "ar" ? undefined : "uppercase",
                    )}
                  >
                    {localizedTitle}
                  </h3>
                  <p className="mb-4 text-left font-raleway text-sm text-gray-700">
                    {localizedDescription}
                  </p>
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
