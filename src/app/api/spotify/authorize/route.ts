import { NextResponse } from "next/server";
import { getAuthorizeUrl } from "@/lib/spotify";
import { captureServerException } from "@/lib/posthog-server";

export async function GET() {
  try {
    const url = getAuthorizeUrl();
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Spotify authorize error:", error);
    await captureServerException(error, { route: "GET /api/spotify/authorize" });
    return NextResponse.json({ error: "Spotify not configured" }, { status: 500 });
  }
}
