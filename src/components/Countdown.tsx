"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const WEDDING_DATE = new Date("2026-06-27T16:00:00-06:00");

interface TimeUnit {
  value: number;
  label: string;
}

function calculateTimeLeft(): TimeUnit[] {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return [
      { value: 0, label: "days" },
      { value: 0, label: "hours" },
      { value: 0, label: "minutes" },
      { value: 0, label: "seconds" },
    ];
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return [
    { value: days, label: "days" },
    { value: hours, label: "hours" },
    { value: minutes, label: "minutes" },
    { value: seconds, label: "seconds" },
  ];
}

function CountdownCard({ value, label }: TimeUnit) {
  const display = String(value).padStart(label === "days" ? 3 : 2, "0");

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="flex items-center justify-center rounded-2xl border border-sage/20 bg-warm-white/80 px-3 py-3 shadow-[0_2px_12px_rgba(29,68,32,0.08)] backdrop-blur-sm sm:px-5 sm:py-4"
        key={value}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="font-[family-name:var(--font-cormorant-garant)] text-2xl font-bold tracking-wide text-forest sm:text-4xl md:text-5xl">
          {display}
        </span>
      </motion.div>
      <span className="text-xs font-semibold tracking-widest text-warm-white/90 uppercase drop-shadow-[0_1px_2px_rgba(29,68,32,0.3)] sm:text-sm">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([
    { value: 0, label: "days" },
    { value: 0, label: "hours" },
    { value: 0, label: "minutes" },
    { value: 0, label: "seconds" },
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm text-sage/60">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-warm-white/90 uppercase drop-shadow-[0_1px_2px_rgba(29,68,32,0.3)] sm:text-sm">
        Counting down to forever
      </p>

      <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
        {timeLeft.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-3 sm:gap-5 md:gap-6">
            <CountdownCard value={unit.value} label={unit.label} />
            {index < timeLeft.length - 1 && (
              <div className="flex flex-col gap-1.5">
                <motion.span
                  className="block h-1.5 w-1.5 rounded-full bg-soft-gold/50 sm:h-2 sm:w-2"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.span
                  className="block h-1.5 w-1.5 rounded-full bg-soft-gold/50 sm:h-2 sm:w-2"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
