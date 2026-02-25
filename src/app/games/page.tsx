"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface GameCard {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  icon: string;
  path: string;
  scoreKey: string;
}

const GAMES: GameCard[] = [
  {
    id: "egg-catcher",
    title: "Egg Catcher",
    description: "Catch the farm-fresh eggs before they fall!",
    difficulty: 2,
    icon: "🥚",
    path: "/games/egg-catcher",
    scoreKey: "eggCatcher_highScore",
  },
  {
    id: "farm-defense",
    title: "Farm Defense",
    description: "Protect the coop from sneaky visitors!",
    difficulty: 4,
    icon: "🏡",
    path: "/games/farm-defense",
    scoreKey: "farmDefense_highScore",
  },
  {
    id: "duck-duck-goose",
    title: "Duck Duck Goose",
    description: "A classic game with a farm twist!",
    difficulty: 3,
    icon: "🦆",
    path: "/games/duck-duck-goose",
    scoreKey: "duckDuckGoose_highScore",
  },
  {
    id: "unicorn-taekwondo",
    title: "Unicorn TKD",
    description: "Sparkle kicks and rainbow combos!",
    difficulty: 2,
    icon: "🦄",
    path: "/games/unicorn-taekwondo",
    scoreKey: "unicornTKD_highScore",
  },
  {
    id: "yoga-goat",
    title: "Yoga Goat",
    description: "Find your inner baa-lance!",
    difficulty: 3,
    icon: "🐐",
    path: "/games/yoga-goat",
    scoreKey: "yogaGoat_highScore",
  },
  {
    id: "barn-cat-ninja",
    title: "Barn Cat Ninja",
    description: "Swipe, swat, and score!",
    difficulty: 3,
    icon: "🐱",
    path: "/games/barn-cat-ninja",
    scoreKey: "barnCatNinja_highScore",
  },
  {
    id: "zoes-adventure",
    title: "Zoe's Adventure",
    description: "Run, jump, and collect treats with Zoe!",
    difficulty: 3,
    icon: "🐕",
    path: "/games/zoes-adventure",
    scoreKey: "zoesAdventure_highScore",
  },
  {
    id: "cake-creator",
    title: "Cake Creator",
    description: "Decorate cakes for wedding guests!",
    difficulty: 2,
    icon: "🎂",
    path: "/games/cake-creator",
    scoreKey: "cakeCreator_highScore",
  },
  {
    id: "here-comes-the-bride",
    title: "Here Comes the Bride",
    description: "Walk down the aisle with perfect timing!",
    difficulty: 2,
    icon: "👰",
    path: "/games/here-comes-the-bride",
    scoreKey: "hereComesTheBride_highScore",
  },
];

function DifficultyDots({ count }: { count: number }) {
  return (
    <span className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            i <= count ? "bg-soft-gold" : "bg-deep-plum/10 dark:bg-cream/10"
          }`}
        />
      ))}
    </span>
  );
}

export default function GamesArcadePage() {
  const [highScores, setHighScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const scores: Record<string, number> = {};
    GAMES.forEach((g) => {
      const s = localStorage.getItem(g.scoreKey);
      if (s) scores[g.scoreKey] = parseInt(s, 10);
    });
    setHighScores(scores);
  }, []);

  return (
    <div className="enchanted-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 text-sm font-medium tracking-widest text-lavender uppercase dark:text-lavender-light">
            A Little Fun to Celebrate
          </div>
          <h1 className="font-[family-name:var(--font-cormorant-garant)] text-4xl font-semibold text-forest dark:text-cream sm:text-5xl">
            Fun & Games
          </h1>
          <p className="mt-4 text-base text-deep-plum/60 dark:text-cream/60">
            Play a few games while you&apos;re here! Just for fun.
          </p>

          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-lavender/40 dark:bg-lavender/25" />
            <span className="text-lavender/50 dark:text-lavender/35">&#10022;</span>
            <div className="h-px w-16 bg-lavender/40 dark:bg-lavender/25" />
          </div>
        </motion.div>

        {/* Game Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game, index) => {
            const hs = highScores[game.scoreKey];
            const isAvailable = [
              "duck-duck-goose",
              "unicorn-taekwondo",
              "yoga-goat",
              "barn-cat-ninja",
              "zoes-adventure",
              "cake-creator",
              "here-comes-the-bride",
            ].includes(game.id);

            const card = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
                whileHover={isAvailable ? { y: -6 } : {}}
                className={`soft-card relative p-5 transition-all ${
                  isAvailable
                    ? "cursor-pointer hover:shadow-md"
                    : "opacity-60"
                }`}
              >
                {!isAvailable && (
                  <span className="absolute top-3 right-3 rounded-full bg-lavender/15 px-2.5 py-0.5 text-[10px] font-medium text-lavender">
                    Coming Soon
                  </span>
                )}

                {/* Icon */}
                <div className="mb-3 text-center text-4xl">{game.icon}</div>

                {/* Title */}
                <h3 className="text-center font-[family-name:var(--font-cormorant-garant)] text-xl font-semibold text-deep-plum dark:text-cream">
                  {game.title}
                </h3>

                {/* Description */}
                <p className="mt-1 text-center text-sm text-deep-plum/60 dark:text-cream/60">
                  {game.description}
                </p>

                {/* Difficulty */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-xs text-deep-plum/55 dark:text-cream/55">
                    Difficulty
                  </span>
                  <DifficultyDots count={game.difficulty} />
                </div>

                {/* High Score */}
                {hs !== undefined && (
                  <div className="mt-2 text-center text-xs font-medium text-soft-gold">
                    Best: {hs.toLocaleString()}
                  </div>
                )}

                {/* Play button */}
                {isAvailable && (
                  <div className="mt-4 flex items-center justify-center rounded-xl bg-soft-gold py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-soft-gold-dark" style={{ minHeight: 44 }}>
                    Play
                  </div>
                )}
              </motion.div>
            );

            if (isAvailable) {
              return (
                <Link key={game.id} href={game.path} className="block">
                  {card}
                </Link>
              );
            }

            return <div key={game.id}>{card}</div>;
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-sage/55 dark:text-sage-light/55">
          Matt & Brittany &middot; June 27, 2026
        </div>
      </div>
    </div>
  );
}
