"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { AnimatePresence, motion } from "framer-motion";

interface Photo {
  id: number;
  url: string;
  thumb_url: string | null;
  content_type: string | null;
  media_type: "image" | "video";
  uploader_name: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

interface QueueItem {
  key: string;
  name: string;
  status: "uploading" | "done" | "error";
  progress: number;
  error?: string;
}

const STORE_DIM = 4096;
const THUMB_DIM = 512;
const VIDEO_LIMIT = 500 * 1024 * 1024;

async function renderJpeg(
  bitmap: ImageBitmap,
  maxDim: number,
  quality: number
): Promise<{ blob: Blob; width: number; height: number }> {
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas context");
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), "image/jpeg", quality)
  );
  return { blob, width: w, height: h };
}

// One decode → a near-original stored image (for archival + the lightbox) and a
// small grid thumbnail (so the gallery grid isn't pulling full JPEGs per tile).
// HEIC on desktop can't be decoded — fall back to the original file, no thumb.
async function processImage(file: File): Promise<{
  full: { data: Blob; width: number; height: number; contentType: string; filename: string };
  thumb: { data: Blob; filename: string } | null;
}> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const base = file.name.replace(/\.[^.]+$/, "");
    const full = await renderJpeg(bitmap, STORE_DIM, 0.85);
    const thumb = await renderJpeg(bitmap, THUMB_DIM, 0.7);
    bitmap.close?.();
    return {
      full: { data: full.blob, width: full.width, height: full.height, contentType: "image/jpeg", filename: base + ".jpg" },
      thumb: { data: thumb.blob, filename: base + "-thumb.jpg" },
    };
  } catch {
    return {
      full: { data: file, width: 0, height: 0, contentType: file.type || "image/jpeg", filename: file.name },
      thumb: null,
    };
  }
}

// The blob upload and this metadata save are two separate requests; on flaky
// rural signal the save can fail after the file is already in Blob. Retry
// transient failures (network / 5xx) so we don't strand an uploaded photo.
async function saveMetadata(body: Record<string, unknown>, attempts = 3): Promise<Response> {
  let lastErr: unknown = new Error("Save failed");
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok || (res.status >= 400 && res.status < 500)) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 600 * (i + 1)));
  }
  throw lastErr instanceof Error ? lastErr : new Error("Save failed");
}

// Force a real download. The blob lives on a different origin, so the <a download>
// attribute is ignored — fetch it to an object URL first; fall back to opening.
async function downloadFile(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank");
  }
}

export default function PhotosPage() {
  const [uploaderName, setUploaderName] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const [myTokens, setMyTokens] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const maxIdRef = useRef(0);

  useEffect(() => {
    setUploaderName(localStorage.getItem("photo_uploader_name") ?? "");
    try {
      const raw = localStorage.getItem("photo_delete_tokens");
      if (raw) setMyTokens(JSON.parse(raw));
    } catch {}
  }, []);

  const rememberToken = useCallback((id: number, token: string) => {
    setMyTokens((prev) => {
      const next = { ...prev, [id]: token };
      try {
        localStorage.setItem("photo_delete_tokens", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      const token = myTokens[id];
      if (!token) return;
      if (!window.confirm("Remove this from the shared album? This can't be undone.")) return;

      const res = await fetch(`/api/photos?id=${id}&token=${encodeURIComponent(token)}`, {
        method: "DELETE",
      });
      if (!res.ok) return;

      setPhotos((prev) => prev.filter((p) => p.id !== id));
      setMyTokens((prev) => {
        const next = { ...prev };
        delete next[id];
        try {
          localStorage.setItem("photo_delete_tokens", JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [myTokens]
  );

  const handleReport = useCallback(async (id: number) => {
    if (!window.confirm("Report this to the hosts? It'll be hidden from the album right away.")) return;
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch("/api/photos/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {}
  }, []);

  const mergePhotos = useCallback((incoming: Photo[]) => {
    if (incoming.length === 0) return;
    setPhotos((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      const fresh = incoming.filter((p) => !seen.has(p.id));
      if (fresh.length === 0) return prev;
      const merged = [...fresh, ...prev].sort((a, b) => b.id - a.id);
      maxIdRef.current = Math.max(maxIdRef.current, ...merged.map((p) => p.id));
      return merged;
    });
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/photos")
      .then((r) => r.json())
      .then((json) => {
        if (!active) return;
        mergePhotos(json.data ?? []);
        setLoaded(true);
      })
      .catch(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [mergePhotos]);

  // Poll for new uploads from other guests.
  useEffect(() => {
    const interval = setInterval(() => {
      const since = maxIdRef.current;
      fetch(`/api/photos${since > 0 ? `?since=${since}` : ""}`)
        .then((r) => r.json())
        .then((json) => mergePhotos(json.data ?? []))
        .catch(() => {});

      // Reconcile removals: drop anything an admin deleted or a guest reported.
      fetch("/api/photos?ids=1")
        .then((r) => r.json())
        .then((json) => {
          if (!Array.isArray(json.ids)) return;
          const live = new Set<number>(json.ids);
          setPhotos((prev) => {
            const next = prev.filter((p) => live.has(p.id));
            return next.length === prev.length ? prev : next;
          });
        })
        .catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [mergePhotos]);

  // Warn before leaving while an upload is still in flight — closing the tab
  // mid-upload silently strands the file (esp. on flaky rural signal).
  useEffect(() => {
    const uploading = queue.some((q) => q.status === "uploading");
    if (!uploading) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [queue]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const name = uploaderName.trim();
      if (name) localStorage.setItem("photo_uploader_name", name);

      const list = Array.from(files);
      for (const file of list) {
        const key = `${file.name}-${file.size}-${Math.round(performance.now())}-${Math.random()}`;
        const isVideo = file.type.startsWith("video");

        if (isVideo && file.size > VIDEO_LIMIT) {
          setQueue((q) => [
            { key, name: file.name, status: "error", progress: 0, error: "That clip's a bit heavy — try one under 500 MB." },
            ...q,
          ]);
          continue;
        }

        setQueue((q) => [{ key, name: file.name, status: "uploading", progress: 0 }, ...q]);

        try {
          let payload: Blob | File = file;
          let contentType = file.type || "application/octet-stream";
          let filename = file.name;
          let width = 0;
          let height = 0;
          let thumb: { data: Blob; filename: string } | null = null;

          if (!isVideo) {
            const processed = await processImage(file);
            payload = processed.full.data;
            contentType = processed.full.contentType;
            filename = processed.full.filename;
            width = processed.full.width;
            height = processed.full.height;
            thumb = processed.thumb;
          }

          const result = await upload(filename, payload, {
            access: "public",
            handleUploadUrl: "/api/photos/upload",
            contentType,
            multipart: isVideo,
            onUploadProgress: (e) =>
              setQueue((q) => q.map((it) => (it.key === key ? { ...it, progress: Math.round(e.percentage) } : it))),
          });

          // Best-effort: if the thumbnail upload fails, the grid falls back to
          // the full image, so don't fail the whole upload over it.
          let thumbUrl: string | null = null;
          if (thumb) {
            try {
              const t = await upload(thumb.filename, thumb.data, {
                access: "public",
                handleUploadUrl: "/api/photos/upload",
                contentType: "image/jpeg",
              });
              thumbUrl = t.url;
            } catch {}
          }

          const res = await saveMetadata({
            url: result.url,
            thumb_url: thumbUrl,
            content_type: contentType,
            media_type: isVideo ? "video" : "image",
            uploader_name: name,
            width,
            height,
            size_bytes: payload.size,
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Save failed");

          mergePhotos([json.data]);
          if (json.data?.delete_token) rememberToken(json.data.id, json.data.delete_token);
          setQueue((q) => q.map((it) => (it.key === key ? { ...it, status: "done", progress: 100 } : it)));
          setTimeout(() => setQueue((q) => q.filter((it) => it.key !== key)), 2500);
        } catch (err) {
          setQueue((q) =>
            q.map((it) =>
              it.key === key
                ? { ...it, status: "error", error: err instanceof Error ? err.message : "Upload failed" }
                : it
            )
          );
        }
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    },
    [uploaderName, mergePhotos, rememberToken]
  );

  const activeCount = queue.filter((q) => q.status === "uploading").length;

  return (
    <div className="enchanted-bg relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-24">
        <PageHeader count={photos.length} />

        <UploadCard
          uploaderName={uploaderName}
          setUploaderName={setUploaderName}
          fileInputRef={fileInputRef}
          cameraInputRef={cameraInputRef}
          onFiles={handleFiles}
          activeCount={activeCount}
        />

        <UploadQueue queue={queue} />

        <Gallery
          photos={photos}
          loaded={loaded}
          onOpen={setLightboxId}
          myTokens={myTokens}
          onDelete={handleDelete}
        />
      </div>

      <AnimatePresence>
        {lightboxId !== null && photos.some((p) => p.id === lightboxId) && (
          <Lightbox
            photos={photos}
            currentId={lightboxId}
            myTokens={myTokens}
            onClose={() => setLightboxId(null)}
            onNavigate={setLightboxId}
            onReport={handleReport}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PageHeader({ count }: { count: number }) {
  return (
    <div className="mb-8 text-center">
      <div className="mb-3 text-sm font-medium tracking-widest text-sage uppercase dark:text-sage-light">
        Our Celebration
      </div>
      <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-4xl font-semibold text-forest dark:text-cream sm:text-5xl">
        Share the Magic
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-deep-plum/75 dark:text-cream/75">
        Snap away and drop your photos &amp; videos here — they appear in our shared album for
        everyone to enjoy. The more eyes, the more moments we get to keep. ✨
      </p>
      {count > 0 && (
        <p className="mt-3 text-sm text-sage/80 dark:text-sage-light/80">
          {count} {count === 1 ? "moment" : "moments"} shared so far
        </p>
      )}
    </div>
  );
}

function UploadCard({
  uploaderName,
  setUploaderName,
  fileInputRef,
  cameraInputRef,
  onFiles,
  activeCount,
}: {
  uploaderName: string;
  setUploaderName: (v: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onFiles: (files: FileList | null) => void;
  activeCount: number;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">
          Your name <span className="font-normal text-deep-plum/55 dark:text-cream/55">(so we know who to thank)</span>
        </label>
        <input
          type="text"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="e.g. Aunt Sue"
          className="enchanted-input"
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFiles(e.dataTransfer.files);
        }}
        className={`w-full rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all ${
          dragOver
            ? "border-soft-gold bg-soft-gold/10"
            : "border-soft-gold/50 bg-soft-gold/5 hover:border-soft-gold hover:bg-soft-gold/10 dark:border-soft-gold/40 dark:bg-soft-gold/10"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />

        <div className="mb-4 text-4xl">📸</div>
        <p className="mb-1 font-[family-name:var(--font-cormorant-garamond)] text-xl font-semibold text-forest dark:text-cream">
          Add your photos &amp; videos
        </p>
        <p className="mb-5 text-sm text-deep-plum/65 dark:text-cream/65">
          Pick as many as you like {activeCount > 0 ? `· ${activeCount} uploading…` : ""}
        </p>

        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] rounded-xl bg-soft-gold px-6 py-3.5 text-base font-semibold text-[#2A1A00] shadow-md transition-all duration-300 hover:bg-soft-gold-dark hover:shadow-lg"
          >
            Choose from library
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="min-h-[44px] rounded-xl border border-sage/30 px-6 py-3 text-sm font-medium text-deep-plum transition-all hover:bg-sage/10 dark:border-sage/40 dark:text-cream dark:hover:bg-sage/20"
          >
            📷 Take a photo
          </button>
        </div>
        <p className="mt-4 text-xs text-deep-plum/50 dark:text-cream/50">
          Shared with everyone here 💚
        </p>
      </div>
    </div>
  );
}

function UploadQueue({ queue }: { queue: QueueItem[] }) {
  if (queue.length === 0) return null;
  return (
    <div className="mx-auto mt-4 max-w-2xl space-y-2">
      <AnimatePresence>
        {queue.map((item) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border p-3 text-sm ${
              item.status === "error"
                ? "border-blush-dark/30 bg-blush/40 dark:border-blush-dark/40 dark:bg-blush-dark/20"
                : "border-sage/20 bg-warm-white/70 dark:border-sage/20 dark:bg-[#162618]/60"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-deep-plum dark:text-cream">{item.name}</span>
              {item.status === "uploading" && (
                <span className="shrink-0 text-xs text-sage dark:text-sage-light">{item.progress}%</span>
              )}
              {item.status === "done" && <span className="shrink-0 text-sage">✓ Added ✨</span>}
            </div>
            {item.status === "uploading" && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sage/15">
                <div className="h-full rounded-full bg-soft-gold transition-[width] duration-200" style={{ width: `${item.progress}%` }} />
              </div>
            )}
            {item.status === "error" && (
              <p className="mt-1 text-xs text-deep-plum/80 dark:text-cream/80">{item.error}</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Gallery({
  photos,
  loaded,
  onOpen,
  myTokens,
  onDelete,
}: {
  photos: Photo[];
  loaded: boolean;
  onOpen: (i: number) => void;
  myTokens: Record<number, string>;
  onDelete: (id: number) => void;
}) {
  if (!loaded) {
    return (
      <div className="py-16 text-center">
        <svg className="mx-auto h-8 w-8 animate-spin text-sage" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="mx-auto mt-10 max-w-md text-center">
        <div className="soft-card p-8">
          <div className="mb-3 text-4xl">🌿</div>
          <p className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold text-forest dark:text-cream">
            No moments yet
          </p>
          <p className="mt-2 text-sm text-deep-plum/70 dark:text-cream/70">
            Be the first to share a little magic — anything you capture today shows up right here for everyone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-5">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative aspect-square overflow-hidden rounded-xl bg-sage/10 animate-soft-fade-in"
        >
          <button onClick={() => onOpen(photo.id)} className="block h-full w-full" aria-label="Open photo">
            {photo.media_type === "video" ? (
              <>
                <video
                  src={`${photo.url}#t=0.1`}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-lg text-white backdrop-blur-sm">
                    ▶
                  </span>
                </span>
              </>
            ) : (
              <img
                src={photo.thumb_url ?? photo.url}
                alt={photo.uploader_name ? `Shared by ${photo.uploader_name}` : "Guest photo"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </button>
          {myTokens[photo.id] && (
            <button
              onClick={() => onDelete(photo.id)}
              className="absolute right-1 top-1 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-red-600"
              aria-label="Remove your photo"
              title="Remove your photo"
            >
              ✕
            </button>
          )}
          {photo.uploader_name && (
            <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/55 to-transparent px-2 pb-1.5 pt-4 text-left text-[11px] text-white/90 opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
              {photo.uploader_name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function Lightbox({
  photos,
  currentId,
  myTokens,
  onClose,
  onNavigate,
  onReport,
  onDelete,
}: {
  photos: Photo[];
  currentId: number;
  myTokens: Record<number, string>;
  onClose: () => void;
  onNavigate: (id: number) => void;
  onReport: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const index = photos.findIndex((p) => p.id === currentId);
  const photo = photos[index];
  const mine = !!myTokens[currentId];

  const go = useCallback(
    (dir: number) => {
      const next = index + dir;
      if (next >= 0 && next < photos.length) onNavigate(photos[next].id);
    },
    [index, photos, onNavigate]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-dark/95 dark:bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20"
        style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
        aria-label="Close"
      >
        ✕
      </button>

      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-4"
          aria-label="Previous"
        >
          ‹
        </button>
      )}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-4"
          aria-label="Next"
        >
          ›
        </button>
      )}

      <div className="flex max-h-[100dvh] w-full flex-col items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
        {photo.media_type === "video" ? (
          <video
            src={photo.url}
            controls
            autoPlay
            playsInline
            className="max-h-[88dvh] max-w-full rounded-lg"
          />
        ) : (
          <img
            src={photo.url}
            alt={photo.uploader_name ? `Shared by ${photo.uploader_name}` : "Guest photo"}
            className="max-h-[88dvh] max-w-full rounded-lg object-contain"
          />
        )}
        {photo.uploader_name && (
          <p className="mt-3 text-sm text-white/80">Shared by {photo.uploader_name}</p>
        )}
        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            onClick={() => downloadFile(photo.url, `brooker-${currentId}.${photo.media_type === "video" ? "mp4" : "jpg"}`)}
            className="min-h-[44px] px-3 text-sm text-white/80 underline-offset-2 transition hover:text-white hover:underline"
          >
            ⬇ Save
          </button>
          {mine ? (
            <button
              onClick={() => onDelete(currentId)}
              className="min-h-[44px] px-3 text-sm text-white/70 underline-offset-2 transition hover:text-white hover:underline"
            >
              Remove my photo
            </button>
          ) : (
            <button
              onClick={() => onReport(currentId)}
              className="min-h-[44px] px-3 text-sm text-white/50 underline-offset-2 transition hover:text-white/90 hover:underline"
            >
              ⚑ Report
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
