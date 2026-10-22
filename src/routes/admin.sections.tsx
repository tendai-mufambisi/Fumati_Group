import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import { adminGetSettings, adminSaveSections } from "@/data/admin";
import { checkAuth } from "@/data/auth";
import { SECTIONS } from "@/data/collections";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/sections")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return adminGetSettings();
  },
  head: () => adminSeo("Show / hide sections"),
  component: SectionsAdmin,
});

function SectionsAdmin() {
  const { sections } = Route.useLoaderData();
  const router = useRouter();
  const [values, setValues] = useState<Record<string, boolean>>(sections);
  const [state, setState] = useState({ busy: false, error: "", saved: false });
  const pages = [...new Set(SECTIONS.map((s) => s.page))];
  const dirty = SECTIONS.some((s) => values[s.key] !== sections[s.key]);

  async function save() {
    setState({ busy: true, error: "", saved: false });
    try {
      await adminSaveSections({ data: values });
      await router.invalidate();
      setState({ busy: false, error: "", saved: true });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: false });
    }
  }

  return (
    <AdminShell
      title="Show / hide sections"
      description="Switch any part of the website off — nothing is deleted, so you can switch it back on at any time. Sections with no content (for example Testimonials before you add one) hide themselves automatically."
    >
      <div className="admin-grid-2" style={{ alignItems: "start" }}>
        {pages.map((page) => (
          <AdminCard key={page} title={page}>
            <div className="admin-switch-list">
              {SECTIONS.filter((s) => s.page === page).map((s) => (
                <label key={s.key} className="admin-switch">
                  <span>{s.label}</span>
                  <input
                    type="checkbox"
                    checked={!!values[s.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.checked }))}
                  />
                </label>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>
      <div className="admin-sticky-save">
        <button
          className="admin-btn admin-btn-primary"
          onClick={save}
          disabled={state.busy || !dirty}
        >
          {state.busy ? "Saving…" : "Save changes"}
        </button>
        {state.saved && !dirty && (
          <span className="admin-success">Saved — the website is updated.</span>
        )}
        {state.error && <span className="admin-error">{state.error}</span>}
      </div>
    </AdminShell>
  );
}
