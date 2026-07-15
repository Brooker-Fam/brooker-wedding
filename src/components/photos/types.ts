export interface Photo {
  id: number;
  url: string;
  thumb_url: string | null;
  content_type: string | null;
  media_type: "image" | "video";
  uploader_name: string | null;
  width: number | null;
  height: number | null;
  // BIGINT comes back from Postgres as a string — always wrap in Number().
  size_bytes: number | string | null;
  created_at: string;
}

// Same naming convention as scripts/export-photos.js, so a web export and the
// CLI backup produce interchangeable archives.
export function exportFilename(photo: Photo): string {
  const base = photo.url.split("?")[0];
  const ext =
    (base.match(/\.[a-z0-9]+$/i) || [photo.media_type === "video" ? ".mp4" : ".jpg"])[0];
  const who =
    (photo.uploader_name || "guest")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "guest";
  const date = new Date(photo.created_at).toISOString().slice(0, 10);
  return `${date}_${String(photo.id).padStart(4, "0")}_${who}${ext}`;
}

// Fetch every approved photo, paging past the API's per-request cap with the
// `before` cursor. Used by the export flows so they cover the whole album,
// not just what the gallery has rendered.
export async function fetchAllPhotos(): Promise<Photo[]> {
  const all: Photo[] = [];
  let before = 0;
  for (let page = 0; page < 40; page++) {
    const qs = before > 0 ? `?limit=500&before=${before}` : "?limit=500";
    const res = await fetch(`/api/photos${qs}`);
    if (!res.ok) throw new Error("Couldn't load the album list");
    const json = await res.json();
    const batch: Photo[] = json.data ?? [];
    all.push(...batch);
    if (batch.length < 500) break;
    before = batch[batch.length - 1].id;
  }
  return all;
}
