/* Turn-by-turn route documentation for the Aug 15–16, 2026 High Peaks trip.
 *
 * Sourcing rules for anything in this file:
 *  - `mi` is the CUMULATIVE distance from the route's own mile 0.
 *  - Waypoints and junction mileages come from DEC/ADK trail descriptions and
 *    the ADK High Peaks Trails guide, cross-checked against trip reports.
 *  - Where a number is derived rather than published (e.g. "from camp" totals
 *    computed by subtracting the approach), the route carries `planningGrade`.
 *  - Times assume ~1.5 mph with full packs, ~2 mph with daypacks.
 *
 * Nothing here replaces the paper map. Junction signage in the High Peaks is
 * good on marked trails and absent on herd paths.
 */

export type Leg = {
  /** Cumulative miles from mile 0 of this route. */
  mi: number;
  /** Waypoint / junction name. */
  at: string;
  /** What you do here — the actual instruction. */
  doThis: string;
  /** Elevation at the waypoint, if worth knowing. */
  ele?: string;
  /** Extra colour: water, views, things people miss. */
  note?: string;
  /** Something that can go wrong here. */
  warn?: string;
  /** Renders the row as a milestone (camp, summit, trailhead). */
  major?: boolean;
};

export type TrailLink = {
  label: string;
  url: string;
  /** REQUIRED: how the linked route differs from what we're actually walking. */
  diff: string;
  /** Set when the linked route should NOT be followed as-is. */
  caution?: boolean;
};

export type Variant = {
  label: string;
  dist: string;
  gain: string;
  time: string;
  note?: string;
};

export type RouteDoc = {
  id: string;
  kind: "approach" | "summit" | "detour";
  title: string;
  /** One-line "from → to". */
  path: string;
  dist: string;
  gain: string;
  time: string;
  /** Trail markers / colours, as signed. */
  markers: string;
  summary: string;
  /** Same-approach itineraries of different sizes (e.g. Marcy / +Gray / +Skylight). */
  variants?: Variant[];
  legs: Leg[];
  warnings?: string[];
  links: TrailLink[];
  /** CalTopo centre for this route. */
  caltopo?: string;
  /** True when the mileages are derived, not published. */
  planningGrade?: boolean;
};

const caltopo = (lat: number, lon: number, z = 14) =>
  `https://caltopo.com/map.html#ll=${lat},${lon}&z=${z}`;

export const ROUTES: RouteDoc[] = [
  /* ------------------------------------------------------------------ *
   * APPROACHES
   * ------------------------------------------------------------------ */
  {
    id: "uw-to-colden",
    kind: "approach",
    title: "Upper Works → Flowed Lands → Lake Colden",
    path: "Upper Works trailhead → Calamity Brook Trail → Flowed Lands (4.6) → Lake Colden (5.6)",
    dist: "4.6 mi to Flowed Lands · 5.6 mi to Lake Colden",
    gain: "+1,000 ft / +1,325 ft",
    time: "2½–3½ hrs / 3–4 hrs with full packs",
    markers: "RED discs to the 1.4-mi junction, then BLUE discs the rest of the way",
    summary:
      "THE carry-in. It never touches the closed Avalanche Pass: flat and easy for the first 1.4 miles, then a steady unglamorous grind up alongside Calamity Brook. Both camps are on this one trail — Flowed Lands is the built-in bail-out, Lake Colden (the plan) is one more mile of rolling shoreline.",
    legs: [
      {
        mi: 0,
        at: "Upper Works parking",
        ele: "~1,750 ft",
        doThis:
          "60-car free lot at the very end of Upper Works Rd. Sign the trail register at the trailhead — it's how rangers know we're in there.",
        note: "The lot is ~0.1 mi from the old one; you walk out through the ruins of the Adirondac mining village to reach the trail.",
        major: true,
      },
      {
        mi: 0.2,
        at: "Hudson River bridge",
        doThis:
          "Follow the gravel road north and cross the bridge over the Hudson (here it's just the outlet of Henderson Lake). Red discs.",
        note: "Yes — that trickle is the Hudson. This is about as far upstream as it gets.",
      },
      {
        mi: 1.4,
        at: "T junction — Calamity / Indian Pass crossover",
        doThis:
          "THE junction that matters. Straight ahead crosses a saddle to the Indian Pass Trail (Henderson Lake, Duck Hole) — wrong way. Turn RIGHT and cross the bridge. Discs change from red to BLUE here.",
        warn: "Miss this and you end up at Henderson Lake instead of Lake Colden. The climb begins immediately after the turn.",
      },
      {
        mi: 2.8,
        at: "Calamity Brook high-water bridge — WASHED OUT",
        doThis:
          "Rock-hop the brook. In normal August flows this is an easy step-across; recent trip reports treat it as a non-event.",
        warn: "Washed out by snowmelt in March 2026. DEC has the repair slated for LATE SUMMER 2026 — it may literally be rebuilt by our weekend, so re-check. In high water this crossing (and therefore this whole plan) is off.",
      },
      {
        mi: 3.8,
        at: "Bridged crossing",
        doThis: "Cross on the good bridge. The grade eases noticeably after this.",
      },
      {
        mi: 4.3,
        at: "Calamity Pond + Henderson Monument",
        doThis:
          "Short herd path a few steps off the trail to the left. The stone obelisk marks where David Henderson accidentally shot himself in 1845 — which is how the brook, the pond, and the whole calamity got named.",
        note: "Two-minute stop, worth it, and a good excuse to shed packs before the last pitch.",
      },
      {
        mi: 4.6,
        at: "Flowed Lands",
        ele: "~2,750 ft",
        doThis:
          "First big view — Colden fills the whole skyline across the water. Lean-tos and designated tent sites here. THE BAIL-OUT CAMP: if the carry's gone long or the weather's turning, stop here and nothing else changes much.",
        note: "Water right there. If anyone's cooked, this is the honest place to call it.",
        major: true,
      },
      {
        mi: 5.2,
        at: "Shoreline traverse",
        doThis:
          "Follow the trail around the water toward Lake Colden. Rolling ups and downs — shorter than it looks on the map, more annoying than it looks on the map.",
      },
      {
        mi: 5.6,
        at: "Lake Colden dam + lean-tos",
        ele: "~2,760 ft",
        doThis:
          "HOME. Lean-tos and designated sites around the lake, interior ranger outpost nearby, and every summit run on the menu launches from here.",
        major: true,
      },
      {
        mi: 5.85,
        at: "Herbert Brook cairn",
        doThis:
          "Not part of the carry-in, but note it on the way past: ~0.25 mi beyond the dam, a cairn on the right marks the Marshall herd path. Easier to find in daylight with fresh eyes than at 6 AM.",
      },
    ],
    warnings: [
      "The 2.8-mi crossing is the single point of failure for every Upper Works plan. Check DEC's backcountry page the week of, and check the sky the morning of.",
      "No bear can rental at Upper Works — can #2 has to be sorted before we leave Greenwich.",
      "No cell service from partway up Tahawus Rd onward. Download offline maps at home.",
    ],
    links: [
      {
        label: "AllTrails — Calamity Brook Trail to Lake Colden",
        url: "https://www.alltrails.com/trail/us/new-york/calamity-brook-trail-to-lake-colden",
        diff: "This is our exact trail. AllTrails lists it as an 11.4 mi / 1,341 ft out-and-back because it walks in AND back out in one push — we split those halves across Saturday and Sunday with a camp in between.",
      },
      {
        label: "NCPR — the bridge washout, March 2026",
        url: "https://www.northcountrypublicradio.org/news/story/53124/20260309/rapid-snowmelt-washes-out-footbridge-in-the-adirondack-high-peaks",
        diff: "Background on the washed-out crossing at mile 2.8 and DEC's late-summer repair plan.",
      },
      {
        label: "DEC — Adirondack backcountry conditions",
        url: "https://dec.ny.gov/things-to-do/hiking/adirondack-backcountry/backcountry-information-for-adirondack-park",
        diff: "The authority on whether the bridge is back and whether the crossing is passable. Check the week of.",
      },
    ],
    caltopo: caltopo(44.11, -74.02, 13),
  },
  /* ------------------------------------------------------------------ *
   * SUMMIT RUNS — from the Lake Colden basecamp
   * ------------------------------------------------------------------ */
  {
    id: "colden-west",
    kind: "summit",
    title: "Mount Colden (4,714 ft — #11) via the west ladders",
    path: "Lake Colden camp → north along the lake → Lake Colden (L. Morgan Porter) Trail → summit",
    dist: "≈4.4–4.8 mi RT from Lake Colden camp",
    gain: "+2,000 ft",
    time: "4–5 hrs",
    markers: "RED discs on the Colden trail once you leave the lakeshore",
    summary:
      "The steepest, most fun way up Colden and the shortest summit from any of our camps. Ladders bolted up the cliff bands, then open slab with the whole MacIntyre Range at your back. CONFIRMED OPEN — the closure is the Avalanche Pass corridor to the north, not this trail.",
    legs: [
      {
        mi: 0,
        at: "Lake Colden lean-tos",
        ele: "~2,760 ft",
        doThis: "Cross the dam and follow the trail north along the east side of the lake.",
        major: true,
      },
      {
        mi: 0.4,
        at: "Interior ranger outpost",
        doThis:
          "Staffed in season. Worth a knock — the interior ranger has better trail intel than any website, including this one.",
      },
      {
        mi: 0.8,
        at: "Colden trail junction",
        doThis:
          "Signed junction: the RED Lake Colden / L. Morgan Porter trail turns RIGHT/east and heads uphill. Straight on continues toward Avalanche Lake — that's the CLOSED side, don't.",
        warn: "Everything above this junction is steep. It's 1.6 mi and ~2,000 ft from here to the summit.",
      },
      {
        mi: 1.4,
        at: "The ladders",
        doThis:
          "Fixed ladders up the cliff bands. Three points of contact, one person at a time, packs snug. Slick when wet.",
        warn: "This is the crux and it is genuinely exposed in places. If it's raining hard, this route is a no.",
        major: true,
      },
      {
        mi: 1.9,
        at: "Open slab",
        doThis:
          "Out onto bare rock. Turn around here — Algonquin and Iroquois across the valley is the view of the trip.",
      },
      {
        mi: 2.4,
        at: "Mount Colden summit",
        ele: "4,714 ft",
        doThis: "Down the same way. The ladders are slower descending than climbing — budget for it.",
        major: true,
      },
    ],
    warnings: [
      "Wet rock changes this route's difficulty completely. In steady rain, swap it for Marshall.",
      "Descending the ladders takes longer than climbing them. Don't plan a tight Sunday around this one.",
    ],
    links: [
      {
        label: "AllTrails — Mount Colden Loop via Lake Colden",
        url: "https://www.alltrails.com/trail/us/new-york/mount-colden-loop-via-lake-colden",
        diff: "Closest match on AllTrails: 6.5 mi / 2,096 ft. It's drawn as a LOOP that descends the far side — we're going up and back down the same ladders, so ours is shorter (~4.8 mi) with the same climb. Follow their ascent half only.",
        caution: true,
      },
    ],
    caltopo: caltopo(44.122, -73.972, 15),
  },
  {
    id: "marshall-herbert",
    kind: "summit",
    title: "Mount Marshall (4,360 ft — #25) via Herbert Brook",
    path: "Lake Colden camp → dam → Herbert Brook herd path → summit",
    dist: "≈4.0–4.6 mi RT from Lake Colden camp",
    gain: "+1,745 ft",
    time: "3–3½ hrs",
    markers: "NO MARKERS. Unmaintained herd path, cairn at the start, brook as the handrail",
    summary:
      "Dan's 46er, and the single best argument for camping on the Upper Works side. Short, steep, wet, and completely unmarked — you follow Herbert Brook up and cross it over and over. Legitimately a half-day, which makes it Saturday-afternoon material after the carry in.",
    legs: [
      {
        mi: 0,
        at: "Lake Colden dam",
        doThis: "Head south/west from the dam toward the Flowed Lands side.",
        major: true,
      },
      {
        mi: 0.25,
        at: "Herbert Brook cairn",
        doThis:
          "Just past the dam, right after a small stream crossing, a CAIRN marks the herd path leaving the main trail. This is the whole navigation problem of the day.",
        warn: "There is no sign. Cairns get knocked over. Scout it the evening before on the way past — it's a lot easier to find in good light without a schedule.",
        major: true,
      },
      {
        mi: 0.6,
        at: "Into the drainage",
        doThis:
          "The path narrows fast and follows Herbert Brook. When in doubt, the brook is the trail — stay with it.",
        note: "Expect to cross the brook many times. Wet feet are the plan, not the accident.",
      },
      {
        mi: 1.75,
        at: "Brook peters out",
        doThis:
          "The water disappears and the path swings up through the last steep, rooty pitch. ~1,500 ft of the day's climbing happens in this 1.5-mile stretch.",
      },
      {
        mi: 2.0,
        at: "Mount Marshall summit",
        ele: "4,360 ft",
        doThis:
          "Wooded summit with a small opening — Colden and Iroquois through the trees. Sign the canister if there is one and get Dan a photo.",
        note: "Descending an unmarked path is harder than climbing it. Keep the group together.",
        major: true,
      },
    ],
    warnings: [
      "Unmarked herd path — nobody does this one solo, and everyone carries a headlamp even for an afternoon run.",
      "The brook is the handrail. If you lose it, go back down until you find it again rather than contouring.",
    ],
    links: [
      {
        label: "AllTrails — Mount Marshall via the Calamity Brook Trail",
        url: "https://www.alltrails.com/trail/us/new-york/mount-marshall-via-the-calamity-brook-trail",
        diff: "The right approach side, but measured door-to-door from Upper Works (~16 mi RT). Ours is the last ~4.5 mi of it, because we've already carried the first 5.6 in and slept there. Download it for the herd-path track.",
      },
      {
        label: "AllTrails — Marshall via Avalanche Pass + Herbert Brook [CLOSED]",
        url: "https://www.alltrails.com/trail/us/new-york/mount-marshall-via-avalanches-pass-herbert-brook-trail",
        diff: "DO NOT USE as a route. AllTrails has flagged it CLOSED — it approaches through the shut Avalanche Pass. Linked only so nobody downloads it by mistake; the Herbert Brook half is the same as ours.",
        caution: true,
      },
    ],
    caltopo: caltopo(44.125, -74.0, 15),
  },
  {
    id: "marcy-feldspar",
    kind: "summit",
    title: "Marcy, Gray & Skylight (5,344 / 4,840 / 4,926 ft — #1, #7, #4)",
    path: "Lake Colden camp → Opalescent River → Feldspar Brook → Lake Tear → Four Corners → pick your peaks",
    dist: "≈10–12 mi RT depending on the variant",
    gain: "+3,000–4,000 ft",
    time: "7–11 hrs",
    markers:
      "Marked and signed the whole chain (yellow up the Opalescent/Feldspar, red Skylight, blue Marcy) — EXCEPT Gray, which is an unmarked herd path",
    summary:
      "The big day, and the whole argument for camping at Lake Colden: one approach up the Opalescent and Feldspar Brook puts three of the state's five highest within reach, and you decide how greedy to be AT Four Corners, not in camp. Marcy is the main event; Gray is a cheap 46er detour from Lake Tear; Skylight is the best open summit of the three and a half-mile hop from the junction.",
    planningGrade: true,
    variants: [
      {
        label: "Marcy only",
        dist: "≈10 mi RT",
        gain: "+3,000 ft",
        time: "7–9 hrs",
        note: "The default. Committed but honest — turn around at Four Corners by 1 PM if the pace is off.",
      },
      {
        label: "Marcy + Gray",
        dist: "≈11 mi RT",
        gain: "+3,500 ft",
        time: "8–10 hrs",
        note: "Gray costs ~1.2 mi and ~500 ft round trip from Lake Tear — the cheapest 46er add-on of the weekend. Do Gray FIRST (on the way up, legs fresh), then Marcy.",
      },
      {
        label: "Marcy + Gray + Skylight",
        dist: "≈12 mi RT",
        gain: "+4,000 ft",
        time: "9–11 hrs",
        note: "The triple. Only on the table if we're at Four Corners by ~11 AM with weather holding — Skylight is the one to drop if anything's tight, and the one to KEEP if Marcy's summit is socked in (its view is the sleeper hit).",
      },
    ],
    legs: [
      {
        mi: 0,
        at: "Lake Colden camp",
        doThis:
          "Alpine start — packs ready the night before, walking by 6 AM. This day does not work if you leave after 7.",
        major: true,
      },
      {
        mi: 0.3,
        at: "Opalescent River trail",
        doThis: "Cross the dam/outlet and head east up the Opalescent.",
      },
      {
        mi: 1.3,
        at: "Opalescent gorge",
        doThis:
          "The trail hugs the river through a flume section — walkways and rock. The prettiest half-mile of the trip.",
      },
      {
        mi: 2.2,
        at: "Feldspar lean-to + Feldspar Brook confluence",
        doThis:
          "Feldspar Brook comes in from the east and the trail bends up alongside it. Water and the last good rest spot before the climb steepens.",
        warn: "DEC reports a BROKEN STRINGER on the Feldspar lean-to access bridge over the Opalescent. Use caution here — and in high water treat this whole approach the same as the Calamity crossing.",
        major: true,
      },
      {
        mi: 2.7,
        at: "Uphill lean-to + Lake Arnold junction",
        doThis:
          "The Lake Arnold trail forks LEFT/north (that's the way toward the closed-side country — not today). Stay RIGHT, climbing with Feldspar Brook toward Lake Tear.",
      },
      {
        mi: 3.8,
        at: "Lake Tear of the Clouds",
        ele: "4,293 ft",
        doThis:
          "The highest source of the Hudson River — the same water we crossed on a bridge 5 miles from the car. GRAY VARIANT: the herd path leaves near the outlet, marked by a cairn — ~0.6 mi and ~450 ft each way, unmarked but well-trodden, one short scramble. Summit is wooded with a lookout.",
        note: "Last reliable water before Marcy's summit cone. Tank up here either way.",
        major: true,
      },
      {
        mi: 4.0,
        at: "Four Corners — decision point",
        ele: "~4,300 ft",
        doThis:
          "Four-way junction and the day's real decision. LEFT/north: Marcy, 0.9 mi and +1,050 ft on the blue trail, above treeline for the last stretch. RIGHT/south: Skylight, 0.5 mi and +600 ft on the red trail, open summit. SKYLIGHT VARIANT: do it before or after Marcy from right here — and carry a rock up; tradition says it keeps the rain off.",
        major: true,
      },
      {
        mi: 4.9,
        at: "Mount Marcy summit",
        ele: "5,344 ft",
        doThis:
          "The state's high point, from its quiet side. Cairns and paint above treeline — stay on bare rock, the alpine plants are the rarest community in New York. Same descent, all of it.",
        major: true,
      },
    ],
    warnings: [
      "TURNAROUND TIME IS THE WHOLE GAME. Set it before leaving camp and honour it — 10+ miles at High Peaks pace is not something to be optimistic about.",
      "This is a Saturday day, never a Sunday day. No variant fits inside the drive-home deadline.",
      "Gray's herd path is unmarked: if the cairn at Lake Tear isn't obvious, don't freelance — the drainage terrain up there is confusing in fog.",
    ],
    links: [
      {
        label: "AllTrails — Mount Marcy from Upper Works",
        url: "https://www.alltrails.com/trail/us/new-york/mount-marcy-from-upper-works-trail",
        diff: "Same chain of junctions, but door-to-door from the car — roughly 20 mi RT. Ours is that route minus the 5.6-mi approach on each end, because we sleep at Lake Colden. Their track is what we want; their mileage isn't.",
      },
      {
        label: "AllTrails — Mount Skylight, Mount Marcy & Gray Peak Loop",
        url: "https://www.alltrails.com/trail/us/new-york/mount-skylight-mount-marcy-and-gray-peak-loop-trail",
        diff: "The three-peak day as most people do it — an 18.2-mi loop from the Loj side. Useful because it has the Gray herd path and the Skylight trail drawn on the map, and its Lake Tear → Four Corners → summits core is exactly ours. Ignore its approach entirely; we come up the Feldspar side from camp.",
        caution: true,
      },
    ],
    caltopo: caltopo(44.109, -73.933, 14),
  },
  {
    id: "algonquin-lc",
    kind: "summit",
    title: "Algonquin (5,114 ft — #2) from the lake — plus Wright (4,580 ft — #16)",
    path: "Lake Colden camp → NW shore → Algonquin trail (southeast side) → summit → optional Wright out-and-back",
    dist: "≈4.5 mi RT · ≈7 mi RT with Wright",
    gain: "+2,350 ft / +3,900 ft with Wright",
    time: "4½–6 hrs / 7–9 hrs with Wright",
    markers: "YELLOW discs from the lake to the summit area; cairns + paint above treeline",
    summary:
      "The state's #2 summit, straight up from camp — one of the steepest marked climbs in the park, gaining ~2,350 ft in roughly two miles, with slab and a headwall before treeline. The payoff is the best bare summit of the whole range. Wright is available as an add-on, but it lives 0.9 mi down the FAR side, so the return climbs most of Algonquin again — price it honestly before committing.",
    planningGrade: true,
    variants: [
      {
        label: "Algonquin only",
        dist: "≈4.5 mi RT",
        gain: "+2,350 ft",
        time: "4½–6 hrs",
        note: "Short, brutal, spectacular. The honest half-day-plus option.",
      },
      {
        label: "Algonquin + Wright",
        dist: "≈7 mi RT",
        gain: "+3,900 ft",
        time: "7–9 hrs",
        note: "Two 46ers, but the return re-climbs ~1,000 ft of Algonquin. Full-day commitment with three above-treeline crossings of the summit ridge — weather has to be solid, not just OK.",
      },
    ],
    legs: [
      {
        mi: 0,
        at: "Lake Colden camp",
        doThis: "Head to the lake's northwest side, past the interior ranger outpost.",
        major: true,
      },
      {
        mi: 0.3,
        at: "Algonquin trail junction",
        doThis:
          "The signed YELLOW trail for Algonquin turns uphill/west off the lakeshore trail. Straight ahead continues toward Avalanche Lake — pretty, but the corridor beyond it to the Loj side is CLOSED, and it's not our day anyway.",
        warn: "Check in at the outpost if the ranger's there — best current intel on the upper mountain.",
      },
      {
        mi: 1.0,
        at: "The brook and the falls",
        doThis:
          "The trail climbs beside a cascading brook. LAST WATER — fill everything; the upper mountain is bone dry.",
        note: "The grade so far is the gentle part. It gets steeper.",
        major: true,
      },
      {
        mi: 1.5,
        at: "Slab and headwall",
        doThis:
          "Open rock slab pitches, some with water seeps. Hands come out of pockets. In the wet this section is the reason to pick a different day.",
        warn: "Slick when wet — same rule as the Colden ladders: steady rain cancels this route.",
      },
      {
        mi: 1.9,
        at: "Treeline",
        doThis:
          "Shells on BEFORE stepping out of the trees. Cairns and yellow paint from here — in fog, navigate cairn-to-cairn and no other way.",
      },
      {
        mi: 2.1,
        at: "Algonquin summit",
        ele: "5,114 ft",
        doThis:
          "Full-circle alpine dome: Colden's slides across the valley, Marcy behind it, Iroquois next door. Stay on bare rock — the summit steward's plants are the rarest in the state.",
        note: "WRIGHT DECISION HAPPENS HERE, with the weather in front of you — not in camp.",
        major: true,
      },
      {
        mi: 3.0,
        at: "Wright spur junction (Wright variant)",
        doThis:
          "Descend Algonquin's NORTH side 0.9 mi (−1,000 ft, above treeline at first) to the signed spur, then 0.4 mi and ~+500 ft east to Wright's summit.",
        warn: "COMMITTING: from Wright, camp is back over Algonquin's summit — there is no way around. Budget the re-climb before you drop.",
      },
      {
        mi: 3.4,
        at: "Wright summit (Wright variant)",
        ele: "4,580 ft",
        doThis:
          "Bare and exposed, with wreckage and a memorial plaque from a 1962 B-47 bomber crash near the top. Then back: spur down, 0.9 mi and ~1,000 ft back up Algonquin, over the top, and down the yellow trail to camp.",
        major: true,
      },
    ],
    warnings: [
      "This southeast side is significantly steeper than the standard Loj route — daypacks light, poles out, no racing the descent.",
      "Both summits are fully exposed. Any thunder forecast in the window kills this route — there is nowhere to hide up there.",
      "The Wright add-on doubles the above-treeline time. It's the first thing to drop when the sky argues.",
    ],
    links: [
      {
        label: "AllTrails — Wright, Algonquin, Colden Loop",
        url: "https://www.alltrails.com/trail/us/new-york/wright-algonquin-colden",
        diff: "A 14.3-mi / 5,101-ft Loj-side loop whose Algonquin → Lake Colden descent leg is exactly our climb, in reverse. Use it for the track between the lake and the summit; ignore the rest (its loop runs through the closed corridor's side of the range).",
        caution: true,
      },
      {
        label: "AllTrails — Algonquin + Wright via Algonquin Trail",
        url: "https://www.alltrails.com/trail/us/new-york/algonquin-peak-and-wright-peak-via-algonquin-trail",
        diff: "The Loj-side version of Algonquin + Wright. Wrong approach for us, but the summit-to-Wright segment (the 0.9-mi descent + 0.4-mi spur) is exactly the piece we'd walk — read it for that section only.",
        caution: true,
      },
    ],
    caltopo: caltopo(44.135, -73.982, 14),
  },
  {
    id: "wreck",
    kind: "detour",
    title: "The 1969 plane wreck (Cold Brook Pass, ~3,800 ft)",
    path: "Lake Colden camp → Cold Brook Pass trail → ~⅓ mi below the col",
    dist: "≈3 mi RT from Lake Colden camp",
    gain: "+1,050 ft",
    time: "≈2 hrs, plus however long the searching takes",
    markers: "Officially a trail. Functionally not — unmaintained for 10+ years",
    summary:
      "Not really a route, more of an expedition. The fuselage of F. Peter Simmons' Piper Cherokee 140 has sat in the col between Marshall and Iroquois since August 1969, one wing broken off alongside. There is no published GPS for it and people walk past it constantly.",
    planningGrade: true,
    legs: [
      {
        mi: 0,
        at: "Lake Colden camp",
        doThis:
          "Pick up the Cold Brook Pass trail heading west toward the Marshall–Iroquois col. It leaves the main trail near the dam and is faintly signed at best.",
        major: true,
      },
      {
        mi: 1.2,
        at: "Trail quality falls apart",
        doThis: "Blowdown, brush, and a tread that comes and goes. Slow down; this is where groups split up and shouldn't.",
        warn: "DEC officially calls Cold Brook Pass 'not a viable option' — unmaintained for over a decade. The newest trip report anyone can find is 2023 ('brushy but followable').",
      },
      {
        mi: 1.5,
        at: "The wreck",
        ele: "~3,800 ft",
        doThis:
          "Roughly a third of a mile below the top of the pass: look about 100 FT WEST OF THE TRAIL, behind a distinctive ten-foot boulder. Slow to a walk and spread out within sight of each other.",
        note: "Simmons survived. Campers at Lake Colden heard the impact, search planes first misidentified the site as Marcy, and Ranger Gary Hodgson reached him more than 20 hours later.",
        major: true,
      },
    ],
    warnings: [
      "GROUP DECISION, made on the day, on dry legs, in dry weather. Nobody talks anyone into this one.",
      "Hard cutoff: if it isn't found within 45 minutes of reaching the boulder zone, turn around. It'll still be there next trip.",
      "No published GPS coordinates exist. Anything you find online claiming otherwise is a guess.",
    ],
    links: [
      {
        label: "Aviation Week — Aircraft Archaeology in the High Adirondacks",
        url: "https://aviationweek.com/air-transport/aircraft-archaeology-high-adirondacks",
        diff: "The best description of where the wreck actually sits relative to the trail. Still no coordinates.",
      },
      {
        label: "Adirondack Explorer — on the wreck",
        url: "https://www.adirondackexplorer.org/communities/history/adirondacks-plane-crash-wreckage/",
        diff: "The story and the rescue, not the navigation.",
      },
      {
        label: "ASN accident record",
        url: "https://asn.flightsafety.org/wikibase/169392",
        diff: "The official record of the accident. Reference, not route.",
      },
    ],
    caltopo: caltopo(44.1305, -74.006, 15),
  },
];

/* ------------------------------------------------------------------ *
 * TRAILHEADS — driving directions
 * ------------------------------------------------------------------ */

const FARM = "49 Clarks Mill Rd, Greenwich, NY 12834";

const gmapsDir = (destination: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(FARM)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;

const gmapsPin = (lat: number, lon: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

export type Trailhead = {
  id: "uw";
  name: string;
  drive: string;
  coords: string;
  /** Google Maps directions from the farm. */
  directionsUrl: string;
  /** Google Maps pin for the parking lot itself. */
  pinUrl: string;
  /** Written road directions, because the last stretch has no service. */
  roadSteps: string[];
  parking: string;
  lastServices: string;
  leaveBy: string;
};

export const TRAILHEADS: Trailhead[] = [
  {
    id: "uw",
    name: "Upper Works (Tahawus)",
    drive: "≈2¾ hrs from the farm",
    coords: "44.0886, −74.0562 · Upper Works Rd, Newcomb, NY 12852",
    directionsUrl: gmapsDir("44.0886,-74.0562"),
    pinUrl: gmapsPin(44.0886, -74.0562),
    roadSteps: [
      "From the farm, get on I-87 (the Northway) NORTH.",
      "Take EXIT 29.",
      "Turn WEST onto Blue Ridge Rd (CR 84) toward Newcomb. Follow it 17.4 miles.",
      "Turn RIGHT onto Tahawus Rd (CR 25). Stay on it 6.3 miles.",
      "Turn LEFT at the sign for High Peaks trails.",
      "2.8 miles up this road you pass the old blast furnace — unmistakable, and worth the two-minute stop on the way out.",
      "Less than a mile past the furnace, the road ends at the parking area.",
    ],
    parking:
      "Free. 60 vehicles. The lot sits ~0.1 mi from the old one, so you walk out through the ruins of the Adirondac mining village to reach the trail. No pre-dawn parking panic here — ~5 AM out of Greenwich is fine.",
    lastServices:
      "Last gas is on I-87 or in Newcomb — do NOT plan on anything past the Blue Ridge Rd turn. Cell service dies partway up Tahawus Rd and does not come back.",
    leaveBy:
      "~5 AM out of Greenwich. The lot is big and rarely fills, so the constraint here is daylight and the carry-in, not parking.",
  },
];

/* Everyone's phones need the same maps downloaded before we lose service. */
export const NAV_APPS = [
  {
    app: "AllTrails (+ subscription for offline)",
    who: "Everyone",
    why: "Every marked trail on this page is on AllTrails, the crowd trip reports are the fastest read on current conditions, and the offline download is one tap. Good enough for 90% of this trip.",
    gap: "Weak on unmarked herd paths, and the listed routes almost never match ours exactly — check the 'what's different' note on every link above before trusting a mileage.",
  },
  {
    app: "CalTopo",
    who: "At least one person",
    why: "Free in the browser, real USGS topo, and it shows the herd paths and old trails AllTrails doesn't. Every route above has a CalTopo link at the right zoom.",
    gap: "Offline use on a phone needs the paid tier.",
  },
  {
    app: "Gaia GPS",
    who: "Matt, if we commit to the wreck",
    why: "The best of the three for off-trail work — the layer stack (USGS + slope + old survey maps) is what you actually want on Cold Brook Pass, and you can drop and share waypoints with the group.",
    gap: "Subscription. Only worth it if the wreck detour is really happening — otherwise AllTrails plus one CalTopo user covers us.",
  },
  {
    app: "Google Maps offline area",
    who: "Whoever's driving",
    why: "Download the Newcomb / Lake Placid area at home. Both approach roads lose service before the trailhead, and Tahawus Rd in particular is where a live-routing phone gives up.",
    gap: "Roads only — it knows nothing about trails.",
  },
];
