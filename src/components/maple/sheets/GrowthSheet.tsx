"use client";

import { Sheet } from "../ui";
import type { SheetProps } from "./index";

// Placeholder: replaced by the GrowthSheet implementation.
export default function GrowthSheet({ open, onClose, kind }: SheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={kind}>
      <p>Coming soon</p>
    </Sheet>
  );
}
