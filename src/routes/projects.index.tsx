import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner, PageHero, pageHead } from "@/components/site";

export const Route = createFileRoute("/projects/")({
  head: () => pageHead("Projects", "Projects at Fumati Engineers, Harare, Zimbabwe."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Fumati Engineers" title="Projects" image="The_Heart_Stadium.jpg" crumb="Projects" />
      <CtaBanner />
    </>
  );
}
