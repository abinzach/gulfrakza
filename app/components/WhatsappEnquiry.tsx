// app/components/WhatsAppInquiry.tsx
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const WhatsAppInquiry: React.FC = () => {
  // Replace with your actual WhatsApp number (in international format without +)
  const phoneNumber = "+966557197311"; 
  // Pre-filled message (URL-encoded)
  const message = "Hello, I would like to inquire about your services.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    
      <Link
      href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex fixed border-4 border-white w-16 rounded-full h-16 bottom-10 right-10 items-center space-x-2 bg-green-500 px-4 py-2  hover:bg-green-600 transition-colors cursor-pointer z-20 shadow-xl"
      >
        <FaWhatsapp size={50} className="text-white" />
      </Link>
  );
};

export default WhatsAppInquiry;
