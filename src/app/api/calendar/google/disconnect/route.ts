import { NextResponse } from "next/server";
import { disconnect } from "@/lib/google";
import { captureServerException } from "@/lib/posthog-server";

export async function POST() {
  try {
    await disconnect();
    return NextResponse.json({ ok: true });
  } catch (err) {
    await captureServerException(err, {
      route: "POST /api/calendar/google/disconnect",
    });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
