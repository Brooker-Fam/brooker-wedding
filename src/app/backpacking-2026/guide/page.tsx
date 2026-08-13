import type { Metadata } from "next";
import SectionTitle from "@/components/backpacking/SectionTitle";

export const metadata: Metadata = {
  title: "Camp Guide — High Peaks Backpacking",
};

export default function GuidePage() {
  return (
    <div>
      {/* Where we sleep */}
      <section className="mb-12">
        <SectionTitle>⛺ Where we sleep</SectionTitle>
        <div className="soft-card dark:soft-card-dark p-5 text-sm leading-relaxed">
          <p>
            Eastern High Peaks rules (per{" "}
            <a
              className="underline"
              href="https://dec.ny.gov/places/high-peaks-wilderness-complex"
              target="_blank"
              rel="noopener noreferrer"
            >
              DEC
            </a>
            ): camp in designated sites (yellow &quot;Camp Here&quot; discs) whenever possible —
            at-large camping is legal only 150+ ft from any road, trail, or water. No camping above
            3,500 ft except at a lean-to, <strong>no campfires anywhere in the Eastern Zone</strong>{" "}
            (that&apos;s why we bring the stove), and overnight groups max out at 8. Lean-tos are
            first-come, first-served and shared with strangers when full, which is why the tents
            come regardless.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>
              <strong>Lake Colden — our camp.</strong> Lean-tos and designated tent sites around
              the lake, a staffed ranger outpost nearby, no closure notices. Lean-tos are
              first-come — whoever&apos;s ahead of the group claims one, tents come regardless.
            </li>
            <li>
              <strong>Flowed Lands — the bail-out camp</strong>, one mile earlier on the same
              trail. Lean-tos + tent sites with the big Colden view. If the carry goes long or
              Lake Colden is full, we stop here and nothing else changes much.
            </li>
            <li>
              <strong>Avalanche Lake sites — CLOSED</strong> (slide damage). Not on our route
              anyway — the whole Loj side is out of the plan while the pass is shut.
            </li>
          </ul>
          <p className="mt-3 text-xs opacity-70">
            Rangers patrol this corridor more than anywhere in the park — the rules above get
            enforced.
          </p>
        </div>
      </section>

      {/* Food */}
      <section className="mb-12">
        <SectionTitle>🍽️ Food plan (one-can tetris)</SectionTitle>
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
            <strong>Space rules:</strong> we&apos;re taking <strong>ONE can for the two of
            us</strong>, which fits — but only if we pack it properly. Repackage everything at home
            (no boxes, no cans, no glass), squeeze the air out of every bag, eat the bulkiest food
            first, and remember trash rides home in there too. Nothing smellable sleeps outside
            it, including toothpaste and sunscreen.
          </div>
        </div>
      </section>

      {/* Water */}
      <section className="mb-12">
        <SectionTitle>💧 Water</SectionTitle>
        <div className="soft-card dark:soft-card-dark p-5 text-sm leading-relaxed">
          <p>
            Water is everywhere on these routes — Calamity Brook on the carry-in, the lake and the
            Opalescent at camp, Herbert Brook on the Marshall path, Feldspar Brook on the way to
            Marcy — but <strong>treat all of it</strong> (giardia is real in the High Peaks).
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li><strong>Primary:</strong> pump filter — fastest for filling the 3L bladders at camp</li>
            <li><strong>On the move:</strong> UV sterilizer for quick bottle refills</li>
            <li><strong>Backup:</strong> iodine tabs live in the med kit, weigh nothing</li>
            <li>Carry ~2L per person on summit runs; tank up at camp with electrolytes</li>
            <li>
              <strong>Last-water points:</strong> Lake Tear of the Clouds is the last reliable fill
              before Marcy&apos;s summit cone from our side; on the Algonquin climb from the lake,
              fill where the trail leaves the brook — the upper mountain is dry
            </li>
          </ul>
        </div>
      </section>

      {/* Bears */}
      <section className="mb-12">
        <SectionTitle>🐻 Bear stuff (required, not optional)</SectionTitle>
        <div className="soft-card dark:soft-card-dark p-5 text-sm leading-relaxed">
          <p>
            The Eastern High Peaks requires <strong>bear-resistant canisters for all overnight
            campers</strong> — it&apos;s regulation, and Lake Colden is exactly where the
            habituated bears are. Hanging food is not legal here.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>EVERYTHING smellable goes in the one can: food, trash, toothpaste, sunscreen, bug spray, electrolyte powder</li>
            <li>Stash the can 100+ ft downwind of the tents, lid down, not near water or a cliff edge</li>
            <li>Cook and eat away from the tents; never bring so much as a granola bar inside</li>
            <li>
              Required April 1 – Nov 30; hangs and stuff sacks don&apos;t count. Read DEC&apos;s{" "}
              <a
                className="underline"
                href="https://dec.ny.gov/nature/animals-fish-plants/black-bear/management/bear-resistant-canisters"
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
              <strong>The area:</strong> we&apos;re heading into the High Peaks Wilderness — the
              most rugged terrain in New York. Trails here are rockier, muddier, and slower than
              the mileage suggests. 1.5 mph with a full pack is normal.
            </li>
            <li>
              <strong>Footwear:</strong> broken-in trail runners or boots with real tread. Wet feet
              are likely; wool socks + a dry camp pair is the system.
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
              (this site is the plan!). We sign trail registers in and out.
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
            ["DEC Adirondack Backcountry Info (trail conditions, updated weekly)", "https://dec.ny.gov/things-to-do/hiking/adirondack-backcountry/backcountry-information-for-adirondack-park"],
            ["ADK High Peaks Conditions Report (updated Fridays)", "https://adk.org/high-peaks-conditions-report/"],
            ["DEC High Peaks Wilderness (rules + closures)", "https://dec.ny.gov/places/high-peaks-wilderness-complex"],
            ["NWS forecast — Lake Colden", "https://forecast.weather.gov/MapClick.php?lat=44.1266&lon=-73.9672"],
            ["CalTopo map of the corridor", "https://caltopo.com/map.html#ll=44.1266,-73.9672&z=13"],
            ["Peak Refuel meals (what we're eating)", "https://www.amazon.com/dp/B0C28YLH8H"],
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
