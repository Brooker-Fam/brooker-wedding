import type { Metadata } from "next";
import RouteDecider from "@/components/backpacking/RouteDecider";
import RouteLibrary from "@/components/backpacking/RouteLibrary";
import TrailheadDirections from "@/components/backpacking/TrailheadDirections";
import SectionTitle from "@/components/backpacking/SectionTitle";

export const metadata: Metadata = {
  title: "Routes — High Peaks Backpacking",
};

export default function RoutesPage() {
  return (
    <div>
      <SectionTitle>🧭 The plan — Lake Colden via Upper Works</SectionTitle>
      <p className="mb-5 text-sm opacity-80">
        Decided: we carry in from Upper Works and camp at <strong>Lake Colden</strong>. Flowed
        Lands stays on the board as the bail-out camp if the carry goes long or the sites are
        taken. Each card shows the carry, the summit menu, and the Sunday
        get-Matt-home-by-dinner deadline; the{" "}
        <a className="underline" href="#route-library">
          mile-by-mile route book
        </a>{" "}
        below has every junction.
      </p>
      <RouteDecider />

      {/* Getting there */}
      <section id="getting-there" className="mt-12 scroll-mt-24">
        <SectionTitle>🚗 Getting to Upper Works</SectionTitle>
        <p className="mb-5 text-sm opacity-80">
          Cell service dies partway up Tahawus Rd and never comes back, so the written directions
          matter as much as the links. Screenshot this before leaving.
        </p>
        <TrailheadDirections />
      </section>

      {/* Mile-by-mile */}
      <section id="route-library" className="mt-12 scroll-mt-24">
        <SectionTitle>📖 The route book — every junction, mile by mile</SectionTitle>
        <p className="mb-5 text-sm opacity-80">
          How to actually walk each route from camp: cumulative mileage, which way to turn at each
          junction, where the water is, and the specific spots where people get it wrong. Tap any
          route to open it. Distances marked <em>estimated mileage</em> are derived rather than
          published — trust the junction order, sanity-check the numbers.
        </p>
        <RouteLibrary />
      </section>

      {/* The wreck */}
      <section className="mt-12">
        <SectionTitle>✈️ The plane wreck — the real story</SectionTitle>
        <div className="soft-card dark:soft-card-dark p-5 text-sm leading-relaxed">
          <p>
            Just after midnight on <strong>August 10, 1969</strong>, F. Peter Simmons — a Grumman
            employee flying his Piper Cherokee 140 from Long Island to a family camp near Tupper
            Lake — flew into the col between Marshall and Iroquois at ~3,800 ft. The NTSB called it
            spatial disorientation; he blamed downdrafts. <strong>He survived</strong>: campers at
            Lake Colden heard the impact, search planes first misidentified the site as Marcy, and
            Ranger Gary Hodgson reached him more than 20 hours later. He was airlifted out the next
            morning with a fractured skull, crushed eye socket, and a broken jaw, leg, ankle, and
            wrist — and recovered.
          </p>
          <p className="mt-2">
            The fuselage is still up there, one wing broken off alongside, about{" "}
            <strong>100 ft west of the Cold Brook Pass trail behind a ten-foot boulder</strong>,
            roughly a third of a mile below the top of the pass. No published GPS exists and people
            walk right past it. From the Lake Colden dam it&apos;s about a 2-hour round-trip detour.
          </p>
          <p className="mt-2 rounded-lg bg-soft-gold/15 px-3 py-2 text-xs">
            ⚠️ The catch: DEC officially calls the Cold Brook Pass trail &quot;not a viable
            option&quot; — unmaintained for 10+ years. The newest trip report anyone can find is
            2023 (&quot;brushy but followable&quot;). Dry day, fresh legs, group decision — or save
            it for the next trip.
          </p>
          <p className="mt-3 text-xs">
            <a
              className="underline opacity-80 hover:opacity-100"
              href="https://aviationweek.com/air-transport/aircraft-archaeology-high-adirondacks"
              target="_blank"
              rel="noopener noreferrer"
            >
              Aviation Week: Aircraft Archaeology in the High Adirondacks ↗
            </a>{" "}
            ·{" "}
            <a
              className="underline opacity-80 hover:opacity-100"
              href="https://www.adirondackexplorer.org/communities/history/adirondacks-plane-crash-wreckage/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Adirondack Explorer on the wreck ↗
            </a>{" "}
            ·{" "}
            <a
              className="underline opacity-80 hover:opacity-100"
              href="https://asn.flightsafety.org/wikibase/169392"
              target="_blank"
              rel="noopener noreferrer"
            >
              ASN accident record ↗
            </a>
          </p>
        </div>
      </section>

      <p className="mt-5 text-sm opacity-75">
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
          href="https://dec.ny.gov/places/high-peaks-wilderness-complex"
          target="_blank"
          rel="noopener noreferrer"
        >
          High Peaks Wilderness page
        </a>
        .
      </p>
    </div>
  );
}
