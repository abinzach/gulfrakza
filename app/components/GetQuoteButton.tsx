"use client";

import { useState } from "react";
import GetQuote from "./GetQuote";

interface GetQuoteButtonProps {
  productName: string;
  productCategory: string;
  productSubcategory: string;
}

export default function GetQuoteButton({
  productName,
  productCategory,
  productSubcategory,
}: GetQuoteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <p 
        onClick={handleOpenModal}
        className="mt-4 text-sm inline-block text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
      >
        Get Quote &rarr;
      </p>
      
      <GetQuote 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        initialProduct={{
          name: productName,
          category: productCategory,
          subcategory: productSubcategory
        }}
      />
    </>
  );
} 