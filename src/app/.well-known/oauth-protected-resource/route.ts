import { NextResponse } from "next/server";
import { publicOrigin } from "@/lib/mcp/auth";

/**
 * RFC 9728 — OAuth 2.0 Protected Resource Metadata.
 * Points MCP clients at our authorization server so they know where to run
 * the OAuth dance.
 */
export async function GET(req: Request) {
  const origin = publicOrigin(req);
  return NextResponse.json(
    {
      resource: `${origin}/api/mcp`,
      authorization_servers: [origin],
      bearer_methods_supported: ["header"],
      scopes_supported: ["calendar"],
      resource_name: "Brooker Family Calendar (MCP)",
      resource_documentation: `${origin}/calendar/admin`,
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
