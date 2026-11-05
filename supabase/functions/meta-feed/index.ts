// Public Meta (Facebook/Instagram) Real Estate catalog feed.
// Meta fetches this URL on a schedule; it always reflects live published projects.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SITE = "https://indorerealty.in";

type Extra = {
  price?: number; addr1?: string; addr2?: string; addr3?: string; unit_number?: string;
  postal_code?: string; lat?: string; lng?: string; neighborhood?: string;
  units?: number; tags?: string[]; description?: string;
};

// Defaults per project; any value can be overridden from the project's meta.feed in admin.
const DEFAULTS: Record<string, Extra> = {
  "prabhu-krishna-embrace": { price: 6500000, addr1: "Prabhu Krishna Embrace", addr2: "Indore", postal_code: "452001", lat: "22.7196", lng: "75.8577", neighborhood: "Indore", units: 48, tags: ["Luxury Apartments", "2 BHK", "3 BHK", "Swimming Pool", "Gym", "G+6 Building"] },
  "rudra-palace-pulak-city": { price: 2415000, addr1: "Rudra Palace, Pulak City", addr2: "Near Silicon City, AB Road", addr3: "Rau", postal_code: "453331", lat: "22.6329", lng: "75.8074", neighborhood: "Rau", units: 56, tags: ["Affordable Housing", "1 BHK", "2 BHK", "Silicon City", "Rau Indore"] },
  "zillion-park": { price: 5900000, addr1: "Zillion Park", addr2: "Super Corridor", postal_code: "452005", lat: "22.7660", lng: "75.8230", neighborhood: "Super Corridor", tags: ["Residential Plots", "Super Corridor", "P-IND-24-5300", "Gated Colony"] },
  "shrinath-samradhi": { price: 4200000, addr1: "Plot No. 04, Shiv Vatika", addr2: "Indore", postal_code: "452010", lat: "22.7533", lng: "75.8937", neighborhood: "Shiv Vatika", tags: ["Residential Apartments", "Shiv Vatika", "1070 sq ft", "1220 sq ft", "1320 sq ft"] },
  "zillion-avadh-greens": { price: 2009000, addr1: "Zillion Avadh Greens, Khandwa Road", addr2: "Simrol", postal_code: "452020", lat: "22.5452", lng: "75.9228", neighborhood: "Simrol", units: 75, tags: ["Residential Plots", "Simrol", "Khandwa Road", "Gated Community"] },
  "kalyanam-courtyard": { price: 8500000, addr1: "Kalyanam Courtyard, Rau Circle", addr2: "Rau", postal_code: "453331", lat: "22.6335", lng: "75.8080", neighborhood: "Rau", units: 21, tags: ["Luxury Triplex Mansions", "3.5 BHK", "Clubhouse", "Swimming Pool", "Rau Circle Indore", "Smart Home", "Alexa"] },
};

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function collectImages(p: any): string[] {
  const out: string[] = [];
  const add = (u: unknown) => {
    if (typeof u === "string" && /^https?:\/\//.test(u) && !out.includes(u)) out.push(u);
  };
  add(p.og_image);
  add(p.meta?.cover);
  const re = /https?:\/\/[^"\s']+\.(?:jpe?g|png|webp)/gi;
  for (const m of JSON.stringify(p.blocks ?? []).match(re) ?? []) add(m);
  return out.slice(0, 10);
}

function textFromBlocks(p: any): string {
  for (const b of p.blocks ?? []) {
    const d = b?.data ?? {};
    for (const k of ["description", "body", "text", "content", "subtitle"]) {
      if (typeof d[k] === "string" && stripHtml(d[k]).length > 60) return stripHtml(d[k]);
    }
  }
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
  const { data, error } = await supabase
    .from("builder_pages")
    .select("slug,title,blocks,seo_description,og_image,meta,updated_at")
    .eq("kind", "project")
    .eq("status", "published")
    .order("created_at");

  if (error) {
    return new Response(`<error>${esc(error.message)}</error>`, {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
    });
  }

  const listings = (data ?? []).map((p: any) => {
    const x: Extra = { ...(DEFAULTS[p.slug] ?? {}), ...(p.meta?.feed ?? {}) };
    const imgs = collectImages(p);
    if (!imgs.length) imgs.push(`${SITE}/og-image.jpg`);
    const desc = (x.description || p.seo_description || textFromBlocks(p) || p.title).slice(0, 5000);
    const price = Number(x.price ?? p.meta?.price ?? 0);
    const id = "IR_" + p.slug.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
    const comp = (n: string, v?: string) =>
      v ? `      <component name="${n}">${esc(v)}</component>` : `      <component name="${n}"/>`;
    return [
      "  <listing>",
      ...imgs.map((u, i) =>
        `    <image>\n      <url>${esc(u)}</url>\n      <tag>${i === 0 ? "exterior" : /plan|layout/i.test(u) ? "floorplan" : "other"}</tag>\n    </image>`),
      `    <home_listing_id>${id}</home_listing_id>`,
      `    <url>${SITE}/projects/${esc(p.slug)}</url>`,
      `    <name>${esc(p.title)}</name>`,
      `    <description>${esc(desc)}</description>`,
      price > 0 ? `    <price>${price.toFixed(2)} INR</price>` : "",
      `    <address format="simple">`,
      comp("addr1", x.addr1 || p.title),
      comp("addr2", x.addr2),
      comp("addr3", x.addr3),
      comp("unit_number", x.unit_number),
      comp("city", "Indore"),
      comp("region", "Madhya Pradesh"),
      comp("province"),
      comp("postal_code", x.postal_code),
      comp("country", "India"),
      `    </address>`,
      x.lat ? `    <latitude>${esc(x.lat)}</latitude>` : "",
      x.lng ? `    <longitude>${esc(x.lng)}</longitude>` : "",
      `    <neighborhood>${esc(x.neighborhood || "Indore")}</neighborhood>`,
      `    <availability>for_sale</availability>`,
      x.units ? `    <custom_number_4>${x.units}</custom_number_4>` : "",
      ...(x.tags ?? []).map((t) => `    <product_tags>${esc(t)}</product_tags>`),
      "  </listing>",
    ].filter(Boolean).join("\n");
  });

  const xml = `<?xml version="1.0" encoding="utf-8"?>\n<listings>\n  <title>Indore Realty Projects</title>\n${listings.join("\n")}\n</listings>\n`;
  return new Response(xml, {
    headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=900" },
  });
});
