import { NextResponse } from "next/server";
import { getAuthorizeUrl } from "@/lib/spotify";

export async function GET() {
  try {
    const url = getAuthorizeUrl();
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Spotify authorize error:", error);
    return NextResponse.json({ error: "Spotify not configured" }, { status: 500 });
  }
}
