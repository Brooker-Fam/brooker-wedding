"use client";

/* A tiny "where did the reader last work?" record, per disputation, in
   localStorage: the objection (and move) they last made a call in, and the
   chamber they last opened. The Shell writes it; the overview's modest
   "Previously…" line reads it. Storage can be missing or throw, so every
   access is guarded and the page works without it. */

import { useSyncExternalStore } from "react";
import type { Judgments } from "../semantics";
import type { ObjectionId } from "../types";

export interface Recent {
  /** The objection (and move) the reader last made or withdrew a call in. */
  judged?: { o: ObjectionId; node: string; t: number };
  /** The chamber or walk the reader last opened. */
  visited?: { o: ObjectionId; t: number };
}

const EMPTY_RECENT: Recent = Object.freeze({}) as Recent;
const cache = new Map<string, Recent>();
const subs = new Set<() => void>();
const recentKey = (slug: string) => `disputation:${slug}:recent:v1`;
const judgmentsKey = (slug: string) => `disputation:${slug}:judgments:v1`;

function readRecent(slug: string): Recent {
  if (typeof window === "undefined") return EMPTY_RECENT;
  let r = cache.get(slug);
  if (!r) {
    r = EMPTY_RECENT;
    try {
      const raw = window.localStorage.getItem(recentKey(slug));
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      if (parsed && typeof parsed === "object") r = parsed as Recent;
    } catch {
      /* storage unavailable: no resume line, nothing else changes */
    }
    cache.set(slug, r);
  }
  return r;
}

export function writeRecent(slug: string, patch: Partial<Recent>) {
  const next = { ...readRecent(slug), ...patch };
  cache.set(slug, next);
  try {
    window.localStorage.setItem(recentKey(slug), JSON.stringify(next));
  } catch {
    /* ignore */
  }
  subs.forEach((f) => f());
}

function subscribe(cb: () => void) {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

/** Where the reader last worked (empty during SSR and when storage is unavailable). */
export function useRecent(slug: string): Recent {
  return useSyncExternalStore(
    subscribe,
    () => readRecent(slug),
    () => EMPTY_RECENT,
  );
}

/** The judgments as stored right now (what the judgment store will hydrate to). */
export function readStoredJudgments(slug: string): Judgments | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(judgmentsKey(slug));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const clean: Judgments = {};
    for (const [k, v] of Object.entries(parsed)) if (v === "holds" || v === "fails") clean[k] = v;
    return clean;
  } catch {
    return null;
  }
}

/* Changes that arrive from another tab (the `storage` event) are not calls made
   here. This listener is registered when the module loads, i.e. before the
   judgment store registers its own (lazily, on first render), so the stamp is
   always set before the store re-emits. */
let externalAt = -Infinity;
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === null || e.key.includes(":judgments:")) externalAt = Date.now();
  });
}

/** True if judgments just changed because another tab wrote them. */
export function changedElsewhere(withinMs = 600): boolean {
  return Date.now() - externalAt < withinMs;
}
