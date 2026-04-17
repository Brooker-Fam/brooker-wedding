"use client";

import { useEffect } from "react";
import type { FamilyMember } from "@/lib/calendar/types";

interface CompleterPickerProps {
  taskTitle: string;
  members: FamilyMember[];
  onPick: (memberId: number) => void;
  onCancel: () => void;
}

export default function CompleterPicker({
  taskTitle,
  members,
  onPick,
  onCancel,
}: CompleterPickerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-label="Who did this task?"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 bg-forest/30 backdrop-blur-sm dark:bg-black/60"
      />
      <div className="soft-card relative w-full max-w-sm rounded-2xl p-5 shadow-xl">
        <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold text-forest dark:text-cream">
          Who did it?
        </h2>
        <p className="mt-1 text-sm text-forest/60 dark:text-cream/60">
          <span className="font-medium text-forest/80 dark:text-cream/80">
            {taskTitle}
          </span>
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onPick(m.id)}
              className="flex items-center gap-2 rounded-xl border border-sage/20 bg-cream/60 px-3 py-2.5 text-left transition-colors hover:border-soft-gold/50 hover:bg-soft-gold/10 dark:border-soft-gold/15 dark:bg-dark-surface dark:hover:bg-soft-gold/10"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
                style={{
                  backgroundColor: `${m.color}22`,
                  border: `2px solid ${m.color}`,
                }}
                aria-hidden="true"
              >
                {m.avatar_emoji ?? m.name[0]}
              </span>
              <span className="font-medium text-forest dark:text-cream">
                {m.name}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="mt-4 w-full rounded-xl border border-sage/20 px-4 py-2 text-sm font-medium text-forest/70 transition-colors hover:bg-sage/10 dark:border-soft-gold/15 dark:text-cream/70 dark:hover:bg-soft-gold/10"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
