"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import SanityImage from "@/app/components/SanityImage";

interface ProductGalleryLabels {
  openImage: string;
  closeImage: string;
  previousImage: string;
  nextImage: string;
  image: string;
  of: string;
}

interface ProductGalleryProps {
  images: string[];
  title: string;
  labels: ProductGalleryLabels;
}

export default function ProductGallery({
  images,
  title,
  labels,
}: ProductGalleryProps) {
  const safeImages = Array.from(new Set(images.filter(Boolean)));
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const activeImage = safeImages[activeIndex] || safeImages[0];
  const hasMultiple = safeImages.length > 1;

  const goPrev = () =>
    setActiveIndex((index) =>
      (index - 1 + safeImages.length) % safeImages.length,
    );
  const goNext = () =>
    setActiveIndex((index) => (index + 1) % safeImages.length);

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  if (!activeImage) return null;

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="order-1 min-w-0 flex-1 sm:order-2">
          <button
            type="button"
            onClick={openDialog}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDialog();
              }
            }}
            aria-label={`${labels.openImage}: ${title}`}
            className="group relative block aspect-[4/3] w-full min-w-0 overflow-hidden border border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink)] active:bg-[var(--color-paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <SanityImage
              src={activeImage}
              alt={`${title} — ${labels.image} ${activeIndex + 1}`}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) 58vw, 52vw"
              className="object-contain p-5 sm:p-9"
            />
            <span className="absolute bottom-0 right-0 inline-flex min-h-11 items-center gap-2 border-l border-t border-[var(--color-rule)] bg-[var(--color-surface)] px-3 text-xs font-semibold text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)] group-hover:bg-[var(--color-ink)] group-hover:text-[var(--color-paper)]">
              <Expand className="h-4 w-4" aria-hidden="true" />
              <span className="whitespace-nowrap">{labels.openImage}</span>
            </span>
          </button>

          {hasMultiple && (
            <div className="mt-2 flex items-center justify-between text-xs font-medium tabular-nums text-[var(--color-muted)]">
              <span>
                {labels.image} {activeIndex + 1} {labels.of} {safeImages.length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={labels.previousImage}
                  className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink)] transition-colors duration-[var(--dur-short)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] active:bg-[var(--color-ink-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={labels.nextImage}
                  className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink)] transition-colors duration-[var(--dur-short)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] active:bg-[var(--color-ink-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>

        {hasMultiple && (
          <div className="order-2 hidden max-h-[34rem] flex-col gap-2 overflow-y-auto sm:order-1 sm:flex">
            {safeImages.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${labels.image} ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 bg-[var(--color-surface)] transition-colors duration-[var(--dur-short)] active:border-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 ${
                  index === activeIndex
                    ? "border-[var(--color-accent)]"
                    : "border-[var(--color-rule)] hover:border-[var(--color-rule-strong)]"
                }`}
              >
                <SanityImage
                  src={image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {safeImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${labels.image} ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 bg-[var(--color-surface)] active:border-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 ${
                index === activeIndex
                  ? "border-[var(--color-accent)]"
                  : "border-[var(--color-rule)]"
              }`}
            >
              <SanityImage
                src={image}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`${title} — ${labels.openImage}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") closeDialog();
          if (event.key === "ArrowLeft" && hasMultiple) goPrev();
          if (event.key === "ArrowRight" && hasMultiple) goNext();
        }}
        className="pdp-image-dialog fixed inset-0 z-[var(--z-modal)] m-auto w-[calc(100%-2rem)] max-w-6xl border border-[var(--color-rule-strong)] bg-[var(--color-paper)] p-0 text-[var(--color-ink)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-rule)] px-4 py-3">
          <p className="min-w-0 truncate pr-4 text-sm font-semibold">{title}</p>
          <button
            type="button"
            onClick={closeDialog}
            aria-label={labels.closeImage}
            className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center border border-[var(--color-rule)] bg-[var(--color-surface)] transition-colors duration-[var(--dur-short)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] active:bg-[var(--color-ink-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="relative h-[min(72dvh,52rem)] min-h-[18rem] bg-[var(--color-surface)]">
          <SanityImage
            src={activeImage}
            alt={`${title} — ${labels.image} ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) calc(100vw - 32px), 1152px"
            className="object-contain p-5 sm:p-10"
          />
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label={labels.previousImage}
                className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)] transition-colors duration-[var(--dur-short)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] active:bg-[var(--color-ink-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={labels.nextImage}
                className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)] transition-colors duration-[var(--dur-short)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] active:bg-[var(--color-ink-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
        <p className="border-t border-[var(--color-rule)] px-4 py-3 text-center text-xs font-medium tabular-nums text-[var(--color-muted)]">
          {labels.image} {activeIndex + 1} {labels.of} {safeImages.length}
        </p>
      </dialog>
    </div>
  );
}
