import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/l3eswz12s/**',
      },
    ],
  }/* config options here */
};

export default nextConfig;
