"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLocale, useTranslations } from "@/i18n/provider";

type FormData = {
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
};

const ContactForm: React.FC = () => {
  const t = useTranslations("forms.contactForm");
  const section = useTranslations("home.contact");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "success" || status === "error") {
      timer = setTimeout(() => {
        setStatus("idle");
        if (status === "success") reset();
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [status, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setStatus("loading");

    // Prepend name/company context into the message body so the email template captures it
    const enrichedMessage = [
      `From: ${data.name}${data.company ? ` — ${data.company}` : ""}`,
      "",
      data.message,
    ].join("\n");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          subject: data.subject,
          message: enrichedMessage,
          formType: "contact",
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || t("errorNote"));
        setStatus("error");
      }
    } catch {
      setErrorMessage(t("errorNote"));
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#111] focus:bg-white focus:ring-0 placeholder:text-gray-400";
  const labelClass = "mb-1.5 block text-xs font-medium tracking-wide text-gray-600 uppercase";

  return (
    <section
      id="contact-us"
      className="bg-white py-24 font-inter lg:py-32"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">

          {/* Left: Info column */}
          <div>
            <p className="mb-4 text-xs font-medium tracking-[0.2em] uppercase text-gray-400">
              Contact
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-[#111] lg:text-5xl">
              {section("heading")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#6b6b6b]">
              {section("description")}
            </p>

            {/* Contact details */}
            <div className="mt-10 space-y-5">
              <a
                href={`mailto:${section("details.email")}`}
                className="flex items-start gap-4 group"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-[#111]">
                  <svg className="h-4 w-4 text-gray-500 transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Email</p>
                  <p className="mt-0.5 text-sm text-[#111] group-hover:underline">
                    {section("details.email")}
                  </p>
                </div>
              </a>

              <a
                href={`tel:${section("details.phone").replace(/\s/g, "")}`}
                className="flex items-start gap-4 group"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-[#111]">
                  <svg className="h-4 w-4 text-gray-500 transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Phone</p>
                  <p className="mt-0.5 text-sm text-[#111] group-hover:underline">
                    {section("details.phone")}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Location</p>
                  <p className="mt-0.5 text-sm text-[#111]">
                    {section("details.location")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form column */}
          <div className="relative">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`space-y-5 transition-opacity duration-300 ${
                status === "success" || status === "error"
                  ? "pointer-events-none opacity-0"
                  : "opacity-100"
              }`}
            >
              {/* Name + Company row */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    {t("labels.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", { required: t("errors.nameRequired") })}
                    placeholder={t("placeholders.name")}
                    className={inputClass}
                  />
                  {errors.name && (
                    <span className="mt-1 block text-xs text-red-500">{errors.name.message}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="company" className={labelClass}>
                    {t("labels.company")}
                  </label>
                  <input
                    type="text"
                    id="company"
                    {...register("company")}
                    placeholder={t("placeholders.company")}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  {t("labels.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: t("errors.emailRequired"),
                    pattern: { value: /\S+@\S+\.\S+/, message: t("errors.emailFormat") },
                  })}
                  placeholder={t("placeholders.email")}
                  className={inputClass}
                />
                {errors.email && (
                  <span className="mt-1 block text-xs text-red-500">{errors.email.message}</span>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className={labelClass}>
                  {t("labels.subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register("subject", { required: t("errors.subjectRequired") })}
                  placeholder={t("placeholders.subject")}
                  className={inputClass}
                />
                {errors.subject && (
                  <span className="mt-1 block text-xs text-red-500">{errors.subject.message}</span>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className={labelClass}>
                  {t("labels.message")}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message", { required: t("errors.messageRequired") })}
                  placeholder={t("placeholders.message")}
                  className={`${inputClass} resize-none`}
                />
                {errors.message && (
                  <span className="mt-1 block text-xs text-red-500">{errors.message.message}</span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="relative w-full rounded-full bg-[#111] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-[#111] focus:ring-offset-2 disabled:opacity-50"
              >
                <span className={status === "loading" ? "invisible" : ""}>
                  {t("submit")}
                </span>
                {status === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  </div>
                )}
              </button>
            </form>

            <AnimatePresence>
              {(status === "success" || status === "error") && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                    {status === "success" ? (
                      <>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                          <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#111]">{t("successTitle")}</h3>
                        <p className="mt-2 text-sm text-[#6b6b6b]">{t("successBody")}</p>
                        <p className="mt-2 text-xs text-gray-400">{t("successNote")}</p>
                      </>
                    ) : (
                      <>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                          <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#111]">{t("errorTitle")}</h3>
                        <p className="mt-2 text-sm text-[#6b6b6b]">{errorMessage}</p>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
