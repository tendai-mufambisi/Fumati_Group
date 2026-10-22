import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner, PageHero, pageHead } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("Contact", "Contact at Fumati Engineers, Harare, Zimbabwe."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Fumati Engineers" title="Contact" image="The_Heart_Stadium.jpg" crumb="Contact" />
      <CtaBanner />
    </>
  );
}
