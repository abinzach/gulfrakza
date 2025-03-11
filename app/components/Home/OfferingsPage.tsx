/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import Link from 'next/link';
import data from '../../Product_Categories.json';
import Image from 'next/image';

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
    <section className="lg:py-32 py-10 font-inter bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4  text-center lg:text-left">
        <h2 className="lg:text-5xl text-4xl font-semibold text-center lg:text-left lg:mb-4">
          Empower your operations with
        </h2>
        <h2 className="lg:text-5xl text-4xl font-semibold text-cyan-600 text-center lg:text-left mb-4 ">
          our state-of-the-art solutions
        </h2>
        <p className="text-center lg:text-left text-lg max-w-2xl text-gray-800 mb-12">
          From safety equipment to hydraulic systems, we offer a comprehensive selection of products tailored to meet your industrial needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Link key={index} href={category.link}>
             
                <div className="bg-white h-full dark:bg-gray-950 cursor-pointer p-6 rounded border-dashed border-gray-500 border hover:shadow-lg transition-shadow duration-300 group">
                  <Image
                    width={64}
                    height={64}
                    src={category.imageSrc}
                    alt={category.title}
                    className="h-16 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold font-raleway mb-2 text-left uppercase group-hover:text-cyan-600 transition-colors duration-300">
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
