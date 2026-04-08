/* eslint-disable @next/next/no-page-custom-font, react-hooks/immutability */
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

const STORAGE_KEY = 'yogaGoat_highScore';

type GameState = 'start' | 'playing' | 'gameover';

interface Pose {
  name: string;
  emoji: string;
  duration: number;
  difficulty: number;
  inverted: boolean;
  wobbleRate: number;
}

const POSES: Pose[] = [
  { name: 'Mountain', emoji: '🏔️', duration: 5, difficulty: 1, inverted: false, wobbleRate: 0.3 },
  { name: 'Tree', emoji: '🌲', duration: 5, difficulty: 2, inverted: false, wobbleRate: 0.5 },
  { name: 'Warrior', emoji: '⚔️', duration: 6, difficulty: 3, inverted: false, wobbleRate: 0.7 },
  { name: 'Headstand', emoji: '🙃', duration: 5, difficulty: 4, inverted: true, wobbleRate: 0.8 },
  { name: 'Flying Crow', emoji: '🐦', duration: 6, difficulty: 4, inverted: false, wobbleRate: 0.9 },
  { name: 'The Farmer', emoji: '🧑‍🌾', duration: 7, difficulty: 5, inverted: false, wobbleRate: 1.0 },
];

interface Bird {
  x: number;
  y: number;
  landed: boolean;
  landedOn: 'head' | 'back' | 'none';
  wobbleAdd: number;
  flyDir: number;
  frame: number;
}

interface GuineaHen {
  x: number;
  y: number;
  vx: number;
  timer: number;
  squawking: boolean;
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

export default function YogaGoat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameRef = useRef<{
    score: number;
    lives: number;
    balance: number;
    targetBalance: number;
    balanceVelocity: number;
    greenZoneWidth: number;
    poseIndex: number;
    poseTimer: number;
    poseHoldTime: number;
    posesCompleted: number;
    transitioning: boolean;
    transitionTimer: number;
    zenMeter: number;
    frame: number;
    canvasW: number;
    canvasH: number;
    birds: Bird[];
    guineaHens: GuineaHen[];
    particles: Particle[];
    mouseX: number;
    tiltX: number;
    usingTilt: boolean;
    postX: number;
    postY: number;
    goatAngle: number;
    clouds: { x: number; y: number; w: number; speed: number }[];
    zenBonus: number;
    poseScore: number;
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
      gameRef.current.postX = logicalW / 2;
      gameRef.current.postY = logicalH * 0.6;
    }
  }, []);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const logicalW = rect.width;
    const logicalH = rect.height;

    const clouds = Array.from({ length: 4 }, (_, i) => ({
      x: i * (logicalW / 3) + Math.random() * 80,
      y: 20 + Math.random() * 50,
      w: 50 + Math.random() * 60,
      speed: 0.15 + Math.random() * 0.2,
    }));

    gameRef.current = {
      score: 0,
      lives: 3,
      balance: 0,
      targetBalance: 0,
      balanceVelocity: 0,
      greenZoneWidth: 0.3,
      poseIndex: 0,
      poseTimer: 0,
      poseHoldTime: 0,
      posesCompleted: 0,
      transitioning: false,
      transitionTimer: 0,
      zenMeter: 0,
      frame: 0,
      canvasW: logicalW,
      canvasH: logicalH,
      birds: [],
      guineaHens: [],
      particles: [],
      mouseX: logicalW / 2,
      tiltX: 0,
      usingTilt: false,
      postX: logicalW / 2,
      postY: logicalH * 0.6,
      goatAngle: 0,
      clouds,
      zenBonus: 0,
      poseScore: 0,
    };
  }, []);

  const addParticles = useCallback((x: number, y: number, color: string, count: number) => {
    const g = gameRef.current;
    if (!g) return;
    for (let i = 0; i < count; i++) {
      g.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        life: 30 + Math.random() * 20,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }, []);

  const nextPose = useCallback((g: NonNullable<typeof gameRef.current>) => {
    g.transitioning = true;
    g.transitionTimer = 90;
    g.poseHoldTime = 0;
    g.poseTimer = 0;
    g.poseIndex = (g.poseIndex + 1) % POSES.length;
    g.birds = g.birds.filter((b) => !b.landed);
  }, []);

  const loseLife = useCallback(
    (g: NonNullable<typeof gameRef.current>) => {
      g.lives--;
      g.zenMeter = Math.max(0, g.zenMeter - 20);
      addParticles(g.postX, g.postY - 30, '#FF4444', 10);

      if (g.lives <= 0) {
        const hs = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        if (g.score > hs) {
          localStorage.setItem(STORAGE_KEY, g.score.toString());
          setHighScore(g.score);
        }
        setScore(g.score);
        setGameState('gameover');
        return true;
      }

      g.balance = 0;
      g.balanceVelocity = 0;
      nextPose(g);
      return false;
    },
    [addParticles, nextPose],
  );

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const g = gameRef.current;
    if (!canvas || !ctx || !g) return;

    g.frame++;
    const pose = POSES[g.poseIndex];

    // Balance physics
    if (!g.transitioning) {
      const inputInfluence = g.usingTilt ? g.tiltX * 0.03 : ((g.mouseX - g.postX) / (g.canvasW / 2)) * 0.04;
      const effectiveInput = pose.inverted ? -inputInfluence : inputInfluence;

      g.targetBalance = effectiveInput;

      const naturalWobble = Math.sin(g.frame * 0.02 * pose.wobbleRate) * 0.01 * pose.difficulty;
      let birdWobble = 0;
      g.birds.forEach((b) => {
        if (b.landed) birdWobble += b.wobbleAdd;
      });
      let henDistract = 0;
      g.guineaHens.forEach((h) => {
        if (h.squawking) henDistract += 0.005 * Math.sin(g.frame * 0.3);
      });

      g.balanceVelocity += (g.targetBalance - g.balance) * 0.08;
      g.balanceVelocity += naturalWobble + birdWobble + henDistract;
      g.balanceVelocity *= 0.92;
      g.balance += g.balanceVelocity;
      g.balance = Math.max(-1, Math.min(1, g.balance));
      g.goatAngle = g.balance * 30;

      const inGreen = Math.abs(g.balance) < g.greenZoneWidth;
      if (inGreen) {
        g.poseHoldTime += 1 / 60;
        g.poseTimer += 1 / 60;

        const pts = Math.ceil(pose.difficulty * 2);
        g.poseScore += pts;
        if (g.frame % 6 === 0) {
          g.score += pts;
          setScore(g.score);
        }

        g.zenMeter = Math.min(100, g.zenMeter + 0.15);
        if (g.zenMeter >= 100 && g.frame % 60 === 0) {
          g.zenBonus += 10;
          g.score += 10;
          setScore(g.score);
          addParticles(g.postX, g.postY - 60, '#FFD700', 5);
        }

        if (g.poseTimer >= pose.duration) {
          g.posesCompleted++;
          g.score += 50 * pose.difficulty;
          setScore(g.score);
          addParticles(g.postX, g.postY - 40, '#228B22', 15);
          nextPose(g);
        }
      } else {
        g.zenMeter = Math.max(0, g.zenMeter - 0.3);
      }

      if (Math.abs(g.balance) > 0.9) {
        if (loseLife(g)) return;
      }
    } else {
      g.transitionTimer--;
      if (g.transitionTimer <= 0) {
        g.transitioning = false;
        g.balance = 0;
        g.balanceVelocity = 0;
        g.poseScore = 0;
        g.greenZoneWidth = Math.max(0.15, 0.3 - g.posesCompleted * 0.015);
      }
    }

    // Spawn birds
    if (!g.transitioning && g.frame % 300 === 0 && g.birds.length < 3 && g.posesCompleted >= 1) {
      g.birds.push({
        x: Math.random() > 0.5 ? -20 : g.canvasW + 20,
        y: 40 + Math.random() * 40,
        landed: false,
        landedOn: 'none',
        wobbleAdd: 0.003 + Math.random() * 0.004,
        flyDir: 0,
        frame: 0,
      });
    }

    // Update birds
    g.birds.forEach((b) => {
      b.frame++;
      if (!b.landed) {
        const tx = g.postX + (Math.random() - 0.5) * 20;
        const ty = g.postY - 50;
        const dx = tx - b.x;
        const dy = ty - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 5) {
          b.x += (dx / dist) * 2;
          b.y += (dy / dist) * 2;
          b.flyDir = dx > 0 ? 1 : -1;
        } else {
          b.landed = true;
          b.landedOn = Math.random() > 0.5 ? 'head' : 'back';
        }
      }
    });

    // Spawn guinea hens
    if (!g.transitioning && g.frame % 400 === 0 && g.guineaHens.length < 2 && g.posesCompleted >= 2) {
      const fromLeft = Math.random() > 0.5;
      g.guineaHens.push({
        x: fromLeft ? -20 : g.canvasW + 20,
        y: g.canvasH * 0.78 + Math.random() * 20,
        vx: fromLeft ? 1 + Math.random() : -(1 + Math.random()),
        timer: 180 + Math.random() * 120,
        squawking: false,
      });
    }

    // Update guinea hens
    g.guineaHens = g.guineaHens.filter((h) => {
      h.x += h.vx;
      h.timer--;
      h.squawking = Math.sin(g.frame * 0.2 + h.x) > 0.5;
      return h.timer > 0 && h.x > -40 && h.x < g.canvasW + 40;
    });

    // Update particles
    g.particles = g.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
      return p.life > 0;
    });

    // Clouds
    g.clouds.forEach((c) => {
      c.x -= c.speed;
      if (c.x + c.w < 0) {
        c.x = g.canvasW + 20;
        c.y = 20 + Math.random() * 50;
      }
    });

    // ===== RENDER =====
    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, g.canvasH);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(0.6, '#B0E0E6');
    skyGrad.addColorStop(1, '#228B22');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, g.canvasW, g.canvasH);

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(g.canvasW * 0.8, 50, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFACD';
    ctx.beginPath();
    ctx.arc(g.canvasW * 0.8, 50, 18, 0, Math.PI * 2);
    ctx.fill();

    // Clouds
    ctx.fillStyle = '#FFFFFF';
    g.clouds.forEach((c) => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w / 2, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x - c.w * 0.3, c.y - 4, c.w / 3, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Rolling hills
    ctx.fillStyle = '#3CB371';
    ctx.beginPath();
    ctx.moveTo(0, g.canvasH * 0.7);
    for (let x = 0; x <= g.canvasW; x += 30) {
      ctx.lineTo(x, g.canvasH * 0.7 - Math.sin(x * 0.01) * 10);
    }
    ctx.lineTo(g.canvasW, g.canvasH);
    ctx.lineTo(0, g.canvasH);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, g.canvasH * 0.75, g.canvasW, g.canvasH * 0.25);

    // Fence post
    const postW = 12;
    const postH = 60;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(g.postX - postW / 2, g.postY, postW, postH);
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(g.postX - postW / 2 - 2, g.postY - 4, postW + 4, 6);

    // Balance meter background
    const meterW = g.canvasW * 0.6;
    const meterH = 12;
    const meterX = (g.canvasW - meterW) / 2;
    const meterY = g.canvasH * 0.85;

    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(meterX - 2, meterY - 2, meterW + 4, meterH + 4);
    ctx.globalAlpha = 1;

    // Red zone
    ctx.fillStyle = '#8B2500';
    ctx.fillRect(meterX, meterY, meterW, meterH);

    // Green zone
    const greenW = meterW * g.greenZoneWidth;
    const greenX = meterX + (meterW - greenW) / 2;
    ctx.fillStyle = '#228B22';
    ctx.fillRect(greenX, meterY, greenW, meterH);

    // Balance indicator
    const indicatorX = meterX + ((g.balance + 1) / 2) * meterW;
    ctx.fillStyle = '#FFF8DC';
    ctx.fillRect(indicatorX - 3, meterY - 4, 6, meterH + 8);
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(indicatorX - 2, meterY - 3, 4, meterH + 6);

    // Guinea hens
    g.guineaHens.forEach((h) => {
      const dir = h.vx > 0 ? 1 : -1;
      // Body
      ctx.fillStyle = '#555555';
      ctx.fillRect(h.x - 8, h.y - 6, 16, 10);
      // Head
      ctx.fillStyle = '#666666';
      ctx.fillRect(h.x + dir * 8, h.y - 10, 6 * dir, 8);
      // Spots
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(h.x - 4, h.y - 4, 2, 2);
      ctx.fillRect(h.x + 2, h.y - 2, 2, 2);
      // Legs
      ctx.fillStyle = '#FF8800';
      const legFrame = Math.floor(g.frame / 8) % 2;
      ctx.fillRect(h.x - 3 + legFrame * 2, h.y + 4, 2, 5);
      ctx.fillRect(h.x + 3 - legFrame * 2, h.y + 4, 2, 5);
      // Squawk indicator
      if (h.squawking) {
        ctx.fillStyle = '#FF4444';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('!', h.x, h.y - 14);
        ctx.textAlign = 'left';
      }
    });

    // Goat on post
    ctx.save();
    ctx.translate(g.postX, g.postY - 2);
    ctx.rotate((g.goatAngle * Math.PI) / 180);

    const gx = -16;
    const gy = -40;

    if (pose.inverted && !g.transitioning) {
      ctx.scale(1, -1);
      ctx.translate(0, 30);
    }

    // Goat body
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(gx, gy, 32, 20);
    // Head
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(gx + 24, gy - 10, 12, 14);
    // Ears
    ctx.fillStyle = '#DDD';
    ctx.fillRect(gx + 24, gy - 14, 4, 6);
    ctx.fillRect(gx + 32, gy - 14, 4, 6);
    // Horns
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(gx + 26, gy - 18, 2, 6);
    ctx.fillRect(gx + 32, gy - 18, 2, 6);
    // Eye
    ctx.fillStyle = '#000';
    ctx.fillRect(gx + 30, gy - 6, 3, 3);
    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(gx + 34, gy - 2, 2, 2);
    // Beard
    ctx.fillStyle = '#CCC';
    ctx.fillRect(gx + 30, gy + 2, 3, 6);

    // Legs based on pose
    ctx.fillStyle = '#F5F5DC';
    if (pose.name === 'Mountain') {
      ctx.fillRect(gx + 2, gy + 20, 4, 12);
      ctx.fillRect(gx + 10, gy + 20, 4, 12);
      ctx.fillRect(gx + 18, gy + 20, 4, 12);
      ctx.fillRect(gx + 26, gy + 20, 4, 12);
    } else if (pose.name === 'Tree') {
      ctx.fillRect(gx + 6, gy + 20, 4, 12);
      ctx.fillRect(gx + 22, gy + 20, 4, 12);
      // Lifted leg
      ctx.fillRect(gx + 14, gy + 14, 4, 6);
    } else if (pose.name === 'Warrior') {
      ctx.fillRect(gx - 4, gy + 18, 8, 4);
      ctx.fillRect(gx - 4, gy + 22, 4, 10);
      ctx.fillRect(gx + 28, gy + 18, 8, 4);
      ctx.fillRect(gx + 32, gy + 22, 4, 10);
    } else if (pose.name === 'Flying Crow') {
      ctx.fillRect(gx + 10, gy + 20, 4, 8);
      ctx.fillRect(gx + 18, gy + 20, 4, 8);
      // Wings out
      ctx.fillStyle = '#DDD';
      ctx.fillRect(gx - 8, gy + 4, 10, 4);
      ctx.fillRect(gx + 30, gy + 4, 10, 4);
    } else {
      ctx.fillRect(gx + 4, gy + 20, 4, 12);
      ctx.fillRect(gx + 12, gy + 20, 4, 12);
      ctx.fillRect(gx + 20, gy + 20, 4, 12);
      ctx.fillRect(gx + 28, gy + 20, 4, 12);
    }

    // Hooves
    ctx.fillStyle = '#333';
    if (pose.name === 'Tree') {
      ctx.fillRect(gx + 5, gy + 32, 6, 3);
      ctx.fillRect(gx + 21, gy + 32, 6, 3);
    } else if (pose.name === 'Warrior') {
      ctx.fillRect(gx - 5, gy + 32, 6, 3);
      ctx.fillRect(gx + 31, gy + 32, 6, 3);
    } else if (pose.name !== 'Flying Crow') {
      ctx.fillRect(gx + 1, gy + 32, 6, 3);
      ctx.fillRect(gx + 9, gy + 32, 6, 3);
      ctx.fillRect(gx + 17, gy + 32, 6, 3);
      ctx.fillRect(gx + 25, gy + 32, 6, 3);
    }

    // Birds on goat
    g.birds.forEach((b) => {
      if (b.landed) {
        const bx = b.landedOn === 'head' ? gx + 28 : gx + 12;
        const by = b.landedOn === 'head' ? gy - 16 : gy - 6;
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(bx, by, 6, 5);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(bx + 5, by + 1, 3, 2);
        ctx.fillStyle = '#000';
        ctx.fillRect(bx + 3, by, 1, 1);
      }
    });

    ctx.restore();

    // Flying birds (not landed)
    g.birds.forEach((b) => {
      if (!b.landed) {
        const wingOff = Math.sin(b.frame * 0.3) * 4;
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(b.x - 4, b.y, 8, 4);
        ctx.fillRect(b.x - 6, b.y - wingOff, 4, 3);
        ctx.fillRect(b.x + 4, b.y + wingOff, 4, 3);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(b.x + (b.flyDir > 0 ? 6 : -4), b.y + 1, 3, 2);
      }
    });

    // Particles
    g.particles.forEach((p) => {
      ctx.globalAlpha = p.life / 50;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;

    // HUD
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, g.canvasW, 56);
    ctx.globalAlpha = 1;

    // Score
    ctx.fillStyle = '#FFF8DC';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`${g.score}`, 10, 18);

    // Lives
    ctx.fillStyle = '#FF69B4';
    ctx.textAlign = 'right';
    let hearts = '';
    for (let i = 0; i < g.lives; i++) hearts += '\u2665 ';
    ctx.fillText(hearts, g.canvasW - 10, 18);
    ctx.textAlign = 'left';

    // Pose name
    ctx.fillStyle = '#DAA520';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    if (g.transitioning) {
      ctx.fillText(`NEXT: ${POSES[g.poseIndex].name.toUpperCase()}`, g.canvasW / 2, 18);
      ctx.fillStyle = '#87CEEB';
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.fillText(
        pose.inverted ? 'INVERTED CONTROLS!' : 'GET READY...',
        g.canvasW / 2,
        32,
      );
    } else {
      ctx.fillText(`${pose.emoji} ${pose.name.toUpperCase()}`, g.canvasW / 2, 18);

      // Hold timer
      const holdPct = Math.min(1, g.poseTimer / pose.duration);
      const timerW = 80;
      const timerX = (g.canvasW - timerW) / 2;
      ctx.fillStyle = '#333';
      ctx.fillRect(timerX, 26, timerW, 6);
      ctx.fillStyle = holdPct >= 1 ? '#FFD700' : '#228B22';
      ctx.fillRect(timerX, 26, timerW * holdPct, 6);

      ctx.fillStyle = '#FFF8DC';
      ctx.font = '6px "Press Start 2P", monospace';
      ctx.fillText(`${Math.ceil(pose.duration - g.poseTimer)}s`, g.canvasW / 2, 44);
    }
    ctx.textAlign = 'left';

    // Zen meter
    const zenW = 60;
    const zenH = 6;
    const zenX = 10;
    const zenY = 32;
    ctx.fillStyle = '#333';
    ctx.fillRect(zenX, zenY, zenW, zenH);
    const zenColor = g.zenMeter >= 100 ? '#FFD700' : g.zenMeter >= 50 ? '#87CEEB' : '#228B22';
    ctx.fillStyle = zenColor;
    ctx.fillRect(zenX, zenY, zenW * (g.zenMeter / 100), zenH);
    ctx.fillStyle = '#FFF8DC';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('ZEN', zenX, zenY + 16);
    if (g.zenMeter >= 100) {
      ctx.fillStyle = '#FFD700';
      ctx.fillText('MAX!', zenX + 28, zenY + 16);
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, [addParticles, nextPose, loseLife]);

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

    const handleMouseMove = (e: MouseEvent) => {
      const g = gameRef.current;
      const canvas = canvasRef.current;
      if (!g || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      g.mouseX = ((e.clientX - rect.left) / rect.width) * g.canvasW;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const g = gameRef.current;
      const canvas = canvasRef.current;
      if (!g || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      g.mouseX = ((e.touches[0].clientX - rect.left) / rect.width) * g.canvasW;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const g = gameRef.current;
      const canvas = canvasRef.current;
      if (!g || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      g.mouseX = ((e.touches[0].clientX - rect.left) / rect.width) * g.canvasW;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const g = gameRef.current;
      if (!g) return;
      if (e.gamma !== null) {
        g.usingTilt = true;
        g.tiltX = e.gamma;
      }
    };

    const canvas = canvasRef.current;
    window.addEventListener('mousemove', handleMouseMove);
    canvas?.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas?.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      canvas?.removeEventListener('touchstart', handleTouchStart);
      canvas?.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
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
          <div style={{ fontSize: 'clamp(14px, 4vw, 24px)', color: '#87CEEB', marginBottom: '16px' }}>
            YOGA GOAT
          </div>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🐐🧘</div>
          <div style={{ fontSize: '8px', lineHeight: 2.2, maxWidth: '300px', marginBottom: '16px' }}>
            <p>Balance the goat on the fence post!</p>
            <p>TOUCH / MOUSE / TILT to balance</p>
            <p>Stay in the GREEN ZONE to score!</p>
            <p>Hold each pose for the timer!</p>
            <p>Watch out for birds and guinea hens!</p>
            <p style={{ color: '#FFD700' }}>Headstand = inverted controls!</p>
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
              background: '#228B22',
              color: '#FFF8DC',
              border: '3px solid #DAA520',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            NAMASTE
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
          <div style={{ fontSize: 'clamp(14px, 4vw, 22px)', color: '#87CEEB', marginBottom: '12px' }}>
            BAAA-LANCE LOST!
          </div>
          <div style={{ fontSize: '30px', marginBottom: '8px' }}>🐐💫</div>
          <div style={{ fontSize: '12px', marginBottom: '6px' }}>SCORE: {score}</div>
          <div style={{ fontSize: '8px', color: '#87CEEB', marginBottom: '4px' }}>
            POSES: {gameRef.current?.posesCompleted || 0}
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
              background: '#228B22',
              color: '#FFF8DC',
              border: '3px solid #DAA520',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            TRY AGAIN
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
