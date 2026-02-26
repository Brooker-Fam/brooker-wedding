# Brooker Wedding Site

Wedding celebration website for Matt & Brittany Brooker at **brooker.family**.

## Context

Matt & Brittany got married **January 1, 2026**. This site is for their **celebration party on June 27, 2026** at their farm (49 Clarks Mill Rd, Greenwich, NY 12834). The tone is "we already got married, now come party with us" -- not a traditional wedding site.

### Family

- **Matt** - Groom. Green suit. Software engineer.
- **Brittany** - Bride.
- **Emmett** (11) - Matt's son from a prior marriage
- **Sapphire** (8) - Matt's daughter from a prior marriage
- **Zoe** - Small black dog with grey muzzle, "couch commander"
- **Bruce** - Cat

### Design Direction

- **Enchanted forest / gnome fairy princess** aesthetic
- Color palette: dark forest green (#1D4420), warm gold (#C49A3C), sage (#5C7A4A), cream (#FDF8F0), blush (#E8C8B8), lavender (#B8A9C9), deep plum (#4A1A2A)
- Fonts: Cormorant Garamond (display headings), Quicksand (body text)
- Fireflies, fairy lights, floating petals, gnome silhouettes, toadstools
- Say "our farm" not "the farm", "celebration" not "wedding"

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **Tailwind CSS v4** with `@theme inline` and `@custom-variant dark`
- **Framer Motion** for animations
- **Neon Postgres** (`@neondatabase/serverless`) for RSVP + game scores
- **pnpm** as package manager
- Deployed on **Vercel** (repo: MattBro/brooker-wedding)

## Project Structure

```
src/
├── app/
│   ├── api/rsvp/route.ts          # POST/GET RSVP submissions
│   ├── api/scores/route.ts        # POST/GET game leaderboards
│   ├── games/                     # 9 game pages (each wraps a component)
│   │   ├── barn-cat-ninja/
│   │   ├── cake-creator/
│   │   ├── duck-duck-goose/
│   │   ├── egg-catcher/
│   │   ├── farm-defense/
│   │   ├── here-comes-the-bride/
│   │   ├── unicorn-taekwondo/
│   │   ├── yoga-goat/
│   │   ├── zoes-adventure/
│   │   └── page.tsx               # Games hub/gallery
│   ├── details/page.tsx           # Event details (location, timeline, FAQ)
│   ├── rsvp/page.tsx              # RSVP form
│   ├── story/page.tsx             # Our Story timeline + farm animals
│   ├── globals.css                # Theme, animations, dark mode
│   ├── layout.tsx                 # Root layout with ThemeProvider
│   └── page.tsx                   # Home page (hero, countdown, games grid)
├── components/
│   ├── games/
│   │   ├── GameWrapper.tsx        # Shared game shell (header, leaderboard)
│   │   ├── EggCatcher.tsx         # Canvas game - catch eggs
│   │   ├── FarmDefense.tsx        # Tower defense with upgrades
│   │   ├── YogaGoat.tsx           # Balance/pose game
│   │   ├── DuckDuckGoose.tsx      # Tap reaction game
│   │   ├── UnicornTaekwondo.tsx   # Combat obstacles
│   │   ├── BarnCatNinja.tsx       # Stealth collection
│   │   ├── ZoesAdventure.tsx      # Endless runner (Zoe the dog)
│   │   ├── CakeCreator.tsx        # Cake decoration
│   │   └── HereComesTheBride.tsx  # Rhythm/timing aisle walk
│   ├── Navigation.tsx             # Fixed nav + mobile menu + theme toggle
│   ├── ThemeProvider.tsx          # Dark mode context (light/system/dark)
│   ├── FarmScene.tsx              # SVG landscape with fireflies, stars
│   ├── Countdown.tsx              # Live countdown to June 27, 2026
│   ├── GameCard.tsx               # Game card for home page grid
│   ├── PixelButton.tsx            # Button component
│   └── ConfettiCelebration.tsx    # Canvas confetti on RSVP success
└── lib/
    ├── db.ts                      # Neon connection (returns null if no DATABASE_URL)
    ├── migrate.ts                 # Auto-migration on build
    └── schema.sql                 # Reference schema (rsvps + game_scores tables)
```

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # Runs migrations then builds
pnpm run migrate  # Run DB migrations only
```

## Database

**Env var:** `DATABASE_URL` (Neon Postgres connection string)

Migrations run automatically on every `pnpm build`. When `DATABASE_URL` is not set, APIs return mock data gracefully.

### Tables

```sql
rsvps (id, name, email, guest_count, attending, dietary_restrictions, potluck_dish, message, created_at)
game_scores (id, player_name, game_id, score, created_at)
```

To add a new migration: edit `src/lib/migrate.ts` and add new `CREATE TABLE IF NOT EXISTS` or `ALTER TABLE` statements. Keep them idempotent.

## Dark Mode

Three-way toggle: light / system (default) / dark. Persisted in `localStorage("theme")`.

- **ThemeProvider** (`src/components/ThemeProvider.tsx`) manages state and applies `.dark` class to `<html>`
- Anti-flash script in `layout.tsx` `<head>` prevents FOUC
- Tailwind uses `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css`
- CSS custom classes (`.soft-card`, `.enchanted-bg`, etc.) use `.dark` prefix selectors
- FarmScene switches to moonlit night scene via `useTheme()` hook

## Games

All games use **HTML5 Canvas** with `requestAnimationFrame`. Key patterns:

- **DPR handling:** `canvas.width = logicalWidth * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`
- **Mobile:** Touch event handlers, min 44px tap targets, dynamic canvas sizing
- **Scores:** Local leaderboard in localStorage, API leaderboard via `/api/scores`
- **Wrapper:** `GameWrapper` provides consistent header (BACK link, title, score) and leaderboard UI

### Adding a New Game

1. Create `src/components/games/NewGame.tsx` (export default component)
2. Create `src/app/games/new-game/page.tsx` importing the component
3. Add to `GAMES` array in `src/app/games/page.tsx`
4. Add to `games` array in `src/app/page.tsx` (home page grid)
5. Use `GameWrapper` for consistent layout

## Key CSS Classes

| Class | Purpose |
|-------|---------|
| `.soft-card` | Frosted glass card (light + dark variants) |
| `.enchanted-bg` | Subtle radial gradient background |
| `.enchanted-input` | Form input styling (light + dark) |
| `.fairy-sparkle` | Pseudo-element gold sparkles on text |
| `.game-card-hover` | Hover lift + shadow effect |
| `.frosted-glass` | Semi-transparent glass effect |

## Animations

Defined as `@keyframes` in `globals.css` with matching utility classes:

- `animate-gentle-float` / `animate-gentle-float-slow` - Floating motion
- `animate-firefly` - Combined glow + drift
- `animate-petal-fall` - Falling petals
- `animate-fairy-sparkle` - Sparkle float
- `animate-fairy-light-twinkle` - String light flicker
- `animate-star-twinkle` - Night sky stars (dark mode)

## Mobile Menu Architecture

The mobile slide-out menu is rendered **outside the `<nav>` element** (as a sibling inside a Fragment) to avoid the `backdrop-filter` stacking context issue. The hamburger button uses `z-[70]`, overlay and panel use `z-[60]`.

## Known Patterns / Gotchas

- **Canvas games on mobile:** Always account for device pixel ratio and use `getBoundingClientRect()` for coordinate mapping
- **Theme in FarmScene:** Uses `useTheme()` from ThemeProvider, not its own media query -- all dark mode is class-based
- **API fallback:** When `DATABASE_URL` is missing, both APIs return `{ mock: true }` -- the frontend works either way
- **pnpm:** This project uses pnpm, not npm. The lockfile is `pnpm-lock.yaml`.
- **No vercel.json:** Deployment uses Vercel defaults
- **Build command:** `npm run migrate && next build` (the `npm run` works with pnpm's build hook)

## TODO / Not Yet Implemented

- **Wedding photos** from pic-time gallery (not yet added)
- **Neon database** needs to be created in Vercel Storage tab (code is ready, just needs the DB provisioned)
- Game leaderboards only work with localStorage until DB is connected
