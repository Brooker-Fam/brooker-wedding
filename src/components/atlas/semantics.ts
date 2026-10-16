/* Indexing and argumentation semantics for a Disputation.

   Labels use three-valued grounded semantics over each attack tree:
     judged "holds" → in;  judged "fails" → out;
     otherwise: no children → undec; any child in → out; all children out → in; else undec.
   An objection (a cluster of prongs) is in if any prong is in, out if all are out, else undec.

   Unjudged leaves are *undecided*, not winners: the last word in the tree is
   not the winning word, so the page never hands down a default verdict that
   only reflects who happened to speak last. */

import type {
  ArgNode,
  Disputation,
  Judgment,
  Label,
  Moment,
  Objection,
  ObjectionId,
  Term,
  Thinker,
} from "./types";

export interface NodeInfo {
  node: ArgNode;
  objection: ObjectionId;
  /** Id of the prong (tree root) this node belongs to. */
  prong: string;
  /** Parent node id; null for a prong. */
  parent: string | null;
  /** Prong = 1, a reply to it = 2, … ("round" of the disputation). */
  depth: number;
  /** Ids from the prong down to and including this node. */
  path: string[];
  childIds: string[];
  /** Position among siblings, 0-based. */
  order: number;
}

export interface DisputationIndex {
  d: Disputation;
  nodes: Map<string, NodeInfo>;
  /** All node ids of an objection in depth-first order. */
  byObjection: Map<ObjectionId, string[]>;
  objections: Map<ObjectionId, Objection>;
  thinkers: Map<string, Thinker>;
  terms: Map<string, Term>;
  moments: Map<string, Moment>;
  /** thinker id → node ids that cite them (field or inline). */
  thinkerRefs: Map<string, string[]>;
  /** term id → node ids that use it: inline [[markup]], or its name in plain text.
      Worked out on first access (only the Glossary and term peeks read it). */
  termRefs: Map<string, string[]>;
  /** node id → nodes whose `see` points at it. */
  backlinks: Map<string, { from: string; why: string }[]>;
  maxDepth: number;
}

const TERM_RE = /\[\[([a-z0-9-]+)(?:\|[^\]]*)?\]\]/g;
const THINKER_RE = /\{\{([a-z0-9-]+)(?:\|[^}]*)?\}\}/g;

/* A term's name as plain text: case-insensitive, whole words, an optional plural ending.
   A parenthetical is left out ("Negative (apophatic) theology" → "negative theology"), and
   an acronym inside one counts on its own ("HADD"). A name that is a single everyday word
   once its parenthetical goes ("Imagination (first kind of knowledge)") is matched only as
   markup, so ordinary uses of the word aren't counted.
   Prose is reduced to lowercase words separated by single spaces; a term is looked for only
   in moves that contain its first word (a set lookup), and then as a substring
   (" middle knowledge "). The whole index still builds in a few milliseconds. */
const NOT_WORD = /[^a-z0-9\u00c0-\u1fff\u2070-\uffff]+/g; // general punctuation (’ “ — …) separates words
const MARKUP_ID = /(\[\[|\{\{|\(\()[a-z0-9-]+\|?/g; // [[id|  {{id|  ((id|  — keep only the shown text
const norm = (s: string) => s.toLowerCase().replace(NOT_WORD, " ").trim();
interface TermKey {
  id: string;
  /** The words the first word may appear as (a one-word name also in its plural forms). */
  heads: string[];
  /** " name ", " names ", … in normalised form; null for a one-word name (the head is enough). */
  forms: string[] | null;
}
function plurals(w: string): string[] {
  const out = [w, `${w}s`, `${w}es`];
  if (/[^aeiou]y$/.test(w)) out.push(`${w.slice(0, -1)}ies`);
  return out;
}
function termKeys(t: Term): TermKey[] {
  const out: TermKey[] = [];
  const add = (name: string) => {
    const w = norm(name);
    if (!w) return;
    const parts = w.split(" ");
    out.push(parts.length === 1 ? { id: t.id, heads: plurals(w), forms: null } : { id: t.id, heads: [parts[0]], forms: plurals(w).map((f) => ` ${f} `) });
  };
  const paren = /\(([^)]*)\)/.exec(t.term);
  const bare = t.term.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  if (!paren || bare.includes(" ")) add(bare);
  if (paren && /^[A-Z]{2,}$/.test(paren[1].trim())) add(paren[1].trim());
  return out;
}

function collect(re: RegExp, text: string, into: Set<string>) {
  for (const m of text.matchAll(re)) into.add(m[1]);
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V) {
  const list = map.get(key);
  if (list) {
    if (!list.includes(value)) list.push(value);
  } else map.set(key, [value]);
}

export function buildIndex(d: Disputation): DisputationIndex {
  const nodes = new Map<string, NodeInfo>();
  const byObjection = new Map<ObjectionId, string[]>();
  const thinkerRefs = new Map<string, string[]>();
  const all: ArgNode[] = [];
  const backlinks = new Map<string, { from: string; why: string }[]>();
  let maxDepth = 0;

  for (const o of d.objections) {
    const order: string[] = [];
    const walk = (n: ArgNode, parent: string | null, path: string[], idx: number, prong: string) => {
      const p = [...path, n.id];
      nodes.set(n.id, {
        node: n,
        objection: o.id,
        prong,
        parent,
        depth: p.length,
        path: p,
        childIds: (n.children ?? []).map((c) => c.id),
        order: idx,
      });
      maxDepth = Math.max(maxDepth, p.length);
      order.push(n.id);
      all.push(n);

      const thinkers = new Set(n.thinkers ?? []);
      for (const text of [n.gist, ...n.body, n.cedes ?? ""]) collect(THINKER_RE, text, thinkers);
      thinkers.forEach((t) => push(thinkerRefs, t, n.id));
      (n.children ?? []).forEach((c, i) => walk(c, n.id, p, i, prong));
    };
    o.prongs.forEach((pr, i) => walk(pr, null, [], i, pr.id));
    byObjection.set(o.id, order);
  }

  for (const info of nodes.values()) {
    for (const s of info.node.see ?? []) push(backlinks, s.id, { from: info.node.id, why: s.why });
  }

  let termRefs: Map<string, string[]> | null = null;
  return {
    d,
    nodes,
    byObjection,
    objections: new Map(d.objections.map((o) => [o.id, o])),
    thinkers: new Map(d.thinkers.map((t) => [t.id, t])),
    terms: new Map(d.terms.map((t) => [t.id, t])),
    moments: new Map(d.moments.map((m) => [m.id, m])),
    thinkerRefs,
    get termRefs() {
      return (termRefs ??= buildTermRefs(d.terms, all));
    },
    backlinks,
    maxDepth,
  };
}

/** term id → node ids (in reading order) that link it or name it in plain words, so "Used in"
    counts every move where the concept does work, on either side, not only the ones that link it. */
function buildTermRefs(terms: Term[], nodes: ArgNode[]): Map<string, string[]> {
  const byHead = new Map<string, TermKey[]>();
  for (const k of terms.flatMap(termKeys)) for (const h of k.heads) byHead.set(h, [...(byHead.get(h) ?? []), k]);
  const refs = new Map<string, string[]>();
  for (const n of nodes) {
    const found = new Set<string>();
    for (const text of [n.gist, ...n.body, n.cedes ?? ""]) collect(TERM_RE, text, found);
    const prose = ` ${norm([n.label, n.gist, ...n.body, n.cedes ?? ""].join(" ").replace(MARKUP_ID, " "))} `;
    for (const w of new Set(prose.split(" "))) {
      for (const k of byHead.get(w) ?? []) {
        if (!found.has(k.id) && (!k.forms || k.forms.some((f) => prose.includes(f)))) found.add(k.id);
      }
    }
    found.forEach((t) => push(refs, t, n.id));
  }
  return refs;
}

/* ---------------- labelling ---------------- */

export type Judgments = Record<string, Judgment>;

export interface Labelling {
  node: Map<string, Label>;
  objection: Map<ObjectionId, Label>;
}

function labelTree(n: ArgNode, j: Judgments, out: Map<string, Label>): Label {
  const kids = (n.children ?? []).map((c) => labelTree(c, j, out));
  let l: Label;
  const judged = j[n.id];
  if (judged === "holds") l = "in";
  else if (judged === "fails") l = "out";
  else if (kids.length === 0) l = "undec";
  else if (kids.includes("in")) l = "out";
  else if (kids.every((k) => k === "out")) l = "in";
  else l = "undec";
  out.set(n.id, l);
  return l;
}

/** OR over prongs: in if any is in, out if all are out. */
export function clusterLabel(labels: Label[]): Label {
  if (labels.includes("in")) return "in";
  if (labels.length > 0 && labels.every((l) => l === "out")) return "out";
  return "undec";
}

export function labelObjection(o: Objection, j: Judgments, into?: Map<string, Label>): Label {
  const out = into ?? new Map<string, Label>();
  return clusterLabel(o.prongs.map((p) => labelTree(p, j, out)));
}

export function labelAll(d: Disputation, j: Judgments): Labelling {
  const node = new Map<string, Label>();
  const objection = new Map<ObjectionId, Label>();
  for (const o of d.objections) objection.set(o.id, labelObjection(o, j, node));
  return { node, objection };
}

/* ---------------- tensions ---------------- */

export interface Tension {
  /** The node the reader said holds… */
  node: string;
  /** …and a reply to it that, by the reader's own other calls, also stands. */
  reply: string;
}

/** A claim judged "holds" while one of its attackers is labelled in. One of them has to give. */
export function findTensions(ix: DisputationIndex, j: Judgments, labels: Labelling): Tension[] {
  const out: Tension[] = [];
  for (const [id, judgment] of Object.entries(j)) {
    if (judgment !== "holds") continue;
    const info = ix.nodes.get(id);
    if (!info) continue;
    for (const c of info.childIds) if (labels.node.get(c) === "in") out.push({ node: id, reply: c });
  }
  return out;
}

/* ---------------- analysis for the ledger ---------------- */

export interface ObjectionAnalysis {
  id: ObjectionId;
  label: Label;
  judged: number;
  total: number;
  /** Judgments that, if withdrawn, would change the objection's label. */
  loadBearing: string[];
  /** Unjudged nodes where "holds" and "fails" would settle the objection opposite ways. */
  pivots: string[];
  /** Unjudged nodes where at least one call would settle the objection. */
  levers: string[];
  /** Follow undecided labels down to the first leaf that still needs a call. */
  next: string | null;
}

export function analyzeObjection(ix: DisputationIndex, o: Objection, j: Judgments): ObjectionAnalysis {
  const ids = ix.byObjection.get(o.id) ?? [];
  const nodeLabels = new Map<string, Label>();
  const label = labelObjection(o, j, nodeLabels);
  const judgedIds = ids.filter((id) => j[id]);

  const loadBearing: string[] = [];
  if (label !== "undec") {
    for (const id of judgedIds) {
      const without = { ...j };
      delete without[id];
      if (labelObjection(o, without) !== label) loadBearing.push(id);
    }
  }

  const pivots: string[] = [];
  const levers: string[] = [];
  if (label === "undec") {
    for (const id of ids) {
      if (j[id]) continue;
      const a = labelObjection(o, { ...j, [id]: "holds" });
      const b = labelObjection(o, { ...j, [id]: "fails" });
      if (a !== "undec" && b !== "undec" && a !== b) pivots.push(id);
      else if (a !== "undec" || b !== "undec") levers.push(id);
    }
  }

  let next: string | null = null;
  if (label === "undec") {
    const descend = (id: string): string | null => {
      const info = ix.nodes.get(id)!;
      if (nodeLabels.get(id) !== "undec") return null;
      if (info.childIds.length === 0) return j[id] ? null : id;
      for (const c of info.childIds) {
        const hit = descend(c);
        if (hit) return hit;
      }
      return null;
    };
    for (const p of o.prongs) {
      next = descend(p.id);
      if (next) break;
    }
  }

  return { id: o.id, label, judged: judgedIds.length, total: ids.length, loadBearing, pivots, levers, next };
}

/* ---------------- helpers ---------------- */

/** Which team a node plays for in its tree: the prong's side, or the opposing one. */
export function team(ix: DisputationIndex, id: string): "objection" | "reply" {
  const info = ix.nodes.get(id);
  return info && info.depth % 2 === 1 ? "objection" : "reply";
}

export function leaves(ix: DisputationIndex, o: ObjectionId): string[] {
  return (ix.byObjection.get(o) ?? []).filter((id) => ix.nodes.get(id)!.childIds.length === 0);
}

export function subtreeSize(n: ArgNode): number {
  return 1 + (n.children ?? []).reduce((s, c) => s + subtreeSize(c), 0);
}
