import type { Metadata } from "next";
import Link from "next/link";
import TripBoard from "@/components/backpacking/TripBoard";

export const metadata: Metadata = {
  title: "Gear & Votes — High Peaks Backpacking",
};

export default function GearPage() {
  return (
    <div>
      <TripBoard />
      <p className="mt-8 text-sm opacity-75">
        What we&apos;re eating and how the bear cans get packed lives on the{" "}
        <Link className="underline" href="/backpacking-2026/guide">
          Camp Guide
        </Link>
        .
      </p>
    </div>
  );
}
