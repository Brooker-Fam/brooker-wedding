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

// ============================================================
// GAME DATA (preserved from original)
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
// GAME CLASS
// ============================================================

class Game {
  px: number;
  py: number;
  facing: number; // 0=up 1=right 2=down 3=left
  walkFrame: number;

  day: number;
  season: Season;
  timeOfDay: number;
  grit: number;
  wisdom: number;
  charm: number;
  gold: number;
  wood: number;

  placedAnimals: PlacedAnimal[];
  crops: Crop[];
  buildings: BuildingType[];
  seeds: CropType[];
  cropsHarvested: number;

  floats: FloatText[];
  particles: Particle[];
  storyNPCs: StoryNPC[];

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

  usedEvents: Set<string>;
  lastActionKey: boolean;
  started: boolean;

  constructor() {
    this.px = 5.5;
    this.py = 2.5;
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

    this.placedAnimals = [
      this.makeAnimal("chicken", "Henrietta", 3.5, 7),
      this.makeAnimal("chicken", "Cluck Norris", 5, 7.5),
      this.makeAnimal("chicken", "Eggatha", 4.2, 6.5),
    ];
    this.crops = [];
    this.buildings = [];
    this.seeds = ["lettuce", "lettuce", "lettuce", "lettuce", "herbs", "herbs", "herbs", "herbs"];
    this.cropsHarvested = 0;

    this.floats = [];
    this.particles = [];
    this.storyNPCs = [];

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

    this.usedEvents = new Set();
    this.lastActionKey = false;
    this.started = false;
  }

  makeAnimal(type: AnimalType, name: string, x: number, y: number): PlacedAnimal {
    return {
      type, name, x, y,
      targetX: x, targetY: y,
      moveTimer: 0, moveInterval: 2 + Math.random() * 3,
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

  getFacingTile(): { col: number; row: number; tile: number } {
    const col = Math.round(this.px);
    const row = Math.round(this.py);
    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];
    const tc = col + dx[this.facing];
    const tr = row + dy[this.facing];
    return { col: tc, row: tr, tile: tileAt(tc, tr) };
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

  calculateScore(): number {
    let score = 0;
    for (const a of this.placedAnimals) score += ANIMAL_DATA[a.type].scoreValue;
    for (const b of this.buildings) score += BUILDING_DATA[b].scoreValue;
    score += this.cropsHarvested * 5;
    score += (this.grit + this.wisdom + this.charm) * 2;
    score += Math.floor(this.gold / 5);
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
      ctx.font = `${Math.max(8, ts * 0.28)}px sans-serif`;
      ctx.fillStyle = "#FDF8F0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("TOWN", px + ts * 0.5, py + ts * 0.62);
      break;
    }
    default: {
      ctx.fillStyle = pal.grass;
      ctx.fillRect(px, py, ts, ts);
    }
  }
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
  const s = ts; // scale factor

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

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(px + ts * 0.5, py + ts * 0.85, ts * 0.2, ts * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();

  const fontSize = Math.max(10, ts * 0.65);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(ANIMAL_DATA[animal.type].emoji, px + ts * 0.5, py + ts * 0.5 + bob);
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
  const smallFont = Math.max(8, ts * 0.26);

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#C49A3C";
  ctx.fillText(`Day ${g.day} \u00B7 ${g.season.charAt(0).toUpperCase() + g.season.slice(1)}`, 8, barH * 0.35);

  ctx.font = `${smallFont}px sans-serif`;
  ctx.fillStyle = "#FDF8F0";
  const statsText = `\uD83D\uDCB0${g.gold} \uD83E\uDE93${g.wood} \uD83C\uDF3F${g.grit} \uD83D\uDCDA${g.wisdom} \uD83D\uDC9B${g.charm}`;
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
  const outerR = 35;
  const innerR = 14;
  const actR = 28;

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

  const actX = w - 50;
  const actY = h - 55;
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
      tileSize = Math.max(28, Math.min(48, Math.floor(Math.min(canvasW / 12, canvasH / 10))));
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
        if (pos.y > canvasH - 130) {
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
      if (g.day === 4 && !g.usedEvents.has("kids_visit")) {
        g.usedEvents.add("kids_visit");
        g.storyNPCs = [
          { id: "emmett", emoji: "👦", x: 5, y: 3.5, collected: false },
          { id: "sapphire", emoji: "👧", x: 6.5, y: 3.5, collected: false },
        ];
        g.addFloat(g.px, g.py - 1, "The kids are visiting!", "#FFD700");
      }
      if (g.day === 7 && !g.usedEvents.has("stray_animal")) {
        g.usedEvents.add("stray_animal");
        const hasCat = g.placedAnimals.some((a) => a.type === "cat");
        if (!hasCat) {
          g.storyNPCs = [{ id: "bruce", emoji: "🐱", x: 4.5, y: 1.8, collected: false }];
          g.addFloat(g.px, g.py - 1, "A stray cat appeared!", "#FFD700");
        } else {
          g.storyNPCs = [{ id: "bella", emoji: "🐕", x: 4.5, y: 1.8, collected: false }];
          g.addFloat(g.px, g.py - 1, "A stray dog appeared!", "#FFD700");
        }
      }
      if (g.day === 10 && !g.usedEvents.has("festival")) {
        g.usedEvents.add("festival");
        g.grit += 3;
        g.wisdom += 3;
        g.charm += 3;
        g.gold += 25;
        g.addFloat(g.px, g.py - 1, "Festival day! +3 all stats, +25g", "#FFD700");
      }
      if (g.day === 13 && !g.usedEvents.has("zoe_adventure")) {
        g.usedEvents.add("zoe_adventure");
        g.storyNPCs = [{ id: "zoe", emoji: "🐕", x: 8, y: 4, collected: false }];
        g.addFloat(g.px, g.py - 1, "Zoe is loose!", "#FFD700");
      }
    }

    // CONTEXT-SENSITIVE ACTION
    function getActionContext(g: Game): { prompt: string; tx: number; ty: number } | null {
      if (g.showShop || g.showBuild || g.showScore || g.nightPhase !== "none") return null;

      const npc = g.findNearNPC();
      if (npc) {
        return { prompt: `\u2728 ${npc.emoji}`, tx: npc.x, ty: npc.y };
      }

      const animal = g.findNearAnimal();
      if (animal) {
        const d = ANIMAL_DATA[animal.type];
        if (d.product && d.productValue > 0) {
          return { prompt: `${d.emoji} Collect`, tx: animal.x, ty: animal.y };
        }
        return { prompt: `${d.emoji} Pet ${animal.name}`, tx: animal.x, ty: animal.y };
      }

      const { col, row, tile } = g.getFacingTile();

      switch (tile) {
        case 7: {
          const tileIdx = row * MAP_COLS + col;
          const crop = g.crops.find((c) => c.tileIdx === tileIdx);
          if (crop) {
            const d = CROP_DATA[crop.type];
            if (crop.growth >= d.growDays) {
              return { prompt: `\uD83C\uDF3E Harvest`, tx: col, ty: row };
            }
            return { prompt: `\uD83D\uDCA7 Water`, tx: col, ty: row };
          }
          if (g.seeds.length > 0) {
            return { prompt: `\uD83C\uDF31 Plant`, tx: col, ty: row };
          }
          return { prompt: `No seeds!`, tx: col, ty: row };
        }
        case 1: return { prompt: `\uD83E\uDE93 Chop`, tx: col, ty: row };
        case 6: return { prompt: `\uD83D\uDE34 Rest`, tx: col, ty: row };
        case 8: {
          const hasCoop = g.buildings.includes("coop");
          if (!hasCoop) {
            const d = BUILDING_DATA.coop;
            return { prompt: `\uD83D\uDD28 Build Coop (${d.goldCost}g ${d.woodCost}w)`, tx: col, ty: row };
          }
          const poultryCount = countPoultry(g.placedAnimals);
          if (poultryCount > 0) {
            return { prompt: `\uD83E\uDD5A Collect`, tx: col, ty: row };
          }
          return null;
        }
        case 9: {
          const hasBarn = g.buildings.includes("barn");
          if (!hasBarn) {
            const d = BUILDING_DATA.barn;
            return { prompt: `\uD83D\uDD28 Build Barn (${d.goldCost}g ${d.woodCost}w)`, tx: col, ty: row };
          }
          return { prompt: `\uD83D\uDD28 Build...`, tx: col, ty: row };
        }
        case 3: return { prompt: `\uD83C\uDFA3 Relax`, tx: col, ty: row };
        case 12: return { prompt: `\uD83C\uDFEA Shop`, tx: col, ty: row };
        default: return null;
      }
    }

    function executeAction(g: Game) {
      if (g.showShop || g.showBuild || g.showScore || g.nightPhase !== "none") return;

      const npc = g.findNearNPC();
      if (npc && !npc.collected) {
        npc.collected = true;
        if (npc.id === "emmett") {
          g.wood += 4;
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
          g.addFloat(npc.x, npc.y, "+2 grit, +20g found!", "#FFD700");
          g.addParticles(npc.x, npc.y, "#FFD700", 12);
        }
        g.timeOfDay += 3;
        return;
      }

      const animal = g.findNearAnimal();
      if (animal) {
        const d = ANIMAL_DATA[animal.type];
        if (d.product && d.productValue > 0) {
          g.gold += d.productValue;
          g.charm += 1;
          g.addFloat(animal.x, animal.y, `${d.emoji} +${d.productValue}g`, "#FFD700");
          g.addParticles(animal.x, animal.y, "#FFD700", 6);
        } else {
          g.charm += 1;
          g.addFloat(animal.x, animal.y, `\u2764\uFE0F +1 charm`, "#FF69B4");
          g.addParticles(animal.x, animal.y, "#FF69B4", 6);
        }
        g.timeOfDay += 3;
        return;
      }

      const { col, row, tile } = g.getFacingTile();

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
              g.addParticles(col + 0.5, row + 0.5, "#FFD700", 8);
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
            g.addParticles(col + 0.5, row + 0.5, "#66BB6A", 6);
            g.timeOfDay += 3;
          } else {
            g.addFloat(col, row, "No seeds!", "#FF6B6B");
          }
          break;
        }
        case 1: {
          g.wood += 2;
          g.grit += 1;
          g.addFloat(col, row, "\uD83E\uDE93 +2 wood", "#8B7355");
          g.addParticles(col + 0.5, row + 0.5, "#8B7355", 8);
          g.timeOfDay += 5;
          break;
        }
        case 6: {
          g.timeOfDay += 25;
          g.grit += 1;
          g.wisdom += 1;
          g.charm += 1;
          g.addFloat(g.px, g.py, "\uD83D\uDE34 Rested! +1 all stats", "#B8A9C9");
          g.addParticles(g.px, g.py, "#B8A9C9", 8);
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
              g.addParticles(col + 0.5, row + 0.5, "#C4A25A", 12);
              g.timeOfDay += 10;
            } else {
              g.addFloat(col, row, `Need ${d.goldCost}g + ${d.woodCost}w`, "#FF6B6B");
            }
          } else {
            const poultry = g.placedAnimals.filter((a) =>
              ["chicken", "duck", "goose"].includes(a.type)
            );
            if (poultry.length > 0) {
              let totalVal = 0;
              for (const a of poultry) {
                const d = ANIMAL_DATA[a.type];
                if (d.productValue > 0) totalVal += d.productValue;
              }
              g.gold += totalVal;
              g.charm += 1;
              g.addFloat(col, row, `\uD83E\uDD5A +${totalVal}g`, "#FFD700");
              g.addParticles(col + 0.5, row + 0.5, "#FFD700", 8);
              g.timeOfDay += 5;
            }
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
              g.addParticles(col + 0.5, row + 0.5, "#8B3A3A", 12);
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
        case 12: {
          g.showShop = true;
          setOverlay("shop");
          syncOverlayState();
          break;
        }
      }
    }

    // OVERNIGHT PROCESSING
    function processOvernight(g: Game) {
      g.day++;
      g.season = getSeason(g.day);
      g.timeOfDay = 0;

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
          const col = crop.tileIdx % MAP_COLS;
          const row = Math.floor(crop.tileIdx / MAP_COLS);
          g.addFloat(col, row, `${d.emoji} +${sell}g`, "#FFD700");
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
        }
      }

      g.storyNPCs = [];

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

      if (achievements.length > 0) {
        lines.push(`Achievements: ${achievements.join(", ")} (+${achievements.length * 25})`);
      }

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
        // Time ticking
        g.timeOfDay += dt * 0.9;
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

          let nx = g.px + nmx;
          let ny = g.py + nmy;

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

        // Action input (rising edge)
        const actionKey = keys.has(" ") || keys.has("e") || actionTouch.active;
        if (actionKey && !g.lastActionKey) {
          executeAction(g);
        }
        g.lastActionKey = actionKey;

        // Context-sensitive prompt
        const actionCtx = getActionContext(g);
        g.actionPrompt = actionCtx ? actionCtx.prompt : null;
        g.actionTargetX = actionCtx ? actionCtx.tx : 0;
        g.actionTargetY = actionCtx ? actionCtx.ty : 0;
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

      // Update animal AI
      if (g.nightPhase === "none" && !overlayOpen) {
        const PEN_MIN_X = 3, PEN_MAX_X = 7, PEN_MIN_Y = 6, PEN_MAX_Y = 8;
        const FIELD_MIN_X = 10, FIELD_MAX_X = 15, FIELD_MIN_Y = 5, FIELD_MAX_Y = 9;
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
            const aspeed = 0.8 * dt;
            a.x += (dx / dist) * aspeed;
            a.y += (dy / dist) * aspeed;
          }
        }

        // Story NPC movement (Zoe moves fast!)
        for (const npc of g.storyNPCs) {
          if (npc.collected) continue;
          if (npc.id === "zoe") {
            npc.x += Math.sin(timestamp * 0.003) * dt * 2;
            npc.y += Math.cos(timestamp * 0.002 + 1) * dt * 1.5;
            npc.x = Math.max(2, Math.min(15, npc.x));
            npc.y = Math.max(2, Math.min(11, npc.y));
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

      // If map is smaller than canvas, center it
      if (mapPxW < canvasW) camX = -(canvasW - mapPxW) / 2;
      if (mapPxH < canvasH) camY = -(canvasH - mapPxH) / 2;

      // Background
      ctx.fillStyle = "#1D4420";
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Draw tiles
      const startCol = Math.max(0, Math.floor(camX / tileSize));
      const endCol = Math.min(MAP_COLS - 1, Math.ceil((camX + canvasW) / tileSize));
      const startRow = Math.max(0, Math.floor(camY / tileSize));
      const endRow = Math.min(MAP_ROWS - 1, Math.ceil((camY + canvasH) / tileSize));

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          drawTile(ctx, tileAt(c, r), c, r, g.season, tileSize, timestamp, camX, camY, g.buildings);
        }
      }

      // Draw crops
      for (const crop of g.crops) {
        drawCropOnTile(ctx, crop, tileSize, camX, camY, timestamp);
      }

      // Draw animals (sorted by y for depth)
      const sortedAnimals = [...g.placedAnimals].sort((a, b) => a.y - b.y);
      for (let i = 0; i < sortedAnimals.length; i++) {
        drawAnimalEntity(ctx, sortedAnimals[i], tileSize, camX, camY, timestamp, i);
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

      // Night fade
      drawNightFade(ctx, canvasW, canvasH, g.nightFade);

      // Dawn text
      if (g.nightPhase === "dawn_text") {
        drawDawnText(ctx, canvasW, canvasH, g.day, g.season, Math.min(g.dawnTimer, 1));
      }

      // Touch controls
      if (isTouchDevice && !overlayOpen) {
        const jbx = joystick.active ? joystick.baseX : 60;
        const jby = joystick.active ? joystick.baseY : canvasH - 60;
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
        const PEN_MIN_X = 3, PEN_MAX_X = 7, PEN_MIN_Y = 6, PEN_MAX_Y = 8;
        const FIELD_MIN_X = 10, FIELD_MAX_X = 15, FIELD_MIN_Y = 5, FIELD_MAX_Y = 9;
        let sx: number, sy: number;
        if (isPoultry) {
          sx = PEN_MIN_X + Math.random() * (PEN_MAX_X - PEN_MIN_X);
          sy = PEN_MIN_Y + Math.random() * (PEN_MAX_Y - PEN_MIN_Y);
        } else if (["cat", "dog"].includes(animalType)) {
          sx = 3 + Math.random() * 4;
          sy = 3 + Math.random() * 3;
        } else {
          sx = FIELD_MIN_X + Math.random() * (FIELD_MAX_X - FIELD_MIN_X);
          sy = FIELD_MIN_Y + Math.random() * (FIELD_MAX_Y - FIELD_MIN_Y);
        }
        g.placedAnimals.push(g.makeAnimal(animalType, name, sx, sy));
        g.addFloat(g.px, g.py, `${d.emoji} ${name} joined!`, "#FFD700");
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
      g.addParticles(g.px, g.py, "#C49A3C", 10);
      g.timeOfDay += 10;
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
    padding: "10px 12px",
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
      style={{ height: "calc(100dvh - 52px)" }}
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
            Build your dream farm in 15 days!{"\n\n"}
            Move: WASD / Arrow keys / Joystick{"\n"}
            Act: Space / E / Action button{"\n\n"}
            Walk up to things and press action!
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
              style={{ background: "none", border: "none", color: "#FDF8F0", fontSize: 20, cursor: "pointer" }}
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
              style={{ background: "none", border: "none", color: "#FDF8F0", fontSize: 20, cursor: "pointer" }}
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
            <div style={{ color: "#C49A3C", fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
              The Celebration!
            </div>
            <div style={{ color: "#FDF8F0", fontSize: 14, lineHeight: 1.6, marginBottom: 16, whiteSpace: "pre-line" }}>
              {scoreData.breakdown}
            </div>
            <div style={{ color: "#FFD700", fontSize: 32, fontWeight: "bold", marginBottom: 16 }}>
              Score: {scoreData.total}
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
