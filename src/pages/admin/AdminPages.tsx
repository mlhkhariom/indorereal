import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, ExternalLink, HelpCircle, Briefcase } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { EDITABLE_PAGES } from "@/hooks/useSitePage";
import { useToast } from "@/hooks/use-toast";

type PageRow = { slug: string; title: string; content: string; seo_title: string; seo_description: string };

const AdminPages = () => {
  const [active, setActive] = useState(EDITABLE_PAGES[0].slug);
  const [rows, setRows] = useState<Record<string, PageRow>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    supabase.from("site_pages").select("*").then(({ data }) => {
      const m: Record<string, PageRow> = {};
      EDITABLE_PAGES.forEach((p) => { m[p.slug] = { slug: p.slug, title: p.title, content: "", seo_title: "", seo_description: "" }; });
      data?.forEach((r: any) => { m[r.slug] = { ...m[r.slug], ...r, seo_title: r.seo_title || "", seo_description: r.seo_description || "" }; });
      setRows(m);
    });
  }, []);

  const row = rows[active];
  const set = (patch: Partial<PageRow>) => setRows((r) => ({ ...r, [active]: { ...r[active], ...patch } }));
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_pages").upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: "slug" });
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { qc.invalidateQueries({ queryKey: ["site_page", active] }); toast({ title: "Page saved" }); }
  };

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-4">
      <div className="space-y-1">
        {EDITABLE_PAGES.map((p) => (
          <button key={p.slug} onClick={() => setActive(p.slug)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${active === p.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
            {p.title}{rows[p.slug]?.content?.trim() ? <Badge variant="secondary" className="text-[10px]">Custom</Badge> : null}
          </button>
        ))}
        <div className="pt-3 text-xs text-muted-foreground space-y-2 px-1">
          <p>FAQ and Job openings are edited under <Link to="/admin/homepage" className="text-secondary underline">Homepage → FAQ / Jobs</Link>.</p>
          <p className="flex items-center gap-1"><HelpCircle className="h-3 w-3" aria-hidden="true" /><Briefcase className="h-3 w-3" aria-hidden="true" /></p>
        </div>
      </div>
      {row && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">Leave the content empty to keep the built-in designed page.</p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm"><a href={`/${active}`} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 mr-1" aria-hidden="true" />View<span className="sr-only"> (opens in new tab)</span></a></Button>
                <Button size="sm" className="btn-gold" onClick={save} disabled={saving}><Save className="h-4 w-4 mr-1" aria-hidden="true" />{saving ? "Saving…" : "Save"}</Button>
              </div>
            </div>
            <div><Label>Page heading</Label><Input value={row.title} onChange={(e) => set({ title: e.target.value })} /></div>
            <div><Label>Content</Label><RichTextEditor value={row.content} onChange={(content) => set({ content })} /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>SEO title</Label><Input value={row.seo_title} onChange={(e) => set({ seo_title: e.target.value })} maxLength={70} /></div>
              <div><Label>SEO description</Label><Textarea rows={2} value={row.seo_description} onChange={(e) => set({ seo_description: e.target.value })} maxLength={170} /></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export default AdminPages;
