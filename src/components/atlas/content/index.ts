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
  subtitle: "Five objections to the Christian God, and what his best defenders say back.",
  intro: [
    "Each objection gets a reply from classical theism, the older Christian picture of God as the source of everything that exists. The Objector then answers the reply and the Defender answers back, for as many rounds as the published debate goes (up to seven). Mark each move Holds or Fails, and the map shows where that leaves each objection.",
    "You can read it at any depth. The map on the overview shows all five objections at once. Open one to follow every move with its sources and quotations, and to see what would change each side's mind. Every status is worked out from your own calls, and there is no overall score.",
  ],
  objections: [coherence, hiddenness, nature, evidence, morals],
  thinkers,
  terms,
  moments,
};

export default disputation;
