'use client';

/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V4 */
/* Hallmark · genre: modern-minimal · macrostructure: existing homepage preserved · tone: industrial-utilitarian · nav: N11 mega-menu */

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
import { Link } from "@/navigation.client";
import { useLocale, useTranslations } from "@/i18n/provider";
import QuoteModal from "./GetQuote";
import { locales } from "@/i18n/config";
import { cn } from "@/lib/utils";
import {
  localePreferenceStorageKey,
  localeCookieName,
  localeSwitchScrollStorageKey,
  contact,
} from "@/lib/constants";
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

const findCategoryPath = (nodes: CatalogCategoryNode[], slug: string): string[] | null => {
  for (const node of nodes) {
    if (node.slug === slug) return node.path.map((segment) => segment.slug);
    const childPath = findCategoryPath(node.children, slug);
    if (childPath) return childPath;
  }
  return null;
};

const buildCatalogHref = (categoryTree: CatalogCategoryNode[], slug?: string | null) => {
  if (!slug) return "/products";
  const path = findCategoryPath(categoryTree, slug);
  return path
    ? `/products/category/${path.map(encodeURIComponent).join("/")}`
    : `/products?category=${encodeURIComponent(slug)}`;
};

const buildMegaMenuCategories = (categoryTree: CatalogCategoryNode[]): MegaMenuCategory[] => {
  if (!Array.isArray(categoryTree)) return [];

  return categoryTree
    .filter((category) => category.productCount > 0)
    .map((category) => {
      const subcategories: MegaMenuSubcategory[] = category.children
        .filter((child) => child.productCount > 0)
        .map((child) => {
        const items: MegaMenuItem[] = [{
          title: child.title,
          description: child.description,
          slug: normalizeSlug(child.slug, child.title),
          imageSrc: child.heroImageUrl ?? undefined,
        }];

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
    });
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
      <ProductsContent {...props} productNavCategories={productNavCategories} categoryTree={categoryTree} />
    ),
    [categoryTree, productNavCategories],
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

  const isSolidNavRoute =
    normalizedPath.startsWith("/products") ||
    normalizedPath.startsWith("/services/") ||
    normalizedPath.startsWith("/privacy") ||
    normalizedPath.startsWith("/terms");

  const finalScrolled = isSolidNavRoute ? true : scrolled;

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
        className={`fixed top-0 z-50 w-full overflow-visible px-6 text-white transition-[background-color,padding,box-shadow] duration-300 ease-out lg:px-12 ${
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
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        // Close when focus leaves the nav item entirely.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          // move focus back to the trigger link for predictable keyboard UX
          const trigger = event.currentTarget.querySelector("a");
          (trigger as HTMLAnchorElement | null)?.focus();
        }
      }}
      className="relative h-fit w-fit overflow-visible group"
    >
      <Link
        href={href}
        className="relative whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9] focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950"
      >
        {children}
        <span
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 bg-[#67e8f9] transition-transform duration-200 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100"
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
            className="absolute left-1/2 top-12 z-50 overflow-hidden border border-neutral-700 bg-neutral-950 text-white shadow-[0_24px_64px_rgba(0,0,0,0.45)]"
            role="menu"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-neutral-700 bg-neutral-950" />
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
        aria-haspopup="dialog"
        className={cn(
          "flex whitespace-nowrap text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:translate-y-px",
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
  categoryTree: CatalogCategoryNode[];
};

function ProductsContent({
  variant = "desktop",
  productNavCategories,
  categoryTree,
  onNavigate,
}: ProductsContentProps) {
  if (variant === "mobile") {
    return (
      <MobileProductsContent
        productNavCategories={productNavCategories}
        categoryTree={categoryTree}
        onNavigate={onNavigate}
      />
    );
  }
  return (
    <DesktopProductsContent
      productNavCategories={productNavCategories}
      categoryTree={categoryTree}
      onNavigate={onNavigate}
    />
  );
}

const DesktopProductsContent = ({
  productNavCategories,
  categoryTree,
  onNavigate,
}: {
  productNavCategories: MegaMenuCategory[];
  categoryTree: CatalogCategoryNode[];
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
      <div className="w-[320px] border border-neutral-800 bg-neutral-950 p-6 text-sm text-neutral-400">
        Catalog navigation coming soon.
      </div>
    );
  }

  return (
    <div className="w-[min(92vw,880px)] bg-neutral-950 text-white">
      <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#67e8f9]">
            Product catalog
          </p>
          <p className="mt-1 text-sm text-neutral-400">Browse by industrial category</p>
        </div>
        <Link
          href="/products"
          onClick={() => onNavigate?.()}
          className="group flex min-h-11 items-center gap-2 whitespace-nowrap border border-neutral-700 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#0bbfe0] hover:bg-[#0bbfe0] hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          View all products
          <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid max-h-[min(70vh,560px)] grid-cols-[260px_minmax(0,1fr)] overflow-hidden">
        <div className="overflow-y-auto border-r border-neutral-800 bg-neutral-950">
          <p className="border-b border-neutral-800 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Categories
          </p>
          <div className="flex flex-col">
            {productNavCategories.map((category, index) => {
              const isActive = activeCategory?.slug === category.slug;
              const key = `${category.slug ?? slugifyValue(category.title) ?? "category"}-${index}`;
              return (
                <div key={key}>
                  <Link
                    href={buildCatalogHref(categoryTree, category.slug)}
                    onMouseEnter={() => setActiveCategorySlug(category.slug ?? null)}
                    onFocus={() => setActiveCategorySlug(category.slug ?? null)}
                    onClick={() => onNavigate?.()}
                    className={cn(
                      "group relative flex min-h-14 items-center justify-between border-b border-neutral-800 px-5 py-3 text-sm font-semibold transition-colors duration-150 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#67e8f9]",
                      isActive
                        ? "bg-neutral-800 text-white before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[#0bbfe0]"
                        : "text-neutral-300 hover:bg-neutral-900 hover:text-white",
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="min-w-0 truncate pr-3" title={category.title}>
                      {category.title}
                    </span>
                    <FiArrowRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-[transform,color] duration-150",
                        isActive
                          ? "text-[#67e8f9]"
                          : "text-neutral-500 group-hover:translate-x-1 group-hover:text-[#35d2e9]",
                      )}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-y-auto bg-neutral-950 px-6 py-5">
          <div className="mb-5 flex items-start justify-between gap-6 border-b border-neutral-800 pb-5">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Product families
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                {activeCategory.title}
              </h3>
              {activeCategory.description ? (
                <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-6 text-neutral-400">
                  {activeCategory.description}
                </p>
              ) : null}
            </div>
            <Link
              href={buildCatalogHref(categoryTree, activeCategory.slug)}
              onClick={() => onNavigate?.()}
              className="shrink-0 whitespace-nowrap text-sm font-semibold text-[#67e8f9] underline decoration-[#0bbfe0]/50 underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              View category
            </Link>
          </div>
          <div className="grid grid-cols-2 border-l border-t border-neutral-800">
            {(activeCategory.subcategories ?? []).map((subcategory, index) => {
              const isActive = activeSubcategory?.slug === subcategory.slug;
              const key = `${activeCategory.slug ?? slugifyValue(activeCategory.title) ?? "category"}-${subcategory.slug ?? slugifyValue(subcategory.title) ?? "subcategory"}-${index}`;
              return (
                <div key={key}>
                  <Link
                    href={buildCatalogHref(categoryTree, subcategory.slug)}
                    onMouseEnter={() => setActiveSubcategorySlug(subcategory.slug ?? null)}
                    onFocus={() => setActiveSubcategorySlug(subcategory.slug ?? null)}
                    onClick={() => onNavigate?.()}
                    className={cn(
                      "group flex min-h-16 items-center justify-between gap-3 border-b border-r border-neutral-800 px-4 py-3 text-sm font-semibold transition-colors duration-150 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#67e8f9]",
                      isActive
                        ? "bg-[#0bbfe0]/10 text-[#67e8f9]"
                        : "text-neutral-300 hover:bg-neutral-900 hover:text-white",
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="min-w-0 truncate" title={subcategory.title}>
                      {subcategory.title}
                    </span>
                    <FiArrowRight className="h-4 w-4 shrink-0 text-neutral-600 transition-[transform,color] duration-150 group-hover:translate-x-1 group-hover:text-[#35d2e9]" />
                  </Link>
                </div>
              );
            })}
          </div>
          {activeCategory.subcategories.length === 0 ? (
            <p className="border border-neutral-800 p-5 text-sm text-neutral-400">
              Products are available directly in this category.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const MobileProductsContent = ({
  productNavCategories,
  categoryTree,
  onNavigate,
}: {
  productNavCategories: MegaMenuCategory[];
  categoryTree: CatalogCategoryNode[];
  onNavigate?: () => void;
}) => {
  if (productNavCategories.length === 0) {
    return (
      <div className="border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
        Catalog navigation coming soon.
      </div>
    );
  }

  return (
    <div className="space-y-5 border border-neutral-200 bg-white p-4">
      {productNavCategories.map((category, index) => (
        <div
          key={`${category.slug ?? slugifyValue(category.title) ?? "category"}-${index}`}
          className="space-y-3"
        >
          <Link
            href={buildCatalogHref(categoryTree, category.slug)}
            onClick={() => onNavigate?.()}
            className="flex min-h-11 items-center justify-between gap-3 text-base font-semibold text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0899b4]"
          >
            <span className="min-w-0 truncate" title={category.title}>
              {category.title}
            </span>
            <FiArrowRight className="h-4 w-4 shrink-0 text-neutral-400" />
          </Link>
          {(category.subcategories ?? []).map((subcategory, subIndex) => (
            <Link
              key={`${category.slug ?? slugifyValue(category.title) ?? "category"}-${subcategory.slug ?? slugifyValue(subcategory.title) ?? "subcategory"}-${subIndex}`}
              href={buildCatalogHref(categoryTree, subcategory.slug)}
              onClick={() => onNavigate?.()}
              className="flex min-h-11 items-center justify-between gap-3 bg-neutral-50 p-3 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0899b4]"
            >
              <span className="min-w-0 truncate" title={subcategory.title}>
                {subcategory.title}
              </span>
              <FiArrowRight className="h-4 w-4 shrink-0 text-neutral-400" />
            </Link>
          ))}
        </div>
      ))}
      <Link
        href="/products"
        onClick={() => onNavigate?.()}
        className="flex min-h-11 items-center justify-center whitespace-nowrap border border-[#0899b4] px-4 py-2 text-sm font-semibold text-[#08778c] transition-colors hover:bg-[#08778c] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0899b4]"
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

const persistLocaleSwitchScrollPosition = () => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(localeSwitchScrollStorageKey, String(window.scrollY));
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
        "inline-flex items-center border p-1 text-xs font-medium uppercase tracking-wide shadow-sm backdrop-blur",
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
            scroll={false}
            aria-label={t(`switchTo.${loc}`)}
            onClick={() => {
              persistLocaleSwitchScrollPosition();
              persistLocalePreference(loc);
            }}
            className={cn(
              "flex-1 text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
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
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
  const phoneForWa = contact.phoneMobileE164.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${phoneForWa}?text=${encodeURIComponent(tContact("whatsappMessage"))}`;
  const mailtoUrl = `mailto:${contact.emailPrimary}?subject=${encodeURIComponent(tContact("emailSubject"))}&body=${encodeURIComponent(tContact("emailBody"))}`;
  return (
    <div className="block lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="block text-3xl"
        aria-label="Open menu"
      >
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
              <button onClick={() => setOpen(false)} aria-label="Close menu">
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
                  aria-label="WhatsApp"
                  className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-neutral-950 p-3 shadow-xl transition-colors hover:bg-neutral-800"
                >
                  <FaWhatsapp size={32} className="text-white" />
                </Link>
                <Link
                  href={mailtoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  aria-label="Email"
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
