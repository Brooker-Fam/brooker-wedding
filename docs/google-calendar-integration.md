# Google Calendar Integration Plan

Living design doc for pulling Google Calendar events (TKD, drama club, school, etc.) into `/calendar`. Written before implementation so we can argue about direction before writing code.

Companion to `docs/calendar-roadmap.md` — that doc lists Google sync as item #4 on the short list; this one explains _how_.

**Status:** design review complete (answers from Matt captured inline). Ready to build.

---

## Known constraints (from Matt)

- **One calendar, one account.** The family schedule lives in a single Google Calendar named **"Brooker Kids"** on **`rockwrestlerun@gmail.com`**. We connect that account and sync that calendar. No work calendar, no per-member calendars.
- **Events show in kid views.** `/calendar/kid/[name]` must render Google events alongside chores.
- **Events can earn points.** Showing up to TKD, drama club, etc. counts toward the scoreboard. This changes the data model — see [Points for events](#points-for-events).
- **Per-event assignment.** Default: everyone. Override per event (e.g. drama club → Emmett). Affects scoreboard credit and which events show on which kid view.
- **All events visible to all kids.** No visibility/privacy filtering needed in v1.

---

## Goal

Matt and Brit already maintain their real schedule in Google Calendar. Retyping "Emmett TKD Tuesdays at 5" into this app is a non-starter — if the app isn't a superset of what Google already shows, nobody opens it.

**What we actually want, in order:**

1. See Google Calendar events (TKD, drama club, soccer, school closures, doctor appts) on `/calendar` next to our own tasks/chores.
2. Keep Google Calendar as the system of record for events. If Brit moves TKD in Google, it moves in our app. No confusion about "which one is right."
3. Preserve the thing our app does that Google doesn't: chores, points, assignment to a specific kid, completion tracking.

**Non-goals for v1:**

- Creating/editing events in our app that sync back to Google. (We can revisit, but see [One-way vs two-way](#one-way-vs-two-way) below.)
- Multiple Google accounts per household. One account (`rockwrestlerun@gmail.com`), one calendar ("Brooker Kids").
- CalDAV / iCloud / Outlook. Google only.
- Real-time push notifications from Google. Polling is fine.
- Per-event visibility rules (private/hidden-from-kids). Everyone sees everything.

---

## One-way vs two-way

**Decision: start one-way, Google → app, read-only on our side.**

Reasons:

- **Source of truth is unambiguous.** If we let users edit a Google event inside our UI, we have to reconcile concurrent edits (Brit edits in Google Cal app on her phone, kid edits on `/calendar/kid/sapphire` at the same time). That's a nontrivial CRDT / last-write-wins dance.
- **90% of the value is in the read path.** Matt said it: "really I just want to be able to pull TKD, drama club, etc." Building two-way doubles the work for maybe 10% more value.
- **We already have a write path for our own stuff.** Tasks created in `/calendar/admin` stay in our DB. They just don't appear in Google. That's fine — tasks aren't events.

**Events vs tasks — the mental model:**

| Concept   | Source          | Lives in                  | Earns points?       | Example                      |
| --------- | --------------- | ------------------------- | ------------------- | ---------------------------- |
| **Event** | Google Calendar | Google (mirror in our DB) | Yes, if we set them | Emmett TKD, Tues 5pm (+5 pts for showing) |
| **Task**  | Our app         | Our DB                    | Yes                 | Take out trash, feed Zoe     |

We already distinguish these implicitly via `tasks.source`: `'manual'` vs `'google'`. The plan is to **stop conflating them**. Events get a new `calendar_events` table; chores stay in `tasks`. Both render on the same calendar grid and both feed the scoreboard.

**Rule of thumb:** if Google created it, it's an event (even if it earns points). If Matt created it in `/calendar/admin`, it's a task. Don't migrate one into the other on ingest.

**Two-way sync — the path if we ever want it:**

- Add a "Create in Google Calendar" checkbox to `TaskForm`.
- When checked, we call `events.insert` and store the returned `id` on our task row.
- Updates/deletes on our side replay to Google.
- We still pull Google as the source of truth; our own pushes are just a convenience.
- **Never let users edit a Google-sourced event in our UI.** If they want to reschedule TKD, they do it in Google.

Defer this until someone actually asks.

---

## Auth model

**Decision:** Matt connects `rockwrestlerun@gmail.com` once via OAuth from `/calendar/admin`. We store the refresh token server-side, encrypted. No per-member OAuth, no public-calendar API-key shortcut.

Rejected alternatives (kept for context in case they resurface):

- **Public calendar + API key** — would require making "Brooker Kids" a public calendar. Cheap but irreversible-ish (calendar URL leaks). Not worth it to save one OAuth flow.
- **Per-member OAuth** — kids don't own the TKD event, Brit does. Overkill for this family.

### OAuth mechanics

- Use the official `googleapis` npm package (Google's own client, ~2MB but tree-shakeable).
- Scopes: `https://www.googleapis.com/auth/calendar.readonly` only. Upgrade to `calendar.events` when we do two-way.
- Redirect URI: `https://brooker.family/api/calendar/google/callback` (and localhost equivalent for dev).
- Store `access_token`, `refresh_token`, `expiry_date` encrypted in a new `google_oauth_tokens` table (or reuse the `spotify_config` pattern with a different key prefix).
- Encrypt with `CALENDAR_ENCRYPTION_KEY` env var. **Do not commit the key.**

Env vars needed:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://brooker.family/api/calendar/google/callback
CALENDAR_ENCRYPTION_KEY=...   # 32-byte random
```

---

## Data model

### New table: `calendar_events`

Keep events separate from `tasks`. Events are immutable-from-our-side mirrors; tasks are first-class editable.

```sql
CREATE TABLE calendar_events (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,

  -- Google identity
  google_calendar_id VARCHAR(255) NOT NULL,   -- which calendar it came from
  google_event_id VARCHAR(255) NOT NULL,      -- id within that calendar
  ical_uid VARCHAR(255),                       -- stable across recurring instances + moves between cals
  etag VARCHAR(255),                           -- for conditional updates

  -- Event fields (mirrored from Google)
  title VARCHAR(500) NOT NULL,
  description TEXT,
  location TEXT,
  start_at TIMESTAMPTZ NOT NULL,               -- UTC
  end_at TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  timezone VARCHAR(64),                         -- IANA, e.g. "America/New_York"

  -- Recurrence
  recurrence_rule TEXT,                         -- RRULE string for the series master
  recurring_event_id VARCHAR(255),              -- points to the series master for expanded instances
  original_start_at TIMESTAMPTZ,                -- for modified instances of a series

  -- Our additions
  assigned_to INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
                                                -- who owns this event; NULL = everyone
  color_override VARCHAR(7),                    -- if we want to override Google's color
  points INTEGER NOT NULL DEFAULT 0,            -- points awarded for attendance
  auto_award BOOLEAN NOT NULL DEFAULT FALSE,    -- auto-credit on event end, or require tap?

  -- Lifecycle
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed',  -- 'confirmed' | 'tentative' | 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (google_calendar_id, google_event_id)
);

CREATE INDEX idx_calendar_events_household_start ON calendar_events(household_id, start_at);
CREATE INDEX idx_calendar_events_assigned ON calendar_events(assigned_to);
```

### New table: `google_calendars`

One row per Google Calendar we sync. Lets us opt in/out per-calendar from the admin UI.

```sql
CREATE TABLE google_calendars (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  google_calendar_id VARCHAR(255) NOT NULL,    -- e.g. "brooker.family@gmail.com"
  summary VARCHAR(255) NOT NULL,                -- display name
  color VARCHAR(7),                             -- Google's background color
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_to INTEGER REFERENCES family_members(id) ON DELETE SET NULL,
                                                -- default member for events from this calendar
  sync_token TEXT,                              -- for incremental sync
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (household_id, google_calendar_id)
);
```

### Tokens table

```sql
CREATE TABLE google_oauth_tokens (
  id SERIAL PRIMARY KEY,
  household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (household_id)    -- one token set per household for v1
);
```

### New table: `event_completions`

Parallel to `task_completions`. Records which member attended / earned credit for an event instance. Kept separate rather than making `task_completions` polymorphic — cleaner, easier to query, easier to roll back.

```sql
CREATE TABLE event_completions (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  completed_by INTEGER NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (event_id, completed_by)
);

CREATE INDEX idx_event_completions_event ON event_completions(event_id);
CREATE INDEX idx_event_completions_member_date ON event_completions(completed_by, completed_date);
```

### What about `tasks.google_event_id`?

Leave it. It's already there and is how we'll mark a task that was _created from_ a Google event (if we ever decide to auto-promote events to chores). For v1 it stays null for all Google-sourced rows because those rows live in `calendar_events`, not `tasks`.

---

## Sync strategy

Google's API supports two sync modes:

### Incremental sync (preferred)

1. First call: `events.list(calendarId)` with `timeMin = now - 30d`. Google returns a `nextSyncToken`.
2. Subsequent calls: pass `syncToken` — Google returns only changes since last call.
3. If Google returns `410 Gone`, our token expired. Reset to full sync.

Store `sync_token` per calendar in `google_calendars.sync_token`.

### Polling cadence

- Vercel cron (`/api/calendar/google/sync`) every **15 minutes**.
- On-demand refresh button in `/calendar/admin` that hits the same endpoint.
- Lazy trigger: when `/calendar` loads and last sync was > 15min ago, fire-and-forget a sync call.

**Push notifications (watch channels)** — Google can POST to a webhook when a calendar changes. Overkill for v1 — 15min polling is fine and avoids a webhook reliability story. Revisit if the family complains about latency.

### Recurring events

Google returns recurring events in one of two shapes:

1. **Series master**: has `recurrence` (RRULE array), no `originalStartTime`.
2. **Expanded instance**: returned when you pass `singleEvents=true` to `events.list`. Each instance is its own row with a unique `id` and a `recurringEventId` pointing to the master.

**Decision: use `singleEvents=true`** and store each instance as its own row in `calendar_events`. That's what Google recommends for display-oriented apps, and it mirrors what we already do with recurring tasks (see `materializeRecurringInstances` in `src/lib/calendar/db.ts`).

Trade-off: a 4x-weekly recurring event for a year = 200+ rows. Fine at our scale. Good because modified/deleted instances are handled natively — Google returns them with `status: cancelled` or differing fields, and we just upsert.

### Deletions

When `singleEvents=true`:

- Google sends the event with `status: 'cancelled'`.
- We either delete the row or soft-delete by setting `status = 'cancelled'` and filtering it out of reads. Prefer soft-delete for audit trail + reversibility.

### Timezones

Google events have a timezone. Store `start_at` / `end_at` in UTC (`TIMESTAMPTZ`), preserve the original IANA tz in a `timezone` column. Render in the household's local time (hardcoded to `America/New_York` for v1 — we live on the farm).

### All-day events

Google returns them with `start.date` instead of `start.dateTime`. Store as `all_day=true` with `start_at` pinned to midnight household-local.

---

## Points for events

Events can award points when the assigned kid (or anyone, if unassigned) checks in. Mechanics:

- **Configuring points.** Admin sets `points` per event series via keyword rules: "events with title containing 'TKD' → 5 pts, assigned to Emmett." Stored in a small `event_rules` config (defer the UI; start with hardcoded rules in `src/lib/calendar/event-rules.ts`).
- **Rule application timing.** Rules evaluate on ingest — when a new event is upserted from Google, we look up matching rules and set `points` + `assigned_to` on the row. Re-ingest is idempotent.
- **Completion UX.** On the event detail modal and on kid views, show a "✓ I went" button for the assigned kid. Tap → inserts into `event_completions`.
- **Auto-award (future).** If `auto_award = true`, a cron credits the points at event end time. Useful for standing commitments. Defer to v2.
- **Retroactive awarding.** Marking attendance is allowed for past events — the scoreboard re-aggregates next read.

### Scoreboard changes

Existing `getScoreboard()` in `src/lib/calendar/db.ts` sums from `task_completions`. Needs to UNION in `event_completions`:

```sql
SELECT fm.id, fm.name, ...
  SUM(combined.points_earned) AS total
FROM family_members fm
LEFT JOIN (
  SELECT completed_by, completed_date, points_earned FROM task_completions
  UNION ALL
  SELECT completed_by, completed_date, points_earned FROM event_completions
) combined ON combined.completed_by = fm.id
WHERE fm.household_id = ...
GROUP BY fm.id, ...
```

Week / month / all-time windows work unchanged since both tables have `completed_date` + `points_earned` in the same shape.

---

## Member / calendar mapping

**The core UX question: whose event is this?**

Since there's only one "Brooker Kids" calendar, per-calendar default assignment doesn't help — everything comes from the same place. We need per-event assignment.

Approach:

1. **Keyword rules on ingest** (ship in v1). Short JSON config maps title patterns → member + points. Example:
   ```ts
   [
     { match: /TKD|taekwondo/i, assigned_to: "Emmett", points: 5 },
     { match: /drama club/i,     assigned_to: "Emmett", points: 5 },
     { match: /soccer/i,          assigned_to: "Sapphire", points: 5 },
   ]
   ```
   Lives in `src/lib/calendar/event-rules.ts`. Editing is a code change for now; move to DB-backed + admin UI when the list grows past ~10 entries.
2. **Manual override in admin** (ship in v1). Click an event, pick a member, set points. Stored in `calendar_events.assigned_to` / `points`. Survives re-sync because upsert preserves non-null local fields (see [Upsert rules](#upsert-rules)).
3. **LLM classification** (future). "Claude, who is this event for?" — good fallback for events that don't match any keyword rule. Defer.

### Upsert rules

When re-ingesting an event, we have to decide which fields Google owns vs which we own:

| Field                       | Owner  | On re-sync                            |
| --------------------------- | ------ | ------------------------------------- |
| `title, description, times` | Google | Overwrite                             |
| `status, etag`              | Google | Overwrite                             |
| `assigned_to`               | Us     | Keep if set; otherwise apply rules    |
| `points`                    | Us     | Keep if set; otherwise apply rules    |
| `color_override`            | Us     | Keep                                  |

Implementation: `INSERT ... ON CONFLICT (google_calendar_id, google_event_id) DO UPDATE SET title = EXCLUDED.title, ... — but NOT assigned_to/points/color_override.`

---

## API surface

New endpoints under `/api/calendar/google/`:

| Method | Path                                    | Purpose                                     |
| ------ | --------------------------------------- | ------------------------------------------- |
| GET    | `/api/calendar/google/connect`          | Redirect user to Google OAuth consent       |
| GET    | `/api/calendar/google/callback`         | OAuth redirect handler; stores tokens       |
| POST   | `/api/calendar/google/disconnect`       | Revoke token, delete rows (keep events? TBD) |
| GET    | `/api/calendar/google/calendars`        | List calendars available on connected account |
| PATCH  | `/api/calendar/google/calendars/:id`    | Toggle `enabled`, set `assigned_to`         |
| POST   | `/api/calendar/google/sync`             | Trigger sync (cron + manual)                |
| GET    | `/api/calendar/events`                  | Query events for a date range (used by CalendarView) |
| PATCH  | `/api/calendar/events/:id`              | Update our own fields (assigned_to, color_override) |

### Updates to existing endpoints

- `GET /api/calendar/tasks` — extend response to include events alongside tasks, OR keep separate and have the UI call both. **Keep separate.** Tasks and events have different shapes; one endpoint shouldn't do both.

### Vercel cron

Add to `vercel.json` (we don't have one yet — this becomes a reason to create it):

```json
{
  "crons": [
    { "path": "/api/calendar/google/sync", "schedule": "*/15 * * * *" }
  ]
}
```

The sync endpoint must be idempotent and respond in < 10s (Vercel cron timeout). If sync takes longer, either paginate per-calendar or move to a background queue (QStash, Inngest). Start synchronous; upgrade if it breaks.

---

## UI changes

### `/calendar` (public view)

- Current: tasks only, colored by assignee.
- New: events rendered alongside tasks. Events get a visual treatment distinct from chores (gradient band, clock icon, location line).
- Events with `points > 0` show a points badge and a ✓ affordance for the assigned kid.
- Click an event → modal showing title, time, location, description, "Open in Google Calendar" link.
- No edit/delete affordances for events outside admin.

### `/calendar/kid/[name]`

- Must render Google events, not just chores.
- Filter: events where `assigned_to = this_kid` OR `assigned_to IS NULL` (everyone).
- Big ✓ button for point-earning events the kid attended.
- Same giant-emoji treatment as tasks today.

### `/calendar/admin`

New section: "Google Calendar"

- If not connected: "Connect Google Calendar" button → `/api/calendar/google/connect`.
- If connected:
  - Shows connected account (`rockwrestlerun@gmail.com`) + list of accessible calendars.
  - "Brooker Kids" is the only one toggled on by default.
  - "Last synced: 3 minutes ago" + "Sync now" button.
  - Per-event override: click an event in the list → set assignee / points.
  - Link to edit keyword rules (opens `src/lib/calendar/event-rules.ts` guidance or, later, a UI).
  - "Disconnect" button.

### `/calendar/display` (wall iPad)

- Today's events prominently at the top.
- Upcoming 3 events in the "next up" lane.

### `CalendarView` component changes

- Accept an `events` prop alongside `tasks`.
- When fetching, call `/api/calendar/tasks` and `/api/calendar/events` in parallel.
- Merge into the same day-buckets keyed by local date.
- Sort within a day: all-day events → timed events by start → tasks by priority.

---

## Edge cases & gotchas

- **Clock skew on Vercel serverless** — don't rely on `Date.now()` for token expiry decisions by a margin of seconds. Refresh if expiry < now + 5min.
- **Invalid sync token** → wipe rows for that calendar, full resync.
- **Event moved to a different calendar** — Google issues a cancellation on the old, a create on the new. Handled automatically by our upsert logic keyed on `(google_calendar_id, google_event_id)`.
- **Event moved between calendars we don't sync** — appears as a cancellation from our perspective. Fine.
- **Private events** (visibility=private) — still returned if the connected account has access. No special handling, but we might want to mask the title in the kids' views. Defer.
- **Attendees / RSVPs** — ignore in v1. We don't care who else is invited to Brit's meeting.
- **Reminders** — defer. Google's reminders are per-user; we don't want to double-notify.
- **Attachments, conferencing data, colors from Google** — ignore in v1. Use our own per-calendar color.
- **`calendar_events` table drift when user changes `google_calendars.assigned_to`** — new assignment applies to _new_ ingested events; existing rows keep whatever they had. Add a "Re-assign all existing events from this calendar" button in admin if useful.
- **Deleting the connection** — prompt: "Keep synced events as read-only history, or delete all?" Default: keep.
- **Webhook signing if we later add push** — verify `X-Goog-Channel-Token` we set at subscription time.

---

## Security

- OAuth tokens are the crown jewels — encrypt at rest with AES-256-GCM using `CALENDAR_ENCRYPTION_KEY`. Never log them, never return them to the client.
- The `/api/calendar/google/sync` endpoint is cron-triggered; protect with `CRON_SECRET` env var (Vercel's convention) checked in the route handler. Also allow authenticated admin-user calls.
- The admin flow (`/api/calendar/google/connect`) must require whatever auth `/calendar/admin` already has. Anyone can otherwise swap our token.
- `state` param in OAuth flow to prevent CSRF. Store a short-lived nonce in a signed cookie.
- Validate redirect URI matches `GOOGLE_REDIRECT_URI` exactly.

---

## Phased rollout

**Phase 0 — migrations & scaffolding (30min)**

- Add tables (`google_oauth_tokens`, `google_calendars`, `calendar_events`) to `src/lib/migrate.ts`.
- Add env vars to Vercel dashboard + local `.env`.
- Install `googleapis`.

**Phase 1 — OAuth + one-shot read (2h)**

- `/api/calendar/google/connect` + `/callback` routes.
- Encrypted token storage helpers.
- Admin UI connect button.
- Hardcoded single-calendar read that dumps events to console. No DB writes yet.

**Phase 2 — persist + render (2h)**

- List calendars, let admin enable the ones they want.
- First full sync writes to `calendar_events`.
- `GET /api/calendar/events` endpoint.
- `CalendarView` renders events alongside tasks.

**Phase 3 — incremental sync + cron (1h)**

- Switch to `syncToken` flow.
- Add Vercel cron.
- Add "sync now" button + last-synced timestamp.

**Phase 4 — member mapping + polish (1h)**

- Per-calendar default assignment.
- Per-event override in admin.
- Event detail modal.
- Event rendering on `/calendar/display`.

Total estimate: **~6 hours** of focused work. Roadmap's original 4-6 estimate was correct.

**What comes after v1 (deferred, listed so we don't forget):**

- Keyword / LLM-based event classification (which kid is this for?)
- Auto-promote recurring chore-y events to tasks
- Two-way create (admin-only: "also create in Google")
- Push notification subscriptions (`watch` channels)
- Per-calendar color honoring
- Multi-account support

---

## Resolved decisions (from design review)

1. **Account & calendar:** `rockwrestlerun@gmail.com`, single calendar "Brooker Kids." No per-member OAuth.
2. **Work calendar:** out of scope.
3. **Kid views:** show events alongside chores.
4. **Visibility:** all events visible to all kids. Per-event assignment controls who _owns_ it (gets points, sees their name on it), not who sees it.
5. **Points for events:** yes, configurable per event series via keyword rules + per-event manual override.

## Still open

- **Keyword rules location** — hardcoded TS file in v1, or DB-backed from day 1? Leaning TS file + a migration later once the rule count proves the pattern.
- **Auto-award vs tap-to-claim** — is TKD credit automatic at event end, or does Emmett have to tap ✓? v1 ships tap-to-claim. Add auto-award for trusted recurring series later.
- **Past-event grace window** — how far back can a kid claim points? Default: current week. Prevents scoreboard gaming via backfilled attendance.
