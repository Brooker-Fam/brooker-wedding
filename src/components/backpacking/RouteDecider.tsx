"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("./TripMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[24rem] items-center justify-center rounded-2xl border border-sage/25 text-sm opacity-70 sm:h-[28rem]">
      Loading map…
    </div>
  ),
});

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
  /** Route-book id — deep-links into the mile-by-mile card below. */
  doc?: string;
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
  /** Route-book id for the carry-in leg. */
  carryDoc: string;
  packOutH: number;
  packOutLabel: string;
  runs: Run[];
  pros: string[];
  cons: string[];
  mapKeys: string[];
};

const AT = {
  marcy: "https://www.alltrails.com/trail/us/new-york/mount-marcy-via-van-hoevenberg-trail--5",
  marcyUW: "https://www.alltrails.com/trail/us/new-york/mount-marcy-from-upper-works-trail",
  coldenNE: "https://www.alltrails.com/trail/us/new-york/mount-colden-via-van-hoevenberg-trail",
  coldenWest: "https://www.alltrails.com/trail/us/new-york/mount-colden-loop-via-lake-colden",
  marshall: "https://www.alltrails.com/trail/us/new-york/mount-marshall-via-the-calamity-brook-trail",
  phelps: "https://www.alltrails.com/trail/us/new-york/phelps-mountain-trail--2",
  phelpsTabletop: "https://www.alltrails.com/trail/us/new-york/phelps-and-tabletop-mountains-trail",
  wright: "https://www.alltrails.com/trail/us/new-york/wright-peak-via-van-hoevenberg-trail",
  algonquinWright:
    "https://www.alltrails.com/trail/us/new-york/algonquin-peak-and-wright-peak-via-algonquin-trail",
};

const SCENARIOS: Scenario[] = [
  {
    id: "loj-marcydam",
    trailhead: "loj",
    label: "Marcy Dam",
    short: "Loj → Marcy Dam",
    driveLabel: "≈2½ hrs from Greenwich to Adirondak Loj (I-87 exit 30)",
    driveH: 2.58,
    situation:
      "The easy-living option. A short flat carry gets the overnight weight off your backs fast, and every summit run leaves from camp on the Van Hoevenberg corridor — none of it touches the Avalanche Pass closure. The tradeoff is that Marshall (and the wreck) are effectively out of range from here.",
    carryIn: {
      mi: "2.3 mi",
      gain: "+250 ft",
      time: "≈1–1¼ hrs with full packs",
      desc: "Loj → Marcy Dam tent sites / nearby lean-tos. Smooth, popular trail, one signed junction at 1.0 mi.",
    },
    carryDoc: "loj-to-marcydam",
    packOutH: 1.25,
    packOutLabel: "≈1¼ hrs back to the car",
    runs: [
      {
        peak: "Mount Marcy (5,344 ft — #1)",
        rt: "≈10.2 mi RT",
        gain: "+2,900 ft",
        time: "7–8½ hrs",
        note: "The main event with daypacks. Huge bare summit cone. Waypoints from camp: Phelps jct 0.7 mi, Indian Falls 2.0 (last water), treeline 4.5, summit 5.1.",
        link: AT.marcy,
        doc: "marcy-vanho",
      },
      {
        peak: "Algonquin + Wright (5,114 / 4,580 ft — #2 & #16)",
        rt: "≈9.6 mi RT from the Loj · ≈9 mi via the Whale's Tail connector",
        gain: "+3,700 ft",
        time: "7–8½ hrs",
        note: "#2 in the state, the best bare summit in the park, and a 0.8-mi spur that buys Wright on the way. Zero interaction with the closure. From camp you either walk back to the Loj or take the Whale's Tail ski-trail connector — both are in the route book.",
        link: AT.algonquinWright,
        doc: "algonquin-wright",
      },
      {
        peak: "Wright alone (4,580 ft — #16)",
        rt: "≈6.7 mi RT from the Loj",
        gain: "+2,400 ft",
        time: "4½–5½ hrs",
        note: "The half-day version when Algonquin's weather looks bad but the lower summit doesn't. Still fully exposed up top.",
        link: AT.wright,
        doc: "algonquin-wright",
      },
      {
        peak: "Phelps (4,161 ft — #32)",
        rt: "≈3.8 mi RT",
        gain: "+2,000 ft",
        time: "3–4 hrs",
        note: "Perfect Sunday-morning quickie before packing out — the junction is only 0.7 mi from camp.",
        link: AT.phelps,
        doc: "phelps-tabletop",
      },
      {
        peak: "Tabletop (4,427 ft — #19)",
        rt: "≈5.0 mi RT",
        gain: "+2,200 ft",
        time: "4–5 hrs",
        note: "Wooded summit. The herd path is unmarked and leaves the Van Ho just past Indian Falls — bring a downloaded map.",
        link: AT.phelpsTabletop,
        doc: "phelps-tabletop",
      },
      {
        peak: "Colden via Lake Arnold (4,714 ft — #11)",
        rt: "≈7–8 mi RT",
        gain: "+2,300 ft",
        time: "5½–7 hrs",
        note: "The day-run way to get Colden without moving camp. Peel off south at Avalanche Camp — the pass itself is closed.",
        flag: "DEC: knee-deep-plus water near Lake Arnold, and a short bushwhack around slide debris on the SE side",
        link: AT.coldenNE,
        doc: "colden-arnold",
      },
    ],
    pros: [
      "Shortest carry — most energy left for summits",
      "Marcy is right there (Liam's pick)",
      "Easiest Sunday exit math, latest leave-camp time",
      "Bear can rental at the trailhead (HPIC)",
      "15 designated sites confirmed open (Aug 2026)",
    ],
    cons: [
      "Marshall is out of range — no 46er progress for Dan",
      "Loj lot fills before 6 AM on summer Saturdays — pre-dawn drive required",
      "Busiest camping area in the High Peaks; sites go early on Saturdays",
    ],
    mapKeys: ["loj", "marcydam", "indianfalls", "marcy", "phelps", "tabletop", "lakearnold", "colden", "algonquin", "wright"],
  },
  {
    id: "uw-flowed",
    trailhead: "uw",
    label: "Flowed Lands",
    short: "Upper Works → Flowed Lands",
    driveLabel: "≈2¾ hrs from Greenwich to Upper Works (I-87 exit 29, then slow county roads)",
    driveH: 2.83,
    situation:
      "The closure-dodge, with a catch. Coming in from the south via Calamity Brook you never touch Avalanche Pass, the carry is gentler than the Lake Arnold slog, and you camp at the foot of Marshall — the wreck-and-46er side of the range. The catch: the Calamity Brook high-water bridge washed out in March 2026. Recent trip reports call it an easy rock-hop in normal flows, but DEC warns the trail may be impassable during or right after heavy rain. Dry week = great plan. Deluge = rethink.",
    carryIn: {
      mi: "≈4.6 mi",
      gain: "+1,000–1,225 ft",
      time: "≈2½–3½ hrs with full packs",
      desc: "Upper Works → Calamity Brook Trail → Flowed Lands lean-tos. Steady, unglamorous, effective. Red discs to the T junction at 1.4 mi, then blue; the bridge-less crossing is at ~2.8 mi.",
    },
    carryDoc: "uw-to-colden",
    packOutH: 2.5,
    packOutLabel: "≈2½ hrs back to the car",
    runs: [
      {
        peak: "Marshall via Herbert Brook (4,360 ft — #25)",
        rt: "≈5.5–6.5 mi RT",
        gain: "+1,745 ft",
        time: "3½–4 hrs",
        note: "Dan's 46er, Saturday-afternoon material — add the mile from Flowed Lands up to the dam each way. Cairn marks the herd path ~0.25 mi past the Lake Colden dam; it crosses Herbert Brook over and over.",
        link: AT.marshall,
        doc: "marshall-herbert",
      },
      {
        peak: "Colden via the west ladders (4,714 ft — #11)",
        rt: "≈6.5–7 mi RT",
        gain: "+2,000 ft",
        time: "5–6 hrs",
        note: "Walk up past Lake Colden, then the red-blazed ladder trail. Confirmed OPEN — the closure is the Avalanche Pass corridor, not this trail.",
        link: AT.coldenWest,
        doc: "colden-west",
      },
      {
        peak: "The plane wreck (Cold Brook Pass, ~3,800 ft)",
        rt: "≈5 mi RT",
        gain: "+1,050 ft",
        time: "3–3½ hrs",
        note: "1969 Piper Cherokee, ~100 ft west of the trail behind a ten-foot boulder just below the col. Full story under the decider.",
        flag: "DEC calls Cold Brook Pass \"not a viable option\" — unmaintained 10+ years. Dry-day, fresh-legs judgment call",
        doc: "wreck",
      },
      {
        peak: "Marcy via Feldspar / Four Corners",
        rt: "≈12 mi RT",
        gain: "+3,000 ft",
        time: "8–10 hrs",
        note: "Possible but a monster day from here — Lake Colden is a better launch pad for this one.",
        flag: "Feldspar lean-to access bridge has a broken stringer (DEC) — use caution at the Opalescent",
        link: AT.marcyUW,
        doc: "marcy-feldspar",
      },
    ],
    pros: [
      "Avoids the closure entirely — easiest carry to the Colden/Marshall side",
      "Marshall (and the wreck side) right out the tent door",
      "Quieter trailhead, free parking, no pre-dawn parking panic",
      "Reasonable Sunday exit",
    ],
    cons: [
      "Bridge out ~2.7 mi in — easy rock-hop when dry, impassable after a deluge",
      "No bear can rental at Upper Works — must sort can #2 beforehand",
      "Marcy is a monster from here and Algonquin is out — tough sell for Liam's Marcy wish",
      "Longest drive of the options, ending on slow cell-dead county roads",
    ],
    mapKeys: ["upperworks", "henderson", "flowed", "marshall", "wreck", "colden", "feldspar", "marcy"],
  },
  {
    id: "uw-colden",
    trailhead: "uw",
    label: "Lake Colden",
    short: "Upper Works → Lake Colden",
    driveLabel: "≈2¾ hrs from Greenwich to Upper Works (I-87 exit 29, then slow county roads)",
    driveH: 2.83,
    situation:
      "Same southern approach (same washed-out Calamity Brook bridge — easy rock-hop when dry, bad after rain), but push ~1 more mile past Flowed Lands to camp at Lake Colden itself. The longer carry buys you the prettier lake, the shortest Colden climb, a staffed ranger outpost nearby, and the closest launch for the plane wreck and the Feldspar side.",
    carryIn: {
      mi: "≈5.6 mi",
      gain: "+1,325 ft",
      time: "≈3–4 hrs with full packs",
      desc: "Upper Works → Calamity Brook → Flowed Lands (4.6 mi) → around the shore to the Lake Colden lean-tos (rolling ups and downs on the last mile).",
    },
    carryDoc: "uw-to-colden",
    packOutH: 3.0,
    packOutLabel: "≈3 hrs back to the car",
    runs: [
      {
        peak: "Colden via the west ladders (4,714 ft — #11)",
        rt: "≈4.4–4.8 mi RT",
        gain: "+2,000 ft",
        time: "4–5 hrs",
        note: "Shortest summit from any of our camps. Along the lake for 0.8 mi, then the red-blazed ladder trail turns uphill — 1.6 mi and 2,000 ft from that junction. Confirmed OPEN.",
        link: AT.coldenWest,
        doc: "colden-west",
      },
      {
        peak: "Marshall via Herbert Brook (4,360 ft — #25)",
        rt: "≈4.0–4.6 mi RT",
        gain: "+1,745 ft",
        time: "3–3½ hrs",
        note: "The cairn-marked herd path starts ~0.25 mi past the Lake Colden dam. No signs, no markers — scout the cairn on the way past the evening before.",
        link: AT.marshall,
        doc: "marshall-herbert",
      },
      {
        peak: "The plane wreck (Cold Brook Pass, ~3,800 ft)",
        rt: "≈3 mi RT",
        gain: "+1,050 ft",
        time: "≈2 hrs plus searching",
        note: "Closest launch of any camp — story under the decider.",
        flag: "DEC calls Cold Brook Pass \"not a viable option\" — unmaintained 10+ years. Dry-day judgment call",
        doc: "wreck",
      },
      {
        peak: "Marcy via Feldspar / Four Corners",
        rt: "≈10 mi RT",
        gain: "+2,700–3,000 ft",
        time: "7–9 hrs",
        note: "The quiet back way up Marcy, past Lake Tear of the Clouds — long but launchable from here. Saturday only, never Sunday.",
        flag: "Feldspar lean-to access bridge has a broken stringer (DEC) — use caution at the Opalescent",
        link: AT.marcyUW,
        doc: "marcy-feldspar",
      },
    ],
    pros: [
      "Closure-free approach with the best of the interior camping",
      "Colden is a short steep hop from camp",
      "Balanced menu: Colden + Marshall Saturday/Sunday is realistic",
    ],
    cons: [
      "Same broken high-water bridge as the Flowed Lands plan",
      "No bear can rental at Upper Works",
      "A longer carry than Flowed Lands for modest gains",
      "Sunday exit a bit tighter than Flowed Lands",
    ],
    mapKeys: ["upperworks", "henderson", "lakecolden", "marshall", "wreck", "colden", "feldspar", "marcy"],
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
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Map of the selected scenario */}
      <TripMap pointKeys={scenario.mapKeys} />

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
            <a
              href={`#route-${scenario.carryDoc}`}
              className="mt-1.5 inline-block text-xs font-semibold underline opacity-80 hover:opacity-100"
            >
              Mile-by-mile ↓
            </a>
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
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                  {r.doc && (
                    <a
                      href={`#route-${r.doc}`}
                      className="text-xs font-semibold underline opacity-80 hover:opacity-100"
                    >
                      Mile-by-mile ↓
                    </a>
                  )}
                  {r.link && (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline opacity-70 hover:opacity-100"
                    >
                      AllTrails ↗
                    </a>
                  )}
                </div>
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
        Times assume ~1.5 mph with full packs, ~2 mph with daypacks — normal for High Peaks terrain.
        Mileages are planning-grade; the{" "}
        <a className="underline" href="#route-library">
          route book
        </a>{" "}
        below has the junction-by-junction breakdown behind each number, and{" "}
        <a className="underline" href="#getting-there">
          Getting to the trailhead
        </a>{" "}
        has live Google Maps directions from the farm. The paper map wins arguments on trail.
      </p>
    </div>
  );
}
