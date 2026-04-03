"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ============================================================
// TYPES
// ============================================================

type Season = "spring" | "summer" | "fall";
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

interface PlacedAnimal {
  type: AnimalType;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  moveTimer: number;
  moveInterval: number;
  bounceTimer: number;
  lastSpeech: string;
  speechTimer: number;
  productTimer: number;
}

interface GroundItem {
  x: number;
  y: number;
  type: "coin" | "gem" | "seed" | "berry" | "star" | "product";
  value: number;
  emoji: string;
  sparklePhase: number;
}

interface Crop {
  type: CropType;
  growth: number;
  tileIdx: number;
}

interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface StoryNPC {
  id: string;
  emoji: string;
  x: number;
  y: number;
  collected: boolean;
}

interface WildNPC {
  id: string;
  emoji: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  moveTimer: number;
  interactCount: number;
  fleeTimer: number;
  active: boolean;
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
    stoneCost?: number;
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

// ============================================================
// QUEST SYSTEM
// ============================================================

interface Quest {
  id: string;
  text: string;
  hint: string;
  check: (g: Game) => boolean;
  reward?: { gold?: number; wood?: number; grit?: number; wisdom?: number; charm?: number };
  rewardText?: string;
}

const QUEST_CHAIN: Quest[] = [
  {
    id: "plant_first",
    text: "\uD83C\uDF31 Plant your first crop",
    hint: "Walk to the brown garden plots on the right and press action",
    check: (g) => g.crops.length > 0 || g.cropsHarvested > 0,
    reward: { gold: 5 },
    rewardText: "+5g",
  },
  {
    id: "chop_wood",
    text: "\uD83E\uDE93 Gather wood (0/5)",
    hint: "Walk up to trees along the edges and press action to chop",
    check: (g) => g.woodEverGathered >= 5,
    reward: { gold: 10 },
    rewardText: "+10g",
  },
  {
    id: "build_coop",
    text: "\uD83C\uDFDA\uFE0F Build a chicken coop",
    hint: "Face the yellow coop tiles and press action (costs 40g + 5 wood)",
    check: (g) => g.buildings.includes("coop"),
    reward: { charm: 2 },
    rewardText: "+2 charm",
  },
  {
    id: "visit_town",
    text: "\uD83C\uDFEA Visit the town shop",
    hint: "Follow the dirt path south, cross a bridge, head to the bottom-right",
    check: (g) => g.discoveredZones.has("\uD83C\uDFD8\uFE0F The Town"),
    reward: { gold: 15 },
    rewardText: "+15g",
  },
  {
    id: "buy_animal",
    text: "\uD83D\uDC04 Buy a large animal",
    hint: "Build a barn first, then buy a goat, cow, or pig at the shop",
    check: (g) => g.placedAnimals.some((a) => ["goat", "cow", "sheep", "pig", "donkey"].includes(a.type)),
    reward: { gold: 20 },
    rewardText: "+20g",
  },
  {
    id: "explore_forest",
    text: "\uD83C\uDF32 Explore the forest",
    hint: "Head north through the trees \u2014 there are paths between them",
    check: (g) => g.discoveredZones.has("\uD83C\uDF32 The Forest"),
    reward: { wisdom: 3 },
    rewardText: "+3 wisdom",
  },
  {
    id: "cross_river",
    text: "\uD83C\uDF09 Cross the river",
    hint: "Find a bridge \u2014 there are three across the river",
    check: (g) =>
      g.discoveredZones.has("\uD83C\uDF0A The River") &&
      (g.discoveredZones.has("\uD83C\uDF38 The Meadow") || g.discoveredZones.has("\uD83C\uDFD8\uFE0F The Town")),
    reward: { gold: 15 },
    rewardText: "+15g",
  },
  {
    id: "build_barn",
    text: "\uD83C\uDFD7\uFE0F Build a barn",
    hint: "Face the red barn tiles and press action (costs 80g + 8 wood)",
    check: (g) => g.buildings.includes("barn"),
    reward: { grit: 3 },
    rewardText: "+3 grit",
  },
  {
    id: "find_ruins",
    text: "\uD83C\uDFDB\uFE0F Discover the ancient ruins",
    hint: "Explore the southwest corner of the map, past the river",
    check: (g) => g.discoveredZones.has("\uD83C\uDFDB\uFE0F Ancient Ruins"),
    reward: { wisdom: 3, gold: 20 },
    rewardText: "+3 wisdom, +20g",
  },
  {
    id: "reach_mountain",
    text: "\u26F0\uFE0F Reach the mountain",
    hint: "The mountain path opens on Day 11. Head northeast.",
    check: (g) => g.discoveredZones.has("\u26F0\uFE0F Mountain Path"),
    reward: { grit: 3 },
    rewardText: "+3 grit",
  },
  {
    id: "build_pavilion",
    text: "\uD83C\uDFAA Build the Party Pavilion!",
    hint: "Use the barn's build menu. Costs 120g + 12 wood \u2014 the final building!",
    check: (g) => g.buildings.includes("pavilion"),
    reward: { charm: 5, gold: 50 },
    rewardText: "+5 charm, +50g",
  },
  {
    id: "celebration",
    text: "\uD83C\uDF89 Host the celebration!",
    hint: "The party happens at the end of Day 15. Keep building until then!",
    check: (g) => g.day > 15,
  },
];

function checkQuestProgress(g: Game) {
  if (g.questIndex >= QUEST_CHAIN.length) return;
  const quest = QUEST_CHAIN[g.questIndex];
  if (quest.check(g)) {
    g.completedQuests.push(quest.id);
    if (quest.reward) {
      if (quest.reward.gold) g.gold += quest.reward.gold;
      if (quest.reward.wood) g.wood += quest.reward.wood;
      if (quest.reward.grit) g.grit += quest.reward.grit;
      if (quest.reward.wisdom) g.wisdom += quest.reward.wisdom;
      if (quest.reward.charm) g.charm += quest.reward.charm;
    }
    g.showAchievement(`\u2705 ${quest.text}${quest.rewardText ? ` \u2014 ${quest.rewardText}` : ""}`);
    g.questIndex++;
    g.partyReadiness = Math.min(
      100,
      Math.floor((g.questIndex / QUEST_CHAIN.length) * 50) +
        g.buildings.length * 5 +
        g.placedAnimals.length * 2 +
        Math.floor(g.cropsHarvested / 2)
    );
  }
}

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

const ANIMAL_SPEECH: Record<AnimalType, string[]> = {
  chicken: ["Bawk!", "Cluck cluck!", "\uD83E\uDD5A!", "*pecks proudly*", "Buk-BAWK!"],
  duck: ["Quack!", "*splash*", "Quaaack~", "\uD83E\uDD86!"],
  goose: ["HONK!", "HONK HONK!", "*angry honking*", "*judges you*"],
  cat: ["Mrow.", "*purrs*", "*knocks thing off table*", "...", "*slow blink*"],
  dog: ["Woof!", "*tail wag*", "BARK!", "*happy spin*", "Arf! Arf!"],
  donkey: ["Hee-haw!", "*ear wiggle*", "...*stares*", "*nuzzle*"],
  goat: ["Baaaa!", "*headbutt*", "*eats your shirt*", "BAAAAH!", "*climbs on thing*"],
  sheep: ["Baaaa~", "*fluffy*", "Baa.", "*wool intensifies*"],
  cow: ["Mooo~", "*chewing*", "Moooo?", "*big eyes*"],
  pig: ["Oink!", "*snuffle snuffle*", "Oink oink!", "*happy mud roll*"],
};

// ============================================================
// TILE MAP (40 cols x 30 rows)
// 0=grass, 1=tree, 2=dirt_path, 3=water, 4=fence, 5=house_wall
// 6=house_door, 7=garden, 8=coop, 9=barn_tile, 10=flower, 11=rock_decor, 12=shop
// 13=stone (clearable), 14=bridge, 15=sand, 16=ruin_wall, 17=cave, 18=special_interact
// ============================================================

const MAP_COLS = 40;
const MAP_ROWS = 30;

// prettier-ignore
let TILE_MAP: number[] = [
// col:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39
  /* r0 */ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  /* r1 */ 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0,18, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1,13,13,13,13, 1, 1, 1, 1,
  /* r2 */ 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1,13,13, 0,13, 0,13, 1, 1, 1,
  /* r3 */ 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0,18, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 1,13, 0, 0, 2, 0, 0, 0,13, 1, 1,
  /* r4 */ 1, 0, 0, 0,18, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 1,13, 0, 0, 2, 0, 0, 0,13, 1, 1,
  /* r5 */ 1, 1, 0, 0, 0, 0, 0, 0, 0,18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 1,13, 0, 0, 2, 0, 0,13, 1, 1, 1,
  /* r6 */ 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0,13, 0, 2, 2, 0, 0,13, 1, 1, 1,
  /* r7 */ 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0,17, 1, 1, 1, 1,
  /* r8 */ 1, 1, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 2, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,13, 0,13, 1, 1, 1, 1,
  /* r9 */ 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 6, 2, 2, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0,10, 0, 0, 0, 2, 0,18, 0, 1, 1, 1, 1,
  /*r10 */ 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 2, 0, 0, 7, 7, 7, 7, 0, 0, 8, 8, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 1, 1,
  /*r11 */ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 0, 9, 9, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1,
  /*r12 */ 1, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 2, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 0, 0,10, 0, 2, 0, 0, 0,18, 0, 0, 1,
  /*r13 */ 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1,
  /*r14 */ 3, 3, 3, 3, 3, 3, 3, 4, 0, 0, 0, 4, 3, 3,14, 3, 4, 3, 3, 3, 3,14, 3, 3, 3, 3, 3, 3, 3, 3,14, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  /*r15 */ 3, 3, 3, 3, 3, 3, 3, 4, 0, 0, 0, 4, 3, 3,14, 3, 4, 3, 3, 3, 3,14, 3, 3, 3,18, 3, 3, 3, 3,14, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  /*r16 */ 1, 0,10, 0, 0, 0, 0, 4, 4, 0, 4, 4, 0, 0,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  /*r17 */ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0,10, 0,18, 0, 0, 1,
  /*r18 */ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,10, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  /*r19 */16, 0,16, 0, 0, 0, 0, 0, 0, 0, 0,10, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0,18, 0, 0, 0, 0, 0, 0, 1,
  /*r20 */16, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  /*r21 */16,18, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  /*r22 */16, 0,16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  /*r23 */ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  /*r24 */ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  /*r25 */ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0,16, 0, 0, 0,16, 0, 0, 0, 0,12,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  /*r26 */ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,18, 0,18, 0, 0, 5, 5, 5, 5, 5, 0,16,18,16, 0, 0, 0, 0, 0, 0, 0, 1,
  /*r27 */ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 5, 5, 5, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  /*r28 */ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
  /* r29*/ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

const WALKABLE_TILES = new Set([0, 2, 6, 7, 10, 14, 15, 18]);

// ============================================================
// SPECIAL INTERACTION SPOTS (tile type 18)
// keyed by row * MAP_COLS + col
// ============================================================

type SpecialType =
  | "fairy_ring"
  | "old_well"
  | "mushroom"
  | "fountain"
  | "library"
  | "blacksmith"
  | "notice_board"
  | "beehive"
  | "picnic"
  | "summit"
  | "fishing"
  | "treasure_chest"
  | "inscription"
  | "wild_horse_spot"
  | "meadow_honey";

const SPECIAL_SPOTS: Record<number, { type: SpecialType; prompt: string }> = {
  // Forest
  [4 * MAP_COLS + 4]: { type: "fairy_ring", prompt: "✨ Fairy Ring" },
  [1 * MAP_COLS + 12]: { type: "old_well", prompt: "🪣 Old Well" },
  [3 * MAP_COLS + 13]: { type: "mushroom", prompt: "🍄 Mushrooms" },
  [5 * MAP_COLS + 9]: { type: "mushroom", prompt: "🍄 Mushrooms" },

  // Town (bottom area)
  [26 * MAP_COLS + 18]: { type: "fountain", prompt: "⛲ Fountain" },
  [26 * MAP_COLS + 20]: { type: "notice_board", prompt: "📋 Notice Board" },
  [30 * MAP_COLS + 30]: { type: "blacksmith", prompt: "⚒️ Blacksmith" },

  // River fishing spots
  [15 * MAP_COLS + 25]: { type: "fishing", prompt: "🎣 Fish!" },

  // Meadow (right side)
  [17 * MAP_COLS + 36]: { type: "beehive", prompt: "🐝 Beehive" },
  [12 * MAP_COLS + 36]: { type: "picnic", prompt: "🧺 Picnic Spot" },
  [19 * MAP_COLS + 32]: { type: "meadow_honey", prompt: "🍯 Honey" },

  // Mountain
  [9 * MAP_COLS + 34]: { type: "summit", prompt: "🏔️ Summit View" },

  // Ruins (bottom-left)
  [21 * MAP_COLS + 1]: { type: "treasure_chest", prompt: "💎 Treasure!" },
};

// Ruin wall inscriptions (tile 16)
const INSCRIPTION_COORDS = new Set([
  19 * MAP_COLS + 0,
  19 * MAP_COLS + 2,
  20 * MAP_COLS + 0,
  22 * MAP_COLS + 0,
  22 * MAP_COLS + 2,
  29 * MAP_COLS + 16,
  25 * MAP_COLS + 17,
  25 * MAP_COLS + 21,
]);

// Library / blacksmith building tiles (certain town building walls)
const LIBRARY_TILES = new Set([
  26 * MAP_COLS + 23,
  26 * MAP_COLS + 24,
  26 * MAP_COLS + 25,
  27 * MAP_COLS + 23,
  27 * MAP_COLS + 24,
  27 * MAP_COLS + 25,
  28 * MAP_COLS + 23,
  28 * MAP_COLS + 24,
  28 * MAP_COLS + 25,
]);

const BLACKSMITH_TILES = new Set([
  26 * MAP_COLS + 29,
  26 * MAP_COLS + 31,
]);

// ============================================================
// HELPERS
// ============================================================

function tileAt(col: number, row: number): number {
  if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return 1;
  return TILE_MAP[row * MAP_COLS + col];
}

function isWalkable(col: number, row: number): boolean {
  return WALKABLE_TILES.has(tileAt(col, row));
}

function getGardenTileIndices(): number[] {
  const indices: number[] = [];
  for (let i = 0; i < TILE_MAP.length; i++) {
    if (TILE_MAP[i] === 7) indices.push(i);
  }
  return indices;
}

function getSeason(day: number): Season {
  if (day <= 5) return "spring";
  if (day <= 10) return "summer";
  return "fall";
}

function getAnimalName(type: AnimalType, existing: PlacedAnimal[]): string {
  const used = new Set(existing.filter((a) => a.type === type).map((a) => a.name));
  const available = ANIMAL_NAMES[type].filter((n) => !used.has(n));
  return available[0] || `${ANIMAL_DATA[type].label} #${used.size + 1}`;
}

function countPoultry(animals: PlacedAnimal[]): number {
  return animals.filter((a) => ["chicken", "duck", "goose"].includes(a.type)).length;
}

function countLarge(animals: PlacedAnimal[]): number {
  return animals.filter((a) => ["cow", "goat", "sheep", "pig", "donkey"].includes(a.type)).length;
}

function seededRand(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263 + 1013904223) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

// ============================================================
// FAIRY MESSAGES & BOOK TITLES & LORE
// ============================================================

const FAIRY_MESSAGES = [
  "The fairies whisper: 'Love grows like wildflowers.'",
  "A tiny voice says: 'The mountain holds secrets...'",
  "Fairy dust settles: 'Kindness is the rarest treasure.'",
  "The ring hums: 'Visit us again, friend.'",
  "A giggle echoes: 'Have you found the old ruins?'",
  "Petals swirl: 'The river knows all the songs.'",
];

const BOOK_TITLES = [
  "You read 'Goats: A Memoir' — fascinating!",
  "You browse 'The Art of Beekeeping'",
  "You study 'Mountain Flora & Fauna'",
  "You skim '101 Uses for Pumpkins'",
  "You peruse 'History of the Old Ruins'",
  "You read 'Fairy Rings: Fact or Fiction?'",
  "You enjoy 'A Dog's Guide to Farm Life'",
  "You devour 'Cooking with Honey'",
];

const LORE_TEXTS = [
  "Ancient text: 'Here once stood a great hall of feasting...'",
  "Worn inscription: 'Those who tend the land shall prosper.'",
  "Faded runes: 'The forest remembers what we forget.'",
  "Carved words: 'In every seed, a universe of possibility.'",
  "Mossy text: 'The builders came from beyond the mountain...'",
  "Chiseled line: 'Love is the foundation of all great things.'",
];

const NOTICE_BOARD_TIPS = [
  "Try fishing at the river — fresh catch sells well!",
  "The blacksmith can upgrade your tools for a price.",
  "Have you explored the ruins to the southwest?",
  "Build the pavilion for bonus celebration score!",
  "The fairy ring in the forest grants charm...",
  "Mountain stone is needed for advanced buildings.",
  "Honey from the meadow beehives is valuable!",
  "Visit the library to gain wisdom!",
];

// ============================================================
// SEASON COLORS
// ============================================================

const SEASON_PALETTE: Record<Season, {
  grass: string;
  grassLight: string;
  tree: string;
  treeTrunk: string;
}> = {
  spring: {
    grass: "#5C8A4A",
    grassLight: "#6B9B58",
    tree: "#3D7A3D",
    treeTrunk: "#5C3A1E",
  },
  summer: {
    grass: "#3E6B2A",
    grassLight: "#4A7A35",
    tree: "#1E5A1E",
    treeTrunk: "#5C3A1E",
  },
  fall: {
    grass: "#8B7D3C",
    grassLight: "#9A8C4A",
    tree: "#B8860B",
    treeTrunk: "#5C3A1E",
  },
};

// ============================================================
// ZONE DEFINITIONS (for discovery tracking)
// ============================================================

type ZoneName = "farm" | "forest" | "town" | "river" | "meadow" | "mountain" | "ruins";

const ZONE_BOUNDS: Record<ZoneName, { minC: number; maxC: number; minR: number; maxR: number }> = {
  farm: { minC: 7, maxC: 28, minR: 8, maxR: 13 },
  forest: { minC: 1, maxC: 24, minR: 0, maxR: 7 },
  town: { minC: 12, maxC: 32, minR: 23, maxR: 28 },
  river: { minC: 0, maxC: 39, minR: 14, maxR: 15 },
  meadow: { minC: 29, maxC: 38, minR: 10, maxR: 22 },
  mountain: { minC: 30, maxC: 38, minR: 0, maxR: 10 },
  ruins: { minC: 0, maxC: 8, minR: 19, maxR: 24 },
};

function getZone(col: number, row: number): ZoneName | null {
  for (const [name, b] of Object.entries(ZONE_BOUNDS)) {
    if (col >= b.minC && col <= b.maxC && row >= b.minR && row <= b.maxR) {
      return name as ZoneName;
    }
  }
  return null;
}

// ============================================================
// GAME CLASS
// ============================================================

class Game {
  px: number;
  py: number;
  facing: number;
  walkFrame: number;

  day: number;
  season: Season;
  timeOfDay: number;
  grit: number;
  wisdom: number;
  charm: number;
  gold: number;
  wood: number;
  stone: number;
  fish: number;
  honey: number;

  placedAnimals: PlacedAnimal[];
  crops: Crop[];
  buildings: BuildingType[];
  seeds: CropType[];
  cropsHarvested: number;

  floats: FloatText[];
  particles: Particle[];
  storyNPCs: StoryNPC[];
  wildNPCs: WildNPC[];

  actionPrompt: string | null;
  actionTargetX: number;
  actionTargetY: number;
  nightFade: number;
  nightPhase: "none" | "fading_out" | "processing" | "fading_in" | "dawn_text";
  dawnTimer: number;
  gameOver: boolean;
  showShop: boolean;
  showBuild: boolean;
  showScore: boolean;
  celebrationScore: number;

  groundItems: GroundItem[];
  achievementText: string;
  achievementTimer: number;
  currentZone: string;
  discoveredZones: Set<string>;

  usedEvents: Set<string>;
  lastActionKey: boolean;
  started: boolean;

  // Exploration tracking
  visited: Set<number>;
  revealed: Set<number>;
  zonesVisited: Set<ZoneName>;
  treasuresFound: number;
  fishCaught: number;
  honeyCollected: number;
  libraryVisits: number;
  fairyRingVisits: number;
  toolsUpgraded: boolean;
  mountainAccessible: boolean;
  ruinTreasureFound: boolean;
  caveTreasureFound: boolean;
  wildHorseInteracts: number;
  wildGoatInteracts: number;

  questIndex: number;
  completedQuests: string[];
  partyReadiness: number;
  woodEverGathered: number;

  constructor() {
    this.px = 13.5;
    this.py = 9.5;
    this.facing = 2;
    this.walkFrame = 0;

    this.day = 1;
    this.season = "spring";
    this.timeOfDay = 0;
    this.grit = 0;
    this.wisdom = 0;
    this.charm = 0;
    this.gold = 50;
    this.wood = 0;
    this.stone = 0;
    this.fish = 0;
    this.honey = 0;

    this.placedAnimals = [
      this.makeAnimal("chicken", "Henrietta", 9.5, 14),
      this.makeAnimal("chicken", "Cluck Norris", 9, 13.5),
      this.makeAnimal("chicken", "Eggatha", 10, 14.5),
    ];
    this.crops = [];
    this.buildings = [];
    this.seeds = ["lettuce", "lettuce", "lettuce", "lettuce", "herbs", "herbs", "herbs", "herbs"];
    this.cropsHarvested = 0;

    this.floats = [];
    this.particles = [];
    this.storyNPCs = [];
    this.wildNPCs = [];

    this.actionPrompt = null;
    this.actionTargetX = 0;
    this.actionTargetY = 0;
    this.nightFade = 0;
    this.nightPhase = "none";
    this.dawnTimer = 0;
    this.gameOver = false;
    this.showShop = false;
    this.showBuild = false;
    this.showScore = false;
    this.celebrationScore = 0;

    this.groundItems = [];
    this.spawnGroundItems(15);
    this.achievementText = "";
    this.achievementTimer = 0;
    this.currentZone = "";
    this.discoveredZones = new Set();

    this.usedEvents = new Set();
    this.lastActionKey = false;
    this.started = false;

    this.visited = new Set();
    this.revealed = new Set();
    this.zonesVisited = new Set();
    this.treasuresFound = 0;
    this.fishCaught = 0;
    this.honeyCollected = 0;
    this.libraryVisits = 0;
    this.fairyRingVisits = 0;
    this.toolsUpgraded = false;
    this.mountainAccessible = false;
    this.ruinTreasureFound = false;
    this.caveTreasureFound = false;
    this.wildHorseInteracts = 0;
    this.wildGoatInteracts = 0;

    this.questIndex = 0;
    this.completedQuests = [];
    this.partyReadiness = 0;
    this.woodEverGathered = 0;
  }

  makeAnimal(type: AnimalType, name: string, x: number, y: number): PlacedAnimal {
    return {
      type, name, x, y,
      targetX: x, targetY: y,
      moveTimer: 0, moveInterval: 2 + Math.random() * 3,
      bounceTimer: 0, lastSpeech: "", speechTimer: 0,
      productTimer: 8 + Math.random() * 12,
    };
  }

  addFloat(x: number, y: number, text: string, color: string) {
    this.floats.push({ x, y, text, color, life: 1 });
  }

  addParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 0.6 + Math.random() * 0.4,
        color,
        size: 2 + Math.random() * 2,
      });
    }
  }

  spawnGroundItems(count: number) {
    const types = [
      { type: "coin", emoji: "\uD83E\uDE99", value: 3, weight: 5 },
      { type: "gem", emoji: "\uD83D\uDC8E", value: 10, weight: 1 },
      { type: "seed", emoji: "\uD83C\uDF30", value: 0, weight: 3 },
      { type: "berry", emoji: "\uD83E\uDED0", value: 5, weight: 3 },
      { type: "star", emoji: "\u2B50", value: 0, weight: 2 },
    ];
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      while (attempts < 50) {
        const col = 2 + Math.floor(Math.random() * (MAP_COLS - 4));
        const row = 2 + Math.floor(Math.random() * (MAP_ROWS - 4));
        if (isWalkable(col, row) && tileAt(col, row) === 0) {
          const totalWeight = types.reduce((s, t) => s + t.weight, 0);
          let r = Math.random() * totalWeight;
          let picked = types[0];
          for (const t of types) {
            r -= t.weight;
            if (r <= 0) { picked = t; break; }
          }
          this.groundItems.push({
            x: col + 0.2 + Math.random() * 0.6,
            y: row + 0.2 + Math.random() * 0.6,
            type: picked.type as GroundItem["type"],
            emoji: picked.emoji,
            value: picked.value,
            sparklePhase: Math.random() * Math.PI * 2,
          });
          break;
        }
        attempts++;
      }
    }
  }

  showAchievement(text: string) {
    this.achievementText = text;
    this.achievementTimer = 3.0;
  }

  updateVisited() {
    const col = Math.round(this.px);
    const row = Math.round(this.py);
    const visitRadius = 6;
    const revealRadius = 8;
    let changed = false;
    for (let r = row - visitRadius; r <= row + visitRadius; r++) {
      for (let c = col - visitRadius; c <= col + visitRadius; c++) {
        if (c >= 0 && c < MAP_COLS && r >= 0 && r < MAP_ROWS) {
          const dx = c - col;
          const dy = r - row;
          if (dx * dx + dy * dy <= visitRadius * visitRadius) {
            const idx = r * MAP_COLS + c;
            if (!this.visited.has(idx)) {
              this.visited.add(idx);
              changed = true;
            }
          }
        }
      }
    }
    if (changed) {
      for (let r = row - revealRadius; r <= row + revealRadius; r++) {
        for (let c = col - revealRadius; c <= col + revealRadius; c++) {
          if (c >= 0 && c < MAP_COLS && r >= 0 && r < MAP_ROWS) {
            this.revealed.add(r * MAP_COLS + c);
          }
        }
      }
    }
    const zone = getZone(col, row);
    if (zone) this.zonesVisited.add(zone);
  }

  isRevealed(c: number, r: number): boolean {
    return this.revealed.has(r * MAP_COLS + c);
  }

  getFacingTile(): { col: number; row: number; tile: number } {
    const col = Math.round(this.px);
    const row = Math.round(this.py);
    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];
    const tc = col + dx[this.facing];
    const tr = row + dy[this.facing];
    return { col: tc, row: tr, tile: tileAt(tc, tr) };
  }

  findNearbyTile(targetTile: number | number[]): { col: number; row: number; tile: number } | null {
    const targets = Array.isArray(targetTile) ? targetTile : [targetTile];
    const col = Math.round(this.px);
    const row = Math.round(this.py);

    const standing = tileAt(col, row);
    if (targets.includes(standing)) return { col, row, tile: standing };

    const facingDx = [0, 1, 0, -1];
    const facingDy = [-1, 0, 1, 0];
    const fc = col + facingDx[this.facing];
    const fr = row + facingDy[this.facing];
    const facedTile = tileAt(fc, fr);
    if (targets.includes(facedTile)) return { col: fc, row: fr, tile: facedTile };

    const offsets = [
      [0, -1], [1, 0], [0, 1], [-1, 0],
      [-1, -1], [1, -1], [-1, 1], [1, 1],
    ];
    for (const [ox, oy] of offsets) {
      const nc = col + ox;
      const nr = row + oy;
      if (nc === fc && nr === fr) continue;
      const t = tileAt(nc, nr);
      if (targets.includes(t)) return { col: nc, row: nr, tile: t };
    }
    return null;
  }

  findNearAnimal(): PlacedAnimal | null {
    let best: PlacedAnimal | null = null;
    let bestDist = 2.0;
    for (const a of this.placedAnimals) {
      const dx = a.x - this.px;
      const dy = a.y - this.py;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestDist) { bestDist = d; best = a; }
    }
    return best;
  }

  findNearNPC(): StoryNPC | null {
    for (const n of this.storyNPCs) {
      if (n.collected) continue;
      const dx = n.x - this.px;
      const dy = n.y - this.py;
      if (Math.sqrt(dx * dx + dy * dy) < 1.8) return n;
    }
    return null;
  }

  findNearWildNPC(): WildNPC | null {
    for (const w of this.wildNPCs) {
      if (!w.active) continue;
      if (w.fleeTimer > 0) continue;
      const dx = w.x - this.px;
      const dy = w.y - this.py;
      if (Math.sqrt(dx * dx + dy * dy) < 2.0) return w;
    }
    return null;
  }

  calculateScore(): number {
    let score = 0;
    for (const a of this.placedAnimals) score += ANIMAL_DATA[a.type].scoreValue;
    for (const b of this.buildings) score += BUILDING_DATA[b].scoreValue;
    score += this.cropsHarvested * 5;
    score += (this.grit + this.wisdom + this.charm) * 2;
    score += Math.floor(this.gold / 5);

    // Original achievements
    if (countPoultry(this.placedAnimals) >= 6) score += 25;
    if (countLarge(this.placedAnimals) >= 4) score += 25;
    if (this.cropsHarvested >= 10) score += 25;
    if (this.buildings.length >= 4) score += 25;
    if (this.charm >= 30) score += 25;
    if (this.grit >= 30) score += 25;
    if (this.wisdom >= 30) score += 25;
    if (this.placedAnimals.some((a) => a.type === "cat")) score += 25;
    if (this.placedAnimals.length >= 8) score += 25;
    if (this.buildings.includes("pavilion")) score += 50;

    // New achievements
    if (this.zonesVisited.size >= 7) score += 25;
    if (this.treasuresFound >= 3) score += 25;
    if (this.fishCaught >= 10) score += 25;
    if (this.honeyCollected >= 5) score += 25;
    if (this.zonesVisited.has("mountain")) score += 25;
    if (this.libraryVisits >= 5 && this.wisdom >= 20) score += 25;
    if (this.toolsUpgraded) score += 25;
    if (this.fairyRingVisits >= 3) score += 25;

    // Quest & party readiness bonus
    score += this.completedQuests.length * 5;
    if (this.partyReadiness >= 80) score += 50;
    else if (this.partyReadiness >= 50) score += 25;

    return score;
  }
}

// ============================================================
// RENDERING FUNCTIONS
// ============================================================

function drawTile(
  ctx: CanvasRenderingContext2D,
  tile: number,
  col: number,
  row: number,
  season: Season,
  ts: number,
  time: number,
  camX: number,
  camY: number,
  buildings: BuildingType[]
) {
  const px = col * ts - camX;
  const py = row * ts - camY;
  const pal = SEASON_PALETTE[season];

  switch (tile) {
    case 0: {
      ctx.fillStyle = (col + row) % 2 === 0 ? pal.grass : pal.grassLight;
      ctx.fillRect(px, py, ts, ts);
      const r = seededRand(col, row);
      if (r < 0.3) {
        ctx.fillStyle = season === "fall" ? "#8B7D3C88" : "#2D5A2D88";
        const gx = r * ts * 0.6 + ts * 0.1;
        const gy = (seededRand(col + 50, row + 50)) * ts * 0.5 + ts * 0.2;
        ctx.fillRect(px + gx, py + gy, ts * 0.06, ts * 0.18);
        ctx.fillRect(px + gx + ts * 0.35, py + gy - ts * 0.1, ts * 0.06, ts * 0.14);
      }
      if (season === "spring" && seededRand(col + 100, row) < 0.12) {
        const fx = seededRand(col + 200, row) * ts * 0.7 + ts * 0.15;
        const fy = seededRand(col, row + 200) * ts * 0.7 + ts * 0.15;
        const colors = ["#FFB6C1", "#FFD700", "#DDA0DD", "#FF6B6B"];
        ctx.fillStyle = colors[(col * 3 + row * 7) % colors.length];
        ctx.beginPath();
        ctx.arc(px + fx, py + fy, ts * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 1: {
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = pal.treeTrunk;
      ctx.fillRect(px + ts * 0.38, py + ts * 0.5, ts * 0.24, ts * 0.5);
      ctx.fillStyle = pal.tree;
      ctx.beginPath();
      ctx.arc(px + ts * 0.5, py + ts * 0.38, ts * 0.42, 0, Math.PI * 2);
      ctx.fill();
      if (season === "spring") {
        ctx.fillStyle = "#FFB6C155";
        ctx.beginPath();
        ctx.arc(px + ts * 0.3, py + ts * 0.25, ts * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
      if (season === "fall") {
        const leafOff = Math.sin(time * 0.001 + col * 3 + row) * ts * 0.1;
        ctx.fillStyle = "#D2691E";
        ctx.fillRect(px + ts * 0.25 + leafOff, py + ts * 0.12, ts * 0.1, ts * 0.06);
      }
      break;
    }
    case 2: {
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#7A6B4A";
      ctx.fillRect(px + ts * 0.12, py + ts * 0.12, ts * 0.1, ts * 0.1);
      ctx.fillRect(px + ts * 0.62, py + ts * 0.56, ts * 0.12, ts * 0.1);
      break;
    }
    case 3: {
      ctx.fillStyle = "#3A7ABB";
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#4A8ACC";
      const shimmer = Math.sin(time * 0.003 + col * 2 + row) * 0.5 + 0.5;
      ctx.globalAlpha = shimmer * 0.4;
      ctx.fillRect(px + ts * 0.12, py + ts * 0.25, ts * 0.75, ts * 0.1);
      ctx.fillRect(px + ts * 0.25, py + ts * 0.62, ts * 0.5, ts * 0.06);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#FFFFFF";
      ctx.globalAlpha = shimmer * 0.3;
      ctx.fillRect(px + ts * 0.4, py + ts * 0.15, ts * 0.2, ts * 0.04);
      ctx.globalAlpha = 1;
      break;
    }
    case 4: {
      ctx.fillStyle = (col + row) % 2 === 0 ? pal.grass : pal.grassLight;
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py + ts * 0.31, ts, ts * 0.12);
      ctx.fillRect(px, py + ts * 0.68, ts, ts * 0.12);
      ctx.fillRect(px + ts * 0.12, py + ts * 0.12, ts * 0.12, ts * 0.75);
      ctx.fillRect(px + ts * 0.75, py + ts * 0.12, ts * 0.12, ts * 0.75);
      break;
    }
    case 5: {
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#7A6544";
      ctx.fillRect(px, py, ts, ts * 0.06);
      ctx.fillRect(px, py, ts * 0.06, ts);
      if ((col + row) % 3 === 0) {
        ctx.fillStyle = "#FFD70088";
        ctx.fillRect(px + ts * 0.3, py + ts * 0.3, ts * 0.38, ts * 0.38);
        ctx.fillStyle = "#5C3A1E";
        ctx.fillRect(px + ts * 0.48, py + ts * 0.3, ts * 0.06, ts * 0.38);
        ctx.fillRect(px + ts * 0.3, py + ts * 0.48, ts * 0.38, ts * 0.06);
      }
      break;
    }
    case 6: {
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#5C3A1E";
      ctx.fillRect(px + ts * 0.25, py + ts * 0.06, ts * 0.5, ts * 0.88);
      ctx.fillStyle = "#C49A3C";
      ctx.fillRect(px + ts * 0.62, py + ts * 0.44, ts * 0.1, ts * 0.1);
      break;
    }
    case 7: {
      ctx.fillStyle = "#5C4033";
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#4A3328";
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(px + ts * 0.06, py + i * ts * 0.25 + ts * 0.06, ts * 0.88, ts * 0.06);
      }
      break;
    }
    case 8: {
      const hasCoop = buildings.includes("coop");
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, ts, ts);
      if (hasCoop) {
        ctx.fillStyle = "#C4A25A";
        ctx.fillRect(px + ts * 0.06, py + ts * 0.25, ts * 0.88, ts * 0.69);
        ctx.fillStyle = "#8B6914";
        ctx.beginPath();
        ctx.moveTo(px, py + ts * 0.25);
        ctx.lineTo(px + ts * 0.5, py);
        ctx.lineTo(px + ts, py + ts * 0.25);
        ctx.fill();
      } else {
        ctx.fillStyle = "#99887766";
        ctx.fillRect(px + ts * 0.1, py + ts * 0.7, ts * 0.8, ts * 0.2);
        ctx.fillStyle = "#66554444";
        ctx.fillRect(px + ts * 0.15, py + ts * 0.75, ts * 0.7, ts * 0.1);
      }
      break;
    }
    case 9: {
      const hasBarn = buildings.includes("barn");
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, ts, ts);
      if (hasBarn) {
        ctx.fillStyle = "#8B3A3A";
        ctx.fillRect(px + ts * 0.06, py + ts * 0.19, ts * 0.88, ts * 0.75);
        ctx.fillStyle = "#6B2A2A";
        ctx.beginPath();
        ctx.moveTo(px, py + ts * 0.19);
        ctx.lineTo(px + ts * 0.5, py - ts * 0.12);
        ctx.lineTo(px + ts, py + ts * 0.19);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF33";
        ctx.fillRect(px + ts * 0.31, py + ts * 0.5, ts * 0.38, ts * 0.44);
        ctx.strokeStyle = "#FFFFFF22";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + ts * 0.31, py + ts * 0.5);
        ctx.lineTo(px + ts * 0.69, py + ts * 0.94);
        ctx.moveTo(px + ts * 0.69, py + ts * 0.5);
        ctx.lineTo(px + ts * 0.31, py + ts * 0.94);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#99887766";
        ctx.fillRect(px + ts * 0.1, py + ts * 0.7, ts * 0.8, ts * 0.2);
      }
      break;
    }
    case 10: {
      ctx.fillStyle = (col + row) % 2 === 0 ? pal.grass : pal.grassLight;
      ctx.fillRect(px, py, ts, ts);
      const colors = ["#FFB6C1", "#FFD700", "#DDA0DD", "#FF6B6B"];
      const c = colors[(col + row) % colors.length];
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(px + ts * 0.31, py + ts * 0.31, ts * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + ts * 0.69, py + ts * 0.62, ts * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(px + ts * 0.29, py + ts * 0.44, ts * 0.06, ts * 0.31);
      ctx.fillRect(px + ts * 0.67, py + ts * 0.72, ts * 0.06, ts * 0.22);
      break;
    }
    case 12: {
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#C49A3C";
      ctx.fillRect(px + ts * 0.12, py, ts * 0.75, ts * 0.12);
      ctx.font = `${Math.max(10, ts * 0.3)}px sans-serif`;
      ctx.fillStyle = "#FDF8F0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SHOP", px + ts * 0.5, py + ts * 0.62);
      break;
    }
    case 13: {
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#666666";
      ctx.beginPath();
      ctx.moveTo(px + ts * 0.1, py + ts * 0.9);
      ctx.lineTo(px + ts * 0.3, py + ts * 0.15);
      ctx.lineTo(px + ts * 0.7, py + ts * 0.1);
      ctx.lineTo(px + ts * 0.9, py + ts * 0.4);
      ctx.lineTo(px + ts * 0.85, py + ts * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#888888";
      ctx.fillRect(px + ts * 0.35, py + ts * 0.25, ts * 0.12, ts * 0.08);
      ctx.fillRect(px + ts * 0.55, py + ts * 0.5, ts * 0.1, ts * 0.06);
      ctx.fillRect(px + ts * 0.25, py + ts * 0.6, ts * 0.08, ts * 0.08);
      break;
    }
    case 14: {
      ctx.fillStyle = "#3A7ABB";
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(px + ts * 0.05, py + ts * 0.1, ts * 0.9, ts * 0.8);
      ctx.fillStyle = "#A37B1E";
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(px + ts * 0.08, py + ts * (0.15 + i * 0.16), ts * 0.84, ts * 0.06);
      }
      ctx.fillStyle = "#5C3A1E";
      ctx.fillRect(px + ts * 0.05, py + ts * 0.1, ts * 0.06, ts * 0.8);
      ctx.fillRect(px + ts * 0.89, py + ts * 0.1, ts * 0.06, ts * 0.8);
      break;
    }
    case 15: {
      ctx.fillStyle = "#D4B896";
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#C8AA85";
      const sx1 = seededRand(col + 300, row) * ts * 0.6 + ts * 0.1;
      const sy1 = seededRand(col, row + 300) * ts * 0.6 + ts * 0.1;
      ctx.fillRect(px + sx1, py + sy1, ts * 0.08, ts * 0.08);
      break;
    }
    case 16: {
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#6B7B6B";
      ctx.fillRect(px + ts * 0.05, py + ts * 0.05, ts * 0.9, ts * 0.9);
      ctx.fillStyle = "#5A6B5A";
      ctx.fillRect(px + ts * 0.1, py + ts * 0.1, ts * 0.38, ts * 0.38);
      ctx.fillRect(px + ts * 0.52, py + ts * 0.52, ts * 0.38, ts * 0.38);
      ctx.fillStyle = "#4A8B4A44";
      ctx.fillRect(px + ts * 0.2, py + ts * 0.7, ts * 0.15, ts * 0.2);
      ctx.fillRect(px + ts * 0.6, py + ts * 0.1, ts * 0.2, ts * 0.15);
      break;
    }
    case 17: {
      ctx.fillStyle = "#666666";
      ctx.fillRect(px, py, ts, ts);
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(px + ts * 0.5, py + ts * 0.6, ts * 0.35, Math.PI, 0);
      ctx.lineTo(px + ts * 0.85, py + ts * 0.95);
      ctx.lineTo(px + ts * 0.15, py + ts * 0.95);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#0d0d0d";
      ctx.beginPath();
      ctx.arc(px + ts * 0.5, py + ts * 0.65, ts * 0.25, Math.PI, 0);
      ctx.lineTo(px + ts * 0.75, py + ts * 0.9);
      ctx.lineTo(px + ts * 0.25, py + ts * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#55555544";
      const flicker = Math.sin(time * 0.005 + col) * 0.2 + 0.3;
      ctx.globalAlpha = flicker;
      ctx.beginPath();
      ctx.arc(px + ts * 0.5, py + ts * 0.7, ts * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case 18: {
      ctx.fillStyle = (col + row) % 2 === 0 ? pal.grass : pal.grassLight;
      ctx.fillRect(px, py, ts, ts);
      const idx = row * MAP_COLS + col;
      const spot = SPECIAL_SPOTS[idx];
      if (spot) {
        const sparkle = Math.sin(time * 0.004 + col * 5 + row * 3) * 0.3 + 0.5;
        ctx.globalAlpha = sparkle;
        ctx.fillStyle = "#FFD70033";
        ctx.beginPath();
        ctx.arc(px + ts * 0.5, py + ts * 0.5, ts * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      break;
    }
    default: {
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, ts, ts);
    }
  }
}

function drawFogOverlay(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  ts: number,
  camX: number,
  camY: number
) {
  const px = col * ts - camX;
  const py = row * ts - camY;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(px, py, ts, ts);
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  facing: number,
  walkFrame: number,
  ts: number,
  camX: number,
  camY: number
) {
  const sx = px * ts - camX;
  const sy = py * ts - camY;
  const bobY = Math.abs(Math.sin(walkFrame * 0.15)) * ts * 0.06;
  const s = ts;

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(sx + s * 0.5, sy + s * 0.94, s * 0.25, s * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2E7D32";
  ctx.fillRect(sx + s * 0.25, sy + s * 0.38 - bobY, s * 0.5, s * 0.5);

  const armSwing = Math.sin(walkFrame * 0.15) * s * 0.1;
  ctx.fillStyle = "#2E7D32";
  ctx.fillRect(sx + s * 0.12, sy + s * 0.44 - bobY + armSwing, s * 0.12, s * 0.31);
  ctx.fillRect(sx + s * 0.75, sy + s * 0.44 - bobY - armSwing, s * 0.12, s * 0.31);

  const legSwing = Math.sin(walkFrame * 0.15) * s * 0.12;
  ctx.fillStyle = "#2D3436";
  if (walkFrame > 0) {
    ctx.fillRect(sx + s * 0.31 + legSwing, sy + s * 0.81 - bobY, s * 0.16, s * 0.19);
    ctx.fillRect(sx + s * 0.53 - legSwing, sy + s * 0.81 - bobY, s * 0.16, s * 0.19);
  } else {
    ctx.fillRect(sx + s * 0.31, sy + s * 0.81 - bobY, s * 0.16, s * 0.19);
    ctx.fillRect(sx + s * 0.53, sy + s * 0.81 - bobY, s * 0.16, s * 0.19);
  }

  ctx.fillStyle = "#FDBCB4";
  ctx.beginPath();
  ctx.arc(sx + s * 0.5, sy + s * 0.25 - bobY, s * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#5C3A1E";
  ctx.beginPath();
  ctx.arc(sx + s * 0.5, sy + s * 0.16 - bobY, s * 0.25, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = "#333";
  const eyeOffX = facing === 3 ? -s * 0.06 : facing === 1 ? s * 0.06 : 0;
  const eyeOffY = facing === 0 ? -s * 0.03 : 0;
  ctx.fillRect(sx + s * 0.4 + eyeOffX, sy + s * 0.22 - bobY + eyeOffY, s * 0.06, s * 0.06);
  ctx.fillRect(sx + s * 0.54 + eyeOffX, sy + s * 0.22 - bobY + eyeOffY, s * 0.06, s * 0.06);
}

function drawCropOnTile(
  ctx: CanvasRenderingContext2D,
  crop: Crop,
  ts: number,
  camX: number,
  camY: number,
  time: number
) {
  const col = crop.tileIdx % MAP_COLS;
  const row = Math.floor(crop.tileIdx / MAP_COLS);
  const px = col * ts - camX;
  const py = row * ts - camY;
  const d = CROP_DATA[crop.type];
  const progress = Math.min(crop.growth / d.growDays, 1);

  if (progress >= 1) {
    const pulse = 1 + Math.sin(time * 0.004) * 0.06;
    const fontSize = Math.max(10, ts * 0.55 * pulse);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(d.emoji, px + ts * 0.5, py + ts * 0.5);
  } else {
    const height = ts * 0.12 + progress * ts * 0.44;
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(px + ts * 0.44, py + ts * 0.75 - height, ts * 0.12, height);
    if (progress > 0.3) {
      ctx.fillStyle = "#66BB6A";
      ctx.fillRect(px + ts * 0.31, py + ts * 0.75 - height + ts * 0.12, ts * 0.12, ts * 0.1);
      ctx.fillRect(px + ts * 0.56, py + ts * 0.75 - height + ts * 0.19, ts * 0.12, ts * 0.1);
    }
  }
}

function drawAnimalEntity(
  ctx: CanvasRenderingContext2D,
  animal: PlacedAnimal,
  ts: number,
  camX: number,
  camY: number,
  time: number,
  index: number
) {
  const px = animal.x * ts - camX;
  const py = animal.y * ts - camY;
  const bob = Math.sin(time * 0.002 + index * 1.7) * ts * 0.06;
  const bounceY = animal.bounceTimer > 0 ? -Math.sin(animal.bounceTimer * Math.PI) * ts * 0.4 : 0;

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(px + ts * 0.5, py + ts * 0.85, ts * 0.2, ts * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();

  const fontSize = Math.max(10, ts * 0.65);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 1;
  ctx.fillText(ANIMAL_DATA[animal.type].emoji, px + ts * 0.5, py + ts * 0.5 + bob + bounceY);

  if (animal.speechTimer > 0 && animal.lastSpeech) {
    const speechFont = Math.max(8, ts * 0.28);
    ctx.font = `bold ${speechFont}px sans-serif`;
    const tw = ctx.measureText(animal.lastSpeech).width + speechFont * 0.8;
    const bh = speechFont * 1.6;
    const bx = px + ts * 0.5 - tw / 2;
    const by = py - ts * 0.15 + bounceY;

    const speechAlpha = animal.speechTimer > 1.5 ? Math.min((2.0 - (animal.speechTimer - 0.5)) * 2, 1) : Math.min(animal.speechTimer / 0.5, 1);
    ctx.globalAlpha = speechAlpha * 0.92;
    ctx.fillStyle = "#FFF8E8";
    ctx.beginPath();
    ctx.roundRect(bx, by - bh, tw, bh, 4);
    ctx.fill();
    ctx.strokeStyle = "#C49A3C";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.globalAlpha = speechAlpha;
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(animal.lastSpeech, px + ts * 0.5, by - bh / 2);
    ctx.globalAlpha = 1;
  }
}

function drawWildNPC(
  ctx: CanvasRenderingContext2D,
  npc: WildNPC,
  ts: number,
  camX: number,
  camY: number,
  time: number
) {
  if (!npc.active) return;
  const px = npc.x * ts - camX;
  const py = npc.y * ts - camY;
  const bob = Math.sin(time * 0.003 + npc.x * 5) * ts * 0.05;

  if (npc.fleeTimer > 0) {
    ctx.globalAlpha = 0.5;
  } else {
    ctx.globalAlpha = 1;
  }

  const fontSize = Math.max(12, ts * 0.7);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.fillText(npc.emoji, px + ts * 0.5, py + ts * 0.5 + bob);
  ctx.globalAlpha = 1;
}

function drawStoryNPC(
  ctx: CanvasRenderingContext2D,
  npc: StoryNPC,
  ts: number,
  camX: number,
  camY: number,
  time: number
) {
  if (npc.collected) return;
  const px = npc.x * ts - camX;
  const py = npc.y * ts - camY;
  const bob = Math.sin(time * 0.003 + npc.x * 5) * ts * 0.05;

  ctx.fillStyle = "#FFD70066";
  ctx.beginPath();
  ctx.arc(px + ts * 0.5, py + ts * 0.5, ts * 0.45 + Math.sin(time * 0.005) * ts * 0.05, 0, Math.PI * 2);
  ctx.fill();

  const fontSize = Math.max(12, ts * 0.7);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 1;
  ctx.fillText(npc.emoji, px + ts * 0.5, py + ts * 0.5 + bob);
}

function drawFloats(
  ctx: CanvasRenderingContext2D,
  floats: FloatText[],
  ts: number,
  camX: number,
  camY: number
) {
  for (const f of floats) {
    const sx = f.x * ts - camX;
    const sy = f.y * ts - camY - (1 - f.life) * ts * 1.2;
    ctx.globalAlpha = Math.min(f.life * 2, 1);
    const fontSize = Math.max(9, ts * 0.35);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(f.text, sx + 1, sy + 1);
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, sx, sy);
    ctx.globalAlpha = 1;
  }
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  ts: number,
  camX: number,
  camY: number
) {
  for (const p of particles) {
    const sx = p.x * ts - camX;
    const sy = p.y * ts - camY;
    ctx.globalAlpha = Math.min(p.life * 2, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHUD(
  ctx: CanvasRenderingContext2D,
  g: Game,
  w: number,
  ts: number
) {
  const barH = Math.max(28, ts * 0.8);
  ctx.fillStyle = "rgba(13,31,15,0.75)";
  ctx.fillRect(0, 0, w, barH);

  const fontSize = Math.max(10, ts * 0.32);
  const smallFont = Math.max(10, ts * 0.28);

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#C49A3C";
  ctx.fillText(`Day ${g.day} \u00B7 ${g.season.charAt(0).toUpperCase() + g.season.slice(1)}`, 8, barH * 0.35);

  ctx.font = `${smallFont}px sans-serif`;
  ctx.fillStyle = "#FDF8F0";
  const statsText = `\uD83D\uDCB0${g.gold} \uD83E\uDE93${g.wood} \uD83E\uDEA8${g.stone} \uD83C\uDF3F${g.grit} \uD83D\uDCDA${g.wisdom} \uD83D\uDC9B${g.charm}`;
  ctx.textAlign = "right";
  ctx.fillText(statsText, w - 8, barH * 0.35);

  const timeBarY = barH * 0.7;
  const timeBarH = Math.max(4, ts * 0.1);
  const timeBarW = w * 0.35;
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(8, timeBarY - timeBarH / 2, timeBarW, timeBarH);
  ctx.fillStyle = "#C49A3C";
  ctx.fillRect(8, timeBarY - timeBarH / 2, timeBarW * (g.timeOfDay / 100), timeBarH);

  ctx.textAlign = "right";
  if (g.seeds.length > 0) {
    ctx.fillStyle = "#A8D8A8";
    ctx.fillText(`Seeds: ${g.seeds.length}`, w - 8, barH * 0.7);
  } else {
    ctx.fillStyle = "#FF6B6B";
    ctx.fillText("No seeds!", w - 8, barH * 0.7);
  }

  // Quest bar
  if (g.questIndex < QUEST_CHAIN.length) {
    const quest = QUEST_CHAIN[g.questIndex];
    let questText = quest.text;
    if (quest.id === "chop_wood") {
      questText = `\uD83E\uDE93 Gather wood (${Math.min(g.woodEverGathered, 5)}/5)`;
    }

    const questBarH = Math.max(18, ts * 0.52);
    ctx.fillStyle = "rgba(196,154,60,0.15)";
    ctx.fillRect(0, barH, w, questBarH);
    ctx.fillStyle = "#C49A3C";
    ctx.font = `bold ${Math.max(10, ts * 0.28)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(questText, w / 2, barH + questBarH / 2);

    // Party readiness meter
    const readyW = 60;
    const readyX = w - readyW - 8;
    const readyY = barH + (questBarH - 8) / 2;
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(readyX, readyY, readyW, 8);
    ctx.fillStyle =
      g.partyReadiness >= 80 ? "#FFD700" : g.partyReadiness >= 40 ? "#C49A3C" : "#5C7A4A";
    ctx.fillRect(readyX, readyY, readyW * (g.partyReadiness / 100), 8);
    ctx.fillStyle = "#FDF8F0AA";
    ctx.font = `${Math.max(8, ts * 0.22)}px sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(`Party: ${g.partyReadiness}%`, readyX - 4, readyY + 4);
  }
}

function drawActionPrompt(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  ts: number,
  camX: number,
  camY: number
) {
  const sx = x * ts - camX + ts * 0.5;
  const sy = y * ts - camY - ts * 0.15;
  const fontSize = Math.max(9, ts * 0.3);
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  const tw = ctx.measureText(text).width + fontSize * 1.2;
  const bh = fontSize * 1.6;
  ctx.fillStyle = "rgba(29,68,32,0.92)";
  ctx.strokeStyle = "#C49A3C";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(sx - tw / 2, sy - bh / 2, tw, bh, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#FDF8F0";
  ctx.textBaseline = "middle";
  ctx.fillText(text, sx, sy);
}

function drawVirtualControls(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  joyBaseX: number,
  joyBaseY: number,
  joyKnobX: number,
  joyKnobY: number,
  joyActive: boolean,
  actionActive: boolean,
  hasAction: boolean
) {
  const outerR = 42;
  const innerR = 17;
  const actR = 34;

  ctx.globalAlpha = joyActive ? 0.55 : 0.3;
  ctx.fillStyle = "#1D4420";
  ctx.strokeStyle = "#C49A3C";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(joyBaseX, joyBaseY, outerR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#C49A3C";
  ctx.beginPath();
  ctx.arc(joyKnobX, joyKnobY, innerR, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const actX = w - 58;
  const actY = h - 70;
  ctx.globalAlpha = hasAction ? 0.8 : 0.35;
  ctx.fillStyle = hasAction ? "#C49A3C" : "#666";
  ctx.strokeStyle = "#1D4420";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(actX, actY, actR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (actionActive) {
    ctx.fillStyle = "#FFFFFF44";
    ctx.beginPath();
    ctx.arc(actX, actY, actR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#1D4420";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(hasAction ? "ACT" : "---", actX, actY);
  ctx.globalAlpha = 1;
}

function drawTimeOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  timeOfDay: number
) {
  if (timeOfDay < 25) {
    const t = 1 - timeOfDay / 25;
    ctx.fillStyle = `rgba(255,200,100,${t * 0.06})`;
    ctx.fillRect(0, 0, w, h);
  }
  if (timeOfDay > 65) {
    const t = Math.min((timeOfDay - 65) / 35, 1);
    ctx.fillStyle = `rgba(0,0,40,${t * 0.3})`;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawNightFade(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fade: number
) {
  if (fade > 0) {
    ctx.fillStyle = `rgba(0,0,0,${fade * 0.95})`;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawDawnText(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  day: number,
  season: Season,
  alpha: number
) {
  ctx.globalAlpha = Math.min(alpha, 1);
  ctx.fillStyle = "#C49A3C";
  ctx.font = `bold ${Math.max(18, w * 0.04)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `Day ${day} \u00B7 ${season.charAt(0).toUpperCase() + season.slice(1)}`,
    w / 2,
    h / 2
  );
  ctx.globalAlpha = 1;
}

function drawGroundItems(
  ctx: CanvasRenderingContext2D,
  items: GroundItem[],
  ts: number,
  camX: number,
  camY: number,
  time: number
) {
  for (const item of items) {
    const px = item.x * ts - camX;
    const py = item.y * ts - camY;

    const pulse = Math.sin(time * 0.004 + item.sparklePhase) * 0.15 + 0.85;
    const bobY = Math.sin(time * 0.003 + item.sparklePhase) * ts * 0.05;

    ctx.globalAlpha = 0.3 * pulse;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(px + ts * 0.3, py + ts * 0.3 + bobY, ts * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = pulse;
    ctx.fillStyle = "#000";
    ctx.font = `${Math.max(8, ts * 0.4)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.emoji, px + ts * 0.3, py + ts * 0.3 + bobY);
    ctx.globalAlpha = 1;
  }
}

function drawAchievement(ctx: CanvasRenderingContext2D, g: Game, w: number, h: number) {
  if (g.achievementTimer <= 0) return;

  const alpha = g.achievementTimer > 2.5
    ? (3 - g.achievementTimer) * 2
    : g.achievementTimer > 0.5
      ? 1
      : g.achievementTimer * 2;

  ctx.globalAlpha = Math.min(alpha, 1);

  const bannerH = 50;
  ctx.fillStyle = "rgba(13,31,15,0.8)";
  ctx.fillRect(0, h * 0.35, w, bannerH);

  ctx.fillStyle = "#C49A3C";
  ctx.fillRect(0, h * 0.35, w, 2);
  ctx.fillRect(0, h * 0.35 + bannerH - 2, w, 2);

  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(g.achievementText, w / 2, h * 0.35 + bannerH / 2);

  ctx.globalAlpha = 1;
}

function getZoneName(x: number, y: number): string | null {
  if (y < 8 && x < 22) return "\uD83C\uDF32 The Forest";
  if (y < 8 && x >= 22) return "\u26F0\uFE0F Mountain Path";
  if (x >= 30 && y >= 16) return "\uD83C\uDF38 The Meadow";
  if (y >= 14 && y <= 16 && x >= 12) return "\uD83C\uDF0A The River";
  if (y >= 23 && x >= 16) return "\uD83C\uDFD8\uFE0F The Town";
  if (y >= 19 && x < 6) return "\uD83C\uDFDB\uFE0F Ancient Ruins";
  if (y >= 8 && y <= 16 && x >= 7 && x <= 22) return "\uD83C\uDFE1 The Farm";
  return null;
}

function checkMilestones(g: Game) {
  if (g.placedAnimals.length >= 4 && !g.usedEvents.has("ach_first_animal")) {
    g.usedEvents.add("ach_first_animal");
    g.showAchievement("\uD83D\uDC3E New Friend!");
  }
  if (g.cropsHarvested >= 1 && !g.usedEvents.has("ach_first_harvest")) {
    g.usedEvents.add("ach_first_harvest");
    g.showAchievement("\uD83C\uDF3E First Harvest!");
  }
  if (g.buildings.length >= 1 && !g.usedEvents.has("ach_first_build")) {
    g.usedEvents.add("ach_first_build");
    g.showAchievement("\uD83D\uDD28 First Building!");
  }
  if (g.gold >= 100 && !g.usedEvents.has("ach_100g")) {
    g.usedEvents.add("ach_100g");
    g.showAchievement("\uD83D\uDCB0 100 Gold!");
  }
  if (g.gold >= 300 && !g.usedEvents.has("ach_300g")) {
    g.usedEvents.add("ach_300g");
    g.showAchievement("\uD83D\uDCB0 300 Gold!");
  }
  if (g.placedAnimals.length >= 5 && !g.usedEvents.has("ach_5_animals")) {
    g.usedEvents.add("ach_5_animals");
    g.showAchievement("\uD83D\uDC3E Animal Family!");
  }
  if (g.placedAnimals.length >= 10 && !g.usedEvents.has("ach_10_animals")) {
    g.usedEvents.add("ach_10_animals");
    g.showAchievement("\uD83D\uDC3E Animal Kingdom!");
  }
  if (g.cropsHarvested >= 10 && !g.usedEvents.has("ach_10_crops")) {
    g.usedEvents.add("ach_10_crops");
    g.showAchievement("\uD83C\uDF3E Green Thumb!");
  }
  if (g.buildings.length >= 4 && !g.usedEvents.has("ach_4_build")) {
    g.usedEvents.add("ach_4_build");
    g.showAchievement("\uD83C\uDFD7\uFE0F Master Builder!");
  }
  if (g.zonesVisited && g.zonesVisited.size >= 5 && !g.usedEvents.has("ach_explorer")) {
    g.usedEvents.add("ach_explorer");
    g.showAchievement("\uD83D\uDDFA\uFE0F Explorer!");
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
  const gameRef = useRef<Game | null>(null);
  const [overlay, setOverlay] = useState<"shop" | "build" | "score" | null>(null);
  const [gold, setGold] = useState(50);
  const [wood, setWood] = useState(0);
  const [seeds, setSeeds] = useState<CropType[]>([]);
  const [scoreData, setScoreData] = useState({ total: 0, breakdown: "" });
  const [started, setStarted] = useState(false);

  const syncOverlayState = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    setGold(g.gold);
    setWood(g.wood);
    setSeeds([...g.seeds]);
  }, []);

  const handleGameOver = useCallback((score: number) => {
    onGameOver(score);
  }, [onGameOver]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const game = new Game();
    gameRef.current = game;

    const keys = new Set<string>();
    let animFrameId: number;
    let lastTime = 0;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    let canvasW = 0;
    let canvasH = 0;
    let tileSize = 32;
    const dpr = window.devicePixelRatio || 1;

    const joystick = {
      active: false,
      touchId: -1,
      baseX: 0,
      baseY: 0,
      knobX: 0,
      knobY: 0,
      dx: 0,
      dy: 0,
    };
    const actionTouch = {
      active: false,
      touchId: -1,
    };

    function resize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      canvasW = rect.width;
      canvasH = rect.height;
      canvas.width = Math.floor(canvasW * dpr);
      canvas.height = Math.floor(canvasH * dpr);
      canvas.style.width = canvasW + "px";
      canvas.style.height = canvasH + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      tileSize = Math.max(30, Math.min(48, Math.floor(Math.min(canvasW / 11, canvasH / 9))));
    }

    resize();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(container);

    // INPUT
    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      keys.add(k);
      if (
        k === "arrowup" || k === "arrowdown" || k === "arrowleft" || k === "arrowright" ||
        k === "w" || k === "a" || k === "s" || k === "d" || k === " " || k === "e"
      ) {
        e.preventDefault();
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      keys.delete(e.key.toLowerCase());
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    function getTouchPos(t: Touch): { x: number; y: number } {
      const rect = canvas!.getBoundingClientRect();
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }

    function onTouchStart(e: TouchEvent) {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const pos = getTouchPos(t);
        if (pos.y > canvasH - 160) {
          if (pos.x < canvasW * 0.5) {
            joystick.active = true;
            joystick.touchId = t.identifier;
            joystick.baseX = pos.x;
            joystick.baseY = pos.y;
            joystick.knobX = pos.x;
            joystick.knobY = pos.y;
            joystick.dx = 0;
            joystick.dy = 0;
          } else {
            actionTouch.active = true;
            actionTouch.touchId = t.identifier;
          }
        }
      }
    }
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === joystick.touchId && joystick.active) {
          const pos = getTouchPos(t);
          const dx = pos.x - joystick.baseX;
          const dy = pos.y - joystick.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxR = 35;
          if (dist > maxR) {
            joystick.knobX = joystick.baseX + (dx / dist) * maxR;
            joystick.knobY = joystick.baseY + (dy / dist) * maxR;
          } else {
            joystick.knobX = pos.x;
            joystick.knobY = pos.y;
          }
          const deadzone = 8;
          if (dist > deadzone) {
            joystick.dx = dx / dist;
            joystick.dy = dy / dist;
          } else {
            joystick.dx = 0;
            joystick.dy = 0;
          }
        }
      }
    }
    function onTouchEnd(e: TouchEvent) {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === joystick.touchId) {
          joystick.active = false;
          joystick.touchId = -1;
          joystick.dx = 0;
          joystick.dy = 0;
          joystick.knobX = joystick.baseX;
          joystick.knobY = joystick.baseY;
        }
        if (t.identifier === actionTouch.touchId) {
          actionTouch.active = false;
          actionTouch.touchId = -1;
        }
      }
    }

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", onTouchEnd, { passive: false });

    // MOVEMENT HELPERS
    function canWalkTo(x: number, y: number): boolean {
      const r = 0.3;
      return (
        isWalkable(Math.floor(x - r), Math.floor(y - r)) &&
        isWalkable(Math.floor(x + r), Math.floor(y - r)) &&
        isWalkable(Math.floor(x - r), Math.floor(y + r)) &&
        isWalkable(Math.floor(x + r), Math.floor(y + r))
      );
    }

    // STORY EVENT SPAWNS
    function checkStoryEvents(g: Game) {
      if (g.day === 2 && !g.usedEvents.has("forest_opens")) {
        g.usedEvents.add("forest_opens");
        g.addFloat(g.px, g.py - 1, "A path through the forest has opened!", "#FFD700");
      }
      if (g.day === 4 && !g.usedEvents.has("kids_visit")) {
        g.usedEvents.add("kids_visit");
        g.storyNPCs = [
          { id: "emmett", emoji: "👦", x: 13, y: 10.5, collected: false },
          { id: "sapphire", emoji: "👧", x: 14.5, y: 10.5, collected: false },
        ];
        g.addFloat(g.px, g.py - 1, "The kids are visiting!", "#FFD700");
      }
      if (g.day === 5 && !g.usedEvents.has("ruins_rumor")) {
        g.usedEvents.add("ruins_rumor");
        g.addFloat(g.px, g.py - 1, "Rumor: treasure in the old ruins to the south...", "#FFD700");
      }
      if (g.day === 6 && !g.usedEvents.has("merchant")) {
        g.usedEvents.add("merchant");
        g.storyNPCs.push({ id: "merchant", emoji: "🧙", x: 34, y: 18, collected: false });
        g.addFloat(g.px, g.py - 1, "A traveling merchant appeared in the meadow!", "#FFD700");
      }
      if (g.day === 7 && !g.usedEvents.has("stray_animal")) {
        g.usedEvents.add("stray_animal");
        const hasCat = g.placedAnimals.some((a) => a.type === "cat");
        if (!hasCat) {
          g.storyNPCs.push({ id: "bruce", emoji: "🐱", x: 11.5, y: 8.8, collected: false });
          g.addFloat(g.px, g.py - 1, "A stray cat appeared near the house!", "#FFD700");
        } else {
          g.storyNPCs.push({ id: "bella", emoji: "🐕", x: 11.5, y: 8.8, collected: false });
          g.addFloat(g.px, g.py - 1, "A stray dog appeared!", "#FFD700");
        }
      }
      if (g.day === 8 && !g.usedEvents.has("wild_horse")) {
        g.usedEvents.add("wild_horse");
        g.wildNPCs.push({
          id: "wild_horse", emoji: "🐴", x: 35, y: 17,
          targetX: 35, targetY: 17, moveTimer: 0,
          interactCount: 0, fleeTimer: 0, active: true,
        });
        g.addFloat(g.px, g.py - 1, "A wild horse spotted in the meadow!", "#FFD700");
      }
      if (g.day === 9 && !g.usedEvents.has("fairy_lights")) {
        g.usedEvents.add("fairy_lights");
        g.addFloat(g.px, g.py - 1, "Strange lights in the forest at night...", "#DDA0DD");
      }
      if (g.day === 10 && !g.usedEvents.has("festival")) {
        g.usedEvents.add("festival");
        g.grit += 3;
        g.wisdom += 3;
        g.charm += 3;
        g.gold += 25;
        g.storyNPCs.push(
          { id: "festival_a", emoji: "🧑‍🌾", x: 22, y: 25, collected: false },
          { id: "festival_b", emoji: "👩‍🍳", x: 24, y: 25, collected: false },
          { id: "festival_c", emoji: "🎵", x: 23, y: 24, collected: false },
        );
        g.addFloat(g.px, g.py - 1, "Festival day! +3 all stats, +25g", "#FFD700");
      }
      if (g.day === 11 && !g.usedEvents.has("mountain_clear")) {
        g.usedEvents.add("mountain_clear");
        g.mountainAccessible = true;
        // Clear the rockslide blocking mountain path
        for (let r = 1; r <= 6; r++) {
          for (let c = 30; c <= 37; c++) {
            const idx = r * MAP_COLS + c;
            if (TILE_MAP[idx] === 13) {
              TILE_MAP[idx] = 0;
            }
          }
        }
        g.addFloat(g.px, g.py - 1, "The mountain rockslide has cleared!", "#FFD700");
      }
      if (g.day === 12 && !g.usedEvents.has("wild_goat")) {
        g.usedEvents.add("wild_goat");
        g.wildNPCs.push({
          id: "wild_goat", emoji: "🐐", x: 34, y: 5,
          targetX: 34, targetY: 5, moveTimer: 0,
          interactCount: 0, fleeTimer: 0, active: true,
        });
        g.addFloat(g.px, g.py - 1, "Wild goat spotted on the mountain!", "#FFD700");
      }
      if (g.day === 13 && !g.usedEvents.has("zoe_adventure")) {
        g.usedEvents.add("zoe_adventure");
        g.storyNPCs.push({ id: "zoe", emoji: "🐕", x: 20, y: 10, collected: false });
        g.addFloat(g.px, g.py - 1, "Zoe is loose!", "#FFD700");
      }
      if (g.day === 14 && !g.usedEvents.has("buzz")) {
        g.usedEvents.add("buzz");
        g.addFloat(g.px, g.py - 1, "The whole town is buzzing about tomorrow!", "#FFD700");
      }
    }

    // CONTEXT-SENSITIVE ACTION
    function getActionContext(g: Game): { prompt: string; tx: number; ty: number } | null {
      if (g.showShop || g.showBuild || g.showScore || g.nightPhase !== "none") return null;

      const npc = g.findNearNPC();
      if (npc) {
        return { prompt: `\u2728 ${npc.emoji}`, tx: npc.x, ty: npc.y };
      }

      const wildNPC = g.findNearWildNPC();
      if (wildNPC) {
        if (wildNPC.id === "wild_horse") {
          return { prompt: "🐴 Approach horse", tx: wildNPC.x, ty: wildNPC.y };
        }
        if (wildNPC.id === "wild_goat") {
          return { prompt: "🐐 Chase goat!", tx: wildNPC.x, ty: wildNPC.y };
        }
        if (wildNPC.id === "deer") {
          return { prompt: "🦌 Watch deer", tx: wildNPC.x, ty: wildNPC.y };
        }
      }

      const animal = g.findNearAnimal();
      if (animal) {
        const d = ANIMAL_DATA[animal.type];
        return { prompt: `${d.emoji} Pet ${animal.name}`, tx: animal.x, ty: animal.y };
      }

      const houseHit = g.findNearbyTile([5, 6]);
      if (houseHit) {
        // Check if this is the town building (library) or farmhouse
        const idx = houseHit.row * MAP_COLS + houseHit.col;
        if (LIBRARY_TILES.has(idx)) {
          return { prompt: "📚 Library", tx: houseHit.col, ty: houseHit.row };
        }
        return { prompt: `\uD83D\uDE34 Rest`, tx: houseHit.col, ty: houseHit.row };
      }

      const shopHit = g.findNearbyTile(12);
      if (shopHit) {
        return { prompt: `\uD83C\uDFEA Shop`, tx: shopHit.col, ty: shopHit.row };
      }

      // Check for special interact tiles nearby (standing on or facing)
      const col = Math.round(g.px);
      const row = Math.round(g.py);
      const standingTile = tileAt(col, row);
      const standingIdx = row * MAP_COLS + col;

      if (standingTile === 18 && SPECIAL_SPOTS[standingIdx]) {
        return { prompt: SPECIAL_SPOTS[standingIdx].prompt, tx: col, ty: row };
      }

      const { col: fc, row: fr, tile: facedTile } = g.getFacingTile();
      const facedIdx = fr * MAP_COLS + fc;

      if (facedTile === 18 && SPECIAL_SPOTS[facedIdx]) {
        return { prompt: SPECIAL_SPOTS[facedIdx].prompt, tx: fc, ty: fr };
      }

      // Check ruin walls for inscription
      if (facedTile === 16) {
        if (INSCRIPTION_COORDS.has(facedIdx)) {
          return { prompt: "📜 Read inscription", tx: fc, ty: fr };
        }
        if (BLACKSMITH_TILES.has(facedIdx)) {
          return { prompt: "⚒️ Blacksmith", tx: fc, ty: fr };
        }
      }

      // Cave
      if (facedTile === 17) {
        return { prompt: "🕳️ Enter cave", tx: fc, ty: fr };
      }

      // Stone (clearable)
      if (facedTile === 13) {
        return { prompt: "⛏️ Mine", tx: fc, ty: fr };
      }

      switch (facedTile) {
        case 7: {
          const tileIdx = fr * MAP_COLS + fc;
          const crop = g.crops.find((c) => c.tileIdx === tileIdx);
          if (crop) {
            const d = CROP_DATA[crop.type];
            if (crop.growth >= d.growDays) {
              return { prompt: `\uD83C\uDF3E Harvest`, tx: fc, ty: fr };
            }
            return { prompt: `\uD83D\uDCA7 Water`, tx: fc, ty: fr };
          }
          if (g.seeds.length > 0) {
            return { prompt: `\uD83C\uDF31 Plant`, tx: fc, ty: fr };
          }
          return { prompt: `No seeds!`, tx: fc, ty: fr };
        }
        case 1: return { prompt: `\uD83E\uDE93 Chop`, tx: fc, ty: fr };
        case 8: {
          const hasCoop = g.buildings.includes("coop");
          if (!hasCoop) {
            const d = BUILDING_DATA.coop;
            return { prompt: `\uD83D\uDD28 Build Coop (${d.goldCost}g ${d.woodCost}w)`, tx: fc, ty: fr };
          }
          const poultryCount = countPoultry(g.placedAnimals);
          if (poultryCount > 0) {
            return { prompt: `\uD83D\uDC14 Coop (${poultryCount} birds)`, tx: fc, ty: fr };
          }
          return null;
        }
        case 9: {
          const hasBarn = g.buildings.includes("barn");
          if (!hasBarn) {
            const d = BUILDING_DATA.barn;
            return { prompt: `\uD83D\uDD28 Build Barn (${d.goldCost}g ${d.woodCost}w)`, tx: fc, ty: fr };
          }
          return { prompt: `\uD83D\uDD28 Build...`, tx: fc, ty: fr };
        }
        case 3: return { prompt: `\uD83C\uDFA3 Relax`, tx: fc, ty: fr };
        default: return null;
      }
    }

    function executeSpecialInteraction(g: Game, spotType: SpecialType, col: number, row: number) {
      switch (spotType) {
        case "fairy_ring": {
          g.fairyRingVisits++;
          if (g.fairyRingVisits === 1) {
            g.charm += 5;
            g.addFloat(col, row, "The fairies welcome you! +5 charm", "#DDA0DD");
            g.addParticles(col + 0.5, row + 0.5, "#DDA0DD", 12);
          } else {
            g.charm += 1;
            const msg = FAIRY_MESSAGES[Math.floor(Math.random() * FAIRY_MESSAGES.length)];
            g.addFloat(col, row, `+1 charm`, "#DDA0DD");
            g.addFloat(col, row - 0.5, msg, "#E8C8B8");
            g.addParticles(col + 0.5, row + 0.5, "#DDA0DD", 6);
          }
          g.timeOfDay += 4;
          break;
        }
        case "old_well": {
          const roll = Math.random();
          if (roll < 0.4) {
            const treasure = 10 + Math.floor(Math.random() * 21);
            g.gold += treasure;
            g.treasuresFound++;
            g.addFloat(col, row, `Found ${treasure}g in the well!`, "#FFD700");
            g.addParticles(col + 0.5, row + 0.5, "#FFD700", 8);
          } else if (roll < 0.7) {
            g.wisdom += 2;
            g.addFloat(col, row, "Ancient knowledge... +2 wisdom", "#4FC3F7");
          } else {
            g.addFloat(col, row, "Just an echo...", "#888888");
          }
          g.timeOfDay += 3;
          break;
        }
        case "mushroom": {
          g.gold += 16;
          g.addFloat(col, row, "🍄 Found mushrooms! +16g", "#8B4513");
          g.addParticles(col + 0.5, row + 0.5, "#8B4513", 6);
          g.timeOfDay += 3;
          break;
        }
        case "fountain": {
          g.charm += 1;
          g.addFloat(col, row, "⛲ Pretty! +1 charm", "#4FC3F7");
          g.addParticles(col + 0.5, row + 0.5, "#4FC3F7", 8);
          g.timeOfDay += 2;
          break;
        }
        case "notice_board": {
          const tip = NOTICE_BOARD_TIPS[Math.floor(Math.random() * NOTICE_BOARD_TIPS.length)];
          g.addFloat(col, row - 0.3, tip, "#FDF8F0");
          g.timeOfDay += 1;
          break;
        }
        case "beehive":
        case "meadow_honey": {
          g.honeyCollected++;
          const stung = Math.random() < 0.2;
          if (stung) {
            g.gold += 15;
            g.honey++;
            g.grit = Math.max(0, g.grit - 1);
            g.addFloat(col, row, "🐝 Ouch! Bees! +15g, -1 grit", "#FFD700");
          } else {
            g.gold += 15;
            g.honey++;
            g.wisdom += 1;
            g.addFloat(col, row, "🍯 Honey collected! +15g, +1 wisdom", "#FFD700");
          }
          g.addParticles(col + 0.5, row + 0.5, "#FFD700", 6);
          g.timeOfDay += 4;
          break;
        }
        case "picnic": {
          g.charm += 2;
          g.addFloat(col, row, "🧺 Lovely picnic! +2 charm", "#E8C8B8");
          g.addParticles(col + 0.5, row + 0.5, "#FF69B4", 8);
          g.timeOfDay += 5;
          break;
        }
        case "summit": {
          const farmVal = g.calculateScore();
          g.addFloat(col, row, `🏔️ Farm value: ${farmVal} points!`, "#FDF8F0");
          g.wisdom += 1;
          g.timeOfDay += 3;
          break;
        }
        case "fishing": {
          const doubleCatch = Math.random() < 0.1;
          if (doubleCatch) {
            g.gold += 20;
            g.fish += 2;
            g.fishCaught += 2;
            g.addFloat(col, row, "🐟🐟 Double catch! +20g", "#4FC3F7");
          } else {
            g.gold += 10;
            g.fish++;
            g.fishCaught++;
            g.addFloat(col, row, "🐟 Nice catch! +10g", "#4FC3F7");
          }
          g.wisdom += 1;
          g.addParticles(col + 0.5, row + 0.5, "#4FC3F7", 6);
          g.timeOfDay += 4;
          break;
        }
        case "treasure_chest": {
          if (!g.ruinTreasureFound) {
            g.ruinTreasureFound = true;
            g.gold += 50;
            g.treasuresFound++;
            // Give rare seeds
            g.seeds.push("pumpkin", "pumpkin", "strawberry", "strawberry");
            g.addFloat(col, row, "💎 Ancient treasure! +50g + rare seeds!", "#FFD700");
            g.addParticles(col + 0.5, row + 0.5, "#FFD700", 15);
          } else {
            g.addFloat(col, row, "The chest is empty now.", "#888888");
          }
          g.timeOfDay += 3;
          break;
        }
        case "wild_horse_spot": {
          g.addFloat(col, row, "Hoof prints in the grass...", "#8B7355");
          g.timeOfDay += 2;
          break;
        }
        default:
          break;
      }
    }

    function executeAction(g: Game) {
      if (g.showShop || g.showBuild || g.showScore || g.nightPhase !== "none") return;

      // Story NPCs
      const npc = g.findNearNPC();
      if (npc && !npc.collected) {
        npc.collected = true;
        if (npc.id === "emmett") {
          g.wood += 4;
          g.woodEverGathered += 4;
          g.grit += 2;
          g.addFloat(npc.x, npc.y, "+4 wood, +2 grit", "#FFD700");
          g.addParticles(npc.x, npc.y, "#8B7355", 8);
        } else if (npc.id === "sapphire") {
          g.charm += 2;
          g.gold += 15;
          g.addFloat(npc.x, npc.y, "+2 charm, +15g", "#FFD700");
          g.addParticles(npc.x, npc.y, "#DDA0DD", 8);
        } else if (npc.id === "bruce") {
          g.placedAnimals.push(g.makeAnimal("cat", "Bruce", npc.x, npc.y));
          g.addFloat(npc.x, npc.y, "Bruce joined! \uD83D\uDC31", "#FFD700");
          g.addParticles(npc.x, npc.y, "#FF69B4", 10);
        } else if (npc.id === "bella") {
          g.placedAnimals.push(g.makeAnimal("dog", "Bella", npc.x, npc.y));
          g.addFloat(npc.x, npc.y, "Bella joined! \uD83D\uDC15", "#FFD700");
          g.addParticles(npc.x, npc.y, "#FF69B4", 10);
        } else if (npc.id === "zoe") {
          g.grit += 2;
          g.gold += 20;
          g.placedAnimals.push(g.makeAnimal("dog", "Zoe", npc.x, npc.y));
          g.addFloat(npc.x, npc.y, "Zoe joined! 🐕 +20g", "#FFD700");
          g.addParticles(npc.x, npc.y, "#FF69B4", 12);
        } else if (npc.id === "merchant") {
          g.gold += 10;
          g.seeds.push("strawberry", "strawberry", "pumpkin", "pumpkin");
          g.addFloat(npc.x, npc.y, "🧙 Free samples! +10g + seeds", "#FFD700");
          g.addParticles(npc.x, npc.y, "#C49A3C", 10);
        } else if (npc.id === "festival_a") {
          g.grit += 2;
          g.addFloat(npc.x, npc.y, "🧑‍🌾 Farming tips! +2 grit", "#FFD700");
        } else if (npc.id === "festival_b") {
          g.charm += 2;
          g.addFloat(npc.x, npc.y, "👩‍🍳 Delicious! +2 charm", "#FFD700");
        } else if (npc.id === "festival_c") {
          g.wisdom += 2;
          g.addFloat(npc.x, npc.y, "🎵 Beautiful song! +2 wisdom", "#FFD700");
        }
        g.timeOfDay += 3;
        return;
      }

      // Wild NPCs
      const wildNPC = g.findNearWildNPC();
      if (wildNPC) {
        if (wildNPC.id === "wild_horse") {
          wildNPC.interactCount++;
          if (wildNPC.interactCount >= 3) {
            wildNPC.active = false;
            g.placedAnimals.push(g.makeAnimal("donkey", "Mustang", wildNPC.x, wildNPC.y));
            g.addFloat(wildNPC.x, wildNPC.y, "🐴 The horse joined your farm!", "#FFD700");
            g.addParticles(wildNPC.x, wildNPC.y, "#FF69B4", 12);
          } else {
            wildNPC.fleeTimer = 2;
            wildNPC.targetX = wildNPC.x + (Math.random() - 0.5) * 6;
            wildNPC.targetY = wildNPC.y + (Math.random() - 0.5) * 4;
            wildNPC.targetX = Math.max(30, Math.min(37, wildNPC.targetX));
            wildNPC.targetY = Math.max(12, Math.min(20, wildNPC.targetY));
            g.addFloat(wildNPC.x, wildNPC.y, `🐴 Getting closer... (${wildNPC.interactCount}/3)`, "#C49A3C");
          }
          g.timeOfDay += 3;
          return;
        }
        if (wildNPC.id === "wild_goat") {
          wildNPC.interactCount++;
          if (wildNPC.interactCount >= 2) {
            wildNPC.active = false;
            g.placedAnimals.push(g.makeAnimal("goat", "Mountain Billy", wildNPC.x, wildNPC.y));
            g.addFloat(wildNPC.x, wildNPC.y, "🐐 Mountain goat joined!", "#FFD700");
            g.addParticles(wildNPC.x, wildNPC.y, "#FF69B4", 12);
          } else {
            wildNPC.fleeTimer = 1.5;
            wildNPC.targetX = wildNPC.x + (Math.random() - 0.5) * 5;
            wildNPC.targetY = wildNPC.y + (Math.random() - 0.5) * 3;
            wildNPC.targetX = Math.max(31, Math.min(37, wildNPC.targetX));
            wildNPC.targetY = Math.max(2, Math.min(8, wildNPC.targetY));
            g.addFloat(wildNPC.x, wildNPC.y, `🐐 Almost! (${wildNPC.interactCount}/2)`, "#C49A3C");
          }
          g.timeOfDay += 3;
          return;
        }
        if (wildNPC.id === "deer") {
          wildNPC.fleeTimer = 3;
          wildNPC.targetX = wildNPC.x + (Math.random() > 0.5 ? 4 : -4);
          wildNPC.targetY = wildNPC.y + (Math.random() > 0.5 ? 3 : -3);
          g.charm += 1;
          g.addFloat(wildNPC.x, wildNPC.y, "🦌 Beautiful! +1 charm", "#E8C8B8");
          g.timeOfDay += 2;
          return;
        }
      }

      // Pet farm animals (products drop on the ground naturally)
      const animal = g.findNearAnimal();
      if (animal) {
        animal.bounceTimer = 1.0;
        const speechPool = ANIMAL_SPEECH[animal.type];
        animal.lastSpeech = speechPool[Math.floor(Math.random() * speechPool.length)];
        animal.speechTimer = 2.0;
        g.charm += 1;
        const msgs = [
          `\u2764\uFE0F ${animal.name} loves you!`,
          `\u2764\uFE0F +1 charm`,
          `${animal.name}: ${animal.lastSpeech}`,
        ];
        g.addFloat(animal.x, animal.y, msgs[Math.floor(Math.random() * msgs.length)], "#FF69B4");
        g.addParticles(animal.x, animal.y, "#FF69B4", 10);
        g.timeOfDay += 2;
        checkMilestones(g);
        return;
      }

      // House / Library
      const houseHit = g.findNearbyTile([5, 6]);
      if (houseHit) {
        const idx = houseHit.row * MAP_COLS + houseHit.col;
        if (LIBRARY_TILES.has(idx)) {
          g.libraryVisits++;
          g.wisdom += 2;
          const book = BOOK_TITLES[Math.floor(Math.random() * BOOK_TITLES.length)];
          g.addFloat(g.px, g.py, `📚 +2 wisdom`, "#4FC3F7");
          g.addFloat(g.px, g.py - 0.5, book, "#FDF8F0");
          g.timeOfDay += 5;
          return;
        }
        g.timeOfDay += 25;
        g.grit += 1;
        g.wisdom += 1;
        g.charm += 1;
        g.addFloat(g.px, g.py, "\uD83D\uDE34 Rested! +1 all stats", "#B8A9C9");
        g.addParticles(g.px, g.py, "#B8A9C9", 8);
        return;
      }

      // Shop
      const shopHit = g.findNearbyTile(12);
      if (shopHit) {
        g.showShop = true;
        setOverlay("shop");
        syncOverlayState();
        return;
      }

      // Check for special interact tile (standing or facing)
      const pcol = Math.round(g.px);
      const prow = Math.round(g.py);
      const standingIdx = prow * MAP_COLS + pcol;
      const standingTile = tileAt(pcol, prow);

      if (standingTile === 18 && SPECIAL_SPOTS[standingIdx]) {
        executeSpecialInteraction(g, SPECIAL_SPOTS[standingIdx].type, pcol, prow);
        return;
      }

      const { col, row, tile } = g.getFacingTile();
      const facedIdx = row * MAP_COLS + col;

      if (tile === 18 && SPECIAL_SPOTS[facedIdx]) {
        executeSpecialInteraction(g, SPECIAL_SPOTS[facedIdx].type, col, row);
        return;
      }

      // Ruin wall interactions
      if (tile === 16) {
        if (INSCRIPTION_COORDS.has(facedIdx)) {
          g.wisdom += 3;
          g.treasuresFound++;
          const lore = LORE_TEXTS[Math.floor(Math.random() * LORE_TEXTS.length)];
          g.addFloat(col, row, "+3 wisdom", "#4FC3F7");
          g.addFloat(col, row - 0.5, lore, "#FDF8F0");
          g.timeOfDay += 3;
          return;
        }
        if (BLACKSMITH_TILES.has(facedIdx)) {
          if (g.toolsUpgraded) {
            g.addFloat(col, row, "Tools already upgraded!", "#A8D8A8");
            return;
          }
          if (g.gold >= 50 && g.stone >= 5) {
            g.gold -= 50;
            g.stone -= 5;
            g.toolsUpgraded = true;
            g.addFloat(col, row, "⚒️ Tools upgraded! +1 per chop/mine", "#FFD700");
            g.addParticles(col + 0.5, row + 0.5, "#FF6B6B", 10);
            g.timeOfDay += 8;
          } else {
            g.addFloat(col, row, `Need 50g + 5 stone (have ${g.gold}g, ${g.stone} stone)`, "#FF6B6B");
          }
          return;
        }
      }

      // Cave
      if (tile === 17) {
        if (!g.caveTreasureFound) {
          g.caveTreasureFound = true;
          g.gold += 50;
          g.treasuresFound++;
          g.addFloat(col, row, "🕳️ Ancient treasure! +50g", "#FFD700");
          g.addParticles(col + 0.5, row + 0.5, "#FFD700", 12);
        } else {
          const loot = 5 + Math.floor(Math.random() * 11);
          g.gold += loot;
          g.addFloat(col, row, `🕳️ Found ${loot}g`, "#C49A3C");
        }
        g.timeOfDay += 5;
        return;
      }

      // Mine stone
      if (tile === 13) {
        const stoneYield = g.toolsUpgraded ? 3 : 2;
        g.stone += stoneYield;
        g.grit += 1;
        TILE_MAP[row * MAP_COLS + col] = 0;
        g.addFloat(col, row, `⛏️ +${stoneYield} stone`, "#888888");
        g.addParticles(col + 0.5, row + 0.5, "#888888", 8);
        g.timeOfDay += 5;
        return;
      }

      switch (tile) {
        case 7: {
          const tileIdx = row * MAP_COLS + col;
          const cropIdx = g.crops.findIndex((c) => c.tileIdx === tileIdx);
          if (cropIdx >= 0) {
            const crop = g.crops[cropIdx];
            const d = CROP_DATA[crop.type];
            if (crop.growth >= d.growDays) {
              const sell = g.buildings.includes("stand") ? Math.floor(d.sellPrice * 1.5) : d.sellPrice;
              g.gold += sell;
              g.cropsHarvested++;
              g.crops.splice(cropIdx, 1);
              g.addFloat(col, row, `${d.emoji} +${sell}g`, "#FFD700");
              g.addParticles(col + 0.5, row + 0.5, "#FFD700", 10);
              g.addParticles(col + 0.5, row + 0.5, "#66BB6A", 4);
              g.timeOfDay += 4;
            } else {
              crop.growth += 0.5;
              g.wisdom += 1;
              g.addFloat(col, row, "\uD83D\uDCA7 Watered!", "#4FC3F7");
              g.addParticles(col + 0.5, row + 0.5, "#4FC3F7", 6);
              g.timeOfDay += 3;
            }
          } else if (g.seeds.length > 0) {
            const seedType = g.seeds.shift()!;
            g.crops.push({ type: seedType, growth: 0, tileIdx });
            g.addFloat(col, row, `\uD83C\uDF31 Planted ${CROP_DATA[seedType].emoji}!`, "#66BB6A");
            g.addParticles(col + 0.5, row + 0.5, "#66BB6A", 8);
            g.timeOfDay += 3;
          } else {
            g.addFloat(col, row, "No seeds!", "#FF6B6B");
          }
          break;
        }
        case 1: {
          const woodYield = g.toolsUpgraded ? 3 : 2;
          g.wood += woodYield;
          g.woodEverGathered += woodYield;
          g.grit += 1;
          TILE_MAP[row * MAP_COLS + col] = 0;
          g.addFloat(col, row, `\uD83E\uDE93 +${woodYield} wood`, "#8B7355");
          g.addParticles(col + 0.5, row + 0.5, "#8B7355", 6);
          g.addParticles(col + 0.5, row + 0.5, "#4CAF50", 6);
          g.timeOfDay += 5;
          break;
        }
        case 8: {
          const hasCoop = g.buildings.includes("coop");
          if (!hasCoop) {
            const d = BUILDING_DATA.coop;
            if (g.gold >= d.goldCost && g.wood >= d.woodCost) {
              g.gold -= d.goldCost;
              g.wood -= d.woodCost;
              g.buildings.push("coop");
              g.addFloat(col, row, "\uD83D\uDD28 Coop built!", "#C49A3C");
              g.addParticles(col + 0.5, row + 0.5, "#C49A3C", 15);
              g.addParticles(col + 0.5, row + 0.5, "#FFF", 5);
              g.timeOfDay += 10;
            } else {
              g.addFloat(col, row, `Need ${d.goldCost}g + ${d.woodCost}w`, "#FF6B6B");
            }
          } else {
            const poultryCount = g.placedAnimals.filter((a) =>
              ["chicken", "duck", "goose"].includes(a.type)
            ).length;
            g.addFloat(col, row, `\uD83D\uDC14 ${poultryCount} bird${poultryCount !== 1 ? "s" : ""} in the coop`, "#C4A25A");
          }
          break;
        }
        case 9: {
          const hasBarn = g.buildings.includes("barn");
          if (!hasBarn) {
            const d = BUILDING_DATA.barn;
            if (g.gold >= d.goldCost && g.wood >= d.woodCost) {
              g.gold -= d.goldCost;
              g.wood -= d.woodCost;
              g.buildings.push("barn");
              g.addFloat(col, row, "\uD83D\uDD28 Barn built!", "#C49A3C");
              g.addParticles(col + 0.5, row + 0.5, "#C49A3C", 15);
              g.addParticles(col + 0.5, row + 0.5, "#FFF", 5);
              g.timeOfDay += 10;
            } else {
              g.addFloat(col, row, `Need ${d.goldCost}g + ${d.woodCost}w`, "#FF6B6B");
            }
          } else {
            g.showBuild = true;
            setOverlay("build");
            syncOverlayState();
          }
          break;
        }
        case 3: {
          g.charm += 1;
          g.addFloat(col, row, "\uD83C\uDFA3 +1 charm", "#4FC3F7");
          g.addParticles(col + 0.5, row + 0.5, "#4FC3F7", 6);
          g.timeOfDay += 5;
          break;
        }
      }
    }

    // OVERNIGHT PROCESSING
    function processOvernight(g: Game) {
      g.day++;
      g.season = getSeason(g.day);
      g.timeOfDay = 0;

      let cropIncome = 0;
      let animalIncome = 0;

      for (const crop of g.crops) {
        crop.growth += 1;
      }

      const toRemove: number[] = [];
      for (let i = 0; i < g.crops.length; i++) {
        const crop = g.crops[i];
        const d = CROP_DATA[crop.type];
        if (crop.growth >= d.growDays) {
          const sell = g.buildings.includes("stand") ? Math.floor(d.sellPrice * 1.5) : d.sellPrice;
          g.gold += sell;
          g.cropsHarvested++;
          cropIncome += sell;
          const c = crop.tileIdx % MAP_COLS;
          const r = Math.floor(crop.tileIdx / MAP_COLS);
          g.addFloat(c, r, `${d.emoji} +${sell}g`, "#FFD700");
          toRemove.push(i);
        }
      }
      for (let i = toRemove.length - 1; i >= 0; i--) {
        g.crops.splice(toRemove[i], 1);
      }

      for (const a of g.placedAnimals) {
        const d = ANIMAL_DATA[a.type];
        if (d.product && d.productValue > 0) {
          g.gold += d.productValue;
          animalIncome += d.productValue;
        }
      }

      if (cropIncome > 0 || animalIncome > 0) {
        const parts: string[] = [];
        if (animalIncome > 0) parts.push(`🐾 +${animalIncome}g`);
        if (cropIncome > 0) parts.push(`🌾 +${cropIncome}g`);
        g.addFloat(g.px, g.py - 1, `Overnight: ${parts.join(" ")}`, "#C49A3C");
      }

      // Respawn ground items
      g.spawnGroundItems(8);

      // Clear collected story NPCs
      g.storyNPCs = g.storyNPCs.filter((n) => !n.collected);

      // Spawn deer in forest occasionally
      if (g.day % 2 === 0 && !g.wildNPCs.some((w) => w.id === "deer" && w.active)) {
        g.wildNPCs.push({
          id: "deer", emoji: "🦌", x: 8 + Math.random() * 10, y: 2 + Math.random() * 4,
          targetX: 10, targetY: 3, moveTimer: 0,
          interactCount: 0, fleeTimer: 0, active: true,
        });
      }

      // Respawn duck on river if you own ducks
      const hasDucks = g.placedAnimals.some((a) => a.type === "duck");
      if (hasDucks) {
        const existingRiverDuck = g.wildNPCs.find((w) => w.id === "river_duck");
        if (!existingRiverDuck) {
          g.wildNPCs.push({
            id: "river_duck", emoji: "🦆", x: 10 + Math.random() * 20, y: 14.5,
            targetX: 20, targetY: 14.5, moveTimer: 0,
            interactCount: 0, fleeTimer: 0, active: true,
          });
        }
      }

      // Update party readiness each day
      g.partyReadiness = Math.min(
        100,
        Math.floor((g.questIndex / QUEST_CHAIN.length) * 50) +
          g.buildings.length * 5 +
          g.placedAnimals.length * 2 +
          Math.floor(g.cropsHarvested / 2)
      );

      if (g.day > 15) {
        g.gameOver = true;
        g.celebrationScore = g.calculateScore();
        const breakdown = buildScoreBreakdown(g);
        setScoreData({ total: g.celebrationScore, breakdown });
        g.showScore = true;
        setOverlay("score");
      } else {
        checkStoryEvents(g);
      }
    }

    function buildScoreBreakdown(g: Game): string {
      const lines: string[] = [];
      let animalScore = 0;
      for (const a of g.placedAnimals) animalScore += ANIMAL_DATA[a.type].scoreValue;
      lines.push(`Animals (${g.placedAnimals.length}): ${animalScore}`);

      let buildScore = 0;
      for (const b of g.buildings) buildScore += BUILDING_DATA[b].scoreValue;
      lines.push(`Buildings (${g.buildings.length}): ${buildScore}`);

      lines.push(`Crops harvested (${g.cropsHarvested}): ${g.cropsHarvested * 5}`);
      lines.push(`Stats (${g.grit + g.wisdom + g.charm}): ${(g.grit + g.wisdom + g.charm) * 2}`);
      lines.push(`Gold (${g.gold}): ${Math.floor(g.gold / 5)}`);

      const achievements: string[] = [];
      if (countPoultry(g.placedAnimals) >= 6) achievements.push("Full Coop");
      if (countLarge(g.placedAnimals) >= 4) achievements.push("Full Barn");
      if (g.cropsHarvested >= 10) achievements.push("Green Thumb");
      if (g.buildings.length >= 4) achievements.push("Master Builder");
      if (g.charm >= 30 || g.grit >= 30 || g.wisdom >= 30) achievements.push("Stat Master");
      if (g.placedAnimals.some((a) => a.type === "cat")) achievements.push("Cat Person");
      if (g.placedAnimals.length >= 8) achievements.push("Animal Kingdom");
      if (g.buildings.includes("pavilion")) achievements.push("Party Planner");
      if (g.zonesVisited.size >= 7) achievements.push("Explorer");
      if (g.treasuresFound >= 3) achievements.push("Treasure Hunter");
      if (g.fishCaught >= 10) achievements.push("Master Angler");
      if (g.honeyCollected >= 5) achievements.push("Beekeeper");
      if (g.zonesVisited.has("mountain")) achievements.push("Mountaineer");
      if (g.libraryVisits >= 5 && g.wisdom >= 20) achievements.push("Scholar");
      if (g.toolsUpgraded) achievements.push("Tool Master");
      if (g.fairyRingVisits >= 3) achievements.push("Fairy Friend");

      if (achievements.length > 0) {
        lines.push(`Achievements: ${achievements.join(", ")} (+${achievements.length * 25})`);
      }

      lines.push(`Quests: ${g.completedQuests.length}/${QUEST_CHAIN.length}`);
      lines.push(`Party Readiness: ${g.partyReadiness}%`);

      return lines.join("\n");
    }

    // GAME LOOP
    function gameLoop(timestamp: number) {
      if (!ctx) return;
      const dt = lastTime === 0 ? 1 / 30 : Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;
      const g = game;

      if (!g.started) {
        g.started = true;
        setStarted(true);
      }

      // Night transition logic
      if (g.nightPhase === "fading_out") {
        g.nightFade += dt * 1.25;
        if (g.nightFade >= 1) {
          g.nightFade = 1;
          g.nightPhase = "processing";
          processOvernight(g);
          checkMilestones(g);
          checkQuestProgress(g);
        }
      } else if (g.nightPhase === "processing") {
        g.nightPhase = "fading_in";
      } else if (g.nightPhase === "fading_in") {
        g.nightFade -= dt * 1.25;
        if (g.nightFade <= 0) {
          g.nightFade = 0;
          g.nightPhase = "dawn_text";
          g.dawnTimer = 2;
        }
      } else if (g.nightPhase === "dawn_text") {
        g.dawnTimer -= dt;
        if (g.dawnTimer <= 0) {
          g.nightPhase = "none";
        }
      }

      const overlayOpen = g.showShop || g.showBuild || g.showScore;

      if (g.nightPhase === "none" && !overlayOpen && !g.gameOver) {
        g.timeOfDay += dt * 1.6;
        if (g.timeOfDay >= 100 && g.nightPhase === "none") {
          g.nightPhase = "fading_out";
        }

        // Movement
        let mdx = 0;
        let mdy = 0;
        if (keys.has("w") || keys.has("arrowup")) mdy -= 1;
        if (keys.has("s") || keys.has("arrowdown")) mdy += 1;
        if (keys.has("a") || keys.has("arrowleft")) mdx -= 1;
        if (keys.has("d") || keys.has("arrowright")) mdx += 1;

        if (isTouchDevice && joystick.active) {
          mdx += joystick.dx;
          mdy += joystick.dy;
        }

        const moveLen = Math.sqrt(mdx * mdx + mdy * mdy);
        if (moveLen > 0.01) {
          const speed = 3.5 * dt;
          const nmx = (mdx / moveLen) * speed;
          const nmy = (mdy / moveLen) * speed;

          const nx = g.px + nmx;
          const ny = g.py + nmy;

          if (canWalkTo(nx, g.py)) {
            g.px = nx;
          }
          if (canWalkTo(g.px, ny)) {
            g.py = ny;
          }

          g.walkFrame += dt * 10;

          if (Math.abs(mdx) > Math.abs(mdy)) {
            g.facing = mdx > 0 ? 1 : 3;
          } else {
            g.facing = mdy > 0 ? 2 : 0;
          }
        } else {
          g.walkFrame = 0;
        }

        // Update visited tiles
        g.updateVisited();

        // Zone discovery
        const zone = getZoneName(g.px, g.py);
        if (zone && zone !== g.currentZone) {
          g.currentZone = zone;
          if (!g.discoveredZones.has(zone)) {
            g.discoveredZones.add(zone);
            g.showAchievement(zone);
          }
        }

        // Ground item collection
        for (let i = g.groundItems.length - 1; i >= 0; i--) {
          const item = g.groundItems[i];
          const gidx = item.x - g.px;
          const gidy = item.y - g.py;
          if (gidx * gidx + gidy * gidy < 0.8) {
            if (item.type === "coin" || item.type === "berry") {
              g.gold += item.value;
              g.addFloat(item.x, item.y, `${item.emoji} +${item.value}g`, "#FFD700");
            } else if (item.type === "gem") {
              g.gold += item.value;
              g.addFloat(item.x, item.y, `${item.emoji} +${item.value}g!`, "#E040FB");
            } else if (item.type === "seed") {
              const seasonCrops = Object.entries(CROP_DATA).filter(([, d]) => d.seasons.includes(g.season));
              if (seasonCrops.length > 0) {
                const [cropType] = seasonCrops[Math.floor(Math.random() * seasonCrops.length)];
                g.seeds.push(cropType as CropType);
                g.addFloat(item.x, item.y, `${item.emoji} Found ${CROP_DATA[cropType as CropType].emoji} seed!`, "#66BB6A");
              }
            } else if (item.type === "star") {
              const stat = Math.floor(Math.random() * 3);
              if (stat === 0) { g.grit++; g.addFloat(item.x, item.y, "\u2B50 +1 grit!", "#FFD700"); }
              else if (stat === 1) { g.wisdom++; g.addFloat(item.x, item.y, "\u2B50 +1 wisdom!", "#FFD700"); }
              else { g.charm++; g.addFloat(item.x, item.y, "\u2B50 +1 charm!", "#FFD700"); }
            } else if (item.type === "product") {
              g.gold += item.value;
              g.addFloat(item.x, item.y, `${item.emoji} +${item.value}g`, "#FFD700");
            }
            g.addParticles(item.x, item.y, "#FFD700", 6);
            g.groundItems.splice(i, 1);
            checkMilestones(g);
          }
        }

        // Action input (rising edge)
        const actionKey = keys.has(" ") || keys.has("e") || actionTouch.active;
        if (actionKey && !g.lastActionKey) {
          executeAction(g);
          checkMilestones(g);
          checkQuestProgress(g);
        }
        g.lastActionKey = actionKey;

        // Context-sensitive prompt
        const actionCtx = getActionContext(g);
        g.actionPrompt = actionCtx ? actionCtx.prompt : null;
        g.actionTargetX = actionCtx ? actionCtx.tx : 0;
        g.actionTargetY = actionCtx ? actionCtx.ty : 0;

        // Check quest progress each frame (for zone discoveries, etc.)
        checkQuestProgress(g);
      }

      // Update floats
      for (let i = g.floats.length - 1; i >= 0; i--) {
        g.floats[i].life -= dt * 0.67;
        if (g.floats[i].life <= 0) g.floats.splice(i, 1);
      }

      // Update particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += dt * 2;
        p.life -= dt;
        if (p.life <= 0) g.particles.splice(i, 1);
      }

      // Decay animal bounce/speech timers + product laying
      for (const a of g.placedAnimals) {
        if (a.bounceTimer > 0) a.bounceTimer = Math.max(0, a.bounceTimer - dt * 3);
        if (a.speechTimer > 0) a.speechTimer -= dt;
        // Animals drop products on the ground
        const ad = ANIMAL_DATA[a.type];
        if (ad.product && ad.productValue > 0) {
          a.productTimer -= dt;
          if (a.productTimer <= 0) {
            a.productTimer = 12 + Math.random() * 15;
            const PRODUCT_EMOJI: Record<string, string> = {
              egg: "🥚", "duck egg": "🥚", "goose egg": "🥚",
              "goat milk": "🥛", milk: "🥛", wool: "🧶", truffle: "🍄",
            };
            g.groundItems.push({
              x: a.x + (Math.random() - 0.5) * 0.8,
              y: a.y + 0.3 + Math.random() * 0.4,
              type: "product",
              emoji: PRODUCT_EMOJI[ad.product] || "📦",
              value: ad.productValue,
              sparklePhase: Math.random() * Math.PI * 2,
            });
            a.bounceTimer = 0.5;
            a.lastSpeech = a.type === "chicken" ? "🥚!" : a.type === "cow" ? "🥛!" : "!";
            a.speechTimer = 1.5;
          }
        }
      }

      // Achievement timer
      if (g.achievementTimer > 0) g.achievementTimer -= dt;

      // Update animal AI
      if (g.nightPhase === "none" && !overlayOpen) {
        const PEN_MIN_X = 8.2, PEN_MAX_X = 10.8, PEN_MIN_Y = 13.2, PEN_MAX_Y = 15.8;
        const FIELD_MIN_X = 16, FIELD_MAX_X = 21, FIELD_MIN_Y = 16.5, FIELD_MAX_Y = 19;
        for (const a of g.placedAnimals) {
          a.moveTimer += dt;
          if (a.moveTimer >= a.moveInterval) {
            a.moveTimer = 0;
            a.moveInterval = 2 + Math.random() * 3;
            const isPoultry = ["chicken", "duck", "goose"].includes(a.type);
            const isCatDog = ["cat", "dog"].includes(a.type);
            if (isPoultry) {
              a.targetX = PEN_MIN_X + Math.random() * (PEN_MAX_X - PEN_MIN_X);
              a.targetY = PEN_MIN_Y + Math.random() * (PEN_MAX_Y - PEN_MIN_Y);
            } else if (isCatDog) {
              a.targetX = 12 + Math.random() * 6;
              a.targetY = 10 + Math.random() * 4;
            } else {
              a.targetX = FIELD_MIN_X + Math.random() * (FIELD_MAX_X - FIELD_MIN_X);
              a.targetY = FIELD_MIN_Y + Math.random() * (FIELD_MAX_Y - FIELD_MIN_Y);
            }
          }
          const dx = a.targetX - a.x;
          const dy = a.targetY - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0.1) {
            const aspeed = 0.8 * dt;
            const newAx = a.x + (dx / dist) * aspeed;
            const newAy = a.y + (dy / dist) * aspeed;
            if (isWalkable(Math.floor(newAx), Math.floor(newAy))) {
              a.x = newAx;
              a.y = newAy;
            } else {
              a.moveTimer = a.moveInterval;
            }
          }
        }

        // Random animal chatter
        if (g.placedAnimals.length > 0 && Math.random() < dt * 0.15) {
          const chatAnimal = g.placedAnimals[Math.floor(Math.random() * g.placedAnimals.length)];
          if (chatAnimal && chatAnimal.speechTimer <= 0) {
            const pool = ANIMAL_SPEECH[chatAnimal.type];
            chatAnimal.lastSpeech = pool[Math.floor(Math.random() * pool.length)];
            chatAnimal.speechTimer = 2.5;
          }
        }

        // Wild NPC movement
        for (const w of g.wildNPCs) {
          if (!w.active) continue;
          w.moveTimer += dt;

          if (w.fleeTimer > 0) {
            w.fleeTimer -= dt;
            const dx = w.targetX - w.x;
            const dy = w.targetY - w.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.2) {
              const fspeed = 4 * dt;
              w.x += (dx / dist) * fspeed;
              w.y += (dy / dist) * fspeed;
            }
          } else {
            if (w.id === "deer") {
              // Deer flees when player gets close
              const dxp = w.x - g.px;
              const dyp = w.y - g.py;
              const pdist = Math.sqrt(dxp * dxp + dyp * dyp);
              if (pdist < 4) {
                w.fleeTimer = 2;
                w.targetX = w.x + (dxp / pdist) * 5;
                w.targetY = w.y + (dyp / pdist) * 3;
                w.targetX = Math.max(2, Math.min(22, w.targetX));
                w.targetY = Math.max(1, Math.min(6, w.targetY));
              }
            }
            if (w.id === "river_duck") {
              if (w.moveTimer > 3) {
                w.moveTimer = 0;
                w.targetX = 5 + Math.random() * 30;
                w.targetY = 14 + Math.random() * 1.5;
              }
              const dx = w.targetX - w.x;
              const dist = Math.abs(dx);
              if (dist > 0.2) {
                w.x += (dx > 0 ? 1 : -1) * 0.8 * dt;
              }
            }

            if (w.moveTimer > w.moveTimer + 3) {
              w.moveTimer = 0;
            }
          }

          // Remove deer that go out of bounds
          if (w.id === "deer" && (w.x < 1 || w.x > 38 || w.y < 1 || w.y > 28)) {
            w.active = false;
          }
        }

        // Story NPC movement (Zoe moves around!)
        for (const npc of g.storyNPCs) {
          if (npc.collected) continue;
          if (npc.id === "zoe") {
            npc.x += Math.sin(timestamp * 0.003) * dt * 2;
            npc.y += Math.cos(timestamp * 0.002 + 1) * dt * 1.5;
            npc.x = Math.max(8, Math.min(28, npc.x));
            npc.y = Math.max(8, Math.min(13, npc.y));
          }
        }
      }

      // RENDER
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Camera
      const mapPxW = MAP_COLS * tileSize;
      const mapPxH = MAP_ROWS * tileSize;
      let camX = g.px * tileSize - canvasW / 2 + tileSize / 2;
      let camY = g.py * tileSize - canvasH / 2 + tileSize / 2;
      camX = Math.max(0, Math.min(mapPxW - canvasW, camX));
      camY = Math.max(0, Math.min(mapPxH - canvasH, camY));

      if (mapPxW < canvasW) camX = -(canvasW - mapPxW) / 2;
      if (mapPxH < canvasH) camY = -(canvasH - mapPxH) / 2;

      // Background
      ctx.fillStyle = "#1D4420";
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Draw tiles (with viewport culling)
      const startCol = Math.max(0, Math.floor(camX / tileSize));
      const endCol = Math.min(MAP_COLS - 1, Math.ceil((camX + canvasW) / tileSize));
      const startRow = Math.max(0, Math.floor(camY / tileSize));
      const endRow = Math.min(MAP_ROWS - 1, Math.ceil((camY + canvasH) / tileSize));

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          drawTile(ctx, tileAt(c, r), c, r, g.season, tileSize, timestamp, camX, camY, g.buildings);
        }
      }

      // Fog of war overlay
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (!g.isRevealed(c, r)) {
            drawFogOverlay(ctx, c, r, tileSize, camX, camY);
          }
        }
      }

      // Draw crops
      for (const crop of g.crops) {
        drawCropOnTile(ctx, crop, tileSize, camX, camY, timestamp);
      }

      // Draw ground items
      drawGroundItems(ctx, g.groundItems, tileSize, camX, camY, timestamp);

      // Draw animals (sorted by y for depth)
      ctx.globalAlpha = 1;
      const sortedAnimals = [...g.placedAnimals].sort((a, b) => a.y - b.y);
      for (let i = 0; i < sortedAnimals.length; i++) {
        drawAnimalEntity(ctx, sortedAnimals[i], tileSize, camX, camY, timestamp, i);
      }

      // Draw wild NPCs
      for (const w of g.wildNPCs) {
        drawWildNPC(ctx, w, tileSize, camX, camY, timestamp);
      }

      // Draw story NPCs
      for (const npc of g.storyNPCs) {
        drawStoryNPC(ctx, npc, tileSize, camX, camY, timestamp);
      }

      // Draw player
      drawPlayer(ctx, g.px, g.py, g.facing, g.walkFrame, tileSize, camX, camY);

      // Draw particles
      drawParticles(ctx, g.particles, tileSize, camX, camY);

      // Draw floating text
      drawFloats(ctx, g.floats, tileSize, camX, camY);

      // Time overlay
      drawTimeOverlay(ctx, canvasW, canvasH, g.timeOfDay);

      // Action prompt
      if (g.actionPrompt && g.nightPhase === "none" && !overlayOpen) {
        drawActionPrompt(ctx, g.actionPrompt, g.actionTargetX, g.actionTargetY, tileSize, camX, camY);
      }

      // HUD
      drawHUD(ctx, g, canvasW, tileSize);

      // Quest hint (shown when no action prompt is visible)
      if (!g.actionPrompt && g.questIndex < QUEST_CHAIN.length && g.nightPhase === "none" && !overlayOpen) {
        const hint = QUEST_CHAIN[g.questIndex].hint;
        const hintY = canvasH - (isTouchDevice ? 130 : 30);
        ctx.fillStyle = "rgba(13,31,15,0.6)";
        ctx.fillRect(0, hintY, canvasW, 24);
        ctx.fillStyle = "#FDF8F088";
        ctx.font = `${Math.max(9, tileSize * 0.24)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hint, canvasW / 2, hintY + 12);
      }

      // Achievement banner
      drawAchievement(ctx, g, canvasW, canvasH);

      // Night fade
      drawNightFade(ctx, canvasW, canvasH, g.nightFade);

      // Dawn text
      if (g.nightPhase === "dawn_text") {
        drawDawnText(ctx, canvasW, canvasH, g.day, g.season, Math.min(g.dawnTimer, 1));
      }

      // Touch controls
      if (isTouchDevice && !overlayOpen) {
        const jbx = joystick.active ? joystick.baseX : 60;
        const jby = joystick.active ? joystick.baseY : canvasH - 75;
        const jkx = joystick.active ? joystick.knobX : jbx;
        const jky = joystick.active ? joystick.knobY : jby;
        drawVirtualControls(
          ctx, canvasW, canvasH,
          jbx, jby, jkx, jky,
          joystick.active,
          actionTouch.active,
          g.actionPrompt !== null
        );
      }

      animFrameId = requestAnimationFrame(gameLoop);
    }

    animFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
      resizeObs.disconnect();
    };
  }, [syncOverlayState, handleGameOver]);

  // Shop handler
  const handleShopBuy = useCallback((type: string, id: string) => {
    const g = gameRef.current;
    if (!g) return;

    if (type === "seeds") {
      const cropType = id as CropType;
      const d = CROP_DATA[cropType];
      const packCost = d.cost * 4;
      if (g.gold >= packCost) {
        g.gold -= packCost;
        for (let i = 0; i < 4; i++) g.seeds.push(cropType);
        g.addFloat(g.px, g.py, `Bought ${d.emoji} x4!`, "#66BB6A");
      } else {
        g.addFloat(g.px, g.py, `Need ${packCost}g`, "#FF6B6B");
      }
    } else if (type === "animal") {
      const animalType = id as AnimalType;
      const d = ANIMAL_DATA[animalType];
      const isPoultry = ["chicken", "duck", "goose"].includes(animalType);
      if (isPoultry && countPoultry(g.placedAnimals) >= 6) {
        g.addFloat(g.px, g.py, "Coop full!", "#FF6B6B");
        syncOverlayState();
        return;
      }
      if (!isPoultry && !["cat", "dog"].includes(animalType) && countLarge(g.placedAnimals) >= 4) {
        g.addFloat(g.px, g.py, "Barn full!", "#FF6B6B");
        syncOverlayState();
        return;
      }
      if (g.gold >= d.cost) {
        g.gold -= d.cost;
        const name = getAnimalName(animalType, g.placedAnimals);
        const PEN_MIN_X = 8.2, PEN_MAX_X = 10.8, PEN_MIN_Y = 13.2, PEN_MAX_Y = 15.8;
        const FIELD_MIN_X = 16, FIELD_MAX_X = 21, FIELD_MIN_Y = 16.5, FIELD_MAX_Y = 19;
        let sx: number, sy: number;
        if (isPoultry) {
          sx = PEN_MIN_X + Math.random() * (PEN_MAX_X - PEN_MIN_X);
          sy = PEN_MIN_Y + Math.random() * (PEN_MAX_Y - PEN_MIN_Y);
        } else if (["cat", "dog"].includes(animalType)) {
          sx = 10 + Math.random() * 6;
          sy = 9 + Math.random() * 3;
        } else {
          sx = FIELD_MIN_X + Math.random() * (FIELD_MAX_X - FIELD_MIN_X);
          sy = FIELD_MIN_Y + Math.random() * (FIELD_MAX_Y - FIELD_MIN_Y);
        }
        g.placedAnimals.push(g.makeAnimal(animalType, name, sx, sy));
        g.addFloat(g.px, g.py, `${d.emoji} ${name} joined!`, "#FFD700");
        checkMilestones(g);
      } else {
        g.addFloat(g.px, g.py, `Need ${d.cost}g`, "#FF6B6B");
      }
    }
    syncOverlayState();
  }, [syncOverlayState]);

  // Build handler
  const handleBuild = useCallback((buildType: BuildingType) => {
    const g = gameRef.current;
    if (!g) return;
    const d = BUILDING_DATA[buildType];
    if (g.gold >= d.goldCost && g.wood >= d.woodCost) {
      g.gold -= d.goldCost;
      g.wood -= d.woodCost;
      g.buildings.push(buildType);
      g.addFloat(g.px, g.py, `\uD83D\uDD28 ${d.label} built!`, "#C49A3C");
      g.addParticles(g.px, g.py, "#C49A3C", 15);
      g.addParticles(g.px, g.py, "#FFF", 5);
      g.timeOfDay += 10;
      checkMilestones(g);
    } else {
      g.addFloat(g.px, g.py, `Need ${d.goldCost}g + ${d.woodCost}w`, "#FF6B6B");
    }
    syncOverlayState();
  }, [syncOverlayState]);

  const closeOverlay = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    g.showShop = false;
    g.showBuild = false;
    setOverlay(null);
  }, []);

  const submitScore = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    handleGameOver(g.celebrationScore);
  }, [handleGameOver]);

  // Overlay style
  const overlayBaseStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "70%",
    overflowY: "auto",
    backgroundColor: "#1D4420F0",
    borderTop: "2px solid #C49A3C44",
    padding: "12px 16px",
    zIndex: 20,
    color: "#FDF8F0",
    fontFamily: "sans-serif",
  };

  const buttonStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "12px 12px",
                  minHeight: 44,
    margin: "4px 0",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid #C49A3C33",
    borderRadius: "6px",
    color: "#FDF8F0",
    fontSize: "14px",
    textAlign: "left",
    cursor: "pointer",
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.4,
    cursor: "not-allowed",
  };

  return (
    <div
      ref={containerRef}
      className="w-full relative"
      style={{ height: "calc(100dvh - 52px - env(safe-area-inset-bottom, 0px))" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: "none" }}
      />

      {!started && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: "rgba(13,31,15,0.9)", zIndex: 30 }}
        >
          <div style={{ color: "#C49A3C", fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
            Homestead
          </div>
          <div style={{ color: "#FDF8F0", fontSize: "14px", textAlign: "center", maxWidth: 300, lineHeight: 1.6, marginBottom: "20px" }}>
            Build up the farm and host the ultimate celebration party!{"\n\n"}
            Move: WASD / Arrow keys / Joystick{"\n"}
            Act: Space / E / Action button{"\n\n"}
            Follow the quests to explore, build, and get party-ready!
          </div>
          <div style={{ color: "#A8D8A8", fontSize: "12px" }}>
            Loading...
          </div>
        </div>
      )}

      {overlay === "shop" && (
        <div style={overlayBaseStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: "bold", fontSize: 16, color: "#C49A3C" }}>
              GENERAL STORE
            </span>
            <button
              onClick={closeOverlay}
              style={{ background: "none", border: "none", color: "#FDF8F0", fontSize: 20, cursor: "pointer", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              x
            </button>
          </div>

          <div style={{ fontSize: 12, color: "#A8D8A8", marginBottom: 6 }}>SEEDS (x4 pack)</div>
          {Object.entries(CROP_DATA)
            .filter(([, d]) => {
              const g = gameRef.current;
              return g && (d.seasons.includes(g.season) || g.buildings.includes("greenhouse"));
            })
            .map(([id, d]) => {
              const packCost = d.cost * 4;
              const canAfford = gold >= packCost;
              return (
                <button
                  key={id}
                  style={canAfford ? buttonStyle : disabledButtonStyle}
                  onClick={() => canAfford && handleShopBuy("seeds", id)}
                >
                  {d.emoji} {d.label} x4 &mdash; {packCost}g
                  <span style={{ float: "right", fontSize: 11, color: "#A8D8A8" }}>
                    {d.growDays}d, sells {d.sellPrice}g ea
                  </span>
                </button>
              );
            })}

          {gameRef.current?.buildings.includes("coop") && countPoultry(gameRef.current?.placedAnimals || []) < 6 && (
            <>
              <div style={{ fontSize: 12, color: "#A8D8A8", marginTop: 10, marginBottom: 6 }}>POULTRY</div>
              {(["chicken", "duck", "goose"] as AnimalType[]).map((type) => {
                const d = ANIMAL_DATA[type];
                const canAfford = gold >= d.cost;
                return (
                  <button
                    key={type}
                    style={canAfford ? buttonStyle : disabledButtonStyle}
                    onClick={() => canAfford && handleShopBuy("animal", type)}
                  >
                    {d.emoji} {d.label} &mdash; {d.cost}g
                    {d.product && (
                      <span style={{ float: "right", fontSize: 11, color: "#A8D8A8" }}>
                        {d.product} ({d.productValue}g/day)
                      </span>
                    )}
                  </button>
                );
              })}
            </>
          )}

          {gameRef.current?.buildings.includes("barn") && countLarge(gameRef.current?.placedAnimals || []) < 4 && (
            <>
              <div style={{ fontSize: 12, color: "#A8D8A8", marginTop: 10, marginBottom: 6 }}>LIVESTOCK</div>
              {(["goat", "sheep", "cow", "pig", "donkey"] as AnimalType[]).map((type) => {
                const d = ANIMAL_DATA[type];
                const canAfford = gold >= d.cost;
                return (
                  <button
                    key={type}
                    style={canAfford ? buttonStyle : disabledButtonStyle}
                    onClick={() => canAfford && handleShopBuy("animal", type)}
                  >
                    {d.emoji} {d.label} &mdash; {d.cost}g
                    {d.product ? (
                      <span style={{ float: "right", fontSize: 11, color: "#A8D8A8" }}>
                        {d.product} ({d.productValue}g/day)
                      </span>
                    ) : (
                      <span style={{ float: "right", fontSize: 11, color: "#A8D8A8" }}>
                        companion
                      </span>
                    )}
                  </button>
                );
              })}
            </>
          )}

          {!gameRef.current?.placedAnimals.some((a) => a.type === "cat") && (
            <button
              style={gold >= ANIMAL_DATA.cat.cost ? buttonStyle : disabledButtonStyle}
              onClick={() => gold >= ANIMAL_DATA.cat.cost && handleShopBuy("animal", "cat")}
            >
              {ANIMAL_DATA.cat.emoji} Barn Cat &mdash; {ANIMAL_DATA.cat.cost}g
            </button>
          )}
          {!gameRef.current?.placedAnimals.some((a) => a.type === "dog") && (
            <button
              style={gold >= ANIMAL_DATA.dog.cost ? buttonStyle : disabledButtonStyle}
              onClick={() => gold >= ANIMAL_DATA.dog.cost && handleShopBuy("animal", "dog")}
            >
              {ANIMAL_DATA.dog.emoji} Guardian Dog &mdash; {ANIMAL_DATA.dog.cost}g
            </button>
          )}

          <div style={{ textAlign: "right", marginTop: 8, fontSize: 13, color: "#C49A3C" }}>
            {gold}g &middot; {wood}w &middot; {seeds.length} seeds
          </div>
        </div>
      )}

      {overlay === "build" && (
        <div style={overlayBaseStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: "bold", fontSize: 16, color: "#C49A3C" }}>
              BUILD
            </span>
            <button
              onClick={closeOverlay}
              style={{ background: "none", border: "none", color: "#FDF8F0", fontSize: 20, cursor: "pointer", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              x
            </button>
          </div>

          {Object.entries(BUILDING_DATA)
            .filter(([k]) => {
              const g = gameRef.current;
              return g && !g.buildings.includes(k as BuildingType) && k !== "coop" && k !== "barn";
            })
            .map(([k, d]) => {
              const canAfford = gold >= d.goldCost && wood >= d.woodCost;
              return (
                <button
                  key={k}
                  style={canAfford ? buttonStyle : disabledButtonStyle}
                  onClick={() => canAfford && handleBuild(k as BuildingType)}
                >
                  {d.emoji} {d.label} &mdash; {d.goldCost}g + {d.woodCost}w
                  <span style={{ float: "right", fontSize: 11, color: "#A8D8A8" }}>
                    {d.desc}
                  </span>
                </button>
              );
            })}

          <div style={{ textAlign: "right", marginTop: 8, fontSize: 13, color: "#C49A3C" }}>
            {gold}g &middot; {wood}w
          </div>
        </div>
      )}

      {overlay === "score" && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(13,31,15,0.95)", zIndex: 30 }}
        >
          <div style={{ maxWidth: 360, padding: 24, textAlign: "center" }}>
            <div style={{ color: "#C49A3C", fontSize: 28, fontWeight: "bold", marginBottom: 4 }}>
              {gameRef.current?.buildings.includes("pavilion")
                ? "\uD83C\uDF89 The Party Pavilion Celebration!"
                : "\uD83C\uDF89 The Celebration!"}
            </div>
            <div style={{ color: "#FDF8F0AA", fontSize: 12, marginBottom: 12 }}>
              {scoreData.total >= 600 ? "\uD83C\uDF1F Legendary Brooker Ranch \u2014 the stuff of fairy tales!" :
               scoreData.total >= 450 ? "\u2728 Dream Estate \u2014 your farm is magnificent!" :
               scoreData.total >= 300 ? "\uD83D\uDDFA\uFE0F Grand Explorer \u2014 you've seen it all!" :
               scoreData.total >= 150 ? "\uD83C\uDF3F Thriving Farm \u2014 you've built something beautiful!" :
               "\uD83C\uDFE1 Cozy Homestead \u2014 a humble beginning!"}
            </div>
            <div style={{ color: "#FDF8F0", fontSize: 13, lineHeight: 1.6, marginBottom: 16, whiteSpace: "pre-line" }}>
              {scoreData.breakdown}
            </div>
            <div style={{ color: "#FFD700", fontSize: 32, fontWeight: "bold", marginBottom: 16 }}>
              {scoreData.total}
            </div>
            <button
              onClick={submitScore}
              style={{
                padding: "12px 32px",
                backgroundColor: "#C49A3C",
                color: "#1D4420",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Submit Score
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
