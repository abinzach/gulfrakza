"use client";

import { useState } from "react";
import GetQuote from "./GetQuote";
import { Button } from "@/components/ui/button";

interface GetQuoteButtonProps {
  productName: string;
  productCategory: string;
  productSubcategory: string;
  productItemCategory: string;
}

export default function GetQuoteButton({
  productName,
  productCategory,
  productSubcategory,
  productItemCategory,
}: GetQuoteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        variant="default"
        className="w-full bg-cyan-600 text-sm font-medium text-white hover:bg-cyan-700"
      >
        Get Quote
      </Button>
      
      <GetQuote 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        initialProduct={{
          name: productName,
          category: productCategory,
          subcategory: productSubcategory,
          itemCategory: productItemCategory
        }}
      />
    </>
  );
} 