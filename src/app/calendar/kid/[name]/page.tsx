"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useVisiblePoll } from "@/lib/use-visible-poll";
import type {
  CalendarEventWithMember,
  FamilyMember,
  TaskWithCompletion,
} from "@/lib/calendar/types";

type KidTheme = {
  name: "sapphire" | "emmett";
  displayName: string;
  greeting: string;
  pointsLabel: string;
  emptyTitle: string;
  emptySubtitle: string;
  bgClass: string;
  headingClass: string;
  pointsClass: string;
  cardClass: string;
  cardInnerClass: string;
  checkClass: string;
  accent: string;
  sparkleEmojis: string[];
  taskEmojis: string[];
  confettiColors: string[];
};

const SAPPHIRE_THEME: KidTheme = {
  name: "sapphire",
  displayName: "Sapphire",
  greeting: "Hi Sapphire!",
  pointsLabel: "sparkle points earned today",
  emptyTitle: "All done! 🎉",
  emptySubtitle: "You're a superstar ⭐",
  bgClass:
    "bg-gradient-to-br from-blush via-blush-light to-lavender-light dark:from-[#2a1a2e] dark:via-[#3a1f3d] dark:to-[#1f1430]",
  headingClass:
    "text-deep-plum dark:text-blush drop-shadow-[0_2px_12px_rgba(196,154,60,0.25)]",
  pointsClass:
    "text-soft-gold-dark dark:text-soft-gold drop-shadow-[0_1px_8px_rgba(196,154,60,0.35)]",
  cardClass:
    "bg-gradient-to-br from-white/90 via-blush-light/70 to-lavender-light/60 dark:from-[#3a2140]/90 dark:via-[#331a35]/80 dark:to-[#2a1530]/80 border-2 border-soft-gold/40 dark:border-soft-gold/30 shadow-[0_8px_30px_rgba(232,200,184,0.45)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
  cardInnerClass: "text-deep-plum dark:text-blush-light",
  checkClass:
    "bg-gradient-to-br from-soft-gold to-soft-gold-dark text-cream shadow-[0_6px_20px_rgba(196,154,60,0.5)]",
  accent: "#C49A3C",
  sparkleEmojis: ["✨", "⭐", "🌟", "💖", "🦄", "🍄", "🌸"],
  taskEmojis: ["🌸", "🦄", "✨", "⭐", "💫", "🍄", "🌈", "🌟"],
  confettiColors: [
    "#E8C8B8",
    "#B8A9C9",
    "#C49A3C",
    "#F0DDD2",
    "#CFC3DD",
    "#D4AE56",
    "#E8B4AF",
  ],
};

const EMMETT_THEME: KidTheme = {
  name: "emmett",
  displayName: "Emmett",
  greeting: "Hi Emmett!",
  pointsLabel: "points earned today",
  emptyTitle: "All done.",
  emptySubtitle: "Quest complete. ⚔️",
  bgClass:
    "bg-gradient-to-br from-forest via-forest-dark to-[#0a1f0c] dark:from-[#0a1f0c] dark:via-[#061205] dark:to-black",
  headingClass:
    "text-cream dark:text-cream drop-shadow-[0_2px_14px_rgba(92,122,74,0.5)]",
  pointsClass:
    "text-soft-gold dark:text-soft-gold-light drop-shadow-[0_1px_10px_rgba(196,154,60,0.5)]",
  cardClass:
    "bg-gradient-to-br from-forest-light/90 via-forest/90 to-deep-plum/60 dark:from-forest/90 dark:via-forest-dark/90 dark:to-deep-plum/70 border-2 border-sage/50 dark:border-sage/40 shadow-[0_8px_30px_rgba(0,0,0,0.45)]",
  cardInnerClass: "text-cream dark:text-cream-dark",
  checkClass:
    "bg-gradient-to-br from-sage to-sage-dark text-cream shadow-[0_6px_20px_rgba(92,122,74,0.55)] border border-soft-gold/50",
  accent: "#5C7A4A",
  sparkleEmojis: ["ᚦ", "ᚱ", "ᛉ", "⚔️", "🛡️", "🏹"],
  taskEmojis: ["⚔️", "🛡️", "🏹", "🔥", "🌲", "🗡️", "ᚦ", "ᚱ"],
  confettiColors: [
    "#5C7A4A",
    "#1D4420",
    "#C49A3C",
    "#4A1A2A",
    "#7A9966",
    "#A67E28",
  ],
};

function themeForName(raw: string): KidTheme | null {
  const slug = raw?.toLowerCase();
  if (slug === "sapphire") return SAPPHIRE_THEME;
  if (slug === "emmett") return EMMETT_THEME;
  return null;
}

function todayKey(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

function pickEmoji(seed: number, pool: string[]): string {
  const idx = Math.abs(Math.floor(seed)) % pool.length;
  return pool[idx] ?? pool[0];
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  shape: "circle" | "square" | "star";
  life: number;
}

function KidConfetti({
  colors,
  fireKey,
}: {
  colors: string[];
  fireKey: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const rafRef = useRef<number>(0);
  const nextIdRef = useRef<number>(0);

  useEffect(() => {
    if (fireKey === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn a burst
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.45;
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      const shapes: ConfettiPiece["shape"][] = [
        "circle",
        "square",
        "star",
        "star",
      ];
      piecesRef.current.push({
        id: nextIdRef.current++,
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        size: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        life: 1,
      });
    }

    const drawStar = (size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outer = size;
        const inner = size * 0.45;
        const a1 = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const a2 = a1 + Math.PI / 5;
        ctx.lineTo(Math.cos(a1) * outer, Math.sin(a1) * outer);
        ctx.lineTo(Math.cos(a2) * inner, Math.sin(a2) * inner);
      }
      ctx.closePath();
      ctx.fill();
    };

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      for (const p of piecesRef.current) {
        if (p.life <= 0) continue;
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.vx *= 0.995;
        p.rotation += p.rotationSpeed;
        p.life -= 0.008;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "square") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          drawStar(p.size * 0.7);
        }
        ctx.restore();
      }
      // Remove dead pieces occasionally
      if (piecesRef.current.length > 400) {
        piecesRef.current = piecesRef.current.filter((p) => p.life > 0);
      }
      if (alive > 0) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [fireKey, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  );
}

function AnimatedPoints({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display}</>;
}

function FloatingSparkles({ emojis }: { emojis: string[] }) {
  const items = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        emoji: emojis[i % emojis.length],
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        delay: (i % 7) * 0.4,
        duration: 6 + (i % 5),
        size: 18 + (i % 4) * 6,
      })),
    [emojis]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((s) => (
        <motion.span
          key={s.id}
          className="absolute select-none opacity-60"
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.size,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -18, 0],
            opacity: [0, 0.7, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {s.emoji}
        </motion.span>
      ))}
    </div>
  );
}

export default function KidPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const theme = useMemo(() => themeForName(name), [name]);

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([]);
  const [events, setEvents] = useState<CalendarEventWithMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointsToday, setPointsToday] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const [completingIds, setCompletingIds] = useState<Set<number>>(new Set());
  const [completingEventIds, setCompletingEventIds] = useState<Set<number>>(
    new Set()
  );

  const today = useMemo(todayKey, []);

  const fetchData = useCallback(async () => {
    try {
      const [memRes, tasksRes, eventsRes] = await Promise.all([
        fetch("/api/calendar/members", { cache: "no-store" }),
        fetch(`/api/calendar/tasks?start=${today}&end=${today}`, {
          cache: "no-store",
        }),
        fetch(`/api/calendar/events?start=${today}&end=${today}`, {
          cache: "no-store",
        }),
      ]);
      const memList: FamilyMember[] = memRes.ok ? await memRes.json() : [];
      const taskList: TaskWithCompletion[] = tasksRes.ok
        ? await tasksRes.json()
        : [];
      const eventList: CalendarEventWithMember[] = eventsRes.ok
        ? await eventsRes.json()
        : [];
      setMembers(memList);
      const matched =
        memList.find(
          (m) => m.name.toLowerCase() === name.toLowerCase()
        ) ?? null;
      setMember(matched);

      if (matched) {
        const mine = taskList.filter((t) => t.assigned_to === matched.id);
        const doneToday = mine.filter(
          (t) => t.completion_id && t.completed_date
        );
        const pending = mine.filter((t) => !t.completion_id);
        setTasks(pending);

        // Events for this kid: assigned to them OR unassigned (everyone).
        const myEvents = eventList.filter(
          (e) => e.assigned_to == null || e.assigned_to === matched.id
        );
        const attendedEvents = myEvents.filter((e) =>
          e.completions.some((c) => c.completed_by === matched.id)
        );
        const pendingEvents = myEvents.filter(
          (e) => e.points > 0 && !attendedEvents.includes(e)
        );
        setEvents(pendingEvents);

        const eventPoints = attendedEvents.reduce((sum, e) => {
          const mine = e.completions.find((c) => c.completed_by === matched.id);
          return sum + (mine?.points_earned ?? 0);
        }, 0);
        const taskPoints = doneToday.reduce(
          (sum, t) => sum + (t.points ?? 0),
          0
        );
        setPointsToday(taskPoints + eventPoints);
      } else {
        setTasks([]);
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  }, [name, today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Keep the kid page in sync with admin changes. useVisiblePoll handles the
  // visible/hidden transitions; we keep a window focus listener so switching
  // apps (not just tabs) also refetches.
  useVisiblePoll(fetchData);
  useEffect(() => {
    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchData]);

  const handleComplete = useCallback(
    async (task: TaskWithCompletion) => {
      if (!member || !task.due_date) return;
      if (completingIds.has(task.id)) return;
      setCompletingIds((prev) => new Set(prev).add(task.id));

      // Optimistic update: fire confetti + add points, then remove card after anim
      setConfettiKey((k) => k + 1);
      setPointsToday((p) => p + (task.points ?? 0));

      try {
        await fetch("/api/calendar/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task_id: task.id,
            completed_by: member.id,
            date: task.due_date,
            points_earned: task.points ?? 0,
          }),
        });
      } catch {
        // Silently fail — keep optimistic state; user can refresh.
      }

      // Give the slide-out animation time before removing from list
      setTimeout(() => {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        setCompletingIds((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });
      }, 550);
    },
    [member, completingIds]
  );

  const handleCompleteEvent = useCallback(
    async (event: CalendarEventWithMember) => {
      if (!member) return;
      if (completingEventIds.has(event.id)) return;
      setCompletingEventIds((prev) => new Set(prev).add(event.id));

      setConfettiKey((k) => k + 1);
      setPointsToday((p) => p + (event.points ?? 0));

      try {
        await fetch("/api/calendar/events/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id: event.id,
            completed_by: member.id,
            date: today,
            points_earned: event.points ?? 0,
          }),
        });
      } catch {
        // Keep optimistic state.
      }

      setTimeout(() => {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
        setCompletingEventIds((prev) => {
          const next = new Set(prev);
          next.delete(event.id);
          return next;
        });
      }, 550);
    },
    [member, completingEventIds, today]
  );

  // Not-found state
  if (!theme) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cream to-blush-light px-6 text-center dark:from-[#0a1f0c] dark:to-[#1a1020]">
        <div className="text-7xl">🧭</div>
        <h1 className="mt-6 font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold text-forest dark:text-cream">
          Hmm, we can&rsquo;t find that adventurer.
        </h1>
        <p className="mt-3 text-lg text-forest/70 dark:text-cream/70">
          Try{" "}
          <Link
            href="/calendar/kid/emmett"
            className="underline decoration-soft-gold underline-offset-4 hover:text-soft-gold-dark"
          >
            Emmett
          </Link>{" "}
          or{" "}
          <Link
            href="/calendar/kid/sapphire"
            className="underline decoration-soft-gold underline-offset-4 hover:text-soft-gold-dark"
          >
            Sapphire
          </Link>
          .
        </p>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${theme.bgClass}`}
      >
        <div
          className="h-16 w-16 animate-spin rounded-full border-4 border-current border-t-transparent"
          style={{ color: theme.accent }}
        />
      </div>
    );
  }

  // Member exists in URL but not seeded in DB
  if (!member) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center px-6 text-center ${theme.bgClass}`}
      >
        <div className="text-7xl">🌱</div>
        <h1 className={`mt-6 text-4xl font-bold ${theme.headingClass}`}>
          Almost there!
        </h1>
        <p className="mt-3 text-lg opacity-80">
          {theme.displayName} isn&rsquo;t set up yet. Ask Matt to seed the
          family.
        </p>
      </div>
    );
  }

  const isEmpty = tasks.length === 0 && events.length === 0;

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${theme.bgClass} px-5 pb-24 pt-10 sm:px-8`}
    >
      <FloatingSparkles emojis={theme.sparkleEmojis} />
      <KidConfetti colors={theme.confettiColors} fireKey={confettiKey} />

      <div className="relative mx-auto max-w-2xl">
        {/* Greeting */}
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`font-[family-name:var(--font-cormorant-garamond)] text-5xl font-bold sm:text-6xl ${theme.headingClass}`}
          >
            <span className="mr-3 text-4xl sm:text-5xl">
              {member.avatar_emoji}
            </span>
            {theme.greeting}
          </motion.h1>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`mt-6 ${theme.pointsClass}`}
          >
            <div className="font-[family-name:var(--font-cormorant-garamond)] text-6xl font-bold sm:text-7xl">
              ⭐ <AnimatedPoints value={pointsToday} />
            </div>
            <div className="mt-1 text-base font-medium uppercase tracking-wider opacity-80 sm:text-lg">
              {theme.pointsLabel}
            </div>
          </motion.div>
        </div>

        {/* Empty state */}
        {isEmpty ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className={`mx-auto mt-10 max-w-md rounded-3xl p-10 text-center ${theme.cardClass}`}
          >
            <div className="text-7xl sm:text-8xl">
              {theme.name === "sapphire" ? "🦄" : "⚔️"}
            </div>
            <h2
              className={`mt-4 font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold sm:text-5xl ${theme.cardInnerClass}`}
            >
              {theme.emptyTitle}
            </h2>
            <p className={`mt-2 text-lg sm:text-xl ${theme.cardInnerClass} opacity-80`}>
              {theme.emptySubtitle}
            </p>
          </motion.div>
        ) : (
          <ul className="space-y-5">
            <AnimatePresence mode="popLayout">
              {events.map((event) => {
                const emoji = pickEmoji(event.id + event.title.length, theme.taskEmojis);
                const completing = completingEventIds.has(event.id);
                const timeStr = event.all_day
                  ? null
                  : new Date(event.start_at).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                return (
                  <motion.li
                    key={`ev-${event.id}`}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{
                      opacity: completing ? 0 : 1,
                      y: 0,
                      scale: completing ? 1.05 : 1,
                      x: completing ? 600 : 0,
                      rotate: completing ? 8 : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.6,
                      transition: { duration: 0.3 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleCompleteEvent(event)}
                      disabled={completing}
                      className={`group relative flex w-full min-h-[120px] items-center gap-5 rounded-3xl p-6 text-left transition-transform active:scale-[0.98] ${theme.cardClass} disabled:cursor-default`}
                    >
                      <div className="flex-shrink-0 text-6xl drop-shadow-md sm:text-7xl">
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-70">
                          <span>📅 Event</span>
                          {timeStr && <span>· {timeStr}</span>}
                        </div>
                        <div
                          className={`font-[family-name:var(--font-cormorant-garamond)] text-3xl font-bold leading-tight sm:text-5xl ${theme.cardInnerClass}`}
                          style={{ wordBreak: "break-word" }}
                        >
                          {event.title}
                        </div>
                        {event.points > 0 && (
                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-soft-gold/30 px-3 py-1 text-lg font-semibold text-soft-gold-dark sm:text-xl dark:bg-soft-gold/25 dark:text-soft-gold-light">
                            <span>⭐</span>
                            <span>
                              {event.points} {event.points === 1 ? "point" : "points"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full text-5xl font-bold transition-transform group-hover:scale-105 group-active:scale-95 sm:h-28 sm:w-28 sm:text-6xl ${theme.checkClass}`}
                        aria-hidden
                      >
                        ✓
                      </div>
                      <span className="sr-only">I went to {event.title}</span>
                    </button>
                  </motion.li>
                );
              })}
              {tasks.map((task) => {
                const emoji = pickEmoji(task.id + task.title.length, theme.taskEmojis);
                const points = task.points ?? 0;
                const completing = completingIds.has(task.id);
                return (
                  <motion.li
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{
                      opacity: completing ? 0 : 1,
                      y: 0,
                      scale: completing ? 1.05 : 1,
                      x: completing ? 600 : 0,
                      rotate: completing ? 8 : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.6,
                      transition: { duration: 0.3 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleComplete(task)}
                      disabled={completing}
                      className={`group relative flex w-full min-h-[120px] items-center gap-5 rounded-3xl p-6 text-left transition-transform active:scale-[0.98] ${theme.cardClass} disabled:cursor-default`}
                    >
                      {/* Big emoji */}
                      <div className="flex-shrink-0 text-6xl drop-shadow-md sm:text-7xl">
                        {emoji}
                      </div>

                      {/* Title + points */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-[family-name:var(--font-cormorant-garamond)] text-3xl font-bold leading-tight sm:text-5xl ${theme.cardInnerClass}`}
                          style={{ wordBreak: "break-word" }}
                        >
                          {task.title}
                        </div>
                        {points > 0 && (
                          <div
                            className={`mt-2 inline-flex items-center gap-1.5 rounded-full bg-soft-gold/30 px-3 py-1 text-lg font-semibold text-soft-gold-dark sm:text-xl dark:bg-soft-gold/25 dark:text-soft-gold-light`}
                          >
                            <span>⭐</span>
                            <span>
                              {points} {points === 1 ? "point" : "points"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Giant tap circle */}
                      <div
                        className={`flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full text-5xl font-bold transition-transform group-hover:scale-105 group-active:scale-95 sm:h-28 sm:w-28 sm:text-6xl ${theme.checkClass}`}
                        aria-hidden
                      >
                        ✓
                      </div>

                      <span className="sr-only">
                        Mark &quot;{task.title}&quot; done
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}

        {/* Tiny back-to-calendar link, understated so kids don't get distracted */}
        <div className="mt-16 text-center">
          <Link
            href="/calendar"
            className={`inline-block text-sm font-medium opacity-50 transition-opacity hover:opacity-90 ${theme.cardInnerClass}`}
          >
            ← back
          </Link>
          {/* Swap kid link, if other kid exists */}
          {members.some(
            (m) =>
              m.role === "kid" &&
              m.name.toLowerCase() !== theme.name
          ) && (
            <span className="ml-4 text-sm opacity-50">·</span>
          )}
          {members
            .filter(
              (m) =>
                m.role === "kid" &&
                m.name.toLowerCase() !== theme.name
            )
            .map((m) => (
              <Link
                key={m.id}
                href={`/calendar/kid/${m.name.toLowerCase()}`}
                className={`ml-4 inline-block text-sm font-medium opacity-50 transition-opacity hover:opacity-90 ${theme.cardInnerClass}`}
              >
                {m.avatar_emoji} {m.name}&rsquo;s chores
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
