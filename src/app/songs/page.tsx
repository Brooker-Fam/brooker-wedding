"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import HeartGarland from "@/components/HeartGarland";

interface iTunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  trackViewUrl: string;
}

interface SongRequest {
  id: number;
  requester_name: string;
  song_title: string;
  artist: string;
  album_art_url: string | null;
  preview_url: string | null;
  itunes_url: string | null;
  itunes_track_id: number | null;
  songlink_url: string | null;
  vote_count: number;
  voters: string[];
  created_at: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function SongsPage() {
  const [userName, setUserName] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<iTunesResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [songs, setSongs] = useState<SongRequest[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);
  const [voting, setVoting] = useState<number | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check for Spotify playlist
  useEffect(() => {
    fetch("/api/spotify/playlist")
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.playlistUrl) setSpotifyUrl(json.playlistUrl);
      })
      .catch(() => {});
  }, []);

  // Load name from localStorage, optionally pre-fill from RSVP
  useEffect(() => {
    const stored = localStorage.getItem("songRequesterName");
    if (stored) {
      setUserName(stored);
      setNameSet(true);
      return;
    }
    // Try to get name from RSVP
    const rsvpId = getCookie("rsvp_id");
    if (rsvpId) {
      fetch(`/api/rsvp?id=${rsvpId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => {
          if (json?.data?.name) {
            setUserName(json.data.name);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Fetch all songs
  const fetchSongs = useCallback(async () => {
    try {
      const res = await fetch("/api/songs");
      if (res.ok) {
        const json = await res.json();
        setSongs(
          (json.data || []).map((s: SongRequest) => ({
            ...s,
            vote_count: Number(s.vote_count) || 0,
            voters: Array.isArray(s.voters) ? s.voters : [],
          }))
        );
      }
    } catch {
      // silent
    } finally {
      setLoadingSongs(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Debounced iTunes search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=6`
        );
        if (res.ok) {
          const json = await res.json();
          setSearchResults(json.results || []);
        }
      } catch {
        // silent
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Save name
  function handleSetName() {
    if (userName.trim().length === 0) return;
    localStorage.setItem("songRequesterName", userName.trim());
    setNameSet(true);
  }

  // Add song
  async function handleAddSong(track: iTunesResult) {
    if (!userName.trim()) return;
    setAdding(track.trackId);
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester_name: userName.trim(),
          song_title: track.trackName,
          artist: track.artistName,
          album_art_url: track.artworkUrl100?.replace("100x100", "200x200") || "",
          preview_url: track.previewUrl || "",
          itunes_url: track.trackViewUrl || "",
          itunes_track_id: track.trackId,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.duplicate) {
          showToast("Already on the playlist — added your vote!");
        } else {
          showToast("Song added to the playlist!");
        }
        setSearchQuery("");
        setSearchResults([]);
        await fetchSongs();
      }
    } catch {
      showToast("Failed to add song. Try again!");
    } finally {
      setAdding(null);
    }
  }

  // Vote
  async function handleVote(songId: number) {
    if (!userName.trim()) {
      showToast("Enter your name first!");
      return;
    }
    setVoting(songId);
    try {
      const res = await fetch("/api/songs/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          song_request_id: songId,
          voter_name: userName.trim(),
        }),
      });
      if (res.ok) {
        await fetchSongs();
      }
    } catch {
      // silent
    } finally {
      setVoting(null);
    }
  }

  // Audio preview
  function togglePreview(url: string) {
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play();
    audio.onended = () => setPlayingUrl(null);
    audioRef.current = audio;
    setPlayingUrl(url);
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const hasVoted = (song: SongRequest) =>
    song.voters.some((v) => v.toLowerCase() === userName.trim().toLowerCase());

  return (
    <div className="enchanted-bg relative min-h-screen overflow-hidden">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 left-4 z-50 mx-auto max-w-sm rounded-xl border border-soft-gold/30 bg-warm-white/95 px-4 py-3 text-center text-sm font-medium text-forest shadow-lg backdrop-blur-sm dark:border-soft-gold/20 dark:bg-[#162618]/95 dark:text-cream"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-2xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <HeartGarland className="mb-4" />
          <h1 className="fairy-sparkle mb-2 font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold text-forest dark:text-cream sm:text-5xl">
            Party Playlist
          </h1>
          <p className="text-sm text-forest/70 dark:text-cream/70 sm:text-base">
            Help us build the perfect soundtrack for the celebration!
          </p>
          {spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1DB954]/25 bg-[#1DB954]/10 px-5 py-2 text-sm font-semibold text-[#1DB954] transition-all hover:bg-[#1DB954]/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              Listen on Spotify
            </a>
          )}
        </motion.div>

        {/* Name input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="soft-card mb-6 p-4 sm:p-6"
        >
          <label className="mb-2 block text-xs font-semibold tracking-wide text-forest/60 uppercase dark:text-cream/60">
            Your Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (nameSet) {
                  setNameSet(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSetName();
              }}
              placeholder="Enter your name"
              className="enchanted-input flex-1"
            />
            {!nameSet && userName.trim().length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleSetName}
                className="rounded-xl bg-soft-gold px-4 py-2 text-sm font-semibold text-warm-white transition-colors hover:bg-soft-gold-light"
              >
                Save
              </motion.button>
            )}
          </div>
          {nameSet && (
            <p className="mt-1.5 text-xs text-sage dark:text-sage-light">
              Recommending as {userName.trim()}
            </p>
          )}
        </motion.div>

        {/* Search */}
        {nameSet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="soft-card mb-8 p-4 sm:p-6"
          >
            <label className="mb-2 block text-xs font-semibold tracking-wide text-forest/60 uppercase dark:text-cream/60">
              Search for a Song
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Song title or artist..."
                className="enchanted-input w-full pr-10"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-forest/30 dark:text-cream/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>

            {/* Search results */}
            <AnimatePresence>
              {searching && searchQuery.trim().length >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-center text-sm text-forest/50 dark:text-cream/50"
                >
                  Searching...
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  {searchResults.map((track) => (
                    <motion.button
                      key={track.trackId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleAddSong(track)}
                      disabled={adding === track.trackId}
                      className="flex w-full items-center gap-3 rounded-xl border border-sage/10 bg-warm-white/50 p-2.5 text-left transition-all hover:border-soft-gold/30 hover:bg-soft-gold/5 disabled:opacity-50 dark:border-sage/15 dark:bg-[#0D1F0F]/30 dark:hover:border-soft-gold/20 dark:hover:bg-soft-gold/5 sm:p-3"
                    >
                      {track.artworkUrl100 && (
                        <img
                          src={track.artworkUrl100}
                          alt=""
                          className="h-11 w-11 flex-shrink-0 rounded-lg shadow-sm sm:h-12 sm:w-12"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-forest dark:text-cream">
                          {track.trackName}
                        </p>
                        <p className="truncate text-xs text-forest/60 dark:text-cream/60">
                          {track.artistName}
                        </p>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-soft-gold/15 px-3 py-1.5 text-xs font-semibold text-soft-gold-dark dark:text-soft-gold-light">
                        {adding === track.trackId ? "..." : "+ Add"}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {!searching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <p className="mt-3 text-center text-sm text-forest/50 dark:text-cream/50">
                No results found. Try a different search!
              </p>
            )}
          </motion.div>
        )}

        {/* Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-forest dark:text-cream sm:text-3xl">
              The Playlist
            </h2>
            <span className="text-sm text-forest/50 dark:text-cream/50">
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </span>
          </div>

          {loadingSongs && (
            <div className="py-12 text-center">
              <svg className="mx-auto h-8 w-8 animate-spin text-sage" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {!loadingSongs && songs.length === 0 && (
            <div className="soft-card py-12 text-center">
              <p className="mb-1 text-3xl">&#127926;</p>
              <p className="text-sm text-forest/60 dark:text-cream/60">
                No songs yet — be the first to add one!
              </p>
            </div>
          )}

          <div className="space-y-3">
            <AnimatePresence>
              {songs.map((song, i) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="soft-card overflow-hidden p-3 sm:p-4"
                >
                  <div className="flex items-center gap-3">
                    {/* Album art */}
                    {song.album_art_url ? (
                      <img
                        src={song.album_art_url}
                        alt=""
                        className="h-14 w-14 flex-shrink-0 rounded-lg shadow-sm sm:h-16 sm:w-16"
                      />
                    ) : (
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-sage/10 text-xl dark:bg-sage/20 sm:h-16 sm:w-16">
                        &#127925;
                      </div>
                    )}

                    {/* Song info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-forest dark:text-cream sm:text-base">
                        {song.song_title}
                      </p>
                      <p className="truncate text-xs text-forest/60 dark:text-cream/60 sm:text-sm">
                        {song.artist}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-sage dark:text-sage-light">
                        Added by {song.requester_name}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
                      {/* Preview */}
                      {song.preview_url && (
                        <button
                          onClick={() => togglePreview(song.preview_url!)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/15 bg-sage/5 text-forest/60 transition-all hover:bg-sage/15 dark:border-sage/20 dark:bg-sage/10 dark:text-cream/60 dark:hover:bg-sage/20"
                          title={playingUrl === song.preview_url ? "Pause" : "Preview"}
                        >
                          {playingUrl === song.preview_url ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" rx="1" />
                              <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          )}
                        </button>
                      )}

                      {/* Songlink */}
                      {song.songlink_url && (
                        <a
                          href={song.songlink_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/15 bg-sage/5 text-forest/60 transition-all hover:bg-sage/15 dark:border-sage/20 dark:bg-sage/10 dark:text-cream/60 dark:hover:bg-sage/20"
                          title="Open in your music app"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}

                      {/* Vote */}
                      <button
                        onClick={() => handleVote(song.id)}
                        disabled={voting === song.id || !nameSet}
                        className={`flex h-9 items-center gap-1 rounded-full border px-2.5 text-xs font-semibold transition-all sm:px-3 ${
                          hasVoted(song)
                            ? "border-soft-gold/40 bg-soft-gold/15 text-soft-gold-dark dark:border-soft-gold/30 dark:text-soft-gold-light"
                            : "border-sage/15 bg-sage/5 text-forest/50 hover:border-soft-gold/30 hover:bg-soft-gold/10 hover:text-soft-gold-dark dark:border-sage/20 dark:bg-sage/10 dark:text-cream/50 dark:hover:border-soft-gold/20 dark:hover:text-soft-gold-light"
                        } disabled:opacity-40`}
                        title={hasVoted(song) ? "Remove vote" : "Upvote this song"}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill={hasVoted(song) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span>{song.vote_count}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <HeartGarland className="mb-4" />
          <Link
            href="/"
            className="text-sm text-sage underline underline-offset-2 transition-colors hover:text-sage-dark dark:text-sage-light dark:hover:text-sage"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
