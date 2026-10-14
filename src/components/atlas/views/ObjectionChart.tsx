"use client";

/* The objection chart: every move of one objection as a top-down tree, scaled
   to fit its panel (no pan, no zoom). Rounds run down in faint alternating
   bands. Each move is a glyph (▲ ● ◆) whose fill shows its status, and edges
   take the color of the side that replies. The branch being read is lit, the
   focused move is ringed, and while the objection is open a small flag marks
   a move where either call would settle it. */

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useAtlas } from "../context";
import { address } from "../helpers";
import { tidyEdge, tidyLayout } from "../layout";
import type { Label, Objection, Side } from "../types";
import { numWord, rippleStyle, SIDE_WORD, spellAddress, statusText, useChamber } from "./chamberShared";

const W = 400;

const r1 = (v: number) => Math.round(v * 10) / 10;

function glyphD(side: Side, x: number, y: number, s: number): string {
  if (side === "skeptic") {
    const h = s * 1.18;
    return `M${r1(x)},${r1(y - h)}L${r1(x + h * 0.98)},${r1(y + h * 0.66)}L${r1(x - h * 0.98)},${r1(y + h * 0.66)}Z`;
  }
  if (side === "spinoza") {
    const h = s * 1.25;
    return `M${r1(x)},${r1(y - h)}L${r1(x + h * 0.82)},${r1(y)}L${r1(x)},${r1(y + h)}L${r1(x - h * 0.82)},${r1(y)}Z`;
  }
  return `M${r1(x - s)},${r1(y)}a${r1(s)},${r1(s)} 0 1,0 ${r1(s * 2)},0a${r1(s)},${r1(s)} 0 1,0 ${r1(-s * 2)},0`;
}

interface Pt {
  id: string;
  side: Side;
  depth: number;
  parent: string | null;
  x: number;
  y: number;
}

export interface ChartProps {
  o: Objection;
  focusId: string;
  path: string[];
  onSelect: (id: string) => void;
  /** "panel" = desktop sticky column; "inline" = compact phone overview. */
  variant: "panel" | "inline";
  /** Leave out the chart's own heading (when a disclosure already names it). */
  bare?: boolean;
}

export default function ObjectionChart({ o, focusId, path, onSelect, variant, bare = false }: ChartProps) {
  const { ix, labelOf, judgments, tensions, analysis, toPlain } = useAtlas();
  const { ripple } = useChamber();
  const [coarse, setCoarse] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [within, setWithin] = useState(false);
  const [seenFocus, setSeenFocus] = useState(focusId);
  const els = useRef(new Map<string, SVGGElement>());

  if (seenFocus !== focusId) {
    setSeenFocus(focusId);
    setPreview(null);
    setCursor(null);
  }

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const set = () => setCoarse(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const geo = useMemo(() => {
    const t = tidyLayout(o.prongs, { vertical: true, colW: 1, laneH: 1 });
    const rowH = variant === "panel" ? 50 : 40;
    const padL = 34;
    const padR = 12;
    const padY = rowH / 2;
    const avail = W - padL - padR;
    const lanes = Math.max(1, t.lanes);
    const laneW = Math.min(54, avail / lanes);
    const offX = padL + (avail - laneW * lanes) / 2;
    const pts = new Map<string, Pt>();
    for (const n of t.nodes) {
      pts.set(n.id, { id: n.id, side: n.side, depth: n.depth, parent: n.parent, x: r1(offX + (n.x + 0.5) * laneW), y: r1(padY + n.y * rowH) });
    }
    const depth = Math.max(1, t.depth);
    const H = padY * 2 + (depth - 1) * rowH;
    const s = Math.max(3.6, Math.min(6.2, laneW * 0.24));
    const hitR = Math.max(9, Math.min(laneW / 2, rowH / 2 - 2, 18));
    // Order rows so DOM order follows reading order (depth-first).
    const order = (ix.byObjection.get(o.id) ?? []).filter((id) => pts.has(id));
    return { pts, order, rowH, depth, H, s, hitR, padY };
  }, [o, ix, variant]);

  const onPath = useMemo(() => new Set(path), [path]);
  const oa = analysis.get(o.id);
  const pivot = oa && oa.label === "undec" ? oa.pivots[0] : undefined;
  const tensePairs = useMemo(() => new Set(tensions.filter((t) => geo.pts.has(t.node)).map((t) => `${t.node}>${t.reply}`)), [tensions, geo]);

  const active = cursor && geo.pts.has(cursor) ? cursor : focusId;
  const shown = hover ?? preview ?? (within ? active : null) ?? focusId;
  const shownInfo = ix.nodes.get(shown);

  const move = (to: string | undefined | null) => {
    if (!to || !geo.pts.has(to)) return;
    setCursor(to);
    els.current.get(to)?.focus();
  };

  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    const cur = geo.pts.get(active);
    if (!cur) return;
    const info = ix.nodes.get(active);
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        move(cur.parent);
        break;
      case "ArrowDown":
        e.preventDefault();
        move(info?.childIds[0]);
        break;
      case "ArrowLeft":
      case "ArrowRight": {
        e.preventDefault();
        const dir = e.key === "ArrowLeft" ? -1 : 1;
        const row = [...geo.pts.values()].filter((p) => p.depth === cur.depth).sort((a, b) => a.x - b.x);
        const i = row.findIndex((p) => p.id === cur.id);
        move(row[i + dir]?.id);
        break;
      }
      case "Enter":
      case " ":
        e.preventDefault();
        onSelect(active);
        break;
    }
  };

  const lab = (id: string): Label => labelOf(id);
  const counts = { moves: geo.order.length, rounds: geo.depth, parts: o.prongs.length };
  const many = counts.parts > 1;

  return (
    <div className={`ch-chart v-${variant}`}>
      {!bare && (
        <div className="ch-chart-head">
          <h2 className="ch-chart-h">All moves</h2>
          <p className="ch-chart-meta">
            {counts.moves} moves · {counts.rounds} {counts.rounds === 1 ? "round" : "rounds"}
            {many ? ` · ${counts.parts} parts` : ""}
          </p>
        </div>
      )}

      <div className="ch-chart-fig">
        <svg
          viewBox={`0 0 ${W} ${geo.H}`}
          preserveAspectRatio="xMidYMin meet"
          role="group"
          aria-label={`All ${counts.moves} moves in Objection ${o.numeral}. The arrow keys move between them and Enter opens one.`}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setWithin(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setWithin(false);
          }}
        >
          <defs>
            <pattern id={`ch-hatch-${variant}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#a195bd" strokeOpacity="0.7" strokeWidth="1" />
            </pattern>
          </defs>

          {/* round bands + round numbers */}
          {Array.from({ length: geo.depth }, (_, k) => (
            <g key={`band-${k}`} className={`ch-band ${k % 2 === 0 ? "b-obj" : "b-rep"}`}>
              <rect x={0} y={r1(k * geo.rowH)} width={W} height={geo.rowH} />
              <text x={14} y={r1(geo.padY + k * geo.rowH + 3.4)} textAnchor="middle">
                {k + 1}
              </text>
            </g>
          ))}

          {/* edges, colored by the side that replies */}
          <g className="ch-edges">
            {geo.order.map((id) => {
              const p = geo.pts.get(id)!;
              if (!p.parent) return null;
              const a = geo.pts.get(p.parent);
              if (!a) return null;
              const lit = onPath.has(id) && onPath.has(p.parent);
              const tense = tensePairs.has(`${p.parent}>${id}`);
              return <path key={`e-${id}`} d={tidyEdge(a, p, true)} className={`ch-edge s-${p.side} ${lit ? "lit" : ""} ${tense ? "tense" : ""}`} />;
            })}
          </g>

          {/* moves */}
          <g className="ch-nodes">
            {geo.order.map((id) => {
              const p = geo.pts.get(id)!;
              const l = lab(id);
              const info = ix.nodes.get(id)!;
              const isFocus = id === focusId;
              const mine = !!judgments[id];
              const label = toPlain(info.node.label);
              return (
                <g
                  key={id}
                  ref={(el) => {
                    if (el) els.current.set(id, el);
                    else els.current.delete(id);
                  }}
                  className={`ch-cn s-${p.side} st-${l} ${onPath.has(id) ? "on-path" : ""} ${isFocus ? "is-focus" : ""} ${hover === id || preview === id ? "hov" : ""}`}
                  style={rippleStyle(ripple, p.depth)}
                  role="button"
                  tabIndex={id === active ? 0 : -1}
                  aria-label={`${address(ix, id)}, round ${p.depth}, ${SIDE_WORD[p.side]}: ${label}. ${statusText(l, judgments[id])}.${isFocus ? " You are reading this." : ""}`}
                  aria-current={isFocus ? "true" : undefined}
                  onMouseEnter={coarse ? undefined : () => setHover(id)}
                  onFocus={() => setCursor(id)}
                  onKeyDown={onKey}
                  onClick={() => {
                    if (coarse && variant === "inline") setPreview((v) => (v === id ? null : id));
                    else onSelect(id);
                  }}
                >
                  <circle className="ch-cn-hit" cx={p.x} cy={p.y} r={geo.hitR} />
                  {l === "in" && <circle className="ch-cn-halo" cx={p.x} cy={p.y} r={r1(geo.s * 2.2)} />}
                  {isFocus && <circle className="ch-cn-ring" cx={p.x} cy={p.y} r={r1(geo.s + 6)} />}
                  <path className="ch-cn-g" d={glyphD(p.side, p.x, p.y, geo.s)} />
                  {p.side === "spinoza" && l !== "in" && <path d={glyphD(p.side, p.x, p.y, geo.s * 0.92)} fill={`url(#ch-hatch-${variant})`} pointerEvents="none" />}
                  {mine && <circle className="ch-cn-mine" cx={r1(p.x + geo.s * 1.35)} cy={r1(p.y - geo.s * 1.25)} r={1.9} />}
                  {pivot === id && <path className="ch-cn-flag" d={`M${r1(p.x - geo.s - 8)},${r1(p.y - 4)}v-11l-6,2.6l6,2.6`} pointerEvents="none" />}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className={`ch-readout ${shownInfo ? `s-${shownInfo.node.side}` : ""}`}>
        {shownInfo && (
          <>
            <p className="ch-readout-k">
              <span title={spellAddress(ix, shown)}>
                {address(ix, shown)} · Round {shownInfo.depth} · {SIDE_WORD[shownInfo.node.side]}
              </span>
              {shown === focusId && <span className="ch-readout-here">Reading</span>}
            </p>
            <p className={`ch-readout-t ${lab(shown) === "out" ? "lab-out" : ""}`}>{toPlain(shownInfo.node.label)}</p>
            <p className="ch-readout-s">
              {judgments[shown] ? (
                <span className="your-call">{statusText(lab(shown), judgments[shown])}</span>
              ) : (
                <span className={`ch-readout-st st-${lab(shown)}`}>{statusText(lab(shown))}</span>
              )}
              {shown === pivot && <span className="ch-readout-pivot">⚑ Your key call. Holds or fails here settles Objection {o.numeral}.</span>}
            </p>
            {preview && preview === shown && preview !== focusId && (
              <button type="button" className="btn small ch-readout-go" onClick={() => onSelect(preview)}>
                Read this move <span aria-hidden>→</span>
              </button>
            )}
          </>
        )}
      </div>

      <ul className="ch-legend" aria-label="Legend">
        <li>
          <svg viewBox="0 0 14 14" aria-hidden>
            <circle cx="7" cy="7" r="4.4" className="lg-open" />
          </svg>
          Open
        </li>
        <li>
          <svg viewBox="0 0 14 14" aria-hidden>
            <circle cx="7" cy="7" r="6.6" className="lg-halo" />
            <circle cx="7" cy="7" r="4.4" className="lg-in" />
          </svg>
          Stands
        </li>
        <li>
          <svg viewBox="0 0 14 14" aria-hidden>
            <circle cx="7" cy="7" r="4.4" className="lg-out" />
          </svg>
          Answered
        </li>
        <li>
          <svg viewBox="0 0 14 14" aria-hidden>
            <circle cx="6" cy="8" r="4" className="lg-open" />
            <circle cx="11" cy="3.4" r="1.9" className="lg-mine" />
          </svg>
          Your call
        </li>
        <li>
          <svg viewBox="0 0 14 14" aria-hidden>
            <path d="M2 12 C2 6 12 8 12 2" className="lg-tense" />
          </svg>
          Tension
        </li>
        {pivot && (
          <li>
            <svg viewBox="0 0 14 14" aria-hidden>
              <path d="M4 13V2l7 3-7 3" className="lg-flag" />
            </svg>
            Key call
          </li>
        )}
      </ul>
      <p className="ch-legend-sides" aria-hidden>
        <span className="s-skeptic">▲ Objector</span>
        <span className="s-theist">● Defender</span>
        <span className="s-spinoza">◆ Spinoza</span>
      </p>
      <div className="ch-chart-note">
        <p>
          Each mark is one move. Round 1, at the top, is the Objector’s {many ? `case in ${numWord(counts.parts)} parts` : "case"}, and each round below replies to the one above it.
          A move stands when every reply to it is answered, and it is answered as soon as one reply stands.
        </p>
        <p>
          {many ? (
            <>
              An address like {o.numeral}·1.2 means Objection {o.numeral}, part 1, reply 2.
            </>
          ) : (
            <>
              An address like {o.numeral}·1.2 means Objection {o.numeral}, reply 2 to its opening argument.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
