"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const chapters = [
  {
    title: "How We Met",
    content:
      "Two people crossed paths in the most unexpected way. Sometimes the best things in life are the ones you never saw coming.",
    year: "The Beginning",
    side: "left" as const,
  },
  {
    title: "Falling in Love",
    content:
      "Late night conversations that turned into early mornings. Shared adventures and quiet moments. They quickly realized they had found something rare and beautiful.",
    year: "The Love Story",
    side: "right" as const,
  },
  {
    title: "Becoming a Family",
    content:
      "When Brittany came into Matt's life, she also came into the lives of Emmett (now 11) and Sapphire (now 8). What started as new friendships blossomed into a family full of laughter, love, and a little bit of beautiful chaos.",
    year: "Our Greatest Joy",
    side: "left" as const,
  },
  {
    title: "Life on the Farm",
    content:
      "They found their dream -- a farm full of life, from chickens and ducks to guardian dogs and curious cats. Every sunrise brings new adventures on the homestead.",
    year: "Our Happy Place",
    side: "right" as const,
  },
  {
    title: "The Proposal",
    content:
      "After years of building a life together, the question was asked and the answer was an immediate, joyful yes. The next chapter was about to begin.",
    year: "Forever Starts",
    side: "left" as const,
  },
  {
    title: "We Got Married!",
    content:
      "On January 1, 2026, Matt & Brittany made it official and tied the knot. A perfect way to start the new year and the rest of their lives together.",
    year: "January 1, 2026",
    side: "right" as const,
  },
  {
    title: "The Celebration",
    content:
      "Now it's time to party! Matt & Brittany are gathering everyone they love for a wedding celebration on our farm. Great food, fun games, and the best company. This is the chapter we've been dreaming about.",
    year: "June 27, 2026",
    side: "left" as const,
  },
];

const animalGroups = [
  {
    category: "The Dogs",
    animals: [
      {
        name: "Guardian Dogs",
        type: "Livestock Guardian Dogs",
        description: "Gentle giants who watch over the farm with quiet devotion. Their warm eyes and soft hearts make them everyone's favorite welcome committee.",
        emoji: "🐕",
      },
      {
        name: "The Couch Cuddler",
        type: "House Dog",
        description: "Chief of comfort, master of the living room. Greets every guest with maximum enthusiasm and unconditional love.",
        emoji: "🐶",
      },
    ],
  },
  {
    category: "The Cats",
    animals: [
      {
        name: "The Barn Cats",
        type: "Barn Cats",
        description: "Silent and swift, they appear when you least expect them. Masters of their domain, keeping the barn safe from any uninvited visitors.",
        emoji: "🐈",
      },
      {
        name: "The Indoor Royalty",
        type: "House Cats",
        description: "They run the house and everyone knows it. Experts in finding the coziest spot and supervising all household activities.",
        emoji: "🐱",
      },
    ],
  },
  {
    category: "The Birds",
    animals: [
      {
        name: "Guinea Hens",
        type: "The Watchful Ones",
        description: "Nothing gets past these alert sentinels. If something is happening on the farm, you will hear about it.",
        emoji: "🐔",
      },
      {
        name: "Ducks",
        type: "The Pond Lovers",
        description: "Happy waddlers who spend their days splashing about and looking absolutely adorable doing it.",
        emoji: "🦆",
      },
      {
        name: "Geese",
        type: "The Loud Greeters",
        description: "Approach with respect and a friendly wave. They take their welcoming duties very seriously. Honk!",
        emoji: "🪿",
      },
      {
        name: "Chickens",
        type: "The Breakfast Providers",
        description: "The heart of the farm. Fresh eggs every morning, happy clucking all day long, living their very best life.",
        emoji: "🐓",
      },
    ],
  },
];

export default function StoryPage() {
  return (
    <div className="enchanted-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="mb-3 text-sm font-medium tracking-widest text-sage uppercase dark:text-sage-light">
            Matt & Brittany
          </div>
          <h1 className="font-[family-name:var(--font-cormorant-garant)] text-4xl font-semibold text-forest dark:text-cream sm:text-5xl md:text-6xl">
            Our Story
          </h1>
          <p className="mt-4 text-base text-deep-plum/60 dark:text-cream/60">
            A love story written in laughter, farm dirt, and quiet moments.
          </p>

          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-sage/40 dark:bg-sage/25" />
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-sage/60 dark:text-sage/40">
              <path d="M10 2 C10 2, 4 8, 10 14 C16 8, 10 2, 10 2Z" fill="currentColor" />
              <line x1="10" y1="14" x2="10" y2="18" stroke="currentColor" strokeWidth="1" />
            </svg>
            <div className="h-px w-16 bg-sage/40 dark:bg-sage/25" />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line - visible on sm+ */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-sage/40 via-lavender/30 to-soft-gold/40 dark:from-sage/25 dark:via-lavender/20 dark:to-soft-gold/25 sm:block" />

          <div className="space-y-8 sm:space-y-12">
            {chapters.map((chapter, i) => {
              const isLeft = chapter.side === "left";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 top-8 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-cream bg-sage shadow-sm dark:border-[#0D1F0F] dark:bg-soft-gold sm:block" />

                  {/* Card */}
                  <div
                    className={`sm:w-[calc(50%-2rem)] ${
                      isLeft ? "sm:mr-auto sm:pr-0" : "sm:ml-auto sm:pl-0"
                    }`}
                  >
                    <div className="soft-card p-5 transition-shadow hover:shadow-md sm:p-6">
                      {/* Year badge */}
                      <span className="inline-block rounded-full bg-sage/10 px-3 py-1 text-xs font-medium text-sage dark:bg-sage/15 dark:text-sage-light">
                        {chapter.year}
                      </span>

                      <h2 className="mt-3 font-[family-name:var(--font-cormorant-garant)] text-2xl font-semibold text-forest dark:text-cream">
                        {chapter.title}
                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-deep-plum/70 dark:text-cream/70">
                        {chapter.content}
                      </p>

                      {/* Photo placeholder */}
                      <div className="mt-4 flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-sage/20 bg-sage/5 dark:border-sage/15 dark:bg-sage/8">
                        <div className="text-center">
                          <svg className="mx-auto h-8 w-8 text-sage/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                          <p className="mt-2 text-xs text-sage/55 dark:text-sage-light/55">
                            Photo coming soon
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Our Farm Family */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="mb-10 text-center">
            <div className="mb-3 text-sm font-medium tracking-widest text-soft-gold uppercase dark:text-soft-gold-light">
              The ones who live here
            </div>
            <h2 className="font-[family-name:var(--font-cormorant-garant)] text-3xl font-semibold text-forest dark:text-cream sm:text-4xl">
              Our Farm Family
            </h2>
            <p className="mt-3 text-sm text-deep-plum/60 dark:text-cream/60">
              Every member of the farm has a story and a personality all their own.
            </p>

            <div className="mx-auto mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-soft-gold/30" />
              <span className="text-soft-gold/50">&#10045;</span>
              <div className="h-px w-12 bg-soft-gold/30" />
            </div>
          </div>

          {animalGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: gi * 0.1 }}
              className="mb-8"
            >
              <h3 className="mb-4 font-[family-name:var(--font-cormorant-garant)] text-xl font-semibold text-deep-plum/80 dark:text-cream/80">
                {group.category}
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {group.animals.map((animal, ai) => (
                  <motion.div
                    key={animal.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: ai * 0.05, duration: 0.4 }}
                    whileHover={{ y: -4 }}
                    className="soft-card p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-soft-gold/10 text-2xl dark:bg-soft-gold/15">
                        {animal.emoji}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-deep-plum dark:text-cream">
                          {animal.name}
                        </h4>
                        <p className="text-xs text-soft-gold">
                          {animal.type}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-deep-plum/70 dark:text-cream/70">
                      {animal.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="soft-card mx-auto max-w-md p-8">
            <p className="font-[family-name:var(--font-cormorant-garant)] text-2xl font-semibold text-forest dark:text-cream">
              Come Celebrate With Us
            </p>
            <p className="mt-3 text-sm text-deep-plum/60 dark:text-cream/60">
              We got married! Now join us on our farm June 27, 2026 to celebrate.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/rsvp"
                className="flex min-h-[44px] items-center justify-center rounded-xl bg-soft-gold px-6 py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-soft-gold-dark hover:shadow-lg"
              >
                RSVP Now
              </Link>
              <Link
                href="/details"
                className="flex min-h-[44px] items-center justify-center rounded-xl border border-sage/30 px-6 py-3 text-center text-sm font-medium text-deep-plum transition-all hover:bg-sage/10 dark:border-sage/40 dark:text-cream dark:hover:bg-sage/20"
              >
                View Details
              </Link>
            </div>
          </div>
          <p className="mt-6 text-sm text-sage/55 dark:text-sage-light/55">
            June 27, 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
