"use client";

import dynamic from "next/dynamic";
import GameWrapper from "@/components/games/GameWrapper";

const CakeCreator = dynamic(() => import("@/components/games/CakeCreator"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <p className="font-mono text-amber-400 animate-pulse">Loading...</p>
    </div>
  ),
});

export default function CakeCreatorPage() {
  return (
    <GameWrapper title="CAKE CREATOR" backHref="/games" storageKey="cakeCreator">
      {({ onGameOver }) => <CakeCreator onGameOver={onGameOver} />}
    </GameWrapper>
  );
}
