"use client";

/* The thread: one branch of an objection read as a script, from the prong
   down through the focused move to the last word on that branch.
   Objector turns sit left, Respondent turns right, Spinoza in the middle;
   a thin connector zig-zags between them. Wherever the branch could have
   gone another way, a fork shows the alternatives and what each side needs.
   After the last turn, an empty chair waits in the opposite seat. */

import { useId, type KeyboardEvent } from "react";
import { useAtlas } from "../context";
import { Glyph } from "../primitives";
import type { NodeInfo } from "../semantics";
import type { Side } from "../types";
import { CallButtons, SIDE_POSS, SIDE_THE, SIDE_WORD, STATUS_WORD, moveNoun, numWord, rippleStyle, seatOf, turnEl, useChamber, type Seat } from "./chamberShared";
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

/** "The Respondent has three answers" / "The Objector has two rejoinders" / mixed. */
function forkTitle(parent: NodeInfo, counts: Record<Side, number>, n: number): string {
  const sides = (Object.keys(counts) as Side[]).filter((s) => counts[s] > 0).sort((x, y) => counts[y] - counts[x]);
  const noun = (s: Side, k: number) => {
    const plural = k !== 1;
    if (s === "skeptic") return plural ? "rejoinders" : "rejoinder";
    if (s === "spinoza") return plural ? "objections" : "objection";
    return parent.node.side === "theist" ? (plural ? "replies" : "reply") : plural ? "answers" : "answer";
  };
  if (sides.length === 1) {
    const s = sides[0];
    return `${SIDE_THE[s]} has ${numWord(n)} ${noun(s, n)}`;
  }
  const parts = sides.map((s) => `${numWord(counts[s])} from ${s === "spinoza" ? "Spinoza" : `the ${SIDE_WORD[s]}`}`);
  const head = numWord(n);
  return `${head.charAt(0).toUpperCase()}${head.slice(1)} answers — ${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** What each side needs at this junction: every attack must fail; one is enough. */
function forkStakes(parent: NodeInfo, counts: Record<Side, number>, n: number): string {
  const sides = (Object.keys(counts) as Side[]).filter((s) => counts[s] > 0);
  const must = `${SIDE_THE[parent.node.side]} must beat ${n === 2 ? "both" : `all ${numWord(n)}`}.`;
  const one = sides.length === 1 ? `${SIDE_THE[sides[0]]} needs one.` : "Any one of them is enough.";
  return `${must} ${one}`;
}

function Fork({ parentId, current }: { parentId: string; current: string }) {
  const { ix, labelOf, toPlain } = useAtlas();
  const api = useChamber();
  const parent = ix.nodes.get(parentId);
  if (!parent) return null;
  const kids = parent.childIds;
  const n = kids.length;
  const idx = Math.max(0, kids.indexOf(current));
  const counts = sideCounts(ix, kids);
  const title = forkTitle(parent, counts, n);
  return (
    <div className="ch-fork" role="group" aria-label={title} data-subject={current}>
      <ForkIcon />
      <p className="ch-fork-title">{title}</p>
      <div className="ch-fork-nav">
        <button type="button" className="ch-chev" aria-label="Previous alternative" disabled={idx === 0} onClick={() => idx > 0 && api.focus(kids[idx - 1], "fork")}>
          ‹
        </button>
        <span className="ch-fork-count">
          {idx + 1} of {n}
        </span>
        <button type="button" className="ch-chev" aria-label="Next alternative" disabled={idx === n - 1} onClick={() => idx < n - 1 && api.focus(kids[idx + 1], "fork")}>
          ›
        </button>
      </div>
      <p className="ch-fork-stakes">{forkStakes(parent, counts, n)}</p>
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
                  <span className={`ch-fork-st st-${l}`}>{STATUS_WORD[l]}</span>
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
          ? "You’ve said both of these hold. One of them has to give."
          : "You’ve said the claim above holds, and the reply below stands on your other calls. One of them has to give."}
      </p>
      <div className="ch-tension-acts">
        <button type="button" className="btn small" onClick={() => api.decide(node, null)}>
          <span aria-hidden>↑</span> Rethink this
        </button>
        {judgments[reply] ? (
          <button type="button" className="btn small" onClick={() => api.decide(reply, null)}>
            <span aria-hidden>↓</span> Rethink that
          </button>
        ) : (
          <button type="button" className="btn small" onClick={() => api.focus(reply, "link")}>
            <span aria-hidden>↓</span> Look at that reply
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyChair({ leaf, seat }: { leaf: string; seat: Seat }) {
  const { ix, judgments } = useAtlas();
  const api = useChamber();
  const info = ix.nodes.get(leaf);
  if (!info) return null;
  const sources = (info.node.sources ?? []).filter((s) => s.title);
  const focused = api.focusId === leaf;
  const of = `${SIDE_POSS[info.node.side]} ${moveNoun(info.depth, info.node.side)} above`;
  return (
    <div className={`ch-chair seat-${seat}`} role="note" aria-label="No reply yet" data-subject={leaf}>
      <span className="ch-chair-k">
        <span className="ch-chair-sq" aria-hidden />
        The empty chair
      </span>
      <p className="ch-chair-t">
        {judgments[leaf] ? (
          <>
            No one has answered this here. <em>You have ruled</em>: it {judgments[leaf]}.
          </>
        ) : (
          <>
            No one has answered this here. <em>The floor is yours</em> — does it hold?
          </>
        )}
      </p>
      {!focused && (
        <div className="ch-chair-call">
          <CallButtons id={leaf} side={info.node.side} call={judgments[leaf]} compact />
          <span className="ch-chair-of">on {of}</span>
        </div>
      )}
      {sources.length > 0 && (
        <div className="ch-chair-read">
          <span className="ch-chair-read-k">Read further</span>
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
                {s.by && <span className="ch-chair-by"> — {s.by}</span>}
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
        The thread
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
        Keyboard: on a move, the Down arrow goes to its reply and the Up arrow to the move it answers; Left and Right switch between alternative replies; H says the move holds and F
        that it fails (press again to withdraw).
      </p>
      <p className="ch-keys" aria-hidden>
        <kbd>↑</kbd>
        <kbd>↓</kbd> move along the thread · <kbd>←</kbd>
        <kbd>→</kbd> alternatives · <kbd>H</kbd> holds · <kbd>F</kbd> fails
      </p>
    </section>
  );
}
