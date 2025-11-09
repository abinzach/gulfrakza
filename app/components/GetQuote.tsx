"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "@/i18n/provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: {
    name: string;
    category: string;
    subcategory: string;
    itemCategory: string;
  };
}

type QuoteFormState = {
  fullName: string;
  email: string;
  phone: string;
  productCategory: string;
  productSubcategory: string;
  productItemCategory: string;
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
    const productLine = `${t("template.product")} ${initialProduct.name}`;
    const categoryLine = `${t("template.category")} ${initialProduct.category}`;
    const subcategoryLine = initialProduct.subcategory
      ? `${t("template.subcategory")} ${initialProduct.subcategory}`
      : null;
    const itemCategoryLine = `${t("template.itemCategory")} ${initialProduct.itemCategory}`;
    const outro = t("template.outro");

    return [
      templateIntro,
      "",
      productLine,
      categoryLine,
      subcategoryLine,
      itemCategoryLine,
      "",
      outro,
    ]
      .filter(Boolean)
      .join("\n");
  }, [initialProduct, t]);

  const [formData, setFormData] = useState<QuoteFormState>({
    fullName: "",
    email: "",
    phone: "",
    productCategory: initialProduct?.category || "",
    productSubcategory: initialProduct?.subcategory || "",
    productItemCategory: initialProduct?.itemCategory || "",
    message: initialMessage,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open && initialProduct) {
      setFormData((prev) => ({
        ...prev,
        productCategory: initialProduct.category,
        productSubcategory: initialProduct.subcategory,
        productItemCategory: initialProduct.itemCategory,
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
          productSubcategory: initialProduct?.subcategory || "",
          productItemCategory: initialProduct?.itemCategory || "",
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
      const categoryParts = [formData.productCategory, formData.productSubcategory, formData.productItemCategory]
        .filter(Boolean)
        .join(" > ");

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
        productSubcategory: formData.productSubcategory,
        productItemCategory: formData.productItemCategory,
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
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{t("modalTitle")}</DialogTitle>
            {initialProduct && (
              <p className="mt-1 text-sm font-normal text-gray-600 dark:text-gray-400">
                {t("forLabel")}{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {initialProduct.name}
                </span>
              </p>
            )}
          </div>
          <DialogClose className="rounded-full p-1.5 hover:bg-gray-100" />
        </DialogHeader>

        <div className="mt-4">
          {success && (
            <Alert className="mb-6 border border-cyan-600 bg-cyan-100 text-cyan-800">
              <AlertTitle>{t("successTitle")}</AlertTitle>
              <AlertDescription>{t("successMessage")}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="fullName">{t("fields.fullName")}</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">{t("fields.email")}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">{t("fields.phone")}</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="productCategory">{t("fields.category")}</Label>
              <Input
                id="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                name="productCategory"
                placeholder={t("placeholders.category")}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="productSubcategory">{t("fields.subcategory")}</Label>
              <Input
                id="productSubcategory"
                value={formData.productSubcategory}
                onChange={handleChange}
                name="productSubcategory"
                placeholder={t("placeholders.subcategory")}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="productItemCategory">{t("fields.itemCategory")}</Label>
              <Input
                id="productItemCategory"
                value={formData.productItemCategory}
                onChange={handleChange}
                name="productItemCategory"
                placeholder={t("placeholders.itemCategory")}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">{t("fields.message")}</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder={t("placeholders.message")}
                className="mt-1"
              />
            </div>
            <div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                {submitting ? t("buttons.submitting") : t("buttons.submit")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
