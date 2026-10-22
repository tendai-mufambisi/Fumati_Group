import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, Building2, CalendarDays, ChevronDown } from "lucide-react";

import { useCollection, useSiteData } from "@/components/site/use-site-data";
import { responsiveSrcSet } from "@/data/site-data";
import { cn } from "@/lib/utils";

const SLIDE_MS = 6500;
const TRUSS =
  "M0 300 L1200 300 M0 300 L600 60 L1200 300 M100 300 L100 260 M200 300 L200 220 M300 300 L300 180 M400 300 L400 140 M500 300 L500 100 M600 300 L600 60 M700 300 L700 100 M800 300 L800 140 M900 300 L900 180 M1000 300 L1000 220 M1100 300 L1100 260 M100 260 L200 300 M200 220 L300 300 M300 180 L400 300 M400 140 L500 300 M500 100 L600 300 M700 100 L600 300 M800 140 L700 300 M900 180 L800 300 M1000 220 L900 300 M1100 260 L1000 300";

/**
 * Signature hero: real Fumati photos cross-fade with a slow Ken Burns drift and lag
 * behind the page on scroll (parallax), a roof truss draws itself across the top,
 * and the cursor throws welding sparks.
 */
export function HomeHero() {
  const { settings: s, stats } = useSiteData();
  const slides = useCollection("hero_slides");
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastSpark = useRef(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % slides.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [slides.length, active]);

  // Parallax: the photo layer moves at 40% of scroll speed, the copy lifts and fades.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const h = sectionRef.current?.offsetHeight ?? 800;
      if (y > h) return;
      if (layerRef.current) layerRef.current.style.transform = `translate3d(0, ${y * 0.4}px, 0)`;
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
        contentRef.current.style.opacity = String(Math.max(0, 1 - y / (h * 0.8)));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const onMove = (e: MouseEvent) => {
    const el = sectionRef.current;
    const now = performance.now();
    if (
      !el ||
      now - lastSpark.current < 35 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    lastSpark.current = now;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      const sp = document.createElement("span");
      sp.className = "spark";
      sp.style.left = `${e.clientX - r.left}px`;
      sp.style.top = `${e.clientY - r.top}px`;
      sp.style.setProperty("--dx", `${(Math.random() - 0.5) * 70}px`);
      sp.style.setProperty("--dy", `${Math.random() * 60 + 10}px`);
      el.appendChild(sp);
      window.setTimeout(() => sp.remove(), 700);
    }
  };

  const yearsStat = stats.find((x) => /year/i.test(x.label));
  const projectsStat = stats.find((x) => /project/i.test(x.label));

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative isolate min-h-[100svh] overflow-hidden bg-green-900 clip-cut"
    >
      <div ref={layerRef} className="absolute inset-x-0 -top-[5%] h-[115%] will-change-transform">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1600ms] ease-in-out",
              i === active ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={i !== active}
          >
            <img
              src={slide.image}
              srcSet={responsiveSrcSet(slide.image ?? "")}
              sizes="100vw"
              alt={slide.caption || "Fumati Engineers project"}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              decoding="async"
              className={cn(
                "h-full w-full object-cover",
                i === active && (i % 2 ? "kenburns-b" : "kenburns-a"),
              )}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-transparent to-green-900/40" />
      <div className="absolute inset-0 blueprint opacity-60" />
      <svg
        viewBox="0 0 1200 320"
        className="pointer-events-none absolute inset-x-0 top-[16%] w-full text-primary-foreground/20"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <path
          d={TRUSS}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="truss-line"
        />
      </svg>

      <div
        ref={contentRef}
        className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-32 pt-36 will-change-transform sm:pb-40"
      >
        <p
          className="eyebrow flex items-center gap-3 text-primary-foreground/85 fade-in-up"
          style={{ animationDelay: ".3s" }}
        >
          <span className="h-px w-10 bg-red-600" /> {s.hero_eyebrow}
        </p>
        <h1 className="mt-6 font-display text-[13vw] font-extrabold uppercase leading-[0.9] tracking-tighter text-primary-foreground sm:text-[5.5rem] lg:text-[7.25rem] xl:text-[8.25rem]">
          <span className="sr-only">
            Fumati Engineers — structural engineering, mechanical engineering and steel fabrication
            in Harare, Zimbabwe.{" "}
          </span>
          <HeroLine text={s.hero_title_1} delay={0.5} />
          <HeroLine text={s.hero_title_2} delay={0.7} />
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p
            className="max-w-xl text-lg text-primary-foreground/80 fade-in-up"
            style={{ animationDelay: ".9s" }}
          >
            {s.hero_text}
          </p>
          <div className="flex flex-wrap gap-3 fade-in-up" style={{ animationDelay: "1.1s" }}>
            <Link to="/projects" className="btn btn-red magnetic">
              View Our Projects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn btn-outline-white">
              Get a Free Quote
            </Link>
          </div>
        </div>
        <div
          className="mt-12 flex flex-col gap-6 border-t border-primary-foreground/15 pt-6 fade-in-up lg:flex-row lg:items-center lg:justify-between"
          style={{ animationDelay: "1.3s" }}
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-primary-foreground/85">
            <li className="flex items-center gap-2">
              <Award className="h-4 w-4 text-red-500" />
              Company of the Year — Engineering
            </li>
            {projectsStat && (
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-red-500" />
                {projectsStat.value}
                {projectsStat.suffix} Projects
              </li>
            )}
            {s.founded_year ? (
              <li className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-red-500" />
                Since {s.founded_year}
              </li>
            ) : yearsStat ? (
              <li className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-red-500" />
                {yearsStat.value}
                {yearsStat.suffix} Years
              </li>
            ) : null}
          </ul>
          {slides.length > 1 && (
            <div className="flex items-center gap-4">
              <p
                key={active}
                className="hidden max-w-[16rem] truncate text-xs text-primary-foreground/70 fade-in-up sm:block"
              >
                {slides[active]?.caption}
              </p>
              <div className="flex gap-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    onClick={() => setActive(i)}
                    aria-label={`Show photo ${i + 1}`}
                    className="group relative h-1 w-10 overflow-hidden rounded-full bg-primary-foreground/25"
                  >
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 bg-red-600",
                        i === active ? "hero-progress" : i < active ? "w-full" : "w-0",
                      )}
                      style={{ animationDuration: `${SLIDE_MS}ms` }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <a
        href="#numbers"
        aria-label="Scroll down"
        className="absolute bottom-[5vw] left-1/2 hidden -translate-x-1/2 text-primary-foreground/60 hover:text-primary-foreground md:block"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}

/** Highlights the last word of a hero line in red, e.g. "Turning Steel" → Steel. */
function HeroLine({ text, delay }: { text: string; delay: number }) {
  const words = text.trim().split(/\s+/);
  const last = words.pop() ?? "";
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span className="hero-rise block" style={{ animationDelay: `${delay}s` }}>
        {words.join(" ")} <span className="text-red-600">{last}</span>
      </span>
    </span>
  );
}
