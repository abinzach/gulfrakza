"use client";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useTranslations } from "@/i18n/provider";
import React from "react";

export default function HeroSection() {
  const t = useTranslations("home.hero");
  const misc = useTranslations("common.misc");

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      role="banner"
      aria-label={t("ariaLabel")}
    >
      <video
        className="absolute top-0 left-0 h-full w-full object-cover"
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
        {misc("videoFallback")}
      </video>

      <noscript>
        <div className="absolute left-0 top-0 h-full w-full">
          <div className="h-full w-full bg-gray-800" />
        </div>
      </noscript>

      <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-4 text-4xl font-semibold md:text-5xl">
          <span className="font-light">{t("titlePrefix")}</span>{" "}
          {t("titleMid1")}{" "}
          <span className="font-light">{t("titleMid2")}</span>{" "}
         {t("titleSuffix")}
        </h1>
        <p className="max-w-2xl text font-raleway md:text-lg">{t("description")}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-4">
          <InteractiveHoverButton text={t("primaryCta")} />
          <a
            href="#contact-us"
            className="inline-block rounded-full border-2 px-6 py-3 text-white transition-all duration-300 hover:bg-black"
            title={misc("contactTitle")}
          >
            {t("secondaryCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
