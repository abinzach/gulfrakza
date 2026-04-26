"use client";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: "event", eventName: string, payload?: AnalyticsPayload) => void;
    clarity?: (command: "event", eventName: string) => void;
  }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer?.push({ event: eventName, ...payload });
  window.gtag?.("event", eventName, payload);
  window.clarity?.("event", eventName);
}
