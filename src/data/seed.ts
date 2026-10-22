/**
 * The content the site ships with. It seeds D1 (`npm run seed` writes
 * migrations/0002_seed.sql from this file) and is also the fallback the site renders
 * if the database is ever unreachable, so a visitor never sees a broken page.
 *
 * Kept free of imports so plain Node can read it.
 * Facts marked "confirm" came from earlier versions of the site and still need
 * checking with Fumati; everything else is from Fumati's own materials.
 */

const img = (name: string) => `/images/${name}.webp`;

export const SEED_SETTINGS = {
  // Company
  company_name: "Fumati Engineers",
  legal_name: "Fumati Group t/a Fumati Engineering",
  tagline: "Turning Steel Into Gold",
  founded_year: "2008", // confirm
  brand_promise:
    "Every beam we install and supply is a commitment to quality, safety and reliability.",
  about_short:
    "Founded by Mr. Tinashe Changweya, Fumati grew from a determined local team into one of Zimbabwe's most respected engineering brands. We design, fabricate and erect — from stadium roofs and bridges to mining equipment — all from our own workshop in Waterfalls, Harare.",
  about_long:
    "Fumati Engineers (Fumati Group t/a Fumati Engineering) is a multi-award-winning engineering company based in Waterfalls, Harare, specialising in structural engineering, mechanical engineering, steel fabrication, plant fitting, and equipment production and services.\n\nFounded by Mr. Tinashe Changweya, Fumati has grown from a determined local team into one of Zimbabwe's most recognisable engineering brands, delivering landmark projects — from The Heart Stadium to bridges, large-span roofs and multi-storey steel frames — with precision and pride.\n\nWe manufacture mining equipment, agricultural tools, business equipment, steel furniture, door and window frames, sliding gates and tank stands, and we run a hardware shop along Simon Mazorodze Road, Harare. One accountable team takes every job from drawing board to handover.",
  mission:
    "To deliver world-class structural, mechanical and fabrication engineering that turns our clients' ambitions into lasting steel — safely, on time and to the highest standard.",
  vision:
    "To be Africa's most trusted engineering and fabrication company, proudly built in Zimbabwe.",

  // Hero
  hero_eyebrow: "Zimbabwe's Multi-Award-Winning Engineering Company",
  hero_title_1: "Turning Steel",
  hero_title_2: "Into Gold.",
  hero_text:
    "Structural, mechanical and steel fabrication specialists delivering landmark infrastructure across Zimbabwe — stadiums, bridges, roofs, plant and precision metalwork, built in our own Harare workshop.",

  // Stats (value|suffix|label)
  stats: JSON.stringify([
    { value: "15", suffix: "+", label: "Years of Excellence" },
    { value: "120", suffix: "+", label: "Projects Delivered" },
    { value: "50", suffix: "+", label: "Skilled Professionals" },
    { value: "8", suffix: "", label: "Engineering Services" },
  ]),

  // CEO
  ceo_name: "Mr. Tinashe Changweya",
  ceo_role: "CEO & Founder",
  ceo_photo: img("tinashe-changweya-award"),
  ceo_bio:
    "Tinashe founded Fumati Engineers with one conviction: Zimbabwe's infrastructure can be built by Zimbabweans, to world standards. Under his leadership Fumati has grown from a small fabrication team into a multi-award-winning engineering company trusted with stadiums, bridges and industrial structures.",
  ceo_quote:
    "We don't just build structures — we build Zimbabwe. Every weld, every beam, every project is a commitment to excellence and a statement of what our nation is capable of.",
  ceo_credentials:
    "40 Under 40 Young Project Leaders in Zimbabwe 2026 — CIPMZ\nOutstanding Businessman of the Year — Northern Region Megafest Business Awards\nLed Fumati to Company of the Year — Engineering Services\n15+ years of engineering leadership",

  // Contact
  phone1: "+263 8644 271 926",
  phone2: "+263 71 996 0330",
  phone3: "+263 77 196 0330",
  whatsapp: "263771960330",
  email: "mechanicalengineering18@gmail.com",
  address: "1/5 Sherwood Crescent, Waterfalls, Harare, Zimbabwe",
  shop_address: "Simon Mazorodze Road, Harare",
  hours: "Mon – Fri|08:00 – 17:00\nSaturday|08:00 – 13:00\nSunday|Closed",
  facebook: "https://www.facebook.com/Fumatiengineering",
  instagram: "",
  linkedin: "",
  youtube: "",
  tiktok: "",
  map_query: "Sherwood Crescent, Waterfalls, Harare, Zimbabwe",

  // SEO
  seo_title: "Fumati Engineers | Structural, Mechanical & Steel Fabrication, Harare",
  seo_description:
    "Fumati Engineers (Fumati Group) — multi-award-winning structural engineering, mechanical engineering and steel fabrication company in Harare, Zimbabwe. Steel structures, roofing, bridges, gates and plant fitting.",
  seo_keywords:
    "Fumati Engineers, Fumati Group, steel fabrication Harare, structural engineering Zimbabwe, mechanical engineering Harare, steel structures Zimbabwe, roof trusses Harare, steel gates Harare, plant fitting Zimbabwe, mining equipment manufacturers Zimbabwe, engineering company Harare",
  google_verification: "",

  company_profile_pdf: "",
};

type Row = Record<string, string>;

export const SEED_COLLECTIONS: Record<string, Row[]> = {
  hero_slides: [
    {
      image: img("steel-frame-structure-harare"),
      caption: "Multi-storey structural steel frame, Harare",
    },
    {
      image: img("fumati-engineering-workshop-waterfalls"),
      caption: "The Fumati workshop, Waterfalls",
    },
    { image: img("column-foundations-formwork"), caption: "Column foundations and formwork" },
    { image: img("fumati-site-team-blockwork"), caption: "Fumati site team at work" },
  ],
  services: [
    {
      title: "Structural Engineering",
      short:
        "Analysis, design and erection of steel structures that carry real load — from portal frames to multi-storey buildings.",
      body: "Our engineers design and erect commercial and industrial steel structures, large-span roof trusses, terraces and grandstands, and steel bridge elements. Every member is checked, fabricated in our own workshop and erected by our own crews.",
      bullets:
        "Commercial & industrial steel structures\nMulti-storey steel frames\nLarge-span roof trusses\nTerraces and grandstands\nSteel bridge elements",
      image: img("steel-frame-structure-harare"),
    },
    {
      title: "Mechanical Engineering",
      short: "Heavy machinery, conveyors and plant that keep industry and mining moving.",
      body: "From installing heavy machinery to maintaining whole plants, we keep production running with planned maintenance contracts and rapid breakdown response.",
      bullets:
        "Heavy machinery installation\nConveyor systems\nIndustrial ventilation & HVAC\nPlant maintenance contracts",
      image: img("engineers-steel-erection"),
    },
    {
      title: "Steel Fabrication & Welding",
      short: "Precision cutting, welding and custom components from our own Harare workshop.",
      body: "Our Waterfalls workshop turns raw steel into structural beams, trusses, railings, frames and one-off components, with quality checks at every stage.",
      bullets:
        "Custom steel components\nPrecision welding\nStructural beams and trusses\nRailings and balustrades\nHeavy plate work",
      image: img("fumati-engineering-workshop-waterfalls"),
    },
    {
      title: "Plant Fitting",
      short: "Installation, alignment and commissioning of industrial and mining plant.",
      body: "We install, align and commission plant for mines, factories and processing facilities, and stay on for handover and training.",
      bullets:
        "Plant installation\nShaft and drive alignment\nCommissioning\nMining plant fit-outs",
      image: img("engineers-welding-steel-frame"),
    },
    {
      title: "Equipment Production",
      short: "Mining, agricultural and commercial equipment — even double-deck boats.",
      body: "If it is made of steel, we can build it: mining equipment, agricultural tools, food-trade containers, fryer stands and custom vessels.",
      bullets:
        "Mining equipment\nAgricultural tools\nFood shop containers\nCommercial kitchen stands\nSteel boats",
      image: img("double-deck-steel-boat"),
    },
    {
      title: "General Construction",
      short: "Turnkey builds from foundation to handover — stadiums, schools, churches and shops.",
      body: "Our construction teams handle groundworks, foundations, blockwork and finishes, so steel and civil works run as one programme under one contract.",
      bullets:
        "Foundations and groundworks\nStadiums and terraces\nSchools and churches\nShops and partitioning\nTurnkey delivery",
      image: img("builders-at-work-foundations"),
    },
    {
      title: "Gates, Doors & Architectural Metalwork",
      short: "Gates, frames and steel-and-glass that make an entrance.",
      body: "Classic and sliding gates, garage doors, frames, glass-and-steel facades and signage — designed and fabricated to last.",
      bullets:
        "Classic and sliding gates\nGarage doors\nDoor and window frames\nGlass and steel frameworks\nMetal signage and banners",
      image: img("the-heart-stadium-gate-banner"),
    },
    {
      title: "Hardware & Steel Products",
      short: "Tank stands, steel furniture and frames at our Simon Mazorodze Road hardware shop.",
      body: "Walk in to our hardware shop for ready-made steel products, or order to size.",
      bullets:
        "Tank stands\nSteel beds and furniture\nDoor and window frames\nWalk-in at Simon Mazorodze Road",
      image: img("premier-steel-bed"),
    },
  ],
  team: [
    {
      name: "Mr. Tinashe Changweya",
      role: "CEO & Founder",
      department: "Leadership",
      bio: "Founder and driving force of Fumati Engineers. Award-winning businessman leading Fumati's mission to build Zimbabwe with local talent and global standards.",
      photo: img("tinashe-changweya-award"),
      email: "",
      linkedin: "",
    },
  ],
  testimonials: [],
  clients: [{ name: "The Heart Stadium", logo: "", url: "" }],
  awards: [
    {
      title: "40 Under 40 Young Project Leaders in Zimbabwe",
      organisation:
        "Chartered Institute of Project Managers Zimbabwe (CIPMZ), with the Institute of Project Management Australia",
      year: "2026",
      recipient: "Mr. Tinashe Changweya, CEO & Founder",
      description:
        "Listed among Zimbabwe's 40 Under 40 Young Project Leaders for hard work, innovation and determination in delivering projects — recognition of his contribution and his potential to shape the future of the profession.",
      image: img("cipmz-40-under-40-tinashe-changweya-2026"),
    },
    {
      title: "Company of the Year — Engineering Services",
      organisation: "Zimbabwe Business Awards",
      year: "",
      recipient: "Fumati Group",
      description:
        "Honoured as the leading engineering services company at the Zimbabwe Business Awards.",
      image: img("award-company-of-the-year-engineering"),
    },
    {
      title: "Outstanding Businessman of the Year",
      organisation: "Northern Region Megafest Business Awards",
      year: "",
      recipient: "Mr. Tinashe Changweya",
      description: "Recognising the leadership behind Fumati's growth.",
      image: img("tinashe-changweya-award"),
    },
  ],
  core_values: [
    { title: "Quality", text: "Every weld, every beam, checked and built to last.", icon: "Gem" },
    {
      title: "Safety",
      text: "Zero harm on every site — helmets, harnesses and method statements, always.",
      icon: "ShieldCheck",
    },
    {
      title: "Integrity",
      text: "Honest pricing, honest timelines, honest work.",
      icon: "Handshake",
    },
    { title: "Reliability", text: "We deliver on our word, and on programme.", icon: "Clock" },
    {
      title: "Innovation",
      text: "Modern CAD, 3D design and fabrication technology on every job.",
      icon: "Lightbulb",
    },
    {
      title: "Local Empowerment",
      text: "Building Zimbabwe with Zimbabwean engineers, welders and fabricators.",
      icon: "Flag",
    },
  ],
  why_us: [
    {
      title: "15+ Years Track Record",
      text: "Landmark steel delivered across Zimbabwe, project after project.",
      icon: "Award",
    },
    {
      title: "Safety-First Culture",
      text: "A zero-accident commitment, enforced on every single site.",
      icon: "HardHat",
    },
    {
      title: "In-House Workshop",
      text: "Design, fabricate and install under one roof — no handover gaps.",
      icon: "Factory",
    },
    {
      title: "Expert Team of 50+",
      text: "Engineers, welders, riggers and fabricators who own their craft.",
      icon: "Users",
    },
    { title: "On-Time Delivery", text: "Programmes planned to the day, and kept.", icon: "Clock" },
    {
      title: "Dedicated After-Care",
      text: "We stay with your structure long after handover.",
      icon: "LifeBuoy",
    },
  ],
  timeline: [
    {
      year: "2008",
      title: "Fumati is founded",
      text: "Mr. Tinashe Changweya starts a determined local engineering and fabrication team.",
    },
    {
      year: "",
      title: "Workshop in Waterfalls",
      text: "Our fabrication workshop opens at Sherwood Crescent, Waterfalls, Harare.",
    },
    {
      year: "",
      title: "Hardware shop opens",
      text: "Steel products go retail on Simon Mazorodze Road.",
    },
    {
      year: "",
      title: "The Heart Stadium",
      text: "Structural steel, terraces, roofing and gate metalworks for one of Harare's landmark venues.",
    },
    {
      year: "",
      title: "Company of the Year",
      text: "Named Company of the Year — Engineering Services at the Zimbabwe Business Awards.",
    },
    {
      year: "2026",
      title: "40 Under 40 Young Project Leader",
      text: "CEO Tinashe Changweya listed among CIPMZ's 40 Under 40 Young Project Leaders in Zimbabwe.",
    },
  ],
  industries: [
    {
      title: "Sports & Entertainment",
      text: "Stadiums, terraces, canopies and gates.",
      icon: "Trophy",
    },
    {
      title: "Mining & Minerals",
      text: "Plant structures, equipment and maintenance.",
      icon: "Pickaxe",
    },
    {
      title: "Manufacturing & Industrial",
      text: "Factories, warehouses and machinery.",
      icon: "Factory",
    },
    {
      title: "Commercial & Retail",
      text: "Malls, shops, offices and glass facades.",
      icon: "Building2",
    },
    {
      title: "Transport & Infrastructure",
      text: "Bridges, toll gates and public works.",
      icon: "Truck",
    },
    {
      title: "Education & Religious",
      text: "Schools, churches and community halls.",
      icon: "Church",
    },
    { title: "Agriculture", text: "Farm structures, tools and tank stands.", icon: "Tractor" },
    { title: "Residential", text: "Gates, roofs, frames and steel furniture.", icon: "Home" },
  ],
  process_steps: [
    { title: "Consultation", text: "Site visit, needs analysis and a clear, honest quotation." },
    { title: "Design", text: "CAD and 3D modelling, structural analysis and approvals." },
    { title: "Fabrication", text: "Precision cutting, welding and assembly in our own workshop." },
    { title: "Installation", text: "Safe on-site erection by our own trained crews." },
    { title: "Handover", text: "Inspection, documentation and client walk-through." },
    { title: "After-Care", text: "Maintenance, support and a long-term partnership." },
  ],
  faqs: [
    {
      question: "Where is Fumati Engineers located?",
      answer:
        "Our head office and fabrication workshop are at 1/5 Sherwood Crescent, Waterfalls, Harare. Our hardware shop is on Simon Mazorodze Road, Harare.",
    },
    {
      question: "Do you work outside Harare?",
      answer:
        "Yes. We deliver projects across Zimbabwe — stadiums, bridges, mines, farms and commercial sites — and can discuss work beyond our borders.",
    },
    {
      question: "What kind of steel structures do you build?",
      answer:
        "Portal frames, warehouses, multi-storey steel frames, large-span roof trusses, terraces and grandstands, canopies, bridges and glass-and-steel facades.",
    },
    {
      question: "Can you design as well as fabricate and install?",
      answer:
        "Yes. We handle design (CAD/3D), fabrication in our own workshop and installation by our own crews, so you deal with one accountable team.",
    },
    {
      question: "How do I get a quotation?",
      answer:
        "Send us your drawings or a description through the quote form or WhatsApp. We usually respond within 24 hours and can arrange a site visit.",
    },
    {
      question: "Do you make gates, doors and steel furniture?",
      answer:
        "Yes — classic and sliding gates, garage doors, door and window frames, tank stands, steel beds and more, made to order or from our hardware shop.",
    },
  ],
};

export type SeedMedia = { kind: "image" | "video" | "embed"; url: string; alt: string };
export type SeedProject = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  status: string;
  summary: string;
  body: string;
  scope: string;
  challenge: string;
  solution: string;
  result: string;
  featured: boolean;
  published: boolean;
  media: SeedMedia[];
};

const p = (
  base: Pick<SeedProject, "slug" | "title" | "category" | "summary"> & Partial<SeedProject>,
): SeedProject => ({
  location: "",
  year: "",
  client: "",
  status: "Completed",
  body: "",
  scope: "",
  challenge: "",
  solution: "",
  result: "",
  featured: false,
  published: true,
  media: [],
  ...base,
});

const photos = (alt: string, ...names: string[]): SeedMedia[] =>
  names.map((n, i) => ({
    kind: "image",
    url: img(n),
    alt: names.length > 1 ? `${alt} (${i + 1})` : alt,
  }));

export const SEED_PROJECTS: SeedProject[] = [
  p({
    slug: "the-heart-stadium",
    title: "The Heart Stadium",
    category: "Stadiums & Landmarks",
    location: "Waterfalls, Harare",
    summary:
      "Structural steel terraces, roof canopies and the landmark entrance gate and banner metalworks.",
    body: "Fumati delivered the structural steelwork for The Heart Stadium in Waterfalls, Harare — terrace steel, roof canopies over the stands and the signature entrance gate and banner. Steel was fabricated in our nearby Waterfalls workshop and erected by our own crews, including crane-lifted installation of the arched entrance banner.",
    scope:
      "Terrace structural steel\nRoof canopy trusses and sheeting\nEntrance gate fabrication\nArched banner fabrication and crane installation",
    challenge:
      "Long-span canopies over live terraces and a large arched banner that had to be lifted into place in one piece.",
    solution:
      "Workshop pre-assembly in Waterfalls, staged delivery and a planned crane lift for the banner.",
    result:
      "A landmark venue with a signature entrance that has become one of Harare's most photographed gateways.",
    featured: true,
    media: photos(
      "The Heart Stadium steelwork by Fumati Engineers",
      "the-heart-stadium-harare",
      "stadium-terraces-steel-canopy",
      "stadium-terrace-roof-steelwork",
      "the-heart-stadium-gate-banner",
      "the-heart-stadium-gate-installation",
    ),
  }),
  p({
    slug: "multi-storey-steel-frame-harare",
    title: "Multi-Storey Steel Frame",
    category: "Structural & Roofing",
    location: "Harare",
    summary: "A multi-level structural steel frame rising through a reinforced concrete core.",
    scope:
      "Steel columns and beams\nMulti-level bracing\nConnections to concrete core\nSite erection",
    featured: true,
    media: photos(
      "Multi-storey structural steel frame by Fumati Engineers",
      "steel-frame-structure-harare",
      "multi-storey-steel-structure",
      "steel-frame-multi-level-building",
    ),
  }),
  p({
    slug: "bridge-construction",
    title: "Bridge Construction",
    category: "Bridges & Infrastructure",
    summary: "Bridge pier foundations, survey and setting-out on a river crossing.",
    scope:
      "Survey and setting out\nPier foundations\nStructural steel bridge elements\nCorrosion protection",
    featured: true,
    media: photos(
      "Bridge construction by Fumati Engineers",
      "bridge-pier-foundations",
      "bridge-construction-river-site",
      "bridge-survey-setting-out",
    ),
  }),
  p({
    slug: "large-span-roofing",
    title: "Large-Span Roofing Systems",
    category: "Structural & Roofing",
    summary: "Long-span steel roof trusses designed, fabricated, erected and sheeted.",
    scope: "Truss design\nFabrication\nErection\nPurlins and roof sheeting",
    featured: true,
    media: photos(
      "Large-span steel roofing by Fumati Engineers",
      "large-span-steel-roof-trusses",
      "roof-sheeting-installation",
      "steel-roof-structure-erection",
      "steel-roof-purlins",
      "completed-steel-roof",
    ),
  }),
  p({
    slug: "steel-portal-frame",
    title: "Steel Portal Frame Structure",
    category: "Structural & Roofing",
    summary: "A clear-span steel portal frame for an industrial building.",
    media: photos("Steel portal frame by Fumati Engineers", "steel-portal-frame-structure"),
  }),
  p({
    slug: "foundations-and-civil-works",
    title: "Foundations & Civil Works",
    category: "Structural & Roofing",
    location: "Harare",
    status: "In Progress",
    summary: "Column foundations, formwork and blockwork ahead of steel erection.",
    scope: "Excavation\nColumn bases and formwork\nFoundation blockwork\nSite supervision",
    media: photos(
      "Foundation works by Fumati Engineers",
      "column-foundations-formwork",
      "fumati-site-team-blockwork",
      "builders-at-work-foundations",
      "site-supervision-engineer",
      "construction-site-safety-notice",
    ),
  }),
  p({
    slug: "glass-and-steel-frameworks",
    title: "Glass & Steel Frameworks",
    category: "Commercial & Glass",
    summary: "Curved steel frameworks carrying contemporary glass facades.",
    featured: true,
    media: photos(
      "Glass and steel framework by Fumati Engineers",
      "glass-and-steel-building",
      "curved-glass-structure-frames",
      "glass-steel-framework-in-progress",
    ),
  }),
  p({
    slug: "toll-gate-3d-design",
    title: "Toll Gate 3D Design",
    category: "Bridges & Infrastructure",
    status: "Design",
    summary: "3D-designed toll plaza canopy concepts, engineered before a single cut.",
    media: photos("Toll gate 3D design by Fumati Engineers", "toll-gate-3d-design"),
  }),
  p({
    slug: "double-deck-steel-boat",
    title: "Double-Deck Steel Boat",
    category: "Equipment & Products",
    summary: "A double-deck pontoon boat, fabricated in steel — proof of our range.",
    featured: true,
    media: photos("Double-deck steel boat by Fumati Engineers", "double-deck-steel-boat"),
  }),
  p({
    slug: "steel-food-shop-container",
    title: "Steel Food Shop Container",
    category: "Equipment & Products",
    summary: "A trade-ready steel food shop container.",
    media: photos("Steel food shop container by Fumati Engineers", "steel-food-shop-container"),
  }),
  p({
    slug: "commercial-chip-fryer-stand",
    title: "Commercial Chip Fryer Stand",
    category: "Equipment & Products",
    summary: "A heavy-duty stainless and steel commercial fryer stand.",
    media: photos("Commercial chip fryer stand by Fumati Engineers", "commercial-chip-fryer-stand"),
  }),
  p({
    slug: "shops-partitioning",
    title: "Shops Partitioning & Balustrades",
    category: "Commercial & Glass",
    summary: "Glass shop partitioning with steel balustrades for a retail mall.",
    media: photos("Shops partitioning by Fumati Engineers", "shops-partitioning-steel-balustrade"),
  }),
  p({
    slug: "classic-steel-gates",
    title: "Classic Steel Gates",
    category: "Gates & Metalwork",
    summary: "Classic gates, crafted to last and built to impress.",
    media: photos("Classic steel gate by Fumati Engineers", "classic-steel-gate"),
  }),
  p({
    slug: "steel-garage-doors",
    title: "Steel Garage Doors",
    category: "Gates & Metalwork",
    summary: "Robust steel garage doors, made to measure.",
    media: photos("Steel garage door by Fumati Engineers", "steel-garage-door"),
  }),
  p({
    slug: "premier-steel-beds",
    title: "Premier Steel Beds",
    category: "Equipment & Products",
    summary: "Steel-and-timber premier beds from our hardware range.",
    media: photos("Premier steel bed by Fumati Engineers", "premier-steel-bed"),
  }),
  p({
    slug: "ngoni-stadium-norton",
    title: "Ngoni Stadium",
    category: "Stadiums & Landmarks",
    location: "Norton",
    summary: "Structural steelwork for one of Norton's sporting venues.",
    published: false, // confirm details and add photos, then publish from the dashboard
  }),
];

/** Large photos that also have a `-sm.webp` variant for cards. */
export const RESPONSIVE_IMAGES = [
  "steel-frame-structure-harare",
  "fumati-site-team-blockwork",
  "column-foundations-formwork",
  "site-supervision-engineer",
  "builders-at-work-foundations",
  "fumati-engineering-workshop-waterfalls",
  "construction-site-safety-notice",
].map(img);
