# Brooker Wedding Site

Wedding celebration website for Matt & Brittany Brooker at **brooker.family**.

## Context

Matt & Brittany got married in a small winter ceremony and threw their **celebration party on June 27, 2026** at their farm in Greenwich, NY. The party is over, so the public site is a thank-you keepsake: the home page looks back on the day, and the nav only offers Photos, Playlist, and Games. Write in a warm past tense, never "join us" or "RSVP".

Never put a date on the wedding, in the site or anywhere in this repo (it's public on GitHub, so that includes docs and commit messages). Leave it undated, and don't add day counts that pin it down, like from Thanksgiving or to June 27. Showing the June 27 celebration date is fine.

### What's linked and what isn't

- **Public nav and home:** `/`, `/photos`, `/songs` (labelled "Playlist", read-only), `/games`.
- **Retired:** `/rsvp`, `/details`, `/bridal-shower` redirect to `/`. `/registry` still renders but nothing links to it. RSVP admin pages and APIs still work.
- **Family side projects stay unlinked on purpose:** `/calendar`, `/sapphire`, `/backpacking-2026`, `/crib`, `/debates`, `/birth`, `/maple`. Matt doesn't want them easy to find, so don't add them to the nav, home page, or footer.

### Family

- **Matt** - Groom. Green suit. Software engineer.
- **Brittany** - Bride.
- **Emmett** (11) - Matt's son from a prior marriage
- **Sapphire** (8) - Matt's daughter from a prior marriage
- **Maple Jane** - Matt & Brittany's baby girl, due October 20, 2026. The home page sign-off drops "due October 20" on that date; once she's born, swap in her real birthday. Her newborn tracker is Maple's Log at `/maple` (see below).
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
│   ├── details/page.tsx           # Redirects to / (retired after the party)
│   ├── rsvp/page.tsx              # Redirects to / (admin lives under rsvp/admin)
│   ├── globals.css                # Theme, animations, dark mode, keepsake prints
│   ├── layout.tsx                 # Root layout with ThemeProvider
│   └── page.tsx                   # Home: thank-you card + album prints, timeline, links (ISR, 10 min)
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
│   ├── home/MemoryTable.tsx       # Home hero: polaroid prints of album photos around the thank-you card
│   ├── Navigation.tsx             # Fixed nav + mobile menu + theme toggle
│   ├── ThemeProvider.tsx          # Dark mode context (light/system/dark)
│   ├── FarmScene.tsx              # SVG landscape with fireflies, stars (home page closing)
│   └── ConfettiCelebration.tsx    # Canvas confetti (Sapphire's party, crib guide)
└── lib/
    ├── celebration.ts             # Home page data: album prints (starred first, rest random) + photo/song counts
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

## Git Workflow

**Always commit and push directly to `main`.** This is a solo/family project — no review gate, no PRs needed. Vercel auto-deploys `main`, so pushing to `main` == deploying.

If a session has been assigned a feature branch, ignore that and push to `main` anyway. Do not open PRs unless explicitly asked.

Push to `main` at the end of every prompt, with whatever's done. Don't hold work on a branch while reviews run; land fixes as follow-up commits to `main`.

## Database

**Env var:** `DATABASE_URL` (Neon Postgres connection string)

Migrations run automatically on every `pnpm build`. When `DATABASE_URL` is not set, APIs return mock data gracefully.

### Tables

```sql
rsvps (id, name, email, guest_count, attending, dietary_restrictions, potluck_dish, message, created_at)
game_scores (id, player_name, game_id, score, created_at)
```

To add a new migration: edit `src/lib/migrate.ts` and add new `CREATE TABLE IF NOT EXISTS` or `ALTER TABLE` statements. Keep them idempotent.

## Google Calendar integration

Pulls events (TKD, drama club, etc.) from a connected Google account into `/calendar`.

**Env vars:**

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth app credentials from [Google Cloud Console](https://console.cloud.google.com/). Authorized redirect URI: `{BASE_URL}/api/calendar/google/callback`.
- `CRON_SECRET` — shared secret checked by `/api/calendar/google/sync`. Vercel cron auto-injects `Authorization: Bearer $CRON_SECRET`.
- `NEXT_PUBLIC_BASE_URL` (optional) — overrides the redirect URI base; otherwise inferred from Vercel env.

**Flow:** Admin hits "Connect Google Calendar" on `/calendar/admin` → OAuth consent → tokens stored encrypted in `google_config` (mirrors Spotify's pattern, keyed by `GOOGLE_CLIENT_SECRET`-derived AES-256-GCM). Admin toggles which calendars to sync in `google_calendars`. Events mirror into `calendar_events` (read-only from our side; Google is source of truth). Sync runs every 15 min via Vercel cron (`vercel.json`) using Google's `syncToken` for incremental updates. See `docs/google-calendar-integration.md` for the design rationale.

**Points for events:** `calendar_events.points` is set by keyword rules in `src/lib/calendar/event-rules.ts` on ingest (e.g. `/TKD/i → Emmett, 5pts`). Kids tap "✓ I went" on `/calendar/kid/[name]` → inserts into `event_completions`, which the scoreboard UNIONs with `task_completions`.

**Key files:** `src/lib/google.ts` (OAuth + encryption), `src/lib/calendar/google-sync.ts` (calendar list + event sync), `src/lib/calendar/events-db.ts` (read/write events), `src/app/api/calendar/google/*` (routes), `src/components/calendar/GoogleCalendarPanel.tsx` (admin UI), `src/components/calendar/EventCard.tsx` (render).

## Guest Photos (`/photos`)

Guest uploads live in **Vercel Blob** (files) + Neon (`photos` table, metadata). Uploads are re-encoded client-side (~4096px JPEG + 512px thumb; videos get a captured poster frame). Grid tiles use `thumb_url`, falling back to Vercel's image optimizer (`/_next/image`, remotePatterns in `next.config.ts`) for rows without thumbs. Gallery pages with a `before` id cursor (200/page).

**Home page prints:** the star on each `/photos/manage` tile sets `photos.featured` (admin `PATCH /api/photos?id=` with `{ featured }`, which revalidates `/`). The home page lays starred photos down first, shuffled, and fills the rest of the 12 at random; reported or unapproved photos never show, starred or not.

**Export:** `/photos` → "Take the memories home" panel (`src/components/photos/ExportPanel.tsx`): client-side zip via `fflate` (streams to disk on Chromium; also the Apple Photos path), and per-guest **Google Photos album export** (`photoslibrary.appendonly` scope, token in an httpOnly cookie only, batched relay via `/api/photos/google-export`). Reuses `GOOGLE_CLIENT_ID/SECRET`; requires Photos Library API enabled + redirect URI `{BASE_URL}/api/photos/google-export/callback`. See `docs/photos-ops.md`.

## Maple's Log (`/maple`)

Private, collaborative newborn tracker: nursing L/R timers, bottles, pumping, diapers + stool colors, sleep, tummy time, temperature/vitals/skin checks, growth on WHO girls percentiles, notes and doctor questions, photos and milestones. Full design and ops notes: `docs/maple.md`.

- **Access:** Google sign-in (identity only) + `maple_members` (roles owner / member / viewer). First Google sign-in claims owner unless `MAPLE_ALLOWED_EMAILS` (fallback `BIRTH_ALLOWED_EMAILS`) is set. Fallback sign-in with `ADMIN_USER`/`ADMIN_PASS` as the "admin" member. One-time invite links for family without Google. Sign-in shares `/birth`'s registered redirect URI: `/api/birth/auth/callback` hands states starting `maple.` to `src/lib/maple/google-callback.ts`, so there's no Google Console setup.
- **Data:** `maple_entries` (one row per event: `kind` + JSONB `data`, metric units; running timers have `active = TRUE`; soft deletes; `client_id` for idempotent retries). The family is in `America/New_York`; all "today"/clock logic goes through `src/lib/maple/time.ts`, never the server's zone.
- **Medical guidance** lives only in `src/lib/maple/guidelines.ts` (thresholds + exact copy, sourced from AAP/CDC/WHO/ABM). Alerts always say who to call; never suggest medicine doses. `insights.ts` applies the rules for both the app and the MCP tools. Warnings and reminders are off unless `settings.show_alerts` is true (Family → On Today → Warnings & reminders; the family doesn't log consistently enough for them), but readings are still checked as they're entered.
- **AI:** MCP server at `/api/maple/mcp` (Streamable HTTP, discrete tools in `src/lib/maple/mcp-tools.ts`). OAuth goes through the shared `/oauth/*` shim; Maple connections (RFC 8707 `resource` = `/api/maple/mcp`) sign in with Google and get `maple:<email>` tokens. The calendar and RSVP MCP servers accept admin tokens only; the calendar one (`/api/mcp`) also registers Maple's tools, crediting entries to `settings.admin_as` (an owner's own "Calendar connector logs as me" toggle) or "Admin". Refresh tokens go only to codes redirected to Claude, ChatGPT or loopback (`trustedRedirect`); admin ones lapse after 90 idle days. Set `MCP_SECRET` in Vercel. Setup page: `/maple/connect`.
- **Hands-free:** `POST /api/maple/quick` with a personal token (Family → Hands-free) for iOS Shortcuts / Siri.
- **Pill reminders:** Web Push for her medicines, turned on per phone from her screen (Reminders on this phone; iPhone needs the Home Screen app). `src/lib/maple/push.ts` works out what's due on each tick: `/api/maple/push/tick`, called every 5 min by `.github/workflows/maple-reminders.yml` and after state polls from an open app. VAPID keys derive from `MCP_SECRET` unless `VAPID_*` are set. Never a dose. See `docs/maple.md`.
- **Look:** its own calm, native-feeling skin, not the site's storybook one. Use the semantic `mp-*` colors (values in `src/app/maple/maple.css` cover day, dark and the night look, so no `dark:` variants), icons from `src/components/maple/icons.tsx`, and the kit in `ui.tsx`. No emoji in the app's chrome (members' avatar emoji and family-typed text are fine). Details in `docs/maple.md`.
- **Photos:** Vercel Blob under `maple/`, private store via `MAPLE_BLOB_READ_WRITE_TOKEN` (falls back to the public store); always served through the auth proxy `/api/maple/photo`, never by blob URL.
- **Privacy:** PostHog capture and session replay are off on `/maple` (see `PostHogProvider.tsx`). Never send Maple data to unauthenticated pages like `/calendar/display`.
- **For mom:** Her page works like Maple's log: it always exists (no setup), anyone signed in except view-only guests can use it, and doses just save (only a likely duplicate within 30 minutes asks). Her data lives only in `maple_care_*` and never shows in Maple's views; every read goes through `careAccess`; no dose numbers anywhere by default; limits are in the label's own unit. Details in `docs/maple.md` ("For mom").

## Thought Pages (`/debates`)

Long-read debate "field maps" are self-contained HTML in `public/debates/*.html`; the index is `src/app/debates/page.tsx`. `/debates/all-the-way-down` is an interactive **Disputation** (multi-layer argument map: Rose overview → objection chambers → moves, plus a guided walk, the reader's ledger, timeline, cast, lexicon, and a chronology game at `#/play`). Engine: `src/components/atlas/` (content-agnostic); content: `src/components/atlas/content/`. See `src/app/debates/README.md` for the content rules and how to add another.

## Analytics

**Env var:** `NEXT_PUBLIC_POSTHOG_KEY` (PostHog project API key)

PostHog is wired up in `src/components/PostHogProvider.tsx` (client: autocapture, session replay, client-side exceptions, manual pageview tracking for App Router) and `src/lib/posthog-server.ts` (server: `captureServerException` called from every API route `catch` block). Events are proxied through the Next.js `/ingest/*` rewrite defined in `next.config.ts` to dodge ad-blockers. If `NEXT_PUBLIC_POSTHOG_KEY` is unset, both client and server become no-ops.

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
4. Use `GameWrapper` for consistent layout

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
