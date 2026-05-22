import { getDb } from "@/lib/db";
import type { CalendarEventWithMember } from "./types";

const DEFAULT_HOUSEHOLD_ID = 1;

/**
 * Query events whose start OR end falls in [startDate, endDate] (local date
 * strings, YYYY-MM-DD). Excludes cancelled events. Joins assigned member and
 * source calendar summary; aggregates completions as JSON.
 */
export async function getEventsForDateRange(
  startDate: string,
  endDate: string,
  householdId: number = DEFAULT_HOUSEHOLD_ID
): Promise<CalendarEventWithMember[]> {
  const db = getDb();
  if (!db) return [];

  // Use inclusive day bounds interpreted as local midnight → next-day midnight.
  // Postgres timestamptz comparison handles tz; we only need ISO boundaries.
  const rangeStart = `${startDate}T00:00:00Z`;
  // End is inclusive date → add 1 day to cover the whole day.
  const endPlusOne = new Date(endDate + "T00:00:00Z");
  endPlusOne.setUTCDate(endPlusOne.getUTCDate() + 1);
  const rangeEnd = endPlusOne.toISOString();

  const rows = await db`
    SELECT
      e.id, e.household_id, e.google_calendar_id, e.google_event_id,
      e.ical_uid, e.etag, e.title, e.description, e.location,
      e.start_at, e.end_at, e.all_day, e.timezone,
      e.recurrence_rule, e.recurring_event_id, e.original_start_at,
      e.assigned_to, e.color_override, e.points, e.auto_award,
      e.status, e.html_link, e.created_at, e.updated_at,
      fm.name AS member_name,
      fm.color AS member_color,
      fm.avatar_emoji AS member_emoji,
      gc.summary AS calendar_summary,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', ec.id,
              'completed_by', ec.completed_by,
              'completed_by_name', fm2.name,
              'points_earned', ec.points_earned
            ) ORDER BY ec.id
          )
          FROM event_completions ec
          LEFT JOIN family_members fm2 ON fm2.id = ec.completed_by
          WHERE ec.event_id = e.id
        ),
        '[]'::json
      ) AS completions
    FROM calendar_events e
    LEFT JOIN family_members fm ON e.assigned_to = fm.id
    LEFT JOIN google_calendars gc
      ON gc.google_calendar_id = e.google_calendar_id
      AND gc.household_id = e.household_id
    WHERE e.household_id = ${householdId}
      AND e.status <> 'cancelled'
      AND e.end_at > ${rangeStart}
      AND e.start_at < ${rangeEnd}
    ORDER BY e.start_at, e.id
  `;

  return rows as CalendarEventWithMember[];
}

export async function updateEventOverrides(
  id: number,
  patch: {
    assigned_to?: number | null;
    points?: number;
    color_override?: string | null;
    auto_award?: boolean;
  }
): Promise<CalendarEventWithMember | null> {
  const db = getDb();
  if (!db) return null;

  // Single round-trip: UPDATE with CASE-preserved fields, then return a
  // joined row in the same statement via a CTE so the caller still gets the
  // hydrated event back without a follow-up SELECT.
  const rows = await db`
    WITH updated AS (
      UPDATE calendar_events SET
        assigned_to = CASE WHEN ${patch.assigned_to === undefined}
          THEN assigned_to ELSE ${patch.assigned_to ?? null} END,
        points = CASE WHEN ${patch.points === undefined}
          THEN points ELSE ${patch.points ?? 0} END,
        color_override = CASE WHEN ${patch.color_override === undefined}
          THEN color_override ELSE ${patch.color_override ?? null} END,
        auto_award = CASE WHEN ${patch.auto_award === undefined}
          THEN auto_award ELSE ${patch.auto_award ?? false} END,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    )
    SELECT
      e.*, fm.name AS member_name, fm.color AS member_color,
      fm.avatar_emoji AS member_emoji,
      '[]'::json AS completions,
      NULL::text AS calendar_summary
    FROM updated e
    LEFT JOIN family_members fm ON e.assigned_to = fm.id
  `;
  return (rows[0] as CalendarEventWithMember) ?? null;
}

export async function completeEvent(
  eventId: number,
  completedBy: number,
  completedDate: string,
  pointsEarned: number
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  await db`
    INSERT INTO event_completions (event_id, completed_by, completed_date, points_earned)
    VALUES (${eventId}, ${completedBy}, ${completedDate}, ${pointsEarned})
    ON CONFLICT (event_id, completed_by) DO UPDATE SET
      completed_date = ${completedDate},
      points_earned = ${pointsEarned}
  `;
  return true;
}

export async function uncompleteEvent(
  eventId: number,
  completedBy: number
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  await db`
    DELETE FROM event_completions
    WHERE event_id = ${eventId} AND completed_by = ${completedBy}
  `;
  return true;
}
