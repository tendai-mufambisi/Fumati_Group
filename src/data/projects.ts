export const categories = [
  "Stadiums & Landmarks",
  "Structural & Roofing",
  "Bridges & Infrastructure",
  "Commercial & Glass",
  "Gates & Metalwork",
  "Equipment & Products",
] as const;
export type Category = (typeof categories)[number];

export type Project = {
  slug: string;
  title: string;
  category: Category;
  location?: string;
  summary: string;
  images: string[];
  featured?: boolean;
  inProgress?: string[];
  client?: string; // TODO: confirm with Fumati
  year?: string; // TODO: confirm with Fumati
  scope?: string;
  challenge?: string;
  solution?: string;
  result?: string;
};

export const projects: Project[] = [
  {
    slug: "the-heart-stadium",
    title: "The Heart Stadium",
    category: "Stadiums & Landmarks",
    location: "Waterfalls, Harare",
    summary: "Full structural steel framework, roofing and gate/banner metalworks.",
    images: ["The_Heart_Stadium.jpg", "The_HEart_Stadium_gate_Banner_metal_works.jpg", "The_HEart_Stadium_gate_Banner_metal_works1.jpg"],
    featured: true,
    scope: "Structural steel framework, stadium roofing, entrance gate and banner metalworks.",
  },
  {
    slug: "ngoni-stadium",
    title: "Ngoni Stadium",
    category: "Stadiums & Landmarks",
    location: "Norton",
    summary: "Structural steelwork for one of Norton's landmark sporting venues.",
    images: [],
    featured: true,
    scope: "Structural steelwork.",
  },
  {
    slug: "bridge-construction",
    title: "Bridge Construction",
    category: "Bridges & Infrastructure",
    summary: "Structural steel bridge elements, fabricated and installed with corrosion protection.",
    images: ["Bridge_Construction.jpg", "Bridge_Construction2.jpg", "Bridge_Construction3.jpg"],
    featured: true,
    scope: "Fabrication and installation of structural steel bridge elements with corrosion protection.",
  },
  {
    slug: "large-scale-roofing",
    title: "Large-Scale Roofing Systems",
    category: "Structural & Roofing",
    summary: "Massive steel trusses designed, fabricated and erected for wide spans.",
    images: ["Massive_Roofing.jpg", "Massive_Roofing2.jpg", "roof_Structures1.jpg", "roof_Structures2.jpg", "roof_Structures4.jpg"],
    featured: true,
    scope: "Steel truss design, fabrication and erection.",
  },
  {
    slug: "multi-storey-structures",
    title: "Multi-Storey Building Structures",
    category: "Structural & Roofing",
    summary: "Steel frameworks for multi-storey buildings, column to roof.",
    images: ["building_Structure_CONSTRUCTION.jpg", "building_Structure_CONSTRUCTION1.jpg", "building_Structure_CONSTRUCTION3.jpg"],
  },
  {
    slug: "terraces-construction",
    title: "Terraces Construction",
    category: "Stadiums & Landmarks",
    summary: "Spectator terraces built for capacity and safety.",
    images: ["Terraces_CONSTRUCTION.jpg", "Terraces_CONSTRUCTION2.jpg"],
  },
  {
    slug: "glass-steel-frameworks",
    title: "Modern Glass & Steel Frameworks",
    category: "Commercial & Glass",
    summary: "Clean-lined steel frameworks carrying contemporary glazing.",
    images: ["Glass_STRUCTURE.jpg", "glassStructureFrames.jpg"],
    inProgress: ["Glass_STRucture_Under_CONSTRUCTION.jpg"],
    featured: true,
  },
  {
    slug: "structural-engineering-works",
    title: "Structural Engineering Works",
    category: "Structural & Roofing",
    summary: "A cross-section of structural steel works across Zimbabwe.",
    images: ["StructuralENgineering.jpg", "structural_Engineering.jpg", "structural_Engineering2.jpg"],
  },
  {
    slug: "toll-gate-3d-design",
    title: "Toll Gate 3D Design",
    category: "Bridges & Infrastructure",
    summary: "3D-designed toll gate canopy structure, engineered before a single cut.",
    images: ["Tolgate_3D_Designs.jpg"],
  },
  {
    slug: "double-deck-boat",
    title: "Double-Deck Boat Construction",
    category: "Equipment & Products",
    summary: "A double-deck boat, fabricated in steel. Proof of our range.",
    images: ["Double_Deck_Boat_Construction.jpg"],
    featured: true,
  },
  { slug: "food-shop-container", title: "Food Shop Container", category: "Equipment & Products", summary: "A trade-ready steel food shop container.", images: ["Food_SHOP_COntainer.jpg"] },
  { slug: "chip-fryer-stand", title: "Chip Fryer Stand", category: "Equipment & Products", summary: "Heavy-duty commercial chip fryer stand.", images: ["Chips_Frier_STand.jpg"] },
  { slug: "shops-partitioning", title: "Shops Partitioning", category: "Commercial & Glass", summary: "Steel shop partitioning for retail spaces.", images: ["SHOps_PArtitioning.jpg"] },
  { slug: "classic-gates", title: "Classic Gates", category: "Gates & Metalwork", summary: "Classic gates, crafted to last and built to impress.", images: ["Classic_gates.jpg"] },
  { slug: "garage-doors", title: "Garage Doors", category: "Gates & Metalwork", summary: "Robust steel garage doors.", images: ["Garage_Door.jpg"] },
  { slug: "premier-steel-beds", title: "Premier Steel Beds", category: "Equipment & Products", summary: "Premier steel beds from our hardware range.", images: ["premier_BED.jpg"] },
];

export const coverOf = (p: Project) => p.images[0] ?? `${p.slug}.jpg`;
