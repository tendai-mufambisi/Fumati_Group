import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImageIcon,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import {
  adminDeleteProject,
  adminListProjects,
  adminMoveProject,
  adminSetProjectFlag,
} from "@/data/admin";
import { checkAuth } from "@/data/auth";
import type { ProjectSummary } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/projects/")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return { projects: await adminListProjects() };
  },
  head: () => adminSeo("Projects"),
  component: ProjectsAdmin,
});

function ProjectsAdmin() {
  const { projects } = Route.useLoaderData();
  return (
    <AdminShell
      title="Projects"
      description="Every project has its own page with a gallery of photos and videos. Starred projects appear on the home page."
      actions={
        <Link
          to="/admin/projects/$id"
          params={{ id: "new" }}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={17} /> Add project
        </Link>
      }
    >
      <AdminCard
        title={`${projects.length} projects`}
        description="Drafts are only visible to you. Use the arrows to set the order on the Projects page."
      >
        <div className="admin-list" style={{ gap: 10 }}>
          {projects.map((p, i) => (
            <Row key={p.id} p={p} first={i === 0} last={i === projects.length - 1} />
          ))}
        </div>
      </AdminCard>
    </AdminShell>
  );
}

function Row({ p, first, last }: { p: ProjectSummary; first: boolean; last: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      await router.invalidate();
    } catch (e) {
      alert(errorText(e));
    }
    setBusy(false);
  }
  return (
    <div className={`admin-item ${p.published ? "" : "is-hidden"}`} aria-busy={busy}>
      {p.cover ? (
        <img src={p.cover} alt="" className="admin-item-thumb" loading="lazy" />
      ) : (
        <span className="admin-item-thumb">
          <ImageIcon size={20} />
        </span>
      )}
      <div className="admin-item-text">
        <strong>{p.title}</strong>
        <small>
          {p.published ? "Live" : "Draft"} · {p.category || "No category"} · {p.mediaCount}{" "}
          photos/videos
        </small>
      </div>
      <div className="admin-row-actions">
        <button
          className="admin-btn admin-btn-small"
          disabled={busy || first}
          aria-label="Move up"
          onClick={() => run(() => adminMoveProject({ data: { id: p.id, direction: "up" } }))}
        >
          <ArrowUp size={16} />
        </button>
        <button
          className="admin-btn admin-btn-small"
          disabled={busy || last}
          aria-label="Move down"
          onClick={() => run(() => adminMoveProject({ data: { id: p.id, direction: "down" } }))}
        >
          <ArrowDown size={16} />
        </button>
        <button
          className="admin-btn admin-btn-small"
          disabled={busy}
          title={p.featured ? "On the home page — click to remove" : "Feature on the home page"}
          aria-label="Feature on home page"
          onClick={() =>
            run(() =>
              adminSetProjectFlag({ data: { id: p.id, flag: "featured", value: !p.featured } }),
            )
          }
        >
          <Star
            size={16}
            fill={p.featured ? "currentColor" : "none"}
            color={p.featured ? "#d62828" : undefined}
          />
        </button>
        <button
          className="admin-btn admin-btn-small"
          disabled={busy}
          onClick={() =>
            run(() =>
              adminSetProjectFlag({ data: { id: p.id, flag: "published", value: !p.published } }),
            )
          }
        >
          {p.published ? "Unpublish" : "Publish"}
        </button>
        <Link
          to="/admin/projects/$id"
          params={{ id: String(p.id) }}
          className="admin-btn admin-btn-small"
        >
          <Pencil size={16} /> Edit
        </Link>
        {p.published && (
          <a
            href={`/projects/${p.slug}`}
            target="_blank"
            rel="noreferrer"
            className="admin-btn admin-btn-small"
            aria-label="View on website"
          >
            <ExternalLink size={16} />
          </a>
        )}
        <button
          className="admin-btn admin-btn-small admin-btn-danger"
          disabled={busy}
          aria-label="Delete"
          onClick={() =>
            confirm(`Delete “${p.title}” and all its photos and videos? This cannot be undone.`) &&
            run(() => adminDeleteProject({ data: p.id }))
          }
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
