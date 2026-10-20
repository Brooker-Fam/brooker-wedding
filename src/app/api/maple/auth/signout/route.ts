import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/maple/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  // Baby photos are cached privately for a year; drop them from this browser.
  res.headers.set("Clear-Site-Data", '"cache"');
  return res;
}
