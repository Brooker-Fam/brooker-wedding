import { getDb } from "@/lib/db";
import {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getTasksForDateRange,
  getMembers,
  getScoreboard,
  completeTask,
  uncompleteTask,
  getLatestRecurringInstances,
} from "@/lib/calendar/db";
import {
  formatLocalDate,
  nextOccurrence,
  parseLocalDate,
} from "@/lib/calendar/recurrence";

const HOUSEHOLD_ID = 1;

export type QueryInput = {
  kind:
    | "tasks"
    | "task"
    | "members"
    | "member"
    | "scoreboard"
    | "completions"
    | "recurring_series";
  filters?: {
    id?: number;
    start_date?: string;
    end_date?: string;
    assigned_to?: number;
    status?: string;
    name?: string;
    limit?: number;
  };
};

export async function runQuery(input: QueryInput): Promise<unknown> {
  const f = input.filters ?? {};
  switch (input.kind) {
    case "tasks": {
      const today = new Date();
      const defaultStart = formatLocalDate(today);
      const twoWeeks = new Date(today);
      twoWeeks.setDate(twoWeeks.getDate() + 14);
      const rows = await getTasksForDateRange(
        f.start_date ?? defaultStart,
        f.end_date ?? formatLocalDate(twoWeeks),
        HOUSEHOLD_ID
      );
      let filtered = rows;
      if (typeof f.assigned_to === "number") {
        filtered = filtered.filter((r) => r.assigned_to === f.assigned_to);
      }
      if (f.status) {
        filtered = filtered.filter((r) => r.status === f.status);
      }
      if (f.limit) filtered = filtered.slice(0, f.limit);
      return filtered;
    }
    case "task": {
      if (!f.id) throw new Error("filters.id required for kind=task");
      return await getTask(f.id);
    }
    case "members": {
      const all = await getMembers(HOUSEHOLD_ID);
      if (f.name) {
        const needle = f.name.toLowerCase();
        return all.filter((m) => m.name.toLowerCase().includes(needle));
      }
      return all;
    }
    case "member": {
      const all = await getMembers(HOUSEHOLD_ID);
      if (f.id) return all.find((m) => m.id === f.id) ?? null;
      if (f.name) {
        const needle = f.name.toLowerCase();
        return all.find((m) => m.name.toLowerCase() === needle) ?? null;
      }
      throw new Error("filters.id or filters.name required for kind=member");
    }
    case "scoreboard":
      return await getScoreboard(HOUSEHOLD_ID);
    case "completions": {
      const db = getDb();
      if (!db) return [];
      const start = f.start_date ?? null;
      const end = f.end_date ?? null;
      const rows = await db`
        SELECT tc.id, tc.task_id, tc.completed_by, tc.points_earned,
          TO_CHAR(tc.completed_date, 'YYYY-MM-DD') AS completed_date,
          tc.created_at, t.title AS task_title, fm.name AS member_name
        FROM task_completions tc
        JOIN tasks t ON tc.task_id = t.id
        JOIN family_members fm ON tc.completed_by = fm.id
        WHERE t.household_id = ${HOUSEHOLD_ID}
          AND (${start}::date IS NULL OR tc.completed_date >= ${start})
          AND (${end}::date IS NULL OR tc.completed_date <= ${end})
        ORDER BY tc.completed_date DESC, tc.id DESC
        LIMIT ${f.limit ?? 200}
      `;
      return rows;
    }
    case "recurring_series":
      return await getLatestRecurringInstances(HOUSEHOLD_ID);
    default:
      throw new Error(`Unknown query kind: ${(input as { kind: string }).kind}`);
  }
}

export type WriteInput = {
  kind: "task" | "member";
  op: "create" | "update" | "delete";
  data: Record<string, unknown>;
};

function nullIfEmpty<T>(v: T): T | null {
  return v === "" || v === undefined || v === null ? null : v;
}

export async function runWrite(input: WriteInput): Promise<unknown> {
  const { kind, op, data } = input;

  if (kind === "task") {
    if (op === "create") {
      return await createTask({
        household_id: HOUSEHOLD_ID,
        title: String(data.title ?? ""),
        description: nullIfEmpty(data.description as string),
        assigned_to: (data.assigned_to as number | null) ?? null,
        priority: ((data.priority as string) ?? "medium") as
          | "low"
          | "medium"
          | "high",
        points: (data.points as number) ?? 0,
        due_date: nullIfEmpty(data.due_date as string),
        due_time: nullIfEmpty(data.due_time as string),
        duration_minutes: (data.duration_minutes as number | null) ?? null,
        recurrence_rule: nullIfEmpty(data.recurrence_rule as string),
        source: "mcp",
      });
    }
    if (op === "update") {
      const id = data.id as number | undefined;
      if (!id) throw new Error("data.id required for task update");
      const { id: _omit, ...rest } = data;
      void _omit;
      const normalized = {
        ...rest,
        description: nullIfEmpty(rest.description as string | undefined),
        due_date: nullIfEmpty(rest.due_date as string | undefined),
        due_time: nullIfEmpty(rest.due_time as string | undefined),
        recurrence_rule: nullIfEmpty(
          rest.recurrence_rule as string | undefined
        ),
      } as Record<string, unknown>;
      const result = await updateTask(
        id,
        normalized as Parameters<typeof updateTask>[1]
      );
      if (!result) throw new Error(`Task ${id} not found`);
      return result;
    }
    if (op === "delete") {
      const id = data.id as number | undefined;
      if (!id) throw new Error("data.id required for task delete");
      const ok = await deleteTask(id);
      if (!ok) throw new Error(`Task ${id} not found`);
      return { deleted: id };
    }
  }

  if (kind === "member") {
    const db = getDb();
    if (!db) throw new Error("Database not available");
    if (op === "create") {
      const rows = await db`
        INSERT INTO family_members (household_id, name, role, color, avatar_emoji, sort_order)
        VALUES (
          ${HOUSEHOLD_ID}, ${String(data.name ?? "")},
          ${(data.role as string) ?? "adult"},
          ${(data.color as string) ?? "#888888"},
          ${(data.avatar_emoji as string | null) ?? null},
          ${(data.sort_order as number) ?? 99}
        )
        RETURNING *
      `;
      return rows[0];
    }
    if (op === "update") {
      const id = data.id as number | undefined;
      if (!id) throw new Error("data.id required for member update");
      const existing = await db`SELECT * FROM family_members WHERE id = ${id}`;
      if (existing.length === 0) throw new Error(`Member ${id} not found`);
      const merged = {
        ...existing[0],
        ...data,
      } as Record<string, unknown>;
      const rows = await db`
        UPDATE family_members SET
          name = ${merged.name as string},
          role = ${merged.role as string},
          color = ${merged.color as string},
          avatar_emoji = ${(merged.avatar_emoji as string | null) ?? null},
          sort_order = ${(merged.sort_order as number) ?? 99}
        WHERE id = ${id}
        RETURNING *
      `;
      return rows[0];
    }
    if (op === "delete") {
      const id = data.id as number | undefined;
      if (!id) throw new Error("data.id required for member delete");
      const rows = await db`DELETE FROM family_members WHERE id = ${id} RETURNING id`;
      if (rows.length === 0) throw new Error(`Member ${id} not found`);
      return { deleted: id };
    }
  }

  throw new Error(`Unsupported write: kind=${kind} op=${op}`);
}

export type ActionInput = {
  action:
    | "complete_task"
    | "uncomplete_task"
    | "backfill_recurrence"
    | "assign_task";
  args?: Record<string, unknown>;
};

export async function runAction(input: ActionInput): Promise<unknown> {
  const args = input.args ?? {};
  switch (input.action) {
    case "complete_task": {
      const taskId = args.task_id as number | undefined;
      const completedBy = args.completed_by as number | undefined;
      const date = (args.date as string) ?? formatLocalDate(new Date());
      if (!taskId || !completedBy) {
        throw new Error("args.task_id and args.completed_by required");
      }
      const task = await getTask(taskId);
      const points = (args.points_earned as number) ?? task?.points ?? 0;
      await completeTask(taskId, completedBy, date, points);
      return { task_id: taskId, completed_by: completedBy, date, points };
    }
    case "uncomplete_task": {
      const taskId = args.task_id as number | undefined;
      const date = args.date as string | undefined;
      if (!taskId || !date) {
        throw new Error("args.task_id and args.date required");
      }
      await uncompleteTask(taskId, date);
      return { task_id: taskId, date, success: true };
    }
    case "assign_task": {
      const taskId = args.task_id as number | undefined;
      const memberId = (args.member_id as number | null) ?? null;
      if (!taskId) throw new Error("args.task_id required");
      const result = await updateTask(taskId, { assigned_to: memberId });
      if (!result) throw new Error(`Task ${taskId} not found`);
      return result;
    }
    case "backfill_recurrence": {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const latest = await getLatestRecurringInstances(HOUSEHOLD_ID);
      const created: Array<{ source_task_id: number; new_due_date: string }> =
        [];
      for (const task of latest) {
        if (!task.recurrence_rule || !task.due_date) continue;
        const dueKey = task.due_date.split("T")[0];
        const dueLocal = parseLocalDate(dueKey);
        if (dueLocal.getTime() >= today.getTime()) continue;
        const next = nextOccurrence(task.recurrence_rule, dueLocal);
        if (!next) continue;
        const nextKey = formatLocalDate(next);
        await createTask({
          household_id: task.household_id,
          title: task.title,
          description: task.description,
          assigned_to: task.assigned_to,
          priority: task.priority,
          points: task.points,
          due_date: nextKey,
          due_time: task.due_time,
          duration_minutes: task.duration_minutes,
          recurrence_rule: task.recurrence_rule,
          source: task.source,
          status: "pending",
        });
        created.push({ source_task_id: task.id, new_due_date: nextKey });
      }
      return { created_count: created.length, created };
    }
    default:
      throw new Error(`Unknown action: ${input.action}`);
  }
}

export function describe(): unknown {
  return {
    version: "1.0",
    household_id: HOUSEHOLD_ID,
    entities: {
      task: {
        fields: {
          id: "integer (pk, auto)",
          title: "string (required)",
          description: "string | null",
          assigned_to: "integer (family_members.id) | null",
          priority: "low | medium | high",
          points: "integer (default 0)",
          status: "pending | completed | skipped",
          due_date: "YYYY-MM-DD | null",
          due_time: "HH:MM:SS | null",
          duration_minutes: "integer | null",
          recurrence_rule: "RRULE string | null (e.g. FREQ=DAILY, FREQ=WEEKLY;BYDAY=MO)",
          source: "manual | google | alexa | mcp",
        },
        recurrence_rrule_examples: [
          "FREQ=DAILY",
          "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR",
          "FREQ=WEEKLY;BYDAY=SA",
          "FREQ=WEEKLY;INTERVAL=2;BYDAY=MO",
          "FREQ=MONTHLY;BYMONTHDAY=15",
        ],
      },
      member: {
        fields: {
          id: "integer (pk, auto)",
          name: "string",
          role: "adult | kid",
          color: "#RRGGBB",
          avatar_emoji: "string | null",
          sort_order: "integer",
        },
      },
      completion: {
        fields: {
          id: "integer",
          task_id: "integer",
          completed_by: "integer (member id)",
          completed_date: "YYYY-MM-DD",
          points_earned: "integer",
        },
        note: "Created via calendar_action complete_task, not calendar_write.",
      },
    },
    tools: {
      calendar_query: {
        kinds: [
          "tasks",
          "task",
          "members",
          "member",
          "scoreboard",
          "completions",
          "recurring_series",
        ],
        filters: [
          "id",
          "start_date (YYYY-MM-DD)",
          "end_date (YYYY-MM-DD)",
          "assigned_to",
          "status",
          "name",
          "limit",
        ],
        notes: [
          "kind=tasks defaults to today..today+14 if no dates given",
          "kind=tasks auto-materializes recurring instances in range",
        ],
      },
      calendar_write: {
        kinds: ["task", "member"],
        ops: ["create", "update", "delete"],
        notes: [
          "Mutations on tasks auto-tag source='mcp' on create",
          "Update merges into existing row; only pass fields you want to change + id",
        ],
      },
      calendar_action: {
        actions: [
          "complete_task (args: task_id, completed_by, date?, points_earned?)",
          "uncomplete_task (args: task_id, date)",
          "assign_task (args: task_id, member_id | null)",
          "backfill_recurrence (args: none) — spawns next instance of any recurring series whose latest instance is past",
        ],
      },
      calendar_describe: {
        args: "none",
        returns: "this object",
      },
    },
    dates: {
      timezone: "America/New_York (implied, not enforced server-side)",
      format: "YYYY-MM-DD for dates, HH:MM or HH:MM:SS for times",
    },
  };
}
