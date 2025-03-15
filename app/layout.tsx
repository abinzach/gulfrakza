import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FlyoutNav from "./components/Navbar";
import { Footerdemo } from "@/components/ui/footer-section";
import WhatsAppInquiry from "./components/WhatsappEnquiry";
import EmailInquiry from "./components/MailEnquiry";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rakzah Gulf Trading Establishment | Connecting Markets, Empowering Growth",
  description:
    "Based in Dammam, Saudi Arabia, Gulf Rakza Trading Company is a trusted partner offering top-quality industrial supplies and turnkey solutions that drive operational efficiency and growth.",
  keywords:
  [
    "Safety tools",
    "Safety gear",
    "PPE",
    "Coveralls",
    "Helmets",
    "Gloves",
    "Harness",
    "Lanyards",
    "Welding Tools & equipment",
    "Lifting tools",
    "Fire safety",
    "Industrial chemicals",
    "Industrial supplies",
    "Top quality industrial supplies in Saudi Arabia",
    "Top quality industrial supplies in Dammam",
    "Top quality industrial supplies in the Middle East"
  ],
  openGraph: {
    title: "Rakzah Gulf Trading Establishment | Connecting Markets, Empowering Growth",
    description:
      "Discover high-quality industrial supplies and turnkey solutions from Gulf Rakza – your trusted partner for operational excellence.",
    url: "https://www.gulfrakza.com",
    siteName: "Rakzah Gulf Trading Establishment",
    images: [
      {
        url: "https://www.gulfrakza.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rakzah Gulf Trading Establishment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakzah Gulf Trading Establishment",
    description:
      "Gulf Rakza is your trusted partner for industrial supplies and turnkey solutions – connecting markets and empowering growth.",
    images: ["https://www.gulfrakza.com/twitter-og-image.jpg"],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.gulfrakza.com" />
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="yOVCMHesyWms8TWeRX-79cIke_xi-07BdN_cfV25MeI"
        />
        {/* Favicon & Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} bg-white`}>
        {/* JSON-LD Structured Data */}
        <Script id="schema-script" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Rakzah Gulf Trading Establishment",
              "description": "Rakzah Gulf Trading Establishment is a trusted partner for industrial supplies and turnkey solutions, connecting markets and empowering growth.",
              "url": "https://www.gulfrakza.com",
              "logo": "https://www.gulfrakza.com/logo.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "2nd Floor, Salem Balhamer Building, Al Tubayshi District",
                "addressLocality": "Dammam",
                "postalCode": "32416",
                "addressCountry": "SA"
              },
              "telephone": "+966558975494",
              "email": "sales@gulfrakza.com"
            }
          `}
        </Script>
        <FlyoutNav />
        <main>{children}</main>
        <WhatsAppInquiry />
        <EmailInquiry />
        <Footerdemo />
      </body>
    </html>
  );
}
