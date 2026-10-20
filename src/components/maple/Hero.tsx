"use client";

import { DEFAULT_TZ, localParts } from "@/lib/maple/time";
import { cx, tone } from "./ui";
import { useMaple, useNow } from "./useMaple";

/**
 * Today's hero: a maple sapling that grows a leaf for every week of Maple's
 * life and follows the real seasons (rust in October, bare with fairy lights
 * in winter, buds in spring, green in summer, red again on her birthday).
 * Zoe naps at its roots at night and pricks up an ear while a timer runs.
 */

/** A small maple leaf, centered on 0,0, about 20 units tall (stem at the bottom). */
export const MAPLE_LEAF_PATH =
  "M0,-10 L1.9,-5.6 L5.6,-7.4 L4.7,-2.8 L9.6,-3.6 L6.8,0 L8.6,2 L3,1.8 L3.8,5.6 L0.9,3.8 L0.6,9 L-0.6,9 L-0.9,3.8 L-3.8,5.6 L-3,1.8 L-8.6,2 L-6.8,0 L-9.6,-3.6 L-4.7,-2.8 L-5.6,-7.4 L-1.9,-5.6 Z";

const AUTUMN = ["#B5452B", "#D9772B", "#E0A93B", "#C49A3C", "#C2552F"];
const SUMMER = ["#5C7A4A", "#6B8448", "#7FA05A", "#4E6E3E"];
const EARLY_FALL = ["#7FA05A", "#E0A93B", "#6B8448", "#D9772B"];
const BIRTHDAY = ["#B5452B", "#C2302A", "#D24A35", "#A83A28"];

type Season = "autumn" | "winter" | "spring" | "summer" | "early-fall" | "birthday";

function seasonFor(month: number, birthday: boolean): Season {
  if (birthday) return "birthday";
  if (month === 10 || month === 11) return "autumn";
  if (month === 12 || month <= 2) return "winter";
  if (month <= 4) return "spring";
  if (month <= 8) return "summer";
  return "early-fall";
}

// Where leaves sit, in growth order: branch tips first, then filling the crown.
const ANCHORS: [number, number, number][] = [
  [49, 19, -6],
  [74, 39, 42],
  [27, 49, -48],
  [61, 28, 22],
  [37, 33, -28],
  [66, 51, 60],
  [33, 61, -66],
  [55, 13, 8],
  [42, 22, -14],
  [79, 49, 70],
  [21, 41, -40],
  [70, 30, 34],
];

function leafSpots(n: number): [number, number, number][] {
  const out = ANCHORS.slice(0, n);
  // Beyond the anchors, fill the crown on a sunflower spiral so it stays even.
  for (let i = out.length; i < n; i++) {
    const k = i - ANCHORS.length + 4;
    const a = k * 2.39996;
    const r = 4.3 * Math.sqrt(k);
    out.push([50 + Math.cos(a) * r * 1.25, 36 + Math.sin(a) * r, (a * 180) / Math.PI]);
  }
  return out;
}

export function Sapling({
  leaves,
  season,
  gnome,
  sway,
  className,
}: {
  leaves: number;
  season: Season;
  gnome?: boolean;
  sway?: boolean;
  className?: string;
}) {
  const spots = leafSpots(Math.max(0, Math.min(52, leaves)));
  const palette = season === "summer" ? SUMMER : season === "early-fall" ? EARLY_FALL : season === "birthday" ? BIRTHDAY : AUTUMN;
  const size = leaves <= 8 ? 1.05 : leaves <= 20 ? 0.8 : 0.62;
  const bare = season === "winter";
  return (
    <svg viewBox="0 0 100 110" className={className} aria-hidden>
      {/* ground */}
      <path d="M2,102 C22,94 78,94 98,102 L98,110 L2,110 Z" className="fill-[#5C7A4A]/25 dark:fill-[#A9C08F]/15" />
      {bare && <path d="M10,101 C28,95 72,95 90,101 C70,99 30,99 10,101 Z" fill="#F5F7F2" opacity="0.9" />}
      <g
        className={cx(sway && "animate-gentle-sway motion-reduce:animate-none [.maple-night_&]:animate-none")}
        style={{ transformOrigin: "50% 100%", transformBox: "fill-box", animationDuration: "6s" }}
      >
        {/* trunk and branches */}
        <g fill="none" stroke="#7A5230" strokeLinecap="round" className="dark:stroke-[#B08A62]">
          <path d="M50,100 C51,84 48,70 51,56 C53,46 50,34 49,20" strokeWidth="3.6" />
          <path d="M51,72 C44,66 36,60 28,50" strokeWidth="2.2" />
          <path d="M51,60 C58,54 66,47 74,40" strokeWidth="2.2" />
          <path d="M50,44 C55,39 58,34 61,29" strokeWidth="1.6" />
          <path d="M50,40 C46,38 41,35 37,33" strokeWidth="1.6" />
          <path d="M51,64 C56,60 62,56 66,51" strokeWidth="1.4" />
          <path d="M50,80 C45,74 39,68 33,61" strokeWidth="1.4" />
        </g>
        {bare &&
          ANCHORS.slice(0, 7).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y + 3} r="1.6" fill="#F3D27A" className="animate-fairy-light-twinkle motion-reduce:animate-none [.maple-night_&]:animate-none" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
        {season === "spring" &&
          spots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4 * size} fill="#A9C98A" stroke="#6B8448" strokeWidth="0.6" />)}
        {!bare &&
          season !== "spring" &&
          spots.map(([x, y, rot], i) => (
            <path
              key={i}
              d={MAPLE_LEAF_PATH}
              transform={`translate(${x} ${y}) rotate(${rot}) scale(${size})`}
              fill={palette[i % palette.length]}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="0.5"
            />
          ))}
      </g>
      {gnome && (
        <g transform="translate(70 86)">
          {/* a tiny acorn-capped gnome at the roots on her month-days */}
          <path d="M0,14 L3,6 L9,6 L12,14 Z" fill="#5C7A4A" />
          <circle cx="6" cy="6" r="3" fill="#E8C8B8" />
          <path d="M3.2,7 Q6,13 8.8,7 Z" fill="#F5F0E6" />
          <path d="M1.5,5 Q6,-2.5 10.5,5 Z" fill="#8A5A2B" />
          <path d="M6,-0.8 L6,-2.8" stroke="#5A3A1A" strokeWidth="1" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

/** Zoe, the small black couch commander with the grey muzzle, curled up asleep. */
export function Zoe({ alert, className }: { alert?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 44 26" className={className} aria-hidden>
      {!alert && (
        <text x="10" y="6" fontSize="6" fill="#E0A93B" opacity="0.55" fontFamily="serif">
          z z
        </text>
      )}
      <g fill="#24211D" stroke="rgba(224,169,59,0.45)" strokeWidth="0.7">
        <path d="M14,24 C8,24 6,19 9,15 C12,11 20,10 28,11 C37,12 41,16 40,21 C39,24 34,25 28,24 Z" />
        <path d="M37,21 C42,19 43,14 39,12" fill="none" strokeWidth="2.4" stroke="#24211D" strokeLinecap="round" />
        <ellipse cx="11" cy="18" rx="6.5" ry="5.5" />
        {alert ? <path d="M8,14 L9.5,6.5 L13.5,13 Z" /> : <path d="M10,14 C13,11.5 17,12 18,15 C15,15.5 12,15.5 10,14 Z" />}
      </g>
      <ellipse cx="6.2" cy="20.2" rx="3.4" ry="2.4" fill="#9A9690" />
      <circle cx="3.4" cy="19.6" r="0.9" fill="#111" />
      {alert ? <circle cx="9.6" cy="16.6" r="0.9" fill="#E0A93B" /> : <path d="M8.4,16.8 Q9.6,17.6 10.8,16.8" stroke="#9A9690" strokeWidth="0.7" fill="none" />}
    </svg>
  );
}

export default function Hero() {
  const { state, summary, isNight, toast } = useMaple();
  const now = useNow(60_000);
  if (!state || !summary) return null;
  const tz = state.baby.timezone ?? DEFAULT_TZ;
  const age = summary.age;
  const night = isNight();
  const p = localParts(now, tz);
  const born = state.baby.born_at ? localParts(state.baby.born_at, tz) : null;
  const monthDay = !!(born && age && age.months >= 1 && p.day === born.day);
  const birthday = !!(born && age && age.months >= 12 && p.month === born.month && p.day === born.day);
  const season = seasonFor(p.month, birthday);
  const leaves = age ? Math.min(52, age.weeks + 1) : 0;
  const first = (state.baby.name || "Maple").split(" ")[0];
  const timerRunning = summary.active.length > 0;

  const aboutTree = () =>
    toast(
      leaves === 1
        ? `${first}'s tree has its first leaf. One more grows each week.`
        : `${first}'s tree has ${leaves} leaves, one for each week.${season === "winter" ? " They're resting for winter." : ""}`,
      { emoji: "🍁", tone: "info" }
    );

  return (
    <header className="relative flex items-end gap-3 px-1 pt-3">
      {/* Fireflies: by day only, never behind the dial or at night. */}
      {!night && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden [.maple-night_&]:hidden">
          {[
            ["62%", "18%", "0s"],
            ["84%", "52%", "1.4s"],
            ["44%", "70%", "2.6s"],
          ].map(([left, top, delay]) => (
            <span
              key={left}
              className="animate-firefly absolute h-1.5 w-1.5 rounded-full bg-[#E9C46A] shadow-[0_0_8px_3px_rgba(233,196,106,0.55)]"
              style={{ left, top, animationDelay: delay }}
            />
          ))}
        </div>
      )}
      <button type="button" onClick={aboutTree} aria-label={`${first}'s tree: ${leaves} leaves, one for each week`} className="relative shrink-0 rounded-2xl active:scale-[0.98]">
        <Sapling leaves={leaves} season={season} gnome={monthDay} sway={!night} className="h-24 w-[88px]" />
        {night && <Zoe alert={timerRunning} className="absolute bottom-[3px] -left-1 h-[22px] w-[38px]" />}
      </button>
      <div className="min-w-0 flex-1 pb-1.5">
        <p className={cx(tone.label, "[.maple-night_&]:text-[#E0A93B]/55")}>Maple&apos;s Log</p>
        <h1 className={cx(tone.heading, "flex flex-wrap items-baseline gap-x-2 text-[32px] leading-[1.05] [.maple-night_&]:text-[#E0A93B]/85")}>
          <span className="truncate">{state.baby.name}</span>
          {age && <span className="text-[24px] text-[#B5452B] dark:text-[#E0A93B] [.maple-night_&]:text-[#D9772B]">Day {age.dayOfLife}</span>}
        </h1>
        {age && <p className={cx(tone.muted, "mt-0.5 text-[14px] [.maple-night_&]:text-[#E0A93B]/55")}>{age.label}</p>}
      </div>
    </header>
  );
}
