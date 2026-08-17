import type { Metadata } from "next";
import TripRecap from "@/components/backpacking/TripRecap";

export const metadata: Metadata = {
  title: "Trip Recap — High Peaks Backpacking, Aug 15–16, 2026",
  description:
    "What the weekend actually cost: 36.5 miles, 9,840 feet of climbing, six High Peaks and 20½ hours on foot.",
  robots: { index: false },
};

export default function BackpackingRecapPage() {
  return (
    <div>
      <p className="mb-6 text-sm leading-relaxed opacity-80">
        We went. Here is what it added up to — four recorded activities across two days, plus the
        photo album. Six High Peaks: Marcy, Skylight and Gray on Saturday; Algonquin, Wright and
        Iroquois on Sunday.
      </p>
      <TripRecap />
    </div>
  );
}
