"use client";

import React, { useState } from "react";
import BackButton from "@/app/components/BackButton";
import { DarkGridHero } from "@/app/components/Home/DarkGrid";
import { Button } from "@/components/ui/button";
import QuoteModal from "@/app/components/GetQuote";
import { FaHelmetSafety, FaPeopleGroup } from "react-icons/fa6";
import { TbChecklist } from "react-icons/tb";

interface ServiceCard {
  title: string;
  description: string;
}

interface ServicesPageClientProps {
  service: ServiceCard;
  whyHeading: string;
  whyDescription: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButton: string;
}

export default function ServicesPageClient({
  service,
  whyHeading,
  whyDescription,
  ctaHeading,
  ctaDescription,
  ctaButton,
}: ServicesPageClientProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <main
      className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter"
      style={{ scrollPaddingTop: "80px" }}
    >
      {/* Hero Section */}
      <section className="relative flex h-[60vh] items-center justify-center bg-gray-900 text-center font-inter">
        <div className="absolute inset-0 bg-cover bg-center" />
        <div className="absolute inset-0 bg-black opacity-50" />
        <DarkGridHero title={service.title} description={service.description} />
      </section>

      {/* Service Detail Section */}
      <section className="bg-gray-50 py-16 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 font-inter">
          <BackButton />
          <div className="mb-8">
            <h1 className="mb-4 text-5xl font-semibold text-gray-800 dark:text-white">
              {service.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-raleway">
              {service.description}
            </p>
          </div>

          {/* Additional Service Details */}
          <div className="mt-12 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-3xl font-semibold text-gray-800 dark:text-white">
              Service Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-raleway leading-relaxed">
              {service.description} Our team of experts is committed to delivering
              high-quality solutions tailored to your specific needs. We combine
              industry-leading expertise with a focus on safety, quality, and
              efficiency to ensure your operations run smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-center font-inter text-5xl font-semibold lg:text-left">
            {whyHeading}
          </h2>
          <p className="font-raleway text-lg text-gray-600 lg:text-left dark:text-gray-300">
            {whyDescription}
          </p>
          <div className="mt-20 flex flex-wrap justify-center gap-10 font-inter lg:gap-32">
            <div className="flex flex-col items-center">
              <FaPeopleGroup className="mb-2 h-24 w-24 text-cyan-600" />
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Expertise
              </span>
            </div>
            <div className="flex flex-col items-center">
              <TbChecklist className="mb-2 h-24 w-24 text-cyan-600" />
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Quality Assurance
              </span>
            </div>
            <div className="flex flex-col items-center">
              <FaHelmetSafety className="mb-2 h-24 w-24 text-cyan-600" />
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Safety First
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-12 text-center font-inter text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="mb-4 text-4xl font-bold text-white">{ctaHeading}</h3>
          <p className="mb-6">{ctaDescription}</p>
          <Button
            className="rounded-full bg-white px-6 py-3 font-medium text-black hover:bg-gray-100"
            onClick={() => setIsQuoteModalOpen(true)}
          >
            {ctaButton}
          </Button>

          <QuoteModal
            open={isQuoteModalOpen}
            onOpenChange={setIsQuoteModalOpen}
          />
        </div>
      </section>
    </main>
  );
}
