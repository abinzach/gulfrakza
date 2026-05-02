"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "@/i18n/provider";
import DoubleScrollingLogos from "@/app/components/Home/BrandLogo";
import StackedCardTestimonials from "@/app/components/Home/Testimonial";
import { Link } from "@/navigation.client";
import {
  BadgeCheck,
  Building2,
  Handshake,
  MapPin,
  ShieldCheck,
  Wrench,
  ArrowRight,
} from "lucide-react";

const AboutUsClient: React.FC = () => {
  const t = useTranslations("about");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const snapshotItems = [
    { key: "location", icon: MapPin },
    { key: "coverage", icon: Building2 },
    { key: "supply", icon: BadgeCheck },
    { key: "support", icon: Wrench },
  ];

  const valueItems = [
    { key: "reliability", icon: ShieldCheck },
    { key: "quality", icon: BadgeCheck },
    { key: "responsiveness", icon: Wrench },
    { key: "partnership", icon: Handshake },
  ];

  return (
    <div className="bg-white text-neutral-950">
      {/* ───── Hero ───── */}
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <Image
          src="/images/about-us/about-us-hero.avif"
          alt={t("heroAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-50"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0.25)_45%,rgba(10,10,10,0.95)_100%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-[#67e8f9]">
              <span className="h-px w-10 bg-[#67e8f9]/70" aria-hidden="true" />
              {t("heroEyebrow")}
            </p>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]">
              {t("h1")}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-white/75 sm:text-lg">
              {t("heroDescription")}
            </p>
          </div>
        </div>
      </section>

      <main>
        {/* ───── Intro / Legal block ───── */}
        <section className="border-b border-neutral-200/70 bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-28">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">
                {t("legalLabel")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                {t("legalName")}
              </h2>
              <p className="mt-5 text-base leading-7 text-neutral-600">
                {t("legalDescription")}
              </p>
            </div>

            <div className="lg:col-span-7 lg:border-l lg:border-neutral-200 lg:pl-16">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">
                {t("snapshotEyebrow")}
              </p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                {t("snapshotHeading")}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600">
                {t("intro")}
              </p>
            </div>
          </div>
        </section>

        {/* ───── Snapshot strip (clean, no boxy cards) ───── */}
        <section className="border-b border-neutral-200/70 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid divide-y divide-neutral-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
              {snapshotItems.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === snapshotItems.length - 1;
                return (
                  <div
                    key={item.key}
                    className={`flex items-start gap-4 py-6 sm:py-2 ${
                      !isLast ? "lg:border-r lg:border-neutral-200 lg:pr-8" : ""
                    } ${idx > 0 ? "lg:pl-8" : ""}`}
                  >
                    <Icon
                      className="mt-1 h-5 w-5 shrink-0 text-[#08778c]"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
                        {t(`snapshot.${item.key}.label`)}
                      </p>
                      <p className="mt-2 text-base font-medium leading-6 text-neutral-950">
                        {t(`snapshot.${item.key}.value`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── Vision & Mission — editorial split, no boxes ───── */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid gap-x-16 gap-y-16 lg:grid-cols-2">
              <article className="lg:pr-8">
                <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#08778c]">
                  <span className="h-px w-8 bg-[#08778c]/60" aria-hidden="true" />
                  {t("visionLabel")}
                </p>
                <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
                  {t("visionHeading")}
                </h2>
                <p className="mt-6 text-base leading-8 text-neutral-600">
                  {t("visionParagraph")}
                </p>
              </article>

              <article className="lg:border-l lg:border-neutral-200 lg:pl-16">
                <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#08778c]">
                  <span className="h-px w-8 bg-[#08778c]/60" aria-hidden="true" />
                  {t("missionLabel")}
                </p>
                <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
                  {t("missionHeading")}
                </h2>
                <p className="mt-6 text-base leading-8 text-neutral-600">
                  {t("missionParagraph")}
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ───── Values — minimal numbered editorial list ───── */}
        <section className="border-y border-neutral-200/70 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">
                  {t("valuesEyebrow")}
                </p>
                <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
                  {t("valuesHeading")}
                </h2>
              </div>

              <div className="lg:col-span-8">
                <ul className="divide-y divide-neutral-200 border-t border-neutral-200">
                  {valueItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={item.key}
                        className="grid grid-cols-[auto_1fr_auto] items-start gap-x-6 py-7 sm:gap-x-8"
                      >
                        <span
                          className="font-mono text-xs font-medium tabular-nums text-neutral-400"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl">
                            {t(`values.${item.key}.title`)}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-neutral-600 sm:text-base">
                            {t(`values.${item.key}.description`)}
                          </p>
                        </div>
                        <Icon
                          className="mt-1 hidden h-5 w-5 text-neutral-400 sm:block"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ───── Closing CTA ───── */}
        <section className="bg-neutral-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
              <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {t("h1")}
              </h2>
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 border-b border-white/30 pb-2 text-sm font-medium tracking-wide text-white transition hover:border-[#67e8f9] hover:text-[#67e8f9]"
              >
                <span>{t("legalName")}</span>
                <ArrowRight
                  className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                    isRTL ? "rotate-180 group-hover:-translate-x-1" : ""
                  }`}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <div className="bg-white">
        <DoubleScrollingLogos />
      </div>
      <StackedCardTestimonials />
    </div>
  );
};

export default AboutUsClient;
