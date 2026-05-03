import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const listId = Number(id);
    if (!Number.isFinite(listId)) {
      return NextResponse.json({ error: "Invalid list id" }, { status: 400 });
    }

    const result = await query(
      `SELECT
         e.id,
         e.list_id,
         e.rsvp_id,
         e.addressee,
         e.notes,
         e.created_at,
         r.name AS rsvp_name,
         r.email AS rsvp_email,
         r.phone AS rsvp_phone,
         r.mailing_address,
         r.attending,
         r.attendee_names,
         r.adult_count,
         r.child_count
       FROM mailing_list_entries e
       JOIN rsvps r ON r.id = e.rsvp_id
       WHERE e.list_id = $1
       ORDER BY r.name ASC`,
      [listId]
    );

    if (!result) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Entries fetch error:", error);
    await captureServerException(error, {
      route: "GET /api/mailing-lists/[id]/entries",
    });
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const listId = Number(id);
    if (!Number.isFinite(listId)) {
      return NextResponse.json({ error: "Invalid list id" }, { status: 400 });
    }

    const body = await request.json();
    const rsvpIdsRaw: unknown = body.rsvp_ids ?? (body.rsvp_id != null ? [body.rsvp_id] : []);
    const addressee: string | null =
      typeof body.addressee === "string" && body.addressee.trim().length > 0
        ? body.addressee.trim()
        : null;
    const notes: string | null =
      typeof body.notes === "string" && body.notes.trim().length > 0
        ? body.notes.trim()
        : null;

    if (!Array.isArray(rsvpIdsRaw) || rsvpIdsRaw.length === 0) {
      return NextResponse.json(
        { error: "rsvp_ids is required" },
        { status: 400 }
      );
    }

    const rsvpIds = rsvpIdsRaw
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n));

    if (rsvpIds.length === 0) {
      return NextResponse.json(
        { error: "No valid rsvp_ids" },
        { status: 400 }
      );
    }

    const inserted: unknown[] = [];
    for (const rsvpId of rsvpIds) {
      const row = await query(
        `INSERT INTO mailing_list_entries (list_id, rsvp_id, addressee, notes)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (list_id, rsvp_id) DO NOTHING
         RETURNING id, list_id, rsvp_id, addressee, notes, created_at`,
        [listId, rsvpId, addressee, notes]
      );
      if (row && row.length > 0) inserted.push(row[0]);
    }

    return NextResponse.json({
      success: true,
      added: inserted.length,
      skipped: rsvpIds.length - inserted.length,
    });
  } catch (error) {
    console.error("Entry add error:", error);
    await captureServerException(error, {
      route: "POST /api/mailing-lists/[id]/entries",
    });
    return NextResponse.json(
      { error: "Failed to add entries" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const listId = Number(id);
    if (!Number.isFinite(listId)) {
      return NextResponse.json({ error: "Invalid list id" }, { status: 400 });
    }

    const body = await request.json();
    const entryId = Number(body.entry_id);
    if (!Number.isFinite(entryId)) {
      return NextResponse.json(
        { error: "entry_id is required" },
        { status: 400 }
      );
    }

    const addressee: string | null =
      typeof body.addressee === "string" && body.addressee.trim().length > 0
        ? body.addressee.trim()
        : null;
    const notes: string | null =
      typeof body.notes === "string" && body.notes.trim().length > 0
        ? body.notes.trim()
        : null;

    const result = await query(
      `UPDATE mailing_list_entries
       SET addressee = $1, notes = $2
       WHERE id = $3 AND list_id = $4
       RETURNING id, list_id, rsvp_id, addressee, notes, created_at`,
      [addressee, notes, entryId, listId]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Entry update error:", error);
    await captureServerException(error, {
      route: "PUT /api/mailing-lists/[id]/entries",
    });
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const listId = Number(id);
    if (!Number.isFinite(listId)) {
      return NextResponse.json({ error: "Invalid list id" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const entryIdRaw = searchParams.get("entry_id");
    const entryId = Number(entryIdRaw);
    if (!entryIdRaw || !Number.isFinite(entryId)) {
      return NextResponse.json(
        { error: "entry_id is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `DELETE FROM mailing_list_entries
       WHERE id = $1 AND list_id = $2
       RETURNING id`,
      [entryId, listId]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Entry delete error:", error);
    await captureServerException(error, {
      route: "DELETE /api/mailing-lists/[id]/entries",
    });
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
