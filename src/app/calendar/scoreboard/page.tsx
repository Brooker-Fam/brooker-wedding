"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useVisiblePoll } from "@/lib/use-visible-poll";
import type { ScoreboardEntry } from "@/lib/calendar/types";

type SortKey = "week_points" | "month_points" | "all_time_points";

const TABS: { key: SortKey; label: string }[] = [
  { key: "week_points", label: "This Week" },
  { key: "month_points", label: "This Month" },
  { key: "all_time_points", label: "All Time" },
];

function medalFor(rank: number, value: number): string | null {
  if (value <= 0) return null;
  if (rank === 0) return "🥇";
  if (rank === 1) return "🥈";
  if (rank === 2) return "🥉";
  return null;
}

export default function ScoreboardPage() {
  const [entries, setEntries] = useState<ScoreboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("week_points");

  const fetchScoreboard = useCallback(async () => {
    const res = await fetch("/api/calendar/scoreboard");
    if (res.ok) {
      const data = (await res.json()) as ScoreboardEntry[];
      setEntries(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchScoreboard();
  }, [fetchScoreboard]);

  useVisiblePoll(fetchScoreboard);

  const sorted = [...entries].sort((a, b) => b[sortKey] - a[sortKey]);
  const maxValue = sorted.length > 0 ? sorted[0][sortKey] : 0;

  return (
    <div className="bulletin-board min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="bulletin-header mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1 text-sm font-medium text-forest/60 transition-colors hover:text-forest dark:text-cream/60 dark:hover:text-cream"
            >
              ‹ Calendar
            </Link>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Tally of Quests
            </h1>
            <p className="bulletin-subtitle mt-2 text-sm">
              Who&apos;s been earning their keep.
            </p>
          </div>
        </header>

        <div
          role="tablist"
          aria-label="Scoreboard timeframe"
          className="mb-6 inline-flex rounded-xl p-1"
        >
          {TABS.map((tab) => {
            const active = sortKey === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={active}
                onClick={() => setSortKey(tab.key)}
                className={`bulletin-button mx-0.5 rounded-lg px-3 py-1.5 text-sm font-medium sm:px-4 sm:py-2 ${
                  active ? "bulletin-button--active" : ""
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="bulletin-card flex items-center justify-center p-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-sage/30 border-t-sage" />
          </div>
        )}

        {!loading && sorted.length === 0 && (
          <div className="bulletin-card p-8 text-center">
            <p className="text-forest/70 dark:text-cream/70">
              No household members yet.
            </p>
            <Link
              href="/calendar/admin"
              className="mt-3 inline-block rounded-xl bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest-light dark:bg-sage dark:hover:bg-sage-light"
            >
              Set up the calendar →
            </Link>
          </div>
        )}

        {!loading && sorted.length > 0 && (
          <ol className="space-y-3">
            {sorted.map((entry, rank) => {
              const value = entry[sortKey];
              const medal = medalFor(rank, value);
              const barPct =
                maxValue > 0 ? Math.max(4, (value / maxValue) * 100) : 0;

              return (
                <li
                  key={entry.member_id}
                  className="bulletin-card flex items-center gap-4 p-4 sm:p-5"
                  style={{ borderLeftColor: entry.color }}
                >
                  <span className="bulletin-pin" aria-hidden="true" />
                  <div className="flex w-10 shrink-0 items-center justify-center text-2xl sm:w-12 sm:text-3xl">
                    {medal ?? (
                      <span className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-forest/40 dark:text-cream/40 sm:text-3xl">
                        {rank + 1}
                      </span>
                    )}
                  </div>

                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl sm:h-14 sm:w-14 sm:text-2xl"
                    style={{
                      backgroundColor: `${entry.color}22`,
                      border: `2px solid ${entry.color}`,
                    }}
                    aria-hidden="true"
                  >
                    {entry.emoji ?? entry.name[0]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-[family-name:var(--font-cormorant-garamond)] text-xl font-semibold text-forest dark:text-cream sm:text-2xl">
                        {entry.name}
                      </span>
                      <span className="text-xs text-forest/50 dark:text-cream/50">
                        {entry.completed_count}{" "}
                        {entry.completed_count === 1 ? "task" : "tasks"} done
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-sage/20 dark:bg-sage/15">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-soft-gold-dark via-soft-gold to-soft-gold-light transition-all duration-500"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-soft-gold-dark dark:text-soft-gold sm:text-3xl">
                      {value}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-forest/50 dark:text-cream/50 sm:text-xs">
                      points
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
