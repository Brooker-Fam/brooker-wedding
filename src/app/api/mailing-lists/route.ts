import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";

export async function GET() {
  try {
    const result = await query(
      `SELECT
         l.id,
         l.name,
         l.description,
         l.created_at,
         COUNT(e.id)::int AS entry_count
       FROM mailing_lists l
       LEFT JOIN mailing_list_entries e ON e.list_id = l.id
       GROUP BY l.id
       ORDER BY l.created_at DESC`
    );

    if (!result) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Mailing lists fetch error:", error);
    await captureServerException(error, { route: "GET /api/mailing-lists" });
    return NextResponse.json(
      { error: "Failed to fetch mailing lists" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description = "" } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "List name is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO mailing_lists (name, description)
       VALUES ($1, $2)
       RETURNING id, name, description, created_at`,
      [name.trim(), typeof description === "string" ? description.trim() : ""]
    );

    if (!result) {
      return NextResponse.json(
        { error: "List could not be created" },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, data: { ...result[0], entry_count: 0 } });
  } catch (error) {
    console.error("Mailing list create error:", error);
    await captureServerException(error, { route: "POST /api/mailing-lists" });
    return NextResponse.json(
      { error: "Failed to create mailing list" },
      { status: 500 }
    );
  }
}
