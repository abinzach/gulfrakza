"use client";

import { useTranslations } from "@/i18n/provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GetQuote from "./GetQuote";

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
  const t = useTranslations("common.nav");

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="default"
        className="w-full bg-cyan-600 text-sm font-medium text-white hover:bg-cyan-700"
      >
        {t("getQuote")}
      </Button>

      <GetQuote
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialProduct={{
          name: productName,
          category: productCategory,
          subcategory: productSubcategory,
          itemCategory: productItemCategory,
        }}
      />
    </>
  );
}
