/* "All the Way Down" — the first Disputation. The engine (../) is
   content-agnostic; this file assembles one disputation from its parts. */

import type { Disputation } from "../types";
import coherence from "./coherence";
import evidence from "./evidence";
import hiddenness from "./hiddenness";
import morals from "./morals";
import nature from "./nature";
import { terms } from "./lexicon";
import { thinkers } from "./thinkers";
import { moments } from "./timeline";

const disputation: Disputation = {
  slug: "all-the-way-down",
  title: "All the Way Down",
  subtitle: "Five objections to God, the strongest replies, and the replies to those.",
  intro: [
    "A Spinozist's five reasons for not believing in the God of Christian theism — each met by the best of classical theism, and each answer answered in turn, for as many rounds as the real literature goes.",
    "Read it at any depth. The overview gives the whole quarrel in a minute; each objection opens into a tree of moves; each move carries its history, its sources, and what would change its mind. Mark what holds and what fails, and the map shows where you actually stand.",
  ],
  objections: [coherence, hiddenness, nature, evidence, morals],
  thinkers,
  terms,
  moments,
};

export default disputation;
