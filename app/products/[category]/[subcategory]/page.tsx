/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";
import data from "../../../Product_Categories.json";
import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-ellipsis-pattern";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

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

// Include searchParams in the props
interface PageProps {
  params: { category: string; subcategory: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate static params for each subcategory page
export async function generateStaticParams() {
  const categoriesData = data as CategoriesData;
  const paths: { category: string; subcategory: string }[] = [];
  categoriesData.categories.forEach((cat) => {
    if (cat.subcategories) {
      cat.subcategories.forEach((subcat) => {
        const categorySlug = cat.title.toLowerCase().replace(/\s+/g, '-');
        const subcategorySlug = subcat.title.toLowerCase().replace(/\s+/g, '-');
        paths.push({ category: categorySlug, subcategory: subcategorySlug });
      });
    }
  });
  return paths;
}

// Mark the component as async so Next.js correctly unwraps the props.
export default async function SubcategoryPage({ params }: PageProps) {
  const { category: categorySlug, subcategory: subcategorySlug } = params;
  const categoriesData = data as CategoriesData;
  let categoryFound: Category | null = null;
  let subcategoryFound: Subcategory | null = null;

  // Find the matching category and subcategory using simple slugification
  for (const cat of categoriesData.categories) {
    const catSlug = cat.title.toLowerCase().replace(/\s+/g, '-');
    if (catSlug === categorySlug) {
      categoryFound = cat;
      if (cat.subcategories) {
        for (const subcat of cat.subcategories) {
          const subcatSlug = subcat.title.toLowerCase().replace(/\s+/g, '-');
          if (subcatSlug === subcategorySlug) {
            subcategoryFound = subcat;
            break;
          }
        }
      }
      break;
    }
  }

  if (!categoryFound || !subcategoryFound) {
    notFound();
  }

  return (
    <main
      className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter pt-16"
      style={{ scrollPaddingTop: "40px" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <BackButton />

        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            {subcategoryFound.title}
          </h1>
          <p className="text-gray-700 font-light dark:text-gray-300 mt-2">
            {subcategoryFound.description}
          </p>
          <Badge className="mt-2 text-sm ">
            {categoryFound.title}
          </Badge>
        </header>

        {/* Grid of Products */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subcategoryFound.items.map((item, index) => (
            <GridPatternCard key={index}>
              <GridPatternCardBody>
                <Image height={160} width={480} 
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded"
                />
                <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-gray-600 font-raleway text-sm dark:text-gray-300">
                  {item.description}
                </p>
                <Link href={item.link}>
                  <p className="mt-4 text-sm inline-block text-blue-600 dark:text-blue-400 hover:underline">
                    Learn More &rarr;
                  </p>
                </Link>
              </GridPatternCardBody>
            </GridPatternCard>
          ))}
        </section>
      </div>
    </main>
  );
}
