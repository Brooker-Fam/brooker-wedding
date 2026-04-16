import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brooker Family Calendar",
  description: "Family task calendar for the Brooker household",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
