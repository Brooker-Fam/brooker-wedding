import { createMcpHandler, withMcpAuth } from "mcp-handler";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { verifyAccessToken, verifyBasicAuthHeader } from "@/lib/mcp/auth";
import { memberFor } from "@/lib/maple/auth";
import { MAPLE_INSTRUCTIONS, registerMapleTools } from "@/lib/maple/mcp-tools";
import { captureServerException } from "@/lib/posthog-server";

/**
 * MCP server for Maple's Log, the family newborn tracker, so Matt and
 * Brittany can say "Maple just nursed 12 min left, 8 right" to Claude or
 * ChatGPT. Tools live in src/lib/maple/mcp-tools.ts.
 *
 * Transport: Streamable HTTP only, at /api/maple/mcp. SSE is off (it needs
 * Redis). Every POST gets a fresh stateless server, so tool registration must
 * stay free of DB calls. The static /api/maple/* routes (state, entries,
 * timer, auth…) win over this [transport] segment, so it only ever sees mcp.
 *
 * Auth (withMcpAuth → 401 + resource_metadata, which starts OAuth in clients):
 *   - Bearer from the /oauth shim: sub "maple:<email>" for a current family
 *     member (scope "maple" / resource …/api/maple/mcp), or sub "admin".
 *   - HTTP Basic with the admin login, for Claude Code / Inspector.
 */

export const maxDuration = 60;

const baseHandler = createMcpHandler(
  (server) => {
    registerMapleTools(server);
  },
  {
    serverInfo: { name: "maples-log", version: "1.0.0" },
    instructions: MAPLE_INSTRUCTIONS,
  },
  {
    basePath: "/api/maple",
    disableSse: true,
    maxDuration: 60,
    verboseLogs: false,
    onEvent: (event) => {
      if (event.type === "ERROR") {
        void captureServerException(event.error, {
          route: "/api/maple/mcp",
          context: event.context,
          source: event.source,
        });
      }
    },
  }
);

const VIAS = new Set(["claude", "chatgpt", "mcp"]);

/**
 * Who's calling. Returning undefined makes withMcpAuth answer 401, which is
 * what sends Claude/ChatGPT back through sign-in. Anything thrown here would
 * also become a 401, so a database blip during the membership check is
 * swallowed rather than disconnecting a parent mid-night.
 */
async function verifyToken(req: Request, bearer?: string): Promise<AuthInfo | undefined> {
  if (bearer) {
    const payload = verifyAccessToken(bearer);
    if (!payload) return undefined;
    const scopes = payload.scope ? payload.scope.split(" ") : [];
    const via = payload.via && VIAS.has(payload.via) ? payload.via : "mcp";
    const info = (sub: string): AuthInfo => ({
      token: bearer,
      clientId: payload.client_id,
      scopes,
      extra: { sub, via },
    });

    if (payload.sub === "admin") return info("admin");
    if (!payload.sub.startsWith("maple:")) return undefined;
    const forMaple = scopes.includes("maple") || (payload.resource?.endsWith("/api/maple/mcp") ?? false);
    if (!forMaple) return undefined;
    try {
      if (!(await memberFor(payload.sub.slice("maple:".length)))) return undefined;
    } catch (error) {
      console.error("Maple MCP membership check failed:", error);
    }
    return info(payload.sub);
  }

  if (verifyBasicAuthHeader(req.headers.get("authorization"))) {
    return {
      token: "basic-auth",
      clientId: "admin-basic",
      scopes: ["maple"],
      extra: { sub: "admin", via: "mcp" },
    };
  }
  return undefined;
}

const authedHandler = withMcpAuth(baseHandler, verifyToken, {
  required: true,
  resourceMetadataPath: "/.well-known/oauth-protected-resource/api/maple/mcp",
});

async function handleRequest(req: Request): Promise<Response> {
  const res = await authedHandler(req);
  // Tell clients which scope to ask for (mcp-handler's challenge omits it).
  if (res.status === 401) {
    const headers = new Headers(res.headers);
    const challenge = headers.get("www-authenticate");
    if (challenge && !/scope=/.test(challenge)) {
      headers.set("www-authenticate", `${challenge}, scope="maple"`);
    }
    return new Response(res.body, { status: 401, headers });
  }
  return res;
}

export { handleRequest as GET, handleRequest as POST, handleRequest as DELETE };
