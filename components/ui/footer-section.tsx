"use client";

import * as React from "react";
import { useMessages, useTranslations } from "@/i18n/provider";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/app/components/Navbar";
import { Link } from "@/navigation";

type SocialItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  srLabel: string;
};

function Footerdemo() {
  const t = useTranslations("common.footer");
  const messages = useMessages();

  let addressLines: string[] = [];
  let phoneLines: string[] = [];

  if (messages && typeof messages === "object") {
    const commonSection = (messages as Record<string, unknown>).common;
    if (commonSection && typeof commonSection === "object") {
      const footerSection = (commonSection as Record<string, unknown>).footer;
      if (footerSection && typeof footerSection === "object") {
        const footerRecord = footerSection as Record<string, unknown>;
        if (Array.isArray(footerRecord.address)) {
          addressLines = footerRecord.address as string[];
        }
        if (Array.isArray(footerRecord.phones)) {
          phoneLines = footerRecord.phones as string[];
        }
      }
    }
  }

  const quickLinks: { href: string; label: string }[] = [
    { href: "/", label: t("links.home") },
    { href: "/about-us", label: t("links.about") },
    { href: "/#services", label: t("links.services") },
    { href: "/products", label: t("links.products") },
    { href: "/#contact-us", label: t("links.contact") },
  ];

  const socialItems: SocialItem[] = [
    {
      icon: <Facebook className="h-4 w-4" />,
      label: t("social.facebook"),
      href: "#",
      srLabel: "Facebook",
    },
    {
      icon: <Twitter className="h-4 w-4" />,
      label: t("social.twitter"),
      href: "#",
      srLabel: "Twitter",
    },
    {
      icon: <Instagram className="h-4 w-4" />,
      label: t("social.instagram"),
      href: "#",
      srLabel: "Instagram",
    },
    {
      icon: <Linkedin className="h-4 w-4" />,
      label: t("social.linkedin"),
      href: "#",
      srLabel: "LinkedIn",
    },
  ];

  return (
    <footer className="relative border-t bg-background px-4 text-foreground transition-colors duration-300 md:px-6">
      <div className="container mx-auto max-w-7xl py-12 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Logo />
            <p className="mb-6 font-inter text-xs text-gray-800">{t("tagline")}</p>
            <p className="font-inter text-sm text-gray-800">{t("companyName")}</p>
            <p className="font-inter text-sm text-gray-800">{t("commercialRegistration")}</p>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("quickLinks")}</h3>
            <nav className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("contactHeading")}</h3>
            <address className="space-y-2 text-sm not-italic">
              {addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {phoneLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p>{t("email")}</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">{t("followUs")}</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                {socialItems.map((item) => (
                  <Tooltip key={item.srLabel}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" asChild>
                        <a href={item.href} aria-label={item.srLabel}>
                          {item.icon}
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">{t("copyright")}</p>
          <nav className="flex gap-4 text-sm">
            <Link href="/privacy-policy" className="transition-colors hover:text-primary">
              {t("links.privacy")}
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-primary">
              {t("links.terms")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { Footerdemo };
