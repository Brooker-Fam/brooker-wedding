import { NextRequest, NextResponse } from "next/server";
import { updateEventOverrides } from "@/lib/calendar/events-db";
import { captureServerException } from "@/lib/posthog-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "invalid id" }, { status: 400 });
    }
    const body = await request.json();
    const patch: {
      assigned_to?: number | null;
      points?: number;
      color_override?: string | null;
      auto_award?: boolean;
    } = {};
    if (body.assigned_to === null || typeof body.assigned_to === "number") {
      patch.assigned_to = body.assigned_to;
    }
    if (typeof body.points === "number") patch.points = body.points;
    if (body.color_override === null || typeof body.color_override === "string") {
      patch.color_override = body.color_override;
    }
    if (typeof body.auto_award === "boolean") patch.auto_award = body.auto_award;

    const updated = await updateEventOverrides(id, patch);
    if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    await captureServerException(err, {
      route: "PATCH /api/calendar/events/[id]",
    });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
