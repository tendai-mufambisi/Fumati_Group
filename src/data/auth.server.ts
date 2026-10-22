import { getCookie, getRequest, getRequestIP, setCookie } from "@tanstack/react-start/server";

import { getAdminSecret, getDb } from "./bindings.server";

const COOKIE_NAME = "fumati_admin";
const SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours
const REMEMBER_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const PASSWORD_ROW_KEY = "admin_password_hash";

const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_SALT_BYTES = 16;
const PBKDF2_HASH_BITS = 256;
const MIN_PASSWORD_LENGTH = 8;

// Sign-in rate limit: this many failures per IP within the window locks that IP out
// until the window ends.
const MAX_FAILURES = 8;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;

const encoder = new TextEncoder();

/* ---------- primitives ---------- */

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** Length-independent comparison — never short-circuits on the first mismatch. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<ArrayBuffer> {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    material,
    PBKDF2_HASH_BITS,
  );
}

/** Self-describing so the iteration count can be raised without a data migration. */
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(PBKDF2_SALT_BYTES));
  const bits = await derive(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt.buffer as ArrayBuffer)}$${toHex(bits)}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterationsRaw, saltHex, hashHex] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterationsRaw || !saltHex || !hashHex) return false;

  const iterations = Number(iterationsRaw);
  if (!Number.isInteger(iterations) || iterations <= 0) return false;

  const bits = await derive(password, fromHex(saltHex), iterations);
  return timingSafeEqual(toHex(bits), hashHex);
}

/* ---------- session token ---------- */

/** `<expiryMs>.<HMAC(expiryMs)>` — stateless, so there is no session table. */
async function createToken(secret: string, ttlMs: number): Promise<string> {
  const expiry = String(Date.now() + ttlMs);
  return `${expiry}.${await hmac(expiry, secret)}`;
}

async function isValidToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;

  const expected = await hmac(expiry, secret);
  if (!timingSafeEqual(signature, expected)) return false;

  const expiresAt = Number(expiry);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

/* ---------- stored password ---------- */

async function readStoredHash(): Promise<string | undefined> {
  const row = await getDb()
    .prepare(`SELECT value FROM settings WHERE key = ?`)
    .bind(PASSWORD_ROW_KEY)
    .first<{ value: string }>();
  return row?.value || undefined;
}

async function writeStoredHash(hash: string): Promise<void> {
  await getDb()
    .prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .bind(PASSWORD_ROW_KEY, hash)
    .run();
}

/* ---------- rate limiting ---------- */

function clientIp(): string {
  const request = getRequest();
  return (
    request.headers.get("cf-connecting-ip") ?? getRequestIP({ xForwardedFor: true }) ?? "unknown"
  );
}

async function isLockedOut(ip: string): Promise<boolean> {
  const row = await getDb()
    .prepare(`SELECT failures, window_start FROM login_attempts WHERE ip = ?`)
    .bind(ip)
    .first<{ failures: number; window_start: number }>();
  if (!row) return false;
  return row.failures >= MAX_FAILURES && Date.now() - row.window_start < FAILURE_WINDOW_MS;
}

async function recordFailure(ip: string): Promise<void> {
  const now = Date.now();
  // A failure after the window has passed starts a fresh window.
  await getDb()
    .prepare(
      `INSERT INTO login_attempts (ip, failures, window_start) VALUES (?, 1, ?)
       ON CONFLICT(ip) DO UPDATE SET
         failures = CASE WHEN ? - window_start >= ? THEN 1 ELSE failures + 1 END,
         window_start = CASE WHEN ? - window_start >= ? THEN ? ELSE window_start END`,
    )
    .bind(ip, now, now, FAILURE_WINDOW_MS, now, FAILURE_WINDOW_MS, now)
    .run();
}

async function clearFailures(ip: string): Promise<void> {
  await getDb().prepare(`DELETE FROM login_attempts WHERE ip = ?`).bind(ip).run();
}

/* ---------- public API ---------- */

export async function signIn(
  password: string,
  options: { remember?: boolean } = {},
): Promise<{ ok: boolean; error?: string }> {
  let secret: string;
  try {
    secret = getAdminSecret();
  } catch {
    return { ok: false, error: "Admin access is not configured on the server." };
  }

  const ip = clientIp();
  if (await isLockedOut(ip)) {
    return {
      ok: false,
      error: "Too many wrong passwords. Please wait 15 minutes and try again.",
    };
  }

  const stored = await readStoredHash();
  let ok = false;

  if (stored) {
    ok = await verifyPassword(password, stored);
  } else if (timingSafeEqual(password, secret)) {
    // No hash seeded yet — accept the Cloudflare secret once, then upgrade
    // storage so the secret stops being a usable login.
    ok = true;
    try {
      await writeStoredHash(await hashPassword(password));
    } catch {
      // Non-fatal: the sign-in still stands, the upgrade retries next time.
    }
  }

  if (!ok) {
    await recordFailure(ip);
    return { ok: false, error: "That password is not correct." };
  }
  await clearFailures(ip);

  const ttl = options.remember ? REMEMBER_MS : SESSION_MS;
  setCookie(COOKIE_NAME, await createToken(secret, ttl), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ttl / 1000,
  });

  return { ok: true };
}

export function signOut(): void {
  setCookie(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isAuthenticated(): Promise<boolean> {
  let secret: string;
  try {
    secret = getAdminSecret();
  } catch {
    return false;
  }
  return isValidToken(getCookie(COOKIE_NAME), secret);
}

/** Reject state-changing requests that did not come from this site's own pages. */
function assertSameOrigin(): void {
  const request = getRequest();
  if (request.method === "GET" || request.method === "HEAD") return;
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    throw new Error("FORBIDDEN");
  }
}

/**
 * Server-side gate for every admin read and every mutating server function. The route
 * loaders redirect signed-out visitors for convenience; this is what protects the data.
 */
export async function requireAdmin(): Promise<void> {
  assertSameOrigin();
  if (!(await isAuthenticated())) {
    throw new Error("UNAUTHORIZED");
  }
}

export async function changePassword(input: {
  current: string;
  next: string;
}): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  const next = input.next.trim();
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (next === input.current) {
    return { ok: false, error: "The new password must be different." };
  }

  const stored = await readStoredHash();
  const currentOk = stored
    ? await verifyPassword(input.current, stored)
    : timingSafeEqual(input.current, getAdminSecret());

  if (!currentOk) {
    return { ok: false, error: "Your current password is not correct." };
  }

  await writeStoredHash(await hashPassword(next));
  return { ok: true };
}
