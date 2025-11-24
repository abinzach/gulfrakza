'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FiMenu, FiArrowRight, FiX } from "react-icons/fi";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
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
import type { CatalogCategoryNode } from "@/lib/catalog/types";

type FlyoutContentProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

type MegaMenuItem = {
  title: string;
  description?: string;
  slug: string | null;
  imageSrc?: string;
};

type MegaMenuSubcategory = {
  title: string;
  description?: string;
  slug: string | null;
  items: MegaMenuItem[];
};

type MegaMenuCategory = {
  title: string;
  description?: string;
  slug: string | null;
  imageSrc?: string;
  subcategories: MegaMenuSubcategory[];
};

const slugifyValue = (value?: string | null) => {
  if (!value) return null;
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
};

const normalizeSlug = (value?: string | null, fallback?: string) => {
  const trimmed = value?.trim();
  if (trimmed) return trimmed;
  return slugifyValue(fallback);
};

const buildCatalogHref = (slug?: string | null) =>
  slug ? `/products?category=${encodeURIComponent(slug)}` : "/products";

const buildMegaMenuCategories = (categoryTree: CatalogCategoryNode[]): MegaMenuCategory[] => {
  if (!Array.isArray(categoryTree)) return [];

  return categoryTree
    .map((category) => {
      const subcategories: MegaMenuSubcategory[] = category.children.map((child) => {
        const sourceItems = child.children.length > 0 ? child.children : [child];
        const items: MegaMenuItem[] = sourceItems.map((entry) => ({
          title: entry.title,
          description: entry.description,
          slug: normalizeSlug(entry.slug, entry.title),
          imageSrc: entry.heroImageUrl ?? undefined,
        }));

        return {
          title: child.title,
          description: child.description,
          slug: normalizeSlug(child.slug, child.title),
          items,
        };
      });

      return {
        title: category.title,
        description: category.description,
        slug: normalizeSlug(category.slug, category.title),
        imageSrc: category.heroImageUrl ?? undefined,
        subcategories: subcategories.filter((subcategory) => subcategory.items.length > 0),
      };
    })
    .filter((category) => category.subcategories.length > 0);
};

type FlyoutNavProps = {
  categoryTree: CatalogCategoryNode[];
};

const FlyoutNav = ({ categoryTree }: FlyoutNavProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [showGetQuote, setShowGetQuote] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const tNav = useTranslations("common.nav");
  const searchParamsString = searchParams?.toString() ?? "";
  const productNavCategories = useMemo(
    () => buildMegaMenuCategories(categoryTree),
    [categoryTree],
  );

  const ProductsFlyoutContent = useCallback(
    (props: FlyoutContentProps) => (
      <ProductsContent {...props} productNavCategories={productNavCategories} />
    ),
    [productNavCategories],
  );

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

  const links = useMemo(() => {
    const baseLinks: NavItem[] = [
      {
        key: "about",
        href: "/about-us",
        label: tNav("about"),
        component: AboutUsContent,
      },
      {
        key: "services",
        href: "/services",
        label: tNav("services"),
      },
      {
        key: "products",
        href: "/products",
        label: tNav("products"),
        component: ProductsFlyoutContent,
        flyoutAlign: "left",
      },
    ];
    return baseLinks;
  }, [ProductsFlyoutContent, tNav]);

  const pathnameWithQuery = useMemo(() => {
    return searchParamsString ? `${pathname}?${searchParamsString}` : pathname;
  }, [pathname, searchParamsString]);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full px-6 text-white transition-all duration-300 ease-out lg:px-12 overflow-visible ${
          finalScrolled
            ? "bg-neutral-950 py-3 shadow-xl"
            : "bg-neutral-950/0 py-6 shadow-none"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-visible">
          <Logo />
          <div className="hidden items-center gap-6 lg:flex overflow-visible">
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
  component?: React.ComponentType<FlyoutContentProps>;
  flyoutAlign?: "center" | "left";
};

const Links = ({ items }: { items: NavItem[] }) => {
  return (
    <div className="flex items-center gap-10 overflow-visible">
      {items.map((item) => (
        <NavLink
          key={item.key}
          href={item.href}
          FlyoutContent={item.component}
          flyoutAlign={item.flyoutAlign}
        >
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
  flyoutAlign = "center",
}: {
  children: React.ReactNode;
  href: string;
  FlyoutContent?: React.ComponentType<FlyoutContentProps>;
  flyoutAlign?: "center" | "left";
}) => {
  const [open, setOpen] = useState(false);
  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative h-fit w-fit overflow-visible group"
    >
      <Link href={href} className="relative group">
        {children}
        <span
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left rounded-full bg-cyan-300 transition-transform duration-300 ease-out group-hover:scale-x-100 scale-x-0"
        />
      </Link>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: flyoutAlign === "left" ? "-70%" : "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-12 z-50 rounded-[28px] border border-neutral-800/50 bg-neutral-950/95 backdrop-blur-xl text-white shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-neutral-950/95 backdrop-blur-xl border-l border-t border-neutral-800/50 rounded-tl-sm" />
            <div className="overflow-visible">
              <FlyoutContent variant="desktop" onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CTAs = ({
  label,
  onQuoteClick,
  variant = "desktop",
}: {
  label: string;
  onQuoteClick: () => void;
  variant?: "desktop" | "mobile";
}) => {
  const isMobile = variant === "mobile";
  return (
    <div className="flex items-center gap-3 font-inter">
      <button
        onClick={onQuoteClick}
        className={cn(
          "flex rounded-full text-sm font-medium transition-colors duration-300",
          isMobile
            ? "h-16 shrink-0 items-center justify-center bg-neutral-950 px-6 text-white hover:bg-neutral-800"
            : "px-4 py-2 bg-white text-black hover:bg-gray-200",
        )}
      >
        {label}
      </button>
    </div>
  );
};

function AboutUsContent({}: FlyoutContentProps) {
  return <div />;
}

type ProductsContentProps = FlyoutContentProps & {
  productNavCategories: MegaMenuCategory[];
};

function ProductsContent({
  variant = "desktop",
  productNavCategories,
  onNavigate,
}: ProductsContentProps) {
  if (variant === "mobile") {
    return (
      <MobileProductsContent
        productNavCategories={productNavCategories}
        onNavigate={onNavigate}
      />
    );
  }
  return (
    <DesktopProductsContent
      productNavCategories={productNavCategories}
      onNavigate={onNavigate}
    />
  );
}

const DesktopProductsContent = ({
  productNavCategories,
  onNavigate,
}: {
  productNavCategories: MegaMenuCategory[];
  onNavigate?: () => void;
}) => {
  const initialCategorySlug =
    productNavCategories[0]?.slug ?? slugifyValue(productNavCategories[0]?.title) ?? null;
  const initialSubcategorySlug =
    productNavCategories[0]?.subcategories[0]?.slug ??
    slugifyValue(productNavCategories[0]?.subcategories[0]?.title) ??
    null;

  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(initialCategorySlug);
  const [activeSubcategorySlug, setActiveSubcategorySlug] = useState<string | null>(
    initialSubcategorySlug,
  );

  useEffect(() => {
    if (productNavCategories.length === 0) {
      setActiveCategorySlug(null);
      setActiveSubcategorySlug(null);
      return;
    }

    setActiveCategorySlug((current) => {
      if (!current) {
        return productNavCategories[0]?.slug ?? slugifyValue(productNavCategories[0]?.title) ?? null;
      }
      const stillExists = productNavCategories.some((category) => category.slug === current);
      return stillExists
        ? current
        : productNavCategories[0]?.slug ?? slugifyValue(productNavCategories[0]?.title) ?? null;
    });
  }, [productNavCategories]);

  const activeCategory = useMemo(() => {
    if (productNavCategories.length === 0) return null;
    if (!activeCategorySlug) return productNavCategories[0];
    return (
      productNavCategories.find((category) => category.slug === activeCategorySlug) ??
      productNavCategories[0]
    );
  }, [activeCategorySlug, productNavCategories]);

  useEffect(() => {
    if (!activeCategory) {
      setActiveSubcategorySlug(null);
      return;
    }

    setActiveSubcategorySlug((current) => {
      if (activeCategory.subcategories.length === 0) {
        return null;
      }

      const stillExists = current
        ? activeCategory.subcategories.some((subcategory) => subcategory.slug === current)
        : false;

      return stillExists
        ? current
        : activeCategory.subcategories[0]?.slug ??
            slugifyValue(activeCategory.subcategories[0]?.title) ??
            null;
    });
  }, [activeCategory]);

  const activeSubcategory = useMemo(() => {
    if (!activeCategory) return null;
    if (!activeSubcategorySlug) return activeCategory.subcategories[0] ?? null;
    return (
      activeCategory.subcategories.find((subcategory) => subcategory.slug === activeSubcategorySlug) ??
      activeCategory.subcategories[0] ??
      null
    );
  }, [activeCategory, activeSubcategorySlug]);

  if (!activeCategory) {
    return (
      <div className="w-[320px] rounded-2xl bg-neutral-950/95 backdrop-blur-xl border border-neutral-800/50 p-6 text-sm text-neutral-400">
        Catalog navigation coming soon.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[min(95vw,900px)] overflow-visible rounded-[28px] border border-neutral-800/50 bg-neutral-950/95 backdrop-blur-xl p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.5)]">
      <div className="grid gap-6 lg:[grid-template-columns:260px_270px] xl:[grid-template-columns:300px_300px]">
        <motion.div className="space-y-3 border-b border-neutral-800 pb-4 lg:border-b-0 lg:border-r lg:border-neutral-800 lg:pb-0 lg:pr-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Pillars
          </p>
          <div className="flex flex-col gap-1.5">
            {productNavCategories.map((category, index) => {
              const isActive = activeCategory?.slug === category.slug;
              const key = `${category.slug ?? slugifyValue(category.title) ?? "category"}-${index}`;
              return (
                <motion.div key={key} whileHover={{ scale: 1.01 }}>
                  <Link
                    href={buildCatalogHref(category.slug)}
                    onMouseEnter={() => setActiveCategorySlug(category.slug ?? null)}
                    onFocus={() => setActiveCategorySlug(category.slug ?? null)}
                    onClick={() => onNavigate?.()}
                    className={cn(
                      "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-white/10 text-white shadow-lg border border-neutral-700"
                        : "bg-white/5 text-neutral-300 hover:bg-white/10 border border-transparent",
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span>{category.title}</span>
                    <FiArrowRight
                      className={cn(
                        "h-4 w-4 transition-all",
                        isActive
                          ? "text-cyan-300"
                          : "text-neutral-500 group-hover:translate-x-1 group-hover:text-cyan-400",
                      )}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        <motion.div className="space-y-3 border-b border-neutral-800 pb-4 lg:border-b-0 lg:pb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Focus areas
          </p>
          <div className="flex flex-col gap-1.5">
            {(activeCategory.subcategories ?? []).map((subcategory, index) => {
              const isActive = activeSubcategory?.slug === subcategory.slug;
              const key = `${activeCategory.slug ?? slugifyValue(activeCategory.title) ?? "category"}-${subcategory.slug ?? slugifyValue(subcategory.title) ?? "subcategory"}-${index}`;
              return (
                <motion.div key={key} whileHover={{ scale: 1.01 }}>
                  <Link
                    href={buildCatalogHref(subcategory.slug)}
                    onMouseEnter={() => setActiveSubcategorySlug(subcategory.slug ?? null)}
                    onFocus={() => setActiveSubcategorySlug(subcategory.slug ?? null)}
                    onClick={() => onNavigate?.()}
                    className={cn(
                      "block rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
                      isActive
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-sm"
                        : "border-transparent text-neutral-300 hover:border-neutral-700 hover:bg-white/5",
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>{subcategory.title}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const MobileProductsContent = ({
  productNavCategories,
  onNavigate,
}: {
  productNavCategories: MegaMenuCategory[];
  onNavigate?: () => void;
}) => {
  if (productNavCategories.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 text-sm text-neutral-500">
        Catalog navigation coming soon.
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-4">
      {productNavCategories.map((category, index) => (
        <div
          key={`${category.slug ?? slugifyValue(category.title) ?? "category"}-${index}`}
          className="space-y-3"
        >
          <Link
            href={buildCatalogHref(category.slug)}
            onClick={() => onNavigate?.()}
            className="flex items-center justify-between text-base font-semibold text-neutral-900"
          >
            {category.title}
            <FiArrowRight className="h-4 w-4 text-neutral-400" />
          </Link>
          {(category.subcategories ?? []).map((subcategory, subIndex) => (
            <Link
              key={`${category.slug ?? slugifyValue(category.title) ?? "category"}-${subcategory.slug ?? slugifyValue(subcategory.title) ?? "subcategory"}-${subIndex}`}
              href={buildCatalogHref(subcategory.slug)}
              onClick={() => onNavigate?.()}
              className="flex items-center justify-between rounded-2xl bg-neutral-50 p-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
            >
              <span>{subcategory.title}</span>
              <FiArrowRight className="h-4 w-4 text-neutral-400" />
            </Link>
          ))}
        </div>
      ))}
      <Link
        href="/products"
        onClick={() => onNavigate?.()}
        className="flex items-center justify-center rounded-2xl border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-600 hover:text-white"
      >
        Explore entire catalog
      </Link>
    </div>
  );
};

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
        "inline-flex items-center rounded-full border p-1 text-xs font-medium uppercase tracking-wide shadow-sm backdrop-blur",
        isMobile
          ? "w-full max-w-[180px] justify-between border-neutral-300 bg-white text-sm"
          : "border-white/15 bg-white/10 text-white gap-1",
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
              "flex-1 rounded-full text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              isMobile ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs",
              isMobile
                ? isActive
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "bg-transparent text-neutral-700 hover:text-neutral-950"
                : isActive
                  ? "bg-white text-neutral-950 shadow-sm"
                  : "bg-transparent text-white/70 hover:text-white",
              isMobile
                ? "focus-visible:ring-neutral-950"
                : "focus-visible:ring-white/80",
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
  FoldContent?: React.ComponentType<FlyoutContentProps>;
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
            className="text-neutral-950 hover:text-neutral-700 transition-colors"
          >
            {children}
          </Link>
        </div>
      ) : (
        <Link
          href={href}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(false);
          }}
          className="flex w-full cursor-pointer items-center justify-between border-b border-neutral-300 py-6 text-start text-2xl font-semibold text-neutral-950 hover:text-neutral-700 transition-colors"
        >
          <span>{children}</span>
          <FiArrowRight />
        </Link>
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
            <FoldContent variant="mobile" onNavigate={() => setMenuOpen(false)} />
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
  const tContact = useTranslations("common.contactPresets");
  const phoneNumber = "+966557197311";
  const emailAddress = "info@gulfrakza.com";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(tContact("whatsappMessage"))}`;
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(tContact("emailSubject"))}&body=${encodeURIComponent(tContact("emailBody"))}`;
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
            <div className="flex items-center justify-between bg-neutral-950 p-6 text-white">
              <Logo />
              <button onClick={() => setOpen(false)}>
                <FiX className="text-3xl text-white" />
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
            <div className="flex items-center justify-between gap-4 bg-neutral-100 p-6">
              <CTAs
                label={ctaLabel}
                onQuoteClick={() => {
                  setOpen(false);
                  onQuoteClick();
                }}
                variant="mobile"
              />
              <div className="flex items-center gap-3">
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-neutral-950 p-3 shadow-xl transition-colors hover:bg-neutral-800"
                >
                  <FaWhatsapp size={32} className="text-white" />
                </Link>
                <Link
                  href={mailtoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-neutral-950 p-3 shadow-xl transition-colors hover:bg-neutral-800"
                >
                  <FaEnvelope size={32} className="text-white" />
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlyoutNav;
