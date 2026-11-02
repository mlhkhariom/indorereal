import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, GripVertical, Eye, EyeOff, Copy, Trash2, Plus, Undo2, Redo2, Smartphone, Tablet, Monitor, Save, Globe, ExternalLink, ChevronLeft, Search, Lock, Unlock, ArrowUp, ArrowDown, Download, Upload, CheckCircle2, Loader2, AlertCircle, Layers, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ImageUploader from "@/components/admin/ImageUploader";
import BlockSettings from "@/components/builder/BlockSettings";
import { BLOCKS, Block, BlockBg, getDef, isValidSlug, makeBlock, normalizeBlocks, slugify, PROJECT_STATUSES } from "@/lib/builder";
import { duplicateBlock, moveBlock, parseBlockImport } from "@/lib/builder-editor";
import { useBuilderAutosave } from "@/hooks/useBuilderAutosave";

type Page = { id: string; slug: string; kind: string; title: string; status: string; seo_title: string; seo_description: string; og_image: string; meta: Record<string, any> };
type History = { past: Block[][]; now: Block[]; future: Block[][] };

const SortRow = ({ b, index, selected, action }: { b: Block; index: number; selected: boolean; action: (action: string, id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: b.id, disabled: b.locked });
  const label = b.name || getDef(b.type)?.label || b.type;
  return <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`flex items-center gap-1 rounded-md border bg-card p-1.5 ${selected ? "border-primary ring-1 ring-primary" : "border-border"} ${isDragging ? "opacity-40" : ""}`}>
    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 cursor-grab touch-none" disabled={b.locked} aria-label={`Drag ${label}`} title={`Drag ${label}`} {...attributes} {...listeners}><GripVertical className="h-4 w-4" /></Button>
    <Button variant="ghost" className={`min-w-0 h-auto flex-1 justify-start px-1 text-left ${b.hidden ? "opacity-50" : ""}`} onClick={() => action("select", b.id)}><span className="min-w-0"><span className="block truncate text-sm">{index + 1}. {label}</span><span className="block truncate text-xs font-normal text-muted-foreground">{b.data.heading || b.data.name || getDef(b.type)?.group}</span></span></Button>
    {b.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-label="Locked" />}
    <Button size="icon" variant="ghost" className="h-7 w-7" disabled={b.locked} aria-label={b.hidden ? `Show ${label}` : `Hide ${label}`} title={b.hidden ? "Show" : "Hide"} onClick={() => action("toggle", b.id)}>{b.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</Button>
  </li>;
};

const AdminBuilderEditor = () => {
  const { id } = useParams();
  const [loaded, setLoaded] = useState<{page: Page; blocks: Block[]} | null>(null);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoaded(null);
    setLoadError("");
    supabase.from("builder_pages").select("*").eq("id", id).maybeSingle().then(({data, error}) => {
      if (!active) return;
      if (error || !data) { setLoadError(error?.message || "Page not found or access unavailable."); return; }
      setLoaded({page: { ...data, seo_title: data.seo_title || "", seo_description: data.seo_description || "", og_image: data.og_image || "", meta: (data.meta as Record<string, any>) || {} }, blocks: normalizeBlocks(data.blocks)});
    });
    return () => { active = false; };
  }, [id]);
  if (loadError) return <div role="alert" className="p-8 text-destructive">{loadError}<Button asChild variant="link"><Link to="/admin/projects">Back to projects</Link></Button></div>;
  if (!loaded) return <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Loading builder…</div>;
  return <Editor key={loaded.page.id} initial={loaded} />;
};

function Editor({ initial }: { initial: { page: Page; blocks: Block[] } }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [page, setPage] = useState(initial.page);
  const [hist, setHist] = useState<History>({ past: [], now: initial.blocks, future: [] });
  const [selected, setSelected] = useState<string | null>(null);
  const [device, setDevice] = useState<"phone" | "tablet" | "desktop">("desktop");
  const [autoSave, setAutoSave] = useState(true);
  const [editing, setEditing] = useState(true);
  const [mobileTab, setMobileTab] = useState("edit");
  const [panel, setPanel] = useState(true);
  const [isLg, setIsLg] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {const media = window.matchMedia("(min-width: 1024px)"); const update = () => setIsLg(media.matches); media.addEventListener("change",update); return () => media.removeEventListener("change",update);}, []);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const [recovery, setRecovery] = useState<string | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const upload = useRef<HTMLInputElement>(null);
  const blocks = hist.now;
  const snapshot = JSON.stringify({ page, blocks });
  const baseline = useRef(JSON.stringify(initial));
  const recoveryKey = `builder-recovery:${page.id}`;
  useEffect(() => { try { const value = sessionStorage.getItem(recoveryKey); if (value && value !== baseline.current) setRecovery(value); } catch { /* no local recovery */ } }, [recoveryKey]);
  const persist = async (value: string) => {
    const {page: p, blocks: b} = JSON.parse(value) as {page: Page; blocks: Block[]};
    if (!isValidSlug(p.slug)) throw new Error("Use small letters, numbers and dashes in the web address.");
    if (!p.title.trim()) throw new Error("Add a page title before saving.");
    const { data, error } = await supabase.from("builder_pages").update({slug: p.slug, title: p.title.trim(), status: p.status, blocks: b as any, seo_title: p.seo_title || null, seo_description: p.seo_description || null, og_image: p.og_image || null, meta: p.meta}).eq("id", initial.page.id).select("id").single();
    if (error || !data) throw new Error(error?.message || "Save was not accepted. Check your access and retry.");
    qc.invalidateQueries({queryKey: ["builder_page"]}); qc.invalidateQueries({queryKey: ["builder_projects"]}); qc.invalidateQueries({queryKey: ["builder_projects_featured"]});
  };
  const {dirty, saving, error, lastSaved, save} = useBuilderAutosave({snapshot, initial: baseline.current, enabled: autoSave && !recovery, persist, recoveryKey});
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const commit = useCallback((fn: (blocks: Block[]) => Block[]) => {
    setHist(h => { const next = fn(h.now); return next === h.now ? h : { past: [...h.past.slice(-49), h.now], now: next, future: [] }; });
  }, []);
  const lastEdit = useRef({id: "", t: 0});
  const editData = (bid: string, data: Record<string, any>) => {
    const t = Date.now(); const merge = lastEdit.current.id === bid && t - lastEdit.current.t < 1200;
    lastEdit.current = {id: bid, t};
    setHist(h => ({past: merge ? h.past : [...h.past.slice(-49), h.now], now: h.now.map(b => b.id === bid && !b.locked ? {...b, data} : b), future: []}));
  };
  const undo = () => setHist(h => h.past.length ? {past: h.past.slice(0,-1), now: h.past[h.past.length-1], future: [h.now,...h.future]} : h);
  const redo = () => setHist(h => h.future.length ? {past: [...h.past,h.now], now: h.future[0], future: h.future.slice(1)} : h);
  const setP = (patch: Partial<Page>) => setPage(p => ({...p,...patch}));
  const setMeta = (patch: Record<string, any>) => setPage(p => ({...p,meta: {...p.meta,...patch}}));
  const add = (type: string, after = selected) => {
    if (!getDef(type)) return;
    const nb = makeBlock(type); commit(b => {const i = b.findIndex(x => x.id === after); const n = [...b]; n.splice(i < 0 ? n.length : i+1,0,nb); return n;}); setSelected(nb.id); setLibraryOpen(false);
  };
  const action = (a: string, bid: string, extra?: Record<string, unknown>) => {
    const b = blocks.find(b => b.id === bid);
    if (a === "add" && typeof extra?.blockType === "string") return add(extra.blockType, bid);
    if (!b) return;
    if (a === "select") {setSelected(bid); setPanel(true); setMobileTab("edit"); return;}
    if (a === "insert") {setSelected(bid); setPanel(true); setLibraryOpen(true); return;}
    if (a === "lock") {commit(all => all.map(x => x.id === bid ? {...x,locked: !x.locked} : x)); return;}
    if (b.locked) return;
    if (a === "move" && typeof extra?.over === "string") commit(all => moveBlock(all,bid,String(extra.over)));
    if (a === "up" || a === "down") {const i = blocks.findIndex(x => x.id === bid); const target = blocks[i + (a === "up" ? -1 : 1)]; if (target) commit(all => moveBlock(all,bid,target.id));}
    if (a === "toggle") commit(all => all.map(x => x.id === bid ? {...x,hidden: !x.hidden} : x));
    if (a === "duplicate") {const result = duplicateBlock(blocks,bid); commit(() => result.blocks); if (result.id) setSelected(result.id);}
    if (a === "delete" && confirm("Delete this block? You can undo this change.")) {commit(all => all.filter(x => x.id !== bid)); setSelected(null);}
  };
  const push = useCallback(() => frame.current?.contentWindow?.postMessage({type: "builder:update", blocks, title: page.title, kind: page.kind, selected, editing}, window.location.origin), [blocks, page.title, page.kind, selected, editing]);
  useEffect(() => {push();}, [push]);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "builder:ready") push();
      if (e.data?.type === "builder:action" && typeof e.data.action === "string" && typeof e.data.id === "string") action(e.data.action,e.data.id,e.data);
    };
    window.addEventListener("message",on); return () => window.removeEventListener("message",on);
  });
  const manualSave = async () => {if (await save()) toast({title: "All changes saved"});};
  const changeStatus = (status: string) => {
    if (!isValidSlug(page.slug) || !page.title.trim()) return toast({title: "Add a valid title and web address", variant: "destructive"});
    setP({status});
  };
  const statusToSave = useRef(page.status);
  useEffect(() => {if (statusToSave.current !== page.status) {statusToSave.current = page.status; void save();}}, [page.status,save]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() === "s") {e.preventDefault(); void manualSave(); return;}
      const target = e.target as HTMLElement;
      if (["INPUT","TEXTAREA","SELECT"].includes(target.tagName) || target.isContentEditable) return;
      if (e.key.toLowerCase() === "z") {e.preventDefault(); e.shiftKey ? redo() : undo();}
      if (e.key.toLowerCase() === "y") {e.preventDefault(); redo();}
      if (e.key.toLowerCase() === "d" && selected) {e.preventDefault(); action("duplicate",selected);}
    }; window.addEventListener("keydown",key); return () => window.removeEventListener("keydown",key);
  });
  const onDragEnd = (e: DragEndEvent) => {setActiveDrag(null); if (e.over) commit(all => moveBlock(all,String(e.active.id),String(e.over?.id)));};
  const exportBlocks = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({version: 1,blocks},null,2)],{type: "application/json"}));
    const a = document.createElement("a"); a.href = url; a.download = `${page.slug}-blocks.json`; a.click(); URL.revokeObjectURL(url);
  };
  const restore = () => {
    try { const value = JSON.parse(recovery || ""); if (value.page?.id !== page.id) throw new Error("Invalid recovery"); setPage({...page,...value.page,id: page.id}); commit(() => normalizeBlocks(value.blocks)); setRecovery(null); }
    catch {toast({title: "Recovery could not be opened",variant:"destructive"}); setRecovery(null);}
  };
  const sel = blocks.find(b => b.id === selected); const selDef = sel && getDef(sel.type);
  const publicUrl = page.kind === "project" ? `/projects/${page.slug}` : `/p/${page.slug}`;
  const width = device === "phone" ? 390 : device === "tablet" ? 820 : "100%";
  const AddMenu = <Popover open={libraryOpen} onOpenChange={setLibraryOpen}><PopoverTrigger asChild><Button className="w-full" size="sm"><Plus className="h-4 w-4 mr-2" />Add block</Button></PopoverTrigger>
    <PopoverContent className="w-80 max-w-[calc(100vw-2rem)] max-h-[65vh] overflow-y-auto" align="start">
      <div className="relative mb-3"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input autoFocus aria-label="Search block library" placeholder="Search blocks…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} /></div>
      {(["Real estate","General"] as const).map(group => <div key={group} className="mb-4"><p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{group}</p><div className="grid grid-cols-2 gap-1.5">{BLOCKS.filter(b => b.group === group && b.label.toLowerCase().includes(search.toLowerCase())).map(b => <Button key={b.type} variant="outline" className="h-auto min-h-10 whitespace-normal justify-start text-left text-xs" draggable onDragStart={e => {e.dataTransfer.setData("application/builder-block",b.type); e.dataTransfer.effectAllowed="copy";}} onClick={() => add(b.type)}>{b.label}</Button>)}</div></div>)}
    </PopoverContent></Popover>;
  const editor = <div className="space-y-3">
    {sel && selDef ? <div className="space-y-4">
      <div className="flex items-center justify-between"><Button variant="ghost" size="sm" onClick={() => setSelected(null)}><ChevronLeft className="h-4 w-4 mr-1" />All blocks</Button><Badge variant="outline">{selDef.group}</Badge></div>
      <h3 className="font-semibold">{selDef.label}</h3>
      <div className="flex flex-wrap gap-1">{[["up",ArrowUp,"Move up"],["down",ArrowDown,"Move down"],["duplicate",Copy,"Duplicate"],["toggle",sel.hidden ? EyeOff : Eye,"Visibility"],["lock",sel.locked ? Unlock : Lock,sel.locked ? "Unlock" : "Lock"],["delete",Trash2,"Delete"]].map(([a,I,label]) => {const Icon = I as typeof Copy; return <Button key={String(a)} variant="outline" size="icon" aria-label={String(label)} title={String(label)} disabled={sel.locked && a !== "lock"} onClick={() => action(String(a),sel.id)}><Icon className="h-4 w-4" /></Button>;})}</div>
      {AddMenu}
      <div><Label htmlFor="block-name">Layer name</Label><Input id="block-name" value={sel.name || ""} disabled={sel.locked} placeholder={selDef.label} maxLength={80} onChange={e => commit(all => all.map(b => b.id === sel.id ? {...b,name: e.target.value} : b))} /></div>
      <div><Label className="mb-1.5 block">Background</Label><Select disabled={sel.locked} value={sel.bg || "light"} onValueChange={v => commit(all => all.map(b => b.id === sel.id ? {...b,bg: v as BlockBg} : b))}><SelectTrigger aria-label="Background"><SelectValue /></SelectTrigger><SelectContent>{[["light","White"],["muted","Light grey"],["dark","Navy"],["gold","Gold"]].map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></div>
      <fieldset disabled={sel.locked} className={sel.locked ? "pointer-events-none opacity-50" : ""}><BlockSettings key={sel.id} fields={selDef.fields} data={sel.data} onChange={d => editData(sel.id,d)} /></fieldset>
    </div> : <Tabs defaultValue="blocks"><TabsList className="w-full"><TabsTrigger value="blocks" className="flex-1">Layers · {blocks.length}</TabsTrigger><TabsTrigger value="settings" className="flex-1">Page & SEO</TabsTrigger></TabsList>
      <TabsContent value="blocks" className="space-y-3">{AddMenu}<DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={e => setActiveDrag(String(e.active.id))} onDragCancel={() => setActiveDrag(null)} onDragEnd={onDragEnd}><SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}><ul className="space-y-1.5">{blocks.map((b,i) => <SortRow key={b.id} b={b} index={i} selected={b.id === selected} action={action} />)}</ul></SortableContext><DragOverlay>{activeDrag && <div className="rounded-md border border-primary bg-card p-3 text-sm shadow-lg">{getDef(blocks.find(b => b.id === activeDrag)?.type || "")?.label}</div>}</DragOverlay></DndContext>
      {!blocks.length && <div className="py-10 text-center text-muted-foreground"><Layers className="h-8 w-8 mx-auto mb-2" /><p className="text-sm">No blocks yet</p></div>}
      <div className="flex gap-2 border-t border-border pt-3"><Button variant="outline" size="sm" onClick={exportBlocks}><Download className="h-4 w-4 mr-1" />Export</Button><Button variant="outline" size="sm" onClick={() => upload.current?.click()}><Upload className="h-4 w-4 mr-1" />Import</Button></div>
      </TabsContent><TabsContent value="settings" className="space-y-4">
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

      </TabsContent></Tabs>}
  </div>;
  const preview = <div className="flex h-full min-w-0 flex-col overflow-hidden border border-border bg-muted">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card p-2"><div className="flex gap-1">{([["phone",Smartphone],["tablet",Tablet],["desktop",Monitor]] as const).map(([d,I]) => <Button key={d} variant={device === d ? "secondary" : "ghost"} size="icon" className="h-8 w-8" aria-label={`${d} preview`} title={`${d} preview`} aria-pressed={device === d} onClick={() => setDevice(d)}><I className="h-4 w-4" /></Button>)}</div><span className="hidden sm:block text-xs text-muted-foreground">{typeof width === "number" ? `${width}px` : "Fit to screen"}</span><Button variant={editing ? "outline" : "secondary"} size="sm" onClick={() => setEditing(v => !v)}><Eye className="h-4 w-4 mr-1" />{editing ? "Preview" : "Edit canvas"}</Button></div>
    <div className="flex flex-1 min-h-0 overflow-auto p-2"><iframe ref={frame} title="Live preview" src="/builder-preview" onLoad={push} style={{width,maxWidth: "100%"}} className="mx-auto h-full min-h-[60vh] shrink-0 border border-border bg-background shadow-sm" /></div>
  </div>;
  return <div className="space-y-3 min-w-0">
    <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
      <Button asChild variant="ghost" size="icon" aria-label="Back to list"><Link to={page.kind === "project" ? "/admin/projects" : "/admin/builder"} onClick={e => {if (dirty && !confirm("Changes are still saving. Leave without waiting?")) e.preventDefault();}}><ArrowLeft className="h-4 w-4" /></Link></Button>
      <div className="min-w-0 flex-1 basis-32"><p className="font-semibold truncate">{page.title}</p><p className="text-xs text-muted-foreground flex items-center gap-2" role="status" aria-live="polite"><Badge variant="outline" className="text-[10px]">{page.status === "published" ? "Live" : "Draft"}</Badge>{saving ? <Loader2 className="h-3 w-3 animate-spin" /> : error ? <AlertCircle className="h-3 w-3 text-destructive" /> : <CheckCircle2 className="h-3 w-3" />}{saving ? "Saving…" : error ? "Save failed" : dirty ? "Changes pending" : lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}` : "All changes saved"}</p></div>
      <div className="flex items-center gap-2 mr-1"><Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} /><Label htmlFor="auto-save" className="text-xs">Auto save</Label></div>
      <Button variant="ghost" size="icon" aria-label="Undo" title="Undo" disabled={!hist.past.length} onClick={undo}><Undo2 className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Redo" title="Redo" disabled={!hist.future.length} onClick={redo}><Redo2 className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="hidden lg:inline-flex" aria-label="Toggle layers panel" title="Toggle layers panel" onClick={() => setPanel(v => !v)}>{panel ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}</Button>
      {page.status === "published" && <Button asChild variant="outline" size="sm"><a href={publicUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 mr-1" />View</a></Button>}
      <Button variant="outline" size="sm" disabled={saving} onClick={() => void manualSave()}><Save className="h-4 w-4 mr-1" />Save</Button><Button size="sm" variant={page.status === "published" ? "outline" : "default"} disabled={saving || !!recovery} onClick={() => changeStatus(page.status === "published" ? "draft" : "published")}><Globe className="h-4 w-4 mr-1" />{page.status === "published" ? "Unpublish" : "Publish"}</Button>
    </div>
    {page.status === "published" && <p className="text-xs text-muted-foreground flex items-center gap-1"><Globe className="h-3 w-3" />{autoSave ? "Auto-saved changes update this live page." : "Saved changes update this live page."}</p>}
    {error && <div role="alert" className="flex flex-wrap items-center gap-2 border border-destructive/40 rounded-md p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4" /><span className="flex-1">{error}</span><Button variant="outline" size="sm" onClick={() => void save()}>Retry save</Button></div>}
    {recovery && <div className="flex flex-wrap items-center gap-2 border border-border bg-muted p-3 text-sm"><span className="flex-1">Unsaved changes from your previous session are available.</span><Button size="sm" onClick={restore}>Restore</Button><Button size="sm" variant="outline" onClick={() => {sessionStorage.removeItem(recoveryKey);setRecovery(null);}}>Discard</Button></div>}
    <input ref={upload} type="file" accept="application/json,.json" className="hidden" aria-label="Import builder blocks" onChange={async e => {const file=e.target.files?.[0];e.target.value="";if (!file) return;try {if(file.size>5*1024*1024) throw new Error("Choose a file smaller than 5 MB."); const imported=parseBlockImport(await file.text());commit(b => [...b,...imported]);setSelected(imported[0]?.id || null);toast({title:`${imported.length} blocks added`});}catch(cause){toast({title:"Import failed",description:cause instanceof Error ? cause.message : "Invalid file",variant:"destructive"});}}} />
    {isLg ? <div className={`grid gap-3 h-[calc(100vh-230px)] min-h-[500px] ${panel ? "grid-cols-[320px_minmax(0,1fr)]" : "grid-cols-1"}`}><div className={panel ? "overflow-y-auto pr-2" : "hidden"}>{editor}</div>{preview}</div> :
    <div><Tabs value={mobileTab} onValueChange={setMobileTab}><TabsList className="w-full"><TabsTrigger value="edit" className="flex-1">Layers & settings</TabsTrigger><TabsTrigger value="preview" className="flex-1">Canvas</TabsTrigger></TabsList><div className={mobileTab === "edit" ? "mt-3" : "hidden"}>{editor}</div><div className={mobileTab === "preview" ? "mt-3 h-[75vh]" : "hidden"}>{preview}</div></Tabs></div>}
  </div>;
}
export default AdminBuilderEditor;
