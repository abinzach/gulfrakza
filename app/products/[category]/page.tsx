/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import data from "../../Product_Categories.json";
import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-ellipsis-pattern";

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

interface PageProps {
  params: { category: string };
}

export default function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = params;
  const categoriesData = data as CategoriesData;
  let categoryFound: Category | null = null;

  // Find the matching category using simple slugification:
  // Convert title to lowercase and replace spaces with hyphens.
  for (const cat of categoriesData.categories) {
    const catSlug = cat.title.toLowerCase().replace(/\s+/g, '-');
    if (catSlug === categorySlug) {
      categoryFound = cat;
      break;
    }
  }

  // If no matching category is found, return a 404
  if (!categoryFound) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter pt-16"
    style={{ scrollPaddingTop: "40px" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <BackButton />

        {/* Category Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            {categoryFound.title}
          </h1>
          <p className=" text-gray-700 font-light  dark:text-gray-300 mt-2">
            {categoryFound.description}
          </p>
        </header>

        {/* List of Subcategories */}
        {categoryFound.subcategories && categoryFound.subcategories.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryFound.subcategories.map((subcat, index) => {
              // Create a slug for the subcategory title
              const subcatSlug = subcat.title.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link key={index} href={`${categoryFound.link}/${subcatSlug}`}>
                  <GridPatternCard className="h-full group hover:shadow-md transition-all duration-300">
                    <GridPatternCardBody className="h-full">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white transition-colors duration-300 group-hover:text-blue-600">
                      {subcat.title}
                    </h2>
                    <p className="mt-2 text-gray-600 font-raleway text-sm dark:text-gray-300">
                      {subcat.description}
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

