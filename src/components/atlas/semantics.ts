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
  /** term id → node ids that use it inline. */
  termRefs: Map<string, string[]>;
  /** node id → nodes whose `see` points at it. */
  backlinks: Map<string, { from: string; why: string }[]>;
  maxDepth: number;
}

const TERM_RE = /\[\[([a-z0-9-]+)(?:\|[^\]]*)?\]\]/g;
const THINKER_RE = /\{\{([a-z0-9-]+)(?:\|[^}]*)?\}\}/g;

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
  const termRefs = new Map<string, string[]>();
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

      const thinkers = new Set(n.thinkers ?? []);
      const terms = new Set<string>();
      for (const text of [n.gist, ...n.body, n.cedes ?? ""]) {
        collect(THINKER_RE, text, thinkers);
        collect(TERM_RE, text, terms);
      }
      thinkers.forEach((t) => push(thinkerRefs, t, n.id));
      terms.forEach((t) => push(termRefs, t, n.id));
      (n.children ?? []).forEach((c, i) => walk(c, n.id, p, i, prong));
    };
    o.prongs.forEach((pr, i) => walk(pr, null, [], i, pr.id));
    byObjection.set(o.id, order);
  }

  for (const info of nodes.values()) {
    for (const s of info.node.see ?? []) push(backlinks, s.id, { from: info.node.id, why: s.why });
  }

  return {
    d,
    nodes,
    byObjection,
    objections: new Map(d.objections.map((o) => [o.id, o])),
    thinkers: new Map(d.thinkers.map((t) => [t.id, t])),
    terms: new Map(d.terms.map((t) => [t.id, t])),
    moments: new Map(d.moments.map((m) => [m.id, m])),
    thinkerRefs,
    termRefs,
    backlinks,
    maxDepth,
  };
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
