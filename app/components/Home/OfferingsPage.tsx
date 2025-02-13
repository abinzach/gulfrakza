// pages/offerings.tsx
import React from 'react';
import Link from 'next/link';
import data from '../../Product_Categories.json';

interface Item {
  title: string;
  description: string;
  link: string;
  imageSrc: string;
  specs?: { [key: string]: any };
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

const OfferingsPage: React.FC = () => {
  const { categories } = data as CategoriesData;

  return (
    <section className="py-32 font-inter bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-semibold text-left mb-4">
          Empower your operations with
        </h2>
        <h2 className="text-5xl font-semibold text-blue-600 text-left mb-4">
          our state-of-the-art solutions
        </h2>
        <p className="text-left text-lg max-w-2xl text-gray-800 mb-12">
          From safety equipment to hydraulic systems, we offer a comprehensive selection of products tailored to meet your industrial needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Link key={index} href={category.link}>
             
                <div className="bg-white h-full dark:bg-gray-950 cursor-pointer p-6 rounded border-dashed border-gray-500 border hover:shadow-lg transition-shadow duration-300 group">
                  <img
                    src={category.imageSrc}
                    alt={category.title}
                    className="h-16 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2 text-left group-hover:text-blue-600 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 font-raleway text-left">
                    {category.description}
                  </p>
                </div>
              
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferingsPage;
