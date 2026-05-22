"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ConfettiCelebration from "@/components/ConfettiCelebration";
import { useTheme } from "@/components/ThemeProvider";

const PARTY_DATE = new Date("2026-06-20T11:00:00-04:00");
const RSVP_COOKIE = "sapphire_rsvp_id";

interface BdayRsvp {
  id: number;
  parent_name: string;
  child_names: string;
  email: string | null;
  phone: string | null;
  attending: boolean;
  kid_count: number;
  adult_count: number;
  allergies: string;
  birthday_wish: string;
  created_at: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge = 31536000) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge}`;
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function seededRange(seed: number, min: number, max: number) {
  return min + seededUnit(seed) * (max - min);
}

/* ============================================================
   AMBIENT BACKGROUND - leafy canopy + drifting petals
   ============================================================ */

function ForestCanopy() {
  const [mounted, setMounted] = useState(false);
  const lights = useMemo(() =>
    Array.from({ length: 42 }, (_, i) => ({
      id: i,
      x: seededRange(i + 1, 0, 100),
      y: seededRange(i + 101, 0, 100),
      size: seededRange(i + 201, 2, 5),
      delay: seededRange(i + 301, 0, 4),
      duration: seededRange(i + 401, 4, 8),
    })),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(106,142,83,0.85)_0%,_rgba(48,91,52,0.55)_35%,_rgba(36,74,43,0)_75%)]" />
      <div className="absolute -top-24 left-[-10%] h-72 w-[65%] rounded-full bg-[#274F2D]/70 blur-3xl" />
      <div className="absolute -top-20 right-[-12%] h-80 w-[70%] rounded-full bg-[#456B38]/60 blur-3xl" />
      {lights.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-[#FFF2B8]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            boxShadow: "0 0 12px rgba(255,242,184,0.65)",
          }}
          animate={{ opacity: [0.12, 0.6, 0.12] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function DriftingPetals({ count = 20 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const [travel, setTravel] = useState(900);

  useEffect(() => {
    const update = () => setTravel(window.innerHeight + 60);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const petals = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRange(i + 501, 0, 100),
      delay: seededRange(i + 601, 0, 12),
      duration: seededRange(i + 701, 16, 28),
      size: seededRange(i + 801, 8, 20),
      drift: seededRange(i + 901, -24, 24),
      color: ["#F4B8C4", "#F7D77A", "#DDE7B0", "#FFFFFF"][Math.floor(seededRange(i + 1001, 0, 4))],
    })),
    [count]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, bottom: -30 }}
          animate={{
            y: [0, -travel],
            x: [0, s.drift, -s.drift, 0],
            rotate: [0, 80, 160, 240],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        >
          <PetalShape size={s.size} color={s.color} />
        </motion.div>
      ))}
    </div>
  );
}

function PetalShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 1.45} viewBox="0 0 24 34" fill="none">
      <path
        d="M12 2 C20 8 21 20 12 32 C3 20 4 8 12 2 Z"
        fill={color}
        opacity="0.82"
      />
      <path d="M12 5 C10 13 10 22 12 30" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1" />
    </svg>
  );
}

/* ============================================================
   BUTTERFLIES - floating across the page
   ============================================================ */

function Butterfly({ color, path, delay, duration, scale = 1 }: {
  color: string;
  path: { x: number[]; y: number[]; rotate: number[] };
  delay: number;
  duration: number;
  scale?: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      initial={{ x: path.x[0], y: path.y[0], rotate: path.rotate[0], opacity: 0 }}
      animate={{
        x: path.x,
        y: path.y,
        rotate: path.rotate,
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ scale }}
    >
      <ButterflySvg color={color} />
    </motion.div>
  );
}

function ButterflySvg({ color }: { color: string }) {
  return (
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
      <motion.g
        animate={{ scaleX: [1, 0.6, 1] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "24px 20px" }}
      >
        {/* Wings */}
        <ellipse cx="14" cy="14" rx="11" ry="9" fill={color} opacity="0.85" />
        <ellipse cx="34" cy="14" rx="11" ry="9" fill={color} opacity="0.85" />
        <ellipse cx="15" cy="28" rx="8" ry="7" fill={color} opacity="0.7" />
        <ellipse cx="33" cy="28" rx="8" ry="7" fill={color} opacity="0.7" />
        {/* Wing dots */}
        <circle cx="14" cy="14" r="2.5" fill="#fff" opacity="0.7" />
        <circle cx="34" cy="14" r="2.5" fill="#fff" opacity="0.7" />
      </motion.g>
      {/* Body */}
      <rect x="23" y="8" width="2" height="22" rx="1" fill="#1B1B3A" />
      <circle cx="24" cy="8" r="2" fill="#1B1B3A" />
      {/* Antennae */}
      <path d="M24 8 Q20 2 18 4" stroke="#1B1B3A" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M24 8 Q28 2 30 4" stroke="#1B1B3A" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ButterflyFlock() {
  const butterflies = useMemo(() => [
    {
      color: "#F0B6E0",
      delay: 0,
      duration: 26,
      scale: 1,
      path: {
        x: [-60, 200, 400, 600, 900],
        y: [180, 100, 220, 80, 260],
        rotate: [0, -8, 6, -10, 0],
      },
    },
    {
      color: "#A6C8FF",
      delay: 6,
      duration: 32,
      scale: 0.8,
      path: {
        x: [900, 700, 400, 200, -60],
        y: [60, 220, 120, 280, 140],
        rotate: [180, 195, 170, 200, 180],
      },
    },
    {
      color: "#F7D77A",
      delay: 12,
      duration: 28,
      scale: 0.9,
      path: {
        x: [-60, 250, 480, 720, 900],
        y: [380, 280, 420, 240, 360],
        rotate: [0, -6, 4, -8, 0],
      },
    },
  ], []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {butterflies.map((b, i) => (
        <Butterfly key={i} {...b} />
      ))}
    </div>
  );
}

/* ============================================================
   FAIRY WINGS - woodland centerpiece
   ============================================================ */

function FairyWings({ size = 140 }: { size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -7, 0], rotate: [-1.5, 1.5, -1.5] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size }}
      className="relative"
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <defs>
          <linearGradient id="wingBlush" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="45%" stopColor="#F4B8C4" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#DDE7B0" stopOpacity="0.74" />
          </linearGradient>
          <linearGradient id="wingSage" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF7D0" stopOpacity="0.86" />
            <stop offset="100%" stopColor="#8FB56A" stopOpacity="0.72" />
          </linearGradient>
          <radialGradient id="fairyGlow" cx="0.5" cy="0.5" r="0.62">
            <stop offset="0%" stopColor="#FFF7D0" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#244A2B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="62" rx="54" ry="48" fill="url(#fairyGlow)" />
        <path
          d="M57 58 C36 26 13 20 14 45 C15 70 38 82 57 65 Z"
          fill="url(#wingBlush)"
          stroke="#FFF7D0"
          strokeWidth="1.5"
        />
        <path
          d="M63 58 C84 26 107 20 106 45 C105 70 82 82 63 65 Z"
          fill="url(#wingBlush)"
          stroke="#FFF7D0"
          strokeWidth="1.5"
        />
        <path
          d="M54 65 C34 77 25 100 48 100 C61 100 64 82 59 68 Z"
          fill="url(#wingSage)"
          stroke="#FFF7D0"
          strokeWidth="1.4"
        />
        <path
          d="M66 65 C86 77 95 100 72 100 C59 100 56 82 61 68 Z"
          fill="url(#wingSage)"
          stroke="#FFF7D0"
          strokeWidth="1.4"
        />
        <ellipse cx="60" cy="64" rx="4" ry="16" fill="#FFF7D0" opacity="0.88" />
        <circle cx="60" cy="45" r="5" fill="#FFF7D0" opacity="0.9" />
        <path d="M45 42 C50 53 53 61 56 70" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
        <path d="M75 42 C70 53 67 61 64 70" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
        <path d="M43 83 C51 80 56 75 59 68" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
        <path d="M77 83 C69 80 64 75 61 68" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
        <motion.circle
          cx="35"
          cy="38"
          r="2.5"
          fill="#fff"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.circle
          cx="88"
          cy="58"
          r="2"
          fill="#fff"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
        />
      </svg>
    </motion.div>
  );
}

/* ============================================================
   COUNTDOWN TO PARTY
   ============================================================ */

function PartyCountdown() {
  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const diff = PARTY_DATE.getTime() - Date.now();
      if (diff <= 0) {
        setParts({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setParts({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  if (!mounted) {
    return <div className="h-24" />;
  }

  const units: Array<[string, number]> = [
    ["days", parts.days],
    ["hours", parts.hours],
    ["min", parts.minutes],
    ["sec", parts.seconds],
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {units.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-2xl border border-purple-300/40 bg-white/70 px-2 py-3 shadow-sm backdrop-blur-md sm:px-4 sm:py-4 dark:border-sky-300/30 dark:bg-white/10 dark:shadow-none"
        >
          <span className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-bold text-purple-900 sm:text-5xl dark:text-white">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-semibold tracking-widest text-purple-700/80 uppercase sm:text-xs dark:text-sky-100/80">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   INTERACTIVE BIRTHDAY CAKE - 9 candles to blow out
   ============================================================ */

function BirthdayCake({ onAllBlown }: { onAllBlown: () => void }) {
  const [blownCandles, setBlownCandles] = useState<Set<number>>(new Set());
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const total = 9;
  const remaining = total - blownCandles.size;

  const blow = (idx: number) => {
    if (blownCandles.has(idx)) return;
    setBlownCandles((prev) => {
      const next = new Set(prev);
      next.add(idx);
      if (next.size === total && !hasCelebrated) {
        setHasCelebrated(true);
        setTimeout(() => onAllBlown(), 200);
      }
      return next;
    });
  };

  const reset = () => {
    setBlownCandles(new Set());
    setHasCelebrated(false);
  };

  return (
    <div className="rounded-3xl border border-pink-300/50 bg-white/70 p-5 shadow-sm backdrop-blur-md sm:p-7 dark:border-pink-200/30 dark:bg-white/10 dark:shadow-none">
      <div className="text-center">
        <p className="mb-1 text-xs font-semibold tracking-[0.25em] text-pink-600 uppercase sm:text-sm dark:text-pink-100/80">
          Make a Wish
        </p>
        <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold text-purple-900 sm:text-3xl dark:text-white">
          {remaining > 0
            ? `Tap to blow out ${remaining} ${remaining === 1 ? "candle" : "candles"}`
            : "You did it!"}
        </h3>
      </div>

      {/* Candles */}
      <div className="mt-6 flex h-32 items-end justify-center gap-1.5 sm:h-36 sm:gap-2.5">
        {Array.from({ length: total }, (_, i) => {
          const blown = blownCandles.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => blow(i)}
              aria-label={`Blow out candle ${i + 1}`}
              className="group relative flex h-full flex-col items-center justify-end focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md px-1"
              style={{ minWidth: 28 }}
            >
              {/* Flame */}
              <AnimatePresence>
                {!blown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [0, -1, 0, 1, 0],
                    }}
                    exit={{ opacity: 0, scale: 2, y: -20 }}
                    transition={{
                      scale: { duration: 0.3 },
                      y: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="mb-0.5"
                  >
                    <svg width="14" height="20" viewBox="0 0 14 20">
                      <defs>
                        <radialGradient id={`flame-${i}`} cx="0.5" cy="0.7" r="0.6">
                          <stop offset="0%" stopColor="#FFF4B5" />
                          <stop offset="50%" stopColor="#FFB347" />
                          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.6" />
                        </radialGradient>
                      </defs>
                      <path
                        d="M7 2 C 11 6, 12 12, 7 18 C 2 12, 3 6, 7 2 Z"
                        fill={`url(#flame-${i})`}
                      />
                      <ellipse cx="7" cy="14" rx="2" ry="3" fill="#FFF4B5" opacity="0.8" />
                    </svg>
                  </motion.div>
                )}
                {blown && (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -30 }}
                    transition={{ duration: 1.2 }}
                    className="absolute bottom-20 text-xl"
                  >
                    💨
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Wick */}
              <div className="mb-0.5 h-1 w-[1.5px] bg-yellow-900" />

              {/* Candle body */}
              <div
                className="relative w-3 sm:w-3.5"
                style={{
                  height: `${50 + (i % 3) * 10}px`,
                  background:
                    "linear-gradient(to right, #FF92BC 0%, #FFC8DD 35%, #FF92BC 100%)",
                  borderRadius: "2px",
                  boxShadow: "0 2px 6px rgba(255, 100, 160, 0.4)",
                }}
              >
                {/* Candle stripes */}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 6px)",
                    borderRadius: "2px",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Cake */}
      <div className="relative mx-auto mt-2 w-full max-w-[280px]">
        {/* Top tier */}
        <div
          className="relative mx-auto h-10 w-3/4 rounded-t-lg"
          style={{
            background: "linear-gradient(to bottom, #FFE5F1 0%, #FFC8DD 100%)",
            boxShadow: "inset 0 -4px 8px rgba(255, 100, 160, 0.25)",
          }}
        >
          {/* Drips */}
          <div className="absolute -bottom-1 left-0 right-0 h-3">
            <svg viewBox="0 0 280 12" className="h-full w-full" preserveAspectRatio="none">
              <path
                d="M0,0 Q10,12 20,4 Q40,12 60,3 Q80,11 100,5 Q120,12 140,2 Q160,11 180,5 Q200,12 220,3 Q240,11 260,4 Q270,12 280,2 L280,0 Z"
                fill="#FFC8DD"
              />
            </svg>
          </div>
        </div>
        {/* Bottom tier */}
        <div
          className="relative mx-auto -mt-1 h-14 w-full rounded-lg border-2 border-pink-300/40"
          style={{
            background:
              "linear-gradient(to bottom, #F0B6E0 0%, #C49AD7 50%, #9B7BC7 100%)",
            boxShadow: "0 6px 20px rgba(155, 123, 199, 0.4)",
          }}
        >
          {/* Sprinkles/decoration */}
          <div className="absolute inset-0 flex items-center justify-around px-3">
            {Array.from({ length: 6 }, (_, j) => (
              <div
                key={j}
                className="h-2 w-2 rounded-full"
                style={{
                  background: ["#F7D77A", "#A6C8FF", "#FFFFFF", "#F0B6E0", "#F7D77A", "#A6C8FF"][j],
                  boxShadow: "0 0 4px rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        </div>
        {/* Cake plate */}
        <div className="mx-auto -mt-1 h-2 w-[105%] rounded-full bg-gradient-to-b from-yellow-200/80 to-yellow-400/60 shadow-lg" />
      </div>

      {hasCelebrated && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={reset}
          className="mt-4 mx-auto block text-xs text-purple-600 underline underline-offset-2 hover:text-purple-800 dark:text-pink-100/70 dark:hover:text-pink-100"
        >
          relight the candles
        </motion.button>
      )}
    </div>
  );
}

/* ============================================================
   TAP-TO-SPAWN PETALS (background-wide interactivity)
   ============================================================ */

interface TapPetal {
  id: number;
  x: number;
  y: number;
  color: string;
}

function TapPetalLayer({ petals }: { petals: TapPetal[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <AnimatePresence>
        {petals.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0, x: s.x - 14, y: s.y - 14 }}
            animate={{
              opacity: 0,
              scale: 2.4,
              y: s.y - 60,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute"
          >
            <PetalShape size={24} color={s.color} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   RSVP FORM
   ============================================================ */

function RsvpCard({
  initialData,
  onSuccess,
}: {
  initialData?: BdayRsvp | null;
  onSuccess: (data: BdayRsvp) => void;
}) {
  const isEditing = !!initialData;
  const [parentName, setParentName] = useState(initialData?.parent_name ?? "");
  const [childNames, setChildNames] = useState(initialData?.child_names ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [attending, setAttending] = useState(initialData?.attending ?? true);
  const [kidCount, setKidCount] = useState(initialData?.kid_count ?? 1);
  const [adultCount, setAdultCount] = useState(initialData?.adult_count ?? 1);
  const [allergies, setAllergies] = useState(initialData?.allergies ?? "");
  const [birthdayWish, setBirthdayWish] = useState(initialData?.birthday_wish ?? "");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) {
      setError("Please share the grown-up's name!");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setError("Please add a phone number or email so we can reach you.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...(isEditing && initialData ? { id: initialData.id } : {}),
        parent_name: parentName.trim(),
        child_names: childNames.trim(),
        email: email.trim(),
        phone: phone.trim(),
        attending,
        kid_count: attending ? kidCount : 0,
        adult_count: attending ? adultCount : 0,
        allergies: allergies.trim(),
        birthday_wish: birthdayWish.trim(),
        ...(honeypot ? { website: honeypot } : {}),
      };
      const res = await fetch("/api/birthday-rsvp", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      onSuccess(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Try again!");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-pink-200/30 bg-white/95 p-5 shadow-[0_20px_60px_rgba(27,42,92,0.4)] sm:p-7"
    >
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.25em] text-purple-700/70 uppercase">
          RSVP
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-purple-900 sm:text-4xl">
          {isEditing ? "Update your RSVP" : "Will you join the forest party?"}
        </h2>
      </div>

      {/* Attending toggle - giant buttons */}
      <div>
        <label className="mb-2 block text-sm font-medium text-purple-900">Will you be there?</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className={`rounded-2xl border-2 px-3 py-4 text-base font-semibold transition-all ${
              attending
                ? "border-rose-500 bg-rose-500 text-white shadow-md"
                : "border-pink-200 bg-white text-purple-900 hover:border-pink-300"
            }`}
          >
            <span className="mr-1.5">🎉</span> Yes, can&apos;t wait!
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className={`rounded-2xl border-2 px-3 py-4 text-base font-semibold transition-all ${
              !attending
                ? "border-slate-400 bg-slate-400 text-white shadow-md"
                : "border-pink-200 bg-white text-purple-900 hover:border-pink-300"
            }`}
          >
            <span className="mr-1.5">💔</span> Can&apos;t make it
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="bday-parent" className="mb-1.5 block text-sm font-medium text-purple-900">
          Your name <span className="text-pink-500">*</span>
        </label>
        <input
          id="bday-parent"
          type="text"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          placeholder="Grown-up's name"
          className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-base text-purple-900 placeholder-purple-400/50 focus:border-pink-400 focus:outline-none"
          required
        />
      </div>

      <AnimatePresence>
        {attending && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="space-y-5 overflow-hidden"
          >
            <div>
              <label htmlFor="bday-kids" className="mb-1.5 block text-sm font-medium text-purple-900">
                Kid&apos;s name(s) coming
              </label>
              <input
                id="bday-kids"
                type="text"
                value={childNames}
                onChange={(e) => setChildNames(e.target.value)}
                placeholder="e.g. Lily & Max"
                className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-base text-purple-900 placeholder-purple-400/50 focus:border-pink-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <NumberStepper
                label="Kids"
                emoji="👧"
                value={kidCount}
                onChange={setKidCount}
                min={0}
                max={15}
              />
              <NumberStepper
                label="Grown-ups"
                emoji="🧑"
                value={adultCount}
                onChange={setAdultCount}
                min={0}
                max={10}
              />
            </div>

            <div>
              <label htmlFor="bday-allergies" className="mb-1.5 block text-sm font-medium text-purple-900">
                Allergies or food notes
              </label>
              <input
                id="bday-allergies"
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="So we can plan the pizza! (optional)"
                className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-base text-purple-900 placeholder-purple-400/50 focus:border-pink-400 focus:outline-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bday-phone" className="mb-1.5 block text-sm font-medium text-purple-900">
            Phone
          </label>
          <input
            id="bday-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-base text-purple-900 placeholder-purple-400/50 focus:border-pink-400 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="bday-email" className="mb-1.5 block text-sm font-medium text-purple-900">
            Email
          </label>
          <input
            id="bday-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-base text-purple-900 placeholder-purple-400/50 focus:border-pink-400 focus:outline-none"
          />
        </div>
      </div>
      <p className="-mt-2 text-xs text-purple-700/70">
        We just need one (phone or email) so we can send updates.
      </p>

      <div>
        <label htmlFor="bday-wish" className="mb-1.5 block text-sm font-medium text-purple-900">
          A birthday wish for Sapphire
        </label>
        <textarea
          id="bday-wish"
          value={birthdayWish}
          onChange={(e) => setBirthdayWish(e.target.value)}
          placeholder="Send Sapphire a sweet birthday wish..."
          rows={3}
          className="w-full resize-y rounded-xl border-2 border-pink-200 bg-white px-4 py-3 text-base text-purple-900 placeholder-purple-400/50 focus:border-pink-400 focus:outline-none"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-pink-300 bg-pink-50 p-3"
          >
            <p className="text-sm font-medium text-pink-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={submitting}
        className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#2A4480] to-[#1B2A5C] px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:from-[#3B5FBA] hover:to-[#2A4480] hover:shadow-lg active:scale-[0.98] sm:text-lg ${
          submitting ? "cursor-wait opacity-70" : ""
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {submitting ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <span>🌸</span>
              {isEditing ? "Update RSVP" : "Send my RSVP"}
              <span>🌸</span>
            </>
          )}
        </span>
      </button>
    </form>
  );
}

function NumberStepper({
  label,
  emoji,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  emoji: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="rounded-xl border-2 border-pink-200 bg-white p-3">
      <p className="mb-2 text-center text-xs font-semibold tracking-wide text-purple-700 uppercase">
        {emoji} {label}
      </p>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-xl font-bold text-pink-600 transition-all hover:bg-pink-200 disabled:opacity-30 active:scale-95"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="font-[family-name:var(--font-cormorant-garamond)] text-3xl font-bold text-purple-900 tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-xl font-bold text-pink-600 transition-all hover:bg-pink-200 disabled:opacity-30 active:scale-95"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   WHO'S COMING
   ============================================================ */

interface SummaryData {
  guests: { name: string; kids: number }[];
  totalKids: number;
  totalAdults: number;
  totalRsvps: number;
}

function WhosComing() {
  const [data, setData] = useState<SummaryData | null>(null);

  useEffect(() => {
    fetch("/api/birthday-rsvp?summary=1")
      .then((r) => r.ok ? r.json() : null)
      .then((json) => setData(json))
      .catch(() => setData({ guests: [], totalKids: 0, totalAdults: 0, totalRsvps: 0 }));
  }, []);

  if (!data || data.totalRsvps === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-amber-400/40 bg-white/60 p-5 shadow-sm backdrop-blur-md sm:p-7 dark:border-yellow-200/30 dark:bg-white/10 dark:shadow-none"
    >
      <p className="text-center text-xs font-semibold tracking-[0.25em] text-amber-700 uppercase dark:text-yellow-100/80">
        The Guest List
      </p>
      <h3 className="mt-1 text-center font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold text-purple-900 sm:text-3xl dark:text-white">
        {data.totalKids} {data.totalKids === 1 ? "kid" : "kids"} coming so far
        {data.totalAdults > 0 && ` (+ ${data.totalAdults} grown-ups)`}
      </h3>
      {data.guests.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {data.guests.map((g, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-100/60 px-3 py-1.5 text-sm font-medium text-amber-900 dark:border-yellow-200/30 dark:bg-yellow-200/10 dark:text-yellow-50"
            >
              <span className="text-amber-600 dark:text-yellow-300">✦</span>
              {g.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function SapphirePage() {
  const [confetti, setConfetti] = useState(false);
  const [rsvpData, setRsvpData] = useState<BdayRsvp | null>(null);
  const [pageState, setPageState] = useState<"loading" | "form" | "editing" | "thanks">("loading");
  const [tapPetals, setTapPetals] = useState<TapPetal[]>([]);
  const petalIdRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const id = getCookie(RSVP_COOKIE);
    if (!id) {
      setPageState("form");
      return;
    }
    fetch(`/api/birthday-rsvp?id=${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.data) {
          setRsvpData(json.data);
          setPageState("thanks");
        } else {
          setPageState("form");
        }
      })
      .catch(() => setPageState("form"));
  }, []);

  const handleRsvpSuccess = useCallback((data: BdayRsvp) => {
    setRsvpData(data);
    setCookie(RSVP_COOKIE, String(data.id));
    setConfetti(true);
    setPageState("thanks");
    setTimeout(() => setConfetti(false), 3500);
  }, []);

  const handleCelebrate = useCallback(() => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3500);
  }, []);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (reducedMotion) return;
    // Ignore taps on buttons/inputs - only background taps
    const target = e.target as HTMLElement;
    if (target.closest("button, input, textarea, a, label, select")) return;

    let x = 0;
    let y = 0;
    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else if ("clientX" in e) {
      x = e.clientX;
      y = e.clientY;
    }

    const colors = ["#F7D77A", "#F4B8C4", "#DDE7B0", "#FFFFFF"];
    const newPetals: TapPetal[] = Array.from({ length: 4 }, () => ({
      id: petalIdRef.current++,
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setTapPetals((prev) => [...prev.slice(-30), ...newPetals]);
    setTimeout(() => {
      setTapPetals((prev) => prev.filter((s) => !newPetals.some((n) => n.id === s.id)));
    }, 1300);
  }, [reducedMotion]);

  return (
    <div
      onClick={handleTap}
      onTouchStart={handleTap}
      className="sapphire-page relative min-h-screen overflow-x-hidden"
    >
      <SapphireThemeToggle />
      <ConfettiCelebration active={confetti} />
      <TapPetalLayer petals={tapPetals} />

      {/* Ambient effects */}
      <div className="hidden dark:block">
        <ForestCanopy />
      </div>
      <DriftingPetals />
      <div className="absolute top-0 left-0 right-0 h-[500px]">
        <ButterflyFlock />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 pt-12 pb-16 sm:pt-16 sm:pb-20">

        {/* HERO */}
        <section className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold tracking-[0.4em] text-purple-600 uppercase sm:text-sm dark:text-pink-200/80"
          >
            You&apos;re Invited to
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="sapphire-name-text mt-4 font-[family-name:var(--font-cormorant-garamond)] text-6xl font-bold drop-shadow-[0_4px_18px_rgba(120,90,200,0.25)] sm:text-7xl md:text-8xl dark:drop-shadow-[0_4px_24px_rgba(166,200,255,0.55)]"
          >
            Sapphire&apos;s
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="my-2 flex justify-center"
          >
            <FairyWings size={120} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-[family-name:var(--font-cormorant-garamond)] text-5xl font-bold text-purple-800 sm:text-6xl dark:text-pink-100"
          >
            Fairy Forest 9
            <sup className="text-3xl sm:text-4xl">th</sup>
            {" "}Birthday
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mx-auto mt-6 max-w-md text-base font-light text-purple-900/80 sm:text-lg dark:text-purple-100/90"
          >
            Sapphire is turning 9 years old! Join us for a fun filled day at
            Moreau Lake to celebrate with swimming, pizza, and cake.
          </motion.p>
        </section>

        {/* COUNTDOWN */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="mb-3 text-center text-xs font-semibold tracking-[0.3em] text-green-800 uppercase dark:text-pink-200/80">
            Until the forest party begins
          </p>
          <PartyCountdown />
        </motion.section>

        {/* DETAILS */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="rounded-3xl border border-purple-300/40 bg-white/60 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-yellow-200/30 dark:bg-gradient-to-br dark:from-white/15 dark:to-white/5 dark:shadow-none">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
              <DetailItem icon="📅" label="When">
                <span className="block font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold leading-tight text-purple-900 dark:text-yellow-100">
                  Saturday
                  <br />
                  June 20, 2026
                </span>
                <span className="mt-1 block text-purple-800/80 dark:text-pink-100/85">
                  11:00 AM – 3:00 PM
                </span>
              </DetailItem>
              <DetailItem icon="🏞️" label="Where">
                <span className="block font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold leading-tight text-purple-900 dark:text-yellow-100">
                  Moreau Lake
                  <br />
                  State Park
                </span>
                <a
                  href="https://maps.google.com/?q=Moreau+Lake+State+Park"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-purple-800/80 underline underline-offset-2 hover:text-purple-600 dark:text-pink-100/85 dark:hover:text-yellow-200"
                >
                  Get directions →
                </a>
              </DetailItem>
            </div>
          </div>
        </motion.section>

        {/* BLOW THE CANDLES */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <BirthdayCake onAllBlown={handleCelebrate} />
        </motion.section>

        {/* WHAT TO EXPECT */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="rounded-3xl border border-purple-300/40 bg-white/60 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-purple-200/30 dark:bg-white/10 dark:shadow-none">
            <p className="text-center text-xs font-semibold tracking-[0.3em] text-purple-600 uppercase dark:text-pink-200/80">
              The Plan
            </p>
            <h3 className="mt-1 text-center font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-purple-900 dark:text-white">
              What to Expect
            </h3>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Highlight emoji="🍕" title="Pizza party" desc="Bring an appetite!" />
              <Highlight emoji="🎂" title="Birthday cake" desc="Sweet treats after lake time." />
              <Highlight emoji="🏊" title="Swimming!" desc="There&apos;s a lake — bring suits & towels." />
              <Highlight emoji="🛝" title="Playground" desc="The park playground is right near the beach." />
              <Highlight emoji="🧴" title="Sunscreen & bug spray" desc="Good fairy forest essentials." />
            </ul>
            <p className="mt-5 text-center text-sm text-purple-700 dark:text-pink-100/80">
              Sapphire is so excited to see you there!
            </p>
          </div>
        </motion.section>

        {/* RSVP */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
          id="rsvp"
        >
          <AnimatePresence mode="wait">
            {pageState === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-10"
              >
                <svg className="h-8 w-8 animate-spin text-pink-200" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </motion.div>
            )}

            {pageState === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RsvpCard onSuccess={handleRsvpSuccess} />
              </motion.div>
            )}

            {pageState === "editing" && rsvpData && (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RsvpCard initialData={rsvpData} onSuccess={handleRsvpSuccess} />
              </motion.div>
            )}

            {pageState === "thanks" && rsvpData && (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-pink-200/30 bg-white/95 p-7 text-center shadow-[0_20px_60px_rgba(27,42,92,0.4)] sm:p-10"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.15 }}
                  className="mx-auto"
                >
                  <FairyWings size={80} />
                </motion.div>
                <h3 className="mt-4 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-bold text-purple-900 sm:text-4xl">
                  {rsvpData.attending
                    ? "You're on the fairy guest list!"
                    : "We'll miss you!"}
                </h3>
                <p className="mt-3 text-base text-purple-700">
                  {rsvpData.attending
                    ? `Thanks ${rsvpData.parent_name.split(" ")[0]}! See you on June 20th.`
                    : `Thanks for letting us know, ${rsvpData.parent_name.split(" ")[0]}.`}
                </p>
                <button
                  type="button"
                  onClick={() => setPageState("editing")}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border-2 border-pink-300 bg-pink-50 px-5 py-2 text-sm font-semibold text-pink-700 transition-all hover:bg-pink-100"
                >
                  Edit my RSVP
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* WHO'S COMING */}
        <WhosComing />

        {/* BIRTHDAY GIRL FACTS */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10"
        >
          <div className="rounded-3xl border border-pink-300/40 bg-white/60 p-6 shadow-sm backdrop-blur-md sm:p-8 dark:border-pink-200/30 dark:bg-white/10 dark:shadow-none">
            <p className="text-center text-xs font-semibold tracking-[0.3em] text-purple-600 uppercase dark:text-pink-200/80">
              Birthday Girl Favorites
            </p>
            <h3 className="mt-1 text-center font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold text-purple-900 dark:text-white">
              Fun Facts About the Birthday Girl
            </h3>
            <ul className="mt-5 grid grid-cols-1 gap-3">
              <InterviewFact
                question="Favorite shows?"
                items={["Hilda", "Barbie", "Bluey"]}
              />
              <InterviewFact
                question="Favorite movies?"
                items={[
                  "BFG",
                  "Ice Age",
                  "Spies In Disguise",
                  "Beauty and the Beast",
                ]}
              />
              <InterviewFact
                question="Hobbies & interests?"
                items={[
                  "Legos",
                  "Painting & crafting",
                  "Swimming, gymnastics, and playing on playgrounds",
                  "Graphic novels",
                ]}
              />
              <InterviewFact
                question="Fun facts?"
                items={[
                  "Sapphire lives on a farm with chickens, ducks, geese, guinea hens, pigs, 3 dogs, and 4 cats. Her favorite animal is Pumpkin the barn cat.",
                  "Sapphire likes cucumbers with salt and pizza with whipped cream.",
                  "Sapphire can do over 25 cartwheels in a row.",
                ]}
              />
            </ul>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer className="mt-12 text-center">
          <p className="font-[family-name:var(--font-cormorant-garamond)] text-2xl italic text-purple-600 dark:text-pink-100/70">
            with love, Sapphire ♡
          </p>
          <p className="mt-2 text-xs text-purple-700/70 dark:text-pink-100/50">
            Questions? Text me at{" "}
            <a href="tel:+18148762231" className="underline underline-offset-2 hover:text-purple-900 dark:hover:text-pink-100/80">
              814-876-2231
            </a>
          </p>
        </footer>
      </div>

      <style jsx global>{`
        /* Light mode: pale forest morning — soft sage → cream → blush */
        .sapphire-page {
          background: linear-gradient(
            180deg,
            #e8f0dd 0%,
            #f1ead5 32%,
            #faead8 65%,
            #f5c6d0 100%
          );
        }
        /* Dark mode: deep forest sunset (the existing palette) */
        .dark .sapphire-page {
          background: linear-gradient(
            180deg,
            #244a2b 0%,
            #38653a 28%,
            #6a8e53 58%,
            #d99aa9 100%
          );
        }
        .sapphire-name-text {
          background: linear-gradient(180deg, #244a2b 0%, #38653a 55%, #b27889 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dark .sapphire-name-text {
          background: linear-gradient(180deg, #ffffff 0%, #f0e5b8 55%, #f4b8c4 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}

function SapphireThemeToggle() {
  const { isDark, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setTheme(isDark ? "light" : "dark");
      }}
      className="fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-purple-300/40 bg-white/80 text-purple-700 shadow-md backdrop-blur transition-transform hover:scale-110 active:scale-95 dark:border-yellow-100/30 dark:bg-white/10 dark:text-yellow-100"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function DetailItem({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200/70 to-pink-200/70 text-3xl leading-none dark:from-yellow-200/30 dark:to-pink-200/20">
        {icon}
      </div>
      <p className="text-[10px] font-semibold tracking-[0.3em] text-purple-600 uppercase sm:text-xs dark:text-pink-200/70">
        {label}
      </p>
      <div className="mt-2 leading-relaxed text-purple-900 dark:text-white">{children}</div>
    </div>
  );
}

function Highlight({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-white/40 p-3 backdrop-blur-sm dark:bg-white/5">
      <span className="text-2xl">{emoji}</span>
      <div className="min-w-0">
        <p className="font-semibold text-purple-900 dark:text-white">{title}</p>
        <p className="text-sm text-purple-700/80 dark:text-pink-100/75">{desc}</p>
      </div>
    </li>
  );
}

function InterviewFact({
  question,
  items,
}: {
  question: string;
  items: string[];
}) {
  return (
    <li className="rounded-2xl bg-white/45 p-4 text-left backdrop-blur-sm dark:bg-white/5">
      <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase dark:text-pink-200/80">
        Q
      </p>
      <p className="mt-1 font-[family-name:var(--font-cormorant-garamond)] text-xl font-semibold text-purple-900 dark:text-white">
        {question}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-purple-700/85 dark:text-pink-100/75">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400 dark:bg-pink-200/70" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}
