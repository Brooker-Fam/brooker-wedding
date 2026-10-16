"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HeartGarland from "@/components/HeartGarland";

interface SongRequest {
  id: number;
  requester_name: string;
  song_title: string;
  artist: string;
  album_art_url: string | null;
  preview_url: string | null;
  songlink_url: string | null;
}

const WEDDING_PLAYLISTS = [
  { label: "Everything", url: "https://open.spotify.com/playlist/3kWvGk433V3lsTsObR0DrO" },
  { label: "Arrivals", url: "https://open.spotify.com/playlist/26aCRpF7NlVhb7eYYAcJtk" },
  { label: "Special", url: "https://open.spotify.com/playlist/2W10iTjE9QxqeEgJ0pwpf8" },
  { label: "Party", url: "https://open.spotify.com/playlist/3IXmeXqumuld8F72DethlC" },
];

function SpotifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function SongsPage() {
  const [songs, setSongs] = useState<SongRequest[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/spotify/playlist")
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.playlistUrl) setSpotifyUrl(json.playlistUrl);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/songs")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setSongs(json?.data || []))
      .catch(() => {})
      .finally(() => setLoadingSongs(false));
  }, []);

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

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className="enchanted-bg relative min-h-screen overflow-hidden">
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
          <p className="text-sm text-balance text-forest/70 dark:text-cream/70 sm:text-base">
            Every song you asked for, plus the playlists from the day.
          </p>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold tracking-wide text-forest/50 uppercase dark:text-cream/50">
              Listen on Spotify
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {WEDDING_PLAYLISTS.map((pl) => (
                <a
                  key={pl.url}
                  href={pl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1DB954]/25 bg-[#1DB954]/10 px-4 py-2 text-sm font-semibold text-[#1DB954] transition-all hover:bg-[#1DB954]/20"
                >
                  <SpotifyIcon />
                  {pl.label}
                </a>
              ))}
            </div>
          </div>

          {spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1DB954]/25 bg-[#1DB954]/10 px-5 py-2 text-sm font-semibold text-[#1DB954] transition-all hover:bg-[#1DB954]/20"
            >
              <SpotifyIcon />
              Listen on Spotify
            </a>
          )}
        </motion.div>

        {/* Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-forest dark:text-cream sm:text-3xl">
              The songs you asked for
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
                The song list couldn&apos;t load. The Spotify playlists above still work.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {songs.map((song) => (
              <div key={song.id} className="soft-card overflow-hidden p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  {song.album_art_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote iTunes artwork
                    <img
                      src={song.album_art_url}
                      alt=""
                      loading="lazy"
                      className="h-14 w-14 flex-shrink-0 rounded-lg shadow-sm sm:h-16 sm:w-16"
                    />
                  ) : (
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-sage/10 text-xl dark:bg-sage/20 sm:h-16 sm:w-16">
                      &#127925;
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-forest dark:text-cream sm:text-base">
                      {song.song_title}
                    </p>
                    <p className="truncate text-xs text-forest/60 dark:text-cream/60 sm:text-sm">
                      {song.artist}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-sage dark:text-sage-light">
                      Requested by {song.requester_name}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
                    {song.preview_url && (
                      <button
                        onClick={() => togglePreview(song.preview_url!)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/15 bg-sage/5 text-forest/60 transition-all hover:bg-sage/15 dark:border-sage/20 dark:bg-sage/10 dark:text-cream/60 dark:hover:bg-sage/20"
                        title={playingUrl === song.preview_url ? "Pause" : "Preview"}
                        aria-label={`${playingUrl === song.preview_url ? "Pause" : "Preview"} ${song.song_title}`}
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

                    {song.songlink_url && (
                      <a
                        href={song.songlink_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/15 bg-sage/5 text-forest/60 transition-all hover:bg-sage/15 dark:border-sage/20 dark:bg-sage/10 dark:text-cream/60 dark:hover:bg-sage/20"
                        title="Open in your music app"
                        aria-label={`Open ${song.song_title} in your music app`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
