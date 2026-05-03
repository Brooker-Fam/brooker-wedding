"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface MailingList {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  entry_count: number;
}

interface Entry {
  id: number;
  list_id: number;
  rsvp_id: number;
  addressee: string | null;
  notes: string | null;
  rsvp_name: string;
  rsvp_email: string;
  rsvp_phone: string | null;
  mailing_address: string;
  attending: boolean;
  attendee_names: string | null;
  adult_count: number;
  child_count: number;
}

interface Rsvp {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  mailing_address: string;
  attending: boolean;
  attendee_names: string | null;
}

function getDisplayAddressee(entry: Entry): string {
  return entry.addressee?.trim() || entry.rsvp_name;
}

function csvEscape(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
  // BOM so Excel opens UTF-8 correctly
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function lastNameOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 0 ? parts[parts.length - 1] : "";
}

function firstNameOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 0 ? parts[0] : "";
}

export default function LabelsAdminPage() {
  const [lists, setLists] = useState<MailingList[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [allRsvps, setAllRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [error, setError] = useState("");

  const [newListName, setNewListName] = useState("");
  const [creatingList, setCreatingList] = useState(false);

  const [editingListMeta, setEditingListMeta] = useState(false);
  const [listMetaDraft, setListMetaDraft] = useState({ name: "", description: "" });
  const [savingListMeta, setSavingListMeta] = useState(false);

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [addAttendingOnly, setAddAttendingOnly] = useState(true);
  const [addHasAddressOnly, setAddHasAddressOnly] = useState(true);
  const [selectedToAdd, setSelectedToAdd] = useState<Set<number>>(new Set());
  const [adding, setAdding] = useState(false);

  const [editingEntries, setEditingEntries] = useState<Record<number, { addressee: string; notes: string }>>({});

  const selectedList = lists.find((l) => l.id === selectedListId) ?? null;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [listsRes, rsvpsRes] = await Promise.all([
          fetch("/api/mailing-lists"),
          fetch("/api/rsvp"),
        ]);
        const listsJson = await listsRes.json();
        const rsvpsJson = await rsvpsRes.json();
        if (cancelled) return;
        if (!listsRes.ok) throw new Error(listsJson.error || "Failed to load lists");
        if (!rsvpsRes.ok) throw new Error(rsvpsJson.error || "Failed to load RSVPs");
        setLists(listsJson.data ?? []);
        setAllRsvps(rsvpsJson.data ?? []);
        if (!selectedListId && (listsJson.data ?? []).length > 0) {
          setSelectedListId(listsJson.data[0].id);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEntries = useCallback(async (listId: number) => {
    setEntriesLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/mailing-lists/${listId}/entries`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load entries");
      setEntries(json.data ?? []);
      setEditingEntries({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load entries");
    } finally {
      setEntriesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedListId == null) {
      setEntries([]);
      return;
    }
    loadEntries(selectedListId);
    setShowAddPanel(false);
    setSelectedToAdd(new Set());
    const list = lists.find((l) => l.id === selectedListId);
    if (list) {
      setListMetaDraft({ name: list.name, description: list.description ?? "" });
      setEditingListMeta(false);
    }
  }, [selectedListId, loadEntries, lists]);

  const createList = async () => {
    const name = newListName.trim();
    if (!name) return;
    setCreatingList(true);
    setError("");
    try {
      const res = await fetch("/api/mailing-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create list");
      setLists((prev) => [json.data, ...prev]);
      setSelectedListId(json.data.id);
      setNewListName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create list");
    } finally {
      setCreatingList(false);
    }
  };

  const saveListMeta = async () => {
    if (!selectedList) return;
    setSavingListMeta(true);
    setError("");
    try {
      const res = await fetch(`/api/mailing-lists/${selectedList.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: listMetaDraft.name,
          description: listMetaDraft.description,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setLists((prev) =>
        prev.map((l) =>
          l.id === selectedList.id
            ? { ...l, name: json.data.name, description: json.data.description }
            : l
        )
      );
      setEditingListMeta(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSavingListMeta(false);
    }
  };

  const deleteList = async () => {
    if (!selectedList) return;
    if (!confirm(`Delete the "${selectedList.name}" list? This will not delete RSVPs.`)) return;
    setError("");
    try {
      const res = await fetch(`/api/mailing-lists/${selectedList.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete");
      }
      setLists((prev) => prev.filter((l) => l.id !== selectedList.id));
      const remaining = lists.filter((l) => l.id !== selectedList.id);
      setSelectedListId(remaining.length > 0 ? remaining[0].id : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const candidateRsvps = useMemo(() => {
    const inList = new Set(entries.map((e) => e.rsvp_id));
    const search = addSearch.trim().toLowerCase();
    return allRsvps.filter((r) => {
      if (inList.has(r.id)) return false;
      if (addAttendingOnly && !r.attending) return false;
      if (addHasAddressOnly && (!r.mailing_address || r.mailing_address.trim().length === 0)) return false;
      if (search) {
        const hay = `${r.name} ${r.email} ${r.attendee_names ?? ""}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });
  }, [allRsvps, entries, addSearch, addAttendingOnly, addHasAddressOnly]);

  const toggleSelectToAdd = (id: number) => {
    setSelectedToAdd((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelectedToAdd(new Set(candidateRsvps.map((r) => r.id)));
  };

  const clearSelection = () => setSelectedToAdd(new Set());

  const addSelected = async () => {
    if (!selectedList || selectedToAdd.size === 0) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch(`/api/mailing-lists/${selectedList.id}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsvp_ids: Array.from(selectedToAdd) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add");
      await loadEntries(selectedList.id);
      // Bump entry count locally
      setLists((prev) =>
        prev.map((l) =>
          l.id === selectedList.id
            ? { ...l, entry_count: l.entry_count + (json.added ?? 0) }
            : l
        )
      );
      setSelectedToAdd(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const beginEditEntry = (entry: Entry) => {
    setEditingEntries((prev) => ({
      ...prev,
      [entry.id]: {
        addressee: entry.addressee ?? "",
        notes: entry.notes ?? "",
      },
    }));
  };

  const updateEntryDraft = (
    entryId: number,
    field: "addressee" | "notes",
    value: string
  ) => {
    setEditingEntries((prev) => ({
      ...prev,
      [entryId]: { ...prev[entryId], [field]: value },
    }));
  };

  const saveEntry = async (entry: Entry) => {
    if (!selectedList) return;
    const draft = editingEntries[entry.id];
    if (!draft) return;
    setError("");
    try {
      const res = await fetch(`/api/mailing-lists/${selectedList.id}/entries`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry_id: entry.id,
          addressee: draft.addressee,
          notes: draft.notes,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? { ...e, addressee: json.data.addressee, notes: json.data.notes }
            : e
        )
      );
      setEditingEntries((prev) => {
        const next = { ...prev };
        delete next[entry.id];
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    }
  };

  const removeEntry = async (entry: Entry) => {
    if (!selectedList) return;
    if (!confirm(`Remove ${getDisplayAddressee(entry)} from this list?`)) return;
    setError("");
    try {
      const res = await fetch(
        `/api/mailing-lists/${selectedList.id}/entries?entry_id=${entry.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to remove");
      }
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
      setLists((prev) =>
        prev.map((l) =>
          l.id === selectedList.id
            ? { ...l, entry_count: Math.max(0, l.entry_count - 1) }
            : l
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove");
    }
  };

  const bulkApply = async (transform: (rsvpName: string) => string) => {
    if (!selectedList) return;
    if (!confirm("Overwrite addressee for every entry on this list?")) return;
    setError("");
    try {
      for (const entry of entries) {
        const addressee = transform(entry.rsvp_name);
        const res = await fetch(`/api/mailing-lists/${selectedList.id}/entries`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entry_id: entry.id,
            addressee,
            notes: entry.notes ?? "",
          }),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error || "Failed to apply bulk update");
        }
      }
      await loadEntries(selectedList.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk update failed");
    }
  };

  const exportCsv = () => {
    if (!selectedList) return;
    const header = [
      "Addressee",
      "Mailing Address",
      "Notes",
      "Email",
      "Phone",
      "RSVP Name",
      "Attendee Names",
      "Attending",
    ];
    const rows = [header];
    for (const e of entries) {
      rows.push([
        getDisplayAddressee(e),
        e.mailing_address ?? "",
        e.notes ?? "",
        e.rsvp_email ?? "",
        e.rsvp_phone ?? "",
        e.rsvp_name,
        e.attendee_names ?? "",
        e.attending ? "Yes" : "No",
      ]);
    }
    const slug = selectedList.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`${slug || "mailing-list"}-${date}.csv`, rows);
  };

  return (
    <div className="enchanted-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/rsvp/admin"
            className="text-sm text-sage underline underline-offset-2 hover:text-sage-dark dark:text-sage-light"
          >
            ← RSVP Admin
          </Link>
          <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-forest dark:text-cream sm:text-4xl">
            Mailing Lists
          </h1>
          <span className="hidden w-32 sm:inline-block" />
        </div>

        {error && (
          <div className="soft-card mx-auto mb-6 max-w-xl p-4 text-center">
            <p className="text-sm text-deep-plum dark:text-cream">{error}</p>
            <button onClick={() => setError("")} className="mt-2 text-xs text-sage underline">
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-8 w-8 animate-spin text-sage" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="soft-card h-fit p-4">
              <h2 className="mb-3 font-[family-name:var(--font-cormorant-garamond)] text-xl font-semibold text-forest dark:text-cream">
                Lists
              </h2>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createList();
                  }}
                  placeholder="New list name"
                  className="enchanted-input flex-1 !py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={createList}
                  disabled={creatingList || !newListName.trim()}
                  className="rounded-lg bg-soft-gold px-3 py-1.5 text-sm font-semibold text-[#2A1A00] hover:bg-soft-gold-dark disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <ul className="space-y-1">
                {lists.length === 0 && (
                  <li className="px-2 py-1 text-sm text-deep-plum/60 dark:text-cream/60">
                    No lists yet. Create one to start.
                  </li>
                )}
                {lists.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedListId(l.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                        l.id === selectedListId
                          ? "bg-sage/20 text-forest dark:text-cream"
                          : "text-deep-plum/80 hover:bg-sage/10 dark:text-cream/80"
                      }`}
                    >
                      <span className="truncate font-medium">{l.name}</span>
                      <span className="ml-2 shrink-0 text-xs text-deep-plum/60 dark:text-cream/60">
                        {l.entry_count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Main */}
            <main className="space-y-4">
              {!selectedList ? (
                <div className="soft-card p-8 text-center text-deep-plum/70 dark:text-cream/70">
                  Pick a list from the sidebar, or create a new one (e.g.
                  &ldquo;Bridal Shower&rdquo;, &ldquo;Thank You Cards&rdquo;,
                  &ldquo;Celebration Invites&rdquo;).
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="soft-card p-5">
                    {editingListMeta ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={listMetaDraft.name}
                          onChange={(e) =>
                            setListMetaDraft((p) => ({ ...p, name: e.target.value }))
                          }
                          className="enchanted-input w-full"
                          placeholder="List name"
                        />
                        <textarea
                          value={listMetaDraft.description}
                          onChange={(e) =>
                            setListMetaDraft((p) => ({ ...p, description: e.target.value }))
                          }
                          rows={2}
                          className="enchanted-input min-h-[64px] w-full resize-y"
                          placeholder="Description (optional)"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveListMeta}
                            disabled={savingListMeta}
                            className="rounded-lg bg-soft-gold px-3 py-1.5 text-sm font-semibold text-[#2A1A00] hover:bg-soft-gold-dark disabled:opacity-50"
                          >
                            {savingListMeta ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingListMeta(false);
                              setListMetaDraft({
                                name: selectedList.name,
                                description: selectedList.description ?? "",
                              });
                            }}
                            className="text-sm text-deep-plum/60 underline dark:text-cream/60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold text-forest dark:text-cream">
                            {selectedList.name}
                          </h2>
                          {selectedList.description && (
                            <p className="mt-1 text-sm text-deep-plum/70 dark:text-cream/70">
                              {selectedList.description}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-deep-plum/50 dark:text-cream/50">
                            {entries.length} {entries.length === 1 ? "entry" : "entries"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingListMeta(true)}
                            className="text-sm text-sage underline underline-offset-2 hover:text-sage-dark dark:text-sage-light"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={deleteList}
                            className="text-sm text-red-400 underline underline-offset-2 hover:text-red-600"
                          >
                            Delete list
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action bar */}
                  <div className="soft-card flex flex-wrap items-center gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => setShowAddPanel((v) => !v)}
                      className="rounded-lg bg-sage/20 px-3 py-1.5 text-sm font-semibold text-forest hover:bg-sage/30 dark:text-cream"
                    >
                      {showAddPanel ? "Hide recipients" : "+ Add recipients"}
                    </button>
                    <button
                      type="button"
                      onClick={exportCsv}
                      disabled={entries.length === 0}
                      className="rounded-lg bg-soft-gold px-3 py-1.5 text-sm font-semibold text-[#2A1A00] hover:bg-soft-gold-dark disabled:opacity-50"
                    >
                      Export CSV
                    </button>
                    <span className="ml-auto text-xs text-deep-plum/60 dark:text-cream/60">
                      Bulk addressee:
                    </span>
                    <button
                      type="button"
                      onClick={() => bulkApply((n) => firstNameOf(n))}
                      disabled={entries.length === 0}
                      className="rounded-lg bg-lavender/20 px-2.5 py-1 text-xs font-medium text-deep-plum hover:bg-lavender/30 disabled:opacity-50 dark:text-cream"
                    >
                      First name
                    </button>
                    <button
                      type="button"
                      onClick={() => bulkApply((n) => `The ${lastNameOf(n)} Family`)}
                      disabled={entries.length === 0}
                      className="rounded-lg bg-lavender/20 px-2.5 py-1 text-xs font-medium text-deep-plum hover:bg-lavender/30 disabled:opacity-50 dark:text-cream"
                    >
                      The ___ Family
                    </button>
                    <button
                      type="button"
                      onClick={() => bulkApply((n) => n)}
                      disabled={entries.length === 0}
                      className="rounded-lg bg-lavender/20 px-2.5 py-1 text-xs font-medium text-deep-plum hover:bg-lavender/30 disabled:opacity-50 dark:text-cream"
                    >
                      Reset to RSVP name
                    </button>
                  </div>

                  {/* Add recipients panel */}
                  {showAddPanel && (
                    <div className="soft-card p-4">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={addSearch}
                          onChange={(e) => setAddSearch(e.target.value)}
                          placeholder="Search name / email"
                          className="enchanted-input !py-1.5 text-sm"
                        />
                        <label className="flex items-center gap-2 text-sm text-deep-plum dark:text-cream">
                          <input
                            type="checkbox"
                            checked={addAttendingOnly}
                            onChange={(e) => setAddAttendingOnly(e.target.checked)}
                            className="h-4 w-4 accent-sage"
                          />
                          Attending only
                        </label>
                        <label className="flex items-center gap-2 text-sm text-deep-plum dark:text-cream">
                          <input
                            type="checkbox"
                            checked={addHasAddressOnly}
                            onChange={(e) => setAddHasAddressOnly(e.target.checked)}
                            className="h-4 w-4 accent-sage"
                          />
                          Has address
                        </label>
                        <span className="ml-auto text-xs text-deep-plum/60 dark:text-cream/60">
                          {selectedToAdd.size} selected of {candidateRsvps.length}
                        </span>
                        <button
                          type="button"
                          onClick={selectAllVisible}
                          className="text-xs text-sage underline"
                        >
                          Select all
                        </button>
                        <button
                          type="button"
                          onClick={clearSelection}
                          className="text-xs text-deep-plum/60 underline dark:text-cream/60"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={addSelected}
                          disabled={adding || selectedToAdd.size === 0}
                          className="rounded-lg bg-soft-gold px-3 py-1.5 text-sm font-semibold text-[#2A1A00] hover:bg-soft-gold-dark disabled:opacity-50"
                        >
                          {adding ? "Adding..." : `Add ${selectedToAdd.size}`}
                        </button>
                      </div>

                      <div className="max-h-80 overflow-y-auto rounded-lg border border-sage/20">
                        <table className="w-full text-left text-sm">
                          <thead className="sticky top-0 bg-cream/90 backdrop-blur dark:bg-forest/90">
                            <tr className="border-b border-sage/20 text-xs uppercase tracking-wider text-deep-plum/60 dark:text-cream/60">
                              <th className="px-2 py-2 w-8" />
                              <th className="px-2 py-2">Name</th>
                              <th className="px-2 py-2">Address</th>
                              <th className="px-2 py-2">Attending</th>
                            </tr>
                          </thead>
                          <tbody>
                            {candidateRsvps.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="px-2 py-6 text-center text-deep-plum/50 dark:text-cream/50"
                                >
                                  Nobody matches — adjust the filters above.
                                </td>
                              </tr>
                            ) : (
                              candidateRsvps.map((r) => (
                                <tr key={r.id} className="border-b border-sage/10">
                                  <td className="px-2 py-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedToAdd.has(r.id)}
                                      onChange={() => toggleSelectToAdd(r.id)}
                                      className="h-4 w-4 accent-sage"
                                    />
                                  </td>
                                  <td className="px-2 py-2 font-medium text-deep-plum dark:text-cream">
                                    {r.name}
                                  </td>
                                  <td className="max-w-[20rem] whitespace-pre-line px-2 py-2 text-xs text-deep-plum/70 dark:text-cream/70">
                                    {r.mailing_address || (
                                      <span className="italic text-deep-plum/40 dark:text-cream/40">
                                        no address
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-2 py-2 text-xs text-deep-plum/70 dark:text-cream/70">
                                    {r.attending ? "Yes" : "No"}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Entries table */}
                  <div className="soft-card overflow-x-auto p-2 sm:p-4">
                    {entriesLoading ? (
                      <div className="py-10 text-center text-sm text-deep-plum/60 dark:text-cream/60">
                        Loading entries...
                      </div>
                    ) : entries.length === 0 ? (
                      <div className="py-10 text-center text-sm text-deep-plum/60 dark:text-cream/60">
                        No entries yet. Click &ldquo;+ Add recipients&rdquo; above.
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-sage/20 text-xs uppercase tracking-wider text-deep-plum/60 dark:text-cream/60">
                            <th className="px-3 py-3">Addressee</th>
                            <th className="px-3 py-3">Mailing Address</th>
                            <th className="px-3 py-3">Notes</th>
                            <th className="px-3 py-3">RSVP</th>
                            <th className="px-3 py-3" />
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((entry) => {
                            const draft = editingEntries[entry.id];
                            const isEditing = draft != null;
                            return (
                              <tr key={entry.id} className="border-b border-sage/10 align-top">
                                <td className="px-2 py-2">
                                  <input
                                    type="text"
                                    value={isEditing ? draft.addressee : entry.addressee ?? ""}
                                    onFocus={() => !isEditing && beginEditEntry(entry)}
                                    onChange={(e) =>
                                      updateEntryDraft(entry.id, "addressee", e.target.value)
                                    }
                                    onBlur={() => isEditing && saveEntry(entry)}
                                    placeholder={entry.rsvp_name}
                                    className="enchanted-input !py-1.5 text-sm"
                                  />
                                  {!isEditing && !entry.addressee && (
                                    <p className="mt-1 text-[10px] uppercase tracking-wider text-deep-plum/40 dark:text-cream/40">
                                      using RSVP name
                                    </p>
                                  )}
                                </td>
                                <td className="max-w-[18rem] whitespace-pre-line px-3 py-3 text-deep-plum/70 dark:text-cream/70">
                                  {entry.mailing_address || (
                                    <span className="italic text-deep-plum/40 dark:text-cream/40">
                                      no address on RSVP
                                    </span>
                                  )}
                                </td>
                                <td className="px-2 py-2">
                                  <textarea
                                    value={isEditing ? draft.notes : entry.notes ?? ""}
                                    onFocus={() => !isEditing && beginEditEntry(entry)}
                                    onChange={(e) =>
                                      updateEntryDraft(entry.id, "notes", e.target.value)
                                    }
                                    onBlur={() => isEditing && saveEntry(entry)}
                                    rows={2}
                                    className="enchanted-input min-h-[44px] min-w-[10rem] !py-1.5 text-sm"
                                  />
                                </td>
                                <td className="max-w-[14rem] px-3 py-3 text-xs text-deep-plum/60 dark:text-cream/60">
                                  <div className="font-medium text-deep-plum dark:text-cream">
                                    {entry.rsvp_name}
                                  </div>
                                  {entry.attendee_names && (
                                    <div className="whitespace-pre-line">{entry.attendee_names}</div>
                                  )}
                                  <div>
                                    {entry.adult_count} adult
                                    {entry.adult_count === 1 ? "" : "s"}
                                    {entry.child_count > 0 &&
                                      `, ${entry.child_count} kid${entry.child_count === 1 ? "" : "s"}`}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-2 py-2">
                                  <button
                                    onClick={() => removeEntry(entry)}
                                    className="text-xs font-medium text-red-400 underline underline-offset-2 hover:text-red-600"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Hint */}
                  <div className="soft-card p-4 text-xs text-deep-plum/60 dark:text-cream/60">
                    <p>
                      <strong className="text-forest dark:text-cream">Tip:</strong> the CSV has columns
                      <code className="mx-1 rounded bg-sage/10 px-1 py-0.5">Addressee</code> and
                      <code className="mx-1 rounded bg-sage/10 px-1 py-0.5">Mailing Address</code>.
                      Drop it into Avery Design &amp; Print
                      (avery.com/software/design-and-print), Word Mail Merge, or Pages → and
                      pick whatever Avery template matches your label sheet.
                    </p>
                  </div>
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
