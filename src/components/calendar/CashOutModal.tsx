"use client";

import { useEffect, useState } from "react";
import type { ScoreboardEntry } from "@/lib/calendar/types";

interface CashOutModalProps {
  entry: ScoreboardEntry;
  onClose: () => void;
  onRedeemed: () => void;
}

const PRESETS = [
  { amount: 10, label: "Screen time (30 min)" },
  { amount: 25, label: "Treat" },
  { amount: 50, label: "$5 allowance" },
  { amount: 100, label: "$10 allowance" },
];

export default function CashOutModal({
  entry,
  onClose,
  onRedeemed,
}: CashOutModalProps) {
  const [amount, setAmount] = useState<number>(PRESETS[0].amount);
  const [label, setLabel] = useState<string>(PRESETS[0].label);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const insufficient = amount > entry.balance;

  async function handleRedeem() {
    if (insufficient || amount <= 0 || !label.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/calendar/redemptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: entry.member_id,
          amount,
          label: label.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Redemption failed");
      }
      onRedeemed();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Redemption failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="soft-card w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
            style={{
              backgroundColor: `${entry.color}22`,
              border: `2px solid ${entry.color}`,
            }}
          >
            {entry.emoji ?? entry.name[0]}
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-forest dark:text-cream">
              Cash out for {entry.name}
            </h2>
            <p className="text-sm text-forest/60 dark:text-cream/60">
              Balance: <span className="font-semibold text-soft-gold-dark dark:text-soft-gold">{entry.balance}</span> pts
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-forest/60 dark:text-cream/60">
            Quick picks
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setAmount(p.amount);
                  setLabel(p.label);
                }}
                disabled={p.amount > entry.balance}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  amount === p.amount && label === p.label
                    ? "border-soft-gold bg-soft-gold/20 text-forest dark:text-cream"
                    : "border-sage/20 bg-cream/40 text-forest/80 hover:bg-cream/70 dark:border-soft-gold/15 dark:bg-dark-surface dark:text-cream/80"
                }`}
              >
                <div className="font-medium">{p.label}</div>
                <div className="text-xs text-forest/50 dark:text-cream/50">{p.amount} pts</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-[1fr_auto] gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-forest/60 dark:text-cream/60">
              Reward
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="What are they cashing out for?"
              className="enchanted-input w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-forest/60 dark:text-cream/60">
              Points
            </label>
            <input
              type="number"
              min={1}
              max={entry.balance}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="enchanted-input w-24"
            />
          </div>
        </div>

        {insufficient && (
          <p className="mb-3 text-sm text-red-600 dark:text-red-400">
            Not enough points. Balance is {entry.balance}.
          </p>
        )}
        {error && (
          <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-forest/70 transition-colors hover:bg-sage/10 dark:text-cream/70 dark:hover:bg-soft-gold/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRedeem}
            disabled={submitting || insufficient || amount <= 0 || !label.trim()}
            className="rounded-xl bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-50 dark:bg-soft-gold/90 dark:text-forest dark:hover:bg-soft-gold"
          >
            {submitting ? "Redeeming…" : `Redeem ${amount} pts`}
          </button>
        </div>
      </div>
    </div>
  );
}
