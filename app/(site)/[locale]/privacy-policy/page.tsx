import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMessages, isLocale, locales, type Locale } from "@/i18n/config";
import { siteUrl } from "@/lib/constants";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

type PrivacyMessages = {
  title: string;
  lastUpdated: string;
  introduction: string;
  informationWeCollect: {
    title: string;
    personalData: string;
    usageData: string;
    cookies: string;
  };
  howWeUse: {
    title: string;
    intro: string;
    items: string[];
  };
  disclosure: {
    title: string;
    intro: string;
    items: string[];
  };
  rights: { title: string; body: string };
  security: { title: string; body: string };
  changes: { title: string; body: string };
  contact: { title: string; body: string };
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : "en";
  const messages = await getMessages(activeLocale);
  const privacy = messages.legal.privacyPolicy as PrivacyMessages;
  const canonicalUrl = `${siteUrl}/${activeLocale}/privacy-policy`;
  const languages = locales.reduce<Record<string, string>>((acc, currentLocale) => {
    acc[currentLocale] = `${siteUrl}/${currentLocale}/privacy-policy`;
    return acc;
  }, {});
  languages["x-default"] = `${siteUrl}/privacy-policy`;

  return {
    title: `${privacy.title} | GulfRakza`,
    description: privacy.introduction,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  const privacy = messages.legal.privacyPolicy as PrivacyMessages;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 pt-20 font-inter">
      <h1 className="mb-6 text-4xl font-bold">{privacy.title}</h1>
      <p className="mb-4 text-sm">{privacy.lastUpdated}</p>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{privacy.introduction}</h2>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{privacy.informationWeCollect.title}</h2>
        <p className="mb-2 text-sm">{privacy.informationWeCollect.personalData}</p>
        <p className="mb-2 text-sm">{privacy.informationWeCollect.usageData}</p>
        <p className="mb-2 text-sm">{privacy.informationWeCollect.cookies}</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{privacy.howWeUse.title}</h2>
        <p className="mb-2 text-sm">{privacy.howWeUse.intro}</p>
        <ul className="mb-2 list-inside list-disc text-sm">
          {privacy.howWeUse.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{privacy.disclosure.title}</h2>
        <p className="mb-2 text-sm">{privacy.disclosure.intro}</p>
        <ul className="mb-2 list-inside list-disc text-sm">
          {privacy.disclosure.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {[privacy.rights, privacy.security, privacy.changes, privacy.contact].map((section) => (
        <section key={section.title} className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">{section.title}</h2>
          <p className="mb-2 text-sm">{section.body}</p>
        </section>
      ))}
    </main>
  );
}
