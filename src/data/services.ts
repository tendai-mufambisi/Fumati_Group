export type Service = {
  id: string;
  title: string;
  short: string;
  image: string;
  bullets: string[];
};

export const services: Service[] = [
  {
    id: "structural-engineering",
    title: "Structural Engineering",
    short: "Analysis, design and erection of steel structures that carry real load.",
    image: "StructuralENgineering.jpg",
    bullets: ["Commercial & industrial steel structures", "High-rise frameworks", "Large-span roof trusses", "Terraces and grandstands", "Steel bridges"],
  },
  {
    id: "mechanical-engineering",
    title: "Mechanical Engineering",
    short: "Heavy machinery, conveyors and plant that keep industry moving.",
    image: "Engineers_AT_WORK.jpg",
    bullets: ["Heavy machinery installation", "Conveyor systems", "Industrial HVAC", "Plant maintenance contracts"],
  },
  {
    id: "steel-fabrication",
    title: "Steel Fabrication & Welding",
    short: "Precision welding and custom components from our own workshop.",
    image: "Fumati_ENgineering_Workshop.jpg",
    bullets: ["Custom steel components", "Precision welding", "Structural beams", "Railings and gates", "Heavy plate work"],
  },
  {
    id: "plant-fitting",
    title: "Plant Fitting",
    short: "Installation, alignment and commissioning of industrial and mining plant.",
    image: "Engineers_AT_WORK2.jpg",
    bullets: ["Plant installation", "Shaft and drive alignment", "Commissioning", "Mining plant fit-outs"],
  },
  {
    id: "equipment-production",
    title: "Equipment Production",
    short: "Mining, agricultural and commercial equipment, even boats.",
    image: "Double_Deck_Boat_Construction.jpg",
    bullets: ["Mining equipment", "Agricultural tools", "Chip fryer stands", "Food shop containers", "Double-deck boats"],
  },
  {
    id: "general-construction",
    title: "General Construction",
    short: "Turnkey builds, from foundation to handover.",
    image: "building_Structure_CONSTRUCTION.jpg",
    bullets: ["Stadiums", "Schools and churches", "Malls and shops", "Shops partitioning", "Turnkey delivery"],
  },
  {
    id: "gates-metalwork",
    title: "Gates, Doors & Architectural Metalwork",
    short: "Gates, frames and steel-and-glass that make an entrance.",
    image: "Classic_gates.jpg",
    bullets: ["Classic and sliding gates", "Garage doors", "Door and window frames", "Glass and steel frameworks", "Metal signage and banners"],
  },
  {
    id: "hardware-shop",
    title: "Hardware & Steel Products",
    short: "Tank stands, steel furniture and frames at our Simon Mazorodze Road shop.",
    image: "premier_BED.jpg",
    bullets: ["Tank stands", "Steel beds and furniture", "Door and window frames", "Walk-in at Simon Mazorodze Road"],
  },
];
