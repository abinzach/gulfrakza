"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import GetQuoteButton from "@/app/components/GetQuoteButton";

interface MobileStickyBarProps {
  imageSrc: string;
  title: string;
  productName: string;
  productCategory: string;
  productSubcategory: string;
  productItemCategory: string;
}

export default function MobileStickyBar({
  imageSrc,
  title,
  productName,
  productCategory,
  productSubcategory,
  productItemCategory,
}: MobileStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after the user has scrolled past ~600px (past the hero CTA)
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur transition-transform duration-300 dark:border-gray-700 dark:bg-gray-900/95 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="48px"
              className="object-contain p-1"
            />
          )}
        </div>
        <p className="line-clamp-2 flex-1 text-xs font-medium text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <div className="flex-shrink-0">
          <GetQuoteButton
            productName={productName}
            productCategory={productCategory}
            productSubcategory={productSubcategory}
            productItemCategory={productItemCategory}
          />
        </div>
      </div>
    </div>
  );
}
