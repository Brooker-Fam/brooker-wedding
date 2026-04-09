import crypto from "crypto";
import { query } from "@/lib/db";

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
  // Format: base64(iv):base64(tag):base64(encrypted)
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

// ── Config store ──────────────────────────────────────────────────────

async function getConfig(key: string): Promise<string | null> {
  const result = await query("SELECT value FROM spotify_config WHERE key = $1", [key]);
  if (!result || result.length === 0) return null;
  try {
    return decrypt(result[0].value);
  } catch {
    return result[0].value; // fallback for unencrypted values like playlist_id
  }
}

async function setConfig(key: string, value: string, shouldEncrypt = true): Promise<void> {
  const stored = shouldEncrypt ? encrypt(value) : value;
  await query(
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

  // If token is still valid (with 60s buffer), use it
  if (accessToken && expiresAt && Date.now() < Number(expiresAt) - 60000) {
    return accessToken;
  }

  // Refresh the token
  const refreshToken = await getConfig("refresh_token");
  if (!refreshToken) throw new Error("No Spotify refresh token. Connect Spotify first.");

  const { clientId, clientSecret } = getCredentials();
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
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
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

async function searchTrack(title: string, artist: string): Promise<string | null> {
  // Try exact field search first
  const exactQ = encodeURIComponent(`track:${title} artist:${artist}`);
  const res = await spotifyFetch(`/search?q=${exactQ}&type=track&limit=1`);
  if (res.ok) {
    const data = await res.json();
    const uri = data?.tracks?.items?.[0]?.uri;
    if (uri) return uri;
  }

  // Fallback: simple search with title + artist (more forgiving)
  const simpleQ = encodeURIComponent(`${title} ${artist}`);
  const res2 = await spotifyFetch(`/search?q=${simpleQ}&type=track&limit=1`);
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
  // Check if Spotify is connected
  const refreshToken = await getConfig("refresh_token");
  if (!refreshToken) return; // Not connected, skip silently

  try {
    // Get or create playlist
    let playlistId = await getConfig("playlist_id");
    if (!playlistId) {
      const userId = await getCurrentUserId();
      playlistId = await createPlaylist(userId);
      await setConfig("playlist_id", playlistId, false);
    }

    // Get all songs in order from DB
    const songs = await query(
      `SELECT song_title, artist FROM song_requests
       ORDER BY sort_position ASC NULLS LAST, id ASC`
    );

    if (!songs || songs.length === 0) {
      // Clear the playlist
      await spotifyFetch(`/playlists/${playlistId}/tracks`, {
        method: "PUT",
        body: JSON.stringify({ uris: [] }),
      });
      return;
    }

    // Search for each song on Spotify
    const uris: string[] = [];
    for (const song of songs) {
      const uri = await searchTrack(song.song_title, song.artist);
      if (uri) {
        uris.push(uri);
      } else {
        console.warn(`Spotify: no match for "${song.song_title}" by "${song.artist}"`);
      }
    }

    console.log(`Spotify sync: ${uris.length}/${songs.length} songs matched`);

    // Replace playlist tracks (Spotify supports up to 100 at a time)
    // First batch replaces all existing tracks (empty array clears it)
    const putRes = await spotifyFetch(`/playlists/${playlistId}/tracks`, {
      method: "PUT",
      body: JSON.stringify({ uris: uris.slice(0, 100) }),
    });

    if (!putRes.ok) {
      const text = await putRes.text();
      console.error("Spotify: failed to replace tracks:", putRes.status, text);
      return;
    }

    // Additional batches if > 100 songs
    for (let i = 100; i < uris.length; i += 100) {
      await spotifyFetch(`/playlists/${playlistId}/tracks`, {
        method: "POST",
        body: JSON.stringify({ uris: uris.slice(i, i + 100) }),
      });
    }
  } catch (error) {
    console.error("Spotify sync error:", error);
    // Don't throw - sync failures shouldn't break song operations
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
