"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* The debate maps are self-contained HTML "field maps" in /public/debates.
   This index is the only piece in the wedding theme; the maps keep their own
   editorial dark house style. To add one: build /public/debates/<slug>.html and
   add an entry to DEBATES below. See README.md. */

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

type DebateCard = {
  slug: string;
  group: "Enduring questions" | "Live & contested";
  field: string;
  title: string;
  hook: string;
  poleA: string;
  poleB: string;
};

const DEBATES: DebateCard[] = [
  {
    slug: "god",
    group: "Enduring questions",
    field: "Metaphysics",
    title: "Does a mind stand under the world?",
    hook: "Contingency, fine-tuning, suffering — and whether God is a claim evidence can weigh.",
    poleA: "A mind underneath",
    poleB: "Brute & impersonal",
  },
  {
    slug: "morality",
    group: "Enduring questions",
    field: "Metaethics",
    title: "Is right and wrong discovered, or made up?",
    hook: "Real moral facts, or moral feelings? Disagreement, evolution, and the source of “ought.”",
    poleA: "Discovered",
    poleB: "Made",
  },
  {
    slug: "habits-intentions",
    group: "Enduring questions",
    field: "Ethics · moral psychology",
    title: "Are we made good by habit, or by intention?",
    hook: "Aristotle's trained character vs Kant's good will — where moral worth lives, how virtue is formed, and whether stable character even exists.",
    poleA: "Habit & character",
    poleB: "Will & intention",
  },
  {
    slug: "venezuela",
    group: "Live & contested",
    field: "Political economy · history",
    title: "Venezuela: ruined from within, or strangled from outside?",
    hook: "The rise and fall of a petrostate — Chavismo, socialism, US sanctions, and the oil under it all.",
    poleA: "Ruined from within",
    poleB: "Strangled from outside",
  },
  {
    slug: "vaccines",
    group: "Live & contested",
    field: "Public health · law",
    title: "Vaccines: my body, or our herd?",
    hook: "Consent, mandates, the 1986 liability shield, and what counts as proof.",
    poleA: "The individual",
    poleB: "The collective",
  },
  {
    slug: "covid-vaccines",
    group: "Live & contested",
    field: "Public health",
    title: "COVID vaccines: do they work, at what cost?",
    hook: "Effectiveness, myocarditis and harms, risk by age, and whether the rollout was oversold.",
    poleA: "Net benefit",
    poleB: "Oversold / harmful",
  },
  {
    slug: "us-iran",
    group: "Live & contested",
    field: "Grand strategy",
    title: "Iran: bomb it, or bargain?",
    hook: "Can force stop a bomb, is the regime deterrable, and can any deal hold?",
    poleA: "Force & pressure",
    poleB: "Restraint & diplomacy",
  },
  {
    slug: "ai-data-centers",
    group: "Live & contested",
    field: "Energy · technology",
    title: "AI data centers: build, or rein in?",
    hook: "The power and water bill behind the AI boom — grid strain, ratepayer costs, and the bubble question.",
    poleA: "Build it out",
    poleB: "Rein it in",
  },
  {
    slug: "saturated-fat",
    group: "Live & contested",
    field: "Nutrition science",
    title: "Saturated fat: artery-clogger, or wrongly blamed?",
    hook: "Sixty years of diet-heart advice — LDL vs ApoB, the trial re-analyses, and butter vs seed oils.",
    poleA: "Harmful — limit it",
    poleB: "Largely benign",
  },
  {
    slug: "sun-exposure",
    group: "Live & contested",
    field: "Dermatology · public health",
    title: "Sunlight: a carcinogen to block, or a nutrient we're starved of?",
    hook: "From prescribed cure to Group 1 carcinogen and partway back — vitamin D, nitric oxide, and whether avoidance is its own risk.",
    poleA: "Shade it — the sun harms",
    poleB: "Seek it — the sun heals",
  },
];

const GROUPS = ["Enduring questions", "Live & contested"] as const;

function AxisBar({ poleA, poleB }: { poleA: string; poleB: string }) {
  return (
    <div className="mt-4">
      <div
        className="h-[5px] w-full rounded-full"
        style={{ background: "linear-gradient(90deg, #6dbaa4 0%, #6e6b78 50%, #d8a652 100%)" }}
      />
      <div className="mt-1.5 flex items-center justify-between font-[family-name:var(--font-quicksand)] text-[10px] font-medium uppercase tracking-wider">
        <span className="text-[#3E6B5C] dark:!text-[#6dbaa4]">{poleA}</span>
        <span className="text-[#9A7426] dark:!text-[#d8a652]">{poleB}</span>
      </div>
    </div>
  );
}

function Card({ d, index }: { d: DebateCard; index: number }) {
  return (
    <motion.a
      href={`/debates/${d.slug}.html`}
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: Math.min(index * 0.05, 0.25) }}
      className="group flex flex-col rounded-2xl border border-sage/20 bg-cream/50 p-5 transition-all hover:-translate-y-0.5 hover:border-soft-gold/40 hover:shadow-[0_14px_34px_-22px_rgba(29,68,32,0.45)] dark:border-cream/10 dark:bg-[#0D1F0F]/50"
    >
      <p className="font-[family-name:var(--font-quicksand)] text-[10px] font-semibold uppercase tracking-[0.2em] text-sage-dark dark:text-sage-light">
        {d.field}
      </p>
      <h3 className="mt-1.5 font-[family-name:var(--font-cormorant-garamond)] text-xl font-bold leading-snug text-forest transition-colors group-hover:text-soft-gold-dark dark:text-cream dark:group-hover:text-soft-gold-light">
        {d.title}
      </h3>
      <p className="mt-2 font-[family-name:var(--font-quicksand)] text-[13px] leading-relaxed text-forest/60 dark:text-cream/60">
        {d.hook}
      </p>
      <div className="mt-auto">
        <AxisBar poleA={d.poleA} poleB={d.poleB} />
      </div>
    </motion.a>
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
          <h1 className="mt-5 font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold leading-tight text-forest dark:text-cream sm:text-5xl">
            Thought Pages
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-quicksand)] text-[15px] leading-relaxed text-forest/65 dark:text-cream/65">
            Long reads on big, contested questions — each one mapped as a fair fight, with the best
            case for <strong>both sides</strong> side by side, and the history behind it. Pick one and
            find which question you actually disagree on.
          </p>
        </motion.div>

        {/* Grouped sections */}
        {GROUPS.map((group) => {
          const items = DEBATES.filter((d) => d.group === group);
          return (
            <section key={group} className="mt-12">
              <motion.div {...fadeUp} className="mb-4 flex items-center gap-3">
                <h2 className="font-[family-name:var(--font-quicksand)] text-xs font-bold uppercase tracking-[0.22em] text-soft-gold-dark dark:text-soft-gold-light">
                  {group}
                </h2>
                <div className="h-px flex-1 bg-sage/20 dark:bg-cream/10" />
              </motion.div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((d, i) => (
                  <Card key={d.slug} d={d} index={i} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Tiny footnote */}
        <motion.p
          {...fadeUp}
          className="mx-auto mt-12 max-w-xl text-center font-[family-name:var(--font-quicksand)] text-[11px] leading-relaxed text-forest/40 dark:text-cream/40"
        >
          Each opens as a standalone page. A “steelman” is the strongest version of an argument,
          stated charitably — presenting one is not endorsing it.
        </motion.p>
      </div>
    </main>
  );
}
