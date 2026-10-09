// Template registry — 2 reusable wedding invitation templates
export interface TemplateInfo {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in rupees
  pricePaise: number;
  colors: { primary: string; accent: string; bg: string };
  features: string[];
}

export const TEMPLATES: TemplateInfo[] = [
  {
    slug: "royal-palace",
    name: "Royal Palace",
    tagline: "Majestic royal grandeur",
    description:
      "A majestic palace-themed invitation with grand golden doors that swing open to reveal your celebration. Deep maroon, royal gold, and intricate mandala patterns.",
    price: 499,
    pricePaise: 49900,
    colors: { primary: "#6d1025", accent: "#d4af37", bg: "#fff8ec" },
    features: [
      "Grand palace-door opening animation",
      "Royal gold foil effects",
      "Countdown timer",
      "Events, gallery, RSVP & blessings",
      "WhatsApp share + QR code",
    ],
  },
  {
    slug: "modern-floral",
    name: "Modern Floral",
    tagline: "Elegant contemporary blooms",
    description:
      "A fresh, modern floral invitation where blossoms bloom across the screen to unveil your story. Soft blush pinks, sage greens, and graceful animations.",
    price: 499,
    pricePaise: 49900,
    colors: { primary: "#8e4a5b", accent: "#c9a227", bg: "#fef9f5" },
    features: [
      "Bloom-unveil opening animation",
      "Floating petal effects",
      "Countdown timer",
      "Events, gallery, RSVP & blessings",
      "WhatsApp share + QR code",
    ],
  },
];

export function getTemplate(slug: string): TemplateInfo | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

// Default invitation data structure
export interface InvitationData {
  groom: string;
  bride: string;
  weddingDate: string; // ISO date
  venue: string;
  venueAddress: string;
  groomParents: string;
  brideParents: string;
  events: Array<{ name: string; date: string; time: string; venue: string }>;
  story: string;
  photos: string[];
  message: string;
}

export const DEFAULT_DATA: InvitationData = {
  groom: "Chandan",
  bride: "Pinki",
  weddingDate: "2027-02-14T19:00:00+05:30",
  venue: "The Grand Palace",
  venueAddress: "Mumbai, Maharashtra",
  groomParents: "Mr. Rajesh Sharma & Mrs. Priya Sharma",
  brideParents: "Mr. Vikram Mehta & Mrs. Anjali Mehta",
  events: [
    { name: "Haldi", date: "2027-02-12", time: "10:00 AM", venue: "Home" },
    { name: "Mehendi", date: "2027-02-13", time: "4:00 PM", venue: "Home" },
    { name: "Wedding", date: "2027-02-14", time: "7:00 PM", venue: "The Grand Palace" },
    { name: "Reception", date: "2027-02-15", time: "7:00 PM", venue: "The Grand Palace" },
  ],
  story: "Two souls, one beautiful journey...",
  photos: [],
  message: "With the blessings of our families, we invite you to celebrate our wedding.",
};
