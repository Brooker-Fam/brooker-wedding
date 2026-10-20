"use client";

import type { TabId } from "./MapleApp";
import { EmptyState } from "./ui";

// Placeholder: replaced by the Waiting implementation.
export default function Waiting({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  void onNavigate;
  return <EmptyState emoji="🌱" title="Waiting is growing" />;
}
