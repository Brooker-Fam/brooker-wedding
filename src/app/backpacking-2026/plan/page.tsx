import type { Metadata } from "next";
import Link from "next/link";
import SectionTitle from "@/components/backpacking/SectionTitle";

export const metadata: Metadata = {
  title: "The plan (archive) — High Peaks Backpacking, Aug 15–16, 2026",
  description: "What we planned before the trip: the Lake Colden decision, logistics and the two-day schedule.",
  robots: { index: false },
};

export default function BackpackingPlanPage() {
  return (
    <div>
      {/* Camp decision + closure context — verified against DEC/ADK Aug 6-7, 2026 */}
      <div className="mb-8 rounded-2xl border-2 border-soft-gold bg-soft-gold/15 p-5">
        <h2 className="font-semibold">
          ✅ Decided: we camp at Lake Colden, in from Upper Works
        </h2>
        <p className="mt-1 text-sm leading-relaxed">
          The classic Loj-side approach through Avalanche Pass is closed at the 2025 slide with no
          reopening date, so we come in from the south — Upper Works → Calamity Brook → Lake Colden
          (Flowed Lands is the bail-out camp). The catch to watch: the Calamity Brook high-water
          bridge is out (easy rock-hop when dry, no-go after a deluge). The{" "}
          <Link className="underline" href="/backpacking-2026/routes">
            Routes page
          </Link>{" "}
          has the mile-by-mile. Re-check the{" "}
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
          ["🚗 Drive", "≈2¾ hrs Greenwich → Upper Works (I-87 exit 29, then slow county roads). Verify in Maps — search tools confuse Greenwich NY with Greenwich CT. Directions on the Routes page"],
          ["🅿️ Parking", "Upper Works is free, 60 cars, and rarely fills — no pre-dawn panic. Leaving Greenwich ~5 AM puts us on trail by 8"],
          ["📋 Permits", "None needed on this side (that's the AMR/Indian Head system, not here). Sign the trail register"],
          ["🐻 Bear can", "REQUIRED for overnights in the Eastern High Peaks Apr 1–Nov 30. We're taking ONE for the two of us — everything smellable has to fit, so repackage at home"],
        ].map(([title, body]) => (
          <div key={title} className="soft-card dark:soft-card-dark p-4">
            <div className="font-semibold">{title}</div>
            <p className="mt-1 text-sm opacity-80">{body}</p>
          </div>
        ))}
      </div>

      {/* The plan */}
      <section className="mb-10">
        <SectionTitle>🗓️ The plan</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="soft-card dark:soft-card-dark p-5">
            <h3 className="font-semibold">Saturday 8/15</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                ☀️ Leave Greenwich ~5 AM for Upper Works (60-car free lot, rarely fills) — the
                can packed and closed the night before
              </li>
              <li>🅿️ Park, sign the register at the trailhead</li>
              <li>🥾 Carry in to Lake Colden — ≈5.6 mi, 3–4 hrs with full packs</li>
              <li>⛺ Set up camp, stash overnight stuff, eat lunch (eggs!)</li>
              <li>🏃 Afternoon — summit run #1 with light packs</li>
              <li>🍜 Peak Refuel dinner, everything smellable back into the can</li>
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

      {/* How it actually went */}
      <section className="mb-10">
        <SectionTitle>🏔️ How it actually went</SectionTitle>
        <Link
          href="/backpacking-2026"
          className="soft-card dark:soft-card-dark game-card-hover block p-5"
        >
          <h3 className="font-semibold">📊 The recap</h3>
          <p className="mt-1 text-sm opacity-80">
            We went, and we got greedy: six High Peaks instead of the planned handful, 36.5 miles
            and 9,840 feet of climbing across the two days. Every number, plus the photos.
          </p>
        </Link>
      </section>

      {/* Where next */}
      <section>
        <SectionTitle>👇 The rest of the planning</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              href: "/backpacking-2026/routes",
              title: "🧭 Routes",
              body: "The Lake Colden plan: the carry-in, the full summit menu (Marcy, Gray, Skylight, Algonquin, Marshall, Colden…), and the mile-by-mile route book.",
            },
            {
              href: "/backpacking-2026/weather",
              title: "🌦️ Weather",
              body: "Hour by hour: when the rain starts, how much falls, whether there's thunder in it, and what the summits are doing versus camp.",
            },
            {
              href: "/backpacking-2026/gear",
              title: "🎒 Gear & Votes",
              body: "Claim what you're bringing, tick it off as it's packed, and vote on the open questions (gear-check night, tents, Saturday's summit).",
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
