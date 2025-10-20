"use client";
import React, { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Props for the modal component
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

export default function QuoteModal({ open, onOpenChange, initialProduct }: QuoteModalProps) {
  const getInitialMessage = () => {
    if (!initialProduct) return "";
    
    const subcategoryLine = initialProduct.subcategory ? `Subcategory: ${initialProduct.subcategory}\n` : "";
    
    return `I'm interested in getting a quote for the following product:

Product: ${initialProduct.name}
Category: ${initialProduct.category}
${subcategoryLine}Item Category: ${initialProduct.itemCategory}

Please provide pricing, availability, and any additional product details.`;
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    productCategory: initialProduct?.category || "",
    productSubcategory: initialProduct?.subcategory || "",
    productItemCategory: initialProduct?.itemCategory || "",
    message: getInitialMessage(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update form when initialProduct changes (when modal opens with new product)
  useEffect(() => {
    if (open && initialProduct) {
      const subcategoryLine = initialProduct.subcategory ? `Subcategory: ${initialProduct.subcategory}\n` : "";
      
      setFormData((prev) => ({
        ...prev,
        productCategory: initialProduct.category,
        productSubcategory: initialProduct.subcategory,
        productItemCategory: initialProduct.itemCategory,
        message: `I'm interested in getting a quote for the following product:

Product: ${initialProduct.name}
Category: ${initialProduct.category}
${subcategoryLine}Item Category: ${initialProduct.itemCategory}

Please provide pricing, availability, and any additional product details.`,
      }));
    }
  }, [open, initialProduct]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      // Short delay to ensure animation completes before resetting form
      const timer = setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          productCategory: initialProduct?.category || "",
          productSubcategory: initialProduct?.subcategory || "",
          productItemCategory: initialProduct?.itemCategory || "",
          message: getInitialMessage(),
        });
        setSuccess(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, initialProduct]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      // Construct subject from form details
      const categoryParts = [
        formData.productCategory,
        formData.productSubcategory,
        formData.productItemCategory
      ].filter(Boolean).join(" > ");
      
      const subject = `Quote Request: ${categoryParts} from ${formData.fullName} (phone: ${formData.phone})`;

      const payload = {
        email: formData.email,
        subject,
        message: formData.message,
        formType: 'quote'
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
        
        // Close modal after short delay to show success message
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      } else {
        console.error("API Error:", await response.text());
      }
    } catch (error) {
      console.error("Error submitting quote request:", error);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Get a Quote</DialogTitle>
            {initialProduct && (
              <p className="mt-1 text-sm font-normal text-gray-600 dark:text-gray-400">
                For: <span className="font-medium text-gray-900 dark:text-gray-100">{initialProduct.name}</span>
              </p>
            )}
          </div>
          <DialogClose className="rounded-full p-1.5 hover:bg-gray-100">
           
          </DialogClose>
        </DialogHeader>
        
        <div className="mt-4">
          {success && (
            <Alert className="mb-6 border border-cyan-600 bg-cyan-100 text-cyan-800">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Thank you! Your quote request has been submitted.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
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
              <Label htmlFor="email">Email Address</Label>
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
              <Label htmlFor="phone">Phone Number</Label>
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
              <Label htmlFor="productCategory">Category</Label>
              <Input
                id="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                name="productCategory"
                placeholder="e.g., Safety, Lifting, etc."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="productSubcategory">Subcategory</Label>
              <Input
                id="productSubcategory"
                value={formData.productSubcategory}
                onChange={handleChange}
                name="productSubcategory"
                placeholder="e.g., PPE, Hoists, etc."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="productItemCategory">Item Category</Label>
              <Input
                id="productItemCategory"
                value={formData.productItemCategory}
                onChange={handleChange}
                name="productItemCategory"
                placeholder="e.g., Face Protection, Manual Hoists, etc."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your requirements"
                className="mt-1"
              />
            </div>
            <div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                {submitting ? "Submitting..." : "Submit Quote Request"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}