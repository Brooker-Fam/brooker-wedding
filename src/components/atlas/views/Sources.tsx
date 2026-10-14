"use client";

/* Library · Sources (#/sources).

   Every work cited anywhere (by a move, an objection's reading list, a
   person's file or a moment on the timeline), listed once. Entries are keyed
   by author and title (an encyclopedia article or a review by publisher and
   title), so "Pensées" cited from four moves is one entry with four chips.
   One text cited under two titles or bylines is folded into one entry when
   the citations share a link or one title contains the other. Where moves cite different places in one work ("Summa
   Theologiae I q.2 a.3", "… I q.105 a.6"), the work is one entry and each
   place gets its own row, with its own link and the moves that cite it.

   Two groupings: by kind (classic texts, modern books and articles,
   encyclopedia entries) or by objection. A search box and an "only with a
   link" switch narrow the list.

   This file also exports SourceList, the plain list of works that a move, a
   person's file and a timeline card show. */

import "./library.css";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAtlas } from "../context";
import { initials } from "../peek";
import { formatRoute } from "../router";
import type { DisputationIndex } from "../semantics";
import type { Disputation, ObjectionId, Source } from "../types";
import { LibEmpty, LibHead, NodeChip, fold, yearText } from "./Outline";
import { hostOf } from "./OutlineList";

/* ======================================================================
   The shared list (a move's Sources, a person's and a moment's Read more)
   ====================================================================== */

/** A title that opens its link in a new tab, or plain text when there's no link. */
function TitleLink({ title, url, className }: { title: ReactNode; url?: string; className: string }) {
  if (!url) return <cite className={className}>{title}</cite>;
  return (
    <a className={className} href={url} target="_blank" rel="noopener noreferrer">
      <cite>{title}</cite>
      <span className="rf-arrow" aria-hidden>
        {" "}
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Author · year · the site the link goes to. */
function ByLine({ by, year, url, className = "rf-by" }: { by?: string; year?: string; url?: string; className?: string }) {
  const host = url ? hostOf(url) : "";
  const bits = [by, year].filter(Boolean).join(" · ");
  if (!bits && !host) return null;
  return (
    <span className={`${className} mono`}>
      {bits}
      {host && (
        <span className="rf-host">
          {bits ? " · " : ""}
          {host}
        </span>
      )}
    </span>
  );
}

/** Works as a tidy list: title (linked when there's a link), author and year, and the note. */
export function SourceList({ sources, className = "" }: { sources?: Source[]; className?: string }) {
  const list = (sources ?? []).filter((s) => s.title);
  if (list.length === 0) return null;
  return (
    <ul className={`rf-list ${className}`}>
      {list.map((s, i) => (
        <li key={`${s.title}-${i}`} className="rf-item">
          <TitleLink title={s.title} url={s.url} className="rf-title" />
          <ByLine by={s.by} year={s.year} url={s.url} />
          {s.note && <span className="rf-note">{s.note}</span>}
        </li>
      ))}
    </ul>
  );
}

/* ======================================================================
   Building the bibliography
   ====================================================================== */

type Citer = { kind: "move"; id: string; o: ObjectionId } | { kind: "reading"; o: ObjectionId } | { kind: "person"; id: string } | { kind: "moment"; id: string };

/** One citation: who cites the work, and the note they give with it. */
interface Cite {
  c: Citer;
  note?: string;
}

/** One cited place in a work (a chapter, a question), or the work as a whole when `locKey` is empty. */
interface Part {
  /** The place, as shown: "Sect. X, “Of Miracles”". */
  loc: string;
  locKey: string;
  /** The title as most citations give it, for a work cited at this one place only. */
  full: string;
  url?: string;
  /** Who this place's citations credit, when it isn't what the work's byline says: "trans. Vernon J. Bourke". */
  credit?: string;
  /** What the work or place is: the reading list's note, or the one note its citations share. */
  about?: string;
  cites: Cite[];
}

type Kind = "old" | "modern" | "ref";

interface Work {
  key: string;
  title: string;
  by: string;
  year?: string;
  /** For sorting by date: the year given, or else the author's own dates. */
  sortYear?: number;
  /** The whole work's citations first (locKey ""), then each place cited, in order. */
  parts: Part[];
  kind: Kind;
  surname: string;
  linked: boolean;
  objections: Set<ObjectionId>;
  search: string;
}

/* Where a title names a place inside a work: "Ethics, pt. II", "Pensées, §233", "Summa Theologiae I q.2 a.3". */
const LOC_RE = /^(.+?),\s+((?:(?:ch|chs|sect|sects|pt|pts|bk|bks|vol|vols|no|nos|art|q|qq)\.|§|(?:part|parts|book|books|chapter|chapters|section|sections|letter|letters|question|questions|article|preface|introduction|appendix)\b).*)$/i;
const SUMMA_RE = /^(Summa (?:Theologiae|Theologica|contra Gentiles))[,:]?\s+(.+)$/i;

function splitTitle(title: string): { work: string; loc: string } {
  const t = title.trim();
  const s = t.match(SUMMA_RE);
  if (s) return { work: s[1], loc: s[2] };
  const m = t.match(LOC_RE);
  return m ? { work: m[1].trim(), loc: m[2].trim() } : { work: t, loc: "" };
}

/** Lower-case letters and digits only: "Pensées, §233" → "pensees 233". */
const words = (s: string) =>
  fold(s)
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
/** Without any parenthetical. */
const norm = (s: string) => words(s.replace(/\([^)]*\)/g, " "));
/** A parenthetical that says where or in what version a work appears, not which work it is: "(Stanford Encyclopedia of Philosophy)", "(KJV)". */
const ASIDE_RE = /encyclop|version|kjv|review/i;
const dropAsides = (s: string) =>
  s
    .replace(/\s*\(([^)]*)\)/g, (m, inner: string) => (ASIDE_RE.test(inner) ? "" : m))
    .trim();
/** Title for matching: no leading article, no punctuation, no aside. Other parentheticals count:
    "The Design Argument (Cambridge Elements)" is a different work from "The Design Argument". */
const titleKey = (s: string) => words(dropAsides(s)).replace(/^(the|a|an) /, "");
/** The main title, before a subtitle: "Where the Conflict Really Lies: Science, …" → "where the conflict really lies";
    "The Analogy of Religion, Natural and Revealed" → "analogy of religion" (after a comma only when that leaves three words or more). */
function mainTitleKey(s: string): string {
  const colon = titleKey(s.split(/[:?]\s/)[0]);
  if (colon !== titleKey(s)) return colon;
  const comma = titleKey(s.split(/,\s/)[0]);
  return comma.split(" ").length >= 3 ? comma : colon;
}
/** A quoted title after a place: "sect. X, “Of Miracles”", "I q.2, 'The Existence of God'". */
const QUOTED_TAIL = /(?:,\s*|\s+)[“"‘'].*$/;
const ABBR: [RegExp, string][] = [
  [/\b(?:bks?|books?)\b/g, "book"],
  [/\b(?:chs?|chapters?)\b/g, "chapter"],
  [/\b(?:pts?|parts?)\b/g, "part"],
  [/\b(?:sects?|sections?)\b/g, "section"],
  [/\b(?:vols?|volumes?)\b/g, "vol"],
];
const expand = (s: string) => ABBR.reduce((t, [re, w]) => t.replace(re, w), s);
/** A place for matching: "Bk. XXI" and "Book XXI" are one place, as are "I q.19 (The Will of God)" and "I q.19, 'The Will of God'". */
const locKey = (s: string) => expand(norm(s.replace(QUOTED_TAIL, ""))) || expand(norm(s));
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ROMAN_RE = /^(?=[ivxlc])c{0,3}(?:xc|xl|l?x{0,3})(?:ix|iv|v?i{0,3})$/;
function romanValue(t: string): number {
  const v: Record<string, number> = { i: 1, v: 5, x: 10, l: 50, c: 100 };
  let n = 0;
  for (let i = 0; i < t.length; i++) n += v[t[i]] < (v[t[i + 1]] ?? 0) ? -v[t[i]] : v[t[i]];
  return n;
}
const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
/** The order places are listed in: numbers (Roman numerals and "First" too) by value, words after numbers, a preface first.
    "First Part" < "I q.2" < "I q.19" < "I-II q.26" < "II-II q.2" < "Supplement q.94"; "Pt. I" < "Parts IV–V". */
function placeOrder(loc: string): string {
  const s = expand(fold(loc.replace(QUOTED_TAIL, "").replace(/\([^)]*\)/g, " ")));
  const pad = (n: number) => String(n).padStart(4, "0");
  const token = (p: string) =>
    /^\d+$/.test(p)
      ? pad(Number(p))
      : ROMAN_RE.test(p)
        ? pad(romanValue(p))
        : ORDINALS.includes(p)
          ? pad(ORDINALS.indexOf(p) + 1)
          : /^(preface|introduction|prologue|foreword)$/.test(p)
            ? `!${p}`
            : `~${p}`;
  return (s.match(/[a-z0-9]+(?:-[a-z0-9]+)*/g) ?? []).map((t) => t.split("-").map(token).join(".")).join(" ");
}

/** The first author's surname, for matching and sorting: "Baruch Spinoza (trans. R. H. M. Elwes)" → "spinoza". */
function surnameOf(by: string): string {
  const first = by
    .replace(/\([^)]*\)/g, " ")
    .replace(/\bet al\.?/gi, " ")
    .replace(/^\s*(?:trans\.|tr\.|ed\.|eds\.)\s+/i, "")
    .split(",")[0]
    .split(/\s+(?:and|&|with)\s+/)[0]
    .trim();
  const ws = first.split(/\s+/).filter((w) => w && !/^(jr|sr)\.?$/i.test(w));
  // "Leo XIII" → "leo", "Justinian I" → "justinian".
  if (ws.length > 1 && /^[IVXLC]+$/.test(ws[ws.length - 1])) ws.pop();
  return fold(ws[ws.length - 1] ?? first).replace(/[^a-z0-9-]/g, "");
}

/** What a byline adds to its author, for comparing: "Thomas Aquinas (trans. Vernon J. Bourke)" → "trans vernon j bourke". */
function creditOf(by: string): { show: string; key: string } {
  const inParens = [...by.matchAll(/\(([^)]*)\)/g)].map((m) => m[1].trim());
  const after = by
    .replace(/\([^)]*\)/g, " ")
    .split(",")
    .slice(1)
    .map((x) => x.trim())
    .filter((x) => x && !/^(jr|sr)\.?$/i.test(x));
  const show = [...inParens, ...after].join(", ");
  return { show, key: words(show.replace(/\btr\./gi, "trans.")) };
}

/** A year for sorting: "c. 405" → 405, "2004 (2nd ed.)" → 2004, "c. 399 BCE" → -399. */
function yearNum(y?: string): number | undefined {
  if (!y) return undefined;
  const m = y.match(/\d{2,4}/);
  if (!m) return undefined;
  const n = Number(m[0]);
  return /BCE|\bBC\b/.test(y) ? -n : n;
}

/** The commonest of some strings; a tie goes to the shortest (or the longest). */
function commonest(xs: string[], tie: "short" | "long" = "short"): string {
  const n = new Map<string, number>();
  for (const x of xs) n.set(x, (n.get(x) ?? 0) + 1);
  let best = "";
  let most = 0;
  for (const [x, c] of n) if (c > most || (c === most && (tie === "short" ? x.length < best.length : x.length > best.length))) [best, most] = [x, c];
  return best;
}
const longest = (xs: string[]) => xs.reduce((m, x) => (x.length > m.length ? x : m), "");
/** The byline most citations agree on, counting "Baruch Spinoza (trans. R. H. M. Elwes)" and "Benedict de Spinoza,
    trans. R. H. M. Elwes" as one. A tie goes to the shorter byline, so one place's translator isn't applied to the whole work. */
function usualBy(bys: string[]): string {
  const groups = new Map<string, string[]>();
  for (const b of bys) {
    const k = `${surnameOf(b)}|${creditOf(b).key}`;
    groups.set(k, [...(groups.get(k) ?? []), b]);
  }
  let size = 0;
  let best = "";
  for (const g of groups.values()) {
    const show = commonest(g, "long");
    if (g.length > size || (g.length === size && show.length < best.length)) [size, best] = [g.length, show];
  }
  return best;
}

/* Reference works are keyed by publisher, not by author: an encyclopedia article is cited as
   "Stanford Encyclopedia of Philosophy (Steven Nadler)" in one place and "Steven Nadler" in another. */
interface Publisher {
  id: string;
  name: string;
  host: RegExp;
  /** Matched against the byline (and the title, where `inTitle`). */
  re: RegExp;
  inTitle: boolean;
  /** How the byline reads: "Stanford Encyclopedia of Philosophy (Steven Nadler)" or "Charity Anderson (Notre Dame Philosophical Reviews)". */
  nameFirst: boolean;
}
const PUBLISHERS: Publisher[] = [
  { id: "sep", name: "Stanford Encyclopedia of Philosophy", host: /(^|\.)plato\.stanford\.edu$/, re: /stanford encyclopedia of philosophy/i, inTitle: true, nameFirst: true },
  { id: "iep", name: "Internet Encyclopedia of Philosophy", host: /(^|\.)iep\.utm\.edu$/, re: /internet encyclopedia of philosophy/i, inTitle: true, nameFirst: true },
  { id: "ndpr", name: "Notre Dame Philosophical Reviews", host: /(^|\.)ndpr\.nd\.edu$/, re: /notre dame philosophical reviews/i, inTitle: false, nameFirst: false },
];
function publisherOf(s: Source): Publisher | undefined {
  const host = s.url ? hostOf(s.url) : "";
  return PUBLISHERS.find((p) => p.host.test(host) || p.re.test(p.inTitle ? `${s.by ?? ""} ${s.title}` : (s.by ?? "")));
}
/** The authors in a reference work's byline: "Stanford Encyclopedia of Philosophy (Steven Nadler)" → "Steven Nadler". */
function refAuthors(by: string, p: Publisher): string {
  return by
    .replace(p.re, " ")
    .replace(/\(\s*\)/g, " ")
    .trim()
    .replace(/^\((.*)\)$/, "$1")
    .replace(/^[\s,;:·–—-]+|[\s,;:·–—-]+$/g, "")
    .trim();
}

/** One link per text: no scheme, "www." or #fragment, and every Gutenberg address for a book as one. */
function urlKey(u: string): string {
  const g = u.match(/gutenberg\.org\/(?:ebooks|cache\/epub|files)\/(\d+)/);
  if (g) return `gutenberg:${g[1]}`;
  return u
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/#.*$/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

const REF_RE = /encyclop|dictionary of philosophy/i;
const REF_HOSTS = /(^|\.)plato\.stanford\.edu$|(^|\.)iep\.utm\.edu$/;
const OLD_HOSTS = /(^|\.)(gutenberg\.org|newadvent\.org|ccel\.org|sacred-texts\.com|perseus\.tufts\.edu|wikisource\.org|oll\.libertyfund\.org)$/;

function citerKey(c: Citer): string {
  return c.kind === "move" ? `m:${c.id}` : c.kind === "reading" ? `r:${c.o}` : c.kind === "person" ? `p:${c.id}` : `t:${c.id}`;
}

type PartAcc = { locs: string[]; fulls: string[]; bys: string[]; locKey: string; url?: string; cites: Cite[] };
type WorkAcc = {
  key: string;
  /** The author's surname, or the publisher of a reference work ("sep"). */
  surname: string;
  pub?: Publisher;
  titleKey: string;
  mainKey: string;
  hasSub: boolean;
  titles: string[];
  bys: string[];
  years: string[];
  parts: Map<string, PartAcc>;
};

function addCite(p: PartAcc, cite: Cite) {
  const k = citerKey(cite.c);
  const had = p.cites.find((x) => citerKey(x.c) === k);
  if (!had) p.cites.push(cite);
  else if (!had.note && cite.note) had.note = cite.note;
}

/** Fold work b into work a. */
function absorb(a: WorkAcc, b: WorkAcc) {
  a.titles.push(...b.titles);
  a.bys.push(...b.bys);
  a.years.push(...b.years);
  a.pub ??= b.pub;
  for (const [lk, p] of b.parts) {
    const q = a.parts.get(lk);
    if (!q) a.parts.set(lk, p);
    else {
      q.locs.push(...p.locs);
      q.fulls.push(...p.fulls);
      q.bys.push(...p.bys);
      q.url ??= p.url;
      for (const cite of p.cites) addCite(q, cite);
    }
  }
}

/** The numbers in a work's titles: "1 Corinthians 13" and "1 Corinthians 15" are different texts even on one page. */
const numbersIn = (a: WorkAcc) => new Set(a.titles.flatMap((t) => titleKey(t).match(/\d+/g) ?? []));
const nested = (x: Set<string>, y: Set<string>) => [...x].every((n) => y.has(n)) || [...y].every((n) => x.has(n));
/** Both have years and no year in common: "The Design Argument" (2003) and "The Design Argument (Cambridge Elements)" (2019). */
function yearsClash(a: WorkAcc, b: WorkAcc): boolean {
  const ya = new Set(a.years.map(yearNum).filter((n) => n !== undefined));
  const yb = new Set(b.years.map(yearNum).filter((n) => n !== undefined));
  return ya.size > 0 && yb.size > 0 && ![...ya].some((n) => yb.has(n));
}

/** One work cited under different titles or bylines becomes one entry. Two works are one when:
    - they have the same title and share a link ("The Book of Mormon", credited two ways);
    - they're by the same author and cite the same place at the same link, and no number in their titles
      disagrees ("Enchiridion" and "Enchiridion on Faith, Hope and Love"; "Commentary on John, Book X" and
      "Commentary on the Gospel of John, Book X");
    - they're by the same author, one title is the other with or without its parenthetical, or is the parenthetical
      itself, and their years agree ("Lumen Gentium (Dogmatic Constitution on the Church)"; "Über den Beweis des
      Geistes und der Kraft (On the Proof of the Spirit and of Power)"; but not Sober's "The Design Argument" of 2003
      and "The Design Argument (Cambridge Elements)" of 2019). */
function mergeSameWorks(accs: Map<string, WorkAcc>) {
  const list = [...accs.values()];
  const up = new Map<WorkAcc, WorkAcc>(list.map((a) => [a, a]));
  const find = (a: WorkAcc): WorkAcc => {
    let r = a;
    while (up.get(r) !== r) r = up.get(r)!;
    up.set(a, r);
    return r;
  };
  const join = (a: WorkAcc, b: WorkAcc) => {
    const [ra, rb] = [find(a), find(b)];
    if (ra !== rb) up.set(rb, ra);
  };
  const urlsOf = (a: WorkAcc) => [...a.parts.values()].flatMap((p) => (p.url ? [{ lk: p.locKey, u: urlKey(p.url) }] : []));

  const byTitle = new Map<string, WorkAcc[]>();
  const byPlace = new Map<string, WorkAcc[]>();
  const byAuthorTitle = new Map<string, WorkAcc>();
  for (const a of list) {
    byTitle.set(a.titleKey, [...(byTitle.get(a.titleKey) ?? []), a]);
    for (const { lk, u } of urlsOf(a)) {
      const k = `${a.surname}|${lk}|${u}`;
      const at = byPlace.get(k) ?? [];
      if (!at.includes(a)) byPlace.set(k, [...at, a]);
    }
    byAuthorTitle.set(`${a.surname}|${a.titleKey}`, a);
  }
  for (const same of byTitle.values()) {
    for (let i = 0; i < same.length; i++)
      for (let j = i + 1; j < same.length; j++) {
        const ui = new Set(urlsOf(same[i]).map((x) => x.u));
        if (urlsOf(same[j]).some((x) => ui.has(x.u))) join(same[i], same[j]);
      }
  }
  for (const same of byPlace.values()) {
    for (let i = 1; i < same.length; i++) if (nested(numbersIn(same[0]), numbersIn(same[i]))) join(same[0], same[i]);
  }
  for (const a of list) {
    for (const t of a.titles) {
      const asides = [...t.matchAll(/\(([^)]*)\)/g)].map((m) => m[1]).filter((x) => !ASIDE_RE.test(x));
      if (asides.length === 0) continue;
      for (const alias of [t.replace(/\s*\([^)]*\)/g, ""), ...asides]) {
        const b = byAuthorTitle.get(`${a.surname}|${titleKey(alias)}`);
        if (b && b !== a && !yearsClash(a, b)) join(a, b);
      }
    }
  }
  for (const a of list) {
    const r = find(a);
    if (r === a) continue;
    absorb(r, a);
    accs.delete(a.key);
  }
}

function buildWorks(d: Disputation, ix: DisputationIndex): { works: Work[]; citations: number } {
  // Every citation, in reading order: each objection's moves, then its reading list; then people; then the timeline.
  const raw: { s: Source; c: Citer }[] = [];
  for (const o of d.objections) {
    for (const id of ix.byObjection.get(o.id) ?? []) for (const s of ix.nodes.get(id)?.node.sources ?? []) raw.push({ s, c: { kind: "move", id, o: o.id } });
    for (const s of o.reading ?? []) raw.push({ s, c: { kind: "reading", o: o.id } });
  }
  for (const t of d.thinkers) for (const s of t.sources ?? []) raw.push({ s, c: { kind: "person", id: t.id } });
  for (const m of [...d.moments].sort((a, b) => a.year - b.year)) for (const s of m.sources ?? []) raw.push({ s, c: { kind: "moment", id: m.id } });

  const accs = new Map<string, WorkAcc>();
  let citations = 0;
  for (const { s, c } of raw) {
    if (!s.title?.trim()) continue;
    citations++;
    const { work, loc } = splitTitle(s.title);
    const pub = publisherOf(s);
    const surname = pub?.id ?? surnameOf(s.by ?? "");
    const tk = titleKey(work);
    const key = `${surname}|${tk}`;
    let a = accs.get(key);
    if (!a) {
      a = { key, surname, pub, titleKey: tk, mainKey: `${surname}|${mainTitleKey(work)}`, hasSub: mainTitleKey(work) !== tk, titles: [], bys: [], years: [], parts: new Map() };
      accs.set(key, a);
    }
    a.titles.push(work);
    if (s.by) a.bys.push(s.by);
    if (s.year) a.years.push(s.year);
    const lk = loc ? locKey(loc) : "";
    let p = a.parts.get(lk);
    if (!p) {
      p = { locs: [], fulls: [], bys: [], locKey: lk, cites: [] };
      a.parts.set(lk, p);
    }
    if (loc) p.locs.push(loc);
    p.fulls.push(s.title.trim());
    if (s.by) p.bys.push(s.by);
    if (s.url && !p.url) p.url = s.url;
    addCite(p, { c, note: s.note?.trim() || undefined });
  }

  // A bare title joins the one work by the same author whose main title it is ("That All Shall Be Saved" → "…: Heaven, Hell, …").
  const byMain = new Map<string, WorkAcc[]>();
  for (const a of accs.values()) if (a.hasSub) byMain.set(a.mainKey, [...(byMain.get(a.mainKey) ?? []), a]);
  for (const a of [...accs.values()]) {
    if (a.hasSub) continue;
    const into = byMain.get(a.mainKey);
    if (!into || into.length !== 1 || into[0] === a) continue;
    absorb(into[0], a);
    accs.delete(a.key);
  }
  mergeSameWorks(accs);

  // An author's own dates, by surname ("Augustine of Hippo" is found as "augustine" too).
  const thinkerYear = new Map<string, number>();
  for (const t of d.thinkers) {
    thinkerYear.set(surnameOf(t.name), t.year);
    const before = t.name.split(/\s+of\s+/)[0];
    if (before !== t.name) thinkerYear.set(surnameOf(before), t.year);
  }
  const kindOrder: Record<Citer["kind"], number> = { move: 0, reading: 1, person: 2, moment: 3 };

  const works: Work[] = [...accs.values()].map((a) => {
    // The byline: a reference work's authors with its publisher; a work cited at one place, its fullest byline;
    // a work cited at several places, the byline most of them agree on.
    let by = a.parts.size === 1 ? longest(a.bys) : usualBy(a.bys);
    let surname = a.surname;
    if (a.pub) {
      const pub = a.pub;
      const authors = commonest(
        a.bys.map((b) => refAuthors(b, pub).replace(/\s+&\s+/g, " and ")).filter(Boolean),
        "long",
      );
      by = authors ? (pub.nameFirst ? `${pub.name} (${authors})` : `${authors} (${pub.name})`) : pub.name;
      if (authors) surname = surnameOf(authors);
    }
    const credit = creditOf(by);
    const parts: Part[] = [...a.parts.values()].map((p) => {
      const notes = [...new Set(p.cites.map((x) => x.note).filter(Boolean) as string[])];
      const reading = p.cites.find((x) => x.c.kind === "reading" && x.note)?.note;
      // A place credited differently from the work ("compiled after his death", another translator) says so.
      const pby = a.pub || a.parts.size === 1 ? "" : usualBy(p.bys);
      const pc = pby ? creditOf(pby) : undefined;
      const differs = pby && surnameOf(pby) !== surnameOf(by) ? pby : pc && pc.key && pc.key !== credit.key ? pc.show : undefined;
      return {
        loc: capFirst(commonest(p.locs, "long")),
        locKey: p.locKey,
        full: commonest(p.fulls, "long"),
        url: p.url,
        credit: differs,
        about: reading ?? (notes.length === 1 ? notes[0] : undefined),
        cites: [...p.cites].sort((x, y) => kindOrder[x.c.kind] - kindOrder[y.c.kind]),
      };
    });
    const order = new Map(parts.map((p) => [p, placeOrder(p.loc)]));
    parts.sort((x, y) => (x.locKey === "" ? -1 : y.locKey === "" ? 1 : order.get(x)! < order.get(y)! ? -1 : order.get(x)! > order.get(y)! ? 1 : 0));
    const years = a.years.map((y) => ({ y, n: yearNum(y) })).filter((x) => x.n !== undefined) as { y: string; n: number }[];
    const first = years.sort((x, y) => x.n - y.n)[0];
    const title = longest(a.pub ? a.titles.map(dropAsides) : a.titles);
    const urls = parts.map((p) => p.url).filter(Boolean) as string[];
    const hosts = urls.map(hostOf);
    const isRef = REF_RE.test(`${by} ${title}`) || hosts.some((h) => REF_HOSTS.test(h));
    // A translation's date ("Summa contra Gentiles … trans. Bourke, 1956") isn't the work's: go by the author's dates.
    const translated = a.bys.some((b) => /\btrans\./i.test(b));
    const own = thinkerYear.get(surnameOf(by)) ?? thinkerYear.get(a.surname);
    const editionDate = translated && own !== undefined && own < 1900 && first !== undefined && first.n > own + 100;
    const sortYear = editionDate ? own : (first?.n ?? own);
    const old = sortYear !== undefined ? sortYear < 1900 : hosts.some((h) => OLD_HOSTS.test(h));
    const kind: Kind = isRef ? "ref" : old ? "old" : "modern";
    const objections = new Set<ObjectionId>();
    for (const p of parts) for (const { c } of p.cites) if (c.kind === "move" || c.kind === "reading") objections.add(c.o);
    const search = fold([...new Set([title, ...a.titles, by, ...a.bys])].join(" ") + " " + [a.years.join(" "), ...parts.flatMap((p) => [p.loc, p.credit ?? "", ...p.cites.map((x) => x.note ?? "")])].join(" "));
    return { key: a.key, title, by, year: first?.y ?? a.years[0], sortYear, parts, kind, surname, linked: urls.length > 0, objections, search };
  });
  return { works, citations };
}

/* ======================================================================
   The view
   ====================================================================== */

type Group = "kind" | "objection";

const KINDS: { kind: Kind; title: string; note: string }[] = [
  { kind: "old", title: "Classic texts", note: "Written before 1900, oldest first. Texts with no date given come last." },
  { kind: "modern", title: "Modern books and articles", note: "Written since 1900, by author." },
  { kind: "ref", title: "Encyclopedia entries", note: "Overviews of a topic or a person, by title." },
];

const LIB_TABS: { view: "timeline" | "cast" | "lexicon" | "outline" | "sources"; word: string }[] = [
  { view: "timeline", word: "Timeline" },
  { view: "cast", word: "People" },
  { view: "lexicon", word: "Glossary" },
  { view: "outline", word: "Outline" },
  { view: "sources", word: "Sources" },
];

/** The Library's tab row, with Sources current. */
function SourcesTabs() {
  return (
    <nav className="lib-tabs src-tabs" aria-label="Library">
      <span className="lib-tabs-k mono" aria-hidden>
        Library
      </span>
      <ul>
        {LIB_TABS.map((t) => (
          <li key={t.view}>
            <a className="lib-tab mono" href={formatRoute({ view: t.view })} aria-current={t.view === "sources" ? "page" : undefined}>
              {t.word}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const sortOld = (a: Work, b: Work) => (a.sortYear ?? 99999) - (b.sortYear ?? 99999) || a.surname.localeCompare(b.surname) || a.title.localeCompare(b.title);
const sortAuthor = (a: Work, b: Work) => a.surname.localeCompare(b.surname) || (a.sortYear ?? 99999) - (b.sortYear ?? 99999) || a.title.localeCompare(b.title);
const sortTitle = (a: Work, b: Work) => fold(a.title).replace(/^(the|a|an)\s+/, "").localeCompare(fold(b.title).replace(/^(the|a|an)\s+/, ""));

interface Section {
  id: string;
  title: ReactNode;
  note?: string;
  works: Work[];
  /** Listed last, under "Date not given": classic texts with no year to sort them by. */
  undated?: Work[];
  /** Only these citations count in this section (by objection: that objection's). */
  only?: (c: Citer) => boolean;
  o?: ObjectionId;
}

export default function Sources() {
  const { d, ix } = useAtlas();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<Group>("kind");
  const [onlyLinked, setOnlyLinked] = useState(false);

  const { works, citations } = useMemo(() => buildWorks(d, ix), [d, ix]);
  const linked = useMemo(() => works.filter((w) => w.linked).length, [works]);

  const shown = useMemo(() => {
    const needle = fold(q.trim());
    return works.filter((w) => (!onlyLinked || w.linked) && (!needle || w.search.includes(needle)));
  }, [works, q, onlyLinked]);

  const sections: Section[] = useMemo(() => {
    if (group === "kind") {
      return KINDS.map((k) => {
        const works = shown.filter((w) => w.kind === k.kind).sort(k.kind === "old" ? sortOld : k.kind === "ref" ? sortTitle : sortAuthor);
        // Oldest first only works for texts with a date; the rest go last, under their own label.
        const undated = k.kind === "old" ? works.filter((w) => w.sortYear === undefined) : [];
        return { id: `src-${k.kind}`, title: k.title, note: k.note, works, undated };
      }).filter((s) => s.works.length > 0);
    }
    const out: Section[] = d.objections.map((o) => ({
      id: `src-o-${o.id}`,
      title: (
        <>
          <span className="src-sec-num serif">{o.numeral}</span> {o.short || o.title}
        </>
      ),
      note: o.title,
      o: o.id,
      works: shown.filter((w) => w.objections.has(o.id)).sort(sortAuthor),
      only: (c: Citer) => (c.kind === "move" || c.kind === "reading") && c.o === o.id,
    }));
    const elsewhere = shown.filter((w) => w.parts.some((p) => p.cites.some(({ c }) => c.kind === "person" || c.kind === "moment"))).sort(sortAuthor);
    out.push({
      id: "src-o-people",
      title: "People and the Timeline",
      note: "Further reading on a person’s file or a timeline event.",
      works: elsewhere,
      only: (c: Citer) => c.kind === "person" || c.kind === "moment",
    });
    return out.filter((s) => s.works.length > 0);
  }, [group, shown, d]);

  const filtering = q.trim() !== "" || onlyLinked;
  const qt = q.trim();

  const head = (
    <LibHead
      current="outline"
      tabs={false}
      title="Sources"
      dek="Every work cited in the arguments, the reading lists, People and the Timeline, listed once with the moves that cite it. A title marked ↗ opens the text, or a page about it, in a new tab."
      meta={works.length ? `${works.length} works · ${linked} with a link · ${citations} citations` : undefined}
    />
  );

  return (
    <div className="lib lib-sources">
      <SourcesTabs />
      {head}
      {works.length === 0 ? (
        <LibEmpty current="outline" title="No sources yet." text="I haven’t listed any sources yet. Each one will link to the moves that cite it." />
      ) : (
        <div className="src-layout">
          <div className="src-rail">
            <label className="lib-search">
              <span className="sr-only">Search the sources</span>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="lib-search-i">
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l3.5 3.5" />
              </svg>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the sources" autoComplete="off" spellCheck={false} />
            </label>
            <div className="src-group" role="group" aria-label="Group the list">
              <span className="mono lib-k">Group</span>
              <div className="src-seg">
                <button type="button" className="ca-filter" aria-pressed={group === "kind"} onClick={() => setGroup("kind")}>
                  By kind
                </button>
                <button type="button" className="ca-filter" aria-pressed={group === "objection"} onClick={() => setGroup("objection")}>
                  By objection
                </button>
              </div>
            </div>
            <button type="button" className="lib-toggle src-linked" aria-pressed={onlyLinked} onClick={() => setOnlyLinked((v) => !v)}>
              <span className="lib-toggle-box" aria-hidden />
              Only works with a link
              <span className="ca-filter-n mono">{linked}</span>
            </button>
            {sections.length > 1 && (
              <nav className="src-jump" aria-label="Jump to a section">
                <p className="mono lib-k">Jump to</p>
                <ul>
                  {sections.map((s) => (
                    <li key={s.id}>
                      <button type="button" className="src-jump-a" onClick={() => jumpTo(s.id)}>
                        <span className="src-jump-t">{s.title}</span>
                        <span className="src-jump-n mono">{s.works.length}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div className="src-list">
            <p className={`lib-count mono ${filtering ? "" : "sr-only"}`} aria-live="polite">
              {filtering ? (shown.length ? `Showing ${shown.length} of ${works.length} works` : qt ? `No work matches “${qt}”` : "No work has a link yet") : ""}
            </p>
            {shown.length === 0 ? (
              <div className="lib-none">
                {qt ? "Try a shorter word, or an author’s surname." : "Nothing to show."}{" "}
                <button
                  type="button"
                  className="lib-link"
                  onClick={() => {
                    setQ("");
                    setOnlyLinked(false);
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              sections.map((s) => (
                <section key={s.id} id={s.id} className="src-sec" aria-labelledby={`${s.id}-h`}>
                  <header className="src-sec-head">
                    <h2 className="src-sec-h serif" id={`${s.id}-h`} tabIndex={-1}>
                      {s.title}
                    </h2>
                    <p className="src-sec-meta mono">
                      {s.works.length} {s.works.length === 1 ? "work" : "works"}
                    </p>
                    {s.note && <p className="src-sec-note">{s.note}</p>}
                  </header>
                  <ol className="src-entries">
                    {s.works
                      .filter((w) => !s.undated?.includes(w))
                      .map((w) => (
                        <li key={w.key}>
                          <Entry w={w} only={s.only} section={s.o} />
                        </li>
                      ))}
                  </ol>
                  {s.undated && s.undated.length > 0 && (
                    <>
                      <p className="src-undated mono" id={`${s.id}-undated`}>
                        Date not given <span className="src-undated-n">{s.undated.length}</span>
                      </p>
                      <ol className="src-entries" aria-labelledby={`${s.id}-undated`}>
                        {s.undated.map((w) => (
                          <li key={w.key}>
                            <Entry w={w} only={s.only} section={s.o} />
                          </li>
                        ))}
                      </ol>
                    </>
                  )}
                </section>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** In-page jump (the hash is the route, so no #fragment links). */
function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  el.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
}

/* ---------------- one work ---------------- */

function Entry({ w, only, section }: { w: Work; only?: (c: Citer) => boolean; section?: ObjectionId }) {
  const { d } = useAtlas();
  const parts = w.parts.map((p) => ({ ...p, cites: only ? p.cites.filter((x) => only(x.c)) : p.cites })).filter((p) => p.cites.length > 0);
  // By objection: say where else the work is cited.
  const elsewhere = section ? d.objections.filter((o) => o.id !== section && w.objections.has(o.id)) : [];
  const also = elsewhere.length > 0 && (
    <p className="src-also mono">
      Also cited in {elsewhere.length === 1 ? "Objection" : "Objections"} {elsewhere.map((o) => o.numeral).join(", ")}
    </p>
  );

  // Cited at one place only (or as a whole only): one plain entry, under the title as it was cited.
  if (parts.length <= 1) {
    const p = parts[0];
    return (
      <article className={`src-entry kind-${w.kind}`}>
        <h3 className="src-title serif">
          <TitleLink title={p && p.locKey ? p.full : w.title} url={p?.url} className="src-title-t" />
        </h3>
        <ByLine by={w.by} year={w.year} url={p?.url} className="src-by" />
        {p?.about && <p className="src-note">{p.about}</p>}
        {p && <Cites cites={p.cites} about={p.about} label="Cited in" />}
        {also}
      </article>
    );
  }

  const whole = parts.find((p) => p.locKey === "");
  const places = parts.filter((p) => p.locKey !== "");
  return (
    <article className={`src-entry kind-${w.kind}`}>
      <h3 className="src-title serif">
        <TitleLink title={w.title} url={whole?.url} className="src-title-t" />
      </h3>
      <ByLine by={w.by} year={w.year} url={whole?.url} className="src-by" />
      {whole?.about && <p className="src-note">{whole.about}</p>}
      {whole && <Cites cites={whole.cites} about={whole.about} label="Whole work cited in" />}
      <div className="src-places">
        <p className="mono lib-k">
          {places.length} {places.length === 1 ? "place" : "places"} cited
        </p>
        <ul className="src-places-list">
          {places.map((p) => (
            <li key={p.locKey} className="src-place">
              <div className="src-place-k">
                <TitleLink title={p.loc} url={p.url} className="src-loc" />
                {p.url && <span className="src-loc-host mono">{hostOf(p.url)}</span>}
                {p.credit && <span className="src-place-by">{p.credit}</span>}
              </div>
              <div className="src-place-v">
                {p.about && <p className="src-note src-place-note">{p.about}</p>}
                <Cites cites={p.cites} about={p.about} label="Cited in" quiet />
              </div>
            </li>
          ))}
        </ul>
      </div>
      {also}
    </article>
  );
}

const CAP = 3;

/** The moves (and reading lists, people, timeline events) that cite a work or a place in it.
    When citations carry their own notes ("Trotter translation, §233"), each sits under its chip. */
function Cites({ cites, about, label, quiet = false }: { cites: Cite[]; about?: string; label: string; quiet?: boolean }) {
  const [all, setAll] = useState(false);
  const box = useRef<HTMLUListElement>(null);
  const moves = cites.filter((x) => x.c.kind === "move");
  const other = cites.filter((x) => x.c.kind !== "move");
  // One more than the cap isn't worth a button.
  const cut = all || moves.length <= CAP + 1 ? moves.length : CAP;
  const hidden = moves.length - cut;
  const shown = [...moves.slice(0, cut), ...other];
  const noted = shown.some((x) => x.note && x.note !== about);
  // "+ N more" unmounts itself: hand focus to the first chip it revealed.
  const reveal = useRef(false);
  useEffect(() => {
    if (!all || !reveal.current) return;
    reveal.current = false;
    box.current?.querySelectorAll<HTMLElement>(".lib-node")[CAP]?.focus();
  }, [all]);
  if (cites.length === 0) return null;
  const more = hidden > 0 && (
    <li>
      <button
        type="button"
        className="lib-more mono"
        onClick={() => {
          reveal.current = true;
          setAll(true);
        }}
        aria-label={`Show ${hidden} more ${hidden === 1 ? "move" : "moves"}`}
      >
        + {hidden} more
      </button>
    </li>
  );
  return (
    <div className={`src-cites ${noted ? "noted" : ""}`}>
      <span className={quiet ? "sr-only" : "mono lib-k src-cites-k"}>{label}</span>
      <ul className={noted ? "src-rows" : "lib-chips src-chips"} ref={box}>
        {shown.slice(0, cut).map((x) => (
          <CiteItem key={citerKey(x.c)} x={x} note={noted && x.note !== about ? x.note : undefined} />
        ))}
        {more}
        {shown.slice(cut).map((x) => (
          <CiteItem key={citerKey(x.c)} x={x} note={noted && x.note !== about ? x.note : undefined} />
        ))}
      </ul>
    </div>
  );
}

function CiteItem({ x, note }: { x: Cite; note?: string }) {
  const { d, ix } = useAtlas();
  const c = x.c;
  let chip: ReactNode = null;
  if (c.kind === "move") chip = <NodeChip id={c.id} />;
  else if (c.kind === "reading") {
    const o = ix.objections.get(c.o);
    if (o)
      chip = (
        <a className="lib-node src-cite" href={formatRoute({ view: "objection", o: c.o })}>
          <span className="src-cite-k mono">Reading list</span>
          <span className="src-cite-t">
            <span className="serif">{o.numeral}</span> {o.short || o.title}
          </span>
        </a>
      );
  } else if (c.kind === "person") {
    const t = ix.thinkers.get(c.id);
    if (t)
      chip = (
        <a className={`lib-node src-cite s-${t.side}`} href={formatRoute({ view: "cast", thinker: c.id })}>
          <span className="monogram src-cite-mono" aria-hidden>
            {initials(t.name)}
          </span>
          <span className="src-cite-k mono">Person</span>
          <span className="src-cite-t">{t.name}</span>
        </a>
      );
  } else {
    const m = d.moments.find((y) => y.id === c.id);
    if (m)
      chip = (
        <a className="lib-node src-cite" href={formatRoute({ view: "timeline", moment: c.id })}>
          <span className="src-cite-k mono">{m.when || yearText(m.year)}</span>
          <span className="src-cite-t">{m.title}</span>
        </a>
      );
  }
  if (!chip) return null;
  return (
    <li className={note ? "src-row" : undefined}>
      {chip}
      {note && <p className="src-row-note">{note}</p>}
    </li>
  );
}
