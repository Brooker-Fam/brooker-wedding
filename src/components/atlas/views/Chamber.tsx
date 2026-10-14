"use client";

/* One objection's page.
   Header (numeral, the question, the exchange, history, status) → the parts
   → the thread (a branch of the argument as a script, every move expandable
   in place, every move open to a call) → where Spinoza stands → further reading.
   On wide screens every move of the objection sits beside the thread as a chart. */

import "./chamber.css";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAtlas } from "../context";
import { explainObjection } from "../explain";
import { address } from "../helpers";
import { initials, usePeek } from "../peek";
import { Glyph, RichText } from "../primitives";
import { findTensions, labelObjection, type DisputationIndex, type Tension } from "../semantics";
import { useToast } from "../toast";
import type { Judgment, Label, ObjectionId } from "../types";
import {
  ChamberCtx,
  OBJ_STATUS_WORD,
  STATUS_WORD,
  WhyLine,
  numWord,
  q,
  spellAddress,
  statusText,
  topInset,
  turnEl,
  type ChamberApi,
  type FocusSource,
  type Ripple,
} from "./chamberShared";
import ObjectionChart from "./ObjectionChart";
import Thread from "./Thread";

const INSTANT = "instant" as ScrollBehavior;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* A cross-objection jump leaves a one-hop "back" chip on the destination page.
   The page remounts per objection, so the hand-off goes through sessionStorage. */
const BACK_KEY = "atl:chamber-back:v1";
function writeBack(to: ObjectionId, from: string) {
  try {
    sessionStorage.setItem(BACK_KEY, JSON.stringify({ to, from, t: Date.now() }));
  } catch {
    /* no storage: no back chip */
  }
}
function readBack(oid: ObjectionId): string | null {
  try {
    const raw = sessionStorage.getItem(BACK_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { to?: string; from?: string; t?: number };
    return v.to === oid && typeof v.from === "string" && Date.now() - (v.t ?? 0) < 10_000 ? v.from : null;
  } catch {
    return null;
  }
}
function clearBack() {
  try {
    sessionStorage.removeItem(BACK_KEY);
  } catch {
    /* ignore */
  }
}

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
                  <span aria-hidden>▲</span> Aquinas · Objection 2
                </p>
                <blockquote className="ch-echo-t">
                  “Further, it is superfluous to suppose that what can be accounted for by a few principles has been produced by many. But it seems that everything we see in the
                  world can be accounted for by other principles, supposing God did not exist. For all natural things can be reduced to one principle which is nature; and all
                  voluntary things can be reduced to one principle which is human reason, or will. Therefore there is no need to suppose God’s existence.”
                </blockquote>
              </div>
              <div className="ch-echo-col s-theist">
                <p className="ch-echo-k">
                  <span aria-hidden>●</span> Aquinas · Reply to Objection 2
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

function Lineage({ oid, lineage, onHistory }: { oid: ObjectionId; lineage: string[]; onHistory: () => void }) {
  const { ix } = useAtlas();
  const peek = usePeek();
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
  const shown = people.slice(0, MAX);
  const more = people.length - shown.length;
  const first = ix.thinkers.get(people[0]);
  const lastT = ix.thinkers.get(people[people.length - 1]);
  return (
    <div className="ch-lineage">
      {shown.length > 0 && <span className="ch-lineage-k">Who argued it</span>}
      {shown.length > 0 && (
        <ul className="ch-roundels" aria-label="People who argued over this objection, oldest first">
          {shown.map((t) => {
            const th = ix.thinkers.get(t)!;
            return (
              <li key={t}>
                <button
                  type="button"
                  className={`ch-roundel s-${th.side}`}
                  aria-label={`${th.name}, ${th.life}`}
                  title={`${th.name} (${th.life})`}
                  onClick={(e) =>
                    peek({
                      kind: "thinker",
                      id: t,
                      rect: e.currentTarget.getBoundingClientRect(),
                    })
                  }
                >
                  <span className="monogram">{initials(th.name)}</span>
                </button>
              </li>
            );
          })}
          {more > 0 && <li className="ch-roundel-more">and {more} more</li>}
        </ul>
      )}
      {first && lastT && people.length > 1 && (
        <span className="ch-lineage-span">
          {shortName(first.name)} to {shortName(lastT.name)}
        </span>
      )}
      <button type="button" className="ch-lineage-go" onClick={onHistory}>
        <span className="ch-u">See the timeline</span>
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}

/* ---------------- the page ---------------- */

export default function Chamber({ o: oid, node }: { o: ObjectionId; node?: string }) {
  const { ix, d, go, judgments, judge, labels, tensions, analysis, toPlain, openNode } = useAtlas();
  const toast = useToast();
  const o = ix.objections.get(oid);
  const valid = node && ix.nodes.get(node)?.objection === oid ? node : null;
  const focusId = valid ?? o?.prongs[0]?.id ?? null;
  const wide = useMedia("(min-width: 1100px)");
  const narrow = useMedia("(max-width: 639px)");

  // A move id that isn't in this objection: go to its real address (or this objection's top), without a history entry.
  useEffect(() => {
    if (!node || valid) return;
    const info = ix.nodes.get(node);
    go(info ? { view: "objection", o: info.objection, node } : { view: "objection", o: oid }, { replace: true });
  }, [node, valid, ix, go, oid]);

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

  /* ---- the ripple after a call: plays once, then clears (so remounts don't replay it) ---- */
  const [ripple, setRipple] = useState<Ripple | null>(null);
  useEffect(() => {
    if (!ripple) return;
    const t = window.setTimeout(() => setRipple(null), 1100 + 80 * ripple.origin);
    return () => window.clearTimeout(t);
  }, [ripple]);

  const [back, setBack] = useState(() => readBack(oid));
  useEffect(() => clearBack(), []);

  const [mapOpen, setMapOpen] = useState(false);

  /* ---- screen-reader confirmation of calls that don't change the objection ---- */
  const [said, setSaid] = useState({ text: "", n: 0 });
  const say = useCallback((text: string) => setSaid((s) => ({ text, n: s.n + 1 })), []);

  /* ---- focus + scrolling ---- */
  const anchor = useRef<{ id: string; top: number | null; from: FocusSource } | null>(null);
  const lastFocus = useRef(focusId);

  const focus = useCallback(
    (id: string, from: FocusSource = "thread") => {
      const el = turnEl(id);
      anchor.current = { id, top: el ? el.getBoundingClientRect().top : null, from };
      if (id === focusId && el) {
        // Already open: just bring it back into view.
        const inset = topInset();
        const top = el.getBoundingClientRect().top;
        if (top < inset || top > window.innerHeight * 0.6) {
          window.scrollTo({ top: window.scrollY + stepTop(el) - (inset + 16), behavior: from === "chart" && !reducedMotion() ? "smooth" : INSTANT });
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
    const el = turnEl(focusId);
    if (!el) return;
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
      delta = stepTop(el) - (inset + 16);
    }
    if (Math.abs(delta) > 2) {
      // `instant` beats the site's `scroll-behavior: smooth`; only chart-started moves glide.
      window.scrollTo({ top: window.scrollY + delta, behavior: fromChart && !reducedMotion() ? "smooth" : INSTANT });
    }
    if (a && a.from !== "chart") el.querySelector<HTMLElement>("[data-turn-heading]")?.focus({ preventScroll: true });
  }, [focusId]);

  // A deep link (or a cross-objection jump): bring the move into view once the view has settled,
  // and put keyboard focus on it so the next Tab continues from there, not from the top.
  const [initialNode] = useState(valid);
  useEffect(() => {
    if (!initialNode) return;
    const t = window.setTimeout(() => {
      const el = turnEl(initialNode);
      if (!el) return;
      window.scrollTo({ top: window.scrollY + stepTop(el) - (topInset() + 16), behavior: INSTANT });
      el.querySelector<HTMLElement>("[data-turn-heading]")?.focus({ preventScroll: true });
    }, 120);
    return () => window.clearTimeout(t);
  }, [initialNode]);

  /* ---- calls ---- */
  const decideRef = useRef<(id: string, j: Judgment | null) => void>(() => {});
  const decide = useCallback(
    (id: string, j: Judgment | null) => {
      if (!o) return;
      const info = ix.nodes.get(id);
      if (!info || info.objection !== o.id) return;
      const prev = judgments[id] ?? null;
      if (prev === j) return;
      const nextJ = { ...judgments };
      if (j) nextJ[id] = j;
      else delete nextJ[id];
      const after = new Map<string, Label>();
      const objAfter = labelObjection(o, nextJ, after);
      const objBefore = labels.objection.get(o.id) ?? "undec";
      const ids = ix.byObjection.get(o.id) ?? [];
      const changed = new Set<string>([id]);
      for (const nid of ids) if ((labels.node.get(nid) ?? "undec") !== (after.get(nid) ?? "undec")) changed.add(nid);
      setRipple((r) => ({ key: (r?.key ?? 0) + 1, origin: info.depth, changed }));
      judge(id, j);

      const name = q(toPlain(info.node.label));
      const undo = {
        label: "Undo",
        run: () => {
          // Through the normal call path (ripple, toast, announcement), once the toast has gone;
          // then put focus back on the move, since the Undo button is about to disappear.
          window.setTimeout(() => {
            decideRef.current(id, prev);
            requestAnimationFrame(() => {
              const t = turnEl(id)?.querySelector<HTMLElement>("[data-turn-heading], .ch-hit") ?? document.querySelector<HTMLElement>(".ch-thread [data-turn-heading]");
              t?.focus({ preventScroll: true });
            });
          }, 0);
        },
      };
      const here = (t: Tension) => ix.nodes.get(t.node)?.objection === o.id;
      const tensBefore = tensions.filter(here).length;
      const tensAfter = findTensions(ix, nextJ, { node: after, objection: new Map() }).filter(here).length;
      const newTension = tensAfter > tensBefore;
      const did = j ? `you said ${name} ${j}` : `you cleared your call on ${name}`;
      if (objAfter !== objBefore) {
        const what = objAfter === "in" ? "now stands" : objAfter === "out" ? "is now answered" : "is open again";
        toast({
          text: `${cap(did)}, so Objection ${o.numeral} ${what}.${newTension ? " That leaves two moves that contradict each other." : ""}`,
          action: undo,
          tone: newTension ? "tension" : "plain",
          ttl: newTension ? 9000 : 7000,
        });
        return;
      }
      if (newTension) {
        toast({
          text: "You said a move holds, but a reply to it now stands, and a move with a standing reply is answered. These two contradict each other.",
          action: undo,
          tone: "tension",
          ttl: 7000,
        });
        return;
      }
      const others = changed.size - 1;
      if (others > 0) {
        // A visible sign that the call moved other statuses too (the toast is also read out).
        toast({ text: `${cap(did)}. ${others === 1 ? "That changed one other move’s status." : `That changed the status of ${numWord(others)} other moves.`}`, action: undo, ttl: 6000 });
        return;
      }
      const still = objAfter === "in" ? "still stands" : objAfter === "out" ? "is still answered" : "is still open";
      const now = (l: Label) => (l === "in" ? "now stands" : l === "out" ? "is now answered" : "is now open");
      say(j ? `You said ${name} ${j}. Objection ${o.numeral} ${still}.` : `You cleared your call on ${name}. It ${now(after.get(id) ?? "undec")}. Objection ${o.numeral} ${still}.`);
    },
    [o, ix, judgments, labels, tensions, judge, toPlain, toast, say],
  );
  useEffect(() => {
    decideRef.current = decide;
  }, [decide]);

  const jump = useCallback(
    (id: string) => {
      const info = ix.nodes.get(id);
      if (!info) return;
      if (info.objection === oid) focus(id, "link");
      else {
        if (focusId) writeBack(info.objection, focusId);
        go({ view: "objection", o: info.objection, node: id });
      }
    },
    [ix, oid, focus, focusId, go],
  );

  const ids = useMemo(() => ix.byObjection.get(oid) ?? [], [ix, oid]);
  const calls = useMemo(() => ids.filter((id) => judgments[id]).length, [ids, judgments]);
  const api = useMemo<ChamberApi | null>(
    () => (o && focusId ? { o, focusId, path, calls, focus, decide, jump, ripple } : null),
    [o, focusId, path, calls, focus, decide, jump, ripple],
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
  const backInfo = back ? ix.nodes.get(back) : null;
  const spin = o.spinoza;
  const spinBody = (spin?.body ?? []).filter((p) => p.trim());
  const hasScholium = !!spin && (!!spin.title || spinBody.length > 0);
  const nMoves = ids.length;
  const nRounds = ids.reduce((m, id) => Math.max(m, ix.nodes.get(id)?.depth ?? 0), 0);
  const mapMeta = `${nMoves} in ${nRounds} ${nRounds === 1 ? "round" : "rounds"}${nProngs > 1 ? ` · ${nProngs} parts` : ""}`;

  const ready = !!focusId;
  const chart = (variant: "panel" | "inline", bare = false) =>
    ready && focusId ? <ObjectionChart o={o} focusId={focusId} path={path} variant={variant} bare={bare} onSelect={(id) => focus(id, "chart")} /> : null;

  return (
    <ChamberCtx.Provider value={api}>
      <div className="ch">
        <div className={`ch-grid ${wide ? "is-wide" : ""}`}>
          <div className="ch-main">
            {backInfo && back && (
              <div className="ch-backbar">
                <button type="button" className={`ch-back s-${backInfo.node.side}`} onClick={() => openNode(back)}>
                  <span aria-hidden>↩</span>
                  <span className="ch-back-k" title={spellAddress(ix, back)}>
                    Back to {address(ix, back)}
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
                      <span className="ch-eyebrow-short">{o.short}</span>
                    </>
                  )}
                </p>
                <h1 className="ch-title" tabIndex={-1} id="ch-h1">
                  {toPlain(o.title)}
                </h1>
                <a
                  href="#/"
                  className="ch-here"
                  aria-label={`Back to the map of all ${numWord(d.objections.length)} objections`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    go({ view: "home" });
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
                        <Glyph side="skeptic" size={11} /> The Objector
                      </span>
                      <span className="ch-ex-t">{o.objection}</span>
                    </p>
                  )}
                  {o.counter && (
                    <p className="ch-ex s-theist">
                      <span className="ch-ex-k">
                        <Glyph side="theist" size={11} /> The Defender
                      </span>
                      <span className="ch-ex-t">{o.counter}</span>
                    </p>
                  )}
                </div>
              )}

              {o.dek && (
                <p className="ch-dek">
                  <RichText text={o.dek} onNode={jump} />
                </p>
              )}

              <Lineage oid={oid} lineage={o.lineage ?? []} onHistory={() => go({ view: "timeline", moment: o.lineage?.[0] })} />

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

            {!wide &&
              ready &&
              (narrow ? (
                <section className="ch-map-inline ch-map-disc" aria-labelledby="ch-map-btn">
                  <button type="button" id="ch-map-btn" className="ch-map-toggle" aria-expanded={mapOpen} aria-controls="ch-map-body" onClick={() => setMapOpen((v) => !v)}>
                    <span className="ch-map-toggle-k">All moves</span>
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
              ))}

            {/* ---------- part chips ---------- */}
            {nProngs > 1 && (
              <nav className="ch-prongs" aria-label="Parts of this objection">
                <p className="ch-prongs-k">{cap(numWord(nProngs))} parts · pick one to follow</p>
                <ol>
                  {o.prongs.map((p, i) => {
                    const l = labels.node.get(p.id) ?? "undec";
                    const on = p.id === curProng;
                    const call = judgments[p.id];
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          className={`ch-prong s-${p.side} st-${l} ${on ? "on" : ""}`}
                          aria-current={on ? "true" : undefined}
                          onClick={() => focus(p.id, "link")}
                        >
                          <span className="ch-prong-k">
                            Part {i + 1} of {nProngs}
                          </span>
                          <span className="ch-prong-l">
                            <Glyph side={p.side} label={l} size={11} />
                            <span className={l === "out" ? "lab-out" : ""}>{toPlain(p.label)}</span>
                          </span>
                          <span className={`ch-prong-st st-${l}`}>
                            {call ? <span className="your-call">{statusText(l, call)}</span> : STATUS_WORD[l]}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}

            {ready ? <Thread /> : <p className="ch-missing">I haven’t written this one yet.</p>}
            <p className="sr-only" role="status" aria-live="polite">
              {said.text ? `${said.text}${said.n % 2 ? " " : ""}` : ""}
            </p>

            {/* ---------- where Spinoza stands ---------- */}
            {hasScholium && (
              <section className="ch-scholium s-spinoza" aria-labelledby="ch-schol-h">
                <span className="ch-scholium-hatch" aria-hidden />
                <p className="ch-scholium-k">
                  <span aria-hidden>◆</span> {/spinoza stands/i.test(spin.title ?? "") ? "Spinoza" : "Where Spinoza stands"}
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
                    {(spin.quote.who || spin.quote.cite) && (
                      <figcaption>
                        {spin.quote.who && <span className="ch-quote-who">{spin.quote.who}</span>}
                        {spin.quote.cite && <span className="ch-quote-cite">{spin.quote.cite}</span>}
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
    </ChamberCtx.Provider>
  );
}
