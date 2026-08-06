"use client";

import { useEffect, useState } from "react";

// NWS point forecast for the Lake Colden / Marcy Dam corridor (~2,400 ft).
// Summits run 10–20°F colder with real wind — the banner note covers that.
const LAT = 44.1266;
const LON = -73.9672;

type Period = {
  number: number;
  name: string;
  startTime: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  shortForecast: string;
  probabilityOfPrecipitation?: { value: number | null };
  isDaytime: boolean;
};

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

// Trip window: Fri Aug 14 evening through Sun Aug 16, 2026.
function isTripPeriod(p: Period): boolean {
  const d = new Date(p.startTime);
  return d.getFullYear() === 2026 && d.getMonth() === 7 && d.getDate() >= 14 && d.getDate() <= 16;
}

export default function TripWeather() {
  const [periods, setPeriods] = useState<Period[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pointRes = await fetch(`https://api.weather.gov/points/${LAT},${LON}`);
        const point = await pointRes.json();
        const fcRes = await fetch(point.properties.forecast);
        const fc = await fcRes.json();
        if (!cancelled) setPeriods(fc.properties.periods);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tripPeriods = periods?.filter(isTripPeriod) ?? [];
  const tripInRange = tripPeriods.length > 0;
  // Until Aug 15 enters the ~7-day NWS window, show the tail of what exists so
  // the "coverage hasn't reached the trip yet" state is self-explanatory.
  const shown = tripInRange ? tripPeriods : (periods ?? []).slice(0, 6);

  return (
    <div className="soft-card dark:soft-card-dark p-5">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">
          🌦️ {tripInRange ? "Trip forecast" : "Live forecast"} — Marcy Dam / Lake Colden
        </h3>
        <a
          href={`https://forecast.weather.gov/MapClick.php?lat=${LAT}&lon=${LON}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline opacity-70 hover:opacity-100"
        >
          full NWS forecast ↗
        </a>
      </div>
      <p className="mb-2 text-xs opacity-70">
        Valley forecast (~2,400 ft). Summits run 10–20°F colder and much windier — treat any
        thunderstorm chance as a hard turnaround signal above treeline.
      </p>

      {!tripInRange && periods && (
        <p className="mb-4 rounded-lg bg-sage/10 px-3 py-2 text-xs leading-relaxed">
          <strong>Why no Aug 15–16 yet:</strong> the National Weather Service only forecasts ~7
          days ahead, and the trip is still outside that window. This card flips to Fri–Sun trip
          days automatically once they come into range (around Aug 9) — until then, here&apos;s the
          current outlook. Mid-August normals up there: valley highs in the 70s, lows 45–55°F,
          summits in the 40s with wind, and afternoon thunderstorms are the standard pattern.
        </p>
      )}

      {error && (
        <p className="text-sm opacity-70">
          Couldn&apos;t reach the National Weather Service — use the link above.
        </p>
      )}
      {!periods && !error && <p className="text-sm opacity-70">Loading forecast…</p>}

      {periods && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {shown.map((p) => {
            const precip = p.probabilityOfPrecipitation?.value ?? 0;
            return (
              <div
                key={p.number}
                className={`min-w-[7.5rem] shrink-0 rounded-xl border p-3 text-center ${
                  isTripPeriod(p) ? "border-soft-gold bg-soft-gold/15" : "border-sage/20"
                }`}
              >
                <div className="text-xs font-semibold">{p.name}</div>
                <div className="my-1 text-2xl">{icon(p.shortForecast, p.isDaytime)}</div>
                <div className="text-lg font-bold">
                  {p.temperature}°{p.temperatureUnit}
                </div>
                <div className="mt-0.5 text-[11px] leading-tight opacity-70">{p.shortForecast}</div>
                <div className="mt-1 text-[11px] opacity-70">
                  💧 {precip}% · 💨 {p.windSpeed}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
