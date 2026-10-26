import type { NextConfig } from "next";

// Maple's Log lives at maple.brooker.family. Phones that installed it from
// brooker.family/maple keep this origin for their service worker, push
// subscription, session cookie and Siri Shortcuts, so its URLs here are
// proxied (not redirected) to the same path there.
const MAPLE_ORIGIN = "https://maple.brooker.family";
const MAPLE_PATHS = [
  "/maple",
  "/maple/:path*",
  "/maple.webmanifest",
  "/maple-icon.svg",
  "/maple-icon-192.png",
  "/maple-icon-512.png",
  "/maple-apple-touch-icon.png",
  "/maple-static/:path+",
  "/api/maple",
  "/api/maple/:path*",
  "/.well-known/oauth-protected-resource/api/maple/mcp",
  "/.well-known/oauth-protected-resource/maple",
];

const nextConfig: NextConfig = {
  // Let Vercel's image optimizer resize guest photos stored in Blob. The
  // gallery grid uses this for photos that predate client-side thumbnails
  // (thumb_url = null), so tiles never pull the full ~4096px original.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: MAPLE_PATHS.map((source) => ({
        source,
        destination: `${MAPLE_ORIGIN}${source}`,
      })),
      afterFiles: [
        // Standalone offline labor-support tool. Static file in public/, no
        // React, no build step -- see public/birth.html.
        { source: "/birth", destination: "/birth.html" },
        { source: "/birth/", destination: "/birth.html" },
        // PostHog reverse proxy — avoids ad-blockers and keeps events on same origin.
        // The /ingest/* paths are proxied to PostHog's ingestion endpoints.
        {
          source: "/ingest/static/:path*",
          destination: "https://us-assets.i.posthog.com/static/:path*",
        },
        {
          source: "/ingest/:path*",
          destination: "https://us.i.posthog.com/:path*",
        },
        {
          source: "/ingest/decide",
          destination: "https://us.i.posthog.com/decide",
        },
      ],
    };
  },
  // Required for PostHog's trailing-slash handling
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
