"use client";

import { useState } from "react";
import { CAPTION, FORMATS, type Format } from "@/lib/backpacking-share";
import ShareCard from "./ShareCard";

export default function SharePanel() {
  const [format, setFormat] = useState<Format>("feed");
  const [copied, setCopied] = useState(false);
  const spec = FORMATS[format];

  const copy = async () => {
    await navigator.clipboard.writeText(CAPTION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="soft-card dark:soft-card-dark mb-4 flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3">
        <div className="flex gap-2">
          {(Object.keys(FORMATS) as Format[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              aria-pressed={format === f}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                format === f
                  ? "bg-forest text-cream dark:bg-soft-gold dark:text-forest-dark"
                  : "border border-sage/25 opacity-75 hover:opacity-100 dark:border-soft-gold/25"
              }`}
            >
              {FORMATS[f].label} · {FORMATS[f].ratio}
            </button>
          ))}
        </div>
        <span className="flex-1" />
        <a
          href={`/backpacking/share-${format}.png`}
          download={`high-peaks-${format}.png`}
          className="rounded-full bg-forest px-4 py-1.5 text-sm font-bold text-cream transition-all hover:opacity-90 dark:bg-soft-gold dark:text-forest-dark"
        >
          ⬇ Save PNG ({spec.w}×{spec.h})
        </a>
      </div>

      <div className="mb-4 overflow-hidden rounded-3xl shadow-xl">
        <ShareCard format={format} />
      </div>

      <section className="soft-card dark:soft-card-dark mb-4 p-5">
        <h2 className="text-lg font-bold">Caption</h2>
        <p className="mb-3 mt-0.5 text-sm opacity-75">
          Save the PNG rather than screenshotting if you can — it is already the exact size
          Instagram wants, so nothing gets recompressed on the way in.
        </p>
        <div className="whitespace-pre-wrap rounded-2xl border border-sage/20 p-4 text-sm leading-relaxed dark:border-soft-gold/20">
          {CAPTION}
        </div>
        <button
          type="button"
          onClick={copy}
          className="mt-3 rounded-full border border-sage/25 px-4 py-1.5 text-sm font-semibold transition-all hover:opacity-80 dark:border-soft-gold/25"
        >
          {copied ? "Copied" : "Copy caption"}
        </button>
      </section>
    </>
  );
}
