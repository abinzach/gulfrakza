// app/components/EmailInquiry.tsx
"use client";

import React from "react";


import { useTranslations } from "@/i18n/provider";
import { FaEnvelope } from "react-icons/fa";

const EmailInquiry: React.FC = () => {
  const t = useTranslations("common.contactPresets");
  const emailAddress = "info@gulfrakza.com";
  const subject = t("emailSubject");
  const body = t("emailBody");
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={mailtoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-32 right-10 z-20 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-white px-4 py-2 shadow-xl transition-colors hover:bg-gray-100"
    >
      <FaEnvelope size={50} className="text-black" />
    </a>
  );
};

export default EmailInquiry;
