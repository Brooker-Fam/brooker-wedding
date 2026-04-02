'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// --- Type Definitions ---

type GamePhase = 'start' | 'playing' | 'gameover';
type Environment = 'farm' | 'forest' | 'lake';

interface ZoeState {
  x: number;
  y: number;
  vy: number;
  w: number;
  h: number;
  grounded: boolean;
  jumpsLeft: number;
  legFrame: number;
  tailAngle: number;
  invincible: number;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'mud' | 'goose' | 'fencepost' | 'rock';
  gooseFrame?: number;
}

interface Collectible {
  x: number;
  y: number;
  type: 'bone' | 'tennis' | 'bacon' | 'heart';
  collected: boolean;
  bob: number;
}

interface BrucePowerUp {
  active: boolean;
  timer: number;
  x: number;
  y: number;
  frame: number;
}

interface CouchCheckpoint {
  x: number;
  active: boolean;
  resting: boolean;
  restTimer: number;
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

interface Cloud {
  x: number;
  y: number;
  w: number;
  speed: number;
}

interface BgElement {
  x: number;
  type: number;
  h: number;
}

interface GameData {
  zoe: ZoeState;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  bruce: BrucePowerUp;
  couch: CouchCheckpoint;
  particles: Particle[];
  clouds: Cloud[];
  bgFar: BgElement[];
  bgMid: BgElement[];
  bgNear: BgElement[];
  groundY: number;
  scrollSpeed: number;
  baseSpeed: number;
  scrollX: number;
  score: number;
  frame: number;
  env: Environment;
  envTransition: number;
  canvasW: number;
  canvasH: number;
  lastObstacleX: number;
  lastCollectibleX: number;
  lastBruceScore: number;
  lastCouchScore: number;
  scoreMultiplier: number;
  comboCount: number;
  comboTimer: number;
  floatingTexts: { x: number; y: number; text: string; color: string; life: number }[];
}

interface ZoesAdventureProps {
  onGameOver: (score: number) => void;
}

// --- Helper: Environment Colors ---

function getEnvColors(env: Environment) {
  switch (env) {
    case 'farm':
      return {
        skyTop: '#87CEEB',
        skyBottom: '#B0E0E6',
        groundTop: '#228B22',
        groundBottom: '#1a6b1a',
        hillFar: '#3CB371',
        hillNear: '#2E8B57',
      };
    case 'forest':
      return {
        skyTop: '#5F8B4C',
        skyBottom: '#8FBC8F',
        groundTop: '#2d5a1e',
        groundBottom: '#1e3d14',
        hillFar: '#4a7c3f',
        hillNear: '#3a6b30',
      };
    case 'lake':
      return {
        skyTop: '#6BB3D9',
        skyBottom: '#A8D8EA',
        groundTop: '#c2b280',
        groundBottom: '#a89a6b',
        hillFar: '#4a90a8',
        hillNear: '#3a7a92',
      };
  }
}

function getEnvForScore(score: number): Environment {
  const cycle = Math.floor(score / 500) % 3;
  if (cycle === 0) return 'farm';
  if (cycle === 1) return 'forest';
  return 'lake';
}

// --- Main Component ---

export default function ZoesAdventure({ onGameOver }: ZoesAdventureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<GamePhase>('start');
  const [displayScore, setDisplayScore] = useState(0);
  const gameRef = useRef<GameData | null>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef<GamePhase>('start');

  // Keep phaseRef in sync
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // --- Canvas Resize ---

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.min(container.getBoundingClientRect().width, 500);
    const maxH = window.innerHeight - container.getBoundingClientRect().top;
    const h = Math.min(Math.max(maxH, 400), 600);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (gameRef.current) {
      gameRef.current.canvasW = w;
      gameRef.current.canvasH = h;
      gameRef.current.groundY = h - 80;
    }
  }, []);

  // --- Init Game ---

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(canvas.width / dpr);
    const h = Math.round(canvas.height / dpr);
    const groundY = h - 80;

    const clouds: Cloud[] = Array.from({ length: 6 }, (_, i) => ({
      x: (i * w) / 3 + Math.random() * 100,
      y: 20 + Math.random() * 80,
      w: 40 + Math.random() * 60,
      speed: 0.15 + Math.random() * 0.25,
    }));

    const bgFar: BgElement[] = Array.from({ length: 8 }, (_, i) => ({
      x: i * (w / 4) + Math.random() * 40,
      type: Math.floor(Math.random() * 3),
      h: 30 + Math.random() * 30,
    }));

    const bgMid: BgElement[] = Array.from({ length: 10 }, (_, i) => ({
      x: i * (w / 5) + Math.random() * 30,
      type: Math.floor(Math.random() * 4),
      h: 40 + Math.random() * 40,
    }));

    const bgNear: BgElement[] = Array.from({ length: 15 }, (_, i) => ({
      x: i * (w / 7) + Math.random() * 20,
      type: Math.floor(Math.random() * 5),
      h: 10 + Math.random() * 15,
    }));

    gameRef.current = {
      zoe: {
        x: 70,
        y: groundY - 36,
        vy: 0,
        w: 40,
        h: 36,
        grounded: true,
        jumpsLeft: 2,
        legFrame: 0,
        tailAngle: 0,
        invincible: 0,
      },
      obstacles: [],
      collectibles: [],
      bruce: { active: false, timer: 0, x: 0, y: 0, frame: 0 },
      couch: { x: -200, active: false, resting: false, restTimer: 0 },
      particles: [],
      clouds,
      bgFar,
      bgMid,
      bgNear,
      groundY,
      scrollSpeed: 3.5,
      baseSpeed: 3.5,
      scrollX: 0,
      score: 0,
      frame: 0,
      env: 'farm',
      envTransition: 0,
      canvasW: w,
      canvasH: h,
      lastObstacleX: w + 200,
      lastCollectibleX: w + 100,
      lastBruceScore: 0,
      lastCouchScore: 0,
      scoreMultiplier: 1,
      comboCount: 0,
      comboTimer: 0,
      floatingTexts: [],
    };
  }, []);

  // --- Spawn Functions ---

  const spawnObstacle = useCallback((g: GameData) => {
    const minGap = Math.max(140, 220 - g.score * 0.05);
    if (g.lastObstacleX < g.canvasW + minGap) return;
    if (g.couch.resting) return;

    const types: Obstacle['type'][] = ['mud', 'goose', 'fencepost', 'rock'];
    const envWeights: Record<Environment, number[]> = {
      farm: [0.3, 0.3, 0.3, 0.1],
      forest: [0.15, 0.1, 0.15, 0.6],
      lake: [0.4, 0.25, 0.1, 0.25],
    };
    const weights = envWeights[g.env];
    let r = Math.random();
    let typeIdx = 0;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) { typeIdx = i; break; }
    }
    const type = types[typeIdx];

    let obs: Obstacle;
    switch (type) {
      case 'mud':
        obs = { x: g.canvasW + 20, y: g.groundY - 8, w: 50, h: 10, type: 'mud' };
        break;
      case 'goose':
        obs = { x: g.canvasW + 20, y: g.groundY - 34, w: 30, h: 34, type: 'goose', gooseFrame: 0 };
        break;
      case 'fencepost':
        obs = { x: g.canvasW + 20, y: g.groundY - 40, w: 14, h: 40, type: 'fencepost' };
        break;
      case 'rock':
        obs = { x: g.canvasW + 20, y: g.groundY - 22, w: 28, h: 22, type: 'rock' };
        break;
    }
    g.obstacles.push(obs);
    g.lastObstacleX = 0;
  }, []);

  const spawnCollectible = useCallback((g: GameData) => {
    const gap = 90 + Math.random() * 80;
    if (g.lastCollectibleX < g.canvasW + gap) return;
    if (g.couch.resting) return;

    const r = Math.random();
    let type: Collectible['type'];
    if (r < 0.4) type = 'bone';
    else if (r < 0.7) type = 'tennis';
    else if (r < 0.9) type = 'bacon';
    else type = 'heart';

    const yOffset = Math.random() > 0.4 ? 0 : 30 + Math.random() * 40;
    g.collectibles.push({
      x: g.canvasW + 20,
      y: g.groundY - 20 - yOffset,
      type,
      collected: false,
      bob: Math.random() * Math.PI * 2,
    });
    g.lastCollectibleX = 0;
  }, []);

  const spawnBruce = useCallback((g: GameData) => {
    if (g.bruce.active) return;
    if (g.score - g.lastBruceScore < 300) return;
    if (Math.random() > 0.02) return;

    g.bruce = {
      active: true,
      timer: 600,
      x: -40,
      y: g.groundY - 28,
      frame: 0,
    };
    g.lastBruceScore = g.score;
    g.floatingTexts.push({
      x: g.canvasW / 2,
      y: g.canvasH / 2 - 40,
      text: 'BRUCE JOINS!',
      color: '#FFD700',
      life: 90,
    });
  }, []);

  const spawnCouch = useCallback((g: GameData) => {
    if (g.couch.active || g.couch.resting) return;
    if (g.score - g.lastCouchScore < 400) return;
    if (Math.random() > 0.008) return;

    g.couch = {
      x: g.canvasW + 50,
      active: true,
      resting: false,
      restTimer: 0,
    };
    g.lastCouchScore = g.score;
  }, []);

  // --- Particle Helpers ---

  const addParticles = useCallback((g: GameData, x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      g.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 4 - 1,
        life: 25 + Math.random() * 25,
        maxLife: 50,
        color,
        size: 2 + Math.random() * 4,
      });
    }
  }, []);

  // --- Collision ---

  const collides = (
    ax: number, ay: number, aw: number, ah: number,
    bx: number, by: number, bw: number, bh: number,
  ) => {
    const shrink = 4;
    return (
      ax + shrink < bx + bw &&
      ax + aw - shrink > bx &&
      ay + shrink < by + bh &&
      ay + ah - shrink > by
    );
  };

  // --- Drawing Functions ---

  const drawZoe = useCallback((ctx: CanvasRenderingContext2D, g: GameData) => {
    const { zoe } = g;
    const x = zoe.x;
    const y = zoe.y;

    ctx.save();

    if (zoe.invincible > 0 && zoe.invincible % 6 < 3) {
      ctx.globalAlpha = 0.5;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x + 20, g.groundY + 2, 18, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail (wagging)
    zoe.tailAngle = Math.sin(g.frame * 0.3) * 0.5;
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 10);
    ctx.quadraticCurveTo(
      x - 12 + Math.sin(g.frame * 0.3) * 8,
      y - 2 + Math.cos(g.frame * 0.3) * 4,
      x - 10 + Math.sin(g.frame * 0.3) * 10,
      y - 6,
    );
    ctx.stroke();

    // Legs (running animation)
    const legPhase = g.frame * 0.25;
    ctx.fillStyle = '#1a1a1a';

    // Back legs
    const backLeg1Y = Math.sin(legPhase) * 6;
    const backLeg2Y = Math.sin(legPhase + Math.PI) * 6;
    ctx.fillRect(x + 4, y + 26 + backLeg1Y, 5, 10 - backLeg1Y);
    ctx.fillRect(x + 12, y + 26 + backLeg2Y, 5, 10 - backLeg2Y);

    // Front legs
    const frontLeg1Y = Math.sin(legPhase + Math.PI * 0.5) * 6;
    const frontLeg2Y = Math.sin(legPhase + Math.PI * 1.5) * 6;
    ctx.fillRect(x + 24, y + 26 + frontLeg1Y, 5, 10 - frontLeg1Y);
    ctx.fillRect(x + 32, y + 26 + frontLeg2Y, 5, 10 - frontLeg2Y);

    // Paws (little lighter)
    ctx.fillStyle = '#333';
    [
      { lx: x + 4, ly: y + 34 + backLeg1Y },
      { lx: x + 12, ly: y + 34 + backLeg2Y },
      { lx: x + 24, ly: y + 34 + frontLeg1Y },
      { lx: x + 32, ly: y + 34 + frontLeg2Y },
    ].forEach(({ lx, ly }) => {
      ctx.fillRect(lx - 1, Math.min(ly, g.groundY - 2), 7, 3);
    });

    // Body
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 18, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly (slightly lighter)
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 22, 14, 8, 0, 0, Math.PI);
    ctx.fill();

    // Head
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(x + 34, y + 8, 12, 11, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle (grey/white - older dog)
    ctx.fillStyle = '#9a9a9a';
    ctx.beginPath();
    ctx.ellipse(x + 42, y + 12, 7, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle highlight (lighter)
    ctx.fillStyle = '#b8b8b8';
    ctx.beginPath();
    ctx.ellipse(x + 43, y + 13, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(x + 47, y + 10, 3, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(x + 47, y + 10, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(x + 38, y + 5, 4, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a2010';
    ctx.beginPath();
    ctx.ellipse(x + 39, y + 5, 2.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + 39.5, y + 5, 1.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(x + 40.5, y + 4, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Floppy ears
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(x + 28, y + 8, 6, 10, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.ellipse(x + 28, y + 10, 4, 7, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (happy smile)
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x + 44, y + 14, 3, 0, Math.PI);
    ctx.stroke();

    // Grey eyebrows (older dog detail)
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.ellipse(x + 36, y + 1, 3, 1, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, []);

  const drawBruce = useCallback((ctx: CanvasRenderingContext2D, g: GameData) => {
    if (!g.bruce.active) return;
    const { bruce } = g;
    const x = bruce.x;
    const y = bruce.y;

    // Cat running animation
    const legPhase = g.frame * 0.3;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(x + 12, g.groundY + 2, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail (upright, curved)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 8);
    ctx.quadraticCurveTo(x - 8, y - 10, x - 4 + Math.sin(g.frame * 0.2) * 3, y - 14);
    ctx.stroke();

    // Legs
    ctx.fillStyle = '#1a1a1a';
    const bl1 = Math.sin(legPhase) * 5;
    const bl2 = Math.sin(legPhase + Math.PI) * 5;
    ctx.fillRect(x + 2, y + 18 + bl1, 4, 8 - bl1);
    ctx.fillRect(x + 8, y + 18 + bl2, 4, 8 - bl2);
    ctx.fillRect(x + 16, y + 18 + bl2, 4, 8 - bl2);
    ctx.fillRect(x + 22, y + 18 + bl1, 4, 8 - bl1);

    // White paws (tuxedo)
    ctx.fillStyle = '#FFF';
    [x + 1, x + 7, x + 15, x + 21].forEach((lx, i) => {
      const off = i < 2 ? (i === 0 ? bl1 : bl2) : (i === 2 ? bl2 : bl1);
      ctx.fillRect(lx, Math.min(y + 24 + off, g.groundY - 2), 6, 3);
    });

    // Body (black)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(x + 13, y + 12, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // White chest (tuxedo pattern)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 14, 6, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(x + 24, y + 4, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // White face stripe
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(x + 24, y - 3);
    ctx.lineTo(x + 22, y + 6);
    ctx.lineTo(x + 26, y + 6);
    ctx.closePath();
    ctx.fill();

    // Ears (pointed)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(x + 18, y - 1);
    ctx.lineTo(x + 16, y - 8);
    ctx.lineTo(x + 22, y - 1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 26, y - 1);
    ctx.lineTo(x + 28, y - 8);
    ctx.lineTo(x + 32, y - 1);
    ctx.closePath();
    ctx.fill();

    // Inner ears (pink)
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.moveTo(x + 19, y);
    ctx.lineTo(x + 17.5, y - 5);
    ctx.lineTo(x + 21, y);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 27, y);
    ctx.lineTo(x + 28.5, y - 5);
    ctx.lineTo(x + 31, y);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.arc(x + 22, y + 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 27, y + 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + 22, y + 3, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 27, y + 3, 1, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle trail (power-up effect)
    ctx.globalAlpha = 0.6;
    for (let i = 1; i <= 4; i++) {
      const sx = x - i * 10 + Math.sin(g.frame * 0.4 + i) * 3;
      const sy = y + 10 + Math.cos(g.frame * 0.3 + i) * 4;
      const sparkleSize = 3 - i * 0.5;
      ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FFA500';
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(sparkleSize, 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, []);

  const drawObstacle = useCallback((ctx: CanvasRenderingContext2D, obs: Obstacle, g: GameData) => {
    switch (obs.type) {
      case 'mud': {
        ctx.fillStyle = '#6B4226';
        ctx.beginPath();
        ctx.ellipse(obs.x + obs.w / 2, obs.y + obs.h / 2, obs.w / 2, obs.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B5A2B';
        ctx.beginPath();
        ctx.ellipse(obs.x + obs.w / 2, obs.y + obs.h / 2 - 1, obs.w / 2 - 4, obs.h / 2 - 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Splash marks
        ctx.fillStyle = '#6B4226';
        ctx.beginPath();
        ctx.arc(obs.x + 8, obs.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(obs.x + obs.w - 6, obs.y - 1, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'goose': {
        const frame = (obs.gooseFrame || 0);
        // Body
        ctx.fillStyle = '#EEEEEE';
        ctx.beginPath();
        ctx.ellipse(obs.x + 15, obs.y + 20, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        // Neck
        ctx.fillStyle = '#DDDDDD';
        ctx.fillRect(obs.x + 20, obs.y + 2, 6, 16);
        // Head
        ctx.fillStyle = '#EEEEEE';
        ctx.beginPath();
        ctx.ellipse(obs.x + 23, obs.y + 2, 6, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Beak
        ctx.fillStyle = '#FF6600';
        ctx.beginPath();
        ctx.moveTo(obs.x + 28, obs.y);
        ctx.lineTo(obs.x + 34, obs.y + 3);
        ctx.lineTo(obs.x + 28, obs.y + 5);
        ctx.closePath();
        ctx.fill();
        // Angry eye
        ctx.fillStyle = '#CC0000';
        ctx.beginPath();
        ctx.arc(obs.x + 24, obs.y, 2, 0, Math.PI * 2);
        ctx.fill();
        // Angry marks
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(obs.x + 28, obs.y - 6);
        ctx.lineTo(obs.x + 31, obs.y - 3);
        ctx.moveTo(obs.x + 31, obs.y - 6);
        ctx.lineTo(obs.x + 28, obs.y - 3);
        ctx.stroke();
        // Wings (flapping)
        ctx.fillStyle = '#CCCCCC';
        const wingUp = Math.sin(g.frame * 0.15 + (frame || 0)) * 4;
        ctx.beginPath();
        ctx.ellipse(obs.x + 10, obs.y + 14 + wingUp, 8, 5, -0.3, 0, Math.PI * 2);
        ctx.fill();
        // Legs
        ctx.fillStyle = '#FF6600';
        ctx.fillRect(obs.x + 10, obs.y + 28, 3, 6);
        ctx.fillRect(obs.x + 18, obs.y + 28, 3, 6);
        break;
      }
      case 'fencepost': {
        // Post
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        // Top cap
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(obs.x - 2, obs.y, obs.w + 4, 5);
        // Wood grain
        ctx.strokeStyle = '#6B3410';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(obs.x + 3 + i * 4, obs.y + 8);
          ctx.lineTo(obs.x + 3 + i * 4, obs.y + obs.h);
          ctx.stroke();
        }
        break;
      }
      case 'rock': {
        ctx.fillStyle = '#777';
        ctx.beginPath();
        ctx.moveTo(obs.x + 4, obs.y + obs.h);
        ctx.lineTo(obs.x, obs.y + obs.h * 0.6);
        ctx.lineTo(obs.x + 6, obs.y + 2);
        ctx.lineTo(obs.x + obs.w * 0.6, obs.y);
        ctx.lineTo(obs.x + obs.w, obs.y + obs.h * 0.4);
        ctx.lineTo(obs.x + obs.w - 2, obs.y + obs.h);
        ctx.closePath();
        ctx.fill();
        // Highlight
        ctx.fillStyle = '#999';
        ctx.beginPath();
        ctx.moveTo(obs.x + 8, obs.y + 6);
        ctx.lineTo(obs.x + obs.w * 0.5, obs.y + 3);
        ctx.lineTo(obs.x + obs.w * 0.6, obs.y + obs.h * 0.4);
        ctx.lineTo(obs.x + 8, obs.y + obs.h * 0.5);
        ctx.closePath();
        ctx.fill();
        break;
      }
    }
  }, []);

  const drawCollectible = useCallback((ctx: CanvasRenderingContext2D, c: Collectible, g: GameData) => {
    if (c.collected) return;
    const bob = Math.sin(g.frame * 0.08 + c.bob) * 3;
    const cy = c.y + bob;

    switch (c.type) {
      case 'bone': {
        ctx.fillStyle = '#FFF8DC';
        ctx.strokeStyle = '#DDD';
        ctx.lineWidth = 1;
        // Bone shape
        ctx.fillRect(c.x - 6, cy - 2, 12, 4);
        ctx.beginPath();
        ctx.arc(c.x - 6, cy - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(c.x - 6, cy + 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(c.x + 6, cy - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(c.x + 6, cy + 2, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'tennis': {
        ctx.fillStyle = '#ADFF2F';
        ctx.beginPath();
        ctx.arc(c.x, cy, 7, 0, Math.PI * 2);
        ctx.fill();
        // Tennis ball line
        ctx.strokeStyle = '#7CFC00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(c.x, cy, 7, -0.5, 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c.x, cy, 7, Math.PI - 0.5, Math.PI + 0.5);
        ctx.stroke();
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(c.x - 2, cy - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'bacon': {
        ctx.fillStyle = '#CC3333';
        // Wavy bacon strip
        ctx.beginPath();
        ctx.moveTo(c.x - 8, cy - 3);
        ctx.quadraticCurveTo(c.x - 4, cy - 6, c.x, cy - 3);
        ctx.quadraticCurveTo(c.x + 4, cy, c.x + 8, cy - 3);
        ctx.lineTo(c.x + 8, cy + 3);
        ctx.quadraticCurveTo(c.x + 4, cy + 6, c.x, cy + 3);
        ctx.quadraticCurveTo(c.x - 4, cy, c.x - 8, cy + 3);
        ctx.closePath();
        ctx.fill();
        // Fat streaks
        ctx.fillStyle = '#FFAAAA';
        ctx.beginPath();
        ctx.ellipse(c.x - 3, cy, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(c.x + 4, cy - 1, 2, 1, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'heart': {
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.moveTo(c.x, cy + 5);
        ctx.bezierCurveTo(c.x - 8, cy - 2, c.x - 8, cy - 8, c.x, cy - 4);
        ctx.bezierCurveTo(c.x + 8, cy - 8, c.x + 8, cy - 2, c.x, cy + 5);
        ctx.fill();
        // Sparkle
        if (g.frame % 20 < 10) {
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(c.x - 3, cy - 5, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
    }
  }, []);

  const drawCouch = useCallback((ctx: CanvasRenderingContext2D, g: GameData) => {
    if (!g.couch.active && !g.couch.resting) return;
    const cx = g.couch.x;
    const cy = g.groundY - 35;

    // Couch base
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(cx, cy + 20, 70, 15);

    // Cushions
    ctx.fillStyle = '#CD853F';
    ctx.beginPath();
    ctx.roundRect(cx + 2, cy + 5, 66, 18, 4);
    ctx.fill();

    // Back
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.roundRect(cx + 4, cy - 10, 62, 18, 5);
    ctx.fill();

    // Armrests
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.roundRect(cx - 4, cy - 5, 12, 30, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx + 62, cy - 5, 12, 30, 4);
    ctx.fill();

    // Pillow
    ctx.fillStyle = '#DEB887';
    ctx.beginPath();
    ctx.ellipse(cx + 55, cy + 8, 8, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(cx + 4, cy + 34, 5, 6);
    ctx.fillRect(cx + 61, cy + 34, 5, 6);

    // "ZOE'S SPOT" text with glow
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("ZOE'S SPOT", cx + 35, cy - 14);
    ctx.textAlign = 'left';
  }, []);

  const drawZoeResting = useCallback((ctx: CanvasRenderingContext2D, g: GameData) => {
    if (!g.couch.resting) return;
    const cx = g.couch.x;
    const cy = g.groundY - 35;

    // Zoe curled up on couch
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(cx + 30, cy + 10, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head tucked in
    ctx.beginPath();
    ctx.ellipse(cx + 42, cy + 6, 8, 7, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Grey muzzle
    ctx.fillStyle = '#9a9a9a';
    ctx.beginPath();
    ctx.ellipse(cx + 47, cy + 9, 4, 3, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Closed eye (sleeping)
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx + 43, cy + 4, 2, 0, Math.PI);
    ctx.stroke();

    // ZZZ
    const zzFrame = Math.floor(g.frame / 30) % 3;
    ctx.fillStyle = '#87CEEB';
    ctx.font = 'bold 8px monospace';
    ctx.globalAlpha = 0.8;
    for (let i = 0; i <= zzFrame; i++) {
      ctx.fillText('z', cx + 48 + i * 6, cy - 4 - i * 8);
    }
    ctx.globalAlpha = 1;

    // Heart
    if (g.frame % 60 < 30) {
      ctx.fillStyle = '#FF69B4';
      ctx.beginPath();
      const hx = cx + 22;
      const hy = cy - 8;
      ctx.moveTo(hx, hy + 3);
      ctx.bezierCurveTo(hx - 5, hy - 1, hx - 5, hy - 5, hx, hy - 2);
      ctx.bezierCurveTo(hx + 5, hy - 5, hx + 5, hy - 1, hx, hy + 3);
      ctx.fill();
    }
  }, []);

  // --- Environment Background Drawing ---

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, g: GameData) => {
    const colors = getEnvColors(g.env);
    const { canvasW, canvasH, groundY, scrollX } = g;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, colors.skyTop);
    skyGrad.addColorStop(1, colors.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(canvasW - 60, 50, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF8DC';
    ctx.beginPath();
    ctx.arc(canvasW - 60, 50, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Clouds
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.7;
    g.clouds.forEach((c) => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w / 2, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x - c.w / 4, c.y - 6, c.w / 3, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.w / 4, c.y - 4, c.w / 3, 9, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Far hills / background elements
    ctx.fillStyle = colors.hillFar;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    for (let x = 0; x <= canvasW; x += 20) {
      const hillH = 25 + Math.sin((x + scrollX * 0.1) * 0.012) * 20 + Math.sin((x + scrollX * 0.1) * 0.025) * 10;
      ctx.lineTo(x, groundY - hillH);
    }
    ctx.lineTo(canvasW, groundY);
    ctx.fill();

    // Mid hills
    ctx.fillStyle = colors.hillNear;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    for (let x = 0; x <= canvasW; x += 15) {
      const hillH = 15 + Math.sin((x + scrollX * 0.25) * 0.018) * 12 + Math.sin((x + scrollX * 0.25) * 0.04) * 8;
      ctx.lineTo(x, groundY - hillH);
    }
    ctx.lineTo(canvasW, groundY);
    ctx.fill();

    // Environment-specific background decorations
    if (g.env === 'farm') {
      drawFarmBg(ctx, g);
    } else if (g.env === 'forest') {
      drawForestBg(ctx, g);
    } else {
      drawLakeBg(ctx, g);
    }

    // Ground
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvasH);
    groundGrad.addColorStop(0, colors.groundTop);
    groundGrad.addColorStop(1, colors.groundBottom);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, canvasW, canvasH - groundY);

    // Ground detail line
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, groundY, canvasW, 3);

    // Ground texture
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for (let i = 0; i < 30; i++) {
      const gx = ((i * 35 + scrollX * 0.8) % (canvasW + 40)) - 20;
      ctx.beginPath();
      ctx.arc(gx, groundY + 10 + (i % 3) * 15, 2 + (i % 4), 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const drawFarmBg = (ctx: CanvasRenderingContext2D, g: GameData) => {
    const { canvasW, groundY, scrollX } = g;

    // Red barn (far background)
    const barnX = ((300 - scrollX * 0.08) % (canvasW + 400)) + canvasW * 0.3;
    if (barnX > -100 && barnX < canvasW + 100) {
      ctx.globalAlpha = 0.5;
      // Barn body
      ctx.fillStyle = '#8B0000';
      ctx.fillRect(barnX, groundY - 70, 60, 50);
      // Roof
      ctx.fillStyle = '#654321';
      ctx.beginPath();
      ctx.moveTo(barnX - 5, groundY - 70);
      ctx.lineTo(barnX + 30, groundY - 95);
      ctx.lineTo(barnX + 65, groundY - 70);
      ctx.closePath();
      ctx.fill();
      // Door
      ctx.fillStyle = '#5a0000';
      ctx.fillRect(barnX + 20, groundY - 40, 20, 20);
      // White X on door
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(barnX + 22, groundY - 38);
      ctx.lineTo(barnX + 38, groundY - 22);
      ctx.moveTo(barnX + 38, groundY - 38);
      ctx.lineTo(barnX + 22, groundY - 22);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Fence in background
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 15; i++) {
      const fx = ((i * 40 - scrollX * 0.15) % (canvasW + 100)) - 50;
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(fx, groundY - 25, 3, 20);
    }
    // Fence rails
    ctx.beginPath();
    for (let y = 0; y < 2; y++) {
      ctx.moveTo(0, groundY - 18 + y * 8);
      ctx.lineTo(canvasW, groundY - 18 + y * 8);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Background chickens (tiny)
    for (let i = 0; i < 3; i++) {
      const cx = ((i * 180 + 50 - scrollX * 0.12) % (canvasW + 200)) - 50;
      if (cx > -20 && cx < canvasW + 20) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#D2691E';
        ctx.beginPath();
        ctx.ellipse(cx, groundY - 10, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(cx - 1, groundY - 16, 3, 4);
        ctx.globalAlpha = 1;
      }
    }
  };

  const drawForestBg = (ctx: CanvasRenderingContext2D, g: GameData) => {
    const { canvasW, groundY, scrollX } = g;

    // Pine trees in background
    for (let i = 0; i < 8; i++) {
      const tx = ((i * 80 + 20 - scrollX * 0.12) % (canvasW + 200)) - 50;
      const th = 50 + (i % 3) * 15;
      if (tx > -40 && tx < canvasW + 40) {
        ctx.globalAlpha = 0.4;
        // Trunk
        ctx.fillStyle = '#5C4033';
        ctx.fillRect(tx - 3, groundY - th + 20, 6, th - 20);
        // Foliage layers
        ctx.fillStyle = '#2d5a1e';
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.moveTo(tx - 15 + j * 3, groundY - th + 25 + j * 14);
          ctx.lineTo(tx, groundY - th - 5 + j * 14);
          ctx.lineTo(tx + 15 - j * 3, groundY - th + 25 + j * 14);
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }

    // Mushrooms
    for (let i = 0; i < 5; i++) {
      const mx = ((i * 120 + 30 - scrollX * 0.2) % (canvasW + 200)) - 50;
      if (mx > -10 && mx < canvasW + 10) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(mx - 1, groundY - 8, 3, 6);
        ctx.fillStyle = '#CC3333';
        ctx.beginPath();
        ctx.arc(mx, groundY - 9, 5, Math.PI, Math.PI * 2);
        ctx.fill();
        // White dots
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(mx - 2, groundY - 11, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(mx + 2, groundY - 10, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Butterflies
    for (let i = 0; i < 3; i++) {
      const bx = ((i * 170 + 80 - scrollX * 0.08) % (canvasW + 200)) - 50;
      const by = groundY - 80 - i * 30 + Math.sin(g.frame * 0.05 + i) * 15;
      if (bx > -10 && bx < canvasW + 10) {
        ctx.globalAlpha = 0.6;
        const wingSpread = Math.abs(Math.sin(g.frame * 0.15 + i * 2)) * 5;
        const bColors = ['#FF69B4', '#87CEEB', '#FFD700'];
        ctx.fillStyle = bColors[i % 3];
        ctx.beginPath();
        ctx.ellipse(bx - wingSpread, by, 3, 2, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(bx + wingSpread, by, 3, 2, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillRect(bx - 0.5, by - 1, 1, 3);
        ctx.globalAlpha = 1;
      }
    }
  };

  const drawLakeBg = (ctx: CanvasRenderingContext2D, g: GameData) => {
    const { canvasW, groundY, scrollX } = g;

    // Water area (behind the ground)
    ctx.fillStyle = '#4a90a8';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, groundY - 15, canvasW, 20);
    ctx.globalAlpha = 1;

    // Water ripples
    ctx.strokeStyle = '#87CEEB';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 8; i++) {
      const rx = ((i * 70 - scrollX * 0.3) % (canvasW + 100)) - 50;
      ctx.beginPath();
      ctx.moveTo(rx, groundY - 6 + Math.sin(g.frame * 0.03 + i) * 2);
      ctx.quadraticCurveTo(rx + 15, groundY - 10 + Math.sin(g.frame * 0.03 + i + 1) * 2, rx + 30, groundY - 6 + Math.sin(g.frame * 0.03 + i + 2) * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Lily pads
    for (let i = 0; i < 4; i++) {
      const lx = ((i * 140 + 60 - scrollX * 0.2) % (canvasW + 200)) - 50;
      if (lx > -20 && lx < canvasW + 20) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.ellipse(lx, groundY - 5, 10, 5, 0, 0.2, Math.PI * 1.8);
        ctx.fill();
        // Tiny flower on some
        if (i % 2 === 0) {
          ctx.fillStyle = '#FF69B4';
          ctx.beginPath();
          ctx.arc(lx + 2, groundY - 8, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(lx + 2, groundY - 8, 1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }

    // Dock
    const dockX = ((400 - scrollX * 0.1) % (canvasW + 500)) + canvasW * 0.2;
    if (dockX > -80 && dockX < canvasW + 80) {
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(dockX, groundY - 20, 60, 6);
      // Posts
      ctx.fillStyle = '#654321';
      ctx.fillRect(dockX + 5, groundY - 20, 5, 25);
      ctx.fillRect(dockX + 50, groundY - 20, 5, 25);
      ctx.globalAlpha = 1;
    }

    // Cattails
    for (let i = 0; i < 5; i++) {
      const ctX = ((i * 110 + 40 - scrollX * 0.15) % (canvasW + 200)) - 50;
      if (ctX > -10 && ctX < canvasW + 10) {
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#2E8B57';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ctX, groundY);
        ctx.lineTo(ctX + Math.sin(g.frame * 0.02 + i) * 2, groundY - 30);
        ctx.stroke();
        ctx.fillStyle = '#5C4033';
        ctx.beginPath();
        ctx.ellipse(ctX + Math.sin(g.frame * 0.02 + i) * 2, groundY - 32, 2.5, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  };

  // --- HUD Drawing ---

  const drawHUD = useCallback((ctx: CanvasRenderingContext2D, g: GameData) => {
    // Score background
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.roundRect(g.canvasW - 120, 8, 112, 28, 6);
    ctx.fill();

    ctx.fillStyle = '#FFF8DC';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${g.score}`, g.canvasW - 16, 28);
    ctx.textAlign = 'left';

    // Paw print icon next to score
    ctx.fillStyle = '#DAA520';
    ctx.beginPath();
    ctx.arc(g.canvasW - 108, 22, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(g.canvasW - 114, 18, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(g.canvasW - 102, 18, 2, 0, Math.PI * 2);
    ctx.fill();

    // Environment indicator
    const envName = g.env.charAt(0).toUpperCase() + g.env.slice(1);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 70, 20, 6);
    ctx.fill();
    ctx.fillStyle = '#FFF8DC';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(envName, 16, 22);

    // Combo indicator
    if (g.comboCount > 1 && g.comboTimer > 0) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`x${g.comboCount} COMBO!`, g.canvasW / 2, 25);
      ctx.textAlign = 'left';
    }

    // Bruce indicator
    if (g.bruce.active) {
      const bruceTime = Math.ceil(g.bruce.timer / 60);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.roundRect(8, 32, 90, 18, 6);
      ctx.fill();
      ctx.fillStyle = '#90EE90';
      ctx.font = 'bold 8px monospace';
      ctx.fillText(`BRUCE: ${bruceTime}s`, 14, 44);
    }

    // Speed indicator
    const speedLevel = Math.floor((g.scrollSpeed - g.baseSpeed) / 0.5) + 1;
    if (speedLevel > 1) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.roundRect(8, g.bruce.active ? 54 : 32, 60, 16, 4);
      ctx.fill();
      ctx.fillStyle = '#FF8C00';
      ctx.font = 'bold 7px monospace';
      ctx.fillText(`SPD x${speedLevel}`, 14, (g.bruce.active ? 54 : 32) + 12);
    }
  }, []);

  // --- Main Game Loop ---

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const g = gameRef.current;
    if (!canvas || !ctx || !g) return;
    if (phaseRef.current !== 'playing') return;

    g.frame++;

    // --- COUCH REST HANDLING ---
    if (g.couch.resting) {
      g.couch.restTimer--;
      if (g.couch.restTimer <= 0) {
        g.couch.resting = false;
        g.couch.active = false;
        g.zoe.x = 70;
        g.zoe.y = g.groundY - g.zoe.h;
        g.zoe.grounded = true;
      }

      // Draw resting scene
      drawBackground(ctx, g);
      drawCouch(ctx, g);
      drawZoeResting(ctx, g);
      drawHUD(ctx, g);

      // Floating texts
      g.floatingTexts = g.floatingTexts.filter((ft) => {
        ft.y -= 0.8;
        ft.life--;
        ctx.globalAlpha = Math.min(1, ft.life / 30);
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
        return ft.life > 0;
      });

      animRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // --- SPEED & DIFFICULTY ---
    g.scrollSpeed = g.baseSpeed + g.score * 0.002;
    if (g.scrollSpeed > 10) g.scrollSpeed = 10;
    const speed = g.scrollSpeed;

    g.scrollX += speed;
    g.lastObstacleX += speed;
    g.lastCollectibleX += speed;

    // --- ENVIRONMENT TRANSITIONS ---
    const targetEnv = getEnvForScore(g.score);
    if (targetEnv !== g.env) {
      g.envTransition++;
      if (g.envTransition > 30) {
        g.env = targetEnv;
        g.envTransition = 0;
      }
    }

    // --- ZOE PHYSICS ---
    if (!g.zoe.grounded) {
      g.zoe.vy += 0.65;
      g.zoe.y += g.zoe.vy;
      if (g.zoe.y >= g.groundY - g.zoe.h) {
        g.zoe.y = g.groundY - g.zoe.h;
        g.zoe.grounded = true;
        g.zoe.jumpsLeft = 2;
        g.zoe.vy = 0;
      }
    }

    // Animation
    g.zoe.legFrame = g.frame;
    if (g.zoe.invincible > 0) g.zoe.invincible--;

    // --- COMBO TIMER ---
    if (g.comboTimer > 0) {
      g.comboTimer--;
      if (g.comboTimer <= 0) {
        g.comboCount = 0;
      }
    }

    // --- CLOUDS ---
    g.clouds.forEach((c) => {
      c.x -= c.speed;
      if (c.x + c.w < -20) {
        c.x = g.canvasW + 40;
        c.y = 20 + Math.random() * 80;
      }
    });

    // --- SPAWN ---
    spawnObstacle(g);
    spawnCollectible(g);
    spawnBruce(g);
    spawnCouch(g);

    // --- MOVE OBSTACLES ---
    g.obstacles = g.obstacles.filter((o) => {
      o.x -= speed;
      if (o.type === 'goose') {
        o.gooseFrame = (o.gooseFrame || 0) + 0.1;
      }
      return o.x > -60;
    });

    // --- MOVE COLLECTIBLES ---
    g.collectibles = g.collectibles.filter((c) => {
      c.x -= speed;
      return c.x > -30 && !c.collected;
    });

    // --- MOVE COUCH ---
    if (g.couch.active && !g.couch.resting) {
      g.couch.x -= speed * 0.5;
      if (g.couch.x < -100) {
        g.couch.active = false;
      }
    }

    // --- BRUCE ---
    if (g.bruce.active) {
      g.bruce.timer--;
      g.bruce.frame++;

      // Bruce follows behind Zoe
      const targetX = g.zoe.x - 50;
      g.bruce.x += (targetX - g.bruce.x) * 0.08;
      g.bruce.y = g.groundY - 28;

      if (g.bruce.timer <= 0) {
        g.bruce.active = false;
        addParticles(g, g.bruce.x, g.bruce.y, '#FFD700', 12);
        g.floatingTexts.push({
          x: g.bruce.x,
          y: g.bruce.y - 20,
          text: 'BYE BRUCE!',
          color: '#87CEEB',
          life: 60,
        });
      }
    }

    // --- PARTICLES ---
    g.particles = g.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.life--;
      return p.life > 0;
    });

    // --- COLLISION: OBSTACLES ---
    for (let i = g.obstacles.length - 1; i >= 0; i--) {
      const obs = g.obstacles[i];

      // Bruce clears obstacles
      if (g.bruce.active && obs.x < g.bruce.x + 60 && obs.x > g.bruce.x - 10) {
        addParticles(g, obs.x + obs.w / 2, obs.y, '#FFD700', 10);
        g.score += 5;
        g.floatingTexts.push({
          x: obs.x,
          y: obs.y - 10,
          text: '+5',
          color: '#FFD700',
          life: 40,
        });
        g.obstacles.splice(i, 1);
        continue;
      }

      if (
        g.zoe.invincible <= 0 &&
        collides(g.zoe.x, g.zoe.y, g.zoe.w, g.zoe.h, obs.x, obs.y, obs.w, obs.h)
      ) {
        // Game over
        addParticles(g, g.zoe.x + 20, g.zoe.y + 18, '#FF4444', 15);
        setDisplayScore(g.score);
        setPhase('gameover');
        onGameOver(g.score);
        return;
      }
    }

    // --- COLLISION: COLLECTIBLES ---
    for (const c of g.collectibles) {
      if (c.collected) continue;
      if (collides(g.zoe.x, g.zoe.y, g.zoe.w, g.zoe.h, c.x - 8, c.y - 8, 16, 16)) {
        c.collected = true;
        let pts = 0;
        let color = '#FFF';
        switch (c.type) {
          case 'bone': pts = 10; color = '#FFF8DC'; break;
          case 'tennis': pts = 25; color = '#ADFF2F'; break;
          case 'bacon': pts = 50; color = '#FF6666'; break;
          case 'heart': pts = 100; color = '#FF69B4'; break;
        }

        g.comboCount++;
        g.comboTimer = 90;
        const comboBonus = g.comboCount > 1 ? Math.floor(pts * (g.comboCount - 1) * 0.25) : 0;
        pts += comboBonus;

        g.score += pts;
        setDisplayScore(g.score);

        addParticles(g, c.x, c.y, color, c.type === 'heart' ? 15 : 8);
        g.floatingTexts.push({
          x: c.x,
          y: c.y - 10,
          text: `+${pts}`,
          color,
          life: 50,
        });
      }
    }

    // --- COLLISION: COUCH ---
    if (
      g.couch.active &&
      !g.couch.resting &&
      collides(g.zoe.x, g.zoe.y, g.zoe.w, g.zoe.h, g.couch.x, g.groundY - 35, 70, 35)
    ) {
      g.couch.resting = true;
      g.couch.restTimer = 120;
      g.score += 200;
      setDisplayScore(g.score);
      addParticles(g, g.couch.x + 35, g.groundY - 50, '#FF69B4', 20);
      g.floatingTexts.push({
        x: g.couch.x + 35,
        y: g.groundY - 70,
        text: '+200 REST!',
        color: '#FF69B4',
        life: 80,
      });
      g.obstacles = [];
    }

    // --- SCORE FROM DISTANCE ---
    if (g.frame % 10 === 0) {
      g.score += 1;
      setDisplayScore(g.score);
    }

    // ===== RENDER =====
    drawBackground(ctx, g);

    // Draw obstacles
    g.obstacles.forEach((obs) => drawObstacle(ctx, obs, g));

    // Draw collectibles
    g.collectibles.forEach((c) => drawCollectible(ctx, c, g));

    // Draw couch
    drawCouch(ctx, g);

    // Draw Bruce
    drawBruce(ctx, g);

    // Draw Zoe
    drawZoe(ctx, g);

    // Draw particles
    g.particles.forEach((p) => {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Floating texts
    g.floatingTexts = g.floatingTexts.filter((ft) => {
      ft.y -= 1;
      ft.life--;
      ctx.globalAlpha = Math.min(1, ft.life / 25);
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
      return ft.life > 0;
    });

    // HUD
    drawHUD(ctx, g);

    animRef.current = requestAnimationFrame(gameLoop);
  }, [
    spawnObstacle, spawnCollectible, spawnBruce, spawnCouch,
    addParticles, drawBackground, drawZoe, drawBruce,
    drawObstacle, drawCollectible, drawCouch, drawZoeResting,
    drawHUD, onGameOver,
  ]);

  // --- Start Game ---

  const startGame = useCallback(() => {
    resize();
    initGame();
    setDisplayScore(0);
    setPhase('playing');
  }, [initGame, resize]);

  // --- Effects ---

  useEffect(() => {
    if (phase === 'playing') {
      animRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [phase, gameLoop]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  // --- Controls ---

  useEffect(() => {
    if (phase !== 'playing') return;

    const jump = () => {
      const g = gameRef.current;
      if (!g || g.couch.resting) return;
      if (g.zoe.jumpsLeft > 0) {
        g.zoe.grounded = false;
        g.zoe.vy = g.zoe.jumpsLeft === 2 ? -12 : -10;
        g.zoe.jumpsLeft--;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      jump();
    };

    const handleClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas && e.target === canvas) {
        jump();
      }
    };

    const canvas = canvasRef.current;
    window.addEventListener('keydown', handleKeyDown);
    canvas?.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas?.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas?.removeEventListener('touchstart', handleTouchStart);
      canvas?.removeEventListener('click', handleClick);
    };
  }, [phase]);

  // --- Start screen controls ---

  useEffect(() => {
    if (phase !== 'start') return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        startGame();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      startGame();
    };

    const handleClick = () => {
      startGame();
    };

    const canvas = canvasRef.current;
    window.addEventListener('keydown', handleKey);
    canvas?.addEventListener('touchstart', handleTouch, { passive: false });
    canvas?.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKey);
      canvas?.removeEventListener('touchstart', handleTouch);
      canvas?.removeEventListener('click', handleClick);
    };
  }, [phase, startGame]);

  // --- Draw Start Screen ---

  useEffect(() => {
    if (phase !== 'start') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1a2a0a');
    grad.addColorStop(0.5, '#2d3f1a');
    grad.addColorStop(1, '#1a2a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Rolling hills silhouette
    ctx.fillStyle = '#223315';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) {
      ctx.lineTo(x, h - 120 + Math.sin(x * 0.02) * 30 + Math.sin(x * 0.05) * 15);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#1a2a0a';
    ctx.fillRect(0, h - 90, w, 90);

    // Title
    ctx.fillStyle = '#DAA520';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("ZOE'S ADVENTURE", w / 2, 120);

    // Subtitle
    ctx.fillStyle = '#9a9a9a';
    ctx.font = '11px monospace';
    ctx.fillText('The Couch Commander Goes Outside', w / 2, 145);

    // Draw Zoe on start screen (static, larger)
    ctx.save();
    ctx.translate(w / 2 - 30, 200);
    ctx.scale(2, 2);
    // Body
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(18, 18, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.ellipse(18, 22, 14, 8, 0, 0, Math.PI);
    ctx.fill();
    // Head
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(34, 8, 12, 11, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Muzzle
    ctx.fillStyle = '#9a9a9a';
    ctx.beginPath();
    ctx.ellipse(42, 12, 7, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b8b8b8';
    ctx.beginPath();
    ctx.ellipse(43, 13, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nose
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(47, 10, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.ellipse(38, 5, 4, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a2010';
    ctx.beginPath();
    ctx.ellipse(39, 5, 2.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(39.5, 5, 1.5, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(40.5, 4, 0.8, 0, Math.PI * 2);
    ctx.fill();
    // Ear
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.ellipse(28, 8, 6, 10, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-2, 10);
    ctx.quadraticCurveTo(-10, 0, -6, -6);
    ctx.stroke();
    // Legs
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(6, 28, 5, 8);
    ctx.fillRect(14, 28, 5, 8);
    ctx.fillRect(26, 28, 5, 8);
    ctx.fillRect(34, 28, 5, 8);
    ctx.restore();

    // Instructions
    ctx.fillStyle = '#FFF8DC';
    ctx.font = '11px monospace';
    const instructions = [
      'Tap / Click / SPACE to Jump',
      'Double tap for Double Jump!',
      '',
      'Collect treats for points:',
      'Bone +10  Tennis +25  Bacon +50  Heart +100',
      '',
      'Avoid: mud, angry geese, fences, rocks',
      'Bruce the cat clears obstacles!',
      'Find the couch for bonus rest!',
    ];
    instructions.forEach((line, i) => {
      ctx.fillStyle = i === 3 || i === 6 ? '#DAA520' : '#FFF8DC99';
      ctx.fillText(line, w / 2, 330 + i * 18);
    });

    // Start button prompt
    const pulse = Math.sin(Date.now() * 0.004) * 0.3 + 0.7;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#DAA520';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('TAP TO START', w / 2, h - 60);
    ctx.font = '10px monospace';
    ctx.fillText('or press SPACE', w / 2, h - 40);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';

    // Animate the start screen
    const startAnim = requestAnimationFrame(function tick() {
      if (phaseRef.current !== 'start') return;
      const canvas2 = canvasRef.current;
      const ctx2 = canvas2?.getContext('2d');
      if (!canvas2 || !ctx2) return;

      // Redraw just the pulsing part
      ctx2.fillStyle = '#1a2a0a';
      ctx2.fillRect(0, h - 80, w, 50);

      const p = Math.sin(Date.now() * 0.004) * 0.3 + 0.7;
      ctx2.globalAlpha = p;
      ctx2.fillStyle = '#DAA520';
      ctx2.font = 'bold 16px monospace';
      ctx2.textAlign = 'center';
      ctx2.fillText('TAP TO START', w / 2, h - 60);
      ctx2.font = '10px monospace';
      ctx2.fillText('or press SPACE', w / 2, h - 40);
      ctx2.globalAlpha = 1;
      ctx2.textAlign = 'left';

      requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(startAnim);
  }, [phase]);

  // --- Draw Game Over Screen ---

  useEffect(() => {
    if (phase !== 'gameover') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Overlay
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';

    // Title
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('WOOF! GAME OVER', w / 2, h / 2 - 80);

    // Score
    ctx.fillStyle = '#FFF8DC';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`SCORE: ${displayScore}`, w / 2, h / 2 - 40);

    // Zoe sad face
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2 + 10, 20, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9a9a9a';
    ctx.beginPath();
    ctx.ellipse(w / 2 + 8, h / 2 + 14, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(w / 2 + 2, h / 2 + 6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(w / 2 + 2, h / 2 + 7, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Sad mouth
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w / 2 + 8, h / 2 + 20, 4, Math.PI, 0);
    ctx.stroke();

    // Play again prompt
    ctx.fillStyle = '#DAA520';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('TAP TO PLAY AGAIN', w / 2, h / 2 + 70);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#FFF8DC88';
    ctx.fillText('or press SPACE', w / 2, h / 2 + 90);

    ctx.textAlign = 'left';
  }, [phase, displayScore]);

  // --- Game Over Controls ---

  useEffect(() => {
    if (phase !== 'gameover') return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        startGame();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      startGame();
    };

    const handleClick = () => {
      startGame();
    };

    const canvas = canvasRef.current;
    window.addEventListener('keydown', handleKey);
    canvas?.addEventListener('touchstart', handleTouch, { passive: false });
    canvas?.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKey);
      canvas?.removeEventListener('touchstart', handleTouch);
      canvas?.removeEventListener('click', handleClick);
    };
  }, [phase, startGame]);

  // --- Render ---

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
        position: 'relative',
        touchAction: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: 600,
          maxHeight: 'calc(100dvh - 60px)',
          borderRadius: 8,
          cursor: phase === 'playing' ? 'pointer' : 'default',
        }}
      />
    </div>
  );
}
