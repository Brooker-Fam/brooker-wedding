import Link from "next/link";
import type { CSSProperties } from "react";
import type { Print } from "@/lib/celebration";

export const PRINTS_ON_TABLE = 12;

const TILTS = [-4, 3, -2, 5, 2, -5, 4, -3, 3, -4, 2, -2];
const TAPES = ["gold", "blush", "lavender", "sage"] as const;

function visibility(index: number): string {
  if (index >= 9) return "hidden lg:block";
  if (index >= 6) return "hidden sm:block";
  return "";
}

function Polaroid({ print, index }: { print: Print; index: number }) {
  const style = {
    "--tilt": `${TILTS[index % TILTS.length]}deg`,
    "--delay": `${200 + index * 70}ms`,
    "--tape-tilt": `${index % 2 === 0 ? -4 : 3}deg`,
  } as CSSProperties;

  // Each print duplicates the "Open the album" button, so it stays out of the
  // tab order and the accessibility tree.
  return (
    <Link href="/photos" tabIndex={-1} aria-hidden="true" className={`print ${visibility(index)}`} style={style}>
      <span className={`print-tape print-tape--${TAPES[index % TAPES.length]}`} />
      {/* eslint-disable-next-line @next/next/no-img-element -- already a 512px thumbnail on Blob */}
      <img
        src={print.src}
        alt=""
        loading={index < 6 ? "eager" : "lazy"}
        decoding="async"
        className={print.landscape ? "aspect-[5/4]" : "aspect-[4/5]"}
      />
    </Link>
  );
}

function ThankYouCard({ photoCount, className }: { photoCount: number; className: string }) {
  return (
    <div className={`thank-you-card ${className}`}>
      <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-[2.6rem] leading-[1.02] font-semibold text-balance text-forest sm:text-[3.4rem] lg:text-[3.75rem]">
        Thank you for celebrating with us.
      </h1>
      <p className="mx-auto mt-5 max-w-[34ch] text-[1.0625rem] leading-relaxed text-forest/75">
        On June 27, our farm filled up with the people we love.
        {photoCount > 0 && <> These are a few of the {photoCount} photos and videos in our album.</>}
      </p>
      <Link
        href="/photos"
        className="mt-7 inline-flex min-h-11 items-center rounded-full bg-forest px-7 text-base font-semibold text-cream transition-colors hover:bg-forest-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-soft-gold"
      >
        Open the album
      </Link>
      <p className="mt-7 font-[family-name:var(--font-cormorant-garamond)] text-2xl font-medium text-gold-dark italic">
        Love, Matt &amp; Brittany
      </p>
    </div>
  );
}

export default function MemoryTable({ prints, photoCount }: { prints: Print[]; photoCount: number }) {
  if (prints.length < PRINTS_ON_TABLE) {
    return (
      <section className="px-4 pt-28 pb-16 sm:pt-32">
        <ThankYouCard photoCount={photoCount} className="mx-auto max-w-xl" />
      </section>
    );
  }

  return (
    <section className="overflow-x-clip px-4 pt-24 pb-10 sm:px-6 sm:pt-28 sm:pb-12 lg:pb-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-x-5 gap-y-7 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-8">
        <ThankYouCard
          photoCount={photoCount}
          className="col-span-full mb-3 sm:mx-auto sm:max-w-xl lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:mb-0"
        />
        {prints.slice(0, PRINTS_ON_TABLE).map((print, index) => (
          <Polaroid key={print.id} print={print} index={index} />
        ))}
      </div>
    </section>
  );
}
