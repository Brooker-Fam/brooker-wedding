/**
 * Shared theme palettes for calendar surfaces.
 *
 * The household theme is the parent-facing "bulletin board" look (admin,
 * scoreboard, display). Kid themes are the per-kid worlds (Emmett's
 * Viking quest log, Sapphire's fairy garden). Token names match the
 * CSS variables in `globals.css` so consumers can either pull a token
 * here or use the `var(--board-*)` form directly.
 */

export const HOUSEHOLD_THEME = {
  bg: "var(--board-bg)",
  ink: "var(--board-ink)",
  accent: "var(--board-accent)",
  muted: "var(--board-muted)",
  grain: "var(--board-grain)",
  rule: "var(--board-rule)",
} as const;

export type KidTheme = {
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

export const SAPPHIRE_THEME: KidTheme = {
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

export const EMMETT_THEME: KidTheme = {
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

export function themeForKid(name: string): KidTheme | null {
  const slug = name?.toLowerCase();
  if (slug === "sapphire") return SAPPHIRE_THEME;
  if (slug === "emmett") return EMMETT_THEME;
  return null;
}
