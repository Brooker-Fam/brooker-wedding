# Calendar Roadmap

Living doc for the `/calendar` family-organizer feature. Not a ship list — a menu.

Keep this opinionated: if an idea belongs somewhere else (Cozi, Google Calendar, a real product), note that and move on.

---

## Status (updated April 17, 2026)

### Shipped

| Feature | Route / files | Notes |
|---------|---------------|-------|
| Calendar MVP | `/calendar`, `/calendar/admin` | Day/week toggle, task CRUD, member legend |
| Day/week view toggle | `CalendarHeader`, `CalendarView` | Keyboard shortcuts (d/w/t/arrows), persisted in localStorage |
| Task completion | `/api/calendar/complete` | Anyone can check off; "who did it?" picker for unassigned tasks |
| Points scoreboard | `/calendar/scoreboard` | Week / month / all-time tabs, bar chart, medals |
| Recurring tasks | `TaskForm` dropdown + materialize-on-read | FREQ=DAILY, WEEKLY, WEEKDAYS, BIWEEKLY, MONTHLY. TO_CHAR fix for Neon date types |
| Kid views | `/calendar/kid/emmett`, `/calendar/kid/sapphire` | Themed (Viking / fairy princess), confetti, big tap targets, auto-refresh |
| Glanceable display | `/calendar/display` | Dark mode, clock, weather, wake lock, tasks + events grouped by person |
| Google Calendar sync | OAuth + incremental sync via syncToken | Two-way read, auto-assign by keyword rules, event completions feed scoreboard |
| PWA install | `manifest.json` + `InstallPrompt` | Android native prompt, iOS "Show me how" step-by-step, Safari detection |
| MCP server | `/api/[transport]` | OAuth shim, task CRUD tools |
| PostHog analytics | Client autocapture + server exceptions | Proxied through `/ingest/*` rewrite |
| Time-sorted views | `sortedItemsForDay()` | Events + tasks interleaved by start time in both day and week views |
| Points redemption / cash-out | `point_redemptions` table, `CashOutModal`, scoreboard "Cash out" button | Balance column = earned − redeemed; preset rewards (allowance, screen time, treats) |
| Streaks | `🔥 N` badge on scoreboard | Consecutive days with ≥1 completion, computed via window fn in `getScoreboard` |
| Activity feed | `/api/calendar/activity`, `ActivityFeed` component | UNION of task + event completions + redemptions on scoreboard page |
| Event countdowns | `/calendar/display` countdown blocks | Auto-picks milestones (trip/camp/birthday/all-day) within 120 days, dedups by title |

### Known issues
- Display mode weather uses hardcoded lat/lng (Greenwich, NY)
- No offline support (service worker)
- No push notifications / reminders

---

## Next up

Ordered by leverage-per-hour. Checked items are done.

### Quick wins (< 2 hrs each)
- [x] **Points redemption / cash-out** — shipped
- [x] **Streaks** — shipped
- [x] **Activity feed** — shipped
- [x] **Event countdowns** — shipped

### Medium (2-6 hrs)
- [ ] **AI chat intake** — Text box: "Emmett has soccer Tuesdays at 5 starting next week" → Claude extracts task fields → creates. Photo/flyer upload via multimodal. The 2026 killer feature per competitive research.
- [ ] **Chore rotation** — Auto-assign recurring tasks to different members each cycle (e.g., dishes alternates Matt → Brittany → Emmett).
- [ ] **Shopping list** — Shared, real-time, checkable list. `/calendar/list` or standalone.
- [ ] **Reminders** — Web push for tasks with `due_time`. Use `web-push` npm (free, cross-platform).

### Bigger builds (6+ hrs)
- [ ] **Meal planner** — Weekday grid + ingredients auto-flow to shopping list.
- [ ] **Email ingest** — `inbox@brooker.family` with inbound webhook → Claude extracts events → creates tasks. Maple/Hearth's killer feature.
- [ ] **Alexa skill** — If AI chat works, Alexa skill proxies to chat endpoint (~100 lines). Amazon certification is the bottleneck, not code.

---

## Competitive landscape (April 2026)

### Skylight Calendar ($320–$600 + $79/yr)
- 15"/27" touchscreen wall display. Requires hardware purchase.
- Color-coded family members, chore charts with stars, shared lists.
- Two-way sync with Google only. Apple/Outlook are one-way.
- Magic Import: forward emails/PDFs → auto-parse events.
- Calendar 2 (early 2026): faster, brighter, Snap Frames, fridge photo recipes.
- **What we stole:** Display mode, chore points, per-person color lanes, PWA (kills hardware lock-in).
- **What's left to steal:** Email forward intake, event countdowns, recipe suggestions.

### Hearth Display ($600 + $86/yr)
- Time Best Invention 2023 for "text a photo of a school flyer" → events.
- **Stealable:** Photo/flyer → events via Claude multimodal. Same concept, better AI.

### Cozi (free / $39yr Gold)
- 15-year incumbent. Trust is the moat. UI feels 2015.
- Shared calendar, shopping lists, meal planner, family journal.
- **Stealable:** Shopping list, meal planner. Not urgent.

### Maple / Gether / Sense (2024-2026 startups)
- All betting on email/flyer/SMS → calendar event via LLM.
- **Thesis we share:** The input problem is the hard part. Structured calendar is the easy part.

### Skip list
- Geofencing / location tracking — privacy minefield
- Built-in messaging — iMessage exists
- Native mobile apps — PWA is enough
- Multi-family / subscription tiers — this is our family, not a product
- Full permissions / ACL — admin gate is enough

---

## Architecture notes

- **Stack:** Next.js 16, Neon Postgres, Vercel. No long-running processes; use cron + edge functions.
- **Data model:** `tasks` (manual chores) and `calendar_events` (Google mirror) are separate tables. Both feed a unified scoreboard via `WITH all_completions AS (... UNION ALL ...)`.
- **Recurrence:** Hand-rolled RRULE parser in `src/lib/calendar/recurrence.ts`. Materialize-on-read in `db.ts` creates rows for each occurrence. Intentionally avoids rrule.js for bundle size.
- **Google Calendar:** OAuth tokens stored AES-256-GCM encrypted in `google_config`. Incremental sync via `syncToken`. Events auto-assigned by keyword rules in `event-rules.ts`.
- **The wedding is June 27, 2026.** The calendar is for indefinite family use after. Optimize for years, not party-day polish.
- **PostHog is live** — watch session replays to see what gets used before building more.
