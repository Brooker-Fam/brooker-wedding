/* The Long Conversation (#/play): the rules of the chronology game. A round
   deals moments spread across the whole history. One from the middle starts
   face up on the line; the reader places each of the rest in a gap between
   cards already there. A card placed wrong goes to the nearest gap where it
   belongs, so the line is always in order. The view is views/Play.tsx. */

import type { Moment } from "./types";

export const HAND = 8;

export interface Result {
  /** Gaps between the reader's guess and the nearest right one (0 = right). */
  off: number;
  /** Where the card really goes, relative to the guess. */
  dir: "earlier" | "later" | null;
  /** The guessed gap, counted in the line after the card went in. */
  guess: number;
}

export interface Round {
  /** The card dealt face up to start the line. */
  anchor: string;
  /** The cards to place, in the order they are dealt. */
  deck: string[];
  /** Placed cards, oldest first. */
  line: string[];
  results: Record<string, Result>;
  /** Index into `deck` of the card in hand; `deck.length` once the round is over. */
  turn: number;
  /** The card just placed, while its story is open. */
  placed: string | null;
}

const pick = <T>(xs: T[], rand: () => number): T => xs[Math.floor(rand() * xs.length)];

function shuffle<T>(xs: T[], rand: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One card from each of `hand + 1` equal slices of the history, so every round spans all of it. No two cards share
    a year, and a person comes up twice only when a slice has nobody new. */
export function deal(moments: Moment[], rand: () => number = Math.random, hand = HAND): Round {
  const sorted = [...moments].sort((a, b) => a.year - b.year);
  const n = Math.min(hand + 1, sorted.length);
  if (!n) return { anchor: "", deck: [], line: [], results: {}, turn: 0, placed: null };
  const years = new Set<number>();
  const people = new Set<string>();
  const picks: Moment[] = [];
  for (let b = 0; b < n; b++) {
    const slice = sorted.slice(Math.floor((b * sorted.length) / n), Math.floor(((b + 1) * sorted.length) / n));
    const newYear = slice.filter((m) => !years.has(m.year));
    const newBoth = newYear.filter((m) => !m.thinker || !people.has(m.thinker));
    const m = pick(newBoth.length ? newBoth : newYear.length ? newYear : slice, rand);
    picks.push(m);
    years.add(m.year);
    if (m.thinker) people.add(m.thinker);
  }
  const mid = Math.floor((n - 1) / 2);
  const a = n > 4 ? mid - 1 + Math.floor(rand() * 3) : mid;
  return {
    anchor: picks[a].id,
    deck: shuffle(
      picks.filter((_, i) => i !== a).map((m) => m.id),
      rand,
    ),
    line: [picks[a].id],
    results: {},
    turn: 0,
    placed: null,
  };
}

/** The gaps where a card of this year belongs: any gap from `lo` to `hi` keeps the line in order. */
export function rightGaps(line: string[], yearOf: (id: string) => number, year: number): [number, number] {
  const lo = line.filter((id) => yearOf(id) < year).length;
  const hi = line.filter((id) => yearOf(id) <= year).length;
  return [lo, hi];
}

/** Put the card in hand into gap `gap` (0 = before the first card). */
export function place(r: Round, gap: number, yearOf: (id: string) => number): Round {
  const id = r.deck[r.turn];
  if (!id || r.placed) return r;
  const [lo, hi] = rightGaps(r.line, yearOf, yearOf(id));
  const at = Math.min(hi, Math.max(lo, gap));
  const off = Math.abs(at - gap);
  const result: Result = { off, dir: off === 0 ? null : at < gap ? "earlier" : "later", guess: gap < at ? gap : gap + 1 };
  return { ...r, line: [...r.line.slice(0, at), id, ...r.line.slice(at)], results: { ...r.results, [id]: result }, placed: id };
}

export function next(r: Round): Round {
  return r.placed ? { ...r, turn: r.turn + 1, placed: null } : r;
}

export const isOver = (r: Round) => r.turn >= r.deck.length;

export function score(r: Round): number {
  return Object.values(r.results).filter((x) => x.off === 0).length;
}

/** Right answers in a row, counting back from the latest card placed. */
export function streak(r: Round): number {
  let n = 0;
  for (let i = r.placed ? r.turn : r.turn - 1; i >= 0; i--) {
    if (r.results[r.deck[i]]?.off !== 0) break;
    n++;
  }
  return n;
}

/* ---------- the reader's best round (browser storage can be missing or throw) ---------- */

export interface PlayRecord {
  best: number;
  rounds: number;
}

const key = (slug: string) => `disputation:${slug}:play:v1`;

export function readRecord(slug: string): PlayRecord {
  try {
    const raw = window.localStorage.getItem(key(slug));
    const v = raw ? (JSON.parse(raw) as Partial<PlayRecord>) : {};
    return { best: Number(v.best) || 0, rounds: Number(v.rounds) || 0 };
  } catch {
    return { best: 0, rounds: 0 };
  }
}

export function writeRecord(slug: string, rec: PlayRecord) {
  try {
    window.localStorage.setItem(key(slug), JSON.stringify(rec));
  } catch {
    /* ignore */
  }
}
