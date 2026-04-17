/**
 * Minimal RRULE parser for the 5 presets exposed in the TaskForm dropdown.
 *
 * Supported shapes (order-insensitive parts, comma-separated BYDAY):
 *   FREQ=DAILY
 *   FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR          (weekdays)
 *   FREQ=WEEKLY;BYDAY=<DAY>                  (weekly on a specific day)
 *   FREQ=WEEKLY;INTERVAL=2;BYDAY=<DAY>       (every 2 weeks)
 *   FREQ=MONTHLY;BYMONTHDAY=<N>              (monthly on day N)
 *
 * This is intentionally hand-rolled — a full RRULE library would be overkill
 * and bloat the bundle. Upgrade here when we actually need more complex rules.
 */

const DAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] as const;
type DayCode = (typeof DAY_CODES)[number];

const WEEKDAY_SET: ReadonlySet<DayCode> = new Set([
  "MO",
  "TU",
  "WE",
  "TH",
  "FR",
]);

function parseRule(rule: string): Record<string, string> {
  const parts = rule.split(";");
  const out: Record<string, string> = {};
  for (const part of parts) {
    const [k, v] = part.split("=");
    if (k && v !== undefined) out[k.toUpperCase()] = v.toUpperCase();
  }
  return out;
}

function parseByDay(value: string | undefined): DayCode[] {
  if (!value) return [];
  return value
    .split(",")
    .map((d) => d.trim().toUpperCase())
    .filter((d): d is DayCode => (DAY_CODES as readonly string[]).includes(d));
}

function dayCodeToIndex(code: DayCode): number {
  return DAY_CODES.indexOf(code);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Compute the next occurrence strictly AFTER `from`.
 * Returns null for unsupported rules.
 */
export function nextOccurrence(rule: string, from: Date): Date | null {
  const parts = parseRule(rule);
  const freq = parts.FREQ;
  if (!freq) return null;

  const base = new Date(from);
  base.setHours(0, 0, 0, 0);

  if (freq === "DAILY") {
    const byDay = parseByDay(parts.BYDAY);
    // Plain daily — next calendar day.
    if (byDay.length === 0) return addDays(base, 1);

    // Daily-with-BYDAY (e.g. weekdays): advance day-by-day until we hit one.
    const wanted = new Set(byDay);
    for (let i = 1; i <= 7; i++) {
      const candidate = addDays(base, i);
      const code = DAY_CODES[candidate.getDay()];
      if (wanted.has(code)) return candidate;
    }
    return null;
  }

  if (freq === "WEEKLY") {
    const interval = Math.max(1, parseInt(parts.INTERVAL ?? "1", 10) || 1);
    const byDay = parseByDay(parts.BYDAY);

    // Anchor day defaults to whatever `from` is on.
    const targetDayIndex =
      byDay.length > 0 ? dayCodeToIndex(byDay[0]) : base.getDay();

    // Advance interval weeks, then align to target weekday.
    const advanced = addDays(base, 7 * interval);
    const diff = (targetDayIndex - advanced.getDay() + 7) % 7;
    return addDays(advanced, diff);
  }

  if (freq === "MONTHLY") {
    const dayOfMonth = parseInt(
      parts.BYMONTHDAY ?? String(base.getDate()),
      10
    );
    if (!Number.isFinite(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
      return null;
    }

    // Start from next month, clamp to last day if month is shorter.
    const year = base.getFullYear();
    const month = base.getMonth();
    const next = new Date(year, month + 1, 1);
    const lastDayOfNextMonth = new Date(
      next.getFullYear(),
      next.getMonth() + 1,
      0
    ).getDate();
    next.setDate(Math.min(dayOfMonth, lastDayOfNextMonth));
    next.setHours(0, 0, 0, 0);
    return next;
  }

  return null;
}

/**
 * Map a supported RRULE back to a short human label (e.g. "Daily", "Weekdays").
 * Returns "Repeats" as a generic fallback for unknown shapes.
 */
export function formatRecurrence(rule: string): string {
  const parts = parseRule(rule);
  const freq = parts.FREQ;
  if (!freq) return "Repeats";

  if (freq === "DAILY") {
    const byDay = parseByDay(parts.BYDAY);
    if (byDay.length === 0) return "Daily";
    // Exact weekday set → "Weekdays"
    if (
      byDay.length === WEEKDAY_SET.size &&
      byDay.every((d) => WEEKDAY_SET.has(d))
    ) {
      return "Weekdays";
    }
    return "Daily";
  }

  if (freq === "WEEKLY") {
    const interval = Math.max(1, parseInt(parts.INTERVAL ?? "1", 10) || 1);
    if (interval === 2) return "Every 2 weeks";
    if (interval > 1) return `Every ${interval} weeks`;
    return "Weekly";
  }

  if (freq === "MONTHLY") {
    return "Monthly";
  }

  return "Repeats";
}

/**
 * Format an ISO date (YYYY-MM-DD) into a Date at local midnight.
 * Avoids timezone drift from `new Date("2026-01-15")` (which is UTC).
 */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map((n) => parseInt(n, 10));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * Format a Date as YYYY-MM-DD using local calendar fields.
 */
export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Map a JS weekday index (0=Sun..6=Sat) to its RFC-5545 two-letter code.
 */
export function weekdayCode(dayIndex: number): DayCode {
  return DAY_CODES[((dayIndex % 7) + 7) % 7];
}

/**
 * Enumerate every occurrence of `rule` that falls within [rangeStart, rangeEnd],
 * starting from `anchorDate`. The anchor itself is included if it lies in range.
 */
export function occurrencesInRange(
  rule: string,
  anchorDate: Date,
  rangeStart: Date,
  rangeEnd: Date,
  maxIterations: number = 500
): Date[] {
  const result: Date[] = [];
  const anchor = new Date(anchorDate);
  anchor.setHours(0, 0, 0, 0);
  const start = new Date(rangeStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(rangeEnd);
  end.setHours(0, 0, 0, 0);

  if (anchor > end) return result;

  if (anchor >= start && anchor <= end) {
    result.push(new Date(anchor));
  }

  let cursor = new Date(anchor);
  for (let i = 0; i < maxIterations; i++) {
    const next = nextOccurrence(rule, cursor);
    if (!next) break;
    if (next > end) break;
    if (next >= start) result.push(new Date(next));
    cursor = next;
  }
  return result;
}
