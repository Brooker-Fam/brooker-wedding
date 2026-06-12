"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const practices = [
  {
    title: "Pasture With Texture",
    body: "We want our pigs to have a life full of rooting, grazing, shade, mud, hay, weather, and the small decisions animals make when they have room to move.",
  },
  {
    title: "Slow Heritage Growth",
    body: "Heritage breeds ask for more patience. We like that. Their slower pace gives the pork depth, marbling, and a flavor that feels connected to real pasture.",
  },
  {
    title: "Daily Nurture",
    body: "Care is not abstract here. It is buckets, bedding, fence checks, feed, fresh water, observation, and noticing when an animal needs something different.",
  },
  {
    title: "Seasonal Shares",
    body: "We sell in rhythm with the animals and the year: pork shares, seasonal cuts, sausage, and whole or half hog reservations when the time is right.",
  },
];

export default function DetailsPage() {
  return (
    <div className="creekside-page relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-14 max-w-4xl text-center"
        >
          <p className="field-tag justify-center">Our Care Practices</p>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-semibold leading-tight text-[#26351F] dark:text-[#F5EAD8] sm:text-7xl">
            Raised slowly, watched closely, cared for daily.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#405034] dark:text-[#E6DCC8]/76">
            Creekside Fields is guided by a simple belief: animals raised for
            food still deserve tenderness, attention, and a life with texture.
          </p>
        </motion.header>

        <div className="root-divider mb-12" />

        <div className="grid gap-5 md:grid-cols-2">
          {practices.map((practice, index) => (
            <motion.article
              key={practice.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.06 }}
              className="moss-card p-7 sm:p-8"
            >
              <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-[#8A6A2D] uppercase dark:text-[#C9A24C]">
                Creekside {index + 1}
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#26351F] dark:text-[#F5EAD8]">
                {practice.title}
              </h2>
              <p className="mt-4 leading-7 text-[#4A5638] dark:text-[#E6DCC8]/72">
                {practice.body}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.section
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.28 }}
          className="mt-12 overflow-hidden rounded-lg border border-[#68764D]/20 bg-[#25331F] text-[#F7EBD5] shadow-[0_18px_48px_rgba(37,51,31,0.22)]"
        >
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[#1A2517] p-7 sm:p-9">
              <p className="field-tag text-[#D5B66B]">Availability</p>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight">
                Ask what is coming from the pasture next.
              </h2>
            </div>
            <div className="p-7 sm:p-9">
              <p className="leading-8 text-[#E6DCC8]/82">
                Pork availability follows the season, not a warehouse calendar.
                Start with the pork share page, then send us a note and we will
                talk through timing, pickup, and what size makes sense for your
                household.
              </p>
              <Link
                href="/pork-shares"
                className="mt-7 inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#D5B66B]/30 bg-[#C49A3C] px-8 py-3 text-sm font-semibold text-[#172015] shadow-[0_4px_15px_rgba(0,0,0,0.16)] transition-all hover:bg-[#D5B66B]"
              >
                View Pork Shares
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
