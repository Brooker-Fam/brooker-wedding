"use client";

import type {
  CalendarEventWithMember,
  FamilyMember,
} from "@/lib/calendar/types";

interface EventCardProps {
  event: CalendarEventWithMember;
  members: FamilyMember[];
  /** When set, the card shows a single "I went" button for this member. */
  currentMember?: FamilyMember | null;
  onComplete?: (event: CalendarEventWithMember, memberId: number) => void;
  onUncomplete?: (event: CalendarEventWithMember, memberId: number) => void;
  onClick?: (event: CalendarEventWithMember) => void;
}

function formatTimeRange(ev: CalendarEventWithMember): string {
  if (ev.all_day) return "All day";
  const start = new Date(ev.start_at);
  const end = new Date(ev.end_at);
  const fmt = (d: Date) =>
    d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function EventCard({
  event,
  currentMember,
  onComplete,
  onUncomplete,
  onClick,
}: EventCardProps) {
  const memberColor = event.color_override ?? event.member_color ?? "#B8A9C9";
  const assignedName = event.member_name;

  const myCompletion =
    currentMember != null
      ? event.completions.find((c) => c.completed_by === currentMember.id)
      : null;
  const didAttend = !!myCompletion;

  const canCheckIn =
    currentMember != null &&
    event.points > 0 &&
    (event.assigned_to == null || event.assigned_to === currentMember.id);

  return (
    <div
      className={`group relative rounded-lg border-l-[3px] px-2.5 py-1.5 transition-all sm:px-3 sm:py-2 ${
        didAttend
          ? "bg-lavender/10 opacity-80 dark:bg-lavender/10"
          : "bg-gradient-to-r from-lavender/10 to-cream/80 shadow-sm dark:from-lavender/10 dark:to-dark-surface"
      }`}
      style={{ borderLeftColor: memberColor }}
    >
      <button
        type="button"
        onClick={() => onClick?.(event)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-1 inline-block text-xs opacity-60"
            title="Event from Google Calendar"
          >
            📅
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-tight text-forest sm:text-base dark:text-cream">
              {event.title}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-forest/50 dark:text-cream/50">
                {formatTimeRange(event)}
              </span>
              {assignedName && (
                <span
                  className="inline-flex items-center gap-1 text-xs"
                  title={`For ${assignedName}`}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: memberColor }}
                  />
                  <span className="text-forest/60 dark:text-cream/60">
                    {assignedName}
                  </span>
                </span>
              )}
              {event.location && (
                <span
                  className="truncate text-xs text-forest/40 dark:text-cream/40"
                  title={event.location}
                >
                  · {event.location}
                </span>
              )}
              {event.points > 0 && (
                <span className="text-xs font-medium text-soft-gold">
                  +{event.points}pt
                </span>
              )}
              {event.completions.length > 0 && (
                <span className="text-xs text-sage dark:text-sage-light">
                  ✓ {event.completions.map((c) => c.completed_by_name).join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {canCheckIn && (
        <div className="mt-1.5 flex justify-end">
          {didAttend ? (
            <button
              type="button"
              onClick={() => onUncomplete?.(event, currentMember.id)}
              className="rounded-full border border-sage/40 bg-sage/10 px-2.5 py-0.5 text-xs font-medium text-sage transition-colors hover:bg-sage/20 dark:border-sage-light/40 dark:bg-sage-light/10 dark:text-sage-light"
            >
              ✓ I went
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onComplete?.(event, currentMember.id)}
              className="rounded-full border border-soft-gold/40 bg-soft-gold/10 px-2.5 py-0.5 text-xs font-medium text-soft-gold-dark transition-colors hover:bg-soft-gold/20 dark:bg-soft-gold/10 dark:text-soft-gold"
            >
              I went (+{event.points})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
