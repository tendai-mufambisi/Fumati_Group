import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner, PageHero, pageHead } from "@/components/site";

export const Route = createFileRoute("/awards")({
  head: () => pageHead("Awards", "Awards at Fumati Engineers, Harare, Zimbabwe."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Fumati Engineers" title="Awards" image="The_Heart_Stadium.jpg" crumb="Awards" />
      <CtaBanner />
    </>
  );
}
