'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

const STORAGE_KEY = 'hereComesTheBride_highScore';
const GAME_DURATION = 75;
const TARGET_FPS = 60;

type GamePhase = 'start' | 'playing' | 'celebration' | 'gameover';
type PromptType = 'catch' | 'wave' | 'step' | 'dodge';

interface Prompt {
  x: number;
  y: number;
  type: PromptType;
  spawnTime: number;
  hitWindow: number;
  hit: boolean;
  missed: boolean;
  radius: number;
  animalType?: 'chicken' | 'goat' | 'dog';
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
  type: 'sparkle' | 'petal' | 'confetti';
  rotation: number;
  rotSpeed: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

interface FairyLight {
  x: number;
  y: number;
  phase: number;
  brightness: number;
}

interface Guest {
  x: number;
  y: number;
  side: 'top' | 'bottom';
  color: string;
  hatColor: string;
  waving: boolean;
  waveTimer: number;
  type: number;
}

interface BackgroundTree {
  x: number;
  size: number;
  shade: string;
}

interface HayBale {
  x: number;
  y: number;
  side: 'top' | 'bottom';
}

interface Wildflower {
  x: number;
  y: number;
  color: string;
  size: number;
  phase: number;
}

interface HereComesTheBrideProps {
  onGameOver: (score: number) => void;
}

export default function HereComesTheBride({ onGameOver }: HereComesTheBrideProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<GamePhase>('start');
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const animRef = useRef<number>(0);

  const gameRef = useRef<{
    canvasW: number;
    canvasH: number;
    frame: number;
    score: number;
    combo: number;
    maxCombo: number;
    graceMeter: number;
    graceActive: boolean;
    graceTimer: number;
    scrollX: number;
    scrollSpeed: number;
    baseSpeed: number;
    gameTime: number;
    totalTime: number;
    brideX: number;
    brideY: number;
    brideBob: number;
    brideDressSwing: number;
    brideVeilWave: number;
    prompts: Prompt[];
    particles: Particle[];
    floatingTexts: FloatingText[];
    fairyLightsTop: FairyLight[];
    fairyLightsBottom: FairyLight[];
    guests: Guest[];
    trees: BackgroundTree[];
    hayBales: HayBale[];
    wildflowers: Wildflower[];
    petalsCaught: number;
    wavesReturned: number;
    stepsHit: number;
    animalsDodged: number;
    promptsMissed: number;
    lastPromptTime: number;
    promptInterval: number;
    aisleY: number;
    aisleHeight: number;
    celebrationTimer: number;
    hitFeedback: number;
    missFeedback: number;
    lastTapTime: number;
    altarReached: boolean;
    promptZoneX: number;
    tapZones: { x: number; y: number; w: number; h: number; type: PromptType }[];
  } | null>(null);

  useEffect(() => {
    const hs = localStorage.getItem(STORAGE_KEY);
    if (hs) setHighScore(parseInt(hs, 10));
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (gameRef.current) {
      gameRef.current.canvasW = rect.width;
      gameRef.current.canvasH = rect.height;
      gameRef.current.aisleY = rect.height * 0.35;
      gameRef.current.aisleHeight = rect.height * 0.3;
      gameRef.current.brideY = rect.height * 0.35 + rect.height * 0.15;
      gameRef.current.promptZoneX = rect.width * 0.55;
    }
  }, []);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const aisleY = h * 0.35;
    const aisleHeight = h * 0.3;

    const trees: BackgroundTree[] = [];
    for (let i = 0; i < 30; i++) {
      trees.push({
        x: i * 120 + Math.random() * 60,
        size: 30 + Math.random() * 25,
        shade: `hsl(${120 + Math.random() * 30}, ${40 + Math.random() * 20}%, ${25 + Math.random() * 15}%)`,
      });
    }

    const fairyLightsTop: FairyLight[] = [];
    const fairyLightsBottom: FairyLight[] = [];
    for (let i = 0; i < 60; i++) {
      fairyLightsTop.push({
        x: i * 50 + Math.random() * 20,
        y: aisleY - 5 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        brightness: 0.5 + Math.random() * 0.5,
      });
      fairyLightsBottom.push({
        x: i * 50 + Math.random() * 20,
        y: aisleY + aisleHeight - 5 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        brightness: 0.5 + Math.random() * 0.5,
      });
    }

    const guests: Guest[] = [];
    const guestColors = ['#E8B4B8', '#B4C7E8', '#C5E8B4', '#E8D4B4', '#D4B4E8', '#B4E8D4'];
    const hatColors = ['#FFD700', '#FF69B4', '#87CEEB', '#DDA0DD', '#98FB98', '#F0E68C'];
    for (let i = 0; i < 40; i++) {
      const side = i < 20 ? 'top' : 'bottom';
      guests.push({
        x: 200 + i * 70 + Math.random() * 30,
        y: side === 'top' ? aisleY - 20 - Math.random() * 30 : aisleY + aisleHeight + 20 + Math.random() * 30,
        side,
        color: guestColors[Math.floor(Math.random() * guestColors.length)],
        hatColor: hatColors[Math.floor(Math.random() * hatColors.length)],
        waving: false,
        waveTimer: 0,
        type: Math.floor(Math.random() * 3),
      });
    }

    const hayBales: HayBale[] = [];
    for (let i = 0; i < 15; i++) {
      const side = i % 2 === 0 ? 'top' : 'bottom';
      hayBales.push({
        x: 300 + i * 200 + Math.random() * 80,
        y: side === 'top' ? aisleY - 55 - Math.random() * 20 : aisleY + aisleHeight + 35 + Math.random() * 20,
        side,
      });
    }

    const wildflowers: Wildflower[] = [];
    const flowerColors = ['#FF69B4', '#FFB6C1', '#DDA0DD', '#FF1493', '#FFA500', '#FFD700', '#FF6347', '#BA55D3'];
    for (let i = 0; i < 80; i++) {
      const side = Math.random() > 0.5;
      wildflowers.push({
        x: Math.random() * 3000,
        y: side
          ? aisleY - 8 - Math.random() * 50
          : aisleY + aisleHeight + 8 + Math.random() * 50,
        color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
        size: 2 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    gameRef.current = {
      canvasW: w,
      canvasH: h,
      frame: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      graceMeter: 0,
      graceActive: false,
      graceTimer: 0,
      scrollX: 0,
      scrollSpeed: 1.5,
      baseSpeed: 1.5,
      gameTime: 0,
      totalTime: GAME_DURATION * TARGET_FPS,
      brideX: w * 0.2,
      brideY: aisleY + aisleHeight * 0.5,
      brideBob: 0,
      brideDressSwing: 0,
      brideVeilWave: 0,
      prompts: [],
      particles: [],
      floatingTexts: [],
      fairyLightsTop,
      fairyLightsBottom,
      guests,
      trees,
      hayBales,
      wildflowers,
      petalsCaught: 0,
      wavesReturned: 0,
      stepsHit: 0,
      animalsDodged: 0,
      promptsMissed: 0,
      lastPromptTime: 0,
      promptInterval: 70,
      aisleY,
      aisleHeight,
      celebrationTimer: 0,
      hitFeedback: 0,
      missFeedback: 0,
      lastTapTime: 0,
      altarReached: false,
      promptZoneX: w * 0.55,
      tapZones: [],
    };
  }, []);

  const addParticles = useCallback((
    x: number, y: number, color: string, count: number,
    type: 'sparkle' | 'petal' | 'confetti' = 'sparkle'
  ) => {
    const g = gameRef.current;
    if (!g) return;
    for (let i = 0; i < count; i++) {
      g.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5 - 1,
        life: 30 + Math.random() * 30,
        maxLife: 60,
        color,
        size: type === 'confetti' ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }, []);

  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    const g = gameRef.current;
    if (!g) return;
    g.floatingTexts.push({ x, y, text, color, life: 45, maxLife: 45 });
  }, []);

  const spawnPrompt = useCallback((g: NonNullable<typeof gameRef.current>) => {
    const elapsed = g.gameTime / TARGET_FPS;
    const progress = elapsed / GAME_DURATION;

    const interval = Math.max(30, g.promptInterval - progress * 35);
    if (g.frame - g.lastPromptTime < interval) return;

    const types: PromptType[] = ['catch', 'wave', 'step', 'dodge'];
    const weights = [0.3, 0.25, 0.3, 0.15];
    let r = Math.random();
    let type: PromptType = 'step';
    for (let i = 0; i < types.length; i++) {
      r -= weights[i];
      if (r <= 0) { type = types[i]; break; }
    }

    const promptX = g.canvasW + 40;
    let promptY: number;
    const aisleCenter = g.aisleY + g.aisleHeight * 0.5;

    switch (type) {
      case 'catch':
        promptY = g.aisleY + Math.random() * g.aisleHeight * 0.4;
        break;
      case 'wave':
        promptY = Math.random() > 0.5
          ? g.aisleY - 10
          : g.aisleY + g.aisleHeight + 10;
        break;
      case 'step':
        promptY = aisleCenter - 5 + Math.random() * 10;
        break;
      case 'dodge':
        promptY = aisleCenter - 10 + Math.random() * 20;
        break;
      default:
        promptY = aisleCenter;
    }

    const animalTypes: ('chicken' | 'goat' | 'dog')[] = ['chicken', 'goat', 'dog'];

    g.prompts.push({
      x: promptX,
      y: promptY,
      type,
      spawnTime: g.frame,
      hitWindow: 30,
      hit: false,
      missed: false,
      radius: type === 'dodge' ? 28 : 22,
      animalType: type === 'dodge' ? animalTypes[Math.floor(Math.random() * animalTypes.length)] : undefined,
    });
    g.lastPromptTime = g.frame;
  }, []);

  const handleTap = useCallback((tapX: number, tapY: number) => {
    const g = gameRef.current;
    if (!g) return;

    g.lastTapTime = g.frame;

    let closestPrompt: Prompt | null = null;
    let closestDist = Infinity;

    for (const p of g.prompts) {
      if (p.hit || p.missed) continue;
      const dx = p.x - tapX;
      const dy = p.y - tapY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = p.radius + 30;
      if (dist < hitRadius && dist < closestDist) {
        closestDist = dist;
        closestPrompt = p;
      }
    }

    if (closestPrompt) {
      closestPrompt.hit = true;
      g.combo++;
      if (g.combo > g.maxCombo) g.maxCombo = g.combo;

      const multiplier = g.graceActive ? 2 : 1;
      let points = 0;
      let label = '';

      switch (closestPrompt.type) {
        case 'catch':
          points = 10 * multiplier;
          g.petalsCaught++;
          label = 'CATCH!';
          addParticles(closestPrompt.x, closestPrompt.y, '#FFB6C1', 8, 'petal');
          break;
        case 'wave':
          points = 15 * multiplier;
          g.wavesReturned++;
          label = 'WAVE!';
          addParticles(closestPrompt.x, closestPrompt.y, '#FFD700', 6, 'sparkle');
          for (const guest of g.guests) {
            if (Math.abs(guest.x - g.scrollX - closestPrompt.x) < 80) {
              guest.waving = true;
              guest.waveTimer = 40;
            }
          }
          break;
        case 'step':
          points = 20 * multiplier;
          g.stepsHit++;
          label = 'STEP!';
          addParticles(closestPrompt.x, closestPrompt.y, '#E8B4B8', 5, 'sparkle');
          break;
        case 'dodge':
          points = 25 * multiplier;
          g.animalsDodged++;
          label = 'DODGE!';
          addParticles(closestPrompt.x, closestPrompt.y, '#98FB98', 10, 'sparkle');
          break;
      }

      if (g.combo >= 5) {
        points += 5 * multiplier;
        label += ` x${g.combo}`;
      }

      g.score += points;
      g.hitFeedback = 10;
      setDisplayScore(g.score);

      g.graceMeter = Math.min(100, g.graceMeter + 8 + g.combo * 0.5);
      if (g.graceMeter >= 100 && !g.graceActive) {
        g.graceActive = true;
        g.graceTimer = 300;
        addParticles(g.brideX, g.brideY, '#FFD700', 20, 'sparkle');
        addFloatingText(g.canvasW * 0.5, g.canvasH * 0.2, 'GRACE MODE!', '#FFD700');
      }

      addFloatingText(closestPrompt.x, closestPrompt.y - 20, `+${points} ${label}`, '#FFFFFF');
    }
  }, [addParticles, addFloatingText]);

  const drawSky = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, g.canvasH);
    skyGrad.addColorStop(0, '#F4A460');
    skyGrad.addColorStop(0.3, '#FFDAB9');
    skyGrad.addColorStop(0.5, '#FFF8DC');
    skyGrad.addColorStop(1, '#F5DEB3');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, g.canvasW, g.canvasH);

    ctx.fillStyle = '#FFD700';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(g.canvasW - 60, 50, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(g.canvasW - 60, 50, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    const cloudOffsets = [
      { x: 80, y: 30, w: 60 },
      { x: 220, y: 50, w: 50 },
      { x: 380, y: 25, w: 70 },
    ];
    for (const c of cloudOffsets) {
      const cx = (c.x - g.scrollX * 0.05) % (g.canvasW + 200) - 50;
      ctx.beginPath();
      ctx.ellipse(cx, c.y, c.w, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx - c.w * 0.3, c.y - 6, c.w * 0.5, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const drawTrees = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    for (const tree of g.trees) {
      const tx = tree.x - g.scrollX * 0.3;
      if (tx < -60 || tx > g.canvasW + 60) continue;
      const topRow = g.aisleY - 60;
      const bottomRow = g.aisleY + g.aisleHeight + 60;

      ctx.fillStyle = '#5C4033';
      ctx.fillRect(tx - 3, topRow - tree.size * 0.3, 6, tree.size * 0.5);
      ctx.fillRect(tx - 3, bottomRow - tree.size * 0.1, 6, tree.size * 0.5);

      ctx.fillStyle = tree.shade;
      ctx.beginPath();
      ctx.arc(tx, topRow - tree.size * 0.3 - tree.size * 0.4, tree.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tx, bottomRow + tree.size * 0.3 + tree.size * 0.1, tree.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const drawAisle = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    const aisleGrad = ctx.createLinearGradient(0, g.aisleY, 0, g.aisleY + g.aisleHeight);
    aisleGrad.addColorStop(0, '#F5E6D3');
    aisleGrad.addColorStop(0.5, '#FFF5EE');
    aisleGrad.addColorStop(1, '#F5E6D3');
    ctx.fillStyle = aisleGrad;
    ctx.fillRect(0, g.aisleY, g.canvasW, g.aisleHeight);

    ctx.fillStyle = 'rgba(139, 90, 43, 0.15)';
    ctx.fillRect(0, g.aisleY, g.canvasW, 3);
    ctx.fillRect(0, g.aisleY + g.aisleHeight - 3, g.canvasW, 3);

    ctx.fillStyle = 'rgba(255, 182, 193, 0.25)';
    for (let i = 0; i < 30; i++) {
      const px = ((i * 50 + 20 - g.scrollX * 0.8) % (g.canvasW + 100)) - 50;
      const py = g.aisleY + 5 + (i % 3) * 3;
      ctx.beginPath();
      ctx.ellipse(px, py, 4, 2, (i * 0.5), 0, Math.PI * 2);
      ctx.fill();

      const py2 = g.aisleY + g.aisleHeight - 5 - (i % 3) * 3;
      ctx.beginPath();
      ctx.ellipse(px + 25, py2, 4, 2, (i * 0.7), 0, Math.PI * 2);
      ctx.fill();
    }

    const grassTop = g.aisleY;
    const grassBottom = g.aisleY + g.aisleHeight;
    const topGrad = ctx.createLinearGradient(0, grassTop - 40, 0, grassTop);
    topGrad.addColorStop(0, '#7CCD7C');
    topGrad.addColorStop(1, '#90C590');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, grassTop - 40, g.canvasW, 40);

    const bottomGrad = ctx.createLinearGradient(0, grassBottom, 0, grassBottom + 40);
    bottomGrad.addColorStop(0, '#90C590');
    bottomGrad.addColorStop(1, '#7CCD7C');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, grassBottom, g.canvasW, g.canvasH - grassBottom);

    ctx.fillStyle = '#6B8E6B';
    ctx.fillRect(0, 0, g.canvasW, grassTop - 40);
    ctx.fillStyle = '#6B8E6B';
    ctx.fillRect(0, grassBottom + 40, g.canvasW, g.canvasH - grassBottom - 40);
  }, []);

  const drawWildflowers = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    for (const f of g.wildflowers) {
      const fx = f.x - g.scrollX * 0.7;
      if (fx < -10 || fx > g.canvasW + 10) continue;
      const sway = Math.sin(g.frame * 0.03 + f.phase) * 1.5;
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(fx + sway, f.y, f.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(fx + sway, f.y, f.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const drawHayBales = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    for (const hb of g.hayBales) {
      const bx = hb.x - g.scrollX * 0.5;
      if (bx < -40 || bx > g.canvasW + 40) continue;
      ctx.fillStyle = '#DAA520';
      ctx.fillRect(bx - 15, hb.y - 10, 30, 20);
      ctx.fillStyle = '#C8961E';
      ctx.fillRect(bx - 15, hb.y - 10, 30, 3);
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(bx - 13, hb.y - 5 + i * 6);
        ctx.lineTo(bx + 13, hb.y - 5 + i * 6);
        ctx.stroke();
      }
    }
  }, []);

  const drawGuests = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    for (const guest of g.guests) {
      const gx = guest.x - g.scrollX * 0.6;
      if (gx < -30 || gx > g.canvasW + 30) continue;

      if (guest.waving && guest.waveTimer > 0) {
        guest.waveTimer--;
        if (guest.waveTimer <= 0) guest.waving = false;
      }

      const gy = guest.y;
      const faceUp = guest.side === 'top';

      ctx.fillStyle = guest.color;
      ctx.fillRect(gx - 6, gy - 8, 12, 16);

      ctx.fillStyle = '#FFDAB9';
      ctx.beginPath();
      ctx.arc(gx, gy - 12, 6, 0, Math.PI * 2);
      ctx.fill();

      if (guest.type === 1 || guest.type === 2) {
        ctx.fillStyle = guest.hatColor;
        ctx.fillRect(gx - 7, gy - 18, 14, 4);
        if (guest.type === 2) {
          ctx.fillRect(gx - 4, gy - 22, 8, 5);
        }
      }

      if (guest.waving) {
        const armWave = Math.sin(g.frame * 0.3) * 0.4;
        ctx.strokeStyle = '#FFDAB9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gx + 6, gy - 6);
        const armEndX = gx + 12 + Math.sin(armWave) * 3;
        const armEndY = faceUp ? gy - 16 - Math.abs(Math.cos(armWave)) * 4 : gy + 2 + Math.abs(Math.cos(armWave)) * 4;
        ctx.lineTo(armEndX, armEndY);
        ctx.stroke();
      }

      ctx.fillStyle = '#333';
      ctx.fillRect(gx - 2, gy - 13, 1.5, 1.5);
      ctx.fillRect(gx + 1, gy - 13, 1.5, 1.5);

      ctx.fillStyle = '#FF6B6B';
      ctx.beginPath();
      ctx.arc(gx, gy - 10, 1.5, 0, Math.PI);
      ctx.fill();
    }
  }, []);

  const drawFairyLights = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    const allLights = [...g.fairyLightsTop, ...g.fairyLightsBottom];
    for (const light of allLights) {
      const lx = light.x - g.scrollX * 0.6;
      if (lx < -10 || lx > g.canvasW + 10) continue;
      const twinkle = 0.5 + Math.sin(g.frame * 0.05 + light.phase) * 0.3;
      ctx.globalAlpha = twinkle * light.brightness;
      ctx.fillStyle = '#FFF8DC';
      ctx.beginPath();
      ctx.arc(lx, light.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 248, 220, 0.3)';
      ctx.beginPath();
      ctx.arc(lx, light.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, []);

  const drawBride = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    const bx = g.brideX;
    const by = g.brideY + Math.sin(g.brideBob) * 2;
    const dressSwing = Math.sin(g.brideDressSwing) * 3;

    if (g.graceActive) {
      ctx.globalAlpha = 0.15 + Math.sin(g.frame * 0.1) * 0.1;
      const graceGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 40);
      graceGrad.addColorStop(0, '#FFD700');
      graceGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = graceGrad;
      ctx.beginPath();
      ctx.arc(bx, by, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = '#FFFAFA';
    ctx.beginPath();
    ctx.moveTo(bx - 4, by - 8);
    ctx.lineTo(bx - 14 + dressSwing, by + 18);
    ctx.lineTo(bx + 14 + dressSwing, by + 18);
    ctx.lineTo(bx + 4, by - 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#E8E0E0';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(bx - 2, by - 6);
    ctx.lineTo(bx - 10 + dressSwing, by + 16);
    ctx.lineTo(bx - 4 + dressSwing, by + 16);
    ctx.lineTo(bx, by - 6);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#E0D8D8';
    ctx.lineWidth = 0.3;
    for (let i = 0; i < 4; i++) {
      const ly = by + 2 + i * 4;
      const spread = (ly - (by - 8)) / ((by + 18) - (by - 8));
      const leftX = bx - 4 - spread * 10 + dressSwing * spread;
      const rightX = bx + 4 + spread * 10 + dressSwing * spread;
      ctx.beginPath();
      ctx.moveTo(leftX, ly);
      ctx.quadraticCurveTo(bx + dressSwing * spread, ly + 1.5, rightX, ly);
      ctx.stroke();
    }

    ctx.fillStyle = '#FFDAB9';
    ctx.beginPath();
    ctx.arc(bx, by - 14, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(bx - 2.5, by - 15, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx + 2.5, by - 15, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FF9999';
    ctx.beginPath();
    ctx.arc(bx - 4.5, by - 12.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx + 4.5, by - 12.5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#E87070';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(bx, by - 11.5, 2, 0.1, Math.PI - 0.1);
    ctx.stroke();

    ctx.fillStyle = '#5C3317';
    ctx.beginPath();
    ctx.ellipse(bx, by - 19, 8, 4, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(bx - 7, by - 19, 14, 3);

    const veilWave = Math.sin(g.brideVeilWave) * 3;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(bx - 2, by - 20);
    ctx.quadraticCurveTo(bx + 10 + veilWave, by - 18, bx + 8 + veilWave * 1.5, by - 5);
    ctx.quadraticCurveTo(bx + 12 + veilWave, by + 5, bx + 6 + veilWave, by + 12);
    ctx.quadraticCurveTo(bx + 4, by + 5, bx + 2, by - 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(bx - 8, by - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.arc(bx - 9.5, by - 3.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.arc(bx - 7, by - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#98FB98';
    ctx.fillRect(bx - 10, by - 1, 2, 4);
    ctx.fillRect(bx - 7, by, 2, 3);

    if (g.hitFeedback > 0) {
      ctx.globalAlpha = g.hitFeedback / 10;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx, by, 22 + (10 - g.hitFeedback) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }, []);

  const drawGroom = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>, groomX: number) => {
    const by = g.brideY;
    const gx = groomX;

    ctx.fillStyle = '#2E8B57';
    ctx.beginPath();
    ctx.moveTo(gx - 6, by - 10);
    ctx.lineTo(gx - 10, by + 18);
    ctx.lineTo(gx + 10, by + 18);
    ctx.lineTo(gx + 6, by - 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFFAFA';
    ctx.fillRect(gx - 3, by - 10, 6, 14);

    ctx.fillStyle = '#333';
    ctx.fillRect(gx - 1, by - 8, 2, 10);

    ctx.fillStyle = '#FFDAB9';
    ctx.beginPath();
    ctx.arc(gx, by - 16, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#5C3317';
    ctx.beginPath();
    ctx.ellipse(gx, by - 21, 7, 4, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(gx - 6, by - 21, 12, 2);
    ctx.fillRect(gx - 5, by - 19, 3, 3);
    ctx.fillRect(gx + 2, by - 19, 3, 3);

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(gx - 2.5, by - 17, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(gx + 2.5, by - 17, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#E87070';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(gx, by - 13, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();

    const wavePhase = Math.sin(g.frame * 0.08);
    ctx.strokeStyle = '#FFDAB9';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(gx + 6, by - 6);
    ctx.lineTo(gx + 14, by - 14 + wavePhase * 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(gx + 14, by - 16 + wavePhase * 4, 2, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const drawAltar = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>, altarX: number) => {
    const centerY = g.aisleY + g.aisleHeight * 0.5;
    const archTop = g.aisleY - 30;
    const archBottom = g.aisleY + g.aisleHeight + 10;

    ctx.fillStyle = '#8B6914';
    ctx.fillRect(altarX - 25, archTop, 6, archBottom - archTop);
    ctx.fillRect(altarX + 19, archTop, 6, archBottom - archTop);

    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(altarX, archTop + 10, 24, Math.PI, Math.PI * 2);
    ctx.stroke();

    const flowerPositions = [
      { x: altarX - 22, y: archTop + 5 },
      { x: altarX + 22, y: archTop + 5 },
      { x: altarX - 20, y: archTop - 10 },
      { x: altarX, y: archTop - 14 },
      { x: altarX + 20, y: archTop - 10 },
      { x: altarX - 25, y: centerY - 15 },
      { x: altarX + 25, y: centerY - 15 },
      { x: altarX - 25, y: centerY + 15 },
      { x: altarX + 25, y: centerY + 15 },
    ];

    const altarFlowerColors = ['#FF69B4', '#FFB6C1', '#FF1493', '#DDA0DD', '#FFA07A'];
    for (const fp of flowerPositions) {
      ctx.fillStyle = altarFlowerColors[Math.floor(Math.abs(fp.x + fp.y) % altarFlowerColors.length)];
      ctx.beginPath();
      ctx.arc(fp.x, fp.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#98FB98';
      ctx.beginPath();
      ctx.arc(fp.x - 3, fp.y + 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 5; i++) {
      const lightX = altarX - 20 + i * 10;
      const lightY = archTop - 8 + Math.sin(i * 1.5) * 5;
      const twinkle = 0.6 + Math.sin(g.frame * 0.06 + i * 1.2) * 0.4;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = '#FFF8DC';
      ctx.beginPath();
      ctx.arc(lightX, lightY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 248, 220, 0.3)';
      ctx.beginPath();
      ctx.arc(lightX, lightY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, []);

  const drawPrompt = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>, p: Prompt) => {
    if (p.hit) return;

    const age = g.frame - p.spawnTime;
    const pulse = 1 + Math.sin(age * 0.15) * 0.08;
    const r = p.radius * pulse;

    if (p.missed) {
      ctx.globalAlpha = 0.3;
    }

    switch (p.type) {
      case 'catch': {
        ctx.fillStyle = 'rgba(255, 182, 193, 0.3)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        const petalCount = 5;
        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2 + age * 0.02;
          const px = p.x + Math.cos(angle) * 6;
          const py = p.y + Math.sin(angle) * 6 + Math.sin(age * 0.05 + i) * 2;
          ctx.fillStyle = i % 2 === 0 ? '#FFB6C1' : '#FF69B4';
          ctx.beginPath();
          ctx.ellipse(px, py, 3, 2, angle, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'wave': {
        ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4169E1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath();
        ctx.arc(p.x, p.y + 2, 5, 0, Math.PI * 2);
        ctx.fill();
        const waveAngle = Math.sin(age * 0.2) * 0.5;
        ctx.strokeStyle = '#FFDAB9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x + 4, p.y);
        ctx.lineTo(p.x + 10, p.y - 8 + Math.sin(waveAngle) * 3);
        ctx.stroke();
        break;
      }
      case 'step': {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        const notePhase = age * 0.06;
        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.ellipse(p.x - 3, p.y + 2, 4, 3, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(p.x + 1, p.y - 8, 2, 10);
        ctx.fillRect(p.x + 1, p.y - 8, 6 + Math.sin(notePhase) * 2, 2);
        break;
      }
      case 'dodge': {
        ctx.fillStyle = 'rgba(255, 99, 71, 0.25)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FF4500';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        const waddle = Math.sin(age * 0.15) * 2;
        if (p.animalType === 'chicken') {
          ctx.fillStyle = '#FFF8DC';
          ctx.beginPath();
          ctx.ellipse(p.x + waddle, p.y + 2, 7, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(p.x + 5 + waddle, p.y - 2, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FF4500';
          ctx.fillRect(p.x + 8 + waddle, p.y - 2, 3, 2);
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(p.x + 4 + waddle, p.y - 6, 3, 3);
          ctx.fillStyle = '#333';
          ctx.fillRect(p.x + 6 + waddle, p.y - 3, 1.5, 1.5);
        } else if (p.animalType === 'goat') {
          ctx.fillStyle = '#D2B48C';
          ctx.beginPath();
          ctx.ellipse(p.x + waddle, p.y + 2, 8, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#C4A882';
          ctx.beginPath();
          ctx.arc(p.x + 6 + waddle, p.y - 2, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#8B7355';
          ctx.fillRect(p.x + 4 + waddle, p.y - 7, 2, 4);
          ctx.fillRect(p.x + 7 + waddle, p.y - 7, 2, 4);
          ctx.fillStyle = '#333';
          ctx.fillRect(p.x + 7 + waddle, p.y - 3, 1.5, 1.5);
          ctx.fillStyle = '#D2B48C';
          ctx.fillRect(p.x + 9 + waddle, p.y + 1, 2, 4);
        } else {
          ctx.fillStyle = '#8B4513';
          ctx.beginPath();
          ctx.ellipse(p.x + waddle, p.y + 2, 9, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#A0522D';
          ctx.beginPath();
          ctx.arc(p.x + 7 + waddle, p.y - 2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#333';
          ctx.beginPath();
          ctx.arc(p.x + 9 + waddle, p.y - 3, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#333';
          ctx.beginPath();
          ctx.arc(p.x + 8.5 + waddle, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#8B4513';
          const tailWag = Math.sin(age * 0.25) * 3;
          ctx.beginPath();
          ctx.moveTo(p.x - 8 + waddle, p.y + 1);
          ctx.quadraticCurveTo(p.x - 14 + waddle, p.y - 5 + tailWag, p.x - 12 + waddle, p.y - 8 + tailWag);
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#8B4513';
          ctx.stroke();
        }
        break;
      }
    }
    ctx.globalAlpha = 1;
  }, []);

  const drawHUD = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    const elapsed = g.gameTime / TARGET_FPS;
    const remaining = Math.max(0, GAME_DURATION - elapsed);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, g.canvasW, 28);

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#FFF8DC';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${g.score}`, 8, 18);

    ctx.textAlign = 'center';
    const timeColor = remaining < 10 ? '#FF6347' : '#FFF8DC';
    ctx.fillStyle = timeColor;
    ctx.fillText(`${Math.ceil(remaining)}s`, g.canvasW * 0.5, 18);

    ctx.textAlign = 'right';
    if (g.combo >= 3) {
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`COMBO x${g.combo}`, g.canvasW - 8, 18);
    }

    const graceBarW = g.canvasW * 0.3;
    const graceBarH = 6;
    const graceBarX = (g.canvasW - graceBarW) * 0.5;
    const graceBarY = 30;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(graceBarX - 1, graceBarY - 1, graceBarW + 2, graceBarH + 2);

    if (g.graceActive) {
      const goldenPulse = 0.8 + Math.sin(g.frame * 0.1) * 0.2;
      ctx.fillStyle = `rgba(255, 215, 0, ${goldenPulse})`;
      ctx.fillRect(graceBarX, graceBarY, graceBarW, graceBarH);
    } else {
      const graceGrad = ctx.createLinearGradient(graceBarX, 0, graceBarX + graceBarW * (g.graceMeter / 100), 0);
      graceGrad.addColorStop(0, '#FFB6C1');
      graceGrad.addColorStop(1, '#FF69B4');
      ctx.fillStyle = graceGrad;
      ctx.fillRect(graceBarX, graceBarY, graceBarW * (g.graceMeter / 100), graceBarH);
    }

    ctx.font = '7px monospace';
    ctx.fillStyle = g.graceActive ? '#FFD700' : '#FFF8DC';
    ctx.textAlign = 'center';
    ctx.fillText(g.graceActive ? 'GRACE MODE' : 'GRACE', g.canvasW * 0.5, graceBarY + graceBarH + 10);

    ctx.textAlign = 'left';
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    for (const p of g.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      if (p.type === 'petal') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'confetti') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size * 0.5, -p.size * 0.25, p.size, p.size * 0.5);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }, []);

  const drawFloatingTexts = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    for (const ft of g.floatingTexts) {
      const progress = 1 - ft.life / ft.maxLife;
      ctx.globalAlpha = 1 - progress;
      ctx.font = `bold ${11 + (ft.text.includes('GRACE') ? 5 : 0)}px monospace`;
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 2;
      ctx.strokeText(ft.text, ft.x, ft.y - progress * 25);
      ctx.fillText(ft.text, ft.x, ft.y - progress * 25);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }, []);

  const drawCelebration = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    const progress = Math.min(1, g.celebrationTimer / 120);

    const altarScreenX = g.canvasW * 0.75;
    drawAltar(ctx, g, altarScreenX);

    const brideTargetX = altarScreenX - 20;
    const currentBrideX = g.brideX + (brideTargetX - g.brideX) * progress;
    const oldBrideX = g.brideX;
    g.brideX = currentBrideX;
    drawBride(ctx, g);
    g.brideX = oldBrideX;

    drawGroom(ctx, g, altarScreenX + 15);

    if (progress > 0.5) {
      const heartProgress = (progress - 0.5) * 2;
      ctx.globalAlpha = heartProgress;
      ctx.fillStyle = '#FF1493';
      const heartX = altarScreenX - 2;
      const heartY = g.brideY - 40 - heartProgress * 10;
      ctx.font = `${14 + heartProgress * 8}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('\u2764', heartX, heartY);
      ctx.globalAlpha = 1;

      if (g.celebrationTimer % 8 === 0) {
        const confettiColors = ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#FFA07A'];
        for (let i = 0; i < 3; i++) {
          addParticles(
            Math.random() * g.canvasW,
            -10,
            confettiColors[Math.floor(Math.random() * confettiColors.length)],
            2,
            'confetti'
          );
        }
      }
    }

    ctx.textAlign = 'left';
  }, [drawAltar, drawBride, drawGroom, addParticles]);

  const drawGameOverScreen = useCallback((ctx: CanvasRenderingContext2D, g: NonNullable<typeof gameRef.current>) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, g.canvasW, g.canvasH);

    const cx = g.canvasW * 0.5;
    let y = g.canvasH * 0.12;

    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText('THE WALK WAS BEAUTIFUL!', cx, y);
    y += 35;

    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${g.score}`, cx, y);
    y += 20;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#FFF8DC';
    ctx.fillText('POINTS', cx, y);
    y += 30;

    const graceRating = getGraceRating(g);
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = graceRating.color;
    ctx.fillText(graceRating.label, cx, y);
    y += 28;

    const stats = [
      { label: 'Petals Caught', value: g.petalsCaught, icon: '\uD83C\uDF38' },
      { label: 'Waves Returned', value: g.wavesReturned, icon: '\uD83D\uDC4B' },
      { label: 'Steps in Rhythm', value: g.stepsHit, icon: '\uD83C\uDFB5' },
      { label: 'Animals Dodged', value: g.animalsDodged, icon: '\uD83D\uDC14' },
      { label: 'Best Combo', value: g.maxCombo, icon: '\u2B50' },
    ];

    ctx.font = '10px monospace';
    for (const stat of stats) {
      ctx.fillStyle = '#FFF8DC';
      ctx.fillText(`${stat.icon} ${stat.label}: ${stat.value}`, cx, y);
      y += 18;
    }

    y += 10;
    const hs = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    if (g.score > hs) {
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('NEW HIGH SCORE!', cx, y);
    } else if (hs > 0) {
      ctx.font = '10px monospace';
      ctx.fillStyle = '#87CEEB';
      ctx.fillText(`HIGH SCORE: ${hs}`, cx, y);
    }

    ctx.textAlign = 'left';
  }, []);

  const getGraceRating = (g: NonNullable<typeof gameRef.current>) => {
    const total = g.petalsCaught + g.wavesReturned + g.stepsHit + g.animalsDodged;
    const missed = g.promptsMissed;
    const ratio = total > 0 ? total / (total + missed) : 0;

    if (ratio >= 0.9) return { label: 'Absolutely Radiant!', color: '#FFD700' };
    if (ratio >= 0.75) return { label: 'Graceful & Elegant', color: '#FF69B4' };
    if (ratio >= 0.5) return { label: 'Lovely Walk', color: '#DDA0DD' };
    if (ratio >= 0.3) return { label: 'A Bit Wobbly', color: '#87CEEB' };
    return { label: 'The Veil Got in Your Eyes', color: '#98FB98' };
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const g = gameRef.current;
    if (!canvas || !ctx || !g) return;

    g.frame++;
    g.gameTime++;

    const elapsed = g.gameTime / TARGET_FPS;
    const progress = elapsed / GAME_DURATION;

    g.scrollSpeed = g.baseSpeed + progress * 1.5;
    g.scrollX += g.scrollSpeed;

    g.brideBob += 0.06;
    g.brideDressSwing += 0.04;
    g.brideVeilWave += 0.03;

    if (g.hitFeedback > 0) g.hitFeedback--;
    if (g.missFeedback > 0) g.missFeedback--;

    if (g.graceActive) {
      g.graceTimer--;
      if (g.graceTimer <= 0) {
        g.graceActive = false;
        g.graceMeter = 0;
      }
    } else {
      g.graceMeter = Math.max(0, g.graceMeter - 0.05);
    }

    spawnPrompt(g);

    for (const p of g.prompts) {
      if (p.hit || p.missed) continue;
      p.x -= g.scrollSpeed;

      if (p.x < g.brideX - 40) {
        p.missed = true;
        g.combo = 0;
        g.promptsMissed++;
        g.graceMeter = Math.max(0, g.graceMeter - 5);
        g.missFeedback = 8;
      }
    }

    g.prompts = g.prompts.filter(p => p.x > -60 && !(p.hit && g.frame - p.spawnTime > 30));

    g.particles = g.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.type === 'confetti') {
        p.vy += 0.05;
        p.vx *= 0.99;
      } else if (p.type === 'petal') {
        p.vy += 0.03;
        p.vx += Math.sin(p.life * 0.1) * 0.1;
      } else {
        p.vy += 0.08;
      }
      p.rotation += p.rotSpeed;
      p.life--;
      return p.life > 0;
    });

    g.floatingTexts = g.floatingTexts.filter(ft => {
      ft.life--;
      return ft.life > 0;
    });

    if (elapsed >= GAME_DURATION && !g.altarReached) {
      g.altarReached = true;
      g.celebrationTimer = 0;
      setPhase('celebration');
    }

    // RENDER
    drawSky(ctx, g);
    drawTrees(ctx, g);
    drawAisle(ctx, g);
    drawWildflowers(ctx, g);
    drawHayBales(ctx, g);
    drawGuests(ctx, g);
    drawFairyLights(ctx, g);

    for (const p of g.prompts) {
      drawPrompt(ctx, g, p);
    }

    drawBride(ctx, g);
    drawParticles(ctx, g);
    drawFloatingTexts(ctx, g);
    drawHUD(ctx, g);

    if (g.missFeedback > 0) {
      ctx.fillStyle = `rgba(255, 0, 0, ${g.missFeedback * 0.02})`;
      ctx.fillRect(0, 0, g.canvasW, g.canvasH);
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, [
    spawnPrompt, drawSky, drawTrees, drawAisle, drawWildflowers,
    drawHayBales, drawGuests, drawFairyLights, drawBride,
    drawPrompt, drawParticles, drawFloatingTexts, drawHUD,
  ]);

  const celebrationLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const g = gameRef.current;
    if (!canvas || !ctx || !g) return;

    g.frame++;
    g.celebrationTimer++;
    g.brideBob += 0.06;
    g.brideDressSwing += 0.04;
    g.brideVeilWave += 0.03;

    g.particles = g.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.type === 'confetti') {
        p.vy += 0.05;
        p.vx *= 0.99;
      } else {
        p.vy += 0.08;
      }
      p.rotation += p.rotSpeed;
      p.life--;
      return p.life > 0;
    });

    g.floatingTexts = g.floatingTexts.filter(ft => {
      ft.life--;
      return ft.life > 0;
    });

    drawSky(ctx, g);
    drawAisle(ctx, g);
    drawFairyLights(ctx, g);
    drawCelebration(ctx, g);
    drawParticles(ctx, g);
    drawFloatingTexts(ctx, g);

    if (g.celebrationTimer >= 180) {
      const hs = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
      if (g.score > hs) {
        localStorage.setItem(STORAGE_KEY, g.score.toString());
        setHighScore(g.score);
      }
      setDisplayScore(g.score);
      setPhase('gameover');
      onGameOver(g.score);
      return;
    }

    animRef.current = requestAnimationFrame(celebrationLoop);
  }, [
    drawSky, drawAisle, drawFairyLights, drawCelebration,
    drawParticles, drawFloatingTexts, onGameOver,
  ]);

  const gameOverRenderLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const g = gameRef.current;
    if (!canvas || !ctx || !g) return;

    g.frame++;

    g.particles = g.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.type === 'confetti') { p.vy += 0.05; p.vx *= 0.99; }
      else { p.vy += 0.08; }
      p.rotation += p.rotSpeed;
      p.life--;
      return p.life > 0;
    });

    if (g.frame % 15 === 0) {
      const confettiColors = ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD'];
      addParticles(
        Math.random() * g.canvasW, -10,
        confettiColors[Math.floor(Math.random() * confettiColors.length)],
        1, 'confetti'
      );
    }

    drawSky(ctx, g);
    drawAisle(ctx, g);
    drawFairyLights(ctx, g);

    const altarScreenX = g.canvasW * 0.75;
    drawAltar(ctx, g, altarScreenX);
    g.brideBob += 0.04;
    g.brideDressSwing += 0.03;
    g.brideVeilWave += 0.02;
    const oldBX = g.brideX;
    g.brideX = altarScreenX - 20;
    drawBride(ctx, g);
    g.brideX = oldBX;
    drawGroom(ctx, g, altarScreenX + 15);

    ctx.globalAlpha = 0.5 + Math.sin(g.frame * 0.05) * 0.15;
    ctx.fillStyle = '#FF1493';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u2764', altarScreenX - 2, g.brideY - 45);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';

    drawParticles(ctx, g);
    drawGameOverScreen(ctx, g);

    animRef.current = requestAnimationFrame(gameOverRenderLoop);
  }, [drawSky, drawAisle, drawFairyLights, drawAltar, drawBride, drawGroom, drawParticles, drawGameOverScreen, addParticles]);

  const startGame = useCallback(() => {
    resize();
    initGame();
    setDisplayScore(0);
    setPhase('playing');
  }, [resize, initGame]);

  useEffect(() => {
    if (phase === 'playing') {
      animRef.current = requestAnimationFrame(gameLoop);
    } else if (phase === 'celebration') {
      animRef.current = requestAnimationFrame(celebrationLoop);
    } else if (phase === 'gameover') {
      animRef.current = requestAnimationFrame(gameOverRenderLoop);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [phase, gameLoop, celebrationLoop, gameOverRenderLoop]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    if (phase !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        const g = gameRef.current;
        if (!g) return;
        handleTap(g.promptZoneX, g.brideY);
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        const g = gameRef.current;
        if (!g) return;
        handleTap(g.promptZoneX, g.aisleY);
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        const g = gameRef.current;
        if (!g) return;
        handleTap(g.promptZoneX, g.aisleY + g.aisleHeight);
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        const g = gameRef.current;
        if (!g) return;
        handleTap(g.brideX, g.brideY);
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        const g = gameRef.current;
        if (!g) return;
        handleTap(g.canvasW * 0.7, g.brideY);
      }
    };

    const canvas = canvasRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const rect = canvas?.getBoundingClientRect();
        if (!rect) return;
        const tx = touch.clientX - rect.left;
        const ty = touch.clientY - rect.top;
        handleTap(tx, ty);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      handleTap(mx, my);
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas?.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas?.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas?.removeEventListener('touchstart', handleTouchStart);
      canvas?.removeEventListener('mousedown', handleMouseDown);
    };
  }, [phase, handleTap]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        background: '#FFDAB9',
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {phase === 'start' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
            color: '#FFF8DC',
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          <div style={{
            fontSize: 'clamp(16px, 5vw, 26px)',
            color: '#FFD700',
            marginBottom: '12px',
            fontWeight: 'bold',
          }}>
            HERE COMES THE BRIDE
          </div>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>
            {'\uD83D\uDC70'}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            lineHeight: 1.8,
            maxWidth: '320px',
            marginBottom: '20px',
          }}>
            <p style={{ marginBottom: '8px' }}>Walk Brittany down the aisle!</p>
            <p style={{ color: '#FFB6C1' }}>
              {'\uD83C\uDF38'} <strong>CATCH</strong> falling petals
            </p>
            <p style={{ color: '#87CEEB' }}>
              {'\uD83D\uDC4B'} <strong>WAVE</strong> back at guests
            </p>
            <p style={{ color: '#FFD700' }}>
              {'\uD83C\uDFB5'} <strong>STEP</strong> to the music
            </p>
            <p style={{ color: '#FF6347' }}>
              {'\uD83D\uDC14'} <strong>DODGE</strong> farm animals
            </p>
            <p style={{ marginTop: '10px', color: '#DDA0DD', fontSize: 'clamp(9px, 2vw, 10px)' }}>
              Tap the prompts or use keyboard arrows!
            </p>
            <p style={{ color: '#DDA0DD', fontSize: 'clamp(9px, 2vw, 10px)' }}>
              Build combos to fill the Grace Meter!
            </p>
          </div>
          {highScore > 0 && (
            <div style={{ fontSize: '10px', color: '#DAA520', marginBottom: '12px' }}>
              HIGH SCORE: {highScore}
            </div>
          )}
          <button
            onClick={startGame}
            style={{
              fontSize: '14px',
              padding: '14px 40px',
              background: '#2E8B57',
              color: '#FFF8DC',
              border: '3px solid #FFD700',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              transition: 'transform 0.1s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            START THE WALK
          </button>
        </div>
      )}

      {phase === 'gameover' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '20px',
            paddingBottom: '40px',
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          <button
            onClick={startGame}
            style={{
              fontSize: '13px',
              padding: '12px 36px',
              background: '#2E8B57',
              color: '#FFF8DC',
              border: '3px solid #FFD700',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '12px',
            }}
          >
            WALK AGAIN
          </button>
          <a
            href="/games"
            style={{
              fontSize: '10px',
              color: '#87CEEB',
              textDecoration: 'none',
              fontFamily: 'monospace',
            }}
          >
            {'< BACK TO ARCADE'}
          </a>
        </div>
      )}
    </div>
  );
}
