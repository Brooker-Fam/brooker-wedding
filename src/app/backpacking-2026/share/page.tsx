import type { Metadata } from "next";
import SharePanel from "@/components/backpacking/SharePanel";

export const metadata: Metadata = {
  title: "High Peaks — share card",
  description: "The weekend as one frame, sized for Instagram.",
  robots: { index: false },
};

export default function SharePage() {
  return <SharePanel />;
}
