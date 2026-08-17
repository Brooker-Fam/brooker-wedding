import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShareCard from "@/components/backpacking/ShareCard";
import { FORMATS, type Format } from "@/lib/backpacking-share";

// The card alone, at true pixel size and with no page chrome, so a headless
// browser can screenshot the element straight into public/backpacking/.
export const metadata: Metadata = { title: "share card", robots: { index: false } };

export default async function RawShareCard({ params }: { params: Promise<{ format: string }> }) {
  const { format } = await params;
  if (!(format in FORMATS)) notFound();
  return (
    <>
      {/* The site header is fixed, so it would land inside an element screenshot. */}
      <style>
        {"body nav, body > div > button, nextjs-portal { display: none !important; }"}
      </style>
      <ShareCard format={format as Format} scaled={false} />
    </>
  );
}
