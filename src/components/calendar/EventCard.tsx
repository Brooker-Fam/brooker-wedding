"use client";

import type {
  CalendarEventWithMember,
  FamilyMember,
} from "@/lib/calendar/types";
import { isEventCompleted } from "@/lib/calendar/event-rules";

interface EventCardProps {
  event: CalendarEventWithMember;
  members: FamilyMember[];
  onToggleComplete?: (event: CalendarEventWithMember) => void;
  onEdit?: (event: CalendarEventWithMember) => void;
  onClick?: (event: CalendarEventWithMember) => void;
  variant?: "compact" | "spacious";
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
  onToggleComplete,
  onEdit,
  onClick,
  variant = "compact",
}: EventCardProps) {
  const memberColor = event.color_override ?? event.member_color ?? "#B8A9C9";
  const assignedName = event.member_name;
  const isSpacious = variant === "spacious";
  const isCompleted = isEventCompleted(event);

  // If nothing custom is wired for onClick, tapping the card body toggles
  // completion — matches how TaskCard's big body feels. Admin still gets
  // the pencil button for edits via stopPropagation.
  const handleBodyClick = () => {
    if (onClick) {
      onClick(event);
      return;
    }
    onToggleComplete?.(event);
  };

  return (
    <div
      className={`group relative rounded-lg border-l-[3px] transition-all ${
        isSpacious ? "px-3 py-3 sm:px-4 sm:py-4" : "px-2.5 py-1.5 sm:px-3 sm:py-2"
      } ${
        isCompleted
          ? "bg-lavender/5 opacity-70 dark:bg-lavender/5"
          : "bg-gradient-to-r from-lavender/10 to-cream/80 shadow-sm dark:from-lavender/10 dark:to-dark-surface"
      }`}
      style={{ borderLeftColor: memberColor }}
    >
      <div className={`flex items-start ${isSpacious ? "gap-3" : "gap-2"}`}>
        {onToggleComplete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(event);
            }}
            className={`shrink-0 flex items-center justify-center rounded-full border-2 transition-all active:scale-90 ${
              isSpacious ? "h-12 w-12 sm:h-14 sm:w-14" : "mt-0.5 h-6 w-6"
            } ${
              isCompleted
                ? "border-sage bg-sage text-white dark:border-sage-light dark:bg-sage-light"
                : isSpacious
                  ? "border-current bg-cream/40 hover:bg-soft-gold/10 dark:bg-dark-surface"
                  : "border-current hover:opacity-80"
            }`}
            style={{ borderColor: isCompleted ? undefined : memberColor }}
            aria-label={isCompleted ? "Mark un-attended" : "Mark attended"}
          >
            {isCompleted && (
              <svg
                width={isSpacious ? "22" : "12"}
                height={isSpacious ? "22" : "12"}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6l3 3 5-5" />
              </svg>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={handleBodyClick}
          className={`flex min-w-0 flex-1 items-start text-left ${
            isSpacious ? "gap-3" : "gap-2"
          }`}
        >
          <span
            aria-hidden="true"
            className={`mt-0.5 inline-block opacity-60 ${
              isSpacious ? "text-base" : "text-xs"
            }`}
            title="Event from Google Calendar"
          >
            📅
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`font-medium leading-tight ${
                isCompleted
                  ? "text-forest/50 line-through dark:text-cream/50"
                  : "text-forest dark:text-cream"
              } ${isSpacious ? "text-lg sm:text-xl" : "text-sm sm:text-base"}`}
            >
              {event.title}
            </p>
            <div
              className={`mt-1 flex flex-wrap items-center ${
                isSpacious ? "gap-2" : "gap-1.5"
              }`}
            >
              <span
                className={`text-forest/50 dark:text-cream/50 ${
                  isSpacious ? "text-sm" : "text-xs"
                }`}
              >
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
                  ✓{" "}
                  {event.completions
                    .map((c) => c.completed_by_name)
                    .join(", ")}
                </span>
              )}
            </div>
          </div>
        </button>

        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            className="shrink-0 rounded p-1 text-forest/40 transition-opacity hover:bg-sage/10 hover:text-forest sm:opacity-0 sm:group-hover:opacity-100 dark:text-cream/40 dark:hover:bg-cream/10 dark:hover:text-cream"
            aria-label="Edit event points or assignee"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
