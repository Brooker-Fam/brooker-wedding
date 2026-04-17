import { NextRequest, NextResponse } from "next/server";
import { syncAllEnabledCalendars } from "@/lib/calendar/google-sync";
import { isConnected } from "@/lib/google";
import { captureServerException } from "@/lib/posthog-server";

const HOUSEHOLD_ID = 1;

// Generous budget — first full sync across all calendars can take > 10s.
export const maxDuration = 60;

/**
 * Authorize the sync request. Accepts either:
 *   - A Vercel cron call: Authorization: Bearer $CRON_SECRET (set in env)
 *   - An admin user: Basic auth with ADMIN_USER / ADMIN_PASS
 */
function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") ?? "";

  // Vercel cron
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;

  // Admin basic auth
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (adminUser && adminPass && auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const [user, pass] = decoded.split(":");
      if (user === adminUser && pass === adminPass) return true;
    } catch {
      // fall through
    }
  }

  return false;
}

async function runSync() {
  if (!(await isConnected())) {
    return { ok: false as const, error: "not_connected" };
  }
  const results = await syncAllEnabledCalendars(HOUSEHOLD_ID);
  return { ok: true as const, results };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }
  try {
    const out = await runSync();
    const status = out.ok ? 200 : 400;
    return NextResponse.json(out, { status });
  } catch (err) {
    await captureServerException(err, {
      route: "GET /api/calendar/google/sync",
    });
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST mirrors GET for manual "Sync now" buttons that prefer POST semantics.
export const POST = GET;
