"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { contact } from "@/lib/constants";
import { trackEvent } from "@/app/components/analytics-events";
import type { Locale } from "@/i18n/config";

interface ProductQuickActionsProps {
  productName: string;
  productCategory: string;
  locale: Locale;
}

export default function ProductQuickActions({
  productName,
  productCategory,
  locale,
}: ProductQuickActionsProps) {
  const phoneForWa = contact.phoneMobileE164.replace(/[^0-9]/g, "");
  const productLine = productCategory
    ? `${productCategory} → ${productName}`
    : productName;
  const isArabic = locale === "ar";
  const waMessage = isArabic
    ? `مرحباً جلف ركزة، أود الاستفسار عن: ${productLine}`
    : `Hello GulfRakza, I'd like to enquire about: ${productLine}`;
  const whatsappUrl = `https://wa.me/${phoneForWa}?text=${encodeURIComponent(
    waMessage,
  )}`;

  const subject = isArabic ? `استفسار: ${productName}` : `Enquiry: ${productName}`;
  const body = isArabic
    ? `مرحباً جلف ركزة،\n\nأود الحصول على معلومات عن المنتج التالي:\n\n• ${productLine}\n\nيرجى إرسال السعر ومدة التوريد وحالة التوفر.\n\nشكراً.`
    : `Hello GulfRakza,\n\nI'd like more information about the following product:\n\n• ${productLine}\n\nPlease send pricing, lead time, and availability.\n\nThanks.`;
  const mailtoUrl = `mailto:${contact.emailPrimary}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  const telUrl = `tel:${contact.phoneMobileE164}`;

  const baseClass =
    "group flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap border px-3 py-2.5 text-sm font-semibold transition-colors duration-[var(--dur-short)] active:bg-[var(--color-paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2";

  const labels = isArabic
    ? { whatsapp: "واتساب", email: "البريد", call: "اتصال" }
    : { whatsapp: "WhatsApp", email: "Email", call: "Call" };

  return (
    <div className="grid grid-cols-3 gap-2">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("whatsapp_fab_click", {
            source: "product_detail_quick_action",
            product_category: productCategory,
          })
        }
        aria-label={`WhatsApp ${contact.phoneMobileDisplay}`}
        className={`${baseClass} border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:border-[var(--color-success)] hover:text-[var(--color-success)]`}
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{labels.whatsapp}</span>
      </a>
      <a
        href={mailtoUrl}
        onClick={() =>
          trackEvent("email_fab_click", {
            source: "product_detail_quick_action",
            product_category: productCategory,
          })
        }
        aria-label={`Email ${contact.emailPrimary}`}
        className={`${baseClass} border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)]`}
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{labels.email}</span>
      </a>
      <a
        href={telUrl}
        aria-label={`Call ${contact.phoneMobileDisplay}`}
        className={`${baseClass} border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]`}
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{labels.call}</span>
      </a>
    </div>
  );
}
