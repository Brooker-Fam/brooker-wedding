"use client";

import { useCallback, useEffect, useState } from "react";
import type { FamilyMember, GoogleCalendar } from "@/lib/calendar/types";

interface Props {
  members: FamilyMember[];
  onSynced?: () => void;
}

type SyncResult = {
  calendar: string;
  upserted: number;
  cancelled: number;
  error?: string;
};

export default function GoogleCalendarPanel({ members, onSynced }: Props) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResult[] | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/calendar/google/calendars");
    if (res.ok) {
      const data = await res.json();
      setConnected(data.connected);
      setCalendars(data.calendars ?? []);
    } else {
      const data = await res.json().catch(() => ({}));
      setLastError(data.error ?? "Failed to load Google Calendar status");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const togglePatch = async (
    id: number,
    patch: { enabled?: boolean; assigned_to?: number | null }
  ) => {
    const res = await fetch("/api/calendar/google/calendars", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) fetchStatus();
  };

  const syncNow = async () => {
    setSyncing(true);
    setLastError(null);
    setSyncResults(null);
    try {
      const res = await fetch("/api/calendar/google/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setLastError(data.error ?? "Sync failed");
      } else if (data.ok === false) {
        setLastError(data.error ?? "Sync failed");
      } else {
        setSyncResults(data.results ?? []);
        onSynced?.();
      }
    } finally {
      setSyncing(false);
      fetchStatus();
    }
  };

  const disconnect = async () => {
    if (!confirm("Disconnect Google Calendar? Your local event history stays.")) return;
    await fetch("/api/calendar/google/disconnect", { method: "POST" });
    fetchStatus();
  };

  if (loading) {
    return (
      <div className="mx-4 mb-4 rounded-xl border border-sage/20 bg-cream/50 p-4 text-sm text-forest/60 sm:mx-6 dark:bg-dark-surface dark:text-cream/60">
        Loading Google Calendar status…
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="mx-4 mb-4 rounded-xl border border-sage/20 bg-cream/50 p-4 sm:mx-6 dark:bg-dark-surface">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-forest dark:text-cream">
              Google Calendar
            </h3>
            <p className="mt-0.5 text-sm text-forest/60 dark:text-cream/60">
              Connect to pull TKD, drama club, and other family events into the
              calendar.
            </p>
          </div>
          <a
            href="/api/calendar/google/authorize"
            className="rounded-xl bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest-light dark:bg-sage dark:hover:bg-sage-light"
          >
            Connect Google Calendar
          </a>
        </div>
        {lastError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{lastError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 rounded-xl border border-sage/20 bg-cream/50 p-4 sm:mx-6 dark:bg-dark-surface">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-forest dark:text-cream">
            Google Calendar · connected
          </h3>
          <p className="mt-0.5 text-sm text-forest/60 dark:text-cream/60">
            Toggle calendars to sync. Events appear alongside chores.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={syncNow}
            disabled={syncing}
            className="rounded-xl border border-soft-gold/40 bg-soft-gold/10 px-3 py-1.5 text-sm font-medium text-soft-gold-dark transition-colors hover:bg-soft-gold/20 disabled:opacity-50 dark:text-soft-gold"
          >
            {syncing ? "Syncing…" : "Sync now"}
          </button>
          <button
            type="button"
            onClick={disconnect}
            className="rounded-xl border border-sage/30 px-3 py-1.5 text-sm font-medium text-forest/70 transition-colors hover:bg-sage/10 dark:text-cream/70"
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {calendars.length === 0 && (
          <p className="text-sm text-forest/50 dark:text-cream/50">
            No calendars found on the connected account.
          </p>
        )}
        {calendars.map((cal) => (
          <div
            key={cal.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-sage/10 bg-cream/70 p-2 text-sm dark:bg-dark-bg"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cal.enabled}
                onChange={(e) =>
                  togglePatch(cal.id, { enabled: e.target.checked })
                }
              />
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: cal.color ?? "#888" }}
              />
              <span className="font-medium text-forest dark:text-cream">
                {cal.summary}
              </span>
            </label>
            <label className="ml-auto flex items-center gap-2 text-xs text-forest/60 dark:text-cream/60">
              Default owner
              <select
                value={cal.assigned_to ?? ""}
                onChange={(e) =>
                  togglePatch(cal.id, {
                    assigned_to: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="rounded border border-sage/30 bg-cream px-1.5 py-0.5 dark:border-cream/20 dark:bg-dark-surface dark:text-cream"
              >
                <option value="">Everyone</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatar_emoji} {m.name}
                  </option>
                ))}
              </select>
            </label>
            {cal.last_synced_at && (
              <span className="text-[10px] text-forest/40 dark:text-cream/40">
                synced {new Date(cal.last_synced_at).toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>

      {syncResults && (
        <div className="mt-3 rounded-lg bg-sage/10 p-2 text-xs text-forest/70 dark:bg-sage/10 dark:text-cream/70">
          {syncResults.length === 0 ? (
            <span>No calendars enabled.</span>
          ) : (
            syncResults.map((r) => (
              <div key={r.calendar}>
                {r.error ? (
                  <span className="text-red-600 dark:text-red-400">
                    {r.calendar}: {r.error}
                  </span>
                ) : (
                  <span>
                    {r.calendar}: {r.upserted} upserted, {r.cancelled} cancelled
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {lastError && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{lastError}</p>
      )}
    </div>
  );
}
