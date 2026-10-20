"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import FamilyTab from "./FamilyTab";
import LogTab from "./LogTab";
import MomentsTab from "./MomentsTab";
import PatternsTab from "./PatternsTab";
import SignIn from "./SignIn";
import TodayTab from "./TodayTab";
import { SheetProvider } from "./sheets";
import { ToastHost, cx, tone } from "./ui";
import { MapleProvider, useMaple } from "./useMaple";

/**
 * Maple's Log app shell: provider, sign-in gate, and the bottom tab bar.
 * Logging never waits on the birth form: before she's born, Today shows the
 * waiting hero ("She's here!") above the same logging dock.
 */

export type TabId = "today" | "log" | "patterns" | "moments" | "family";

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "today", label: "Today", emoji: "🍁" },
  { id: "log", label: "Timeline", emoji: "📖" },
  { id: "patterns", label: "Patterns", emoji: "🌙" },
  { id: "moments", label: "Moments", emoji: "📸" },
  { id: "family", label: "Family", emoji: "🏡" },
];

const TAB_KEY = "maple-tab";

export default function MapleApp() {
  return (
    <MapleProvider>
      <SheetProvider>
        <Shell />
      </SheetProvider>
    </MapleProvider>
  );
}

function Shell() {
  const { status, state, error, refresh } = useMaple();
  const [tab, setTab] = useState<TabId>("today");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(TAB_KEY) as TabId | null;
      if (saved && TABS.some((t) => t.id === saved)) setTab(saved);
    } catch {
      // storage blocked
    }
  }, []);

  const go = (t: TabId) => {
    setTab(t);
    window.scrollTo({ top: 0 });
    try {
      sessionStorage.setItem(TAB_KEY, t);
    } catch {
      // storage blocked
    }
  };

  if (status === "loading") return <Splash />;
  if (status === "signedOut") return <SignIn />;
  if (status === "error" || !state) {
    return (
      <Splash>
        <p className={cx(tone.muted, "mt-4 text-sm")}>{error ?? "Couldn't reach Maple's log."}</p>
        <button type="button" onClick={() => void refresh()} className="mt-3 min-h-[44px] rounded-full bg-[#1D4420] px-5 text-sm font-semibold text-[#FDF8F0]">
          Try again
        </button>
      </Splash>
    );
  }

  return (
    <div className="relative mx-auto min-h-[100dvh] w-full max-w-lg pb-[calc(88px+env(safe-area-inset-bottom))]">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {tab === "today" && <TodayTab onNavigate={go} />}
          {tab === "log" && <LogTab />}
          {tab === "patterns" && <PatternsTab />}
          {tab === "moments" && <MomentsTab />}
          {tab === "family" && <FamilyTab />}
        </motion.div>
      </AnimatePresence>
      <TabBar tab={tab} onChange={go} />
      <ToastHost />
    </div>
  );
}

function TabBar({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav
      aria-label="Maple's Log"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#1D4420]/10 bg-[#FDF8F0]/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md dark:border-[#C49A3C]/15 dark:bg-[#0D1F0F]/90"
    >
      <div className="mx-auto flex max-w-lg">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex min-h-[64px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold tracking-wide transition",
                active ? "text-[#1D4420] dark:text-[#E0C27A]" : "text-[#1D4420]/50 dark:text-[#F5EDDF]/45"
              )}
            >
              <span className={cx("text-[22px] leading-none transition", active ? "scale-110" : "grayscale-[60%] opacity-80")} aria-hidden>
                {t.emoji}
              </span>
              {t.label}
              <span className={cx("mt-0.5 h-1 w-1 rounded-full", active ? "bg-[#C49A3C]" : "bg-transparent")} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Splash({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        className="text-6xl"
        animate={{ rotate: [-8, 8, -8], y: [0, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        🍁
      </motion.div>
      <p className={cx(tone.heading, "mt-3 text-2xl")}>Maple&apos;s Log</p>
      {children}
    </div>
  );
}
