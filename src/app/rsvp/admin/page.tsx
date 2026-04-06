"use client";

import { useState, useEffect } from "react";

interface Rsvp {
  id: number;
  name: string;
  email: string;
  attending: boolean;
  guest_count: number;
  adult_count: number;
  child_count: number;
  dietary_restrictions: string;
  potluck_dish: string;
  message: string;
  phone: string | null;
  mailing_address: string;
  attendee_names: string | null;
  public_display: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Rsvp | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((json) => setRsvps(json.data ?? []))
      .catch(() => setError("Failed to load RSVPs"))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (r: Rsvp) => {
    setEditingId(r.id);
    setEditForm({ ...r, attendee_names: r.attendee_names ?? "" });
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
      const res = await fetch("/api/rsvp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-edit": "true",
        },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setRsvps((prev) => prev.map((r) => (r.id === editForm.id ? json.data : r)));
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const deleteRsvp = async (id: number, name: string) => {
    if (!confirm(`Delete RSVP for ${name}?`)) return;
    try {
      const res = await fetch(`/api/rsvp?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setRsvps((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Failed to delete RSVP");
    }
  };

  const set = <K extends keyof Rsvp>(key: K, value: Rsvp[K]) =>
    setEditForm((prev) => prev && ({ ...prev, [key]: value }));

  const attending = rsvps.filter((r) => r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.guest_count, 0);

  return (
    <div className="enchanted-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <h1 className="mb-8 text-center font-[family-name:var(--font-cormorant-garamond)] text-4xl font-semibold text-forest dark:text-cream">
          RSVP Admin
        </h1>

        {loading && (
          <div className="py-20 text-center">
            <svg className="mx-auto h-8 w-8 animate-spin text-sage" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {error && (
          <div className="soft-card mx-auto mb-6 max-w-md p-4 text-center">
            <p className="text-sm text-deep-plum dark:text-cream">{error}</p>
            <button onClick={() => setError("")} className="mt-2 text-xs text-sage underline">Dismiss</button>
          </div>
        )}

        {!loading && (
          <>
            <div className="soft-card mb-8 flex flex-wrap justify-center gap-8 p-6">
              <Stat label="Total RSVPs" value={rsvps.length} />
              <Stat label="Attending" value={attending.length} />
              <Stat label="Total Guests" value={totalGuests} />
              <Stat label="Declined" value={rsvps.length - attending.length} />
            </div>

            <div className="soft-card overflow-x-auto p-2 sm:p-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-sage/20 text-xs uppercase tracking-wider text-deep-plum/60 dark:text-cream/60">
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Phone</th>
                    <th className="px-3 py-3">Mailing</th>
                    <th className="px-3 py-3">Attending</th>
                    <th className="px-3 py-3">Adults</th>
                    <th className="px-3 py-3">Kids</th>
                    <th className="px-3 py-3">Guest Names</th>
                    <th className="px-3 py-3">Dietary</th>
                    <th className="px-3 py-3">Potluck</th>
                    <th className="px-3 py-3">Public</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((r) =>
                    editingId === r.id && editForm ? (
                      <tr key={r.id} className="border-b border-sage/10 bg-sage/5 dark:border-sage/20 dark:bg-sage/10">
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => set("name", e.target.value)}
                            className="enchanted-input !py-1.5 text-sm"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => set("email", e.target.value)}
                            className="enchanted-input !py-1.5 text-sm"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="tel"
                            value={editForm.phone ?? ""}
                            onChange={(e) => set("phone", e.target.value || null)}
                            className="enchanted-input !py-1.5 text-sm"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <textarea
                            value={editForm.mailing_address}
                            onChange={(e) => set("mailing_address", e.target.value)}
                            className="enchanted-input min-h-[84px] min-w-[14rem] !py-1.5 text-sm"
                            rows={3}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => set("attending", !editForm.attending)}
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${editForm.attending ? "bg-sage/20 text-sage" : "bg-lavender/20 text-lavender"}`}
                          >
                            {editForm.attending ? "Yes" : "No"}
                          </button>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={editForm.adult_count}
                            onChange={(e) => set("adult_count", Number(e.target.value))}
                            className="enchanted-input !w-16 !py-1.5 text-sm"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={editForm.child_count}
                            onChange={(e) => set("child_count", Number(e.target.value))}
                            className="enchanted-input !w-16 !py-1.5 text-sm"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <textarea
                            value={editForm.attendee_names ?? ""}
                            onChange={(e) => set("attendee_names", e.target.value)}
                            className="enchanted-input min-h-[84px] min-w-[12rem] !py-1.5 text-sm"
                            rows={3}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={editForm.dietary_restrictions}
                            onChange={(e) => set("dietary_restrictions", e.target.value)}
                            className="enchanted-input !py-1.5 text-sm"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={editForm.potluck_dish}
                            onChange={(e) => set("potluck_dish", e.target.value)}
                            className="enchanted-input !py-1.5 text-sm"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => set("public_display", !editForm.public_display)}
                            className="text-xs text-deep-plum/70 underline dark:text-cream/70"
                          >
                            {editForm.public_display ? "Yes" : "No"}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-deep-plum/50 dark:text-cream/50">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              disabled={saving}
                              className="rounded-lg bg-soft-gold px-2.5 py-1 text-xs font-semibold text-[#2A1A00] hover:bg-soft-gold-dark disabled:opacity-50"
                            >
                              {saving ? "..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-xs text-deep-plum/60 underline hover:text-deep-plum dark:text-cream/60 dark:hover:text-cream"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={r.id} className="border-b border-sage/10 dark:border-sage/20">
                        <td className="px-3 py-3 font-medium text-deep-plum dark:text-cream">{r.name}</td>
                        <td className="px-3 py-3 text-deep-plum/70 dark:text-cream/70">{r.email}</td>
                        <td className="px-3 py-3 text-deep-plum/70 dark:text-cream/70">{r.phone || "—"}</td>
                        <td className="max-w-[14rem] whitespace-pre-line px-3 py-3 text-deep-plum/70 dark:text-cream/70">{r.mailing_address || "—"}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${r.attending ? "bg-sage/20 text-sage" : "bg-lavender/20 text-lavender"}`}>
                            {r.attending ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-deep-plum/70 dark:text-cream/70">{r.adult_count}</td>
                        <td className="px-3 py-3 text-deep-plum/70 dark:text-cream/70">{r.child_count}</td>
                        <td className="max-w-[12rem] whitespace-pre-line px-3 py-3 text-deep-plum/70 dark:text-cream/70">{r.attendee_names || "—"}</td>
                        <td className="px-3 py-3 text-deep-plum/70 dark:text-cream/70">{r.dietary_restrictions || "—"}</td>
                        <td className="px-3 py-3 text-deep-plum/70 dark:text-cream/70">{r.potluck_dish || "—"}</td>
                        <td className="px-3 py-3 text-deep-plum/70 dark:text-cream/70">{r.public_display ? "Yes" : "No"}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-deep-plum/50 dark:text-cream/50">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <button
                            onClick={() => startEdit(r)}
                            className="text-xs font-medium text-sage underline underline-offset-2 hover:text-sage-dark dark:text-sage-light dark:hover:text-sage"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRsvp(r.id, r.name)}
                            className="ml-3 text-xs font-medium text-red-400 underline underline-offset-2 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              {rsvps.length === 0 && (
                <p className="py-8 text-center text-deep-plum/50 dark:text-cream/50">No RSVPs yet</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
