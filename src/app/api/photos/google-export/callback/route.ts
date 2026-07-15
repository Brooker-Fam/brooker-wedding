import { NextRequest, NextResponse } from "next/server";
import { exchangePhotosCode } from "@/lib/google-photos";
import { getAppBaseUrl } from "@/lib/google";
import { captureServerException } from "@/lib/posthog-server";

export const dynamic = "force-dynamic";

// Google redirects here after consent. Trade the code for a short-lived
// access token, park it in an httpOnly cookie scoped to the export routes
// (never persisted server-side), and bounce back to /photos where the
// export panel resumes automatically.
export async function GET(request: NextRequest) {
  const base = getAppBaseUrl();
  const { searchParams } = new URL(request.url);

  const denied = searchParams.get("error");
  if (denied) {
    return NextResponse.redirect(`${base}/photos?gphotos_error=${encodeURIComponent(denied)}`);
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const expectedState = request.cookies.get("gp_oauth_state")?.value;
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${base}/photos?gphotos_error=state_mismatch`);
  }

  try {
    const { accessToken, expiresIn } = await exchangePhotosCode(code);
    const res = NextResponse.redirect(`${base}/photos?gphotos=connected`);
    res.cookies.set("gp_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // Shave a minute so we re-auth before Google actually rejects us.
      maxAge: Math.max(60, Math.min(expiresIn, 3600) - 60),
      path: "/api/photos/google-export",
    });
    res.cookies.set("gp_oauth_state", "", { maxAge: 0, path: "/api/photos/google-export" });
    return res;
  } catch (error) {
    console.error("Google Photos token exchange failed:", error);
    await captureServerException(error, { route: "GET /api/photos/google-export/callback" });
    return NextResponse.redirect(`${base}/photos?gphotos_error=token_exchange_failed`);
  }
}
