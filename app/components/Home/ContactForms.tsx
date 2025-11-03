"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslations } from "@/i18n/provider";

type FormData = {
  email: string;
  subject: string;
  message: string;
};

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
  </div>
);

type SuccessMessageProps = {
  title: string;
  body: string;
  note: string;
};

const SuccessMessage: React.FC<SuccessMessageProps> = ({ title, body, note }) => (
  <motion.div
    initial={{ opacity: 0, x: -2000 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -2000 }}
    transition={{ duration: 0.2 }}
    className="mx-auto mt-10 max-w-screen-md rounded-lg bg-white p-6 text-center shadow-lg"
  >
    <svg
      className="mx-auto mb-4 h-16 w-16 text-cyan-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
    <p className="mb-4 text-gray-500">{body}</p>
    <p className="text-sm text-gray-500">{note}</p>
  </motion.div>
);

type ErrorMessageProps = {
  title: string;
  message: string;
  note: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message, note }) => (
  <motion.div
    initial={{ opacity: 0, x: -2000 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -2000 }}
    transition={{ duration: 0.2 }}
    className="mx-auto mt-10 max-w-screen-md rounded-lg bg-white p-6 text-center shadow-lg"
  >
    <svg
      className="mx-auto mb-4 h-16 w-16 text-red-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
    <p className="mb-4 text-gray-500">{message}</p>
    <p className="text-sm text-gray-500">{note}</p>
  </motion.div>
);

const ContactForm: React.FC = () => {
  const t = useTranslations("forms.contactForm");
  const section = useTranslations("home.contact");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setStatus("success");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || t("errorNote"));
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(t("errorNote"));
      setStatus("error");
    }
  };

  return (
    <section id="contact-us" className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-16">
        <h2 className="mb-4 text-center font-inter text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {section("heading")}
        </h2>
        <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
          {section("description")}
        </p>
        <div className="relative">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`space-y-8 transition-opacity duration-300 ${
              status === "success" || status === "error"
                ? "pointer-events-none opacity-0"
                : "opacity-100"
            }`}
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {t("labels.email")}
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: t("errors.emailRequired"),
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: t("errors.emailFormat"),
                  },
                })}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                placeholder={t("placeholders.email")}
              />
              {errors.email && (
                <span className="mt-1 text-xs text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {t("labels.subject")}
              </label>
              <input
                type="text"
                id="subject"
                {...register("subject", { required: t("errors.subjectRequired") })}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                placeholder={t("placeholders.subject")}
              />
              {errors.subject && (
                <span className="mt-1 text-xs text-red-500">{errors.subject.message}</span>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                {t("labels.message")}
              </label>
              <textarea
                id="message"
                rows={6}
                {...register("message", { required: t("errors.messageRequired") })}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                placeholder={t("placeholders.message")}
              />
              {errors.message && (
                <span className="mt-1 text-xs text-red-500">{errors.message.message}</span>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="relative rounded-full bg-cyan-600 py-3 px-5 text-sm font-medium text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-white dark:text-black dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              <span className={status === "loading" ? "invisible" : ""}>{t("submit")}</span>
              {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}
            </button>
          </form>
          <AnimatePresence>
            {(status === "success" || status === "error") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {status === "success" ? (
                  <SuccessMessage
                    title={t("successTitle")}
                    body={t("successBody")}
                    note={t("successNote")}
                  />
                ) : (
                  <ErrorMessage
                    title={t("errorTitle")}
                    message={errorMessage}
                    note={t("errorNote")}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
