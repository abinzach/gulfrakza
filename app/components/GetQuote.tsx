"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categoryOptions = [
  {
    value: "Safety",
    label: "Safety",
    subcategories: [
      "Personal Protective Equipment (PPE)",
      "Workwear",
      "Fall Protection",
      "Gas Detection",
      "Lockout Tagout (LOTO) Products",
    ],
  },
  {
    value: "Fire Safety",
    label: "Fire Safety",
    subcategories: [
      "Fire Extinguishers",
      "Fire Suppression Systems",
      "Fire Alarms & Detection",
      "Firefighting Equipment",
    ],
  },
  {
    value: "Security",
    label: "Security",
    subcategories: [
      "Surveillance Systems",
      "Access Control",
      "Perimeter Security",
      "Intrusion Detection",
    ],
  },
  {
    value: "Lifting",
    label: "Lifting",
    subcategories: [
      "Lifting Slings",
      "Hoists & Winches",
      "Lifting Hooks & Shackles",
      "Cranes & Load Testing Equipment",
    ],
  },
  {
    value: "Electrical",
    label: "Electrical",
    subcategories: [
      "Cables & Wires",
      "Electrical Panels & Components",
      "Industrial Lighting",
      "Transformers & Power Supplies",
    ],
  },
  {
    value: "Welding",
    label: "Welding",
    subcategories: [
      "Welding Machines",
      "Welding Consumables",
      "Welding Safety Gear",
      "Gas Welding Equipment",
    ],
  },
  {
    value: "Marine Equipments",
    label: "Marine Equipments",
    subcategories: [
      "Navigation & Communication",
      "Deck & Mooring Equipment",
      "Safety & Survival Equipment",
      "Marine Engines & Spare Parts",
    ],
  },
  {
    value: "Pneumatic & Hydraulic Fittings",
    label: "Pneumatic & Hydraulic Fittings",
    subcategories: [
      "Pneumatic Valves & Actuators",
      "Hydraulic Hoses & Fittings",
      "Air Compressors & Filters",
      "Pumps & Motors",
    ],
  },
  {
    value: "Industrial",
    label: "Industrial",
    subcategories: [
      "Industrial Tools",
      "Bearings & Mechanical Components",
      "Material Handling Equipment",
      "Industrial Chemicals",
    ],
  },
];

export default function GetQuote() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    productCategory: "",
    productSubcategory: "",
    message: "",
  });
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update subcategories when productCategory changes.
  useEffect(() => {
    const selected = categoryOptions.find(
      (cat) => cat.value === formData.productCategory
    );
    if (selected) {
      setSubcategories(selected.subcategories);
      // Reset subcategory when category changes.
      setFormData((prev) => ({ ...prev, productSubcategory: "" }));
    } else {
      setSubcategories([]);
    }
  }, [formData.productCategory]);

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
      // Simulate API call delay. Replace with your API call.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        productCategory: "",
        productSubcategory: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting quote request:", error);
    }
    setSubmitting(false);
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg rounded-md">
      <CardHeader>
        <CardTitle>Get a Quote</CardTitle>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="productCategory">Product Category</Label>
            <Select
              value={formData.productCategory}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, productCategory: value }))
              }
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {subcategories.length > 0 && (
            <div>
              <Label htmlFor="productSubcategory">Subcategory</Label>
              <Select
                value={formData.productSubcategory}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, productSubcategory: value }))
                }
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub, index) => (
                    <SelectItem key={index} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
      </CardContent>
    </Card>
  );
}
