import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import BlockRenderer from "@/components/builder/BlockRenderer";
import NotFound from "./NotFound";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { normalizeBlocks } from "@/lib/builder";

/** Public renderer for pages and projects made in the Page Builder. */
const BuiltPage = ({ kind }: { kind: "page" | "project" }) => {
  const { slug = "" } = useParams();
  const settings = useSiteSettings();
  const { data, isLoading } = useQuery({
    queryKey: ["builder_page", kind, slug],
    queryFn: async () => (await supabase.from("builder_pages").select("*").eq("kind", kind).eq("slug", slug).eq("status", "published").maybeSingle()).data,
  });
  if (isLoading) return <div className="min-h-screen" />;
  if (!data) return <NotFound />;
  const blocks = normalizeBlocks(data.blocks);
  const meta = (data.meta as any) || {};
  const path = kind === "project" ? `/projects/${slug}` : `/p/${slug}`;
  const faqs = blocks.filter((b) => b.type === "faq" && !b.hidden).flatMap((b) => b.data.items || []);
  const schema: any[] = [];
  const base = (settings.canonical_url || "https://indorerealty.in").replace(/\/$/, "");
  const url = `${base}${path}`;
  const vis = blocks.filter((b) => !b.hidden);
  const images = [...new Set([data.og_image, meta.cover, ...vis.flatMap((b) => [b.data.image, ...(b.data.images || []), ...((b.type === "floorplans" ? b.data.items : []) || []).map((i: any) => i.image)])].filter((s) => typeof s === "string" && s))] as string[];
  if (kind === "project") {
    const amen = vis.filter((b) => b.type === "amenities").flatMap((b) => b.data.items || []).map((i: any) => i.name).filter(Boolean);
    const units = vis.filter((b) => b.type === "units").flatMap((b) => b.data.items || []);
    const facts = vis.filter((b) => b.type === "facts").flatMap((b) => b.data.items || []);
    const total = parseInt(facts.find((f: any) => /flat|unit/i.test(f.label))?.value || "", 10);
    const floors = facts.find((f: any) => /floor/i.test(f.label) && !/per/i.test(f.label))?.value;
    const address = { "@type": "PostalAddress", addressLocality: meta.location || "Indore", addressRegion: "Madhya Pradesh", addressCountry: "IN" };
    schema.push({ "@type": "ApartmentComplex", "@id": `${url}#complex`, name: data.title, url, description: data.seo_description || meta.tagline, image: images.slice(0, 12), address,
      ...(Number.isFinite(total) ? { numberOfAccommodationUnits: total } : {}),
      ...(floors ? { additionalProperty: [{ "@type": "PropertyValue", name: "Floors", value: floors }] } : {}),
      amenityFeature: amen.map((name: string) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
      containsPlace: units.map((u: any) => {
        const size = parseInt(String(u.sizes).replace(/[^\d]/g, "").slice(0, 4), 10);
        const bhk = parseInt(u.type, 10);
        return { "@type": "Apartment", name: `${u.type} – ${data.title}`, ...(bhk ? { numberOfRooms: bhk, numberOfBedrooms: bhk } : {}), ...(size ? { floorSize: { "@type": "QuantitativeValue", value: size, unitCode: "FTK" } } : {}), address };
      }),
      ...(meta.builder ? { brand: { "@type": "Organization", name: meta.builder } } : {}) });
    schema.push({ "@type": "RealEstateListing", name: `${data.title} – ${meta.config || "Apartments"} in ${meta.location || "Indore"}`, url, image: images[0], description: data.seo_description, about: { "@id": `${url}#complex` }, datePosted: data.created_at, dateModified: data.updated_at, provider: { "@id": `${base}/#business` } });
  }
  schema.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${base}/` }, ...(kind === "project" ? [{ "@type": "ListItem", position: 2, name: "New Projects", item: `${base}/projects` }] : []), { "@type": "ListItem", position: kind === "project" ? 3 : 2, name: data.title, item: url }] });
  if (faqs.length) schema.push({ "@type": "FAQPage", mainEntity: faqs.map((f: any) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  const hasHero = blocks[0]?.type === "hero" && !blocks[0].hidden;
  const keywords = meta.keywords || (kind === "project" ? `${data.title}, ${data.title} Indore, ${meta.config || "2 BHK 3 BHK"} flats in ${meta.location || "Indore"}, new projects in Indore, luxury apartments Indore, 2 BHK flat Indore, 3 BHK flat Indore` : undefined);
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={data.seo_title || `${data.title} | Indore Realty`} description={data.seo_description || `${data.title} — Indore Realty`} keywords={keywords} ogImage={data.og_image || meta.cover || undefined}
        canonical={url} type={kind === "project" ? "article" : "website"} schema={{ "@context": "https://schema.org", "@graph": schema }} />
      <Header />
      <main id="main" className={`outline-none flex-1 ${hasHero ? "" : "pt-24"}`}><BlockRenderer blocks={blocks} pageTitle={data.title} /></main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};
export default BuiltPage;
