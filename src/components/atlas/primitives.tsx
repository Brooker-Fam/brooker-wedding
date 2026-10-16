"use client";

/* Small shared pieces: side tokens, the reader's Holds / Fails control, status
   badges, person chips, and RichText (markup wired to peeks and node jumps). */

import { motion } from "framer-motion";
import { memo, useMemo, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { useAtlas, useAtlasStatic } from "./context";
import { tick } from "./haptics";
import { Rich, type RichRenderers } from "./markup";
import { initials, usePeek } from "./peek";
import type { Judgment, Label, Side } from "./types";

export const SIDE_META: Record<Side, { word: string; glyph: string; voice: string }> = {
  skeptic: { word: "Objector", glyph: "▲", voice: "the objection" },
  theist: { word: "Defender", glyph: "●", voice: "the reply" },
  spinoza: { word: "Spinoza", glyph: "◆", voice: "Spinoza's view" },
};

/** Inline SVG glyph for a side: ▲ Objector, ● Defender, ◆ Spinoza. Fill follows status.
    Memoized (primitive props only), since a page draws dozens of them. */
export const Glyph = memo(function Glyph({ side, label = "undec", size = 12, className = "" }: { side: Side; label?: Label; size?: number; className?: string }) {
  const h = size / 2;
  const shape =
    side === "skeptic" ? (
      <path d={`M${h},${size * 0.08}L${size * 0.94},${size * 0.86}L${size * 0.06},${size * 0.86}Z`} />
    ) : side === "spinoza" ? (
      <path d={`M${h},${size * 0.04}L${size * 0.9},${h}L${h},${size * 0.96}L${size * 0.1},${h}Z`} />
    ) : (
      <circle cx={h} cy={h} r={size * 0.4} />
    );
  return (
    <svg className={`glyph-svg s-${side} gl-${label} ${className}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {shape}
    </svg>
  );
});

export function SideTok({ side, children, className = "" }: { side: Side; children?: ReactNode; className?: string }) {
  const m = SIDE_META[side];
  return (
    <span className={`side-tok s-${side} ${className}`}>
      <span className="glyph" aria-hidden>
        {m.glyph}
      </span>
      {children ?? m.word}
    </span>
  );
}

export const LABEL_META: Record<Label, { word: string; long: string }> = {
  in: { word: "Stands", long: "stands" },
  out: { word: "Answered", long: "is answered" },
  undec: { word: "Open", long: "is still open" },
};

export function StatusBadge({ label, objectionLevel = false }: { label: Label; objectionLevel?: boolean }) {
  // One set of status words for moves and objections alike.
  const word = objectionLevel ? { in: "Stands", out: "Answered", undec: "Open" }[label] : LABEL_META[label].word;
  return (
    <span className={`status-badge st-${label}`}>
      <span className="dot" aria-hidden />
      {word}
    </span>
  );
}

/** The reader's call on one move. A press ticks (where the phone can vibrate) and the chosen
    pill stamps (atlas.css; the Shell marks the pressed button). Not rendered anywhere at
    present: the chamber has its own pair (chamberShared.tsx CallButtons), which chamber.css
    sizes for phones (full width, 48px tall). */
export function JudgeControl({ id, side, compact = false }: { id: string; side: Side; compact?: boolean }) {
  const { judgments, judge, labelOf } = useAtlas();
  const current = judgments[id] ?? null;
  const computed = labelOf(id);
  const set = (j: Judgment) => judge(id, current === j ? null : j);
  return (
    <div className={`judge s-${side} ${compact ? "compact" : ""}`} role="group" aria-label="Your call on this move">
      {!compact && <span className="judge-q mono">Your call</span>}
      <div className="judge-btns">
        {(["holds", "fails"] as const).map((j) => (
          <button
            key={j}
            type="button"
            className={`judge-btn j-${j} ${current === j ? "on" : ""}`}
            aria-pressed={current === j}
            data-atl-ticks=""
            onClick={(e) => {
              e.stopPropagation();
              // The second click of a double tap would undo the first (keyboard activation has detail 0).
              if (e.detail > 1) return;
              tick();
              set(j);
            }}
          >
            {current === j && <motion.span layoutId={`judge-pill-${id}`} className="judge-pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
            <span className="judge-label">{j === "holds" ? "Holds" : "Fails"}</span>
          </button>
        ))}
      </div>
      {!compact && !current && (
        <span className="judge-hint">
          {computed === "undec" ? "Open. You haven't marked it." : computed === "in" ? "Stands, because every reply to it has failed or been answered." : "Answered, because a reply to it stands."}
        </span>
      )}
    </div>
  );
}

/** A person. Neutral in colour: a thinker's own `side` isn't a record of how the moves use
    them (the peek says "Used by …" in words). Reads only the static context, so a call
    doesn't re-render it. */
export const ThinkerChip = memo(function ThinkerChip({ id }: { id: string }) {
  const { ix, thinkerName } = useAtlasStatic();
  const peek = usePeek();
  const th = ix.thinkers.get(id);
  return (
    <button
      type="button"
      className="chip s-neutral"
      aria-haspopup="dialog"
      aria-expanded={false}
      onClick={(e) => peek({ kind: "thinker", id, rect: e.currentTarget.getBoundingClientRect() })}
    >
      <span className="monogram" aria-hidden>
        {initials(th?.name ?? id)}
      </span>
      <span>{th?.name ?? thinkerName(id)}</span>
      {th?.life && <span className="chip-life mono">{shortLife(th.life)}</span>}
    </button>
  );
});

function shortLife(life: string) {
  return life.replace(/^c\.\s*/, "c.");
}

/** Inline references are spans with button semantics (not <button>s), so they
    wrap like words and never strand punctuation at a line end. */
function act(fn: (el: HTMLElement) => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    onClick: (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      fn(e.currentTarget);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        fn(e.currentTarget);
      }
    },
  };
}

/** Markup-aware text: terms and thinkers open peeks, node refs jump.
    Memoized on its two props (pass a stable `onNode`), and it reads only the static
    context, so a Holds/Fails call leaves every visible move's text alone. */
export const RichText = memo(function RichText({ text, onNode }: { text: string; onNode?: (id: string) => void }) {
  const { thinkerName, termName, openNode, ix } = useAtlasStatic();
  const peek = usePeek();
  const r = useMemo<RichRenderers>(() => {
    // The peek sets aria-expanded="true" on the opener while its card is open (see peek.tsx).
    const open = (kind: "term" | "thinker", id: string) => ({
      ...act((el) => peek({ kind, id, rect: el.getBoundingClientRect() })),
      "aria-haspopup": "dialog" as const,
      "aria-expanded": false,
    });
    return {
      thinkerName,
      termName,
      nodeName: (id) => ix.nodes.get(id)?.node.label,
      term: (id, shown, k) => (
        <span key={k} className="ref-term" {...open("term", id)}>
          {shown}
        </span>
      ),
      thinker: (id, shown, k) => (
        <span key={k} className="ref-thinker" {...open("thinker", id)}>
          {shown}
        </span>
      ),
      node: (id, shown, k) => {
        const side = ix.nodes.get(id)?.node.side ?? "theist";
        return (
          <span key={k} className={`ref-node s-${side}`} {...act(() => (onNode ?? openNode)(id))}>
            {shown || ix.nodes.get(id)?.node.label}
          </span>
        );
      },
    };
  }, [thinkerName, termName, ix, peek, onNode, openNode]);
  return <Rich text={text} r={r} />;
});
