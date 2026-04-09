"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SongRequest {
  id: number;
  requester_name: string;
  song_title: string;
  artist: string;
  album_art_url: string | null;
  preview_url: string | null;
  itunes_url: string | null;
  songlink_url: string | null;
  vote_count: number;
  voters: string[];
  created_at: string;
}

export default function SongsAdminPage() {
  const [songs, setSongs] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState<string | null>(null);
  const [spotifyStatus, setSpotifyStatus] = useState("");
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Check Spotify connection status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyParam = params.get("spotify");
    if (spotifyParam === "connected") setSpotifyStatus("Spotify connected successfully!");
    else if (spotifyParam === "error") setSpotifyStatus("Failed to connect Spotify. Try again.");

    fetch("/api/spotify/playlist")
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json) {
          setSpotifyConnected(json.connected);
          setSpotifyPlaylistUrl(json.playlistUrl);
        }
      })
      .catch(() => {});
  }, []);

  const fetchSongs = useCallback(async () => {
    try {
      const res = await fetch("/api/songs");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setSongs(
        (json.data || []).map((s: SongRequest) => ({
          ...s,
          vote_count: Number(s.vote_count) || 0,
          voters: Array.isArray(s.voters) ? s.voters : [],
        }))
      );
      setDirty(false);
    } catch {
      setError("Failed to load songs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Save current order to server
  const saveOrder = async (orderedSongs?: SongRequest[]) => {
    const list = orderedSongs || songs;
    setSaving(true);
    try {
      const res = await fetch("/api/songs/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: list.map((s) => s.id) }),
      });
      if (!res.ok) throw new Error();
      setDirty(false);
    } catch {
      setError("Failed to save order");
    } finally {
      setSaving(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const updated = [...songs];
    const [dragged] = updated.splice(dragItem.current, 1);
    updated.splice(dragOverItem.current, 0, dragged);

    dragItem.current = null;
    dragOverItem.current = null;

    setSongs(updated);
    setDirty(true);
    saveOrder(updated);
  };

  // Move up/down for mobile
  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= songs.length) return;

    const updated = [...songs];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSongs(updated);
    setDirty(true);
    saveOrder(updated);
  };

  const deleteSong = async (song: SongRequest) => {
    if (!confirm(`Delete "${song.song_title}" by ${song.artist}?`)) return;
    try {
      const res = await fetch(`/api/songs?id=${song.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      const updated = songs.filter((s) => s.id !== song.id);
      setSongs(updated);
      // Re-save order after deletion
      saveOrder(updated);
    } catch {
      setError("Failed to delete song");
    }
  };

  return (
    <div className="enchanted-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <h1 className="mb-2 text-center font-[family-name:var(--font-cormorant-garamond)] text-4xl font-semibold text-forest dark:text-cream">
          Song Admin
        </h1>
        <p className="mb-6 text-center text-sm text-forest/60 dark:text-cream/60">
          {songs.length} {songs.length === 1 ? "song" : "songs"} &middot; Drag to reorder or use arrows
        </p>

        {/* Spotify connection */}
        <div className="soft-card mb-6 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-forest dark:text-cream">Spotify</h2>
              <p className="text-xs text-forest/60 dark:text-cream/60">
                {spotifyConnected
                  ? "Connected — playlist syncs automatically"
                  : "Connect to auto-sync a Spotify playlist"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {spotifyPlaylistUrl && (
                <a
                  href={spotifyPlaylistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#1DB954]/10 px-3 py-1.5 text-xs font-medium text-[#1DB954] transition-all hover:bg-[#1DB954]/20"
                >
                  View Playlist
                </a>
              )}
              <a
                href="/api/spotify/authorize"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  spotifyConnected
                    ? "bg-sage/10 text-forest/50 hover:bg-sage/15 dark:bg-sage/15 dark:text-cream/50"
                    : "bg-[#1DB954]/15 text-[#1DB954] hover:bg-[#1DB954]/25"
                }`}
              >
                {spotifyConnected ? "Reconnect" : "Connect Spotify"}
              </a>
            </div>
          </div>
          {spotifyStatus && (
            <p className={`mt-2 text-xs ${spotifyStatus.includes("success") ? "text-[#1DB954]" : "text-red-500"}`}>
              {spotifyStatus}
            </p>
          )}
        </div>

        {/* Status bar */}
        <div className="mb-6 flex items-center justify-center gap-3">
          {saving && (
            <span className="text-xs text-sage dark:text-sage-light">Saving order...</span>
          )}
          {dirty && !saving && (
            <span className="text-xs text-soft-gold">Unsaved changes</span>
          )}
          {!dirty && !saving && songs.length > 0 && (
            <span className="text-xs text-sage/60 dark:text-sage-light/60">Order saved</span>
          )}
        </div>

        {loading && (
          <div className="py-20 text-center">
            <svg className="mx-auto h-8 w-8 animate-spin text-sage" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {error && (
          <div className="soft-card mx-auto mb-6 max-w-md p-4 text-center">
            <p className="text-sm text-deep-plum dark:text-cream">{error}</p>
            <button onClick={() => setError("")} className="mt-2 text-xs text-sage underline">
              Dismiss
            </button>
          </div>
        )}

        {!loading && songs.length === 0 && (
          <div className="soft-card py-12 text-center">
            <p className="text-sm text-forest/60 dark:text-cream/60">No songs yet.</p>
          </div>
        )}

        {!loading && songs.length > 0 && (
          <div className="space-y-2">
            {songs.map((song, index) => (
              <div
                key={song.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                onDragEnd={() => {
                  dragItem.current = null;
                  dragOverItem.current = null;
                }}
                className="soft-card flex cursor-grab items-center gap-2 p-3 transition-shadow active:cursor-grabbing sm:gap-3 sm:p-4"
              >
                {/* Position + drag handle */}
                <div className="flex flex-shrink-0 flex-col items-center gap-0.5">
                  <span className="text-[10px] font-bold text-forest/30 dark:text-cream/30">
                    {index + 1}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" className="text-forest/25 dark:text-cream/25">
                    <circle cx="3" cy="2" r="1.2" fill="currentColor" />
                    <circle cx="9" cy="2" r="1.2" fill="currentColor" />
                    <circle cx="3" cy="6" r="1.2" fill="currentColor" />
                    <circle cx="9" cy="6" r="1.2" fill="currentColor" />
                    <circle cx="3" cy="10" r="1.2" fill="currentColor" />
                    <circle cx="9" cy="10" r="1.2" fill="currentColor" />
                  </svg>
                </div>

                {/* Up/Down arrows (mobile-friendly) */}
                <div className="flex flex-shrink-0 flex-col gap-0.5">
                  <button
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1 text-forest/40 transition-colors hover:bg-sage/10 hover:text-forest disabled:opacity-20 dark:text-cream/40 dark:hover:bg-sage/15 dark:hover:text-cream"
                    title="Move up"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItem(index, 1)}
                    disabled={index === songs.length - 1}
                    className="rounded p-1 text-forest/40 transition-colors hover:bg-sage/10 hover:text-forest disabled:opacity-20 dark:text-cream/40 dark:hover:bg-sage/15 dark:hover:text-cream"
                    title="Move down"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {/* Album art */}
                {song.album_art_url ? (
                  <img src={song.album_art_url} alt="" className="h-11 w-11 flex-shrink-0 rounded-lg sm:h-12 sm:w-12" />
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-sage/10 text-lg dark:bg-sage/20 sm:h-12 sm:w-12">
                    &#127925;
                  </div>
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-forest dark:text-cream">
                    {song.song_title}
                  </p>
                  <p className="truncate text-xs text-forest/60 dark:text-cream/60">{song.artist}</p>
                  <p className="mt-0.5 text-xs text-sage dark:text-sage-light">
                    by {song.requester_name} &middot; {song.vote_count} {Number(song.vote_count) === 1 ? "vote" : "votes"}
                    {song.voters.length > 0 && (
                      <span className="hidden text-forest/40 dark:text-cream/40 sm:inline">
                        {" "}({song.voters.join(", ")})
                      </span>
                    )}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteSong(song)}
                  className="flex-shrink-0 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500/20 dark:text-red-400"
                  title="Delete song"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
