import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brooker Family · Display",
  description: "Always-on glanceable calendar view for wall-mounted tablets",
};

export default function CalendarDisplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The display page is an ambient kiosk view. It renders as a fixed
  // full-screen overlay above the site's main navigation so we don't need
  // to touch the root layout.
  return <>{children}</>;
}
