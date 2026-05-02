"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  title: string;
  brand?: string | null;
  stockBadge?: {
    label: string;
    available: boolean;
  };
}

export default function ProductGallery({
  images,
  title,
  brand,
  stockBadge,
}: ProductGalleryProps) {
  const safeImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const activeImage = safeImages[activeIndex] || safeImages[0];
  const hasMultiple = safeImages.length > 1;

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % safeImages.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {hasMultiple && (
          <div className="order-2 hidden flex-col gap-2 sm:flex sm:max-h-[560px] sm:overflow-y-auto sm:order-1">
            {safeImages.map((img, idx) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-white transition dark:bg-gray-900 ${
                  idx === activeIndex
                    ? "border-[#08778c] ring-2 ring-[#0bbfe0]/30"
                    : "border-gray-200 hover:border-[#67e8f9] dark:border-gray-700"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}

        <div className="relative order-1 flex-1 sm:order-2">
          <div
            className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-gray-900"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            {brand && (
              <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-700 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200">
                {brand}
              </span>
            )}

            {stockBadge && (
              <span
                className={`absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
                  stockBadge.available
                    ? "border border-emerald-200 bg-emerald-50/90 text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "border border-amber-200 bg-amber-50/90 text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/40 dark:text-amber-300"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    stockBadge.available ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {stockBadge.label}
              </span>
            )}

            <span className="pointer-events-none absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
              <ZoomIn className="h-3 w-3" />
              Hover to zoom
            </span>

            {activeImage && (
              <Image
                src={activeImage}
                alt={title}
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 45vw"
                className={`object-contain p-6 transition-transform duration-200 sm:p-10 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }
                    : undefined
                }
              />
            )}

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-[#08778c] dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-[#08778c] dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {hasMultiple && (
            <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              {activeIndex + 1} / {safeImages.length}
            </div>
          )}
        </div>
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {safeImages.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-white ${
                idx === activeIndex
                  ? "border-[#08778c]"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
