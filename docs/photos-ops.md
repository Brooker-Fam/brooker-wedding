# Guest photo gallery — ops & memory protection

The `/photos` gallery stores guest uploads in **Vercel Blob** (files) + **Neon Postgres** (metadata only). These are the *only* copies. A few things to do so a runaway bill or a lost store never costs the couple their memories.

## 1. Back up the originals (do after the party, and periodically)

Pull every photo/video to a local folder:

```bash
DATABASE_URL="<Neon string from Vercel → Settings → Environment Variables>" \
  pnpm run export:photos                 # or: node scripts/export-photos.js [outdir]
```

- Saves to `./photo-export/` as `{date}_{id}_{uploader}.{ext}`.
- Re-runnable / resumable — already-downloaded files are skipped.
- Then drop the folder somewhere durable (Google Drive / iCloud / an external drive) so there are **two** copies, not one.

Note: photos are re-encoded in the browser to a near-original ~4096px JPEG before upload (see `STORE_DIM` in `src/app/photos/page.tsx`) — good for prints, but not the raw camera files. Videos are uploaded unmodified. For true full-res shots from close family, ask them to AirDrop/share the originals directly.

## 2. Set a Vercel spend cap (do BEFORE the QR codes go out)

Vercel has **no hard spend limit by default** — a hotlinked 500 MB video or a scraper could run up unbounded Blob egress. This is dashboard-only config:

- **Vercel → the team → Settings → Billing → Spend Management**: set a monthly spend cap and a notification threshold (e.g. alert at 50%, pause at the cap).
- Optionally lower the per-upload video cap in `src/app/api/photos/upload/route.ts` (`maximumSizeInBytes`, currently 500 MB) — party clips rarely need half a gig.

## 3. Retention

Blob URLs are **public and permanent**, and `/photos` is unauthenticated. Decide post-event:

- **Keep it up** — ongoing storage + any egress. Fine if the spend cap is set.
- **Take it down** — run the export (#1) for the archive, then delete the blobs (the `del()` path in `src/app/api/photos/route.ts` already exists; a "delete all" sweep would reuse it).

## 4. Guest-facing export (zip + Google Photos)

`/photos` has a "💾 Take the memories home" panel (shown once the album has content):

- **Download everything (.zip)** — the browser fetches every blob and zips it client-side
  (`src/components/photos/ExportPanel.tsx`, `fflate`). On Chromium it streams straight to
  disk via the File System Access API; elsewhere it assembles in memory (the UI warns past
  ~800 MB). Videos are opt-in via checkbox. Same `{date}_{id}_{uploader}.{ext}` naming as
  `scripts/export-photos.js`. This is also the **Apple Photos** path: download, then import
  the folder (there is no public web API for Apple Photos).
- **Export to Google Photos** — per-guest OAuth (`photoslibrary.appendonly` scope, the one
  that survived Google's March 2025 Library API changes). Creates an album
  "Matt & Brittany's Celebration 🎉" in *their* account and relays every item
  Blob → serverless → Google in client-driven batches (`/api/photos/google-export`).
  The access token lives only in a ~1h httpOnly cookie; nothing is stored server-side.
  Videos over 100 MB are skipped (the relay buffers files in function memory) — the zip
  covers those.

### One-time Google setup (reuses the calendar OAuth app)

1. In the same Google Cloud project: **enable the Photos Library API**.
2. On the OAuth client, add an authorized redirect URI:
   `{BASE_URL}/api/photos/google-export/callback` (next to the calendar one).
3. While the consent screen is in **Testing** mode only listed test users can export.
   Add family as test users, or publish the app (the photoslibrary scope needs Google
   verification for public use).

If setup is missing, the button either hides (`configured: false` — no client id) or the
export fails with Google's "API has not been used in project…" message, which is the hint.
