"use client";

import type { TaskWithCompletion } from "@/lib/calendar/types";
import { formatRecurrence } from "@/lib/calendar/recurrence";

interface TaskCardProps {
  task: TaskWithCompletion;
  isAdmin: boolean;
  onToggleComplete: (task: TaskWithCompletion) => void;
  onEdit: (task: TaskWithCompletion) => void;
  onDelete: (task: TaskWithCompletion) => void;
  /**
   * "compact" fits week-grid cells; "spacious" is for the day view where
   * we have room for a giant, obviously-tappable check target.
   */
  variant?: "compact" | "spacious";
}

const priorityIndicator: Record<string, string> = {
  high: "border-l-red-400 dark:border-l-red-500",
  medium: "border-l-soft-gold dark:border-l-soft-gold",
  low: "border-l-sage/40 dark:border-l-sage/30",
};

export default function TaskCard({
  task,
  isAdmin,
  onToggleComplete,
  onEdit,
  onDelete,
  variant = "compact",
}: TaskCardProps) {
  const isCompleted = !!task.completion_id;
  const memberColor = task.member_color ?? "#888";
  const isSpacious = variant === "spacious";

  return (
    <div
      className={`group relative rounded-lg border-l-[3px] transition-all ${
        isSpacious ? "px-3 py-3 sm:px-4 sm:py-4" : "px-2.5 py-1.5 sm:px-3 sm:py-2"
      } ${priorityIndicator[task.priority] ?? priorityIndicator.medium} ${
        isCompleted
          ? "bg-sage/5 opacity-60 dark:bg-sage/5"
          : "bg-cream/80 shadow-sm dark:bg-dark-surface"
      }`}
    >
      <div className={`flex items-center ${isSpacious ? "gap-4" : "items-start gap-2"}`}>
        <button
          onClick={() => onToggleComplete(task)}
          className={`shrink-0 flex items-center justify-center rounded-full border-2 transition-all active:scale-90 ${
            isSpacious
              ? "h-12 w-12 sm:h-14 sm:w-14"
              : "mt-0.5 h-5 w-5"
          } ${
            isCompleted
              ? "border-sage bg-sage text-white dark:border-sage-light dark:bg-sage-light"
              : isSpacious
                ? "border-current bg-cream/40 hover:bg-soft-gold/10 dark:bg-dark-surface"
                : "border-current opacity-40 hover:opacity-70"
          }`}
          style={{ borderColor: isCompleted ? undefined : memberColor }}
          aria-label={
            isCompleted
              ? `Uncheck ${task.title}`
              : `Mark ${task.title} done`
          }
        >
          {isCompleted ? (
            <svg
              width={isSpacious ? "24" : "10"}
              height={isSpacious ? "24" : "10"}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6l3 3 5-5" />
            </svg>
          ) : isSpacious ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : null}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`font-medium leading-tight ${
              isSpacious ? "text-lg sm:text-xl" : "text-sm sm:text-base"
            } ${
              isCompleted
                ? "text-forest/40 line-through dark:text-cream/40"
                : "text-forest dark:text-cream"
            }`}
          >
            {task.title}
          </p>

          <div className={`mt-1 flex flex-wrap items-center ${isSpacious ? "gap-2" : "gap-1.5"}`}>
            {task.member_emoji && (
              <span
                className={`inline-flex items-center gap-1 ${isSpacious ? "text-sm" : "text-xs"}`}
                title={task.member_name ?? ""}
              >
                <span
                  className={`inline-block rounded-full ${isSpacious ? "h-2.5 w-2.5" : "h-2 w-2"}`}
                  style={{ backgroundColor: memberColor }}
                />
                <span className="text-forest/60 dark:text-cream/60">
                  {task.member_name}
                </span>
              </span>
            )}
            {task.due_time && (
              <span className={`text-forest/40 dark:text-cream/40 ${isSpacious ? "text-sm" : "text-xs"}`}>
                {task.due_time.slice(0, 5)}
              </span>
            )}
            {task.points > 0 && (
              <span className={`font-medium text-soft-gold ${isSpacious ? "text-sm" : "text-xs"}`}>
                +{task.points}pt
              </span>
            )}
            {task.recurrence_rule && (
              <span
                className={`inline-flex items-center gap-0.5 rounded-full bg-lavender/15 font-medium text-forest/60 dark:bg-lavender/10 dark:text-cream/60 ${
                  isSpacious ? "px-2 py-0.5 text-xs" : "px-1.5 py-0.5 text-[10px]"
                }`}
                title={`Repeats: ${task.recurrence_rule}`}
              >
                <span aria-hidden="true">🔁</span>
                <span>{formatRecurrence(task.recurrence_rule)}</span>
              </span>
            )}
            {isCompleted && task.completed_by_name && (
              <span
                className={`inline-flex items-center gap-1 rounded-full bg-sage/15 text-sage-dark dark:bg-sage/20 dark:text-sage-light ${
                  isSpacious ? "px-2 py-0.5 text-xs" : "px-1.5 py-0.5 text-[10px]"
                }`}
              >
                ✓ by {task.completed_by_name}
              </span>
            )}
          </div>
        </div>

        {isAdmin && (
          <div
            className={`flex shrink-0 gap-1 opacity-60 transition-opacity hover:opacity-100 ${
              isSpacious ? "" : ""
            }`}
          >
            <button
              onClick={() => onEdit(task)}
              className={`rounded text-forest/40 hover:bg-sage/10 hover:text-forest dark:text-cream/40 dark:hover:bg-cream/10 dark:hover:text-cream ${
                isSpacious ? "p-2" : "p-1"
              }`}
              aria-label="Edit task"
            >
              <svg
                width={isSpacious ? "18" : "14"}
                height={isSpacious ? "18" : "14"}
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
            <button
              onClick={() => onDelete(task)}
              className={`rounded text-forest/40 hover:bg-red-50 hover:text-red-500 dark:text-cream/40 dark:hover:bg-red-900/20 dark:hover:text-red-400 ${
                isSpacious ? "p-2" : "p-1"
              }`}
              aria-label="Delete task"
            >
              <svg
                width={isSpacious ? "18" : "14"}
                height={isSpacious ? "18" : "14"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
