"use client";

/* The objection chart: every move of one objection as a top-down tree, scaled
   to fit its panel (no pan, no zoom). In the desktop panel the rows shrink
   (down to a floor) so every round fits the panel's height. Rounds run down in
   faint alternating bands, under a "Part 1 / Part 2…" line when there are
   parts. Each move is a glyph (▲ ● ◆) whose fill shows its status, and edges
   take the color of the side that replies. A move the reader marked carries
   a small ■ (a Fails is drawn hollow, not answered). The branch being read is
   lit, the focused move is ringed, and while the objection is open a small
   flag marks a move where either call would settle it. */

import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { useAtlas } from "../context";
import { address } from "../helpers";
import { tidyEdge, tidyLayout } from "../layout";
import { Glyph } from "../primitives";
import type { Label, Objection, Side } from "../types";
import { answeredMark, delayStyle, numWord, placeLabel, RippleCtx, rippleDelay, SIDE_WORD, shownLabel, spellPlace, statusText } from "./chamberShared";

const W = 400;
/* Desktop rows: as tall as 50 viewBox units, never under 30 (then the tree scales down instead). */
const ROW_MAX = 50;
const ROW_MIN = 30;
/** Room above round 1 for the "Part 1 / Part 2…" line. */
const PART_STRIP = 16;
/** On touch, a tap goes to the nearest move within this many CSS px. */
const TAP_REACH = 22;

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
  const ripple = useContext(RippleCtx);
  const [coarse, setCoarse] = useState(false);
  /** Whether the click under way began as a touch or pen press (the marks are too small to hit exactly). */
  const touchPress = useRef(false);
  const [hover, setHover] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [within, setWithin] = useState(false);
  const [seenFocus, setSeenFocus] = useState(focusId);
  const els = useRef(new Map<string, SVGGElement>());
  const rootRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  /** Panel only: the CSS px height and width the tree may take (the panel's height less everything else in it). */
  const [fit, setFit] = useState<{ h: number; w: number } | null>(null);

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

  const many = o.prongs.length > 1;
  const geo = useMemo(() => {
    const t = tidyLayout(o.prongs, { vertical: true, colW: 1, laneH: 1 });
    const depth = Math.max(1, t.depth);
    const top = many ? PART_STRIP : 0;
    let rowH = variant === "panel" ? ROW_MAX : 40;
    if (variant === "panel" && fit && fit.w > 0) {
      // Fit every round in the panel: the tree is W units wide at fit.w px, so it may be fit.h * W / fit.w units tall.
      rowH = r1(Math.max(ROW_MIN, Math.min(ROW_MAX, (fit.h * (W / fit.w) - top) / depth)));
    }
    const padL = 34;
    const padR = 12;
    const padY = rowH / 2;
    const avail = W - padL - padR;
    const lanes = Math.max(1, t.lanes);
    const laneW = Math.min(54, avail / lanes);
    const offX = padL + (avail - laneW * lanes) / 2;
    const pts = new Map<string, Pt>();
    for (const n of t.nodes) {
      pts.set(n.id, {
        id: n.id,
        side: n.side,
        depth: n.depth,
        parent: n.parent,
        x: r1(offX + (n.x + 0.5) * laneW),
        y: r1(top + padY + n.y * rowH),
      });
    }
    const H = top + padY * 2 + (depth - 1) * rowH;
    const s = Math.max(3.6, Math.min(6.2, laneW * 0.24));
    const hitR = Math.max(9, Math.min(laneW / 2, rowH / 2 - 2, 18));
    // Order rows so DOM order follows reading order (depth-first).
    const order = (ix.byObjection.get(o.id) ?? []).filter((id) => pts.has(id));
    // "Part 1", "Part 2"… over each part's opening move.
    const parts = many
      ? o.prongs.map((p, i) => ({
          id: p.id,
          n: i + 1,
          x: pts.get(p.id)?.x ?? 0,
        }))
      : [];
    return { pts, order, rowH, depth, H, s, hitR, padY, top, parts, laneW };
  }, [o, ix, variant, fit, many]);

  // Panel: measure the room the tree has, and re-measure when the panel or the window changes size.
  useLayoutEffect(() => {
    if (variant !== "panel") return;
    const root = rootRef.current;
    const fig = figRef.current;
    const panel = root?.closest<HTMLElement>(".ch-panel");
    if (!root || !fig || !panel) return;
    const measure = () => {
      const cs = getComputedStyle(panel);
      const maxH = parseFloat(cs.maxHeight);
      if (!Number.isFinite(maxH)) return setFit(null);
      let used = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      for (const el of Array.from(root.children) as HTMLElement[]) {
        if (el === fig) continue;
        const es = getComputedStyle(el);
        let h = el.getBoundingClientRect().height;
        // The readout keeps a fixed minimum (so hovering doesn't move things); an open help text scrolls the panel instead.
        if (el.classList.contains("ch-readout")) h = Math.max(parseFloat(es.minHeight) || 0, Math.min(h, (parseFloat(es.minHeight) || h) + 24));
        if (el instanceof HTMLDetailsElement) h = el.querySelector("summary")?.getBoundingClientRect().height ?? h;
        used += h + (parseFloat(es.marginTop) || 0) + (parseFloat(es.marginBottom) || 0);
      }
      const h = Math.max(120, Math.floor(maxH - used - 2));
      const w = Math.round(fig.clientWidth);
      setFit((f) => (f && f.h === h && f.w === w ? f : { h, w }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(panel);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [variant, geo.depth]);

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
  const counts = {
    moves: geo.order.length,
    rounds: geo.depth,
    parts: o.prongs.length,
  };

  /** Touch: a tap anywhere near a move picks the nearest one within reach (the marks are small and close together). */
  const nearest = (e: MouseEvent<SVGSVGElement>): string | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const reach = TAP_REACH / (ctm.a || 1);
    let best: string | null = null;
    let bd = Infinity;
    for (const p of geo.pts.values()) {
      const dd = Math.hypot(p.x - pt.x, p.y - pt.y);
      if (dd < bd) [best, bd] = [p.id, dd];
    }
    return bd <= reach ? best : null;
  };
  const pick = (id: string, touch: boolean) => {
    // On a phone, a tap previews (the readout's "Read this move" opens it); elsewhere a click opens it.
    if (touch && variant === "inline") setPreview((v) => (v === id ? null : id));
    else onSelect(id);
  };
  /* Taps resolve on click, not on pointerdown, so a swipe that starts on the chart scrolls the page
     without previewing a move. */
  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    touchPress.current = coarse || e.pointerType === "touch" || e.pointerType === "pen";
  };

  return (
    <div className={`ch-chart v-${variant}`} ref={rootRef}>
      {!bare && (
        <div className="ch-chart-head">
          <h2 className="ch-chart-h">All moves</h2>
          <p className="ch-chart-meta">
            {counts.moves} moves{many ? ` · ${counts.parts} parts` : ""} · {counts.rounds === 1 ? "1 round" : `up to ${counts.rounds} rounds`}
          </p>
        </div>
      )}

      <div className="ch-chart-fig" ref={figRef}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${geo.H}`}
          preserveAspectRatio="xMidYMin meet"
          style={variant === "panel" && fit ? { maxHeight: fit.h } : undefined}
          role="group"
          aria-label={`All ${counts.moves} moves in Objection ${o.numeral}. The arrow keys move between them and Enter opens one.`}
          onPointerDown={onPointerDown}
          onClick={(e) => {
            // A touch goes to the nearest move within reach, wherever it lands (a mouse click needs the mark itself).
            if (!touchPress.current) return;
            touchPress.current = false;
            const id = nearest(e);
            if (id) pick(id, true);
          }}
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

          {/* round bands + round numbers, and which part is which (each move's own label says both) */}
          <g aria-hidden="true">
            {Array.from({ length: geo.depth }, (_, k) => (
              <g key={`band-${k}`} className={`ch-band ${k % 2 === 0 ? "b-obj" : "b-rep"}`}>
                <rect x={0} y={r1(geo.top + k * geo.rowH)} width={W} height={geo.rowH} />
                <text x={14} y={r1(geo.top + geo.padY + k * geo.rowH + 3.4)} textAnchor="middle">
                  {k + 1}
                </text>
              </g>
            ))}
            {geo.parts.map((p) => (
              <text key={p.id} className="ch-part-k" x={p.x} y={11.5} textAnchor="middle">
                Part {p.n}
              </text>
            ))}
          </g>

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
              const shown = shownLabel(l, judgments[id]);
              const label = toPlain(info.node.label);
              const ms = r1(Math.max(3.2, geo.s * 0.62));
              return (
                <g
                  key={id}
                  ref={(el) => {
                    if (el) els.current.set(id, el);
                    else els.current.delete(id);
                  }}
                  className={`ch-cn s-${p.side} st-${shown} ${onPath.has(id) ? "on-path" : ""} ${isFocus ? "is-focus" : ""} ${hover === id || preview === id ? "hov" : ""}`}
                  style={delayStyle(rippleDelay(ripple, id, p.depth))}
                  role="button"
                  tabIndex={id === active ? 0 : -1}
                  aria-label={`${spellPlace(ix, id)}, ${SIDE_WORD[p.side]}: ${label}. ${statusText(l, judgments[id])}.${isFocus ? " You are reading this." : ""}`}
                  aria-current={isFocus ? "true" : undefined}
                  onMouseEnter={coarse ? undefined : () => setHover(id)}
                  onFocus={() => setCursor(id)}
                  onKeyDown={onKey}
                  onClick={() => {
                    // On touch the svg resolves the tap to the nearest move. (Keyboard Enter is handled in onKey.)
                    if (touchPress.current) return;
                    pick(id, false);
                  }}
                >
                  <circle className="ch-cn-hit" cx={p.x} cy={p.y} r={geo.hitR} />
                  {l === "in" && <circle className="ch-cn-halo" cx={p.x} cy={p.y} r={r1(geo.s * 2.2)} />}
                  {isFocus && <circle className="ch-cn-ring" cx={p.x} cy={p.y} r={r1(geo.s + 6)} />}
                  {/* keyboard focus: a solid bone ring on an ink gap, outside the "you are here" ring (dots mean Answered) */}
                  <circle className="ch-cn-fgap" cx={p.x} cy={p.y} r={r1(geo.s + (isFocus ? 10 : 5))} vectorEffect="non-scaling-stroke" />
                  <circle className="ch-cn-fring" cx={p.x} cy={p.y} r={r1(geo.s + (isFocus ? 10 : 5))} vectorEffect="non-scaling-stroke" />
                  <path className="ch-cn-g" d={glyphD(p.side, p.x, p.y, geo.s)} />
                  {p.side === "spinoza" && l !== "in" && <path d={glyphD(p.side, p.x, p.y, geo.s * 0.92)} fill={`url(#ch-hatch-${variant})`} pointerEvents="none" />}
                  {mine && <rect className="ch-cn-mine" x={r1(p.x + geo.s * 1.05)} y={r1(p.y - geo.s * 1.25 - ms)} width={ms} height={ms} pointerEvents="none" />}
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
              <span title={address(ix, shown)}>
                {placeLabel(ix, shown)} · {SIDE_WORD[shownInfo.node.side]}
              </span>
              {shown === focusId && <span className="ch-readout-here">You’re here</span>}
            </p>
            <p className={`ch-readout-t ${answeredMark(lab(shown), judgments[shown]) ? "lab-out" : ""}`}>{toPlain(shownInfo.node.label)}</p>
            <p className="ch-readout-s">
              {judgments[shown] ? (
                <span className="your-call">{statusText(lab(shown), judgments[shown])}</span>
              ) : (
                <span className={`ch-readout-st st-${lab(shown)}`}>{statusText(lab(shown))}</span>
              )}
              {shown === pivot && <span className="ch-readout-pivot">⚑ Deciding move. A call here would settle Objection {o.numeral} one way or the other.</span>}
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
            <rect x="2.6" y="2.6" width="8.8" height="8.8" className="lg-mine" />
          </svg>
          Your call
        </li>
        <li>
          <svg viewBox="0 0 14 14" aria-hidden>
            <path d="M2 12 C2 6 12 8 12 2" className="lg-tense" />
          </svg>
          Contradiction
        </li>
        {pivot && (
          <li>
            <svg viewBox="0 0 14 14" aria-hidden>
              <path d="M4 13V2l7 3-7 3" className="lg-flag" />
            </svg>
            Deciding move
          </li>
        )}
      </ul>
      {/* Side marks are hollow: filled means only status. */}
      <p className="ch-legend-sides" aria-hidden>
        <span className="s-skeptic">
          <Glyph side="skeptic" label="undec" size={10} /> Objector
        </span>
        <span className="s-theist">
          <Glyph side="theist" label="undec" size={10} /> Defender
        </span>
        <span className="s-spinoza">
          <Glyph side="spinoza" label="undec" size={10} /> Spinoza
        </span>
      </p>
      <details className="ch-chart-help">
        <summary className="ch-chart-help-sum">
          <span>How to read this chart</span>
          <span className="ch-more-chev" aria-hidden />
        </summary>
        <div className="ch-chart-note">
          <p>
            Each mark is one move. Round 1, at the top, is the Objector’s {many ? `case in ${numWord(counts.parts)} parts` : "case"}, and each round below replies to the one above
            it. One standing reply is enough to answer a move. A move stands only when every reply to it is answered or marked Fails. The last move on each branch has no reply, so
            it stays open until you mark it Holds or Fails. Your own Holds or Fails on any move overrides its replies.
          </p>
          <p>
            {many ? (
              <>
                Tooltips and the Outline also give each move an address. {o.numeral}·1.2 means Objection {o.numeral}, part 1, the second reply. Each extra number goes one round deeper, so {o.numeral}·1.2.3 is the third
                reply to {o.numeral}
                ·1.2.
              </>
            ) : (
              <>
                Tooltips and the Outline also give each move an address. {o.numeral}·1.2 means Objection {o.numeral}, the second reply to its opening argument. Each extra number goes one round deeper, so {o.numeral}·1.2.3
                is the third reply to {o.numeral}·1.2.
              </>
            )}
          </p>
        </div>
      </details>
    </div>
  );
}
