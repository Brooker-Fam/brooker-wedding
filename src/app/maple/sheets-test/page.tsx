"use client";

// TEMPORARY test harness for the log/edit sheets. Delete before shipping.
import { useEffect } from "react";
import { SheetProvider, useSheets } from "@/components/maple/sheets";
import { ToastHost } from "@/components/maple/ui";
import { MapleProvider, useMaple } from "@/components/maple/useMaple";

export default function SheetsTest() {
  return (
    <MapleProvider>
      <SheetProvider>
        <Harness />
      </SheetProvider>
    </MapleProvider>
  );
}

function Harness() {
  const { open } = useSheets();
  const m = useMaple();
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__openSheet = open;
    w.__maple = m;
  });
  return (
    <div className="p-4 text-sm">
      <p id="status">{m.status}</p>
      <p>{m.state?.entries.length ?? 0} entries</p>
      <ToastHost />
    </div>
  );
}
