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
  trailhead: "uw";
  /** "the plan" / "backup" chip on the picker card. */
  badge: string;
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
  marcyUW: "https://www.alltrails.com/trail/us/new-york/mount-marcy-from-upper-works-trail",
  coldenWest: "https://www.alltrails.com/trail/us/new-york/mount-colden-loop-via-lake-colden",
  marshall: "https://www.alltrails.com/trail/us/new-york/mount-marshall-via-the-calamity-brook-trail",
};

const SCENARIOS: Scenario[] = [
  {
    id: "uw-colden",
    trailhead: "uw",
    badge: "✓ the plan",
    label: "Lake Colden",
    short: "Upper Works → Lake Colden",
    driveLabel: "≈2¾ hrs from Greenwich to Upper Works (I-87 exit 29, then slow county roads)",
    driveH: 2.83,
    situation:
      "This is the plan. In from the south via Calamity Brook — never touching the closed Avalanche Pass — past Flowed Lands to camp at Lake Colden itself: the prettier lake, a staffed ranger outpost, and the shortest launch for everything on the menu below. The one thing to watch is the washed-out Calamity Brook bridge at ~2.8 mi (easy rock-hop when dry, no-go right after heavy rain).",
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
        peak: "Marcy alone (5,344 ft — #1)",
        rt: "≈9.5–10 mi RT",
        gain: "+3,000 ft",
        time: "7–9 hrs",
        note: "The quiet back way up the state's high point — the Opalescent gorge, Feldspar Brook, Lake Tear of the Clouds, then the summit cone from Four Corners. Saturday only, alpine start.",
        flag: "Feldspar lean-to access bridge has a broken stringer (DEC) — use caution at the Opalescent",
        link: AT.marcyUW,
        doc: "marcy-feldspar",
      },
      {
        peak: "Marcy + Gray (adds #46-list Gray, 4,840 ft — #7)",
        rt: "≈11 mi RT",
        gain: "+3,500 ft",
        time: "8–10 hrs",
        note: "Gray is a 0.6-mi unmarked herd path from Lake Tear's outlet — right on the way. The cheapest extra 46er of the whole weekend.",
        link: AT.marcyUW,
        doc: "marcy-feldspar",
      },
      {
        peak: "Marcy + Gray + Skylight (the triple, +4,926 ft — #4)",
        rt: "≈12 mi RT",
        gain: "+4,000 ft",
        time: "9–11 hrs",
        note: "Skylight is 0.5 mi from Four Corners on a marked trail, with one of the best open summits in the park (carry a rock up — tradition says it keeps the rain off). The full day. All three only if we're at Four Corners by ~11 AM.",
        link: AT.marcyUW,
        doc: "marcy-feldspar",
      },
      {
        peak: "Algonquin from the lake (5,114 ft — #2)",
        rt: "≈4.5 mi RT",
        gain: "+2,350 ft",
        time: "4½–6 hrs",
        note: "The steep southeast route straight up from Lake Colden — 2.1 mi and 2,350 ft, one of the steepest marked climbs in the park. Same bare-summit payoff as the Loj side without the Loj.",
        doc: "algonquin-lc",
      },
      {
        peak: "Algonquin + Wright (adds 4,580 ft — #16)",
        rt: "≈7 mi RT",
        gain: "+3,900 ft",
        time: "7–9 hrs",
        note: "Wright is 0.9 mi down Algonquin's far (north) side plus a 0.4-mi spur — and you re-climb ~1,000 ft of Algonquin to get home. Two 46ers, honestly earned.",
        flag: "Committing: once you drop toward Wright, the only way back to camp is back over Algonquin's summit",
        doc: "algonquin-lc",
      },
      {
        peak: "Colden via the west ladders (4,714 ft — #11)",
        rt: "≈4.4–4.8 mi RT",
        gain: "+2,000 ft",
        time: "4–5 hrs",
        note: "Along the lake for 0.8 mi, then the red-blazed ladder trail — 1.6 mi and 2,000 ft from that junction. Confirmed OPEN. Skip it in the rain; the ladders and slab get dangerous wet.",
        link: AT.coldenWest,
        doc: "colden-west",
      },
      {
        peak: "Marshall via Herbert Brook (4,360 ft — #25)",
        rt: "≈4.0–4.6 mi RT",
        gain: "+1,745 ft",
        time: "3–3½ hrs",
        note: "The half-day option — a realistic Saturday afternoon after the carry in. The cairn-marked herd path starts ~0.25 mi past the Lake Colden dam; scout the cairn the evening before.",
        link: AT.marshall,
        doc: "marshall-herbert",
      },
      {
        peak: "The plane wreck (Cold Brook Pass, ~3,800 ft)",
        rt: "≈3 mi RT",
        gain: "+1,050 ft",
        time: "≈2 hrs plus searching",
        note: "Closest launch of any camp — story under the route book.",
        flag: "DEC calls Cold Brook Pass \"not a viable option\" — unmaintained 10+ years. Dry-day judgment call",
        doc: "wreck",
      },
    ],
    pros: [
      "Every peak on the wish list launches from the tent door",
      "Marcy, Gray, and Skylight stack on one approach — pick the day size at Four Corners",
      "Staffed ranger outpost nearby, best interior camping",
      "Colden is the short-day / bad-weather fallback",
    ],
    cons: [
      "Washed-out bridge at ~2.8 mi — heavy rain can close the whole approach",
      "One bear can for the two of us — everything repackaged at home, no rental at Upper Works",
      "3-hr pack-out makes Sunday's leave-camp deadline the earliest of the options",
    ],
    mapKeys: [
      "upperworks",
      "henderson",
      "lakecolden",
      "marshall",
      "wreck",
      "colden",
      "algonquin",
      "wright",
      "feldspar",
      "laketear",
      "gray",
      "fourcorners",
      "skylight",
      "marcy",
    ],
  },
  {
    id: "uw-flowed",
    trailhead: "uw",
    badge: "backup camp",
    label: "Flowed Lands",
    short: "Upper Works → Flowed Lands",
    driveLabel: "≈2¾ hrs from Greenwich to Upper Works (I-87 exit 29, then slow county roads)",
    driveH: 2.83,
    situation:
      "The bail-out, one mile short of the plan. Same approach, same bridge-less crossing — but if the carry is going long, the weather's turning, or Lake Colden's sites are taken, we stop here and camp above the big Colden view instead. Everything on the Lake Colden menu still works; it just costs about two extra round-trip miles per run.",
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
        note: "Add the mile from Flowed Lands up to the dam each way. Cairn marks the herd path ~0.25 mi past the Lake Colden dam.",
        link: AT.marshall,
        doc: "marshall-herbert",
      },
      {
        peak: "Colden via the west ladders (4,714 ft — #11)",
        rt: "≈6.5–7 mi RT",
        gain: "+2,000 ft",
        time: "5–6 hrs",
        note: "Walk up past Lake Colden, then the red-blazed ladder trail. Confirmed OPEN.",
        link: AT.coldenWest,
        doc: "colden-west",
      },
      {
        peak: "The plane wreck (Cold Brook Pass, ~3,800 ft)",
        rt: "≈5 mi RT",
        gain: "+1,050 ft",
        time: "3–3½ hrs",
        note: "1969 Piper Cherokee, ~100 ft west of the trail behind a ten-foot boulder just below the col.",
        flag: "DEC calls Cold Brook Pass \"not a viable option\" — unmaintained 10+ years. Dry-day, fresh-legs judgment call",
        doc: "wreck",
      },
      {
        peak: "Marcy / Gray / Skylight via Feldspar",
        rt: "≈11.5–14 mi RT",
        gain: "+3,200–4,200 ft",
        time: "9–12 hrs",
        note: "All the Lake Colden variants work from here with ~2 mi added — but the triple becomes a genuinely huge day. From this camp, Marcy-only is the honest call.",
        flag: "Feldspar lean-to access bridge has a broken stringer (DEC) — use caution at the Opalescent",
        link: AT.marcyUW,
        doc: "marcy-feldspar",
      },
      {
        peak: "Algonquin from the lake (5,114 ft — #2)",
        rt: "≈6.5 mi RT",
        gain: "+2,350 ft",
        time: "5½–7 hrs",
        note: "The steep southeast route — reach the trailhead by walking the shore mile past the Lake Colden dam first.",
        doc: "algonquin-lc",
      },
    ],
    pros: [
      "Shorter carry, gentler Sunday deadline",
      "Big open water-and-Colden view from camp",
      "Same closure-free approach; nothing on the menu is lost, only lengthened",
    ],
    cons: [
      "Adds ~2 mi RT to every summit run vs Lake Colden",
      "Same bridge-less crossing at ~2.8 mi",
      "One bear can for the two of us — everything repackaged at home, no rental at Upper Works",
    ],
    mapKeys: ["upperworks", "henderson", "flowed", "marshall", "wreck", "colden", "feldspar", "marcy"],
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
  const [scenarioId, setScenarioId] = useState<string>("uw-colden");

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  return (
    <div className="space-y-5">
      {/* Basecamp picker — the decision is made; the backup stays one tap away */}
      <div className="soft-card dark:soft-card-dark p-5">
        <h3 className="font-semibold">Basecamp</h3>
        <p className="mt-0.5 text-xs opacity-70">
          Lake Colden is the plan. Flowed Lands is what happens if the carry goes long, the
          weather turns, or the sites are full — tap it to see how the day changes.
        </p>
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
              <span className="absolute -top-2 right-3 rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-cream dark:bg-soft-gold dark:text-forest-dark">
                {s.badge}
              </span>
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
