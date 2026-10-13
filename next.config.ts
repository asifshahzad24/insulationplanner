import type { NextConfig } from "next";

// Static export: the whole site is prebuilt HTML served from Cloudflare Pages.
// No server runtime, so no cacheComponents / rewrites / redirects / headers here
// (HTTP headers live in public/_headers instead).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  experimental: {
    // Multiple root layouts (one per market) → a single global 404 page.
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
