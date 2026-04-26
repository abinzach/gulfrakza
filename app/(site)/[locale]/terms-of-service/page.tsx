import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMessages, isLocale, locales, type Locale } from "@/i18n/config";
import { siteUrl } from "@/lib/constants";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

type TermsMessages = {
  title: string;
  lastUpdated: string;
  acceptance: { title: string; body: string };
  use: { title: string; body: string };
  responsibilities: { title: string; body: string };
  intellectualProperty: { title: string; body: string };
  disclaimer: { title: string; body: string };
  law: { title: string; body: string };
  changes: { title: string; body: string };
  contact: { title: string; body: string };
};

const sectionKeys = [
  "acceptance",
  "use",
  "responsibilities",
  "intellectualProperty",
  "disclaimer",
  "law",
  "changes",
  "contact",
] as const;

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : "en";
  const messages = await getMessages(activeLocale);
  const terms = messages.legal.termsOfService as TermsMessages;
  const canonicalUrl = `${siteUrl}/${activeLocale}/terms-of-service`;
  const languages = locales.reduce<Record<string, string>>((acc, currentLocale) => {
    acc[currentLocale] = `${siteUrl}/${currentLocale}/terms-of-service`;
    return acc;
  }, {});
  languages["x-default"] = `${siteUrl}/terms-of-service`;

  return {
    title: `${terms.title} | GulfRakza`,
    description: terms.acceptance.body,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

export default async function TermsOfServicePage({ params }: TermsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  const terms = messages.legal.termsOfService as TermsMessages;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 pt-20 font-inter">
      <h1 className="mb-6 text-4xl font-bold">{terms.title}</h1>
      <p className="mb-4 text-sm">{terms.lastUpdated}</p>

      {sectionKeys.map((sectionKey) => {
        const section = terms[sectionKey];
        return (
          <section key={sectionKey} className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">{section.title}</h2>
            <p className="mb-2 text-sm text-gray-900 dark:text-gray-100">{section.body}</p>
          </section>
        );
      })}
    </main>
  );
}
