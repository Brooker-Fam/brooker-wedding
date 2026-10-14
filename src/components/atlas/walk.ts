/* Step through it (#/walk/<objection>): the grounded game over one objection,
   as a pure function.

   A move speaks and the reader answers. Going part by part (prong by prong
   in the code), `visit(n)` does this:
     - already judged      → shown with the reader's stamp; holds = IN, fails = OUT.
     - a leaf              → asks Does it hold?  [Holds] [Fails]
     - otherwise           → asks Reject it now, or see the reply first?  [It fails] / [Show the reply]
       After Show, its replies are visited in content order (strongest first):
         a reply ends IN   → n is OUT (answered because that reply stands),
                             and the reader may still check the remaining replies;
         every reply OUT   → n is IN  (stands because every reply to it fails).

   Only the reader's explicit calls are ever written as judgments. Everything
   the walk concludes about an inner move is *computed* (and matches the
   grounded labelling in semantics.ts), so the walk can never create a tension.

   `runWalk` is a pure replay: given the objection, the reader's judgments and
   the walk session (which moves they chose to hear, which results they have
   acknowledged), it returns the transcript so far and the prompt waiting for
   the reader. The component only dispatches session actions and judgments. */

import { labelObjection, type Judgments } from "./semantics";
import type { ArgNode, Judgment, Label, Objection } from "./types";

export type Resolved = "in" | "out";

/** What the reader has done in this walk, beyond the judgments themselves. */
export interface WalkSession {
  /** Inner moves where the reader chose Show the reply. */
  heard: string[];
  /** Moves whose remaining replies the reader chose to test after one already stood. */
  testAll: string[];
  /** Acknowledged stops: "r:<id>" for a resolution, "p:<prong>" for the end of a prong. */
  ack: string[];
  /** Moves the reader called during the walk. */
  called: string[];
  /** The prong at whose end the reader chose to stop (the objection already stood there);
      "*" = at any such stop. Cleared by any later step, so it can never skip a stop by itself. */
  finished: string | null;
}

export const EMPTY_SESSION: WalkSession = Object.freeze({ heard: [], testAll: [], ack: [], called: [], finished: null }) as WalkSession;

export type WalkAction =
  | { type: "hear"; id: string }
  /** `unhear`: the reader changed a heard move into a "fails" call. */
  | { type: "call"; id: string; unhear?: boolean }
  | { type: "uncall"; id: string }
  | { type: "test"; id: string }
  | { type: "ack"; key: string | string[] }
  | { type: "finish"; prong?: string }
  | { type: "unfinish"; key?: string }
  | { type: "reset" };

const add = (list: string[], v: string) => (list.includes(v) ? list : [...list, v]);
const del = (list: string[], v: string) => list.filter((x) => x !== v);

export function walkReduce(s: WalkSession, a: WalkAction): WalkSession {
  switch (a.type) {
    case "hear":
      return { ...s, heard: add(s.heard, a.id), finished: null };
    case "call":
      return { ...s, called: add(s.called, a.id), heard: a.unhear ? del(s.heard, a.id) : s.heard, finished: null };
    case "uncall":
      return { ...s, called: del(s.called, a.id), finished: null };
    case "test":
      return { ...s, testAll: add(s.testAll, a.id), ack: add(s.ack, `r:${a.id}`) };
    case "ack":
      return { ...s, ack: (Array.isArray(a.key) ? a.key : [a.key]).reduce(add, s.ack) };
    case "finish":
      return { ...s, finished: a.prong ?? "*" };
    case "unfinish":
      return { ...s, finished: null, ack: a.key ? add(s.ack, a.key) : s.ack };
    case "reset":
      return EMPTY_SESSION;
  }
}

/** Defensive parse of a stored session (storage can hold anything). An old boolean
    `finished` flag is dropped: it can't say where the reader stopped. */
export function sanitizeSession(raw: unknown): WalkSession {
  if (!raw || typeof raw !== "object") return EMPTY_SESSION;
  const r = raw as Record<string, unknown>;
  const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
  return {
    heard: list(r.heard),
    testAll: list(r.testAll),
    ack: list(r.ack),
    called: list(r.called),
    finished: typeof r.finished === "string" ? r.finished : null,
  };
}

export function sessionIsEmpty(s: WalkSession): boolean {
  return s.heard.length + s.testAll.length + s.ack.length + s.called.length === 0 && !s.finished;
}

/* ---------------- transcript ---------------- */

interface Where {
  id: string;
  /** Prong = 1. */
  depth: number;
  parent: string | null;
  /** Position among siblings (0-based) and sibling count. */
  index: number;
  count: number;
}

export type MoveRes =
  /** The reader heard the replies (auto = inferred on resume, from calls made further down). */
  | { r: "heard"; auto: boolean }
  /** The reader's call; `here` = made during this walk rather than earlier. */
  | { r: "judged"; j: Judgment; here: boolean };

export interface MoveItem extends Where {
  kind: "move";
  key: string;
  res: MoveRes;
  /** Number of replies (children). */
  replies: number;
}

export interface ResolveItem {
  kind: "resolve";
  key: string;
  id: string;
  depth: number;
  label: Resolved;
  /** For OUT: the reply that stands. */
  by: string | null;
  /** Replies left unheard because one already stood. */
  untested: string[];
  /** Number of replies the move has. */
  replies: number;
}

export type WalkItem = MoveItem | ResolveItem;

export interface WalkSection {
  prong: string;
  index: number;
  items: WalkItem[];
  /** How the prong came out; null while it is still being argued. */
  result: Resolved | null;
}

/** A prong (index) after the current one whose status the reader's earlier calls already fix. */
export interface Ahead {
  index: number;
  label: Resolved;
}

/** What the end-of-prong stop knows. */
export interface ProngEnd {
  prong: string;
  index: number;
  /** How this prong came out. */
  label: Resolved;
  /** The whole objection already stands, given the reader's calls (one prong standing is enough). */
  settled: boolean;
  /** Later prongs already decided by earlier calls (made on the objection's page, or earlier). */
  ahead: Ahead[];
  /** This is the last prong, or every later one is already decided: the next step is the end. */
  final: boolean;
}

export type WalkPrompt =
  /** A move waits for the reader: leaf → Holds / Fails; inner → It fails / Show the reply. */
  | ({ kind: "ask"; leaf: boolean; replies: number } & Where)
  /** A reply stood, so `id` is answered; the other replies are still unheard. For a prong,
      `end` describes the end-of-prong stop that would follow, so the two can be shown as one. */
  | { kind: "resolved"; id: string; depth: number; by: string; untested: string[]; end: ProngEnd | null }
  /** A prong is settled. */
  | ({ kind: "prong-end" } & ProngEnd)
  /** The walk is over. `unheard` = prongs skipped because the reader finished early;
      `decided` = prongs not walked because earlier calls had already decided them. */
  | { kind: "done"; unheard: number[]; decided: number[] }
  /** Nothing to argue (no prongs). */
  | { kind: "empty" };

export interface WalkRun {
  sections: WalkSection[];
  prompt: WalkPrompt;
  /** Index of the prong the walk is on. */
  at: number;
}

/** Replay the walk over one objection. Pure. */
export function runWalk(o: Objection, j: Judgments, s: WalkSession): WalkRun {
  const prongs = o.prongs ?? [];
  if (prongs.length === 0) return { sections: [], prompt: { kind: "empty" }, at: 0 };

  const heard = new Set(s.heard);
  const testAll = new Set(s.testAll);
  const ack = new Set(s.ack);
  const called = new Set(s.called);

  // The status of every move given the reader's calls (the walk's results agree with it).
  const labels = new Map<string, Label>();
  const objLabel = labelObjection(o, j, labels);

  // Resume: an unjudged inner move counts as heard when the reader has already
  // called something beneath it (here or on the objection's page).
  const judgedBelow = new Set<string>();
  const mark = (n: ArgNode): boolean => {
    let any = false;
    for (const c of n.children ?? []) if (mark(c) || j[c.id]) any = true;
    if (any) judgedBelow.add(n.id);
    return any;
  };
  prongs.forEach(mark);

  const sections: WalkSection[] = [];

  /** The stop after prong `pi` (which came out `label`). */
  const prongEnd = (pi: number, label: Resolved): ProngEnd => {
    const ahead: Ahead[] = [];
    for (let k = pi + 1; k < prongs.length; k++) {
      const l = labels.get(prongs[k].id);
      if (l === "in" || l === "out") ahead.push({ index: k, label: l });
    }
    const rest = prongs.length - pi - 1;
    return { prong: prongs[pi].id, index: pi, label, settled: objLabel === "in", ahead, final: rest === 0 || ahead.length === rest };
  };

  const out: { prompt: WalkPrompt | null } = { prompt: null };
  let items: WalkItem[] = [];
  let pi = 0;

  const visit = (n: ArgNode, w: Where): Resolved | null => {
    const kids = n.children ?? [];
    const judged = j[n.id];
    if (judged === "holds" || judged === "fails") {
      items.push({ kind: "move", key: `m:${n.id}`, ...w, replies: kids.length, res: { r: "judged", j: judged, here: called.has(n.id) } });
      return judged === "holds" ? "in" : "out";
    }
    const isHeard = heard.has(n.id) || judgedBelow.has(n.id);
    if (kids.length === 0 || !isHeard) {
      out.prompt = { kind: "ask", leaf: kids.length === 0, replies: kids.length, ...w };
      return null;
    }
    items.push({ kind: "move", key: `m:${n.id}`, ...w, replies: kids.length, res: { r: "heard", auto: !heard.has(n.id) } });

    let by: string | null = null;
    for (let i = 0; i < kids.length; i++) {
      const r = visit(kids[i], { id: kids[i].id, depth: w.depth + 1, parent: n.id, index: i, count: kids.length });
      if (r === null) return null;
      if (r === "in" && !by) {
        by = kids[i].id;
        const untested = kids.slice(i + 1).map((k) => k.id);
        if (untested.length > 0 && !testAll.has(n.id)) {
          if (!ack.has(`r:${n.id}`)) {
            out.prompt = { kind: "resolved", id: n.id, depth: w.depth, by, untested, end: w.depth === 1 ? prongEnd(pi, "out") : null };
            return null;
          }
          items.push({ kind: "resolve", key: `r:${n.id}`, id: n.id, depth: w.depth, label: "out", by, untested, replies: kids.length });
          return "out";
        }
      }
    }
    items.push({ kind: "resolve", key: `r:${n.id}`, id: n.id, depth: w.depth, label: by ? "out" : "in", by, untested: [], replies: kids.length });
    return by ? "out" : "in";
  };

  let at = 0;
  for (pi = 0; pi < prongs.length; pi++) {
    at = pi;
    const p = prongs[pi];
    items = [];
    const section: WalkSection = { prong: p.id, index: pi, items, result: null };
    sections.push(section);
    const r = visit(p, { id: p.id, depth: 1, parent: null, index: pi, count: prongs.length });
    if (r === null) break;
    section.result = r;
    if (pi === prongs.length - 1) break;
    if (ack.has(`p:${p.id}`)) continue;
    const end = prongEnd(pi, r);
    if (end.final) {
      // Every later prong is already decided by earlier calls: nothing left to argue.
      out.prompt = { kind: "done", unheard: [], decided: end.ahead.map((a) => a.index) };
      break;
    }
    // The objection stands if any prong stands: once one does, the rest are optional.
    if (end.settled && (s.finished === p.id || s.finished === "*")) {
      const later = prongs.slice(pi + 1).map((_, k) => pi + 1 + k);
      out.prompt = { kind: "done", unheard: later, decided: [] };
      break;
    }
    out.prompt = { kind: "prong-end", ...end };
    break;
  }

  return { sections, prompt: out.prompt ?? { kind: "done", unheard: [], decided: [] }, at };
}

/** Total transcript rows (used to tell which rows are new after an action). */
export function itemCount(run: WalkRun): number {
  return run.sections.reduce((s, sec) => s + sec.items.length, 0);
}

/* ---------------- why a prong came out as it did ---------------- */

/** Why a prong came out the way it did, given the reader's calls. */
export type ProngReason =
  | { kind: "judged"; j: Judgment }
  | { kind: "all-fail"; replies: number }
  | { kind: "reply"; by: string }
  | { kind: "open" };

export function prongReason(p: ArgNode, j: Judgments, labelOf: (id: string) => Label): ProngReason {
  const judged = j[p.id];
  if (judged) return { kind: "judged", j: judged };
  const l = labelOf(p.id);
  if (l === "in") return { kind: "all-fail", replies: (p.children ?? []).length };
  if (l === "out") {
    const kids = p.children ?? [];
    const by = kids.find((c) => j[c.id] === "holds" && labelOf(c.id) === "in") ?? kids.find((c) => labelOf(c.id) === "in");
    if (by) return { kind: "reply", by: by.id };
  }
  return { kind: "open" };
}
