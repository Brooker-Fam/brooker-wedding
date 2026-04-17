import { NextRequest, NextResponse } from "next/server";
import {
  completeTask,
  createTask,
  getTask,
  uncompleteTask,
} from "@/lib/calendar/db";
import {
  formatLocalDate,
  nextOccurrence,
  parseLocalDate,
} from "@/lib/calendar/recurrence";
import { captureServerException } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task_id, completed_by, date, points_earned } = body;

    if (!task_id || !completed_by || !date) {
      return NextResponse.json(
        { error: "task_id, completed_by, and date required" },
        { status: 400 }
      );
    }

    await completeTask(task_id, completed_by, date, points_earned ?? 0);

    // If the completed task is recurring, spawn the next instance.
    // History is preserved — we do NOT delete/update the original row.
    try {
      const task = await getTask(task_id);
      if (task?.recurrence_rule && task.due_date) {
        const anchor = parseLocalDate(task.due_date.split("T")[0]);
        const next = nextOccurrence(task.recurrence_rule, anchor);
        if (next) {
          await createTask({
            household_id: task.household_id,
            title: task.title,
            description: task.description,
            assigned_to: task.assigned_to,
            priority: task.priority,
            points: task.points,
            due_date: formatLocalDate(next),
            due_time: task.due_time,
            duration_minutes: task.duration_minutes,
            recurrence_rule: task.recurrence_rule,
            source: task.source,
            status: "pending",
          });
        }
      }
    } catch (spawnErr) {
      // Spawning a follow-up must not fail the completion itself.
      console.error("Failed to spawn recurring task:", spawnErr);
      await captureServerException(spawnErr, {
        route: "POST /api/calendar/complete",
        phase: "spawn_next_occurrence",
        task_id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/calendar/complete failed:", err);
    await captureServerException(err, { route: "POST /api/calendar/complete" });
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("task_id");
  const date = searchParams.get("date");

  if (!taskId || !date) {
    return NextResponse.json(
      { error: "task_id and date required" },
      { status: 400 }
    );
  }

  await uncompleteTask(parseInt(taskId), date);
  return NextResponse.json({ success: true });
}
