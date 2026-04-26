import Image from "next/image";
import { JSX } from "react";

const DoubleScrollingLogos = () => {
  return (
    <section dir="ltr" className="bg-white py-4" aria-label="Brand logos">
      {/*
        Perf + a11y:
        - Pure CSS marquee animations (no JS / no Framer Motion).
        - Respect prefers-reduced-motion: show a static grid and disable marquee.
      */}

      {/* Reduced motion: static grid */}
      <div className="mx-auto hidden max-w-7xl px-4 motion-reduce:block motion-safe:hidden">
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
          <LogoItemsTop />
          <LogoItemsMiddle />
          <LogoItemsBottom />
        </div>
      </div>

      {/* Motion-safe: marquee lanes */}
      <div className="motion-reduce:hidden motion-safe:block">
        <div className="flex overflow-hidden">
          <MarqueeLane direction="left">
            <LogoItemsTop />
          </MarqueeLane>
        </div>
        <div className="mt-4 flex overflow-hidden">
          <MarqueeLane direction="right">
            <LogoItemsMiddle />
          </MarqueeLane>
        </div>
        <div className="mt-4 flex overflow-hidden">
          <MarqueeLane direction="left">
            <LogoItemsBottom />
          </MarqueeLane>
        </div>
      </div>
    </section>
  );
};

const MarqueeLane = ({
  children,
  direction,
}: {
  children: JSX.Element;
  direction: "left" | "right";
}) => {
  return (
    <div
      className={
        direction === "left"
          ? "marquee-left flex w-max gap-4 px-2"
          : "marquee-right flex w-max gap-4 px-2"
      }
      aria-hidden
    >
      {/* Duplicate content once for seamless loop */}
      {children}
      {children}
    </div>
  );
};

const LogoItem = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div
    
      className="w-16 md:w-24 h-16 md:h-24 flex justify-center items-center text-black transition-colors"
    >
      <Image
        width={100}
        height={100}
        loading="lazy"
        decoding="async"
        src={`/brands/${src}`}
        alt={alt}
      />
    </div>
  );
};

// New AVIF format logos
const LogoItemsTop = () => (
  <>
    <LogoItem src="Mitsubishi_Electric_logo.svg.avif" alt="Mitsubishi Electric" />
    <LogoItem src="DeWalt_Logo.svg.avif" alt="DeWalt" />
    <LogoItem src="Hilti-Logo.avif" alt="Hilti" />
    <LogoItem src="Karam.avif" alt="Karam" />
    <LogoItem src="Makita-logo.avif" alt="Makita" />
    <LogoItem src="NoTrax_Logo_CMYK.avif" alt="NoTrax" />
    <LogoItem src="parker-logo-600.avif" alt="Parker" />
    <LogoItem src="Spanset.avif" alt="Spanset" />
    <LogoItem src="Stanley-Logo.avif" alt="Stanley" />
    <LogoItem src="tractel-logo-vector.avif" alt="Tractel" />
    <LogoItem src="brand_oryx_400x400.avif" alt="Oryx" />
    <LogoItem src="Justrite_Logo_CMYK.avif" alt="Justrite" />
  </>
);

// Mix of PNG and other format logos
const LogoItemsMiddle = () => (
  <>
    <LogoItem src="shopify_eyevex_logo_500x250.avif" alt="Shopify" />
    <LogoItem src="Viraj-Logo_page-0001-1-2.avif" alt="Viraj" />
    <LogoItem src="simplified-logo.webp" alt="Simplified" />
    <LogoItem src="tweco-logo.png" alt="Tweco" />
    <LogoItem src="powerliftlogo.png" alt="Powerlift" />
    <LogoItem src="miller-sperian-logo.png" alt="Miller Sperian" />
    <LogoItem src="molyslip-logo.png" alt="Molyslip" />
    <LogoItem src="loctite-logo.png" alt="Loctite" />
    <LogoItem src="miller-logo.png" alt="Miller" />
    <LogoItem src="lgh-logo.png" alt="LGH" />
    <LogoItem src="legrand-logo.avif" alt="Legrand" />
    <LogoItem src="jazeera_logo.png" alt="Jazeera" />
  </>
);

// More PNG format logos
const LogoItemsBottom = () => (
  <>
    <LogoItem src="kee-systems-logo.png" alt="Kee Systems" />
    <LogoItem src="fastclamp-logo.svg" alt="FastClamp" />
    <LogoItem src="bahco-logo.png" alt="Bahco" />
    <LogoItem src="bosch-logo.png" alt="Bosch" />
    <LogoItem src="Mitsubishi_Electric_logo.png" alt="Mitsubishi Electric" />
    <LogoItem src="Lalizas_logo.png" alt="Lalizas" />
    <LogoItem src="Ingersoll_Rand_logo.png" alt="Ingersoll Rand" />
    <LogoItem src="Honeywell_logo.png" alt="Honeywell" />
    <LogoItem src="Henkel-Logo.png" alt="Henkel" />
    <LogoItem src="ABB_logo.png" alt="ABB" />
    <LogoItem src="3M-logo.png" alt="3M" />
  </>
);

export default DoubleScrollingLogos;
