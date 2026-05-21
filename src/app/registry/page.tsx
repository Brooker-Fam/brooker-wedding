"use client";

import { motion } from "framer-motion";
import HeartGarland from "@/components/HeartGarland";

export default function RegistryPage() {
  return (
    <div className="enchanted-bg relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <HeartGarland size="lg" className="mb-5" />
          <h1 className="fairy-sparkle font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold text-forest dark:text-cream sm:text-5xl">
            Registry
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-3xl border border-soft-gold/20 bg-warm-white/75 px-6 py-8 text-center shadow-[0_10px_40px_rgba(196,154,60,0.1)] backdrop-blur-sm dark:border-soft-gold/15 dark:bg-[#162618]/70 dark:shadow-[0_10px_40px_rgba(0,0,0,0.22)] sm:px-10 sm:py-10"
        >
          <p className="mb-4 text-sm font-medium tracking-[0.22em] text-soft-gold/70 uppercase sm:text-base">
            For Those Who Have Asked
          </p>
          <p className="text-base leading-relaxed text-forest/75 dark:text-cream/75 sm:text-lg">
            Here is our registry.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-forest/65 dark:text-cream/70 sm:text-base">
            Please know that we are not expecting any gifts. Your presence to celebrate with us is truly all we need, and we feel so grateful to share this day with you.
          </p>

          <div className="mt-8">
            <a
              href="https://www.zola.com/registry/brittanybrooker"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-xl bg-soft-gold px-8 py-3.5 text-base font-semibold text-[#2A1A00] shadow-md transition-all hover:bg-soft-gold-dark hover:shadow-lg"
            >
              View Our Registry
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
