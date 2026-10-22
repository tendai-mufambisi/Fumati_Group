import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Check, HardHat, Mail, Quote } from "lucide-react";

import { TeamCard } from "@/components/blocks";
import {
  CtaBanner,
  Img,
  PageHero,
  ParallaxBg,
  Reveal,
  SectionHead,
  pageHead,
} from "@/components/site";
import { useCollection, useContact, useSiteData } from "@/components/site/use-site-data";

export const Route = createFileRoute("/team")({
  head: () =>
    pageHead(
      "Our Team — Engineers, Fabricators & Leadership",
      "Meet the Fumati Engineers team: CEO & Founder Mr. Tinashe Changweya and the engineers, welders, riggers and managers building Zimbabwe's steel landmarks.",
      "/team",
    ),
  component: Team,
});

const IN_ACTION = [
  {
    src: "/images/fumati-engineers-team.webp",
    alt: "Fumati Engineers site team in hard hats and overalls",
  },
  {
    src: "/images/engineers-welding-steel-frame.webp",
    alt: "Fumati engineers welding at height in safety harnesses",
  },
  {
    src: "/images/site-supervision-engineer.webp",
    alt: "Fumati site engineer supervising foundation blockwork",
  },
  { src: "/images/engineers-setting-out-site.webp", alt: "Fumati engineers setting out on site" },
  {
    src: "/images/fumati-site-team-blockwork.webp",
    alt: "Fumati builders laying foundation blockwork",
  },
  {
    src: "/images/fumati-office-client-handshake.webp",
    alt: "Fumati Engineers team at the office",
  },
];

function Team() {
  const { settings: s, sections, ceoCredentials } = useSiteData();
  const team = useCollection("team");
  const contact = useContact();
  if (!sections.page_team) return <Navigate to="/" />;

  // The CEO already has the spotlight; don't show them twice.
  const others = team.filter((m) => m.name.trim() !== s.ceo_name.trim());
  const groups = [...new Set(others.map((m) => m.department || "Our team"))];

  return (
    <>
      <PageHero
        eyebrow="Our people"
        title={
          <>
            The people who make it <span className="text-red-500">happen</span>.
          </>
        }
        text="Skilled engineers, craftspeople and managers united by one goal — work that stands up and stands out."
        image="/images/fumati-site-team-blockwork.webp"
        crumb="Team"
      />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-28 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="relative">
          <div className="absolute -right-4 -top-4 h-full w-full rounded-md bg-red-600" />
          <Img
            src={s.ceo_photo}
            alt={`${s.ceo_name}, ${s.ceo_role}, Fumati Engineers`}
            className="relative aspect-[4/5] w-full rounded-md shadow-card"
          />
        </Reveal>
        <div>
          <p className="eyebrow text-red-600">Leadership spotlight</p>
          <h2 className="mt-4 text-4xl font-extrabold text-green-700 sm:text-6xl">{s.ceo_name}</h2>
          <p className="mt-2 font-display text-lg font-bold text-red-600">{s.ceo_role}</p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{s.ceo_bio}</p>
          <ul className="mt-8 space-y-3">
            {ceoCredentials.map((c) => (
              <li key={c} className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-red-600" />
                {c}
              </li>
            ))}
          </ul>
          <blockquote className="mt-10 border-l-4 border-red-600 pl-6">
            <Quote className="h-7 w-7 text-green-700/30" />
            <p className="mt-2 font-display text-xl font-bold leading-snug text-green-700">
              “{s.ceo_quote}”
            </p>
          </blockquote>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-green-50 py-28">
          <div className="mx-auto max-w-7xl px-5">
            {groups.map((g) => (
              <div key={g} className="mb-20 last:mb-0">
                <SectionHead
                  eyebrow={g}
                  title={g === "Leadership" ? "Leadership & management" : g}
                />
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {others
                    .filter((m) => (m.department || "Our team") === g)
                    .map((m, i) => (
                      <TeamCard key={m.id} m={m} index={i} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-28">
        <SectionHead
          eyebrow="On site & in the workshop"
          title={
            <>
              50+ professionals. <span className="text-red-600">One standard.</span>
            </>
          }
          text="Engineers, welders, fabricators, riggers, builders and site supervisors — trained, equipped and safety-first on every job."
        />
        <div className="mt-14 grid auto-rows-[12rem] grid-cols-2 gap-3 md:auto-rows-[15rem] md:grid-cols-4">
          {IN_ACTION.map((x, i) => (
            <Reveal
              key={x.src}
              delay={i * 60}
              className={i === 0 ? "col-span-2 row-span-2" : i === 2 ? "row-span-2" : ""}
            >
              <div className="group h-full overflow-hidden rounded-md">
                <Img
                  src={x.src}
                  alt={x.alt}
                  className="h-full w-full transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-28">
        <ParallaxBg
          src="/images/builders-at-work-foundations.webp"
          speed={0.35}
          overlay="bg-green-900/88"
        />
        <div className="relative mx-auto max-w-7xl px-5">
          <Reveal className="max-w-2xl">
            <HardHat className="h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-4xl font-extrabold text-primary-foreground sm:text-5xl">
              Want to build with us?
            </h2>
            <p className="mt-5 text-lg text-primary-foreground/80">
              We're always looking for skilled engineers, welders, fabricators and construction
              professionals who care about quality and Zimbabwe's future.
            </p>
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent("Careers at Fumati Engineers")}`}
              className="btn btn-red mt-10"
            >
              <Mail className="h-4 w-4" /> Send us your CV
            </a>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
