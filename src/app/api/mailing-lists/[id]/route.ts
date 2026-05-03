import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const listId = Number(id);
    if (!Number.isFinite(listId)) {
      return NextResponse.json({ error: "Invalid list id" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description = "" } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await query(
      `UPDATE mailing_lists
       SET name = $1, description = $2
       WHERE id = $3
       RETURNING id, name, description, created_at`,
      [name.trim(), typeof description === "string" ? description.trim() : "", listId]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Mailing list update error:", error);
    await captureServerException(error, { route: "PUT /api/mailing-lists/[id]" });
    return NextResponse.json(
      { error: "Failed to update mailing list" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const listId = Number(id);
    if (!Number.isFinite(listId)) {
      return NextResponse.json({ error: "Invalid list id" }, { status: 400 });
    }

    const result = await query(
      `DELETE FROM mailing_lists WHERE id = $1 RETURNING id`,
      [listId]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mailing list delete error:", error);
    await captureServerException(error, { route: "DELETE /api/mailing-lists/[id]" });
    return NextResponse.json(
      { error: "Failed to delete mailing list" },
      { status: 500 }
    );
  }
}
