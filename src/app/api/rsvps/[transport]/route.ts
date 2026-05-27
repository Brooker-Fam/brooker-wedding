import { createMcpHandler, withMcpAuth } from "mcp-handler";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { z } from "zod";
import {
  verifyAccessToken,
  verifyBasicAuthHeader,
  publicOrigin,
} from "@/lib/mcp/auth";
import { runRsvpExec, RSVP_EXEC_API_DOC } from "@/lib/mcp/rsvp-exec";
import { captureServerException } from "@/lib/posthog-server";

/**
 * MCP server for the Brooker wedding RSVPs. Separate server from the calendar
 * (/api/mcp) so it shows up as its own connector, but it reuses the same OAuth
 * shim and admin Basic-auth — tokens are not audience-bound.
 *
 * Transport: Streamable HTTP at /api/rsvps/mcp, SSE at /api/rsvps/sse.
 *
 * One exec tool runs a JS snippet against a rich `rsvp` API so the model can
 * filter, batch, and chain (e.g. build a mailing list from attendees) in a
 * single call instead of per-row round-trips.
 */

const ExecShape = {
  code: z
    .string()
    .min(1)
    .describe(
      "JS snippet body. Receives `rsvp` global. Top-level await OK. Last expression or explicit return becomes the result."
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
      "rsvp_exec",
      {
        title: "Execute an RSVP snippet",
        description: `Run a JS snippet against the Brooker wedding RSVPs. The snippet body executes inside an async function with a single \`rsvp\` global. Top-level await works. Return any JSON-serializable value (or call \`rsvp.log(...)\` for inline tracing).\n\n${RSVP_EXEC_API_DOC}`,
        inputSchema: ExecShape,
      },
      async (input) => {
        const code = (input as { code: string }).code;
        try {
          const { result, logs } = await runRsvpExec(code);
          return jsonResult(logs ? { result, logs } : { result });
        } catch (err) {
          await captureServerException(err, { tool: "rsvp_exec" });
          return errorResult(err);
        }
      }
    );
  },
  {},
  {
    basePath: "/api/rsvps",
    maxDuration: 60,
    verboseLogs: false,
  }
);

/**
 * Verify a Bearer token OR an HTTP Basic header. Returning undefined tells
 * withMcpAuth to respond with 401 + WWW-Authenticate pointing at the
 * protected-resource metadata endpoint so MCP clients can discover OAuth.
 */
function verifyToken(req: Request, bearer?: string): AuthInfo | undefined {
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

  const authHeader = req.headers.get("authorization");
  if (authHeader && verifyBasicAuthHeader(authHeader)) {
    return {
      token: "basic-auth",
      clientId: "admin-basic",
      scopes: ["rsvp"],
      extra: { sub: "admin" },
    };
  }

  return undefined;
}

const authedHandler = withMcpAuth(baseHandler, verifyToken, {
  required: true,
  requiredScopes: [],
  resourceMetadataPath: "/.well-known/oauth-protected-resource/rsvps",
});

async function handleRequest(req: Request): Promise<Response> {
  void publicOrigin(req);
  return authedHandler(req);
}

export { handleRequest as GET, handleRequest as POST, handleRequest as DELETE };
