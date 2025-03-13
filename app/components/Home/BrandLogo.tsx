'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import { JSX } from "react";


const DoubleScrollingLogos = () => {
  return (
    <section className="bg-white py-4">
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
      <div className="flex overflow-hidden mt-4">
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
      <div className="flex overflow-hidden mt-4">
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
    <div
    
      className="w-16 md:w-24 h-16 md:h-24 flex justify-center items-center text-black transition-colors"
    >
      <Image width={100} height={100} loading="lazy" src={`/brands/${src}`} alt={src}/>
    </div>
  );
};

// New AVIF format logos
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

// Mix of PNG and other format logos
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

// More PNG format logos
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