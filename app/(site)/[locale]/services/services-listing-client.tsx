"use client";

import React, { useEffect, useState } from "react";
import { DarkGridHero } from "@/app/components/Home/DarkGrid";
import ServiceCard from "@/app/components/Services/ServiceCard";
import QuoteModal from "@/app/components/GetQuote";
import { cn } from "@/lib/utils";
import { ServiceCategory } from "@/lib/services";
import { Link } from "@/navigation.client";

interface ServicesListingClientProps {
  categories: ServiceCategory[];
  heroHeading: string;
  heroDescription: string;
  sectionHeading: string;
}

export default function ServicesListingClient({
  categories,
  heroHeading,
  heroDescription,
  sectionHeading,
}: ServicesListingClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{ name: string; category: string } | null>(null);

  // Simple scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((cat) => document.getElementById(cat.id));
      const scrollPosition = window.scrollY + 200; // Offset

      for (const section of sections) {
        if (
          section &&
          section.offsetTop <= scrollPosition &&
          section.offsetTop + section.offsetHeight > scrollPosition
        ) {
          setActiveCategory(section.id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToCategory = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleRequestService = (serviceTitle: string, categoryTitle: string) => {
    setSelectedService({
      name: serviceTitle,
      category: categoryTitle,
    });
    setIsQuoteModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 font-sans pb-32">
      {/* Hero Section */}
      <section className="relative flex h-[50vh] items-center justify-center bg-gray-900 text-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900" />
        <DarkGridHero title={heroHeading} description={heroDescription} />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 lg:pt-24">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
                Categories
              </h3>
              <nav className="space-y-2 border-l border-gray-100 dark:border-gray-800">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`#${category.id}`}
                    onClick={(e) => scrollToCategory(e, category.id)}
                    className={cn(
                      "block pl-6 py-2 text-sm transition-all duration-300 border-l-2 -ml-[2px]",
                      activeCategory === category.id
                        ? "border-cyan-600 text-cyan-600 font-medium"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300"
                    )}
                  >
                    {category.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Navigation (Horizontal) */}
          <div className="lg:hidden sticky top-20 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`#${category.id}`}
                  onClick={(e) => scrollToCategory(e, category.id)}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-all",
                    activeCategory === category.id
                      ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                      : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100"
                  )}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-16">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {sectionHeading}
              </h1>
            </div>

            <div className="space-y-32">
              {categories.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className="scroll-mt-32"
                >
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
                      <span className="w-8 h-1 bg-cyan-600 rounded-full block"></span>
                      {category.title}
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed pl-11">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1  gap-6">
                    {category.services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        id={service.id}
                        title={service.title}
                        description={service.description}
                        imageSrc={service.imageSrc}
                        onRequestService={() => handleRequestService(service.title, category.title)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>

      <QuoteModal 
        open={isQuoteModalOpen} 
        onOpenChange={setIsQuoteModalOpen}
        initialProduct={selectedService ? {
          name: selectedService.name,
          category: selectedService.category
        } : undefined}
      />
    </main>
  );
}
