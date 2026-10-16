import Link from "next/link";
import FarmScene from "@/components/FarmScene";
import MemoryTable, { PRINTS_ON_TABLE } from "@/components/home/MemoryTable";
import { getCelebrationMemories } from "@/lib/celebration";

export const revalidate = 600;

const MILESTONES = [
  {
    date: "Thanksgiving 2025",
    title: "The proposal",
    body: "In the woods at New Skete Monastery, Matt sang, played the mandolin, and read Brittany a poem he wrote for her. Then he asked. She said yes, and we stayed for a service at the monastery.",
  },
  {
    daysLater: 35,
    date: "January 1, 2026",
    title: "The wedding",
    body: "We couldn’t wait, so we planned a winter wedding in five weeks and said our vows with our 20 closest loved ones.",
  },
  {
    daysLater: 177,
    date: "June 27, 2026",
    title: "The celebration",
    body: "Then we celebrated with everyone on our farm: a ceremony in the field, tables under the tent, cake, and a fire after dark.",
  },
];

const display = "font-[family-name:var(--font-cormorant-garamond)]";

function HowWeGotHere() {
  return (
    <section className="px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
      <div className="mx-auto max-w-2xl">
        <h2 className={`${display} text-4xl font-semibold text-forest dark:text-cream sm:text-5xl`}>
          How we got here
        </h2>
        <ol className="mt-10 ml-1.5 border-l border-sage/35 dark:border-sage-light/30">
          {MILESTONES.map((m) => (
            <li key={m.date} className="pl-8 sm:pl-10">
              {m.daysLater && (
                <p className={`${display} pt-1 pb-8 text-xl font-medium text-sage italic dark:text-sage-light`}>
                  {m.daysLater} days later
                </p>
              )}
              <div className="relative pb-2">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-[calc(2rem+7.5px)] h-3.5 w-3.5 rounded-full border-2 border-soft-gold bg-cream sm:-left-[calc(2.5rem+7.5px)] dark:bg-dark-bg"
                />
                <p className={`${display} text-xl text-gold-dark italic dark:text-soft-gold-light`}>{m.date}</p>
                <h3 className={`${display} mt-1 text-3xl font-semibold text-forest dark:text-cream`}>{m.title}</h3>
                <p className="mt-3 max-w-[60ch] text-[1.0625rem] leading-relaxed text-pretty text-forest/75 dark:text-cream/75">
                  {m.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ReliveTheDay({ photoCount, songCount }: { photoCount: number; songCount: number }) {
  const rows = [
    {
      href: "/photos",
      title: "The album",
      body: `${photoCount > 0 ? `${photoCount} photos and videos` : "Photos and videos"} from the day. Add the ones still on your phone, or download the whole album.`,
    },
    {
      href: "/songs",
      title: "The playlist",
      body: `The ${songCount > 0 ? `${songCount} ` : ""}songs you asked for, plus the playlists from the day.`,
    },
    {
      href: "/games",
      title: "The party games",
      body: "Egg Catcher, Yoga Goat, Zoe’s Adventure, and the rest are still here to play.",
    },
  ];

  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto max-w-2xl">
        <h2 className={`${display} text-4xl font-semibold text-forest dark:text-cream sm:text-5xl`}>
          Relive the day
        </h2>
        <ul className="mt-8 border-t border-sage/25 dark:border-cream/15">
          {rows.map((row) => (
            <li
              key={row.href}
              className="group relative grid items-baseline gap-1 border-b border-sage/25 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8 dark:border-cream/15"
            >
              <Link
                href={row.href}
                className={`${display} text-3xl font-semibold text-forest transition-colors group-hover:text-gold-dark after:absolute after:inset-y-0 after:-inset-x-3 focus-visible:outline-none focus-visible:after:rounded-sm focus-visible:after:outline-2 focus-visible:after:outline-soft-gold dark:text-cream dark:group-hover:text-soft-gold-light`}
              >
                {row.title}
              </Link>
              <p className="text-[1.0625rem] leading-relaxed text-pretty text-forest/75 dark:text-cream/75">{row.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const MAPLE_DUE = new Date("2026-10-20T00:00:00-04:00");

function Closing() {
  // eslint-disable-next-line react-hooks/purity -- server-only; ISR re-renders it every 10 minutes
  const maple = Date.now() < MAPLE_DUE.getTime() ? "baby Maple Jane, due October 20" : "baby Maple Jane";

  return (
    <footer>
      <div className="mx-auto max-w-xl px-4 text-center">
        <h2 className={`${display} text-4xl font-semibold text-balance text-forest dark:text-cream sm:text-5xl`}>
          With love from all of us on our farm
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-forest/80 dark:text-cream/80">
          Matt, Brittany, Emmett, Sapphire, and {maple}.
        </p>
        <p className="mt-3 leading-relaxed text-forest/70 dark:text-cream/70">
          Plus Zoe the couch commander, Bruce, the barn cats, the livestock dogs, and the guinea hens,
          ducks, geese, and chickens.
        </p>
        <a
          href="mailto:brookerhousehold@gmail.com"
          className="mt-6 inline-block text-gold-dark underline-offset-4 hover:underline dark:text-soft-gold-light"
        >
          brookerhousehold@gmail.com
        </a>
      </div>
      <div className="relative h-[max(20rem,52vw)] max-h-[56rem] [mask-image:linear-gradient(to_bottom,transparent,black_25%)]">
        <FarmScene />
      </div>
    </footer>
  );
}

export default async function Home() {
  const { prints, photoCount, songCount } = await getCelebrationMemories(PRINTS_ON_TABLE);

  return (
    <>
      <MemoryTable prints={prints} photoCount={photoCount} />
      <HowWeGotHere />
      <ReliveTheDay photoCount={photoCount} songCount={songCount} />
      <Closing />
    </>
  );
}
