/**
 * Everything the owner manages as a simple ordered list lives here: one definition
 * per collection drives the D1 column whitelist, the server-side validation and the
 * dashboard form. Adding a field means adding it here and to a migration — nothing else.
 *
 * Kept free of imports so `scripts/build-seed.ts` can read it with plain Node.
 */

export type FieldType = "text" | "textarea" | "lines" | "image" | "select" | "url" | "icon";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  max?: number;
  required?: boolean;
  options?: readonly { value: string; label: string }[];
  placeholder?: string;
  help?: string;
};

export type CollectionDef = {
  table: string;
  label: string;
  singular: string;
  description: string;
  /** The field shown as the row's title in the dashboard list. */
  titleField: string;
  fields: readonly FieldDef[];
};

/** Icons the owner can pick for values, reasons and industries (lucide names). */
export const ICON_OPTIONS = [
  "Award",
  "ShieldCheck",
  "HardHat",
  "Wrench",
  "Users",
  "Clock",
  "LifeBuoy",
  "Gem",
  "Handshake",
  "Lightbulb",
  "Target",
  "Flag",
  "Factory",
  "Building2",
  "Pickaxe",
  "Tractor",
  "Landmark",
  "Church",
  "Home",
  "Truck",
  "Zap",
  "Cog",
  "Ruler",
  "Hammer",
  "Trophy",
  "Leaf",
  "Heart",
].map((v) => ({ value: v, label: v }));

export const collections = {
  hero_slides: {
    table: "hero_slides",
    label: "Hero slideshow",
    singular: "slide",
    description:
      "The photos that cross-fade and slowly zoom behind the big heading on the home page. Use wide, sharp landscape photos (at least 1600px across).",
    titleField: "caption",
    fields: [
      { key: "image", label: "Photo", type: "image", required: true },
      {
        key: "caption",
        label: "Caption",
        type: "text",
        max: 120,
        placeholder: "e.g. Steel frame erection, Harare CBD",
      },
    ],
  },
  services: {
    table: "services",
    label: "Services",
    singular: "service",
    description: "Shown on the home page, the Services page and in the footer.",
    titleField: "title",
    fields: [
      { key: "title", label: "Service name", type: "text", max: 80, required: true },
      { key: "short", label: "One-line summary", type: "textarea", max: 220, required: true },
      { key: "body", label: "Longer description", type: "textarea", max: 1200 },
      { key: "bullets", label: "What's included — one per line", type: "lines", max: 1200 },
      { key: "image", label: "Photo", type: "image" },
    ],
  },
  team: {
    table: "team",
    label: "Team",
    singular: "team member",
    description:
      "The people on the Team page and the home page. The CEO's own spotlight is edited under Company → CEO.",
    titleField: "name",
    fields: [
      {
        key: "name",
        label: "Full name",
        type: "text",
        max: 80,
        required: true,
        placeholder: "e.g. Eng. T. Moyo",
      },
      {
        key: "role",
        label: "Job title",
        type: "text",
        max: 80,
        required: true,
        placeholder: "e.g. Workshop Manager",
      },
      {
        key: "department",
        label: "Department",
        type: "select",
        options: [
          { value: "Leadership", label: "Leadership" },
          { value: "Engineering", label: "Engineering" },
          { value: "Operations", label: "Operations" },
          { value: "Workshop & Site", label: "Workshop & Site" },
          { value: "Administration", label: "Administration" },
        ],
      },
      { key: "bio", label: "Short bio", type: "textarea", max: 400 },
      { key: "photo", label: "Photo", type: "image" },
      { key: "email", label: "Email (optional)", type: "text", max: 120 },
      { key: "linkedin", label: "LinkedIn link (optional)", type: "url", max: 300 },
    ],
  },
  testimonials: {
    table: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    description:
      "What clients say. Add a photo of the person, or a scan/photo of their recommendation letter — visitors can open the letter full size.",
    titleField: "name",
    fields: [
      { key: "name", label: "Client name", type: "text", max: 80, required: true },
      {
        key: "role",
        label: "Their title",
        type: "text",
        max: 80,
        placeholder: "e.g. Project Director",
      },
      { key: "org", label: "Company / organisation", type: "text", max: 120 },
      { key: "quote", label: "What they said", type: "textarea", max: 900, required: true },
      { key: "photo", label: "Picture", type: "image" },
      {
        key: "photo_kind",
        label: "The picture is…",
        type: "select",
        options: [
          { value: "person", label: "A photo of the person" },
          { value: "letter", label: "A recommendation letter" },
          { value: "logo", label: "Their company logo" },
        ],
      },
      {
        key: "rating",
        label: "Star rating",
        type: "select",
        options: [
          { value: "5", label: "★★★★★" },
          { value: "4", label: "★★★★" },
          { value: "", label: "No stars" },
        ],
      },
    ],
  },
  clients: {
    table: "clients",
    label: "Brands & clients",
    singular: "brand",
    description:
      "Companies Fumati has worked with, shown in the logo strip and on the Awards & Clients page. A logo with a transparent or white background looks best.",
    titleField: "name",
    fields: [
      { key: "name", label: "Company name", type: "text", max: 100, required: true },
      { key: "logo", label: "Logo", type: "image" },
      { key: "url", label: "Website (optional)", type: "url", max: 300 },
    ],
  },
  awards: {
    table: "awards",
    label: "Awards",
    singular: "award",
    description: "Awards and recognition, shown on the home page and the Awards page.",
    titleField: "title",
    fields: [
      { key: "title", label: "Award", type: "text", max: 120, required: true },
      { key: "organisation", label: "Awarded by", type: "text", max: 120 },
      { key: "year", label: "Year", type: "text", max: 12 },
      { key: "recipient", label: "Recipient (if a person)", type: "text", max: 80 },
      { key: "description", label: "Description", type: "textarea", max: 400 },
      { key: "image", label: "Photo of the award", type: "image" },
    ],
  },
  core_values: {
    table: "core_values",
    label: "Core values",
    singular: "value",
    description: "The values on the About page, next to the mission and vision.",
    titleField: "title",
    fields: [
      { key: "title", label: "Value", type: "text", max: 60, required: true },
      { key: "text", label: "What it means", type: "textarea", max: 240 },
      { key: "icon", label: "Icon", type: "icon", options: ICON_OPTIONS },
    ],
  },
  why_us: {
    table: "why_us",
    label: "Why choose us",
    singular: "reason",
    description: "The reasons clients choose Fumati, on the home and About pages.",
    titleField: "title",
    fields: [
      { key: "title", label: "Reason", type: "text", max: 60, required: true },
      { key: "text", label: "Explanation", type: "textarea", max: 240 },
      { key: "icon", label: "Icon", type: "icon", options: ICON_OPTIONS },
    ],
  },
  timeline: {
    table: "timeline",
    label: "Our journey",
    singular: "milestone",
    description: "Milestones on the About page timeline, top to bottom.",
    titleField: "title",
    fields: [
      { key: "year", label: "Year", type: "text", max: 12 },
      { key: "title", label: "Milestone", type: "text", max: 100, required: true },
      { key: "text", label: "Details", type: "textarea", max: 300 },
    ],
  },
  industries: {
    table: "industries",
    label: "Industries",
    singular: "industry",
    description: "Sectors served, on the Services page.",
    titleField: "title",
    fields: [
      { key: "title", label: "Industry", type: "text", max: 60, required: true },
      { key: "text", label: "Short description", type: "textarea", max: 200 },
      { key: "icon", label: "Icon", type: "icon", options: ICON_OPTIONS },
    ],
  },
  process_steps: {
    table: "process_steps",
    label: "Our process",
    singular: "step",
    description: "How a project runs, from first call to after-care.",
    titleField: "title",
    fields: [
      { key: "title", label: "Step", type: "text", max: 60, required: true },
      { key: "text", label: "What happens", type: "textarea", max: 240 },
    ],
  },
  faqs: {
    table: "faqs",
    label: "FAQs",
    singular: "question",
    description:
      "Common questions on the Contact page. Google can show these straight in search results.",
    titleField: "question",
    fields: [
      { key: "question", label: "Question", type: "text", max: 160, required: true },
      { key: "answer", label: "Answer", type: "textarea", max: 900, required: true },
    ],
  },
} as const satisfies Record<string, CollectionDef>;

export type CollectionKey = keyof typeof collections;
export const collectionKeys = Object.keys(collections) as CollectionKey[];

export const isCollectionKey = (value: unknown): value is CollectionKey =>
  typeof value === "string" && value in collections;

export type FieldKey<K extends CollectionKey> = (typeof collections)[K]["fields"][number]["key"];

/** A row as the site sees it: every content field is a string, never null. */
export type ItemOf<K extends CollectionKey> = { id: number; hidden: boolean } & {
  [F in FieldKey<K>]: string;
};

/** Any collection's row, for the generic dashboard editor. */
export type CollectionItem = {
  id: number;
  hidden: boolean;
  [field: string]: string | number | boolean;
};

/* ---------- projects (they have their own editor and gallery) ---------- */

export const PROJECT_CATEGORIES = [
  "Stadiums & Landmarks",
  "Structural & Roofing",
  "Bridges & Infrastructure",
  "Commercial & Glass",
  "Gates & Metalwork",
  "Equipment & Products",
  "Mechanical & Plant",
] as const;

export const PROJECT_STATUSES = ["Completed", "In Progress", "Design"] as const;

/* ---------- sections the owner can switch off ---------- */

export const SECTIONS = [
  { key: "home_stats", label: "Numbers band", page: "Home" },
  { key: "home_clients", label: "Brands strip", page: "Home" },
  { key: "home_about", label: "Who we are", page: "Home" },
  { key: "home_services", label: "Services", page: "Home" },
  { key: "home_projects", label: "Featured projects", page: "Home" },
  { key: "home_why", label: "Why choose us", page: "Home" },
  { key: "home_process", label: "Our process", page: "Home" },
  { key: "home_awards", label: "Awards", page: "Home" },
  { key: "home_team", label: "Team preview", page: "Home" },
  { key: "home_testimonials", label: "Testimonials", page: "Home" },
  { key: "home_cta", label: "Get-a-quote banner", page: "Home" },
  { key: "about_mission", label: "Mission, vision & values", page: "About" },
  { key: "about_ceo", label: "CEO message", page: "About" },
  { key: "about_timeline", label: "Our journey timeline", page: "About" },
  { key: "about_facilities", label: "Facilities & safety", page: "About" },
  { key: "services_industries", label: "Industries", page: "Services" },
  { key: "services_process", label: "Process", page: "Services" },
  { key: "page_team", label: "Team page (and menu link)", page: "Pages" },
  { key: "page_awards", label: "Awards & Clients page (and menu link)", page: "Pages" },
  { key: "contact_faq", label: "FAQs", page: "Contact" },
  { key: "contact_map", label: "Map", page: "Contact" },
  { key: "whatsapp_button", label: "Floating WhatsApp button", page: "Everywhere" },
  { key: "loader", label: "Opening loader animation", page: "Everywhere" },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];
