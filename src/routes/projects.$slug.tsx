import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner, PageHero, pageHead } from "@/components/site";

export const Route = createFileRoute("/projects/$slug")({
  head: () => pageHead("Project", "Project at Fumati Engineers, Harare, Zimbabwe."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Fumati Engineers" title="Project" image="The_Heart_Stadium.jpg" crumb="Project" />
      <CtaBanner />
    </>
  );
}
