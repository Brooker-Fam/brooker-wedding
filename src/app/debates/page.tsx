"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* The debate maps are self-contained HTML "field maps" living in /public/debates.
   This index is the one piece rendered in the wedding site's theme; the maps
   themselves keep their own editorial dark house style. To add a map: build the
   HTML in /public/debates/<slug>.html and add an entry here. See README.md. */

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

type DebateCard = {
  slug: string;
  field: string;
  title: string;
  poleA: string;
  poleB: string;
  blurb: string;
};

const DEBATES: DebateCard[] = [
  {
    slug: "god",
    field: "Metaphysics · belief",
    title: "Does a mind stand under the world?",
    poleA: "A mind underneath",
    poleB: "Brute & impersonal",
    blurb:
      "The oldest argument, mapped. Contingency, fine-tuning, suffering, and whether God is even a claim evidence can weigh.",
  },
  {
    slug: "morality",
    field: "Metaethics",
    title: "Is right and wrong discovered, or made up?",
    poleA: "Discovered",
    poleB: "Made",
    blurb:
      "Are there moral facts out there to find, or is morality something we build? Realism, error theory, evolution, and the source of “ought.”",
  },
  {
    slug: "vaccines",
    field: "Public health · law",
    title: "My body, or our herd?",
    poleA: "The individual",
    poleB: "The collective",
    blurb:
      "Framed around attorney Aaron Siri's challenges: placebo trials, mandates, the 1986 liability shield, and who gets to decide for a child.",
  },
  {
    slug: "us-iran",
    field: "Grand strategy",
    title: "Bomb it, or bargain?",
    poleA: "Force & pressure",
    poleB: "Restraint & diplomacy",
    blurb:
      "After the 2025–26 strikes and the fragile ceasefire: can force stop a bomb, is the regime deterrable, and can any deal hold?",
  },
];

function AxisBar({ poleA, poleB }: { poleA: string; poleB: string }) {
  return (
    <div className="mt-5">
      <div
        className="h-[6px] w-full rounded-full"
        style={{
          background:
            "linear-gradient(90deg, #6dbaa4 0%, #6e6b78 50%, #d8a652 100%)",
        }}
      />
      <div className="mt-2 flex items-center justify-between font-[family-name:var(--font-quicksand)] text-[11px] uppercase tracking-wider">
        <span style={{ color: "#3E6B5C" }} className="dark:!text-[#6dbaa4]">
          {poleA}
        </span>
        <span style={{ color: "#9A7426" }} className="dark:!text-[#d8a652]">
          {poleB}
        </span>
      </div>
    </div>
  );
}

export default function DebatesIndexPage() {
  return (
    <main className="enchanted-bg min-h-screen px-4 pt-28 pb-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center">
          <Link
            href="/"
            className="font-[family-name:var(--font-quicksand)] text-xs font-medium uppercase tracking-widest text-forest/40 transition-colors hover:text-soft-gold dark:text-cream/40"
          >
            ← back home
          </Link>
          <p className="mt-6 font-[family-name:var(--font-quicksand)] text-xs font-semibold uppercase tracking-[0.25em] text-soft-gold-dark dark:text-soft-gold-light">
            Field maps
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold leading-tight text-forest dark:text-cream sm:text-5xl">
            Debate Maps
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-[family-name:var(--font-quicksand)] text-base leading-relaxed text-forest/70 dark:text-cream/70">
            Matt&apos;s side project: taking a contested question and mapping it as a fair fight.
            Each map lays out the lineage of the debate, the live positions, and a handful of
            cruxes &mdash; with the <strong>strongest case for both sides</strong> set down
            honestly, side by side. The goal isn&apos;t to pick a winner. It&apos;s to help you
            find which question you actually disagree on.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {DEBATES.map((d, i) => (
            <motion.a
              key={d.slug}
              href={`/debates/${d.slug}.html`}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: Math.min(i * 0.07, 0.3) }}
              className="group block rounded-3xl border border-sage/20 bg-cream/50 p-6 transition-all hover:-translate-y-1 hover:border-soft-gold/40 hover:shadow-[0_18px_40px_-24px_rgba(29,68,32,0.45)] dark:border-cream/10 dark:bg-[#0D1F0F]/50 sm:p-7"
            >
              <p className="font-[family-name:var(--font-quicksand)] text-[11px] font-semibold uppercase tracking-[0.2em] text-sage-dark dark:text-sage-light">
                {d.field}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold leading-tight text-forest transition-colors group-hover:text-soft-gold-dark dark:text-cream dark:group-hover:text-soft-gold-light">
                {d.title}
              </h2>
              <p className="mt-3 font-[family-name:var(--font-quicksand)] text-sm leading-relaxed text-forest/65 dark:text-cream/65">
                {d.blurb}
              </p>
              <AxisBar poleA={d.poleA} poleB={d.poleB} />
              <p className="mt-5 font-[family-name:var(--font-quicksand)] text-sm font-medium text-soft-gold-dark dark:text-soft-gold-light">
                Open the field map
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
              </p>
            </motion.a>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          {...fadeUp}
          className="mx-auto mt-12 max-w-2xl text-center font-[family-name:var(--font-quicksand)] text-xs leading-relaxed text-forest/45 dark:text-cream/45"
        >
          Each map opens as a standalone page. A &ldquo;steelman&rdquo; is the strongest version of
          an argument, stated charitably &mdash; presenting one is not endorsing it. These are
          compressed summaries of debates that run to whole libraries; they&apos;re a doorway, not
          the last word.
        </motion.p>
      </div>
    </main>
  );
}
