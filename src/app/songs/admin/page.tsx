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
  pinned: boolean;
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
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

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
          pinned: Boolean(s.pinned),
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

  return (
    <div className="enchanted-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <h1 className="mb-2 text-center font-[family-name:var(--font-cormorant-garamond)] text-4xl font-semibold text-forest dark:text-cream">
          Song Admin
        </h1>
        <p className="mb-4 text-center text-sm text-forest/60 dark:text-cream/60">
          {songs.length} {songs.length === 1 ? "song" : "songs"} &middot; Drag to reorder or use arrows
        </p>

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
                className={`soft-card flex items-center gap-2 p-3 transition-shadow sm:gap-3 sm:p-4 ${
                  song.pinned ? "ring-1 ring-soft-gold/30" : ""
                } cursor-grab active:cursor-grabbing`}
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

                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => togglePin(song)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                      song.pinned
                        ? "bg-soft-gold/20 text-soft-gold-dark dark:text-soft-gold-light"
                        : "bg-sage/10 text-forest/50 hover:bg-soft-gold/15 hover:text-soft-gold-dark dark:bg-sage/15 dark:text-cream/50 dark:hover:text-soft-gold-light"
                    }`}
                    title={song.pinned ? "Unpin" : "Pin (must-play)"}
                  >
                    {song.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    onClick={() => deleteSong(song)}
                    className="rounded-lg bg-red-500/10 px-2 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-500/20 dark:text-red-400"
                    title="Delete song"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
