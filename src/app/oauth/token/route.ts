import { NextRequest, NextResponse } from "next/server";
import {
  mintAccessToken,
  mintRefreshToken,
  verifyAuthCode,
  verifyPkce,
  verifyRefreshToken,
  trustedRedirect,
  ACCESS_TOKEN_TTL,
  type AccessTokenPayload,
} from "@/lib/mcp/auth";

/**
 * OAuth 2.1 token endpoint: authorization_code + PKCE, and refresh_token.
 *
 * No client secret (public client). The code itself is HMAC-signed and
 * carries the expected redirect_uri + code_challenge, so we verify both
 * at redemption time against what the client re-sends.
 *
 * Refresh tokens are stateless too (see mintRefreshToken): each refresh hands
 * out a new one, so connectors don't lapse monthly. They only go to codes
 * sent to Claude, ChatGPT or a local app (trustedRedirect). They die when
 * ADMIN_PASS changes or after 90 idle days.
 */

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-store",
  Pragma: "no-cache",
};

function err(code: string, description: string, status = 400) {
  return NextResponse.json(
    { error: code, error_description: description },
    { status, headers: HEADERS }
  );
}

/**
 * /oauth/authorize only mints unbound admin grants. Anything else (a family
 * member's sub, or a grant bound to a resource) was issued for Maple's Log,
 * whose own server at maple.brooker.family authorizes and checks membership.
 */
function isAdminGrant(grant: { sub: string; resource?: string }): boolean {
  return grant.sub === "admin" && !grant.resource;
}

/** Access token for a grant, plus a new refresh token when allowed. */
function issue(grant: AccessTokenPayload, opts: { refresh: boolean }) {
  const payload: AccessTokenPayload = {
    sub: grant.sub,
    scope: grant.scope,
    client_id: grant.client_id,
  };
  return NextResponse.json(
    {
      access_token: mintAccessToken(payload),
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL,
      ...(opts.refresh ? { refresh_token: mintRefreshToken(payload) } : {}),
      scope: payload.scope,
    },
    { headers: HEADERS }
  );
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  let params: URLSearchParams;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    params = new URLSearchParams(await request.text());
  } else if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, string>;
    params = new URLSearchParams(body);
  } else {
    // Best-effort: try form first, then query string.
    try {
      params = new URLSearchParams(await request.text());
    } catch {
      params = new URL(request.url).searchParams;
    }
  }

  const grantType = params.get("grant_type");
  if (grantType === "refresh_token") return refresh(params);
  if (grantType !== "authorization_code") {
    return err("unsupported_grant_type", `grant_type=${grantType} not supported`);
  }

  const code = params.get("code");
  const redirectUri = params.get("redirect_uri");
  const clientId = params.get("client_id");
  const codeVerifier = params.get("code_verifier");

  if (!code || !redirectUri || !clientId || !codeVerifier) {
    return err(
      "invalid_request",
      "code, redirect_uri, client_id, code_verifier required"
    );
  }

  const payload = verifyAuthCode(code);
  if (!payload) return err("invalid_grant", "code is invalid or expired");
  if (payload.client_id !== clientId) {
    return err("invalid_grant", "client_id mismatch");
  }
  if (payload.redirect_uri !== redirectUri) {
    return err("invalid_grant", "redirect_uri mismatch");
  }
  if (
    !verifyPkce(codeVerifier, payload.code_challenge, payload.code_challenge_method)
  ) {
    return err("invalid_grant", "PKCE verification failed");
  }
  if (!isAdminGrant(payload)) return err("invalid_grant", "code is invalid or expired");

  return issue(
    {
      sub: payload.sub,
      scope: payload.scope,
      client_id: payload.client_id,
    },
    // A login phished to some other site gets 30 days at most, never a renewal.
    { refresh: trustedRedirect(payload.redirect_uri) }
  );
}

function refresh(params: URLSearchParams) {
  const token = params.get("refresh_token");
  if (!token) return err("invalid_request", "refresh_token required");

  const grant = verifyRefreshToken(token);
  if (!grant) return err("invalid_grant", "refresh_token is invalid or expired");

  const clientId = params.get("client_id");
  if (clientId && clientId !== grant.client_id) {
    return err("invalid_grant", "client_id mismatch");
  }
  if (!isAdminGrant(grant)) return err("invalid_grant", "refresh_token is invalid or expired");

  return issue(grant, { refresh: true });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, authorization",
    },
  });
}
