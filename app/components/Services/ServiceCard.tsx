"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n/provider";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  className?: string;
  onRequestService?: () => void;
}

export default function ServiceCard({
  title,
  description,
  imageSrc,
  className,
  onRequestService,
}: ServiceCardProps) {
  const t = useTranslations("forms.quoteForm");

  return (
    <div
      onClick={onRequestService}
      className={cn(
        "group flex flex-col md:flex-row overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer",
        className
      )}
    >
      <div className="relative h-56 w-full md:h-auto md:w-[35%] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 35vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-800">
            <span className="text-4xl font-medium text-gray-200 dark:text-gray-700">
              {title.charAt(0)}
            </span>
          </div>
        )}
        {/* Overlay to hint interactiveness */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
        <div>
          <h3 className="mb-3 font-sans text-xl font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 transition-colors">
            {title}
          </h3>
          <p className="mb-6 font-sans text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2 md:line-clamp-3">
            {description}
          </p>
        </div>
        
        <div className="mt-auto flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-cyan-600 text-cyan-600 transition-all hover:bg-cyan-600 hover:text-white"
          >
            <Mail className="h-4 w-4" />
            {t("buttons.requestService")}
          </Button>
        </div>
      </div>
    </div>
  );
}
