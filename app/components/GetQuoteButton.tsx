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
        className="min-h-12 w-full whitespace-nowrap rounded-none border border-[var(--color-accent-strong)] bg-[var(--color-accent-strong)] px-5 text-sm font-semibold text-[var(--color-accent-ink)] transition-colors duration-[var(--dur-short)] hover:bg-[var(--color-ink)] active:bg-[var(--color-ink-2)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
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
