"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ============================================================
// TYPES
// ============================================================

type Season = "spring" | "summer" | "fall";
type Direction = "up" | "down" | "left" | "right";
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

interface PlacedAnimal {
  type: AnimalType;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  moveTimer: number;
  moveInterval: number;
}

interface Crop {
  type: CropType;
  daysGrown: number;
  tileIdx: number;
}

interface DialogChoice {
  id: string;
  emoji: string;
  text: string;
  subtext?: string;
  disabled?: boolean;
}

interface DialogState {
  title: string;
  text: string;
  choices: DialogChoice[];
}

interface NPC {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  active: boolean;
}

interface GameState {
  day: number;
  season: Season;
  timeOfDay: number;
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
  gameOver: boolean;
  dayTransition: boolean;
  pendingDialog: DialogState | null;
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
// TILE MAP (18 cols x 14 rows)
// 0=grass, 1=tree, 2=dirt_path, 3=water, 4=fence, 5=house_wall
// 6=house_door, 7=garden, 8=coop, 9=barn_tile, 10=flower, 11=rock, 12=town_exit
// ============================================================

const MAP_COLS = 18;
const MAP_ROWS = 14;

// prettier-ignore
const TILE_MAP: number[] = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 1,
  1, 5, 5, 5, 6, 2, 2, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 1,
  1, 5, 5, 5, 0, 0, 2, 0, 0, 8, 8, 0, 7, 7, 7, 7, 0, 1,
  1, 0, 0, 0, 0, 0, 2, 0, 0, 8, 8, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 4, 4, 4, 4, 2, 4, 4, 0, 0, 0, 0, 9, 9, 0, 0, 1,
  1, 0, 4, 0, 0, 0, 2, 0, 4, 0, 0, 0, 0, 9, 9, 0, 0, 1,
  1, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 3, 3, 3, 0, 0, 0, 1,
  1, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 3, 3, 3, 0, 0, 0, 1,
  1, 0, 4, 4, 0, 4, 4, 4, 4, 0, 0, 3, 3, 3, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 10,0, 1,
  1, 0, 10,0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 10,0, 0, 1,
  1, 0, 0, 0, 0, 0, 2, 2, 2,12,12, 2, 2, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

const WALKABLE_TILES = new Set([0, 2, 6, 7, 10, 12]);
const INTERACTION_TILES: Record<number, string> = {
  6: "house",
  7: "garden",
  8: "coop",
  9: "barn",
  3: "pond",
  1: "trees",
  12: "town",
  4: "fence",
};

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

// ============================================================
// SEASON COLORS
// ============================================================

const SEASON_PALETTE: Record<Season, {
  grass: string;
  grassLight: string;
  tree: string;
  treeTrunk: string;
  skyTop: string;
  skyBot: string;
  hillFar: string;
}> = {
  spring: {
    grass: "#4A7A3A",
    grassLight: "#5C8B4A",
    tree: "#3D7A3D",
    treeTrunk: "#5C3A1E",
    skyTop: "#87CEEB",
    skyBot: "#C8E6FF",
    hillFar: "#5C7A4A",
  },
  summer: {
    grass: "#356025",
    grassLight: "#3D6E2D",
    tree: "#2E5A2E",
    treeTrunk: "#5C3A1E",
    skyTop: "#5BA8DE",
    skyBot: "#87CEEB",
    hillFar: "#3E6B2A",
  },
  fall: {
    grass: "#6B6B2A",
    grassLight: "#7A7A33",
    tree: "#B8860B",
    treeTrunk: "#5C3A1E",
    skyTop: "#C49A3C",
    skyBot: "#E8C8B8",
    hillFar: "#8B7D3C",
  },
};

// ============================================================
// SCORING
// ============================================================

function calculateScore(state: GameState): number {
  let score = 0;
  for (const a of state.animals) score += ANIMAL_DATA[a.type].scoreValue;
  for (const b of state.buildings) score += BUILDING_DATA[b].scoreValue;
  score += state.cropsHarvested * 5;
  score += (state.grit + state.wisdom + state.charm) * 2;
  score += Math.floor(state.gold / 5);
  score += state.celebrationQuality * 5;
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
// INTERACTION DIALOG GENERATION
// ============================================================

function getHouseDialog(gs: GameState): DialogState {
  return {
    title: "Farmhouse",
    text: `You step inside the cozy farmhouse. The morning light streams through the windows. You can rest here, check your supplies, or call it a night.\n\nInventory: ${invCount(gs.inventory)} items${invCount(gs.inventory) > 0 ? " (" + Object.entries(gs.inventory).map(([k, v]) => `${k} x${v}`).join(", ") + ")" : ""}`,
    choices: [
      { id: "house_rest", emoji: "☕", text: "Rest and have some tea", subtext: "+5 time, +1 wisdom" },
      ...(gs.timeOfDay >= 70
        ? [{ id: "house_sleep", emoji: "😴", text: "Turn in for the night", subtext: "End the day" }]
        : []),
      ...(invCount(gs.inventory) > 0
        ? [{ id: "house_sell_inv", emoji: "💰", text: `Sell inventory (~${invValue(gs)}g)`, subtext: "Sell all stored goods" }]
        : []),
      { id: "dismiss", emoji: "🚪", text: "Head back outside" },
    ],
  };
}

function getGardenDialog(gs: GameState): DialogState {
  const gardenTiles = getGardenTileIndices();
  const usedTiles = new Set(gs.crops.map((c) => c.tileIdx));
  const freeTiles = gardenTiles.filter((t) => !usedTiles.has(t));
  const readyCrops = gs.crops.filter((c) => c.daysGrown >= CROP_DATA[c.type].growDays);
  const growingCrops = gs.crops.filter((c) => c.daysGrown < CROP_DATA[c.type].growDays);

  const availableSeeds = Object.entries(CROP_DATA).filter(
    ([, d]) => (d.seasons.includes(gs.season) || gs.buildings.includes("greenhouse")) && gs.gold >= d.cost
  );

  const choices: DialogChoice[] = [];

  if (readyCrops.length > 0) {
    choices.push({
      id: "garden_harvest",
      emoji: "🌾",
      text: `Harvest ${readyCrops.length} ready crop${readyCrops.length > 1 ? "s" : ""}`,
      subtext: readyCrops.map((c) => CROP_DATA[c.type].emoji).join(" "),
    });
  }
  if (growingCrops.length > 0) {
    choices.push({
      id: "garden_water",
      emoji: "💧",
      text: `Water ${growingCrops.length} growing crops`,
      subtext: "+1 day growth, +1 wisdom",
    });
  }
  if (freeTiles.length > 0 && availableSeeds.length > 0) {
    choices.push({
      id: "garden_plant",
      emoji: "🌱",
      text: `Plant seeds (${freeTiles.length} plots free)`,
      subtext: "Opens seed selection",
    });
  }
  choices.push({ id: "dismiss", emoji: "🚶", text: "Leave the garden" });

  return {
    title: "Garden",
    text: `${gs.crops.length} crops planted, ${freeTiles.length} plots available.\n${readyCrops.length > 0 ? `${readyCrops.map((c) => CROP_DATA[c.type].emoji + " " + CROP_DATA[c.type].label).join(", ")} ready to harvest!` : growingCrops.length > 0 ? "Your crops are growing nicely." : "The garden beds sit empty, full of potential."}`,
    choices,
  };
}

function getPlantSeedDialog(gs: GameState): DialogState {
  const availableSeeds = Object.entries(CROP_DATA).filter(
    ([, d]) => (d.seasons.includes(gs.season) || gs.buildings.includes("greenhouse")) && gs.gold >= d.cost
  );

  return {
    title: "Plant Seeds",
    text: `Choose what to plant. Current gold: ${gs.gold}g`,
    choices: [
      ...availableSeeds.slice(0, 5).map(([id, d]) => ({
        id: `plant_${id}`,
        emoji: d.emoji,
        text: d.label,
        subtext: `${d.cost}g, ${d.growDays}d to grow, sells for ${d.sellPrice}g`,
        disabled: gs.gold < d.cost,
      })),
      { id: "dismiss", emoji: "🚶", text: "Never mind" },
    ],
  };
}

function getCoopDialog(gs: GameState): DialogState {
  const hasBuiltCoop = gs.buildings.includes("coop");
  if (!hasBuiltCoop) {
    const d = BUILDING_DATA.coop;
    return {
      title: "Empty Foundation",
      text: "There's a foundation here where a chicken coop could go. You'd need materials to build it.",
      choices: [
        {
          id: "build_coop",
          emoji: "🔨",
          text: `Build Chicken Coop (${d.goldCost}g + ${d.woodCost} wood)`,
          subtext: d.desc,
          disabled: gs.gold < d.goldCost || gs.wood < d.woodCost,
        },
        { id: "dismiss", emoji: "🚶", text: "Not yet" },
      ],
    };
  }
  const poultryCount = countPoultry(gs.animals);
  const poultry = gs.animals.filter((a) => ["chicken", "duck", "goose"].includes(a.type));
  return {
    title: "Chicken Coop",
    text: `${poultryCount > 0 ? poultry.map((a) => `${ANIMAL_DATA[a.type].emoji} ${a.name}`).join(", ") + " cluck softly in their roost." : "The coop is empty and waiting for residents."}\n\n${poultryCount}/6 poultry housed.`,
    choices: [
      ...(poultryCount > 0
        ? [{
            id: "coop_collect",
            emoji: "🥚",
            text: "Collect eggs",
            subtext: "+products, +1 charm",
          }]
        : []),
      { id: "dismiss", emoji: "🚶", text: "Leave the coop" },
    ],
  };
}

function getBarnDialog(gs: GameState): DialogState {
  const hasBuiltBarn = gs.buildings.includes("barn");
  if (!hasBuiltBarn) {
    const d = BUILDING_DATA.barn;
    return {
      title: "Open Field",
      text: "A flat area perfect for a barn. With the right materials, you could build something here.",
      choices: [
        {
          id: "build_barn",
          emoji: "🔨",
          text: `Build Barn (${d.goldCost}g + ${d.woodCost} wood)`,
          subtext: d.desc,
          disabled: gs.gold < d.goldCost || gs.wood < d.woodCost,
        },
        ...Object.entries(BUILDING_DATA)
          .filter(([k]) => k !== "barn" && k !== "coop" && !gs.buildings.includes(k as BuildingType))
          .slice(0, 2)
          .map(([k, d]) => ({
            id: `build_${k}`,
            emoji: d.emoji,
            text: `Build ${d.label} (${d.goldCost}g + ${d.woodCost} wood)`,
            subtext: d.desc,
            disabled: gs.gold < d.goldCost || gs.wood < d.woodCost,
          })),
        { id: "dismiss", emoji: "🚶", text: "Not yet" },
      ],
    };
  }
  const largeCount = countLarge(gs.animals);
  const large = gs.animals.filter((a) => ["cow", "goat", "sheep", "pig", "donkey"].includes(a.type));
  return {
    title: "Barn",
    text: `${largeCount > 0 ? large.map((a) => `${ANIMAL_DATA[a.type].emoji} ${a.name}`).join(", ") + " shuffle in their stalls." : "The barn is empty, stalls waiting."}\n\n${largeCount}/4 large animals housed.`,
    choices: [
      ...(largeCount > 0
        ? [{
            id: "barn_tend",
            emoji: "🐾",
            text: "Tend to the animals",
            subtext: "+products, +1 charm",
          }]
        : []),
      ...Object.entries(BUILDING_DATA)
        .filter(([k]) => k !== "barn" && k !== "coop" && !gs.buildings.includes(k as BuildingType))
        .slice(0, 2)
        .map(([k, d]) => ({
          id: `build_${k}`,
          emoji: d.emoji,
          text: `Build ${d.label} (${d.goldCost}g + ${d.woodCost} wood)`,
          subtext: d.desc,
          disabled: gs.gold < d.goldCost || gs.wood < d.woodCost,
        })),
      { id: "dismiss", emoji: "🚶", text: "Leave the barn" },
    ],
  };
}

function getPondDialog(): DialogState {
  return {
    title: "Pond",
    text: "The pond glimmers in the light. Dragonflies skim the surface and reeds sway gently. A peaceful spot.",
    choices: [
      { id: "pond_fish", emoji: "🎣", text: "Try fishing", subtext: "+1 wisdom, chance of catch" },
      { id: "pond_relax", emoji: "✨", text: "Sit and enjoy the view", subtext: "+1 charm" },
      { id: "dismiss", emoji: "🚶", text: "Leave the pond" },
    ],
  };
}

function getTreesDialog(gs: GameState): DialogState {
  return {
    title: "Woods",
    text: `Tall trees surround the farm, full of birdsong and dappled light. You have ${gs.wood} wood stockpiled.`,
    choices: [
      { id: "trees_chop", emoji: "🪓", text: "Chop firewood", subtext: "+2 wood, +1 grit" },
      { id: "trees_forage", emoji: "🍄", text: "Forage for supplies", subtext: "+items, +1 wisdom" },
      { id: "dismiss", emoji: "🚶", text: "Leave the woods" },
    ],
  };
}

function getTownDialog(gs: GameState): DialogState {
  const canPoultry = gs.buildings.includes("coop") && countPoultry(gs.animals) < 6;
  const canLarge = gs.buildings.includes("barn") && countLarge(gs.animals) < 4;
  const choices: DialogChoice[] = [];

  choices.push({ id: "town_shop_seeds", emoji: "🌱", text: "Buy seeds", subtext: "Opens seed shop" });

  if (canPoultry) {
    choices.push({ id: "town_shop_poultry", emoji: "🐔", text: "Buy poultry", subtext: "Chickens, ducks, geese" });
  }
  if (canLarge) {
    choices.push({ id: "town_shop_large", emoji: "🐄", text: "Buy large animals", subtext: "Cows, goats, sheep, pigs, donkeys" });
  }
  if (!gs.animals.some((a) => a.type === "cat")) {
    choices.push({ id: "buy_animal_cat", emoji: "🐱", text: `Buy Barn Cat (${ANIMAL_DATA.cat.cost}g)`, subtext: "Mouse control", disabled: gs.gold < ANIMAL_DATA.cat.cost });
  }
  if (!gs.animals.some((a) => a.type === "dog")) {
    choices.push({ id: "buy_animal_dog", emoji: "🐕", text: `Buy Guardian Dog (${ANIMAL_DATA.dog.cost}g)`, subtext: "Predator protection", disabled: gs.gold < ANIMAL_DATA.dog.cost });
  }
  if (invCount(gs.inventory) > 0) {
    choices.push({ id: "town_sell", emoji: "💰", text: `Sell all goods (~${invValue(gs)}g)`, subtext: "Sell everything at the general store" });
  }
  choices.push({ id: "town_socialize", emoji: "🤝", text: "Chat with the neighbors", subtext: "+2 charm, +5g" });
  choices.push({ id: "dismiss", emoji: "🚶", text: "Head back to the farm" });

  return {
    title: "Town",
    text: `The town is tiny and perfect — a general store, a library, and a community hall. Old Mae waves from behind the counter.\n\nYour gold: ${gs.gold}g`,
    choices: choices.slice(0, 6),
  };
}

function getPoultryShopDialog(gs: GameState): DialogState {
  const choices: DialogChoice[] = [];
  for (const type of ["chicken", "duck", "goose"] as AnimalType[]) {
    const d = ANIMAL_DATA[type];
    choices.push({
      id: `buy_animal_${type}`,
      emoji: d.emoji,
      text: `${d.label} (${d.cost}g)`,
      subtext: d.product ? `Produces ${d.product}` : "",
      disabled: gs.gold < d.cost || countPoultry(gs.animals) >= 6,
    });
  }
  choices.push({ id: "dismiss", emoji: "🚶", text: "Back" });
  return {
    title: "Poultry for Sale",
    text: `Old Mae gestures to the poultry yard behind the store. ${countPoultry(gs.animals)}/6 coop slots used. Gold: ${gs.gold}g`,
    choices,
  };
}

function getLargeAnimalShopDialog(gs: GameState): DialogState {
  const choices: DialogChoice[] = [];
  for (const type of ["goat", "sheep", "cow", "pig", "donkey"] as AnimalType[]) {
    const d = ANIMAL_DATA[type];
    choices.push({
      id: `buy_animal_${type}`,
      emoji: d.emoji,
      text: `${d.label} (${d.cost}g)`,
      subtext: d.product ? `Produces ${d.product}` : "Companion animal",
      disabled: gs.gold < d.cost || countLarge(gs.animals) >= 4,
    });
  }
  choices.push({ id: "dismiss", emoji: "🚶", text: "Back" });
  return {
    title: "Livestock for Sale",
    text: `The livestock pen behind the general store. ${countLarge(gs.animals)}/4 barn slots used. Gold: ${gs.gold}g`,
    choices,
  };
}

function getSeedShopDialog(gs: GameState): DialogState {
  const gardenTiles = getGardenTileIndices();
  const usedTiles = new Set(gs.crops.map((c) => c.tileIdx));
  const freePlots = gardenTiles.filter((t) => !usedTiles.has(t)).length;

  const availableSeeds = Object.entries(CROP_DATA).filter(
    ([, d]) => d.seasons.includes(gs.season) || gs.buildings.includes("greenhouse")
  );

  return {
    title: "Seed Shop",
    text: `"What'll it be, farmer?" asks Mae. You have ${freePlots} garden plots free. Gold: ${gs.gold}g`,
    choices: [
      ...availableSeeds.slice(0, 5).map(([id, d]) => ({
        id: `buy_seed_${id}`,
        emoji: d.emoji,
        text: `${d.label} Seeds (${d.cost}g)`,
        subtext: `${d.growDays}d to grow, sells for ${d.sellPrice}g`,
        disabled: gs.gold < d.cost || freePlots <= 0,
      })),
      { id: "dismiss", emoji: "🚶", text: "Back" },
    ],
  };
}

function getFenceDialog(): DialogState {
  return {
    title: "Animal Pen",
    text: "A sturdy fence surrounds the animal pen. The gate is open, and you can hear contented animal sounds from within.",
    choices: [{ id: "dismiss", emoji: "🚶", text: "Move along" }],
  };
}

// ============================================================
// STORY BEAT DIALOGS
// ============================================================

function getStoryBeat(gs: GameState): DialogState | null {
  const { day, usedEvents } = gs;

  if (day === 1 && !usedEvents.includes("day1_intro")) {
    return {
      title: "Welcome to the Homestead",
      text: "You stand at the edge of an overgrown field, keys jangling in your pocket. This is it — your 10 acres of wild possibility.\n\nA weathered farmhouse sits at the center, porch sagging slightly but welcoming. Somewhere in the tall grass, something clucks.\n\nA note on the door reads: \"Welcome! The chickens are around here somewhere. Good luck. — Previous Owner\"\n\nExplore the farm! Walk with WASD or the joystick, and interact with things you find.",
      choices: [
        { id: "story_day1_chickens", emoji: "🐔", text: "Start by finding those chickens!", subtext: "+3 chickens" },
        { id: "story_day1_explore", emoji: "🌱", text: "Look around first", subtext: "+1 wisdom" },
      ],
    };
  }

  if (day === 4 && !usedEvents.includes("kids_visit")) {
    return {
      title: "Visitors!",
      text: "You hear excited voices coming up the drive. It's the kids! Emmett (11) charges ahead with boundless energy, already eyeing the woodpile. Sapphire (8) trails behind, pockets bulging with craft supplies and a hand-drawn map of where she thinks \"the fairies live.\"\n\n\"Can we help?!\" they chorus.",
      choices: [
        { id: "kids_emmett_wood", emoji: "🪓", text: "Put Emmett on firewood duty", subtext: "+4 wood, +1 grit" },
        { id: "kids_sapphire_names", emoji: "✨", text: "Let Sapphire name the animals", subtext: "+2 charm" },
        { id: "kids_garden", emoji: "🌱", text: "Garden time — all hands on deck", subtext: "Crops +2 growth" },
        { id: "kids_adventure", emoji: "🗺️", text: "Follow Sapphire's fairy map", subtext: "+1 wisdom, +1 charm, surprise!" },
      ],
    };
  }

  if (day === 7 && !usedEvents.includes("stray_animal")) {
    const hasCat = gs.animals.some((a) => a.type === "cat");
    const hasDog = gs.animals.some((a) => a.type === "dog");
    if (!hasCat || !hasDog) {
      return {
        title: "A Visitor on the Porch",
        text: !hasCat
          ? "A scruffy black cat with wise green eyes is sitting on the porch railing like he owns the place. He looks at you with an expression that says \"I live here now.\""
          : "A medium-sized mutt with soulful brown eyes is curled up by the door. Her tail thumps hopefully when she sees you.",
        choices: [
          ...(!hasCat
            ? [{ id: "stray_cat", emoji: "🐱", text: "Welcome Bruce the barn cat", subtext: "+barn cat, mouse control" }]
            : []),
          ...(!hasDog
            ? [{ id: "stray_dog", emoji: "🐕", text: "Take in Bella the guardian dog", subtext: "+guardian dog, protection" }]
            : []),
          ...(!hasCat && !hasDog
            ? [{ id: "stray_both", emoji: "❤️", text: "Take them both in!", subtext: "+cat +dog, -15g" }]
            : []),
          { id: "stray_none", emoji: "👋", text: "Shoo them away", subtext: "They look sad" },
        ],
      };
    }
  }

  if (day === 10 && !usedEvents.includes("midsummer")) {
    return {
      title: "Midsummer Night Festival!",
      text: "Fairy lights are strung between the trees in town, and the whole community has come out. There's music, dancing, and someone has set up an arm-wrestling station. The smell of fresh pie drifts through the warm air.",
      choices: [
        { id: "mid_dance", emoji: "💃", text: "Dance the night away", subtext: "+3 charm" },
        { id: "mid_wrestle", emoji: "💪", text: "Enter the arm-wrestling contest", subtext: "+2 grit" },
        { id: "mid_pie", emoji: "🥧", text: "Enter the pie contest", subtext: "+2 wisdom, +1 charm" },
        { id: "mid_socialize", emoji: "🤝", text: "Work the crowd", subtext: "+4 charm" },
      ],
    };
  }

  if (day === 13 && !usedEvents.includes("zoe_adventure")) {
    return {
      title: "Zoe's Zoomies!",
      text: "Chaos erupts! Zoe — the small black dog with the grey muzzle, self-proclaimed \"couch commander\" — has somehow gotten loose and is doing zoomies through the entire farm. She's already knocked over the water trough, startled the chickens into temporary flight, and is now heading straight for the garden at approximately 900 mph.",
      choices: [
        { id: "zoe_chase", emoji: "🏃", text: "Sprint after her!", subtext: "+2 grit, hilarious" },
        { id: "zoe_treats", emoji: "🦴", text: "Shake the treat bag", subtext: "+1 wisdom, she leads you somewhere" },
        { id: "zoe_let_run", emoji: "😂", text: "Just let her run it out", subtext: "+1 charm, she befriends every animal" },
      ],
    };
  }

  return null;
}

// ============================================================
// RANDOM EVENTS
// ============================================================

function tryRandomEvent(gs: GameState): DialogState | null {
  if (Math.random() > 0.3) return null;

  const events: { id: string; cond: boolean; gen: () => DialogState }[] = [
    {
      id: "fox_attack",
      cond: countPoultry(gs.animals) > 0 && gs.day > 2,
      gen: () => {
        const hasDog = gs.animals.some((a) => a.type === "dog");
        return {
          title: "Fox Alert!",
          text: hasDog
            ? `Your guardian dog races toward the coop, where a fox is slinking away. ${gs.animals.find((a) => a.type === "dog")?.name} chases it off with authority. Good dog.`
            : "Suspicious paw prints near the coop. A fox has been visiting. Your birds are huddled together looking deeply offended.",
          choices: hasDog
            ? [
                { id: "fox_praise", emoji: "🐕", text: "Give extra treats", subtext: "+1 charm" },
                { id: "fox_fence", emoji: "🔨", text: "Reinforce the fence", subtext: "-2 wood, +1 grit" },
              ]
            : [
                { id: "fox_fence", emoji: "🔨", text: "Build better fencing", subtext: "-3 wood, +1 grit" },
                { id: "fox_lose", emoji: "😢", text: "Too late — lost a chicken", subtext: "-1 poultry" },
              ],
        };
      },
    },
    {
      id: "goat_escape",
      cond: gs.animals.some((a) => a.type === "goat"),
      gen: () => {
        const goat = gs.animals.find((a) => a.type === "goat")!;
        return {
          title: "Goat on the Roof!",
          text: `${goat.name} has escaped. Again. You find the goat standing on the roof of the chicken coop, eating wildflowers with an expression of pure bliss and zero remorse.`,
          choices: [
            { id: "goat_lure", emoji: "🍎", text: "Lure them down with an apple", subtext: "+1 wisdom" },
            { id: "goat_climb", emoji: "🧗", text: "Climb up and carry them down", subtext: "+2 grit" },
            { id: "goat_wait", emoji: "😤", text: "Wait. They'll come down eventually.", subtext: "+1 charm" },
          ],
        };
      },
    },
    {
      id: "storm_coming",
      cond: gs.crops.length > 0 && gs.day > 3,
      gen: () => ({
        title: "Storm Approaching!",
        text: `Dark clouds are piling up on the horizon. ${gs.wisdom > 15 ? "Your almanac predicted this." : "This doesn't look good."} A storm is coming, and your crops are exposed.`,
        choices: [
          { id: "storm_cover", emoji: "🛡️", text: "Rush to cover the garden", subtext: "+1 grit" },
          { id: "storm_pray", emoji: "🙏", text: "Hope for the best", subtext: "50/50 crops survive" },
          ...(gs.buildings.includes("greenhouse") ? [{ id: "storm_greenhouse", emoji: "🏡", text: "Move to greenhouse", subtext: "Save all crops!" }] : []),
        ],
      }),
    },
    {
      id: "bruce_gift",
      cond: gs.animals.some((a) => a.type === "cat") && gs.day > 3,
      gen: () => ({
        title: "Bruce's Gift",
        text: "Bruce the barn cat drops something at your feet with tremendous pride. It's a dead mouse. He stares at you expectantly, clearly waiting for applause.",
        choices: [
          { id: "bruce_praise", emoji: "👏", text: "Tell Bruce he's the greatest", subtext: "+1 charm" },
          { id: "bruce_treat", emoji: "🐟", text: "Reward with a special treat", subtext: "-2g, Bruce is pleased" },
        ],
      }),
    },
    {
      id: "neighbor_help",
      cond: gs.day > 2,
      gen: () => ({
        title: "Neighbor Needs Help",
        text: "Old Mae knocks on your door, looking frazzled. \"My fence is down and the chickens are everywhere. Any chance you could lend a hand?\"",
        choices: [
          { id: "help_mae", emoji: "🤝", text: "Of course! Let's wrangle chickens.", subtext: "+3 charm, +1 grit" },
          { id: "help_decline", emoji: "😅", text: "Sorry Mae, I'm swamped today", subtext: "Mae remembers..." },
        ],
      }),
    },
    {
      id: "traveling_merchant",
      cond: gs.gold >= 20,
      gen: () => ({
        title: "Traveling Merchant",
        text: "A colorful wagon pulls up with a sign: \"EXOTIC SEEDS & CURIOUS GOODS.\" The merchant tips their enormous hat.",
        choices: [
          { id: "merchant_seeds", emoji: "🌱", text: "Buy mystery seeds", subtext: "-20g, could be amazing" },
          { id: "merchant_tool", emoji: "🔧", text: "Buy a fancy tool", subtext: "-30g, +2 grit" },
          { id: "merchant_book", emoji: "📚", text: "Buy a rare almanac", subtext: "-25g, +3 wisdom" },
          { id: "merchant_pass", emoji: "👋", text: "Just browsing", subtext: "Free" },
        ],
      }),
    },
    {
      id: "market_day",
      cond: invCount(gs.inventory) > 0,
      gen: () => ({
        title: "Market Day!",
        text: `A horse-drawn cart rattles up. "Double prices today!" Your inventory is worth ~${invValue(gs) * 2}g at these prices.`,
        choices: [
          { id: "market_sell_all", emoji: "💰", text: "Sell everything!", subtext: `+${invValue(gs) * 2}g` },
          { id: "market_sell_half", emoji: "🤔", text: "Sell half, keep the good stuff", subtext: `+${Math.floor(invValue(gs))}g` },
          { id: "dismiss", emoji: "👋", text: "No thanks" },
        ],
      }),
    },
  ];

  const eligible = events.filter((e) => !gs.usedEvents.includes(e.id) && e.cond);
  if (eligible.length === 0) return null;
  return pickRandom(eligible).gen();
}

// ============================================================
// APPLY DIALOG CHOICE
// ============================================================

function applyDialogChoice(
  id: string,
  gs: GameState
): { gs: GameState; resultDialog: DialogState | null; timeAdvance: number } {
  const s: GameState = {
    ...gs,
    animals: [...gs.animals],
    crops: [...gs.crops],
    buildings: [...gs.buildings],
    inventory: { ...gs.inventory },
    usedEvents: [...gs.usedEvents],
    pendingDialog: null,
  };
  let resultText = "";
  let timeAdvance = 15;

  switch (id) {
    case "dismiss":
      return { gs: s, resultDialog: null, timeAdvance: 0 };

    // House
    case "house_rest":
      s.wisdom += 1;
      timeAdvance = 5;
      resultText = "You sit with a cup of tea and leaf through a farming book. The warmth is restorative.";
      break;
    case "house_sleep":
      s.dayTransition = true;
      timeAdvance = 0;
      return { gs: s, resultDialog: null, timeAdvance: 0 };
    case "house_sell_inv": {
      const val = invValue(s);
      s.gold += val;
      s.inventory = {};
      resultText = `Sold all goods for ${val}g! Old Mae would approve.`;
      break;
    }

    // Garden
    case "garden_harvest": {
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
      resultText = `Harvested: ${harvested.join(", ")}. Fresh from the earth!`;
      break;
    }
    case "garden_water":
      s.wisdom += 1;
      s.crops = s.crops.map((c) => ({ ...c, daysGrown: c.daysGrown + 1 }));
      resultText = "You water each row carefully. The garden responds to your attention — you can almost see things growing.";
      break;
    case "garden_plant":
      return { gs: s, resultDialog: getPlantSeedDialog(s), timeAdvance: 0 };

    // Planting
    default:
      if (id.startsWith("plant_")) {
        const cropId = id.replace("plant_", "") as CropType;
        const d = CROP_DATA[cropId];
        if (s.gold >= d.cost) {
          const gardenTiles = getGardenTileIndices();
          const usedTiles = new Set(s.crops.map((c) => c.tileIdx));
          const freeTile = gardenTiles.find((t) => !usedTiles.has(t));
          if (freeTile !== undefined) {
            s.gold -= d.cost;
            s.crops = [...s.crops, { type: cropId, daysGrown: 0, tileIdx: freeTile }];
            resultText = `${d.emoji} ${d.label} planted! It'll be ready in ${d.growDays} days.`;
          }
        }
        break;
      }
      if (id.startsWith("buy_seed_")) {
        const cropId = id.replace("buy_seed_", "") as CropType;
        const d = CROP_DATA[cropId];
        if (s.gold >= d.cost) {
          const gardenTiles = getGardenTileIndices();
          const usedTiles = new Set(s.crops.map((c) => c.tileIdx));
          const freeTile = gardenTiles.find((t) => !usedTiles.has(t));
          if (freeTile !== undefined) {
            s.gold -= d.cost;
            s.crops = [...s.crops, { type: cropId, daysGrown: 0, tileIdx: freeTile }];
            resultText = `\"${d.label} seeds — excellent choice!\" Mae wraps them in brown paper.`;
          }
        }
        break;
      }
      if (id.startsWith("buy_animal_")) {
        const type = id.replace("buy_animal_", "") as AnimalType;
        const d = ANIMAL_DATA[type];
        if (s.gold >= d.cost) {
          const name = getAnimalName(type, s.animals);
          s.gold -= d.cost;
          s.animals = [...s.animals, { type, name }];
          resultText = `Welcome ${name} the ${d.label}! ${type === "cat" ? "They immediately knock something off a shelf." : type === "goat" ? "They immediately try to eat your receipt." : "They seem happy in their new home."}`;
        }
        break;
      }
      if (id.startsWith("build_")) {
        const key = id.replace("build_", "") as BuildingType;
        const d = BUILDING_DATA[key];
        if (s.gold >= d.goldCost && s.wood >= d.woodCost) {
          s.gold -= d.goldCost;
          s.wood -= d.woodCost;
          s.buildings = [...s.buildings, key];
          if (key === "garden") s.gardenPlots += 4;
          resultText = `The ${d.label} is built! ${key === "coop" ? "The chickens inspect it suspiciously, then claim it as their own." : key === "barn" ? "It's not the prettiest barn, but it's YOUR barn." : key === "pavilion" ? "Beautiful. You can already picture the celebration." : d.desc}`;
          timeAdvance = 20;
        }
        break;
      }
      break;

    // Coop / Barn
    case "coop_collect": {
      s.charm += 1;
      const poultry = s.animals.filter((a) => ["chicken", "duck", "goose"].includes(a.type));
      for (const a of poultry) {
        const d = ANIMAL_DATA[a.type];
        if (d.product) s.inventory = addInv(s.inventory, d.product);
      }
      resultText = "Eggs collected! The chickens eye you with grudging respect.";
      break;
    }
    case "barn_tend": {
      s.charm += 1;
      const large = s.animals.filter((a) => ["cow", "goat", "sheep", "pig", "donkey"].includes(a.type));
      for (const a of large) {
        const d = ANIMAL_DATA[a.type];
        if (d.product) s.inventory = addInv(s.inventory, d.product);
      }
      resultText = "Animals tended. They moo, baa, and oink their thanks.";
      break;
    }

    // Pond
    case "pond_fish":
      s.wisdom += 1;
      if (Math.random() > 0.4) {
        s.inventory = addInv(s.inventory, "fish");
        resultText = "You catch a beautiful trout! The pond is generous today.";
      } else {
        resultText = "No bites today, but the quiet is its own reward. +1 wisdom from patience.";
      }
      break;
    case "pond_relax":
      s.charm += 1;
      resultText = "You sit by the water and let the peace wash over you. Dragonflies dance in the light. +1 charm.";
      break;

    // Trees
    case "trees_chop":
      s.wood += 2;
      s.grit += 1;
      resultText = pickRandom([
        "Swing, split, stack. The rhythm is meditative. Your arms are getting stronger.",
        "The axe bites deep and the log splits clean. Two more for the pile.",
        "You chop until your arms burn. The woodpile grows. So do your biceps.",
      ]);
      break;
    case "trees_forage": {
      s.wisdom += 1;
      const finds = pickRandom([
        { item: "berries", count: 2, desc: "A hidden berry patch, heavy with fruit" },
        { item: "mushrooms", count: 2, desc: "Perfect chanterelles under an old oak" },
        { item: "wildflowers", count: 3, desc: "A meadow of wildflowers" },
        { item: "herbs", count: 2, desc: "Wild herbs growing along the creek" },
      ]);
      s.inventory = addInv(s.inventory, finds.item, finds.count);
      resultText = `${finds.desc}. +${finds.count} ${finds.item}`;
      break;
    }

    // Town
    case "town_shop_seeds":
      return { gs: s, resultDialog: getSeedShopDialog(s), timeAdvance: 0 };
    case "town_shop_poultry":
      return { gs: s, resultDialog: getPoultryShopDialog(s), timeAdvance: 0 };
    case "town_shop_large":
      return { gs: s, resultDialog: getLargeAnimalShopDialog(s), timeAdvance: 0 };
    case "town_sell": {
      const val = invValue(s);
      s.gold += val;
      s.inventory = {};
      resultText = `Sold goods for ${val}g! Mae nods approvingly.`;
      break;
    }
    case "town_socialize":
      s.charm += 2;
      s.gold += 5;
      resultText = pickRandom([
        "You help the Hendersons fix their barn door. They insist on paying and send you home with pickles.",
        "You help corral a neighbor's sheep. They're grateful and slip you a few dollars.",
        "The community garden needs weeding. You work alongside neighbors swapping stories. +2 charm, +5g",
      ]);
      break;

    // Story Beats
    case "story_day1_chickens":
      s.animals.push(
        { type: "chicken", name: "Henrietta" },
        { type: "chicken", name: "Cluck Norris" },
        { type: "chicken", name: "Eggatha" },
      );
      s.usedEvents.push("day1_intro");
      resultText = "After 20 minutes of bush-diving and some undignified crawling, you wrangle three chickens: Henrietta, Cluck Norris, and Eggatha. They immediately start pecking at your boots.";
      break;
    case "story_day1_explore":
      s.wisdom += 1;
      s.usedEvents.push("day1_intro");
      resultText = "You explore the property — the farmhouse is dusty but solid, the garden has potential, and the woods out back are beautiful. You find gardening books and a coffee can labeled 'Emergency Chicken Fund' with 10g inside.";
      s.gold += 10;
      break;

    case "kids_emmett_wood":
      s.wood += 4;
      s.grit += 1;
      s.usedEvents.push("kids_visit");
      resultText = "Emmett attacks the woodpile with the focus of someone who was born for this. \"I'm basically a lumberjack now,\" he announces. By afternoon, your wood supply has nearly doubled.";
      break;
    case "kids_sapphire_names":
      s.charm += 2;
      s.usedEvents.push("kids_visit");
      resultText = "Sapphire takes naming duties very seriously. She interviews each animal with a crayon-illustrated chart. You now have \"Princess Sparklefeather\" and \"Lord Fluffington the Brave.\" The animals approve.";
      break;
    case "kids_garden":
      s.crops = s.crops.map((c) => ({ ...c, daysGrown: c.daysGrown + 2 }));
      s.usedEvents.push("kids_visit");
      resultText = "Both kids take to gardening with enthusiasm. Emmett digs like treasure hunting. Sapphire whispers encouragements to the lettuce. \"Grow big, little lettuce. You can do it.\"";
      break;
    case "kids_adventure":
      s.wisdom += 1;
      s.charm += 1;
      s.gold += 15;
      s.usedEvents.push("kids_visit");
      resultText = "Sapphire's fairy map leads to a clearing with a forgotten apple tree and a rusted tin box with old coins. \"I TOLD you the map was real!\" Sapphire beams. Worth about 15g!";
      break;

    case "stray_cat":
      s.animals.push({ type: "cat", name: "Bruce" });
      s.usedEvents.push("stray_animal");
      resultText = "Bruce (you didn't choose the name — he just IS a Bruce) saunters inside. Within an hour, he's claimed the sunniest windowsill, intimidated the chickens, and caught a mouse.";
      break;
    case "stray_dog":
      s.animals.push({ type: "dog", name: "Bella" });
      s.usedEvents.push("stray_animal");
      resultText = "Bella practically vibrates with happiness. She immediately does a perimeter check and takes up position between the coop and the barn. You feel safer already.";
      break;
    case "stray_both":
      s.animals.push({ type: "cat", name: "Bruce" }, { type: "dog", name: "Bella" });
      s.gold = Math.max(0, s.gold - 15);
      s.usedEvents.push("stray_animal");
      resultText = "Bruce saunters in like he owns the place. Bella bounces in like she won the lottery. They size each other up, Bruce bops Bella on the nose, and they become instant best friends.";
      break;
    case "stray_none":
      s.usedEvents.push("stray_animal");
      s.charm = Math.max(0, s.charm - 1);
      resultText = "You shoo them away. The cat gives you withering disappointment. The dog's tail droops. But the cat is back on your porch by evening.";
      break;

    case "mid_dance":
      s.charm += 3;
      s.usedEvents.push("midsummer");
      resultText = "You dance until the stars come out. Your neighbors teach you their favorite steps. Nobody cares that you're not great — the joy is contagious.";
      break;
    case "mid_wrestle":
      s.grit += 2;
      s.usedEvents.push("midsummer");
      resultText = s.grit > 15
        ? "Your hand slams Big Earl's down and the crowd erupts! All that wood-chopping paid off."
        : "Big Earl pins you in three seconds. He's very nice about it. \"Keep choppin' that wood, farmer!\"";
      break;
    case "mid_pie":
      s.wisdom += 2;
      s.charm += 1;
      s.usedEvents.push("midsummer");
      resultText = "Your farm-to-table pie is a hit. Mae wins (she always wins), but you get \"Most Promising Newcomer.\" The ribbon is going on the fridge.";
      break;
    case "mid_socialize":
      s.charm += 4;
      s.usedEvents.push("midsummer");
      resultText = "By night's end, you've gotten three offers of farm help, two recipe swaps, and an invitation to the town book club (they mostly talk about goats).";
      break;

    case "zoe_chase":
      s.grit += 2;
      s.usedEvents.push("zoe_adventure");
      resultText = "You chase Zoe across the entire farm — through the garden, around the barn (twice), under the fence. She stops to roll in something terrible. You're both panting. She looks thrilled.";
      break;
    case "zoe_treats":
      s.wisdom += 1;
      s.gold += 20;
      s.usedEvents.push("zoe_adventure");
      resultText = "The treat bag works. Zoe leads you to a hidden clearing with abandoned gardening equipment worth about 20g. Zoe gets approximately 47 treats.";
      break;
    case "zoe_let_run":
      s.charm += 1;
      s.usedEvents.push("zoe_adventure");
      resultText = "Zoe introduces herself to every animal. She bows to the chickens. Play-bows to the goats. Bruce watches from the roof, unimpressed. She's asleep in a sunbeam by evening.";
      break;

    // Random events
    case "fox_praise":
      s.charm += 1;
      resultText = `${s.animals.find((a) => a.type === "dog")?.name || "The dog"} accepts praise with a dignified tail wag. Extra treats don't hurt.`;
      break;
    case "fox_fence":
      s.wood = Math.max(0, s.wood - (s.animals.some((a) => a.type === "dog") ? 2 : 3));
      s.grit += 1;
      resultText = "You reinforce the fence. Not glamorous, but your birds will sleep safer.";
      break;
    case "fox_lose": {
      const poultry = s.animals.filter((a) => ["chicken", "duck", "goose"].includes(a.type));
      if (poultry.length > 0) {
        const lost = poultry[poultry.length - 1];
        s.animals = s.animals.filter((a) => a !== lost);
        resultText = `${lost.name} is gone. The other birds are quiet today.`;
      } else {
        resultText = "The fox found nothing. Lucky.";
      }
      break;
    }
    case "goat_lure":
      s.wisdom += 1;
      resultText = "The apple trick works every time. The goat descends with the grace of a mountain goat.";
      break;
    case "goat_climb":
      s.grit += 2;
      resultText = "You scale the coop, scoop up the goat, and make it down. Mostly. One boot didn't make it.";
      break;
    case "goat_wait":
      s.charm += 1;
      resultText = "Twenty minutes of staring contest. The goat casually hops down like nothing happened. Classic goat.";
      break;
    case "storm_cover":
      s.grit += 1;
      resultText = "You cover the garden with tarps. The storm hits hard but your crops survive!";
      break;
    case "storm_pray":
      if (Math.random() > 0.5) {
        resultText = "The storm passes without too much damage. You got lucky.";
      } else {
        if (s.crops.length > 0) s.crops = s.crops.slice(0, -1);
        resultText = "The hail was too much. One crop patch didn't survive.";
      }
      break;
    case "storm_greenhouse":
      resultText = "Everything safe in the greenhouse. Best investment ever.";
      break;
    case "bruce_praise":
      s.charm += 1;
      resultText = "Bruce accepts your ovation with the dignity of a king. He bumps his head against your hand once before returning to patrol.";
      break;
    case "bruce_treat":
      s.gold = Math.max(0, s.gold - 2);
      resultText = "Bruce receives his treat with royal dignity, then resumes his eternal vigil over the grain shed.";
      break;
    case "help_mae":
      s.charm += 3;
      s.grit += 1;
      resultText = "Wrangling Mae's chickens is surprisingly athletic. By the time you catch the last one (behind the post office), you're both laughing and covered in feathers. Mae insists on lemonade.";
      break;
    case "help_decline":
      resultText = "Mae nods with a flicker of disappointment. In a small community, these things matter.";
      break;
    case "merchant_seeds": {
      s.gold -= 20;
      const gardenTiles = getGardenTileIndices();
      const usedTiles = new Set(s.crops.map((c) => c.tileIdx));
      const freeTile = gardenTiles.find((t) => !usedTiles.has(t));
      if (freeTile !== undefined) {
        s.crops = [...s.crops, { type: "strawberry", daysGrown: 1, tileIdx: freeTile }];
      }
      resultText = "Mystery seeds wrapped in silk. You plant them and sprouts show by morning. Fast growers.";
      break;
    }
    case "merchant_tool":
      s.gold = Math.max(0, s.gold - 30);
      s.grit += 2;
      resultText = "A beautifully balanced hoe with an applewood handle. Everything you do will be a little easier now.";
      break;
    case "merchant_book":
      s.gold = Math.max(0, s.gold - 25);
      s.wisdom += 3;
      resultText = "\"The Farmer's Complete Almanac, 47th Edition.\" Planting charts, animal care, weather prediction, even cheese-making. A treasure.";
      break;
    case "merchant_pass":
      resultText = "The merchant tips their hat. \"Next time, friend.\" The wagon rolls on.";
      timeAdvance = 5;
      break;
    case "market_sell_all": {
      const val = invValue(s) * 2;
      s.gold += val;
      s.inventory = {};
      resultText = `Sold everything at double prices! +${val}g. Feeling like a shrewd businessperson.`;
      break;
    }
    case "market_sell_half": {
      const val = Math.floor(invValue(s));
      s.gold += val;
      const keys = Object.keys(s.inventory);
      const half = keys.slice(0, Math.ceil(keys.length / 2));
      for (const k of half) delete s.inventory[k];
      resultText = `Sold the surplus, kept the premium stuff. +${val}g. Smart farming.`;
      break;
    }

    // Celebration
    case "celebration_submit": {
      s.gameOver = true;
      return { gs: s, resultDialog: null, timeAdvance: 0 };
    }
  }

  if (!resultText) {
    return { gs: s, resultDialog: null, timeAdvance };
  }

  return {
    gs: s,
    resultDialog: { title: "Result", text: resultText, choices: [{ id: "dismiss", emoji: "→", text: "Continue" }] },
    timeAdvance,
  };
}

// ============================================================
// CELEBRATION
// ============================================================

function getCelebrationDialog(gs: GameState): DialogState {
  const { animals, buildings, charm, grit, wisdom, cropsHarvested, celebrationQuality } = gs;
  const hasParty = buildings.includes("pavilion");
  const score = calculateScore(gs);
  const quality = charm + grit + wisdom + animals.length * 5 + buildings.length * 10 + celebrationQuality;

  let text: string;
  if (quality > 100 && hasParty) {
    text = `The fairy lights twinkle across the party pavilion as dozens of neighbors stream through the gate. Tables groan under fresh garden vegetables, artisan cheese, and homemade bread. ${animals.some((a) => a.type === "goat") ? "The goats have tiny bow ties (Sapphire's idea)." : ""} ${animals.some((a) => a.type === "cat") ? "Bruce claims the best seat — on top of the cake, briefly." : ""}\n\nEmmett's running the music. The sunset paints everything gold. As you look at what you've built — this farm, this community, this life — you smile. This isn't just a party. It's home.\n\nFINAL SCORE: ${score}`;
  } else if (quality > 50) {
    text = `The celebration is wonderful! Not perfect — goats ate some decorations, someone's kid fell in the duck pond — but it's REAL. Neighbors bring potluck dishes, the fiddle player shows up.\n\n${cropsHarvested > 5 ? "Your farm-fresh food is the star." : "The food is simple but good."} ${animals.length > 3 ? "The kids love the animals." : ""} You've built something good.\n\nFINAL SCORE: ${score}`;
  } else {
    text = `The celebration is intimate. You, ${animals.length > 0 ? `${animals[0].name},` : ""} and a few neighbors sit around a fire. It's enough. The farm is young. Everything starts somewhere.\n\nFINAL SCORE: ${score}`;
  }

  return {
    title: "The Celebration!",
    text,
    choices: [{ id: "celebration_submit", emoji: "🏆", text: `Submit Score: ${score}`, subtext: "See the leaderboard" }],
  };
}

// ============================================================
// DAY PROCESSING
// ============================================================

function processNewDay(gs: GameState): GameState {
  const s: GameState = {
    ...gs,
    day: gs.day + 1,
    timeOfDay: 0,
    dayTransition: false,
    crops: gs.crops.map((c) => ({ ...c, daysGrown: c.daysGrown + 1 })),
    inventory: { ...gs.inventory },
    animals: [...gs.animals],
    buildings: [...gs.buildings],
    usedEvents: [...gs.usedEvents],
    pendingDialog: null,
  };
  s.season = getSeason(s.day);

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

  for (const a of s.animals) {
    const d = ANIMAL_DATA[a.type];
    if (d.product && d.productValue > 0) {
      s.inventory = addInv(s.inventory, d.product);
    }
  }

  return s;
}

// ============================================================
// CANVAS DRAWING
// ============================================================

const TILE_SIZE = 32;

function drawTile(
  ctx: CanvasRenderingContext2D,
  tile: number,
  col: number,
  row: number,
  season: Season,
  time: number,
  camX: number,
  camY: number
) {
  const px = col * TILE_SIZE - camX;
  const py = row * TILE_SIZE - camY;
  const pal = SEASON_PALETTE[season];

  switch (tile) {
    case 0: // grass
      ctx.fillStyle = (col + row) % 2 === 0 ? pal.grass : pal.grassLight;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      if ((col * 7 + row * 13) % 5 === 0) {
        ctx.fillStyle = season === "fall" ? "#8B7D3C88" : "#2D5A2D88";
        ctx.fillRect(px + 8, py + 12, 2, 6);
        ctx.fillRect(px + 20, py + 8, 2, 5);
      }
      break;
    case 1: // tree
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = pal.treeTrunk;
      ctx.fillRect(px + 12, py + 16, 8, 16);
      ctx.fillStyle = pal.tree;
      ctx.beginPath();
      ctx.arc(px + 16, py + 12, 14, 0, Math.PI * 2);
      ctx.fill();
      if (season === "spring") {
        ctx.fillStyle = "#FFB6C144";
        ctx.beginPath();
        ctx.arc(px + 10, py + 8, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (season === "fall") {
        const leafOff = Math.sin(time * 0.001 + col * 3 + row) * 4;
        ctx.fillStyle = "#D2691E";
        ctx.fillRect(px + 8 + leafOff, py + 4, 3, 2);
      }
      break;
    case 2: // dirt path
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#7A6B4A";
      ctx.fillRect(px + 4, py + 4, 3, 3);
      ctx.fillRect(px + 20, py + 18, 4, 3);
      break;
    case 3: // water
      ctx.fillStyle = "#3A7ABB";
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#4A8ACC";
      {
        const shimmer = Math.sin(time * 0.003 + col * 2 + row) * 0.5 + 0.5;
        ctx.globalAlpha = shimmer * 0.4;
        ctx.fillRect(px + 4, py + 8, 24, 3);
        ctx.fillRect(px + 8, py + 20, 16, 2);
        ctx.globalAlpha = 1;
      }
      break;
    case 4: // fence
      ctx.fillStyle = (col + row) % 2 === 0 ? pal.grass : pal.grassLight;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py + 10, TILE_SIZE, 4);
      ctx.fillRect(px, py + 22, TILE_SIZE, 4);
      ctx.fillRect(px + 4, py + 4, 4, 24);
      ctx.fillRect(px + 24, py + 4, 4, 24);
      break;
    case 5: // house wall
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#7A6544";
      ctx.fillRect(px, py, TILE_SIZE, 2);
      ctx.fillRect(px, py, 2, TILE_SIZE);
      if ((col + row) % 3 === 0) {
        ctx.fillStyle = "#FFD70088";
        ctx.fillRect(px + 10, py + 10, 12, 12);
        ctx.fillStyle = "#5C3A1E";
        ctx.fillRect(px + 15, py + 10, 2, 12);
        ctx.fillRect(px + 10, py + 15, 12, 2);
      }
      break;
    case 6: // house door
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#5C3A1E";
      ctx.fillRect(px + 8, py + 2, 16, 28);
      ctx.fillStyle = "#C49A3C";
      ctx.fillRect(px + 20, py + 14, 3, 3);
      break;
    case 7: // garden
      ctx.fillStyle = "#5C4033";
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#4A3328";
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(px + 2, py + i * 8 + 2, 28, 2);
      }
      break;
    case 8: // coop
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#C4A25A";
      ctx.fillRect(px + 2, py + 8, 28, 22);
      ctx.fillStyle = "#8B6914";
      ctx.beginPath();
      ctx.moveTo(px, py + 8);
      ctx.lineTo(px + 16, py);
      ctx.lineTo(px + 32, py + 8);
      ctx.fill();
      break;
    case 9: // barn tile
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#8B3A3A";
      ctx.fillRect(px + 2, py + 6, 28, 24);
      ctx.fillStyle = "#6B2A2A";
      ctx.beginPath();
      ctx.moveTo(px, py + 6);
      ctx.lineTo(px + 16, py - 4);
      ctx.lineTo(px + 32, py + 6);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF44";
      ctx.fillRect(px + 10, py + 16, 12, 14);
      break;
    case 10: // flower
      ctx.fillStyle = (col + row) % 2 === 0 ? pal.grass : pal.grassLight;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      {
        const colors = ["#FFB6C1", "#FFD700", "#DDA0DD", "#FF6B6B"];
        const c = colors[(col + row) % colors.length];
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(px + 10, py + 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px + 22, py + 20, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(px + 9, py + 14, 2, 10);
        ctx.fillRect(px + 21, py + 23, 2, 7);
      }
      break;
    case 11: // rock
      ctx.fillStyle = (col + row) % 2 === 0 ? pal.grass : pal.grassLight;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#888";
      ctx.beginPath();
      ctx.ellipse(px + 16, py + 18, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#999";
      ctx.beginPath();
      ctx.ellipse(px + 16, py + 16, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 12: // town exit
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#C49A3C";
      ctx.fillRect(px + 4, py, 24, 4);
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "#FDF8F0";
      ctx.textAlign = "center";
      ctx.fillText("TOWN", px + 16, py + 22);
      break;
    default:
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  }
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  dir: Direction,
  walkFrame: number
) {
  const bobY = Math.abs(Math.sin(walkFrame * 0.15)) * 2;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 30, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body (green suit)
  ctx.fillStyle = "#1D4420";
  ctx.fillRect(px + 8, py + 12 - bobY, 16, 16);

  // Arms
  const armSwing = Math.sin(walkFrame * 0.15) * 3;
  ctx.fillStyle = "#1D4420";
  ctx.fillRect(px + 4, py + 14 - bobY + armSwing, 4, 10);
  ctx.fillRect(px + 24, py + 14 - bobY - armSwing, 4, 10);

  // Legs
  const legSwing = Math.sin(walkFrame * 0.15) * 4;
  ctx.fillStyle = "#2D3436";
  ctx.fillRect(px + 10, py + 26 - bobY, 5, 6);
  ctx.fillRect(px + 17, py + 26 - bobY, 5, 6);
  if (walkFrame > 0) {
    ctx.fillRect(px + 10 + legSwing, py + 26 - bobY, 5, 6);
    ctx.fillRect(px + 17 - legSwing, py + 26 - bobY, 5, 6);
  }

  // Head
  ctx.fillStyle = "#F4D1A0";
  ctx.beginPath();
  ctx.arc(px + 16, py + 8 - bobY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = "#5C3A1E";
  ctx.beginPath();
  ctx.arc(px + 16, py + 5 - bobY, 8, Math.PI, 0);
  ctx.fill();

  // Eyes based on direction
  ctx.fillStyle = "#333";
  if (dir === "down" || dir === "left" || dir === "right") {
    const eyeOff = dir === "left" ? -2 : dir === "right" ? 2 : 0;
    ctx.fillRect(px + 13 + eyeOff, py + 7 - bobY, 2, 2);
    ctx.fillRect(px + 17 + eyeOff, py + 7 - bobY, 2, 2);
  } else {
    ctx.fillRect(px + 13, py + 6 - bobY, 2, 2);
    ctx.fillRect(px + 17, py + 6 - bobY, 2, 2);
  }
}

function drawCropOnTile(
  ctx: CanvasRenderingContext2D,
  crop: Crop,
  col: number,
  row: number,
  camX: number,
  camY: number
) {
  const px = col * TILE_SIZE - camX;
  const py = row * TILE_SIZE - camY;
  const d = CROP_DATA[crop.type];
  const progress = Math.min(crop.daysGrown / d.growDays, 1);

  if (progress >= 1) {
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.emoji, px + 16, py + 22);
  } else {
    const height = 4 + progress * 14;
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(px + 14, py + 24 - height, 4, height);
    if (progress > 0.3) {
      ctx.fillStyle = "#66BB6A";
      ctx.fillRect(px + 10, py + 24 - height + 4, 4, 3);
      ctx.fillRect(px + 18, py + 24 - height + 6, 4, 3);
    }
  }
}

function drawAnimalEntity(
  ctx: CanvasRenderingContext2D,
  animal: PlacedAnimal,
  camX: number,
  camY: number,
  time: number
) {
  const px = animal.x * TILE_SIZE - camX;
  const py = animal.y * TILE_SIZE - camY;
  const bob = Math.sin(time * 0.003 + animal.x * 5) * 1.5;

  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(ANIMAL_DATA[animal.type].emoji, px + 16, py + 20 + bob);
}

function drawNPC(
  ctx: CanvasRenderingContext2D,
  npc: NPC,
  camX: number,
  camY: number,
  time: number
) {
  if (!npc.active) return;
  const px = npc.x * TILE_SIZE - camX;
  const py = npc.y * TILE_SIZE - camY;
  const bob = Math.sin(time * 0.002 + npc.x * 3) * 1;

  ctx.font = "22px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(npc.emoji, px + 16, py + 20 + bob);
}

function drawSky(
  ctx: CanvasRenderingContext2D,
  w: number,
  timeOfDay: number,
  season: Season
) {
  const pal = SEASON_PALETTE[season];
  const grad = ctx.createLinearGradient(0, 0, 0, 40);

  const evening = timeOfDay > 70;
  if (evening) {
    const t = (timeOfDay - 70) / 30;
    grad.addColorStop(0, lerpColor(pal.skyTop, "#1A0A2E", t));
    grad.addColorStop(1, lerpColor(pal.skyBot, "#2D1508", t));
  } else {
    grad.addColorStop(0, pal.skyTop);
    grad.addColorStop(1, pal.skyBot);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, 40);

  // Sun position
  const sunX = 20 + (timeOfDay / 100) * (w - 40);
  const sunY = 20 - Math.sin((timeOfDay / 100) * Math.PI) * 10;
  if (timeOfDay < 85) {
    ctx.fillStyle = evening ? "#FF8C00" : "#FFD700";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#F0E68C";
    ctx.beginPath();
    ctx.arc(w - 30, 15, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTimeOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  timeOfDay: number
) {
  if (timeOfDay > 70) {
    const t = Math.min((timeOfDay - 70) / 30, 1);
    ctx.fillStyle = `rgba(10, 5, 20, ${t * 0.4})`;
    ctx.fillRect(0, 0, w, h);
  }
  if (timeOfDay < 15) {
    const t = 1 - timeOfDay / 15;
    ctx.fillStyle = `rgba(255, 200, 100, ${t * 0.15})`;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawInteractionPrompt(
  ctx: CanvasRenderingContext2D,
  text: string,
  w: number,
  h: number
) {
  ctx.save();
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  const tw = ctx.measureText(text).width + 16;
  const bx = w / 2 - tw / 2;
  const by = h - 60;
  ctx.fillStyle = "rgba(29, 68, 32, 0.9)";
  ctx.strokeStyle = "#C49A3C";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(bx, by, tw, 24, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#FDF8F0";
  ctx.fillText(text, w / 2, by + 16);
  ctx.restore();
}

function drawJoystick(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  knobX: number,
  knobY: number,
  active: boolean
) {
  ctx.globalAlpha = active ? 0.6 : 0.3;
  ctx.fillStyle = "#1D4420";
  ctx.strokeStyle = "#C49A3C";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(baseX, baseY, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#C49A3C";
  ctx.beginPath();
  ctx.arc(knobX, knobY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawActionButton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  active: boolean
) {
  ctx.globalAlpha = active ? 0.8 : 0.4;
  ctx.fillStyle = "#C49A3C";
  ctx.strokeStyle = "#1D4420";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1D4420";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y + 5);
  ctx.globalAlpha = 1;
}

function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `#${((rr << 16) | (rg << 8) | rb).toString(16).padStart(6, "0")}`;
}

// ============================================================
// PARTICLE SYSTEM (leaves, fireflies)
// ============================================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: "leaf" | "firefly" | "sparkle";
}

function spawnParticles(
  particles: Particle[],
  season: Season,
  timeOfDay: number,
  viewW: number,
  viewH: number,
  camX: number,
  camY: number
) {
  if (particles.length > 30) return;

  if (season === "fall" && Math.random() < 0.05) {
    particles.push({
      x: camX + Math.random() * viewW,
      y: camY - 10,
      vx: Math.random() * 20 - 10,
      vy: 10 + Math.random() * 15,
      life: 300,
      maxLife: 300,
      color: Math.random() > 0.5 ? "#D2691E" : "#B8860B",
      size: 3,
      type: "leaf",
    });
  }

  if (timeOfDay > 65 && Math.random() < 0.03) {
    particles.push({
      x: camX + Math.random() * viewW,
      y: camY + Math.random() * viewH,
      vx: Math.random() * 6 - 3,
      vy: Math.random() * -4 - 1,
      life: 200,
      maxLife: 200,
      color: "#FFD700",
      size: 2,
      type: "firefly",
    });
  }

  if (season === "spring" && Math.random() < 0.02) {
    particles.push({
      x: camX + Math.random() * viewW,
      y: camY - 5,
      vx: Math.random() * 10 - 5,
      vy: 5 + Math.random() * 10,
      life: 250,
      maxLife: 250,
      color: Math.random() > 0.5 ? "#FFB6C1" : "#FFFFFF",
      size: 2.5,
      type: "sparkle",
    });
  }
}

function updateParticles(particles: Particle[], dt: number): Particle[] {
  return particles
    .map((p) => ({
      ...p,
      x: p.x + p.vx * dt,
      y: p.y + p.vy * dt,
      life: p.life - 1,
    }))
    .filter((p) => p.life > 0);
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  camX: number,
  camY: number,
  time: number
) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    const sx = p.x - camX;
    const sy = p.y - camY;

    if (p.type === "firefly") {
      const glow = Math.sin(time * 0.01 + p.x) * 0.3 + 0.7;
      ctx.globalAlpha = alpha * glow;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === "leaf") {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(time * 0.005 + p.x * 0.1);
      ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
      ctx.restore();
    } else {
      ctx.globalAlpha = alpha * 0.7;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

// ============================================================
// ANIMAL AI (standalone to avoid ref mutation lint)
// ============================================================

function tickAnimalAI(animals: PlacedAnimal[], dt: number) {
  const PEN_MIN_X = 3, PEN_MAX_X = 7, PEN_MIN_Y = 6, PEN_MAX_Y = 8;
  const FIELD_MIN_X = 10, FIELD_MAX_X = 15, FIELD_MIN_Y = 5, FIELD_MAX_Y = 9;

  for (const a of animals) {
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
        a.targetX = 2 + Math.random() * 6;
        a.targetY = 2 + Math.random() * 5;
      } else {
        a.targetX = FIELD_MIN_X + Math.random() * (FIELD_MAX_X - FIELD_MIN_X);
        a.targetY = FIELD_MIN_Y + Math.random() * (FIELD_MAX_Y - FIELD_MIN_Y);
      }
    }
    const dx = a.targetX - a.x;
    const dy = a.targetY - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.1) {
      const speed = 0.8 * dt;
      a.x += (dx / dist) * speed;
      a.y += (dy / dist) * speed;
    }
  }
}

// ============================================================
// DAWN SUMMARY
// ============================================================

function getDawnSummary(gs: GameState): DialogState {
  const lines: string[] = [`Day ${gs.day} — ${cap(gs.season)}`];

  const prevSeason = getSeason(gs.day - 1);
  if (gs.season !== prevSeason) {
    const msgs: Record<Season, string> = {
      spring: "The air smells like fresh earth and possibility. Wildflowers are blooming.",
      summer: "Summer has arrived. The days are long and golden.",
      fall: "The leaves are turning amber and crimson. Harvest season is here.",
    };
    lines.push(msgs[gs.season]);
  }

  const events: string[] = [];
  const readyCrops = gs.crops.filter((c) => c.daysGrown >= CROP_DATA[c.type].growDays);
  if (readyCrops.length > 0) {
    events.push(`${readyCrops.map((c) => CROP_DATA[c.type].emoji + " " + CROP_DATA[c.type].label).join(", ")} ready to harvest!`);
  }
  const products: string[] = [];
  for (const a of gs.animals) {
    const d = ANIMAL_DATA[a.type];
    if (d.product && d.productValue > 0) products.push(d.product);
  }
  if (products.length > 0) {
    events.push(`Collected: ${Array.from(new Set(products)).join(", ")}`);
  }
  if (events.length > 0) lines.push("\nOvernight: " + events.join(". ") + ".");
  lines.push(`\n${gs.gold}g, ${gs.wood} wood, ${gs.animals.length} animal${gs.animals.length !== 1 ? "s" : ""}, ${gs.crops.length} growing crops.`);

  return {
    title: `Dawn — Day ${gs.day}`,
    text: lines.join("\n"),
    choices: [{ id: "dismiss", emoji: "☀️", text: "Start the day" }],
  };
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
  const [started, setStarted] = useState(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [hudInfo, setHudInfo] = useState({
    day: 1,
    season: "spring" as Season,
    timeOfDay: 0,
    grit: 3,
    wisdom: 3,
    charm: 3,
    gold: 50,
    wood: 0,
    animals: 0,
  });

  const gsRef = useRef<GameState>({
    day: 1,
    season: "spring",
    timeOfDay: 0,
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
    gardenPlots: 12,
    usedEvents: [],
    celebrationQuality: 0,
    gameOver: false,
    dayTransition: false,
    pendingDialog: null,
  });

  const playerRef = useRef({
    x: 4.5,
    y: 2.5,
    dir: "down" as Direction,
    walkFrame: 0,
    moving: false,
    speed: 3.5,
  });

  const inputRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    action: false,
    actionConsumed: false,
  });

  const joystickRef = useRef({
    active: false,
    touchId: -1,
    baseX: 0,
    baseY: 0,
    knobX: 0,
    knobY: 0,
    dx: 0,
    dy: 0,
  });

  const actionTouchRef = useRef({
    active: false,
    touchId: -1,
  });

  const placedAnimalsRef = useRef<PlacedAnimal[]>([]);
  const npcsRef = useRef<NPC[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const interactionRef = useRef<string | null>(null);
  const dialogOpenRef = useRef(false);
  const storyCheckedRef = useRef(false);
  const dayTransRef = useRef(false);
  const randomEventCheckedRef = useRef<number>(-1);

  const syncHud = useCallback(() => {
    const gs = gsRef.current;
    setHudInfo({
      day: gs.day,
      season: gs.season,
      timeOfDay: gs.timeOfDay,
      grit: gs.grit,
      wisdom: gs.wisdom,
      charm: gs.charm,
      gold: gs.gold,
      wood: gs.wood,
      animals: gs.animals.length,
    });
  }, []);

  const syncAnimals = useCallback(() => {
    const gs = gsRef.current;
    const existing = placedAnimalsRef.current;
    const newAnimals: PlacedAnimal[] = [];

    const PEN_MIN_X = 3, PEN_MAX_X = 7, PEN_MIN_Y = 6, PEN_MAX_Y = 8;
    const FIELD_MIN_X = 10, FIELD_MAX_X = 15, FIELD_MIN_Y = 5, FIELD_MAX_Y = 9;

    for (const a of gs.animals) {
      const found = existing.find((pa) => pa.name === a.name && pa.type === a.type);
      if (found) {
        newAnimals.push(found);
      } else {
        const isPoultry = ["chicken", "duck", "goose"].includes(a.type);
        const isCatDog = ["cat", "dog"].includes(a.type);
        let sx: number, sy: number;
        if (isPoultry) {
          sx = PEN_MIN_X + Math.random() * (PEN_MAX_X - PEN_MIN_X);
          sy = PEN_MIN_Y + Math.random() * (PEN_MAX_Y - PEN_MIN_Y);
        } else if (isCatDog) {
          sx = 3 + Math.random() * 4;
          sy = 3 + Math.random() * 3;
        } else {
          sx = FIELD_MIN_X + Math.random() * (FIELD_MAX_X - FIELD_MIN_X);
          sy = FIELD_MIN_Y + Math.random() * (FIELD_MAX_Y - FIELD_MIN_Y);
        }
        newAnimals.push({
          ...a,
          x: sx,
          y: sy,
          targetX: sx,
          targetY: sy,
          moveTimer: 0,
          moveInterval: 2 + Math.random() * 3,
        });
      }
    }
    placedAnimalsRef.current = newAnimals;
  }, []);

  const updateAnimalAI = useCallback((dt: number) => {
    tickAnimalAI(placedAnimalsRef.current, dt);
  }, []);

  const getFacingTile = useCallback((): { col: number; row: number; tile: number } => {
    const p = playerRef.current;
    const col = Math.round(p.x);
    const row = Math.round(p.y);
    let tc = col, tr = row;
    switch (p.dir) {
      case "up": tr = row - 1; break;
      case "down": tr = row + 1; break;
      case "left": tc = col - 1; break;
      case "right": tc = col + 1; break;
    }
    return { col: tc, row: tr, tile: tileAt(tc, tr) };
  }, []);

  const getInteractionLabel = useCallback((): string | null => {
    const { tile } = getFacingTile();
    const type = INTERACTION_TILES[tile];
    if (!type) return null;

    switch (type) {
      case "house": return "Enter House [E]";
      case "garden": return "Garden [E]";
      case "coop": return "Coop [E]";
      case "barn": return "Barn [E]";
      case "pond": return "Pond [E]";
      case "trees": return "Woods [E]";
      case "town": return "Visit Town [E]";
      case "fence": return "Animal Pen [E]";
      default: return null;
    }
  }, [getFacingTile]);

  const openInteraction = useCallback(() => {
    const { tile } = getFacingTile();
    const type = INTERACTION_TILES[tile];
    if (!type) return;

    const gs = gsRef.current;
    let d: DialogState | null = null;

    switch (type) {
      case "house": d = getHouseDialog(gs); break;
      case "garden": d = getGardenDialog(gs); break;
      case "coop": d = getCoopDialog(gs); break;
      case "barn": d = getBarnDialog(gs); break;
      case "pond": d = getPondDialog(); break;
      case "trees": d = getTreesDialog(gs); break;
      case "town": d = getTownDialog(gs); break;
      case "fence": d = getFenceDialog(); break;
    }

    if (d) {
      dialogOpenRef.current = true;
      setDialog(d);
    }
  }, [getFacingTile]);

  const handleDialogChoice = useCallback((choiceId: string) => {
    const gs = gsRef.current;
    const { gs: newGs, resultDialog, timeAdvance } = applyDialogChoice(choiceId, gs);

    gsRef.current = newGs;
    gsRef.current.timeOfDay = Math.min(100, gsRef.current.timeOfDay + timeAdvance);

    syncAnimals();
    syncHud();

    if (newGs.gameOver) {
      const score = calculateScore(newGs);
      dialogOpenRef.current = false;
      setDialog(null);
      onGameOver(score);
      return;
    }

    if (newGs.dayTransition) {
      dayTransRef.current = true;
      dialogOpenRef.current = false;
      setDialog(null);
      return;
    }

    if (resultDialog) {
      setDialog(resultDialog);
    } else {
      dialogOpenRef.current = false;
      setDialog(null);
    }
  }, [onGameOver, syncAnimals, syncHud]);

  // Keyboard input
  useEffect(() => {
    if (!started) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const inp = inputRef.current;
      switch (e.key) {
        case "ArrowUp": case "w": case "W": inp.up = true; e.preventDefault(); break;
        case "ArrowDown": case "s": case "S": inp.down = true; e.preventDefault(); break;
        case "ArrowLeft": case "a": case "A": inp.left = true; e.preventDefault(); break;
        case "ArrowRight": case "d": case "D": inp.right = true; e.preventDefault(); break;
        case " ": case "e": case "E":
          if (!inp.actionConsumed) {
            inp.action = true;
          }
          e.preventDefault();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const inp = inputRef.current;
      switch (e.key) {
        case "ArrowUp": case "w": case "W": inp.up = false; break;
        case "ArrowDown": case "s": case "S": inp.down = false; break;
        case "ArrowLeft": case "a": case "A": inp.left = false; break;
        case "ArrowRight": case "d": case "D": inp.right = false; break;
        case " ": case "e": case "E":
          inp.action = false;
          inp.actionConsumed = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [started]);

  // Touch input
  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCanvasPos = (touch: Touch) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      return {
        x: (touch.clientX - rect.left) * dpr / (rect.width * dpr / canvas.width) / (window.devicePixelRatio || 1),
        y: (touch.clientY - rect.top) * dpr / (rect.height * dpr / canvas.height) / (window.devicePixelRatio || 1),
      };
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (dialogOpenRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const logicalW = rect.width;
      const logicalH = rect.height;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const pos = getCanvasPos(touch);

        if (pos.x < logicalW * 0.5 && pos.y > logicalH * 0.5) {
          const js = joystickRef.current;
          js.active = true;
          js.touchId = touch.identifier;
          js.baseX = pos.x;
          js.baseY = pos.y;
          js.knobX = pos.x;
          js.knobY = pos.y;
          js.dx = 0;
          js.dy = 0;
        } else if (pos.x > logicalW * 0.5 && pos.y > logicalH * 0.5) {
          actionTouchRef.current.active = true;
          actionTouchRef.current.touchId = touch.identifier;
          if (!inputRef.current.actionConsumed) {
            inputRef.current.action = true;
          }
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const js = joystickRef.current;
        if (touch.identifier === js.touchId && js.active) {
          const pos = getCanvasPos(touch);
          const dx = pos.x - js.baseX;
          const dy = pos.y - js.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 30;
          if (dist > maxDist) {
            js.knobX = js.baseX + (dx / dist) * maxDist;
            js.knobY = js.baseY + (dy / dist) * maxDist;
          } else {
            js.knobX = pos.x;
            js.knobY = pos.y;
          }
          js.dx = (js.knobX - js.baseX) / maxDist;
          js.dy = (js.knobY - js.baseY) / maxDist;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const js = joystickRef.current;
        if (touch.identifier === js.touchId) {
          js.active = false;
          js.touchId = -1;
          js.dx = 0;
          js.dy = 0;
        }
        if (touch.identifier === actionTouchRef.current.touchId) {
          actionTouchRef.current.active = false;
          actionTouchRef.current.touchId = -1;
          inputRef.current.action = false;
          inputRef.current.actionConsumed = false;
        }
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [started]);

  // Main game loop
  useEffect(() => {
    if (!started) return;

    const canvas = canvasRef.current;
    const cont = containerRef.current;
    if (!canvas || !cont) return;

    const dpr = window.devicePixelRatio || 1;
    let logicalW = 0;
    let logicalH = 0;

    const resize = () => {
      const rect = cont.getBoundingClientRect();
      logicalW = rect.width;
      logicalH = rect.height - 40;
      canvas.style.width = rect.width + "px";
      canvas.style.height = (rect.height - 40) + "px";
      canvas.width = logicalW * dpr;
      canvas.height = logicalH * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let lastTime = 0;
    const TARGET_DT = 1 / 30;

    storyCheckedRef.current = false;

    const gameLoop = (timestamp: number) => {
      const rawDt = lastTime === 0 ? TARGET_DT : Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;
      const dt = rawDt;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gs = gsRef.current;
      const player = playerRef.current;
      const inp = inputRef.current;
      const js = joystickRef.current;

      // Day transition
      if (dayTransRef.current) {
        if (gs.day >= 15) {
          const celeb = getCelebrationDialog(gs);
          dialogOpenRef.current = true;
          setDialog(celeb);
          dayTransRef.current = false;
        } else {
          const newGs = processNewDay(gs);
          gsRef.current = newGs;
          syncAnimals();
          syncHud();
          storyCheckedRef.current = false;
          randomEventCheckedRef.current = -1;
          dayTransRef.current = false;

          const dawnSummary = getDawnSummary(newGs);
          dialogOpenRef.current = true;
          setDialog(dawnSummary);
        }
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      // Check for story beats
      if (!dialogOpenRef.current && !storyCheckedRef.current) {
        const storyBeat = getStoryBeat(gs);
        if (storyBeat) {
          dialogOpenRef.current = true;
          setDialog(storyBeat);
          storyCheckedRef.current = true;
          animId = requestAnimationFrame(gameLoop);
          return;
        }
        storyCheckedRef.current = true;
      }

      // Random events - check once per "phase" (every 33 time units)
      if (!dialogOpenRef.current) {
        const phase = Math.floor(gs.timeOfDay / 33);
        if (phase > randomEventCheckedRef.current) {
          randomEventCheckedRef.current = phase;
          const randomEvent = tryRandomEvent(gs);
          if (randomEvent) {
            dialogOpenRef.current = true;
            setDialog(randomEvent);
            animId = requestAnimationFrame(gameLoop);
            return;
          }
        }
      }

      // Auto-end day if time runs out
      if (gs.timeOfDay >= 100 && !dialogOpenRef.current) {
        dayTransRef.current = true;
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      // Movement
      if (!dialogOpenRef.current) {
        let dx = 0, dy = 0;

        if (inp.up) { dy = -1; player.dir = "up"; }
        if (inp.down) { dy = 1; player.dir = "down"; }
        if (inp.left) { dx = -1; player.dir = "left"; }
        if (inp.right) { dx = 1; player.dir = "right"; }

        if (js.active) {
          const jdx = js.dx;
          const jdy = js.dy;
          if (Math.abs(jdx) > 0.2 || Math.abs(jdy) > 0.2) {
            dx = jdx;
            dy = jdy;
            if (Math.abs(jdx) > Math.abs(jdy)) {
              player.dir = jdx > 0 ? "right" : "left";
            } else {
              player.dir = jdy > 0 ? "down" : "up";
            }
          }
        }

        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
          const nx = dx / len;
          const ny = dy / len;
          const newX = player.x + nx * player.speed * dt;
          const newY = player.y + ny * player.speed * dt;

          const canMoveX = isWalkable(Math.round(newX), Math.round(player.y));
          const canMoveY = isWalkable(Math.round(player.x), Math.round(newY));

          if (canMoveX) player.x = Math.max(0.5, Math.min(MAP_COLS - 1.5, newX));
          if (canMoveY) player.y = Math.max(0.5, Math.min(MAP_ROWS - 1.5, newY));

          player.moving = true;
          player.walkFrame += dt * 10;
        } else {
          player.moving = false;
        }

        // Interaction
        interactionRef.current = getInteractionLabel();

        if (inp.action && !inp.actionConsumed) {
          inp.actionConsumed = true;
          if (interactionRef.current) {
            openInteraction();
          }
        }
      }

      // Update animals
      updateAnimalAI(dt);

      // Particles
      spawnParticles(
        particlesRef.current,
        gs.season,
        gs.timeOfDay,
        logicalW,
        logicalH,
        player.x * TILE_SIZE - logicalW / 2,
        player.y * TILE_SIZE - logicalH / 2
      );
      particlesRef.current = updateParticles(particlesRef.current, dt);

      // Camera
      const camX = player.x * TILE_SIZE - logicalW / 2 + 16;
      const camY = player.y * TILE_SIZE - logicalH / 2 + 16;

      // Draw
      ctx.clearRect(0, 0, logicalW, logicalH);

      // Sky bar
      drawSky(ctx, logicalW, gs.timeOfDay, gs.season);

      // Tiles
      const startCol = Math.max(0, Math.floor(camX / TILE_SIZE) - 1);
      const endCol = Math.min(MAP_COLS, Math.ceil((camX + logicalW) / TILE_SIZE) + 1);
      const startRow = Math.max(0, Math.floor(camY / TILE_SIZE) - 1);
      const endRow = Math.min(MAP_ROWS, Math.ceil((camY + logicalH) / TILE_SIZE) + 1);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 40, logicalW, logicalH - 40);
      ctx.clip();

      const offsetY = 40;
      const adjCamY = camY - offsetY;

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          drawTile(ctx, tileAt(col, row), col, row, gs.season, timestamp, camX, adjCamY);
        }
      }

      // Crops on garden tiles
      for (const crop of gs.crops) {
        const ci = crop.tileIdx;
        const cCol = ci % MAP_COLS;
        const cRow = Math.floor(ci / MAP_COLS);
        drawCropOnTile(ctx, crop, cCol, cRow, camX, adjCamY);
      }

      // Animals
      for (const a of placedAnimalsRef.current) {
        drawAnimalEntity(ctx, a, camX, adjCamY, timestamp);
      }

      // NPCs
      for (const npc of npcsRef.current) {
        drawNPC(ctx, npc, camX, adjCamY, timestamp);
      }

      // Player
      const ppx = player.x * TILE_SIZE - camX;
      const ppy = player.y * TILE_SIZE - adjCamY;
      drawPlayer(ctx, ppx - 16, ppy - 16, player.dir, player.moving ? player.walkFrame : 0);

      // Particles
      drawParticles(ctx, particlesRef.current, camX, adjCamY, timestamp);

      // Time overlay
      drawTimeOverlay(ctx, logicalW, logicalH, gs.timeOfDay);

      ctx.restore();

      // UI overlay (not clipped)
      // Interaction prompt
      if (!dialogOpenRef.current && interactionRef.current) {
        drawInteractionPrompt(ctx, interactionRef.current, logicalW, logicalH);
      }

      // Virtual joystick (mobile)
      const controlAreaY = logicalH - 80;
      if (js.active) {
        drawJoystick(ctx, js.baseX, js.baseY, js.knobX, js.knobY, true);
      } else {
        drawJoystick(ctx, 60, controlAreaY, 60, controlAreaY, false);
      }

      // Action button
      const hasInteraction = !!interactionRef.current;
      drawActionButton(ctx, logicalW - 60, controlAreaY, "A", hasInteraction && !dialogOpenRef.current);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [started, syncHud, syncAnimals, updateAnimalAI, getFacingTile, getInteractionLabel, openInteraction, onGameOver]);

  const startGame = useCallback(() => {
    gsRef.current = {
      day: 1,
      season: "spring",
      timeOfDay: 0,
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
      gardenPlots: 12,
      usedEvents: [],
      celebrationQuality: 0,
      gameOver: false,
      dayTransition: false,
      pendingDialog: null,
    };
    playerRef.current = {
      x: 4.5,
      y: 2.5,
      dir: "down",
      walkFrame: 0,
      moving: false,
      speed: 3.5,
    };
    placedAnimalsRef.current = [];
    particlesRef.current = [];
    storyCheckedRef.current = false;
    randomEventCheckedRef.current = -1;
    dayTransRef.current = false;
    dialogOpenRef.current = false;
    syncHud();
    setDialog(null);
    setStarted(true);
  }, [syncHud]);


  // ---- RENDER ----

  const timePhase = hudInfo.timeOfDay < 33 ? "Morning" : hudInfo.timeOfDay < 66 ? "Afternoon" : "Evening";

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full relative"
      style={{ height: "calc(100dvh - 52px)" }}
    >
      {/* HUD Bar */}
      {started && (
        <div
          className="shrink-0 flex items-center justify-between px-3 py-1 text-xs"
          style={{
            background: "#1D4420",
            color: "#FDF8F0",
            borderBottom: "1px solid #C49A3C33",
            height: 40,
            fontFamily: "var(--font-quicksand), sans-serif",
          }}
        >
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">Day {hudInfo.day} · {cap(hudInfo.season)}</span>
            <span className="opacity-70" style={{ fontSize: 10 }}>{timePhase}</span>
          </div>
          <div className="flex gap-1.5 text-xs" style={{ fontSize: 11 }}>
            <span title="Grit">💪{hudInfo.grit}</span>
            <span title="Wisdom">📚{hudInfo.wisdom}</span>
            <span title="Charm">💛{hudInfo.charm}</span>
            <span title="Gold">💰{hudInfo.gold}</span>
            <span title="Wood">🪵{hudInfo.wood}</span>
            {hudInfo.animals > 0 && <span title="Animals">🐾{hudInfo.animals}</span>}
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full flex-1"
        style={{
          background: "#0D1F0F",
          touchAction: "none",
          display: started ? "block" : "none",
        }}
      />

      {/* Title Screen */}
      {!started && (
        <div
          className="flex-1 flex flex-col items-center justify-center px-6"
          style={{ background: "linear-gradient(180deg, #0D1F0F 0%, #162618 100%)" }}
        >
          <div className="text-5xl mb-4">🏡</div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "#C49A3C", fontFamily: "var(--font-cormorant-garamond), serif" }}
          >
            Brooker Homestead
          </h2>
          <p className="text-sm mb-4 text-center max-w-xs" style={{ color: "#FDF8F0CC" }}>
            Build your dream farm from scratch. Raise animals, grow crops, befriend neighbors, and host the ultimate celebration.
          </p>
          <p className="text-xs mb-2 text-center" style={{ color: "#FDF8F088" }}>
            15 days across 3 seasons. Explore, interact, and shape your homestead.
          </p>
          <p className="text-xs mb-6 text-center" style={{ color: "#FDF8F066" }}>
            WASD/Arrows to move · E/Space to interact · Mobile: joystick + A button
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
            Start Homesteading
          </button>
        </div>
      )}

      {/* Dialog Overlay */}
      {dialog && (
        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{ zIndex: 50 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10, 20, 10, 0.5)" }}
          />
          <div
            className="relative w-full max-w-lg mx-2 mb-2 rounded-xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #1D4420 0%, #0D1F0F 100%)",
              border: "1px solid #C49A3C55",
              maxHeight: "70vh",
            }}
          >
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "70vh" }}
            >
              {/* Title */}
              <div
                className="px-4 pt-4 pb-2"
                style={{ borderBottom: "1px solid #C49A3C33" }}
              >
                <h3
                  className="text-lg font-bold"
                  style={{
                    color: "#C49A3C",
                    fontFamily: "var(--font-cormorant-garamond), serif",
                  }}
                >
                  {dialog.title}
                </h3>
              </div>

              {/* Text */}
              <div
                className="px-4 py-3 whitespace-pre-line leading-relaxed"
                style={{
                  color: "#FDF8F0DD",
                  fontFamily: "var(--font-cormorant-garamond), serif",
                  fontSize: 15,
                  lineHeight: 1.7,
                }}
              >
                {dialog.text}
              </div>

              {/* Choices */}
              <div className="px-4 pb-4 flex flex-col gap-2">
                {dialog.choices.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => !c.disabled && handleDialogChoice(c.id)}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
