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

type Filter = "all" | "mine" | "unclaimed";

const QUESTIONS: { id: string; label: string; sub?: string; options: string[] }[] = [
  {
    id: "meetup",
    label: "Pre-trip gear check at Matt's?",
    sub: "Lay everything out, pack the bear can, weigh packs.",
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
    label: "Saturday's summit?",
    sub: "Camp is Lake Colden either way — this is just which run we aim at.",
    options: [
      "Marcy (+ Gray? + Skylight?)",
      "Algonquin from the lake",
      "Colden ladders",
      "Decide that morning",
    ],
  },
];

const PERSON_COLORS: Record<string, string> = {
  Matt: "bg-forest text-cream border-forest",
  Liam: "bg-soft-gold text-forest-dark border-soft-gold",
};

function splitNames(claimed: string | null): string[] {
  return claimed ? claimed.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function isOptional(item: GearItem): boolean {
  return item.name.toLowerCase().includes("optional");
}

export default function TripBoard() {
  const [person, setPerson] = useState<string | null>(null);
  const [items, setItems] = useState<GearItem[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [mock, setMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [hidePacked, setHidePacked] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "kitchen", qty: "" });

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
    // Stay in sync while two people edit at once: refresh on focus + a slow
    // poll that only runs while the tab is visible.
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 45000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
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
          claimed_by: person,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setItems((cur) => [...cur, data.data]);
        setNewItem({ name: "", category: "kitchen", qty: "" });
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
    const packed = items.filter((it) => it.packed).length;
    const unclaimedSerious = items.filter(
      (it) => splitNames(it.claimed_by).length === 0 && !isOptional(it)
    ).length;
    const mine = person
      ? items.filter((it) => splitNames(it.claimed_by).includes(person)).length
      : 0;
    const minePacked = person
      ? items.filter((it) => splitNames(it.claimed_by).includes(person) && it.packed).length
      : 0;
    return { claimed, packed, unclaimedSerious, mine, minePacked, total: items.length };
  }, [items, person]);

  const matchesFilter = useCallback(
    (it: GearItem): boolean => {
      if (hidePacked && it.packed) return false;
      const names = splitNames(it.claimed_by);
      if (filter === "mine") return person !== null && names.includes(person);
      if (filter === "unclaimed") return names.length === 0;
      return true;
    },
    [filter, hidePacked, person]
  );

  const voteFor = (qid: string) => votes.filter((v) => v.question_id === qid);

  const FILTER_TABS: { id: Filter; label: string; badge?: number }[] = [
    { id: "all", label: "Everything" },
    { id: "mine", label: person ? `${person}'s stuff` : "My stuff", badge: stats.mine },
    { id: "unclaimed", label: "Needs an owner", badge: stats.unclaimedSerious },
  ];

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-forest px-5 py-2.5 text-sm text-cream shadow-lg dark:bg-soft-gold dark:text-forest-dark">
          {toast}
        </div>
      )}

      {/* Who are you — compact strip */}
      <div className="soft-card dark:soft-card-dark flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold">You are:</span>
          {TRIP_PEOPLE.map((p) => (
            <button
              key={p}
              onClick={() => pickPerson(p)}
              className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-all ${
                person === p ? PERSON_COLORS[p] : "border-sage/40 hover:border-sage"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        {person && (
          <span className="text-sm opacity-75">
            You&apos;re bringing <strong>{stats.mine}</strong>{" "}
            {stats.mine === 1 ? "thing" : "things"} · {stats.minePacked} packed
          </span>
        )}
        {!person && <span className="text-sm opacity-75">Pick your name so taps count as you</span>}
      </div>

      {mock && (
        <p className="rounded-lg bg-soft-gold/15 px-3 py-2 text-xs">
          Local preview — the live site saves everyone&apos;s changes.
        </p>
      )}

      {/* Gear */}
      <section id="gear">
        <h2 className="mb-1 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold">
          🎒 The packing list
        </h2>
        <p className="mb-4 text-sm opacity-75">
          Tap <em>I&apos;ll bring it</em> to claim something, the initials to assign someone else,
          and the box once it&apos;s physically in a pack.
        </p>

        {/* Progress + filters */}
        {!loading && (
          <div className="soft-card dark:soft-card-dark mb-5 p-4">
            <div className="mb-2 flex items-baseline justify-between text-xs font-semibold">
              <span>
                {stats.claimed}/{stats.total} claimed · {stats.packed} packed
              </span>
              {stats.unclaimedSerious > 0 ? (
                <button className="underline opacity-80" onClick={() => setFilter("unclaimed")}>
                  {stats.unclaimedSerious} still need an owner →
                </button>
              ) : (
                <span className="text-forest dark:text-soft-gold">
                  Everything essential has an owner 🎉
                </span>
              )}
            </div>
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-sage/20">
              <div className="relative h-full">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-sage"
                  style={{ width: `${stats.total ? (stats.claimed / stats.total) * 100 : 0}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-soft-gold"
                  style={{ width: `${stats.total ? (stats.packed / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    filter === t.id
                      ? "border-forest bg-forest text-cream dark:border-soft-gold dark:bg-soft-gold dark:text-forest-dark"
                      : "border-sage/35 hover:border-sage/70"
                  }`}
                >
                  {t.label}
                  {t.badge !== undefined && t.badge > 0 && (
                    <span className="ml-1.5 rounded-full bg-black/15 px-1.5 dark:bg-black/25">
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
              <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-xs opacity-80">
                <input
                  type="checkbox"
                  checked={hidePacked}
                  onChange={(e) => setHidePacked(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[#C49A3C]"
                />
                hide packed
              </label>
            </div>
          </div>
        )}

        {loading ? (
          <div className="soft-card dark:soft-card-dark p-8 text-center opacity-70">
            Loading the list…
          </div>
        ) : filter === "mine" && !person ? (
          <div className="soft-card dark:soft-card-dark p-8 text-center text-sm opacity-75">
            Pick your name up top and this becomes your personal packing list.
          </div>
        ) : (
          <div className="space-y-5">
            {GEAR_CATEGORIES.map((cat) => {
              const allCatItems = items.filter((it) => it.category === cat.id);
              const catItems = allCatItems
                .filter(matchesFilter)
                .sort((a, b) => a.sort - b.sort || a.id - b.id);
              if (catItems.length === 0) return null;
              const catClaimed = allCatItems.filter(
                (it) => splitNames(it.claimed_by).length > 0
              ).length;
              return (
                <div key={cat.id} className="soft-card dark:soft-card-dark overflow-hidden">
                  <div className="flex items-baseline justify-between border-b border-sage/20 px-5 py-3">
                    <div>
                      <h3 className="font-semibold">
                        {cat.emoji} {cat.label}
                      </h3>
                      {cat.blurb && <p className="mt-0.5 text-xs opacity-70">{cat.blurb}</p>}
                    </div>
                    <span className="shrink-0 text-xs font-semibold opacity-60">
                      {catClaimed}/{allCatItems.length}
                    </span>
                  </div>
                  <ul className="divide-y divide-sage/15">
                    {catItems.map((item) => {
                      const names = splitNames(item.claimed_by);
                      const unclaimed = names.length === 0;
                      const mine = person !== null && names.includes(person);
                      const others = person
                        ? TRIP_PEOPLE.filter((p) => p !== person)
                        : TRIP_PEOPLE;
                      return (
                        <li
                          key={item.id}
                          className={`flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between ${
                            unclaimed && !isOptional(item)
                              ? "border-l-4 border-l-soft-gold"
                              : "border-l-4 border-l-transparent"
                          } ${item.packed ? "opacity-55" : ""}`}
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
                              {names
                                .filter((n) => n !== person)
                                .map((n) => (
                                  <span
                                    key={n}
                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${PERSON_COLORS[n] ?? "border-sage/40"}`}
                                  >
                                    {n}
                                  </span>
                                ))}
                            </div>
                            {item.notes && <p className="mt-0.5 text-xs opacity-70">{item.notes}</p>}
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center gap-2">
                            {person && (
                              <button
                                onClick={() => toggleClaim(item, person)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                                  mine
                                    ? PERSON_COLORS[person]
                                    : "border-sage/40 hover:border-sage"
                                }`}
                              >
                                {mine ? "✓ Got it" : "I'll bring it"}
                              </button>
                            )}
                            <span className="flex gap-1">
                              {others.map((p) => (
                                <button
                                  key={p}
                                  onClick={() => toggleClaim(item, p)}
                                  title={
                                    names.includes(p)
                                      ? `${p} is bringing this — tap to un-assign`
                                      : `Assign to ${p}`
                                  }
                                  className={`rounded-full border px-2 py-1 text-[11px] font-bold transition-all ${
                                    names.includes(p)
                                      ? PERSON_COLORS[p]
                                      : "border-sage/30 opacity-45 hover:opacity-100"
                                  }`}
                                >
                                  {p[0]}
                                </button>
                              ))}
                            </span>
                            <label className="flex cursor-pointer items-center gap-1 text-xs opacity-80">
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
                                className="text-xs opacity-40 hover:opacity-100"
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
            <div className="soft-card dark:soft-card-dark p-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addItem();
                  }}
                  placeholder="➕ Add something we forgot…"
                  className="enchanted-input flex-1 rounded-lg px-3 py-2 text-sm"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="enchanted-input rounded-lg px-3 py-2 text-sm sm:max-w-48"
                >
                  {GEAR_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addItem}
                  disabled={adding || !newItem.name.trim()}
                  className="rounded-lg bg-forest px-5 py-2 text-sm font-semibold text-cream transition-opacity disabled:opacity-40 dark:bg-soft-gold dark:text-forest-dark"
                >
                  {adding ? "Adding…" : "Add"}
                </button>
              </div>
              <p className="mt-1.5 text-xs opacity-60">
                New items get claimed by you automatically{person ? ` (${person})` : " once you pick your name"}.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Decisions */}
      <section id="decisions">
        <h2 className="mb-1 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold">
          🗳️ Group decisions
        </h2>
        <p className="mb-4 text-sm opacity-75">
          These change the plan — vote once you know.
        </p>
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
                    const mineVote = person !== null && voters.includes(person);
                    return (
                      <button
                        key={opt}
                        onClick={() => castVote(q.id, opt)}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
                          mineVote
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
    </div>
  );
}
