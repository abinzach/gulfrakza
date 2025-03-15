// app/components/EmailInquiry.tsx
import React from "react";
import { FaEnvelope } from "react-icons/fa";
import Link from "next/link";

const EmailInquiry: React.FC = () => {
  // Replace with your actual email address
  const emailAddress = "info@gulfrakza.com";
  // Pre-filled subject and body
  const subject = "Inquiry about your services";
  const body = "Hello, I would like to inquire about your services.";
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <Link
      href={mailtoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex fixed border-4 border-white w-16 rounded-full h-16 bottom-32 right-10 items-center justify-center bg-white hover:bg-gray-100 transition-colors  px-4 py-2  cursor-pointer z-20 shadow-xl"
    >
      <FaEnvelope size={50} className="text-black" />
    </Link>
  );
};

export default EmailInquiry;
