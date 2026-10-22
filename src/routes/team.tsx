import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner, PageHero, pageHead } from "@/components/site";

export const Route = createFileRoute("/team")({
  head: () => pageHead("Our Team", "Our Team at Fumati Engineers, Harare, Zimbabwe."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Fumati Engineers" title="Our Team" image="The_Heart_Stadium.jpg" crumb="Our Team" />
      <CtaBanner />
    </>
  );
}
