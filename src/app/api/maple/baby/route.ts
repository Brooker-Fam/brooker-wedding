import { BadRequest, json, readJson, withMember } from "@/lib/maple/api";
import { getBaby, updateBaby, type BabyPatch } from "@/lib/maple/store";
import { isDayKey } from "@/lib/maple/time";

export const dynamic = "force-dynamic";

function num(v: unknown, label: string, min: number, max: number): number | null {
  if (v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) throw new BadRequest(`${label} looks off`);
  return n;
}

/**
 * PATCH /api/maple/baby — profile edits and the big one: "She's here!"
 * (born_at + birth measurements). Any family member can update it.
 */
export const PATCH = withMember("PATCH /api/maple/baby", async (request) => {
  const body = await readJson<Record<string, unknown>>(request);
  const baby = await getBaby();
  const patch: BabyPatch = {};

  if ("name" in body) {
    const name = String(body.name ?? "").trim();
    if (!name || name.length > 80) throw new BadRequest("Name is required");
    patch.name = name;
  }
  if ("nickname" in body) {
    const nick = String(body.nickname ?? "").trim();
    patch.nickname = nick ? nick.slice(0, 40) : null;
  }
  if ("due_date" in body) {
    if (body.due_date !== null && !isDayKey(body.due_date)) throw new BadRequest("due_date must be YYYY-MM-DD");
    patch.due_date = body.due_date as string | null;
  }
  if ("born_at" in body) {
    if (body.born_at === null) patch.born_at = null;
    else {
      const t = typeof body.born_at === "string" ? Date.parse(body.born_at) : NaN;
      if (Number.isNaN(t)) throw new BadRequest("born_at must be an ISO timestamp");
      if (t > Date.now() + 10 * 60_000) throw new BadRequest("Birth time is in the future");
      patch.born_at = new Date(t).toISOString();
    }
  }
  if ("birth_weight_g" in body) patch.birth_weight_g = num(body.birth_weight_g, "Birth weight", 400, 7000);
  if ("birth_length_cm" in body) patch.birth_length_cm = num(body.birth_length_cm, "Birth length", 25, 65);
  if ("birth_head_cm" in body) patch.birth_head_cm = num(body.birth_head_cm, "Head circumference", 20, 45);
  if ("settings" in body) {
    if (!body.settings || typeof body.settings !== "object" || Array.isArray(body.settings)) {
      throw new BadRequest("settings must be an object");
    }
    const incoming = body.settings as Record<string, unknown>;
    const merged: Record<string, unknown> = { ...baby.settings, ...incoming };
    // Both parents may mark different alerts handled at once: merge, don't replace.
    if (incoming.acks && typeof incoming.acks === "object") {
      merged.acks = { ...((baby.settings.acks as Record<string, unknown>) ?? {}), ...(incoming.acks as Record<string, unknown>) };
    }
    for (const [k, v] of Object.entries(incoming)) if (v === null) delete merged[k];
    if (JSON.stringify(merged).length > 8000) throw new BadRequest("settings too large");
    patch.settings = merged;
  }

  return json({ baby: await updateBaby(baby.id, patch) });
}, { write: true });
