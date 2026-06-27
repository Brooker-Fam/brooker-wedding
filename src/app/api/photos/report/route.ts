import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";
import { checkUploadRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// A guest flags a photo as inappropriate. We hide it right away (approved=FALSE)
// so bad content disappears for everyone without waiting on the admin, and mark
// it reported so the admin can restore it (if it was a mis-tap) or delete it on
// /photos/manage. Rate-limited per IP to stop mass-report scripting; at a small
// trusted family party the upside (instant takedown) beats the griefing risk.
export async function POST(request: NextRequest) {
  try {
    const { allowed } = await checkUploadRateLimit(request);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests — try again shortly." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const id = Number(body?.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Valid photo id is required" }, { status: 400 });
    }

    const result = await query(
      `UPDATE photos SET approved = FALSE, reported = TRUE WHERE id = $1`,
      [id]
    );
    if (!result) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Photo report error:", error);
    await captureServerException(error, { route: "POST /api/photos/report" });
    return NextResponse.json({ error: "Failed to report photo" }, { status: 500 });
  }
}
