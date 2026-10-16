"use client";

/* Where you stand (#/ledger): what follows from the reader's calls, and
   nothing more. One result per objection (never a total), each showing the
   reader's result first, then the objection and its best reply. Below them
   come the key call (the call the results most rest on), any contradictions
   among the reader's calls, and a plain-text copy. In the code, Ruling is
   one objection's result, Crux is the key call and Tension is a
   contradiction. */

import "./ledger.css";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { useAtlas } from "../context";
import { IF_WRONG, OBJECTION_STATUS, determinationText, determine, findCrux, type Crux, type Determination } from "../determination";
import { Glyph, RichText } from "../primitives";
import { formatRoute } from "../router";
import { labelObjection, type DisputationIndex, type Judgments, type Tension } from "../semantics";
import { useToast } from "../toast";
import type { Judgment, Label, Objection, ObjectionId, Side } from "../types";
import { answeredMark, shownLabel, statusText } from "./chamberShared";
import { StatusPip } from "./marks";
import Rose from "./Rose";

/** The three voices, as the overview names them. */
const SIDE_WORD: Record<Side, string> = { skeptic: "The Objector", theist: "The Defender", spinoza: "Spinoza" };
const MOVE_STATUS: Record<Label, string> = { in: "stands", out: "answered", undec: "open" };
const LABEL_CLASS: Record<Label, string> = { in: "st-in", out: "st-out", undec: "st-undec" };
const COUNT_WORD = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
/** What a toast says when clearing a call changes an objection's status. */
const NOW_STATUS: Record<Label, string> = { in: "now stands", out: "is now answered", undec: "is now open" };
const otherCall = (j: Judgment): Judgment => (j === "holds" ? "fails" : "holds");

/** Where a move sits, in the reader's words: "Part 2 · Round 3". */
function partRound(ix: DisputationIndex, id: string): string {
  const info = ix.nodes.get(id);
  if (!info) return "";
  const part = (ix.nodes.get(info.path[0])?.order ?? 0) + 1;
  return `Part ${part} · Round ${info.depth}`;
}

/** "Objection V" · "Objections I and V" · "Objections I, II and V" */
function objectionList(numerals: string[]): string {
  if (numerals.length <= 1) return `Objection ${numerals[0] ?? ""}`;
  return `Objections ${numerals.slice(0, -1).join(", ")} and ${numerals[numerals.length - 1]}`;
}

/** Does a tension involve any of these moves? */
const touches = (tensions: Tension[], ids: (string | null)[]) => tensions.some((t) => ids.includes(t.node) || ids.includes(t.reply));

/** Phones and tablets: the map comes after the five results (the same width as in ledger.css). */
const NARROW = "(max-width: 959px)";
const onNarrow = (cb: () => void) => {
  const mq = window.matchMedia(NARROW);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** False on the server and before hydration (the wide layout). */
const useNarrow = () =>
  useSyncExternalStore(
    onNarrow,
    () => window.matchMedia(NARROW).matches,
    () => false,
  );

export default function Ledger() {
  const { d, ix, judgments, analysis, tensions, go, toPlain, openNode } = useAtlas();
  const reduce = useReducedMotion();
  const narrow = useNarrow();
  /** Phones: the rules under the intro's first sentence fold away until asked for. */
  const [rulesOpen, setRulesOpen] = useState(false);
  const rulesId = useId();

  // Ignore stale calls on moves that no longer exist in the content.
  const calls = useMemo(() => Object.keys(judgments).filter((id) => ix.nodes.has(id)), [judgments, ix]);
  const dets = useMemo(() => d.objections.map((o) => determine(ix, o, judgments, analysis.get(o.id), toPlain)), [d, ix, judgments, analysis, toPlain]);
  const crux = useMemo(() => findCrux(ix, d, judgments, analysis), [ix, d, judgments, analysis]);
  const empty = calls.length === 0;
  const n = d.objections.length;

  const rise = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] as const } };

  // Beside the title on wide screens. On phones and tablets it comes after the results in the
  // page itself (not only on screen), so Tab and screen readers meet the results first.
  const map = (
    <motion.div className="ld-head-rose" {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: 0.1 } })}>
      {/* Phones and tablets only (ledger.css): there the map comes after the results and needs a name. */}
      <h2 className="ld-h2 ld-map-h serif">Your calls on the map</h2>
      <Rose verdicts build={false} onEnter={(o) => go({ view: "objection", o })} onNode={openNode} />
      <RoseKey />
    </motion.div>
  );

  return (
    <div className="ld">
      <div className={`ld-top ${empty ? "is-empty" : ""}`}>
        <header className="ld-head">
          <p className="eyebrow ld-kicker">
            <span className="ld-you" aria-hidden />
            Your calls
          </p>
          <h1 className="ld-title display" tabIndex={-1}>
            Where you <em>stand</em>
          </h1>
          <p className="ld-intro">
            Your results come from the moves you mark Holds or Fails, and they update whenever you change a call.{" "}
            <span id={rulesId} className={`ld-rules ${rulesOpen ? "is-open" : ""}`}>
              Each objection comes in a few parts. A part stands if you mark it Holds or every reply to it has failed or been answered. It doesn’t stand if
              you mark it Fails or if a reply to it stands. The objection stands if any one of its parts stands, and it is answered once none of them stands
              or is still open.
            </span>
          </p>
          {/* Shown only on phones (ledger.css); elsewhere the rules are always in the paragraph. */}
          <button type="button" className="ld-rules-tog mono" aria-expanded={rulesOpen} aria-controls={rulesId} onClick={() => setRulesOpen((v) => !v)}>
            {rulesOpen ? "Hide how results work" : "How results work"}
            <span aria-hidden className={`ld-caret ${rulesOpen ? "up" : ""}`} />
          </button>
          {/* One quotation per screen: the empty state carries its own (Socrates). */}
          {!empty && (
            <figure className="ld-epi">
              <blockquote className="serif">
                “For the force of reason in disputation is to be sought after rather than authority, since the authority of the teacher is often a
                disadvantage to those who are willing to learn; as they refuse to use their own judgment…”
              </blockquote>
              <figcaption>
                <span className="mono">Cicero · On the Nature of the Gods I.5 (45 BCE), tr. C. D. Yonge</span>
                <span className="ld-epi-note">
                  Just before this he says that “those men who desire to know my own private opinion on every particular subject have more curiosity than is
                  necessary.”
                </span>
              </figcaption>
            </figure>
          )}
          {!empty && (
            <p className="ld-calls mono">
              {calls.length} {calls.length === 1 ? "call" : "calls"} so far
            </p>
          )}
          {tensions.length > 0 && (
            <button type="button" className="ld-flag" onClick={() => goToTensions(!reduce)}>
              <span className="ld-flag-mark" aria-hidden />
              {tensions.length === 1
                ? "Your calls contradict each other in one place"
                : `Your calls contradict each other in ${(COUNT_WORD[tensions.length] ?? String(tensions.length)).toLowerCase()} places`}
              <span aria-hidden> ↓</span>
            </button>
          )}
        </header>

        {empty && <EmptyState first={d.objections[0]} />}

        {!narrow && map}
      </div>

      <section className="ld-rulings" aria-labelledby="ld-rulings-h">
        <div className="ld-sec-head">
          <h2 id="ld-rulings-h" className="ld-h2 serif" tabIndex={-1}>
            {empty ? `${COUNT_WORD[n] ?? n} objection${n === 1 ? "" : "s"}, none decided yet` : "Objection by objection"}
          </h2>
          <p className="ld-sec-note">Each objection gets its own result, and nothing is added up.</p>
        </div>
        <ol className="ld-list">
          {d.objections.map((o, i) => (
            <motion.li key={o.id} className="ld-row" {...rise(i)}>
              <Ruling o={o} det={dets[i]} count={n} tense={touches(tensions, [dets[i].focus, ...dets[i].also])} />
            </motion.li>
          ))}
        </ol>
      </section>

      {narrow && map}

      {crux && <CruxCard crux={crux} tense={touches(tensions, [crux.id])} />}

      {tensions.length > 0 && (
        <section className="ld-tensions" aria-labelledby="ld-tensions-h">
          <div className="ld-sec-head">
            <h2 id="ld-tensions-h" className="ld-h2 serif" tabIndex={-1}>
              Contradictions
            </h2>
          </div>
          <p className="ld-t-why">
            If a reply to a move stands, the move is answered. So in each pair below, a move you say holds would both hold and not hold. Aristotle called the
            rule against that “the most certain of all principles,” because “it is impossible for any one to believe the same thing to be and not to be”{" "}
            <span className="ld-t-cite mono">(Metaphysics IV.3, 1005b, tr. W. D. Ross)</span>. To fix a pair, clear your call on the first move, or change
            the calls that leave its reply standing.
          </p>
          <ul className="ld-t-list">
            {tensions.map((t, i) => (
              // Name the objection once, over the first pair that sits in it.
              <TensionPair
                key={`${t.node}>${t.reply}`}
                node={t.node}
                reply={t.reply}
                named={i === 0 || ix.nodes.get(tensions[i - 1].node)?.objection !== ix.nodes.get(t.node)?.objection}
              />
            ))}
          </ul>
        </section>
      )}

      {!empty && <TakeAway />}
    </div>
  );
}

/* ---------------- one objection's result ---------------- */

function Ruling({ o, det, count, tense }: { o: Objection; det: Determination; count: number; tense: boolean }) {
  const { toPlain } = useAtlas();
  const titleId = useId();
  const title = toPlain(o.title ?? "").trim() || o.short || `Objection ${o.numeral}`;
  const glyphSide = det.label === "in" ? "skeptic" : det.label === "out" ? "theist" : null;
  const status = OBJECTION_STATUS[det.label];
  const blank = det.kind === "unruled";

  return (
    <article className={`ld-art ${LABEL_CLASS[det.label]} ${blank ? "is-blank" : ""}`} aria-labelledby={titleId}>
      <div className="ld-art-seal">
        <Seal numeral={o.numeral} label={det.label} short={o.short} />
      </div>
      <p className="eyebrow ld-art-eyebrow">
        Objection {o.numeral}
        <span className="sr-only"> of {count}</span>
        {/* The space stays outside the inline-block, which would swallow it. */}
        {o.short && (
          <>
            {" "}
            <span className="ld-nw">· {o.short}</span>
          </>
        )}
      </p>
      <h3 id={titleId} className="ld-art-title serif">
        {title}
      </h3>

      <div className="ld-art-ruling">
        {blank ? (
          <div className="ld-resp ld-resp-blank">
            <p className="ld-blank-line">
              <span className="ld-hollow" aria-hidden />
              <span className="sr-only">Your result: </span>
              <span className="ld-blank-word serif">{status}.</span>
              <span className="ld-blank-note"> {det.parts.pre}</span>
            </p>
          </div>
        ) : (
          <div className="ld-resp">
            <p className="ld-resp-cue mono">
              <span className="ld-you" aria-hidden />
              Your result
              <span className="sr-only">: {status}.</span>
              <span className="ld-count">
                {det.called} of {det.total} moves marked
              </span>
            </p>
            <p className="ld-sentence serif">
              <span className="ld-head-line">
                {glyphSide ? <Glyph side={glyphSide} label="in" size={15} className="ld-head-glyph" /> : <span className="ld-hollow" aria-hidden />}
                <span className="ld-head-word">{det.parts.head}</span>
              </span>{" "}
              <span className="ld-rest">
                {det.parts.pre}
                {det.focus && <MoveRef id={det.focus} />}
                {det.parts.post}
              </span>
            </p>
            {tense && <TensionNote />}

            {det.also.length > 0 && <ChipRow label={det.focus ? "It also rests on" : "It rests on"} ids={det.also} cap={4} />}
            {det.decisive.length > 0 && <ChipRow label="These could also settle it" ids={det.decisive} />}
          </div>
        )}

        <div className="ld-art-actions">
          <a className="btn small" href={formatRoute({ view: "objection", o: o.id })}>
            See all moves<span className="sr-only"> in Objection {o.numeral}</span>
          </a>
          <a className="btn small ld-argue" href={formatRoute({ view: "walk", o: o.id })}>
            Step through it<span className="sr-only"> (Objection {o.numeral})</span> <span aria-hidden>▶</span>
          </a>
        </div>
      </div>

      <Exchange o={o} />
    </article>
  );
}

/** The objection and its best reply: clamped below desktop, with a toggle only when it overflows. */
function Exchange({ o }: { o: Objection }) {
  const ref = useRef<HTMLDListElement>(null);
  const dlId = useId();
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const hasObj = (o.objection ?? "").trim().length > 0;
  const hasCounter = (o.counter ?? "").trim().length > 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const check = () => {
      if (open) return;
      const dds = [...el.querySelectorAll("dd")];
      setOverflow(dds.some((dd) => dd.scrollHeight > dd.clientHeight + 1));
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, o.objection, o.counter]);

  if (!hasObj && !hasCounter) return null;
  return (
    <>
      <dl ref={ref} id={dlId} className={`ld-ex ${open ? "open" : ""}`}>
        {hasObj && (
          <div className="ld-ex-row s-skeptic">
            <dt className="mono">
              <Glyph side="skeptic" size={10} />
              The Objector argues
            </dt>
            <dd>
              <RichText text={o.objection} />
            </dd>
          </div>
        )}
        {hasCounter && (
          <div className="ld-ex-row s-theist">
            <dt className="mono">
              <Glyph side="theist" size={10} />
              The Defender replies
            </dt>
            <dd>
              <RichText text={o.counter} />
            </dd>
          </div>
        )}
      </dl>
      {(overflow || open) && (
        <button type="button" className="ld-ex-toggle mono" aria-expanded={open} aria-controls={dlId} onClick={() => setOpen((v) => !v)}>
          {open ? "Show less" : "Show more"}
          <span className="sr-only"> (Objection {o.numeral})</span>
          <span aria-hidden className={`ld-caret ${open ? "up" : ""}`} />
        </button>
      )}
    </>
  );
}

/** The badge: the objection's numeral, ringed by its name along the top and its status along
    the bottom (two arcs, so both read upright). */
function Seal({ numeral, label, short }: { numeral: string; label: Label; short?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const topId = `${uid}-top`;
  const botId = `${uid}-bot`;
  const top = `· Objection ${numeral}${short ? ` · ${short}` : ""} ·`.toUpperCase();
  const status = OBJECTION_STATUS[label].toUpperCase();
  const r = 39.5;
  const fs = numeral.length >= 4 ? 17 : numeral.length === 3 ? 21 : numeral.length === 2 ? 26 : 31;
  // As large as the top half-ring allows (Plex Mono advances 0.6em), then a little tracking.
  const avail = Math.PI * r - 6;
  const ringFs = Math.min(9.6, avail / (top.length * 0.6));
  const track = Math.max(0, Math.min(ringFs * 0.14, (avail * 0.94 - top.length * 0.6 * ringFs) / top.length));
  // The bottom arc runs counterclockwise so its word reads upright; its baseline sits outside r
  // by about a cap height, so both words fill the same band of the ring.
  const r2 = r + ringFs * 0.72;
  return (
    <svg className={`ld-seal ${LABEL_CLASS[label]}`} viewBox="-50 -50 100 100" aria-hidden>
      <defs>
        <path id={topId} d={`M${-r},0 a${r},${r} 0 0,1 ${2 * r},0`} />
        <path id={botId} d={`M${-r2},0 a${r2},${r2} 0 0,0 ${2 * r2},0`} />
      </defs>
      <circle className="ld-seal-outer" r={48} />
      <g className="ld-seal-ringtext">
        <text style={{ fontSize: ringFs, letterSpacing: track }}>
          <textPath href={`#${topId}`} startOffset="50%" textAnchor="middle">
            {top}
          </textPath>
        </text>
        <text style={{ fontSize: ringFs, letterSpacing: ringFs * 0.3 }}>
          <textPath href={`#${botId}`} startOffset="50%" textAnchor="middle">
            {status}
          </textPath>
        </text>
      </g>
      <circle className="ld-seal-disc" r={31} />
      <text className="ld-seal-num" y={fs * 0.34} textAnchor="middle" style={{ fontSize: fs }}>
        {numeral}
      </text>
    </svg>
  );
}

/** A labelled list of move chips; long lists open in place. */
function ChipRow({ label, ids, cap }: { label: string; ids: string[]; cap?: number }) {
  const [all, setAll] = useState(false);
  const listId = useId();
  const limit = cap ?? ids.length;
  const shown = all ? ids : ids.slice(0, limit);
  return (
    <div className="ld-chiprow">
      <span className="ld-chiprow-k mono" aria-hidden>
        {label}
      </span>
      <ul id={listId} className="ld-chips" aria-label={label}>
        {shown.map((id) => (
          <MoveChip key={id} id={id} />
        ))}
      </ul>
      {ids.length > limit && (
        <button type="button" className="ld-more mono" aria-expanded={all} aria-controls={listId} onClick={() => setAll((v) => !v)}>
          {all ? "Show fewer" : `Show ${ids.length - limit} more`}
          <span aria-hidden className={`ld-caret ${all ? "up" : ""}`} />
        </button>
      )}
    </div>
  );
}

/** A move named inside a sentence: glyph + “label”, linking to the move. */
function MoveRef({ id }: { id: string }) {
  const { ix, judgments, labelOf, toPlain } = useAtlas();
  const info = ix.nodes.get(id);
  if (!info) return null;
  const side = info.node.side;
  return (
    <a className={`ld-ref s-${side}`} href={nodeHref(info.objection, id)} title={`${SIDE_WORD[side]} · ${partRound(ix, id)}`}>
      <Glyph side={side} label={shownLabel(labelOf(id), judgments[id])} size={13} className="ld-ref-glyph" />
      <span className="ld-ref-text">“{toPlain(info.node.label)}”</span>
    </a>
  );
}

/** Links (not buttons) for moves: they navigate, they wrap across lines, and they can be opened in a new tab. */
function nodeHref(o: ObjectionId, node: string) {
  return formatRoute({ view: "objection", o, node });
}

/** A move as a chip: glyph · side · part and round · (your call), then its label. */
function MoveChip({ id }: { id: string }) {
  const { ix, labelOf, judgments, toPlain } = useAtlas();
  const info = ix.nodes.get(id);
  if (!info) return null;
  const side = info.node.side;
  const l = labelOf(id);
  const call = judgments[id] as Judgment | undefined;
  return (
    <li>
      <a className={`ld-chip s-${side}`} href={nodeHref(info.objection, id)}>
        <span className="ld-chip-top">
          <Glyph side={side} label={shownLabel(l, call)} size={11} />
          <span className="ld-chip-addr mono">
            <span className="ld-chip-side">{SIDE_WORD[side]}</span> · {partRound(ix, id)}
          </span>
          {call && <span className="your-call ld-chip-call">{statusText(l, call)}</span>}
        </span>
        <span className={`ld-chip-lab ${answeredMark(l, call) ? "lab-out" : ""}`}>{toPlain(info.node.label)}</span>
        {!call && <span className="sr-only"> ({MOVE_STATUS[l]})</span>}
      </a>
    </li>
  );
}

/** A status that rests on a contradicted call says so, and leads to the contradiction. */
function TensionNote() {
  const reduce = useReducedMotion();
  return (
    <button type="button" className="tension-note ld-tnote" onClick={() => goToTensions(!reduce)}>
      <span className="ld-tnote-mark" aria-hidden />
      <span>
        This result depends on a call that contradicts your other calls.{" "}
        <span className="ld-tnote-go">
          <u>See both</u>
          <span aria-hidden> ↓</span>
        </span>
      </span>
    </button>
  );
}

/* ---------------- your key call ---------------- */

function CruxCard({ crux, tense }: { crux: Crux; tense: boolean }) {
  const { ix, labelOf, toPlain } = useAtlas();
  const info = ix.nodes.get(crux.id);
  if (!info) return null;
  const side = info.node.side;
  const short = ix.objections.get(crux.o)?.short;
  // Holds: read the reply that stands against it (a contradiction), else its first (strongest) reply.
  // Fails: reread the move itself, which states its side's best case.
  const reply = info.childIds.find((c) => labelOf(c) === "in") ?? info.childIds[0];
  const target = crux.call === "holds" ? (reply ?? crux.id) : crux.id;
  const cta = crux.call === "holds" && reply ? "Read the reply to it" : "Reread the move";
  const objName = `Objection ${crux.numeral}`;
  const others = crux.company - 1;
  const lede = others <= 0 ? `${objName} depends on this one call.` : `${objName} depends on this call and ${others === 1 ? "one other" : `${others} others`}.`;
  const opposite = otherCall(crux.call);
  const shifts = crux.ifWrong !== crux.now;

  return (
    <section className={`ld-crux s-${side}`} aria-labelledby="ld-crux-h">
      <div className="ld-crux-body">
        <h2 id="ld-crux-h" className="eyebrow ld-crux-k" tabIndex={-1}>
          Your key call
        </h2>
        <p className="ld-crux-lede serif">{lede}</p>
        <div className="ld-crux-row">
          <span className="ld-crux-bob" aria-hidden>
            <Glyph side={side} label={shownLabel(labelOf(crux.id), crux.call)} size={20} />
          </span>
          <a className="ld-crux-label serif" href={nodeHref(info.objection, crux.id)}>
            “{toPlain(info.node.label)}”
          </a>
        </div>
        <p className="ld-crux-meta mono">
          <span className="ld-crux-side">{SIDE_WORD[side]}</span>
          <span>
            <span aria-hidden>· </span>Round {info.depth}
          </span>
          <span className="your-call ld-crux-stamp">{statusText(labelOf(crux.id), crux.call)}</span>
        </p>
        {shifts && (
          <p className="ld-crux-said">
            If you said it {opposite} instead, {objName} <strong>{IF_WRONG[crux.ifWrong]}</strong>.
          </p>
        )}
        {tense && <TensionNote />}
        {info.node.cedes && (
          <p className="ld-crux-cedes">
            <span className="mono">What would change this side’s mind</span>
            <RichText text={info.node.cedes} />
          </p>
        )}
        <figure className="ld-epi ld-crux-epi">
          <blockquote className="serif">
            “The holiest of men, it appears, cannot be admitted to posthumous honours, until all that the devil could say against him is known and weighed.”
          </blockquote>
          <figcaption>
            <span className="mono">John Stuart Mill · On Liberty, ch. 2 (1859)</span>
            <span className="ld-epi-note">On the Church’s devil’s advocate at a canonization.</span>
          </figcaption>
        </figure>
        <a className="btn ld-crux-go" href={nodeHref(info.objection, target)}>
          {cta} <span aria-hidden>→</span>
        </a>
      </div>
      {shifts && (
        <div className="ld-crux-shift" aria-hidden>
          <figure className="ld-shift-seal">
            <Seal numeral={crux.numeral} label={crux.now} short={short} />
            <figcaption className="mono">
              <span>Now</span>
              {OBJECTION_STATUS[crux.now]}
            </figcaption>
          </figure>
          <span className="ld-shift-arrow mono">
            <span className="ld-shift-line" />
            if it {opposite}
          </span>
          <figure className="ld-shift-seal">
            <Seal numeral={crux.numeral} label={crux.ifWrong} short={short} />
            <figcaption className="mono">
              <span>Then</span>
              {OBJECTION_STATUS[crux.ifWrong]}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

/* ---------------- contradictions (tensions in the code) ---------------- */

function TensionPair({ node, reply, named }: { node: string; reply: string; named: boolean }) {
  const { ix, judgments, judge, labels, toPlain } = useAtlas();
  const toast = useToast();
  const replyInfo = ix.nodes.get(reply);
  const nodeInfo = ix.nodes.get(node);
  if (!nodeInfo || !replyInfo) return null;
  const numeral = ix.objections.get(nodeInfo.objection)?.numeral;
  const replyJudged = !!judgments[reply];

  const rethink = (id: string) => {
    const prev = judgments[id];
    const info = ix.nodes.get(id);
    if (!prev || !info) return;
    const o = ix.objections.get(info.objection);
    const without: Judgments = { ...judgments };
    delete without[id];
    const before = labels.objection.get(info.objection) ?? "undec";
    const after = o ? labelObjection(o, without) : before;
    const y = focusY();
    judge(id, null);
    keepFocus(y);
    const shift = after !== before && o ? ` Objection ${o.numeral} ${NOW_STATUS[after]}.` : "";
    toast({
      text: `Cleared your call on “${toPlain(info.node.label)}”.${shift}`,
      action: {
        label: "Undo",
        run: () => {
          judge(id, prev);
          keepFocus(y);
        },
      },
    });
  };

  return (
    <li className="ld-tension">
      {named && numeral && <p className="ld-t-say mono">In Objection {numeral}</p>}
      <div className="ld-t-pair">
        <div className="ld-t-col">
          <TensionMove id={node} role="You said this holds" />
          <button type="button" className="btn small" onClick={() => rethink(node)}>
            Clear this call
          </button>
        </div>
        <div className="ld-t-col">
          <TensionMove id={reply} role={replyJudged ? "You also said this reply holds" : "Your other calls leave this reply standing"} />
          {replyJudged ? (
            <button type="button" className="btn small" onClick={() => rethink(reply)}>
              Clear that call
            </button>
          ) : (
            <a className="btn small" href={nodeHref(replyInfo.objection, reply)}>
              Go to the reply <span aria-hidden>→</span>
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

function TensionMove({ id, role }: { id: string; role: string }) {
  const { ix, labelOf, toPlain } = useAtlas();
  const info = ix.nodes.get(id);
  if (!info) return null;
  const side = info.node.side;
  return (
    <a className={`ld-t-move s-${side}`} href={nodeHref(info.objection, id)}>
      <span className="ld-t-role mono">{role}</span>
      <span className="ld-t-lab serif">
        <Glyph side={side} label={labelOf(id)} size={13} />
        <span>{toPlain(info.node.label)}</span>
      </span>
      <span className="ld-t-addr mono">
        {SIDE_WORD[side]} · {partRound(ix, id)}
      </span>
    </a>
  );
}

/* ---------------- focus ---------------- */

/** Scroll to the contradictions and put focus on their heading (so the next Tab continues there). */
function goToTensions(smooth: boolean) {
  const h = document.getElementById("ld-tensions-h");
  if (!h) return;
  (h.closest("section") ?? h).scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  h.focus({ preventScroll: true });
}

/** Where focus sits on screen now (viewport y), so it can land nearby after a change. */
function focusY(): number {
  const a = document.activeElement;
  return a && a !== document.body ? a.getBoundingClientRect().top : window.innerHeight / 3;
}

const SECTION_HEADINGS = ["ld-tensions-h", "ld-crux-h", "ld-take-h", "ld-rulings-h"];

/** After a call is cleared the control that cleared it may vanish (a resolved tension, a
    whole section): move focus to the nearest surviving tension or section heading, and make
    sure it is on screen. */
function keepFocus(y: number) {
  requestAnimationFrame(() => {
    const active = document.activeElement;
    // Focus on a toast's action (Undo) is about to vanish with the toast: treat it as lost.
    if (active && active !== document.body && document.contains(active) && !active.closest(".toast-dock")) return;
    const candidates: HTMLElement[] = [
      ...document.querySelectorAll<HTMLElement>(".ld-tension .ld-t-col .btn"),
      ...SECTION_HEADINGS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el),
      ...document.querySelectorAll<HTMLElement>(".ld-title"),
    ];
    let best: HTMLElement | null = null;
    let dist = Infinity;
    for (const el of candidates) {
      const dd = Math.abs(el.getBoundingClientRect().top - y);
      if (dd < dist) [best, dist] = [el, dd];
    }
    const target = best;
    if (!target) return;
    target.focus({ preventScroll: true });
    const r = target.getBoundingClientRect();
    if (r.top < 64 || r.bottom > window.innerHeight) target.scrollIntoView({ block: "center" });
  });
}

/* ---------------- copy as text + reset ---------------- */

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the textarea route */
  }
  const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus({ preventScroll: true });
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  } finally {
    prev?.focus({ preventScroll: true });
  }
}

function TakeAway() {
  const { d, ix, judgments, labels, analysis, tensions, toPlain, clearJudgments, judge } = useAtlas();
  const toast = useToast();
  const reduce = useReducedMotion();
  const [preview, setPreview] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const refocusReset = useRef(false);
  const previewId = useId();
  const count = Object.keys(judgments).filter((id) => ix.nodes.has(id)).length;

  // Leaving the confirm step without clearing hands focus back to "Reset all calls".
  useEffect(() => {
    if (!confirm && refocusReset.current) {
      refocusReset.current = false;
      resetRef.current?.focus();
    }
  }, [confirm]);

  const build = useCallback(() => {
    const url = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : undefined;
    return determinationText(ix, d, judgments, { analysis, toPlain, tensions, url });
  }, [ix, d, judgments, analysis, toPlain, tensions]);

  const text = useMemo(() => (preview ? build() : ""), [preview, build]);

  const copy = async () => {
    const ok = await copyText(build());
    if (ok) toast({ text: "Copied your results as plain text." });
    else {
      setPreview(true);
      toast({ text: "Couldn’t copy automatically. The text is below and selected, so you can copy it by hand." });
      requestAnimationFrame(() => {
        const el = preRef.current;
        if (!el) return;
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      });
    }
  };

  const cancel = () => {
    refocusReset.current = true;
    setConfirm(false);
  };

  const reset = () => {
    const snapshot: Judgments = { ...judgments };
    const settled = d.objections.filter((o) => (labels.objection.get(o.id) ?? "undec") !== "undec").map((o) => o.numeral);
    clearJudgments();
    setConfirm(false);
    // The view turns into its empty state: bring the reader to it.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      const h = document.getElementById("ld-empty-h") ?? document.querySelector<HTMLElement>(".ld-title");
      h?.focus({ preventScroll: true });
    });
    const status = settled.length ? `${objectionList(settled)} ${settled.length === 1 ? "is" : "are"} open again.` : "Everything is open again.";
    toast({
      text: `Cleared all ${count} ${count === 1 ? "call" : "calls"}. ${status}`,
      ttl: 8000,
      action: {
        label: "Undo",
        // One write per call, so any call made since the reset is kept (a bulk replace would drop
        // it); React batches the renders.
        run: () => {
          Object.entries(snapshot).forEach(([id, j]) => judge(id, j as Judgment));
          keepFocus(window.innerHeight / 3);
        },
      },
    });
  };

  const onConfirmKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      cancel();
    }
  };

  return (
    <section className="ld-take" aria-labelledby="ld-take-h">
      <div className="ld-take-main">
        <div>
          <h2 id="ld-take-h" className="ld-h2 serif" tabIndex={-1}>
            Take it with you
          </h2>
          <p className="ld-take-dek">
            Copy your results as plain text to keep or send. Each objection comes with its best reply and where you stand on it.
          </p>
          <figure className="ld-epi ld-take-epi">
            <blockquote className="serif">
              “…be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear”
            </blockquote>
            <figcaption>
              <span className="mono">1 Peter 3:15, King James Version</span>
            </figcaption>
          </figure>
        </div>
        <div className="ld-take-actions">
          <button type="button" className="btn solid" onClick={copy}>
            Copy as text
          </button>
          <button type="button" className="btn ghost ld-preview-btn" aria-expanded={preview} aria-controls={previewId} onClick={() => setPreview((v) => !v)}>
            {preview ? "Hide preview" : "Preview"}
            <span aria-hidden className={`ld-caret ${preview ? "up" : ""}`} />
          </button>
        </div>
      </div>
      {preview && (
        <pre id={previewId} ref={preRef} className="ld-pre" tabIndex={0} aria-label="Your results as plain text">
          {text}
        </pre>
      )}

      <div className="ld-reset">
        {!confirm ? (
          <button ref={resetRef} type="button" className="ld-reset-btn mono" onClick={() => setConfirm(true)}>
            Reset all calls
          </button>
        ) : (
          <div className="ld-confirm" role="group" aria-label="Confirm reset" onKeyDown={onConfirmKey}>
            <span className="ld-confirm-q">
              Clear all {count} {count === 1 ? "call" : "calls"}? Every move goes back to open.
            </span>
            <span className="ld-confirm-btns">
              {/* The safe choice takes focus, so a repeated Enter never wipes the calls. */}
              <button type="button" className="btn small ghost" onClick={cancel} autoFocus>
                Keep them
              </button>
              <button type="button" className="btn small ld-danger" onClick={reset}>
                Clear all
              </button>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- empty state ---------------- */

function EmptyState({ first }: { first?: Objection }) {
  return (
    <section className="ld-empty" aria-labelledby="ld-empty-h">
      <p className="eyebrow ld-empty-k">No calls yet</p>
      <h2 id="ld-empty-h" className="ld-empty-h serif" tabIndex={-1}>
        Mark a few moves and your results show up here.
      </h2>
      <figure className="ld-epi ld-empty-epi">
        <blockquote className="serif">
          “I would ask you to be thinking of the truth and not of Socrates: agree with me, if I seem to you to be speaking the truth; or if not, withstand me
          might and main, that I may not deceive you as well as myself in my enthusiasm, and like the bee, leave my sting in you before I die.”
        </blockquote>
        <figcaption>
          <span className="mono">Socrates, in Plato’s Phaedo 91c, tr. Benjamin Jowett</span>
        </figcaption>
      </figure>
      <div className="ld-empty-actions">
        {first && (
          <a className="btn solid" href={formatRoute({ view: "walk", o: first.id })}>
            Step through Objection {first.numeral} <span aria-hidden>▶</span>
          </a>
        )}
        <a className="btn" href={formatRoute({ view: "home" })}>
          Open the map
        </a>
      </div>
      <ol className="ld-steps">
        <li>
          <span className="ld-step-n serif" aria-hidden>
            1
          </span>
          <p>
            Each objection is argued over several rounds by{" "}
            <span className="ld-g s-skeptic">
              <span aria-hidden>▲</span> the Objector
            </span>{" "}
            and{" "}
            <span className="ld-g s-theist">
              <span aria-hidden>●</span> the Defender
            </span>
            , each round answering the one before.{" "}
            <span className="ld-g s-spinoza">
              <span aria-hidden>◆</span> Spinoza
            </span>{" "}
            cuts in now and then.
          </p>
        </li>
        <li>
          <span className="ld-step-n serif" aria-hidden>
            2
          </span>
          <p>
            Mark the moves you have a view on <em>Holds</em> or <em>Fails</em>, and the status of every other move follows from those calls.
          </p>
        </li>
        <li>
          <span className="ld-step-n serif" aria-hidden>
            3
          </span>
          <p>A move nobody has answered stays open until you mark it.</p>
        </li>
      </ol>
    </section>
  );
}

/* ---------------- map key ---------------- */

const r2 = (v: number) => Math.round(v * 100) / 100;
/** A ring segment like the map's, centred below the swatch. */
function swatchPane(cx: number, a0: number, a1: number): string {
  const [cy, r0, r1] = [40, 27, 38];
  const p = (a: number, r: number) => `${r2(cx + Math.sin(a) * r)},${r2(cy - Math.cos(a) * r)}`;
  return `M${p(a0, r1)}A${r1},${r1} 0 0 1 ${p(a1, r1)}L${p(a1, r0)}A${r0},${r0} 0 0 0 ${p(a0, r0)}Z`;
}

/** Two segments (one per side, since a move's color is its side) drawn with the map's own classes. */
function PaneSwatch({ label, sides, defs }: { label: Label; sides: Side[]; defs: string }) {
  const w = sides.length === 1 ? 18 : 30;
  const panes = sides.length === 1 ? [swatchPane(9, -0.2, 0.2)] : [swatchPane(15, -0.36, -0.02), swatchPane(15, 0.02, 0.36)];
  return (
    <svg className="ld-sw" viewBox={`0 0 ${w} 16`} width={w} height={16} aria-hidden>
      {panes.map((dd, i) => (
        <g key={i} className={`rose-pane s-${sides[i]} st-${label}`}>
          <path d={dd} className="rose-glass" />
          {sides[i] === "spinoza" && label !== "in" && <path d={dd} fill={`url(#${defs}-h)`} />}
          {label === "out" && <path d={dd} fill={`url(#${defs}-s)`} />}
          {label === "in" && <path d={dd} fill={`url(#${defs}-l)`} />}
        </g>
      ))}
    </svg>
  );
}

/** How to read the map here: moves are colored by side and lit by status; objections (the
    centre of the map and the badges below) are colored by status. */
function RoseKey() {
  const defs = "ldk" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const both: Side[] = ["skeptic", "theist"];
  return (
    <div className="ld-key" role="group" aria-label="How to read the map">
      <svg width="0" height="0" className="ld-key-defs" aria-hidden>
        <defs>
          <pattern id={`${defs}-h`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#a195bd" strokeOpacity="0.6" strokeWidth="1" />
          </pattern>
          <pattern id={`${defs}-s`} width="3.6" height="3.6" patternUnits="userSpaceOnUse">
            <circle cx="1.8" cy="1.8" r="0.55" fill="#a6a394" fillOpacity="0.6" />
          </pattern>
          <radialGradient id={`${defs}-l`} cx="50%" cy="50%" r="75%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <div className="ld-key-row">
        <p className="ld-key-h mono">Moves</p>
        <ul className="ld-key-list mono">
          <li>
            <PaneSwatch label="undec" sides={both} defs={defs} />
            Open
          </li>
          <li>
            <PaneSwatch label="in" sides={both} defs={defs} />
            Stands
          </li>
          <li>
            <PaneSwatch label="out" sides={both} defs={defs} />
            Answered
          </li>
          <li>
            <span className="ld-sw-mine" aria-hidden />
            Your call
          </li>
          <li>
            <PaneSwatch label="undec" sides={["spinoza"]} defs={defs} />
            <span className="ld-key-spin">
              <Glyph side="spinoza" size={11} /> Striped for Spinoza
            </span>
          </li>
        </ul>
      </div>
      <div className="ld-key-row">
        <p className="ld-key-h mono">Objections (center)</p>
        <ul className="ld-key-list mono">
          <li>
            <Glyph side="skeptic" label="in" size={11} />
            Stands
          </li>
          <li>
            <Glyph side="theist" label="in" size={11} />
            Answered
          </li>
          <li>
            <StatusPip label="undec" size={11} />
            Open
          </li>
        </ul>
      </div>
    </div>
  );
}
