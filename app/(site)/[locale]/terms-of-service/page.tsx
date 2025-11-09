"use client";

import { useTranslations } from "@/i18n/provider";

export default function TermsOfServicePage() {
  const t = useTranslations("legal.termsOfService");

  const sections = [
    "acceptance",
    "use",
    "responsibilities",
    "intellectualProperty",
    "disclaimer",
    "law",
    "changes",
    "contact",
  ] as const;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-20 font-inter py-12">
      <h1 className="mb-6 text-4xl font-bold">{t("title")}</h1>
      <p className="mb-4 text-sm">{t("lastUpdated")}</p>

      {sections.map((sectionKey) => (
        <section key={sectionKey} className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">{t(`${sectionKey}.title`)}</h2>
          <p className="mb-2 text-sm text-gray-900">{t(`${sectionKey}.body`)}</p>
        </section>
      ))}
    </main>
  );
}
