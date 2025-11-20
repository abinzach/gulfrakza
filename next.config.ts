import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    ];
  },
};

export default nextConfig;
