import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner, PageHero, pageHead } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => pageHead("About Us", "About Us at Fumati Engineers, Harare, Zimbabwe."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Fumati Engineers" title="About Us" image="The_Heart_Stadium.jpg" crumb="About Us" />
      <CtaBanner />
    </>
  );
}
