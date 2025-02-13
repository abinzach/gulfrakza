import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import React from 'react';
import HeroSection from './components/Home/HeroSection';
import { Key } from 'lucide-react';
import KeyOfferingsSection from './components/Home/OfferingsPage';
import Services from './components/Home/Services';
import { Footerdemo } from '@/components/ui/footer-section';
import DoubleScrollingLogos from './components/Home/BrandLogo';
import StackedCardTestimonials from './components/Home/Testimonial';
import ContactForm from './components/Home/ContactForms';

export default function Home() {
  return (
    <>
       <HeroSection />
       <KeyOfferingsSection/>
       <Services/>

       <DoubleScrollingLogos/>
       <StackedCardTestimonials/>
       <ContactForm/>
    </>

  );
}
