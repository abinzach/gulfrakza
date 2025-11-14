import React from "react";
import { Link } from "@/navigation";
import BackButton from "@/app/components/BackButton";
import {
  GridPatternCard,
  GridPatternCardBody,
} from "@/components/ui/card-with-grid-ellipsis-pattern";
import { getMessages, isLocale, type Locale, defaultLocale } from "@/i18n/config";
import { DarkGridHero } from "@/app/components/Home/DarkGrid";
import { getServiceSlugByIndex } from "@/lib/services";

interface ServiceCard {
  title: string;
  description: string;
}

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const messages = await getMessages(activeLocale);

  // Extract services from messages
  const servicesSection = messages?.home?.services;
  const services: ServiceCard[] = servicesSection?.cards || [];

  const heroHeading = servicesSection?.heroHeading || "Our Services";
  const heroDescription =
    servicesSection?.heroDescription ||
    "Explore our comprehensive range of services designed to meet your industrial needs.";
  const sectionHeading =
    servicesSection?.sectionHeading || "Our Service Offerings";

  const serviceSlugs = await Promise.all(
    services.map((_, index) => getServiceSlugByIndex(index)),
  );

  return (
    <main
      className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter"
      style={{ scrollPaddingTop: "80px" }}
    >
      {/* Hero Section */}
      <section className="relative flex h-[60vh] items-center justify-center bg-gray-900 text-center font-inter">
        <div className="absolute inset-0 bg-cover bg-center" />
        <div className="absolute inset-0 bg-black opacity-50" />
        <DarkGridHero title={heroHeading} description={heroDescription} />
      </section>

      {/* Services Listing */}
      <section className="bg-gray-50 py-16 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 font-inter">
          <BackButton />
          <h2 className="mb-16 text-center text-5xl font-semibold lg:text-left">
            {sectionHeading}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {services.map((service, index) => {
              const serviceSlug = serviceSlugs[index];
              if (!serviceSlug) return null;

              return (
                <Link key={service.title} href={`/services/${serviceSlug}`}>
                  <GridPatternCard className="h-full group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <GridPatternCardBody className="h-full">
                      <h3 className="mb-1 text-lg font-bold text-foreground group-hover:text-cyan-600 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-foreground/60">
                        {service.description}
                      </p>
                    </GridPatternCardBody>
                  </GridPatternCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
