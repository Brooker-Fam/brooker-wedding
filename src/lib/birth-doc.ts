/**
 * Shared document model for the birth plan tool at /birth.
 *
 * The document is a last-write-wins map: { section: { field: { v, t } } }.
 * Merging per field (rather than per document) is what lets Britt mark one
 * thing on her phone while Matt marks another on his, with both surviving.
 */

export type Leaf = { v: unknown; t: number };
export type Doc = Record<string, Record<string, Leaf>>;

export const KEY_RE = /^[A-Za-z0-9_-]{16,64}$/;
export const MAX_BYTES = 256 * 1024;
const MAX_SECTIONS = 24;
const MAX_FIELDS = 2000;

function isLeaf(x: unknown): x is Leaf {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;
  const t = (x as Leaf).t;
  return typeof t === "number" && Number.isFinite(t) && "v" in (x as object);
}

/** Validates shape and returns a clean copy. Throws with a reason if invalid. */
export function clean(input: unknown): Doc {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("doc must be an object");
  }
  const sections = Object.keys(input as object);
  if (sections.length > MAX_SECTIONS) throw new Error("too many sections");

  const out: Doc = {};
  let fields = 0;
  for (const s of sections) {
    const sec = (input as Record<string, unknown>)[s];
    if (!sec || typeof sec !== "object" || Array.isArray(sec)) {
      throw new Error(`section "${s}" must be an object`);
    }
    out[s] = {};
    for (const [k, leaf] of Object.entries(sec as Record<string, unknown>)) {
      if (!isLeaf(leaf)) throw new Error(`field "${s}.${k}" must be {v,t}`);
      if (++fields > MAX_FIELDS) throw new Error("too many fields");
      out[s][k] = { v: leaf.v, t: leaf.t };
    }
  }
  return out;
}

/** Per-field last-write-wins. Ties go to `b`, the incoming write. */
export function merge(a: Doc, b: Doc): Doc {
  const out: Doc = {};
  for (const s of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const sa = a[s] || {};
    const sb = b[s] || {};
    out[s] = {};
    for (const k of new Set([...Object.keys(sa), ...Object.keys(sb)])) {
      const la = sa[k];
      const lb = sb[k];
      out[s][k] = !la ? lb : !lb ? la : lb.t >= la.t ? lb : la;
    }
  }
  return out;
}

export function keyFrom(raw: string | null | undefined): string | null {
  const k = (raw || "").trim();
  return KEY_RE.test(k) ? k : null;
}
