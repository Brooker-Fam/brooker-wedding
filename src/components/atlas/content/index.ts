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
    "The Objector raises five objections to the Christian God and the Defender replies to each. The two go back and forth for as many rounds as the published debate goes. Every objection and reply is a move, and you decide which moves hold.",
    "Here you get each move's claim and a short summary. The interactive version adds the full argument and sources for every move, and there you can mark moves Holds or Fails to see where each objection stands. There is no overall score.",
  ],
  objections: [coherence, hiddenness, nature, evidence, morals],
  thinkers,
  terms,
  moments,
};

export default disputation;
