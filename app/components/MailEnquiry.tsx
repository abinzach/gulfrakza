// app/components/EmailInquiry.tsx
"use client";

import React from "react";
import { useTranslations } from "@/i18n/provider";
import { FaEnvelope } from "react-icons/fa";
import { contact } from "@/lib/constants";
import { trackEvent } from "./analytics-events";

const EmailInquiry: React.FC = () => {
  const t = useTranslations("common.contactPresets");
  const subject = t("emailSubject");
  const body = t("emailBody");
  const mailtoUrl = `mailto:${contact.emailPrimary}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={mailtoUrl}
      onClick={() => trackEvent("email_fab_click", { source: "floating_fab" })}
      aria-label={`Email us at ${contact.emailPrimary}`}
      title={`Email ${contact.emailPrimary}`}
      className="fixed bottom-32 right-10 z-20 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-cyan-700 shadow-xl transition-colors hover:bg-cyan-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/40"
    >
      <FaEnvelope size={28} className="text-white" aria-hidden="true" />
    </a>
  );
};

export default EmailInquiry;
