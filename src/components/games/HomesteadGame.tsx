"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ============================================================
// TYPES
// ============================================================

type Season = "spring" | "summer" | "fall";
type Phase = "morning" | "afternoon" | "evening";
type Screen =
  | "title"
  | "dawn"
  | "phase"
  | "result"
  | "shop"
  | "build"
  | "plant"
  | "night"
  | "celebration"
  | "score";
type AnimalType =
  | "chicken"
  | "duck"
  | "goose"
  | "cat"
  | "dog"
  | "donkey"
  | "goat"
  | "sheep"
  | "cow"
  | "pig";
type CropType =
  | "lettuce"
  | "peas"
  | "strawberry"
  | "herbs"
  | "tomato"
  | "corn"
  | "squash"
  | "beans"
  | "pumpkin"
  | "carrot"
  | "apple"
  | "potato";
type BuildingType =
  | "coop"
  | "barn"
  | "garden"
  | "cellar"
  | "stand"
  | "greenhouse"
  | "pavilion";

interface Animal {
  type: AnimalType;
  name: string;
}
interface Crop {
  type: CropType;
  daysGrown: number;
}
interface Choice {
  id: string;
  emoji: string;
  text: string;
  subtext?: string;
  disabled?: boolean;
}

interface GameState {
  screen: Screen;
  day: number;
  season: Season;
  phase: Phase;
  grit: number;
  wisdom: number;
  charm: number;
  gold: number;
  wood: number;
  animals: Animal[];
  crops: Crop[];
  buildings: BuildingType[];
  inventory: Record<string, number>;
  cropsHarvested: number;
  gardenPlots: number;
  usedEvents: string[];
  celebrationQuality: number;
  narrative: string;
  choices: Choice[];
  resultText: string;
}

// ============================================================
// GAME DATA
// ============================================================

const ANIMAL_DATA: Record<
  AnimalType,
  {
    emoji: string;
    label: string;
    cost: number;
    product: string;
    productValue: number;
    scoreValue: number;
  }
> = {
  chicken: { emoji: "🐔", label: "Chicken", cost: 25, product: "egg", productValue: 8, scoreValue: 15 },
  duck: { emoji: "🦆", label: "Duck", cost: 35, product: "duck egg", productValue: 12, scoreValue: 20 },
  goose: { emoji: "🪿", label: "Goose", cost: 45, product: "goose egg", productValue: 15, scoreValue: 25 },
  cat: { emoji: "🐱", label: "Barn Cat", cost: 10, product: "", productValue: 0, scoreValue: 10 },
  dog: { emoji: "🐕", label: "Guardian Dog", cost: 60, product: "", productValue: 0, scoreValue: 30 },
  donkey: { emoji: "🫏", label: "Donkey", cost: 80, product: "", productValue: 0, scoreValue: 35 },
  goat: { emoji: "🐐", label: "Goat", cost: 50, product: "goat milk", productValue: 10, scoreValue: 30 },
  sheep: { emoji: "🐑", label: "Sheep", cost: 55, product: "wool", productValue: 15, scoreValue: 30 },
  cow: { emoji: "🐄", label: "Cow", cost: 120, product: "milk", productValue: 20, scoreValue: 50 },
  pig: { emoji: "🐖", label: "Pig", cost: 70, product: "truffle", productValue: 25, scoreValue: 40 },
};

const CROP_DATA: Record<
  CropType,
  {
    emoji: string;
    label: string;
    cost: number;
    growDays: number;
    sellPrice: number;
    seasons: Season[];
  }
> = {
  lettuce: { emoji: "🥬", label: "Lettuce", cost: 5, growDays: 2, sellPrice: 12, seasons: ["spring"] },
  peas: { emoji: "🫛", label: "Peas", cost: 8, growDays: 3, sellPrice: 18, seasons: ["spring"] },
  strawberry: { emoji: "🍓", label: "Strawberry", cost: 12, growDays: 4, sellPrice: 25, seasons: ["spring"] },
  herbs: { emoji: "🌿", label: "Herbs", cost: 6, growDays: 2, sellPrice: 15, seasons: ["spring", "summer"] },
  tomato: { emoji: "🍅", label: "Tomato", cost: 10, growDays: 3, sellPrice: 20, seasons: ["summer"] },
  corn: { emoji: "🌽", label: "Corn", cost: 8, growDays: 4, sellPrice: 22, seasons: ["summer"] },
  squash: { emoji: "🟡", label: "Squash", cost: 10, growDays: 3, sellPrice: 18, seasons: ["summer"] },
  beans: { emoji: "🫘", label: "Beans", cost: 6, growDays: 2, sellPrice: 14, seasons: ["summer"] },
  pumpkin: { emoji: "🎃", label: "Pumpkin", cost: 15, growDays: 5, sellPrice: 35, seasons: ["fall"] },
  carrot: { emoji: "🥕", label: "Carrot", cost: 8, growDays: 3, sellPrice: 16, seasons: ["fall"] },
  apple: { emoji: "🍎", label: "Apple", cost: 20, growDays: 5, sellPrice: 30, seasons: ["fall"] },
  potato: { emoji: "🥔", label: "Potato", cost: 7, growDays: 3, sellPrice: 15, seasons: ["fall", "spring"] },
};

const BUILDING_DATA: Record<
  BuildingType,
  {
    emoji: string;
    label: string;
    goldCost: number;
    woodCost: number;
    desc: string;
    scoreValue: number;
  }
> = {
  coop: { emoji: "🏚️", label: "Chicken Coop", goldCost: 40, woodCost: 5, desc: "House poultry (up to 6)", scoreValue: 30 },
  barn: { emoji: "🏗️", label: "Barn", goldCost: 80, woodCost: 8, desc: "House large animals (up to 4)", scoreValue: 60 },
  garden: { emoji: "🌱", label: "Raised Beds", goldCost: 25, woodCost: 3, desc: "+4 garden plots", scoreValue: 35 },
  cellar: { emoji: "🏺", label: "Root Cellar", goldCost: 50, woodCost: 5, desc: "Age goods for +50% value", scoreValue: 40 },
  stand: { emoji: "🏪", label: "Farm Stand", goldCost: 60, woodCost: 6, desc: "Sell goods for +50% value", scoreValue: 50 },
  greenhouse: { emoji: "🏡", label: "Greenhouse", goldCost: 100, woodCost: 8, desc: "Grow any crop any season", scoreValue: 70 },
  pavilion: { emoji: "🎪", label: "Party Pavilion", goldCost: 120, woodCost: 12, desc: "Host the ultimate celebration!", scoreValue: 100 },
};

const ANIMAL_NAMES: Record<AnimalType, string[]> = {
  chicken: ["Henrietta", "Cluck Norris", "Eggatha", "Nugget", "Drumstick", "Lady Cluckington"],
  duck: ["Quackers", "Sir Waddles", "Daffy", "Puddles", "Captain Quack", "Billiam"],
  goose: ["Honks", "Goose Wayne", "The Enforcer", "Sergeant Hiss", "Lady Goose"],
  cat: ["Bruce", "Shadow", "Midnight", "Whiskers"],
  dog: ["Bella", "Scout", "Ranger", "Hero"],
  donkey: ["Eeyore", "Dusty", "Biscuit", "Patches"],
  goat: ["Billy", "Nanny", "Buttercup", "Sir Chomps-a-Lot"],
  sheep: ["Woolsworth", "Baa-rbara", "Fleece Lightning", "Cotton"],
  cow: ["Bessie", "Daisy", "Buttercup II", "Moonica"],
  pig: ["Wilbur", "Truffle", "Hamlet", "Porkchop"],
};

// ============================================================
// HELPERS
// ============================================================

function getSeason(day: number): Season {
  if (day <= 5) return "spring";
  if (day <= 10) return "summer";
  return "fall";
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getAnimalName(type: AnimalType, existing: Animal[]): string {
  const used = new Set(existing.filter((a) => a.type === type).map((a) => a.name));
  const available = ANIMAL_NAMES[type].filter((n) => !used.has(n));
  return available[0] || `${ANIMAL_DATA[type].label} #${used.size + 1}`;
}

function countPoultry(animals: Animal[]): number {
  return animals.filter((a) => ["chicken", "duck", "goose"].includes(a.type)).length;
}

function countLarge(animals: Animal[]): number {
  return animals.filter((a) => ["cow", "goat", "sheep", "pig", "donkey"].includes(a.type)).length;
}

function invValue(state: GameState): number {
  const mult = state.buildings.includes("stand") ? 1.5 : 1;
  let total = 0;
  const prices: Record<string, number> = {
    egg: 8, "duck egg": 12, "goose egg": 15, "goat milk": 10,
    milk: 20, wool: 15, truffle: 25, cheese: 35, jam: 30,
    berries: 6, mushrooms: 8, wildflowers: 5,
  };
  for (const [item, count] of Object.entries(state.inventory)) {
    const cropMatch = Object.values(CROP_DATA).find((c) => c.label.toLowerCase() === item);
    if (cropMatch) total += cropMatch.sellPrice * count;
    else total += (prices[item] || 5) * count;
  }
  return Math.floor(total * mult);
}

function invCount(inv: Record<string, number>): number {
  return Object.values(inv).reduce((s, n) => s + n, 0);
}

function addInv(inv: Record<string, number>, item: string, n = 1): Record<string, number> {
  return { ...inv, [item]: (inv[item] || 0) + n };
}

const INITIAL_STATE: GameState = {
  screen: "title",
  day: 1,
  season: "spring",
  phase: "morning",
  grit: 3,
  wisdom: 3,
  charm: 3,
  gold: 50,
  wood: 0,
  animals: [],
  crops: [],
  buildings: [],
  inventory: {},
  cropsHarvested: 0,
  gardenPlots: 4,
  usedEvents: [],
  celebrationQuality: 0,
  narrative: "",
  choices: [],
  resultText: "",
};

// ============================================================
// NARRATIVE TEMPLATES
// ============================================================

const DAWN_TEXTS: ((s: GameState) => string)[] = [
  (s) => {
    const lines = [`Day ${s.day} \u2014 ${cap(s.season)}`];
    const prevSeason = getSeason(s.day - 1);
    if (s.season !== prevSeason) {
      const msgs: Record<Season, string> = {
        spring: "The air smells like fresh earth and possibility. Wildflowers are blooming.",
        summer: "Summer has arrived. The days are long and golden, the air thick with the hum of bees.",
        fall: "The leaves are turning amber and crimson. Harvest season is here at last.",
      };
      lines.push(msgs[s.season]);
    }
    // Overnight events
    const events: string[] = [];
    const readyCrops = s.crops.filter((c) => c.daysGrown >= CROP_DATA[c.type].growDays);
    if (readyCrops.length > 0) {
      events.push(`${readyCrops.map((c) => CROP_DATA[c.type].emoji + " " + CROP_DATA[c.type].label).join(", ")} ready to harvest!`);
    }
    const products: string[] = [];
    for (const a of s.animals) {
      const d = ANIMAL_DATA[a.type];
      if (d.product && d.productValue > 0) products.push(d.product);
    }
    if (products.length > 0) {
      const unique = Array.from(new Set(products));
      events.push(`Collected: ${unique.join(", ")}`);
    }
    if (events.length > 0) lines.push("\nOvernight: " + events.join(". ") + ".");
    lines.push(`\nYou have ${s.gold}g, ${s.wood} wood, ${s.animals.length} animal${s.animals.length !== 1 ? "s" : ""}, and ${s.crops.length} growing crop${s.crops.length !== 1 ? "s" : ""}.`);
    return lines.join("\n");
  },
];

type NarrativePool = ((s: GameState) => string)[];

const MORNING_NARRATIVES: Record<Season, NarrativePool> = {
  spring: [
    (s) => `Morning dew sparkles across the meadow. ${s.animals.length > 0 ? `Your ${s.animals.map((a) => a.name).slice(0, 3).join(", ")} ${s.animals.length > 1 ? "are" : "is"} already making noise.` : "The farm is still quiet, waiting for life."} ${s.crops.length > 0 ? "Tiny green shoots peek up from the garden." : "The garden plot sits empty, full of potential."}`,
    (s) => `Birdsong fills the spring air. ${s.animals.some((a) => a.type === "chicken") ? "The chickens are having their morning meeting near the fence — lots of important clucking." : "A robin hops across the yard, eyeing the turned earth."} It's going to be a beautiful day.`,
    (s) => `You step onto the porch and breathe in the crisp morning. The hills are impossibly green. ${s.wood > 8 ? "Your firewood pile is looking impressive." : ""} ${s.crops.length > 3 ? "The garden is really coming along!" : "There's so much to do — where to start?"}`,
  ],
  summer: [
    (s) => `The summer sun is already warm at dawn. ${s.animals.some((a) => a.type === "goat") ? "The goats are standing on top of something they definitely shouldn't be standing on." : ""} ${s.crops.length > 0 ? "The garden is lush and buzzing with life." : "The unplanted garden bakes in the heat."}`,
    (s) => `Cicadas hum in the trees. It's the kind of summer morning that makes you glad to be alive and have a hat. ${s.animals.length > 4 ? "The farm is getting lively — animals everywhere you look." : ""}`,
    (s) => `A warm breeze carries the scent of ${s.crops.some((c) => c.type === "herbs") ? "fresh herbs" : "wildflowers"} across the farm. ${s.animals.some((a) => a.type === "duck") ? "The ducks are already splashing in the water trough." : "Another beautiful day on the homestead."}`,
  ],
  fall: [
    (s) => `Crisp fall air nips at your nose. The trees are blazing with color — amber, crimson, gold. ${s.crops.some((c) => c.type === "pumpkin") ? "The pumpkin patch is looking magnificent." : ""} ${s.animals.length > 0 ? "The animals seem extra cozy this morning." : ""}`,
    (s) => `Mist clings to the fields like a quilt. ${s.animals.some((a) => a.type === "cow") ? "Bessie's breath puffs white in the cool air." : "The morning is still and peaceful."} Fall is harvest time — every day counts.`,
    (s) => `Leaves crunch underfoot as you start your morning rounds. ${s.buildings.includes("pavilion") ? "The party pavilion gleams in the morning light. Almost time." : "The celebration is approaching — better make every day count."}`,
  ],
};

const AFTERNOON_NARRATIVES: Record<Season, NarrativePool> = {
  spring: [
    (s) => `The afternoon sun warms the old farmhouse. ${s.gold > 100 ? "Your pockets are feeling heavy — maybe time to invest?" : "The general store in town beckons."} You can hear ${s.animals.some((a) => a.type === "chicken") ? "chickens squabbling over a bug" : "birds in the distant treeline"}.`,
    (s) => `Spring breeze ruffles the wildflowers. The town is a short walk down the road — ${s.buildings.length < 2 ? "you could use some supplies" : "there's always something interesting happening"}.`,
  ],
  summer: [
    (s) => `The July heat shimmers off the fields. ${s.animals.some((a) => a.type === "goat") ? "The goats have claimed the only shady spot, forming a furry pyramid." : "Even the birds are taking an afternoon nap."} What to do with the rest of the day?`,
    (s) => `Summer afternoon stretches out lazy and warm. ${s.crops.some((c) => c.daysGrown >= CROP_DATA[c.type].growDays) ? "Some crops look ready for picking!" : "The garden hums with growth."} The town market should be busy today.`,
  ],
  fall: [
    (s) => `Golden light slants through the trees. ${s.cropsHarvested > 5 ? "It's been a good harvest season so far." : "Time is running short — the celebration is coming."} The air smells like woodsmoke and ripe apples.`,
    (s) => `An afternoon breeze sends leaves swirling across the yard. ${s.buildings.length > 3 ? "Your homestead is really starting to look like something special." : "There's still so much to build."} Neighbors wave from down the road.`,
  ],
};

const EVENING_NARRATIVES: Record<Season, NarrativePool> = {
  spring: [
    (s) => `The sky turns pink and gold as the sun dips behind the hills. Fireflies are just starting to blink awake. ${s.animals.some((a) => a.type === "cat") ? "Bruce claims his spot on the porch railing, surveying his kingdom." : "The farm settles into evening quiet."} One more thing before bed...`,
    (s) => `Spring peepers sing from the pond. The stars are coming out one by one. ${s.charm > 15 ? "You've made some good friends around here." : "The neighboring farms glow warmly in the twilight."}`,
  ],
  summer: [
    (s) => `Lightning bugs dance across the meadow like tiny lanterns. The heat finally breaks and a cool breeze sighs through the farm. ${s.animals.some((a) => a.type === "dog") ? "Your guardian dog does one last perimeter check before settling in." : "Crickets take up their nightly symphony."}`,
    (s) => `The summer sunset paints everything in amber and rose. ${s.animals.length > 5 ? "Your menagerie settles in for the night — quite a crowd now." : "The farm feels peaceful."} What a day.`,
  ],
  fall: [
    (s) => `Amber light filters through the maples as another fall day winds down. The air smells like woodsmoke and ripe apples. ${s.animals.some((a) => a.type === "cat") ? "Bruce the barn cat watches from the rafters, judging everyone." : "Stars emerge in the darkening sky."}`,
    (s) => `The harvest moon rises huge and orange over the treeline. ${s.day >= 13 ? "The celebration is almost here. You can feel the excitement building." : "Fall evenings are magic."} One more thing before you call it a night.`,
  ],
};

// ============================================================
// SCRIPTED STORY BEATS
// ============================================================

function getScriptedScenario(state: GameState): { narrative: string; choices: Choice[] } | null {
  const { day, phase } = state;

  // Day 1 Morning: Arrival
  if (day === 1 && phase === "morning") {
    return {
      narrative:
        "You stand at the edge of an overgrown field, keys jangling in your pocket. This is it — your 10 acres of wild possibility. A weathered farmhouse sits at the center, porch sagging slightly but welcoming. Somewhere in the tall grass, something clucks.\n\nA note tacked to the front door reads:\n\"Welcome! The chickens are around here somewhere. Good luck. — Previous Owner\"",
      choices: [
        { id: "day1_chickens", emoji: "🐔", text: "Find those chickens", subtext: "+3 chickens" },
        { id: "day1_house", emoji: "🏠", text: "Explore the farmhouse", subtext: "+10g, +1 wisdom" },
        { id: "day1_garden", emoji: "🌱", text: "Clear the garden plot", subtext: "+2 grit" },
        { id: "day1_porch", emoji: "☕", text: "Take it all in from the porch", subtext: "+1 charm" },
      ],
    };
  }

  // Day 1 Afternoon
  if (day === 1 && phase === "afternoon") {
    return {
      narrative: `The afternoon sun warms the old farmhouse. ${state.animals.length > 0 ? "Your newly-found chickens are pecking contentedly in the yard." : ""} Down the road, a small town with a \"OPEN (mostly)\" sign on the general store.`,
      choices: [
        { id: "day1_town", emoji: "🏪", text: "Walk to town and meet the neighbors", subtext: "+1 charm, meet Old Mae" },
        { id: "day1_chop", emoji: "🪓", text: "Chop firewood from the dead oak", subtext: "+3 wood, +2 grit" },
        { id: "day1_explore", emoji: "🌲", text: "Explore the woods out back", subtext: "+items, +1 wisdom" },
      ],
    };
  }

  // Day 1 Evening
  if (day === 1 && phase === "evening") {
    return {
      narrative: "Your first evening on the homestead. The sky is streaked with pink and gold, and fireflies drift across the meadow like tiny lanterns. The farmhouse creaks comfortably around you. It doesn't feel like home yet — but it could.",
      choices: [
        { id: "day1_plan", emoji: "📝", text: "Plan tomorrow over a cup of tea", subtext: "+1 wisdom, preview tomorrow" },
        { id: "day1_fire", emoji: "🔥", text: "Build a campfire and watch the stars", subtext: "+1 charm" },
        { id: "day1_sleep", emoji: "😴", text: "Turn in early — big days ahead", subtext: "Bonus energy" },
      ],
    };
  }

  // Day 4: Kids visit
  if (day === 4 && phase === "morning" && !state.usedEvents.includes("kids_visit")) {
    return {
      narrative:
        "You hear excited voices coming up the drive. It's the kids! Emmett (11) charges ahead with boundless energy, already eyeing the woodpile. Sapphire (8) trails behind, pockets bulging with craft supplies and a hand-drawn map of where she thinks \"the fairies live.\"\n\n\"Can we help?!\" they chorus.",
      choices: [
        { id: "kids_emmett_wood", emoji: "🪓", text: "Put Emmett on firewood duty", subtext: "+4 wood, +1 grit" },
        { id: "kids_sapphire_names", emoji: "✨", text: "Let Sapphire name the animals", subtext: "+2 charm, pure joy" },
        { id: "kids_garden", emoji: "🌱", text: "Garden time — all hands on deck", subtext: "Crops +2 growth" },
        { id: "kids_adventure", emoji: "🗺️", text: "Follow Sapphire's fairy map", subtext: "+1 wisdom, +1 charm, surprise!" },
      ],
    };
  }

  // Day 5 Evening: Spring farewell
  if (day === 5 && phase === "evening") {
    return {
      narrative: "The last evening of spring. Tomorrow, summer begins. The air is warm and smells like fresh-cut grass and possibility. A few neighbors have gathered at the end of the lane for an impromptu spring send-off — someone brought a fiddle.",
      choices: [
        { id: "spring_dance", emoji: "🎵", text: "Join the dancing", subtext: "+3 charm" },
        { id: "spring_sell", emoji: "💰", text: "Set up a farm stand and sell spring harvest", subtext: "Sell all inventory" },
        { id: "spring_rest", emoji: "🌙", text: "Watch the fireflies and dream of summer", subtext: "+1 wisdom, +1 charm" },
      ],
    };
  }

  // Day 7: Stray animal
  if (day === 7 && phase === "morning" && !state.usedEvents.includes("stray_animal")) {
    const hasCat = state.animals.some((a) => a.type === "cat");
    const hasDog = state.animals.some((a) => a.type === "dog");
    return {
      narrative: `You find a visitor on your porch this morning. ${!hasCat ? "A scruffy black cat with wise green eyes is sitting on the railing like he owns the place. He looks at you with an expression that says \"I live here now.\"" : !hasDog ? "A medium-sized mutt with soulful brown eyes is curled up by the door. Her tail thumps hopefully when she sees you." : "Two animals have appeared — a scruffy cat on the railing and a hopeful-looking dog by the door. The cat looks like he's in charge."}`,
      choices: [
        ...(!hasCat
          ? [{ id: "stray_cat", emoji: "🐱", text: "Welcome the barn cat (you name him Bruce)", subtext: "+barn cat, mouse control" }]
          : []),
        ...(!hasDog
          ? [{ id: "stray_dog", emoji: "🐕", text: "Take in the guardian dog", subtext: "+guardian dog, predator protection" }]
          : []),
        ...(!hasCat && !hasDog
          ? [{ id: "stray_both", emoji: "❤️", text: "Take them both in!", subtext: "+cat +dog, -15g for supplies" }]
          : []),
        { id: "stray_none", emoji: "👋", text: "Shoo them away (they'll be fine... right?)", subtext: "They look sad" },
      ],
    };
  }

  // Day 10 Evening: Midsummer festival
  if (day === 10 && phase === "evening") {
    return {
      narrative: "It's the Midsummer Night Festival! Fairy lights are strung between the trees in town, and the whole community has come out. There's music, dancing, and someone has set up an arm-wrestling station. The smell of fresh pie drifts through the warm air.",
      choices: [
        { id: "mid_dance", emoji: "💃", text: "Dance the night away", subtext: "+3 charm" },
        { id: "mid_wrestle", emoji: "💪", text: "Enter the arm-wrestling contest", subtext: "+2 grit, +1 charm if you win" },
        { id: "mid_pie", emoji: "🥧", text: "Enter the pie contest (use your best crops)", subtext: "+2 wisdom, +1 charm" },
        { id: "mid_socialize", emoji: "🤝", text: "Work the crowd and make connections", subtext: "+4 charm" },
      ],
    };
  }

  // Day 13: Zoe's adventure
  if (day === 13 && phase === "afternoon" && !state.usedEvents.includes("zoe_adventure")) {
    return {
      narrative:
        "Chaos erupts! Zoe — the small black dog with the grey muzzle, self-proclaimed \"couch commander\" — has somehow gotten loose and is doing zoomies through the entire farm. She's already knocked over the water trough, startled the chickens into temporary flight, and is now heading straight for the garden at approximately 900 mph.",
      choices: [
        { id: "zoe_chase", emoji: "🏃", text: "Sprint after her!", subtext: "+2 grit, hilarious" },
        { id: "zoe_treats", emoji: "🦴", text: "Shake the treat bag — works every time", subtext: "+1 wisdom, she leads you somewhere" },
        { id: "zoe_let_run", emoji: "😂", text: "Just... let her run it out", subtext: "+1 charm, she befriends every animal" },
      ],
    };
  }

  // Day 15 Evening: The Celebration
  if (day === 15 && phase === "evening") {
    return getCelebrationScenario(state);
  }

  return null;
}

// ============================================================
// RANDOM EVENTS
// ============================================================

interface RandomEvent {
  id: string;
  condition: (s: GameState) => boolean;
  generate: (s: GameState) => { narrative: string; choices: Choice[] };
}

const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: "fox_attack",
    condition: (s) => countPoultry(s.animals) > 0 && s.day > 2,
    generate: (s) => {
      const hasDog = s.animals.some((a) => a.type === "dog");
      return {
        narrative: hasDog
          ? `You're jolted awake by barking. Your guardian dog is racing toward the coop, where a fox is slinking away from the fence. ${s.animals.find((a) => a.type === "dog")?.name} chases it off with authority. Good dog.`
          : "You find suspicious paw prints near the coop this morning, and your birds are huddled together looking deeply offended. A fox has been visiting.",
        choices: hasDog
          ? [
              { id: "fox_praise", emoji: "🐕", text: `Give ${s.animals.find((a) => a.type === "dog")?.name} extra treats`, subtext: "+1 charm" },
              { id: "fox_fence", emoji: "🔨", text: "Reinforce the fence anyway", subtext: "-2 wood, +1 grit" },
            ]
          : [
              { id: "fox_fence", emoji: "🔨", text: "Build better fencing", subtext: "-3 wood, +1 grit" },
              { id: "fox_guard", emoji: "🕯️", text: "Set up lanterns to scare it off", subtext: "-5g, temporary fix" },
              { id: "fox_lose", emoji: "😢", text: "Too late — you've lost a chicken", subtext: "Lose 1 poultry" },
            ],
      };
    },
  },
  {
    id: "goat_escape",
    condition: (s) => s.animals.some((a) => a.type === "goat"),
    generate: (s) => {
      const goat = s.animals.find((a) => a.type === "goat")!;
      return {
        narrative: `${goat.name} has escaped. Again. You find the goat standing on the roof of the chicken coop, eating the wildflowers from the window box with an expression of pure bliss and zero remorse.`,
        choices: [
          { id: "goat_lure", emoji: "🍎", text: "Lure them down with an apple", subtext: "+1 wisdom" },
          { id: "goat_climb", emoji: "🧗", text: "Climb up and carry them down", subtext: "+2 grit" },
          { id: "goat_wait", emoji: "😤", text: "Wait. They'll come down. Eventually.", subtext: "+1 charm (patience is charming)" },
        ],
      };
    },
  },
  {
    id: "storm_coming",
    condition: (s) => s.crops.length > 0 && s.day > 3,
    generate: (s) => ({
      narrative: `Dark clouds are piling up on the horizon. ${s.wisdom > 15 ? "Your farming almanac predicted this — you saw the signs yesterday." : "This doesn't look good."} A storm is coming, and your crops are exposed.`,
      choices: [
        { id: "storm_cover", emoji: "🛡️", text: "Rush to cover the garden", subtext: s.wisdom > 15 ? "Easy! +1 grit" : "-1 energy, +1 grit" },
        { id: "storm_pray", emoji: "🙏", text: "Hope for the best", subtext: "50/50: crops survive or take damage" },
        ...(s.buildings.includes("greenhouse") ? [{ id: "storm_greenhouse", emoji: "🏡", text: "Move what you can to the greenhouse", subtext: "Save all crops!" }] : []),
      ],
    }),
  },
  {
    id: "market_day",
    condition: (s) => invCount(s.inventory) > 0 && s.phase === "afternoon",
    generate: (s) => ({
      narrative: `A horse-drawn cart rattles up the lane. \"Market day!\" hollers the driver. \"Double prices on everything today!\" Your inventory is worth about ${invValue(s) * 2}g at these prices.`,
      choices: [
        { id: "market_sell_all", emoji: "💰", text: "Sell everything!", subtext: `+${invValue(s) * 2}g` },
        { id: "market_sell_half", emoji: "🤔", text: "Sell half, keep the good stuff", subtext: `+${Math.floor(invValue(s))}g` },
        { id: "market_browse", emoji: "👀", text: "Just browse — buy rare seeds", subtext: "-20g, +rare crop" },
      ],
    }),
  },
  {
    id: "neighbor_help",
    condition: (s) => s.day > 2,
    generate: () => ({
      narrative: "Old Mae from down the road knocks on your door, looking frazzled. \"My fence is down and the chickens are everywhere. Any chance you could lend a hand?\"",
      choices: [
        { id: "help_mae", emoji: "🤝", text: "Of course! Let's wrangle some chickens.", subtext: "+3 charm, +1 grit" },
        { id: "help_mae_wisdom", emoji: "💡", text: "Show her the herding trick you read about", subtext: "+2 charm, +1 wisdom" },
        { id: "help_decline", emoji: "😅", text: "Sorry Mae, I'm swamped today", subtext: "Mae remembers..." },
      ],
    }),
  },
  {
    id: "traveling_merchant",
    condition: (s) => s.phase === "afternoon" && s.gold >= 20,
    generate: (s) => ({
      narrative: "A colorful wagon pulls up with a sign reading \"EXOTIC SEEDS & CURIOUS GOODS.\" The merchant tips their enormous hat and grins. \"I've got things you won't find at any ordinary store.\"",
      choices: [
        { id: "merchant_seeds", emoji: "🌱", text: "Buy mystery seeds", subtext: "-20g, could be amazing" },
        { id: "merchant_tool", emoji: "🔧", text: "Buy a fancy tool upgrade", subtext: "-30g, +2 grit permanently" },
        { id: "merchant_book", emoji: "📚", text: "Buy a rare farming almanac", subtext: "-25g, +3 wisdom permanently" },
        { id: "merchant_pass", emoji: "👋", text: "Just browsing, thanks", subtext: "Free" },
      ],
    }),
  },
  {
    id: "bruce_gift",
    condition: (s) => s.animals.some((a) => a.type === "cat") && s.day > 3,
    generate: () => ({
      narrative:
        "Bruce the barn cat drops something at your feet with an air of tremendous pride. It's a dead mouse. He stares at you expectantly, clearly waiting for applause. Behind him, you notice the grain shed looks suspiciously mouse-free.",
      choices: [
        { id: "bruce_praise", emoji: "👏", text: "Tell Bruce he's the greatest hunter alive", subtext: "+1 charm (Bruce approved)" },
        { id: "bruce_treat", emoji: "🐟", text: "Reward him with a special treat", subtext: "-2g, Bruce is extremely pleased" },
      ],
    }),
  },
  {
    id: "donkey_stubborn",
    condition: (s) => s.animals.some((a) => a.type === "donkey"),
    generate: (s) => {
      const donkey = s.animals.find((a) => a.type === "donkey")!;
      return {
        narrative: `${donkey.name} the donkey has decided that today is a day for standing perfectly still in the middle of the path. No amount of gentle encouragement is working. The hay bales aren't going to move themselves.`,
        choices: [
          { id: "donkey_apple", emoji: "🍎", text: "Bribe with an apple", subtext: "+1 wisdom (you learn their price)" },
          { id: "donkey_sing", emoji: "🎵", text: "Try singing to them", subtext: "+1 charm (surprisingly effective)" },
          { id: "donkey_carry", emoji: "💪", text: "Move the hay yourself", subtext: "+2 grit" },
        ],
      };
    },
  },
];

function tryRandomEvent(state: GameState): { narrative: string; choices: Choice[] } | null {
  if (Math.random() > 0.3) return null;
  const eligible = RANDOM_EVENTS.filter(
    (e) => !state.usedEvents.includes(e.id) && e.condition(state)
  );
  if (eligible.length === 0) return null;
  const event = pickRandom(eligible);
  return event.generate(state);
}

// ============================================================
// GENERIC SCENARIO GENERATION
// ============================================================

function generatePhaseChoices(state: GameState): Choice[] {
  const { phase, season, animals, crops, buildings, gold, wood } = state;
  const choices: Choice[] = [];

  if (phase === "morning") {
    if (animals.length > 0) {
      choices.push({ id: "tend_animals", emoji: "🐾", text: "Tend to the animals", subtext: "+products, +1 charm" });
    }
    if (crops.length > 0 && crops.some((c) => c.daysGrown < CROP_DATA[c.type].growDays)) {
      choices.push({ id: "tend_garden", emoji: "💧", text: "Water and weed the garden", subtext: "+crop growth, +1 wisdom" });
    }
    if (crops.some((c) => c.daysGrown >= CROP_DATA[c.type].growDays)) {
      const n = crops.filter((c) => c.daysGrown >= CROP_DATA[c.type].growDays).length;
      choices.push({ id: "harvest", emoji: "🌾", text: `Harvest ${n} ready crop${n > 1 ? "s" : ""}`, subtext: "+inventory" });
    }
    choices.push({ id: "chop_wood", emoji: "🪓", text: "Chop firewood", subtext: "+2 wood, +1 grit" });
    choices.push({ id: "forage", emoji: "🍄", text: "Forage in the woods", subtext: "+items, +1 wisdom" });
    if (state.gardenPlots - crops.length < 2 && !buildings.includes("garden")) {
      choices.push({ id: "clear_land", emoji: "⛏️", text: "Clear more farmland", subtext: "+2 plots, +2 grit" });
    }
  }

  if (phase === "afternoon") {
    choices.push({ id: "visit_shop", emoji: "🏪", text: "Visit the general store", subtext: "Buy seeds, animals, supplies" });
    if (invCount(state.inventory) > 0) {
      choices.push({ id: "sell_goods", emoji: "💰", text: "Sell goods", subtext: `~${invValue(state)}g worth` });
    }
    if (wood >= 3 || gold >= 25) {
      const buildable = Object.entries(BUILDING_DATA).filter(
        ([k]) => !buildings.includes(k as BuildingType)
      );
      if (buildable.length > 0) {
        choices.push({ id: "build_menu", emoji: "🔨", text: "Build something", subtext: `${buildable.length} options` });
      }
    }
    const availCrops = Object.entries(CROP_DATA).filter(
      ([, d]) => (d.seasons.includes(season) || buildings.includes("greenhouse")) && gold >= d.cost
    );
    if (availCrops.length > 0 && state.gardenPlots > crops.length) {
      choices.push({ id: "plant_menu", emoji: "🌱", text: "Plant crops", subtext: `${state.gardenPlots - crops.length} plots free` });
    }
    choices.push({ id: "study", emoji: "📚", text: "Study farming techniques", subtext: "+2 wisdom" });
    choices.push({ id: "help_neighbor", emoji: "🤝", text: "Help a neighbor with chores", subtext: "+2 charm, +5g" });
  }

  if (phase === "evening") {
    choices.push({ id: "barn_dance", emoji: "🎵", text: "Join the barn dance down the road", subtext: "+2 charm" });
    const hasRaw = Object.entries(state.inventory).some(([k]) => ["milk", "goat milk", "berries"].includes(k));
    if (hasRaw && buildings.includes("cellar")) {
      choices.push({ id: "craft", emoji: "🧀", text: "Craft artisan goods", subtext: "Convert products → higher value" });
    }
    if (state.day >= 10) {
      choices.push({ id: "plan_party", emoji: "🎉", text: "Plan the celebration", subtext: "+celebration quality" });
    }
    choices.push({ id: "fire_stories", emoji: "🔥", text: "Stories by the campfire", subtext: "+1 charm, peaceful" });
    choices.push({ id: "rest_early", emoji: "😴", text: "Turn in early", subtext: "+1 all stats tomorrow" });
  }

  return choices.slice(0, 4);
}

function getScenario(state: GameState): { narrative: string; choices: Choice[] } {
  // Scripted events first
  const scripted = getScriptedScenario(state);
  if (scripted) return scripted;

  // Random events
  const random = tryRandomEvent(state);
  if (random) return random;

  // Generic scenario
  const pool = state.phase === "morning"
    ? MORNING_NARRATIVES[state.season]
    : state.phase === "afternoon"
      ? AFTERNOON_NARRATIVES[state.season]
      : EVENING_NARRATIVES[state.season];

  const narrative = pickRandom(pool)(state);
  const choices = generatePhaseChoices(state);
  return { narrative, choices };
}

// ============================================================
// CHOICE EFFECTS
// ============================================================

function applyChoice(id: string, state: GameState): { state: GameState; text: string; eventId?: string } {
  const s: GameState = {
    ...state,
    animals: [...state.animals],
    crops: [...state.crops],
    buildings: [...state.buildings],
    inventory: { ...state.inventory },
    usedEvents: [...state.usedEvents],
  };
  let text = "";

  switch (id) {
    // ---- Day 1 Morning ----
    case "day1_chickens": {
      const names = ["Henrietta", "Cluck Norris", "Eggatha"];
      s.animals.push(
        { type: "chicken", name: names[0] },
        { type: "chicken", name: names[1] },
        { type: "chicken", name: names[2] },
      );
      text = `After 20 minutes of bush-diving and some undignified crawling, you wrangle three chickens. The brown one gives you a look of grudging respect. You name them ${names.join(", ")}.\n\nThey immediately start pecking at your boots.`;
      break;
    }
    case "day1_house": {
      s.wisdom += 1;
      s.gold += 10;
      text = "The farmhouse is dusty but solid. You find gardening books (one titled 'Goats: They Will Eat Anything, Yes Even That'), a rusty but usable set of tools, and $10 in a coffee can labeled 'Emergency Chicken Fund.'\n\nThe previous owner had interesting priorities.";
      break;
    }
    case "day1_garden": {
      s.grit += 2;
      text = "You attack the overgrown plot with determination. After an hour of pulling weeds, shifting rocks, and convincing a very large toad to relocate, you've got a proper garden bed. Your arms ache but the dark soil looks rich and ready.\n\nThe toad gives you a disapproving look from its new home behind the rain barrel.";
      break;
    }
    case "day1_porch": {
      s.charm += 1;
      text = "You sit on the porch steps and just... breathe. The meadow stretches out gold-green in the afternoon light. A neighbor walking the road waves, and you wave back. It's small, but it feels like the beginning of something.\n\nA butterfly lands on your knee. Nice.";
      break;
    }

    // ---- Day 1 Afternoon ----
    case "day1_town": {
      s.charm += 1;
      s.gold += 5;
      text = "The town is tiny and perfect — a general store, a library, a community hall, and a post office that doubles as a bakery. Old Mae at the general store sizes you up and immediately starts telling you everything you need to know about everyone.\n\nShe presses a jar of strawberry jam into your hands. \"Welcome gift. Don't feed it to the goats.\"";
      s.inventory = addInv(s.inventory, "jam");
      break;
    }
    case "day1_chop": {
      s.wood += 3;
      s.grit += 2;
      text = "The dead oak comes apart with satisfying *thunks*. Swing after swing, the pile grows. Your arms will hate you tomorrow, but there's something deeply satisfying about it.\n\nA woodpecker watches from a nearby tree, seemingly taking notes.";
      break;
    }
    case "day1_explore": {
      s.wisdom += 1;
      s.inventory = addInv(s.inventory, "berries", 2);
      s.inventory = addInv(s.inventory, "mushrooms", 2);
      text = "The woods behind your property are beautiful — dappled sunlight, ferns, the sound of a creek somewhere nearby. You find wild berry bushes heavy with fruit, some edible mushrooms, and what appears to be a very old stone wall marking an ancient property line.\n\nNature's grocery store.";
      break;
    }

    // ---- Day 1 Evening ----
    case "day1_plan": {
      s.wisdom += 1;
      text = "Tea steam curls in the lamplight as you sketch out plans. Seeds to buy, fences to mend, a coop to build. The list is long but exciting. Every line is a dream taking shape.\n\nYou fall asleep at the kitchen table with the pencil still in your hand.";
      break;
    }
    case "day1_fire": {
      s.charm += 1;
      text = "The fire crackles and pops, sending sparks up to join the stars. You lean back and watch the Milky Way arc overhead. An owl calls from the treeline. Fireflies drift across the meadow like grounded constellations.\n\nFor the first time, this place feels like it could be home.";
      break;
    }
    case "day1_sleep": {
      s.grit += 1;
      s.wisdom += 1;
      s.charm += 1;
      text = "You crash into the old bed and are asleep in seconds. The mattress is lumpy and perfect. Through the open window, crickets sing you the farm's lullaby.\n\nYou sleep deeply and wake ready for anything.";
      break;
    }

    // ---- Kids Visit (Day 4) ----
    case "kids_emmett_wood": {
      s.wood += 4;
      s.grit += 1;
      s.usedEvents.push("kids_visit");
      text = "Emmett attacks the woodpile with the focus of someone who was born for this. \"I'm basically a lumberjack now,\" he announces, after splitting three logs. He's not wrong — the kid is surprisingly strong.\n\nBy afternoon, your wood supply has nearly doubled.";
      break;
    }
    case "kids_sapphire_names": {
      s.charm += 2;
      s.usedEvents.push("kids_visit");
      text = "Sapphire takes her naming duties very seriously. She interviews each animal, studies their personality, and presents her findings with a crayon-illustrated chart.\n\nYou now have animals with names like \"Princess Sparklefeather\" and \"Lord Fluffington the Brave.\" The animals seem to approve.";
      break;
    }
    case "kids_garden": {
      s.crops = s.crops.map((c) => ({ ...c, daysGrown: c.daysGrown + 2 }));
      s.usedEvents.push("kids_visit");
      text = "Both kids take to gardening with enthusiasm. Emmett digs like he's searching for treasure. Sapphire carefully waters each plant and whispers encouragements. \"Grow big, little lettuce. You can do it.\"\n\nThe garden has never gotten this much attention.";
      break;
    }
    case "kids_adventure": {
      s.wisdom += 1;
      s.charm += 1;
      s.gold += 15;
      s.usedEvents.push("kids_visit");
      text = "Sapphire's fairy map leads you through the woods to a clearing you'd never found. There's a forgotten apple tree loaded with fruit, an old well (safely covered), and carved into a rock: \"TREASURE BELOW.\"\n\nEmmett digs and finds a rusted tin box with old coins inside. \"I TOLD you the map was real!\" Sapphire beams. It's actually worth about 15g. Best day ever.";
      break;
    }

    // ---- Spring Farewell (Day 5) ----
    case "spring_dance": {
      s.charm += 3;
      text = "The fiddle plays and you dance until your boots are dusty and your cheeks hurt from grinning. Old Mae does a surprisingly energetic jig. The whole neighborhood is here, laughing and spinning under the first stars of summer.\n\nYou're officially part of this community now.";
      break;
    }
    case "spring_sell": {
      const val = invValue(s);
      s.gold += val;
      s.inventory = {};
      s.charm += 1;
      text = `You set up a little table and sell everything you've got. The neighbors snap it all up — fresh eggs, garden vegetables, foraged berries. You earn ${val}g and several compliments on your strawberries.\n\n\"Best newcomer farmer we've had in years,\" says Old Mae. High praise.`;
      break;
    }
    case "spring_rest": {
      s.wisdom += 1;
      s.charm += 1;
      text = "You find a quiet spot in the meadow and watch the fireflies dance. The air is warm and sweet. Somewhere, the fiddle still plays. Summer starts tomorrow, and you feel ready.\n\nA firefly lands on your finger. You take it as a good sign.";
      break;
    }

    // ---- Stray Animal (Day 7) ----
    case "stray_cat": {
      s.animals.push({ type: "cat", name: "Bruce" });
      s.usedEvents.push("stray_animal");
      text = "Bruce (you didn't choose the name — he just IS a Bruce) saunters inside like he's always lived here. Within an hour, he's claimed the sunniest windowsill, intimidated the chickens, and caught a mouse.\n\nHe is the barn cat this farm deserves.";
      break;
    }
    case "stray_dog": {
      s.animals.push({ type: "dog", name: "Bella" });
      s.usedEvents.push("stray_animal");
      text = "The dog — you name her Bella — practically vibrates with happiness when you open the door. She immediately does a perimeter check of the entire farm, reports back with a wagging tail, and takes up position between the coop and the barn.\n\nYou feel safer already.";
      break;
    }
    case "stray_both": {
      s.animals.push({ type: "cat", name: "Bruce" }, { type: "dog", name: "Bella" });
      s.gold -= 15;
      s.usedEvents.push("stray_animal");
      text = "Bruce the cat saunters in like he owns the place. Bella the dog bounces in like she just won the lottery. They size each other up for exactly two seconds before Bruce bops Bella on the nose and they become instant best friends.\n\nYou buy them both food and a bed. The bed is for Bella. Bruce has already claimed your pillow.";
      break;
    }
    case "stray_none": {
      s.usedEvents.push("stray_animal");
      s.charm -= 1;
      text = "You shoo them away, feeling slightly guilty. The cat gives you a look of withering disappointment. The dog's tail droops. They both leave... but the cat is back on your porch by evening.\n\nSome things are just meant to be.";
      break;
    }

    // ---- Midsummer Festival (Day 10) ----
    case "mid_dance": {
      s.charm += 3;
      text = "You dance until the stars come out. Your neighbors teach you their favorite steps, and you teach them one you just made up. Nobody cares that you're not great — the joy is contagious. Old Mae twirls past you grinning.\n\n\"You've got rhythm, farmer!\"";
      break;
    }
    case "mid_wrestle": {
      const win = s.grit > 15;
      s.grit += 2;
      if (win) s.charm += 1;
      text = win
        ? "You step up to the arm-wrestling table and lock hands with Big Earl, the local farrier. The crowd goes silent. It's close — Earl's strong — but all that wood-chopping pays off. Your hand slams his down and the crowd erupts.\n\nBig Earl shakes your hand with new respect."
        : "Big Earl the farrier pins you in about three seconds. He's very nice about it. \"Good effort, farmer! Keep choppin' that wood.\"\n\nYou vow to come back stronger next year.";
      break;
    }
    case "mid_pie": {
      s.wisdom += 2;
      s.charm += 1;
      text = "Your farm-to-table pie is a hit. The judges debate between yours and Mae's legendary blueberry, and while Mae wins (she always wins), they give you \"Most Promising Newcomer.\"\n\nThe ribbon is going on the fridge.";
      break;
    }
    case "mid_socialize": {
      s.charm += 4;
      text = "You work the crowd like a natural. By the end of the night, you've gotten three offers of help with the farm, two recipe swaps, and an invitation to join the town's book club (they mostly talk about goats).\n\nThis is your community now.";
      break;
    }

    // ---- Zoe's Adventure (Day 13) ----
    case "zoe_chase": {
      s.grit += 2;
      s.usedEvents.push("zoe_adventure");
      text = "You chase Zoe across the farm in what can only be described as a slapstick comedy. Through the garden (careful!), around the barn (twice), under the fence, and finally — FINALLY — she stops to roll in something that smells terrible.\n\nYou're both panting. She looks absolutely thrilled. You look like you lost a fight with a hedge.";
      break;
    }
    case "zoe_treats": {
      s.wisdom += 1;
      s.gold += 20;
      s.usedEvents.push("zoe_adventure");
      text = "The treat bag gets Zoe's attention instantly. She trots over... then past you... then into the woods. You follow, shaking the bag. She leads you to a hidden clearing where someone left behind a stash of old gardening equipment, still usable!\n\nZoe gets approximately 47 treats. The equipment is worth about 20g.";
      break;
    }
    case "zoe_let_run": {
      s.charm += 1;
      s.usedEvents.push("zoe_adventure");
      text = "You sit on the porch and watch Zoe introduce herself to every animal on the farm. She bows to the chickens. She does a play-bow to the goats. She and Bella do synchronized zoomies. Bruce watches from the roof, unimpressed.\n\nBy the time she's done, she's made friends with everyone and is asleep in a sunbeam.";
      break;
    }

    // ---- Random Event Effects ----
    case "fox_praise": {
      s.charm += 1;
      text = `${s.animals.find((a) => a.type === "dog")?.name} accepts your praise with a dignified tail wag. Guardian duty is serious business, but extra treats don't hurt.`;
      break;
    }
    case "fox_fence": {
      s.wood = Math.max(0, s.wood - (s.animals.some((a) => a.type === "dog") ? 2 : 3));
      s.grit += 1;
      text = "You spend the morning reinforcing the fence. It's not glamorous work, but your birds will sleep safer tonight.";
      break;
    }
    case "fox_guard": {
      s.gold -= 5;
      text = "The lanterns cast a warm glow around the coop. Not a permanent fix, but it'll do for now. The chickens seem soothed by the light.";
      break;
    }
    case "fox_lose": {
      const poultry = s.animals.filter((a) => ["chicken", "duck", "goose"].includes(a.type));
      if (poultry.length > 0) {
        const lost = poultry[poultry.length - 1];
        s.animals = s.animals.filter((a) => a !== lost);
        text = `${lost.name} is gone. The other birds are quiet today. You vow to build better defenses.`;
      } else {
        text = "The fox found nothing this time. Lucky.";
      }
      break;
    }
    case "goat_lure":
      s.wisdom += 1;
      text = "The apple trick works every time. Note to self: always carry apples. The goat descends with the grace of a mountain... well, goat.";
      break;
    case "goat_climb":
      s.grit += 2;
      text = "You scale the coop (carefully — the chickens are NOT happy about the vibrations), scoop up the goat, and make it down without incident. Mostly. One boot didn't make it.";
      break;
    case "goat_wait":
      s.charm += 1;
      text = "You sit. You wait. The goat stares at you. You stare back. Twenty minutes later, the goat casually hops down and walks away like nothing happened.\n\nClassic goat.";
      break;
    case "storm_cover":
      s.grit += 1;
      text = "You race to cover the garden with tarps and straw. The storm hits hard — wind, rain, even a little hail — but your crops make it through. The garden looks battered but alive.";
      break;
    case "storm_pray": {
      if (Math.random() > 0.5) {
        text = "The storm passes without too much damage. A few leaves lost, but nothing serious. You got lucky this time.";
      } else {
        s.crops = s.crops.slice(0, Math.max(0, s.crops.length - 1));
        text = "The storm hits hard. One of your crop patches doesn't survive — the hail was too much. Nature giveth and nature taketh away.";
      }
      break;
    }
    case "storm_greenhouse":
      text = "You move everything into the greenhouse just in time. The storm rages outside, but inside it's warm and still. Your crops are safe. Best investment you ever made.";
      break;
    case "market_sell_all": {
      const val = invValue(s) * 2;
      s.gold += val;
      s.inventory = {};
      text = `You sell everything at double prices. The merchant is delighted, you're delighted, ${val}g richer and feeling like a shrewd businessperson.`;
      break;
    }
    case "market_sell_half": {
      const val = Math.floor(invValue(s));
      s.gold += val;
      const keys = Object.keys(s.inventory);
      const half = keys.slice(0, Math.ceil(keys.length / 2));
      for (const k of half) delete s.inventory[k];
      text = `You sell the surplus and keep the premium stuff. +${val}g and you still have goods in reserve. Smart farming.`;
      break;
    }
    case "market_browse": {
      s.gold -= 20;
      const rare = pickRandom(Object.keys(CROP_DATA) as CropType[]);
      s.crops.push({ type: rare, daysGrown: 0 });
      text = `The merchant has rare ${CROP_DATA[rare].label} seeds from across the mountains. You plant them immediately. ${CROP_DATA[rare].emoji} Who knows what'll grow?`;
      break;
    }
    case "help_mae":
      s.charm += 3;
      s.grit += 1;
      text = "Wrangling Mae's chickens is surprisingly athletic. By the time you've caught the last one (behind the post office, naturally), you're both laughing and covered in feathers. Mae insists you stay for lemonade.";
      break;
    case "help_mae_wisdom":
      s.charm += 2;
      s.wisdom += 1;
      text = "The herding trick you read about actually works — form a wide circle, move slowly, let the chickens funnel through the gap. Mae watches with growing respect.\n\n\"Well I'll be. Fifty years farming and a newcomer shows me a new trick.\"";
      break;
    case "help_decline":
      text = "Mae nods, but you catch a flicker of disappointment. In a small community, these things matter. Something to keep in mind.";
      break;
    case "merchant_seeds": {
      s.gold -= 20;
      s.crops.push({ type: "strawberry", daysGrown: 1 });
      text = "The seeds are wrapped in silk with no label. \"Trust me,\" the merchant winks. You plant them and hope for the best. The next morning, sprouts are already showing. Fast growers.";
      break;
    }
    case "merchant_tool":
      s.gold -= 30;
      s.grit += 2;
      text = "It's a beautifully balanced hoe with a handle carved from applewood. Using it feels like the tool is doing half the work. Everything you do on the farm will be just a little easier now.";
      break;
    case "merchant_book":
      s.gold -= 25;
      s.wisdom += 3;
      text = "\"The Farmer's Complete Almanac, 47th Edition.\" It has everything — planting charts, animal care, weather prediction, even a section on cheese-making. This is a treasure.";
      break;
    case "merchant_pass":
      text = "The merchant tips their hat. \"Next time, friend.\" The wagon rolls on, leaving behind the faint scent of exotic spices and possibility.";
      break;
    case "bruce_praise":
      s.charm += 1;
      text = "You give Bruce a standing ovation. He accepts this as his due, cleans one paw, and goes back to patrol. The grain shed hasn't had a mouse problem since Bruce arrived.";
      break;
    case "bruce_treat":
      s.gold -= 2;
      text = "Bruce receives his treat with the dignity of a king accepting tribute. He then bumps his head against your hand exactly once (Bruce's version of a hug) before returning to his post.";
      break;
    case "donkey_apple":
      s.wisdom += 1;
      text = "The apple vanishes in two enormous bites. The donkey, suddenly cooperative, picks up the hay bales' rope like this was the plan all along. You've learned the price of donkey labor: one apple.";
      break;
    case "donkey_sing":
      s.charm += 1;
      text = "You don't know why you try singing. You REALLY don't know why it works. But the donkey starts walking the moment you hit the chorus of 'You Are My Sunshine.' Everyone has their song, apparently.";
      break;
    case "donkey_carry":
      s.grit += 2;
      text = "Fine. You'll do it yourself. The hay bales are heavy, you're stubborn, and the donkey watches you with what can only be described as amusement. At least you're getting stronger.";
      break;

    // ---- Generic Actions ----
    case "tend_animals": {
      s.charm += 1;
      const snippets: string[] = [];
      if (s.animals.some((a) => a.type === "chicken"))
        snippets.push("The chickens mob you the moment they see the feed bucket.");
      if (s.animals.some((a) => a.type === "goat"))
        snippets.push("The goats try to eat your sleeve while you're pouring grain.");
      if (s.animals.some((a) => a.type === "cow"))
        snippets.push("The cow gives you a long, soulful look during milking.");
      if (s.animals.some((a) => a.type === "duck"))
        snippets.push("The ducks waddle in a perfect line to the water trough, then immediately waddle back for more food.");
      if (s.animals.some((a) => a.type === "sheep"))
        snippets.push("The sheep stand in a huddle and look at you with big eyes. Adorable.");
      if (s.animals.some((a) => a.type === "pig"))
        snippets.push("The pig has reorganized their entire pen overnight. Creative.");
      // Double products
      for (const a of s.animals) {
        const d = ANIMAL_DATA[a.type];
        if (d.product && d.productValue > 0) {
          s.inventory = addInv(s.inventory, d.product);
        }
      }
      text = snippets.slice(0, 3).join(" ") || "Your animals are happy and well-fed.";
      text += "\n\nBonus products collected!";
      break;
    }
    case "tend_garden": {
      s.wisdom += 1;
      s.crops = s.crops.map((c) => ({ ...c, daysGrown: c.daysGrown + 1 }));
      text = "You water each row carefully, pull weeds, check for pests. The garden responds to your attention — you can almost see things growing. There's a zen to this.\n\nCrops advanced by an extra day.";
      break;
    }
    case "harvest": {
      const ready = s.crops.filter((c) => c.daysGrown >= CROP_DATA[c.type].growDays);
      const remaining = s.crops.filter((c) => c.daysGrown < CROP_DATA[c.type].growDays);
      const harvested: string[] = [];
      for (const c of ready) {
        const d = CROP_DATA[c.type];
        s.inventory = addInv(s.inventory, d.label.toLowerCase());
        s.cropsHarvested++;
        harvested.push(`${d.emoji} ${d.label}`);
      }
      s.crops = remaining;
      text = `You harvest: ${harvested.join(", ")}. There's nothing quite like pulling food from earth you tended yourself.\n\nAdded to inventory!`;
      break;
    }
    case "chop_wood": {
      s.wood += 2;
      s.grit += 1;
      text = pickRandom([
        "Swing, split, stack. Swing, split, stack. The rhythm is meditative. Your arms are getting stronger.",
        "The axe bites deep and the log splits clean. Two more for the pile. This never gets old.",
        "You chop until your arms burn, then chop a little more. The woodpile grows. So do your biceps.",
      ]);
      break;
    }
    case "forage": {
      s.wisdom += 1;
      const finds = pickRandom([
        { item: "berries", count: 2, desc: "A hidden berry patch, heavy with fruit" },
        { item: "mushrooms", count: 2, desc: "Perfect chanterelles under an old oak" },
        { item: "wildflowers", count: 3, desc: "A meadow of wildflowers — beautiful and useful" },
        { item: "herbs", count: 2, desc: "Wild herbs growing along the creek bed" },
      ]);
      s.inventory = addInv(s.inventory, finds.item, finds.count);
      text = `${finds.desc}. You gather what you can carry. The woods always have something to offer if you know where to look.\n\n+${finds.count} ${finds.item}`;
      break;
    }
    case "clear_land": {
      s.grit += 2;
      s.gardenPlots += 2;
      text = "Rocks out, stumps pulled, earth turned. It's backbreaking work, but watching the usable land expand is deeply satisfying. Two more plots ready for planting.\n\n+2 garden plots";
      break;
    }
    case "sell_goods": {
      const val = invValue(s);
      s.gold += val;
      s.inventory = {};
      text = `You sell your goods ${s.buildings.includes("stand") ? "at the farm stand (nice markup!)" : "to Old Mae at the general store"}. She inspects everything carefully and nods approvingly.\n\n+${val}g`;
      break;
    }
    case "study": {
      s.wisdom += 2;
      text = pickRandom([
        "You spend the afternoon at the tiny town library, nose-deep in agricultural journals. Crop rotation, companion planting, soil pH — it all starts clicking.",
        "The farming almanac reveals secrets you never knew. Apparently, planting basil near tomatoes keeps pests away. Knowledge is power.",
        "You read about heritage breeds, heirloom seeds, and sustainable practices. The more you learn, the more you realize how much there is to know. In the best way.",
      ]);
      break;
    }
    case "help_neighbor": {
      s.charm += 2;
      s.gold += 5;
      text = pickRandom([
        "You help the Hendersons fix their barn door. It takes all afternoon, but they insist on paying you and send you home with a jar of pickles.",
        "You help corral a neighbor's escaped sheep. It's like herding... well, sheep. But harder than it sounds. They're grateful and slip you a few dollars.",
        "The community garden needs weeding. You spend a pleasant afternoon working alongside neighbors, swapping stories and seeds. They insist on sharing the harvest.",
      ]);
      break;
    }
    case "barn_dance": {
      s.charm += 2;
      text = pickRandom([
        "The barn dance is lively tonight. You do-si-do with strangers who feel like friends and stomp your boots on the wooden floor until it shakes. Someone teaches you a reel you'll never forget.",
        "Music, laughter, and the smell of apple cider. The barn dance is where this community comes alive. You feel more at home with every song.",
      ]);
      break;
    }
    case "craft": {
      s.wisdom += 1;
      if (s.inventory["milk"] || s.inventory["goat milk"]) {
        const milkType = s.inventory["milk"] ? "milk" : "goat milk";
        s.inventory[milkType]! -= 1;
        if (s.inventory[milkType]! <= 0) delete s.inventory[milkType];
        s.inventory = addInv(s.inventory, "cheese");
        text = "You spend the evening in the root cellar, carefully turning milk into cheese. The process is slow and precise — warming, curdling, pressing. The result is a beautiful wheel that'll only get better with age.";
      } else if (s.inventory["berries"]) {
        s.inventory["berries"]! -= 1;
        if (s.inventory["berries"]! <= 0) delete s.inventory["berries"];
        s.inventory = addInv(s.inventory, "jam");
        text = "Berry jam night! The kitchen smells incredible as berries bubble and thicken. You fill jars and label them with care. These will sell for a premium.";
      } else {
        text = "You tinker with recipes but don't have quite the right ingredients. Tomorrow, maybe.";
      }
      break;
    }
    case "plan_party": {
      s.celebrationQuality += 3;
      text = "You sketch out the celebration plan: table layout, music, food, decorations. Each detail adds up. You can picture it now — fairy lights in the trees, tables groaning with food, everyone you love in one place.\n\n+3 celebration quality";
      break;
    }
    case "fire_stories": {
      s.charm += 1;
      text = pickRandom([
        "The campfire crackles. Stars wheel overhead. You think about how far you've come since that first day with the overgrown field and the missing chickens. Not bad at all.",
        "You sit by the fire and write in your journal. The flames paint dancing shadows on the page. Somewhere, an owl hoots. This is the good life.",
        "Neighbors join you around the fire. Stories are swapped, marshmallows are burned, and someone claims they saw a fairy in the meadow. (It was a firefly, but the story is better this way.)",
      ]);
      break;
    }
    case "rest_early": {
      s.grit += 1;
      s.wisdom += 1;
      s.charm += 1;
      text = "You call it an early night. The bed welcomes you. Through the window, stars and fireflies compete for brightness. Tomorrow you'll tackle the world.\n\nWell-rested: +1 to all stats.";
      break;
    }

    default:
      text = "You spend some time on the farm. Every day is progress.";
      break;
  }

  return { state: s, text, eventId: undefined };
}

// ============================================================
// SHOP / BUILD / PLANT SCREENS
// ============================================================

function getShopChoices(state: GameState): Choice[] {
  const choices: Choice[] = [];
  const { season, gold, animals, buildings } = state;

  // Seeds
  const availCrops = Object.entries(CROP_DATA)
    .filter(([, d]) => d.seasons.includes(season) || buildings.includes("greenhouse"))
    .slice(0, 3);
  for (const [id, d] of availCrops) {
    choices.push({
      id: `buy_seed_${id}`,
      emoji: d.emoji,
      text: `${d.label} Seeds`,
      subtext: `${d.cost}g, grows in ${d.growDays}d`,
      disabled: gold < d.cost || state.gardenPlots <= state.crops.length,
    });
  }

  // Animals
  const canPoultry = buildings.includes("coop") && countPoultry(animals) < 6;
  const canLarge = buildings.includes("barn") && countLarge(animals) < 4;
  if (canPoultry) {
    for (const type of ["chicken", "duck", "goose"] as AnimalType[]) {
      const d = ANIMAL_DATA[type];
      choices.push({
        id: `buy_animal_${type}`,
        emoji: d.emoji,
        text: d.label,
        subtext: `${d.cost}g${d.product ? `, produces ${d.product}` : ""}`,
        disabled: gold < d.cost,
      });
    }
  }
  if (canLarge) {
    for (const type of ["goat", "sheep", "cow", "pig", "donkey"] as AnimalType[]) {
      const d = ANIMAL_DATA[type];
      if (!animals.some((a) => a.type === type) || ["goat", "sheep", "chicken"].includes(type)) {
        choices.push({
          id: `buy_animal_${type}`,
          emoji: d.emoji,
          text: d.label,
          subtext: `${d.cost}g${d.product ? `, produces ${d.product}` : ""}`,
          disabled: gold < d.cost,
        });
      }
    }
  }

  // Cat/Dog (no housing needed)
  if (!animals.some((a) => a.type === "cat")) {
    choices.push({ id: "buy_animal_cat", emoji: "🐱", text: "Barn Cat", subtext: "10g, mouse control", disabled: gold < 10 });
  }
  if (!animals.some((a) => a.type === "dog")) {
    choices.push({ id: "buy_animal_dog", emoji: "🐕", text: "Guardian Dog", subtext: "60g, predator protection", disabled: gold < 60 });
  }

  choices.push({ id: "leave_shop", emoji: "🚶", text: "Leave the store", subtext: "" });
  return choices.slice(0, 6);
}

function getBuildChoices(state: GameState): Choice[] {
  const choices: Choice[] = [];
  for (const [key, d] of Object.entries(BUILDING_DATA)) {
    if (state.buildings.includes(key as BuildingType)) continue;
    choices.push({
      id: `build_${key}`,
      emoji: d.emoji,
      text: d.label,
      subtext: `${d.goldCost}g + ${d.woodCost} wood — ${d.desc}`,
      disabled: state.gold < d.goldCost || state.wood < d.woodCost,
    });
  }
  choices.push({ id: "leave_build", emoji: "🚶", text: "Never mind", subtext: "" });
  return choices;
}

function getPlantChoices(state: GameState): Choice[] {
  const choices: Choice[] = [];
  const { season, buildings, gold, crops, gardenPlots } = state;
  if (crops.length >= gardenPlots) {
    return [{ id: "leave_plant", emoji: "🚶", text: "No room — need more garden plots", subtext: "" }];
  }
  for (const [id, d] of Object.entries(CROP_DATA)) {
    if (!d.seasons.includes(season) && !buildings.includes("greenhouse")) continue;
    choices.push({
      id: `plant_${id}`,
      emoji: d.emoji,
      text: d.label,
      subtext: `${d.cost}g, ${d.growDays}d to grow, sells for ${d.sellPrice}g`,
      disabled: gold < d.cost,
    });
  }
  choices.push({ id: "leave_plant", emoji: "🚶", text: "Done planting", subtext: "" });
  return choices;
}

// ============================================================
// CELEBRATION & SCORING
// ============================================================

function getCelebrationScenario(state: GameState): { narrative: string; choices: Choice[] } {
  const { animals, buildings, charm, grit, wisdom, gold, cropsHarvested, celebrationQuality } = state;
  const hasParty = buildings.includes("pavilion");
  const score = calculateScore(state);
  const quality = charm + grit + wisdom + animals.length * 5 + buildings.length * 10 + celebrationQuality;

  let narrative: string;
  if (quality > 100 && hasParty) {
    narrative = `The fairy lights twinkle across the party pavilion as dozens of neighbors stream through the gate. Tables groan under platters of fresh garden vegetables, artisan cheese, and homemade bread. ${animals.some((a) => a.type === "goat") ? "The goats have been given tiny bow ties (Sapphire's idea) and are 'greeting' guests." : ""} ${animals.some((a) => a.type === "cat") ? "Bruce claims the best seat in the house — on top of the cake, briefly, before being relocated." : ""}\n\n${animals.some((a) => a.type === "dog") ? "Bella does laps between guests, tail at maximum wag speed." : ""} Emmett's running the music from his phone. The sunset paints everything gold.\n\nAs you look at what you've built — this farm, this community, this life — you smile. This isn't just a party. It's home.\n\nFINAL SCORE: ${score}`;
  } else if (quality > 50) {
    narrative = `The celebration is wonderful. Not perfect — the goats did eat some of the decorations, and someone's kid fell in the duck pond — but it's REAL. Neighbors bring potluck dishes, the fiddle player shows up, and the sunset is spectacular.\n\n${cropsHarvested > 5 ? "Your farm-fresh food is the star of the table." : "The food is simple but good."} ${animals.length > 3 ? "The kids are delighted by all the animals." : ""} You've built something good here.\n\nFINAL SCORE: ${score}`;
  } else {
    narrative = `The celebration is... intimate. You, ${animals.length > 0 ? `the ${animals[0].name},` : ""} and a few neighbors sit around a fire as the sun sets. There's ${gold > 20 ? "good food and cold drinks" : "bread and cheese"}.\n\nBut you know what? It's enough. The farm is young. The community is real. Everything starts somewhere.\n\nFINAL SCORE: ${score}`;
  }

  return { narrative, choices: [{ id: "submit_score", emoji: "🏆", text: "Submit Score", subtext: `${score} points` }] };
}

function calculateScore(state: GameState): number {
  let score = 0;
  // Animals
  for (const a of state.animals) score += ANIMAL_DATA[a.type].scoreValue;
  // Buildings
  for (const b of state.buildings) score += BUILDING_DATA[b].scoreValue;
  // Crops harvested
  score += state.cropsHarvested * 5;
  // Stats
  score += (state.grit + state.wisdom + state.charm) * 2;
  // Gold
  score += Math.floor(state.gold / 5);
  // Celebration quality
  score += state.celebrationQuality * 5;
  // Achievements
  if (countPoultry(state.animals) >= 6) score += 25;
  if (countLarge(state.animals) >= 4) score += 25;
  if (state.cropsHarvested >= 10) score += 25;
  if (state.buildings.length >= 4) score += 25;
  if (state.charm >= 30) score += 25;
  if (state.grit >= 30) score += 25;
  if (state.wisdom >= 30) score += 25;
  if (state.animals.some((a) => a.type === "cat")) score += 25;
  if (state.animals.length >= 8) score += 25;
  if (state.buildings.includes("pavilion")) score += 50;
  return score;
}

// ============================================================
// DAWN / NIGHT PROCESSING
// ============================================================

function processNewDay(state: GameState): GameState {
  const s: GameState = {
    ...state,
    day: state.day + 1,
    phase: "morning" as Phase,
    crops: state.crops.map((c) => ({ ...c, daysGrown: c.daysGrown + 1 })),
    inventory: { ...state.inventory },
    animals: [...state.animals],
    buildings: [...state.buildings],
    usedEvents: [...state.usedEvents],
  };
  s.season = getSeason(s.day);

  // Auto-harvest ready crops
  const remaining: Crop[] = [];
  for (const crop of s.crops) {
    const d = CROP_DATA[crop.type];
    if (crop.daysGrown >= d.growDays) {
      s.inventory = addInv(s.inventory, d.label.toLowerCase());
      s.cropsHarvested++;
    } else {
      remaining.push(crop);
    }
  }
  s.crops = remaining;

  // Animal products
  for (const a of s.animals) {
    const d = ANIMAL_DATA[a.type];
    if (d.product && d.productValue > 0) {
      s.inventory = addInv(s.inventory, d.product);
    }
  }

  return s;
}

// ============================================================
// CANVAS RENDERER
// ============================================================

function drawFarm(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  w: number,
  h: number,
  time: number
) {
  const { season, phase, animals, crops, buildings } = state;
  ctx.clearRect(0, 0, w, h);

  // Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  const skyColors: Record<Phase, [string, string]> = {
    morning: ["#87CEEB", "#FFE4B5"],
    afternoon: ["#5BA8DE", "#87CEEB"],
    evening: ["#1A0A2E", "#C85A17"],
  };
  skyGrad.addColorStop(0, skyColors[phase][0]);
  skyGrad.addColorStop(1, skyColors[phase][1]);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h * 0.6);

  // Sun/Moon
  if (phase === "evening") {
    ctx.fillStyle = "#F0E68C";
    ctx.beginPath();
    ctx.arc(w * 0.82, h * 0.13, 10, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = phase === "morning" ? "#FFD700" : "#FFF8DC";
    const sx = phase === "morning" ? w * 0.2 : w * 0.5;
    ctx.beginPath();
    ctx.arc(sx, h * 0.15, 13, 0, Math.PI * 2);
    ctx.fill();
  }

  // Clouds
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  for (let i = 0; i < 3; i++) {
    const cx = ((i * w) / 3 + time * 0.005 + i * 50) % (w + 60) - 30;
    const cy = h * 0.12 + i * 12;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 25, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hills
  const hillC: Record<Season, string> = { spring: "#5C7A4A", summer: "#3E6B2A", fall: "#8B7D3C" };
  ctx.fillStyle = hillC[season];
  ctx.beginPath();
  ctx.moveTo(0, h * 0.52);
  for (let x = 0; x <= w; x += 2) {
    ctx.lineTo(x, h * 0.52 + Math.sin(x * 0.02) * 8 + Math.sin(x * 0.007) * 12);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();

  // Ground
  const gndC: Record<Season, string> = { spring: "#4A6B3A", summer: "#356025", fall: "#7A6B2A" };
  ctx.fillStyle = gndC[season];
  ctx.fillRect(0, h * 0.62, w, h * 0.38);

  // Fence
  ctx.strokeStyle = "#8B7355";
  ctx.lineWidth = 1.5;
  const fenceY = h * 0.7;
  ctx.beginPath();
  ctx.moveTo(0, fenceY);
  ctx.lineTo(w, fenceY);
  ctx.stroke();
  for (let x = 15; x < w; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, fenceY - 6);
    ctx.lineTo(x, fenceY + 6);
    ctx.stroke();
  }

  // Farmhouse
  const hx = w * 0.06;
  const hy = h * 0.46;
  ctx.fillStyle = "#8B7355";
  ctx.fillRect(hx, hy, 36, 26);
  ctx.fillStyle = "#6B3A3A";
  ctx.beginPath();
  ctx.moveTo(hx - 4, hy);
  ctx.lineTo(hx + 18, hy - 16);
  ctx.lineTo(hx + 40, hy);
  ctx.fill();
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(hx + 12, hy + 7, 8, 8);
  ctx.fillStyle = "#5C3A1E";
  ctx.fillRect(hx + 4, hy + 12, 7, 14);

  // Buildings
  let bx = hx + 52;
  for (const b of buildings) {
    if (b === "coop") {
      ctx.fillStyle = "#C4A25A";
      ctx.fillRect(bx, hy + 10, 22, 16);
      ctx.fillStyle = "#8B6914";
      ctx.beginPath();
      ctx.moveTo(bx - 2, hy + 10);
      ctx.lineTo(bx + 11, hy + 2);
      ctx.lineTo(bx + 24, hy + 10);
      ctx.fill();
    } else if (b === "barn") {
      ctx.fillStyle = "#8B3A3A";
      ctx.fillRect(bx, hy + 5, 30, 21);
      ctx.fillStyle = "#4A2020";
      ctx.beginPath();
      ctx.moveTo(bx - 2, hy + 5);
      ctx.lineTo(bx + 15, hy - 8);
      ctx.lineTo(bx + 32, hy + 5);
      ctx.fill();
    } else if (b === "pavilion") {
      ctx.fillStyle = "#E8C8B8";
      ctx.beginPath();
      ctx.moveTo(bx, hy + 14);
      ctx.lineTo(bx + 18, hy - 2);
      ctx.lineTo(bx + 36, hy + 14);
      ctx.fill();
      ctx.strokeStyle = "#8B7355";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + 18, hy - 2);
      ctx.lineTo(bx + 18, hy + 26);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#7B8B6B";
      ctx.fillRect(bx, hy + 10, 18, 16);
    }
    bx += 42;
  }

  // Garden
  if (crops.length > 0 || state.gardenPlots > 4) {
    const gx = w * 0.55;
    const gy = h * 0.58;
    ctx.fillStyle = "#5C4033";
    ctx.fillRect(gx, gy, Math.min(state.gardenPlots * 10, 100), 14);
    let cx = gx + 5;
    for (const crop of crops) {
      const d = CROP_DATA[crop.type];
      const progress = Math.min(crop.daysGrown / d.growDays, 1);
      const ch = 3 + progress * 10;
      ctx.fillStyle = progress >= 1 ? "#FFD700" : "#4CAF50";
      ctx.fillRect(cx, gy - ch, 3, ch);
      if (progress >= 1) {
        ctx.font = "7px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(d.emoji, cx + 1, gy - ch - 2);
      }
      cx += 10;
    }
  }

  // Trees
  const treeCols: Record<Season, string> = { spring: "#5C7A4A", summer: "#2E5A2E", fall: "#B8860B" };
  for (const tx of [w * 0.9, w * 0.95]) {
    ctx.fillStyle = treeCols[season];
    ctx.beginPath();
    ctx.arc(tx, h * 0.47, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5C3A1E";
    ctx.fillRect(tx - 2, h * 0.47 + 10, 4, 13);
  }

  // Animals
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  let ax = w * 0.14;
  const ay = h * 0.77;
  for (let i = 0; i < animals.length && i < 12; i++) {
    const d = ANIMAL_DATA[animals[i].type];
    const bob = Math.sin(time / 600 + i * 1.7) * 2;
    ctx.fillText(d.emoji, ax, ay + bob);
    ax += 20;
    if (ax > w * 0.85) { ax = w * 0.14; }
  }

  // Spring flowers
  if (season === "spring") {
    const flowerC = ["#FFB6C1", "#FFD700", "#FFFFFF", "#DDA0DD"];
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = flowerC[i % flowerC.length];
      ctx.beginPath();
      ctx.arc((i * 37 + 10) % w, h * 0.63 + (i * 11) % 15, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Fall leaves
  if (season === "fall") {
    for (let i = 0; i < 6; i++) {
      const lx = ((time * 0.02 + i * 80) % (w + 20)) - 10;
      const ly = ((time * 0.015 + i * 50) % (h * 0.6));
      ctx.fillStyle = i % 2 === 0 ? "#D2691E" : "#B8860B";
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(time * 0.001 + i);
      ctx.fillRect(-2, -1.5, 4, 3);
      ctx.restore();
    }
  }

  // Evening stars & fireflies
  if (phase === "evening") {
    ctx.fillStyle = "#FFF";
    for (let i = 0; i < 12; i++) {
      const sx = (i * 47 + 8) % w;
      const sy = (i * 29 + 3) % (h * 0.35);
      ctx.globalAlpha = Math.sin(time / 400 + i) * 0.4 + 0.6;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 5; i++) {
      const fx = w * 0.25 + Math.sin(time / 900 + i * 2) * w * 0.3;
      const fy = h * 0.45 + Math.cos(time / 700 + i * 3) * h * 0.12;
      const glow = Math.sin(time / 250 + i) * 0.4 + 0.6;
      ctx.globalAlpha = glow;
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(fx, fy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface Props {
  onGameOver: (score: number) => void;
}

export default function HomesteadGame({ onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<GameState>(INITIAL_STATE);
  const gameRef = useRef(game);
  gameRef.current = game;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Canvas sizing
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const cont = containerRef.current;
    if (!canvas || !cont) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = cont.getBoundingClientRect();
    const cw = rect.width;
    const ch = 160;
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  // Canvas animation
  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let last = 0;
    const FPS_INTERVAL = 1000 / 15;
    const render = (time: number) => {
      if (time - last >= FPS_INTERVAL) {
        const dpr = window.devicePixelRatio || 1;
        drawFarm(ctx, gameRef.current, canvas.width / dpr, canvas.height / dpr, time);
        last = time;
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", setupCanvas);
    };
  }, [setupCanvas]);

  // Scroll to top of content on screen change
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [game.screen, game.narrative]);

  // State helpers
  const update = useCallback((changes: Partial<GameState>) => {
    setGame((prev) => ({ ...prev, ...changes }));
  }, []);

  // Start game
  const startGame = useCallback(() => {
    const initial = { ...INITIAL_STATE, screen: "dawn" as Screen, day: 1 };
    const scenario = DAWN_TEXTS[0](initial);
    setGame({ ...initial, narrative: scenario, choices: [{ id: "continue_dawn", emoji: "→", text: "Begin your first day" }] });
  }, []);

  // Enter a phase
  const enterPhase = useCallback((state: GameState) => {
    const scenario = getScenario(state);
    setGame({
      ...state,
      screen: "phase",
      narrative: scenario.narrative,
      choices: scenario.choices,
    });
  }, []);

  // Handle choice
  const handleChoice = useCallback(
    (choiceId: string) => {
      const g = gameRef.current;

      // Continue from dawn
      if (choiceId === "continue_dawn") {
        enterPhase({ ...g, screen: "phase", phase: "morning" });
        return;
      }

      // Continue from night
      if (choiceId === "continue_night") {
        const newState = processNewDay(g);
        if (newState.day > 15) {
          // Game over - force celebration
          const scenario = getCelebrationScenario(newState);
          setGame({ ...newState, screen: "celebration", narrative: scenario.narrative, choices: scenario.choices });
        } else {
          const dawnText = DAWN_TEXTS[0](newState);
          setGame({ ...newState, screen: "dawn", narrative: dawnText, choices: [{ id: "continue_dawn", emoji: "→", text: "Start the day" }] });
        }
        return;
      }

      // Continue from result
      if (choiceId === "continue_result") {
        const nextPhase: Record<Phase, Phase | "night"> = {
          morning: "afternoon",
          afternoon: "evening",
          evening: "night",
        };
        const next = nextPhase[g.phase];
        if (next === "night") {
          if (g.day >= 15) {
            const scenario = getCelebrationScenario(g);
            setGame({ ...g, screen: "celebration", narrative: scenario.narrative, choices: scenario.choices });
          } else {
            update({
              screen: "night",
              narrative: "The stars come out one by one. Another good day on the homestead. You review what you've accomplished and drift off to sleep.\n\n" +
                `Stats: 🌿${g.grit} 📚${g.wisdom} 💛${g.charm} | 💰${g.gold}g | 🪵${g.wood} wood | ${g.animals.length} animals`,
              choices: [{ id: "continue_night", emoji: "🌙", text: "Sleep and start a new day" }],
            });
          }
        } else {
          enterPhase({ ...g, phase: next as Phase });
        }
        return;
      }

      // Submit final score
      if (choiceId === "submit_score") {
        const score = calculateScore(g);
        try {
          const hs = parseInt(localStorage.getItem("homestead_highScore") || "0", 10);
          if (score > hs) localStorage.setItem("homestead_highScore", String(score));
        } catch {}
        onGameOver(score);
        return;
      }

      // Visit shop
      if (choiceId === "visit_shop") {
        update({ screen: "shop", narrative: "Old Mae looks up from behind the counter. \"What can I get you today, farmer?\"", choices: getShopChoices(g) });
        return;
      }

      // Leave shop
      if (choiceId === "leave_shop") {
        update({
          screen: "result",
          resultText: "You wave goodbye to Mae and head back to the farm.",
          choices: [{ id: "continue_result", emoji: "→", text: "Continue" }],
        });
        return;
      }

      // Shop purchases
      if (choiceId.startsWith("buy_seed_")) {
        const cropId = choiceId.replace("buy_seed_", "") as CropType;
        const d = CROP_DATA[cropId];
        if (g.gold >= d.cost && g.crops.length < g.gardenPlots) {
          const newState = {
            ...g,
            gold: g.gold - d.cost,
            crops: [...g.crops, { type: cropId, daysGrown: 0 }],
          };
          setGame({
            ...newState,
            screen: "shop",
            narrative: `\"${d.label} seeds — excellent choice!\" Mae wraps them in brown paper. You plant them right away.`,
            choices: getShopChoices(newState),
          });
        }
        return;
      }

      if (choiceId.startsWith("buy_animal_")) {
        const type = choiceId.replace("buy_animal_", "") as AnimalType;
        const d = ANIMAL_DATA[type];
        if (g.gold >= d.cost) {
          const name = getAnimalName(type, g.animals);
          const newState = {
            ...g,
            gold: g.gold - d.cost,
            animals: [...g.animals, { type, name }],
          };
          setGame({
            ...newState,
            screen: "shop",
            narrative: `Welcome to the family, ${name} the ${d.label}! ${type === "cat" ? "They immediately knock something off a shelf." : type === "goat" ? "They immediately try to eat your receipt." : "They seem happy in their new home."}`,
            choices: getShopChoices(newState),
          });
        }
        return;
      }

      // Build menu
      if (choiceId === "build_menu") {
        update({ screen: "build", narrative: "You survey the farm. What should you build?", choices: getBuildChoices(g) });
        return;
      }

      if (choiceId === "leave_build") {
        enterPhase(g);
        return;
      }

      if (choiceId.startsWith("build_")) {
        const key = choiceId.replace("build_", "") as BuildingType;
        const d = BUILDING_DATA[key];
        if (g.gold >= d.goldCost && g.wood >= d.woodCost) {
          const newState: GameState = {
            ...g,
            gold: g.gold - d.goldCost,
            wood: g.wood - d.woodCost,
            buildings: [...g.buildings, key],
            gardenPlots: key === "garden" ? g.gardenPlots + 4 : g.gardenPlots,
          };
          setGame({
            ...newState,
            screen: "result",
            resultText: `The ${d.label} is built! ${key === "coop" ? "The chickens inspect it suspiciously, then claim it as their own." : key === "barn" ? "It's not the prettiest barn, but it's YOUR barn." : key === "pavilion" ? "It's beautiful. You can already picture the celebration." : `${d.desc}`}\n\n-${d.goldCost}g, -${d.woodCost} wood`,
            choices: [{ id: "continue_result", emoji: "→", text: "Continue" }],
          });
        }
        return;
      }

      // Plant menu
      if (choiceId === "plant_menu") {
        update({ screen: "plant", narrative: `Your garden has ${g.gardenPlots - g.crops.length} empty plot${g.gardenPlots - g.crops.length !== 1 ? "s" : ""}. What would you like to plant?`, choices: getPlantChoices(g) });
        return;
      }

      if (choiceId === "leave_plant") {
        enterPhase(g);
        return;
      }

      if (choiceId.startsWith("plant_")) {
        const cropId = choiceId.replace("plant_", "") as CropType;
        const d = CROP_DATA[cropId];
        if (g.gold >= d.cost && g.crops.length < g.gardenPlots) {
          const newState: GameState = {
            ...g,
            gold: g.gold - d.cost,
            crops: [...g.crops, { type: cropId, daysGrown: 0 }],
          };
          setGame({
            ...newState,
            screen: "plant",
            narrative: `${d.emoji} ${d.label} planted! It'll be ready in ${d.growDays} days.\n\n${newState.gardenPlots - newState.crops.length} plots remaining.`,
            choices: getPlantChoices(newState),
          });
        }
        return;
      }

      // Sell goods
      if (choiceId === "sell_goods") {
        const val = invValue(g);
        const { state: newState, text } = applyChoice(choiceId, g);
        setGame({
          ...newState,
          screen: "result",
          resultText: text || `Sold goods for ${val}g!`,
          choices: [{ id: "continue_result", emoji: "→", text: "Continue" }],
        });
        return;
      }

      // Generic choice — apply effect and show result
      const { state: newState, text } = applyChoice(choiceId, g);
      setGame({
        ...newState,
        screen: "result",
        resultText: text,
        choices: [{ id: "continue_result", emoji: "→", text: "Continue" }],
      });
    },
    [enterPhase, onGameOver, update]
  );

  // ---- RENDER ----

  const { screen, narrative, choices, resultText, day, season, phase, grit, wisdom, charm, gold, wood, animals } = game;

  return (
    <div ref={containerRef} className="flex flex-col w-full" style={{ height: "calc(100dvh - 52px)" }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full shrink-0"
        style={{ height: 160, background: "#0D1F0F" }}
      />

      {/* Stats bar */}
      {screen !== "title" && (
        <div
          className="shrink-0 flex items-center justify-between px-3 py-1.5 text-xs font-mono"
          style={{ background: "#1D4420", color: "#FDF8F0", borderBottom: "1px solid #C49A3C33" }}
        >
          <span>
            Day {day} · {cap(season)} · {cap(phase)}
          </span>
          <span className="flex gap-2">
            <span title="Grit">🌿{grit}</span>
            <span title="Wisdom">📚{wisdom}</span>
            <span title="Charm">💛{charm}</span>
            <span title="Gold">💰{gold}</span>
            <span title="Wood">🪵{wood}</span>
            {animals.length > 0 && <span title="Animals">🐾{animals.length}</span>}
          </span>
        </div>
      )}

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ background: "linear-gradient(180deg, #0D1F0F 0%, #162618 100%)" }}
      >
        <div className="px-4 py-5 max-w-lg mx-auto">
          {/* Title Screen */}
          {screen === "title" && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🏡</div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "#C49A3C", fontFamily: "var(--font-cormorant-garamond), serif" }}
              >
                Brooker Homestead
              </h2>
              <p className="text-sm mb-6" style={{ color: "#FDF8F0CC" }}>
                Build your dream farm from scratch. Raise animals, grow crops, befriend neighbors, and host the ultimate celebration.
              </p>
              <p className="text-xs mb-8" style={{ color: "#FDF8F088" }}>
                15 days. 3 seasons. Your choices shape the farm.
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-xl text-base font-semibold transition-all active:scale-95"
                style={{
                  background: "#C49A3C",
                  color: "#1D4420",
                  minHeight: 48,
                }}
              >
                🌱 Start Homesteading
              </button>
            </div>
          )}

          {/* Narrative screens (dawn, phase, result, night, shop, build, plant, celebration) */}
          {screen !== "title" && screen !== "score" && (
            <>
              <div
                className="whitespace-pre-line leading-relaxed mb-5 text-sm"
                style={{ color: "#FDF8F0DD", fontFamily: "var(--font-cormorant-garamond), serif", fontSize: "15px", lineHeight: "1.7" }}
              >
                {screen === "result" ? resultText : narrative}
              </div>

              <div className="flex flex-col gap-2">
                {choices.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => !c.disabled && handleChoice(c.id)}
                    disabled={c.disabled}
                    className="text-left rounded-xl px-4 py-3 transition-all active:scale-[0.98]"
                    style={{
                      background: c.disabled ? "#1D442044" : "#1D4420CC",
                      border: c.disabled ? "1px solid #C49A3C11" : "1px solid #C49A3C33",
                      color: c.disabled ? "#FDF8F044" : "#FDF8F0",
                      minHeight: 48,
                      opacity: c.disabled ? 0.5 : 1,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg shrink-0 mt-0.5">{c.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{c.text}</div>
                        {c.subtext && (
                          <div className="text-xs mt-0.5" style={{ color: "#C49A3C99" }}>
                            {c.subtext}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
