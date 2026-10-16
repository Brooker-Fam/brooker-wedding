import type { Metadata } from "next";
import disputation from "@/components/atlas/content";
import { sectorLayout } from "@/components/atlas/layout";
import DebatesIndex from "./DebatesIndex";

export const metadata: Metadata = {
  title: "Thought Pages · brooker.family",
  description:
    "Long reads on contested questions, from God and morality to vaccines and saturated fat. Each sets the strongest case for each side next to the other.",
};

/* Server wrapper: the featured card's Rose emblem needs the disputation's sector
   layout, which is worked out here so the index never ships the disputation's content. */
export default function DebatesIndexPage() {
  const sectors = sectorLayout(disputation);
  return <DebatesIndex sectors={sectors} />;
}
