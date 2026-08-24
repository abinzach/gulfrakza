"use client";

import { useLocale, useTranslations } from "@/i18n/provider";
import { Link } from "@/navigation.client";
import { trackEvent } from "@/app/components/analytics-events";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const t = useTranslations("home.hero");
  const misc = useTranslations("common.misc");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section
      className="relative min-h-[720px] w-full overflow-hidden bg-neutral-950 md:h-[100svh]"
      aria-label={t("ariaLabel")}
    >
      <Image
        src="/images/services/hero-1.avif"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute left-0 top-0 h-full w-full object-cover object-center"
      />

      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.68)_42%,rgba(0,0,0,0.34)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.14)_28%,rgba(0,0,0,0.68)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[720px] w-full max-w-7xl items-center px-4 pb-12 pt-32 text-white sm:px-6 lg:h-[100svh] lg:px-8 lg:pt-28">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className={isRTL ? "text-right" : "text-left"}>
            <p className="mb-5 inline-flex border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#d8f7ff] backdrop-blur">
              {t("eyebrow")}
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-normal text-white sm:text-5xl lg:text-6xl">
              {t("h1")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {t("description")}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                onClick={() => trackEvent("hero_primary_cta_click", { target: "products" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap bg-white px-6 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-black/20 transition-colors hover:bg-[#eefcff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:translate-y-px"
              >
                {t("primaryCta")}
                <ArrowRight className={isRTL ? "h-4 w-4 rotate-180" : "h-4 w-4"} aria-hidden="true" />
              </Link>
              <a
                href="#contact-us"
                onClick={() => trackEvent("hero_secondary_cta_click", { target: "contact" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:translate-y-px"
                title={misc("contactTitle")}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {t("secondaryCta")}
              </a>
            </div>

            <p className="mt-5 text-sm font-medium text-[#d8f7ff]/90">{t("supportLine")}</p>
          </div>

          <div className="hidden border-l border-white/20 pl-6 lg:block">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#a5f3fc]">
              {t("proofHeading")}
            </p>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-3 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t(`proof${item}Title`)}</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">{t(`proof${item}Body`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:hidden">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-t border-white/20 pt-3">
                <p className="text-sm font-semibold text-white">{t(`proof${item}Title`)}</p>
                <p className="mt-1 text-xs leading-5 text-white/70">{t(`proof${item}Body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
