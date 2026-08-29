import type { Metadata } from "next";
import CribGuide from "@/components/crib/CribGuide";

export const metadata: Metadata = {
  title: "The Crib Build | Matt & Brittany",
  description:
    "Interactive assembly guide for the Graco Shiloh convertible crib & changer — step-by-step diagrams, parts and hardware checklists, and progress tracking.",
  robots: { index: false },
};

export default function CribPage() {
  return <CribGuide />;
}
