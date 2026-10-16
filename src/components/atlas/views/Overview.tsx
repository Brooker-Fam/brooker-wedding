"use client";

/* The overview (#/): the 30-second layer of the disputation.
   Hero with a plumb line dropping into the Rose (called "the map" on screen) ·
   a "last time" strip for returning readers · where to start (Objection I, step
   through it, or all five) · the Aquinas epigraph, the one place the medieval
   form is explained · the map and its key · who's talking, which doubles as the
   glyph key, each voice with a line in its own words (across the full width on
   desktop) · how it works · five posters (one per objection, each with its own
   small fan of moves).
   On phones the hero is one column in reading order: what this is, where to
   start, the epigraph (his reply folded away), the map, how it works, then the
   voices.
   The pocket edition (phones, and tablets where it helps): the hero fits the
   first screen; the map is a touch dial (Rose `dial`); how it works folds into
   three rows; who's talking is a row of four tiles with one voice shown; and
   the five objections are a deck of cards in a native scroll-snap row with
   pager dots (still a plain ordered list to keyboards and screen readers).
   Every build-in is CSS, so the server HTML paints complete and animates
   before hydration, and every phone layout is CSS too (no swap on hydration). */

import "./overview.css";
import { motion } from "framer-motion";
import { memo, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useAtlas } from "../context";
import { objectionStats, objectionStatsParts } from "../helpers";
import { Glyph, RichText } from "../primitives";
import { parseHash, viewKey } from "../router";
import type { ArgNode, Label, Objection, ObjectionId, Side } from "../types";
import { StatusPip, YouMark } from "./marks";
import { useRecent } from "./recent";
import Rose from "./Rose";

/* First visit of the session: the build-in (Rose panes, plumb line, echo) plays once. */
let firstVisitDone = false;

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const STATUS_LONG: Record<Label, string> = { in: "Stands", out: "Answered", undec: "Open" };
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

/* ------------------------------------------------------------------ */
/* small drawing helpers                                               */
/* ------------------------------------------------------------------ */

const r2 = (v: number) => Math.round(v * 100) / 100;
const pt = (a: number, r: number) => `${r2(Math.sin(a) * r)},${r2(-Math.cos(a) * r)}`;
function annulus(r0: number, r1: number, a0: number, a1: number): string {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${pt(a0, r1)}A${r1},${r1} 0 ${large} 1 ${pt(a1, r1)}L${pt(a1, r0)}A${r0},${r0} 0 ${large} 0 ${pt(a0, r0)}Z`;
}
function leafCount(n: ArgNode): number {
  const k = n.children ?? [];
  return k.length ? k.reduce((s, c) => s + leafCount(c), 0) : 1;
}
const useSvgId = (prefix: string) => prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");

/** Shared pattern defs (hatch for Spinoza, stipple for answered, glow for stands). */
function PaneDefs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={`${id}-h`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" stroke="#a195bd" strokeOpacity="0.6" strokeWidth="1" />
      </pattern>
      <pattern id={`${id}-s`} width="3.6" height="3.6" patternUnits="userSpaceOnUse">
        <circle cx="1.8" cy="1.8" r="0.55" fill="#a6a394" fillOpacity="0.6" />
      </pattern>
      <radialGradient id={`${id}-l`} cx="50%" cy="50%" r="75%">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** One pane drawn exactly like the Rose's (same classes), for fans and legend swatches. */
function PaneShape({ d, side, label, defs }: { d: string; side: Side; label: Label; defs: string }) {
  return (
    <g className={`rose-pane s-${side} st-${label}`}>
      <path d={d} className="rose-glass" />
      {side === "spinoza" && label !== "in" && <path d={d} fill={`url(#${defs}-h)`} />}
      {label === "out" && <path d={d} fill={`url(#${defs}-s)`} />}
      {label === "in" && <path d={d} fill={`url(#${defs}-l)`} />}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Fan: one objection's moves as a small sunburst wedge                 */
/* ------------------------------------------------------------------ */

const FAN = (148 * Math.PI) / 180;
const FAN_R0 = 15;
const FAN_R = 100;

function Fan({ o, onEnter }: { o: Objection; onEnter: () => void }) {
  const { ix, labels } = useAtlas();
  const defs = useSvgId("fan");
  const maxDepth = Math.max(1, ix.maxDepth);
  const ring = (FAN_R - FAN_R0) / maxDepth;
  const leaves = Math.max(
    1,
    o.prongs.reduce((s, p) => s + leafCount(p), 0),
  );
  const gap = o.prongs.length > 1 ? 0.035 : 0;
  const per = (FAN - gap * Math.max(0, o.prongs.length - 1)) / leaves;
  const panes: { id: string; side: Side; d: string }[] = [];
  let slot = -FAN / 2;
  const place = (n: ArgNode, depth: number) => {
    const a0 = slot;
    const kids = n.children ?? [];
    if (kids.length) kids.forEach((c) => place(c, depth + 1));
    else slot += per;
    const a1 = kids.length ? slot : a0 + per;
    const r0 = FAN_R0 + (depth - 1) * ring + 0.6;
    const shrink = Math.min(0.006, (a1 - a0) * 0.12);
    panes.push({ id: n.id, side: n.side, d: annulus(r0, r0 + ring - 1.2, a0 + shrink, a1 - shrink) });
  };
  o.prongs.forEach((p, i) => {
    if (i > 0) slot += gap;
    place(p, 1);
  });
  const w = FAN_R * Math.sin(FAN / 2) + 2;
  return (
    <svg className="ov-fan" viewBox={`${r2(-w)} ${-FAN_R - 2} ${r2(w * 2)} ${FAN_R + 8}`} aria-hidden onClick={onEnter}>
      <PaneDefs id={defs} />
      {Array.from({ length: maxDepth + 1 }, (_, k) => (
        <path
          key={k}
          d={`M${pt(-FAN / 2 - 0.04, FAN_R0 + k * ring)}A${FAN_R0 + k * ring},${FAN_R0 + k * ring} 0 0 1 ${pt(FAN / 2 + 0.04, FAN_R0 + k * ring)}`}
          className="ov-fan-ring"
        />
      ))}
      {panes.map((p) => (
        <PaneShape key={p.id} d={p.d} side={p.side} label={labels.node.get(p.id) ?? "undec"} defs={defs} />
      ))}
      <circle r={FAN_R0 - 4} className="ov-fan-hub" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces of the page                                                   */
/* ------------------------------------------------------------------ */

function Echo({ reveal }: { reveal: boolean }) {
  // Phones show the objection and the history line; his reply opens in place (Chamber III has it in full).
  const [reply, setReply] = useState(false);
  const replyId = useId();
  return (
    <figure className={`ov-echo${reveal ? " reveal" : ""}${reply ? " open" : ""}`}>
      <blockquote className="ov-echo-q">
        <p>“It seems that everything we see in the world can be accounted for by other principles, supposing God did not exist.”</p>
      </blockquote>
      <figcaption>
        <span className="ov-echo-stamp">
          <span className="ov-nw">Thomas Aquinas</span> · <cite className="ov-nw">Summa Theologiae</cite>{" "}
          <span className="ov-nw">I, q. 2, a. 3, obj. 2</span> · <span className="ov-nw">1265–68</span>
        </span>
        <span className="ov-echo-line">
          In a medieval disputation, the teacher opened each question with the arguments against his own answer. <RichText text="{{aquinas|Aquinas}}" /> wrote
          this objection against himself in the <cite>Summa</cite>.{" "}
          <span className="ov-echo-reply" id={replyId}>
            He replied, “Since nature works for a determinate end under the direction of a higher agent, whatever is done by nature must needs be traced
            back to God, as to its first cause.”
          </span>
        </span>
        <button type="button" className="ov-echo-more" aria-expanded={reply} aria-controls={replyId} onClick={() => setReply((v) => !v)}>
          {reply ? "Hide his reply" : "Read his reply"} <span aria-hidden>{reply ? "▴" : "▾"}</span>
        </button>
      </figcaption>
    </figure>
  );
}

/** A persona's tile: the shared glyph (or ■ for the reader) in a soft square. */
function PersonaTile({ who }: { who: Side | "you" }) {
  return (
    <span className={`ov-tile ${who === "you" ? "you" : `s-${who}`}`} aria-hidden>
      {who === "you" ? <YouMark size={12} /> : <Glyph side={who} size={12} />}
    </span>
  );
}

/** A voice in its own words, under its description. Every line is checked against the source text. */
function PersonaQuote({ text, cite }: { text: string; cite: string }) {
  return (
    <span className="ov-pquote">
      <q>{text}</q>
      <span className="ov-pquote-c">{cite}</span>
    </span>
  );
}

type Who = Side | "you";
const VOICES: { who: Who; tab: string }[] = [
  { who: "skeptic", tab: "Objector" },
  { who: "theist", tab: "Defender" },
  { who: "spinoza", tab: "Spinoza" },
  { who: "you", tab: "You" },
];

/** Who's talking. Wide screens list all four voices; phones show a row of four tiles (which is
    also the glyph key) and the chosen voice under it. The choice is CSS (a class), so the first
    paint is already the phone layout. */
function Personae() {
  const [pick, setPick] = useState<Who>("skeptic");
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pid = (w: Who) => `ov-voice-${base}-${w}`;
  const on = (w: Who) => (pick === w ? " on" : "");
  return (
    <section className="ov-cast" aria-labelledby="ov-cast-h">
      <h2 id="ov-cast-h" className="eyebrow ov-sect-k">
        Who’s talking
      </h2>
      <div className="ov-voices" role="group" aria-label="Pick a voice">
        {VOICES.map((v) => (
          <button
            key={v.who}
            type="button"
            className={`ov-voice ${v.who === "you" ? "you" : `s-${v.who}`}${on(v.who)}`}
            aria-expanded={pick === v.who}
            aria-controls={pid(v.who)}
            onClick={() => setPick(v.who)}
          >
            <PersonaTile who={v.who} />
            <span className="ov-voice-t">{v.tab}</span>
            {pick === v.who && <motion.span layoutId={`ov-voice-ind-${base}`} className="ov-voice-ind" transition={{ type: "spring", stiffness: 520, damping: 38 }} />}
          </button>
        ))}
      </div>
      <dl className="ov-cast-list">
        <div className={`ov-persona s-skeptic${on("skeptic")}`} id={pid("skeptic")}>
          <dt>
            <PersonaTile who="skeptic" />
            <span className="ov-pname">The Objector</span>
          </dt>
          <dd>
            {/* first mentions link to People and the Glossary (the dialogue's title stays in italics) */}
            <span className="ov-pdesc">
              <RichText text="Gives five reasons not to believe in the God of Christianity. He draws on {{plato|Plato}}’s" />{" "}
              <cite>
                <RichText text="[[euthyphro-dilemma|Euthyphro]]" />
              </cite>
              <RichText text={", {{hume|Hume}}, {{nietzsche|Nietzsche}} and {{schellenberg|J.\u00a0L.\u00a0Schellenberg}}, among others."} />
            </span>
            <PersonaQuote text="A wise man, therefore, proportions his belief to the evidence." cite="Hume, Enquiry Concerning Human Understanding, sect. X (1748)" />
          </dd>
        </div>
        <div className={`ov-persona s-theist${on("theist")}`} id={pid("theist")}>
          <dt>
            <PersonaTile who="theist" />
            <span className="ov-pname">The Defender</span>
          </dt>
          <dd>
            <span className="ov-pdesc">
              <RichText text={"Answers for Christianity, often from [[classical-theism|classical theism]], the tradition of {{augustine|Augustine}} and {{aquinas|Aquinas}}, which treats God as the source of everything that exists and not as one more being. {{hart|David Bentley Hart}} defends it today. The Defender also draws on modern Christian thinkers such as the philosopher {{plantinga|Alvin Plantinga}} and the New Testament scholar {{wright-nt|N.\u00a0T.\u00a0Wright}}."} />
            </span>
            <PersonaQuote
              text="[God] is not one more object in the inventory of things that are."
              cite="Hart, “God, Gods, and Fairies,” First Things (June 2013)"
            />
          </dd>
        </div>
        <div className={`ov-persona s-spinoza${on("spinoza")}`} id={pid("spinoza")}>
          <dt>
            <PersonaTile who="spinoza" />
            <span className="ov-pname">
              Spinoza <span className="ov-life">1632–77</span>
            </span>
          </dt>
          <dd>
            <span className="ov-pdesc">
              The Dutch philosopher speaks up now and then. For him God and Nature are one thing, which acts from necessity and chooses nothing. He agrees
              with the Objector that nothing ever breaks the laws of nature, and with the Defender that everything has a reason.
            </span>
            <PersonaQuote text="Whatsoever is, is in God, and without God nothing can be, or be conceived." cite="Spinoza, Ethics, Part I, Proposition 15 (1677)" />
          </dd>
        </div>
        <div className={`ov-persona you${on("you")}`} id={pid("you")}>
          <dt>
            <PersonaTile who="you" />
            <span className="ov-pname">You</span>
          </dt>
          <dd>
            <span className="ov-pdesc">
              You mark moves Holds or Fails.{" "}
              {/* the five status marks sit in the top bar, or in the bottom bar where phones have one */}
              <span className="ov-you-top">The five small symbols at the top of the page show where that leaves each objection.</span>
              <span className="ov-you-dock">The marks under I to V in the bar at the bottom of the screen show where that leaves each objection.</span>
            </span>
            <PersonaQuote text="Prove all things; hold fast that which is good." cite="1 Thessalonians 5:21 (KJV)" />
          </dd>
        </div>
      </dl>
    </section>
  );
}

/** A status swatch: an ochre and a verdigris pane side by side, since a move's colour is its side and only
    its fill shows status (as in the Where-you-stand key). One side only for Spinoza's stripes. */
function Swatch({ sides, label, defs }: { sides: Side[]; label: Label; defs: string }) {
  const two = sides.length > 1;
  const w = two ? 34 : 26;
  const panes = two ? [annulus(24, 38, -0.34, -0.015), annulus(24, 38, 0.015, 0.34)] : [annulus(24, 38, -0.3, 0.3)];
  return (
    <svg className="ov-swatch" viewBox={`0 0 ${w} 18`} width={w} height="18" aria-hidden>
      <g transform={`translate(${w / 2} 40)`}>
        {panes.map((pd, i) => (
          <PaneShape key={i} d={pd} side={sides[i]} label={label} defs={defs} />
        ))}
      </g>
    </svg>
  );
}

/** "One move": a plain outlined block, no side colour and no status. */
function MoveSwatch() {
  return (
    <svg className="ov-swatch" viewBox="0 0 26 18" width="26" height="18" aria-hidden>
      <g transform="translate(13 40)">
        <path d={annulus(24, 38, -0.3, 0.3)} className="ov-moveicon" />
      </g>
    </svg>
  );
}

function HubCaption() {
  return (
    <p className="ov-hubcap">
      <span className="ov-hubk">
        <span className="ov-hubq" aria-hidden>
          ?
        </span>
        At the center
      </span>
      <span className="ov-hubt">Does the Christian God survive these five objections?</span>
    </p>
  );
}

/** How to read the map: under it, on phones and desktop alike. */
function RoseKey() {
  const defs = useSvgId("lg");
  return (
    <section className="ov-key" aria-labelledby="ov-key-h">
      <svg width="0" height="0" className="ov-defs" aria-hidden>
        <PaneDefs id={defs} />
      </svg>
      <h2 id="ov-key-h" className="eyebrow ov-sect-k">
        How to read the map
      </h2>
      <p className="ov-key-lede">
        The circle has one slice per objection. Each block is a move, and the further out it sits, the later the round.
      </p>
      <ul className="ov-key-list">
        <li>
          <MoveSwatch />
          <span>
            One move<span className="sr-only">: one block</span>
          </span>
        </li>
        <li>
          <svg className="ov-swatch" viewBox="0 0 26 18" width="26" height="18" aria-hidden>
            <path d="M3 17a10 10 0 0 1 20 0M8 17a5 5 0 0 1 10 0" className="ov-ringicon" />
          </svg>
          <span>
            One round<span className="sr-only">: one ring of blocks</span>
          </span>
        </li>
        <li>
          <Swatch sides={["skeptic", "theist"]} label="undec" defs={defs} />
          <span>
            Open<span className="sr-only">: a hollow block</span>
          </span>
        </li>
        <li>
          <Swatch sides={["skeptic", "theist"]} label="in" defs={defs} />
          <span>
            Stands<span className="sr-only">: a solid, lit block</span>
          </span>
        </li>
        <li>
          <Swatch sides={["skeptic", "theist"]} label="out" defs={defs} />
          <span>
            Answered<span className="sr-only">: a dotted block</span>
          </span>
        </li>
        <li>
          <Swatch sides={["spinoza"]} label="undec" defs={defs} />
          <span className="ov-key-sp">
            <Glyph side="spinoza" size={11} /> Striped for Spinoza<span className="sr-only">: a block with diagonal stripes</span>
          </span>
        </li>
      </ul>
      <p className="ov-key-note">
        Gold blocks are the Objector’s and green blocks are the Defender’s. A block’s fill shows its status, and it changes as you mark moves.
      </p>
    </section>
  );
}

/** For a returning reader, one strip under the dek: where they were, and the next open objection.
    Its height is fixed per breakpoint and reserved before hydration (Shell's early script marks
    html[data-atl-calls] when calls are stored), so it never pushes the page down as it appears. */
function Resume() {
  const { d, ix, judgments, labels, analysis, go, openNode } = useAtlas();
  const recent = useRecent(d.slug);
  // Only calls on moves that still exist (content can change under stored judgments).
  const judgedIds = Object.keys(judgments).filter((id) => ix.nodes.has(id));
  if (judgedIds.length === 0) return null;

  const known = (o?: ObjectionId) => (o && d.objections.some((x) => x.id === o) ? o : undefined);
  // Most recently touched objection: last call, else last chamber visited, else wherever most calls sit.
  const mostCalls = d.objections.map((o) => ({ o: o.id, n: analysis.get(o.id)?.judged ?? 0 })).sort((a, b) => b.n - a.n)[0]?.o;
  const lastId = known(recent.judged?.o) ?? known(recent.visited?.o) ?? mostCalls;
  const last = d.objections.find((o) => o.id === lastId);
  if (!last) return null;
  const lastLabel = labels.objection.get(last.id) ?? "undec";

  const nextIn = (o: Objection) => analysis.get(o.id)?.next ?? null;
  // Back to the move they last marked there, else the next open move, else the top of the chamber.
  const lastNode = recent.judged?.o === last.id && ix.nodes.has(recent.judged.node) ? recent.judged.node : null;
  const back = () => {
    const n = lastNode ?? (lastLabel === "undec" ? nextIn(last) : null);
    if (n) openNode(n);
    else go({ view: "objection", o: last.id });
  };
  const firstOpen = d.objections.find((o) => o.id !== last.id && (labels.objection.get(o.id) ?? "undec") === "undec");
  const next: { label: ReactNode; run: () => void } = firstOpen
    ? {
        label: (
          <>
            Next open: Objection {firstOpen.numeral} <span aria-hidden>→</span>
          </>
        ),
        run: () => {
          const n = nextIn(firstOpen);
          if (n) openNode(n);
          else go({ view: "objection", o: firstOpen.id });
        },
      }
    : {
        label: (
          <>
            See where you stand <span aria-hidden>→</span>
          </>
        ),
        run: () => go({ view: "ledger" }),
      };

  const status = lastLabel === "in" ? "So far it stands on your calls." : lastLabel === "out" ? "So far you have it answered." : "It’s still open.";

  return (
    <section className="ov-resume" aria-label="Where you left off">
      <p className="ov-resume-t">
        <span className="ov-resume-k">Last time</span> Objection {last.numeral}
        {last.short ? ` · ${last.short}` : ""}. <span className="ov-resume-s">{status}</span>
      </p>
      <div className="ov-resume-btns">
        <button type="button" className="btn solid ov-resume-b" onClick={back}>
          Back to Objection {last.numeral}
        </button>
        <button type="button" className="btn ov-resume-b" onClick={next.run}>
          {next.label}
        </button>
      </div>
    </section>
  );
}

/** Where to start: Objection I, a guided walk through it, or the five at a glance. A returning
    reader's strip above already offers "Back to" and "Next open", so they get only the last. */
function StartHere() {
  const { d, ix, judgments } = useAtlas();
  const first = d.objections[0];
  const returning = Object.keys(judgments).some((id) => ix.nodes.has(id));
  if (!first) return null;
  const count = d.objections.length;
  const toFive = () => {
    const h = document.getElementById("ov-five-h");
    if (!h) return;
    const bar = document.querySelector<HTMLElement>(".atl .sh-bar")?.getBoundingClientRect().bottom ?? 52;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = h.getBoundingClientRect().top + window.scrollY - bar - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "instant" : "smooth" });
    if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
    h.focus({ preventScroll: true });
  };
  const all = (
    <button type="button" className="ov-cta-all" onClick={toFive}>
      See all {NUMBER_WORDS[count] ?? count} <span aria-hidden>↓</span>
    </button>
  );
  if (returning) return <div className="ov-cta returning">{all}</div>;
  return (
    <div className="ov-cta">
      <a className="btn solid ov-cta-go" href={`#/o/${first.id}`}>
        Start with Objection {first.numeral} <span aria-hidden>→</span>
      </a>
      <a className="btn ov-cta-walk" href={`#/walk/${first.id}`}>
        Step through it <span aria-hidden>▶</span>
        <span className="sr-only"> (Objection {first.numeral}, a move at a time)</span>
      </a>
      <p className="ov-cta-cap">Read every round, or go one move at a time and answer as you go.</p>
      {all}
    </div>
  );
}

/** One objection: a wide row on desktop; on phones and tablets a card in the deck (numeral,
    fan, title, question, status and the two ways in; the two sides' summaries wait in the
    chamber). Memoised so a deck snap re-renders only the two cards whose `current` changed. */
const Poster = memo(function Poster({ o, current = false }: { o: Objection; current?: boolean }) {
  const { ix, labels, go, toPlain } = useAtlas();
  const stats = objectionStats(ix, o.id);
  const l = labels.objection.get(o.id) ?? "undec";
  const hid = `ov-p-${o.id}`;
  const enter = () => go({ view: "objection", o: o.id });
  const objection = o.objection?.trim();
  const counter = o.counter?.trim();
  const short = o.short?.trim();
  return (
    <li className={`ov-poster${current ? " is-current" : ""}`}>
      <article aria-labelledby={hid}>
        <span className="ov-pnum" aria-hidden>
          {o.numeral}
        </span>
        <Fan o={o} onEnter={enter} />
        <div className="ov-phead">
          <p className={`ov-pk${short ? " has-short" : ""}`}>
            <span className="ov-pk-o">Objection {o.numeral}</span>
            {short ? (
              <>
                <span className="ov-pk-sep"> · </span>
                <span>{short}</span>
              </>
            ) : null}
          </p>
          <h3 id={hid} className="ov-ptitle">
            <a href={`#/o/${o.id}`}>{toPlain(o.title || short || `Objection ${o.numeral}`)}</a>
          </h3>
          {o.question?.trim() && <p className="ov-pq">{toPlain(o.question)}</p>}
        </div>
        {(objection || counter) && (
          <div className="ov-exchange">
            {objection && (
              <p className="ov-say s-skeptic">
                <span className="ov-cue">
                  <Glyph side="skeptic" size={11} /> The Objector argues
                  <span className="sr-only">: </span>
                </span>
                <span className="ov-saytext">
                  <RichText text={objection} />
                </span>
              </p>
            )}
            {counter && (
              <p className="ov-say s-theist">
                <span className="ov-cue">
                  <Glyph side="theist" size={11} /> The Defender replies
                  <span className="sr-only">: </span>
                </span>
                <span className="ov-saytext">
                  <RichText text={counter} />
                </span>
              </p>
            )}
          </div>
        )}
        <div className="ov-pfoot">
          <p className="ov-meta">
            {objectionStatsParts(stats).map((part) => (
              <span key={part}>{part}</span>
            ))}
          </p>
          <p className={`ov-status st-${l}`}>
            <StatusPip label={l} size={11} />
            <span>{STATUS_LONG[l]}</span>
          </p>
          <div className="ov-pbtns">
            <a className="btn ov-enter" href={`#/o/${o.id}`}>
              Read it <span aria-hidden>→</span>
              <span className="sr-only"> (Objection {o.numeral})</span>
            </a>
            <a className="btn ghost ov-argue" href={`#/walk/${o.id}`}>
              Step through it <span aria-hidden>▶</span>
              <span className="sr-only"> (Objection {o.numeral})</span>
            </a>
          </div>
        </div>
      </article>
    </li>
  );
});

/** The five posters. Desktop: a list of wide rows. Phones and tablets: a deck, a native
    scroll-snap row of cards with the next one peeking in, and pager dots under it. The list
    stays a plain <ol> of articles, so keyboards tab through it and screen readers read it. */
function Deck({ objections }: { objections: Objection[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const cards = el.children;
      if (cards.length < 2) return;
      const stride = (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
      if (stride <= 0) return; // a vertical list (desktop): nothing to page
      const end = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
      const i = end ? cards.length - 1 : Math.round(el.scrollLeft / stride);
      setAt(Math.max(0, Math.min(cards.length - 1, i)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    read();
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  const show = (i: number) => {
    const el = ref.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - pad, behavior: reduce ? "instant" : "smooth" });
  };
  return (
    <>
      <ol ref={ref} className="ov-posters">
        {objections.map((o, i) => (
          <Poster key={o.id} o={o} current={i === at} />
        ))}
      </ol>
      <div className="ov-pager">
        <span className="ov-dots">
          {objections.map((o, i) => (
            <button
              key={o.id}
              type="button"
              className="ov-dot"
              aria-label={`Objection ${o.numeral}`}
              aria-current={i === at ? "true" : undefined}
              onClick={() => show(i)}
            >
              <span />
            </button>
          ))}
        </span>
        <span className="ov-count" aria-hidden>
          {at + 1} of {objections.length}
        </span>
      </div>
    </>
  );
}

const WEAVE: { y: number; lanes: number[]; side: Side | "neutral" }[] = [
  { y: 16, lanes: [0, 4], side: "neutral" },
  { y: 40, lanes: [1], side: "theist" },
  { y: 62, lanes: [2, 3], side: "skeptic" },
  { y: 86, lanes: [0], side: "spinoza" },
  { y: 110, lanes: [1, 4], side: "theist" },
  { y: 134, lanes: [3], side: "skeptic" },
];

function WeaveMark({ side, cx, cy }: { side: Side | "neutral"; cx: number; cy: number }) {
  const r = 4.4;
  if (side === "skeptic") return <path d={`M${cx},${cy - r}L${cx + r},${cy + r * 0.8}L${cx - r},${cy + r * 0.8}Z`} className="dot" />;
  if (side === "spinoza") return <path d={`M${cx},${cy - r}L${cx + r},${cy}L${cx},${cy + r}L${cx - r},${cy}Z`} className="dot" />;
  if (side === "neutral") return <rect x={cx - 3.4} y={cy - 3.4} width={6.8} height={6.8} className="dot" />;
  return <circle cx={cx} cy={cy} r={3.9} className="dot" />;
}

function WeaveArt() {
  const x = (j: number) => 12 + j * 26;
  const lit = [0, 1, 2, 3, 4].map((j) => WEAVE.filter((k) => k.lanes.includes(j)).map((k) => k.y));
  return (
    <svg className="ov-weave" viewBox="0 0 128 150" aria-hidden>
      {lit.map((ys, j) => (
        <g key={j}>
          <line x1={x(j)} x2={x(j)} y1={0} y2={150} className="thr" />
          {ys.length > 1 && <line x1={x(j)} x2={x(j)} y1={ys[0]} y2={ys[ys.length - 1]} className="thr lit" />}
        </g>
      ))}
      {WEAVE.map((k) => (
        <g key={k.y} className={`s-${k.side}`}>
          {k.lanes.length > 1 && <line x1={x(k.lanes[0])} x2={x(k.lanes[k.lanes.length - 1])} y1={k.y} y2={k.y} className="bar" />}
          {k.lanes.map((j) => (
            <WeaveMark key={j} side={k.side} cx={x(j)} cy={k.y} />
          ))}
        </g>
      ))}
    </svg>
  );
}

function PlayInvite() {
  return (
    <section className="ov-play ov-wrap" aria-labelledby="ov-play-h">
      <div className="ov-play-in">
        <div className="ov-play-txt">
          <p className="eyebrow ov-sect-k">A game</p>
          <h2 id="ov-play-h" className="ov-play-t">
            The Long <em>Conversation</em>
          </h2>
          <p className="ov-play-d">
            Put the argument’s history in order, one moment at a time. Each card you place shows its year, the people in it and the move it feeds, and ties a
            knot in the threads of the five objections. There is no timer.
          </p>
          <a className="btn solid" href="#/play">
            Play a round <span aria-hidden>→</span>
          </a>
        </div>
        <WeaveArt />
      </div>
    </section>
  );
}

const STEPS: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Each side answers the other",
    body:
      "Round 1 is the objection. Each round after it replies to the one above it, usually alternating between the Objector and the Defender, up to round 7. Spinoza can cut in at any round, on either side. A move can draw several replies. An objection can also come in parts, separate charges argued one by one, and it stands if any one of its parts stands.",
    icon: (
      <svg className="ov-stepicon" viewBox="0 0 48 32" aria-hidden>
        <path d="M10 6 16 17H4z" className="sk" />
        <path d="M18 12c6-6 12-6 16 1" className="arc" />
        <path d="M31 9.5l3 3.6 3.4-3" className="arc" />
        <circle cx="36" cy="22" r="5.4" className="th" />
      </svg>
    ),
  },
  {
    title: "You decide what holds",
    body:
      "Mark any move Holds or Fails. A move you haven’t marked is answered if any reply to it stands. If it has replies and every one has failed or been answered, it stands. Otherwise it stays open. Every status you see comes from your marks this way.",
    icon: (
      // the two calls, as the buttons appear: Holds (chosen) · Fails
      <svg className="ov-stepicon" viewBox="0 0 48 32" aria-hidden>
        <rect x="1.5" y="10" width="21" height="12" rx="6" className="pillon" />
        <rect x="25.5" y="10" width="21" height="12" rx="6" className="pill" />
        <path d="M8 16.2l2.6 2.4 5-5" className="tick" />
        <path d="M33 13.6l5 5m0-5-5 5" className="cross" />
      </svg>
    ),
  },
  {
    title: "Unanswered moves stay open",
    body: "An exchange can end with either side. Its last move has no reply, so it stays open until you mark it.",
    icon: (
      <svg className="ov-stepicon" viewBox="0 0 48 32" aria-hidden>
        <circle cx="24" cy="16" r="9" className="open" />
        <circle cx="24" cy="16" r="13.5" className="openring" />
      </svg>
    ),
  },
];

/** How it works: three columns on wide screens; on phones three rows that open in place. The
    phone toggle is a button laid over its row (labelled by the row's heading) and hidden on wide
    screens, so there it never claims a tab stop or a collapsed state. */
function HowItWorks() {
  const [open, setOpen] = useState<boolean[]>(() => STEPS.map(() => false));
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <section className="ov-how" aria-labelledby="ov-how-h">
      <h2 id="ov-how-h" className="eyebrow ov-sect-k">
        How it works
      </h2>
      <ol className="ov-steps">
        {STEPS.map((s, i) => (
          <li key={s.title} className={open[i] ? "open" : undefined}>
            {s.icon}
            <h3 id={`ov-step-${base}-${i}`}>{s.title}</h3>
            <button
              type="button"
              className="ov-step-tog"
              aria-expanded={open[i]}
              aria-controls={`ov-stepb-${base}-${i}`}
              aria-labelledby={`ov-step-${base}-${i}`}
              onClick={() => setOpen((v) => v.map((x, j) => (j === i ? !x : x)))}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
                <path d="M3.5 6 8 10.5 12.5 6" />
              </svg>
            </button>
            <p id={`ov-stepb-${base}-${i}`} className="ov-step-b">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                             */
/* ------------------------------------------------------------------ */

export default function Overview() {
  const { d, go, openNode } = useAtlas();
  // Build-in animations (map panes, plumb line, epigraph) only on the first visit of a session.
  const [first] = useState(() => !firstVisitDone);
  useEffect(() => {
    // A deep link mounts the overview for one hydration pass before its own view: that
    // isn't a visit to the map, so it mustn't use up the first-visit build-in.
    if (viewKey(parseHash(window.location.hash)) === "home") firstVisitDone = true;
  }, []);

  const count = d.objections.length;
  const countWord = NUMBER_WORDS[count] ?? String(count);
  const intro = d.intro?.[0];

  return (
    <div className="ov">
      <section className="ov-hero ov-wrap" aria-labelledby="ov-title">
        <p className="ov-kicker">
          {cap(countWord)} objection{count === 1 ? "" : "s"} · 2,500 years
        </p>
        <div className="ov-grid">
          <h1 id="ov-title" className="ov-title" tabIndex={-1}>
            <span className="ov-l1">All the Way</span>{" "}
            <span className="ov-l2">
              <em>Down</em>
              <span className={`ov-plumb${first ? " draw" : ""}`} aria-hidden>
                <span className="ov-bob" />
              </span>
            </span>
          </h1>

          <div className="ov-left">
            <div className="ov-dek">
              {d.subtitle && <p className="ov-sub">{d.subtitle}</p>}
              {intro && (
                <p className="ov-intro">
                  <RichText text={intro} />
                </p>
              )}
            </div>
            <div className="ov-resume-slot">
              <Resume />
            </div>
            <StartHere />
            <Echo reveal={first} />
          </div>

          <div className="ov-right">
            <Rose onEnter={(o) => go({ view: "objection", o })} onNode={openNode} build={first} dial className="ov-rose" />
            <HubCaption />
          </div>

          <RoseKey />

          <Personae />

          <HowItWorks />
        </div>
      </section>

      <section className="ov-five ov-wrap" aria-labelledby="ov-five-h">
        <header className="ov-five-head">
          <h2 id="ov-five-h" className="eyebrow ov-sect-k">
            The {countWord} objection{count === 1 ? "" : "s"}
          </h2>
          <p className="ov-five-t">Open one to read every round, or step through it a move at a time.</p>
        </header>
        <Deck objections={d.objections} />
      </section>

      <PlayInvite />
    </div>
  );
}
