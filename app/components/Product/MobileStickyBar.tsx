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
  anchorId?: string;
  sentinelId?: string;
}

export default function MobileStickyBar({
  imageSrc,
  title,
  productName,
  productCategory,
  productSubcategory,
  productItemCategory,
  anchorId = "pdp-primary-quote",
  sentinelId = "pdp-sticky-sentinel",
}: MobileStickyBarProps) {
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [sentinelPassed, setSentinelPassed] = useState(false);

  useEffect(() => {
    const quotePanel = document.getElementById(anchorId);
    const sentinel = document.getElementById(sentinelId);
    if (!quotePanel || !sentinel) return;

    const quoteObserver = new IntersectionObserver(
      ([entry]) => {
        setQuoteVisible(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    const sentinelObserver = new IntersectionObserver(
      ([entry]) => {
        setSentinelPassed(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
      },
      { threshold: 0 },
    );

    quoteObserver.observe(quotePanel);
    sentinelObserver.observe(sentinel);
    return () => {
      quoteObserver.disconnect();
      sentinelObserver.disconnect();
    };
  }, [anchorId, sentinelId]);

  const visible = sentinelPassed && !quoteVisible;

  return (
    <div
      className={`pdp-motion fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-[var(--color-rule-strong)] bg-[var(--color-paper)] px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 transition-transform duration-[var(--dur-short)] lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden border border-[var(--color-rule)] bg-[var(--color-surface)]">
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
        <p className="line-clamp-2 min-w-0 flex-1 text-xs font-medium text-[var(--color-ink)]">
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
