# Plan: Theme the Admin & Scoreboard

> Status: proposed. Lives in `docs/plans/`. Promote items to `docs/calendar-roadmap.md` when shipped.

## Why this matters

The kid pages (`/calendar/kid/emmett`, `/calendar/kid/sapphire`) are exquisitely themed — Viking runes, fairy sparkles, confetti, theme-matched empty states. They feel like part of a *world*.

The admin (`/calendar/admin`), scoreboard (`/calendar/scoreboard`), and main calendar (`/calendar`) feel like Todoist. Grey columns, plain task cards, utilitarian forms. The shift is jarring: walk from a kid's enchanted quest log into a beige spreadsheet.

The product has one identity already (the kid pages and the wedding-site shell both share a forest/fairy aesthetic). The parent-facing calendar surfaces just haven't caught up. This is a **re-skin**, not a rebuild — none of the underlying components or data flows change.

## Objectives (ranked)

1. **Visual continuity between kid and parent surfaces.** A grown-up should feel like they're in the same product as the kids, not a different app.
2. **Don't sacrifice scannability for theme.** Parents need to glance at a week and see what's happening. Forest gradients can't bury the data.
3. **One shared theme module.** The kid pages currently hardcode `EMMETT_THEME` and `SAPPHIRE_THEME` constants in their page files. Extract to a shared module so admin/scoreboard/display can pull from the same palette.
4. **Re-skin, don't redesign.** Same grid, same cards, same forms. Different chrome, materials, motion.
5. **Dark mode must continue to work.** All themed surfaces already support it; new tokens must too.

## Non-goals

- Changing the information architecture or layout of the admin
- Adding decorative elements that don't survive a parent's third week (no permanent fireflies on the admin grid, please)
- Per-page bespoke themes — one consistent "household" theme across admin/scoreboard/display
- Replacing the form components or input library

## The "Household Bulletin Board" theme

The metaphor: a wooden bulletin board in a forest cottage. Tasks are notes pinned to it. Events are postcards from elsewhere. The week-grid is the corkboard. It's tactile, warm, slightly magical, but readable.

### Palette tokens (add to `globals.css`)

Use the existing CLAUDE.md palette. Add semantic tokens so we're not repeating hex values:

```css
:root {
  --board-bg: #FDF8F0;          /* cream */
  --board-grain: #E8C8B8;       /* blush, used at low opacity for wood grain */
  --board-ink: #1D4420;         /* forest green, primary text */
  --board-accent: #C49A3C;      /* warm gold, points + highlights */
  --board-muted: #5C7A4A;       /* sage, secondary text */
  --board-rule: rgba(92, 122, 74, 0.18);  /* day separators */
}

.dark {
  --board-bg: #0F1F12;           /* deep forest */
  --board-grain: #1D4420;
  --board-ink: #FDF8F0;
  --board-accent: #C49A3C;
  --board-muted: #B8A9C9;        /* lavender for secondary in dark */
  --board-rule: rgba(196, 154, 60, 0.22);
}
```

### New CSS classes (extend `globals.css`)

| Class | Where used | What it does |
|---|---|---|
| `.bulletin-board` | `CalendarView` outer wrapper | Soft cream background, subtle radial wood-grain texture (CSS gradient, no image) |
| `.bulletin-day` | each day column in the week grid | Vertical sage rule on right edge, soft top label |
| `.bulletin-card` | replaces ad-hoc card styles in `TaskCard` / `EventCard` | Cream + slight blush gradient, gold left border (4px), shadow-md, hover lift |
| `.bulletin-card--event` | events specifically | Same as above but with a postcard "stamp" corner in plum |
| `.bulletin-pin` | top-left corner accent on each card | 8px gold circle with inner shadow — the "pin" |
| `.bulletin-header` | `CalendarHeader` | Cormorant Garamond title, gold underline rule, sage subtitle |
| `.bulletin-button` | view-toggle + create buttons | Replaces generic button styling. Gold border, dark green fill on hover |

### Typography

- Headings on admin/scoreboard: Cormorant Garamond (already in the app) — matches the rest of the site
- Body / table data: Quicksand (already in use)
- Day labels in the grid: small caps, sage, letter-spacing wide

### Motion (use existing keyframes from `globals.css`)

- New cards entering the grid: `animate-gentle-float-slow` once on mount, then settle
- Completed tasks: subtle `animate-fairy-sparkle` on the gold accent, not the whole card
- Hover on bulletin-card: shadow lifts, no scale change (parents glance fast, don't want jitter)

**Skip:** falling petals, fireflies, persistent ambient motion on the admin. Save those for the kid pages and `/calendar/display`. The admin is a workspace, not a vista.

## Surfaces to re-skin

### 1. `/calendar` and `/calendar/admin` (shared `CalendarView`)
- Wrap the grid in `.bulletin-board`
- Replace day-column dividers with `.bulletin-day`
- `TaskCard` and `EventCard` adopt `.bulletin-card` / `.bulletin-card--event`
- `CalendarHeader` adopts `.bulletin-header` — and gains a small gnome silhouette beside the title (reuse SVG from `FarmScene` if it has one; otherwise inline a minimal one)
- Forms stay structurally identical; inputs adopt `.enchanted-input` (already exists, currently used in RSVP)

### 2. `/calendar/scoreboard`
- Title becomes "Tally of Quests" in Cormorant Garamond, gold underline
- Member rows become postcard-shaped `.bulletin-card`s, pinned with `.bulletin-pin`
- Progress bars switch from generic gradient to gold-on-sage
- Medal emojis (already there) stay — they're already on-theme
- Tab pills (week/month/all-time) adopt `.bulletin-button` styling
- When the rewards-loop plan ships, the Earned/Redeemed/Balance line uses sage + gold split

### 3. `/calendar/display` (already partially themed)
- Already dark + ambient. Keep, but adopt the new shared token names so palette changes propagate.
- Replace the existing weather card chrome with `.bulletin-card` styling for consistency.

### 4. `GoogleCalendarPanel`
- Currently a collapsed accordion. Re-skin as a "postcard from Google" — small icon, subtle plum accent, "connected on [date]" in sage italic. Same functionality.

## Shared theme module

Extract to `src/lib/calendar/themes.ts`:

```ts
export const HOUSEHOLD_THEME = {
  bg: "var(--board-bg)",
  ink: "var(--board-ink)",
  accent: "var(--board-accent)",
  muted: "var(--board-muted)",
  rule: "var(--board-rule)",
  // ...
};

export const EMMETT_THEME = { /* existing constants, moved here */ };
export const SAPPHIRE_THEME = { /* existing constants, moved here */ };

export function themeForKid(name: string) {
  switch (name.toLowerCase()) {
    case "emmett": return EMMETT_THEME;
    case "sapphire": return SAPPHIRE_THEME;
    default: return null;
  }
}
```

The kid page files import from here instead of holding the constants locally. Future kids (or theme tweaks) edit one file.

## Sequencing

Each step ships independently. Verify with `pnpm dev` and look at the page in a browser before promoting to the next step.

1. **Add tokens + theme module.** No visual change yet (the variables aren't consumed). ~30 min.
2. **Re-skin `CalendarHeader`.** Smallest surface, sets the tone. Bail point if it looks wrong. ~45 min.
3. **Re-skin `TaskCard` + `EventCard`.** The cards are the dominant visual. If they don't sing, nothing else will. ~1.5 hrs.
4. **Re-skin the grid chrome** (day dividers, board background). ~1 hr.
5. **Re-skin scoreboard.** Now the metaphor is locked, scoreboard inherits naturally. ~1 hr.
6. **Re-skin Google panel + forms.** Detail pass. ~45 min.

Total: ~5 hrs. Stop after step 3 to gut-check; the visible payoff is mostly there.

## What we'll learn

- Whether parents actually want decorative chrome on a productivity tool. PostHog session replay on admin will tell us if dwell time changes.
- Whether the metaphor sticks. If Matt/Brittany start calling it "the board" in real-life conversation, we won.
- Whether mobile holds up — bulletin-board metaphors die on small screens if the grain texture overwhelms. Test at 375px first.

## Open questions for Matt

- Comfortable with Cormorant Garamond bleeding into the admin, or keep it kid-side only? (Suggest: yes, bleed it in — it's the site's display face.)
- One gnome silhouette in the header, or zero? (Suggest: one, small, dark green at 40% opacity. Test it; remove if it feels twee.)
- Do you want a manual theme toggle for the admin (board / minimal)? (Suggest: no. One theme. If it doesn't work for parents, fix the theme, don't add an escape hatch.)
