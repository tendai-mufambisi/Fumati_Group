import { getRequest } from "@tanstack/react-start/server";

export type Bindings = {
  DB: D1Database;
  MEDIA: R2Bucket;
  ADMIN_SECRET?: string;
};

type RuntimeRequest = Request & {
  runtime?: { cloudflare?: { env?: Partial<Bindings> } };
};

/**
 * Under Nitro's cloudflare preset there is no ambient `env` — srvx hangs the
 * Worker environment off the request, so bindings are only reachable inside a
 * request. In `vite dev` the same shape is populated by wrangler's
 * getPlatformProxy (miniflare) reading the root wrangler.jsonc, so local
 * development gets a real local D1 and R2 rather than a stub.
 */
export function resolveBindings(env?: unknown): Partial<Bindings> | undefined {
  const fromRequest = (getRequestSafely() as RuntimeRequest | undefined)?.runtime?.cloudflare?.env;
  if (fromRequest?.DB) return fromRequest;

  const fromGlobal = (globalThis as { __env__?: Partial<Bindings> }).__env__;
  if (fromGlobal?.DB) return fromGlobal;

  const fromArgument = env as Partial<Bindings> | undefined;
  if (fromArgument?.DB) return fromArgument;

  return fromRequest ?? fromGlobal ?? fromArgument;
}

function getRequestSafely(): Request | undefined {
  try {
    return getRequest();
  } catch {
    // Called outside a request context (module init, build-time analysis).
    return undefined;
  }
}

export function getBindings(): Bindings {
  const env = resolveBindings();
  if (!env?.DB || !env?.MEDIA) {
    throw new Error(
      "Cloudflare bindings unavailable. Expected DB (D1) and MEDIA (R2) on " +
        "request.runtime.cloudflare.env — check wrangler.jsonc and that this code " +
        "is running inside the Worker.",
    );
  }
  return env as Bindings;
}

export function getDb(): D1Database {
  return getBindings().DB;
}

export function getMedia(): R2Bucket {
  return getBindings().MEDIA;
}

export function getAdminSecret(): string {
  const secret = getBindings().ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not set. Run: npx wrangler secret put ADMIN_SECRET");
  }
  return secret;
}
