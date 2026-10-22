import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import { SettingsForm } from "@/components/admin/SettingsForm";
import {
  adminGetSettings,
  adminRemoveCompanyProfile,
  adminUploadCompanyProfile,
} from "@/data/admin";
import { changeAdminPassword, checkAuth } from "@/data/auth";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/settings")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return adminGetSettings();
  },
  head: () => adminSeo("Settings"),
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const { settings } = Route.useLoaderData();
  return (
    <AdminShell
      title="Contacts, SEO & password"
      description="Phone numbers, email, addresses and social links appear in the header, footer, contact page and Google listing."
    >
      <SettingsForm
        settings={settings}
        groups={[
          {
            title: "Contact details",
            fields: [
              { key: "phone1", label: "Phone 1", placeholder: "+263 8644 271 926" },
              { key: "phone2", label: "Phone 2" },
              { key: "phone3", label: "Phone 3 (main call button)" },
              {
                key: "whatsapp",
                label: "WhatsApp number",
                help: "With country code, e.g. 263771960330. All WhatsApp buttons use this.",
              },
              { key: "email", label: "Email" },
              { key: "address", label: "Head office address" },
              { key: "shop_address", label: "Hardware shop address", help: "Leave empty to hide." },
              {
                key: "map_query",
                label: "Map location",
                help: "What to search on Google Maps for the contact page map.",
              },
              {
                key: "hours",
                label: "Business hours — one per line as Days|Times",
                rows: 4,
                placeholder: "Mon – Fri|08:00 – 17:00",
              },
            ],
          },
          {
            title: "Social media",
            description: "Paste full links. Empty ones are hidden.",
            fields: [
              { key: "facebook", label: "Facebook", placeholder: "https://www.facebook.com/…" },
              { key: "instagram", label: "Instagram" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "youtube", label: "YouTube" },
              { key: "tiktok", label: "TikTok" },
            ],
          },
          {
            title: "Search engines (SEO)",
            description:
              "How Fumati appears on Google and when links are shared on WhatsApp/Facebook.",
            fields: [
              { key: "seo_title", label: "Default page title", help: "About 50–60 characters." },
              {
                key: "seo_description",
                label: "Default description",
                rows: 3,
                help: "About 150–160 characters.",
              },
              { key: "seo_keywords", label: "Keywords", rows: 3 },
              {
                key: "google_verification",
                label: "Google Search Console verification code",
                help: "Only the code from the meta tag Google gives you.",
              },
            ],
          },
        ]}
      />
      <CompanyProfile url={settings.company_profile_pdf} />
      <PasswordCard />
    </AdminShell>
  );
}

function CompanyProfile({ url }: { url: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState({ busy: false, error: "" });
  async function run(action: () => Promise<unknown>) {
    setState({ busy: true, error: "" });
    try {
      await action();
      await router.invalidate();
      setState({ busy: false, error: "" });
    } catch (e) {
      setState({ busy: false, error: errorText(e) });
    }
  }
  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    await run(() => adminUploadCompanyProfile({ data: form }));
    if (input.current) input.current.value = "";
  }
  return (
    <AdminCard
      title="Company profile PDF"
      description="Adds a “Download Company Profile” button on the About page and in the footer. Up to 25 MB."
    >
      <div className="admin-actions">
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="admin-btn admin-btn-small">
            <FileText size={16} /> View current PDF
          </a>
        )}
        <label className="admin-btn admin-btn-small admin-btn-primary">
          {state.busy ? "Uploading…" : url ? "Replace PDF" : "Upload PDF"}
          <input
            ref={input}
            type="file"
            accept="application/pdf"
            onChange={onFile}
            disabled={state.busy}
            className="sr-only"
          />
        </label>
        {url && (
          <button
            className="admin-btn admin-btn-small admin-btn-danger"
            disabled={state.busy}
            onClick={() =>
              confirm("Remove the company profile?") && run(() => adminRemoveCompanyProfile())
            }
          >
            Remove
          </button>
        )}
      </div>
      {state.error && <p className="admin-error">{state.error}</p>}
    </AdminCard>
  );
}

function PasswordCard() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [state, setState] = useState({ busy: false, error: "", saved: false });
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.next !== form.confirm)
      return setState({ busy: false, error: "The new passwords don't match.", saved: false });
    setState({ busy: true, error: "", saved: false });
    try {
      const res = await changeAdminPassword({ data: { current: form.current, next: form.next } });
      if (!res.ok)
        return setState({
          busy: false,
          error: res.error ?? "Could not change the password.",
          saved: false,
        });
      setForm({ current: "", next: "", confirm: "" });
      setState({ busy: false, error: "", saved: true });
    } catch (err) {
      setState({ busy: false, error: errorText(err), saved: false });
    }
  }
  return (
    <AdminCard
      title="Change password"
      description="Please change the first-login password to one only you know. At least 8 characters."
    >
      <form className="admin-form" onSubmit={onSubmit} style={{ maxWidth: 420 }}>
        <label className="admin-field">
          <span>Current password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>New password</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.next}
            onChange={(e) => setForm({ ...form, next: e.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>Repeat new password</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </label>
        {state.error && <p className="admin-error">{state.error}</p>}
        {state.saved && <p className="admin-success">Password changed.</p>}
        <button className="admin-btn admin-btn-primary" disabled={state.busy}>
          {state.busy ? "Saving…" : "Change password"}
        </button>
      </form>
    </AdminCard>
  );
}
