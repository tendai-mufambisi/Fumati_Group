import {
  collectionKeys,
  collections,
  type CollectionItem,
  type CollectionKey,
} from "./collections";
import { getDb, getMedia } from "./bindings.server";
import {
  hoursFrom,
  isComplete,
  sectionsFrom,
  settingsFrom,
  statsFrom,
  toLines,
  type MediaKind,
  type ProjectDetail,
  type ProjectMedia,
  type ProjectSummary,
  type SiteData,
} from "./site-data";

/* ---------- settings ---------- */

export async function readSettings(): Promise<Map<string, string>> {
  const { results } = await getDb()
    .prepare(`SELECT key, value FROM settings WHERE key <> 'admin_password_hash'`)
    .all<{ key: string; value: string }>();
  return new Map(results.map((row) => [row.key, row.value]));
}

export async function writeSettings(entries: [string, string][]): Promise<void> {
  if (entries.length === 0) return;
  const db = getDb();
  await db.batch(
    entries.map(([key, value]) =>
      db
        .prepare(
          `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        )
        .bind(key, value),
    ),
  );
}

/* ---------- collections ---------- */

export const collectionColumns = (key: CollectionKey) =>
  ["id", "hidden", ...collections[key].fields.map((f) => f.key)].join(", ");

type CollectionRow = Record<string, string | number | null>;

export function toCollectionItem(row: CollectionRow): CollectionItem {
  const item: CollectionItem = { id: Number(row["id"]), hidden: Number(row["hidden"]) === 1 };
  for (const [k, v] of Object.entries(row)) {
    if (k !== "id" && k !== "hidden") item[k] = v === null ? "" : String(v);
  }
  return item;
}

export async function readCollection(
  key: CollectionKey,
  visibleOnly: boolean,
): Promise<CollectionItem[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT ${collectionColumns(key)} FROM ${collections[key].table}
       ${visibleOnly ? "WHERE hidden = 0" : ""} ORDER BY position, id`,
    )
    .all<CollectionRow>();
  const items = results.map(toCollectionItem);
  return visibleOnly ? items.filter((i) => isComplete(key, i)) : items;
}

/* ---------- projects ---------- */

export const PROJECT_COLUMNS = `id, slug, title, category, location, year, client, status, summary,
  cover, cover_alt, featured, published`;
export const PROJECT_DETAIL_COLUMNS = `${PROJECT_COLUMNS}, body, scope, challenge, solution, result`;

export type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  status: string;
  summary: string;
  cover: string;
  cover_alt: string;
  featured: number;
  published: number;
  media_count?: number;
  body?: string;
  scope?: string;
  challenge?: string;
  solution?: string;
  result?: string;
};

export function toProjectSummary(row: ProjectRow): ProjectSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    location: row.location,
    year: row.year,
    client: row.client,
    status: row.status,
    summary: row.summary,
    cover: row.cover,
    coverAlt: row.cover_alt || row.title,
    featured: row.featured === 1,
    published: row.published === 1,
    mediaCount: row.media_count ?? 0,
  };
}

type MediaRow = { id: number; kind: string; url: string; alt: string };

export const toMedia = (row: MediaRow): ProjectMedia => ({
  id: row.id,
  kind: (["image", "video", "embed"].includes(row.kind) ? row.kind : "image") as MediaKind,
  url: row.url,
  alt: row.alt,
});

export async function readProjects(publishedOnly: boolean): Promise<ProjectSummary[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT ${PROJECT_COLUMNS},
              (SELECT COUNT(*) FROM project_media m WHERE m.project_id = projects.id) AS media_count
         FROM projects ${publishedOnly ? "WHERE published = 1" : ""}
        ORDER BY position, id`,
    )
    .all<ProjectRow>();
  return results.map(toProjectSummary);
}

export async function readProject(
  where: { slug: string } | { id: number },
  publishedOnly: boolean,
): Promise<ProjectDetail | null> {
  const db = getDb();
  const byId = "id" in where;
  const row = await db
    .prepare(
      `SELECT ${PROJECT_DETAIL_COLUMNS} FROM projects
        WHERE ${byId ? "id = ?" : "slug = ?"} ${publishedOnly ? "AND published = 1" : ""}`,
    )
    .bind(byId ? where.id : where.slug)
    .first<ProjectRow>();
  if (!row) return null;
  const { results } = await db
    .prepare(
      `SELECT id, kind, url, alt FROM project_media WHERE project_id = ? ORDER BY position, id`,
    )
    .bind(row.id)
    .all<MediaRow>();
  const media = results.map(toMedia);
  return {
    ...toProjectSummary({ ...row, media_count: media.length }),
    body: row.body ?? "",
    scope: toLines(row.scope),
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    result: row.result ?? "",
    media,
  };
}

/* ---------- the public read ---------- */

export async function loadSiteData(): Promise<SiteData> {
  const [settingsMap, projects, ...lists] = await Promise.all([
    readSettings(),
    readProjects(true),
    ...collectionKeys.map((k) => readCollection(k, true)),
  ]);
  const settings = settingsFrom(settingsMap);
  const cols = {} as Record<CollectionKey, CollectionItem[]>;
  collectionKeys.forEach((k, i) => (cols[k] = lists[i]!));
  return {
    settings,
    stats: statsFrom(settings.stats),
    hours: hoursFrom(settings.hours),
    ceoCredentials: toLines(settings.ceo_credentials),
    sections: sectionsFrom(settingsMap),
    collections: cols as unknown as SiteData["collections"],
    projects,
    live: true,
  };
}

/** Only R2 uploads are deletable; `/images/*` files ship with the build. */
export async function deleteMediaObjects(urls: (string | null | undefined)[]): Promise<void> {
  const keys = urls
    .filter((url): url is string => !!url && url.startsWith("/media/"))
    .map((url) => decodeURIComponent(url.slice("/media/".length)));
  if (keys.length === 0) return;
  const media = getMedia();
  await Promise.all(
    keys.map((key) =>
      media.delete(key).catch(() => {
        // A missing object is the desired end state anyway.
      }),
    ),
  );
}
