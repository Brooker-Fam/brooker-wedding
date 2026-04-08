/* eslint-disable @next/next/no-page-custom-font, react-hooks/immutability */
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

const STORAGE_KEY = 'duckDuckGoose_highScore';

type GameState = 'start' | 'playing' | 'gameover';

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'fence' | 'haybale';
}

interface Collectible {
  x: number;
  y: number;
  type: 'breadcrumb' | 'corn' | 'goldcorn';
  collected: boolean;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'speed' | 'invincibility';
  collected: boolean;
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

export default function DuckDuckGoose() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameRef = useRef<{
    duck: { x: number; y: number; vy: number; jumping: boolean; ducking: boolean; w: number; h: number };
    goose: { x: number; distance: number };
    obstacles: Obstacle[];
    collectibles: Collectible[];
    powerUps: PowerUp[];
    particles: Particle[];
    groundY: number;
    scrollSpeed: number;
    scrollX: number;
    score: number;
    frame: number;
    invincible: number;
    speedBoost: number;
    hitCooldown: number;
    canvasW: number;
    canvasH: number;
    lastObstacleX: number;
    lastCollectibleX: number;
    lastPowerUpX: number;
    duckAnimFrame: number;
    gooseAnimFrame: number;
    clouds: { x: number; y: number; w: number; speed: number }[];
    grassTufts: { x: number; type: number }[];
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
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const logicalW = rect.width;
    const logicalH = rect.height;
    if (gameRef.current) {
      gameRef.current.canvasW = logicalW;
      gameRef.current.canvasH = logicalH;
      gameRef.current.groundY = logicalH - 60;
    }
  }, []);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const logicalW = rect.width;
    const logicalH = rect.height;
    const groundY = logicalH - 60;

    const clouds = Array.from({ length: 5 }, (_, i) => ({
      x: (i * logicalW) / 3 + Math.random() * 100,
      y: 20 + Math.random() * 60,
      w: 40 + Math.random() * 60,
      speed: 0.2 + Math.random() * 0.3,
    }));

    const grassTufts = Array.from({ length: 40 }, (_, i) => ({
      x: i * (logicalW / 20) + Math.random() * 30,
      type: Math.floor(Math.random() * 3),
    }));

    gameRef.current = {
      duck: { x: 60, y: groundY - 28, vy: 0, jumping: false, ducking: false, w: 28, h: 28 },
      goose: { x: -80, distance: 120 },
      obstacles: [],
      collectibles: [],
      powerUps: [],
      particles: [],
      groundY,
      scrollSpeed: 3,
      scrollX: 0,
      score: 0,
      frame: 0,
      invincible: 0,
      speedBoost: 0,
      hitCooldown: 0,
      canvasW: logicalW,
      canvasH: logicalH,
      lastObstacleX: logicalW + 100,
      lastCollectibleX: logicalW + 50,
      lastPowerUpX: logicalW + 400,
      duckAnimFrame: 0,
      gooseAnimFrame: 0,
      clouds,
      grassTufts,
    };
  }, []);

  const spawnObstacle = useCallback((g: NonNullable<typeof gameRef.current>) => {
    const gap = 180 + Math.random() * 120;
    if (g.lastObstacleX < g.canvasW + gap) return;
    const isFence = Math.random() > 0.4;
    const obs: Obstacle = {
      x: g.canvasW + 20,
      y: isFence ? g.groundY - 30 : g.groundY - 22,
      w: isFence ? 16 : 36,
      h: isFence ? 30 : 22,
      type: isFence ? 'fence' : 'haybale',
    };
    g.obstacles.push(obs);
    g.lastObstacleX = 0;
  }, []);

  const spawnCollectible = useCallback((g: NonNullable<typeof gameRef.current>) => {
    const gap = 80 + Math.random() * 100;
    if (g.lastCollectibleX < g.canvasW + gap) return;
    const r = Math.random();
    const type = r < 0.6 ? 'breadcrumb' : r < 0.9 ? 'corn' : 'goldcorn';
    const yOffset = Math.random() > 0.5 ? 0 : 30 + Math.random() * 20;
    g.collectibles.push({
      x: g.canvasW + 20,
      y: g.groundY - 14 - yOffset,
      type,
      collected: false,
    });
    g.lastCollectibleX = 0;
  }, []);

  const spawnPowerUp = useCallback((g: NonNullable<typeof gameRef.current>) => {
    if (g.lastPowerUpX < g.canvasW + 600) return;
    if (Math.random() > 0.3) return;
    g.powerUps.push({
      x: g.canvasW + 20,
      y: g.groundY - 50 - Math.random() * 20,
      type: Math.random() > 0.5 ? 'speed' : 'invincibility',
      collected: false,
    });
    g.lastPowerUpX = 0;
  }, []);

  const addParticles = useCallback(
    (x: number, y: number, color: string, count: number) => {
      const g = gameRef.current;
      if (!g) return;
      for (let i = 0; i < count; i++) {
        g.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 3 - 1,
          life: 30 + Math.random() * 20,
          maxLife: 50,
          color,
          size: 2 + Math.random() * 3,
        });
      }
    },
    [],
  );

  const collides = (
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    bx: number,
    by: number,
    bw: number,
    bh: number,
  ) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const g = gameRef.current;
    if (!canvas || !ctx || !g) return;

    g.frame++;
    g.duckAnimFrame = Math.floor(g.frame / 6) % 4;
    g.gooseAnimFrame = Math.floor(g.frame / 5) % 4;

    const speed = g.scrollSpeed + (g.speedBoost > 0 ? 2 : 0);

    // Update scroll
    g.scrollX += speed;
    g.lastObstacleX += speed;
    g.lastCollectibleX += speed;
    g.lastPowerUpX += speed;

    // Increase difficulty
    g.scrollSpeed = 3 + g.score / 300;
    if (g.scrollSpeed > 9) g.scrollSpeed = 9;

    // Duck physics
    if (g.duck.jumping) {
      g.duck.vy += 0.6;
      g.duck.y += g.duck.vy;
      if (g.duck.y >= g.groundY - (g.duck.ducking ? 14 : 28)) {
        g.duck.y = g.groundY - (g.duck.ducking ? 14 : 28);
        g.duck.jumping = false;
        g.duck.vy = 0;
      }
    }

    // Duck dimensions
    g.duck.h = g.duck.ducking ? 14 : 28;
    if (g.duck.ducking) {
      g.duck.y = g.groundY - 14;
    }

    // Spawn
    spawnObstacle(g);
    spawnCollectible(g);
    spawnPowerUp(g);

    // Move obstacles
    g.obstacles = g.obstacles.filter((o) => {
      o.x -= speed;
      return o.x > -50;
    });

    // Move collectibles
    g.collectibles = g.collectibles.filter((c) => {
      c.x -= speed;
      return c.x > -50 && !c.collected;
    });

    // Move power-ups
    g.powerUps = g.powerUps.filter((p) => {
      p.x -= speed;
      return p.x > -50 && !p.collected;
    });

    // Update particles
    g.particles = g.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
      return p.life > 0;
    });

    // Timers
    if (g.invincible > 0) g.invincible--;
    if (g.speedBoost > 0) g.speedBoost--;
    if (g.hitCooldown > 0) g.hitCooldown--;

    // Collision with obstacles
    for (const obs of g.obstacles) {
      if (
        g.hitCooldown <= 0 &&
        g.invincible <= 0 &&
        collides(g.duck.x, g.duck.y, g.duck.w, g.duck.h, obs.x, obs.y, obs.w, obs.h)
      ) {
        g.goose.distance -= 30;
        g.hitCooldown = 30;
        addParticles(g.duck.x, g.duck.y, '#FF4444', 8);

        if (g.goose.distance <= 0) {
          const hs = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
          if (g.score > hs) {
            localStorage.setItem(STORAGE_KEY, g.score.toString());
            setHighScore(g.score);
          }
          setScore(g.score);
          setGameState('gameover');
          return;
        }
      }
    }

    // Collect items
    for (const c of g.collectibles) {
      if (!c.collected && collides(g.duck.x, g.duck.y, g.duck.w, g.duck.h, c.x - 6, c.y - 6, 12, 12)) {
        c.collected = true;
        const pts = c.type === 'breadcrumb' ? 1 : c.type === 'corn' ? 5 : 20;
        g.score += pts;
        setScore(g.score);
        const colors: Record<string, string> = { breadcrumb: '#DAA520', corn: '#FFD700', goldcorn: '#FFD700' };
        addParticles(c.x, c.y, colors[c.type], c.type === 'goldcorn' ? 12 : 5);
      }
    }

    // Collect power-ups
    for (const p of g.powerUps) {
      if (!p.collected && collides(g.duck.x, g.duck.y, g.duck.w, g.duck.h, p.x - 8, p.y - 8, 16, 16)) {
        p.collected = true;
        if (p.type === 'speed') {
          g.speedBoost = 180;
          addParticles(p.x, p.y, '#87CEEB', 10);
        } else {
          g.invincible = 240;
          addParticles(p.x, p.y, '#FF69B4', 15);
        }
      }
    }

    // Goose slowly approaches (recovers distance naturally too)
    g.goose.distance = Math.min(g.goose.distance + 0.02, 120);

    // Clouds
    g.clouds.forEach((c) => {
      c.x -= c.speed;
      if (c.x + c.w < 0) {
        c.x = g.canvasW + 20;
        c.y = 20 + Math.random() * 60;
      }
    });

    // ===== RENDER =====
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, g.groundY);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#B0E0E6');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, g.canvasW, g.canvasH);

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(g.canvasW - 50, 40, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF8DC';
    ctx.beginPath();
    ctx.arc(g.canvasW - 50, 40, 14, 0, Math.PI * 2);
    ctx.fill();

    // Clouds
    ctx.fillStyle = '#FFFFFF';
    g.clouds.forEach((c) => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w / 2, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x - c.w / 4, c.y - 5, c.w / 3, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.w / 4, c.y - 3, c.w / 3, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Far hills
    ctx.fillStyle = '#3CB371';
    ctx.beginPath();
    ctx.moveTo(0, g.groundY);
    for (let x = 0; x <= g.canvasW; x += 40) {
      ctx.lineTo(x, g.groundY - 20 - Math.sin((x + g.scrollX * 0.2) * 0.015) * 15);
    }
    ctx.lineTo(g.canvasW, g.groundY);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, g.groundY, g.canvasW, g.canvasH - g.groundY);

    // Ground detail line
    ctx.fillStyle = '#1a7a1a';
    ctx.fillRect(0, g.groundY, g.canvasW, 3);

    // Grass tufts
    ctx.strokeStyle = '#2E8B2E';
    ctx.lineWidth = 1;
    g.grassTufts.forEach((t) => {
      const gx = ((t.x - g.scrollX * 0.5) % (g.canvasW + 40)) - 20;
      ctx.beginPath();
      ctx.moveTo(gx, g.groundY + 4);
      ctx.lineTo(gx - 2, g.groundY - 2);
      ctx.moveTo(gx, g.groundY + 4);
      ctx.lineTo(gx + 2, g.groundY - 3);
      ctx.stroke();
    });

    // Obstacles
    g.obstacles.forEach((obs) => {
      if (obs.type === 'fence') {
        // Fence post
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(obs.x, obs.y, 4, obs.h);
        ctx.fillRect(obs.x + 10, obs.y, 4, obs.h);
        // Rails
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(obs.x - 2, obs.y + 4, obs.w + 2, 3);
        ctx.fillRect(obs.x - 2, obs.y + 16, obs.w + 2, 3);
      } else {
        // Hay bale
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(obs.x, obs.y, obs.w, 3);
        // Hay lines
        ctx.strokeStyle = '#CD853F';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(obs.x + 2, obs.y + 6 + i * 6);
          ctx.lineTo(obs.x + obs.w - 2, obs.y + 6 + i * 6);
          ctx.stroke();
        }
      }
    });

    // Collectibles
    g.collectibles.forEach((c) => {
      if (c.collected) return;
      const bob = Math.sin(g.frame * 0.1 + c.x) * 2;
      if (c.type === 'breadcrumb') {
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(c.x - 2, c.y - 2 + bob, 5, 4);
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(c.x - 1, c.y - 1 + bob, 3, 2);
      } else if (c.type === 'corn') {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(c.x - 3, c.y - 5 + bob, 6, 10);
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(c.x - 2, c.y - 4 + bob, 4, 8);
        // Husk
        ctx.fillStyle = '#228B22';
        ctx.fillRect(c.x - 4, c.y - 3 + bob, 2, 6);
      } else {
        // Golden corn - sparkle
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(c.x - 4, c.y - 6 + bob, 8, 12);
        ctx.fillStyle = '#FFFFFF';
        const sparkle = Math.sin(g.frame * 0.3) > 0;
        if (sparkle) {
          ctx.fillRect(c.x - 1, c.y - 8 + bob, 2, 2);
          ctx.fillRect(c.x + 3, c.y - 3 + bob, 2, 2);
        }
      }
    });

    // Power-ups
    g.powerUps.forEach((p) => {
      if (p.collected) return;
      const bob = Math.sin(g.frame * 0.08 + p.x) * 3;
      if (p.type === 'speed') {
        // Lightning bolt
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(p.x - 2, p.y - 6 + bob, 6, 4);
        ctx.fillRect(p.x - 4, p.y - 2 + bob, 6, 4);
        ctx.fillRect(p.x, p.y + 2 + bob, 6, 4);
        // Glow
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.arc(p.x, p.y + bob, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        // Rainbow feather
        const colors = ['#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#0088FF', '#8800FF'];
        colors.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.fillRect(p.x - 3 + i, p.y - 6 + i + bob, 2, 8 - i);
        });
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(p.x, p.y + bob, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });

    // Goose (chaser)
    const gooseX = g.duck.x - g.goose.distance;
    const gooseY = g.groundY - 32;
    // Body
    ctx.fillStyle = '#DDDDDD';
    ctx.fillRect(gooseX, gooseY + 8, 20, 16);
    // Head
    ctx.fillStyle = '#EEEEEE';
    ctx.fillRect(gooseX + 16, gooseY, 10, 12);
    // Beak
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(gooseX + 24, gooseY + 4, 6, 4);
    // Eye
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(gooseX + 20, gooseY + 2, 3, 3);
    // Legs
    ctx.fillStyle = '#FF6600';
    const legOff = g.gooseAnimFrame % 2 === 0 ? 0 : 2;
    ctx.fillRect(gooseX + 4, gooseY + 24, 3, 6 + legOff);
    ctx.fillRect(gooseX + 12, gooseY + 24, 3, 6 - legOff + 2);
    // Angry marks
    if (g.goose.distance < 60) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(gooseX + 26, gooseY - 6, 2, 4);
      ctx.fillRect(gooseX + 30, gooseY - 4, 2, 4);
    }

    // Duck (player)
    const duckY = g.duck.y;
    const ducking = g.duck.ducking;
    const duckX = g.duck.x;

    // Invincibility glow
    if (g.invincible > 0) {
      const colors = ['#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#0088FF', '#8800FF'];
      const ci = Math.floor(g.frame / 4) % colors.length;
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = colors[ci];
      ctx.beginPath();
      ctx.arc(duckX + 14, duckY + (ducking ? 7 : 14), ducking ? 16 : 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Speed boost trail
    if (g.speedBoost > 0) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#87CEEB';
      for (let i = 1; i <= 3; i++) {
        ctx.fillRect(duckX - i * 8, duckY + 4, 6, ducking ? 8 : 18);
      }
      ctx.globalAlpha = 1;
    }

    if (ducking) {
      // Ducking duck (flat)
      ctx.fillStyle = '#DAA520';
      ctx.fillRect(duckX, duckY, 28, 14);
      // Head
      ctx.fillStyle = '#228B22';
      ctx.fillRect(duckX + 20, duckY, 10, 10);
      // Beak
      ctx.fillStyle = '#FF8800';
      ctx.fillRect(duckX + 28, duckY + 4, 5, 3);
      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(duckX + 24, duckY + 2, 2, 2);
    } else {
      // Body
      ctx.fillStyle = '#DAA520';
      ctx.fillRect(duckX, duckY + 6, 22, 18);
      // Wing
      ctx.fillStyle = '#B8860B';
      const wingOff = g.duckAnimFrame < 2 ? 0 : 2;
      ctx.fillRect(duckX + 2, duckY + 8 + wingOff, 12, 8);
      // Head
      ctx.fillStyle = '#228B22';
      ctx.fillRect(duckX + 14, duckY, 14, 12);
      // Beak
      ctx.fillStyle = '#FF8800';
      ctx.fillRect(duckX + 26, duckY + 4, 6, 4);
      // Eye
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(duckX + 20, duckY + 2, 4, 4);
      ctx.fillStyle = '#000';
      ctx.fillRect(duckX + 22, duckY + 3, 2, 2);
      // Legs
      ctx.fillStyle = '#FF8800';
      const legAnim = g.duckAnimFrame;
      ctx.fillRect(duckX + 4 + (legAnim % 2) * 2, duckY + 24, 3, 4);
      ctx.fillRect(duckX + 14 - (legAnim % 2) * 2, duckY + 24, 3, 4);
    }

    // Hit flash
    if (g.hitCooldown > 0 && g.hitCooldown % 4 < 2) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(duckX, duckY, 28, ducking ? 14 : 28);
      ctx.globalAlpha = 1;
    }

    // Particles
    g.particles.forEach((p) => {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;

    // Goose distance indicator
    const distPct = Math.max(0, Math.min(1, g.goose.distance / 120));
    const barW = 80;
    const barH = 8;
    const barX = 10;
    const barY = 40;
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
    ctx.globalAlpha = 1;
    const barColor = distPct > 0.5 ? '#228B22' : distPct > 0.25 ? '#DAA520' : '#8B2500';
    ctx.fillStyle = barColor;
    ctx.fillRect(barX, barY, barW * distPct, barH);
    ctx.fillStyle = '#FFF8DC';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('GOOSE', barX, barY - 3);

    // Score
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(g.canvasW - 110, 6, 104, 18);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFF8DC';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${g.score}`, g.canvasW - 12, 20);
    ctx.textAlign = 'left';

    // Active power-up indicators
    if (g.invincible > 0) {
      ctx.fillStyle = '#FF69B4';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillText(`INVINCIBLE ${Math.ceil(g.invincible / 60)}s`, 10, 60);
    }
    if (g.speedBoost > 0) {
      ctx.fillStyle = '#87CEEB';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillText(`SPEED ${Math.ceil(g.speedBoost / 60)}s`, 10, g.invincible > 0 ? 74 : 60);
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, [spawnObstacle, spawnCollectible, spawnPowerUp, addParticles]);

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

  // Controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const jump = () => {
      const g = gameRef.current;
      if (!g) return;
      if (!g.duck.jumping) {
        g.duck.jumping = true;
        g.duck.vy = -10;
        g.duck.ducking = false;
      }
    };

    const startDuck = () => {
      const g = gameRef.current;
      if (!g) return;
      if (!g.duck.jumping) {
        g.duck.ducking = true;
      }
    };

    const stopDuck = () => {
      const g = gameRef.current;
      if (!g) return;
      g.duck.ducking = false;
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (dy > 30) {
        startDuck();
        setTimeout(stopDuck, 500);
      } else {
        jump();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        startDuck();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        stopDuck();
      }
    };

    const canvas = canvasRef.current;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas?.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas?.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas?.removeEventListener('touchstart', handleTouchStart);
      canvas?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        background: '#87CEEB',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Press Start 2P", monospace',
        touchAction: 'none',
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
            background: 'rgba(0,0,0,0.7)',
            color: '#FFF8DC',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'clamp(16px, 5vw, 28px)', color: '#DAA520', marginBottom: '20px' }}>
            DUCK DUCK GOOSE
          </div>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🦆</div>
          <div style={{ fontSize: 'clamp(12px, 3vw, 15px)', lineHeight: 2, maxWidth: '320px', marginBottom: '20px' }}>
            <p>Run from the goose!</p>
            <p>TAP / SPACE to jump</p>
            <p>SWIPE DOWN / DOWN ARROW to duck</p>
            <p>Collect food for points!</p>
            <p>Avoid obstacles or goose gets closer!</p>
          </div>
          {highScore > 0 && (
            <div style={{ fontSize: 'clamp(10px, 2.5vw, 13px)', color: '#DAA520', marginBottom: '16px' }}>
              HIGH SCORE: {highScore}
            </div>
          )}
          <button
            onClick={startGame}
            style={{
              fontSize: '12px',
              padding: '12px 32px',
              background: '#228B22',
              color: '#FFF8DC',
              border: '3px solid #DAA520',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            START
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
            background: 'rgba(0,0,0,0.75)',
            color: '#FFF8DC',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'clamp(16px, 5vw, 24px)', color: '#8B2500', marginBottom: '16px' }}>
            HONK! CAUGHT!
          </div>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🦆💨🪿</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 18px)', marginBottom: '8px' }}>SCORE: {score}</div>
          {score >= highScore && score > 0 && (
            <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#DAA520', marginBottom: '8px' }}>NEW HIGH SCORE!</div>
          )}
          <div style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: '#87CEEB', marginBottom: '20px' }}>
            BEST: {Math.max(score, highScore)}
          </div>
          <button
            onClick={startGame}
            style={{
              fontSize: '12px',
              padding: '12px 32px',
              background: '#228B22',
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
            style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              color: '#87CEEB',
              marginTop: '16px',
              textDecoration: 'none',
            }}
          >
            {'< BACK TO ARCADE'}
          </a>
        </div>
      )}
    </div>
  );
}
