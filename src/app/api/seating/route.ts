import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";

// The entire seating chart is stored as one JSON document in seating_config
// under this key. Guests are derived live from the rsvps table on the client,
// so this only persists the layout (tables, groups) and per-guest assignments.
const CHART_KEY = "chart";

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const result = await query(
      "SELECT value, updated_at FROM seating_config WHERE key = $1",
      [CHART_KEY]
    );

    // No DATABASE_URL -> query() returns null. Tell the client so it can warn.
    if (!result) {
      return NextResponse.json({ data: null, mock: true });
    }

    const chart = result.length > 0 ? safeParse(result[0].value) : null;
    const updatedAt = result.length > 0 ? result[0].updated_at : null;
    return NextResponse.json({ data: chart, updated_at: updatedAt });
  } catch (error) {
    console.error("Seating chart fetch error:", error);
    await captureServerException(error, { route: "GET /api/seating" });
    return NextResponse.json(
      { error: "Failed to load seating chart" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // Accept either { chart: {...} } or the chart object directly.
    const chart = body && typeof body === "object" && "chart" in body ? body.chart : body;

    if (!chart || typeof chart !== "object" || Array.isArray(chart)) {
      return NextResponse.json(
        { error: "Invalid seating chart payload" },
        { status: 400 }
      );
    }

    const serialized = JSON.stringify(chart);

    const result = await query(
      `INSERT INTO seating_config (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE
         SET value = EXCLUDED.value, updated_at = NOW()
       RETURNING updated_at`,
      [CHART_KEY, serialized]
    );

    if (!result) {
      // Database not configured -- changes can't be persisted.
      return NextResponse.json({ success: false, mock: true });
    }

    return NextResponse.json({ success: true, updated_at: result[0].updated_at });
  } catch (error) {
    console.error("Seating chart save error:", error);
    await captureServerException(error, { route: "PUT /api/seating" });
    return NextResponse.json(
      { error: "Failed to save seating chart" },
      { status: 500 }
    );
  }
}
