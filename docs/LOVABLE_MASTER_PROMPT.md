# MASTER PROMPT — Fumati Engineers Website (paste everything below the line into Lovable)

---

Build a premium, multi-page corporate website for **Fumati Engineers**, a multi-award-winning structural, mechanical and steel fabrication engineering company based in Waterfalls, Harare, Zimbabwe. Tagline: **"Turning Steel Into Gold."**

The site must work as the company's **digital company profile**: it should read like a serious engineering firm's corporate brochure, the kind that wins tenders with mining houses, councils, churches, developers and government, while still making it effortless for a small client to WhatsApp for a quote on their phone.

## 0. Creative freedom (read this first)
Treat this brief as the **foundation, not a cage.** Everything below tells you *what* the site must contain and *which brand rules* are fixed. *How* it looks and feels is yours to own. I want you to be bold and surprise me. Build something that would win an Awwwards Site of the Day and make every engineering firm in Africa jealous.

**Fixed (do not change):**
- The three brand colours (dark green, red, white) and the logo.
- The real company facts, contact details and project list.
- The pages and content listed.
- Mobile-first, fast and accessible.

**Open to your creativity (go wild, tastefully):**
- Layouts, section order within a page, and composition. If you see a better way to present something than what I describe, do it.
- Signature moments, for example:
  - a hero where steel beams or a truss draw themselves in on load (SVG line animation) before the photo reveals;
  - a parallax "construction" scroll story where a structure assembles as you scroll;
  - a cursor that leaves a faint welding-spark trail on the hero;
  - a 3D-tilt project card effect;
  - a horizontally scrolling project showcase;
  - an animated blueprint/grid background;
  - magnetic buttons;
  - kinetic oversized typography;
  - page transitions with a diagonal green/red wipe inspired by the slanted "F" in the logo.
  Pick the ideas that work and invent better ones.
- Micro-interactions, hover states, transitions and loading choreography.
- Extra sections or touches that strengthen the company profile, such as a "Fumati by the numbers" infographic, an interactive Zimbabwe map of project locations, or a "Watch us work" video slot.
- Copywriting polish: improve my wording wherever you can make it punchier, as long as the facts stay true.

**Guardrails for the creativity:**
- Wow, but never at the cost of clarity. A first-time visitor must understand within 5 seconds what Fumati does, why to trust them and how to get a quote.
- Animations stay smooth on a mid-range Android phone, and all are disabled under `prefers-reduced-motion`.
- Elegance over gimmicks: 2–3 unforgettable signature moments beat 20 random effects.
- Everything you invent must still feel unmistakably *Fumati*: industrial, precise, proud, Zimbabwean.

Wherever this brief is prescriptive about visuals (specific layouts, effects or component styles), read it as a suggestion. If your idea is better, go with yours.

## 1. Tech stack & structure
- React + Vite + TypeScript + Tailwind CSS + shadcn/ui, React Router for pages, Framer Motion for animation, lucide-react icons.
- Keep all editable content (services, projects, team, awards, clients, stats) in typed data files under `src/data/` (e.g. `projects.ts`, `services.ts`, `team.ts`, `awards.ts`, `clients.ts`), so content can be updated without touching components.
- All images live in `public/images/` and are referenced by path. Use the filenames listed in section 9. Until real images are uploaded, show a tasteful dark-green placeholder with the image name, never a broken image.
- Fully responsive (design mobile-first: most visitors are on phones in Zimbabwe), fast loading (lazy-load images, use `loading="lazy"`, compress), and accessible (alt text, focus states, contrast AA).
- SEO: unique `<title>` and meta description per page, Open Graph tags (og:image = logo), JSON-LD `LocalBusiness` schema with address and phone numbers, sitemap-friendly routes.

## 2. Brand identity (strict)
The brand has exactly **three colours: dark green, red and white.** Do not introduce gold, orange, blue or any other accent colour.

| Token | Hex | Use |
|---|---|---|
| `--green-900` | `#063D22` | Deepest green: footer, dark hero overlays, loader |
| `--green-700` (primary) | `#0B5D33` | Primary brand green: headings, nav, primary buttons, logo colour |
| `--green-500` | `#13874A` | Hover states, icons, small highlights |
| `--green-50` | `#EEF6F1` | Soft section backgrounds |
| `--red-600` (accent) | `#D62828` | Accent ONLY: key CTA ("Get a Quote"), highlighted words, stat numbers, active nav underline, badges |
| `--red-700` | `#A81E1E` | Red hover |
| `--white` | `#FFFFFF` | Main background, text on green |
| `--ink` | `#14211A` | Body text (near-black with a green tint) |
| `--muted` | `#5B6B62` | Secondary text |

Rules:
- White is the dominant colour (about 60%), green the structural colour (30%), red the spark (10%). Red should feel deliberate and rare, like a welding spark.
- Typography: **Montserrat** (800/700) for headings, uppercase for eyebrow labels with wide letter-spacing; **Inter** (400/500/600) for body text.
- The logo is a bold geometric green "F" with "FUMATI" and "TURNING STEEL INTO GOLD" underneath. Use it in the navbar, the footer, the favicon and the loader.
- Visual language: industrial and precise. Thin structural grid lines, diagonal cuts (clip-path) on section edges echoing the slanted strokes of the "F" logo, subtle steel-beam/truss line patterns in backgrounds, bold oversized numbers. Photography-led, with real site photos everywhere.
- Buttons: primary = red background + white text; secondary = green outline. Square-ish corners (`rounded-md`), not pill-shaped, because it feels more engineered.

## 3. Global elements
- **Loader:** dark-green screen, the logo assembles/scales in, the tagline "Turning Steel Into Gold" fades in, then a thin red progress line. Max 1.5 seconds, shown only on first visit.
- **Top bar (desktop):** phone numbers, email, "1/5 Sherwood Crescent, Waterfalls, Harare", Facebook icon.
- **Sticky navbar:** logo left; links: Home, About, Services, Projects, Team, Awards, Contact; red "Get a Quote" button right. Becomes solid white with shadow on scroll. On mobile, a full-screen dark-green slide-in menu with large links and call/WhatsApp buttons.
- **Floating WhatsApp button** (bottom right, green, pulse animation) linking to `https://wa.me/263771960330` with the prefilled text "Hi Fumati Engineers, I'd like a quote for…".
- **Footer (dark green):** logo + tagline + short company blurb; quick links; services list; contact details; Facebook link `https://www.facebook.com/Fumatiengineering`; "© {current year} Fumati Engineers. All rights reserved."
- Scroll-reveal animations (fade-up, stagger) that are subtle and respect `prefers-reduced-motion`.

## 4. Pages & sections

### 4.1 Home (`/`)
1. **Hero:** full-bleed photo of The Heart Stadium steel structure with a dark-green gradient overlay. Eyebrow: "Zimbabwe's Multi-Award-Winning Engineering Company". H1: "Turning **Steel** Into **Gold**." (the highlighted words in red). Sub: "Structural, mechanical and steel fabrication specialists delivering landmark infrastructure across Zimbabwe, from stadiums and bridges to mining equipment and custom gates." CTAs: "View Our Projects" (red) and "Get a Free Quote" (white outline). Small trust row: "Engineering Company of the Year", "120+ Projects", "Since 2008".
2. **Animated stats band:** 15+ Years of Excellence · 120+ Projects Delivered · 50+ Skilled Professionals · 5+ Major Awards (numbers count up when they come into view; numbers in red).
3. **Client/brand logo marquee:** "Trusted by organisations across Zimbabwe": an infinite-scrolling greyscale logo strip that turns to colour on hover (data from `clients.ts`).
4. **About teaser:** two overlapping photos (team + workshop), a short story, and a "Read Our Story" link.
5. **Services overview:** 6 cards with icons (see 4.3), each linking to the services page anchor.
6. **Featured projects:** the 6 strongest projects in a bento/masonry grid with hover reveal (title, category, location) and a "See Full Portfolio" link.
7. **Why Choose Us:** 6 points (see 4.1 list below) on a green-50 background.
8. **Awards strip:** the award photos with titles.
9. **Testimonial slider.**
10. **CTA banner:** dark green with a diagonal red stripe: "Have a project in mind? Let's forge it together." plus Call / WhatsApp / Get a Quote buttons.

**Why Choose Us (6 points):** 15+ Years Track Record · Safety-First Culture (zero-accident commitment on every site) · In-House Fabrication Workshop (design, fabricate, install under one roof) · Expert Team of 50+ engineers, welders and fabricators · On-Time Delivery · Dedicated After-Care & Support.

### 4.2 About / Company Profile (`/about`)
This is the heart of the "company profile". Sections:
1. Page hero with breadcrumb.
2. **Who We Are:** "Fumati Engineers is a multi-award-winning engineering company based in Waterfalls, Harare, specialising in structural engineering, mechanical engineering, fabrication engineering, plant fitting, and equipment production and services. Founded by Mr. Tinashe Changweya, Fumati has grown from a determined local team into one of Zimbabwe's most respected engineering brands, delivering iconic projects from stadiums to bridges with precision and pride. We manufacture mining equipment, agricultural tools, business equipment, steel furniture, door and window frames, sliding gates and tank stands, and we operate a hardware shop along Simon Mazorodze Road, Harare."
3. **Brand promise (pull-quote):** "Every beam we install and supply is a commitment to quality, safety and reliability."
4. **Mission, Vision & Values** as three large cards:
   - **Mission:** "To deliver world-class structural, mechanical and fabrication engineering solutions that turn our clients' ambitions into lasting steel reality, safely, on time and to the highest standard."
   - **Vision:** "To be Africa's most trusted engineering and fabrication company, proudly built in Zimbabwe."
   - **Core Values** (icon grid): Quality (every weld, every beam), Safety (zero harm on every site), Integrity (honest pricing, honest work), Reliability (we deliver on our word and on time), Innovation (modern CAD and fabrication technology), Local Empowerment (building Zimbabwe with Zimbabwean talent).
5. **Our Journey timeline** (vertical, animated): Founded (2008) → workshop established in Waterfalls → hardware shop opened on Simon Mazorodze Road → The Heart Stadium → Ngoni Stadium, Norton → Engineering Company of the Year award. Use the data from `timeline.ts`, which is easy to edit.
6. **CEO message:** photo of Mr. Tinashe Changweya + quote: "We don't just build structures, we build Zimbabwe. Every weld, every beam, every project is a commitment to excellence and a statement of what our nation is capable of."
7. **Our Facilities:** workshop and office photos.
8. **Safety & Quality commitment** section using the "Safety First at Construction Site" banner image.
9. **Download Company Profile (PDF)** button (link to `/company-profile.pdf`, placeholder for now).

### 4.3 Services (`/services`)
An alternating image/text layout, one section per service, each with an anchor id, a bullet list of what's included and an "Enquire about this service" button that opens the quote form with the service preselected.
1. **Structural Engineering:** analysis, design and erection of commercial and industrial steel structures, high-rise frameworks, large-span roof trusses, terraces and bridges.
2. **Mechanical Engineering:** heavy machinery installation, conveyor systems, industrial HVAC, plant maintenance contracts.
3. **Steel Fabrication & Welding:** custom steel components, precision welding, structural beams, railings, gates, heavy plate work.
4. **Plant Fitting:** installation, alignment and commissioning of industrial and mining plant.
5. **Equipment Production:** mining equipment, agricultural tools, business/commercial equipment (chip fryer stands, food shop containers), even boats.
6. **General Construction:** stadiums, schools, churches, malls, shops partitioning; turnkey from foundation to handover.
7. **Gates, Doors & Architectural Metalwork:** classic gates, sliding gates, garage doors, door/window frames, glass and steel frameworks, metal signage and banners.
8. **Hardware & Steel Products (Shop):** tank stands, steel furniture (beds and more), frames, available at the Simon Mazorodze Road hardware shop.

Also on this page: the **6-step process** (Consultation → Design (CAD/3D) → Fabrication → Installation → Handover → After-Care) as a horizontal stepper with a connecting red line, and the **Industries We Serve** grid: Sports & Entertainment, Mining & Minerals, Manufacturing & Industrial, Commercial & Retail, Transportation & Bridges (incl. toll gates), Education & Religious, Agriculture, Residential.

### 4.4 Projects Portfolio (`/projects`) ⭐ MOST IMPORTANT PAGE
Make this page exceptional. This is where Fumati gets judged.
- Hero: "Landmark Projects That Define Zimbabwe."
- **Filter tabs** (animated, with counts): All · Stadiums & Landmarks · Structural & Roofing · Bridges & Infrastructure · Commercial & Glass · Gates & Metalwork · Equipment & Products.
- **Masonry grid** of project cards: image, category badge (red), title, location and a one-line summary. On hover, the image zooms slightly and a green overlay shows "View Project →".
- Clicking a card opens a **project detail page** (`/projects/:slug`) with a large image gallery + lightbox (swipe on mobile, keyboard arrows on desktop), and fields for Client, Location, Year, Category, Scope of Work, Challenge, Solution, Result, plus "Related projects" and a CTA "Want something similar? Get a quote."
- A **Before/After or "In Progress" gallery** section for under-construction photos.
- Projects data (`projects.ts`); fields left empty should simply be hidden:
  1. **The Heart Stadium, Harare (Waterfalls)**: full structural steel framework, roofing and the gate/banner metalworks. Images: `The_Heart_Stadium.jpg`, `The_HEart_Stadium_gate_Banner_metal_works.jpg`, `The_HEart_Stadium_gate_Banner_metal_works1.jpg`. Featured.
  2. **Ngoni Stadium, Norton**: structural steelwork. Featured.
  3. **Bridge Construction**: fabrication and installation of structural steel bridge elements with corrosion protection. Images: `Bridge_Construction.jpg`, `Bridge_Construction2.jpg`, `Bridge_Construction3.jpg`. Featured.
  4. **Large-Scale Roofing Systems**: massive steel truss design, fabrication and erection. Images: `Massive_Roofing.jpg`, `Massive_Roofing2.jpg`, `roof_Structures1.jpg`, `roof_Structures2.jpg`, `roof_Structures4.jpg`. Featured.
  5. **Multi-Storey Building Structures**: Images: `building_Structure_CONSTRUCTION.jpg`, `building_Structure_CONSTRUCTION1.jpg`, `building_Structure_CONSTRUCTION3.jpg`.
  6. **Terraces Construction**: Images: `Terraces_CONSTRUCTION.jpg`, `Terraces_CONSTRUCTION2.jpg`.
  7. **Modern Glass & Steel Frameworks**: Images: `Glass_STRUCTURE.jpg`, `glassStructureFrames.jpg`, `Glass_STRucture_Under_CONSTRUCTION.jpg`. Featured.
  8. **Structural Engineering Works**: Images: `StructuralENgineering.jpg`, `structural_Engineering.jpg`, `structural_Engineering2.jpg`.
  9. **Toll Gate 3D Design**: Image: `Tolgate_3D_Designs.jpg`.
  10. **Double-Deck Boat Construction**: Image: `Double_Deck_Boat_Construction.jpg`. Featured (shows range).
  11. **Food Shop Container**: Image: `Food_SHOP_COntainer.jpg`.
  12. **Chip Fryer Stand**: Image: `Chips_Frier_STand.jpg`.
  13. **Shops Partitioning**: Image: `SHOps_PArtitioning.jpg`.
  14. **Classic Gates**: Image: `Classic_gates.jpg`.
  15. **Garage Doors**: Image: `Garage_Door.jpg`.
  16. **Premier Steel Beds**: Image: `premier_BED.jpg`.

### 4.5 Our Team (`/team`)
- **Leadership spotlight:** large feature for **Mr. Tinashe Changweya, CEO & Founder**, with a bio, credentials (Outstanding Businessman of the Year (Megafest), recognised by the Zimbabwe CEO's Network, 15+ years of industry leadership) and the CEO quote.
- **Management team grid:** photo cards with name, role, short bio and LinkedIn/email icons. Photos are greyscale and turn to colour on hover. If no photo is available, show elegant initials on a green background. Data comes from `team.ts`, so it is easy to add or remove people.
- **Team in action:** photo strip (`fumati_TEam.jpg`, `Engineers_AT_WORK.jpg`, `Engineers_AT_WORK2.jpg`, `Engineers_AT_Strategic_work.jpg`, `Builders_at_work.jpg`).
- **Careers CTA:** "Want to build with us? We're always looking for skilled engineers, welders, fabricators and construction professionals." → email button.

### 4.6 Awards & Recognition (`/awards`)
- Hero: "Recognised for Excellence."
- Award cards with photo, award name, awarding body and year, plus a lightbox:
  - **Engineering Company of the Year**: Zimbabwe CEO's Network Awards (image `Fumati_Group_Company_OF_THE_YEAR_AWARD.jpg`).
  - **Outstanding Businessman of the Year (Mr. Tinashe Changweya)**: Northern Region Megafest Business Awards (image `Mr Tinashe Award Winning.jpg`).
  - Room for more awards from `awards.ts`.
- **Testimonials** section (carousel), editable from `testimonials.ts`.
- **Brands & Clients We've Worked With:** a logo wall grid (from `clients.ts`, with logo, name and optional link). Include The Heart Stadium as the first entry.

### 4.7 Contact / Get a Quote (`/contact`)
- Two-column layout: contact cards on the left; **quote request form** on the right with Full Name, Phone/WhatsApp, Email, Service Required (dropdown of all services), Project Location, Budget Range (optional), Project Details, and an optional file upload for drawings/photos. Validate with zod + react-hook-form and show a friendly success toast.
- On submit, the form should also offer a "Send via WhatsApp instead" option that builds a `wa.me` link with the form contents.
- Contact details:
  - Phone: **+263 8644 271 926**
  - Phone / WhatsApp: **+263 71 996 0330** / **+263 77 196 0330**
  - Email: **mechanicalengineering18@gmail.com**
  - Head Office & Workshop: **1/5 Sherwood Crescent, Waterfalls, Harare, Zimbabwe**
  - Hardware Shop: **Simon Mazorodze Road, Harare**
  - Facebook: **facebook.com/Fumatiengineering**
- Embedded Google Map of Waterfalls, Harare.
- Business hours card: Mon–Fri 08:00–17:00, Sat 08:00–13:00.
- All phone numbers are `tel:` links and the email is a `mailto:` link.

## 5. Tone of voice
Confident, proud and Zimbabwean, but professional. Short, strong sentences. Engineering vocabulary used correctly (trusses, cantilevers, fabrication, erection, commissioning). No fluff, no lorem ipsum anywhere.

## 6. Design quality bar
It should look like a top international engineering firm's website (think Arup or Bechtel-level polish) but with Fumati's own bold green-red-white identity. Generous whitespace, strong grid, large photography, bold type, smooth micro-interactions. No generic template look, no stock-photo feel. If it looks like any other Lovable template, push further: this should be the best engineering website in Zimbabwe, full stop.

## 7. Content placeholders
Wherever a fact is unknown (client logos, extra team members, award years, project years/clients, testimonial names), use a clearly marked editable entry in the data file with a `// TODO: confirm with Fumati` comment, not invented specifics presented as fact.

## 8. Performance & polish checklist
- Lighthouse 90+ on mobile.
- No layout shift: images have fixed aspect ratios.
- 404 page styled on brand ("This beam isn't here", with a button back home).
- Smooth scroll to top on route change.
- Favicon from the logo.

## 9. Image filenames (place in `public/images/`)
Logo: `Fumati_Engineers_logo.jpg`
Hero/landmark: `The_Heart_Stadium.jpg`, `The_HEart_Stadium_gate_Banner_metal_works.jpg`, `The_HEart_Stadium_gate_Banner_metal_works1.jpg`
Team & company: `fumati_TEam.jpg`, `at_Office.jpg`, `Fumati_ENgineering_Workshop.jpg`, `Engineers_AT_WORK.jpg`, `Engineers_AT_WORK2.jpg`, `Engineers_AT_Strategic_work.jpg`, `Builders_at_work.jpg`, `Safety_First_AT_Construction_site_banner.jpg`
Awards: `Fumati_Group_Company_OF_THE_YEAR_AWARD.jpg`, `Mr Tinashe Award Winning.jpg`
Projects: all filenames listed in section 4.4.
