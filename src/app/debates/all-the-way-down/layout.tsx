import type { Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/* The disputation keeps the debate maps' editorial house type (Fraunces /
   IBM Plex) rather than the wedding fonts, so it reads as one of the
   Thought Pages family. */

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--atl-serif",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--atl-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--atl-mono",
  display: "swap",
});

// Browser chrome follows the ink ground rather than the wedding green.
export const viewport: Viewport = { themeColor: "#171922", colorScheme: "dark" };

export default function DisputationLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}>{children}</div>;
}
