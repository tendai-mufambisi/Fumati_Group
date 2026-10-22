import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send, Store } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { FaqList } from "@/components/blocks";
import { PageHero, Reveal, SectionHead, pageHead } from "@/components/site";
import { useCollection, useContact, useSiteData } from "@/components/site/use-site-data";
import { enquirySchema, type EnquiryInput } from "@/data/enquiry";
import { submitEnquiry } from "@/data/public-data";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { service?: string } =>
    typeof search["service"] === "string" ? { service: search["service"].slice(0, 80) } : {},
  head: () =>
    pageHead(
      "Contact Us & Get a Quote",
      "Get a free quote from Fumati Engineers. Call +263 77 196 0330, WhatsApp us, or visit 1/5 Sherwood Crescent, Waterfalls, Harare. Hardware shop on Simon Mazorodze Road.",
      "/contact",
    ),
  component: Contact,
});

const BUDGETS = [
  "Not sure yet",
  "Under US$5,000",
  "US$5,000 – 25,000",
  "US$25,000 – 100,000",
  "Over US$100,000",
];

function Contact() {
  const { sections } = useSiteData();
  const services = useCollection("services");
  const faqs = useCollection("faqs");
  const c = useContact();
  const { service } = Route.useSearch();

  const empty: EnquiryInput = {
    name: "",
    phone: "",
    email: "",
    service: service ?? "",
    location: "",
    budget: "",
    message: "",
    website: "",
  };
  const [form, setForm] = useState<EnquiryInput>(empty);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof EnquiryInput) => (e: { target: { value: string } }) =>
    setForm({ ...form, [k]: e.target.value });

  const whatsappText = () =>
    [
      "Hi Fumati Engineers, I'd like a quote.",
      form.name && `Name: ${form.name}`,
      form.service && `Service: ${form.service}`,
      form.location && `Location: ${form.location}`,
      form.budget && `Budget: ${form.budget}`,
      form.message && `Details: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = enquirySchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setBusy(true);
    try {
      const res = await submitEnquiry({ data: parsed.data });
      if (res.ok) {
        setSent(true);
        toast.success("Thank you! We'll be in touch within 24 hours.");
      } else {
        toast.error(res.error ?? "Something went wrong. Please WhatsApp us instead.");
      }
    } catch {
      toast.error("Something went wrong. Please WhatsApp us instead.");
    }
    setBusy(false);
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const field =
    "w-full rounded-md border border-input bg-background px-4 py-3.5 text-base outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-500/20";

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Let's forge your <span className="text-red-500">next project</span>.
          </>
        }
        text="Consultations, quotations and engineering partnerships. We usually reply within 24 hours."
        image="/images/fumati-engineering-workshop-waterfalls.webp"
        crumb="Contact"
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          <SectionHead
            eyebrow="Talk to us"
            title="We're here to help."
            text="Whether you have full drawings or just an idea, we'll help turn it into something extraordinary."
          />
          <div className="grid gap-4 pt-6">
            <InfoCard icon={Phone} title="Phone / WhatsApp">
              {c.phones.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="block font-semibold text-green-700 hover:text-red-600"
                >
                  {p.display}
                </a>
              ))}
            </InfoCard>
            <InfoCard icon={Mail} title="Email">
              <a
                href={`mailto:${c.email}`}
                className="break-all font-semibold text-green-700 hover:text-red-600"
              >
                {c.email}
              </a>
            </InfoCard>
            <InfoCard icon={MapPin} title="Head office & workshop">
              <p className="font-semibold text-green-700">{c.address}</p>
            </InfoCard>
            {c.shop && (
              <InfoCard icon={Store} title="Hardware shop">
                <p className="font-semibold text-green-700">{c.shop}</p>
              </InfoCard>
            )}
            <InfoCard icon={Clock} title="Business hours">
              <dl className="space-y-1 text-sm">
                {c.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-6">
                    <dt className="text-muted-foreground">{h.days}</dt>
                    <dd className="font-semibold text-green-700">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </InfoCard>
            <a
              href={c.whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="btn w-full bg-[#25D366] text-white hover:bg-[#1ebe5a]"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp now
            </a>
          </div>
        </div>

        <Reveal className="relative rounded-md border bg-background p-6 shadow-card sm:p-10">
          <span className="absolute left-0 top-10 h-14 w-1.5 bg-red-600" />
          {sent ? (
            <div className="py-16 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-700 text-primary-foreground">
                <Send className="h-7 w-7" />
              </span>
              <h2 className="mt-6 text-3xl font-extrabold text-green-700">Request received!</h2>
              <p className="mt-3 text-muted-foreground">
                Thank you, {form.name.split(" ")[0]}. Our team will contact you within 24 hours.
                Want a faster answer?
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={c.whatsappLink(whatsappText())}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-red"
                >
                  <MessageCircle className="h-4 w-4" /> Send on WhatsApp too
                </a>
                <button
                  onClick={() => (setForm(empty), setSent(false))}
                  className="btn btn-outline-green"
                >
                  New request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5" noValidate>
              <div>
                <p className="eyebrow text-red-600">Free quotation</p>
                <h2 className="mt-2 text-3xl font-extrabold text-green-700">Request a quote</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-semibold">
                  Full name *
                  <input
                    required
                    value={form.name}
                    onChange={set("name")}
                    autoComplete="name"
                    className={field}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Phone / WhatsApp *
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    autoComplete="tel"
                    className={field}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    autoComplete="email"
                    className={field}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Service required
                  <select value={form.service} onChange={set("service")} className={field}>
                    <option value="">Select a service…</option>
                    {services.map((s) => (
                      <option key={s.id}>{s.title}</option>
                    ))}
                    {form.service && !services.some((s) => s.title === form.service) && (
                      <option>{form.service}</option>
                    )}
                    <option>Other</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Project location
                  <input
                    value={form.location}
                    onChange={set("location")}
                    placeholder="e.g. Harare, Norton, Bulawayo"
                    className={field}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Budget (optional)
                  <select value={form.budget} onChange={set("budget")} className={field}>
                    <option value="">Choose a range…</option>
                    {BUDGETS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-semibold">
                Project details *
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="What do you need built, sizes, timelines…"
                  className={field}
                />
              </label>
              <label className="hidden" aria-hidden>
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website ?? ""}
                  onChange={set("website")}
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={busy} className="btn btn-red magnetic flex-1">
                  {busy ? (
                    "Sending…"
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send request
                    </>
                  )}
                </button>
                <a
                  href={c.whatsappLink(whatsappText())}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-green flex-1"
                >
                  <MessageCircle className="h-4 w-4" /> Send via WhatsApp
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                Have drawings or photos? Send the request, then share them with us on WhatsApp.
              </p>
            </form>
          )}
        </Reveal>
      </section>

      {sections.contact_map && c.mapQuery && (
        <section className="h-[26rem] w-full border-y bg-green-50">
          <iframe
            title="Map to Fumati Engineers, Waterfalls, Harare"
            src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full grayscale-[40%]"
          />
        </section>
      )}

      {sections.contact_faq && faqs.length > 0 && (
        <section className="mx-auto max-w-4xl px-5 py-24">
          <SectionHead
            eyebrow="FAQs"
            title="Questions we're often asked."
            center
            className="mb-12"
          />
          <FaqList />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        </section>
      )}
    </>
  );
}

function InfoCard({
  icon: I,
  title,
  children,
}: {
  icon: typeof Phone;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-md border p-5 transition-colors hover:border-green-700">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-green-700 text-primary-foreground">
        <I className="h-5 w-5" />
      </span>
      <div>
        <p className="eyebrow !text-[10px] text-muted-foreground">{title}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
