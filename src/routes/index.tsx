import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, HardHat, LifeBuoy, Medal, Users, Wrench } from "lucide-react";
import { HomeHero } from "@/components/hero";
import { ClientMarquee, ProjectCard, Testimonials } from "@/components/blocks";
import { Counter, CtaBanner, Img, Reveal, SectionHead, pageHead } from "@/components/site";
import { stats, whyUs } from "@/data/company";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { awards } from "@/data/people";

export const Route = createFileRoute("/")({
  head: () => pageHead("Turning Steel Into Gold", "Fumati Engineers: multi-award-winning structural, mechanical and steel fabrication engineers in Harare, Zimbabwe. Stadiums, bridges, roofing, gates and more."),
  component: Home,
});

const whyIcons = [Medal, HardHat, Wrench, Users, Clock, LifeBuoy];

function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 6);
  return (
    <>
      <HomeHero />

      <section className="mx-auto -mt-2 max-w-7xl px-5 py-20">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border bg-border lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-background p-8">
              <p className="font-display text-5xl font-extrabold text-red-600 sm:text-7xl"><Counter to={s.value} suffix={s.suffix} /></p>
              <p className="eyebrow mt-3 text-green-700">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="eyebrow mb-6 text-center text-muted-foreground">Trusted by organisations across Zimbabwe</p>
        <ClientMarquee />
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-28 lg:grid-cols-2">
        <Reveal className="relative h-[460px]">
          <Img name="fumati_TEam.jpg" alt="The Fumati Engineers team" className="absolute left-0 top-0 h-[78%] w-[78%] rounded-md shadow-card" />
          <Img name="Fumati_ENgineering_Workshop.jpg" alt="Fumati fabrication workshop in Waterfalls" className="absolute bottom-0 right-0 h-[55%] w-[55%] rounded-md border-8 border-background shadow-card" />
          <div className="absolute bottom-6 left-6 rounded-md bg-red-600 px-5 py-4 text-primary-foreground">
            <p className="font-display text-3xl font-extrabold">2008</p><p className="eyebrow !text-[10px]">Established</p>
          </div>
        </Reveal>
        <div>
          <SectionHead eyebrow="Who we are" title={<>Built in Waterfalls. <span className="text-red-600">Trusted</span> nationwide.</>} text="Founded by Mr. Tinashe Changweya, Fumati grew from a determined local team into one of Zimbabwe's most respected engineering brands. We design, fabricate and erect, from stadium roofs to mining equipment, all from our own workshop." />
          <Reveal delay={150}><Link to="/about" className="btn btn-outline-green mt-8">Read Our Story <ArrowRight className="h-4 w-4" /></Link></Reveal>
        </div>
      </section>

      <section className="bg-green-900 blueprint py-28 clip-cut-top">
        <div className="mx-auto max-w-7xl px-5 pt-10">
          <SectionHead light eyebrow="What we do" title="Engineering, end to end." text="Six disciplines. One workshop. Zero handover gaps." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-md bg-primary-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s, i) => (
              <Link key={s.id} to="/services" hash={s.id} className="group relative bg-green-900 p-8 transition-colors hover:bg-green-700">
                <span className="font-display text-sm font-extrabold text-red-600">0{i + 1}</span>
                <h3 className="mt-6 text-2xl font-extrabold text-primary-foreground">{s.title}</h3>
                <p className="mt-3 text-primary-foreground/70">{s.short}</p>
                <ArrowRight className="mt-8 h-5 w-5 text-primary-foreground/50 transition-transform group-hover:translate-x-2 group-hover:text-primary-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Featured work" title={<>Landmarks in <span className="text-red-600">steel</span>.</>} />
          <Link to="/projects" className="btn btn-outline-green">See Full Portfolio <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80} className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
              <ProjectCard p={p} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-green-50 blueprint-light py-28">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead eyebrow="Why Fumati" title="Six reasons the big jobs come to us." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((w, i) => {
              const Icon = whyIcons[i];
              return (
                <Reveal key={w.title} delay={i * 60} className="rounded-md border bg-background p-8">
                  <Icon className="h-8 w-8 text-green-500" />
                  <h3 className="mt-5 text-xl font-extrabold text-green-700">{w.title}</h3>
                  <p className="mt-2 text-muted-foreground">{w.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-28">
        <SectionHead eyebrow="Recognition" title="Award-winning, on the record." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {awards.map((a) => (
            <Link key={a.title} to="/awards" className="group grid overflow-hidden rounded-md border sm:grid-cols-[200px_1fr]">
              <Img name={a.image} alt={a.title} className="aspect-square h-full w-full transition-transform duration-500 group-hover:scale-105" />
              <div className="p-7">
                <Medal className="h-6 w-6 text-red-600" />
                <h3 className="mt-4 text-xl font-extrabold text-green-700">{a.title}</h3>
                {a.recipient && <p className="text-sm font-semibold">{a.recipient}</p>}
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t py-28"><div className="px-5"><Testimonials /></div></section>

      <CtaBanner />
    </>
  );
}
