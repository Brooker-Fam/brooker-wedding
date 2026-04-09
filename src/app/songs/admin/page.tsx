"use client";

import { useState, useEffect } from "react";

interface SongRequest {
  id: number;
  requester_name: string;
  song_title: string;
  artist: string;
  album_art_url: string | null;
  preview_url: string | null;
  itunes_url: string | null;
  songlink_url: string | null;
  pinned: boolean;
  vote_count: number;
  voters: string[];
  created_at: string;
}

export default function SongsAdminPage() {
  const [songs, setSongs] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSongs = async () => {
    try {
      const res = await fetch("/api/songs");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setSongs(
        (json.data || []).map((s: SongRequest) => ({
          ...s,
          vote_count: Number(s.vote_count) || 0,
          voters: Array.isArray(s.voters) ? s.voters : [],
          pinned: Boolean(s.pinned),
        }))
      );
    } catch {
      setError("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const deleteSong = async (song: SongRequest) => {
    if (!confirm(`Delete "${song.song_title}" by ${song.artist}?`)) return;
    try {
      const res = await fetch(`/api/songs?id=${song.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSongs((prev) => prev.filter((s) => s.id !== song.id));
    } catch {
      setError("Failed to delete song");
    }
  };

  const togglePin = async (song: SongRequest) => {
    try {
      const res = await fetch("/api/songs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: song.id, pinned: !song.pinned }),
      });
      if (!res.ok) throw new Error();
      setSongs((prev) =>
        prev.map((s) => (s.id === song.id ? { ...s, pinned: !s.pinned } : s))
      );
    } catch {
      setError("Failed to update song");
    }
  };

  const pinnedSongs = songs.filter((s) => s.pinned);
  const unpinnedSongs = songs.filter((s) => !s.pinned);

  return (
    <div className="enchanted-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <h1 className="mb-2 text-center font-[family-name:var(--font-cormorant-garamond)] text-4xl font-semibold text-forest dark:text-cream">
          Song Admin
        </h1>
        <p className="mb-8 text-center text-sm text-forest/60 dark:text-cream/60">
          {songs.length} {songs.length === 1 ? "song" : "songs"} total &middot; {pinnedSongs.length} pinned
        </p>

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

        {!loading && (
          <div className="space-y-2">
            {/* Pinned section */}
            {pinnedSongs.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 text-xs font-semibold tracking-wide text-soft-gold uppercase">
                  Pinned (shown first)
                </h2>
                <div className="space-y-2">
                  {pinnedSongs.map((song) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      onDelete={deleteSong}
                      onTogglePin={togglePin}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Unpinned section */}
            {unpinnedSongs.length > 0 && (
              <div>
                {pinnedSongs.length > 0 && (
                  <h2 className="mb-2 text-xs font-semibold tracking-wide text-forest/50 uppercase dark:text-cream/50">
                    By Votes
                  </h2>
                )}
                <div className="space-y-2">
                  {unpinnedSongs.map((song) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      onDelete={deleteSong}
                      onTogglePin={togglePin}
                    />
                  ))}
                </div>
              </div>
            )}

            {songs.length === 0 && !loading && (
              <div className="soft-card py-12 text-center">
                <p className="text-sm text-forest/60 dark:text-cream/60">No songs yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SongRow({
  song,
  onDelete,
  onTogglePin,
}: {
  song: SongRequest;
  onDelete: (song: SongRequest) => void;
  onTogglePin: (song: SongRequest) => void;
}) {
  return (
    <div
      className={`soft-card flex items-center gap-3 p-3 sm:p-4 ${
        song.pinned ? "ring-1 ring-soft-gold/30" : ""
      }`}
    >
      {/* Album art */}
      {song.album_art_url ? (
        <img src={song.album_art_url} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg" />
      ) : (
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-sage/10 text-lg dark:bg-sage/20">
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
            <span className="text-forest/40 dark:text-cream/40">
              {" "}({song.voters.join(", ")})
            </span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-2">
        {/* Pin toggle */}
        <button
          onClick={() => onTogglePin(song)}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
            song.pinned
              ? "bg-soft-gold/20 text-soft-gold-dark dark:text-soft-gold-light"
              : "bg-sage/10 text-forest/50 hover:bg-soft-gold/15 hover:text-soft-gold-dark dark:bg-sage/15 dark:text-cream/50 dark:hover:text-soft-gold-light"
          }`}
          title={song.pinned ? "Unpin" : "Pin to top"}
        >
          {song.pinned ? "Unpin" : "Pin"}
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(song)}
          className="rounded-lg bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500/20 dark:text-red-400"
          title="Delete song"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
