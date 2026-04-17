"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import CalendarHeader, {
  type CalendarViewMode,
} from "@/components/calendar/CalendarHeader";
import TaskCard from "@/components/calendar/TaskCard";
import TaskForm from "@/components/calendar/TaskForm";
import CompleterPicker from "@/components/calendar/CompleterPicker";
import type { TaskFormData } from "@/components/calendar/TaskForm";
import type { FamilyMember, TaskWithCompletion } from "@/lib/calendar/types";

interface CalendarViewProps {
  adminMode: boolean;
}

const VIEW_STORAGE_KEY = "calendar-view";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDayLabel(date: Date, today: Date): string {
  const isToday = formatDateKey(date) === formatDateKey(today);
  const isTomorrow =
    formatDateKey(date) ===
    formatDateKey(new Date(today.getTime() + 86400000));

  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = date.getDate();

  if (isToday) return `Today · ${dayNum}`;
  if (isTomorrow) return `Tomorrow · ${dayNum}`;
  return `${dayName} · ${dayNum}`;
}

function formatFullDayLabel(date: Date, today: Date): string {
  const isToday = formatDateKey(date) === formatDateKey(today);
  const isTomorrow =
    formatDateKey(date) ===
    formatDateKey(new Date(today.getTime() + 86400000));

  const base = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (isToday) return `Today — ${base}`;
  if (isTomorrow) return `Tomorrow — ${base}`;
  return base;
}

export default function CalendarView({ adminMode }: CalendarViewProps) {
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()));
  const [view, setView] = useState<CalendarViewMode>("week");
  const [viewHydrated, setViewHydrated] = useState(false);
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithCompletion | null>(
    null
  );
  const [formDefaultDate, setFormDefaultDate] = useState<string | null>(null);
  const [pickerTask, setPickerTask] = useState<TaskWithCompletion | null>(null);
  const [loading, setLoading] = useState(true);

  const weekStart = getMonday(anchor);

  // Hydrate view preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY);
      if (saved === "day" || saved === "week") {
        setView(saved);
      }
    } catch {
      // ignore
    }
    setViewHydrated(true);
  }, []);

  // Persist view preference
  useEffect(() => {
    if (!viewHydrated) return;
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      // ignore
    }
  }, [view, viewHydrated]);

  const fetchTasks = useCallback(async () => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    const start = formatDateKey(weekStart);
    const endStr = formatDateKey(end);
    const res = await fetch(`/api/calendar/tasks?start=${start}&end=${endStr}`);
    if (res.ok) {
      setTasks(await res.json());
    }
    setLoading(false);
  }, [weekStart]);

  const fetchMembers = useCallback(async () => {
    const res = await fetch("/api/calendar/members");
    if (res.ok) {
      setMembers(await res.json());
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [fetchTasks]);

  // Auto-seed on first admin visit if empty
  useEffect(() => {
    if (!adminMode) return;
    if (members.length > 0) return;
    fetch("/api/calendar/seed", { method: "POST" }).then((res) => {
      if (res.ok) {
        fetchMembers();
      }
    });
  }, [adminMode, members.length, fetchMembers]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchTasks, 60000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const shiftAnchor = useCallback((days: number) => {
    setAnchor((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return d;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      const step = view === "day" ? 1 : 7;
      if (e.key === "ArrowLeft") {
        shiftAnchor(-step);
      } else if (e.key === "ArrowRight") {
        shiftAnchor(step);
      } else if (e.key === "t" || e.key === "T") {
        setAnchor(startOfDay(new Date()));
      } else if (e.key === "d" || e.key === "D") {
        setView("day");
      } else if (e.key === "w" || e.key === "W") {
        setView("week");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, shiftAnchor]);

  const handleSaveTask = async (data: TaskFormData) => {
    const method = data.id ? "PUT" : "POST";
    const res = await fetch("/api/calendar/tasks", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    }
  };

  const completeFor = async (task: TaskWithCompletion, memberId: number) => {
    if (!task.due_date) return;
    await fetch("/api/calendar/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: task.id,
        completed_by: memberId,
        date: task.due_date,
        points_earned: task.points,
      }),
    });
    fetchTasks();
  };

  const handleToggleComplete = async (task: TaskWithCompletion) => {
    if (!task.due_date) return;

    // Already done → just uncheck.
    if (task.completion_id) {
      await fetch(
        `/api/calendar/complete?task_id=${task.id}&date=${task.due_date}`,
        { method: "DELETE" }
      );
      fetchTasks();
      return;
    }

    // Assigned → credit the assignee directly.
    const assignedMember = members.find((m) => m.id === task.assigned_to);
    if (assignedMember) {
      await completeFor(task, assignedMember.id);
      return;
    }

    // Unassigned → ask who did it.
    if (members.length === 0) return;
    if (members.length === 1) {
      await completeFor(task, members[0].id);
      return;
    }
    setPickerTask(task);
  };

  const handleEdit = (task: TaskWithCompletion) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (task: TaskWithCompletion) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    await fetch(`/api/calendar/tasks?id=${task.id}`, { method: "DELETE" });
    fetchTasks();
  };

  const handleAddTask = (dateKey: string) => {
    setFormDefaultDate(dateKey);
    setEditingTask(null);
    setShowForm(true);
  };

  const today = startOfDay(new Date());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const tasksByDay: Record<string, TaskWithCompletion[]> = {};
  for (const d of days) {
    tasksByDay[formatDateKey(d)] = [];
  }
  for (const task of tasks) {
    if (task.due_date) {
      const key = task.due_date.split("T")[0];
      if (tasksByDay[key]) {
        tasksByDay[key].push(task);
      }
    }
  }

  const anchorKey = formatDateKey(anchor);
  const dayTasks = tasksByDay[anchorKey] ?? [];
  const totalTasks = tasks.length;

  const step = view === "day" ? 1 : 7;

  return (
    <div className="min-h-screen">
      <CalendarHeader
        anchor={anchor}
        view={view}
        onViewChange={setView}
        onPrev={() => shiftAnchor(-step)}
        onNext={() => shiftAnchor(step)}
        onToday={() => setAnchor(startOfDay(new Date()))}
        adminMode={adminMode}
      />

      {/* Member legend */}
      {members.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-4 pb-3 sm:px-6">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-1.5 text-sm">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              <span className="text-forest/70 dark:text-cream/70">
                {m.avatar_emoji} {m.name}
              </span>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {members
              .filter((m) => m.role === "kid")
              .map((m) => (
                <Link
                  key={`kidlink-${m.id}`}
                  href={`/calendar/kid/${m.name.toLowerCase()}`}
                  className="rounded-full border border-soft-gold/40 bg-soft-gold/10 px-3 py-1 text-xs font-medium text-soft-gold-dark transition-colors hover:bg-soft-gold/20 dark:border-soft-gold/30 dark:bg-soft-gold/10 dark:text-soft-gold"
                  title={`${m.name}'s simplified chore view`}
                >
                  {m.avatar_emoji} {m.name}&rsquo;s chores →
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Empty state — week view only; day view has its own inline empty state */}
      {view === "week" && !loading && totalTasks === 0 && (
        <div className="mx-auto mt-6 max-w-md px-4 text-center">
          <p className="text-base text-forest/60 dark:text-cream/60">
            No tasks this week.
          </p>
          {adminMode ? (
            <p className="mt-2 text-sm text-forest/50 dark:text-cream/50">
              Click the <span className="font-semibold">+</span> on any day to
              add one.
            </p>
          ) : (
            <Link
              href="/calendar/admin"
              className="mt-3 inline-block rounded-xl bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest-light dark:bg-sage dark:hover:bg-sage-light"
            >
              Enter admin mode to add tasks →
            </Link>
          )}
        </div>
      )}

      {view === "week" ? (
        /* Week grid */
        <div className="grid min-h-[calc(100vh-120px)] grid-cols-1 gap-px bg-sage/10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 dark:bg-soft-gold/5">
          {days.map((day) => {
            const key = formatDateKey(day);
            const isToday = key === formatDateKey(today);
            const cellTasks = tasksByDay[key] ?? [];

            return (
              <div
                key={key}
                className={`flex min-h-[180px] flex-col bg-cream p-2 sm:min-h-[250px] sm:p-3 dark:bg-dark-bg ${
                  isToday ? "ring-2 ring-inset ring-soft-gold/40" : ""
                }`}
              >
                <div className="mb-2">
                  <span
                    className={`text-sm font-semibold ${
                      isToday
                        ? "text-soft-gold-dark dark:text-soft-gold"
                        : "text-forest/70 dark:text-cream/70"
                    }`}
                  >
                    {getDayLabel(day, today)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-1.5">
                  {loading && cellTasks.length === 0 && (
                    <div className="flex flex-1 items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-sage/30 border-t-sage" />
                    </div>
                  )}
                  {cellTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isAdmin={adminMode}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}

                  {adminMode && (
                    <button
                      onClick={() => handleAddTask(key)}
                      className="group mt-auto flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-sage/30 bg-transparent px-3 py-2 text-sm font-medium text-forest/40 transition-all hover:border-soft-gold/60 hover:bg-soft-gold/10 hover:text-soft-gold-dark dark:border-cream/15 dark:text-cream/40 dark:hover:border-soft-gold/40 dark:hover:bg-soft-gold/10 dark:hover:text-soft-gold"
                      aria-label={`Add task on ${key}`}
                    >
                      <span className="text-base leading-none">+</span>
                      <span>Add task</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Day view */
        <div className="mx-auto w-full max-w-2xl px-4 pb-8 sm:px-6">
          <div
            className={`rounded-2xl bg-cream p-4 sm:p-6 dark:bg-dark-bg ${
              anchorKey === formatDateKey(today)
                ? "ring-2 ring-soft-gold/40"
                : "ring-1 ring-sage/15 dark:ring-soft-gold/10"
            }`}
          >
            <h2 className="mb-4 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-forest dark:text-cream sm:text-3xl">
              {formatFullDayLabel(anchor, today)}
            </h2>

            <div className="flex flex-col gap-2">
              {loading && dayTasks.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-sage/30 border-t-sage" />
                </div>
              )}

              {!loading && dayTasks.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-base text-forest/60 dark:text-cream/60">
                    Nothing on the list for this day.
                  </p>
                  {!adminMode && (
                    <Link
                      href="/calendar/admin"
                      className="mt-3 inline-block rounded-xl bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest-light dark:bg-sage dark:hover:bg-sage-light"
                    >
                      Enter admin mode to add a task →
                    </Link>
                  )}
                </div>
              )}

              {dayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdmin={adminMode}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              {adminMode && (
                <button
                  onClick={() => handleAddTask(anchorKey)}
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-sage/30 bg-transparent px-3 py-2.5 text-sm font-medium text-forest/40 transition-all hover:border-soft-gold/60 hover:bg-soft-gold/10 hover:text-soft-gold-dark dark:border-cream/15 dark:text-cream/40 dark:hover:border-soft-gold/40 dark:hover:bg-soft-gold/10 dark:hover:text-soft-gold"
                  aria-label={`Add task on ${anchorKey}`}
                >
                  <span className="text-base leading-none">+</span>
                  <span>Add task</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <TaskForm
          members={members}
          editingTask={editingTask}
          defaultDate={formDefaultDate}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {pickerTask && (
        <CompleterPicker
          taskTitle={pickerTask.title}
          members={members}
          onCancel={() => setPickerTask(null)}
          onPick={async (memberId) => {
            const task = pickerTask;
            setPickerTask(null);
            await completeFor(task, memberId);
          }}
        />
      )}
    </div>
  );
}
