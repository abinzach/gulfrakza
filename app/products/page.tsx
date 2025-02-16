/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import Link from "next/link";
import data from "../Product_Categories.json";
import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-ellipsis-pattern";
import BackButton from "../components/BackButton";
import Image from "next/image";

// Define TypeScript interfaces for our data structure
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

// Utility function to create a URL-friendly slug from a string.
function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

const ProductsPage: React.FC = () => {
  const { categories } = data as CategoriesData;

  return (
    <main
      className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter pt-24"
      style={{ scrollPaddingTop: "80px" }}
    >  
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <BackButton />
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Products
          </h1>
          <p className="mt-4  text-gray-700 font-light dark:text-gray-300">
            Explore our categories and subcategories to discover our wide range
            of industrial products and solutions.
          </p>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <GridPatternCard
              key={index}
              className=""
            >
              <GridPatternCardBody>
              <div className="flex items-center gap-4">
                <Image height={64} width={64} 
                  src={category.imageSrc}
                  alt={category.title + " image"}
                  className="h-16 w-16 object-cover rounded"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {category.title}
                  </h2>
                  <p className="text-gray-700 font-raleway text-sm dark:text-gray-300">
                    {category.description}
                  </p>
                </div>
              </div>
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="mt-4">
                  {/* <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    Categories
                  </h3> */}
                  <ul className="space-y-2">
                    {category.subcategories.map((subcat, subIndex) => {
                      // Create slugs for category and subcategory
                      const categorySlug = slugify(category.title);
                      const subcatSlug = slugify(subcat.title);
                      // Use the category link from JSON if provided,
                      // otherwise generate based on slug.
                      const linkHref = category.link
                        ? `${category.link}/${subcatSlug}`
                        : `/products/${categorySlug}/${subcatSlug}`;
                      return (
                        <li key={subIndex}>
                          <Link href={linkHref}>
                            <p className="text-cyan-600 text-sm transition-all duration-300 dark:text-cyan-400 hover:underline">
                              {subcat.title}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              </GridPatternCardBody>
            </GridPatternCard>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
