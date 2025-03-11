'use client'
import React, { Dispatch, SetStateAction, useState } from "react";
import { FiMenu, FiArrowRight, FiX } from "react-icons/fi";
import {
  useMotionValueEvent,
  AnimatePresence,
  useScroll,
  motion,
} from "framer-motion";
import useMeasure from "react-use-measure";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import QuoteModal from "./GetQuote";

const FlyoutNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showGetQuote, setShowGetQuote] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isProductsRoute =
    pathname.startsWith("/products") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms");

  // Update scroll state as before
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 250 ? true : false);
  });

  // Force sticky state (black bg, minimal padding) on products routes
  const finalScrolled = isProductsRoute ? true : scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full px-6 text-white transition-all duration-300 ease-out lg:px-12 ${
          finalScrolled
            ? "bg-neutral-950 py-3 shadow-xl"
            : "bg-neutral-950/0 py-6 shadow-none"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo />
          <div className="hidden gap-10 lg:flex">
            <Links />
            <CTAs onQuoteClick={() => setShowGetQuote(true)} />
          </div>
          <MobileMenu onQuoteClick={() => setShowGetQuote(true)} />
        </div>
      </nav>
      <AnimatePresence>
      <QuoteModal 
  open={showGetQuote} 
  onOpenChange={setShowGetQuote} 
/>
      </AnimatePresence>
    </>
  );
};

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-2xl font-extralight font-inter">
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

const Links = () => {
  return (
    <div className="flex items-center gap-10">
      {LINKS.map((l) => (
        <NavLink key={l.text} href={l.href} FlyoutContent={l.component}>
          {l.text}
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
      <a href={href} className="relative">
        {children}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left rounded-full bg-cyan-300 transition-transform duration-300 ease-out"
        />
      </a>
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

const CTAs = ({ onQuoteClick }: { onQuoteClick: () => void }) => {
  return (
    <div className="flex font-inter items-center gap-3">
      <button
        onClick={onQuoteClick}
        className="rounded-full flex bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200 duration-300"
      >
        Get a quote
      </button>
    </div>
  );
};

const AboutUsContent = () => {
  return <div>{/* About Us Flyout content here */}</div>;
};

const ProductsContent = () => {
  return <div>{/* Products Flyout content here */}</div>;
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
          <a
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
            }}
            href={href}
          >
            {children}
          </a>
        
        </div>
      ) : (
        <a
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(false);
          }}
          href="#"
          className="flex w-full cursor-pointer items-center justify-between border-b border-neutral-300 py-6 text-start text-2xl font-semibold"
        >
          <span>{children}</span>
          <FiArrowRight />
        </a>
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

const MobileMenu = ({ onQuoteClick }: { onQuoteClick: () => void }) => {
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
              {LINKS.map((l) => (
                <MobileMenuLink
                  key={l.text}
                  href={l.href}
                  FoldContent={l.component}
                  setMenuOpen={setOpen}
                >
                  {l.text}
                </MobileMenuLink>
              ))}
            </div>
            <div className="flex justify-end bg-neutral-950 p-6">
              <CTAs
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

const LINKS = [
  {
    text: "About us",
    href: "/about-us",
    component: AboutUsContent,
  },
  {
    text: "Products",
    href: "/products",
    component: ProductsContent,
  },
];
