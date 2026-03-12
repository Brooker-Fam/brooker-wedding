import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim().toLowerCase();

    if (!q || q.length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT id, name, email, attending
       FROM rsvps
       WHERE LOWER(name) LIKE $1 OR LOWER(email) = $2
       ORDER BY created_at DESC
       LIMIT 5`,
      [`%${q}%`, q]
    );

    if (!result) {
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("RSVP lookup error:", error);
    return NextResponse.json(
      { error: "Failed to search RSVPs" },
      { status: 500 }
    );
  }
}
