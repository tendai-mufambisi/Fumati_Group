import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner, PageHero, pageHead } from "@/components/site";

export const Route = createFileRoute("/services")({
  head: () => pageHead("Our Services", "Our Services at Fumati Engineers, Harare, Zimbabwe."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Fumati Engineers" title="Our Services" image="The_Heart_Stadium.jpg" crumb="Our Services" />
      <CtaBanner />
    </>
  );
}
