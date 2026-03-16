"use client";

import { useTranslations } from "@/i18n/provider";
import { motion } from "framer-motion";

const stats = [
  { value: "500+", labelKey: "products" },
  { value: "5", labelKey: "services" },
  { value: "36+", labelKey: "brands" },
  { value: "KSA", labelKey: "coverage" },
] as const;

export default function StatsSection() {
  const t = useTranslations("home.stats");

  return (
    <section className="bg-black" dir="ltr" aria-label="Key statistics">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col items-center py-12 px-4 text-center"
            >
              <span className="font-inter text-5xl font-semibold tracking-tight text-white md:text-6xl">
                {stat.value}
              </span>
              <span className="mt-2 font-inter text-[10px] font-medium tracking-[0.18em] uppercase text-white/35">
                {t(stat.labelKey)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
