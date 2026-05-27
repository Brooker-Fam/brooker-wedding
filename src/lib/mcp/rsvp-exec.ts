import { getDb } from "@/lib/db";

/**
 * Build the `rsvp` object that snippets see at runtime. Methods are thin
 * wrappers over the same `rsvps` / `mailing_lists` tables the admin UI and
 * REST routes use — so anything you can do on /rsvp/admin you can do here in
 * one snippet, composed with normal JS.
 */
function buildRsvpApi(logs: string[]) {
  function db() {
    const conn = getDb();
    if (!conn) throw new Error("Database not available");
    return conn;
  }

  function nullIfEmpty(v: unknown): string | null {
    if (typeof v !== "string") return v == null ? null : String(v);
    const t = v.trim();
    return t.length === 0 ? null : t;
  }

  /** Mirror the REST route: E.164 (+1XXXXXXXXXX), null when empty. */
  function normalizePhone(raw: unknown): string | null {
    if (typeof raw !== "string" || raw.length === 0) return null;
    const digits = raw.replace(/[^\d]/g, "");
    if (digits.length === 0) return null;
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits[0] === "1") return `+${digits}`;
    return `+${digits}`;
  }

  /** Same guest-count rules as the form: ≥1 adult when attending, 0 when not. */
  function counts(attending: boolean, adult: unknown, child: unknown) {
    const adults = attending ? Math.max(1, Number(adult) || 1) : 0;
    const children = attending ? Math.max(0, Number(child) || 0) : 0;
    return { adults, children, guest: adults + children };
  }

  const rsvps = {
    async list(
      opts: {
        attending?: boolean;
        search?: string;
        publicOnly?: boolean;
        limit?: number;
      } = {}
    ) {
      let rows = (await db()`
        SELECT id, name, email, attending, guest_count, adult_count, child_count,
          dietary_restrictions, potluck_dish, message, public_display, phone,
          mailing_address, attendee_names, created_at, updated_at
        FROM rsvps
        ORDER BY created_at DESC
      `) as Record<string, unknown>[];
      if (typeof opts.attending === "boolean") {
        rows = rows.filter((r) => r.attending === opts.attending);
      }
      if (opts.publicOnly) {
        rows = rows.filter((r) => r.public_display === true);
      }
      if (opts.search) {
        const q = opts.search.toLowerCase();
        rows = rows.filter((r) =>
          [r.name, r.email, r.attendee_names, r.message]
            .filter((v): v is string => typeof v === "string")
            .some((v) => v.toLowerCase().includes(q))
        );
      }
      if (opts.limit) rows = rows.slice(0, opts.limit);
      return rows;
    },

    async get(id: number) {
      if (!id) throw new Error("rsvps.get(id): id required");
      const rows = await db()`SELECT * FROM rsvps WHERE id = ${id}`;
      return (rows as unknown[])[0] ?? null;
    },

    async create(data: {
      name: string;
      email?: string | null;
      phone?: string | null;
      mailingAddress?: string | null;
      attending?: boolean;
      adultCount?: number;
      childCount?: number;
      attendeeNames?: string | null;
      dietaryRestrictions?: string | null;
      potluckDish?: string | null;
      message?: string | null;
      publicDisplay?: boolean;
    }) {
      if (!data.name) throw new Error("rsvps.create: name required");
      const attending = data.attending ?? true;
      const { adults, children, guest } = counts(
        attending,
        data.adultCount,
        data.childCount
      );
      const rows = await db()`
        INSERT INTO rsvps
          (name, email, attending, guest_count, adult_count, child_count,
           dietary_restrictions, potluck_dish, message, public_display, phone,
           mailing_address, attendee_names)
        VALUES (
          ${data.name.trim()},
          ${nullIfEmpty(data.email) ?? ""},
          ${attending},
          ${guest}, ${adults}, ${children},
          ${nullIfEmpty(data.dietaryRestrictions) ?? ""},
          ${nullIfEmpty(data.potluckDish) ?? ""},
          ${nullIfEmpty(data.message) ?? ""},
          ${Boolean(data.publicDisplay)},
          ${normalizePhone(data.phone)},
          ${nullIfEmpty(data.mailingAddress) ?? ""},
          ${nullIfEmpty(data.attendeeNames) ?? ""}
        )
        RETURNING *
      `;
      return (rows as unknown[])[0];
    },

    async update(
      id: number,
      patch: {
        name?: string;
        email?: string | null;
        phone?: string | null;
        mailingAddress?: string | null;
        attending?: boolean;
        adultCount?: number;
        childCount?: number;
        attendeeNames?: string | null;
        dietaryRestrictions?: string | null;
        potluckDish?: string | null;
        message?: string | null;
        publicDisplay?: boolean;
      }
    ) {
      if (!id) throw new Error("rsvps.update(id, patch): id required");
      const existing = (await db()`SELECT * FROM rsvps WHERE id = ${id}`) as
        Record<string, unknown>[];
      if (existing.length === 0) throw new Error(`RSVP ${id} not found`);
      const cur = existing[0];

      const attending =
        patch.attending ?? (cur.attending as boolean);
      const adultIn =
        patch.adultCount ?? (cur.adult_count as number);
      const childIn =
        patch.childCount ?? (cur.child_count as number);
      const { adults, children, guest } = counts(attending, adultIn, childIn);

      const rows = await db()`
        UPDATE rsvps SET
          name = ${"name" in patch ? (patch.name ?? "") : (cur.name as string)},
          email = ${"email" in patch ? (nullIfEmpty(patch.email) ?? "") : (cur.email as string)},
          attending = ${attending},
          guest_count = ${guest},
          adult_count = ${adults},
          child_count = ${children},
          dietary_restrictions = ${"dietaryRestrictions" in patch ? (nullIfEmpty(patch.dietaryRestrictions) ?? "") : (cur.dietary_restrictions as string)},
          potluck_dish = ${"potluckDish" in patch ? (nullIfEmpty(patch.potluckDish) ?? "") : (cur.potluck_dish as string)},
          message = ${"message" in patch ? (nullIfEmpty(patch.message) ?? "") : (cur.message as string)},
          public_display = ${"publicDisplay" in patch ? Boolean(patch.publicDisplay) : (cur.public_display as boolean)},
          phone = ${"phone" in patch ? normalizePhone(patch.phone) : (cur.phone as string | null)},
          mailing_address = ${"mailingAddress" in patch ? (nullIfEmpty(patch.mailingAddress) ?? "") : (cur.mailing_address as string)},
          attendee_names = ${"attendeeNames" in patch ? (nullIfEmpty(patch.attendeeNames) ?? "") : (cur.attendee_names as string)},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      return (rows as unknown[])[0];
    },

    async delete(id: number) {
      if (!id) throw new Error("rsvps.delete(id): id required");
      const rows = await db()`DELETE FROM rsvps WHERE id = ${id} RETURNING id`;
      if ((rows as unknown[]).length === 0) {
        throw new Error(`RSVP ${id} not found`);
      }
      return { deleted: id };
    },

    async stats() {
      const rows = await db()`
        SELECT
          COUNT(*)::int AS total_responses,
          COUNT(*) FILTER (WHERE attending)::int AS attending_responses,
          COUNT(*) FILTER (WHERE NOT attending)::int AS regrets,
          COALESCE(SUM(adult_count) FILTER (WHERE attending), 0)::int AS total_adults,
          COALESCE(SUM(child_count) FILTER (WHERE attending), 0)::int AS total_children,
          COALESCE(SUM(guest_count) FILTER (WHERE attending), 0)::int AS total_guests_attending
        FROM rsvps
      `;
      return (rows as unknown[])[0];
    },
  };

  const lists = {
    async list() {
      return await db()`
        SELECT l.id, l.name, l.description, l.created_at,
          COUNT(e.id)::int AS entry_count
        FROM mailing_lists l
        LEFT JOIN mailing_list_entries e ON e.list_id = l.id
        GROUP BY l.id
        ORDER BY l.created_at DESC
      `;
    },

    async get(id: number) {
      if (!id) throw new Error("lists.get(id): id required");
      const rows = (await db()`
        SELECT * FROM mailing_lists WHERE id = ${id}
      `) as Record<string, unknown>[];
      if (rows.length === 0) return null;
      const entries = await lists.entries(id);
      return { ...rows[0], entries };
    },

    async create(data: { name: string; description?: string | null }) {
      if (!data.name) throw new Error("lists.create: name required");
      const rows = await db()`
        INSERT INTO mailing_lists (name, description)
        VALUES (${data.name.trim()}, ${nullIfEmpty(data.description) ?? ""})
        RETURNING id, name, description, created_at
      `;
      return (rows as unknown[])[0];
    },

    async delete(id: number) {
      if (!id) throw new Error("lists.delete(id): id required");
      const rows = await db()`DELETE FROM mailing_lists WHERE id = ${id} RETURNING id`;
      if ((rows as unknown[]).length === 0) {
        throw new Error(`List ${id} not found`);
      }
      return { deleted: id };
    },

    async entries(listId: number) {
      if (!listId) throw new Error("lists.entries(listId): listId required");
      return await db()`
        SELECT e.id, e.list_id, e.rsvp_id, e.addressee, e.notes, e.created_at,
          r.name AS rsvp_name, r.email AS rsvp_email, r.phone AS rsvp_phone,
          r.mailing_address, r.attending, r.attendee_names,
          r.adult_count, r.child_count
        FROM mailing_list_entries e
        JOIN rsvps r ON r.id = e.rsvp_id
        WHERE e.list_id = ${listId}
        ORDER BY r.name ASC
      `;
    },

    async addEntry(
      listId: number,
      rsvpId: number,
      opts: { addressee?: string | null; notes?: string | null } = {}
    ) {
      if (!listId || !rsvpId) {
        throw new Error("lists.addEntry(listId, rsvpId): both required");
      }
      const rows = await db()`
        INSERT INTO mailing_list_entries (list_id, rsvp_id, addressee, notes)
        VALUES (${listId}, ${rsvpId}, ${nullIfEmpty(opts.addressee)}, ${nullIfEmpty(opts.notes)})
        ON CONFLICT (list_id, rsvp_id) DO NOTHING
        RETURNING id, list_id, rsvp_id, addressee, notes, created_at
      `;
      const added = (rows as unknown[])[0];
      return added ?? { skipped: true, reason: "already on list" };
    },

    async removeEntry(listId: number, entryId: number) {
      if (!listId || !entryId) {
        throw new Error("lists.removeEntry(listId, entryId): both required");
      }
      const rows = await db()`
        DELETE FROM mailing_list_entries
        WHERE id = ${entryId} AND list_id = ${listId}
        RETURNING id
      `;
      if ((rows as unknown[]).length === 0) {
        throw new Error(`Entry ${entryId} not found on list ${listId}`);
      }
      return { deleted: entryId };
    },
  };

  return {
    rsvps,
    lists,
    log: (...args: unknown[]) => {
      logs.push(
        args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")
      );
    },
  };
}

const AsyncFunction = Object.getPrototypeOf(async function () {})
  .constructor as new (...args: string[]) => (
  rsvp: ReturnType<typeof buildRsvpApi>
) => Promise<unknown>;

export type RsvpExecResult = {
  result: unknown;
  logs?: string[];
};

/**
 * Execute a snippet against the RSVP API. Mirrors calendar runExec: the snippet
 * receives one arg — `rsvp` — and may return any JSON-serializable value. We
 * don't sandbox the runtime since the MCP transport is already auth-gated to
 * admin-only.
 */
export async function runRsvpExec(code: string): Promise<RsvpExecResult> {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("code (non-empty string) required");
  }
  const logs: string[] = [];
  const api = buildRsvpApi(logs);
  const wrapped = `return (async () => { ${code}\n })();`;
  const fn = new AsyncFunction("rsvp", wrapped);
  const result = await fn(api);
  return logs.length > 0 ? { result, logs } : { result };
}

/**
 * Compact API reference embedded in the tool description so models don't need
 * a separate discovery call. Kept terse on purpose — token cost matters.
 */
export const RSVP_EXEC_API_DOC = `
The \`rsvp\` runtime exposes:

rsvps.list({ attending?, search?, publicOnly?, limit? })   // newest first; search matches name/email/attendee_names/message
rsvps.get(id)
rsvps.create({ name, email?, phone?, mailingAddress?, attending?, adultCount?, childCount?, attendeeNames?, dietaryRestrictions?, potluckDish?, message?, publicDisplay? })
rsvps.update(id, patch)                                    // patch uses the same field names as create; only provided fields change
rsvps.delete(id)
rsvps.stats()                                              // totals: responses, attending, regrets, adults, children, guests

lists.list()                                               // mailing lists with entry_count
lists.get(id)                                              // list + its entries (joined to rsvp details)
lists.create({ name, description? })
lists.delete(id)
lists.entries(listId)
lists.addEntry(listId, rsvpId, { addressee?, notes? })     // idempotent (skips if already on the list)
lists.removeEntry(listId, entryId)

log(...args)                                               // appends to logs[] in the response

Conventions:
- guest_count is derived: when attending, adults defaults to ≥1 and guest_count = adults + children; when not attending, both are 0
- phone is normalized to E.164 (+1XXXXXXXXXX) on write
- publicDisplay = guest opted into showing on the public wall

Examples:
  // who's coming, and how many total guests?
  const s = await rsvp.rsvps.stats();
  return s;

  // find the Smiths and mark them attending with 2 adults + 1 kid
  const [smith] = await rsvp.rsvps.list({ search: "smith" });
  return await rsvp.rsvps.update(smith.id, { attending: true, adultCount: 2, childCount: 1 });

  // build a thank-you mailing list from everyone who's attending
  const list = await rsvp.lists.create({ name: "Thank-yous", description: "Attending guests" });
  const coming = await rsvp.rsvps.list({ attending: true });
  for (const r of coming) await rsvp.lists.addEntry(list.id, r.id, { addressee: r.name });
  return { list: list.id, added: coming.length };
`.trim();
