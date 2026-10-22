import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText, prepareImage } from "@/components/admin/prepare-image";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { adminGetSettings, adminSaveSettings, adminUploadSettingImage } from "@/data/admin";
import { checkAuth } from "@/data/auth";
import { statsFrom, type Stat } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/company")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return adminGetSettings();
  },
  head: () => adminSeo("Company & CEO"),
  component: CompanyAdmin,
});

function CompanyAdmin() {
  const { settings } = Route.useLoaderData();
  return (
    <AdminShell
      title="Company & CEO"
      description="The words on the home and About pages: the big hero heading, who you are, mission, vision, the CEO's message and the numbers band."
    >
      <StatsEditor raw={settings.stats} />
      <CeoPhoto url={settings.ceo_photo} />
      <SettingsForm
        settings={settings}
        groups={[
          {
            title: "Home page hero",
            description: "The last word of each heading line is shown in red.",
            fields: [
              { key: "hero_eyebrow", label: "Small line above the heading" },
              { key: "hero_title_1", label: "Heading — line 1" },
              { key: "hero_title_2", label: "Heading — line 2" },
              { key: "hero_text", label: "Text under the heading", rows: 3 },
            ],
          },
          {
            title: "Who we are",
            fields: [
              { key: "company_name", label: "Company name" },
              { key: "legal_name", label: "Registered / trading name" },
              { key: "tagline", label: "Tagline" },
              { key: "founded_year", label: "Year founded", help: "Leave empty to hide it." },
              { key: "about_short", label: "Short introduction (home page)", rows: 4 },
              {
                key: "about_long",
                label: "Full company profile (About page)",
                rows: 10,
                help: "Leave an empty line between paragraphs.",
              },
              { key: "brand_promise", label: "Brand promise (big quote)", rows: 2 },
            ],
          },
          {
            title: "Mission & vision",
            fields: [
              { key: "mission", label: "Mission", rows: 3 },
              { key: "vision", label: "Vision", rows: 3 },
            ],
          },
          {
            title: "CEO",
            description: "Shown on the About and Team pages.",
            fields: [
              { key: "ceo_name", label: "Name" },
              { key: "ceo_role", label: "Title" },
              { key: "ceo_bio", label: "Biography", rows: 4 },
              { key: "ceo_quote", label: "Message / quote", rows: 3 },
              { key: "ceo_credentials", label: "Achievements — one per line", rows: 4 },
            ],
          },
        ]}
      />
    </AdminShell>
  );
}

function StatsEditor({ raw }: { raw: string }) {
  const router = useRouter();
  const [stats, setStats] = useState<Stat[]>(() => statsFrom(raw));
  const [state, setState] = useState({ busy: false, error: "", saved: false });
  const update = (i: number, k: keyof Stat, v: string) =>
    setStats((s) => s.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  async function save() {
    setState({ busy: true, error: "", saved: false });
    try {
      const clean = stats.filter((s) => s.value.trim() && s.label.trim());
      await adminSaveSettings({ data: { stats: JSON.stringify(clean) } });
      await router.invalidate();
      setState({ busy: false, error: "", saved: true });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: false });
    }
  }

  return (
    <AdminCard
      title="Numbers band"
      description="The big counting numbers on the home, About and Awards pages. Four looks best."
    >
      <div className="admin-form">
        {stats.map((s, i) => (
          <div key={i} className="admin-actions" style={{ alignItems: "end" }}>
            <div className="admin-field" style={{ width: 110 }}>
              <span>Number</span>
              <input
                value={s.value}
                onChange={(e) => update(i, "value", e.target.value)}
                placeholder="120"
              />
            </div>
            <div className="admin-field" style={{ width: 80 }}>
              <span>After</span>
              <input
                value={s.suffix}
                onChange={(e) => update(i, "suffix", e.target.value)}
                placeholder="+"
              />
            </div>
            <div className="admin-field" style={{ flex: 1, minWidth: 180 }}>
              <span>Label</span>
              <input
                value={s.label}
                onChange={(e) => update(i, "label", e.target.value)}
                placeholder="Projects Delivered"
              />
            </div>
            <button
              className="admin-btn admin-btn-small admin-btn-danger"
              aria-label="Remove"
              onClick={() => setStats((x) => x.filter((_, j) => j !== i))}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <div className="admin-actions">
          {stats.length < 6 && (
            <button
              className="admin-btn admin-btn-small"
              onClick={() => setStats((x) => [...x, { value: "", suffix: "+", label: "" }])}
            >
              <Plus size={16} /> Add number
            </button>
          )}
          <button
            className="admin-btn admin-btn-primary admin-btn-small"
            onClick={save}
            disabled={state.busy}
          >
            {state.busy ? "Saving…" : "Save numbers"}
          </button>
          {state.saved && <span className="admin-success">Saved.</span>}
          {state.error && <span className="admin-error">{state.error}</span>}
        </div>
      </div>
    </AdminCard>
  );
}

function CeoPhoto({ url }: { url: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState({ busy: false, error: "" });
  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setState({ busy: true, error: "" });
    try {
      const form = new FormData();
      form.append("file", (await prepareImage(file)).file);
      form.append("key", "ceo_photo");
      await adminUploadSettingImage({ data: form });
      await router.invalidate();
      setState({ busy: false, error: "" });
    } catch (err) {
      setState({ busy: false, error: errorText(err) });
    }
    if (input.current) input.current.value = "";
  }
  return (
    <AdminCard title="CEO photo" description="A portrait (taller than wide) works best.">
      <div className="admin-image-field">
        {url && <img src={url} alt="CEO" style={{ width: 120, height: 150 }} />}
        <label className="admin-btn admin-btn-small">
          {state.busy ? "Uploading…" : url ? "Replace photo" : "Upload photo"}
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFile}
            disabled={state.busy}
            className="sr-only"
          />
        </label>
      </div>
      {state.error && <p className="admin-error">{state.error}</p>}
    </AdminCard>
  );
}
