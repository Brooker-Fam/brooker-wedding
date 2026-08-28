import { NextRequest, NextResponse } from "next/server";
import {
  openSession, planFor, membersOf, isConfigured, SESSION_COOKIE,
} from "@/lib/birth-auth";
import { captureServerException } from "@/lib/posthog-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const email = openSession(request.cookies.get(SESSION_COOKIE)?.value);
    if (!email) {
      return NextResponse.json({ signedIn: false, configured: isConfigured() });
    }
    const plan = await planFor(email);
    if (!plan) return NextResponse.json({ signedIn: false, configured: isConfigured() });
    return NextResponse.json({
      signedIn: true,
      configured: true,
      email,
      role: plan.role,
      members: await membersOf(plan.id),
    });
  } catch (error) {
    await captureServerException(error, { route: "GET /api/birth/auth/me" });
    return NextResponse.json({ signedIn: false, configured: isConfigured() });
  }
}
