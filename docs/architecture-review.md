# Brooker Wedding Site -- Architecture & Knowledge Base

> **What this doc is for:** A living reference for anyone working on this codebase. It covers the
> high-level architecture, design philosophy, how the pieces fit together, and a prioritized list
> of things that should be addressed. Read this before making significant changes.

---

## Design Philosophy

- **"We already got married, now come party."** The site is a celebration invitation, not a traditional wedding site. Tone is joyful, informal, playful.
- **Enchanted forest aesthetic.** Dark greens, warm golds, fairy lights, gnome silhouettes, toadstools. Fonts: Cormorant Garamond (display) + Quicksand (body).
- **Games are a first-class feature.** 11 HTML5 Canvas games give guests something fun to do. They're meant to be lightweight diversions, not production game engines.
- **Works without a database.** When `DATABASE_URL` is unset, APIs return gracefully and the frontend still renders. This makes local dev frictionless.
- **Dark mode is class-based.** Three-way toggle (light/system/dark), persisted in localStorage, with an anti-flash `<head>` script to prevent FOUC.

---

## High-Level Architecture

```
                        +-----------------+
                        |   Vercel Edge   |
                        |  (middleware.ts) |
                        |  Basic Auth for  |
                        |  admin routes    |
                        +--------+--------+
                                 |
              +------------------+------------------+
              |                                     |
     +--------v--------+                  +---------v---------+
     |   Next.js App    |                 |    API Routes      |
     |   (App Router)   |                 |  /api/rsvp         |
     |                  |                 |  /api/rsvp/lookup  |
     |  / (home)        |                 |  /api/rsvp/public  |
     |  /details        |                 |  /api/scores       |
     |  /rsvp           |                 +---------+----------+
     |  /rsvp/admin     |                           |
     |  /games          |                  +--------v--------+
     |  /games/[game]   |                  |   Neon Postgres  |
     +------------------+                  |  (serverless)    |
                                           +-----------------+
```

### Pages

| Route | Purpose | Rendering |
|-------|---------|-----------|
| `/` | Hero, countdown, family section, story | Client (`"use client"` for Framer Motion) |
| `/details` | Event info, location, farm animals | Client |
| `/rsvp` | RSVP form with cookie-based recall | Client |
| `/rsvp/admin` | Admin dashboard (Basic Auth protected) | Client |
| `/games` | Game gallery with high scores from localStorage | Client |
| `/games/[game]` | 11 individual game pages (thin wrappers) | Client |

### API Routes

| Endpoint | Methods | Auth | Purpose |
|----------|---------|------|---------|
| `/api/rsvp` | POST | None (public) | Submit new RSVP |
| `/api/rsvp` | GET `?id=N` | None | Single RSVP lookup (cookie-based) |
| `/api/rsvp` | GET (no id) | Basic Auth | Full RSVP list (admin) |
| `/api/rsvp` | PUT | Basic Auth | Update RSVP (admin) |
| `/api/rsvp` | DELETE | Basic Auth | Delete RSVP (admin) |
| `/api/rsvp/lookup` | GET | None | Search RSVPs by name/email |
| `/api/rsvp/public` | GET | None | Public guest list (`public_display = true` only) |
| `/api/scores` | POST | None | Submit game score |
| `/api/scores` | GET | None | Leaderboard by game_id |

### Database (Neon Postgres)

Two tables:

```sql
rsvps (id, name, email, attending, guest_count, adult_count, child_count,
       dietary_restrictions, potluck_dish, message, phone, mailing_address,
       attendee_names, public_display, created_at, updated_at)

game_scores (id, player_name, game_id, score, created_at)
```

Migrations run automatically on every `pnpm build` via `src/lib/migrate.ts`. They're idempotent (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ADD COLUMN IF NOT EXISTS`).

### Game Architecture

All 11 games follow the same pattern:
- Single component file in `src/components/games/`
- HTML5 Canvas with `requestAnimationFrame` loop
- Game state stored in `useRef` (not React state) for performance
- DPR-aware rendering: `canvas.width = logicalWidth * dpr`
- Touch + mouse input handlers
- Local high scores in localStorage, optional API leaderboard via `/api/scores`
- Wrapped in `GameWrapper` component for consistent header/leaderboard UI

### Auth & Middleware

`src/middleware.ts` protects admin routes with HTTP Basic Auth using `ADMIN_USER` and `ADMIN_PASS` env vars. Protected routes:
- `/rsvp/admin` (page)
- `GET /api/rsvp` without `?id=` (full list)
- `PUT /api/rsvp` (edit)
- `DELETE /api/rsvp` (delete)

Public endpoints (POST new RSVP, single lookup by ID, public guest list, scores) require no auth by design.

---

## Things to Address

### High Priority

| Issue | Details |
|-------|---------|
| **No rate limiting on public POST endpoints** | `/api/rsvp` (POST) and `/api/scores` (POST) have no rate limiting. An attacker could spam submissions or flood the scores table. Consider Vercel edge rate limiting or a simple counter. |
| **RSVP IDs are sequential integers** | Single-RSVP lookup uses `?id=1`, `?id=2`, etc. Anyone can enumerate all RSVPs. The lookup endpoint returns PII (email, phone, mailing address). Consider UUIDs for public-facing lookups, or restrict what fields the single-lookup returns. |
| **`/api/rsvp/lookup` exposes search** | Open endpoint lets anyone search RSVPs by name/email with a 2-char minimum. Returns id, name, email, attending status. Useful for the "find your RSVP" flow, but could be tightened (e.g., require email match, not just name substring). |
| **`x-admin-edit` header skips validation** | In the PUT handler, `x-admin-edit: true` bypasses phone/address required checks. The PUT route IS behind Basic Auth via middleware, so this is low risk, but the header itself isn't verified against auth -- it's just trusted. |

### Medium Priority

| Issue | Details |
|-------|---------|
| **No `error.tsx` or `loading.tsx`** | No error boundaries or loading states in the app directory. If a page throws, users see the default Next.js error page. |
| **Oversized game components** | HomesteadGame (3698 lines), HomesteadWars (2907), FarmDefense (2764), ZoesAdventure (2065). These work but are hard to maintain. Consider extracting game logic, rendering, and input handling into separate modules. |
| **Duplicated game utilities** | Canvas DPR setup, particle systems, score submission, and `drawPixelRect` are copy-pasted across game files. Extract into `src/lib/gameUtils.ts`. |
| **All pages are client components** | Every page uses `"use client"`. Static pages like `/details` could be server components with client islands only around animated elements. |
| **No per-page metadata** | All pages inherit root metadata. Add page-specific titles (e.g., "RSVP - Matt & Brittany's Wedding", "Games - Matt & Brittany's Wedding"). |
| **Email validation is weak** | API uses `email.includes("@")` which accepts `a@b`. Use a proper regex or validation library. |
| **Input lengths not capped** | No max-length validation on `message`, `attendee_names`, `dietary_restrictions`. Large payloads could be submitted. |
| **Migration/schema drift** | `schema.sql` has the final schema but `migrate.ts` builds it incrementally with ALTERs. Keep both in sync. |
| **No OG image** | `openGraph` metadata lacks an `images` property. Social sharing shows no preview image. |

### Low Priority / Nice to Have

| Issue | Details |
|-------|---------|
| **Canvas games are inaccessible** | No ARIA labels, no keyboard controls, no alternative content. Inherent to Canvas, but basic labels and keyboard hints would help. |
| **No skip-to-content link** | Fixed nav means keyboard users tab through all nav links on every page. |
| **RSVP form label associations** | Inputs use placeholders without `<label htmlFor>` associations. |
| **Color contrast** | Some lighter colors (sage, lavender at low opacity) may not meet WCAG AA against cream backgrounds. |
| **Legacy CSS duplicates** | `.barn-red`, `.hay-gold` aliases and `.pixel-border*` classes duplicate other styles in `globals.css`. |
| **No `next/dynamic` for games** | Game pages import components directly. Using `next/dynamic({ ssr: false })` would skip SSR for canvas-only components. |
| **Framer Motion bundle size** | Full `framer-motion` (~40KB gzipped) ships on every page. The `motion/react` import path is lighter. |
| **JSON-LD structured data** | No Schema.org Event markup for search engines. Adding event date/location/organizer in JSON-LD would help discoverability. |
| **No unique constraint on email** | Multiple RSVPs can be created with the same email. Possibly intentional for families, but worth considering. |
| **Timestamps lack timezone** | Schema uses `TIMESTAMP` not `TIMESTAMPTZ`. Neon defaults to UTC so it works, but `TIMESTAMPTZ` is more explicit. |
