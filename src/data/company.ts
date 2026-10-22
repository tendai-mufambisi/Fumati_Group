export const company = {
  name: "Fumati Engineers",
  tagline: "Turning Steel Into Gold",
  phones: [
    { label: "Office", display: "+263 8644 271 926", tel: "+2638644271926" },
    { label: "Phone / WhatsApp", display: "+263 71 996 0330", tel: "+263719960330" },
    { label: "Phone / WhatsApp", display: "+263 77 196 0330", tel: "+263771960330" },
  ],
  whatsapp: "263771960330",
  email: "mechanicalengineering18@gmail.com",
  address: "1/5 Sherwood Crescent, Waterfalls, Harare, Zimbabwe",
  shortAddress: "1/5 Sherwood Crescent, Waterfalls, Harare",
  shop: "Simon Mazorodze Road, Harare",
  facebook: "https://www.facebook.com/Fumatiengineering",
  hours: [
    { days: "Mon – Fri", time: "08:00 – 17:00" },
    { days: "Saturday", time: "08:00 – 13:00" },
    { days: "Sunday", time: "Closed" },
  ],
};

export const waLink = (text = "Hi Fumati Engineers, I'd like a quote for…") =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;

export const stats = [
  { value: 15, suffix: "+", label: "Years of Excellence" },
  { value: 120, suffix: "+", label: "Projects Delivered" },
  { value: 50, suffix: "+", label: "Skilled Professionals" },
  { value: 5, suffix: "+", label: "Major Awards" },
];

export const whyUs = [
  { title: "15+ Years Track Record", text: "Since 2008, landmark steel delivered across Zimbabwe." },
  { title: "Safety-First Culture", text: "A zero-accident commitment on every single site." },
  { title: "In-House Workshop", text: "Design, fabricate and install, all under one roof." },
  { title: "Expert Team of 50+", text: "Engineers, welders and fabricators who own their craft." },
  { title: "On-Time Delivery", text: "Programmes planned to the day, and kept." },
  { title: "Dedicated After-Care", text: "We stay with the structure long after handover." },
];

export const processSteps = ["Consultation", "Design (CAD/3D)", "Fabrication", "Installation", "Handover", "After-Care"];

export const industries = [
  "Sports & Entertainment", "Mining & Minerals", "Manufacturing & Industrial", "Commercial & Retail",
  "Transportation & Bridges", "Education & Religious", "Agriculture", "Residential",
];

export const timeline = [
  { year: "2008", title: "Fumati is founded", text: "Mr. Tinashe Changweya starts a determined local engineering team." },
  { year: "", title: "Workshop in Waterfalls", text: "Our fabrication workshop opens at Sherwood Crescent, Waterfalls." }, // TODO: confirm year with Fumati
  { year: "", title: "Hardware shop opens", text: "Steel products go retail on Simon Mazorodze Road." }, // TODO: confirm year with Fumati
  { year: "", title: "The Heart Stadium", text: "Full structural steel framework, roofing and gate metalworks." }, // TODO: confirm year
  { year: "", title: "Ngoni Stadium, Norton", text: "Structural steelwork for Norton's stadium." }, // TODO: confirm year
  { year: "", title: "Engineering Company of the Year", text: "Honoured at the Zimbabwe CEO's Network Awards." }, // TODO: confirm year
];
