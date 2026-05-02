"use client";

import { Phone } from "lucide-react";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { contact } from "@/lib/constants";
import { trackEvent } from "@/app/components/analytics-events";

interface ProductQuickActionsProps {
  productName: string;
  productCategory: string;
}

export default function ProductQuickActions({
  productName,
  productCategory,
}: ProductQuickActionsProps) {
  const phoneForWa = contact.phoneMobileE164.replace(/[^0-9]/g, "");
  const productLine = productCategory
    ? `${productCategory} → ${productName}`
    : productName;
  const waMessage = `Hello GulfRakza, I'd like to enquire about: ${productLine}`;
  const whatsappUrl = `https://wa.me/${phoneForWa}?text=${encodeURIComponent(
    waMessage,
  )}`;

  const subject = `Enquiry: ${productName}`;
  const body = `Hello GulfRakza,\n\nI'd like more information about the following product:\n\n• ${productLine}\n\nPlease send pricing, lead time, and availability.\n\nThanks.`;
  const mailtoUrl = `mailto:${contact.emailPrimary}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  const telUrl = `tel:${contact.phoneMobileE164}`;

  const baseClass =
    "group flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition";

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
        className={`${baseClass} border-[#25D366]/30 bg-[#25D366]/5 text-[#1a8e4a] hover:bg-[#25D366] hover:text-white dark:border-[#25D366]/40 dark:bg-[#25D366]/10 dark:text-[#34d979]`}
      >
        <FaWhatsapp className="h-4 w-4" />
        <span className="hidden sm:inline">WhatsApp</span>
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
        className={`${baseClass} border-[#08778c]/30 bg-[#08778c]/5 text-[#08778c] hover:bg-[#08778c] hover:text-white dark:border-[#08778c]/40 dark:bg-[#08778c]/10 dark:text-[#35d2e9]`}
      >
        <FaEnvelope className="h-4 w-4" />
        <span className="hidden sm:inline">Email</span>
      </a>
      <a
        href={telUrl}
        aria-label={`Call ${contact.phoneMobileDisplay}`}
        className={`${baseClass} border-gray-200 bg-white text-gray-800 hover:border-gray-900 hover:bg-gray-900 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900`}
      >
        <Phone className="h-4 w-4" />
        <span className="hidden sm:inline">Call</span>
      </a>
    </div>
  );
}
