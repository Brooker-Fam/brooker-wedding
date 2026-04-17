import { NextRequest, NextResponse } from "next/server";
import { createRedemption, getRedemptions } from "@/lib/calendar/db";
import { captureServerException } from "@/lib/posthog-server";

export async function GET() {
  try {
    const rows = await getRedemptions();
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/calendar/redemptions failed:", err);
    await captureServerException(err, {
      route: "GET /api/calendar/redemptions",
    });
    return NextResponse.json(
      { error: "Failed to load redemptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const memberId = Number(body.member_id);
    const amount = Number(body.amount);
    const label = typeof body.label === "string" ? body.label.trim() : "";

    if (!memberId || !amount || amount <= 0 || !label) {
      return NextResponse.json(
        { error: "member_id, positive amount, and label required" },
        { status: 400 }
      );
    }

    const row = await createRedemption(memberId, Math.floor(amount), label);
    return NextResponse.json(row);
  } catch (err) {
    console.error("POST /api/calendar/redemptions failed:", err);
    await captureServerException(err, {
      route: "POST /api/calendar/redemptions",
    });
    return NextResponse.json(
      { error: "Failed to redeem points" },
      { status: 500 }
    );
  }
}
