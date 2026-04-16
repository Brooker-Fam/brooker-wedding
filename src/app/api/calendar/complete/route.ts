import { NextRequest, NextResponse } from "next/server";
import { completeTask, uncompleteTask } from "@/lib/calendar/db";

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
    return NextResponse.json({ success: true });
  } catch {
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
