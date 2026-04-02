import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "zoe";

function isAdmin(request: NextRequest): boolean {
  const { searchParams } = new URL(request.url);
  return searchParams.get("secret") === ADMIN_SECRET;
}

/** Normalize a phone string to E.164 (+1XXXXXXXXXX) for SMS. Returns null if empty. */
function normalizePhone(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 0) return null;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === "1") return `+${digits}`;
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      attending = true,
      adult_count = 1,
      child_count = 0,
      dietary_restrictions = "",
      potluck_dish = "",
      message = "",
      public_display = false,
      phone = "",
    } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    const adults = attending ? Math.max(1, Number(adult_count) || 1) : 0;
    const children = attending ? Math.max(0, Number(child_count) || 0) : 0;
    const guestCount = adults + children;

    const normalizedPhone = normalizePhone(phone);

    const result = await query(
      `INSERT INTO rsvps (name, email, attending, guest_count, adult_count, child_count, dietary_restrictions, potluck_dish, message, public_display, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, name, email, attending, guest_count, adult_count, child_count, dietary_restrictions, potluck_dish, message, public_display, phone, created_at`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        attending,
        guestCount,
        adults,
        children,
        dietary_restrictions.trim(),
        potluck_dish.trim(),
        message.trim(),
        Boolean(public_display),
        normalizedPhone,
      ]
    );

    if (!result) {
      return NextResponse.json(
        { error: "RSVP could not be saved. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit RSVP. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single RSVP lookup by id — no auth required
    if (id) {
      const result = await query(
        "SELECT id, name, email, attending, guest_count, adult_count, child_count, dietary_restrictions, potluck_dish, message, public_display, phone, created_at, updated_at FROM rsvps WHERE id = $1",
        [Number(id)]
      );

      if (!result || result.length === 0) {
        return NextResponse.json(
          { error: "RSVP not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: result[0] });
    }

    // Full list — requires admin secret
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await query(
      "SELECT * FROM rsvps ORDER BY created_at DESC"
    );

    if (!result) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("RSVP fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      name,
      email,
      attending = true,
      adult_count = 1,
      child_count = 0,
      dietary_restrictions = "",
      potluck_dish = "",
      message = "",
      public_display = false,
      phone = "",
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "RSVP id is required" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    const adults = attending ? Math.max(1, Number(adult_count) || 1) : 0;
    const children = attending ? Math.max(0, Number(child_count) || 0) : 0;
    const guestCount = adults + children;

    const normalizedPhone = normalizePhone(phone);

    const result = await query(
      `UPDATE rsvps
       SET name = $1, email = $2, attending = $3, guest_count = $4,
           adult_count = $5, child_count = $6,
           dietary_restrictions = $7, potluck_dish = $8, message = $9,
           public_display = $10, phone = $11, updated_at = NOW()
       WHERE id = $12
       RETURNING id, name, email, attending, guest_count, adult_count, child_count, dietary_restrictions, potluck_dish, message, public_display, phone, created_at, updated_at`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        attending,
        guestCount,
        adults,
        children,
        dietary_restrictions.trim(),
        potluck_dish.trim(),
        message.trim(),
        Boolean(public_display),
        normalizedPhone,
        Number(id),
      ]
    );

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "RSVP not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("RSVP update error:", error);
    return NextResponse.json(
      { error: "Failed to update RSVP. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "RSVP id is required" },
        { status: 400 }
      );
    }

    const result = await query(
      "DELETE FROM rsvps WHERE id = $1 RETURNING id",
      [Number(id)]
    );

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "RSVP not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RSVP delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete RSVP" },
      { status: 500 }
    );
  }
}
