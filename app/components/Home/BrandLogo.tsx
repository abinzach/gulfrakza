'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import { JSX } from "react";

const DoubleScrollingLogos = () => {
  return (
    <section dir="ltr" className="bg-white py-20 font-inter">
      {/* Section heading */}
      <div className="mx-auto mb-12 max-w-7xl px-6 text-center">
        <p className="mb-3 text-xs font-medium tracking-[0.2em] uppercase text-gray-400">
          Partners
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-[#111] md:text-3xl">
          Authorized distributor for the world&apos;s leading brands
        </h2>
        <p className="mt-3 text-sm text-[#6b6b6b]">
          36+ global manufacturers trusted across the Eastern Province
        </p>
      </div>

      {/* Logo rows */}
      <div className="flex overflow-hidden">
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
      </div>
      <div className="mt-4 flex overflow-hidden">
        <TranslateWrapper reverse>
          <LogoItemsMiddle />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsMiddle />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsMiddle />
        </TranslateWrapper>
      </div>
      <div className="mt-4 flex overflow-hidden">
        <TranslateWrapper>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsBottom />
        </TranslateWrapper>
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />
    </section>
  );
};


const TranslateWrapper = ({
  children,
  reverse,
}: {
  children: JSX.Element;
  reverse?: boolean;
}) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="flex gap-4 px-2"
    >
      {children}
    </motion.div>
  );
};

const LogoItem = ({ src }: { src: string }) => {
  return (
    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100 md:h-20 md:w-20">
      <Image
        width={80}
        height={80}
        loading="lazy"
        src={`/brands/${src}`}
        alt={src.replace(/[-_\.][^\.]+$/, "").replace(/[-_]/g, " ")}
        className="max-h-10 w-auto object-contain md:max-h-12"
      />
    </div>
  );
};

const LogoItemsTop = () => (
  <>
    <LogoItem src="Mitsubishi_Electric_logo.svg.avif" />
    <LogoItem src="DeWalt_Logo.svg.avif" />
    <LogoItem src="Hilti-Logo.avif" />
    <LogoItem src="Karam.avif" />
    <LogoItem src="Makita-logo.avif" />
    <LogoItem src="NoTrax_Logo_CMYK.avif" />
    <LogoItem src="parker-logo-600.avif" />
    <LogoItem src="Spanset.avif" />
    <LogoItem src="Stanley-Logo.avif" />
    <LogoItem src="tractel-logo-vector.avif" />
    <LogoItem src="brand_oryx_400x400.avif" />
    <LogoItem src="Justrite_Logo_CMYK.avif" />
  </>
);

const LogoItemsMiddle = () => (
  <>
    <LogoItem src="shopify_eyevex_logo_500x250.avif" />
    <LogoItem src="Viraj-Logo_page-0001-1-2.avif" />
    <LogoItem src="simplified-logo.webp" />
    <LogoItem src="tweco-logo.png" />
    <LogoItem src="powerliftlogo.png" />
    <LogoItem src="miller-sperian-logo.png" />
    <LogoItem src="molyslip-logo.png" />
    <LogoItem src="loctite-logo.png" />
    <LogoItem src="miller-logo.png" />
    <LogoItem src="lgh-logo.png" />
    <LogoItem src="legrand-logo.avif" />
    <LogoItem src="jazeera_logo.png" />
  </>
);

const LogoItemsBottom = () => (
  <>
    <LogoItem src="kee-systems-logo.png" />
    <LogoItem src="fastclamp-logo.svg" />
    <LogoItem src="bahco-logo.png" />
    <LogoItem src="bosch-logo.png" />
    <LogoItem src="Mitsubishi_Electric_logo.png" />
    <LogoItem src="Lalizas_logo.png" />
    <LogoItem src="Ingersoll_Rand_logo.png" />
    <LogoItem src="Honeywell_logo.png" />
    <LogoItem src="Henkel-Logo.png" />
    <LogoItem src="ABB_logo.png" />
    <LogoItem src="3M-logo.png" />
  </>
);

export default DoubleScrollingLogos;
