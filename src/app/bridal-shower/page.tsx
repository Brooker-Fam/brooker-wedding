"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import HeartGarland from "@/components/HeartGarland";

export default function BridalShowerPage() {
  return (
    <div className="enchanted-bg relative min-h-screen overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <HeartGarland size="lg" className="mb-5" />
          <h1 className="fairy-sparkle font-[family-name:var(--font-cormorant-garamond)] text-4xl font-bold text-forest dark:text-cream sm:text-5xl">
            Bridal Shower
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-soft-gold/20 bg-warm-white/75 px-6 py-8 text-center shadow-[0_10px_40px_rgba(196,154,60,0.1)] backdrop-blur-sm dark:border-soft-gold/15 dark:bg-[#162618]/70 dark:shadow-[0_10px_40px_rgba(0,0,0,0.22)] sm:px-10 sm:py-10"
        >
          <p className="text-sm leading-relaxed text-forest/75 dark:text-cream/75 sm:text-base">
            Brittany&apos;s Mom, Jane Woolley, is hosting a Bridal Shower Ladies&apos; Luncheon at New Hope Community Church in Queensbury on Sunday May 31st at 2:30 pm for ladies ages 12 and up. Please RSVP by text to Jane at 518-369-0844 by May 20. We hope to see you there!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-soft-gold/20 bg-warm-white/75 p-4 shadow-[0_10px_40px_rgba(196,154,60,0.1)] backdrop-blur-sm dark:border-soft-gold/15 dark:bg-[#162618]/70 dark:shadow-[0_10px_40px_rgba(0,0,0,0.22)] sm:p-6"
        >
          <Image
            src="/brittbridalshower.jpg"
            alt="Brittany Brooker bridal shower invitation"
            width={1362}
            height={2048}
            className="h-auto w-full rounded-2xl"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
