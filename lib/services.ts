import { getMessages } from "@/i18n/config";

// Utility function to create a URL-friendly slug from a string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

interface ServiceCard {
  title: string;
  description: string;
}

// English service titles in order (used for consistent slug generation)
const ENGLISH_SERVICE_TITLES = [
  "Scaffolding Services",
  "PEB Shed Fabrication",
  "Civil Works",
  "Steel & Aluminium Fabrication",
  "Rope Access & Safety Training",
  "Industrial Trading",
];

// Get English services to create consistent slug mapping
export async function getEnglishServices(): Promise<ServiceCard[]> {
  const messages = await getMessages("en");
  const servicesSection = messages?.home?.services;
  return servicesSection?.cards || [];
}

// Get service slug by index (services are in same order in all locales)
export function getServiceSlugByIndex(index: number): string | null {
  if (index >= 0 && index < ENGLISH_SERVICE_TITLES.length) {
    return slugify(ENGLISH_SERVICE_TITLES[index]);
  }
  return null;
}

// Get service index by slug (for finding which service a slug refers to)
export function getServiceIndexBySlug(slug: string): number | null {
  for (let i = 0; i < ENGLISH_SERVICE_TITLES.length; i++) {
    if (slugify(ENGLISH_SERVICE_TITLES[i]) === slug) {
      return i;
    }
  }
  return null;
}

// Get all service slugs (for static generation)
export function getAllServiceSlugs(): string[] {
  return ENGLISH_SERVICE_TITLES.map((title) => slugify(title));
}

