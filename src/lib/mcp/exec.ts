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

/**
 * Build the `calendar` object that snippets see at runtime. Methods are thin
 * wrappers over the existing calendar DB layer — anything you can do via the
 * old calendar_query/calendar_write/calendar_action tools, you can do here in
 * one snippet, composed with normal JS.
 */
function buildCalendarApi(logs: string[]) {
  const todayStr = () => formatLocalDate(new Date());

  function daysFromNow(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return formatLocalDate(d);
  }

  function nullIfEmpty<T>(v: T | undefined | null): Exclude<T, ""> | null {
    return v === "" || v === undefined || v === null
      ? null
      : (v as Exclude<T, "">);
  }

  const tasks = {
    async list(opts: {
      start?: string;
      end?: string;
      assignedTo?: number;
      status?: string;
      limit?: number;
    } = {}) {
      const start = opts.start ?? todayStr();
      const end = opts.end ?? daysFromNow(14);
      let rows = await getTasksForDateRange(start, end, HOUSEHOLD_ID);
      if (typeof opts.assignedTo === "number") {
        rows = rows.filter((r) => r.assigned_to === opts.assignedTo);
      }
      if (opts.status) {
        rows = rows.filter((r) => r.status === opts.status);
      }
      if (opts.limit) rows = rows.slice(0, opts.limit);
      return rows;
    },

    async get(id: number) {
      if (!id) throw new Error("tasks.get(id): id required");
      return await getTask(id);
    },

    async create(data: {
      title: string;
      description?: string | null;
      assignedTo?: number | null;
      priority?: "low" | "medium" | "high";
      points?: number;
      dueDate?: string | null;
      dueTime?: string | null;
      durationMinutes?: number | null;
      recurrenceRule?: string | null;
    }) {
      if (!data.title) throw new Error("tasks.create: title required");
      return await createTask({
        household_id: HOUSEHOLD_ID,
        title: data.title,
        description: nullIfEmpty(data.description),
        assigned_to: data.assignedTo ?? null,
        priority: data.priority ?? "medium",
        points: data.points ?? 0,
        due_date: nullIfEmpty(data.dueDate),
        due_time: nullIfEmpty(data.dueTime),
        duration_minutes: data.durationMinutes ?? null,
        recurrence_rule: nullIfEmpty(data.recurrenceRule),
        source: "mcp",
      });
    },

    async update(
      id: number,
      patch: {
        title?: string;
        description?: string | null;
        assignedTo?: number | null;
        status?: string;
        priority?: "low" | "medium" | "high";
        points?: number;
        dueDate?: string | null;
        dueTime?: string | null;
        durationMinutes?: number | null;
        recurrenceRule?: string | null;
      }
    ) {
      if (!id) throw new Error("tasks.update(id, patch): id required");
      const mapped: Parameters<typeof updateTask>[1] = {};
      if ("title" in patch) mapped.title = patch.title;
      if ("description" in patch)
        mapped.description = nullIfEmpty(patch.description);
      if ("assignedTo" in patch) mapped.assigned_to = patch.assignedTo;
      if ("status" in patch)
        mapped.status = patch.status as Parameters<
          typeof updateTask
        >[1]["status"];
      if ("priority" in patch) mapped.priority = patch.priority;
      if ("points" in patch) mapped.points = patch.points;
      if ("dueDate" in patch) mapped.due_date = nullIfEmpty(patch.dueDate);
      if ("dueTime" in patch) mapped.due_time = nullIfEmpty(patch.dueTime);
      if ("durationMinutes" in patch)
        mapped.duration_minutes = patch.durationMinutes;
      if ("recurrenceRule" in patch)
        mapped.recurrence_rule = nullIfEmpty(patch.recurrenceRule);
      const result = await updateTask(id, mapped);
      if (!result) throw new Error(`Task ${id} not found`);
      return result;
    },

    async delete(id: number) {
      if (!id) throw new Error("tasks.delete(id): id required");
      const ok = await deleteTask(id);
      if (!ok) throw new Error(`Task ${id} not found`);
      return { deleted: id };
    },

    async complete(
      id: number,
      args: { memberId: number; date?: string; points?: number }
    ) {
      if (!id || !args?.memberId) {
        throw new Error("tasks.complete(id, { memberId }): both required");
      }
      const date = args.date ?? todayStr();
      const task = await getTask(id);
      const points = args.points ?? task?.points ?? 0;
      await completeTask(id, args.memberId, date, points);
      return { taskId: id, memberId: args.memberId, date, points };
    },

    async uncomplete(id: number, date: string) {
      if (!id || !date) {
        throw new Error("tasks.uncomplete(id, date): both required");
      }
      await uncompleteTask(id, date);
      return { taskId: id, date, success: true };
    },

    async assign(id: number, memberId: number | null) {
      if (!id) throw new Error("tasks.assign(id, memberId): id required");
      const result = await updateTask(id, { assigned_to: memberId });
      if (!result) throw new Error(`Task ${id} not found`);
      return result;
    },

    async backfillRecurrence() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const latest = await getLatestRecurringInstances(HOUSEHOLD_ID);
      const created: Array<{ sourceTaskId: number; newDueDate: string }> = [];
      for (const t of latest) {
        if (!t.recurrence_rule || !t.due_date) continue;
        const dueKey = t.due_date.split("T")[0];
        const dueLocal = parseLocalDate(dueKey);
        if (dueLocal.getTime() >= today.getTime()) continue;
        const next = nextOccurrence(t.recurrence_rule, dueLocal);
        if (!next) continue;
        const nextKey = formatLocalDate(next);
        await createTask({
          household_id: t.household_id,
          title: t.title,
          description: t.description,
          assigned_to: t.assigned_to,
          priority: t.priority,
          points: t.points,
          due_date: nextKey,
          due_time: t.due_time,
          duration_minutes: t.duration_minutes,
          recurrence_rule: t.recurrence_rule,
          source: t.source,
          status: "pending",
        });
        created.push({ sourceTaskId: t.id, newDueDate: nextKey });
      }
      return { createdCount: created.length, created };
    },
  };

  const members = {
    async list(opts: { name?: string } = {}) {
      const all = await getMembers(HOUSEHOLD_ID);
      if (!opts.name) return all;
      const needle = opts.name.toLowerCase();
      return all.filter((m) => m.name.toLowerCase().includes(needle));
    },

    async get(idOrName: number | string) {
      const all = await getMembers(HOUSEHOLD_ID);
      if (typeof idOrName === "number") {
        return all.find((m) => m.id === idOrName) ?? null;
      }
      const needle = idOrName.toLowerCase();
      return all.find((m) => m.name.toLowerCase() === needle) ?? null;
    },

    async create(data: {
      name: string;
      role?: "adult" | "kid";
      color?: string;
      avatarEmoji?: string | null;
      sortOrder?: number;
    }) {
      const db = getDb();
      if (!db) throw new Error("Database not available");
      if (!data.name) throw new Error("members.create: name required");
      const rows = await db`
        INSERT INTO family_members (household_id, name, role, color, avatar_emoji, sort_order)
        VALUES (
          ${HOUSEHOLD_ID}, ${data.name},
          ${data.role ?? "adult"},
          ${data.color ?? "#888888"},
          ${data.avatarEmoji ?? null},
          ${data.sortOrder ?? 99}
        )
        RETURNING *
      `;
      return rows[0];
    },

    async update(
      id: number,
      patch: {
        name?: string;
        role?: "adult" | "kid";
        color?: string;
        avatarEmoji?: string | null;
        sortOrder?: number;
      }
    ) {
      const db = getDb();
      if (!db) throw new Error("Database not available");
      if (!id) throw new Error("members.update(id, patch): id required");
      const existing = await db`SELECT * FROM family_members WHERE id = ${id}`;
      if (existing.length === 0) throw new Error(`Member ${id} not found`);
      const merged = { ...existing[0], ...patch } as Record<string, unknown>;
      const rows = await db`
        UPDATE family_members SET
          name = ${merged.name as string},
          role = ${merged.role as string},
          color = ${merged.color as string},
          avatar_emoji = ${(merged.avatarEmoji ?? merged.avatar_emoji ?? null) as string | null},
          sort_order = ${(merged.sortOrder ?? merged.sort_order ?? 99) as number}
        WHERE id = ${id}
        RETURNING *
      `;
      return rows[0];
    },

    async delete(id: number) {
      const db = getDb();
      if (!db) throw new Error("Database not available");
      if (!id) throw new Error("members.delete(id): id required");
      const rows = await db`DELETE FROM family_members WHERE id = ${id} RETURNING id`;
      if (rows.length === 0) throw new Error(`Member ${id} not found`);
      return { deleted: id };
    },
  };

  const completions = {
    async list(opts: { start?: string; end?: string; limit?: number } = {}) {
      const db = getDb();
      if (!db) return [];
      const start = opts.start ?? null;
      const end = opts.end ?? null;
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
        LIMIT ${opts.limit ?? 200}
      `;
      return rows;
    },
  };

  return {
    tasks,
    members,
    completions,
    scoreboard: () => getScoreboard(HOUSEHOLD_ID),
    recurring: { latest: () => getLatestRecurringInstances(HOUSEHOLD_ID) },
    today: todayStr,
    daysFromNow,
    formatDate: formatLocalDate,
    parseDate: parseLocalDate,
    log: (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    },
  };
}

const AsyncFunction = Object.getPrototypeOf(async function () {})
  .constructor as new (...args: string[]) => (
  calendar: ReturnType<typeof buildCalendarApi>
) => Promise<unknown>;

export type ExecResult = {
  result: unknown;
  logs?: string[];
};

/**
 * Execute a snippet against the calendar API. The snippet receives one arg —
 * `calendar` — and may return any JSON-serializable value (or void). Errors
 * propagate to the caller; we don't sandbox the runtime since the MCP transport
 * is already auth-gated to admin-only.
 */
export async function runExec(code: string): Promise<ExecResult> {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("code (non-empty string) required");
  }
  const logs: string[] = [];
  const api = buildCalendarApi(logs);
  // Wrap the snippet so bare `await` works and the return statement is optional.
  const wrapped = `return (async () => { ${code}\n })();`;
  const fn = new AsyncFunction("calendar", wrapped);
  const result = await fn(api);
  return logs.length > 0 ? { result, logs } : { result };
}

/**
 * Compact API reference embedded in the tool description so models don't need
 * a separate discovery call. Kept terse on purpose — token cost matters.
 */
export const EXEC_API_DOC = `
The \`calendar\` runtime exposes:

tasks.list({ start?, end?, assignedTo?, status?, limit? })   // defaults to today..+14d, auto-materializes recurring
tasks.get(id)
tasks.create({ title, description?, assignedTo?, priority?, points?, dueDate?, dueTime?, durationMinutes?, recurrenceRule? })
tasks.update(id, patch)                                       // patch uses the same field names as create
tasks.delete(id)
tasks.complete(id, { memberId, date?, points? })              // date defaults today, points defaults to task.points
tasks.uncomplete(id, date)
tasks.assign(id, memberId | null)
tasks.backfillRecurrence()                                    // spawn next instance of any series whose latest is past

members.list({ name? })          // name does substring match
members.get(idOrName)            // exact name match
members.create({ name, role?, color?, avatarEmoji?, sortOrder? })
members.update(id, patch)
members.delete(id)

scoreboard()                     // per-member week/month/all-time points
completions.list({ start?, end?, limit? })
recurring.latest()               // latest instance per recurring series

today()                          // YYYY-MM-DD
daysFromNow(n)                   // YYYY-MM-DD
formatDate(d), parseDate(s)
log(...args)                     // appends to logs[] in the response

Conventions:
- dates are YYYY-MM-DD, times are HH:MM[:SS], household is implicit (Brooker = 1)
- priority: "low" | "medium" | "high"; status: "pending" | "completed" | "skipped"
- recurrenceRule is an RRULE string, e.g. "FREQ=DAILY", "FREQ=WEEKLY;BYDAY=MO,WE,FR"

Examples:
  // list pending TKD tasks this week and assign them to Emmett
  const emmett = await calendar.members.get("Emmett");
  const tasks = await calendar.tasks.list({ end: calendar.daysFromNow(7) });
  for (const t of tasks.filter(x => /TKD/i.test(x.title) && x.status === "pending")) {
    await calendar.tasks.assign(t.id, emmett.id);
  }
  return tasks.length;

  // mark today's chore done for Sapphire
  const s = await calendar.members.get("Sapphire");
  const todays = await calendar.tasks.list({ start: calendar.today(), end: calendar.today(), assignedTo: s.id });
  for (const t of todays) await calendar.tasks.complete(t.id, { memberId: s.id });
`.trim();
