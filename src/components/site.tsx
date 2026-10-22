import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Building2,
  ChevronRight,
  Church,
  Clock,
  Cog,
  Factory,
  Flag,
  Gem,
  Hammer,
  Handshake,
  HardHat,
  Heart,
  Home,
  Landmark,
  Leaf,
  LifeBuoy,
  Lightbulb,
  MessageCircle,
  Phone,
  Pickaxe,
  Ruler,
  ShieldCheck,
  Target,
  Tractor,
  Trophy,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { useContact } from "@/components/site/use-site-data";
import { responsiveSrcSet, SITE_URL } from "@/data/site-data";
import { cn } from "@/lib/utils";

/* ---------- images ---------- */

/** A photo with an on-brand placeholder when the file is missing or still to be uploaded. */
export function Img({
  src,
  alt,
  className,
  eager,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  label,
}: {
  src: string | undefined;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
  label?: string | undefined;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "relative grid place-items-center overflow-hidden bg-green-900 blueprint",
          className,
        )}
      >
        <svg
          viewBox="0 0 200 100"
          className="absolute inset-0 h-full w-full opacity-25"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 90 L200 90 M0 90 L25 40 L50 90 L75 40 L100 90 L125 40 L150 90 L175 40 L200 90 M25 40 L175 40"
            fill="none"
            stroke="currentColor"
            strokeWidth=".6"
            className="text-primary-foreground"
          />
        </svg>
        <LogoMark className="relative h-10 w-10 text-primary-foreground/30" />
        {label && (
          <span className="absolute bottom-3 px-3 text-center text-[10px] uppercase tracking-widest text-primary-foreground/50">
            {label}
          </span>
        )}
      </div>
    );
  }
  const srcSet = responsiveSrcSet(src);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

/**
 * A full-bleed background photo that drifts slower than the page as you scroll.
 * One passive listener, work batched into requestAnimationFrame, transforms written
 * straight to the element, and it only runs while on screen. Below 768px or with
 * reduced motion it is a plain still photo.
 */
export function ParallaxBg({
  src,
  speed = 0.25,
  position = "50% 50%",
  className = "",
  overlay = "bg-green-900/75",
}: {
  src: string;
  speed?: number;
  position?: string;
  className?: string;
  overlay?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const motion = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    let visible = false;
    let limit = 0;

    // Oversize the image by the furthest it can drift while the section is on screen.
    const measure = () => {
      if (!motion.matches) {
        img.style.top = "0";
        img.style.height = "100%";
        img.style.transform = "";
        limit = 0;
        return;
      }
      const h = wrap.offsetHeight;
      limit = Math.ceil(((window.innerHeight + h) / 2) * speed) + 2;
      img.style.top = `${-limit}px`;
      img.style.height = `${h + limit * 2}px`;
    };
    const update = () => {
      frame = 0;
      if (!limit) return;
      const rect = wrap.getBoundingClientRect();
      const fromCentre = rect.top + rect.height / 2 - window.innerHeight / 2;
      const y = Math.max(-limit, Math.min(limit, -fromCentre * speed));
      img.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (visible && limit && !frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      onScroll();
    });
    io.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    motion.addEventListener("change", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      motion.removeEventListener("change", onResize);
      cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <img
        ref={imgRef}
        src={src}
        srcSet={responsiveSrcSet(src)}
        sizes="100vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-x-0 top-0 h-full w-full object-cover md:will-change-transform"
        style={{ objectPosition: position }}
      />
      <div className={cn("absolute inset-0", overlay)} />
    </div>
  );
}

/* ---------- motion ---------- */

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e?.isIntersecting && (setInView(true), io.disconnect()),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={cn("reveal", inView && "in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export function Counter({ to, suffix = "" }: { to: string; suffix?: string }) {
  const target = Number(to.replace(/[^\d.]/g, ""));
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target)) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(target);
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1800);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  // Server render and no-JS show the real number; the count-up only starts in view.
  return (
    <span ref={ref}>
      {n === null || !Number.isFinite(target) ? to : n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------- brand ---------- */

/** The slanted F, traced from the Fumati logo. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="360 267 288 278" className={className} aria-hidden>
      <path
        d="M385 267H648L628 332H360Z M440 357H637L617 422H418Z M440 438H517L487 545H412Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      className={cn("flex shrink-0 items-center gap-2.5", className)}
      aria-label="Fumati Engineers — home"
    >
      <LogoMark className={cn("h-10 w-10", light ? "text-primary-foreground" : "text-green-700")} />
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[1.4rem] font-extrabold italic tracking-tight",
            light ? "text-primary-foreground" : "text-green-700",
          )}
        >
          FUMATI
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[7.5px] font-bold tracking-[0.24em]",
            light ? "text-primary-foreground/75" : "text-red-700",
          )}
        >
          TURNING STEEL INTO GOLD
        </span>
      </span>
    </Link>
  );
}

const ICONS: Record<string, LucideIcon> = {
  Award,
  ShieldCheck,
  HardHat,
  Wrench,
  Users,
  Clock,
  LifeBuoy,
  Gem,
  Handshake,
  Lightbulb,
  Target,
  Flag,
  Factory,
  Building2,
  Pickaxe,
  Tractor,
  Landmark,
  Church,
  Home,
  Truck,
  Zap,
  Cog,
  Ruler,
  Hammer,
  Trophy,
  Leaf,
  Heart,
};
export function Icon({ name, className }: { name: string | undefined; className?: string }) {
  const C = ICONS[name ?? ""] ?? Cog;
  return <C className={className} aria-hidden />;
}

/* ---------- layout pieces ---------- */

export function SectionHead({
  eyebrow,
  title,
  text,
  light,
  center,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  light?: boolean;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", center && "mx-auto text-center", className)}>
      <p
        className={cn(
          "eyebrow flex items-center gap-3",
          light ? "text-red-400" : "text-red-600",
          center && "justify-center",
        )}
      >
        <span className="h-px w-8 bg-current" /> {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 text-3xl font-extrabold leading-[1.05] sm:text-5xl",
          light ? "text-primary-foreground" : "text-green-700",
        )}
      >
        {title}
      </h2>
      {text && (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            light ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      )}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  crumb,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  image: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-green-900 clip-cut">
      <ParallaxBg src={image} speed={0.35} overlay="bg-hero-overlay" />
      <div className="absolute inset-0 blueprint opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-40 sm:pb-36 sm:pt-48">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-primary-foreground/70 fade-in-up"
        >
          <Link to="/" className="hover:text-primary-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary-foreground">{crumb}</span>
        </nav>
        <p
          className="eyebrow mt-8 flex items-center gap-3 text-primary-foreground/85 fade-in-up"
          style={{ animationDelay: ".1s" }}
        >
          <span className="h-px w-10 bg-red-600" /> {eyebrow}
        </p>
        <h1
          className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.02] text-primary-foreground fade-in-up sm:text-7xl"
          style={{ animationDelay: ".2s" }}
        >
          {title}
        </h1>
        {text && (
          <p
            className="mt-6 max-w-2xl text-lg text-primary-foreground/80 fade-in-up"
            style={{ animationDelay: ".3s" }}
          >
            {text}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function CtaBanner({
  image = "/images/steel-frame-structure-harare.webp",
}: {
  image?: string;
}) {
  const c = useContact();
  return (
    <section className="relative isolate overflow-hidden bg-green-900">
      <ParallaxBg src={image} speed={0.3} overlay="bg-green-900/85" />
      <div className="absolute inset-0 blueprint" />
      <div className="absolute -right-20 top-0 h-full w-40 -skew-x-[18deg] bg-red-600 sm:right-24" />
      <div className="absolute -right-40 top-0 h-full w-10 -skew-x-[18deg] bg-red-600/60 sm:right-4" />
      <div className="relative mx-auto max-w-7xl px-5 py-28">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-primary-foreground/70">Start a project</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-primary-foreground sm:text-6xl">
            Have a project in mind? <span className="text-red-500">Let's forge it</span> together.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/75">
            Send us your drawings or an idea — we usually reply within 24 hours with next steps and
            a site visit.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contact" className="btn btn-red">
              Get a Free Quote
            </Link>
            <a
              href={c.whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-white"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            {c.primaryPhone && (
              <a href={c.primaryPhone.href} className="btn btn-outline-white">
                <Phone className="h-4 w-4" /> {c.primaryPhone.display}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Per-page title, description, canonical URL and social cards. */
export function pageHead(
  title: string,
  description: string,
  path: string,
  image = "/og-image.jpg",
) {
  const t = path === "/" ? title : `${title} | Fumati Engineers`;
  const url = `${SITE_URL}${path}`;
  const img = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: img },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: t },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: img },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
