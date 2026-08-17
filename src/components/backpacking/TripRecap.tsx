"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * The weekend, as recorded. Distance / vert / moving time / calories / HR
 * come off the four Strava activities from Aug 15-16, 2026. Steps and
 * elapsed time come off the same four on Garmin, which counts both
 * directly. Nothing here is estimated.
 * ------------------------------------------------------------------ */

type Day = "Sat" | "Sun";

type Hike = {
  n: number;
  day: Day;
  short: string;
  name: string;
  date: string;
  strava: string;
  map: string;
  packs: "full" | "light";
  miles: number;
  ft: number;
  sec: number;
  kcal: number;
  hrAvg: number;
  hrMax: number;
  steps: number;
  elapsed: number;
  peaks: number;
};

const RAW: Hike[] = [
  {
    n: 1, day: "Sat", short: "Hike in to camp",
    name: "Hike in to Colden / Opalescent lean-to", date: "Sat Aug 15",
    strava: "19779744295", map: "/backpacking/route-hike-in.jpg", packs: "full",
    miles: 7.48, ft: 1287, sec: 11592, kcal: 1122, hrAvg: 114, hrMax: 157,
    steps: 16030, elapsed: 11817, peaks: 0,
  },
  {
    n: 2, day: "Sat", short: "Marcy trio",
    name: "Marcy · Skylight · Gray", date: "Sat Aug 15",
    strava: "19779846297", map: "/backpacking/route-marcy-trio.jpg", packs: "light",
    miles: 12.0, ft: 3827, sec: 23818, kcal: 2714, hrAvg: 121, hrMax: 189,
    steps: 28284, elapsed: 30625, peaks: 3,
  },
  {
    n: 3, day: "Sun", short: "Algonquin trio",
    name: "Algonquin · Wright · Iroquois", date: "Sun Aug 16",
    strava: "19779965672", map: "/backpacking/route-algonquin-trio.jpg", packs: "light",
    miles: 11.06, ft: 4517, sec: 29883, kcal: 2758, hrAvg: 110, hrMax: 166,
    steps: 27240, elapsed: 34627, peaks: 3,
  },
  {
    n: 4, day: "Sun", short: "Walk out",
    name: "Back to the car", date: "Sun Aug 16",
    strava: "19779989265", map: "/backpacking/route-walk-out.jpg", packs: "full",
    miles: 6.0, ft: 209, sec: 8777, kcal: 773, hrAvg: 109, hrMax: 156,
    steps: 12798, elapsed: 8833, peaks: 0,
  },
];

const HIKES = RAW.map((h) => ({
  ...h,
  hours: h.sec / 3600,
  ftPerMi: h.ft / h.miles,
  mph: h.miles / (h.sec / 3600),
  // Elapsed runs from first step to last; the gap is time we stood still.
  stopped: h.elapsed - h.sec,
}));

type Row = (typeof HIKES)[number];
type NumKey = "miles" | "ft" | "sec" | "kcal" | "steps" | "peaks" | "elapsed" | "stopped";

const total = (k: NumKey) => HIKES.reduce((a, h) => a + h[k], 0);

const TOT = {
  miles: total("miles"), ft: total("ft"), sec: total("sec"),
  kcal: total("kcal"), steps: total("steps"), peaks: total("peaks"),
  elapsed: total("elapsed"), stopped: total("stopped"),
};

// Weighted by time on foot; a plain mean of the four averages would let the
// 2h40m walk out count as much as the 8h20m Algonquin day.
const AVG_HR = Math.round(HIKES.reduce((a, h) => a + h.hrAvg * h.sec, 0) / TOT.sec);
const MAX_HR = Math.max(...HIKES.map((h) => h.hrMax));

type Peak = { name: string; day: Day; ft: number; rank: number; href: string; note: string };

const PEAKS: Peak[] = [
  {
    name: "Mount Marcy", day: "Sat", ft: 5344, rank: 1,
    href: "https://en.wikipedia.org/wiki/Mount_Marcy",
    note: "The highest point in New York. Ebenezer Emmons named it for Governor William Marcy after the first recorded ascent in August 1837. A month later the writer Charles Fenno Hoffman offered \u201cTahawus\u201d, cloud-splitter, and it was soon taken for the name the mountain had always had. Nobody has found it in use before Hoffman.",
  },
  {
    name: "Mount Skylight", day: "Sat", ft: 4924, rank: 4,
    href: "https://en.wikipedia.org/wiki/Mount_Skylight",
    note: "Named in 1857 by the painter Frederick Perkins and the guide Orson \u201cOld Mountain\u201d Phelps, for a rock formation up top that reads like a window. Hikers used to carry a stone up from below to feed the summit cairn; the practice is discouraged now.",
  },
  {
    name: "Gray Peak", day: "Sat", ft: 4840, rank: 7,
    href: "https://en.wikipedia.org/wiki/Gray_Peak_(New_York)",
    note: "The highest peak in the Adirondacks with no maintained, marked trail to it \u2014 you leave the trail at Lake Tear of the Clouds and follow a herd path up. Verplanck Colvin made the first recorded ascent in 1872 and named it for the botanist Asa Gray.",
  },
  {
    name: "Algonquin Peak", day: "Sun", ft: 5114, rank: 2,
    href: "https://en.wikipedia.org/wiki/Algonquin_Peak",
    note: "Second highest, and the largest alpine tundra in the Adirondacks: 23.5 acres of arctic plants holding on above treeline, with summit stewards posted through the season to keep boots off them. It was Mount McIntyre until Colvin renamed it in 1880.",
  },
  {
    name: "Wright Peak", day: "Sun", ft: 4580, rank: 16,
    href: "https://en.wikipedia.org/wiki/Wright_Peak",
    note: "Colvin named it for Governor Silas Wright in 1873. On 16 January 1962 a B-47 out of Plattsburgh came thirty miles off course in bad weather and hit the mountain; all four crew died. Pieces of the aircraft are still on the summit slabs, beside a plaque.",
  },
  {
    name: "Iroquois Peak", day: "Sun", ft: 4840, rank: 8,
    href: "https://en.wikipedia.org/wiki/Iroquois_Peak",
    note: "No official trail; a cairned herd path runs the 1.1 miles over from Algonquin. Colvin named the pair of them for the Algonquin and the Iroquois, on either side of a boundary he understood to run through the range. The boundary was never actually there.",
  },
];

const ALBUM_URL = "https://photos.app.goo.gl/FRqUvUWCk6c7pfDbA";
const ALBUM_COVER = "/backpacking/album-cover.jpg";

/* -------------------------------- the poem -------------------------------- *
 * No figures in the verse. The standing-still time it used to quote is a stat
 * card now; here that cost is carried by the kneeling, which is also the thread
 * running from the pump through to the lake.                                  */

const WATER_POEM = `Every liter came through the pump:
a squat at the brook's edge,
the handle worked
until the forearms quit.
Two of us drinking in August
sent us back down more often than we wanted.

The brook ran clear off the rock.
We knelt in it a long while.
We believed it was clean.
We pumped it anyway.

A man came down the trail,
dipped his bottle, screwed the cap on,
and drank it walking away.

We went for more that evening
and again in the morning.
The forearm quit before the bottle filled.
We switched hands and finished it.
What rest we got, we got kneeling.

Coming down off Algonquin
we stopped at Lake Colden and went in.
The pump never came out of the pack.
We stayed in until we were cold,
then walked the rest of the way to camp.`;

/* ---------------------------------- utils --------------------------------- */

const comma = (n: number) => Math.round(n).toLocaleString("en-US");

// McDonald's published figure, so the calorie total has a unit anyone can picture.
const DQPC_KCAL = 740;

const niceCeil = (v: number, step: number) => Math.ceil(v / step) * step;
const niceFloor = (v: number, step: number) => Math.floor(v / step) * step;

function fmtHM(sec: number) {
  const m = Math.floor(sec / 60);
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

const col = (d: Day) => (d === "Sat" ? "var(--r-sat)" : "var(--r-sun)");
const wash = (d: Day) => (d === "Sat" ? "var(--r-sat-wash)" : "var(--r-sun-wash)");

/** Bar with a 4px rounded data-end, square at the baseline. */
function barPath(x0: number, y: number, w: number, h: number, r = 4) {
  const rr = Math.min(r, w, h / 2);
  if (w <= 0.5) return "";
  const x1 = x0 + w;
  return `M${x0},${y}H${x1 - rr}A${rr},${rr} 0 0 1 ${x1},${y + rr}V${y + h - rr}A${rr},${rr} 0 0 1 ${x1 - rr},${y + h}H${x0}Z`;
}

/* --------------------------------- styles --------------------------------- *
 * Series colours were validated against the cream / dark-forest chart
 * surfaces for lightness band, chroma, CVD separation and contrast.
 * Gold = Saturday, plum = Sunday, everywhere in this component.            */

const CSS = `
.trip-recap {
  --r-sat: #9E7112;
  --r-sun: #A02F5E;
  --r-sat-wash: rgba(158,113,18,0.12);
  --r-sun-wash: rgba(160,47,94,0.12);
  --r-surface: #FDF8F0;
  --r-ink-2: #3E5A30;
  --r-muted: #6E7F63;
  --r-grid: rgba(92,122,74,0.20);
  --r-axis: rgba(92,122,74,0.40);
}
.dark .trip-recap {
  --r-sat: #B98918;
  --r-sun: #D45B87;
  --r-sat-wash: rgba(185,137,24,0.14);
  --r-sun-wash: rgba(212,91,135,0.14);
  --r-surface: #162618;
  --r-ink-2: #CBDAC4;
  --r-muted: #93A88C;
  --r-grid: rgba(196,154,60,0.20);
  --r-axis: rgba(196,154,60,0.36);
}
.trip-recap svg { display: block; width: 100%; height: auto; }
.trip-recap .r-lbl  { font-size: 11px; font-weight: 600; fill: var(--r-ink-2); }
.trip-recap .r-val  { font-size: 11px; font-weight: 700; fill: currentColor; }
.trip-recap .r-tick { font-size: 10px; fill: var(--r-muted); font-variant-numeric: tabular-nums; }
.trip-recap .r-note { font-size: 10px; font-weight: 600; fill: var(--r-muted); }
.trip-recap .r-hit  { fill: transparent; }
.trip-recap .r-hit:focus-visible { outline: 2px solid var(--r-sat); }
`;

/* -------------------------------- tooltip --------------------------------- */

type Tip = { hike: Row; x: number; y: number } | null;

function Tooltip({ tip }: { tip: Tip }) {
  const [box, setBox] = useState({ w: 260, h: 46 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) setBox({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
  }, [tip]);

  if (!tip) return null;
  const h = tip.hike;

  let left = tip.x + 16;
  if (typeof window !== "undefined" && left + box.w > window.innerWidth - 8) left = tip.x - box.w - 16;
  let top = tip.y - box.h - 14;
  if (top < 8) top = tip.y + 20;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed z-50 max-w-[300px] rounded-xl border border-sage/25 bg-cream px-2.5 py-2 text-xs whitespace-nowrap shadow-lg dark:border-soft-gold/25 dark:bg-[#162618]"
      style={{ left: Math.max(8, left), top }}
    >
      <div className="font-bold">{h.name}</div>
      <div className="mt-0.5 tabular-nums opacity-60">
        {h.miles.toFixed(2)} mi · {comma(h.ft)} ft · {fmtHM(h.sec)} · {h.hrAvg}/{h.hrMax} bpm
      </div>
    </div>
  );
}

/* --------------------------------- page ----------------------------------- */

export default function TripRecap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip>(null);
  const [showTable, setShowTable] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [fine, setFine] = useState(false);

  // Charts reflow rather than side-scroll: below ~620px they restack with
  // the row label above the mark instead of in a left-hand column.
  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const measure = () => setNarrow(node.clientWidth < 620);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  // Hover tooltips only where hovering is a real thing. Every value is
  // already direct-labelled on the mark, so touch loses nothing.
  useEffect(() => {
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const hit = useCallback(
    (hike: Row) =>
      fine
        ? {
            onPointerMove: (e: React.PointerEvent) => setTip({ hike, x: e.clientX, y: e.clientY }),
            onPointerEnter: (e: React.PointerEvent) => setTip({ hike, x: e.clientX, y: e.clientY }),
            onPointerLeave: () => setTip(null),
            onFocus: (e: React.FocusEvent<SVGRectElement>) => {
              const b = e.currentTarget.getBoundingClientRect();
              setTip({ hike, x: b.left + b.width / 2, y: b.top + b.height / 2 });
            },
            onBlur: () => setTip(null),
            tabIndex: 0,
            className: "r-hit",
            "aria-label": `${hike.name}, ${hike.date}`,
          }
        : null,
    [fine],
  );

  // Six, not seven: the steepness chart already carries the weekend ft/mi average
  // on its hairline, and a seventh card left an orphan on the last row.
  const kpis: [string, string, string][] = [
    ["Distance", `${TOT.miles.toFixed(1)} mi`, "across 4 hikes"],
    ["Time on foot", fmtHM(TOT.sec), `${fmtHM(TOT.elapsed)} out there, first step to last`],
    ["Standing still", fmtHM(TOT.stopped), "of that, nearly all on the two summit days"],
    ["High Peaks", String(TOT.peaks), "Marcy, Skylight, Gray, Algonquin, Wright, Iroquois"],
    ["Calories", `${comma(TOT.kcal)} kcal`, `\u2248 ${Math.round(TOT.kcal / DQPC_KCAL)} Double Quarter Pounders with cheese`],
    ["Steps", comma(TOT.steps), "counted by the watch, not estimated"],
  ];

  return (
    <div className="trip-recap" ref={hostRef}>
      <style>{CSS}</style>

      {/* hero — edge to edge on phones, inset once the container has margins of its own */}
      <figure className="relative -mx-4 mb-5 overflow-hidden sm:-mx-6 md:mx-0 md:rounded-3xl">
        <Image
          src="/backpacking/flowed-lands-morning.jpg"
          alt="Flowed Lands at first light: mist sitting on flat water, spruce islands mid-lake, and a long slide-scarred ridge catching the sun on the right."
          width={1800}
          height={2397}
          priority
          sizes="(min-width: 768px) 1024px, 100vw"
          className="h-[360px] w-full object-cover object-[50%_55%] sm:h-[440px] md:h-[500px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
        <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream sm:p-7">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-[family-name:var(--font-cormorant-garamond)] text-6xl font-bold leading-none drop-shadow-lg sm:text-7xl">
              {comma(TOT.ft)}
            </span>
            <span className="text-xl font-semibold drop-shadow-lg">ft climbed</span>
          </div>
          <p className="mt-1 text-sm opacity-90 drop-shadow-lg">
            in two days, across six summits
          </p>
        </figcaption>
      </figure>

      <p className="mb-5 px-1 text-sm leading-relaxed opacity-80">
        Six High Peaks: Marcy, Skylight and Gray on Saturday; Algonquin, Wright and Iroquois on
        Sunday. The plan had been a tidy, classical sort of thing. What we actually did ran long,
        went in for excess, and finished both days in the dark.
      </p>

      {/* legend + view toggle — one row, above everything it scopes */}
      <div className="soft-card dark:soft-card-dark mb-4 flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3">
        {(["Sat", "Sun"] as Day[]).map((d) => (
          <span key={d} className="inline-flex items-center gap-2 text-sm font-semibold opacity-80">
            <span className="inline-block h-2.5 w-3.5 rounded-sm" style={{ background: col(d) }} />
            {d === "Sat" ? "Saturday" : "Sunday"}
          </span>
        ))}
        <span className="flex-1" />
        <div className="flex gap-2">
          {([["Charts", false], ["Table", true]] as [string, boolean][]).map(([label, tbl]) => (
            <button
              key={label}
              type="button"
              onClick={() => setShowTable(tbl)}
              aria-pressed={showTable === tbl}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                showTable === tbl
                  ? "bg-forest text-cream dark:bg-soft-gold dark:text-forest-dark"
                  : "border border-sage/25 opacity-75 hover:opacity-100 dark:border-soft-gold/25"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!showTable && (
        <>
          {/* KPI row */}
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {kpis.map((k) => (
              <div key={k[0]} className="soft-card dark:soft-card-dark p-4">
                <div className="text-xs font-semibold opacity-60">{k[0]}</div>
                <div className="text-2xl font-bold leading-tight">{k[1]}</div>
                <div className="mt-0.5 text-[11px] opacity-55">{k[2]}</div>
              </div>
            ))}
          </div>

          {/* Saturday vs Sunday */}
          <section className="soft-card dark:soft-card-dark mb-4 p-5">
            <h2 className="text-lg font-bold">Saturday vs Sunday</h2>
            <p className="mb-4 mt-0.5 text-sm opacity-75">
              Two days that landed in almost the same place by completely different routes — Saturday
              front-loaded the miles, Sunday front-loaded the climbing.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["Sat", "Sun"] as Day[]).map((d) => {
                const hs = HIKES.filter((h) => h.day === d);
                const agg = (k: NumKey) => hs.reduce((a, h) => a + h[k], 0);
                return (
                  <div
                    key={d}
                    className="rounded-2xl border border-sage/20 p-4 dark:border-soft-gold/20"
                    style={{ background: wash(d) }}
                  >
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                      <span className="inline-block h-2.5 w-3.5 rounded-sm" style={{ background: col(d) }} />
                      {d === "Sat" ? "Saturday · Aug 15" : "Sunday · Aug 16"}
                    </div>
                    <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm">
                      {([
                        ["Distance", `${agg("miles").toFixed(2)} mi`],
                        ["Vert", `${comma(agg("ft"))} ft`],
                        ["On foot", fmtHM(agg("sec"))],
                        ["Calories", comma(agg("kcal"))],
                        ["Summits", String(agg("peaks"))],
                      ] as [string, string][]).map((r) => (
                        <div key={r[0]} className="contents">
                          <dt className="opacity-60">{r[0]}</dt>
                          <dd className="text-right font-bold tabular-nums">{r[1]}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })}
            </div>
          </section>

          {/* peaks */}
          <section className="soft-card dark:soft-card-dark mb-4 p-5">
            <h2 className="text-lg font-bold">The six</h2>
            <p className="mb-4 mt-0.5 text-sm opacity-75">
              Three on Saturday out of camp, three on Sunday before walking out. Two of them have no
              maintained trail at all. Almost every name up here was handed out by one surveyor,
              Verplanck Colvin, in the 1870s and 80s — which mostly serves to remind you that the
              range was here, and perfectly legible, long before anyone got round to labelling it.
            </p>
            {(["Sat", "Sun"] as Day[]).map((d) => (
              <div key={d} className="mb-4 last:mb-0">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <span
                    className="inline-block h-2.5 w-3.5 rounded-sm"
                    style={{ background: col(d) }}
                  />
                  {d === "Sat" ? "Saturday · out of camp and back" : "Sunday · before the walk out"}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {PEAKS.filter((pk) => pk.day === d).map((pk) => (
                    <div
                      key={pk.name}
                      className="rounded-2xl border border-sage/20 p-4 dark:border-soft-gold/20"
                      style={{ background: wash(pk.day) }}
                    >
                      <a
                        href={pk.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold underline decoration-dotted underline-offset-2"
                      >
                        {pk.name}
                      </a>
                      <div className="mt-0.5 text-xs font-bold tabular-nums opacity-70">
                        {comma(pk.ft)} ft · #{pk.rank} of 46
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed opacity-80">{pk.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* routes */}
          <section className="soft-card dark:soft-card-dark mb-4 p-5">
            <h2 className="text-lg font-bold">Where we actually walked</h2>
            <p className="mb-4 mt-0.5 text-sm opacity-75">
              Four legs, and they fall into movements: a long approach, two big ones in the middle,
              and a short coda back to the car. The hike in and the walk out are the same corridor
              from Upper Works run in opposite directions; the summit days fan out from camp and
              come back to it. Full packs only on the first and last legs — everything heavy stayed
              at camp while we went up.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {HIKES.map((h) => (
                <a
                  key={h.n}
                  href={`https://www.strava.com/activities/${h.strava}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="game-card-hover block overflow-hidden rounded-2xl border border-sage/20 dark:border-soft-gold/20"
                >
                  <Image
                    src={h.map}
                    alt={`Recorded GPS track for ${h.name}`}
                    width={1200}
                    height={630}
                    sizes="(min-width: 640px) 480px, 100vw"
                    className="h-auto w-full"
                  />
                  <div className="p-3">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <span
                        className="inline-block h-2.5 w-3.5 shrink-0 rounded-sm"
                        style={{ background: col(h.day) }}
                      />
                      {h.name}
                    </div>
                    <p className="mt-1 text-xs tabular-nums opacity-70">
                      {h.date} · {h.miles.toFixed(2)} mi · {comma(h.ft)} ft · {fmtHM(h.sec)}
                    </p>
                    <p className="mt-1 text-[11px] opacity-60">
                      {h.packs === "full" ? "🎒 full packs" : "🥾 light packs from camp"}
                    </p>
                    <span
                      className="mt-1.5 inline-block text-xs font-bold"
                      style={{ color: col(h.day) }}
                    >
                      View on Strava →
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-3 text-[11px] opacity-55">
              Route maps rendered by Strava over OpenStreetMap data.
            </p>
          </section>

          {/* small multiples */}
          <section className="soft-card dark:soft-card-dark mb-4 p-5">
            <h2 className="text-lg font-bold">Every hike, four ways</h2>
            <p className="mb-4 mt-0.5 text-sm opacity-75">
              Four recorded activities. <strong>Marcy trio</strong> = Marcy · Skylight · Gray.{" "}
              <strong>Algonquin trio</strong> = Algonquin · Wright · Iroquois.
            </p>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              {(
                [
                  ["Distance", "miles", (h: Row) => h.miles, (v: number) => v.toFixed(2)],
                  ["Elevation gain", "feet climbed", (h: Row) => h.ft, (v: number) => comma(v)],
                  ["Time on foot", "hours", (h: Row) => h.hours, (v: number) => fmtHM(v * 3600)],
                  ["Calories", "kcal burned", (h: Row) => h.kcal, (v: number) => comma(v)],
                ] as [string, string, (h: Row) => number, (v: number) => string][]
              ).map(([title, unit, get, fmt]) => {
                const ROW_H = 38, TOP = 12, BH = 15, X0 = 104, X1 = 348;
                const H = TOP + HIKES.length * ROW_H - (ROW_H - BH) + 6;
                const max = Math.max(...HIKES.map(get));
                return (
                  <div key={title}>
                    <h3 className="text-[13px] font-bold">{title}</h3>
                    <p className="mb-1 text-[11px] opacity-55">{unit}</p>
                    <svg viewBox={`0 0 400 ${H}`} role="group" aria-label={`${title} by hike`}>
                      {HIKES.map((h, i) => {
                        const y = TOP + i * ROW_H;
                        const w = (get(h) / max) * (X1 - X0);
                        const props = hit(h);
                        return (
                          <g key={h.n}>
                            <text x={96} y={y + BH / 2 + 4} textAnchor="end" className="r-lbl">{h.short}</text>
                            <path d={barPath(X0, y, w, BH)} fill={col(h.day)} />
                            <text x={X0 + w + 7} y={y + BH / 2 + 4} className="r-val">{fmt(get(h))}</text>
                            {props && <rect x={X0 - 4} y={y - 6} width={X1 - X0 + 56} height={BH + 12} {...props} />}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                );
              })}
            </div>
          </section>

          {/* cumulative elevation */}
          <section className="soft-card dark:soft-card-dark mb-4 p-5">
            <h2 className="text-lg font-bold">Climbing, stacked up</h2>
            <p className="mb-3 mt-0.5 text-sm opacity-75">
              Cumulative elevation gain against time on your feet. The flat stretches are the walking;
              the steep ones are the summits.
            </p>
            <CumulativeChart narrow={narrow} hit={hit} />
          </section>

          {/* steepness */}
          <section className="soft-card dark:soft-card-dark mb-4 p-5">
            <h2 className="text-lg font-bold">How steep it actually was</h2>
            <p className="mb-3 mt-0.5 text-sm opacity-75">
              Feet of climbing per mile — the honest measure of which hike hurt. Some of the weight
              is what you put on your back and some of it you brought with you. The hairline is the
              weekend average.
            </p>
            <SteepChart narrow={narrow} hit={hit} />
          </section>

          {/* heart rate */}
          <section className="soft-card dark:soft-card-dark mb-4 p-5">
            <h2 className="text-lg font-bold">Heart rate: average and peak</h2>
            <p className="mb-3 mt-0.5 text-sm opacity-75">
              Filled dot is the average for the hike, open ring is the max. All four averages sat in
              easy aerobic territory — the spikes are the summit pushes.
            </p>
            <HeartRateChart narrow={narrow} hit={hit} />
          </section>

          {/* water */}
          <section className="soft-card dark:soft-card-dark mb-4 p-5 sm:p-7">
            <h2 className="text-lg font-bold">Water, one way and another</h2>
            <p className="mt-4 max-w-[46ch] whitespace-pre-line font-[family-name:var(--font-cormorant-garamond)] text-lg leading-[1.7] opacity-90 sm:text-xl">
              {WATER_POEM}
            </p>
            <p className="mt-5 max-w-[52ch] text-xs leading-relaxed opacity-55">
              For anyone else carrying a pump: the bottle with the filter in the cap, or chlorine
              dioxide drops — dose it, wait, carry on. Either one buys back the hours.
            </p>
          </section>

          {/* album */}
          <a
            href={ALBUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="soft-card dark:soft-card-dark game-card-hover mb-4 flex flex-col items-stretch gap-5 p-5 sm:flex-row sm:items-center"
          >
            <Image
              src={ALBUM_COVER}
              alt=""
              width={1200}
              height={1600}
              sizes="(min-width: 640px) 210px, 100vw"
              className="h-36 w-full flex-none rounded-xl object-cover object-[50%_30%] sm:h-[118px] sm:w-[210px]"
            />
            <div>
              <h2 className="text-lg font-bold">📷 High peaks backpacking with Matt and Liam</h2>
              <p className="mt-0.5 text-sm opacity-75">
                The shared album from the same two days — every number above has a picture somewhere
                in here.
              </p>
              <span className="mt-2 inline-block text-sm font-bold" style={{ color: "var(--r-sat)" }}>
                Open the album on Google Photos →
              </span>
            </div>
          </a>
        </>
      )}

      {showTable && <RecapTable />}

      <p className="px-1 text-xs leading-relaxed opacity-55">
        Distance, elevation, moving time, calories and heart rate come off the four recorded
        Strava activities; steps and elapsed time come off the same four on Garmin, which counts
        both directly. Nothing above is an estimate. Time on foot is moving time, so it runs
        shorter than the {fmtHM(TOT.elapsed)} the clock was actually running.
      </p>

      <Tooltip tip={tip} />
    </div>
  );
}

/* -------------------------------- charts ---------------------------------- */

type Hit = (h: Row) => Record<string, unknown> | null;

function CumulativeChart({ narrow, hit }: { narrow: boolean; hit: Hit }) {
  const W = narrow ? 360 : 720;
  const H = narrow ? 252 : 268;
  const ML = narrow ? 42 : 54;
  const MR = narrow ? 14 : 26;
  const MT = narrow ? 26 : 28;
  const MB = narrow ? 38 : 40;
  const maxH = TOT.sec / 3600;
  const maxY = niceCeil(TOT.ft, 2500);
  const px = (t: number) => ML + (t / maxH) * (W - ML - MR);
  const py = (v: number) => H - MB - (v / maxY) * (H - MT - MB);
  const yTicks = (narrow ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]).map((f) => f * maxY);
  const xStep = narrow ? 5 : 4;
  const xTicks = Array.from({ length: Math.floor(maxH / xStep) + 1 }, (_, i) => i * xStep);

  const pts: { t: number; v: number; day: Day; hike?: Row }[] = [{ t: 0, v: 0, day: "Sat" }];
  let ct = 0;
  let cv = 0;
  HIKES.forEach((h) => {
    ct += h.hours;
    cv += h.ft;
    pts.push({ t: ct, v: cv, day: h.day, hike: h });
  });
  const bnd = pts.filter((p) => p.hike?.day === "Sat").at(-1)!.t;
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Cumulative elevation gain over time on foot">
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={ML} y1={py(v)} x2={W - MR} y2={py(v)} stroke={v === 0 ? "var(--r-axis)" : "var(--r-grid)"} strokeWidth={1} />
          <text x={ML - 8} y={py(v) + 4} textAnchor="end" className="r-tick">{comma(v)}</text>
        </g>
      ))}
      {xTicks.map((t) => (
        <text key={t} x={px(t)} y={H - MB + 20} textAnchor="middle" className="r-tick">{t}h</text>
      ))}
      <text x={0} y={MT - 12} className="r-note">feet climbed</text>
      <text x={W - MR} y={H - MB + 34} textAnchor="end" className="r-note">hours on foot →</text>

      {pts.slice(1).map((b, i) => {
        const a = pts[i];
        return (
          <g key={`seg${i}`}>
            <path
              d={`M${px(a.t)},${py(a.v)}L${px(b.t)},${py(b.v)}L${px(b.t)},${py(0)}L${px(a.t)},${py(0)}Z`}
              fill={col(b.day)}
              opacity={0.1}
            />
            <line x1={px(a.t)} y1={py(a.v)} x2={px(b.t)} y2={py(b.v)} stroke={col(b.day)} strokeWidth={2} strokeLinecap="round" />
          </g>
        );
      })}

      <line x1={px(bnd)} y1={MT} x2={px(bnd)} y2={py(0)} stroke="var(--r-axis)" strokeWidth={1} />
      <text x={px(bnd) - 6} y={MT + 11} textAnchor="end" className="r-note">SAT</text>
      <text x={px(bnd) + 6} y={MT + 11} className="r-note">SUN</text>

      {pts.slice(1).map((p, i) => (
        <circle key={`dot${i}`} cx={px(p.t)} cy={py(p.v)} r={narrow ? 4.5 : 5.5} fill={col(p.day)} stroke="var(--r-surface)" strokeWidth={2} />
      ))}
      <text x={px(last.t) - 6} y={py(last.v) - 11} textAnchor="end" className="r-val">{comma(last.v)} ft</text>

      {pts.slice(1).map((p, i) => {
        const props = hit(p.hike as Row);
        if (!props) return null;
        // Nearest-point bands. The last two points sit under 44px apart on the narrow
        // layout, so fixed-width targets overlapped and stole each other's hovers.
        const x0 = i === 0 ? ML : (px(pts[i].t) + px(p.t)) / 2;
        const nxt = pts[i + 2];
        const x1 = nxt ? (px(p.t) + px(nxt.t)) / 2 : W - MR;
        return <rect key={`hit${i}`} x={x0} y={MT} width={Math.max(0, x1 - x0)} height={H - MT - MB} {...props} />;
      })}
    </svg>
  );
}

function SteepChart({ narrow, hit }: { narrow: boolean; hit: Hit }) {
  // 15% past the steepest hike leaves room for the value label beyond the bar end.
  const MAXV = niceCeil(Math.max(...HIKES.map((h) => h.ftPerMi)) * 1.15, 10);
  const avg = TOT.ft / TOT.miles;

  if (narrow) {
    const W = 360, ROW_H = 46, TOP = 34, BH = 14, X0 = 2, BARW = 268;
    const H = TOP + HIKES.length * ROW_H - (ROW_H - BH) + 8;
    const sc = (v: number) => (v / MAXV) * BARW;
    const ax = X0 + sc(avg);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Feet of elevation gain per mile, by hike">
        <line x1={ax} y1={TOP - 18} x2={ax} y2={TOP + HIKES.length * ROW_H - (ROW_H - BH)} stroke="var(--r-axis)" strokeWidth={1} />
        <text x={ax - 3} y={TOP - 24} textAnchor="end" className="r-note">weekend avg {comma(avg)} ft/mi</text>
        {HIKES.map((h, i) => {
          const yl = TOP + i * ROW_H;
          const props = hit(h);
          return (
            <g key={h.n}>
              <text x={X0} y={yl - 4} className="r-lbl">{h.short}</text>
              <path d={barPath(X0, yl + 2, sc(h.ftPerMi), BH)} fill={col(h.day)} />
              <text x={X0 + sc(h.ftPerMi) + 8} y={yl + BH / 2 + 6} className="r-val">{comma(h.ftPerMi)} ft/mi</text>
              {props && <rect x={0} y={yl - 18} width={W} height={ROW_H - 2} {...props} />}
            </g>
          );
        })}
      </svg>
    );
  }

  const W = 720, ROW_H = 40, TOP = 28, BH = 16, X0 = 160, X1 = 612;
  const H = TOP + HIKES.length * ROW_H - (ROW_H - BH) + 8;
  const sc = (v: number) => (v / MAXV) * (X1 - X0);
  const ax = X0 + sc(avg);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Feet of elevation gain per mile, by hike">
      <line x1={ax} y1={TOP - 14} x2={ax} y2={TOP + HIKES.length * ROW_H - 14} stroke="var(--r-axis)" strokeWidth={1} />
      <text x={ax + 7} y={TOP - 18} className="r-note">weekend average {comma(avg)} ft/mi</text>
      {HIKES.map((h, i) => {
        const y = TOP + i * ROW_H;
        const props = hit(h);
        return (
          <g key={h.n}>
            <text x={150} y={y + BH / 2 + 4} textAnchor="end" className="r-lbl">{h.short}</text>
            <path d={barPath(X0, y, sc(h.ftPerMi), BH)} fill={col(h.day)} />
            <text x={X0 + sc(h.ftPerMi) + 8} y={y + BH / 2 + 4} className="r-val">{comma(h.ftPerMi)} ft/mi</text>
            {props && <rect x={X0 - 4} y={y - 8} width={X1 - X0 + 100} height={BH + 16} {...props} />}
          </g>
        );
      })}
    </svg>
  );
}

function HeartRateChart({ narrow, hit }: { narrow: boolean; hit: Hit }) {
  // Padded past the data both ways so the dots and their labels clear the plot edges.
  const LO = niceFloor(Math.min(...HIKES.map((h) => h.hrAvg)) - 15, 5);
  const HI = niceCeil(MAX_HR + 10, 5);

  if (narrow) {
    const W = 360, ROW_H = 50, TOP = 22, X0 = 6, X1 = 352;
    const base = TOP + HIKES.length * ROW_H - 8;
    const H = base + 40;
    const px = (v: number) => X0 + ((v - LO) / (HI - LO)) * (X1 - X0);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Average and maximum heart rate by hike">
        {HIKES.map((h, i) => {
          const yl = TOP + i * ROW_H;
          const yt = yl + 15;
          const props = hit(h);
          return (
            <g key={h.n}>
              <text x={X0} y={yl} className="r-lbl">{h.short}</text>
              <text x={X1} y={yl} textAnchor="end" className="r-val">{h.hrAvg} avg · {h.hrMax} max</text>
              <line x1={px(h.hrAvg)} y1={yt} x2={px(h.hrMax)} y2={yt} stroke={col(h.day)} strokeWidth={2} opacity={0.42} strokeLinecap="round" />
              <circle cx={px(h.hrMax)} cy={yt} r={5} fill="var(--r-surface)" stroke={col(h.day)} strokeWidth={2} />
              <circle cx={px(h.hrAvg)} cy={yt} r={5} fill={col(h.day)} stroke="var(--r-surface)" strokeWidth={2} />
              {props && <rect x={0} y={yl - 14} width={W} height={ROW_H - 2} {...props} />}
            </g>
          );
        })}
        <line x1={X0} y1={base + 4} x2={X1} y2={base + 4} stroke="var(--r-axis)" strokeWidth={1} />
        {[100, 140, 180].map((t) => (
          <g key={t}>
            <line x1={px(t)} y1={base + 4} x2={px(t)} y2={base + 8} stroke="var(--r-axis)" strokeWidth={1} />
            <text x={px(t)} y={base + 21} textAnchor="middle" className="r-tick">{t}</text>
          </g>
        ))}
        <text x={X1} y={base + 36} textAnchor="end" className="r-note">beats per minute</text>
      </svg>
    );
  }

  const W = 720, ROW_H = 40, TOP = 14, X0 = 168, X1 = 648;
  const H = TOP + HIKES.length * ROW_H + 34;
  const px = (v: number) => X0 + ((v - LO) / (HI - LO)) * (X1 - X0);
  const base = TOP + HIKES.length * ROW_H - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Average and maximum heart rate by hike">
      {[100, 120, 140, 160, 180].map((t) => (
        <g key={t}>
          <line x1={px(t)} y1={TOP - 6} x2={px(t)} y2={base} stroke="var(--r-grid)" strokeWidth={1} />
          <text x={px(t)} y={base + 18} textAnchor="middle" className="r-tick">{t}</text>
        </g>
      ))}
      <text x={X1} y={base + 32} textAnchor="end" className="r-note">beats per minute</text>
      {HIKES.map((h, i) => {
        const y = TOP + i * ROW_H + 4;
        const props = hit(h);
        return (
          <g key={h.n}>
            <text x={150} y={y + 4} textAnchor="end" className="r-lbl">{h.short}</text>
            <line x1={px(h.hrAvg)} y1={y} x2={px(h.hrMax)} y2={y} stroke={col(h.day)} strokeWidth={2} opacity={0.42} strokeLinecap="round" />
            <circle cx={px(h.hrMax)} cy={y} r={5} fill="var(--r-surface)" stroke={col(h.day)} strokeWidth={2} />
            <circle cx={px(h.hrAvg)} cy={y} r={5} fill={col(h.day)} stroke="var(--r-surface)" strokeWidth={2} />
            <text x={px(h.hrAvg) - 10} y={y + 4} textAnchor="end" className="r-val">{h.hrAvg} avg</text>
            <text x={px(h.hrMax) + 10} y={y + 4} className="r-val">{h.hrMax} max</text>
            {props && <rect x={X0 - 60} y={y - 16} width={X1 - X0 + 120} height={32} {...props} />}
          </g>
        );
      })}
    </svg>
  );
}

/* --------------------------------- table ---------------------------------- */

function RecapTable() {
  const cols = ["Hike", "Day", "Miles", "Vert (ft)", "Time", "Pace (mph)", "ft/mi", "kcal", "Avg HR", "Max HR", "Steps"];
  return (
    <section className="soft-card dark:soft-card-dark mb-4 p-5">
      <h2 className="mb-3 text-lg font-bold">Every number</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="pb-3 text-left text-sm opacity-70">
            Every value in the charts, as numbers. Hike names link to the Strava activity.
          </caption>
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`whitespace-nowrap border-b border-sage/20 px-2.5 py-2 text-[11px] font-bold uppercase tracking-wide opacity-60 dark:border-soft-gold/20 ${
                    i === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HIKES.map((h) => (
              <tr key={h.n}>
                <th scope="row" className="whitespace-nowrap border-b border-sage/15 px-2.5 py-2 text-left font-semibold dark:border-soft-gold/15">
                  <a
                    className="underline decoration-dotted underline-offset-2"
                    href={`https://www.strava.com/activities/${h.strava}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {h.name}
                  </a>
                </th>
                {[
                  h.date, h.miles.toFixed(2), comma(h.ft), fmtHM(h.sec), h.mph.toFixed(2),
                  comma(h.ftPerMi), comma(h.kcal), String(h.hrAvg), String(h.hrMax), comma(h.steps),
                ].map((v, i) => (
                  <td key={i} className="whitespace-nowrap border-b border-sage/15 px-2.5 py-2 text-right tabular-nums dark:border-soft-gold/15">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {[
                "Weekend total", "2 days", TOT.miles.toFixed(2), comma(TOT.ft), fmtHM(TOT.sec),
                (TOT.miles / (TOT.sec / 3600)).toFixed(2), comma(TOT.ft / TOT.miles),
                comma(TOT.kcal), String(AVG_HR), String(MAX_HR), comma(TOT.steps),
              ].map((v, i) =>
                i === 0 ? (
                  <th
                    key={i}
                    scope="row"
                    className="whitespace-nowrap border-t-2 border-sage/40 px-2.5 py-2 text-left font-bold dark:border-soft-gold/40"
                  >
                    {v}
                  </th>
                ) : (
                  <td
                    key={i}
                    className="whitespace-nowrap border-t-2 border-sage/40 px-2.5 py-2 text-right font-bold tabular-nums dark:border-soft-gold/40"
                  >
                    {v}
                  </td>
                ),
              )}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
