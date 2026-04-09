import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query(
      `SELECT
        sr.*,
        COALESCE(v.vote_count, 0) AS vote_count,
        COALESCE(v.voters, '[]') AS voters
      FROM song_requests sr
      LEFT JOIN (
        SELECT
          song_request_id,
          COUNT(*) AS vote_count,
          json_agg(voter_name ORDER BY created_at) AS voters
        FROM song_votes
        GROUP BY song_request_id
      ) v ON v.song_request_id = sr.id
      ORDER BY sr.sort_position ASC NULLS LAST, vote_count DESC, sr.created_at ASC`
    );

    if (!result) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Songs fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      requester_name,
      song_title,
      artist,
      album_art_url = "",
      preview_url = "",
      itunes_url = "",
      itunes_track_id,
    } = body;

    if (!requester_name || typeof requester_name !== "string" || requester_name.trim().length === 0) {
      return NextResponse.json({ error: "Your name is required" }, { status: 400 });
    }

    if (!song_title || typeof song_title !== "string" || song_title.trim().length === 0) {
      return NextResponse.json({ error: "Song title is required" }, { status: 400 });
    }

    if (!artist || typeof artist !== "string" || artist.trim().length === 0) {
      return NextResponse.json({ error: "Artist is required" }, { status: 400 });
    }

    const name = requester_name.trim();
    const trackId = itunes_track_id ? Number(itunes_track_id) : null;

    // Check for duplicate by itunes_track_id
    if (trackId) {
      const existing = await query(
        "SELECT id FROM song_requests WHERE itunes_track_id = $1",
        [trackId]
      );

      if (existing && existing.length > 0) {
        const songId = existing[0].id;

        // Auto-upvote for the requester (ignore conflict if already voted)
        await query(
          `INSERT INTO song_votes (song_request_id, voter_name)
           VALUES ($1, $2)
           ON CONFLICT (song_request_id, voter_name) DO NOTHING`,
          [songId, name]
        );

        return NextResponse.json({
          success: true,
          duplicate: true,
          song_id: songId,
          message: "Song already on the playlist! Your vote has been added.",
        });
      }
    }

    // Build songlink URL from iTunes track ID
    const songlinkUrl = trackId ? `https://song.link/i/${trackId}` : null;

    // Insert new song request
    const result = await query(
      `INSERT INTO song_requests (requester_name, song_title, artist, album_art_url, preview_url, itunes_url, itunes_track_id, songlink_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        song_title.trim(),
        artist.trim(),
        album_art_url || null,
        preview_url || null,
        itunes_url || null,
        trackId,
        songlinkUrl,
      ]
    );

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Song could not be saved. Please try again later." },
        { status: 503 }
      );
    }

    const songId = result[0].id;

    // Auto-vote for the requester
    await query(
      `INSERT INTO song_votes (song_request_id, voter_name)
       VALUES ($1, $2)
       ON CONFLICT (song_request_id, voter_name) DO NOTHING`,
      [songId, name]
    );

    return NextResponse.json({
      success: true,
      duplicate: false,
      data: result[0],
    });
  } catch (error) {
    console.error("Song submission error:", error);
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 });
  }
}

// Admin: delete song
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Song ID is required" }, { status: 400 });
    }

    const result = await query(
      "DELETE FROM song_requests WHERE id = $1 RETURNING id",
      [Number(id)]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Song delete error:", error);
    return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
  }
}
