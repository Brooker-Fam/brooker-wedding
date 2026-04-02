'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

const STORAGE_KEY = 'unicornTKD_highScore';

type GameState = 'start' | 'playing' | 'gameover';
type Belt = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'black';

const BELTS: { name: Belt; color: string; threshold: number }[] = [
  { name: 'white', color: '#FFFFFF', threshold: 0 },
  { name: 'yellow', color: '#FFD700', threshold: 100 },
  { name: 'green', color: '#228B22', threshold: 300 },
  { name: 'blue', color: '#4169E1', threshold: 600 },
  { name: 'red', color: '#DC143C', threshold: 1000 },
  { name: 'black', color: '#222222', threshold: 1500 },
];

interface Target {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  type: 'wood' | 'stone' | 'ice' | 'rainbow';
  speed: number;
  fromLeft: boolean;
  tapsNeeded: number;
  tapsGot: number;
  state: 'flying' | 'inzone' | 'hit' | 'missed';
  timer: number;
  swipeDir?: 'left' | 'right' | 'up' | 'down';
  sequenceStep: number;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
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

export default function UnicornTaekwondo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [belt, setBelt] = useState<Belt>('white');
  const [combo, setCombo] = useState(0);
  const gameRef = useRef<{
    score: number;
    lives: number;
    combo: number;
    maxCombo: number;
    multiplier: number;
    belt: Belt;
    targets: Target[];
    sparkles: Sparkle[];
    floatingTexts: FloatingText[];
    frame: number;
    canvasW: number;
    canvasH: number;
    kickZoneX: number;
    kickZoneY: number;
    kickZoneR: number;
    unicornKicking: number;
    kickDir: 'left' | 'right';
    spawnTimer: number;
    spawnInterval: number;
    difficulty: number;
    unicornY: number;
    bgStars: { x: number; y: number; size: number; speed: number; color: string }[];
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
      gameRef.current.kickZoneX = logicalW / 2;
      gameRef.current.kickZoneY = logicalH * 0.55;
      gameRef.current.kickZoneR = Math.min(logicalW, logicalH) * 0.1;
      gameRef.current.unicornY = logicalH * 0.45;
    }
  }, []);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const logicalW = rect.width;
    const logicalH = rect.height;

    const bgStars = Array.from({ length: 40 }, () => ({
      x: Math.random() * logicalW,
      y: Math.random() * logicalH,
      size: 1 + Math.random() * 2,
      speed: 0.2 + Math.random() * 0.5,
      color: ['#FF69B4', '#FFD700', '#87CEEB', '#FF6347', '#7B68EE'][Math.floor(Math.random() * 5)],
    }));

    gameRef.current = {
      score: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      multiplier: 1,
      belt: 'white',
      targets: [],
      sparkles: [],
      floatingTexts: [],
      frame: 0,
      canvasW: logicalW,
      canvasH: logicalH,
      kickZoneX: logicalW / 2,
      kickZoneY: logicalH * 0.55,
      kickZoneR: Math.min(logicalW, logicalH) * 0.1,
      unicornKicking: 0,
      kickDir: 'right',
      spawnTimer: 0,
      spawnInterval: 120,
      difficulty: 1,
      unicornY: logicalH * 0.45,
      bgStars,
    };
  }, []);

  const addSparkles = useCallback((x: number, y: number, color: string, count: number) => {
    const g = gameRef.current;
    if (!g) return;
    for (let i = 0; i < count; i++) {
      g.sparkles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 30 + Math.random() * 30,
        color,
        size: 2 + Math.random() * 4,
      });
    }
  }, []);

  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    const g = gameRef.current;
    if (!g) return;
    g.floatingTexts.push({ x, y, text, color, life: 60 });
  }, []);

  const spawnTarget = useCallback((g: NonNullable<typeof gameRef.current>) => {
    const fromLeft = Math.random() > 0.5;
    const r = Math.random();
    let type: Target['type'];
    if (g.difficulty < 2) {
      type = 'wood';
    } else if (g.difficulty < 4) {
      type = r < 0.5 ? 'wood' : r < 0.8 ? 'stone' : 'ice';
    } else {
      type = r < 0.3 ? 'wood' : r < 0.55 ? 'stone' : r < 0.8 ? 'ice' : 'rainbow';
    }

    const tapsNeeded = type === 'wood' ? 1 : type === 'stone' ? 2 : type === 'ice' ? 1 : 3;
    const speed = 1.5 + g.difficulty * 0.3 + Math.random() * 0.5;

    const startX = fromLeft ? -40 : g.canvasW + 40;
    const yVariance = Math.random() * 60 - 30;

    g.targets.push({
      x: startX,
      y: g.kickZoneY + yVariance,
      targetX: g.kickZoneX + (Math.random() - 0.5) * 20,
      targetY: g.kickZoneY + yVariance,
      type,
      speed,
      fromLeft,
      tapsNeeded,
      tapsGot: 0,
      state: 'flying',
      timer: 0,
      sequenceStep: 0,
    });
  }, []);

  const handleTap = useCallback(
    (tapX: number, tapY: number) => {
      const g = gameRef.current;
      if (!g) return;

      let hitTarget: Target | null = null;
      let bestDist = Infinity;

      for (const t of g.targets) {
        if (t.state !== 'flying' && t.state !== 'inzone') continue;
        const dx = tapX - t.x;
        const dy = tapY - t.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = g.kickZoneR * 2;

        if (dist < hitRadius && dist < bestDist) {
          bestDist = dist;
          hitTarget = t;
        }
      }

      if (hitTarget) {
        hitTarget.tapsGot++;
        g.unicornKicking = 15;
        g.kickDir = hitTarget.x < g.kickZoneX ? 'left' : 'right';

        if (hitTarget.tapsGot >= hitTarget.tapsNeeded) {
          hitTarget.state = 'hit';
          const inZone =
            Math.abs(hitTarget.x - g.kickZoneX) < g.kickZoneR * 1.2 &&
            Math.abs(hitTarget.y - g.kickZoneY) < g.kickZoneR * 1.5;
          const isPerfect = inZone && bestDist < g.kickZoneR * 0.6;

          g.combo++;
          if (g.combo > g.maxCombo) g.maxCombo = g.combo;
          g.multiplier = Math.min(8, 1 + Math.floor(g.combo / 3));

          const basePoints = isPerfect ? 30 : 15;
          const bonus =
            hitTarget.type === 'stone' ? 10 : hitTarget.type === 'ice' ? 15 : hitTarget.type === 'rainbow' ? 25 : 0;
          const pts = (basePoints + bonus) * g.multiplier;
          g.score += pts;

          const colors: Record<string, string> = {
            wood: '#CD853F',
            stone: '#808080',
            ice: '#87CEEB',
            rainbow: '#FF69B4',
          };
          addSparkles(hitTarget.x, hitTarget.y, colors[hitTarget.type], isPerfect ? 20 : 10);
          if (hitTarget.type === 'rainbow') {
            ['#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#0088FF', '#8800FF'].forEach((c) =>
              addSparkles(hitTarget!.x, hitTarget!.y, c, 5),
            );
          }

          const label = isPerfect ? `PERFECT! +${pts}` : `GOOD +${pts}`;
          addFloatingText(hitTarget.x, hitTarget.y - 20, label, isPerfect ? '#FFD700' : '#FFFFFF');

          if (g.multiplier >= 3) {
            addFloatingText(g.canvasW / 2, g.canvasH * 0.3, `${g.multiplier}x COMBO!`, '#FF69B4');
          }

          // Belt progression
          for (let i = BELTS.length - 1; i >= 0; i--) {
            if (g.score >= BELTS[i].threshold) {
              if (g.belt !== BELTS[i].name) {
                g.belt = BELTS[i].name;
                setBelt(BELTS[i].name);
                addFloatingText(g.canvasW / 2, g.canvasH * 0.2, `${BELTS[i].name.toUpperCase()} BELT!`, BELTS[i].color);
                addSparkles(g.canvasW / 2, g.canvasH * 0.2, BELTS[i].color, 30);
              }
              break;
            }
          }

          setScore(g.score);
          setCombo(g.combo);
        } else {
          addSparkles(hitTarget.x, hitTarget.y, '#FFFFFF', 5);
          addFloatingText(hitTarget.x, hitTarget.y - 10, `${hitTarget.tapsGot}/${hitTarget.tapsNeeded}`, '#87CEEB');
        }
      }
    },
    [addSparkles, addFloatingText],
  );

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const g = gameRef.current;
    if (!canvas || !ctx || !g) return;

    g.frame++;
    g.difficulty = 1 + g.score / 200;

    // Spawn targets
    g.spawnTimer++;
    const interval = Math.max(40, g.spawnInterval - g.difficulty * 8);
    if (g.spawnTimer >= interval) {
      spawnTarget(g);
      g.spawnTimer = 0;
    }

    // Update targets
    for (const t of g.targets) {
      if (t.state === 'flying') {
        const dx = t.targetX - t.x;
        const dy = t.targetY - t.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 2) {
          t.x += (dx / dist) * t.speed * 2;
          t.y += (dy / dist) * t.speed * 2;
        } else {
          t.state = 'inzone';
        }
        t.timer++;
      } else if (t.state === 'inzone') {
        t.timer++;
        const exitSpeed = t.speed * 1.5;
        if (t.fromLeft) {
          t.x += exitSpeed;
        } else {
          t.x -= exitSpeed;
        }

        if (t.x < -60 || t.x > g.canvasW + 60) {
          t.state = 'missed';
          g.lives--;
          g.combo = 0;
          g.multiplier = 1;
          setLives(g.lives);
          setCombo(0);
          addFloatingText(g.canvasW / 2, g.canvasH * 0.4, 'MISS!', '#FF4444');
          addSparkles(g.kickZoneX, g.kickZoneY, '#FF4444', 8);

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
        }
      }
    }

    // Clean up
    g.targets = g.targets.filter((t) => t.state !== 'hit' || t.timer < 30);
    g.targets = g.targets.filter((t) => t.state !== 'missed');

    // Update sparkles
    g.sparkles = g.sparkles.filter((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.15;
      s.life--;
      return s.life > 0;
    });

    // Update floating texts
    g.floatingTexts = g.floatingTexts.filter((f) => {
      f.y -= 1;
      f.life--;
      return f.life > 0;
    });

    if (g.unicornKicking > 0) g.unicornKicking--;

    // ===== RENDER =====
    // Background - dojo/magical arena
    const bgGrad = ctx.createLinearGradient(0, 0, 0, g.canvasH);
    bgGrad.addColorStop(0, '#2d1b4e');
    bgGrad.addColorStop(0.5, '#4a2080');
    bgGrad.addColorStop(1, '#1a0a30');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, g.canvasW, g.canvasH);

    // Stars
    g.bgStars.forEach((s) => {
      s.y += s.speed;
      if (s.y > g.canvasH) {
        s.y = 0;
        s.x = Math.random() * g.canvasW;
      }
      ctx.globalAlpha = 0.4 + 0.3 * Math.sin(g.frame * 0.05 + s.x);
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1;

    // Floor
    ctx.fillStyle = '#4a3060';
    ctx.fillRect(0, g.canvasH * 0.75, g.canvasW, g.canvasH * 0.25);
    ctx.fillStyle = '#5a3870';
    for (let x = 0; x < g.canvasW; x += 40) {
      ctx.fillRect(x, g.canvasH * 0.75, 38, 2);
    }

    // Kick zone circle
    ctx.globalAlpha = 0.15 + 0.05 * Math.sin(g.frame * 0.05);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(g.kickZoneX, g.kickZoneY, g.kickZoneR * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.globalAlpha = 1;

    // Inner zone
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(g.kickZoneX, g.kickZoneY, g.kickZoneR * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw targets
    g.targets.forEach((t) => {
      if (t.state === 'hit') {
        ctx.globalAlpha = Math.max(0, 1 - t.timer / 30);
      }

      const size = 30;
      const hSize = size / 2;

      if (t.type === 'wood') {
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(t.x - hSize, t.y - hSize, size, size);
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(t.x - hSize, t.y - hSize, size, 3);
        ctx.strokeStyle = '#A0722A';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(t.x - hSize + 3, t.y - hSize + 8 + i * 8);
          ctx.lineTo(t.x + hSize - 3, t.y - hSize + 8 + i * 8);
          ctx.stroke();
        }
      } else if (t.type === 'stone') {
        ctx.fillStyle = '#808080';
        ctx.fillRect(t.x - hSize, t.y - hSize, size, size);
        ctx.fillStyle = '#666666';
        ctx.fillRect(t.x - hSize, t.y - hSize, size, 3);
        ctx.fillStyle = '#999999';
        ctx.fillRect(t.x - 4, t.y - 4, 8, 8);
        // Crack indicator
        if (t.tapsGot > 0) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(t.x - 8, t.y - 5);
          ctx.lineTo(t.x + 2, t.y + 3);
          ctx.lineTo(t.x + 10, t.y - 2);
          ctx.stroke();
        }
      } else if (t.type === 'ice') {
        ctx.fillStyle = '#87CEEB';
        ctx.globalAlpha = (t.state === 'hit' ? Math.max(0, 1 - t.timer / 30) : 1) * 0.8;
        ctx.fillRect(t.x - hSize, t.y - hSize, size, size);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = (t.state === 'hit' ? Math.max(0, 1 - t.timer / 30) : 1) * 0.3;
        ctx.fillRect(t.x - hSize + 3, t.y - hSize + 3, 8, 4);
        ctx.fillRect(t.x + 2, t.y + 2, 6, 6);
        // Swipe arrow
        ctx.globalAlpha = t.state === 'hit' ? Math.max(0, 1 - t.timer / 30) : 0.8;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('→', t.x, t.y + 4);
      } else {
        // Rainbow boss
        const colors = ['#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#0088FF', '#8800FF'];
        const colorIndex = Math.floor(g.frame / 4) % colors.length;
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(t.x - hSize - 2, t.y - hSize - 2, size + 4, size + 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(t.x - hSize, t.y - hSize, size, size);
        // Progress indicator
        ctx.fillStyle = '#FF69B4';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${t.tapsGot}/${t.tapsNeeded}`, t.x, t.y + 4);
        // Glow
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = colors[colorIndex];
        ctx.beginPath();
        ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });

    // Unicorn
    const ux = g.kickZoneX;
    const uy = g.unicornY;
    const kicking = g.unicornKicking > 0;
    const kickLeft = g.kickDir === 'left';

    // Body glow
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(ux, uy + 10, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Body
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ux - 16, uy - 4, 32, 24);
    // Head
    ctx.fillRect(ux + 8, uy - 20, 16, 20);
    // Horn
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(ux + 16, uy - 20);
    ctx.lineTo(ux + 14, uy - 34);
    ctx.lineTo(ux + 18, uy - 20);
    ctx.fill();
    // Horn sparkle
    if (g.frame % 20 < 10) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(ux + 14, uy - 30, 2, 2);
    }
    // Mane
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(ux + 6, uy - 18, 4, 14);
    ctx.fillStyle = '#9370DB';
    ctx.fillRect(ux + 4, uy - 14, 4, 10);
    // Eye
    ctx.fillStyle = '#000';
    ctx.fillRect(ux + 18, uy - 16, 3, 3);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ux + 19, uy - 16, 1, 1);

    // Belt
    const currentBelt = BELTS.find((b) => b.name === g.belt);
    if (currentBelt) {
      ctx.fillStyle = currentBelt.color;
      ctx.fillRect(ux - 14, uy + 8, 28, 4);
      if (currentBelt.name === 'white') {
        ctx.strokeStyle = '#CCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(ux - 14, uy + 8, 28, 4);
      }
    }

    // Legs
    ctx.fillStyle = '#FFFFFF';
    if (kicking) {
      if (kickLeft) {
        // Kick left
        ctx.fillRect(ux - 24, uy + 16, 14, 4);
        ctx.fillRect(ux + 4, uy + 20, 4, 10);
      } else {
        // Kick right
        ctx.fillRect(ux + 12, uy + 16, 14, 4);
        ctx.fillRect(ux - 6, uy + 20, 4, 10);
      }
      // Kick effect
      const kickX = kickLeft ? ux - 28 : ux + 28;
      ctx.fillStyle = '#FFD700';
      ctx.globalAlpha = g.unicornKicking / 15;
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('*', kickX, uy + 20);
      ctx.globalAlpha = 1;
    } else {
      // Standing
      ctx.fillRect(ux - 10, uy + 20, 4, 10);
      ctx.fillRect(ux - 2, uy + 20, 4, 10);
      ctx.fillRect(ux + 6, uy + 20, 4, 10);
      ctx.fillRect(ux + 14, uy + 20, 4, 10);
    }

    // Tail
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(ux - 18, uy - 2, 4, 8);
    ctx.fillStyle = '#9370DB';
    ctx.fillRect(ux - 20, uy, 4, 8);
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(ux - 22, uy + 2, 4, 6);

    // Sparkles
    g.sparkles.forEach((s) => {
      ctx.globalAlpha = s.life / 60;
      ctx.fillStyle = s.color;
      const sparkleSize = s.size * (s.life / 60);
      ctx.fillRect(s.x - sparkleSize / 2, s.y - sparkleSize / 2, sparkleSize, sparkleSize);
      // Cross sparkle
      if (s.size > 3) {
        ctx.fillRect(s.x - 1, s.y - sparkleSize, 2, sparkleSize * 2);
        ctx.fillRect(s.x - sparkleSize, s.y - 1, sparkleSize * 2, 2);
      }
    });
    ctx.globalAlpha = 1;

    // Floating texts
    g.floatingTexts.forEach((f) => {
      ctx.globalAlpha = Math.min(1, f.life / 30);
      ctx.fillStyle = f.color;
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(f.text, f.x, f.y);
    });
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';

    // HUD - Score
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, g.canvasW, 36);
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#FFD700';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`${g.score}`, 10, 16);

    // Combo
    if (g.combo > 1) {
      ctx.fillStyle = '#FF69B4';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillText(`${g.combo}x`, 10, 30);
    }

    // Lives
    ctx.fillStyle = '#FF69B4';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    let heartsText = '';
    for (let i = 0; i < g.lives; i++) heartsText += '\u2665 ';
    ctx.fillText(heartsText, g.canvasW - 10, 16);

    // Belt indicator
    if (currentBelt) {
      ctx.fillStyle = currentBelt.color;
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.fillText(`${currentBelt.name.toUpperCase()} BELT`, g.canvasW - 10, 30);
    }

    ctx.textAlign = 'left';

    animRef.current = requestAnimationFrame(gameLoop);
  }, [spawnTarget, addSparkles, addFloatingText]);

  const startGame = useCallback(() => {
    resize();
    initGame();
    setScore(0);
    setLives(3);
    setBelt('white');
    setCombo(0);
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

  // Touch/click controls
  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCanvasPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const pos = getCanvasPos(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        handleTap(pos.x, pos.y);
      }
    };

    const onClick = (e: MouseEvent) => {
      const pos = getCanvasPos(e.clientX, e.clientY);
      handleTap(pos.x, pos.y);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        const g = gameRef.current;
        if (g) handleTap(g.kickZoneX, g.kickZoneY);
      }
    };

    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);

    return () => {
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [gameState, handleTap]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        background: '#2d1b4e',
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
            background: 'rgba(0,0,0,0.8)',
            color: '#FFF8DC',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 'clamp(14px, 4vw, 24px)', color: '#FF69B4', marginBottom: '16px' }}>
            UNICORN TAEKWONDO
          </div>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🦄🥋</div>
          <div
            style={{
              fontSize: '7px',
              lineHeight: 2.2,
              maxWidth: '300px',
              marginBottom: '16px',
              color: '#FFF8DC',
            }}
          >
            <p style={{ color: '#FFD700' }}>For Sapphire!</p>
            <p>TAP boards when they reach the kick zone!</p>
            <p style={{ color: '#CD853F' }}>Wood: 1 tap</p>
            <p style={{ color: '#808080' }}>Stone: 2 taps</p>
            <p style={{ color: '#87CEEB' }}>Ice: 1 swipe/tap</p>
            <p style={{ color: '#FF69B4' }}>Rainbow: 3 taps</p>
            <p>Earn belts as you score!</p>
          </div>
          {highScore > 0 && (
            <div style={{ fontSize: '8px', color: '#FFD700', marginBottom: '12px' }}>
              HIGH SCORE: {highScore}
            </div>
          )}
          <button
            onClick={startGame}
            style={{
              fontSize: '12px',
              padding: '12px 32px',
              background: '#FF69B4',
              color: '#FFF',
              border: '3px solid #FFD700',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            HI-YAH!
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
          }}
        >
          <div style={{ fontSize: 'clamp(14px, 4vw, 22px)', color: '#FF69B4', marginBottom: '12px' }}>
            GAME OVER
          </div>
          <div style={{ fontSize: '30px', marginBottom: '8px' }}>🦄</div>
          <div style={{ fontSize: '12px', marginBottom: '6px' }}>SCORE: {score}</div>
          <div style={{ fontSize: '8px', color: '#FFD700', marginBottom: '4px' }}>
            BELT: {belt.toUpperCase()}
          </div>
          <div style={{ fontSize: '8px', color: '#87CEEB', marginBottom: '4px' }}>
            MAX COMBO: {gameRef.current?.maxCombo || 0}x
          </div>
          {score >= highScore && score > 0 && (
            <div style={{ fontSize: '10px', color: '#FFD700', marginBottom: '8px' }}>NEW HIGH SCORE!</div>
          )}
          <div style={{ fontSize: '8px', color: '#87CEEB', marginBottom: '16px' }}>
            BEST: {Math.max(score, highScore)}
          </div>
          <button
            onClick={startGame}
            style={{
              fontSize: '12px',
              padding: '12px 32px',
              background: '#FF69B4',
              color: '#FFF',
              border: '3px solid #FFD700',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            AGAIN!
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
