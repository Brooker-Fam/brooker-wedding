"use client";

/* Tiny hash router so every view and every argument node is deep-linkable
   without leaving the page (and without a server round trip):
     #/                     overview
     #/map                  overview, scrolled to the map
     #/o/<objection>        an objection's chamber
     #/o/<objection>/<node> …with a node open in the reader
     #/walk/<objection>     the guided "argue it through" walk
     #/timeline[/<moment>]  #/cast[/<thinker>]  #/lexicon[/<term>]  #/ledger
     #/play                 the chronology game */

import { useCallback, useSyncExternalStore } from "react";
import type { ObjectionId } from "./types";

export type Route =
  | {
      view: "home";
      /** "map": arrive scrolled to the map instead of the top of the hero. */
      at?: "map";
      /** A link named something that doesn't exist (the URL is then replaced with #/). */
      missing?: string;
      /** What the missing name was meant to be: an objection (#/o/nope) or a page (#/nope). */
      kind?: "objection" | "page";
    }
  | { view: "objection"; o: ObjectionId; node?: string }
  | { view: "walk"; o: ObjectionId }
  | { view: "timeline"; moment?: string }
  | { view: "cast"; thinker?: string }
  | { view: "lexicon"; term?: string }
  | { view: "ledger" }
  | { view: "outline" }
  | { view: "sources" }
  | { view: "play" };

const OBJECTIONS: ObjectionId[] = ["coherence", "hiddenness", "nature", "evidence", "morals"];
const isObjection = (s: string | undefined): s is ObjectionId => !!s && (OBJECTIONS as string[]).includes(s);

/* A malformed %-escape (#/cast/%) must not throw during render: keep the raw text. */
const dec = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

export function parseHash(hash: string): Route {
  // Ids are lowercase kebab and never contain "?" or "&": a pasted tracking tail
  // (#/o/coherence/coh-a?x=1) or a capitalised name (#/cast/Plato) still finds its target.
  const parts = hash
    .replace(/^#\/?/, "")
    .replace(/[?&].*$/, "")
    .split("/")
    .filter(Boolean)
    .map((p) => dec(p).trim().toLowerCase())
    .filter(Boolean);
  const [a, b, c] = parts;
  switch (a) {
    case "map":
      return { view: "home", at: "map" };
    case "o":
      return isObjection(b) ? { view: "objection", o: b, node: c } : b ? { view: "home", missing: b, kind: "objection" } : { view: "home" };
    case "walk":
      return isObjection(b) ? { view: "walk", o: b } : b ? { view: "home", missing: b, kind: "objection" } : { view: "home" };
    case "timeline":
      return { view: "timeline", moment: b };
    case "cast":
      return { view: "cast", thinker: b };
    case "lexicon":
      return { view: "lexicon", term: b };
    case "ledger":
      return { view: "ledger" };
    case "outline":
      return { view: "outline" };
    case "sources":
      return { view: "sources" };
    case "play":
      return { view: "play" };
    default:
      return a ? { view: "home", missing: a, kind: "page" } : { view: "home" };
  }
}

export function formatRoute(r: Route): string {
  const seg = (...s: (string | undefined)[]) => "#/" + s.filter(Boolean).map((x) => encodeURIComponent(x!)).join("/");
  switch (r.view) {
    case "home":
      return r.at === "map" ? "#/map" : "#/";
    case "objection":
      return seg("o", r.o, r.node);
    case "walk":
      return seg("walk", r.o);
    case "timeline":
      return seg("timeline", r.moment);
    case "cast":
      return seg("cast", r.thinker);
    case "lexicon":
      return seg("lexicon", r.term);
    case "ledger":
      return seg("ledger");
    case "outline":
      return seg("outline");
    case "sources":
      return seg("sources");
    case "play":
      return seg("play");
  }
}

/* Next's App Router keeps its own copy of the URL and rewrites the address bar
   from it whenever it commits (HMR, refreshes). A raw fragment navigation — a
   plain <a href="#/…"> click or `location.hash = …` — leaves that copy stale, so
   the hash could later snap back. We navigate through Next's patched
   history.pushState/replaceState (which update its copy), and after any raw
   fragment navigation (history.state lacks Next's marker) we resync it. */
function syncNextUrl() {
  const st = window.history.state as { __NA?: boolean } | null;
  if (st && st.__NA) return;
  try {
    window.history.replaceState(st, "", window.location.href);
  } catch {
    /* router not ready yet; harmless */
  }
}

function subscribe(cb: () => void) {
  const on = () => {
    syncNextUrl();
    cb();
  };
  window.addEventListener("hashchange", on);
  return () => window.removeEventListener("hashchange", on);
}
const getHash = () => window.location.hash;
const getServerHash = () => "";

export function useRoute(): [Route, (r: Route, opts?: { replace?: boolean }) => void] {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  const route = parseHash(hash);
  const go = useCallback((r: Route, opts?: { replace?: boolean }) => {
    const next = formatRoute(r);
    if (next === window.location.hash || (next === "#/" && !window.location.hash)) return;
    const oldURL = window.location.href;
    if (opts?.replace) history.replaceState(history.state, "", next);
    else history.pushState(null, "", next);
    window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL, newURL: window.location.href }));
  }, []);
  return [route, go];
}

/** Stable string key for a route's *view* (used to drive view transitions). */
export function viewKey(r: Route): string {
  switch (r.view) {
    case "objection":
    case "walk":
      return `${r.view}:${r.o}`;
    default:
      return r.view;
  }
}
