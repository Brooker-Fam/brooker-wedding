"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Every page under the section except the recap and the share card is pre-trip
// planning. Forecasts and open questions on those pages are stale by definition
// now, so say so once, here.
const POST_TRIP = ["/backpacking-2026", "/backpacking-2026/share"];

export default function PlanningArchiveNote() {
  const pathname = usePathname();
  if (POST_TRIP.includes(pathname)) return null;

  return (
    <div className="mb-6 rounded-2xl border border-sage/30 bg-sage/10 px-4 py-3 text-sm leading-relaxed dark:border-soft-gold/25">
      <strong>Planning archive.</strong> This is how we got ready before Aug 15–16. Anything
      live on it — forecasts, open votes, conditions — is frozen at pre-trip.{" "}
      <Link className="font-semibold underline" href="/backpacking-2026">
        See how the weekend actually went →
      </Link>
    </div>
  );
}
