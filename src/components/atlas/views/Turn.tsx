"use client";

/* One move in the thread, read as a line in a script.
   Collapsed: cue, address, glyph + claim, the gist, and its status.
   Focused (expanded in place): the plain-terms line, the side's full case and
   its quotation (with a link to the text where there is one), then straight
   away the decision block (what would change this side's mind, "Does … hold
   up?", Holds / Fails / Read the reply, and a Why? that explains the computed
   status in a sentence). Its sources, people, glossary terms and cross-links
   come last, folded into one "Sources, people and links" disclosure. */

import { memo, useId, useMemo, useRef, type ReactNode } from "react";
import { useAtlas } from "../context";
import { explainNode } from "../explain";
import { address } from "../helpers";
import { parseMarkup } from "../markup";
import { usePeek } from "../peek";
import { Glyph, RichText, ThinkerChip } from "../primitives";
import { formatRoute } from "../router";
import type { Judgment, Label, Side } from "../types";
import { ContextLink } from "./OutlineList";
import { SourceList } from "./Sources";
import {
  CallButtons,
  MoveChip,
  RippleMark,
  SIDE_POSS,
  SIDE_WORD,
  TurnStatus,
  WhyLine,
  answeredMark,
  cueFor,
  delayStyle,
  focusTurn,
  moveNoun,
  placeLabel,
  q,
  seatOf,
  shownLabel,
  topInset,
  useChamberStatic,
} from "./chamberShared";

const KEYS = "ArrowUp ArrowDown ArrowLeft ArrowRight H F U";

/** First occurrence wins: a list of {id, …} with each id once. */
function uniqueBy<T>(xs: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  return xs.filter((x) => {
    const k = key(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** A claim cut to its first few words: "God gives fire its power freely…". */
function shortClaim(s: string, max = 38): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max + 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > 16 ? cut.slice(0, sp) : s.slice(0, max)).replace(/[\s,;:.\u2013\u2014-]+$/, "")}…`;
}

function Section({ title, count, className = "", children }: { title: string; count?: number; className?: string; children: ReactNode }) {
  return (
    <section className={`ch-sec ${className}`}>
      <h4 className="ch-sec-h mono">
        {title}
        {count !== undefined && <span className="ch-sec-n"> · {count}</span>}
      </h4>
      {children}
    </section>
  );
}

/* ---------------- the turn ---------------- */

export interface TurnProps {
  id: string;
  focused: boolean;
  /** The next move on the branch path, if any (for "Read the reply"; open move only). */
  next?: string;
  /** Part of a tension pair adjacent on the path. */
  tensed?: boolean;
  /** The move's computed status and the reader's call on it. */
  label: Label;
  call?: Judgment;
  /** Stagger (ms) of its status change after the last call, if that call changed it. */
  rippleDelay?: number;
}

/** Memoized on primitive props: after a call, only the moves whose status or call changed re-render
    (the open move reads the page state itself, so it always does). */
const Turn = memo(function Turn(props: TurnProps) {
  return props.focused ? <FocusedTurn {...props} /> : <FoldedTurn {...props} />;
});
export default Turn;

function turnClass(side: Side, l: Label, focused: boolean, call: Judgment | undefined, tensed: boolean) {
  return `ch-turn s-${side} seat-${seatOf(side)} st-${l} ${focused ? "is-focus" : "is-folded"} ${call ? "has-call" : ""} ${tensed ? "is-tensed" : ""}`;
}

/* A folded move reads only what never changes during a call (ChamberStatic), not the page state. */
function FoldedTurn({ id, tensed = false, label: l, call, rippleDelay }: TurnProps) {
  const { ix, toPlain, focus } = useChamberStatic();
  const hid = useId();
  const info = ix.nodes.get(id);
  if (!info) return null;
  const n = info.node;
  const side = n.side;
  const cue = cueFor(info.depth, side);
  const place = placeLabel(ix, id);
  // If a cue ever stops naming the speaker, name them beside the place.
  const sideInCue = /Objector|Defender|Spinoza/.test(cue);
  return (
    <article className={turnClass(side, l, false, call, tensed)} style={delayStyle(rippleDelay)} data-node-id={id} data-turn={id} aria-labelledby={hid}>
      <RippleMark id={id} depth={info.depth} />
      <div className="ch-cue">
        <span className="ch-cue-k">{cue}</span>
        <span className="ch-addr" title={address(ix, id)}>
          <span aria-hidden>{place}</span>
          <span className="sr-only">{place.replace(" · ", ", ")}</span>
          {!sideInCue && <span className="ch-addr-side"> · {SIDE_WORD[side]}</span>}
        </span>
      </div>
      <h3 className="ch-label" id={hid}>
        <button type="button" className="ch-hit" aria-keyshortcuts={KEYS} onClick={() => focus(id, "thread")}>
          <Glyph side={side} label={shownLabel(l, call)} size={13} className="ch-label-glyph" />
          <span className={answeredMark(l, call) ? "lab-out" : "lab-in"}>{toPlain(n.label)}</span>
        </button>
      </h3>
      {n.gist && <p className="ch-gist-fold">{toPlain(n.gist)}</p>}
      <div className="ch-foot">
        <TurnStatus id={id} side={side} label={l} call={call} />
        {info.childIds.length > 0 && <span className="ch-replies mono">{info.childIds.length === 1 ? "1 reply" : `${info.childIds.length} replies`}</span>}
      </div>
    </article>
  );
}

function FocusedTurn({ id, next, tensed = false, label: l, call, rippleDelay }: TurnProps) {
  const { ix, labels, judgments, toPlain, termName, tensions } = useAtlas();
  const { focus, decide, jump } = useChamberStatic();
  const peek = usePeek();
  const info = ix.nodes.get(id);
  const hid = useId();
  const decideRef = useRef<HTMLDivElement>(null);

  // Terms used in this move: the lexicon's name if it has one, else the words the text itself shows.
  const terms = useMemo(() => {
    if (!info) return [] as { id: string; name: string }[];
    const n = info.node;
    const out = new Map<string, string>();
    for (const t of [n.gist, ...n.body, n.cedes ?? ""])
      for (const tok of parseMarkup(t)) if (tok.t === "term" && !out.has(tok.id)) out.set(tok.id, ix.terms.get(tok.id)?.term ?? tok.v ?? termName(tok.id));
    return [...out].map(([tid, name]) => ({ id: tid, name }));
  }, [info, ix, termName]);

  const people = useMemo(() => {
    if (!info) return [] as string[];
    const n = info.node;
    const out = new Set<string>(n.thinkers ?? []);
    for (const t of [n.gist, ...n.body, n.cedes ?? ""]) for (const tok of parseMarkup(t)) if (tok.t === "thinker") out.add(tok.id);
    return [...out].filter((t) => ix.thinkers.has(t));
  }, [info, ix]);

  if (!info) return null;
  const n = info.node;
  const side = n.side;
  const cue = cueFor(info.depth, side);
  const place = placeLabel(ix, id);
  const cls = turnClass(side, l, true, call, tensed);

  /* Phones: the decision comes after the case, often well over a screen down; this jumps there. */
  const goDecide = () => {
    const el = decideRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (topInset() + 16), behavior: (reduce ? "instant" : "smooth") as ScrollBehavior });
    el.focus({ preventScroll: true });
  };

  const explanation = explainNode(ix, labels, judgments, id, toPlain);
  const see = uniqueBy(
    (n.see ?? []).filter((s) => ix.nodes.has(s.id) && s.id !== id),
    (s) => s.id,
  );
  // A move this one already links to under "See also" isn't listed again under "Linked from".
  const seeIds = new Set(see.map((s) => s.id));
  const backlinks = uniqueBy(ix.backlinks.get(id) ?? [], (b) => b.from).filter((b) => b.from !== id && !seeIds.has(b.from));
  const offPathTensions = tensions.filter((t) => t.node === id && t.reply !== next);
  const body = n.body.filter((p) => p.trim());
  const sources = (n.sources ?? []).filter((s) => s.title);
  const parentInfo = info.parent ? ix.nodes.get(info.parent) : undefined;
  const more = sources.length + people.length + terms.length + see.length + backlinks.length;
  const askId = `${hid}-ask`;

  return (
    <article className={cls} style={delayStyle(rippleDelay)} data-node-id={id} data-turn={id} aria-labelledby={hid}>
      <RippleMark id={id} depth={info.depth} />
      <div className="ch-cue">
        <span className="ch-cue-k">{cue}</span>
        <span className="ch-addr" title={address(ix, id)}>
          <span aria-hidden>{place}</span>
          <span className="sr-only">{place.replace(" · ", ", ")}</span>
        </span>
      </div>
      <h3 className="ch-label ch-label-big" id={hid} tabIndex={-1} data-turn-heading={id} aria-keyshortcuts={KEYS}>
        <Glyph side={side} label={shownLabel(l, call)} size={15} className="ch-label-glyph" />
        <span className={answeredMark(l, call) ? "lab-out" : "lab-in"}>{toPlain(n.label)}</span>
      </h3>
      {/* The cue above already names the speaker; this line says what the move replies to.
          On phones it also carries "Mark it ↓", a jump to Holds / Fails below the case. */}
      <div className={`ch-side-line ${parentInfo ? "" : "only-mark"}`}>
        {info.parent && parentInfo && (
          <p className="ch-answers">
            replying to {SIDE_POSS[parentInfo.node.side]}{" "}
            <button type="button" className="ch-answers-link" title={address(ix, info.parent)} onClick={() => focus(info.parent!, "thread")}>
              {parentInfo.depth === 1 ? (
                `argument (round 1)`
              ) : (
                <>
                  <span aria-hidden>{q(shortClaim(toPlain(parentInfo.node.label)))}</span>
                  <span className="sr-only">
                    {moveNoun(parentInfo.depth)}: {toPlain(parentInfo.node.label)}
                  </span>
                </>
              )}
            </button>
          </p>
        )}
        <button type="button" className="ch-mark-go" onClick={goDecide}>
          <span className="ch-u">Mark it</span> <span aria-hidden>↓</span>
        </button>
      </div>

      {n.gist && (
        <div className="ch-plain">
          <span className="ch-plain-k mono">In plain terms</span>
          <p className="ch-plain-t">
            <RichText text={n.gist} onNode={jump} />
          </p>
        </div>
      )}

      {body.length > 0 && (
        <div className="ch-body">
          {body.map((p, i) => (
            <p key={i}>
              <RichText text={p} onNode={jump} />
            </p>
          ))}
        </div>
      )}

      {n.quote && n.quote.text && (
        <figure className="ch-quote">
          <blockquote>
            <p>{n.quote.text}</p>
          </blockquote>
          {(n.quote.who || n.quote.cite || n.quote.url) && (
            <figcaption>
              {n.quote.who && <span className="ch-quote-who">{n.quote.who}</span>}
              {n.quote.cite && <span className="ch-quote-cite">{n.quote.cite}</span>}
              <ContextLink url={n.quote.url} />
            </figcaption>
          )}
        </figure>
      )}

      {/* The decision comes right after the case, before the references. */}
      <div className="ch-decide" ref={decideRef} tabIndex={-1} role="group" aria-label="Your call on this move">
        {n.cedes && (
          <div className="ch-cedes">
            <span className="ch-cedes-k mono">What would change this side’s mind</span>
            <p className="ch-cedes-t">
              <RichText text={n.cedes} onNode={jump} />
            </p>
          </div>
        )}
        <p className="ch-ask mono" id={askId}>
          Does {SIDE_POSS[side]} {moveNoun(info.depth)} hold up?
        </p>
        <div className="ch-decide-row">
          <CallButtons id={id} side={side} call={call} labelledBy={askId} />
          {next && (
            <button type="button" className="btn ch-hear" onClick={() => focus(next, "thread")}>
              {info.childIds.length > 1 ? "Read the replies" : "Read the reply"} <span aria-hidden>↓</span>
            </button>
          )}
        </div>
        <div className="ch-decide-status">
          <TurnStatus id={id} side={side} label={l} call={call} />
          <WhyLine key={`${id}:${l}:${call ?? ""}`} explanation={explanation} onGo={(x) => focus(x, "link")} />
        </div>
        {offPathTensions.map((t) => (
          <div key={t.reply} className="tension-note ch-tension-inline" role="note">
            <p>
              You said this holds, but {q(toPlain(ix.nodes.get(t.reply)?.node.label ?? t.reply))}, a reply to it, stands, and a move with a standing reply is answered. These two
              contradict each other.
            </p>
            <div className="ch-tension-acts">
              <button
                type="button"
                className="btn small"
                onClick={() => {
                  decide(id, null);
                  focusTurn(id);
                }}
              >
                Clear this call
              </button>
              {judgments[t.reply] ? (
                <button
                  type="button"
                  className="btn small"
                  onClick={() => {
                    decide(t.reply, null);
                    // That reply isn't on this branch, so focus stays with this move.
                    focusTurn(t.reply, id);
                  }}
                >
                  Clear that call
                </button>
              ) : (
                <button type="button" className="btn small" onClick={() => focus(t.reply, "link")}>
                  Go to that reply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* The texts, people, terms and cross-links behind the move: one tap away, closed by default. */}
      {more > 0 && (
        <details className="ch-more">
          <summary className="ch-more-sum">
            <span>
              Sources, people and links <span className="ch-more-n">· {more}</span>
            </span>
            <span className="ch-more-chev" aria-hidden />
          </summary>
          <div className="ch-more-body">
            {sources.length > 0 && (
              <Section title="Sources" count={sources.length} className="ch-srcs">
                <SourceList sources={sources} className="ch-srclist" />
                <a className="ch-allsrc" href={formatRoute({ view: "sources" })}>
                  <span className="ch-u">See all sources</span> <span aria-hidden>→</span>
                </a>
              </Section>
            )}

            {(people.length > 0 || terms.length > 0) && (
              <div className="ch-refs">
                {people.length > 0 && (
                  <Section title="People">
                    <div className="ch-chips">
                      {people.map((t) => (
                        <ThinkerChip key={t} id={t} />
                      ))}
                    </div>
                  </Section>
                )}
                {terms.length > 0 && (
                  <Section title="Glossary">
                    <div className="ch-chips">
                      {terms.map((t) => (
                        <button key={t.id} type="button" className="chip ch-term" onClick={(e) => peek({ kind: "term", id: t.id, rect: e.currentTarget.getBoundingClientRect() })}>
                          <span className="ch-term-mark" aria-hidden>
                            ¶
                          </span>
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </Section>
                )}
              </div>
            )}

            {(see.length > 0 || backlinks.length > 0) && (
              <div className="ch-links">
                {see.length > 0 && (
                  <Section title="See also">
                    <ul className="ch-xrefs">
                      {see.map((s) => (
                        <MoveChip key={s.id} id={s.id} why={s.why} onGo={jump} />
                      ))}
                    </ul>
                  </Section>
                )}
                {/* No note here: a backlink's note was written by the other move about this one. */}
                {backlinks.length > 0 && (
                  <Section title="Linked from">
                    <ul className="ch-xrefs">
                      {backlinks.map((b) => (
                        <MoveChip key={b.from} id={b.from} onGo={jump} />
                      ))}
                    </ul>
                  </Section>
                )}
              </div>
            )}
          </div>
        </details>
      )}
    </article>
  );
}
