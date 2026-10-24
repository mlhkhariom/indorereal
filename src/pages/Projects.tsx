import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageShell from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROJECT_STATUSES } from "@/lib/builder";

const Projects = () => {
  const [status, setStatus] = useState("all");
  const [area, setArea] = useState("all");
  const { data = [], isLoading } = useQuery({
    queryKey: ["builder_projects"],
    queryFn: async () => (await supabase.from("builder_pages").select("id,slug,title,meta,updated_at").eq("kind", "project").eq("status", "published").order("updated_at", { ascending: false })).data || [],
  });
  const areas = [...new Set(data.map((p: any) => p.meta?.location).filter(Boolean))] as string[];
  const list = data.filter((p: any) => (status === "all" || p.meta?.status === status) && (area === "all" || p.meta?.location === area));
  return (
    <PageShell title="New Projects in Indore" subtitle="RERA-registered launches and ready-to-move projects from trusted developers." seoTitle="New Residential Projects in Indore | Indore Realty" seoDescription="Explore upcoming, under-construction and ready-to-move projects in Indore with price lists, floor plans and brochures." path="/projects">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="sm:w-56" aria-label="Filter by status"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All statuses</SelectItem>{PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={area} onValueChange={setArea}><SelectTrigger className="sm:w-56" aria-label="Filter by area"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All areas</SelectItem>{areas.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
      </div>
      {isLoading ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{[0, 1, 2].map((i) => <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />)}</div>
        : !list.length ? <p className="text-center text-muted-foreground py-16">No projects found. Please check back soon.</p>
        : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{list.map((p: any) => (
          <Link key={p.id} to={`/projects/${p.slug}`} className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-shadow">
            <div className="relative aspect-[16/10] overflow-hidden">{p.meta?.cover ? <img src={p.meta.cover} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full navy-gradient flex items-center justify-center"><Building2 className="h-12 w-12 text-secondary" aria-hidden="true" /></div>}
              {p.meta?.status && <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">{p.meta.status}</Badge>}</div>
            <div className="p-5"><h2 className="font-heading text-lg font-bold group-hover:text-secondary">{p.title}</h2>
              {p.meta?.builder && <p className="text-xs text-muted-foreground">by {p.meta.builder}</p>}
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {p.meta?.location && <p className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />{p.meta.location}</p>}
                {p.meta?.possession && <p className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-secondary" aria-hidden="true" />Possession {p.meta.possession}</p>}</div>
              <div className="mt-4 flex items-end justify-between border-t border-border pt-3"><span className="text-sm">{p.meta?.config}</span><span className="font-semibold text-secondary">{p.meta?.price_from || "Price on request"}</span></div></div>
          </Link>))}</div>}
    </PageShell>
  );
};
export default Projects;
