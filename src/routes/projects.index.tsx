import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/blocks";
import { CtaBanner, PageHero, Reveal, pageHead } from "@/components/site";
import { useSiteData } from "@/components/site/use-site-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  head: () =>
    pageHead(
      "Projects Portfolio — Stadiums, Steel Structures, Bridges & More",
      "Explore Fumati Engineers' portfolio: The Heart Stadium, multi-storey steel frames, bridges, large-span roofing, glass and steel facades, gates and custom steel equipment across Zimbabwe.",
      "/projects",
    ),
  component: Projects,
});

function Projects() {
  const { projects } = useSiteData();
  const [filter, setFilter] = useState("All");

  // Tabs come from the categories actually in use, so an empty tab never appears.
  const tabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [["All", projects.length] as const, ...[...counts.entries()]];
  }, [projects]);
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <PageHero
        eyebrow="Projects portfolio"
        title={
          <>
            Landmark projects that <span className="text-red-500">define Zimbabwe</span>.
          </>
        }
        text="Stadiums, steel frames, bridges, roofs, facades, gates and one-off equipment — every one fabricated and delivered by Fumati."
        image="/images/column-foundations-formwork.webp"
        crumb="Projects"
      />

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2">
          {tabs.map(([name, count]) => (
            <button
              key={name}
              role="tab"
              aria-selected={filter === name}
              onClick={() => setFilter(name)}
              className={cn(
                "flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-all",
                filter === name
                  ? "border-green-700 bg-green-700 text-primary-foreground shadow-card"
                  : "text-green-700 hover:border-green-700",
              )}
            >
              {name}
              <span
                className={cn(
                  "rounded-sm px-1.5 text-xs",
                  filter === name ? "bg-red-600" : "bg-green-50",
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        <div key={filter} className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {shown.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 6) * 70} className="mb-6 break-inside-avoid">
              <ProjectCard p={p} tall={i % 5 === 1} />
            </Reveal>
          ))}
        </div>
        {shown.length === 0 && (
          <p className="mt-12 text-muted-foreground">No projects in this category yet.</p>
        )}
      </section>

      <CtaBanner image="/images/fumati-site-team-blockwork.webp" />
    </>
  );
}
