"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function FarmScene() {
  const { isDark } = useTheme();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Dreamy gradient sky -- light: warm cream, dark: midnight forest */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #050D06 0%, #091408 25%, #0D1F0F 50%, #0F2812 80%, #0A1A0C 100%)"
            : "linear-gradient(180deg, #E8E2D0 0%, #F0EADE 25%, #FDF8F0 50%, #E8EDDF 80%, #D5DFC8 100%)",
        }}
      />

      {/* Light: warm golden sun glow / Dark: cool moon glow */}
      <div className="absolute top-6 right-[15%] sm:top-10">
        <div
          className="h-20 w-20 rounded-full opacity-75 sm:h-32 sm:w-32"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(200,210,220,0.45) 0%, rgba(180,200,220,0.15) 40%, transparent 70%)"
              : "radial-gradient(circle, rgba(196,154,60,0.55) 0%, rgba(196,154,60,0.18) 40%, transparent 70%)",
          }}
        />
        {isDark && (
          <div
            className="absolute top-2 left-2 h-16 w-16 rounded-full sm:top-3 sm:left-3 sm:h-24 sm:w-24"
            style={{
              background: "radial-gradient(circle, rgba(220,230,240,0.35) 0%, rgba(200,215,230,0.1) 50%, transparent 80%)",
              boxShadow: "0 0 40px rgba(200,215,230,0.2)",
            }}
          />
        )}
      </div>

      {/* Stars (dark mode only) */}
      {isDark && <NightStars />}

      {/* Floating fireflies -- brighter in dark mode */}
      <Fireflies isDark={isDark} />

      {/* Fairy dust sparkle trail */}
      <FairyDustTrail isDark={isDark} />

      {/* === ALL LANDSCAPE IN ONE SVG === */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        style={{ height: "55%" }}
      >
        {/* Distant treeline - soft bumpy tops */}
        <path
          d="M0 300 Q60 240 120 270 Q160 210 200 260 Q240 190 280 240 Q320 210 360 265 Q400 230 440 250 Q480 185 520 235 Q560 210 600 260 Q640 200 680 245 Q720 220 760 268 Q800 238 840 252 Q880 192 920 228 Q960 210 1000 260 Q1040 228 1080 245 Q1120 200 1160 235 Q1200 218 1240 268 Q1280 238 1320 252 Q1360 210 1400 242 L1440 265 L1440 600 L0 600 Z"
          fill={isDark ? "#0A1A0C" : "#1D4420"}
          opacity={isDark ? 0.6 : 0.15}
        />

        {/* Fairy string light wires */}
        <path
          d="M260 270 Q370 248 500 268"
          fill="none"
          stroke={isDark ? "#C49A3C" : "#1D4420"}
          strokeWidth={isDark ? "0.8" : "0.5"}
          opacity={isDark ? 0.2 : 0.1}
        />
        <path
          d="M880 242 Q990 220 1120 244"
          fill="none"
          stroke={isDark ? "#C49A3C" : "#1D4420"}
          strokeWidth={isDark ? "0.8" : "0.5"}
          opacity={isDark ? 0.2 : 0.1}
        />
        {/* Fairy light bulbs -- glow brighter in dark mode */}
        {[
          { cx: 300, cy: 262 },
          { cx: 340, cy: 256 },
          { cx: 380, cy: 253 },
          { cx: 420, cy: 255 },
          { cx: 460, cy: 260 },
          { cx: 920, cy: 236 },
          { cx: 960, cy: 230 },
          { cx: 1000, cy: 228 },
          { cx: 1040, cy: 231 },
          { cx: 1080, cy: 238 },
        ].map((l, i) => (
          <g key={`fl-${i}`}>
            {isDark && (
              <circle
                cx={l.cx}
                cy={l.cy}
                r="6"
                fill="#C49A3C"
                opacity="0.15"
                className="animate-fairy-light-twinkle"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            )}
            <circle
              cx={l.cx}
              cy={l.cy}
              r={isDark ? "3" : "2.5"}
              fill="#C49A3C"
              opacity={isDark ? 0.7 : 0.3}
              className="animate-fairy-light-twinkle"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          </g>
        ))}

        {/* Mid hills layer 1 - gentle rolling */}
        <path
          d="M0 600 L0 380 Q180 320 360 360 Q540 300 720 340 Q900 290 1080 335 Q1260 310 1440 365 L1440 600 Z"
          fill={isDark ? "#0B160D" : "#5C7A4A"}
          opacity={isDark ? 0.7 : 0.2}
        />

        {/* Mid hills layer 2 - slightly closer */}
        <path
          d="M0 600 L0 400 Q240 350 480 385 Q720 330 960 370 Q1200 345 1440 395 L1440 600 Z"
          fill={isDark ? "#0D1A0F" : "#5C7A4A"}
          opacity={isDark ? 0.8 : 0.3}
        />

        {/* Gnome silhouettes on the hills */}
        <g transform="translate(320, 340)" opacity={isDark ? 0.35 : 0.2}>
          <polygon points="0,-14 5,0 -5,0" fill={isDark ? "#040A05" : "#1D4420"} />
          <circle cx="0" cy="3" r="4" fill={isDark ? "#040A05" : "#1D4420"} />
          <ellipse cx="0" cy="9" rx="5" ry="5.5" fill={isDark ? "#040A05" : "#1D4420"} />
          <ellipse cx="0" cy="6" rx="3" ry="4" fill={isDark ? "#040A05" : "#1D4420"} opacity="0.7" />
        </g>
        <g transform="translate(1060, 310)" opacity={isDark ? 0.3 : 0.15}>
          <polygon points="0,-12 4,0 -4,0" fill={isDark ? "#040A05" : "#1D4420"} />
          <circle cx="0" cy="2.5" r="3.5" fill={isDark ? "#040A05" : "#1D4420"} />
          <ellipse cx="0" cy="8" rx="4.5" ry="5" fill={isDark ? "#040A05" : "#1D4420"} />
        </g>
        <g transform="translate(700, 325)" opacity={isDark ? 0.25 : 0.12}>
          <polygon points="0,-10 3.5,0 -3.5,0" fill={isDark ? "#040A05" : "#1D4420"} />
          <circle cx="0" cy="2" r="3" fill={isDark ? "#040A05" : "#1D4420"} />
          <ellipse cx="0" cy="7" rx="3.5" ry="4" fill={isDark ? "#040A05" : "#1D4420"} />
        </g>

        {/* Foreground hills - richest green, closest */}
        <path
          d="M0 600 L0 460 Q200 410 400 445 Q600 395 800 435 Q1000 405 1200 450 Q1350 425 1440 455 L1440 600 Z"
          fill={isDark ? "#0F200F" : "#7A9966"}
          opacity={isDark ? 0.85 : 0.4}
        />
        <path
          d="M0 600 L0 500 Q180 460 400 485 Q650 450 900 480 Q1100 455 1300 482 Q1400 470 1440 490 L1440 600 Z"
          fill={isDark ? "#112411" : "#8FAA78"}
          opacity={isDark ? 0.9 : 0.3}
        />

        {/* Toadstool mushrooms in the foreground */}
        {[
          { x: 160, y: 480, s: 0.9 },
          { x: 500, y: 470, s: 0.7 },
          { x: 850, y: 478, s: 0.8 },
          { x: 1120, y: 485, s: 0.6 },
          { x: 680, y: 475, s: 0.65 },
        ].map((m, i) => (
          <g key={`ts-${i}`} transform={`translate(${m.x}, ${m.y}) scale(${m.s})`}>
            <rect x="-3" y="0" width="6" height="10" rx="2" fill={isDark ? "#2A2018" : "#F0EADE"} opacity={isDark ? 0.6 : 0.5} />
            <ellipse cx="0" cy="-2" rx="10" ry="8" fill={isDark ? "#5A2020" : "#9B4040"} opacity={isDark ? 0.5 : 0.35} />
            <circle cx="-4" cy="-5" r="1.5" fill={isDark ? "#C8C0B0" : "#FDF8F0"} opacity={isDark ? 0.3 : 0.4} />
            <circle cx="3" cy="-6" r="1.2" fill={isDark ? "#C8C0B0" : "#FDF8F0"} opacity={isDark ? 0.3 : 0.4} />
            <circle cx="5" cy="-2" r="1" fill={isDark ? "#C8C0B0" : "#FDF8F0"} opacity={isDark ? 0.2 : 0.3} />
          </g>
        ))}

        {/* Fairy door -- glows subtly in dark mode */}
        <g transform="translate(310, 470)" opacity={isDark ? 0.4 : 0.25} className="hidden sm:block">
          <path d="M-7 12 L-7 -3 Q-7 -12 0 -12 Q7 -12 7 -3 L7 12 Z" fill="#5C3A1A" />
          <path d="M-5 12 L-5 -2 Q-5 -10 0 -10 Q5 -10 5 -2 L5 12 Z" fill="#8B6914" opacity="0.6" />
          <circle cx="3.5" cy="5" r="1" fill="#C49A3C" opacity={isDark ? 0.9 : 0.7} />
          {isDark && <circle cx="3.5" cy="5" r="3" fill="#C49A3C" opacity="0.15" />}
          <circle cx="0" cy="-4" r="1.8" fill="#C49A3C" opacity={isDark ? 0.4 : 0.25} />
        </g>
      </svg>

      {/* Scattered wildflowers (HTML overlay, positioned in bottom area) */}
      <Wildflowers />

      {/* Gentle floating petals */}
      <FloatingPetals />
    </div>
  );
}

function Fireflies({ isDark }: { isDark: boolean }) {
  const fireflies = [
    { left: "15%", top: "25%", delay: "0s", duration: "4s" },
    { left: "35%", top: "35%", delay: "1.5s", duration: "5s" },
    { left: "55%", top: "20%", delay: "0.8s", duration: "3.5s" },
    { left: "75%", top: "30%", delay: "2.2s", duration: "4.5s" },
    { left: "25%", top: "45%", delay: "3s", duration: "3.8s" },
    { left: "65%", top: "40%", delay: "1s", duration: "5.2s" },
    { left: "85%", top: "22%", delay: "0.3s", duration: "4.2s" },
    { left: "45%", top: "50%", delay: "2.5s", duration: "3.3s" },
    { left: "10%", top: "38%", delay: "1.8s", duration: "4.8s" },
    { left: "90%", top: "42%", delay: "0.6s", duration: "3.6s" },
  ];

  const extraFireflies = isDark
    ? [
        { left: "5%", top: "18%", delay: "0.4s", duration: "4.6s" },
        { left: "48%", top: "15%", delay: "1.2s", duration: "3.9s" },
        { left: "72%", top: "48%", delay: "2.8s", duration: "5.1s" },
        { left: "38%", top: "55%", delay: "0.9s", duration: "4.3s" },
        { left: "82%", top: "35%", delay: "1.6s", duration: "3.7s" },
        { left: "20%", top: "52%", delay: "3.2s", duration: "4.1s" },
      ]
    : [];

  const allFireflies = [...fireflies, ...extraFireflies];

  return (
    <>
      {allFireflies.map((f, i) => (
        <div
          key={i}
          className="animate-firefly absolute rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: isDark ? "10px" : "6px",
            height: isDark ? "10px" : "6px",
            animationDelay: f.delay,
            animationDuration: f.duration,
            background: isDark
              ? "radial-gradient(circle, rgba(212,174,86,1) 0%, rgba(196,154,60,0.6) 40%, transparent 100%)"
              : "radial-gradient(circle, rgba(196,154,60,0.9) 0%, rgba(196,154,60,0.35) 60%, transparent 100%)",
            boxShadow: isDark
              ? "0 0 14px rgba(196,154,60,0.8), 0 0 28px rgba(196,154,60,0.3)"
              : "0 0 8px rgba(196,154,60,0.6)",
          }}
        />
      ))}
    </>
  );
}

function Wildflowers() {
  const flowers = [
    { left: "8%", bottom: "6%", color: "#E8C8B8", size: "text-base" },
    { left: "18%", bottom: "4%", color: "#C49A3C", size: "text-sm" },
    { left: "30%", bottom: "7%", color: "#D4A894", size: "text-xs" },
    { left: "42%", bottom: "5%", color: "#C49A3C", size: "text-base" },
    { left: "58%", bottom: "6%", color: "#E8C8B8", size: "text-sm" },
    { left: "70%", bottom: "4%", color: "#C49A3C", size: "text-xs" },
    { left: "82%", bottom: "8%", color: "#D4A894", size: "text-base" },
    { left: "92%", bottom: "5%", color: "#C49A3C", size: "text-sm" },
  ];

  return (
    <>
      {flowers.map((f, i) => (
        <div
          key={i}
          className={`animate-gentle-sway absolute ${f.size} opacity-40`}
          style={{
            left: f.left,
            bottom: f.bottom,
            animationDelay: `${i * 0.5}s`,
            color: f.color,
          }}
        >
          *
        </div>
      ))}
    </>
  );
}

function FloatingPetals() {
  const petals = [
    { left: "10%", delay: "0s", duration: "14s", size: 6 },
    { left: "25%", delay: "3s", duration: "16s", size: 5 },
    { left: "40%", delay: "6s", duration: "12s", size: 7 },
    { left: "60%", delay: "2s", duration: "15s", size: 5 },
    { left: "75%", delay: "8s", duration: "13s", size: 6 },
    { left: "90%", delay: "4s", duration: "17s", size: 4 },
  ];

  return (
    <>
      {petals.map((p, i) => (
        <div
          key={i}
          className="animate-petal-fall absolute"
          style={{
            left: p.left,
            top: "-5%",
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50% 0 50% 50%",
            background:
              i % 2 === 0
                ? "rgba(196,154,60,0.5)"
                : "rgba(232,200,184,0.5)",
          }}
        />
      ))}
    </>
  );
}

function NightStars() {
  const stars = [
    { left: "5%", top: "5%", size: 1.5, delay: "0s" },
    { left: "12%", top: "8%", size: 1, delay: "0.8s" },
    { left: "22%", top: "3%", size: 2, delay: "1.5s" },
    { left: "30%", top: "10%", size: 1, delay: "0.3s" },
    { left: "38%", top: "4%", size: 1.5, delay: "2s" },
    { left: "48%", top: "7%", size: 1, delay: "1.2s" },
    { left: "55%", top: "2%", size: 2, delay: "0.6s" },
    { left: "62%", top: "9%", size: 1, delay: "1.8s" },
    { left: "70%", top: "5%", size: 1.5, delay: "0.4s" },
    { left: "78%", top: "11%", size: 1, delay: "2.2s" },
    { left: "88%", top: "4%", size: 1.5, delay: "1s" },
    { left: "95%", top: "8%", size: 1, delay: "1.6s" },
    { left: "8%", top: "14%", size: 1, delay: "2.5s" },
    { left: "42%", top: "12%", size: 1, delay: "0.9s" },
    { left: "75%", top: "15%", size: 1.5, delay: "1.4s" },
    { left: "18%", top: "16%", size: 1, delay: "2.1s" },
    { left: "52%", top: "13%", size: 1, delay: "0.7s" },
    { left: "85%", top: "14%", size: 1, delay: "1.9s" },
  ];

  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          className="animate-star-twinkle absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: "rgba(220, 230, 240, 0.8)",
            boxShadow: "0 0 3px rgba(220, 230, 240, 0.4)",
            animationDelay: s.delay,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        />
      ))}
    </>
  );
}

function FairyDustTrail({ isDark }: { isDark: boolean }) {
  const sparkles = [
    { left: "20%", top: "30%", delay: "0s", duration: "3s", size: 3 },
    { left: "30%", top: "25%", delay: "0.5s", duration: "2.5s", size: 2 },
    { left: "40%", top: "35%", delay: "1s", duration: "3.5s", size: 2.5 },
    { left: "50%", top: "28%", delay: "1.5s", duration: "2.8s", size: 2 },
    { left: "60%", top: "32%", delay: "0.8s", duration: "3.2s", size: 3 },
    { left: "70%", top: "26%", delay: "2s", duration: "2.6s", size: 2 },
    { left: "80%", top: "34%", delay: "0.3s", duration: "3s", size: 2.5 },
    { left: "25%", top: "40%", delay: "1.2s", duration: "2.7s", size: 1.5 },
    { left: "45%", top: "22%", delay: "2.2s", duration: "3.3s", size: 2 },
    { left: "65%", top: "38%", delay: "0.7s", duration: "2.4s", size: 1.5 },
    { left: "85%", top: "29%", delay: "1.8s", duration: "3.1s", size: 2 },
    { left: "15%", top: "36%", delay: "2.5s", duration: "2.9s", size: 1.5 },
  ];

  return (
    <>
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="animate-fairy-sparkle absolute"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.duration,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
        >
          <svg
            width={s.size * 3}
            height={s.size * 3}
            viewBox="0 0 12 12"
            fill="none"
            style={{ marginLeft: `-${s.size}px`, marginTop: `-${s.size}px` }}
          >
            <path
              d="M6 0 L7 4.5 L12 6 L7 7.5 L6 12 L5 7.5 L0 6 L5 4.5 Z"
              fill="#C49A3C"
              opacity={isDark ? "0.8" : "0.5"}
            />
          </svg>
        </div>
      ))}
    </>
  );
}
