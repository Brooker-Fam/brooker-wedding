/* Deterministic layouts for argument trees.
   - radialLayout: the whole disputation as a rose — center = the question,
     one sector per objection, each ring outward = one more round.
   - tidyLayout: one objection as a left-to-right (or top-down) tree where
     every leaf gets its own lane and parents sit centered over their replies. */

import type { ArgNode, Disputation, Objection, ObjectionId, Side } from "./types";

export interface RadialPoint {
  id: string;
  objection: ObjectionId;
  side: Side;
  depth: number; // 1 = prong
  angle: number; // radians, 0 = up, clockwise
  r: number;
  x: number;
  y: number;
  parent: string | null; // null → attaches to the objection hub
}

export interface RadialHub {
  objection: ObjectionId;
  angle: number;
  start: number;
  end: number;
  x: number;
  y: number;
  r: number;
}

export interface RadialLayout {
  points: RadialPoint[];
  hubs: RadialHub[];
  rings: number[];
  maxDepth: number;
}

function leafCount(n: ArgNode): number {
  const k = n.children ?? [];
  return k.length ? k.reduce((s, c) => s + leafCount(c), 0) : 1;
}

function depthOf(n: ArgNode): number {
  const k = n.children ?? [];
  return 1 + (k.length ? Math.max(...k.map(depthOf)) : 0);
}

// Rounded so server and browser agree exactly (Math.sin can differ in the last bit).
const round2 = (v: number) => Math.round(v * 100) / 100;
const polar = (angle: number, r: number) => ({ x: round2(Math.sin(angle) * r), y: round2(-Math.cos(angle) * r) });

/**
 * @param hubR    radius of the objection hubs
 * @param ringGap distance between successive rounds
 * @param gap     angular gap between sectors (radians)
 * @param weight  how sector width scales with leaf count (0 = equal sectors, 1 = proportional)
 */
export function radialLayout(
  objections: Objection[],
  { hubR = 70, ringGap = 46, gap = 0.12, weight = 0.6 }: { hubR?: number; ringGap?: number; gap?: number; weight?: number } = {},
): RadialLayout {
  const leaves = objections.map((o) => o.prongs.reduce((s, p) => s + leafCount(p), 0));
  const total = leaves.reduce((a, b) => a + b, 0);
  const n = objections.length;
  const avail = Math.PI * 2 - gap * n;
  const shares = leaves.map((l) => (1 - weight) / n + (weight * l) / total);
  const points: RadialPoint[] = [];
  const hubs: RadialHub[] = [];
  let maxDepth = 0;

  // Center the first sector at 12 o'clock.
  let cursor = -(shares[0] * avail) / 2;
  objections.forEach((o, i) => {
    const width = shares[i] * avail;
    const start = cursor;
    const end = cursor + width;
    cursor = end + gap;
    const mid = (start + end) / 2;
    hubs.push({ objection: o.id, angle: mid, start, end, r: hubR, ...polar(mid, hubR) });

    const oLeaves = leaves[i];
    let slot = 0;
    const place = (node: ArgNode, depth: number, parent: string | null): number => {
      maxDepth = Math.max(maxDepth, depth);
      const kids = node.children ?? [];
      let angle: number;
      if (!kids.length) {
        angle = start + ((slot + 0.5) / oLeaves) * width;
        slot++;
      } else {
        const angles = kids.map((c) => place(c, depth + 1, node.id));
        angle = (Math.min(...angles) + Math.max(...angles)) / 2;
      }
      const r = hubR + depth * ringGap;
      points.push({ id: node.id, objection: o.id, side: node.side, depth, angle, r, parent, ...polar(angle, r) });
      return angle;
    };
    o.prongs.forEach((p) => place(p, 1, null));
  });

  const rings = Array.from({ length: maxDepth }, (_, k) => hubR + (k + 1) * ringGap);
  return { points, hubs, rings, maxDepth };
}

/** SVG path for a radial edge: out along the parent's ray, then an arc, then out to the child. */
export function radialEdge(a: { angle: number; r: number }, b: { angle: number; r: number }): string {
  const mid = (a.r + b.r) / 2;
  const p0 = polar(a.angle, a.r);
  const p1 = polar(a.angle, mid);
  const p2 = polar(b.angle, mid);
  const p3 = polar(b.angle, b.r);
  const sweep = b.angle > a.angle ? 1 : 0;
  const large = Math.abs(b.angle - a.angle) > Math.PI ? 1 : 0;
  const f = (v: number) => v.toFixed(2);
  if (Math.abs(b.angle - a.angle) < 1e-4) return `M${f(p0.x)},${f(p0.y)}L${f(p3.x)},${f(p3.y)}`;
  return `M${f(p0.x)},${f(p0.y)}L${f(p1.x)},${f(p1.y)}A${f(mid)},${f(mid)} 0 ${large} ${sweep} ${f(p2.x)},${f(p2.y)}L${f(p3.x)},${f(p3.y)}`;
}

/* ---------------- tidy tree ---------------- */

export interface TidyNode {
  id: string;
  side: Side;
  depth: number; // 1 = prong
  lane: number; // fractional lane index (leaf order)
  x: number;
  y: number;
  parent: string | null;
}

export interface TidyLayout {
  nodes: TidyNode[];
  width: number;
  height: number;
  lanes: number;
  depth: number;
}

/**
 * Left-to-right tree: depth → x (colW apart), leaf order → y (laneH apart).
 * Set `vertical` to swap axes (depth → y).
 * `collapsed` hides the descendants of those ids (they count as leaves).
 */
export function tidyLayout(
  prongs: ArgNode[],
  { colW = 280, laneH = 92, padX = 0, padY = 0, vertical = false, collapsed }: {
    colW?: number;
    laneH?: number;
    padX?: number;
    padY?: number;
    vertical?: boolean;
    collapsed?: Set<string>;
  } = {},
): TidyLayout {
  const nodes: TidyNode[] = [];
  let lane = 0;
  let depthMax = 0;
  const place = (n: ArgNode, depth: number, parent: string | null, prongGapBefore: boolean): number => {
    if (prongGapBefore) lane += 0.5;
    depthMax = Math.max(depthMax, depth);
    const kids = collapsed?.has(n.id) ? [] : n.children ?? [];
    let l: number;
    if (!kids.length) {
      l = lane;
      lane += 1;
    } else {
      const ls = kids.map((c) => place(c, depth + 1, n.id, false));
      l = (Math.min(...ls) + Math.max(...ls)) / 2;
    }
    const main = (depth - 1) * colW;
    const cross = l * laneH;
    nodes.push({
      id: n.id,
      side: n.side,
      depth,
      lane: l,
      parent,
      x: (vertical ? cross : main) + padX,
      y: (vertical ? main : cross) + padY,
    });
    return l;
  };
  prongs.forEach((p, i) => place(p, 1, null, i > 0));
  const lanes = lane;
  const mainLen = (depthMax - 1) * colW;
  const crossLen = Math.max(0, lanes - 1) * laneH;
  return {
    nodes,
    lanes,
    depth: depthMax,
    width: (vertical ? crossLen : mainLen) + padX * 2,
    height: (vertical ? mainLen : crossLen) + padY * 2,
  };
}

/** Smooth cubic link between two tidy nodes (horizontal or vertical flow). */
export function tidyEdge(a: { x: number; y: number }, b: { x: number; y: number }, vertical = false): string {
  const f = (v: number) => v.toFixed(1);
  if (vertical) {
    const my = (a.y + b.y) / 2;
    return `M${f(a.x)},${f(a.y)}C${f(a.x)},${f(my)} ${f(b.x)},${f(my)} ${f(b.x)},${f(b.y)}`;
  }
  const mx = (a.x + b.x) / 2;
  return `M${f(a.x)},${f(a.y)}C${f(mx)},${f(a.y)} ${f(mx)},${f(b.y)} ${f(b.x)},${f(b.y)}`;
}

export const treeDepth = depthOf;
export const treeLeaves = leafCount;

/* ------------------------------------------------------------------ */
/* The Rose's five sectors (shared by the Rose, its emblem, and the    */
/* /debates index card, which computes them on the server)             */
/* ------------------------------------------------------------------ */

const SECTOR_GAP = 0.07;

export interface RoseSector {
  o: ObjectionId;
  a0: number;
  a1: number;
  leaves: number;
}

/** The sectors' angles (radians, clockwise from 12 o'clock; sector I centred at the top).
    Width is mostly proportional to leaves, with a floor so a lean objection stays legible. */
export function sectorLayout(d: Pick<Disputation, "objections">): RoseSector[] {
  const n = d.objections.length;
  if (!n) return [];
  const leaves = d.objections.map((o) => Math.max(1, o.prongs.reduce((s, p) => s + leafCount(p), 0)));
  const total = leaves.reduce((a, b) => a + b, 0);
  const avail = Math.PI * 2 - SECTOR_GAP * n;
  const shares = leaves.map((l) => 0.35 / n + (0.65 * l) / total);
  let cursor = -(shares[0] * avail) / 2;
  return d.objections.map((o, i) => {
    const w = shares[i] * avail;
    const s = { o: o.id, a0: cursor, a1: cursor + w, leaves: leaves[i] };
    cursor += w + SECTOR_GAP;
    return s;
  });
}
