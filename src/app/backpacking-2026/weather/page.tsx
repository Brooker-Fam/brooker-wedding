import type { Metadata } from "next";
import Link from "next/link";
import HourlyWeather from "@/components/backpacking/HourlyWeather";
import TripWeather from "@/components/backpacking/TripWeather";
import SectionTitle from "@/components/backpacking/SectionTitle";

export const metadata: Metadata = {
  title: "Weather — High Peaks Backpacking",
};

export default function WeatherPage() {
  return (
    <div>
      <SectionTitle>🌦️ Hour by hour</SectionTitle>
      <p className="mb-5 text-sm opacity-80">
        The daily forecast says &quot;chance of showers Saturday&quot;, which is useless for
        deciding when to leave camp. This is the hourly version: when the rain starts, how much
        actually falls, and whether there&apos;s thunder in it.
      </p>
      <HourlyWeather />

      <section className="mt-12">
        <SectionTitle>📅 The day-by-day view</SectionTitle>
        <TripWeather showHourlyLink={false} />
      </section>

      <section className="mt-12">
        <SectionTitle>🧠 How to read this before a summit day</SectionTitle>
        <div className="soft-card dark:soft-card-dark p-5 text-sm leading-relaxed">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Thunder beats everything.</strong> Any thunderstorm in the window and the
              above-treeline sections of{" "}
              <Link className="underline" href="/backpacking-2026/routes#route-marcy-feldspar">
                Marcy
              </Link>{" "}
              and{" "}
              <Link className="underline" href="/backpacking-2026/routes#route-algonquin-lc">
                Algonquin
              </Link>{" "}
              are off. Those summits are exposed rock with nowhere to go — you want to be below
              treeline before it arrives, not deciding once it has.
            </li>
            <li>
              <strong>Afternoon storms are the August default here</strong>, not a surprise. That is
              the whole argument for an alpine start: summit by noon, treeline by 2 PM.
            </li>
            <li>
              <strong>Rain changes which routes are safe, not just pleasant.</strong> The{" "}
              <Link className="underline" href="/backpacking-2026/routes#route-colden-west">
                Colden ladders
              </Link>{" "}
              get genuinely dangerous wet — swap for{" "}
              <Link className="underline" href="/backpacking-2026/routes#route-marshall-herbert">
                Marshall
              </Link>{" "}
              if it&apos;s coming down.
            </li>
            <li>
              <strong>Heavy rain can cancel the Upper Works plans entirely.</strong> The washed-out
              Calamity Brook crossing is an easy rock-hop in normal flows and impassable after a
              deluge. Look at the 24 hours <em>before</em> Saturday, not just Saturday — the brook
              responds to what already fell.
            </li>
            <li>
              <strong>The valley number is not the summit number.</strong> Flip the toggle above.
              A pleasant 72°F at camp is around 63°F on Marcy before you add wind, and wind up there
              routinely runs two to three times what the valley sees.
            </li>
            <li>
              <strong>Re-check the morning we leave.</strong> This page is live NWS data, so it
              updates on every reload — but there&apos;s no cell service past the trailhead.
              Whatever we read in the car is what we&apos;re working with all weekend.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle>🔗 Other forecasts worth a look</SectionTitle>
        <div className="soft-card dark:soft-card-dark grid gap-2 p-5 text-sm sm:grid-cols-2">
          {[
            [
              "NWS point forecast — Lake Colden",
              "https://forecast.weather.gov/MapClick.php?lat=44.1266&lon=-73.9672",
            ],
            [
              "NWS point forecast — Mount Marcy summit",
              "https://forecast.weather.gov/MapClick.php?lat=44.1126&lon=-73.9235",
            ],
            [
              "NWS Burlington — Adirondack forecast discussion",
              "https://forecast.weather.gov/product.php?site=BTV&product=AFD&issuedby=BTV",
            ],
            ["Mountain-Forecast — Mount Marcy by elevation", "https://www.mountain-forecast.com/peaks/Mount-Marcy/forecasts/1629"],
            ["ADK High Peaks conditions report (updated Fridays)", "https://adk.org/high-peaks-conditions-report/"],
            [
              "DEC Adirondack backcountry info",
              "https://dec.ny.gov/things-to-do/hiking/adirondack-backcountry/backcountry-information-for-adirondack-park",
            ],
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
