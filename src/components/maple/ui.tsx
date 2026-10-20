"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { dayKey, formatDayLabel, formatTime, localParts, zonedTimeToUtc } from "@/lib/maple/time";
import type { Member } from "@/lib/maple/types";
import { useMaple } from "./useMaple";

/**
 * Small UI kit for Maple's Log. Big tap targets (≥ 44px), cream storybook
 * cards by day, deep-forest cards by night. Other maple components should
 * build from these so the app feels like one thing.
 */

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Shared class strings. */
export const tone = {
  card: "rounded-3xl border border-[#1D4420]/10 bg-white/75 shadow-[0_2px_18px_rgba(29,68,32,0.06)] backdrop-blur-sm dark:border-[#C49A3C]/15 dark:bg-[#12261A]/80 dark:shadow-none",
  inset: "rounded-2xl bg-[#FDF8F0] dark:bg-[#0E1E12]",
  heading: "font-[family-name:var(--font-display)] font-semibold text-[#1D4420] dark:text-[#F5EDDF]",
  body: "text-[#2E3B2C] dark:text-[#E8DCC0]",
  muted: "text-[#5C6B57] dark:text-[#B9B39C]",
  label: "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5C7A4A] dark:text-[#A9C08F]",
  input:
    "w-full rounded-2xl border border-[#1D4420]/15 bg-white px-4 py-3 text-base text-[#1D4420] outline-none transition focus:border-[#C49A3C] focus:ring-2 focus:ring-[#C49A3C]/30 dark:border-[#C49A3C]/20 dark:bg-[#0E1E12] dark:text-[#F5EDDF]",
};

// ── Buttons ──────────────────────────────────────────────────────────────

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "soft" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function Button({ children, onClick, variant = "primary", size = "md", type = "button", disabled, className, ...rest }: ButtonProps) {
  const v = {
    primary: "bg-[#1D4420] text-[#FDF8F0] hover:bg-[#2D5A2F] dark:bg-[#C49A3C] dark:text-[#14210F] dark:hover:bg-[#D4AE56]",
    gold: "bg-[#C49A3C] text-[#1D2A12] hover:bg-[#D4AE56]",
    soft: "bg-[#1D4420]/[0.07] text-[#1D4420] hover:bg-[#1D4420]/[0.12] dark:bg-[#F5EDDF]/10 dark:text-[#F5EDDF] dark:hover:bg-[#F5EDDF]/15",
    ghost: "text-[#1D4420] hover:bg-[#1D4420]/[0.06] dark:text-[#E8DCC0] dark:hover:bg-[#F5EDDF]/10",
    danger: "bg-[#B5452B]/10 text-[#9A3A24] hover:bg-[#B5452B]/15 dark:bg-[#E07A5F]/15 dark:text-[#F4A68F]",
  }[variant];
  const s = { sm: "min-h-[36px] px-3 text-sm", md: "min-h-[44px] px-4 text-[15px]", lg: "min-h-[56px] px-5 text-base" }[size];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={rest["aria-label"]}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100",
        v,
        s,
        className
      )}
    >
      {children}
    </button>
  );
}

export function Chip({
  children,
  selected,
  onClick,
  color,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  /** Accent hex for the selected state. */
  color?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={selected && color ? { backgroundColor: color, borderColor: color } : undefined}
      className={cx(
        "inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition active:scale-[0.97]",
        selected
          ? cx("border-[#1D4420] text-white", !color && "bg-[#1D4420] dark:border-[#C49A3C] dark:bg-[#C49A3C] dark:text-[#14210F]")
          : "border-[#1D4420]/15 bg-white/70 text-[#1D4420] hover:border-[#1D4420]/30 dark:border-[#F5EDDF]/15 dark:bg-transparent dark:text-[#E8DCC0]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cx("flex rounded-full bg-[#1D4420]/[0.07] p-1 dark:bg-[#F5EDDF]/10", className)} role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            "min-h-[40px] flex-1 rounded-full px-3 text-sm font-semibold transition",
            value === o.value
              ? "bg-white text-[#1D4420] shadow-sm dark:bg-[#C49A3C] dark:text-[#14210F]"
              : "text-[#1D4420]/70 dark:text-[#E8DCC0]/80"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Fields ───────────────────────────────────────────────────────────────

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className={cx(tone.label, "mb-1.5 block")}>{label}</span>
      {children}
      {hint && <span className={cx(tone.muted, "mt-1 block text-xs")}>{hint}</span>}
    </label>
  );
}

/** Number input with − / + buttons. Empty string = no value. */
export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  suffix,
  decimals = 0,
  ariaLabel,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  decimals?: number;
  ariaLabel: string;
}) {
  const [text, setText] = useState(value == null ? "" : String(value));
  useEffect(() => {
    setText((t) => (Number(t) === value && t !== "" ? t : value == null ? "" : String(value)));
  }, [value]);
  const bump = (d: number) => {
    const next = Math.min(max, Math.max(min, Math.round(((value ?? 0) + d) * 10 ** decimals) / 10 ** decimals));
    onChange(next);
  };
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label={`Less ${ariaLabel}`} onClick={() => bump(-step)} className="h-12 w-12 shrink-0 rounded-full bg-[#1D4420]/[0.07] text-2xl font-semibold text-[#1D4420] active:scale-95 dark:bg-[#F5EDDF]/10 dark:text-[#F5EDDF]">
        −
      </button>
      <div className="relative flex-1">
        <input
          inputMode="decimal"
          aria-label={ariaLabel}
          value={text}
          onChange={(e) => {
            const t = e.target.value.replace(/[^\d.]/g, "");
            setText(t);
            if (t === "") onChange(null);
            else if (Number.isFinite(Number(t))) onChange(Math.min(max, Number(t)));
          }}
          className={cx(tone.input, "text-center text-xl font-semibold", suffix && "pr-12")}
        />
        {suffix && <span className={cx(tone.muted, "pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm")}>{suffix}</span>}
      </div>
      <button type="button" aria-label={`More ${ariaLabel}`} onClick={() => bump(step)} className="h-12 w-12 shrink-0 rounded-full bg-[#1D4420]/[0.07] text-2xl font-semibold text-[#1D4420] active:scale-95 dark:bg-[#F5EDDF]/10 dark:text-[#F5EDDF]">
        +
      </button>
    </div>
  );
}

/** "When did it happen?" — Now by default, quick offsets, or an exact time. */
export function WhenField({
  label = "When",
  value,
  onChange,
  tz,
  offsets = [5, 15, 30, 60, 120],
}: {
  label?: string;
  /** null = now */
  value: Date | null;
  onChange: (d: Date | null) => void;
  tz: string;
  offsets?: number[];
}) {
  const { now } = useMaple();
  const [custom, setCustom] = useState(false);
  // Which quick chip was tapped, so it stays lit as the clock moves on.
  const [chip, setChip] = useState<number | null>(null);
  const id = useId();
  const n = now();
  const shown = value ?? n;
  const p = localParts(shown, tz);
  const pad = (x: number) => String(x).padStart(2, "0");
  const localValue = `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;

  return (
    <div>
      <span className={cx(tone.label, "mb-1.5 block")}>{label}</span>
      <div className="flex flex-wrap gap-2">
        <Chip selected={!value && !custom} onClick={() => { setCustom(false); setChip(null); onChange(null); }}>
          Now
        </Chip>
        {offsets.map((m) => (
          <Chip
            key={m}
            selected={!custom && !!value && chip === m}
            onClick={() => {
              setCustom(false);
              setChip(m);
              onChange(new Date(n.getTime() - m * 60000));
            }}
          >
            {m < 60 ? `${m}m ago` : `${m / 60}h ago`}
          </Chip>
        ))}
        <Chip selected={custom} onClick={() => { setCustom(true); setChip(null); }}>
          🕰️ Pick
        </Chip>
      </div>
      {custom && (
        <input
          id={id}
          type="datetime-local"
          aria-label={`${label}: exact time`}
          value={localValue}
          max={(() => {
            const q = localParts(n, tz);
            return `${q.year}-${pad(q.month)}-${pad(q.day)}T${pad(q.hour)}:${pad(q.minute)}`;
          })()}
          onChange={(e) => {
            const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(e.target.value);
            if (!m) return;
            onChange(zonedTimeToUtc(+m[1], +m[2], +m[3], +m[4], +m[5], tz));
          }}
          className={cx(tone.input, "mt-2")}
        />
      )}
      {value && (
        <p className={cx(tone.muted, "mt-1.5 text-xs")}>
          {formatDayLabel(dayKey(value, tz), dayKey(n, tz))} at {formatTime(value, tz)}
        </p>
      )}
    </div>
  );
}

export function TextArea({ value, onChange, placeholder, rows = 2 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      rows={rows}
      maxLength={2000}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cx(tone.input, "resize-none")}
    />
  );
}

// ── Sheet (bottom drawer) ────────────────────────────────────────────────

export function Sheet({
  open,
  onClose,
  title,
  emoji,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  emoji?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const drag = useDragControls();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-[#0B1A0D]/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            drag="y"
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="relative flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-[28px] bg-[#FDF8F0] outline-none sm:rounded-[28px] dark:bg-[#10221A]"
          >
            {/* Drag from the header to dismiss; the body scrolls normally. */}
            <div className="shrink-0 touch-none" onPointerDown={(e) => drag.start(e)}>
            <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-[#1D4420]/20 dark:bg-[#F5EDDF]/20" />
            <div className="flex items-center justify-between px-5 pt-2 pb-3">
              <h2 className={cx(tone.heading, "text-2xl")}>
                {emoji && <span className="mr-2">{emoji}</span>}
                {title}
              </h2>
              <button type="button" onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-[#1D4420]/60 hover:bg-[#1D4420]/5 dark:text-[#F5EDDF]/60">
                ✕
              </button>
            </div>
            </div>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 pb-4">
              {children}
            </div>
            {footer && (
              <div className="shrink-0 border-t border-[#1D4420]/10 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-[#F5EDDF]/10">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Bits ─────────────────────────────────────────────────────────────────

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(tone.card, "p-4", className)}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 flex items-end justify-between px-1">
      <h2 className={cx(tone.heading, "text-xl")}>{children}</h2>
      {action}
    </div>
  );
}

export function Avatar({ member, size = 28 }: { member: Member | null; size?: number }) {
  return (
    <span
      title={member?.display_name ?? member?.email ?? ""}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#C49A3C]/20 dark:bg-[#C49A3C]/25"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-hidden
    >
      {member?.emoji ?? "🍁"}
    </span>
  );
}

export function EmptyState({ emoji, title, children }: { emoji: string; title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-10 text-center">
      <div className="mb-2 text-4xl" aria-hidden>
        {emoji}
      </div>
      <p className={cx(tone.heading, "text-xl")}>{title}</p>
      {children && <div className={cx(tone.muted, "mt-1 text-sm")}>{children}</div>}
    </div>
  );
}

/** Toasts pinned above the tab bar. */
export function ToastHost() {
  const { toasts, dismissToast } = useMaple();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(84px+env(safe-area-inset-bottom))] z-[90] flex flex-col items-center gap-2 px-4" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className={cx(
              "pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-[15px] shadow-lg",
              t.tone === "error" ? "bg-[#7A2E1E] text-white" : "bg-[#1D4420] text-[#FDF8F0] dark:bg-[#F5EDDF] dark:text-[#14210F]"
            )}
          >
            {t.emoji && <span aria-hidden>{t.emoji}</span>}
            <span className="flex-1">
              {t.text}
              {t.actions?.length ? (
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {t.actions.map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      aria-label={a.ariaLabel ?? a.label}
                      onClick={() => {
                        a.onClick();
                        dismissToast(t.id);
                      }}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-white/15 px-2.5 text-xs font-semibold dark:bg-[#14210F]/10"
                    >
                      {a.color && <span className="h-4 w-4 rounded-full ring-1 ring-white/50" style={{ backgroundColor: a.color }} aria-hidden />}
                      {a.label}
                    </button>
                  ))}
                </span>
              ) : null}
            </span>
            {t.undo && (
              <button
                type="button"
                onClick={() => {
                  t.undo?.();
                  dismissToast(t.id);
                }}
                className="min-h-[36px] rounded-full bg-white/15 px-3 text-sm font-bold uppercase tracking-wide dark:bg-[#14210F]/10"
              >
                Undo
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
