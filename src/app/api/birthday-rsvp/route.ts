import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";

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

    // Honeypot: bots fill this hidden field
    if (body.website) {
      return NextResponse.json({ success: true, data: { id: 0 } });
    }

    const {
      parent_name,
      child_names = "",
      email = "",
      phone = "",
      attending = true,
      kid_count = 1,
      adult_count = 1,
      allergies = "",
      birthday_wish = "",
    } = body;

    if (!parent_name || typeof parent_name !== "string" || parent_name.trim().length === 0) {
      return NextResponse.json({ error: "Parent name is required" }, { status: 400 });
    }

    const hasEmail = typeof email === "string" && email.includes("@");
    const hasPhone = typeof phone === "string" && phone.trim().length > 0;
    if (!hasEmail && !hasPhone) {
      return NextResponse.json(
        { error: "Please include a phone number or email so we can reach you." },
        { status: 400 }
      );
    }

    const kids = attending ? Math.max(0, Number(kid_count) || 0) : 0;
    const adults = attending ? Math.max(0, Number(adult_count) || 0) : 0;

    const result = await query(
      `INSERT INTO birthday_rsvps (parent_name, child_names, email, phone, attending, kid_count, adult_count, allergies, birthday_wish)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, parent_name, child_names, email, phone, attending, kid_count, adult_count, allergies, birthday_wish, created_at`,
      [
        parent_name.trim(),
        typeof child_names === "string" ? child_names.trim() : "",
        hasEmail ? email.trim().toLowerCase() : null,
        normalizePhone(typeof phone === "string" ? phone : ""),
        Boolean(attending),
        kids,
        adults,
        typeof allergies === "string" ? allergies.trim() : "",
        typeof birthday_wish === "string" ? birthday_wish.trim() : "",
      ]
    );

    if (!result) {
      return NextResponse.json(
        { error: "RSVP could not be saved. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Birthday RSVP submission error:", error);
    await captureServerException(error, { route: "POST /api/birthday-rsvp" });
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
    const summary = searchParams.get("summary");

    if (id) {
      const result = await query(
        "SELECT id, parent_name, child_names, email, phone, attending, kid_count, adult_count, allergies, birthday_wish, created_at, updated_at FROM birthday_rsvps WHERE id = $1",
        [Number(id)]
      );
      if (!result || result.length === 0) {
        return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
      }
      return NextResponse.json({ data: result[0] });
    }

    if (summary === "1") {
      const result = await query(
        `SELECT parent_name, child_names, kid_count, adult_count
         FROM birthday_rsvps
         WHERE attending = true
         ORDER BY created_at ASC`
      );
      if (!result) {
        return NextResponse.json({ guests: [], totalKids: 0, totalAdults: 0, totalRsvps: 0 });
      }
      let totalKids = 0;
      let totalAdults = 0;
      const guests: { name: string; kids: number }[] = [];
      const rows = result as Array<{ parent_name: string; child_names: string | null; kid_count: number; adult_count: number }>;
      for (const row of rows) {
        totalKids += Number(row.kid_count) || 0;
        totalAdults += Number(row.adult_count) || 0;
        const kidNames = (row.child_names ?? "")
          .split(/\n|\s*&\s*|\s*,\s*|\s+and\s+/i)
          .map((n) => n.trim())
          .filter(Boolean);
        if (kidNames.length > 0) {
          for (const name of kidNames) guests.push({ name, kids: 1 });
        } else if (row.parent_name) {
          guests.push({ name: row.parent_name, kids: Number(row.kid_count) || 0 });
        }
      }
      return NextResponse.json({
        guests,
        totalKids,
        totalAdults,
        totalRsvps: rows.length,
      });
    }

    const result = await query(
      "SELECT * FROM birthday_rsvps ORDER BY created_at DESC"
    );
    if (!result) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Birthday RSVP fetch error:", error);
    await captureServerException(error, { route: "GET /api/birthday-rsvp" });
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "RSVP id is required" }, { status: 400 });
    }
    const result = await query(
      "DELETE FROM birthday_rsvps WHERE id = $1 RETURNING id",
      [Number(id)]
    );
    if (!result || result.length === 0) {
      return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Birthday RSVP delete error:", error);
    await captureServerException(error, { route: "DELETE /api/birthday-rsvp" });
    return NextResponse.json({ error: "Failed to delete RSVP" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      parent_name,
      child_names = "",
      email = "",
      phone = "",
      attending = true,
      kid_count = 1,
      adult_count = 1,
      allergies = "",
      birthday_wish = "",
    } = body;

    if (!id) {
      return NextResponse.json({ error: "RSVP id is required" }, { status: 400 });
    }
    if (!parent_name || typeof parent_name !== "string" || parent_name.trim().length === 0) {
      return NextResponse.json({ error: "Parent name is required" }, { status: 400 });
    }

    const hasEmail = typeof email === "string" && email.includes("@");
    const hasPhone = typeof phone === "string" && phone.trim().length > 0;
    if (!hasEmail && !hasPhone) {
      return NextResponse.json(
        { error: "Please include a phone number or email so we can reach you." },
        { status: 400 }
      );
    }

    const kids = attending ? Math.max(0, Number(kid_count) || 0) : 0;
    const adults = attending ? Math.max(0, Number(adult_count) || 0) : 0;

    const result = await query(
      `UPDATE birthday_rsvps
       SET parent_name = $1, child_names = $2, email = $3, phone = $4,
           attending = $5, kid_count = $6, adult_count = $7,
           allergies = $8, birthday_wish = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING id, parent_name, child_names, email, phone, attending, kid_count, adult_count, allergies, birthday_wish, created_at, updated_at`,
      [
        parent_name.trim(),
        typeof child_names === "string" ? child_names.trim() : "",
        hasEmail ? email.trim().toLowerCase() : null,
        normalizePhone(typeof phone === "string" ? phone : ""),
        Boolean(attending),
        kids,
        adults,
        typeof allergies === "string" ? allergies.trim() : "",
        typeof birthday_wish === "string" ? birthday_wish.trim() : "",
        Number(id),
      ]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Birthday RSVP update error:", error);
    await captureServerException(error, { route: "PUT /api/birthday-rsvp" });
    return NextResponse.json(
      { error: "Failed to update RSVP. Please try again." },
      { status: 500 }
    );
  }
}
