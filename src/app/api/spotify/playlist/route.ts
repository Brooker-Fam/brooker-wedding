import { NextResponse } from "next/server";
import { getPlaylistUrl, isConnected } from "@/lib/spotify";

export async function GET() {
  try {
    const connected = await isConnected();
    const playlistUrl = await getPlaylistUrl();
    return NextResponse.json({ connected, playlistUrl });
  } catch (error) {
    console.error("Spotify playlist error:", error);
    return NextResponse.json({ connected: false, playlistUrl: null });
  }
}
