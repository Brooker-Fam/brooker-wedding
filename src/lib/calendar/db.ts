import { getDb } from "@/lib/db";
import type {
  Household,
  FamilyMember,
  Task,
  TaskWithCompletion,
} from "./types";

const DEFAULT_HOUSEHOLD_ID = 1;

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
  const rows = await db`
    SELECT
      t.*,
      fm.name AS member_name,
      fm.color AS member_color,
      fm.avatar_emoji AS member_emoji,
      tc.id AS completion_id,
      tc.completed_date,
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
