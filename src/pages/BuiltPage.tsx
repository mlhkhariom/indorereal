import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import BlockRenderer from "@/components/builder/BlockRenderer";
import NotFound from "./NotFound";
import { normalizeBlocks } from "@/lib/builder";

/** Public renderer for pages and projects made in the Page Builder. */
const BuiltPage = ({ kind }: { kind: "page" | "project" }) => {
  const { slug = "" } = useParams();
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
  if (kind === "project") schema.push({ "@context": "https://schema.org", "@type": "Residence", name: data.title, description: data.seo_description || undefined, image: meta.cover || undefined,
    address: { "@type": "PostalAddress", addressLocality: meta.location || "Indore", addressRegion: "Madhya Pradesh", addressCountry: "IN" } });
  if (faqs.length) schema.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f: any) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  const hasHero = blocks[0]?.type === "hero" && !blocks[0].hidden;
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={data.seo_title || `${data.title} | Indore Realty`} description={data.seo_description || `${data.title} — Indore Realty`} ogImage={data.og_image || meta.cover || undefined}
        canonical={`https://indorerealty.in${path}`} schema={schema.length ? { "@context": "https://schema.org", "@graph": schema } : undefined} />
      <Header />
      <main id="main" className={`outline-none flex-1 ${hasHero ? "" : "pt-24"}`}><BlockRenderer blocks={blocks} pageTitle={data.title} /></main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};
export default BuiltPage;
