"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ConfettiCelebration from "@/components/ConfettiCelebration";
import {
  CONVERSION_SECTIONS,
  CRIB_SECTION,
  HARDWARE,
  HARDWARE_PAGE,
  PARTS,
  PARTS_PAGES,
  PRODUCT,
  SAFETY_GROUPS,
  type Section,
  type Step,
} from "./data";

const STORAGE_KEY = "crib-guide-v1";

interface SavedState {
  steps: Record<string, boolean>;
  parts: Record<string, boolean>;
  hardware: Record<string, boolean>;
}

const EMPTY_STATE: SavedState = { steps: {}, parts: {}, hardware: {} };

type TabId = "build" | "parts" | "hardware" | "safety";

const TABS: { id: TabId; label: string }[] = [
  { id: "build", label: "Build" },
  { id: "parts", label: "Parts" },
  { id: "hardware", label: "Hardware" },
  { id: "safety", label: "Safety" },
];

const HW_BY_ID = new Map(HARDWARE.map((h) => [h.id, h]));
const PART_BY_NUM = new Map(PARTS.map((p) => [p.num, p]));

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

function hwLabel(id: string): string {
  const hw = HW_BY_ID.get(id);
  if (!hw) return id;
  return hw.spec ? `${hw.name} ${hw.spec}` : hw.name;
}

/* ---------- small shared bits ---------- */

function LetterBadge({ letter }: { letter: string }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#6B4226]/30 bg-[#D4A574]/15 text-xs font-bold text-[#6B4226] dark:border-[#E8C8A0]/30 dark:bg-[#D4A574]/20 dark:text-[#E8C8A0]">
      {letter}
    </span>
  );
}

function NumBadge({ num }: { num: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#2D5016]/25 bg-[#9CAF88]/15 text-xs font-bold text-[#2D5016] dark:border-[#C8D8B8]/30 dark:bg-[#9CAF88]/20 dark:text-[#C8D8B8]">
      {num}
    </span>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DiagramImage({ step }: { step: Step }) {
  const [w, h] = step.imageSize;
  return (
    <a
      href={step.image}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-zoom-in"
      title="Open full-size diagram in a new tab"
    >
      <div className="overflow-hidden rounded-xl border border-[#2D5016]/10 bg-white shadow-sm dark:border-[#9CAF88]/20">
        <Image
          src={step.image}
          alt={`Manual diagram for ${step.label}: ${step.title}`}
          width={w}
          height={h}
          sizes="(max-width: 768px) 92vw, 640px"
          className="h-auto w-full"
        />
      </div>
      <p className="mt-1.5 text-center text-xs text-[#2D5016]/45 group-hover:text-[#2D5016]/70 dark:text-[#FDF8F0]/40 dark:group-hover:text-[#FDF8F0]/70">
        Tap diagram to zoom
      </p>
    </a>
  );
}

/* ---------- step card ---------- */

function StepCard({
  step,
  done,
  expanded,
  onToggleDone,
  onToggleExpanded,
}: {
  step: Step;
  done: boolean;
  expanded: boolean;
  onToggleDone: () => void;
  onToggleExpanded: () => void;
}) {
  return (
    <motion.div
      {...fadeUp}
      id={step.id}
      className={`soft-card scroll-mt-24 overflow-hidden transition-opacity ${done && !expanded ? "opacity-70" : ""}`}
    >
      {/* header row */}
      <div className="flex items-center gap-3 p-3 sm:p-4">
        <button
          onClick={onToggleDone}
          aria-label={done ? `Mark ${step.label} as not done` : `Mark ${step.label} as done`}
          aria-pressed={done}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            done
              ? "border-[#5C7A4A] bg-[#5C7A4A] text-[#FDF8F0]"
              : "border-[#9CAF88]/60 bg-transparent text-transparent hover:border-[#5C7A4A] dark:border-[#9CAF88]/40"
          }`}
        >
          <CheckIcon className="h-5 w-5" />
        </button>
        <button
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          className="flex min-h-11 flex-1 items-center justify-between gap-2 text-left"
        >
          <div>
            <div className="text-[11px] font-semibold tracking-widest text-[#6B8F5B] uppercase dark:text-[#C0D4A8]">
              {step.label}
            </div>
            <div
              className={`font-[family-name:var(--font-display)] text-xl leading-tight font-semibold text-[#2D5016] dark:text-[#FDF8F0] ${
                done ? "line-through decoration-[#5C7A4A]/50" : ""
              }`}
            >
              {step.title}
            </div>
          </div>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className={`h-4 w-4 shrink-0 text-[#2D5016]/40 transition-transform dark:text-[#FDF8F0]/40 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="border-t border-[#9CAF88]/15 px-4 pt-4 pb-5 sm:px-5">
          {step.manualNote && (
            <p className="mb-3 rounded-lg bg-[#B8A9C9]/10 px-3 py-2 text-xs text-[#4A2040]/80 dark:bg-[#B8A9C9]/15 dark:text-[#D4C8E0]">
              {step.manualNote}
            </p>
          )}

          {/* hardware + parts chips */}
          {(step.hardware.length > 0 || step.parts.length > 0) && (
            <div className="mb-4 space-y-2">
              {step.hardware.length > 0 && (
                <div>
                  <div className="mb-1.5 text-[11px] font-semibold tracking-widest text-[#6B4226]/70 uppercase dark:text-[#E8C8A0]/70">
                    Hardware for this step
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {step.hardware.map((hw) => (
                      <span
                        key={hw.id}
                        className="flex items-center gap-1.5 rounded-full border border-[#D4A574]/25 bg-[#D4A574]/8 py-1 pr-2.5 pl-1 text-xs text-[#2D5016] dark:border-[#D4A574]/25 dark:bg-[#D4A574]/10 dark:text-[#FDF8F0]/85"
                      >
                        <LetterBadge letter={hw.id} />
                        {hwLabel(hw.id)}
                        <b>×{hw.qty}</b>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {step.parts.length > 0 && (
                <div>
                  <div className="mb-1.5 text-[11px] font-semibold tracking-widest text-[#2D5016]/60 uppercase dark:text-[#C8D8B8]/70">
                    Parts used
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {step.parts.map((num) => (
                      <span
                        key={num}
                        className="flex items-center gap-1.5 rounded-full border border-[#9CAF88]/30 bg-[#9CAF88]/8 py-1 pr-2.5 pl-1 text-xs text-[#2D5016] dark:border-[#9CAF88]/25 dark:bg-[#9CAF88]/10 dark:text-[#FDF8F0]/85"
                      >
                        <NumBadge num={num} />
                        {PART_BY_NUM.get(num)?.name ?? `Part ${num}`}
                        {(PART_BY_NUM.get(num)?.qty ?? 1) > 1 && <b>×{PART_BY_NUM.get(num)?.qty}</b>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* instructions */}
          <ul className="mb-4 space-y-2">
            {step.summary.map((line, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-sm leading-relaxed text-[#2D5016]/80 dark:text-[#FDF8F0]/75"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A574]/70" aria-hidden />
                {line}
              </li>
            ))}
          </ul>

          {step.tip && (
            <p className="mb-4 rounded-lg border border-[#9CAF88]/25 bg-[#9CAF88]/8 px-3 py-2.5 text-sm text-[#2D5016]/80 dark:bg-[#9CAF88]/10 dark:text-[#FDF8F0]/75">
              <b className="text-[#2D5016] dark:text-[#C8D8B8]">✨ Tip:</b> {step.tip}
            </p>
          )}
          {step.warning && (
            <p className="mb-4 rounded-lg border border-[#C0392B]/25 bg-[#C0392B]/6 px-3 py-2.5 text-sm text-[#7B2D26] dark:border-[#E8998D]/30 dark:bg-[#C0392B]/15 dark:text-[#F0C4BE]">
              <b>⚠ Safety:</b> {step.warning}
            </p>
          )}

          <DiagramImage step={step} />

          <button
            onClick={onToggleDone}
            className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors ${
              done
                ? "border border-[#9CAF88]/40 bg-transparent text-[#2D5016]/70 hover:bg-[#9CAF88]/10 dark:text-[#FDF8F0]/70"
                : "bg-[#5C7A4A] text-[#FDF8F0] shadow-sm hover:bg-[#4c6740]"
            }`}
          >
            {done ? (
              "Undo — not done yet"
            ) : (
              <>
                <CheckIcon className="h-4 w-4" /> Mark {step.label.toLowerCase()} done
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ---------- conversion section (collapsible, separate progress) ---------- */

function ConversionSection({
  section,
  done,
  expandedStep,
  onToggleDone,
  onToggleExpanded,
}: {
  section: Section;
  done: Record<string, boolean>;
  expandedStep: string | null;
  onToggleDone: (id: string) => void;
  onToggleExpanded: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const doneCount = section.steps.filter((s) => done[s.id]).length;

  return (
    <div className="soft-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between gap-3 p-4 text-left sm:p-5"
      >
        <div>
          <div className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
            {section.title}
          </div>
          <div className="mt-0.5 text-sm text-[#2D5016]/60 dark:text-[#FDF8F0]/60">{section.subtitle}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {doneCount > 0 && (
            <span className="rounded-full bg-[#9CAF88]/15 px-2 py-0.5 text-xs font-semibold text-[#2D5016] dark:text-[#C8D8B8]">
              {doneCount}/{section.steps.length}
            </span>
          )}
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className={`h-4 w-4 text-[#2D5016]/40 transition-transform dark:text-[#FDF8F0]/40 ${open ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="space-y-4 border-t border-[#9CAF88]/15 p-4 sm:p-5">
          {section.steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              done={!!done[step.id]}
              expanded={expandedStep === step.id}
              onToggleDone={() => onToggleDone(step.id)}
              onToggleExpanded={() => onToggleExpanded(step.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- checklists ---------- */

function ChecklistRow({
  badge,
  name,
  spec,
  qty,
  checked,
  onToggle,
}: {
  badge: React.ReactNode;
  name: string;
  spec?: string;
  qty: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={checked}
      className={`flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
        checked
          ? "border-[#5C7A4A]/30 bg-[#9CAF88]/12 dark:bg-[#9CAF88]/10"
          : "border-transparent hover:bg-[#9CAF88]/8"
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked
            ? "border-[#5C7A4A] bg-[#5C7A4A] text-[#FDF8F0]"
            : "border-[#9CAF88]/50 text-transparent"
        }`}
        aria-hidden
      >
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
      {badge}
      <span
        className={`flex-1 text-sm text-[#2D5016] dark:text-[#FDF8F0]/85 ${checked ? "line-through decoration-[#5C7A4A]/40 opacity-70" : ""}`}
      >
        {name}
        {spec && <span className="text-[#2D5016]/55 dark:text-[#FDF8F0]/50"> · {spec}</span>}
      </span>
      <span className="shrink-0 text-sm font-bold text-[#6B4226] dark:text-[#E8C8A0]">×{qty}</span>
    </button>
  );
}

function ReferencePages({
  pages,
  label,
}: {
  pages: { image: string; size: [number, number]; range?: string }[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="min-h-11 w-full rounded-full border border-[#9CAF88]/30 px-4 text-sm font-semibold text-[#2D5016]/75 transition-colors hover:bg-[#9CAF88]/10 dark:text-[#FDF8F0]/75"
      >
        {open ? "Hide" : "Show"} {label}
      </button>
      {open && (
        <div className="mt-4 space-y-4">
          {pages.map((p) => (
            <a key={p.image} href={p.image} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in">
              <div className="overflow-hidden rounded-xl border border-[#2D5016]/10 bg-white shadow-sm dark:border-[#9CAF88]/20">
                <Image
                  src={p.image}
                  alt={p.range ? `Manual page: ${p.range}` : "Manual reference page"}
                  width={p.size[0]}
                  height={p.size[1]}
                  sizes="(max-width: 768px) 92vw, 640px"
                  className="h-auto w-full"
                />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- main ---------- */

export default function CribGuide() {
  const [state, setState] = useState<SavedState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<TabId>("build");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const prevDoneCount = useRef<number | null>(null);

  const cribSteps = CRIB_SECTION.steps;
  const doneCount = cribSteps.filter((s) => state.steps[s.id]).length;
  const allDone = doneCount === cribSteps.length;

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedState>;
        setState({
          steps: parsed.steps ?? {},
          parts: parsed.parts ?? {},
          hardware: parsed.hardware ?? {},
        });
      }
    } catch {}
    setHydrated(true);
  }, []);

  // open the first incomplete step once hydrated
  useEffect(() => {
    if (!hydrated) return;
    setExpandedStep((cur) => {
      if (cur !== null) return cur;
      const firstOpen = cribSteps.find((s) => !state.steps[s.id]);
      return firstOpen ? firstOpen.id : null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  // confetti when the last crib step is completed; re-arm if the build stops being complete
  useEffect(() => {
    if (!hydrated) return;
    if (!allDone) {
      setCelebrate(false);
    } else if (prevDoneCount.current !== null && prevDoneCount.current < cribSteps.length) {
      setCelebrate(true);
    }
    prevDoneCount.current = doneCount;
  }, [doneCount, allDone, hydrated, cribSteps.length]);

  const toggleStep = useCallback(
    (id: string) => {
      setState((s) => {
        const next = { ...s, steps: { ...s.steps, [id]: !s.steps[id] } };
        return next;
      });
      // when marking a crib step done, advance to the next incomplete step
      if (!state.steps[id]) {
        const idx = cribSteps.findIndex((s) => s.id === id);
        if (idx >= 0) {
          const next = cribSteps.find((s, i) => i > idx && !state.steps[s.id] && s.id !== id);
          setExpandedStep(next ? next.id : null);
          if (next) {
            // let the DOM update, then scroll the next step into view
            setTimeout(() => {
              document.getElementById(next.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 120);
          }
        }
      }
    },
    [cribSteps, state.steps]
  );

  const toggleExpanded = useCallback((id: string) => {
    setExpandedStep((cur) => (cur === id ? null : id));
  }, []);

  const togglePart = useCallback((num: number) => {
    setState((s) => ({ ...s, parts: { ...s.parts, [num]: !s.parts[num] } }));
  }, []);

  const toggleHardware = useCallback((id: string) => {
    setState((s) => ({ ...s, hardware: { ...s.hardware, [id]: !s.hardware[id] } }));
  }, []);

  const resetAll = useCallback(() => {
    if (!window.confirm("Reset all progress — steps, parts, and hardware checklists?")) return;
    setState(EMPTY_STATE);
    setExpandedStep(cribSteps[0].id);
    setCelebrate(false);
    prevDoneCount.current = 0;
  }, [cribSteps]);

  const partCount = useMemo(() => PARTS.filter((p) => state.parts[p.num]).length, [state.parts]);
  const hwCount = useMemo(() => HARDWARE.filter((h) => state.hardware[h.id]).length, [state.hardware]);
  const progressPct = Math.round((doneCount / cribSteps.length) * 100);

  return (
    <div className="enchanted-bg relative min-h-screen">
      <ConfettiCelebration active={celebrate} />
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mb-2 text-3xl" aria-hidden>
            🍼
          </div>
          <div className="mb-2 text-sm font-medium tracking-widest text-[#6B8F5B] uppercase dark:text-[#C0D4A8]">
            For our littlest woodland arrival
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#2D5016] dark:text-[#FDF8F0] sm:text-5xl">
            The Crib Build
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#2D5016]/70 dark:text-[#FDF8F0]/70">
            {PRODUCT.name} <span className="whitespace-nowrap">(model {PRODUCT.model})</span> — every step, every bolt,
            with the manual&apos;s own diagrams. Progress saves on this device.
          </p>
        </motion.div>

        {/* progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="soft-card mb-6 p-4 sm:p-5">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
              {allDone ? "Crib complete! 🌙" : "Build progress"}
            </span>
            <span className="text-sm font-semibold text-[#6B4226] dark:text-[#E8C8A0]">
              {doneCount} of {cribSteps.length} steps
            </span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-[#9CAF88]/20 dark:bg-[#9CAF88]/15"
            role="progressbar"
            aria-valuenow={doneCount}
            aria-valuemin={0}
            aria-valuemax={cribSteps.length}
            aria-label="Crib assembly progress"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5C7A4A] to-[#D4A574] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {(doneCount > 0 || partCount > 0 || hwCount > 0) && (
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-xs text-[#2D5016]/55 dark:text-[#FDF8F0]/50">
                Parts {partCount}/{PARTS.length} · Hardware {hwCount}/{HARDWARE.length}
              </span>
              <button
                onClick={resetAll}
                className="min-h-11 rounded-full px-3 text-xs font-semibold text-[#7B2D26]/70 transition-colors hover:bg-[#C0392B]/8 hover:text-[#7B2D26] dark:text-[#F0C4BE]/70 dark:hover:text-[#F0C4BE]"
              >
                Reset progress
              </button>
            </div>
          )}
        </motion.div>

        {/* tabs */}
        <div className="mb-6 grid grid-cols-4 gap-1 rounded-full border border-[#9CAF88]/25 bg-[#FDF8F0]/70 p-1 backdrop-blur-sm dark:bg-[#162618]/70">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`min-h-11 rounded-full text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "bg-[#5C7A4A] text-[#FDF8F0] shadow-sm"
                  : "text-[#2D5016]/65 hover:bg-[#9CAF88]/12 dark:text-[#FDF8F0]/65"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ============ BUILD TAB ============ */}
        {tab === "build" && (
          <div className="space-y-4">
            {/* before you start */}
            <motion.div {...fadeUp} className="soft-card p-4 sm:p-5">
              <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
                Before you start
              </h2>
              <ul className="space-y-1.5 text-sm text-[#2D5016]/80 dark:text-[#FDF8F0]/75">
                <li className="flex gap-2">
                  <span aria-hidden>🧰</span>
                  <span>
                    You&apos;ll need: <b>Phillips screwdriver, flathead screwdriver, hammer</b>. The Allen keys (T) and
                    spanner (W) are in the box.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden>🚫</span>
                  <span>
                    <b>No power drills or drivers</b> — the manual is emphatic, and stripped inserts are forever.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden>🌿</span>
                  <span>
                    Unbox onto a blanket, use the <b>Parts</b> and <b>Hardware</b> tabs to check everything is there
                    before you begin, and keep the manual for future use.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden>🐢</span>
                  <span>
                    Rabbit/turtle icons in diagrams: <b>snug bolts loosely first</b>, square the frame, <b>then</b>{" "}
                    tighten fully.
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* crib steps */}
            {cribSteps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                done={!!state.steps[step.id]}
                expanded={expandedStep === step.id}
                onToggleDone={() => toggleStep(step.id)}
                onToggleExpanded={() => toggleExpanded(step.id)}
              />
            ))}

            {/* completion */}
            {allDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="soft-card border-[#D4A574]/40 p-6 text-center"
              >
                <div className="mb-2 text-4xl" aria-hidden>
                  🌙✨
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
                  The crib is built!
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-[#2D5016]/70 dark:text-[#FDF8F0]/70">
                  Mattress in (highest position for a newborn), one last wiggle-test of every rail, and the nursery is
                  ready for its tiny new resident. Sweet dreams ahead. 💛
                </p>
              </motion.div>
            )}

            {/* conversions for later */}
            <div className="pt-4">
              <div className="mb-3 text-center text-xs font-semibold tracking-widest text-[#2D5016]/50 uppercase dark:text-[#FDF8F0]/45">
                For later — it grows with them
              </div>
              <div className="space-y-4">
                {CONVERSION_SECTIONS.map((section) => (
                  <ConversionSection
                    key={section.id}
                    section={section}
                    done={state.steps}
                    expandedStep={expandedStep}
                    onToggleDone={toggleStep}
                    onToggleExpanded={toggleExpanded}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ PARTS TAB ============ */}
        {tab === "parts" && (
          <motion.div {...fadeUp} className="soft-card p-4 sm:p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
                Parts checklist
              </h2>
              <span className="text-sm font-semibold text-[#6B4226] dark:text-[#E8C8A0]">
                {partCount}/{PARTS.length}
              </span>
            </div>
            <p className="mb-3 text-sm text-[#2D5016]/65 dark:text-[#FDF8F0]/60">
              Check parts off as you unbox. Numbers match the circled labels in every diagram.
            </p>
            <div className="space-y-0.5">
              {PARTS.map((p) => (
                <ChecklistRow
                  key={p.num}
                  badge={<NumBadge num={p.num} />}
                  name={p.name}
                  qty={p.qty}
                  checked={!!state.parts[p.num]}
                  onToggle={() => togglePart(p.num)}
                />
              ))}
            </div>
            <ReferencePages pages={PARTS_PAGES} label="the manual's parts pages" />
          </motion.div>
        )}

        {/* ============ HARDWARE TAB ============ */}
        {tab === "hardware" && (
          <motion.div {...fadeUp} className="soft-card p-4 sm:p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
                Hardware checklist
              </h2>
              <span className="text-sm font-semibold text-[#6B4226] dark:text-[#E8C8A0]">
                {hwCount}/{HARDWARE.length}
              </span>
            </div>
            <p className="mb-3 text-sm text-[#2D5016]/65 dark:text-[#FDF8F0]/60">
              All threaded hardware is imperial. Letters match the callouts in the step diagrams.
            </p>
            <div className="space-y-0.5">
              {HARDWARE.map((h) => (
                <ChecklistRow
                  key={h.id}
                  badge={<LetterBadge letter={h.id} />}
                  name={h.name}
                  spec={h.spec}
                  qty={h.qty}
                  checked={!!state.hardware[h.id]}
                  onToggle={() => toggleHardware(h.id)}
                />
              ))}
            </div>
            <ReferencePages pages={[HARDWARE_PAGE]} label="the manual's hardware page" />
          </motion.div>
        )}

        {/* ============ SAFETY TAB ============ */}
        {tab === "safety" && (
          <div className="space-y-4">
            {SAFETY_GROUPS.map((group) => (
              <motion.div {...fadeUp} key={group.title} className="soft-card p-4 sm:p-5">
                <h2 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
                  <span aria-hidden>{group.icon}</span> {group.title}
                </h2>
                <ul className="space-y-2">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[#2D5016]/80 dark:text-[#FDF8F0]/75">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C0392B]/50" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
            <motion.div {...fadeUp} className="soft-card p-4 text-sm text-[#2D5016]/70 sm:p-5 dark:text-[#FDF8F0]/65">
              <b className="text-[#2D5016] dark:text-[#FDF8F0]">Need help or missing parts?</b> Storkcraft Customer
              Care: {PRODUCT.support.phone} · {PRODUCT.support.email} · {PRODUCT.support.web} ({PRODUCT.support.hours}).
              Register the product at storkcraft.com for safety alerts.
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
