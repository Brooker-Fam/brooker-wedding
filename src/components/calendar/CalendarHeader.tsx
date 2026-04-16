"use client";

interface CalendarHeaderProps {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

function formatWeekRange(start: Date): string {
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

export default function CalendarHeader({
  weekStart,
  onPrevWeek,
  onNextWeek,
  onToday,
  isAdmin,
  onToggleAdmin,
}: CalendarHeaderProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCurrentWeek =
    weekStart.getTime() <= today.getTime() &&
    today.getTime() < weekStart.getTime() + 7 * 86400000;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-forest dark:text-cream sm:text-3xl">
          Brooker Family
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-xl border border-sage/20 bg-cream/60 dark:border-soft-gold/15 dark:bg-dark-surface">
          <button
            onClick={onPrevWeek}
            className="px-3 py-2 text-forest/70 transition-colors hover:text-forest dark:text-cream/70 dark:hover:text-cream"
            aria-label="Previous week"
          >
            ‹
          </button>
          <span className="min-w-[180px] px-2 text-center text-sm font-medium text-forest dark:text-cream sm:text-base">
            {formatWeekRange(weekStart)}
          </span>
          <button
            onClick={onNextWeek}
            className="px-3 py-2 text-forest/70 transition-colors hover:text-forest dark:text-cream/70 dark:hover:text-cream"
            aria-label="Next week"
          >
            ›
          </button>
        </div>

        {!isCurrentWeek && (
          <button
            onClick={onToday}
            className="rounded-lg border border-sage/20 bg-cream/60 px-3 py-2 text-sm font-medium text-forest transition-colors hover:bg-sage/10 dark:border-soft-gold/15 dark:bg-dark-surface dark:text-cream dark:hover:bg-dark-surface-light"
          >
            Today
          </button>
        )}

        <button
          onClick={onToggleAdmin}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            isAdmin
              ? "border-soft-gold/40 bg-soft-gold/15 text-soft-gold-dark dark:border-soft-gold/30 dark:text-soft-gold"
              : "border-sage/20 bg-cream/60 text-forest/50 hover:text-forest dark:border-soft-gold/15 dark:bg-dark-surface dark:text-cream/40 dark:hover:text-cream"
          }`}
          title={isAdmin ? "Exit admin mode" : "Enter admin mode"}
        >
          {isAdmin ? "✏️ Admin" : "🔒"}
        </button>
      </div>
    </header>
  );
}
