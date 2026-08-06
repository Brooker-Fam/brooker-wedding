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
        if (!cancelled) setPeriods(fc.properties.periods.slice(0, 10));
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isTripDay = (p: Period) => {
    const d = new Date(p.startTime);
    const m = d.getMonth();
    const day = d.getDate();
    return m === 7 && (day === 15 || day === 16);
  };

  return (
    <div className="soft-card dark:soft-card-dark p-5">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">🌦️ Live forecast — Marcy Dam / Lake Colden</h3>
        <a
          href={`https://forecast.weather.gov/MapClick.php?lat=${LAT}&lon=${LON}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline opacity-70 hover:opacity-100"
        >
          full NWS forecast ↗
        </a>
      </div>
      <p className="mb-4 text-xs opacity-70">
        Valley forecast (~2,400 ft). Summits run 10–20°F colder and much windier — treat any
        thunderstorm chance as a hard turnaround signal above treeline.
      </p>

      {error && (
        <p className="text-sm opacity-70">
          Couldn&apos;t reach the National Weather Service — use the link above.
        </p>
      )}
      {!periods && !error && <p className="text-sm opacity-70">Loading forecast…</p>}

      {periods && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {periods.map((p) => {
            const precip = p.probabilityOfPrecipitation?.value ?? 0;
            return (
              <div
                key={p.number}
                className={`min-w-[7.5rem] shrink-0 rounded-xl border p-3 text-center ${
                  isTripDay(p)
                    ? "border-soft-gold bg-soft-gold/15"
                    : "border-sage/20"
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
