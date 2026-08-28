import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { clean, merge, MAX_BYTES, type Doc } from "@/lib/birth-doc";
import { openSession, planFor, SESSION_COOKIE } from "@/lib/birth-auth";
import { captureServerException } from "@/lib/posthog-server";

/**
 * Sync for the birth plan at /birth.
 *
 * The plan is reached through membership -- sign in with Google, and the
 * server looks up which plan you belong to. Nothing secret travels in a URL.
 *
 * The document is a last-write-wins map: { section: { field: { v, t } } },
 * merged per field so two people editing different things from two phones
 * both keep their work.
 */

export const dynamic = "force-dynamic";

async function planOf(request: NextRequest) {
  const email = openSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!email) return null;
  return planFor(email);
}

export async function GET(request: NextRequest) {
  try {
    const plan = await planOf(request);
    if (!plan) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const rows = await query(`SELECT doc, updated_at FROM birth_plan WHERE id = $1`, [plan.id]);
    if (!rows) return NextResponse.json({ error: "Sync unavailable" }, { status: 503 });
    if (!rows.length) return NextResponse.json({ doc: {} });

    return NextResponse.json({ doc: rows[0].doc ?? {}, updated_at: rows[0].updated_at });
  } catch (error) {
    console.error("Birth plan fetch error:", error);
    await captureServerException(error, { route: "GET /api/birth" });
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const plan = await planOf(request);
    if (!plan) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const raw = await request.text();
    if (raw.length > MAX_BYTES) {
      return NextResponse.json({ error: "Document too large" }, { status: 413 });
    }

    let body: { doc?: unknown };
    try { body = JSON.parse(raw); }
    catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

    let incoming: Doc;
    try { incoming = clean(body.doc); }
    catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Invalid document" },
        { status: 400 }
      );
    }

    const existing = await query(`SELECT doc FROM birth_plan WHERE id = $1`, [plan.id]);
    if (!existing) return NextResponse.json({ error: "Sync unavailable" }, { status: 503 });

    const merged = merge((existing[0]?.doc as Doc) || {}, incoming);
    const saved = await query(
      `UPDATE birth_plan SET doc = $2::jsonb, updated_at = NOW() WHERE id = $1
       RETURNING updated_at`,
      [plan.id, JSON.stringify(merged)]
    );
    if (!saved) return NextResponse.json({ error: "Sync unavailable" }, { status: 503 });

    // Return the merge so the caller adopts whatever the other phone wrote.
    return NextResponse.json({ doc: merged, updated_at: saved[0].updated_at });
  } catch (error) {
    console.error("Birth plan save error:", error);
    await captureServerException(error, { route: "PUT /api/birth" });
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
