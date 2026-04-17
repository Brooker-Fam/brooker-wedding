"use client";

import { useEffect, useState } from "react";
import type { ActivityEvent } from "@/lib/calendar/types";

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function kindIcon(kind: ActivityEvent["kind"]): string {
  if (kind === "task") return "✓";
  if (kind === "event") return "📅";
  return "💰";
}

interface ActivityFeedProps {
  limit?: number;
  refreshKey?: number;
}

export default function ActivityFeed({ limit = 20, refreshKey = 0 }: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/calendar/activity?limit=${limit}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) {
          setEvents(data as ActivityEvent[]);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [limit, refreshKey]);

  if (loading) {
    return (
      <div className="soft-card flex items-center justify-center p-6">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-sage/30 border-t-sage" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="soft-card p-6 text-center text-sm text-forest/60 dark:text-cream/60">
        No activity yet — go check something off!
      </div>
    );
  }

  return (
    <ol className="space-y-2">
      {events.map((e) => {
        const isRedemption = e.kind === "redemption";
        const pointsText = isRedemption
          ? `${e.points} pt`
          : `+${e.points} pt`;
        const pointsClass = isRedemption
          ? "text-lavender dark:text-lavender"
          : "text-soft-gold-dark dark:text-soft-gold";
        return (
          <li
            key={e.id}
            className="flex items-center gap-3 rounded-lg border border-sage/15 bg-cream/60 px-3 py-2 dark:border-soft-gold/10 dark:bg-dark-surface"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
              style={{
                backgroundColor: `${e.member_color}22`,
                border: `2px solid ${e.member_color}`,
              }}
              aria-hidden="true"
            >
              {e.member_emoji ?? e.member_name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-forest dark:text-cream">
                <span className="font-semibold">{e.member_name}</span>{" "}
                {isRedemption ? "cashed out for" : "did"}{" "}
                <span className="text-forest/80 dark:text-cream/80">{e.title}</span>
              </p>
              <p className="text-xs text-forest/50 dark:text-cream/50">
                <span aria-hidden="true">{kindIcon(e.kind)}</span>{" "}
                {relativeTime(e.happened_at)}
              </p>
            </div>
            {e.points !== 0 && (
              <span className={`shrink-0 text-sm font-semibold ${pointsClass}`}>
                {pointsText}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
