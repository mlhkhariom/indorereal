import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Copy, Trash2, Pencil, ExternalLink, LayoutTemplate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TEMPLATES, slugify, isValidSlug, uid } from "@/lib/builder";

type Row = { id: string; slug: string; title: string; status: string; updated_at: string; kind: string; blocks: any; meta: any; seo_title: string | null; seo_description: string | null; og_image: string | null };

const AdminBuilderList = ({ kind }: { kind: "page" | "project" }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tpl, setTpl] = useState(kind === "project" ? "project" : "landing");
  const nav = useNavigate();
  const { toast } = useToast();
  const base = kind === "project" ? "/projects/" : "/p/";

  const load = () => supabase.from("builder_pages").select("*").eq("kind", kind).order("updated_at", { ascending: false }).then(({ data }) => setRows((data as any) || []));
  useEffect(() => { load(); }, [kind]);

  const create = async () => {
    const slug = slugify(title);
    if (!title.trim() || !isValidSlug(slug)) return toast({ title: "Enter a name using letters or numbers", variant: "destructive" });
    const blocks = TEMPLATES[tpl].blocks();
    const hero = blocks.find((b) => b.type === "hero");
    if (hero) hero.data.heading = title.trim();
    const { data, error } = await supabase.from("builder_pages").insert({ kind, title: title.trim(), slug, blocks: blocks as any, meta: kind === "project" ? { status: "Under Construction" } : {} }).select("id").single();
    if (error) return toast({ title: "Could not create", description: error.message.includes("duplicate") ? "That name is already used." : error.message, variant: "destructive" });
    nav(`/admin/builder/${data.id}`);
  };
  const duplicate = async (r: Row) => {
    const { error } = await supabase.from("builder_pages").insert({ kind, title: `${r.title} (copy)`, slug: `${r.slug}-${uid().slice(0, 4)}`, blocks: r.blocks, meta: r.meta, seo_title: r.seo_title, seo_description: r.seo_description, og_image: r.og_image, status: "draft" });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else { toast({ title: "Copy created as draft" }); load(); }
  };
  const remove = async (r: Row) => {
    if (!confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("builder_pages").delete().eq("id", r.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else load();
  };

  const list = rows.filter((r) => (r.title + r.slug).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="relative sm:w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input className="pl-9" placeholder={`Search ${kind === "project" ? "projects" : "pages"}`} aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <Button className="btn-gold" onClick={() => { setTitle(""); setOpen(true); }}><Plus className="h-4 w-4 mr-1" aria-hidden="true" />{kind === "project" ? "New project" : "New page"}</Button>
      </div>
      {!list.length ? (
        <Card><CardContent className="py-14 text-center text-muted-foreground"><LayoutTemplate className="h-10 w-10 mx-auto mb-3 text-secondary" aria-hidden="true" />
          {rows.length ? "Nothing matches your search." : kind === "project" ? "No projects yet. Create your first builder project page." : "No pages yet. Create a landing page in minutes."}</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map((r) => (
            <Card key={r.id} className="overflow-hidden">
              {kind === "project" && (r.meta?.cover ? <img src={r.meta.cover} alt="" className="h-32 w-full object-cover" loading="lazy" /> : <div className="h-32 navy-gradient" />)}
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2"><Link to={`/admin/builder/${r.id}`} className="font-semibold hover:text-secondary">{r.title}</Link>
                  <Badge variant={r.status === "published" ? "default" : "secondary"} className="shrink-0">{r.status === "published" ? "Live" : "Draft"}</Badge></div>
                <p className="text-xs text-muted-foreground truncate">{base}{r.slug}{kind === "project" && r.meta?.status ? ` · ${r.meta.status}` : ""}</p>
                <p className="text-xs text-muted-foreground">Edited {new Date(r.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                <div className="flex gap-1 pt-1">
                  <Button asChild size="sm" variant="outline"><Link to={`/admin/builder/${r.id}`}><Pencil className="h-3.5 w-3.5 mr-1" aria-hidden="true" />Edit</Link></Button>
                  {r.status === "published" && <Button asChild size="icon" variant="ghost" className="h-8 w-8"><a href={`${base}${r.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${r.title} (opens in new tab)`}><ExternalLink className="h-4 w-4" aria-hidden="true" /></a></Button>}
                  <Button size="icon" variant="ghost" className="h-8 w-8" aria-label={`Duplicate ${r.title}`} onClick={() => duplicate(r)}><Copy className="h-4 w-4" aria-hidden="true" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" aria-label={`Delete ${r.title}`} onClick={() => remove(r)}><Trash2 className="h-4 w-4" aria-hidden="true" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{kind === "project" ? "New project" : "New page"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label htmlFor="np-title">{kind === "project" ? "Project name" : "Page name"}</Label><Input id="np-title" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={kind === "project" ? "e.g. Skyline Heights" : "e.g. Diwali Offers"} />
              {title && <p className="text-xs text-muted-foreground mt-1">Address: {base}{slugify(title)}</p>}</div>
            <div><Label>Start from</Label><div className="grid grid-cols-2 gap-2 mt-1.5">{Object.entries(TEMPLATES).map(([k, v]) => (
              <button key={k} type="button" aria-pressed={tpl === k} onClick={() => setTpl(k)} className={`rounded-lg border p-3 text-left text-sm ${tpl === k ? "border-secondary ring-1 ring-secondary bg-secondary/10" : "border-border hover:bg-muted"}`}>
                <span className="font-medium block">{v.label}</span><span className="text-xs text-muted-foreground">{v.blocks().length} blocks</span></button>))}</div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button className="btn-gold" onClick={create}>Create & edit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AdminBuilderList;
