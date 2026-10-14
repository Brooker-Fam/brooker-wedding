"use client";

/* Library · Timeline (#/timeline[/<moment>]).

   Who argued what, and when, drawn as lines. Each lane is one objection; a
   moment that bears on several objections is a "knot", a bar joining those
   lanes (it hops over the lanes it doesn't touch).
   Spinoza's moments sit in their objections' lanes as lilac diamonds, and a
   lilac lane at the bottom keeps a plain tick for each, so his thread reads
   at a glance. Where marks would pile up, a cluster badge lists them. The
   time scale is piecewise so antiquity doesn't swallow the page.

   Desktop: the chart + a card for the chosen moment, then the chronicle (a
   readable list). Phone: the chronicle alone. Time flows down, compact lanes
   at the left, titles to the right that open in place. No horizontal scroll. */

import "./library.css";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { useAtlas } from "../context";
import { address } from "../helpers";
import { ThinkerChip } from "../primitives";
import { formatRoute } from "../router";
import type { DisputationIndex } from "../semantics";
import type { Moment, Objection, ObjectionId, Quote, Side } from "../types";
import { ERAS, GlyphKey, LibEmpty, LibHead, LibQuote, SIDE_WORD, eraOf, fold, scrollBehavior, spokenBy, useMedia, yearText } from "./Outline";

type LaneKey = ObjectionId | "spinoza";
type Filter = "all" | LaneKey;
type MSide = Side | "neutral";

interface Lane {
  key: LaneKey;
  numeral: string;
  name: string;
  o?: Objection;
}

const MSIDE_WORD: Record<MSide, string> = { ...SIDE_WORD, neutral: "Background" };
const isSpinoza = (m: Moment) => m.side === "spinoza" || m.thinker === "spinoza";
const sideCls = (s: MSide | undefined) => (s === "skeptic" || s === "theist" || s === "spinoza" ? s : "neutral");

/** A moment's quotation: its own, or else the quotation on its move when the moment's thinker is the one speaking
    (and the moment's text doesn't already quote it). */
function quoteOf(m: Moment, ix: DisputationIndex): Quote | undefined {
  if (m.quote?.text) return m.quote;
  const q = m.node ? ix.nodes.get(m.node)?.node.quote : undefined;
  const who = m.thinker ? ix.thinkers.get(m.thinker)?.name : undefined;
  if (!q?.text || !who || !spokenBy(q.who, who)) return undefined;
  if (fold(m.text).includes(fold(q.text).slice(0, 40))) return undefined;
  return q;
}

/* ---------- glyph for a moment (adds a square for context moments) ---------- */
function MGlyph({ side, size = 12, filled = false }: { side: MSide; size?: number; filled?: boolean }) {
  const h = size / 2;
  const s = sideCls(side);
  return (
    <svg className={`glyph-svg tl-g s-${s} ${filled ? "gl-in" : ""}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {s === "skeptic" ? (
        <path d={`M${h},${size * 0.06}L${size * 0.96},${size * 0.88}L${size * 0.04},${size * 0.88}Z`} />
      ) : s === "spinoza" ? (
        <path d={`M${h},${size * 0.02}L${size * 0.92},${h}L${h},${size * 0.98}L${size * 0.08},${h}Z`} />
      ) : s === "theist" ? (
        <circle cx={h} cy={h} r={size * 0.42} />
      ) : (
        <rect x={size * 0.18} y={size * 0.18} width={size * 0.64} height={size * 0.64} />
      )}
    </svg>
  );
}

/* ---------- the piecewise time scale ---------- */
function makeScale(years: number[]) {
  const lo = Math.min(-700, ...years.map((y) => Math.floor((y - 60) / 100) * 100));
  const hi = Math.max(2030, ...years.map((y) => y + 6));
  const stops = [lo, 1000, 1600, 1900, hi];
  const at = [0, 0.2, 0.37, 0.7, 1];
  const f = (y: number) => {
    const v = Math.min(hi, Math.max(lo, y));
    for (let i = 0; i < stops.length - 1; i++) {
      if (v <= stops[i + 1]) return at[i] + ((v - stops[i]) / (stops[i + 1] - stops[i])) * (at[i + 1] - at[i]);
    }
    return 1;
  };
  return { f, lo, hi };
}

const TICKS = [-600, -300, 1, 300, 600, 1000, 1200, 1400, 1600, 1700, 1800, 1900, 1950, 2000];

/* ---------- chart geometry ---------- */
const LABEL_W = 156;
const TOP = 34; // era label row
const BOTTOM = 34; // tick row
const LANE_H = 42; // lane height with one tier
const CTX_H = 30; // the strip for moments on no strand
const TIER = 20; // vertical offset between stacked marks
const HALF = 11; // half a mark's hit area (marks on one tier sit ≥ 22px apart, so hit areas never overlap)
const CLEAR = 8; // how close a knot's line may pass a mark it doesn't belong to (the glyph is 13px)
const BADGE_HALF = 25; // a cluster badge is at most 50px wide (two glyphs + a count)
const MAX_SHIFT = 10; // how far a mark may slide along its thread before it stacks instead
const TIERS = [0, -1, 1]; // at most three marks stack at one spot; more become a cluster
const CLUSTER_R = 26;

const shifts = (max: number) => {
  const out = [0];
  for (let d = 1; d <= max; d++) out.push(d, -d);
  return out;
};

interface Occ {
  x: number;
  tier: number;
  id: string;
  h: number;
  single: boolean;
}
interface Conn {
  id: string;
  x: number;
  k0: number;
  k1: number;
}
interface ClusterBox {
  cid: string;
  row: number;
  x: number;
  tier: number;
  ids: string[];
}
interface RowGeo {
  key: string;
  top: number;
  h: number;
  y: number;
  x0: number;
  x1: number;
}
interface Geo {
  rows: RowGeo[];
  /** Each individually drawn moment: its rows (first = the one that carries its option) at one x and tier. */
  marks: Map<string, { x: number; tier: number; rows: number[] }>;
  clusters: ClusterBox[];
  clusterOf: Map<string, string>;
  knots: { id: string; x: number; tier: number; rows: number[] }[];
  ticks: { id: string; x: number }[];
  ctxRow: number;
  spRow: number;
  lanesBottom: number;
  height: number;
}

/** Lay the marks out: knots first (they need a clear column), then everything else in time order. */
function layout(sorted: Moment[], lanes: Lane[], objRows: (m: Moment) => number[], xOf: (y: number) => number, plotW: number): Geo {
  const spRow = lanes.findIndex((l) => l.key === "spinoza");
  const ctxRow = lanes.length; // the context strip, if any moment needs it
  const occ: Occ[][] = Array.from({ length: lanes.length + 1 }, () => []);
  const conns: Conn[] = [];
  const key = (row: number, tier: number) => row * 8 + tier + 3;
  const clamp = (x: number) => Math.min(plotW - 4, Math.max(4, x));

  const markFree = (row: number, tier: number, x: number, h: number) => {
    for (const o of occ[row]) if (o.tier === tier && Math.abs(o.x - x) < o.h + h - 0.01) return false;
    const k = key(row, tier);
    for (const c of conns) if (k >= c.k0 && k <= c.k1 && Math.abs(c.x - x) < h - HALF + CLEAR) return false;
    return true;
  };
  const connFree = (x: number, k0: number, k1: number) => {
    for (let r = 0; r < occ.length; r++)
      for (const o of occ[r]) {
        const k = key(r, o.tier);
        if (k >= k0 && k <= k1 && Math.abs(o.x - x) < o.h - HALF + CLEAR) return false;
      }
    for (const c of conns) if (c.k0 <= k1 && k0 <= c.k1 && Math.abs(c.x - x) < 6) return false;
    return true;
  };

  const marks = new Map<string, { x: number; tier: number; rows: number[] }>();
  const knots: Geo["knots"] = [];
  const clusters: ClusterBox[] = [];
  const clusterOf = new Map<string, string>();

  // 1 · knots: a moment on two or more objection lanes
  for (const m of sorted) {
    const rows = objRows(m);
    if (rows.length < 2) continue;
    const tx = xOf(m.year);
    let at: { x: number; tier: number } | null = null;
    for (const max of [MAX_SHIFT, MAX_SHIFT * 3]) {
      for (const t of TIERS) {
        for (const d of shifts(max)) {
          const x = clamp(tx + d);
          if (rows.every((r) => markFree(r, t, x, HALF)) && connFree(x, key(rows[0], t), key(rows[rows.length - 1], t))) {
            at = { x, tier: t };
            break;
          }
        }
        if (at) break;
      }
      if (at) break;
    }
    const p = at ?? { x: clamp(tx), tier: 0 };
    rows.forEach((r) => occ[r].push({ x: p.x, tier: p.tier, id: m.id, h: HALF, single: false }));
    conns.push({ id: m.id, x: p.x, k0: key(rows[0], p.tier), k1: key(rows[rows.length - 1], p.tier) });
    marks.set(m.id, { x: p.x, tier: p.tier, rows });
    knots.push({ id: m.id, x: p.x, tier: p.tier, rows });
  }

  // 2 · everything on one row (an objection lane, the Spinoza lane, or the context strip)
  for (const m of sorted) {
    const rows = objRows(m);
    if (rows.length >= 2) continue;
    const row = rows.length === 1 ? rows[0] : isSpinoza(m) && spRow >= 0 ? spRow : ctxRow;
    const tx = xOf(m.year);
    let at: { x: number; tier: number } | null = null;
    // a small slide along the thread, then a stack; a longer slide before giving up to a cluster
    for (const max of [MAX_SHIFT, MAX_SHIFT * 2 + 2]) {
      for (const t of TIERS) {
        for (const d of shifts(max)) {
          const x = clamp(tx + d);
          if (markFree(row, t, x, HALF)) {
            at = { x, tier: t };
            break;
          }
        }
        if (at) break;
      }
      if (at) break;
    }
    if (at) {
      occ[row].push({ x: at.x, tier: at.tier, id: m.id, h: HALF, single: true });
      marks.set(m.id, { x: at.x, tier: at.tier, rows: [row] });
      continue;
    }
    // No room: join (or start) a cluster here.
    let cl = clusters.find((c) => c.row === row && Math.abs(c.x - tx) <= CLUSTER_R + BADGE_HALF);
    if (!cl) {
      const near = occ[row].filter((o) => o.single && Math.abs(o.x - tx) <= CLUSTER_R);
      occ[row] = occ[row].filter((o) => !near.includes(o));
      near.forEach((o) => marks.delete(o.id));
      const ids = [...near.map((o) => o.id), m.id];
      const cx = ids.reduce((s, id) => s + xOf(sorted.find((x) => x.id === id)!.year), 0) / ids.length;
      let spot: { x: number; tier: number } | null = null;
      for (const t of TIERS) {
        for (const d of shifts(18)) {
          const x = clamp(cx + d);
          if (markFree(row, t, x, BADGE_HALF)) {
            spot = { x, tier: t };
            break;
          }
        }
        if (spot) break;
      }
      const s = spot ?? { x: clamp(cx), tier: 0 };
      cl = { cid: `c${clusters.length}`, row, x: s.x, tier: s.tier, ids: [] };
      occ[row].push({ x: s.x, tier: s.tier, id: cl.cid, h: BADGE_HALF, single: false });
      clusters.push(cl);
      near.forEach((o) => {
        cl!.ids.push(o.id);
        clusterOf.set(o.id, cl!.cid);
      });
    }
    cl.ids.push(m.id);
    clusterOf.set(m.id, cl.cid);
  }
  // keep each cluster's list in time order
  const order = new Map(sorted.map((m, i) => [m.id, i]));
  clusters.forEach((c) => c.ids.sort((a, b) => order.get(a)! - order.get(b)!));

  // 3 · rows: each grows to fit the tiers it uses
  const rows: RowGeo[] = [];
  let top = TOP;
  for (let r = 0; r <= lanes.length; r++) {
    const list = occ[r];
    if (r === ctxRow && list.length === 0) continue;
    const up = Math.max(0, ...list.map((o) => -o.tier));
    const down = Math.max(0, ...list.map((o) => o.tier));
    const base = r === ctxRow ? CTX_H : LANE_H;
    const h = base + (up + down) * TIER;
    const xs = list.map((o) => o.x);
    rows[r] = { key: r === ctxRow ? "context" : lanes[r].key, top, h, y: top + base / 2 + up * TIER, x0: xs.length ? Math.min(...xs) : 0, x1: xs.length ? Math.max(...xs) : 0 };
    top += h;
  }

  // 4 · Spinoza's ticks (his moments that live in objection lanes)
  const ticks: Geo["ticks"] = [];
  if (spRow >= 0) {
    for (const m of sorted) {
      if (!isSpinoza(m) || objRows(m).length === 0) continue;
      const x = marks.get(m.id)?.x ?? clusters.find((c) => c.cid === clusterOf.get(m.id))?.x;
      if (x !== undefined) ticks.push({ id: m.id, x });
    }
    const sp = rows[spRow];
    const xs = [...ticks.map((t) => t.x), ...occ[spRow].map((o) => o.x)];
    if (sp && xs.length) {
      sp.x0 = Math.min(...xs);
      sp.x1 = Math.max(...xs);
    }
  }
  return { rows, marks, clusters, clusterOf, knots, ticks, ctxRow, spRow, lanesBottom: top, height: top + BOTTOM };
}

export default function Timeline({ moment }: { moment?: string }) {
  const { d, ix, go } = useAtlas();
  const wide = useMedia("(min-width: 900px)");
  const [filter, setFilter] = useState<Filter>("all");
  const [said, setSaid] = useState("");

  const hasSpinoza = useMemo(() => d.moments.some(isSpinoza), [d]);
  const lanes = useMemo<Lane[]>(() => {
    const ls: Lane[] = d.objections.map((o) => ({ key: o.id, numeral: o.numeral, name: o.short || o.title, o }));
    if (hasSpinoza) ls.push({ key: "spinoza", numeral: "◆", name: "Spinoza" });
    return ls;
  }, [d, hasSpinoza]);
  const laneIndex = useMemo(() => new Map(lanes.map((l, i) => [l.key, i])), [lanes]);

  const sorted = useMemo(() => d.moments.map((m, i) => ({ m, i })).sort((a, b) => a.m.year - b.m.year || a.i - b.i).map((x) => x.m), [d]);
  /** The objection lanes a moment sits in, top to bottom. */
  const objLanes = useCallback(
    (m: Moment): LaneKey[] => {
      const out: LaneKey[] = [];
      for (const s of m.strands ?? []) if ((s as string) !== "spinoza" && laneIndex.has(s) && !out.includes(s)) out.push(s);
      return out.sort((a, b) => laneIndex.get(a)! - laneIndex.get(b)!);
    },
    [laneIndex],
  );
  /** Every strand a moment belongs to (its objections, plus Spinoza's thread). */
  const lanesOf = useCallback((m: Moment): LaneKey[] => (isSpinoza(m) && laneIndex.has("spinoza") ? [...objLanes(m), "spinoza"] : objLanes(m)), [objLanes, laneIndex]);
  const visible = useCallback((m: Moment) => filter === "all" || lanesOf(m).includes(filter), [filter, lanesOf]);
  const shown = useMemo(() => sorted.filter(visible), [sorted, visible]);

  const selected = moment ? ix.moments.get(moment) : undefined;
  const missing = !!moment && !selected;
  const select = useCallback((id: string | undefined) => go({ view: "timeline", moment: id }, { replace: true }), [go]);

  // Bring the chosen moment into view: on arrival (e.g. a chamber's "Through history →") once the view has settled,
  // and afterwards whenever a mark is chosen on the chart and its card would sit below the fold.
  const listRef = useRef<HTMLOListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const arrived = useRef(false);
  const selId = selected?.id;
  useEffect(() => {
    const first = !arrived.current;
    arrived.current = true;
    if (!selId) return;
    const t = setTimeout(
      () => {
        if (wide) {
          const stage = stageRef.current?.getBoundingClientRect();
          const card = stageRef.current?.querySelector(".tl-card");
          const r = card?.getBoundingClientRect();
          // only while the reader is looking at the chart (not when the choice came from the chronicle below)
          if (!stage || !card || !r || stage.top > window.innerHeight || stage.bottom < 0) return;
          if (r.bottom > window.innerHeight || r.top < 60) card.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
        } else if (first) {
          listRef.current?.querySelector(`[data-mid="${CSS.escape(selId)}"]`)?.scrollIntoView({ block: "center", behavior: scrollBehavior() });
        }
      },
      first ? 440 : 60,
    );
    return () => clearTimeout(t);
  }, [selId, wide]);

  const showOnChart = useCallback(
    (id: string) => {
      select(id);
      requestAnimationFrame(() => {
        stageRef.current?.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
        stageRef.current?.querySelector<HTMLElement>(`[data-opt="${CSS.escape(id)}"]`)?.focus({ preventScroll: true });
      });
    },
    [select],
  );

  const years = sorted.map((m) => m.year);
  const span = sorted.length ? `${yearText(Math.min(...years)).replace(" CE", "")} to ${yearText(Math.max(...years)).replace(" CE", "")}` : "";

  return (
    <div className="lib lib-timeline">
      <LibHead
        current="timeline"
        className="lib-head-split"
        title="Timeline"
        dek={
          <>
            Who argued what, and when.
            <span className="lib-dek-more"> Each line on the chart is one objection. When a moment bears on several objections, a bar joins their lines.</span>
          </>
        }
        meta={sorted.length ? `${sorted.length} moments · ${span}` : undefined}
      />
      <p className="sr-only" aria-live="polite">
        {said}
      </p>

      {sorted.length === 0 ? (
        <LibEmpty
          current="timeline"
          title="No moments yet."
          text="Dated moments will appear here, each linked to the objections it bears on and the move it shaped. Until then, the outline has every move."
        />
      ) : (
        <>
          {missing && <p className="lib-notice">There’s no moment called “{moment}”. Choose one below.</p>}
          {wide ? (
            <div className="tl-stage" ref={stageRef}>
              <Chart lanes={lanes} sorted={sorted} objLanes={objLanes} lanesOf={lanesOf} visible={visible} filter={filter} setFilter={setFilter} selected={selected?.id} select={select} shown={shown} />
              <MomentCard m={selected} shown={shown} select={select} lanes={lanes} objLanes={objLanes} announce={(t) => setSaid((s) => (s === t ? `${t}\u00a0` : t))} />
            </div>
          ) : (
            <StrandChips lanes={lanes} filter={filter} setFilter={setFilter} sorted={sorted} lanesOf={lanesOf} />
          )}

          <section className="tl-chron" aria-labelledby="tl-chron-h">
            <div className="tl-chron-head">
              <h2 id="tl-chron-h" className="lib-h2 serif">
                All moments
              </h2>
              <p className="tl-chron-note">
                {filter === "all" ? (
                  wide ? (
                    "Oldest first. Open one to read more about it."
                  ) : (
                    "Oldest first. Tap one to read more about it."
                  )
                ) : (
                  <>
                    Showing only <strong>{lanes.find((l) => l.key === filter)?.name}</strong>.{" "}
                    <button type="button" className="lib-link" onClick={() => setFilter("all")}>
                      Show all
                    </button>
                  </>
                )}
              </p>
              {wide ? (
                <ThreadLegend lanes={lanes} />
              ) : (
                <details className="tl-howto">
                  <summary className="mono">How to read the lines</summary>
                  <ThreadLegend lanes={lanes} />
                </details>
              )}
            </div>
            {shown.length === 0 ? (
              <p className="lib-none">No moments for this objection yet.</p>
            ) : (
              <Chronicle listRef={listRef} lanes={lanes} items={shown} lanesOf={lanesOf} selected={selected?.id} select={select} wide={wide} onShow={showOnChart} />
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ThreadLegend({ lanes }: { lanes: Lane[] }) {
  const objs = lanes.filter((l) => l.key !== "spinoza");
  const sp = lanes.some((l) => l.key === "spinoza");
  return (
    <ul className="tl-legend">
      <li className="tl-legend-marks">
        <GlyphKey context />
      </li>
      <li>
        <span className="tl-legend-i tl-legend-thread" aria-hidden />
        Each line is one objection, drawn from its first moment to its last.
        {objs.length > 1 && (
          <>
            {" "}
            The numerals above each era name the lines, {objs[0].numeral} to {objs[objs.length - 1].numeral} for the objections{sp ? " and ◆ for Spinoza" : ""}.
          </>
        )}
      </li>
      <li>
        <span className="tl-legend-i tl-legend-knot" aria-hidden />A bar across several lines is one moment that bears on each of those objections.
      </li>
    </ul>
  );
}

/* ======================================================================
   Strand filter chips (phone)
   ====================================================================== */
function StrandChips({
  lanes,
  filter,
  setFilter,
  sorted,
  lanesOf,
}: {
  lanes: Lane[];
  filter: Filter;
  setFilter: (f: Filter) => void;
  sorted: Moment[];
  lanesOf: (m: Moment) => LaneKey[];
}) {
  const count = (k: LaneKey) => sorted.filter((m) => lanesOf(m).includes(k)).length;
  return (
    <div className="tl-chips" role="group" aria-label="Show one objection">
      <button type="button" className="tl-chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
        All
      </button>
      {lanes.map((l) => (
        <button
          key={l.key}
          type="button"
          className={`tl-chip ${l.key === "spinoza" ? "s-spinoza tl-chip-sp" : ""}`}
          aria-pressed={filter === l.key}
          onClick={() => setFilter(filter === l.key ? "all" : l.key)}
        >
          <span className="tl-chip-num serif" aria-hidden={l.key === "spinoza" ? true : undefined}>
            {l.numeral}
          </span>
          {l.key === "spinoza" ? "Spinoza" : l.name}
          <span className="tl-chip-n mono">{count(l.key)}</span>
        </button>
      ))}
    </div>
  );
}

/* ======================================================================
   The braided chart (desktop)
   ====================================================================== */
function Chart({
  lanes,
  sorted,
  objLanes,
  lanesOf,
  visible,
  filter,
  setFilter,
  selected,
  select,
  shown,
}: {
  lanes: Lane[];
  sorted: Moment[];
  objLanes: (m: Moment) => LaneKey[];
  lanesOf: (m: Moment) => LaneKey[];
  visible: (m: Moment) => boolean;
  filter: Filter;
  setFilter: (f: Filter) => void;
  selected?: string;
  select: (id: string | undefined) => void;
  shown: Moment[];
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const [hot, setHot] = useState<string | null>(null);
  const [foc, setFoc] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const laneIdx = useMemo(() => new Map(lanes.map((l, i) => [l.key, i])), [lanes]);
  const byId = useMemo(() => new Map(sorted.map((m) => [m.id, m])), [sorted]);
  const scale = useMemo(() => makeScale(sorted.map((m) => m.year)), [sorted]);
  const plotW = Math.max(320, width - LABEL_W - 14);
  const xOf = useCallback((y: number) => Math.round(scale.f(y) * plotW * 10) / 10, [scale, plotW]);
  const objRows = useCallback((m: Moment) => objLanes(m).map((k) => laneIdx.get(k)!), [objLanes, laneIdx]);
  const geo = useMemo(() => layout(sorted, lanes, objRows, xOf, plotW), [sorted, lanes, objRows, xOf, plotW]);
  const counts = useMemo(() => new Map(lanes.map((l) => [l.key, sorted.filter((m) => lanesOf(m).includes(l.key)).length])), [lanes, sorted, lanesOf]);

  const eras = useMemo(() => {
    return ERAS.map((e, i) => {
      const a = xOf(i === 0 ? scale.lo : ERAS[i - 1].to);
      const b = xOf(Math.min(scale.hi, e.to));
      return { e, a, b };
    }).filter((x) => x.b - x.a > 1);
  }, [scale, xOf]);

  const ticks = useMemo(() => {
    const out: { y: number; x: number }[] = [];
    for (const y of TICKS) {
      if (y < scale.lo || y > scale.hi) continue;
      const x = xOf(y);
      if (out.length && x - out[out.length - 1].x < 56) continue;
      if (plotW - x < 24) continue;
      out.push({ y, x });
    }
    return out;
  }, [scale, xOf, plotW]);

  const clusterById = useMemo(() => new Map(geo.clusters.map((c) => [c.cid, c])), [geo]);
  /** Where a moment is drawn: its own mark, or its cluster's badge. */
  const spotOf = useCallback(
    (id: string | null | undefined) => {
      if (!id) return undefined;
      const mk = geo.marks.get(id);
      if (mk) return { x: mk.x, y: geo.rows[mk.rows[0]].y + mk.tier * TIER, top: Math.min(...mk.rows.map((r) => geo.rows[r].y + mk.tier * TIER)) };
      const c = clusterById.get(geo.clusterOf.get(id) ?? "");
      if (c) {
        const y = geo.rows[c.row].y + c.tier * TIER;
        return { x: c.x, y, top: y };
      }
      return undefined;
    },
    [geo, clusterById],
  );
  const sel = spotOf(selected);
  const tip = hot && hot !== selected ? spotOf(hot) : undefined;
  const tipM = hot ? byId.get(hot) : undefined;
  const hotCluster = hot?.startsWith("cluster:") ? clusterById.get(hot.slice(8)) : undefined;

  const strandText = (m: Moment) => {
    const ks = objLanes(m);
    const names = ks.map((k) => {
      const l = lanes[laneIdx.get(k)!];
      return `${l.numeral} ${l.name}`;
    });
    return names.length ? `${names.length === 1 ? "Objection" : "Objections"} ${names.join(", ")}` : "Not tied to one objection";
  };
  const optLabel = (m: Moment) => `${m.when}: ${m.title}. ${MSIDE_WORD[m.side] ?? "Background"}${isSpinoza(m) && m.side !== "spinoza" ? ", on Spinoza's line" : ""}. ${strandText(m)}.`;

  // Roving tab stop: the chosen moment if it's on the followed strand, else the first one shown.
  const rover = selected && shown.some((m) => m.id === selected) ? selected : shown[0]?.id;
  const focusOpt = (id: string) => requestAnimationFrame(() => wrap.current?.querySelector<HTMLElement>(`[data-opt="${CSS.escape(id)}"]`)?.focus());

  const step = (dir: 1 | -1 | "first" | "last", from?: string) => {
    if (!shown.length) return;
    const refId = from ?? selected;
    const i = shown.findIndex((m) => m.id === refId);
    const ref = refId ? byId.get(refId) : undefined;
    let next: number;
    if (dir === "first") next = 0;
    else if (dir === "last") next = shown.length - 1;
    else if (i >= 0) next = Math.min(shown.length - 1, Math.max(0, i + dir));
    else if (ref) {
      // the reference mark is off the followed strand: step to its nearest neighbour on it
      const after = shown.findIndex((m) => m.year > ref.year);
      next = dir === 1 ? (after < 0 ? shown.length - 1 : after) : (after < 0 ? shown.length : after) - 1;
      next = Math.max(0, next);
    } else next = dir === 1 ? 0 : shown.length - 1;
    const m = shown[next];
    select(m.id);
    focusOpt(m.id);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, 1 | -1 | "first" | "last"> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: "first", End: "last" };
    const dir = map[e.key];
    if (dir === undefined) return;
    e.preventDefault();
    const from = (e.target as HTMLElement).closest<HTMLElement>("[data-opt]")?.dataset.opt;
    step(dir, from);
  };

  // The cluster menu closes on Escape, on a click elsewhere, or when focus leaves it.
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback((refocus?: string) => {
    setMenu(null);
    if (refocus) requestAnimationFrame(() => wrap.current?.querySelector<HTMLElement>(`[data-opt="${CSS.escape(refocus)}"]`)?.focus());
  }, []);
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || (t instanceof Element && t.closest(`[data-cluster="${menu}"]`))) return;
      setMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    requestAnimationFrame(() => (menuRef.current?.querySelector<HTMLElement>("button[aria-current='true']") ?? menuRef.current?.querySelector<HTMLElement>("button"))?.focus());
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu]);
  const openCluster = menu ? clusterById.get(menu) : undefined;

  const hover = (id: string) => ({
    onMouseEnter: () => setHot(id),
    onMouseLeave: () => setHot((h) => (h === id ? null : h)),
  });
  const focusHot = (id: string) => ({
    onFocus: () => {
      setHot(id);
      setFoc(id);
    },
    onBlur: () => {
      setHot((h) => (h === id ? null : h));
      setFoc((f) => (f === id ? null : f));
    },
  });

  const spCls = (m: Moment) => (isSpinoza(m) ? "spinoza" : sideCls(m.side));
  const hopPath = (k: Geo["knots"][number]) => {
    const ys = k.rows.map((r) => geo.rows[r].y + k.tier * TIER);
    const y0 = Math.min(...ys);
    const y1 = Math.max(...ys);
    const r0 = Math.min(...k.rows);
    const r1 = Math.max(...k.rows);
    let dPath = `M${k.x},${y0}`;
    for (let r = r0 + 1; r < r1; r++) {
      if (k.rows.includes(r)) continue;
      const yl = geo.rows[r].y; // hop over the thread of a lane this moment doesn't touch
      dPath += `L${k.x},${yl - 5}A5,5 0 0 1 ${k.x},${yl + 5}`;
    }
    return `${dPath}L${k.x},${y1}`;
  };

  return (
    <div className="tl-chart-wrap">
      <div className="tl-chart" ref={wrap} style={{ height: geo.height }}>
        {/* lane labels, which are also the filter */}
        <div className="tl-lab-col" role="group" aria-label="Show one objection">
          <button type="button" className="tl-all mono" aria-pressed={filter === "all"} onClick={() => setFilter("all")} style={{ top: 4 }}>
            All
          </button>
          {lanes.map((l, i) => {
            const g = geo.rows[i];
            return (
              <button
                key={l.key}
                type="button"
                className={`tl-lab ${l.key === "spinoza" ? "s-spinoza tl-lab-sp" : ""} ${filter !== "all" && filter !== l.key ? "dim" : ""}`}
                style={{ top: g.top, height: g.h }}
                aria-pressed={filter === l.key}
                onClick={() => setFilter(filter === l.key ? "all" : l.key)}
                title={filter === l.key ? "Show all" : `Show only ${l.name}`}
              >
                <span className="tl-lab-num serif" style={{ top: g.y - g.top }} aria-hidden={l.key === "spinoza" ? true : undefined}>
                  {l.numeral}
                </span>
                <span className="tl-lab-name mono" style={{ top: g.y - g.top }}>
                  {l.name}
                  <span className="tl-lab-n">{counts.get(l.key)}</span>
                </span>
              </button>
            );
          })}
          {geo.rows[geo.ctxRow] && (
            <span className="tl-lab-ctx mono" style={{ top: geo.rows[geo.ctxRow].y }} aria-hidden>
              <MGlyph side="neutral" size={9} /> Background
            </span>
          )}
        </div>

        <div className="tl-plot" style={{ left: LABEL_W, width: plotW }}>
          {/* era bands */}
          {eras.map(({ e, a, b }, i) => (
            <div key={e.id} className={`tl-era ${i % 2 ? "alt" : ""}`} style={{ left: a, width: b - a, height: geo.lanesBottom }}>
              {b - a > 64 && <span className="tl-era-name mono">{e.name}</span>}
            </div>
          ))}

          <svg className="tl-svg" width={plotW} height={geo.height} aria-hidden>
            <defs>
              <pattern id="tl-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#a195bd" strokeOpacity="0.16" strokeWidth="1.2" />
              </pattern>
            </defs>
            {lanes.map((l, i) => {
              const g = geo.rows[i];
              const dim = filter !== "all" && filter !== l.key;
              return (
                <g key={l.key} className={`tl-thread ${l.key === "spinoza" ? "sp" : ""} ${dim ? "dim" : ""}`}>
                  {l.key === "spinoza" && <rect x={0} y={g.top + 4} width={plotW} height={g.h - 8} fill="url(#tl-hatch)" rx={6} />}
                  <line className="tl-base" x1={0} x2={plotW} y1={g.y} y2={g.y} />
                  {g.x1 > g.x0 && <line className="tl-strand" x1={g.x0} x2={g.x1} y1={g.y} y2={g.y} />}
                </g>
              );
            })}
            {geo.rows[geo.ctxRow] && <line className="tl-base" x1={0} x2={plotW} y1={geo.rows[geo.ctxRow].y} y2={geo.rows[geo.ctxRow].y} />}
            {/* knots: one moment on several objections, joined only where it touches, hopping the rest */}
            {geo.knots.map((k) => {
              const m = byId.get(k.id)!;
              return <path key={k.id} className={`tl-knot s-${spCls(m)} ${visible(m) ? "" : "dim"} ${selected === k.id || hot === k.id ? "lit" : ""}`} d={hopPath(k)} />;
            })}
            {/* stacked marks hang from their thread by a hairline */}
            {[...geo.marks].flatMap(([id, mk]) =>
              mk.tier === 0
                ? []
                : mk.rows.map((r) => (
                    <line key={`st-${id}-${r}`} className={`tl-stem ${visible(byId.get(id)!) ? "" : "dim"}`} x1={mk.x} x2={mk.x} y1={geo.rows[r].y} y2={geo.rows[r].y + mk.tier * TIER} />
                  )),
            )}
            {geo.clusters.map((c) =>
              c.tier === 0 ? null : <line key={`st-${c.cid}`} className="tl-stem" x1={c.x} x2={c.x} y1={geo.rows[c.row].y} y2={geo.rows[c.row].y + c.tier * TIER} />,
            )}
            {/* Spinoza's thread: a plain tick for each of his moments, no connector */}
            {geo.spRow >= 0 &&
              geo.ticks.map((t) => {
                const y = geo.rows[geo.spRow].y;
                const m = byId.get(t.id)!;
                return <line key={`tk-${t.id}`} className={`tl-sptick ${visible(m) ? "" : "dim"} ${selected === t.id || hot === t.id ? "lit" : ""}`} x1={t.x} x2={t.x} y1={y - 7} y2={y + 7} />;
              })}
            {sel && <line className="tl-guide" x1={sel.x} x2={sel.x} y1={TOP - 8} y2={geo.lanesBottom + 6} />}
            {ticks.map((t) => (
              <g key={t.y} className="tl-tick">
                <line x1={t.x} x2={t.x} y1={geo.lanesBottom} y2={geo.lanesBottom + 5} />
                <text x={t.x} y={geo.lanesBottom + 20} textAnchor="middle">
                  {t.y === 1 ? "1 CE" : t.y < 0 ? `${-t.y} BCE` : t.y}
                </text>
              </g>
            ))}
          </svg>

          {/* the moments: one option each, oldest first (arrow keys step through them) */}
          <div className="tl-marks" role="listbox" aria-label="Moments, oldest first" aria-orientation="horizontal" onKeyDown={onKey}>
            {sorted.map((m) => {
              const mk = geo.marks.get(m.id);
              const on = selected === m.id;
              const common = {
                "data-opt": m.id,
                role: "option",
                "aria-selected": on,
                "aria-label": optLabel(m),
                tabIndex: rover === m.id ? 0 : -1,
              } as const;
              if (mk) {
                const r = mk.rows[0];
                return (
                  <button
                    key={m.id}
                    type="button"
                    {...common}
                    className={`tl-dot s-${spCls(m)} ${on ? "on" : ""} ${hot === m.id ? "hot" : ""} ${visible(m) ? "" : "dim"}`}
                    style={{ left: mk.x, top: geo.rows[r].y + mk.tier * TIER }}
                    onClick={() => select(m.id)}
                    {...hover(m.id)}
                    {...focusHot(m.id)}
                  >
                    <MGlyph side={isSpinoza(m) ? "spinoza" : m.side} size={13} filled={on} />
                  </button>
                );
              }
              const c = clusterById.get(geo.clusterOf.get(m.id) ?? "");
              if (!c) return null;
              // A clustered moment: its option sits over the badge (the badge shows its focus).
              return (
                <button
                  key={m.id}
                  type="button"
                  {...common}
                  className="tl-copt"
                  style={{ left: c.x, top: geo.rows[c.row].y + c.tier * TIER }}
                  onClick={() => select(m.id)}
                  {...focusHot(m.id)}
                />
              );
            })}
            {/* the other lanes a knot touches: the same moment again (not a separate option) */}
            {[...geo.marks].flatMap(([id, mk]) =>
              mk.rows.slice(1).map((r) => {
                const m = byId.get(id)!;
                return (
                  <button
                    key={`${id}-${r}`}
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    className={`tl-dot s-${spCls(m)} ${selected === id ? "on" : ""} ${hot === id ? "hot" : ""} ${visible(m) ? "" : "dim"}`}
                    style={{ left: mk.x, top: geo.rows[r].y + mk.tier * TIER }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      select(id);
                      focusOpt(id);
                    }}
                    {...hover(id)}
                  >
                    <MGlyph side={isSpinoza(m) ? "spinoza" : m.side} size={13} filled={selected === id} />
                  </button>
                );
              }),
            )}
          </div>

          {/* cluster badges (pointer only; the keyboard steps through their moments directly) */}
          {geo.clusters.map((c) => {
            const ms = c.ids.map((id) => byId.get(id)!);
            const sides = [...new Set(ms.map((m) => spCls(m)))];
            const on = !!selected && c.ids.includes(selected);
            const focused = !!foc && c.ids.includes(foc);
            const lit = ms.some(visible);
            return (
              <button
                key={c.cid}
                type="button"
                tabIndex={-1}
                aria-hidden
                data-cluster={c.cid}
                className={`tl-cluster ${sides.length === 1 ? `s-${sides[0]}` : "mixed"} ${on ? "on" : ""} ${focused ? "focus" : ""} ${lit ? "" : "dim"}`}
                style={{ left: c.x, top: geo.rows[c.row].y + c.tier * TIER }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setMenu((x) => (x === c.cid ? null : c.cid))}
                onMouseEnter={() => setHot(`cluster:${c.cid}`)}
                onMouseLeave={() => setHot((h) => (h === `cluster:${c.cid}` ? null : h))}
              >
                <span className="tl-cluster-g">
                  {sides.slice(0, 2).map((s) => (
                    <MGlyph key={s} side={s as MSide} size={8} />
                  ))}
                </span>
                <span className="tl-cluster-n">{c.ids.length}</span>
              </button>
            );
          })}

          {/* the cluster's menu */}
          {openCluster && (
            <div
              ref={menuRef}
              className={`tl-menu ${geo.rows[openCluster.row].y > geo.lanesBottom - 150 ? "up" : ""}`}
              style={{ left: Math.min(plotW - 150, Math.max(150, openCluster.x)), top: geo.rows[openCluster.row].y + openCluster.tier * TIER }}
              role="dialog"
              aria-label={`${openCluster.ids.length} moments close together`}
              onKeyDown={(e) => {
                const items = [...(menuRef.current?.querySelectorAll<HTMLElement>("button") ?? [])];
                const i = items.indexOf(document.activeElement as HTMLElement);
                if (e.key === "Escape") {
                  e.preventDefault();
                  closeMenu(selected && openCluster.ids.includes(selected) ? selected : openCluster.ids[0]);
                } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
                }
              }}
              onBlur={(e) => {
                const to = e.relatedTarget as Node | null;
                if (!e.currentTarget.contains(to) && !(to instanceof Element && to.closest("[data-cluster]"))) setMenu(null);
              }}
            >
              <p className="tl-menu-k mono">{openCluster.ids.length} moments close together</p>
              <ul>
                {openCluster.ids.map((id) => {
                  const m = byId.get(id)!;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className={`tl-menu-i s-${spCls(m)}`}
                        aria-current={selected === id ? "true" : undefined}
                        onClick={() => {
                          select(id);
                          closeMenu(id);
                        }}
                      >
                        <MGlyph side={isSpinoza(m) ? "spinoza" : m.side} size={10} filled={selected === id} />
                        <span className="tl-menu-y mono">{m.when}</span>
                        <span className="tl-menu-t">{m.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* hover / focus tooltip */}
          {!openCluster && ((tip && tipM) || hotCluster) && (
            <div
              className={`tl-tip ${(hotCluster ? geo.rows[hotCluster.row].y : tip!.top) < 110 ? "below" : ""}`}
              style={{
                left: Math.min(plotW - 130, Math.max(130, hotCluster ? hotCluster.x : tip!.x)),
                top: hotCluster ? geo.rows[hotCluster.row].y + hotCluster.tier * TIER : tip!.top,
              }}
              role="presentation"
            >
              {hotCluster ? (
                <>
                  <span className="tl-tip-k mono">
                    {byId.get(hotCluster.ids[0])!.when} to {byId.get(hotCluster.ids[hotCluster.ids.length - 1])!.when}
                  </span>
                  <span className="tl-tip-t serif">{hotCluster.ids.length} moments close together. Click to list them.</span>
                </>
              ) : (
                <>
                  <span className={`tl-tip-k mono s-${spCls(tipM!)}`}>
                    {tipM!.when} · {MSIDE_WORD[tipM!.side] ?? "Background"}
                  </span>
                  <span className="tl-tip-t serif">{tipM!.title}</span>
                  <span className="tl-tip-s mono">{strandText(tipM!)}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="tl-chart-note">
        <GlyphKey context />
        <span className="tl-note-i mono">
          <span className="tl-note-knot" aria-hidden />
          One moment, several objections
        </span>
        {geo.clusters.length > 0 && (
          <span className="tl-note-i mono">
            <span className="tl-note-cluster" aria-hidden>
              3
            </span>
            Moments close together
          </span>
        )}
        <span className="tl-note-i tl-note-kbd mono">Arrow keys move between moments</span>
      </div>
    </div>
  );
}

/* ======================================================================
   The chosen moment (desktop card under the chart)
   ====================================================================== */
function MomentCard({
  m,
  shown,
  select,
  lanes,
  objLanes,
  announce,
}: {
  m?: Moment;
  shown: Moment[];
  select: (id: string | undefined) => void;
  lanes: Lane[];
  objLanes: (m: Moment) => LaneKey[];
  announce: (s: string) => void;
}) {
  const { ix } = useAtlas();
  if (!m) {
    return (
      <div className="tl-card tl-card-empty">
        <p className="tl-card-hint">
          <span className="mono">Choose a mark</span> on the chart to read about that moment here.
        </p>
        {shown.length > 0 && (
          <button type="button" className="btn small" onClick={() => select(shown[0].id)}>
            Start at the oldest →
          </button>
        )}
      </div>
    );
  }
  const i = shown.findIndex((x) => x.id === m.id);
  // If the chosen moment is filtered out, step to its nearest neighbours on the followed strand.
  const prev = i >= 0 ? shown[i - 1] : [...shown].reverse().find((x) => x.year < m.year);
  const next = i >= 0 ? shown[i + 1] : shown.find((x) => x.year > m.year);
  const ks = objLanes(m);
  const node = m.node ? ix.nodes.get(m.node) : undefined;
  const side = isSpinoza(m) ? "spinoza" : sideCls(m.side);
  const goTo = (x: Moment) => {
    select(x.id);
    announce(`${x.when}: ${x.title}`);
  };
  return (
    <article key={m.id} className={`tl-card s-${side}`} aria-label={`${m.when}: ${m.title}`}>
      <div className="tl-card-when">
        <span className="tl-card-year serif">{m.when}</span>
        <span className="tl-card-era mono">{eraOf(m.year).name}</span>
      </div>
      <div className="tl-card-main">
        <p className="tl-card-k mono">
          <MGlyph side={side === "neutral" ? "neutral" : side} size={10} filled />
          <span className="tl-side">{MSIDE_WORD[m.side] ?? "Background"}</span>
          {ks.length > 0 && (
            <span className="tl-card-strands">
              {ks.map((k) => {
                const l = lanes.find((x) => x.key === k)!;
                return (
                  <span key={k} className="tl-strand-tag">
                    <span className="serif">{l.numeral}</span> {l.name}
                  </span>
                );
              })}
            </span>
          )}
        </p>
        <h2 className="tl-card-t serif">{m.title}</h2>
        {m.text && <p className="tl-card-x">{m.text}</p>}
        <LibQuote q={quoteOf(m, ix)} className="tl-quote" />
        <div className="tl-card-acts">
          {m.thinker && ix.thinkers.has(m.thinker) && <ThinkerChip id={m.thinker} />}
          {node && (
            <a className="btn small tl-go" href={formatRoute({ view: "objection", o: node.objection, node: node.node.id })}>
              Go to the move <span className="mono tl-go-addr">{address(ix, node.node.id)}</span> →
            </a>
          )}
        </div>
      </div>
      <nav className="tl-card-nav" aria-label="Earlier and later moments">
        <button type="button" className="tl-step" disabled={!prev} onClick={() => prev && goTo(prev)} aria-label={prev ? `Earlier: ${prev.title}` : "No earlier moment"}>
          ‹
        </button>
        <span className="tl-card-pos mono">{i >= 0 ? `${i + 1} of ${shown.length}` : "Filtered out"}</span>
        <button type="button" className="tl-step" disabled={!next} onClick={() => next && goTo(next)} aria-label={next ? `Later: ${next.title}` : "No later moment"}>
          ›
        </button>
      </nav>
    </article>
  );
}

/* ======================================================================
   The chronicle: the readable list (all widths; the only layout on phones)
   ====================================================================== */
type Seg = { k: LaneKey; part: "start" | "end" | "full" };

function Chronicle({
  listRef,
  lanes,
  items,
  lanesOf,
  selected,
  select,
  wide,
  onShow,
}: {
  listRef: RefObject<HTMLOListElement | null>;
  lanes: Lane[];
  items: Moment[];
  lanesOf: (m: Moment) => LaneKey[];
  selected?: string;
  select: (id: string | undefined) => void;
  wide: boolean;
  onShow: (id: string) => void;
}) {
  const { ix } = useAtlas();
  // Each moment opens in place (title first, the rest on a tap). The chosen moment is always open.
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = useCallback(
    (id: string, isOpen: boolean, isSelected: boolean) => {
      setOpen((o) => {
        const n = new Set(o);
        if (isOpen) n.delete(id);
        else n.add(id);
        return n;
      });
      if (!isOpen) select(id);
      else if (isSelected) select(undefined);
    },
    [select],
  );

  // A moment chosen on the chart: if its row is already in sight, keep it in sight.
  useEffect(() => {
    if (!selected) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-mid="${CSS.escape(selected)}"]`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const inSight = r.bottom > 80 && r.top < window.innerHeight;
    if (inSight && (r.top < 80 || r.bottom > window.innerHeight)) el.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
  }, [selected, listRef]);

  const idx = useMemo(() => new Map(lanes.map((l, i) => [l.key, i])), [lanes]);
  // Where each thread begins and ends in this list (so a strand appears when its first moment does).
  const span = useMemo(() => {
    const s = new Map<LaneKey, { a: number; b: number }>();
    items.forEach((m, i) => {
      for (const k of lanesOf(m)) {
        const x = s.get(k);
        if (x) x.b = i;
        else s.set(k, { a: i, b: i });
      }
    });
    return s;
  }, [items, lanesOf]);
  const passing = (beforeIndex: number) =>
    lanes.filter((l) => {
      const s = span.get(l.key);
      return !!s && s.a < beforeIndex && s.b >= beforeIndex;
    });
  const col = (i: number) => `calc(var(--tl-col) * ${i + 0.5})`;
  const railW = `calc(var(--tl-col) * ${lanes.length})`;

  // group by era, keeping the global index for thread spans
  const groups: { era: (typeof ERAS)[number]; rows: { m: Moment; i: number }[] }[] = [];
  items.forEach((m, i) => {
    const e = eraOf(m.year);
    const g = groups[groups.length - 1];
    if (g && g.era.id === e.id) g.rows.push({ m, i });
    else groups.push({ era: e, rows: [{ m, i }] });
  });

  return (
    <ol className="tl-list" ref={listRef} style={{ ["--tl-rail" as string]: railW }}>
      {groups.map((g) => (
        <li key={g.era.id} className="tl-era-block">
          <div className="tl-era-h">
            <div className="tl-rail" aria-hidden>
              {passing(g.rows[0].i).map((l) => (
                <span key={l.key} className={`tl-th full ${l.key === "spinoza" ? "sp" : ""}`} style={{ left: col(idx.get(l.key)!) }} />
              ))}
              {lanes.map((l, i) => (
                <span key={l.key} className={`tl-key ${i % 2 ? "up" : ""} ${l.key === "spinoza" ? "s-spinoza sp" : ""}`} style={{ left: col(i) }}>
                  {l.numeral}
                </span>
              ))}
            </div>
            <h3 className="tl-era-name2">
              <span className="serif">{g.era.name}</span>
              <span className="mono">{g.era.span}</span>
            </h3>
          </div>
          <ol className="tl-items">
            {g.rows.map(({ m, i }) => {
              const ks = lanesOf(m);
              const segs: Seg[] = lanes.flatMap((l) => {
                const s = span.get(l.key);
                if (!s || s.a === s.b || i < s.a || i > s.b) return [];
                return [{ k: l.key, part: i === s.a ? "start" : i === s.b ? "end" : "full" } as Seg];
              });
              const node = m.node ? ix.nodes.get(m.node) : undefined;
              return (
                <ChronicleRow
                  key={m.id}
                  m={m}
                  lanes={lanes}
                  laneNs={ks.map((k) => idx.get(k)!).join(",")}
                  segKey={segs.map((s) => `${s.k}:${s.part}`).join(",")}
                  idx={idx}
                  on={selected === m.id}
                  isOpen={open.has(m.id) || selected === m.id}
                  toggle={toggle}
                  wide={wide}
                  onShow={onShow}
                  thinker={m.thinker && ix.thinkers.has(m.thinker) ? m.thinker : undefined}
                  goHref={node ? formatRoute({ view: "objection", o: node.objection, node: node.node.id }) : undefined}
                  goAddr={node ? address(ix, node.node.id) : undefined}
                  quote={quoteOf(m, ix)}
                />
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
}

/** One chronicle row. Memoised on primitive props so stepping through the chart re-renders only the rows that change. */
const ChronicleRow = memo(function ChronicleRow({
  m,
  lanes,
  laneNs,
  segKey,
  idx,
  on,
  isOpen,
  toggle,
  wide,
  onShow,
  thinker,
  goHref,
  goAddr,
  quote,
}: {
  m: Moment;
  lanes: Lane[];
  laneNs: string;
  segKey: string;
  idx: Map<LaneKey, number>;
  on: boolean;
  isOpen: boolean;
  toggle: (id: string, isOpen: boolean, isSelected: boolean) => void;
  wide: boolean;
  onShow: (id: string) => void;
  thinker?: string;
  goHref?: string;
  goAddr?: string;
  quote?: Quote;
}) {
  const ns = laneNs ? laneNs.split(",").map(Number) : [];
  const segs = segKey ? segKey.split(",").map((s) => s.split(":") as [LaneKey, Seg["part"]]) : [];
  const sp = isSpinoza(m);
  const side = sp ? "spinoza" : sideCls(m.side);
  const objNs = ns.filter((n) => lanes[n]?.key !== "spinoza");
  const strands = objNs.map((n) => lanes[n]);
  const col = (i: number) => `calc(var(--tl-col) * ${i + 0.5})`;
  return (
    <li data-mid={m.id} className={`tl-item s-${side} ${on ? "on" : ""} ${isOpen ? "open" : ""}`}>
      <div className="tl-rail" aria-hidden>
        {segs.map(([k, part]) => (
          <span key={k} className={`tl-th ${part} ${k === "spinoza" ? "sp" : ""}`} style={{ left: col(idx.get(k)!) }} />
        ))}
        {objNs.length > 1 && <span className="tl-knot2" style={{ left: col(Math.min(...objNs)), width: `calc(var(--tl-col) * ${Math.max(...objNs) - Math.min(...objNs)})` }} />}
        {objNs.length > 1 &&
          lanes.map((l, n) => (n > Math.min(...objNs) && n < Math.max(...objNs) && !objNs.includes(n) ? <span key={`hop-${n}`} className="tl-hop" style={{ left: col(n) }} /> : null))}
        {ns.length === 0 ? (
          <span className="tl-mark ctx" style={{ left: `calc(var(--tl-rail) / 2)` }}>
            <MGlyph side="neutral" size={9} />
          </span>
        ) : (
          ns.map((n) => (
            <span key={n} className={`tl-mark ${lanes[n]?.key === "spinoza" && objNs.length ? "tick" : ""}`} style={{ left: col(n) }}>
              {lanes[n]?.key === "spinoza" && objNs.length ? null : <MGlyph side={sp ? "spinoza" : m.side} size={11} filled={on} />}
            </span>
          ))
        )}
      </div>
      <div className="tl-body">
        <button type="button" className="tl-head" aria-expanded={isOpen} onClick={() => toggle(m.id, isOpen, on)}>
          <span className="tl-when">
            <span className="tl-year mono">{m.when}</span>
            <span className={`tl-side mono s-${side}`}>{MSIDE_WORD[m.side] ?? "Background"}</span>
          </span>
          <span className="tl-title serif">{m.title}</span>
          <span className="tl-chev" aria-hidden />
        </button>
        {isOpen && m.text && <p className="tl-text">{m.text}</p>}
        {isOpen && <LibQuote q={quote} className="tl-quote tl-quote-row" />}
        {isOpen && (
          <div className="tl-foot">
            {strands.length > 0 && (
              <span className="tl-strands mono">
                <span className="sr-only">{strands.length === 1 ? "Objection: " : "Objections: "}</span>
                {strands.map((l) => (
                  <span key={l.key} className="tl-strand-tag">
                    <span className="serif">{l.numeral}</span> {l.name}
                  </span>
                ))}
              </span>
            )}
            {thinker && <ThinkerChip id={thinker} />}
            {goHref && (
              <a className="tl-golink" href={goHref}>
                Go to the move <span className="mono">{goAddr}</span> →
              </a>
            )}
            {wide && (
              <button type="button" className="tl-golink tl-showchart" onClick={() => onShow(m.id)}>
                <span aria-hidden>↑</span> Show on the chart
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
});
