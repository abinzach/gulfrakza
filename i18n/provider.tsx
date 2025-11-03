"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import type { Locale } from "@/i18n/config";

type Messages = Record<string, any>;

interface I18nContextType {
  locale: Locale;
  messages: Messages;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const direction = locale === "ar" ? "rtl" : "ltr";

    if (html.getAttribute("dir") !== direction) {
      html.setAttribute("dir", direction);
    }

    if (html.getAttribute("lang") !== locale) {
      html.setAttribute("lang", locale);
    }
  }, [locale]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, messages, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations(namespace?: string) {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslations must be used within I18nProvider");
  }

  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return context.t(fullKey);
  };
}

export function useLocale() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useLocale must be used within I18nProvider");
  }
  return context.locale;
}

export function useMessages() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useMessages must be used within I18nProvider");
  }
  return context.messages;
}
