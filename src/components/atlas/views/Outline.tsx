"use client";

/* Library · Outline (#/outline): every move as nested lists, with the
   reader's statuses and links into each objection.

   This file also hosts the small pieces every Library view shares (header +
   library tabs, node chips, the footprint Rose, era buckets, a media-query
   hook, text folding), so Timeline / Cast / Lexicon import them from here. */

import "./library.css";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useAtlas } from "../context";
import { address } from "../helpers";
import { Glyph } from "../primitives";
import { formatRoute } from "../router";
import type { Disputation, ObjectionId, Quote, Side } from "../types";
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

type LibView = "timeline" | "cast" | "lexicon" | "outline";
const TABS: { view: LibView; word: string }[] = [
  { view: "timeline", word: "Timeline" },
  { view: "cast", word: "People" },
  { view: "lexicon", word: "Glossary" },
  { view: "outline", word: "Outline" },
];

/** The Library's own tab row (Timeline · People · Glossary · Outline). Views with nothing in them yet say "soon". */
export function LibTabs({ current }: { current: LibView }) {
  const { d } = useAtlas();
  const empty: Record<LibView, boolean> = {
    timeline: d.moments.length === 0,
    cast: d.thinkers.length === 0,
    lexicon: d.terms.length === 0,
    outline: false,
  };
  return (
    <nav className="lib-tabs" aria-label="Library">
      <span className="lib-tabs-k mono" aria-hidden>
        Library
      </span>
      <ul>
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

/** Header shared by every Library view: library tabs, H1 (focused by the shell), dek. */
export function LibHead({
  current,
  title,
  dek,
  meta,
  tabs = true,
  className = "",
  children,
}: {
  current: LibView;
  title: ReactNode;
  dek?: ReactNode;
  meta?: ReactNode;
  /** Render the tab row (false when the view places <LibTabs> itself). */
  tabs?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={`lib-head ${className}`}>
      {tabs && <LibTabs current={current} />}
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

/** "Holds"/"Fails" are only ever the reader's own calls; everything else is computed on them. */
export function statusWord(l: "in" | "out" | "undec", call?: "holds" | "fails"): string {
  if (call) return `Your call: ${call === "holds" ? "Holds" : "Fails"}`;
  return l === "in" ? "Stands" : l === "out" ? "Answered" : "Open";
}

/** A move as a chip: status glyph + address + status word + label → the move in its chamber. */
export function NodeChip({ id, className = "" }: { id: string; className?: string }) {
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
      className={`lib-node s-${side} st-${l} ${className}`}
      href={formatRoute({ view: "objection", o: info.objection, node: id })}
      title={`${addr} · ${SIDE_WORD[side]} · ${status} · ${label}`}
      data-node={id}
    >
      <Glyph side={side} label={l} size={11} />
      <span className="lib-node-addr mono">
        {addr}
        <span className={`lib-node-st st-${l} ${call ? "called" : ""}`}>
          <span aria-hidden> · </span>
          <span className="sr-only">, </span>
          {status}
        </span>
      </span>
      <span className={`lib-node-lab ${l === "out" ? "lab-out" : ""}`}>
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
export function Appearances({ ids, limit }: { ids: string[]; limit?: number }) {
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
                <NodeChip id={id} />
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
export function FootprintBlock({ ids, title, caption, limit, roseSize = 112 }: { ids: string[]; title: ReactNode; caption?: ReactNode; limit?: number; roseSize?: number }) {
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
        <Appearances ids={ids} limit={limit} />
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

  const jump = (o: ObjectionId) => {
    const el = document.getElementById(`ol-${o}`);
    if (!el) return;
    el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    const h = el.querySelector("h2");
    if (h instanceof HTMLElement) {
      h.tabIndex = -1;
      h.focus({ preventScroll: true });
    }
  };
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
      <LibHead
        current="outline"
        title="Outline"
        dek={
          <>
            Every move is here in one list, each reply indented under the claim it answers. It reads straight through and prints well.
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
        <nav className="ol-toc" aria-label="Jump to an objection">
          {d.objections.map((o) => {
            const l = labels.objection.get(o.id) ?? "undec";
            const short = o.short || o.title;
            return (
              <button key={o.id} type="button" className="ol-toc-btn" onClick={() => jump(o.id)} aria-label={`Objection ${o.numeral}, ${short}, ${OBJ_STATUS[l]}`} title={`${short} · ${OBJ_STATUS[l]}`}>
                <span className={`ol-toc-pip st-${l}`} aria-hidden />
                <span className="serif ol-toc-num">{o.numeral}</span>
                <span className="ol-toc-word mono">{short}</span>
              </button>
            );
          })}
        </nav>
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
