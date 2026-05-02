"use client";

import { useTranslations } from "@/i18n/provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GetQuote from "./GetQuote";
import { trackEvent } from "./analytics-events";

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
        onClick={() => {
          trackEvent("quote_modal_open", {
            source: "product_detail",
            product_category: productCategory,
          });
          setIsModalOpen(true);
        }}
        variant="default"
        className="w-full bg-[#08778c] text-sm font-medium text-white hover:bg-[#0f5f70]"
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
