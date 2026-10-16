"use client";

/* "Peek": small floating cards for glossary terms and people.
   Anchored to the clicked element on wide screens; a bottom sheet on phones.
   One peek at a time; Escape, ×, an outside click (on phones, the scrim), or scrolling
   the page closes it (scrolling inside the card does not, nor does a page scroll while
   a keyboard user is working inside it). The phone sheet can also be dragged down to
   close: by its grip, or from anywhere on it while its text is scrolled to the top.
   The sheet/card choice is made on the first render (a peek only ever mounts
   after a click, so there is no server render to match): deciding it later
   left the phone sheet stuck at the card's starting opacity of 0, invisible
   but still taking taps.
   Keyboard: opening moves focus to the card's title, Tab cycles within the card,
   and every way of closing returns focus to the control that opened it, which
   carries aria-expanded while its card is open.
   This file also holds the two helpers every bottom sheet uses (the peek and the
   Shell's phone menu): useSheetPresence and useSheetDrag. */

import { animate, AnimatePresence, motion, useIsPresent, useMotionValue, useReducedMotion, type MotionValue } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { useAtlas } from "./context";
import { Rich } from "./markup";
import { ContextLink } from "./views/OutlineList";

/* ------------------------------------------------------------------ */
/* Bottom sheets: shared by the phone peek and the phone menu            */
/* ------------------------------------------------------------------ */

/* While a sheet is open, <html> carries data-atl-sheet="open" (the dock tucks away, toasts
   rise above the sheet) and --atl-sheet-h holds the open sheet's height (--peek-h too, its
   older name). Counted, so a sheet still sliding out never clears the flag of one that has
   just opened; the height belongs to whichever sheet opened last. */
let sheetCount = 0;
let sheetHOwner: object | null = null;

/** Mark a bottom sheet as open while `active` (pass false once it starts to leave). */
export function useSheetPresence(ref: RefObject<HTMLElement | null>, active: boolean) {
  useLayoutEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const el = ref.current;
    const me = {};
    sheetCount += 1;
    sheetHOwner = me;
    root.setAttribute("data-atl-sheet", "open");
    const set = () => {
      if (sheetHOwner !== me || !el) return;
      const h = `${Math.round(el.getBoundingClientRect().height)}px`;
      root.style.setProperty("--atl-sheet-h", h);
      root.style.setProperty("--peek-h", h);
    };
    set();
    const ro = el ? new ResizeObserver(set) : null;
    if (el) ro?.observe(el);
    return () => {
      ro?.disconnect();
      sheetCount = Math.max(0, sheetCount - 1);
      if (!sheetCount) root.removeAttribute("data-atl-sheet");
      if (sheetHOwner === me) {
        sheetHOwner = null;
        root.style.removeProperty("--atl-sheet-h");
        root.style.removeProperty("--peek-h");
      }
    };
  }, [ref, active]);
}

const DISMISS_PX = 80;
/** px per ms: a downward flick at least this fast closes the sheet whatever the distance. */
const FLICK = 0.5;

/** Recent drag samples, for the release velocity (the last ~100ms of movement). */
function tracker() {
  let pts: { t: number; y: number }[] = [];
  return {
    reset(t: number) {
      pts = [{ t, y: 0 }];
    },
    add(t: number, y: number) {
      pts.push({ t, y });
      while (pts.length > 2 && t - pts[0].t > 100) pts.shift();
    },
    velocity() {
      if (pts.length < 2) return 0;
      const a = pts[0];
      const b = pts[pts.length - 1];
      return b.t > a.t ? (b.y - a.y) / (b.t - a.t) : 0;
    },
    last() {
      return pts.length ? pts[pts.length - 1].y : 0;
    },
  };
}

/** Drag a bottom sheet down to close it. Returns the grip's pointerdown handler (any pointer;
    the grip has touch-action: none). On touch the sheet's scrolling body also pulls it down,
    but only when the body is already at its top and the finger moves down: everywhere else
    the body scrolls as usual, and its own scrolling never closes the sheet. Released past
    80px, or flicked down, the sheet closes; otherwise it springs back. One snap point. */
export function useSheetDrag(y: MotionValue<number>, onDismiss: () => void, body: RefObject<HTMLElement | null>, enabled: boolean) {
  const reduce = useReducedMotion();
  const dismiss = useRef(onDismiss);
  useEffect(() => {
    dismiss.current = onDismiss;
  }, [onDismiss]);

  const settle = useCallback(
    (dy: number, v: number) => {
      if (dy > DISMISS_PX || (v > FLICK && dy > 12)) dismiss.current();
      else if (reduce) y.set(0);
      else animate(y, 0, { type: "spring", stiffness: 560, damping: 42 });
    },
    [y, reduce],
  );

  // Touch on the body: pull down from the top.
  useEffect(() => {
    const el = body.current;
    if (!el || !enabled) return;
    const tr = tracker();
    let x0 = 0;
    let y0 = 0;
    let atTop = false;
    let decided = false;
    let pulling = false;
    const start = (e: TouchEvent) => {
      decided = e.touches.length !== 1;
      pulling = false;
      if (decided) return;
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      atTop = el.scrollTop <= 0;
    };
    const move = (e: TouchEvent) => {
      if (decided && !pulling) return;
      const t = e.touches[0];
      if (!t) return;
      const dy = t.clientY - y0;
      const dx = t.clientX - x0;
      if (!decided) {
        // Nothing above to scroll to: keep the browser from claiming a downward drag.
        if (atTop && dy > 0 && e.cancelable) e.preventDefault();
        if (Math.abs(dy) < 8 && Math.abs(dx) < 8) return;
        decided = true;
        pulling = atTop && el.scrollTop <= 0 && dy > 0 && Math.abs(dy) > Math.abs(dx);
        if (!pulling) return;
        tr.reset(e.timeStamp);
      }
      if (e.cancelable) e.preventDefault();
      // The sheet follows the finger's whole travel (the few px of slop included).
      const d = Math.max(0, t.clientY - y0);
      y.set(d);
      tr.add(e.timeStamp, d);
    };
    const end = () => {
      if (!pulling) return;
      pulling = false;
      settle(tr.last(), tr.velocity());
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, [body, enabled, settle, y]);

  // Any pointer on the grip.
  return useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || (e.pointerType === "mouse" && e.button !== 0)) return;
      const grip = e.currentTarget;
      const id = e.pointerId;
      try {
        grip.setPointerCapture(id);
      } catch {
        /* the pointer is already gone */
      }
      const tr = tracker();
      tr.reset(e.timeStamp);
      const y0 = e.clientY;
      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== id) return;
        const raw = ev.clientY - y0;
        // Upward: a little give, then it stops (the sheet is already fully open).
        const d = raw < 0 ? Math.max(-14, raw / 5) : raw;
        y.set(d);
        tr.add(ev.timeStamp, d);
      };
      const up = (ev: PointerEvent) => {
        if (ev.pointerId !== id) return;
        grip.removeEventListener("pointermove", move);
        grip.removeEventListener("pointerup", up);
        grip.removeEventListener("pointercancel", up);
        settle(Math.max(0, tr.last()), tr.velocity());
      };
      grip.addEventListener("pointermove", move);
      grip.addEventListener("pointerup", up);
      grip.addEventListener("pointercancel", up);
    },
    [enabled, settle, y],
  );
}

type PeekTarget = { kind: "term" | "thinker"; id: string; rect: DOMRect };
/** An open card: its target plus a count of opens, so reopening the same card while the last
    one is still leaving mounts a fresh card (which moves focus to its title again). */
type OpenPeek = PeekTarget & { n: number; from?: string };

const PeekCtx = createContext<(t: PeekTarget | null) => void>(() => {});

export function usePeek() {
  return useContext(PeekCtx);
}

/* Who cites a person, worked out from the moves that name them. A thinker's own
   `side` is not a record of this (so the card is drawn neutral): Aquinas is cited by
   both sides, and several Christians are cited only by the Objector. */
function citedBy(sides: Set<string | undefined>): string {
  if (sides.has("skeptic") && sides.has("theist")) return "Used by both sides";
  if (sides.has("skeptic")) return "Used by the Objector";
  if (sides.has("theist")) return "Used by the Defender";
  if (sides.has("spinoza")) return "Used where Spinoza speaks";
  return "";
}

const SHEET_MAX = 640;

const FOCUSABLE = "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])";

/** The control that opened a peek: the focused element, or failing that (Safari doesn't focus
    buttons on click) whatever control sits at the centre of the clicked rect. */
function findTrigger(rect: DOMRect): HTMLElement | null {
  const a = document.activeElement;
  if (a instanceof HTMLElement && a !== document.body && a.closest(".atl") && !a.closest(".peek")) return a;
  const el = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  return (el?.closest("button, a[href], [role='button']") as HTMLElement | null) ?? null;
}

export function PeekProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<OpenPeek | null>(null);
  const opens = useRef(0);
  const trigger = useRef<{ el: HTMLElement; expanded: string | null } | null>(null);

  const release = useCallback((refocus: boolean) => {
    const t = trigger.current;
    trigger.current = null;
    if (!t) return;
    if (t.expanded === null) t.el.removeAttribute("aria-expanded");
    else t.el.setAttribute("aria-expanded", t.expanded);
    if (refocus && t.el.isConnected) t.el.focus({ preventScroll: true });
  }, []);

  const open = useCallback(
    (t: PeekTarget | null) => {
      release(false);
      let from: string | undefined;
      if (t) {
        const el = findTrigger(t.rect);
        if (el) {
          trigger.current = { el, expanded: el.getAttribute("aria-expanded") };
          el.setAttribute("aria-expanded", "true");
          // The move the reader opened it from, if it came from inside one.
          from = el.closest("[data-turn]")?.getAttribute("data-turn") ?? undefined;
        }
      }
      setTarget(t ? { ...t, n: ++opens.current, from } : null);
    },
    [release],
  );
  const close = useCallback(
    (refocus = true) => {
      setTarget(null);
      release(refocus);
    },
    [release],
  );

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, close]);

  return (
    <PeekCtx.Provider value={open}>
      {children}
      <AnimatePresence>{target && <PeekCard key={`${target.kind}:${target.id}:${target.n}`} target={target} onClose={close} />}</AnimatePresence>
    </PeekCtx.Provider>
  );
}

function PeekCard({ target, onClose }: { target: OpenPeek; onClose: (refocus?: boolean) => void }) {
  const { ix, go, thinkerName, termName, openNode, route } = useAtlas();
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // A card on its way out (AnimatePresence keeps it for the exit) no longer closes on outside taps.
  const present = useIsPresent();
  const presentRef = useRef(present);
  useEffect(() => {
    presentRef.current = present;
  }, [present]);
  // The move being read (the one the card was opened from, and the chamber's open move):
  // "Used in" / "Named in" never just reopens it.
  const routeNode = route.view === "objection" ? route.node : undefined;
  const here = useMemo(() => [target.from, routeNode].filter((x): x is string => !!x), [target.from, routeNode]);
  const [sheet] = useState(() => typeof window !== "undefined" && window.innerWidth < SHEET_MAX);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const titleId = useId();

  // The phone sheet: flagged open while it shows (its height lets a toast sit above it), and
  // draggable down to close.
  useSheetPresence(ref, sheet && present);
  const sheetY = useMotionValue(0);
  const dismiss = useCallback(() => onClose(), [onClose]);
  const onGripDown = useSheetDrag(sheetY, dismiss, bodyRef, sheet && present);

  // Focus the title (without scrolling anything) so the next Tab lands on the card's actions.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>(".peek-title")?.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    if (sheet) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = 340;
    const h = ref.current?.offsetHeight ?? 220;
    const r = target.rect;
    let left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), vw - w - 12);
    let top = r.bottom + 10;
    if (top + h > vh - 12) top = Math.max(12, r.top - h - 10);
    if (!Number.isFinite(left)) left = 12;
    setPos({ left, top });
  }, [target, sheet]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!presentRef.current) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onScroll = (e: Event) => {
      if (!presentRef.current) return;
      const el = ref.current;
      if (el) {
        // The card's own overflow scroll is reading, not leaving.
        if (el.contains(e.target as Node)) return;
        // Nor is a page scroll while a keyboard user works inside the card.
        const a = document.activeElement;
        if (a && el.contains(a) && keyboardFocus(a)) return;
      }
      onClose();
    };
    const t = setTimeout(() => {
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    }, 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [onClose]);

  const body = useMemo(() => {
    if (target.kind === "term") {
      const t = ix.terms.get(target.id);
      const uses = ix.termRefs.get(target.id) ?? [];
      const usesGo = movesLink(uses, here, () => go({ view: "lexicon", term: target.id }), openNode);
      return (
        <>
          <p className="eyebrow">Glossary</p>
          <h4 className="peek-title serif" id={titleId} tabIndex={-1}>
            {t?.term ?? termName(target.id)}
          </h4>
          <p className="peek-text">{t ? <Rich text={t.def} r={{ thinkerName, termName }} /> : "No definition yet."}</p>
          <div className="peek-actions">
            <button className="btn small" onClick={() => { onClose(); go({ view: "lexicon", term: target.id }); }}>
              Open in glossary
            </button>
            {usesGo && (
              <button className="btn small ghost" onClick={() => { onClose(); usesGo(); }}>
                Used in {uses.length} {uses.length === 1 ? "move" : "moves"} <span aria-hidden>→</span>
              </button>
            )}
          </div>
        </>
      );
    }
    const th = ix.thinkers.get(target.id);
    const refs = ix.thinkerRefs.get(target.id) ?? [];
    const refsGo = movesLink(refs, here, () => go({ view: "cast", thinker: target.id }), openNode);
    const quote = th?.quote?.text?.trim() ? th.quote : undefined;
    // "Spinoza" on a quote from Baruch Spinoza adds nothing; name the speaker only when it's someone else.
    const quoteWho = quote?.who && th && !samePerson(quote.who, th.name) ? quote.who : "";
    // Spinoza speaks for himself, so his card needs no "cited by".
    const sideWord = th?.id === "spinoza" ? "" : citedBy(new Set(refs.map((id) => ix.nodes.get(id)?.node.side)));
    return (
      <>
        <div className="peek-who s-neutral">
          <span className="monogram big">{initials(th?.name ?? target.id)}</span>
          <div>
            <h4 className="peek-title serif" id={titleId} tabIndex={-1}>
              {th?.name ?? thinkerName(target.id)}
            </h4>
            <p className="peek-meta mono">
              {th?.life}
              {th?.life && sideWord ? " · " : ""}
              {sideWord}
            </p>
          </div>
        </div>
        {th?.tradition && <p className="peek-trad">{th.tradition}</p>}
        {th?.line && (
          <p className="peek-text">
            <Rich text={th.line} r={{ thinkerName, termName }} />
          </p>
        )}
        {th?.work && <p className="peek-work mono">{th.work}</p>}
        {quote && (
          <figure className="peek-quote s-neutral">
            <blockquote className="serif">
              <p>“{quote.text}”</p>
            </blockquote>
            {(quote.cite || quoteWho || quote.url) && (
              <figcaption className="mono">
                {[quoteWho, quote.cite].filter(Boolean).join(" · ")}
                <ContextLink url={quote.url} className="peek-ctx" />
              </figcaption>
            )}
          </figure>
        )}
        <div className="peek-actions">
          <button className="btn small" onClick={() => { onClose(); go({ view: "cast", thinker: target.id }); }}>
            Open in People
          </button>
          {refsGo && (
            <button className="btn small ghost" onClick={() => { onClose(); refsGo(); }}>
              Named in {refs.length} {refs.length === 1 ? "move" : "moves"} <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </>
    );
  }, [target, ix, go, onClose, openNode, thinkerName, termName, titleId, here]);

  const closeName = (target.kind === "term" ? ix.terms.get(target.id)?.term : ix.thinkers.get(target.id)?.name) ?? "card";

  // Tab and Shift+Tab stay inside the card while it is open.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !ref.current) return;
    const els = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!els.length) return;
    const i = els.indexOf(document.activeElement as HTMLElement);
    e.preventDefault();
    const next = e.shiftKey ? (i <= 0 ? els.length - 1 : i - 1) : i < 0 || i === els.length - 1 ? 0 : i + 1;
    els[next].focus();
  };

  const card = (
    <motion.div
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      className={`peek${sheet ? " peek-sheet" : ""}`}
      onKeyDown={onKeyDown}
      style={sheet ? { y: sheetY } : pos ? { left: pos.left, top: pos.top } : undefined}
      initial={reduce ? { opacity: 0 } : sheet ? { opacity: 1, y: "100%" } : { opacity: 0, y: 6, scale: 0.98 }}
      animate={reduce ? { opacity: 1 } : sheet ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : sheet ? { opacity: 1, y: "100%" } : { opacity: 0, y: 4, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 38 }}
    >
      {sheet && (
        <div className="sheet-grab" onPointerDown={onGripDown} aria-hidden>
          <span className="sheet-grip" />
        </div>
      )}
      <button type="button" className="peek-close" onClick={() => onClose()} aria-label={`Close ${closeName}`}>
        ×
      </button>
      <div className="peek-body" ref={bodyRef}>
        {body}
      </div>
    </motion.div>
  );

  if (!sheet) return card;
  return (
    <>
      {/* Tapping the page behind the sheet closes it (the outside-press handler above); the scrim
          makes that visible and keeps the tap from reaching whatever lies underneath. */}
      <motion.div
        className="peek-scrim"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => onClose()}
      />
      {card}
    </>
  );
}

/** Where "Used in N moves" / "Named in N moves" goes: the full list (the glossary entry or the
    person's file) when there are several, else the one move, unless it is the move being read
    (then there is nowhere new to go and the button is left out). */
function movesLink(refs: string[], here: string[], toList: () => void, openNode: (id: string) => void): (() => void) | null {
  if (refs.length > 1) return toList;
  const other = refs.find((r) => !here.includes(r));
  return other ? () => openNode(other) : null;
}

/** Focus that came from the keyboard (where :focus-visible is unknown, assume it did). */
function keyboardFocus(el: Element): boolean {
  try {
    return el.matches(":focus-visible");
  } catch {
    return true;
  }
}

function samePerson(who: string, name: string) {
  const last = (x: string) => x.replace(/\(.*?\)/g, "").trim().split(/\s+/).pop()?.toLowerCase() ?? "";
  return last(who) === last(name);
}

export function initials(name: string) {
  const parts = name
    .replace(/\(.*?\)/g, "")
    .replace(/^(St\.|Saint)\s+/i, "")
    .split(/\s+/)
    .filter((p) => p && /^[A-ZÀ-Ý]/.test(p) && !/^(of|de|van|von|al-|the)$/i.test(p));
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
