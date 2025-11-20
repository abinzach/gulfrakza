import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { getDirection, isLocale, defaultLocale } from "@/i18n/config";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${inter.className} bg-white`}>{children}</body>
    </html>
  );
}
