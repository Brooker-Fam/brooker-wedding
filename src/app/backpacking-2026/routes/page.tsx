import type { Metadata } from "next";
import RouteDecider from "@/components/backpacking/RouteDecider";
import SectionTitle from "@/components/backpacking/SectionTitle";

export const metadata: Metadata = {
  title: "Routes — High Peaks Backpacking",
};

export default function RoutesPage() {
  return (
    <div>
      <SectionTitle>🧭 Route decider — pick your adventure</SectionTitle>
      <p className="mb-5 text-sm opacity-80">
        Where we camp decides what we can climb and when we have to leave. Toggle the options —
        every card recalculates the carry, the summit menu, and the Sunday
        get-Matt-home-by-dinner deadline.
      </p>
      <RouteDecider />

      {/* The wreck */}
      <section className="mt-10">
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
