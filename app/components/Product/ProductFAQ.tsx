"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

interface ProductFAQProps {
  items: FAQItem[];
}

export default function ProductFAQ({ items }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <li key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 bg-white px-4 py-4 text-left transition hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 sm:text-base">
                {item.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid overflow-hidden bg-gray-50/50 transition-all duration-200 dark:bg-gray-800/40 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="px-4 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
