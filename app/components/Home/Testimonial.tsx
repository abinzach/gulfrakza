"use client";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
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
  const [reduceMotion, setReduceMotion] = useState(false);
  const [paused, setPaused] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mediaQuery.matches);
    update();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }
    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  const autoplay = !reduceMotion && !paused;

  useEffect(() => {
    if (!autoplay) return;
    if (testimonials.length <= 1) return;

    const id = window.setInterval(() => {
      setSelected((current) => (current === testimonials.length - 1 ? 0 : current + 1));
    }, 8000);

    return () => window.clearInterval(id);
  }, [autoplay, testimonials.length]);

  return (
    <section
      className="grid grid-cols-1 items-center gap-8 overflow-hidden bg-white px-4 py-24 lg:grid-cols-2 lg:gap-4 lg:px-8"
      dir={isRTL ? "rtl" : "ltr"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="p-4">
        <h3 className="font-inter text-5xl font-semibold">{t("sectionHeading")}</h3>
        <p className="my-4 font-inter text-slate-500">{t("sectionDescription")}</p>
        <SelectBtns
          numTracks={testimonials.length}
          setSelected={setSelected}
          selected={selected}
          autoplay={autoplay}
        />
      </div>
      <Cards
        testimonials={testimonials}
        setSelected={setSelected}
        selected={selected}
        isRTL={isRTL}
        reduceMotion={reduceMotion}
      />
    </section>
  );
};

const SelectBtns = ({
  numTracks,
  setSelected,
  selected,
  autoplay,
}: {
  numTracks: number;
  setSelected: Dispatch<SetStateAction<number>>;
  selected: number;
  autoplay: boolean;
}) => {
  return (
    <div className="mt-8 flex gap-1">
      {Array.from({ length: numTracks }).map((_, n) => (
        <button
          key={n}
          type="button"
          onClick={() => setSelected(n)}
          className="relative h-11 w-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08778c]"
          aria-label={`Testimonial ${n + 1}`}
          aria-current={selected === n ? "true" : undefined}
        >
          <span className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 bg-slate-300" />
          {selected === n ? (
            <span
              className="testimonial-progress absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 bg-slate-950"
              style={{ animationPlayState: autoplay ? "running" : "paused" }}
              onAnimationEnd={() => {
                // no-op; autoplay is handled by interval in parent to support pause-on-hover/focus
              }}
              aria-hidden="true"
            />
          ) : (
            <span
              className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 bg-slate-950"
              style={{ transform: selected > n ? "scaleX(1)" : "scaleX(0)" }}
              aria-hidden="true"
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
  reduceMotion,
}: {
  testimonials: Testimonial[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  isRTL: boolean;
  reduceMotion: boolean;
}) => {
  return (
    <div
      className="relative h-[450px] p-4 shadow-xl lg:h-[500px]"
      aria-live="polite"
      aria-atomic="true"
    >
      {testimonials.map((testimonial, index) => (
        <Card
          key={`${testimonial.name}-${index}`}
          {...testimonial}
          position={index}
          selected={selected}
          setSelected={setSelected}
          isRTL={isRTL}
          reduceMotion={reduceMotion}
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
  reduceMotion,
}: Testimonial & {
  position: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  isRTL: boolean;
  reduceMotion: boolean;
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
      transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
      onClick={() => setSelected(position)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setSelected(position);
        }
      }}
      className="absolute inset-0 flex min-h-full w-full cursor-pointer flex-col justify-between p-8 outline-none focus-visible:ring-2 focus-visible:ring-[#08778c] lg:p-12"
      dir={isRTL ? "rtl" : "ltr"}
      role="button"
      tabIndex={position === selected ? 0 : -1}
      aria-hidden={position !== selected}
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
