import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Linkedin,
  Mail,
  Medal,
  Play,
  Plus,
  Quote,
  Star,
  X,
} from "lucide-react";

import { Counter, Img, LogoMark, ParallaxBg, Reveal } from "@/components/site";
import { useCollection, useSiteData } from "@/components/site/use-site-data";
import type { ItemOf } from "@/data/collections";
import { embedThumb, type ProjectMedia, type ProjectSummary } from "@/data/site-data";
import { cn } from "@/lib/utils";

/* ---------- projects ---------- */

export function ProjectCard({
  p,
  className,
  tall,
  priority,
}: {
  p: ProjectSummary;
  className?: string;
  tall?: boolean;
  priority?: boolean;
}) {
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: p.slug }}
      onMouseMove={onMove}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
      className={cn(
        "group relative block h-full min-h-[18rem] overflow-hidden rounded-md bg-green-900 shadow-card transition-transform duration-200",
        className,
      )}
    >
      <div className={cn("h-full overflow-hidden", tall ? "aspect-[3/4]" : "aspect-[4/3]")}>
        <Img
          src={p.cover}
          alt={p.coverAlt}
          eager={!!priority}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="h-full w-full transition-transform duration-700 group-hover:scale-110"
          label={p.cover ? undefined : "Photos coming soon"}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-green-900/30 to-transparent" />
      <div className="absolute inset-0 grid place-items-center bg-green-700/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="eyebrow flex items-center gap-2 text-primary-foreground">
          View Project <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex flex-wrap gap-2">
          <span className="eyebrow rounded-sm bg-red-600 px-2 py-1 !text-[10px] text-primary-foreground">
            {p.category}
          </span>
          {p.status !== "Completed" && (
            <span className="eyebrow rounded-sm bg-primary-foreground/15 px-2 py-1 !text-[10px] text-primary-foreground backdrop-blur">
              {p.status}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-xl font-extrabold text-primary-foreground">{p.title}</h3>
        {p.location && <p className="text-sm text-primary-foreground/70">{p.location}</p>}
      </div>
      {p.mediaCount > 1 && (
        <span className="absolute right-3 top-3 rounded-sm bg-green-900/70 px-2 py-1 text-[11px] font-semibold text-primary-foreground backdrop-blur">
          {p.mediaCount} photos
        </span>
      )}
    </Link>
  );
}

/* ---------- numbers band ---------- */

export function StatsBand({
  image = "/images/fumati-site-team-blockwork.webp",
}: {
  image?: string;
}) {
  const { stats } = useSiteData();
  return (
    <section id="numbers" className="relative isolate overflow-hidden bg-green-900 py-20">
      <ParallaxBg src={image} speed={0.3} overlay="bg-green-900/88" />
      <div className="absolute inset-0 blueprint opacity-60" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-md bg-primary-foreground/10 lg:grid-cols-4">
        {stats.map((st, i) => (
          <Reveal
            key={st.label}
            delay={i * 90}
            className="bg-green-900/60 p-8 backdrop-blur-sm sm:p-10"
          >
            <p className="font-display text-5xl font-extrabold text-primary-foreground sm:text-7xl">
              <Counter to={st.value} suffix={st.suffix} />
            </p>
            <p className="eyebrow mt-3 text-red-400">{st.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- brands ---------- */

function ClientMark({ c, large }: { c: ItemOf<"clients">; large?: boolean }) {
  const inner = c.logo ? (
    <img
      src={c.logo}
      alt={c.name}
      loading="lazy"
      className={cn(
        "w-auto object-contain grayscale transition duration-300 group-hover:grayscale-0",
        large ? "h-14 max-w-[10rem]" : "h-10 max-w-[8rem]",
      )}
    />
  ) : (
    <span
      className={cn(
        "flex items-center gap-2 whitespace-nowrap font-display font-extrabold uppercase tracking-tight text-green-700/50 transition-colors group-hover:text-green-700",
        large ? "text-lg" : "text-xl",
      )}
    >
      <LogoMark className="h-4 w-4 text-red-600/60" /> {c.name}
    </span>
  );
  return c.url ? (
    <a href={c.url} target="_blank" rel="noopener nofollow" className="group" title={c.name}>
      {inner}
    </a>
  ) : (
    <span className="group" title={c.name}>
      {inner}
    </span>
  );
}

/** Infinite marquee once there are enough brands; a tidy centred row before that. */
export function ClientsStrip() {
  const clients = useCollection("clients");
  if (clients.length === 0) return null;
  if (clients.length < 5) {
    return (
      <div className="border-y py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-16 gap-y-6 px-5">
          {clients.map((c) => (
            <ClientMark key={c.id} c={c} />
          ))}
        </div>
      </div>
    );
  }
  const row = [...clients, ...clients];
  return (
    <div className="marquee-mask overflow-hidden border-y py-10">
      <div className="marquee flex w-max items-center gap-16 pr-16">
        {row.map((c, i) => (
          <ClientMark key={`${c.id}-${i}`} c={c} />
        ))}
      </div>
    </div>
  );
}

export function ClientWall() {
  const clients = useCollection("clients");
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3 lg:grid-cols-4">
      {clients.map((c, i) => (
        <Reveal
          key={c.id}
          delay={(i % 4) * 60}
          className="grid min-h-[9rem] place-items-center bg-background p-6 text-center"
        >
          <ClientMark c={c} large />
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- testimonials ---------- */

export function Testimonials({ light }: { light?: boolean }) {
  const items = useCollection("testimonials");
  const [i, setI] = useState(0);
  const [letter, setLetter] = useState<number | null>(null);
  useEffect(() => {
    if (items.length < 2 || letter !== null) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % items.length), 8000);
    return () => window.clearInterval(id);
  }, [items.length, letter, i]);
  if (items.length === 0) return null;
  const t = items[Math.min(i, items.length - 1)]!;
  const isLetter = t.photo_kind === "letter" && t.photo;
  const letters = items.filter((x) => x.photo_kind === "letter" && x.photo);

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_auto]">
      <div key={t.id} className="fade-in-up">
        <Quote className={cn("h-12 w-12", light ? "text-red-500" : "text-red-600")} />
        {t.rating && (
          <div className="mt-4 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: Number(t.rating) }, (_, k) => (
              <Star key={k} className="h-4 w-4 fill-red-600 text-red-600" />
            ))}
          </div>
        )}
        <blockquote
          className={cn(
            "mt-5 font-display text-2xl font-bold leading-snug sm:text-3xl",
            light ? "text-primary-foreground" : "text-green-700",
          )}
        >
          “{t.quote}”
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          {t.photo && t.photo_kind !== "letter" && (
            <img
              src={t.photo}
              alt={t.name}
              loading="lazy"
              className={cn(
                "h-14 w-14 border-2 border-red-600 bg-background",
                t.photo_kind === "logo"
                  ? "rounded-md object-contain p-1"
                  : "rounded-full object-cover",
              )}
            />
          )}
          <div>
            <p
              className={cn(
                "font-display font-extrabold",
                light ? "text-primary-foreground" : "text-green-700",
              )}
            >
              {t.name}
            </p>
            <p
              className={cn(
                "text-sm",
                light ? "text-primary-foreground/70" : "text-muted-foreground",
              )}
            >
              {[t.role, t.org].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
        {items.length > 1 && (
          <div className="mt-10 flex items-center gap-3">
            <button
              aria-label="Previous testimonial"
              onClick={() => setI((i - 1 + items.length) % items.length)}
              className="grid h-11 w-11 place-items-center rounded-md border text-green-700 hover:bg-green-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {items.map((_, k) => (
              <button
                key={k}
                aria-label={`Testimonial ${k + 1}`}
                onClick={() => setI(k)}
                className={cn(
                  "h-1 rounded-full transition-all",
                  k === i ? "w-8 bg-red-600" : "w-3 bg-border",
                )}
              />
            ))}
            <button
              aria-label="Next testimonial"
              onClick={() => setI((i + 1) % items.length)}
              className="grid h-11 w-11 place-items-center rounded-md border text-green-700 hover:bg-green-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {isLetter && (
        <button
          onClick={() => setLetter(letters.findIndex((x) => x.id === t.id))}
          className="group relative mx-auto w-64 rotate-2 rounded-sm bg-background p-3 shadow-card transition-transform hover:rotate-0 hover:scale-105"
          aria-label={`Open the recommendation letter from ${t.name}`}
        >
          <img
            src={t.photo}
            alt={`Recommendation letter from ${t.name}`}
            loading="lazy"
            className="aspect-[3/4] w-full object-cover object-top"
          />
          <span className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 bg-green-900/85 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            <FileText className="h-4 w-4" /> Read the letter
          </span>
        </button>
      )}
      <Lightbox
        items={letters.map((x) => ({
          id: x.id,
          kind: "image",
          url: x.photo,
          alt: `Recommendation letter from ${x.name}${x.org ? `, ${x.org}` : ""}`,
        }))}
        index={letter}
        onClose={() => setLetter(null)}
        onIndex={setLetter}
        contain
      />
    </div>
  );
}

/** Recommendation letters as a wall of documents, for the Awards page. */
export function LetterWall() {
  const letters = useCollection("testimonials").filter((x) => x.photo_kind === "letter" && x.photo);
  const [open, setOpen] = useState<number | null>(null);
  if (letters.length === 0) return null;
  return (
    <>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {letters.map((l, i) => (
          <Reveal key={l.id} delay={i * 60}>
            <button
              onClick={() => setOpen(i)}
              className="group block w-full rounded-sm bg-background p-2 text-left shadow-card transition-transform hover:-translate-y-1"
            >
              <img
                src={l.photo}
                alt={`Recommendation letter from ${l.name}`}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover object-top"
              />
              <p className="mt-2 px-1 text-sm font-bold text-green-700">{l.org || l.name}</p>
            </button>
          </Reveal>
        ))}
      </div>
      <Lightbox
        items={letters.map((x) => ({
          id: x.id,
          kind: "image",
          url: x.photo,
          alt: `Recommendation letter from ${x.name}`,
        }))}
        index={open}
        onClose={() => setOpen(null)}
        onIndex={setOpen}
        contain
      />
    </>
  );
}

/* ---------- lightbox: photos, uploaded videos and video links ---------- */

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
  contain,
}: {
  items: ProjectMedia[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  contain?: boolean;
}) {
  const go = useCallback(
    (d: number) => index !== null && onIndex((index + d + items.length) % items.length),
    [index, items.length, onIndex],
  );
  useEffect(() => {
    if (index === null) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", on);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", on);
      document.body.style.overflow = "";
    };
  }, [index, go, onClose]);
  const [touch, setTouch] = useState<number | null>(null);
  if (index === null || !items[index]) return null;
  const m = items[index]!;
  return (
    <div
      role="dialog"
      aria-modal
      aria-label={m.alt}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-green-900/95 p-4 backdrop-blur"
      onClick={onClose}
      onTouchStart={(e) => setTouch(e.touches[0]!.clientX)}
      onTouchEnd={(e) => {
        if (touch === null) return;
        const dx = e.changedTouches[0]!.clientX - touch;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        setTouch(null);
      }}
    >
      <button
        aria-label="Close"
        className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center text-primary-foreground"
      >
        <X className="h-8 w-8" />
      </button>
      {items.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={(e) => (e.stopPropagation(), go(-1))}
            className="absolute left-3 z-10 hidden h-12 w-12 place-items-center rounded-md bg-primary-foreground/10 text-primary-foreground hover:bg-red-600 sm:grid"
          >
            <ChevronLeft />
          </button>
          <button
            aria-label="Next"
            onClick={(e) => (e.stopPropagation(), go(1))}
            className="absolute right-3 z-10 hidden h-12 w-12 place-items-center rounded-md bg-primary-foreground/10 text-primary-foreground hover:bg-red-600 sm:grid"
          >
            <ChevronRight />
          </button>
        </>
      )}
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-5xl">
        <div key={m.id} className="fade-in-up">
          {m.kind === "image" && (
            <img
              src={m.url}
              alt={m.alt}
              className={cn(
                "mx-auto max-h-[80vh] w-auto rounded-md",
                contain ? "bg-background object-contain" : "object-contain",
              )}
            />
          )}
          {m.kind === "video" && (
            <video
              src={m.url}
              controls
              autoPlay
              playsInline
              className="mx-auto max-h-[80vh] w-full rounded-md bg-black"
            />
          )}
          {m.kind === "embed" && (
            <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
              <iframe
                src={m.url}
                title={m.alt || "Project video"}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-sm text-primary-foreground/70">
          {m.alt}
          {items.length > 1 && ` · ${index + 1}/${items.length}`}
        </p>
      </div>
    </div>
  );
}

/** Gallery tile for any media kind. */
export function MediaTile({
  m,
  onOpen,
  className,
}: {
  m: ProjectMedia;
  onOpen: () => void;
  className?: string;
}) {
  const thumb = m.kind === "image" ? m.url : m.kind === "embed" ? embedThumb(m.url) : null;
  return (
    <button
      onClick={onOpen}
      className={cn(
        "group relative block w-full overflow-hidden rounded-md bg-green-900",
        className,
      )}
      aria-label={`Open ${m.kind === "image" ? "photo" : "video"}: ${m.alt}`}
    >
      {m.kind === "video" ? (
        <video
          src={`${m.url}#t=0.5`}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <Img
          src={thumb ?? undefined}
          alt={m.alt}
          sizes="(min-width: 768px) 33vw, 50vw"
          className="h-full w-full transition-transform duration-700 group-hover:scale-110"
        />
      )}
      <span className="absolute inset-0 bg-green-900/0 transition-colors group-hover:bg-green-900/40" />
      {m.kind !== "image" ? (
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-red-600 text-primary-foreground shadow-card transition-transform group-hover:scale-110">
            <Play className="ml-1 h-7 w-7 fill-current" />
          </span>
        </span>
      ) : (
        <Plus className="absolute right-3 top-3 h-6 w-6 text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  );
}

/* ---------- awards ---------- */

export function AwardCard({ a, onOpen }: { a: ItemOf<"awards">; onOpen?: () => void }) {
  return (
    <div className="group grid overflow-hidden rounded-md border bg-background transition-shadow hover:shadow-card sm:grid-cols-[220px_1fr]">
      <button onClick={onOpen} className="relative overflow-hidden" aria-label={`View ${a.title}`}>
        <Img
          src={a.image}
          alt={`${a.title} — ${a.organisation}`}
          className="aspect-square h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
      </button>
      <div className="p-7">
        <Medal className="h-7 w-7 text-red-600" />
        <h3 className="mt-4 text-xl font-extrabold text-green-700">{a.title}</h3>
        {a.recipient && <p className="text-sm font-semibold">{a.recipient}</p>}
        <p className="mt-1 text-sm text-muted-foreground">
          {[a.organisation, a.year].filter(Boolean).join(" · ")}
        </p>
        {a.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
        )}
      </div>
    </div>
  );
}

/**
 * The lead award, shown whole (certificates are portrait and must not be cropped),
 * with the details set large beside it. The first award in the dashboard list is the one shown.
 */
export function FeaturedAward({ a, onOpen }: { a: ItemOf<"awards">; onOpen?: () => void }) {
  return (
    <div className="relative grid overflow-hidden rounded-md bg-green-900 text-primary-foreground shadow-card lg:grid-cols-[minmax(0,26rem)_1fr]">
      <div className="absolute inset-0 blueprint opacity-60" />
      <div className="absolute -right-24 top-0 hidden h-full w-48 -skew-x-[18deg] bg-red-600/90 lg:block" />
      <button
        onClick={onOpen}
        className="group relative m-6 self-center overflow-hidden rounded-sm bg-background p-2 shadow-card transition-transform hover:-rotate-1 sm:m-10"
        aria-label={`View ${a.title} full size`}
      >
        <Img
          src={a.image}
          alt={`${a.title}${a.recipient ? ` — ${a.recipient}` : ""}, ${a.organisation}`}
          className="h-auto w-full !object-contain"
        />
      </button>
      <div className="relative flex flex-col justify-center p-8 pt-0 sm:p-12 lg:pl-4">
        <p className="eyebrow flex items-center gap-3 text-red-400">
          <span className="h-px w-8 bg-current" /> Latest recognition{a.year ? ` · ${a.year}` : ""}
        </p>
        <Medal className="mt-6 h-12 w-12 text-red-500" />
        <h3 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
          {a.title}
        </h3>
        {a.recipient && (
          <p className="mt-4 font-display text-xl font-bold text-red-400">{a.recipient}</p>
        )}
        {a.organisation && <p className="mt-2 text-primary-foreground/80">{a.organisation}</p>}
        {a.description && (
          <p className="mt-6 max-w-xl leading-relaxed text-primary-foreground/75">
            {a.description}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- team ---------- */

export function TeamCard({ m, index = 0 }: { m: ItemOf<"team">; index?: number }) {
  const initials = m.name
    .replace(/^(Mr|Mrs|Ms|Dr|Eng)\.?\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <Reveal delay={(index % 4) * 70} className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-green-900">
        {m.photo ? (
          <img
            src={m.photo}
            alt={`${m.name}, ${m.role} at Fumati Engineers`}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="grid h-full place-items-center blueprint">
            <span className="font-display text-6xl font-extrabold text-primary-foreground/80">
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {m.email && (
            <a
              href={`mailto:${m.email}`}
              aria-label={`Email ${m.name}`}
              className="grid h-9 w-9 place-items-center rounded-md bg-background text-green-700 hover:bg-red-600 hover:text-primary-foreground"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
          {m.linkedin && (
            <a
              href={m.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${m.name} on LinkedIn`}
              className="grid h-9 w-9 place-items-center rounded-md bg-background text-green-700 hover:bg-red-600 hover:text-primary-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
        <span className="absolute left-0 top-6 h-10 w-1.5 bg-red-600" />
      </div>
      <div className="mt-4">
        {m.department && <p className="eyebrow !text-[10px] text-red-600">{m.department}</p>}
        <h3 className="mt-1 text-xl font-extrabold text-green-700">{m.name}</h3>
        <p className="text-sm font-semibold text-muted-foreground">{m.role}</p>
        {m.bio && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>}
      </div>
    </Reveal>
  );
}

/* ---------- process ---------- */

export function ProcessSteps({ light }: { light?: boolean }) {
  const steps = useCollection("process_steps");
  return (
    <ol className="relative mt-14 grid gap-10 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
      <span
        className={cn(
          "absolute left-0 right-0 top-6 hidden h-0.5 lg:block",
          light ? "bg-primary-foreground/15" : "bg-border",
        )}
      >
        <span className="process-line block h-full bg-red-600" />
      </span>
      {steps.map((s, i) => (
        <Reveal as="li" key={s.id} delay={i * 110} className="relative">
          <span
            className={cn(
              "relative z-10 grid h-12 w-12 place-items-center rounded-md font-display text-lg font-extrabold",
              light ? "bg-red-600 text-primary-foreground" : "bg-green-700 text-primary-foreground",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3
            className={cn(
              "mt-5 text-lg font-extrabold",
              light ? "text-primary-foreground" : "text-green-700",
            )}
          >
            {s.title}
          </h3>
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed",
              light ? "text-primary-foreground/70" : "text-muted-foreground",
            )}
          >
            {s.text}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}

/* ---------- FAQ ---------- */

export function FaqList() {
  const faqs = useCollection("faqs");
  return (
    <div className="divide-y rounded-md border bg-background">
      {faqs.map((f) => (
        <details key={f.id} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-6 font-display text-lg font-bold text-green-700">
            {f.question}
            <Plus className="h-5 w-5 shrink-0 text-red-600 transition-transform group-open:rotate-45" />
          </summary>
          <p className="mt-4 leading-relaxed text-muted-foreground">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
