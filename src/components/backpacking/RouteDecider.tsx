"use client";

import { useState } from "react";

/* Distances/times are planning estimates for a group moving ~1.5 mph with full
   packs and ~2 mph with daypacks on High Peaks terrain, cross-checked against
   DEC/ADK mileages. Verify closure-flagged items on DEC's backcountry page. */

type Run = {
  peak: string;
  rt: string;
  gain: string;
  time: string;
  note?: string;
  flag?: string;
  link?: string;
};

type Scenario = {
  id: string;
  trailhead: "loj" | "uw";
  label: string;
  short: string;
  driveLabel: string;
  driveH: number;
  situation: string;
  carryIn: { mi: string; gain: string; time: string; desc: string };
  packOutH: number;
  packOutLabel: string;
  runs: Run[];
  pros: string[];
  cons: string[];
};

const AT = {
  marcy: "https://www.alltrails.com/trail/us/new-york/mount-marcy-via-van-hoevenberg-trail",
  phelps: "https://www.alltrails.com/trail/us/new-york/phelps-mountain-trail",
  colden: "https://www.alltrails.com/trail/us/new-york/mount-colden-via-lake-arnold",
  marshall: "https://www.alltrails.com/trail/us/new-york/mount-marshall-via-herbert-brook",
  algonquin: "https://www.alltrails.com/trail/us/new-york/algonquin-peak-via-adirondack-loj",
};

const SCENARIOS: Scenario[] = [
  {
    id: "loj-marcydam",
    trailhead: "loj",
    label: "Marcy Dam",
    short: "Loj → Marcy Dam",
    driveLabel: "≈2 hrs from Greenwich to Adirondak Loj",
    driveH: 2.0,
    situation:
      "The easy-living option. A short flat carry gets the overnight weight off your backs fast, and every summit run leaves from camp on the Van Hoevenberg corridor — none of it touches the Avalanche Pass closure. The tradeoff is that Marshall (and the wreck) are effectively out of range from here.",
    carryIn: {
      mi: "2.3 mi",
      gain: "+250 ft",
      time: "≈1–1¼ hrs with full packs",
      desc: "Loj → Marcy Dam tent sites / nearby lean-tos. Smooth, popular trail.",
    },
    packOutH: 1.25,
    packOutLabel: "≈1¼ hrs back to the car",
    runs: [
      {
        peak: "Mount Marcy (5,344 ft — #1)",
        rt: "≈10.2 mi RT",
        gain: "+2,900 ft",
        time: "6–8 hrs",
        note: "The main event with daypacks. Huge bare summit cone.",
        link: AT.marcy,
      },
      {
        peak: "Phelps (4,161 ft — #32)",
        rt: "≈4.4 mi RT",
        gain: "+2,000 ft",
        time: "3–4 hrs",
        note: "Perfect Sunday-morning quickie before packing out.",
        link: AT.phelps,
      },
      {
        peak: "Tabletop (4,427 ft — #19)",
        rt: "≈7.4 mi RT",
        gain: "+2,400 ft",
        time: "4½–5½ hrs",
        note: "Wooded summit, herd path off the Van Ho.",
      },
      {
        peak: "Colden via Lake Arnold (4,714 ft — #11)",
        rt: "≈9.4 mi RT",
        gain: "+2,500 ft",
        time: "6–7 hrs",
        note: "Doable as a day run from here if Colden is the must-have.",
        link: AT.colden,
      },
    ],
    pros: [
      "Shortest carry — most energy left for summits",
      "Marcy is right there (Liam's pick)",
      "Easiest Sunday exit math, latest leave-camp time",
      "Bear can rental at the trailhead (HPIC)",
    ],
    cons: [
      "Marshall is out of range — no 46er progress for Dan",
      "Busiest camping area in the High Peaks; sites go early on Saturdays",
    ],
  },
  {
    id: "loj-colden",
    trailhead: "loj",
    label: "Lake Colden",
    short: "Loj → Lake Colden (via Lake Arnold)",
    driveLabel: "≈2 hrs from Greenwich to Adirondak Loj",
    driveH: 2.0,
    situation:
      "Normally you'd cruise through Avalanche Pass to Lake Colden in 5.5 mi — but that trail is closed at the slide, so the only Loj-side way in is up and over the Lake Arnold col: longer, ~1,500 ft of climbing with full packs, and famously muddy on the far side. You land in gorgeous country with Colden, Marshall, and Algonquin all around you. It just costs real work getting in and out.",
    carryIn: {
      mi: "≈7 mi",
      gain: "+1,600 ft (over the 3,800 ft col)",
      time: "≈4–5 hrs with full packs",
      desc: "Loj → Marcy Dam → Lake Arnold → down past the Feldspar junction → Lake Colden lean-tos. Wet crossings near the col.",
    },
    packOutH: 4.0,
    packOutLabel: "≈4 hrs back over Lake Arnold to the car",
    runs: [
      {
        peak: "Colden via the west ladders (4,714 ft — #11)",
        rt: "≈3.4 mi RT",
        gain: "+1,900 ft",
        time: "3½–4½ hrs",
        note: "Steep, fun, ladders. Straight up from camp.",
        flag: "Verify the west-side trail is clear of slide closures before counting on it",
        link: AT.colden,
      },
      {
        peak: "Marshall via Herbert Brook (4,360 ft — #25)",
        rt: "≈5 mi RT",
        gain: "+1,700 ft",
        time: "4–5 hrs",
        note: "Walk the shoreline to Flowed Lands, then the herd path. Dan's 46er.",
        link: AT.marshall,
      },
      {
        peak: "Algonquin from the south (5,114 ft — #2)",
        rt: "≈4.8 mi RT",
        gain: "+2,300 ft",
        time: "4½–5½ hrs",
        note: "Brutally steep but short. Above-treeline payoff.",
        flag: "Bridge near the Algonquin junction was under repair — check status",
        link: AT.algonquin,
      },
      {
        peak: "Marcy via Feldspar / Four Corners",
        rt: "≈9 mi RT",
        gain: "+2,700 ft",
        time: "6–8 hrs",
        note: "The quiet back way up Marcy.",
        link: AT.marcy,
      },
    ],
    pros: [
      "Best summit menu — Colden, Marshall, Algonquin, Marcy all from camp",
      "Prettiest, wildest camping of the options",
      "Works for both Liam's Marcy wish and Dan's Marshall",
    ],
    cons: [
      "Hardest carry in AND out while the pass is closed",
      "Sunday exit is long — earliest leave-camp deadline of any option",
      "Lake Arnold mud with full packs, twice",
    ],
  },
  {
    id: "uw-flowed",
    trailhead: "uw",
    label: "Flowed Lands",
    short: "Upper Works → Flowed Lands",
    driveLabel: "≈2 hrs from Greenwich to Upper Works (Tahawus)",
    driveH: 2.0,
    situation:
      "The closure-dodge. Coming in from the south via Calamity Brook you never touch Avalanche Pass, the carry is gentler than the Lake Arnold slog, and you camp at the foot of Marshall — the wreck-and-46er side of the range. Marcy and Algonquin get far; this is the all-in Marshall/Colden plan.",
    carryIn: {
      mi: "≈4.6 mi",
      gain: "+1,200 ft",
      time: "≈2½–3 hrs with full packs",
      desc: "Upper Works → Calamity Brook Trail → Flowed Lands lean-tos. Steady, unglamorous, effective.",
    },
    packOutH: 2.5,
    packOutLabel: "≈2½ hrs back to the car",
    runs: [
      {
        peak: "Marshall via Herbert Brook (4,360 ft — #25)",
        rt: "≈3.2 mi RT",
        gain: "+1,450 ft",
        time: "3–4 hrs",
        note: "Right from camp. Dan's 46er, Saturday afternoon material.",
        link: AT.marshall,
      },
      {
        peak: "Colden via the west ladders",
        rt: "≈5.6 mi RT",
        gain: "+2,000 ft",
        time: "4½–5½ hrs",
        note: "Walk up past Lake Colden, then the ladder trail.",
        flag: "Verify the west-side trail is clear of slide closures",
        link: AT.colden,
      },
      {
        peak: "The plane wreck (Cold Brook Pass side)",
        rt: "varies",
        gain: "—",
        time: "half-day detour",
        note: "1969 crash wreckage near Cold Brook Pass below Iroquois.",
        flag: "Cold Brook Pass trail condition unverified — research pending",
      },
      {
        peak: "Marcy via Four Corners",
        rt: "≈10.6 mi RT",
        gain: "+3,000 ft",
        time: "7–9 hrs",
        note: "Possible but a monster day from here.",
        link: AT.marcy,
      },
    ],
    pros: [
      "Avoids the closure entirely — easiest carry to the Colden/Marshall side",
      "Marshall (and the wreck side) right out the tent door",
      "Quieter trailhead, free parking, no 7 AM panic",
      "Reasonable Sunday exit",
    ],
    cons: [
      "No bear can rental at Upper Works — must sort can #2 beforehand",
      "Marcy/Algonquin effectively out of reach — tough sell for Liam's Marcy wish",
      "Cell-dead gravel road to the trailhead",
    ],
  },
  {
    id: "uw-colden",
    trailhead: "uw",
    label: "Lake Colden",
    short: "Upper Works → Lake Colden",
    driveLabel: "≈2 hrs from Greenwich to Upper Works (Tahawus)",
    driveH: 2.0,
    situation:
      "Same southern approach, but push ~1 more mile past Flowed Lands to camp at Lake Colden itself. Slightly longer carry buys you the prettier lake, a shorter Colden climb, and a marginally better launch point for the Feldspar side. Marshall gets a touch farther than from Flowed Lands.",
    carryIn: {
      mi: "≈5.7 mi",
      gain: "+1,300 ft",
      time: "≈3–3½ hrs with full packs",
      desc: "Upper Works → Calamity Brook → Flowed Lands → around to the Lake Colden lean-tos.",
    },
    packOutH: 3.0,
    packOutLabel: "≈3 hrs back to the car",
    runs: [
      {
        peak: "Colden via the west ladders",
        rt: "≈3.4 mi RT",
        gain: "+1,900 ft",
        time: "3½–4½ hrs",
        note: "Straight up from camp.",
        flag: "Verify the west-side trail is clear of slide closures",
        link: AT.colden,
      },
      {
        peak: "Marshall via Herbert Brook",
        rt: "≈5 mi RT",
        gain: "+1,700 ft",
        time: "4–5 hrs",
        note: "Back along Flowed Lands to the herd path.",
        link: AT.marshall,
      },
      {
        peak: "Marcy via Feldspar / Four Corners",
        rt: "≈9 mi RT",
        gain: "+2,700 ft",
        time: "6–8 hrs",
        note: "Long but launchable from here.",
        link: AT.marcy,
      },
      {
        peak: "Algonquin from the south",
        rt: "≈4.8 mi RT",
        gain: "+2,300 ft",
        time: "4½–5½ hrs",
        flag: "Bridge near the Algonquin junction was under repair — check status",
        link: AT.algonquin,
      },
    ],
    pros: [
      "Closure-free approach with the best of the interior camping",
      "Colden is a short steep hop from camp",
      "Balanced menu: Colden + Marshall Saturday/Sunday is realistic",
    ],
    cons: [
      "No bear can rental at Upper Works",
      "A longer carry than Flowed Lands for modest gains",
      "Sunday exit a bit tighter than Flowed Lands",
    ],
  },
];

// Sunday deadline math: home target 6 PM, hard stop 7 PM, plus a 15-min
// pack-the-car buffer at the trailhead.
function leaveCampBy(s: Scenario, homeByHour: number): string {
  const carBy = homeByHour - s.driveH - 0.25;
  const leave = carBy - s.packOutH;
  const h = Math.floor(leave);
  const m = Math.round((leave - h) * 60);
  const hh = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hh}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function RouteDecider() {
  const [danIn, setDanIn] = useState<boolean | null>(null);
  const [scenarioId, setScenarioId] = useState<string>("loj-marcydam");

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  const recommendedId = danIn === null ? null : danIn ? "uw-flowed" : "loj-marcydam";

  return (
    <div className="space-y-5">
      {/* Step 1: crew */}
      <div className="soft-card dark:soft-card-dark p-5">
        <h3 className="font-semibold">1 · Is Dan coming?</h3>
        <p className="mt-0.5 text-xs opacity-70">
          Dan needs Marshall for his 46. Liam wants big and pretty (Marcy). This swings the whole
          plan.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            [true, "Dan's in — Marshall matters"],
            [false, "Dan's out — Marcy focus"],
          ].map(([val, label]) => (
            <button
              key={String(val)}
              onClick={() => {
                setDanIn(val as boolean);
                setScenarioId(val ? "uw-flowed" : "loj-marcydam");
              }}
              className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                danIn === val
                  ? "border-soft-gold bg-soft-gold/20"
                  : "border-sage/30 hover:border-sage/70"
              }`}
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: scenario picker */}
      <div className="soft-card dark:soft-card-dark p-5">
        <h3 className="font-semibold">2 · Trailhead + basecamp</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className={`relative rounded-xl border-2 px-4 py-3 text-left transition-all ${
                scenarioId === s.id
                  ? "border-soft-gold bg-soft-gold/15"
                  : "border-sage/25 hover:border-sage/60"
              }`}
            >
              <div className="text-sm font-semibold">{s.short}</div>
              <div className="mt-0.5 text-xs opacity-70">
                carry {s.carryIn.mi} · out {s.packOutLabel.replace("back to the car", "").trim()}
              </div>
              {recommendedId === s.id && (
                <span className="absolute -top-2 right-3 rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-cream dark:bg-soft-gold dark:text-forest-dark">
                  suggested
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario detail */}
      <div className="soft-card dark:soft-card-dark overflow-hidden">
        <div className="border-b border-sage/20 bg-sage/5 px-5 py-4">
          <h3 className="font-[family-name:var(--font-cormorant-garamond)] text-2xl font-semibold">
            {scenario.short}
          </h3>
          <p className="mt-1 text-sm leading-relaxed opacity-85">{scenario.situation}</p>
        </div>

        <div className="grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-sage/15">
          <div className="px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-wide opacity-60">🚗 Drive</div>
            <p className="mt-1 text-sm">{scenario.driveLabel}</p>
          </div>
          <div className="px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-wide opacity-60">
              🎒 Carry-in to camp
            </div>
            <p className="mt-1 text-sm">
              <strong>
                {scenario.carryIn.mi} · {scenario.carryIn.gain}
              </strong>{" "}
              · {scenario.carryIn.time}
            </p>
            <p className="mt-1 text-xs opacity-70">{scenario.carryIn.desc}</p>
          </div>
          <div className="px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-wide opacity-60">
              ⏰ Sunday deadline math
            </div>
            <p className="mt-1 text-sm">
              {scenario.packOutLabel}. Leave camp by{" "}
              <strong>{leaveCampBy(scenario, 18)}</strong> to be home by 6 PM
              <span className="opacity-70"> (hard stop: {leaveCampBy(scenario, 19)} for 7 PM)</span>
            </p>
          </div>
        </div>

        <div className="border-t border-sage/15 px-5 py-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide opacity-60">
            ⛰️ Summit runs from this camp
          </div>
          <ul className="space-y-3">
            {scenario.runs.map((r) => (
              <li key={r.peak} className="rounded-xl border border-sage/20 px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-sm font-semibold">{r.peak}</span>
                  <span className="text-xs font-semibold opacity-75">
                    {r.rt} · {r.gain} · {r.time}
                  </span>
                </div>
                {r.note && <p className="mt-1 text-xs opacity-75">{r.note}</p>}
                {r.flag && (
                  <p className="mt-1 rounded bg-soft-gold/20 px-2 py-1 text-xs">⚠️ {r.flag}</p>
                )}
                {r.link && (
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs underline opacity-70 hover:opacity-100"
                  >
                    AllTrails ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-0 border-t border-sage/15 sm:grid-cols-2 sm:divide-x sm:divide-sage/15">
          <div className="px-5 py-4">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide opacity-60">
              👍 Why this one
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs opacity-85">
              {scenario.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="px-5 py-4">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide opacity-60">
              👎 The catch
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs opacity-85">
              {scenario.cons.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="text-xs opacity-70">
        Times assume ~1.5 mph with full packs, ~2 mph with daypacks — normal for High Peaks
        terrain. Mileages are planning-grade; the paper map wins arguments on trail.
      </p>
    </div>
  );
}
