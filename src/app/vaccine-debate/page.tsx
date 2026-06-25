"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ------------------------------------------------------------------ *
 * A good-faith, steelman-style map of the vaccine debate, framed
 * around the questions raised by attorney Aaron Siri and the people
 * who disagree with him. The goal is NOT to declare a winner — it is
 * to state each side's STRONGEST, most charitable version so a reader
 * can think clearly. Steelmanning a position is not endorsing it.
 * ------------------------------------------------------------------ */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

type Topic = {
  id: string;
  question: string;
  context: string;
  /** The strongest version of the skeptic / Siri-aligned argument. */
  skeptic: { headline: string; points: string[] };
  /** The strongest version of the mainstream public-health argument. */
  establishment: { headline: string; points: string[] };
  /** Where reasonable people on both sides can actually agree. */
  commonGround: string;
};

const TOPICS: Topic[] = [
  {
    id: "placebo",
    question: "Should childhood vaccines be tested against inert (saline) placebos?",
    context:
      "This is the argument Siri is best known for. Through FOIA litigation his firm established that HHS could not produce records of long-term, inert-placebo-controlled trials for many routine childhood vaccines. New vaccines are often tested against an older vaccine or an adjuvant-containing comparator rather than saline.",
    skeptic: {
      headline: "Without a true placebo arm, we can't cleanly separate vaccine effects from background noise.",
      points: [
        "An inert (saline) control is the gold standard everywhere else in medicine; vaccines shouldn't get a categorical exception.",
        "Comparing a new vaccine to an old vaccine or to the adjuvant alone can mask a shared adverse-event signal — if both arms cause the same harm, the trial reports 'no difference.'",
        "Long-term and chronic outcomes (autoimmune, neurodevelopmental) are rarely the primary endpoint and follow-up windows are often short.",
        "Transparency is the cheapest possible fix: if the data are as strong as claimed, rigorous trials would only confirm it and rebuild public trust.",
      ],
    },
    establishment: {
      headline: "Withholding a proven vaccine from children to create a placebo arm is itself unethical.",
      points: [
        "Once a vaccine is known to prevent a serious disease, a saline arm knowingly leaves children unprotected against (e.g.) measles or Hib — that fails clinical-equipoise ethics.",
        "Active-comparator and adjuvant controls are a deliberate, accepted design, not a cover-up; they isolate the antigen's specific effect.",
        "Safety is also tracked post-licensure at population scale (VAERS, VSD, large cohort and case-control studies) covering tens of millions of doses.",
        "As Paul Offit put it, a placebo trial would 'substitute a theoretical risk for a real risk' — the disease the vaccine prevents.",
      ],
    },
    commonGround:
      "Both sides claim to want the same thing: the most credible safety data possible. The honest disagreement is whether a saline arm is ethically permissible once efficacy is established — and whether observational data can substitute for a randomized control.",
  },
  {
    id: "liability",
    question: "Is the 1986 vaccine-injury liability shield good policy?",
    context:
      "The National Childhood Vaccine Injury Act (1986) routes most claims of vaccine injury through a no-fault compensation program (the 'Vaccine Court') funded by a per-dose excise tax, and largely shields manufacturers from ordinary product-liability suits.",
    skeptic: {
      headline: "Removing normal liability removes a powerful market incentive to keep improving safety.",
      points: [
        "In every other product category, lawsuits are a feedback loop that punishes unsafe design; vaccines are uniquely insulated from it.",
        "The compensation program is widely described by claimants as slow, adversarial, and capped — not the friendly backstop it was sold as.",
        "A manufacturer that cannot be sued has weaker incentives to fund the very long-term studies skeptics are asking for.",
        "'You must take this product, and you cannot sue the maker if it harms you' is a hard combination to defend on autonomy grounds.",
      ],
    },
    establishment: {
      headline: "The shield exists precisely so vaccines keep being made — and the injured still get paid.",
      points: [
        "In the mid-1980s litigation nearly drove every DTP maker out of the U.S. market; the Act was a rescue of supply, not a giveaway.",
        "The program is no-fault: a claimant doesn't have to prove negligence, and a published Injury Table presumes causation for listed events.",
        "It has paid out billions to genuinely injured people, often faster and with a lower burden of proof than a jury trial.",
        "Regulators (FDA/CDC), not the tort system, remain the primary safety check — and they can and do pull or restrict products.",
      ],
    },
    commonGround:
      "Almost everyone agrees the compensation program should be faster, better funded, and more transparent. The real split is whether liability immunity dulls the safety incentive or is the necessary price of a stable vaccine supply.",
  },
  {
    id: "mandates",
    question: "When (if ever) should vaccines be mandated?",
    context:
      "Siri's firm has built much of its practice on informed consent and on challenging school, employer, and military mandates as infringements of bodily autonomy.",
    skeptic: {
      headline: "A medical intervention given under coercion is not truly consented to.",
      points: [
        "Bodily autonomy and genuine informed consent are core ethical and constitutional values; 'comply or lose your job/school' is coercion, not a choice.",
        "Mandates concentrate a population-level decision into an individual body that bears 100% of any personal risk.",
        "One-size-fits-all rules ignore individual risk profiles, prior infection/immunity, and the specific disease's real-world threat to that person.",
        "Trust erodes fastest when people feel forced; persuasion scales better than mandates over the long run.",
      ],
    },
    establishment: {
      headline: "Contagion makes vaccination partly a decision about other people, not only yourself.",
      points: [
        "Herd immunity protects those who can't be vaccinated — infants, the immunocompromised, the elderly; an unvaccinated person's risk isn't only their own.",
        "Society already accepts narrow liberty limits to prevent harm to others (seatbelts, drunk-driving laws, food-safety rules).",
        "School requirements are long-standing and upheld in U.S. law (Jacobson v. Massachusetts, 1905), almost always with medical and often religious exemptions.",
        "Mandates have demonstrably eliminated or near-eliminated diseases (smallpox, measles pre-2000) that voluntary uptake alone did not.",
      ],
    },
    commonGround:
      "Both sides accept exemptions exist and that coercion has costs. The line-drawing fight is over how dangerous and how contagious a disease must be — and how good the vaccine must be at stopping transmission — before the collective interest outweighs individual choice.",
  },
  {
    id: "trust",
    question: "Can we trust the agencies and companies that make and approve vaccines?",
    context:
      "A recurring theme: regulatory 'capture,' revolving doors between industry and agencies, and pharma's funding of research and advertising.",
    skeptic: {
      headline: "The referees are too entangled with the players to be trusted blindly.",
      points: [
        "User-fee laws mean a large share of FDA's drug-review budget comes from the industry it regulates.",
        "Revolving-door careers between agencies, advisory committees, and manufacturers create real conflicts of interest.",
        "Pharma is a top advertiser and research funder, which can shape what gets studied, published, and amplified.",
        "Past failures (opioids, Vioxx) show that 'approved and marketed' is not the same as 'safe,' so deference should be earned, not assumed.",
      ],
    },
    establishment: {
      headline: "Distrust of institutions is healthy; replacing evidence with vibes is not.",
      points: [
        "Findings are replicated by independent groups across many countries with different funding and incentive structures, and converge.",
        "Conflict-of-interest rules, public advisory meetings, and post-market surveillance exist specifically to catch capture.",
        "'Follow the money' cuts both ways: anti-vaccine media, supplements, and litigation are also large, profit-driven industries.",
        "The fix for imperfect institutions is reform and transparency, not abandoning the scientific method that exposed those very failures.",
      ],
    },
    commonGround:
      "Conflicts of interest are real and worth policing aggressively. The disagreement is epistemic: does entanglement invalidate the evidence, or is convergent, independently-replicated data trustworthy despite imperfect institutions?",
  },
  {
    id: "schedule",
    question: "Is the childhood schedule studied as a whole — and where's the 'vaxxed vs. unvaxxed' study?",
    context:
      "Skeptics ask for a large, long-term study comparing fully-vaccinated to never-vaccinated children across all health outcomes. Each vaccine is studied, but the combined, cumulative schedule is harder to randomize.",
    skeptic: {
      headline: "We license vaccines one at a time but give them in combination — so study the combination.",
      points: [
        "Children receive many doses on a compressed timeline; interactions and cumulative effects deserve their own dedicated study.",
        "A prospective vaxxed-vs-unvaxxed cohort is feasible using populations that already decline vaccines, with no one being denied anything.",
        "Refusing to even run the study reads, to a skeptic, like fear of the answer.",
        "Chronic-disease rates in children have risen over the same decades the schedule expanded — that correlation deserves rigorous investigation, not dismissal.",
      ],
    },
    establishment: {
      headline: "A randomized 'never-vaccinated' arm is unethical, and the observational version is deeply confounded.",
      points: [
        "Randomizing children to zero vaccines knowingly exposes them to deadly preventable diseases.",
        "Families who decline vaccines differ systematically (income, health-seeking behavior, family size, healthcare access), confounding any naive comparison.",
        "Combination and concomitant-administration studies do exist, and 'antigen load' from the modern schedule is actually far lower than older vaccines despite more shots.",
        "Correlation with rising chronic disease is also explained by better diagnosis, awareness, diet, and environment — the schedule is one variable among many.",
      ],
    },
    commonGround:
      "Both sides agree the ideal would be airtight evidence on the cumulative schedule. The crux is methodological: is an ethical, un-confounded study of 'all vaccines vs. none' actually achievable — and if only observational data is possible, how much weight should it carry?",
  },
  {
    id: "polio",
    question: "Was Siri right to petition against specific vaccines (e.g., polio, hepatitis B)?",
    context:
      "Siri has filed petitions to pause or revoke approvals for particular vaccines, citing the testing concerns above. Critics call this reckless given the diseases involved.",
    skeptic: {
      headline: "A petition is a lawful demand for the underlying data, not a ban.",
      points: [
        "Filing a citizen petition forces an agency to show its evidentiary work on the record — that's how administrative accountability is supposed to function.",
        "Hepatitis B given at birth, for a disease mainly transmitted sexually or by needles, is a reasonable place to ask 'why this dose, this day?'",
        "Demanding to see the safety dossier is not the same as claiming the vaccine is unsafe; it's testing the claim that it's safe.",
        "If the data are strong, the petition fails on the merits and public confidence is strengthened.",
      ],
    },
    establishment: {
      headline: "Polio and hepatitis B are exactly the wrong vaccines to gamble with.",
      points: [
        "Polio paralyzed and killed huge numbers of children within living memory; the vaccine is one of the most validated interventions in history.",
        "Birth-dose hep B exists because some infected mothers are missed by screening, and infant infection becomes lifelong and can cause liver cancer.",
        "Even a petition that fails can chill uptake during the months it generates headlines — and falling coverage brings outbreaks back (e.g. measles).",
        "Reopening settled, overwhelming evidence imposes real-world risk for a largely rhetorical 'transparency' gain.",
      ],
    },
    commonGround:
      "Everyone agrees agencies should be able to defend their approvals with data. The disagreement is about cost: is the value of forcing that defense worth the coverage drop and outbreak risk that public challenges to flagship vaccines can cause?",
  },
];

function LensToggle({
  value,
  onChange,
}: {
  value: "both" | "skeptic" | "establishment";
  onChange: (v: "both" | "skeptic" | "establishment") => void;
}) {
  const opts: { v: "skeptic" | "both" | "establishment"; label: string }[] = [
    { v: "skeptic", label: "Skeptic" },
    { v: "both", label: "Both" },
    { v: "establishment", label: "Establishment" },
  ];
  return (
    <div className="inline-flex rounded-full border border-sage/25 bg-sage/5 p-0.5 dark:border-cream/10 dark:bg-cream/5">
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            value === o.v
              ? "bg-forest/15 text-forest dark:bg-cream/15 dark:text-cream"
              : "text-forest/50 hover:text-forest/80 dark:text-cream/50 dark:hover:text-cream/80"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ArgColumn({
  side,
  headline,
  points,
}: {
  side: "skeptic" | "establishment";
  headline: string;
  points: string[];
}) {
  const skeptic = side === "skeptic";
  return (
    <div
      className={`flex-1 rounded-2xl border p-5 sm:p-6 ${
        skeptic
          ? "border-soft-gold/25 bg-soft-gold/5 dark:border-soft-gold/20 dark:bg-soft-gold/8"
          : "border-sage/25 bg-sage/5 dark:border-sage/20 dark:bg-sage/8"
      }`}
    >
      <div
        className={`mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
          skeptic ? "text-soft-gold-dark dark:text-soft-gold-light" : "text-sage-dark dark:text-sage-light"
        }`}
      >
        <span>{skeptic ? "⚖️ The Skeptic's Steelman" : "🔬 The Establishment's Steelman"}</span>
      </div>
      <p className="font-[family-name:var(--font-cormorant-garamond)] text-lg font-semibold leading-snug text-forest dark:text-cream">
        {headline}
      </p>
      <ul className="mt-4 space-y-2.5">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-forest/75 dark:text-cream/75">
            <span className={skeptic ? "text-soft-gold" : "text-sage"}>•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const [lens, setLens] = useState<"both" | "skeptic" | "establishment">("both");

  return (
    <motion.section
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: Math.min(index * 0.05, 0.3) }}
      className="rounded-3xl border border-sage/15 bg-cream/40 p-6 backdrop-blur-sm dark:border-cream/8 dark:bg-[#0D1F0F]/40 sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="flex-1 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold leading-tight text-forest dark:text-cream sm:text-3xl">
          {topic.question}
        </h2>
        <LensToggle value={lens} onChange={setLens} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-forest/60 dark:text-cream/60">{topic.context}</p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row">
        {(lens === "both" || lens === "skeptic") && (
          <ArgColumn side="skeptic" headline={topic.skeptic.headline} points={topic.skeptic.points} />
        )}
        {(lens === "both" || lens === "establishment") && (
          <ArgColumn
            side="establishment"
            headline={topic.establishment.headline}
            points={topic.establishment.points}
          />
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-lavender/30 bg-lavender/8 p-4 dark:border-lavender/20 dark:bg-lavender/10">
        <p className="text-sm leading-relaxed text-forest/80 dark:text-cream/80">
          <span className="font-semibold text-lavender-dark dark:text-lavender-light">🌿 Common ground —&nbsp;</span>
          {topic.commonGround}
        </p>
      </div>
    </motion.section>
  );
}

const SOURCES = [
  {
    label: "Aaron Siri — written testimony, U.S. Senate (HSGAC)",
    url: "https://www.hsgac.senate.gov/wp-content/uploads/Siri-Testimony.pdf",
  },
  {
    label: "Fortune — RFK Jr.'s lawyer and the polio vaccine petition",
    url: "https://fortune.com/2024/12/13/rfk-jr-lawyer-fda-approval-polio-vaccine-aaron-siri-trump-health-human-services/",
  },
  {
    label: "CIDRAP — ACIP session coverage (mainstream public-health view)",
    url: "https://www.cidrap.umn.edu/childhood-vaccines/relatively-calm-afternoon-acip-session-still-cauldron-misinformation",
  },
  {
    label: "Siri & Glimstad LLP — firm bio (congressional witness record)",
    url: "https://www.congress.gov/118/meeting/house/117456/witnesses/HHRG-118-JU05-Bio-SiriEsqA-20240626.pdf",
  },
];

export default function VaccineDebatePage() {
  return (
    <main className="enchanted-bg min-h-screen px-4 pt-28 pb-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-widest text-forest/40 transition-colors hover:text-soft-gold dark:text-cream/40"
          >
            ← back home
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-soft-gold-dark dark:text-soft-gold-light">
            A steelman exercise
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold leading-tight text-forest dark:text-cream sm:text-5xl">
            Aaron Siri &amp; the Vaccine Debate
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-forest/70 dark:text-cream/70">
            Attorney <strong>Aaron Siri</strong> — managing partner of Siri &amp; Glimstad and the
            litigator behind much of the modern legal challenge to vaccine policy — has forced a set
            of genuinely hard questions into public view. This page tries to represent the{" "}
            <strong>strongest version</strong> of each side: the skeptic&apos;s case and the
            public-health establishment&apos;s case, side by side.
          </p>
        </motion.div>

        {/* Framing / disclaimer */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mt-8 rounded-2xl border border-soft-gold/25 bg-soft-gold/5 p-5 dark:border-soft-gold/20 dark:bg-soft-gold/8"
        >
          <p className="text-sm leading-relaxed text-forest/75 dark:text-cream/75">
            <strong className="text-forest dark:text-cream">How to read this.</strong> A{" "}
            <em>steelman</em> is the most charitable, strongest version of an argument — the one its
            smartest advocate would actually make. Presenting a steelman is{" "}
            <strong>not endorsing it</strong>. The aim here is to make both sides legible enough that
            you can disagree with the best version of each, not a caricature. This is an educational
            framing of a public policy debate, <strong>not medical advice</strong> — talk to your own
            clinician about your own decisions.
          </p>
        </motion.div>

        {/* Who is Aaron Siri */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="mt-6 rounded-2xl border border-sage/15 bg-cream/40 p-5 dark:border-cream/8 dark:bg-[#0D1F0F]/40 sm:p-6"
        >
          <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-xl font-bold text-forest dark:text-cream">
            Who is Aaron Siri?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-forest/70 dark:text-cream/70">
            Siri leads what is often described as the largest U.S. vaccine litigation practice that
            does <em>not</em> represent pharmaceutical companies. His firm works closely with the
            Informed Consent Action Network (ICAN), pursues FOIA suits for vaccine safety records, and
            has filed petitions to pause or revoke specific vaccine approvals. He is also associated
            with Robert F. Kennedy Jr. Supporters see a transparency crusader holding regulators
            accountable; critics see a litigator amplifying doubt about overwhelmingly validated
            vaccines. Both readings show up below — that&apos;s the point.
          </p>
        </motion.div>

        {/* Topics */}
        <div className="mt-10 space-y-8">
          {TOPICS.map((t, i) => (
            <TopicCard key={t.id} topic={t} index={i} />
          ))}
        </div>

        {/* Principles of good-faith debate */}
        <motion.div
          {...fadeUp}
          className="mt-12 rounded-3xl border border-lavender/25 bg-lavender/8 p-6 dark:border-lavender/15 dark:bg-lavender/10 sm:p-8"
        >
          <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-bold text-forest dark:text-cream">
            Ground rules for thinking about this well
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-forest/75 dark:text-cream/75">
            <li>
              <strong>Separate the question from the person.</strong> &quot;Is this study well-designed?&quot;
              is a different question from &quot;Do I like who&apos;s asking?&quot;
            </li>
            <li>
              <strong>Steelman before you strike.</strong> If you can&apos;t state the other side&apos;s
              argument well enough that they&apos;d agree with your summary, you&apos;re not ready to rebut it.
            </li>
            <li>
              <strong>Distinguish &quot;we lack data&quot; from &quot;the data show harm.&quot;</strong> They are very
              different claims and require very different responses.
            </li>
            <li>
              <strong>Notice the asymmetry of risk.</strong> Both action and inaction carry real,
              non-zero consequences for real children. There is no risk-free option to retreat to.
            </li>
            <li>
              <strong>Follow incentives on every side.</strong> Pharma, agencies, litigators,
              and anti-vaccine media all have money and status at stake.
            </li>
          </ul>
        </motion.div>

        {/* Sources */}
        <motion.div {...fadeUp} className="mt-10">
          <h2 className="font-[family-name:var(--font-cormorant-garamond)] text-xl font-bold text-forest dark:text-cream">
            Sources &amp; further reading
          </h2>
          <ul className="mt-3 space-y-2">
            {SOURCES.map((s) => (
              <li key={s.url} className="text-sm">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-soft-gold-dark underline decoration-soft-gold/40 underline-offset-2 transition-colors hover:text-soft-gold dark:text-soft-gold-light"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-forest/45 dark:text-cream/45">
            Sources span the spectrum on purpose, including Siri&apos;s own testimony and outlets
            critical of him. Read them directly and form your own view. Quotes and characterizations
            are paraphrased for brevity — follow the links for the primary material.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
