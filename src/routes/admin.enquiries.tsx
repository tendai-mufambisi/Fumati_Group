import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { useState } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import {
  adminDeleteEnquiry,
  adminListEnquiries,
  adminSetEnquiryStatus,
  ENQUIRY_STATUSES,
  type EnquiryRecord,
} from "@/data/admin";
import { checkAuth } from "@/data/auth";
import { whatsappUrl } from "@/data/site-data";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/enquiries")({
  loader: async () => {
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return { enquiries: await adminListEnquiries() };
  },
  head: () => adminSeo("Quote requests"),
  component: Enquiries,
});

function Enquiries() {
  const { enquiries } = Route.useLoaderData();
  const [filter, setFilter] = useState<string>("All");
  const shown = filter === "All" ? enquiries : enquiries.filter((e) => e.status === filter);
  return (
    <AdminShell
      title="Quote requests"
      description="Every request sent from the Contact page. Reply on WhatsApp, call or email, then update the status to keep track."
    >
      <div className="admin-filters">
        {["All", ...ENQUIRY_STATUSES].map((s) => (
          <button
            key={s}
            className="admin-chip"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
          >
            {s} ({s === "All" ? enquiries.length : enquiries.filter((e) => e.status === s).length})
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <AdminCard>
          <p className="admin-muted">No requests here yet.</p>
        </AdminCard>
      ) : (
        shown.map((e) => <EnquiryCard key={e.id} e={e} />)
      )}
    </AdminShell>
  );
}

function EnquiryCard({ e }: { e: EnquiryRecord }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      await router.invalidate();
    } catch (err) {
      alert(errorText(err));
    }
    setBusy(false);
  }
  const reply = `Hi ${e.name.split(" ")[0]}, thank you for contacting Fumati Engineers about ${e.service || "your project"}.`;
  return (
    <AdminCard
      title={e.name}
      description={`${new Date(e.created_at.replace(" ", "T") + "Z").toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`}
      actions={
        <>
          <select
            className="admin-chip"
            value={e.status}
            disabled={busy}
            onChange={(ev) =>
              run(() => adminSetEnquiryStatus({ data: { id: e.id, status: ev.target.value } }))
            }
            aria-label="Status"
          >
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            className="admin-btn admin-btn-small admin-btn-danger"
            disabled={busy}
            aria-label="Delete"
            onClick={() =>
              confirm(`Delete the request from ${e.name}?`) &&
              run(() => adminDeleteEnquiry({ data: e.id }))
            }
          >
            <Trash2 size={16} />
          </button>
        </>
      }
    >
      <dl className="admin-enquiry-meta">
        {[
          ["Phone", e.phone],
          ["Email", e.email],
          ["Service", e.service],
          ["Location", e.location],
          ["Budget", e.budget],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      <p className="admin-enquiry-message">{e.message}</p>
      <div className="admin-actions" style={{ marginTop: 16 }}>
        <a
          className="admin-btn admin-btn-small admin-btn-green"
          href={whatsappUrl(
            e.phone.startsWith("0") ? `263${e.phone.replace(/\D/g, "").slice(1)}` : e.phone,
            reply,
          )}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
        <a className="admin-btn admin-btn-small" href={`tel:${e.phone.replace(/[^\d+]/g, "")}`}>
          <Phone size={16} /> Call
        </a>
        {e.email && (
          <a
            className="admin-btn admin-btn-small"
            href={`mailto:${e.email}?subject=${encodeURIComponent("Your quote request — Fumati Engineers")}&body=${encodeURIComponent(reply)}`}
          >
            <Mail size={16} /> Email
          </a>
        )}
      </div>
    </AdminCard>
  );
}
