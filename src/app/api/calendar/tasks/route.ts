import { NextRequest, NextResponse } from "next/server";
import {
  getTasksForDateRange,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/calendar/db";

function nullIfEmpty<T>(v: T): T | null {
  if (v === "" || v === undefined) return null;
  return v;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "start and end query params required" },
      { status: 400 }
    );
  }

  const tasks = await getTasksForDateRange(start, end);
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = await createTask({
      household_id: 1,
      title: body.title,
      description: nullIfEmpty(body.description),
      assigned_to: body.assigned_to ?? null,
      priority: body.priority ?? "medium",
      points: body.points ?? 0,
      due_date: nullIfEmpty(body.due_date),
      due_time: nullIfEmpty(body.due_time),
      duration_minutes: body.duration_minutes ?? null,
      recurrence_rule: nullIfEmpty(body.recurrence_rule),
    });
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("POST /api/calendar/tasks failed:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const { id, ...rest } = body;
    const normalized = {
      ...rest,
      description: nullIfEmpty(rest.description),
      due_date: nullIfEmpty(rest.due_date),
      due_time: nullIfEmpty(rest.due_time),
      recurrence_rule: nullIfEmpty(rest.recurrence_rule),
    };
    const task = await updateTask(id, normalized);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (err) {
    console.error("PUT /api/calendar/tasks failed:", err);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const deleted = await deleteTask(parseInt(id));
  if (!deleted) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
