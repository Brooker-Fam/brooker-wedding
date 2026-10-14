"use client";

/* The frame around every view of a Disputation: a slim sticky top bar (emblem,
   wordmark, Map · Library · Your Determination with five status pips), view
   transitions keyed by route, scroll + focus memory per history entry, and a
   shared footer. It also keeps the "where did the reader last work?" record
   (see recent.ts) that the overview's "Previously…" line reads. */

import "./shell.css";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useAtlas } from "../context";
import { Glyph } from "../primitives";
import { formatRoute, parseHash, viewKey, type Route } from "../router";
import type { Judgments } from "../semantics";
import type { Label, ObjectionId } from "../types";
import { StatusPip, YouMark } from "./marks";
import { changedElsewhere, readStoredJudgments, writeRecent } from "./recent";
import { RoseEmblem, sectorLayout } from "./Rose";

/* ------------------------------------------------------------------ */
/* Shared bits                                                          */
/* ------------------------------------------------------------------ */

const PIP_WORD: Record<Label, string> = { in: "stands", out: "answered", undec: "undecided" };

const LIBRARY = [
  { view: "timeline", label: "Timeline", note: "2,400 years, five strands" },
  { view: "cast", label: "Cast", note: "The thinkers, and where they speak" },
  { view: "lexicon", label: "Lexicon", note: "Terms of art, in plain words" },
  { view: "outline", label: "Outline", note: "The whole disputation as text" },
] as const;

type LibView = (typeof LIBRARY)[number]["view"];

const noopSubscribe = () => () => {};
/** True while hydrating the server HTML (and on the server); false for client-only renders. */
const useHydrating = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => false,
    () => true,
  );

function LibIcon({ view }: { view: LibView }) {
  const common = { width: 20, height: 20, viewBox: "0 0 20 20", "aria-hidden": true, className: "sh-icon" } as const;
  switch (view) {
    case "timeline":
      return (
        <svg {...common}>
          <path d="M2 10h16" />
          <path d="M5 7.4 7 11H3z" />
          <circle cx="10.5" cy="10" r="1.9" />
          <path d="M15.5 7.6 17.4 10l-1.9 2.4L13.6 10z" />
        </svg>
      );
    case "cast":
      return (
        <svg {...common}>
          <circle cx="7.5" cy="10" r="4.6" />
          <circle cx="13.5" cy="10" r="4.6" />
        </svg>
      );
    case "lexicon":
      return (
        <svg {...common}>
          <path d="M3 15.5 7 4.5l4 11M4.5 11.5h5" />
          <path d="M12.5 15.5h5" strokeDasharray="1 1.6" />
        </svg>
      );
    case "outline":
      return (
        <svg {...common}>
          <path d="M3 5h14M6 10h11M9 15h8" />
        </svg>
      );
  }
}

/** Five tiny status pips, I–V: ▲ ochre = stands, ● verdigris = answered, hollow = undecided. */
function Pips({ current }: { current?: ObjectionId }) {
  const { d, labels } = useAtlas();
  return (
    <span className="sh-pips">
      {d.objections.map((o) => {
        const l = labels.objection.get(o.id) ?? "undec";
        return (
          <span key={o.id} className={`sh-pip${current === o.id ? " cur" : ""}`}>
            <StatusPip label={l} />
            <span className="sr-only">{`Objection ${o.numeral}: ${PIP_WORD[l]}.`}</span>
          </span>
        );
      })}
    </span>
  );
}

function usePipTitle() {
  const { d, labels } = useAtlas();
  return d.objections.map((o) => `${o.numeral} ${PIP_WORD[labels.objection.get(o.id) ?? "undec"]}`).join(" · ");
}

/** The Rose emblem, fed primitives so it only re-renders when a status or the chamber changes. */
function Emblem({ current, size }: { current?: ObjectionId; size?: number }) {
  const { d, labels } = useAtlas();
  const sectors = useMemo(() => sectorLayout(d), [d]);
  const statuses = d.objections.map((o) => labels.objection.get(o.id) ?? "undec").join(",");
  return <RoseEmblem sectors={sectors} statuses={statuses} current={current} size={size} />;
}

function currentObjection(route: Route): ObjectionId | undefined {
  return route.view === "objection" || route.view === "walk" ? route.o : undefined;
}

function focusViewHeading(main: HTMLElement | null) {
  if (!main) return;
  const h = main.querySelector<HTMLElement>("h1");
  const target = h ?? main;
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------ */
/* Library dropdown (desktop)                                           */
/* ------------------------------------------------------------------ */

function LibraryMenu({ active }: { active: boolean }) {
  const { route } = useAtlas();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const menuId = useId();
  const hash = formatRoute(route);

  // Close when the route changes (a choice was made, or the reader went elsewhere).
  useEffect(() => setOpen(false), [hash]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = () => Array.from(list.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
  const focusItem = (i: number) => {
    const all = items();
    if (all.length) all[(i + all.length) % all.length].focus();
  };

  const onBtnKey = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };
  const onListKey = (e: ReactKeyboardEvent) => {
    const all = items();
    const i = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(all.length - 1);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="sh-lib" ref={wrap}>
      <button
        ref={btn}
        type="button"
        className={`sh-link${active ? " on" : ""}`}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onBtnKey}
      >
        Library
        <svg className={`sh-chev${open ? " up" : ""}`} width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M2 3.6 5 6.6l3-3" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            className="sh-libmenu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul ref={list} onKeyDown={onListKey}>
              {LIBRARY.map((it) => {
                const on = route.view === it.view;
                return (
                  <li key={it.view}>
                    <a href={formatRoute({ view: it.view } as Route)} className={on ? "on" : ""} aria-current={on ? "page" : undefined} onClick={() => setOpen(false)}>
                      <LibIcon view={it.view} />
                      <span className="sh-libtxt">
                        <span className="sh-libt">{it.label}</span>
                        <span className="sh-libn">{it.note}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile menu sheet                                                    */
/* ------------------------------------------------------------------ */

function MobileSheet({ id, onClose, menuBtn }: { id: string; onClose: (refocus: boolean) => void; menuBtn: HTMLButtonElement | null }) {
  const { route } = useAtlas();
  const panel = useRef<HTMLDivElement>(null);
  const title = usePipTitle();

  useEffect(() => {
    const first = panel.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    // A modal sheet: the page behind it is out of reach (screen readers' virtual cursor included).
    const behind = [document.getElementById("atl-main"), document.querySelector<HTMLElement>(".atl .sh-foot")].filter((el): el is HTMLElement => !!el);
    behind.forEach((el) => (el.inert = true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose(true);
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      // Keep focus within the menu button + the sheet while it is open.
      const els = [menuBtn, ...Array.from(panel.current.querySelectorAll<HTMLElement>("a, button"))].filter(Boolean) as HTMLElement[];
      const i = els.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? els.length - 1 : i - 1) : i === els.length - 1 ? 0 : i + 1;
      e.preventDefault();
      els[next]?.focus();
    };
    const mq = window.matchMedia("(min-width: 960px)");
    const onMq = () => mq.matches && onClose(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.style.overflow = prev;
      behind.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [onClose, menuBtn]);

  const item = (r: Route, label: string, note: string, icon: ReactNode, extra?: ReactNode) => {
    const on = route.view === r.view;
    return (
      <li key={r.view}>
        <a href={formatRoute(r)} className={`sh-sitem${on ? " on" : ""}`} aria-current={on ? "page" : undefined} onClick={() => onClose(false)}>
          <span className="sh-sicon" aria-hidden>
            {icon}
          </span>
          <span className="sh-stxt">
            <span className="sh-st">{label}</span>
            <span className="sh-sn">{note}</span>
          </span>
          {extra}
        </a>
      </li>
    );
  };

  return (
    <>
      <motion.div className="sh-scrim" onClick={() => onClose(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
      <motion.div
        ref={panel}
        id={id}
        className="sh-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav aria-label="Disputation">
          <ul className="sh-slist">{item({ view: "home" }, "Map", "The whole disputation at a glance", <Emblem current={currentObjection(route)} size={20} />)}</ul>
          <p className="sh-sgroup">Library</p>
          <ul className="sh-slist">{LIBRARY.map((it) => item({ view: it.view } as Route, it.label, it.note, <LibIcon view={it.view} />))}</ul>
          <p className="sh-sgroup">You</p>
          <ul className="sh-slist">
            {item(
              { view: "ledger" },
              "Your Determination",
              "Only what follows from your calls",
              <YouMark size={13} />,
              <span title={title}>
                <Pips current={currentObjection(route)} />
              </span>,
            )}
          </ul>
        </nav>
        <div className="sh-sout">
          <Link href="/debates">
            Thought Pages <span aria-hidden>↗</span>
          </Link>
          <Link href="/">
            brooker.family <span aria-hidden>↗</span>
          </Link>
        </div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar                                                              */
/* ------------------------------------------------------------------ */

function TopBar({ onSkip }: { onSkip: () => void }) {
  const { route } = useAtlas();
  const [menu, setMenu] = useState(false);
  const [menuBtnEl, setMenuBtnEl] = useState<HTMLButtonElement | null>(null);
  const sheetId = useId();
  const cur = currentObjection(route);
  const title = usePipTitle();
  const hash = formatRoute(route);
  const libActive = route.view === "timeline" || route.view === "cast" || route.view === "lexicon" || route.view === "outline";

  useEffect(() => setMenu(false), [hash]);

  // Already on the map: Map / the wordmark glide back to the top instead of doing nothing.
  const toMap = (e: MouseEvent<HTMLAnchorElement>) => {
    if (route.view !== "home" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  };

  const closeMenu = useCallback(
    (refocus: boolean) => {
      setMenu(false);
      if (refocus) menuBtnEl?.focus();
    },
    [menuBtnEl],
  );

  return (
    <>
      <header className="sh-bar">
        <button type="button" className="sh-skip" onClick={onSkip}>
          Skip to content
        </button>
        <div className="sh-bar-in">
          <a className="sh-brand" href="#/" aria-label="All the Way Down: the map" onClick={toMap}>
            <span className="sh-mark" aria-hidden>
              <Emblem current={cur} />
            </span>
            <span className="sh-word">All the Way Down</span>
          </a>

          <nav className="sh-nav" aria-label="Disputation">
            <a href="#/" className={`sh-link${route.view === "home" ? " on" : ""}`} aria-current={route.view === "home" ? "page" : undefined} onClick={toMap}>
              Map
            </a>
            <LibraryMenu active={libActive} />
            <a
              href="#/ledger"
              className={`sh-link sh-det${route.view === "ledger" ? " on" : ""}`}
              aria-current={route.view === "ledger" ? "page" : undefined}
              title={title}
            >
              Your Determination
              <Pips current={cur} />
            </a>
            <span className="sh-sep" aria-hidden />
            <Link href="/debates" className="sh-out">
              <span aria-hidden>←</span> Thought Pages
            </Link>
          </nav>

          <div className="sh-mob">
            <a href="#/ledger" className={`sh-pipbtn${route.view === "ledger" ? " on" : ""}`} title={title}>
              <span className="sr-only">Your Determination. </span>
              <Pips current={cur} />
            </a>
            <button
              ref={setMenuBtnEl}
              type="button"
              className={`sh-menubtn${menu ? " open" : ""}`}
              aria-expanded={menu}
              aria-controls={menu ? sheetId : undefined}
              aria-label={menu ? "Close menu" : "Menu"}
              onClick={() => setMenu((m) => !m)}
            >
              <span className="sh-burger" aria-hidden>
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>{menu && <MobileSheet key="sheet" id={sheetId} onClose={closeMenu} menuBtn={menuBtnEl} />}</AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="sh-foot">
      <div className="sh-foot-in">
        <div className="sh-foot-note">
          <ul className="sh-foot-k" aria-label="Who speaks">
            <li className="s-skeptic">
              <Glyph side="skeptic" size={11} /> Objector
            </li>
            <li className="s-theist">
              <Glyph side="theist" size={11} /> Respondent
            </li>
            <li className="s-spinoza">
              <Glyph side="spinoza" size={11} /> Spinoza
            </li>
            <li className="sh-foot-you">
              <YouMark size={11} /> You
            </li>
          </ul>
          <p className="sh-method">
            A <em>steelman</em> is the strongest version of an argument — presenting one is not endorsing it. Neither side gets the last word by default;
            nothing stands until you rule.
          </p>
        </div>
        <nav className="sh-foot-links" aria-label="Elsewhere">
          <Link href="/debates">All Thought Pages</Link>
          <Link href="/">brooker.family</Link>
          <a href="#/outline">Read as outline</a>
        </nav>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll + focus memory                                                */
/* ------------------------------------------------------------------ */

/* Each history entry remembers its scroll position and the control that left it, so Back
   from a chamber returns to the same spot on the map with focus on the same "Enter" link.
   History *state* is never written (Next's app router reloads on Back/Forward to an entry
   whose state it didn't create). Entries are keyed by the Navigation API's stable key where
   it exists; elsewhere (iOS Safari, Firefox) by the hash. */
const positions = new Map<string, { view: string; y: number }>();
const activations = new Map<string, { sel: string; index: number }>();
let lastActivationAt = -Infinity;

const FOCUSABLE = "a[href], button, [role='button'], [tabindex]:not([tabindex='-1'])";
type Focusable = Element & { focus: (o?: FocusOptions) => void };

function entryId(hash: string): { id: string; stable: boolean } {
  const nav = (window as unknown as { navigation?: { currentEntry?: { key?: string } | null } }).navigation;
  const k = nav?.currentEntry?.key;
  return k ? { id: `n:${k}`, stable: true } : { id: `h:${hash}`, stable: false };
}

/** A way to find this control again after its view re-mounts: by href, id, or position. */
function describe(target: Element, root: Element): { sel: string; index: number } | null {
  const el = target.closest(FOCUSABLE);
  if (!el || !root.contains(el)) return null;
  const href = el instanceof HTMLAnchorElement ? el.getAttribute("href") : null;
  const sel = href ? `a[href="${CSS.escape(href)}"]` : el.id ? `#${CSS.escape(el.id)}` : FOCUSABLE;
  const index = Array.from(root.querySelectorAll(sel)).indexOf(el);
  return index < 0 ? null : { sel, index };
}

function refocus(root: Element, act: { sel: string; index: number }): boolean {
  const el = root.querySelectorAll<Focusable>(act.sel)[act.index];
  if (!el || typeof el.focus !== "function") return false;
  el.focus({ preventScroll: true });
  return document.activeElement === el;
}

/* Deep links: the server can't see the hash, so it renders the overview. This runs before the
   view is parsed and hides it until the client has switched to the linked view (the Shell
   removes the attribute; a CSS failsafe reveals it after 4s regardless). It also notes a hash
   change that lands before hydration, which Next's first replaceState can revert. */
const EARLY_SCRIPT = `(function(){try{var h=location.hash;if(h&&h!=="#"&&h!=="#/")document.documentElement.setAttribute("data-atl-deep","");addEventListener("hashchange",function(){if(!window.__atlLive)window.__atlEarlyHash=location.hash})}catch(e){}})();`;

type EarlyWindow = Window & { __atlLive?: boolean; __atlEarlyHash?: string };

/* ------------------------------------------------------------------ */
/* Shell                                                                */
/* ------------------------------------------------------------------ */

export default function Shell({ children }: { children: ReactNode }) {
  const { route, d, ix, judgments } = useAtlas();
  const key = viewKey(route);
  const hash = formatRoute(route);
  const main = useRef<HTMLDivElement>(null);
  const hydrating = useHydrating();
  const reduce = useReducedMotion();

  /* --- recency: last call made, last chamber visited --- */
  const prevJudgments = useRef<Judgments | null>(null);
  useEffect(() => {
    const prev = prevJudgments.current;
    if (prev === null) {
      // Baseline = what storage holds, so the hydration catch-up (empty server snapshot →
      // stored calls) is never mistaken for a call.
      prevJudgments.current = readStoredJudgments(d.slug) ?? judgments;
      return;
    }
    prevJudgments.current = judgments;
    if (prev === judgments || changedElsewhere()) return;
    const changed = new Set<string>();
    for (const [id, v] of Object.entries(judgments)) if (prev[id] !== v) changed.add(id);
    for (const id of Object.keys(prev)) if (!(id in judgments)) changed.add(id);
    // One change = one call by the reader (bulk changes are resets or undo-alls).
    if (changed.size !== 1) return;
    const id = [...changed][0];
    const info = ix.nodes.get(id);
    if (info) writeRecent(d.slug, { judged: { o: info.objection, node: id, t: Date.now() } });
  }, [judgments, ix, d.slug]);

  const curO = currentObjection(route);
  useEffect(() => {
    if (curO) writeRecent(d.slug, { visited: { o: curO, t: Date.now() } });
  }, [curO, d.slug]);

  /* --- scroll position + activating control, per history entry --- */
  const cur = useRef<{ id: string; view: string } | null>(null);
  const restorationBefore = useRef<ScrollRestoration | null>(null);
  useEffect(() => {
    const w = window as EarlyWindow;
    w.__atlLive = true;
    // A hash change that landed before hydration and was reverted by the router's first replaceState.
    const early = w.__atlEarlyHash;
    delete w.__atlEarlyHash;
    const t = early
      ? window.setTimeout(() => {
          if (window.location.hash !== early) {
            history.replaceState(history.state, "", early);
            window.dispatchEvent(new HashChangeEvent("hashchange"));
          }
        }, 0)
      : 0;

    const onScroll = () => {
      const c = cur.current;
      if (c) positions.set(c.id, { view: c.view, y: window.scrollY });
    };
    const onActivate = (e: Event) => {
      if (e.type === "keydown" && (e as KeyboardEvent).key !== "Enter" && (e as KeyboardEvent).key !== " ") return;
      const root = main.current?.closest(".atl");
      const c = cur.current;
      if (!root || !c || !(e.target instanceof Element)) return;
      const act = describe(e.target, root);
      if (!act) return;
      activations.set(c.id, act);
      lastActivationAt = Date.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onActivate, true);
    document.addEventListener("keydown", onActivate, true);
    return () => {
      window.clearTimeout(t);
      if (restorationBefore.current !== null) history.scrollRestoration = restorationBefore.current;
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onActivate, true);
      document.removeEventListener("keydown", onActivate, true);
    };
  }, []);

  /* --- the deep-link veil comes off once the linked view is on screen --- */
  useEffect(() => {
    if (key === viewKey(parseHash(window.location.hash))) document.documentElement.removeAttribute("data-atl-deep");
  }, [key]);
  useEffect(() => () => document.documentElement.removeAttribute("data-atl-deep"), []);

  /* --- on view change: scroll (top, or the remembered spot) and move focus --- */
  const lastKey = useRef<string | null>(null);
  const initialKey = useRef<string | null>(null);
  const navigated = useRef(false);
  useLayoutEffect(() => {
    const { id, stable } = entryId(hash);
    const remembered = positions.get(id);
    cur.current = { id, view: key };

    if (initialKey.current === null) initialKey.current = viewKey(parseHash(window.location.hash));
    const prev = lastKey.current;
    lastKey.current = key;
    if (prev === null || prev === key) return;
    // The first client render shows the server's view; catching up to a deep link isn't a navigation.
    if (!navigated.current && key === initialKey.current) {
      navigated.current = true;
      return;
    }
    navigated.current = true;
    // From the first in-page navigation on, the page restores scroll itself.
    if (restorationBefore.current === null) {
      restorationBefore.current = history.scrollRestoration;
      history.scrollRestoration = "manual";
    }
    // Keyed by hash, a fresh click to a view seen before is a new visit, not a return.
    const fresh = !stable && Date.now() - lastActivationAt < 1200;
    const back = remembered && remembered.view === key && !fresh ? remembered : null;
    const top = back ? back.y : 0;
    window.scrollTo({ top, left: 0, behavior: "instant" });
    // Chromium lets an in-flight smooth scroll (say, a chamber gliding to a move) apply one
    // more frame after an instant scroll: re-assert the target for the next two frames.
    const settle = (n: number) =>
      requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top, left: 0, behavior: "instant" });
        if (n > 1) settle(n - 1);
      });
    settle(2);
    const act = back ? activations.get(id) : undefined;
    requestAnimationFrame(() => {
      const root = main.current?.closest(".atl");
      if (act && root && refocus(root, act)) return;
      focusViewHeading(main.current);
    });
    // `hash` is a dependency so in-view (node) navigations also switch the remembered entry.
  }, [key, hash]);

  const skip = useCallback(() => focusViewHeading(main.current), []);

  return (
    <MotionConfig reducedMotion="user">
      {hydrating && <script dangerouslySetInnerHTML={{ __html: EARLY_SCRIPT }} />}
      <TopBar onSkip={skip} />
      {/* not <main>: the site's root layout already provides the main landmark.
          Opacity only: a transform here would make this the containing block of the
          views' position:fixed docks for the length of the transition. No exit transition:
          the old view leaves at once, the new one fades in. */}
      <motion.div
        key={key}
        ref={main}
        id="atl-main"
        className="sh-main"
        initial={hydrating ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
      <Footer />
    </MotionConfig>
  );
}
