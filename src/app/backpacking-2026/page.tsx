import type { Metadata } from "next";
import TripBoard from "@/components/backpacking/TripBoard";
import TripWeather from "@/components/backpacking/TripWeather";

export const metadata: Metadata = {
  title: "High Peaks Backpacking — Aug 15–16, 2026",
  description:
    "Matt, Liam (and maybe Dan) backpack the Adirondack High Peaks from Adirondak Loj. Routes, gear claiming, schedule, and trail beta.",
  robots: { index: false },
};

// Filled from DEC/ADK research — see the links on each card.
type Route = {
  name: string;
  stats: string;
  from: string;
  vibe: string;
  alltrails?: string;
  extra?: { label: string; href: string };
  notes: string[];
};

const DAY_ROUTES: Route[] = [
  {
    name: "Mount Marcy (5,344 ft — #1)",
    stats: "≈14.8 mi RT from the Loj · ≈10 mi RT from Marcy Dam · ~3,200 ft gain",
    from: "Van Hoevenberg Trail — does NOT touch the Avalanche Pass closure",
    vibe: "NY's highest. Huge open summit cone, 360° views. Liam's pick.",
    alltrails: "https://www.alltrails.com/trail/us/new-york/mount-marcy-via-van-hoevenberg-trail",
    notes: [
      "From a Marcy Dam basecamp it's a very doable out-and-back with daypacks",
      "Above treeline: stay on bare rock, alpine vegetation is fragile",
      "Start early — afternoon thunderstorms are the summer pattern",
    ],
  },
  {
    name: "Mount Colden (4,714 ft — #11)",
    stats: "≈4.5 mi one-way from Marcy Dam via Lake Arnold · ~2,100 ft gain",
    from: "Lake Arnold Trail from the Avalanche Camps side (open)",
    vibe: "Killer views straight down Avalanche Lake and across to the MacIntyres.",
    alltrails: "https://www.alltrails.com/trail/us/new-york/mount-colden-via-lake-arnold",
    notes: [
      "The WEST side trail (ladders from Lake Colden) may be affected by the slide closure — check the DEC page",
      "Pairs naturally with a Lake Arnold-side camp",
    ],
  },
  {
    name: "Mount Marshall (4,360 ft — #25) + the plane wreck",
    stats: "≈3 mi RT, ~1,200 ft gain from the Herbert Brook junction at Flowed Lands",
    from: "Herbert Brook herd path off the Lake Colden / Flowed Lands corridor",
    vibe: "Dan's 46er target. Wooded summit, but a classic herd-path adventure.",
    alltrails: "https://www.alltrails.com/trail/us/new-york/mount-marshall-via-herbert-brook",
    notes: [
      "The 1969 plane crash wreckage sits near Cold Brook Pass on the Iroquois side — a separate detour from the Herbert Brook route; see the route research links",
      "Herd path = unmarked but well-worn; follow the brook",
    ],
  },
  {
    name: "Algonquin (5,114 ft — #2) + Wright (+ Iroquois)",
    stats: "≈8 mi RT from the Loj for Algonquin · +1 mi RT for Wright · +2 mi RT for Iroquois · ~3,000 ft gain",
    from: "MacIntyre Range trail from the Loj — best as a hike-out-day option or separate trip",
    vibe: "Second-highest, above-treeline ridge walking, the best-looking range in the park.",
    alltrails: "https://www.alltrails.com/trail/us/new-york/algonquin-peak-via-adirondack-loj",
    notes: [
      "From a Lake Colden camp, the trail up Algonquin's back side is steep and the bottom section is near the slide zone — check status",
      "Realistically this is the 'if we're feeling great Sunday morning' stretch goal",
    ],
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold">
      {children}
    </h2>
  );
}

export default function BackpackingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
      {/* Hero */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-soft-gold-dark dark:text-soft-gold">
          Brooker &amp; co. expedition
        </p>
        <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-5xl font-bold sm:text-6xl">
          ⛰️ High Peaks Backpacking
        </h1>
        <p className="mt-3 text-lg opacity-80">
          Sat Aug 15 – Sun Aug 16, 2026 · Adirondak Loj (Heart Lake) · Matt, Liam
          {" "}&amp; maybe Dan
        </p>
      </div>

      {/* Closure alert — updated from DEC research */}
      <div
        id="closure"
        className="mb-10 rounded-2xl border-2 border-soft-gold bg-soft-gold/15 p-5"
      >
        <h2 className="font-semibold">⚠️ Avalanche Pass Trail is CLOSED (slide damage)</h2>
        <p className="mt-1 text-sm leading-relaxed">
          The classic Loj → Avalanche Lake → Lake Colden route is closed between the Lake Arnold
          Trail junction and the south end of Avalanche Lake (July 2025 landslide; crews are
          rebuilding it this summer). <strong>Detour: the Lake Arnold Trail</strong> gets us to Lake
          Colden from Marcy Dam — expect mud and wet crossings near Lake Arnold. The two Avalanche
          Lake campsites are also closed. Check the{" "}
          <a
            className="underline"
            href="https://dec.ny.gov/places/adirondack-backcountry-information"
            target="_blank"
            rel="noopener noreferrer"
          >
            DEC Adirondack Backcountry Information page
          </a>{" "}
          the week of the trip — status is changing week to week.
        </p>
      </div>

      {/* Quick facts */}
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["🚗 Drive", "≈2 hrs from Greenwich → Adirondak Loj, 1002 Adirondak Loj Rd, Lake Placid"],
          ["🅿️ Parking", "Paid lot at the Loj (ADK), first-come — arrive by 7 AM on an August Saturday"],
          ["📋 Permits", "None needed on this side (that's the AMR/Indian Head system, not here). Sign the trail register"],
          ["🐻 Bear cans", "REQUIRED overnight in the Eastern High Peaks — rentals at the High Peaks Info Center"],
        ].map(([title, body]) => (
          <div key={title} className="soft-card dark:soft-card-dark p-4">
            <div className="font-semibold">{title}</div>
            <p className="mt-1 text-sm opacity-80">{body}</p>
          </div>
        ))}
      </div>

      {/* Weather */}
      <div className="mb-12">
        <TripWeather />
      </div>

      {/* The plan */}
      <section className="mb-12">
        <SectionTitle>🗓️ The plan</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="soft-card dark:soft-card-dark p-5">
            <h3 className="font-semibold">Saturday 8/15</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>☀️ ~5:30 AM — leave Greenwich (beat the parking rush)</li>
              <li>🅿️ ~7:30 AM — park at the Loj, sign register, sort bear cans</li>
              <li>🥾 8 AM — hike in to camp (Marcy Dam ≈1 hr · Lake Colden side ≈3 hrs)</li>
              <li>⛺ Set up camp, stash overnight stuff, eat lunch (eggs!)</li>
              <li>🏃 Afternoon — summit run #1 with light packs</li>
              <li>🍜 Peak Refuel dinner, everything smellable into the cans</li>
              <li>🌌 Stars. Lake Colden and Heart Lake are properly dark</li>
            </ul>
          </div>
          <div className="soft-card dark:soft-card-dark p-5">
            <h3 className="font-semibold">Sunday 8/16</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>🌅 Light snack at first light — optional quick summit run</li>
              <li>🍳 Big breakfast, break camp, pack out everything</li>
              <li>🥾 Hike out — leave camp by ~11 AM (Colden side) / ~1 PM (Marcy Dam)</li>
              <li>🚗 On the road by ~2–3 PM</li>
              <li>🏡 Home before 5–6 PM (hard stop: 7 PM)</li>
            </ul>
            <p className="mt-3 rounded-lg bg-sage/10 px-3 py-2 text-xs">
              The Sunday math is the constraint: from a Lake Colden camp it&apos;s ≈3–3.5 hrs out
              with full packs, so a Sunday summit means alpine start.
            </p>
          </div>
        </div>
      </section>

      {/* Route options */}
      <section className="mb-12">
        <SectionTitle>🥾 Route options</SectionTitle>
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="soft-card dark:soft-card-dark border-l-4 border-l-forest p-5">
            <h3 className="font-semibold">Plan A — Marcy focus (if Dan&apos;s out)</h3>
            <p className="mt-1 text-sm opacity-80">
              Base at <strong>Marcy Dam</strong> (short 2.3 mi carry-in, tent sites + nearby
              lean-tos). Saturday: Marcy via Van Hoevenberg with daypacks. Sunday: optional Phelps
              (≈4 mi RT from camp) or Tabletop, then an easy stroll out. Zero dependence on the
              closure, maximum summit time, easiest Sunday exit.
            </p>
          </div>
          <div className="soft-card dark:soft-card-dark border-l-4 border-l-deep-plum p-5">
            <h3 className="font-semibold">Plan B — Marshall + friends (if Dan&apos;s in)</h3>
            <p className="mt-1 text-sm opacity-80">
              Carry over <strong>Lake Arnold to the Lake Colden / Flowed Lands area</strong> (≈5.5
              mi with packs, muddy). Saturday: Marshall via Herbert Brook (Dan&apos;s 46er) — wreck
              detour if time allows. Sunday: Colden on the way back over Lake Arnold, or straight
              out. Algonquin/Wright/Iroquois realistically becomes its own future trip from this
              side while the pass is closed.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {DAY_ROUTES.map((r) => (
            <div key={r.name} className="soft-card dark:soft-card-dark p-5">
              <h3 className="font-semibold">{r.name}</h3>
              <p className="mt-1 text-xs font-semibold opacity-70">{r.stats}</p>
              <p className="mt-0.5 text-xs opacity-70">{r.from}</p>
              <p className="mt-2 text-sm">{r.vibe}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs opacity-80">
                {r.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                {r.alltrails && (
                  <a
                    className="rounded-full bg-forest px-3 py-1.5 font-semibold text-cream dark:bg-soft-gold dark:text-forest-dark"
                    href={r.alltrails}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AllTrails ↗
                  </a>
                )}
                {r.extra && (
                  <a
                    className="rounded-full border border-sage/40 px-3 py-1.5 font-semibold"
                    href={r.extra.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {r.extra.label} ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm opacity-75">
          🗺️ Paper maps are packed; also download offline maps and see the{" "}
          <a
            className="underline"
            href="https://caltopo.com/map.html#ll=44.1266,-73.9672&z=13"
            target="_blank"
            rel="noopener noreferrer"
          >
            CalTopo map of the area
          </a>{" "}
          and DEC&apos;s{" "}
          <a
            className="underline"
            href="https://dec.ny.gov/places/high-peaks-wilderness"
            target="_blank"
            rel="noopener noreferrer"
          >
            High Peaks Wilderness page
          </a>
          .
        </p>
      </section>

      {/* Where we sleep */}
      <section className="mb-12">
        <SectionTitle>⛺ Where we sleep</SectionTitle>
        <div className="soft-card dark:soft-card-dark p-5 text-sm leading-relaxed">
          <p>
            The Eastern High Peaks is <strong>designated-sites-only</strong> camping (look for the
            yellow &quot;Camp Here&quot; discs), below 3,500 ft, and{" "}
            <strong>no campfires anywhere</strong> — that&apos;s why we bring the stove. Lean-tos
            are first-come, first-served and shared with strangers when full, which is why the tents
            come regardless.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>
              <strong>Marcy Dam area</strong> — designated tent sites + lean-tos nearby (the dam
              pond drained after Irene, still a great basecamp). Plan A home base.
            </li>
            <li>
              <strong>Avalanche Camps lean-tos</strong> — a bit past Marcy Dam toward the pass;
              fine to use, they&apos;re before the closed section.
            </li>
            <li>
              <strong>Lake Colden / Flowed Lands lean-tos + tent sites</strong> — Plan B home base,
              reached via Lake Arnold while the pass is closed.
            </li>
            <li>
              <strong>Avalanche Lake sites — CLOSED</strong> (slide damage). Don&apos;t plan on
              them.
            </li>
          </ul>
          <p className="mt-3 text-xs opacity-70">
            Camp only in designated spots, 15+ ft from water at established sites. Rangers do check.
          </p>
        </div>
      </section>

      {/* Interactive: decisions + gear */}
      <TripBoard />

      {/* Food */}
      <section className="mb-12 mt-12">
        <SectionTitle>🍽️ Food plan (bear-can tetris)</SectionTitle>
        <div className="soft-card dark:soft-card-dark overflow-x-auto p-5">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-sage/25 text-xs uppercase tracking-wide opacity-70">
                <th className="py-2 pr-4">Meal</th>
                <th className="py-2 pr-4">What</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/15">
              <tr>
                <td className="py-2 pr-4 font-medium">Sat lunch</td>
                <td className="py-2 pr-4">Hardboiled eggs + snacks</td>
                <td className="py-2 opacity-80">Eat at camp setup — clears the bulkiest thing out of the can first</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Sat dinner</td>
                <td className="py-2 pr-4">
                  <a
                    className="underline"
                    href="https://www.amazon.com/dp/B0C28YLH8H"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Peak Refuel meals
                  </a>{" "}
                  (1 pouch each)
                </td>
                <td className="py-2 opacity-80">Just add boiling water, eat from the pouch — no dishes</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Sun breakfast</td>
                <td className="py-2 pr-4">Peak Refuel breakfast + oatmeal + coffee</td>
                <td className="py-2 opacity-80">The &quot;big breakfast&quot; — fuel for the hike out</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Trail + summit</td>
                <td className="py-2 pr-4">Bars, trail mix, jerky (each person)</td>
                <td className="py-2 opacity-80">Dense, no-crush, no-cook. ~2,500+ cal/person/day total</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 rounded-lg bg-soft-gold/15 px-4 py-3 text-sm">
            <strong>Space rules:</strong> one bear can does not fit 2–3 people × 2 days once trash
            and toiletries join. Rent can #2 at the High Peaks Info Center at the trailhead.
            Repackage everything (no boxes, no cans), squeeze the air out of bags, and remember
            trash rides home in the can too.
          </div>
        </div>
      </section>

      {/* Water */}
      <section className="mb-12">
        <SectionTitle>💧 Water</SectionTitle>
        <div className="soft-card dark:soft-card-dark p-5 text-sm leading-relaxed">
          <p>
            Water is everywhere on these routes — Marcy Brook at Marcy Dam, Phelps Brook on the
            Van Hoevenberg trail, the Opalescent and Herbert Brook on the Colden side — but{" "}
            <strong>treat all of it</strong> (giardia is real in the High Peaks).
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li><strong>Primary:</strong> pump filter — fastest for filling the 3L bladders at camp</li>
            <li><strong>On the move:</strong> UV sterilizer for quick bottle refills</li>
            <li><strong>Backup:</strong> iodine tabs live in the med kit, weigh nothing</li>
            <li>Carry ~2L per person on summit runs; tank up at camp with electrolytes</li>
            <li>Dry stretch warning: no reliable water on Marcy&apos;s summit cone — fill at the last brook crossing</li>
          </ul>
        </div>
      </section>

      {/* Bears */}
      <section className="mb-12">
        <SectionTitle>🐻 Bear stuff (required, not optional)</SectionTitle>
        <div className="soft-card dark:soft-card-dark p-5 text-sm leading-relaxed">
          <p>
            The Eastern High Peaks requires <strong>bear-resistant canisters for all overnight
            campers</strong> — it&apos;s regulation, and the Marcy Dam / Lake Colden corridor is
            exactly where the habituated bears are. Hanging food is not legal here.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>EVERYTHING smellable goes in: food, trash, toothpaste, sunscreen, bug spray, electrolyte powder</li>
            <li>Stash cans 100+ ft downwind of the tents, lid down, not near water or a cliff edge</li>
            <li>Cook and eat away from the tents; never bring so much as a granola bar inside</li>
            <li>
              Read DEC&apos;s{" "}
              <a
                className="underline"
                href="https://dec.ny.gov/nature/animals-fish-plants/black-bear/reduce-conflicts"
                target="_blank"
                rel="noopener noreferrer"
              >
                bear canister rules
              </a>{" "}
              — rangers ticket for missing cans
            </li>
          </ul>
        </div>
      </section>

      {/* Liam 101 */}
      <section className="mb-12">
        <SectionTitle>🌲 First-timer notes (Liam, this one&apos;s yours)</SectionTitle>
        <div className="soft-card dark:soft-card-dark p-5 text-sm leading-relaxed">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>The area:</strong> we&apos;re basing out of Heart Lake in the High Peaks
              Wilderness — the most rugged terrain in New York. Trails here are rockier, muddier,
              and slower than the mileage suggests. 1.5 mph with a full pack is normal.
            </li>
            <li>
              <strong>Footwear:</strong> broken-in trail runners or boots with real tread. Your feet
              WILL get wet on the Lake Arnold side; wool socks + a dry camp pair is the system.
            </li>
            <li>
              <strong>No cotton:</strong> cotton soaks and chills. Synthetic or wool everything.
            </li>
            <li>
              <strong>Pack weight:</strong> aim under ~30 lbs with water. If your pack situation is
              uncertain, claim the loaner on the gear list and we&apos;ll fit it at the gear check.
            </li>
            <li>
              <strong>Weather flips fast:</strong> summits can be 40s°F and gusty while the trailhead
              is 75°F. The puffy + rain shell combo is non-negotiable even if Saturday looks sunny.
            </li>
            <li>
              <strong>No cell service</strong> past the trailhead. Tell someone at home the plan
              (this page is the plan!). We sign trail registers in and out.
            </li>
            <li>
              <strong>Leave No Trace:</strong> pack out all trash, stay on trail (mud included —
              walk through it, not around it), use the privies, and keep 150 ft from water for any
              washing.
            </li>
          </ul>
        </div>
      </section>

      {/* Links */}
      <section className="mb-4">
        <SectionTitle>🔗 The link shelf</SectionTitle>
        <div className="soft-card dark:soft-card-dark grid gap-2 p-5 text-sm sm:grid-cols-2">
          {[
            ["DEC Adirondack Backcountry Info (trail conditions)", "https://dec.ny.gov/places/adirondack-backcountry-information"],
            ["DEC High Peaks Wilderness (rules + closures)", "https://dec.ny.gov/places/high-peaks-wilderness"],
            ["ADK Heart Lake / Adirondak Loj (parking + rentals)", "https://adk.org/visit/heart-lake-program-center/"],
            ["High Peaks Info Center (bear can rental)", "https://adk.org/visit/high-peaks-information-center/"],
            ["NWS forecast — Lake Colden", "https://forecast.weather.gov/MapClick.php?lat=44.1266&lon=-73.9672"],
            ["CalTopo map of the corridor", "https://caltopo.com/map.html#ll=44.1266,-73.9672&z=13"],
            ["Peak Refuel meals (what we're eating)", "https://www.amazon.com/dp/B0C28YLH8H"],
            ["ADK trail conditions report", "https://adk.org/trail-conditions/"],
          ].map(([label, href]) => (
            <a
              key={href}
              className="underline opacity-85 hover:opacity-100"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
