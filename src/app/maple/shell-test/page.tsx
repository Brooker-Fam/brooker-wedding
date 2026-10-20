"use client";

// TEMPORARY visual-test harness for the shell agent. Delete before shipping.
import { NightLook } from "@/components/maple/MapleApp";
import { WelcomeHost } from "@/components/maple/BirthSheet";
import Waiting, { BirthBanner } from "@/components/maple/Waiting";
import { SheetProvider } from "@/components/maple/sheets";
import { ToastHost } from "@/components/maple/ui";
import { MapleProvider, useMaple } from "@/components/maple/useMaple";

function Inner() {
  const { status } = useMaple();
  if (status !== "ready") return <p>{status}</p>;
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6 pb-40">
      <Waiting />
      <BirthBanner />
      <ToastHost />
      <WelcomeHost />
    </div>
  );
}

export default function ShellTest() {
  return (
    <MapleProvider>
      <SheetProvider>
        <NightLook />
        <Inner />
      </SheetProvider>
    </MapleProvider>
  );
}
