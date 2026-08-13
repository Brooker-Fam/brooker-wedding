/* NWS data plumbing for the trip weather tab.
 *
 * Three endpoints, all public and key-less:
 *   /points/{lat},{lon}          → discovers the grid + the URLs below
 *   .../forecast/hourly          → hour-by-hour temp, precip %, wind, sky
 *   .../gridpoints/{o}/{x},{y}   → the raw grid, which is the ONLY place NWS
 *                                  publishes quantitative precipitation (how
 *                                  much rain, in mm, per validTime block)
 *
 * The hourly forecast tells you WHEN it rains and how likely. The grid tells
 * you HOW MUCH. You need both, hence the merge in hydrateHours().
 */

export const TRIP_LAT = 44.1266;
export const TRIP_LON = -73.9672;

/** Grid elevation for the Lake Colden / Marcy Dam corridor. */
export const VALLEY_FT = 2400;
/** What we're actually standing on when it matters. */
export const SUMMIT_FT = 5000;
/** Standard dry-ish lapse rate, °F per 1,000 ft. */
const LAPSE_F_PER_KFT = 3.5;

export const summitTemp = (valleyF: number) =>
  Math.round(valleyF - ((SUMMIT_FT - VALLEY_FT) / 1000) * LAPSE_F_PER_KFT);

export type HourlyPeriod = {
  number: number;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  probabilityOfPrecipitation?: { value: number | null };
  relativeHumidity?: { value: number | null };
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
};

/** One hour, with the grid's rain amount merged in. */
export type Hour = {
  start: Date;
  isDaytime: boolean;
  tempF: number;
  precipPct: number;
  /** Inches of rain in this hour. Derived — see qpfBlockHours. */
  rainIn: number;
  /** Hours in the grid block this amount came from (NWS publishes 1–6h blocks). */
  qpfBlockHours: number;
  windSpeed: string;
  windDirection: string;
  short: string;
  thunder: boolean;
};

export type RainWindow = {
  start: Date;
  end: Date;
  totalIn: number;
  peakPct: number;
  thunder: boolean;
};

type GridValue = { validTime: string; value: number | null };

const MM_PER_IN = 25.4;

/** "2026-08-15T06:00:00+00:00/PT6H" → { start, hours } */
export function parseValidTime(validTime: string): { start: Date; hours: number } | null {
  const [startStr, dur] = validTime.split("/");
  if (!startStr || !dur) return null;
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(dur);
  if (!m) return null;
  const hours = Number(m[1] ?? 0) * 24 + Number(m[2] ?? 0) + Number(m[3] ?? 0) / 60;
  const start = new Date(startStr);
  if (Number.isNaN(start.getTime()) || hours <= 0) return null;
  return { start, hours };
}

/**
 * Merge the hourly forecast with the grid's quantitative precipitation.
 *
 * NWS reports rain totals over multi-hour blocks (1h near-term, usually 6h
 * further out), so a block total has to be split across its hours somehow.
 * Splitting it EVENLY is wrong in a way that matters: a 6-hour block holding a
 * single afternoon thunderstorm would paint measurable rain onto five dry
 * hours and stretch the "when it rains" window from 1–6 PM to noon–midnight.
 *
 * So we weight each hour's share by its own precipitation probability — the
 * rain lands where the forecast says it's likely. A block with no probability
 * anywhere falls back to an even split.
 */
export function hydrateHours(periods: HourlyPeriod[], qpf: GridValue[]): Hour[] {
  const blocks = qpf
    .map((v) => {
      const parsed = parseValidTime(v.validTime);
      if (!parsed || v.value == null) return null;
      return {
        startMs: parsed.start.getTime(),
        endMs: parsed.start.getTime() + parsed.hours * 3600_000,
        hours: parsed.hours,
        totalIn: v.value / MM_PER_IN,
      };
    })
    .filter((b): b is NonNullable<typeof b> => b !== null);

  const hours: Hour[] = periods.map((p) => {
    const short = p.shortForecast.toLowerCase();
    return {
      start: new Date(p.startTime),
      isDaytime: p.isDaytime,
      tempF: p.temperature,
      precipPct: p.probabilityOfPrecipitation?.value ?? 0,
      rainIn: 0,
      qpfBlockHours: 0,
      windSpeed: p.windSpeed,
      windDirection: p.windDirection,
      short: p.shortForecast,
      thunder: short.includes("thunder"),
    };
  });

  for (const block of blocks) {
    if (block.totalIn <= 0) continue;
    const inBlock = hours.filter((h) => {
      const ms = h.start.getTime();
      return ms >= block.startMs && ms < block.endMs;
    });
    if (inBlock.length === 0) continue;

    const probSum = inBlock.reduce((s, h) => s + h.precipPct, 0);
    for (const h of inBlock) {
      h.rainIn = probSum > 0
        ? block.totalIn * (h.precipPct / probSum)
        : block.totalIn / inBlock.length;
      h.qpfBlockHours = block.hours;
    }
  }

  return hours;
}

/**
 * Collapse the hours into "it rains from X to Y, about Z inches" windows —
 * the actual question anyone planning a summit day is asking.
 *
 * A window opens at >=25% chance, or at measurable rain that the forecast
 * actually thinks is plausible — the probability floor matters, because a
 * near-zero-chance hour sitting inside a wet grid block still picks up a sliver
 * of rain and would otherwise drag the window's start an hour or two earlier
 * than anything is meant to happen. A window only survives if it clears 30% or
 * 0.01" somewhere inside, and single quiet hours don't split one in two.
 */
export function rainWindows(hours: Hour[]): RainWindow[] {
  const wet = (h: Hour) => h.precipPct >= 25 || (h.rainIn >= 0.01 && h.precipPct >= 15);
  const out: RainWindow[] = [];
  let run: Hour[] = [];

  const flush = () => {
    if (run.length === 0) return;
    const totalIn = run.reduce((s, h) => s + h.rainIn, 0);
    const peakPct = Math.max(...run.map((h) => h.precipPct));
    if (peakPct >= 30 || totalIn >= 0.01) {
      out.push({
        start: run[0].start,
        end: new Date(run[run.length - 1].start.getTime() + 3600_000),
        totalIn,
        peakPct,
        thunder: run.some((h) => h.thunder),
      });
    }
    run = [];
  };

  for (let i = 0; i < hours.length; i++) {
    if (wet(hours[i])) {
      run.push(hours[i]);
      continue;
    }
    // One dry hour inside a wet stretch is noise, not a break. (Guard the
    // lookahead — the last hour of the forecast has no i+1.)
    const next = hours[i + 1];
    if (run.length > 0 && next && wet(next)) {
      run.push(hours[i]);
      continue;
    }
    flush();
  }
  flush();
  return out;
}

export const ET = "America/New_York";

export const fmtHour = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "numeric", timeZone: ET });

export const fmtDayHour = (d: Date) =>
  d.toLocaleString("en-US", { weekday: "short", hour: "numeric", timeZone: ET });

export const fmtDay = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: ET });

/** YYYY-MM-DD in Eastern time, for grouping hours into days. */
export const etDayKey = (d: Date) =>
  d.toLocaleDateString("en-CA", { timeZone: ET });

/** Hour of day, 0–23, in Eastern time. */
export const etHour = (d: Date) =>
  Number(d.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: ET }));

/** The days we care about, in ET. */
export const TRIP_DAYS = ["2026-08-14", "2026-08-15", "2026-08-16"] as const;

export const DAY_LABELS: Record<string, string> = {
  "2026-08-14": "Fri 8/14 — pack + drive night",
  "2026-08-15": "Sat 8/15 — carry in + summit",
  "2026-08-16": "Sun 8/16 — summit + hike out",
};

/** Trip-relevant sun times for Lake Colden (from the plan on the overview). */
export const SUN: Record<string, { rise: string; set: string }> = {
  "2026-08-14": { rise: "5:58 AM", set: "8:04 PM" },
  "2026-08-15": { rise: "5:59 AM", set: "8:02 PM" },
  "2026-08-16": { rise: "6:00 AM", set: "8:01 PM" },
};
