import { getAppBaseUrl } from "./google";

// Guest-facing "export the album to *your* Google Photos" flow. Unlike the
// calendar integration (one admin account, tokens stored in Postgres), this
// authorizes whoever clicked the button and keeps their short-lived access
// token only in an httpOnly cookie — nothing is persisted server-side.
//
// Uses the append-only Photos Library scope, which survived Google's
// March 2025 Library API changes: the app can create albums and upload new
// media, but can never read or touch anything else in the user's library.

const SCOPE = "https://www.googleapis.com/auth/photoslibrary.appendonly";
const API = "https://photoslibrary.googleapis.com/v1";

export class GoogleApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export function isPhotosExportConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

// Must be listed under "Authorized redirect URIs" on the OAuth client in
// Google Cloud Console (alongside the calendar callback).
export function getPhotosRedirectUri(): string {
  return `${getAppBaseUrl()}/api/photos/google-export/callback`;
}

export function getPhotosAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: getPhotosRedirectUri(),
    response_type: "code",
    scope: SCOPE,
    state,
    // "online": no refresh token — we only need ~an hour to copy the album.
    access_type: "online",
    // Guests may be signed into several accounts; let them pick.
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangePhotosCode(
  code: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: getPhotosRedirectUri(),
      grant_type: "authorization_code",
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new GoogleApiError(
      res.status,
      json.error_description || json.error || "Token exchange failed"
    );
  }
  return { accessToken: json.access_token, expiresIn: Number(json.expires_in) || 3600 };
}

async function photosApi(
  accessToken: string,
  path: string,
  body: unknown
): Promise<Record<string, unknown>> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as {
    error?: { message?: string; status?: string };
  };
  if (!res.ok) {
    throw new GoogleApiError(
      res.status,
      json.error?.message || `Google Photos API error (${res.status})`
    );
  }
  return json as Record<string, unknown>;
}

export async function createAlbum(
  accessToken: string,
  title: string
): Promise<{ id: string; productUrl: string | null }> {
  const json = (await photosApi(accessToken, "/albums", { album: { title } })) as {
    id?: string;
    productUrl?: string;
  };
  if (!json.id) throw new GoogleApiError(502, "Album create returned no id");
  return { id: json.id, productUrl: json.productUrl ?? null };
}

// Push raw bytes; Google hands back an upload token that batchCreate turns
// into a real media item.
export async function uploadBytes(
  accessToken: string,
  data: ArrayBuffer,
  mimeType: string
): Promise<string> {
  const res = await fetch(`${API}/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream",
      "X-Goog-Upload-Content-Type": mimeType,
      "X-Goog-Upload-Protocol": "raw",
    },
    body: data,
  });
  const text = await res.text();
  if (!res.ok || !text) {
    throw new GoogleApiError(res.status, text || "Byte upload failed");
  }
  return text;
}

export interface NewMediaItemResult {
  status?: { code?: number; message?: string };
  mediaItem?: { id?: string };
}

export async function batchCreateInAlbum(
  accessToken: string,
  albumId: string,
  items: { uploadToken: string; fileName: string; description?: string }[]
): Promise<NewMediaItemResult[]> {
  const json = (await photosApi(accessToken, "/mediaItems:batchCreate", {
    albumId,
    newMediaItems: items.map((i) => ({
      ...(i.description ? { description: i.description } : {}),
      simpleMediaItem: { uploadToken: i.uploadToken, fileName: i.fileName },
    })),
  })) as { newMediaItemResults?: NewMediaItemResult[] };
  return json.newMediaItemResults ?? [];
}
