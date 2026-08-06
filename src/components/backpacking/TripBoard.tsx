"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GEAR_CATEGORIES, TRIP_PEOPLE } from "@/lib/backpacking-gear";

type GearItem = {
  id: number;
  slug: string | null;
  name: string;
  category: string;
  qty: string | null;
  notes: string | null;
  claimed_by: string | null;
  packed: boolean;
  sort: number;
};

type Vote = { question_id: string; person: string; choice: string };

const QUESTIONS: { id: string; label: string; sub?: string; options: string[] }[] = [
  {
    id: "dan",
    label: "Dan — you in?",
    sub: "The route plan changes depending on this one.",
    options: ["I'm in 🎉", "Can't make it", "Still deciding"],
  },
  {
    id: "meetup",
    label: "Pre-trip gear check at Matt's?",
    sub: "Lay everything out, pack the bear cans, weigh packs.",
    options: ["Thursday 8/13", "Friday 8/14", "Either works", "Can't do either"],
  },
  {
    id: "tents",
    label: "Tent plan?",
    sub: "The 4-person is comfier; both means more weight but more space.",
    options: ["Share the 4-person", "Bring both tents"],
  },
  {
    id: "route",
    label: "Route vibe?",
    options: ["Plan A: Marcy", "Plan B: Marshall + the wreck", "Decide that morning"],
  },
];

const PERSON_COLORS: Record<string, string> = {
  Matt: "bg-forest text-cream border-forest",
  Liam: "bg-soft-gold text-forest-dark border-soft-gold",
  Dan: "bg-deep-plum text-cream border-deep-plum",
};

function splitNames(claimed: string | null): string[] {
  return claimed ? claimed.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

export default function TripBoard() {
  const [person, setPerson] = useState<string | null>(null);
  const [items, setItems] = useState<GearItem[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [mock, setMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "kitchen", qty: "", notes: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("trip-person");
      if (saved && (TRIP_PEOPLE as readonly string[]).includes(saved)) setPerson(saved);
    } catch {}
  }, []);

  const pickPerson = (p: string) => {
    setPerson(p);
    try {
      localStorage.setItem("trip-person", p);
    } catch {}
  };

  const flash = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const load = useCallback(async () => {
    try {
      const [gearRes, votesRes] = await Promise.all([
        fetch("/api/backpacking/gear"),
        fetch("/api/backpacking/votes"),
      ]);
      const gear = await gearRes.json();
      const v = await votesRes.json();
      if (gear.data) setItems(gear.data);
      if (gear.mock) setMock(true);
      if (v.data) setVotes(v.data);
    } catch {
      flash("Couldn't load the list — check your connection");
    } finally {
      setLoading(false);
    }
  }, [flash]);

  useEffect(() => {
    load();
    // Refresh when the tab regains focus so two people editing stay in sync.
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const patchItem = async (id: number, patch: Partial<GearItem>) => {
    const prev = items;
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    try {
      const res = await fetch("/api/backpacking/gear", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) throw new Error();
    } catch {
      if (mock) {
        flash("Preview mode — changes aren't saved");
      } else {
        setItems(prev);
        flash("Couldn't save that — try again");
      }
    }
  };

  const toggleClaim = (item: GearItem, name: string) => {
    const names = splitNames(item.claimed_by);
    const next = names.includes(name) ? names.filter((n) => n !== name) : [...names, name];
    patchItem(item.id, { claimed_by: next.join(", ") || null });
  };

  const castVote = async (question_id: string, choice: string) => {
    if (!person) {
      flash("Pick who you are first ☝️");
      return;
    }
    const prev = votes;
    setVotes((cur) => [
      ...cur.filter((v) => !(v.question_id === question_id && v.person === person)),
      { question_id, person, choice },
    ]);
    try {
      const res = await fetch("/api/backpacking/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id, person, choice }),
      });
      if (!res.ok) throw new Error();
    } catch {
      if (mock) {
        flash("Preview mode — votes aren't saved");
      } else {
        setVotes(prev);
        flash("Couldn't save your vote — try again");
      }
    }
  };

  const addItem = async () => {
    if (!newItem.name.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/backpacking/gear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          qty: newItem.qty || null,
          notes: newItem.notes || null,
          claimed_by: person,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setItems((cur) => [...cur, data.data]);
        setNewItem({ name: "", category: "kitchen", qty: "", notes: "" });
      } else {
        flash(mock ? "Preview mode — can't add items" : "Couldn't add that item");
      }
    } catch {
      flash("Couldn't add that item");
    } finally {
      setAdding(false);
    }
  };

  const deleteItem = async (id: number) => {
    const prev = items;
    setItems((cur) => cur.filter((it) => it.id !== id));
    try {
      const res = await fetch(`/api/backpacking/gear?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setItems(prev);
      flash("Couldn't remove that item");
    }
  };

  const stats = useMemo(() => {
    const claimed = items.filter((it) => splitNames(it.claimed_by).length > 0).length;
    const perPerson: Record<string, number> = {};
    for (const p of TRIP_PEOPLE) {
      perPerson[p] = items.filter((it) => splitNames(it.claimed_by).includes(p)).length;
    }
    return { claimed, total: items.length, perPerson };
  }, [items]);

  const voteFor = (qid: string) => votes.filter((v) => v.question_id === qid);

  return (
    <div className="space-y-10">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-forest px-5 py-2.5 text-sm text-cream shadow-lg dark:bg-soft-gold dark:text-forest-dark">
          {toast}
        </div>
      )}

      {/* Who are you */}
      <div className="soft-card dark:soft-card-dark p-6">
        <h3 className="mb-1 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold">
          Who are you?
        </h3>
        <p className="mb-4 text-sm opacity-75">
          Pick your name so your claims and votes are yours. It sticks on this device.
        </p>
        <div className="flex flex-wrap gap-3">
          {TRIP_PEOPLE.map((p) => (
            <button
              key={p}
              onClick={() => pickPerson(p)}
              className={`rounded-full border-2 px-6 py-2 font-semibold transition-all ${
                person === p
                  ? PERSON_COLORS[p]
                  : "border-sage/40 bg-transparent hover:border-sage"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        {mock && (
          <p className="mt-4 rounded-lg bg-soft-gold/15 px-3 py-2 text-xs">
            Local preview — the live site saves everyone&apos;s changes.
          </p>
        )}
      </div>

      {/* Decisions */}
      <section id="decisions">
        <h2 className="mb-4 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold">
          🗳️ Group decisions
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {QUESTIONS.map((q) => {
            const qVotes = voteFor(q.id);
            return (
              <div key={q.id} className="soft-card dark:soft-card-dark p-5">
                <h3 className="font-semibold">{q.label}</h3>
                {q.sub && <p className="mt-0.5 text-xs opacity-70">{q.sub}</p>}
                <div className="mt-3 space-y-2">
                  {q.options.map((opt) => {
                    const voters = qVotes.filter((v) => v.choice === opt).map((v) => v.person);
                    const mine = person !== null && voters.includes(person);
                    return (
                      <button
                        key={opt}
                        onClick={() => castVote(q.id, opt)}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
                          mine
                            ? "border-soft-gold bg-soft-gold/20 font-semibold"
                            : "border-sage/25 hover:border-sage/60"
                        }`}
                      >
                        <span>{opt}</span>
                        <span className="flex gap-1">
                          {voters.map((v) => (
                            <span
                              key={v}
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${PERSON_COLORS[v] ?? "border-sage/40"}`}
                            >
                              {v}
                            </span>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gear list */}
      <section id="gear">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold">
            🎒 Gear — who&apos;s bringing what
          </h2>
          {!loading && (
            <div className="text-sm opacity-75">
              {stats.claimed}/{stats.total} claimed ·{" "}
              {TRIP_PEOPLE.map((p) => `${p} ${stats.perPerson[p]}`).join(" · ")}
            </div>
          )}
        </div>
        <p className="mb-5 text-sm opacity-75">
          Tap a name chip to claim an item (or un-claim it). Rows marked{" "}
          <span className="mx-0.5 inline-block h-3 w-3 rounded-sm bg-soft-gold align-middle" /> still
          need an owner. Check the box once it&apos;s physically in a pack.
        </p>

        {loading ? (
          <div className="soft-card dark:soft-card-dark p-8 text-center opacity-70">
            Loading the list…
          </div>
        ) : (
          <div className="space-y-6">
            {GEAR_CATEGORIES.map((cat) => {
              const catItems = items
                .filter((it) => it.category === cat.id)
                .sort((a, b) => a.sort - b.sort || a.id - b.id);
              if (catItems.length === 0) return null;
              return (
                <div key={cat.id} className="soft-card dark:soft-card-dark overflow-hidden">
                  <div className="border-b border-sage/20 px-5 py-3">
                    <h3 className="font-semibold">
                      {cat.emoji} {cat.label}
                    </h3>
                    {cat.blurb && <p className="mt-0.5 text-xs opacity-70">{cat.blurb}</p>}
                  </div>
                  <ul className="divide-y divide-sage/15">
                    {catItems.map((item) => {
                      const names = splitNames(item.claimed_by);
                      const unclaimed = names.length === 0;
                      return (
                        <li
                          key={item.id}
                          className={`flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between ${
                            unclaimed ? "border-l-4 border-l-soft-gold" : "border-l-4 border-l-transparent"
                          } ${item.packed ? "opacity-60" : ""}`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className={`font-medium ${item.packed ? "line-through" : ""}`}>
                                {item.name}
                              </span>
                              {item.qty && (
                                <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[11px] font-semibold">
                                  {item.qty}
                                </span>
                              )}
                            </div>
                            {item.notes && <p className="mt-0.5 text-xs opacity-70">{item.notes}</p>}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {TRIP_PEOPLE.map((p) => (
                              <button
                                key={p}
                                onClick={() => toggleClaim(item, p)}
                                title={names.includes(p) ? `${p} is bringing this` : `Claim for ${p}`}
                                className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-all ${
                                  names.includes(p)
                                    ? PERSON_COLORS[p]
                                    : "border-sage/30 opacity-50 hover:opacity-100"
                                }`}
                              >
                                {p[0]}
                              </button>
                            ))}
                            <label className="ml-1 flex cursor-pointer items-center gap-1 text-xs opacity-80">
                              <input
                                type="checkbox"
                                checked={item.packed}
                                onChange={(e) => patchItem(item.id, { packed: e.target.checked })}
                                className="h-4 w-4 accent-[#C49A3C]"
                              />
                              packed
                            </label>
                            {item.slug === null && (
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="ml-1 text-xs opacity-40 hover:opacity-100"
                                title="Remove item"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}

            {/* Add item */}
            <div className="soft-card dark:soft-card-dark p-5">
              <h3 className="mb-3 font-semibold">➕ Add something we forgot</h3>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name"
                  className="enchanted-input flex-1 rounded-lg px-3 py-2 text-sm"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="enchanted-input rounded-lg px-3 py-2 text-sm"
                >
                  {GEAR_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  value={newItem.qty}
                  onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                  placeholder="Qty (optional)"
                  className="enchanted-input w-full rounded-lg px-3 py-2 text-sm sm:w-32"
                />
                <button
                  onClick={addItem}
                  disabled={adding || !newItem.name.trim()}
                  className="rounded-lg bg-forest px-5 py-2 text-sm font-semibold text-cream transition-opacity disabled:opacity-40 dark:bg-soft-gold dark:text-forest-dark"
                >
                  {adding ? "Adding…" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
