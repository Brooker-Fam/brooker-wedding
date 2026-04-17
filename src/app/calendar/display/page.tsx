"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  CalendarEventWithMember,
  FamilyMember,
  TaskWithCompletion,
} from "@/lib/calendar/types";

/** Normalized item for display rendering — works for both tasks and events. */
interface DisplayItem {
  id: string;
  title: string;
  due_date: string | null;
  due_time: string | null;
  assigned_to: number | null;
  member_name: string | null;
  member_emoji: string | null;
  member_color: string | null;
  completed: boolean;
  kind: "task" | "event";
}

function taskToItem(t: TaskWithCompletion): DisplayItem {
  return {
    id: `t-${t.id}`,
    title: t.title,
    due_date: t.due_date,
    due_time: t.due_time,
    assigned_to: t.assigned_to,
    member_name: t.member_name,
    member_emoji: t.member_emoji,
    member_color: t.member_color,
    completed: !!t.completion_id,
    kind: "task",
  };
}

function eventToItem(e: CalendarEventWithMember): DisplayItem {
  const startTime = e.all_day
    ? null
    : new Date(e.start_at).toTimeString().slice(0, 5);
  return {
    id: `e-${e.id}`,
    title: e.title,
    due_date: new Date(e.start_at).toISOString().split("T")[0],
    due_time: startTime,
    assigned_to: e.assigned_to,
    member_name: e.member_name,
    member_emoji: e.member_emoji,
    member_color: e.member_color,
    completed: e.completions.length > 0,
    kind: "event",
  };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatClock(date: Date): { time: string; ampm: string } {
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return {
    time: `${h}:${String(m).padStart(2, "0")}`,
    ampm,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatDueTime(due_time: string | null): string | null {
  if (!due_time) return null;
  const [hStr, mStr] = due_time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return null;
  const ampm = h >= 12 ? "pm" : "am";
  let display = h % 12;
  if (display === 0) display = 12;
  return m === 0
    ? `${display}${ampm}`
    : `${display}:${String(m).padStart(2, "0")}${ampm}`;
}

function formatUpcomingDay(dateKey: string, today: Date): string {
  const [y, mo, d] = dateKey.split("-").map(Number);
  const date = new Date(y, mo - 1, d);
  const diff = Math.round(
    (date.getTime() -
      new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) /
      86400000
  );
  if (diff === 1) return "Tomorrow";
  if (diff >= 0 && diff < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ------------------------------------------------------------------ */
/* Weather                                                              */
/* ------------------------------------------------------------------ */

interface Weather {
  temperature: number;
  code: number;
}

// Open-Meteo WMO weather codes → human label + emoji icon.
// Spec: https://open-meteo.com/en/docs
function weatherIcon(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: "☀️", label: "Clear" };
  if (code === 1) return { icon: "🌤️", label: "Mostly clear" };
  if (code === 2) return { icon: "⛅", label: "Partly cloudy" };
  if (code === 3) return { icon: "☁️", label: "Overcast" };
  if (code === 45 || code === 48) return { icon: "🌫️", label: "Fog" };
  if (code >= 51 && code <= 57) return { icon: "🌦️", label: "Drizzle" };
  if (code >= 61 && code <= 67) return { icon: "🌧️", label: "Rain" };
  if (code >= 71 && code <= 77) return { icon: "❄️", label: "Snow" };
  if (code >= 80 && code <= 82) return { icon: "🌧️", label: "Showers" };
  if (code >= 85 && code <= 86) return { icon: "🌨️", label: "Snow showers" };
  if (code >= 95 && code <= 99) return { icon: "⛈️", label: "Thunderstorm" };
  return { icon: "🌥️", label: "Weather" };
}

/* ------------------------------------------------------------------ */
/* Fireflies — sprinkle a few for ambiance                              */
/* ------------------------------------------------------------------ */

function Fireflies({ count = 14 }: { count?: number }) {
  // Stable positions so they don't re-randomize on every render.
  const specs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      size: 3 + Math.random() * 3,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {specs.map((s) => (
        <span
          key={s.key}
          className="animate-firefly absolute rounded-full bg-soft-gold"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            boxShadow:
              "0 0 6px rgba(196, 154, 60, 0.8), 0 0 14px rgba(196, 154, 60, 0.5)",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function CalendarDisplayPage() {
  const [now, setNow] = useState(() => new Date());
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([]);
  const [events, setEvents] = useState<CalendarEventWithMember[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);

  /* Tick the clock every second */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* Apply dark mode to <html> while this page is mounted */
  useEffect(() => {
    const root = document.documentElement;
    const prevHadDark = root.classList.contains("dark");
    root.classList.add("dark");
    return () => {
      if (!prevHadDark) root.classList.remove("dark");
    };
  }, []);

  /* Request screen wake lock so iPad stays on */
  useEffect(() => {
    type WakeLockSentinel = {
      release: () => Promise<void>;
      addEventListener: (type: "release", listener: () => void) => void;
    };
    type NavigatorWithWakeLock = Navigator & {
      wakeLock?: {
        request: (type: "screen") => Promise<WakeLockSentinel>;
      };
    };

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const nav = navigator as NavigatorWithWakeLock;
    const request = async () => {
      if (!nav.wakeLock) return;
      try {
        sentinel = await nav.wakeLock.request("screen");
      } catch {
        // Not supported or denied (e.g. page not visible). Fail quiet.
      }
    };

    void request();

    // Re-request on visibility change (wake lock drops when tab backgrounds).
    const onVisible = () => {
      if (document.visibilityState === "visible" && !cancelled) void request();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      if (sentinel) void sentinel.release().catch(() => {});
    };
  }, []);

  /* Fetch members once */
  useEffect(() => {
    fetch("/api/calendar/members")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => setMembers([]));
  }, []);

  /* Task + event fetcher */
  const fetchTasks = useCallback(async () => {
    const today = new Date();
    const start = formatDateKey(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 8);
    const endKey = formatDateKey(end);
    try {
      const [taskRes, eventRes] = await Promise.all([
        fetch(`/api/calendar/tasks?start=${start}&end=${endKey}`, { cache: "no-store" }),
        fetch(`/api/calendar/events?start=${start}&end=${endKey}`, { cache: "no-store" }),
      ]);
      if (taskRes.ok) {
        const data = await taskRes.json();
        setTasks(Array.isArray(data) ? data : []);
      }
      if (eventRes.ok) {
        const data = await eventRes.json();
        setEvents(Array.isArray(data) ? data : []);
      }
    } catch {
      // Keep last known data on network failure.
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const id = setInterval(fetchTasks, 60_000);
    return () => clearInterval(id);
  }, [fetchTasks]);

  /* Weather fetcher — every 15 min */
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=43.10&longitude=-73.50&current=temperature_2m,weather_code&temperature_unit=fahrenheit",
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = await res.json();
        const t = data?.current?.temperature_2m;
        const c = data?.current?.weather_code;
        if (typeof t === "number" && typeof c === "number") {
          setWeather({ temperature: Math.round(t), code: c });
        }
      } catch {
        // Leave weather as-is.
      }
    };
    fetchWeather();
    const id = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  /* Derived data */
  const todayKey = formatDateKey(now);
  const { time, ampm } = formatClock(now);
  const todayLabel = formatDate(now);

  const allItems = useMemo(() => {
    return [
      ...tasks.map(taskToItem),
      ...events.map(eventToItem),
    ];
  }, [tasks, events]);

  const todayItems = useMemo(() => {
    return allItems
      .filter((item) => item.due_date?.startsWith(todayKey))
      .sort((a, b) => (a.due_time ?? "99:99").localeCompare(b.due_time ?? "99:99"));
  }, [allItems, todayKey]);

  const upcoming = useMemo(() => {
    return allItems
      .filter((item) => item.due_date && !item.due_date.startsWith(todayKey))
      .sort((a, b) => {
        const da = (a.due_date ?? "") + (a.due_time ?? "");
        const db = (b.due_date ?? "") + (b.due_time ?? "");
        return da.localeCompare(db);
      })
      .slice(0, 5);
  }, [allItems, todayKey]);

  const todayGrouped = useMemo(() => {
    const byMember = new Map<number | null, DisplayItem[]>();
    for (const item of todayItems) {
      const key = item.assigned_to ?? null;
      const arr = byMember.get(key) ?? [];
      arr.push(item);
      byMember.set(key, arr);
    }
    const groups: Array<{
      id: number | null;
      name: string;
      emoji: string | null;
      color: string;
      items: DisplayItem[];
    }> = [];
    for (const m of members) {
      const items = byMember.get(m.id);
      if (items && items.length) {
        groups.push({
          id: m.id,
          name: m.name,
          emoji: m.avatar_emoji,
          color: m.color,
          items,
        });
      }
    }
    const unassigned = byMember.get(null);
    if (unassigned && unassigned.length) {
      groups.push({
        id: null,
        name: "Everyone",
        emoji: "🏡",
        color: "#C49A3C",
        items: unassigned,
      });
    }
    return groups;
  }, [todayItems, members]);

  // Cap visible at 8; roll the rest into a "+N more" line.
  const MAX_VISIBLE = 8;
  const visibleGroups = useMemo(() => {
    const out: typeof todayGrouped = [];
    let shown = 0;
    for (const g of todayGrouped) {
      if (shown >= MAX_VISIBLE) break;
      const room = MAX_VISIBLE - shown;
      const slice = g.items.slice(0, room);
      out.push({ ...g, items: slice });
      shown += slice.length;
    }
    return out;
  }, [todayGrouped]);

  const totalTodayCount = todayItems.length;
  const hiddenCount = Math.max(0, totalTodayCount - MAX_VISIBLE);

  const weatherInfo = weather ? weatherIcon(weather.code) : null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col overflow-hidden bg-dark-bg text-cream">
      {/* Ambient background layers */}
      <div className="pointer-events-none absolute inset-0 enchanted-bg" />
      <Fireflies />

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 flex-col min-h-0 portrait:flex-col landscape:flex-row">
        {/* LEFT — Clock / date / weather */}
        <section className="flex flex-1 flex-col items-center justify-center px-8 py-10 landscape:border-r landscape:border-soft-gold/15 portrait:border-b portrait:border-soft-gold/15">
          <div
            className="font-[family-name:var(--font-cormorant-garamond)] font-semibold leading-none tracking-tight text-cream"
            style={{ fontSize: "clamp(8rem, 22vmin, 22rem)" }}
          >
            {time}
            <span
              className="ml-4 align-top text-soft-gold"
              style={{ fontSize: "clamp(2.5rem, 7vmin, 7rem)" }}
            >
              {ampm}
            </span>
          </div>

          <div
            className="mt-4 font-[family-name:var(--font-cormorant-garamond)] text-sage-light italic"
            style={{ fontSize: "clamp(1.5rem, 3.5vmin, 3rem)" }}
          >
            {todayLabel}
          </div>

          {weatherInfo && weather && (
            <div className="mt-10 flex items-center gap-5 text-cream">
              <span
                className="animate-gentle-float-slow leading-none"
                style={{ fontSize: "clamp(3rem, 8vmin, 6rem)" }}
              >
                {weatherInfo.icon}
              </span>
              <div className="flex flex-col">
                <span
                  className="font-[family-name:var(--font-cormorant-garamond)] font-semibold leading-none text-soft-gold"
                  style={{ fontSize: "clamp(3rem, 8vmin, 6rem)" }}
                >
                  {weather.temperature}&deg;
                </span>
                <span
                  className="mt-1 text-sage-light"
                  style={{ fontSize: "clamp(0.9rem, 1.5vmin, 1.25rem)" }}
                >
                  {weatherInfo.label}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT — Today's tasks grouped by person */}
        <section className="flex flex-1 flex-col px-8 py-10 min-h-0">
          <header className="mb-6 flex items-baseline justify-between gap-4">
            <h2
              className="font-[family-name:var(--font-cormorant-garamond)] font-semibold text-cream"
              style={{ fontSize: "clamp(2.5rem, 6vmin, 5rem)" }}
            >
              Today
            </h2>
            <span
              className="text-sage-light"
              style={{ fontSize: "clamp(1rem, 1.75vmin, 1.5rem)" }}
            >
              {totalTodayCount === 0
                ? "nothing on the schedule"
                : `${totalTodayCount} ${
                    totalTodayCount === 1 ? "item" : "items"
                  }`}
            </span>
          </header>

          <div className="flex flex-1 flex-col gap-5 min-h-0 overflow-hidden">
            {totalTodayCount === 0 && (
              <div className="flex flex-1 items-center justify-center">
                <p
                  className="font-[family-name:var(--font-cormorant-garamond)] italic text-sage-light/80"
                  style={{ fontSize: "clamp(1.5rem, 3vmin, 2.5rem)" }}
                >
                  A quiet day at the farm.
                </p>
              </div>
            )}

            {visibleGroups.map((g) => (
              <div key={g.id ?? "unassigned"}>
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  <span
                    className="leading-none"
                    style={{ fontSize: "clamp(1.5rem, 3vmin, 2.25rem)" }}
                  >
                    {g.emoji ?? "•"}
                  </span>
                  <span
                    className="font-[family-name:var(--font-cormorant-garamond)] font-semibold text-cream"
                    style={{ fontSize: "clamp(1.25rem, 2.5vmin, 2rem)" }}
                  >
                    {g.name}
                  </span>
                </div>

                <ul className="ml-6 flex flex-col gap-1.5">
                  {g.items.map((item) => {
                    const timeStr = formatDueTime(item.due_time);
                    return (
                      <li
                        key={item.id}
                        className="flex items-baseline gap-3"
                        style={{ fontSize: "clamp(1.25rem, 2.25vmin, 2rem)" }}
                      >
                        {item.kind === "event" && (
                          <span className="text-lavender/60">📅</span>
                        )}
                        <span
                          className={
                            item.completed
                              ? "line-through text-cream/40"
                              : "text-cream"
                          }
                        >
                          {item.title}
                        </span>
                        {timeStr && (
                          <span className="text-soft-gold/80">{timeStr}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {hiddenCount > 0 && (
              <p
                className="mt-1 pl-6 italic text-sage-light"
                style={{ fontSize: "clamp(1rem, 1.75vmin, 1.5rem)" }}
              >
                +{hiddenCount} more
              </p>
            )}
          </div>
        </section>
      </div>

      {/* BOTTOM STRIP — Up Next */}
      <footer className="relative z-10 border-t border-soft-gold/15 bg-dark-surface/60 px-8 py-5 backdrop-blur">
        <div className="flex items-center gap-6">
          <span
            className="font-[family-name:var(--font-cormorant-garamond)] font-semibold text-soft-gold shrink-0"
            style={{ fontSize: "clamp(1.15rem, 2.25vmin, 1.75rem)" }}
          >
            Up Next
          </span>
          <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-2">
            {upcoming.length === 0 && (
              <span
                className="text-sage-light/70 italic"
                style={{ fontSize: "clamp(0.9rem, 1.6vmin, 1.25rem)" }}
              >
                nothing on deck
              </span>
            )}
            {upcoming.map((item) => {
              const day = formatUpcomingDay(item.due_date!.slice(0, 10), now);
              const tm = formatDueTime(item.due_time);
              return (
                <div
                  key={item.id}
                  className="flex items-baseline gap-3"
                  style={{ fontSize: "clamp(0.95rem, 1.7vmin, 1.35rem)" }}
                >
                  <span className="text-sage-light">{day}</span>
                  {tm && <span className="text-soft-gold/80">{tm}</span>}
                  {item.kind === "event" && (
                    <span className="text-lavender/60">📅</span>
                  )}
                  {item.member_emoji && (
                    <span aria-hidden>{item.member_emoji}</span>
                  )}
                  <span className="text-cream">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
