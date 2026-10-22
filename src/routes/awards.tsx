import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";

import {
  AwardCard,
  FeaturedAward,
  ClientWall,
  LetterWall,
  Lightbox,
  StatsBand,
  Testimonials,
} from "@/components/blocks";
import { CtaBanner, PageHero, Reveal, SectionHead, pageHead } from "@/components/site";
import { useCollection, useSiteData } from "@/components/site/use-site-data";

export const Route = createFileRoute("/awards")({
  head: () =>
    pageHead(
      "Awards, Clients & Testimonials",
      "Fumati Engineers awards: CEO Tinashe Changweya named in CIPMZ 40 Under 40 Young Project Leaders in Zimbabwe 2026, and Company of the Year — Engineering Services at the Zimbabwe Business Awards.",
      "/awards",
    ),
  component: Awards,
});

function Awards() {
  const { sections } = useSiteData();
  const awards = useCollection("awards");
  const clients = useCollection("clients");
  const testimonials = useCollection("testimonials");
  const [open, setOpen] = useState<number | null>(null);
  if (!sections.page_awards) return <Navigate to="/" />;
  const awardImages = awards.filter((a) => a.image);

  return (
    <>
      <PageHero
        eyebrow="Recognition"
        title={
          <>
            Recognised for <span className="text-red-500">excellence</span>.
          </>
        }
        text="Honoured by Zimbabwe's business community — and trusted by the clients who matter most."
        image="/images/steel-frame-structure-harare.webp"
        crumb="Awards & Clients"
      />

      {awards.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-28">
          <SectionHead eyebrow="Awards" title="Award-winning, on the record." />
          <Reveal className="mt-14">
            <FeaturedAward
              a={awards[0]!}
              onOpen={() => setOpen(awardImages.findIndex((x) => x.id === awards[0]!.id))}
            />
          </Reveal>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {awards.slice(1).map((a, i) => (
              <Reveal key={a.id} delay={i * 80}>
                <AwardCard
                  a={a}
                  onOpen={() => setOpen(awardImages.findIndex((x) => x.id === a.id))}
                />
              </Reveal>
            ))}
          </div>
          <Lightbox
            items={awardImages.map((a) => ({
              id: a.id,
              kind: "image",
              url: a.image,
              alt: `${a.title} — ${a.organisation}`,
            }))}
            index={open}
            onClose={() => setOpen(null)}
            onIndex={setOpen}
          />
        </section>
      )}

      <StatsBand />

      {clients.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-28">
          <SectionHead
            eyebrow="Brands & clients"
            title="Organisations we've worked with."
            text="From national landmarks to local businesses — thank you for trusting Fumati with your projects."
          />
          <div className="mt-14">
            <ClientWall />
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="border-t bg-green-50 py-28">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead eyebrow="Client voices" title="What our clients say." className="mb-14" />
            <Testimonials />
            {testimonials.some((t) => t.photo_kind === "letter" && t.photo) && (
              <div className="mt-24">
                <SectionHead
                  eyebrow="Recommendation letters"
                  title="In their own words — on letterhead."
                  className="mb-12"
                />
                <LetterWall />
              </div>
            )}
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
