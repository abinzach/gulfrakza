import servicesData from "@/data/services.json";

export type Locale = "en" | "ar";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  category?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  services: ServiceItem[];
}

// Raw data types matching the JSON structure
interface RawServiceItem {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  imageSrc?: string;
}

interface RawCategory {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  imageSrc?: string;
  services: RawServiceItem[];
}

// Utility function to create a URL-friendly slug from a string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

export function getCategories(locale: Locale = "en"): ServiceCategory[] {
  return (servicesData as RawCategory[]).map((category) => ({
    id: category.id,
    title: category.title[locale],
    description: category.description[locale],
    imageSrc: category.imageSrc,
    services: category.services.map((service) => ({
      id: service.id,
      title: service.title[locale],
      description: service.description[locale],
      imageSrc: service.imageSrc,
      category: category.title[locale],
    })),
  }));
}

export function getAllServices(locale: Locale = "en"): ServiceItem[] {
  const categories = getCategories(locale);
  return categories.flatMap((category) => category.services);
}

export function getServiceBySlug(slug: string, locale: Locale = "en"): ServiceItem | null {
  const services = getAllServices(locale);
  return services.find((service) => service.id === slug) || null;
}

// Get all service slugs (for static generation) - using IDs as slugs
export function getAllServiceSlugs(): string[] {
  // We use the IDs from the JSON as stable slugs
  return (servicesData as RawCategory[]).flatMap((cat) => 
    cat.services.map((service) => service.id)
  );
}

// Helper to get the index is less relevant now that we use ID-based lookup, 
// but we might need it if we want to maintain order or find adjacent services.
export function getServiceIndexBySlug(slug: string): number {
    const slugs = getAllServiceSlugs();
    return slugs.indexOf(slug);
}
