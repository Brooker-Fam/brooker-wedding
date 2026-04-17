import { NextRequest, NextResponse } from "next/server";
import { refreshCalendarList, updateCalendar } from "@/lib/calendar/google-sync";
import { isConnected } from "@/lib/google";
import { captureServerException } from "@/lib/posthog-server";

const HOUSEHOLD_ID = 1;

export async function GET() {
  try {
    if (!(await isConnected())) {
      return NextResponse.json({ connected: false, calendars: [] });
    }
    const calendars = await refreshCalendarList(HOUSEHOLD_ID);
    return NextResponse.json({ connected: true, calendars });
  } catch (err) {
    await captureServerException(err, {
      route: "GET /api/calendar/google/calendars",
    });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, enabled, assigned_to } = body ?? {};
    if (typeof id !== "number") {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const patch: { enabled?: boolean; assigned_to?: number | null } = {};
    if (typeof enabled === "boolean") patch.enabled = enabled;
    if (assigned_to === null || typeof assigned_to === "number") {
      patch.assigned_to = assigned_to;
    }
    const updated = await updateCalendar(HOUSEHOLD_ID, id, patch);
    if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    await captureServerException(err, {
      route: "PATCH /api/calendar/google/calendars",
    });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
