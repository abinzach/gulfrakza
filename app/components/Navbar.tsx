'use client';

import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { FiMenu, FiArrowRight, FiX } from "react-icons/fi";
import {
  useMotionValueEvent,
  AnimatePresence,
  useScroll,
  motion,
} from "framer-motion";
import useMeasure from "react-use-measure";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Link } from "@/navigation";
import { useLocale, useTranslations } from "@/i18n/provider";
import QuoteModal from "./GetQuote";
import { locales } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { localePreferenceStorageKey, localeCookieName } from "@/lib/constants";

const NAV_LINKS = [
  {
    key: "about",
    href: "/about-us",
    component: AboutUsContent,
  },
  {
    key: "products",
    href: "/products",
    component: ProductsContent,
  },
] as const;

const FlyoutNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showGetQuote, setShowGetQuote] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const tNav = useTranslations("common.nav");
  const searchParamsString = searchParams?.toString() ?? "";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 250);
  });

  const normalizedPath = useMemo(() => {
    if (!pathname) return "/";
    const prefix = `/${locale}`;
    if (pathname === prefix) return "/";
    return pathname.startsWith(prefix) ? pathname.slice(prefix.length) || "/" : pathname;
  }, [pathname, locale]);

  const isProductsRoute =
    normalizedPath.startsWith("/products") ||
    normalizedPath.startsWith("/privacy") ||
    normalizedPath.startsWith("/terms");

  const finalScrolled = isProductsRoute ? true : scrolled;

  const links = useMemo(
    () =>
      NAV_LINKS.map((link) => ({
        ...link,
        label: tNav(link.key),
      })),
    [tNav],
  );

  const pathnameWithQuery = useMemo(() => {
    return searchParamsString ? `${pathname}?${searchParamsString}` : pathname;
  }, [pathname, searchParamsString]);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full px-6 text-white transition-all duration-300 ease-out lg:px-12 ${
          finalScrolled
            ? "bg-neutral-950 py-3 shadow-xl"
            : "bg-neutral-950/0 py-6 shadow-none"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Logo />
          <div className="hidden items-center gap-6 lg:flex">
            <Links items={links} />
            <LocaleSwitcher currentLocale={locale} pathname={pathnameWithQuery} />
            <CTAs label={tNav("getQuote")} onQuoteClick={() => setShowGetQuote(true)} />
          </div>
          <MobileMenu
            items={links}
            ctaLabel={tNav("getQuote")}
            currentLocale={locale}
            pathname={pathnameWithQuery}
            onQuoteClick={() => setShowGetQuote(true)}
          />
        </div>
      </nav>
      <AnimatePresence>
        <QuoteModal open={showGetQuote} onOpenChange={setShowGetQuote} />
      </AnimatePresence>
    </>
  );
};

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-2xl font-inter font-extralight">
        GULF<span className="font-semibold">RAKZA</span>
      </span>
      <Image
        width={24}
        height={24}
        src="/logo-rakza.png"
        alt="logo"
        className="h-6 w-6"
      />
    </Link>
  );
};

type NavItem = {
  key: string;
  href: string;
  label: string;
  component?: React.ElementType;
};

const Links = ({ items }: { items: NavItem[] }) => {
  return (
    <div className="flex items-center gap-10">
      {items.map((item) => (
        <NavLink key={item.key} href={item.href} FlyoutContent={item.component}>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};

const NavLink = ({
  children,
  href,
  FlyoutContent,
}: {
  children: React.ReactNode;
  href: string;
  FlyoutContent?: React.ElementType;
}) => {
  const [open, setOpen] = useState(false);
  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative h-fit w-fit"
    >
      <Link href={href} className="relative">
        {children}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left rounded-full bg-cyan-300 transition-transform duration-300 ease-out"
        />
      </Link>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-12 bg-white text-black"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CTAs = ({
  label,
  onQuoteClick,
}: {
  label: string;
  onQuoteClick: () => void;
}) => {
  return (
    <div className="flex items-center gap-3 font-inter">
      <button
        onClick={onQuoteClick}
        className="flex rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors duration-300 hover:bg-gray-200"
      >
        {label}
      </button>
    </div>
  );
};

function AboutUsContent() {
  return <div />;
}

function ProductsContent() {
  return <div />;
}

const persistLocalePreference = (value: string) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(localePreferenceStorageKey, value);
    document.cookie = `${localeCookieName}=${value};path=/;max-age=31536000;samesite=lax`;
  } catch {
    // ignore
  }
};

const LocaleSwitcher = ({
  currentLocale,
  pathname,
  variant = "desktop",
}: {
  currentLocale: string;
  pathname: string;
  variant?: "desktop" | "mobile";
}) => {
  const t = useTranslations("common.localeSwitcher");
  const isMobile = variant === "mobile";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/15 bg-white/10 p-1 text-xs font-medium uppercase tracking-wide text-white shadow-sm backdrop-blur",
        isMobile ? "w-full max-w-[180px] justify-between text-sm" : "gap-1",
      )}
      aria-label={t("label")}
      role="group"
    >
      {locales.map((loc) => {
        const isActive = loc === currentLocale;
        return (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            aria-label={t(`switchTo.${loc}`)}
            onClick={() => persistLocalePreference(loc)}
            className={cn(
              "flex-1 rounded-full text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              isMobile ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs",
              isActive
                ? "bg-white text-neutral-950 shadow-sm"
                : "bg-transparent text-white/70 hover:text-white",
            )}
            aria-current={isActive ? "true" : undefined}
          >
            {t(`short.${loc}`)}
          </Link>
        );
      })}
    </div>
  );
};

const MobileMenuLink = ({
  children,
  href,
  FoldContent,
  setMenuOpen,
}: {
  children: React.ReactNode;
  href: string;
  FoldContent?: React.ElementType;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative text-neutral-950">
      {FoldContent ? (
        <div
          className="flex w-full cursor-pointer items-center justify-between border-b border-neutral-300 py-6 text-start text-2xl font-semibold"
          onClick={() => setOpen((pv) => !pv)}
        >
          <Link
            href={href}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
            }}
          >
            {children}
          </Link>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(false);
          }}
          className="flex w-full cursor-pointer items-center justify-between border-b border-neutral-300 py-6 text-start text-2xl font-semibold"
        >
          <span>{children}</span>
          <FiArrowRight />
        </button>
      )}
      {FoldContent && (
        <motion.div
          initial={false}
          animate={{
            height: open ? height : "0px",
            marginBottom: open ? "24px" : "0px",
            marginTop: open ? "12px" : "0px",
          }}
          className="overflow-hidden"
        >
          <div ref={ref}>
            <FoldContent />
          </div>
        </motion.div>
      )}
    </div>
  );
};

const MobileMenu = ({
  items,
  ctaLabel,
  onQuoteClick,
  currentLocale,
  pathname,
}: {
  items: NavItem[];
  ctaLabel: string;
  onQuoteClick: () => void;
  currentLocale: string;
  pathname: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="block lg:hidden">
      <button onClick={() => setOpen(true)} className="block text-3xl">
        <FiMenu />
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "100vw" }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed left-0 top-0 flex h-screen w-full flex-col bg-white"
          >
            <div className="flex items-center justify-between p-6">
              <Logo />
              <button onClick={() => setOpen(false)}>
                <FiX className="text-3xl text-neutral-950" />
              </button>
            </div>
            <div className="h-screen overflow-y-scroll bg-neutral-100 p-6">
              <div className="mb-6 flex justify-end">
                <LocaleSwitcher currentLocale={currentLocale} pathname={pathname} variant="mobile" />
              </div>
              {items.map((item) => (
                <MobileMenuLink
                  key={item.key}
                  href={item.href}
                  FoldContent={item.component}
                  setMenuOpen={setOpen}
                >
                  {item.label}
                </MobileMenuLink>
              ))}
            </div>
            <div className="flex justify-end bg-neutral-950 p-6">
              <CTAs
                label={ctaLabel}
                onQuoteClick={() => {
                  setOpen(false);
                  onQuoteClick();
                }}
              />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlyoutNav;
