"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function FarmScene() {
  const { isDark } = useTheme();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Creekside sky -- light: warm overcast, dark: midnight forest */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #050D06 0%, #091408 25%, #0D1F0F 50%, #0F2812 80%, #0A1A0C 100%)"
            : "linear-gradient(180deg, #D8D1B8 0%, #E6DDC6 25%, #E9DDC6 52%, #CCD8B1 82%, #AEBF87 100%)",
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

        {/* Foreground hills - richest green, closest */}
        <path
          d="M0 600 L0 460 Q200 410 400 445 Q600 395 800 435 Q1000 405 1200 450 Q1350 425 1440 455 L1440 600 Z"
          fill={isDark ? "#0F200F" : "#66784A"}
          opacity={isDark ? 0.85 : 0.48}
        />
        <path
          d="M0 600 L0 500 Q180 460 400 485 Q650 450 900 480 Q1100 455 1300 482 Q1400 470 1440 490 L1440 600 Z"
          fill={isDark ? "#112411" : "#8B9B62"}
          opacity={isDark ? 0.9 : 0.42}
        />

        {/* Creek ribbon */}
        <path
          d="M780 600 C820 565 860 540 910 520 C970 496 1025 500 1088 476 C1138 457 1170 430 1212 405"
          fill="none"
          stroke={isDark ? "#526A5A" : "#7EA095"}
          strokeWidth="34"
          strokeLinecap="round"
          opacity={isDark ? 0.32 : 0.36}
        />
        <path
          d="M785 600 C825 566 862 544 914 524 C972 502 1024 504 1084 482 C1134 464 1168 436 1208 412"
          fill="none"
          stroke={isDark ? "#A7B89B" : "#DDE7D8"}
          strokeWidth="4"
          strokeLinecap="round"
          opacity={isDark ? 0.16 : 0.38}
        />

        {/* Mossy stones */}
        {[
          { x: 735, y: 548, s: 1 },
          { x: 835, y: 520, s: 0.7 },
          { x: 1040, y: 505, s: 0.8 },
          { x: 1210, y: 430, s: 0.65 },
        ].map((stone, i) => (
          <g key={`stone-${i}`} transform={`translate(${stone.x}, ${stone.y}) scale(${stone.s})`} opacity={isDark ? 0.34 : 0.38}>
            <ellipse cx="0" cy="0" rx="24" ry="10" fill={isDark ? "#39412E" : "#77815F"} />
            <path d="M-15 -3 Q-2 -10 13 -4" fill="none" stroke={isDark ? "#81915C" : "#AEBF87"} strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}

        {/* Weathered pasture fence */}
        <g opacity={isDark ? 0.36 : 0.32}>
          <path d="M90 470 H1350" stroke={isDark ? "#7A5A32" : "#6B4226"} strokeWidth="5" strokeLinecap="round" />
          <path d="M90 492 H1350" stroke={isDark ? "#7A5A32" : "#6B4226"} strokeWidth="4" strokeLinecap="round" />
          {Array.from({ length: 15 }).map((_, i) => (
            <rect
              key={i}
              x={120 + i * 86}
              y="445"
              width="8"
              height="70"
              rx="2"
              fill={isDark ? "#7A5A32" : "#6B4226"}
            />
          ))}
        </g>

        {/* Pasture pigs */}
        {[
          { x: 260, y: 492, s: 1 },
          { x: 980, y: 478, s: 0.86 },
          { x: 1130, y: 504, s: 0.7 },
        ].map((pig, i) => (
          <g key={`pig-${i}`} transform={`translate(${pig.x}, ${pig.y}) scale(${pig.s})`} opacity={isDark ? 0.42 : 0.42}>
            <ellipse cx="0" cy="0" rx="42" ry="20" fill={isDark ? "#3A2218" : "#8B5E3C"} />
            <circle cx="38" cy="-5" r="18" fill={isDark ? "#3A2218" : "#8B5E3C"} />
            <path d="M48 -20 L55 -31 L59 -15 Z" fill={isDark ? "#3A2218" : "#8B5E3C"} />
            <ellipse cx="52" cy="-3" rx="8" ry="5" fill={isDark ? "#4A2A1D" : "#A87955"} />
            <circle cx="43" cy="-10" r="2" fill={isDark ? "#0A0907" : "#2A160C"} />
            <path d="M-39 -2 Q-52 -10 -46 -18" fill="none" stroke={isDark ? "#3A2218" : "#8B5E3C"} strokeWidth="4" strokeLinecap="round" />
            <rect x="-25" y="12" width="7" height="22" rx="3" fill={isDark ? "#2A1812" : "#6B4226"} />
            <rect x="14" y="12" width="7" height="22" rx="3" fill={isDark ? "#2A1812" : "#6B4226"} />
          </g>
        ))}
      </svg>

      {/* Scattered wildflowers (HTML overlay, positioned in bottom area) */}
      <Wildflowers />

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
