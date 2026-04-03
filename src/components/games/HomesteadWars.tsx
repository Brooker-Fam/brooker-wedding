"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

// =============================================================================
// TYPES
// =============================================================================

type GamePhase = "menu" | "playing" | "won" | "lost";
type Team = "player" | "ai";
type UnitType = "farmer" | "rooster" | "goose" | "ram" | "bull" | "owl";
type BuildingType = "farmhouse" | "barn" | "stable" | "roost" | "silo" | "fence" | "watchtower";
type ResourceType = "wood" | "stone" | "food";
type AIPhase = "economy" | "buildup" | "aggression";
type UnitOrder = "idle" | "move" | "attackMove" | "gather" | "build" | "returnResource" | "attack" | "produce";
type TileType = "grass" | "tree" | "rock" | "berry" | "water";

interface Vec2 {
  x: number;
  y: number;
}

interface Unit {
  id: number;
  type: UnitType;
  team: Team;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  damage: number;
  range: number;
  speed: number;
  attackCooldown: number;
  attackTimer: number;
  order: UnitOrder;
  targetX: number;
  targetY: number;
  targetId: number;
  path: Vec2[];
  pathIndex: number;
  carryType: ResourceType | null;
  carryAmount: number;
  buildTarget: number;
  alive: boolean;
  selected: boolean;
  visionRange: number;
  controlGroup: number;
  buildingToBuild: BuildingType | null;
  buildX: number;
  buildY: number;
  gatherTargetTileX: number;
  gatherTargetTileY: number;
}

interface Building {
  id: number;
  type: BuildingType;
  team: Team;
  tileX: number;
  tileY: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  built: boolean;
  buildProgress: number;
  alive: boolean;
  rallyX: number;
  rallyY: number;
  productionQueue: UnitType[];
  productionTimer: number;
  productionTime: number;
  attackTimer: number;
  selected: boolean;
  visionRange: number;
}

interface Projectile {
  x: number;
  y: number;
  tx: number;
  ty: number;
  speed: number;
  damage: number;
  team: Team;
  targetId: number;
  alive: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Resources {
  wood: number;
  stone: number;
  food: number;
}

interface GameState {
  phase: GamePhase;
  units: Unit[];
  buildings: Building[];
  projectiles: Projectile[];
  particles: Particle[];
  tiles: TileType[][];
  fog: boolean[][];
  resources: { player: Resources; ai: Resources };
  supply: { player: { current: number; max: number }; ai: { current: number; max: number } };
  camera: { x: number; y: number };
  selection: number[];
  selectedBuilding: number;
  selectionBox: { x1: number; y1: number; x2: number; y2: number; active: boolean };
  controlGroups: Record<number, number[]>;
  nextId: number;
  gameTime: number;
  buildMode: boolean;
  buildMenuOpen: boolean;
  buildingToBuild: BuildingType | null;
  buildGhostValid: boolean;
  buildGhostX: number;
  buildGhostY: number;
  mouseX: number;
  mouseY: number;
  aiPhase: AIPhase;
  aiTimer: number;
  aiAttackTimer: number;
  aiScoutSent: boolean;
  keysDown: Set<string>;
  spatialHash: Map<string, number[]>;
  showingInstructions: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MAP_W = 64;
const MAP_H = 64;
const TILE = 24;
const MINIMAP_SIZE = 140;
const UI_TOP_H = 36;
const UI_BOTTOM_H = 100;
const GATHER_RATE = 8;
const GATHER_CARRY = 10;
const BUILD_RATE = 25;
const PRODUCTION_TIMES: Record<UnitType, number> = {
  farmer: 8, rooster: 6, goose: 10, ram: 14, bull: 18, owl: 10,
};
const UNIT_COSTS: Record<UnitType, Resources> = {
  farmer: { wood: 0, stone: 0, food: 50 },
  rooster: { wood: 20, stone: 0, food: 30 },
  goose: { wood: 30, stone: 0, food: 60 },
  ram: { wood: 0, stone: 40, food: 80 },
  bull: { wood: 0, stone: 80, food: 100 },
  owl: { wood: 50, stone: 0, food: 40 },
};
const BUILDING_COSTS: Record<BuildingType, Resources> = {
  farmhouse: { wood: 0, stone: 0, food: 0 },
  barn: { wood: 100, stone: 0, food: 0 },
  stable: { wood: 150, stone: 100, food: 0 },
  roost: { wood: 120, stone: 80, food: 0 },
  silo: { wood: 80, stone: 40, food: 0 },
  fence: { wood: 30, stone: 20, food: 0 },
  watchtower: { wood: 60, stone: 60, food: 0 },
};
const BUILDING_HP: Record<BuildingType, number> = {
  farmhouse: 500, barn: 300, stable: 400, roost: 200, silo: 250, fence: 150, watchtower: 200,
};
const BUILDING_SIZE: Record<BuildingType, { w: number; h: number }> = {
  farmhouse: { w: 3, h: 3 }, barn: { w: 3, h: 2 }, stable: { w: 3, h: 2 },
  roost: { w: 2, h: 2 }, silo: { w: 2, h: 2 }, fence: { w: 1, h: 1 }, watchtower: { w: 2, h: 2 },
};
const BUILDING_BUILD_TIME: Record<BuildingType, number> = {
  farmhouse: 0, barn: 15, stable: 20, roost: 15, silo: 10, fence: 5, watchtower: 12,
};
const BUILDING_VISION: Record<BuildingType, number> = {
  farmhouse: 8, barn: 5, stable: 5, roost: 6, silo: 4, fence: 2, watchtower: 10,
};
const UNIT_STATS: Record<UnitType, { hp: number; damage: number; range: number; speed: number; vision: number }> = {
  farmer: { hp: 30, damage: 5, range: 1.2, speed: 2.5, vision: 6 },
  rooster: { hp: 40, damage: 8, range: 1.2, speed: 4.0, vision: 7 },
  goose: { hp: 50, damage: 12, range: 4.0, speed: 2.5, vision: 7 },
  ram: { hp: 120, damage: 15, range: 1.2, speed: 1.8, vision: 5 },
  bull: { hp: 180, damage: 25, range: 1.5, speed: 2.0, vision: 5 },
  owl: { hp: 25, damage: 6, range: 3.0, speed: 3.5, vision: 10 },
};
const BUILDING_PRODUCES: Record<BuildingType, UnitType[]> = {
  farmhouse: ["farmer"],
  barn: ["rooster", "goose"],
  stable: ["ram", "bull"],
  roost: ["owl"],
  silo: [],
  fence: [],
  watchtower: [],
};
const BUILDING_REQUIRES: Record<BuildingType, BuildingType | null> = {
  farmhouse: null, barn: null, stable: "barn", roost: null, silo: null, fence: null, watchtower: null,
};

const COLORS = {
  grass: "#4a7c34",
  grassAlt: "#3d6b2c",
  tree: "#1a5c1a",
  treeTrunk: "#5c3a1a",
  rock: "#8a8a8a",
  rockDark: "#6a6a6a",
  berry: "#2d6e2d",
  berryFruit: "#cc3355",
  water: "#3a6aaa",
  fogBlack: "rgba(0,0,0,0.7)",
  fogExplored: "rgba(0,0,0,0.4)",
  playerColor: "#3388ff",
  aiColor: "#ff3333",
  uiBg: "rgba(20,12,8,0.92)",
  uiBorder: "#DAA520",
  gold: "#DAA520",
  white: "#FFFFFF",
  hpGreen: "#44ff44",
  hpRed: "#ff4444",
  hpYellow: "#ffff44",
  selectGreen: "#44ff88",
  selectBox: "rgba(68,255,136,0.25)",
};

const BUILDING_LABELS: Record<BuildingType, string> = {
  farmhouse: "Farmhouse", barn: "Barn", stable: "Stable", roost: "Roost",
  silo: "Silo", fence: "Fence", watchtower: "Tower",
};
const UNIT_LABELS: Record<UnitType, string> = {
  farmer: "Farmer", rooster: "Rooster", goose: "Goose", ram: "Ram", bull: "Bull", owl: "Owl",
};

// =============================================================================
// HELPERS
// =============================================================================

function dist(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function hashKey(tx: number, ty: number): string {
  return `${tx},${ty}`;
}

function canAfford(res: Resources, cost: Resources): boolean {
  return res.wood >= cost.wood && res.stone >= cost.stone && res.food >= cost.food;
}

function subtractCost(res: Resources, cost: Resources): void {
  res.wood -= cost.wood;
  res.stone -= cost.stone;
  res.food -= cost.food;
}

function tileBlocked(gs: GameState, tx: number, ty: number, ignoreBuilding?: number): boolean {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
  const t = gs.tiles[ty][tx];
  if (t === "tree" || t === "rock" || t === "water") return true;
  for (const b of gs.buildings) {
    if (!b.alive) continue;
    if (ignoreBuilding !== undefined && b.id === ignoreBuilding) continue;
    if (tx >= b.tileX && tx < b.tileX + b.width && ty >= b.tileY && ty < b.tileY + b.height) return true;
  }
  return false;
}

function buildingAt(gs: GameState, tx: number, ty: number): Building | null {
  for (const b of gs.buildings) {
    if (!b.alive) continue;
    if (tx >= b.tileX && tx < b.tileX + b.width && ty >= b.tileY && ty < b.tileY + b.height) return b;
  }
  return null;
}

function astar(gs: GameState, sx: number, sy: number, ex: number, ey: number, maxSteps: number = 500): Vec2[] {
  const stx = Math.round(sx);
  const sty = Math.round(sy);
  let etx = Math.round(ex);
  let ety = Math.round(ey);

  if (etx < 0) etx = 0;
  if (ety < 0) ety = 0;
  if (etx >= MAP_W) etx = MAP_W - 1;
  if (ety >= MAP_H) ety = MAP_H - 1;

  if (stx === etx && sty === ety) return [{ x: etx, y: ety }];

  if (tileBlocked(gs, etx, ety)) {
    let best: Vec2 | null = null;
    let bestD = Infinity;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = etx + dx;
        const ny = ety + dy;
        if (!tileBlocked(gs, nx, ny)) {
          const d = dist(nx, ny, etx, ety);
          if (d < bestD) { bestD = d; best = { x: nx, y: ny }; }
        }
      }
    }
    if (best) { etx = best.x; ety = best.y; }
    else return [];
  }

  const open: { x: number; y: number; g: number; f: number; px: number; py: number }[] = [];
  const closed = new Set<string>();
  const gMap = new Map<string, number>();
  const parent = new Map<string, string>();

  const h = (x: number, y: number) => Math.abs(x - etx) + Math.abs(y - ety);
  const startKey = `${stx},${sty}`;
  open.push({ x: stx, y: sty, g: 0, f: h(stx, sty), px: -1, py: -1 });
  gMap.set(startKey, 0);

  let steps = 0;
  const dirs = [
    { dx: 1, dy: 0, c: 1 }, { dx: -1, dy: 0, c: 1 }, { dx: 0, dy: 1, c: 1 }, { dx: 0, dy: -1, c: 1 },
    { dx: 1, dy: 1, c: 1.41 }, { dx: -1, dy: 1, c: 1.41 }, { dx: 1, dy: -1, c: 1.41 }, { dx: -1, dy: -1, c: 1.41 },
  ];

  while (open.length > 0 && steps < maxSteps) {
    steps++;
    let bestIdx = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i].f < open[bestIdx].f) bestIdx = i;
    }
    const cur = open[bestIdx];
    open[bestIdx] = open[open.length - 1];
    open.pop();

    const curKey = `${cur.x},${cur.y}`;
    if (closed.has(curKey)) continue;
    closed.add(curKey);

    if (cur.x === etx && cur.y === ety) {
      const path: Vec2[] = [];
      let key = curKey;
      while (key) {
        const [px, py] = key.split(",").map(Number);
        path.push({ x: px, y: py });
        key = parent.get(key) || "";
      }
      path.reverse();
      return path;
    }

    for (const d of dirs) {
      const nx = cur.x + d.dx;
      const ny = cur.y + d.dy;
      const nKey = `${nx},${ny}`;
      if (closed.has(nKey)) continue;
      if (tileBlocked(gs, nx, ny)) continue;
      if (d.dx !== 0 && d.dy !== 0) {
        if (tileBlocked(gs, cur.x + d.dx, cur.y) && tileBlocked(gs, cur.x, cur.y + d.dy)) continue;
      }
      const ng = cur.g + d.c;
      const prevG = gMap.get(nKey);
      if (prevG === undefined || ng < prevG) {
        gMap.set(nKey, ng);
        parent.set(nKey, curKey);
        open.push({ x: nx, y: ny, g: ng, f: ng + h(nx, ny), px: cur.x, py: cur.y });
      }
    }
  }

  if (steps >= maxSteps) {
    let bestNode = { x: stx, y: sty };
    let bestH = h(stx, sty);
    closed.forEach(key => {
      const [px, py] = key.split(",").map(Number);
      const hv = h(px, py);
      if (hv < bestH) { bestH = hv; bestNode = { x: px, y: py }; }
    });
    if (bestNode.x !== stx || bestNode.y !== sty) {
      const path: Vec2[] = [];
      let key = `${bestNode.x},${bestNode.y}`;
      while (key) {
        const [px, py] = key.split(",").map(Number);
        path.push({ x: px, y: py });
        key = parent.get(key) || "";
      }
      path.reverse();
      return path;
    }
  }

  return [];
}

function rebuildSpatialHash(gs: GameState) {
  gs.spatialHash.clear();
  for (const u of gs.units) {
    if (!u.alive) continue;
    const tx = Math.floor(u.x);
    const ty = Math.floor(u.y);
    const key = hashKey(tx, ty);
    const arr = gs.spatialHash.get(key);
    if (arr) arr.push(u.id);
    else gs.spatialHash.set(key, [u.id]);
  }
}

function getUnitsInRange(gs: GameState, x: number, y: number, range: number): Unit[] {
  const results: Unit[] = [];
  const r = Math.ceil(range) + 1;
  const cx = Math.floor(x);
  const cy = Math.floor(y);
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const arr = gs.spatialHash.get(hashKey(cx + dx, cy + dy));
      if (!arr) continue;
      for (const id of arr) {
        const u = gs.units.find(u => u.id === id);
        if (u && u.alive && dist(x, y, u.x, u.y) <= range) {
          results.push(u);
        }
      }
    }
  }
  return results;
}

function isVisible(gs: GameState, tx: number, ty: number): boolean {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
  return gs.fog[ty][tx];
}

function updateFog(gs: GameState) {
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      gs.fog[y][x] = false;
    }
  }

  for (const u of gs.units) {
    if (!u.alive || u.team !== "player") continue;
    const r = u.visionRange;
    const cx = Math.floor(u.x);
    const cy = Math.floor(u.y);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          const tx = cx + dx;
          const ty = cy + dy;
          if (tx >= 0 && ty >= 0 && tx < MAP_W && ty < MAP_H) {
            gs.fog[ty][tx] = true;
          }
        }
      }
    }
  }
  for (const b of gs.buildings) {
    if (!b.alive || b.team !== "player") continue;
    const r = b.visionRange;
    const cx = Math.floor(b.tileX + b.width / 2);
    const cy = Math.floor(b.tileY + b.height / 2);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          const tx = cx + dx;
          const ty = cy + dy;
          if (tx >= 0 && ty >= 0 && tx < MAP_W && ty < MAP_H) {
            gs.fog[ty][tx] = true;
          }
        }
      }
    }
  }
}

function createUnit(gs: GameState, type: UnitType, team: Team, x: number, y: number): Unit {
  const stats = UNIT_STATS[type];
  const u: Unit = {
    id: gs.nextId++,
    type, team, x, y,
    hp: stats.hp, maxHp: stats.hp,
    damage: stats.damage, range: stats.range, speed: stats.speed,
    attackCooldown: type === "goose" || type === "owl" ? 1.5 : 1.0,
    attackTimer: 0,
    order: "idle",
    targetX: x, targetY: y,
    targetId: -1,
    path: [], pathIndex: 0,
    carryType: null, carryAmount: 0,
    buildTarget: -1,
    alive: true, selected: false,
    visionRange: stats.vision,
    controlGroup: -1,
    buildingToBuild: null,
    buildX: 0, buildY: 0,
    gatherTargetTileX: -1, gatherTargetTileY: -1,
  };
  gs.units.push(u);
  return u;
}

function createBuilding(gs: GameState, type: BuildingType, team: Team, tx: number, ty: number, preBuilt: boolean): Building {
  const size = BUILDING_SIZE[type];
  const b: Building = {
    id: gs.nextId++,
    type, team, tileX: tx, tileY: ty,
    width: size.w, height: size.h,
    hp: preBuilt ? BUILDING_HP[type] : 1,
    maxHp: BUILDING_HP[type],
    built: preBuilt,
    buildProgress: preBuilt ? 100 : 0,
    alive: true,
    rallyX: tx + size.w / 2, rallyY: ty + size.h + 1,
    productionQueue: [],
    productionTimer: 0,
    productionTime: 0,
    attackTimer: 0,
    selected: false,
    visionRange: BUILDING_VISION[type],
  };
  gs.buildings.push(b);

  if (preBuilt && type === "silo") {
    gs.supply[team].max += 10;
  }

  return b;
}

function addParticle(gs: GameState, x: number, y: number, color: string, count: number) {
  for (let i = 0; i < count; i++) {
    gs.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3 - 1,
      life: 0.5 + Math.random() * 0.5,
      maxLife: 0.5 + Math.random() * 0.5,
      color,
      size: 1 + Math.random() * 2,
    });
  }
}

function generateMap(gs: GameState) {
  gs.tiles = [];
  for (let y = 0; y < MAP_H; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < MAP_W; x++) {
      row.push("grass");
    }
    gs.tiles.push(row);
  }

  const playerZone = { x1: 0, y1: MAP_H - 12, x2: 12, y2: MAP_H };
  const aiZone = { x1: MAP_W - 12, y1: 0, x2: MAP_W, y2: 12 };

  const inZone = (x: number, y: number) => {
    return (x >= playerZone.x1 && x < playerZone.x2 && y >= playerZone.y1 && y < playerZone.y2) ||
           (x >= aiZone.x1 && x < aiZone.x2 && y >= aiZone.y1 && y < aiZone.y2);
  };

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (inZone(x, y)) continue;
      const r = Math.random();
      if (r < 0.08) gs.tiles[y][x] = "tree";
      else if (r < 0.12) gs.tiles[y][x] = "rock";
      else if (r < 0.15) gs.tiles[y][x] = "berry";
    }
  }

  for (let i = 0; i < 5; i++) {
    const cx = 5 + Math.floor(Math.random() * (MAP_W - 10));
    const cy = 5 + Math.floor(Math.random() * (MAP_H - 10));
    if (inZone(cx, cy)) continue;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H && !inZone(nx, ny) && Math.random() < 0.6) {
          gs.tiles[ny][nx] = "tree";
        }
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    const cx = 5 + Math.floor(Math.random() * (MAP_W - 10));
    const cy = 5 + Math.floor(Math.random() * (MAP_H - 10));
    if (inZone(cx, cy)) continue;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H && !inZone(nx, ny) && Math.random() < 0.7) {
          gs.tiles[ny][nx] = "rock";
        }
      }
    }
  }

  for (let d = -2; d <= 2; d++) {
    for (let d2 = -2; d2 <= 2; d2++) {
      const px = playerZone.x1 + 6 + d;
      const py = playerZone.y1 - 3 + d2;
      if (py >= 0 && py < MAP_H && px >= 0 && px < MAP_W) {
        if (Math.random() < 0.4) gs.tiles[py][px] = "tree";
        if (Math.random() < 0.2) gs.tiles[py][px] = "berry";
        if (Math.random() < 0.15) gs.tiles[py][px] = "rock";
      }
      const ax = aiZone.x1 - 3 + d;
      const ay = aiZone.y2 + d2;
      if (ay >= 0 && ay < MAP_H && ax >= 0 && ax < MAP_W) {
        if (Math.random() < 0.4) gs.tiles[ay][ax] = "tree";
        if (Math.random() < 0.2) gs.tiles[ay][ax] = "berry";
        if (Math.random() < 0.15) gs.tiles[ay][ax] = "rock";
      }
    }
  }

  const placeTrees = (cx: number, cy: number) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H && !inZone(nx, ny)) {
          gs.tiles[ny][nx] = "tree";
        }
      }
    }
  };

  const placeRocks = (cx: number, cy: number) => {
    for (let dy = 0; dy <= 1; dy++) {
      for (let dx = 0; dx <= 1; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H && !inZone(nx, ny)) {
          gs.tiles[ny][nx] = "rock";
        }
      }
    }
  };

  const placeBerries = (cx: number, cy: number) => {
    for (let dy = 0; dy <= 1; dy++) {
      for (let dx = 0; dx <= 1; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H && !inZone(nx, ny)) {
          gs.tiles[ny][nx] = "berry";
        }
      }
    }
  };

  placeTrees(3, MAP_H - 15);
  placeTrees(10, MAP_H - 14);
  placeRocks(7, MAP_H - 15);
  placeBerries(1, MAP_H - 14);
  placeBerries(9, MAP_H - 13);

  placeTrees(MAP_W - 5, 13);
  placeTrees(MAP_W - 11, 14);
  placeRocks(MAP_W - 8, 13);
  placeBerries(MAP_W - 3, 14);
  placeBerries(MAP_W - 10, 12);
}

function hasBuilding(gs: GameState, team: Team, type: BuildingType): boolean {
  return gs.buildings.some(b => b.alive && b.built && b.team === team && b.type === type);
}

function findNearestDropoff(gs: GameState, team: Team, x: number, y: number): Building | null {
  let best: Building | null = null;
  let bestD = Infinity;
  for (const b of gs.buildings) {
    if (!b.alive || !b.built || b.team !== team) continue;
    if (b.type !== "farmhouse" && b.type !== "silo") continue;
    const cx = b.tileX + b.width / 2;
    const cy = b.tileY + b.height / 2;
    const d = dist(x, y, cx, cy);
    if (d < bestD) { bestD = d; best = b; }
  }
  return best;
}

function findNearestEnemy(gs: GameState, x: number, y: number, team: Team, range: number): Unit | null {
  const enemies = getUnitsInRange(gs, x, y, range).filter(u => u.team !== team);
  if (enemies.length === 0) return null;
  let best: Unit | null = null;
  let bestD = Infinity;
  for (const e of enemies) {
    const d = dist(x, y, e.x, e.y);
    if (d < bestD) { bestD = d; best = e; }
  }
  return best;
}

function findNearestEnemyBuilding(gs: GameState, x: number, y: number, team: Team, range: number): Building | null {
  let best: Building | null = null;
  let bestD = Infinity;
  for (const b of gs.buildings) {
    if (!b.alive || b.team === team) continue;
    const cx = b.tileX + b.width / 2;
    const cy = b.tileY + b.height / 2;
    const d = dist(x, y, cx, cy);
    if (d <= range && d < bestD) { bestD = d; best = b; }
  }
  return best;
}

function canPlaceBuilding(gs: GameState, type: BuildingType, tx: number, ty: number): boolean {
  const size = BUILDING_SIZE[type];
  for (let dy = 0; dy < size.h; dy++) {
    for (let dx = 0; dx < size.w; dx++) {
      const nx = tx + dx;
      const ny = ty + dy;
      if (nx < 0 || ny < 0 || nx >= MAP_W || ny >= MAP_H) return false;
      if (gs.tiles[ny][nx] !== "grass") return false;
      if (buildingAt(gs, nx, ny)) return false;
    }
  }
  return true;
}

function findNearestResourceTile(gs: GameState, x: number, y: number, rType: TileType, maxRange: number = 20): Vec2 | null {
  let best: Vec2 | null = null;
  let bestD = Infinity;
  const cx = Math.floor(x);
  const cy = Math.floor(y);
  const r = Math.ceil(maxRange);
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const tx = cx + dx;
      const ty = cy + dy;
      if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) continue;
      if (gs.tiles[ty][tx] === rType) {
        const d = dist(x, y, tx, ty);
        if (d < bestD) { bestD = d; best = { x: tx, y: ty }; }
      }
    }
  }
  return best;
}

// =============================================================================
// GAME UPDATE
// =============================================================================

function updateGame(gs: GameState, dt: number) {
  if (gs.phase !== "playing") return;
  gs.gameTime += dt;

  const camSpeed = 15;
  if (gs.keysDown.has("w") || gs.keysDown.has("arrowup")) gs.camera.y -= camSpeed * dt * TILE;
  if (gs.keysDown.has("s") || gs.keysDown.has("arrowdown")) gs.camera.y += camSpeed * dt * TILE;
  if (gs.keysDown.has("a") || gs.keysDown.has("arrowleft")) gs.camera.x -= camSpeed * dt * TILE;
  if (gs.keysDown.has("d") || gs.keysDown.has("arrowright")) gs.camera.x += camSpeed * dt * TILE;

  rebuildSpatialHash(gs);
  updateFog(gs);
  updateUnits(gs, dt);
  updateBuildings(gs, dt);
  updateProjectiles(gs, dt);
  updateParticles(gs, dt);
  updateAI(gs, dt);

  const playerHQ = gs.buildings.find(b => b.type === "farmhouse" && b.team === "player" && b.alive);
  const aiHQ = gs.buildings.find(b => b.type === "farmhouse" && b.team === "ai" && b.alive);
  if (!playerHQ) gs.phase = "lost";
  if (!aiHQ) gs.phase = "won";
}

function updateUnits(gs: GameState, dt: number) {
  for (const u of gs.units) {
    if (!u.alive) continue;
    u.attackTimer = Math.max(0, u.attackTimer - dt);

    if (u.order === "idle") {
      const enemy = findNearestEnemy(gs, u.x, u.y, u.team, u.type === "farmer" ? 2 : u.range + 1);
      if (enemy && u.type !== "farmer") {
        u.order = "attack";
        u.targetId = enemy.id;
      }
    }

    if (u.order === "move" || u.order === "attackMove") {
      if (u.order === "attackMove") {
        const enemy = findNearestEnemy(gs, u.x, u.y, u.team, u.range + 2);
        if (enemy) {
          u.order = "attack";
          u.targetId = enemy.id;
          continue;
        }
        const eb = findNearestEnemyBuilding(gs, u.x, u.y, u.team, u.range + 2);
        if (eb) {
          u.order = "attack";
          u.targetId = eb.id;
          continue;
        }
      }
      moveAlongPath(gs, u, dt);
      if (u.path.length === 0 || u.pathIndex >= u.path.length) {
        if (dist(u.x, u.y, u.targetX, u.targetY) < 1.5) {
          u.order = "idle";
        } else {
          u.path = astar(gs, u.x, u.y, u.targetX, u.targetY);
          u.pathIndex = 0;
          if (u.path.length === 0) u.order = "idle";
        }
      }
    }

    if (u.order === "attack") {
      const target = gs.units.find(t => t.id === u.targetId && t.alive);
      const targetB = gs.buildings.find(t => t.id === u.targetId && t.alive);

      if (!target && !targetB) {
        u.order = "idle";
        u.targetId = -1;
        continue;
      }

      let tx: number, ty: number;
      if (target) { tx = target.x; ty = target.y; }
      else { tx = targetB!.tileX + targetB!.width / 2; ty = targetB!.tileY + targetB!.height / 2; }

      const d = dist(u.x, u.y, tx, ty);
      if (d > u.range + (targetB ? Math.max(targetB.width, targetB.height) / 2 : 0)) {
        u.targetX = tx;
        u.targetY = ty;
        if (u.path.length === 0 || u.pathIndex >= u.path.length) {
          u.path = astar(gs, u.x, u.y, tx, ty);
          u.pathIndex = 0;
        }
        moveAlongPath(gs, u, dt);
      } else {
        u.path = [];
        u.pathIndex = 0;
        if (u.attackTimer <= 0) {
          const dmg = u.damage + (u.type === "ram" && targetB ? 10 : 0);
          if (target) {
            target.hp -= dmg;
            if (u.range > 2) {
              gs.projectiles.push({
                x: u.x * TILE, y: u.y * TILE,
                tx: target.x * TILE, ty: target.y * TILE,
                speed: 300, damage: 0, team: u.team, targetId: target.id, alive: true,
              });
            }
            if (target.hp <= 0) {
              target.alive = false;
              addParticle(gs, target.x * TILE, target.y * TILE, "#ff4444", 8);
              u.order = "idle";
              u.targetId = -1;
            }
          } else if (targetB) {
            targetB.hp -= dmg;
            if (u.range > 2) {
              gs.projectiles.push({
                x: u.x * TILE, y: u.y * TILE,
                tx: (targetB.tileX + targetB.width / 2) * TILE,
                ty: (targetB.tileY + targetB.height / 2) * TILE,
                speed: 300, damage: 0, team: u.team, targetId: targetB.id, alive: true,
              });
            }
            if (targetB.hp <= 0) {
              targetB.alive = false;
              addParticle(gs, (targetB.tileX + targetB.width / 2) * TILE,
                (targetB.tileY + targetB.height / 2) * TILE, "#ff8844", 15);
              if (targetB.type === "silo") {
                gs.supply[targetB.team].max = Math.max(10, gs.supply[targetB.team].max - 10);
              }
              u.order = "idle";
              u.targetId = -1;
            }
          }
          u.attackTimer = u.attackCooldown;
          addParticle(gs, u.x * TILE, u.y * TILE, "#ffaa00", 3);
        }
      }
    }

    if (u.order === "gather" && u.type === "farmer") {
      const ttx = u.gatherTargetTileX;
      const tty = u.gatherTargetTileY;
      if (ttx < 0 || tty < 0 || ttx >= MAP_W || tty >= MAP_H) {
        u.order = "idle";
        continue;
      }
      const tile = gs.tiles[tty][ttx];
      if (tile !== "tree" && tile !== "rock" && tile !== "berry") {
        const rType = u.carryType === "wood" ? "tree" : u.carryType === "stone" ? "rock" : "berry";
        const newTarget = findNearestResourceTile(gs, u.x, u.y, rType as TileType);
        if (newTarget) {
          u.gatherTargetTileX = newTarget.x;
          u.gatherTargetTileY = newTarget.y;
        } else {
          u.order = "idle";
          continue;
        }
      }
      const d = dist(u.x, u.y, u.gatherTargetTileX + 0.5, u.gatherTargetTileY + 0.5);
      if (d > 1.8) {
        u.targetX = u.gatherTargetTileX;
        u.targetY = u.gatherTargetTileY;
        if (u.path.length === 0 || u.pathIndex >= u.path.length) {
          u.path = astar(gs, u.x, u.y, u.gatherTargetTileX, u.gatherTargetTileY);
          u.pathIndex = 0;
        }
        moveAlongPath(gs, u, dt);
      } else {
        u.path = [];
        const rTile = gs.tiles[u.gatherTargetTileY][u.gatherTargetTileX];
        const rType: ResourceType = rTile === "tree" ? "wood" : rTile === "rock" ? "stone" : "food";
        u.carryType = rType;
        u.carryAmount += GATHER_RATE * dt;
        if (u.carryAmount >= GATHER_CARRY) {
          u.carryAmount = GATHER_CARRY;
          if (Math.random() < 0.15) {
            gs.tiles[u.gatherTargetTileY][u.gatherTargetTileX] = "grass";
          }
          u.order = "returnResource";
          const dropoff = findNearestDropoff(gs, u.team, u.x, u.y);
          if (dropoff) {
            u.targetX = dropoff.tileX + dropoff.width / 2;
            u.targetY = dropoff.tileY + dropoff.height / 2;
            u.buildTarget = dropoff.id;
            u.path = astar(gs, u.x, u.y, u.targetX, u.targetY);
            u.pathIndex = 0;
          } else {
            u.order = "idle";
          }
        }
      }
    }

    if (u.order === "returnResource" && u.type === "farmer") {
      const dropoff = gs.buildings.find(b => b.id === u.buildTarget && b.alive);
      if (!dropoff) {
        u.order = "idle";
        continue;
      }
      const cx = dropoff.tileX + dropoff.width / 2;
      const cy = dropoff.tileY + dropoff.height / 2;
      const d = dist(u.x, u.y, cx, cy);
      if (d > 2) {
        moveAlongPath(gs, u, dt);
        if (u.path.length === 0 || u.pathIndex >= u.path.length) {
          u.path = astar(gs, u.x, u.y, cx, cy);
          u.pathIndex = 0;
        }
      } else {
        if (u.carryType) {
          gs.resources[u.team][u.carryType] += u.carryAmount;
        }
        u.carryAmount = 0;
        u.carryType = null;
        addParticle(gs, u.x * TILE, u.y * TILE, "#ffdd44", 3);
        if (u.gatherTargetTileX >= 0 && u.gatherTargetTileY >= 0) {
          const tile = gs.tiles[u.gatherTargetTileY]?.[u.gatherTargetTileX];
          if (tile === "tree" || tile === "rock" || tile === "berry") {
            u.order = "gather";
            u.path = astar(gs, u.x, u.y, u.gatherTargetTileX, u.gatherTargetTileY);
            u.pathIndex = 0;
          } else {
            const rType = u.gatherTargetTileX >= 0 ?
              (gs.tiles[u.gatherTargetTileY]?.[u.gatherTargetTileX] === "tree" ? "tree" :
               gs.tiles[u.gatherTargetTileY]?.[u.gatherTargetTileX] === "rock" ? "rock" : "berry") : "tree";
            const newTarget = findNearestResourceTile(gs, u.x, u.y, rType as TileType);
            if (newTarget) {
              u.gatherTargetTileX = newTarget.x;
              u.gatherTargetTileY = newTarget.y;
              u.order = "gather";
              u.path = astar(gs, u.x, u.y, newTarget.x, newTarget.y);
              u.pathIndex = 0;
            } else {
              u.order = "idle";
            }
          }
        } else {
          u.order = "idle";
        }
      }
    }

    if (u.order === "build" && u.type === "farmer") {
      const target = gs.buildings.find(b => b.id === u.buildTarget && b.alive);
      if (!target || target.built) {
        u.order = "idle";
        continue;
      }
      const cx = target.tileX + target.width / 2;
      const cy = target.tileY + target.height / 2;
      const d = dist(u.x, u.y, cx, cy);
      if (d > 2.5) {
        if (u.path.length === 0 || u.pathIndex >= u.path.length) {
          u.path = astar(gs, u.x, u.y, cx, cy);
          u.pathIndex = 0;
        }
        moveAlongPath(gs, u, dt);
      } else {
        u.path = [];
        target.buildProgress += (BUILD_RATE / BUILDING_BUILD_TIME[target.type]) * dt;
        target.hp = Math.min(target.maxHp, Math.floor((target.buildProgress / 100) * target.maxHp));
        if (target.buildProgress >= 100) {
          target.built = true;
          target.buildProgress = 100;
          target.hp = target.maxHp;
          if (target.type === "silo") {
            gs.supply[target.team].max += 10;
          }
          addParticle(gs, cx * TILE, cy * TILE, "#44ff44", 10);
          u.order = "idle";
        }
      }
    }
  }

  gs.supply.player.current = gs.units.filter(u => u.alive && u.team === "player").length;
  gs.supply.ai.current = gs.units.filter(u => u.alive && u.team === "ai").length;
}

function moveAlongPath(gs: GameState, u: Unit, dt: number) {
  if (u.path.length === 0 || u.pathIndex >= u.path.length) return;
  const target = u.path[u.pathIndex];
  const dx = target.x - u.x;
  const dy = target.y - u.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d < 0.2) {
    u.pathIndex++;
    return;
  }
  const step = u.speed * dt;
  if (step >= d) {
    u.x = target.x;
    u.y = target.y;
    u.pathIndex++;
  } else {
    u.x += (dx / d) * step;
    u.y += (dy / d) * step;
  }

  for (const other of gs.units) {
    if (other.id === u.id || !other.alive) continue;
    const od = dist(u.x, u.y, other.x, other.y);
    if (od < 0.4 && od > 0.01) {
      const pushX = (u.x - other.x) / od * 0.1;
      const pushY = (u.y - other.y) / od * 0.1;
      u.x += pushX;
      u.y += pushY;
    }
  }

  u.x = clamp(u.x, 0, MAP_W - 1);
  u.y = clamp(u.y, 0, MAP_H - 1);
}

function updateBuildings(gs: GameState, dt: number) {
  for (const b of gs.buildings) {
    if (!b.alive || !b.built) continue;

    if (b.type === "watchtower") {
      b.attackTimer = Math.max(0, b.attackTimer - dt);
      if (b.attackTimer <= 0) {
        const cx = b.tileX + b.width / 2;
        const cy = b.tileY + b.height / 2;
        const enemies = getUnitsInRange(gs, cx, cy, 5).filter(u => u.team !== b.team);
        if (enemies.length > 0) {
          const target = enemies[0];
          target.hp -= 8;
          gs.projectiles.push({
            x: cx * TILE, y: cy * TILE,
            tx: target.x * TILE, ty: target.y * TILE,
            speed: 400, damage: 0, team: b.team, targetId: target.id, alive: true,
          });
          if (target.hp <= 0) {
            target.alive = false;
            addParticle(gs, target.x * TILE, target.y * TILE, "#ff4444", 8);
          }
          b.attackTimer = 1.5;
        }
      }
    }

    if (b.productionQueue.length > 0) {
      const unitType = b.productionQueue[0];
      if (b.productionTime <= 0) {
        b.productionTime = PRODUCTION_TIMES[unitType];
      }
      b.productionTimer += dt;
      if (b.productionTimer >= b.productionTime) {
        const supply = gs.supply[b.team];
        if (supply.current < supply.max) {
          let spawnX = b.rallyX;
          let spawnY = b.rallyY;
          if (tileBlocked(gs, Math.round(spawnX), Math.round(spawnY))) {
            for (let dy = -2; dy <= 2; dy++) {
              for (let dx = -2; dx <= 2; dx++) {
                if (!tileBlocked(gs, Math.round(b.rallyX + dx), Math.round(b.rallyY + dy))) {
                  spawnX = b.rallyX + dx;
                  spawnY = b.rallyY + dy;
                  break;
                }
              }
            }
          }
          createUnit(gs, unitType, b.team, spawnX, spawnY);
          b.productionQueue.shift();
          b.productionTimer = 0;
          b.productionTime = 0;
          addParticle(gs, spawnX * TILE, spawnY * TILE, "#44ff44", 5);
        }
      }
    }
  }
}

function updateProjectiles(gs: GameState, dt: number) {
  for (const p of gs.projectiles) {
    if (!p.alive) continue;
    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 5) {
      p.alive = false;
      addParticle(gs, p.x, p.y, "#ffaa44", 3);
      continue;
    }
    const step = p.speed * dt;
    p.x += (dx / d) * step;
    p.y += (dy / d) * step;
  }
}

function updateParticles(gs: GameState, dt: number) {
  for (const p of gs.particles) {
    p.x += p.vx * dt * 60;
    p.y += p.vy * dt * 60;
    p.vy += 2 * dt;
    p.life -= dt;
  }
  gs.particles = gs.particles.filter(p => p.life > 0);
}

// =============================================================================
// AI
// =============================================================================

function updateAI(gs: GameState, dt: number) {
  gs.aiTimer += dt;

  if (gs.gameTime < 120) gs.aiPhase = "economy";
  else if (gs.gameTime < 300) gs.aiPhase = "buildup";
  else gs.aiPhase = "aggression";

  gs.aiAttackTimer += dt;

  const res = gs.resources.ai;
  const aiBuildings = gs.buildings.filter(b => b.alive && b.team === "ai");
  const aiFarmers = gs.units.filter(u => u.alive && u.team === "ai" && u.type === "farmer");
  const aiMilitary = gs.units.filter(u => u.alive && u.team === "ai" && u.type !== "farmer");
  const aiHQ = aiBuildings.find(b => b.type === "farmhouse");

  if (!aiHQ) return;

  if (gs.aiTimer < 0.5) return;
  gs.aiTimer = 0;

  const hasBarn = hasBuilding(gs, "ai", "barn");
  const hasStable = hasBuilding(gs, "ai", "stable");
  const hasRoost = hasBuilding(gs, "ai", "roost");
  const supply = gs.supply.ai;

  if (gs.aiPhase === "economy" || aiFarmers.length < 3) {
    if (aiFarmers.length < 6 && supply.current < supply.max) {
      if (canAfford(res, UNIT_COSTS.farmer) && aiHQ.productionQueue.length < 2) {
        subtractCost(res, UNIT_COSTS.farmer);
        aiHQ.productionQueue.push("farmer");
      }
    }

    for (const f of aiFarmers) {
      if (f.order === "idle") {
        const treeTile = findNearestResourceTile(gs, f.x, f.y, "tree", 25);
        const berryTile = findNearestResourceTile(gs, f.x, f.y, "berry", 25);
        const rockTile = findNearestResourceTile(gs, f.x, f.y, "rock", 25);

        if (res.food < 100 && berryTile) {
          aiGatherOrder(gs, f, berryTile.x, berryTile.y);
        } else if (res.wood < 150 && treeTile) {
          aiGatherOrder(gs, f, treeTile.x, treeTile.y);
        } else if (res.stone < 80 && rockTile) {
          aiGatherOrder(gs, f, rockTile.x, rockTile.y);
        } else if (treeTile) {
          aiGatherOrder(gs, f, treeTile.x, treeTile.y);
        }
      }
    }

    if (!hasBarn && canAfford(res, BUILDING_COSTS.barn)) {
      const pos = aiFindBuildSpot(gs, aiHQ, BUILDING_SIZE.barn);
      if (pos) {
        aiPlaceBuilding(gs, "barn", pos.x, pos.y);
      }
    }

    if (supply.max < 20 && canAfford(res, BUILDING_COSTS.silo) && hasBarn) {
      const pos = aiFindBuildSpot(gs, aiHQ, BUILDING_SIZE.silo);
      if (pos) {
        aiPlaceBuilding(gs, "silo", pos.x, pos.y);
      }
    }
  }

  if (gs.aiPhase === "buildup" || gs.aiPhase === "aggression") {
    if (aiFarmers.length < 4 && supply.current < supply.max && canAfford(res, UNIT_COSTS.farmer)) {
      if (aiHQ.productionQueue.length < 2) {
        subtractCost(res, UNIT_COSTS.farmer);
        aiHQ.productionQueue.push("farmer");
      }
    }

    for (const f of aiFarmers) {
      if (f.order === "idle") {
        const treeTile = findNearestResourceTile(gs, f.x, f.y, "tree", 25);
        const berryTile = findNearestResourceTile(gs, f.x, f.y, "berry", 25);
        const rockTile = findNearestResourceTile(gs, f.x, f.y, "rock", 25);
        if (res.food < 200 && berryTile) aiGatherOrder(gs, f, berryTile.x, berryTile.y);
        else if (res.wood < 200 && treeTile) aiGatherOrder(gs, f, treeTile.x, treeTile.y);
        else if (res.stone < 100 && rockTile) aiGatherOrder(gs, f, rockTile.x, rockTile.y);
        else if (treeTile) aiGatherOrder(gs, f, treeTile.x, treeTile.y);
      }
    }

    if (!hasBarn && canAfford(res, BUILDING_COSTS.barn)) {
      const pos = aiFindBuildSpot(gs, aiHQ, BUILDING_SIZE.barn);
      if (pos) aiPlaceBuilding(gs, "barn", pos.x, pos.y);
    }

    if (hasBarn && !hasStable && canAfford(res, BUILDING_COSTS.stable)) {
      const pos = aiFindBuildSpot(gs, aiHQ, BUILDING_SIZE.stable);
      if (pos) aiPlaceBuilding(gs, "stable", pos.x, pos.y);
    }

    if (!hasRoost && canAfford(res, BUILDING_COSTS.roost)) {
      const pos = aiFindBuildSpot(gs, aiHQ, BUILDING_SIZE.roost);
      if (pos) aiPlaceBuilding(gs, "roost", pos.x, pos.y);
    }

    const siloCount = aiBuildings.filter(b => b.type === "silo").length;
    if (siloCount < 3 && canAfford(res, BUILDING_COSTS.silo)) {
      const pos = aiFindBuildSpot(gs, aiHQ, BUILDING_SIZE.silo);
      if (pos) aiPlaceBuilding(gs, "silo", pos.x, pos.y);
    }

    const towerCount = aiBuildings.filter(b => b.type === "watchtower").length;
    if (towerCount < 2 && canAfford(res, BUILDING_COSTS.watchtower)) {
      const pos = aiFindBuildSpot(gs, aiHQ, BUILDING_SIZE.watchtower);
      if (pos) aiPlaceBuilding(gs, "watchtower", pos.x, pos.y);
    }

    const barnB = aiBuildings.find(b => b.type === "barn" && b.built);
    if (barnB && supply.current < supply.max && barnB.productionQueue.length < 2) {
      if (aiMilitary.length < 4 && canAfford(res, UNIT_COSTS.rooster)) {
        subtractCost(res, UNIT_COSTS.rooster);
        barnB.productionQueue.push("rooster");
      } else if (canAfford(res, UNIT_COSTS.goose)) {
        subtractCost(res, UNIT_COSTS.goose);
        barnB.productionQueue.push("goose");
      }
    }

    const stableB = aiBuildings.find(b => b.type === "stable" && b.built);
    if (stableB && supply.current < supply.max && stableB.productionQueue.length < 2) {
      if (canAfford(res, UNIT_COSTS.ram)) {
        subtractCost(res, UNIT_COSTS.ram);
        stableB.productionQueue.push("ram");
      }
    }

    const roostB = aiBuildings.find(b => b.type === "roost" && b.built);
    if (roostB && supply.current < supply.max && roostB.productionQueue.length < 2) {
      if (canAfford(res, UNIT_COSTS.owl)) {
        subtractCost(res, UNIT_COSTS.owl);
        roostB.productionQueue.push("owl");
      }
    }

    if (!gs.aiScoutSent && aiMilitary.length >= 2) {
      const scout = aiMilitary.find(u => u.type === "rooster" || u.type === "owl");
      if (scout) {
        scout.order = "attackMove";
        scout.targetX = 5;
        scout.targetY = MAP_H - 5;
        scout.path = astar(gs, scout.x, scout.y, scout.targetX, scout.targetY);
        scout.pathIndex = 0;
        gs.aiScoutSent = true;
      }
    }
  }

  if (gs.aiPhase === "aggression") {
    const attackInterval = Math.max(30, 90 - (gs.gameTime - 300) / 10);
    if (gs.aiAttackTimer >= attackInterval && aiMilitary.length >= 3) {
      gs.aiAttackTimer = 0;
      const playerHQ = gs.buildings.find(b => b.type === "farmhouse" && b.team === "player" && b.alive);
      if (playerHQ) {
        const targetX = playerHQ.tileX + playerHQ.width / 2;
        const targetY = playerHQ.tileY + playerHQ.height / 2;
        for (const m of aiMilitary) {
          if (m.order === "idle" || m.order === "move") {
            m.order = "attackMove";
            m.targetX = targetX + (Math.random() - 0.5) * 4;
            m.targetY = targetY + (Math.random() - 0.5) * 4;
            m.path = astar(gs, m.x, m.y, m.targetX, m.targetY);
            m.pathIndex = 0;
          }
        }
      }
    }
  }

  for (const b of aiBuildings) {
    if (!b.built && !b.alive) continue;
    if (!b.built) {
      const idleFarmer = aiFarmers.find(f => f.order === "idle" || f.order === "gather");
      if (idleFarmer) {
        idleFarmer.order = "build";
        idleFarmer.buildTarget = b.id;
        idleFarmer.path = astar(gs, idleFarmer.x, idleFarmer.y,
          b.tileX + b.width / 2, b.tileY + b.height / 2);
        idleFarmer.pathIndex = 0;
      }
    }
  }
}

function aiGatherOrder(gs: GameState, farmer: Unit, tx: number, ty: number) {
  farmer.order = "gather";
  farmer.gatherTargetTileX = tx;
  farmer.gatherTargetTileY = ty;
  farmer.path = astar(gs, farmer.x, farmer.y, tx, ty);
  farmer.pathIndex = 0;
}

function aiFindBuildSpot(gs: GameState, hq: Building, size: { w: number; h: number }): Vec2 | null {
  for (let r = 2; r < 10; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const tx = hq.tileX + dx;
        const ty = hq.tileY + dy;
        if (canPlaceBuilding(gs, "barn", tx, ty)) {
          return { x: tx, y: ty };
        }
      }
    }
  }
  return null;
}

function aiPlaceBuilding(gs: GameState, type: BuildingType, tx: number, ty: number) {
  const gs2 = gs;
  subtractCost(gs2.resources.ai, BUILDING_COSTS[type]);
  createBuilding(gs2, type, "ai", tx, ty, false);
}

// =============================================================================
// RENDER
// =============================================================================

function render(gs: GameState, ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number, fogCtx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvasW, canvasH);

  const mapPxW = MAP_W * TILE;
  const mapPxH = MAP_H * TILE;
  gs.camera.x = clamp(gs.camera.x, 0, mapPxW - canvasW);
  gs.camera.y = clamp(gs.camera.y, 0, mapPxH - canvasH + UI_BOTTOM_H);

  const cx = gs.camera.x;
  const cy = gs.camera.y;
  const startTX = Math.floor(cx / TILE);
  const startTY = Math.floor(cy / TILE);
  const endTX = Math.min(MAP_W, startTX + Math.ceil(canvasW / TILE) + 2);
  const endTY = Math.min(MAP_H, startTY + Math.ceil(canvasH / TILE) + 2);

  for (let ty = startTY; ty < endTY; ty++) {
    for (let tx = startTX; tx < endTX; tx++) {
      const sx = tx * TILE - cx;
      const sy = ty * TILE - cy;
      const tile = gs.tiles[ty]?.[tx];
      if (!tile) continue;

      ctx.fillStyle = (tx + ty) % 2 === 0 ? COLORS.grass : COLORS.grassAlt;
      ctx.fillRect(sx, sy, TILE, TILE);

      if (tile === "tree") {
        ctx.fillStyle = COLORS.treeTrunk;
        ctx.fillRect(sx + 10, sy + 14, 4, 10);
        ctx.fillStyle = COLORS.tree;
        ctx.beginPath();
        ctx.arc(sx + 12, sy + 10, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2a7a2a";
        ctx.beginPath();
        ctx.arc(sx + 10, sy + 8, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (tile === "rock") {
        ctx.fillStyle = COLORS.rockDark;
        ctx.beginPath();
        ctx.moveTo(sx + 4, sy + 20);
        ctx.lineTo(sx + 8, sy + 6);
        ctx.lineTo(sx + 18, sy + 4);
        ctx.lineTo(sx + 22, sy + 14);
        ctx.lineTo(sx + 16, sy + 22);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = COLORS.rock;
        ctx.beginPath();
        ctx.moveTo(sx + 6, sy + 18);
        ctx.lineTo(sx + 9, sy + 8);
        ctx.lineTo(sx + 17, sy + 6);
        ctx.lineTo(sx + 20, sy + 14);
        ctx.lineTo(sx + 14, sy + 20);
        ctx.closePath();
        ctx.fill();
      } else if (tile === "berry") {
        ctx.fillStyle = COLORS.berry;
        ctx.beginPath();
        ctx.arc(sx + 12, sy + 14, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = COLORS.berryFruit;
        for (let i = 0; i < 4; i++) {
          const bx = sx + 8 + (i % 2) * 8;
          const by = sy + 10 + Math.floor(i / 2) * 7;
          ctx.beginPath();
          ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (tile === "water") {
        ctx.fillStyle = COLORS.water;
        ctx.fillRect(sx, sy, TILE, TILE);
      }
    }
  }

  for (const b of gs.buildings) {
    if (!b.alive) continue;
    const sx = b.tileX * TILE - cx;
    const sy = b.tileY * TILE - cy;
    const w = b.width * TILE;
    const h = b.height * TILE;

    if (sx + w < 0 || sy + h < 0 || sx > canvasW || sy > canvasH) continue;
    if (b.team === "ai" && !isVisible(gs, b.tileX, b.tileY)) continue;

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(sx + 3, sy + 3, w, h);

    drawBuilding(ctx, b, sx, sy, w, h);

    if (!b.built) {
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(sx, sy, w, h);
      ctx.fillStyle = "#44ff44";
      ctx.fillRect(sx + 2, sy + h - 6, (w - 4) * (b.buildProgress / 100), 4);
      ctx.strokeStyle = "#226622";
      ctx.strokeRect(sx + 2, sy + h - 6, w - 4, 4);
    }

    if (b.hp < b.maxHp) {
      drawHPBar(ctx, sx, sy - 6, w, b.hp, b.maxHp);
    }

    if (b.selected) {
      ctx.strokeStyle = COLORS.selectGreen;
      ctx.lineWidth = 2;
      ctx.strokeRect(sx - 1, sy - 1, w + 2, h + 2);
    }
  }

  for (const u of gs.units) {
    if (!u.alive) continue;
    const sx = u.x * TILE - cx;
    const sy = u.y * TILE - cy;
    if (sx < -TILE || sy < -TILE || sx > canvasW + TILE || sy > canvasH + TILE) continue;
    if (u.team === "ai" && !isVisible(gs, Math.floor(u.x), Math.floor(u.y))) continue;

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(sx + TILE / 2 + 2, sy + TILE - 2, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    drawUnit(ctx, u, sx, sy, gs.gameTime);

    if (u.hp < u.maxHp) {
      drawHPBar(ctx, sx, sy - 4, TILE, u.hp, u.maxHp);
    }

    if (u.carryType) {
      const colors: Record<ResourceType, string> = { wood: "#8B4513", stone: "#888", food: "#44aa44" };
      ctx.fillStyle = colors[u.carryType];
      ctx.fillRect(sx + TILE - 8, sy, 6, 6);
    }

    if (u.selected) {
      ctx.strokeStyle = COLORS.selectGreen;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sx + TILE / 2, sy + TILE / 2, TILE / 2 + 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  for (const p of gs.projectiles) {
    if (!p.alive) continue;
    const sx = p.x - cx;
    const sy = p.y - cy;
    ctx.fillStyle = p.team === "player" ? "#44aaff" : "#ff4444";
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const p of gs.particles) {
    const alpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - cx - p.size / 2, p.y - cy - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;

  renderFog(gs, fogCtx, canvasW, canvasH, cx, cy);
  ctx.drawImage(fogCtx.canvas, 0, 0);

  if (gs.selectionBox.active) {
    const bx1 = Math.min(gs.selectionBox.x1, gs.selectionBox.x2);
    const by1 = Math.min(gs.selectionBox.y1, gs.selectionBox.y2);
    const bx2 = Math.max(gs.selectionBox.x1, gs.selectionBox.x2);
    const by2 = Math.max(gs.selectionBox.y1, gs.selectionBox.y2);
    ctx.fillStyle = COLORS.selectBox;
    ctx.fillRect(bx1, by1, bx2 - bx1, by2 - by1);
    ctx.strokeStyle = COLORS.selectGreen;
    ctx.lineWidth = 1;
    ctx.strokeRect(bx1, by1, bx2 - bx1, by2 - by1);
  }

  if (gs.buildingToBuild) {
    const mx = gs.mouseX;
    const my = gs.mouseY;
    const tx = Math.floor((mx + cx) / TILE);
    const ty = Math.floor((my + cy) / TILE);
    const size = BUILDING_SIZE[gs.buildingToBuild];
    const valid = canPlaceBuilding(gs, gs.buildingToBuild, tx, ty);
    ctx.fillStyle = valid ? "rgba(68,255,68,0.3)" : "rgba(255,68,68,0.3)";
    ctx.fillRect(tx * TILE - cx, ty * TILE - cy, size.w * TILE, size.h * TILE);
    ctx.strokeStyle = valid ? "#44ff44" : "#ff4444";
    ctx.lineWidth = 2;
    ctx.strokeRect(tx * TILE - cx, ty * TILE - cy, size.w * TILE, size.h * TILE);
    ctx.fillStyle = "#fff";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(BUILDING_LABELS[gs.buildingToBuild], tx * TILE - cx + size.w * TILE / 2, ty * TILE - cy - 4);
  }

  renderMinimap(gs, ctx, canvasW, canvasH);
  renderUI(gs, ctx, canvasW, canvasH);
}

function drawBuilding(ctx: CanvasRenderingContext2D, b: Building, sx: number, sy: number, w: number, h: number) {
  const teamColor = b.team === "player" ? "#3366cc" : "#cc3333";
  const wallColor = b.team === "player" ? "#c4a060" : "#a06040";

  switch (b.type) {
    case "farmhouse":
      ctx.fillStyle = wallColor;
      ctx.fillRect(sx + 4, sy + h * 0.3, w - 8, h * 0.7 - 2);
      ctx.fillStyle = teamColor;
      ctx.beginPath();
      ctx.moveTo(sx, sy + h * 0.35);
      ctx.lineTo(sx + w / 2, sy + 2);
      ctx.lineTo(sx + w, sy + h * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#5a3a1a";
      ctx.fillRect(sx + w / 2 - 6, sy + h * 0.55, 12, h * 0.45 - 2);
      ctx.fillStyle = "#ffe8a0";
      ctx.fillRect(sx + 8, sy + h * 0.4, 8, 8);
      ctx.fillRect(sx + w - 16, sy + h * 0.4, 8, 8);
      break;
    case "barn":
      ctx.fillStyle = "#8B2500";
      ctx.fillRect(sx + 2, sy + h * 0.25, w - 4, h * 0.75 - 2);
      ctx.fillStyle = teamColor;
      ctx.beginPath();
      ctx.moveTo(sx, sy + h * 0.3);
      ctx.lineTo(sx + w / 2, sy + 2);
      ctx.lineTo(sx + w, sy + h * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#daa520";
      ctx.fillRect(sx + w / 2 - 8, sy + h * 0.4, 16, h * 0.6 - 4);
      ctx.strokeStyle = "#5a3a1a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx + w / 2 - 8, sy + h * 0.4);
      ctx.lineTo(sx + w / 2 + 8, sy + h - 4);
      ctx.moveTo(sx + w / 2 + 8, sy + h * 0.4);
      ctx.lineTo(sx + w / 2 - 8, sy + h - 4);
      ctx.stroke();
      break;
    case "stable":
      ctx.fillStyle = "#6a4a2a";
      ctx.fillRect(sx + 2, sy + h * 0.2, w - 4, h * 0.8 - 2);
      ctx.fillStyle = teamColor;
      ctx.fillRect(sx, sy + h * 0.15, w, 6);
      ctx.fillStyle = "#4a3a20";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(sx + 6 + i * (w - 12) / 2, sy + h * 0.35, 3, h * 0.6);
      }
      ctx.fillStyle = "#ffe8a0";
      ctx.fillRect(sx + w / 2 - 10, sy + h * 0.35, 20, 12);
      break;
    case "roost":
      ctx.fillStyle = "#8a7a5a";
      ctx.fillRect(sx + 4, sy + h * 0.4, w - 8, h * 0.6 - 2);
      ctx.fillStyle = teamColor;
      ctx.beginPath();
      ctx.moveTo(sx + 2, sy + h * 0.45);
      ctx.lineTo(sx + w / 2, sy + 4);
      ctx.lineTo(sx + w - 2, sy + h * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#3a3a3a";
      ctx.beginPath();
      ctx.arc(sx + w / 2, sy + h * 0.55, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "silo":
      ctx.fillStyle = "#aaa";
      ctx.fillRect(sx + w * 0.2, sy + h * 0.2, w * 0.6, h * 0.8 - 2);
      ctx.fillStyle = teamColor;
      ctx.beginPath();
      ctx.arc(sx + w / 2, sy + h * 0.25, w * 0.3, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "#888";
      ctx.fillRect(sx + w * 0.25, sy + h * 0.5, w * 0.5, 2);
      ctx.fillRect(sx + w * 0.25, sy + h * 0.7, w * 0.5, 2);
      break;
    case "fence":
      ctx.fillStyle = "#8a6a3a";
      ctx.fillRect(sx + 2, sy + 6, w - 4, 4);
      ctx.fillRect(sx + 2, sy + 14, w - 4, 4);
      ctx.fillRect(sx + 4, sy + 2, 3, 20);
      ctx.fillRect(sx + w - 7, sy + 2, 3, 20);
      break;
    case "watchtower":
      ctx.fillStyle = "#6a5a3a";
      ctx.fillRect(sx + w * 0.3, sy + h * 0.3, w * 0.4, h * 0.7 - 2);
      ctx.fillStyle = wallColor;
      ctx.fillRect(sx + 2, sy + h * 0.15, w - 4, h * 0.25);
      ctx.fillStyle = teamColor;
      ctx.fillRect(sx, sy + h * 0.1, w, 4);
      ctx.fillStyle = "#5a4a2a";
      ctx.fillRect(sx + w * 0.35, sy + h * 0.2, 3, h * 0.15);
      ctx.fillRect(sx + w * 0.6, sy + h * 0.2, 3, h * 0.15);
      break;
  }
}

function drawUnit(ctx: CanvasRenderingContext2D, u: Unit, sx: number, sy: number, time: number) {
  const teamColor = u.team === "player" ? "#3388ff" : "#ff3333";
  const bounce = Math.sin(time * 4 + u.id) * 1.5;
  const cy = sy + bounce;

  switch (u.type) {
    case "farmer": {
      ctx.fillStyle = u.team === "player" ? "#ddb87a" : "#c09060";
      ctx.beginPath();
      ctx.arc(sx + 12, cy + 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = teamColor;
      ctx.fillRect(sx + 7, cy + 11, 10, 8);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(sx + 8, cy + 19, 3, 4);
      ctx.fillRect(sx + 13, cy + 19, 3, 4);
      ctx.fillStyle = "#daa520";
      ctx.fillRect(sx + 5, cy + 1, 14, 3);
      break;
    }
    case "rooster": {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(sx + 12, cy + 14, 7, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(sx + 14, cy + 7, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff3333";
      ctx.beginPath();
      ctx.moveTo(sx + 14, cy + 1);
      ctx.lineTo(sx + 12, cy + 5);
      ctx.lineTo(sx + 16, cy + 5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ff3333";
      ctx.beginPath();
      ctx.moveTo(sx + 18, cy + 8);
      ctx.lineTo(sx + 21, cy + 9);
      ctx.lineTo(sx + 18, cy + 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffa500";
      ctx.beginPath();
      ctx.moveTo(sx + 19, cy + 6);
      ctx.lineTo(sx + 22, cy + 7);
      ctx.lineTo(sx + 19, cy + 8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(sx + 16, cy + 6, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = teamColor;
      const tw = Math.sin(time * 6 + u.id) * 4;
      ctx.beginPath();
      ctx.moveTo(sx + 5, cy + 14);
      ctx.lineTo(sx + 2 + tw, cy + 12);
      ctx.lineTo(sx + 1 + tw, cy + 16);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffa500";
      ctx.fillRect(sx + 9, cy + 20, 2, 3);
      ctx.fillRect(sx + 14, cy + 20, 2, 3);
      break;
    }
    case "goose": {
      ctx.fillStyle = "#eee";
      ctx.beginPath();
      ctx.ellipse(sx + 12, cy + 16, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#eee";
      ctx.beginPath();
      ctx.moveTo(sx + 14, cy + 12);
      ctx.quadraticCurveTo(sx + 16, cy + 4, sx + 14, cy + 2);
      ctx.quadraticCurveTo(sx + 10, cy + 4, sx + 14, cy + 12);
      ctx.fill();
      ctx.fillStyle = "#eee";
      ctx.beginPath();
      ctx.arc(sx + 14, cy + 3, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff8800";
      ctx.beginPath();
      ctx.moveTo(sx + 18, cy + 3);
      ctx.lineTo(sx + 22, cy + 2);
      ctx.lineTo(sx + 18, cy + 5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(sx + 16, cy + 2, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = teamColor;
      ctx.beginPath();
      ctx.moveTo(sx + 5, cy + 14);
      ctx.lineTo(sx + 2, cy + 10);
      ctx.lineTo(sx + 1, cy + 16);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx + 19, cy + 14);
      ctx.lineTo(sx + 22, cy + 10);
      ctx.lineTo(sx + 23, cy + 16);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ff8800";
      ctx.fillRect(sx + 9, cy + 20, 2, 3);
      ctx.fillRect(sx + 14, cy + 20, 2, 3);
      break;
    }
    case "ram": {
      ctx.fillStyle = "#ccc";
      ctx.beginPath();
      ctx.ellipse(sx + 12, cy + 14, 9, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#bbb";
      ctx.beginPath();
      ctx.arc(sx + 16, cy + 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8a7a5a";
      ctx.beginPath();
      ctx.arc(sx + 10, cy + 6, 4, Math.PI * 0.5, Math.PI * 1.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx + 22, cy + 6, 4, Math.PI * 1.2, Math.PI * 2.5);
      ctx.stroke();
      ctx.strokeStyle = "#8a7a5a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx + 10, cy + 6, 4, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx + 22, cy + 6, 4, Math.PI * 1.5, Math.PI * 2.5);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(sx + 18, cy + 7, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#555";
      ctx.fillRect(sx + 7, cy + 20, 3, 3);
      ctx.fillRect(sx + 11, cy + 20, 3, 3);
      ctx.fillRect(sx + 15, cy + 20, 3, 3);
      ctx.fillRect(sx + 7, cy + 20, 3, 3);
      ctx.fillStyle = teamColor;
      ctx.fillRect(sx + 5, cy + 10, 2, 8);
      break;
    }
    case "bull": {
      ctx.fillStyle = "#5a3a1a";
      ctx.beginPath();
      ctx.ellipse(sx + 12, cy + 13, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4a2a10";
      ctx.beginPath();
      ctx.arc(sx + 16, cy + 7, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(sx + 8, cy + 3);
      ctx.lineTo(sx + 5, cy);
      ctx.lineTo(sx + 7, cy + 6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx + 22, cy + 3);
      ctx.lineTo(sx + 25, cy);
      ctx.lineTo(sx + 23, cy + 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#d4aa70";
      ctx.beginPath();
      ctx.ellipse(sx + 18, cy + 10, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(sx + 17, cy + 9, 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx + 19, cy + 9, 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(sx + 14, cy + 5, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx + 20, cy + 5, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3a2010";
      ctx.fillRect(sx + 6, cy + 20, 3, 3);
      ctx.fillRect(sx + 10, cy + 20, 3, 3);
      ctx.fillRect(sx + 14, cy + 20, 3, 3);
      ctx.fillRect(sx + 18, cy + 20, 3, 3);
      ctx.fillStyle = teamColor;
      ctx.fillRect(sx + 4, cy + 11, 2, 8);
      break;
    }
    case "owl": {
      ctx.fillStyle = "#8B6914";
      ctx.beginPath();
      ctx.ellipse(sx + 12, cy + 14, 7, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#a07828";
      ctx.beginPath();
      ctx.arc(sx + 12, cy + 8, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(sx + 9, cy + 7, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx + 15, cy + 7, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(sx + 9, cy + 7, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx + 15, cy + 7, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff8800";
      ctx.beginPath();
      ctx.moveTo(sx + 12, cy + 9);
      ctx.lineTo(sx + 10, cy + 12);
      ctx.lineTo(sx + 14, cy + 12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#7a5a14";
      ctx.beginPath();
      ctx.moveTo(sx + 8, cy + 4);
      ctx.lineTo(sx + 5, cy + 1);
      ctx.lineTo(sx + 10, cy + 5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx + 16, cy + 4);
      ctx.lineTo(sx + 19, cy + 1);
      ctx.lineTo(sx + 14, cy + 5);
      ctx.closePath();
      ctx.fill();
      const wingFlap = Math.sin(time * 8 + u.id) * 5;
      ctx.fillStyle = teamColor;
      ctx.beginPath();
      ctx.moveTo(sx + 5, cy + 12);
      ctx.lineTo(sx + 1, cy + 10 + wingFlap);
      ctx.lineTo(sx + 3, cy + 16);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx + 19, cy + 12);
      ctx.lineTo(sx + 23, cy + 10 - wingFlap);
      ctx.lineTo(sx + 21, cy + 16);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
}

function drawHPBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, hp: number, maxHp: number) {
  const pct = hp / maxHp;
  ctx.fillStyle = "#333";
  ctx.fillRect(x, y, w, 3);
  ctx.fillStyle = pct > 0.5 ? COLORS.hpGreen : pct > 0.25 ? COLORS.hpYellow : COLORS.hpRed;
  ctx.fillRect(x, y, w * pct, 3);
}

function renderFog(gs: GameState, ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number, cx: number, cy: number) {
  ctx.clearRect(0, 0, canvasW, canvasH);

  const fogTileSize = 4;
  const startTX = Math.floor(cx / TILE);
  const startTY = Math.floor(cy / TILE);
  const endTX = Math.min(MAP_W, startTX + Math.ceil(canvasW / TILE) + 2);
  const endTY = Math.min(MAP_H, startTY + Math.ceil(canvasH / TILE) + 2);

  for (let ty = startTY; ty < endTY; ty++) {
    for (let tx = startTX; tx < endTX; tx++) {
      if (!gs.fog[ty]?.[tx]) {
        const sx = tx * TILE - cx;
        const sy = ty * TILE - cy;
        ctx.fillStyle = COLORS.fogBlack;
        ctx.fillRect(sx, sy, TILE, TILE);
      }
    }
  }
}

function renderMinimap(gs: GameState, ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) {
  const mx = 8;
  const my = canvasH - MINIMAP_SIZE - UI_BOTTOM_H - 8;
  const scale = MINIMAP_SIZE / MAP_W;

  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(mx - 2, my - 2, MINIMAP_SIZE + 4, MINIMAP_SIZE + 4);
  ctx.strokeStyle = COLORS.uiBorder;
  ctx.lineWidth = 1;
  ctx.strokeRect(mx - 2, my - 2, MINIMAP_SIZE + 4, MINIMAP_SIZE + 4);

  for (let ty = 0; ty < MAP_H; ty += 2) {
    for (let tx = 0; tx < MAP_W; tx += 2) {
      const tile = gs.tiles[ty][tx];
      let color = "#3a5a2a";
      if (tile === "tree") color = "#1a4a1a";
      else if (tile === "rock") color = "#6a6a6a";
      else if (tile === "berry") color = "#2a5a2a";
      else if (tile === "water") color = "#3a5a8a";
      ctx.fillStyle = color;
      ctx.fillRect(mx + tx * scale, my + ty * scale, scale * 2 + 0.5, scale * 2 + 0.5);
    }
  }

  for (const b of gs.buildings) {
    if (!b.alive) continue;
    if (b.team === "ai" && !isVisible(gs, b.tileX, b.tileY)) continue;
    ctx.fillStyle = b.team === "player" ? "#4488ff" : "#ff4444";
    ctx.fillRect(mx + b.tileX * scale, my + b.tileY * scale, b.width * scale + 1, b.height * scale + 1);
  }

  for (const u of gs.units) {
    if (!u.alive) continue;
    if (u.team === "ai" && !isVisible(gs, Math.floor(u.x), Math.floor(u.y))) continue;
    ctx.fillStyle = u.team === "player" ? "#88bbff" : "#ff8888";
    ctx.fillRect(mx + u.x * scale - 1, my + u.y * scale - 1, 2, 2);
  }

  const camTX = gs.camera.x / TILE * scale;
  const camTY = gs.camera.y / TILE * scale;
  const camW = canvasW / TILE * scale;
  const camH = canvasH / TILE * scale;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  ctx.strokeRect(mx + camTX, my + camTY, camW, camH);
}

function renderUI(gs: GameState, ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) {
  ctx.fillStyle = COLORS.uiBg;
  ctx.fillRect(0, 0, canvasW, UI_TOP_H);
  ctx.strokeStyle = COLORS.uiBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, UI_TOP_H);
  ctx.lineTo(canvasW, UI_TOP_H);
  ctx.stroke();

  ctx.font = "bold 12px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const tyTop = UI_TOP_H / 2;

  ctx.fillStyle = "#8B4513";
  ctx.fillText(`Wood: ${Math.floor(gs.resources.player.wood)}`, 10, tyTop);
  ctx.fillStyle = "#888";
  ctx.fillText(`Stone: ${Math.floor(gs.resources.player.stone)}`, 110, tyTop);
  ctx.fillStyle = "#44aa44";
  ctx.fillText(`Food: ${Math.floor(gs.resources.player.food)}`, 220, tyTop);
  ctx.fillStyle = "#daa520";
  ctx.fillText(`Supply: ${gs.supply.player.current}/${gs.supply.player.max}`, 320, tyTop);

  const minutes = Math.floor(gs.gameTime / 60);
  const seconds = Math.floor(gs.gameTime % 60);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "right";
  ctx.fillText(`${minutes}:${seconds.toString().padStart(2, "0")}`, canvasW - 10, tyTop);

  ctx.fillStyle = COLORS.uiBg;
  ctx.fillRect(0, canvasH - UI_BOTTOM_H, canvasW, UI_BOTTOM_H);
  ctx.strokeStyle = COLORS.uiBorder;
  ctx.beginPath();
  ctx.moveTo(0, canvasH - UI_BOTTOM_H);
  ctx.lineTo(canvasW, canvasH - UI_BOTTOM_H);
  ctx.stroke();

  const selectedUnits = gs.units.filter(u => u.selected && u.alive && u.team === "player");
  const selectedBuilding = gs.buildings.find(b => b.selected && b.alive && b.team === "player");

  const panelX = MINIMAP_SIZE + 24;
  const panelY = canvasH - UI_BOTTOM_H + 8;

  if (selectedBuilding) {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(BUILDING_LABELS[selectedBuilding.type], panelX, panelY + 10);
    ctx.font = "10px monospace";
    ctx.fillStyle = "#aaa";
    ctx.fillText(`HP: ${selectedBuilding.hp}/${selectedBuilding.maxHp}`, panelX, panelY + 26);

    if (selectedBuilding.built && BUILDING_PRODUCES[selectedBuilding.type].length > 0) {
      const produces = BUILDING_PRODUCES[selectedBuilding.type];
      let bx = panelX + 140;
      ctx.fillStyle = "#daa520";
      ctx.font = "10px monospace";
      ctx.fillText("Train:", panelX + 140, panelY + 10);
      bx += 40;
      for (const unitType of produces) {
        const req = BUILDING_REQUIRES[selectedBuilding.type];
        if (unitType === "bull" && !hasBuilding(gs, "player", "stable")) continue;
        const cost = UNIT_COSTS[unitType];
        const affordable = canAfford(gs.resources.player, cost) && gs.supply.player.current < gs.supply.player.max;
        ctx.fillStyle = affordable ? "#4a6a3a" : "#4a3a3a";
        ctx.fillRect(bx, panelY + 2, 60, 24);
        ctx.strokeStyle = affordable ? "#6a8a5a" : "#6a4a4a";
        ctx.strokeRect(bx, panelY + 2, 60, 24);
        ctx.fillStyle = affordable ? "#fff" : "#666";
        ctx.font = "9px monospace";
        ctx.fillText(UNIT_LABELS[unitType], bx + 4, panelY + 14);
        ctx.fillStyle = affordable ? "#aaa" : "#555";
        ctx.font = "8px monospace";
        const costStr = costToString(cost);
        ctx.fillText(costStr, bx + 4, panelY + 23);
        bx += 66;
      }

      if (selectedBuilding.productionQueue.length > 0) {
        ctx.fillStyle = "#daa520";
        ctx.font = "10px monospace";
        ctx.fillText("Queue:", panelX, panelY + 48);
        let qx = panelX + 50;
        for (const qUnit of selectedBuilding.productionQueue) {
          ctx.fillStyle = "#3a4a3a";
          ctx.fillRect(qx, panelY + 40, 50, 16);
          ctx.fillStyle = "#aaa";
          ctx.font = "9px monospace";
          ctx.fillText(UNIT_LABELS[qUnit], qx + 4, panelY + 51);
          qx += 54;
        }
        if (selectedBuilding.productionTime > 0) {
          const pct = selectedBuilding.productionTimer / selectedBuilding.productionTime;
          ctx.fillStyle = "#44ff44";
          ctx.fillRect(panelX, panelY + 60, 100 * pct, 4);
          ctx.strokeStyle = "#226622";
          ctx.strokeRect(panelX, panelY + 60, 100, 4);
        }
      }
    }
  } else if (selectedUnits.length > 0) {
    if (selectedUnits.length === 1) {
      const u = selectedUnits[0];
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "left";
      ctx.fillText(UNIT_LABELS[u.type], panelX, panelY + 10);
      ctx.font = "10px monospace";
      ctx.fillStyle = "#aaa";
      ctx.fillText(`HP: ${u.hp}/${u.maxHp}  DMG: ${u.damage}  SPD: ${u.speed.toFixed(1)}`, panelX, panelY + 26);
      ctx.fillText(`Order: ${u.order}`, panelX, panelY + 40);
      if (u.type === "farmer") {
        ctx.fillStyle = "#daa520";
        ctx.fillText("[B] Build Menu", panelX, panelY + 56);
      }
    } else {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`${selectedUnits.length} units selected`, panelX, panelY + 10);
      const typeCounts: Partial<Record<UnitType, number>> = {};
      for (const u of selectedUnits) {
        typeCounts[u.type] = (typeCounts[u.type] || 0) + 1;
      }
      let tx = panelX;
      ctx.font = "10px monospace";
      ctx.fillStyle = "#aaa";
      for (const [type, count] of Object.entries(typeCounts)) {
        ctx.fillText(`${UNIT_LABELS[type as UnitType]}: ${count}`, tx, panelY + 26);
        tx += 80;
      }
    }
  } else {
    ctx.fillStyle = "#666";
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("Select units or buildings", panelX, panelY + 20);
  }

  if (gs.buildMenuOpen) {
    renderBuildMenu(gs, ctx, canvasW, canvasH);
  }
}

function costToString(cost: Resources): string {
  const parts: string[] = [];
  if (cost.food > 0) parts.push(`F${cost.food}`);
  if (cost.wood > 0) parts.push(`W${cost.wood}`);
  if (cost.stone > 0) parts.push(`S${cost.stone}`);
  return parts.join(" ");
}

function renderBuildMenu(gs: GameState, ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) {
  const menuW = 280;
  const menuH = 220;
  const menuX = (canvasW - menuW) / 2;
  const menuY = canvasH - UI_BOTTOM_H - menuH - 10;

  ctx.fillStyle = "rgba(20,12,8,0.95)";
  ctx.fillRect(menuX, menuY, menuW, menuH);
  ctx.strokeStyle = COLORS.uiBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(menuX, menuY, menuW, menuH);

  ctx.fillStyle = COLORS.gold;
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "center";
  ctx.fillText("BUILD MENU", menuX + menuW / 2, menuY + 18);
  ctx.font = "9px monospace";
  ctx.fillStyle = "#888";
  ctx.fillText("Click to select, then click map to place", menuX + menuW / 2, menuY + 32);

  const buildable: BuildingType[] = ["barn", "stable", "roost", "silo", "fence", "watchtower"];
  let by = menuY + 44;

  ctx.textAlign = "left";
  for (const bType of buildable) {
    const cost = BUILDING_COSTS[bType];
    const req = BUILDING_REQUIRES[bType];
    const meetsReq = !req || hasBuilding(gs, "player", req);
    const affordable = canAfford(gs.resources.player, cost) && meetsReq;

    ctx.fillStyle = affordable ? "#3a4a2a" : "#3a2a2a";
    ctx.fillRect(menuX + 8, by, menuW - 16, 24);
    ctx.strokeStyle = affordable ? "#5a7a4a" : "#5a3a3a";
    ctx.strokeRect(menuX + 8, by, menuW - 16, 24);

    ctx.fillStyle = affordable ? "#fff" : "#666";
    ctx.font = "bold 10px monospace";
    ctx.fillText(BUILDING_LABELS[bType], menuX + 14, by + 10);
    ctx.font = "9px monospace";
    ctx.fillStyle = affordable ? "#aaa" : "#555";
    const costStr = costToString(cost);
    ctx.fillText(costStr, menuX + 90, by + 10);
    if (req && !meetsReq) {
      ctx.fillStyle = "#ff6644";
      ctx.fillText(`Needs ${BUILDING_LABELS[req]}`, menuX + 90, by + 20);
    }
    ctx.fillStyle = affordable ? "#888" : "#444";
    ctx.fillText(`HP:${BUILDING_HP[bType]}`, menuX + 200, by + 10);

    by += 28;
  }
}

// =============================================================================
// SELECTION HELPERS
// =============================================================================

function deselectAll(gs: GameState) {
  for (const u of gs.units) u.selected = false;
  for (const b of gs.buildings) b.selected = false;
}

function issueAttackMove(gs: GameState, units: Unit[], wx: number, wy: number) {
  const count = units.length;
  const cols = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    const row = Math.floor(i / cols);
    const col = i % cols;
    const offsetX = (col - cols / 2) * 0.8;
    const offsetY = (row - Math.floor(count / cols) / 2) * 0.8;
    u.order = "attackMove";
    u.targetX = wx + offsetX;
    u.targetY = wy + offsetY;
    u.path = astar(gs, u.x, u.y, u.targetX, u.targetY);
    u.pathIndex = 0;
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function HomesteadWars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [showInstructions, setShowInstructions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initGame = useCallback(() => {
    const gs: GameState = {
      phase: "playing",
      units: [],
      buildings: [],
      projectiles: [],
      particles: [],
      tiles: [],
      fog: [],
      resources: {
        player: { wood: 200, stone: 100, food: 200 },
        ai: { wood: 200, stone: 100, food: 200 },
      },
      supply: {
        player: { current: 0, max: 10 },
        ai: { current: 0, max: 10 },
      },
      camera: { x: 0, y: 0 },
      selection: [],
      selectedBuilding: -1,
      selectionBox: { x1: 0, y1: 0, x2: 0, y2: 0, active: false },
      controlGroups: {},
      nextId: 1,
      gameTime: 0,
      buildMode: false,
      buildMenuOpen: false,
      buildingToBuild: null,
      buildGhostValid: false,
      buildGhostX: 0,
      buildGhostY: 0,
      mouseX: 0,
      mouseY: 0,
      aiPhase: "economy",
      aiTimer: 0,
      aiAttackTimer: 0,
      aiScoutSent: false,
      keysDown: new Set(),
      spatialHash: new Map(),
      showingInstructions: false,
    };

    for (let y = 0; y < MAP_H; y++) {
      gs.fog.push(new Array(MAP_W).fill(false));
    }

    generateMap(gs);

    createBuilding(gs, "farmhouse", "player", 3, MAP_H - 6, true);
    createUnit(gs, "farmer", "player", 6, MAP_H - 4);
    createUnit(gs, "farmer", "player", 7, MAP_H - 4);
    createUnit(gs, "farmer", "player", 5, MAP_H - 3);

    createBuilding(gs, "farmhouse", "ai", MAP_W - 6, 3, true);
    createUnit(gs, "farmer", "ai", MAP_W - 8, 5);
    createUnit(gs, "farmer", "ai", MAP_W - 7, 5);
    createUnit(gs, "farmer", "ai", MAP_W - 9, 6);

    gs.camera.x = 0;
    gs.camera.y = (MAP_H - 16) * TILE;

    gameStateRef.current = gs;
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    const fogCanvas = fogCanvasRef.current;
    if (!canvas || !fogCanvas) return;

    const ctx = canvas.getContext("2d");
    const fogCtx = fogCanvas.getContext("2d");
    if (!ctx || !fogCtx) return;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      fogCanvas.style.width = `${w}px`;
      fogCanvas.style.height = `${h}px`;
      fogCanvas.width = Math.floor(w * dpr);
      fogCanvas.height = Math.floor(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fogCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const gs = gameStateRef.current!;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      gs.keysDown.add(key);

      if (key === "escape") {
        gs.buildMenuOpen = false;
        gs.buildingToBuild = null;
        deselectAll(gs);
      }

      if (key === "b") {
        const selectedFarmers = gs.units.filter(u => u.selected && u.alive && u.team === "player" && u.type === "farmer");
        if (selectedFarmers.length > 0) {
          gs.buildMenuOpen = !gs.buildMenuOpen;
          gs.buildingToBuild = null;
        }
      }

      if (key >= "1" && key <= "9") {
        const num = parseInt(key);
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const selected = gs.units.filter(u => u.selected && u.alive && u.team === "player");
          if (selected.length > 0) {
            gs.controlGroups[num] = selected.map(u => u.id);
            for (const u of selected) u.controlGroup = num;
          }
        } else {
          const group = gs.controlGroups[num];
          if (group && group.length > 0) {
            deselectAll(gs);
            for (const id of group) {
              const u = gs.units.find(u => u.id === id && u.alive && u.team === "player");
              if (u) u.selected = true;
            }
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gs.keysDown.delete(e.key.toLowerCase());
    };

    const getCanvasCoords = (e: MouseEvent): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getCanvasCoords(e);
      const rect = canvas.getBoundingClientRect();
      const canvasW = rect.width;
      const canvasH = rect.height;

      const minimapX = 8;
      const minimapY = canvasH - MINIMAP_SIZE - UI_BOTTOM_H - 8;
      if (pos.x >= minimapX && pos.x <= minimapX + MINIMAP_SIZE &&
          pos.y >= minimapY && pos.y <= minimapY + MINIMAP_SIZE) {
        const scale = MINIMAP_SIZE / MAP_W;
        const tx = (pos.x - minimapX) / scale;
        const ty = (pos.y - minimapY) / scale;
        gs.camera.x = tx * TILE - canvasW / 2;
        gs.camera.y = ty * TILE - canvasH / 2;
        return;
      }

      if (pos.y <= UI_TOP_H || pos.y >= canvasH - UI_BOTTOM_H) return;

      if (gs.buildMenuOpen && e.button === 0) {
        const menuW = 280;
        const menuH = 220;
        const menuX = (canvasW - menuW) / 2;
        const menuY = canvasH - UI_BOTTOM_H - menuH - 10;

        if (pos.x >= menuX && pos.x <= menuX + menuW && pos.y >= menuY && pos.y <= menuY + menuH) {
          const buildable: BuildingType[] = ["barn", "stable", "roost", "silo", "fence", "watchtower"];
          const by = menuY + 44;
          for (let i = 0; i < buildable.length; i++) {
            const itemY = by + i * 28;
            if (pos.y >= itemY && pos.y <= itemY + 24 && pos.x >= menuX + 8 && pos.x <= menuX + menuW - 8) {
              const bType = buildable[i];
              const cost = BUILDING_COSTS[bType];
              const req = BUILDING_REQUIRES[bType];
              const meetsReq = !req || hasBuilding(gs, "player", req);
              if (canAfford(gs.resources.player, cost) && meetsReq) {
                gs.buildingToBuild = bType;
                gs.buildMenuOpen = false;
              }
              return;
            }
          }
          return;
        }
      }

      const selectedBuilding = gs.buildings.find(b => b.selected && b.alive && b.team === "player");
      if (selectedBuilding && selectedBuilding.built && e.button === 0) {
        const panelX = MINIMAP_SIZE + 24;
        const panelY = canvasH - UI_BOTTOM_H + 8;
        if (pos.y >= panelY && pos.y <= panelY + 30) {
          const produces = BUILDING_PRODUCES[selectedBuilding.type];
          let bx = panelX + 180;
          for (const unitType of produces) {
            if (unitType === "bull" && !hasBuilding(gs, "player", "stable")) continue;
            if (pos.x >= bx && pos.x <= bx + 60 && pos.y >= panelY + 2 && pos.y <= panelY + 26) {
              const cost = UNIT_COSTS[unitType];
              if (canAfford(gs.resources.player, cost) && gs.supply.player.current < gs.supply.player.max) {
                if (selectedBuilding.productionQueue.length < 5) {
                  subtractCost(gs.resources.player, cost);
                  selectedBuilding.productionQueue.push(unitType);
                }
              }
              return;
            }
            bx += 66;
          }
        }
      }

      if (e.button === 0) {
        if (gs.buildingToBuild) {
          const tx = Math.floor((pos.x + gs.camera.x) / TILE);
          const ty = Math.floor((pos.y + gs.camera.y) / TILE);
          if (canPlaceBuilding(gs, gs.buildingToBuild, tx, ty) &&
              canAfford(gs.resources.player, BUILDING_COSTS[gs.buildingToBuild])) {
            subtractCost(gs.resources.player, BUILDING_COSTS[gs.buildingToBuild]);
            const newB = createBuilding(gs, gs.buildingToBuild, "player", tx, ty, false);

            const selectedFarmers = gs.units.filter(u => u.selected && u.alive && u.team === "player" && u.type === "farmer");
            if (selectedFarmers.length > 0) {
              const farmer = selectedFarmers[0];
              farmer.order = "build";
              farmer.buildTarget = newB.id;
              farmer.path = astar(gs, farmer.x, farmer.y, tx + newB.width / 2, ty + newB.height / 2);
              farmer.pathIndex = 0;
            }

            if (!gs.keysDown.has("shift")) {
              gs.buildingToBuild = null;
            }
          }
          return;
        }

        gs.selectionBox.x1 = pos.x;
        gs.selectionBox.y1 = pos.y;
        gs.selectionBox.x2 = pos.x;
        gs.selectionBox.y2 = pos.y;
        gs.selectionBox.active = true;
      }

      if (e.button === 2) {
        e.preventDefault();
        const worldX = (pos.x + gs.camera.x) / TILE;
        const worldY = (pos.y + gs.camera.y) / TILE;
        const tileX = Math.floor(worldX);
        const tileY = Math.floor(worldY);

        const selectedUnits = gs.units.filter(u => u.selected && u.alive && u.team === "player");
        if (selectedUnits.length === 0) return;

        const clickedEnemyUnit = gs.units.find(u =>
          u.alive && u.team === "ai" &&
          isVisible(gs, Math.floor(u.x), Math.floor(u.y)) &&
          dist(worldX, worldY, u.x + 0.5, u.y + 0.5) < 1.5
        );

        const clickedEnemyBuilding = gs.buildings.find(b =>
          b.alive && b.team === "ai" &&
          isVisible(gs, b.tileX, b.tileY) &&
          tileX >= b.tileX && tileX < b.tileX + b.width &&
          tileY >= b.tileY && tileY < b.tileY + b.height
        );

        if (clickedEnemyUnit) {
          for (const u of selectedUnits) {
            u.order = "attack";
            u.targetId = clickedEnemyUnit.id;
            u.path = astar(gs, u.x, u.y, clickedEnemyUnit.x, clickedEnemyUnit.y);
            u.pathIndex = 0;
          }
          return;
        }

        if (clickedEnemyBuilding) {
          for (const u of selectedUnits) {
            u.order = "attack";
            u.targetId = clickedEnemyBuilding.id;
            u.path = astar(gs, u.x, u.y,
              clickedEnemyBuilding.tileX + clickedEnemyBuilding.width / 2,
              clickedEnemyBuilding.tileY + clickedEnemyBuilding.height / 2);
            u.pathIndex = 0;
          }
          return;
        }

        const tile = gs.tiles[tileY]?.[tileX];
        if (tile === "tree" || tile === "rock" || tile === "berry") {
          const farmers = selectedUnits.filter(u => u.type === "farmer");
          if (farmers.length > 0) {
            for (const f of farmers) {
              f.order = "gather";
              f.gatherTargetTileX = tileX;
              f.gatherTargetTileY = tileY;
              f.path = astar(gs, f.x, f.y, tileX, tileY);
              f.pathIndex = 0;
            }
            const nonFarmers = selectedUnits.filter(u => u.type !== "farmer");
            if (nonFarmers.length > 0) {
              issueAttackMove(gs, nonFarmers, worldX, worldY);
            }
            return;
          }
        }

        const clickedOwnBuilding = gs.buildings.find(b =>
          b.alive && b.team === "player" && !b.built &&
          tileX >= b.tileX && tileX < b.tileX + b.width &&
          tileY >= b.tileY && tileY < b.tileY + b.height
        );
        if (clickedOwnBuilding) {
          const farmers = selectedUnits.filter(u => u.type === "farmer");
          for (const f of farmers) {
            f.order = "build";
            f.buildTarget = clickedOwnBuilding.id;
            f.path = astar(gs, f.x, f.y,
              clickedOwnBuilding.tileX + clickedOwnBuilding.width / 2,
              clickedOwnBuilding.tileY + clickedOwnBuilding.height / 2);
            f.pathIndex = 0;
          }
          return;
        }

        issueAttackMove(gs, selectedUnits, worldX, worldY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getCanvasCoords(e);
      gs.mouseX = pos.x;
      gs.mouseY = pos.y;

      if (gs.selectionBox.active) {
        gs.selectionBox.x2 = pos.x;
        gs.selectionBox.y2 = pos.y;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const gs2 = gameStateRef.current!;
      if (!gs2.selectionBox.active) return;

      gs2.selectionBox.active = false;
      const rect = canvas.getBoundingClientRect();
      const canvasW = rect.width;
      const canvasH = rect.height;
      const pos = getCanvasCoords(e);

      const bx1 = Math.min(gs2.selectionBox.x1, gs2.selectionBox.x2);
      const by1 = Math.min(gs2.selectionBox.y1, gs2.selectionBox.y2);
      const bx2 = Math.max(gs2.selectionBox.x1, gs2.selectionBox.x2);
      const by2 = Math.max(gs2.selectionBox.y1, gs2.selectionBox.y2);

      const boxW = bx2 - bx1;
      const boxH = by2 - by1;

      if (!e.shiftKey) {
        deselectAll(gs2);
      }

      if (boxW < 4 && boxH < 4) {
        const worldX = (pos.x + gs2.camera.x) / TILE;
        const worldY = (pos.y + gs2.camera.y) / TILE;

        let clickedUnit: Unit | null = null;
        for (const u of gs2.units) {
          if (!u.alive || u.team !== "player") continue;
          if (dist(worldX, worldY, u.x + 0.5, u.y + 0.5) < 1) {
            clickedUnit = u;
            break;
          }
        }

        if (clickedUnit) {
          if (!e.shiftKey) deselectAll(gs2);
          clickedUnit.selected = true;
          gs2.buildMenuOpen = false;
          gs2.buildingToBuild = null;
          return;
        }

        const tileX = Math.floor(worldX);
        const tileY = Math.floor(worldY);
        for (const b of gs2.buildings) {
          if (!b.alive || b.team !== "player") continue;
          if (tileX >= b.tileX && tileX < b.tileX + b.width && tileY >= b.tileY && tileY < b.tileY + b.height) {
            if (!e.shiftKey) deselectAll(gs2);
            b.selected = true;
            gs2.buildMenuOpen = false;
            gs2.buildingToBuild = null;
            return;
          }
        }
      } else {
        for (const u of gs2.units) {
          if (!u.alive || u.team !== "player") continue;
          const sx = u.x * TILE - gs2.camera.x;
          const sy = u.y * TILE - gs2.camera.y;
          if (sx >= bx1 && sx <= bx2 && sy >= by1 && sy <= by2) {
            u.selected = true;
          }
        }
      }

      gs2.buildMenuOpen = false;
      gs2.buildingToBuild = null;
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    lastTimeRef.current = performance.now();

    const loop = (time: number) => {
      const gs = gameStateRef.current;
      if (!gs || gs.phase !== "playing") return;

      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      const rect = canvas.getBoundingClientRect();
      updateGame(gs, dt);

      if (gs.phase !== "playing") {
        setPhase(gs.phase);
      }

      render(gs, ctx, rect.width, rect.height, fogCtx);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", resize);
    };
  }, [phase]);

  if (phase === "menu") {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, #0a1a0a 0%, #1a2a1a 50%, #0a1a0a 100%)" }}
      >
        <div className="w-full max-w-lg px-4 pt-3 pb-2 flex items-center justify-between shrink-0" style={{ minHeight: 44 }}>
          <Link
            href="/games"
            className="text-amber-400 font-mono text-sm hover:text-amber-300 transition-colors flex items-center gap-1 min-h-[44px] min-w-[44px]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            BACK
          </Link>
          <div className="w-14" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <h1 className="font-mono text-3xl font-bold tracking-wider text-center" style={{ color: "#DAA520" }}>
            HOMESTEAD WARS
          </h1>
          <p className="font-mono text-sm text-center max-w-md" style={{ color: "#8a9a6a" }}>
            A farm-themed real-time strategy game. Build your homestead, train farm animals,
            and destroy the enemy farmhouse to win!
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={initGame}
              className="px-8 py-4 rounded font-mono text-lg font-bold transition-all hover:scale-105"
              style={{ background: "#228B22", color: "#FFF", minHeight: 48 }}
            >
              START GAME
            </button>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="px-8 py-3 rounded font-mono text-sm transition-colors"
              style={{ background: "#333", color: "#DAA520", minHeight: 44 }}
            >
              {showInstructions ? "HIDE INSTRUCTIONS" : "HOW TO PLAY"}
            </button>
          </div>

          {showInstructions && (
            <div
              className="rounded-lg p-5 max-w-md w-full mt-2"
              style={{ background: "rgba(20,12,8,0.9)", border: "1px solid #DAA52044" }}
            >
              <div className="font-mono text-xs space-y-3" style={{ color: "#ccc" }}>
                <div>
                  <span style={{ color: "#DAA520" }}>OBJECTIVE:</span> Destroy the enemy Farmhouse (top-right corner).
                </div>
                <div>
                  <span style={{ color: "#DAA520" }}>CONTROLS:</span>
                  <br />Left click: Select unit/building
                  <br />Left drag: Box select units
                  <br />Right click: Move / Attack / Gather
                  <br />WASD / Arrows: Pan camera
                  <br />B: Build menu (farmer selected)
                  <br />Ctrl+1-9: Assign control group
                  <br />1-9: Recall control group
                  <br />Escape: Cancel
                </div>
                <div>
                  <span style={{ color: "#DAA520" }}>RESOURCES:</span>
                  <br />Wood (trees) - Buildings, some units
                  <br />Stone (rocks) - Defenses, advanced units
                  <br />Food (berries) - All unit production
                </div>
                <div>
                  <span style={{ color: "#DAA520" }}>BUILDINGS:</span>
                  <br />Farmhouse: HQ, trains Farmers
                  <br />Barn: Trains Roosters and Geese
                  <br />Stable: Trains Rams and Bulls (needs Barn)
                  <br />Roost: Trains Owls
                  <br />Silo: +10 supply cap
                  <br />Watchtower: Attacks enemies, long vision
                  <br />Fence: Wall segment
                </div>
                <div>
                  <span style={{ color: "#DAA520" }}>UNITS:</span>
                  <br />Farmer: Gathers resources, builds
                  <br />Rooster: Fast melee scout
                  <br />Goose: Ranged attacker
                  <br />Ram: Tanky, bonus vs buildings
                  <br />Bull: Elite melee fighter (needs Stable)
                  <br />Owl: Fast flying scout, ranged
                </div>
                <div>
                  <span style={{ color: "#DAA520" }}>TIPS:</span>
                  <br />- Right click resources to gather
                  <br />- Right click unbuilt buildings to construct
                  <br />- Build Silos to increase supply cap
                  <br />- Click minimap to jump camera
                  <br />- AI attacks after 5 minutes!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "won" || phase === "lost") {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, #0a1a0a 0%, #1a2a1a 50%, #0a1a0a 100%)" }}
      >
        <div className="flex flex-col items-center gap-6 px-4">
          <h1 className="font-mono text-3xl font-bold tracking-wider text-center"
            style={{ color: phase === "won" ? "#44ff44" : "#ff4444" }}>
            {phase === "won" ? "VICTORY!" : "DEFEAT"}
          </h1>
          <p className="font-mono text-sm text-center max-w-md" style={{ color: "#8a9a6a" }}>
            {phase === "won"
              ? "You destroyed the enemy farmhouse! The homestead is yours!"
              : "Your farmhouse was destroyed. The enemy claims the land."}
          </p>
          {gameStateRef.current && (
            <div className="font-mono text-xs space-y-1" style={{ color: "#aaa" }}>
              <p>Time: {Math.floor(gameStateRef.current.gameTime / 60)}:{Math.floor(gameStateRef.current.gameTime % 60).toString().padStart(2, "0")}</p>
              <p>Units trained: {gameStateRef.current.units.filter(u => u.team === "player").length}</p>
              <p>Buildings built: {gameStateRef.current.buildings.filter(b => b.team === "player").length}</p>
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <button
              onClick={initGame}
              className="px-8 py-4 rounded font-mono text-lg font-bold transition-all hover:scale-105"
              style={{ background: "#228B22", color: "#FFF", minHeight: 48 }}
            >
              PLAY AGAIN
            </button>
            <Link
              href="/games"
              className="px-8 py-4 rounded font-mono text-lg font-bold transition-all hover:scale-105 flex items-center"
              style={{ background: "#444", color: "#DAA520", minHeight: 48 }}
            >
              BACK
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-screen h-dvh relative overflow-hidden"
      style={{ background: "#0a0a0a", cursor: gameStateRef.current?.buildingToBuild ? "crosshair" : "default" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <canvas
        ref={fogCanvasRef}
        className="hidden"
      />
    </div>
  );
}
