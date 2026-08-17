"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FORMATS, type Format } from "@/lib/backpacking-share";

/* ------------------------------------------------------------------ *
 * A single frame, sized for Instagram, built from the same four Strava
 * activities the recap runs on. Rendered at true pixel size (1080 wide)
 * so a screenshot or the exported PNG lands at native resolution.
 * ------------------------------------------------------------------ */

const FT = 9840;
const MILES = 36.5;
const SUMMITS = [
  { day: "Saturday", names: "Marcy · Skylight · Gray" },
  { day: "Sunday", names: "Algonquin · Wright · Iroquois" },
];

const CREAM = "#FDF8F0";
const GOLD = "#D9B461";

export default function ShareCard({ format, scaled = true }: { format: Format; scaled?: boolean }) {
  const spec = FORMATS[format];
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!scaled) return;
    const node = hostRef.current;
    if (!node) return;
    const measure = () => setScale(Math.min(1, node.clientWidth / spec.w));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [scaled, spec.w]);

  const card = (
    <div
      data-share-card={format}
      className="relative overflow-hidden font-[family-name:var(--font-quicksand)]"
      style={{
        width: spec.w,
        height: spec.h,
        background: "#0B1A0D",
        transform: scaled ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
      }}
    >
      <Image
        src="/backpacking/flowed-lands-morning.jpg"
        alt="Still water below Mount Colden at first light, spruce islands mid-lake and the slides catching the sun."
        fill
        priority
        unoptimized
        sizes="1080px"
        style={{ objectFit: "cover", objectPosition: spec.focus }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(7,17,9,0.94) 0%, rgba(7,17,9,0.86) 24%, rgba(7,17,9,0.56) 42%, rgba(7,17,9,0.14) 62%, rgba(7,17,9,0.04) 78%, rgba(7,17,9,0.34) 100%)",
        }}
      />

      <div
        className="absolute inset-0 flex flex-col justify-between"
        style={{ padding: format === "story" ? "104px 76px 132px" : "72px 76px 78px", color: CREAM }}
      >
        <div className="flex items-baseline justify-between" style={{ letterSpacing: "0.26em" }}>
          <span style={{ fontSize: 23, fontWeight: 700 }}>ADIRONDACK HIGH PEAKS</span>
          <span style={{ fontSize: 23, fontWeight: 700, opacity: 0.85 }}>AUG 15–16 · 2026</span>
        </div>

        <div>
          <div className="flex items-baseline" style={{ gap: 26 }}>
            <span
              className="font-[family-name:var(--font-cormorant-garamond)]"
              style={{
                fontSize: 232,
                fontWeight: 700,
                lineHeight: 0.78,
                letterSpacing: "-0.02em",
                textShadow: "0 4px 40px rgba(7,17,9,0.55)",
              }}
            >
              {FT.toLocaleString("en-US")}
            </span>
            <span style={{ fontSize: 46, fontWeight: 600, opacity: 0.92 }}>feet climbed</span>
          </div>

          <div
            style={{
              marginTop: 46,
              paddingTop: 40,
              borderTop: `1px solid ${GOLD}66`,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            {(
              [
                [MILES.toFixed(1), "miles"],
                ["6", "summits"],
                ["2", "days"],
              ] as [string, string][]
            ).map(([v, k]) => (
              <div key={k}>
                <div
                  className="font-[family-name:var(--font-cormorant-garamond)]"
                  style={{ fontSize: 84, fontWeight: 700, lineHeight: 1 }}
                >
                  {v}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: GOLD,
                  }}
                >
                  {k}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 44,
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              columnGap: 32,
              rowGap: 18,
              alignItems: "baseline",
            }}
          >
            {SUMMITS.map((s) => (
              <div key={s.day} className="contents">
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: GOLD,
                  }}
                >
                  {s.day}
                </div>
                <div style={{ fontSize: 35, fontWeight: 600 }}>{s.names}</div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 46, fontSize: 28, lineHeight: 1.45, opacity: 0.8 }}>
            The plan was a tidy, classical sort of thing. What we did ran long, went in for excess,
            and finished both days in the dark.
          </p>
        </div>
      </div>
    </div>
  );

  if (!scaled) return card;

  return (
    <div ref={hostRef} style={{ height: spec.h * scale, overflow: "hidden" }}>
      {card}
    </div>
  );
}
