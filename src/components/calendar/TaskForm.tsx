"use client";

import { useState, useEffect } from "react";
import type { FamilyMember, TaskWithCompletion } from "@/lib/calendar/types";
import {
  parseLocalDate,
  weekdayCode,
} from "@/lib/calendar/recurrence";

interface TaskFormProps {
  members: FamilyMember[];
  editingTask: TaskWithCompletion | null;
  defaultDate: string | null;
  onSave: (data: TaskFormData) => void;
  onCancel: () => void;
}

export interface TaskFormData {
  id?: number;
  title: string;
  description: string | null;
  assigned_to: number | null;
  priority: "low" | "medium" | "high";
  points: number;
  due_date: string;
  due_time: string | null;
  recurrence_rule: string | null;
}

type RecurrencePreset =
  | "none"
  | "daily"
  | "weekdays"
  | "weekly"
  | "biweekly"
  | "monthly";

const RECURRENCE_OPTIONS: { value: RecurrencePreset; label: string }[] = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Every day" },
  { value: "weekdays", label: "Weekdays (Mon–Fri)" },
  { value: "weekly", label: "Weekly (same day)" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
];

function buildRule(preset: RecurrencePreset, dueDate: string): string | null {
  if (preset === "none" || !dueDate) return null;

  switch (preset) {
    case "daily":
      return "FREQ=DAILY";
    case "weekdays":
      return "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR";
    case "weekly": {
      const day = weekdayCode(parseLocalDate(dueDate).getDay());
      return `FREQ=WEEKLY;BYDAY=${day}`;
    }
    case "biweekly": {
      const day = weekdayCode(parseLocalDate(dueDate).getDay());
      return `FREQ=WEEKLY;INTERVAL=2;BYDAY=${day}`;
    }
    case "monthly": {
      const day = parseLocalDate(dueDate).getDate();
      return `FREQ=MONTHLY;BYMONTHDAY=${day}`;
    }
  }
}

function ruleToPreset(rule: string | null): RecurrencePreset {
  if (!rule) return "none";
  const upper = rule.toUpperCase();
  if (upper === "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR") return "weekdays";
  if (upper === "FREQ=DAILY") return "daily";
  if (upper.startsWith("FREQ=WEEKLY") && upper.includes("INTERVAL=2")) {
    return "biweekly";
  }
  if (upper.startsWith("FREQ=WEEKLY")) return "weekly";
  if (upper.startsWith("FREQ=MONTHLY")) return "monthly";
  return "none";
}

export default function TaskForm({
  members,
  editingTask,
  defaultDate,
  onSave,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState<number | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [points, setPoints] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [recurrence, setRecurrence] = useState<RecurrencePreset>("none");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? "");
      setAssignedTo(editingTask.assigned_to);
      setPriority(editingTask.priority);
      setPoints(editingTask.points);
      // due_date may arrive as ISO timestamp from Postgres — keep date part only.
      setDueDate(editingTask.due_date?.split("T")[0] ?? "");
      setDueTime(editingTask.due_time?.slice(0, 5) ?? "");
      setRecurrence(ruleToPreset(editingTask.recurrence_rule));
    } else {
      setTitle("");
      setDescription("");
      setAssignedTo(null);
      setPriority("medium");
      setPoints(0);
      setDueDate(defaultDate ?? "");
      setDueTime("");
      setRecurrence("none");
    }
  }, [editingTask, defaultDate]);

  // Clearing the due date removes the recurrence anchor.
  useEffect(() => {
    if (!dueDate && recurrence !== "none") {
      setRecurrence("none");
    }
  }, [dueDate, recurrence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    onSave({
      id: editingTask?.id,
      title: title.trim(),
      description: description.trim() || null,
      assigned_to: assignedTo,
      priority,
      points,
      due_date: dueDate,
      due_time: dueTime || null,
      recurrence_rule: buildRule(recurrence, dueDate),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/20 p-4 backdrop-blur-sm dark:bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-sage/20 bg-cream p-6 shadow-xl dark:border-soft-gold/15 dark:bg-dark-bg"
      >
        <h2 className="mb-4 font-[family-name:var(--font-cormorant-garamond)] text-xl font-bold text-forest dark:text-cream">
          {editingTask ? "Edit Task" : "New Task"}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="enchanted-input"
            autoFocus
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="enchanted-input min-h-[60px] resize-none"
            rows={2}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-forest/60 dark:text-cream/60">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="enchanted-input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-forest/60 dark:text-cream/60">
                Time (optional)
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="enchanted-input"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-forest/60 dark:text-cream/60">
              Assign to
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAssignedTo(null)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  assignedTo === null
                    ? "border-sage bg-sage/15 text-forest dark:border-sage-light dark:text-cream"
                    : "border-sage/20 text-forest/50 hover:border-sage/40 dark:border-cream/10 dark:text-cream/50"
                }`}
              >
                Anyone
              </button>
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setAssignedTo(m.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    assignedTo === m.id
                      ? "border-current/30 text-forest dark:text-cream"
                      : "border-sage/20 text-forest/50 hover:border-sage/40 dark:border-cream/10 dark:text-cream/50"
                  }`}
                  style={
                    assignedTo === m.id
                      ? {
                          backgroundColor: m.color + "20",
                          borderColor: m.color + "60",
                        }
                      : undefined
                  }
                >
                  {m.avatar_emoji} {m.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-forest/60 dark:text-cream/60">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high")
                }
                className="enchanted-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-forest/60 dark:text-cream/60">
                Points
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                min={0}
                max={100}
                className="enchanted-input"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-forest/60 dark:text-cream/60">
              Repeats
            </label>
            <select
              value={recurrence}
              onChange={(e) =>
                setRecurrence(e.target.value as RecurrencePreset)
              }
              disabled={!dueDate}
              className="enchanted-input disabled:cursor-not-allowed disabled:opacity-50"
            >
              {RECURRENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {!dueDate && (
              <p className="mt-1 text-xs text-forest/40 dark:text-cream/40">
                Set a due date to enable repeats.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-medium text-forest/60 transition-colors hover:bg-sage/10 dark:text-cream/60 dark:hover:bg-cream/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-forest px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest-light dark:bg-sage dark:hover:bg-sage-light"
          >
            {editingTask ? "Save" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
