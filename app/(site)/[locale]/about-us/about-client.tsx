"use client";

import Image from "next/image";
import { useTranslations } from "@/i18n/provider";
import DoubleScrollingLogos from "@/app/components/Home/BrandLogo";
import StackedCardTestimonials from "@/app/components/Home/Testimonial";

const AboutUsClient: React.FC = () => {
  const t = useTranslations("about");

  return (
    <div>
      <div className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src="/images/about-us/about-us-hero.avif"
          alt="GulfRakza - Industrial Supplier in Dammam, Saudi Arabia"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>
      <main className="mx-auto max-w-7xl p-6 py-16">
        <h1 className="mb-8 text-5xl font-bold text-gray-900 dark:text-white">
          About GulfRakza - Leading Industrial Supplier in Dammam
        </h1>
        <p className="mb-6 text-2xl font-raleway leading-normal text-gray-500 dark:text-gray-300">
          {t("intro")}
        </p>
        <section className="my-20">
          <h2 className="mb-4 text-4xl font-inter text-gray-800 dark:text-white">
            {t("visionHeading")}
          </h2>
          <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">{t("visionParagraph")}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300">{t("missionParagraph")}</p>
        </section>
      </main>
      <DoubleScrollingLogos />
      <StackedCardTestimonials />
    </div>
  );
};

export default AboutUsClient;

