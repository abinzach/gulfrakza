import type { NextConfig } from "next";

// ---------------------------------------------------------------------------
// Security headers
// Applied to every route. CSP starts in `report-only` so we don't break the
// site if a 3rd-party we forgot to allowlist sneaks in. Once stable in
// production, switch the header name to `Content-Security-Policy`.
// ---------------------------------------------------------------------------
const cspDirectives = [
  "default-src 'self'",
  // Next.js requires 'unsafe-inline' + 'unsafe-eval' for hydration & dev tooling.
  // 'self' covers our own JS bundles. Add specific 3rd-party hosts as needed.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://va.vercel-scripts.com",
  // 'unsafe-inline' covers Tailwind/inline style tags Next emits during streaming.
  "style-src 'self' 'unsafe-inline'",
  // Self-hosted next/font emits font files from /_next/static/media; data: covers favicons.
  "font-src 'self' data:",
  // Sanity CDN for product images, ImageKit for the homepage hero video poster, plus our own.
  "img-src 'self' data: blob: https://cdn.sanity.io https://ik.imagekit.io https://images.unsplash.com https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms",
  // Hero MP4 + future product videos from ImageKit.
  "media-src 'self' https://ik.imagekit.io",
  // Sanity GROQ + analytics endpoints.
  "connect-src 'self' https://*.sanity.io https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://va.vercel-scripts.com",
  // No iframes from untrusted origins.
  "frame-src 'self' https://www.google.com https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Start with report-only so production traffic is not broken by mistakes.
  // Promote to "Content-Security-Policy" once verified in real-world traffic.
  { key: "Content-Security-Policy-Report-Only", value: cspDirectives },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
  },
  // Vercel adds HSTS automatically, but explicit is safe.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/l3eswz12s/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Long-cache static assets (brand logos, category images, hero AVIF, etc.)
      {
        source: "/brands/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Redirect old hierarchical category URLs to main products page
      // Example: /products/welding/gas-welding-equipment/regulators -> /products
      {
        source: "/products/:category/:subcategory/:item",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/products/:category/:subcategory",
        destination: "/products",
        permanent: true,
      },
      // Catch the legacy single-segment category URLs that the homepage used to
      // link to (e.g. /products/safety) — these now correctly route to the
      // catalog page with a category filter applied via query string.
      {
        source: "/products/:category",
        destination: "/products?category=:category",
        permanent: true,
      },
      // Localized versions
      {
        source: "/:locale(en|ar)/products/:category/:subcategory/:item",
        destination: "/:locale/products",
        permanent: true,
      },
      {
        source: "/:locale(en|ar)/products/:category/:subcategory",
        destination: "/:locale/products",
        permanent: true,
      },
      {
        source: "/:locale(en|ar)/products/:category",
        destination: "/:locale/products?category=:category",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
