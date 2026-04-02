import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "zoe";

function isAdminRoute(pathname: string): boolean {
  return pathname === "/rsvp/admin";
}

function isAdminApi(request: NextRequest): boolean {
  const { pathname, searchParams } = new URL(request.url);
  if (pathname !== "/api/rsvp") return false;
  // GET all (no id param), PUT, DELETE are admin operations
  if (request.method === "GET" && !searchParams.get("id")) return true;
  if (request.method === "PUT" || request.method === "DELETE") return true;
  return false;
}

function checkBasicAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;
  const decoded = atob(auth.slice(6));
  const [user, pass] = decoded.split(":");
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

export function middleware(request: NextRequest) {
  if (!isAdminRoute(request.nextUrl.pathname) && !isAdminApi(request)) {
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
  matcher: ["/rsvp/admin", "/api/rsvp"],
};
