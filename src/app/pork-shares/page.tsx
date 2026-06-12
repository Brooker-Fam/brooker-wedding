"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sharePrices = [
  {
    share: "Whole hog",
    price: "$7.75/lb hanging weight",
    estimate: "~300 lb hanging / ~$2,325",
    deposit: "$300 deposit",
  },
  {
    share: "Half hog",
    price: "$8.50/lb hanging weight",
    estimate: "~150 lb hanging / ~$1,275",
    deposit: "$175 deposit",
  },
  {
    share: "Quarter hog",
    price: "$9.25/lb hanging weight",
    estimate: "~75 lb hanging / ~$694",
    deposit: "$100 deposit",
  },
];

const cutSections = [
  {
    section: "Shoulder",
    options: "Picnic roasts, Boston butt roasts, shoulder chops, shoulder bacon, or ground pork.",
    default: "Fresh bone-in roasts for slow cooking.",
  },
  {
    section: "Loin & Rib",
    options: "Tenderloin, bone-in or boneless chops, loin roasts, Canadian bacon, country-style ribs, baby back ribs, spare ribs, riblets, St. Louis ribs, stew, or grind.",
    default: "1-inch bone-in chops with ribs kept whole.",
  },
  {
    section: "Sirloin",
    options: "Fresh chops, smoked chops, sirloin cutlets, roasts, boneless roasts, or grind.",
    default: "Cutlets or a small roast.",
  },
  {
    section: "Hams",
    options: "Fresh ham, smoked ham, ham steaks, sliced ham, boneless ham, cutlets, kabobs, trim, or grind.",
    default: "No-nitrate smoked ham steaks.",
  },
  {
    section: "Bacon & Belly",
    options: "Smoked sliced bacon, no-nitrate bacon, slab bacon, fresh belly slabs, skin-on belly, skinless belly, or grind.",
    default: "No-nitrate smoked sliced bacon.",
  },
  {
    section: "Sausage",
    options: "Breakfast, sweet Italian, hot Italian, chorizo, bratwurst, maple breakfast, andouille, hot dogs, kielbasa, or ground pork.",
    default: "Breakfast bulk plus sweet Italian links.",
  },
  {
    section: "Bones, Lard & Offal",
    options: "Heart, liver, tongue, kidneys, leaf lard, fat back, caul fat, jowls, soup bones, neck bones, hocks, feet/trotters, head, ears, skin, tail, or snout.",
    default: "Opt-in only: leaf lard, soup bones, hocks, heart/liver/tongue.",
  },
];

const notes = [
  "Prices are all-in base estimates using a 300 lb hanging-weight assumption and Eagle Bridge Custom Meat's current butcher pricing.",
  "Final totals depend on certified hanging weight and final cut choices.",
  "Smoking, no-nitrate curing, links, hot dogs, and specialty sausage add cost; we can either pass those through at cost or collect an added smoke-and-sausage allowance.",
  "Plan on roughly 50-75% of hanging weight as take-home pork, depending on bone-in cuts, smoking, trim, and offal choices.",
];

export default function PorkSharesPage() {
  return (
    <div className="creekside-page min-h-screen px-4 pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="field-tag justify-center">Pork Shares</p>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-semibold leading-tight text-[#26351F] dark:text-[#F5EAD8] sm:text-7xl">
            Choose your share, then choose the cuts that feed your home best.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#405034] dark:text-[#E6DCC8]/76">
            Our heritage pigs are pasture-raised for about 18 months, so we price
            them as premium, slow-grown pork with butcher costs built into the
            estimate.
          </p>
        </motion.header>

        <div className="root-divider my-12" />

        <section className="grid gap-5 md:grid-cols-3">
          {sharePrices.map((item) => (
            <article key={item.share} className="moss-card p-7">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#26351F] dark:text-[#F5EAD8]">
                {item.share}
              </h2>
              <p className="mt-4 text-2xl font-semibold text-[#8A6A2D] dark:text-[#D5B66B]">
                {item.price}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#4A5638] dark:text-[#E6DCC8]/72">
                {item.estimate}
              </p>
              <p className="mt-2 text-sm font-semibold text-[#405034] dark:text-[#E6DCC8]/82">
                {item.deposit}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-14">
          <div className="mb-7 max-w-3xl">
            <p className="field-tag">Cut Sheet Options</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold text-[#26351F] dark:text-[#F5EAD8] sm:text-5xl">
              What the butcher can make from your share.
            </h2>
          </div>

          <div className="grid gap-4">
            {cutSections.map((cut) => (
              <article key={cut.section} className="moss-card p-6">
                <div className="grid gap-4 md:grid-cols-[0.24fr_0.5fr_0.26fr] md:items-start">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#26351F] dark:text-[#F5EAD8]">
                    {cut.section}
                  </h3>
                  <p className="leading-7 text-[#4A5638] dark:text-[#E6DCC8]/72">
                    {cut.options}
                  </p>
                  <p className="rounded-md bg-[#53633B]/10 px-4 py-3 text-sm leading-6 text-[#405034] dark:bg-[#D5B66B]/10 dark:text-[#E6DCC8]/76">
                    <span className="font-semibold">Suggested default:</span>{" "}
                    {cut.default}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-start">
          <div className="moss-card p-7 sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#26351F] dark:text-[#F5EAD8]">
              Pricing Notes
            </h2>
            <div className="mt-5 space-y-4">
              {notes.map((note) => (
                <p key={note} className="leading-7 text-[#4A5638] dark:text-[#E6DCC8]/72">
                  {note}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#68764D]/20 bg-[#25331F] p-7 text-[#F7EBD5] shadow-[0_18px_48px_rgba(37,51,31,0.22)]">
            <p className="field-tag text-[#D5B66B]">Reserve</p>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold">
              Ask about the next finished hog.
            </h2>
            <p className="mt-4 leading-7 text-[#E6DCC8]/82">
              We will confirm timing, share size, cut preferences, and whether
              you want smoked or no-nitrate options.
            </p>
            <Link
              href="mailto:brookerhousehold@gmail.com?subject=Creekside%20Fields%20pork%20share"
              className="mt-7 inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#D5B66B]/30 bg-[#C49A3C] px-8 py-3 text-sm font-semibold text-[#172015] shadow-[0_4px_15px_rgba(0,0,0,0.16)] transition-all hover:bg-[#D5B66B]"
            >
              Reserve a Share
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
