import { NextResponse } from "next/server";
import { isConnected } from "@/lib/spotify";

export async function GET() {
  try {
    const connected = await isConnected();
    // Hide playlist link until Spotify sync is working
    return NextResponse.json({ connected, playlistUrl: null });
  } catch (error) {
    console.error("Spotify playlist error:", error);
    return NextResponse.json({ connected: false, playlistUrl: null });
  }
}
