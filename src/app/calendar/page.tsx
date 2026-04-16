"use client";

import { useState, useEffect, useCallback } from "react";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import TaskCard from "@/components/calendar/TaskCard";
import TaskForm from "@/components/calendar/TaskForm";
import type { TaskFormData } from "@/components/calendar/TaskForm";
import type { FamilyMember, TaskWithCompletion } from "@/lib/calendar/types";

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

async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const creds = sessionStorage.getItem("calendar_admin");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (creds) {
    headers["Authorization"] = `Basic ${creds}`;
  }
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(url, { ...options, headers });
}

export default function CalendarPage() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithCompletion | null>(
    null
  );
  const [formDefaultDate, setFormDefaultDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchTasks, 60000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === "ArrowLeft") {
        setWeekStart((prev) => {
          const d = new Date(prev);
          d.setDate(d.getDate() - 7);
          return d;
        });
      } else if (e.key === "ArrowRight") {
        setWeekStart((prev) => {
          const d = new Date(prev);
          d.setDate(d.getDate() + 7);
          return d;
        });
      } else if (e.key === "t" || e.key === "T") {
        setWeekStart(getMonday(new Date()));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleToggleAdmin = async () => {
    if (isAdmin) {
      sessionStorage.removeItem("calendar_admin");
      setIsAdmin(false);
      return;
    }

    const user = prompt("Username:");
    if (!user) return;
    const pass = prompt("Password:");
    if (!pass) return;

    const creds = btoa(`${user}:${pass}`);
    const res = await fetch("/api/calendar/seed", {
      method: "POST",
      headers: { Authorization: `Basic ${creds}` },
    });

    if (res.ok) {
      sessionStorage.setItem("calendar_admin", creds);
      setIsAdmin(true);
      fetchMembers();
      fetchTasks();
    } else {
      alert("Invalid credentials");
    }
  };

  const handleSaveTask = async (data: TaskFormData) => {
    const method = data.id ? "PUT" : "POST";
    const res = await adminFetch("/api/calendar/tasks", {
      method,
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    }
  };

  const handleToggleComplete = async (task: TaskWithCompletion) => {
    if (!isAdmin) return;
    const assignedMember = members.find((m) => m.id === task.assigned_to);
    const completedBy = assignedMember?.id ?? members[0]?.id;
    if (!completedBy || !task.due_date) return;

    if (task.completion_id) {
      await adminFetch(
        `/api/calendar/complete?task_id=${task.id}&date=${task.due_date}`,
        { method: "DELETE" }
      );
    } else {
      await adminFetch("/api/calendar/complete", {
        method: "POST",
        body: JSON.stringify({
          task_id: task.id,
          completed_by: completedBy,
          date: task.due_date,
          points_earned: task.points,
        }),
      });
    }
    fetchTasks();
  };

  const handleEdit = (task: TaskWithCompletion) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (task: TaskWithCompletion) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    await adminFetch(`/api/calendar/tasks?id=${task.id}`, {
      method: "DELETE",
    });
    fetchTasks();
  };

  const handleAddTask = (dateKey: string) => {
    setFormDefaultDate(dateKey);
    setEditingTask(null);
    setShowForm(true);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  return (
    <div className="min-h-screen">
      <CalendarHeader
        weekStart={weekStart}
        onPrevWeek={() =>
          setWeekStart((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 7);
            return d;
          })
        }
        onNextWeek={() =>
          setWeekStart((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 7);
            return d;
          })
        }
        onToday={() => setWeekStart(getMonday(new Date()))}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
      />

      {/* Member legend */}
      {members.length > 0 && (
        <div className="flex flex-wrap gap-3 px-4 pb-3 sm:px-6">
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
        </div>
      )}

      {/* Week grid */}
      <div className="grid min-h-[calc(100vh-120px)] grid-cols-1 gap-px bg-sage/10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 dark:bg-soft-gold/5">
        {days.map((day) => {
          const key = formatDateKey(day);
          const isToday = key === formatDateKey(today);
          const dayTasks = tasksByDay[key] ?? [];

          return (
            <div
              key={key}
              className={`flex min-h-[180px] flex-col bg-cream p-2 sm:min-h-[250px] sm:p-3 dark:bg-dark-bg ${
                isToday ? "ring-2 ring-inset ring-soft-gold/40" : ""
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    isToday
                      ? "text-soft-gold-dark dark:text-soft-gold"
                      : "text-forest/70 dark:text-cream/70"
                  }`}
                >
                  {getDayLabel(day, today)}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => handleAddTask(key)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-forest/30 transition-colors hover:bg-sage/10 hover:text-forest dark:text-cream/30 dark:hover:bg-cream/10 dark:hover:text-cream"
                    aria-label={`Add task on ${key}`}
                  >
                    +
                  </button>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1.5">
                {loading && dayTasks.length === 0 && (
                  <div className="flex flex-1 items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-sage/30 border-t-sage" />
                  </div>
                )}
                {dayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isAdmin={isAdmin}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

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
    </div>
  );
}
