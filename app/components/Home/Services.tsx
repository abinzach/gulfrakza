// pages/services.jsx
"use client"
import React, { useState } from "react";
import { DarkGridHero } from "./DarkGrid";
import {
  GridPatternCard,
  GridPatternCardBody,
} from "@/components/ui/card-with-grid-ellipsis-pattern";
import { FaHelmetSafety, FaPeopleGroup } from "react-icons/fa6";
import { TbChecklist } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import QuoteModal from "../GetQuote";

const serviceCategories = [
  {
    title: "Scaffolding Services",
    description: "Safe, compliant scaffolding solutions for every worksite.",
    imageSrc: "/images/services/scaffolding.jpg",
    link: "/services/scaffolding",
  },
  {
    title: "PEB Shed Fabrication",
    description:
      "Custom pre-engineered building solutions designed to your specifications.",
    imageSrc: "/images/services/peb-shed.jpg",
    link: "/services/peb-shed",
  },
  {
    title: "Civil Works",
    description:
      "Comprehensive civil engineering services that support infrastructure development.",
    imageSrc: "/images/services/civil-works.jpg",
    link: "/services/civil-works",
  },
  {
    title: "Steel & Aluminium Fabrication",
    description:
      "Precision fabrication services for durable, industrial-grade builds.",
    imageSrc: "/images/services/fabrication.jpg",
    link: "/services/fabrication",
  },
  {
    title: "Rope Access & Safety Training",
    description:
      "Expert training and rope access solutions to ensure safe, efficient operations.",
    imageSrc: "/images/services/rope-access.jpg",
    link: "/services/rope-access",
  },
  {
    title: "Industrial Trading",
    description:
      "A curated selection of industrial products to complement our service offerings.",
    imageSrc: "/images/services/trading.jpg",
    link: "/services/trading",
  },
];

export default function ServicesPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section
        id="services"
        className="relative font-inter h-[60vh] flex items-center justify-center bg-gray-900 text-center"
      >
        <div className="absolute inset-0 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <DarkGridHero />
      </section>

      {/* Service Categories Overview */}
      <section className="lg:py-32 py-16 bg-gray-50">
        <div className="max-w-7xl font-inter mx-auto px-4">
          <h2 className="text-5xl font-semibold lg:text-left text-center mb-16">
            Our Service Offerings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {serviceCategories.map((service, index) => (
              <div key={index}>
                <GridPatternCard>
                  <GridPatternCardBody>
                    <h3 className="text-lg font-bold mb-1 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-wrap text-sm text-foreground/60">
                      {service.description}
                    </p>
                  </GridPatternCardBody>
                </GridPatternCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-semibold text-center lg:text-left font-inter mb-4">
            Why Choose Our Services?
          </h2>
          <p className="text-center lg:text-left font-raleway text-lg text-gray-600 ">
            At Gulf Rakza, our services are backed by industry-leading
            expertise, a commitment to quality, and a tailored approach to meet
            your unique needs. From rapid response times to uncompromised safety
            standards, we are your trusted partner for industrial excellence.
          </p>
          {/* Optionally add icons/infographics here */}
          <div className="flex flex-wrap font-inter justify-center lg:gap-32 gap-10 mt-20">
            {/* Example icon block */}
            <div className="flex flex-col items-center">
              <FaPeopleGroup className="h-24 w-24 mb-2 text-cyan-600" />
              <span className="text-gray-700 font-bold">Expertise</span>
            </div>
            <div className="flex flex-col items-center">
              <TbChecklist className="h-24 w-24 mb-2  text-cyan-600" />
              <span className="text-gray-700 font-bold">Quality Assurance</span>
            </div>
            <div className="flex flex-col items-center">
              <FaHelmetSafety className="h-24 w-24 mb-2 text-cyan-600" />
              <span className="text-gray-700 font-bold">Safety First</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 bg-black font-inter text-center text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-4xl  text-white font-bold mb-4">
            Ready to Elevate Your Operations?
          </h3>
          <p className="mb-6 ">
            Our experts are ready to provide personalized solutions to drive
            your industrial success.
          </p>
          <Button className="rounded-full px-6 py-3 bg-white text-black font-medium hover:bg-gray-100" onClick={() => setIsQuoteModalOpen(true)}>Get a Quote</Button>

          <QuoteModal
            open={isQuoteModalOpen}
            onOpenChange={setIsQuoteModalOpen}
          />
        </div>
      </section>
    </>
  );
}
