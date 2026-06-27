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

Note: uploaded photos are downscaled in the browser before upload (see `MAX_DIM` in `src/app/photos/page.tsx`), so the "originals" here are large JPEGs, not the raw camera files. Videos are uploaded unmodified. For true full-res shots from close family, ask them to AirDrop/share the originals directly.

## 2. Set a Vercel spend cap (do BEFORE the QR codes go out)

Vercel has **no hard spend limit by default** — a hotlinked 500 MB video or a scraper could run up unbounded Blob egress. This is dashboard-only config:

- **Vercel → the team → Settings → Billing → Spend Management**: set a monthly spend cap and a notification threshold (e.g. alert at 50%, pause at the cap).
- Optionally lower the per-upload video cap in `src/app/api/photos/upload/route.ts` (`maximumSizeInBytes`, currently 500 MB) — party clips rarely need half a gig.

## 3. Retention

Blob URLs are **public and permanent**, and `/photos` is unauthenticated. Decide post-event:

- **Keep it up** — ongoing storage + any egress. Fine if the spend cap is set.
- **Take it down** — run the export (#1) for the archive, then delete the blobs (the `del()` path in `src/app/api/photos/route.ts` already exists; a "delete all" sweep would reuse it).
