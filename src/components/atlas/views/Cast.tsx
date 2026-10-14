"use client";

/* Library · Cast (#/cast[/<thinker>]).

   Everyone the disputation calls as a witness, in roundels grouped by era and
   filterable by the side they lean toward. Choosing one opens their file:
   life, tradition, why they matter, their key work, every move that cites
   them (grouped by objection), their moments in the timeline, and a mini Rose
   with their footprint lit. Desktop: a sticky file beside the roster. Phone /
   tablet: the file opens in place, under the row of the name you tapped. */

import "./library.css";
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useAtlas } from "../context";
import { initials } from "../peek";
import { Glyph } from "../primitives";
import { formatRoute } from "../router";
import type { Side, Thinker } from "../types";
import { ERAS, FootprintBlock, LibEmpty, LibHead, LibTabs, eraOf, fold, scrollBehavior, useMedia, yearText } from "./Outline";

type TSide = Side | "neutral";
type SideFilter = "all" | TSide;

const LEAN: Record<TSide, string> = {
  skeptic: "Objector-leaning",
  theist: "Respondent-leaning",
  spinoza: "Spinoza",
  neutral: "Context",
};
const FILTERS: TSide[] = ["skeptic", "theist", "spinoza", "neutral"];
const sideOf = (t: Thinker): TSide => (t.side && t.side in LEAN ? t.side : "neutral");

function SideMark({ side, size = 10 }: { side: TSide; size?: number }) {
  if (side === "neutral") {
    return (
      <svg className="glyph-svg ca-neutral" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <rect x={size * 0.15} y={size * 0.15} width={size * 0.7} height={size * 0.7} />
      </svg>
    );
  }
  return <Glyph side={side} size={size} />;
}

/** A plain click (no modifier keys): handle it in place; otherwise let the browser open the link. */
const plainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

export default function Cast({ thinker }: { thinker?: string }) {
  const { d, ix, go } = useAtlas();
  const wide = useMedia("(min-width: 980px)");
  const [side, setSide] = useState<SideFilter>("all");
  const [q, setQ] = useState("");

  const all = useMemo(() => [...d.thinkers].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name)), [d]);
  const counts = useMemo(() => {
    const c: Record<TSide, number> = { skeptic: 0, theist: 0, spinoza: 0, neutral: 0 };
    for (const t of all) c[sideOf(t)]++;
    return c;
  }, [all]);
  const list = useMemo(() => {
    const needle = fold(q.trim());
    return all.filter((t) => (side === "all" || sideOf(t) === side) && (!needle || fold(`${t.name} ${t.tradition} ${t.work ?? ""}`).includes(needle)));
  }, [all, side, q]);
  const groups = useMemo(
    () => ERAS.map((era) => ({ era, items: list.filter((t) => eraOf(t.year).id === era.id) })).filter((g) => g.items.length > 0),
    [list],
  );
  const filtering = side !== "all" || q.trim() !== "";

  const sel = thinker ? ix.thinkers.get(thinker) : undefined;
  const missing = !!thinker && !sel;
  const select = (id: string) => {
    const off = id === thinker && !wide;
    go({ view: "cast", thinker: off ? undefined : id }, { replace: true });
  };
  const rosterRef = useRef<HTMLDivElement>(null);
  const close = useCallback(
    (id: string) => {
      go({ view: "cast" }, { replace: true });
      requestAnimationFrame(() => rosterRef.current?.querySelector<HTMLElement>(`[data-tid="${CSS.escape(id)}"]`)?.focus());
    },
    [go],
  );

  // How many roundels share a row (phone / tablet), so a file opens under the whole row, not mid-row.
  const [cols, setCols] = useState(1);
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
        if (wide) {
          const r = card?.getBoundingClientRect();
          if (card && r && (first || r.top < 60 || r.bottom > window.innerHeight)) card.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
          return;
        }
        const file = rosterRef.current?.querySelector<HTMLElement>(".ca-inline");
        const r = (file ?? card)?.getBoundingClientRect();
        const cr = card?.getBoundingClientRect();
        if (r && (first || r.top > window.innerHeight * 0.55 || (cr && cr.top < 0))) (card ?? file)?.scrollIntoView({ block: "start", behavior: scrollBehavior() });
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
      tabs={false}
      title={
        <>
          The <em>cast</em>
        </>
      }
      dek="Everyone the disputation calls as a witness — for the objector, for the respondent, and the ones who simply set the stage. Choose a name to see every move where they speak."
      meta={all.length ? `${all.length} thinkers · ${yearText(first.year)} to ${yearText(last.year)}` : undefined}
    />
  );

  return (
    <div className="lib lib-cast">
      <LibTabs current="cast" />
      {all.length === 0 ? (
        <>
          {head}
          <LibEmpty current="cast" title="The cast list is still being drawn up." text="Each thinker will appear here with their dates, their tradition, and every move that cites them. Meanwhile the outline has every move." />
        </>
      ) : (
        <div className="ca-layout">
          <div className="ca-roster" ref={rosterRef}>
            {head}
            <div className="ca-tools">
              <label className="lib-search">
                <span className="sr-only">Find a thinker</span>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="lib-search-i">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5" />
                </svg>
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a thinker, tradition or work" autoComplete="off" spellCheck={false} />
              </label>
              <div className="ca-filters" role="group" aria-label="Filter by side">
                <button type="button" className="ca-filter" aria-pressed={side === "all"} onClick={() => setSide("all")}>
                  Everyone <span className="ca-filter-n mono">{all.length}</span>
                </button>
                {FILTERS.filter((s) => counts[s] > 0).map((s) => (
                  <button key={s} type="button" className={`ca-filter s-${s}`} aria-pressed={side === s} onClick={() => setSide(side === s ? "all" : s)}>
                    <SideMark side={s} size={10} />
                    {LEAN[s]}
                    <span className="ca-filter-n mono">{counts[s]}</span>
                  </button>
                ))}
              </div>
              <p className={`lib-count mono ${filtering ? "" : "sr-only"}`} aria-live="polite">
                {filtering ? (list.length ? `Showing ${list.length} of ${all.length} thinkers` : `No thinker matches`) : ""}
              </p>
            </div>

            {missing && <p className="lib-notice">No one in the cast goes by “{thinker}”. Choose a name below.</p>}
            {sel && !wide && !list.includes(sel) && (
              <div className="ca-inline ca-inline-top">
                <ThinkerFile t={sel} onClose={() => close(sel.id)} />
              </div>
            )}

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
                  Clear the filters
                </button>
              </div>
            ) : (
              groups.map(({ era, items }) => {
                // On narrow screens the file goes after the last roundel of the chosen one's row.
                const at = !wide && sel ? items.findIndex((t) => t.id === sel.id) : -1;
                const rowEnd = at < 0 ? -1 : Math.min(items.length - 1, Math.floor(at / cols) * cols + cols - 1);
                return (
                  <section key={era.id} className="ca-era" aria-labelledby={`ca-era-${era.id}`}>
                    <h2 className="ca-era-h" id={`ca-era-${era.id}`}>
                      <span className="serif">{era.name}</span>
                      <span className="mono">{era.span}</span>
                      <span className="ca-era-n mono">
                        {items.length}
                        <span className="sr-only"> {items.length === 1 ? "thinker" : "thinkers"}</span>
                      </span>
                    </h2>
                    <ul className="ca-grid">
                      {items.map((t, i) => (
                        <Fragment key={t.id}>
                          <li className="ca-cell">
                            <Roundel t={t} on={sel?.id === t.id} wide={wide} onPick={() => select(t.id)} />
                          </li>
                          {i === rowEnd && sel && (
                            <li className="ca-inline">
                              <ThinkerFile t={sel} key={sel.id} onClose={() => close(sel.id)} />
                            </li>
                          )}
                        </Fragment>
                      ))}
                    </ul>
                  </section>
                );
              })
            )}
          </div>

          {wide && (
            <aside className="ca-panel" aria-label="Thinker file">
              {sel ? <ThinkerFile t={sel} key={sel.id} /> : <CastIntro onPick={select} />}
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

function Roundel({ t, on, wide, onPick }: { t: Thinker; on: boolean; wide: boolean; onPick: () => void }) {
  const { ix } = useAtlas();
  const n = ix.thinkerRefs.get(t.id)?.length ?? 0;
  const s = sideOf(t);
  return (
    <a
      href={formatRoute({ view: "cast", thinker: t.id })}
      data-tid={t.id}
      className={`ca-card s-${s} ${on ? "on" : ""}`}
      onClick={(e) => {
        if (!plainClick(e)) return;
        e.preventDefault();
        onPick();
      }}
      aria-current={wide && on ? "true" : undefined}
      aria-expanded={wide ? undefined : on}
    >
      <span className="monogram ca-mono" aria-hidden>
        {initials(t.name)}
        <span className="ca-badge">
          <SideMark side={s} size={8} />
        </span>
      </span>
      <span className="ca-txt">
        <span className="ca-name serif">{t.name}</span>
        <span className="ca-life mono">
          {t.life}
          <span className="sr-only"> · {LEAN[s]}</span>
          {n > 0 && <span className="ca-n">{` · ${n} ${n === 1 ? "move" : "moves"}`}</span>}
        </span>
        {t.tradition && <span className="ca-trad">{t.tradition}</span>}
      </span>
    </a>
  );
}

function ThinkerFile({ t, onClose }: { t: Thinker; onClose?: () => void }) {
  const { d, ix } = useAtlas();
  const refs = useMemo(() => ix.thinkerRefs.get(t.id) ?? [], [ix, t.id]);
  const moments = useMemo(() => [...d.moments].filter((m) => m.thinker === t.id).sort((a, b) => a.year - b.year), [d, t.id]);
  const s = sideOf(t);
  return (
    <article className={`ca-file s-${s}`} aria-labelledby={`ca-file-${t.id}`}>
      {onClose && (
        <button type="button" className="ca-close" onClick={onClose} aria-label={`Close ${t.name}`}>
          ×
        </button>
      )}
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
            <span className={`ca-file-lean s-${s}`}>
              <SideMark side={s} size={9} />
              {LEAN[s]}
            </span>
          </p>
        </div>
      </header>
      {t.tradition && <p className="ca-file-trad">{t.tradition}</p>}
      {t.line && <p className="ca-file-line serif">{t.line}</p>}
      {t.work && (
        <p className="ca-file-work">
          <span className="mono lib-k">Key work</span>
          <span className="ca-file-work-t">{t.work}</span>
        </p>
      )}

      <div className="ca-file-sec">
        {refs.length > 0 ? (
          <FootprintBlock ids={refs} title={`Speaks in ${refs.length} ${refs.length === 1 ? "move" : "moves"}`} caption="Lit: where they speak" limit={16} />
        ) : (
          <>
            <p className="mono lib-k">Not yet cited by a move</p>
            <p className="ca-file-none">They set the scene rather than argue a move{moments.length ? " — see their moments below." : "."}</p>
          </>
        )}
      </div>

      {moments.length > 0 && (
        <div className="ca-file-sec">
          <p className="mono lib-k">In the timeline</p>
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
    </article>
  );
}

/** What the desktop panel shows before anyone is chosen: the sides, and a few good first picks. */
function CastIntro({ onPick }: { onPick: (id: string) => void }) {
  const { d, ix } = useAtlas();
  const picks = useMemo(
    () =>
      [...d.thinkers]
        .map((t) => ({ t, n: ix.thinkerRefs.get(t.id)?.length ?? 0 }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n || a.t.year - b.t.year)
        .slice(0, 5),
    [d, ix],
  );
  return (
    <div className="ca-intro">
      <p className="mono lib-k">How to read the roster</p>
      <ul className="ca-legend">
        {FILTERS.map((s) => (
          <li key={s} className={`s-${s}`}>
            <span className="monogram ca-legend-mono" aria-hidden>
              <SideMark side={s} size={9} />
            </span>
            <span>
              <strong>{LEAN[s]}</strong>
              <span className="ca-legend-d">
                {s === "skeptic"
                  ? "Their work arms the objector."
                  : s === "theist"
                    ? "Their work arms the respondent."
                    : s === "spinoza"
                      ? "The hinge: God as Nature."
                      : "They set the stage; neither side owns them."}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {picks.length > 0 && (
        <>
          <p className="mono lib-k ca-picks-k">Most present in the argument</p>
          <ul className="ca-picks">
            {picks.map(({ t, n }) => (
              <li key={t.id}>
                <a
                  className={`ca-pick s-${sideOf(t)}`}
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
