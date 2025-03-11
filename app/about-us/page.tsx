"use client";

import Image from "next/image";
import React from "react";
import StackedCardTestimonials from "../components/Home/Testimonial";
import DoubleScrollingLogos from "../components/Home/BrandLogo";

const AboutUsPage: React.FC = () => {
  return (
    <div>
      {/* Hero Image: Occupies half the viewport height, zooms on hover */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src="/images/about-us/about-us-hero.avif"
          alt="Gulf Rakza about us image"
          fill
          className="object-cover "
          priority
        />
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-16 p-6">
        {/* <h1 className="text-4xl font-inter font-light mb-6 text-gray-800 dark:text-white">
          <span className="font-normal">About</span> <span className="text-cyan-700">Gulf</span><span className="font-semibold text-cyan-700">Rakza</span>
        </h1> */}
        <p className="mb-6 leading-normal text-2xl font-raleway text-gray-500 dark:text-gray-300">
          Based in Dammam, Saudi Arabia, our trading company is a trusted partner for industries, offering top-quality industrial supplies, including spare parts, consumables, lubricants, chemicals, safety equipment, and hydraulic components. We are committed to delivering excellence in service and product quality, ensuring operational efficiency for our clients.
        </p>
        <section className="my-20">
          <h2 className="text-4xl font-inter mb-4 text-gray-800 dark:text-white">
            Our Vision & Mission
          </h2>
          <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
            Driven by the vision of <span className="font-semibold">&apos;Connecting Markets, Empowering Growth&apos;</span>, we focus on driving growth and fostering long-term partnerships built on trust, integrity, and reliability. Our skilled team delivers personalized and efficient service to meet the unique needs of every client.
          </p>
          <p className="text-gray-700 text-lg dark:text-gray-300">
            At Gulf Rakza, our vision is to consistently deliver exceptional performance by providing innovative products, services, EPC projects, and turnkey solutions across the Kingdom of Saudi Arabia. As a leader in material supply, we proudly offer reliable, high-quality, and cost-effective spare parts and materials, catering to industries from general manufacturing to aviation. We build strategic partnerships with global manufacturers, distributors, and service providers, embracing new business perspectives to ensure we continue to exceed client expectations.
          </p>
        </section>
        
      </main>
      <DoubleScrollingLogos/>
      <StackedCardTestimonials/>
    </div>
  );
};

export default AboutUsPage;
