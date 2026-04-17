import { NextResponse } from "next/server";
import {
  createTask,
  getLatestRecurringInstances,
} from "@/lib/calendar/db";
import {
  formatLocalDate,
  nextOccurrence,
  parseLocalDate,
} from "@/lib/calendar/recurrence";
import { captureServerException } from "@/lib/posthog-server";

/**
 * POST /api/calendar/recurrence/backfill
 *
 * Walks every recurring task series, finds the latest instance, and inserts
 * the next occurrence if the latest one is in the past. Idempotent-ish: only
 * spawns one step per run, so calling it nightly from a cron catches up over
 * multiple days without producing duplicates.
 *
 * Protected by the same admin basic-auth middleware as the other admin APIs.
 */
export async function POST() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latest = await getLatestRecurringInstances();
    const created: Array<{
      source_task_id: number;
      new_due_date: string;
    }> = [];
    const skipped: Array<{ task_id: number; reason: string }> = [];

    for (const task of latest) {
      if (!task.recurrence_rule || !task.due_date) {
        skipped.push({ task_id: task.id, reason: "missing rule or due_date" });
        continue;
      }

      const dueKey = task.due_date.split("T")[0];
      const dueLocal = parseLocalDate(dueKey);

      // Only spawn if the latest instance is already past.
      if (dueLocal.getTime() >= today.getTime()) {
        skipped.push({ task_id: task.id, reason: "latest is in the future" });
        continue;
      }

      const next = nextOccurrence(task.recurrence_rule, dueLocal);
      if (!next) {
        skipped.push({
          task_id: task.id,
          reason: "unsupported recurrence rule",
        });
        continue;
      }

      const nextKey = formatLocalDate(next);
      await createTask({
        household_id: task.household_id,
        title: task.title,
        description: task.description,
        assigned_to: task.assigned_to,
        priority: task.priority,
        points: task.points,
        due_date: nextKey,
        due_time: task.due_time,
        duration_minutes: task.duration_minutes,
        recurrence_rule: task.recurrence_rule,
        source: task.source,
        status: "pending",
      });

      created.push({ source_task_id: task.id, new_due_date: nextKey });
    }

    return NextResponse.json({
      success: true,
      created_count: created.length,
      skipped_count: skipped.length,
      created,
      skipped,
    });
  } catch (err) {
    console.error("POST /api/calendar/recurrence/backfill failed:", err);
    await captureServerException(err, {
      route: "POST /api/calendar/recurrence/backfill",
    });
    return NextResponse.json(
      { error: "Failed to backfill recurring tasks" },
      { status: 500 }
    );
  }
}
