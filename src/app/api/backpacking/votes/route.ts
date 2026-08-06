import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";
import { TRIP_PEOPLE } from "@/lib/backpacking-gear";

export async function GET() {
  try {
    const result = await query(
      `SELECT question_id, person, choice, updated_at FROM trip_votes ORDER BY updated_at`
    );

    if (!result) {
      return NextResponse.json({ data: [], mock: true });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Votes fetch error:", error);
    await captureServerException(error, { route: "GET /api/backpacking/votes" });
    return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question_id, person, choice } = body;

    if (!question_id || typeof question_id !== "string") {
      return NextResponse.json({ error: "Question id is required" }, { status: 400 });
    }
    if (!person || !(TRIP_PEOPLE as readonly string[]).includes(person)) {
      return NextResponse.json({ error: "Pick who you are first" }, { status: 400 });
    }
    if (!choice || typeof choice !== "string") {
      return NextResponse.json({ error: "Choice is required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO trip_votes (question_id, person, choice)
       VALUES ($1, $2, $3)
       ON CONFLICT (question_id, person)
       DO UPDATE SET choice = EXCLUDED.choice, updated_at = NOW()
       RETURNING question_id, person, choice`,
      [question_id.slice(0, 50), person, choice.slice(0, 120)]
    );

    if (!result) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Vote error:", error);
    await captureServerException(error, { route: "POST /api/backpacking/votes" });
    return NextResponse.json({ error: "Failed to save vote" }, { status: 500 });
  }
}
