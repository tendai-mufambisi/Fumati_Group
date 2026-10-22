import { createFileRoute, Link, notFound, redirect, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Film,
  Link2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText, prepareImage } from "@/components/admin/prepare-image";
import {
  adminAddProjectEmbed,
  adminDeleteMedia,
  adminGetProject,
  adminMoveMedia,
  adminSaveProject,
  adminSetProjectCover,
  adminUpdateMedia,
  adminUploadProjectMedia,
  type ProjectInput,
} from "@/data/admin";
import { checkAuth } from "@/data/auth";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/data/collections";
import { embedThumb, type ProjectDetail, type ProjectMedia } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/projects/$id")({
  loader: async ({ params }): Promise<{ project: ProjectDetail | null }> => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    if (params.id === "new") return { project: null };
    const project = await adminGetProject({ data: Number(params.id) });
    if (!project) throw notFound();
    return { project };
  },
  head: () => adminSeo("Edit project"),
  component: ProjectEditor,
});

function ProjectEditor() {
  const { project } = Route.useLoaderData();
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>({
    id: project?.id ?? null,
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    category: project?.category ?? PROJECT_CATEGORIES[0],
    location: project?.location ?? "",
    year: project?.year ?? "",
    client: project?.client ?? "",
    status: project?.status ?? "Completed",
    summary: project?.summary ?? "",
    body: project?.body ?? "",
    scope: project?.scope.join("\n") ?? "",
    challenge: project?.challenge ?? "",
    solution: project?.solution ?? "",
    result: project?.result ?? "",
    featured: project?.featured ?? false,
    published: project?.published ?? false,
  });
  const [state, setState] = useState({ busy: false, error: "", saved: false });
  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState({ busy: true, error: "", saved: false });
    try {
      const { id } = await adminSaveProject({ data: form });
      if (!project) {
        await router.navigate({ to: "/admin/projects/$id", params: { id: String(id) } });
        return;
      }
      await router.invalidate();
      setState({ busy: false, error: "", saved: true });
    } catch (err) {
      setState({ busy: false, error: errorText(err), saved: false });
    }
  }

  const text = (
    k: keyof ProjectInput,
    label: string,
    extra: { placeholder?: string; max?: number; required?: boolean } = {},
  ) => (
    <div className="admin-field">
      <label htmlFor={k}>{label}</label>
      <input
        id={k}
        value={String(form[k] ?? "")}
        maxLength={extra.max ?? 120}
        required={extra.required}
        placeholder={extra.placeholder}
        onChange={(e) => set(k, e.target.value as never)}
      />
    </div>
  );
  const area = (
    k: keyof ProjectInput,
    label: string,
    rows: number,
    placeholder?: string,
    help?: string,
  ) => (
    <div className="admin-field">
      <label htmlFor={k}>{label}</label>
      <textarea
        id={k}
        rows={rows}
        value={String(form[k] ?? "")}
        placeholder={placeholder}
        onChange={(e) => set(k, e.target.value as never)}
      />
      {help && <small>{help}</small>}
    </div>
  );

  return (
    <AdminShell
      title={project ? project.title : "New project"}
      description={
        project
          ? `Live at /projects/${project.slug}${project.published ? "" : " once published"}.`
          : "Fill in the details and save. You can add photos and videos straight after."
      }
      actions={
        <>
          <Link to="/admin/projects" className="admin-btn admin-btn-small">
            <ArrowLeft size={16} /> All projects
          </Link>
          {project?.published && (
            <a
              href={`/projects/${project.slug}`}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-small"
            >
              <ExternalLink size={16} /> View
            </a>
          )}
        </>
      }
    >
      <div className="admin-two-col">
        <AdminCard title="Details">
          <form className="admin-form" onSubmit={onSubmit}>
            {text("title", "Project title *", {
              required: true,
              placeholder: "e.g. The Heart Stadium",
            })}
            <div className="admin-grid-2">
              <div className="admin-field">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {[...new Set([...PROJECT_CATEGORIES, form.category])].filter(Boolean).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              {text("location", "Location", { placeholder: "e.g. Waterfalls, Harare" })}
              {text("year", "Year", { max: 12, placeholder: "e.g. 2025" })}
              {text("client", "Client (optional)")}
              {text("slug", "Web address (optional)", {
                max: 80,
                placeholder: "made from the title",
              })}
            </div>
            {area(
              "summary",
              "Short summary *",
              3,
              "One or two sentences. Shows on the project card and in Google.",
            )}
            {area(
              "scope",
              "Scope of work — one item per line",
              5,
              "Steel fabrication\nErection\nRoof sheeting",
            )}
            {area("challenge", "The challenge (optional)", 3)}
            {area("solution", "Our solution (optional)", 3)}
            {area("result", "The result (optional)", 3)}
            {area(
              "body",
              "Full write-up (optional)",
              8,
              "## The brief\n\nWhat the client wanted…",
              "Use ## for a heading, - for a bullet and **bold** for emphasis.",
            )}
            <div className="admin-check-grid">
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => set("published", e.target.checked)}
                />{" "}
                Show on the website
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />{" "}
                Feature on the home page
              </label>
            </div>
            {state.error && <p className="admin-error">{state.error}</p>}
            {state.saved && <p className="admin-success">Saved.</p>}
            <button type="submit" className="admin-btn admin-btn-primary" disabled={state.busy}>
              {state.busy ? "Saving…" : project ? "Save changes" : "Create project"}
            </button>
          </form>
        </AdminCard>

        {project ? (
          <GalleryCard project={project} />
        ) : (
          <AdminCard title="Photos & videos">
            <p className="admin-muted">
              Save the project first, then add as many photos and videos as you like.
            </p>
          </AdminCard>
        )}
      </div>
    </AdminShell>
  );
}

function GalleryCard({ project }: { project: ProjectDetail }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [link, setLink] = useState("");
  const [state, setState] = useState({ busy: false, error: "", progress: "" });

  async function run(action: () => Promise<unknown>) {
    setState({ busy: true, error: "", progress: "" });
    try {
      await action();
      await router.invalidate();
      setState({ busy: false, error: "", progress: "" });
    } catch (e) {
      setState({ busy: false, error: errorText(e), progress: "" });
    }
  }

  async function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])];
    if (!files.length) return;
    const description = alt.trim() || project.title;
    try {
      // One at a time: each upload adds a row, so the gallery keeps the order chosen.
      for (const [i, file] of files.entries()) {
        setState({ busy: true, error: "", progress: `Uploading ${i + 1} of ${files.length}…` });
        const isVideo = file.type.startsWith("video/");
        if (isVideo && file.size > 90 * 1024 * 1024)
          throw new Error(
            `${file.name} is over 90 MB. Upload it to YouTube and paste the link instead.`,
          );
        const form = new FormData();
        form.append("file", isVideo ? file : (await prepareImage(file)).file);
        form.append("projectId", String(project.id));
        form.append("alt", files.length > 1 ? `${description} (${i + 1})` : description);
        await adminUploadProjectMedia({ data: form });
      }
      setAlt("");
      await router.invalidate();
      setState({ busy: false, error: "", progress: "" });
    } catch (err) {
      await router.invalidate();
      setState({ busy: false, error: errorText(err), progress: "" });
    }
    if (input.current) input.current.value = "";
  }

  return (
    <AdminCard
      title={`Photos & videos (${project.media.length})`}
      description="The starred photo is the cover on the project card. Drag order with the arrows; visitors can open everything full screen."
    >
      <div className="admin-form">
        <div className="admin-field">
          <label htmlFor="alt">Describe what's in the photos (helps Google)</label>
          <input
            id="alt"
            value={alt}
            maxLength={300}
            placeholder={`e.g. ${project.title} roof trusses`}
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>
        <label className="admin-btn admin-btn-primary admin-btn-block">
          <Upload size={17} /> {state.progress || "Upload photos or videos"}
          <input
            ref={input}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
            onChange={onFiles}
            disabled={state.busy}
            className="sr-only"
          />
        </label>
        <small className="admin-muted">
          Select many at once. Photos are resized automatically. Videos up to 90 MB (MP4 works
          everywhere).
        </small>
        <form
          className="admin-actions"
          onSubmit={(e) => {
            e.preventDefault();
            void run(() =>
              adminAddProjectEmbed({
                data: { projectId: project.id, url: link, alt: alt || project.title },
              }),
            ).then(() => setLink(""));
          }}
        >
          <div className="admin-field" style={{ flex: 1 }}>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Or paste a YouTube / Facebook / Vimeo video link"
            />
          </div>
          <button type="submit" className="admin-btn" disabled={state.busy || !link.trim()}>
            <Link2 size={16} /> Add link
          </button>
        </form>
        {state.error && <p className="admin-error">{state.error}</p>}
      </div>

      {project.media.length === 0 ? (
        <p className="admin-muted" style={{ marginTop: 16 }}>
          No photos yet. The project shows a placeholder until you add one.
        </p>
      ) : (
        <ul className="admin-photo-grid">
          {project.media.map((m, i) => (
            <MediaItem
              key={m.id}
              m={m}
              projectId={project.id}
              isCover={m.url === project.cover}
              first={i === 0}
              last={i === project.media.length - 1}
              busy={state.busy}
              run={run}
            />
          ))}
        </ul>
      )}
    </AdminCard>
  );
}

function MediaItem({
  m,
  projectId,
  isCover,
  first,
  last,
  busy,
  run,
}: {
  m: ProjectMedia;
  projectId: number;
  isCover: boolean;
  first: boolean;
  last: boolean;
  busy: boolean;
  run: (a: () => Promise<unknown>) => Promise<void>;
}) {
  const [alt, setAlt] = useState(m.alt);
  const thumb = m.kind === "image" ? m.url : m.kind === "embed" ? embedThumb(m.url) : null;
  return (
    <li className={isCover ? "is-cover" : ""}>
      {m.kind === "video" ? (
        <video src={`${m.url}#t=0.5`} className="admin-media" muted preload="metadata" />
      ) : thumb ? (
        <img src={thumb} alt={m.alt} className="admin-media" loading="lazy" />
      ) : (
        <span className="admin-media admin-item-thumb" style={{ width: "100%", height: "auto" }}>
          <Film size={24} />
        </span>
      )}
      {isCover && (
        <span className="admin-pill" data-status="New">
          Cover
        </span>
      )}
      {m.kind !== "image" && !isCover && (
        <span className="admin-pill">{m.kind === "video" ? "Video" : "Video link"}</span>
      )}
      <input
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        onBlur={() =>
          alt !== m.alt && run(() => adminUpdateMedia({ data: { projectId, mediaId: m.id, alt } }))
        }
        aria-label="Description"
      />
      <div className="admin-row-actions" style={{ justifyContent: "flex-start" }}>
        <button
          className="admin-btn admin-btn-small"
          disabled={busy || first}
          aria-label="Move earlier"
          onClick={() =>
            run(() => adminMoveMedia({ data: { projectId, mediaId: m.id, direction: "up" } }))
          }
        >
          <ArrowLeft size={14} />
        </button>
        <button
          className="admin-btn admin-btn-small"
          disabled={busy || last}
          aria-label="Move later"
          onClick={() =>
            run(() => adminMoveMedia({ data: { projectId, mediaId: m.id, direction: "down" } }))
          }
        >
          <ArrowRight size={14} />
        </button>
        {m.kind === "image" && (
          <button
            className="admin-btn admin-btn-small"
            disabled={busy || isCover}
            aria-label="Make cover"
            title="Make this the cover"
            onClick={() => run(() => adminSetProjectCover({ data: { projectId, mediaId: m.id } }))}
          >
            <Star size={14} />
          </button>
        )}
        <button
          className="admin-btn admin-btn-small admin-btn-danger"
          disabled={busy}
          aria-label="Delete"
          onClick={() =>
            confirm("Delete this item?") &&
            run(() => adminDeleteMedia({ data: { projectId, mediaId: m.id } }))
          }
        >
          <Trash2 size={14} />
        </button>
      </div>
    </li>
  );
}
