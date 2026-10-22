import { createServerFn } from "@tanstack/react-start";

import { requireAdmin } from "./auth.server";
import { getDb, getMedia } from "./bindings.server";
import {
  collections,
  isCollectionKey,
  PROJECT_STATUSES,
  SECTIONS,
  type CollectionItem,
  type CollectionKey,
} from "./collections";
import {
  embedUrl,
  settingsFrom,
  slugify,
  type ProjectDetail,
  type ProjectSummary,
  type Settings,
} from "./site-data";
import {
  deleteMediaObjects,
  readCollection,
  readProject,
  readProjects,
  readSettings,
  writeSettings,
} from "./site-data.server";

/* ---------- uploads ---------- */

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 90 * 1024 * 1024; // Workers accept request bodies up to 100 MB.
const MAX_PDF_BYTES = 25 * 1024 * 1024;

const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/svg+xml", "svg"],
]);
const VIDEO_TYPES = new Map([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
  ["video/quicktime", "mov"],
]);

function readFile(formData: FormData, types: Map<string, string>, max: number, what: string) {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error(`Please choose a ${what}.`);
  const extension = types.get(file.type);
  if (!extension) throw new Error(`That file type is not supported for a ${what}.`);
  if (file.size === 0) throw new Error("That file appears to be empty.");
  if (file.size > max)
    throw new Error(`That ${what} is larger than ${Math.round(max / 1024 / 1024)} MB.`);
  return { file, extension };
}

async function putFile(
  folder: string,
  f: { file: File; extension: string },
  disposition?: string,
): Promise<string> {
  const key = `${folder}/${crypto.randomUUID()}.${f.extension}`;
  await getMedia().put(key, await f.file.arrayBuffer(), {
    httpMetadata: {
      contentType: f.file.type,
      ...(disposition ? { contentDisposition: disposition } : {}),
    },
  });
  // The key embeds a UUID, so the URL is immutable and safe to cache forever.
  return `/media/${key}`;
}

/* ---------- shared helpers ---------- */

const positiveId = (value: unknown) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error("A valid item is required.");
  return id;
};

const text = (value: unknown, max: number) =>
  String(value ?? "")
    .trim()
    .slice(0, max);

const tableOf = (key: unknown) => {
  if (!isCollectionKey(key)) throw new Error("Unknown section.");
  return collections[key].table;
};

/** Swap with the neighbour. Positions are renumbered so duplicates never block a move. */
async function move(
  table: string,
  id: number,
  direction: "up" | "down",
  scope?: { column: string; value: number },
) {
  const db = getDb();
  const where = scope ? `WHERE ${scope.column} = ?` : "";
  const stmt = db.prepare(`SELECT id FROM ${table} ${where} ORDER BY position, id`);
  const { results } = await (scope ? stmt.bind(scope.value) : stmt).all<{ id: number }>();
  const index = results.findIndex((row) => row.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= results.length) return;
  const order = [...results];
  [order[index], order[target]] = [order[target]!, order[index]!];
  await db.batch(
    order.map((row, i) =>
      db.prepare(`UPDATE ${table} SET position = ? WHERE id = ?`).bind(i + 1, row.id),
    ),
  );
}

async function topPosition(table: string): Promise<number> {
  const top = await getDb()
    .prepare(`SELECT COALESCE(MIN(position), 1) - 1 AS pos FROM ${table}`)
    .first<{ pos: number }>();
  return top?.pos ?? 0;
}

/* ---------- collections ---------- */

export const adminListCollection = createServerFn({ method: "GET" })
  .inputValidator((key: string) => key)
  .handler(async ({ data: key }): Promise<CollectionItem[]> => {
    await requireAdmin();
    if (!isCollectionKey(key)) throw new Error("Unknown section.");
    return readCollection(key, false);
  });

/** Validates every text field against the registry; image fields are set by upload only. */
function cleanValues(key: CollectionKey, values: Record<string, string>) {
  const out: [string, string][] = [];
  for (const f of collections[key].fields) {
    if (f.type === "image") continue;
    let v = text(values[f.key], "max" in f && f.max ? f.max : 400);
    if ("required" in f && f.required && !v) throw new Error(`Please fill in "${f.label}".`);
    if ((f.type === "select" || f.type === "icon") && v && !f.options.some((o) => o.value === v)) {
      throw new Error(`Please choose a valid "${f.label}".`);
    }
    if (f.type === "url" && v && !/^https?:\/\//.test(v)) v = `https://${v}`;
    out.push([f.key, v]);
  }
  return out;
}

export const adminSaveCollectionItem = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { collection: string; id: number | null; values: Record<string, string> }) => input,
  )
  .handler(async ({ data }): Promise<{ id: number }> => {
    await requireAdmin();
    if (!isCollectionKey(data.collection)) throw new Error("Unknown section.");
    const table = tableOf(data.collection);
    const values = cleanValues(data.collection, data.values);
    const db = getDb();
    if (data.id === null) {
      const result = await db
        .prepare(
          `INSERT INTO ${table} (${values.map(([k]) => k).join(", ")}, position)
           VALUES (${values.map(() => "?").join(", ")}, ?)`,
        )
        .bind(...values.map(([, v]) => v), await topPosition(table))
        .run();
      return { id: Number(result.meta.last_row_id) };
    }
    const id = positiveId(data.id);
    await db
      .prepare(`UPDATE ${table} SET ${values.map(([k]) => `${k} = ?`).join(", ")} WHERE id = ?`)
      .bind(...values.map(([, v]) => v), id)
      .run();
    return { id };
  });

function imageFieldsOf(key: CollectionKey): string[] {
  return collections[key].fields.filter((f) => f.type === "image").map((f) => f.key);
}

export const adminUploadCollectionImage = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data }): Promise<{ url: string }> => {
    await requireAdmin();
    const key = String(data.get("collection"));
    if (!isCollectionKey(key)) throw new Error("Unknown section.");
    const field = String(data.get("field"));
    if (!imageFieldsOf(key).includes(field)) throw new Error("That field does not take a picture.");
    const id = positiveId(data.get("id"));
    const table = tableOf(key);
    const db = getDb();
    const row = await db
      .prepare(`SELECT ${field} AS old FROM ${table} WHERE id = ?`)
      .bind(id)
      .first<{ old: string }>();
    if (!row) throw new Error("That item no longer exists. Please reload.");
    const url = await putFile(
      `${key}/${id}`,
      readFile(data, IMAGE_TYPES, MAX_IMAGE_BYTES, "picture"),
    );
    await db.prepare(`UPDATE ${table} SET ${field} = ? WHERE id = ?`).bind(url, id).run();
    await deleteMediaObjects([row.old]);
    return { url };
  });

export const adminClearCollectionImage = createServerFn({ method: "POST" })
  .inputValidator((input: { collection: string; id: number; field: string }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    if (!isCollectionKey(data.collection)) throw new Error("Unknown section.");
    if (!imageFieldsOf(data.collection).includes(data.field))
      throw new Error("That field does not take a picture.");
    const table = tableOf(data.collection);
    const id = positiveId(data.id);
    const db = getDb();
    const row = await db
      .prepare(`SELECT ${data.field} AS old FROM ${table} WHERE id = ?`)
      .bind(id)
      .first<{ old: string }>();
    await db.prepare(`UPDATE ${table} SET ${data.field} = '' WHERE id = ?`).bind(id).run();
    await deleteMediaObjects([row?.old]);
  });

export const adminSetCollectionHidden = createServerFn({ method: "POST" })
  .inputValidator((input: { collection: string; id: number; hidden: boolean }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await getDb()
      .prepare(`UPDATE ${tableOf(data.collection)} SET hidden = ? WHERE id = ?`)
      .bind(data.hidden ? 1 : 0, positiveId(data.id))
      .run();
  });

export const adminMoveCollectionItem = createServerFn({ method: "POST" })
  .inputValidator((input: { collection: string; id: number; direction: "up" | "down" }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await move(tableOf(data.collection), positiveId(data.id), data.direction);
  });

export const adminDeleteCollectionItem = createServerFn({ method: "POST" })
  .inputValidator((input: { collection: string; id: number }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    if (!isCollectionKey(data.collection)) throw new Error("Unknown section.");
    const table = tableOf(data.collection);
    const id = positiveId(data.id);
    const fields = imageFieldsOf(data.collection);
    const db = getDb();
    const row = fields.length
      ? await db
          .prepare(`SELECT ${fields.join(", ")} FROM ${table} WHERE id = ?`)
          .bind(id)
          .first<Record<string, string>>()
      : null;
    await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
    if (row) await deleteMediaObjects(Object.values(row));
  });

/* ---------- projects ---------- */

export const adminListProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProjectSummary[]> => {
    await requireAdmin();
    return readProjects(false);
  },
);

export const adminGetProject = createServerFn({ method: "GET" })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }): Promise<ProjectDetail | null> => {
    await requireAdmin();
    return readProject({ id: positiveId(id) }, false);
  });

/** Appends -2, -3 … until the slug is free, ignoring the row being edited. */
async function uniqueSlug(base: string, ignoreId?: number): Promise<string> {
  const db = getDb();
  const root = base || "project";
  let candidate = root;
  for (let n = 2; ; n += 1) {
    const clash = await db
      .prepare(`SELECT id FROM projects WHERE slug = ? AND id IS NOT ?`)
      .bind(candidate, ignoreId ?? null)
      .first<{ id: number }>();
    if (!clash) return candidate;
    candidate = `${root}-${n}`;
  }
}

export type ProjectInput = {
  id: number | null;
  title: string;
  slug: string;
  category: string;
  location: string;
  year: string;
  client: string;
  status: string;
  summary: string;
  body: string;
  scope: string;
  challenge: string;
  solution: string;
  result: string;
  featured: boolean;
  published: boolean;
};

export const adminSaveProject = createServerFn({ method: "POST" })
  .inputValidator((input: ProjectInput) => input)
  .handler(async ({ data }): Promise<{ id: number; slug: string }> => {
    await requireAdmin();
    const title = text(data.title, 120);
    if (!title) throw new Error("Please give the project a title.");
    if (!(PROJECT_STATUSES as readonly string[]).includes(data.status))
      throw new Error("Please choose a status.");
    const id = data.id === null ? undefined : positiveId(data.id);
    const slug = await uniqueSlug(slugify(data.slug || title), id);
    const values = [
      title,
      slug,
      text(data.category, 60),
      text(data.location, 120),
      text(data.year, 12),
      text(data.client, 120),
      data.status,
      text(data.summary, 400),
      String(data.body ?? "").slice(0, 20_000),
      text(data.scope, 2000),
      text(data.challenge, 1500),
      text(data.solution, 1500),
      text(data.result, 1500),
      data.featured ? 1 : 0,
      data.published ? 1 : 0,
    ];
    const db = getDb();
    const cols =
      "title, slug, category, location, year, client, status, summary, body, scope, challenge, solution, result, featured, published";
    if (id) {
      await db
        .prepare(
          `UPDATE projects SET ${cols
            .split(", ")
            .map((c) => `${c} = ?`)
            .join(", ")} WHERE id = ?`,
        )
        .bind(...values, id)
        .run();
      return { id, slug };
    }
    const result = await db
      .prepare(
        `INSERT INTO projects (${cols}, position) VALUES (${values.map(() => "?").join(", ")}, ?)`,
      )
      .bind(...values, await topPosition("projects"))
      .run();
    return { id: Number(result.meta.last_row_id), slug };
  });

export const adminDeleteProject = createServerFn({ method: "POST" })
  .inputValidator((id: number) => id)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const id = positiveId(data);
    const db = getDb();
    const { results } = await db
      .prepare(`SELECT url FROM project_media WHERE project_id = ?`)
      .bind(id)
      .all<{ url: string }>();
    await deleteMediaObjects(results.map((r) => r.url));
    // D1 needs foreign keys enabled per connection for ON DELETE CASCADE, so children go explicitly.
    await db.batch([
      db.prepare(`DELETE FROM project_media WHERE project_id = ?`).bind(id),
      db.prepare(`DELETE FROM projects WHERE id = ?`).bind(id),
    ]);
  });

export const adminMoveProject = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number; direction: "up" | "down" }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await move("projects", positiveId(data.id), data.direction);
  });

export const adminSetProjectFlag = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number; flag: "published" | "featured"; value: boolean }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    if (data.flag !== "published" && data.flag !== "featured") throw new Error("Unknown setting.");
    await getDb()
      .prepare(`UPDATE projects SET ${data.flag} = ? WHERE id = ?`)
      .bind(data.value ? 1 : 0, positiveId(data.id))
      .run();
  });

/* ---------- project gallery: photos, videos and video links ---------- */

async function addMedia(
  projectId: number,
  kind: "image" | "video" | "embed",
  url: string,
  alt: string,
) {
  const db = getDb();
  const project = await db
    .prepare(`SELECT cover FROM projects WHERE id = ?`)
    .bind(projectId)
    .first<{ cover: string }>();
  if (!project) throw new Error("That project no longer exists.");
  const next = await db
    .prepare(`SELECT COALESCE(MAX(position), 0) + 1 AS pos FROM project_media WHERE project_id = ?`)
    .bind(projectId)
    .first<{ pos: number }>();
  await db
    .prepare(
      `INSERT INTO project_media (project_id, kind, url, alt, position) VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(projectId, kind, url, alt, next?.pos ?? 1)
    .run();
  // The first photo becomes the cover, which is what the project grid shows.
  if (kind === "image" && !project.cover) {
    await db
      .prepare(`UPDATE projects SET cover = ?, cover_alt = ? WHERE id = ?`)
      .bind(url, alt, projectId)
      .run();
  }
}

export const adminUploadProjectMedia = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const projectId = positiveId(data.get("projectId"));
    const alt = text(data.get("alt"), 300);
    const file = data.get("file");
    const isVideo = file instanceof File && file.type.startsWith("video/");
    const url = isVideo
      ? await putFile(
          `projects/${projectId}`,
          readFile(data, VIDEO_TYPES, MAX_VIDEO_BYTES, "video"),
        )
      : await putFile(
          `projects/${projectId}`,
          readFile(data, IMAGE_TYPES, MAX_IMAGE_BYTES, "photo"),
        );
    await addMedia(projectId, isVideo ? "video" : "image", url, alt);
  });

export const adminAddProjectEmbed = createServerFn({ method: "POST" })
  .inputValidator((input: { projectId: number; url: string; alt: string }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const embed = embedUrl(text(data.url, 500));
    if (!embed) throw new Error("Paste a YouTube, Vimeo or Facebook video link.");
    await addMedia(positiveId(data.projectId), "embed", embed, text(data.alt, 300));
  });

export const adminUpdateMedia = createServerFn({ method: "POST" })
  .inputValidator((input: { projectId: number; mediaId: number; alt: string }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await getDb()
      .prepare(`UPDATE project_media SET alt = ? WHERE id = ? AND project_id = ?`)
      .bind(text(data.alt, 300), positiveId(data.mediaId), positiveId(data.projectId))
      .run();
  });

export const adminMoveMedia = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { projectId: number; mediaId: number; direction: "up" | "down" }) => input,
  )
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await move("project_media", positiveId(data.mediaId), data.direction, {
      column: "project_id",
      value: positiveId(data.projectId),
    });
  });

export const adminSetProjectCover = createServerFn({ method: "POST" })
  .inputValidator((input: { projectId: number; mediaId: number }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const db = getDb();
    const m = await db
      .prepare(`SELECT url, alt, kind FROM project_media WHERE id = ? AND project_id = ?`)
      .bind(positiveId(data.mediaId), positiveId(data.projectId))
      .first<{ url: string; alt: string; kind: string }>();
    if (!m || m.kind !== "image") throw new Error("Only a photo can be the cover.");
    await db
      .prepare(`UPDATE projects SET cover = ?, cover_alt = ? WHERE id = ?`)
      .bind(m.url, m.alt, data.projectId)
      .run();
  });

export const adminDeleteMedia = createServerFn({ method: "POST" })
  .inputValidator((input: { projectId: number; mediaId: number }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const db = getDb();
    const projectId = positiveId(data.projectId);
    const m = await db
      .prepare(`SELECT url FROM project_media WHERE id = ? AND project_id = ?`)
      .bind(positiveId(data.mediaId), projectId)
      .first<{ url: string }>();
    if (!m) return;
    await db.prepare(`DELETE FROM project_media WHERE id = ?`).bind(data.mediaId).run();
    await deleteMediaObjects([m.url]);
    // If that was the cover, promote the next photo rather than point at a deleted file.
    const project = await db
      .prepare(`SELECT cover FROM projects WHERE id = ?`)
      .bind(projectId)
      .first<{ cover: string }>();
    if (project?.cover === m.url) {
      const next = await db
        .prepare(
          `SELECT url, alt FROM project_media WHERE project_id = ? AND kind = 'image' ORDER BY position, id LIMIT 1`,
        )
        .bind(projectId)
        .first<{ url: string; alt: string }>();
      await db
        .prepare(`UPDATE projects SET cover = ?, cover_alt = ? WHERE id = ?`)
        .bind(next?.url ?? "", next?.alt ?? "", projectId)
        .run();
    }
  });

/* ---------- settings & section switches ---------- */

export const adminGetSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ settings: Settings; sections: Record<string, boolean> }> => {
    await requireAdmin();
    const map = await readSettings();
    const sections: Record<string, boolean> = {};
    for (const s of SECTIONS) sections[s.key] = (map.get(`section_${s.key}`) ?? "1") === "1";
    return { settings: settingsFrom(map), sections };
  },
);

/** Keys the dashboard may write. Anything else (the password hash) is refused. */
const EDITABLE_SETTINGS = new Set([
  "company_name",
  "legal_name",
  "tagline",
  "founded_year",
  "brand_promise",
  "about_short",
  "about_long",
  "mission",
  "vision",
  "hero_eyebrow",
  "hero_title_1",
  "hero_title_2",
  "hero_text",
  "stats",
  "ceo_name",
  "ceo_role",
  "ceo_bio",
  "ceo_quote",
  "ceo_credentials",
  "phone1",
  "phone2",
  "phone3",
  "whatsapp",
  "email",
  "address",
  "shop_address",
  "hours",
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "map_query",
  "seo_title",
  "seo_description",
  "seo_keywords",
  "google_verification",
]);

export const adminSaveSettings = createServerFn({ method: "POST" })
  .inputValidator((input: Record<string, string>) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const entries: [string, string][] = [];
    for (const [key, raw] of Object.entries(data)) {
      if (!EDITABLE_SETTINGS.has(key)) throw new Error(`"${key}" cannot be changed here.`);
      let value = String(raw ?? "")
        .slice(0, key === "about_long" ? 6000 : 2000)
        .trim();
      if (key === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        throw new Error("Please enter a valid email.");
      if (key === "whatsapp") {
        value = value.replace(/\D/g, "");
        if (value.length < 9 || value.startsWith("0")) {
          throw new Error("Enter the WhatsApp number with the country code, e.g. 263 77 196 0330.");
        }
      }
      if (
        ["facebook", "instagram", "linkedin", "youtube", "tiktok"].includes(key) &&
        value &&
        !/^https:\/\//.test(value)
      ) {
        throw new Error("Social links must start with https://");
      }
      if (key === "stats") {
        try {
          if (!Array.isArray(JSON.parse(value))) throw new Error();
        } catch {
          throw new Error("The numbers could not be saved. Please try again.");
        }
      }
      entries.push([key, value]);
    }
    await writeSettings(entries);
  });

export const adminSaveSections = createServerFn({ method: "POST" })
  .inputValidator((input: Record<string, boolean>) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    const known = new Set<string>(SECTIONS.map((s) => s.key));
    await writeSettings(
      Object.entries(data)
        .filter(([k]) => known.has(k))
        .map(([k, v]) => [`section_${k}`, v ? "1" : "0"]),
    );
  });

/** Settings that hold a single uploaded picture: the CEO photo. */
export const adminUploadSettingImage = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data }): Promise<{ url: string }> => {
    await requireAdmin();
    const key = String(data.get("key"));
    if (key !== "ceo_photo") throw new Error("That picture cannot be changed here.");
    const previous = (await readSettings()).get(key) ?? "";
    const url = await putFile("settings", readFile(data, IMAGE_TYPES, MAX_IMAGE_BYTES, "picture"));
    await writeSettings([[key, url]]);
    await deleteMediaObjects([previous]);
    return { url };
  });

/** The downloadable company profile. With none uploaded the download button stays hidden. */
export const adminUploadCompanyProfile = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data }): Promise<{ url: string }> => {
    await requireAdmin();
    const pdf = readFile(data, new Map([["application/pdf", "pdf"]]), MAX_PDF_BYTES, "PDF");
    const previous = (await readSettings()).get("company_profile_pdf") ?? "";
    const url = await putFile(
      "docs",
      pdf,
      'inline; filename="Fumati Engineers - Company Profile.pdf"',
    );
    await writeSettings([["company_profile_pdf", url]]);
    await deleteMediaObjects([previous]);
    return { url };
  });

export const adminRemoveCompanyProfile = createServerFn({ method: "POST" }).handler(
  async (): Promise<void> => {
    await requireAdmin();
    const previous = (await readSettings()).get("company_profile_pdf") ?? "";
    await writeSettings([["company_profile_pdf", ""]]);
    await deleteMediaObjects([previous]);
  },
);

/* ---------- enquiries ---------- */

export const ENQUIRY_STATUSES = ["New", "Contacted", "Quoted", "Won", "Closed"] as const;
export type EnquiryRecord = {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  budget: string;
  message: string;
  status: string;
  created_at: string;
};

export const adminListEnquiries = createServerFn({ method: "GET" }).handler(
  async (): Promise<EnquiryRecord[]> => {
    await requireAdmin();
    const { results } = await getDb()
      .prepare(
        `SELECT id, name, phone, email, service, location, budget, message, status, created_at
         FROM enquiries ORDER BY id DESC LIMIT 500`,
      )
      .all<EnquiryRecord>();
    return results;
  },
);

export const adminSetEnquiryStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number; status: string }) => input)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    if (!(ENQUIRY_STATUSES as readonly string[]).includes(data.status))
      throw new Error("Unknown status.");
    await getDb()
      .prepare(`UPDATE enquiries SET status = ? WHERE id = ?`)
      .bind(data.status, positiveId(data.id))
      .run();
  });

export const adminDeleteEnquiry = createServerFn({ method: "POST" })
  .inputValidator((id: number) => id)
  .handler(async ({ data }): Promise<void> => {
    await requireAdmin();
    await getDb().prepare(`DELETE FROM enquiries WHERE id = ?`).bind(positiveId(data)).run();
  });

/* ---------- dashboard overview ---------- */

export const adminOverview = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const db = getDb();
  const count = async (sql: string) => (await db.prepare(sql).first<{ n: number }>())?.n ?? 0;
  const [newEnquiries, enquiries, projects, published, testimonials, team, clients] =
    await Promise.all([
      count(`SELECT COUNT(*) AS n FROM enquiries WHERE status = 'New'`),
      count(`SELECT COUNT(*) AS n FROM enquiries`),
      count(`SELECT COUNT(*) AS n FROM projects`),
      count(`SELECT COUNT(*) AS n FROM projects WHERE published = 1`),
      count(`SELECT COUNT(*) AS n FROM testimonials WHERE hidden = 0`),
      count(`SELECT COUNT(*) AS n FROM team WHERE hidden = 0`),
      count(`SELECT COUNT(*) AS n FROM clients WHERE hidden = 0`),
    ]);
  const { results: latest } = await db
    .prepare(
      `SELECT id, name, phone, service, status, created_at FROM enquiries ORDER BY id DESC LIMIT 6`,
    )
    .all<Pick<EnquiryRecord, "id" | "name" | "phone" | "service" | "status" | "created_at">>();
  return { newEnquiries, enquiries, projects, published, testimonials, team, clients, latest };
});
