import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Quote } from "lucide-react";

import { HomeHero } from "@/components/hero";
import {
  AwardCard,
  ClientsStrip,
  ProcessSteps,
  ProjectCard,
  StatsBand,
  TeamCard,
  Testimonials,
} from "@/components/blocks";
import { CtaBanner, Icon, Img, ParallaxBg, Reveal, SectionHead, pageHead } from "@/components/site";
import { useCollection, useSiteData } from "@/components/site/use-site-data";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Fumati Engineers | Structural, Mechanical & Steel Fabrication Engineers in Harare, Zimbabwe",
      "Fumati Engineers (Fumati Group) — multi-award-winning structural engineering, mechanical engineering and steel fabrication company in Harare, Zimbabwe. Steel structures, roofing, bridges, gates, plant fitting and equipment.",
      "/",
    ),
  component: Home,
});

function Home() {
  const { settings: s, sections, projects } = useSiteData();
  const services = useCollection("services");
  const why = useCollection("why_us");
  const awards = useCollection("awards");
  const team = useCollection("team");
  const testimonials = useCollection("testimonials");
  const clients = useCollection("clients");
  const featured = (
    projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects
  ).slice(0, 6);

  return (
    <>
      <HomeHero />

      {sections.home_stats && <StatsBand />}

      {sections.home_clients && clients.length > 0 && (
        <section className="pt-20">
          <p className="eyebrow mb-8 text-center text-muted-foreground">
            Brands & clients we've worked with
          </p>
          <ClientsStrip />
        </section>
      )}

      {sections.home_about && (
        <section className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-28 lg:grid-cols-2">
          <Reveal className="relative h-[480px]">
            <Img
              src="/images/fumati-engineering-workshop-waterfalls.webp"
              alt="The Fumati Engineers fabrication workshop in Waterfalls, Harare"
              className="absolute left-0 top-0 h-[78%] w-[80%] rounded-md shadow-card"
            />
            <Img
              src="/images/fumati-engineers-team.webp"
              alt="The Fumati Engineers site team in safety gear"
              className="absolute bottom-0 right-0 h-[52%] w-[54%] rounded-md border-8 border-background shadow-card"
            />
            {s.founded_year && (
              <div className="absolute bottom-8 left-6 rounded-md bg-red-600 px-6 py-5 text-primary-foreground shadow-card">
                <p className="font-display text-4xl font-extrabold">{s.founded_year}</p>
                <p className="eyebrow !text-[10px]">Established</p>
              </div>
            )}
          </Reveal>
          <div>
            <SectionHead
              eyebrow="Who we are"
              title={
                <>
                  Built in Waterfalls. <span className="text-red-600">Trusted</span> nationwide.
                </>
              }
              text={s.about_short}
            />
            <Reveal delay={120}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "In-house design & fabrication",
                  "Safety-first site crews",
                  "Stadiums to steel furniture",
                  "Harare workshop & hardware shop",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-3 font-semibold text-green-700">
                    <span className="grid h-6 w-6 place-items-center rounded-sm bg-red-600 text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="btn btn-outline-green mt-10">
                Read Our Story <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {sections.home_services && (
        <section className="bg-green-900 blueprint py-28 clip-cut-top">
          <div className="mx-auto max-w-7xl px-5 pt-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead
                light
                eyebrow="What we do"
                title="Engineering, end to end."
                text={`${services.length} disciplines. One workshop. Zero handover gaps.`}
              />
              <Link to="/services" className="btn btn-outline-white">
                All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-md bg-primary-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((x, i) => (
                <Link
                  key={x.id}
                  to="/services"
                  hash={`service-${x.id}`}
                  className="group relative min-h-[17rem] overflow-hidden bg-green-900 p-8"
                >
                  {x.image && (
                    <Img
                      src={x.image}
                      alt=""
                      className="absolute inset-0 h-full w-full opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-30"
                    />
                  )}
                  <div className="relative">
                    <span className="font-display text-sm font-extrabold text-red-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-6 text-xl font-extrabold text-primary-foreground">
                      {x.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                      {x.short}
                    </p>
                    <ArrowRight className="mt-6 h-5 w-5 text-primary-foreground/50 transition-transform group-hover:translate-x-2 group-hover:text-red-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.home_projects && featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow="Featured work"
              title={
                <>
                  Landmarks in <span className="text-red-600">steel</span>.
                </>
              }
              text="From The Heart Stadium to bridges, roofs and a double-deck boat — a few of the projects we're proudest of."
            />
            <Link to="/projects" className="btn btn-outline-green">
              See Full Portfolio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-14 grid auto-rows-[18rem] gap-5 md:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal
                key={p.slug}
                delay={i * 80}
                className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
              >
                <ProjectCard p={p} className="h-full [&>div]:aspect-auto" priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="relative isolate overflow-hidden py-36">
        <ParallaxBg
          src="/images/steel-frame-structure-harare.webp"
          speed={0.4}
          overlay="bg-gradient-to-r from-green-900/95 via-green-900/70 to-green-900/30"
        />
        <div className="relative mx-auto max-w-7xl px-5">
          <Reveal className="max-w-3xl">
            <Quote className="h-12 w-12 text-red-500" />
            <p className="mt-6 font-display text-3xl font-extrabold leading-tight text-primary-foreground sm:text-5xl">
              {s.brand_promise}
            </p>
            <p className="eyebrow mt-8 text-primary-foreground/70">— The Fumati promise</p>
          </Reveal>
        </div>
      </section>

      {sections.home_why && (
        <section className="bg-green-50 blueprint-light py-28">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead eyebrow="Why Fumati" title="Why the big jobs come to us." center />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {why.map((w, i) => (
                <Reveal
                  key={w.id}
                  delay={i * 60}
                  className="group relative overflow-hidden rounded-md border bg-background p-8 transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <span className="absolute right-6 top-4 font-display text-6xl font-extrabold text-green-50 transition-colors group-hover:text-red-50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative grid h-14 w-14 place-items-center rounded-md bg-green-700 text-primary-foreground transition-colors group-hover:bg-red-600">
                    <Icon name={w.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="relative mt-6 text-xl font-extrabold text-green-700">{w.title}</h3>
                  <p className="relative mt-2 text-muted-foreground">{w.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.home_process && (
        <section className="mx-auto max-w-7xl px-5 py-28">
          <SectionHead
            eyebrow="How we work"
            title="From first sketch to final weld."
            text="A proven six-stage method that keeps every project safe, on budget and on programme."
          />
          <ProcessSteps />
        </section>
      )}

      {sections.home_awards && awards.length > 0 && (
        <section className="border-t bg-background py-28">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead eyebrow="Recognition" title="Award-winning, on the record." />
              {sections.page_awards && (
                <Link to="/awards" className="btn btn-outline-green">
                  Awards & Clients <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {awards.slice(0, 4).map((a, i) => (
                <Reveal key={a.id} delay={i * 80}>
                  <AwardCard a={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.home_team && sections.page_team && team.length > 0 && (
        <section className="bg-green-50 py-28">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead
                eyebrow="Our people"
                title={
                  <>
                    The team behind the <span className="text-red-600">steel</span>.
                  </>
                }
                text="Engineers, welders, riggers and managers united by one standard: work that stands up and stands out."
              />
              <Link to="/team" className="btn btn-outline-green">
                Meet the Team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {team.slice(0, 4).map((m, i) => (
                <TeamCard key={m.id} m={m} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.home_testimonials && testimonials.length > 0 && (
        <section className="border-t py-28">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead eyebrow="Client voices" title="What our clients say." className="mb-14" />
            <Testimonials />
          </div>
        </section>
      )}

      {sections.home_cta && <CtaBanner />}
    </>
  );
}
