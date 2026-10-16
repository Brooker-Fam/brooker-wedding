"use client";

/* The Rose (called "the map" on screen): all five objections on one chart,
   drawn as a sunburst of panes.
   Center = the question. Five sectors = the five objections. Each ring outward
   is one more round; a pane sits just outside the claim it answers, and its
   width follows how much argument grows beneath it, so depth and bushiness
   read at a glance, with no edges to untangle.
   Pane color carries side (ochre objector, verdigris theist, lilac + hatch
   Spinoza); glyph shape repeats it (▲ ● ◆) so color is never the only cue.
   The reader's verdicts change the light: open = tinted glass, stands = lit,
   answered = clear glass stippled (the voice stays, it is only answered).

   The dial (`dial`, the overview's map; touch and pen only): panes are far too
   small for a thumb, so the first tap on a slice turns that objection to the
   top and zooms in on it, and the next taps pick blocks. A pick turns the
   chosen block to the top and the caption card under the map says what it is,
   with "Open this move". Taps are hit-tested by polar coordinates, so a tap
   always lands on one pane (the panes tile their slice; no gaps between
   targets). Reduced motion: no turning; the zoom pans instantly instead.
   The mouse keeps the desktop behaviour (hover reads, click opens).

   Performance: panes are memoised and never re-render on hover. The hover
   highlight is pure CSS; the hovered id lives in a tiny external store that
   only the readout and the cross-links subscribe to; sector dimming is a class
   on five sector groups. The build-in is a CSS animation, so the server HTML
   already paints (and animates) before hydration. The dial's turn and zoom are
   one CSS transform on one group. */

import {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useAtlas } from "../context";
import { tick } from "../haptics";
import { nearestPane, polarOf, readingOrder, sectorAt, sectorBase, sectorLayout, type RoseSector } from "../layout";
import { Glyph, StatusBadge } from "../primitives";
import type { ArgNode, Label, ObjectionId, Side } from "../types";
import { StatusPip } from "./marks";

const R_OUT = 300;
const HUB_R = 58;
const OBJ_RING = 16; // thickness of the objection ring around the hub
const PAD = 38; // room outside the panes for the dashed rim and the sector legend
const LABEL_R = R_OUT + 16; // inner edge of the legend band (the dashed rim sits at R_OUT + 10)
const VB = (R_OUT + PAD) * 2;
/** Below this rendered scale (px per viewBox unit) full legends no longer fit: numerals only.
    Mirrored by the container query in atlas.css (0.62 × 676 ≈ 419px) for the first paint. */
const NARROW_SCALE = 0.62;
/** Legend type sizes (viewBox units) before the Rose is measured, tuned for the usual cases
    (full legends at desktop scale ≈ .87, numerals at phone scale ≈ .55). */
const FS_DEFAULT = { legend: 12, num: 22, hub: 12 };

/* The dial's zoom window: along the top ray it shows the zoomed objection's band of rounds
   (just inside the first ring to just past its last), centred. The zoom aims for rings ~50px
   deep on screen, and never so far that the band would overflow the window. */
const RING0 = HUB_R + OBJ_RING + 6;
const ZOOM_IN = RING0 - 8;
const ZOOM_OUT = R_OUT + 8;
const ZOOM_RING_PX = 50;
const ZOOM_MIN = 1.5;

const SIDE_WORD: Record<Side, string> = { skeptic: "Objector", theist: "Defender", spinoza: "Spinoza" };
const OBJ_STATUS: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const r2 = (v: number) => Math.round(v * 100) / 100;
const pt = (a: number, r: number) => `${r2(Math.sin(a) * r)},${r2(-Math.cos(a) * r)}`;
const deg = (rad: number) => (rad * 180) / Math.PI;
/** The equivalent of `x` degrees in (-180, 180]: the short way round. */
const wrap180 = (x: number) => -((((180 - x) % 360) + 360) % 360) + 180;

function pane(r0: number, r1: number, a0: number, a1: number): string {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${pt(a0, r1)}A${r1},${r1} 0 ${large} 1 ${pt(a1, r1)}L${pt(a1, r0)}A${r0},${r0} 0 ${large} 0 ${pt(a0, r0)}Z`;
}

export function glyphPath(side: Side, x: number, y: number, s: number): string {
  const f = (v: number) => r2(v);
  if (side === "skeptic") {
    const h = s * 1.15;
    return `M${f(x)},${f(y - h)}L${f(x + h * 0.95)},${f(y + h * 0.62)}L${f(x - h * 0.95)},${f(y + h * 0.62)}Z`;
  }
  if (side === "spinoza") {
    const h = s * 1.25;
    return `M${f(x)},${f(y - h)}L${f(x + h * 0.8)},${f(y)}L${f(x)},${f(y + h)}L${f(x - h * 0.8)},${f(y)}Z`;
  }
  return `M${f(x - s)},${f(y)}a${f(s)},${f(s)} 0 1,0 ${f(s * 2)},0a${f(s)},${f(s)} 0 1,0 ${f(-s * 2)},0`;
}

/* The sector layout lives in ../layout (no "use client"), so the /debates index can compute
   it on the server; re-exported here for existing imports. */
export { sectorLayout, type RoseSector };

/** matchMedia as an external store; `server` is the answer before hydration. */
function useMediaQuery(query: string, server = false): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => server,
  );
}

interface PaneGeom {
  id: string;
  o: ObjectionId;
  side: Side;
  depth: number;
  a0: number;
  a1: number;
  r0: number;
  r1: number;
  mid: { x: number; y: number; a: number; r: number };
  arc: number; // arc length at mid radius
  d: string;
}

/* ------------------------------------------------------------------ */
/* Hover store: the hovered pane id, outside React state               */
/* ------------------------------------------------------------------ */

interface HoverStore {
  get: () => string | null;
  getServer: () => string | null;
  set: (id: string | null) => void;
  subscribe: (cb: () => void) => () => void;
}

function createHoverStore(): HoverStore {
  let v: string | null = null;
  const subs = new Set<() => void>();
  return {
    get: () => v,
    getServer: () => null,
    set: (id) => {
      if (id === v) return;
      v = id;
      subs.forEach((f) => f());
    },
    subscribe: (cb) => {
      subs.add(cb);
      return () => {
        subs.delete(cb);
      };
    },
  };
}

/* ------------------------------------------------------------------ */
/* One pane (memoised: primitive props only)                            */
/* ------------------------------------------------------------------ */

interface PaneProps {
  id: string;
  o: ObjectionId;
  side: Side;
  label: Label;
  depth: number;
  d: string;
  glyph: string;
  dotX: number;
  dotY: number;
  mine: boolean;
  foot: boolean;
  dim: boolean;
  sel: boolean;
  tagged: boolean;
  uid: string;
}

const PaneView = memo(function PaneView({ id, o, side, label, depth, d, glyph, dotX, dotY, mine, foot, dim, sel, tagged, uid }: PaneProps) {
  return (
    <g
      data-node-id={tagged ? id : undefined}
      data-o={tagged ? o : undefined}
      className={`rose-pane s-${side} st-${label}${mine ? " mine" : ""}${foot ? " foot" : ""}${dim ? " dim" : ""}${sel ? " sel" : ""}`}
      style={{ "--d": depth } as CSSProperties}
    >
      <path d={d} className="rose-glass" />
      {side === "spinoza" && label !== "in" && <path d={d} fill={`url(#${uid}-hatch)`} />}
      {label === "out" && <path d={d} fill={`url(#${uid}-stipple)`} />}
      {label === "in" && <path d={d} fill={`url(#${uid}-lit)`} />}
      {glyph && <path d={glyph} className="rose-glyph" />}
      {mine && <circle cx={dotX} cy={dotY} r={1.5} className="rose-mine" />}
    </g>
  );
});

/* ------------------------------------------------------------------ */
/* The dial's state                                                     */
/* ------------------------------------------------------------------ */

interface DialState {
  /** The objection the dial is zoomed in on (null = the whole map). */
  o: ObjectionId | null;
  /** The picked block, if any. */
  sel: string | null;
  /** Cumulative turn in degrees (so the map always turns the short way). */
  turn: number;
}
const DIAL0: DialState = { o: null, sel: null, turn: 0 };

/* ------------------------------------------------------------------ */
/* Readout and cross-links: the only parts that follow the hover        */
/* ------------------------------------------------------------------ */

interface DialProps {
  state: DialState;
  onNode?: (id: string) => void;
  onStep: (dir: -1 | 1) => void;
  canPrev: boolean;
  canNext: boolean;
}

function Readout({ hover, focus, onEnter, dial }: { hover: HoverStore; focus: ObjectionId | null; onEnter: (o: ObjectionId) => void; dial?: DialProps }) {
  const { ix, labels, judgments, toPlain } = useAtlas();
  const hid = useSyncExternalStore(hover.subscribe, hover.get, hover.getServer);
  const hovered = hid ? ix.nodes.get(hid) : undefined;
  const fo = focus ? ix.objections.get(focus) : undefined;
  // The dial says what a tap picked, once, in a live region that outlives the card.
  let said = "";
  if (dial?.state.o) {
    const info = dial.state.sel ? ix.nodes.get(dial.state.sel) : undefined;
    const o = ix.objections.get(info?.objection ?? dial.state.o);
    if (info && o) said = `Objection ${o.numeral}, round ${info.depth}, ${SIDE_WORD[info.node.side]}: ${toPlain(info.node.label)}. ${OBJ_STATUS[labels.node.get(info.node.id) ?? "undec"]}.`;
    else if (o) said = `Objection ${o.numeral}: ${toPlain(o.title || o.short)}. ${OBJ_STATUS[labels.objection.get(o.id) ?? "undec"]}. Zoomed in.`;
  }
  const live = dial ? (
    <span className="sr-only" aria-live="polite">
      {said}
    </span>
  ) : null;
  if (dial && dial.state.o && !hovered) {
    return (
      <figcaption className="rose-readout rose-dialcap">
        {live}
        <DialCard {...dial} onEnter={onEnter} />
      </figcaption>
    );
  }
  return (
    <figcaption className={`rose-readout${dial ? " rose-dialcap idle" : ""}`}>
      {live}
      <div className="rose-readout-in">
        {hovered ? (
          <>
            <span className={`rose-readout-k mono s-${hovered.node.side}`}>
              {ix.objections.get(hovered.objection)?.numeral} · Round {hovered.depth} · {SIDE_WORD[hovered.node.side]}
              {judgments[hovered.node.id] ? ` · you said it ${judgments[hovered.node.id]}` : ""}
            </span>
            <span className="rose-readout-t serif">{toPlain(hovered.node.label)}</span>
          </>
        ) : fo ? (
          <>
            <span className="rose-readout-k mono s-skeptic">{fo.short?.trim() ? `${fo.numeral} · ${fo.short}` : `Objection ${fo.numeral}`}</span>
            <span className="rose-readout-t serif">{toPlain(fo.title || fo.short || `Objection ${fo.numeral}`)}</span>
            <button type="button" className="btn small" onClick={() => onEnter(fo.id)}>
              Open Objection {fo.numeral} <span aria-hidden>→</span>
            </button>
          </>
        ) : (
          <span className="rose-readout-hint">
            <span className="rose-hint-fine">Point at a move or focus a slice to read it</span>
            <span className="rose-hint-coarse">{dial ? "Tap a slice to zoom in" : "Tap a slice to preview it, tap again to open"}</span>
          </span>
        )}
      </div>
    </figcaption>
  );
}

/** The dial's caption card: the zoomed objection, or the picked block. */
function DialCard({ state, onNode, onEnter, onStep, canPrev, canNext }: DialProps & { onEnter: (o: ObjectionId) => void }) {
  const { ix, labels, judgments, toPlain } = useAtlas();
  const info = state.sel ? ix.nodes.get(state.sel) : undefined;
  const o = ix.objections.get(info?.objection ?? state.o!);
  if (!o) return null;
  const steppers = (
    <span className="rose-steps">
      <button type="button" className="rose-step" aria-label="Previous move" disabled={!canPrev} onClick={() => onStep(-1)}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
          <path d="M10 3.5 5.5 8l4.5 4.5" />
        </svg>
      </button>
      <button type="button" className="rose-step" aria-label={info ? "Next move" : "First move"} disabled={!canNext} onClick={() => onStep(1)}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
          <path d="M6 3.5 10.5 8 6 12.5" />
        </svg>
      </button>
    </span>
  );

  if (info) {
    const n = info.node;
    const l = labels.node.get(n.id) ?? "undec";
    const call = judgments[n.id];
    return (
      <div className={`rose-card s-${n.side}`} key={n.id}>
        <p className="rose-card-k">
          <span className="rose-card-side">
            <Glyph side={n.side} label={l} size={11} />
            <span>
              {o.numeral} · Round {info.depth} · {SIDE_WORD[n.side]}
            </span>
          </span>
          <StatusBadge label={l} />
        </p>
        <p className={`rose-card-t${l === "out" ? " lab-out" : ""}`}>{toPlain(n.label)}</p>
        {n.gist?.trim() && <p className="rose-card-g">{toPlain(n.gist)}</p>}
        {call && <p className="rose-card-call">You said it {call}</p>}
        <div className="rose-card-btns">
          {onNode && (
            <button type="button" className="btn solid rose-card-go" onClick={() => onNode(n.id)}>
              Open this move <span aria-hidden>→</span>
            </button>
          )}
          {steppers}
        </div>
      </div>
    );
  }

  const ol = labels.objection.get(o.id) ?? "undec";
  return (
    <div className="rose-card is-obj" key={o.id}>
      <p className="rose-card-k">
        <span className="rose-card-side">{o.short?.trim() ? `Objection ${o.numeral} · ${o.short.trim()}` : `Objection ${o.numeral}`}</span>
        <span className={`rose-card-ost st-${ol}`}>
          <StatusPip label={ol} size={10} />
          {OBJ_STATUS[ol]}
        </span>
      </p>
      <p className="rose-card-t">{toPlain(o.title || o.short || `Objection ${o.numeral}`)}</p>
      {o.question?.trim() && <p className="rose-card-g rose-card-q">{toPlain(o.question)}</p>}
      <p className="rose-card-hint">Tap a block to read it</p>
      <div className="rose-card-btns">
        <button type="button" className="btn solid rose-card-go" onClick={() => onEnter(o.id)}>
          Read it <span aria-hidden>→</span>
          <span className="sr-only"> (Objection {o.numeral})</span>
        </button>
        {steppers}
      </div>
    </div>
  );
}

interface LinkGeom {
  key: string;
  from: string;
  to: string;
  d: string;
}

function Links({ links, hover }: { links: LinkGeom[]; hover: HoverStore }) {
  const hid = useSyncExternalStore(hover.subscribe, hover.get, hover.getServer);
  return (
    <g className="rose-links" pointerEvents="none">
      {links.map((l) => (
        <path key={l.key} d={l.d} className={`rose-link${hid && (hid === l.from || hid === l.to) ? " lit" : ""}`} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* The emblem: five wedges and a hub (top bar, menus)                   */
/* ------------------------------------------------------------------ */

/** A crisp 6-path emblem of the Rose for small sizes: one wedge per objection, filled by the
    objection's status on the reader's calls (ochre = stands, verdigris = answered, hollow =
    undecided); the current objection's wedge is longer and outlined in bone.
    `statuses` is a comma-joined list of labels in objection order (a primitive, for memo). */
export const RoseEmblem = memo(function RoseEmblem({
  sectors,
  statuses,
  current,
  size = 28,
  className = "",
}: {
  sectors: RoseSector[];
  statuses: string;
  current?: ObjectionId;
  size?: number;
  className?: string;
}) {
  const st = statuses.split(",");
  return (
    <svg className={`rose-emblem ${className}`} width={size} height={size} viewBox="-15 -15 30 30" aria-hidden focusable="false">
      {sectors.map((s, i) => {
        const cur = current === s.o;
        const inset = Math.min(0.09, (s.a1 - s.a0) * 0.2);
        return (
          <path
            key={s.o}
            d={pane(5.2, cur ? 14.4 : 12.4, s.a0 + inset, s.a1 - inset)}
            className={`em-w st-${st[i] || "undec"}${cur ? " cur" : ""}${current && !cur ? " dim" : ""}`}
          />
        );
      })}
      <circle r={3} className="em-hub" />
    </svg>
  );
});

/* ------------------------------------------------------------------ */
/* The Rose                                                             */
/* ------------------------------------------------------------------ */

export interface RoseProps {
  onEnter: (o: ObjectionId) => void;
  onNode?: (id: string) => void;
  /** Node ids to ring as "footprints" (a thinker's or term's appearances). */
  footprint?: Set<string>;
  /** Highlight one objection's sector (e.g. the chamber you are in). */
  current?: ObjectionId;
  verdicts?: boolean;
  /** Run the one-time build-in (panes appear ring by ring). */
  build?: boolean;
  /** Mini mode: no labels, caption or interaction. A "you are here" emblem. */
  mini?: boolean;
  className?: string;
  caption?: boolean;
  /** Touch dial: taps turn a slice to the top and zoom in, then pick blocks (see the header). */
  dial?: boolean;
}

export default function Rose({
  onEnter,
  onNode,
  footprint,
  current,
  verdicts = true,
  build = true,
  mini = false,
  caption = true,
  dial = false,
  className = "",
}: RoseProps) {
  const { d, ix, labels, judgments, toPlain } = useAtlas();
  const [focus, setFocus] = useState<ObjectionId | null>(null);
  const [hover] = useState(createHoverStore);
  // Rendered px per viewBox unit (bucketed to 0.02), null until measured.
  const [scale, setScale] = useState<number | null>(null);
  const [dialState, setDial] = useState<DialState>(DIAL0);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const svgRef = useRef<SVGSVGElement>(null);
  const turnRef = useRef<SVGGElement>(null);
  const figRef = useRef<HTMLElement>(null);
  // Unique ids so several Roses (overview, ledger, emblems…) never share pattern ids.
  const uid = "rose" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const dialOn = dial && !mini;
  const zoomed = dialOn && dialState.o !== null;

  useEffect(() => {
    if (mini) return;
    const el = svgRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w <= 0) return;
      const n = Math.round((w / VB) * 50) / 50;
      setScale((s) => (s !== null && Math.abs(s - n) < 0.02 ? s : n));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mini]);

  // A preview (keyboard focus or a touch tap) clears when a press lands outside the Rose.
  useEffect(() => {
    if (focus === null) return;
    const onDown = (e: PointerEvent) => {
      if (figRef.current && !figRef.current.contains(e.target as Node)) setFocus(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [focus]);

  const geo = useMemo(() => {
    const maxDepth = Math.max(1, ix.maxDepth);
    const ring0 = RING0;
    const ringGap = (R_OUT - ring0) / maxDepth;
    const sectors = sectorLayout(d);
    const bySector: { o: ObjectionId; panes: PaneGeom[] }[] = [];
    d.objections.forEach((o, i) => {
      const s = sectors[i];
      const per = (s.a1 - s.a0) / s.leaves;
      const panes: PaneGeom[] = [];
      let slot = s.a0;
      const place = (n: ArgNode, depth: number) => {
        const a0 = slot;
        const kids = n.children ?? [];
        if (kids.length) kids.forEach((c) => place(c, depth + 1));
        else slot += per;
        const a1 = kids.length ? slot : a0 + per;
        const r0 = ring0 + (depth - 1) * ringGap;
        const r1 = r0 + ringGap;
        const am = (a0 + a1) / 2;
        const rm = (r0 + r1) / 2;
        const shrink = Math.min(0.006, (a1 - a0) * 0.12);
        panes.push({
          id: n.id,
          o: o.id,
          side: n.side,
          depth,
          a0,
          a1,
          r0,
          r1,
          mid: { x: r2(Math.sin(am) * rm), y: r2(-Math.cos(am) * rm), a: am, r: rm },
          arc: (a1 - a0) * rm,
          d: pane(r0 + 0.7, r1 - 0.7, a0 + shrink, a1 - shrink),
        });
      };
      o.prongs.forEach((p) => place(p, 1));
      bySector.push({ o: o.id, panes });
    });
    const byId = new Map(bySector.flatMap((s) => s.panes.map((p) => [p.id, p] as const)));
    const depthOf = new Map(bySector.map((s) => [s.o, Math.max(1, ...s.panes.map((p) => p.depth))] as const));
    return { sectors, bySector, byId, depthOf, ring0, ringGap, maxDepth, base: sectorBase(sectors) };
  }, [d, ix]);

  const order = useMemo(() => new Map(d.objections.map((o) => [o.id, readingOrder(o)] as const)), [d]);

  const links = useMemo<LinkGeom[]>(() => {
    if (mini) return [];
    const out: LinkGeom[] = [];
    for (const p of geo.byId.values()) {
      for (const s of ix.nodes.get(p.id)?.node.see ?? []) {
        const q = geo.byId.get(s.id);
        if (!q || q.o === p.o) continue;
        const a = { x: r2(Math.sin(p.mid.a) * p.r0), y: r2(-Math.cos(p.mid.a) * p.r0) };
        const b = { x: r2(Math.sin(q.mid.a) * q.r0), y: r2(-Math.cos(q.mid.a) * q.r0) };
        out.push({ key: `${p.id}>${q.id}`, from: p.id, to: q.id, d: `M${a.x},${a.y}Q${r2((a.x + b.x) * 0.08)},${r2((a.y + b.y) * 0.08)} ${b.x},${b.y}` });
      }
    }
    return out;
  }, [geo, ix, mini]);

  const active = current ?? (zoomed ? dialState.o : focus);

  /* ---------- the dial ---------- */
  const sectorMid = (o: ObjectionId) => {
    const s = geo.sectors.find((x) => x.o === o);
    return s ? (s.a0 + s.a1) / 2 : 0;
  };
  // The turn that brings angle `a` to 12 o'clock, the short way from where the dial is.
  const turnFor = (prev: number, a: number) => (reduce ? 0 : prev + wrap180(-deg(a) - prev));
  const zoomTo = (o: ObjectionId) => {
    tick();
    setDial((s) => ({ o, sel: null, turn: turnFor(s.turn, sectorMid(o)) }));
  };
  const pick = (id: string) => {
    const p = geo.byId.get(id);
    if (!p) return;
    tick();
    setDial((s) => ({ o: p.o, sel: id, turn: turnFor(s.turn, p.mid.a) }));
  };
  const zoomOut = () => setDial((s) => ({ o: null, sel: null, turn: reduce ? 0 : s.turn + wrap180(-s.turn) }));
  const list = dialState.o ? (order.get(dialState.o) ?? []) : [];
  const at = dialState.sel ? list.indexOf(dialState.sel) : -1;
  const step = (dir: -1 | 1) => {
    const next = list[at + dir];
    if (next) pick(next);
  };

  // A tap, in client px, on the dial: hit-tested in the turned and zoomed map's own units.
  const dialTap = (x: number, y: number) => {
    const g = turnRef.current;
    const m = g?.getScreenCTM();
    if (!g || !m) return;
    const p = new DOMPoint(x, y).matrixTransform(m.inverse());
    const { a, r } = polarOf(p.x, p.y, geo.base);
    if (!zoomed && r > R_OUT + PAD) return; // the empty corners around the map
    const s = sectorAt(geo.sectors, a);
    if (!s) return;
    if (!zoomed) return zoomTo(s.o);
    if (r < HUB_R - 2) return zoomOut();
    if (r < geo.ring0 - 3 || r > R_OUT + 8) return s.o === dialState.o && !dialState.sel ? undefined : zoomTo(s.o);
    const hit = nearestPane(geo.bySector.find((x) => x.o === s.o)?.panes ?? [], a, r);
    if (hit) pick(hit.id);
  };

  // Zooming in grows the caption card: keep the map and its card on screen, above the dock.
  useEffect(() => {
    if (!zoomed) return;
    const fig = figRef.current;
    if (!fig) return;
    const id = requestAnimationFrame(() => {
      const box = fig.getBoundingClientRect();
      const dock = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--atl-dock-h")) || 0;
      const bar = document.querySelector<HTMLElement>(".atl .sh-bar")?.getBoundingClientRect().bottom ?? 52;
      const over = box.bottom - (window.innerHeight - dock - 8);
      const room = box.top - bar - 8;
      const dy = Math.min(over, room);
      if (dy > 1) window.scrollBy({ top: dy, behavior: reduce ? "instant" : "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [zoomed, reduce]);

  // Mouse: hover previews a sector and a click enters. Touch/pen: the first tap previews
  // (the readout offers "Open"), a second tap on the same sector enters. Focus that comes
  // from a pointer press must not count as the first tap. (The dial handles touch itself.)
  const pressed = useRef<{ type: string; at: number } | null>(null);
  const tapSector = (o: ObjectionId, at: number) => {
    const p = pressed.current;
    pressed.current = null;
    const viaTouch = !!p && p.type !== "mouse" && at - p.at < 1500;
    if (!viaTouch || focus === o) onEnter(o);
    else setFocus(o);
  };
  const keySector = (o: ObjectionId) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEnter(o);
    }
  };
  const paneAt = (t: EventTarget | null) => (t instanceof Element ? t.closest<SVGGElement>("[data-node-id]") : null);

  const vb = mini ? `${-R_OUT - 4} ${-R_OUT - 4} ${(R_OUT + 4) * 2} ${(R_OUT + 4) * 2}` : `${-VB / 2} ${-VB / 2} ${VB} ${VB}`;
  const narrow = scale !== null && scale < NARROW_SCALE;
  // Type sizes in viewBox units, chosen so the rendered size stays readable (≥ 10.5px).
  const fs =
    scale === null
      ? FS_DEFAULT
      : { legend: clamp(10.5 / scale, 10.5, 17), num: clamp(12.5 / scale, 12, 24), hub: clamp(10.5 / scale, 10, 14.5) };
  const lab = (id: string): Label => (verdicts ? (labels.node.get(id) ?? "undec") : "undec");
  const objFor = (o: ObjectionId) => d.objections.find((x) => x.id === o)!;

  // The dial's one transform: turn the chosen angle to the top, then zoom on the top band.
  // Reduced motion: no turn; pan straight to the picked block (or the slice) instead.
  let turnStyle: CSSProperties | undefined;
  if (dialOn) {
    let t = `translate(0px, 0px) scale(1) rotate(${r2(dialState.turn)}deg)`;
    if (zoomed) {
      // The window fits the zoomed objection's own rounds (a shallow one gets no empty rim).
      const out = Math.min(ZOOM_OUT, geo.ring0 + (geo.depthOf.get(dialState.o!) ?? geo.maxDepth) * geo.ringGap + 8);
      // At least nine tenths of the window is rounds (no wide empty margins on a big screen),
      // with rings ~50px deep where the screen is small enough to need it.
      const fit = VB / (out - ZOOM_IN);
      const k = r2(clamp(Math.max(ZOOM_RING_PX / (geo.ringGap * (scale ?? 0.53)), fit * 0.9), ZOOM_MIN, fit));
      const c = (ZOOM_IN + out) / 2;
      if (!reduce) t = `translate(0px, ${r2(c * k)}px) scale(${k}) rotate(${r2(dialState.turn)}deg)`;
      else {
        const sp = dialState.sel ? geo.byId.get(dialState.sel) : undefined;
        const am = sp ? sp.mid.a : sectorMid(dialState.o!);
        const rm = sp ? sp.mid.r : c;
        t = `translate(${r2(-Math.sin(am) * rm * k)}px, ${r2(Math.cos(am) * rm * k)}px) scale(${k}) rotate(0deg)`;
      }
    }
    turnStyle = { transform: t, "--turn": `${r2(dialState.turn)}deg` } as CSSProperties;
  }

  const svg = (
    <svg
      ref={svgRef}
      viewBox={vb}
      role={mini ? "img" : "group"}
      aria-label={mini ? "Map of the five objections" : "One slice per objection. Each ring outward is one more round of replies."}
      onPointerDown={(e) => {
        pressed.current = { type: e.pointerType, at: e.timeStamp };
      }}
      onPointerOver={(e) => {
        if (mini || e.pointerType !== "mouse") return;
        const el = paneAt(e.target);
        hover.set(el?.dataset.nodeId ?? null);
        const o = el?.dataset.o as ObjectionId | undefined;
        if (o) setFocus(o);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") hover.set(null);
      }}
      onClick={(e) => {
        if (mini) return;
        const p = pressed.current;
        const touch = !!p && p.type !== "mouse" && e.timeStamp - p.at < 1500;
        if (dialOn && touch) {
          pressed.current = null;
          dialTap(e.clientX, e.clientY);
          return;
        }
        const el = paneAt(e.target);
        if (el) {
          // Panes only take pointer events with a fine pointer (see atlas.css).
          const id = el.dataset.nodeId!;
          if (onNode) onNode(id);
          else onEnter(el.dataset.o as ObjectionId);
          return;
        }
        const sec = e.target instanceof Element ? (e.target.getAttribute("data-sector") as ObjectionId | null) : null;
        if (sec) return tapSector(sec, e.timeStamp);
        // a tap on empty ground (outside every sector) clears a touch preview
        if (e.target === e.currentTarget) setFocus(null);
      }}
    >
      <defs>
        <pattern id={`${uid}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#a195bd" strokeOpacity="0.55" strokeWidth="1.1" />
        </pattern>
        <pattern id={`${uid}-stipple`} width="4.5" height="4.5" patternUnits="userSpaceOnUse">
          <circle cx="2.25" cy="2.25" r="0.62" fill="#a6a394" fillOpacity="0.55" />
        </pattern>
        <radialGradient id={`${uid}-lit`} cx="50%" cy="50%" r="75%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g ref={turnRef} className="rose-turn" style={turnStyle}>
        {/* faint contour rings */}
        {!mini &&
          Array.from({ length: geo.maxDepth + 1 }, (_, k) => <circle key={k} r={r2(geo.ring0 + k * geo.ringGap)} className="rose-ring" />)}
        {!mini && <circle r={R_OUT + 10} className="rose-ring outer" />}

        {/* sector hit areas (taps on touch screens; focus/hover everywhere). The dial hit-tests
            taps by position on the whole svg, so tapping a numeral ("II") counts as its slice. */}
        {!mini &&
          geo.sectors.map((s) => {
            const o = objFor(s.o);
            const ol = labels.objection.get(o.id) ?? "undec";
            return (
              <path
                key={`hit-${s.o}`}
                data-sector={s.o}
                d={pane(8, R_OUT + 10, s.a0 - 0.03, s.a1 + 0.03)}
                className={`rose-sector${focus === s.o ? " on" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`Objection ${o.numeral}: ${toPlain(o.title || o.short || "")}. ${ol === "in" ? "Stands." : ol === "out" ? "Answered." : "Still open."}`}
                onPointerDown={(e) => {
                  pressed.current = { type: e.pointerType, at: e.timeStamp };
                }}
                onKeyDown={keySector(s.o)}
                onFocus={(e) => {
                  // keyboard focus previews; pointer-initiated focus is left to the click
                  const p = pressed.current;
                  if (!p || e.timeStamp - p.at > 800) setFocus(s.o);
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setFocus(s.o);
                }}
              />
            );
          })}

        {/* objection ring around the hub */}
        {geo.sectors.map((s) => {
          const o = objFor(s.o);
          const ol = verdicts ? (labels.objection.get(o.id) ?? "undec") : "undec";
          const am = (s.a0 + s.a1) / 2;
          const rm = HUB_R + OBJ_RING / 2;
          return (
            <g key={`obj-${s.o}`} className={`rose-objring st-${ol}${active && active !== s.o ? " dim" : ""}${active === s.o ? " cur" : ""}`} pointerEvents="none">
              <path d={pane(HUB_R, HUB_R + OBJ_RING, s.a0, s.a1)} />
              {!mini && (
                <text
                  className="rose-objtext rose-up"
                  aria-hidden="true"
                  x={r2(Math.sin(am) * rm)}
                  y={r2(-Math.cos(am) * rm + fs.hub * 0.36)}
                  textAnchor="middle"
                  style={{ fontSize: fs.hub }}
                >
                  {o.numeral}
                </text>
              )}
            </g>
          );
        })}

        {/* panes, grouped by sector so a preview dims four groups instead of re-rendering every pane */}
        <g className={`rose-panes${mini ? "" : " live"}`}>
          {geo.bySector.map((sec) => (
            <g key={sec.o} className={`rose-sec${!mini && active && active !== sec.o ? " dim" : ""}${zoomed && dialState.o === sec.o ? " cur" : ""}`}>
              {sec.panes.map((p) => {
                const showGlyph = !mini && p.arc >= 13;
                const gs = Math.min(4.4, Math.max(2.4, p.arc / 6.5));
                const mine = !mini && verdicts && !!judgments[p.id];
                return (
                  <PaneView
                    key={p.id}
                    id={p.id}
                    o={p.o}
                    side={p.side}
                    label={lab(p.id)}
                    depth={p.depth}
                    d={p.d}
                    glyph={showGlyph ? glyphPath(p.side, p.mid.x, p.mid.y, gs) : ""}
                    dotX={r2(Math.sin(p.mid.a) * (p.r1 - 3.2))}
                    dotY={r2(-Math.cos(p.mid.a) * (p.r1 - 3.2))}
                    mine={mine}
                    foot={!!footprint?.has(p.id)}
                    dim={mini && !!active && active !== p.o}
                    sel={zoomed && dialState.sel === p.id}
                    tagged={!mini}
                    uid={uid}
                  />
                );
              })}
            </g>
          ))}
        </g>

        {/* cross-objection links */}
        {!mini && <Links links={links} hover={hover} />}

        {/* hub */}
        <circle r={HUB_R - 4} className="rose-hub" />
        {!mini && (
          <text className="rose-q rose-up" y={11} textAnchor="middle" aria-hidden="true">
            ?
          </text>
        )}

        {/* sector legend: both variants are drawn and CSS picks one (a container query before
            the Rose is measured, then the measured class), so the first paint never swaps text.
            Full: a ring legend that follows the rim (always inside the viewBox). Narrow: numerals. */}
        {!mini &&
          geo.sectors.map((s) => {
            const o = objFor(s.o);
            const am = (s.a0 + s.a1) / 2;
            const on = active === s.o ? " on" : "";
            const rn = LABEL_R + fs.num * 0.42;
            // Bottom half reads left-to-right along a counter-clockwise arc, glyph tops toward the hub.
            const flip = Math.cos(am) < 0;
            const r = flip ? LABEL_R + fs.legend * 0.74 : LABEL_R;
            const width = (t: string) => t.length * fs.legend * 0.74;
            const full = o.short?.trim() ? `${o.numeral} · ${o.short.trim()}` : o.numeral;
            const text = width(full) <= (s.a1 - s.a0 + 0.06) * r ? full : o.numeral;
            const span = Math.min(Math.PI * 1.9, Math.max(s.a1 - s.a0, width(text) / r) + 0.2);
            const b0 = am - span / 2;
            const b1 = am + span / 2;
            const large = span > Math.PI ? 1 : 0;
            const pid = `${uid}-lab-${s.o}`;
            const arc = flip ? `M${pt(b1, r)}A${r},${r} 0 ${large} 0 ${pt(b0, r)}` : `M${pt(b0, r)}A${r},${r} 0 ${large} 1 ${pt(b1, r)}`;
            return (
              <g key={`lab-${s.o}`} pointerEvents="none" aria-hidden="true">
                <path id={pid} d={arc} fill="none" stroke="none" />
                <text className={`rose-label full${on}`} textAnchor="middle" style={{ fontSize: fs.legend }}>
                  <textPath href={`#${pid}`} startOffset="50%">
                    {text}
                  </textPath>
                </text>
                <text
                  x={r2(Math.sin(am) * rn)}
                  y={r2(-Math.cos(am) * rn + fs.num * 0.34)}
                  textAnchor="middle"
                  className={`rose-label num rose-up${on}`}
                  style={{ fontSize: fs.num }}
                >
                  {o.numeral}
                </text>
              </g>
            );
          })}
      </g>
    </svg>
  );

  return (
    <figure
      ref={figRef}
      aria-label={mini ? undefined : "Map of the five objections"}
      className={`rose${mini ? " rose-mini" : ""}${build && !mini ? " build" : ""}${scale !== null ? " measured" : ""}${narrow ? " narrow" : ""}${
        !mini && active ? " previewing" : ""
      }${dialOn ? " dial" : ""}${zoomed ? " zoomed" : ""} ${className}`}
      onPointerLeave={(e) => {
        // On the figure (not the svg) so the pointer can travel down to the readout's Enter button.
        // Mouse only: touch pointers "leave" after every tap, which would undo a tap's preview.
        if (mini || e.pointerType !== "mouse") return;
        hover.set(null);
        setFocus(null);
      }}
      onBlur={(e) => {
        if (mini) return;
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(null);
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        if (zoomed) {
          e.preventDefault();
          zoomOut();
        } else if (focus !== null) {
          // Handled here: a toast showing at the same time stays (toast.tsx skips handled keys).
          e.preventDefault();
          setFocus(null);
          hover.set(null);
        }
      }}
    >
      {dialOn ? (
        <div className="rose-stage">
          {svg}
          {zoomed && (
            <button type="button" className="rose-back" onClick={zoomOut}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                <circle cx="7" cy="7" r="4.6" />
                <path d="M4.9 7h4.2M10.4 10.4l3 3" />
              </svg>
              Zoom out
            </button>
          )}
        </div>
      ) : (
        svg
      )}

      {!mini && caption && (
        <Readout
          hover={hover}
          focus={focus}
          onEnter={onEnter}
          dial={dialOn ? { state: dialState, onNode, onStep: step, canPrev: at > 0, canNext: at < list.length - 1 } : undefined}
        />
      )}
    </figure>
  );
}
