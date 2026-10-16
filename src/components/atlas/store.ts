"use client";

/* The reader's judgments ("holds" / "fails" per node), kept in localStorage so
   a reader can come back to their ledger. Browser storage can be missing or
   throw (private windows, blocked site data), so every access is guarded and
   the page works without it — judgments then just last for the visit. */

import { useCallback, useSyncExternalStore } from "react";
import type { Judgment } from "./types";
import type { Judgments } from "./semantics";

type Listener = () => void;

const EMPTY: Judgments = Object.freeze({}) as Judgments;

class JudgmentStore {
  private state: Judgments = EMPTY;
  private loaded = false;
  private listening = false;
  private listeners = new Set<Listener>();

  constructor(private key: string) {}

  /** Parse what storage holds into `state` (empty if missing, malformed or unreadable). */
  private read() {
    try {
      const raw = window.localStorage.getItem(this.key);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const clean: Judgments = {};
        for (const [k, v] of Object.entries(parsed ?? {})) if (v === "holds" || v === "fails") clean[k] = v;
        this.state = clean;
      }
    } catch {
      /* storage unavailable — start empty */
    }
  }

  private load() {
    if (this.loaded || typeof window === "undefined") return;
    this.loaded = true;
    this.read();
    // Another tab changed the calls: re-read. Registered once per store, never from inside
    // the handler (that would add a listener per event). A null key is localStorage.clear().
    if (!this.listening) {
      this.listening = true;
      window.addEventListener("storage", (e) => {
        if (e.key !== null && e.key !== this.key) return;
        this.state = EMPTY;
        this.read();
        this.emit();
      });
    }
  }

  private persist() {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(this.state));
    } catch {
      /* ignore */
    }
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  subscribe = (l: Listener) => {
    this.load();
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };

  get = (): Judgments => {
    this.load();
    return this.state;
  };

  getServer = (): Judgments => EMPTY;

  set(id: string, j: Judgment | null) {
    const next = { ...this.state };
    if (j) next[id] = j;
    else delete next[id];
    this.state = next;
    this.persist();
    this.emit();
  }

  replace(all: Judgments) {
    this.state = { ...all };
    this.persist();
    this.emit();
  }
}

const stores = new Map<string, JudgmentStore>();
function storeFor(slug: string) {
  let s = stores.get(slug);
  if (!s) {
    s = new JudgmentStore(`disputation:${slug}:judgments:v1`);
    stores.set(slug, s);
  }
  return s;
}

export function useJudgments(slug: string) {
  const s = storeFor(slug);
  const judgments = useSyncExternalStore(s.subscribe, s.get, s.getServer);
  const setJudgment = useCallback((id: string, j: Judgment | null) => s.set(id, j), [s]);
  const clear = useCallback((ids?: string[]) => {
    if (!ids) return s.replace({});
    const next = { ...s.get() };
    ids.forEach((id) => delete next[id]);
    s.replace(next);
  }, [s]);
  const replaceAll = useCallback((all: Judgments) => s.replace(all), [s]);
  return { judgments, setJudgment, clear, replaceAll };
}
