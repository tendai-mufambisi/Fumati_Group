import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Download, Eye, HardHat, Quote, ShieldCheck, Target } from "lucide-react";

import { StatsBand } from "@/components/blocks";
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

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead(
      "About Us — Company Profile",
      "The Fumati Engineers company profile: who we are, our mission, vision and values, our CEO Mr. Tinashe Changweya, our journey and our Waterfalls, Harare workshop.",
      "/about",
    ),
  component: About,
});

function About() {
  const { settings: s, sections, ceoCredentials } = useSiteData();
  const values = useCollection("core_values");
  const timeline = useCollection("timeline");
  const why = useCollection("why_us");
  const paragraphs = s.about_long.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Company profile"
        title={
          <>
            The engineers who turn <span className="text-red-500">steel into gold</span>.
          </>
        }
        text={s.brand_promise}
        image="/images/fumati-engineering-workshop-waterfalls.webp"
        crumb="About Us"
      >
        {s.company_profile_pdf && (
          <a
            href={s.company_profile_pdf}
            target="_blank"
            rel="noreferrer"
            className="btn btn-red mt-10 fade-in-up"
            style={{ animationDelay: ".4s" }}
          >
            <Download className="h-4 w-4" /> Download Company Profile (PDF)
          </a>
        )}
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-16 px-5 py-28 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHead
            eyebrow="Who we are"
            title={
              <>
                {s.legal_name.split(" t/a ")[0]} <span className="text-red-600">·</span>{" "}
                {s.company_name}
              </>
            }
          />
          <Reveal
            delay={100}
            className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground"
          >
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "font-semibold text-foreground" : ""}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
        <Reveal className="relative">
          <div className="grid grid-cols-2 gap-4">
            <Img
              src="/images/steel-frame-structure-harare.webp"
              alt="Structural steel frame erected by Fumati Engineers"
              className="col-span-2 aspect-[16/10] w-full rounded-md shadow-card"
            />
            <Img
              src="/images/fumati-office-client-handshake.webp"
              alt="Fumati Engineers team at the Harare office"
              className="aspect-square w-full rounded-md"
            />
            <Img
              src="/images/engineers-welding-steel-frame.webp"
              alt="Fumati engineers welding a steel frame in harnesses"
              className="aspect-square w-full rounded-md"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-md bg-green-700 p-6 text-primary-foreground shadow-card sm:block">
            <p className="font-display text-4xl font-extrabold">#1</p>
            <p className="eyebrow mt-1 !text-[10px]">
              Company of the Year
              <br />
              Engineering Services
            </p>
          </div>
        </Reveal>
      </section>

      {sections.about_mission && (
        <section className="relative isolate overflow-hidden py-28">
          <ParallaxBg
            src="/images/column-foundations-formwork.webp"
            speed={0.3}
            overlay="bg-green-900/92"
          />
          <div className="absolute inset-0 blueprint opacity-50" />
          <div className="relative mx-auto max-w-7xl px-5">
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                { icon: Target, label: "Our mission", text: s.mission },
                { icon: Eye, label: "Our vision", text: s.vision },
              ].map((x, i) => (
                <Reveal
                  key={x.label}
                  delay={i * 120}
                  className="relative overflow-hidden rounded-md border border-primary-foreground/15 bg-primary-foreground/[0.06] p-10 backdrop-blur"
                >
                  <span className="absolute left-0 top-10 h-12 w-1.5 bg-red-600" />
                  <x.icon className="h-10 w-10 text-red-500" />
                  <p className="eyebrow mt-6 text-primary-foreground/70">{x.label}</p>
                  <p className="mt-4 font-display text-2xl font-bold leading-snug text-primary-foreground sm:text-3xl">
                    {x.text}
                  </p>
                </Reveal>
              ))}
            </div>
            <SectionHead light eyebrow="Core values" title="What we stand for." className="mt-24" />
            <div className="mt-12 grid gap-px overflow-hidden rounded-md bg-primary-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v, i) => (
                <Reveal
                  key={v.id}
                  delay={i * 70}
                  className="group bg-green-900/70 p-8 transition-colors hover:bg-green-700/80"
                >
                  <Icon
                    name={v.icon}
                    className="h-9 w-9 text-red-500 transition-transform group-hover:scale-110"
                  />
                  <h3 className="mt-5 text-2xl font-extrabold text-primary-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-primary-foreground/70">{v.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.about_ceo && (
        <section className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-28 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-md border-2 border-red-600" />
            <Img
              src={s.ceo_photo}
              alt={`${s.ceo_name}, ${s.ceo_role} of Fumati Engineers`}
              className="relative aspect-[4/5] w-full rounded-md shadow-card"
            />
          </Reveal>
          <div>
            <SectionHead
              eyebrow="Leadership"
              title={
                <>
                  A message from our <span className="text-red-600">CEO</span>.
                </>
              }
            />
            <Reveal delay={100}>
              <Quote className="mt-8 h-10 w-10 text-red-600" />
              <blockquote className="mt-4 font-display text-2xl font-bold leading-snug text-green-700 sm:text-3xl">
                “{s.ceo_quote}”
              </blockquote>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{s.ceo_bio}</p>
              <p className="mt-6 font-display text-xl font-extrabold text-green-700">
                {s.ceo_name}
              </p>
              <p className="text-sm font-semibold text-red-600">{s.ceo_role}</p>
              {ceoCredentials.length > 0 && (
                <ul className="mt-8 space-y-3 border-t pt-8">
                  {ceoCredentials.map((c) => (
                    <li key={c} className="flex items-start gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-red-600" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>
        </section>
      )}

      <StatsBand image="/images/builders-at-work-foundations.webp" />

      {sections.about_timeline && timeline.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 py-28">
          <SectionHead
            eyebrow="Our journey"
            title="From a determined team to a national name."
            center
          />
          <ol className="relative mt-16 border-l-2 border-green-50 pl-10 sm:mx-auto sm:max-w-3xl">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.id} delay={i * 90} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[3.05rem] top-0 grid h-8 w-8 place-items-center rounded-full border-4 border-background bg-red-600" />
                {t.year && (
                  <p className="font-display text-3xl font-extrabold text-red-600">{t.year}</p>
                )}
                <h3 className="mt-1 text-2xl font-extrabold text-green-700">{t.title}</h3>
                {t.text && <p className="mt-2 text-muted-foreground">{t.text}</p>}
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {sections.about_facilities && (
        <section className="bg-green-50 py-28">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              eyebrow="Facilities & safety"
              title="Our own workshop. Our own crews. Zero shortcuts."
            />
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              <Reveal className="group relative overflow-hidden rounded-md lg:col-span-2 lg:row-span-2">
                <Img
                  src="/images/fumati-engineering-workshop-waterfalls.webp"
                  alt="Fumati Group fabrication yard and workshop, Waterfalls, Harare"
                  className="h-full min-h-[22rem] w-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-900 to-transparent p-8">
                  <h3 className="text-2xl font-extrabold text-primary-foreground">
                    The Waterfalls workshop
                  </h3>
                  <p className="mt-1 text-primary-foreground/80">
                    Fabrication yard, welding bays and stock — at 1/5 Sherwood Crescent, Harare.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={100} className="rounded-md bg-background p-8">
                <ShieldCheck className="h-9 w-9 text-red-600" />
                <h3 className="mt-5 text-xl font-extrabold text-green-700">
                  Safety first, every site
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Site safety notices, PPE for everyone on site, harnesses for work at height and
                  daily toolbox talks. Unauthorised entry is strictly prohibited.
                </p>
              </Reveal>
              <Reveal delay={180} className="relative overflow-hidden rounded-md">
                <Img
                  src="/images/construction-site-safety-notice.webp"
                  alt="Fumati site safety notice requiring helmets, protective footwear and safety clothing"
                  className="h-full min-h-[14rem] w-full"
                />
                <span className="absolute left-4 top-4 flex items-center gap-2 rounded-sm bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  <HardHat className="h-4 w-4" /> Zero harm
                </span>
              </Reveal>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {why.map((w, i) => (
                <Reveal key={w.id} delay={i * 60} className="flex gap-4">
                  <Icon name={w.icon} className="h-7 w-7 shrink-0 text-red-600" />
                  <div>
                    <h3 className="font-extrabold text-green-700">{w.title}</h3>
                    <p className="text-sm text-muted-foreground">{w.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-14 text-center">
              <Link to="/projects" className="btn btn-green">
                See what we've built
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <CtaBanner image="/images/site-supervision-engineer.webp" />
    </>
  );
}
