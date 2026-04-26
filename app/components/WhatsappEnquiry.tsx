// app/components/WhatsAppInquiry.tsx
"use client";

import React from "react";
import { useTranslations } from "@/i18n/provider";
import { FaWhatsapp } from "react-icons/fa";
import { contact } from "@/lib/constants";
import { trackEvent } from "./analytics-events";

const WhatsAppInquiry: React.FC = () => {
  const t = useTranslations("common.contactPresets");
  const message = t("whatsappMessage");
  // wa.me requires the number without a "+" prefix
  const phoneForWa = contact.phoneMobileE164.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${phoneForWa}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_fab_click", { source: "floating_fab" })}
      aria-label={`Chat with us on WhatsApp at ${contact.phoneMobileDisplay}`}
      title={`WhatsApp ${contact.phoneMobileDisplay}`}
      className="fixed bottom-10 right-10 z-20 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-[#25D366] shadow-xl transition-colors hover:bg-[#1ebd5a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
    >
      <FaWhatsapp size={36} className="text-white" aria-hidden="true" />
    </a>
  );
};

export default WhatsAppInquiry;
