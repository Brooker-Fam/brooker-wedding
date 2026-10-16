"use client";

/* The Long Conversation (#/play): put the disputation's moments in order.
   The line runs down the page, oldest first, with the objections as threads
   down its left edge; each card marks the threads it comes up in, so the weave
   fills in as a round goes. The card in hand sits in a dock pinned to the
   bottom of the screen, and a placed card opens on the line with its year and
   story. The rules live in ../play.ts. */

import "./library.css";
import "./play.css";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useAtlas } from "../context";
import { deal, isOver, next, place, readRecord, score, streak, writeRecord, type PlayRecord, type Result, type Round } from "../play";
import { Glyph, RichText, ThinkerChip } from "../primitives";
import { formatRoute } from "../router";
import type { Moment, Objection, Side } from "../types";
import { eraOf, scrollBehavior } from "./Outline";
import { QuoteFigure } from "./OutlineList";
import { MGlyph, MSIDE_WORD, quoteOf } from "./Timeline";

/* A round survives a trip to a move and back (the view remounts); a reload deals a new one. */
let kept: { slug: string; round: Round; newBest: boolean; open: string | null } | null = null;

const NUM = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const num = (n: number) => NUM[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const vars = (v: Record<string, number>) => v as CSSProperties;
const WHO: Record<Side, string> = { skeptic: "The Objector", theist: "The Defender", spinoza: "Spinoza" };

type Mark = "start" | "ok" | "earlier" | "later" | null;
const MARK_SAID = { ok: "Placed right.", earlier: "Moved earlier.", later: "Moved later." };
const markFor = (r: Result): Mark => r.dir ?? "ok";

function headline(r: Result, run: number): string {
  if (!r.off) return run >= 3 ? `Right where it belongs. ${cap(num(run))} in a row.` : "Right where it belongs.";
  return r.off === 1 ? `One place off: it came ${r.dir}.` : `Not quite: it came ${r.dir}.`;
}

function roundSay(s: number, n: number): string {
  if (s === n) return "A perfect line.";
  if (s >= n - 2) return "You know your centuries.";
  if (s * 2 >= n) return "A good line, with a few surprises.";
  return "Plenty of surprises in this one.";
}

/** The row's scroll-margin-top keeps it clear of the sticky top bar. */
function bringIntoView(el: HTMLElement) {
  requestAnimationFrame(() => {
    const r = el.getBoundingClientRect();
    const top = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const bottom = window.innerHeight - 12;
    if (r.top >= top && r.bottom <= bottom) return;
    el.scrollIntoView({ block: r.height > bottom - top ? "start" : "nearest", behavior: scrollBehavior() });
  });
}

/* ------------------------------------------------------------------ */
/* the weave: which stretch of each objection's thread is lit           */
/* ------------------------------------------------------------------ */

interface RowThreads {
  up: boolean[];
  down: boolean[];
  /** The threads (objection indexes) this card comes up in. */
  on: number[];
}

function useWeave(line: Moment[], objections: Objection[]) {
  return useMemo(() => {
    const spans = objections.map((o) => {
      const hits = line.flatMap((m, i) => (m.strands.includes(o.id) ? [i] : []));
      return hits.length ? [hits[0], hits[hits.length - 1]] : [Infinity, -Infinity];
    });
    /** Gap k lies between cards k-1 and k. */
    const gap = (k: number) => spans.map(([f, l]) => f < k && k <= l);
    const row = (i: number): RowThreads => ({
      up: spans.map(([f, l]) => f < i && i <= l),
      down: spans.map(([f, l]) => f <= i && i < l),
      on: objections.flatMap((o, j) => (line[i].strands.includes(o.id) ? [j] : [])),
    });
    return { gap, row };
  }, [line, objections]);
}

function Threads({ lit }: { lit: boolean[] }) {
  return (
    <span className="pl-threads" aria-hidden>
      {lit.map((on, j) => (
        <span key={j} className={`pl-thr${on ? " lit" : ""}`} style={vars({ "--j": j })} />
      ))}
    </span>
  );
}

function Knot({ t, side }: { t: RowThreads; side: Moment["side"] }) {
  const a = Math.min(...t.on);
  const b = Math.max(...t.on);
  return (
    <span className="pl-threads" aria-hidden>
      {t.up.map((on, j) => (
        <span key={`u${j}`} className={`pl-thr up${on ? " lit" : ""}`} style={vars({ "--j": j })} />
      ))}
      {t.down.map((on, j) => (
        <span key={`d${j}`} className={`pl-thr down${on ? " lit" : ""}`} style={vars({ "--j": j })} />
      ))}
      <span className={`pl-knot s-${side}`}>
        {t.on.length > 1 && <span className="pl-knot-bar" style={vars({ "--a": a, "--b": b })} />}
        {t.on.length ? (
          t.on.map((j) => (
            <span key={j} className="pl-dot" style={vars({ "--j": j })}>
              <MGlyph side={side} size={10} filled />
            </span>
          ))
        ) : (
          <span className="pl-dot pl-dot-free">
            <MGlyph side={side} size={10} filled />
          </span>
        )}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* the line                                                             */
/* ------------------------------------------------------------------ */

function Gap({
  k,
  before,
  after,
  title,
  lit,
  grow,
  onPlace,
}: {
  k: number;
  before?: Moment;
  after?: Moment;
  title: string;
  lit: boolean[];
  /** Off on a return visit, where the shell restores scroll against the gaps' full height. */
  grow: boolean;
  onPlace: (k: number) => void;
}) {
  const where =
    before && after
      ? `between ${before.title} (${before.when}) and ${after.title} (${after.when})`
      : after
        ? `before ${after.title} (${after.when})`
        : `after ${before?.title} (${before?.when})`;
  return (
    <button
      type="button"
      className={`pl-gap${grow ? " grow" : ""}`}
      onClick={(e) => {
        // The second click of a double-click on Next lands on whatever gap slid under the pointer.
        if (e.detail > 1) return;
        onPlace(k);
      }}
      aria-label={`Place it ${where}`}
    >
      <Threads lit={lit} />
      <span className="pl-gap-rule" aria-hidden />
      <span className="pl-gap-plus" aria-hidden>
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M5 1.5v7M1.5 5h7" />
        </svg>
      </span>
      <span className="pl-gap-pill" aria-hidden>
        {title}
      </span>
    </button>
  );
}

function GuessMark({ lit }: { lit: boolean[] }) {
  return (
    <div className="pl-guess">
      <Threads lit={lit} />
      <span className="pl-guess-rule" aria-hidden />
      <span className="pl-guess-t">Your guess</span>
    </div>
  );
}

function MarkIcon({ mark, quiet = false }: { mark: Mark; quiet?: boolean }) {
  if (!mark) return null;
  if (mark === "start") return <span className="pl-mark start">Start</span>;
  return (
    <span className={`pl-mark ${mark}`}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        {mark === "ok" ? <path d="M2.6 7.4 5.6 10.2 11.4 3.8" /> : mark === "earlier" ? <path d="M7 11.8V2.6M3.4 6.2 7 2.6l3.6 3.6" /> : <path d="M7 2.2v9.2M3.4 7.8 7 11.4l3.6-3.6" />}
      </svg>
      {!quiet && <span className="sr-only">{MARK_SAID[mark]}</span>}
    </span>
  );
}

function Story({
  m,
  result,
  run,
  where,
  verdictRef,
  onNext,
  last,
}: {
  m: Moment;
  result?: Result;
  run: number;
  where: string;
  verdictRef: RefObject<HTMLParagraphElement | null>;
  onNext?: () => void;
  last: boolean;
}) {
  const { ix } = useAtlas();
  const info = m.node ? ix.nodes.get(m.node) : undefined;
  const parent = info?.parent ? ix.nodes.get(info.parent) : undefined;
  const o = info ? ix.objections.get(info.objection) : undefined;
  const threads = m.strands.map((s) => ix.objections.get(s)).filter((x): x is Objection => !!x);
  return (
    <div className="pl-story">
      {result && (
        <p ref={verdictRef} tabIndex={-1} className={`pl-verdict ${result.off ? "miss" : "ok"}`}>
          <MarkIcon mark={markFor(result)} quiet />
          <span>
            {headline(result, run)}
            {result.off > 0 && (
              <span className="pl-verdict-n" aria-hidden>
                {" "}
                Your guess is the dashed line {result.dir === "earlier" ? "below" : "above"}.
              </span>
            )}
            <span className="sr-only">{` ${m.title}, ${m.when}, goes ${where}.`}</span>
          </span>
        </p>
      )}
      <p className="pl-text">
        <RichText text={m.text} />
      </p>
      <QuoteFigure q={quoteOf(m, ix)} className="pl-quote" />
      {info && o && (
        <div className="pl-arg">
          <p className="pl-k">In the argument</p>
          <a className={`pl-move s-${info.node.side}`} href={formatRoute({ view: "objection", o: o.id, node: info.node.id })}>
            <Glyph side={info.node.side} size={12} />
            <span>{info.node.label}</span>
          </a>
          <p className="pl-move-at">{`${WHO[info.node.side]} · Objection ${o.numeral}, ${o.short} · Round ${info.depth}`}</p>
          <p className="pl-gist">
            <RichText text={info.node.gist} />
          </p>
          {parent && (
            <p className="pl-answers">
              <span className="pl-answers-k">It answers</span>
              <a className={`pl-move small s-${parent.node.side}`} href={formatRoute({ view: "objection", o: o.id, node: parent.node.id })}>
                <Glyph side={parent.node.side} size={10} />
                <span>{parent.node.label}</span>
              </a>
            </p>
          )}
        </div>
      )}
      <div className="pl-tags">
        {m.thinker && <ThinkerChip id={m.thinker} />}
        {threads.map((t) => (
          <a key={t.id} className="pl-tag" href={formatRoute({ view: "objection", o: t.id })}>
            <span className="pl-tag-n">{t.numeral}</span>
            {t.short}
          </a>
        ))}
      </div>
      {onNext && (
        <div className="pl-acts">
          <button type="button" className="btn solid" onClick={onNext}>
            {last ? "See how you did" : "Next card"} <span aria-hidden>→</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Row({
  m,
  t,
  mark,
  open,
  fresh,
  arrive,
  result,
  run,
  where,
  last,
  onNext,
  toggle,
}: {
  m: Moment;
  t: RowThreads;
  mark: Mark;
  open: boolean;
  fresh: boolean;
  /** Placed during this visit, so it takes focus (on a return the shell restores focus and scroll instead). */
  arrive: boolean;
  result?: Result;
  run: number;
  where: string;
  last: boolean;
  onNext?: () => void;
  toggle?: () => void;
}) {
  const { thinkerName } = useAtlas();
  const ref = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!arrive || !ref.current) return;
    verdictRef.current?.focus({ preventScroll: true });
    bringIntoView(ref.current);
  }, [arrive]);

  const head = (
    <>
      <span className="pl-when">
        {m.when}
        {open && <span className="pl-era"> · {eraOf(m.year).name}</span>}
      </span>
      <span className="pl-title">{m.title}</span>
      {m.thinker && <span className="pl-who">{thinkerName(m.thinker)}</span>}
      <MarkIcon mark={mark} />
    </>
  );
  return (
    <div ref={ref} className={`pl-row s-${m.side}${open ? " is-open" : ""}${fresh ? " is-new" : ""}`}>
      <Knot t={t} side={m.side} />
      {toggle ? (
        <button type="button" className="pl-row-main" aria-expanded={open} onClick={toggle}>
          {head}
        </button>
      ) : (
        <div className="pl-row-main">{head}</div>
      )}
      {open && <Story m={m} result={result} run={run} where={where} verdictRef={verdictRef} onNext={onNext} last={last} />}
    </div>
  );
}

function Weave({
  round,
  line,
  inHand,
  acted,
  open,
  setOpen,
  onPlace,
  onNext,
}: {
  round: Round;
  line: Moment[];
  inHand?: Moment;
  acted: boolean;
  open: string | null;
  setOpen: (id: string | null) => void;
  onPlace: (k: number) => void;
  onNext: () => void;
}) {
  const { d } = useAtlas();
  const weave = useWeave(line, d.objections);
  const over = isOver(round);
  const res = round.placed ? round.results[round.placed] : undefined;
  const guessAt = res?.off ? res.guess : -1;
  const n = line.length;
  const markOf = (id: string): Mark => (id === round.anchor ? "start" : round.results[id] ? markFor(round.results[id]) : null);
  const gap = (k: number) => inHand && <Gap k={k} before={line[k - 1]} after={line[k]} title={inHand.title} lit={weave.gap(k)} grow={acted} onPlace={onPlace} />;
  const where = (i: number) => {
    const [b, a] = [line[i - 1], line[i + 1]];
    return b && a ? `between ${b.title} and ${a.title}` : b ? `after ${b.title}` : a ? `before ${a.title}` : "on the line";
  };

  return (
    <div className="pl-weave">
      <div className="pl-lanes" aria-hidden>
        <Threads lit={d.objections.map(() => false)} />
        {d.objections.map((o, j) => (
          <span key={o.id} className={`pl-lane-n${j % 2 ? " lo" : ""}`} style={vars({ "--j": j })} title={`Objection ${o.numeral}: ${o.short}`}>
            {o.numeral}
          </span>
        ))}
        <span className="pl-end">Earlier</span>
      </div>
      <ol className="pl-line" aria-label="Your line, earliest first">
        {line.map((m, i) => {
          const fresh = m.id === round.placed;
          return (
            <li key={m.id}>
              {gap(i)}
              {guessAt === i && <GuessMark lit={weave.gap(i)} />}
              <Row
                m={m}
                t={weave.row(i)}
                mark={markOf(m.id)}
                open={fresh || (over && open === m.id)}
                fresh={fresh}
                arrive={fresh && acted}
                result={fresh ? res : undefined}
                run={fresh ? streak(round) : 0}
                where={fresh ? where(i) : ""}
                last={round.turn === round.deck.length - 1}
                onNext={fresh ? onNext : undefined}
                toggle={over ? () => setOpen(open === m.id ? null : m.id) : undefined}
              />
            </li>
          );
        })}
        {(inHand || guessAt === n) && (
          <li>
            {gap(n)}
            {guessAt === n && <GuessMark lit={weave.gap(n)} />}
          </li>
        )}
      </ol>
      <div className="pl-lanes pl-lanes-foot" aria-hidden>
        <span className="pl-end">Later</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* the card in hand · the tally · the end of a round                    */
/* ------------------------------------------------------------------ */

function Dock({ m, n, total, focus }: { m: Moment; n: number; total: number; focus: boolean }) {
  const { ix, thinkerName } = useAtlas();
  const ref = useRef<HTMLHeadingElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focus) ref.current?.focus({ preventScroll: true });
  }, [focus]);
  useEffect(() => {
    const el = dock.current;
    if (!el) return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => root.style.setProperty("--pl-dock-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--pl-dock-h");
    };
  }, []);
  const threads = m.strands.map((s) => ix.objections.get(s)).filter((o): o is Objection => !!o);
  return (
    <div ref={dock} className="pl-dock">
      <div className={`pl-card s-${m.side}`}>
        <p className="pl-card-top">
          <span className="pl-card-side">
            <MGlyph side={m.side} size={10} filled />
            {MSIDE_WORD[m.side]}
          </span>
          <span className="pl-card-n">
            Card {n} of {total}
          </span>
        </p>
        <h2 ref={ref} tabIndex={-1} className="pl-card-t">
          {m.title}
        </h2>
        <p className="pl-card-sub">
          {m.thinker && <span className="pl-card-who">{thinkerName(m.thinker)}</span>}
          <span className="pl-card-threads">{threads.length ? threads.map((o) => `${o.numeral} ${o.short}`).join(" · ") : "Background to all five"}</span>
        </p>
        {n === 1 && <p className="pl-card-hint">Choose the gap on the line where you think it belongs.</p>}
      </div>
    </div>
  );
}

function Tally({ round, record }: { round: Round; record: PlayRecord }) {
  const total = round.deck.length;
  const s = score(round);
  return (
    <div className="pl-tally">
      <ol className="pl-pips" aria-hidden>
        {round.deck.map((id, i) => {
          const r = round.results[id];
          return <li key={id} className={`pl-pip${r ? (r.off ? " miss" : " ok") : i === round.turn ? " now" : ""}`} />;
        })}
      </ol>
      <p className="pl-tally-t">
        {isOver(round) ? `${s} of ${total} right` : `Card ${Math.min(round.turn + 1, total)} of ${total} · ${s} right`}
        {record.best > 0 && <span className="pl-best">{` · Best ${record.best} of ${total}`}</span>}
      </p>
    </div>
  );
}

function Summary({ round, record, newBest, onDeal, headRef }: { round: Round; record: PlayRecord; newBest: boolean; onDeal: () => void; headRef: RefObject<HTMLHeadingElement | null> }) {
  const { d, ix } = useAtlas();
  const total = round.deck.length;
  const s = score(round);
  const line = round.line.map((id) => ix.moments.get(id)).filter((m): m is Moment => !!m);
  const first = line[0];
  const last = line[line.length - 1];
  const people = [...new Set(line.flatMap((m) => (m.thinker ? [m.thinker] : [])))];
  const best = newBest ? " A new best." : record.rounds > 1 ? ` Your best is ${record.best} of ${total}.` : "";
  return (
    <section className="pl-sum" aria-labelledby="pl-sum-h">
      <p className="pl-k">Round over</p>
      <h2 id="pl-sum-h" ref={headRef} tabIndex={-1} className="pl-sum-h">
        {s ? cap(num(s)) : "None"} of {num(total)} in the right place
      </h2>
      <p className="pl-sum-say">
        {roundSay(s, total)}
        {best}
      </p>
      {first && last && (
        <p className="pl-sum-span">
          Your line runs from <em>{first.title}</em> ({first.when}) to <em>{last.title}</em> ({last.when}), {(last.year - first.year).toLocaleString("en-US")} years of
          the argument in {num(line.length)} moments.
        </p>
      )}
      <div className="pl-sum-grid">
        <div>
          <p className="pl-k">People you met</p>
          <div className="pl-sum-people">
            {people.map((id) => (
              <ThinkerChip key={id} id={id} />
            ))}
          </div>
        </div>
        <div>
          <p className="pl-k">The threads</p>
          <ul className="pl-sum-threads">
            {d.objections.map((o) => {
              const k = line.filter((m) => m.strands.includes(o.id)).length;
              return (
                <li key={o.id}>
                  <a href={formatRoute({ view: "objection", o: o.id })}>
                    <span className="pl-tag-n">{o.numeral}</span>
                    <span className="pl-sum-tt">{o.title}</span>
                  </a>
                  <span className="pl-sum-k">{k ? `${num(k)} card${k === 1 ? "" : "s"}` : "none this round"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="pl-sum-tip">Open any card on the line to read its story again.</p>
      <div className="pl-acts">
        <button type="button" className="btn solid" onClick={onDeal}>
          Deal another round
        </button>
        <a className="btn" href={formatRoute({ view: "timeline" })}>
          All {d.moments.length} on the timeline
        </a>
      </div>
    </section>
  );
}

function Head({ total, years, children }: { total: number; years: number; children?: ReactNode }) {
  return (
    <header className="pl-head">
      <p className="pl-k">A game</p>
      <h1 className="lib-h1 display" tabIndex={-1}>
        The Long <em>Conversation</em>
      </h1>
      {total > 0 ? (
        <p className="lib-dek pl-dek">
          {cap(num(total))} moments from {years.toLocaleString("en-US")} years of the argument, dealt one at a time. Put each where you think it belongs on the
          line. Right or wrong, the card goes to its place and tells you its story. There is no timer.
        </p>
      ) : (
        <p className="lib-dek">This game needs moments on the timeline, and this disputation has none yet.</p>
      )}
      {children}
    </header>
  );
}

function Legend({ threads }: { threads: number }) {
  return (
    <p className="pl-legend">
      <span className="pl-legend-i" aria-hidden>
        <svg width="36" height="18" viewBox="0 0 36 18">
          <path d="M4 0v18M11 0v18M18 0v18M25 0v18M32 0v18" className="thr" />
          <path d="M11 9h14" className="bar" />
          <circle cx="11" cy="9" r="2.8" className="dot" />
          <circle cx="25" cy="9" r="2.8" className="dot" />
        </svg>
      </span>
      The lines down the left are the {num(threads)} objections. Each card marks the ones it comes up in, and a thread lights up between its cards.
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Play                                                                 */
/* ------------------------------------------------------------------ */

export default function Play() {
  const { d, ix } = useAtlas();
  const yearOf = useCallback((id: string) => ix.moments.get(id)?.year ?? 0, [ix]);
  const [round, setRound] = useState<Round>(() => (kept?.slug === d.slug ? kept.round : deal(d.moments)));
  const [newBest, setNewBest] = useState(() => (kept?.slug === d.slug ? kept.newBest : false));
  const [record, setRecord] = useState<PlayRecord>(() => readRecord(d.slug));
  const [open, setOpen] = useState<string | null>(() => (kept?.slug === d.slug ? kept.open : null));
  const [acted, setActed] = useState(false);
  const sumHead = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    kept = { slug: d.slug, round, newBest, open };
  }, [d.slug, round, newBest, open]);

  const over = isOver(round);
  const line = useMemo(() => round.line.map((id) => ix.moments.get(id)).filter((m): m is Moment => !!m), [round.line, ix]);
  const inHand = over || round.placed ? undefined : ix.moments.get(round.deck[round.turn]);
  const total = round.deck.length;
  const years = useMemo(() => {
    const ys = d.moments.map((m) => m.year);
    return Math.floor((Math.max(...ys) - Math.min(...ys)) / 100) * 100;
  }, [d.moments]);

  useEffect(() => {
    if (!over || !acted) return;
    const h = sumHead.current;
    h?.focus({ preventScroll: true });
    h?.closest("section")?.scrollIntoView({ block: "start", behavior: scrollBehavior() });
  }, [over, acted]);

  const onPlace = (k: number) => {
    setActed(true);
    setRound(place(round, k, yearOf));
  };

  const onNext = () => {
    const r = next(round);
    setActed(true);
    setRound(r);
    if (!isOver(r)) return;
    const s = score(r);
    const rec = { best: Math.max(record.best, s), rounds: record.rounds + 1 };
    setNewBest(record.rounds > 0 && s > record.best);
    setRecord(rec);
    writeRecord(d.slug, rec);
  };

  const onDeal = () => {
    setRound(deal(d.moments));
    setNewBest(false);
    setOpen(null);
    setActed(true);
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };

  if (d.moments.length < 2) {
    return (
      <div className="lib pl">
        <Head total={0} years={0} />
      </div>
    );
  }

  return (
    <div className="lib pl">
      <Head total={total} years={years}>
        <Tally round={round} record={record} />
      </Head>
      {over && <Summary round={round} record={record} newBest={newBest} onDeal={onDeal} headRef={sumHead} />}
      <Legend threads={d.objections.length} />
      <div className="pl-board">
        {inHand && <Dock key={inHand.id} m={inHand} n={round.turn + 1} total={total} focus={acted} />}
        <Weave round={round} line={line} inHand={inHand} acted={acted} open={open} setOpen={setOpen} onPlace={onPlace} onNext={onNext} />
      </div>
    </div>
  );
}
