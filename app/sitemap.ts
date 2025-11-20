import { MetadataRoute } from "next";

import { fetchCatalogData } from "@/lib/catalog";
import { locales } from "@/i18n/config";

const baseUrl = "https://www.gulfrakza.com";

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
  const { products } = await fetchCatalogData();

  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();
  const lastModified = new Date();

  const pushEntry = (
    url: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => {
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({
      url,
      lastModified,
      changeFrequency,
      priority,
    });
  };

  const addLocalizedEntries = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => {
    toLocalizedUrls(path).forEach((url) => pushEntry(url, priority, changeFrequency));
  };

  addLocalizedEntries("/", 1, "monthly");
  addLocalizedEntries("/about-us", 0.8, "monthly");
  addLocalizedEntries("/products", 0.9, "weekly");
  addLocalizedEntries("/services", 0.85, "monthly");
  addLocalizedEntries("/privacy-policy", 0.4, "yearly");
  addLocalizedEntries("/terms-of-service", 0.4, "yearly");

  // Only include actual product detail pages, not category paths
  // Category filtering is handled via query params on /products page
  products.forEach((product) => {
    if (!product.detailsHref) return;
    const productPath = normalizeHrefToPath(product.detailsHref);
    addLocalizedEntries(productPath, 0.5, "monthly");
  });

  return entries;
}
