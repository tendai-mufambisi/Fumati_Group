import { useEffect, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, X } from "lucide-react";
import { coverOf, type Project } from "@/data/projects";
import { clients, testimonials } from "@/data/people";
import { Img } from "@/components/site";
import { cn } from "@/lib/utils";

export function ProjectCard({ p, className, tall }: { p: Project; className?: string; tall?: boolean }) {
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  };
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: p.slug }}
      onMouseMove={onMove}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
      className={cn("group relative block overflow-hidden rounded-md bg-green-900 shadow-card transition-transform duration-200", className)}
    >
      <div className={cn("overflow-hidden", tall ? "aspect-[3/4]" : "aspect-[4/3]")}>
        <Img name={coverOf(p)} alt={p.title} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-green-900/30 to-transparent" />
      <div className="absolute inset-0 grid place-items-center bg-green-700/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="eyebrow flex items-center gap-2 text-primary-foreground">View Project <ArrowUpRight className="h-4 w-4" /></span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="eyebrow rounded-sm bg-red-600 px-2 py-1 !text-[10px] text-primary-foreground">{p.category}</span>
        <h3 className="mt-3 text-xl font-extrabold text-primary-foreground">{p.title}</h3>
        {p.location && <p className="text-sm text-primary-foreground/70">{p.location}</p>}
      </div>
    </Link>
  );
}

export function ClientMarquee() {
  const row = [...clients, ...clients, ...clients, ...clients];
  return (
    <div className="overflow-hidden border-y py-8">
      <div className="marquee flex w-max gap-14">
        {row.map((c, i) => (
          <span key={i} className="whitespace-nowrap font-display text-xl font-extrabold uppercase tracking-tight text-muted-foreground/50 transition-colors hover:text-green-700">
            {c.logo ? <Img name={c.logo} alt={c.name} className="h-10 w-auto grayscale hover:grayscale-0" /> : c.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Testimonials({ light }: { light?: boolean }) {
  const [i, setI] = useState(0);
  const t = testimonials[i]!;
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Quote className="mx-auto h-10 w-10 text-red-600" />
      <blockquote key={i} className={cn("mt-6 font-display text-2xl font-bold leading-snug fade-in-up sm:text-3xl", light ? "text-primary-foreground" : "text-green-700")}>"{t.quote}"</blockquote>
      <p className={cn("mt-6 text-sm", light ? "text-primary-foreground/70" : "text-muted-foreground")}>{t.name} · {t.org}</p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button aria-label="Previous testimonial" onClick={() => setI((i - 1 + testimonials.length) % testimonials.length)} className="grid h-10 w-10 place-items-center rounded-md border text-green-700 hover:bg-green-50"><ChevronLeft className="h-4 w-4" /></button>
        {testimonials.map((_, k) => <span key={k} className={cn("h-1 rounded-full transition-all", k === i ? "w-8 bg-red-600" : "w-3 bg-border")} />)}
        <button aria-label="Next testimonial" onClick={() => setI((i + 1) % testimonials.length)} className="grid h-10 w-10 place-items-center rounded-md border text-green-700 hover:bg-green-50"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function Lightbox({ images, index, onClose, onIndex }: { images: { name: string; alt: string }[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  useEffect(() => {
    if (index === null) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [index, images.length, onClose, onIndex]);
  const [touch, setTouch] = useState<number | null>(null);
  if (index === null) return null;
  const img = images[index]!;
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-[80] flex items-center justify-center bg-green-900/95 p-4" onClick={onClose}
      onTouchStart={(e) => setTouch(e.touches[0]!.clientX)}
      onTouchEnd={(e) => {
        if (touch === null) return;
        const dx = e.changedTouches[0]!.clientX - touch;
        if (Math.abs(dx) > 50) onIndex((index + (dx < 0 ? 1 : -1) + images.length) % images.length);
        setTouch(null);
      }}>
      <button aria-label="Close" className="absolute right-4 top-4 text-primary-foreground"><X className="h-8 w-8" /></button>
      {images.length > 1 && (
        <>
          <button aria-label="Previous image" onClick={(e) => (e.stopPropagation(), onIndex((index - 1 + images.length) % images.length))} className="absolute left-3 hidden h-12 w-12 place-items-center rounded-md bg-primary-foreground/10 text-primary-foreground sm:grid"><ChevronLeft /></button>
          <button aria-label="Next image" onClick={(e) => (e.stopPropagation(), onIndex((index + 1) % images.length))} className="absolute right-3 hidden h-12 w-12 place-items-center rounded-md bg-primary-foreground/10 text-primary-foreground sm:grid"><ChevronRight /></button>
        </>
      )}
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-5xl">
        <Img name={img.name} alt={img.alt} className="aspect-[16/10] w-full rounded-md object-contain" />
        <p className="mt-3 text-center text-sm text-primary-foreground/70">{img.alt} · {index + 1}/{images.length}</p>
      </div>
    </div>
  );
}
