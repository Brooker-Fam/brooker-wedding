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
  group: "Old questions" | "Live & contested";
  field: string;
  title: string;
  hook: string;
  poleA: string;
  poleB: string;
};

const DEBATES: DebateCard[] = [
  {
    slug: "god",
    group: "Old questions",
    field: "Metaphysics",
    title: "Does a mind stand under the world?",
    hook: "Contingency, fine-tuning and suffering, and whether evidence can settle the question of God at all.",
    poleA: "A mind underneath",
    poleB: "Brute & impersonal",
  },
  {
    slug: "morality",
    group: "Old questions",
    field: "Metaethics",
    title: "Is right and wrong discovered, or made up?",
    hook: "Real moral facts, or moral feelings? Disagreement, evolution, and the source of “ought.”",
    poleA: "Discovered",
    poleB: "Made",
  },
  {
    slug: "venezuela",
    group: "Live & contested",
    field: "Political economy · history",
    title: "Venezuela: ruined from within, or strangled from outside?",
    hook: "The rise and fall of a petrostate: Chavismo, socialism, US sanctions and oil.",
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
    hook: "What the AI boom costs in power and water: grid strain, higher bills for ratepayers, and whether it’s a bubble.",
    poleA: "Build it out",
    poleB: "Rein it in",
  },
  {
    slug: "milk-mucus",
    group: "Live & contested",
    field: "Respiratory physiology · folk medicine",
    title: "Milk & mucus: does dairy thicken congestion?",
    hook: "An 800-year-old belief against blinded challenge trials that weighed the mucus and asked how it felt. The A1/BCM-7 mechanism keeps the question open.",
    poleA: "Milk thickens it",
    poleB: "It's a myth",
  },
  {
    slug: "saturated-fat",
    group: "Live & contested",
    field: "Nutrition science",
    title: "Saturated fat: artery-clogger, or wrongly blamed?",
    hook: "Sixty years of diet-heart advice: LDL vs ApoB, re-analyses of the old trials, and butter vs seed oils.",
    poleA: "Harmful, limit it",
    poleB: "Largely benign",
  },
  {
    slug: "sun-exposure",
    group: "Live & contested",
    field: "Dermatology · public health",
    title: "Sunlight: a carcinogen to block, or a nutrient we're starved of?",
    hook: "Sunlight went from prescribed cure to Group 1 carcinogen and partway back. Vitamin D, nitric oxide, and whether avoiding the sun has its own risks.",
    poleA: "Avoid it",
    poleB: "Get more of it",
  },
];

const GROUPS = ["Old questions", "Live & contested"] as const;

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


/* The interactive disputation, a different kind of Thought Page: an argument map
   in layers instead of one long read. Lives at /debates/all-the-way-down. */
function RoseMark() {
  // Five sectors, rings alternating ochre/verdigris: a miniature of the map.
  const petals = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="-60 -60 120 120" className="h-28 w-28 shrink-0 sm:h-36 sm:w-36" aria-hidden>
      <circle r="56" fill="none" stroke="currentColor" strokeOpacity="0.12" />
      <circle r="40" fill="none" stroke="currentColor" strokeOpacity="0.1" />
      <circle r="24" fill="none" stroke="currentColor" strokeOpacity="0.1" />
      {petals.map((i) => {
        const a = (i / 5) * Math.PI * 2;
        const pts = [10, 24, 40, 54].map((r, k) => {
          const off = (k % 2 ? 0.18 : -0.12) * (i % 2 ? 1 : -1);
          return { x: Math.sin(a + off) * r, y: -Math.cos(a + off) * r, k };
        });
        return (
          <g key={i}>
            <path
              d={`M0,0 ${pts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.28"
            />
            {pts.map((p) => (
              <circle key={p.k} cx={p.x} cy={p.y} r={p.k === 0 ? 3.2 : 2.6} fill={p.k % 2 ? "#5E9C8A" : "#C49A3C"} />
            ))}
          </g>
        );
      })}
      <circle r="5" fill="#9C8FB8" />
    </svg>
  );
}

function FeaturedDisputation() {
  return (
    <motion.a
      href="/debates/all-the-way-down"
      {...fadeUp}
      className="group mt-12 flex flex-col items-center gap-6 rounded-3xl border border-soft-gold/30 bg-[#171922] p-6 text-[#ebe5d6] shadow-[0_24px_60px_-34px_rgba(23,25,34,0.9)] transition-all hover:-translate-y-0.5 hover:border-soft-gold/60 sm:flex-row sm:p-8"
    >
      <div className="text-[#ebe5d6]">
        <RoseMark />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="font-[family-name:var(--font-quicksand)] text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d8a652]">
          New · interactive
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-bold leading-tight sm:text-4xl">
          All the Way Down
        </h3>
        <p className="mt-2 font-[family-name:var(--font-quicksand)] text-[14px] leading-relaxed text-[#ebe5d6]/70">
          Christian thinkers from Augustine to Alvin Plantinga answer five objections to the Christian God. The two
          sides go back and forth for up to seven rounds, and you decide which moves hold.
        </p>
        <figure className="mt-4 border-l-2 border-[#d8a652]/40 pl-3 text-left">
          <blockquote className="font-[family-name:var(--font-cormorant-garamond)] text-[17px] italic leading-snug text-[#ebe5d6]/85">
            “Reason, to be sure, doesn’t go all the way down for believers, but it doesn’t for most sensitive,
            civilised non-religious types either.”
          </blockquote>
          <figcaption className="mt-1 font-[family-name:var(--font-quicksand)] text-[11px] tracking-wide text-[#ebe5d6]/50">
            Terry Eagleton, <cite>London Review of Books</cite>, 19 October 2006
          </figcaption>
        </figure>
        <p className="mt-4 font-[family-name:var(--font-quicksand)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6dbaa4] transition-colors group-hover:text-[#8fd0bc]">
          Start reading →
        </p>
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
            Long reads on contested questions. Each one gives the history, then sets the strongest case
            for each side next to the other, so you can find the question you disagree on.
          </p>
        </motion.div>

        <FeaturedDisputation />

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
          Each opens as its own page. A “steelman” is an argument put as strongly as its defenders
          would put it. Laying one out doesn’t mean endorsing it.
        </motion.p>
      </div>
    </main>
  );
}
