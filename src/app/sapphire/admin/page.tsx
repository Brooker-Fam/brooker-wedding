"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface BdayRsvp {
  id: number;
  parent_name: string;
  child_names: string;
  email: string | null;
  phone: string | null;
  attending: boolean;
  kid_count: number;
  adult_count: number;
  allergies: string;
  birthday_wish: string;
  created_at: string;
}

interface NewBdayForm {
  parent_name: string;
  child_names: string;
  email: string;
  phone: string;
  attending: boolean;
  kid_count: number;
  adult_count: number;
  allergies: string;
  birthday_wish: string;
}

function emptyForm(): NewBdayForm {
  return {
    parent_name: "",
    child_names: "",
    email: "",
    phone: "",
    attending: true,
    kid_count: 1,
    adult_count: 1,
    allergies: "",
    birthday_wish: "",
  };
}

export default function SapphireAdmin() {
  const [rsvps, setRsvps] = useState<BdayRsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<BdayRsvp | null>(null);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState<NewBdayForm>(emptyForm);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/birthday-rsvp")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((json) => setRsvps(json.data ?? []))
      .catch(() => setError("Failed to load RSVPs"))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (r: BdayRsvp) => {
    setEditingId(r.id);
    setEditForm({ ...r });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/birthday-rsvp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          email: editForm.email ?? "",
          phone: editForm.phone ?? "",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setRsvps((prev) => prev.map((r) => (r.id === editForm.id ? json.data : r)));
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveCreate = async () => {
    setCreating(true);
    setError("");
    try {
      const kidNames = createForm.child_names
        .split(/\n|\s*&\s*|\s*,\s*|\s+and\s+/i)
        .map((n) => n.trim())
        .filter(Boolean);
      const payload = {
        ...createForm,
        child_names: createForm.attending ? kidNames.join("\n") : "",
        kid_count: createForm.attending ? kidNames.length : 0,
        adult_count: createForm.attending ? Math.max(0, Number(createForm.adult_count) || 0) : 0,
      };
      const res = await fetch("/api/birthday-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create");
      setRsvps((prev) => [json.data, ...prev]);
      setCreateForm(emptyForm());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  const deleteRsvp = async (id: number, name: string) => {
    if (!confirm(`Delete RSVP for ${name}?`)) return;
    try {
      const res = await fetch(`/api/birthday-rsvp?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setRsvps((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Failed to delete");
    }
  };

  const set = <K extends keyof BdayRsvp>(key: K, value: BdayRsvp[K]) =>
    setEditForm((prev) => prev && ({ ...prev, [key]: value }));
  const setCreate = <K extends keyof NewBdayForm>(key: K, value: NewBdayForm[K]) =>
    setCreateForm((prev) => ({ ...prev, [key]: value }));

  const attending = rsvps.filter((r) => r.attending);
  const totalKids = attending.reduce((sum, r) => sum + (r.kid_count || 0), 0);
  const totalAdults = attending.reduce((sum, r) => sum + (r.adult_count || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="mb-2 text-center">
          <Link
            href="/sapphire"
            className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
          >
            ← Back to invite
          </Link>
        </div>
        <h1 className="mb-2 text-center font-[family-name:var(--font-cormorant-garamond)] text-4xl font-semibold text-slate-900">
          Sapphire&apos;s Party · RSVP Admin
        </h1>
        <p className="mb-8 text-center text-sm text-slate-500">
          June 20, 2026 · Moreau Lake State Park
        </p>

        {loading && (
          <div className="py-20 text-center">
            <svg className="mx-auto h-8 w-8 animate-spin text-slate-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {error && (
          <div className="mx-auto mb-6 max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError("")} className="mt-2 text-xs text-red-600 underline">
              Dismiss
            </button>
          </div>
        )}

        {!loading && (
          <>
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold text-slate-900">
                  Add RSVP
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter an RSVP manually for friends who reply by text.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={createForm.parent_name}
                  onChange={(e) => setCreate("parent_name", e.target.value)}
                  placeholder="Parent name"
                  className="adminInput"
                />
                <textarea
                  value={createForm.child_names}
                  onChange={(e) => setCreate("child_names", e.target.value)}
                  placeholder="Kid names (one per line)"
                  className="adminInput min-h-[80px] resize-y"
                  rows={3}
                />
                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={(e) => setCreate("phone", e.target.value)}
                  placeholder="Phone"
                  className="adminInput"
                />
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreate("email", e.target.value)}
                  placeholder="Email"
                  className="adminInput"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCreate("attending", true)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      createForm.attending ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    Attending
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreate("attending", false)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                      !createForm.attending ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    Declined
                  </button>
                </div>
                <label className="text-xs uppercase tracking-wider text-slate-500">
                  Adults
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={createForm.adult_count}
                    onChange={(e) => setCreate("adult_count", Number(e.target.value))}
                    className="adminInput mt-1"
                  />
                  <span className="mt-1 block text-[0.65rem] normal-case tracking-normal text-slate-400">
                    Kids count comes from the names above
                  </span>
                </label>
                <input
                  type="text"
                  value={createForm.allergies}
                  onChange={(e) => setCreate("allergies", e.target.value)}
                  placeholder="Allergies / food notes"
                  className="adminInput md:col-span-2"
                />
                <textarea
                  value={createForm.birthday_wish}
                  onChange={(e) => setCreate("birthday_wish", e.target.value)}
                  placeholder="Birthday wish for Sapphire"
                  className="adminInput min-h-[80px] resize-y md:col-span-2"
                  rows={3}
                />
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={saveCreate}
                  disabled={creating}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
                >
                  {creating ? "Saving..." : "Add RSVP"}
                </button>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Total RSVPs" value={rsvps.length} />
              <Stat label="Attending" value={attending.length} />
              <Stat label="Kids" value={totalKids} />
              <Stat label="Grown-ups" value={totalAdults} />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-3">Parent</th>
                    <th className="px-3 py-3">Kid(s)</th>
                    <th className="px-3 py-3">Phone</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Going?</th>
                    <th className="px-3 py-3">Kids</th>
                    <th className="px-3 py-3">Adults</th>
                    <th className="px-3 py-3">Allergies</th>
                    <th className="px-3 py-3">Wish</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((r) =>
                    editingId === r.id && editForm ? (
                      <tr key={r.id} className="border-b border-slate-100 bg-amber-50/40">
                        <td className="px-2 py-2">
                          <input type="text" value={editForm.parent_name} onChange={(e) => set("parent_name", e.target.value)} className="adminInput !py-1.5 text-sm" />
                        </td>
                        <td className="px-2 py-2">
                          <textarea value={editForm.child_names} onChange={(e) => set("child_names", e.target.value)} className="adminInput min-w-[10rem] !py-1.5 text-sm" rows={3} placeholder="One kid per line" />
                        </td>
                        <td className="px-2 py-2">
                          <input type="tel" value={editForm.phone ?? ""} onChange={(e) => set("phone", e.target.value || null)} className="adminInput !py-1.5 text-sm" />
                        </td>
                        <td className="px-2 py-2">
                          <input type="email" value={editForm.email ?? ""} onChange={(e) => set("email", e.target.value || null)} className="adminInput !py-1.5 text-sm" />
                        </td>
                        <td className="px-2 py-2">
                          <button type="button" onClick={() => set("attending", !editForm.attending)} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${editForm.attending ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            {editForm.attending ? "Yes" : "No"}
                          </button>
                        </td>
                        <td className="px-2 py-2">
                          <input type="number" min={0} max={15} value={editForm.kid_count} onChange={(e) => set("kid_count", Number(e.target.value))} className="adminInput !w-16 !py-1.5 text-sm" />
                        </td>
                        <td className="px-2 py-2">
                          <input type="number" min={0} max={10} value={editForm.adult_count} onChange={(e) => set("adult_count", Number(e.target.value))} className="adminInput !w-16 !py-1.5 text-sm" />
                        </td>
                        <td className="px-2 py-2">
                          <input type="text" value={editForm.allergies} onChange={(e) => set("allergies", e.target.value)} className="adminInput !py-1.5 text-sm" />
                        </td>
                        <td className="px-2 py-2">
                          <textarea value={editForm.birthday_wish} onChange={(e) => set("birthday_wish", e.target.value)} className="adminInput min-h-[60px] min-w-[12rem] !py-1.5 text-sm" rows={2} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-slate-400">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2">
                          <div className="flex gap-2">
                            <button onClick={saveEdit} disabled={saving} className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
                              {saving ? "..." : "Save"}
                            </button>
                            <button onClick={cancelEdit} className="text-xs text-slate-500 underline hover:text-slate-700">
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={r.id} className="border-b border-slate-100">
                        <td className="px-3 py-3 font-medium text-slate-900">{r.parent_name}</td>
                        <td className="px-3 py-3 whitespace-pre-line text-slate-700">{r.child_names || "—"}</td>
                        <td className="px-3 py-3 text-slate-700">{r.phone || "—"}</td>
                        <td className="px-3 py-3 text-slate-700">{r.email || "—"}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${r.attending ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            {r.attending ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-700">{r.kid_count}</td>
                        <td className="px-3 py-3 text-slate-700">{r.adult_count}</td>
                        <td className="max-w-[10rem] whitespace-pre-line px-3 py-3 text-slate-600">{r.allergies || "—"}</td>
                        <td className="max-w-[14rem] whitespace-pre-line px-3 py-3 text-slate-600">{r.birthday_wish || "—"}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-slate-400">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <button onClick={() => startEdit(r)} className="text-xs font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900">
                            Edit
                          </button>
                          <button onClick={() => deleteRsvp(r.id, r.parent_name)} className="ml-3 text-xs font-medium text-rose-600 underline underline-offset-2 hover:text-rose-700">
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              {rsvps.length === 0 && (
                <p className="py-10 text-center text-slate-400">No RSVPs yet</p>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .adminInput {
          display: block;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(226, 232, 240);
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(15, 23, 42);
        }
        .adminInput:focus {
          outline: 2px solid rgb(100, 116, 139);
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <div className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-slate-900">
        {value}
      </div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
