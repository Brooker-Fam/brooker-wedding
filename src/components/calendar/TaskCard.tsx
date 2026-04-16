"use client";

import type { TaskWithCompletion } from "@/lib/calendar/types";

interface TaskCardProps {
  task: TaskWithCompletion;
  isAdmin: boolean;
  onToggleComplete: (task: TaskWithCompletion) => void;
  onEdit: (task: TaskWithCompletion) => void;
  onDelete: (task: TaskWithCompletion) => void;
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
}: TaskCardProps) {
  const isCompleted = !!task.completion_id;
  const memberColor = task.member_color ?? "#888";

  return (
    <div
      className={`group relative rounded-lg border-l-[3px] px-2.5 py-1.5 transition-all sm:px-3 sm:py-2 ${
        priorityIndicator[task.priority] ?? priorityIndicator.medium
      } ${
        isCompleted
          ? "bg-sage/5 opacity-60 dark:bg-sage/5"
          : "bg-cream/80 shadow-sm dark:bg-dark-surface"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={() => onToggleComplete(task)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isCompleted
              ? "border-sage bg-sage text-white dark:border-sage-light dark:bg-sage-light"
              : "border-current opacity-40 hover:opacity-70"
          }`}
          style={{ borderColor: isCompleted ? undefined : memberColor }}
          aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
        >
          {isCompleted && (
            <svg
              width="10"
              height="10"
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

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium leading-tight sm:text-base ${
              isCompleted
                ? "text-forest/40 line-through dark:text-cream/40"
                : "text-forest dark:text-cream"
            }`}
          >
            {task.title}
          </p>

          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            {task.member_emoji && (
              <span
                className="inline-flex items-center gap-1 text-xs"
                title={task.member_name ?? ""}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: memberColor }}
                />
                <span className="text-forest/60 dark:text-cream/60">
                  {task.member_name}
                </span>
              </span>
            )}
            {task.due_time && (
              <span className="text-xs text-forest/40 dark:text-cream/40">
                {task.due_time.slice(0, 5)}
              </span>
            )}
            {task.points > 0 && (
              <span className="text-xs font-medium text-soft-gold">
                +{task.points}pt
              </span>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onEdit(task)}
              className="rounded p-1 text-forest/40 hover:bg-sage/10 hover:text-forest dark:text-cream/40 dark:hover:bg-cream/10 dark:hover:text-cream"
              aria-label="Edit task"
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
            <button
              onClick={() => onDelete(task)}
              className="rounded p-1 text-forest/40 hover:bg-red-50 hover:text-red-500 dark:text-cream/40 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              aria-label="Delete task"
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
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
