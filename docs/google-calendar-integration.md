# Google Calendar Integration Plan

Living design doc for pulling Google Calendar events (TKD, drama club, school, etc.) into `/calendar`. Written before implementation so we can argue about direction before writing code.

Companion to `docs/calendar-roadmap.md` — that doc lists Google sync as item #4 on the short list; this one explains _how_.

---

## Goal

Matt and Brit already maintain their real schedule in Google Calendar. Retyping "Emmett TKD Tuesdays at 5" into this app is a non-starter — if the app isn't a superset of what Google already shows, nobody opens it.

**What we actually want, in order:**

1. See Google Calendar events (TKD, drama club, soccer, school closures, doctor appts) on `/calendar` next to our own tasks/chores.
2. Keep Google Calendar as the system of record for events. If Brit moves TKD in Google, it moves in our app. No confusion about "which one is right."
3. Preserve the thing our app does that Google doesn't: chores, points, assignment to a specific kid, completion tracking.

**Non-goals for v1:**

- Creating/editing events in our app that sync back to Google. (We can revisit, but see [One-way vs two-way](#one-way-vs-two-way) below.)
- Supporting multiple Google accounts per household with separate calendars. Start with one shared account.
- CalDAV / iCloud / Outlook. Google only.
- Real-time push notifications from Google. Polling is fine.

---

## One-way vs two-way

**Decision: start one-way, Google → app, read-only on our side.**

Reasons:

- **Source of truth is unambiguous.** If we let users edit a Google event inside our UI, we have to reconcile concurrent edits (Brit edits in Google Cal app on her phone, kid edits on `/calendar/kid/sapphire` at the same time). That's a nontrivial CRDT / last-write-wins dance.
- **90% of the value is in the read path.** Matt said it: "really I just want to be able to pull TKD, drama club, etc." Building two-way doubles the work for maybe 10% more value.
- **We already have a write path for our own stuff.** Tasks created in `/calendar/admin` stay in our DB. They just don't appear in Google. That's fine — tasks aren't events.

**Events vs tasks — the mental model:**

| Concept   | Source          | Lives in       | Has points? | Example                              |
| --------- | --------------- | -------------- | ----------- | ------------------------------------ |
| **Event** | Google Calendar | Google (mirror in our DB) | No          | Emmett TKD, Tues 5pm                 |
| **Task**  | Our app         | Our DB         | Yes         | Take out trash, feed Zoe             |

We already distinguish these implicitly via `tasks.source`: `'manual'` vs `'google'`. The plan is to **stop conflating them**. Events get a new `events` table; chores stay in `tasks`. Both render on the same calendar grid.

Open question: what about a Google event that _is_ a chore? E.g. "Emmett: empty dishwasher" scheduled weekly in Google Calendar. Resolution: if it's assigned points or on the chore list, create it as a task in `/calendar/admin`. Don't make Google responsible for chore logic.

**Two-way sync — the path if we ever want it:**

- Add a "Create in Google Calendar" checkbox to `TaskForm`.
- When checked, we call `events.insert` and store the returned `id` on our task row.
- Updates/deletes on our side replay to Google.
- We still pull Google as the source of truth; our own pushes are just a convenience.
- **Never let users edit a Google-sourced event in our UI.** If they want to reschedule TKD, they do it in Google.

Defer this until someone actually asks.

---

## Auth model

Three options, in rough order of simplicity:

### Option A: Public calendar(s) via API key

If Brit publishes the shared family calendar as public, we can read it with a Google API key (no OAuth). Zero per-user setup.

- ✅ Simplest possible integration.
- ✅ No tokens to refresh, no OAuth consent screen.
- ❌ Calendar has to be public (anyone with the calendar ID can subscribe). Kids' schedules might be fine; medical appts no.
- ❌ Can't write back ever.

### Option B: Single shared Google account, admin-connected

Matt connects _one_ Google account (say `brooker.family@gmail.com`) via OAuth from `/calendar/admin`. We store the refresh token in `spotify_config`-style key-value table (rename to `oauth_tokens`). All events readable on that account's calendars appear in our app.

- ✅ One-time setup, handled by the admin.
- ✅ Works with shared family calendar + individual calendars Matt/Brit subscribe to.
- ✅ Refresh token never expires if the account stays active.
- ❌ Relies on a single account having visibility into everything we care about. Workable — Google's shared-calendar model is strong.

### Option C: Per-member OAuth

Every family member connects their own Google account. Events from each account ingested separately.

- ✅ Most flexible; each person's private calendar ingested.
- ❌ Four OAuth flows. Kids don't have Google accounts that own their TKD event (Brit's does).
- ❌ Overkill for this family.

**Decision: Option B.** Start with a single OAuth token stored server-side. If we later want specific calendars included/excluded, surface a multi-select in `/calendar/admin`.

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
  color_override VARCHAR(7),                    -- if we want to override Google's color

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

## Member / calendar mapping

**The core UX question: whose event is this?**

Options, in order of sophistication:

1. **Per-calendar default assignment.** `google_calendars.assigned_to` says "everything from Emmett's TKD calendar is Emmett's." Simple, works if the family structures their calendars that way.
2. **Keyword rules.** "If title contains 'Emmett' or 'TKD', assign to Emmett." Store as a small JSON rules config in `household_settings`. Evaluate on ingest.
3. **Manual override.** Admin UI lets you click an event and pick a member. Stored in `calendar_events.assigned_to`, survives re-sync.

**Decision: ship #1 + #3 in v1, defer #2.** #2 sounds smart but each rule config is a mini-programming-language we don't need yet. If title-matching becomes important, #2 + Claude (LLM inference at sync time) beats hand-rolled regex anyway.

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
- New: events rendered alongside tasks. Events are visually distinguishable (e.g. subtle gradient band, no completion checkbox, no point badge).
- Click an event → modal showing title, time, location, description, Google event link ("Open in Google Calendar").
- No edit/delete affordances for events for non-admins.

### `/calendar/admin`

New section: "Google Calendar"

- If not connected: big "Connect Google Calendar" button → `/api/calendar/google/connect`.
- If connected:
  - List of calendars with toggle + member assignment dropdown.
  - "Last synced: 3 minutes ago" + "Sync now" button.
  - "Disconnect" button.

### `/calendar/display` (wall iPad)

- Show today's events prominently. This is where the family will actually look at it.

### `CalendarView` component changes

- Accept an `events` prop alongside `tasks`.
- When fetching, call both `/api/calendar/tasks` and `/api/calendar/events` in parallel.
- Merge into the same day-buckets keyed by local date.
- Sort within a day: all-day events first, then timed events by start, then tasks by priority.

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

## Open questions for Matt

1. Is `brooker.family@gmail.com` a real shared account, or does Brit keep her kids' schedules on her personal calendar? (Changes Option B feasibility.)
2. Do you want events from your work calendar to show up here, or just family stuff?
3. For the kids' views (`/calendar/kid/[name]`) — should Google-sourced events show in big friendly mode, or keep those views chore-only?
4. Is it OK that kids see all events from any synced calendar, or do we need per-event visibility controls from day 1?
5. Do events count toward points ever? (Default answer: no. Events are commitments; tasks are work.)
