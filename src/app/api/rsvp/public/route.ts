import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const namesResult = await query(
      `SELECT name FROM rsvps WHERE attending = true AND public_display = true ORDER BY created_at ASC`
    );

    const countResult = await query(
      `SELECT COALESCE(SUM(guest_count), 0) AS total FROM rsvps WHERE attending = true`
    );

    const names = (namesResult ?? []).map((row) => {
      const name = String(row.name ?? "");
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0];
      return `${parts[0]} ${parts[parts.length - 1][0]}.`;
    });

    const total = countResult?.[0]?.total ?? 0;

    return NextResponse.json({ names, total: Number(total) });
  } catch (error) {
    console.error("Public RSVP list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch public list" },
      { status: 500 }
    );
  }
}
