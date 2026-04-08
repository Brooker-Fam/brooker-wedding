"use client";

import { useRef, useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EggType = "white" | "brown" | "golden" | "rotten" | "easter";
type PowerUpType = "wide" | "magnet" | "shield";

interface Egg {
  x: number;
  y: number;
  radius: number;
  speed: number;
  type: EggType;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  wobblePhase: number;
}

interface PowerUp {
  x: number;
  y: number;
  radius: number;
  speed: number;
  type: PowerUpType;
  rotation: number;
  bobPhase: number;
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

interface Chicken {
  x: number;
  y: number;
  frame: number;
  timer: number;
  direction: 1 | -1;
  walkSpeed: number;
  pecking: boolean;
  peckTimer: number;
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  speed: number;
}

interface ScorePopup {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

type GameState = "start" | "playing" | "paused" | "gameover";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COLORS = {
  barnRed: "#8B2500",
  barnRedDark: "#6B1D00",
  hayGold: "#DAA520",
  grassGreen: "#228B22",
  grassLight: "#2DA52D",
  grassDark: "#1B6B1B",
  skyBlue: "#87CEEB",
  skyTop: "#5BA3D4",
  cream: "#FFF8DC",
  wood: "#8B6914",
  woodDark: "#6B4F10",
  woodLight: "#A67C1A",
  fencePost: "#C4A44A",
  fenceShadow: "#8B7634",
};

const EGG_COLORS: Record<EggType, { fill: string; highlight: string; outline: string }> = {
  white: { fill: "#FFFEF0", highlight: "#FFFFFF", outline: "#D4D0B0" },
  brown: { fill: "#C4883A", highlight: "#DAA050", outline: "#8B6320" },
  golden: { fill: "#FFD700", highlight: "#FFF44F", outline: "#DAA520" },
  rotten: { fill: "#4A6B2A", highlight: "#5C8236", outline: "#2E4420" },
  easter: { fill: "#FF69B4", highlight: "#FFB6C1", outline: "#DB3D85" },
};

const EGG_POINTS: Record<EggType, number> = {
  white: 10,
  brown: 20,
  golden: 50,
  rotten: -30,
  easter: 100,
};

const WAVE_DURATION = 30_000;
const INITIAL_SPAWN_INTERVAL = 1200;
const MIN_SPAWN_INTERVAL = 350;
const BASE_EGG_SPEED = 1.8;
const MAX_EGG_SPEED_MULT = 3.2;
const MISSED_EGG_THRESHOLD = 3;
const STARTING_LIVES = 3;
const POWERUP_WIDE_DURATION = 10_000;
const POWERUP_MAGNET_DURATION = 8_000;
const MAGNET_RANGE = 120;
const MAGNET_STRENGTH = 3.5;

// ---------------------------------------------------------------------------
// Standalone helpers (no closures over mutable state)
// ---------------------------------------------------------------------------

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawChicken(ctx: CanvasRenderingContext2D, ch: Chicken) {
  ctx.save();
  ctx.translate(ch.x, ch.y);
  ctx.scale(ch.direction, 1);

  ctx.fillStyle = "#FFFAF0";
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#D4C8A0";
  ctx.lineWidth = 1;
  ctx.stroke();

  const headBob = ch.pecking ? Math.sin(ch.peckTimer * 0.5) * 3 : 0;
  ctx.fillStyle = "#FFFAF0";
  ctx.beginPath();
  ctx.arc(9 + headBob, -5, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#D4C8A0";
  ctx.stroke();

  ctx.fillStyle = "#111";
  ctx.fillRect(11 + headBob, -7, 2, 2);

  ctx.fillStyle = "#FF8C00";
  ctx.beginPath();
  ctx.moveTo(14 + headBob, -5);
  ctx.lineTo(18 + headBob, -4);
  ctx.lineTo(14 + headBob, -3);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#DC143C";
  ctx.beginPath();
  ctx.arc(9 + headBob, -10, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7 + headBob, -10, 2.5, 0, Math.PI * 2);
  ctx.fill();

  const legPhase = ch.pecking ? 0 : Math.sin(ch.timer * 0.15) * 2;
  ctx.strokeStyle = "#FF8C00";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-3, 6);
  ctx.lineTo(-3 - legPhase, 14);
  ctx.moveTo(3, 6);
  ctx.lineTo(3 + legPhase, 14);
  ctx.stroke();

  ctx.fillStyle = "#E8DCC8";
  ctx.beginPath();
  ctx.moveTo(-9, -2);
  ctx.lineTo(-16, -8);
  ctx.lineTo(-13, -1);
  ctx.lineTo(-16, -4);
  ctx.lineTo(-11, 1);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#EDE4D0";
  ctx.beginPath();
  ctx.ellipse(-2, 1, 6, 5, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEggShape(ctx: CanvasRenderingContext2D, egg: Egg, time: number) {
  const { x, y, radius, type, rotation } = egg;
  const colors = EGG_COLORS[type];

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  if (type === "golden") {
    const glowSize = 4 + Math.sin(time * 0.005) * 2;
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 10 + glowSize;
  } else if (type === "easter") {
    const glowSize = 3 + Math.sin(time * 0.008) * 2;
    ctx.shadowColor = "#FF69B4";
    ctx.shadowBlur = 8 + glowSize;
  } else if (type === "rotten") {
    ctx.shadowColor = "#00FF0044";
    ctx.shadowBlur = 6;
  }

  ctx.fillStyle = colors.fill;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.8, radius, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = colors.outline;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.shadowBlur = 0;

  ctx.fillStyle = colors.highlight + "88";
  ctx.beginPath();
  ctx.ellipse(-radius * 0.2, -radius * 0.3, radius * 0.3, radius * 0.4, -0.3, 0, Math.PI * 2);
  ctx.fill();

  if (type === "easter") {
    const stripeColors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#34D399"];
    for (let i = 0; i < 4; i++) {
      const sy = -radius * 0.6 + i * (radius * 0.4);
      ctx.fillStyle = stripeColors[i % stripeColors.length] + "BB";
      ctx.fillRect(-radius * 0.7, sy, radius * 1.4, radius * 0.15);
    }
    ctx.fillStyle = "#FFE66D";
    for (let i = 0; i < 5; i++) {
      const dx = rand(-radius * 0.5, radius * 0.5);
      const dy = rand(-radius * 0.5, radius * 0.5);
      ctx.fillRect(Math.round(dx), Math.round(dy), 2, 2);
    }
  }

  if (type === "rotten") {
    ctx.fillStyle = "#2E4420AA";
    ctx.beginPath();
    ctx.arc(radius * 0.2, radius * 0.1, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-radius * 0.3, -radius * 0.2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(radius * 0.1, -radius * 0.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#6B8B4066";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const sx = -4 + i * 4;
      const wobble = Math.sin(time * 0.006 + i) * 2;
      ctx.beginPath();
      ctx.moveTo(sx, -radius - 2);
      ctx.quadraticCurveTo(sx + wobble, -radius - 8, sx - wobble, -radius - 14);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawPowerUpShape(ctx: CanvasRenderingContext2D, pu: PowerUp, time: number) {
  const { x, y, radius, type, bobPhase } = pu;
  const bobY = y + Math.sin(time * 0.004 + bobPhase) * 3;

  ctx.save();
  ctx.translate(x, bobY);

  ctx.shadowColor = type === "wide" ? "#FF8C00" : type === "magnet" ? "#8B5CF6" : "#3B82F6";
  ctx.shadowBlur = 12 + Math.sin(time * 0.005) * 4;

  const boxSize = radius;
  ctx.fillStyle = type === "wide" ? "#FF8C00" : type === "magnet" ? "#8B5CF6" : "#3B82F6";
  ctx.fillRect(-boxSize, -boxSize, boxSize * 2, boxSize * 2);
  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 2;
  ctx.strokeRect(-boxSize, -boxSize, boxSize * 2, boxSize * 2);

  ctx.shadowBlur = 0;

  ctx.fillStyle = "#FFF";
  ctx.font = `bold ${radius}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const icon = type === "wide" ? "W" : type === "magnet" ? "M" : "S";
  ctx.fillText(icon, 0, 1);

  const sparkAngle = time * 0.003;
  ctx.fillStyle = "#FFFFFF88";
  for (let i = 0; i < 4; i++) {
    const a = sparkAngle + (i * Math.PI) / 2;
    const sx = Math.cos(a) * (radius + 4);
    const sy = Math.sin(a) * (radius + 4);
    ctx.fillRect(Math.round(sx) - 1, Math.round(sy) - 1, 2, 2);
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Game Engine (plain class, no React)
// ---------------------------------------------------------------------------

class EggCatcherEngine {
  state: GameState = "start";
  score = 0;
  highScore = 0;
  lives = STARTING_LIVES;
  missedGoodEggs = 0;
  wave = 1;
  waveStartTime = 0;
  lastSpawnTime = 0;
  lastPowerUpTime = 0;

  basketX = 200;
  basketWidth = 70;
  basketBaseWidth = 70;

  eggs: Egg[] = [];
  powerUps: PowerUp[] = [];
  particles: Particle[] = [];
  chickens: Chicken[] = [];
  clouds: Cloud[] = [];
  scorePopups: ScorePopup[] = [];

  activePowerUps = { wide: 0, magnet: 0, shield: false };

  shakeTimer = 0;
  shakeIntensity = 0;
  comboCount = 0;
  comboTimer = 0;

  touchActive = false;
  touchOffsetX = 0;

  canvasW = 400;
  canvasH = 600;

  gameOverAlpha = 0;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  raf = 0;
  lastTime = 0;
  onGameOverCb: ((score: number) => void) | null = null;
  destroyed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    try {
      const stored = localStorage.getItem("eggCatcher_highScore");
      if (stored) this.highScore = parseInt(stored, 10) || 0;
    } catch {
      /* noop */
    }
    this.initChickens();
    this.initClouds();
  }

  // --- lifecycle ---

  start() {
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
  }

  resize(w: number, h: number) {
    this.canvasW = w;
    this.canvasH = h;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.basketBaseWidth = Math.max(50, w * 0.16);
    if (this.activePowerUps.wide <= 0) {
      this.basketWidth = this.basketBaseWidth;
    }
    if (this.state === "start") {
      this.initChickens();
      this.initClouds();
    }
  }

  // --- init ---

  initChickens() {
    this.chickens = [];
    const count = Math.max(3, Math.floor(this.canvasW / 120));
    for (let i = 0; i < count; i++) {
      this.chickens.push({
        x: rand(30, this.canvasW - 30),
        y: rand(10, 50),
        frame: 0,
        timer: rand(0, 100),
        direction: Math.random() > 0.5 ? 1 : -1,
        walkSpeed: rand(0.15, 0.45),
        pecking: false,
        peckTimer: 0,
      });
    }
  }

  initClouds() {
    this.clouds = [];
    for (let i = 0; i < 4; i++) {
      this.clouds.push({
        x: rand(-100, this.canvasW + 100),
        y: rand(60, 180),
        width: rand(60, 140),
        speed: rand(0.1, 0.3),
      });
    }
  }

  resetGame() {
    this.state = "playing";
    this.score = 0;
    this.lives = STARTING_LIVES;
    this.missedGoodEggs = 0;
    this.wave = 1;
    this.waveStartTime = performance.now();
    this.lastSpawnTime = 0;
    this.lastPowerUpTime = 0;
    this.basketX = this.canvasW / 2;
    this.basketWidth = this.basketBaseWidth;
    this.eggs = [];
    this.powerUps = [];
    this.particles = [];
    this.scorePopups = [];
    this.activePowerUps = { wide: 0, magnet: 0, shield: false };
    this.shakeTimer = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.gameOverAlpha = 0;
    this.initChickens();
    this.initClouds();
  }

  // --- spawning ---

  getEggType(): EggType {
    const r = Math.random();
    const rottenChance = Math.min(0.05 + this.wave * 0.04, 0.35);
    const goldenChance = Math.min(0.03 + this.wave * 0.015, 0.12);
    const easterChance = 0.02;
    const brownChance = 0.25;
    if (r < easterChance) return "easter";
    if (r < easterChance + goldenChance) return "golden";
    if (r < easterChance + goldenChance + rottenChance) return "rotten";
    if (r < easterChance + goldenChance + rottenChance + brownChance) return "brown";
    return "white";
  }

  spawnEgg() {
    const type = this.getEggType();
    const speedMult = Math.min(1 + (this.wave - 1) * 0.25, MAX_EGG_SPEED_MULT);
    const margin = 30;
    this.eggs.push({
      x: rand(margin, this.canvasW - margin),
      y: -20,
      radius: type === "easter" ? 14 : type === "golden" ? 13 : 12,
      speed: BASE_EGG_SPEED * speedMult * rand(0.8, 1.2),
      type,
      rotation: rand(0, Math.PI * 2),
      rotationSpeed: rand(-0.03, 0.03),
      wobble: rand(0.3, 1.2),
      wobbleSpeed: rand(0.02, 0.05),
      wobblePhase: rand(0, Math.PI * 2),
    });
  }

  spawnPowerUp() {
    const types: PowerUpType[] = ["wide", "magnet", "shield"];
    const type = types[randInt(0, types.length - 1)];
    const margin = 30;
    const speedMult = Math.min(1 + (this.wave - 1) * 0.15, 2);
    this.powerUps.push({
      x: rand(margin, this.canvasW - margin),
      y: -20,
      radius: 16,
      speed: BASE_EGG_SPEED * 0.7 * speedMult,
      type,
      rotation: 0,
      bobPhase: rand(0, Math.PI * 2),
    });
  }

  spawnParticles(x: number, y: number, color: string, count: number, spread = 3) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: rand(-spread, spread),
        vy: rand(-spread - 1, -0.5),
        life: rand(20, 45),
        maxLife: 45,
        color,
        size: rand(2, 5),
      });
    }
  }

  addScorePopup(x: number, y: number, text: string, color: string) {
    this.scorePopups.push({ x, y, text, color, life: 60 });
  }

  // --- main loop ---

  tick = (timestamp: number) => {
    if (this.destroyed) return;
    const dt = Math.min(timestamp - this.lastTime, 50);
    this.lastTime = timestamp;
    this.ctx.imageSmoothingEnabled = false;
    this.update(dt, timestamp);
    this.render(timestamp);
    this.raf = requestAnimationFrame(this.tick);
  };

  // --- update ---

  update(dt: number, now: number) {
    if (this.state !== "playing") return;

    if (now - this.waveStartTime > WAVE_DURATION) {
      this.wave++;
      this.waveStartTime = now;
      this.addScorePopup(this.canvasW / 2, this.canvasH * 0.3, `WAVE ${this.wave}!`, COLORS.hayGold);
      this.spawnParticles(this.canvasW / 2, this.canvasH * 0.3, "#FFD700", 20, 5);
    }

    const spawnInterval = Math.max(MIN_SPAWN_INTERVAL, INITIAL_SPAWN_INTERVAL - (this.wave - 1) * 80);
    if (now - this.lastSpawnTime > spawnInterval) {
      this.spawnEgg();
      if (this.wave >= 3 && Math.random() < 0.3) this.spawnEgg();
      if (this.wave >= 5 && Math.random() < 0.2) this.spawnEgg();
      this.lastSpawnTime = now;
    }

    const puInterval = 12000 - Math.min(this.wave * 500, 5000);
    if (now - this.lastPowerUpTime > puInterval) {
      if (Math.random() < 0.5) this.spawnPowerUp();
      this.lastPowerUpTime = now;
    }

    if (this.activePowerUps.wide > 0 && now < this.activePowerUps.wide) {
      this.basketWidth = this.basketBaseWidth * 1.6;
    } else {
      this.activePowerUps.wide = 0;
      this.basketWidth = this.basketBaseWidth;
    }

    if (this.activePowerUps.magnet > 0 && now >= this.activePowerUps.magnet) {
      this.activePowerUps.magnet = 0;
    }

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.comboCount = 0;
    }

    const basketY = this.canvasH - 50;
    const basketTop = basketY - 5;
    const basketLeft = this.basketX - this.basketWidth / 2;
    const basketRight = this.basketX + this.basketWidth / 2;

    for (let i = this.eggs.length - 1; i >= 0; i--) {
      const egg = this.eggs[i];
      egg.wobblePhase += egg.wobbleSpeed;
      egg.x += Math.sin(egg.wobblePhase) * egg.wobble * 0.3;
      egg.rotation += egg.rotationSpeed;

      if (this.activePowerUps.magnet > 0 && egg.type !== "rotten") {
        const dx = this.basketX - egg.x;
        const dy = basketY - egg.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAGNET_RANGE && dist > 0) {
          const force = (MAGNET_STRENGTH * (MAGNET_RANGE - dist)) / MAGNET_RANGE;
          egg.x += (dx / dist) * force;
          egg.y += (dy / dist) * force * 0.5;
        }
      }

      egg.y += egg.speed;

      if (
        egg.y + egg.radius > basketTop &&
        egg.y - egg.radius < basketTop + 25 &&
        egg.x > basketLeft - 5 &&
        egg.x < basketRight + 5
      ) {
        if (egg.type === "rotten") {
          if (this.activePowerUps.shield) {
            this.activePowerUps.shield = false;
            this.spawnParticles(egg.x, egg.y, "#3B82F6", 15);
            this.addScorePopup(egg.x, egg.y - 20, "BLOCKED!", "#3B82F6");
          } else {
            this.score = Math.max(0, this.score + EGG_POINTS.rotten);
            this.shakeTimer = 15;
            this.shakeIntensity = 6;
            this.comboCount = 0;
            this.spawnParticles(egg.x, egg.y, "#4A6B2A", 12);
            this.addScorePopup(egg.x, egg.y - 20, `${EGG_POINTS.rotten}`, "#FF4444");
          }
        } else {
          let points = EGG_POINTS[egg.type];
          this.comboCount++;
          this.comboTimer = 2000;
          if (this.comboCount >= 3) {
            points = Math.round(points * (1 + this.comboCount * 0.1));
          }
          this.score += points;
          const color =
            egg.type === "golden"
              ? "#FFD700"
              : egg.type === "easter"
                ? "#FF69B4"
                : egg.type === "brown"
                  ? "#DAA050"
                  : "#FFF";
          this.spawnParticles(egg.x, egg.y, color, 10);
          this.addScorePopup(
            egg.x,
            egg.y - 20,
            `+${points}${this.comboCount >= 3 ? ` x${this.comboCount}` : ""}`,
            color,
          );
        }
        this.eggs.splice(i, 1);
        continue;
      }

      if (egg.y > this.canvasH + 30) {
        if (egg.type !== "rotten") {
          this.missedGoodEggs++;
          if (this.missedGoodEggs >= MISSED_EGG_THRESHOLD) {
            this.lives--;
            this.missedGoodEggs = 0;
            this.shakeTimer = 10;
            this.shakeIntensity = 4;
            if (this.lives <= 0) {
              this.state = "gameover";
              if (this.score > this.highScore) {
                this.highScore = this.score;
                try {
                  localStorage.setItem("eggCatcher_highScore", String(this.score));
                } catch {
                  /* noop */
                }
              }
              this.onGameOverCb?.(this.score);
            }
          }
        }
        this.eggs.splice(i, 1);
      }
    }

    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const pu = this.powerUps[i];
      pu.y += pu.speed;
      pu.rotation += 0.02;

      if (
        pu.y + pu.radius > basketTop &&
        pu.y - pu.radius < basketTop + 25 &&
        pu.x > basketLeft - 5 &&
        pu.x < basketRight + 5
      ) {
        if (pu.type === "wide") {
          this.activePowerUps.wide = now + POWERUP_WIDE_DURATION;
          this.addScorePopup(pu.x, pu.y - 20, "WIDE BASKET!", "#FF8C00");
        } else if (pu.type === "magnet") {
          this.activePowerUps.magnet = now + POWERUP_MAGNET_DURATION;
          this.addScorePopup(pu.x, pu.y - 20, "MAGNET!", "#8B5CF6");
        } else if (pu.type === "shield") {
          this.activePowerUps.shield = true;
          this.addScorePopup(pu.x, pu.y - 20, "SHIELD!", "#3B82F6");
        }
        this.spawnParticles(pu.x, pu.y, "#FFF", 15, 4);
        this.powerUps.splice(i, 1);
        continue;
      }

      if (pu.y > this.canvasH + 30) {
        this.powerUps.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.scorePopups.length - 1; i >= 0; i--) {
      const sp = this.scorePopups[i];
      sp.y -= 0.8;
      sp.life--;
      if (sp.life <= 0) this.scorePopups.splice(i, 1);
    }

    for (const ch of this.chickens) {
      ch.timer++;
      if (ch.pecking) {
        ch.peckTimer++;
        if (ch.peckTimer > 40) {
          ch.pecking = false;
          ch.peckTimer = 0;
        }
      } else {
        ch.x += ch.walkSpeed * ch.direction;
        if (ch.x < 20 || ch.x > this.canvasW - 20) ch.direction *= -1;
        if (Math.random() < 0.005) {
          ch.pecking = true;
          ch.peckTimer = 0;
        }
        if (Math.random() < 0.003) ch.direction *= -1;
      }
    }

    for (const cl of this.clouds) {
      cl.x += cl.speed;
      if (cl.x > this.canvasW + cl.width) {
        cl.x = -cl.width;
        cl.y = rand(60, 180);
      }
    }

    if (this.shakeTimer > 0) this.shakeTimer--;
  }

  // --- render ---

  render(time: number) {
    const ctx = this.ctx;
    const w = this.canvasW;
    const h = this.canvasH;

    ctx.clearRect(0, 0, w, h);

    if (this.state === "start") {
      this.drawStartScreen(time);
      return;
    }

    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      shakeY = (Math.random() - 0.5) * this.shakeIntensity;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    this.drawBackground();

    for (const egg of this.eggs) drawEggShape(ctx, egg, time);
    for (const pu of this.powerUps) drawPowerUpShape(ctx, pu, time);

    this.drawBasket(time);

    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.round(p.size), Math.round(p.size));
    }
    ctx.globalAlpha = 1;

    for (const sp of this.scorePopups) {
      const alpha = sp.life / 60;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = sp.color;
      ctx.font = `bold ${Math.min(18, w * 0.045)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sp.text, sp.x, sp.y);
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    this.drawHUD();

    if (this.state === "gameover") this.drawGameOver(time);
  }

  // --- drawing sub-routines ---

  drawBackground() {
    const ctx = this.ctx;
    const w = this.canvasW;
    const h = this.canvasH;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    skyGrad.addColorStop(0, COLORS.skyTop);
    skyGrad.addColorStop(1, COLORS.skyBlue);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.65);

    const sunX = w * 0.85;
    const sunY = h * 0.1;
    ctx.fillStyle = "#FFF9C4";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFEB3B80";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 42, 0, Math.PI * 2);
    ctx.fill();

    for (const cloud of this.clouds) {
      ctx.fillStyle = "#FFFFFFCC";
      const cw = cloud.width;
      ctx.beginPath();
      ctx.ellipse(cloud.x, cloud.y, cw * 0.5, cw * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cloud.x - cw * 0.25, cloud.y + 4, cw * 0.3, cw * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cloud.x + cw * 0.25, cloud.y + 2, cw * 0.35, cw * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const grassY = h * 0.6;
    const grassGrad = ctx.createLinearGradient(0, grassY, 0, h);
    grassGrad.addColorStop(0, COLORS.grassLight);
    grassGrad.addColorStop(0.3, COLORS.grassGreen);
    grassGrad.addColorStop(1, COLORS.grassDark);
    ctx.fillStyle = grassGrad;
    ctx.beginPath();
    ctx.moveTo(0, grassY + 20);
    for (let x = 0; x <= w; x += 2) {
      const y = grassY + Math.sin(x * 0.01) * 12 + Math.sin(x * 0.025) * 6;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    const barnX = w * 0.05;
    const barnW = w * 0.18;
    const barnH = h * 0.2;
    const barnY = grassY - barnH + 10;

    drawPixelRect(ctx, barnX, barnY + barnH * 0.3, barnW, barnH * 0.7, COLORS.barnRed);
    drawPixelRect(ctx, barnX + 2, barnY + barnH * 0.3 + 2, barnW - 4, barnH * 0.7 - 4, "#A03020");

    ctx.fillStyle = COLORS.barnRedDark;
    ctx.beginPath();
    ctx.moveTo(barnX - 6, barnY + barnH * 0.3);
    ctx.lineTo(barnX + barnW / 2, barnY);
    ctx.lineTo(barnX + barnW + 6, barnY + barnH * 0.3);
    ctx.closePath();
    ctx.fill();

    const doorW = barnW * 0.3;
    const doorH = barnH * 0.45;
    drawPixelRect(ctx, barnX + barnW / 2 - doorW / 2, barnY + barnH - doorH, doorW, doorH, COLORS.woodDark);
    drawPixelRect(ctx, barnX + barnW / 2 - doorW / 2 + 2, barnY + barnH - doorH + 2, doorW - 4, doorH - 2, COLORS.wood);

    ctx.strokeStyle = COLORS.woodDark;
    ctx.lineWidth = 2;
    const dx = barnX + barnW / 2 - doorW / 2 + 3;
    const dy = barnY + barnH - doorH + 3;
    ctx.beginPath();
    ctx.moveTo(dx, dy);
    ctx.lineTo(dx + doorW - 8, dy + doorH - 6);
    ctx.moveTo(dx + doorW - 8, dy);
    ctx.lineTo(dx, dy + doorH - 6);
    ctx.stroke();

    const winY = barnY + barnH * 0.35;
    drawPixelRect(ctx, barnX + barnW * 0.65, winY, barnW * 0.2, barnW * 0.18, COLORS.woodDark);
    drawPixelRect(ctx, barnX + barnW * 0.65 + 2, winY + 2, barnW * 0.2 - 4, barnW * 0.18 - 4, "#87CEEB88");

    const fenceY = grassY + 5;
    const fenceH = 30;
    const postSpacing = 40;

    ctx.strokeStyle = COLORS.fenceShadow;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, fenceY);
    ctx.lineTo(w, fenceY);
    ctx.moveTo(0, fenceY + fenceH * 0.55);
    ctx.lineTo(w, fenceY + fenceH * 0.55);
    ctx.stroke();

    ctx.strokeStyle = COLORS.fencePost;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, fenceY - 1);
    ctx.lineTo(w, fenceY - 1);
    ctx.moveTo(0, fenceY + fenceH * 0.55 - 1);
    ctx.lineTo(w, fenceY + fenceH * 0.55 - 1);
    ctx.stroke();

    for (let fx = 10; fx < w; fx += postSpacing) {
      drawPixelRect(ctx, fx - 3, fenceY - 8, 6, fenceH + 12, COLORS.fenceShadow);
      drawPixelRect(ctx, fx - 2, fenceY - 8, 4, fenceH + 10, COLORS.fencePost);
      drawPixelRect(ctx, fx - 4, fenceY - 10, 8, 4, COLORS.fencePost);
    }

    for (const ch of this.chickens) drawChicken(ctx, ch);
  }

  drawBasket(time: number) {
    const ctx = this.ctx;
    const x = this.basketX;
    const y = this.canvasH - 50;
    const width = this.basketWidth;
    const halfW = width / 2;
    const basketH = 28;
    const rimH = 6;

    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = "#00000022";
    ctx.beginPath();
    ctx.ellipse(2, basketH + 2, halfW + 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    const topW = halfW;
    const botW = halfW * 0.7;
    ctx.fillStyle = COLORS.wood;
    ctx.beginPath();
    ctx.moveTo(-topW, 0);
    ctx.lineTo(-botW, basketH);
    ctx.lineTo(botW, basketH);
    ctx.lineTo(topW, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = COLORS.woodDark;
    ctx.lineWidth = 1;
    const stripes = 5;
    for (let i = 0; i < stripes; i++) {
      const frac = (i + 1) / (stripes + 1);
      const ly = frac * basketH;
      const lw = topW - (topW - botW) * frac;
      ctx.beginPath();
      ctx.moveTo(-lw, ly);
      ctx.lineTo(lw, ly);
      ctx.stroke();
    }
    for (let i = -3; i <= 3; i++) {
      const vx = i * (topW / 4);
      ctx.beginPath();
      ctx.moveTo(vx, 2);
      ctx.lineTo(vx * (botW / topW), basketH - 2);
      ctx.stroke();
    }

    ctx.fillStyle = COLORS.woodLight;
    ctx.beginPath();
    ctx.ellipse(0, 0, topW, rimH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COLORS.woodDark;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.strokeStyle = COLORS.woodDark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -14, halfW * 0.6, Math.PI * 0.15, Math.PI * 0.85, true);
    ctx.stroke();
    ctx.strokeStyle = COLORS.woodLight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -14, halfW * 0.6, Math.PI * 0.15, Math.PI * 0.85, true);
    ctx.stroke();

    if (this.activePowerUps.shield) {
      ctx.strokeStyle = "#3B82F688";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, basketH / 2, halfW + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "#3B82F633";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, basketH / 2, halfW + 12, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (this.activePowerUps.magnet > 0) {
      const pulse = Math.sin(time * 0.006) * 0.3 + 0.4;
      ctx.strokeStyle = `rgba(139, 92, 246, ${pulse})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, basketH / 2, MAGNET_RANGE, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  drawHUD() {
    const ctx = this.ctx;
    const w = this.canvasW;
    const pad = 10;
    const fontSize = Math.min(18, w * 0.045);

    ctx.fillStyle = "#00000066";
    ctx.fillRect(0, 0, w, fontSize * 2.8);

    ctx.fillStyle = COLORS.hayGold;
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`SCORE: ${this.score}`, pad, pad);

    ctx.fillStyle = COLORS.cream;
    ctx.textAlign = "center";
    ctx.fillText(`WAVE ${this.wave}`, w / 2, pad);

    ctx.fillStyle = "#AAA";
    ctx.font = `${fontSize * 0.7}px monospace`;
    ctx.fillText(`HI: ${this.highScore}`, w / 2, pad + fontSize * 1.2);

    ctx.textAlign = "right";
    ctx.font = `${fontSize}px monospace`;
    let heartsStr = "";
    for (let i = 0; i < this.lives; i++) heartsStr += "\u2764 ";
    ctx.fillStyle = "#FF4444";
    ctx.fillText(heartsStr, w - pad, pad);

    if (this.missedGoodEggs > 0) {
      ctx.fillStyle = "#FF444488";
      ctx.font = `${fontSize * 0.65}px monospace`;
      ctx.fillText(`missed: ${this.missedGoodEggs}/${MISSED_EGG_THRESHOLD}`, w - pad, pad + fontSize * 1.3);
    }

    let puY = fontSize * 3.2;
    const now = performance.now();
    ctx.textAlign = "left";
    ctx.font = `${fontSize * 0.7}px monospace`;
    if (this.activePowerUps.wide > 0) {
      const remaining = Math.ceil((this.activePowerUps.wide - now) / 1000);
      ctx.fillStyle = "#FF8C00";
      ctx.fillText(`WIDE [${remaining}s]`, pad, puY);
      puY += fontSize;
    }
    if (this.activePowerUps.magnet > 0) {
      const remaining = Math.ceil((this.activePowerUps.magnet - now) / 1000);
      ctx.fillStyle = "#8B5CF6";
      ctx.fillText(`MAGNET [${remaining}s]`, pad, puY);
      puY += fontSize;
    }
    if (this.activePowerUps.shield) {
      ctx.fillStyle = "#3B82F6";
      ctx.fillText("SHIELD [active]", pad, puY);
      puY += fontSize;
    }

    if (this.comboCount >= 3) {
      ctx.fillStyle = "#FFD700";
      ctx.font = `bold ${fontSize * 0.8}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(`COMBO x${this.comboCount}!`, w / 2, puY);
    }
  }

  drawStartScreen(time: number) {
    const ctx = this.ctx;
    const w = this.canvasW;
    const h = this.canvasH;

    this.drawBackground();

    ctx.fillStyle = "#000000AA";
    ctx.fillRect(0, 0, w, h);

    const centerX = w / 2;
    const pulse = Math.sin(time * 0.003) * 0.1 + 1;
    const titleSize = Math.min(36, w * 0.09);

    ctx.fillStyle = COLORS.hayGold;
    ctx.font = `bold ${titleSize}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(centerX, h * 0.18);
    ctx.scale(pulse, pulse);
    ctx.fillText("EGG CATCHER", 0, 0);
    ctx.restore();

    ctx.fillStyle = COLORS.cream;
    ctx.font = `${titleSize * 0.4}px monospace`;
    ctx.fillText("A Farm Fresh Adventure", centerX, h * 0.24);

    const eggY = h * 0.33;
    const eggSpacing = w * 0.14;
    const eggTypes: EggType[] = ["white", "brown", "golden", "rotten", "easter"];
    const labels = ["+10", "+20", "+50", "-30", "+100"];
    for (let i = 0; i < eggTypes.length; i++) {
      const ex = centerX - eggSpacing * 2 + i * eggSpacing;
      const dummyEgg: Egg = {
        x: ex,
        y: eggY,
        radius: 12,
        speed: 0,
        type: eggTypes[i],
        rotation: 0,
        rotationSpeed: 0,
        wobble: 0,
        wobbleSpeed: 0,
        wobblePhase: 0,
      };
      drawEggShape(ctx, dummyEgg, time);
      ctx.fillStyle = eggTypes[i] === "rotten" ? "#FF4444" : COLORS.cream;
      ctx.font = `bold ${titleSize * 0.3}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[i], ex, eggY + 22);
    }

    const instrY = h * 0.46;
    const instrSize = Math.min(14, w * 0.035);
    ctx.fillStyle = COLORS.cream;
    ctx.font = `${instrSize}px monospace`;
    const lines = [
      "Catch eggs in your basket!",
      "Avoid the rotten green ones!",
      "",
      "MOBILE: Touch & drag",
      "DESKTOP: Mouse or Arrow keys",
      "",
      "Power-ups:",
      "  [W] Wide basket   [M] Magnet",
      "  [S] Shield vs rotten eggs",
      "",
      "Miss 3 good eggs = lose a life",
      "Waves get harder every 30s!",
    ];
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], centerX, instrY + i * (instrSize * 1.6));
    }

    const btnW = Math.min(200, w * 0.5);
    const btnH = 50;
    const btnY = h * 0.88;
    const btnPulse = Math.sin(time * 0.004) * 3;

    ctx.fillStyle = COLORS.grassGreen;
    ctx.beginPath();
    ctx.roundRect(centerX - btnW / 2, btnY - btnH / 2 + btnPulse, btnW, btnH, 8);
    ctx.fill();
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#FFF";
    ctx.font = `bold ${Math.min(22, w * 0.055)}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("TAP TO PLAY", centerX, btnY + btnPulse + 1);
  }

  drawGameOver(time: number) {
    const ctx = this.ctx;
    const w = this.canvasW;
    const h = this.canvasH;

    this.gameOverAlpha = Math.min(this.gameOverAlpha + 0.02, 0.85);
    ctx.fillStyle = `rgba(0,0,0,${this.gameOverAlpha})`;
    ctx.fillRect(0, 0, w, h);

    if (this.gameOverAlpha < 0.3) return;

    const centerX = w / 2;
    const titleSize = Math.min(32, w * 0.08);

    ctx.fillStyle = "#FF4444";
    ctx.font = `bold ${titleSize}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", centerX, h * 0.28);

    ctx.fillStyle = COLORS.hayGold;
    ctx.font = `bold ${titleSize * 0.8}px monospace`;
    ctx.fillText(`Score: ${this.score}`, centerX, h * 0.38);

    const isNewHigh = this.score >= this.highScore && this.score > 0;
    if (isNewHigh) {
      const blink = Math.sin(time * 0.008) > 0;
      if (blink) {
        ctx.fillStyle = "#FFD700";
        ctx.font = `bold ${titleSize * 0.55}px monospace`;
        ctx.fillText("NEW HIGH SCORE!", centerX, h * 0.45);
      }
    } else {
      ctx.fillStyle = "#AAA";
      ctx.font = `${titleSize * 0.5}px monospace`;
      ctx.fillText(`Best: ${this.highScore}`, centerX, h * 0.45);
    }

    ctx.fillStyle = COLORS.cream;
    ctx.font = `${titleSize * 0.45}px monospace`;
    ctx.fillText(`Wave reached: ${this.wave}`, centerX, h * 0.53);

    const btnW = Math.min(220, w * 0.55);
    const btnH = 50;
    const btnY = h * 0.65;
    const btnPulse = Math.sin(time * 0.004) * 2;

    ctx.fillStyle = COLORS.grassGreen;
    ctx.beginPath();
    ctx.roundRect(centerX - btnW / 2, btnY - btnH / 2 + btnPulse, btnW, btnH, 8);
    ctx.fill();
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#FFF";
    ctx.font = `bold ${Math.min(20, w * 0.05)}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PLAY AGAIN", centerX, btnY + btnPulse + 1);
  }

  // --- input ---

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePointerDown(clientX: number, _clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvasW / rect.width;
    const x = (clientX - rect.left) * scaleX;

    if (this.state === "start") {
      this.resetGame();
      return;
    }

    if (this.state === "gameover") {
      if (this.gameOverAlpha > 0.7) {
        this.resetGame();
        return;
      }
    }

    if (this.state === "playing") {
      this.touchActive = true;
      this.touchOffsetX = x - this.basketX;
    }
  }

  handlePointerMove(clientX: number) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvasW / rect.width;
    const x = (clientX - rect.left) * scaleX;

    if (this.state === "playing") {
      if (this.touchActive) {
        this.basketX = Math.max(
          this.basketWidth / 2,
          Math.min(this.canvasW - this.basketWidth / 2, x - this.touchOffsetX),
        );
      } else {
        this.basketX = Math.max(
          this.basketWidth / 2,
          Math.min(this.canvasW - this.basketWidth / 2, x),
        );
      }
    }
  }

  handlePointerUp() {
    this.touchActive = false;
  }

  handleKeyboard(keysDown: Set<string>) {
    if (this.state !== "playing") return;
    const moveSpeed = 6;
    if (keysDown.has("ArrowLeft") || keysDown.has("a")) {
      this.basketX = Math.max(this.basketWidth / 2, this.basketX - moveSpeed);
    }
    if (keysDown.has("ArrowRight") || keysDown.has("d")) {
      this.basketX = Math.min(this.canvasW - this.basketWidth / 2, this.basketX + moveSpeed);
    }
  }
}

// ---------------------------------------------------------------------------
// React Component (thin wrapper)
// ---------------------------------------------------------------------------

interface EggCatcherProps {
  onGameOver?: (score: number) => void;
}

export default function EggCatcher({ onGameOver }: EggCatcherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<EggCatcherEngine | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new EggCatcherEngine(canvas);
    engine.onGameOverCb = onGameOver ?? null;
    engineRef.current = engine;

    // --- sizing ---
    const computeSize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const maxW = Math.min(rect.width, 500);
      const maxH = Math.min(rect.height, window.innerHeight - 20);
      const aspectRatio = 2 / 3;

      let w: number;
      let h: number;
      if (maxW / maxH < aspectRatio) {
        w = Math.floor(maxW);
        h = Math.floor(w / aspectRatio);
      } else {
        h = Math.floor(maxH);
        w = Math.floor(h * aspectRatio);
      }
      w = Math.max(w, 280);
      h = Math.max(h, 420);
      engine.resize(w, h);
      setCanvasSize({ width: w, height: h });
    };

    computeSize();
    window.addEventListener("resize", computeSize);

    // --- mouse ---
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      engine.handlePointerDown(e.clientX, e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => engine.handlePointerMove(e.clientX);
    const onMouseUp = () => engine.handlePointerUp();

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // --- touch ---
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      engine.handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      engine.handlePointerMove(e.touches[0].clientX);
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      engine.handlePointerUp();
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });

    // --- keyboard ---
    const keysDown = new Set<string>();
    let keyInterval: ReturnType<typeof setInterval> | null = null;

    const processKeys = () => engine.handleKeyboard(keysDown);

    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) {
        e.preventDefault();
        keysDown.add(e.key);
        if (!keyInterval) keyInterval = setInterval(processKeys, 16);
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (engine.state === "start" || engine.state === "gameover") {
          engine.resetGame();
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysDown.delete(e.key);
      if (keysDown.size === 0 && keyInterval) {
        clearInterval(keyInterval);
        keyInterval = null;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // --- start ---
    engine.start();

    return () => {
      engine.destroy();
      window.removeEventListener("resize", computeSize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (keyInterval) clearInterval(keyInterval);
    };
  }, [onGameOver]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full"
      style={{ height: "calc(100dvh - 140px)", minHeight: 420 }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          imageRendering: "pixelated",
          touchAction: "none",
          cursor: "pointer",
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}
