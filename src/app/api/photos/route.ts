import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, content_type, media_type, uploader_name, width, height, size_bytes } = body;

    if (!url || typeof url !== "string" || !/^https:\/\/[^/]*\.(blob\.vercel-storage\.com|public\.blob\.vercel-storage\.com)\//.test(url)) {
      return NextResponse.json({ error: "Valid blob URL is required" }, { status: 400 });
    }

    const mediaType = media_type === "video" ? "video" : "image";
    const name = typeof uploader_name === "string" ? uploader_name.trim().slice(0, 255) : null;

    const result = await query(
      `INSERT INTO photos (url, content_type, media_type, uploader_name, width, height, size_bytes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, url, content_type, media_type, uploader_name, width, height, created_at`,
      [
        url,
        typeof content_type === "string" ? content_type.slice(0, 100) : null,
        mediaType,
        name && name.length > 0 ? name : null,
        Number.isFinite(width) ? Math.round(width) : null,
        Number.isFinite(height) ? Math.round(height) : null,
        Number.isFinite(size_bytes) ? Math.round(size_bytes) : null,
      ]
    );

    if (!result) {
      return NextResponse.json(
        { error: "Photo could not be saved. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Photo save error:", error);
    await captureServerException(error, { route: "POST /api/photos" });
    return NextResponse.json({ error: "Failed to save photo" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") || 200), 500);
    const sinceId = Number(searchParams.get("since") || 0);

    const result = sinceId > 0
      ? await query(
          `SELECT id, url, content_type, media_type, uploader_name, width, height, created_at
           FROM photos WHERE approved = TRUE AND id > $1
           ORDER BY id DESC LIMIT $2`,
          [sinceId, limit]
        )
      : await query(
          `SELECT id, url, content_type, media_type, uploader_name, width, height, created_at
           FROM photos WHERE approved = TRUE
           ORDER BY id DESC LIMIT $1`,
          [limit]
        );

    if (!result) {
      // No DB configured (local/dev without DATABASE_URL) — return empty gallery.
      return NextResponse.json({ data: [], mock: true });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Photos fetch error:", error);
    await captureServerException(error, { route: "GET /api/photos" });
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

// Moderation: remove a photo (DB row + Blob file). Gated by CRON_SECRET, which
// already exists in the project's env — reused so no new secret is needed.
export async function DELETE(request: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;
    const auth = request.headers.get("authorization");
    if (!secret || auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Valid photo id is required" }, { status: 400 });
    }

    const rows = await query(`SELECT url FROM photos WHERE id = $1`, [id]);
    if (!rows) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    if (rows.length === 0) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    await del(rows[0].url as string).catch(() => {});
    await query(`DELETE FROM photos WHERE id = $1`, [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Photo delete error:", error);
    await captureServerException(error, { route: "DELETE /api/photos" });
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
