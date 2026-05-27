import { NextResponse } from "next/server";
import { publicOrigin } from "@/lib/mcp/auth";

/**
 * RFC 9728 — OAuth 2.0 Protected Resource Metadata for the RSVP MCP server.
 * Mirrors the calendar one but points at /api/rsvps/mcp. Shares the same
 * authorization server (origin), so the /oauth/* shim serves both.
 */
export async function GET(req: Request) {
  const origin = publicOrigin(req);
  return NextResponse.json(
    {
      resource: `${origin}/api/rsvps/mcp`,
      authorization_servers: [origin],
      bearer_methods_supported: ["header"],
      scopes_supported: ["rsvp"],
      resource_name: "Brooker Wedding RSVPs (MCP)",
      resource_documentation: `${origin}/rsvp/admin/mcp`,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, authorization",
    },
  });
}
