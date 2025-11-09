/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import BackButton from "@/app/components/BackButton";
import data from "../../../../Product_Categories.json";
import {
  GridPatternCard,
  GridPatternCardBody,
} from "@/components/ui/card-with-grid-ellipsis-pattern";
import { getMessages, isLocale, type Locale, defaultLocale } from "@/i18n/config";

interface Item {
  title: string;
  description: string;
  link: string;
  imageSrc: string;
  specs?: Record<string, any>;
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

// Utility function to create consistent slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-');     // Replace spaces with hyphens
}

// --------------------------------------------
// 1) Generate static params for each category
// --------------------------------------------
export async function generateStaticParams() {
  const categoriesData = data as CategoriesData;

  // Return an array of { category: "...slug..." }
  return categoriesData.categories.map((cat) => ({
    category: slugify(cat.title),
  }));
}

// ------------------------------------------------
// 2) The Page Component
// ------------------------------------------------
export default async function CategoryPage({  
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  // Get the category slug from params
  const { category: categorySlug, locale } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const messages = await getMessages(activeLocale);
  const categoryCopy =
    (messages?.home?.offerings?.categoryCards as Record<
      string,
      { title?: string; description?: string; subcategories?: Record<string, { title?: string; description?: string }> }
    >) ?? {};
  const categoriesData = data as CategoriesData;

  let categoryFound: Category | null = null;

  // Find matching category by slug
  for (const cat of categoriesData.categories) {
    const catSlug = slugify(cat.title);
    if (catSlug === categorySlug) {
      categoryFound = cat;
      break;
    }
  }

  // If no match, show 404
  if (!categoryFound) {
    notFound();
  }
  const categoryKey = slugify(categoryFound.title);
  const localizedCategory = categoryCopy[categoryKey] ?? null;
  const localizedCategoryTitle = localizedCategory?.title ?? categoryFound.title;
  const localizedCategoryDescription =
    localizedCategory?.description ?? categoryFound.description;

  return (
    <main
      className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter pt-16"
      style={{ scrollPaddingTop: "40px" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <BackButton />

        {/* Category Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            {localizedCategoryTitle}
          </h1>
          <p className="text-gray-700 font-light dark:text-gray-300 mt-2">
            {localizedCategoryDescription}
          </p>
        </header>

        {/* List of Subcategories */}
        {categoryFound.subcategories && categoryFound.subcategories.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryFound.subcategories.map((subcat, index) => {
              // Slugify subcategory title
              const subcatSlug = slugify(subcat.title);
              
              // Construct the link path
              const basePath = categoryFound.link 
                ? (categoryFound.link.endsWith('/') ? categoryFound.link.slice(0, -1) : categoryFound.link)
                : `/products/${categorySlug}`;
              const linkHref = `${basePath}/${subcatSlug}`;
          
              return (
                <Link key={index} href={linkHref}>
                  <GridPatternCard className="h-full group hover:shadow-md transition-all duration-300">
                    <GridPatternCardBody className="h-full">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-cyan-700">
                        {localizedCategory?.subcategories?.[subcatSlug]?.title ?? subcat.title}
                      </h2>
                      <p className="mt-2 text-gray-600 font-raleway text-sm dark:text-gray-300">
                        {localizedCategory?.subcategories?.[subcatSlug]?.description ?? subcat.description}
                      </p>
                    </GridPatternCardBody>
                  </GridPatternCard>
                </Link>
              );
            })}
          </section>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No subcategories available.</p>
        )}
      </div>
    </main>
  );
}
