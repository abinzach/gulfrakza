"use client";

import { useMessages, useTranslations } from "@/i18n/provider";

export default function PrivacyPolicyPage() {
  const t = useTranslations("legal.privacyPolicy");
  const messages = useMessages();
  const privacyMessages = messages?.legal?.privacyPolicy;
  const listItems = (privacyMessages?.howWeUse?.items as string[]) ?? [];
  const disclosureItems = (privacyMessages?.disclosure?.items as string[]) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 pt-20 font-inter py-12">
      <h1 className="mb-6 text-4xl font-bold">{t("title")}</h1>
      <p className="mb-4 text-sm">{t("lastUpdated")}</p>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{t("introduction")}</h2>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{t("informationWeCollect.title")}</h2>
        <p className="mb-2 text-sm">{t("informationWeCollect.personalData")}</p>
        <p className="mb-2 text-sm">{t("informationWeCollect.usageData")}</p>
        <p className="mb-2 text-sm">{t("informationWeCollect.cookies")}</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{t("howWeUse.title")}</h2>
        <p className="mb-2 text-sm">{t("howWeUse.intro")}</p>
        <ul className="mb-2 list-inside list-disc text-sm">
          {listItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{t("disclosure.title")}</h2>
        <p className="mb-2 text-sm">{t("disclosure.intro")}</p>
        <ul className="mb-2 list-inside list-disc text-sm">
          {disclosureItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{t("rights.title")}</h2>
        <p className="mb-2 text-sm">{t("rights.body")}</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{t("security.title")}</h2>
        <p className="mb-2 text-sm">{t("security.body")}</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{t("changes.title")}</h2>
        <p className="mb-2 text-sm">{t("changes.body")}</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">{t("contact.title")}</h2>
        <p className="mb-2 text-sm">{t("contact.body")}</p>
      </section>
    </main>
  );
}
