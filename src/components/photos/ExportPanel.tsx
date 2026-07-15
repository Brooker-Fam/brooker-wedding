"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Zip, ZipPassThrough } from "fflate";
import { exportFilename, fetchAllPhotos } from "./types";

// Videos above this are skipped by the Google Photos export (the serverless
// relay buffers each file in memory). Matches MAX_ITEM_BYTES on the server.
const GP_VIDEO_CAP = 100 * 1024 * 1024;

// Without the File System Access API the zip is assembled in memory — warn
// before attempting an archive that could crash a phone browser.
const MEMORY_ZIP_WARN_BYTES = 800 * 1024 * 1024;

const CANCELLED = new Error("cancelled");

type Busy =
  | { kind: "idle" }
  | { kind: "zip" | "google"; done: number; total: number; bytes: number; note?: string };

interface WritableLike {
  write(chunk: Uint8Array): Promise<void>;
  close(): Promise<void>;
  abort?(): Promise<void>;
}

function fmtBytes(n: number): string {
  if (n >= 1024 * 1024 * 1024) return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (n >= 1024 * 1024) return `${Math.round(n / (1024 * 1024))} MB`;
  return `${Math.max(1, Math.round(n / 1024))} KB`;
}

export default function ExportPanel() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<Busy>({ kind: "idle" });
  const [includeVideos, setIncludeVideos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [albumUrl, setAlbumUrl] = useState<string | null>(null);
  const [gpConnected, setGpConnected] = useState(false);
  const [gpConfigured, setGpConfigured] = useState(true);
  const cancelRef = useRef(false);
  const autoStartedRef = useRef(false);

  const isBusy = busy.kind !== "idle";

  useEffect(() => {
    fetch("/api/photos/google-export")
      .then((r) => r.json())
      .then((json) => {
        setGpConnected(!!json.connected);
        setGpConfigured(json.configured !== false);
      })
      .catch(() => {});
  }, []);

  const runZip = useCallback(async () => {
    cancelRef.current = false;
    setError(null);
    setResult(null);
    setBusy({ kind: "zip", done: 0, total: 0, bytes: 0, note: "Gathering the album…" });

    let writable: WritableLike | null = null;
    try {
      // Ask where to save first (must happen close to the click for the
      // browser to honor it); browsers without the API fall back to memory.
      const picker = (
        window as unknown as {
          showSaveFilePicker?: (opts: unknown) => Promise<{ createWritable(): Promise<WritableLike> }>;
        }
      ).showSaveFilePicker;
      if (picker) {
        try {
          const handle = await picker({
            suggestedName: "brooker-celebration-album.zip",
            types: [{ description: "Zip archive", accept: { "application/zip": [".zip"] } }],
          });
          writable = await handle.createWritable();
        } catch (e) {
          if ((e as Error)?.name === "AbortError") {
            setBusy({ kind: "idle" });
            return;
          }
          writable = null; // picker unavailable/blocked — use the memory path
        }
      }

      const all = await fetchAllPhotos();
      const items = all.filter((p) => includeVideos || p.media_type === "image");
      const totalBytes = items.reduce((sum, p) => sum + (Number(p.size_bytes) || 0), 0);
      if (items.length === 0) throw new Error("Nothing to download yet");

      if (!writable && totalBytes > MEMORY_ZIP_WARN_BYTES) {
        const ok = window.confirm(
          `This archive is about ${fmtBytes(totalBytes)} and your browser has to hold it all in memory before saving — that can fail on phones. Continue anyway? (A desktop browser like Chrome handles big archives better.)`
        );
        if (!ok) {
          setBusy({ kind: "idle" });
          return;
        }
      }

      const chunks: Uint8Array[] = [];
      let writeQueue: Promise<void> = Promise.resolve();
      let zipDone!: () => void;
      let zipFail!: (e: unknown) => void;
      const finished = new Promise<void>((res, rej) => {
        zipDone = res;
        zipFail = rej;
      });
      const zip = new Zip((err, chunk, final) => {
        if (err) return zipFail(err);
        if (writable) {
          const w = writable;
          writeQueue = writeQueue.then(() => w.write(chunk)).catch(zipFail);
        } else {
          chunks.push(chunk);
        }
        if (final) writeQueue.then(zipDone, zipFail);
      });

      let done = 0;
      let bytes = 0;
      let failed = 0;
      for (const photo of items) {
        if (cancelRef.current) throw CANCELLED;
        setBusy({ kind: "zip", done, total: items.length, bytes });
        try {
          const res = await fetch(photo.url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          // JPEGs/MP4s don't recompress, so store entries as-is (fast + streams).
          const entry = new ZipPassThrough(exportFilename(photo));
          zip.add(entry);
          if (res.body) {
            const reader = res.body.getReader();
            for (;;) {
              if (cancelRef.current) {
                reader.cancel().catch(() => {});
                throw CANCELLED;
              }
              const { done: eof, value } = await reader.read();
              if (eof) break;
              entry.push(value);
              bytes += value.length;
              setBusy({ kind: "zip", done, total: items.length, bytes });
            }
            entry.push(new Uint8Array(0), true);
          } else {
            const buf = new Uint8Array(await res.arrayBuffer());
            bytes += buf.length;
            entry.push(buf, true);
          }
        } catch (e) {
          if (e === CANCELLED) throw e;
          failed++;
        }
        done++;
      }

      zip.end();
      await finished;

      if (writable) {
        await writeQueue;
        await writable.close();
        writable = null;
      } else {
        const blob = new Blob(chunks as BlobPart[], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "brooker-celebration-album.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }

      setResult(
        `Saved ${done - failed} of ${items.length} ${includeVideos ? "photos & videos" : "photos"} (${fmtBytes(bytes)})${failed > 0 ? ` — ${failed} couldn't be fetched` : ""}. On iPhone/Mac: open the zip and import into Apple Photos.`
      );
    } catch (e) {
      if (e !== CANCELLED) {
        setError(e instanceof Error ? e.message : "Download failed — try again");
      }
      try {
        await writable?.abort?.();
        writable = null;
      } catch {}
    } finally {
      try {
        await writable?.close();
      } catch {}
      setBusy({ kind: "idle" });
    }
  }, [includeVideos]);

  const runGoogleExport = useCallback(async () => {
    cancelRef.current = false;
    setError(null);
    setResult(null);
    setAlbumUrl(null);
    setBusy({ kind: "google", done: 0, total: 0, bytes: 0, note: "Gathering the album…" });

    try {
      const all = await fetchAllPhotos();
      const tooBig = all.filter(
        (p) => p.media_type === "video" && Number(p.size_bytes) > GP_VIDEO_CAP
      );
      const items = all.filter((p) => !tooBig.includes(p));
      if (items.length === 0) throw new Error("Nothing to export yet");

      setBusy({ kind: "google", done: 0, total: items.length, bytes: 0, note: "Creating the album…" });
      const initRes = await fetch("/api/photos/google-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "init" }),
      });
      if (initRes.status === 401) {
        setGpConnected(false);
        window.location.href = "/api/photos/google-export/start";
        return;
      }
      const init = await initRes.json();
      if (!initRes.ok) throw new Error(init.error || "Couldn't create the album");
      if (init.albumUrl) setAlbumUrl(init.albumUrl);

      let remaining = items.map((p) => p.id);
      const failures: { id: number; reason: string }[] = [];
      let done = 0;
      while (remaining.length > 0) {
        if (cancelRef.current) throw CANCELLED;
        const res = await fetch("/api/photos/google-export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "batch", albumId: init.albumId, ids: remaining.slice(0, 40) }),
        });
        if (res.status === 401) {
          setGpConnected(false);
          throw new Error("Google session expired — tap the button to reconnect and it'll pick back up.");
        }
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Export failed partway — try again");
        const processed: number[] = json.processedIds ?? [];
        failures.push(...(json.failures ?? []));
        if (processed.length === 0) throw new Error("The export stalled — try again in a minute");
        const seen = new Set(processed);
        remaining = remaining.filter((id) => !seen.has(id));
        done += processed.length;
        setBusy({ kind: "google", done, total: items.length, bytes: 0 });
      }

      const parts = [`Added ${done - failures.length} of ${items.length} to your Google Photos album`];
      if (failures.length > 0) parts.push(`${failures.length} failed`);
      if (tooBig.length > 0) parts.push(`${tooBig.length} large video${tooBig.length === 1 ? "" : "s"} skipped (over 100 MB — grab those via the zip)`);
      setResult(parts.join(" · ") + ".");
    } catch (e) {
      if (e !== CANCELLED) {
        setError(e instanceof Error ? e.message : "Export failed — try again");
      }
    } finally {
      setBusy({ kind: "idle" });
    }
  }, []);

  // Returning from the Google consent screen: ?gphotos=connected — pick the
  // export back up automatically (the click that started it is long gone).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("gphotos") === "connected";
    const gpError = params.get("gphotos_error");
    if (!connected && !gpError) return;
    window.history.replaceState(null, "", window.location.pathname);
    setOpen(true);
    if (gpError) {
      setError(
        gpError === "access_denied"
          ? "Google access was declined — nothing was exported."
          : gpError === "not_configured"
            ? "Google export isn't set up on the server yet."
            : `Google sign-in hiccup (${gpError}) — try again.`
      );
      return;
    }
    setGpConnected(true);
    if (!autoStartedRef.current) {
      autoStartedRef.current = true;
      runGoogleExport();
    }
  }, [runGoogleExport]);

  const startGoogle = useCallback(() => {
    if (gpConnected) {
      runGoogleExport();
    } else {
      window.location.href = "/api/photos/google-export/start";
    }
  }, [gpConnected, runGoogleExport]);

  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <div className="soft-card px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[44px] w-full items-center justify-between gap-3 text-left"
          aria-expanded={open}
        >
          <span className="text-sm font-medium text-deep-plum dark:text-cream">
            💾 Take the memories home
          </span>
          <span className="text-sage transition-transform dark:text-sage-light" style={{ transform: open ? "rotate(180deg)" : undefined }}>
            ▾
          </span>
        </button>

        {open && (
          <div className="mt-3 border-t border-sage/15 pt-4">
            <p className="mb-4 text-sm text-deep-plum/70 dark:text-cream/70">
              Download the whole album as a zip (then import it into Apple Photos or anywhere
              else), or send copies straight into an album in your own Google Photos.
            </p>

            {!isBusy && (
              <>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={runZip}
                    className="min-h-[44px] flex-1 rounded-xl bg-soft-gold px-5 py-3 text-sm font-semibold text-[#2A1A00] shadow-md transition-all hover:bg-soft-gold-dark hover:shadow-lg"
                  >
                    ⬇ Download everything (.zip)
                  </button>
                  {gpConfigured && (
                    <button
                      type="button"
                      onClick={startGoogle}
                      className="min-h-[44px] flex-1 rounded-xl border border-sage/30 px-5 py-3 text-sm font-medium text-deep-plum transition-all hover:bg-sage/10 dark:border-sage/40 dark:text-cream dark:hover:bg-sage/20"
                    >
                      Export to Google Photos
                    </button>
                  )}
                </div>
                <label className="mt-3 flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-deep-plum/75 dark:text-cream/75">
                  <input
                    type="checkbox"
                    checked={includeVideos}
                    onChange={(e) => setIncludeVideos(e.target.checked)}
                    className="h-4 w-4 accent-[#C49A3C]"
                  />
                  Include videos in the zip (much bigger download)
                </label>
              </>
            )}

            {isBusy && (
              <div>
                <div className="flex items-center justify-between text-sm text-deep-plum dark:text-cream">
                  <span>
                    {busy.note ??
                      (busy.kind === "zip"
                        ? `Zipping ${busy.done} / ${busy.total}${busy.bytes > 0 ? ` · ${fmtBytes(busy.bytes)}` : ""}`
                        : `Sending to Google Photos ${busy.done} / ${busy.total}`)}
                  </span>
                  <button
                    type="button"
                    onClick={() => (cancelRef.current = true)}
                    className="min-h-[44px] px-2 text-xs text-deep-plum/60 underline-offset-2 hover:underline dark:text-cream/60"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sage/15">
                  <div
                    className="h-full rounded-full bg-soft-gold transition-[width] duration-300"
                    style={{ width: busy.total > 0 ? `${Math.round((busy.done / busy.total) * 100)}%` : "10%" }}
                  />
                </div>
                {busy.kind === "zip" && (
                  <p className="mt-2 text-xs text-deep-plum/55 dark:text-cream/55">
                    Keep this tab open while it packs everything up.
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-700 dark:text-red-300">{error}</p>
            )}
            {result && (
              <p className="mt-3 text-sm text-sage-dark dark:text-sage-light">
                ✓ {result}{" "}
                {albumUrl && (
                  <a href={albumUrl} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-2">
                    Open the album →
                  </a>
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
