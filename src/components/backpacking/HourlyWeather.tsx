"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DAY_LABELS,
  SUMMIT_FT,
  SUN,
  TRIP_DAYS,
  TRIP_LAT,
  TRIP_LON,
  VALLEY_FT,
  etDayKey,
  etHour,
  fmtDay,
  fmtDayHour,
  fmtHour,
  hydrateHours,
  rainWindows,
  summitTemp,
  type Hour,
  type HourlyPeriod,
} from "@/lib/backpacking-weather";

/* Hour-by-hour rain for the trip window. The daily forecast tells you it might
   rain Saturday; this tells you it rains 2–7 PM and dumps a quarter inch,
   which is the difference between "go anyway" and "leave at 5 AM". */

function icon(short: string, day: boolean): string {
  const s = short.toLowerCase();
  if (s.includes("thunder")) return "⛈️";
  if (s.includes("snow")) return "🌨️";
  if (s.includes("rain") || s.includes("showers") || s.includes("drizzle")) return "🌧️";
  if (s.includes("fog")) return "🌫️";
  if (s.includes("partly") || s.includes("mostly sunny")) return day ? "🌤️" : "☁️";
  if (s.includes("cloudy")) return "☁️";
  if (s.includes("clear") || s.includes("sunny")) return day ? "☀️" : "🌙";
  return day ? "🌥️" : "☁️";
}

/** Bar colour by rain rate, so "drizzle" and "downpour" don't look the same. */
function barColor(h: Hour): string {
  if (h.thunder) return "bg-deep-plum";
  if (h.rainIn >= 0.1) return "bg-sage-dark";
  if (h.rainIn >= 0.02) return "bg-sage";
  if (h.precipPct >= 30) return "bg-sage-light";
  return "bg-sage/40";
}

const inches = (n: number) => (n < 0.005 ? "—" : `${n.toFixed(2)}"`);

function HourColumn({ hour, summit }: { hour: Hour; summit: boolean }) {
  const pct = Math.max(0, Math.min(100, hour.precipPct));
  const t = summit ? summitTemp(hour.tempF) : hour.tempF;
  return (
    <div
      className={`flex w-[3.75rem] shrink-0 flex-col items-center rounded-lg px-1 py-2 ${
        hour.isDaytime ? "bg-soft-gold/10" : "bg-forest/5 dark:bg-black/20"
      }`}
    >
      <div className="text-[11px] font-semibold tabular-nums opacity-80">{fmtHour(hour.start)}</div>
      <div className="my-0.5 text-lg leading-none">{icon(hour.short, hour.isDaytime)}</div>
      <div className="text-sm font-bold tabular-nums">{t}°</div>

      {/* precip probability bar, coloured by how hard it's actually raining */}
      <div className="mt-1.5 flex h-16 w-5 items-end overflow-hidden rounded-sm bg-sage/15">
        <div
          className={`w-full rounded-sm transition-all ${barColor(hour)}`}
          style={{ height: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] font-semibold tabular-nums opacity-75">{pct}%</div>
      <div
        className={`text-[10px] tabular-nums ${
          hour.rainIn >= 0.005 ? "font-semibold opacity-90" : "opacity-40"
        }`}
      >
        {inches(hour.rainIn)}
      </div>
      <div className="mt-0.5 text-center text-[9px] leading-tight opacity-60">
        {hour.windDirection} {hour.windSpeed.replace(" mph", "")}
      </div>
    </div>
  );
}

export default function HourlyWeather() {
  const [hours, setHours] = useState<Hour[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "partial" | "error">("loading");
  const [day, setDay] = useState<string>("2026-08-15");
  const [summit, setSummit] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const point = await (
          await fetch(`https://api.weather.gov/points/${TRIP_LAT},${TRIP_LON}`)
        ).json();

        const hourlyRes = await fetch(point.properties.forecastHourly);
        if (!hourlyRes.ok) throw new Error("hourly");
        const hourly = await hourlyRes.json();
        const periods: HourlyPeriod[] = hourly.properties.periods;

        // The grid is the only source of rain AMOUNTS. If it fails we can still
        // show timing and probability, so it gets its own try/catch.
        let qpf: { validTime: string; value: number | null }[] = [];
        let partial = false;
        try {
          const grid = await (await fetch(point.properties.forecastGridData)).json();
          qpf = grid.properties?.quantitativePrecipitation?.values ?? [];
          if (qpf.length === 0) partial = true;
        } catch {
          partial = true;
        }

        if (cancelled) return;
        setHours(hydrateHours(periods, qpf));
        setFetchedAt(new Date());
        setStatus(partial ? "partial" : "ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const byDay = useMemo(() => {
    const map = new Map<string, Hour[]>();
    for (const h of hours ?? []) {
      const k = etDayKey(h.start);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(h);
    }
    return map;
  }, [hours]);

  const tripHours = useMemo(
    () => TRIP_DAYS.flatMap((d) => byDay.get(d) ?? []),
    [byDay],
  );
  const windows = useMemo(() => rainWindows(tripHours), [tripHours]);
  const inRange = tripHours.length > 0;
  // Memoised so the `?? []` fallback doesn't hand the scroll effect a fresh
  // array (and a fresh scroll-to-dawn) on every render.
  const shown = useMemo(() => byDay.get(day) ?? [], [byDay, day]);

  const dayTotal = shown.reduce((s, h) => s + h.rainIn, 0);
  const dayPeak = shown.length ? Math.max(...shown.map((h) => h.precipPct)) : 0;
  const hikingHours = shown.filter((h) => etHour(h.start) >= 6 && etHour(h.start) <= 20);
  const hikingTotal = hikingHours.reduce((s, h) => s + h.rainIn, 0);

  /* Every day starts at midnight, so an untouched strip opens on six hours of
     nobody-is-awake. Scroll it to 5 AM — or earlier if rain beats us to it. */
  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || shown.length === 0) return;
    const firstWet = shown.findIndex((h) => h.precipPct >= 25);
    const dawn = shown.findIndex((h) => etHour(h.start) >= 5);
    const target = firstWet >= 0 ? Math.min(firstWet, Math.max(dawn, 0)) : dawn;
    const col = strip.children[Math.max(target, 0)] as HTMLElement | undefined;
    if (col) strip.scrollLeft = col.offsetLeft - strip.offsetLeft;
  }, [shown]);

  return (
    <div className="space-y-4">
      {/* Rain windows — the headline */}
      <div className="soft-card dark:soft-card-dark p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold">🌧️ When it rains, and how much</h3>
          <a
            href={`https://forecast.weather.gov/MapClick.php?lat=${TRIP_LAT}&lon=${TRIP_LON}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline opacity-70 hover:opacity-100"
          >
            full NWS forecast ↗
          </a>
        </div>

        {status === "loading" && <p className="mt-2 text-sm opacity-70">Loading forecast…</p>}
        {status === "error" && (
          <p className="mt-2 text-sm opacity-75">
            Couldn&apos;t reach the National Weather Service. Use the link above — same data,
            uglier.
          </p>
        )}

        {hours && !inRange && (
          <p className="mt-2 rounded-lg bg-sage/10 px-3 py-2 text-xs leading-relaxed">
            The NWS hourly forecast only runs ~7 days out and doesn&apos;t reach Aug 14–16 yet. This
            page fills in automatically once it does. Mid-August pattern up there: valley highs in
            the 70s, lows 45–55°F, summits in the 40s with wind, and afternoon thunderstorms most
            days.
          </p>
        )}

        {inRange && windows.length === 0 && (
          <p className="mt-2 rounded-lg bg-sage/15 px-3 py-2 text-sm">
            ☀️ <strong>No meaningful rain in the trip window.</strong> Nothing over 25% chance
            between Friday evening and Sunday night. Bring the shell anyway — this is the
            Adirondacks.
          </p>
        )}

        {inRange && windows.length > 0 && (
          <ul className="mt-3 space-y-2">
            {windows.map((w) => (
              <li
                key={w.start.toISOString()}
                className={`rounded-xl border px-4 py-3 text-sm ${
                  w.thunder ? "border-deep-plum/50 bg-deep-plum/10" : "border-sage/30 bg-sage/5"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-semibold">
                    {w.thunder && "⛈️ "}
                    {fmtDayHour(w.start)} → {fmtDayHour(w.end)}
                  </span>
                  <span className="text-xs font-semibold tabular-nums opacity-80">
                    {w.totalIn >= 0.005 ? `≈${w.totalIn.toFixed(2)}" total` : "trace"} · peak{" "}
                    {w.peakPct}%
                  </span>
                </div>
                {w.thunder && (
                  <p className="mt-1 text-xs">
                    Thunder in this window — that&apos;s a hard turnaround above treeline, not a
                    judgement call. Be below the trees before it starts.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {status === "partial" && (
          <p className="mt-3 text-xs opacity-70">
            ⚠️ Rain <em>amounts</em> weren&apos;t available from the NWS grid this load — timing and
            probability below are still good.
          </p>
        )}
      </div>

      {/* Hour by hour */}
      {inRange && (
        <div className="soft-card dark:soft-card-dark overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-sage/20 px-5 py-3">
            {TRIP_DAYS.filter((d) => byDay.has(d)).map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all ${
                  day === d ? "border-soft-gold bg-soft-gold/20" : "border-sage/30 hover:border-sage/70"
                }`}
              >
                {DAY_LABELS[d] ?? d}
              </button>
            ))}
            <button
              onClick={() => setSummit((s) => !s)}
              className={`ml-auto rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all ${
                summit ? "border-soft-gold bg-soft-gold/20" : "border-sage/30 hover:border-sage/70"
              }`}
            >
              {summit ? `⛰️ Summit ~${SUMMIT_FT.toLocaleString()} ft` : `🏕️ Valley ~${VALLEY_FT.toLocaleString()} ft`}
            </button>
          </div>

          {shown.length === 0 ? (
            <p className="px-5 py-4 text-sm opacity-70">
              No hourly data for {fmtDay(new Date(`${day}T12:00:00-04:00`))} yet.
            </p>
          ) : (
            <>
              <div className="grid gap-0 border-b border-sage/15 sm:grid-cols-3 sm:divide-x sm:divide-sage/15">
                {[
                  ["Rain this day", dayTotal >= 0.005 ? `≈${dayTotal.toFixed(2)}"` : "none"],
                  [
                    "During hiking hours (6a–8p)",
                    hikingTotal >= 0.005 ? `≈${hikingTotal.toFixed(2)}"` : "none",
                  ],
                  ["Peak chance", `${dayPeak}%`],
                  ].map(([label, value]) => (
                  <div key={label} className="px-5 py-3">
                    <div className="text-[11px] font-bold uppercase tracking-wide opacity-60">
                      {label}
                    </div>
                    <div className="mt-0.5 text-lg font-bold tabular-nums">{value}</div>
                  </div>
                ))}
              </div>

              <div className="px-3 py-4">
                <div ref={stripRef} className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:thin]">
                  {shown.map((h) => (
                    <HourColumn key={h.start.toISOString()} hour={h} summit={summit} />
                  ))}
                </div>
                <p className="mt-1 px-2 text-[11px] opacity-60">
                  Scroll either way for the rest of the day · gold columns are daylight · sunrise{" "}
                  {SUN[day]?.rise}, sunset {SUN[day]?.set}
                </p>
              </div>

              {/* legend */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-sage/15 px-5 py-3 text-[11px] opacity-80">
                <span className="font-bold uppercase tracking-wide opacity-70">Bar height = chance · colour = intensity</span>
                {[
                  ["bg-sage/40", "under 30%"],
                  ["bg-sage-light", "likely, little/no accumulation"],
                  ["bg-sage", "0.02–0.1 in/hr"],
                  ["bg-sage-dark", "0.1+ in/hr — real rain"],
                  ["bg-deep-plum", "thunderstorms"],
                ].map(([cls, label]) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className={`inline-block h-3 w-3 rounded-sm ${cls}`} />
                    {label}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-xs leading-relaxed opacity-70">
        Point forecast for the Lake Colden / Marcy Dam corridor (~{VALLEY_FT.toLocaleString()} ft).
        The summit toggle applies a standard 3.5°F-per-1,000-ft lapse rate to about{" "}
        {SUMMIT_FT.toLocaleString()} ft — it is an estimate, and it says nothing about wind, which
        routinely runs two to three times the valley speed on Marcy and Algonquin. NWS publishes
        rain totals in 1–6 hour blocks rather than per hour, so each hour&apos;s inches are that
        block divided up in proportion to the hour&apos;s own chance of rain — the block and window
        totals are measured, the hour-level split is inferred.
        {fetchedAt && ` Loaded ${fetchedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} — reload for the latest.`}
      </p>
    </div>
  );
}
