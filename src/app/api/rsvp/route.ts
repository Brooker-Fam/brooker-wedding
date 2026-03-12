import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      attending = true,
      guest_count = 1,
      dietary_restrictions = "",
      potluck_dish = "",
      message = "",
      public_display = false,
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

    const guestCount = Number(guest_count);
    if (attending && (isNaN(guestCount) || guestCount < 1)) {
      return NextResponse.json(
        { error: "Guest count must be at least 1" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO rsvps (name, email, attending, guest_count, dietary_restrictions, potluck_dish, message, public_display)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, attending, guest_count, dietary_restrictions, potluck_dish, message, public_display, created_at`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        attending,
        attending ? guestCount : 0,
        dietary_restrictions.trim(),
        potluck_dish.trim(),
        message.trim(),
        Boolean(public_display),
      ]
    );

    if (!result) {
      return NextResponse.json({
        success: true,
        data: {
          id: Date.now(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          attending,
          guest_count: attending ? guestCount : 0,
          dietary_restrictions: dietary_restrictions.trim(),
          potluck_dish: potluck_dish.trim(),
          message: message.trim(),
          public_display: Boolean(public_display),
          created_at: new Date().toISOString(),
        },
        mock: true,
      });
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
        "SELECT id, name, email, attending, guest_count, dietary_restrictions, potluck_dish, message, public_display, created_at, updated_at FROM rsvps WHERE id = $1",
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

    // Full list requires admin auth
    const authHeader = request.headers.get("authorization");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await query(
      "SELECT * FROM rsvps ORDER BY created_at DESC"
    );

    if (!result) {
      return NextResponse.json({
        data: [],
        mock: true,
      });
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
  try {
    const body = await request.json();
    const {
      id,
      name,
      email,
      attending = true,
      guest_count = 1,
      dietary_restrictions = "",
      potluck_dish = "",
      message = "",
      public_display = false,
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

    const guestCount = Number(guest_count);
    if (attending && (isNaN(guestCount) || guestCount < 1)) {
      return NextResponse.json(
        { error: "Guest count must be at least 1" },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE rsvps
       SET name = $1, email = $2, attending = $3, guest_count = $4,
           dietary_restrictions = $5, potluck_dish = $6, message = $7,
           public_display = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING id, name, email, attending, guest_count, dietary_restrictions, potluck_dish, message, public_display, created_at, updated_at`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        attending,
        attending ? guestCount : 0,
        dietary_restrictions.trim(),
        potluck_dish.trim(),
        message.trim(),
        Boolean(public_display),
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
