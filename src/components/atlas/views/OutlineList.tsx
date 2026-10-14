/* The whole disputation as nested ordered lists: objection → prong → reply →
   rejoinder … all the way down.

   PURE and context-free on purpose: it takes the Disputation and optional
   per-reader data as props, imports nothing client-only, and renders the same
   on the server. `page.tsx` renders it inside <noscript> (for no-JS readers
   and search engines); the Outline view renders it with the reader's statuses
   and links into each chamber. Styles live in library.css (.ol-*). */

import type { ReactNode } from "react";
import { Rich } from "../markup";
import type { ArgNode, Disputation, Judgment, Label, Objection, ObjectionId, Side } from "../types";

export const OUTLINE_SIDE_WORD: Record<Side, string> = { skeptic: "Objector", theist: "Respondent", spinoza: "Spinoza" };
const NODE_WORD: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };
const OBJ_WORD: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Undecided" };
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

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
  /** Prefix for element ids (sections get `${idPrefix}${objection.id}`). */
  idPrefix?: string;
  /** Rendered at the end of each objection's section (e.g. a way back to the contents). */
  sectionEnd?: (o: Objection) => ReactNode;
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

function countMoves(n: ArgNode): number {
  return 1 + (n.children ?? []).reduce((s, c) => s + countMoves(c), 0);
}
function depthOf(n: ArgNode): number {
  const k = n.children ?? [];
  return 1 + (k.length ? Math.max(...k.map(depthOf)) : 0);
}

export default function OutlineList({ d, labelOf, objectionLabelOf, judgments, nodeHref, objectionHref, gists = true, idPrefix = "ol-", sectionEnd }: OutlineListProps) {
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
  const total = d.objections.length;

  return (
    <div className={`ol ${gists ? "" : "ol-compact"}`}>
      {d.objections.map((o) => (
        <ObjectionBlock key={o.id} o={o} total={total} {...{ labelOf, objectionLabelOf, judgments, nodeHref, objectionHref, gists, idPrefix, rich, sectionEnd }} />
      ))}
    </div>
  );
}

type Rich3 = { thinkerName: (id: string) => string | undefined; termName: (id: string) => string | undefined; nodeName: (id: string) => string | undefined };

function ObjectionBlock({
  o,
  total,
  labelOf,
  objectionLabelOf,
  judgments,
  nodeHref,
  objectionHref,
  gists,
  idPrefix,
  rich,
  sectionEnd,
}: Omit<OutlineListProps, "d"> & { o: Objection; total: number; rich: Rich3 }) {
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
            Objection {o.numeral} of {ROMAN[total - 1] ?? total}
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
                    <OutlineGlyph side="skeptic" size={10} /> It seems that
                  </dt>
                  <dd>{o.objection}</dd>
                </div>
              )}
              {o.counter && (
                <div className="s-theist">
                  <dt className="mono">
                    <OutlineGlyph side="theist" size={10} /> On the contrary
                  </dt>
                  <dd>{o.counter}</dd>
                </div>
              )}
            </dl>
          )}
          <p className="ol-meta mono">
            {moves} {moves === 1 ? "move" : "moves"} · {depth} {depth === 1 ? "round" : "rounds"} deep · {o.prongs.length} {o.prongs.length === 1 ? "prong" : "prongs"}
            {ol && (
              <span className={`status-badge st-${ol} ol-objstatus`}>
                <span className="dot" aria-hidden />
                {OBJ_WORD[ol]}
                {ol !== "undec" ? " on your calls" : ""}
              </span>
            )}
          </p>
        </div>
      </header>

      <ol className="ol-tree" aria-label={`Objection ${o.numeral}, move by move`}>
        {o.prongs.map((p, i) => (
          <NodeItem key={p.id} n={p} o={o} trail={[i + 1]} depth={1} {...{ labelOf, judgments, nodeHref, gists, rich }} />
        ))}
      </ol>

      {o.spinoza?.title && (
        <p className="ol-scholium s-spinoza">
          <span className="mono ol-scholium-k">
            <OutlineGlyph side="spinoza" size={10} /> {/where spinoza stands/i.test(o.spinoza.title) ? "Scholium" : "Scholium · where Spinoza stands"}
          </span>
          <span className="serif ol-scholium-t">{o.spinoza.title}</span>
        </p>
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
          <span className="ol-addr">{addr}</span>
          <span className="ol-side">
            <OutlineGlyph side={n.side} label={label} size={11} />
            {OUTLINE_SIDE_WORD[n.side]}
          </span>
          {label && (
            <span className={`ol-status st-${label}`}>
              {call || !nodeHref ? (
                NODE_WORD[label]
              ) : (
                // A computed status explains itself in the chamber (its "Why?"); the label link goes there too, so keep one tab stop.
                <a className="ol-why" href={nodeHref(n.id, o.id)} tabIndex={-1} title="Why? Open in the chamber">
                  {NODE_WORD[label]}
                </a>
              )}
              {call && <span className="your-call ol-call">Your call · {call === "holds" ? "Holds" : "Fails"}</span>}
            </span>
          )}
        </p>
        <p className={`ol-label serif ${label === "out" ? "lab-out" : ""}`}>
          {nodeHref ? <a href={nodeHref(n.id, o.id)}>{text}</a> : text}
        </p>
        {gists && n.gist && (
          <p className="ol-gist">
            <Rich text={n.gist} r={rich} />
          </p>
        )}
      </div>
      {kids.length > 0 && (
        <ol className="ol-kids">
          {kids.map((c, i) => (
            <NodeItem key={c.id} n={c} o={o} trail={[...trail, i + 1]} depth={depth + 1} {...{ labelOf, judgments, nodeHref, gists, rich }} />
          ))}
        </ol>
      )}
    </li>
  );
}
