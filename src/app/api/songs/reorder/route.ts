import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { query } from "@/lib/db";
import { syncSpotifyPlaylist } from "@/lib/spotify";
import { captureServerException } from "@/lib/posthog-server";

// Admin: set sort_position for all songs in the given order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 });
    }

    // Update each song's sort_position based on its index in the array
    for (let i = 0; i < ids.length; i++) {
      await query(
        "UPDATE song_requests SET sort_position = $1 WHERE id = $2",
        [i, Number(ids[i])]
      );
    }

    after(() => syncSpotifyPlaylist().catch((err) => console.error("Spotify sync error:", err)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    await captureServerException(error, { route: "POST /api/songs/reorder" });
    return NextResponse.json({ error: "Failed to reorder songs" }, { status: 500 });
  }
}
