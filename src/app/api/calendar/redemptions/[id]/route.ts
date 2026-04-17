import { NextResponse } from "next/server";
import { deleteRedemption } from "@/lib/calendar/db";
import { captureServerException } from "@/lib/posthog-server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!numId) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await deleteRedemption(numId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/calendar/redemptions/[id] failed:", err);
    await captureServerException(err, {
      route: "DELETE /api/calendar/redemptions/[id]",
    });
    return NextResponse.json(
      { error: "Failed to delete redemption" },
      { status: 500 }
    );
  }
}
