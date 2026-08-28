import { NextRequest, NextResponse } from "next/server";
import {
  openSession, planFor, membersOf, normalizeEmail, SESSION_COOKIE,
} from "@/lib/birth-auth";
import { query } from "@/lib/db";
import { captureServerException } from "@/lib/posthog-server";

export const dynamic = "force-dynamic";

const MAX_MEMBERS = 10;

async function caller(request: NextRequest) {
  const email = openSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!email) return null;
  const plan = await planFor(email);
  return plan ? { email, plan } : null;
}

export async function GET(request: NextRequest) {
  const who = await caller(request);
  if (!who) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json({ members: await membersOf(who.plan.id) });
}

export async function POST(request: NextRequest) {
  try {
    const who = await caller(request);
    if (!who) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    if (who.plan.role !== "owner") {
      return NextResponse.json({ error: "Only the plan owner can invite" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(body.email);
    if (!email) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });

    const current = await membersOf(who.plan.id);
    if (current.some((m) => m.email === email)) {
      return NextResponse.json({ members: current });   // already in, no-op
    }
    if (current.length >= MAX_MEMBERS) {
      return NextResponse.json({ error: "Too many people on this plan" }, { status: 400 });
    }
    // One plan per person: an address already on another plan would be
    // ambiguous to resolve, so say so rather than silently doing nothing.
    const elsewhere = await planFor(email);
    if (elsewhere) {
      return NextResponse.json(
        { error: "That address already has a plan of its own" },
        { status: 409 }
      );
    }

    const done = await query(
      `INSERT INTO birth_plan_members (plan_id, email, role) VALUES ($1, $2, 'member')
       ON CONFLICT (plan_id, email) DO NOTHING`,
      [who.plan.id, email]
    );
    if (!done) return NextResponse.json({ error: "Sync unavailable" }, { status: 503 });
    return NextResponse.json({ members: await membersOf(who.plan.id) });
  } catch (error) {
    console.error("Birth members error:", error);
    await captureServerException(error, { route: "POST /api/birth/members" });
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const who = await caller(request);
    if (!who) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    if (who.plan.role !== "owner") {
      return NextResponse.json({ error: "Only the plan owner can remove people" }, { status: 403 });
    }
    const email = normalizeEmail(new URL(request.url).searchParams.get("email"));
    if (!email) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    if (email === who.email) {
      return NextResponse.json({ error: "You can't remove yourself" }, { status: 400 });
    }
    const done = await query(
      `DELETE FROM birth_plan_members WHERE plan_id = $1 AND email = $2 AND role <> 'owner'`,
      [who.plan.id, email]
    );
    if (!done) return NextResponse.json({ error: "Sync unavailable" }, { status: 503 });
    return NextResponse.json({ members: await membersOf(who.plan.id) });
  } catch (error) {
    await captureServerException(error, { route: "DELETE /api/birth/members" });
    return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  }
}
