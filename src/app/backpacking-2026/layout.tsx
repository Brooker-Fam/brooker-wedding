import type { Metadata } from "next";
import TripNav from "@/components/backpacking/TripNav";

export const metadata: Metadata = {
  title: "High Peaks Backpacking — Aug 15–16, 2026",
  description:
    "Matt and Liam backpack the Adirondack High Peaks. Routes, gear claiming, schedule, and trail beta.",
  robots: { index: false },
};

export default function BackpackingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-soft-gold-dark dark:text-soft-gold">
          Brooker &amp; co. expedition
        </p>
        <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold sm:text-5xl">
          ⛰️ High Peaks Backpacking
        </h1>
        <p className="mt-2 opacity-80">
          Sat Aug 15 – Sun Aug 16, 2026 · Matt &amp; Liam
        </p>
      </header>
      <TripNav />
      {children}
    </div>
  );
}
