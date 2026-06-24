"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────────────────────── */

type GuestType = "adult" | "child";

interface Rsvp {
  id: number;
  name: string;
  attending: boolean;
  adult_count: number;
  child_count: number;
  attendee_names: string | null;
}

/** One physical person derived from an RSVP. `key` is stable across reloads. */
interface Guest {
  key: string;
  name: string;
  type: GuestType;
  rsvpId: number;
  rsvpName: string;
}

interface Assignment {
  groupId?: string | null;
  tableId?: string | null;
  listId?: string | null;
}

interface TableConfig {
  id: string;
  name: string;
  seats: number;
}

interface GroupConfig {
  id: string;
  name: string;
  color: string;
}

/** A loose planning list -- a place to gather people before deciding tables. */
interface ListConfig {
  id: string;
  name: string;
}

interface ChartDoc {
  tables: TableConfig[];
  groups: GroupConfig[];
  lists: ListConfig[];
  assignments: Record<string, Assignment>;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

/* ──────────────────────────────────────────────────────────────────────────
   Guest derivation (mirrors the parsing on the public RSVP form)
   ────────────────────────────────────────────────────────────────────────── */

interface ParsedAttendee {
  name: string;
  type: GuestType;
}

function parseAttendees(
  raw: string | null | undefined,
  adultCount: number,
  childCount: number,
  primaryName: string
): ParsedAttendee[] {
  const lines = (raw ?? "")
    .split(/\n+/)
    .flatMap((line) => line.split(","))
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 0) {
    return lines.map((line) => {
      const match = line.match(/\s*\((adult|child)\)\s*$/i);
      if (match) {
        return {
          name: line.replace(/\s*\((adult|child)\)\s*$/i, "").trim(),
          type: match[1].toLowerCase() === "child" ? "child" : "adult",
        };
      }
      return { name: line, type: "adult" as GuestType };
    });
  }

  // No named attendees on file -- fall back to the adult/child counts so the
  // people still show up (as placeholders) and can be seated.
  const entries: ParsedAttendee[] = [];
  const adults = Math.max(1, adultCount || 1);
  const children = Math.max(0, childCount || 0);
  for (let i = 0; i < adults; i++) {
    entries.push({ name: i === 0 ? primaryName : "", type: "adult" });
  }
  for (let i = 0; i < children; i++) {
    entries.push({ name: "", type: "child" });
  }
  return entries.length > 0 ? entries : [{ name: primaryName, type: "adult" }];
}

function slug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function deriveGuests(rsvps: Rsvp[]): Guest[] {
  const guests: Guest[] = [];
  for (const r of rsvps) {
    if (!r.attending) continue;
    const entries = parseAttendees(r.attendee_names, r.adult_count, r.child_count, r.name);
    entries.forEach((entry, index) => {
      const trimmed = entry.name.trim();
      const name = trimmed || `Guest ${index + 1} of ${r.name}`;
      const key = trimmed ? `${r.id}::${slug(trimmed)}` : `${r.id}::slot${index}`;
      guests.push({
        key,
        name,
        type: entry.type,
        rsvpId: r.id,
        rsvpName: r.name,
      });
    });
  }
  return guests;
}

/** Everyone who came in on one RSVP -- a household to drag as a unit. */
interface Party {
  rsvpId: number;
  rsvpName: string;
  label: string;
  members: Guest[];
}

function lastNameOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 0 ? parts[parts.length - 1] : "";
}

/** "The Brooker family" when a surname is shared, otherwise the primary's party. */
function partyLabel(members: Guest[]): string {
  const counts = new Map<string, { display: string; n: number }>();
  for (const m of members) {
    const ln = lastNameOf(m.name);
    if (!ln) continue;
    const key = ln.toLowerCase();
    const existing = counts.get(key);
    counts.set(key, { display: ln, n: (existing?.n ?? 0) + 1 });
  }
  let best: { display: string; n: number } | null = null;
  for (const v of counts.values()) {
    if (!best || v.n > best.n) best = v;
  }
  if (best && best.n >= 2) return `The ${best.display} family`;
  return `${members[0].rsvpName}'s party`;
}

/** Group an ordered guest list into RSVP parties, preserving order. */
function clusterByParty(guests: Guest[]): Party[] {
  const byRsvp = new Map<number, Guest[]>();
  for (const g of guests) {
    const list = byRsvp.get(g.rsvpId);
    if (list) list.push(g);
    else byRsvp.set(g.rsvpId, [g]);
  }
  return [...byRsvp.entries()].map(([rsvpId, members]) => ({
    rsvpId,
    rsvpName: members[0].rsvpName,
    label: partyLabel(members),
    members,
  }));
}

/* ──────────────────────────────────────────────────────────────────────────
   Chart defaults + normalization
   ────────────────────────────────────────────────────────────────────────── */

const GROUP_PALETTE = [
  "#5C7A4A", // sage
  "#C49A3C", // gold
  "#8B6FA8", // lavender/plum
  "#B0566F", // blush-rose
  "#3F7E86", // teal
  "#A4632F", // terracotta
  "#5A7BB5", // dusty blue
  "#6B8E23", // olive
];

function defaultChart(): ChartDoc {
  const tables: TableConfig[] = [];
  for (let i = 1; i <= 6; i++) tables.push({ id: `t${i}`, name: `Table ${i}`, seats: 10 });
  for (let i = 7; i <= 16; i++) tables.push({ id: `t${i}`, name: `Table ${i}`, seats: 8 });
  return {
    tables,
    groups: [{ id: "g-brookers", name: "Brookers", color: GROUP_PALETTE[0] }],
    lists: [],
    assignments: {},
  };
}

function normalizeChart(raw: unknown): ChartDoc {
  const base = defaultChart();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<ChartDoc>;

  const tables = Array.isArray(r.tables) && r.tables.length > 0
    ? r.tables
        .filter((t) => t && typeof t.id === "string")
        .map((t) => ({
          id: t.id,
          name: typeof t.name === "string" && t.name ? t.name : t.id,
          seats: Number.isFinite(t.seats) ? Math.max(1, Math.round(t.seats)) : 8,
        }))
    : base.tables;

  const groups = Array.isArray(r.groups)
    ? r.groups
        .filter((g) => g && typeof g.id === "string")
        .map((g, i) => ({
          id: g.id,
          name: typeof g.name === "string" && g.name ? g.name : "Group",
          color: typeof g.color === "string" && g.color ? g.color : GROUP_PALETTE[i % GROUP_PALETTE.length],
        }))
    : base.groups;

  const lists = Array.isArray(r.lists)
    ? r.lists
        .filter((l) => l && typeof l.id === "string")
        .map((l) => ({
          id: l.id,
          name: typeof l.name === "string" && l.name ? l.name : "List",
        }))
    : base.lists;

  const assignments: Record<string, Assignment> =
    r.assignments && typeof r.assignments === "object" ? { ...r.assignments } : {};

  return { tables, groups, lists, assignments };
}

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
}

/* ──────────────────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────────────────── */

export default function SeatingChartPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [chart, setChart] = useState<ChartDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dbConnected, setDbConnected] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"tables" | "lists">("tables");

  // Drag state -- a drag can carry one guest or a whole party/group/list.
  const [draggingKeys, setDraggingKeys] = useState<Set<string>>(new Set());
  const [overTarget, setOverTarget] = useState<string | null>(null);

  // Autosave plumbing
  const skipNextSave = useRef(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Initial load ── */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [rsvpRes, chartRes] = await Promise.all([
          fetch("/api/rsvp"),
          fetch("/api/seating"),
        ]);
        const rsvpJson = await rsvpRes.json();
        const chartJson = await chartRes.json();
        if (cancelled) return;
        if (!rsvpRes.ok) throw new Error(rsvpJson.error || "Failed to load RSVPs");

        setGuests(deriveGuests(rsvpJson.data ?? []));
        setChart(normalizeChart(chartJson.data));
        if (chartJson.mock) setDbConnected(false);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load seating chart");
          setChart(defaultChart());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Debounced autosave ── */
  const saveChart = useCallback(async (doc: ChartDoc) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/seating", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart: doc }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      if (json.mock) {
        setDbConnected(false);
        setSaveStatus("error");
      } else {
        setSaveStatus("saved");
      }
    } catch {
      setSaveStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!chart) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveChart(chart), 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [chart, saveChart]);

  /* ── Assignment helpers ── */
  const assign = useCallback((key: string, patch: Assignment) => {
    setChart((prev) => {
      if (!prev) return prev;
      const current = prev.assignments[key] ?? {};
      return {
        ...prev,
        assignments: { ...prev.assignments, [key]: { ...current, ...patch } },
      };
    });
  }, []);
  const assignMany = useCallback((keys: string[], patch: Assignment) => {
    if (keys.length === 0) return;
    setChart((prev) => {
      if (!prev) return prev;
      const assignments = { ...prev.assignments };
      for (const key of keys) {
        assignments[key] = { ...(assignments[key] ?? {}), ...patch };
      }
      return { ...prev, assignments };
    });
  }, []);

  /* ── Drag handlers ── */
  // A drag carries either a single guest key, or a whole party/group/list
  // encoded as "keys:k1,k2,...". `draggingKeys` mirrors that for highlighting.
  const onDragStart = (keys: string[]) => setDraggingKeys(new Set(keys));
  const onDragEnd = () => {
    setDraggingKeys(new Set());
    setOverTarget(null);
  };
  const dropGuestKeys = (e: React.DragEvent): string[] => {
    const payload = e.dataTransfer.getData("text/plain");
    if (payload.startsWith("keys:")) return payload.slice(5).split(",").filter(Boolean);
    if (payload) return [payload];
    return draggingKeys.size > 0 ? [...draggingKeys] : [];
  };

  const handleDropToTable = (e: React.DragEvent, tableId: string) => {
    e.preventDefault();
    assignMany(dropGuestKeys(e), { tableId });
    onDragEnd();
  };
  const handleDropToGroup = (e: React.DragEvent, groupId: string | null) => {
    e.preventDefault();
    assignMany(dropGuestKeys(e), { groupId });
    onDragEnd();
  };
  const handleDropToList = (e: React.DragEvent, listId: string | null) => {
    e.preventDefault();
    assignMany(dropGuestKeys(e), { listId });
    onDragEnd();
  };

  /* ── Table layout editing ── */
  const renameTable = (id: string, name: string) =>
    setChart((p) => p && { ...p, tables: p.tables.map((t) => (t.id === id ? { ...t, name } : t)) });
  const setTableSeats = (id: string, seats: number) =>
    setChart(
      (p) =>
        p && {
          ...p,
          tables: p.tables.map((t) =>
            t.id === id
              ? { ...t, seats: Number.isFinite(seats) ? Math.max(1, Math.round(seats)) : t.seats }
              : t
          ),
        }
    );
  const addTable = (seats: number) =>
    setChart((p) => {
      if (!p) return p;
      const id = newId("t");
      return { ...p, tables: [...p.tables, { id, name: `Table ${p.tables.length + 1}`, seats }] };
    });
  const removeTable = (id: string) =>
    setChart((p) => {
      if (!p) return p;
      const assignments = { ...p.assignments };
      for (const k of Object.keys(assignments)) {
        if (assignments[k].tableId === id) assignments[k] = { ...assignments[k], tableId: null };
      }
      return { ...p, tables: p.tables.filter((t) => t.id !== id), assignments };
    });

  /* ── Group editing ── */
  const renameGroup = (id: string, name: string) =>
    setChart((p) => p && { ...p, groups: p.groups.map((g) => (g.id === id ? { ...g, name } : g)) });
  const addGroup = () =>
    setChart((p) => {
      if (!p) return p;
      const id = newId("g");
      const color = GROUP_PALETTE[p.groups.length % GROUP_PALETTE.length];
      return { ...p, groups: [...p.groups, { id, name: "New group", color }] };
    });
  const removeGroup = (id: string) =>
    setChart((p) => {
      if (!p) return p;
      const assignments = { ...p.assignments };
      for (const k of Object.keys(assignments)) {
        if (assignments[k].groupId === id) assignments[k] = { ...assignments[k], groupId: null };
      }
      return { ...p, groups: p.groups.filter((g) => g.id !== id), assignments };
    });

  /* ── Planning-list editing ── */
  const renameList = (id: string, name: string) =>
    setChart((p) => p && { ...p, lists: p.lists.map((l) => (l.id === id ? { ...l, name } : l)) });
  const addList = () =>
    setChart((p) => {
      if (!p) return p;
      const id = newId("l");
      return { ...p, lists: [...p.lists, { id, name: "New list" }] };
    });
  const removeList = (id: string) =>
    setChart((p) => {
      if (!p) return p;
      const assignments = { ...p.assignments };
      for (const k of Object.keys(assignments)) {
        if (assignments[k].listId === id) assignments[k] = { ...assignments[k], listId: null };
      }
      return { ...p, lists: p.lists.filter((l) => l.id !== id), assignments };
    });

  /* ── Derived views ── */
  const assignmentOf = useCallback(
    (key: string): Assignment => chart?.assignments[key] ?? {},
    [chart]
  );

  const groupColor = useCallback(
    (groupId: string | null | undefined): string | null => {
      if (!groupId || !chart) return null;
      return chart.groups.find((g) => g.id === groupId)?.color ?? null;
    },
    [chart]
  );

  const filteredGuests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter((g) => g.name.toLowerCase().includes(q) || g.rsvpName.toLowerCase().includes(q));
  }, [guests, search]);

  // Roster groupings (everyone shows here, grouped by their family/circle)
  const ungrouped = useMemo(
    () => filteredGuests.filter((g) => !assignmentOf(g.key).groupId),
    [filteredGuests, assignmentOf]
  );
  const membersOfGroup = useCallback(
    (groupId: string) => filteredGuests.filter((g) => assignmentOf(g.key).groupId === groupId),
    [filteredGuests, assignmentOf]
  );
  const seatedAt = useCallback(
    (tableId: string) => guests.filter((g) => assignmentOf(g.key).tableId === tableId),
    [guests, assignmentOf]
  );

  const tableNameOf = useCallback(
    (tableId: string | null | undefined): string | null => {
      if (!tableId || !chart) return null;
      return chart.tables.find((t) => t.id === tableId)?.name ?? null;
    },
    [chart]
  );

  const membersOfList = useCallback(
    (listId: string) => filteredGuests.filter((g) => assignmentOf(g.key).listId === listId),
    [filteredGuests, assignmentOf]
  );
  const listNameOf = useCallback(
    (listId: string | null | undefined): string | null => {
      if (!listId || !chart) return null;
      return chart.lists.find((l) => l.id === listId)?.name ?? null;
    },
    [chart]
  );

  const totalGuests = guests.length;
  const seatedCount = useMemo(
    () => guests.filter((g) => assignmentOf(g.key).tableId).length,
    [guests, assignmentOf]
  );
  const listedCount = useMemo(
    () => guests.filter((g) => assignmentOf(g.key).listId).length,
    [guests, assignmentOf]
  );

  /* ── Render ── */
  if (loading) {
    return (
      <div className="enchanted-bg min-h-screen">
        <div className="py-32 text-center">
          <svg className="mx-auto h-8 w-8 animate-spin text-sage" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    );
  }

  if (!chart) return null;

  const totalSeats = chart.tables.reduce((sum, t) => sum + t.seats, 0);

  return (
    <div className="enchanted-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/rsvp/admin"
            className="text-sm text-sage underline underline-offset-2 hover:text-sage-dark dark:text-sage-light"
          >
            ← RSVP Admin
          </Link>
          <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-forest dark:text-cream sm:text-4xl">
            Seating Chart
          </h1>
          <SaveIndicator status={saveStatus} dbConnected={dbConnected} />
        </div>

        {error && (
          <div className="soft-card mx-auto mb-6 max-w-xl p-4 text-center">
            <p className="text-sm text-deep-plum dark:text-cream">{error}</p>
            <button onClick={() => setError("")} className="mt-2 text-xs text-sage underline">
              Dismiss
            </button>
          </div>
        )}

        {!dbConnected && (
          <div className="mx-auto mb-6 max-w-xl rounded-xl border border-amber-400/40 bg-amber-50/70 p-4 text-center text-sm text-amber-900 dark:border-amber-300/30 dark:bg-amber-900/20 dark:text-amber-100">
            Database isn&apos;t connected, so changes won&apos;t be saved. You can still rearrange
            things to plan, but reloading will reset the chart.
          </div>
        )}

        {/* Stats */}
        <div className="soft-card mb-6 flex flex-wrap justify-center gap-6 p-5 sm:gap-10">
          <Stat label="Attending" value={totalGuests} />
          <Stat label="Seated" value={seatedCount} />
          <Stat label="Unseated" value={totalGuests - seatedCount} />
          {chart.lists.length > 0 && <Stat label="Listed" value={listedCount} />}
          <Stat label="Tables" value={chart.tables.length} />
          <Stat label="Total Seats" value={totalSeats} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* ── Roster / Groups ── */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
            <div className="soft-card p-4">
              <h2 className="mb-1 font-[family-name:var(--font-cormorant-garamond)] text-xl font-semibold text-forest dark:text-cream">
                Guest Roster
              </h2>
              <p className="mb-3 text-xs text-deep-plum/60 dark:text-cream/60">
                People who RSVP&apos;d together stay bundled as a household — grab the{" "}
                <span className="font-semibold">⠿ handle</span> to drag a whole party onto a table
                or list at once, or drag one person at a time. Use the <strong>Lists</strong> tab to
                gather loose planning groups before deciding tables.
              </p>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guests…"
                className="enchanted-input !py-2 text-sm"
              />
            </div>

            {/* Ungrouped pool, clustered by RSVP party */}
            <GroupColumn
              title="Households"
              color={null}
              count={ungrouped.length}
              isOver={overTarget === "ungroup"}
              onDragOver={(e) => {
                e.preventDefault();
                setOverTarget("ungroup");
              }}
              onDragLeave={() => setOverTarget((t) => (t === "ungroup" ? null : t))}
              onDrop={(e) => handleDropToGroup(e, null)}
            >
              {ungrouped.length === 0 ? (
                <EmptyHint>Everyone has been put in a family group.</EmptyHint>
              ) : (
                clusterByParty(ungrouped).map((party) =>
                  party.members.length === 1 ? (
                    <GuestChip
                      key={party.members[0].key}
                      guest={party.members[0]}
                      dragging={draggingKeys.has(party.members[0].key)}
                      color={null}
                      seatedTable={tableNameOf(assignmentOf(party.members[0].key).tableId)}
                      listName={listNameOf(assignmentOf(party.members[0].key).listId)}
                      onDragStart={() => onDragStart([party.members[0].key])}
                      onDragEnd={onDragEnd}
                    />
                  ) : (
                    <PartyCluster
                      key={party.rsvpId}
                      party={party}
                      draggingKeys={draggingKeys}
                      seatedTableOf={(key) => tableNameOf(assignmentOf(key).tableId)}
                      listNameOf2={(key) => listNameOf(assignmentOf(key).listId)}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                    />
                  )
                )
              )}
            </GroupColumn>

            {/* Custom family groups */}
            {chart.groups.map((group) => {
              const members = membersOfGroup(group.id);
              const groupKeys = guests
                .filter((g) => assignmentOf(g.key).groupId === group.id)
                .map((g) => g.key);
              return (
                <GroupColumn
                  key={group.id}
                  title={group.name}
                  color={group.color}
                  count={members.length}
                  editable
                  grip={
                    <DragGrip
                      memberKeys={groupKeys}
                      title={`Drag everyone in ${group.name} together`}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                    />
                  }
                  onRename={(name) => renameGroup(group.id, name)}
                  onRemove={() => removeGroup(group.id)}
                  isOver={overTarget === `group:${group.id}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverTarget(`group:${group.id}`);
                  }}
                  onDragLeave={() =>
                    setOverTarget((t) => (t === `group:${group.id}` ? null : t))
                  }
                  onDrop={(e) => handleDropToGroup(e, group.id)}
                >
                  {members.length === 0 ? (
                    <EmptyHint>Drag guests here.</EmptyHint>
                  ) : (
                    members.map((g) => (
                      <GuestChip
                        key={g.key}
                        guest={g}
                        dragging={draggingKeys.has(g.key)}
                        color={group.color}
                        seatedTable={tableNameOf(assignmentOf(g.key).tableId)}
                        listName={listNameOf(assignmentOf(g.key).listId)}
                        onDragStart={() => onDragStart([g.key])}
                        onDragEnd={onDragEnd}
                      />
                    ))
                  )}
                </GroupColumn>
              );
            })}

            <button
              type="button"
              onClick={addGroup}
              className="w-full rounded-xl border border-dashed border-sage/40 px-4 py-3 text-sm font-medium text-sage transition-colors hover:bg-sage/10 dark:text-sage-light"
            >
              + Add group
            </button>
          </aside>

          {/* ── Tables / Lists workspace ── */}
          <main className="space-y-4">
            {/* View toggle */}
            <div className="soft-card flex items-center gap-1 p-1.5">
              {([
                { id: "tables", label: "🪑 Tables" },
                { id: "lists", label: "📋 Lists" },
              ] as const).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    view === v.id
                      ? "bg-sage/20 text-forest dark:text-cream"
                      : "text-deep-plum/60 hover:bg-sage/10 dark:text-cream/60"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {view === "tables" && (
            <>
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {chart.tables.map((table) => {
                const seated = seatedAt(table.id);
                const over = seated.length > table.seats;
                return (
                  <TableCard
                    key={table.id}
                    table={table}
                    seatedCount={seated.length}
                    overCapacity={over}
                    isOver={overTarget === `table:${table.id}`}
                    onRename={(name) => renameTable(table.id, name)}
                    onSeatsChange={(n) => setTableSeats(table.id, n)}
                    onRemove={() => removeTable(table.id)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setOverTarget(`table:${table.id}`);
                    }}
                    onDragLeave={() =>
                      setOverTarget((t) => (t === `table:${table.id}` ? null : t))
                    }
                    onDrop={(e) => handleDropToTable(e, table.id)}
                  >
                    {seated.length === 0 ? (
                      <EmptyHint>Drag guests here to seat them.</EmptyHint>
                    ) : (
                      seated.map((g) => (
                        <GuestChip
                          key={g.key}
                          guest={g}
                          dragging={draggingKeys.has(g.key)}
                          color={groupColor(assignmentOf(g.key).groupId)}
                          listName={listNameOf(assignmentOf(g.key).listId)}
                          onRemove={() => assign(g.key, { tableId: null })}
                          removeTitle="Remove from table"
                          onDragStart={() => onDragStart([g.key])}
                          onDragEnd={onDragEnd}
                        />
                      ))
                    )}
                  </TableCard>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addTable(10)}
                className="rounded-xl border border-dashed border-sage/40 px-4 py-2.5 text-sm font-medium text-sage transition-colors hover:bg-sage/10 dark:text-sage-light"
              >
                + Add 10-top table
              </button>
              <button
                type="button"
                onClick={() => addTable(8)}
                className="rounded-xl border border-dashed border-sage/40 px-4 py-2.5 text-sm font-medium text-sage transition-colors hover:bg-sage/10 dark:text-sage-light"
              >
                + Add 8-top table
              </button>
            </div>
            </>
            )}

            {view === "lists" && (
              <>
                {chart.lists.length === 0 ? (
                  <div className="soft-card p-8 text-center text-sm text-deep-plum/60 dark:text-cream/60">
                    Planning lists are loose buckets — gather people here (&ldquo;maybe sit
                    together&rdquo;, &ldquo;still deciding&rdquo;) without committing them to a table
                    or a family group. Add your first list to start.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                    {chart.lists.map((list) => {
                      const members = membersOfList(list.id);
                      const listKeys = guests
                        .filter((g) => assignmentOf(g.key).listId === list.id)
                        .map((g) => g.key);
                      return (
                        <GroupColumn
                          key={list.id}
                          title={list.name}
                          color={null}
                          count={members.length}
                          editable
                          grip={
                            <DragGrip
                              memberKeys={listKeys}
                              title={`Drag everyone in ${list.name} together`}
                              onDragStart={onDragStart}
                              onDragEnd={onDragEnd}
                            />
                          }
                          onRename={(name) => renameList(list.id, name)}
                          onRemove={() => removeList(list.id)}
                          isOver={overTarget === `list:${list.id}`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setOverTarget(`list:${list.id}`);
                          }}
                          onDragLeave={() =>
                            setOverTarget((t) => (t === `list:${list.id}` ? null : t))
                          }
                          onDrop={(e) => handleDropToList(e, list.id)}
                        >
                          {members.length === 0 ? (
                            <EmptyHint>Drag guests here.</EmptyHint>
                          ) : (
                            members.map((g) => (
                              <GuestChip
                                key={g.key}
                                guest={g}
                                dragging={draggingKeys.has(g.key)}
                                color={groupColor(assignmentOf(g.key).groupId)}
                                seatedTable={tableNameOf(assignmentOf(g.key).tableId)}
                                onRemove={() => assign(g.key, { listId: null })}
                                removeTitle="Remove from list"
                                onDragStart={() => onDragStart([g.key])}
                                onDragEnd={onDragEnd}
                              />
                            ))
                          )}
                        </GroupColumn>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={addList}
                    className="rounded-xl border border-dashed border-sage/40 px-4 py-2.5 text-sm font-medium text-sage transition-colors hover:bg-sage/10 dark:text-sage-light"
                  >
                    + Add list
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-forest dark:text-cream">
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider text-deep-plum/60 dark:text-cream/60">
        {label}
      </div>
    </div>
  );
}

function SaveIndicator({ status, dbConnected }: { status: SaveStatus; dbConnected: boolean }) {
  if (!dbConnected) {
    return <span className="text-xs font-medium text-amber-600 dark:text-amber-300">Not saving</span>;
  }
  const map: Record<SaveStatus, { text: string; className: string }> = {
    idle: { text: "All changes saved", className: "text-deep-plum/50 dark:text-cream/50" },
    saving: { text: "Saving…", className: "text-sage dark:text-sage-light" },
    saved: { text: "All changes saved", className: "text-sage dark:text-sage-light" },
    error: { text: "Save failed — retrying on next change", className: "text-red-500" },
  };
  const { text, className } = map[status];
  return <span className={`text-xs font-medium ${className}`}>{text}</span>;
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 py-2 text-center text-xs italic text-deep-plum/40 dark:text-cream/40">
      {children}
    </p>
  );
}

/** A six-dot handle that drags a whole set of guests (a party / group / list). */
function DragGrip({
  memberKeys,
  title,
  onDragStart,
  onDragEnd,
}: {
  memberKeys: string[];
  title?: string;
  onDragStart: (keys: string[]) => void;
  onDragEnd: () => void;
}) {
  if (memberKeys.length === 0) return null;
  return (
    <span
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", `keys:${memberKeys.join(",")}`);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(memberKeys);
      }}
      onDragEnd={onDragEnd}
      title={title ?? "Drag the whole group together"}
      className="shrink-0 cursor-grab text-deep-plum/30 transition-colors hover:text-sage active:cursor-grabbing dark:text-cream/30 dark:hover:text-sage-light"
      aria-label={title ?? "Drag the whole group together"}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="6" r="1.6" />
        <circle cx="9" cy="12" r="1.6" />
        <circle cx="9" cy="18" r="1.6" />
        <circle cx="15" cy="6" r="1.6" />
        <circle cx="15" cy="12" r="1.6" />
        <circle cx="15" cy="18" r="1.6" />
      </svg>
    </span>
  );
}

interface PartyClusterProps {
  party: Party;
  draggingKeys: Set<string>;
  seatedTableOf: (key: string) => string | null;
  listNameOf2: (key: string) => string | null;
  onDragStart: (keys: string[]) => void;
  onDragEnd: () => void;
}

/** One household (RSVP party) in the roster -- drag the header to move everyone. */
function PartyCluster({
  party,
  draggingKeys,
  seatedTableOf,
  listNameOf2,
  onDragStart,
  onDragEnd,
}: PartyClusterProps) {
  const memberKeys = party.members.map((m) => m.key);
  return (
    <div className="rounded-xl border border-sage/20 bg-sage/5 p-2 dark:border-sage/25 dark:bg-sage/10">
      <div className="mb-1.5 flex items-center gap-2 px-0.5">
        <DragGrip
          memberKeys={memberKeys}
          title={`Drag ${party.label} together`}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
        <span className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-wide text-sage dark:text-sage-light">
          {party.label}
        </span>
        <span className="shrink-0 text-xs font-medium text-deep-plum/40 dark:text-cream/40">
          {party.members.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {party.members.map((g) => (
          <GuestChip
            key={g.key}
            guest={g}
            dragging={draggingKeys.has(g.key)}
            color={null}
            seatedTable={seatedTableOf(g.key)}
            listName={listNameOf2(g.key)}
            onDragStart={() => onDragStart([g.key])}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}

interface GuestChipProps {
  guest: Guest;
  dragging: boolean;
  color: string | null;
  seatedTable?: string | null;
  listName?: string | null;
  onRemove?: () => void;
  removeTitle?: string;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function GuestChip({
  guest,
  dragging,
  color,
  seatedTable,
  listName,
  onRemove,
  removeTitle,
  onDragStart,
  onDragEnd,
}: GuestChipProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", guest.key);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      title={`From ${guest.rsvpName}'s RSVP`}
      className={`group flex cursor-grab items-center gap-2 rounded-lg border bg-white/80 px-2.5 py-1.5 text-sm shadow-sm transition active:cursor-grabbing dark:bg-[#1b2c1d]/80 ${
        dragging ? "opacity-40" : "opacity-100"
      } border-sage/20 dark:border-sage/30`}
    >
      {color && (
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      )}
      <span className="min-w-0 flex-1 truncate font-medium text-deep-plum dark:text-cream">
        {guest.name}
      </span>
      {guest.type === "child" && (
        <span className="shrink-0 rounded bg-lavender/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b5a86] dark:text-lavender">
          Kid
        </span>
      )}
      {listName && (
        <span className="shrink-0 rounded border border-soft-gold/40 px-1.5 py-0.5 text-[10px] font-semibold text-soft-gold-dark dark:text-soft-gold-light">
          {listName}
        </span>
      )}
      {seatedTable && (
        <span className="shrink-0 rounded bg-sage/15 px-1.5 py-0.5 text-[10px] font-semibold text-sage dark:text-sage-light">
          {seatedTable}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          title={removeTitle ?? "Remove"}
          className="shrink-0 rounded text-deep-plum/30 transition-colors hover:text-red-500 dark:text-cream/30"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface DropZoneProps {
  isOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

interface GroupColumnProps extends DropZoneProps {
  title: string;
  color: string | null;
  count: number;
  editable?: boolean;
  grip?: React.ReactNode;
  onRename?: (name: string) => void;
  onRemove?: () => void;
}

function GroupColumn({
  title,
  color,
  count,
  editable,
  grip,
  onRename,
  onRemove,
  isOver,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: GroupColumnProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== title) onRename?.(next);
    else setDraft(title);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`soft-card p-3 transition-shadow ${
        isOver ? "ring-2 ring-soft-gold ring-offset-1 ring-offset-transparent" : ""
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        {grip}
        {color && (
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />
        )}
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(title);
                setEditing(false);
              }
            }}
            className="enchanted-input flex-1 !py-1 text-sm font-semibold"
          />
        ) : (
          <button
            type="button"
            disabled={!editable}
            onClick={() => editable && setEditing(true)}
            className={`flex-1 truncate text-left text-sm font-semibold text-forest dark:text-cream ${
              editable ? "cursor-text hover:text-sage dark:hover:text-sage-light" : "cursor-default"
            }`}
          >
            {title}
          </button>
        )}
        <span className="shrink-0 text-xs font-medium text-deep-plum/50 dark:text-cream/50">{count}</span>
        {editable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Delete group"
            className="shrink-0 text-deep-plum/30 transition-colors hover:text-red-500 dark:text-cream/30"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

interface TableCardProps extends DropZoneProps {
  table: TableConfig;
  seatedCount: number;
  overCapacity: boolean;
  onRename: (name: string) => void;
  onSeatsChange: (n: number) => void;
  onRemove: () => void;
}

function TableCard({
  table,
  seatedCount,
  overCapacity,
  onRename,
  onSeatsChange,
  onRemove,
  isOver,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: TableCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(table.name);

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== table.name) onRename(next);
    else setDraft(table.name);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`soft-card flex flex-col p-4 transition-shadow ${
        isOver ? "ring-2 ring-soft-gold ring-offset-1 ring-offset-transparent" : ""
      }`}
    >
      <div className="mb-3 flex items-center gap-2 border-b border-sage/15 pb-2 dark:border-sage/25">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(table.name);
                setEditing(false);
              }
            }}
            className="enchanted-input flex-1 !py-1 text-sm font-semibold"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex-1 truncate text-left font-[family-name:var(--font-cormorant-garamond)] text-lg font-semibold text-forest hover:text-sage dark:text-cream dark:hover:text-sage-light"
          >
            {table.name}
          </button>
        )}
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
            overCapacity
              ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
              : "bg-sage/15 text-sage dark:text-sage-light"
          }`}
        >
          {seatedCount} / {table.seats}
        </span>
        <button
          type="button"
          onClick={onRemove}
          title="Delete table"
          className="shrink-0 text-deep-plum/30 transition-colors hover:text-red-500 dark:text-cream/30"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 space-y-1.5">{children}</div>

      <div className="mt-3 flex items-center gap-2 border-t border-sage/15 pt-2 text-xs text-deep-plum/50 dark:border-sage/25 dark:text-cream/50">
        <label className="flex items-center gap-1">
          Seats
          <input
            type="number"
            min={1}
            value={table.seats}
            onChange={(e) => onSeatsChange(Number(e.target.value))}
            className="enchanted-input !w-16 !py-1 text-xs"
          />
        </label>
      </div>
    </div>
  );
}
