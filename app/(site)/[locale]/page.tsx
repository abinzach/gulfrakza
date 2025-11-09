"use client";

import HeroSection from "@/app/components/Home/HeroSection";
import DoubleScrollingLogos from "@/app/components/Home/BrandLogo";
import ContactForm from "@/app/components/Home/ContactForms";
import KeyOfferingsSection from "@/app/components/Home/OfferingsPage";
import Services from "@/app/components/Home/Services";
import StackedCardTestimonials from "@/app/components/Home/Testimonial";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <KeyOfferingsSection />
      <Services />
      <DoubleScrollingLogos />
      <StackedCardTestimonials />
      <ContactForm />
    </>
  );
}
