import { NextResponse } from "next/server";
import { getMembers } from "@/lib/calendar/db";

export async function GET() {
  const members = await getMembers();
  return NextResponse.json(members);
}
