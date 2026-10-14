"use client";

/* One context for the whole disputation: the content index, the reader's
   judgments and the labels they imply, the current route, and a few lookups
   every view needs. */

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { plain } from "./markup";
import { useRoute, type Route } from "./router";
import {
  analyzeObjection,
  buildIndex,
  findTensions,
  labelAll,
  type DisputationIndex,
  type Judgments,
  type Labelling,
  type ObjectionAnalysis,
  type Tension,
} from "./semantics";
import { useJudgments } from "./store";
import type { Disputation, Judgment, Label, ObjectionId } from "./types";

export interface AtlasValue {
  ix: DisputationIndex;
  d: Disputation;
  route: Route;
  go: (r: Route, opts?: { replace?: boolean }) => void;
  judgments: Judgments;
  judge: (id: string, j: Judgment | null) => void;
  clearJudgments: (ids?: string[]) => void;
  /** Replace every judgment at once (one storage write) — e.g. undoing a reset. */
  replaceJudgments: (all: Judgments) => void;
  labels: Labelling;
  tensions: Tension[];
  analysis: Map<ObjectionId, ObjectionAnalysis>;
  /** Label for a node (or "undec" if unknown). */
  labelOf: (id: string) => Label;
  thinkerName: (id: string) => string;
  termName: (id: string) => string;
  /** Plain-text version of a markup string, with names resolved. */
  toPlain: (s: string) => string;
  /** Open a node in its chamber. */
  openNode: (id: string) => void;
}

const Ctx = createContext<AtlasValue | null>(null);

export function AtlasProvider({ d, children }: { d: Disputation; children: ReactNode }) {
  const ix = useMemo(() => buildIndex(d), [d]);
  const [route, go] = useRoute();
  const { judgments, setJudgment, clear, replaceAll } = useJudgments(d.slug);

  const labels = useMemo(() => labelAll(d, judgments), [d, judgments]);
  const tensions = useMemo(() => findTensions(ix, judgments, labels), [ix, judgments, labels]);
  const analysis = useMemo(
    () => new Map(d.objections.map((o) => [o.id, analyzeObjection(ix, o, judgments)] as const)),
    [d, ix, judgments],
  );

  // Fallback for an id missing from the cast: "lewis-cs" → "Lewis", "john-of-the-cross" → "John of the Cross".
  const thinkerName = useCallback(
    (id: string) =>
      ix.thinkers.get(id)?.name ??
      id
        .replace(/-(?:[a-z]{1,2}|robert|marilyn|william|charles)(?:-[a-z]{1,2})?$/, "")
        .split("-")
        .map((w, i) => (i > 0 && /^(of|the|de|van|von|al)$/.test(w) ? w : w[0].toUpperCase() + w.slice(1)))
        .join(" "),
    [ix],
  );
  const termName = useCallback((id: string) => ix.terms.get(id)?.term ?? id.replace(/-/g, " "), [ix]);
  const toPlain = useCallback(
    (s: string) => plain(s, { thinker: (id) => ix.thinkers.get(id)?.name, term: (id) => ix.terms.get(id)?.term }),
    [ix],
  );
  const openNode = useCallback(
    (id: string) => {
      const info = ix.nodes.get(id);
      if (info) go({ view: "objection", o: info.objection, node: id });
    },
    [ix, go],
  );

  const value = useMemo<AtlasValue>(
    () => ({
      ix,
      d,
      route,
      go,
      judgments,
      judge: setJudgment,
      clearJudgments: clear,
      replaceJudgments: replaceAll,
      labels,
      tensions,
      analysis,
      labelOf: (id) => labels.node.get(id) ?? "undec",
      thinkerName,
      termName,
      toPlain,
      openNode,
    }),
    [ix, d, route, go, judgments, setJudgment, clear, replaceAll, labels, tensions, analysis, thinkerName, termName, toPlain, openNode],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAtlas(): AtlasValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAtlas must be used inside <AtlasProvider>");
  return v;
}
