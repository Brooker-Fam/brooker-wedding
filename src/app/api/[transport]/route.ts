import { createMcpHandler, withMcpAuth } from "mcp-handler";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { z } from "zod";
import {
  verifyAccessToken,
  verifyBasicAuthHeader,
  publicOrigin,
} from "@/lib/mcp/auth";
import { runExec, EXEC_API_DOC } from "@/lib/mcp/exec";
import { captureServerException } from "@/lib/posthog-server";

/**
 * MCP server for the Brooker family calendar. One exec tool that runs a JS
 * snippet against a rich `calendar` API — the model composes multi-step ops
 * (filter, batch, chain) without per-call round-trips, and adding new
 * functionality just means exposing another method on the API surface.
 *
 * Transport: Streamable HTTP at /api/mcp, SSE at /api/sse (mcp-handler
 * routes on the [transport] path segment).
 *
 * Auth: Bearer token (from the OAuth shim at /oauth/*) OR raw HTTP Basic
 * (same creds as the rest of the admin surface). Basic is the escape hatch
 * for Claude Desktop / Claude Code, which support custom headers directly.
 */

const ExecShape = {
  code: z
    .string()
    .min(1)
    .describe(
      "JS snippet body. Receives `calendar` global. Top-level await OK. Last expression or explicit return becomes the result."
    ),
};

function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function errorResult(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  return {
    isError: true,
    content: [{ type: "text" as const, text: `Error: ${msg}` }],
  };
}

const baseHandler = createMcpHandler(
  (server) => {
    server.registerTool(
      "calendar_exec",
      {
        title: "Execute a calendar snippet",
        description: `Run a JS snippet against the Brooker family calendar. The snippet body executes inside an async function with a single \`calendar\` global. Top-level await works. Return any JSON-serializable value (or call \`calendar.log(...)\` for inline tracing).\n\n${EXEC_API_DOC}`,
        inputSchema: ExecShape,
      },
      async (input) => {
        const code = (input as { code: string }).code;
        try {
          const { result, logs } = await runExec(code);
          return jsonResult(logs ? { result, logs } : { result });
        } catch (err) {
          await captureServerException(err, { tool: "calendar_exec" });
          return errorResult(err);
        }
      }
    );
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: false,
  }
);

/**
 * Verify a Bearer token OR an HTTP Basic header. Returning undefined tells
 * withMcpAuth to respond with 401 + WWW-Authenticate pointing at the
 * protected-resource metadata endpoint, which is exactly what MCP clients
 * need to discover the OAuth flow.
 */
function verifyToken(
  req: Request,
  bearer?: string
): AuthInfo | undefined {
  if (bearer) {
    const payload = verifyAccessToken(bearer);
    if (!payload) return undefined;
    return {
      token: bearer,
      clientId: payload.client_id,
      scopes: payload.scope ? payload.scope.split(" ") : [],
      extra: { sub: payload.sub },
    };
  }

  // Fallback: raw HTTP Basic for clients that can pass custom headers
  // (Claude Desktop, Claude Code) and don't need the OAuth dance.
  const authHeader = req.headers.get("authorization");
  if (authHeader && verifyBasicAuthHeader(authHeader)) {
    return {
      token: "basic-auth",
      clientId: "admin-basic",
      scopes: ["calendar"],
      extra: { sub: "admin" },
    };
  }

  return undefined;
}

const authedHandler = withMcpAuth(baseHandler, verifyToken, {
  required: true,
  requiredScopes: [],
  resourceMetadataPath: "/.well-known/oauth-protected-resource",
});

async function handleRequest(req: Request): Promise<Response> {
  // Avoid masking real issues; let mcp-handler's own logging surface errors.
  void publicOrigin(req);
  return authedHandler(req);
}

export { handleRequest as GET, handleRequest as POST, handleRequest as DELETE };
