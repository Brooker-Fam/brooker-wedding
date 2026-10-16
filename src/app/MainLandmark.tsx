"use client";

import { usePathname } from "next/navigation";

/* Every wedding route sits in the site's <main>. The interactive disputation is the
   exception: its own frame provides the main landmark, so its top bar and footer can be
   the page's banner and contentinfo instead of being nested inside <main>. Mirrors
   Navigation.tsx's isDisputation, but only for the app itself (its /outline page has no
   frame of its own and keeps the site's <main>). */
export default function MainLandmark({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDisputationApp = pathname?.replace(/\/+$/, "") === "/debates/all-the-way-down";
  if (isDisputationApp) return <>{children}</>;
  return <main>{children}</main>;
}
