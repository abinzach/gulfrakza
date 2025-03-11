/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/app/components/BackButton";
import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-ellipsis-pattern";
import { Badge } from "@/components/ui/badge";
import data from "../../../Product_Categories.json";

// Data interfaces
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

// Generate static params for all category/subcategory combinations
export async function generateStaticParams() {
  const categoriesData = data as CategoriesData;
  const paramsArray: { category: string; subcategory: string }[] = [];

  for (const category of categoriesData.categories) {
    const categorySlug = slugify(category.title);

    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        const subcategorySlug = slugify(subcategory.title);
        paramsArray.push({ category: categorySlug, subcategory: subcategorySlug });
      }
    }
  }

  return paramsArray;
}

// Main Page component
export default function SubcategoryPage({
  params
}: {
  params: { category: string, subcategory: string };
}) {
  const { category: categorySlug, subcategory: subcategorySlug } = params;
  const categoriesData = data as CategoriesData;

  // Locate the matching category/subcategory
  let categoryFound: Category | null = null;
  let subcategoryFound: Subcategory | null = null;

  try {
    // Find the category
    for (const cat of categoriesData.categories) {
      const catSlug = slugify(cat.title);
      if (catSlug === categorySlug) {
        categoryFound = cat;
        
        // Find the subcategory
        if (cat.subcategories) {
          for (const subcat of cat.subcategories) {
            const subcatSlug = slugify(subcat.title);
            if (subcatSlug === subcategorySlug) {
              subcategoryFound = subcat;
              break;
            }
          }
        }
        break;
      }
    }

    // Show 404 if not found
    if (!categoryFound || !subcategoryFound) {
      notFound();
    }
  } catch (error) {
    console.error("Error processing product data:", error);
    notFound();
  }

  return (
    <main
      className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter pt-16"
      style={{ scrollPaddingTop: "40px" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            {subcategoryFound.title}
          </h1>
          <p className="text-gray-700 font-light dark:text-gray-300 mt-2">
            {subcategoryFound.description}
          </p>
          <Badge className="mt-2 text-sm bg-cyan-700">{categoryFound.title}</Badge>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subcategoryFound.items && subcategoryFound.items.length > 0 ? (
            subcategoryFound.items.map((item, index) => (
              <GridPatternCard key={index}>
                <GridPatternCardBody>
                  <Image
                    src={item.imageSrc || "/logo-rakza.png"}
                    alt={item.title}
                    width={580}
                    height={360}
                    className="w-full h-48 object-cover rounded"
                  
                  />
                  <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-gray-600 font-raleway text-sm dark:text-gray-300">
                    {item.description}
                  </p>
                  <Link href={"#"}>
                    <p className="mt-4 text-sm inline-block text-blue-600 dark:text-blue-400 hover:underline">
                      Learn More &rarr;
                    </p>
                  </Link>
                </GridPatternCardBody>
              </GridPatternCard>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300 col-span-2">No items available in this subcategory.</p>
          )}
        </section>
      </div>
    </main>
  );
}