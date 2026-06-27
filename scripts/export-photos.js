/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Bulk-download every photo & video guests shared, so Matt & Brittany keep the
 * originals forever instead of trusting one vendor's storage.
 *
 *   DATABASE_URL="postgres://..." node scripts/export-photos.js [outdir]
 *
 * Saves to ./photo-export (or the dir you pass) as
 * {date}_{id}_{uploader}.{ext}. Safe to re-run — already-downloaded files are
 * skipped, so it doubles as a resumable backup. Zip the folder afterwards if
 * you want a single archive.
 */
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Set DATABASE_URL (the Neon connection string from Vercel) first.");
    process.exit(1);
  }

  const outDir = path.resolve(process.argv[2] || "photo-export");
  fs.mkdirSync(outDir, { recursive: true });

  const sql = neon(databaseUrl);
  const rows = await sql`
    SELECT id, url, media_type, uploader_name, created_at
    FROM photos
    ORDER BY id ASC
  `;

  console.log(`Found ${rows.length} items. Saving to ${outDir}`);
  let saved = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const base = row.url.split("?")[0];
    const ext = (base.match(/\.[a-z0-9]+$/i) || [row.media_type === "video" ? ".mp4" : ".jpg"])[0];
    const who = (row.uploader_name || "guest").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 40) || "guest";
    const date = new Date(row.created_at).toISOString().slice(0, 10);
    const dest = path.join(outDir, `${date}_${String(row.id).padStart(4, "0")}_${who}${ext}`);

    if (fs.existsSync(dest)) {
      skipped++;
      continue;
    }

    try {
      const res = await fetch(row.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      saved++;
      process.stdout.write(`\rSaved ${saved}  skipped ${skipped}  failed ${failed}  (${saved + skipped + failed}/${rows.length})`);
    } catch (err) {
      failed++;
      console.warn(`\nFailed to download #${row.id} (${row.url}): ${err.message}`);
    }
  }

  console.log(`\nDone. ${saved} saved, ${skipped} already present, ${failed} failed.\nArchive: ${outDir}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
