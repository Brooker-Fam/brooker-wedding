"use client";

/* Step through it (#/walk/<objection>): the grounded game over one objection,
   shown as a transcript. One move is lit at a time and the reader answers it
   (It fails or Show the reply, or Holds or Fails when nobody replies). Earlier
   moves shrink to one-line strips with the reader's stamps between them. The
   rules live in ../walk.ts. This file handles layout, focus and the keyboard.
   In the code a "prong" is what the reader sees as a part of the objection. */

import "./walk.css";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { useAtlas } from "../context";
import { determine } from "../determination";
import { ROMAN, address } from "../helpers";
import { Glyph, RichText, ThinkerChip } from "../primitives";
import { labelObjection } from "../semantics";
import { useToast } from "../toast";
import type { ArgNode, Judgment, Label, Objection, ObjectionId, Side } from "../types";
import {
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

/* ---------------- words ---------------- */

const WHO: Record<Side, string> = { skeptic: "The Objector", theist: "The Defender", spinoza: "Spinoza" };
const WHO_SHORT: Record<Side, string> = { skeptic: "Objector", theist: "Defender", spinoza: "Spinoza" };
/** "In reply to the Objector" */
const whoIn = (side: Side) => WHO[side].replace(/^The /, "the ");
const NUM = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const num = (n: number) => NUM[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const Num = (n: number) => cap(num(n));
const joinAnd = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
/** "part 2" / "parts 2 and 3" (0-based indexes in). */
const partList = (idx: number[]) => (idx.length === 1 ? `part ${idx[0] + 1}` : `parts ${joinAnd(idx.map((i) => String(i + 1)))}`);
const isAre = (n: number) => (n === 1 ? "is" : "are");
/** Why an inner move stands when nothing answers it. */
const allFail = (replies: number) => (replies === 1 ? "its one reply fails" : "every reply to it fails");

const STATUS: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };
const OBJ_STATUS: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Undecided" };
const EASE = [0.22, 1, 0.36, 1] as const;
/** Ignore a second action this soon after the last one (key repeat, double taps). */
const ACTION_LOCK_MS = 350;

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

/* ---------------- small hooks ---------------- */

/** Phones (and short touch screens in landscape) get the action bar docked to the bottom. */
const NARROW = "(max-width: 760px), (max-height: 520px) and (pointer: coarse)";
function subscribeNarrow(cb: () => void) {
  const mq = window.matchMedia(NARROW);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getNarrow = () => window.matchMedia(NARROW).matches;
const getNarrowServer = () => false;
const useNarrow = () => useSyncExternalStore(subscribeNarrow, getNarrow, getNarrowServer);

/** Scroll so the lit card is fully in view with as much of the transcript above it as fits;
    when `fresh` rows (what the last call settled) sit just above, keep them in view too. */
function bringIntoView(stage: HTMLElement, fresh: HTMLElement | null, smooth: boolean) {
  const vh = window.innerHeight;
  const top = 84;
  const dock = stage.closest(".wk-root")?.querySelector<HTMLElement>(".wk-bar-pin");
  const bottomPad = dock ? dock.getBoundingClientRect().height + 12 : 28;
  const st = stage.getBoundingClientRect();
  const usable = vh - bottomPad - top;
  // Lowest the card may sit: all of it visible, or at least most of the screen's worth of it.
  const lowest = Math.max(top, vh - bottomPad - Math.min(st.height, usable * 0.62));
  let desired = Math.max(top, Math.min(vh * 0.42, vh - st.height - bottomPad));
  if (fresh) {
    const gap = st.top - fresh.getBoundingClientRect().top;
    if (gap > 0) desired = Math.max(desired, Math.min(top + gap, lowest));
  }
  const delta = st.top - desired;
  if (Math.abs(delta) > 4) window.scrollBy({ top: delta, behavior: smooth ? "smooth" : "auto" });
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
}

interface BarAct {
  key: string;
  label: ReactNode;
  /** Shorter wording for the phone dock. */
  short?: string;
  kbd?: string;
  tone: "solid" | "line";
  run: () => void;
}

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
  const { ix, d, go, judgments, judge, labels } = useAtlas();
  const labelText = useLabelText();
  const toast = useToast();
  const reduce = useReducedMotion();
  const narrow = useNarrow();
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

  const rootRef = useRef<HTMLDivElement>(null);
  const lastAct = useRef(0);
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {});

  useEffect(() => saveSession(key, session), [key, session]);

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

  /* ----- after an action: bring the new rows and the lit move into view, move focus ----- */
  useEffect(() => {
    if (focusTick === 0) return;
    const root = rootRef.current;
    const head = root?.querySelector<HTMLElement>("[data-wk-head]");
    if (!root || !head) return;
    head.focus({ preventScroll: true });
    const stage = (head.closest(".wk-stage") as HTMLElement | null) ?? head;
    bringIntoView(stage, root.querySelector<HTMLElement>(".wk-fresh"), !reduce);
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
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setDockOn(true), { rootMargin: "0px 0px -42% 0px" });
    io.observe(stage);
    return () => io.disconnect();
  }, [narrow, dockOn, promptKey]);

  /* ----- keyboard: H / F / R / T / C / U while the walk (or nothing) has focus ----- */
  useEffect(() => {
    const h = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
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
    setFocusTick((t) => t + 1);
    setRippling(true);
    setDockOn(true);
    setShowResume(false);
  }, []);

  const commit = useCallback(
    (next: WalkSession, calls: { id: string; j: Judgment | null }[] = []) => {
      const n = seq + 1;
      setSeq(n);
      const entry: HistEntry = { n, session, calls: calls.map((c) => ({ id: c.id, prev: judgments[c.id] ?? null })) };
      setHistory((h) => [...h.slice(-120), entry]);
      setBaseline(run ? itemCount(run) : 0);
      calls.forEach((c) => judge(c.id, c.j));
      setSession(next);
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
    setSession(target.session);
    setHistory((h) => h.filter((e) => e.n < undoTo));
    setBaseline(Number.POSITIVE_INFINITY);
    afterStep();
  }, [undoTo, history, judge, afterStep]);
  const undo = (entry: HistEntry | undefined) => entry && setUndoTo(entry.n);
  const canUndo = history.length > 0;
  const undoLast = () => guarded(() => undo(history[history.length - 1]));

  const resume = () => {
    const root = rootRef.current;
    const stage = root?.querySelector<HTMLElement>(".wk-stage");
    if (!stage) return;
    setDockOn(true);
    setShowResume(false);
    bringIntoView(stage, null, !reduce);
    stage.querySelector<HTMLElement>("[data-wk-head]")?.focus({ preventScroll: true });
  };

  /* ----- the buttons for the current prompt (computed before any early return) ----- */
  const prongs = obj?.prongs ?? [];
  const acts: BarAct[] = [];
  let dockContext: ReactNode = null;
  const dispatch = (a: WalkAction) => commit(walkReduce(session, a));
  const objLabel = labels.objection.get(o) ?? "undec";

  const call = (id: string, j: Judgment, unhear = false) => {
    if (!obj) return;
    const after = labelObjection(obj, { ...judgments, [id]: j });
    const entry = commit(walkReduce(session, { type: "call", id, unhear }), [{ id, j }]);
    if (after !== objLabel && after !== "undec") {
      toast({
        text: (
          <>
            Objection {obj.numeral} {after === "in" ? "now stands" : "is now answered"}, because you said “{labelText(id)}” {j}.
          </>
        ),
        action: { label: "Undo", run: () => undo(entry) },
      });
    }
  };

  if (prompt.kind === "ask") {
    const n = ix.nodes.get(prompt.id)?.node;
    dockContext = (
      <>
        {n && <Glyph side={n.side} size={10} />}
        {n && <span className="wk-dock-who">{WHO_SHORT[n.side]}</span>}
        <span className="wk-dock-ctx-t">{labelText(prompt.id)}</span>
      </>
    );
    if (prompt.leaf) {
      acts.push({ key: "holds", label: "Holds", kbd: "H", tone: "line", run: () => call(prompt.id, "holds") });
      acts.push({ key: "fails", label: "Fails", kbd: "F", tone: "line", run: () => call(prompt.id, "fails") });
    } else {
      acts.push({ key: "fails", label: "It fails", kbd: "F", tone: "line", run: () => call(prompt.id, "fails") });
      acts.push({
        key: "hear",
        label: (
          <>
            Show the {prompt.replies > 1 ? "replies" : "reply"} <span className="wk-arrow" aria-hidden>→</span>
          </>
        ),
        short: prompt.replies > 1 ? "Show the replies" : "Show the reply",
        kbd: "R",
        tone: "solid",
        run: () => dispatch({ type: "hear", id: prompt.id }),
      });
    }
  } else if (prompt.kind === "resolved") {
    const end = prompt.end && !prompt.end.settled ? prompt.end : null;
    dockContext = <span className="wk-dock-ctx-t">{end ? `Part ${end.index + 1} of ${prongs.length} · answered` : "Answered"}</span>;
    const k = prompt.untested.length;
    acts.push({
      key: "test",
      label: <>Show the other {k === 1 ? "reply" : num(k)}</>,
      short: k === 1 ? "Other reply" : "Other replies",
      kbd: "T",
      tone: "line",
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
      short: end ? (end.final ? "Where you stand" : `On to part ${end.index + 2}`) : "Continue",
      kbd: "C",
      tone: "solid",
      run: () => dispatch({ type: "ack", key: keys }),
    });
  } else if (prompt.kind === "prong-end") {
    dockContext = (
      <span className="wk-dock-ctx-t">
        Part {prompt.index + 1} of {prongs.length} · {STATUS[prompt.label].toLowerCase()}
      </span>
    );
    const nextNo = prompt.index + 2;
    if (prompt.settled) acts.push({ key: "finish", label: "Stop here", tone: "line", run: () => dispatch({ type: "finish", prong: prompt.prong }) });
    acts.push({
      key: "continue",
      label: (
        <>
          On to part {nextNo} <span className="wk-arrow" aria-hidden>→</span>
        </>
      ),
      short: `On to part ${nextNo}`,
      kbd: "C",
      tone: "solid",
      run: () => dispatch({ type: "ack", key: `p:${prompt.prong}` }),
    });
  }

  useEffect(() => {
    keyHandler.current = (e: KeyboardEvent) => {
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
        guarded(act.run);
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
      text: ids.length ? <>Cleared your {ids.length === 1 ? "call" : `${ids.length} calls`} on Objection {numeral} and went back to the start.</> : <>Went back to the start.</>,
      action: { label: "Undo", run: () => undo(entry) },
    });
  };

  const guardedActs = acts.map((a) => ({ ...a, run: () => guarded(a.run) }));
  const bar = (where: "inline" | "dock") =>
    guardedActs.length > 0 ? (
      <ActionBar where={where} acts={guardedActs} promptKey={promptKey} context={where === "dock" ? dockContext : null} onUndo={canUndo ? undoLast : null} on={dockOn} />
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
  const { d, go, labelOf, toPlain } = useAtlas();
  const total = (obj.prongs ?? []).length;
  const done = prompt.kind === "done";
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
          <b>It fails</b> means you reject the move outright.
        </span>
      </li>
      <li>
        <span className="wk-rule-n mono" aria-hidden>
          2
        </span>
        <span>
          <b>Show the reply</b> lets the other side answer. The move stands only if every reply fails.
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
    <header className="wk-head">
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
        <div className="wk-how is-open" role="group" aria-label="How it works">
          {rules}
          {epigraph}
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
                  const l = labelOf(p.id);
                  const cur = !done && i === at;
                  const text = `Part ${i + 1}: ${toPlain(p.label)}. ${reached || l !== "undec" ? STATUS[l] : "Not reached yet"}.`;
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
                          <Glyph side={p.side} label={l} size={11} />
                          <span className="mono">{i + 1}</span>
                        </button>
                      ) : (
                        <span className={`wk-pip s-${p.side} later`} role="img" aria-label={text}>
                          <Glyph side={p.side} label={l} size={11} />
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
  const { labelOf, toPlain } = useAtlas();
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
  return (
    <h2 id={id} className="wk-sec-past">
      <button type="button" className="wk-sec-btn" aria-expanded={!collapsed} onClick={onToggle}>
        <span className="wk-sec-n mono">Part {sec.index + 1}</span>
        <span className="wk-sec-label">
          {prong && <Glyph side={prong.side} label={l} size={12} />}
          <span className={`serif ${l === "out" ? "lab-out" : ""}`}>{toPlain(prong?.label || "Untitled move")}</span>
        </span>
        <span className={`wk-sec-st wk-st mono st-${l}`}>{STATUS[l]}</span>
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
      <span className="your-call">Your call · {res.j}</span>
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
          <Glyph side={n.side} label={l} size={12} className="wk-said-glyph" />
          <span className={`wk-said-label serif ${l === "out" ? "lab-out" : l === "in" ? "lab-in" : ""}`}>{labelText(item.id)}</span>
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
            {Num(item.replies)} replies. If {item.replies === 2 ? "either" : "any"} one of them stands, this move is answered.
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

/** One result sentence, e.g. So “X” is answered, because its reply “Y” stands. */
function ResolveSentence({ item }: { item: ResolveItem }) {
  const labelText = useLabelText();
  const k = item.untested.length;
  return item.label === "out" && item.by ? (
    <>
      So <q className="serif">{labelText(item.id)}</q> is answered, because its reply <q className="serif">{labelText(item.by)}</q> stands.
      {k > 0 && (k === 1 ? " You skipped the other reply." : ` You skipped the other ${num(k)}.`)}
    </>
  ) : (
    <>
      So <q className="serif">{labelText(item.id)}</q> stands, because {allFail(item.replies)}.
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
              That decides {num(items.length)} moves in a row, ending with <q className="serif">{labelText(top.id)}</q>, which {top.label === "out" ? "is answered" : "stands"}.
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
function NodeLine({ id, label, className = "" }: { id: string; label: Label; className?: string }) {
  const { ix } = useAtlas();
  const labelText = useLabelText();
  const n = ix.nodes.get(id)?.node;
  const side = n?.side ?? "skeptic";
  return (
    <p className={`wk-v-node s-${side} ${className}`}>
      <Glyph side={side} label={label} size={13} />
      <span className="wk-v-who mono">{WHO_SHORT[side]}</span>
      <span className={`serif ${label === "out" ? "lab-out" : label === "in" ? "lab-in" : ""}`}>{labelText(id)}</span>
    </p>
  );
}

function LitMove({ prompt: p, bar }: { prompt: Extract<WalkPrompt, { kind: "ask" }>; bar: ReactNode }) {
  const { ix, labelOf, toPlain, openNode } = useAtlas();
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
                {n.quote.who}
                {n.quote.cite ? ` · ${n.quote.cite}` : ""}
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
          <p className="wk-cedes-t serif">{toPlain(cedesText(n.cedes))}</p>
        </div>
      )}
      <div className="wk-ask">
        {p.leaf && <p className="wk-ask-k mono">Nobody replies to this</p>}
        <p className="wk-ask-q serif">{p.leaf ? "Does it hold?" : `Reject it now, or see the ${p.replies > 1 ? "replies" : "reply"} first?`}</p>
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

/** The rule (the Defender must answer every part, the Objector needs one) and what is left, for an unsettled end of a part. */
function remainingText(end: ProngEnd, total: number): string {
  const rest = Array.from({ length: total - end.index - 1 }, (_, k) => end.index + 1 + k);
  const decided = end.ahead.map((a) => a.index);
  const open = rest.filter((i) => !decided.includes(i));
  const rule = "The Defender has to answer every part of this objection. The Objector needs only one part to stand.";
  if (decided.length === 0) return `${rule} ${Num(open.length)} more ${open.length === 1 ? "part" : "parts"} to go.`;
  return `${rule} What you marked earlier already decides ${partList(decided)}, and ${partList(open)} ${isAre(open.length)} still to come.`;
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
        One reply that stands is enough to answer a move, so {k === 1 ? "the other reply" : `the other ${num(k)}`} can’t change this result. You can still read{" "}
        {k === 1 ? "it" : "them"} if you like.
      </p>
      {end && (
        <p className="wk-v-sub">
          {!end.final
            ? remainingText(end, obj.prongs.length)
            : end.ahead.length > 0
              ? `What you marked earlier already decides ${partList(end.ahead.map((a) => a.index))}.`
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
  else if (by.kind === "this") sub = `So Objection ${obj.numeral} stands, because the Objector needs only one part to stand.${worth}`;
  else if (by.kind === "earlier") sub = `Objection ${obj.numeral} still stands, because part ${by.index + 1} stood and the Objector needs only one part.${worth}`;
  else sub = `Objection ${obj.numeral} stands anyway. What you marked earlier leaves part ${by.index + 1} standing, and the Objector needs only one part.${worth}`;

  return (
    <article className={`wk-verdict wk-pend st-${p.label}`} aria-labelledby="wk-pend-h">
      <p className="wk-k mono">
        Part {p.index + 1} of {total} · {STATUS[p.label].toLowerCase()}
      </p>
      <NodeLine id={p.prong} label={p.label} />
      <h3 id="wk-pend-h" className="wk-v-line serif" tabIndex={-1} data-wk-head="">
        {p.label === "in" ? (
          why.kind === "judged" ? (
            <>Stands. You said it holds.</>
          ) : (
            <>Stands, because {allFail(why.kind === "all-fail" ? why.replies : 2)}.</>
          )
        ) : why.kind === "reply" ? (
          <>
            Answered, because the reply <q>{labelText(why.by)}</q> stands.
          </>
        ) : (
          <>Answered. You said it fails.</>
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
        {OBJ_STATUS[label]} · {callsHere} of {det.total} moves marked
      </p>

      {chips.length > 0 && (
        <div className="wk-done-more">
          <p className="wk-k mono">{label === "undec" ? "These could also settle it" : "It also rests on"}</p>
          <div className="wk-chips">
            {shown.map((id) => {
              const n = ix.nodes.get(id)?.node;
              return (
                <button key={id} type="button" className={`chip wk-nodechip s-${n?.side ?? "skeptic"}`} onClick={() => openNode(id)}>
                  {n && <Glyph side={n.side} label={labelOf(id)} size={11} />}
                  <span className="mono wk-nodechip-addr">{address(ix, id)}</span>
                  <span>{labelText(id)}</span>
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
          const reason =
            skipped && l === "undec"
              ? "skipped"
              : why.kind === "judged"
                ? `you said it ${why.j}`
                : why.kind === "all-fail"
                  ? allFail(why.replies)
                  : why.kind === "reply"
                    ? `“${labelText(why.by)}” stands`
                    : "";
          return (
            <li key={p.id} className={`s-${p.side}`}>
              <span className="wk-dp-n mono">Part {i + 1}</span>
              <span className="wk-dp-label">
                <Glyph side={p.side} label={l} size={12} />
                <span className={`serif ${l === "out" ? "lab-out" : ""}`}>{labelText(p.id)}</span>
              </span>
              <span className="wk-dp-why">
                <span className="wk-dp-who mono">{WHO_SHORT[p.side]}</span>
                <span className="wk-dp-sep" aria-hidden>
                  ·
                </span>
                <span className={`wk-st st-${l}`}>{STATUS[l]}</span>
                {reason && <span className="wk-dp-reason"> · {reason}</span>}
                {earlier && <span className="wk-dp-reason"> · decided before you started</span>}
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
            Step through Objection {next.numeral} <span className="wk-arrow" aria-hidden>→</span>
          </button>
        )}
        <button type="button" className="btn" onClick={() => go({ view: "objection", o: obj.id })}>
          See all moves
        </button>
        <button type="button" className="btn" onClick={() => go({ view: "ledger" })}>
          Where you stand
        </button>
      </div>

      <div className="wk-done-foot">
        <p>This result comes from your calls and nothing else.</p>
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
  promptKey,
  context,
  onUndo,
  on,
}: {
  where: "inline" | "dock";
  acts: BarAct[];
  promptKey: string;
  context: ReactNode;
  onUndo: (() => void) | null;
  /** Dock only: revealed (the reader has reached the lit move). */
  on: boolean;
}) {
  const dock = where === "dock";
  return (
    <div className={`wk-bar ${dock ? `wk-bar-pin ${on ? "is-on" : ""}` : "wk-bar-inline"}`} role="group" aria-label="Your answer">
      {dock && context && <p className="wk-dock-ctx">{context}</p>}
      <div className={`wk-bar-btns n${acts.length} ${dock && onUndo ? "with-undo" : ""}`}>
        {acts.map((a) => (
          // Keyed by the question too, so a fresh button replaces the old one under the finger.
          <button key={`${promptKey}:${a.key}`} type="button" className={`wk-btn ${a.tone}`} onClick={a.run} aria-keyshortcuts={a.kbd}>
            <span className="wk-btn-l">{dock && a.short ? a.short : a.label}</span>
            {a.kbd && !dock && (
              <kbd className="wk-kbd" aria-hidden>
                {a.kbd}
              </kbd>
            )}
          </button>
        ))}
        {dock && onUndo && (
          <button type="button" className="wk-btn wk-undo-ic" onClick={onUndo} aria-label="Undo last step">
            <UndoIcon size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
