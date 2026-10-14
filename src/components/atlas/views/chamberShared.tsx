"use client";

/* What the chamber's parts share: the chamber API (context), the chamber's
   own vocabulary, and the small pieces used by more than one of the thread,
   the turns and the chart — Why?, the call buttons, status, move chips. */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createContext, useContext, useId, useState, type CSSProperties } from "react";
import { useAtlas } from "../context";
import type { Explanation } from "../explain";
import { address } from "../helpers";
import { Glyph } from "../primitives";
import type { Judgment, Label, Objection, Side } from "../types";

export { q } from "../explain";

/* ---------------- vocabulary ---------------- */

export const SIDE_WORD: Record<Side, string> = { skeptic: "Objector", theist: "Respondent", spinoza: "Spinoza" };
export const SIDE_THE: Record<Side, string> = { skeptic: "The Objector", theist: "The Respondent", spinoza: "Spinoza" };
export const SIDE_POSS: Record<Side, string> = { skeptic: "the Objector’s", theist: "the Respondent’s", spinoza: "Spinoza’s" };
export const STATUS_WORD: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };
export const OBJ_STATUS_WORD: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Undecided" };
const NUM_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export const numWord = (n: number) => NUM_WORDS[n] ?? String(n);
export const callWord = (j: Judgment) => (j === "holds" ? "Holds" : "Fails");

/** The cue that opens a turn: the Summa's formulas for rounds 1–2, plain speech below. */
export function cueFor(depth: number, side: Side): string {
  if (side === "spinoza") return "Spinoza cuts in";
  if (depth === 1) return "It seems that";
  if (depth === 2 && side === "theist") return "On the contrary";
  return side === "theist" ? "The Respondent replies" : "The Objector rejoins";
}

/** What a move is called, by who makes it and where: "objection", "reply", "rejoinder"… */
export function moveNoun(depth: number, side: Side): string {
  if (depth === 1) return "objection";
  if (side === "theist") return "reply";
  if (side === "skeptic") return "rejoinder";
  return "interjection";
}

export type Seat = "left" | "right" | "center";
export const seatOf = (side: Side): Seat => (side === "skeptic" ? "left" : side === "theist" ? "right" : "center");

/* ---------------- DOM helpers ---------------- */

export function turnEl(id: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(`[data-turn="${CSS.escape(id)}"]`);
}

/** Bottom edge of whatever is pinned to the top of the viewport (the top bar,
    plus the one-hop back chip when it is showing), in viewport px. */
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

export type FocusSource = "thread" | "chart" | "fork" | "link" | "key";

export interface Ripple {
  key: number;
  /** Depth of the move that was just called; changes travel up from here. */
  origin: number;
  changed: Set<string>;
}

export interface ChamberApi {
  o: Objection;
  focusId: string;
  path: string[];
  /** How many moves of this objection the reader has called. */
  calls: number;
  focus: (id: string, from?: FocusSource) => void;
  /** Record (or with null, withdraw) the reader's call on a move. */
  decide: (id: string, j: Judgment | null) => void;
  /** Follow a cross-link; leaves a one-hop "back" chip when it changes chamber. */
  jump: (id: string) => void;
  ripple: Ripple | null;
}

export const ChamberCtx = createContext<ChamberApi | null>(null);

export function useChamber(): ChamberApi {
  const v = useContext(ChamberCtx);
  if (!v) throw new Error("useChamber must be used inside the Chamber");
  return v;
}

/** Inline style that staggers a status transition: deeper moves change first.
    Only while a ripple is running; otherwise colors change without delay. */
export function rippleStyle(ripple: Ripple | null, depth: number): CSSProperties | undefined {
  if (!ripple) return undefined;
  const delay = Math.max(0, ripple.origin - depth) * 80;
  return { ["--ch-delay" as string]: `${delay}ms` };
}

/* ---------------- small shared pieces ---------------- */

/** "Why?" — a toggle that reveals a one-sentence explanation of a computed status. */
export function WhyLine({ explanation, onGo, className = "" }: { explanation: Explanation; onGo?: (id: string) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const pid = useId();
  if (!explanation.text) return null;
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
                      <span className="ch-u">Go there</span>
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

/** Status glyph + word, plus the reader's own stamp if they ruled on it. */
export function TurnStatus({ id, side, label, call, note = false }: { id: string; side: Side; label: Label; call?: Judgment; note?: boolean }) {
  return (
    <span className={`ch-status st-${label}`} data-status-for={id}>
      <Glyph side={side} label={label} size={11} />
      <span className="ch-status-word">{STATUS_WORD[label]}</span>
      {call ? <span className="your-call ch-stamp">Your call · {callWord(call)}</span> : note ? <span className="ch-status-note">on your calls</span> : null}
    </span>
  );
}

/** The two-button call (Holds always on the left), styled like the shared judge control. */
export function CallButtons({ id, side, call, compact = false }: { id: string; side: Side; call?: Judgment; compact?: boolean }) {
  const { decide } = useChamber();
  return (
    <div className={`judge-btns ch-judge s-${side} ${compact ? "compact" : ""}`} role="group" aria-label="Your call on this move">
      {(["holds", "fails"] as const).map((j) => (
        <button
          key={j}
          type="button"
          className={`judge-btn j-${j} ${call === j ? "on" : ""}`}
          aria-pressed={call === j}
          aria-keyshortcuts={j === "holds" ? "h" : "f"}
          onClick={(e) => {
            e.stopPropagation();
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
  const { ix, labelOf, toPlain } = useAtlas();
  const info = ix.nodes.get(id);
  if (!info) return null;
  const l = labelOf(id);
  return (
    <li className="ch-xref">
      <button type="button" className={`ch-xchip s-${info.node.side}`} onClick={() => onGo(id)}>
        <Glyph side={info.node.side} label={l} size={11} className="ch-xglyph" />
        <span className="ch-xaddr mono">{address(ix, id)}</span>
        <span className={`ch-xlabel ${l === "out" ? "lab-out" : ""}`}>{toPlain(info.node.label)}</span>
        <span className="ch-xgo" aria-hidden>
          →
        </span>
      </button>
      {why && <p className="ch-xwhy">{why}</p>}
    </li>
  );
}
