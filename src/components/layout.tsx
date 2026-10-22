import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowUp,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
  Youtube,
  type LucideIcon,
} from "lucide-react";

import { useCollection, useContact, useSiteData } from "@/components/site/use-site-data";
import { Logo, LogoMark } from "@/components/site";
import { AGENCY } from "@/data/site-data";
import { cn } from "@/lib/utils";

const ALL_NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/team", label: "Team", section: "page_team" },
  { to: "/awards", label: "Awards", section: "page_awards" },
  { to: "/contact", label: "Contact" },
] as const;

function useNav() {
  const { sections } = useSiteData();
  return ALL_NAV.filter((n) => !("section" in n) || sections[n.section]);
}

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNav();
  const c = useContact();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={cn(
          "hidden bg-green-900 text-xs text-primary-foreground/80 transition-all duration-300 lg:block",
          scrolled && "-mt-9",
        )}
      >
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-5">
            {c.phones.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="flex items-center gap-1.5 hover:text-primary-foreground"
              >
                <Phone className="h-3 w-3" />
                {p.display}
              </a>
            ))}
            <a
              href={`mailto:${c.email}`}
              className="flex items-center gap-1.5 hover:text-primary-foreground"
            >
              <Mail className="h-3 w-3" />
              {c.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {c.address.replace(", Zimbabwe", "")}
            </span>
            {c.socials.map((s) => {
              const I = SOCIAL_ICONS[s.name];
              return I ? (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="hover:text-primary-foreground"
                >
                  <I className="h-3.5 w-3.5" />
                </a>
              ) : null;
            })}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "transition-all duration-300",
          scrolled ? "bg-background/95 shadow-card backdrop-blur" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5">
          <Logo light={!scrolled} />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {nav.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "relative py-2 font-display text-[13px] font-bold uppercase tracking-wider transition-colors",
                    scrolled
                      ? "text-green-700 hover:text-red-600"
                      : "text-primary-foreground/90 hover:text-primary-foreground",
                  )}
                >
                  {n.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-red-600 transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/contact" className="btn btn-red magnetic hidden !py-3 sm:inline-flex">
              Get a Quote
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-md lg:hidden",
                scrolled ? "text-green-700" : "text-primary-foreground",
              )}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-green-900 blueprint transition-transform duration-500 lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="absolute -right-16 top-0 h-full w-24 -skew-x-[18deg] bg-red-600/90" />
        <div className="relative flex h-20 items-center justify-between px-5">
          <Logo light />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center text-primary-foreground"
          >
            <X className="h-7 w-7" />
          </button>
        </div>
        <nav className="relative flex flex-1 flex-col justify-center gap-1 px-8">
          {nav.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              tabIndex={open ? 0 : -1}
              className={cn(
                "font-display text-4xl font-extrabold text-primary-foreground transition-all duration-500 hover:text-red-500",
                open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0",
              )}
              style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="relative grid grid-cols-2 gap-3 p-5">
          {c.primaryPhone && (
            <a href={c.primaryPhone.href} className="btn btn-outline-white">
              <Phone className="h-4 w-4" />
              Call
            </a>
          )}
          <a href={c.whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-red">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const nav = useNav();
  const services = useCollection("services");
  const c = useContact();
  const { settings: s } = useSiteData();
  return (
    <footer className="relative overflow-hidden bg-green-900 text-primary-foreground/75">
      <div className="absolute inset-0 blueprint opacity-50" />
      <LogoMark className="pointer-events-none absolute -bottom-24 -right-16 h-[28rem] w-[28rem] text-primary-foreground/[0.04]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-6 text-sm leading-relaxed">
            {s.legal_name}. Multi-award-winning structural, mechanical and steel fabrication
            engineers — proudly building Zimbabwe from Waterfalls, Harare.
          </p>
          <div className="mt-6 flex gap-2">
            {c.socials.map((x) => {
              const I = SOCIAL_ICONS[x.name];
              return (
                <a
                  key={x.name}
                  href={x.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={x.name}
                  className="grid h-10 w-10 place-items-center rounded-md border border-primary-foreground/15 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-primary-foreground"
                >
                  {I ? (
                    <I className="h-4 w-4" />
                  ) : (
                    <span className="text-[10px] font-bold">{x.name.slice(0, 2)}</span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="eyebrow text-primary-foreground">Company</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-slide hover:text-primary-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
            {s.company_profile_pdf && (
              <li>
                <a
                  href={s.company_profile_pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="link-slide hover:text-primary-foreground"
                >
                  Company Profile (PDF)
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow text-primary-foreground">Services</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {services.map((x) => (
              <li key={x.id}>
                <Link
                  to="/services"
                  hash={`service-${x.id}`}
                  className="link-slide hover:text-primary-foreground"
                >
                  {x.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow text-primary-foreground">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {c.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="flex items-center gap-2 hover:text-primary-foreground">
                  <Phone className="h-3.5 w-3.5 text-red-500" />
                  {p.display}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${c.email}`}
                className="flex items-center gap-2 break-all hover:text-primary-foreground"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-red-500" />
                {c.email}
              </a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
              <span>{c.address}</span>
            </li>
            {c.shop && (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                <span>Hardware shop: {c.shop}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs sm:flex-row">
          <span>
            © {new Date().getFullYear()} {s.company_name}. All rights reserved.
            <Link
              to="/admin/login"
              className="ml-1 opacity-40 hover:opacity-100"
              aria-label="Staff sign in"
            >
              ·
            </Link>
          </span>
          <span className="eyebrow !text-[10px]">
            Turning Steel Into <span className="text-red-500">Gold</span>
          </span>
          <span>
            Website by{" "}
            <a
              href={AGENCY.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-primary-foreground hover:text-red-400"
            >
              {AGENCY.name}
            </a>
            {" · "}
            <a
              href={AGENCY.url}
              target="_blank"
              rel="noopener"
              className="hover:text-primary-foreground"
            >
              {AGENCY.label}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function FloatingActions() {
  const c = useContact();
  const { sections } = useSiteData();
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full bg-background text-green-700 shadow-card transition-all",
          showTop ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
      {sections.whatsapp_button && (
        <a
          href={c.whatsappLink()}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="pulse-ring grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-card transition-transform hover:scale-105"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      )}
    </div>
  );
}

const SEEN_KEY = "fumati_loader_seen";
const TAGLINE = "Turning Steel Into Gold";

/**
 * The opening sequence, once per tab: the three bars of the F slide in like beams
 * being lifted into place, FUMATI rises, the tagline types out, a red weld line
 * runs across, and the screen splits along the slant of the F to reveal the site.
 * Purely decorative — the page renders underneath the whole time.
 */
export function Loader() {
  const { sections } = useSiteData();
  const [phase, setPhase] = useState<"off" | "on" | "leaving">("off");
  const [typed, setTyped] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!sections.loader) return;
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      seen = false;
    }
    if (seen) return;
    setPhase("on");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
    if (reduced) {
      setTyped(TAGLINE);
      t(() => setPhase("leaving"), 500);
      t(() => setPhase("off"), 900);
    } else {
      for (let i = 1; i <= TAGLINE.length; i++)
        t(() => setTyped(TAGLINE.slice(0, i)), 1050 + i * 38);
      const end = 1050 + TAGLINE.length * 38 + 450;
      t(() => setPhase("leaving"), end);
      t(() => setPhase("off"), end + 950);
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [sections.loader]);

  if (phase === "off") return null;
  const leaving = phase === "leaving";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      <div className={cn("loader-panel loader-panel-a", leaving && "out")} />
      <div className={cn("loader-panel loader-panel-b", leaving && "out")} />
      <div className={cn("loader-panel loader-panel-c", leaving && "out")} />
      <div
        className={cn(
          "absolute inset-0 grid place-items-center transition-opacity duration-300",
          leaving && "opacity-0",
        )}
      >
        <div className="flex flex-col items-center">
          <svg
            viewBox="360 267 288 278"
            className="h-24 w-24 text-primary-foreground sm:h-28 sm:w-28"
          >
            <path
              className="loader-beam"
              style={{ animationDelay: "0ms" }}
              d="M385 267H648L628 332H360Z"
              fill="currentColor"
            />
            <path
              className="loader-beam"
              style={{ animationDelay: "160ms" }}
              d="M440 357H637L617 422H418Z"
              fill="currentColor"
            />
            <path
              className="loader-beam loader-beam-red"
              style={{ animationDelay: "320ms" }}
              d="M440 438H517L487 545H412Z"
              fill="currentColor"
            />
          </svg>
          <p className="mt-6 flex overflow-hidden font-display text-4xl font-extrabold italic tracking-tight text-primary-foreground sm:text-5xl">
            {"FUMATI".split("").map((ch, i) => (
              <span
                key={i}
                className="loader-letter"
                style={{ animationDelay: `${520 + i * 60}ms` }}
              >
                {ch}
              </span>
            ))}
          </p>
          <p className="mt-3 h-5 font-display text-xs font-bold uppercase tracking-[0.32em] text-primary-foreground/80 sm:text-sm">
            {typed}
            <span className="loader-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-red-500" />
          </p>
          <div className="mt-7 h-[3px] w-56 overflow-hidden rounded-full bg-primary-foreground/10">
            <div className="loader-weld h-full bg-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Diagonal green/red wipe on route change, echoing the slanted F. */
export function RouteWipe() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!window.location.hash) window.scrollTo({ top: 0 });
    setKey((k) => k + 1);
  }, [path]);
  if (!key) return null;
  return (
    <div key={key} className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden>
      <div className="route-wipe absolute inset-y-0 -left-1/4 w-[150%] bg-green-700">
        <div className="absolute inset-y-0 right-0 w-6 bg-red-600" />
      </div>
    </div>
  );
}
