"use client";

import { useEffect, useState } from "react";
import { ROUTES, type RouteDoc, type Leg } from "@/lib/backpacking-routes";

/* The mile-by-mile companion to the route decider. The decider answers "which
   plan?"; this answers "OK, but how do I actually walk it?" — every junction,
   which way to turn, and where people get it wrong. */

const KIND_LABEL: Record<RouteDoc["kind"], string> = {
  approach: "🎒 Carry-in",
  summit: "⛰️ Summit run",
  detour: "🧭 Detour",
};

const FILTERS = [
  { id: "all", label: "Everything" },
  { id: "summit", label: "⛰️ Summit runs" },
  { id: "other", label: "🎒 Carry-in & detours" },
] as const;

function LegRow({ leg, isLast }: { leg: Leg; isLast: boolean }) {
  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {/* rail */}
      <div className="flex flex-col items-center">
        <span
          className={`mt-1 h-3 w-3 shrink-0 rounded-full border-2 ${
            leg.major
              ? "border-soft-gold bg-soft-gold"
              : "border-sage/50 bg-cream dark:bg-[#12240F]"
          }`}
        />
        {!isLast && <span className="mt-1 w-px grow bg-sage/25" />}
      </div>

      <div className="min-w-0 grow">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-mono text-xs font-bold tabular-nums text-soft-gold-dark dark:text-soft-gold">
            {leg.mi.toFixed(1)} mi
          </span>
          <span className={`text-sm ${leg.major ? "font-bold" : "font-semibold"}`}>{leg.at}</span>
          {leg.ele && <span className="text-[11px] opacity-60">{leg.ele}</span>}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed opacity-85">{leg.doThis}</p>
        {leg.note && <p className="mt-1 text-xs italic opacity-65">{leg.note}</p>}
        {leg.warn && (
          <p className="mt-1.5 rounded bg-soft-gold/20 px-2 py-1 text-xs leading-relaxed">
            ⚠️ {leg.warn}
          </p>
        )}
      </div>
    </li>
  );
}

function RouteCard({ route, open, onToggle }: { route: RouteDoc; open: boolean; onToggle: () => void }) {
  return (
    <div id={`route-${route.id}`} className="soft-card dark:soft-card-dark scroll-mt-24 overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-sage/5"
      >
        <span className="mt-0.5 shrink-0 text-sm opacity-60">{open ? "▾" : "▸"}</span>
        <span className="min-w-0 grow">
          <span className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[11px] font-semibold">
              {KIND_LABEL[route.kind]}
            </span>
            {route.planningGrade && (
              <span className="rounded-full bg-soft-gold/25 px-2 py-0.5 text-[11px] font-semibold">
                estimated mileage
              </span>
            )}
          </span>
          <span className="mt-1.5 block font-semibold">{route.title}</span>
          <span className="mt-0.5 block text-xs opacity-70">{route.path}</span>
          <span className="mt-1.5 block text-xs font-semibold opacity-80">
            {route.dist} · {route.gain} · {route.time}
          </span>
        </span>
      </button>

      {open && (
        <div className="border-t border-sage/20">
          <p className="border-b border-sage/15 bg-sage/5 px-5 py-3 text-sm leading-relaxed opacity-90">
            {route.summary}
          </p>

          <div className="border-b border-sage/15 px-5 py-2.5 text-xs">
            <span className="font-bold uppercase tracking-wide opacity-60">Trail markers · </span>
            <span className="opacity-85">{route.markers}</span>
          </div>

          {route.variants && route.variants.length > 0 && (
            <div className="border-b border-sage/15 px-5 py-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide opacity-60">
                Pick your day
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-xs">
                  <thead>
                    <tr className="border-b border-sage/25 uppercase tracking-wide opacity-60">
                      <th className="py-1.5 pr-3">Itinerary</th>
                      <th className="py-1.5 pr-3">Round trip</th>
                      <th className="py-1.5 pr-3">Gain</th>
                      <th className="py-1.5">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage/15">
                    {route.variants.map((v) => (
                      <tr key={v.label}>
                        <td className="py-2 pr-3 font-semibold">{v.label}</td>
                        <td className="py-2 pr-3 tabular-nums">{v.dist}</td>
                        <td className="py-2 pr-3 tabular-nums">{v.gain}</td>
                        <td className="py-2 tabular-nums">{v.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {route.variants.some((v) => v.note) && (
                <ul className="mt-2 space-y-1 text-xs opacity-75">
                  {route.variants
                    .filter((v) => v.note)
                    .map((v) => (
                      <li key={v.label}>
                        <strong>{v.label}:</strong> {v.note}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}

          {/* the actual turn-by-turn */}
          <div className="px-5 py-4">
            <div className="mb-3 text-xs font-bold uppercase tracking-wide opacity-60">
              Mile by mile
            </div>
            <ol className="space-y-0">
              {route.legs.map((leg, i) => (
                <LegRow key={`${leg.mi}-${leg.at}`} leg={leg} isLast={i === route.legs.length - 1} />
              ))}
            </ol>
          </div>

          {route.warnings && route.warnings.length > 0 && (
            <div className="border-t border-sage/15 px-5 py-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide opacity-60">
                Read before you go
              </div>
              <ul className="space-y-1.5">
                {route.warnings.map((w) => (
                  <li key={w} className="rounded-lg bg-soft-gold/15 px-3 py-2 text-xs leading-relaxed">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* links + how they differ */}
          <div className="border-t border-sage/15 px-5 py-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide opacity-60">
              Maps & links — and how they differ from what we&apos;re walking
            </div>
            <ul className="space-y-2.5">
              {route.links.map((l) => (
                <li key={l.url} className="text-xs">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-semibold underline ${l.caution ? "decoration-soft-gold decoration-2" : ""}`}
                  >
                    {l.caution && "⚠️ "}
                    {l.label} ↗
                  </a>
                  <p className="mt-0.5 leading-relaxed opacity-75">{l.diff}</p>
                </li>
              ))}
              {route.caltopo && (
                <li className="text-xs">
                  <a
                    href={route.caltopo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline"
                  >
                    CalTopo — this area at hiking zoom ↗
                  </a>
                  <p className="mt-0.5 leading-relaxed opacity-75">
                    Real USGS topo, free in the browser, and it renders the herd paths and old trails
                    that AllTrails leaves off.
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RouteLibrary() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [openIds, setOpenIds] = useState<string[]>([]);

  /* The decider links straight at a route (#route-marshall-herbert), so a card
     arriving by hash has to open itself — otherwise you land on a closed row. */
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace(/^#route-/, "");
      if (!id || !ROUTES.some((r) => r.id === id)) return;
      setFilter("all");
      setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      requestAnimationFrame(() =>
        document.getElementById(`route-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const shown = ROUTES.filter(
    (r) =>
      filter === "all" ||
      (filter === "summit" ? r.kind === "summit" : r.kind !== "summit"),
  );
  const allOpen = shown.length > 0 && shown.every((r) => openIds.includes(r.id));

  const toggle = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === f.id
                ? "border-soft-gold bg-soft-gold/20"
                : "border-sage/30 hover:border-sage/70"
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setOpenIds(allOpen ? [] : shown.map((r) => r.id))}
          className="ml-auto text-xs font-semibold underline opacity-70 hover:opacity-100"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="space-y-3">
        {shown.map((r) => (
          <RouteCard key={r.id} route={r} open={openIds.includes(r.id)} onToggle={() => toggle(r.id)} />
        ))}
      </div>
    </div>
  );
}
