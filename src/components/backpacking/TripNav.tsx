"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/backpacking-2026", label: "🏔️ Overview" },
  { href: "/backpacking-2026/routes", label: "🧭 Routes" },
  { href: "/backpacking-2026/gear", label: "🎒 Gear & Votes" },
  { href: "/backpacking-2026/guide", label: "🌲 Camp Guide" },
];

export default function TripNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[72px] z-40 -mx-4 mb-8 px-4 sm:-mx-6 sm:px-6">
      <div className="flex gap-1.5 overflow-x-auto rounded-full border border-sage/25 bg-cream/95 p-1.5 backdrop-blur-md dark:bg-[#12240F]/95">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                active
                  ? "bg-forest text-cream dark:bg-soft-gold dark:text-forest-dark"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
