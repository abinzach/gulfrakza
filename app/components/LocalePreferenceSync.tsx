"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { localePreferenceStorageKey, localeCookieName } from "@/lib/constants"
import { locales, type Locale } from "@/i18n/config"

const isValidLocale = (value: string | null): value is Locale =>
  Boolean(value && (locales as readonly string[]).includes(value))

const buildPathForLocale = (pathname: string, nextLocale: Locale) => {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`
  const segments = normalized.split("/").filter(Boolean)

  if (segments.length === 0) {
    return `/${nextLocale}`
  }

  if ((locales as readonly string[]).includes(segments[0] as Locale)) {
    segments[0] = nextLocale
    return `/${segments.join("/")}`
  }

  return `/${nextLocale}${normalized === "/" ? "" : normalized}`
}

const setPreference = (value: Locale) => {
  try {
    window.localStorage.setItem(localePreferenceStorageKey, value)
    document.cookie = `${localeCookieName}=${value};path=/;max-age=31536000;samesite=lax`
  } catch {
    // no-op
  }
}

type LocalePreferenceSyncProps = {
  locale: Locale
}

export default function LocalePreferenceSync({ locale }: LocalePreferenceSyncProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const stored = window.localStorage.getItem(localePreferenceStorageKey)

    if (!isValidLocale(stored)) {
      setPreference(locale)
      return
    }

    if (stored === locale) {
      setPreference(locale)
      return
    }

    const nextPath = buildPathForLocale(pathname, stored)
    const search = window.location.search ?? ""
    const hash = window.location.hash ?? ""

    setPreference(stored)
    router.replace(`${nextPath}${search}${hash}`, { scroll: false })
  }, [locale, pathname, router])

  return null
}
