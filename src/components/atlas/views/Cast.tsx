"use client";

/* Library · People (#/cast[/<thinker>]; the route keeps its old name).

   Everyone named in the arguments, in roundels grouped by era and filterable
   by the side that uses their work here (their role in these arguments, which
   can differ from what they believed). Choosing one opens their file: life,
   tradition, a quotation (linked to its text where there is a link), why they
   matter, their key work, where to read more, every move that names them
   (grouped by objection), their moments on the timeline, and a small map with
   those moves lit. Desktop: a sticky file beside the roster.
   Phone / tablet: the file opens in place, under the row of the name you tapped (on a phone the card itself opens
   into the file).

   Two orders: by era (the default, with a sticky row of eras on phones) or A to Z by surname (with letter buttons and,
   on phones and tablets held upright, an A–Z rail at the right edge). */

import "./library.css";
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useAtlas } from "../context";
import { initials } from "../peek";
import { Glyph, RichText } from "../primitives";
import { formatRoute } from "../router";
import type { DisputationIndex } from "../semantics";
import type { ObjectionId, Quote, Side, Thinker } from "../types";
import { ChipRow, ERAS, FootprintBlock, JumpRow, LetterNav, LibEmpty, LibHead, LibTabs, ScrubRail, eraOf, fold, holdChrome, jumpTo, scrollBehavior, spokenBy, useMedia, yearText } from "./Outline";
import { QuoteFigure } from "./OutlineList";
import { SourceList } from "./Sources";

type TSide = Side | "neutral";
/** Which side uses a person's work here: worked out from the moves that name them, never from their own `side`. */
type Use = "skeptic" | "theist" | "both" | "spinoza" | "neutral";
type UseFilter = "all" | Use;
type Order = "era" | "az";

/* A to Z goes by surname: "Thomas Aquinas" under A, "Abu Hamid al-Ghazali" under G; "Augustine of Hippo", "Paul the
   Apostle" and "Pope Leo XIII" under their given names. A particle files with the surname the way the name is usually
   indexed: "Peter van Inwagen" and "Michael Della Rocca" under V and D (as Sources files them), "Luis de Molina" and
   "Adolf von Harnack" under M and H. */
const PARTICLE = /^(van|De|Del|Della|Di|Da|Le|La|ibn|Ibn|ben)$/;
function sortName(name: string): string {
  const base = name.replace(/\([^)]*\)/g, " ").split(",")[0].trim();
  const given = base.split(/\s+(?:of|the)\s+/i)[0];
  const ws = given.split(/\s+/).filter((w) => w && !/^(jr|sr)\.?$/i.test(w));
  if (ws.length > 1 && /^[IVXLC]+$/.test(ws[ws.length - 1])) ws.pop();
  if (given !== base || ws.length === 1) return fold(ws.join(" "));
  const n = ws.length;
  const k = PARTICLE.test(ws[n - 2]) ? n - 2 : n - 1;
  return fold(`${ws.slice(k).join(" ").replace(/^al-/i, "")} ${ws.slice(0, k).join(" ")}`).trim();
}
const letterOfName = (key: string) => {
  const c = key.replace(/^[^a-z]+/, "").charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
};
/** The order chosen, for the rest of this visit (Back to People keeps it). */
let keptOrder: Order = "era";

/* A person's mark says which side uses their work in these arguments, from the moves that name them (and the moves
   their timeline events go with). It says nothing about what they believed, and neither does their card's colour. */
const USE: Record<Use, string> = {
  skeptic: "Used by the Objector",
  theist: "Used by the Defender",
  both: "Used by both sides",
  spinoza: "Spinoza",
  neutral: "Background",
};
const USE_NOTE: Record<Use, string> = {
  skeptic: "Named only on the Objector’s side, in a move or a timeline event tied to one. Their work supports the objections.",
  theist: "Named only on the Defender’s side, in a move or a timeline event tied to one. Their work helps answer the objections.",
  both: "Named in moves on both sides. Often one side builds on their work and the other replies to it.",
  spinoza: "Spinoza himself, who held that God is Nature itself and acts from necessity, with no choosing will and no purpose. Anyone named only where he speaks gets the same mark.",
  neutral: "Not tied to any move. They’re here for the history, on the timeline.",
};
const FILTERS: Use[] = ["skeptic", "theist", "both", "spinoza", "neutral"];

/** The one rule for a person's mark (filters, counts, roundel badges, card colours, the file and the legend all use it):
    Objector moves only → the Objector; Defender moves only → the Defender; both → both sides; Spinoza himself, or
    named only where Spinoza speaks → Spinoza; no move names them → Background. A timeline event of theirs that goes
    with a move counts as that move (so the Timeline's "Go to the move" and this mark agree). */
function usageOf(ix: DisputationIndex, t: Thinker): Use {
  if (t.id === "spinoza") return "spinoza";
  const sides = new Set<Side>();
  for (const id of ix.thinkerRefs.get(t.id) ?? []) {
    const s = ix.nodes.get(id)?.node.side;
    if (s) sides.add(s);
  }
  for (const m of ix.moments.values()) {
    if (m.thinker !== t.id || !m.node) continue;
    const s = ix.nodes.get(m.node)?.node.side;
    if (s) sides.add(s);
  }
  if (sides.has("skeptic") && sides.has("theist")) return "both";
  if (sides.has("skeptic")) return "skeptic";
  if (sides.has("theist")) return "theist";
  if (sides.has("spinoza")) return "spinoza";
  return "neutral";
}
/** The mark's words for one person: Spinoza's own file says "Spinoza"; others with his mark are named where he speaks. */
const markWord = (t: Thinker, u: Use) => (u === "spinoza" && t.id !== "spinoza" ? "Used where Spinoza speaks" : USE[u]);
/** The card's colour follows the mark (which side uses their work here), never what they believed: one side's
    colour for one side only, bone for both sides and for background figures. */
const tint = (u: Use): TSide => (u === "skeptic" || u === "theist" || u === "spinoza" ? u : "neutral");

function SideMark({ use, size = 10 }: { use: Use; size?: number }) {
  if (use === "neutral") {
    // a short dash: not the ■ that marks the reader, nor the dotted empty chair
    return (
      <svg className="glyph-svg ca-mark s-neutral" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <path d={`M${size * 0.2},${size / 2}H${size * 0.8}`} />
      </svg>
    );
  }
  if (use === "both") {
    // ▲ and ● side by side, each in its own side's colour
    const h = size * 0.92;
    const w = h * 2 + size * 0.18;
    const c = h + size * 0.18 + h / 2;
    return (
      <svg className="glyph-svg ca-mark ca-both" width={w} height={size} viewBox={`0 0 ${w} ${size}`} aria-hidden>
        <path className="s-skeptic" d={`M${h / 2},${size * 0.1}L${h * 0.97},${size * 0.88}L${h * 0.03},${size * 0.88}Z`} />
        <circle className="s-theist" cx={c} cy={size / 2} r={h * 0.4} />
      </svg>
    );
  }
  return <Glyph side={use} size={size} className="ca-mark" />;
}

/** The quotation's speaker is just this person's name (so the file needn't repeat it under the quote). */
const sameName = (who: string, name: string) => {
  const w = fold(who).trim();
  const n = fold(name).trim();
  return w === n || n.endsWith(` ${w}`) || n.startsWith(`${w} of `) || n.startsWith(`${w} the `);
};

/** A plain click (no modifier keys): handle it in place; otherwise let the browser open the link. */
const plainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export default function Cast({ thinker }: { thinker?: string }) {
  const { d, ix, go } = useAtlas();
  const wide = useMedia("(min-width: 980px)");
  const [side, setSide] = useState<UseFilter>("all");
  const [q, setQ] = useState("");
  const [order, setOrderState] = useState<Order>(keptOrder);
  const setOrder = (o: Order) => {
    keptOrder = o;
    setOrderState(o);
  };
  // How many roundels share a row (phone / tablet), so a file opens under the whole row, not mid-row.
  const [cols, setCols] = useState(1);

  const all = useMemo(() => [...d.thinkers].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name)), [d]);
  const uses = useMemo(() => new Map(all.map((t) => [t.id, usageOf(ix, t)])), [all, ix]);
  const counts = useMemo(() => {
    const c: Record<Use, number> = { skeptic: 0, theist: 0, both: 0, spinoza: 0, neutral: 0 };
    for (const t of all) c[uses.get(t.id) ?? "neutral"]++;
    return c;
  }, [all, uses]);
  const list = useMemo(() => {
    const needle = fold(q.trim());
    return all.filter((t) => (side === "all" || uses.get(t.id) === side) && (!needle || fold(`${t.name} ${t.tradition} ${t.work ?? ""}`).includes(needle)));
  }, [all, uses, side, q]);
  const keys = useMemo(() => new Map(all.map((t) => [t.id, sortName(t.name)])), [all]);
  /** The sections shown: eras (by era) or surname letters (A to Z). */
  const groups = useMemo(() => {
    if (order === "era") {
      return ERAS.map((era) => ({ id: era.id, name: era.name, span: era.span, items: list.filter((t) => eraOf(t.year).id === era.id) })).filter((g) => g.items.length > 0);
    }
    const out: { id: string; name: string; span: string; items: Thinker[] }[] = [];
    const byKey = [...list].sort((a, b) => keys.get(a.id)!.localeCompare(keys.get(b.id)!) || a.name.localeCompare(b.name));
    for (const t of byKey) {
      const L = letterOfName(keys.get(t.id)!);
      const g = out[out.length - 1];
      if (g && g.id === L) g.items.push(t);
      else out.push({ id: L, name: L, span: "", items: [t] });
    }
    return out;
  }, [list, order, keys]);
  const filtering = side !== "all" || q.trim() !== "";

  const sel = thinker ? ix.thinkers.get(thinker) : undefined;
  const missing = !!thinker && !sel;
  // Choosing someone in this view moves focus to their file (the panel beside the roster, or the file under the row),
  // so the next Tab reads it rather than walking on through the roster. Arriving from another view is the Shell's job.
  // On a phone the card opens into the file right under it, so focus stays on the card.
  const focusFile = useRef<string | null>(null);
  const select = (id: string) => {
    if (id === thinker && wide) {
      // already showing: just take focus there
      requestAnimationFrame(() => document.getElementById(`ca-file-${id}`)?.focus({ preventScroll: true }));
      return;
    }
    const off = id === thinker;
    focusFile.current = off || (!wide && cols === 1) ? null : id;
    go({ view: "cast", thinker: off ? undefined : id }, { replace: true });
  };
  useEffect(() => {
    const id = focusFile.current;
    if (!id || id !== thinker) return;
    focusFile.current = null;
    const raf = requestAnimationFrame(() => document.getElementById(`ca-file-${id}`)?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(raf);
  }, [thinker]);
  const rosterRef = useRef<HTMLDivElement>(null);
  /** Back to this person's card in the roster (the file's ×, "Back to the list", Escape in the panel). */
  const toCard = useCallback((id: string) => {
    const card = rosterRef.current?.querySelector<HTMLElement>(`[data-tid="${CSS.escape(id)}"]`);
    if (!card) return;
    const r = card.getBoundingClientRect();
    if (r.top < 60 || r.bottom > window.innerHeight) {
      holdChrome(1100);
      card.scrollIntoView({ block: "center", behavior: scrollBehavior() });
    }
    card.focus({ preventScroll: true });
  }, []);
  const close = useCallback(
    (id: string) => {
      go({ view: "cast" }, { replace: true });
      // after the re-render: on a phone the card is hidden while its file is open
      requestAnimationFrame(() => toCard(id));
    },
    [go, toCard],
  );
  const onPanelKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Escape" || e.defaultPrevented || !sel) return;
    e.preventDefault();
    toCard(sel.id);
  };

  useLayoutEffect(() => {
    const el = rosterRef.current;
    if (!el || wide) return;
    const measure = () => {
      const g = el.querySelector<HTMLElement>(".ca-grid");
      if (!g) return;
      const n = getComputedStyle(g).gridTemplateColumns.split(" ").filter(Boolean).length;
      setCols(Math.max(1, n));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wide, groups.length]);
  /** A phone (one card per row): the chosen card opens into its file, so the file doesn't repeat the card. */
  const merged = !wide && cols === 1;

  const groupsRef = useRef<HTMLDivElement>(null);
  const sectionOf = useCallback((id: string) => groupsRef.current?.querySelector<HTMLElement>(`[data-group="${CSS.escape(id)}"]`) ?? null, []);
  const jumpItems = useMemo(() => groups.map((g) => ({ id: g.id, content: g.name, aria: `${g.name}, ${g.items.length} ${g.items.length === 1 ? "person" : "people"}` })), [groups]);
  const stops = useMemo(() => groups.map((g) => ({ key: g.id, label: g.name, count: g.items.length })), [groups]);
  const present = useMemo(() => new Set(groups.map((g) => g.id)), [groups]);

  // Bring the chosen name into view: on arrival once the view has settled, at once afterwards.
  // On a phone, a file that opens low on the screen pulls its name (and the file under it) up.
  const arrived = useRef(false);
  useEffect(() => {
    const first = !arrived.current;
    arrived.current = true;
    if (!thinker) return;
    const id = thinker;
    const t = setTimeout(
      () => {
        const card = rosterRef.current?.querySelector<HTMLElement>(`[data-tid="${CSS.escape(id)}"]`);
        holdChrome(1100);
        if (wide) {
          const r = card?.getBoundingClientRect();
          if (card && r && (first || r.top < 60 || r.bottom > window.innerHeight)) card.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
          return;
        }
        const file = rosterRef.current?.querySelector<HTMLElement>(".ca-inline");
        // On a phone the chosen card hides while its file is open (the file repeats it), so the file is the anchor.
        const shown = card && card.getClientRects().length > 0 ? card : undefined;
        const r = (file ?? shown)?.getBoundingClientRect();
        const cr = shown?.getBoundingClientRect();
        const to = shown ?? file;
        if (to && r && (first || r.top > window.innerHeight * 0.55 || (cr && cr.top < 0) || (!shown && r.top < 0))) jumpTo(to);
      },
      first ? 420 : 30,
    );
    return () => clearTimeout(t);
  }, [thinker, wide]);

  const first = all[0];
  const last = all[all.length - 1];

  const head = (
    <LibHead
      current="cast"
      title="People"
      dek="Everyone in the arguments and on the timeline. The mark by each name shows which side uses that person’s work here, and that isn’t always the side they were on. Duns Scotus, a Franciscan friar, is marked for the Objector, who uses his argument against Aquinas."
      meta={all.length ? `${all.length} people · ${yearText(first.year)} to ${yearText(last.year)}` : undefined}
    />
  );

  return (
    <div className="lib lib-cast">
      <LibTabs current="cast" />
      {all.length === 0 ? (
        <>
          {head}
          <LibEmpty current="cast" title="No one listed yet." text="I haven’t added anyone yet. Each person will get their dates and the moves that name them." />
        </>
      ) : (
        <div className="ca-layout">
          <div className="ca-roster" ref={rosterRef}>
            {head}
            <div className="ca-tools">
              <label className="lib-search">
                <span className="sr-only">Search people</span>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="lib-search-i">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5" />
                </svg>
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, tradition or book" autoComplete="off" spellCheck={false} />
              </label>
              <ChipRow className="ca-filters" label="Show one group" active={side}>
                <button type="button" className="ca-filter" aria-pressed={side === "all"} onClick={() => setSide("all")}>
                  Everyone <span className="ca-filter-n mono">{all.length}</span>
                </button>
                {FILTERS.filter((s) => counts[s] > 0).map((s) => (
                  <button key={s} type="button" className={`ca-filter s-${s}`} aria-pressed={side === s} onClick={() => setSide(side === s ? "all" : s)}>
                    <SideMark use={s} size={10} />
                    {USE[s]}
                    <span className="ca-filter-n mono">{counts[s]}</span>
                  </button>
                ))}
              </ChipRow>
              <div className="src-group ca-order" role="group" aria-label="Order the list">
                <span className="mono lib-k">Order</span>
                <div className="src-seg">
                  <button type="button" className="ca-filter" aria-pressed={order === "era"} onClick={() => setOrder("era")}>
                    By era
                  </button>
                  <button type="button" className="ca-filter" aria-pressed={order === "az"} onClick={() => setOrder("az")}>
                    A to Z
                  </button>
                </div>
              </div>
              <p className={`lib-count mono ${filtering ? "" : "sr-only"}`} aria-live="polite">
                {filtering ? (list.length ? `Showing ${list.length} of ${all.length} people` : `No one matches`) : ""}
              </p>
            </div>

            {missing && <p className="lib-notice">There’s no one here called “{thinker}”. Choose a name below.</p>}
            {sel && !wide && !list.includes(sel) && (
              <div className="ca-inline ca-inline-top">
                <ThinkerFile t={sel} onClose={() => close(sel.id)} />
              </div>
            )}

            {groups.length > 1 &&
              (order === "era" ? (
                !wide && <JumpRow className="ca-jump" label="Jump to an era" items={jumpItems} target={sectionOf} />
              ) : (
                <LetterNav letters={groups.map((g) => g.id)} live={present} target={sectionOf} label="Jump to a letter" describe={(L) => `People under ${L}`} />
              ))}

            {groups.length === 0 ? (
              <div className="lib-none">
                No one matches{q ? ` “${q}”` : ""}.{" "}
                <button
                  type="button"
                  className="lib-link"
                  onClick={() => {
                    setQ("");
                    setSide("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={`ca-groups ${order === "az" ? "ca-az" : ""}`} ref={groupsRef}>
                {groups.map(({ id, name, span, items }) => {
                  // On narrow screens the file goes after the last roundel of the chosen one's row.
                  const at = !wide && sel ? items.findIndex((t) => t.id === sel.id) : -1;
                  const rowEnd = at < 0 ? -1 : Math.min(items.length - 1, Math.floor(at / cols) * cols + cols - 1);
                  return (
                    <section key={id} className="ca-era" data-group={id} aria-labelledby={`ca-era-${id}`}>
                      <h2 className="ca-era-h" id={`ca-era-${id}`}>
                        <span className="serif">{name}</span>
                        {span && <span className="mono">{span}</span>}
                        <span className="ca-era-n mono">
                          {items.length}
                          <span className="sr-only"> {items.length === 1 ? "person" : "people"}</span>
                        </span>
                      </h2>
                      <ul className="ca-grid">
                        {items.map((t, i) => (
                          <Fragment key={t.id}>
                            <li className="ca-cell">
                              <Roundel t={t} use={uses.get(t.id) ?? "neutral"} on={sel?.id === t.id} wide={wide} open={merged && sel?.id === t.id} onPick={() => select(t.id)} />
                            </li>
                            {i === rowEnd && sel && (
                              <li className={`ca-inline ${merged ? "merged" : ""}`}>
                                <ThinkerFile t={sel} key={sel.id} merged={merged} onClose={() => close(sel.id)} />
                              </li>
                            )}
                          </Fragment>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            )}
            {order === "az" && <ScrubRail stops={stops} target={sectionOf} list={groupsRef} unit={["person", "people"]} />}
          </div>

          {wide && (
            <aside className="ca-panel" id="ca-panel" aria-label="About this person" onKeyDown={onPanelKey}>
              {sel ? <ThinkerFile t={sel} key={sel.id} onBack={() => toCard(sel.id)} /> : <CastIntro onPick={select} />}
            </aside>
          )}
          {/* The desktop file changes beside the roster; say so. */}
          <p className="sr-only" aria-live="polite">
            {wide && sel ? `Showing ${sel.name}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

function Roundel({ t, use, on, wide, open = false, onPick }: { t: Thinker; use: Use; on: boolean; wide: boolean; open?: boolean; onPick: () => void }) {
  const { ix } = useAtlas();
  const n = ix.thinkerRefs.get(t.id)?.length ?? 0;
  const s = tint(use);
  return (
    <a
      href={formatRoute({ view: "cast", thinker: t.id })}
      data-tid={t.id}
      className={`ca-card s-${s} ${on ? "on" : ""} ${open ? "open" : ""}`}
      onClick={(e) => {
        if (!plainClick(e)) return;
        e.preventDefault();
        onPick();
      }}
      aria-current={wide && on ? "true" : undefined}
      aria-expanded={wide ? undefined : on}
      aria-controls={wide ? "ca-panel" : undefined}
    >
      <span className="monogram ca-mono" aria-hidden>
        {initials(t.name)}
        <span className={`ca-badge s-${use}`}>
          <SideMark use={use} size={use === "both" ? 6 : 8} />
        </span>
      </span>
      <span className="ca-txt">
        <span className="ca-name serif" id={`ca-name-${t.id}`}>
          {t.name}
        </span>
        <span className="ca-life mono">
          {t.life}
          <span className="sr-only"> · {markWord(t, use)}</span>
          {n > 0 && <span className="ca-n">{` · ${n} ${n === 1 ? "move" : "moves"}`}</span>}
        </span>
        {t.tradition && <span className="ca-trad">{t.tradition}</span>}
      </span>
      {!wide && <span className="ca-chev" aria-hidden />}
    </a>
  );
}

function ThinkerFile({ t, merged = false, onClose, onBack }: { t: Thinker; merged?: boolean; onClose?: () => void; onBack?: () => void }) {
  const { d, ix } = useAtlas();
  const refs = useMemo(() => ix.thinkerRefs.get(t.id) ?? [], [ix, t.id]);
  const moments = useMemo(() => [...d.moments].filter((m) => m.thinker === t.id).sort((a, b) => a.year - b.year), [d, t.id]);
  // Their own signature line if the registry has one; otherwise a quotation of theirs that a move already carries,
  // so the file opens on their words. Moves on their own side come first: a move on the other side may quote them
  // stating the view they go on to reject (Boethius's prisoner, before Philosophy answers him). Then up to two more
  // short quotations from moves on their side, from other objections where there are any.
  const { quote, more } = useMemo(() => {
    type Said = { q: Quote; o: ObjectionId };
    const said: Said[] = [];
    const ours: Said[] = [];
    for (const id of refs) {
      const info = ix.nodes.get(id);
      const q = info?.node.quote;
      if (!info || !q?.text || !spokenBy(q.who, t.name)) continue;
      said.push({ q, o: info.objection });
      if (info.node.side === t.side) ours.push({ q, o: info.objection });
    }
    const pick = (xs: Said[]) => xs.find((x) => x.q.text.length <= 260) ?? xs[0];
    const first = t.quote?.text ? undefined : (pick(ours) ?? pick(said));
    const lead = t.quote?.text ? t.quote : first?.q;
    const seen = new Set(lead ? [fold(lead.text)] : []);
    const used = new Set(first ? [first.o] : []);
    const extra: Quote[] = [];
    while (extra.length < 2) {
      const fresh = ours.filter((x) => x.q.text.length <= 260 && !seen.has(fold(x.q.text)));
      const next = fresh.find((x) => !used.has(x.o)) ?? fresh[0];
      if (!next) break;
      extra.push(next.q);
      seen.add(fold(next.q.text));
      used.add(next.o);
    }
    return { quote: lead, more: extra };
  }, [t, refs, ix]);
  const use = usageOf(ix, t);
  const s = tint(use);
  const reading = (t.sources ?? []).filter((x) => x.title);
  const linked = refs.length === 0 && moments.some((m) => m.node && ix.nodes.has(m.node));
  return (
    <article className={`ca-file s-${s} ${merged ? "merged" : ""}`} aria-labelledby={`ca-file-${t.id}`}>
      {onClose && !merged && (
        <button type="button" className="ca-close" onClick={onClose} aria-label={`Close ${t.name}`}>
          ×
        </button>
      )}
      {merged ? (
        // The card above is this file's header (name, dates, tradition): say only which side uses their work.
        <header className="ca-file-head ca-file-head-merged">
          <h2 className="sr-only" id={`ca-file-${t.id}`} tabIndex={-1}>
            {t.name}
          </h2>
          <p className="ca-file-meta mono">
            <span className={`ca-file-lean s-${use}`}>
              <SideMark use={use} size={9} />
              {markWord(t, use)}
            </span>
          </p>
        </header>
      ) : (
        <header className="ca-file-head">
          <span className="monogram ca-file-mono" aria-hidden>
            {initials(t.name)}
          </span>
          <div className="ca-file-id">
            <h2 className="ca-file-name serif" id={`ca-file-${t.id}`} tabIndex={-1}>
              {t.name}
            </h2>
            <p className="ca-file-meta mono">
              {t.life}
              <span className={`ca-file-lean s-${use}`}>
                <SideMark use={use} size={9} />
                {markWord(t, use)}
              </span>
            </p>
          </div>
        </header>
      )}
      {t.tradition && !merged && <p className="ca-file-trad">{t.tradition}</p>}
      <QuoteFigure q={quote} hideWho={!!quote?.who && sameName(quote.who, t.name)} className="ca-file-quote" />
      {t.line && (
        <p className={`ca-file-line serif ${quote ? "after-quote" : ""}`}>
          <RichText text={t.line} />
        </p>
      )}
      {t.work && (
        <p className="ca-file-work">
          <span className="mono lib-k">Key work</span>
          <span className="ca-file-work-t">{t.work}</span>
        </p>
      )}
      {more.length > 0 && (
        <div className="ca-file-sec ca-file-more">
          <p className="mono lib-k">More in their words</p>
          {more.map((q) => (
            <QuoteFigure key={q.text} q={q} hideWho={!!q.who && sameName(q.who, t.name)} className="ca-more-quote" />
          ))}
        </div>
      )}
      {reading.length > 0 && (
        <div className="ca-file-sec ca-file-read">
          <p className="mono lib-k">Read more</p>
          <SourceList sources={reading} className="ca-read-list" />
        </div>
      )}

      <div className="ca-file-sec">
        {refs.length > 0 ? (
          <FootprintBlock ids={refs} title={`Named in ${refs.length} ${refs.length === 1 ? "move" : "moves"}`} caption="Highlighted on the map" limit={16} plain />
        ) : (
          <>
            <p className="mono lib-k">Not named in any move</p>
            {moments.length > 0 && (
              <p className="ca-file-none">{linked ? "Their event on the timeline, below, goes with a move." : "They appear on the timeline, below."}</p>
            )}
          </>
        )}
      </div>

      {moments.length > 0 && (
        <div className="ca-file-sec">
          <p className="mono lib-k">On the timeline</p>
          <ul className="ca-moments">
            {moments.map((m) => (
              <li key={m.id}>
                <a className="ca-moment" href={formatRoute({ view: "timeline", moment: m.id })}>
                  <span className="ca-moment-y mono">{m.when}</span>
                  <span className="ca-moment-t">{m.title}</span>
                  <span className="ca-moment-go" aria-hidden>
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {onBack && (
        <p className="ca-back-row">
          <button type="button" className="ca-back mono" onClick={onBack} title="Or press Escape">
            <span aria-hidden>←</span> Back to the list
          </button>
        </p>
      )}
      {merged && onClose && (
        <p className="ca-back-row">
          <button type="button" className="ca-back mono" onClick={onClose} aria-label={`Close ${t.name}`}>
            <span aria-hidden>↑</span> Close
          </button>
        </p>
      )}
    </article>
  );
}

/** What the desktop panel shows before anyone is chosen: what the marks mean, and a few good first picks. */
function CastIntro({ onPick }: { onPick: (id: string) => void }) {
  const { d, ix } = useAtlas();
  const picks = useMemo(
    () =>
      [...d.thinkers]
        .map((t) => ({ t, n: ix.thinkerRefs.get(t.id)?.length ?? 0, u: usageOf(ix, t) }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n || a.t.year - b.t.year)
        .slice(0, 5),
    [d, ix],
  );
  return (
    <div className="ca-intro">
      <p className="ca-intro-hint">Choose someone to read about them and see every move that mentions them.</p>
      <p className="mono lib-k">What the marks mean</p>
      <ul className="ca-legend">
        {FILTERS.map((s) => (
          <li key={s} className={`s-${s}`}>
            <span className="monogram ca-legend-mono" aria-hidden>
              <SideMark use={s} size={s === "both" ? 7 : 9} />
            </span>
            <span>
              <strong>{USE[s]}</strong>
              <span className="ca-legend-d">{USE_NOTE[s]}</span>
            </span>
          </li>
        ))}
      </ul>
      {picks.length > 0 && (
        <>
          <p className="mono lib-k ca-picks-k">Named most often</p>
          <ul className="ca-picks">
            {picks.map(({ t, n, u }) => (
              <li key={t.id}>
                <a
                  className={`ca-pick s-${tint(u)}`}
                  href={formatRoute({ view: "cast", thinker: t.id })}
                  onClick={(e) => {
                    if (!plainClick(e)) return;
                    e.preventDefault();
                    onPick(t.id);
                  }}
                >
                  <span className="monogram" aria-hidden>
                    {initials(t.name)}
                  </span>
                  <span className="ca-pick-name">{t.name}</span>
                  <span className="ca-pick-n mono">
                    {n} {n === 1 ? "move" : "moves"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
