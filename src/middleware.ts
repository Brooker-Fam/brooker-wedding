import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

function isAdminRoute(pathname: string): boolean {
  return (
    pathname === "/rsvp/admin" ||
    pathname === "/rsvp/admin/labels" ||
    pathname === "/songs/admin" ||
    pathname === "/calendar/admin"
  );
}

function isCalendarAdminApi(request: NextRequest): boolean {
  const { pathname } = new URL(request.url);
  if (pathname === "/api/calendar/tasks") {
    return request.method === "POST" || request.method === "PUT" || request.method === "DELETE";
  }
  if (pathname === "/api/calendar/seed") return true;
  if (pathname === "/api/calendar/recurrence/backfill") {
    return request.method === "POST";
  }
  // Google Calendar admin endpoints (callback is intentionally unprotected)
  if (pathname === "/api/calendar/google/authorize") return true;
  if (pathname === "/api/calendar/google/disconnect") return true;
  if (pathname === "/api/calendar/google/calendars") {
    return request.method === "PATCH" || request.method === "GET";
  }
  // /api/calendar/google/sync does its own auth (CRON_SECRET OR admin basic)
  // in the route handler — do not gate it here.
  // Per-event overrides (admin only)
  if (pathname.startsWith("/api/calendar/events/") && pathname !== "/api/calendar/events/complete") {
    return request.method === "PATCH" || request.method === "DELETE";
  }
  return false;
}

function isAdminApi(request: NextRequest): boolean {
  const { pathname, searchParams } = new URL(request.url);

  // RSVP admin operations
  if (pathname === "/api/rsvp") {
    if (request.method === "GET" && !searchParams.get("id")) return true;
    if (request.method === "PUT" || request.method === "DELETE") return true;
  }

  // Mailing lists are admin-only end-to-end
  if (pathname === "/api/mailing-lists" || pathname.startsWith("/api/mailing-lists/")) {
    return true;
  }

  // Songs admin operations (DELETE = remove)
  if (pathname === "/api/songs") {
    if (request.method === "DELETE") return true;
  }

  // Songs reorder is admin-only
  if (pathname === "/api/songs/reorder") return true;

  // Spotify authorize is admin-only (callback is unprotected so Spotify can redirect back)
  if (pathname === "/api/spotify/authorize") return true;

  return false;
}

function checkBasicAuth(request: NextRequest): boolean {
  if (!ADMIN_USER || !ADMIN_PASS) return false;
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;
  const decoded = atob(auth.slice(6));
  const [user, pass] = decoded.split(":");
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

export function middleware(request: NextRequest) {
  if (!isAdminRoute(request.nextUrl.pathname) && !isAdminApi(request) && !isCalendarAdminApi(request)) {
    return NextResponse.next();
  }

  if (checkBasicAuth(request)) {
    return NextResponse.next();
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

export const config = {
  matcher: [
    "/rsvp/admin",
    "/rsvp/admin/labels",
    "/songs/admin",
    "/calendar/admin",
    "/api/rsvp",
    "/api/mailing-lists",
    "/api/mailing-lists/:path*",
    "/api/songs",
    "/api/songs/reorder",
    "/api/spotify/authorize",
    "/api/calendar/tasks",
    "/api/calendar/seed",
    "/api/calendar/recurrence/backfill",
    "/api/calendar/google/authorize",
    "/api/calendar/google/disconnect",
    "/api/calendar/google/calendars",
    "/api/calendar/events/:path*",
  ],
};
