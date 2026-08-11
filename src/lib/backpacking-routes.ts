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

export type RouteDoc = {
  id: string;
  kind: "approach" | "summit" | "detour";
  /** Which trailhead this route belongs under. */
  trailhead: "loj" | "uw";
  title: string;
  /** One-line "from → to". */
  path: string;
  dist: string;
  gain: string;
  time: string;
  /** Trail markers / colours, as signed. */
  markers: string;
  summary: string;
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
    trailhead: "uw",
    title: "Upper Works → Flowed Lands → Lake Colden",
    path: "Upper Works trailhead → Calamity Brook Trail → Flowed Lands (4.6) → Lake Colden (5.6)",
    dist: "4.6 mi to Flowed Lands · 5.6 mi to Lake Colden",
    gain: "+1,000 ft / +1,325 ft",
    time: "2½–3½ hrs / 3–4 hrs with full packs",
    markers: "RED discs to the 1.4-mi junction, then BLUE discs the rest of the way",
    summary:
      "The southern approach, and the whole reason the Upper Works options exist — it never touches the closed Avalanche Pass. Flat and easy for the first 1.4 miles, then a steady unglamorous grind up alongside Calamity Brook. Both camps are on the same trail: Flowed Lands is the early bail-out, Lake Colden is one more mile of rolling shoreline.",
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
          "First big view — Colden fills the whole skyline across the water. Lean-tos and designated tent sites here. CAMP OPTION #1: stop here and you're done carrying.",
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
          "CAMP OPTION #2. Lean-tos and designated sites around the lake, interior ranger outpost nearby, and the shortest launch for Colden, Marshall, and the wreck.",
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
  {
    id: "loj-to-marcydam",
    kind: "approach",
    trailhead: "loj",
    title: "Adirondak Loj → Marcy Dam",
    path: "Adirondak Loj / Heart Lake → Van Hoevenberg Trail → Marcy Dam",
    dist: "2.3 mi",
    gain: "+250 ft",
    time: "1–1¼ hrs with full packs",
    markers: "BLUE discs (Van Hoevenberg Trail) the whole way",
    summary:
      "The easiest carry in the High Peaks and the reason this option exists — an hour of nearly flat walking and the overnight weight is off your back. One junction, well signed, impossible to botch.",
    legs: [
      {
        mi: 0,
        at: "Adirondak Loj / Heart Lake parking",
        ele: "~2,180 ft",
        doThis:
          "Pay at the booth, then hit the High Peaks Information Center for bear can #2 before starting. Trail leaves from the far end of the lot.",
        note: "$25/day non-member, $10 ADK member. Lot fills BEFORE 6 AM on summer Saturdays.",
        major: true,
      },
      {
        mi: 0.1,
        at: "Trail register",
        doThis: "Sign in — name, party size, destination, expected out date. Sign out on Sunday.",
      },
      {
        mi: 1.0,
        at: "Algonquin junction",
        doThis:
          "Signed split. LEFT/west is the Algonquin (MacIntyre Range) Trail — that's the Algonquin + Wright day. Stay RIGHT on the blue Van Hoevenberg for Marcy Dam.",
        note: "Worth registering mentally: this is where an Algonquin day would peel off if we start from the car.",
      },
      {
        mi: 1.6,
        at: "MacIntyre Brook",
        doThis: "Cross and keep rolling. Gentle grade, well-worn, busy.",
      },
      {
        mi: 2.3,
        at: "Marcy Dam",
        ele: "~2,320 ft",
        doThis:
          "CAMP. 15 numbered designated tent sites (confirmed open Aug 2026), privies, and the classic Colden view across the flats. Pick a site, hang nothing, cans 100+ ft downwind.",
        note: "The dam itself is breached post-Irene; the crossing is a bridge. Marcy Brook is the water source.",
        major: true,
      },
    ],
    warnings: [
      "Parking is the real risk, not the trail. ADK says the lot fills before 6 AM on summer Saturdays and full means turned away — hence the ~3:15 AM departure.",
      "Busiest camping area in the High Peaks. Sites go early on a Saturday.",
    ],
    links: [
      {
        label: "AllTrails — Marcy Dam Trail",
        url: "https://www.alltrails.com/trail/us/new-york/marcy-dam-trail",
        diff: "Exactly our carry, listed as a 4.7 mi out-and-back day hike. We walk half of it Saturday and half Sunday.",
      },
      {
        label: "ADK — hiker parking at Heart Lake",
        url: "https://adk.org/hiker-parking-at-heart-lake/",
        diff: "Current rates and how early the lot actually fills.",
      },
    ],
    caltopo: caltopo(44.17, -73.955, 14),
  },

  /* ------------------------------------------------------------------ *
   * SUMMIT RUNS — LOJ / MARCY DAM SIDE
   * ------------------------------------------------------------------ */
  {
    id: "marcy-vanho",
    kind: "summit",
    trailhead: "loj",
    title: "Mount Marcy (5,344 ft — #1) via the Van Hoevenberg Trail",
    path: "Marcy Dam camp → Phelps jct → Indian Falls → Hopkins jct → summit",
    dist: "≈10.2 mi RT from camp (14.8 mi RT from the Loj)",
    gain: "+2,900 ft",
    time: "7–8½ hrs",
    markers: "BLUE discs (Van Hoevenberg) all the way to the summit",
    summary:
      "The main event, and the reason Marcy Dam is a good basecamp — the highest point in New York, on daypacks, straight out the tent door. The last mile is bare alpine rock with a summit cone you can see from a long way off. Zero interaction with the Avalanche Pass closure.",
    legs: [
      {
        mi: 0,
        at: "Marcy Dam camp",
        ele: "~2,320 ft",
        doThis: "Leave by 7 AM at the latest. Full water, layers, headlamps regardless.",
        major: true,
      },
      {
        mi: 0.7,
        at: "Phelps Mountain junction",
        doThis:
          "Signed junction, trail to Phelps leaves left. Stay straight for Marcy. (Loj mile 3.0.)",
        note: "This is the bail-out/bonus junction — Phelps is 1.2 mi and +1,000 ft from here.",
      },
      {
        mi: 1.3,
        at: "Phelps Brook",
        doThis: "Cross. Grade picks up after this.",
      },
      {
        mi: 2.0,
        at: "Indian Falls",
        ele: "~3,700 ft",
        doThis:
          "Short spur left to open rock at the top of the falls. Full-frontal MacIntyre Range view — the best rest stop on the route. (Loj mile 4.3.)",
        note: "LAST RELIABLE WATER. Everything above here is dry. Tank up: ~2L each for the rest.",
        major: true,
      },
      {
        mi: 2.1,
        at: "Tabletop herd path",
        doThis:
          "Unmarked path on the left just past Indian Falls. Ignore it unless we're bagging Tabletop (0.6 mi, +500 ft, wooded summit).",
      },
      {
        mi: 3.7,
        at: "Hopkins Trail junction",
        doThis:
          "Trail from Johns Brook / Keene Valley joins from the left. Stay on the blue trail toward Marcy. (Loj mile 6.0.)",
      },
      {
        mi: 4.5,
        at: "Phelps Trail junction + treeline",
        doThis:
          "Second Keene Valley trail joins from the left. Treeline is right about here — the trail turns into cairns and yellow paint blazes on open rock. (Loj mile 6.8.)",
        warn: "Above treeline the wind and temperature change completely. Shells on before you leave the trees, not after. In fog, cairn-to-cairn only.",
      },
      {
        mi: 5.1,
        at: "Mount Marcy summit",
        ele: "5,344 ft",
        doThis:
          "The high point of New York. Stay on bare rock — the alpine vegetation up there is the rarest plant community in the state and a summit steward will (rightly) say something.",
        note: "On a clear day: Whiteface, the Great Range, Algonquin, and on the far horizon Vermont.",
        major: true,
      },
    ],
    warnings: [
      "Turnaround discipline: if we're not at treeline by 1 PM, we're not summiting. The descent is slower than it feels.",
      "Marcy makes its own weather. A 75°F trailhead and a 45°F gusty summit is a completely normal August pairing.",
    ],
    links: [
      {
        label: "AllTrails — Mount Marcy via Van Hoevenberg Trail",
        url: "https://www.alltrails.com/trail/us/new-york/mount-marcy-via-van-hoevenberg-trail--5",
        diff: "Same trail, but measured from the Loj: 14.8 mi / ~3,570 ft. We're starting at Marcy Dam, so subtract 4.6 mi round trip and ~250 ft of gain — call it 10.2 mi / 2,900 ft for us.",
      },
      {
        label: "AllTrails — Marcy + Tabletop via Van Hoevenberg",
        url: "https://www.alltrails.com/trail/us/new-york/mount-marcy-and-tabletop-via-van-hoevenberg-trail",
        diff: "The two-peak version, 15.7 mi / 4,288 ft from the Loj. From camp that's ≈11 mi — the greedy option if the weather is perfect and everyone's moving well.",
      },
    ],
    caltopo: caltopo(44.13, -73.935, 14),
  },
  {
    id: "algonquin-wright",
    kind: "summit",
    trailhead: "loj",
    title: "Algonquin (5,114 ft — #2) + Wright (4,580 ft — #16)",
    path: "Adirondak Loj → Algonquin (MacIntyre Range) Trail → Wright spur → Algonquin summit",
    dist: "≈8.6 mi RT Algonquin alone · ≈9.6 mi RT with Wright",
    gain: "+2,940 ft / +3,700 ft with Wright",
    time: "6–7 hrs / 7–8½ hrs with Wright",
    markers: "Signed for Algonquin from the Loj junction; yellow paint + cairns above treeline",
    summary:
      "The second-highest peak in New York and the best bare-summit view in the park, plus a 0.8-mile round-trip detour that buys a second 46er. Steep and relentless — it gains almost 3,000 ft in 4 miles with no flat sections to recover on. Completely untouched by the Avalanche Pass closure.",
    legs: [
      {
        mi: 0,
        at: "Adirondak Loj / Heart Lake",
        ele: "~2,180 ft",
        doThis: "Same trailhead and same first mile as Marcy Dam.",
        major: true,
      },
      {
        mi: 1.0,
        at: "Algonquin junction",
        doThis: "Bear LEFT/west where the blue Van Hoevenberg continues right to Marcy Dam.",
      },
      {
        mi: 1.6,
        at: "MacIntyre Brook",
        doThis: "Cross. The trail steepens and stops pretending from here on.",
      },
      {
        mi: 2.6,
        at: "MacIntyre Falls",
        doThis: "Waterfall on the left, and the rock-step section starts right after.",
        note: "LAST RELIABLE WATER before Algonquin. Fill here.",
        major: true,
      },
      {
        mi: 3.0,
        at: "Sharp left + DEC alpine warning sign",
        doThis:
          "The trail bends hard left at the posted warning about above-treeline weather. Take the sign seriously — this is where you decide whether the day is on.",
        warn: "If it's socked in or the wind is up, this is the honest turnaround point. Wright and Algonquin are both fully exposed.",
      },
      {
        mi: 3.2,
        at: "Wright Peak spur junction",
        doThis:
          "Signed spur left/east: 0.4 mi and +400 ft to Wright's summit. Do it on the way UP if the weather is good and on the way down if it's marginal.",
        note: "Wreckage and a memorial plaque from a 1962 B-47 bomber crash sit near the summit — a second plane wreck, and this one you don't have to bushwhack for.",
      },
      {
        mi: 3.6,
        at: "Wright Peak summit (spur)",
        ele: "4,580 ft",
        doThis: "Bare, exposed, and a straight-down look at Heart Lake. Back the way you came.",
        major: true,
      },
      {
        mi: 4.3,
        at: "Algonquin summit",
        ele: "5,114 ft",
        doThis:
          "Huge open alpine dome. Cairns and yellow paint above treeline — stay on the rock, the vegetation up there is protected.",
        note: "Best seat in the house for Colden's slides, Iroquois, and the Marcy massif across the valley.",
        major: true,
      },
    ],
    warnings: [
      "This route starts at the LOJ, not at Marcy Dam camp. From camp you either walk the 2.3 mi back to the car first (adds ~4.6 mi to the day) or take the Whale's Tail connector below.",
      "Both summits are fully above treeline with no shelter. Turn around at the 3.0-mi sign if the weather is doing anything at all.",
    ],
    links: [
      {
        label: "AllTrails — Algonquin + Wright via Algonquin Trail",
        url: "https://www.alltrails.com/trail/us/new-york/algonquin-peak-and-wright-peak-via-algonquin-trail",
        diff: "This one is exact — 9.6 mi / ~3,700 ft, same trailhead, same spur. Nothing to adjust. Download this one.",
      },
      {
        label: "AllTrails — Wright Peak only",
        url: "https://www.alltrails.com/trail/us/new-york/wright-peak-via-van-hoevenberg-trail",
        diff: "Wright alone, ~6.7 mi RT — the half-day version if Algonquin's weather looks bad but the lower summit doesn't.",
      },
      {
        label: "AllTrails — Algonquin + Iroquois + Wright",
        url: "https://www.alltrails.com/trail/us/new-york/algonquin-peak-and-iroquois-peak-via-algonquin-trail--2",
        diff: "Adds Iroquois (#8) past Algonquin via the Boundary Peak herd path — ~11.5 mi and a much longer day. Filed under 'next trip', not this one.",
      },
    ],
    caltopo: caltopo(44.155, -73.975, 14),
  },
  {
    id: "whalestail",
    kind: "detour",
    trailhead: "loj",
    title: "Connector: Marcy Dam camp → Algonquin Trail (Whale's Tail)",
    path: "Marcy Dam → Whale's Tail Ski Trail → Algonquin Trail (~1.5 mi mark)",
    dist: "≈1.2 mi (planning estimate)",
    gain: "+250 ft",
    time: "40–50 min",
    markers: "Signed ski trail — narrower, wetter, and rougher than the hiking trails",
    summary:
      "The shortcut that makes Algonquin and Wright reachable from a Marcy Dam camp without walking back to the car. The Whale's Tail Ski Trail cuts west from the Marcy Dam area through Whale's Tail Notch and joins the Algonquin Trail roughly a mile and a half above the Loj.",
    planningGrade: true,
    legs: [
      {
        mi: 0,
        at: "Marcy Dam",
        doThis: "Pick up the signed Whale's Tail Ski Trail heading west from the Marcy Dam area.",
        major: true,
      },
      {
        mi: 0.6,
        at: "Whale's Tail Notch",
        doThis: "The high point of the connector, between Whale's Tail Mtn and the MacIntyre spur.",
      },
      {
        mi: 1.2,
        at: "Algonquin Trail junction",
        ele: "~2,360 ft",
        doThis:
          "Join the Algonquin Trail somewhere around its 1.5-mile mark. Turn LEFT/uphill for Algonquin and Wright.",
        note: "Coming back down, this junction is easy to blow past — it's a ski-trail-width opening, not an obvious fork.",
        major: true,
      },
    ],
    warnings: [
      "MILEAGE IS AN ESTIMATE. This is the one route on this page not cross-checked against a published trail description — it's a ski trail, so summer maintenance and signage are both weaker.",
      "SAFE ALTERNATIVE: walk the 2.3 mi back to the Loj and start Algonquin from the car. Costs about 2 extra miles round trip and removes all doubt. If anyone's uneasy, take the sure thing.",
      "Do not attempt this connector in the dark or in fog on the way back.",
    ],
    links: [
      {
        label: "Lake Placid — Whale's Tail Ski Trail",
        url: "https://www.lakeplacid.com/story/2014/03/whales-tail-ski-trail",
        diff: "Written for skiers in winter, which is when this trail gets used most. It confirms the connection and roughly where it meets the Algonquin Trail, but not summer mileage or conditions.",
        caution: true,
      },
    ],
    caltopo: caltopo(44.158, -73.965, 15),
  },
  {
    id: "colden-arnold",
    kind: "summit",
    trailhead: "loj",
    title: "Mount Colden (4,714 ft — #11) via Lake Arnold",
    path: "Marcy Dam camp → Avalanche Camp → Lake Arnold → L. Morgan Porter Trail → summit",
    dist: "≈7–8 mi RT from camp",
    gain: "+2,300 ft",
    time: "5½–7 hrs",
    markers: "BLUE discs to Lake Arnold, then the signed Colden (L. Morgan Porter) trail",
    summary:
      "How to get Colden from the Marcy Dam side without touching the closed pass. You walk toward Avalanche Pass, peel off south at Avalanche Camp, slog up past Lake Arnold, and come at the summit from the north-east. The Lake Arnold section is legendarily wet — DEC is currently warning about knee-deep-plus water on it.",
    planningGrade: true,
    legs: [
      {
        mi: 0,
        at: "Marcy Dam camp",
        doThis: "Head south toward Avalanche Camp.",
        major: true,
      },
      {
        mi: 1.1,
        at: "Avalanche Camp junction",
        doThis:
          "Lean-to and tent sites here. RIGHT/west is Avalanche Pass — CLOSED at the 2025 slide, don't. Bear LEFT/south onto the Lake Arnold trail. (Loj mile 3.4.)",
        warn: "This is the junction where the closure bites. Signed, but read it.",
        major: true,
      },
      {
        mi: 2.1,
        at: "Lake Arnold",
        ele: "~3,900 ft",
        doThis: "Small boggy pond at the height of land. Wet feet from here are a certainty.",
        warn: "DEC currently flags knee-deep or greater water on this trail. Waterproof socks won't save you — plan to walk through it, not around it (widening the mud is how the trail dies).",
      },
      {
        mi: 2.3,
        at: "Colden junction (L. Morgan Porter Trail)",
        doThis: "Signed junction — turn RIGHT/west and start climbing Colden proper.",
      },
      {
        mi: 3.5,
        at: "Mount Colden summit",
        ele: "4,714 ft",
        doThis:
          "Open rock with the single best look straight down at Avalanche Lake, plus Marcy and Algonquin filling either side.",
        warn: "DEC reports a short bushwhack around slide debris on the south-east side. Expect one confusing stretch and look for where the boots have gone.",
        major: true,
      },
    ],
    warnings: [
      "This is the wet option. Everyone brings a dry pair of camp socks or nobody enjoys the evening.",
      "Do not improvise a loop back through Avalanche Pass — it's closed at the slide, with no reopening date.",
    ],
    links: [
      {
        label: "AllTrails — Mount Colden via Van Hoevenberg Trail",
        url: "https://www.alltrails.com/trail/us/new-york/mount-colden-via-van-hoevenberg-trail",
        diff: "Measured from the Loj (~13 mi RT) and it may still describe the Avalanche Pass side of the loop, which is CLOSED. Use it for the Lake Arnold half of the track only, and subtract our 4.6 mi of approach.",
        caution: true,
      },
      {
        label: "Adirondack Explorer — Colden via the Lake Arnold route",
        url: "https://www.adirondackexplorer.org/recreation/hiking/mount-colden-trail-lake-arnold-route-with-high-peak-views/",
        diff: "A written description of exactly the half we care about, and honest about the mud. No GPX.",
      },
    ],
    caltopo: caltopo(44.128, -73.955, 14),
  },
  {
    id: "phelps-tabletop",
    kind: "summit",
    trailhead: "loj",
    title: "Phelps (4,161 ft — #32) & Tabletop (4,427 ft — #19)",
    path: "Marcy Dam camp → Van Hoevenberg Trail → Phelps jct (0.7) / Tabletop herd path (2.1)",
    dist: "Phelps ≈3.8 mi RT · Tabletop ≈5.0 mi RT · both together ≈7 mi",
    gain: "+2,000 ft / +2,200 ft",
    time: "3–4 hrs / 4½–5½ hrs",
    markers: "Blue Van Hoevenberg to the junctions; Phelps is signed, Tabletop is an unmarked herd path",
    summary:
      "The two short ones. Both hang off the Marcy trail within the first two miles of camp, which makes either a genuinely realistic Sunday-morning peak before we break camp and drive home. Phelps has the better summit; Tabletop is wooded and mostly a 46er checkbox.",
    planningGrade: true,
    legs: [
      { mi: 0, at: "Marcy Dam camp", doThis: "Head up the Van Hoevenberg toward Marcy.", major: true },
      {
        mi: 0.7,
        at: "Phelps junction",
        doThis: "Signed trail leaves LEFT. 1.2 mi and ~+1,000 ft of steady steep to the summit.",
      },
      {
        mi: 1.9,
        at: "Phelps summit",
        ele: "4,161 ft",
        doThis:
          "Rocky opening rather than a true bare summit — but Marcy sits dead centre in the view, framed by the Great Range.",
        major: true,
      },
      {
        mi: 2.0,
        at: "Indian Falls (for Tabletop)",
        doThis: "Continue past the Phelps junction on the main trail to Indian Falls. Water here.",
      },
      {
        mi: 2.1,
        at: "Tabletop herd path",
        doThis:
          "Unmarked, unsigned, on the LEFT just past Indian Falls. 0.6 mi and +500 ft. Wooded, muddy, and genuinely easy to walk straight past.",
        warn: "No sign, no markers. If you're doing Tabletop, someone needs a downloaded map with the herd path on it.",
      },
      {
        mi: 2.7,
        at: "Tabletop summit",
        ele: "4,427 ft",
        doThis: "Wooded summit with one small viewpoint. Bag it and go.",
        major: true,
      },
    ],
    links: [
      {
        label: "AllTrails — Phelps Mountain Trail",
        url: "https://www.alltrails.com/trail/us/new-york/phelps-mountain-trail--2",
        diff: "From the Loj at ~8.4 mi RT. Our camp sits 2.3 mi along that track, so from the tent it's roughly 3.8 mi round trip.",
      },
      {
        label: "AllTrails — Phelps + Tabletop",
        url: "https://www.alltrails.com/trail/us/new-york/phelps-and-tabletop-mountains-trail",
        diff: "Both peaks in one loop from the Loj. Same subtraction: our start is 2.3 mi in. Useful mainly because it has the unmarked Tabletop herd path drawn on the map.",
      },
    ],
    caltopo: caltopo(44.148, -73.935, 14),
  },

  /* ------------------------------------------------------------------ *
   * SUMMIT RUNS — LAKE COLDEN / UPPER WORKS SIDE
   * ------------------------------------------------------------------ */
  {
    id: "colden-west",
    kind: "summit",
    trailhead: "uw",
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
    trailhead: "uw",
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
    trailhead: "uw",
    title: "Mount Marcy (5,344 ft — #1) via Feldspar & Four Corners",
    path: "Lake Colden camp → Opalescent River → Feldspar Brook → Lake Tear → Four Corners → summit",
    dist: "≈10 mi RT from Lake Colden camp",
    gain: "+2,700–3,000 ft",
    time: "7–9 hrs",
    markers: "Signed junctions the whole way, but a long chain of them — read every sign",
    summary:
      "The quiet back way up Marcy, and a monster day from either southern camp. It's the prettier approach — the Opalescent gorge, Feldspar Brook, and Lake Tear of the Clouds, the highest source of the Hudson — but it's a full-value 7–9 hours that has to start in the dark.",
    planningGrade: true,
    legs: [
      {
        mi: 0,
        at: "Lake Colden camp",
        doThis: "Alpine start. This day does not work if you leave after 7 AM.",
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
        mi: 2.3,
        at: "Feldspar Brook junction",
        doThis: "Bear LEFT/east and start up Feldspar Brook.",
        warn: "DEC reports a BROKEN STRINGER on the Feldspar lean-to access bridge. Use caution at the Opalescent crossing here — and in high water treat this whole approach the same as the Calamity crossing.",
      },
      {
        mi: 3.2,
        at: "Feldspar lean-to",
        doThis: "Water and the last good rest spot before the climb steepens.",
        major: true,
      },
      {
        mi: 3.9,
        at: "Lake Tear of the Clouds",
        ele: "4,293 ft",
        doThis:
          "The highest source of the Hudson River — the same water we crossed on a bridge 5 miles from the car. The Gray Peak herd path leaves from here.",
        major: true,
      },
      {
        mi: 4.1,
        at: "Four Corners",
        doThis:
          "Four-way junction. LEFT/north is Marcy (0.9 mi). RIGHT is Skylight (0.5 mi, and the standing rule is you carry a rock up).",
      },
      {
        mi: 5.0,
        at: "Mount Marcy summit",
        ele: "5,344 ft",
        doThis: "Up the south side, above treeline for the last stretch. Same descent, all of it.",
        major: true,
      },
    ],
    warnings: [
      "TURNAROUND TIME IS THE WHOLE GAME. Set it before leaving camp and honour it — 10 miles at High Peaks pace is not something to be optimistic about.",
      "This is a Saturday day, never a Sunday day. It does not fit inside the drive-home deadline.",
    ],
    links: [
      {
        label: "AllTrails — Mount Marcy from Upper Works",
        url: "https://www.alltrails.com/trail/us/new-york/mount-marcy-from-upper-works-trail",
        diff: "Same chain of junctions, but door-to-door from the car — roughly 20 mi RT. Ours is that route minus the 5.6-mi approach on each end, because we sleep at Lake Colden. Their track is what we want; their mileage isn't.",
      },
    ],
    caltopo: caltopo(44.115, -73.95, 14),
  },
  {
    id: "wreck",
    kind: "detour",
    trailhead: "uw",
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
  id: "loj" | "uw";
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
    id: "loj",
    name: "Adirondak Loj (Heart Lake)",
    drive: "≈2½ hrs from the farm",
    coords: "44.1829, −73.9639 · 1002 Adirondak Loj Rd, Lake Placid, NY 12946",
    directionsUrl: gmapsDir("Adirondak Loj, 1002 Adirondak Loj Rd, Lake Placid, NY 12946"),
    pinUrl: gmapsPin(44.1829, -73.9639),
    roadSteps: [
      "From the farm, get on I-87 (the Northway) NORTH.",
      "Take EXIT 30.",
      "Turn LEFT onto NY-73 toward Keene / Lake Placid. Stay on it for 26.5 miles — this is the long, pretty, twisty part.",
      "Turn LEFT onto Adirondak Loj Rd at the brown 'High Peaks Trailhead' sign.",
      "5 miles to the end of the road. Pay at the toll booth, park.",
    ],
    parking: "$25/day non-member, $10 ADK member. First-come, first-served. Multi-day parking is allowed — call the High Peaks Info Center (518-523-3441 x121) ahead about overnight billing.",
    lastServices:
      "Last reliable gas and food: Keene or Lake Placid on NY-73. Cell service holds most of the way and dies on Adirondak Loj Rd.",
    leaveBy:
      "LEAVE GREENWICH ~3:15 AM. ADK says the lot fills before 6 AM on summer Saturdays, and full means turned away. This is the least flexible thing about the whole trip.",
  },
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
