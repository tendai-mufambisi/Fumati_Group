import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestIP } from "@tanstack/react-start/server";

import { getDb } from "./bindings.server";
import { enquirySchema, type EnquiryInput } from "./enquiry";
import {
  FALLBACK_SITE_DATA,
  fallbackProject,
  type ProjectDetail,
  type SiteData,
} from "./site-data";
import { loadSiteData, readProject } from "./site-data.server";

/**
 * Everything owner-editable that the public pages show, read once by the root loader.
 * If D1 is unreachable (or not configured, as in `vite dev`) the site renders the
 * content it shipped with and never breaks.
 */
export const getSiteData = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteData> => {
    try {
      return await loadSiteData();
    } catch (error) {
      console.error("Site data unavailable, using the shipped content:", error);
      return FALLBACK_SITE_DATA;
    }
  },
);

/** One published project and its gallery. Drafts are never reachable by URL. */
export const getProject = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<ProjectDetail | null> => {
    try {
      return await readProject({ slug }, true);
    } catch (error) {
      console.error("Could not load the project, using the shipped content:", error);
      return fallbackProject(slug);
    }
  });

const MAX_ENQUIRIES_PER_HOUR = 6;

/** Saved so the owner sees every lead in the dashboard, even if WhatsApp is never opened. */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: EnquiryInput) => input)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success)
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
    const e = parsed.data;
    if (e.website) return { ok: true };

    const ip =
      getRequest().headers.get("cf-connecting-ip") ??
      getRequestIP({ xForwardedFor: true }) ??
      "unknown";
    try {
      const db = getDb();
      const recent = await db
        .prepare(
          `SELECT COUNT(*) AS n FROM enquiries WHERE ip = ? AND created_at > datetime('now', '-1 hour')`,
        )
        .bind(ip)
        .first<{ n: number }>();
      if ((recent?.n ?? 0) >= MAX_ENQUIRIES_PER_HOUR) {
        return {
          ok: false,
          error: "Too many requests from this connection. Please call or WhatsApp us instead.",
        };
      }
      await db
        .prepare(
          `INSERT INTO enquiries (name, phone, email, service, location, budget, message, ip)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(e.name, e.phone, e.email, e.service, e.location, e.budget, e.message, ip)
        .run();
      return { ok: true };
    } catch (error) {
      console.error("Could not save enquiry:", error);
      return {
        ok: false,
        error: "We couldn't save your request. Please send it on WhatsApp instead.",
      };
    }
  });
