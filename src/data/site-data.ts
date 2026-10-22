import {
  collectionKeys,
  collections,
  SECTIONS,
  type CollectionKey,
  type ItemOf,
  type SectionKey,
} from "./collections";
import { RESPONSIVE_IMAGES, SEED_COLLECTIONS, SEED_PROJECTS, SEED_SETTINGS } from "./seed";

export const SITE_URL = "https://fumatigroup.digitsdigital.co.zw";
export const AGENCY = {
  name: "Digits Digital",
  url: "https://www.digitsdigital.co.zw",
  label: "www.digitsdigital.co.zw",
};

/* ---------- types ---------- */

export type Settings = { [K in keyof typeof SEED_SETTINGS]: string };
export type SettingKey = keyof Settings;
export type Stat = { value: string; suffix: string; label: string };
export type Hours = { days: string; time: string };

export type MediaKind = "image" | "video" | "embed";
export type ProjectMedia = { id: number; kind: MediaKind; url: string; alt: string };

export type ProjectSummary = {
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
  coverAlt: string;
  featured: boolean;
  published: boolean;
  mediaCount: number;
};

export type ProjectDetail = ProjectSummary & {
  body: string;
  scope: string[];
  challenge: string;
  solution: string;
  result: string;
  media: ProjectMedia[];
};

export type SiteData = {
  settings: Settings;
  stats: Stat[];
  hours: Hours[];
  ceoCredentials: string[];
  sections: Record<SectionKey, boolean>;
  collections: { [K in CollectionKey]: ItemOf<K>[] };
  projects: ProjectSummary[];
  /** False when the database was unreachable and the shipped content is showing. */
  live: boolean;
};

/* ---------- small helpers ---------- */

export const toLines = (value: string | undefined): string[] =>
  (value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const digitsOnly = (v: string) => v.replace(/\D/g, "");
export const whatsappUrl = (number: string, text = "Hi Fumati Engineers, I'd like a quote for…") =>
  `https://wa.me/${digitsOnly(number)}?text=${encodeURIComponent(text)}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Large shipped photos have a lighter `-sm` twin for cards and phones. */
export const responsiveSrcSet = (src: string) =>
  RESPONSIVE_IMAGES.includes(src)
    ? `${src.replace(".webp", "-sm.webp")} 800w, ${src} 1800w`
    : undefined;

/** YouTube / Vimeo / Facebook links → an embeddable URL, or null if not recognised. */
export function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host === "youtube.com") {
      const id =
        u.searchParams.get("v") ?? u.pathname.match(/\/(?:shorts|embed|live)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.match(/\/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "facebook.com" || host === "fb.watch") {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
    }
  } catch {
    // Not a URL.
  }
  return null;
}

/** YouTube thumbnail for an embed, so the gallery has something to show. */
export function embedThumb(url: string): string | null {
  const id = url.match(/youtube(?:-nocookie)?\.com\/embed\/([^/?]+)/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/* ---------- settings → site data ---------- */

/** Empty settings fall back to the shipped value, except fields that may be cleared on purpose. */
const CLEARABLE = new Set([
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "facebook",
  "phone2",
  "phone3",
  "shop_address",
  "google_verification",
  "company_profile_pdf",
  "founded_year",
  "ceo_photo",
]);

export function settingsFrom(map: Map<string, string>): Settings {
  const out: Settings = { ...SEED_SETTINGS };
  for (const key of Object.keys(SEED_SETTINGS) as SettingKey[]) {
    const v = map.get(key);
    if (v === undefined) continue;
    if (v !== "" || CLEARABLE.has(key)) out[key] = v;
  }
  return out;
}

export function statsFrom(raw: string): Stat[] {
  try {
    const parsed = JSON.parse(raw) as Stat[];
    if (Array.isArray(parsed)) return parsed.filter((s) => s && s.value && s.label);
  } catch {
    // Fall through to the shipped stats.
  }
  return JSON.parse(SEED_SETTINGS.stats) as Stat[];
}

export function hoursFrom(raw: string): Hours[] {
  return toLines(raw).map((line) => {
    const [days = "", time = ""] = line.split("|");
    return { days: days.trim(), time: time.trim() };
  });
}

/** A missing switch means "on", so a fresh database shows the whole site. */
export function sectionsFrom(map: Map<string, string>): Record<SectionKey, boolean> {
  const out = {} as Record<SectionKey, boolean>;
  for (const s of SECTIONS) out[s.key] = (map.get(`section_${s.key}`) ?? "1") === "1";
  return out;
}

/** Rows missing a required field never reach the public site. */
export function isComplete(key: CollectionKey, item: Record<string, unknown>): boolean {
  return collections[key].fields.every(
    (f) => !("required" in f && f.required) || String(item[f.key] ?? "").trim() !== "",
  );
}

/* ---------- the content the site ships with ---------- */

function buildFallback(): SiteData {
  const map = new Map<string, string>(Object.entries(SEED_SETTINGS));
  const settings = settingsFrom(map);
  const cols = {} as Record<CollectionKey, unknown[]>;
  for (const key of collectionKeys) {
    cols[key] = (SEED_COLLECTIONS[key] ?? []).map((row, i) => ({
      ...row,
      id: i + 1,
      hidden: false,
    }));
  }
  const projects = SEED_PROJECTS.filter((p) => p.published).map((p, i) =>
    projectSummaryFromSeed(p, i + 1),
  );
  return {
    settings,
    stats: statsFrom(settings.stats),
    hours: hoursFrom(settings.hours),
    ceoCredentials: toLines(settings.ceo_credentials),
    sections: sectionsFrom(map),
    collections: cols as SiteData["collections"],
    projects,
    live: false,
  };
}

function projectSummaryFromSeed(p: (typeof SEED_PROJECTS)[number], id: number): ProjectSummary {
  const cover = p.media.find((m) => m.kind === "image");
  return {
    id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    location: p.location,
    year: p.year,
    client: p.client,
    status: p.status,
    summary: p.summary,
    cover: cover?.url ?? "",
    coverAlt: cover?.alt ?? p.title,
    featured: p.featured,
    published: p.published,
    mediaCount: p.media.length,
  };
}

export function fallbackProject(slug: string): ProjectDetail | null {
  const index = SEED_PROJECTS.findIndex((p) => p.slug === slug && p.published);
  if (index === -1) return null;
  const p = SEED_PROJECTS[index]!;
  return {
    ...projectSummaryFromSeed(p, index + 1),
    body: p.body,
    scope: toLines(p.scope),
    challenge: p.challenge,
    solution: p.solution,
    result: p.result,
    media: p.media.map((m, i) => ({ ...m, id: i + 1 })),
  };
}

export const FALLBACK_SITE_DATA: SiteData = buildFallback();
