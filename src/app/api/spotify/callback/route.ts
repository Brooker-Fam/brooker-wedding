import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/songs/admin?spotify=error", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/songs/admin?spotify=missing_code", request.url));
  }

  try {
    await exchangeCode(code);
    // Don't sync here - next song add will trigger it
    return NextResponse.redirect(new URL("/songs/admin?spotify=connected", request.url));
  } catch (err) {
    console.error("Spotify callback error:", err);
    return NextResponse.redirect(new URL("/songs/admin?spotify=error", request.url));
  }
}
