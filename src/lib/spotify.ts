import * as crypto from "node:crypto";
import { neon } from "@neondatabase/serverless";

// ── Encryption (AES-256-GCM) ──────────────────────────────────────────

function getEncryptionKey(): Buffer {
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!secret) throw new Error("SPOTIFY_CLIENT_SECRET not set");
  return crypto.createHash("sha256").update(secret).digest();
}

function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();
  const [ivB64, tagB64, encB64] = ciphertext.split(":");
  if (!ivB64 || !tagB64 || !encB64) throw new Error("Invalid encrypted value");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(encB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted) + decipher.final("utf8");
}

// ── Fresh DB connection for Spotify config ────────────────────────────
// Uses its own neon() instance to avoid stale socket issues

function getSpotifyDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

async function spotifyQuery(sql: string, params: unknown[] = []) {
  const db = getSpotifyDb();
  if (!db) return null;
  return db.query(sql, params);
}

// ── Config store ──────────────────────────────────────────────────────

async function getConfig(key: string): Promise<string | null> {
  const result = await spotifyQuery("SELECT value FROM spotify_config WHERE key = $1", [key]);
  if (!result || result.length === 0) return null;
  try {
    return decrypt(result[0].value);
  } catch {
    return result[0].value;
  }
}

async function setConfig(key: string, value: string, shouldEncrypt = true): Promise<void> {
  const stored = shouldEncrypt ? encrypt(value) : value;
  await spotifyQuery(
    `INSERT INTO spotify_config (key, value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, stored]
  );
}

// ── OAuth helpers ─────────────────────────────────────────────────────

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

function getCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Spotify credentials not configured");
  return { clientId, clientSecret };
}

function getRedirectUri() {
  const base = process.env.NEXT_PUBLIC_BASE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    || "http://localhost:3000";
  return `${base}/api/spotify/callback`;
}

export function getAuthorizeUrl(): string {
  const { clientId } = getCredentials();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "playlist-modify-public playlist-modify-private ugc-image-upload",
    redirect_uri: getRedirectUri(),
    state: crypto.randomBytes(16).toString("hex"),
  });
  return `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeCode(code: string): Promise<void> {
  const { clientId, clientSecret } = getCredentials();
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: getRedirectUri(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token exchange failed: ${text}`);
  }

  const data = await res.json();
  await setConfig("access_token", data.access_token);
  await setConfig("refresh_token", data.refresh_token);
  await setConfig("token_expires_at", String(Date.now() + data.expires_in * 1000), false);
}

async function getAccessToken(): Promise<string> {
  const expiresAt = await getConfig("token_expires_at");
  const accessToken = await getConfig("access_token");

  if (accessToken && expiresAt && Date.now() < Number(expiresAt) - 60000) {
    return accessToken;
  }

  const refreshToken = await getConfig("refresh_token");
  if (!refreshToken) throw new Error("No Spotify refresh token. Connect Spotify first.");

  const { clientId, clientSecret } = getCredentials();
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token refresh failed: ${text}`);
  }

  const data = await res.json();
  await setConfig("access_token", data.access_token);
  if (data.refresh_token) {
    await setConfig("refresh_token", data.refresh_token);
  }
  await setConfig("token_expires_at", String(Date.now() + data.expires_in * 1000), false);

  return data.access_token;
}

// ── Spotify API helpers ───────────────────────────────────────────────

async function spotifyFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  return fetch(`${SPOTIFY_API_BASE}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function spotifyFetchWithRetry(path: string, options: RequestInit = {}, retries = 2): Promise<Response> {
  const res = await spotifyFetch(path, options);
  if (res.status === 429 && retries > 0) {
    const retryAfter = Number(res.headers.get("retry-after") || "2");
    console.log(`Spotify rate limited, waiting ${retryAfter}s...`);
    await delay(retryAfter * 1000);
    return spotifyFetchWithRetry(path, options, retries - 1);
  }
  return res;
}

async function searchTrack(title: string, artist: string): Promise<string | null> {
  // Try exact field search first
  const exactQ = encodeURIComponent(`track:${title} artist:${artist}`);
  const res = await spotifyFetchWithRetry(`/search?q=${exactQ}&type=track&limit=1`);
  if (res.ok) {
    const data = await res.json();
    const uri = data?.tracks?.items?.[0]?.uri;
    if (uri) return uri;
  } else if (res.status === 429) {
    return null; // still rate limited after retries
  }

  // Fallback: simple search (more forgiving with weird titles)
  await delay(100);
  const simpleQ = encodeURIComponent(`${title} ${artist}`);
  const res2 = await spotifyFetchWithRetry(`/search?q=${simpleQ}&type=track&limit=1`);
  if (!res2.ok) {
    console.error(`Spotify search failed for "${title}" by "${artist}":`, res2.status);
    return null;
  }
  const data2 = await res2.json();
  return data2?.tracks?.items?.[0]?.uri ?? null;
}

async function getCurrentUserId(): Promise<string> {
  const res = await spotifyFetch("/me");
  if (!res.ok) throw new Error("Failed to get Spotify user");
  const data = await res.json();
  return data.id;
}

async function createPlaylist(userId: string): Promise<string> {
  const res = await spotifyFetch(`/users/${userId}/playlists`, {
    method: "POST",
    body: JSON.stringify({
      name: "Brooker Celebration Playlist",
      description: "Song requests for Matt & Brittany's wedding celebration - brooker.family/songs",
      public: true,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create playlist: ${text}`);
  }
  const data = await res.json();
  return data.id;
}

// ── Sync ──────────────────────────────────────────────────────────────

export async function syncSpotifyPlaylist(): Promise<void> {
  const refreshToken = await getConfig("refresh_token");
  if (!refreshToken) return;

  try {
    let playlistId = await getConfig("playlist_id");
    if (!playlistId) {
      const userId = await getCurrentUserId();
      playlistId = await createPlaylist(userId);
      await setConfig("playlist_id", playlistId, false);
    }

    const songs = await spotifyQuery(
      `SELECT song_title, artist FROM song_requests
       ORDER BY sort_position ASC NULLS LAST, id ASC`
    );

    if (!songs || songs.length === 0) {
      await spotifyFetch(`/playlists/${playlistId}/tracks`, {
        method: "PUT",
        body: JSON.stringify({ uris: [] }),
      });
      return;
    }

    // Search for each song on Spotify (with delay to avoid rate limits)
    const uris: string[] = [];
    for (let i = 0; i < songs.length; i++) {
      if (i > 0) await delay(150); // throttle to ~6 requests/sec
      const song = songs[i];
      const uri = await searchTrack(song.song_title, song.artist);
      if (uri) {
        uris.push(uri);
      } else {
        console.warn(`Spotify: no match for "${song.song_title}" by "${song.artist}"`);
      }
    }

    console.log(`Spotify sync: ${uris.length}/${songs.length} songs matched, playlist: ${playlistId}`);

    // Clear existing tracks first
    const getRes = await spotifyFetch(`/playlists/${playlistId}/tracks?fields=items(track(uri))&limit=50`);
    if (getRes.ok) {
      const current = await getRes.json();
      const existing = current?.items?.map((i: { track: { uri: string } }) => ({ uri: i.track.uri })).filter((t: { uri: string }) => t.uri) || [];
      if (existing.length > 0) {
        const delRes = await spotifyFetch(`/playlists/${playlistId}/tracks`, {
          method: "DELETE",
          body: JSON.stringify({ tracks: existing }),
        });
        console.log(`Spotify DELETE existing tracks: ${delRes.status}`);
      }
    }

    // Add tracks via POST (in batches of 100)
    for (let i = 0; i < uris.length; i += 100) {
      const batch = uris.slice(i, i + 100);
      const postRes = await spotifyFetch(`/playlists/${playlistId}/tracks`, {
        method: "POST",
        body: JSON.stringify({ uris: batch }),
      });
      const postText = await postRes.text();
      console.log(`Spotify POST tracks batch ${i}: ${postRes.status} ${postText.slice(0, 200)}`);
      if (!postRes.ok) {
        console.error("Spotify: failed to add tracks:", postRes.status, postText);
        return;
      }
    }
  } catch (error) {
    console.error("Spotify sync error:", error);
  }
}

export async function getPlaylistUrl(): Promise<string | null> {
  const playlistId = await getConfig("playlist_id");
  if (!playlistId) return null;
  return `https://open.spotify.com/playlist/${playlistId}`;
}

export async function isConnected(): Promise<boolean> {
  const refreshToken = await getConfig("refresh_token");
  return !!refreshToken;
}
