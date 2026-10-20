"use client";

import { Sheet } from "../ui";
import type { SheetProps } from "./index";

// Placeholder: replaced by the DiaperSheet implementation.
export default function DiaperSheet({ open, onClose, kind }: SheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={kind}>
      <p>Coming soon</p>
    </Sheet>
  );
}
