import type { Metadata, Viewport } from "next";
import "./maple.css";

export const metadata: Metadata = {
  title: "Maple's Log",
  description: "Feeds, diapers, sleep and little moments for Maple Jane.",
  manifest: "/maple.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Maple",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/maple-icon.svg",
    apple: "/maple-apple-touch-icon.png",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1F0F" },
  ],
  viewportFit: "cover",
};

export default function MapleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
