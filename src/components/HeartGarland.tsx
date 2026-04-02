"use client";

import { motion } from "framer-motion";

export default function HeartGarland({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const isLarge = size === "lg";

  return (
    <div className={`flex items-center justify-center ${isLarge ? "gap-4" : "gap-3"} ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className={`${i % 2 === 0 ? "text-soft-gold/40" : "text-sage/40"} ${isLarge ? "text-xl sm:text-2xl" : "text-sm"}`}
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          &hearts;
        </motion.span>
      ))}
    </div>
  );
}
