import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { ProcessSteps } from "@/components/blocks";
import {
  CtaBanner,
  Icon,
  Img,
  PageHero,
  ParallaxBg,
  Reveal,
  SectionHead,
  pageHead,
} from "@/components/site";
import { useCollection, useSiteData } from "@/components/site/use-site-data";
import { toLines } from "@/data/site-data";

export const Route = createFileRoute("/services")({
  head: () =>
    pageHead(
      "Engineering Services — Structural, Mechanical, Steel Fabrication",
      "Structural engineering, mechanical engineering, steel fabrication and welding, plant fitting, equipment production, construction, gates and metalwork, and hardware — from Fumati Engineers in Harare, Zimbabwe.",
      "/services",
    ),
  component: Services,
});

function Services() {
  const { sections } = useSiteData();
  const services = useCollection("services");
  const industries = useCollection("industries");

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title={
          <>
            Engineering, <span className="text-red-500">end to end</span>.
          </>
        }
        text="Design, fabrication, installation and after-care from one accountable team — and one workshop in Waterfalls, Harare."
        image="/images/steel-frame-structure-harare.webp"
        crumb="Services"
      />

      <nav
        aria-label="Services"
        className="sticky top-20 z-30 hidden border-b bg-background/95 backdrop-blur lg:block"
      >
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-4 text-sm font-semibold">
          {services.map((s) => (
            <a
              key={s.id}
              href={`#service-${s.id}`}
              className="whitespace-nowrap text-muted-foreground hover:text-red-600"
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 py-20">
        {services.map((s, i) => (
          <section
            key={s.id}
            id={`service-${s.id}`}
            className="grid scroll-mt-40 items-center gap-12 border-b py-16 last:border-0 lg:grid-cols-2 lg:gap-20"
          >
            <Reveal className={i % 2 ? "lg:order-2" : ""}>
              <div className="group relative overflow-hidden rounded-md shadow-card">
                <Img
                  src={s.image}
                  alt={`${s.title} by Fumati Engineers, Harare`}
                  className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-0 top-0 bg-red-600 px-5 py-3 font-display text-2xl font-extrabold text-primary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </Reveal>
            <div>
              <SectionHead eyebrow="Service" title={s.title} text={s.short} />
              <Reveal delay={100}>
                {s.body && <p className="mt-5 leading-relaxed text-muted-foreground">{s.body}</p>}
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {toLines(s.bullets).map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" search={{ service: s.title }} className="btn btn-green mt-10">
                  Enquire about this service <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      {sections.services_process && (
        <section className="relative isolate overflow-hidden py-28">
          <ParallaxBg
            src="/images/site-supervision-engineer.webp"
            speed={0.3}
            overlay="bg-green-900/92"
          />
          <div className="relative mx-auto max-w-7xl px-5">
            <SectionHead
              light
              eyebrow="Our process"
              title="Six steps. No surprises."
              text="Every project, large or small, runs on the same proven method."
            />
            <ProcessSteps light />
          </div>
        </section>
      )}

      {sections.services_industries && industries.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-28">
          <SectionHead eyebrow="Industries" title="Sectors we serve." center />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((x, i) => (
              <Reveal
                key={x.id}
                delay={(i % 4) * 70}
                className="group rounded-md border p-7 transition-all hover:-translate-y-1 hover:border-green-700 hover:shadow-card"
              >
                <Icon
                  name={x.icon}
                  className="h-9 w-9 text-green-700 transition-colors group-hover:text-red-600"
                />
                <h3 className="mt-5 text-lg font-extrabold text-green-700">{x.title}</h3>
                {x.text && <p className="mt-2 text-sm text-muted-foreground">{x.text}</p>}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
