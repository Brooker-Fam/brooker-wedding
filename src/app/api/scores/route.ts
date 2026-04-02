import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player_name, game_id, score } = body;

    if (!player_name || typeof player_name !== "string" || player_name.trim().length === 0) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
    }

    if (!game_id || typeof game_id !== "string") {
      return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
    }

    const numScore = Number(score);
    if (isNaN(numScore) || numScore < 0) {
      return NextResponse.json({ error: "Valid score is required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO game_scores (player_name, game_id, score)
       VALUES ($1, $2, $3)
       RETURNING id, player_name, game_id, score, created_at`,
      [player_name.trim(), game_id.trim(), numScore]
    );

    if (!result) {
      return NextResponse.json(
        { error: "Score could not be saved. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Score submission error:", error);
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("game_id") || "chicken-chase";
    const limit = Math.min(Number(searchParams.get("limit") || 10), 100);

    const result = await query(
      `SELECT id, player_name, game_id, score, created_at
       FROM game_scores
       WHERE game_id = $1
       ORDER BY score DESC
       LIMIT $2`,
      [gameId, limit]
    );

    if (!result) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Scores fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}
