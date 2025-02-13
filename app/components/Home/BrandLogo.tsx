'use client'
import { motion } from "framer-motion";
import {
  SiNike,
  Si3M,
  SiAbstract,
  SiAdobe,
  SiAirtable,
  SiAmazon,
  SiBox,
  SiBytedance,
  SiChase,
  SiCloudbees,
  SiBurton,
  SiBmw,
  SiHeroku,
  SiBuildkite,
  SiCouchbase,
  SiDailymotion,
  SiDeliveroo,
  SiEpicgames,
  SiGenius,
  SiGodaddy,
  SiMitsubishi,
} from "react-icons/si";
import { IconType } from "react-icons";
import { JSX } from "react";
import Image from "next/image";

const DoubleScrollingLogos = () => {
  return (
    <section className="bg-white py-4">
      <div className="flex  overflow-hidden">
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
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
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
    <a
      href="/"
      rel="nofollow"
      target="_blank"
      className="w-16 md:w-24 h-16 md:h-24 flex justify-center items-center hover:bg-slate-200 text-black transition-colors"
    >
      <img loading="lazy" src={`/brands/${src}`} alt={src}/>
    </a>
  );
};

const LogoItemsTop = () => (
  <>
    <LogoItem src="Mitsubishi_Electric_Logo.png" />
    <LogoItem src="powerliftlogo.png" />
    <LogoItem src="miller-logo.png" />
    <LogoItem src="3M-logo.png" />
    <LogoItem src="legrand-logo.png" />
    <LogoItem src="fastclamp-logo.svg" />
    <LogoItem src="bosch-logo.png" />
    <LogoItem src="lgh-logo.png" />
    <LogoItem src="Ingersoll_Rand_logo.png" />
    <LogoItem src="jazeera_logo.png" />
    
  </>
);
const LogoItemsMiddle = () => (
  <>
    <LogoItem src="bahco-logo.png" />

  </>);
const LogoItemsBottom = () => (
  <>
    <LogoItem src="Honeywell_logo.png" />
    <LogoItem src="ABB_logo.png" />
    <LogoItem src="Henkel-Logo.png" />
    <LogoItem src="Lalizas_logo.png" />
    <LogoItem src="kee-systems-logo.png" />
    <LogoItem src="miller-sperian-logo.png" />
    <LogoItem src="tweco-logo.png" />
    <LogoItem src="loctite-logo.png" />
    <LogoItem src="molyslip-logo.png" />
    <LogoItem src="simplified-logo.webp" />
  </>
);

export default DoubleScrollingLogos;