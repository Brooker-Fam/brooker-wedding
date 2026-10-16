"use client";

/* The overview (#/): the 30-second layer of the disputation.
   Hero with a plumb line dropping into the Rose (called "the map" on screen) ·
   the Aquinas epigraph, the one place the medieval form is explained · who's
   talking, which doubles as the glyph key, each voice with a line in its own
   words · the map · a "last time" line · five posters (one per objection, each
   with its own small fan of moves) · how it works.
   Every build-in is CSS, so the server HTML paints complete and animates
   before hydration. */

import "./overview.css";
import { useEffect, useId, useState } from "react";
import { useAtlas } from "../context";
import { objectionStats } from "../helpers";
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

const plural = (n: number, one: string, many = one + "s") => `${n} ${n === 1 ? one : many}`;

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
  return (
    <figure className={`ov-echo${reveal ? " reveal" : ""}`}>
      <blockquote className="ov-echo-q">
        <p>“It seems that everything we see in the world can be accounted for by other principles, supposing God did not exist.”</p>
      </blockquote>
      <figcaption>
        <span className="ov-echo-stamp">
          <span className="ov-nw">Thomas Aquinas</span> · <cite className="ov-nw">Summa Theologiae</cite>, <span className="ov-nw">Part I, Question 2, Article 3</span> ·{" "}
          <span className="ov-nw">1265–74</span>
        </span>
        <span className="ov-echo-line">
          In a medieval disputation, the teacher opened each question with the arguments against his own answer. Aquinas wrote this objection against
          himself in the <cite>Summa</cite>. He replied, “Since nature works for a determinate end under the direction of a higher agent, whatever is done
          by nature must needs be traced back to God, as to its first cause.”
        </span>
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

function Personae() {
  return (
    <section className="ov-cast" aria-labelledby="ov-cast-h">
      <h2 id="ov-cast-h" className="eyebrow ov-sect-k">
        Who’s talking
      </h2>
      <dl className="ov-cast-list">
        <div className="ov-persona s-skeptic">
          <dt>
            <PersonaTile who="skeptic" />
            <span className="ov-pname">The Objector</span>
          </dt>
          <dd>
            <span className="ov-pdesc">
              Gives five reasons not to believe in the God of Christianity. He draws on Plato’s <cite>Euthyphro</cite>, Hume, Nietzsche and J. L.
              Schellenberg, among others.
            </span>
            <PersonaQuote text="A wise man, therefore, proportions his belief to the evidence." cite="Hume, Enquiry Concerning Human Understanding, sect. X (1748)" />
          </dd>
        </div>
        <div className="ov-persona s-theist">
          <dt>
            <PersonaTile who="theist" />
            <span className="ov-pname">The Defender</span>
          </dt>
          <dd>
            <span className="ov-pdesc">
              Answers for Christianity, often from classical theism, the tradition of Augustine and Aquinas that David Bentley Hart defends today. He also
              draws on modern Christian thinkers such as the philosopher Alvin Plantinga and the New Testament scholar N. T. Wright.
            </span>
            <PersonaQuote
              text="[God] is not one more object in the inventory of things that are."
              cite="Hart, “God, Gods, and Fairies,” First Things (June 2013)"
            />
          </dd>
        </div>
        <div className="ov-persona s-spinoza">
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
        <div className="ov-persona you">
          <dt>
            <PersonaTile who="you" />
            <span className="ov-pname">You</span>
          </dt>
          <dd>
            <span className="ov-pdesc">
              You mark moves Holds or Fails. The five small symbols at the top of the page show where that leaves each objection.
            </span>
            <PersonaQuote text="Prove all things; hold fast that which is good." cite="1 Thessalonians 5:21 (KJV)" />
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Swatch({ side, label, defs }: { side: Side; label: Label; defs: string }) {
  return (
    <svg className="ov-swatch" viewBox="0 0 26 18" width="26" height="18" aria-hidden>
      <g transform="translate(13 40)">
        <PaneShape d={annulus(24, 38, -0.3, 0.3)} side={side} label={label} defs={defs} />
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

/** How to read the map: under it on phones, beside it (below the personae) on desktop. */
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
          <Swatch side="theist" label="undec" defs={defs} />
          <span>One move</span>
        </li>
        <li>
          <svg className="ov-swatch" viewBox="0 0 26 18" width="26" height="18" aria-hidden>
            <path d="M3 17a10 10 0 0 1 20 0M8 17a5 5 0 0 1 10 0" className="ov-ringicon" />
          </svg>
          <span>One round</span>
        </li>
        <li>
          <Swatch side="skeptic" label="undec" defs={defs} />
          <span>Open</span>
        </li>
        <li>
          <Swatch side="skeptic" label="in" defs={defs} />
          <span>Stands</span>
        </li>
        <li>
          <Swatch side="skeptic" label="out" defs={defs} />
          <span>Answered</span>
        </li>
        <li>
          <Swatch side="spinoza" label="undec" defs={defs} />
          <span className="ov-key-sp">
            <Glyph side="spinoza" size={11} /> Striped for Spinoza
          </span>
        </li>
      </ul>
      <p className="ov-key-note">Gold blocks are the Objector’s and green blocks are the Defender’s. A block’s fill changes with its status as you mark moves.</p>
    </section>
  );
}

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
  const firstOpen = d.objections.find((o) => o.id !== last.id && (labels.objection.get(o.id) ?? "undec") === "undec");

  let action: { label: string; sr?: string; run: () => void };
  if (lastLabel === "undec") {
    const n = nextIn(last);
    action = {
      label: "Continue",
      sr: ` in Objection ${last.numeral}`,
      run: () => (n ? openNode(n) : go({ view: "objection", o: last.id })),
    };
  } else if (firstOpen) {
    const n = nextIn(firstOpen);
    action = {
      label: `Go to Objection ${firstOpen.numeral}`,
      sr: " (still open)",
      run: () => (n ? openNode(n) : go({ view: "objection", o: firstOpen.id })),
    };
  } else {
    action = { label: "See where you stand", run: () => go({ view: "ledger" }) };
  }

  const status = lastLabel === "in" ? "So far it stands." : lastLabel === "out" ? "So far it’s answered." : "It’s still open.";

  return (
    <section className="ov-resume ov-wrap" aria-label="Where you left off">
      <p className="ov-resume-k">Last time</p>
      <p className="ov-resume-t">
        You were reading{" "}
        <a href={`#/o/${last.id}`} className="ov-resume-o">
          Objection {last.numeral}
          {last.short ? ` · ${last.short}` : ""}
        </a>
        . <span className="ov-resume-s">{status}</span>
      </p>
      <button type="button" className="btn small ov-resume-b" onClick={action.run}>
        {action.label}
        {action.sr && <span className="sr-only">{action.sr}</span>} <span aria-hidden>→</span>
      </button>
    </section>
  );
}

function Poster({ o }: { o: Objection }) {
  const { ix, labels, go, toPlain } = useAtlas();
  const stats = objectionStats(ix, o.id);
  const l = labels.objection.get(o.id) ?? "undec";
  const hid = `ov-p-${o.id}`;
  const enter = () => go({ view: "objection", o: o.id });
  const objection = o.objection?.trim();
  const counter = o.counter?.trim();
  const short = o.short?.trim();
  return (
    <li className="ov-poster">
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
                <span className="ov-saytext">{toPlain(objection)}</span>
              </p>
            )}
            {counter && (
              <p className="ov-say s-theist">
                <span className="ov-cue">
                  <Glyph side="theist" size={11} /> The Defender replies
                  <span className="sr-only">: </span>
                </span>
                <span className="ov-saytext">{toPlain(counter)}</span>
              </p>
            )}
          </div>
        )}
        <div className="ov-pfoot">
          <p className="ov-meta">
            <span>{plural(stats.moves, "move")}</span>
            <span>up to {plural(stats.depth, "round")}</span>
            {stats.prongs > 1 && <span>{plural(stats.prongs, "part")}</span>}
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
              Step through it <span aria-hidden>▸</span>
              <span className="sr-only"> (Objection {o.numeral})</span>
            </a>
          </div>
        </div>
      </article>
    </li>
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

function HowItWorks() {
  return (
    <section className="ov-how ov-wrap" aria-labelledby="ov-how-h">
      <h2 id="ov-how-h" className="eyebrow ov-sect-k">
        How it works
      </h2>
      <ol className="ov-steps">
        <li>
          <svg className="ov-stepicon" viewBox="0 0 48 32" aria-hidden>
            <path d="M10 6 16 17H4z" className="sk" />
            <path d="M18 12c6-6 12-6 16 1" className="arc" />
            <path d="M31 9.5l3 3.6 3.4-3" className="arc" />
            <circle cx="36" cy="22" r="5.4" className="th" />
          </svg>
          <h3>Each side answers the other</h3>
          <p>
            Round 1 is the objection, round 2 is the Defender’s reply, round 3 is the Objector’s answer to that, and so on up to round 7. A move can draw
            several replies. An objection can also come in parts, separate charges argued one by one, and it stands if any one of its parts stands.
          </p>
        </li>
        <li>
          {/* the two calls, as the buttons appear: Holds (chosen) · Fails */}
          <svg className="ov-stepicon" viewBox="0 0 48 32" aria-hidden>
            <rect x="1.5" y="10" width="21" height="12" rx="6" className="pillon" />
            <rect x="25.5" y="10" width="21" height="12" rx="6" className="pill" />
            <path d="M8 16.2l2.6 2.4 5-5" className="tick" />
            <path d="M33 13.6l5 5m0-5-5 5" className="cross" />
          </svg>
          <h3>You decide what holds</h3>
          <p>
            Mark any move Holds or Fails. A move you haven’t marked counts as answered if any reply to it stands. It stands if every reply to it has failed
            or been answered, and otherwise it stays open. Every status you see comes from your marks this way.
          </p>
        </li>
        <li>
          <svg className="ov-stepicon" viewBox="0 0 48 32" aria-hidden>
            <circle cx="24" cy="16" r="9" className="open" />
            <circle cx="24" cy="16" r="13.5" className="openring" />
          </svg>
          <h3>Unanswered moves stay open</h3>
          <p>An exchange can end with either side. Its last move has no reply, so it stays open until you mark it.</p>
        </li>
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
            <Echo reveal={first} />
            <Personae />
          </div>

          <div className="ov-right">
            <Rose onEnter={(o) => go({ view: "objection", o })} onNode={openNode} build={first} className="ov-rose" />
            <HubCaption />
          </div>

          <RoseKey />
        </div>
      </section>

      <Resume />

      <section className="ov-five ov-wrap" aria-labelledby="ov-five-h">
        <header className="ov-five-head">
          <h2 id="ov-five-h" className="eyebrow ov-sect-k">
            The {countWord} objection{count === 1 ? "" : "s"}
          </h2>
          <p className="ov-five-t">Open one to read every round, or step through it a move at a time.</p>
          <p className="ov-five-n">Each card gives the objection and the Defender’s answer in brief.</p>
        </header>
        <ol className="ov-posters">
          {d.objections.map((o) => (
            <Poster key={o.id} o={o} />
          ))}
        </ol>
      </section>

      <PlayInvite />

      <HowItWorks />
    </div>
  );
}
