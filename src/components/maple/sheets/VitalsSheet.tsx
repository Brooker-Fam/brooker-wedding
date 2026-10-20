"use client";

import { Sheet } from "../ui";
import type { SheetProps } from "./index";

// Placeholder: replaced by the VitalsSheet implementation.
export default function VitalsSheet({ open, onClose, kind }: SheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={kind}>
      <p>Coming soon</p>
    </Sheet>
  );
}
