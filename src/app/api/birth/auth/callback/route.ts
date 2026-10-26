import { NextRequest, NextResponse } from "next/server";
import { getAppBaseUrl } from "@/lib/google";
import {
  emailFromCode, planForOrCreate, sealSession, cookieOptions, SESSION_COOKIE,
} from "@/lib/birth-auth";
import { captureServerException } from "@/lib/posthog-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const base = getAppBaseUrl();
  const { searchParams } = new URL(request.url);
  const fail = (why: string) => NextResponse.redirect(`${base}/birth?auth=${why}`);

  try {
    if (searchParams.get("error")) return fail("denied");

    const state = searchParams.get("state");
    const expected = request.cookies.get("birth_oauth_state")?.value;
    if (!state || !expected || state !== expected) return fail("bad_state");

    const code = searchParams.get("code");
    if (!code) return fail("no_code");

    const email = await emailFromCode(code);
    if (!email) return fail("no_email");

    // Resolve membership before minting a session, so an uninvited account
    // never ends up holding a cookie for a plan it can't reach.
    const { plan, reason } = await planForOrCreate(email);
    if (!plan) return fail(reason === "unavailable" ? "unavailable" : "not_invited");

    const res = NextResponse.redirect(`${base}/birth?auth=ok`);
    res.cookies.set(SESSION_COOKIE, sealSession(email), cookieOptions);
    res.cookies.set("birth_oauth_state", "", { path: "/api/birth", maxAge: 0 });
    return res;
  } catch (error) {
    console.error("Birth auth callback error:", error);
    await captureServerException(error, { route: "GET /api/birth/auth/callback" });
    return fail("failed");
  }
}
