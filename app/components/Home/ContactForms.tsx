"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";

type FormData = {
  email: string;
  subject: string;
  message: string;
};

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
  </div>
);

const SuccessMessage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: -2000 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -2000 }}
    transition={{ duration: 0.2 }}
    className="bg-white shadow-lg rounded-lg p-6 max-w-screen-md mx-auto mt-10 text-center"
  >
    <svg
      className="w-16 h-16 text-cyan-500 mx-auto mb-4"
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
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
    <p className="text-gray-500 mb-4">
      Your enquiry has been successfully sent. We will get back to you soon.
    </p>
    <p className="text-sm text-gray-500">
      This message will disappear in a few seconds...
    </p>
  </motion.div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, x: -2000 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -2000 }}
    transition={{ duration: 0.2 }}
    className="bg-white shadow-lg rounded-lg p-6 max-w-screen-md mx-auto mt-10 text-center"
  >
    <svg
      className="w-16 h-16 text-red-500 mx-auto mb-4"
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
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
    <p className="text-gray-500 mb-4">{message}</p>
    <p className="text-sm text-gray-500">Please try again later.</p>
  </motion.div>
);

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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
        setErrorMessage(errorData.message || "Failed to send message.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section id="contact-us" className="bg-white dark:bg-gray-900">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-6xl">
        <h2 className="mb-4 font-inter text-5xl tracking-tight font-semibold text-center text-gray-900 dark:text-white">
          Contact Us
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          Have an enquiry about our products or services? We are here to help.
          Please fill out the form below and our team will get back to you
          shortly.
        </p>
        <div className="relative">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`space-y-8 transition-opacity duration-300 ${
              status === "success" || status === "error"
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                           focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 
                           dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                           dark:focus:ring-cyan-500 dark:focus:border-cyan-500 dark:shadow-sm-light"
                placeholder="name@example.com"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                {...register("subject", { required: "Subject is required" })}
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 
                           shadow-sm focus:ring-cyan-500 focus:border-cyan-500 
                           dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                           dark:focus:ring-cyan-500 dark:focus:border-cyan-500 dark:shadow-sm-light"
                placeholder="Let us know how we can help you"
              />
              {errors.subject && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.subject.message}
                </span>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Your message
              </label>
              <textarea
                id="message"
                rows={6}
                {...register("message", { required: "Message is required" })}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 
                           focus:ring-cyan-500 focus:border-cyan-500 
                           dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                           dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
                placeholder="Leave a comment..."
              ></textarea>
              {errors.message && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.message.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="relative py-3 px-5 text-sm font-medium font-inter text-center text-white dark:text-black rounded-full bg-cyan-600 
             sm:w-fit hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 
             dark:bg-white dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              <span className={status === "loading" ? "invisible" : ""}>
                Send Message
              </span>
              {status === "loading" && (
                <div className="absolute inset-0 flex justify-center items-center">
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
                className="absolute inset-0 flex justify-center items-center"
              >
                {status === "success" ? (
                  <SuccessMessage />
                ) : (
                  <ErrorMessage message={errorMessage} />
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
