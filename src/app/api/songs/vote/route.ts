import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { song_request_id, voter_name } = body;

    if (!song_request_id || !Number.isFinite(Number(song_request_id))) {
      return NextResponse.json({ error: "Song ID is required" }, { status: 400 });
    }

    if (!voter_name || typeof voter_name !== "string" || voter_name.trim().length === 0) {
      return NextResponse.json({ error: "Your name is required" }, { status: 400 });
    }

    const name = voter_name.trim();
    const songId = Number(song_request_id);

    // Check if already voted
    const existing = await query(
      "SELECT id FROM song_votes WHERE song_request_id = $1 AND voter_name = $2",
      [songId, name]
    );

    if (existing && existing.length > 0) {
      // Remove vote (toggle off)
      await query(
        "DELETE FROM song_votes WHERE song_request_id = $1 AND voter_name = $2",
        [songId, name]
      );
      return NextResponse.json({ success: true, voted: false });
    }

    // Add vote
    await query(
      `INSERT INTO song_votes (song_request_id, voter_name)
       VALUES ($1, $2)
       ON CONFLICT (song_request_id, voter_name) DO NOTHING`,
      [songId, name]
    );

    return NextResponse.json({ success: true, voted: true });
  } catch (error) {
    console.error("Vote error:", error);
    await captureServerException(error, { route: "POST /api/songs/vote" });
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
