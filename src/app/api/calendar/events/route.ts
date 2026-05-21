import { after, NextRequest, NextResponse } from "next/server";
import { getEventsForDateRange } from "@/lib/calendar/events-db";
import { maybeSyncIfStale } from "@/lib/calendar/google-sync";
import { captureServerException } from "@/lib/posthog-server";

// Background sync can take a few seconds; allow headroom for the after() task.
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

    const events = await getEventsForDateRange(start, end);

    // Opportunistic Google sync runs AFTER the response is sent so it never
    // blocks the calendar from rendering. maybeSyncIfStale is internally
    // throttled (15 min) and the client polls every 5 min while visible, so
    // fresh events arrive on the next tick rather than this request.
    after(async () => {
      try {
        await maybeSyncIfStale();
      } catch (err) {
        await captureServerException(err, {
          route: "after GET /api/calendar/events (sync)",
        });
      }
    });

    return NextResponse.json(events);
  } catch (err) {
    await captureServerException(err, { route: "GET /api/calendar/events" });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
