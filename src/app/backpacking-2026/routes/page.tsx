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
