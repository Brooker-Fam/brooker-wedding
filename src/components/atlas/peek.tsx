"use client";

/* "Peek": small floating cards for glossary terms and people.
   Anchored to the clicked element on wide screens; a bottom sheet on phones.
   One peek at a time; Escape, outside click, or scrolling the page closes it.
   The sheet/card choice is made on the first render (a peek only ever mounts
   after a click, so there is no server render to match): deciding it later
   left the phone sheet stuck at the card's starting opacity of 0, invisible
   but still taking taps. */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAtlas } from "./context";
import { Rich } from "./markup";

type PeekTarget = { kind: "term" | "thinker"; id: string; rect: DOMRect };

const PeekCtx = createContext<(t: PeekTarget | null) => void>(() => {});

export function usePeek() {
  return useContext(PeekCtx);
}

/* Where a person turns up in the argument. This is about who cites them, which is
   not always what they believe: several Christians are cited by the Objector. */
const SIDE_WORD: Record<string, string> = {
  skeptic: "Cited by the Objector",
  theist: "Cited by the Defender",
  spinoza: "On Spinoza’s side",
  neutral: "Background",
};

const SHEET_MAX = 640;

export function PeekProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<PeekTarget | null>(null);
  const open = useCallback((t: PeekTarget | null) => setTarget(t), []);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTarget(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target]);

  return (
    <PeekCtx.Provider value={open}>
      {children}
      <AnimatePresence>{target && <PeekCard key={`${target.kind}:${target.id}`} target={target} onClose={() => setTarget(null)} />}</AnimatePresence>
    </PeekCtx.Provider>
  );
}

function PeekCard({ target, onClose }: { target: PeekTarget; onClose: () => void }) {
  const { ix, go, thinkerName, termName, openNode } = useAtlas();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [sheet] = useState(() => typeof window !== "undefined" && window.innerWidth < SHEET_MAX);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (sheet) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = 340;
    const h = ref.current?.offsetHeight ?? 220;
    const r = target.rect;
    let left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), vw - w - 12);
    let top = r.bottom + 10;
    if (top + h > vh - 12) top = Math.max(12, r.top - h - 10);
    if (!Number.isFinite(left)) left = 12;
    setPos({ left, top });
  }, [target, sheet]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onScroll = () => onClose();
    const t = setTimeout(() => {
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    }, 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [onClose]);

  const body = useMemo(() => {
    if (target.kind === "term") {
      const t = ix.terms.get(target.id);
      const uses = ix.termRefs.get(target.id) ?? [];
      return (
        <>
          <p className="eyebrow">Glossary</p>
          <h4 className="peek-title serif">{t?.term ?? termName(target.id)}</h4>
          <p className="peek-text">{t ? <Rich text={t.def} r={{ thinkerName, termName }} /> : "No definition yet."}</p>
          <div className="peek-actions">
            <button className="btn small" onClick={() => { onClose(); go({ view: "lexicon", term: target.id }); }}>
              Open in glossary
            </button>
            {uses.length > 0 && (
              <button className="btn small ghost" onClick={() => { onClose(); openNode(uses[0]); }}>
                Used in {uses.length} {uses.length === 1 ? "move" : "moves"} <span aria-hidden>→</span>
              </button>
            )}
          </div>
        </>
      );
    }
    const th = ix.thinkers.get(target.id);
    const refs = ix.thinkerRefs.get(target.id) ?? [];
    const quote = th?.quote?.text?.trim() ? th.quote : undefined;
    // "Spinoza" on a quote from Baruch Spinoza adds nothing; name the speaker only when it's someone else.
    const quoteWho = quote?.who && th && !samePerson(quote.who, th.name) ? quote.who : "";
    // Spinoza needs no "on Spinoza's side".
    const sideWord = th?.side && !(th.side === "spinoza" && th.id === "spinoza") ? SIDE_WORD[th.side] : "";
    return (
      <>
        <div className={`peek-who s-${th?.side ?? "neutral"}`}>
          <span className="monogram big">{initials(th?.name ?? target.id)}</span>
          <div>
            <h4 className="peek-title serif">{th?.name ?? thinkerName(target.id)}</h4>
            <p className="peek-meta mono">
              {th?.life}
              {th?.life && sideWord ? " · " : ""}
              {sideWord}
            </p>
          </div>
        </div>
        {th?.tradition && <p className="peek-trad">{th.tradition}</p>}
        {th?.line && <p className="peek-text">{th.line}</p>}
        {th?.work && <p className="peek-work mono">{th.work}</p>}
        {quote && (
          <figure className={`peek-quote s-${th?.side ?? "neutral"}`}>
            <blockquote className="serif">
              <p>“{quote.text}”</p>
            </blockquote>
            {(quote.cite || quoteWho) && (
              <figcaption className="mono">
                {[quoteWho, quote.cite].filter(Boolean).join(" · ")}
              </figcaption>
            )}
          </figure>
        )}
        <div className="peek-actions">
          <button className="btn small" onClick={() => { onClose(); go({ view: "cast", thinker: target.id }); }}>
            See profile
          </button>
          {refs.length > 0 && (
            <button className="btn small ghost" onClick={() => { onClose(); openNode(refs[0]); }}>
              Named in {refs.length} {refs.length === 1 ? "move" : "moves"} <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </>
    );
  }, [target, ix, go, onClose, openNode, thinkerName, termName]);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label={target.kind === "term" ? "Glossary entry" : "About this person"}
      className={`peek${sheet ? " peek-sheet" : ""}`}
      style={pos && !sheet ? { left: pos.left, top: pos.top } : undefined}
      initial={reduce ? { opacity: 0 } : sheet ? { opacity: 1, y: "100%" } : { opacity: 0, y: 6, scale: 0.98 }}
      animate={reduce ? { opacity: 1 } : sheet ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : sheet ? { opacity: 1, y: "100%" } : { opacity: 0, y: 4, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      {sheet && <div className="sheet-grip" aria-hidden />}
      <button className="peek-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      {body}
    </motion.div>
  );
}

function samePerson(who: string, name: string) {
  const last = (x: string) => x.replace(/\(.*?\)/g, "").trim().split(/\s+/).pop()?.toLowerCase() ?? "";
  return last(who) === last(name);
}

export function initials(name: string) {
  const parts = name
    .replace(/\(.*?\)/g, "")
    .replace(/^(St\.|Saint)\s+/i, "")
    .split(/\s+/)
    .filter((p) => p && /^[A-ZÀ-Ý]/.test(p) && !/^(of|de|van|von|al-|the)$/i.test(p));
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
