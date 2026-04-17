import type { Metadata } from "next";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: "Brooker Family Calendar",
  description: "Family task calendar for the Brooker household",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <InstallPrompt />
    </>
  );
}
