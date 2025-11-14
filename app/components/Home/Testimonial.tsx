"use client";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useLocale, useMessages, useTranslations } from "@/i18n/provider";

interface Testimonial {
  rating: string;
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
    if (!messages || typeof messages !== "object") {
      return [];
    }

    const homeSection = (messages as Record<string, unknown>).home;
    if (!homeSection || typeof homeSection !== "object") {
      return [];
    }

    const testimonialSection = (homeSection as Record<string, unknown>).testimonials;
    if (!testimonialSection || typeof testimonialSection !== "object") {
      return [];
    }

    const items = (testimonialSection as Record<string, unknown>).items;
    return Array.isArray(items) ? (items as Testimonial[]) : [];
  }, [messages]);

  return (
    <section
      className="grid grid-cols-1 items-center gap-8 overflow-hidden bg-white px-4 py-24 lg:grid-cols-2 lg:gap-4 lg:px-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="p-4">
        <h3 className="font-inter text-5xl font-semibold">{t("sectionHeading")}</h3>
        <p className="my-4 font-inter text-slate-500">{t("sectionDescription")}</p>
        <SelectBtns numTracks={testimonials.length} setSelected={setSelected} selected={selected} />
      </div>
      <Cards testimonials={testimonials} setSelected={setSelected} selected={selected} isRTL={isRTL} />
    </section>
  );
};

const SelectBtns = ({
  numTracks,
  setSelected,
  selected,
}: {
  numTracks: number;
  setSelected: Dispatch<SetStateAction<number>>;
  selected: number;
}) => {
  return (
    <div className="mt-8 flex gap-1">
      {Array.from({ length: numTracks }).map((_, n) => (
        <button
          key={n}
          onClick={() => setSelected(n)}
          className="relative h-1.5 w-full bg-slate-300"
          aria-label={`Testimonial ${n + 1}`}
        >
          {selected === n ? (
            <motion.span
              className="absolute inset-0 bg-slate-950"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5 }}
              onAnimationComplete={() => {
                setSelected(selected === numTracks - 1 ? 0 : selected + 1);
              }}
            />
          ) : (
            <span
              className="absolute inset-0 bg-slate-950"
              style={{ width: selected > n ? "100%" : "0%" }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

const Cards = ({
  testimonials,
  selected,
  setSelected,
  isRTL,
}: {
  testimonials: Testimonial[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  isRTL: boolean;
}) => {
  return (
    <div className="relative h-[450px] p-4 shadow-xl lg:h-[500px]">
      {testimonials.map((testimonial, index) => (
        <Card
          key={`${testimonial.name}-${index}`}
          {...testimonial}
          position={index}
          selected={selected}
          setSelected={setSelected}
          isRTL={isRTL}
        />
      ))}
    </div>
  );
};

const Card = ({
  rating,
  headline,
  description,
  name,
  title,
  position,
  selected,
  setSelected,
  isRTL,
}: Testimonial & {
  position: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  isRTL: boolean;
}) => {
  const scale = position <= selected ? 1 : 1 + 0.015 * (position - selected);
  const directionMultiplier = isRTL ? -1 : 1;
  const offset =
    position <= selected ? 0 : directionMultiplier * (95 + (position - selected) * 3);
  const isDark = position % 2 === 1;
  const hoverShift = position === selected ? 0 : isRTL ? 3 : -3;
  const transformOrigin = isRTL ? "right bottom" : "left bottom";
  const headingAlignClass = isRTL ? "text-right" : "text-left";

  return (
    <motion.div
      initial={false}
      style={{
        zIndex: position,
        transformOrigin,
        background: isDark ? "black" : "white",
        color: isDark ? "white" : "black",
      }}
      animate={{ x: `${offset}%`, scale }}
      whileHover={{ translateX: hoverShift }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => setSelected(position)}
      className="absolute inset-0 flex min-h-full w-full cursor-pointer flex-col justify-between p-8 lg:p-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={`mt-4 ${headingAlignClass}`}>
        <p className="text-xl font-bold">{rating}</p>
        <p className="text-xl font-semibold">{headline}</p>
      </div>
      <p className="my-8 text-lg font-light italic lg:text-xl">&quot;{description}&quot;</p>
      <div>
        <span className="block text-lg font-semibold">{name}</span>
        <span className="block text-sm">{title}</span>
      </div>
    </motion.div>
  );
};

export default StackedCardTestimonials;
