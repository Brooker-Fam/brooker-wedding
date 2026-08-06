import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";
import { DEFAULT_GEAR } from "@/lib/backpacking-gear";

export async function GET() {
  try {
    const result = await query(
      `SELECT id, slug, name, category, qty, notes, claimed_by, packed, sort
       FROM gear_items
       ORDER BY category, sort, id`
    );

    if (!result) {
      // No DATABASE_URL (local dev) — serve the seed list read-only.
      const mock = DEFAULT_GEAR.map((g, i) => ({
        id: -(i + 1),
        slug: g.slug,
        name: g.name,
        category: g.category,
        qty: g.qty ?? null,
        notes: g.notes ?? null,
        claimed_by: g.claimedBy ?? null,
        packed: false,
        sort: g.sort,
      }));
      return NextResponse.json({ data: mock, mock: true });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Gear fetch error:", error);
    await captureServerException(error, { route: "GET /api/backpacking/gear" });
    return NextResponse.json({ error: "Failed to fetch gear" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, qty, notes, claimed_by } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Item name is required" }, { status: 400 });
    }
    if (!category || typeof category !== "string") {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO gear_items (name, category, qty, notes, claimed_by, sort)
       VALUES ($1, $2, $3, $4, $5, 999)
       RETURNING id, slug, name, category, qty, notes, claimed_by, packed, sort`,
      [name.trim().slice(0, 255), category, qty || null, notes || null, claimed_by || null]
    );

    if (!result) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Gear add error:", error);
    await captureServerException(error, { route: "POST /api/backpacking/gear" });
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, claimed_by, packed, notes } = body;

    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: "Valid item id is required" }, { status: 400 });
    }

    const result = await query(
      `UPDATE gear_items
       SET claimed_by = CASE WHEN $2 THEN $3 ELSE claimed_by END,
           packed = COALESCE($4, packed),
           notes = COALESCE($5, notes),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, slug, name, category, qty, notes, claimed_by, packed, sort`,
      [
        numId,
        claimed_by !== undefined,
        claimed_by ?? null,
        typeof packed === "boolean" ? packed : null,
        typeof notes === "string" ? notes : null,
      ]
    );

    if (!result) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    if (result.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Gear update error:", error);
    await captureServerException(error, { route: "PATCH /api/backpacking/gear" });
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const numId = Number(searchParams.get("id"));
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: "Valid item id is required" }, { status: 400 });
    }

    // Only custom items (slug IS NULL) can be deleted; seeded rows stay.
    const result = await query(
      `DELETE FROM gear_items WHERE id = $1 AND slug IS NULL RETURNING id`,
      [numId]
    );

    if (!result) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    if (result.length === 0) {
      return NextResponse.json({ error: "Item not found or not deletable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gear delete error:", error);
    await captureServerException(error, { route: "DELETE /api/backpacking/gear" });
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
