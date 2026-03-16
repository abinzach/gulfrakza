"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { useLocale, useMessages, useTranslations } from "@/i18n/provider";

interface Testimonial {
  headline: string;
  description: string;
  name: string;
  title: string;
}

const StackedCardTestimonials = () => {
  const [selected, setSelected] = useState(0);
  const t = useTranslations("home.testimonials");
  const messages = useMessages();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const testimonials = useMemo<Testimonial[]>(() => {
    if (!messages || typeof messages !== "object") return [];
    const homeSection = (messages as Record<string, unknown>).home;
    if (!homeSection || typeof homeSection !== "object") return [];
    const testimonialSection = (homeSection as Record<string, unknown>).testimonials;
    if (!testimonialSection || typeof testimonialSection !== "object") return [];
    const items = (testimonialSection as Record<string, unknown>).items;
    return Array.isArray(items) ? (items as Testimonial[]) : [];
  }, [messages]);

  // Auto-advance
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setTimeout(() => {
      setSelected((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [selected, testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[selected];

  return (
    <section
      className="bg-white py-24 font-inter lg:py-32"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Eyebrow */}
        <p className="mb-12 text-xs font-medium tracking-[0.2em] uppercase text-gray-400">
          {t("sectionHeading")}
        </p>

        {/* Quote area */}
        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              {/* Stars */}
              <p className="mb-6 text-base tracking-wider text-[#111]">
                {t("rating")}
              </p>

              {/* Quote */}
              <blockquote className="mb-8 max-w-2xl text-xl font-light leading-relaxed text-[#111] md:text-2xl">
                &ldquo;{current.description}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div>
                <p className="font-inter text-sm font-semibold text-[#111]">
                  {current.name}
                </p>
                <p className="mt-1 font-inter text-xs text-[#6b6b6b]">
                  {current.title}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="mt-12 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === selected
                  ? "w-8 bg-[#111]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackedCardTestimonials;
