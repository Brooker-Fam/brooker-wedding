import { NextResponse } from "next/server";
import { seedBrookerFamily } from "@/lib/calendar/db";

export async function POST() {
  try {
    const result = await seedBrookerFamily();
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
