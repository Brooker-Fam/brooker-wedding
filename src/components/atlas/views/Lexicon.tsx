"use client";

/* Library · Lexicon (#/lexicon[/<term>]).

   The terms of art, in plain words, A to Z. Each entry links to the moves
   that lean on it; the chosen entry opens in place with every use, grouped by
   objection, and a mini Rose with its footprint lit. A deep link scrolls to
   the entry and marks it. Terms inside a definition jump to their own entry. */

import "./library.css";
import { Fragment, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useAtlas } from "../context";
import { Rich } from "../markup";
import { usePeek } from "../peek";
import { formatRoute } from "../router";
import type { Term } from "../types";
import { FootprintBlock, GlyphKey, LibEmpty, LibHead, NodeChip, fold, scrollBehavior, useMedia } from "./Outline";

const sortKey = (s: string) => fold(s).replace(/^(the|a|an)\s+/, "").replace(/^[^a-z0-9]+/, "");
const letterOf = (t: Term) => {
  const c = sortKey(t.term).charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
};
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Mark the first match of `q` in `text` (accent- and case-insensitive; folding keeps one char per char for Latin text). */
function Highlight({ text, q }: { text: string; q: string }) {
  const needle = fold(q.trim());
  if (!needle) return <>{text}</>;
  const folded = fold(text);
  const i = folded.length === text.length ? folded.indexOf(needle) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="lx-mark">{text.slice(i, i + needle.length)}</mark>
      {text.slice(i + needle.length)}
    </>
  );
}

export default function Lexicon({ term }: { term?: string }) {
  const { d, ix, go, toPlain } = useAtlas();
  const wide = useMedia("(min-width: 1100px)");
  const [q, setQ] = useState("");

  const sorted = useMemo(() => [...d.terms].sort((a, b) => sortKey(a.term).localeCompare(sortKey(b.term))), [d]);
  const present = useMemo(() => new Set(sorted.map(letterOf)), [sorted]);
  const filtered = useMemo(() => {
    const needle = fold(q.trim());
    if (!needle) return sorted;
    return sorted.filter((t) => fold(`${t.term} ${toPlain(t.def)}`).includes(needle));
  }, [sorted, q, toPlain]);
  const groups = useMemo(() => {
    const out: { letter: string; items: Term[] }[] = [];
    for (const t of filtered) {
      const L = letterOf(t);
      const g = out[out.length - 1];
      if (g && g.letter === L) g.items.push(t);
      else out.push({ letter: L, items: [t] });
    }
    return out;
  }, [filtered]);
  const live = useMemo(() => new Set(groups.map((g) => g.letter)), [groups]);

  const sel = term ? ix.terms.get(term) : undefined;
  const missing = !!term && !sel;
  const select = (id: string, toggle = false) => go({ view: "lexicon", term: toggle && id === term ? undefined : id }, { replace: true });

  // Bring the chosen entry into view: after the view transition on arrival, at once afterwards.
  const listRef = useRef<HTMLDivElement>(null);
  const arrived = useRef(false);
  useEffect(() => {
    const first = !arrived.current;
    arrived.current = true;
    if (!term) return;
    const t = setTimeout(
      () => {
        const el = listRef.current?.querySelector<HTMLElement>(`[data-term="${CSS.escape(term)}"]`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const bar = 72;
        if (first || r.top < bar || r.top > window.innerHeight * 0.6) el.scrollIntoView({ block: "start", behavior: scrollBehavior() });
      },
      first ? 420 : 30,
    );
    return () => clearTimeout(t);
  }, [term]);

  const jump = (L: string) => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-letter="${L}"]`);
    el?.scrollIntoView({ block: "start", behavior: scrollBehavior() });
  };

  const used = useMemo(() => sorted.filter((t) => (ix.termRefs.get(t.id)?.length ?? 0) > 0).length, [sorted, ix]);
  const letters = wide ? [...ALPHABET, ...(present.has("#") ? ["#"] : [])] : [...present];
  const qt = q.trim();

  return (
    <div className="lib lib-lexicon">
      <LibHead
        current="lexicon"
        title="Lexicon"
        dek="The terms of art, in plain words. Each one links to the moves that lean on it — choose a term to see them all, lit on the map."
        meta={sorted.length ? `${sorted.length} terms${used ? ` · ${used} in use` : ""}` : undefined}
      />

      {sorted.length === 0 ? (
        <LibEmpty current="lexicon" title="The lexicon is still being written." text="Its entries will appear here, A to Z, each linked to the moves that use it. Meanwhile the outline has every move." />
      ) : (
        <div className="lx-layout">
          <div className="lx-rail">
            <label className="lib-search">
              <span className="sr-only">Search the lexicon</span>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="lib-search-i">
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l3.5 3.5" />
              </svg>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the lexicon" autoComplete="off" spellCheck={false} />
            </label>
            <nav className="lx-az" aria-label="Jump to a letter">
              {letters.map((L) => (
                <button key={L} type="button" className="lx-letter serif" disabled={!live.has(L)} onClick={() => jump(L)} aria-label={`Terms under ${L}`}>
                  {L}
                </button>
              ))}
            </nav>
            {wide && (
              <div className="lx-rail-note">
                <p className="mono lib-k">Chips lead to the moves</p>
                <GlyphKey />
              </div>
            )}
          </div>

          <div className="lx-list" ref={listRef}>
            {missing && <p className="lib-notice">There is no entry for “{term}” yet.</p>}
            <p className={`lib-count mono ${qt ? "" : "sr-only"}`} aria-live="polite">
              {qt ? (filtered.length ? `${filtered.length} ${filtered.length === 1 ? "match" : "matches"} for “${qt}”` : `No term matches “${qt}”`) : ""}
            </p>
            {groups.length === 0 ? (
              <div className="lib-none">
                Try a shorter word.{" "}
                <button type="button" className="lib-link" onClick={() => setQ("")}>
                  Clear the search
                </button>
              </div>
            ) : (
              groups.map((g) => (
                <section key={g.letter} className="lx-group" data-letter={g.letter} aria-labelledby={`lx-l-${g.letter}`}>
                  <h2 className="lx-group-h serif" id={`lx-l-${g.letter}`}>
                    {g.letter}
                  </h2>
                  <div className="lx-entries">
                    {g.items.map((t) => (
                      <Entry key={t.id} t={t} on={sel?.id === t.id} q={qt} onPick={(id, toggle) => select(id, toggle)} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Entry({ t, on, q, onPick }: { t: Term; on: boolean; q: string; onPick: (id: string, toggle?: boolean) => void }) {
  const { ix, toPlain } = useAtlas();
  const uses = ix.termRefs.get(t.id) ?? [];
  const n = uses.length;
  const box = useRef<HTMLElement>(null);
  const wantFocus = useRef(false);
  // A match only in the definition: show the definition as plain text with the match marked.
  const termHit = !!q && fold(t.term).includes(fold(q));
  const defPlain = q && !termHit ? toPlain(t.def) : "";
  const defHit = !!defPlain && fold(defPlain).includes(fold(q));

  // "+ N more" unmounts itself when the entry opens: hand focus to the first move it revealed.
  useEffect(() => {
    if (!on || !wantFocus.current) return;
    wantFocus.current = false;
    const chips = box.current?.querySelectorAll<HTMLElement>(".lx-open .lib-node");
    (chips?.[1] ?? chips?.[0] ?? box.current?.querySelector<HTMLElement>(".lib-fp-title"))?.focus();
  }, [on]);

  return (
    <article ref={box} className={`lx-entry ${on ? "on" : ""}`} data-term={t.id} aria-labelledby={`lx-${t.id}`}>
      <h3 className="lx-term serif" id={`lx-${t.id}`}>
        <button type="button" aria-expanded={on} onClick={() => onPick(t.id, true)}>
          <Highlight text={t.term} q={q} />
        </button>
      </h3>
      <p className="lx-def">{defHit ? <Highlight text={defPlain} q={q} /> : <DefText text={t.def} onTerm={(id) => onPick(id)} />}</p>
      {n === 0 ? (
        <p className="lx-unused mono">Not yet used by a move</p>
      ) : on ? (
        <div className="lx-open">
          <FootprintBlock ids={uses} title={`Used in ${n} ${n === 1 ? "move" : "moves"}`} caption="Lit: where it's used" />
        </div>
      ) : (
        <div className="lx-used">
          <span className="mono lib-k">Used in</span>
          <NodeChip id={uses[0]} />
          {n > 1 && (
            <button
              type="button"
              className="lib-more mono"
              onClick={() => {
                wantFocus.current = true;
                onPick(t.id);
              }}
              aria-label={`Show all ${n} moves that use ${t.term}`}
            >
              + {n - 1} more
            </button>
          )}
        </div>
      )}
    </article>
  );
}

/** Definition text: a term reference jumps to its entry, a thinker opens a peek, a node links into its chamber. */
function DefText({ text, onTerm }: { text: string; onTerm: (id: string) => void }) {
  const { ix, thinkerName, termName } = useAtlas();
  const peek = usePeek();
  return (
    <Rich
      text={text}
      r={{
        thinkerName,
        termName,
        nodeName: (id) => ix.nodes.get(id)?.node.label,
        term: (id, shown, k) =>
          ix.terms.has(id) ? (
            <button key={k} type="button" className="ref-term" onClick={() => onTerm(id)}>
              {shown}
            </button>
          ) : (
            <Fragment key={k}>{shown}</Fragment>
          ),
        thinker: (id, shown, k) => (
          <button key={k} type="button" className="ref-thinker" onClick={(e: MouseEvent<HTMLButtonElement>) => peek({ kind: "thinker", id, rect: e.currentTarget.getBoundingClientRect() })}>
            {shown}
          </button>
        ),
        node: (id, shown, k) => {
          const info = ix.nodes.get(id);
          if (!info) return <Fragment key={k}>{shown}</Fragment>;
          return (
            <a key={k} className={`ref-node s-${info.node.side}`} href={formatRoute({ view: "objection", o: info.objection, node: id })}>
              {shown || info.node.label}
            </a>
          );
        },
      }}
    />
  );
}
