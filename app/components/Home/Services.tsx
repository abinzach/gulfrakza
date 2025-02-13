// pages/services.jsx
import React from 'react';
import { DarkGridHero } from './DarkGrid';
import { GridPatternCard, GridPatternCardBody } from '@/components/ui/card-with-grid-ellipsis-pattern';

const serviceCategories = [
    {
        title: "Scaffolding Services",
        description: "Safe, compliant scaffolding solutions for every worksite.",
        imageSrc: "/images/services/scaffolding.jpg",
        link: "/services/scaffolding"
    },
    {
        title: "PEB Shed Fabrication",
        description: "Custom pre-engineered building solutions designed to your specifications.",
        imageSrc: "/images/services/peb-shed.jpg",
        link: "/services/peb-shed"
    },
    {
        title: "Civil Works",
        description: "Comprehensive civil engineering services that support infrastructure development.",
        imageSrc: "/images/services/civil-works.jpg",
        link: "/services/civil-works"
    },
    {
        title: "Steel & Aluminium Fabrication",
        description: "Precision fabrication services for durable, industrial-grade builds.",
        imageSrc: "/images/services/fabrication.jpg",
        link: "/services/fabrication"
    },
    {
        title: "Rope Access & Safety Training",
        description: "Expert training and rope access solutions to ensure safe, efficient operations.",
        imageSrc: "/images/services/rope-access.jpg",
        link: "/services/rope-access"
    },
    {
        title: "Industrial Trading",
        description: "A curated selection of industrial products to complement our service offerings.",
        imageSrc: "/images/services/trading.jpg",
        link: "/services/trading"
    }
];

export default function ServicesPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative font-inter h-[60vh] flex items-center justify-center bg-gray-900 text-center">
                <div className="absolute inset-0 bg-cover bg-center" ></div>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <DarkGridHero />

            </section>

            {/* Service Categories Overview */}
            <section className="py-32 bg-gray-50">
                <div className="max-w-7xl font-inter mx-auto px-4">
                    <h2 className="text-5xl font-semibold text-left mb-16">Our Service Offerings</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {serviceCategories.map((service, index) => (
                            <div key={index} >
                                <GridPatternCard >
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
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-5xl font-semibold text-left font-inter mb-4">Why Choose Our Services?</h2>
                    <p className="text-left font-raleway text-lg text-gray-600 mb-12">
                        At Gulf Rakza, our services are backed by industry-leading expertise, a commitment to quality, and a tailored approach to meet your unique needs. From rapid response times to uncompromised safety standards, we are your trusted partner for industrial excellence.
                    </p>
                    {/* Optionally add icons/infographics here */}
                    <div className="flex flex-wrap justify-center gap-8">
                        {/* Example icon block */}
                        <div className="flex flex-col items-center">
                            <img src="/icons/expertise.svg" alt="Expertise" className="h-12 w-12 mb-2" />
                            <span className="text-gray-700 font-medium">Expertise</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src="/icons/quality.svg" alt="Quality Assurance" className="h-12 w-12 mb-2" />
                            <span className="text-gray-700 font-medium">Quality Assurance</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src="/icons/safety.svg" alt="Safety First" className="h-12 w-12 mb-2" />
                            <span className="text-gray-700 font-medium">Safety First</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="py-12 bg-blue-600 text-center text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="text-2xl font-bold mb-4">Ready to Elevate Your Operations?</h3>
                    <p className="mb-6">
                        Our experts are ready to provide personalized solutions to drive your industrial success.
                    </p>
                    <a href="/contact" className="inline-block px-6 py-3 bg-white text-blue-600 rounded font-medium hover:bg-gray-100">
                        Request a Quote
                    </a>
                </div>
            </section>
        </>
    );
}
