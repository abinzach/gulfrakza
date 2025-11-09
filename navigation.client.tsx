"use client";

import NextLink from "next/link";
import { useRouter as useNextRouter, usePathname as useNextPathname } from "next/navigation";
import { ComponentProps, forwardRef } from "react";
import { useLocale } from "@/i18n/provider";
import { locales } from "@/i18n/config";

type NextLinkProps = ComponentProps<typeof NextLink>;

interface LinkProps extends Omit<NextLinkProps, 'href'> {
  href: string;
  locale?: string;
}

// Custom Link component that handles locale switching
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function Link({ href, locale: targetLocale, ...props }, ref) {
    const currentLocale = useLocale();
    const pathname = useNextPathname();
    
    // Determine which locale to use
    const localeToUse = targetLocale || currentLocale;
    
    // If a target locale is specified and it's different from current, we need to switch
    if (targetLocale && targetLocale !== currentLocale) {
      // Extract the current locale from pathname
      const currentLocalePrefix = `/${currentLocale}`;
      
      // If pathname starts with current locale, replace it with target locale
      if (pathname?.startsWith(currentLocalePrefix)) {
        const pathWithoutLocale = pathname.slice(currentLocalePrefix.length) || '/';
        const newHref = `/${targetLocale}${pathWithoutLocale}`;
        return <NextLink ref={ref} href={newHref} {...props} />;
      }
      
      // Otherwise, just prepend the target locale
      const newHref = `/${targetLocale}${href}`;
      return <NextLink ref={ref} href={newHref} {...props} />;
    }
    
    // For normal links without locale switching, ensure locale prefix
    let finalHref = href;
    
    // If href doesn't start with a locale, add the current one
    const startsWithLocale = locales.some(loc => href.startsWith(`/${loc}`));
    if (!startsWithLocale && !href.startsWith('http') && !href.startsWith('#')) {
      finalHref = `/${localeToUse}${href.startsWith('/') ? href : `/${href}`}`;
    }
    
    return <NextLink ref={ref} href={finalHref} {...props} />;
  }
);

// Re-export Next.js navigation hooks
export function usePathname() {
  return useNextPathname();
}

export function useRouter() {
  return useNextRouter();
}

// Simple redirect helper
export function redirect(href: string) {
  if (typeof window !== "undefined") {
    window.location.href = href;
  }
}
