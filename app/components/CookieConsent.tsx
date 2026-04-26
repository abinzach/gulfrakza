"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/provider";

export const analyticsConsentStorageKey = "gulfrakza_analytics_consent";
export const analyticsConsentEventName = "gulfrakza:analytics-consent";

const hasAnalyticsConfig = Boolean(
  process.env.NEXT_PUBLIC_GTM_ID ||
    process.env.NEXT_PUBLIC_GA_ID ||
    process.env.NEXT_PUBLIC_CLARITY_ID,
);

const copy = {
  en: {
    body: "We use analytics cookies to understand site performance and improve quote journeys.",
    accept: "Accept analytics",
    reject: "Reject",
  },
  ar: {
    body: "نستخدم ملفات تعريف ارتباط التحليلات لفهم أداء الموقع وتحسين طلبات العروض.",
    accept: "قبول التحليلات",
    reject: "رفض",
  },
} as const;

const setConsentCookie = (value: "accepted" | "rejected") => {
  document.cookie = `${analyticsConsentStorageKey}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
};

export function CookieConsent() {
  const locale = useLocale();
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    setChoice(window.localStorage.getItem(analyticsConsentStorageKey));
  }, []);

  if (!hasAnalyticsConfig || choice) {
    return null;
  }

  const messages = copy[locale === "ar" ? "ar" : "en"];

  const saveChoice = (value: "accepted" | "rejected") => {
    window.localStorage.setItem(analyticsConsentStorageKey, value);
    setConsentCookie(value);
    setChoice(value);
    window.dispatchEvent(
      new CustomEvent(analyticsConsentEventName, {
        detail: value,
      }),
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-gray-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-sm leading-relaxed text-gray-700 dark:text-gray-200">
          {messages.body}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => saveChoice("rejected")}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
          >
            {messages.reject}
          </button>
          <button
            type="button"
            onClick={() => saveChoice("accepted")}
            className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2"
          >
            {messages.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
