export type Member = { name: string; role: string; bio: string; photo?: string; email?: string; linkedin?: string };

export const ceo = {
  name: "Mr. Tinashe Changweya",
  role: "CEO & Founder",
  photo: "Mr Tinashe Award Winning.jpg",
  bio: "Founder of Fumati Engineers, Tinashe has led the company from a determined local team to one of Zimbabwe's most respected engineering brands, delivering stadiums, bridges and industrial structures with precision and pride.",
  credentials: [
    "Outstanding Businessman of the Year (Megafest)",
    "Recognised by the Zimbabwe CEO's Network",
    "15+ years of industry leadership",
  ],
  quote:
    "We don't just build structures, we build Zimbabwe. Every weld, every beam, every project is a commitment to excellence and a statement of what our nation is capable of.",
};

// TODO: confirm with Fumati — replace with real management team names, roles and photos.
export const team: Member[] = [
  { name: "Name to confirm", role: "Head of Structural Engineering", bio: "Leads structural design, analysis and site erection." },
  { name: "Name to confirm", role: "Workshop Manager", bio: "Runs fabrication and welding at the Waterfalls workshop." },
  { name: "Name to confirm", role: "Projects Manager", bio: "Keeps every programme safe, on budget and on time." },
  { name: "Name to confirm", role: "Safety Officer", bio: "Owns our zero-harm commitment on every site." },
];

export type Award = { title: string; body: string; year?: string; image: string; recipient?: string };
export const awards: Award[] = [
  { title: "Engineering Company of the Year", body: "Zimbabwe CEO's Network Awards", image: "Fumati_Group_Company_OF_THE_YEAR_AWARD.jpg" }, // TODO: confirm year
  { title: "Outstanding Businessman of the Year", recipient: "Mr. Tinashe Changweya", body: "Northern Region Megafest Business Awards", image: "Mr Tinashe Award Winning.jpg" }, // TODO: confirm year
];

// TODO: confirm with Fumati — replace with real client testimonials and names.
export const testimonials = [
  { quote: "Testimonial to be supplied by a Fumati client.", name: "Client name to confirm", org: "Organisation" },
  { quote: "Testimonial to be supplied by a Fumati client.", name: "Client name to confirm", org: "Organisation" },
  { quote: "Testimonial to be supplied by a Fumati client.", name: "Client name to confirm", org: "Organisation" },
];

// TODO: confirm with Fumati — add real client logos (logo path in public/images).
export const clients: { name: string; logo?: string; url?: string }[] = [
  { name: "The Heart Stadium" },
  { name: "Ngoni Stadium, Norton" },
  { name: "Client to confirm" },
  { name: "Client to confirm" },
  { name: "Client to confirm" },
  { name: "Client to confirm" },
];
