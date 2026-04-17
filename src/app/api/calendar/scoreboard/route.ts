import { NextResponse } from "next/server";
import { getScoreboard } from "@/lib/calendar/db";
import { captureServerException } from "@/lib/posthog-server";

export async function GET() {
  try {
    const entries = await getScoreboard();
    return NextResponse.json(entries);
  } catch (err) {
    console.error("GET /api/calendar/scoreboard failed:", err);
    await captureServerException(err, {
      route: "GET /api/calendar/scoreboard",
    });
    return NextResponse.json(
      { error: "Failed to load scoreboard" },
      { status: 500 }
    );
  }
}
