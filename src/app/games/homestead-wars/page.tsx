import type { Metadata } from "next";
import HomesteadWars from "@/components/games/HomesteadWars";

export const metadata: Metadata = {
  title: "Homestead Wars - Farm RTS Battle!",
  description:
    "A StarCraft-inspired farm RTS: build your homestead, train farm animals, and destroy the enemy farmhouse!",
};

export default function HomesteadWarsPage() {
  return <HomesteadWars />;
}
