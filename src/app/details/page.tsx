"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HeartGarland from "@/components/HeartGarland";

function useCountdown(targetMs: number) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const distance = targetMs - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  return timeLeft;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

function SectionCard({
  icon,
  title,
  children,
  delay = 0,
  accent = "sage",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
  accent?: "sage" | "lavender" | "blush" | "gold";
}) {
  const accentColors = {
    sage: "border-[#9CAF88]/20 bg-[#9CAF88]/5 dark:border-[#9CAF88]/15 dark:bg-[#9CAF88]/8",
    lavender: "border-[#B8A9C9]/20 bg-[#B8A9C9]/5 dark:border-[#B8A9C9]/15 dark:bg-[#B8A9C9]/8",
    blush: "border-[#F2D7D5]/40 bg-[#F2D7D5]/10 dark:border-[#D4A894]/20 dark:bg-[#D4A894]/8",
    gold: "border-[#D4A574]/20 bg-[#D4A574]/5 dark:border-[#D4A574]/15 dark:bg-[#D4A574]/8",
  };

  const iconBg = {
    sage: "bg-[#9CAF88]/15 text-[#2D5016] dark:bg-[#9CAF88]/20 dark:text-[#C8D8B8]",
    lavender: "bg-[#B8A9C9]/15 text-[#4A2040] dark:bg-[#B8A9C9]/20 dark:text-[#D4C8E0]",
    blush: "bg-[#F2D7D5]/30 text-[#4A2040] dark:bg-[#D4A894]/20 dark:text-[#F0DDD2]",
    gold: "bg-[#D4A574]/15 text-[#6B4226] dark:bg-[#D4A574]/20 dark:text-[#E8C8A0]",
  };

  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay }}
      className={`rounded-2xl border ${accentColors[accent]} p-6 sm:p-8`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg[accent]}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
            {title}
          </h2>
          <div className="mt-3 space-y-2 font-[family-name:var(--font-body)] text-[#2D5016]/70 dark:text-[#FDF8F0]/70">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BotanicalDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-8 bg-[#9CAF88]/20 dark:bg-[#9CAF88]/15" />
      <svg width="16" height="16" viewBox="0 0 16 16" className="mx-2 text-[#9CAF88]/30 dark:text-[#9CAF88]/25">
        <path d="M8 2 C8 2, 3 6, 8 10 C13 6, 8 2, 8 2Z" fill="currentColor" />
        <line x1="8" y1="10" x2="8" y2="14" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      <div className="h-px w-8 bg-[#9CAF88]/20 dark:bg-[#9CAF88]/15" />
    </div>
  );
}

export default function DetailsPage() {
  const weddingMs = new Date("2026-06-27T13:00:00-04:00").getTime();
  const countdown = useCountdown(weddingMs);

  return (
    <div className="enchanted-bg relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <HeartGarland size="lg" className="mb-5" />
          <div className="mb-3 font-[family-name:var(--font-body)] text-sm font-medium tracking-widest text-[#6B8F5B] uppercase dark:text-[#C0D4A8]">
            A Few Lovely Details
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#2D5016] drop-shadow-[0_8px_20px_rgba(255,255,255,0.45)] dark:text-[#FDF8F0] sm:text-5xl md:text-6xl">
            Celebration Details
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-body)] text-sm leading-relaxed text-[#4A2040] dark:text-[#FDF8F0]/80 sm:text-base">
            A colorful little guide to the day, with all the timing, farm
            charm, and joyful details you&apos;ll need.
          </p>

          {/* Botanical divider */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4A574]/60 to-[#9CAF88]/40 dark:via-[#D4A574]/35 dark:to-[#9CAF88]/25" />
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#D4A574]/70 dark:text-[#D4A574]/45">
              <path d="M10 2 C10 2, 4 8, 10 14 C16 8, 10 2, 10 2Z" fill="currentColor" />
              <line x1="10" y1="14" x2="10" y2="18" stroke="currentColor" strokeWidth="1" />
            </svg>
            <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#B8A9C9]/55 to-[#9CAF88]/40 dark:via-[#B8A9C9]/30 dark:to-[#9CAF88]/25" />
          </div>
        </motion.div>

        {/* Date & Time Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 text-center"
        >
          <div className="relative rounded-2xl border border-soft-gold/25 bg-warm-white/60 px-8 py-7 text-center shadow-[0_4px_20px_rgba(196,154,60,0.1)] backdrop-blur-sm dark:border-soft-gold/30 dark:bg-[#162618]/70 dark:shadow-[0_4px_20px_rgba(196,154,60,0.15)] sm:px-12 sm:py-8">
            <p className="mb-2 text-sm font-medium tracking-[0.25em] text-soft-gold/70 uppercase sm:text-base">
              Celebration Day
            </p>
            <p className="font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold text-soft-gold dark:text-soft-gold-light sm:text-5xl md:text-6xl">
              June 27, 2026
            </p>
            <p className="mt-2 text-sm font-medium text-sage-dark/85 dark:text-sage-light/85 sm:text-base">
              Arrival 12:30 PM · Ceremony 1:00 PM
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">

          <SectionCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            }
            title="Where"
            delay={0.15}
            accent="lavender"
          >
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight lining-nums text-[#2D5016] dark:text-[#FDF8F0]">
              49 Clarks Mill Rd, Greenwich, NY 12834
            </p>
            <p>
              We&apos;re excited to welcome you to our family&apos;s farm in Greenwich, NY.
            </p>
          </SectionCard>

          <BotanicalDivider />

          <SectionCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 2a5 5 0 015 5c0 2-1 3-2 4l-3 4-3-4c-1-1-2-2-2-4a5 5 0 015-5z" />
                <path d="M5 12c-1.5 1-3 3-3 5 0 2.5 4 4 10 4s10-1.5 10-4c0-2-1.5-4-3-5" />
              </svg>
            }
            title="The Celebration"
            delay={0.2}
            accent="blush"
          >
            <p>
              We exchanged vows on January 1st with 20 of our closest loved
              ones -- now it&apos;s time to celebrate with all of you! Join us for
              a day filled with good food, music, dancing, games, and good
              times on our farm.
            </p>
          </SectionCard>

          <BotanicalDivider />

          {/* Farm Animals Section */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="rounded-[2rem] border border-[#D4A574]/20 bg-gradient-to-br from-[#FFF7EC] via-[#FDF8F0] to-[#EED9B8]/28 p-6 shadow-[0_18px_40px_rgba(212,165,116,0.12)] dark:border-[#D4A574]/15 dark:bg-gradient-to-br dark:from-[#241F16] dark:via-[#172218] dark:to-[#222B1D] sm:p-8"
          >
            <div className="mb-6 text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
                Meet Our Farm Family
              </h2>
              <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-[#2D5016]/60 dark:text-[#FDF8F0]/60">
                You may spot some friendly faces during your visit
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { name: "Livestock Dogs", desc: "Our sweet protectors", emoji: "🐕" },
                { name: "Barn Cats", desc: "The quiet hunters", emoji: "🐈" },
                { name: "Zoe", desc: "The couch cuddler", emoji: "🐕‍🦺" },
                { name: "House Cats", desc: "The cozy window watchers", emoji: "🐱" },
                { name: "Guinea Hens", desc: "The watchful ones", emoji: "🐔" },
                { name: "Ducks", desc: "The creek lovers", emoji: "🦆" },
                { name: "Geese", desc: "The loud greeters", emoji: "🪿" },
                { name: "Chickens", desc: "The breakfast providers", emoji: "🐓" },
              ].map((animal) => (
                <motion.div
                  key={animal.name}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border border-[#D4A574]/15 bg-white/60 p-3 text-center transition-shadow hover:shadow-sm dark:border-[#D4A574]/10 dark:bg-[#162618]/60"
                >
                  <div className="mb-1 text-2xl">{animal.emoji}</div>
                  <div className="font-[family-name:var(--font-body)] text-xs font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
                    {animal.name}
                  </div>
                  <div className="font-[family-name:var(--font-body)] text-[11px] text-[#2D5016]/60 dark:text-[#FDF8F0]/60">
                    {animal.desc}
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-center font-[family-name:var(--font-body)] text-xs text-[#2D5016]/55 dark:text-[#FDF8F0]/55">
              Please be gentle with all our farm friends -- they live here full time!
            </p>
          </motion.div>

          <BotanicalDivider />

          <SectionCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
            title="Questions?"
            delay={0.35}
            accent="lavender"
          >
            <p>
              We&apos;re here to help with anything you need. Don&apos;t hesitate to reach out!
            </p>
            <a
              href="mailto:brookerhousehold@gmail.com"
              className="mt-2 inline-block rounded-lg bg-[#B8A9C9]/15 px-4 py-2 font-[family-name:var(--font-body)] text-sm font-medium text-[#4A2040] transition-colors hover:bg-[#B8A9C9]/25 dark:bg-[#B8A9C9]/20 dark:text-[#D4C8E0] dark:hover:bg-[#B8A9C9]/30"
            >
              brookerhousehold@gmail.com
            </a>
            <p className="mt-2 text-sm text-[#2D5016]/55 dark:text-[#FDF8F0]/55">
              We usually respond within a day (farm chores permitting!)
            </p>
          </SectionCard>
        </div>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/rsvp"
            className="inline-block rounded-xl bg-[#D4A574] px-8 py-3.5 font-[family-name:var(--font-body)] text-base font-semibold text-white shadow-md shadow-[#D4A574]/20 transition-all hover:bg-[#c4955a] hover:shadow-lg"
          >
            RSVP Here
          </Link>
          <p className="mt-4 font-[family-name:var(--font-body)] text-sm text-[#6B8F5B] dark:text-[#9CAF88]/85">
            June 27, 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
