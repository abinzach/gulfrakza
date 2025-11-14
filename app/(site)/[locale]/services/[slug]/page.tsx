import React from "react";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale, defaultLocale, locales } from "@/i18n/config";
import ServicesPageClient from "./services-detail-client";
import { getServiceIndexBySlug } from "@/lib/services";

interface ServiceCard {
  title: string;
  description: string;
}

interface ServiceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate static params for all services using English slugs
export async function generateStaticParams() {
  const paramsArray: { locale: string; slug: string }[] = [];
  
  // Get all English service slugs
  const { getAllServiceSlugs } = await import("@/lib/services");
  const slugs = getAllServiceSlugs();

  // Generate params for all locales with English slugs
  for (const locale of locales) {
    for (const slug of slugs) {
      paramsArray.push({ locale, slug });
    }
  }

  return paramsArray;
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { locale, slug } = await params;
  const activeLocale: Locale = isLocale(locale) ? locale : defaultLocale;
  const messages = await getMessages(activeLocale);

  // Find service index by English slug
  const serviceIndex = await getServiceIndexBySlug(slug);
  
  if (serviceIndex === null) {
    notFound();
  }

  // Extract services from current locale messages
  const servicesSection = messages?.home?.services;
  const services: ServiceCard[] = servicesSection?.cards || [];

  // Get the service at the same index (services are in same order in all locales)
  const service = services[serviceIndex];

  if (!service) {
    notFound();
  }

  const heroHeading = servicesSection?.heroHeading || "Our Services";
  const heroDescription =
    servicesSection?.heroDescription ||
    "Explore our comprehensive range of services designed to meet your industrial needs.";
  const whyHeading = servicesSection?.whyHeading || "Why Choose Our Services?";
  const whyDescription =
    servicesSection?.whyDescription ||
    "At Gulf Rakza, our services are backed by industry-leading expertise, a commitment to quality, and a tailored approach to meet your unique needs.";
  const ctaHeading =
    servicesSection?.ctaHeading || "Ready to Elevate Your Operations?";
  const ctaDescription =
    servicesSection?.ctaDescription ||
    "Our experts are ready to provide personalized solutions to drive your industrial success.";
  const ctaButton = servicesSection?.ctaButton || "Get a Quote";

  return (
    <ServicesPageClient
      service={service}
      heroHeading={heroHeading}
      heroDescription={heroDescription}
      whyHeading={whyHeading}
      whyDescription={whyDescription}
      ctaHeading={ctaHeading}
      ctaDescription={ctaDescription}
      ctaButton={ctaButton}
    />
  );
}

