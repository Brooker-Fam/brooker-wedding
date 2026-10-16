"use client";

/* What the objection page's parts share: the page API (context), its small
   vocabulary, and the pieces used by more than one of the thread, the moves
   and the chart (Why?, the call buttons, status, move chips). */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createContext, useContext, useId, useState, type CSSProperties } from "react";
import { useAtlas } from "../context";
import { q, type Explanation } from "../explain";
import { address } from "../helpers";
import { Glyph } from "../primitives";
import type { DisputationIndex } from "../semantics";
import type { Judgment, Label, Objection, Side } from "../types";
import { YouMark } from "./marks";

export { q };

/* ---------------- vocabulary ---------------- */

export const SIDE_WORD: Record<Side, string> = { skeptic: "Objector", theist: "Defender", spinoza: "Spinoza" };
export const SIDE_THE: Record<Side, string> = { skeptic: "The Objector", theist: "The Defender", spinoza: "Spinoza" };
export const SIDE_POSS: Record<Side, string> = { skeptic: "the Objector’s", theist: "the Defender’s", spinoza: "Spinoza’s" };
export const STATUS_WORD: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };
export const OBJ_STATUS_WORD: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };
const NUM_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export const numWord = (n: number) => NUM_WORDS[n] ?? String(n);
export const callWord = (j: Judgment) => (j === "holds" ? "Holds" : "Fails");

/** The status as the reader should read it. A move the reader called carries
    their call, not "Answered": nobody may have answered a move they rejected. */
export function statusText(label: Label, call?: Judgment): string {
  return call ? `You said it ${call}` : STATUS_WORD[label];
}

/** The status a move's glyph draws. A move the reader marked Fails is drawn hollow, not with
    the dashed "Answered" ring: nobody answered it. (The ■ beside it says it is the reader's call.) */
export function shownLabel(label: Label, call?: Judgment | null): Label {
  return call === "fails" ? "undec" : label;
}

/** Whether a move's claim takes the dotted "Answered" under-mark: only when a standing reply answered it. */
export function answeredMark(label: Label, call?: Judgment | null): boolean {
  return label === "out" && call !== "fails";
}

/** The cue that opens a move: who is speaking, in plain words. */
export function cueFor(depth: number, side: Side): string {
  if (side === "spinoza") return "Spinoza cuts in";
  if (depth === 1) return "The Objector argues";
  return side === "theist" ? "The Defender replies" : "The Objector replies";
}

/** What a move is called in running text: the opening "argument", then "reply". */
export function moveNoun(depth: number): string {
  return depth === 1 ? "argument" : "reply";
}

const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
/** "the reply" when it is the only one; otherwise "the second reply". */
function nthReply(ix: DisputationIndex, id: string): string {
  const info = ix.nodes.get(id);
  const k = (info?.order ?? 0) + 1;
  const sibs = info?.parent ? (ix.nodes.get(info.parent)?.childIds.length ?? 1) : 1;
  if (sibs <= 1) return "the reply";
  return ORDINALS[k - 1] ? `the ${ORDINALS[k - 1]} reply` : `reply ${k}`;
}

/** Where a move sits, for the eye: "Part 1 · Round 3", or "Round 3" when the objection has one part.
    (The dotted address, "I·1.2.1", stays in tooltips and the Outline.) */
export function placeLabel(ix: DisputationIndex, id: string): string {
  const info = ix.nodes.get(id);
  if (!info) return "";
  const o = ix.objections.get(info.objection);
  const round = `Round ${info.depth}`;
  if ((o?.prongs.length ?? 1) <= 1) return round;
  return `Part ${(ix.nodes.get(info.path[0])?.order ?? 0) + 1} · ${round}`;
}

/** Where a move sits, spelled out for a screen reader: "Objection I, part 1, round 5". */
export function spellPlace(ix: DisputationIndex, id: string): string {
  const info = ix.nodes.get(id);
  if (!info) return "";
  const o = ix.objections.get(info.objection);
  const out = [`Objection ${o?.numeral ?? "?"}`];
  if ((o?.prongs.length ?? 1) > 1) out.push(`part ${(ix.nodes.get(info.path[0])?.order ?? 0) + 1}`);
  out.push(`round ${info.depth}`);
  return out.join(", ");
}

/** An address spelled out, with no dots or numbers-within-numbers.
    "I·1" → "Objection I, part 1"; "I·1.2" → "Objection I, part 1, the second reply";
    "I·1.2.3" → "Objection I, part 1, round 3, the third reply to the round 2 move"
    (and "the reply" when a move has only one). */
export function spellAddress(ix: DisputationIndex, id: string): string {
  const info = ix.nodes.get(id);
  if (!info) return "";
  const o = ix.objections.get(info.objection);
  const many = (o?.prongs.length ?? 1) > 1;
  const out = [`Objection ${o?.numeral ?? "?"}`];
  if (many) out.push(`part ${(ix.nodes.get(info.path[0])?.order ?? 0) + 1}`);
  const depth = info.path.length;
  if (depth === 1) {
    if (!many) out.push("the opening argument");
  } else if (depth === 2) {
    out.push(many ? nthReply(ix, id) : `${nthReply(ix, id)} to its opening argument`);
  } else {
    out.push(`round ${depth}`, `${nthReply(ix, id)} to the round ${depth - 1} move`);
  }
  return out.join(", ");
}

export type Seat = "left" | "right" | "center";
export const seatOf = (side: Side): Seat => (side === "skeptic" ? "left" : side === "theist" ? "right" : "center");

/* ---------------- DOM helpers ---------------- */

export function turnEl(id: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(`[data-turn="${CSS.escape(id)}"]`);
}

/** After a control that is about to unmount (e.g. "Clear call above"), put keyboard focus back on a
    move, so H, F and the arrows keep working: on `id`, or on `fallback` if `id` isn't on screen. */
export function focusTurn(id: string, fallback?: string) {
  requestAnimationFrame(() => {
    const pick = (x?: string) => (x ? turnEl(x)?.querySelector<HTMLElement>("[data-turn-heading], .ch-hit") : null);
    (pick(id) ?? pick(fallback))?.focus({ preventScroll: true });
  });
}

/** Bottom edge of whatever is pinned to the top of the viewport (the top bar, the place bar
    under it on phones and tablets, and the one-hop back chip when it is showing), in viewport px.
    The place bar counts whether or not it is showing yet: any move brought into view brings the
    thread with it, and the bar shows whenever the thread is on screen. */
export function topInset(): number {
  let y = 0;
  const bar = document.querySelector<HTMLElement>(".sh-bar");
  if (bar) {
    const r = bar.getBoundingClientRect();
    if (r.bottom > 0) y = r.bottom;
  }
  if (!y) {
    const root = document.querySelector<HTMLElement>(".atl") ?? document.documentElement;
    const v = parseFloat(getComputedStyle(root).getPropertyValue("--bar-h"));
    y = Number.isFinite(v) && v > 0 ? v : 56;
  }
  const loc = document.querySelector<HTMLElement>(".ch-loc");
  if (loc) y += loc.offsetHeight;
  // The back chip is sticky: wherever it is now, once the page scrolls it pins at its `top`.
  const back = document.querySelector<HTMLElement>(".ch-backbar");
  if (back) {
    const h = back.getBoundingClientRect().height;
    const pin = parseFloat(getComputedStyle(back).top);
    if (h > 0) y = Math.max(y, (Number.isFinite(pin) ? pin : y + 10) + h);
  }
  return y;
}

/* ---------------- chamber API (shared by thread, turns, chart) ---------------- */

/** What moved the focus. "swipe": a sibling reply swiped in (its heading takes focus quietly, with no ring). */
export type FocusSource = "thread" | "chart" | "fork" | "swipe" | "link" | "key";

export interface Ripple {
  key: number;
  /** Depth of the move that was just called; changes travel up from here. */
  origin: number;
  changed: Set<string>;
  /** Moves whose ring has finished playing, so a remount never replays it. */
  done: Set<string>;
}

export interface ChamberApi {
  o: Objection;
  focusId: string;
  path: string[];
  /** How many moves of this objection the reader has called. */
  calls: number;
  /** Open a move. `at` is where (viewport px) the move's card should sit if it isn't on the page
      yet, e.g. a sibling reply taking the place of the card the reader swiped away. */
  focus: (id: string, from?: FocusSource, at?: number) => void;
  /** Record (or with null, withdraw) the reader's call on a move. */
  decide: (id: string, j: Judgment | null) => void;
  /** Follow a cross-link; leaves a one-hop "back" chip when it changes chamber. */
  jump: (id: string) => void;
  /** Undo the reader's last call (the U key). False when there is nothing to undo. */
  undo: () => boolean;
}

export const ChamberCtx = createContext<ChamberApi | null>(null);

export function useChamber(): ChamberApi {
  const v = useContext(ChamberCtx);
  if (!v) throw new Error("useChamber must be used inside the Chamber");
  return v;
}

/** What never changes while the reader makes calls or moves along the thread: the index and
    stable versions of the page's actions. Folded moves read only this, so a call re-renders
    only the moves whose status changed. */
export interface ChamberStatic {
  ix: DisputationIndex;
  toPlain: (s: string) => string;
  focus: (id: string, from?: FocusSource, at?: number) => void;
  decide: (id: string, j: Judgment | null) => void;
  jump: (id: string) => void;
}

export const ChamberStaticCtx = createContext<ChamberStatic | null>(null);

export function useChamberStatic(): ChamberStatic {
  const v = useContext(ChamberStaticCtx);
  if (!v) throw new Error("useChamberStatic must be used inside the Chamber");
  return v;
}

/** The last call's ripple. Never cleared by a timer: each ring removes itself when it ends. */
export const RippleCtx = createContext<Ripple | null>(null);

/** The staggered delay (ms) of a move's status change after a call: deeper moves change first.
    Undefined for moves the call didn't change (they have nothing to transition). */
export function rippleDelay(ripple: Ripple | null, id: string, depth: number): number | undefined {
  if (!ripple || !ripple.changed.has(id)) return undefined;
  return Math.max(0, ripple.origin - depth) * 80;
}

/** Inline style that staggers a status transition (see rippleDelay). */
export function delayStyle(ms: number | undefined): CSSProperties | undefined {
  return ms === undefined ? undefined : { ["--ch-delay" as string]: `${ms}ms` };
}

/** The ring that plays once round a move whose status a call just changed. When it ends it hides
    itself without a re-render (no commit at all); the next render, if any, leaves it out. */
export function RippleMark({ id, depth }: { id: string; depth: number }) {
  const ripple = useContext(RippleCtx);
  const delay = rippleDelay(ripple, id, depth);
  if (!ripple || delay === undefined || ripple.done.has(id)) return null;
  const done = ripple.done;
  return (
    <span
      key={ripple.key}
      className="ch-ripple"
      aria-hidden
      style={delayStyle(delay)}
      onAnimationEnd={(e) => {
        done.add(id);
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

/* ---------------- small shared pieces ---------------- */

/** "Why?": a toggle that shows a one-sentence explanation of a computed status. */
export function WhyLine({ explanation, onGo, className = "" }: { explanation: Explanation; onGo?: (id: string) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const pid = useId();
  if (!explanation.text) return null;
  // "Go there" when the sentence quotes where the link goes; otherwise say where.
  const link = explanation.link;
  const goText = link && link.part && !explanation.text.includes(q(link.label)) ? `Go to part ${link.part}` : "Go there";
  return (
    <div className={`ch-why ${className}`}>
      <button type="button" className="ch-why-btn" aria-expanded={open} aria-controls={pid} onClick={() => setOpen((v) => !v)}>
        Why?
        <span className="ch-why-chev" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {/* always in the DOM so aria-controls has a target; empty (and hidden) while closed */}
      <div id={pid} className="ch-why-region">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className={`ch-why-body why-${explanation.tone}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <p>
                {explanation.text}
                {explanation.link && onGo && (
                  <>
                    {" "}
                    <button type="button" className="ch-why-go" onClick={() => onGo(explanation.link!.id)}>
                      <span className="ch-u">{goText}</span>
                      <span aria-hidden>→</span>
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Status glyph + word. A move the reader called shows their call (■ and a stamp) instead. */
export function TurnStatus({ id, side, label, call }: { id: string; side: Side; label: Label; call?: Judgment }) {
  return (
    <span className={`ch-status st-${shownLabel(label, call)}`} data-status-for={id}>
      <Glyph side={side} label={shownLabel(label, call)} size={11} />
      {call && <YouMark size={10} className="ch-you" />}
      {call ? <span className="your-call ch-stamp">{statusText(label, call)}</span> : <span className="ch-status-word">{STATUS_WORD[label]}</span>}
    </span>
  );
}

/** The two-button call (Holds always on the left), styled like the shared judge control. */
export function CallButtons({ id, side, call, compact = false, labelledBy }: { id: string; side: Side; call?: Judgment; compact?: boolean; labelledBy?: string }) {
  const { decide } = useChamber();
  return (
    <div
      className={`judge-btns ch-judge s-${side} ${compact ? "compact" : ""}`}
      role="group"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Your call: does this move hold or fail?"}
      aria-keyshortcuts="H F U"
    >
      {(["holds", "fails"] as const).map((j) => (
        <button
          key={j}
          type="button"
          className={`judge-btn j-${j} ${call === j ? "on" : ""}`}
          aria-pressed={call === j}
          aria-keyshortcuts={j === "holds" ? "h" : "f"}
          onClick={(e) => {
            e.stopPropagation();
            // The second click of a double tap would undo the first (keyboard activation has detail 0).
            if (e.detail > 1) return;
            decide(id, call === j ? null : j);
          }}
        >
          {call === j && <motion.span layoutId={`ch-pill-${id}-${compact ? "c" : "f"}`} className="judge-pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
          <span className="judge-label">{callWord(j)}</span>
        </button>
      ))}
    </div>
  );
}

/** A chip that points at another move: glyph, address, claim. */
export function MoveChip({ id, why, onGo }: { id: string; why?: string; onGo: (id: string) => void }) {
  const { ix, labelOf, toPlain, judgments } = useAtlas();
  const here = useContext(ChamberCtx)?.o.id;
  const info = ix.nodes.get(id);
  if (!info) return null;
  // "Part 1 · Round 3"; a move in another objection names it first.
  const place = info.objection === here ? placeLabel(ix, id) : `Objection ${ix.objections.get(info.objection)?.numeral ?? "?"} · ${placeLabel(ix, id)}`;
  const l = labelOf(id);
  const call = judgments[id];
  return (
    <li className="ch-xref">
      <button type="button" className={`ch-xchip s-${info.node.side}`} onClick={() => onGo(id)}>
        <Glyph side={info.node.side} label={shownLabel(l, call)} size={11} className="ch-xglyph" />
        {call && <YouMark size={9} className="ch-xyou" />}
        {/* the dotted address is for the eye; a screen reader hears it spelled out */}
        <span className="ch-xaddr mono" title={address(ix, id)} aria-hidden>
          {place}
        </span>
        <span className="sr-only">
          {spellAddress(ix, id)}
          {call ? `, you said it ${call}` : ""}:{" "}
        </span>
        <span className={`ch-xlabel ${answeredMark(l, call) ? "lab-out" : ""}`}>{toPlain(info.node.label)}</span>
        <span className="ch-xgo" aria-hidden>
          →
        </span>
      </button>
      {why && <p className="ch-xwhy">{why}</p>}
    </li>
  );
}
