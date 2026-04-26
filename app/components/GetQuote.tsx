"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@/i18n/provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/app/components/analytics-events";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  MessageSquare,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { contact } from "@/lib/constants";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: Partial<{
    name: string;
    category: string;
    subcategory: string;
    itemCategory: string;
  }>;
  serviceOptions?: Array<{
    id: string;
    title: string;
  }>;
  initialSelectedServiceIds?: string[];
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

const areSameSelection = (left: string[], right: string[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
};

export default function QuoteModal({
  open,
  onOpenChange,
  initialProduct,
  serviceOptions,
  initialSelectedServiceIds,
}: QuoteModalProps) {
  const t = useTranslations("forms.quoteForm");
  const initialCategory = initialProduct?.category || "";
  const initialName = initialProduct?.name || "";

  const availableServiceOptions = useMemo(
    () =>
      (serviceOptions || []).filter(
        (
          option,
        ): option is {
          id: string;
          title: string;
        } => Boolean(option?.id && option?.title),
      ),
    [serviceOptions],
  );
  const serviceLookup = useMemo(
    () => new Map(availableServiceOptions.map((service) => [service.id, service])),
    [availableServiceOptions],
  );

  const defaultSelectedServiceIds = useMemo(() => {
    const selectedFromProps = (initialSelectedServiceIds || []).filter((serviceId) =>
      serviceLookup.has(serviceId),
    );
    if (selectedFromProps.length > 0) {
      return selectedFromProps;
    }

    if (!initialName) {
      return [];
    }

    const matchedService = availableServiceOptions.find((service) => service.title === initialName);
    return matchedService ? [matchedService.id] : [];
  }, [availableServiceOptions, initialName, initialSelectedServiceIds, serviceLookup]);

  const buildCategorySummary = useCallback(
    (serviceIds: string[]) => {
      const selectedTitles = serviceIds
        .map((serviceId) => serviceLookup.get(serviceId)?.title)
        .filter((title): title is string => Boolean(title));

      if (selectedTitles.length === 0) {
        return initialCategory;
      }

      const serviceSummary = selectedTitles.join(", ");
      return initialCategory ? `${initialCategory}: ${serviceSummary}` : serviceSummary;
    },
    [initialCategory, serviceLookup],
  );

  const buildMessageTemplate = useCallback(
    (serviceIds: string[]) => {
      const templateIntro = t("template.intro");
      const outro = t("template.outro");
      const selectedTitles = serviceIds
        .map((serviceId) => serviceLookup.get(serviceId)?.title)
        .filter((title): title is string => Boolean(title));

      if (selectedTitles.length > 0) {
        return [
          templateIntro,
          "",
          t("template.products"),
          ...selectedTitles.map((title) => `- ${title}`),
          "",
          outro,
        ]
          .filter((line) => line !== "")
          .join("\n");
      }

      if (!initialProduct) {
        return "";
      }

      const summaryLine =
        initialCategory && initialName ? `${initialCategory} --> ${initialName}` : initialName || initialCategory;

      return [templateIntro, "", summaryLine, "", outro]
        .filter((line) => line !== "")
        .join("\n");
    },
    [initialCategory, initialName, initialProduct, serviceLookup, t],
  );

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    defaultSelectedServiceIds,
  );
  const [formData, setFormData] = useState<QuoteFormState>({
    fullName: "",
    email: "",
    phone: "",
    productCategory: buildCategorySummary(defaultSelectedServiceIds),
    message: buildMessageTemplate(defaultSelectedServiceIds),
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const wasOpenRef = useRef(false);
  const lastInitializedContextRef = useRef<string | null>(null);
  const quoteContextKey = useMemo(() => {
    const optionsKey = availableServiceOptions.map((service) => service.id).join("|");
    const selectedKey = (initialSelectedServiceIds || []).join("|");
    return `${initialCategory}__${initialName}__${optionsKey}__${selectedKey}`;
  }, [availableServiceOptions, initialCategory, initialName, initialSelectedServiceIds]);

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;
    const contextChangedWhileOpen =
      open && wasOpenRef.current && lastInitializedContextRef.current !== quoteContextKey;

    if (justOpened || contextChangedWhileOpen) {
      const nextCategory = buildCategorySummary(defaultSelectedServiceIds);
      const nextMessage = buildMessageTemplate(defaultSelectedServiceIds);

      setSelectedServiceIds((prev) =>
        areSameSelection(prev, defaultSelectedServiceIds) ? prev : defaultSelectedServiceIds,
      );
      setFormData((prev) => {
        if (prev.productCategory === nextCategory && prev.message === nextMessage) {
          return prev;
        }

        return {
          ...prev,
          productCategory: nextCategory,
          message: nextMessage,
        };
      });

      lastInitializedContextRef.current = quoteContextKey;
    }

    if (!open) {
      lastInitializedContextRef.current = null;
    }

    wasOpenRef.current = open;
  }, [
    open,
    quoteContextKey,
    defaultSelectedServiceIds,
    buildCategorySummary,
    buildMessageTemplate,
  ]);

  useEffect(() => {
    if (!open || availableServiceOptions.length === 0) {
      return;
    }

    const nextCategory = buildCategorySummary(selectedServiceIds);
    const nextMessage = buildMessageTemplate(selectedServiceIds);

    setFormData((prev) => {
      if (prev.productCategory === nextCategory && prev.message === nextMessage) {
        return prev;
      }

      return {
        ...prev,
        productCategory: nextCategory,
        message: nextMessage,
      };
    });
  }, [
    open,
    availableServiceOptions.length,
    selectedServiceIds,
    buildCategorySummary,
    buildMessageTemplate,
  ]);

  useEffect(() => {
    if (open) {
      return;
    }

    const timer = setTimeout(() => {
      const resetCategory = buildCategorySummary(defaultSelectedServiceIds);
      const resetMessage = buildMessageTemplate(defaultSelectedServiceIds);

      setSelectedServiceIds((prev) =>
        areSameSelection(prev, defaultSelectedServiceIds) ? prev : defaultSelectedServiceIds,
      );
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        productCategory: resetCategory,
        message: resetMessage,
      });
      setFormStartedAt(Date.now());
      setSuccess(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [open, defaultSelectedServiceIds, buildCategorySummary, buildMessageTemplate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceSelection = useCallback(
    (serviceId: string) => {
      setSelectedServiceIds((current) => {
        const selectedSet = new Set(current);
        if (selectedSet.has(serviceId)) {
          selectedSet.delete(serviceId);
        } else {
          selectedSet.add(serviceId);
        }

        return availableServiceOptions
          .map((service) => service.id)
          .filter((id) => selectedSet.has(id));
      });
    },
    [availableServiceOptions],
  );

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
        website: "",
        formStartedAt,
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

      trackEvent("quote_form_submit", {
        form_type: "quote",
        selected_services: selectedServiceIds.length,
      });
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

                {availableServiceOptions.length > 0 && (
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          {t("serviceSelector.title")}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {t("serviceSelector.helper")}
                        </p>
                      </div>

                      <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                        {availableServiceOptions.map((service) => {
                          const isSelected = selectedServiceIds.includes(service.id);
                          return (
                            <label
                              key={service.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                                isSelected
                                  ? "border-cyan-500 bg-cyan-50 dark:border-cyan-500/60 dark:bg-cyan-950/40"
                                  : "border-gray-200 bg-white hover:border-cyan-300 dark:border-gray-700 dark:bg-gray-900/80"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleServiceSelection(service.id)}
                                className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600 dark:border-gray-600 dark:bg-gray-900"
                              />
                              <span className="text-sm text-gray-800 dark:text-gray-100">
                                {service.title}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {selectedServiceIds.length === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-300">
                          {t("serviceSelector.validation")}
                        </p>
                      )}
                    </div>
                  </div>
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
                  disabled={submitting || (availableServiceOptions.length > 0 && selectedServiceIds.length === 0)}
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
                  href={`tel:${contact.phoneMobileE164}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:bg-white/10"
                  aria-label={`Call us at ${contact.phoneMobileDisplay}`}
                >
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-white" />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                        {t("infoPanel.phoneLabel")}
                      </p>
                      <p className="text-base font-semibold" dir="ltr">
                        {contact.phoneMobileDisplay}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-white/60">KSA</span>
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
