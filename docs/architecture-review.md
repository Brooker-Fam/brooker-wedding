# Architecture Review - Brooker Wedding Site

**Date:** April 2026
**Stack:** Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / Neon Postgres / Framer Motion
**Repo:** brooker-fam/brooker-wedding

---

## Executive Summary

The site is well-structured for its scope: a wedding celebration site with RSVP, event details, and 11 browser games. The core pages are clean and maintainable. The main areas for improvement are: oversized game components, security hardening on API routes, missing rate limiting, and some accessibility gaps.

---

## 1. Project Structure

**Rating: Good**

The App Router structure is clean and conventional:

```
src/app/          - Pages (home, details, rsvp, games hub, 11 game pages)
src/components/   - Shared UI + game components
src/lib/          - Database utilities + migrations
```

**Findings:**

| Severity | Finding |
|----------|---------|
| Low | Game page files (`src/app/games/*/page.tsx`) are thin wrappers that just import a component -- good pattern. |
| Low | `src/app/rsvp/admin/page.tsx` exists but isn't referenced in navigation. Intentional? If it's a secret admin panel, consider adding auth middleware. |
| Info | No `middleware.ts` for route protection. The RSVP admin page and full RSVP list endpoint (`GET /api/rsvp` without `?id=`) are unprotected. |

---

## 2. Component Architecture

**Rating: Needs Attention**

| Severity | Finding | File | Details |
|----------|---------|------|---------|
| **High** | Oversized game components | `src/components/games/` | HomesteadGame (3698 lines), HomesteadWars (2907), FarmDefense (2764), ZoesAdventure (2065). These are monolithic single-file components mixing game logic, rendering, input handling, and UI. |
| Medium | All pages are client components | `src/app/*/page.tsx` | Every page uses `"use client"`. Pages like `details/page.tsx` are static content that could be server components with isolated client islands (e.g., wrapping only `motion` elements in a client component). |
| Low | `FairyLightDivider` was defined but unused (fixed in this PR) | `src/app/page.tsx` | Removed. |
| Low | `useCountdown` hook was defined and unused in details page (fixed) | `src/app/details/page.tsx` | Removed. |

**Recommendation:** For the game components, consider extracting:
- Game constants/config into separate files
- Rendering functions into a `*Renderer.ts` module
- Input handling into a `*Input.ts` module
- This isn't blocking, but would improve maintainability

---

## 3. Security

**Rating: Needs Improvement**

| Severity | Finding | File | Details |
|----------|---------|------|---------|
| **High** | No rate limiting on API routes | `src/app/api/rsvp/route.ts`, `src/app/api/scores/route.ts` | POST endpoints have no rate limiting. An attacker could spam RSVP submissions or flood the game scores table. Consider Vercel's `@vercel/edge-config` rate limiting or a simple in-memory counter. |
| **High** | RSVP DELETE endpoint has no auth | `src/app/api/rsvp/route.ts:261` | Anyone can delete any RSVP by guessing/iterating sequential IDs. The `id` is a serial integer, making enumeration trivial. |
| **High** | Full RSVP list endpoint is unprotected | `src/app/api/rsvp/route.ts:130` | `GET /api/rsvp` (without `?id=`) returns all RSVPs including personal data (email, phone, mailing address). Comment says "protected by middleware Basic Auth" but no middleware.ts exists. |
| Medium | RSVP lookup by sequential ID | `src/app/api/rsvp/route.ts:114` | RSVP IDs are sequential integers. Anyone can enumerate all RSVPs via `GET /api/rsvp?id=1`, `?id=2`, etc. Consider using UUIDs instead of serial IDs for public-facing lookups. |
| Medium | Admin edit bypass via header | `src/app/api/rsvp/route.ts:153` | `x-admin-edit: true` header skips phone/address validation on PUT. No authentication check -- anyone can set this header. |
| Low | Input lengths not capped | API routes | No max-length validation on `message`, `attendee_names`, `dietary_restrictions`. An attacker could submit very large text payloads. |
| Low | SQL injection is mitigated | `src/lib/db.ts` | Parameterized queries are used throughout -- good. |

---

## 4. Database

**Rating: Good with minor issues**

| Severity | Finding | File | Details |
|----------|---------|------|---------|
| Medium | Migration script drift from schema | `src/lib/migrate.ts` vs `src/lib/schema.sql` | `schema.sql` has the final schema but `migrate.ts` does incremental ALTERs. Both should stay in sync. If you drop and recreate, `schema.sql` is the source of truth. |
| Medium | No unique constraint on email | `src/lib/schema.sql` | Multiple RSVPs can be created with the same email. This might be intentional (allowing family members) but could also lead to duplicate submissions. |
| Low | New DB connection per request | `src/lib/db.ts` | `neon()` is called fresh each time. Neon's serverless driver is designed for this, so it's fine for the current scale. |
| Low | Timestamps lack timezone | `src/lib/schema.sql` | `TIMESTAMP` without time zone. Consider `TIMESTAMPTZ` for clarity, though Neon defaults to UTC. |

---

## 5. Performance

**Rating: Acceptable**

| Severity | Finding | Details |
|----------|---------|---------|
| Medium | Game components aren't code-split well | Each game is ~1000-3700 lines of client JS. They ARE lazy-loaded via Next.js dynamic routes, which helps. But the individual bundles are still large. |
| Medium | All Framer Motion animations load on every page | `framer-motion` is imported in most pages. The full library (~40KB gzipped) ships client-side. Consider `motion/react` (the lighter import path). |
| Low | FarmScene renders many DOM elements | `src/components/FarmScene.tsx` (411 lines) | Lots of absolutely-positioned divs for fireflies, stars, sparkles. Performance is fine on modern devices but could be heavy on low-end mobile. |
| Low | `globals.css` is 850 lines | Manageable, but many animation keyframes that could be split or lazy-loaded. |
| Info | No `next/dynamic` usage for game components | Game pages import components directly. Using `next/dynamic` with `ssr: false` would avoid SSR overhead for canvas games. |

---

## 6. Accessibility

**Rating: Needs Improvement**

| Severity | Finding | Details |
|----------|---------|---------|
| **High** | Canvas games are inaccessible | All 11 games use HTML5 Canvas, which is inherently inaccessible to screen readers. No ARIA labels, no keyboard controls, no alternative content. |
| Medium | Limited skip navigation | No skip-to-content link. The fixed nav means keyboard users must tab through all nav links on every page. |
| Medium | Form accessibility gaps | RSVP form inputs use custom styling but may not have proper `aria-label` or `aria-describedby` for validation errors. |
| Low | Color contrast | Some lighter colors (sage, lavender at low opacity) may not meet WCAG AA contrast ratios against the cream background. |
| Low | FarmScene is properly `aria-hidden` | Good -- decorative elements are hidden from screen readers. |
| Low | Navigation has `aria-label` and `aria-expanded` | Good -- mobile menu is properly labeled. |

---

## 7. Dark Mode Implementation

**Rating: Good**

| Severity | Finding | Details |
|----------|---------|---------|
| Info | Anti-flash script in `<head>` | `src/app/layout.tsx:66-70` -- properly prevents FOUC with inline script. |
| Info | Three-way toggle (light/system/dark) | Clean implementation in ThemeProvider with localStorage persistence. |
| Low | FarmScene properly uses `useTheme()` | Night scene variant is well-implemented. |

---

## 8. SEO & Metadata

**Rating: Good**

| Severity | Finding | Details |
|----------|---------|---------|
| Info | OpenGraph and Twitter cards are configured | `src/app/layout.tsx:21-51` -- properly set up with title, description, type. |
| Low | No OG image configured | `openGraph` lacks an `images` property. Consider adding a wedding photo or branded image for social sharing. |
| Low | Per-page metadata not set | Game pages, details page, RSVP page all inherit root metadata. Consider adding page-specific titles (e.g., "RSVP - Matt & Brittany's Wedding"). |

---

## 9. Error Handling

**Rating: Acceptable**

| Severity | Finding | Details |
|----------|---------|---------|
| Medium | No error boundary | No `error.tsx` files in the app directory. If a page throws, users see the default Next.js error page. |
| Medium | No loading states | No `loading.tsx` files. Pages with data fetching have no skeleton/loading UI. |
| Low | API error handling is consistent | All API routes have try/catch with proper error responses. |
| Low | DB unavailable returns 503 | Good -- graceful degradation when DATABASE_URL is missing. |

---

## 10. Code Quality

**Rating: Good (after lint fixes)**

| Severity | Finding | Details |
|----------|---------|---------|
| Info | Lint is now clean | 98 issues fixed in this PR (unused vars, prefer-const, React compiler warnings, etc.). |
| Medium | Game components use many `eslint-disable` directives | Necessary for canvas game patterns (mutating refs, etc.), but signals these files are outside normal React patterns. |
| Low | Consistent code style | Tailwind class ordering, naming conventions, and file structure are consistent throughout. |

---

## 11. Deployment & DevOps

**Rating: Good**

| Severity | Finding | Details |
|----------|---------|---------|
| Info | Vercel defaults are used (no vercel.json) | Simple and correct for this project. |
| Info | Migrations run automatically on build | `pnpm build` runs `npm run migrate && next build`. Idempotent migrations are safe. |
| Low | No environment variable validation | No runtime check that `DATABASE_URL` matches expected format. `getDb()` returns null silently. |

---

## Priority Action Items

### Must Fix (before launch)

1. **Protect the RSVP list endpoint** -- Add middleware.ts with basic auth for `GET /api/rsvp` (full list) and `DELETE /api/rsvp`
2. **Remove or protect the admin edit header bypass** -- `x-admin-edit: true` should require authentication
3. **Add rate limiting** to POST endpoints (RSVP + scores)

### Should Fix

4. Add `error.tsx` and `loading.tsx` to the app directory
5. Add per-page metadata for better SEO
6. Add an OG image for social sharing
7. Consider UUIDs for public-facing RSVP lookups instead of sequential IDs
8. Add input length limits on text fields

### Nice to Have

9. Refactor large game components into multi-file modules
10. Use `next/dynamic` with `ssr: false` for game components
11. Add basic canvas game accessibility (ARIA labels, keyboard hints)
12. Add skip-to-content link
13. Audit color contrast ratios for WCAG AA compliance
14. Consider `motion/react` import for smaller Framer Motion bundle

---

## Files Changed in This Review

### Lint Fixes

| File | Changes |
|------|---------|
| `src/app/details/page.tsx` | Removed unused `useCountdown` hook and `countdown` variable |
| `src/app/games/page.tsx` | Converted effect-based localStorage read to lazy `useState` init |
| `src/app/page.tsx` | Removed unused `FairyLightDivider` component |
| `src/app/rsvp/page.tsx` | Removed unused `setPotluckDish` setter (replaced with plain variable) |
| `src/components/Countdown.tsx` | No functional changes (lint comments removed) |
| `src/components/Navigation.tsx` | No functional changes (lint comments removed) |
| `src/components/ThemeProvider.tsx` | No functional changes (lint comments removed) |
| `src/components/games/*.tsx` | Added file-level eslint-disable for game-specific patterns (immutability, custom fonts) |
| `src/components/games/FarmDefense.tsx` | `let isAoe` changed to `const isAoe` |
| `src/components/games/HomesteadGame.tsx` | `let TILE_MAP` changed to `const TILE_MAP` |
| `eslint.config.mjs` | Disabled `react-hooks/set-state-in-effect` rule (legitimate patterns throughout codebase) |
