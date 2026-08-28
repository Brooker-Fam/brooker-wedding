import { google } from "googleapis";
import { query } from "@/lib/db";
import { getAppBaseUrl, encryptSecret, decryptSecret } from "@/lib/google";

/**
 * Identity for the birth plan tool at /birth.
 *
 * Sign in with Google, identity scopes only -- no calendar, no photos. The
 * session is an encrypted cookie holding just the verified email; the plan a
 * person can reach is looked up from membership, so there is no secret in any
 * URL to lose or leak.
 *
 * Reuses GOOGLE_CLIENT_ID/SECRET, already configured for calendar and photos.
 * Add {BASE_URL}/api/birth/auth/callback to the authorized redirect URIs.
 */

export const SESSION_COOKIE = "birth_session";
export const SESSION_PATH = "/api/birth";
const SESSION_DAYS = 365;

export function isConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function redirectUri(): string {
  return `${getAppBaseUrl()}/api/birth/auth/callback`;
}

function client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri()
  );
}

export function authorizeUrl(state: string): string {
  return client().generateAuthUrl({
    access_type: "online",          // we only ever need to identify them once
    prompt: "select_account",
    scope: ["openid", "email"],     // deliberately nothing else
    state,
  });
}

/** Exchanges the callback code for a verified email address. */
export async function emailFromCode(code: string): Promise<string | null> {
  const c = client();
  const { tokens } = await c.getToken(code);
  if (!tokens.id_token) return null;
  const ticket = await c.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email || payload.email_verified === false) return null;
  return payload.email.trim().toLowerCase();
}

// ── session cookie ────────────────────────────────────────────────────

export function sealSession(email: string): string {
  return encryptSecret(JSON.stringify({ email, iat: Date.now() }));
}

export function openSession(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const { email, iat } = JSON.parse(decryptSecret(raw));
    if (typeof email !== "string" || !email) return null;
    if (typeof iat === "number" && Date.now() - iat > SESSION_DAYS * 864e5) return null;
    return email;
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: SESSION_PATH,
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};

// ── membership ────────────────────────────────────────────────────────

export type Member = { email: string; role: string };
export type Plan = { id: number; role: string };

function allowlist(): string[] {
  return (process.env.BIRTH_ALLOWED_EMAILS || "")
    .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

/** The plan this email can reach, if any. */
export async function planFor(email: string): Promise<Plan | null> {
  const rows = await query(
    `SELECT plan_id, role FROM birth_plan_members WHERE email = $1 LIMIT 1`,
    [email]
  );
  if (!rows || !rows.length) return null;
  return { id: Number(rows[0].plan_id), role: String(rows[0].role) };
}

/**
 * Resolves the caller's plan, creating one the first time they sign in.
 *
 * Creation is deliberately narrow so a stray Google account can't mint rows:
 * an invited member always gets in, an allowlisted address may create, and
 * with no allowlist configured only the very first sign-in can claim a plan.
 */
export async function planForOrCreate(
  email: string
): Promise<{ plan: Plan | null; reason?: string }> {
  const existing = await planFor(email);
  if (existing) return { plan: existing };

  const allowed = allowlist();
  if (allowed.length) {
    if (!allowed.includes(email)) return { plan: null, reason: "not_invited" };
  } else {
    const any = await query(`SELECT 1 FROM birth_plan LIMIT 1`);
    if (any === null) return { plan: null, reason: "unavailable" };
    if (any.length) return { plan: null, reason: "not_invited" };
  }

  const created = await query(
    `INSERT INTO birth_plan DEFAULT VALUES RETURNING id`
  );
  if (!created) return { plan: null, reason: "unavailable" };
  const id = Number(created[0].id);
  await query(
    `INSERT INTO birth_plan_members (plan_id, email, role) VALUES ($1, $2, 'owner')
     ON CONFLICT (plan_id, email) DO NOTHING`,
    [id, email]
  );
  return { plan: { id, role: "owner" } };
}

export async function membersOf(planId: number): Promise<Member[]> {
  const rows = await query(
    `SELECT email, role FROM birth_plan_members WHERE plan_id = $1 ORDER BY added_at`,
    [planId]
  );
  if (!rows) return [];
  return rows.map((r) => ({ email: String(r.email), role: String(r.role) }));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const e = raw.trim().toLowerCase();
  return EMAIL_RE.test(e) && e.length <= 254 ? e : null;
}
