"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "@/i18n/provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  MessageSquare,
  Phone,
  ShieldCheck,
} from "lucide-react";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: Partial<{
    name: string;
    category: string;
    subcategory: string;
    itemCategory: string;
  }>;
}

const infoSteps = [
  { key: "submit", icon: MessageSquare },
  { key: "review", icon: Clock3 },
  { key: "proposal", icon: ShieldCheck },
] as const;

type QuoteFormState = {
  fullName: string;
  email: string;
  phone: string;
  productCategory: string;
  message: string;
};

export default function QuoteModal({
  open,
  onOpenChange,
  initialProduct,
}: QuoteModalProps) {
  const t = useTranslations("forms.quoteForm");

  const initialMessage = useMemo(() => {
    if (!initialProduct) {
      return "";
    }

    const templateIntro = t("template.intro");
    const summaryLine =
      initialProduct.category && initialProduct.name
        ? `${initialProduct.category} --> ${initialProduct.name}`
        : initialProduct.name || initialProduct.category || "";
    const outro = t("template.outro");

    return [templateIntro, "", summaryLine, "", outro]
      .filter((line) => line !== "")
      .join("\n");
  }, [initialProduct, t]);

  const [formData, setFormData] = useState<QuoteFormState>({
    fullName: "",
    email: "",
    phone: "",
    productCategory: initialProduct?.category || "",
    message: initialMessage,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open && initialProduct) {
      setFormData((prev) => ({
        ...prev,
        productCategory: initialProduct.category || "",
        message: initialMessage,
      }));
    }
  }, [open, initialProduct, initialMessage]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          productCategory: initialProduct?.category || "",
          message: initialProduct ? initialMessage : "",
        });
        setSuccess(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, initialProduct, initialMessage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const categoryParts = formData.productCategory;

      const subjectTemplate = t("emailSubject");
      const subject = subjectTemplate
        .replace("{categoryParts}", categoryParts || t("fields.category"))
        .replace("{name}", formData.fullName || t("fields.fullName"))
        .replace("{phone}", formData.phone || "-");

      const payload = {
        email: formData.email,
        subject,
        message: formData.message,
        fullName: formData.fullName,
        phone: formData.phone,
        productCategory: formData.productCategory,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, formType: "quote" }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote request");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error submitting quote request:", error);
    }

    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[24px] border border-gray-100 bg-white/95 p-0 shadow-2xl backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="grid h-full max-h-[92vh] min-h-0 lg:grid-cols-[1.1fr_0.7fr]">
          <div className="flex min-h-0 max-h-full flex-col">
            <div className="relative overflow-hidden border-b border-gray-100 bg-gray-50/90 px-5 py-5 dark:border-gray-800 dark:bg-gray-900/70">
              <div className="pointer-events-none absolute -right-6 top-6 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="pointer-events-none absolute left-8 bottom-0 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="relative flex flex-col gap-3">
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {t("modalTitle")}
                  </DialogTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t("subtitle")}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
              <div className="flex-1 min-h-0 space-y-4 overflow-y-auto px-5 py-5">
                {success && (
                  <Alert className="relative overflow-hidden rounded-3xl border-0 bg-emerald-50/90 p-6 text-emerald-900 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-100">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
                    <AlertTitle className="font-semibold">{t("successTitle")}</AlertTitle>
                    <AlertDescription>{t("successMessage")}</AlertDescription>
                  </Alert>
                )}

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                        {t("fields.fullName")}
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="rounded-lg border-gray-200 bg-white/80 px-3 py-2.5 text-sm focus-visible:ring-1 focus-visible:ring-cyan-600 dark:border-gray-700 dark:bg-gray-900/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                        {t("fields.email")}
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-lg border-gray-200 bg-white/80 px-3 py-2.5 text-sm focus-visible:ring-1 focus-visible:ring-cyan-600 dark:border-gray-700 dark:bg-gray-900/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                        {t("fields.phone")}
                      </Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="rounded-lg border-gray-200 bg-white/80 px-3 py-2.5 text-sm focus-visible:ring-1 focus-visible:ring-cyan-600 dark:border-gray-700 dark:bg-gray-900/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productCategory" className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                        {t("fields.category")}
                      </Label>
                      <Input
                        id="productCategory"
                        value={formData.productCategory}
                        onChange={handleChange}
                        name="productCategory"
                        placeholder={t("placeholders.category")}
                        className="rounded-lg border-gray-200 bg-white/80 px-3 py-2.5 text-sm focus-visible:ring-1 focus-visible:ring-cyan-600 dark:border-gray-700 dark:bg-gray-900/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70">
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      {t("fields.message")}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("placeholders.message")}
                      className="rounded-lg border-gray-200 bg-white px-3 py-2.5 text-sm focus-visible:ring-1 focus-visible:ring-cyan-600 dark:border-gray-700 dark:bg-gray-900"
                    />
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {t("messageHelper")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 border-t border-cyan-200 bg-gradient-to-r from-cyan-50 to-white px-5 py-4 backdrop-blur-lg dark:border-cyan-900/30 dark:from-cyan-950/20 dark:to-gray-900/95">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:from-cyan-500 hover:to-cyan-400 hover:shadow-xl hover:shadow-cyan-500/40 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("buttons.submitting")}
                    </>
                  ) : (
                    t("buttons.submit")
                  )}
                </Button>
              </div>
            </form>
          </div>

          <aside className="flex flex-col gap-5 bg-gradient-to-b from-cyan-900 via-slate-900 to-slate-950 px-6 py-8 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {t("infoPanel.heading")}
              </p>
              <div className="mt-6 space-y-6">
                {infoSteps.map(({ key, icon: Icon }) => (
                  <div key={key} className="flex gap-4">
                    <div className="mt-1 rounded-2xl bg-white/10 p-2 text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {t(`infoPanel.steps.${key}.title`)}
                      </p>
                      <p className="text-sm text-white/70">
                        {t(`infoPanel.steps.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm font-semibold">
                {t("infoPanel.supportHeading")}
              </p>
              <p className="mt-2 text-sm text-white/70">
                {t("infoPanel.supportDescription")}
              </p>
              <div className="mt-5 space-y-3">
                <a
                  href="tel:+971561234567"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-white" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                        {t("infoPanel.phoneLabel")}
                      </p>
                      <p className="text-base font-semibold">+971 56 123 4567</p>
                    </div>
                  </div>
                  <span className="text-xs text-white/60">GST</span>
                </a>
               
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-white/20 p-5 text-sm text-white/70">
              {t("infoPanel.cta")}
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
