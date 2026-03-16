"use client";

import { useTranslations } from "@/i18n/provider";
import React from "react";
import { Link } from "@/navigation";

export default function HeroSection() {
  const t = useTranslations("home.hero");

  const trustItems = [
    t("trust1"),
    t("trust2"),
    t("trust3"),
    t("trust4"),
  ];

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      role="banner"
      aria-label={t("ariaLabel")}
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source
          src="https://ik.imagekit.io/l3eswz12s/Gulf%20Rakza/hero_vid?updatedAt=1739108938597"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        {/* Eyebrow label */}
        <p className="mb-6 font-inter text-xs font-medium tracking-[0.25em] uppercase text-white/50">
          {t("eyebrow")}
        </p>

        {/* Main headline */}
        <h1 className="mb-6 max-w-4xl font-inter text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-[4.5rem]">
          {t("headline")}
        </h1>

        {/* Description */}
        <p className="mb-10 max-w-xl font-raleway text-base leading-relaxed text-white/65 md:text-lg">
          {t("description")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-white/90"
          >
            {t("primaryCta")}
          </Link>
          <a
            href="#contact-us"
            className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-white/60 hover:bg-white/10"
          >
            {t("secondaryCta")}
          </a>
        </div>
      </div>

      {/* Bottom trust strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center divide-x divide-white/15 px-6 py-3.5">
          {trustItems.map((item) => (
            <span
              key={item}
              className="px-5 py-1 font-inter text-xs font-medium tracking-wider text-white/50"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
