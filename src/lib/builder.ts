export type FieldType = "text" | "textarea" | "rich" | "image" | "images" | "select" | "number" | "list";
export interface Field { key: string; label: string; type: FieldType; options?: string[]; itemFields?: Field[]; placeholder?: string }
export type BlockBg = "light" | "muted" | "dark" | "gold";
export interface Block { id: string; type: string; hidden?: boolean; bg?: BlockBg; data: Record<string, any> }
export interface BlockDef { type: string; label: string; group: "General" | "Real estate"; fields: Field[]; defaults: Record<string, any> }

const t = (key: string, label: string, placeholder?: string): Field => ({ key, label, type: "text", placeholder });
const ta = (key: string, label: string): Field => ({ key, label, type: "textarea" });
const img = (key: string, label: string): Field => ({ key, label, type: "image" });
const list = (key: string, label: string, itemFields: Field[]): Field => ({ key, label, type: "list", itemFields });

export const BLOCKS: BlockDef[] = [
  { type: "hero", label: "Banner", group: "General",
    fields: [t("eyebrow", "Small label"), t("heading", "Heading"), ta("subheading", "Sub heading"), img("image", "Background image"), t("video", "Background video URL (mp4, optional)"),
      t("btn1", "Button 1 text"), t("btn1Link", "Button 1 link"), t("btn2", "Button 2 text"), t("btn2Link", "Button 2 link"), { key: "height", label: "Height", type: "select", options: ["medium", "tall", "full"] }],
    defaults: { eyebrow: "Indore Realty", heading: "Your heading here", subheading: "A short line about this page.", image: "", video: "", btn1: "Enquire Now", btn1Link: "#enquiry", btn2: "", btn2Link: "", height: "tall" } },
  { type: "text", label: "Text", group: "General", fields: [t("heading", "Heading"), { key: "html", label: "Content", type: "rich" }, { key: "align", label: "Align", type: "select", options: ["left", "center"] }],
    defaults: { heading: "About this", html: "<p>Write your content here.</p>", align: "left" } },
  { type: "image", label: "Image", group: "General", fields: [img("src", "Image"), t("alt", "Description (for blind users & Google)"), t("caption", "Caption")], defaults: { src: "", alt: "", caption: "" } },
  { type: "gallery", label: "Photo Gallery", group: "General", fields: [t("heading", "Heading"), { key: "images", label: "Photos", type: "images" }], defaults: { heading: "Gallery", images: [] } },
  { type: "split", label: "Image + Text", group: "General",
    fields: [t("heading", "Heading"), { key: "html", label: "Text", type: "rich" }, img("image", "Image"), { key: "side", label: "Image side", type: "select", options: ["left", "right"] }, t("btn", "Button text"), t("btnLink", "Button link")],
    defaults: { heading: "Why this project", html: "<p>Tell the story here.</p>", image: "", side: "left", btn: "", btnLink: "" } },
  { type: "stats", label: "Stats Counters", group: "General", fields: [list("items", "Stats", [t("value", "Number", "500+"), t("label", "Label")])],
    defaults: { items: [{ value: "500+", label: "Happy Families" }, { value: "15+", label: "Years" }, { value: "50+", label: "Projects" }, { value: "24/7", label: "Support" }] } },
  { type: "cta", label: "Call-to-Action Strip", group: "General", fields: [t("heading", "Heading"), ta("text", "Text"), t("btn", "Button text"), t("btnLink", "Button link"), { key: "showPhone", label: "Show call button", type: "select", options: ["yes", "no"] }],
    defaults: { heading: "Ready to find your home?", text: "Talk to our experts today.", btn: "Enquire Now", btnLink: "#enquiry", showPhone: "yes" } },
  { type: "faq", label: "FAQ", group: "General", fields: [t("heading", "Heading"), list("items", "Questions", [t("q", "Question"), ta("a", "Answer")])],
    defaults: { heading: "Frequently Asked Questions", items: [{ q: "Is this RERA approved?", a: "Yes." }] } },
  { type: "testimonials", label: "Testimonials", group: "General", fields: [t("heading", "Heading"), list("items", "Reviews", [t("name", "Name"), t("role", "Role / area"), ta("text", "Review")])],
    defaults: { heading: "What our clients say", items: [{ name: "Rahul Sharma", role: "Vijay Nagar", text: "Smooth experience from visit to registry." }] } },
  { type: "spacer", label: "Spacer / Divider", group: "General", fields: [{ key: "size", label: "Size", type: "select", options: ["small", "medium", "large"] }, { key: "line", label: "Show line", type: "select", options: ["no", "yes"] }], defaults: { size: "medium", line: "no" } },
  { type: "video", label: "Video", group: "General", fields: [t("heading", "Heading"), t("url", "YouTube link or video file URL (.mp4)"), img("poster", "Cover image (optional)")], defaults: { heading: "Project walkthrough", url: "", poster: "" } },
  { type: "facts", label: "Quick Facts Strip", group: "Real estate", fields: [list("items", "Facts", [t("value", "Value", "G+6"), t("label", "Label", "Floors")])],
    defaults: { items: [{ value: "G+6", label: "Floors" }, { value: "48", label: "Flats" }] } },
  { type: "units", label: "Flat Types", group: "Real estate", fields: [t("heading", "Heading"), ta("text", "Intro"), list("items", "Flat types", [t("type", "Type", "3 BHK"), t("sizes", "Sizes", "1813 sq.ft"), t("note", "Short note"), t("price", "Price (blank = Get price)")])],
    defaults: { heading: "Flat Types", text: "", items: [{ type: "2 BHK", sizes: "1200 sq.ft", note: "", price: "" }] } },
  { type: "enquiry", label: "Enquiry Form", group: "General", fields: [t("heading", "Heading"), ta("text", "Text"), t("button", "Button text")], defaults: { heading: "Get Best Price & Offers", text: "Share your details and our expert will call you back.", button: "Request Call Back" } },
  // Real estate
  { type: "overview", label: "Project Overview", group: "Real estate",
    fields: [t("heading", "Heading"), t("builder", "Builder / Developer"), t("rera", "RERA number"), t("possession", "Possession"), t("units", "Total units"), t("area", "Size range", "1200 - 2400 sq.ft"), t("land", "Land area"), t("config", "Configuration", "2, 3 & 4 BHK"), t("status", "Status")],
    defaults: { heading: "Project Overview", builder: "", rera: "", possession: "Dec 2027", units: "", area: "", land: "", config: "2 & 3 BHK", status: "Under Construction" } },
  { type: "prices", label: "Price List", group: "Real estate", fields: [t("heading", "Heading"), list("items", "Units", [t("type", "Unit type", "3 BHK"), t("size", "Size", "1650 sq.ft"), t("price", "Price (blank = On request)", "₹ 85 L")]), ta("note", "Note")],
    defaults: { heading: "Price List", items: [{ type: "2 BHK", size: "1150 sq.ft", price: "₹ 55 L*" }, { type: "3 BHK", size: "1650 sq.ft", price: "" }], note: "*Prices exclude registry & GST." } },
  { type: "floorplans", label: "Floor Plans", group: "Real estate", fields: [t("heading", "Heading"), list("items", "Plans", [t("name", "Name", "3 BHK"), t("size", "Size"), img("image", "Plan image")])],
    defaults: { heading: "Floor Plans", items: [{ name: "2 BHK", size: "1150 sq.ft", image: "" }, { name: "3 BHK", size: "1650 sq.ft", image: "" }] } },
  { type: "amenities", label: "Amenities", group: "Real estate", fields: [t("heading", "Heading"), list("items", "Amenities", [t("name", "Amenity")])],
    defaults: { heading: "Amenities", items: ["Swimming Pool", "Gym", "Clubhouse", "Kids Play Area", "24x7 Security", "Power Backup", "Lift", "Parking"].map((name) => ({ name })) } },
  { type: "location", label: "Location & Nearby", group: "Real estate", fields: [t("heading", "Heading"), t("address", "Area / address"), t("lat", "Latitude (optional)"), t("lng", "Longitude (optional)"), list("items", "Nearby places", [t("name", "Place"), t("distance", "Distance", "2 km")])],
    defaults: { heading: "Location Advantages", address: "Vijay Nagar", lat: "", lng: "", items: [{ name: "C21 Mall", distance: "2 km" }, { name: "Bombay Hospital", distance: "3 km" }] } },
  { type: "brochure", label: "Brochure Download", group: "Real estate", fields: [t("heading", "Heading"), ta("text", "Text"), t("file", "Brochure link (PDF URL)"), img("cover", "Cover image")],
    defaults: { heading: "Download Brochure", text: "Get floor plans, price sheet and specifications.", file: "", cover: "" } },
  { type: "progress", label: "Construction Progress", group: "Real estate", fields: [t("heading", "Heading"), list("items", "Milestones", [t("date", "Date"), t("title", "Milestone"), { key: "done", label: "Done", type: "select", options: ["yes", "no"] }])],
    defaults: { heading: "Construction Progress", items: [{ date: "Jan 2026", title: "Foundation", done: "yes" }, { date: "Dec 2026", title: "Structure", done: "no" }] } },
  { type: "properties", label: "Properties List", group: "Real estate", fields: [t("heading", "Heading"), t("location", "Only this area (optional)"), t("type", "Only this type (optional)"), t("slugs", "Hand-pick (property web addresses, comma separated)"), { key: "limit", label: "How many", type: "number" }],
    defaults: { heading: "Available Properties", location: "", type: "", slugs: "", limit: 6 } },
  { type: "emi", label: "EMI Calculator", group: "Real estate", fields: [t("heading", "Heading"), { key: "amount", label: "Default loan (₹)", type: "number" }], defaults: { heading: "Calculate your EMI", amount: 5000000 } },
  { type: "developer", label: "Builder Info", group: "Real estate", fields: [t("name", "Builder name"), img("logo", "Logo"), ta("about", "About"), t("years", "Years"), t("projects", "Projects delivered")],
    defaults: { name: "Developer name", logo: "", about: "Trusted developer in Indore.", years: "15+", projects: "20+" } },
];

export const getDef = (type: string) => BLOCKS.find((b) => b.type === type);
export const uid = () => Math.random().toString(36).slice(2, 10);
export const makeBlock = (type: string, data?: Record<string, any>): Block => {
  const def = getDef(type);
  return { id: uid(), type, bg: "light", data: structuredClone({ ...(def?.defaults || {}), ...(data || {}) }) };
};

export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
export const isValidSlug = (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) && s.length <= 80;

/** Drop unknown blocks and fill missing fields with defaults so old pages keep rendering. */
export const normalizeBlocks = (raw: unknown): Block[] => {
  if (!Array.isArray(raw)) return [];
  return raw.filter((b: any) => b && typeof b === "object" && getDef(b.type)).map((b: any) => ({
    id: typeof b.id === "string" ? b.id : uid(), type: b.type, hidden: !!b.hidden,
    bg: ["light", "muted", "dark", "gold"].includes(b.bg) ? b.bg : "light",
    data: { ...getDef(b.type)!.defaults, ...(b.data || {}) },
  }));
};

export const youtubeId = (url: string) => url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1] || null;

export const PROJECT_STATUSES = ["Upcoming", "Under Construction", "Ready to Move"];
export const projectSchemaType = (projectType: unknown) => projectType === "plots" ? "Place" : "ApartmentComplex";

export const TEMPLATES: Record<string, { label: string; blocks: () => Block[] }> = {
  blank: { label: "Blank", blocks: () => [] },
  landing: { label: "Landing Page", blocks: () => [makeBlock("hero"), makeBlock("stats", undefined), makeBlock("split"), makeBlock("properties"), makeBlock("testimonials"), makeBlock("faq"), makeBlock("enquiry")] },
  project: { label: "Project Launch", blocks: () => [makeBlock("hero", { btn2: "Download Brochure", btn2Link: "#brochure" }), makeBlock("overview"), makeBlock("prices"), makeBlock("floorplans"), makeBlock("amenities"), makeBlock("gallery"), makeBlock("location"), makeBlock("progress"), makeBlock("brochure"), makeBlock("developer"), makeBlock("emi"), makeBlock("faq"), makeBlock("enquiry")] },
  area: { label: "Area Guide", blocks: () => [makeBlock("hero", { heading: "Living in Vijay Nagar" }), makeBlock("text"), makeBlock("location"), makeBlock("properties", { location: "Vijay Nagar" }), makeBlock("faq"), makeBlock("cta")] },
};
