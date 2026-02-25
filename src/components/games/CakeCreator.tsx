'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GamePhase = 'start' | 'playing' | 'roundResult' | 'gameover';
type DecoType = 'flowers' | 'hearts' | 'berries' | 'sprinkles' | 'ribbon';

interface FrostingColor {
  name: string;
  fill: string;
  drip: string;
  highlight: string;
}

interface CakeSpec {
  layers: number;
  frostingIndex: number;
  decorations: DecoType[];
}

interface OrderCard {
  customerName: string;
  spec: CakeSpec;
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

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface CakeCreatorProps {
  onGameOver: (score: number) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL_ROUNDS = 10;
const STARTING_TIME = 30;
const TIME_DECREASE = 2;
const MIN_TIME = 10;

const FROSTING_COLORS: FrostingColor[] = [
  { name: 'Blush', fill: '#F4C2C2', drip: '#E8A0A0', highlight: '#FDE0E0' },
  { name: 'Sage', fill: '#B2BDA0', drip: '#95A680', highlight: '#D0D9C4' },
  { name: 'Lavender', fill: '#C8A2C8', drip: '#B088B0', highlight: '#E0C4E0' },
  { name: 'Gold', fill: '#DAA520', drip: '#C49018', highlight: '#F0C850' },
  { name: 'Sky', fill: '#A8D8EA', drip: '#88C0D8', highlight: '#C8E8F4' },
  { name: 'Cream', fill: '#FFF8DC', drip: '#EEE8C8', highlight: '#FFFFF0' },
];

const DECO_OPTIONS: { type: DecoType; label: string; emoji: string }[] = [
  { type: 'flowers', label: 'Flowers', emoji: '🌸' },
  { type: 'hearts', label: 'Hearts', emoji: '💕' },
  { type: 'berries', label: 'Berries', emoji: '🍓' },
  { type: 'sprinkles', label: 'Sprinkles', emoji: '✨' },
  { type: 'ribbon', label: 'Ribbon', emoji: '🎀' },
];

const CUSTOMER_NAMES = [
  'Emmett', 'Sapphire', 'Zoe', 'Brittany', 'Matt',
  'Uncle Joe', 'Grandma', 'Aunt Sally', 'Cousin Pete', 'Farmer Dan',
  'Mabel', 'Chester', 'Rosie', 'Hank', 'Daisy',
];

const COLORS = {
  bgTop: '#1a0a00',
  bgMid: '#2d1508',
  bgBottom: '#1a0a00',
  gold: '#DAA520',
  goldDark: '#B8860B',
  cream: '#FFF8DC',
  forestGreen: '#228B22',
  blush: '#F4C2C2',
  sage: '#B2BDA0',
  cardBg: '#2a1a0a',
  cardBorder: '#DAA52044',
  plateBg: '#E8E0D0',
  plateHighlight: '#F5F0E8',
  plateShadow: '#B8B0A0',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOrder(round: number): OrderCard {
  const maxLayers = Math.min(1 + Math.ceil(round / 3), 4);
  const layers = Math.max(1, Math.floor(rand(1, maxLayers + 1)));
  const frostingIndex = Math.floor(rand(0, FROSTING_COLORS.length));

  const maxDecos = Math.min(1 + Math.floor(round / 2), 3);
  const numDecos = Math.max(1, Math.min(maxDecos, Math.floor(rand(1, maxDecos + 1))));
  const availableDecos = [...DECO_OPTIONS];
  const decorations: DecoType[] = [];
  for (let i = 0; i < numDecos; i++) {
    const idx = Math.floor(rand(0, availableDecos.length));
    decorations.push(availableDecos[idx].type);
    availableDecos.splice(idx, 1);
    if (availableDecos.length === 0) break;
  }

  return {
    customerName: pickRandom(CUSTOMER_NAMES),
    spec: { layers, frostingIndex, decorations: decorations.sort() },
  };
}

function scoreRound(order: CakeSpec, player: CakeSpec, timeLeft: number, maxTime: number): { total: number; layerMatch: boolean; frostingMatch: boolean; decoMatch: boolean; timeBonus: number } {
  const layerMatch = order.layers === player.layers;
  const frostingMatch = order.frostingIndex === player.frostingIndex;

  const orderDecos = [...order.decorations].sort();
  const playerDecos = [...player.decorations].sort();
  const decoMatch = orderDecos.length === playerDecos.length && orderDecos.every((d, i) => d === playerDecos[i]);

  let base = 0;
  if (layerMatch) base += 30;
  if (frostingMatch) base += 30;
  if (decoMatch) base += 40;

  const timeBonus = Math.round((timeLeft / maxTime) * 50);
  const total = base + (base === 100 ? timeBonus : 0);

  return { total, layerMatch, frostingMatch, decoMatch, timeBonus };
}

// ---------------------------------------------------------------------------
// Drawing Helpers
// ---------------------------------------------------------------------------

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCake(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  spec: CakeSpec,
  scale: number = 1,
  animFrame: number = 0,
) {
  const frosting = FROSTING_COLORS[spec.frostingIndex];
  const layerH = 32 * scale;
  const baseW = 100 * scale;
  const layerShrink = 14 * scale;
  const cornerR = 8 * scale;

  // Plate
  ctx.fillStyle = COLORS.plateBg;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 4 * scale, (baseW + 20 * scale) / 2, 8 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.plateHighlight;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 2 * scale, (baseW + 16 * scale) / 2, 5 * scale, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  // Layers (bottom to top)
  for (let i = 0; i < spec.layers; i++) {
    const layerW = baseW - i * layerShrink;
    const layerX = cx - layerW / 2;
    const layerY = baseY - (i + 1) * layerH;

    // Cake body (sponge)
    const spongeColor = '#F5E6C8';
    const spongeDark = '#E8D4AD';
    drawRoundedRect(ctx, layerX, layerY, layerW, layerH, cornerR);
    ctx.fillStyle = spongeColor;
    ctx.fill();
    ctx.strokeStyle = spongeDark;
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    // Frosting top
    const frostH = 10 * scale;
    drawRoundedRect(ctx, layerX - 2 * scale, layerY - 2 * scale, layerW + 4 * scale, frostH, cornerR);
    ctx.fillStyle = frosting.fill;
    ctx.fill();

    // Frosting highlight
    drawRoundedRect(ctx, layerX + 4 * scale, layerY - 1 * scale, layerW - 8 * scale, 4 * scale, cornerR / 2);
    ctx.fillStyle = frosting.highlight;
    ctx.fill();

    // Drip effects on sides
    const dripCount = Math.floor(layerW / (14 * scale));
    for (let d = 0; d < dripCount; d++) {
      const dx = layerX + 7 * scale + d * (layerW - 14 * scale) / Math.max(dripCount - 1, 1);
      const dripLen = (8 + Math.sin(d * 2.3 + animFrame * 0.02) * 4) * scale;
      ctx.fillStyle = frosting.drip;
      ctx.beginPath();
      ctx.moveTo(dx - 3 * scale, layerY + frostH - 4 * scale);
      ctx.quadraticCurveTo(dx - 3 * scale, layerY + frostH + dripLen, dx, layerY + frostH + dripLen + 2 * scale);
      ctx.quadraticCurveTo(dx + 3 * scale, layerY + frostH + dripLen, dx + 3 * scale, layerY + frostH - 4 * scale);
      ctx.fill();
    }
  }

  // Decorations on top
  const topLayerY = baseY - spec.layers * layerH;
  const topLayerW = baseW - (spec.layers - 1) * layerShrink;

  for (const deco of spec.decorations) {
    drawDecoration(ctx, cx, topLayerY, topLayerW, deco, scale, animFrame);
  }
}

function drawDecoration(
  ctx: CanvasRenderingContext2D,
  cx: number,
  topY: number,
  topW: number,
  deco: DecoType,
  scale: number,
  frame: number,
) {
  const s = scale;
  switch (deco) {
    case 'flowers': {
      const positions = [
        { x: cx - topW * 0.3, y: topY - 6 * s },
        { x: cx, y: topY - 10 * s },
        { x: cx + topW * 0.3, y: topY - 6 * s },
      ];
      for (const pos of positions) {
        const bob = Math.sin(frame * 0.05 + pos.x) * 2 * s;
        drawFlower(ctx, pos.x, pos.y + bob, 6 * s);
      }
      break;
    }
    case 'hearts': {
      const positions = [
        { x: cx - topW * 0.25, y: topY - 8 * s },
        { x: cx + topW * 0.25, y: topY - 8 * s },
      ];
      for (const pos of positions) {
        const bob = Math.sin(frame * 0.06 + pos.x) * 1.5 * s;
        drawHeart(ctx, pos.x, pos.y + bob, 7 * s);
      }
      break;
    }
    case 'berries': {
      const positions = [
        { x: cx - topW * 0.3, y: topY - 4 * s },
        { x: cx - topW * 0.1, y: topY - 6 * s },
        { x: cx + topW * 0.1, y: topY - 5 * s },
        { x: cx + topW * 0.3, y: topY - 4 * s },
      ];
      for (const pos of positions) {
        drawBerry(ctx, pos.x, pos.y, 4 * s);
      }
      break;
    }
    case 'sprinkles': {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + frame * 0.01;
        const r = topW * 0.2 + Math.sin(i * 1.7) * topW * 0.1;
        const sx = cx + Math.cos(angle) * r;
        const sy = topY - 4 * s + Math.sin(angle) * 3 * s;
        const colors = ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD'];
        ctx.fillStyle = colors[i % colors.length];
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(angle);
        ctx.fillRect(-2 * s, -1 * s, 4 * s, 2 * s);
        ctx.restore();
      }
      break;
    }
    case 'ribbon': {
      ctx.strokeStyle = '#E8A0A0';
      ctx.lineWidth = 3 * s;
      ctx.lineCap = 'round';

      // Wavy ribbon around the top of the cake
      ctx.beginPath();
      const ribbonY = topY + 6 * s;
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const rx = cx - topW * 0.45 + t * topW * 0.9;
        const ry = ribbonY + Math.sin(t * Math.PI * 3 + frame * 0.04) * 3 * s;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.stroke();

      // Bow on top
      drawBow(ctx, cx, topY - 6 * s, 10 * s);
      break;
    }
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const petalColors = ['#FFB6C1', '#FF69B4', '#FFC0CB'];
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(angle) * size * 0.6;
    const py = y + Math.sin(angle) * size * 0.6;
    ctx.fillStyle = petalColors[i % petalColors.length];
    ctx.beginPath();
    ctx.arc(px, py, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = '#FF4466';
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x - size * 0.6, y - size * 0.3, x - size * 0.6, y - size * 0.7, x, y - size * 0.4);
  ctx.bezierCurveTo(x + size * 0.6, y - size * 0.7, x + size * 0.6, y - size * 0.3, x, y + size * 0.3);
  ctx.fill();
}

function drawBerry(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = '#DC143C';
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF4466';
  ctx.beginPath();
  ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Leaf
  ctx.fillStyle = '#228B22';
  ctx.beginPath();
  ctx.ellipse(x + size * 0.3, y - size * 0.8, size * 0.5, size * 0.25, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawBow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = '#FF69B4';
  // Left loop
  ctx.beginPath();
  ctx.ellipse(x - size * 0.5, y, size * 0.5, size * 0.3, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  // Right loop
  ctx.beginPath();
  ctx.ellipse(x + size * 0.5, y, size * 0.5, size * 0.3, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  // Center knot
  ctx.fillStyle = '#E05090';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// UI Button Layout Helpers
// ---------------------------------------------------------------------------

interface ButtonZone {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  value: string | number;
  active: boolean;
  color: string;
  textColor: string;
}

function getButtonZones(canvasW: number, canvasH: number, playerSpec: CakeSpec): {
  layerButtons: ButtonZone[];
  frostingButtons: ButtonZone[];
  decoButtons: ButtonZone[];
  serveButton: ButtonZone;
} {
  const isVeryCompact = canvasH < 460;
  const isCompact = canvasH < 560;
  const buttonH = isVeryCompact ? 30 : isCompact ? 34 : 38;
  const gap = isCompact ? 4 : 6;
  const sectionGap = isVeryCompact ? 8 : isCompact ? 12 : 20;
  const margin = 12;
  const usableW = canvasW - margin * 2;

  const sectionStartY = canvasH * (isVeryCompact ? 0.44 : isCompact ? 0.46 : 0.48);
  const layerBtnW = (usableW - gap * 3) / 4;
  const layerButtons: ButtonZone[] = [];
  for (let i = 1; i <= 4; i++) {
    layerButtons.push({
      x: margin + (i - 1) * (layerBtnW + gap),
      y: sectionStartY,
      w: layerBtnW,
      h: buttonH,
      label: `${i}`,
      value: i,
      active: playerSpec.layers === i,
      color: playerSpec.layers === i ? '#DAA520' : '#3a2a1a',
      textColor: playerSpec.layers === i ? '#1a0a00' : '#FFF8DC',
    });
  }

  const frostingY = sectionStartY + buttonH + gap + sectionGap;
  const frostBtnW = (usableW - gap * (FROSTING_COLORS.length - 1)) / FROSTING_COLORS.length;
  const frostingButtons: ButtonZone[] = [];
  for (let i = 0; i < FROSTING_COLORS.length; i++) {
    frostingButtons.push({
      x: margin + i * (frostBtnW + gap),
      y: frostingY,
      w: frostBtnW,
      h: buttonH,
      label: '',
      value: i,
      active: playerSpec.frostingIndex === i,
      color: FROSTING_COLORS[i].fill,
      textColor: '#333',
    });
  }

  const decoY = frostingY + buttonH + gap + sectionGap;
  const decoBtnW = (usableW - gap * (DECO_OPTIONS.length - 1)) / DECO_OPTIONS.length;
  const decoButtons: ButtonZone[] = [];
  for (let i = 0; i < DECO_OPTIONS.length; i++) {
    const opt = DECO_OPTIONS[i];
    const isActive = playerSpec.decorations.includes(opt.type);
    decoButtons.push({
      x: margin + i * (decoBtnW + gap),
      y: decoY,
      w: decoBtnW,
      h: buttonH,
      label: opt.emoji,
      value: opt.type,
      active: isActive,
      color: isActive ? '#DAA520' : '#3a2a1a',
      textColor: isActive ? '#1a0a00' : '#FFF8DC',
    });
  }

  const serveY = decoY + buttonH + gap + (isVeryCompact ? 6 : isCompact ? 10 : 16);
  const serveBtnW = usableW * 0.6;
  const serveBtnH = isVeryCompact ? 38 : 44;
  const serveButton: ButtonZone = {
    x: canvasW / 2 - serveBtnW / 2,
    y: Math.min(serveY, canvasH - serveBtnH - 8),
    w: serveBtnW,
    h: serveBtnH,
    label: 'SERVE!',
    value: 'serve',
    active: false,
    color: '#228B22',
    textColor: '#FFFFFF',
  };

  return { layerButtons, frostingButtons, decoButtons, serveButton };
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface GameData {
  round: number;
  score: number;
  timeLeft: number;
  maxTime: number;
  order: OrderCard;
  playerSpec: CakeSpec;
  particles: Particle[];
  floatingTexts: FloatingText[];
  frame: number;
  canvasW: number;
  canvasH: number;
  lastTime: number;
  roundScore: { total: number; layerMatch: boolean; frostingMatch: boolean; decoMatch: boolean; timeBonus: number } | null;
  resultTimer: number;
  perfectRounds: number;
}

export default function CakeCreator({ onGameOver }: CakeCreatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<GamePhase>('start');
  const [displayScore, setDisplayScore] = useState(0);
  const gameRef = useRef<GameData | null>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef<GamePhase>('start');

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const availableH = window.innerHeight - rect.top;
    const h = Math.min(Math.max(availableH, 380), 650);
    canvas.style.height = `${h}px`;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (gameRef.current) {
      gameRef.current.canvasW = w;
      gameRef.current.canvasH = h;
    }
  }, []);

  const initGame = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const availableH = window.innerHeight - rect.top;
    const h = Math.min(Math.max(availableH, 380), 650);
    const firstOrder = generateOrder(1);
    const maxTime = STARTING_TIME;

    gameRef.current = {
      round: 1,
      score: 0,
      timeLeft: maxTime,
      maxTime,
      order: firstOrder,
      playerSpec: { layers: 1, frostingIndex: 0, decorations: [] },
      particles: [],
      floatingTexts: [],
      frame: 0,
      canvasW: w,
      canvasH: h,
      lastTime: performance.now(),
      roundScore: null,
      resultTimer: 0,
      perfectRounds: 0,
    };
  }, []);

  const addParticles = useCallback((x: number, y: number, color: string, count: number) => {
    const g = gameRef.current;
    if (!g) return;
    for (let i = 0; i < count; i++) {
      g.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 4 - 1,
        life: 40 + Math.random() * 20,
        maxLife: 60,
        color,
        size: 2 + Math.random() * 4,
      });
    }
  }, []);

  const submitCake = useCallback(() => {
    const g = gameRef.current;
    if (!g || phaseRef.current !== 'playing') return;

    const result = scoreRound(g.order.spec, g.playerSpec, g.timeLeft, g.maxTime);
    g.roundScore = result;
    g.score += result.total;
    g.resultTimer = 120;
    if (result.total >= 100) g.perfectRounds++;

    setDisplayScore(g.score);

    if (result.total >= 100) {
      addParticles(g.canvasW / 2, g.canvasH * 0.3, '#FFD700', 20);
      addParticles(g.canvasW / 2, g.canvasH * 0.3, '#FF69B4', 15);
    }

    phaseRef.current = 'roundResult';
    setPhase('roundResult');
  }, [addParticles]);

  const nextRound = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;

    if (g.round >= TOTAL_ROUNDS) {
      phaseRef.current = 'gameover';
      setPhase('gameover');
      onGameOver(g.score);
      return;
    }

    g.round++;
    g.maxTime = Math.max(MIN_TIME, STARTING_TIME - (g.round - 1) * TIME_DECREASE);
    g.timeLeft = g.maxTime;
    g.order = generateOrder(g.round);
    g.playerSpec = { layers: 1, frostingIndex: 0, decorations: [] };
    g.roundScore = null;
    g.lastTime = performance.now();

    phaseRef.current = 'playing';
    setPhase('playing');
  }, [onGameOver]);

  const startGame = useCallback(() => {
    initGame();
    resize();
    phaseRef.current = 'playing';
    setPhase('playing');
    setDisplayScore(0);
  }, [initGame, resize]);

  // --- Drawing ---

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, COLORS.bgTop);
    grad.addColorStop(0.5, COLORS.bgMid);
    grad.addColorStop(1, COLORS.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }, []);

  const drawOrderCard = useCallback((ctx: CanvasRenderingContext2D, w: number, order: OrderCard, round: number, timeLeft: number, maxTime: number) => {
    const cardX = 8;
    const cardY = 8;
    const cardW = w - 16;
    const cardH = 70;

    // Card background
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 8);
    ctx.fillStyle = COLORS.cardBg;
    ctx.fill();
    ctx.strokeStyle = COLORS.cardBorder;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Customer name
    ctx.fillStyle = COLORS.gold;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Round ${round}/${TOTAL_ROUNDS}`, cardX + 10, cardY + 16);

    ctx.fillStyle = COLORS.cream;
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`${order.customerName} wants:`, cardX + 10, cardY + 34);

    // Order description
    const frosting = FROSTING_COLORS[order.spec.frostingIndex];
    const decoNames = order.spec.decorations.map(d => {
      const opt = DECO_OPTIONS.find(o => o.type === d);
      return opt ? opt.emoji : d;
    }).join(' ');

    ctx.fillStyle = '#FFF8DCAA';
    ctx.font = '11px monospace';
    ctx.fillText(
      `${order.spec.layers} layer${order.spec.layers > 1 ? 's' : ''} | ${frosting.name} frosting | ${decoNames}`,
      cardX + 10,
      cardY + 52,
    );

    // Timer bar
    const timerBarX = cardX + cardW - 70;
    const timerBarY = cardY + 8;
    const timerBarW = 58;
    const timerBarH = 14;
    const timerPct = Math.max(0, timeLeft / maxTime);

    ctx.fillStyle = '#1a0a00';
    drawRoundedRect(ctx, timerBarX, timerBarY, timerBarW, timerBarH, 4);
    ctx.fill();

    const timerColor = timerPct > 0.5 ? '#228B22' : timerPct > 0.25 ? '#DAA520' : '#DC143C';
    drawRoundedRect(ctx, timerBarX + 1, timerBarY + 1, (timerBarW - 2) * timerPct, timerBarH - 2, 3);
    ctx.fillStyle = timerColor;
    ctx.fill();

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.ceil(timeLeft)}s`, timerBarX + timerBarW / 2, timerBarY + 11);
    ctx.textAlign = 'left';
  }, []);

  const drawButtons = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, playerSpec: CakeSpec) => {
    const zones = getButtonZones(w, h, playerSpec);

    // Section labels
    ctx.fillStyle = COLORS.gold;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('LAYERS', 12, zones.layerButtons[0].y - 6);
    ctx.fillText('FROSTING', 12, zones.frostingButtons[0].y - 6);
    ctx.fillText('TOPPINGS', 12, zones.decoButtons[0].y - 6);

    const allButtons = [...zones.layerButtons, ...zones.frostingButtons, ...zones.decoButtons, zones.serveButton];

    for (const btn of allButtons) {
      drawRoundedRect(ctx, btn.x, btn.y, btn.w, btn.h, 8);
      ctx.fillStyle = btn.color;
      ctx.fill();

      if (btn.active) {
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#5a4a3a';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = btn.textColor;
      if (btn.value === 'serve') {
        ctx.font = 'bold 16px monospace';
      } else if (typeof btn.label === 'string' && btn.label.length > 1) {
        ctx.font = '18px sans-serif';
      } else {
        ctx.font = 'bold 14px monospace';
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    }

    // Frosting color names below swatches
    ctx.font = '8px monospace';
    ctx.fillStyle = '#FFF8DC88';
    for (const btn of zones.frostingButtons) {
      const idx = btn.value as number;
      ctx.fillText(FROSTING_COLORS[idx].name, btn.x + btn.w / 2, btn.y + btn.h + 10);
    }

    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
  }, []);

  const drawRoundResult = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, g: GameData) => {
    if (!g.roundScore) return;

    // Overlay
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const isShort = h < 460;
    const cy = h * (isShort ? 0.30 : 0.35);

    // Result card
    const cardW = w * 0.8;
    const cardH = isShort ? 190 : 220;
    drawRoundedRect(ctx, cx - cardW / 2, cy - 30, cardW, cardH, 12);
    ctx.fillStyle = COLORS.cardBg;
    ctx.fill();
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.stroke();

    const isPerfect = g.roundScore.total >= 100;

    ctx.textAlign = 'center';
    ctx.fillStyle = isPerfect ? '#FFD700' : '#FFF8DC';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(isPerfect ? 'PERFECT!' : 'Nice Try!', cx, cy);

    // Checkmarks
    const checks = [
      { label: 'Layers', match: g.roundScore.layerMatch },
      { label: 'Frosting', match: g.roundScore.frostingMatch },
      { label: 'Toppings', match: g.roundScore.decoMatch },
    ];

    const checkSpacing = isShort ? 18 : 22;
    ctx.font = '13px monospace';
    let checkY = cy + (isShort ? 24 : 30);
    for (const check of checks) {
      ctx.fillStyle = check.match ? '#228B22' : '#DC143C';
      ctx.fillText(check.match ? '✓' : '✗', cx - 60, checkY);
      ctx.fillStyle = '#FFF8DC';
      ctx.fillText(check.label, cx + 10, checkY);
      checkY += checkSpacing;
    }

    if (isPerfect) {
      ctx.fillStyle = COLORS.gold;
      ctx.font = '11px monospace';
      ctx.fillText(`Time Bonus: +${g.roundScore.timeBonus}`, cx, checkY + 4);
    }

    ctx.fillStyle = '#FFF8DC';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`+${g.roundScore.total} points`, cx, checkY + (isShort ? 24 : 35));

    // Next/Finish prompt
    ctx.fillStyle = COLORS.gold;
    ctx.font = '12px monospace';
    const nextText = g.round >= TOTAL_ROUNDS ? 'TAP TO SEE RESULTS' : 'TAP FOR NEXT ROUND';
    ctx.fillText(nextText, cx, checkY + (isShort ? 48 : 65));

    ctx.textAlign = 'left';
  }, []);

  const drawStartScreen = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) => {
    drawBackground(ctx, w, h);

    const cx = w / 2;
    const topPad = h < 460 ? 0.06 : 0.03;

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.gold;
    ctx.font = 'bold 22px monospace';
    ctx.fillText('CAKE CREATOR', cx, h * (0.15 + topPad));

    // Decorative line
    ctx.strokeStyle = COLORS.gold + '44';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 60, h * (0.18 + topPad));
    ctx.lineTo(cx + 60, h * (0.18 + topPad));
    ctx.stroke();

    // Demo cake
    const demoCake: CakeSpec = {
      layers: 3,
      frostingIndex: 0,
      decorations: ['flowers', 'hearts'],
    };
    const cakeScale = h < 460 ? 1.0 : 1.2;
    drawCake(ctx, cx, h * (0.48 + topPad), demoCake, cakeScale, frame);

    // Instructions
    ctx.fillStyle = '#FFF8DC';
    ctx.font = '12px monospace';
    const instructions = [
      'Match the wedding cake orders!',
      'Choose layers, frosting & toppings',
      `${TOTAL_ROUNDS} rounds, faster each time`,
    ];
    let iy = h * (0.58 + topPad);
    for (const line of instructions) {
      ctx.fillText(line, cx, iy);
      iy += 20;
    }

    // Farm theme
    ctx.fillStyle = '#FFF8DC88';
    ctx.font = '10px monospace';
    ctx.fillText('Matt & Brittany | June 27, 2026', cx, h * (0.72 + topPad));

    // Start button
    const btnW = 160;
    const btnH = 44;
    const btnX = cx - btnW / 2;
    const btnY = Math.min(h * (0.78 + topPad), h - btnH - 16);
    const pulse = 1 + Math.sin(frame * 0.06) * 0.04;

    ctx.save();
    ctx.translate(cx, btnY + btnH / 2);
    ctx.scale(pulse, pulse);
    ctx.translate(-cx, -(btnY + btnH / 2));

    drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 10);
    ctx.fillStyle = COLORS.forestGreen;
    ctx.fill();
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('START BAKING!', cx, btnY + btnH / 2 + 5);

    ctx.restore();
    ctx.textAlign = 'left';
  }, [drawBackground]);

  const drawGameOverScreen = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, g: GameData, frame: number) => {
    drawBackground(ctx, w, h);

    const cx = w / 2;
    const topPad = h < 460 ? 0.06 : 0.03;
    ctx.textAlign = 'center';

    ctx.fillStyle = COLORS.gold;
    ctx.font = 'bold 22px monospace';
    ctx.fillText('ALL DONE!', cx, h * (0.12 + topPad));

    // Final cake celebration
    const finalCake: CakeSpec = {
      layers: 4,
      frostingIndex: 3,
      decorations: ['flowers', 'hearts', 'ribbon'],
    };
    const cakeScale = h < 460 ? 0.8 : 1.0;
    drawCake(ctx, cx, h * (0.38 + topPad), finalCake, cakeScale, frame);

    ctx.fillStyle = '#FFF8DC';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`FINAL SCORE: ${g.score}`, cx, h * (0.46 + topPad));

    ctx.fillStyle = COLORS.gold;
    ctx.font = '12px monospace';
    ctx.fillText(`Perfect Rounds: ${g.perfectRounds}/${TOTAL_ROUNDS}`, cx, h * (0.52 + topPad));

    // Rating
    let rating = '';
    if (g.score >= 1200) rating = 'Master Baker! 👨‍🍳';
    else if (g.score >= 900) rating = 'Expert Decorator! 🎂';
    else if (g.score >= 600) rating = 'Cake Enthusiast! 🧁';
    else if (g.score >= 300) rating = 'Apprentice Baker! 🍰';
    else rating = 'Keep Practicing! 💪';

    ctx.fillStyle = '#FFF8DC';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(rating, cx, h * (0.58 + topPad));

    // Play again
    const btnW = 160;
    const btnH = 44;
    const btnX = cx - btnW / 2;
    const btnY = Math.min(h * (0.65 + topPad), h - btnH - 40);
    const pulse = 1 + Math.sin(frame * 0.06) * 0.04;

    ctx.save();
    ctx.translate(cx, btnY + btnH / 2);
    ctx.scale(pulse, pulse);
    ctx.translate(-cx, -(btnY + btnH / 2));

    drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 10);
    ctx.fillStyle = COLORS.forestGreen;
    ctx.fill();
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('BAKE AGAIN!', cx, btnY + btnH / 2 + 5);

    ctx.restore();

    // Back link
    ctx.fillStyle = '#87CEEB';
    ctx.font = '10px monospace';
    ctx.fillText('< BACK TO ARCADE', cx, Math.min(h * (0.78 + topPad), h - 12));

    ctx.textAlign = 'left';
  }, [drawBackground]);

  // --- Game Loop ---

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const g = gameRef.current;
    if (!canvas || !ctx || !g) return;

    const now = performance.now();
    const dt = (now - g.lastTime) / 1000;
    g.lastTime = now;
    g.frame++;

    const w = g.canvasW;
    const h = g.canvasH;

    // Update timer
    if (phaseRef.current === 'playing') {
      g.timeLeft -= dt;
      if (g.timeLeft <= 0) {
        g.timeLeft = 0;
        submitCake();
      }
    }

    // Update particles
    for (let i = g.particles.length - 1; i >= 0; i--) {
      const p = g.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
      if (p.life <= 0) g.particles.splice(i, 1);
    }

    // Update floating texts
    for (let i = g.floatingTexts.length - 1; i >= 0; i--) {
      const ft = g.floatingTexts[i];
      ft.y -= 0.8;
      ft.life--;
      if (ft.life <= 0) g.floatingTexts.splice(i, 1);
    }

    // Draw
    drawBackground(ctx, w, h);

    if (phaseRef.current === 'playing') {
      // Order card
      drawOrderCard(ctx, w, g.order, g.round, g.timeLeft, g.maxTime);

      // Score
      ctx.fillStyle = COLORS.gold;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Score: ${g.score}`, w - 12, 92);
      ctx.textAlign = 'left';

      const isVeryCompact = h < 460;
      const isCompact = h < 560;
      const cakePreviewY = isVeryCompact ? h * 0.33 : isCompact ? h * 0.35 : h * 0.38;
      const cakeScale = isVeryCompact ? 0.6 : isCompact ? 0.7 : 0.9;
      drawCake(ctx, w / 2, cakePreviewY, g.playerSpec, cakeScale, g.frame);

      // Buttons
      drawButtons(ctx, w, h, g.playerSpec);
    }

    if (phaseRef.current === 'roundResult') {
      // Show the player's cake and the result overlay
      drawOrderCard(ctx, w, g.order, g.round, g.timeLeft, g.maxTime);
      drawCake(ctx, w / 2, h * 0.38, g.playerSpec, 0.9, g.frame);
      drawRoundResult(ctx, w, h, g);
    }

    // Particles
    for (const p of g.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Floating texts
    for (const ft of g.floatingTexts) {
      const alpha = ft.life / 60;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';

    animRef.current = requestAnimationFrame(gameLoop);
  }, [drawBackground, drawOrderCard, drawButtons, drawRoundResult, submitCake]);

  // --- Input Handling ---

  const handleCanvasInteraction = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const g = gameRef.current;

    if (phaseRef.current === 'start') {
      startGame();
      return;
    }

    if (phaseRef.current === 'gameover') {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const w = cRect.width;
      const h = cRect.height;

      // Check back link area (drawn near bottom of canvas)
      const topPad = h < 460 ? 0.06 : 0.03;
      const backLinkY = Math.min(h * (0.78 + topPad), h - 12);
      if (y > backLinkY - 12 && y < backLinkY + 8) {
        window.location.href = '/games';
        return;
      }

      startGame();
      return;
    }

    if (phaseRef.current === 'roundResult') {
      nextRound();
      return;
    }

    if (phaseRef.current === 'playing' && g) {
      const zones = getButtonZones(g.canvasW, g.canvasH, g.playerSpec);

      // Check layer buttons
      for (const btn of zones.layerButtons) {
        if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
          g.playerSpec.layers = btn.value as number;
          return;
        }
      }

      // Check frosting buttons
      for (const btn of zones.frostingButtons) {
        if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
          g.playerSpec.frostingIndex = btn.value as number;
          return;
        }
      }

      // Check decoration buttons
      for (const btn of zones.decoButtons) {
        if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
          const decoType = btn.value as DecoType;
          const idx = g.playerSpec.decorations.indexOf(decoType);
          if (idx >= 0) {
            g.playerSpec.decorations.splice(idx, 1);
          } else {
            g.playerSpec.decorations.push(decoType);
          }
          return;
        }
      }

      // Check serve button
      const srv = zones.serveButton;
      if (x >= srv.x && x <= srv.x + srv.w && y >= srv.y && y <= srv.y + srv.h) {
        submitCake();
        return;
      }
    }
  }, [startGame, nextRound, submitCake]);

  // --- Effects ---

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    if (phase === 'playing' || phase === 'roundResult') {
      if (gameRef.current) {
        gameRef.current.lastTime = performance.now();
      }
      animRef.current = requestAnimationFrame(gameLoop);
      return () => cancelAnimationFrame(animRef.current);
    }

    if (phase === 'start' || phase === 'gameover') {
      let frameCount = 0;
      const loop = () => {
        frameCount++;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        if (phaseRef.current === 'start') {
          drawStartScreen(ctx, w, h, frameCount);
        } else if (phaseRef.current === 'gameover' && gameRef.current) {
          drawGameOverScreen(ctx, w, h, gameRef.current, frameCount);
        }

        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(animRef.current);
    }
  }, [phase, gameLoop, drawStartScreen, drawGameOverScreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      handleCanvasInteraction(e.clientX, e.clientY);
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handleCanvasInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
    };
  }, [handleCanvasInteraction]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (phaseRef.current === 'start') {
          startGame();
        } else if (phaseRef.current === 'gameover') {
          startGame();
        } else if (phaseRef.current === 'roundResult') {
          nextRound();
        } else if (phaseRef.current === 'playing') {
          submitCake();
        }
      }

      if (phaseRef.current === 'playing' && gameRef.current) {
        const g = gameRef.current;
        if (e.key >= '1' && e.key <= '4') {
          g.playerSpec.layers = parseInt(e.key);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [startGame, nextRound, submitCake]);

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
          height: 650,
          maxHeight: 'calc(100dvh - 70px)',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
