"use client";

/* The thread: one branch of an objection read as a script, from the part
   down through the focused move to the last move on that branch.
   Objector moves sit left, Defender moves right, Spinoza in the middle,
   and a thin connector zig-zags between them. Wherever the branch could have
   gone another way, a fork shows the other replies and what each side needs.
   After the last move, an empty seat ("No reply yet") waits opposite it. */

import { useContext, useId, type KeyboardEvent } from "react";
import { useAtlas } from "../context";
import { depthBelow, movesBelow } from "../helpers";
import { Glyph } from "../primitives";
import type { DisputationIndex, NodeInfo } from "../semantics";
import type { Side } from "../types";
import {
  CallButtons,
  SIDE_POSS,
  SIDE_THE,
  SIDE_WORD,
  answeredMark,
  focusTurn,
  moveNoun,
  numWord,
  RippleCtx,
  delayStyle,
  rippleDelay,
  seatOf,
  shownLabel,
  statusText,
  turnEl,
  useChamber,
  type Seat,
} from "./chamberShared";
import { YouMark } from "./marks";
import Turn from "./Turn";

/** Elements on which the arrow keys walk the thread (anywhere else they scroll the page). */
const NAV_TARGETS = "[data-turn-heading], .ch-hit, .ch-fork-opt, .ch-chev";

const ANCHOR: Record<Seat, number> = { left: 26, center: 50, right: 74 };

/** The zig-zag: a soft curve across the gap from one seat to the next. */
function Connector({ from, to, side, tense = false, short = false }: { from: Seat; to: Seat; side?: Side; tense?: boolean; short?: boolean }) {
  const a = ANCHOR[from];
  const b = ANCHOR[to];
  const h = 40;
  return (
    <div className={`ch-conn ${short ? "short" : ""} ${tense ? "tense" : ""} ${side ? `s-${side}` : ""}`} aria-hidden>
      <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="none">
        <path d={`M${a},0 C${a},${h * 0.55} ${b},${h * 0.45} ${b},${h}`} />
      </svg>
      <span className="ch-conn-dot" style={{ left: `${b}%` }} />
    </div>
  );
}

function ForkIcon() {
  return (
    <svg className="ch-fork-icon" viewBox="0 0 20 20" aria-hidden>
      <path d="M10 2v6M10 8C10 12 4 12 4 18M10 8v10M10 8c0 4 6 4 6 10" />
    </svg>
  );
}

function sideCounts(ix: ReturnType<typeof useAtlas>["ix"], ids: string[]) {
  const c: Record<Side, number> = { skeptic: 0, theist: 0, spinoza: 0 };
  for (const id of ids) {
    const s = ix.nodes.get(id)?.node.side;
    if (s) c[s]++;
  }
  return c;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "The Defender has three replies" / "Four replies, three from the Defender and one from Spinoza". */
function forkTitle(counts: Record<Side, number>, n: number): string {
  const sides = (Object.keys(counts) as Side[]).filter((s) => counts[s] > 0).sort((x, y) => counts[y] - counts[x]);
  if (sides.length === 1) return `${SIDE_THE[sides[0]]} has ${numWord(n)} ${n === 1 ? "reply" : "replies"}`;
  const parts = sides.map((s) => `${numWord(counts[s])} from ${s === "spinoza" ? "Spinoza" : `the ${SIDE_WORD[s]}`}`);
  return `${cap(numWord(n))} replies, ${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** The rule at this fork: the move above stands only if every reply is out, and one standing reply answers it. */
function forkStakes(parent: NodeInfo, n: number): string {
  const above = `${moveNoun(parent.depth)} above`;
  const all = n === 2 ? "both of these are" : `all ${numWord(n)} of these are`;
  const any = n === 2 ? "If either one stands" : "If any one of them stands";
  return `${cap(SIDE_POSS[parent.node.side])} ${above} stands only if ${all} answered or marked Fails. ${any}, the ${above} is answered.`;
}

/** How far a fork option's branch runs: "6 moves · 4 rounds below", or "No reply yet". */
function branchSize(ix: DisputationIndex, id: string): string {
  const m = movesBelow(ix, id);
  if (m === 0) return "No reply yet";
  const d = depthBelow(ix, id);
  return `${m} ${m === 1 ? "move" : "moves"} · ${d} ${d === 1 ? "round" : "rounds"} below`;
}

function Fork({ parentId, current }: { parentId: string; current: string }) {
  const { ix, labelOf, toPlain, judgments } = useAtlas();
  const api = useChamber();
  const ripple = useContext(RippleCtx);
  const parent = ix.nodes.get(parentId);
  if (!parent) return null;
  const kids = parent.childIds;
  const n = kids.length;
  const idx = Math.max(0, kids.indexOf(current));
  const counts = sideCounts(ix, kids);
  const title = forkTitle(counts, n);
  return (
    <div className="ch-fork" role="group" aria-label={title} data-subject={current}>
      <ForkIcon />
      <p className="ch-fork-title">{title}</p>
      <div className="ch-fork-nav">
        <button type="button" className="ch-chev" aria-label="Previous reply" disabled={idx === 0} onClick={() => idx > 0 && api.focus(kids[idx - 1], "fork")}>
          ‹
        </button>
        <span className="ch-fork-count">
          {idx + 1} of {n}
        </span>
        <button type="button" className="ch-chev" aria-label="Next reply" disabled={idx === n - 1} onClick={() => idx < n - 1 && api.focus(kids[idx + 1], "fork")}>
          ›
        </button>
      </div>
      <p className="ch-fork-stakes">{forkStakes(parent, n)}</p>
      <ul className="ch-fork-opts">
        {kids.map((k, i) => {
          const info = ix.nodes.get(k)!;
          const l = labelOf(k);
          const call = judgments[k];
          const shown = shownLabel(l, call);
          const on = k === current;
          return (
            <li key={k}>
              <button
                type="button"
                className={`ch-fork-opt s-${info.node.side} st-${shown} ${on ? "on" : ""}`}
                aria-current={on ? "true" : undefined}
                data-subject={k}
                onClick={() => api.focus(k, "fork")}
                style={delayStyle(rippleDelay(ripple, k, info.depth))}
              >
                <span className="ch-fork-n">{i + 1}</span>
                <Glyph side={info.node.side} label={shown} size={12} />
                <span className="ch-fork-body">
                  <span className="ch-fork-main">
                    <span className={`ch-fork-l ${answeredMark(l, call) ? "lab-out" : ""}`}>{toPlain(info.node.label)}</span>
                    <span className="ch-fork-meta">{branchSize(ix, k)}</span>
                  </span>
                  <span className={`ch-fork-st st-${shown}`}>
                    {call && <YouMark size={9} className="ch-you" />}
                    {statusText(l, call)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type Line = { text: string; who: string; cite: string };

/* Lines for the contradiction note, one from each tradition. Mark 3:25 is checked word for word
   against the KJV; Aristotle's line is copied verbatim from Where you stand (Ledger.tsx), which
   explains the rule it states (Metaphysics IV.3, 1005b, tr. W. D. Ross). */
const CONTRADICTION_QUOTES: Line[] = [
  { text: "it is impossible for any one to believe the same thing to be and not to be", who: "Aristotle", cite: "Metaphysics IV.3, 1005b, tr. W. D. Ross" },
  { text: "And if a house be divided against itself, that house cannot stand.", who: "Mark 3:25", cite: "King James Version" },
];

function hashOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function TensionNote({ node, reply, line }: { node: string; reply: string; line: Line }) {
  const { judgments } = useAtlas();
  const api = useChamber();
  const both = judgments[reply] === "holds";
  return (
    <div className="tension-note ch-tension" role="note">
      <span className="ch-tension-k">Contradiction</span>
      <p>
        {both
          ? "You said both moves hold, but the one below replies to the one above, and a move with a standing reply is answered. These two contradict each other."
          : "You said the move above holds, but your other calls make the reply below it stand, and a move with a standing reply is answered. These two contradict each other."}
      </p>
      <figure className="ch-tension-q">
        <blockquote>“{line.text}”</blockquote>
        <figcaption>
          {line.who}, <cite>{line.cite}</cite>
        </figcaption>
      </figure>
      {/* Clearing a call removes this note (and its buttons), so focus goes back to the move. */}
      <div className="ch-tension-acts">
        <button
          type="button"
          className="btn small"
          onClick={() => {
            api.decide(node, null);
            focusTurn(node, reply);
          }}
        >
          <span aria-hidden>↑</span> Clear call above
        </button>
        {judgments[reply] ? (
          <button
            type="button"
            className="btn small"
            onClick={() => {
              api.decide(reply, null);
              focusTurn(reply, node);
            }}
          >
            <span aria-hidden>↓</span> Clear call below
          </button>
        ) : (
          <button type="button" className="btn small" onClick={() => api.focus(reply, "link")}>
            <span aria-hidden>↓</span> Go to that reply
          </button>
        )}
      </div>
    </div>
  );
}

/* Lines for the empty seat after the last move, one per leaf (picked by id, so it never
   changes under the reader). None is used anywhere else on the site. Each checked word for
   word against a public-domain text: the KJV (Gutenberg #10), Mill's On Liberty (#34901)
   and Veitch's Descartes (#59). */
const CHAIR_QUOTES: Line[] = [
  { text: "He that is first in his own cause seemeth just; but his neighbour cometh and searcheth him.", who: "Proverbs 18:17", cite: "King James Version" },
  { text: "Prove all things; hold fast that which is good.", who: "1 Thessalonians 5:21", cite: "King James Version" },
  { text: "He that answereth a matter before he heareth it, it is folly and shame unto him.", who: "Proverbs 18:13", cite: "King James Version" },
  { text: "Surely I would speak to the Almighty, and I desire to reason with God.", who: "Job 13:3", cite: "King James Version" },
  {
    text: "He must be able to hear them from persons who actually believe them; who defend them in earnest, and do their very utmost for them.",
    who: "John Stuart Mill",
    cite: "On Liberty, ch. 2 (1859)",
  },
  {
    text: "The fatal tendency of mankind to leave off thinking about a thing when it is no longer doubtful, is the cause of half their errors.",
    who: "John Stuart Mill",
    cite: "On Liberty, ch. 2 (1859)",
  },
  {
    text: "the only way in which a human being can make some approach to knowing the whole of a subject, is by hearing what can be said about it by persons of every variety of opinion",
    who: "John Stuart Mill",
    cite: "On Liberty, ch. 2 (1859)",
  },
  { text: "never to accept anything for true which I did not clearly know to be such", who: "René Descartes", cite: "Discourse on the Method, part 2 (1637), tr. John Veitch" },
];

/* Only after an Objector's move, when it is the Defender's turn: the verse is addressed to believers. */
const DEFENDER_CHAIR_QUOTE: Line = {
  text: "be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear",
  who: "1 Peter 3:15",
  cite: "King James Version",
};

/* Its counterpart, only after a Defender's move, when it is the Objector's turn. Checked word for
   word against the Gutenberg text the site links (#9662, sect. X, part I). Unlike the pool above,
   this line also appears in the Timeline and in Objection III. */
const OBJECTOR_CHAIR_QUOTE: Line = {
  text: "A wise man, therefore, proportions his belief to the evidence.",
  who: "David Hume",
  cite: "An Enquiry concerning Human Understanding, sect. X, part I (1748)",
};

function chairQuote(id: string, turn: "defender" | "objector" | null): Line {
  const pool = turn === "defender" ? [...CHAIR_QUOTES, DEFENDER_CHAIR_QUOTE] : turn === "objector" ? [...CHAIR_QUOTES, OBJECTOR_CHAIR_QUOTE] : CHAIR_QUOTES;
  return pool[hashOf(id) % pool.length];
}

function EmptyChair({ leaf, seat }: { leaf: string; seat: Seat }) {
  const { ix, judgments } = useAtlas();
  const api = useChamber();
  const info = ix.nodes.get(leaf);
  if (!info) return null;
  const sources = (info.node.sources ?? []).filter((s) => s.title);
  const focused = api.focusId === leaf;
  const of = `${SIDE_POSS[info.node.side]} ${moveNoun(info.depth)} above`;
  // Whose turn it is after the last move: the other side's (no one's in particular after Spinoza).
  const line = chairQuote(leaf, info.node.side === "skeptic" ? "defender" : info.node.side === "theist" ? "objector" : null);
  return (
    <div className={`ch-chair seat-${seat}`} role="note" aria-label="No reply yet" data-subject={leaf}>
      <span className="ch-chair-k">
        <span className="ch-chair-sq" aria-hidden />
        No reply yet
      </span>
      <p className="ch-chair-t">
        <em>{judgments[leaf] ? `You said it ${judgments[leaf]}.` : "Does it hold?"}</em>
      </p>
      <figure className="ch-chair-q">
        <blockquote>“{line.text}”</blockquote>
        <figcaption>
          {line.who}, <cite>{line.cite}</cite>
        </figcaption>
      </figure>
      {!focused && (
        <div className="ch-chair-call">
          <CallButtons id={leaf} side={info.node.side} call={judgments[leaf]} compact />
          <span className="ch-chair-of">on {of}</span>
        </div>
      )}
      {/* When the last move is open, its own Sources list is right above (under "Sources, people and links"). */}
      {!focused && sources.length > 0 && (
        <div className="ch-chair-read">
          <span className="ch-chair-read-k">Where to read more</span>
          <ul className="ch-chair-srcs">
            {sources.map((s, i) => (
              <li key={i} className="ch-chair-src">
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title}
                    <span aria-hidden> ↗</span>
                  </a>
                ) : (
                  <cite>{s.title}</cite>
                )}
                {s.by && <span className="ch-chair-by">{s.by}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Thread() {
  const { ix, tensions, judgments, labelOf } = useAtlas();
  const api = useChamber();
  const ripple = useContext(RippleCtx);
  const keysId = useId();
  const { path, focusId } = api;
  const tenseKey = (a: string, b: string) => tensions.some((t) => t.node === a && t.reply === b);

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const t = e.target as HTMLElement;
    // While a person or term peek is open, the keys belong to it, not to the move behind it.
    if (t.closest("[role=dialog]") || document.querySelector(".atl .peek")) return;
    if (t.closest("input, textarea, select, [contenteditable='true']")) return;
    // U (or Ctrl/Cmd+Z) undoes the last call, wherever focus is in the thread.
    const undoKey =
      (!e.altKey && !e.ctrlKey && !e.metaKey && (e.key === "u" || e.key === "U")) || ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === "z" || e.key === "Z"));
    if (undoKey) {
      if (api.undo()) e.preventDefault();
      return;
    }
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    // Act on the move that has keyboard focus (a collapsed turn, a fork option, the empty chair),
    // not on whichever move happens to be open.
    const subjectEl = t.closest<HTMLElement>("[data-subject]");
    const turnHost = t.closest<HTMLElement>("[data-turn]");
    const subject = subjectEl?.dataset.subject ?? turnHost?.dataset.turn ?? focusId;
    const info = ix.nodes.get(subject);
    if (!info) return;

    if (e.key === "h" || e.key === "H" || e.key === "f" || e.key === "F") {
      const j = e.key.toLowerCase() === "h" ? "holds" : "fails";
      e.preventDefault();
      // A held key repeats: only the first press counts, or the call would flip on and off.
      if (e.repeat) return;
      api.decide(subject, judgments[subject] === j ? null : j);
      return;
    }

    if (!e.key.startsWith("Arrow") || e.shiftKey) return;
    // Arrows walk the thread only from a move's own control; elsewhere they scroll as usual.
    if (!t.matches(NAV_TARGETS)) return;
    const i = path.indexOf(subject);
    const sibs = info.parent ? ix.nodes.get(info.parent)!.childIds : api.o.prongs.map((p) => p.id);
    const si = sibs.indexOf(subject);
    let to: string | undefined;
    switch (e.key) {
      case "ArrowDown": {
        // While the open move still runs below the screen, ↓ reads on (scrolls) before it moves on.
        if (subject === focusId && t.matches("[data-turn-heading]")) {
          const r = turnEl(focusId)?.getBoundingClientRect();
          if (r && r.bottom > window.innerHeight + 8) return;
        }
        to = i >= 0 ? path[i + 1] : info.childIds[0];
        break;
      }
      case "ArrowUp":
        to = info.parent ?? undefined;
        break;
      case "ArrowLeft":
        to = si > 0 ? sibs[si - 1] : undefined;
        break;
      case "ArrowRight":
        to = si >= 0 && si < sibs.length - 1 ? sibs[si + 1] : undefined;
        break;
      default:
        return;
    }
    if (!to) return;
    e.preventDefault();
    api.focus(to, "key");
  };

  if (path.length === 0) return null;
  // One line per contradiction note, picked by the move it sits under; two notes on one
  // screen never show the same line.
  const noteLines = new Map<string, Line>();
  let lastLine = -1;
  for (let i = 1; i < path.length; i++) {
    if (!tenseKey(path[i - 1], path[i])) continue;
    let k = hashOf(path[i - 1]) % CONTRADICTION_QUOTES.length;
    if (k === lastLine) k = (k + 1) % CONTRADICTION_QUOTES.length;
    lastLine = k;
    noteLines.set(path[i], CONTRADICTION_QUOTES[k]);
  }
  const last = path[path.length - 1];
  const lastInfo = ix.nodes.get(last)!;
  const chairSeat: Seat = lastInfo.node.side === "skeptic" ? "right" : lastInfo.node.side === "theist" ? "left" : (lastInfo.depth + 1) % 2 === 1 ? "left" : "right";

  return (
    <section className="ch-thread" aria-labelledby="ch-thread-h" aria-describedby={keysId} onKeyDown={onKey}>
      <h2 id="ch-thread-h" className="sr-only">
        The argument, move by move
      </h2>
      <ol className="ch-ol">
        {path.map((id, i) => {
          const info = ix.nodes.get(id)!;
          const prev = i > 0 ? path[i - 1] : null;
          const prevInfo = prev ? ix.nodes.get(prev)! : null;
          const fork = !!prevInfo && prevInfo.childIds.length > 1;
          const tense = !!prev && tenseKey(prev, id);
          const nextTense = i < path.length - 1 && tenseKey(id, path[i + 1]);
          const seat = seatOf(info.node.side);
          const prevSeat = prevInfo ? seatOf(prevInfo.node.side) : seat;
          const between = fork || tense;
          return (
            <li key={id} className={`ch-step seat-${seat}`}>
              {prevInfo && <Connector from={prevSeat} to={between ? "center" : seat} side={info.node.side} tense={tense} short={between} />}
              {fork && <Fork parentId={prev!} current={id} />}
              {tense && <TensionNote node={prev!} reply={id} line={noteLines.get(id) ?? CONTRADICTION_QUOTES[0]} />}
              {between && <Connector from="center" to={seat} side={info.node.side} tense={tense} short />}
              {/* Primitive props only: a folded move re-renders only when its own status or call changes. */}
              <Turn
                id={id}
                focused={id === focusId}
                next={id === focusId ? path[i + 1] : undefined}
                tensed={tense || nextTense}
                label={labelOf(id)}
                call={judgments[id]}
                rippleDelay={rippleDelay(ripple, id, info.depth)}
              />
            </li>
          );
        })}
        <li className={`ch-step ch-step-chair seat-${chairSeat}`}>
          <Connector from={seatOf(lastInfo.node.side)} to={chairSeat} />
          <EmptyChair leaf={last} seat={chairSeat} />
        </li>
      </ol>
      <p id={keysId} className="sr-only">
        Keyboard shortcuts. On a move, the Down arrow goes to its reply and the Up arrow to the move it replies to. Left and Right switch between replies to the same move. H says
        the move holds and F says it fails. Press the same key again to clear your call. U undoes your last call.
      </p>
      {/* each key stays on the same line as its word */}
      <p className="ch-keys" aria-hidden>
        <span className="ch-keys-pair">
          <kbd>↑</kbd>
          <kbd>↓</kbd> previous or next move
        </span>{" "}
        · <span className="ch-keys-pair">
          <kbd>←</kbd>
          <kbd>→</kbd> other replies
        </span>{" "}
        · <span className="ch-keys-pair">
          <kbd>H</kbd> holds
        </span>{" "}
        · <span className="ch-keys-pair">
          <kbd>F</kbd> fails
        </span>{" "}
        · <span className="ch-keys-pair">
          <kbd>U</kbd> undo
        </span>
      </p>
    </section>
  );
}
