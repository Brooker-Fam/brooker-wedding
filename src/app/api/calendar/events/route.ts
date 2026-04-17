import { NextRequest, NextResponse } from "next/server";
import { getEventsForDateRange } from "@/lib/calendar/events-db";
import { captureServerException } from "@/lib/posthog-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    if (!start || !end) {
      return NextResponse.json(
        { error: "start and end query params required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }
    const events = await getEventsForDateRange(start, end);
    return NextResponse.json(events);
  } catch (err) {
    await captureServerException(err, { route: "GET /api/calendar/events" });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
