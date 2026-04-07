"use client";

import { motion } from "framer-motion";
import FarmScene from "@/components/FarmScene";
import Countdown from "@/components/Countdown";
import PixelButton from "@/components/PixelButton";
import HeartGarland from "@/components/HeartGarland";

function getAge(birthYear: number, birthMonth: number, birthDay: number) {
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const monthDiff = today.getMonth() + 1 - birthMonth;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) age--;
  return age;
}


const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* =============================================
          HERO SECTION
          ============================================= */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Enchanted forest background */}
        <FarmScene />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center px-4 pt-20 pb-8 sm:pt-24">
          {/* Small subtitle */}
          <HeartGarland size="lg" className="mb-5" />
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-sm font-medium tracking-[0.3em] text-sage-dark/90 uppercase dark:text-sage-light/90 sm:text-base"
          >
            Together with their families
          </motion.p>

          {/* Main title with sparkle accents */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: "easeOut",
            }}
            className="fairy-sparkle mb-3 text-center font-[family-name:var(--font-cormorant-garamond)] text-5xl font-bold text-forest dark:text-cream sm:mb-4 sm:text-7xl md:text-8xl"
          >
            Matt & Brittany
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-6 text-center text-lg font-medium text-forest/80 dark:text-cream/80 sm:mb-8 sm:text-xl md:text-2xl"
          >
            invite you to their wedding celebration
          </motion.p>

          {/* Date display */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-8 sm:mb-10"
          >
            <div className="relative rounded-2xl border border-soft-gold/25 bg-warm-white/60 px-12 py-7 text-center shadow-[0_4px_20px_rgba(196,154,60,0.1)] backdrop-blur-sm dark:border-soft-gold/30 dark:bg-[#162618]/70 dark:shadow-[0_4px_20px_rgba(196,154,60,0.15)] sm:px-16 sm:py-8">
              <p className="mb-2 text-sm font-medium tracking-[0.25em] text-soft-gold/70 uppercase sm:text-base">
                Join the Celebration
              </p>
              <p className="font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold text-soft-gold dark:text-soft-gold-light sm:text-5xl md:text-6xl">
                June 27, 2026
              </p>
              <p className="mt-2 text-sm font-medium text-sage-dark/80 dark:text-sage-light/85 sm:text-base">
                Arrival 12:30 PM · Ceremony 1:00 PM
              </p>
              <div className="mt-6">
                <PixelButton href="/rsvp" variant="primary" size="lg">
                  RSVP Here
                </PixelButton>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mb-8 w-full max-w-4xl sm:mb-10"
          >
            <div className="overflow-hidden rounded-3xl border border-blush/30 bg-warm-white/75 px-6 py-8 shadow-[0_10px_40px_rgba(164,112,120,0.08)] backdrop-blur-sm dark:border-blush-dark/25 dark:bg-[#162618]/70 dark:shadow-[0_10px_40px_rgba(0,0,0,0.22)] sm:px-10 sm:py-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="mb-3 text-xs font-medium tracking-[0.25em] text-soft-gold/70 uppercase sm:text-sm">
                  Our Story
                </p>
                <h3 className="fairy-sparkle mb-6 font-[family-name:var(--font-cormorant-garant)] text-3xl font-bold text-forest dark:text-cream sm:text-4xl">
                  A Love Worth Celebrating
                </h3>

                <div className="space-y-5 text-left text-sm leading-relaxed text-forest/70 dark:text-cream/70 sm:text-base">
                  <p>
                    Matt proposed to Brittany on Thanksgiving 2025 in the
                    beautiful woods at the New Skete Monastery. Before asking her
                    to marry him, he sang and played the mandolin and read her a
                    poem he had written just for her. After Brittany said yes,
                    they attended a peaceful service at the monastery, making the
                    moment even more meaningful.
                  </p>

                  <p>
                    They couldn&apos;t wait to be husband and wife, so in just 35
                    days, they planned their dream winter wedding, exchanging
                    vows surrounded by their 20 closest loved ones.
                  </p>

                  <p>
                    Now, they&apos;re so excited to gather everyone they love for
                    their summer wedding celebration under the open sky at their
                    farm on June 27.
                  </p>

                  <p>
                    The day will begin with a ceremony celebrating their union,
                    followed by a joyful celebration filled with good food,
                    music, dancing, games, and lots of love.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Enchanted section divider - toadstools and fairy lights */}
      <WhimsicalDivider />

      {/* =============================================
          RSVP CTA SECTION
          ============================================= */}
      <section className="relative px-4 py-10 sm:py-14">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sage/10 to-transparent" />

        <div className="relative mx-auto max-w-4xl">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Secondary links */}
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <PixelButton
                  href="/details"
                  variant="success"
                  size="lg"
                  className="px-12 py-4 text-base sm:px-16 sm:py-5 sm:text-lg"
                >
                  Celebration Details
                </PixelButton>
              </motion.div>
            </div>

            <div className="mt-8 sm:mt-10">
              <Countdown />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enchanted section divider - gnome and sparkles */}
      <GnomeDivider />

      {/* =============================================
          FAMILY SECTION
          ============================================= */}
      <section className="relative px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="overflow-hidden rounded-3xl border border-sage/15 bg-warm-white/70 px-6 py-10 shadow-[0_4px_30px_rgba(29,68,32,0.05)] backdrop-blur-sm dark:border-sage/20 dark:bg-[#162618]/70 dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] sm:px-10 sm:py-14">
              <h3 className="fairy-sparkle mb-6 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-forest dark:text-cream sm:mb-8 sm:text-3xl">
                The Brooker Family
              </h3>

              <div className="mb-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl sm:text-4xl">🤵</span>
                  <span className="font-[family-name:var(--font-cormorant-garamond)] text-lg font-semibold text-forest dark:text-cream">
                    Matt
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="text-2xl text-soft-gold sm:text-3xl"
                  >
                    &hearts;
                  </motion.span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl sm:text-4xl">👰</span>
                  <span className="font-[family-name:var(--font-cormorant-garamond)] text-lg font-semibold text-forest dark:text-cream">
                    Brittany
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-sage/10 pt-6 dark:border-sage/20">
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl sm:text-3xl">&#127775;</span>
                    <span className="font-[family-name:var(--font-cormorant-garamond)] text-base font-semibold text-forest dark:text-cream">
                      Emmett
                    </span>
                    <span className="text-xs text-forest/70 dark:text-cream/70">Age {getAge(2014, 3, 29)}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl sm:text-3xl">&#128142;</span>
                    <span className="font-[family-name:var(--font-cormorant-garamond)] text-base font-semibold text-forest dark:text-cream">
                      Sapphire
                    </span>
                    <span className="text-xs text-forest/70 dark:text-cream/70">Age {getAge(2017, 6, 19)}</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl sm:text-3xl">🩷</span>
                    <span className="font-[family-name:var(--font-cormorant-garamond)] text-base font-semibold text-forest dark:text-cream">
                      Baby Girl Brooker
                    </span>
                    <span className="text-xs text-forest/70 dark:text-cream/70">Due October 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* =============================================
          FOOTER
          ============================================= */}
      <footer className="relative border-t border-sage/15 bg-cream-dark/50 px-4 py-12 dark:border-sage/20 dark:bg-[#0A1A0C]/50 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <HeartGarland className="mb-5" />

          <p className="font-[family-name:var(--font-cormorant-garamond)] text-xl font-semibold text-forest/60 dark:text-cream/60 sm:text-2xl">
            Matt & Brittany
          </p>
          <p className="mt-1 text-sm text-forest/70 dark:text-cream/70">June 27, 2026</p>

          <div className="mt-5">
            <a
              href="mailto:brookerhousehold@gmail.com"
              className="text-sm text-soft-gold-dark transition-colors hover:text-soft-gold dark:text-soft-gold-light"
            >
              brookerhousehold@gmail.com
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-sage/10 dark:bg-sage/20" />
            <span className="text-xs text-forest/60 dark:text-cream/60">2026</span>
            <div className="h-px w-12 bg-sage/10 dark:bg-sage/20" />
          </div>

          <motion.p
            className="mt-5 text-xs text-forest/60 dark:text-cream/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Made with love and a little fairy dust
          </motion.p>
        </div>
      </footer>
    </div>
  );
}

function WhimsicalDivider() {
  return (
    <div className="relative flex items-center justify-center py-4">
      <div className="flex items-end gap-3 opacity-30">
        {/* Left sparkle */}
        <motion.svg
          width="8"
          height="8"
          viewBox="0 0 12 12"
          fill="none"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        >
          <path d="M6 0 L7 4.5 L12 6 L7 7.5 L6 12 L5 7.5 L0 6 L5 4.5 Z" fill="#C49A3C" />
        </motion.svg>

        {/* Line */}
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-soft-gold/40 to-transparent sm:w-20" />

        {/* Toadstool */}
        <svg width="16" height="20" viewBox="0 0 24 28" fill="none" className="translate-y-1">
          <rect x="9" y="16" width="6" height="12" rx="2" fill="#D4A894" opacity="0.6" />
          <ellipse cx="12" cy="14" rx="12" ry="10" fill="#9B4040" opacity="0.5" />
          <circle cx="7" cy="10" r="1.5" fill="#FDF8F0" opacity="0.6" />
          <circle cx="14" cy="8" r="1.2" fill="#FDF8F0" opacity="0.6" />
          <circle cx="17" cy="12" r="1" fill="#FDF8F0" opacity="0.5" />
        </svg>

        {/* Center sparkle */}
        <motion.svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          <path d="M6 0 L7 4.5 L12 6 L7 7.5 L6 12 L5 7.5 L0 6 L5 4.5 Z" fill="#C49A3C" />
        </motion.svg>

        {/* Toadstool (smaller) */}
        <svg width="12" height="16" viewBox="0 0 24 28" fill="none" className="translate-y-1.5">
          <rect x="9" y="16" width="6" height="12" rx="2" fill="#D4A894" opacity="0.5" />
          <ellipse cx="12" cy="14" rx="12" ry="10" fill="#9B4040" opacity="0.45" />
          <circle cx="8" cy="11" r="1.5" fill="#FDF8F0" opacity="0.5" />
          <circle cx="15" cy="9" r="1" fill="#FDF8F0" opacity="0.5" />
        </svg>

        {/* Line */}
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-soft-gold/40 to-transparent sm:w-20" />

        {/* Right sparkle */}
        <motion.svg
          width="8"
          height="8"
          viewBox="0 0 12 12"
          fill="none"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <path d="M6 0 L7 4.5 L12 6 L7 7.5 L6 12 L5 7.5 L0 6 L5 4.5 Z" fill="#C49A3C" />
        </motion.svg>
      </div>
    </div>
  );
}

function GnomeDivider() {
  return (
    <div className="relative flex items-center justify-center py-4">
      <div className="flex items-end gap-4 opacity-25">
        {/* Sparkle */}
        <motion.svg
          width="6"
          height="6"
          viewBox="0 0 12 12"
          fill="none"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <path d="M6 0 L7 4.5 L12 6 L7 7.5 L6 12 L5 7.5 L0 6 L5 4.5 Z" fill="#C49A3C" />
        </motion.svg>

        {/* Line */}
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-sage/30 to-transparent sm:w-24" />

        {/* Gnome silhouette */}
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none" className="translate-y-0.5">
          <polygon points="7,0 11,10 3,10" fill="#1D4420" opacity="0.6" />
          <circle cx="7" cy="12" r="3.5" fill="#1D4420" opacity="0.5" />
          <ellipse cx="7" cy="18" rx="4.5" ry="4" fill="#1D4420" opacity="0.5" />
          <ellipse cx="7" cy="15" rx="3" ry="3.5" fill="#1D4420" opacity="0.4" />
        </svg>

        {/* Tiny toadstool */}
        <svg width="10" height="12" viewBox="0 0 24 28" fill="none" className="translate-y-2">
          <rect x="9" y="16" width="6" height="12" rx="2" fill="#D4A894" opacity="0.5" />
          <ellipse cx="12" cy="14" rx="12" ry="10" fill="#9B4040" opacity="0.4" />
          <circle cx="8" cy="11" r="1.5" fill="#FDF8F0" opacity="0.5" />
          <circle cx="15" cy="10" r="1" fill="#FDF8F0" opacity="0.4" />
        </svg>

        {/* Line */}
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-sage/30 to-transparent sm:w-24" />

        {/* Sparkle */}
        <motion.svg
          width="6"
          height="6"
          viewBox="0 0 12 12"
          fill="none"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 1.1 }}
        >
          <path d="M6 0 L7 4.5 L12 6 L7 7.5 L6 12 L5 7.5 L0 6 L5 4.5 Z" fill="#C49A3C" />
        </motion.svg>
      </div>
    </div>
  );
}

function FairyLightDivider() {
  const bulbs = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="relative flex items-center justify-center overflow-hidden py-6">
      <div className="relative">
        {/* The wire/string */}
        <svg
          width="280"
          height="30"
          viewBox="0 0 280 30"
          fill="none"
          className="opacity-20"
        >
          <path
            d="M0 5 Q35 25 70 8 Q105 25 140 8 Q175 25 210 8 Q245 25 280 5"
            stroke="#5C7A4A"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        {/* Light bulbs along the string */}
        <div className="absolute inset-0 flex items-start justify-between px-2">
          {bulbs.map((i) => (
            <motion.div
              key={i}
              className="mt-1"
              style={{
                marginTop: i % 2 === 0 ? "2px" : "14px",
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2 + (i % 3) * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(196,154,60,0.9) 0%, rgba(196,154,60,0.3) 70%, transparent 100%)",
                  boxShadow: "0 0 4px rgba(196,154,60,0.4)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
