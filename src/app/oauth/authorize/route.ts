import { NextRequest, NextResponse } from "next/server";
import { mintAuthCode, verifyAdminCreds } from "@/lib/mcp/auth";

/**
 * OAuth 2.1 Authorization endpoint with PKCE.
 *
 * GET  — renders an HTML login form. Hidden inputs preserve all OAuth
 *        params (client_id, redirect_uri, code_challenge, etc.).
 * POST — validates admin creds, mints a short-lived authorization code
 *        (HMAC-signed; binds redirect_uri + code_challenge), and redirects
 *        back to the client with ?code=...&state=....
 *
 * There is no persistent user/client store — the admin Basic-Auth creds are
 * the single source of identity, wrapped in a standard OAuth shape so
 * ChatGPT and other strict clients can talk to us.
 */

const MAPLE_MCP_PATH = "/api/maple/mcp";
const MAPLE_MCP_URL = "https://maplebaby.app/api/maple/mcp";

function paramReader(url: URL, form?: FormData) {
  return (k: string) =>
    form?.get(k)?.toString() ?? url.searchParams.get(k) ?? "";
}

function readParams(url: URL, form?: FormData) {
  const get = paramReader(url, form);
  return {
    client_id: get("client_id"),
    redirect_uri: get("redirect_uri"),
    response_type: get("response_type") || "code",
    scope: get("scope") || "calendar",
    state: get("state"),
    code_challenge: get("code_challenge"),
    code_challenge_method: (get("code_challenge_method") || "S256") as
      | "S256"
      | "plain",
  };
}

function isAllowedRedirect(uri: string): boolean {
  if (!uri) return false;
  try {
    const u = new URL(uri);
    if (u.protocol === "http:" && u.hostname !== "localhost" && u.hostname !== "127.0.0.1") {
      return false;
    }
    return ["https:", "http:"].includes(u.protocol);
  } catch {
    return false;
  }
}

function isMapleRequest(url: URL, form?: FormData): boolean {
  const get = paramReader(url, form);
  const resource = get("resource");
  if (URL.canParse(resource) && new URL(resource).pathname.replace(/\/+$/, "") === MAPLE_MCP_PATH) {
    return true;
  }
  return get("scope").split(/\s+/).includes("maple");
}

function htmlPage(title: string, card: string, status: number) {
  return new NextResponse(
    `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:system-ui,sans-serif;background:#FDF8F0;color:#1D4420;margin:0;
    min-height:100vh;display:grid;place-items:center;padding:24px;}
  .card{background:white;border:1px solid #5C7A4A33;border-radius:12px;
    padding:32px;max-width:380px;width:100%;box-shadow:0 4px 24px #1D442014;}
  h1{margin:0 0 4px;font-size:20px;}
  p.sub{margin:0 0 20px;color:#5C7A4A;font-size:14px;}
  label{display:block;font-size:13px;margin:12px 0 4px;font-weight:600;}
  input[type=text],input[type=password]{width:100%;padding:10px 12px;
    border:1px solid #5C7A4A55;border-radius:8px;font-size:15px;box-sizing:border-box;}
  button{margin-top:20px;width:100%;padding:11px;background:#1D4420;color:#FDF8F0;
    border:0;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;}
  button:hover{background:#2a5c2e;}
  code{display:block;word-break:break-all;font-size:14px;}
</style>
</head><body>
${card}
</body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

function renderForm(params: ReturnType<typeof readParams>, status: number, error?: string) {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const hidden = Object.entries(params)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`)
    .join("\n");
  const errorHtml = error
    ? `<p style="color:#b00;margin-top:12px;">${esc(error)}</p>`
    : "";
  return htmlPage(
    "Brooker MCP Login",
    `<form class="card" method="post">
  <h1>Brooker MCP</h1>
  <p class="sub">Sign in to connect your AI assistant to the family calendar.</p>
  <label>Username</label>
  <input type="text" name="username" autocomplete="username" autofocus required>
  <label>Password</label>
  <input type="password" name="password" autocomplete="current-password" required>
  ${hidden}
  <button type="submit">Authorize</button>
  ${errorHtml}
</form>`,
    status
  );
}

function mapleMovedPage() {
  return htmlPage(
    "Maple's Log moved",
    `<div class="card">
  <h1>Maple's Log moved</h1>
  <p class="sub">Remove this connector from Claude or ChatGPT, then add it again with this URL:</p>
  <code>${MAPLE_MCP_URL}</code>
</div>`,
    400
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  if (isMapleRequest(url)) return mapleMovedPage();
  const params = readParams(url);

  if (!params.client_id || !params.redirect_uri) {
    return new NextResponse("Missing client_id or redirect_uri", { status: 400 });
  }
  if (!isAllowedRedirect(params.redirect_uri)) {
    return new NextResponse("Invalid redirect_uri", { status: 400 });
  }
  if (params.response_type !== "code") {
    return new NextResponse("Only response_type=code supported", { status: 400 });
  }

  return renderForm(params, 200);
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const form = await request.formData();
  if (isMapleRequest(url, form)) return mapleMovedPage();
  const params = readParams(url, form);
  const username = form.get("username")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";

  if (!params.client_id || !params.redirect_uri || !isAllowedRedirect(params.redirect_uri)) {
    return new NextResponse("Invalid request", { status: 400 });
  }
  if (!verifyAdminCreds(username, password)) {
    return renderForm(params, 401, "Invalid credentials.");
  }

  const code = mintAuthCode({
    client_id: params.client_id,
    redirect_uri: params.redirect_uri,
    code_challenge: params.code_challenge,
    code_challenge_method: params.code_challenge_method,
    scope: params.scope,
    sub: "admin",
  });

  const redirect = new URL(params.redirect_uri);
  redirect.searchParams.set("code", code);
  if (params.state) redirect.searchParams.set("state", params.state);
  return NextResponse.redirect(redirect.toString(), 302);
}
