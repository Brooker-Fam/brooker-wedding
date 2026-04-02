'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

const STORAGE_KEY = 'barnCatNinja_highScore';

type GameState = 'start' | 'playing' | 'gameover';

interface LaunchItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'mouse' | 'fatmouse' | 'goldmouse' | 'yarn' | 'skunk' | 'kitten';
  sliced: boolean;
  radius: number;
  rotation: number;
  rotSpeed: number;
  bounces: number;
}

interface SliceTrail {
  x: number;
  y: number;
  life: number;
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

export default function BarnCatNinja() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameRef = useRef<{
    score: number;
    lives: number;
    combo: number;
    multiplier: number;
    maxCombo: number;
    items: LaunchItem[];
    sliceTrail: SliceTrail[];
    particles: Particle[];
    floatingTexts: FloatingText[];
    frame: number;
    canvasW: number;
    canvasH: number;
    spawnTimer: number;
    spawnInterval: number;
    difficulty: number;
    frenzyMode: boolean;
    frenzyTimer: number;
    slicing: boolean;
    lastSliceX: number;
    lastSliceY: number;
    sliceSpeed: number;
    greenScreen: number;
    kittenWarning: number;
    pawTrail: { x: number; y: number; life: number }[];
    barnBeams: { x: number; y: number; w: number; angle: number }[];
  } | null>(null);
  const animRef = useRef<number>(0);

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
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const logicalW = rect.width;
    const logicalH = rect.height;
    if (gameRef.current) {
      gameRef.current.canvasW = logicalW;
      gameRef.current.canvasH = logicalH;
    }
  }, []);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const logicalW = rect.width;
    const logicalH = rect.height;

    const barnBeams = Array.from({ length: 6 }, (_, i) => ({
      x: (i + 0.5) * (logicalW / 6),
      y: 0,
      w: 8 + Math.random() * 4,
      angle: (Math.random() - 0.5) * 0.3,
    }));

    gameRef.current = {
      score: 0,
      lives: 3,
      combo: 0,
      multiplier: 1,
      maxCombo: 0,
      items: [],
      sliceTrail: [],
      particles: [],
      floatingTexts: [],
      frame: 0,
      canvasW: logicalW,
      canvasH: logicalH,
      spawnTimer: 0,
      spawnInterval: 80,
      difficulty: 1,
      frenzyMode: false,
      frenzyTimer: 0,
      slicing: false,
      lastSliceX: 0,
      lastSliceY: 0,
      sliceSpeed: 0,
      greenScreen: 0,
      kittenWarning: 0,
      pawTrail: [],
      barnBeams,
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
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 25 + Math.random() * 25,
        maxLife: 50,
        color,
        size: 2 + Math.random() * 4,
      });
    }
  }, []);

  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    const g = gameRef.current;
    if (!g) return;
    g.floatingTexts.push({ x, y, text, color, life: 50 });
  }, []);

  const spawnWave = useCallback((g: NonNullable<typeof gameRef.current>) => {
    const count = Math.min(5, 1 + Math.floor(g.difficulty / 2) + Math.floor(Math.random() * 2));

    for (let i = 0; i < count; i++) {
      const r = Math.random();
      let type: LaunchItem['type'];
      const dangerChance = Math.min(0.25, 0.05 + g.difficulty * 0.02);

      if (r < dangerChance * 0.6) {
        type = 'skunk';
      } else if (r < dangerChance) {
        type = 'kitten';
      } else if (r < dangerChance + 0.1) {
        type = 'yarn';
      } else if (r < dangerChance + 0.15) {
        type = 'goldmouse';
      } else if (r < dangerChance + 0.3) {
        type = 'fatmouse';
      } else {
        type = 'mouse';
      }

      const radius =
        type === 'fatmouse' ? 18 : type === 'goldmouse' ? 14 : type === 'yarn' ? 16 : type === 'skunk' ? 16 : type === 'kitten' ? 12 : 12;

      const launchX = g.canvasW * 0.1 + Math.random() * g.canvasW * 0.8;
      const launchVX = (Math.random() - 0.5) * 4;
      const launchVY = -(8 + Math.random() * 4 + g.difficulty * 0.3);

      g.items.push({
        x: launchX,
        y: g.canvasH + 20,
        vx: launchVX,
        vy: launchVY,
        type,
        sliced: false,
        radius,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        bounces: 0,
      });
    }
  }, []);

  const sliceItem = useCallback(
    (item: LaunchItem, g: NonNullable<typeof gameRef.current>) => {
      if (item.sliced) return;
      item.sliced = true;

      if (item.type === 'skunk') {
        g.lives--;
        g.combo = 0;
        g.multiplier = 1;
        g.greenScreen = 60;
        addParticles(item.x, item.y, '#228B22', 20);
        addFloatingText(item.x, item.y - 20, 'SKUNK! -1', '#228B22');

        if (g.lives <= 0) {
          const hs = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
          if (g.score > hs) {
            localStorage.setItem(STORAGE_KEY, g.score.toString());
            setHighScore(g.score);
          }
          setScore(g.score);
          setGameState('gameover');
          return;
        }
      } else if (item.type === 'kitten') {
        g.lives--;
        g.combo = 0;
        g.multiplier = 1;
        g.kittenWarning = 90;
        addParticles(item.x, item.y, '#FF69B4', 15);
        addFloatingText(item.x, item.y - 20, "DON'T SWAT BABIES!", '#FF69B4');

        if (g.lives <= 0) {
          const hs = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
          if (g.score > hs) {
            localStorage.setItem(STORAGE_KEY, g.score.toString());
            setHighScore(g.score);
          }
          setScore(g.score);
          setGameState('gameover');
          return;
        }
      } else {
        const basePoints =
          item.type === 'mouse' ? 10 : item.type === 'fatmouse' ? 25 : item.type === 'goldmouse' ? 50 : 15;
        const pts = basePoints * g.multiplier;

        g.combo++;
        if (g.combo > g.maxCombo) g.maxCombo = g.combo;
        g.multiplier = Math.min(8, 1 + Math.floor(g.combo / 3));
        g.score += pts;
        setScore(g.score);

        const colors: Record<string, string> = {
          mouse: '#808080',
          fatmouse: '#A0522D',
          goldmouse: '#FFD700',
          yarn: '#FF69B4',
        };
        addParticles(item.x, item.y, colors[item.type] || '#FFF', 12);
        addFloatingText(item.x, item.y - 20, `+${pts}`, item.type === 'goldmouse' ? '#FFD700' : '#FFF8DC');

        if (g.combo >= 5 && !g.frenzyMode) {
          g.frenzyMode = true;
          g.frenzyTimer = 180;
          addFloatingText(g.canvasW / 2, g.canvasH * 0.3, 'FRENZY MODE!', '#FF4444');
        }
      }
    },
    [addParticles, addFloatingText],
  );

  const checkSlice = useCallback(
    (x: number, y: number) => {
      const g = gameRef.current;
      if (!g) return;

      g.pawTrail.push({ x, y, life: 15 });

      if (!g.slicing) return;

      const dx = x - g.lastSliceX;
      const dy = y - g.lastSliceY;
      g.sliceSpeed = Math.sqrt(dx * dx + dy * dy);

      if (g.sliceSpeed < 3) return;

      g.sliceTrail.push({ x, y, life: 12 });

      for (const item of g.items) {
        if (item.sliced) continue;
        const ix = item.x - x;
        const iy = item.y - y;
        const dist = Math.sqrt(ix * ix + iy * iy);
        if (dist < item.radius + 10) {
          sliceItem(item, g);
        }
      }
    },
    [sliceItem],
  );

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const g = gameRef.current;
    if (!canvas || !ctx || !g) return;

    g.frame++;
    g.difficulty = 1 + g.score / 150;

    const timeScale = g.frenzyMode ? 0.4 : 1;

    // Spawn
    g.spawnTimer++;
    const interval = Math.max(30, g.spawnInterval - g.difficulty * 4);
    if (g.spawnTimer >= interval) {
      spawnWave(g);
      g.spawnTimer = 0;
    }

    // Update items
    g.items = g.items.filter((item) => {
      item.vy += 0.25 * timeScale;
      item.x += item.vx * timeScale;
      item.y += item.vy * timeScale;
      item.rotation += item.rotSpeed * timeScale;

      // Yarn bounces
      if (item.type === 'yarn' && !item.sliced) {
        if (item.x < item.radius || item.x > g.canvasW - item.radius) {
          item.vx *= -0.8;
          item.x = Math.max(item.radius, Math.min(g.canvasW - item.radius, item.x));
          item.bounces++;
        }
      }

      return item.y < g.canvasH + 40 || (item.sliced && item.y < g.canvasH + 100);
    });

    // Update frenzy
    if (g.frenzyMode) {
      g.frenzyTimer--;
      if (g.frenzyTimer <= 0) {
        g.frenzyMode = false;
      }
    }

    // Timers
    if (g.greenScreen > 0) g.greenScreen--;
    if (g.kittenWarning > 0) g.kittenWarning--;

    // Update trails
    g.sliceTrail = g.sliceTrail.filter((t) => {
      t.life--;
      return t.life > 0;
    });
    g.pawTrail = g.pawTrail.filter((t) => {
      t.life--;
      return t.life > 0;
    });

    // Update particles
    g.particles = g.particles.filter((p) => {
      p.x += p.vx * timeScale;
      p.y += p.vy * timeScale;
      p.vy += 0.15;
      p.life--;
      return p.life > 0;
    });

    // Update floating texts
    g.floatingTexts = g.floatingTexts.filter((f) => {
      f.y -= 1.5;
      f.life--;
      return f.life > 0;
    });

    // ===== RENDER =====
    // Barn interior background
    const barnGrad = ctx.createLinearGradient(0, 0, 0, g.canvasH);
    barnGrad.addColorStop(0, '#4a2000');
    barnGrad.addColorStop(0.3, '#5a2800');
    barnGrad.addColorStop(1, '#3a1800');
    ctx.fillStyle = barnGrad;
    ctx.fillRect(0, 0, g.canvasW, g.canvasH);

    // Barn wall planks
    ctx.strokeStyle = '#3a1600';
    ctx.lineWidth = 1;
    for (let y = 0; y < g.canvasH; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(g.canvasW, y);
      ctx.stroke();
    }
    for (let x = 0; x < g.canvasW; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x + Math.sin(x * 0.1) * 5, 0);
      ctx.lineTo(x + Math.sin(x * 0.1) * 5, g.canvasH);
      ctx.stroke();
    }

    // Beams
    ctx.fillStyle = '#6a3200';
    g.barnBeams.forEach((beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate(beam.angle);
      ctx.fillRect(-beam.w / 2, 0, beam.w, g.canvasH);
      ctx.restore();
    });

    // Hay on floor
    ctx.fillStyle = '#DAA520';
    for (let x = 0; x < g.canvasW; x += 8) {
      const h = 4 + Math.sin(x * 0.3) * 3;
      ctx.fillRect(x, g.canvasH - h, 6, h);
    }

    // Green screen overlay (skunk)
    if (g.greenScreen > 0) {
      ctx.globalAlpha = (g.greenScreen / 60) * 0.3;
      ctx.fillStyle = '#228B22';
      ctx.fillRect(0, 0, g.canvasW, g.canvasH);
      ctx.globalAlpha = 1;
    }

    // Frenzy mode effect
    if (g.frenzyMode) {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#FF4444';
      ctx.fillRect(0, 0, g.canvasW, g.canvasH);
      ctx.globalAlpha = 1;

      // Frenzy border
      ctx.strokeStyle = '#FF4444';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.3 + 0.2 * Math.sin(g.frame * 0.1);
      ctx.strokeRect(4, 4, g.canvasW - 8, g.canvasH - 8);
      ctx.globalAlpha = 1;
    }

    // Slice trail
    if (g.sliceTrail.length > 1) {
      ctx.strokeStyle = '#FFF8DC';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      let started = false;
      g.sliceTrail.forEach((t) => {
        ctx.globalAlpha = t.life / 12;
        if (!started) {
          ctx.moveTo(t.x, t.y);
          started = true;
        } else {
          ctx.lineTo(t.x, t.y);
        }
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Paw trail
    g.pawTrail.forEach((p) => {
      ctx.globalAlpha = (p.life / 15) * 0.4;
      ctx.fillStyle = '#DAA520';
      // Paw pad
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
      // Toe beans
      ctx.beginPath();
      ctx.arc(p.x - 4, p.y - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x + 4, p.y - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y - 7, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw items
    g.items.forEach((item) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);

      if (item.sliced) {
        ctx.globalAlpha = 0.5;
      }

      const r = item.radius;

      if (item.type === 'mouse') {
        // Body
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(-6, -r * 0.5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -r * 0.5, 4, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(-3, -2, 2, 2);
        ctx.fillRect(3, -2, 2, 2);
        // Tail
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r - 2, 0);
        ctx.quadraticCurveTo(r + 6, -4, r + 10, 2);
        ctx.stroke();
      } else if (item.type === 'fatmouse') {
        // Big round body
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        // Belly
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.arc(0, 3, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(-8, -r + 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(8, -r + 2, 5, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(-4, -3, 3, 3);
        ctx.fillRect(4, -3, 3, 3);
        // Whiskers
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(-r - 6, -3);
        ctx.moveTo(-r, 2);
        ctx.lineTo(-r - 6, 4);
        ctx.moveTo(r, 0);
        ctx.lineTo(r + 6, -3);
        ctx.moveTo(r, 2);
        ctx.lineTo(r + 6, 4);
        ctx.stroke();
      } else if (item.type === 'goldmouse') {
        // Sparkly gold body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Shimmer
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.4 + 0.3 * Math.sin(g.frame * 0.2);
        ctx.beginPath();
        ctx.ellipse(-2, -3, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = item.sliced ? 0.5 : 1;
        // Crown
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-5, -r - 4, 10, 4);
        ctx.fillRect(-6, -r - 7, 3, 3);
        ctx.fillRect(-1, -r - 7, 3, 3);
        ctx.fillRect(4, -r - 7, 3, 3);
        // Eyes
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(-3, -2, 2, 2);
        ctx.fillRect(3, -2, 2, 2);
      } else if (item.type === 'yarn') {
        // Yarn ball
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        // Yarn pattern
        ctx.strokeStyle = '#FF1493';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.6, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.3, Math.PI, Math.PI * 2);
        ctx.stroke();
        // Trailing string
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.quadraticCurveTo(r + 8, 6, r + 12, -2);
        ctx.stroke();
      } else if (item.type === 'skunk') {
        // Body
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        // White stripe
        ctx.fillStyle = '#FFF';
        ctx.fillRect(-2, -r * 0.8, 4, r * 1.6);
        // Tail
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.moveTo(-r + 2, 0);
        ctx.quadraticCurveTo(-r - 8, -10, -r - 4, -16);
        ctx.quadraticCurveTo(-r - 2, -10, -r + 2, -2);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.fillRect(-r - 3, -12, 2, 6);
        // Eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-4, -3, 3, 3);
        ctx.fillRect(3, -3, 3, 3);
        // Warning
        if (!item.sliced) {
          ctx.fillStyle = '#FF0000';
          ctx.globalAlpha = 0.5 + 0.3 * Math.sin(g.frame * 0.15);
          ctx.font = '8px "Press Start 2P", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('!', 0, -r - 6);
          ctx.globalAlpha = item.sliced ? 0.5 : 1;
        }
      } else if (item.type === 'kitten') {
        // Cute kitten
        ctx.fillStyle = '#FFB347';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.fillStyle = '#FFB347';
        ctx.beginPath();
        ctx.moveTo(-r + 2, -r + 4);
        ctx.lineTo(-r + 1, -r - 5);
        ctx.lineTo(-r + 8, -r + 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(r - 2, -r + 4);
        ctx.lineTo(r - 1, -r - 5);
        ctx.lineTo(r - 8, -r + 2);
        ctx.fill();
        // Inner ear
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.moveTo(-r + 3, -r + 3);
        ctx.lineTo(-r + 2, -r - 3);
        ctx.lineTo(-r + 7, -r + 2);
        ctx.fill();
        // Big cute eyes
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.arc(-3, -1, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(3, -1, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Eye shine
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(-2, -2, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4, -2, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Nose
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(0, 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Mouth
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 3.5);
        ctx.lineTo(-2, 5);
        ctx.moveTo(0, 3.5);
        ctx.lineTo(2, 5);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    });

    // Particles
    g.particles.forEach((p) => {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;

    // Floating texts
    g.floatingTexts.forEach((f) => {
      ctx.globalAlpha = Math.min(1, f.life / 25);
      ctx.fillStyle = f.color;
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(f.text, f.x, f.y);
    });
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';

    // Kitten warning
    if (g.kittenWarning > 0) {
      ctx.globalAlpha = Math.min(1, g.kittenWarning / 30);
      ctx.fillStyle = '#FF69B4';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText("DON'T SWAT THE BABIES!", g.canvasW / 2, g.canvasH * 0.2);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    }

    // HUD
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, g.canvasW, 36);
    ctx.globalAlpha = 1;

    // Score
    ctx.fillStyle = '#FFF8DC';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`${g.score}`, 10, 16);

    // Combo
    if (g.combo > 1) {
      ctx.fillStyle = '#DAA520';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillText(`${g.multiplier}x`, 10, 30);
    }

    // Frenzy timer
    if (g.frenzyMode) {
      ctx.fillStyle = '#FF4444';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`FRENZY ${Math.ceil(g.frenzyTimer / 60)}s`, g.canvasW / 2, 16);
      ctx.textAlign = 'left';
    }

    // Lives
    ctx.fillStyle = '#FF69B4';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    let hearts = '';
    for (let i = 0; i < g.lives; i++) hearts += '\u2665 ';
    ctx.fillText(hearts, g.canvasW - 10, 16);
    ctx.textAlign = 'left';

    animRef.current = requestAnimationFrame(gameLoop);
  }, [spawnWave, addParticles, addFloatingText, sliceItem]);

  const startGame = useCallback(() => {
    resize();
    initGame();
    setScore(0);
    setGameState('playing');
  }, [resize, initGame]);

  useEffect(() => {
    if (gameState === 'playing') {
      animRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameState, gameLoop]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  // Touch/mouse controls
  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      const g = gameRef.current;
      if (!g) return;
      const pos = getPos(e.clientX, e.clientY);
      g.slicing = true;
      g.lastSliceX = pos.x;
      g.lastSliceY = pos.y;
      checkSlice(pos.x, pos.y);
    };

    const onMouseMove = (e: MouseEvent) => {
      const g = gameRef.current;
      if (!g) return;
      const pos = getPos(e.clientX, e.clientY);
      if (g.slicing) {
        checkSlice(pos.x, pos.y);
        g.lastSliceX = pos.x;
        g.lastSliceY = pos.y;
      } else {
        g.pawTrail.push({ x: pos.x, y: pos.y, life: 10 });
      }
    };

    const onMouseUp = () => {
      const g = gameRef.current;
      if (g) {
        g.slicing = false;
        g.combo = 0;
        g.multiplier = 1;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const g = gameRef.current;
      if (!g) return;
      const pos = getPos(e.touches[0].clientX, e.touches[0].clientY);
      g.slicing = true;
      g.lastSliceX = pos.x;
      g.lastSliceY = pos.y;
      checkSlice(pos.x, pos.y);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const g = gameRef.current;
      if (!g) return;
      const pos = getPos(e.touches[0].clientX, e.touches[0].clientY);
      checkSlice(pos.x, pos.y);
      g.lastSliceX = pos.x;
      g.lastSliceY = pos.y;
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const g = gameRef.current;
      if (g) {
        g.slicing = false;
        g.combo = 0;
        g.multiplier = 1;
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [gameState, checkSlice]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        background: '#3a1800',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Press Start 2P", monospace',
        touchAction: 'none',
        cursor: 'none',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      {gameState === 'start' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)',
            color: '#FFF8DC',
            padding: '20px',
            textAlign: 'center',
            cursor: 'default',
          }}
        >
          <div style={{ fontSize: 'clamp(14px, 4vw, 24px)', color: '#DAA520', marginBottom: '16px' }}>
            BARN CAT NINJA
          </div>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🐱🐭</div>
          <div style={{ fontSize: '7px', lineHeight: 2.2, maxWidth: '300px', marginBottom: '16px' }}>
            <p>SWIPE to swat things flying up!</p>
            <p style={{ color: '#808080' }}>Mice +10 | Fat Mouse +25</p>
            <p style={{ color: '#FFD700' }}>Gold Mouse +50 (fast!)</p>
            <p style={{ color: '#FF69B4' }}>Yarn +15 (bounces!)</p>
            <p style={{ color: '#228B22' }}>AVOID skunks! (stinky!)</p>
            <p style={{ color: '#FFB347' }}>AVOID kittens! (babies!)</p>
            <p>5x combo = FRENZY MODE!</p>
          </div>
          {highScore > 0 && (
            <div style={{ fontSize: '8px', color: '#DAA520', marginBottom: '12px' }}>
              HIGH SCORE: {highScore}
            </div>
          )}
          <button
            onClick={startGame}
            style={{
              fontSize: '12px',
              padding: '12px 32px',
              background: '#8B2500',
              color: '#FFF8DC',
              border: '3px solid #DAA520',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            SWAT!
          </button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)',
            color: '#FFF8DC',
            padding: '20px',
            textAlign: 'center',
            cursor: 'default',
          }}
        >
          <div style={{ fontSize: 'clamp(14px, 4vw, 22px)', color: '#8B2500', marginBottom: '12px' }}>
            CAT NAP TIME
          </div>
          <div style={{ fontSize: '30px', marginBottom: '8px' }}>🐱💤</div>
          <div style={{ fontSize: '12px', marginBottom: '6px' }}>SCORE: {score}</div>
          <div style={{ fontSize: '8px', color: '#DAA520', marginBottom: '4px' }}>
            MAX COMBO: {gameRef.current?.maxCombo || 0}x
          </div>
          {score >= highScore && score > 0 && (
            <div style={{ fontSize: '10px', color: '#DAA520', marginBottom: '8px' }}>NEW HIGH SCORE!</div>
          )}
          <div style={{ fontSize: '8px', color: '#87CEEB', marginBottom: '16px' }}>
            BEST: {Math.max(score, highScore)}
          </div>
          <button
            onClick={startGame}
            style={{
              fontSize: '12px',
              padding: '12px 32px',
              background: '#8B2500',
              color: '#FFF8DC',
              border: '3px solid #DAA520',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            PLAY AGAIN
          </button>
          <a
            href="/games"
            style={{ fontSize: '8px', color: '#87CEEB', marginTop: '16px', textDecoration: 'none' }}
          >
            {'< BACK TO ARCADE'}
          </a>
        </div>
      )}
    </div>
  );
}
