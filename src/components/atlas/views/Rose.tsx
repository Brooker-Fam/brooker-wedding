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

   Performance: panes are memoised and never re-render on hover. The hover
   highlight is pure CSS; the hovered id lives in a tiny external store that
   only the readout and the cross-links subscribe to; sector dimming is a class
   on five sector groups. The build-in is a CSS animation, so the server HTML
   already paints (and animates) before hydration. */

import { memo, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { useAtlas } from "../context";
import { sectorLayout, type RoseSector } from "../layout";
import type { ArgNode, Label, ObjectionId, Side } from "../types";

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

const SIDE_WORD: Record<Side, string> = { skeptic: "Objector", theist: "Defender", spinoza: "Spinoza" };
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const r2 = (v: number) => Math.round(v * 100) / 100;
const pt = (a: number, r: number) => `${r2(Math.sin(a) * r)},${r2(-Math.cos(a) * r)}`;

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
  tagged: boolean;
  uid: string;
}

const PaneView = memo(function PaneView({ id, o, side, label, depth, d, glyph, dotX, dotY, mine, foot, dim, tagged, uid }: PaneProps) {
  return (
    <g
      data-node-id={tagged ? id : undefined}
      data-o={tagged ? o : undefined}
      className={`rose-pane s-${side} st-${label}${mine ? " mine" : ""}${foot ? " foot" : ""}${dim ? " dim" : ""}`}
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
/* Readout and cross-links: the only parts that follow the hover        */
/* ------------------------------------------------------------------ */

function Readout({ hover, focus, onEnter }: { hover: HoverStore; focus: ObjectionId | null; onEnter: (o: ObjectionId) => void }) {
  const { ix, judgments, toPlain } = useAtlas();
  const hid = useSyncExternalStore(hover.subscribe, hover.get, hover.getServer);
  const hovered = hid ? ix.nodes.get(hid) : undefined;
  const fo = focus ? ix.objections.get(focus) : undefined;
  return (
    <figcaption className="rose-readout">
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
            <span className="rose-hint-coarse">Tap a slice to preview it, tap again to open</span>
          </span>
        )}
      </div>
    </figcaption>
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
}

export default function Rose({ onEnter, onNode, footprint, current, verdicts = true, build = true, mini = false, caption = true, className = "" }: RoseProps) {
  const { d, ix, labels, judgments, toPlain } = useAtlas();
  const [focus, setFocus] = useState<ObjectionId | null>(null);
  const [hover] = useState(createHoverStore);
  // Rendered px per viewBox unit (bucketed to 0.02), null until measured.
  const [scale, setScale] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const figRef = useRef<HTMLElement>(null);
  // Unique ids so several Roses (overview, ledger, emblems…) never share pattern ids.
  const uid = "rose" + useId().replace(/[^a-zA-Z0-9_-]/g, "");

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
    const ring0 = HUB_R + OBJ_RING + 6;
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
    return { sectors, bySector, ring0, ringGap, maxDepth };
  }, [d, ix]);

  const links = useMemo<LinkGeom[]>(() => {
    if (mini) return [];
    const byId = new Map(geo.bySector.flatMap((s) => s.panes.map((p) => [p.id, p] as const)));
    const out: LinkGeom[] = [];
    for (const p of byId.values()) {
      for (const s of ix.nodes.get(p.id)?.node.see ?? []) {
        const q = byId.get(s.id);
        if (!q || q.o === p.o) continue;
        const a = { x: r2(Math.sin(p.mid.a) * p.r0), y: r2(-Math.cos(p.mid.a) * p.r0) };
        const b = { x: r2(Math.sin(q.mid.a) * q.r0), y: r2(-Math.cos(q.mid.a) * q.r0) };
        out.push({ key: `${p.id}>${q.id}`, from: p.id, to: q.id, d: `M${a.x},${a.y}Q${r2((a.x + b.x) * 0.08)},${r2((a.y + b.y) * 0.08)} ${b.x},${b.y}` });
      }
    }
    return out;
  }, [geo, ix, mini]);

  const active = current ?? focus;

  // Mouse: hover previews a sector and a click enters. Touch/pen: the first tap previews
  // (the readout offers "Open"), a second tap on the same sector enters. Focus that comes
  // from a pointer press must not count as the first tap.
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

  return (
    <figure
      ref={figRef}
      aria-label={mini ? undefined : "Map of the five objections"}
      className={`rose${mini ? " rose-mini" : ""}${build && !mini ? " build" : ""}${scale !== null ? " measured" : ""}${narrow ? " narrow" : ""}${!mini && active ? " previewing" : ""} ${className}`}
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
        if (e.key === "Escape" && focus !== null) {
          // Handled here: a toast showing at the same time stays (toast.tsx skips handled keys).
          e.preventDefault();
          setFocus(null);
          hover.set(null);
        }
      }}
    >
      <svg
        ref={svgRef}
        viewBox={vb}
        role={mini ? "img" : "group"}
        aria-label={mini ? "Map of the five objections" : "One slice per objection. Each ring outward is one more round of replies."}
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
          const el = paneAt(e.target);
          if (el) {
            // Panes only take pointer events with a fine pointer (see atlas.css).
            const id = el.dataset.nodeId!;
            if (onNode) onNode(id);
            else onEnter(el.dataset.o as ObjectionId);
            return;
          }
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

        {/* faint contour rings */}
        {!mini &&
          Array.from({ length: geo.maxDepth + 1 }, (_, k) => <circle key={k} r={r2(geo.ring0 + k * geo.ringGap)} className="rose-ring" />)}
        {!mini && <circle r={R_OUT + 10} className="rose-ring outer" />}

        {/* sector hit areas (taps on touch screens; focus/hover everywhere) */}
        {!mini &&
          geo.sectors.map((s) => {
            const o = objFor(s.o);
            const ol = labels.objection.get(o.id) ?? "undec";
            return (
              <path
                key={`hit-${s.o}`}
                d={pane(8, R_OUT + 10, s.a0 - 0.03, s.a1 + 0.03)}
                className={`rose-sector${focus === s.o ? " on" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`Objection ${o.numeral}: ${toPlain(o.title || o.short || "")}. ${ol === "in" ? "Stands." : ol === "out" ? "Answered." : "Still open."}`}
                onPointerDown={(e) => {
                  pressed.current = { type: e.pointerType, at: e.timeStamp };
                }}
                onClick={(e) => tapSector(s.o, e.timeStamp)}
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
                <text className="rose-objtext" aria-hidden="true" x={r2(Math.sin(am) * rm)} y={r2(-Math.cos(am) * rm + fs.hub * 0.36)} textAnchor="middle" style={{ fontSize: fs.hub }}>
                  {o.numeral}
                </text>
              )}
            </g>
          );
        })}

        {/* panes, grouped by sector so a preview dims four groups instead of re-rendering every pane */}
        <g className={`rose-panes${mini ? "" : " live"}`}>
          {geo.bySector.map((sec) => (
            <g key={sec.o} className={`rose-sec${!mini && active && active !== sec.o ? " dim" : ""}`}>
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
          <text className="rose-q" y={11} textAnchor="middle" aria-hidden="true">
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
                  className={`rose-label num${on}`}
                  style={{ fontSize: fs.num }}
                >
                  {o.numeral}
                </text>
              </g>
            );
          })}
      </svg>

      {!mini && caption && <Readout hover={hover} focus={focus} onEnter={onEnter} />}
    </figure>
  );
}
