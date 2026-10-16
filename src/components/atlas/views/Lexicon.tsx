"use client";

/* Library · Glossary (#/lexicon[/<term>]; the route keeps its old name).

   Technical terms in plain words, A to Z. Each entry links to the moves that
   use it; the chosen entry opens in place with every use, grouped by
   objection, and a small map with those moves lit. A deep link scrolls to
   the entry and marks it. Terms inside a definition jump to their own entry.

   On a phone each entry starts compact (the term and the first sentence of its
   definition) and opens on a tap; an A–Z rail at the right edge jumps through
   the letters. */

import "./library.css";
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useAtlas } from "../context";
import { Rich } from "../markup";
import { usePeek } from "../peek";
import { formatRoute } from "../router";
import type { Term } from "../types";
import { FootprintBlock, GlyphKey, LetterNav, LibEmpty, LibHead, LibTabs, NodeChip, ScrubRail, coverAt, fold, holdChrome, jumpTo, useMedia } from "./Outline";

const sortKey = (s: string) => fold(s).replace(/^(the|a|an)\s+/, "").replace(/^[^a-z0-9]+/, "");
const letterOf = (t: Term) => {
  const c = sortKey(t.term).charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
};
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* A sentence ends at . ! or ? (and any closing quote) followed by a space and a capital, a digit or an opening quote,
   but not after an abbreviation ("e.g.", "c.", "St.") or an initial ("C. S. Lewis"). */
const ABBR_END = /(?:\b(?:e\.g|i\.e|cf|c|ca|St|Dr|Mr|Mrs|Ms|vs|vol|ch|pt|bk|sect|no|ed|eds|trans|art|fl|b|d)|\b[A-Z])\.$/;
function splitSentences(text: string): string[] {
  const out: string[] = [];
  const re = /[.!?]["”’)]*\s+(?=["“‘(]?[A-Z0-9])/g;
  let from = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const end = m.index + m[0].trimEnd().length;
    if (ABBR_END.test(text.slice(from, end).replace(/["”’)]+$/, ""))) continue;
    out.push(text.slice(from, end));
    from = m.index + m[0].length;
  }
  if (from < text.length) out.push(text.slice(from));
  return out.map((s) => s.trim()).filter(Boolean);
}

/** A first sentence that says what the word means in its own language: "Greek for “restoration.”", "Latin for “cause
    of itself.”" */
const ORIGIN_NOTE = /^(Latin|Greek|Hebrew|German|French|Arabic)\b[^.]* for\b/;

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
  // Compact entries on a phone, held upright or on its side (library.css uses the same query).
  const compact = useMedia("(max-width: 720px), (max-height: 560px) and (pointer: coarse)");
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
  const listRef = useRef<HTMLDivElement>(null);
  const entryEl = (id: string) => listRef.current?.querySelector<HTMLElement>(`[data-term="${CSS.escape(id)}"]`) ?? null;

  // Opening one entry closes another: keep the one just tapped where it was on the screen, so the page doesn't jump.
  const anchor = useRef<{ id: string; top: number } | null>(null);
  const select = (id: string, toggle = false) => {
    const el = entryEl(id);
    if (el) anchor.current = { id, top: el.getBoundingClientRect().top };
    go({ view: "lexicon", term: toggle && id === term ? undefined : id }, { replace: true });
  };
  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    const el = a ? listRef.current?.querySelector<HTMLElement>(`[data-term="${CSS.escape(a.id)}"]`) : null;
    if (!a || !el) return;
    const dy = el.getBoundingClientRect().top - a.top;
    if (Math.abs(dy) > 1) {
      holdChrome(300);
      window.scrollBy({ top: dy, left: 0, behavior: "instant" });
    }
  }, [term]);

  // Bring the chosen entry into view: after the view transition on arrival, at once afterwards (if it opened low on
  // the screen or under the sticky rows).
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
        const covered = coverAt(el) || 72;
        if (first || r.top < covered - 8 || r.top > window.innerHeight * 0.6) jumpTo(el);
      },
      first ? 420 : 30,
    );
    return () => clearTimeout(t);
  }, [term]);

  const letterTarget = useCallback((L: string) => listRef.current?.querySelector<HTMLElement>(`[data-letter="${L}"]`) ?? null, []);
  const stops = useMemo(() => groups.map((g) => ({ key: g.letter, label: g.letter, count: g.items.length })), [groups]);

  const used = useMemo(() => sorted.filter((t) => (ix.termRefs.get(t.id)?.length ?? 0) > 0).length, [sorted, ix]);
  const letters = wide ? [...ALPHABET, ...(present.has("#") ? ["#"] : [])] : [...present];
  const qt = q.trim();

  return (
    <div className="lib lib-lexicon">
      <LibTabs current="lexicon" />
      <LibHead
        current="lexicon"
        title="Glossary"
        dek={compact ? "Technical terms from the arguments, in plain words. Tap one to read it and see every move that uses it." : "Technical terms from the arguments, in plain words. Choose one to see every move that uses it."}
        meta={sorted.length ? `${sorted.length} terms${used && used !== sorted.length ? ` · ${used} used in the arguments` : ""}` : undefined}
      />

      {sorted.length === 0 ? (
        <LibEmpty current="lexicon" title="No terms yet." text="I haven’t written the glossary yet. Each term will link to the moves that use it." />
      ) : (
        <div className="lx-layout">
          <div className="lx-rail">
            <label className="lib-search">
              <span className="sr-only">Search the glossary</span>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="lib-search-i">
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l3.5 3.5" />
              </svg>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the glossary" autoComplete="off" spellCheck={false} />
            </label>
            <LetterNav letters={letters} live={live} target={letterTarget} label="Jump to a letter" describe={(L) => `Terms starting with ${L}`} />
            {wide && (
              <div className="lx-rail-note">
                <p className="mono lib-k">Who makes each move</p>
                <GlyphKey />
              </div>
            )}
          </div>

          <div className="lx-list" ref={listRef}>
            {missing && <p className="lib-notice">There’s no entry for “{term}”. Try the search or pick a letter.</p>}
            <p className={`lib-count mono ${qt ? "" : "sr-only"}`} aria-live="polite">
              {qt ? (filtered.length ? `${filtered.length} ${filtered.length === 1 ? "match" : "matches"} for “${qt}”` : `No term matches “${qt}”`) : ""}
            </p>
            {groups.length === 0 ? (
              <div className="lib-none">
                Try a shorter word.{" "}
                <button type="button" className="lib-link" onClick={() => setQ("")}>
                  Clear search
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
                      <Entry key={t.id} t={t} on={sel?.id === t.id} q={qt} compact={compact} onPick={(id, toggle) => select(id, toggle)} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
          <ScrubRail stops={stops} target={letterTarget} list={listRef} unit={["term", "terms"]} />
        </div>
      )}
    </div>
  );
}

function Entry({ t, on, q, compact, onPick }: { t: Term; on: boolean; q: string; compact: boolean; onPick: (id: string, toggle?: boolean) => void }) {
  const { ix, toPlain } = useAtlas();
  const uses = ix.termRefs.get(t.id) ?? [];
  const n = uses.length;
  const box = useRef<HTMLElement>(null);
  const wantFocus = useRef(false);
  // A match only in the definition: show the definition as plain text with the match marked.
  const termHit = !!q && fold(t.term).includes(fold(q));
  const defPlain = (q && !termHit) || (compact && !on) ? toPlain(t.def) : "";
  const defHit = !!q && !termHit && !!defPlain && fold(defPlain).includes(fold(q));

  // "+ N more" unmounts itself when the entry opens: hand focus to the first move it revealed.
  useEffect(() => {
    if (!on || !wantFocus.current) return;
    wantFocus.current = false;
    const chips = box.current?.querySelectorAll<HTMLElement>(".lx-open .lib-node");
    (chips?.[1] ?? chips?.[0] ?? box.current?.querySelector<HTMLElement>(".lib-fp-title"))?.focus();
  }, [on]);

  // Phone, closed: the term and the first sentence of its definition (or the sentence the search matched). The whole
  // entry opens it.
  if (compact && !on) {
    const parts = splitSentences(defPlain);
    const hit = defHit ? parts.find((s) => fold(s).includes(fold(q))) : undefined;
    // A first sentence that only translates the word ("Greek for “restoration.”") takes the next one with it, and so
    // does a short one when the two together are short too. Otherwise the first sentence stands alone: a second one
    // cut off mid-word by the three-line clamp helps nobody.
    const bare = ORIGIN_NOTE.test(parts[0] ?? "") && parts[0].length <= 60;
    const lead = parts[1] && (bare || parts[0].length + parts[1].length < 110) ? `${parts[0]} ${parts[1]}` : parts[0];
    const gist = hit ?? lead ?? defPlain;
    return (
      <article
        ref={box}
        className="lx-entry lx-compact"
        data-term={t.id}
        aria-labelledby={`lx-${t.id}`}
        // A tap anywhere on the entry opens it (the button inside is the control for keyboards and screen readers).
        onClick={(e) => {
          if (!(e.target as Element).closest("button, a")) onPick(t.id, true);
        }}
      >
        <h3 className="lx-term serif" id={`lx-${t.id}`}>
          <button type="button" aria-expanded={false} onClick={() => onPick(t.id, true)}>
            <span className="lx-term-t">
              <Highlight text={t.term} q={q} />
            </span>
            <span className="lx-chev" aria-hidden />
          </button>
        </h3>
        <p className="lx-gist">{defHit ? <Highlight text={gist} q={q} /> : gist}</p>
      </article>
    );
  }

  return (
    <article ref={box} className={`lx-entry ${on ? "on" : ""} ${compact ? "lx-full" : ""}`} data-term={t.id} aria-labelledby={`lx-${t.id}`}>
      <h3 className="lx-term serif" id={`lx-${t.id}`}>
        <button type="button" aria-expanded={on} onClick={() => onPick(t.id, true)}>
          {/* one span, so the flex button keeps the spaces around the highlighted part */}
          <span className="lx-term-t">
            <Highlight text={t.term} q={q} />
          </span>
          {compact && <span className="lx-chev" aria-hidden />}
        </button>
      </h3>
      <p className="lx-def">{defHit ? <Highlight text={defPlain} q={q} /> : <DefText text={t.def} onTerm={(id) => onPick(id)} />}</p>
      {n === 0 ? (
        <p className="lx-unused mono">No move uses this term by name.</p>
      ) : on ? (
        <div className="lx-open">
          <FootprintBlock ids={uses} title={`Used in ${n} ${n === 1 ? "move" : "moves"}`} caption="Highlighted on the map" plain />
        </div>
      ) : (
        <div className="lx-used">
          <span className="mono lib-k">Used in</span>
          <NodeChip id={uses[0]} plain />
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

/** Definition text: a term reference jumps to its entry, a thinker opens a peek, a node links to its objection. */
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
