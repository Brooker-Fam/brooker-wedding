import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function formatShortName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function parseAdultNames(raw: string, fallbackName: string) {
  const entries = raw
    .split(/\n+/)
    .flatMap((line) => line.split(","))
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/\s*\((adult|child)\)\s*$/i);
      return {
        name: line.replace(/\s*\((adult|child)\)\s*$/i, "").trim(),
        type: match?.[1]?.toLowerCase() === "child" ? "child" : "adult",
      };
    })
    .filter((entry) => entry.type === "adult" && entry.name);

  const seen = new Set<string>();
  const adults = entries
    .map((entry) => entry.name)
    .filter((name) => {
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  if (adults.length > 0) return adults;
  return fallbackName.trim() ? [fallbackName.trim()] : [];
}

function formatGroupName(names: string[]) {
  const formatted = names.map(formatShortName).filter(Boolean);
  if (formatted.length <= 1) return formatted[0] ?? "";
  if (formatted.length === 2) return `${formatted[0]} & ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(", ")} & ${formatted[formatted.length - 1]}`;
}

export async function GET() {
  try {
    const namesResult = await query(
      `SELECT name, attendee_names FROM rsvps WHERE attending = true AND public_display = true ORDER BY created_at ASC`
    );

    const countResult = await query(
      `SELECT COALESCE(SUM(guest_count), 0) AS total FROM rsvps WHERE attending = true`
    );

    const names = (namesResult ?? []).map((row) => {
      const name = String(row.name ?? "");
      const attendeeNames = String(row.attendee_names ?? "");
      return formatGroupName(parseAdultNames(attendeeNames, name));
    }).filter(Boolean);

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
