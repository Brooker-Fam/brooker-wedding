import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  const file = await readFile(
    path.join(process.cwd(), "public", "sapphire", "invite.pdf")
  );
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="sapphire-invite.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
