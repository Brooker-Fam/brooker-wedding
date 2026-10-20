"use client";

import type { TabId } from "./MapleApp";
import { EmptyState } from "./ui";

// Placeholder: replaced by the TodayTab implementation.
export default function TodayTab({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  void onNavigate;
  return <EmptyState emoji="🌱" title="TodayTab is growing" />;
}
