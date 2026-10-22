import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { useState } from "react";

import { Lightbox, MediaTile, ProjectCard } from "@/components/blocks";
import { CtaBanner, Img, PageHero, Reveal, SectionHead, pageHead } from "@/components/site";
import { useContact, useSiteData } from "@/components/site/use-site-data";
import { getProject } from "@/data/public-data";
import { responsiveSrcSet, SITE_URL } from "@/data/site-data";
import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = await getProject({ data: params.slug });
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData: p, params }) => {
    if (!p) return {};
    const base = pageHead(
      `${p.title}${p.location ? `, ${p.location}` : ""} — ${p.category}`,
      `${p.summary} A ${p.category.toLowerCase()} project by Fumati Engineers${p.location ? ` in ${p.location}` : ""}, Zimbabwe.`,
      `/projects/${params.slug}`,
      p.cover || "/og-image.jpg",
    );
    const ld = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CreativeWork",
          name: p.title,
          description: p.summary,
          image: p.media.filter((m) => m.kind === "image").map((m) => `${SITE_URL}${m.url}`),
          creator: { "@id": `${SITE_URL}/#organization` },
          ...(p.location
            ? { locationCreated: { "@type": "Place", name: `${p.location}, Zimbabwe` } }
            : {}),
          ...(p.year ? { dateCreated: p.year } : {}),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
            {
              "@type": "ListItem",
              position: 3,
              name: p.title,
              item: `${SITE_URL}/projects/${params.slug}`,
            },
          ],
        },
      ],
    };
    return { ...base, scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }] };
  },
  component: ProjectPage,
});

/**
 * The header photo is stretched full width, so only use the cover when it is
 * large: a dashboard upload, or one of the full-size shipped photos.
 */
function sharpCover(cover: string) {
  return cover.startsWith("/media/") || responsiveSrcSet(cover)
    ? cover
    : "/images/steel-frame-structure-harare.webp";
}

function ProjectPage() {
  const p = Route.useLoaderData();
  const { projects } = useSiteData();
  const contact = useContact();
  const [open, setOpen] = useState<number | null>(null);
  const related = projects
    .filter((x) => x.slug !== p.slug && x.category === p.category)
    .slice(0, 3);
  const more = related.length ? related : projects.filter((x) => x.slug !== p.slug).slice(0, 3);
  const facts = [
    ["Client", p.client],
    ["Location", p.location],
    ["Year", p.year],
    ["Category", p.category],
    ["Status", p.status],
  ].filter(([, v]) => v);
  const story = [
    ["The challenge", p.challenge],
    ["Our solution", p.solution],
    ["The result", p.result],
  ].filter(([, v]) => v);

  return (
    <>
      <PageHero
        eyebrow={p.category}
        title={p.title}
        text={p.summary}
        image={sharpCover(p.cover)}
        crumb={p.title}
      />

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[1fr_22rem]">
        <div>
          {p.media.length > 0 ? (
            <div className="grid auto-rows-[14rem] grid-cols-2 gap-3 md:auto-rows-[16rem] md:grid-cols-3">
              {p.media.map((m, i) => (
                <Reveal
                  key={m.id}
                  delay={(i % 6) * 60}
                  className={cn(
                    i === 0 && "col-span-2 row-span-2",
                    i === 0 && p.media.length === 1 && "md:col-span-3",
                  )}
                >
                  <MediaTile m={m} onOpen={() => setOpen(i)} className="h-full" />
                </Reveal>
              ))}
            </div>
          ) : (
            <Img
              src={undefined}
              alt={p.title}
              label="Photos coming soon"
              className="aspect-[16/9] w-full rounded-md"
            />
          )}

          {p.body ? (
            <div
              className="mt-14 max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }}
            />
          ) : null}

          {story.length > 0 && (
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {story.map(([label, text], i) => (
                <Reveal
                  key={label}
                  delay={i * 80}
                  className={cn(
                    "rounded-md p-7",
                    i === 2 ? "bg-green-700 text-primary-foreground" : "bg-green-50",
                  )}
                >
                  <p
                    className={cn(
                      "eyebrow",
                      i === 2 ? "text-primary-foreground/80" : "text-red-600",
                    )}
                  >
                    {label}
                  </p>
                  <p className={cn("mt-3 leading-relaxed", i === 2 ? "" : "text-muted-foreground")}>
                    {text}
                  </p>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-md border">
            <div className="bg-green-900 p-6">
              <p className="eyebrow text-red-400">Project details</p>
              <h2 className="mt-2 text-2xl font-extrabold text-primary-foreground">{p.title}</h2>
            </div>
            {facts.length > 0 && (
              <dl className="divide-y">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-6 py-4 text-sm">
                    <dt className="font-semibold text-muted-foreground">{k}</dt>
                    <dd className="text-right font-bold text-green-700">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {p.scope.length > 0 && (
              <div className="border-t p-6">
                <p className="eyebrow text-red-600">Scope of work</p>
                <ul className="mt-4 space-y-2.5">
                  {p.scope.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-3 border-t p-6">
              <p className="font-display text-lg font-extrabold text-green-700">
                Want something similar?
              </p>
              <Link to="/contact" search={{ service: p.category }} className="btn btn-red w-full">
                Get a Quote
              </Link>
              <a
                href={contact.whatsappLink(
                  `Hi Fumati Engineers, I saw the "${p.title}" project and would like something similar.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-green w-full"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
            </div>
          </div>
          <Link
            to="/projects"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-red-600"
          >
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
        </aside>
      </section>

      {more.length > 0 && (
        <section className="border-t bg-green-50 py-20">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead
                eyebrow="More work"
                title={related.length ? "Related projects" : "More projects"}
              />
              <Link to="/projects" className="btn btn-outline-green">
                Full Portfolio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {more.map((x, i) => (
                <Reveal key={x.slug} delay={i * 80}>
                  <ProjectCard p={x} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox items={p.media} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      <CtaBanner />
    </>
  );
}
