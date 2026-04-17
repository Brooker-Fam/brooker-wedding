import { getDb } from "@/lib/db";
import type {
  Household,
  FamilyMember,
  Task,
  TaskWithCompletion,
  ScoreboardEntry,
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

  // UNION ALL across task completions + event completions so both feed the
  // same scoreboard. Both tables expose (completed_by, completed_date,
  // points_earned) so the outer aggregate doesn't care which is which.
  const rows = await db`
    WITH all_completions AS (
      SELECT completed_by, completed_date, points_earned FROM task_completions
      UNION ALL
      SELECT completed_by, completed_date, points_earned FROM event_completions
    )
    SELECT
      fm.id AS member_id,
      fm.name,
      fm.avatar_emoji AS emoji,
      fm.color,
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
    GROUP BY fm.id, fm.name, fm.avatar_emoji, fm.color, fm.sort_order
    ORDER BY all_time_points DESC, fm.sort_order, fm.id
  `;
  return rows as ScoreboardEntry[];
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
