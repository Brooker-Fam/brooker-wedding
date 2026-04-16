import { NextResponse } from "next/server";
import { isConnected } from "@/lib/spotify";
import { captureServerException } from "@/lib/posthog-server";

export async function GET() {
  try {
    const connected = await isConnected();
    // Hide playlist link until Spotify sync is working
    return NextResponse.json({ connected, playlistUrl: null });
  } catch (error) {
    console.error("Spotify playlist error:", error);
    await captureServerException(error, { route: "GET /api/spotify/playlist" });
    return NextResponse.json({ connected: false, playlistUrl: null });
  }
}
