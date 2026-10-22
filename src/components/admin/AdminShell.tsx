import { Link, useRouter } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  Building,
  CalendarClock,
  ExternalLink,
  FolderOpen,
  HelpCircle,
  Images,
  Inbox,
  Layers,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  MessageSquareQuote,
  Settings,
  Sparkles,
  ToggleRight,
  Users,
  Factory,
  Gem,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { LogoMark } from "@/components/site";
import { logout } from "@/data/auth";
import type { CollectionKey } from "@/data/collections";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  params?: { collection: CollectionKey };
};

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/admin/enquiries", label: "Quote requests", icon: Inbox },
    ],
  },
  {
    label: "Website content",
    items: [
      { to: "/admin/projects", label: "Projects", icon: FolderOpen },
      {
        to: "/admin/content/$collection",
        params: { collection: "hero_slides" },
        label: "Hero slideshow",
        icon: Images,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "services" },
        label: "Services",
        icon: Briefcase,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "team" },
        label: "Team",
        icon: Users,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "testimonials" },
        label: "Testimonials",
        icon: MessageSquareQuote,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "clients" },
        label: "Brands & clients",
        icon: Building,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "awards" },
        label: "Awards",
        icon: Award,
      },
      { to: "/admin/company", label: "Company & CEO", icon: Sparkles },
      {
        to: "/admin/content/$collection",
        params: { collection: "core_values" },
        label: "Core values",
        icon: Gem,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "why_us" },
        label: "Why choose us",
        icon: Layers,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "timeline" },
        label: "Our journey",
        icon: CalendarClock,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "industries" },
        label: "Industries",
        icon: Factory,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "process_steps" },
        label: "Our process",
        icon: ListOrdered,
      },
      {
        to: "/admin/content/$collection",
        params: { collection: "faqs" },
        label: "FAQs",
        icon: HelpCircle,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      { to: "/admin/sections", label: "Show / hide sections", icon: ToggleRight },
      { to: "/admin/settings", label: "Contacts, SEO & password", icon: Settings },
    ],
  },
];

export function AdminLogo() {
  return (
    <span className="admin-logo">
      <LogoMark className="h-10 w-10 text-primary-foreground" />
      <span>
        <strong>FUMATI</strong>
        <small>Engineers · Dashboard</small>
      </span>
    </span>
  );
}

export function AdminCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string | undefined;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`admin-card ${className ?? ""}`}>
      {(title || actions) && (
        <header className="admin-card-head">
          <div>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {actions && <div className="admin-actions">{actions}</div>}
        </header>
      )}
      <div className="admin-card-body">{children}</div>
    </section>
  );
}

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string | undefined;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  async function signOut() {
    await logout();
    await router.navigate({ to: "/admin/login" });
  }
  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-side-head">
          <Link to="/admin">
            <AdminLogo />
          </Link>
        </div>
        <nav className="admin-nav" aria-label="Dashboard">
          {groups.map((g) => (
            <div key={g.label} className="admin-nav-group">
              <p className="admin-label">{g.label}</p>
              {g.items.map(({ to, label, icon: Icon, exact, params }) => (
                <Link
                  key={label}
                  to={to}
                  params={params ?? {}}
                  activeOptions={{ exact: !!exact }}
                  className="admin-nav-link"
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-side-foot">
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-link">
            <ExternalLink size={17} aria-hidden="true" />
            View website
          </a>
          <button type="button" onClick={signOut} className="admin-nav-link">
            <LogOut size={17} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-page-head">
          <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          {actions && <div className="admin-actions">{actions}</div>}
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
