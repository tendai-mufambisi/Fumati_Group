import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { company, waLink } from "@/data/company";
import { services } from "@/data/services";
import { Logo, LogoMark } from "@/components/site";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/team", label: "Team" },
  { to: "/awards", label: "Awards" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  const solid = scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className={cn("hidden bg-green-900 text-xs text-primary-foreground/80 transition-all lg:block", scrolled && "-mt-9")}>
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-5">
            {company.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className="flex items-center gap-1.5 hover:text-primary-foreground"><Phone className="h-3 w-3" />{p.display}</a>
            ))}
            <a href={`mailto:${company.email}`} className="flex items-center gap-1.5 hover:text-primary-foreground"><Mail className="h-3 w-3" />{company.email}</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{company.shortAddress}</span>
            <a href={company.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-primary-foreground"><Facebook className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </div>
      <div className={cn("transition-all duration-300", solid ? "bg-background shadow-card" : "bg-transparent")}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5">
          <Logo light={!solid} />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {nav.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={cn("relative py-2 font-display text-[13px] font-bold uppercase tracking-wider transition-colors", solid ? "text-green-700 hover:text-green-500" : "text-primary-foreground/90 hover:text-primary-foreground")}>
                  {n.label}
                  <span className={cn("absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-red-600 transition-transform", active ? "scale-x-100" : "scale-x-0")} />
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/contact" className="btn btn-red hidden !py-3 sm:inline-flex">Get a Quote</Link>
            <button onClick={() => setOpen(true)} aria-label="Open menu" className={cn("grid h-11 w-11 place-items-center rounded-md lg:hidden", solid ? "text-green-700" : "text-primary-foreground")}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className={cn("fixed inset-0 z-50 flex flex-col bg-green-900 blueprint transition-transform duration-500 lg:hidden", open ? "translate-x-0" : "translate-x-full")} aria-hidden={!open}>
        <div className="flex h-20 items-center justify-between px-5">
          <Logo light />
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center text-primary-foreground"><X className="h-7 w-7" /></button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
          {nav.map((n, i) => (
            <Link key={n.to} to={n.to} tabIndex={open ? 0 : -1} className="font-display text-4xl font-extrabold text-primary-foreground hover:text-red-600" style={{ transitionDelay: `${i * 40}ms` }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="grid grid-cols-2 gap-3 p-5">
          <a href={`tel:${company.phones[2]!.tel}`} className="btn btn-outline-white"><Phone className="h-4 w-4" />Call</a>
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-red"><MessageCircle className="h-4 w-4" />WhatsApp</a>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-green-900 text-primary-foreground/75">
      <div className="absolute inset-0 blueprint opacity-50" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-6 text-sm leading-relaxed">Multi-award-winning structural, mechanical and steel fabrication engineers. Proudly building Zimbabwe from Waterfalls, Harare.</p>
          <a href={company.facebook} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm hover:text-primary-foreground"><Facebook className="h-4 w-4" />Fumatiengineering</a>
        </div>
        <div>
          <h3 className="eyebrow text-primary-foreground">Company</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-primary-foreground">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow text-primary-foreground">Services</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {services.map((s) => <li key={s.id}><Link to="/services" hash={s.id} className="hover:text-primary-foreground">{s.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow text-primary-foreground">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {company.phones.map((p) => <li key={p.tel}><a href={`tel:${p.tel}`} className="hover:text-primary-foreground">{p.display}</a></li>)}
            <li><a href={`mailto:${company.email}`} className="break-all hover:text-primary-foreground">{company.email}</a></li>
            <li>{company.address}</li>
            <li>Hardware shop: {company.shop}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-6 text-xs">
          <span>© {new Date().getFullYear()} Fumati Engineers. All rights reserved.</span>
          <span className="eyebrow !text-[10px]">Turning Steel Into <span className="text-red-600">Gold</span></span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="pulse-ring fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-green-500 text-primary-foreground shadow-card transition-transform hover:scale-105">
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

export function Loader() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("fumati-loaded")) return;
    sessionStorage.setItem("fumati-loaded", "1");
    setShow(true);
    const a = setTimeout(() => setLeaving(true), 1300);
    const b = setTimeout(() => setShow(false), 1700);
    return () => (clearTimeout(a), clearTimeout(b));
  }, []);
  if (!show) return null;
  return (
    <div className={cn("fixed inset-0 z-[100] grid place-items-center bg-green-900 transition-opacity duration-400", leaving && "opacity-0")} aria-hidden>
      <div className="flex flex-col items-center">
        <LogoMark className="h-20 w-20 text-primary-foreground fade-in-up" />
        <p className="eyebrow mt-6 text-primary-foreground/80 fade-in-up" style={{ animationDelay: "300ms" }}>Turning Steel Into Gold</p>
        <div className="mt-6 h-0.5 w-48 bg-primary-foreground/10"><div className="loader-bar h-full bg-red-600" /></div>
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
    if (first.current) { first.current = false; return; }
    window.scrollTo({ top: 0 });
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
