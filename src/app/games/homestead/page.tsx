"use client";

import dynamic from "next/dynamic";
import GameWrapper from "@/components/games/GameWrapper";

const HomesteadGame = dynamic(
  () => import("@/components/games/HomesteadGame"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <p className="font-mono text-amber-400 animate-pulse">Loading...</p>
      </div>
    ),
  }
);

export default function HomesteadPage() {
  return (
    <GameWrapper
      title="BROOKER HOMESTEAD"
      backHref="/games"
      storageKey="homestead"
    >
      {({ onGameOver }) => <HomesteadGame onGameOver={onGameOver} />}
    </GameWrapper>
  );
}
