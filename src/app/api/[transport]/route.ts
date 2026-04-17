import { createMcpHandler, withMcpAuth } from "mcp-handler";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { z } from "zod";
import {
  verifyAccessToken,
  verifyBasicAuthHeader,
  publicOrigin,
} from "@/lib/mcp/auth";
import {
  runQuery,
  runWrite,
  runAction,
  describe,
  type QueryInput,
  type WriteInput,
  type ActionInput,
} from "@/lib/mcp/tools";
import { captureServerException } from "@/lib/posthog-server";

/**
 * MCP server for the Brooker family calendar. Four generic tools instead of
 * fifteen specific ones — the LLM can self-discover the full surface via
 * calendar_describe, which returns a schema of entities + kinds + ops.
 *
 * Transport: Streamable HTTP at /api/mcp, SSE at /api/sse (mcp-handler
 * routes on the [transport] path segment).
 *
 * Auth: Bearer token (from the OAuth shim at /oauth/*) OR raw HTTP Basic
 * (same creds as the rest of the admin surface). Basic is the escape hatch
 * for Claude Desktop / Claude Code, which support custom headers directly.
 */

const QueryShape = {
  kind: z.enum([
    "tasks",
    "task",
    "members",
    "member",
    "scoreboard",
    "completions",
    "recurring_series",
  ]),
  filters: z
    .object({
      id: z.number().int().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      assigned_to: z.number().int().optional(),
      status: z.string().optional(),
      name: z.string().optional(),
      limit: z.number().int().positive().max(500).optional(),
    })
    .optional(),
};

const WriteShape = {
  kind: z.enum(["task", "member"]),
  op: z.enum(["create", "update", "delete"]),
  data: z.record(z.unknown()),
};

const ActionShape = {
  action: z.enum([
    "complete_task",
    "uncomplete_task",
    "backfill_recurrence",
    "assign_task",
  ]),
  args: z.record(z.unknown()).optional(),
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
      "calendar_describe",
      {
        title: "Describe calendar API",
        description:
          "Returns the full schema of entities, tool kinds, ops, and filter fields. Call this first when discovering the API.",
        inputSchema: {},
      },
      async () => {
        try {
          return jsonResult(describe());
        } catch (err) {
          await captureServerException(err, { tool: "calendar_describe" });
          return errorResult(err);
        }
      }
    );

    server.registerTool(
      "calendar_query",
      {
        title: "Query calendar",
        description:
          "Read from the calendar. kind selects the entity (tasks, task, members, member, scoreboard, completions, recurring_series). filters narrow results (id, start_date, end_date, assigned_to, status, name, limit). Call calendar_describe for the full schema.",
        inputSchema: QueryShape,
      },
      async (input) => {
        try {
          const result = await runQuery(input as QueryInput);
          return jsonResult(result);
        } catch (err) {
          await captureServerException(err, {
            tool: "calendar_query",
            kind: (input as QueryInput).kind,
          });
          return errorResult(err);
        }
      }
    );

    server.registerTool(
      "calendar_write",
      {
        title: "Write to calendar",
        description:
          "Create, update, or delete a task or member. kind = task|member, op = create|update|delete, data = fields. For update/delete, include data.id. Tasks created here are tagged source='mcp'.",
        inputSchema: WriteShape,
      },
      async (input) => {
        try {
          const result = await runWrite(input as WriteInput);
          return jsonResult(result);
        } catch (err) {
          await captureServerException(err, {
            tool: "calendar_write",
            kind: (input as WriteInput).kind,
            op: (input as WriteInput).op,
          });
          return errorResult(err);
        }
      }
    );

    server.registerTool(
      "calendar_action",
      {
        title: "Perform calendar action",
        description:
          "Side-effect verbs: complete_task, uncomplete_task, assign_task, backfill_recurrence. args vary by action — see calendar_describe.",
        inputSchema: ActionShape,
      },
      async (input) => {
        try {
          const result = await runAction(input as ActionInput);
          return jsonResult(result);
        } catch (err) {
          await captureServerException(err, {
            tool: "calendar_action",
            action: (input as ActionInput).action,
          });
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
