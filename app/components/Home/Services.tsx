import type { Locale } from "@/i18n/config";

import ServicesClient from "./ServicesClient";
import { fetchServiceCategories } from "@/lib/services-sanity";
import { getCategories as getLocalServiceCategories } from "@/lib/services";

/**
 * Server wrapper that feeds the existing (client) homepage services UI with
 * categories from Sanity. If Sanity has no content yet (or is unreachable), we
 * fall back to the existing local JSON so the site never renders empty.
 */
export default async function Services({ locale }: { locale: Locale }) {
  let categories: Array<{ id: string; title: string; description: string }> = [];

  try {
    const sanityCategories = await fetchServiceCategories(locale);
    categories = sanityCategories.map((category) => ({
      id: category.id,
      title: category.title,
      description: category.description,
    }));
  } catch {
    // ignore and fall back
  }

  if (categories.length === 0) {
    const fallback = getLocalServiceCategories(locale === "ar" ? "ar" : "en");
    categories = fallback.map((category) => ({
      id: category.id,
      title: category.title,
      description: category.description,
    }));
  }

  return <ServicesClient categories={categories} />;
}
