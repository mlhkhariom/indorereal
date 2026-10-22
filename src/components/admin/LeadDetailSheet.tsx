import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone, MessageCircle, Mail, Send, CalendarPlus, Check, UserCheck, Flag, CalendarClock, Sparkles, XCircle, PhoneCall, Clock, MapPin,
} from "lucide-react";
import {
  PIPELINE_STAGES, PRIORITIES, PROPERTY_TYPES, BHK_OPTIONS, PURPOSES, LOST_REASONS, NOTE_TEMPLATES,
  normalizeStage, stageColor, waLink, daysSince,
} from "@/lib/crm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Lead, Staff, UpdateLead } from "@/components/admin/crm/types";

interface Props { lead: Lead | null; staff: Staff[]; onClose: () => void; update: UpdateLead; }

const actIcon: Record<string, typeof Check> = {
  created: Sparkles, status: Flag, assigned: UserCheck, follow_up: CalendarClock, follow_up_done: Check,
  priority: Flag, lost: XCircle, contacted: PhoneCall,
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>
);

const LeadDetailSheet = ({ lead, staff, onClose, update }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<any[]>([]);
  const [acts, setActs] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [lostOpen, setLostOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [visitAt, setVisitAt] = useState("");

  const load = async (id: string) => {
    const [n, a, v] = await Promise.all([
      supabase.from("lead_notes").select("*").eq("enquiry_id", id).order("created_at", { ascending: false }),
      supabase.from("lead_activities").select("*").eq("enquiry_id", id).order("created_at", { ascending: false }),
      supabase.from("site_visits").select("*").eq("enquiry_id", id).order("visit_at", { ascending: false }),
    ]);
    setNotes(n.data || []); setActs(a.data || []); setVisits(v.data || []);
  };
  useEffect(() => { if (lead) load(lead.id); }, [lead?.id, lead?.status, lead?.follow_up_at, lead?.assigned_to, lead?.priority]);

  if (!lead) return null;

  const set = async (patch: Partial<Lead>) => { if (await update(lead.id, patch)) load(lead.id); };
  const contacted = () => set({ last_contacted_at: new Date().toISOString() });
  const stage = normalizeStage(lead.status);

  const moveStage = (id: string) => {
    if (id === stage) return;
    if (id === "lost") setLostOpen(true); else set({ status: id });
  };

  const addNote = async (text = note) => {
    if (!text.trim()) return;
    const { error } = await supabase.from("lead_notes").insert({ enquiry_id: lead.id, note: text.trim(), author_id: user?.id, author_email: user?.email });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setNote(""); load(lead.id); }
  };

  const bookVisit = async () => {
    if (!visitAt) return;
    const { error } = await supabase.from("site_visits").insert({
      client_name: lead.name, client_phone: lead.phone, property_title: lead.property_title, property_id: lead.property_id ?? null,
      enquiry_id: lead.id, agent_id: lead.assigned_to, visit_at: new Date(visitAt).toISOString(),
    });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setVisitOpen(false); setVisitAt("");
    if (["new", "contacted"].includes(stage)) await set({ status: "site_visit" }); else load(lead.id);
    toast({ title: "Site visit booked" });
  };

  const fu = lead.follow_up_at ? new Date(new Date(lead.follow_up_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
  const txt = (k: keyof Lead, label: string, ph?: string) => (
    <Field label={label}>
      <Input className="h-9" defaultValue={(lead[k] as string) || ""} key={k + String(lead[k])} placeholder={ph}
        onBlur={(e) => e.target.value !== ((lead[k] as string) || "") && set({ [k]: e.target.value || null } as Partial<Lead>)} />
    </Field>
  );
  const sel = (k: keyof Lead, label: string, opts: readonly string[]) => (
    <Field label={label}>
      <Select value={(lead[k] as string) || undefined} onValueChange={(v) => set({ [k]: v } as Partial<Lead>)}>
        <SelectTrigger className="h-9 capitalize" aria-label={label}><SelectValue placeholder="—" /></SelectTrigger>
        <SelectContent>{opts.map((o) => <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>)}</SelectContent>
      </Select>
    </Field>
  );

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col gap-0">
        <SheetHeader className="p-4 pb-3 border-b border-border text-left space-y-2" style={{ background: stageColor(stage, 0.06) }}>
          <div className="flex items-center gap-2 pr-8">
            <SheetTitle className="text-lg truncate">{lead.name}</SheetTitle>
            <Badge variant="outline" className="capitalize text-[10px]">{lead.source || "website"}</Badge>
          </div>
          <SheetDescription className="text-xs flex flex-wrap gap-x-3">
            <span>{lead.phone}</span>
            <span>Created {daysSince(lead.created_at) === 0 ? "today" : `${daysSince(lead.created_at)}d ago`}</span>
            {lead.last_contacted_at && <span>Last contacted {new Date(lead.last_contacted_at).toLocaleDateString("en-IN")}</span>}
          </SheetDescription>
          <ol className="flex gap-1 pt-1" aria-label="Lead stage">
            {PIPELINE_STAGES.map((s, i) => {
              const idx = PIPELINE_STAGES.findIndex((x) => x.id === stage);
              const reached = stage === "lost" ? s.id === "lost" : i <= idx && s.id !== "lost";
              return (
                <li key={s.id} className="flex-1 min-w-0">
                  <button onClick={() => moveStage(s.id)} aria-current={s.id === stage ? "step" : undefined} aria-label={`Move to ${s.label}`}
                    className="w-full group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
                    <span className="block h-1.5 rounded-full transition-colors" style={{ background: reached ? stageColor(s.id) : "hsl(var(--muted))" }} />
                    <span className={`block text-[10px] mt-1 truncate ${s.id === stage ? "font-semibold text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          {stage === "lost" && lead.lost_reason && <p className="text-xs text-destructive">Lost: {lead.lost_reason}</p>}
        </SheetHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mx-4 mt-3 grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Notes{notes.length ? ` (${notes.length})` : ""}</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="visits">Visits{visits.length ? ` (${visits.length})` : ""}</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-4 pb-24 sm:pb-6">
            <TabsContent value="overview" className="space-y-5 mt-4">
              {(lead.property_title || lead.message) && (
                <div className="rounded-xl bg-muted/40 p-3 text-sm space-y-1">
                  {lead.property_title && <p className="font-medium text-primary">{lead.property_title}</p>}
                  {lead.message && <p className="text-muted-foreground">{lead.message}</p>}
                  {lead.utm_source && <p className="text-[11px] text-muted-foreground">Campaign: {lead.utm_source}</p>}
                </div>
              )}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Sales</h4>
                <div className="grid grid-cols-2 gap-3">
                  {sel("priority", "Priority", PRIORITIES)}
                  <Field label="Assigned to">
                    <Select value={lead.assigned_to || "none"} onValueChange={(v) => set({ assigned_to: v === "none" ? null : v })}>
                      <SelectTrigger className="h-9" aria-label="Assigned to"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {staff.map((s) => <SelectItem key={s.user_id + s.role} value={s.user_id}>{s.email} ({s.role})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="col-span-2">
                    <Field label="Next follow-up">
                      <div className="flex gap-2">
                        <Input type="datetime-local" className="h-9" defaultValue={fu} key={fu}
                          onBlur={(e) => { const v = e.target.value; if (v !== fu) set({ follow_up_at: v ? new Date(v).toISOString() : null }); }} />
                        {lead.follow_up_at && <Button size="sm" variant="outline" className="h-9 shrink-0" onClick={() => set({ follow_up_at: null, last_contacted_at: new Date().toISOString() })}><Check className="h-4 w-4 mr-1" aria-hidden="true" />Done</Button>}
                      </div>
                    </Field>
                  </div>
                </div>
              </section>
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Requirement</h4>
                <div className="grid grid-cols-2 gap-3">
                  {sel("purpose", "Looking to", PURPOSES)}
                  {sel("property_type", "Property type", PROPERTY_TYPES)}
                  {sel("bhk", "BHK", BHK_OPTIONS)}
                  {txt("budget", "Budget", "50L–75L")}
                  <div className="col-span-2">{txt("preferred_location", "Preferred area", "Vijay Nagar")}</div>
                </div>
              </section>
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Contact</h4>
                <div className="grid grid-cols-2 gap-3">{txt("phone", "Phone")}{txt("email", "Email")}</div>
              </section>
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {NOTE_TEMPLATES.map((t) => <button key={t} onClick={() => addNote(t)} className="text-[11px] rounded-full border border-border px-2.5 py-1 hover:bg-muted">{t}</button>)}
              </div>
              <div className="flex gap-2">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Write a note about this call or visit…" aria-label="New note" />
                <Button aria-label="Add note" size="icon" className="shrink-0" onClick={() => addNote()}><Send className="h-4 w-4" aria-hidden="true" /></Button>
              </div>
              {notes.map((n) => (
                <div key={n.id} className="rounded-xl border border-border p-3 text-sm">
                  <p className="whitespace-pre-wrap">{n.note}</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5">{n.author_email?.split("@")[0]} · {new Date(n.created_at).toLocaleString("en-IN")}</p>
                </div>
              ))}
              {notes.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No notes yet.</p>}
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <ol className="relative border-l border-border ml-3 space-y-4">
                {acts.map((a) => {
                  const Icon = actIcon[a.action] || Flag;
                  return (
                    <li key={a.id} className="pl-5 relative">
                      <span className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-card border border-border grid place-items-center"><Icon className="h-3 w-3 text-primary" aria-hidden="true" /></span>
                      <p className="text-sm">{a.details}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(a.created_at).toLocaleString("en-IN")}</p>
                    </li>
                  );
                })}
              </ol>
            </TabsContent>

            <TabsContent value="visits" className="mt-4 space-y-2">
              <Button size="sm" className="w-full" onClick={() => setVisitOpen(true)}><CalendarPlus className="h-4 w-4 mr-1" aria-hidden="true" />Schedule site visit</Button>
              {visits.map((v) => (
                <div key={v.id} className="rounded-xl border border-border p-3 text-sm flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{new Date(v.visit_at).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</p>
                    {v.property_title && <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><MapPin className="h-3 w-3" aria-hidden="true" />{v.property_title}</p>}
                  </div>
                  <Badge variant="outline" className="capitalize">{v.status.replace("_", " ")}</Badge>
                </div>
              ))}
              {visits.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No site visits yet.</p>}
            </TabsContent>
          </div>
        </Tabs>

        <div className="absolute sm:static bottom-0 inset-x-0 border-t border-border bg-background p-3 grid grid-cols-4 gap-2">
          <Button asChild variant="outline" size="sm"><a href={`tel:${lead.phone}`} onClick={contacted}><Phone className="h-4 w-4 sm:mr-1" aria-hidden="true" /><span className="hidden sm:inline">Call</span><span className="sr-only sm:hidden">Call</span></a></Button>
          <Button asChild variant="outline" size="sm"><a href={waLink(lead.phone, `Hello ${lead.name}, this is Indore Realty.`)} target="_blank" rel="noopener noreferrer" onClick={contacted}><MessageCircle className="h-4 w-4 sm:mr-1" aria-hidden="true" /><span className="hidden sm:inline">WhatsApp</span><span className="sr-only sm:hidden">WhatsApp</span></a></Button>
          <Button asChild variant="outline" size="sm" disabled={!lead.email}>
            {lead.email ? <a href={`mailto:${lead.email}`} onClick={contacted}><Mail className="h-4 w-4 sm:mr-1" aria-hidden="true" /><span className="hidden sm:inline">Email</span><span className="sr-only sm:hidden">Email</span></a>
              : <span aria-disabled="true" className="opacity-50"><Mail className="h-4 w-4 sm:mr-1" aria-hidden="true" /><span className="hidden sm:inline">Email</span></span>}
          </Button>
          <Button size="sm" onClick={() => setVisitOpen(true)}><CalendarPlus className="h-4 w-4 sm:mr-1" aria-hidden="true" /><span className="hidden sm:inline">Visit</span><span className="sr-only sm:hidden">Book visit</span></Button>
        </div>

        <Dialog open={lostOpen} onOpenChange={setLostOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Why was this lead lost?</DialogTitle></DialogHeader>
            <div className="grid gap-2">
              {LOST_REASONS.map((r) => <Button key={r} variant="outline" className="justify-start" onClick={() => { setLostOpen(false); set({ status: "lost", lost_reason: r, follow_up_at: null }); }}>{r}</Button>)}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={visitOpen} onOpenChange={setVisitOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Schedule site visit</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">{lead.name}{lead.property_title ? ` · ${lead.property_title}` : ""}</p>
            <Label htmlFor="visit-at">Date & time</Label>
            <Input id="visit-at" type="datetime-local" value={visitAt} onChange={(e) => setVisitAt(e.target.value)} />
            <Button onClick={bookVisit} disabled={!visitAt}>Book visit</Button>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailSheet;
