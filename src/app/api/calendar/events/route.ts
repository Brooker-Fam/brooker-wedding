import { NextRequest, NextResponse } from "next/server";
import { getEventsForDateRange } from "@/lib/calendar/events-db";
import { maybeSyncIfStale } from "@/lib/calendar/google-sync";
import { captureServerException } from "@/lib/posthog-server";

// Incremental sync can take a few seconds when many events changed.
export const maxDuration = 30;

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

    // Opportunistic sync: if it's been > 15 min since the last sync attempt,
    // pull fresh events from Google first. Internally throttled so concurrent
    // page loads collapse to a single sync. Failures are swallowed so a broken
    // Google connection doesn't break the calendar view.
    await maybeSyncIfStale();

    const events = await getEventsForDateRange(start, end);
    return NextResponse.json(events);
  } catch (err) {
    await captureServerException(err, { route: "GET /api/calendar/events" });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
