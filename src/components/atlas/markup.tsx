/* Inline markup used throughout disputation content:
     *italic*
     [[term-id]]      or [[term-id|shown text]]      → lexicon term
     {{thinker-id}}   or {{thinker-id|shown text}}   → thinker
     ((node-id|shown text))                          → another argument node
   `parseMarkup` turns a string into tokens; `Rich` renders them with
   caller-supplied renderers so each view can decide what a term/thinker/node
   reference does (popover, jump, plain text). */

import { Fragment, memo, useMemo, type ReactNode } from "react";

export type Token =
  | { t: "text"; v: string }
  | { t: "em"; v: string }
  | { t: "term"; id: string; v?: string }
  | { t: "thinker"; id: string; v?: string }
  | { t: "node"; id: string; v?: string };

const RE = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]|\{\{([a-z0-9-]+)(?:\|([^}]+))?\}\}|\(\(([a-z0-9-]+)(?:\|([^)]+))?\)\)|\*([^*\n]+)\*/g;

export function parseMarkup(src: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of src.matchAll(RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: "text", v: src.slice(last, i) });
    if (m[1]) out.push({ t: "term", id: m[1], v: m[2] });
    else if (m[3]) out.push({ t: "thinker", id: m[3], v: m[4] });
    else if (m[5]) out.push({ t: "node", id: m[5], v: m[6] });
    else if (m[7]) out.push({ t: "em", v: m[7] });
    last = i + m[0].length;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out;
}

/** Plain text with markup stripped (for aria labels, search, truncation). */
export function plain(src: string, names?: { thinker?: (id: string) => string | undefined; term?: (id: string) => string | undefined }): string {
  return parseMarkup(src)
    .map((tok) => {
      switch (tok.t) {
        case "text":
        case "em":
          return tok.v;
        case "term":
          return tok.v ?? names?.term?.(tok.id) ?? tok.id.replace(/-/g, " ");
        case "thinker":
          return tok.v ?? names?.thinker?.(tok.id) ?? tok.id;
        case "node":
          return tok.v ?? "";
      }
    })
    .join("");
}

export interface RichRenderers {
  term?: (id: string, text: string, key: number) => ReactNode;
  thinker?: (id: string, text: string, key: number) => ReactNode;
  node?: (id: string, text: string, key: number) => ReactNode;
  /** Fallback display names when a token has no explicit text. */
  termName?: (id: string) => string | undefined;
  thinkerName?: (id: string) => string | undefined;
  nodeName?: (id: string) => string | undefined;
}

const NO_RENDERERS: RichRenderers = {};

/** Memoized: re-renders (and re-parses) only when its text or renderers change, so callers
    that re-render often should pass a stable `r` (see RichText). */
export const Rich = memo(function Rich({ text, r = NO_RENDERERS }: { text: string; r?: RichRenderers }) {
  const toks = useMemo(() => parseMarkup(text), [text]);
  return (
    <>
      {toks.map((tok, k) => {
        switch (tok.t) {
          case "text":
            return <Fragment key={k}>{tok.v}</Fragment>;
          case "em":
            return <em key={k}>{tok.v}</em>;
          case "term": {
            const shown = tok.v ?? r.termName?.(tok.id) ?? tok.id.replace(/-/g, " ");
            return r.term ? <Fragment key={k}>{r.term(tok.id, shown, k)}</Fragment> : <Fragment key={k}>{shown}</Fragment>;
          }
          case "thinker": {
            const shown = tok.v ?? r.thinkerName?.(tok.id) ?? tok.id;
            return r.thinker ? <Fragment key={k}>{r.thinker(tok.id, shown, k)}</Fragment> : <Fragment key={k}>{shown}</Fragment>;
          }
          case "node": {
            const shown = tok.v ?? r.nodeName?.(tok.id) ?? "";
            return r.node ? <Fragment key={k}>{r.node(tok.id, shown, k)}</Fragment> : <Fragment key={k}>{shown}</Fragment>;
          }
        }
      })}
    </>
  );
});
