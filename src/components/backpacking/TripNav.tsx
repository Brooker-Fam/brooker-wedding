"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const RECAP = { href: "/backpacking-2026", label: "📊 Recap" };
const SHARE = { href: "/backpacking-2026/share", label: "📸 Share card" };

const PLANNING = [
  { href: "/backpacking-2026/plan", label: "🗓️ Plan" },
  { href: "/backpacking-2026/routes", label: "🧭 Routes" },
  { href: "/backpacking-2026/weather", label: "🌦️ Weather" },
  { href: "/backpacking-2026/gear", label: "🎒 Gear" },
  { href: "/backpacking-2026/guide", label: "🌲 Camp Guide" },
];

export default function TripNav() {
  const pathname = usePathname();

  const pill = (href: string, label: string, muted: boolean) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`whitespace-nowrap rounded-full transition-all ${
          muted ? "px-3 py-1.5 text-[13px] font-semibold" : "px-4 py-2 text-sm font-bold"
        } ${
          active
            ? "bg-forest text-cream dark:bg-soft-gold dark:text-forest-dark"
            : muted
              ? "opacity-55 hover:opacity-90"
              : "opacity-75 hover:opacity-100"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-2 z-40 -mx-4 mb-8 px-4 sm:-mx-6 sm:px-6">
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-full border border-sage/25 bg-cream/95 p-1.5 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:bg-[#12240F]/95">
        {pill(RECAP.href, RECAP.label, false)}
        {pill(SHARE.href, SHARE.label, false)}
        <span
          aria-hidden="true"
          className="ml-1 mr-0.5 hidden shrink-0 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest opacity-40 sm:inline"
        >
          before the trip
        </span>
        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-sage/30 dark:bg-soft-gold/25" />
        {PLANNING.map((t) => pill(t.href, t.label, true))}
      </div>
    </nav>
  );
}
