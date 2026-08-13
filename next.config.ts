import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  serverExternalPackages: [
    "@axe-core/playwright",
    "axe-core",
    "playwright-core",
    "playwright"
  ],
  outputFileTracingExcludes: {
    '*': ['backend/**/*']
  }
};

export default nextConfig;
