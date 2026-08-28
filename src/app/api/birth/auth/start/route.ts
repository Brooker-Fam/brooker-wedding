import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAppBaseUrl } from "@/lib/google";
import { authorizeUrl, isConfigured } from "@/lib/birth-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = getAppBaseUrl();
  if (!isConfigured()) {
    return NextResponse.redirect(`${base}/birth?auth=not_configured`);
  }
  const state = randomUUID();
  const res = NextResponse.redirect(authorizeUrl(state));
  res.cookies.set("birth_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/api/birth",
  });
  return res;
}
