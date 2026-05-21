import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Sapphire turns 9! - A Fairy Forest Birthday",
  description:
    "Sapphire is turning 9 years old! Join us for a fun filled day at Moreau Lake to celebrate with swimming, pizza, and cake.",
  openGraph: {
    title: "Sapphire turns 9! - A Fairy Forest Birthday",
    description:
      "Join us for a fun filled day at Moreau Lake to celebrate Sapphire with swimming, pizza, and cake.",
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
