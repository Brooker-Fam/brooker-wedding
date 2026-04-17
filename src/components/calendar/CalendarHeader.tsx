"use client";

import Link from "next/link";

export type CalendarViewMode = "day" | "week";

interface CalendarHeaderProps {
  anchor: Date;
  view: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  adminMode: boolean;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekRange(anchor: Date): string {
  const start = getMonday(anchor);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", {
    ...opts,
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

function formatDayLabel(anchor: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 86400000);
  const yesterday = new Date(today.getTime() - 86400000);
  const key = formatDateKey(anchor);

  const base = anchor.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  if (key === formatDateKey(today)) return `Today · ${base}`;
  if (key === formatDateKey(tomorrow)) return `Tomorrow · ${base}`;
  if (key === formatDateKey(yesterday)) return `Yesterday · ${base}`;
  return base;
}

export default function CalendarHeader({
  anchor,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  adminMode,
}: CalendarHeaderProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);
  const anchorKey = formatDateKey(anchor);

  const weekStart = getMonday(anchor);
  const isCurrentWeek =
    weekStart.getTime() <= today.getTime() &&
    today.getTime() < weekStart.getTime() + 7 * 86400000;

  const showTodayButton =
    view === "day" ? anchorKey !== todayKey : !isCurrentWeek;

  const label =
    view === "day" ? formatDayLabel(anchor) : formatWeekRange(anchor);

  const prevLabel = view === "day" ? "Previous day" : "Previous week";
  const nextLabel = view === "day" ? "Next day" : "Next week";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-forest dark:text-cream sm:text-3xl">
          Brooker Family
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex items-center rounded-xl border border-sage/20 bg-cream/60 p-0.5 dark:border-soft-gold/15 dark:bg-dark-surface"
          role="group"
          aria-label="Calendar view"
        >
          <button
            onClick={() => onViewChange("day")}
            aria-pressed={view === "day"}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              view === "day"
                ? "bg-forest text-cream dark:bg-sage dark:text-dark-bg"
                : "text-forest/60 hover:text-forest dark:text-cream/60 dark:hover:text-cream"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => onViewChange("week")}
            aria-pressed={view === "week"}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              view === "week"
                ? "bg-forest text-cream dark:bg-sage dark:text-dark-bg"
                : "text-forest/60 hover:text-forest dark:text-cream/60 dark:hover:text-cream"
            }`}
          >
            Week
          </button>
        </div>

        <div className="flex items-center rounded-xl border border-sage/20 bg-cream/60 dark:border-soft-gold/15 dark:bg-dark-surface">
          <button
            onClick={onPrev}
            className="px-3 py-2 text-forest/70 transition-colors hover:text-forest dark:text-cream/70 dark:hover:text-cream"
            aria-label={prevLabel}
          >
            ‹
          </button>
          <span className="min-w-[180px] px-2 text-center text-sm font-medium text-forest dark:text-cream sm:text-base">
            {label}
          </span>
          <button
            onClick={onNext}
            className="px-3 py-2 text-forest/70 transition-colors hover:text-forest dark:text-cream/70 dark:hover:text-cream"
            aria-label={nextLabel}
          >
            ›
          </button>
        </div>

        {showTodayButton && (
          <button
            onClick={onToday}
            className="rounded-lg border border-sage/20 bg-cream/60 px-3 py-2 text-sm font-medium text-forest transition-colors hover:bg-sage/10 dark:border-soft-gold/15 dark:bg-dark-surface dark:text-cream dark:hover:bg-dark-surface-light"
          >
            Today
          </button>
        )}

        <Link
          href="/calendar/scoreboard"
          className="rounded-lg border border-sage/20 bg-cream/60 px-3 py-2 text-sm font-medium text-forest/60 transition-colors hover:text-forest dark:border-soft-gold/15 dark:bg-dark-surface dark:text-cream/60 dark:hover:text-cream"
          title="Scoreboard"
        >
          🏆
        </Link>

        <Link
          href="/calendar/display"
          className="rounded-lg border border-sage/20 bg-cream/60 px-3 py-2 text-sm font-medium text-forest/60 transition-colors hover:text-forest dark:border-soft-gold/15 dark:bg-dark-surface dark:text-cream/60 dark:hover:text-cream"
          title="Open wall-mount display mode"
        >
          📺
        </Link>

        {adminMode ? (
          <Link
            href="/calendar"
            className="rounded-lg border border-soft-gold/40 bg-soft-gold/15 px-3 py-2 text-sm font-medium text-soft-gold-dark transition-colors hover:bg-soft-gold/25 dark:border-soft-gold/30 dark:text-soft-gold"
            title="Exit admin mode"
          >
            ✏️ Admin
          </Link>
        ) : (
          <Link
            href="/calendar/admin"
            className="rounded-lg border border-sage/20 bg-cream/60 px-3 py-2 text-sm font-medium text-forest/50 transition-colors hover:text-forest dark:border-soft-gold/15 dark:bg-dark-surface dark:text-cream/40 dark:hover:text-cream"
            title="Enter admin mode"
          >
            🔒
          </Link>
        )}
      </div>
    </header>
  );
}
