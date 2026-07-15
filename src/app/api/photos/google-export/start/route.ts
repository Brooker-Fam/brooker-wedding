import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getPhotosAuthorizeUrl, isPhotosExportConfigured } from "@/lib/google-photos";
import { getAppBaseUrl } from "@/lib/google";

export const dynamic = "force-dynamic";

// Kick off the per-guest OAuth consent for exporting the album to their own
// Google Photos. The state cookie is checked by the callback (CSRF).
export async function GET() {
  const base = getAppBaseUrl();
  if (!isPhotosExportConfigured()) {
    return NextResponse.redirect(`${base}/photos?gphotos_error=not_configured`);
  }

  const state = randomUUID();
  const res = NextResponse.redirect(getPhotosAuthorizeUrl(state));
  res.cookies.set("gp_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/api/photos/google-export",
  });
  return res;
}
