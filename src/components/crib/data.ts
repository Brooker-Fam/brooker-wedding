// Data extracted from the Graco Shiloh Convertible Crib & Changer assembly
// manual (Storkcraft, model 04589-00_-BW, Jun. 2024 / ID7518). Diagram images
// in /public/crib are rendered from the manual's own pages.

export interface HardwareItem {
  id: string;
  name: string;
  spec?: string;
  qty: number;
  kind: "bolt" | "screw" | "nut" | "washer" | "dowel" | "pin" | "tool" | "other";
}

export interface Part {
  num: number;
  name: string;
  qty: number;
}

export interface StepHardware {
  id: string;
  qty: number;
}

export interface Step {
  id: string;
  label: string;
  title: string;
  manualNote?: string;
  summary: string[];
  image: string;
  imageSize: [number, number];
  hardware: StepHardware[];
  parts: number[];
  tip?: string;
  warning?: string;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  steps: Step[];
}

export const PRODUCT = {
  name: "Graco Shiloh Convertible Crib & Changer",
  model: "04589",
  support: {
    phone: "1-877-274-0277",
    email: "customercare@storkcraft.com",
    web: "www.storkcraftdirect.com",
    hours: "Mon–Fri, 6:30am–4:00pm PST / 9:30am–7:00pm EST",
  },
};

export const HARDWARE: HardwareItem[] = [
  { id: "A", name: "Bolt", spec: '1/4" × 4-1/2"', qty: 2, kind: "bolt" },
  { id: "B", name: "Bolt", spec: '1/4" × 3-1/2"', qty: 6, kind: "bolt" },
  { id: "C", name: "Bolt", spec: '1/4" × 3"', qty: 4, kind: "bolt" },
  { id: "D", name: "Bolt", spec: '1/4" × 2-9/16"', qty: 4, kind: "bolt" },
  { id: "E", name: "Bolt", spec: '1/4" × 2-1/8"', qty: 15, kind: "bolt" },
  { id: "H", name: "Bolt", spec: '1/4" × 1-3/4"', qty: 16, kind: "bolt" },
  { id: "I", name: "Crescent washer", qty: 4, kind: "washer" },
  { id: "J", name: "Bolt", spec: '1/4" × 1-1/8"', qty: 9, kind: "bolt" },
  { id: "K", name: "Bolt", spec: '1/4" × 5/8"', qty: 22, kind: "bolt" },
  { id: "L", name: "Joint connector nut", qty: 4, kind: "nut" },
  { id: "M", name: "Barrel nut", spec: '1/4" × 5/8"', qty: 10, kind: "nut" },
  { id: "N", name: "Wooden dowel", spec: "Ø8 × 30mm", qty: 18, kind: "dowel" },
  { id: "O", name: "Wooden dowel", spec: "Ø8 × 20mm", qty: 2, kind: "dowel" },
  { id: "P", name: "Safety strap", spec: "two halves: P-1 + P-2", qty: 1, kind: "other" },
  { id: "Q", name: "Screw", spec: "4 × 45mm", qty: 10, kind: "screw" },
  { id: "R", name: "Screw", spec: "4 × 25mm", qty: 10, kind: "screw" },
  { id: "S", name: "Metal pin", spec: "Ø4 × 30mm", qty: 2, kind: "pin" },
  { id: "T", name: "Allen key", qty: 2, kind: "tool" },
  { id: "U", name: "Acorn nut", qty: 2, kind: "nut" },
  { id: "V", name: "Nylon washer", qty: 2, kind: "washer" },
  { id: "W", name: "Spanner wrench", qty: 1, kind: "tool" },
  { id: "X", name: "Bolt", spec: '1/4" × 3/4"', qty: 2, kind: "bolt" },
  { id: "Y", name: "Changer pad", qty: 1, kind: "other" },
  { id: "Z", name: "Plastic barrel nut", qty: 10, kind: "nut" },
];

export const PARTS: Part[] = [
  { num: 1, name: "Left Front Post", qty: 1 },
  { num: 2, name: "Right Front Post", qty: 1 },
  { num: 3, name: "Left Crib End", qty: 1 },
  { num: 4, name: "Right Crib End", qty: 1 },
  { num: 5, name: "Changer End", qty: 1 },
  { num: 6, name: "Right Back Post", qty: 1 },
  { num: 7, name: "Left Back Post", qty: 1 },
  { num: 8, name: "Back Rail", qty: 1 },
  { num: 9, name: "Front Rail", qty: 1 },
  { num: 10, name: "Top Shelf Support Rail (Front)", qty: 1 },
  { num: 11, name: "Changer Support Rail (Front)", qty: 1 }, // manual prints "Supports" (its own typo)
  { num: 12, name: "Changer Bottom Front Rail", qty: 1 },
  { num: 13, name: "Top Shelf Support Rail (Back)", qty: 1 },
  { num: 14, name: "Changer Support Rail (Back)", qty: 1 },
  { num: 15, name: "Changer Bottom Back Rail", qty: 1 },
  { num: 16, name: "Back Top Rail", qty: 1 },
  { num: 17, name: "Back Panel", qty: 1 },
  { num: 18, name: "Front Top Rail", qty: 1 },
  { num: 19, name: "Top Shelf", qty: 1 },
  { num: 20, name: "Bottom Shelf", qty: 1 },
  { num: 21, name: "Changer Back Panel", qty: 1 },
  { num: 22, name: "Crib Drawer Front", qty: 1 },
  { num: 23, name: "Left Crib Drawer Side", qty: 1 },
  { num: 24, name: "Right Crib Drawer Side", qty: 1 },
  { num: 25, name: "Crib Drawer Division", qty: 1 },
  { num: 26, name: "Crib Drawer Bottom", qty: 2 },
  { num: 27, name: "Crib Drawer Back", qty: 1 },
  { num: 28, name: "Changer Left Drawer Side", qty: 1 },
  { num: 29, name: "Changer Right Drawer Side", qty: 1 },
  { num: 30, name: "Changer Drawer Back", qty: 1 },
  { num: 31, name: "Changer Drawer Front", qty: 1 },
  { num: 32, name: "Changer Drawer Bottom", qty: 1 },
  { num: 33, name: "Left Crib Top Rail", qty: 1 },
  { num: 34, name: "Right Crib Top Rail", qty: 1 },
  { num: 35, name: "Left Crib Bottom Rail", qty: 1 },
  { num: 36, name: "Right Crib Bottom Rail", qty: 1 },
  { num: 37, name: "Left Side Crib Drawer Support", qty: 1 },
  { num: 38, name: "Right Side Crib Drawer Support", qty: 1 },
  { num: 39, name: "Crib Stretcher Rail", qty: 1 },
  { num: 40, name: "Mattress Support", qty: 1 },
  { num: 41, name: "Toddler Bed Post Top (Left)", qty: 1 },
  { num: 42, name: "Toddler Bed Post Top (Right)", qty: 1 },
];

export const PARTS_PAGES: { image: string; size: [number, number]; range: string }[] = [
  { image: "/crib/parts-1.webp", size: [1293, 1653], range: "Parts 1–8" },
  { image: "/crib/parts-2.webp", size: [1293, 1646], range: "Parts 9–16" },
  { image: "/crib/parts-3.webp", size: [1294, 1646], range: "Parts 17–25" },
  { image: "/crib/parts-4.webp", size: [1307, 1670], range: "Parts 26–38" },
  { image: "/crib/parts-5.webp", size: [1292, 834], range: "Parts 39–42" },
];

export const HARDWARE_PAGE: { image: string; size: [number, number] } = {
  image: "/crib/hardware.webp",
  size: [1313, 1685],
};

export const CRIB_SECTION: Section = {
  id: "crib",
  title: "Crib & Changer Assembly",
  subtitle: "The main build — 14 steps from a pile of panels to a finished crib.",
  steps: [
    {
      id: "crib-1",
      label: "Step 1",
      title: "Build the left side",
      summary: [
        "Lay out the Left Crib End (3) and attach the Left Crib Top Rail (33) across the top and the Left Crib Bottom Rail (35) below it, securing both with the six H bolts (tighten with the included Allen key).",
        "Attach the Left Side Crib Drawer Support (37) underneath with the two J bolts.",
        "Fit the Left Front Post (1) and Left Back Post (7) onto the assembly, locating them on the wooden dowels (N) as shown.",
      ],
      image: "/crib/step-01.webp",
      imageSize: [1231, 1628],
      hardware: [
        { id: "H", qty: 6 },
        { id: "J", qty: 2 },
        { id: "N", qty: 6 },
      ],
      parts: [1, 3, 7, 33, 35, 37],
      tip: "Work on a rug or blanket so the finish doesn't get scratched.",
    },
    {
      id: "crib-2",
      label: "Step 2",
      title: "Build the right side",
      summary: [
        "Mirror of Step 1 on the other side: attach the Right Crib Top Rail (34) and Right Crib Bottom Rail (36) to the Right Crib End (4) with H bolts — at the bottom rail's slotted ends, the H bolts get the crescent washers (I).",
        "Attach the Right Side Crib Drawer Support (38) with the two J bolts.",
        "Fit the Right Front Post (2) and Right Back Post (6) onto the assembly, locating them on the wooden dowels (N).",
      ],
      image: "/crib/step-02.webp",
      imageSize: [1177, 1640],
      hardware: [
        { id: "H", qty: 6 },
        { id: "J", qty: 2 },
        { id: "N", qty: 8 },
        { id: "I", qty: 2 },
      ],
      parts: [2, 4, 6, 34, 36, 38],
      tip: "The rabbit/turtle icons in the diagram mean: snug the bolts loosely first (rabbit), then fully tighten (turtle) once everything is lined up.",
    },
    {
      id: "crib-3",
      label: "Step 3",
      title: "Frame the changer tower",
      summary: [
        "Attach six rails to the Changer End (5): the Top Shelf Support Rails front (10) and back (13), the Changer Support Rails front (11) and back (14), and the Changer Bottom Rails front (12) and back (15).",
        "Slide the Changer Back Panel (21) into place behind the top shelf supports.",
        "Secure everything with ten E bolts, driven through the pre-drilled holes in the Changer End.",
      ],
      image: "/crib/step-03.webp",
      imageSize: [1120, 771],
      hardware: [{ id: "E", qty: 10 }],
      parts: [5, 10, 11, 12, 13, 14, 15, 21],
    },
    {
      id: "crib-4",
      label: "Step 4",
      title: "Slide in the changer shelves",
      summary: [
        "Slide the Top Shelf (19) and Bottom Shelf (20) into the grooves of the changer frame.",
        "No hardware for this one — just check the notched corners face the way the zoomed circles in the diagram show.",
      ],
      image: "/crib/step-04.webp",
      imageSize: [1098, 840],
      hardware: [],
      parts: [19, 20],
    },
    {
      id: "crib-5",
      label: "Step 5",
      title: "Attach the changer to the right side",
      summary: [
        "Bring the changer tower from Steps 3–4 up against the right-side assembly from Step 2.",
        "Bolt through the Right Back Post with the three D bolts and through the front with the three E bolts, into the changer rails.",
      ],
      image: "/crib/step-05.webp",
      imageSize: [1134, 1677],
      hardware: [
        { id: "D", qty: 3 },
        { id: "E", qty: 3 },
      ],
      parts: [],
      tip: "A second pair of hands makes holding the tower square much easier here.",
    },
    {
      id: "crib-6",
      label: "Step 6",
      title: "Join the sides: back rail & stretcher",
      summary: [
        "Stand both side assemblies up and connect the Back Rail (8) across the top rear with B bolts threading into barrel nuts (M) seated in the rail.",
        "Connect the Crib Stretcher Rail (39) low across the front with C bolts and barrel nuts, locating its ends on the wooden dowels (N).",
        "At the changer side, use the long A bolt with a crescent washer (I) through the slotted hole, into a barrel nut (M) — see the zoomed inset.",
      ],
      image: "/crib/step-06.webp",
      imageSize: [1283, 1653],
      hardware: [
        { id: "A", qty: 1 },
        { id: "B", qty: 3 },
        { id: "C", qty: 2 },
        { id: "M", qty: 6 },
        { id: "I", qty: 1 },
        { id: "N", qty: 2 },
      ],
      parts: [8, 39],
      tip: "Snug everything loosely first, square the frame, then fully tighten (rabbit → turtle).",
    },
    {
      id: "crib-7",
      label: "Step 7",
      title: "Back top rail & back panel",
      summary: [
        "Slide the Back Panel (17) into the grooves above the Back Rail.",
        "Cap it with the Back Top Rail (16), locating on the short dowels (O) and securing with B bolts into barrel nuts (M) at the posts.",
      ],
      image: "/crib/step-07.webp",
      imageSize: [1180, 1625],
      hardware: [
        { id: "B", qty: 2 },
        { id: "M", qty: 2 },
        { id: "O", qty: 2 },
      ],
      parts: [16, 17],
    },
    {
      id: "crib-8",
      label: "Step 8",
      title: "Install the mattress support",
      summary: [
        "Choose one of the 4 height positions and hang the Mattress Support (40) on its brackets — the diagram shows the lowest position, but use the HIGHEST position for a newborn.",
        "Secure the four corner brackets to the posts with K bolts (the ×4 inset), and the spring frame tabs along the rails with the rest of the K bolts.",
        "Tap the two metal pins (S) into the stretcher rail (39) where shown.",
      ],
      image: "/crib/step-08.webp",
      imageSize: [1317, 1702],
      hardware: [
        { id: "K", qty: 18 },
        { id: "S", qty: 2 },
      ],
      parts: [40],
      warning:
        "Set the mattress support to the highest position for newborns; lower it as baby grows and gets more mobile. Once they can pull up to standing, use the lowest position. After assembly, tighten all bolts firmly and re-tighten periodically.",
    },
    {
      id: "crib-9",
      label: "Step 9",
      title: "Attach the front rail",
      summary: [
        "Fit the Front Rail (9) across the front of the crib.",
        "At the changer side, use the long A bolt with crescent washer (I) through the slotted hole into a barrel nut (M) — same trick as Step 6.",
        "Secure the other end with the C bolt into the remaining barrel nut (M), and drive the two E bolts where shown.",
      ],
      image: "/crib/step-09.webp",
      imageSize: [1272, 1646],
      hardware: [
        { id: "A", qty: 1 },
        { id: "C", qty: 1 },
        { id: "E", qty: 2 },
        { id: "M", qty: 2 },
        { id: "I", qty: 1 },
      ],
      parts: [9],
      tip: "Snug loosely, square it up, then tighten fully.",
    },
    {
      id: "crib-10",
      label: "Step 10",
      title: "Attach the front top rail",
      summary: [
        "Cap the front of the crib with the Front Top Rail (18).",
        "Locate it on two dowels (N) and secure with four H bolts — the ×2 inset shows the joint at the changer post.",
      ],
      image: "/crib/step-10.webp",
      imageSize: [1018, 1382],
      hardware: [
        { id: "H", qty: 4 },
        { id: "N", qty: 2 },
      ],
      parts: [18],
    },
    {
      id: "crib-11",
      label: "Step 11",
      title: "Changer pad & safety strap",
      summary: [
        "Bolt the two safety strap halves (P-1 and P-2) through the Top Shelf using the X bolts, nylon washers (V) and acorn nuts (U) — tighten with the included spanner (W).",
        "Set the Changer Pad (Y) on the shelf, thread the strap through it, and clip the buckle together until it clicks.",
        "Panels 1–4 at the bottom of the diagram show how to thread and adjust the buckle.",
      ],
      image: "/crib/step-11.webp",
      imageSize: [1290, 1695],
      hardware: [
        { id: "X", qty: 2 },
        { id: "U", qty: 2 },
        { id: "V", qty: 2 },
        { id: "W", qty: 1 },
        { id: "P", qty: 1 },
        { id: "Y", qty: 1 },
      ],
      parts: [],
      warning:
        "Changing table: max 30 lbs. Always stay in arm's reach — never leave a child unattended on it, and never let a child sleep on it. Use only the pad provided.",
    },
    {
      id: "crib-12",
      label: "Step 12",
      title: "Assemble the changer drawer",
      summary: [
        "Attach the Changer Drawer Sides (28 left, 29 right) to the curved Drawer Front (31) with the short R screws.",
        "Slide the Drawer Bottom (32) into its groove, then fasten the Drawer Back (30) across with the long Q screws threading into the plastic barrel nuts (Z) — see the ×2 inset.",
      ],
      image: "/crib/step-12.webp",
      imageSize: [1171, 1643],
      hardware: [
        { id: "Q", qty: 4 },
        { id: "Z", qty: 4 },
        { id: "R", qty: 4 },
      ],
      parts: [28, 29, 30, 31, 32],
    },
    {
      id: "crib-13",
      label: "Step 13",
      title: "Assemble the crib drawer",
      summary: [
        "Same idea, bigger drawer: attach the Crib Drawer Sides (23 left, 24 right) and the center Division (25) to the long curved Drawer Front (22) with the short R screws.",
        "Slide both Drawer Bottoms (26 ×2) into their grooves — one each side of the division — then fasten the Drawer Back (27) across the top with the long Q screws into plastic barrel nuts (Z).",
      ],
      image: "/crib/step-13.webp",
      imageSize: [1200, 1606],
      hardware: [
        { id: "Q", qty: 6 },
        { id: "Z", qty: 6 },
        { id: "R", qty: 6 },
      ],
      parts: [22, 23, 24, 25, 26, 27],
    },
    {
      id: "crib-14",
      label: "Step 14",
      title: "Roll in the drawers — done!",
      manualNote: "The manual labels this one “Step 16” — there is no Step 14 or 15. You didn't miss anything.",
      summary: [
        "Assemble the drawers into the crib base and changer by aligning the drawer rollers with the openings above the rollers on the frame — tilt, hook, and roll them home (see the roller inset).",
        "That's the build! Give every bolt a final firm tighten, set the mattress height for a newborn (highest), and admire your work.",
      ],
      image: "/crib/step-14.webp",
      imageSize: [1230, 1167],
      hardware: [],
      parts: [],
    },
  ],
};

export const TODDLER_SECTION: Section = {
  id: "toddler",
  title: "Convert to Toddler / Day Bed",
  subtitle: "For later — when your climber is at least 15 months (max 50 lbs).",
  steps: [
    {
      id: "toddler-1",
      label: "Step 1",
      title: "Remove the front rails",
      summary: [
        "Unbolt the Front Top Rail (18) and the Front Rail (9) — reverse of build Steps 9–10.",
        "Keep all the hardware; the crib stays otherwise fully assembled.",
      ],
      image: "/crib/toddler-1.webp",
      imageSize: [1211, 1337],
      hardware: [],
      parts: [9, 18],
    },
    {
      id: "toddler-2",
      label: "Step 2",
      title: "Cap the posts & secure the frame",
      summary: [
        "Where the front rail was removed, secure the frame using the joint connector nuts (L) with J and K bolts, the D bolt, and a crescent washer (I) — the inset shows the arrangement.",
        "Cap the front posts with the Toddler Bed Post Tops — 41 on the left, 42 on the right — using J bolts and dowels (N).",
      ],
      image: "/crib/toddler-2.webp",
      imageSize: [1290, 1655],
      hardware: [
        { id: "J", qty: 5 },
        { id: "K", qty: 4 },
        { id: "L", qty: 4 },
        { id: "D", qty: 1 },
        { id: "I", qty: 1 },
        { id: "N", qty: 2 },
      ],
      parts: [41, 42],
    },
    {
      id: "toddler-3",
      label: "Step 3",
      title: "Optional safety rail",
      summary: [
        "The universal toddler safety rail-slat is sold separately by Graco retailers; it mounts with three 1/4\" × 1-3/4\" bolts and can go on either side of the bed.",
      ],
      image: "/crib/toddler-3.webp",
      imageSize: [1226, 1687],
      hardware: [],
      parts: [],
      warning:
        "Toddler bed: child must be at least 15 months old and no more than 50 lbs. Use a full-size crib mattress. Keep the bed away from windows and cords.",
    },
  ],
};

export const FULLBED_SECTION: Section = {
  id: "fullbed",
  title: "Convert to a Full-Size Bed",
  subtitle: "Much later — needs a full-size metal bed frame (not included).",
  steps: [
    {
      id: "fullbed-1",
      label: "Step 1",
      title: "Disassemble the crib",
      summary: [
        "Take the crib apart (reverse of assembly), keeping the Back Rail (8) to become the headboard and the Front Rail (9) to become the footboard.",
        "The zoomed inset shows removing the long A bolts with their washers and barrel nuts at the slotted holes (×2).",
      ],
      image: "/crib/fullbed-1.webp",
      imageSize: [1317, 1693],
      hardware: [],
      parts: [8, 9],
    },
    {
      id: "fullbed-2",
      label: "Step 2",
      title: "Mount headboard & footboard",
      summary: [
        "Attach the headboard (8) and footboard (9) to a full-size metal bed frame: K bolts (×4) through the frame brackets per the inset, with the B and C bolts into barrel nuts (M) where shown.",
        "Bed frame is sold separately and styles vary — follow its instructions for the rest.",
      ],
      image: "/crib/fullbed-2.webp",
      imageSize: [1172, 1702],
      hardware: [
        { id: "K", qty: 4 },
        { id: "B", qty: 1 },
        { id: "C", qty: 1 },
        { id: "M", qty: 2 },
      ],
      parts: [8, 9],
    },
  ],
};

export const CONVERSION_SECTIONS: Section[] = [TODDLER_SECTION, FULLBED_SECTION];

export const SAFETY_GROUPS: { title: string; icon: string; items: string[] }[] = [
  {
    title: "Assembly",
    icon: "🔧",
    items: [
      "Adult assembly required — small parts are a choking hazard before assembly.",
      "Do NOT use power drills or drivers; hand tools only.",
      "Assemble on a soft surface to protect the finish. Clean only with water on a damp cloth.",
      "Tighten all bolts firmly after assembly and re-tighten periodically. Never use the crib with loose, damaged, or missing parts — contact Storkcraft for replacements, and never substitute parts.",
    ],
  },
  {
    title: "Mattress",
    icon: "🛏️",
    items: [
      "Use a mattress at least 27-1/4″ × 51-5/8″ (69 × 131 cm), between 4″ and 6″ thick.",
      "The gap between mattress and crib sides must not exceed 1-3/16″ (3 cm) when pushed to a corner — infants can suffocate in gaps.",
      "Highest support position for newborns; lowest once baby can pull up to standing. No water mattresses; never use plastic film as a mattress cover.",
    ],
  },
  {
    title: "Safe sleep",
    icon: "🌙",
    items: [
      "Never add pillows, comforters, or extra padding under an infant — soft bedding is a suffocation risk.",
      "Healthy infants sleep on their backs, unless your pediatrician says otherwise.",
      "Stop using the crib when your child can climb out or reaches 35″ (89 cm) tall.",
      "Remove bumper pads, large toys, and anything climbable once baby can stand.",
    ],
  },
  {
    title: "Strangulation hazards",
    icon: "⚠️",
    items: [
      "Never place the crib near windows — blind and drape cords can strangle a child.",
      "No strings around a child's neck (hood strings, pacifier cords) and never suspend strings over the crib or attach them to toys.",
    ],
  },
  {
    title: "Changing table",
    icon: "🧸",
    items: [
      "Max 30 lbs. Falls can happen quickly — stay within arm's reach of your child, always.",
      "The changing table is not for sleep. Never leave a child unattended in or on it.",
      "Use only the pad provided by the manufacturer.",
    ],
  },
];
