import { NextResponse } from "next/server";
import { getPlaylistUrl, isConnected, hasPlaylistTracks } from "@/lib/spotify";

export async function GET() {
  try {
    const connected = await isConnected();
    const playlistUrl = await getPlaylistUrl();
    // Only show the link if the playlist actually has tracks
    const hasTracks = playlistUrl ? await hasPlaylistTracks() : false;
    return NextResponse.json({ connected, playlistUrl: hasTracks ? playlistUrl : null });
  } catch (error) {
    console.error("Spotify playlist error:", error);
    return NextResponse.json({ connected: false, playlistUrl: null });
  }
}
