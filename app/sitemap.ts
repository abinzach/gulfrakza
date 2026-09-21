import { MetadataRoute } from "next";

import { fetchCatalogData, flattenCategoryTree } from "@/lib/catalog";
import { locales } from "@/i18n/config";
import { fetchServiceCategories } from "@/lib/services-sanity";
import { getAllServiceSlugs, getCategories as getLocalServiceCategories } from "@/lib/services";

const baseUrl = "https://www.gulfrakza.com";

// `fetchServiceCategories` reads through a token-authenticated Sanity client,
// which is never stored in the data cache, so without this the whole sitemap
// was rebuilt from the full catalog on every crawler request. One rebuild a day
// is plenty for a catalog that changes through the Studio.
export const revalidate = 86400;

const ensureLeadingSlash = (path: string) => (path.startsWith("/") ? path : `/${path}`);

const stripLocalePrefix = (path: string) => {
  const normalized = ensureLeadingSlash(path);
  for (const locale of locales) {
    const prefix = `/${locale}`;
    if (normalized === prefix) {
      return "/";
    }
    if (normalized.startsWith(`${prefix}/`)) {
      return normalized.slice(prefix.length) || "/";
    }
  }
  return normalized || "/";
};

const toLocalizedUrls = (path: string) => {
  const normalizedPath = stripLocalePrefix(path);
  const pathSegment = normalizedPath === "/" ? "" : ensureLeadingSlash(normalizedPath);

  return locales.map((locale) => {
    const localePath = pathSegment ? `/${locale}${pathSegment}` : `/${locale}`;
    return `${baseUrl}${localePath}`;
  });
};

const normalizeHrefToPath = (href: string) => {
  if (href.startsWith("http")) {
    try {
      return new URL(href).pathname;
    } catch {
      return href;
    }
  }
  return href;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, categoryTree } = await fetchCatalogData();

  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();
  const pushEntry = (
    url: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    lastModified?: string,
  ) => {
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({
      url,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority,
    });
  };

  const addLocalizedEntries = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    options?: { lastModified?: string; includeArabic?: boolean },
  ) => {
    toLocalizedUrls(path).forEach((url) => {
      if (options?.includeArabic === false && url.includes("/ar/")) return;
      pushEntry(url, priority, changeFrequency, options?.lastModified);
    });
  };

  addLocalizedEntries("/", 1, "monthly");
  addLocalizedEntries("/about-us", 0.8, "monthly");
  addLocalizedEntries("/products", 0.9, "weekly");
  addLocalizedEntries("/services", 0.85, "monthly");
  addLocalizedEntries("/privacy-policy", 0.4, "yearly");
  addLocalizedEntries("/terms-of-service", 0.4, "yearly");

  flattenCategoryTree(categoryTree)
    .filter((category) => category.productCount > 0)
    .forEach((category) => {
      const path = `/products/category/${category.path.map((segment) => segment.slug).join("/")}`;
      addLocalizedEntries(path, 0.7, "monthly", {
        lastModified: category.updatedAt,
        includeArabic: category.isArabicIndexable,
      });
    });

  products.forEach((product) => {
    if (!product.detailsHref) return;
    const productPath = normalizeHrefToPath(product.detailsHref);
    addLocalizedEntries(productPath, 0.6, "monthly", {
      lastModified: product.updatedAt,
      includeArabic: product.isArabicIndexable,
    });
  });

  try {
    const serviceCategories = await fetchServiceCategories("en");
    serviceCategories.forEach((category) => {
      addLocalizedEntries(`/services/category/${category.slug}`, 0.7, "monthly", {
        lastModified: category.updatedAt,
        includeArabic: category.isArabicIndexable,
      });
    });
    serviceCategories.flatMap((category) => category.services).forEach((service) => {
      addLocalizedEntries(`/services/${service.slug}`, 0.65, "monthly", {
        lastModified: service.updatedAt,
        includeArabic: service.isArabicIndexable,
      });
    });
  } catch {
    // The public sitemap remains valid if the optional authenticated service dataset is unavailable.
  }

  getAllServiceSlugs().forEach((slug) => {
    addLocalizedEntries(`/services/${slug}`, 0.65, "monthly");
  });
  getLocalServiceCategories("en").forEach((category) => {
    addLocalizedEntries(`/services/category/${category.id}`, 0.7, "monthly");
  });

  return entries;
}
