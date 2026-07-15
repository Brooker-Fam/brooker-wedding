import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";
import {
  GoogleApiError,
  batchCreateInAlbum,
  createAlbum,
  isPhotosExportConfigured,
  uploadBytes,
} from "@/lib/google-photos";
import { exportFilename, type Photo } from "@/components/photos/types";

export const dynamic = "force-dynamic";
// Each batch call relays files Blob → this function → Google Photos, so give
// it real headroom; the client keeps calling until every id is processed.
export const maxDuration = 60;

// Stop pulling new files once this much of the invocation has elapsed —
// whatever's already uploaded still gets batchCreated and reported back.
const TIME_BUDGET_MS = 35_000;
// Files are buffered in function memory on the way through; skip monsters.
// Mirrors GP_VIDEO_CAP in the export panel.
const MAX_ITEM_BYTES = 100 * 1024 * 1024;

function getToken(request: NextRequest): string | null {
  return request.cookies.get("gp_token")?.value ?? null;
}

// Connection status for the export panel ("connected" = cookie still alive).
export async function GET(request: NextRequest) {
  return NextResponse.json({
    configured: isPhotosExportConfigured(),
    connected: !!getToken(request),
  });
}

export async function POST(request: NextRequest) {
  const token = getToken(request);
  if (!token) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  let action = "";
  try {
    const body = await request.json();
    action = typeof body.action === "string" ? body.action : "";

    if (action === "init") {
      const album = await createAlbum(token, "Matt & Brittany's Celebration 🎉");
      return NextResponse.json({ albumId: album.id, albumUrl: album.productUrl });
    }

    if (action === "batch") {
      const albumId = typeof body.albumId === "string" ? body.albumId : "";
      const ids: number[] = Array.isArray(body.ids)
        ? body.ids.filter((n: unknown) => Number.isInteger(n) && (n as number) > 0).slice(0, 50)
        : [];
      if (!albumId || ids.length === 0) {
        return NextResponse.json({ error: "albumId and ids are required" }, { status: 400 });
      }

      const rows = await query(
        `SELECT id, url, media_type, content_type, uploader_name, size_bytes, created_at
         FROM photos WHERE approved = TRUE AND id = ANY($1::int[])`,
        [ids]
      );
      if (!rows) {
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
      }
      const byId = new Map(rows.map((r) => [Number(r.id), r]));

      const started = Date.now();
      const processedIds: number[] = [];
      const failures: { id: number; reason: string }[] = [];
      const pending: { id: number; uploadToken: string; fileName: string; description?: string }[] = [];

      for (const id of ids) {
        if (Date.now() - started > TIME_BUDGET_MS) break;

        const row = byId.get(id);
        if (!row) {
          processedIds.push(id);
          failures.push({ id, reason: "no longer in the album" });
          continue;
        }
        if (Number(row.size_bytes) > MAX_ITEM_BYTES) {
          processedIds.push(id);
          failures.push({ id, reason: "file too large for Google export" });
          continue;
        }

        try {
          const fileRes = await fetch(row.url as string);
          if (!fileRes.ok) throw new Error(`fetch failed (${fileRes.status})`);
          const buf = await fileRes.arrayBuffer();
          if (buf.byteLength > MAX_ITEM_BYTES) throw new Error("file too large for Google export");

          const mime =
            (row.content_type as string | null) ||
            (row.media_type === "video" ? "video/mp4" : "image/jpeg");
          const uploadToken = await uploadBytes(token, buf, mime);
          pending.push({
            id,
            uploadToken,
            fileName: exportFilename(row as unknown as Photo),
            description: row.uploader_name ? `Shared by ${row.uploader_name}` : undefined,
          });
        } catch (err) {
          if (err instanceof GoogleApiError && err.status === 401) {
            return NextResponse.json({ error: "not_connected" }, { status: 401 });
          }
          processedIds.push(id);
          failures.push({ id, reason: err instanceof Error ? err.message : "upload failed" });
        }
      }

      if (pending.length > 0) {
        const results = await batchCreateInAlbum(token, albumId, pending);
        pending.forEach((item, i) => {
          processedIds.push(item.id);
          const r = results[i];
          const ok = !!r?.mediaItem || r?.status?.message === "Success" || !r?.status?.code;
          if (!ok) {
            failures.push({ id: item.id, reason: r?.status?.message || "Google rejected the item" });
          }
        });
      }

      return NextResponse.json({ processedIds, failures });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    if (error instanceof GoogleApiError) {
      if (error.status === 401) {
        return NextResponse.json({ error: "not_connected" }, { status: 401 });
      }
      // e.g. "Photos Library API has not been used in project ... before" —
      // surface it: it's the setup hint the admin actually needs.
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    console.error("Google Photos export error:", error);
    await captureServerException(error, { route: `POST /api/photos/google-export (${action})` });
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
