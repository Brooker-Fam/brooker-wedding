import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_PATH } from "@/lib/birth-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: SESSION_PATH, maxAge: 0 });
  return res;
}
