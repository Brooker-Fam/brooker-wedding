# Thought Pages — Brooker house notes

> The index renders as **"Thought Pages"** (`/debates` route kept for stable URLs and
> the old `/vaccine-debate` redirect). The individual pages are still built as
> self-contained "field maps" in the editorial dark house style.

Self-contained HTML "field maps" of contested questions. Each one takes a debate,
lays out its lineage, catalogs the live positions, then stages the real
disagreements as **steelmanned cruxes** (the strongest case for *both* sides) and
reveals the one or two questions underneath. The point is never to pick a winner —
it's to help a reader find *which question they actually disagree on*.

Built from the personal `debate-map` skill
(`MattBro/dotfiles-personal/skills/debate-map`). This file records how that skill
is adapted for **brooker.family** and how to add a new map.

## Where things live

| Thing | Path |
|-------|------|
| The maps (one portable `.html` each) | `public/debates/<slug>.html` |
| The index page (wedding-themed) | `src/app/debates/page.tsx` (route: `/debates`) |
| Reference implementation / template | `public/debates/god.html` |
| Old `/vaccine-debate` URL | redirects to `/debates/vaccines.html` |

Interactive: `all-the-way-down` (a Disputation, described below).

Current maps: `god`, `morality`, `vaccines`, `covid-vaccines`, `us-iran`,
`ai-data-centers`, `saturated-fat`, `sun-exposure`, `venezuela`, `milk-mucus`.

`venezuela` is a rise-and-fall history as well as a debate: its lineage section
carries the boom-and-bust narrative, and the two-pole axis runs *ruined from
within* (socialism / misrule) ↔ *strangled from outside* (sanctions / oil shock /
empire), with the petrostate "resource curse" as the lilac hinge.

## Disputations: the interactive page type

`/debates/all-the-way-down` is a different kind of Thought Page. It is a
**Disputation**, an argument map in layers that you read and mark, where the
other Thought Pages are one long read. The name comes from the medieval
*disputatio*: Aquinas opens each article of the *Summa* with objections to his
own view and then answers them. This one takes five objections to the Christian
God, gives each the reply from classical theism, and lets the two sides answer
each other for as many rounds as the published debate goes. It has about 170
moves, up to seven rounds deep.

| Thing | Path |
|-------|------|
| Route (fonts, metadata, nav hidden) | `src/app/debates/all-the-way-down/` |
| No-JS / search-engine outline | `src/app/debates/all-the-way-down/outline/page.tsx` |
| Engine (content-agnostic) | `src/components/atlas/` |
| Content for this disputation | `src/components/atlas/content/` |

**Layers.** The overview has the map, a sunburst of all five objections with
one ring per round (the code calls it the Rose). Each objection has its own page
(the code calls it the chamber): a thread of moves with forks, plus a chart of
the whole tree. Each move gives one side's case in its own voice, with a
quotation where there is a verified one, sources, and what would change that
side's mind. Around these sit *Step through it* (a guided walk, `#/walk/…`),
*Where you stand* (the reader's summary, `#/ledger`) and the Library: Timeline,
People (`#/cast`), Glossary (`#/lexicon`) and Outline. Every view and move has
its own link (`#/o/<objection>/<node>`, `#/cast/<thinker>` …). Routes keep their
old names; only the visible labels changed.

**How statuses work.** Readers mark moves *Holds* or *Fails*. Statuses then
follow up each tree by three-valued grounded semantics (`semantics.ts`). A move
the reader hasn't marked is answered if any reply to it stands, stands if every
reply to it fails, and stays open if it has no replies. So a move nobody has
answered is *open*, whoever spoke last, and the page never hands down a default
verdict. There is no overall score. Calls live in `localStorage` only.

**Voice.** Plain words, every term explained where it appears, people as the
subjects of sentences, and the sources' own words wherever they can be checked.
The visible vocabulary is small: objection, part, move, round, the Objector, the
Defender, Spinoza, Holds / Fails, and Open / Stands / Answered.

**Content rules** (see `types.ts`). Children *attack* their parent, so a
parent's label must state the claim as attacked (if a reply concedes a fact but
denies its significance, the label states the significance). Alternatives are
sibling attacks. Sides alternate down a branch, and neither side gets the last
word by default. Quotes go in only when the wording has been checked against the
text. Inline markup: `*italic*`, `[[term|text]]`, `{{thinker|text}}`,
`((node-id|text))`. Thinkers and timeline moments can carry an optional `quote`
(checked like any other); the card that opens from a person's name shows theirs.

**Adding another disputation.** Write a new `Disputation` object (objections,
thinkers, terms, moments) in its own content folder, give it a route like this
one that renders `<Atlas d={…} />`, and add a card to the index. Objection ids are
currently typed for this disputation (`ObjectionId` in `types.ts` and the list in
`router.ts`), so widen those first.

## What's customized for the Brooker site

The skill ships a neutral, standalone artifact. For this site we keep the
editorial dark house style **exactly** (the look is the point) and add only a
light "site tie" so a map doesn't feel orphaned:

1. **Top back-link** — `<a class="site-tie" href="/debates">All thought pages · brooker</a>`
   as the first child of `<header>`.
2. **Footer links** — a `.foot-links` block linking back to `/debates` and `/`.
3. **CSS** for both (`.site-tie`, `.foot-links`) added to the shared `<style>`.
4. **The index** (`/debates`) is the only surface rendered in the wedding theme
   (Cormorant + Quicksand, enchanted background). Each card shows the map's
   two-pole axis as the verdigris→ochre gradient bar, tying the index to the maps.

Everything else — fonts (Fraunces / IBM Plex), the `--found`/`--made`/`--pivot`
color axis, the lineage / positions / cruxes / payoff / shelf structure — is
untouched from the skill. Maps are intentionally *not* in the wedding nav; they're
reachable from `/debates`.

## Adding a new map

1. Copy `public/debates/god.html` to `public/debates/<slug>.html`. Keep the whole
   `<head>`/`<style>`, the `.site-tie` line, the `.foot-links` footer, and the
   `<script>` verbatim. Change only the `<title>` and the body content.
2. Do the analysis *first* (it's the hard part): name the two poles, enumerate
   8–12 positions, reduce to **four** cruxes, steelman both sides of each, then
   collapse to the underlying question(s) for the payoff SVG.
3. **Verify every "go deeper" link resolves** before shipping. From the repo:
   ```sh
   curl -sS -o /dev/null -w "%{http_code}" -L \
     -H "Accept: text/html,application/xhtml+xml" \
     -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15" "<URL>"
   ```
   Keep only `200`s. A book cited by title + author beats a dead link.
4. Add a card to the `DEBATES` array in `src/app/debates/page.tsx`.
5. Re-read both panels of every crux back to back: would a real proponent of each
   side sign off on theirs as their *best* case? If one reads weaker, rewrite it.

## Feedback on the skill (ideas, not yet applied)

The format is strong as-is. A few things that could make it better, if Matt wants
to fold them back into the dotfiles skill:

- **"What would change my mind" line per crux.** A one-line falsification note
  under each crux ("a realist concedes if…", "a hawk concedes if…"). It sharpens
  steelman parity and stops a crux from reading as a frozen standoff. Highest-value
  add. Held off here only to keep all four maps consistent with the current
  template — worth doing across the board in one pass.
- **Don't encode position by color alone.** Pole is shown by hue (verdigris /
  ochre / lilac), which a colorblind reader can miss. A tiny text token in each
  `.pos` (e.g. a mono "▲ pole A") would make it legible without color.
- **Loosen "exactly four" cruxes to "three to five (four default)."** Some debates
  have three real cruxes and padding to four weakens them; others have five.
- **A one-line "stakes" in the dek for live topics.** Useful for vaccines / Iran
  where the disagreement has real-world costs; pointless for timeless ones.
- **Steelman parity check.** Worth a final blind pass (or a second model) asking
  "which side does this favor?" — if it can tell, the parity isn't there yet.
- **Google Fonts is an external dependency.** Fine online; for true offline
  portability, a system-font fallback stack would help.

## Note

These are educational maps of public debates, written to be fair to every side.
Steelmanning a position is not endorsing it. The vaccine and Iran maps in
particular touch live, contested topics; they're framed as policy/issue debates,
not medical or strategic advice.
