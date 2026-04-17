import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/google";
import { captureServerException } from "@/lib/posthog-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieState = request.cookies.get("google_oauth_state")?.value;

  const redirectTo = (path: string) => {
    const res = NextResponse.redirect(new URL(path, request.url));
    res.cookies.delete("google_oauth_state");
    return res;
  };

  if (error) {
    return redirectTo(`/calendar/admin?google=error&reason=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return redirectTo("/calendar/admin?google=error&reason=missing_code");
  }

  if (!state || !cookieState || state !== cookieState) {
    return redirectTo("/calendar/admin?google=error&reason=state_mismatch");
  }

  try {
    await exchangeCode(code);
    return redirectTo("/calendar/admin?google=connected");
  } catch (err) {
    await captureServerException(err, {
      route: "GET /api/calendar/google/callback",
    });
    const message = err instanceof Error ? err.message : "unknown";
    return redirectTo(`/calendar/admin?google=error&reason=${encodeURIComponent(message)}`);
  }
}
