/* The reader's determination: one templated sentence per objection that says
   what follows from their calls — and never more than that.

   In a medieval disputation the master closed the question with a
   *determinatio*. Here the reader is the master, so every sentence is
   phrased "on your calls": it reports which of the reader's own calls a
   status turns on (or which blank move would settle it), not a verdict of
   the page. Pure functions only — usable from any view (the ledger, the
   walk's end-of-objection card) and from tests. */

import { plain } from "./markup";
import { analyzeObjection, labelObjection, type DisputationIndex, type Judgments, type ObjectionAnalysis, type Tension } from "./semantics";
import type { Disputation, Judgment, Label, Objection, ObjectionId } from "./types";

export type DeterminationKind = "stands" | "answered" | "undecided" | "unruled";

export interface Determination {
  o: ObjectionId;
  numeral: string;
  label: Label;
  kind: DeterminationKind;
  /** The node the sentence names (a load-bearing call, or a blank but decisive move). */
  focus: string | null;
  /** The reader's call on `focus`, when it is a call. */
  call: Judgment | null;
  /** True when no single call carries a settled status (several footings). */
  overdetermined: boolean;
  /** Second person, plain text: "Stands for you. It turns on “…”, which you granted." */
  sentence: string;
  /** First person, for the copied text: "It stands. It turns on “…”, which I granted." */
  firstPerson: string;
  /** `sentence` split for display: a status headline, then the text around the focus label
      (so a view can render the label as a link). sentence = head + " " + pre + “label” + post. */
  parts: { head: string; pre: string; post: string };
  /** Settled: the other calls this status rests on. */
  also: string[];
  /** Undecided: up to three more blank moves where one call would settle it. */
  decisive: string[];
  /** How many of the objection's moves the reader has called, out of how many. */
  called: number;
  total: number;
}

export interface Crux {
  id: string;
  o: ObjectionId;
  numeral: string;
  call: Judgment;
  /** The objection's status now, and if this one call went the other way. */
  now: Label;
  ifWrong: Label;
  /** How many calls the objection's status rests on, this one included (1 = it all rests here). */
  company: number;
}

/* ---------------- small helpers ---------------- */

/** Objection-level status words (moves use Stands / Answered / Open). */
export const OBJECTION_STATUS: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Undecided" };
/** What an objection would do if a call flipped: "If you’re wrong, Objection II …". */
export const IF_WRONG: Record<Label, string> = { in: "would stand", out: "would be answered", undec: "reopens" };

const q = (s: string) => `“${s}”`;
const verbYou = (c: Judgment) => (c === "holds" ? "granted" : "rejected");

function labelText(ix: DisputationIndex, id: string, toPlain?: (s: string) => string): string {
  const raw = ix.nodes.get(id)?.node.label ?? id;
  const t = (toPlain ?? ((s: string) => plain(s)))(raw).trim();
  return t.replace(/[.。]+$/, "");
}

/** Sort node ids shallowest first, then in reading (depth-first) order. */
export function byFrontier(ix: DisputationIndex, ids: string[], deepestFirst = false): string[] {
  // One global reading order: objection by objection, depth-first within each.
  const order = new Map<string, number>();
  let k = 0;
  for (const list of ix.byObjection.values()) for (const id of list) order.set(id, k++);
  return [...ids].sort((a, b) => {
    const da = ix.nodes.get(a)?.depth ?? 0;
    const db = ix.nodes.get(b)?.depth ?? 0;
    if (da !== db) return deepestFirst ? db - da : da - db;
    return (order.get(a) ?? 0) - (order.get(b) ?? 0);
  });
}

/** The judged nodes that ground a node's computed label (empty for undecided). */
function support(ix: DisputationIndex, id: string, j: Judgments, labels: Map<string, Label>, seen = new Set<string>()): string[] {
  if (seen.has(id)) return [];
  seen.add(id);
  if (j[id]) return [id];
  const info = ix.nodes.get(id);
  const l = labels.get(id);
  if (!info || !l || l === "undec") return [];
  if (l === "out") {
    // Answered because some reply stands: follow the first standing reply (prefer one the reader granted).
    const standing = info.childIds.filter((c) => labels.get(c) === "in");
    const pick = standing.find((c) => j[c] === "holds") ?? standing[0];
    return pick ? support(ix, pick, j, labels, seen) : [];
  }
  // Stands because every reply fails: all of them are footings.
  return info.childIds.flatMap((c) => support(ix, c, j, labels, seen));
}

const uniq = (xs: string[]) => [...new Set(xs)];

/* ---------------- the determination ---------------- */

export function determine(
  ix: DisputationIndex,
  o: Objection,
  j: Judgments,
  analysis?: ObjectionAnalysis,
  toPlain?: (s: string) => string,
): Determination {
  const a = analysis ?? analyzeObjection(ix, o, j);
  const nodeLabels = new Map<string, Label>();
  const label = labelObjection(o, j, nodeLabels);
  const ids = ix.byObjection.get(o.id) ?? [];
  const called = ids.filter((id) => j[id]).length;
  const total = ids.length;
  const L = (id: string) => labelText(ix, id, toPlain);

  const base = { o: o.id, numeral: o.numeral, label, called, total };

  if (label === "undec") {
    if (called === 0) {
      const moves = total === 1 ? "its one move" : `any of its ${total} moves`;
      const rest = total === 0 ? "There is nothing here to rule on yet." : `You haven’t ruled on ${moves} yet.`;
      const sentence = `Undecided. ${rest}`;
      return {
        ...base,
        kind: "unruled",
        focus: null,
        call: null,
        overdetermined: false,
        sentence,
        firstPerson: total === 0 ? "It remains undecided; there is nothing here to rule on yet." : "It remains undecided. I have not ruled on it yet.",
        parts: { head: "Undecided.", pre: rest, post: "" },
        also: [],
        decisive: [],
      };
    }
    // Prefer moves at the open frontier (deepest first). A call on a prong
    // "settles" everything only by overruling the whole tree beneath it, so
    // prongs come last: they are true but uninformative.
    const isProng = (id: string) => (ix.nodes.get(id)?.depth ?? 1) === 1;
    const pivots = byFrontier(ix, a.pivots, true);
    const levers = byFrontier(ix, a.levers, true);
    const deepPivots = pivots.filter((id) => !isProng(id));
    const deepLevers = levers.filter((id) => !isProng(id));
    let focus: string | null = null;
    let mode: "pivot" | "lever" | "next" = "next";
    if (a.next && deepPivots.includes(a.next)) [focus, mode] = [a.next, "pivot"];
    else if (deepPivots.length) [focus, mode] = [deepPivots[0], "pivot"];
    else if (a.next && deepLevers.includes(a.next)) [focus, mode] = [a.next, "lever"];
    else if (deepLevers.length) [focus, mode] = [deepLevers[0], "lever"];
    else if (a.next && !isProng(a.next)) [focus, mode] = [a.next, "next"];
    else if (pivots.length) [focus, mode] = [pivots[0], "pivot"];
    else if (levers.length) [focus, mode] = [levers[0], "lever"];
    else if (a.next) [focus, mode] = [a.next, "next"];

    // Up to three more, from different branches (one per line of descent);
    // prongs are left out for the same reason as above.
    const sameLine = (x: string, y: string) => !!ix.nodes.get(x)?.path.includes(y) || !!ix.nodes.get(y)?.path.includes(x);
    const decisive: string[] = [];
    for (const id of uniq([...deepPivots, ...deepLevers])) {
      if (decisive.length >= 3) break;
      if (id === focus || (focus && sameLine(id, focus)) || decisive.some((x) => sameLine(x, id))) continue;
      decisive.push(id);
    }
    if (!focus) {
      const rest = "Nothing here yet turns on a single call.";
      return { ...base, kind: "undecided", focus, call: null, overdetermined: false, sentence: `Undecided. ${rest}`, firstPerson: "It remains undecided.", parts: { head: "Undecided.", pre: rest, post: "" }, also: [], decisive };
    }
    const t = q(L(focus));
    const head = "Undecided.";
    const [pre, post, fp] =
      mode === "pivot"
        ? ["A call on ", " would settle it.", `It remains undecided. A call on ${t} would settle it.`]
        : mode === "lever"
          ? ["A call on ", " could settle it.", `It remains undecided. A call on ${t} could settle it.`]
          : ["It waits on ", ", the next open move.", `It remains undecided. It waits on ${t}, the next open move.`];
    return {
      ...base,
      kind: "undecided",
      focus,
      call: null,
      overdetermined: false,
      sentence: `${head} ${pre}${t}${post}`,
      firstPerson: fp,
      parts: { head, pre, post },
      also: [],
      decisive,
    };
  }

  // Settled: name the call it turns on.
  const lb = byFrontier(ix, a.loadBearing);
  let footing = lb;
  let overdetermined = false;
  if (footing.length === 0) {
    // No single call carries it: find the calls it rests on anyway.
    overdetermined = true;
    const prongs = o.prongs.map((p) => p.id);
    // Stands: every standing prong is a footing. Answered: every prong had to fall.
    const grounds = prongs.filter((p) => label === "out" || nodeLabels.get(p) === "in").flatMap((p) => support(ix, p, j, nodeLabels));
    footing = byFrontier(ix, uniq(grounds));
  }
  const focus = footing[0] ?? null;
  const call = focus ? (j[focus] ?? null) : null;
  const also = footing.slice(1);
  const kind: DeterminationKind = label === "in" ? "stands" : "answered";

  if (!focus || !call) {
    const head = kind === "stands" ? "Stands for you." : "Answered for you.";
    return { ...base, kind, focus: null, call: null, overdetermined, sentence: head, firstPerson: kind === "stands" ? "It stands." : "It is answered.", parts: { head, pre: "", post: "" }, also, decisive: [] };
  }

  const t = q(L(focus));
  const v = verbYou(call);
  // Every status line ends in a full stop, so a line break after it never strands a comma.
  const head = kind === "stands" ? "Stands for you." : "Answered for you.";
  const it = kind === "stands" ? "It stands." : "It is answered.";
  let pre: string, post: string, fp: string;
  if (overdetermined) {
    [pre, post] = ["It rests on more than one footing — among them ", `, which you ${v}.`];
    fp = `${it} It rests on more than one footing — among them ${t}, which I ${v}.`;
  } else if (kind === "stands") {
    [pre, post] = ["It turns on ", `, which you ${v}.`];
    fp = `${it} It turns on ${t}, which I ${v}.`;
  } else if (call === "holds") {
    [pre, post] = ["You granted ", ", which answers it."];
    fp = `${it} I granted ${t}, which answers it.`;
  } else {
    [pre, post] = ["You rejected ", ", which settles it."];
    fp = `${it} I rejected ${t}, which settles it.`;
  }
  return { ...base, kind, focus, call, overdetermined, sentence: `${head} ${pre}${t}${post}`, firstPerson: fp, parts: { head, pre, post }, also, decisive: [] };
}

export function determineAll(
  ix: DisputationIndex,
  d: Disputation,
  j: Judgments,
  analysis?: Map<ObjectionId, ObjectionAnalysis>,
  toPlain?: (s: string) => string,
): Determination[] {
  return d.objections.map((o) => determine(ix, o, j, analysis?.get(o.id), toPlain));
}

/* ---------------- the crux ---------------- */

/** The judged move your determination most rests on: a load-bearing call (each move belongs to one
    objection, so it carries exactly one status), shallowest first, then the one that carries its
    objection most nearly alone, then reading order. Null if nothing is settled. */
export function findCrux(ix: DisputationIndex, d: Disputation, j: Judgments, analysis?: Map<ObjectionId, ObjectionAnalysis>): Crux | null {
  const company = new Map<string, number>();
  for (const o of d.objections) {
    const a = analysis?.get(o.id) ?? analyzeObjection(ix, o, j);
    if (a.label === "undec") continue;
    const lb = a.loadBearing.filter((id) => j[id]);
    for (const id of lb) company.set(id, lb.length);
  }
  if (company.size === 0) return null;
  const order = byFrontier(ix, [...company.keys()]);
  const rank = new Map(order.map((id, i) => [id, i]));
  const best = [...company.keys()].sort(
    (a, b) =>
      (ix.nodes.get(a)?.depth ?? 0) - (ix.nodes.get(b)?.depth ?? 0) ||
      (company.get(a) ?? 0) - (company.get(b) ?? 0) ||
      (rank.get(a) ?? 0) - (rank.get(b) ?? 0),
  )[0];
  const info = ix.nodes.get(best)!;
  const o = ix.objections.get(info.objection)!;
  const call = j[best]!;
  const flipped: Judgments = { ...j, [best]: call === "holds" ? "fails" : "holds" };
  return {
    id: best,
    o: o.id,
    numeral: o.numeral,
    call,
    now: labelObjection(o, j),
    ifWrong: labelObjection(o, flipped),
    company: company.get(best) ?? 1,
  };
}

/* ---------------- plain-text export ---------------- */

const PROPER = new Set(["God", "God's", "Christ", "Jesus", "Christian", "Christianity", "Spinoza", "Spinoza's", "Scripture", "Gospels", "I"]);

const INTERROGATIVE = /^(why|how|what|who|whom|whose|where|when|which|is|are|was|were|does|do|did|can|could|would|will|should|shall|may|might|must|has|have|had)\b/i;

/** "The idea of God doesn't hold together" → "Whether the idea of God holds together".
    A title that is already a question ("Why would God hide?") is not rewritten: the objection's
    own `question` is used if given, else the title as it stands. */
export function whetherForm(title: string, question?: string): string {
  const raw = title.trim();
  if (!raw) return "";
  if (/^whether\b/i.test(raw)) return raw.replace(/[.!]+$/, "");
  if (/\?$/.test(raw) || INTERROGATIVE.test(raw)) {
    const qn = question?.trim();
    return qn || raw;
  }
  let t = raw.replace(/[.?!]+$/, "");
  const thirdPerson = (verb: string) =>
    /(s|sh|ch|x|z|o)$/.test(verb) ? `${verb}es` : /[^aeiou]y$/.test(verb) ? `${verb.slice(0, -1)}ies` : verb === "have" ? "has" : `${verb}s`;
  t = t
    .replace(/\b(doesn[’']t|does not) (\w+)/i, (_, __, v: string) => thirdPerson(v))
    .replace(/\b(don[’']t|do not) (\w+)/i, (_, __, v: string) => v)
    .replace(/\b(wouldn[’']t|would not)\b/i, "would")
    .replace(/\b(couldn[’']t|could not)\b/i, "could")
    .replace(/\b(can[’']t|cannot|can not)\b/i, "can")
    .replace(/\b(won[’']t|will not)\b/i, "will")
    .replace(/\b(isn[’']t|is not)\b/i, "is")
    .replace(/\b(aren[’']t|are not)\b/i, "are");
  const [first, ...rest] = t.split(" ");
  const keep = PROPER.has(first) || /^[A-Z]{2,}/.test(first);
  return `Whether ${keep ? first : first.charAt(0).toLowerCase() + first.slice(1)}${rest.length ? " " + rest.join(" ") : ""}`;
}

/** End a heading with a full stop unless it already ends in punctuation. */
const stop = (s: string) => (/[.?!…]$/.test(s) ? s : `${s}.`);

export function determinationText(
  ix: DisputationIndex,
  d: Disputation,
  j: Judgments,
  opts: { analysis?: Map<ObjectionId, ObjectionAnalysis>; toPlain?: (s: string) => string; tensions?: Tension[]; url?: string } = {},
): string {
  const P = opts.toPlain ?? ((s: string) => plain(s));
  const dets = determineAll(ix, d, j, opts.analysis, opts.toPlain);
  const lines: string[] = [];
  lines.push(`MY DETERMINATION — ${d.title}`);
  if (d.subtitle) lines.push(P(d.subtitle));
  lines.push("");
  d.objections.forEach((o, i) => {
    const det = dets[i];
    const head = whetherForm(P(o.title ?? ""), o.question ? P(o.question) : undefined) || P(o.short ?? "") || o.id;
    lines.push(`Objection ${o.numeral}. ${stop(head)}`);
    if (o.objection?.trim()) lines.push(`It seems that: ${P(o.objection).trim()}`);
    if (o.counter?.trim()) lines.push(`On the contrary: ${P(o.counter).trim()}`);
    lines.push(`I answer that, on my calls: ${det.firstPerson}`);
    lines.push("");
  });
  for (const t of opts.tensions ?? []) {
    lines.push(`Unresolved: I said ${q(labelText(ix, t.node, opts.toPlain))} holds, yet by my other calls a reply to it — ${q(labelText(ix, t.reply, opts.toPlain))} — stands. One of them has to give.`);
  }
  if (opts.tensions?.length) lines.push("");
  lines.push("Nothing above is the page’s verdict — only what follows from my calls.");
  if (opts.url) lines.push(opts.url);
  return lines.join("\n");
}
