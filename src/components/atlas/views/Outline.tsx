"use client";

/* Library · Outline (#/outline): every move as nested lists, with the
   reader's statuses and links into each objection.

   This file also hosts the small pieces every Library view shares (header +
   library tabs, node chips, the footprint Rose, era buckets, a media-query
   hook, text folding), so Timeline / Cast / Lexicon import them from here. */

import "./library.css";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { useAtlas } from "../context";
import { tick } from "../haptics";
import { address } from "../helpers";
import { Glyph } from "../primitives";
import { formatRoute } from "../router";
import type { Disputation, ObjectionId, Quote, Side } from "../types";
import { answeredMark, placeLabel, shownLabel, spellAddress } from "./chamberShared";
import { StatusPip } from "./marks";
import OutlineList, { OUTLINE_SIDE_WORD, nestQuotes } from "./OutlineList";
import Rose from "./Rose";

/* ======================================================================
   Shared Library pieces
   ====================================================================== */

export const SIDE_WORD = OUTLINE_SIDE_WORD;

export interface Era {
  id: string;
  name: string;
  span: string;
  /** exclusive upper bound (year) */
  to: number;
}

export const ERAS: Era[] = [
  { id: "ancient", name: "Ancient", span: "to 500 CE", to: 500 },
  { id: "medieval", name: "Medieval", span: "500–1500", to: 1500 },
  { id: "early", name: "Early modern", span: "1500–1800", to: 1800 },
  { id: "modern", name: "Modern", span: "1800–1945", to: 1945 },
  { id: "contemporary", name: "Contemporary", span: "since 1945", to: Infinity },
];

export function eraOf(year: number): Era {
  return ERAS.find((e) => year < e.to) ?? ERAS[ERAS.length - 1];
}

/** Display a year: negative = BCE. */
export function yearText(y: number): string {
  if (y < 0) return `${-y} BCE`;
  if (y < 1000) return `${y} CE`;
  return String(y);
}

/** Case- and accent-insensitive form of a string, for search. */
export function fold(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/** Respect the reader's reduced-motion setting for programmatic scrolls. */
export function scrollBehavior(): ScrollBehavior {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

/** matchMedia as an external store (server snapshot = `server`). */
export function useMedia(query: string, server = false): boolean {
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

type LibView = "timeline" | "cast" | "lexicon" | "outline" | "sources";
const TABS: { view: LibView; word: string }[] = [
  { view: "timeline", word: "Timeline" },
  { view: "cast", word: "People" },
  { view: "lexicon", word: "Glossary" },
  { view: "outline", word: "Outline" },
  { view: "sources", word: "Sources" },
];

/* ======================================================================
   Phone chrome: sticky rows, the jump row, the A–Z rail
   ====================================================================== */

/** Where the Library's rows stick: phones and tablets held upright (library.css uses the same query). */
export const STICKY_QUERY = "(max-width: 1023px) and (min-height: 561px)";
/** Where the A–Z rail shows: phones and tablets in portrait. */
const RAIL_QUERY = "(max-width: 1023px) and (orientation: portrait)";

/* A jump (a chip in a jump row, the A–Z rail, a letter) scrolls the page itself. Until it settles the sticky rows
   stay as they are, so the place it lands on is worked out against rows that don't move. */
let holdUntil = 0;
export function holdChrome(ms = 900) {
  holdUntil = Math.max(holdUntil, performance.now() + ms);
}
/** A moment `ms` from now (for event handlers; kept out of the components so they stay pure). */
const later = (ms: number) => performance.now() + ms;

/** How far down the sticky rows reach over `el` right now: its scroll-margin-top (library.css gives every jump target
    the rows' depth with the tab row shown), less the tab row while it is tucked away. */
export function coverAt(el: HTMLElement): number {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const lib = el.closest<HTMLElement>(".lib");
  if (!lib?.hasAttribute("data-tabs-hidden")) return margin;
  return margin - (parseFloat(getComputedStyle(lib).getPropertyValue("--lib-tabs-h")) || 0);
}

/** Scroll a section to just under the sticky rows, as they stand (a jump keeps them as they are until it settles). */
export function jumpTo(el: HTMLElement, behavior: ScrollBehavior = scrollBehavior()) {
  holdChrome(behavior === "smooth" ? 1100 : 300);
  const top = el.getBoundingClientRect().top + window.scrollY - coverAt(el);
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
}

/** Give a heading focus without scrolling, so the next Tab goes on from the place a jump landed. */
export function focusHeading(el: HTMLElement | null | undefined) {
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.tabIndex = -1;
  el.focus({ preventScroll: true });
}

/* The tab row tucks up under the top bar while the reader scrolls down a list and comes back on the way up (or near
   the top, or at the very end), like the thumb dock. The view's own sticky row moves up into its place. */
function useTabsTuck(nav: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = nav.current;
    const root = el?.closest<HTMLElement>(".lib");
    if (!el || !root) return;
    const mq = window.matchMedia(STICKY_QUERY);
    let lastY = window.scrollY;
    let travel = 0;
    let hidden = false;
    let raf = 0;
    const set = (h: boolean) => {
      if (h === hidden) return;
      hidden = h;
      root.toggleAttribute("data-tabs-hidden", h);
    };
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (!mq.matches) return set(false);
      if (performance.now() < holdUntil) {
        travel = 0;
        return;
      }
      // The header (title, intro, search) is still on screen: the tabs stay.
      const headEnd = root.getBoundingClientRect().top + y + 260;
      const end = document.documentElement.scrollHeight - window.innerHeight - 6;
      if (y < headEnd || y >= end) {
        travel = 0;
        return set(false);
      }
      if (dy === 0) return;
      if (dy > 0 !== travel > 0) travel = 0;
      travel += dy;
      if (travel > 24) set(true);
      else if (travel < -10) set(false);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Tabbing into the row brings it back (and keeps it while focus settles there).
    const onFocus = () => {
      holdChrome(600);
      set(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onScroll);
    el.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onScroll);
      el.removeEventListener("focusin", onFocus);
      cancelAnimationFrame(raf);
      root.removeAttribute("data-tabs-hidden");
    };
  }, [nav]);
}

/** A horizontally scrolling row says which way it can still scroll, so its edges can fade (library.css). */
function useEdgeFade(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      el.toggleAttribute("data-more-left", max > 2 && el.scrollLeft > 2);
      el.toggleAttribute("data-more-right", max > 2 && el.scrollLeft < max - 2);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [ref]);
}

/** Bring one item of a scrolling row into view inside the row (never scrolling the page). */
function revealInRow(row: HTMLElement, item: HTMLElement, behavior: ScrollBehavior) {
  const max = row.scrollWidth - row.clientWidth;
  if (max <= 0) return;
  const left = item.offsetLeft - (row.clientWidth - item.offsetWidth) / 2;
  row.scrollTo({ left: Math.max(0, Math.min(max, left)), behavior });
}

/** A row of filter chips that scrolls sideways on a phone instead of wrapping into several rows. */
export function ChipRow({ className = "", label, active, children }: { className?: string; label: string; active: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const first = useRef(true);
  useEdgeFade(ref);
  // Keep the pressed chip in view (on arrival, or when the filter changes).
  useEffect(() => {
    const el = ref.current;
    const on = el?.querySelector<HTMLElement>("[aria-pressed='true']");
    if (el && on) revealInRow(el, on, first.current || reduce ? "auto" : "smooth");
    first.current = false;
  }, [active, reduce]);
  return (
    <div className={`lib-chiprow ${className}`} role="group" aria-label={label} ref={ref}>
      {children}
    </div>
  );
}

/** The Library's own tab row (Timeline · People · Glossary · Outline · Sources), the same on every Library view.
    Views with nothing in them yet say "soon". On a phone it sticks under the top bar, scrolls sideways if it must, and
    tucks away while the reader scrolls down a list. */
export function LibTabs({ current }: { current: LibView }) {
  const { d } = useAtlas();
  const nav = useRef<HTMLElement>(null);
  const row = useRef<HTMLUListElement>(null);
  useTabsTuck(nav);
  useEdgeFade(row);
  useLayoutEffect(() => {
    const ul = row.current;
    const on = ul?.querySelector<HTMLElement>("[aria-current='page']");
    if (ul && on) revealInRow(ul, on.parentElement ?? on, "auto");
  }, [current]);
  const empty: Record<LibView, boolean> = {
    timeline: d.moments.length === 0,
    cast: d.thinkers.length === 0,
    lexicon: d.terms.length === 0,
    outline: false,
    sources: false,
  };
  return (
    <nav className="lib-tabs" aria-label="Library" ref={nav}>
      <span className="lib-tabs-k mono" aria-hidden>
        Library
      </span>
      <ul ref={row}>
        {TABS.map((t) => (
          <li key={t.view}>
            <a className={`lib-tab mono ${empty[t.view] ? "soon" : ""}`} href={formatRoute({ view: t.view })} aria-current={current === t.view ? "page" : undefined}>
              {t.word}
              {empty[t.view] && <span className="lib-tab-soon">{" "}soon</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export interface JumpItem {
  id: string;
  content: ReactNode;
  /** The chip's accessible name, when its visible content isn't enough. */
  aria?: string;
  title?: string;
}

/** A row of chips that jump to the sections of a long list (eras, objections, kinds of source). On a phone it
    sticks under the tab row and lights the section on screen, with a marker that glides between chips. */
export function JumpRow({
  label,
  items,
  target,
  className = "",
  chipClass = "",
}: {
  label: string;
  items: JumpItem[];
  /** The section a chip jumps to (in list order). */
  target: (id: string) => HTMLElement | null;
  className?: string;
  chipClass?: string;
}) {
  const nav = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const gid = useId();
  // While a jump scrolls the page, the marker stays on the chip that was tapped (it doesn't flicker through the
  // sections passed on the way).
  const lockUntil = useRef(0);
  useEdgeFade(row);

  // The section on screen: the last one whose top has passed under the row.
  const ids = items.map((i) => i.id).join("|");
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const n = nav.current;
      if (!n) return;
      if (performance.now() < lockUntil.current) {
        raf = requestAnimationFrame(update);
        return;
      }
      const line = n.getBoundingClientRect().bottom + 24;
      let now: string | null = null;
      for (const id of ids.split("|")) {
        const el = target(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) now = id;
        else break;
      }
      setCur(now);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ids, target]);

  // Keep the lit chip in view inside the row.
  useEffect(() => {
    const r = row.current;
    const on = cur ? r?.querySelector<HTMLElement>(`[data-jump="${CSS.escape(cur)}"]`) : null;
    if (r && on) revealInRow(r, on, reduce ? "auto" : "smooth");
  }, [cur, reduce]);

  const jump = (id: string) => {
    const el = target(id);
    if (!el) return;
    const behavior = scrollBehavior();
    lockUntil.current = later(behavior === "smooth" ? 1000 : 120);
    jumpTo(el, behavior);
    setCur(id);
    focusHeading(el.matches("h2, h3") ? el : el.querySelector<HTMLElement>("h2, h3"));
  };

  return (
    <nav className={`lib-jump ${className}`} aria-label={label} ref={nav}>
      <div className="lib-jump-row" ref={row}>
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                className={`lib-jump-b ${chipClass}`}
                data-jump={it.id}
                aria-current={cur === it.id ? "true" : undefined}
                aria-label={it.aria}
                title={it.title}
                onClick={() => jump(it.id)}
              >
                {it.content}
                {cur === it.id && (
                  <motion.span
                    layoutId={`${gid}-on`}
                    className="lib-jump-on"
                    aria-hidden
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40, mass: 0.8 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export interface RailStop {
  key: string;
  /** What the rail shows (a letter). */
  label: string;
  /** How many entries it covers, for the bubble. */
  count: number;
}

/* A touch on the rail is a scrub only when it says so: it rests a moment, or starts slowly. A quick flick that starts on
   the rail is the reader scrolling the page with their right thumb, so the browser keeps it. */
/** How long a touch has to show which it is. */
const SCRUB_WAIT = 80;
/** Moving this far within SCRUB_WAIT means a scroll (or a swipe), not a scrub. */
const SCRUB_SLOP = 8;

/** An A–Z rail at the right edge (phones and tablets in portrait, phones on their side) for a long alphabetical list:
    tap a letter or drag along the rail, and a big letter shows which one you're on. It shows while the list is on
    screen. The letter buttons above the list do the same job for keyboards and screen readers, so the rail is hidden
    from them. */
export function ScrubRail({
  stops,
  target,
  list,
  unit,
}: {
  stops: RailStop[];
  /** The section a letter jumps to. */
  target: (key: string) => HTMLElement | null;
  /** The list the rail belongs to: the rail shows while it fills the screen. */
  list: RefObject<HTMLElement | null>;
  /** The bubble's count, singular and plural: ["term", "terms"]. */
  unit: [string, string];
}) {
  const on = useMedia(RAIL_QUERY);
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);
  const [cur, setCurState] = useState<string | null>(null);
  const [bubble, setBubble] = useState<{ key: string; y: number } | null>(null);
  const track = useRef<HTMLDivElement>(null);
  /** The letter lit now (for the event handlers, which outlive a render). */
  const lit = useRef<string | null>(null);
  const setCur = useCallback((k: string | null) => {
    lit.current = k;
    setCurState(k);
  }, []);
  const scrubbing = useRef(false);
  /** A touch that hasn't yet shown whether it is a scrub or a scroll. */
  const pending = useRef<{ id: number; t0: number; x0: number; y0: number; y: number; timer: number } | null>(null);
  const last = useRef<string | null>(null);
  const fade = useRef(0);
  const keys = stops.map((s) => s.key).join("|");
  const active = on && stops.length >= 2;

  // Show while the list fills the screen; light the letter whose section is at the top.
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = list.current;
      if (!el) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      setShown(r.top < vh * 0.42 && r.bottom > vh * 0.62);
      if (scrubbing.current) return;
      const line = vh * 0.3;
      let now: string | null = null;
      for (const k of keys.split("|")) {
        const t = target(k);
        if (!t) continue;
        if (t.getBoundingClientRect().top <= line) now = k;
        else break;
      }
      setCur(now);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [on, keys, target, list, setCur]);

  // The track lets the page pan (touch-action: pan-y) until a scrub has begun; from then on its touchmoves are
  // cancelled, so the page stays put under the finger. (React's touch listeners are passive, hence this one.)
  useEffect(() => {
    const el = track.current;
    if (!active || !el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (scrubbing.current && e.cancelable) e.preventDefault();
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [active]);
  useEffect(
    () => () => {
      window.clearTimeout(fade.current);
      window.clearTimeout(pending.current?.timer);
    },
    [],
  );

  if (!active) return null;

  const stopAt = (clientY: number) => {
    const r = track.current?.getBoundingClientRect();
    if (!r || r.height === 0) return undefined;
    const i = Math.floor(((clientY - r.top) / r.height) * stops.length);
    return stops[Math.min(stops.length - 1, Math.max(0, i))];
  };
  /** The letter under the finger: show it in the bubble and, if it is a new one for this touch, go to its section. */
  const land = (clientY: number) => {
    const s = stopAt(clientY);
    const tr = track.current?.getBoundingClientRect();
    if (!s || !tr) return;
    // centred on the finger, but never up under the bars nor down past the rail
    setBubble({ key: s.key, y: Math.min(tr.bottom - 30, Math.max(tr.top + 46, clientY)) });
    if (last.current === s.key) return;
    last.current = s.key;
    const t = target(s.key);
    if (!t) return;
    // a tick for each new letter the reader lands on (not for the one already lit)
    if (lit.current !== s.key) tick();
    setCur(s.key);
    jumpTo(t, "auto");
  };
  const begin = (clientY: number) => {
    pending.current = null;
    scrubbing.current = true;
    last.current = null;
    window.clearTimeout(fade.current);
    holdChrome(100000);
    land(clientY);
  };
  const end = () => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    holdUntil = 0;
    holdChrome(400);
    fade.current = window.setTimeout(() => setBubble(null), 520);
  };
  const settle = () => {
    const p = pending.current;
    if (!p) return;
    window.clearTimeout(p.timer);
    pending.current = null;
  };
  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !e.isPrimary || scrubbing.current) return;
    settle();
    if (e.pointerType === "mouse") {
      // a mouse never scrolls by dragging: scrub at once (and select no text on the way)
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      begin(e.clientY);
      return;
    }
    const { pointerId: id, clientX: x0, clientY: y0 } = e;
    const timer = window.setTimeout(() => {
      const p = pending.current;
      if (p && p.id === id) begin(p.y);
    }, SCRUB_WAIT);
    pending.current = { id, t0: e.timeStamp, x0, y0, y: y0, timer };
  };
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pending.current;
    if (p && p.id === e.pointerId) {
      p.y = e.clientY;
      // a quick first move: the reader is scrolling (the browser pans and cancels this pointer)
      if (Math.max(Math.abs(e.clientX - p.x0), Math.abs(e.clientY - p.y0)) >= SCRUB_SLOP && e.timeStamp - p.t0 < SCRUB_WAIT) settle();
      return;
    }
    if (scrubbing.current) land(e.clientY);
  };
  const up = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pending.current;
    if (p && p.id === e.pointerId) {
      // a tap that didn't move: its letter
      settle();
      begin(p.y);
    }
    end();
  };
  const cancel = () => {
    settle();
    end();
  };

  const b = bubble ? stops.find((s) => s.key === bubble.key) : undefined;
  return (
    <div className={`lib-rail ${shown || bubble ? "shown" : ""} ${bubble ? "scrubbing" : ""}`} aria-hidden>
      <div className="lib-rail-track" ref={track} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onLostPointerCapture={end}>
        {stops.map((s) => (
          <span key={s.key} className={`lib-rail-l serif ${cur === s.key ? "on" : ""}`}>
            {s.label}
          </span>
        ))}
      </div>
      <AnimatePresence>
        {b && bubble && (
          <motion.div
            key="bubble"
            className="lib-rail-bubble"
            style={{ top: bubble.y }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, x: 8 }}
            transition={reduce ? { duration: 0.12 } : { type: "spring", stiffness: 600, damping: 32 }}
          >
            <span className="lib-rail-big serif">{b.label}</span>
            <span className="lib-rail-n mono">
              {b.count} {b.count === 1 ? unit[0] : unit[1]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Letter buttons above an alphabetical list: every letter on wide screens (the missing ones disabled), only the
    letters in use on narrow ones. A letter scrolls to its section and takes focus there, so the next Tab goes on
    into its entries. */
export function LetterNav({ letters, live, target, label, describe }: { letters: string[]; live: Set<string>; target: (L: string) => HTMLElement | null; label: string; describe: (L: string) => string }) {
  return (
    <nav className="lx-az" aria-label={label}>
      {letters.map((L) => (
        <button
          key={L}
          type="button"
          className="lx-letter serif"
          disabled={!live.has(L)}
          onClick={() => {
            const el = target(L);
            if (!el) return;
            jumpTo(el);
            focusHeading(el.matches("h2, h3") ? el : el.querySelector<HTMLElement>("h2, h3"));
          }}
          aria-label={describe(L)}
        >
          {L}
        </button>
      ))}
    </nav>
  );
}

/** Header shared by every Library view: H1 (focused by the shell), dek, meta. The tab row comes before it, as the
    view's first child, so it can stick for the length of the view. */
export function LibHead({
  title,
  dek,
  meta,
  className = "",
  children,
}: {
  current?: LibView;
  title: ReactNode;
  dek?: ReactNode;
  meta?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={`lib-head ${className}`}>
      <div className="lib-head-main">
        <h1 className="lib-h1 display" tabIndex={-1}>
          {title}
        </h1>
        {(dek || meta) && (
          <div className="lib-head-side">
            {dek && <p className="lib-dek">{dek}</p>}
            {meta && <p className="lib-meta mono">{meta}</p>}
          </div>
        )}
      </div>
      {children}
    </header>
  );
}

/** A move the reader called carries their call ("You said it fails"), the same words as the chamber: nobody may have
    answered a move they rejected. Everything else is computed on the calls. */
export function statusWord(l: "in" | "out" | "undec", call?: "holds" | "fails"): string {
  if (call) return `You said it ${call}`;
  return l === "in" ? "Stands" : l === "out" ? "Answered" : "Open";
}

/** A move as a chip: status glyph + address + status word + label → the move in its chamber.
    `plain` (the Glossary and People): the place in words ("Part 2 · Round 6") instead of the dotted address, no
    visible status word (the glyph shows it; screen readers still hear it), and a label that wraps to two lines.
    The dotted address stays in the tooltip. */
export function NodeChip({ id, className = "", plain = false }: { id: string; className?: string; plain?: boolean }) {
  const { ix, labelOf, judgments, toPlain } = useAtlas();
  const info = ix.nodes.get(id);
  if (!info) return null;
  const side = info.node.side;
  const l = labelOf(id);
  const label = toPlain(info.node.label) || "(untitled move)";
  const addr = address(ix, id);
  const call = judgments[id];
  const status = statusWord(l, call);
  return (
    <a
      className={`lib-node s-${side} st-${l} ${plain ? "lib-node-plain" : ""} ${className}`}
      href={formatRoute({ view: "objection", o: info.objection, node: id })}
      title={`${addr} · ${SIDE_WORD[side]} · ${status} · ${label}`}
      data-node={id}
    >
      <Glyph side={side} label={shownLabel(l, call)} size={11} />
      <span className="lib-node-addr mono">
        <span aria-hidden>{plain ? placeLabel(ix, id) : addr}</span>
        <span className="sr-only">{spellAddress(ix, id)}</span>
        {plain ? (
          <span className="sr-only">, {status}</span>
        ) : (
          <span className={`lib-node-st st-${l} ${call ? "called" : ""}`}>
            <span aria-hidden> · </span>
            <span className="sr-only">, </span>
            {status}
          </span>
        )}
      </span>
      <span className={`lib-node-lab ${answeredMark(l, call) ? "lab-out" : ""}`}>
        <span className="sr-only">: </span>
        {label}
      </span>
      <span className="sr-only">, {SIDE_WORD[side]}</span>
    </a>
  );
}

/** Group node ids by objection, in the disputation's order and each tree's depth-first order. */
export function useByObjection(ids: string[]) {
  const { d, ix } = useAtlas();
  return useMemo(() => {
    const set = new Set(ids);
    return d.objections
      .map((o) => ({ o, ids: (ix.byObjection.get(o.id) ?? []).filter((id) => set.has(id)) }))
      .filter((g) => g.ids.length > 0);
  }, [d, ix, ids]);
}

/** "Used in / appears in" list: chips grouped by objection (optionally capped, with "+ N more"). */
export function Appearances({ ids, limit, plain = false }: { ids: string[]; limit?: number; plain?: boolean }) {
  const groups = useByObjection(ids);
  const [all, setAll] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const focusAt = useRef<number | null>(null);
  const cap = all || !limit ? Infinity : limit;
  const shown: { key: ObjectionId; numeral: string; name: string; ids: string[] }[] = [];
  let left = cap;
  for (const g of groups) {
    if (left <= 0) break;
    const take = g.ids.slice(0, left);
    left -= take.length;
    shown.push({ key: g.o.id, numeral: g.o.numeral, name: g.o.short || g.o.title, ids: take });
  }
  const count = shown.reduce((s, g) => s + g.ids.length, 0);
  const hidden = ids.length - count;

  // "+ N more" unmounts itself: hand focus to the first chip it revealed.
  useEffect(() => {
    if (focusAt.current === null) return;
    const chips = box.current?.querySelectorAll<HTMLElement>(".lib-node");
    chips?.[focusAt.current]?.focus();
    focusAt.current = null;
  }, [all]);

  return (
    <div className="lib-apps" ref={box}>
      {shown.map((g) => (
        <div key={g.key} className="lib-apps-group">
          <p className="lib-apps-o mono">
            <span className="lib-apps-num serif">{g.numeral}</span>
            {g.name}
          </p>
          <ul className="lib-chips">
            {g.ids.map((id) => (
              <li key={id}>
                <NodeChip id={id} plain={plain} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          className="lib-more mono"
          onClick={() => {
            focusAt.current = count;
            setAll(true);
          }}
        >
          + {hidden} more
        </button>
      )}
    </div>
  );
}

/** The glyph key, so a glyph is never far from its side word. */
export function GlyphKey({ sides = ["skeptic", "theist", "spinoza"], context = false }: { sides?: Side[]; context?: boolean }) {
  return (
    <span className="lib-key mono">
      {sides.map((s) => (
        <span key={s} className={`lib-key-i s-${s}`}>
          <Glyph side={s} size={9} />
          {SIDE_WORD[s]}
        </span>
      ))}
      {context && (
        <span className="lib-key-i s-neutral">
          <svg className="glyph-svg" width={9} height={9} viewBox="0 0 9 9" aria-hidden>
            <rect x={1.5} y={1.5} width={6} height={6} />
          </svg>
          Background
        </span>
      )}
    </span>
  );
}

/** Does a quotation's speaker (e.g. "Spinoza", "Plato (Socrates speaking)", "Augustine") name this person?
    Speakers given with a comma ("Philo, in David Hume's Dialogues") are characters or reports, so they never match. */
export function spokenBy(who: string | undefined, name: string): boolean {
  if (!who) return false;
  const w = fold(who).trim();
  const n = fold(name).trim();
  // "Spinoza" for Baruch Spinoza, "Augustine" for Augustine of Hippo (but not "Paul" for Paul K. Moser)
  if (w === n || n.endsWith(` ${w}`) || n.startsWith(`${w} of `) || n.startsWith(`${w} the `) || w.endsWith(` ${n}`)) return true;
  if (/,|&|\band\b/.test(w)) return false;
  const last = n.split(" ").pop() ?? n;
  return w.split(/[\s()]+/).includes(last);
}

/** A quotation in the page's house style: serif italic, with the speaker and citation in mono. */
export function LibQuote({ q, hideWho = false, className = "" }: { q?: Quote; hideWho?: boolean; className?: string }) {
  if (!q || !q.text) return null;
  const who = hideWho ? "" : q.who;
  return (
    <figure className={`lib-quote ${className}`}>
      <blockquote>
        <p>{nestQuotes(q.text)}</p>
      </blockquote>
      {(who || q.cite) && (
        <figcaption>
          {who && <span className="lib-quote-who">{who}</span>}
          {q.cite && <span className="lib-quote-cite">{q.cite}</span>}
        </figcaption>
      )}
    </figure>
  );
}

const noop = () => {};

/** A mini map (the Rose) with some moves lit, to show where something appears. Decorative, because the chips beside it carry the facts. */
export function FootRose({ ids, size = 132, caption }: { ids: string[]; size?: number; caption?: ReactNode }) {
  const fp = useMemo(() => new Set(ids), [ids]);
  return (
    <figure className="lib-foot" style={{ width: size }}>
      <div className="lib-foot-art" aria-hidden>
        <Rose mini verdicts={false} build={false} caption={false} footprint={fp} onEnter={noop} />
      </div>
      {caption && <figcaption className="lib-foot-cap mono">{caption}</figcaption>}
    </figure>
  );
}

/** "Where it appears": a heading + glyph key, a footprint Rose, and the chips grouped by objection. */
export function FootprintBlock({
  ids,
  title,
  caption,
  limit,
  roseSize = 112,
  plain = false,
}: {
  ids: string[];
  title: ReactNode;
  caption?: ReactNode;
  limit?: number;
  roseSize?: number;
  /** Chips show the place in words, without status words (see NodeChip). */
  plain?: boolean;
}) {
  return (
    <div className="lib-fp">
      <div className="lib-fp-grid">
        <div className="lib-fp-k">
          <p className="mono lib-k lib-fp-title" tabIndex={-1}>
            {title}
          </p>
          <GlyphKey />
          {caption && (
            <p className="lib-fp-cap mono">
              <span className="lib-fp-lit" aria-hidden />
              {caption}
            </p>
          )}
        </div>
        <FootRose ids={ids} size={roseSize} />
        <Appearances ids={ids} limit={limit} plain={plain} />
      </div>
    </div>
  );
}

/** What an empty Library view offers instead: the views that do have something in them. */
export function LibEmpty({ title, text, current }: { title: string; text: string; current: LibView }) {
  const { d } = useAtlas();
  const alt: { view: LibView; word: string }[] = [
    { view: "outline", word: "Read the outline" },
    ...(d.terms.length && current !== "lexicon" ? [{ view: "lexicon" as const, word: "Go to the glossary" }] : []),
    ...(d.thinkers.length && current !== "cast" ? [{ view: "cast" as const, word: "See the people" }] : []),
    ...(d.moments.length && current !== "timeline" ? [{ view: "timeline" as const, word: "Go to the timeline" }] : []),
  ];
  return (
    <div className="lib-empty">
      <p className="lib-empty-t serif">{title}</p>
      <p className="lib-empty-d">{text}</p>
      <div className="lib-empty-acts">
        {alt.map((a, i) => (
          <a key={a.view} className={`btn small ${i === 0 ? "" : "ghost"}`} href={formatRoute({ view: a.view })}>
            {a.word} →
          </a>
        ))}
        <a className="btn small ghost" href={formatRoute({ view: "home" })}>
          Back to the map
        </a>
      </div>
    </div>
  );
}

/* ======================================================================
   The Outline view
   ====================================================================== */

const OBJ_STATUS: Record<"in" | "out" | "undec", string> = { in: "Stands", out: "Answered", undec: "Open" };

/** An address to explain the numbering with: the first reply to part 2 (or else part 1) of the first objection that has one. */
function exampleAddress(d: Disputation) {
  for (const p of [1, 0]) for (const o of d.objections) if (o.prongs[p]?.children?.length) return { addr: `${o.numeral}·${p + 1}.1`, part: p + 1, numeral: o.numeral };
  return undefined;
}

export default function Outline() {
  const { d, ix, labelOf, labels, judgments } = useAtlas();
  const [gists, setGists] = useState(true);
  const [quotes, setQuotes] = useState(true);
  const moves = ix.nodes.size;
  const called = Object.keys(judgments).filter((id) => ix.nodes.has(id)).length;
  const barRef = useRef<HTMLDivElement>(null);
  const eg = exampleAddress(d);
  const target = useCallback((id: string) => document.getElementById(`ol-${id}`), []);
  const toc = d.objections.map((o) => {
    const l = labels.objection.get(o.id) ?? "undec";
    const short = o.short || o.title;
    return {
      id: o.id as ObjectionId,
      aria: `Objection ${o.numeral}, ${short}, ${OBJ_STATUS[l]}`,
      title: `${short} · ${OBJ_STATUS[l]}`,
      content: (
        <>
          <StatusPip label={l} size={9} />
          <span className="serif ol-toc-num">{o.numeral}</span>
          <span className="ol-toc-word mono">{short}</span>
        </>
      ),
    };
  });
  const toTop = () => {
    const bar = barRef.current;
    if (!bar) return;
    // measure from the header above the bar (the bar itself may be stuck under the top bar)
    const head = bar.previousElementSibling;
    const y = head ? window.scrollY + head.getBoundingClientRect().bottom - 160 : 0;
    window.scrollTo({ top: Math.max(0, y), behavior: scrollBehavior() });
    bar.querySelector<HTMLElement>(".ol-toc-btn")?.focus({ preventScroll: true });
  };

  return (
    <div className="lib lib-outline">
      <LibTabs current="outline" />
      <LibHead
        current="outline"
        title="Outline"
        dek={
          <>
            Every move is here in one list, each reply indented under the claim it answers.
            {eg && (
              <>
                {" "}
                A move’s number gives its place, so <span className="mono lib-dek-addr">{eg.addr}</span> is the first reply to part {eg.part} of Objection {eg.numeral}.
              </>
            )}
          </>
        }
        meta={
          <>
            {d.objections.length} objections · {moves} moves
            {called > 0 ? ` · you’ve marked ${called}` : ""}
          </>
        }
      >
        <p className="ol-key">
          <GlyphKey />
        </p>
      </LibHead>

      <div className="ol-bar" ref={barRef}>
        <JumpRow className="ol-toc" chipClass="ol-toc-btn" label="Jump to an objection" items={toc} target={target} />
        <div className="ol-tools">
          <button type="button" className="lib-toggle mono" aria-pressed={gists} onClick={() => setGists((g) => !g)}>
            <span className="lib-toggle-box" aria-hidden />
            Plain summaries
          </button>
          <button type="button" className="lib-toggle mono" aria-pressed={quotes} onClick={() => setQuotes((x) => !x)}>
            <span className="lib-toggle-box" aria-hidden />
            Quotations
          </button>
        </div>
      </div>

      <OutlineList
        d={d}
        labelOf={labelOf}
        objectionLabelOf={(o) => labels.objection.get(o) ?? "undec"}
        judgments={judgments}
        nodeHref={(id, o) => formatRoute({ view: "objection", o, node: id })}
        objectionHref={(o) => formatRoute({ view: "objection", o })}
        gists={gists}
        quotes={quotes}
        sectionEnd={() => (
          <button type="button" className="ol-top mono" onClick={toTop}>
            <span aria-hidden>↑</span> Back to top
          </button>
        )}
      />
    </div>
  );
}
