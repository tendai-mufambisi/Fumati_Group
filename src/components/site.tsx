import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, MessageCircle, Phone } from "lucide-react";
import { company, waLink } from "@/data/company";
import { cn } from "@/lib/utils";

/** Image from public/images with an on-brand placeholder when the file is missing. */
export function Img({ name, alt, className, eager }: { name: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={cn("relative grid place-items-center overflow-hidden bg-green-900 blueprint", className)}>
        <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full opacity-25" preserveAspectRatio="none" aria-hidden>
          <path d="M0 90 L200 90 M0 90 L25 40 L50 90 L75 40 L100 90 L125 40 L150 90 L175 40 L200 90 M25 40 L175 40" fill="none" stroke="currentColor" strokeWidth=".6" className="text-primary-foreground" />
        </svg>
        <span className="relative px-3 text-center font-mono text-[10px] tracking-wider text-primary-foreground/60">{name}</span>
      </div>
    );
  }
  return (
    <img
      src={`/images/${encodeURIComponent(name)}`}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (setInView(true), io.disconnect()), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", inView && "in", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(to);
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1600);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M10 6 H44 L40 15 H19 L17 20 H36 L32 29 H14 L8 44 H0 Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Fumati Engineers home">
      <LogoMark className={cn("h-9 w-9", light ? "text-primary-foreground" : "text-green-700")} />
      <span className="leading-none">
        <span className={cn("block font-display text-xl font-extrabold tracking-tight", light ? "text-primary-foreground" : "text-green-700")}>FUMATI</span>
        <span className={cn("block text-[8px] font-semibold tracking-[0.22em]", light ? "text-primary-foreground/70" : "text-muted-foreground")}>TURNING STEEL INTO GOLD</span>
      </span>
    </Link>
  );
}

export function SectionHead({ eyebrow, title, text, light, center }: { eyebrow: string; title: ReactNode; text?: string; light?: boolean; center?: boolean }) {
  return (
    <Reveal className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p className={cn("eyebrow flex items-center gap-3 text-red-600", center && "justify-center")}>
        <span className="h-px w-8 bg-red-600" /> {eyebrow}
      </p>
      <h2 className={cn("mt-4 text-3xl font-extrabold leading-[1.05] sm:text-5xl", light ? "text-primary-foreground" : "text-green-700")}>{title}</h2>
      {text && <p className={cn("mt-5 text-lg", light ? "text-primary-foreground/75" : "text-muted-foreground")}>{text}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, text, image, crumb }: { eyebrow: string; title: ReactNode; text?: string; image: string; crumb: string }) {
  return (
    <section className="relative overflow-hidden bg-green-900 clip-cut">
      <Img name={image} alt="" eager className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="absolute inset-0 blueprint opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-40 sm:pb-36 sm:pt-48">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-primary-foreground/70">
          <Link to="/" className="hover:text-primary-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary-foreground">{crumb}</span>
        </nav>
        <p className="eyebrow mt-8 text-primary-foreground/80 fade-in-up">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.02] text-primary-foreground fade-in-up sm:text-7xl">{title}</h1>
        {text && <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80 fade-in-up">{text}</p>}
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-green-900">
      <div className="absolute inset-0 blueprint" />
      <div className="absolute -right-20 top-0 h-full w-40 -skew-x-[18deg] bg-red-600 sm:right-24" />
      <div className="absolute -right-40 top-0 h-full w-10 -skew-x-[18deg] bg-red-600/60 sm:right-4" />
      <div className="relative mx-auto max-w-7xl px-5 py-24">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-primary-foreground/70">Start a project</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-primary-foreground sm:text-6xl">
            Have a project in mind? <span className="text-red-600">Let's forge it</span> together.
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contact" className="btn btn-red">Get a Quote</Link>
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-outline-white"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            <a href={`tel:${company.phones[2]!.tel}`} className="btn btn-outline-white"><Phone className="h-4 w-4" /> Call us</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function pageHead(title: string, description: string) {
  const t = `${title} | Fumati Engineers`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
