"use client";

// app/components/Analytics.tsx
//
// Lightweight analytics shell. Each tracker is a no-op until the matching
// public env var is set, so this component can ship safely to production
// without requiring infra to be ready.
//
// Required env vars (all optional, all client-readable, prefixed with NEXT_PUBLIC_):
//   NEXT_PUBLIC_GTM_ID         — Google Tag Manager container ID (e.g. GTM-ABC1234)
//   NEXT_PUBLIC_GA_ID          — Direct GA4 measurement ID (e.g. G-XXXXXXX) if not using GTM
//   NEXT_PUBLIC_CLARITY_ID     — Microsoft Clarity project ID (10-char alphanumeric)
//
// Notes:
//   - GTM is preferred over GA4 direct because it lets marketing tweak tags
//     without redeploying. Provide ONLY ONE of GTM_ID or GA_ID — not both.
//   - All scripts are loaded with strategy="afterInteractive" so they don't
//     block first paint or interaction.
//   - The `<noscript>` GTM iframe is required by Google's documentation but is
//     intentionally inside the body (Next renders it where the component is
//     placed). Modern browsers ignore the iframe when JS is enabled.

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  analyticsConsentEventName,
  analyticsConsentStorageKey,
} from "@/app/components/CookieConsent";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export function Analytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      setHasConsent(window.localStorage.getItem(analyticsConsentStorageKey) === "accepted");
    };

    syncConsent();
    window.addEventListener(analyticsConsentEventName, syncConsent);
    return () => window.removeEventListener(analyticsConsentEventName, syncConsent);
  }, []);

  if (!hasConsent) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager */}
      {GTM_ID && (
        <>
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {/* Direct GA4 (only if GTM is NOT in use) */}
      {!GTM_ID && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });`,
            }}
          />
        </>
      )}

      {/* Microsoft Clarity */}
      {CLARITY_ID && (
        <Script
          id="ms-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
          }}
        />
      )}
    </>
  );
}
