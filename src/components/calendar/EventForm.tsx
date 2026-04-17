"use client";

import { useState } from "react";
import type {
  CalendarEventWithMember,
  FamilyMember,
} from "@/lib/calendar/types";

interface EventFormProps {
  event: CalendarEventWithMember;
  members: FamilyMember[];
  onSave: (patch: {
    assigned_to: number | null;
    points: number;
  }) => Promise<void> | void;
  onCancel: () => void;
}

/**
 * Admin-only modal for editing the locally-owned fields of a Google-sourced
 * event. Title/time/location come from Google and are read-only.
 */
export default function EventForm({
  event,
  members,
  onSave,
  onCancel,
}: EventFormProps) {
  const [assignedTo, setAssignedTo] = useState<number | null>(
    event.assigned_to
  );
  const [points, setPoints] = useState<number>(event.points);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ assigned_to: assignedTo, points });
    } finally {
      setSaving(false);
    }
  };

  const timeStr = event.all_day
    ? "All day"
    : new Date(event.start_at).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/20 p-4 backdrop-blur-sm dark:bg-black/40">
      <div className="w-full max-w-md rounded-2xl border border-sage/20 bg-cream p-6 shadow-xl dark:border-soft-gold/15 dark:bg-dark-bg">
        <h2 className="mb-1 font-[family-name:var(--font-cormorant-garamond)] text-xl font-bold text-forest dark:text-cream">
          {event.title}
        </h2>
        <p className="mb-4 text-xs text-forest/60 dark:text-cream/60">
          {timeStr}
          {event.location ? ` · ${event.location}` : ""}
          {event.calendar_summary ? ` · ${event.calendar_summary}` : ""}
        </p>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-forest/60 dark:text-cream/60">
              Who is this for?
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAssignedTo(null)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  assignedTo === null
                    ? "border-forest bg-forest text-cream dark:border-sage dark:bg-sage"
                    : "border-sage/30 text-forest/70 hover:bg-sage/10 dark:border-cream/20 dark:text-cream/70"
                }`}
              >
                Everyone
              </button>
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setAssignedTo(m.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    assignedTo === m.id
                      ? "border-transparent text-white"
                      : "border-sage/30 text-forest/70 hover:bg-sage/10 dark:border-cream/20 dark:text-cream/70"
                  }`}
                  style={
                    assignedTo === m.id
                      ? { backgroundColor: m.color }
                      : undefined
                  }
                >
                  {m.avatar_emoji} {m.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-forest/60 dark:text-cream/60">
              Points on attendance
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={100}
                value={points}
                onChange={(e) => setPoints(Math.max(0, Number(e.target.value) || 0))}
                className="enchanted-input w-24"
              />
              <div className="flex gap-1">
                {[0, 1, 2, 5, 10].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPoints(p)}
                    className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                      points === p
                        ? "border-soft-gold bg-soft-gold/20 text-soft-gold-dark dark:text-soft-gold"
                        : "border-sage/30 text-forest/60 hover:bg-sage/10 dark:border-cream/20 dark:text-cream/60"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-1 text-[11px] text-forest/50 dark:text-cream/50">
              Awarded when someone taps ✓ on the event.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-sage/30 px-4 py-2 text-sm font-medium text-forest/70 transition-colors hover:bg-sage/10 dark:border-cream/20 dark:text-cream/70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest-light disabled:opacity-50 dark:bg-sage dark:hover:bg-sage-light"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
