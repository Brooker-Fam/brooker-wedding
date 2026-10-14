/* Data model for a Disputation: a multi-layer, interactive argument map.
   The engine in this folder is content-agnostic; a disputation is just a
   `Disputation` object (see content/index.ts). Children of an ArgNode are
   *attacks* on it: each child is a reason its parent fails. */

export type Side = "skeptic" | "theist" | "spinoza";

export type ObjectionId = "coherence" | "hiddenness" | "nature" | "evidence" | "morals";

export interface Quote {
  text: string;
  who: string;
  /** e.g. "Euthyphro 10a", "Ethics I P17 Schol." */
  cite: string;
  /** Free online text where the passage can be read in context (verified to resolve). */
  url?: string;
}

export interface Source {
  title: string;
  by: string;
  year?: string;
  /** Only links that were verified to resolve. */
  url?: string;
  note?: string;
}

export interface ArgNode {
  /** Globally unique kebab id, prefixed by objection: "coh-", "hid-", "nat-", "evi-", "mor-". */
  id: string;
  side: Side;
  /** ≤ 64 chars; a claim phrased as a claim. */
  label: string;
  /** One plain sentence — the "in plain terms" line. Inline markup allowed. */
  gist: string;
  /** The side's best case in its own voice. Inline markup allowed. */
  body: string[];
  quote?: Quote;
  thinkers?: string[];
  /** "This side concedes if …" */
  cedes?: string;
  /** Cross-links to nodes anywhere in the disputation. */
  see?: { id: string; why: string }[];
  sources?: Source[];
  /** Replies that attack this node. */
  children?: ArgNode[];
}

export interface Objection {
  id: ObjectionId;
  numeral: "I" | "II" | "III" | "IV" | "V";
  short: string;
  title: string;
  objection: string;
  counter: string;
  dek: string;
  question: string;
  /** 1–3 skeptic prongs; each is the root of a tree. The objection stands if any prong stands. */
  prongs: ArgNode[];
  spinoza: { title: string; body: string[]; quote?: Quote };
  /** Moment ids, chronological. */
  lineage: string[];
  reading: Source[];
}

export interface Thinker {
  id: string;
  name: string;
  /** "1225–1274", "c. 470–399 BCE", "b. 1965" */
  life: string;
  /** Sortable floruit year (negative = BCE). */
  year: number;
  tradition: string;
  side: Side | "neutral";
  line: string;
  work?: string;
  /** A signature line, verified against a public-domain or published text. */
  quote?: Quote;
  /** Where to read more: reference entries (SEP, IEP) and primary texts. */
  sources?: Source[];
}

export interface Term {
  id: string;
  term: string;
  def: string;
}

export interface Moment {
  id: string;
  /** Negative = BCE. */
  year: number;
  /** Display string, e.g. "c. 399 BCE". */
  when: string;
  title: string;
  text: string;
  thinker?: string;
  node?: string;
  strands: ObjectionId[];
  side: Side | "neutral";
  /** A line from the work or event, verified against its text. */
  quote?: Quote;
  /** The work itself or a good account of the event. */
  sources?: Source[];
}

export interface Disputation {
  slug: string;
  title: string;
  subtitle: string;
  intro: string[];
  objections: Objection[];
  thinkers: Thinker[];
  terms: Term[];
  moments: Moment[];
}

/* ---------- reader judgments & computed labels ---------- */

/** What the reader said about a node. Absent = no judgment. */
export type Judgment = "holds" | "fails";

/** Three-valued grounded labelling. */
export type Label = "in" | "out" | "undec";
