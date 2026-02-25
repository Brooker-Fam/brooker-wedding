"use client";

import dynamic from "next/dynamic";
import GameWrapper from "@/components/games/GameWrapper";

const HereComesTheBride = dynamic(() => import("@/components/games/HereComesTheBride"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <p className="font-mono text-amber-400 animate-pulse">Loading...</p>
    </div>
  ),
});

export default function HereComesTheBridePage() {
  return (
    <GameWrapper title="HERE COMES THE BRIDE" backHref="/games" storageKey="hereComesTheBride">
      {({ onGameOver }) => <HereComesTheBride onGameOver={onGameOver} />}
    </GameWrapper>
  );
}
