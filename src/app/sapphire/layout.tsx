import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Sapphire turns 9! - A Fairy Princess Forest Birthday",
  description:
    "Sapphire is turning 9! Join us for a fairy-princess forest birthday party at Moreau Lake State Park on Saturday, June 20, 2026. Pizza, cake, swimming, and woodland fun.",
  openGraph: {
    title: "Sapphire turns 9! - A Fairy Princess Forest Birthday",
    description:
      "Join Sapphire for a fairy-princess forest birthday at Moreau Lake State Park, June 20, 2026.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#244A2B",
};

export default function SapphireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
