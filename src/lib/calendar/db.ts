import { getDb } from "@/lib/db";
import type {
  Household,
  FamilyMember,
  Task,
  TaskWithCompletion,
  ScoreboardEntry,
  PointRedemption,
  PointRedemptionWithMember,
  ActivityEvent,
} from "./types";
import {
  formatLocalDate,
  occurrencesInRange,
  parseLocalDate,
} from "./recurrence";

const DEFAULT_HOUSEHOLD_ID = 1;

/**
 * Coerce whatever `due_date` shape Neon returns (Date object, YYYY-MM-DD string,
 * full ISO timestamp) into a plain YYYY-MM-DD string. Returns null if we can't.
 */
function toIsoDate(raw: unknown): string | null {
  if (!raw) return null;
  if (raw instanceof Date) return formatLocalDate(raw);
  const s = String(raw);
  const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

/**
 * Ensure every occurrence of every recurring task in [start, end] has a row.
 * Safe to call repeatedly — WHERE NOT EXISTS prevents duplicates. Runs before
 * every read so the calendar always shows recurring chores on their repeat days
 * even if nobody completed the prior instance.
 */
async function materializeRecurringInstances(
  startDate: string,
  endDate: string,
  householdId: number
): Promise<void> {
  const db = getDb();
  if (!db) return;

  // TO_CHAR forces due_date into a plain YYYY-MM-DD string so we don't have to
  // guess what the driver hands us (Date object vs string vs timestamp).
  const anchors = await db`
    SELECT DISTINCT ON (household_id, title, recurrence_rule)
      household_id, title, description, assigned_to, source,
      priority, points,
      TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date_str,
      due_time, duration_minutes, recurrence_rule
    FROM tasks
    WHERE household_id = ${householdId}
      AND recurrence_rule IS NOT NULL
      AND due_date IS NOT NULL
      AND due_date <= ${endDate}
    ORDER BY household_id, title, recurrence_rule, due_date ASC, id ASC
  `;

  const rangeStart = parseLocalDate(startDate);
  const rangeEnd = parseLocalDate(endDate);

  for (const a of anchors as Array<Record<string, unknown>>) {
    const rule = a.recurrence_rule as string | null;
    const anchorIso = toIsoDate(a.due_date_str);
    if (!rule || !anchorIso) continue;

    const anchorDate = parseLocalDate(anchorIso);
    const dates = occurrencesInRange(rule, anchorDate, rangeStart, rangeEnd);

    for (const d of dates) {
      const dateStr = formatLocalDate(d);
      await db`
        INSERT INTO tasks (
          household_id, title, description, assigned_to, source, status,
          priority, points, due_date, due_time, duration_minutes, recurrence_rule
        )
        SELECT ${a.household_id as number}, ${a.title as string},
          ${(a.description as string | null) ?? null},
          ${(a.assigned_to as number | null) ?? null},
          ${(a.source as string | null) ?? "manual"}, 'pending',
          ${(a.priority as string | null) ?? "medium"},
          ${(a.points as number | null) ?? 0}, ${dateStr},
          ${(a.due_time as string | null) ?? null},
          ${(a.duration_minutes as number | null) ?? null}, ${rule}
        WHERE NOT EXISTS (
          SELECT 1 FROM tasks
          WHERE household_id = ${a.household_id as number}
            AND title = ${a.title as string}
            AND recurrence_rule = ${rule}
            AND due_date = ${dateStr}
        )
      `;
    }
  }
}

export async function getHousehold(
  id: number = DEFAULT_HOUSEHOLD_ID
): Promise<Household | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db`SELECT * FROM households WHERE id = ${id}`;
  return (rows[0] as Household) ?? null;
}

export async function getMembers(
  householdId: number = DEFAULT_HOUSEHOLD_ID
): Promise<FamilyMember[]> {
  const db = getDb();
  if (!db) return [];
  const rows =
    await db`SELECT * FROM family_members WHERE household_id = ${householdId} ORDER BY sort_order, id`;
  return rows as FamilyMember[];
}

export async function getTasksForDateRange(
  startDate: string,
  endDate: string,
  householdId: number = DEFAULT_HOUSEHOLD_ID
): Promise<TaskWithCompletion[]> {
  const db = getDb();
  if (!db) return [];
  await materializeRecurringInstances(startDate, endDate, householdId);
  // Cast date columns to text so consumers always get YYYY-MM-DD strings.
  const rows = await db`
    SELECT
      t.id, t.household_id, t.title, t.description, t.assigned_to, t.source,
      t.status, t.priority, t.points,
      TO_CHAR(t.due_date, 'YYYY-MM-DD') AS due_date,
      t.due_time, t.duration_minutes, t.recurrence_rule,
      t.created_at, t.updated_at,
      fm.name AS member_name,
      fm.color AS member_color,
      fm.avatar_emoji AS member_emoji,
      tc.id AS completion_id,
      TO_CHAR(tc.completed_date, 'YYYY-MM-DD') AS completed_date,
      tc2.name AS completed_by_name
    FROM tasks t
    LEFT JOIN family_members fm ON t.assigned_to = fm.id
    LEFT JOIN task_completions tc ON tc.task_id = t.id
      AND tc.completed_date = t.due_date
    LEFT JOIN family_members tc2 ON tc.completed_by = tc2.id
    WHERE t.household_id = ${householdId}
      AND t.due_date >= ${startDate}
      AND t.due_date <= ${endDate}
    ORDER BY t.due_date, t.due_time NULLS LAST, t.priority DESC, t.id
  `;
  return rows as TaskWithCompletion[];
}

export async function getTask(id: number): Promise<Task | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db`SELECT * FROM tasks WHERE id = ${id}`;
  return (rows[0] as Task) ?? null;
}

export async function createTask(
  data: Pick<
    Task,
    | "household_id"
    | "title"
    | "description"
    | "assigned_to"
    | "priority"
    | "points"
    | "due_date"
    | "due_time"
    | "duration_minutes"
    | "recurrence_rule"
  > &
    Partial<Pick<Task, "source" | "status">>
): Promise<Task> {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db`
    INSERT INTO tasks (
      household_id, title, description, assigned_to, source, status,
      priority, points, due_date, due_time, duration_minutes, recurrence_rule
    ) VALUES (
      ${data.household_id}, ${data.title}, ${data.description ?? null},
      ${data.assigned_to ?? null}, ${data.source ?? "manual"},
      ${data.status ?? "pending"}, ${data.priority ?? "medium"},
      ${data.points ?? 0}, ${data.due_date ?? null}, ${data.due_time ?? null},
      ${data.duration_minutes ?? null}, ${data.recurrence_rule ?? null}
    )
    RETURNING *
  `;
  return rows[0] as Task;
}

export async function updateTask(
  id: number,
  data: Partial<
    Pick<
      Task,
      | "title"
      | "description"
      | "assigned_to"
      | "status"
      | "priority"
      | "points"
      | "due_date"
      | "due_time"
      | "duration_minutes"
      | "recurrence_rule"
    >
  >
): Promise<Task | null> {
  const db = getDb();
  if (!db) return null;

  const existing = await getTask(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };

  const rows = await db`
    UPDATE tasks SET
      title = ${merged.title},
      description = ${merged.description},
      assigned_to = ${merged.assigned_to},
      status = ${merged.status},
      priority = ${merged.priority},
      points = ${merged.points},
      due_date = ${merged.due_date},
      due_time = ${merged.due_time},
      duration_minutes = ${merged.duration_minutes},
      recurrence_rule = ${merged.recurrence_rule},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return (rows[0] as Task) ?? null;
}

export async function deleteTask(id: number): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const rows = await db`DELETE FROM tasks WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function completeTask(
  taskId: number,
  completedBy: number,
  date: string,
  pointsEarned: number = 0
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  await db`
    INSERT INTO task_completions (task_id, completed_by, completed_date, points_earned)
    VALUES (${taskId}, ${completedBy}, ${date}, ${pointsEarned})
    ON CONFLICT (task_id, completed_date) DO UPDATE SET
      completed_by = ${completedBy},
      points_earned = ${pointsEarned}
  `;
  await db`UPDATE tasks SET status = 'completed', updated_at = NOW() WHERE id = ${taskId}`;
  return true;
}

export async function uncompleteTask(
  taskId: number,
  date: string
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  await db`DELETE FROM task_completions WHERE task_id = ${taskId} AND completed_date = ${date}`;
  await db`UPDATE tasks SET status = 'pending', updated_at = NOW() WHERE id = ${taskId}`;
  return true;
}

export async function getScoreboard(
  householdId: number = DEFAULT_HOUSEHOLD_ID,
  today: Date = new Date()
): Promise<ScoreboardEntry[]> {
  const db = getDb();
  if (!db) return [];

  // Compute Monday of this week (local semantics, but we pass ISO date strings).
  const d = new Date(today);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(d);
  weekStart.setDate(diffToMonday);
  const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);

  const toKey = (x: Date) => x.toISOString().split("T")[0];
  const weekStartKey = toKey(weekStart);
  const monthStartKey = toKey(monthStart);

  const todayKey = toKey(d);

  // UNION ALL across task completions + event completions so both feed the
  // same scoreboard. Both tables expose (completed_by, completed_date,
  // points_earned) so the outer aggregate doesn't care which is which.
  // Streak = consecutive days (ending today or yesterday) with at least one
  // completion — computed per member via window functions.
  const rows = await db`
    WITH all_completions AS (
      SELECT completed_by, completed_date, points_earned FROM task_completions
      UNION ALL
      SELECT completed_by, completed_date, points_earned FROM event_completions
    ),
    per_day AS (
      SELECT completed_by, completed_date
      FROM all_completions
      GROUP BY completed_by, completed_date
    ),
    streak_groups AS (
      SELECT
        completed_by,
        completed_date,
        completed_date - (ROW_NUMBER() OVER (
          PARTITION BY completed_by ORDER BY completed_date
        ) || ' days')::interval AS grp
      FROM per_day
    ),
    streak_runs AS (
      SELECT completed_by, MAX(completed_date) AS last_day, COUNT(*) AS run_len
      FROM streak_groups
      GROUP BY completed_by, grp
    ),
    current_streak AS (
      SELECT completed_by, run_len
      FROM streak_runs
      WHERE last_day >= ${todayKey}::date - INTERVAL '1 day'
    ),
    redeemed AS (
      SELECT member_id, COALESCE(SUM(amount), 0)::int AS total
      FROM point_redemptions
      GROUP BY member_id
    ),
    earned AS (
      SELECT
        fm.id AS member_id,
        COALESCE(SUM(
          CASE WHEN c.completed_date >= ${weekStartKey}
               THEN c.points_earned ELSE 0 END
        ), 0)::int AS week_points,
        COALESCE(SUM(
          CASE WHEN c.completed_date >= ${monthStartKey}
               THEN c.points_earned ELSE 0 END
        ), 0)::int AS month_points,
        COALESCE(SUM(c.points_earned), 0)::int AS all_time_points,
        COUNT(c.completed_by)::int AS completed_count
      FROM family_members fm
      LEFT JOIN all_completions c ON c.completed_by = fm.id
      WHERE fm.household_id = ${householdId}
      GROUP BY fm.id
    )
    SELECT
      fm.id AS member_id,
      fm.name,
      fm.avatar_emoji AS emoji,
      fm.color,
      e.week_points,
      e.month_points,
      e.all_time_points,
      e.completed_count,
      COALESCE(r.total, 0)::int AS redeemed_points,
      (e.all_time_points - COALESCE(r.total, 0))::int AS balance,
      COALESCE(s.run_len, 0)::int AS streak_days
    FROM family_members fm
    JOIN earned e ON e.member_id = fm.id
    LEFT JOIN redeemed r ON r.member_id = fm.id
    LEFT JOIN current_streak s ON s.completed_by = fm.id
    WHERE fm.household_id = ${householdId}
    ORDER BY e.all_time_points DESC, fm.sort_order, fm.id
  `;
  return rows as ScoreboardEntry[];
}

export async function createRedemption(
  memberId: number,
  amount: number,
  label: string
): Promise<PointRedemption | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db`
    INSERT INTO point_redemptions (member_id, amount, label)
    VALUES (${memberId}, ${amount}, ${label})
    RETURNING *
  `;
  return (rows[0] as PointRedemption) ?? null;
}

export async function deleteRedemption(id: number): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  await db`DELETE FROM point_redemptions WHERE id = ${id}`;
  return true;
}

export async function getRedemptions(
  householdId: number = DEFAULT_HOUSEHOLD_ID,
  limit: number = 50
): Promise<PointRedemptionWithMember[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db`
    SELECT r.*,
      fm.name AS member_name,
      fm.avatar_emoji AS member_emoji,
      fm.color AS member_color
    FROM point_redemptions r
    JOIN family_members fm ON fm.id = r.member_id
    WHERE fm.household_id = ${householdId}
    ORDER BY r.redeemed_at DESC
    LIMIT ${limit}
  `;
  return rows as PointRedemptionWithMember[];
}

/**
 * Recent activity across task completions, event check-ins, and redemptions.
 * Merged in SQL so pagination works naturally.
 */
export async function getActivityFeed(
  householdId: number = DEFAULT_HOUSEHOLD_ID,
  limit: number = 20
): Promise<ActivityEvent[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db`
    SELECT * FROM (
      SELECT
        'task-' || tc.id::text AS id,
        'task'::text AS kind,
        t.title AS title,
        fm.id AS member_id,
        fm.name AS member_name,
        fm.avatar_emoji AS member_emoji,
        fm.color AS member_color,
        tc.points_earned AS points,
        tc.created_at AS happened_at
      FROM task_completions tc
      JOIN tasks t ON t.id = tc.task_id
      JOIN family_members fm ON fm.id = tc.completed_by
      WHERE t.household_id = ${householdId}

      UNION ALL

      SELECT
        'event-' || ec.id::text AS id,
        'event'::text AS kind,
        ce.title AS title,
        fm.id AS member_id,
        fm.name AS member_name,
        fm.avatar_emoji AS member_emoji,
        fm.color AS member_color,
        ec.points_earned AS points,
        ec.created_at AS happened_at
      FROM event_completions ec
      JOIN calendar_events ce ON ce.id = ec.event_id
      JOIN family_members fm ON fm.id = ec.completed_by
      WHERE ce.household_id = ${householdId}

      UNION ALL

      SELECT
        'redemption-' || pr.id::text AS id,
        'redemption'::text AS kind,
        pr.label AS title,
        fm.id AS member_id,
        fm.name AS member_name,
        fm.avatar_emoji AS member_emoji,
        fm.color AS member_color,
        (-pr.amount) AS points,
        pr.redeemed_at AS happened_at
      FROM point_redemptions pr
      JOIN family_members fm ON fm.id = pr.member_id
      WHERE fm.household_id = ${householdId}
    ) AS combined
    ORDER BY happened_at DESC
    LIMIT ${limit}
  `;
  return rows as ActivityEvent[];
}

/**
 * For each recurrence series, return the LATEST task row (by due_date).
 * Series are identified by (household_id, title, recurrence_rule) — pragmatic
 * grouping since we don't persist a series_id.
 */
export async function getLatestRecurringInstances(
  householdId: number = DEFAULT_HOUSEHOLD_ID
): Promise<Task[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db`
    SELECT DISTINCT ON (household_id, title, recurrence_rule) *
    FROM tasks
    WHERE household_id = ${householdId}
      AND recurrence_rule IS NOT NULL
      AND due_date IS NOT NULL
    ORDER BY household_id, title, recurrence_rule, due_date DESC, id DESC
  `;
  return rows as Task[];
}

export async function seedBrookerFamily(): Promise<{
  household: Household;
  members: FamilyMember[];
}> {
  const db = getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db`SELECT * FROM households WHERE id = 1`;
  if (existing.length > 0) {
    const members =
      await db`SELECT * FROM family_members WHERE household_id = 1 ORDER BY sort_order`;
    return {
      household: existing[0] as Household,
      members: members as FamilyMember[],
    };
  }

  const household = await db`
    INSERT INTO households (name) VALUES ('Brooker Family') RETURNING *
  `;

  const membersData = [
    { name: "Matt", role: "adult", color: "#4A90D9", emoji: "🧔", sort: 0 },
    {
      name: "Brittany",
      role: "adult",
      color: "#D94A8A",
      emoji: "👩",
      sort: 1,
    },
    { name: "Emmett", role: "kid", color: "#4AD97A", emoji: "🧒", sort: 2 },
    {
      name: "Sapphire",
      role: "kid",
      color: "#D9A44A",
      emoji: "👧",
      sort: 3,
    },
  ];

  const members: FamilyMember[] = [];
  for (const m of membersData) {
    const rows = await db`
      INSERT INTO family_members (household_id, name, role, color, avatar_emoji, sort_order)
      VALUES (${household[0].id}, ${m.name}, ${m.role}, ${m.color}, ${m.emoji}, ${m.sort})
      RETURNING *
    `;
    members.push(rows[0] as FamilyMember);
  }

  return { household: household[0] as Household, members };
}
