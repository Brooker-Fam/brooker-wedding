import Link from "next/link";
import TripWeather from "@/components/backpacking/TripWeather";
import SectionTitle from "@/components/backpacking/SectionTitle";

export default function BackpackingOverviewPage() {
  return (
    <div>
      {/* Closure alert — verified against DEC/ADK Aug 6-7, 2026 */}
      <div className="mb-8 rounded-2xl border-2 border-soft-gold bg-soft-gold/15 p-5">
        <h2 className="font-semibold">⚠️ Avalanche Pass Trail is CLOSED (confirmed Aug 6, 2026)</h2>
        <p className="mt-1 text-sm leading-relaxed">
          The classic Loj → Avalanche Lake → Lake Colden route is closed at the 2025 slide, with{" "}
          <strong>no published reopening date</strong>. The workarounds (Lake Arnold detour,
          Upper Works approach) each have their own catch — the{" "}
          <Link className="underline" href="/backpacking-2026/routes">
            Routes page
          </Link>{" "}
          lays it all out. Re-check the{" "}
          <a
            className="underline"
            href="https://dec.ny.gov/things-to-do/hiking/adirondack-backcountry/backcountry-information-for-adirondack-park"
            target="_blank"
            rel="noopener noreferrer"
          >
            DEC backcountry info page
          </a>{" "}
          and the{" "}
          <a
            className="underline"
            href="https://adk.org/high-peaks-conditions-report/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ADK conditions report
          </a>{" "}
          the week of the trip.
        </p>
      </div>

      {/* Quick facts */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["🚗 Drive", "≈2½ hrs Greenwich → Adirondak Loj (I-87 exit 30) · ≈2¾ hrs → Upper Works (exit 29, then slow county roads). Verify in Maps — search tools confuse Greenwich NY with Greenwich CT"],
          ["🅿️ Parking", "Loj: $25/day non-member ($10 ADK member), first-come — lots fill BEFORE 6 AM summer Saturdays. Multi-day allowed; call HPIC (518-523-3441 x121) about overnight billing. Upper Works: free"],
          ["📋 Permits", "None needed on this side (that's the AMR/Indian Head system, not here). Sign the trail register"],
          ["🐻 Bear cans", "REQUIRED for overnights in the Eastern High Peaks Apr 1–Nov 30 — rentals at the High Peaks Info Center at the Loj"],
        ].map(([title, body]) => (
          <div key={title} className="soft-card dark:soft-card-dark p-4">
            <div className="font-semibold">{title}</div>
            <p className="mt-1 text-sm opacity-80">{body}</p>
          </div>
        ))}
      </div>

      {/* Weather */}
      <div className="mb-10">
        <TripWeather />
      </div>

      {/* The plan */}
      <section className="mb-10">
        <SectionTitle>🗓️ The plan</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="soft-card dark:soft-card-dark p-5">
            <h3 className="font-semibold">Saturday 8/15</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                ☀️ Leave Greenwich ~3:15 AM for the Loj (ADK: lots fill <em>before 6 AM</em> on
                summer Saturdays, and full = turned away) · Upper Works is mellower — ~5 AM works
                for its 60-car free lot
              </li>
              <li>🅿️ Park, sign the register, sort bear cans (rent #2 at HPIC if we&apos;re at the Loj)</li>
              <li>🥾 Hike in to camp (1–4 hrs depending on the route pick)</li>
              <li>⛺ Set up camp, stash overnight stuff, eat lunch (eggs!)</li>
              <li>🏃 Afternoon — summit run #1 with light packs</li>
              <li>🍜 Peak Refuel dinner, everything smellable into the cans</li>
              <li>🌇 Sunset 8:02 PM — the valley walls steal usable light well before that</li>
            </ul>
          </div>
          <div className="soft-card dark:soft-card-dark p-5">
            <h3 className="font-semibold">Sunday 8/16</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>🌅 Sunrise 5:59 AM — light snack at first light, optional quick summit run</li>
              <li>🍳 Big breakfast, break camp, pack out everything</li>
              <li>
                🥾 Hike out — the{" "}
                <Link className="underline" href="/backpacking-2026/routes">
                  route decider
                </Link>{" "}
                computes the exact leave-camp deadline
              </li>
              <li>🚗 On the road by ~2–3 PM</li>
              <li>🏡 Home before 5–6 PM (hard stop: 7 PM)</li>
            </ul>
            <p className="mt-3 rounded-lg bg-sage/10 px-3 py-2 text-xs">
              The Sunday math is the real constraint — a Sunday summit run means an alpine start
              from the farther camps. Each route card shows the deadline.
            </p>
          </div>
        </div>
      </section>

      {/* Where next */}
      <section>
        <SectionTitle>👇 Dig in</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              href: "/backpacking-2026/routes",
              title: "🧭 Routes",
              body: "The interactive decider: pick trailhead + basecamp, get the carry, the summit menu, and the Sunday deadline for each option.",
            },
            {
              href: "/backpacking-2026/gear",
              title: "🎒 Gear & Votes",
              body: "Claim what you're bringing, tick it off as it's packed, and vote on the open questions (Dan? gear-check night? tents?).",
            },
            {
              href: "/backpacking-2026/guide",
              title: "🌲 Camp Guide",
              body: "Where we sleep, the food plan, water treatment, bear rules, and first-timer notes for Liam.",
            },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="soft-card dark:soft-card-dark game-card-hover block p-5"
            >
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm opacity-80">{c.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
