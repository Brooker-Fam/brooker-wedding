import { idParam, json, withMember } from "@/lib/maple/api";
import { restoreEntry, toClientEntry } from "@/lib/maple/store";

export const dynamic = "force-dynamic";

/** POST /api/maple/entries/restore?id= — undo a delete. */
export const POST = withMember("POST /api/maple/entries/restore", async (request, me) => {
  const entry = await restoreEntry(idParam(request), me.email);
  return json({ entry: toClientEntry(entry) });
}, { write: true });
