/* "All the Way Down", the first Disputation. The engine (../) is
   content-agnostic; this file assembles one disputation from its parts.
   `subtitle` and `intro[0]` show on the overview; the outline page shows all of `intro`. */

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
  subtitle: "Five objections to the Christian God, and what his defenders say back.",
  intro: [
    "The Defender replies to each objection, and the two sides go back and forth for as many rounds as the published debate goes. Every objection and reply is a move, and you decide which moves hold.",
    "Each move here has its claim, a one-sentence summary and any quotation. In the interactive version you also get each move's full argument, its sources and what would change that side's mind, and you can mark moves Holds or Fails to see where each objection stands. There is no overall score.",
  ],
  objections: [coherence, hiddenness, nature, evidence, morals],
  thinkers,
  terms,
  moments,
};

export default disputation;
