import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { query } from "@/lib/db";
import { clean, merge, keyFrom, MAX_BYTES, type Doc } from "@/lib/birth-doc";
import { captureServerException } from "@/lib/posthog-server";

/**
 * Sync for the birth plan / labor support tool at /birth.
 *
 * The page is a static file with no auth, so the private key in the user's
 * URL fragment IS the credential. It is never put in a URL here (header on
 * GET, body on PUT) so it stays out of access logs, and only its SHA-256
 * is stored.
 *
 * The document is a last-write-wins map: { section: { field: { v, t } } }.
 * Merging per field, server side, means Britt marking one thing on her
 * phone and Matt marking another on his both survive -- which whole-document
 * last-write-wins would not.
 */

const hash = (key: string) => createHash("sha256").update(key).digest("hex");

export async function GET(request: NextRequest) {
  try {
    const key = keyFrom(request.headers.get("x-birth-key"));
    if (!key) return NextResponse.json({ error: "Invalid key" }, { status: 400 });

    const rows = await query(
      `SELECT doc, updated_at FROM birth_plans WHERE key_hash = $1`,
      [hash(key)]
    );
    if (!rows) return NextResponse.json({ error: "Sync unavailable" }, { status: 503 });

    // A key with no row yet is normal (nothing saved from any device).
    if (!rows.length) return NextResponse.json({ doc: {}, exists: false });
    return NextResponse.json({
      doc: rows[0].doc ?? {},
      exists: true,
      updated_at: rows[0].updated_at,
    });
  } catch (error) {
    console.error("Birth plan fetch error:", error);
    await captureServerException(error, { route: "GET /api/birth" });
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BYTES) {
      return NextResponse.json({ error: "Document too large" }, { status: 413 });
    }

    let body: { key?: string; doc?: unknown };
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const key = keyFrom(body.key);
    if (!key) return NextResponse.json({ error: "Invalid key" }, { status: 400 });

    let incoming: Doc;
    try {
      incoming = clean(body.doc);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Invalid document" },
        { status: 400 }
      );
    }

    const keyHash = hash(key);
    const existing = await query(`SELECT doc FROM birth_plans WHERE key_hash = $1`, [keyHash]);
    if (!existing) return NextResponse.json({ error: "Sync unavailable" }, { status: 503 });

    const merged = merge((existing[0]?.doc as Doc) || {}, incoming);

    const saved = await query(
      `INSERT INTO birth_plans (key_hash, doc, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key_hash) DO UPDATE SET doc = $2::jsonb, updated_at = NOW()
       RETURNING updated_at`,
      [keyHash, JSON.stringify(merged)]
    );
    if (!saved) return NextResponse.json({ error: "Sync unavailable" }, { status: 503 });

    // Returning the merge lets the client adopt whatever the other phone wrote.
    return NextResponse.json({ doc: merged, updated_at: saved[0].updated_at });
  } catch (error) {
    console.error("Birth plan save error:", error);
    await captureServerException(error, { route: "PUT /api/birth" });
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
