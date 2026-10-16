"use client";

/* The frame around every view of a Disputation: a slim sticky top bar (emblem,
   wordmark, Map · Library · Where you stand with five status pips), view
   transitions keyed by route, scroll + focus memory per history entry, the
   document title, and a shared footer. It also keeps the "where did the reader
   last work?" record (see recent.ts) that the overview's "Last time" strip reads. */

import "./shell.css";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import { useToastDismiss } from "../toast";
import type { Judgments } from "../semantics";
import type { Label, ObjectionId } from "../types";
import { StatusPip, YouMark } from "./marks";
import { changedElsewhere, readStoredJudgments, writeRecent } from "./recent";
import { RoseEmblem, sectorLayout } from "./Rose";

/* ------------------------------------------------------------------ */
/* Shared bits                                                          */
/* ------------------------------------------------------------------ */

const PIP_WORD: Record<Label, string> = { in: "stands", out: "answered", undec: "open" };

/* Visible names follow the reader's vocabulary (People, Glossary); the routes keep their old names. */
const LIBRARY = [
  { view: "timeline", label: "Timeline", note: "Who said what, and when" },
  { view: "cast", label: "People", note: "Everyone cited, with the moves they appear in" },
  { view: "lexicon", label: "Glossary", note: "Technical terms in plain words" },
  { view: "outline", label: "Outline", note: "Every move as plain text" },
  { view: "sources", label: "Sources", note: "Every book and text cited, with links" },
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
    case "sources":
      return (
        <svg {...common}>
          <path d="M3 4.8c2.6-.9 5-.6 7 .9 2-1.5 4.4-1.8 7-.9v10.4c-2.6-.9-5-.6-7 .9-2-1.5-4.4-1.8-7-.9z" />
          <path d="M10 5.7v10.4" />
        </svg>
      );
  }
}

/** Five tiny status pips, I–V: ▲ ochre = stands, ● verdigris = answered, hollow = open. */
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

/** Scroll so the overview's map sits just under the top bar. */
function scrollToMap(animate: boolean) {
  const rose = document.querySelector<HTMLElement>(".atl .ov-rose");
  if (!rose) return null;
  const bar = document.querySelector<HTMLElement>(".atl .sh-bar")?.getBoundingClientRect().height ?? 52;
  const top = Math.max(0, Math.round(rose.getBoundingClientRect().top + window.scrollY - bar - 16));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, left: 0, behavior: animate && !reduce ? "smooth" : "instant" });
  return top;
}

const LIB_TITLE: Record<string, string> = {
  timeline: "Timeline",
  cast: "People",
  lexicon: "Glossary",
  ledger: "Where you stand",
  outline: "Outline",
  sources: "Sources",
};

function focusViewHeading(main: HTMLElement | null): HTMLElement | null {
  if (!main) return null;
  const h = main.querySelector<HTMLElement>("h1");
  const target = h ?? main;
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  return target;
}

/** The entry a route names, which focus should land on once its view has scrolled to it
    (a glossary term, a person, a timeline moment, the map). Null: the view's h1 will do. */
function landingSelector(route: Route): string | null {
  switch (route.view) {
    case "lexicon":
      return route.term ? `#${CSS.escape(`lx-${route.term}`)}` : null;
    case "cast":
      if (!route.thinker) return null;
      // Wide screens show the person's file beside the roster (Cast.tsx's own breakpoint); phones open it under the name.
      return window.matchMedia("(min-width: 980px)").matches ? `#${CSS.escape(`ca-file-${route.thinker}`)}` : `[data-tid="${CSS.escape(route.thinker)}"]`;
    case "timeline":
      if (!route.moment) return null;
      // Wide screens show the moment's card beside the chart (Timeline.tsx's breakpoint); phones open its row.
      return window.matchMedia("(min-width: 900px)").matches ? ".tl-card-t" : `[data-mid="${CSS.escape(route.moment)}"] .tl-head`;
    case "home":
      return route.at === "map" ? ".ov-rose" : null;
    default:
      return null;
  }
}

/** Focus a landing target without scrolling. Library files need no edits: an element that
    isn't focusable yet becomes so here, marked so it shows no ring (it is highlighted already). */
function land(el: HTMLElement) {
  if (!el.hasAttribute("tabindex") && !el.matches("a[href], button, input, select, textarea")) {
    el.tabIndex = -1;
    el.setAttribute("data-atl-land", "");
  }
  el.focus({ preventScroll: true });
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
  const { route, d, labels } = useAtlas();
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
      els[next]?.focus({ preventScroll: true });
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
          <ul className="sh-slist">{item({ view: "home", at: "map" }, "Map", "All five objections at once", <Emblem current={currentObjection(route)} size={20} />)}</ul>
          <p className="sh-sgroup" id={`${id}-obj`}>
            Objections
          </p>
          <ul className="sh-sobj" aria-labelledby={`${id}-obj`}>
            {d.objections.map((o) => {
              const l = labels.objection.get(o.id) ?? "undec";
              const on = route.view === "objection" && route.o === o.id;
              return (
                <li key={o.id}>
                  <a
                    href={formatRoute({ view: "objection", o: o.id })}
                    className={`sh-sobj-a${on ? " on" : ""}`}
                    aria-current={on ? "page" : undefined}
                    onClick={() => onClose(false)}
                  >
                    <span className="sh-sobj-top" aria-hidden>
                      <span className="sh-sobj-n">{o.numeral}</span>
                      <StatusPip label={l} size={9} />
                    </span>
                    <span className="sh-sobj-name" aria-hidden>
                      {o.short || o.numeral}
                    </span>
                    <span className="sr-only">{`Objection ${o.numeral}${o.short ? `, ${o.short}` : ""}: ${PIP_WORD[l]}.`}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="sh-sgroup">Library</p>
          <ul className="sh-slist">{LIBRARY.map((it) => item({ view: it.view } as Route, it.label, it.note, <LibIcon view={it.view} />))}</ul>
          <p className="sh-sgroup">You</p>
          <ul className="sh-slist">
            {item(
              { view: "ledger" },
              "Where you stand",
              "Your marks, objection by objection",
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
  const { route, go } = useAtlas();
  const [menu, setMenu] = useState(false);
  const [menuBtnEl, setMenuBtnEl] = useState<HTMLButtonElement | null>(null);
  const sheetId = useId();
  const cur = currentObjection(route);
  const title = usePipTitle();
  const hash = formatRoute(route);
  const libActive = route.view === "timeline" || route.view === "cast" || route.view === "lexicon" || route.view === "outline" || route.view === "sources";

  useEffect(() => setMenu(false), [hash]);

  // Already on the overview: the wordmark glides back to the top instead of doing nothing.
  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    if (route.view !== "home" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (route.at === "map") go({ view: "home" }, { replace: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  };
  // …and Map glides to the map (also when the URL already says #/map).
  const toMap = (e: MouseEvent<HTMLAnchorElement>) => {
    if (route.view !== "home" || route.at !== "map" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    scrollToMap(true);
  };

  const closeMenu = useCallback(
    (refocus: boolean) => {
      setMenu(false);
      if (refocus) menuBtnEl?.focus({ preventScroll: true });
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
          <a className="sh-brand" href="#/" aria-label="All the Way Down: the overview" onClick={toTop}>
            <span className="sh-mark" aria-hidden>
              <Emblem current={cur} />
            </span>
            <span className="sh-word">All the Way Down</span>
          </a>

          <nav className="sh-nav" aria-label="Disputation">
            <a href="#/map" className={`sh-link${route.view === "home" ? " on" : ""}`} aria-current={route.view === "home" ? "page" : undefined} onClick={toMap}>
              Map
            </a>
            <LibraryMenu active={libActive} />
            <a
              href="#/ledger"
              className={`sh-link sh-det${route.view === "ledger" ? " on" : ""}`}
              aria-current={route.view === "ledger" ? "page" : undefined}
              title={title}
            >
              Where you stand
              <Pips current={cur} />
            </a>
            <span className="sh-sep" aria-hidden />
            <Link href="/debates" className="sh-out">
              <span aria-hidden>←</span> Thought Pages
            </Link>
          </nav>

          <div className="sh-mob">
            <a href="#/ledger" className={`sh-pipbtn${route.view === "ledger" ? " on" : ""}`} title={title}>
              <span className="sr-only">Where you stand. </span>
              <span className="sh-piplab" aria-hidden>
                <span className="sh-piplab-s">You</span>
                <span className="sh-piplab-l">Where you stand</span>
              </span>
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
          <ul className="sh-foot-k" aria-label="Who’s talking">
            <li className="s-skeptic">
              <Glyph side="skeptic" size={11} /> Objector
            </li>
            <li className="s-theist">
              <Glyph side="theist" size={11} /> Defender
            </li>
            <li className="s-spinoza">
              <Glyph side="spinoza" size={11} /> Spinoza
            </li>
            <li className="sh-foot-you">
              <YouMark size={11} /> You
            </li>
          </ul>
          <p className="sh-method">
            Each side is put as strongly as its own defenders would put it. As Mill wrote in <cite>On Liberty</cite> (1859), “He who knows
            only his own side of the case, knows little of that.”
          </p>
        </div>
        <nav className="sh-foot-links" aria-label="Elsewhere">
          <Link href="/debates">All Thought Pages</Link>
          <Link href="/">brooker.family</Link>
          <a href="#/outline">Read the outline</a>
          <a href="#/sources">Sources</a>
        </nav>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll + focus memory                                                */
/* ------------------------------------------------------------------ */

/* Each history entry remembers its scroll position and the control that left it, so Back
   from an objection returns to the same spot on the map with focus on the same "Read it" link.
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
   view is parsed and hides it until the client has switched to the linked view (the Shell, or
   a lazily loaded view once it mounts, removes the attribute; a CSS failsafe reveals it after
   8s regardless). It also notes a hash change that lands before hydration, which Next's first
   replaceState can revert, and marks html[data-atl-calls] when the reader has calls stored, so
   the overview can reserve the "Last time" strip's space before it renders. */
const earlyScript = (slug: string) =>
  `(function(){try{var h=location.hash;if(h&&h!=="#"&&h!=="#/"&&h!=="#/map")document.documentElement.setAttribute("data-atl-deep","");addEventListener("hashchange",function(){if(!window.__atlLive)window.__atlEarlyHash=location.hash})}catch(e){}try{var j=JSON.parse(localStorage.getItem(${JSON.stringify(
    `disputation:${slug}:judgments:v1`,
  ).replace(/</g, "\\u003c")})||"{}");for(var k in j)if(j[k]==="holds"||j[k]==="fails"){document.documentElement.setAttribute("data-atl-calls","");break}}catch(e){}})();`;

type EarlyWindow = Window & { __atlLive?: boolean; __atlEarlyHash?: string };

/* ------------------------------------------------------------------ */
/* Shell                                                                */
/* ------------------------------------------------------------------ */

export default function Shell({ children }: { children: ReactNode }) {
  const { route, d, ix, judgments, go, toPlain } = useAtlas();
  const key = viewKey(route);
  const hash = formatRoute(route);
  const main = useRef<HTMLElement>(null);
  const hydrating = useHydrating();
  const reduce = useReducedMotion();
  const dismissToast = useToastDismiss();
  const at = route.view === "home" ? route.at : undefined;

  /* --- a link to an objection or a page that doesn't exist: say so on the map, and clean the URL --- */
  const [missing, setMissing] = useState<{ name: string; kind: "objection" | "page" } | null>(null);
  const missingName = route.view === "home" ? route.missing : undefined;
  const missingKind = route.view === "home" && route.kind === "page" ? "page" : "objection";
  useEffect(() => {
    if (!missingName) return;
    setMissing({ name: missingName, kind: missingKind });
    go({ view: "home" }, { replace: true });
  }, [missingName, missingKind, go]);
  // Any other navigation clears the notice.
  const lastHash = useRef(hash);
  useEffect(() => {
    if (lastHash.current !== hash && hash !== "#/") setMissing(null);
    lastHash.current = hash;
  }, [hash]);

  /* --- the stored-calls mark has done its job once the client has the real calls --- */
  useEffect(() => {
    if (!hydrating) document.documentElement.removeAttribute("data-atl-calls");
  }, [hydrating, judgments]);

  /* --- document title: one per view, so history and tab lists can tell them apart --- */
  const nodeId = route.view === "objection" ? route.node : undefined;
  const titleO = route.view === "objection" || route.view === "walk" ? route.o : undefined;
  useEffect(() => {
    const site = d.title || "All the Way Down";
    let t = site;
    if (titleO) {
      const o = ix.objections.get(titleO);
      if (o) {
        const name = toPlain(o.title || o.short || "");
        if (route.view === "walk") t = `Step through Objection ${o.numeral} · ${site}`;
        else {
          const n = nodeId ? ix.nodes.get(nodeId) : undefined;
          const base = `Objection ${o.numeral}${name ? `: ${name}` : ""} · ${site}`;
          t = n && n.objection === o.id ? `${toPlain(n.node.label)} · ${base}` : base;
        }
      }
    } else if (route.view !== "home") t = `${LIB_TITLE[route.view] ?? site} · ${site}`;
    document.title = t;
    // Next writes the page's metadata title once its head has streamed in, which can land after
    // this effect on a first load: keep ours while this view is showing.
    const head = document.head;
    const mo = new MutationObserver(() => {
      if (document.title !== t) document.title = t;
    });
    mo.observe(head, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, [route.view, titleO, nodeId, d.title, ix, toPlain]);

  /* --- keyboard Tab: keep focused controls clear of the sticky bar ---
     scroll-padding-top applies only while the reader is tabbing (html[data-atl-tab]), so it
     never adds to the scroll-margins the views give their own scrollIntoView targets. */
  useEffect(() => {
    const root = document.documentElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") root.setAttribute("data-atl-tab", "");
      else root.removeAttribute("data-atl-tab");
    };
    const onPointer = () => root.removeAttribute("data-atl-tab");
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("pointerdown", onPointer, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pointerdown", onPointer, true);
      root.removeAttribute("data-atl-tab");
    };
  }, []);

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

  /* --- the deep-link veil comes off once the linked view is on screen ---
     A view whose code is still loading shows a [data-atl-pending] placeholder; it lifts the
     veil itself when it mounts (Atlas.tsx), so a slow phone never sees a blank page. */
  useEffect(() => {
    if (key !== viewKey(parseHash(window.location.hash))) return;
    if (main.current?.querySelector("[data-atl-pending]")) return;
    document.documentElement.removeAttribute("data-atl-deep");
  }, [key]);
  useEffect(() => () => document.documentElement.removeAttribute("data-atl-deep"), []);

  /* --- on view change: scroll (top, or the remembered spot) and move focus --- */
  const lastKey = useRef<string | null>(null);
  const initialKey = useRef<string | null>(null);
  const landing = useRef(0);
  useEffect(() => () => window.clearTimeout(landing.current), []);
  const navigated = useRef(false);
  useLayoutEffect(() => {
    const { id, stable } = entryId(hash);
    const remembered = positions.get(id);
    cur.current = { id, view: key };

    if (initialKey.current === null) initialKey.current = viewKey(parseHash(window.location.hash));
    const prev = lastKey.current;
    lastKey.current = key;
    if (prev === null || prev === key) return;
    // A toast's Undo belongs to the view that raised it.
    dismissToast();
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
    // #/map arrives with the map just under the bar (Back still returns to the remembered spot).
    const atMap = !back && at === "map";
    let top = back ? back.y : 0;
    if (atMap) top = scrollToMap(false) ?? 0;
    else window.scrollTo({ top, left: 0, behavior: "instant" });
    // Chromium lets an in-flight smooth scroll (say, a chamber gliding to a move) apply one
    // more frame after an instant scroll: re-assert the target for the next two frames.
    const settle = (n: number) =>
      requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top, left: 0, behavior: "instant" });
        if (n > 1) settle(n - 1);
      });
    settle(2);
    const act = back ? activations.get(id) : undefined;
    const sel = back ? null : landingSelector(parseHash(hash));
    window.clearTimeout(landing.current);
    requestAnimationFrame(() => {
      const root = main.current?.closest(".atl");
      if (act && root && refocus(root, act)) return;
      const interim = focusViewHeading(main.current);
      if (!sel) return;
      // A link that names an entry lands on it, once the view has scrolled it into place (the
      // library views settle about 420ms after they mount, and a lazy view may still be
      // loading). Never if the reader has moved focus meanwhile.
      const started = Date.now();
      const tryLand = () => {
        const a = document.activeElement;
        const untouched = !a || a === document.body || a === interim || a === main.current || (a instanceof HTMLElement && a.tagName === "H1" && !!main.current?.contains(a));
        if (!untouched) return;
        const el = main.current?.querySelector<HTMLElement>(sel);
        if (el) land(el);
        else if (Date.now() - started < 5000) landing.current = window.setTimeout(tryLand, 150);
      };
      landing.current = window.setTimeout(tryLand, 450);
    });
    // `hash` is a dependency so in-view (node) navigations also switch the remembered entry.
  }, [key, hash, at, dismissToast]);

  /* --- #/map within the overview (a fresh load, or #/ → #/map): bring the map up ---
     Arriving from another view is handled above, where Back can still restore a spot. */
  const atState = useRef<{ key: string; at?: string; live: boolean } | null>(null);
  useEffect(() => {
    const was = atState.current;
    atState.current = { key, at, live: !hydrating };
    if (at !== "map" || !was || was.key !== key || was.at === "map") return;
    scrollToMap(was.live);
  }, [key, at, hydrating]);

  // Skip to content from mid-page: bring the view's heading up under the bar, then focus it.
  const skip = useCallback(() => {
    const h = main.current?.querySelector<HTMLElement>("h1") ?? main.current;
    if (h) {
      const bar = document.querySelector<HTMLElement>(".atl .sh-bar")?.getBoundingClientRect().height ?? 52;
      const top = Math.max(0, Math.round(h.getBoundingClientRect().top + window.scrollY - bar - 16));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, left: 0, behavior: reduce ? "instant" : "smooth" });
    }
    focusViewHeading(main.current);
  }, []);

  return (
    <>
      {hydrating && <script dangerouslySetInnerHTML={{ __html: earlyScript(d.slug) }} />}
      <TopBar onSkip={skip} />
      {/* The main landmark (the root layout leaves it out on this route, so the bar and footer
          are the page's banner and contentinfo). Opacity only: a transform here would make this
          the containing block of the views' position:fixed docks for the length of the
          transition. No exit transition: the old view leaves at once, the new one fades in. */}
      <motion.main
        key={key}
        ref={main}
        id="atl-main"
        className="sh-main"
        initial={hydrating ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        {missing && route.view === "home" && (
          <p className="sh-notice" role="status">
            There’s no {missing.kind === "page" ? "page" : "objection"} called “{missing.name}”.
          </p>
        )}
        {children}
      </motion.main>
      <Footer />
    </>
  );
}
