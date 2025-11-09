"use client";

import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("notFound");
  const [dots, setDots] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? `${prev}.` : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const gearVariants: Variants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const reverseGearVariants: Variants = {
    rotate: {
      rotate: -360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="relative mb-8">
        <motion.div className="absolute -left-16 -top-8" variants={gearVariants} animate="rotate">
          <GearIcon />
        </motion.div>
        <motion.div className="absolute -right-16 -top-8" variants={reverseGearVariants} animate="rotate">
          <GearIcon />
        </motion.div>
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GearIcon size={120} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center"
      >
        <h1 className="mb-4 text-4xl font-bold text-cyan-600 md:text-5xl">{t("title")}</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
          {t("subtitle")}
        </h2>
        <p className="mb-2 text-lg text-gray-600 dark:text-gray-300">{t("body")}</p>
        <div className="flex justify-center">
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
            {t("progress")}
            <span className="inline-block w-9 text-left">{dots}</span>
          </p>
        </div>

        <motion.div
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full border-cyan-600 bg-white text-cyan-600 hover:bg-gray-100 dark:bg-white"
          >
            {t("back")}
          </Button>
          <Link href="/">
            <Button className="rounded-full bg-cyan-600 hover:bg-cyan-700">{t("cta")}</Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

const GearIcon = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="#0891b2"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
      stroke="#0891b2"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
