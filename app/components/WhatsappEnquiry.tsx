// app/components/WhatsAppInquiry.tsx
"use client";

import React from "react";
import { useTranslations } from "@/i18n/provider";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppInquiry: React.FC = () => {
  const t = useTranslations("common.contactPresets");
  const phoneNumber = "+966557197311";
  const message = t("whatsappMessage");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-10 right-10 z-20 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-white px-4 py-2 shadow-xl transition-colors hover:bg-gray-100"
    >
      <FaWhatsapp size={50} className="text-black" />
    </a>
  );
};

export default WhatsAppInquiry;
