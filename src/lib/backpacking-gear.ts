// Seed gear list for the /backpacking-2026 trip page. Seeded into gear_items
// on migrate (ON CONFLICT DO NOTHING keyed by slug), and used as the read-only
// fallback when DATABASE_URL is unset.

export const TRIP_PEOPLE = ["Matt", "Liam"] as const;
export type TripPerson = (typeof TRIP_PEOPLE)[number];

export type GearCategory =
  | "shelter"
  | "sleep"
  | "kitchen"
  | "water"
  | "clothing"
  | "safety"
  | "personal";

export const GEAR_CATEGORIES: { id: GearCategory; label: string; emoji: string; blurb?: string }[] = [
  { id: "shelter", label: "Shelter", emoji: "⛺" },
  { id: "sleep", label: "Sleep", emoji: "🛌" },
  { id: "kitchen", label: "Kitchen & Food", emoji: "🍳", blurb: "Everything smellable has to fit in the ONE bear can — repackage everything, no boxes, no glass." },
  { id: "water", label: "Water", emoji: "💧" },
  { id: "clothing", label: "Clothing", emoji: "🧥", blurb: "Everyone packs their own. No cotton — it stays wet and cold." },
  { id: "safety", label: "Safety & Navigation", emoji: "🧭" },
  { id: "personal", label: "Packs & Personal", emoji: "🎒" },
];

export type GearSeed = {
  slug: string;
  name: string;
  category: GearCategory;
  qty?: string;
  notes?: string;
  claimedBy?: string; // comma-separated names; pre-claimed = Matt already owns it
  sort: number;
};

export const DEFAULT_GEAR: GearSeed[] = [
  // Shelter
  { slug: "tent-4p", name: "4-person tent", category: "shelter", claimedBy: "Matt", notes: "Roomier for sharing — see the tent vote", sort: 10 },
  { slug: "tent-2p", name: "2-person tent", category: "shelter", claimedBy: "Matt", notes: "Only comes if the vote says both tents", sort: 20 },
  { slug: "groundsheet", name: "Groundsheet / cheap tarp", category: "shelter", notes: "Under the tent floor; also rain cover for packs at camp", sort: 30 },

  // Sleep
  { slug: "sleeping-bags", name: "Sleeping bags", category: "sleep", qty: "2", claimedBy: "Matt", notes: "Matt has two — covers both of us", sort: 10 },
  { slug: "sleeping-pads", name: "Sleeping pads", category: "sleep", qty: "1 each", notes: "NOT on Matt's list yet — the ground is cold even in August. Foam or inflatable, one per person", sort: 30 },
  { slug: "pillow", name: "Pillow (optional)", category: "sleep", notes: "Or just stuff clothes in a stuff sack", sort: 40 },

  // Kitchen & food
  { slug: "stove", name: "Stove", category: "kitchen", claimedBy: "Matt", sort: 10 },
  { slug: "fuel", name: "Butane fuel", category: "kitchen", claimedBy: "Matt", notes: "Bring a spare canister — cold mornings burn more", sort: 20 },
  { slug: "pot", name: "Pot", category: "kitchen", claimedBy: "Matt", sort: 30 },
  { slug: "lighter", name: "Lighter + backup matches", category: "kitchen", claimedBy: "Matt", notes: "Matches in a ziplock as backup", sort: 40 },
  { slug: "meals", name: "Peak Refuel freeze-dried meals", category: "kitchen", claimedBy: "Matt", notes: "Sat dinner + Sun breakfast, just add hot water", sort: 50 },
  { slug: "eggs", name: "Hardboiled eggs", category: "kitchen", claimedBy: "Matt", notes: "Sat lunch — eat them first, they hog bear-can space (and we only have one can)", sort: 60 },
  { slug: "snacks", name: "Trail snacks", category: "kitchen", qty: "each", notes: "Bars, trail mix, jerky — dense stuff that packs small. Out of the wrappers-in-a-box format before it goes in the can", sort: 70 },
  { slug: "breakfast-extras", name: "Big-breakfast extras", category: "kitchen", notes: "Oatmeal/granola + instant coffee for Sunday", sort: 80 },
  { slug: "sporks", name: "Sporks / spoons", category: "kitchen", qty: "1 each", sort: 90 },
  { slug: "mugs", name: "Mug or bowl (optional)", category: "kitchen", notes: "Peak Refuel eats fine from the pouch", sort: 100 },
  { slug: "bear-can-1", name: "Bear canister (the only one)", category: "kitchen", claimedBy: "Matt", notes: "Required in the Eastern High Peaks — ALL food, trash + toiletries go in. Two people, two days, ONE can: everything gets repackaged out of its box and the eggs get eaten first", sort: 110 },
  { slug: "trash-bags", name: "Ziplocks / trash bag", category: "kitchen", notes: "Pack out everything, wrappers included", sort: 130 },

  // Water
  { slug: "pump-filter", name: "Pump water filter", category: "water", claimedBy: "Matt", notes: "Primary treatment", sort: 10 },
  { slug: "uv-sterilizer", name: "UV sterilizer", category: "water", claimedBy: "Matt", notes: "Backup #1", sort: 20 },
  { slug: "iodine", name: "Iodine tablets", category: "water", claimedBy: "Matt", notes: "Backup #2 — nearly weightless, always in the med kit", sort: 30 },
  { slug: "bladders", name: "3L bladders", category: "water", qty: "2", claimedBy: "Matt", sort: 40 },
  { slug: "bottles", name: "Spare bottle", category: "water", qty: "1 each", notes: "A Smartwater bottle each is handy for mixing electrolytes", sort: 50 },
  { slug: "electrolytes", name: "Electrolytes", category: "water", claimedBy: "Matt", notes: "IQMIX packets (easier than the Zerolyte ziplock)", sort: 60 },

  // Clothing (everyone)
  { slug: "rain-jacket", name: "Rain jacket", category: "clothing", qty: "each", notes: "Non-negotiable — mountain weather turns fast", sort: 10 },
  { slug: "warm-layer", name: "Warm layer (puffy / fleece)", category: "clothing", qty: "each", notes: "40s°F at night by the lakes, colder on summits", sort: 20 },
  { slug: "hiking-clothes", name: "Synthetic hiking clothes", category: "clothing", qty: "each", notes: "Shirt + shorts/pants you can also run in", sort: 30 },
  { slug: "socks", name: "Extra socks", category: "clothing", qty: "2 pairs each", notes: "Wool. Dry socks at camp = happiness", sort: 40 },
  { slug: "hat-gloves", name: "Beanie + light gloves (optional)", category: "clothing", notes: "Small, worth it if we summit early", sort: 50 },
  { slug: "camp-shoes", name: "Camp shoes (optional)", category: "clothing", notes: "Crocs/sandals for around camp + water crossings", sort: 60 },

  // Safety & navigation
  { slug: "headlamps", name: "Headlamps", category: "safety", claimedBy: "Matt", notes: "Fresh batteries; one per person", sort: 10 },
  { slug: "med-kit", name: "First aid kit", category: "safety", claimedBy: "Matt", notes: "Add blister care (moleskin/leukotape) if it's not in there", sort: 20 },
  { slug: "paper-maps", name: "Paper maps", category: "safety", claimedBy: "Matt", sort: 30 },
  { slug: "battery", name: "External battery", category: "safety", claimedBy: "Matt", notes: "Phones on airplane mode; no signal in the interior", sort: 40 },
  { slug: "offline-maps", name: "Offline maps downloaded", category: "safety", qty: "each", notes: "Download the High Peaks area in AllTrails/Gaia before leaving wifi", sort: 50 },
  { slug: "whistle", name: "Whistle", category: "safety", qty: "each", notes: "Often built into pack sternum straps — check", sort: 60 },
  { slug: "knife", name: "Knife / multitool", category: "safety", sort: 70 },
  { slug: "repair", name: "Duct tape + repair bits", category: "safety", notes: "Wrap tape around a trekking pole or bottle", sort: 80 },
  { slug: "space-blanket", name: "Emergency space blanket", category: "safety", sort: 90 },
  { slug: "bug-spray", name: "Bug spray (+ head net?)", category: "safety", notes: "August is better than June but bring DEET", sort: 100 },
  { slug: "sunscreen", name: "Sunscreen", category: "safety", notes: "Summits are open rock", sort: 110 },

  // Packs & personal
  { slug: "pack-matt", name: "Overnight pack (Matt)", category: "personal", claimedBy: "Matt", sort: 10 },
  { slug: "pack-liam", name: "Pack for Liam", category: "personal", notes: "Own overnight pack, or borrow one of Matt's — tell Matt which", sort: 20 },
  { slug: "pack-liners", name: "Pack liners / trash bags", category: "personal", qty: "each", notes: "Line the pack — nothing worse than a wet sleeping bag", sort: 40 },
  { slug: "trowel-tp", name: "TP + hand sanitizer (+ trowel)", category: "personal", notes: "Privies at the designated sites; TP in a ziplock as backup", sort: 50 },
  { slug: "toothbrush", name: "Toothbrush + travel paste", category: "personal", qty: "each", notes: "Toothpaste sleeps in the bear can", sort: 60 },
  { slug: "trekking-poles", name: "Trekking poles (optional)", category: "personal", notes: "Big help on the Calamity Brook crossings and the steep descents", sort: 70 },
  ];
