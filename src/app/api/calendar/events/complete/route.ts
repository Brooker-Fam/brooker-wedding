import { NextRequest, NextResponse } from "next/server";
import { completeEvent, uncompleteEvent } from "@/lib/calendar/events-db";
import { captureServerException } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, completed_by, date, points_earned } = body ?? {};
    if (
      typeof event_id !== "number" ||
      typeof completed_by !== "number" ||
      typeof date !== "string"
    ) {
      return NextResponse.json(
        { error: "event_id, completed_by, date required" },
        { status: 400 }
      );
    }
    await completeEvent(
      event_id,
      completed_by,
      date,
      typeof points_earned === "number" ? points_earned : 0
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    await captureServerException(err, {
      route: "POST /api/calendar/events/complete",
    });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = Number(searchParams.get("event_id"));
    const completedBy = Number(searchParams.get("completed_by"));
    if (!Number.isFinite(eventId) || !Number.isFinite(completedBy)) {
      return NextResponse.json(
        { error: "event_id and completed_by required" },
        { status: 400 }
      );
    }
    await uncompleteEvent(eventId, completedBy);
    return NextResponse.json({ ok: true });
  } catch (err) {
    await captureServerException(err, {
      route: "DELETE /api/calendar/events/complete",
    });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
