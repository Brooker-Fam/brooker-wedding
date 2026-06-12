"use client";

import { motion } from "framer-motion";
import PixelButton from "@/components/PixelButton";

const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const careNotes = [
  "Pasture to root through, shade to rest under, clean water every day.",
  "Heritage pigs raised slowly, with patience and a steady hand.",
  "Small batches, seasonal availability, and food with a sense of place.",
];

const principles = [
  {
    title: "Mossy",
    body: "The farm is soft around the edges: creek banks, shade, old boards, wet grass, and the quiet green of things growing back.",
  },
  {
    title: "Grounded",
    body: "We keep the work close to the soil. Good feed, sturdy shelter, rotational pasture, and daily care come before everything else.",
  },
  {
    title: "Nurturing",
    body: "These animals are not anonymous to us. We raise them with attention, gratitude, and the kind of care small farms are made for.",
  },
];

export default function Home() {
  return (
    <div className="creekside-page relative min-h-screen overflow-hidden">
      <section className="creekside-hero relative flex min-h-screen flex-col justify-center overflow-hidden">
        <div className="creekside-hero-photo absolute inset-0" aria-hidden="true" />
        <div className="creekside-hero-veil absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="creekside-hero-copy max-w-3xl"
          >
            <p className="field-tag mb-5 text-[#D7C186]">Creekside Fields</p>
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold leading-[0.95] text-[#FFF7E8] sm:text-7xl md:text-8xl">
              Heritage pigs raised with tenderness and room to root.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#F1E5CC]/88 sm:text-xl">
              A small, soulful farm in Greenwich, New York, raising pasture pork
              with love, patience, moss underfoot, and deep respect for the
              animals in our care.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <PixelButton href="/pork-shares" size="lg">
                Reserve Pork
              </PixelButton>
              <PixelButton href="/details" variant="secondary" size="lg">
                Our Care Practices
              </PixelButton>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="creekside-hero-note p-6 sm:p-8"
          >
            <p className="field-tag text-[0.68rem]">From The Pasture</p>
            <div className="mt-5 space-y-5">
              {careNotes.map((note) => (
                <p
                  key={note}
                  className="border-b border-[#D7C186]/18 pb-5 text-base leading-7 text-[#F1E5CC]/82 last:border-0 last:pb-0"
                >
                  {note}
                </p>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:py-24">
        <div className="root-divider mb-12" />
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.6 }}
            className="field-tag justify-center"
          >
            Whimsical by nature
          </motion.p>
          <motion.h2
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto mt-5 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight text-[#26351F] dark:text-[#F5EAD8] sm:text-6xl"
          >
            A farm can be practical and still have a little hush, wonder, and soul.
          </motion.h2>
          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#4D5B3B] dark:text-[#E6DCC8]/76"
          >
            Creekside Fields is built around care: for the pigs, for the pasture,
            for the creekside ground that holds us, and for the families who
            bring this food to their tables.
          </motion.p>
        </div>
      </section>

      <section className="creekside-band px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {principles.map((principle, index) => (
            <motion.article
              key={principle.title}
              {...fadeInUp}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="moss-card p-7"
            >
              <p className="mb-4 text-xs font-semibold tracking-[0.24em] text-[#8A6A2D] uppercase dark:text-[#C9A24C]">
                0{index + 1}
              </p>
              <h3 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#26351F] dark:text-[#F5EAD8]">
                {principle.title}
              </h3>
              <p className="mt-4 leading-7 text-[#4A5638] dark:text-[#E6DCC8]/72">
                {principle.body}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <motion.div {...fadeInUp} transition={{ duration: 0.6 }}>
            <p className="field-tag">The Creekside Way</p>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight text-[#26351F] dark:text-[#F5EAD8] sm:text-5xl">
              Food that comes from care should feel cared for.
            </h2>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="space-y-6 text-base leading-8 text-[#405034] dark:text-[#E6DCC8]/76 sm:text-lg"
          >
            <p>
              Our pigs live outside where the ground changes with the weather and
              the seasons. They root, graze, nap in the shade, nose through hay,
              and settle into the steady rhythms of pasture life.
            </p>
            <p>
              We choose heritage pigs because they belong to slower food and
              smaller farms. They take more time, but time is part of the flavor:
              richer pork, better texture, and a life raised with intention.
            </p>
            <p>
              Pork is available seasonally by reservation. Send us a note about
              cuts, sausage, whole or half hog shares, or what might be ready
              next.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="creekside-cta px-4 py-16 text-[#F7EBD5] sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="field-tag text-[#D5B66B]">Greenwich, New York</p>
            <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight sm:text-5xl">
              Heritage pork from a mossy little farm with a very big heart.
            </h2>
          </div>
          <PixelButton href="mailto:brookerhousehold@gmail.com?subject=Creekside%20Fields%20farm%20inquiry" variant="primary" size="lg">
            Get In Touch
          </PixelButton>
        </div>
      </section>

      <footer className="relative bg-[#DCC9A8]/50 px-4 py-10 dark:bg-[#071207]/80">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#26351F] dark:text-[#F5EAD8]">
            Creekside Fields
          </p>
          <p className="mt-2 text-sm text-[#4D5B3B] dark:text-[#E6DCC8]/68">
            Whimsical, mossy, grounded, soulful, nurturing.
          </p>
          <a
            href="mailto:brookerhousehold@gmail.com"
            className="mt-4 inline-block text-sm font-semibold text-[#8A6A2D] transition-colors hover:text-[#5E461C] dark:text-[#D5B66B]"
          >
            brookerhousehold@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
