"use client";

/* The thread: one branch of an objection read as a script, from the part
   down through the focused move to the last move on that branch.
   Objector moves sit left, Defender moves right, Spinoza in the middle,
   and a thin connector zig-zags between them. Wherever the branch could have
   gone another way, a fork shows the other replies and what each side needs.
   After the last move, an empty chair waits in the opposite seat. */

import { useId, type KeyboardEvent } from "react";
import { useAtlas } from "../context";
import { Glyph } from "../primitives";
import type { NodeInfo } from "../semantics";
import type { Side } from "../types";
import { CallButtons, SIDE_POSS, SIDE_THE, SIDE_WORD, moveNoun, numWord, rippleStyle, seatOf, statusText, turnEl, useChamber, type Seat } from "./chamberShared";
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

/** The rule at this fork: the move above stands only if every reply fails, and one standing reply answers it. */
function forkStakes(parent: NodeInfo, n: number): string {
  const all = n === 2 ? "both replies fail" : `all ${numWord(n)} replies fail`;
  const any = n === 2 ? "If either one stands" : "If any one of them stands";
  return `${cap(SIDE_POSS[parent.node.side])} ${moveNoun(parent.depth)} above stands only if ${all}. ${any}, it is answered.`;
}

function Fork({ parentId, current }: { parentId: string; current: string }) {
  const { ix, labelOf, toPlain, judgments } = useAtlas();
  const api = useChamber();
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
          const on = k === current;
          return (
            <li key={k}>
              <button
                type="button"
                className={`ch-fork-opt s-${info.node.side} st-${l} ${on ? "on" : ""}`}
                aria-current={on ? "true" : undefined}
                data-subject={k}
                onClick={() => api.focus(k, "fork")}
                style={rippleStyle(api.ripple, info.depth)}
              >
                <span className="ch-fork-n">{i + 1}</span>
                <Glyph side={info.node.side} label={l} size={12} />
                <span className="ch-fork-body">
                  <span className={`ch-fork-l ${l === "out" ? "lab-out" : ""}`}>{toPlain(info.node.label)}</span>
                  <span className={`ch-fork-st st-${l}`}>{statusText(l, judgments[k])}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TensionNote({ node, reply }: { node: string; reply: string }) {
  const { judgments } = useAtlas();
  const api = useChamber();
  const both = judgments[reply] === "holds";
  return (
    <div className="tension-note ch-tension" role="note">
      <span className="ch-tension-k">Tension</span>
      <p>
        {both
          ? "You said both of these hold, but the lower one replies to the upper one. These two contradict each other."
          : "You said the point above holds, and your other calls make the reply below it stand. These two contradict each other."}
      </p>
      <figure className="ch-tension-q">
        <blockquote>“the same attribute cannot at the same time belong and not belong to the same subject and in the same respect”</blockquote>
        <figcaption>Aristotle, Metaphysics IV.3, tr. W. D. Ross</figcaption>
      </figure>
      <div className="ch-tension-acts">
        <button type="button" className="btn small" onClick={() => api.decide(node, null)}>
          <span aria-hidden>↑</span> Clear call above
        </button>
        {judgments[reply] ? (
          <button type="button" className="btn small" onClick={() => api.decide(reply, null)}>
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

/* Lines for the empty chair, one per leaf (picked by id, so it never changes under the reader).
   Each checked word for word against a public-domain text. */
const CHAIR_QUOTES: { text: string; who: string; cite: string }[] = [
  { text: "He that is first in his own cause seemeth just; but his neighbour cometh and searcheth him.", who: "Proverbs 18:17", cite: "King James Version" },
  { text: "He who knows only his own side of the case, knows little of that.", who: "John Stuart Mill", cite: "On Liberty, ch. 2 (1859)" },
  { text: "Prove all things; hold fast that which is good.", who: "1 Thessalonians 5:21", cite: "King James Version" },
  { text: "A wise man, therefore, proportions his belief to the evidence.", who: "David Hume", cite: "An Enquiry Concerning Human Understanding, sec. 10 (1748)" },
  { text: "Come now, and let us reason together, saith the LORD", who: "Isaiah 1:18", cite: "King James Version" },
];

function chairQuote(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return CHAIR_QUOTES[h % CHAIR_QUOTES.length];
}

function EmptyChair({ leaf, seat }: { leaf: string; seat: Seat }) {
  const { ix, judgments } = useAtlas();
  const api = useChamber();
  const info = ix.nodes.get(leaf);
  if (!info) return null;
  const sources = (info.node.sources ?? []).filter((s) => s.title);
  const focused = api.focusId === leaf;
  const of = `${SIDE_POSS[info.node.side]} ${moveNoun(info.depth)} above`;
  const line = chairQuote(leaf);
  return (
    <div className={`ch-chair seat-${seat}`} role="note" aria-label="No reply yet" data-subject={leaf}>
      <span className="ch-chair-k">
        <span className="ch-chair-sq" aria-hidden />
        The empty chair
      </span>
      <p className="ch-chair-t">
        {judgments[leaf] ? (
          <>
            Nobody here has replied to this. <em>You said it {judgments[leaf]}.</em>
          </>
        ) : (
          <>
            Nobody here has replied to this yet. <em>Does it hold?</em>
          </>
        )}
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
      {sources.length > 0 && (
        <div className="ch-chair-read">
          <span className="ch-chair-read-k">Further reading</span>
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
  const { ix, tensions, judgments } = useAtlas();
  const api = useChamber();
  const keysId = useId();
  const { path, focusId } = api;
  const tenseKey = (a: string, b: string) => tensions.some((t) => t.node === a && t.reply === b);

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [contenteditable='true']")) return;
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
              {tense && <TensionNote node={prev!} reply={id} />}
              {between && <Connector from="center" to={seat} side={info.node.side} tense={tense} short />}
              <Turn id={id} focused={id === focusId} next={path[i + 1]} tensed={tense || nextTense} />
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
        the move holds and F says it fails. Press the same key again to clear your call.
      </p>
      <p className="ch-keys" aria-hidden>
        <kbd>↑</kbd>
        <kbd>↓</kbd> previous or next move · <kbd>←</kbd>
        <kbd>→</kbd> other replies · <kbd>H</kbd> holds · <kbd>F</kbd> fails
      </p>
    </section>
  );
}
