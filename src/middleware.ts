import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

function isAdminRoute(pathname: string): boolean {
  return pathname === "/rsvp/admin" || pathname === "/songs/admin";
}

function isCalendarAdminApi(request: NextRequest): boolean {
  const { pathname } = new URL(request.url);
  if (pathname === "/api/calendar/tasks") {
    return request.method === "POST" || request.method === "PUT" || request.method === "DELETE";
  }
  if (pathname === "/api/calendar/complete") {
    return request.method === "POST" || request.method === "DELETE";
  }
  if (pathname === "/api/calendar/seed") return true;
  return false;
}

function isAdminApi(request: NextRequest): boolean {
  const { pathname, searchParams } = new URL(request.url);

  // RSVP admin operations
  if (pathname === "/api/rsvp") {
    if (request.method === "GET" && !searchParams.get("id")) return true;
    if (request.method === "PUT" || request.method === "DELETE") return true;
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
  matcher: ["/rsvp/admin", "/songs/admin", "/api/rsvp", "/api/songs", "/api/songs/reorder", "/api/spotify/authorize", "/api/calendar/tasks", "/api/calendar/complete", "/api/calendar/seed"],
};
