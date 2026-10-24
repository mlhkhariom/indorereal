import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Download, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FeaturedProjects = ({ compact = false }: { compact?: boolean }) => {
  const { data = [] } = useQuery({
    queryKey: ["builder_projects_featured"],
    queryFn: async () => (await supabase.from("builder_pages").select("id,slug,title,meta,og_image,seo_description").eq("kind", "project").eq("status", "published").order("updated_at", { ascending: false })).data || [],
  });
  if (!data.length) return null;
  return (
    <section className={compact ? "pb-8" : "section-padding bg-muted"} aria-labelledby="featured-projects-heading">
      <div className={compact ? "" : "container mx-auto px-4 lg:px-8"}>
        {!compact && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Our Projects</span>
            <h2 id="featured-projects-heading" className="section-title mt-3">Featured Project</h2>
            <div className="divider-gold" />
          </div>
        )}
        {compact && <h2 id="featured-projects-heading" className="sr-only">Our projects</h2>}
        <div className="space-y-8">
          {data.map((p: any) => {
            const m = p.meta || {};
            const img = m.cover || p.og_image;
            return (
              <article key={p.id} className="grid lg:grid-cols-2 rounded-2xl overflow-hidden bg-card border border-border shadow-lg">
                <Link to={`/projects/${p.slug}`} className="relative block aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden group">
                  {img && <img src={img} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                  {m.status && <span className="absolute top-4 left-4 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1">{m.status}</span>}
                </Link>
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  {m.location && <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />{m.location}</p>}
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mt-2">{p.title}</h3>
                  {m.config && <p className="text-secondary font-semibold mt-1">{m.config}</p>}
                  <p className="text-muted-foreground mt-4">{m.tagline || p.seo_description}</p>
                  {Array.isArray(m.highlights) && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
                      {m.highlights.map((h: string) => <li key={h} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-secondary shrink-0" aria-hidden="true" />{h}</li>)}
                    </ul>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 mt-7">
                    <Link to={`/projects/${p.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold text-sm hover:opacity-90">View Project Details <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                    <Link to={`/projects/${p.slug}#brochure`} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary text-foreground px-6 py-3 font-semibold text-sm hover:bg-secondary/10"><Download className="h-4 w-4" aria-hidden="true" />Brochure & Price</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
