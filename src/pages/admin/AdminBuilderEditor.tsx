import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, GripVertical, Eye, EyeOff, Copy, Trash2, Plus, Undo2, Redo2, Smartphone, Tablet, Monitor, Save, Globe, ExternalLink, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ImageUploader from "@/components/admin/ImageUploader";
import BlockSettings from "@/components/builder/BlockSettings";
import { BLOCKS, Block, BlockBg, getDef, isValidSlug, makeBlock, normalizeBlocks, slugify, uid, PROJECT_STATUSES } from "@/lib/builder";

type Page = { id: string; slug: string; kind: string; title: string; status: string; seo_title: string; seo_description: string; og_image: string; meta: Record<string, any> };

const SortRow = ({ b, selected, onSelect, onToggle, onDup, onDel }: { b: Block; selected: boolean; onSelect: () => void; onToggle: () => void; onDup: () => void; onDel: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: b.id });
  const def = getDef(b.type);
  const hint = b.data.heading || b.data.name || "";
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`flex items-center gap-1 rounded-lg border bg-card p-1.5 ${selected ? "border-secondary ring-1 ring-secondary" : "border-border"} ${isDragging ? "shadow-lg z-10 relative" : ""}`}>
      <button type="button" className="p-1.5 cursor-grab text-muted-foreground touch-none" aria-label={`Drag ${def?.label}`} {...attributes} {...listeners}><GripVertical className="h-4 w-4" aria-hidden="true" /></button>
      <button type="button" onClick={onSelect} className={`flex-1 text-left min-w-0 ${b.hidden ? "opacity-50" : ""}`}>
        <span className="block text-sm font-medium truncate">{def?.label}</span>{hint && <span className="block text-xs text-muted-foreground truncate">{hint}</span>}
      </button>
      <Button size="icon" variant="ghost" className="h-7 w-7" aria-label={b.hidden ? "Show block" : "Hide block"} onClick={onToggle}>{b.hidden ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}</Button>
      <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Duplicate block" onClick={onDup}><Copy className="h-3.5 w-3.5" aria-hidden="true" /></Button>
      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" aria-label="Delete block" onClick={onDel}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /></Button>
    </li>
  );
};

const AdminBuilderEditor = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [page, setPage] = useState<Page | null>(null);
  const [hist, setHist] = useState<{ past: Block[][]; now: Block[]; future: Block[][] }>({ past: [], now: [], future: [] });
  const [selected, setSelected] = useState<string | null>(null);
  const [device, setDevice] = useState<"phone" | "tablet" | "desktop">("desktop");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mobileTab, setMobileTab] = useState("edit");
  const frame = useRef<HTMLIFrameElement>(null);
  const [isLg, setIsLg] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => { const m = window.matchMedia("(min-width: 1024px)"); const f = () => setIsLg(m.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  const blocks = hist.now;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    supabase.from("builder_pages").select("*").eq("id", id!).maybeSingle().then(({ data }) => {
      if (!data) return;
      setPage({ ...(data as any), seo_title: data.seo_title || "", seo_description: data.seo_description || "", og_image: data.og_image || "", meta: (data.meta as any) || {} });
      setHist({ past: [], now: normalizeBlocks(data.blocks), future: [] });
    });
  }, [id]);

  const commit = useCallback((fn: (b: Block[]) => Block[]) => {
    setHist((h) => ({ past: [...h.past.slice(-49), h.now], now: fn(h.now), future: [] }));
    setDirty(true);
  }, []);
  // Typing in settings shouldn't create one undo step per keystroke: group edits on the same block.
  const lastEdit = useRef<{ id: string; t: number }>({ id: "", t: 0 });
  const editData = (bid: string, data: Record<string, any>) => {
    const now = Date.now();
    const merge = lastEdit.current.id === bid && now - lastEdit.current.t < 1200;
    lastEdit.current = { id: bid, t: now };
    setHist((h) => ({ past: merge ? h.past : [...h.past.slice(-49), h.now], now: h.now.map((b) => (b.id === bid ? { ...b, data } : b)), future: [] }));
    setDirty(true);
  };
  const undo = () => setHist((h) => h.past.length ? { past: h.past.slice(0, -1), now: h.past[h.past.length - 1], future: [h.now, ...h.future] } : h);
  const redo = () => setHist((h) => h.future.length ? { past: [...h.past, h.now], now: h.future[0], future: h.future.slice(1) } : h);
  const setP = (patch: Partial<Page>) => { setPage((p) => p && { ...p, ...patch }); setDirty(true); };
  const setMeta = (patch: Record<string, any>) => setPage((p) => { setDirty(true); return p && { ...p, meta: { ...p.meta, ...patch } }; });

  const push = useCallback(() => {
    frame.current?.contentWindow?.postMessage({ type: "builder:update", blocks, title: page?.title, selected }, window.location.origin);
  }, [blocks, page?.title, selected]);
  useEffect(() => { push(); }, [push]);
  useEffect(() => {
    const on = (e: MessageEvent) => { if (e.origin === window.location.origin && e.data?.type === "builder:ready") push(); };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [push]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "s") { e.preventDefault(); save(); }
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === "y" || (e.key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", k);
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => { window.removeEventListener("keydown", k); window.removeEventListener("beforeunload", warn); };
  });

  const save = async (status?: string) => {
    if (!page) return;
    if (!isValidSlug(page.slug)) return toast({ title: "Fix the web address", description: "Use small letters, numbers and dashes only.", variant: "destructive" });
    if (!page.title.trim()) return toast({ title: "Add a page title", variant: "destructive" });
    setSaving(true);
    const next = status || page.status;
    const { error } = await supabase.from("builder_pages").update({
      slug: page.slug, title: page.title.trim(), status: next, blocks: blocks as any, seo_title: page.seo_title || null, seo_description: page.seo_description || null, og_image: page.og_image || null, meta: page.meta,
    }).eq("id", page.id);
    setSaving(false);
    if (error) return toast({ title: "Could not save", description: error.message.includes("duplicate") ? "Another page already uses this web address." : error.message, variant: "destructive" });
    setPage({ ...page, status: next }); setDirty(false);
    qc.invalidateQueries({ queryKey: ["builder_page"] }); qc.invalidateQueries({ queryKey: ["builder_projects"] });
    toast({ title: status === "published" ? "Published — it's live" : status === "draft" ? "Unpublished" : "Saved" });
  };

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    commit((b) => arrayMove(b, b.findIndex((x) => x.id === e.active.id), b.findIndex((x) => x.id === e.over!.id)));
  };
  const add = (type: string) => {
    const nb = makeBlock(type);
    commit((b) => { const i = selected ? b.findIndex((x) => x.id === selected) : -1; const n = [...b]; n.splice(i >= 0 ? i + 1 : n.length, 0, nb); return n; });
    setSelected(nb.id);
  };

  if (!page) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  const sel = blocks.find((b) => b.id === selected);
  const selDef = sel && getDef(sel.type);
  const publicUrl = page.kind === "project" ? `/projects/${page.slug}` : `/p/${page.slug}`;
  const width = device === "phone" ? 390 : device === "tablet" ? 820 : "100%";

  const AddMenu = (
    <Popover><PopoverTrigger asChild><Button className="w-full btn-gold"><Plus className="h-4 w-4 mr-1" aria-hidden="true" />Add block</Button></PopoverTrigger>
      <PopoverContent className="w-80 max-h-[60vh] overflow-y-auto" align="start">
        {(["Real estate", "General"] as const).map((g) => (
          <div key={g} className="mb-3"><p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">{g}</p>
            <div className="grid grid-cols-2 gap-1.5">{BLOCKS.filter((b) => b.group === g).map((b) => (
              <button key={b.type} type="button" onClick={() => add(b.type)} className="text-left text-sm rounded-md border border-border px-2 py-2 hover:border-secondary hover:bg-muted">{b.label}</button>))}</div></div>))}
      </PopoverContent></Popover>
  );

  const editor = (
    <div className="space-y-3">
      {sel && selDef ? (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setSelected(null)}><ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />All blocks</Button>
          <h3 className="font-semibold">{selDef.label}</h3>
          <div><Label className="mb-1.5 block">Background</Label>
            <Select value={sel.bg || "light"} onValueChange={(v) => commit((b) => b.map((x) => (x.id === sel.id ? { ...x, bg: v as BlockBg } : x)))}>
              <SelectTrigger aria-label="Background"><SelectValue /></SelectTrigger>
              <SelectContent>{[["light", "White"], ["muted", "Light grey"], ["dark", "Navy"], ["gold", "Gold"]].map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></div>
          <BlockSettings key={sel.id} fields={selDef.fields} data={sel.data} onChange={(d) => editData(sel.id, d)} />
        </div>
      ) : (
        <Tabs defaultValue="blocks">
          <TabsList className="w-full"><TabsTrigger value="blocks" className="flex-1">Blocks</TabsTrigger><TabsTrigger value="settings" className="flex-1">Page settings</TabsTrigger></TabsList>
          <TabsContent value="blocks" className="space-y-3">
            {AddMenu}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-1.5">{blocks.map((b) => (
                  <SortRow key={b.id} b={b} selected={b.id === selected} onSelect={() => { setSelected(b.id); }}
                    onToggle={() => commit((a) => a.map((x) => (x.id === b.id ? { ...x, hidden: !x.hidden } : x)))}
                    onDup={() => commit((a) => { const i = a.findIndex((x) => x.id === b.id); const n = [...a]; n.splice(i + 1, 0, { ...structuredClone(b), id: uid() }); return n; })}
                    onDel={() => { if (confirm("Delete this block?")) commit((a) => a.filter((x) => x.id !== b.id)); }} />))}</ul>
              </SortableContext>
            </DndContext>
            {!blocks.length && <p className="text-sm text-muted-foreground text-center py-6">No blocks yet.</p>}
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <div><Label>Page title</Label><Input value={page.title} onChange={(e) => setP({ title: e.target.value })} maxLength={120} /></div>
            <div><Label>Web address</Label><div className="flex items-center gap-1 text-sm"><span className="text-muted-foreground shrink-0">{page.kind === "project" ? "/projects/" : "/p/"}</span>
              <Input value={page.slug} onChange={(e) => setP({ slug: slugify(e.target.value) })} aria-invalid={!isValidSlug(page.slug)} /></div></div>
            {page.kind === "project" && (
              <div className="space-y-3 rounded-lg border border-border p-3">
                <p className="text-sm font-semibold">Project card (shown on the Projects list)</p>
                <div><Label>Status</Label><Select value={page.meta.status || PROJECT_STATUSES[1]} onValueChange={(v) => setMeta({ status: v })}><SelectTrigger aria-label="Project status"><SelectValue /></SelectTrigger>
                  <SelectContent>{PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                {[["location", "Area", "Vijay Nagar"], ["builder", "Builder", ""], ["price_from", "Starting price", "₹ 55 L onwards"], ["config", "Configuration", "2 & 3 BHK"], ["possession", "Possession", "Dec 2027"], ["rera", "RERA number", ""], ["project_type", "Project type", "Apartments / Plots"], ["tagline", "Card tagline", ""], ["keywords", "SEO keywords", "Comma-separated keywords"]].map(([k, l, ph]) => (
                  <div key={k}><Label>{l}</Label><Input value={page.meta[k] || ""} placeholder={ph} onChange={(e) => setMeta({ [k]: e.target.value })} /></div>))}
                <div><Label>Highlights (one per line)</Label><Textarea rows={4} value={(page.meta.highlights || []).join("\n")} onChange={(e) => setMeta({ highlights: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 8) })} /></div>
                <div><Label>Cover photo</Label><ImageUploader folder="pages" value={page.meta.cover ? [page.meta.cover] : []} onChange={(u) => setMeta({ cover: u[u.length - 1] || "" })} /></div>
              </div>
            )}
            <div><Label>SEO title</Label><Input value={page.seo_title} maxLength={70} onChange={(e) => setP({ seo_title: e.target.value })} /><p className="text-xs text-muted-foreground mt-1">{page.seo_title.length}/60 recommended</p></div>
            <div><Label>SEO description</Label><Textarea rows={3} value={page.seo_description} maxLength={170} onChange={(e) => setP({ seo_description: e.target.value })} /><p className="text-xs text-muted-foreground mt-1">{page.seo_description.length}/160</p></div>
            <div><Label>Share image (WhatsApp / Facebook)</Label><ImageUploader folder="pages" value={page.og_image ? [page.og_image] : []} onChange={(u) => setP({ og_image: u[u.length - 1] || "" })} /></div>
            <p className="text-xs text-muted-foreground">To show this page in the website menu, add the link <code className="bg-muted px-1 rounded">{publicUrl}</code> in <Link to="/admin/menus" className="text-secondary underline">Menus</Link>.</p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );

  const preview = (
    <div className="h-full bg-muted/60 rounded-xl overflow-auto flex justify-center p-3">
      <iframe ref={frame} title="Live preview" src="/builder-preview" onLoad={push} style={{ width }} className="h-full min-h-[70vh] bg-background rounded-lg shadow-lg border border-border transition-all" />
    </div>
  );

  return (
    <div className="space-y-3 -mx-1">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="icon" aria-label="Back to list"><Link to={page.kind === "project" ? "/admin/projects" : "/admin/builder"}><ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link></Button>
        <div className="min-w-0 flex-1"><p className="font-semibold truncate">{page.title}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-2"><Badge variant={page.status === "published" ? "default" : "secondary"} className="text-[10px]">{page.status === "published" ? "Live" : "Draft"}</Badge>{dirty ? "Unsaved changes" : "All changes saved"}</p></div>
        <Button variant="ghost" size="icon" aria-label="Undo" disabled={!hist.past.length} onClick={undo}><Undo2 className="h-4 w-4" aria-hidden="true" /></Button>
        <Button variant="ghost" size="icon" aria-label="Redo" disabled={!hist.future.length} onClick={redo}><Redo2 className="h-4 w-4" aria-hidden="true" /></Button>
        <div className="hidden lg:flex rounded-lg border border-border p-0.5">{([["phone", Smartphone], ["tablet", Tablet], ["desktop", Monitor]] as const).map(([d, I]) => (
          <Button key={d} variant={device === d ? "secondary" : "ghost"} size="icon" className="h-8 w-8" aria-label={`${d} preview`} aria-pressed={device === d} onClick={() => setDevice(d)}><I className="h-4 w-4" aria-hidden="true" /></Button>))}</div>
        {page.status === "published" && <Button asChild variant="outline" size="sm"><a href={publicUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 mr-1" aria-hidden="true" />View<span className="sr-only"> (opens in new tab)</span></a></Button>}
        <Button variant="outline" size="sm" onClick={() => save()} disabled={saving}><Save className="h-4 w-4 mr-1" aria-hidden="true" />Save</Button>
        {page.status === "published"
          ? <Button variant="outline" size="sm" onClick={() => save("draft")} disabled={saving}>Unpublish</Button>
          : <Button size="sm" className="btn-gold" onClick={() => save("published")} disabled={saving}><Globe className="h-4 w-4 mr-1" aria-hidden="true" />Publish</Button>}
      </div>

      {isLg ? (
        <div className="grid grid-cols-[360px_1fr] gap-4 h-[calc(100vh-150px)]">
          <div className="overflow-y-auto pr-1">{editor}</div>
          {preview}
        </div>
      ) : (
        <Tabs value={mobileTab} onValueChange={setMobileTab}>
          <TabsList className="w-full"><TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger><TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger></TabsList>
          <div className={mobileTab === "edit" ? "mt-2" : "hidden"}>{editor}</div>
          <div className={mobileTab === "preview" ? "mt-2 h-[75vh]" : "hidden"}>{preview}</div>
        </Tabs>
      )}
    </div>
  );
};
export default AdminBuilderEditor;
