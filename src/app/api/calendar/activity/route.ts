import { NextRequest, NextResponse } from "next/server";
import { getActivityFeed } from "@/lib/calendar/db";
import { captureServerException } from "@/lib/posthog-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitRaw = searchParams.get("limit");
    const limit = Math.min(
      100,
      Math.max(1, limitRaw ? Number(limitRaw) : 20)
    );
    const rows = await getActivityFeed(undefined, limit);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/calendar/activity failed:", err);
    await captureServerException(err, {
      route: "GET /api/calendar/activity",
    });
    return NextResponse.json(
      { error: "Failed to load activity" },
      { status: 500 }
    );
  }
}
