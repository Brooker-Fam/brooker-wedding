"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface GameCardProps {
  title: string;
  description: string;
  emoji: string;
  href: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  highScore?: number;
  color: string;
  index?: number;
}

const softColors: Record<string, { bg: string; accent: string }> = {
  sage: { bg: "rgba(92,122,74,0.12)", accent: "#5C7A4A" },
  lavender: { bg: "rgba(92,122,74,0.08)", accent: "#3E5A30" },
  blush: { bg: "rgba(232,200,184,0.15)", accent: "#D4A894" },
  gold: { bg: "rgba(196,154,60,0.12)", accent: "#C49A3C" },
  forest: { bg: "rgba(29,68,32,0.1)", accent: "#1D4420" },
  plum: { bg: "rgba(196,154,60,0.08)", accent: "#A67E28" },
};

const colorOrder = ["sage", "lavender", "blush", "gold", "forest", "plum"];

export default function GameCard({
  title,
  emoji,
  href,
  index = 0,
}: GameCardProps) {
  const colorKey = colorOrder[index % colorOrder.length];
  const colors = softColors[colorKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link href={href} className="group block">
        <div className="game-card-hover overflow-hidden rounded-2xl border border-sage/15 bg-warm-white/80 backdrop-blur-sm">
          {/* Emoji display area */}
          <div
            className="relative flex h-24 items-center justify-center overflow-hidden sm:h-28"
            style={{ background: colors.bg }}
          >
            <motion.span
              className="relative z-10 text-4xl drop-shadow-sm sm:text-5xl"
              whileHover={{ scale: 1.15, rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.4 }}
            >
              {emoji}
            </motion.span>
          </div>

          {/* Card content */}
          <div className="p-3 sm:p-4">
            <h3
              className="mb-2.5 truncate text-center font-[family-name:var(--font-cormorant-garant)] text-base font-bold sm:mb-3 sm:text-lg"
              style={{ color: colors.accent }}
            >
              {title}
            </h3>

            <div
              className="flex items-center justify-center rounded-xl py-2 font-medium text-warm-white transition-all duration-300 group-hover:shadow-md"
              style={{
                backgroundColor: colors.accent,
                boxShadow: `0 2px 10px ${colors.accent}22`,
              }}
            >
              <span className="text-xs tracking-wide sm:text-sm">Play</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
