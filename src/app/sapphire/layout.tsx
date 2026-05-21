import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Sapphire turns 9! - A Magical Birthday Party",
  description:
    "Sapphire is turning 9! Join us for a magical fairy-princess birthday party at Moreau Lake State Park on Saturday, June 20, 2026. Pizza, cake, and adventure.",
  openGraph: {
    title: "Sapphire turns 9! - A Magical Birthday Party",
    description:
      "Join Sapphire for a magical fairy-princess birthday at Moreau Lake State Park, June 20, 2026.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#1B2A5C",
};

export default function SapphireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
