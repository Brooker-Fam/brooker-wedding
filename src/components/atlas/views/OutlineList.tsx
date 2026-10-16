/* Every move as nested ordered lists: objection → part → reply → reply to
   that reply, and so on.

   PURE and context-free on purpose: it takes the Disputation and optional
   per-reader data as props, imports nothing client-only, and renders the same
   on the server. `page.tsx` renders it inside <noscript> (for no-JS readers
   and search engines); the Outline view renders it with the reader's statuses
   and links into each objection. Styles live in library.css (.ol-*). */

import type { ReactNode } from "react";
import { Rich } from "../markup";
import type { ArgNode, Disputation, Judgment, Label, Objection, ObjectionId, Quote, Side } from "../types";
import { StatusPip } from "./marks";

export const OUTLINE_SIDE_WORD: Record<Side, string> = { skeptic: "Objector", theist: "Defender", spinoza: "Spinoza" };
const NODE_WORD: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };
const OBJ_WORD: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };

export interface OutlineListProps {
  d: Disputation;
  /** The reader's computed label per node. Omit to render without statuses (server / no-JS). */
  labelOf?: (id: string) => Label;
  /** The reader's computed label per objection. */
  objectionLabelOf?: (o: ObjectionId) => Label;
  /** The reader's explicit calls (shown as a "your call" stamp). */
  judgments?: Record<string, Judgment>;
  /** Href for a node; omit to render labels as plain text. */
  nodeHref?: (id: string, o: ObjectionId) => string;
  /** Href for an objection's chamber. */
  objectionHref?: (o: ObjectionId) => string;
  /** Show each move's plain-terms gist (default true). */
  gists?: boolean;
  /** Show each move's quotation, where it has one (default true). */
  quotes?: boolean;
  /** Prefix for element ids (sections get `${idPrefix}${objection.id}`). */
  idPrefix?: string;
  /** Rendered at the end of each objection's section (e.g. a way back to the contents). */
  sectionEnd?: (o: Objection) => ReactNode;
}

/** Quotation marks inside a quotation become single ones, since the stylesheet puts double marks around every quotation. */
export const nestQuotes = (text: string) => text.replace(/“/g, "‘").replace(/”/g, "’");

/* ---------- quotations and their texts (pure: also used by the People file, the Timeline, the peek and the move) ---------- */

/** The site a link goes to, shown beside it so the reader knows where it leads: "gutenberg.org". */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** "Read it in context ↗": a quotation's link to the full text it comes from, in a new tab. Nothing when there's no link. */
export function ContextLink({ url, className = "" }: { url?: string; className?: string }) {
  if (!url) return null;
  const host = hostOf(url);
  return (
    <a className={`rf-ctx ${className}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Read it in context${host ? ` at ${host}` : ""} (opens in a new tab)`}>
      <span className="rf-ctx-t">Read it in context</span>
      <span className="rf-ctx-arrow" aria-hidden>
        ↗
      </span>
      {host && (
        <span className="rf-ctx-host" aria-hidden>
          {host}
        </span>
      )}
    </a>
  );
}

/** A quotation in the Library's house style: serif italic, the speaker and citation in mono, and a link to the text when there is one. */
export function QuoteFigure({ q, hideWho = false, className = "" }: { q?: Quote; hideWho?: boolean; className?: string }) {
  if (!q || !q.text) return null;
  const who = hideWho ? "" : q.who;
  return (
    <figure className={`lib-quote ${className}`}>
      <blockquote>
        <p>{nestQuotes(q.text)}</p>
      </blockquote>
      {(who || q.cite || q.url) && (
        <figcaption>
          {who && <span className="lib-quote-who">{who}</span>}
          {q.cite && <span className="lib-quote-cite">{q.cite}</span>}
          {q.url && (
            <span className="rf-ctx-row">
              <ContextLink url={q.url} />
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/** A move's quotation in the outline. */
function OutlineQuote({ q }: { q: Quote }) {
  return <QuoteFigure q={q} className="ol-quote" />;
}

/** Static glyph (same classes as primitives' Glyph, so atlas.css styles it). */
export function OutlineGlyph({ side, label = "undec", size = 12 }: { side: Side; label?: Label; size?: number }) {
  const h = size / 2;
  return (
    <svg className={`glyph-svg s-${side} gl-${label}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {side === "skeptic" ? (
        <path d={`M${h},${size * 0.08}L${size * 0.94},${size * 0.86}L${size * 0.06},${size * 0.86}Z`} />
      ) : side === "spinoza" ? (
        <path d={`M${h},${size * 0.04}L${size * 0.9},${h}L${h},${size * 0.96}L${size * 0.1},${h}Z`} />
      ) : (
        <circle cx={h} cy={h} r={size * 0.4} />
      )}
    </svg>
  );
}

const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
const nth = (k: number) => (ORDINALS[k - 1] ? `the ${ORDINALS[k - 1]} reply` : `reply ${k}`);

/** An address spelled out for a screen reader, in the chamber's words (spellAddress there needs the index; this
    file stays pure): "I·1.2.3" → "Objection I, part 1, round 3, the third reply to I·1.2". */
function spellTrail(o: Objection, trail: number[]): string {
  const many = o.prongs.length > 1;
  const out = [`Objection ${o.numeral}`];
  if (many) out.push(`part ${trail[0]}`);
  if (trail.length === 1) {
    if (!many) out.push("the opening argument");
  } else if (trail.length === 2) {
    out.push(many ? nth(trail[1]) : `${nth(trail[1])} to its opening argument`);
  } else {
    out.push(`round ${trail.length}`, `${nth(trail[trail.length - 1])} to ${o.numeral}·${trail.slice(0, -1).join(".")}`);
  }
  return out.join(", ");
}

/** The stats line, in the same words as the chamber and the shell: "34 moves · 3 parts · up to 7 rounds"
    (no parts when there's one). */
function statsLine(moves: number, parts: number, rounds: number): string {
  return `${moves} ${moves === 1 ? "move" : "moves"}${parts > 1 ? ` · ${parts} parts` : ""} · ${rounds === 1 ? "1 round" : `up to ${rounds} rounds`}`;
}

function countMoves(n: ArgNode): number {
  return 1 + (n.children ?? []).reduce((s, c) => s + countMoves(c), 0);
}
function depthOf(n: ArgNode): number {
  const k = n.children ?? [];
  return 1 + (k.length ? Math.max(...k.map(depthOf)) : 0);
}

export default function OutlineList({ d, labelOf, objectionLabelOf, judgments, nodeHref, objectionHref, gists = true, quotes = true, idPrefix = "ol-", sectionEnd }: OutlineListProps) {
  const thinkerName = (id: string) => d.thinkers.find((t) => t.id === id)?.name;
  const termName = (id: string) => d.terms.find((t) => t.id === id)?.term;
  const nodeName = (id: string) => {
    let found: string | undefined;
    const seek = (n: ArgNode) => {
      if (found) return;
      if (n.id === id) found = n.label;
      else (n.children ?? []).forEach(seek);
    };
    d.objections.forEach((o) => o.prongs.forEach(seek));
    return found;
  };
  const rich = { thinkerName, termName, nodeName };

  return (
    <div className={`ol ${gists ? "" : "ol-compact"}`}>
      {d.objections.map((o) => (
        <ObjectionBlock key={o.id} o={o} {...{ labelOf, objectionLabelOf, judgments, nodeHref, objectionHref, gists, quotes, idPrefix, rich, sectionEnd }} />
      ))}
    </div>
  );
}

type Rich3 = { thinkerName: (id: string) => string | undefined; termName: (id: string) => string | undefined; nodeName: (id: string) => string | undefined };

function ObjectionBlock({
  o,
  labelOf,
  objectionLabelOf,
  judgments,
  nodeHref,
  objectionHref,
  gists,
  quotes,
  idPrefix,
  rich,
  sectionEnd,
}: Omit<OutlineListProps, "d"> & { o: Objection; rich: Rich3 }) {
  const ol = objectionLabelOf?.(o.id);
  const moves = o.prongs.reduce((s, p) => s + countMoves(p), 0);
  const depth = Math.max(0, ...o.prongs.map(depthOf));
  const headId = `${idPrefix}${o.id}-h`;
  return (
    <section className="ol-obj" id={`${idPrefix}${o.id}`} data-ol-obj={o.id} aria-labelledby={headId}>
      <header className="ol-objhead">
        <span className="ol-num serif" aria-hidden>
          {o.numeral}
        </span>
        <div className="ol-objtext">
          <p className="eyebrow ol-objeyebrow">
            Objection {o.numeral}
            {o.short ? ` · ${o.short}` : ""}
          </p>
          <h2 className="ol-title serif" id={headId}>
            {objectionHref ? <a href={objectionHref(o.id)}>{o.title || `Objection ${o.numeral}`}</a> : o.title || `Objection ${o.numeral}`}
          </h2>
          {o.question && <p className="ol-question serif">{o.question}</p>}
          {(o.objection || o.counter) && (
            <dl className="ol-exchange">
              {o.objection && (
                <div className="s-skeptic">
                  <dt className="mono">
                    <OutlineGlyph side="skeptic" size={10} /> The Objector argues
                  </dt>
                  <dd>
                    <Rich text={o.objection} r={rich} />
                  </dd>
                </div>
              )}
              {o.counter && (
                <div className="s-theist">
                  <dt className="mono">
                    <OutlineGlyph side="theist" size={10} /> The Defender replies
                  </dt>
                  <dd>
                    <Rich text={o.counter} r={rich} />
                  </dd>
                </div>
              )}
            </dl>
          )}
          <p className="ol-meta mono">
            {statsLine(moves, o.prongs.length, depth)}
            {ol && (
              <span className={`status-badge st-${ol} ol-objstatus`}>
                <StatusPip label={ol} size={9} />
                {OBJ_WORD[ol]}
              </span>
            )}
          </p>
        </div>
      </header>

      <ol className="ol-tree" aria-label={`Objection ${o.numeral}, every move`}>
        {o.prongs.map((p, i) => (
          <NodeItem key={p.id} n={p} o={o} trail={[i + 1]} depth={1} {...{ labelOf, judgments, nodeHref, gists, quotes, rich }} />
        ))}
      </ol>

      {o.spinoza?.title && (
        <p className="ol-scholium s-spinoza">
          <span className="mono ol-scholium-k">
            <OutlineGlyph side="spinoza" size={10} /> {/where spinoza stands/i.test(o.spinoza.title) ? "Spinoza" : "Where Spinoza stands"}
          </span>
          <span className="serif ol-scholium-t">{o.spinoza.title}</span>
        </p>
      )}
      {quotes && o.spinoza?.quote?.text && (
        <div className="s-spinoza ol-scholium-q">
          <OutlineQuote q={o.spinoza.quote} />
        </div>
      )}
      {sectionEnd && <div className="ol-end">{sectionEnd(o)}</div>}
    </section>
  );
}

function NodeItem({
  n,
  o,
  trail,
  depth,
  labelOf,
  judgments,
  nodeHref,
  gists,
  quotes,
  rich,
}: {
  n: ArgNode;
  o: Objection;
  trail: number[];
  depth: number;
  labelOf?: (id: string) => Label;
  judgments?: Record<string, Judgment>;
  nodeHref?: (id: string, o: ObjectionId) => string;
  gists?: boolean;
  quotes?: boolean;
  rich: Rich3;
}) {
  const label = labelOf?.(n.id);
  const call = judgments?.[n.id];
  const kids = n.children ?? [];
  const addr = `${o.numeral}·${trail.join(".")}`;
  const text = n.label || "(untitled move)";
  return (
    <li className={`ol-node s-${n.side} ${label ? `st-${label}` : ""}`} data-depth={depth}>
      <div className="ol-line">
        <p className="ol-who mono">
          <span className="ol-addr" aria-hidden>
            {addr}
          </span>
          <span className="sr-only">{spellTrail(o, trail)}</span>
          <span className="ol-side">
            <OutlineGlyph side={n.side} label={call === "fails" ? "undec" : label} size={11} />
            {OUTLINE_SIDE_WORD[n.side]}
          </span>
          {label &&
            (call ? (
              // A move the reader called carries their call, as in the chamber: nobody may have answered a move they rejected.
              <span className="ol-status called">
                <span className="your-call ol-call">You said it {call}</span>
              </span>
            ) : (
              <span className={`ol-status st-${label}`}>{NODE_WORD[label]}</span>
            ))}
        </p>
        <p className={`ol-label serif ${label === "out" && !call ? "lab-out" : ""}`}>
          {nodeHref ? <a href={nodeHref(n.id, o.id)}>{text}</a> : text}
        </p>
        {gists && n.gist && (
          <p className="ol-gist">
            <Rich text={n.gist} r={rich} />
          </p>
        )}
        {quotes && n.quote?.text && <OutlineQuote q={n.quote} />}
      </div>
      {kids.length > 0 && (
        <ol className="ol-kids">
          {kids.map((c, i) => (
            <NodeItem key={c.id} n={c} o={o} trail={[...trail, i + 1]} depth={depth + 1} {...{ labelOf, judgments, nodeHref, gists, quotes, rich }} />
          ))}
        </ol>
      )}
    </li>
  );
}
