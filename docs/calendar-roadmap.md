# Calendar Roadmap

Living doc for the `/calendar` family-organizer feature. Not a ship list — a menu.

Keep this opinionated: if an idea belongs somewhere else (Cozi, Google Calendar, a real product), note that and move on.

---

## Status

### Built
- `/calendar` page, `/calendar/admin` protected route
- Tasks: CRUD via `/api/calendar/tasks` (GET/POST/PUT/DELETE)
- Task completion: `/api/calendar/complete`
- Members: `/api/calendar/members` + seed
- Components: `CalendarHeader`, `TaskCard`, `TaskForm`
- DB: `household_members`, `tasks` tables in `src/lib/calendar/db.ts`
- Fields already in schema but unused in UI: `recurrence_rule`, `points`, `priority`, `duration_minutes`

### Shipped outside calendar
- PostHog analytics (autocapture + session replay + server exceptions)
- RSVP, songs, Spotify, game leaderboards

---

## Short list (next up)

Ordered by leverage-per-hour for a family of 4.

1. **Points scoreboard** — data already exists; just needs a view.
   Add `/calendar/scoreboard` showing each member's points earned this week / month / all-time. Query `task_completions JOIN household_members` grouped by member. ~30 min.

2. **Recurring tasks UI** — `recurrence_rule` column exists, nothing spawns instances.
   - Add a "Repeat" dropdown in `TaskForm`: none / daily / weekly / weekdays / custom
   - Add a worker (Vercel cron) that wakes nightly and inserts the next instance when the previous is completed or the date rolls over
   - Store rule as RFC-5545 RRULE string (`FREQ=WEEKLY;BYDAY=MO,WE,FR`) so we can swap libs later
   - Don't build a recurrence calendar view yet — just spawn-on-completion and show the next occurrence

3. **Glanceable display mode** — `/calendar/display` route optimized for a wall-mounted iPad.
   Big fonts, today's agenda, active chores, next 3 events, time & weather. No auth required (local-network only?). This replicates the $200 Skylight frame for $0 using any old tablet.

4. **Google Calendar two-way sync** — the one thing every family actually needs.
   OAuth flow → store refresh token per member → pull events into a `google_events` table, write task completions / events back. Use `googleapis` npm package. Non-trivial (webhook watch channels for real-time, or poll every 15min). Estimated 4-6 hrs including edge cases (deletions, recurring Google events, timezone).

5. **AI chat intake** — the 2026 killer feature.
   Single text box: *"Emmett has soccer Tuesdays at 5 starting next week."* → Claude extracts `{title, assigned_to, due_date, recurrence, duration}` → creates task. Also accept photo uploads (multimodal) of paper school flyers and camp schedules. Use `@anthropic-ai/sdk` with tool use.

---

## Longer list (maybe)

### Features
- **Weekly planning view** — Sunday night drag-and-drop planner (Monday..Sunday columns, drag tasks between days)
- **Meal planner** — weekday grid + ingredients auto-flow to shopping list
- **Shopping list** — shared, real-time, checkable, one row per item with who added it
- **Day/week/month toggle** — currently one view; add tabs
- **Kid-friendly view** — `/calendar/kid/[name]` with huge emoji buttons, just their chores/tasks, big satisfying checkmark animations. Sapphire (8) and Emmett (11) need different vibes.
- **Reminders** — push or SMS for tasks with `due_time`. Use `web-push` for browser push (free, cross-platform) or Twilio for SMS.
- **Task dependencies** — "can't do B until A is done." Probably overkill for a family; skip unless explicitly useful.
- **Shared notes** — per-household scratchpad for things that aren't tasks (WiFi password, vet's number, etc.)
- **Grocery receipt import** — snap a photo of a receipt → AI extracts items → adds to shopping history. Novelty > utility.

### Integrations
- **Google Calendar** — see #4 above. Required.
- **Apple / iCloud Calendar** — `.ics` one-way export is cheap; two-way is a CalDAV mess. Skip two-way.
- **Alexa skill** — cool idea but Amazon's certification process is a slog and Alexa is a declining platform. Defer unless Matt actually wants to use it. Simpler path: if we get AI chat working, an Alexa skill that proxies to our chat endpoint is ~100 lines.
- **Google Home / Nest Hub** — same story as Alexa.
- **MCP server** — expose `create_task`, `list_tasks`, `complete_task`, `get_scoreboard` as MCP tools so Matt & Brit can manage the household from any Claude conversation. Thin wrapper around existing API. Bearer-token auth. 1-2 hrs.
- **Email ingest** — `inbox@brooker.family` with Resend/Postmark inbound webhook → Claude extracts events → creates tasks. Maple and Hearth's killer feature.
- **SMS ingest** — Twilio number that accepts texts & photos, same pipeline as email. Probably redundant with AI chat in the web UI.
- **Weather widget** — NWS API is free; 10 lines on the display mode.
- **Spotify "morning playlist"** — already have Spotify OAuth; bonus chrome for display mode.

### Polish / infra
- **Multiple households** — skip. This is our family; anyone else can fork it.
- **Permissions / ACL** — skip, we trust each other. Admin mode gate is enough.
- **Mobile PWA install** — add `manifest.json` + install prompt. ~30 min. Good ROI.
- **Offline** — service worker for read-only offline view. Lower priority.
- **End-to-end encryption** — skip. Neon Postgres is fine for chore lists.

---

## Competitive research summary (April 2026)

Full report archived below. Key takeaways:

- **Skylight Calendar** ($150–$600 hardware + $79/yr Plus) is mostly valuable as a **glanceable always-on display**. A wall-mounted iPad running `/calendar/display` replicates it for $0.
- **Hearth Display** ($600 + $86/yr) won Time Best Invention 2023 for one feature: text a photo of a school flyer, it extracts events. Tractable for us with Claude multimodal.
- **Cozi** is the incumbent app ($39/yr Gold). UI feels 2015. Its superpower is trust from 15 years of reliability; not something we can steal.
- **Google Family Calendar** + **Apple Family Sharing** are free and already work. We have to be better than "shared calendar" to be worth using.
- **Maple / Gether / Sense** (2024-2026) are all betting on the same thesis: **email/flyer/SMS → calendar event via LLM.** That's the moat.
- **Skylight Calendar 2** (CES 2026) is repositioning as "AI that merges chaotic family inputs into one view."

### Theft list (what to build)
1. Two-way Google Calendar sync (table stakes)
2. Per-person color lanes (Skylight's best visual)
3. AI chat + photo intake (the 2026 killer feature)
4. Wall-mount display mode (kills Skylight's hardware advantage)
5. Chores with rotation + streaks (Skylight copied this from kids' chore charts; we can too)
6. Shopping list auto-filled from meal planner
7. Enchanted-forest theming matched to `brooker.family` (our actual differentiator)
8. PWA install prompt (bypass app stores)

### Skip list (what not to build)
- Geofencing / location tracking
- Built-in messaging (iMessage exists)
- Native mobile apps (PWA is enough)
- Multi-family sharing
- Subscription tiers, paywalls, analytics funnels
- Full permissions system

---

## Notes

- Tech stack constraints: Next.js 16, Postgres (Neon), Vercel. Avoid anything that needs a long-running process; prefer Vercel cron + edge functions.
- The wedding is **June 27, 2026**. The calendar tool is for us to use indefinitely after, so optimize for years-of-use not party-day polish.
- PostHog is wired up — watch session replays when we ship something to see what actually gets used.
