"use client";

import { Sheet } from "../ui";
import type { SheetProps } from "./index";

// Placeholder: replaced by the MedSheet implementation.
export default function MedSheet({ open, onClose, kind }: SheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={kind}>
      <p>Coming soon</p>
    </Sheet>
  );
}
