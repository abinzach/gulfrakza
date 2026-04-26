import HeroSection from "@/app/components/Home/HeroSection";
import DoubleScrollingLogos from "@/app/components/Home/BrandLogo";
import ContactForm from "@/app/components/Home/ContactForms";
import KeyOfferingsSection from "@/app/components/Home/OfferingsPage";
import Services from "@/app/components/Home/Services";
import StackedCardTestimonials from "@/app/components/Home/Testimonial";
import type { Locale } from "@/i18n/config";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <HeroSection />
      <KeyOfferingsSection locale={locale} />
      <Services locale={locale} />
      <DoubleScrollingLogos />
      <StackedCardTestimonials />
      <ContactForm />
    </>
  );
}
