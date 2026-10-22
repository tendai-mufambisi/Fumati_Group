import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  Building,
  FolderOpen,
  Images,
  Inbox,
  MessageSquareQuote,
  Plus,
  Settings,
  ToggleRight,
  Users,
} from "lucide-react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { adminOverview } from "@/data/admin";
import { checkAuth } from "@/data/auth";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return adminOverview();
  },
  head: () => adminSeo("Dashboard"),
  component: Dashboard,
});

function Dashboard() {
  const o = Route.useLoaderData();
  return (
    <AdminShell
      title="Dashboard"
      description="Everything you change here shows on the website the moment you save. No developer or redeploy needed."
    >
      <div className="admin-stats">
        <Link to="/admin/enquiries" className="admin-stat">
          <Inbox aria-hidden="true" />
          <strong>{o.newEnquiries}</strong>
          <span>New quote requests ({o.enquiries} in total)</span>
        </Link>
        <Link to="/admin/projects" className="admin-stat">
          <FolderOpen aria-hidden="true" />
          <strong>{o.published}</strong>
          <span>Projects live ({o.projects - o.published} drafts)</span>
        </Link>
        <Link
          to="/admin/content/$collection"
          params={{ collection: "testimonials" }}
          className="admin-stat"
        >
          <MessageSquareQuote aria-hidden="true" />
          <strong>{o.testimonials}</strong>
          <span>
            {o.testimonials === 0
              ? "Testimonials — section hidden until you add one"
              : "Testimonials on the site"}
          </span>
        </Link>
        <Link
          to="/admin/content/$collection"
          params={{ collection: "team" }}
          className="admin-stat"
        >
          <Users aria-hidden="true" />
          <strong>{o.team}</strong>
          <span>Team members shown</span>
        </Link>
        <Link
          to="/admin/content/$collection"
          params={{ collection: "clients" }}
          className="admin-stat"
        >
          <Building aria-hidden="true" />
          <strong>{o.clients}</strong>
          <span>Brands & clients shown</span>
        </Link>
      </div>

      <div className="admin-two-col">
        <AdminCard
          title="Latest quote requests"
          actions={
            <Link to="/admin/enquiries" className="admin-btn admin-btn-small">
              All requests
            </Link>
          }
        >
          {o.latest.length === 0 ? (
            <p className="admin-muted">
              No requests yet. They appear here when someone sends the quote form on the Contact
              page.
            </p>
          ) : (
            <ul className="admin-list">
              {o.latest.map((e) => (
                <li key={e.id}>
                  <div className="admin-list-text">
                    <strong>{e.name}</strong>
                    <small>
                      {[e.service, e.phone, e.created_at.slice(0, 10)].filter(Boolean).join(" · ")}
                    </small>
                  </div>
                  <span className="admin-pill" data-status={e.status}>
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Quick actions">
          <div className="admin-quick">
            <Link
              to="/admin/projects/$id"
              params={{ id: "new" }}
              className="admin-btn admin-btn-primary"
            >
              <Plus size={17} aria-hidden="true" /> Add a project
            </Link>
            <Link
              to="/admin/content/$collection"
              params={{ collection: "testimonials" }}
              className="admin-btn"
            >
              <MessageSquareQuote size={17} aria-hidden="true" /> Add a testimonial or letter
            </Link>
            <Link
              to="/admin/content/$collection"
              params={{ collection: "team" }}
              className="admin-btn"
            >
              <Users size={17} aria-hidden="true" /> Add a team member
            </Link>
            <Link
              to="/admin/content/$collection"
              params={{ collection: "clients" }}
              className="admin-btn"
            >
              <Building size={17} aria-hidden="true" /> Add a brand logo
            </Link>
            <Link
              to="/admin/content/$collection"
              params={{ collection: "hero_slides" }}
              className="admin-btn"
            >
              <Images size={17} aria-hidden="true" /> Change hero photos
            </Link>
            <Link to="/admin/sections" className="admin-btn">
              <ToggleRight size={17} aria-hidden="true" /> Show / hide sections
            </Link>
            <Link to="/admin/settings" className="admin-btn">
              <Settings size={17} aria-hidden="true" /> Phones, email, SEO & password
            </Link>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
