"use client";

/* One objection's page.
   Header (numeral, the question, the exchange, history, status) → the parts
   → the thread (a branch of the argument as a script, every move expandable
   in place, every move open to a call) → where Spinoza stands → further reading.
   On wide screens every move of the objection sits beside the thread as a chart. */

import "./chamber.css";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAtlas } from "../context";
import { determine } from "../determination";
import { explainObjection } from "../explain";
import { address, depthBelow } from "../helpers";
import { initials, usePeek } from "../peek";
import { Glyph, RichText } from "../primitives";
import { findTensions, labelObjection, type DisputationIndex, type Tension } from "../semantics";
import { useToast } from "../toast";
import type { Judgment, Label, Objection, ObjectionId, Side } from "../types";
import {
  ChamberCtx,
  ChamberStaticCtx,
  OBJ_STATUS_WORD,
  RippleCtx,
  SIDE_WORD,
  STATUS_WORD,
  WhyLine,
  answeredMark,
  numWord,
  q,
  shownLabel,
  spellAddress,
  spellPlace,
  statusText,
  topInset,
  turnEl,
  useChamberStatic,
  type ChamberApi,
  type ChamberStatic,
  type FocusSource,
  type Ripple,
} from "./chamberShared";
import { YouMark } from "./marks";
import ObjectionChart from "./ObjectionChart";
import { ContextLink } from "./OutlineList";
import Thread from "./Thread";

const INSTANT = "instant" as ScrollBehavior;

/* Whether the reader has pressed a key or touched the page since it loaded. A deep link's first
   focus on its move then stays quiet: the browser would otherwise ring it as if tabbed to. */
let interacted = false;
if (typeof window !== "undefined") {
  const on = () => {
    interacted = true;
  };
  window.addEventListener("pointerdown", on, { capture: true, once: true });
  window.addEventListener("keydown", on, { capture: true, once: true });
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* A cross-objection jump leaves a one-hop "back" chip on the destination page. It remembers
   where the reader was (scroll position, and whether "Sources, people and links" was open), and
   the chip hands that back to the page it returns to. The page remounts per objection, so both
   hand-offs go through sessionStorage. */
const BACK_KEY = "atl:chamber-back:v2";
const RETURN_KEY = "atl:chamber-return:v1";
interface BackRec {
  /** The objection the jump went to (where the chip shows). */
  to: ObjectionId;
  /** The move it left. */
  from: string;
  y: number;
  open: boolean;
}
interface ReturnRec {
  o: ObjectionId;
  node: string;
  y: number;
  open: boolean;
}
function writeRec(key: string, rec: object) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ...rec, t: Date.now() }));
  } catch {
    /* no storage: no back chip */
  }
}
function readRec<T>(key: string, ok: (v: Partial<T>) => boolean): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<T> & { t?: number };
    return ok(v) && Date.now() - (v.t ?? 0) < 10_000 ? (v as T) : null;
  } catch {
    return null;
  }
}
function clearRec(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
const readBack = (oid: ObjectionId) =>
  readRec<BackRec>(BACK_KEY, (v) => v.to === oid && typeof v.from === "string" && typeof v.y === "number");
const readReturn = (oid: ObjectionId, node: string | null) =>
  node ? readRec<ReturnRec>(RETURN_KEY, (v) => v.o === oid && v.node === node && typeof v.y === "number") : null;

function branchPath(ix: DisputationIndex, focusId: string | null, memory: Record<string, string>): string[] {
  if (!focusId) return [];
  const info = ix.nodes.get(focusId);
  if (!info) return [];
  const out = [...info.path];
  let cur = focusId;
  for (let guard = 0; guard < 64; guard++) {
    const kids = ix.nodes.get(cur)?.childIds ?? [];
    if (!kids.length) break;
    const m = memory[cur];
    const nxt = m && kids.includes(m) ? m : kids[0];
    out.push(nxt);
    cur = nxt;
  }
  return out;
}

/** Top of what should show above a move when it is brought into view: its step,
    which carries the connector and any fork or tension note that leads into it. */
function stepTop(el: HTMLElement): number {
  return (el.closest<HTMLElement>(".ch-step") ?? el).getBoundingClientRect().top;
}

/** …unless that step opens with a tall fork card (on a phone, up to 640px of options): then
    bring up the fork's "‹ n of N ›" row, which sits just above the move, or else the move itself. */
function anchorTop(el: HTMLElement): number {
  const fork = el.closest<HTMLElement>(".ch-step")?.querySelector<HTMLElement>(".ch-fork");
  if (!fork || fork.getBoundingClientRect().height <= window.innerHeight * 0.3) return stepTop(el);
  return (fork.querySelector<HTMLElement>(".ch-fork-nav") ?? el).getBoundingClientRect().top;
}

function useMedia(query: string): boolean {
  const [on, setOn] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const set = () => setOn(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, [query]);
  return on;
}

/* ---------------- "you are here": five wedges, the current one lit ---------------- */

function HereMark({ index, count }: { index: number; count: number }) {
  const n = Math.max(1, count);
  const R0 = 7.5;
  const R1 = 21;
  const gap = 0.07;
  const p = (a: number, r: number) => `${(Math.sin(a) * r).toFixed(2)},${(-Math.cos(a) * r).toFixed(2)}`;
  return (
    <svg className="ch-here-mark" viewBox="-23 -23 46 46" aria-hidden>
      <circle r={22.2} className="ch-here-rim" />
      {Array.from({ length: n }, (_, i) => {
        const a0 = (i / n) * Math.PI * 2 + gap;
        const a1 = ((i + 1) / n) * Math.PI * 2 - gap;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const d = `M${p(a0, R1)}A${R1},${R1} 0 ${large} 1 ${p(a1, R1)}L${p(a1, R0)}A${R0},${R0} 0 ${large} 0 ${p(a0, R0)}Z`;
        return <path key={i} d={d} className={i === index ? "on" : ""} />;
      })}
      <circle r={4.2} className="ch-here-hub" />
    </svg>
  );
}

/* ---------------- Aquinas's own Objection 2 (Objection III only) ---------------- */

function Echo({ full }: { full: boolean }) {
  const [open, setOpen] = useState(false);
  const shown = full || open;
  return (
    <section className="ch-echo" aria-labelledby="ch-echo-h">
      <div className="ch-echo-top">
        <h2 id="ch-echo-h" className="ch-echo-h">
          Aquinas raised it against himself
        </h2>
        <p className="ch-echo-src">Summa Theologiae, Part I · 1265–68</p>
      </div>
      <p className="ch-echo-then">Around 1266 he made the case for part 2 of this objection, that God explains nothing nature can’t, and then answered it:</p>
      {!shown && <p className="ch-echo-hook s-skeptic">“…it seems that everything we see in the world can be accounted for by other principles, supposing God did not exist.”</p>}
      {!full && (
        <button type="button" className="ch-echo-more" aria-expanded={shown} aria-controls="ch-echo-body" onClick={() => setOpen((v) => !v)}>
          {shown ? "Hide Aquinas" : "Read Aquinas"} <span aria-hidden>{shown ? "▴" : "▾"}</span>
        </button>
      )}
      <div id="ch-echo-body" className="ch-echo-body" hidden={!shown}>
        {shown && (
          <>
            <div className="ch-echo-grid">
              <div className="ch-echo-col s-skeptic">
                <p className="ch-echo-k">
                  <Glyph side="skeptic" label="undec" size={10} /> Aquinas, arguing against himself
                </p>
                <blockquote className="ch-echo-t">
                  “Further, it is superfluous to suppose that what can be accounted for by a few principles has been produced by many. But it seems that everything we see in the
                  world can be accounted for by other principles, supposing God did not exist. For all natural things can be reduced to one principle which is nature; and all
                  voluntary things can be reduced to one principle which is human reason, or will. Therefore there is no need to suppose God’s existence.”
                </blockquote>
              </div>
              <div className="ch-echo-col s-theist">
                <p className="ch-echo-k">
                  <Glyph side="theist" label="undec" size={10} /> Aquinas’s reply
                </p>
                <blockquote className="ch-echo-t">
                  “Since nature works for a determinate end under the direction of a higher agent, whatever is done by nature must needs be traced back to God, as to its first
                  cause. So also whatever is done voluntarily must also be traced back to some higher cause other than human reason or will, since these can change or fail; for all
                  things that are changeable and capable of defect must be traced back to an immovable and self-necessary first principle, as was shown in the body of the
                  Article.”
                </blockquote>
              </div>
            </div>
            <p className="ch-echo-cite">
              Summa Theologiae, Part I, question 2, article 3, Objection 2 and his reply · tr. Fathers of the English Dominican Province, 1920
            </p>
            <ContextLink url="https://www.newadvent.org/summa/1002.htm#article3" className="ch-echo-ctx" />
            <div className="ch-echo-note">
              <p>
                Spinoza agreed with Aquinas that everything traces back to a first cause that exists by its own necessity. But he took that cause to be nature itself,
                which brings him close to the objection: “the eternal and infinite Being, which we call God or Nature, acts by the same necessity as that whereby it
                exists” (<em>Ethics</em> IV, Preface). He called God “the indwelling and not the transient cause of all things” (<em>Ethics</em> I, Prop. 18), meaning a
                cause that acts from inside nature, not on it from outside.
              </p>
              <p>
                He rejected Aquinas’s first step, that nature works “for a determinate end under the direction of a higher agent”, toward a goal someone set. Spinoza
                called final causes, the purposes things are supposed to exist for, “mere human figments”, and summed up the view he was attacking as “God made all
                things for man, and man that he might worship him” (<em>Ethics</em> I, Appendix). He also denied that the first cause chooses: “God does not act
                according to freedom of the will” (<em>Ethics</em> I, Prop. 32, Cor. 1).
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------------- lineage ribbon ---------------- */

/** "Augustine of Hippo" → "Augustine"; "Thomas Aquinas" → "Aquinas". */
function shortName(name: string): string {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  if (/ of /.test(clean)) return clean.split(" of ")[0].split(" ").slice(-1)[0];
  return clean.split(/\s+/).slice(-1)[0];
}

/** A name chip's name: the surname ("Pascal"), but "John of the Cross" in full, where the
    short form would be just a first name. */
function chipName(name: string): string {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  return / of /.test(clean) ? clean : shortName(clean);
}

/** A thinker's year as the chips show it: "1670", "380 BCE". */
const yearText = (y: number) => (y < 0 ? `${-y} BCE` : String(y));

type Lean = Side | "both" | "neutral";
const LEAN_WORD: Record<Lean, string> = {
  skeptic: "used by the Objector",
  theist: "used by the Defender",
  both: "used by both sides",
  spinoza: "Spinoza’s view",
  neutral: "background",
};

/** Which side uses a person's work here, from the moves that cite them (as People says it):
    the Objector, the Defender, both sides, or Spinoza. Spinoza and those who take up his view keep
    Spinoza's mark; with no citing move, a person keeps their own side. */
function leanOf(ix: DisputationIndex, t: string): Lean {
  if (ix.thinkers.get(t)?.side === "spinoza") return "spinoza";
  const sides = new Set<Side>();
  for (const id of ix.thinkerRefs.get(t) ?? []) {
    const s = ix.nodes.get(id)?.node.side;
    if (s) sides.add(s);
  }
  if (sides.size === 0) return ix.thinkers.get(t)?.side ?? "neutral";
  if (sides.has("skeptic") && sides.has("theist")) return "both";
  if (sides.has("skeptic")) return "skeptic";
  if (sides.has("theist")) return "theist";
  return "spinoza";
}

function Lineage({ oid, numeral, lineage, onHistory }: { oid: ObjectionId; numeral: string; lineage: string[]; onHistory: () => void }) {
  const { ix } = useAtlas();
  const peek = usePeek();
  const [all, setAll] = useState(false);
  // Phones: everyone, in one row of name chips that scrolls sideways (chamber.css).
  const row = useMedia("(max-width: 639px)");
  const listId = `ch-roundels-${oid}`;
  const people = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const m of lineage) {
      const t = ix.moments.get(m)?.thinker;
      if (t && ix.thinkers.has(t) && !seen.has(t)) {
        seen.add(t);
        out.push(t);
      }
    }
    if (out.length < 4) {
      const extra: string[] = [];
      for (const [t, nodes] of ix.thinkerRefs) {
        if (seen.has(t) || !ix.thinkers.has(t)) continue;
        if (nodes.some((n) => ix.nodes.get(n)?.objection === oid)) extra.push(t);
      }
      extra.sort((a, b) => (ix.thinkers.get(a)!.year ?? 0) - (ix.thinkers.get(b)!.year ?? 0));
      out.push(...extra);
      out.sort((a, b) => (ix.thinkers.get(a)!.year ?? 0) - (ix.thinkers.get(b)!.year ?? 0));
    }
    return out;
  }, [ix, lineage, oid]);

  if (people.length === 0 && lineage.length === 0) return null;
  const MAX = 9;
  const more = row ? 0 : Math.max(0, people.length - MAX);
  const shown = all || row ? people : people.slice(0, MAX);
  const first = ix.thinkers.get(people[0]);
  const lastT = ix.thinkers.get(people[people.length - 1]);
  return (
    <div className="ch-lineage">
      {shown.length > 0 && <span className="ch-lineage-k">Who argued it</span>}
      {shown.length > 0 && (
        <ul id={listId} className={`ch-roundels ${all ? "is-all" : ""}`} aria-label="People who argued over this objection, oldest first">
          {shown.map((t) => {
            const th = ix.thinkers.get(t)!;
            const lean = leanOf(ix, t);
            return (
              <li key={t}>
                <button
                  type="button"
                  className={`ch-roundel s-${lean}`}
                  aria-label={`${th.name}, ${th.life}, ${LEAN_WORD[lean]}`}
                  title={`${th.name} (${th.life}) · ${cap(LEAN_WORD[lean])}`}
                  onClick={(e) =>
                    peek({
                      kind: "thinker",
                      id: t,
                      rect: e.currentTarget.getBoundingClientRect(),
                    })
                  }
                >
                  <span className="monogram">{initials(th.name)}</span>
                  {/* phones: a name chip ("Pascal 1670"), two to a row; wide screens keep the roundel */}
                  <span className="ch-roundel-name" aria-hidden>
                    {chipName(th.name)} <span className="ch-roundel-yr">{yearText(th.year)}</span>
                  </span>
                </button>
              </li>
            );
          })}
          {more > 0 && (
            <li className="ch-roundel-more-li">
              <button type="button" className="ch-roundel-more" aria-expanded={all} aria-controls={listId} onClick={() => setAll((v) => !v)}>
                {all ? "Show fewer" : `and ${more} more`}
              </button>
            </li>
          )}
        </ul>
      )}
      {first && lastT && people.length > 1 && (
        <span className="ch-lineage-span">
          {shortName(first.name)} to {shortName(lastT.name)}
        </span>
      )}
      <button type="button" className="ch-lineage-go" onClick={onHistory}>
        <span className="ch-u">Objection {numeral} through history</span>
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}

/* ---------------- phones and tablets: the place bar and the depth gauge ---------------- */

/** Rounds on the depth gauge sit this far apart (CSS px; chamber.css draws the notches to match). */
const GAUGE_STEP = 20;

/* "Round 3" rolls when the round changes: up when the reader goes deeper, down on the way back. */
const ROLL: Variants = {
  enter: (d: number) => ({ y: d * 9, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (d: number) => ({ y: d * -9, opacity: 0 }),
};
const FADE: Variants = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };

/** Phones and tablets, while the thread is on screen: a slim bar under the top bar says where the
    open move sits ("I · Part 2 of 3 · Round 3"; a tap brings that move back into view), with
    "Up a round" (to the move it replies to) and "Parts" (a short menu of the parts). On a short
    screen (a phone on its side) the bar tucks away while the reader scrolls down and comes back on
    a scroll up. At the right edge, the depth gauge: one notch per round of the current part, in the
    colour of whoever speaks in that round on this branch, the open move's round lit. */
function Locator({ o, focusId, path }: { o: Objection; focusId: string; path: string[] }) {
  const { ix, labels, judgments, toPlain } = useAtlas();
  const { focus } = useChamberStatic();
  const reduce = useReducedMotion();
  const barRef = useRef<HTMLElement>(null);
  const partsRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const [inThread, setInThread] = useState(false);
  const [tucked, setTucked] = useState(false);
  /** Where the open move is when it is off screen. */
  const [off, setOff] = useState<"up" | "down" | null>(null);
  const [menu, setMenu] = useState(false);
  const info = ix.nodes.get(focusId);
  const depth = info?.depth ?? 1;
  const part = info?.prong ?? o.prongs[0]?.id;
  const rounds = useMemo(() => (part ? 1 + depthBelow(ix, part) : 1), [ix, part]);
  // Which way the round changed, for the roll.
  const [seen, setSeen] = useState({ id: focusId, depth, dir: 1 });
  if (seen.id !== focusId) setSeen({ id: focusId, depth, dir: depth >= seen.depth ? 1 : -1 });
  const shown = inThread && !tucked;
  // Opening another move, or the bar going away, closes the parts menu.
  const [menuFor, setMenuFor] = useState(focusId);
  if (menuFor !== focusId) {
    setMenuFor(focusId);
    setMenu(false);
  }
  if (menu && !shown) setMenu(false);

  const focusRef = useRef(focusId);
  const checkRef = useRef<() => void>(() => {});
  useEffect(() => {
    focusRef.current = focusId;
    checkRef.current();
  }, [focusId, path]);

  useEffect(() => {
    const short = window.matchMedia("(max-height: 480px)");
    let raf = 0;
    let lastY = window.scrollY;
    let run = 0;
    // Only the reader's own scrolling tucks the bar away (a finger on the screen, the fling after
    // it, a wheel or a scroll key), never the page bringing a move into view after a tap.
    let touching = false;
    let inputAt = -Infinity;
    let userScrollAt = -Infinity;
    const onTouchStart = () => {
      touching = true;
    };
    const onTouchEnd = () => {
      touching = false;
    };
    const onWheel = () => {
      inputAt = performance.now();
    };
    const onKey = (e: KeyboardEvent) => {
      if (/^(ArrowDown|ArrowUp|PageDown|PageUp|Home|End| )$/.test(e.key)) inputAt = performance.now();
    };
    const check = () => {
      raf = 0;
      const bar = document.querySelector<HTMLElement>(".sh-bar");
      const top = bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
      const h = barRef.current?.offsetHeight ?? 0;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      const now = performance.now();
      const user = touching || now - inputAt < 400 || now - userScrollAt < 120;
      if (dy && user) userScrollAt = now;
      if (!short.matches) {
        run = 0;
        setTucked(false);
      } else if (dy && user) {
        run = dy > 0 === run > 0 ? run + dy : dy;
        if (run > 24) setTucked(true);
        else if (run < -12) setTucked(false);
      }
      // The thread is "on screen" from when its top reaches the bar's lower edge (with the 16px a
      // move brought into view sits below it) until its end has scrolled up under the bar.
      const thread = document.querySelector<HTMLElement>(".ch-thread");
      const r = thread?.getBoundingClientRect();
      setInThread(!!r && r.top < top + h + 24 && r.bottom > top + h + 96);
      const el = turnEl(focusRef.current);
      if (!el) {
        setOff(null);
        return;
      }
      const t = el.getBoundingClientRect();
      const dock = parseFloat(document.documentElement.style.getPropertyValue("--atl-dock-h")) || 0;
      setOff(t.bottom < top + h + 12 ? "up" : t.top > window.innerHeight - dock - 12 ? "down" : null);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    checkRef.current = on;
    on();
    const opt = { passive: true, capture: true } as const;
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    window.addEventListener("touchstart", onTouchStart, opt);
    window.addEventListener("touchend", onTouchEnd, opt);
    window.addEventListener("touchcancel", onTouchEnd, opt);
    window.addEventListener("wheel", onWheel, opt);
    window.addEventListener("keydown", onKey, true);
    short.addEventListener("change", on);
    return () => {
      cancelAnimationFrame(raf);
      checkRef.current = () => {};
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      window.removeEventListener("touchstart", onTouchStart, opt);
      window.removeEventListener("touchend", onTouchEnd, opt);
      window.removeEventListener("touchcancel", onTouchEnd, opt);
      window.removeEventListener("wheel", onWheel, opt);
      window.removeEventListener("keydown", onKey, true);
      short.removeEventListener("change", on);
    };
  }, []);

  // The back chip drops below the bar while the bar shows (chamber.css, .ch[data-loc]).
  useEffect(() => {
    const ch = barRef.current?.closest<HTMLElement>(".ch");
    if (!ch) return;
    ch.dataset.loc = shown ? "shown" : "hidden";
    return () => {
      delete ch.dataset.loc;
    };
  }, [shown]);

  // The parts menu closes on Escape, on a press anywhere outside the bar, and when Tab leaves it.
  useEffect(() => {
    if (!menu) return;
    const bar = barRef.current;
    const onDown = (e: PointerEvent) => {
      if (!bar?.contains(e.target as Node)) setMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(false);
      partsRef.current?.focus();
    };
    const onFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget && !bar?.contains(e.relatedTarget as Node)) setMenu(false);
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    bar?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
      bar?.removeEventListener("focusout", onFocusOut);
    };
  }, [menu]);

  if (!info) return null;
  const many = o.prongs.length > 1;
  const nParts = o.prongs.length;
  const partNo = o.prongs.findIndex((p) => p.id === info.prong) + 1;
  const side = info.node.side;
  const parent = info.parent;

  /* The place itself: bring the open move back into view, with a brief glow round its card. */
  const bringBack = () => {
    const el = turnEl(focusId);
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - (topInset() + 16);
    window.scrollTo({ top: Math.max(0, y), behavior: (reduce ? "instant" : "smooth") as ScrollBehavior });
    el.querySelector<HTMLElement>("[data-turn-heading]")?.focus({ preventScroll: true });
    el.removeAttribute("data-ping");
    void el.offsetWidth;
    el.setAttribute("data-ping", "");
    window.setTimeout(() => el.removeAttribute("data-ping"), 1200);
  };

  return (
    <>
      <nav ref={barRef} className="ch-loc" data-state={shown ? "shown" : "hidden"} aria-label="Your place in this objection">
        <div className="ch-loc-in">
          <button
            type="button"
            className={`ch-loc-here s-${side}`}
            onClick={bringBack}
            aria-label={`${off ? "Back to" : "Show"} the open move: ${spellPlace(ix, focusId)}, the ${SIDE_WORD[side]}`}
          >
            <span className="ch-loc-num" aria-hidden>
              {o.numeral}
            </span>
            <span className="ch-loc-where" aria-hidden>
              {many && (
                <span className="ch-loc-part">
                  Part {partNo} of {nParts}
                </span>
              )}
              <span className="ch-loc-roll">
                <AnimatePresence initial={false} mode="popLayout" custom={seen.dir}>
                  <motion.span
                    key={`${partNo}.${depth}`}
                    className="ch-loc-round"
                    custom={seen.dir}
                    variants={reduce ? FADE : ROLL}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Glyph side={side} label="undec" size={9} />
                    Round {depth}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
            {/* the open move is off screen: a "find it" mark, like a map's locate button */}
            <span className={`ch-loc-off ${off ? "on" : ""}`} aria-hidden>
              <svg viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="4.6" />
                <path d="M8 0.8v3M8 12.2v3M0.8 8h3M12.2 8h3" />
                <circle cx="8" cy="8" r="1.4" className="dot" />
              </svg>
            </span>
          </button>
          {parent && (
            <button type="button" className="ch-loc-btn" aria-label="Up a round" onClick={() => focus(parent, "link")}>
              <span className="ch-loc-pill">
                <span aria-hidden>↑</span>
                <span>
                  Up<span className="ch-loc-more"> a round</span>
                </span>
              </span>
            </button>
          )}
          {many && (
            <button ref={partsRef} type="button" className="ch-loc-btn" aria-expanded={menu} aria-controls={menuId} onClick={() => setMenu((v) => !v)}>
              <span className="ch-loc-pill">
                Parts <span className="ch-loc-chev" aria-hidden />
              </span>
            </button>
          )}
        </div>
        {many && (
          <div id={menuId} className="ch-loc-region">
            <AnimatePresence>
              {menu && (
                <motion.div
                  className="ch-loc-menu"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                  transition={reduce ? { duration: 0.12 } : { type: "spring", stiffness: 520, damping: 34 }}
                >
                  <p className="ch-loc-menu-k">The {numWord(nParts)} parts of Objection {o.numeral}</p>
                  <ol>
                    {o.prongs.map((p, i) => {
                      const l = labels.node.get(p.id) ?? "undec";
                      const call = judgments[p.id];
                      const sl = shownLabel(l, call);
                      const on = p.id === info.prong;
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            className={`ch-loc-opt s-${p.side} ${on ? "on" : ""}`}
                            aria-current={on ? "true" : undefined}
                            onClick={() => {
                              setMenu(false);
                              focus(p.id, "link");
                            }}
                          >
                            <span className="ch-loc-opt-k">
                              <span>
                                Part {i + 1} of {nParts}
                              </span>
                              <span className={`ch-loc-opt-st st-${sl}`}>
                                {call ? (
                                  <>
                                    <YouMark size={9} className="ch-you" />
                                    <span className="your-call">{statusText(l, call)}</span>
                                  </>
                                ) : (
                                  STATUS_WORD[l]
                                )}
                              </span>
                            </span>
                            <span className="ch-loc-opt-l">
                              <Glyph side={p.side} label={sl} size={11} />
                              <span className={answeredMark(l, call) ? "lab-out" : ""}>{toPlain(p.label)}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      <div
        className="ch-gauge"
        data-state={inThread ? "shown" : "hidden"}
        aria-hidden
        style={{ ["--ch-gauge-n" as string]: rounds, ["--ch-gauge-at" as string]: depth - 1 }}
      >
        <span className="ch-gauge-line" />
        <span className="ch-gauge-fill" />
        {Array.from({ length: rounds }, (_, i) => {
          const id = path[i];
          const s = id ? ix.nodes.get(id)?.node.side : undefined;
          const kind = !s ? "beyond" : i + 1 < depth ? "above" : i + 1 === depth ? "here" : "below";
          return <span key={i} className={`ch-gauge-n k-${kind} ${s ? `s-${s}` : ""}`} style={{ ["--i" as string]: i }} />;
        })}
        <motion.span
          className={`ch-gauge-bob s-${side}`}
          initial={false}
          animate={{ y: (depth - 1) * GAUGE_STEP }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
        />
      </div>
    </>
  );
}

/* ---------------- the page ---------------- */

export default function Chamber({ o: oid, node }: { o: ObjectionId; node?: string }) {
  const { ix, d, go, judgments, judge, labels, tensions, analysis, toPlain, openNode } = useAtlas();
  const toast = useToast();
  const o = ix.objections.get(oid);
  const valid = node && ix.nodes.get(node)?.objection === oid ? node : null;
  const focusId = valid ?? o?.prongs[0]?.id ?? null;
  // Two columns from 1200px: below that, the reading column and the chart panel are both too narrow.
  const wide = useMedia("(min-width: 1200px)");
  // Phones (upright, or on their side): the chart folds away behind "Show the chart", after the parts.
  const narrow = useMedia("(max-width: 639px), (max-height: 480px)");

  // A move id that isn't in this objection: go to its real address (or this objection's top), without a history entry.
  useEffect(() => {
    if (!node || valid) return;
    const info = ix.nodes.get(node);
    go(info ? { view: "objection", o: info.objection, node } : { view: "objection", o: oid }, { replace: true });
  }, [node, valid, ix, go, oid]);
  // …and when no move has that id at all, say so (as People, Glossary and the Timeline do), until the reader moves on.
  const [missing, setMissing] = useState<string | null>(null);
  if (node && !ix.nodes.has(node) && missing !== node) setMissing(node);
  if (valid && missing) setMissing(null);

  // Remember which reply the reader followed below each move, so climbing back
  // up the thread keeps the branch they came from.
  const [memory, setMemory] = useState<Record<string, string>>({});
  const [memFor, setMemFor] = useState<string | null>(null);
  if (focusId && memFor !== focusId) {
    setMemFor(focusId);
    const info = ix.nodes.get(focusId);
    if (info) {
      setMemory((m) => {
        const next = { ...m };
        for (let i = 1; i < info.path.length; i++) next[info.path[i - 1]] = info.path[i];
        return next;
      });
    }
  }
  const path = useMemo(() => branchPath(ix, focusId, memory), [ix, focusId, memory]);

  /* ---- the ripple after a call: each move's ring plays once and removes itself (Ripple.done
     keeps a remount from replaying it). Never cleared on a timer, so no second commit. ---- */
  const [ripple, setRipple] = useState<Ripple | null>(null);

  const [back, setBack] = useState(() => readBack(oid));
  useEffect(() => clearRec(BACK_KEY), []);
  // Arriving by a back chip: where the reader was on this page when they jumped away.
  const [ret] = useState(() => readReturn(oid, valid));
  useEffect(() => clearRec(RETURN_KEY), []);

  /* ---- Back / Forward between moves: restore where the reader was on that entry ----
     A popstate marks the next focus change as a traversal. Scroll positions are kept per hash
     (not recorded while a traversal is landing, when the hash has changed but the page hasn't). */
  const traversal = useRef(false);
  const spots = useRef(new Map<string, number>());
  useEffect(() => {
    let t = 0;
    const onPop = () => {
      traversal.current = true;
      window.clearTimeout(t);
      t = window.setTimeout(() => (traversal.current = false), 1000);
    };
    const onScroll = () => {
      if (!traversal.current) spots.current.set(window.location.hash, window.scrollY);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const [mapOpen, setMapOpen] = useState(false);

  /* ---- phones: the Defender's reply and the background sit behind "Read the summary" ----
     (the Objector's case stays in full), so the parts come within about a screen and a half. */
  const phone = useMedia("(max-width: 720px), (max-height: 480px)");
  const reduce = useReducedMotion();
  const sumId = useId();
  const [sumOpen, setSumOpen] = useState(false);
  /** The preview's height when the reader opened it: the whole reply grows from there. */
  const [teaserH, setTeaserH] = useState(0);
  const teaserRef = useRef<HTMLSpanElement>(null);
  const sumBtnRef = useRef<HTMLButtonElement>(null);
  const sumAnchor = useRef<number | null>(null);
  const foldable = phone && !!o && !!(o.counter || o.dek);
  const sumShown = !foldable || sumOpen;
  const openSummary = useCallback(() => {
    setTeaserH(teaserRef.current?.offsetHeight ?? 0);
    setSumOpen(true);
  }, []);
  const closeSummary = useCallback(() => {
    sumAnchor.current = sumBtnRef.current?.getBoundingClientRect().top ?? null;
    setTeaserH(0);
    setSumOpen(false);
  }, []);
  // Closing it keeps the button where it was on screen (the text above it shrinks back).
  useLayoutEffect(() => {
    const before = sumAnchor.current;
    sumAnchor.current = null;
    if (before === null || sumOpen) return;
    const after = sumBtnRef.current?.getBoundingClientRect().top;
    if (after !== undefined && Math.abs(after - before) > 1) window.scrollBy({ top: after - before, behavior: INSTANT });
  }, [sumOpen]);

  /* ---- screen-reader confirmation of calls that don't change the objection ---- */
  const [said, setSaid] = useState({ text: "", n: 0 });
  const say = useCallback((text: string) => setSaid((s) => ({ text, n: s.n + 1 })), []);

  /* ---- focus + scrolling ---- */
  const anchor = useRef<{ id: string; top: number | null; from: FocusSource } | null>(null);
  const lastFocus = useRef(focusId);

  const focus = useCallback(
    (id: string, from: FocusSource = "thread", at?: number) => {
      const el = turnEl(id);
      anchor.current = { id, top: el ? el.getBoundingClientRect().top : (at ?? null), from };
      // Leaving this entry: remember where the reader was, for Back.
      if (id !== focusId) spots.current.set(window.location.hash, window.scrollY);
      if (id === focusId && el) {
        // Already open: just bring it back into view.
        const inset = topInset();
        const top = el.getBoundingClientRect().top;
        if (top < inset || top > window.innerHeight * 0.6) {
          window.scrollTo({ top: window.scrollY + anchorTop(el) - (inset + 16), behavior: from === "chart" && !reducedMotion() ? "smooth" : INSTANT });
        }
        if (from !== "chart") el.querySelector<HTMLElement>("[data-turn-heading]")?.focus({ preventScroll: true });
      }
      go({ view: "objection", o: oid, node: id });
    },
    [go, oid, focusId],
  );

  useLayoutEffect(() => {
    // Only react to an actual change of focus (not to mounting, or a dev-mode effect replay).
    if (lastFocus.current === focusId) return;
    lastFocus.current = focusId;
    if (!focusId) return;
    const a = anchor.current;
    anchor.current = null;
    const wasTraversal = traversal.current;
    traversal.current = false;
    const el = turnEl(focusId);
    if (!el) return;
    const heading = el.querySelector<HTMLElement>("[data-turn-heading]");
    if (wasTraversal) {
      // Back / Forward: return to where the reader was on this entry (or bring the move up, as
      // for any other change), and keep keyboard focus in the thread rather than on <body>.
      const y = spots.current.get(window.location.hash);
      if (y !== undefined) window.scrollTo({ top: y, behavior: INSTANT });
      else window.scrollTo({ top: window.scrollY + anchorTop(el) - (topInset() + 16), behavior: INSTANT });
      const at = document.activeElement;
      if (!at || at === document.body || !at.closest(".ch-thread")) heading?.focus({ preventScroll: true });
      return;
    }
    const inset = topInset();
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top;
    const fromChart = a?.from === "chart";
    let delta: number;
    if (a && a.id === focusId && a.top !== null && !fromChart) {
      // Keep the move the reader acted on where it was (within a comfortable band).
      delta = top - Math.min(Math.max(a.top, inset + 16), vh * 0.36);
    } else if (top >= inset + 8 && top <= vh * 0.45) {
      delta = 0;
    } else {
      delta = anchorTop(el) - (inset + 16);
    }
    if (Math.abs(delta) > 2) {
      // `instant` beats the site's `scroll-behavior: smooth`; only chart-started moves glide.
      window.scrollTo({ top: window.scrollY + delta, behavior: fromChart && !reducedMotion() ? "smooth" : INSTANT });
    }
    if (a && a.from !== "chart" && heading) {
      // After a swipe the focus moves on quietly: no ring round a card the reader's finger put there.
      if (a.from === "swipe") {
        heading.dataset.quiet = "";
        heading.addEventListener("blur", () => delete heading.dataset.quiet, { once: true });
      }
      heading.focus({ preventScroll: true });
    }
  }, [focusId]);

  // A deep link (or a cross-objection jump): bring the move into view once the view has settled,
  // and put keyboard focus on it so the next Tab continues from there, not from the top.
  // Arriving by a back chip, it returns to the reader's spot instead, with "Sources, people and links"
  // open again if it was.
  const [initialNode] = useState(valid);
  useEffect(() => {
    if (!initialNode) return;
    const t = window.setTimeout(() => {
      const el = turnEl(initialNode);
      if (!el) return;
      if (ret) {
        const more = el.querySelector<HTMLDetailsElement>("details.ch-more");
        if (more && ret.open) more.open = true;
        window.scrollTo({ top: ret.y, behavior: INSTANT });
      } else {
        window.scrollTo({ top: window.scrollY + anchorTop(el) - (topInset() + 16), behavior: INSTANT });
      }
      const h = el.querySelector<HTMLElement>("[data-turn-heading]");
      if (!h) return;
      if (!interacted) {
        h.dataset.quiet = "";
        h.addEventListener("blur", () => delete h.dataset.quiet, { once: true });
      }
      h.focus({ preventScroll: true });
    }, 120);
    return () => window.clearTimeout(t);
  }, [initialNode, ret]);

  /* ---- calls ---- */
  const decideRef = useRef<(id: string, j: Judgment | null, opts?: { undoing?: Judgment | null }) => void>(() => {});
  // The last call's undo, for the U key: it lasts as long as that call's toast would.
  const lastUndo = useRef<{ run: () => void; until: number } | null>(null);
  const decide = useCallback(
    (id: string, j: Judgment | null, opts?: { undoing?: Judgment | null }) => {
      if (!o) return;
      const info = ix.nodes.get(id);
      if (!info || info.objection !== o.id) return;
      const prev = judgments[id] ?? null;
      if (prev === j) return;
      // An undo only undoes the call it was made for: if the reader has since changed this move again, it does nothing.
      if (opts && opts.undoing !== undefined && prev !== opts.undoing) return;
      const nextJ = { ...judgments };
      if (j) nextJ[id] = j;
      else delete nextJ[id];
      const after = new Map<string, Label>();
      const objAfter = labelObjection(o, nextJ, after);
      const objBefore = labels.objection.get(o.id) ?? "undec";
      const ids = ix.byObjection.get(o.id) ?? [];
      const changed = new Set<string>([id]);
      for (const nid of ids) if ((labels.node.get(nid) ?? "undec") !== (after.get(nid) ?? "undec")) changed.add(nid);
      setRipple((r) => ({ key: (r?.key ?? 0) + 1, origin: info.depth, changed, done: new Set<string>() }));
      judge(id, j);

      const name = q(toPlain(info.node.label));
      const run = () => {
        if (lastUndo.current?.run === run) lastUndo.current = null;
        // Through the normal call path (ripple, toast, announcement), once the toast has gone.
        window.setTimeout(() => {
          decideRef.current(id, prev, { undoing: j });
          requestAnimationFrame(() => {
            // If focus went with the toast's Undo button, put it back on the move.
            // (After the U key, focus is still in the thread: leave it there.)
            const at = document.activeElement as HTMLElement | null;
            if (at && at !== document.body && at.isConnected && !at.closest(".toast-dock")) return;
            const t = turnEl(id)?.querySelector<HTMLElement>("[data-turn-heading], .ch-hit") ?? document.querySelector<HTMLElement>(".ch-thread [data-turn-heading]");
            t?.focus({ preventScroll: true });
          });
        }, 0);
      };
      const undo = { label: "Undo", run };
      const remember = (ttl: number) => {
        lastUndo.current = { run, until: Date.now() + ttl };
      };
      const here = (t: Tension) => ix.nodes.get(t.node)?.objection === o.id;
      const tensBefore = tensions.filter(here);
      const tensAfter = findTensions(ix, nextJ, { node: after, objection: new Map() }).filter(here);
      const newTension = tensAfter.length > tensBefore.length;
      // The pair this call created, to name in the toast.
      const fresh = tensAfter.find((t) => !tensBefore.some((b) => b.node === t.node && b.reply === t.reply));
      const did = j ? `you said ${name} ${j}` : `you cleared your call on ${name}`;
      if (objAfter !== objBefore) {
        const N = `Objection ${o.numeral}`;
        const what = objAfter === "in" ? "now stands" : objAfter === "out" ? "is now answered" : "is open again";
        let text = `${cap(did)}, so ${N} ${what}.`;
        if (objAfter !== "undec") {
          // Credit the call(s) the new status rests on, as Where you stand and the walk's end card do.
          const det = determine(ix, o, nextJ, undefined, toPlain);
          const footing = det.focus ? [det.focus, ...det.also] : det.also;
          if (footing.length === 1 && footing[0] !== id) text = `${N} ${what}. It rests on your call on ${q(toPlain(ix.nodes.get(footing[0])?.node.label ?? footing[0]))}.`;
          else if (footing.length > 1) text = `${cap(did)}. With your other calls, ${N} ${what}.`;
        }
        const ttl = newTension ? 9000 : 7000;
        toast({ text: `${text}${newTension ? " That leaves two moves that contradict each other." : ""}`, action: undo, tone: newTension ? "tension" : "plain", ttl });
        remember(ttl);
        return;
      }
      if (newTension) {
        const said = (x: string) => q(toPlain(ix.nodes.get(x)?.node.label ?? x));
        toast({
          text: fresh
            ? `You said ${said(fresh.node)} holds, and its reply ${said(fresh.reply)} now stands. These two contradict each other.`
            : "You said a move holds, and a reply to it now stands. These two contradict each other.",
          action: undo,
          tone: "tension",
          ttl: 7000,
        });
        remember(7000);
        return;
      }
      const others = changed.size - 1;
      if (others > 0) {
        // A visible sign that the call moved other statuses too (the toast is also read out).
        toast({ text: `${cap(did)}. ${others === 1 ? "That changed one other move’s status." : `That changed the status of ${numWord(others)} other moves.`}`, action: undo, ttl: 6000 });
        remember(6000);
        return;
      }
      if (opts && opts.undoing !== undefined) {
        // An undo replaces the toast it came from, so it says what it did.
        toast({ text: `Undone. ${cap(did)}.`, action: undo, ttl: 5000 });
        remember(5000);
        return;
      }
      const still = objAfter === "in" ? "still stands" : objAfter === "out" ? "is still answered" : "is still open";
      const now = (l: Label) => (l === "in" ? "now stands" : l === "out" ? "is now answered" : "is now open");
      say(j ? `You said ${name} ${j}. Objection ${o.numeral} ${still}.` : `You cleared your call on ${name}. It ${now(after.get(id) ?? "undec")}. Objection ${o.numeral} ${still}.`);
      remember(7000);
    },
    [o, ix, judgments, labels, tensions, judge, toPlain, toast, say],
  );
  useEffect(() => {
    decideRef.current = decide;
  }, [decide]);
  const undoLast = useCallback(() => {
    const u = lastUndo.current;
    lastUndo.current = null;
    if (!u || Date.now() > u.until) return false;
    u.run();
    return true;
  }, []);

  const jump = useCallback(
    (id: string) => {
      const info = ix.nodes.get(id);
      if (!info) return;
      if (info.objection === oid) focus(id, "link");
      else {
        if (focusId) {
          const open = !!turnEl(focusId)?.querySelector<HTMLDetailsElement>("details.ch-more")?.open;
          writeRec(BACK_KEY, { to: info.objection, from: focusId, y: window.scrollY, open } satisfies BackRec);
        }
        go({ view: "objection", o: info.objection, node: id });
      }
    },
    [ix, oid, focus, focusId, go],
  );

  const ids = useMemo(() => ix.byObjection.get(oid) ?? [], [ix, oid]);
  const calls = useMemo(() => ids.filter((id) => judgments[id]).length, [ids, judgments]);
  const api = useMemo<ChamberApi | null>(
    () => (o && focusId ? { o, focusId, path, calls, focus, decide: (id: string, j: Judgment | null) => decide(id, j), jump, undo: undoLast } : null),
    [o, focusId, path, calls, focus, decide, jump, undoLast],
  );
  // Stable versions of the actions, for the folded moves (which then skip re-rendering on a call).
  const focusRef = useRef(focus);
  const jumpRef = useRef(jump);
  useEffect(() => {
    focusRef.current = focus;
    jumpRef.current = jump;
  }, [focus, jump]);
  const stableFocus = useCallback((id: string, from?: FocusSource, at?: number) => focusRef.current(id, from, at), []);
  const stableJump = useCallback((id: string) => jumpRef.current(id), []);
  const stableDecide = useCallback((id: string, j: Judgment | null) => decideRef.current(id, j), []);
  const statics = useMemo<ChamberStatic>(
    () => ({ ix, toPlain, focus: stableFocus, decide: stableDecide, jump: stableJump }),
    [ix, toPlain, stableFocus, stableDecide, stableJump],
  );

  if (!o) {
    return (
      <div className="ch">
        <p className="ch-missing">
          There’s no objection at this link.{" "}
          <button type="button" className="ch-missing-go" onClick={() => go({ view: "home" })}>
            <span className="ch-u">Back to the map</span>
          </button>
        </p>
      </div>
    );
  }

  const idx = d.objections.findIndex((x) => x.id === oid);
  const prevO = idx > 0 ? d.objections[idx - 1] : null;
  const nextO = idx >= 0 && idx < d.objections.length - 1 ? d.objections[idx + 1] : null;
  const objLabel = labels.objection.get(oid) ?? "undec";
  const a = analysis.get(oid);
  const focusInfo = focusId ? ix.nodes.get(focusId) : null;
  const curProng = focusInfo?.prong;
  const nProngs = o.prongs.length;
  const objTensions = tensions.filter((t) => ix.nodes.get(t.node)?.objection === oid).length;
  const backInfo = back ? ix.nodes.get(back.from) : null;
  const spin = o.spinoza;
  const spinBody = (spin?.body ?? []).filter((p) => p.trim());
  const hasScholium = !!spin && (!!spin.title || spinBody.length > 0);
  const nMoves = ids.length;
  const nRounds = ids.reduce((m, id) => Math.max(m, ix.nodes.get(id)?.depth ?? 0), 0);
  const mapMeta = `${nMoves} moves${nProngs > 1 ? ` · ${nProngs} parts` : ""} · ${nRounds === 1 ? "1 round" : `up to ${nRounds} rounds`}`;

  const ready = !!focusId;
  const chart = (variant: "panel" | "inline", bare = false) =>
    ready && focusId ? <ObjectionChart o={o} focusId={focusId} path={path} variant={variant} bare={bare} onSelect={(id) => focus(id, "chart")} /> : null;
  /* Below 1200px the chart sits in the page: in full on tablets, folded on phones. */
  const mapBlock =
    !wide && ready ? (
      narrow ? (
        <section className="ch-map-inline ch-map-disc" aria-label="All moves in this objection">
          <button type="button" id="ch-map-btn" className="ch-map-toggle" aria-expanded={mapOpen} aria-controls="ch-map-body" onClick={() => setMapOpen((v) => !v)}>
            <span className="ch-map-toggle-k">{mapOpen ? "Hide the chart" : "Show the chart"}</span>
            <span className="ch-map-toggle-m">{mapMeta}</span>
            <span className="ch-map-toggle-chev" aria-hidden>
              ▸
            </span>
          </button>
          <div id="ch-map-body" hidden={!mapOpen}>
            {mapOpen && chart("inline", true)}
          </div>
        </section>
      ) : (
        <section className="ch-map-inline" aria-label="All moves in this objection">
          {chart("inline")}
        </section>
      )
    ) : null;

  return (
    <ChamberStaticCtx.Provider value={statics}>
      <ChamberCtx.Provider value={api}>
        <RippleCtx.Provider value={ripple}>
          <div className="ch">
            <div className={`ch-grid ${wide ? "is-wide" : ""}`}>
              <div className="ch-main">
                {missing && (
                  <p className="lib-notice ch-notice" role="status">
                    There’s no move called “{missing}” in Objection {o.numeral}.
                  </p>
                )}
                {backInfo && back && (
                  <div className="ch-backbar">
                    <button
                      type="button"
                      className={`ch-back s-${backInfo.node.side}`}
                      aria-label={`Back to ${spellAddress(ix, back.from)}: ${toPlain(backInfo.node.label)}`}
                      onClick={() => {
                        // The page it returns to puts the reader back where they were.
                        writeRec(RETURN_KEY, { o: backInfo.objection, node: back.from, y: back.y, open: back.open } satisfies ReturnRec);
                        openNode(back.from);
                      }}
                    >
                      <span aria-hidden>↩</span>
                      <span className="ch-back-k" title={spellAddress(ix, back.from)}>
                        Back to {address(ix, back.from)}
                      </span>
                      <span className="ch-back-l">{toPlain(backInfo.node.label)}</span>
                    </button>
                    <button type="button" className="ch-back-x" aria-label="Hide the back link" onClick={() => setBack(null)}>
                      ×
                    </button>
                  </div>
                )}

                {/* ---------- the header ---------- */}
                <header className="ch-head">
                  <div className="ch-head-top">
                    <span className="ch-numeral" aria-hidden>
                      {o.numeral}
                    </span>
                    <p className="ch-eyebrow">
                      <span>Objection {o.numeral}</span>
                      {o.short && (
                        <>
                          <span className="ch-eyebrow-sep" aria-hidden>
                            {" · "}
                          </span>
                          <span className="sr-only">, </span>
                          <span className="ch-eyebrow-short">{o.short}</span>
                        </>
                      )}
                    </p>
                    <h1 className="ch-title" tabIndex={-1} id="ch-h1">
                      {toPlain(o.title)}
                    </h1>
                    <a
                      href="#/map"
                      className="ch-here"
                      aria-label={`Back to the map of all ${numWord(d.objections.length)} objections`}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                        e.preventDefault();
                        // "#/map" is the home view, scrolled to the map. Pushed the way the router pushes
                        // (Next's patched pushState), since the router's routes can't express the anchor.
                        const oldURL = window.location.href;
                        history.pushState(null, "", "#/map");
                        window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL, newURL: window.location.href }));
                      }}
                    >
                      <HereMark index={idx} count={d.objections.length} />
                      <span className="ch-here-k">Map</span>
                    </a>
                  </div>
                  {o.question && <p className="ch-question">{toPlain(o.question)}</p>}

                  {(o.objection || o.counter) && (
                    <div className="ch-exchange">
                      {o.objection && (
                        <p className="ch-ex s-skeptic">
                          <span className="ch-ex-k">
                            <Glyph side="skeptic" size={11} /> The Objector argues
                          </span>
                          <span className="ch-ex-t">
                            <RichText text={o.objection} />
                          </span>
                        </p>
                      )}
                      {o.counter && (
                        <p className={`ch-ex s-theist ${sumShown ? "" : "is-teaser"}`}>
                          <span className="ch-ex-k">
                            <Glyph side="theist" size={11} /> The Defender replies
                          </span>
                          <span className="ch-ex-t" id={`${sumId}-a`}>
                            {!sumShown ? (
                              // Phones: the first lines only, as a preview (the whole reply is behind "Read the summary").
                              <span ref={teaserRef} className="ch-teaser" aria-hidden onClick={openSummary}>
                                {toPlain(o.counter)}
                              </span>
                            ) : foldable ? (
                              <motion.span
                                className="ch-unteaser"
                                initial={teaserH && !reduce ? { height: teaserH } : false}
                                animate={{ height: "auto" }}
                                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <RichText text={o.counter} />
                              </motion.span>
                            ) : (
                              <RichText text={o.counter} />
                            )}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {o.dek && (
                    <div id={`${sumId}-b`} className="ch-dek-region">
                      {sumShown && (
                        <motion.p
                          className="ch-dek"
                          initial={foldable && !reduce ? { opacity: 0 } : false}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.12 }}
                        >
                          <RichText text={o.dek} onNode={jump} />
                        </motion.p>
                      )}
                    </div>
                  )}
                  {foldable && (
                    <button
                      ref={sumBtnRef}
                      type="button"
                      className="ch-sum-btn"
                      aria-expanded={sumOpen}
                      aria-controls={[o.counter ? `${sumId}-a` : "", o.dek ? `${sumId}-b` : ""].filter(Boolean).join(" ")}
                      onClick={() => (sumOpen ? closeSummary() : openSummary())}
                    >
                      <span className="ch-u">{sumOpen ? "Hide the summary" : "Read the summary"}</span>
                      <span className="ch-sum-chev" aria-hidden />
                    </button>
                  )}

                  <Lineage oid={oid} numeral={o.numeral} lineage={o.lineage ?? []} onHistory={() => go({ view: "timeline", moment: o.lineage?.[0] })} />

                  <div className="ch-statusrow">
                    <div className="ch-objstatus">
                      <span className={`ch-objpip st-${objLabel}`} aria-hidden />
                      <span className="ch-objword">{OBJ_STATUS_WORD[objLabel]}</span>
                      <span className="ch-objcount">
                        {a && a.judged > 0 ? `${a.judged} of ${a.total} moves marked Holds or Fails` : `${a?.total ?? nMoves} moves · none marked Holds or Fails yet`}
                        {objTensions > 0 ? ` · ${objTensions} ${objTensions === 1 ? "contradiction" : "contradictions"}` : ""}
                      </span>
                      <WhyLine key={`${objLabel}:${a?.judged ?? 0}`} explanation={explainObjection(labels, o, toPlain, judgments)} onGo={(id) => focus(id, "link")} className="ch-objwhy" />
                    </div>
                    <button type="button" className="btn ch-argue" onClick={() => go({ view: "walk", o: oid })}>
                      Step through it <span aria-hidden>▶</span>
                    </button>
                  </div>

                  {nProngs > 0 && (
                    <p className="ch-stakes">
                      {nProngs > 2 ? (
                        <>
                          If any one of its {numWord(nProngs)} parts stands, Objection {o.numeral} stands, so the Defender has to answer all {numWord(nProngs)}.
                        </>
                      ) : nProngs === 2 ? (
                        <>If either part stands, Objection {o.numeral} stands, so the Defender has to answer both.</>
                      ) : (
                        <>If its one argument stands, Objection {o.numeral} stands, so the Defender has to answer it.</>
                      )}
                    </p>
                  )}

                  {oid === "nature" && <Echo full={wide} />}
                </header>

                {/* Tablets: the chart of every move, before the parts. (Phones: after them, folded.) */}
                {!narrow && mapBlock}

                {/* ---------- part chips ---------- */}
                {nProngs > 1 && (
                  <nav className="ch-prongs" aria-label="Parts of this objection">
                    <p className="ch-prongs-k">{cap(numWord(nProngs))} parts · pick one to follow</p>
                    <ol>
                      {o.prongs.map((p, i) => {
                        const l = labels.node.get(p.id) ?? "undec";
                        const on = p.id === curProng;
                        const call = judgments[p.id];
                        const shown = shownLabel(l, call);
                        return (
                          <li key={p.id}>
                            <button
                              type="button"
                              className={`ch-prong s-${p.side} st-${shown} ${on ? "on" : ""}`}
                              aria-current={on ? "true" : undefined}
                              onClick={() => focus(p.id, "link")}
                            >
                              <span className="ch-prong-k">
                                Part {i + 1} of {nProngs}
                              </span>
                              <span className="ch-prong-l">
                                <Glyph side={p.side} label={shown} size={11} />
                                <span className={answeredMark(l, call) ? "lab-out" : ""}>{toPlain(p.label)}</span>
                              </span>
                              <span className={`ch-prong-st st-${shown}`}>
                                {call ? (
                                  <>
                                    <YouMark size={9} className="ch-you" />
                                    <span className="your-call">{statusText(l, call)}</span>
                                  </>
                                ) : (
                                  STATUS_WORD[l]
                                )}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </nav>
                )}

                {narrow && mapBlock}

                {/* Wide screens: the chart sits top right but comes last in the tab order; this skips to it. */}
                {wide && ready && (
                  <button
                    type="button"
                    className="ch-skip"
                    onClick={() => document.querySelector<SVGGElement>(".ch-side .ch-cn[tabindex='0']")?.focus()}
                  >
                    Skip to the chart of all moves
                  </button>
                )}

                {!wide && ready && focusId && <Locator o={o} focusId={focusId} path={path} />}
                {ready ? <Thread /> : <p className="ch-missing">I haven’t written this one yet.</p>}
                <p className="sr-only" role="status" aria-live="polite">
                  {said.text ? `${said.text}${said.n % 2 ? " " : ""}` : ""}
                </p>

                {/* ---------- where Spinoza stands ---------- */}
                {hasScholium && (
                  <section className="ch-scholium s-spinoza" aria-labelledby="ch-schol-h">
                    <span className="ch-scholium-hatch" aria-hidden />
                    <p className="ch-scholium-k">
                      <Glyph side="spinoza" label="undec" size={10} /> {/spinoza stands/i.test(spin.title ?? "") ? "Spinoza" : "Where Spinoza stands"}
                    </p>
                    <h2 className="ch-scholium-h" id="ch-schol-h">
                      {spin.title ? toPlain(spin.title) : "Where Spinoza stands"}
                    </h2>
                    {spinBody.map((p, i) => (
                      <p key={i} className="ch-scholium-p">
                        <RichText text={p} onNode={jump} />
                      </p>
                    ))}
                    {spin.quote && spin.quote.text && (
                      <figure className="ch-quote ch-scholium-q">
                        <blockquote>
                          <p>{spin.quote.text}</p>
                        </blockquote>
                        {(spin.quote.who || spin.quote.cite || spin.quote.url) && (
                          <figcaption>
                            {spin.quote.who && <span className="ch-quote-who">{spin.quote.who}</span>}
                            {spin.quote.cite && <span className="ch-quote-cite">{spin.quote.cite}</span>}
                            {spin.quote.url && <ContextLink url={spin.quote.url} />}
                          </figcaption>
                        )}
                      </figure>
                    )}
                  </section>
                )}

                {/* ---------- further reading ---------- */}
                {o.reading && o.reading.length > 0 && (
                  <section className="ch-reading" aria-labelledby="ch-read-h">
                    <h2 className="ch-reading-h" id="ch-read-h">
                      Further reading
                    </h2>
                    <ol className="ch-reading-list">
                      {o.reading.map((s, i) => (
                        <li key={i}>
                          <span className="ch-reading-n">{String(i + 1).padStart(2, "0")}</span>
                          <div>
                            {s.url ? (
                              <a className="ch-reading-t" href={s.url} target="_blank" rel="noopener noreferrer">
                                {s.title}
                                <span aria-hidden> ↗</span>
                              </a>
                            ) : (
                              <span className="ch-reading-t">{s.title}</span>
                            )}
                            {(s.by || s.year) && (
                              <span className="ch-reading-by">
                                {s.by}
                                {s.by && s.year ? " · " : ""}
                                {s.year ?? ""}
                              </span>
                            )}
                            {s.note && <p className="ch-reading-note">{s.note}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                {/* ---------- prev / next ---------- */}
                <nav className="ch-pn" aria-label="Other objections">
                  {prevO ? (
                    <button type="button" className="ch-pn-link prev" onClick={() => go({ view: "objection", o: prevO.id })}>
                      <span className="ch-pn-k">
                        <span aria-hidden>←</span> Objection {prevO.numeral}
                      </span>
                      <span className="ch-pn-t">{toPlain(prevO.title)}</span>
                    </button>
                  ) : (
                    <button type="button" className="ch-pn-link prev" onClick={() => go({ view: "home" })}>
                      <span className="ch-pn-k">
                        <span aria-hidden>←</span> The map
                      </span>
                      <span className="ch-pn-t">All {numWord(d.objections.length)} objections</span>
                    </button>
                  )}
                  {nextO ? (
                    <button type="button" className="ch-pn-link next" onClick={() => go({ view: "objection", o: nextO.id })}>
                      <span className="ch-pn-k">
                        Objection {nextO.numeral} <span aria-hidden>→</span>
                      </span>
                      <span className="ch-pn-t">{toPlain(nextO.title)}</span>
                    </button>
                  ) : (
                    <button type="button" className="ch-pn-link next" onClick={() => go({ view: "ledger" })}>
                      <span className="ch-pn-k">
                        Where you stand <span aria-hidden>→</span>
                      </span>
                      <span className="ch-pn-t">Your calls on all {numWord(d.objections.length)} objections</span>
                    </button>
                  )}
                </nav>
              </div>

              {wide && ready && (
                <aside className="ch-side" aria-label="All moves in this objection">
                  <div className="ch-panel">{chart("panel")}</div>
                </aside>
              )}
            </div>
          </div>
        </RippleCtx.Provider>
      </ChamberCtx.Provider>
    </ChamberStaticCtx.Provider>
  );
}
