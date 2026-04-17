import { google, type calendar_v3 } from "googleapis";
import { getDb } from "@/lib/db";
import { getOAuthClient } from "@/lib/google";
import { matchEventRule } from "./event-rules";
import type { FamilyMember, GoogleCalendar } from "./types";

const DEFAULT_HOUSEHOLD_ID = 1;

// ── Calendar list ─────────────────────────────────────────────────────

/**
 * Fetches the list of calendars the connected Google account has access to and
 * upserts them into google_calendars. Returns the rows. Enabled flag defaults
 * to FALSE — admin toggles them on.
 */
export async function refreshCalendarList(
  householdId: number = DEFAULT_HOUSEHOLD_ID
): Promise<GoogleCalendar[]> {
  const db = getDb();
  if (!db) return [];

  const auth = await getOAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.calendarList.list({
    maxResults: 250,
    showHidden: false,
  });
  const items = res.data.items ?? [];

  for (const item of items) {
    if (!item.id) continue;
    await db`
      INSERT INTO google_calendars (
        household_id, google_calendar_id, summary, color
      ) VALUES (
        ${householdId}, ${item.id}, ${item.summary ?? item.id},
        ${item.backgroundColor ?? null}
      )
      ON CONFLICT (household_id, google_calendar_id) DO UPDATE SET
        summary = EXCLUDED.summary,
        color = EXCLUDED.color
    `;
  }

  const rows = await db`
    SELECT * FROM google_calendars
    WHERE household_id = ${householdId}
    ORDER BY enabled DESC, summary ASC
  `;
  return rows as GoogleCalendar[];
}

export async function updateCalendar(
  householdId: number,
  calendarRowId: number,
  patch: { enabled?: boolean; assigned_to?: number | null }
): Promise<GoogleCalendar | null> {
  const db = getDb();
  if (!db) return null;

  const existing = await db`
    SELECT * FROM google_calendars
    WHERE id = ${calendarRowId} AND household_id = ${householdId}
  `;
  if (existing.length === 0) return null;

  const row = existing[0] as GoogleCalendar;
  const nextEnabled = patch.enabled ?? row.enabled;
  const nextAssigned =
    patch.assigned_to === undefined ? row.assigned_to : patch.assigned_to;

  // If we're disabling, wipe the sync token so a re-enable starts fresh.
  const resetToken = row.enabled && !nextEnabled;

  const updated = await db`
    UPDATE google_calendars SET
      enabled = ${nextEnabled},
      assigned_to = ${nextAssigned},
      sync_token = ${resetToken ? null : row.sync_token}
    WHERE id = ${calendarRowId}
    RETURNING *
  `;
  return (updated[0] as GoogleCalendar) ?? null;
}

// ── Event sync ────────────────────────────────────────────────────────

function toIsoOrNull(v: string | null | undefined): string | null {
  if (!v) return null;
  return new Date(v).toISOString();
}

function eventStartEnd(ev: calendar_v3.Schema$Event): {
  start_at: string;
  end_at: string;
  all_day: boolean;
  timezone: string | null;
} {
  // All-day events use .date (YYYY-MM-DD); timed events use .dateTime.
  if (ev.start?.date && ev.end?.date) {
    return {
      start_at: new Date(ev.start.date + "T00:00:00Z").toISOString(),
      end_at: new Date(ev.end.date + "T00:00:00Z").toISOString(),
      all_day: true,
      timezone: ev.start.timeZone ?? null,
    };
  }
  const start = ev.start?.dateTime ?? ev.start?.date;
  const end = ev.end?.dateTime ?? ev.end?.date;
  return {
    start_at: start ? new Date(start).toISOString() : new Date().toISOString(),
    end_at: end ? new Date(end).toISOString() : new Date().toISOString(),
    all_day: false,
    timezone: ev.start?.timeZone ?? null,
  };
}

async function resolveMemberId(
  members: FamilyMember[],
  name: string | null
): Promise<number | null> {
  if (!name) return null;
  const match = members.find(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );
  return match?.id ?? null;
}

/**
 * Sync a single calendar. Uses syncToken when present; falls back to a windowed
 * full sync otherwise. Handles the 410 Gone case by clearing the token and
 * retrying with a full sync once.
 */
async function syncOneCalendar(
  cal: GoogleCalendar,
  members: FamilyMember[]
): Promise<{ upserted: number; cancelled: number }> {
  const db = getDb();
  if (!db) return { upserted: 0, cancelled: 0 };

  const auth = await getOAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  // Accumulate all events across pages, then upsert.
  const allEvents: calendar_v3.Schema$Event[] = [];
  let pageToken: string | undefined;
  let nextSyncToken: string | null | undefined;
  let useSyncToken = !!cal.sync_token;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      allEvents.length = 0;
      pageToken = undefined;
      nextSyncToken = undefined;

      for (;;) {
        const params: calendar_v3.Params$Resource$Events$List = {
          calendarId: cal.google_calendar_id,
          singleEvents: true,
          showDeleted: true,
          maxResults: 250,
          pageToken,
        };
        if (useSyncToken && cal.sync_token) {
          params.syncToken = cal.sync_token;
        } else {
          // Window: 30 days back to 400 days forward on full sync.
          const now = new Date();
          const start = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
          const end = new Date(now.getTime() + 400 * 24 * 3600 * 1000);
          params.timeMin = start.toISOString();
          params.timeMax = end.toISOString();
          params.orderBy = "startTime";
        }
        const res = await calendar.events.list(params);
        const items = res.data.items ?? [];
        allEvents.push(...items);
        if (res.data.nextPageToken) {
          pageToken = res.data.nextPageToken;
          continue;
        }
        nextSyncToken = res.data.nextSyncToken;
        break;
      }
      break; // success
    } catch (err: unknown) {
      const e = err as { code?: number; response?: { status?: number } };
      const status = e.code ?? e.response?.status;
      if (status === 410 && useSyncToken) {
        // Sync token expired — retry with full sync.
        useSyncToken = false;
        continue;
      }
      throw err;
    }
  }

  let upserted = 0;
  let cancelled = 0;

  for (const ev of allEvents) {
    if (!ev.id) continue;

    const status = (ev.status ?? "confirmed") as
      | "confirmed"
      | "tentative"
      | "cancelled";

    if (status === "cancelled") {
      // Soft-delete: mark the row cancelled if it exists.
      const result = await db`
        UPDATE calendar_events
        SET status = 'cancelled', etag = ${ev.etag ?? null}, updated_at = NOW()
        WHERE google_calendar_id = ${cal.google_calendar_id}
          AND google_event_id = ${ev.id}
      `;
      if (Array.isArray(result) && result.length > 0) cancelled++;
      continue;
    }

    const { start_at, end_at, all_day, timezone } = eventStartEnd(ev);
    const title = ev.summary ?? "(untitled)";
    const rule = matchEventRule(title);
    const ruleMemberId = await resolveMemberId(members, rule?.assignedToName ?? null);
    const defaultFromCalendar = cal.assigned_to;
    const assignedFromRule = ruleMemberId ?? defaultFromCalendar;
    const pointsFromRule = rule?.points ?? 0;
    const recurrenceRule = ev.recurrence?.find((r) => r.startsWith("RRULE:"))
      ?.slice(6) ?? null;

    // Upsert. On conflict, Google-owned fields are overwritten; locally-owned
    // fields (assigned_to, points, color_override, auto_award) are preserved
    // via COALESCE(existing, incoming).
    await db`
      INSERT INTO calendar_events (
        household_id, google_calendar_id, google_event_id, ical_uid, etag,
        title, description, location, start_at, end_at, all_day, timezone,
        recurrence_rule, recurring_event_id, original_start_at,
        assigned_to, points, status, html_link
      ) VALUES (
        ${cal.household_id}, ${cal.google_calendar_id}, ${ev.id},
        ${ev.iCalUID ?? null}, ${ev.etag ?? null},
        ${title}, ${ev.description ?? null}, ${ev.location ?? null},
        ${start_at}, ${end_at}, ${all_day}, ${timezone},
        ${recurrenceRule}, ${ev.recurringEventId ?? null},
        ${toIsoOrNull(ev.originalStartTime?.dateTime ?? ev.originalStartTime?.date)},
        ${assignedFromRule}, ${pointsFromRule}, ${status}, ${ev.htmlLink ?? null}
      )
      ON CONFLICT (google_calendar_id, google_event_id) DO UPDATE SET
        ical_uid = EXCLUDED.ical_uid,
        etag = EXCLUDED.etag,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        location = EXCLUDED.location,
        start_at = EXCLUDED.start_at,
        end_at = EXCLUDED.end_at,
        all_day = EXCLUDED.all_day,
        timezone = EXCLUDED.timezone,
        recurrence_rule = EXCLUDED.recurrence_rule,
        recurring_event_id = EXCLUDED.recurring_event_id,
        original_start_at = EXCLUDED.original_start_at,
        status = EXCLUDED.status,
        html_link = EXCLUDED.html_link,
        updated_at = NOW()
    `;
    upserted++;
  }

  // Persist the new sync token + timestamp.
  await db`
    UPDATE google_calendars
    SET sync_token = ${nextSyncToken ?? null}, last_synced_at = NOW()
    WHERE id = ${cal.id}
  `;

  return { upserted, cancelled };
}

/**
 * Sync all enabled calendars for the household. Returns a per-calendar summary.
 */
export async function syncAllEnabledCalendars(
  householdId: number = DEFAULT_HOUSEHOLD_ID
): Promise<Array<{
  calendar: string;
  upserted: number;
  cancelled: number;
  error?: string;
}>> {
  const db = getDb();
  if (!db) return [];

  const cals = (await db`
    SELECT * FROM google_calendars
    WHERE household_id = ${householdId} AND enabled = TRUE
  `) as GoogleCalendar[];

  const members = (await db`
    SELECT * FROM family_members WHERE household_id = ${householdId}
  `) as FamilyMember[];

  const results: Array<{
    calendar: string;
    upserted: number;
    cancelled: number;
    error?: string;
  }> = [];

  for (const cal of cals) {
    try {
      const { upserted, cancelled } = await syncOneCalendar(cal, members);
      results.push({ calendar: cal.summary, upserted, cancelled });
    } catch (err) {
      results.push({
        calendar: cal.summary,
        upserted: 0,
        cancelled: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}

// ── Throttled "sync if stale" ─────────────────────────────────────────

const SYNC_ATTEMPT_KEY = "last_sync_attempt_at";
/** Minimum gap between auto-triggered syncs. Manual "Sync now" ignores this. */
const DEFAULT_MIN_INTERVAL_MS = 15 * 60 * 1000;

/**
 * Run a sync only if it's been > minIntervalMs since the last attempt.
 * Records the attempt timestamp BEFORE syncing so concurrent callers
 * collapse to a single sync (simple thundering-herd guard).
 *
 * Returns { synced: true } if sync ran, { synced: false, reason } otherwise.
 * Errors are swallowed into the return value — callers typically fire-and-
 * forget this, so throwing would just noise up the logs.
 */
export async function maybeSyncIfStale(
  minIntervalMs: number = DEFAULT_MIN_INTERVAL_MS,
  householdId: number = DEFAULT_HOUSEHOLD_ID
): Promise<
  | { synced: true; results: Awaited<ReturnType<typeof syncAllEnabledCalendars>> }
  | { synced: false; reason: "fresh" | "not_connected" | "no_db" | "error"; error?: string }
> {
  const db = getDb();
  if (!db) return { synced: false, reason: "no_db" };

  // Read last attempt timestamp from google_config.
  const rows = (await db`
    SELECT value FROM google_config WHERE key = ${SYNC_ATTEMPT_KEY}
  `) as Array<{ value: string }>;
  const lastAttemptMs = rows[0]?.value ? Number(rows[0].value) : 0;
  if (Date.now() - lastAttemptMs < minIntervalMs) {
    return { synced: false, reason: "fresh" };
  }

  // Check connection BEFORE writing attempt timestamp so a disconnected
  // state doesn't permanently push attempt into the future.
  const { isConnected } = await import("@/lib/google");
  if (!(await isConnected())) {
    return { synced: false, reason: "not_connected" };
  }

  // Mark attempt. If multiple requests race, only one should proceed.
  // Since this is just a fire-and-forget background sync, a little overlap
  // is harmless — the DB upsert for syncToken handles it.
  await db`
    INSERT INTO google_config (key, value, updated_at)
    VALUES (${SYNC_ATTEMPT_KEY}, ${String(Date.now())}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;

  try {
    const results = await syncAllEnabledCalendars(householdId);
    return { synced: true, results };
  } catch (err) {
    return {
      synced: false,
      reason: "error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
