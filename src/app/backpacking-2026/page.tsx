import type { Metadata } from "next";
import TripRecap from "@/components/backpacking/TripRecap";

export const metadata: Metadata = {
  title: "High Peaks Backpacking — Aug 15–16, 2026",
  description:
    "What the weekend actually cost: 36.5 miles, 9,840 feet of climbing, six High Peaks and 20½ hours on foot.",
  robots: { index: false },
};

export default function BackpackingRecapPage() {
  return <TripRecap />;
}
