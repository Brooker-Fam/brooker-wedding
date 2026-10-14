/* Presentation helpers shared by every view: round names, node addresses,
   and "what would this call settle?" previews. */

import type { DisputationIndex, Judgments } from "./semantics";
import { labelObjection } from "./semantics";
import type { Judgment, Label, ObjectionId } from "./types";

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Plain round names. Rounds count in ordinary numbers ("Round 3"); Roman
    numerals belong to the five objections. */
export function roundName(depth: number): string {
  return `Round ${depth}`;
}

export function roundLabel(depth: number): string {
  return roundName(depth);
}

/** Move cues: the Summa's own English formulas for rounds 1 and 2, plain speech after. */
export function summaCue(depth: number, side: "skeptic" | "theist" | "spinoza"): string {
  if (side === "spinoza") return "Spinoza cuts in";
  if (depth === 1) return "It seems that";
  if (depth === 2) return "On the contrary";
  return side === "theist" ? "The Defender replies" : "The Objector replies";
}

/** A node's address: objection numeral, then 1-based sibling positions. e.g. "I·2.1.3" */
export function address(ix: DisputationIndex, id: string): string {
  const info = ix.nodes.get(id);
  if (!info) return "";
  const o = ix.objections.get(info.objection);
  const parts = info.path.map((pid) => (ix.nodes.get(pid)?.order ?? 0) + 1);
  return `${o?.numeral ?? "?"}·${parts.join(".")}`;
}

/** How many rounds run below a node (0 for a leaf). */
export function depthBelow(ix: DisputationIndex, id: string): number {
  const info = ix.nodes.get(id);
  if (!info || info.childIds.length === 0) return 0;
  return 1 + Math.max(...info.childIds.map((c) => depthBelow(ix, c)));
}

/** Count of moves in a subtree, excluding the node itself. */
export function movesBelow(ix: DisputationIndex, id: string): number {
  const info = ix.nodes.get(id);
  if (!info) return 0;
  return info.childIds.reduce((s, c) => s + 1 + movesBelow(ix, c), 0);
}

export interface Consequence {
  objection: ObjectionId;
  now: Label;
  ifHolds: Label;
  ifFails: Label;
}

/** What the objection's label would be if the reader called this node each way. */
export function consequence(ix: DisputationIndex, id: string, j: Judgments): Consequence | null {
  const info = ix.nodes.get(id);
  if (!info) return null;
  const o = ix.objections.get(info.objection)!;
  const without = { ...j };
  delete without[id];
  const at = (v: Judgment) => labelObjection(o, { ...without, [id]: v });
  return { objection: o.id, now: labelObjection(o, j), ifHolds: at("holds"), ifFails: at("fails") };
}

export const OBJECTION_WORD: Record<Label, string> = { in: "stands", out: "is answered", undec: "stays open" };

/** Short stats for an objection: total moves, most rounds, and how many parts. */
export function objectionStats(ix: DisputationIndex, o: ObjectionId) {
  const ids = ix.byObjection.get(o) ?? [];
  const depth = Math.max(0, ...ids.map((id) => ix.nodes.get(id)!.depth));
  const prongs = ix.objections.get(o)?.prongs.length ?? 0;
  return { moves: ids.length, depth, prongs };
}
