import type { Metadata } from "next";
import { Inter, Raleway, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { getDirection, isLocale, defaultLocale } from "@/i18n/config";

// All three fonts are loaded through next/font (self-hosted, render-blocking-free,
// preloaded automatically) and exposed as CSS variables that the legacy
// `font-inter`, `font-raleway`, `font-hanken` utility classes in globals.css
// consume. The previously-loaded "Liter" font has been removed because it was
// not used anywhere in the codebase.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "GulfRakza | Industrial Supplies & Safety Equipment | Dammam, Saudi Arabia",
  description:
    "GulfRakza (Rakzah Gulf Trading Establishment) - Leading supplier of industrial supplies, PPE, safety equipment, and turnkey solutions in Dammam, Saudi Arabia. Serving the GCC with quality products.",
  robots: "index, follow",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  // Extract locale from URL pathname
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch && isLocale(localeMatch[1]) ? localeMatch[1] : defaultLocale;
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${raleway.variable} ${hanken.variable}`}
    >
      <body className={`${inter.className} bg-white`}>{children}</body>
    </html>
  );
}
