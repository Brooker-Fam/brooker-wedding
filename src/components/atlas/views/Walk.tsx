"use client";

/* Step through it (#/walk/<objection>): the grounded game over one objection,
   shown as a transcript. One move is lit at a time and the reader answers it
   (It fails or Show the reply, or Holds or Fails when nobody replies). Earlier
   moves shrink to one-line strips with the reader's stamps between them. The
   rules live in ../walk.ts. This file handles layout, focus and the keyboard.
   On phones and tablets the lit move is a card on a small deck: drag it toward
   one of the two buttons below it (left = the "fails" side, right = go on) and
   it is thrown off that way; the buttons do the same thing.
   In the code a "prong" is what the reader sees as a part of the objection. */

import "./walk.css";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import {
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { useAtlas } from "../context";
import { determine } from "../determination";
import { tick } from "../haptics";
import { ROMAN } from "../helpers";
import { Glyph, RichText, ThinkerChip } from "../primitives";
import { labelObjection, type DisputationIndex, type Judgments } from "../semantics";
import { useToast } from "../toast";
import type { ArgNode, Judgment, Label, Objection, ObjectionId, Side } from "../types";
import {
  allOutText,
  EMPTY_SESSION,
  itemCount,
  prongReason,
  runWalk,
  sanitizeSession,
  sessionIsEmpty,
  walkReduce,
  type MoveItem,
  type ProngEnd,
  type ResolveItem,
  type WalkAction,
  type WalkItem,
  type WalkPrompt,
  type WalkSection,
  type WalkSession,
} from "../walk";
import { answeredMark, shownLabel, statusText } from "./chamberShared";
import { YouMark } from "./marks";
import { ContextLink } from "./OutlineList";

/* ---------------- words ---------------- */

const WHO: Record<Side, string> = { skeptic: "The Objector", theist: "The Defender", spinoza: "Spinoza" };
const WHO_SHORT: Record<Side, string> = { skeptic: "Objector", theist: "Defender", spinoza: "Spinoza" };
/** "In reply to the Objector" */
const whoIn = (side: Side) => WHO[side].replace(/^The /, "the ");
const NUM = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const num = (n: number) => NUM[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const joinAnd = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
/** "part 2" / "parts 2 and 3" (0-based indexes in). */
const partList = (idx: number[]) => (idx.length === 1 ? `part ${idx[0] + 1}` : `parts ${joinAnd(idx.map((i) => String(i + 1)))}`);
const isAre = (n: number) => (n === 1 ? "is" : "are");
/** Where a move sits, in the reader's words: "Part 2 · Round 3". */
function partRound(ix: DisputationIndex, id: string): string {
  const info = ix.nodes.get(id);
  if (!info) return "";
  return `Part ${(ix.nodes.get(info.path[0])?.order ?? 0) + 1} · Round ${info.depth}`;
}
/** Status words, the same for moves and objections. */
const STATUS: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };
/** The name of the button that walks into a move's replies (the rules quote it too). */
const hearLabel = (replies: number) => (replies > 1 ? "Show the replies" : "Show the reply");
const EASE = [0.22, 1, 0.36, 1] as const;
/** Ignore a second action this soon after the last one (key repeat, double taps). */
const ACTION_LOCK_MS = 350;
/** The swipe tip retires after this many steps taken with the buttons. */
const TIP_STEPS = 4;

/** The cue line over a move: who is speaking, and whether it opens the part or answers a move. */
function cue(depth: number, side: Side): string {
  if (side === "spinoza") return "Spinoza cuts in";
  return depth === 1 ? `${WHO[side]} argues` : `${WHO[side]} replies`;
}

/** Under its heading, "This side concedes if X" reads better as "If X". */
function cedesText(s: string): string {
  const m = s.match(/^\s*this side (?:concedes|would concede)\s+if\s+/i);
  return m ? "If " + s.slice(m[0].length) : s;
}

/** Plain label of a node, with a fallback for missing/blank content. */
function useLabelText() {
  const { ix, toPlain } = useAtlas();
  return useCallback((id: string) => toPlain(ix.nodes.get(id)?.node.label || "Untitled move"), [ix, toPlain]);
}

/** The toast when a call settles the objection. It credits the call or calls the new status
    rests on, the same ones the end card and Where you stand name (and the same rule as the
    objection page's toast): the call itself, the one other call, or how many calls. */
function settleText(ix: DisputationIndex, obj: Objection, next: Judgments, id: string, j: Judgment, name: (id: string) => string): string {
  const det = determine(ix, obj, next);
  const N = `Objection ${obj.numeral}`;
  const what = det.label === "in" ? "now stands" : "is now answered";
  const footing = det.focus ? [det.focus, ...det.also] : det.also;
  if (footing.length <= 1) {
    const x = footing[0] ?? id;
    return x === id ? `You said “${name(id)}” ${j}, so ${N} ${what}.` : `${N} ${what}. It rests on your call on “${name(x)}”.`;
  }
  const parts = obj.prongs.map((p) => p.id);
  const onParts = footing.every((x) => parts.includes(x));
  const on =
    onParts && footing.length === parts.length
      ? parts.length === 2
        ? "both parts"
        : `all ${num(parts.length)} parts`
      : onParts
        ? partList(footing.map((x) => parts.indexOf(x)).sort((a, b) => a - b))
        : `${num(footing.length)} moves`;
  return `${N} ${what}. It rests on your calls on ${on}.`;
}

/* ---------------- small hooks ---------------- */

/** A media query as a hook (false on the server and before hydration). */
function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
/** Phones and tablets (and short touch screens in landscape): the lit move is a card on a deck,
    and the action bar is docked to the bottom of the screen. */
const DECK = "(max-width: 1023.98px), (max-height: 520px) and (pointer: coarse)";
/** A touch-first screen, where the card can be swiped (so the tip and the arrows make sense). */
const SWIPE = "(hover: none) and (pointer: coarse)";

/** The part of the screen a card can be read in: under the top bar, and above the docked bar
    (phones and tablets) or the bottom of the window. */
function viewBand(root: Element | null): { top: number; bottom: number } {
  const dock = root?.querySelector<HTMLElement>(".wk-bar-pin");
  const bar = Math.max(0, document.querySelector(".atl .sh-bar")?.getBoundingClientRect().bottom ?? 0);
  return {
    // Docked, the card may come right up under the top bar; the desktop column keeps more air.
    top: dock ? bar + 12 : 84,
    bottom: window.innerHeight - (dock ? dock.getBoundingClientRect().height + 12 : 28),
  };
}

/** How far the bottom of `el` sits below the top of `stage`, from layout alone: a card that is
    arriving is still scaled and lifted, and its rectangle would say it sits lower than it will. */
function bottomIn(el: HTMLElement, stage: HTMLElement): number {
  let y = el.offsetHeight;
  for (let n: HTMLElement | null = el; n && n !== stage; n = n.offsetParent as HTMLElement | null) {
    const p = n.offsetParent as HTMLElement | null;
    if (!p) return el.getBoundingClientRect().bottom - stage.getBoundingClientRect().top;
    y += n.offsetTop + p.clientTop;
  }
  return y;
}

const scrollMode = (smooth: boolean): ScrollBehavior => (smooth ? "smooth" : "instant");

/** Scroll so the lit card is fully in view with as much of the transcript above it as fits;
    when `fresh` rows (what the last call settled) sit just above, keep them in view too. The
    card's heading always ends up above the docked bar: it wins over the fresh rows. */
function bringIntoView(stage: HTMLElement, fresh: HTMLElement | null, smooth: boolean) {
  const vh = window.innerHeight;
  const { top, bottom } = viewBand(stage.closest(".wk-root"));
  const st = stage.getBoundingClientRect();
  const usable = bottom - top;
  // Lowest the card may sit: all of it visible, or at least most of the screen's worth of it.
  const lowest = Math.max(top, bottom - Math.min(st.height, usable * 0.62));
  let desired = Math.max(top, Math.min(vh * 0.42, bottom - st.height));
  if (fresh) {
    const gap = st.top - fresh.getBoundingClientRect().top;
    if (gap > 0) desired = Math.max(desired, Math.min(top + gap, lowest));
  }
  const head = stage.querySelector<HTMLElement>("[data-wk-head]");
  if (head) desired = Math.min(desired, bottom - bottomIn(head, stage) - 8);
  const delta = st.top - desired;
  if (Math.abs(delta) > 4) window.scrollBy({ top: delta, behavior: scrollMode(smooth) });
}

/** Where a stage begins on screen once it has settled: the end card's stage arrives lifted
    (translated down), and the deck's own stage is never moved. */
function stageTop(stage: HTMLElement): number {
  const tf = getComputedStyle(stage).transform;
  return stage.getBoundingClientRect().top - (tf && tf !== "none" ? new DOMMatrixReadOnly(tf).m42 : 0);
}

/** The deck: where the next card is dealt. In the old card's place (`slot`, where the old card's
    stage began on screen), but never with its top edge under the top bar, and always with its
    heading above the docked bar (the heading wins). When the old card's top was out of sight the
    card moves anyway, and then it also leaves room for what the last call settled (`fresh`). */
function dealTarget(stage: HTMLElement, at: number, slot: number, fresh: HTMLElement | null): number {
  const { top, bottom } = viewBand(stage.closest(".wk-root"));
  const head = stage.querySelector<HTMLElement>("[data-wk-head]");
  const lowest = bottom - (head ? bottomIn(head, stage) : 0) - 8;
  let target = Math.max(slot, top);
  if (slot < top && fresh) target = Math.max(target, top + at - fresh.getBoundingClientRect().top);
  return Math.min(target, lowest);
}

/** The deck, once a card is dealt: scroll only if something needs it. A heading out of sight
    brings the card into view; otherwise rows the last call settled, if they are hidden under
    the top bar, come into view as far as the heading can go without reaching the docked bar. */
function revealIfNeeded(stage: HTMLElement, fresh: HTMLElement | null, smooth: boolean) {
  const head = stage.querySelector<HTMLElement>("[data-wk-head]");
  if (!head) return;
  const { top, bottom } = viewBand(stage.closest(".wk-root"));
  const headBottom = stageTop(stage) + bottomIn(head, stage);
  if (headBottom - head.offsetHeight < top - 1 || headBottom > bottom + 1) {
    bringIntoView(stage, fresh, smooth);
    return;
  }
  if (!fresh) return;
  const d = Math.min(top - fresh.getBoundingClientRect().top, bottom - headBottom - 8);
  if (d > 4) window.scrollBy({ top: -d, behavior: scrollMode(smooth) });
}

const sessionKey = (slug: string, o: ObjectionId) => `disputation:${slug}:walk:${o}:v1`;
function loadSession(key: string): WalkSession {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? sanitizeSession(JSON.parse(raw)) : EMPTY_SESSION;
  } catch {
    return EMPTY_SESSION;
  }
}
function saveSession(key: string, s: WalkSession) {
  try {
    if (sessionIsEmpty(s)) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(s));
  } catch {
    /* storage unavailable: the walk just lasts for the visit */
  }
}

/* ---------------- types ---------------- */

interface HistEntry {
  n: number;
  session: WalkSession;
  calls: { id: string; prev: Judgment | null }[];
  /** The side the card was thrown to (deck only): Undo brings it back from there. */
  dir?: Dir;
}

/** -1 = left (the "fails" side, or the other choice); 1 = right (go on). */
type Dir = -1 | 1;

interface BarAct {
  key: string;
  label: ReactNode;
  /** Shorter wording for the phone dock. */
  short?: string;
  kbd?: string;
  tone: "solid" | "line";
  /** Which way the card goes on the deck. */
  dir: Dir;
  /** The words stamped on the card while it is dragged that way (the button's own verb). */
  stamp: string;
  /** call = a Holds/Fails call (■), read = reads on into the replies (□), step = moves on. */
  mark: "call" | "read" | "step";
  run: () => void;
}

/** How the lit card arrives: as it is, risen from the deck after a step, or back from the side it
    was thrown to (Undo). */
type Arrive = "none" | "rise" | Dir;

/** A transcript row: one move, or a run of consecutive results (a chain up one branch). */
type Row = { kind: "move"; item: MoveItem; g: number } | { kind: "res"; items: ResolveItem[]; g: number; last: number };

function rowsOf(items: WalkItem[], offset: number): Row[] {
  const rows: Row[] = [];
  items.forEach((it, k) => {
    const g = offset + k;
    if (it.kind === "move") {
      rows.push({ kind: "move", item: it, g });
      return;
    }
    // A line's own result is told by its end card (and by its section head once past).
    if (it.depth === 1) return;
    const prev = rows[rows.length - 1];
    if (prev && prev.kind === "res") {
      prev.items.push(it);
      prev.last = g;
    } else rows.push({ kind: "res", items: [it], g, last: g });
  });
  return rows;
}

/** Which prong makes the objection stand, as seen from the end of prong `end.index`. */
function standsBy(end: ProngEnd, sections: WalkSection[]): { kind: "this" | "earlier" | "ahead"; index: number } | null {
  if (!end.settled) return null;
  if (end.label === "in") return { kind: "this", index: end.index };
  const earlier = sections.find((s) => s.index < end.index && s.result === "in");
  if (earlier) return { kind: "earlier", index: earlier.index };
  const ahead = end.ahead.find((a) => a.label === "in");
  return ahead ? { kind: "ahead", index: ahead.index } : null;
}

/* ====================================================================== */

export default function Walk({ o }: { o: ObjectionId }) {
  const { ix, d, go, judgments, judge, labels, labelOf } = useAtlas();
  const labelText = useLabelText();
  const toast = useToast();
  const reduce = useReducedMotion();
  /** Phones and tablets: the lit move is a card on a deck, and the buttons dock to the bottom. */
  const deck = useMedia(DECK);
  const swipeable = useMedia(SWIPE);
  const narrow = deck;
  const obj = ix.objections.get(o);

  const key = sessionKey(d.slug, o);
  const [session, setSession] = useState<WalkSession>(() => loadSession(key));
  const [history, setHistory] = useState<HistEntry[]>([]);
  /** Step counter: never reused, so an old toast's Undo can't hit a newer step. */
  const [seq, setSeq] = useState(0);
  /** Transcript length before the last action: rows past it are new and animate in. */
  const [baseline, setBaseline] = useState(Number.POSITIVE_INFINITY);
  const [openSecs, setOpenSecs] = useState<string[]>([]);
  const [openStrip, setOpenStrip] = useState<string | null>(null);
  /** Bumped by every action: after the next render, focus and scroll follow the walk. */
  const [focusTick, setFocusTick] = useState(0);
  /** True for a moment after a step: status changes ripple up the branch, deepest first. */
  const [rippling, setRippling] = useState(false);
  /** Phones: the docked bar shows once the lit move has been reached (never before the move). */
  const [dockOn, setDockOn] = useState(false);
  /** Arriving with a transcript behind the reader and the lit move below the fold. */
  const [showResume, setShowResume] = useState(false);
  /** How the next lit card arrives on the deck. */
  const [arrive, setArrive] = useState<Arrive>("none");
  /** The one-time line under the deck: "You can also swipe the card." */
  const tipKey = `disputation:${d.slug}:walk:swipe-tip:v1`;
  const [tipOn, setTipOn] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const lastAct = useRef(0);
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {});
  const deckRef = useRef<DeckHandle | null>(null);
  /** The side the card is being thrown to, read by commit() for the history entry. */
  const pendingDir = useRef<Dir | null>(null);
  /** Steps taken with the buttons while the swipe tip showed. */
  const tipSteps = useRef(0);
  /** The deck: where the lit card's stage began on screen just before a step or an Undo, so the
      next card is dealt into the same place (see the layout effect below). */
  const slot = useRef<number | null>(null);
  const holdSlot = useCallback(() => {
    const st = rootRef.current?.querySelector<HTMLElement>(".wk-stage");
    slot.current = st ? stageTop(st) : null;
  }, []);
  /** Words for screen readers when a call changes the objection and no toast says so. */
  const [liveNote, setLiveNote] = useState("");

  useEffect(() => saveSession(key, session), [key, session]);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(tipKey) === "1";
    } catch {
      /* storage unavailable: show the tip for this visit */
    }
    setTipOn(!seen);
  }, [tipKey]);
  const dismissTip = useCallback(() => {
    setTipOn(false);
    try {
      window.localStorage.setItem(tipKey, "1");
    } catch {
      /* the tip just comes back next visit */
    }
  }, [tipKey]);

  const run = useMemo(() => (obj ? runWalk(obj, judgments, session) : null), [obj, judgments, session]);
  const prompt: WalkPrompt = run?.prompt ?? { kind: "empty" };
  const promptKey =
    prompt.kind === "ask" || prompt.kind === "resolved" ? `${prompt.kind}:${prompt.id}` : prompt.kind === "prong-end" ? `end:${prompt.prong}` : prompt.kind;

  /* ----- on arrival: give the walk keyboard focus; offer a jump to the lit move ----- */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const a = document.activeElement;
      if (!a || a === document.body) root.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
      // Only when there's a transcript to skip past and the lit move's heading is out of sight.
      const head = root.querySelector<HTMLElement>(".wk-stage [data-wk-head]");
      if (head && root.querySelector(".wk-thread") && head.getBoundingClientRect().bottom > window.innerHeight - 40) setShowResume(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* ----- the deck, before the new card paints: deal it into the old card's place. The rows the
     step added above it (and the header leaving its first-visit layout) would push it down;
     scrolling by as much keeps it where the old card was, so it rises from the deck there. ----- */
  useLayoutEffect(() => {
    const was = slot.current;
    slot.current = null;
    if (was === null || focusTick === 0) return;
    const root = rootRef.current;
    const stage = root?.querySelector<HTMLElement>(".wk-stage");
    if (!root || !stage) return;
    const at = stageTop(stage);
    const delta = at - dealTarget(stage, at, was, root.querySelector<HTMLElement>(".wk-res.wk-fresh"));
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "instant" });
  }, [focusTick]);

  /* ----- after an action: move focus to the lit move, and scroll if it needs it. The deck only
     scrolls when the heading is out of sight or the rows the call settled are hidden; the
     desktop column brings the new rows and the lit move into view. ----- */
  useEffect(() => {
    if (focusTick === 0) return;
    const root = rootRef.current;
    const head = root?.querySelector<HTMLElement>("[data-wk-head]");
    if (!root || !head) return;
    head.focus({ preventScroll: true });
    const stage = (head.closest(".wk-stage") as HTMLElement | null) ?? head;
    if (window.matchMedia(DECK).matches) revealIfNeeded(stage, root.querySelector<HTMLElement>(".wk-res.wk-fresh"), !reduce);
    else bringIntoView(stage, root.querySelector<HTMLElement>(".wk-fresh"), !reduce);
  }, [focusTick, reduce]);

  /* ----- the ripple lasts about a second after each step ----- */
  useEffect(() => {
    if (!rippling) return;
    const t = window.setTimeout(() => setRippling(false), 1100);
    return () => window.clearTimeout(t);
  }, [rippling, focusTick]);

  /* ----- phones: reveal the docked bar once the lit move is on screen ----- */
  useEffect(() => {
    if (!narrow || dockOn) return;
    const stage = rootRef.current?.querySelector(".wk-stage");
    if (!stage || typeof IntersectionObserver === "undefined") {
      setDockOn(true);
      return;
    }
    // The bottom margin is about the dock's height (≈100px; ≈68px on a phone on its side), so the
    // buttons arrive with the first screen as soon as the lit card's top clears the dock.
    const margin = window.matchMedia("(max-height: 520px)").matches ? 70 : 100;
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setDockOn(true), { rootMargin: `0px 0px -${margin}px 0px` });
    io.observe(stage);
    return () => io.disconnect();
  }, [narrow, dockOn, promptKey]);

  /* ----- keyboard: H / F / R / T / C / U while the walk (or nothing) has focus ----- */
  useEffect(() => {
    const h = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* ----- how the reader last acted (keys or a pointer): the heading's focus bar is a keyboard cue ----- */
  useEffect(() => {
    const set = (v: "key" | "pointer") => () => rootRef.current?.setAttribute("data-wk-input", v);
    const onKey = set("key");
    const onPointer = set("pointer");
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, []);

  /* ----- actions ----- */
  /** Run an action unless another one ran a moment ago (a held key or a double tap). */
  const guarded = useCallback((fn: () => void) => {
    const now = performance.now();
    if (now - lastAct.current < ACTION_LOCK_MS) return;
    lastAct.current = now;
    fn();
  }, []);

  const afterStep = useCallback(() => {
    setOpenStrip(null);
    setLiveNote("");
    setFocusTick((t) => t + 1);
    setRippling(true);
    setDockOn(true);
    setShowResume(false);
  }, []);

  const commit = useCallback(
    (next: WalkSession, calls: { id: string; j: Judgment | null }[] = []) => {
      const n = seq + 1;
      setSeq(n);
      const entry: HistEntry = { n, session, calls: calls.map((c) => ({ id: c.id, prev: judgments[c.id] ?? null })), dir: pendingDir.current ?? undefined };
      setHistory((h) => [...h.slice(-120), entry]);
      setBaseline(run ? itemCount(run) : 0);
      calls.forEach((c) => judge(c.id, c.j));
      setSession(next);
      setArrive("rise");
      afterStep();
      return entry;
    },
    [seq, session, judgments, judge, run, afterStep],
  );

  /** Rewind to just before step `n`: every later step is undone too, newest first. Requested
      through state so that an old toast's Undo always acts on the current history. */
  const [undoTo, setUndoTo] = useState<number | null>(null);
  useEffect(() => {
    if (undoTo === null) return;
    setUndoTo(null);
    const later = history.filter((e) => e.n >= undoTo).sort((a, b) => b.n - a.n);
    const target = later[later.length - 1];
    if (!target || target.n !== undoTo) return;
    for (const e of later) for (const c of [...e.calls].reverse()) judge(c.id, c.prev);
    // On the deck the card comes back into the place of the one it replaces.
    if (window.matchMedia(DECK).matches) holdSlot();
    setSession(target.session);
    setHistory((h) => h.filter((e) => e.n < undoTo));
    setBaseline(Number.POSITIVE_INFINITY);
    // The card that comes back returns from the side it was thrown to.
    setArrive(target.dir ?? "rise");
    afterStep();
  }, [undoTo, history, judge, afterStep, holdSlot]);
  const undo = (entry: HistEntry | undefined) => entry && setUndoTo(entry.n);
  const canUndo = history.length > 0;
  const undoLast = () => guarded(() => undo(history[history.length - 1]));

  const resume = () => {
    const stage = rootRef.current?.querySelector<HTMLElement>(".wk-stage");
    if (!stage) return;
    setDockOn(true);
    setShowResume(false);
    stage.querySelector<HTMLElement>("[data-wk-head]")?.focus({ preventScroll: true });
    // Measure once this button has gone (the header is shorter without it), or the card lands
    // that much higher than meant, under the top bar.
    requestAnimationFrame(() => {
      const st = rootRef.current?.querySelector<HTMLElement>(".wk-stage");
      if (st) bringIntoView(st, null, !reduce);
    });
  };

  /* ----- the buttons for the current prompt (computed before any early return) ----- */
  const prongs = obj?.prongs ?? [];
  const acts: BarAct[] = [];
  let dockContext: ReactNode = null;
  const dispatch = (a: WalkAction) => commit(walkReduce(session, a));
  const objLabel = labels.objection.get(o) ?? "undec";

  const call = (id: string, j: Judgment, unhear = false) => {
    if (!obj) return;
    const next: Judgments = { ...judgments, [id]: j };
    const after = labelObjection(obj, next);
    const nextSession = walkReduce(session, { type: "call", id, unhear });
    const entry = commit(nextSession, [{ id, j }]);
    if (after === objLabel || after === "undec") return;
    // When the next card already says it (the end of the walk, or the end of a part where the
    // objection now stands), a toast would only repeat it and cover the card's links, and the bar
    // has its own Undo. The end card's heading says it to screen readers as it takes focus; the
    // end of a part says it below its heading, so it is announced once instead.
    const np = runWalk(obj, next, nextSession).prompt;
    const text = settleText(ix, obj, next, id, j, labelText);
    if (np.kind === "prong-end" && np.settled) setLiveNote(text);
    else if (np.kind !== "done") toast({ text, action: { label: "Undo", run: () => undo(entry) } });
  };

  if (prompt.kind === "ask") {
    const info = ix.nodes.get(prompt.id);
    const n = info?.node;
    // The line of argument so far, as glyphs (the last is the lit move), then the round.
    const path = info?.path ?? [];
    const shown = path.slice(-6);
    dockContext = (
      <>
        <span className="wk-dock-path" aria-hidden>
          {path.length > shown.length && <span className="wk-dock-more">…</span>}
          {shown.map((id, i) => {
            const pn = ix.nodes.get(id)?.node;
            if (!pn) return null;
            const cur = i === shown.length - 1;
            return (
              <Fragment key={id}>
                {(i > 0 || path.length > shown.length) && <span className="wk-dock-link" />}
                <Glyph side={pn.side} label={cur ? "undec" : shownLabel(labelOf(id), judgments[id])} size={cur ? 11 : 9} className={cur ? "wk-dock-cur" : ""} />
              </Fragment>
            );
          })}
        </span>
        <span className="wk-dock-round mono">
          Round {prompt.depth}
          {n && <span className="sr-only">, {WHO[n.side]}</span>}
        </span>
        <span className="wk-dock-ctx-t">{labelText(prompt.id)}</span>
      </>
    );
    if (prompt.leaf) {
      acts.push({ key: "holds", label: "Holds", kbd: "H", tone: "line", dir: 1, stamp: "Holds", mark: "call", run: () => call(prompt.id, "holds") });
      acts.push({ key: "fails", label: "Fails", kbd: "F", tone: "line", dir: -1, stamp: "Fails", mark: "call", run: () => call(prompt.id, "fails") });
    } else {
      acts.push({ key: "fails", label: "It fails", kbd: "F", tone: "line", dir: -1, stamp: "It fails", mark: "call", run: () => call(prompt.id, "fails") });
      acts.push({
        key: "hear",
        label: (
          <>
            {hearLabel(prompt.replies)} <span className="wk-arrow" aria-hidden>→</span>
          </>
        ),
        kbd: "R",
        tone: "solid",
        dir: 1,
        stamp: hearLabel(prompt.replies),
        mark: "read",
        run: () => dispatch({ type: "hear", id: prompt.id }),
      });
    }
  } else if (prompt.kind === "resolved") {
    const end = prompt.end && !prompt.end.settled ? prompt.end : null;
    dockContext = <span className="wk-dock-ctx-t">{end ? `Part ${end.index + 1} of ${prongs.length} · answered` : "Answered"}</span>;
    const k = prompt.untested.length;
    const other = k === 1 ? "Show the other reply" : `Show the other ${num(k)}`;
    acts.push({
      key: "test",
      label: other,
      short: k === 1 ? "Other reply" : "Show others",
      kbd: "T",
      tone: "line",
      dir: -1,
      stamp: other,
      mark: "read",
      run: () => dispatch({ type: "test", id: prompt.id }),
    });
    const keys = [`r:${prompt.id}`];
    if (end && !end.final) keys.push(`p:${end.prong}`);
    const next = end ? (end.final ? "See where you stand" : `On to part ${end.index + 2}`) : "Continue";
    acts.push({
      key: "continue",
      label: (
        <>
          {next} <span className="wk-arrow" aria-hidden>→</span>
        </>
      ),
      short: end?.final ? "Where you stand" : undefined,
      kbd: "C",
      tone: "solid",
      dir: 1,
      stamp: next,
      mark: "step",
      run: () => dispatch({ type: "ack", key: keys }),
    });
  } else if (prompt.kind === "prong-end") {
    const own = prongs[prompt.index] ? judgments[prongs[prompt.index].id] : undefined;
    dockContext = (
      <span className="wk-dock-ctx-t">
        Part {prompt.index + 1} of {prongs.length} · {(own ? statusText(prompt.label, own) : STATUS[prompt.label]).toLowerCase()}
      </span>
    );
    const nextNo = prompt.index + 2;
    if (prompt.settled)
      acts.push({ key: "finish", label: "Stop here", tone: "line", dir: -1, stamp: "Stop here", mark: "step", run: () => dispatch({ type: "finish", prong: prompt.prong }) });
    acts.push({
      key: "continue",
      label: (
        <>
          On to part {nextNo} <span className="wk-arrow" aria-hidden>→</span>
        </>
      ),
      kbd: "C",
      tone: "solid",
      dir: 1,
      stamp: `On to part ${nextNo}`,
      mark: "step",
      run: () => dispatch({ type: "ack", key: `p:${prompt.prong}` }),
    });
  }
  /** On the deck the buttons sit on the side the card goes (so a leaf reads Fails · Holds there). */
  const barActs = deck ? [...acts].sort((a, b) => a.dir - b.dir) : acts;

  /** Run one of the prompt's actions. On the deck the card is thrown that way first, and the step
      runs as it leaves; a swipe takes this same path. False if it was ignored (a double tap, or a
      throw already under way). */
  const runAct = (a: BarAct, via: "button" | "key" | "swipe"): boolean => {
    const now = performance.now();
    if (now - lastAct.current < ACTION_LOCK_MS) return false;
    const step = () => {
      pendingDir.current = deck ? a.dir : null;
      if (deck) holdSlot();
      try {
        a.run();
      } finally {
        pendingDir.current = null;
      }
    };
    const card = deck ? deckRef.current : null;
    if (card) {
      if (!card.fling(a.dir, step)) return false;
    } else step();
    lastAct.current = now;
    if (via === "swipe" || a.mark === "call") tick();
    // The tip goes once it has been used, or after a few steps taken with the buttons.
    if (tipOn && deck && swipeable && (via === "swipe" || ++tipSteps.current >= TIP_STEPS)) dismissTip();
    return true;
  };
  const swipeTo = (dir: Dir) => {
    const a = acts.find((x) => x.dir === dir);
    return a ? runAct(a, "swipe") : false;
  };

  useEffect(() => {
    keyHandler.current = (e: KeyboardEvent) => {
      // Nothing acts behind an open peek (a person or glossary card) or any other dialog.
      if ((e.target as Element | null)?.closest?.("[role='dialog']") || document.querySelector(".atl .peek, .peek[role='dialog']")) return;
      if (e.defaultPrevented || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const root = rootRef.current;
      if (!root) return;
      const a = document.activeElement;
      if (a && a !== document.body && !root.contains(a)) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("input, textarea, select, [contenteditable='true'], [role='dialog']")) return;
      const k = e.key.toLowerCase();
      const act = acts.find((x) => x.kbd?.toLowerCase() === k);
      if (act) {
        e.preventDefault();
        runAct(act, "key");
      } else if (k === "u" && canUndo) {
        e.preventDefault();
        undoLast();
      }
    };
  });

  if (!obj || !run) {
    return (
      <div className="wk-root" ref={rootRef}>
        <h1 className="wk-title serif" tabIndex={-1}>
          There’s no objection at this link
        </h1>
        <button type="button" className="btn" onClick={() => go({ view: "home" })}>
          Back to the map
        </button>
      </div>
    );
  }

  const numeral = obj.numeral;

  const rethink = (id: string) =>
    guarded(() => {
      if (!judgments[id]) return;
      const entry = commit(walkReduce(session, { type: "uncall", id }), [{ id, j: null }]);
      toast({ text: <>Cleared your call on “{labelText(id)}”. You’re back at that move.</>, action: { label: "Undo", run: () => undo(entry) } });
    });
  const failInstead = (id: string) => guarded(() => call(id, "fails", true));

  const startOver = () => {
    const ids = (ix.byObjection.get(o) ?? []).filter((id) => judgments[id]);
    const entry = commit(EMPTY_SESSION, ids.map((id) => ({ id, j: null })));
    setOpenSecs([]);
    toast({
      text: ids.length ? (
        <>
          Cleared your {ids.length === 1 ? "call" : `${ids.length} calls`} on Objection {numeral}. You’re back at the start.
        </>
      ) : (
        <>You’re back at the start.</>
      ),
      action: { label: "Undo", run: () => undo(entry) },
    });
  };

  const bar = (where: "inline" | "dock") =>
    acts.length > 0 ? (
      <ActionBar
        where={where}
        acts={where === "dock" ? barActs : acts}
        onAct={(a) => runAct(a, "button")}
        promptKey={promptKey}
        context={where === "dock" ? dockContext : null}
        onUndo={canUndo ? undoLast : null}
        on={dockOn}
        arrows={where === "dock" && swipeable}
        onTipDone={where === "dock" && swipeable && tipOn ? dismissTip : null}
      />
    ) : null;

  /* ----- transcript ----- */
  const sections = run.sections;
  const lastSec = sections[sections.length - 1];
  const offsets: number[] = [];
  let acc = 0;
  for (const s of sections) {
    offsets.push(acc);
    acc += s.items.length;
  }
  const sectionRows = sections.map((s, si) => rowsOf(s.items, offsets[si]));
  const freshChains = sectionRows.flat().filter((r): r is Extract<Row, { kind: "res" }> => r.kind === "res" && r.last >= baseline);
  const animateIn = !reduce && baseline !== Number.POSITIVE_INFINITY;
  const stageDelay = Math.min(0.4, freshChains.length * 0.08);
  const done = prompt.kind === "done";

  const stageFor = (sec: WalkSection): ReactNode => {
    if (sec !== lastSec) return null;
    const inline = narrow ? null : bar("inline");
    let card: ReactNode;
    if (prompt.kind === "ask") card = <LitMove key={prompt.id} prompt={prompt} bar={inline} />;
    else if (prompt.kind === "resolved") card = <ResolvedCard prompt={prompt} obj={obj} bar={inline} />;
    else if (prompt.kind === "prong-end") card = <ProngEndCard prompt={prompt} obj={obj} sections={sections} bar={inline} />;
    else return null;
    if (deck) {
      // The lit card on its deck: two card edges beneath it, and the card can be dragged toward
      // either button. A new key per prompt, so every step deals a fresh card.
      return (
        <div key={promptKey} className="wk-stage wk-deck">
          <DeckCard
            handle={deckRef}
            left={acts.find((a) => a.dir === -1)}
            right={acts.find((a) => a.dir === 1)}
            arrive={arrive}
            reduce={!!reduce}
            swipeable={swipeable}
            onSwipe={swipeTo}
          >
            {card}
          </DeckCard>
        </div>
      );
    }
    return (
      <motion.div
        key={promptKey}
        className="wk-stage"
        initial={animateIn ? { opacity: 0, y: 14 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: EASE, delay: stageDelay }}
      >
        {card}
      </motion.div>
    );
  };

  const toggleSec = (id: string) => setOpenSecs((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const jumpToProng = (i: number) => {
    const sec = sections[i];
    if (!sec) return;
    if (sec !== lastSec && !openSecs.includes(sec.prong)) setOpenSecs((s) => [...s, sec.prong]);
    window.setTimeout(() => {
      document.getElementById(`wk-sec-${sec.prong}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 30);
  };

  return (
    <div className={`wk-root ${rippling ? "wk-rippling" : ""}`} ref={rootRef}>
      <WalkHeader
        obj={obj}
        at={run.at}
        sections={sections}
        prompt={prompt}
        intro={sessionIsEmpty(session) && history.length === 0}
        resume={showResume ? { label: done ? "Go to the result" : "Pick up where you left off", run: resume } : null}
        onJump={jumpToProng}
      />

      {prompt.kind === "empty" ? (
        <div className="wk-empty">
          <p className="serif">Nothing to step through here yet.</p>
          <button type="button" className="btn" onClick={() => go({ view: "objection", o })}>
            Back to Objection {numeral}
          </button>
        </div>
      ) : (
        <div className="wk-body">
          {sections.map((sec, si) => {
            const prong = prongs[sec.index];
            const current = sec === lastSec;
            const collapsed = !current && !openSecs.includes(sec.prong);
            const rows = sectionRows[si];
            const deepest = Math.max(1, ...sec.items.map((it) => it.depth));
            return (
              <section key={sec.prong} id={`wk-sec-${sec.prong}`} className={`wk-sec ${current ? "is-current" : "is-past"}`} aria-labelledby={`wk-sh-${sec.prong}`}>
                <SectionHead sec={sec} prong={prong} total={prongs.length} current={current} collapsed={collapsed} onToggle={() => toggleSec(sec.prong)} />
                {!collapsed && rows.length > 0 && (
                  <ol className="wk-thread">
                    {rows.map((row) => {
                      const g = row.kind === "res" ? row.last : row.g;
                      const isFresh = g >= baseline;
                      const delay = isFresh ? Math.min(0.5, (g - baseline) * 0.06) : 0;
                      return row.kind === "move" ? (
                        <Strip
                          key={row.item.key}
                          item={row.item}
                          rd={deepest - row.item.depth}
                          fresh={isFresh}
                          delay={delay}
                          open={openStrip === row.item.id}
                          onToggle={() => setOpenStrip((s) => (s === row.item.id ? null : row.item.id))}
                          onRethink={() => rethink(row.item.id)}
                          onFailInstead={() => failInstead(row.item.id)}
                        />
                      ) : (
                        <ResolveRow key={row.items[0].key} items={row.items} fresh={isFresh} delay={delay} />
                      );
                    })}
                  </ol>
                )}
                {stageFor(sec)}
              </section>
            );
          })}

          {prompt.kind === "done" && (
            <motion.div
              className="wk-stage wk-stage-done"
              key="done"
              initial={animateIn ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: stageDelay }}
            >
              <DoneCard
                obj={obj}
                unheard={prompt.unheard}
                decided={prompt.decided}
                onHearRest={() => lastSec && dispatch({ type: "unfinish", key: `p:${lastSec.prong}` })}
                onStartOver={startOver}
                onUndo={canUndo ? undoLast : null}
              />
            </motion.div>
          )}

          {!done && !narrow && canUndo && (
            <p className="wk-undo-row">
              <button type="button" className="wk-undo" onClick={undoLast} aria-keyshortcuts="U">
                <UndoIcon size={15} /> Undo last step
                <kbd className="wk-kbd" aria-hidden>
                  U
                </kbd>
              </button>
            </p>
          )}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {freshChains
          .map((r) => r.items[r.items.length - 1])
          .map((r) => (r.label === "out" ? `“${labelText(r.id)}” is answered.` : `“${labelText(r.id)}” stands.`))
          .concat(liveNote ? [liveNote] : [])
          .join(" ")}
      </p>

      {narrow && bar("dock")}
    </div>
  );
}

/* ====================================================================== */
/* Header                                                                  */

function WalkHeader({
  obj,
  at,
  sections,
  prompt,
  intro,
  resume,
  onJump,
}: {
  obj: Objection;
  at: number;
  sections: WalkSection[];
  prompt: WalkPrompt;
  intro: boolean;
  resume: { label: string; run: () => void } | null;
  onJump: (i: number) => void;
}) {
  const { d, go, judgments, labelOf, toPlain } = useAtlas();
  /** Phones: the rules and the epigraph wait behind a disclosure on a fresh walk, so the first move is on the first screen. */
  const [howOpen, setHowOpen] = useState(false);
  const total = (obj.prongs ?? []).length;
  const done = prompt.kind === "done";
  // The rules name the button the reader will see (it says "reply" when a move has only one).
  const hearName = hearLabel(prompt.kind === "ask" && !prompt.leaf ? prompt.replies : 2);
  const unheard = prompt.kind === "done" ? prompt.unheard : [];
  const decided = prompt.kind === "done" ? prompt.decided : [];

  let progress: string;
  if (!done) progress = `Part ${at + 1} of ${total}`;
  else if (unheard.length > 0) progress = `Stopped after part ${sections.length} of ${total}`;
  else if (decided.length > 0) progress = `Done · ${partList(decided)} decided earlier`;
  else progress = total === 2 ? "Both parts done" : `All ${num(total)} parts done`;

  const rules = (
    <ol className="wk-rules">
      <li>
        <span className="wk-rule-n mono" aria-hidden>
          1
        </span>
        <span>
          <b>It fails</b> rejects the move without reading the replies.
        </span>
      </li>
      <li>
        <span className="wk-rule-n mono" aria-hidden>
          2
        </span>
        <span>
          <b>{hearName}</b> takes you through the replies one at a time. The move is answered if any reply stands. It stands if every reply has failed or
          been answered.
        </span>
      </li>
      <li>
        <span className="wk-rule-n mono" aria-hidden>
          3
        </span>
        <span>
          When nobody replies to a move, you mark it <b>Holds</b> or <b>Fails</b>.
        </span>
      </li>
    </ol>
  );
  const epigraph = (
    <figure className="wk-epi">
      <blockquote className="serif">
        “Read not to contradict and confute; nor to believe and take for granted; nor to find talk and discourse; but to weigh and consider.”
      </blockquote>
      <figcaption className="mono">Francis Bacon · “Of Studies,” Essays (1625)</figcaption>
    </figure>
  );

  return (
    <header className={`wk-head ${intro ? "is-intro" : ""}`}>
      <button type="button" className="wk-exit mono" onClick={() => go({ view: "objection", o: obj.id })}>
        <span aria-hidden>←</span> Back to Objection {obj.numeral}
      </button>
      <div className="wk-head-grid">
        <span className="wk-num serif" aria-hidden>
          {obj.numeral}
        </span>
        <div className="wk-head-k">
          <p className="wk-kicker mono">Step through it</p>
          <p className="wk-sub mono">
            Objection {obj.numeral} of {ROMAN[d.objections.length - 1] ?? d.objections.length}
            {obj.short ? ` · ${obj.short}` : ""}
          </p>
        </div>
      </div>
      <h1 className="wk-title serif" tabIndex={-1}>
        <span className="sr-only">Step through Objection {obj.numeral}. </span>
        {toPlain(obj.title || obj.short || `Objection ${obj.numeral}`)}
      </h1>
      {obj.question && <p className="wk-question serif">{toPlain(obj.question)}</p>}

      {intro ? (
        <div className={`wk-how is-open ${howOpen ? "is-shown" : ""}`} role="group" aria-label="How it works">
          {/* Shown only on phones (walk.css): the rules fold away until asked for. */}
          <button type="button" className="wk-how-tog mono" aria-expanded={howOpen} aria-controls="wk-how-body" onClick={() => setHowOpen((v) => !v)}>
            How it works <span aria-hidden>▾</span>
          </button>
          <div id="wk-how-body" className="wk-how-body">
            {rules}
            {epigraph}
          </div>
        </div>
      ) : (
        <details className="wk-how">
          <summary className="mono">
            How it works <span aria-hidden>▾</span>
          </summary>
          {rules}
          {epigraph}
        </details>
      )}

      {(total > 1 || resume) && (
        <div className="wk-progress">
          {total > 1 && (
            <nav className="wk-progress-nav" aria-label="Parts of this objection">
              <p className="wk-progress-t mono">{progress}</p>
              <ol className="wk-pips">
                {obj.prongs.map((p, i) => {
                  const reached = i < sections.length;
                  const own = judgments[p.id];
                  const l = labelOf(p.id);
                  const cur = !done && i === at;
                  const text = `Part ${i + 1}: ${toPlain(p.label)}. ${own ? statusText(l, own) : reached || l !== "undec" ? STATUS[l] : "Not reached yet"}.`;
                  return (
                    <li key={p.id}>
                      {reached ? (
                        <button
                          type="button"
                          className={`wk-pip s-${p.side} ${cur ? "cur" : ""}`}
                          aria-label={text}
                          aria-current={cur ? "step" : undefined}
                          onClick={() => onJump(i)}
                        >
                          <Glyph side={p.side} label={shownLabel(l, own)} size={11} />
                          <span className="mono">{i + 1}</span>
                        </button>
                      ) : (
                        <span className={`wk-pip s-${p.side} later`} role="img" aria-label={text}>
                          <Glyph side={p.side} label={shownLabel(l, own)} size={11} />
                          <span className="mono">{i + 1}</span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
          {resume && (
            <button type="button" className="wk-resume mono" onClick={resume.run}>
              {resume.label} <span aria-hidden>↓</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

function SectionHead({
  sec,
  prong,
  total,
  current,
  collapsed,
  onToggle,
}: {
  sec: WalkSection;
  prong: ArgNode | undefined;
  total: number;
  current: boolean;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { judgments, labelOf, toPlain } = useAtlas();
  const id = `wk-sh-${sec.prong}`;
  const moves = sec.items.filter((i) => i.kind === "move").length;
  if (current) {
    // The first part's heading is for screen readers: the header already says where we are.
    if (sec.index === 0)
      return (
        <h2 id={id} className="sr-only">
          {total > 1 ? `Part 1 of ${total}` : "The moves"}
        </h2>
      );
    return (
      <h2 id={id} className="wk-sec-head mono">
        <span>
          Part {sec.index + 1} of {total}
        </span>
      </h2>
    );
  }
  const l = prong ? labelOf(prong.id) : "undec";
  const own = prong ? judgments[prong.id] : undefined;
  return (
    <h2 id={id} className="wk-sec-past">
      <button type="button" className="wk-sec-btn" aria-expanded={!collapsed} onClick={onToggle}>
        <span className="wk-sec-n mono">Part {sec.index + 1}</span>
        <span className="wk-sec-label">
          {prong && <Glyph side={prong.side} label={shownLabel(l, own)} size={12} />}
          {own && <YouMark size={10} className="wk-sec-you" />}
          <span className={`serif ${answeredMark(l, own) ? "lab-out" : ""}`}>{toPlain(prong?.label || "Untitled move")}</span>
        </span>
        {own ? (
          <span className="wk-sec-st">
            <span className="your-call">{statusText(l, own)}</span>
          </span>
        ) : (
          <span className={`wk-sec-st wk-st mono st-${l}`}>{STATUS[l]}</span>
        )}
        <span className="wk-sec-toggle mono">
          {collapsed ? (moves === 1 ? "Show the move" : `Show the ${moves} moves`) : moves === 1 ? "Hide the move" : "Hide the moves"} <span aria-hidden>{collapsed ? "▾" : "▴"}</span>
        </span>
      </button>
    </h2>
  );
}

/* ====================================================================== */
/* Transcript rows                                                         */

function Strip({
  item,
  rd,
  fresh,
  delay,
  open,
  onToggle,
  onRethink,
  onFailInstead,
}: {
  item: MoveItem;
  /** Rounds above the deepest move shown: the ripple's delay. */
  rd: number;
  fresh: boolean;
  delay: number;
  open: boolean;
  onToggle: () => void;
  onRethink: () => void;
  onFailInstead: () => void;
}) {
  const { ix, labelOf, openNode } = useAtlas();
  const labelText = useLabelText();
  const reduce = useReducedMotion();
  const n = ix.nodes.get(item.id)?.node;
  if (!n) return null;
  const l = labelOf(item.id);
  const res = item.res;
  const own = res.r === "judged" ? res.j : undefined;
  const status =
    res.r === "judged" ? null : l === "undec" ? (
      <span className="sr-only">Status: open</span>
    ) : (
      <span className={`wk-st st-${l}`}>
        <span className="sr-only">Status: </span>
        {STATUS[l]}
      </span>
    );
  const stamp =
    res.r === "judged" ? (
      <span className="your-call">{statusText(l, res.j)}</span>
    ) : res.auto ? null : (
      <span className="wk-stamp heard">
        <span className="wk-sq" aria-hidden />
        You read the {item.replies > 1 ? "replies" : "reply"}
      </span>
    );
  const showFork = res.r === "heard" && item.replies > 1;
  return (
    <motion.li
      className={`wk-strip s-${n.side} ${fresh ? "wk-fresh" : ""} ${open ? "is-open" : ""}`}
      style={{ "--d": Math.min(item.depth - 1, 7), "--rd": Math.min(rd, 8) } as CSSProperties}
      initial={fresh && !reduce ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay, ease: EASE }}
    >
      <span className="wk-rail mono" aria-hidden>
        {item.depth}
      </span>
      <div className="wk-strip-main">
        <button type="button" className="wk-said" aria-expanded={open} onClick={onToggle}>
          <Glyph side={n.side} label={shownLabel(l, own)} size={12} className="wk-said-glyph" />
          {own && <YouMark size={10} className="wk-said-you" />}
          <span className={`wk-said-label serif ${answeredMark(l, own) ? "lab-out" : l === "in" ? "lab-in" : ""}`}>{labelText(item.id)}</span>
          <span className="wk-chev" aria-hidden>
            ▾
          </span>
        </button>
        <div className="wk-stamp-row">
          <span className="wk-who">{WHO_SHORT[n.side]}</span>
          {(stamp || status) && (
            <span className="wk-grp">
              {stamp}
              {stamp && status && l !== "undec" && (
                <span className="wk-sep" aria-hidden>
                  ·
                </span>
              )}
              {status}
            </span>
          )}
        </div>
        {showFork && (
          <p className="wk-fork">
            {item.replies === 2 ? "If either of its two replies stands" : `If any one of its ${num(item.replies)} replies stands`}, this move is answered.
          </p>
        )}
        {open && (
          <div className="wk-said-more">
            {n.gist && (
              <p className="wk-said-gist">
                <RichText text={n.gist} />
              </p>
            )}
            <div className="wk-said-acts">
              {res.r === "judged" ? (
                <button type="button" className="btn small" onClick={onRethink}>
                  Clear this call
                </button>
              ) : (
                <button type="button" className="btn small" onClick={onFailInstead}>
                  Say it fails instead
                </button>
              )}
              <button type="button" className="btn small ghost" onClick={() => openNode(item.id)}>
                Open this move <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.li>
  );
}

/** One result sentence, e.g. “X” is answered, because its reply “Y” stands. */
function ResolveSentence({ item }: { item: ResolveItem }) {
  const { judgments } = useAtlas();
  const labelText = useLabelText();
  const k = item.untested.length;
  return item.label === "out" && item.by ? (
    <>
      <q className="serif">{labelText(item.id)}</q> is answered, because its reply <q className="serif">{labelText(item.by)}</q> stands.
      {k > 0 && (k === 1 ? " You skipped the other reply." : ` You skipped the other ${num(k)}.`)}
    </>
  ) : (
    <>
      <q className="serif">{labelText(item.id)}</q> stands, because {allOutText(item.kids, judgments)}.
    </>
  );
}

/** What followed from a call: one result, or a chain of them up the branch, told once. */
function ResolveRow({ items, fresh, delay }: { items: ResolveItem[]; fresh: boolean; delay: number }) {
  const labelText = useLabelText();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const top = items[items.length - 1];
  const chain = items.length > 1;
  return (
    <motion.li
      className={`wk-res st-${top.label} ${fresh ? "wk-fresh" : ""} ${chain ? "is-chain" : ""}`}
      style={{ "--d": Math.min(top.depth - 1, 7) } as CSSProperties}
      initial={fresh && !reduce ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay, ease: EASE }}
    >
      <span className="wk-rail" aria-hidden>
        <span className="wk-res-mark" />
      </span>
      <div className="wk-res-main">
        <p className="wk-res-text">
          <span className="wk-res-k mono">{top.label === "out" ? "Answered" : "Stands"}</span>
          {chain ? (
            <>
              This also decides {num(items.length)} moves above it. The highest, <q className="serif">{labelText(top.id)}</q>,{" "}
              {top.label === "out" ? "is answered" : "stands"}.
            </>
          ) : (
            <ResolveSentence item={top} />
          )}
        </p>
        {chain && (
          <>
            <button type="button" className="wk-res-toggle mono" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              {open ? "Hide the steps" : "Show each step"} <span aria-hidden>{open ? "▴" : "▾"}</span>
            </button>
            {open && (
              <ol className="wk-res-steps">
                {items.map((it) => (
                  <li key={it.key} className={`st-${it.label}`}>
                    <ResolveSentence item={it} />
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </motion.li>
  );
}

/* ====================================================================== */
/* The lit move and the result cards                                       */

/** Glyph + side word + label: a move named on a card. */
function NodeLine({ id, label, call, className = "" }: { id: string; label: Label; call?: Judgment; className?: string }) {
  const { ix } = useAtlas();
  const labelText = useLabelText();
  const n = ix.nodes.get(id)?.node;
  const side = n?.side ?? "skeptic";
  return (
    <p className={`wk-v-node s-${side} ${className}`}>
      <Glyph side={side} label={shownLabel(label, call)} size={13} />
      {call && <YouMark size={11} />}
      <span className="wk-v-who mono">{WHO_SHORT[side]}</span>
      <span className={`serif ${answeredMark(label, call) ? "lab-out" : label === "in" ? "lab-in" : ""}`}>{labelText(id)}</span>
    </p>
  );
}

function LitMove({ prompt: p, bar }: { prompt: Extract<WalkPrompt, { kind: "ask" }>; bar: ReactNode }) {
  const { ix, labelOf, openNode } = useAtlas();
  const labelText = useLabelText();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const n = ix.nodes.get(p.id)?.node;
  if (!n) return null;
  const parent = p.parent ? ix.nodes.get(p.parent)?.node : undefined;
  const body = (n.body ?? []).filter((x) => x && x.trim());
  const thinkers = n.thinkers ?? [];
  const sources = n.sources ?? [];
  const hasCase = body.length > 0 || !!n.quote || thinkers.length > 0 || sources.length > 0;
  const headId = `wk-h-${p.id}`;
  return (
    <article className={`wk-lit s-${n.side}`} aria-labelledby={headId}>
      {n.side === "spinoza" && <div className="wk-hatch" aria-hidden />}
      <header className="wk-lit-head">
        <span className="wk-cue mono">
          <Glyph side={n.side} size={12} />
          {cue(p.depth, n.side)}
        </span>
        <span className="wk-meta mono">
          Round {p.depth}
          {p.parent && p.count > 1 ? ` · Reply ${p.index + 1} of ${p.count}` : ""}
        </span>
      </header>
      {parent && (
        <p className={`wk-ctx s-${parent.side}`}>
          <span className="wk-ctx-k mono">In reply to {whoIn(parent.side)}</span>
          <span className="wk-ctx-q">
            <Glyph side={parent.side} size={10} label={labelOf(parent.id)} />
            <span className="serif">{labelText(parent.id)}</span>
          </span>
        </p>
      )}
      <h3 id={headId} className="wk-label serif" tabIndex={-1} data-wk-head="">
        {labelText(p.id)}
      </h3>
      {n.gist && (
        <p className="wk-gist">
          <RichText text={n.gist} />
        </p>
      )}
      {hasCase && (
        <button type="button" className="wk-more" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? "Hide the full argument" : "Read the full argument"}{" "}
          <span className={`wk-more-chev ${open ? "up" : ""}`} aria-hidden>
            ▾
          </span>
        </button>
      )}
      {open && (
        <motion.div className="wk-case" initial={reduce ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          {body.map((para, i) => (
            <p key={i}>
              <RichText text={para} />
            </p>
          ))}
          {n.quote && (
            <figure className="wk-quote">
              <blockquote className="serif">{n.quote.text}</blockquote>
              <figcaption className="mono">
                <span>
                  {n.quote.who}
                  {n.quote.cite ? ` · ${n.quote.cite}` : ""}
                </span>
                {n.quote.url && <ContextLink url={n.quote.url} />}
              </figcaption>
            </figure>
          )}
          {thinkers.length > 0 && (
            <div className="wk-case-sec">
              <p className="wk-k mono">People</p>
              <div className="wk-thinkers">
                {thinkers.map((t) => (
                  <ThinkerChip key={t} id={t} />
                ))}
              </div>
            </div>
          )}
          {sources.length > 0 && (
            <div className="wk-case-sec">
              <p className="wk-k mono">Read further</p>
              <ul className="wk-sources">
                {sources.map((s, i) => (
                  <li key={i}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer" className="serif">
                        {s.title}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="serif">{s.title}</span>
                    )}
                    {(s.by || s.year) && (
                      <span className="wk-src-by mono">
                        {s.by}
                        {s.by && s.year ? ", " : ""}
                        {s.year}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
      {n.cedes && (
        <div className="wk-cedes">
          <p className="wk-k mono">What would change this side’s mind</p>
          <p className="wk-cedes-t serif">
            <RichText text={cedesText(n.cedes)} />
          </p>
        </div>
      )}
      <div className="wk-ask">
        {p.leaf && <p className="wk-ask-k mono">Nobody replies to this</p>}
        <p className="wk-ask-q serif">{p.leaf ? "Does it hold?" : `Reject it now, or see if it survives the ${p.replies > 1 ? "replies" : "reply"}?`}</p>
        {bar}
      </div>
      <p className="wk-links">
        <button type="button" className="wk-qlink mono" onClick={() => openNode(p.id)}>
          Open this move <span aria-hidden>→</span>
        </button>
      </p>
    </article>
  );
}

/** Links under an end card: the whole objection, and the reader's summary page. */
function EndLinks({ obj }: { obj: Objection }) {
  const { go } = useAtlas();
  return (
    <p className="wk-links">
      <button type="button" className="wk-qlink mono" onClick={() => go({ view: "objection", o: obj.id })}>
        See all moves <span aria-hidden>→</span>
      </button>
      <button type="button" className="wk-qlink mono" onClick={() => go({ view: "ledger" })}>
        Where you stand <span aria-hidden>→</span>
      </button>
    </p>
  );
}

/** What is left after an unsettled end of a part. The rule (one standing part is enough for the
    Objector) is told once, at the end of part 1, since the walk always starts there. */
function remainingText(end: ProngEnd, total: number): string {
  const rest = Array.from({ length: total - end.index - 1 }, (_, k) => end.index + 1 + k);
  const decided = end.ahead.map((a) => a.index);
  const open = rest.filter((i) => !decided.includes(i));
  const left =
    decided.length > 0
      ? `Your earlier calls already decide ${partList(decided)}, and ${partList(open)} ${isAre(open.length)} still to come.`
      : open.length === 1
        ? `${cap(partList(open))} is next.`
        : `${cap(partList(open))} are still to come.`;
  const rule = end.index === 0 ? " The Objector needs only one part to stand, so the objection is answered only if every part is." : "";
  return left + rule;
}

function ResolvedCard({ prompt: p, obj, bar }: { prompt: Extract<WalkPrompt, { kind: "resolved" }>; obj: Objection; bar: ReactNode }) {
  const labelText = useLabelText();
  const k = p.untested.length;
  // At a part's root, this card is also the end of the part (unless the objection already stands).
  const end = p.end && !p.end.settled ? p.end : null;
  return (
    <article className={`wk-verdict ${end ? "wk-pend st-out" : ""}`} aria-labelledby="wk-verdict-h">
      {end && (
        <p className="wk-k mono">
          Part {end.index + 1} of {obj.prongs.length} · answered
        </p>
      )}
      <NodeLine id={p.id} label="out" />
      <h3 id="wk-verdict-h" className="wk-v-line serif" tabIndex={-1} data-wk-head="">
        Answered, because the reply <q>{labelText(p.by)}</q> stands.
      </h3>
      <p className="wk-v-sub">
        One standing reply is enough, so {k === 1 ? "the other reply" : `the other ${num(k)}`} can’t change this. You can still read {k === 1 ? "it" : "them"}.
      </p>
      {end && (
        <p className="wk-v-sub">
          {!end.final
            ? remainingText(end, obj.prongs.length)
            : end.ahead.length > 0
              ? `Your earlier calls already decide ${partList(end.ahead.map((a) => a.index))}.`
              : "That was the last part of this objection."}
        </p>
      )}
      {bar}
      {end && <EndLinks obj={obj} />}
    </article>
  );
}

function ProngEndCard({ prompt: p, obj, sections, bar }: { prompt: Extract<WalkPrompt, { kind: "prong-end" }>; obj: Objection; sections: WalkSection[]; bar: ReactNode }) {
  const { judgments, labelOf } = useAtlas();
  const labelText = useLabelText();
  const prong = obj.prongs[p.index];
  const why = prong ? prongReason(prong, judgments, labelOf) : ({ kind: "open" } as const);
  const total = obj.prongs.length;
  const rest = Array.from({ length: total - p.index - 1 }, (_, k) => p.index + 1 + k);
  const open = rest.filter((i) => !p.ahead.some((a) => a.index === i));
  const worth = open.length > 0 ? ` You can stop here or go on to ${partList(open)}.` : "";
  const by = standsBy(p, sections);

  let sub: string;
  if (!by) sub = remainingText(p, total);
  else if (by.kind === "this") sub = `Objection ${obj.numeral} now stands, since one standing part is enough.${worth}`;
  else if (by.kind === "earlier") sub = `Objection ${obj.numeral} still stands, because part ${by.index + 1} stood.${worth}`;
  else sub = `Objection ${obj.numeral} stands anyway, because your earlier calls leave part ${by.index + 1} standing.${worth}`;

  const own = why.kind === "judged" ? why.j : undefined;
  return (
    <article className={`wk-verdict wk-pend st-${p.label}`} aria-labelledby="wk-pend-h">
      <p className="wk-k mono">
        Part {p.index + 1} of {total}
        {own ? "" : ` · ${STATUS[p.label].toLowerCase()}`}
      </p>
      <NodeLine id={p.prong} label={p.label} call={own} />
      <h3 id="wk-pend-h" className="wk-v-line serif" tabIndex={-1} data-wk-head="">
        {own === "holds" ? (
          <>You said it holds.</>
        ) : own === "fails" ? (
          <>You said it fails.</>
        ) : p.label === "in" ? (
          <>Stands, because {allOutText(why.kind === "all-fail" ? why.replies : (prong?.children ?? []).map((c) => c.id), judgments)}.</>
        ) : why.kind === "reply" ? (
          <>
            Answered, because the reply <q>{labelText(why.by)}</q> stands.
          </>
        ) : (
          <>Answered.</>
        )}
      </h3>
      <p className="wk-v-sub">{sub}</p>
      {bar}
      <EndLinks obj={obj} />
    </article>
  );
}

const CHIP_CAP = 3;

function DoneCard({
  obj,
  unheard,
  decided,
  onHearRest,
  onStartOver,
  onUndo,
}: {
  obj: Objection;
  unheard: number[];
  decided: number[];
  onHearRest: () => void;
  onStartOver: () => void;
  onUndo: (() => void) | null;
}) {
  const { ix, d, go, judgments, labels, labelOf, analysis, openNode, toPlain } = useAtlas();
  const labelText = useLabelText();
  const [allChips, setAllChips] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const label = labels.objection.get(obj.id) ?? "undec";
  const det = determine(ix, obj, judgments, analysis.get(obj.id), toPlain);
  const idx = d.objections.findIndex((x) => x.id === obj.id);
  const order = d.objections.slice(idx + 1).concat(d.objections.slice(0, Math.max(0, idx)));
  const next = order.find((x) => (labels.objection.get(x.id) ?? "undec") === "undec") ?? order[0];
  const callsHere = (ix.byObjection.get(obj.id) ?? []).filter((id) => judgments[id]).length;
  const chips = label === "undec" ? det.decisive : det.also;
  const shown = allChips ? chips : chips.slice(0, CHIP_CAP);
  const focusText = det.focus ? labelText(det.focus).replace(/[.。]+$/, "") : null;

  return (
    <article className={`wk-done st-${label}`} aria-labelledby="wk-done-h">
      <h2 className="wk-k mono">Where you stand · Objection {obj.numeral}</h2>
      <h3 id="wk-done-h" className="wk-done-line serif" tabIndex={-1} data-wk-head="">
        <span className="wk-done-head">{det.parts.head}</span> {det.parts.pre}
        {focusText && <q>{focusText}</q>}
        {det.parts.post}
      </h3>
      <p className={`wk-done-status st-${label}`}>
        <span className="dot" aria-hidden />
        {callsHere} of {det.total} moves marked
      </p>

      {chips.length > 0 && (
        <div className="wk-done-more">
          <p className="wk-k mono">{label === "undec" ? "These could also settle it" : det.focus ? "It also rests on" : "It rests on"}</p>
          <div className="wk-chips">
            {shown.map((id) => {
              const n = ix.nodes.get(id)?.node;
              return (
                <button key={id} type="button" className={`chip wk-nodechip s-${n?.side ?? "skeptic"}`} onClick={() => openNode(id)}>
                  <span className="wk-nodechip-top">
                    {n && <Glyph side={n.side} label={shownLabel(labelOf(id), judgments[id])} size={11} />}
                    {judgments[id] && <YouMark size={9} className="wk-chip-you" />}
                    <span className="mono wk-nodechip-addr">{partRound(ix, id)}</span>
                  </span>
                  <span className="wk-nodechip-lab">{labelText(id)}</span>
                </button>
              );
            })}
            {chips.length > CHIP_CAP && (
              <button type="button" className="chip wk-nodechip wk-more-chip mono" aria-expanded={allChips} onClick={() => setAllChips((v) => !v)}>
                {allChips ? "Show fewer" : `+${chips.length - CHIP_CAP} more`}
              </button>
            )}
          </div>
        </div>
      )}

      <ol className="wk-done-prongs" aria-label="Parts of this objection">
        {obj.prongs.map((p, i) => {
          const l = labelOf(p.id);
          const why = prongReason(p, judgments, labelOf);
          const skipped = unheard.includes(i);
          const earlier = decided.includes(i);
          const own = why.kind === "judged" ? why.j : undefined;
          const reason =
            skipped && l === "undec"
              ? "skipped"
              : own
                ? ""
                : why.kind === "all-fail"
                  ? allOutText(why.replies, judgments)
                  : why.kind === "reply"
                    ? `“${labelText(why.by)}” stands`
                    : "";
          return (
            <li key={p.id} className={`s-${p.side}`}>
              <span className="wk-dp-n mono">Part {i + 1}</span>
              <span className="wk-dp-label">
                <Glyph side={p.side} label={shownLabel(l, own)} size={12} />
                {own && <YouMark size={10} />}
                <span className={`serif ${answeredMark(l, own) ? "lab-out" : ""}`}>{labelText(p.id)}</span>
              </span>
              <span className="wk-dp-why">
                <span className="wk-dp-who mono">{WHO_SHORT[p.side]}</span>
                <span className="wk-dp-sep" aria-hidden>
                  ·
                </span>
                {own ? <span className="your-call">{statusText(l, own)}</span> : <span className={`wk-st st-${l}`}>{STATUS[l]}</span>}
                {reason && <span className="wk-dp-reason"> · {reason}</span>}
                {earlier && <span className="wk-dp-reason"> · decided by your earlier calls</span>}
              </span>
            </li>
          );
        })}
      </ol>

      {unheard.length > 0 && (
        <p className="wk-done-unheard">
          You stopped once Objection {obj.numeral} stood, so you skipped {partList(unheard)}.{" "}
          <button type="button" className="wk-link" onClick={onHearRest}>
            Go through {unheard.length === 1 ? "it" : "them"} anyway →
          </button>
        </p>
      )}

      <div className="wk-done-acts">
        {next && next.id !== obj.id && (
          <button type="button" className="btn solid" onClick={() => go({ view: "walk", o: next.id })}>
            On to Objection {next.numeral} <span className="wk-arrow" aria-hidden>→</span>
          </button>
        )}
        <button type="button" className="btn" onClick={() => go({ view: "objection", o: obj.id })}>
          See all moves
        </button>
        <button type="button" className="btn" onClick={() => go({ view: "ledger" })}>
          Where you stand
        </button>
      </div>

      <figure className="wk-epi wk-done-epi">
        <blockquote className="serif">“Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.”</blockquote>
        <figcaption className="mono">Proverbs 27:17, King James Version</figcaption>
      </figure>

      <div className="wk-done-foot">
        {confirm ? (
          <p className="wk-confirm" role="group" aria-label="Start over">
            <span>
              Clear your {callsHere === 1 ? "call" : `${callsHere} calls`} on Objection {obj.numeral}?
            </span>
            <button
              type="button"
              className="btn small wk-confirm-yes"
              onClick={() => {
                setConfirm(false);
                onStartOver();
              }}
            >
              Clear
            </button>
            <button type="button" className="btn small ghost" autoFocus onClick={() => setConfirm(false)}>
              Keep
            </button>
          </p>
        ) : (
          <p className="wk-foot-acts">
            {onUndo && (
              <button type="button" className="wk-undo" onClick={onUndo}>
                <UndoIcon size={15} /> Undo last step
              </button>
            )}
            <button type="button" className="wk-undo" onClick={() => (callsHere > 0 ? setConfirm(true) : onStartOver())}>
              Start over
            </button>
          </p>
        )}
      </div>
    </article>
  );
}

/* ====================================================================== */
/* Action bar: inline under the lit card on desktop, docked on phones      */

function UndoIcon({ size = 18 }: { size?: number }) {
  return (
    <svg className="wk-undo-svg" width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7.5 4.5 3.5 8.5l4 4" />
      <path d="M3.8 8.5h8.2a4.5 4.5 0 0 1 0 9H9" />
    </svg>
  );
}

function ActionBar({
  where,
  acts,
  onAct,
  promptKey,
  context,
  onUndo,
  on,
  arrows,
  onTipDone,
}: {
  where: "inline" | "dock";
  acts: BarAct[];
  onAct: (a: BarAct) => void;
  promptKey: string;
  context: ReactNode;
  onUndo: (() => void) | null;
  /** Dock only: revealed (the reader has reached the lit move). */
  on: boolean;
  /** Dock on a touch screen: small arrows on the outer edges say which way each button sends the card. */
  arrows: boolean;
  /** Dock on a touch screen, until dismissed or used: the one-time swipe tip (this dismisses it). */
  onTipDone: (() => void) | null;
}) {
  const dock = where === "dock";
  const sided = dock && arrows;
  // Two calls of equal weight (Holds, Fails) get equal buttons.
  const even = acts.length === 2 && acts.every((a) => a.mark === "call");
  return (
    <div className={`wk-bar ${dock ? `wk-bar-pin ${on ? "is-on" : ""}` : "wk-bar-inline"}`} role="group" aria-label="Your answer">
      {dock && onTipDone ? (
        <p className="wk-tip">
          <SwipeIcon />
          <span className="wk-tip-t">You can also swipe the card.</span>
          <button type="button" className="wk-tip-x" onClick={onTipDone} aria-label="Dismiss the swipe tip">
            <span aria-hidden>×</span>
          </button>
        </p>
      ) : (
        dock && context && <p className="wk-dock-ctx">{context}</p>
      )}
      <div className={`wk-bar-btns n${acts.length} ${even ? "even" : ""} ${dock && onUndo ? "with-undo" : ""}`}>
        {acts.map((a) => (
          // Keyed by the question too, so a fresh button replaces the old one under the finger.
          <button key={`${promptKey}:${a.key}`} type="button" className={`wk-btn ${a.tone}`} onClick={() => onAct(a)} aria-keyshortcuts={a.kbd}>
            {sided && a.dir < 0 && (
              <span className="wk-btn-way" aria-hidden>
                ‹
              </span>
            )}
            <span className="wk-btn-l">
              {dock && a.short ? (
                // The short words where the dock is narrow, the full ones where it isn't.
                <>
                  <span className="wk-l-short">{a.short}</span>
                  <span className="wk-l-full">{a.label}</span>
                </>
              ) : (
                a.label
              )}
            </span>
            {sided && a.dir > 0 && (
              <span className="wk-btn-way" aria-hidden>
                ›
              </span>
            )}
            {/* The shortcut hints show wherever there's a keyboard (walk.css hides them on touch
                screens), the docked bar of a narrow desktop window included. */}
            {a.kbd && (
              <kbd className="wk-kbd" aria-hidden>
                {a.kbd}
              </kbd>
            )}
          </button>
        ))}
        {dock && onUndo && (
          <button type="button" className="wk-btn wk-undo-ic" onClick={onUndo} aria-label="Undo last step" aria-keyshortcuts="U">
            <UndoIcon size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

/** Two arrows around a card, for the swipe tip. */
function SwipeIcon() {
  return (
    <svg className="wk-tip-ic" width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="10.5" y="1.5" width="9" height="13" rx="2" />
      <path d="M6.5 8H1.5M3.5 5.5 1.2 8l2.3 2.5" />
      <path d="M23.5 8h5M26.5 5.5 28.8 8l-2.3 2.5" />
    </svg>
  );
}

/* ====================================================================== */
/* The deck (phones and tablets): the lit card can be dragged sideways      */

/** What the walk asks of the card on top of the deck. */
interface DeckHandle {
  /** Throw the card off toward `dir`, then run `then` (the step) as it leaves.
      False if a throw is already under way. */
  fling: (dir: Dir, then: () => void) => boolean;
}

/** Past this many px the card commits on release; a fast flick commits sooner. */
const COMMIT_PX = 96;
const FLICK_V = 650;
const FLICK_MIN_PX = 28;
/** A flick that would make a call (Holds or Fails) has to travel further: a stray sideways
    thumb shouldn't record one. */
const FLICK_CALL_PX = 56;
/** The finger must travel this far, mostly sideways (|dx| > 1.5·|dy|), before the card moves. */
const LOCK_PX = 10;
/** No drag may start this close to the screen's edges (the browser's back and forward swipes). */
const EDGE_PX = 24;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Pinch-zoomed in: a sideways drag pans the page, so the card stays put. */
const isZoomed = () => (window.visualViewport?.scale ?? 1) > 1.01;
const onZoom = (cb: () => void) => {
  const vv = window.visualViewport;
  vv?.addEventListener("resize", cb);
  return () => vv?.removeEventListener("resize", cb);
};
const useZoomed = () => useSyncExternalStore(onZoom, isZoomed, () => false);

interface Gesture {
  id: number;
  x0: number;
  y0: number;
  lock: boolean;
  /** Recent pointer samples, for the release velocity. */
  pts: { x: number; t: number }[];
}

function DeckCard({
  handle,
  left,
  right,
  arrive,
  reduce,
  swipeable,
  onSwipe,
  children,
}: {
  handle: RefObject<DeckHandle | null>;
  left: BarAct | undefined;
  right: BarAct | undefined;
  arrive: Arrive;
  reduce: boolean;
  /** A touch-first screen: the card can be dragged, so the edges of the cards beneath show. */
  swipeable: boolean;
  /** A drag that crossed the line: run that side's action (false if it was refused). */
  onSwipe: (dir: Dir) => boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const zoomed = useZoomed();
  const back = typeof arrive === "number" && !reduce;
  // Seeded with the arrival pose, so the first frame is already beneath the deck (or off to the side).
  const x = useMotionValue(back ? (arrive as Dir) * 56 : 0);
  const rot = useMotionValue(back ? (arrive as Dir) * 2 : 0);
  const op = useMotionValue(arrive === "none" ? 1 : arrive === "rise" && !reduce ? 0.55 : 0);
  const lift = useMotionValue(arrive === "rise" && !reduce ? 1 : 0);
  /** How far the reader has pulled the card (it drives the stamps, even when motion is reduced). */
  const pull = useMotionValue(0);
  /** 1 while the card is held: it lifts a hair off the deck. */
  const grab = useMotionValue(0);
  const scale = useTransform([lift, grab], ([l, g]: number[]) => (1 - 0.045 * l) * (1 + 0.012 * g));
  // Dealt, the card starts where the card beneath begins (.wk-ghost.g1 sits 9px lower) and rises.
  const y = useTransform(lift, [0, 1], [0, 9]);
  const stampL = useTransform(pull, [-COMMIT_PX, -14], [1, 0]);
  const stampR = useTransform(pull, [14, COMMIT_PX], [0, 1]);
  // The stamp presses in as it fades in, and the card beneath rises a little as this one is pulled.
  const stampLs = useTransform(pull, [-COMMIT_PX, -14], [1, 0.9]);
  const stampRs = useTransform(pull, [14, COMMIT_PX], [0.9, 1]);
  const under1 = useTransform(pull, [-COMMIT_PX, 0, COMMIT_PX], [-6, 0, -6]);
  const under2 = useTransform(pull, [-COMMIT_PX, 0, COMMIT_PX], [-3, 0, -3]);
  const [dragging, setDragging] = useState(false);
  const gesture = useRef<Gesture | null>(null);
  const busy = useRef(false);
  const dragged = useRef(false);
  const alive = useRef(false);
  const maxDeg = useRef(6);
  const lastV = useRef(0);
  const swiping = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  /* the card arrives: it rises from the deck, or comes back from the side it was thrown to */
  useEffect(() => {
    if (arrive === "none") return;
    const runs = [animate(op, 1, { duration: reduce ? 0.18 : 0.26, ease: "easeOut" })];
    if (!reduce && arrive === "rise") runs.push(animate(lift, 0, { type: "spring", stiffness: 420, damping: 32, mass: 0.8 }));
    if (!reduce && arrive !== "rise") runs.push(animate(x, 0, { type: "spring", stiffness: 400, damping: 36 }), animate(rot, 0, { type: "spring", stiffness: 400, damping: 36 }));
    return () => runs.forEach((r) => r.stop());
  }, [arrive, reduce, op, lift, x, rot]);

  /** Where the stamp sits (in the part of the card on screen) and how the card pivots. */
  const aim = (fingerY: number | null) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const top = Math.max(r.top, document.querySelector(".atl .sh-bar")?.getBoundingClientRect().bottom ?? 0, 0);
    const dock = document.querySelector(".atl .wk-bar-pin.is-on")?.getBoundingClientRect().top ?? window.innerHeight;
    const bottom = Math.min(r.bottom, dock);
    const fy = fingerY ?? (top + bottom) / 2;
    el.style.transformOrigin = `50% ${Math.round(clamp(fy - r.top + 260, 0, r.height))}px`;
    el.style.setProperty("--wk-stamp-y", `${Math.round(clamp(top - r.top + 18, 14, Math.max(14, r.height - 70)))}px`);
    // A tall card tilts less, so its far end doesn't swing wide.
    maxDeg.current = clamp((6 * 560) / Math.max(560, r.height), 2.5, 6);
  };

  const settle = () => {
    const spring = { type: "spring" as const, stiffness: 560, damping: 34 };
    animate(x, 0, spring);
    animate(rot, 0, spring);
    animate(pull, 0, { duration: 0.2 });
    animate(grab, 0, { duration: 0.2 });
  };

  const fling = (dir: Dir, then: () => void) => {
    if (busy.current) return false;
    busy.current = true;
    // A button press: aim at the part of the card on screen. (A swipe aimed when it began, and
    // moving the pivot now would make the tilted card jump.)
    if (!swiping.current) aim(null);
    const v = lastV.current;
    lastV.current = 0;
    const finish = () => {
      // The step deals a new card in this one's place. If it didn't, bring this one back.
      window.setTimeout(() => {
        if (!alive.current) return;
        busy.current = false;
        animate(op, 1, { duration: 0.2 });
        settle();
      }, 700);
      then();
    };
    if (reduce) {
      // No slide and no tilt: the stamp shows, the card fades, the next one fades in.
      pull.set(dir * COMMIT_PX);
      animate(op, 0, { duration: 0.14, ease: "easeIn" }).then(finish);
      return true;
    }
    const to = dir * (window.innerWidth + 140);
    const speed = Math.max(Math.abs(v), 1600);
    const dur = clamp(Math.abs(to - x.get()) / speed, 0.17, 0.3);
    const ease = [0.45, 0, 0.85, 0.45] as const;
    animate(x, to, { duration: dur, ease });
    animate(rot, dir * maxDeg.current, { duration: dur, ease });
    animate(pull, dir * COMMIT_PX, { duration: Math.min(0.12, dur / 2) });
    animate(op, 0, { duration: dur * 0.55, delay: dur * 0.45, ease: "easeIn" });
    window.setTimeout(finish, dur * 900);
    return true;
  };
  useImperativeHandle(handle, () => ({ fling }));

  const canStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || e.button !== 0 || busy.current || (!left && !right)) return false;
    // Zoomed in, a sideways drag is the reader panning across the page.
    if (isZoomed()) return false;
    // A mouse drags the card only on a touch-first screen (an emulator, or a stylus mapped to a
    // mouse); elsewhere a mouse drag selects text.
    if (e.pointerType === "mouse" && !window.matchMedia("(hover: none)").matches) return false;
    const vw = document.documentElement.clientWidth;
    if (e.clientX < EDGE_PX || e.clientX > vw - EDGE_PX) return false;
    const t = e.target as Element | null;
    return !t?.closest?.("input, textarea, select, [contenteditable='true']");
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragged.current = false;
    if (!canStart(e)) return;
    // A mouse press would start a text selection, and a drag of that selection would then
    // cancel every later drag of the card. (A click still arrives.)
    if (e.pointerType === "mouse") e.preventDefault();
    gesture.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, lock: false, pts: [{ x: e.clientX, t: e.timeStamp }] };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || e.pointerId !== g.id) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    if (!g.lock) {
      if (Math.abs(dx) > LOCK_PX && Math.abs(dx) > 1.5 * Math.abs(dy)) {
        g.lock = true;
        dragged.current = true;
        window.getSelection()?.removeAllRanges();
        try {
          ref.current?.setPointerCapture(e.pointerId);
        } catch {
          /* the pointer is already gone */
        }
        aim(g.y0);
        setDragging(true);
        if (!reduce) animate(grab, 1, { duration: 0.16, ease: "easeOut" });
      } else if (Math.abs(dy) > LOCK_PX) {
        // Mostly up or down: a scroll, and the page keeps it.
        gesture.current = null;
        return;
      } else return;
    }
    g.pts.push({ x: e.clientX, t: e.timeStamp });
    while (g.pts.length > 2 && e.timeStamp - g.pts[0].t > 80) g.pts.shift();
    const way = dx < 0 ? left : right;
    // Toward a side with no action the card barely gives.
    const shift = way ? dx : dx * 0.18;
    pull.set(way ? dx : 0);
    if (!reduce) {
      x.set(shift);
      rot.set(clamp((shift / 220) * maxDeg.current, -maxDeg.current, maxDeg.current));
    }
  };

  const end = (e: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const g = gesture.current;
    if (!g || e.pointerId !== g.id) return;
    gesture.current = null;
    if (!g.lock) return;
    setDragging(false);
    // A click that follows the drag arrives in this same turn; anything later is a real click.
    window.setTimeout(() => {
      dragged.current = false;
    }, 0);
    try {
      if (ref.current?.hasPointerCapture(e.pointerId)) ref.current.releasePointerCapture(e.pointerId);
    } catch {
      /* nothing to release */
    }
    const last = g.pts[g.pts.length - 1];
    const first = g.pts[0];
    // A cancelled pointer reports no position: use the last one seen.
    const ex = cancelled ? last.x : e.clientX;
    const dx = ex - g.x0;
    const dt = last.t - first.t;
    // A finger that stopped before lifting has no speed left, whatever it had before.
    const v = dt > 0 && e.timeStamp - last.t < 60 ? ((last.x - first.x) / dt) * 1000 : 0;
    const dir: Dir = dx < 0 ? -1 : 1;
    const way = dir < 0 ? left : right;
    const minFlick = way?.mark === "call" ? FLICK_CALL_PX : FLICK_MIN_PX;
    const flick = Math.abs(v) > FLICK_V && Math.sign(v) === dir && Math.abs(dx) > minFlick;
    if (!cancelled && way && (Math.abs(dx) >= COMMIT_PX || flick)) {
      lastV.current = v;
      swiping.current = true;
      const taken = onSwipe(dir);
      swiping.current = false;
      if (taken) return;
      lastV.current = 0;
    }
    settle();
  };

  // A drag that started on a button or link inside the card is not a tap on it. (A click from
  // the keyboard has detail 0 and always goes through.)
  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!dragged.current || e.detail === 0) return;
    dragged.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const stamp = (a: BarAct | undefined, side: "to-left" | "to-right", opacity: typeof stampL, scale: typeof stampL) =>
    a ? (
      <motion.span
        className={`wk-swipe-stamp ${side} m-${a.mark}`}
        // Thrown left, the stamp sits on the edge that stays on screen (the right), tilted the other way.
        style={reduce ? { opacity } : { opacity, scale, rotate: side === "to-left" ? 6 : -6 }}
        aria-hidden
      >
        {a.mark !== "step" && <span className="wk-sq" />}
        {a.short ? (
          // The words on the button: the dock's short ones where the dock uses them (walk.css).
          <>
            <span className="wk-l-short">{a.short}</span>
            <span className="wk-l-full">{a.stamp}</span>
          </>
        ) : (
          a.stamp
        )}
      </motion.span>
    ) : null;

  return (
    <>
      {/* two card edges beneath (where the card can be dragged): the next card rises a little as
          this one is pulled away */}
      {swipeable && (
        <>
          <motion.span className="wk-ghost g2" style={reduce ? undefined : { y: under2 }} aria-hidden />
          <motion.span className="wk-ghost g1" style={reduce ? undefined : { y: under1 }} aria-hidden />
        </>
      )}
      <motion.div
        ref={ref}
        className={`wk-card ${dragging ? "is-dragging" : ""} ${zoomed ? "is-zoomed" : ""}`}
        style={{ x, rotate: rot, scale, y, opacity: op }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => end(e, false)}
        onPointerCancel={(e) => end(e, true)}
        // Only the card's own capture: a touch is first captured by the element under the finger,
        // and that element's lostpointercapture bubbles up here when the card takes it over.
        onLostPointerCapture={(e) => e.target === e.currentTarget && end(e, true)}
        onClickCapture={onClickCapture}
      >
        {children}
        {stamp(left, "to-left", stampL, stampLs)}
        {stamp(right, "to-right", stampR, stampRs)}
      </motion.div>
    </>
  );
}
