"use client";

import { useCallback, useEffect, useState } from "react";

interface Photo {
  id: number;
  url: string;
  media_type: "image" | "video";
  uploader_name: string | null;
  created_at: string;
}

export default function ManagePhotosPage() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("photo_admin_secret");
    if (saved) {
      setSecret(saved);
      setUnlocked(true);
    }
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/photos?limit=500")
      .then((r) => r.json())
      .then((json) => setPhotos(json.data ?? []))
      .catch(() => setError("Couldn't load photos."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (unlocked) load();
  }, [unlocked, load]);

  const handleUnlock = () => {
    if (!secret.trim()) return;
    sessionStorage.setItem("photo_admin_secret", secret.trim());
    setUnlocked(true);
  };

  const handleDelete = async (id: number) => {
    setError("");
    const res = await fetch(`/api/photos?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${secret.trim()}` },
    });
    if (res.status === 401) {
      setError("That admin password didn't work.");
      sessionStorage.removeItem("photo_admin_secret");
      setUnlocked(false);
      return;
    }
    if (!res.ok) {
      setError("Couldn't delete that one — try again.");
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="enchanted-bg relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:pt-28">
        <h1 className="mb-2 text-center font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-forest dark:text-cream">
          Manage Photos
        </h1>
        <p className="mb-8 text-center text-sm text-deep-plum/70 dark:text-cream/70">
          Remove any photo from the shared gallery.
        </p>

        {!unlocked ? (
          <div className="mx-auto max-w-sm">
            <label className="mb-2 block text-sm font-medium text-deep-plum dark:text-cream">
              Admin password
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              placeholder="Enter the admin password"
              className="enchanted-input"
            />
            <p className="mt-1.5 text-xs text-deep-plum/55 dark:text-cream/55">
              This is the ADMIN_SECRET env var — or CRON_SECRET if that isn&apos;t set yet (Vercel → Settings → Environment Variables).
            </p>
            <button
              onClick={handleUnlock}
              className="mt-4 w-full rounded-xl bg-soft-gold px-6 py-3 text-base font-semibold text-[#2A1A00] shadow-md transition-all hover:bg-soft-gold-dark hover:shadow-lg"
            >
              Unlock
            </button>
          </div>
        ) : (
          <>
            {error && (
              <p className="mb-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            {loading ? (
              <p className="text-center text-sm text-deep-plum/70 dark:text-cream/70">Loading…</p>
            ) : photos.length === 0 ? (
              <p className="text-center text-sm text-deep-plum/70 dark:text-cream/70">No photos yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl bg-sage/10">
                    {photo.media_type === "video" ? (
                      <video src={`${photo.url}#t=0.1`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    ) : (
                      <img src={photo.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    )}
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-red-600"
                      aria-label="Delete photo"
                    >
                      ✕
                    </button>
                    {photo.uploader_name && (
                      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/55 to-transparent px-2 pb-1 pt-3 text-[11px] text-white/90">
                        {photo.uploader_name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
