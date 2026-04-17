import { NextResponse } from "next/server";
import * as crypto from "node:crypto";
import { getAuthorizeUrl } from "@/lib/google";
import { captureServerException } from "@/lib/posthog-server";

export async function GET() {
  try {
    const state = crypto.randomBytes(16).toString("hex");
    const url = getAuthorizeUrl(state);
    const res = NextResponse.redirect(url);
    res.cookies.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/",
    });
    return res;
  } catch (err) {
    await captureServerException(err, {
      route: "GET /api/calendar/google/authorize",
    });
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
