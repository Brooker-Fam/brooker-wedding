"use client";

/* "Peek": small floating cards for glossary terms and people.
   Anchored to the clicked element on wide screens; a bottom sheet on phones.
   One peek at a time; Escape, ×, an outside click, or scrolling the page closes it
   (scrolling inside the card does not, nor does a page scroll while a keyboard
   user is working inside it).
   The sheet/card choice is made on the first render (a peek only ever mounts
   after a click, so there is no server render to match): deciding it later
   left the phone sheet stuck at the card's starting opacity of 0, invisible
   but still taking taps.
   Keyboard: opening moves focus to the card's title, Tab cycles within the card,
   and every way of closing returns focus to the control that opened it, which
   carries aria-expanded while its card is open. */

import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "framer-motion";
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
  type ReactNode,
} from "react";
import { useAtlas } from "./context";
import { Rich } from "./markup";
import { ContextLink } from "./views/OutlineList";

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

/* The phone sheet that last published --peek-h: a sheet still sliding out must not clear the
   height of the one that replaced it. */
let peekHOwner: object | null = null;

function PeekCard({ target, onClose }: { target: OpenPeek; onClose: (refocus?: boolean) => void }) {
  const { ix, go, thinkerName, termName, openNode, route } = useAtlas();
  const ref = useRef<HTMLDivElement>(null);
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

  // Focus the title (without scrolling anything) so the next Tab lands on the card's actions.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>(".peek-title")?.focus({ preventScroll: true });
  }, []);

  // A phone sheet publishes its height, so a toast can sit above it instead of on top of it.
  useLayoutEffect(() => {
    if (!sheet || !ref.current) return;
    const el = ref.current;
    const root = document.documentElement;
    const me = {};
    peekHOwner = me;
    const set = () => {
      if (peekHOwner === me) root.style.setProperty("--peek-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (peekHOwner !== me) return;
      peekHOwner = null;
      root.style.removeProperty("--peek-h");
    };
  }, [sheet]);

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

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      className={`peek${sheet ? " peek-sheet" : ""}`}
      onKeyDown={onKeyDown}
      style={pos && !sheet ? { left: pos.left, top: pos.top } : undefined}
      initial={reduce ? { opacity: 0 } : sheet ? { opacity: 1, y: "100%" } : { opacity: 0, y: 6, scale: 0.98 }}
      animate={reduce ? { opacity: 1 } : sheet ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : sheet ? { opacity: 1, y: "100%" } : { opacity: 0, y: 4, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      {sheet && <div className="sheet-grip" aria-hidden />}
      <button type="button" className="peek-close" onClick={() => onClose()} aria-label={`Close ${closeName}`}>
        ×
      </button>
      {body}
    </motion.div>
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
