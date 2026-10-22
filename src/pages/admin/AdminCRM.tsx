import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Plus, Users, Sparkles, CalendarClock, MapPinned, Trophy, Percent } from "lucide-react";
import { PIPELINE_STAGES, PRIORITIES, LEAD_SOURCES, normalizeStage, stageLabel, followUpBucket, toCSV, conversionRate } from "@/lib/crm";
import LeadDetailSheet from "@/components/admin/LeadDetailSheet";
import Pipeline from "@/components/admin/crm/Pipeline";
import LeadList from "@/components/admin/crm/LeadList";
import FollowUps from "@/components/admin/crm/FollowUps";
import LeadFormDialog from "@/components/admin/crm/LeadFormDialog";
import type { Lead, Staff } from "@/components/admin/crm/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type { Lead, Staff };

const AdminCRM = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [visitsWeek, setVisitsWeek] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [priority, setPriority] = useState("all");
  const [owner, setOwner] = useState("all");
  const [source, setSource] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    const now = new Date(); const weekEnd = new Date(now.getTime() + 7 * 86400000);
    const [l, s, v] = await Promise.all([
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
      supabase.rpc("list_staff"),
      supabase.from("site_visits").select("id", { count: "exact", head: true }).gte("visit_at", now.toISOString()).lt("visit_at", weekEnd.toISOString()).neq("status", "cancelled"),
    ]);
    if (l.data) setLeads(l.data as unknown as Lead[]);
    if (s.data) setStaff(s.data as Staff[]);
    setVisitsWeek(v.count || 0);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  /** Optimistic update; reverts by reloading on error. */
  const update = async (id: string, patch: Partial<Lead>) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    const { error } = await supabase.from("enquiries").update(patch as never).eq("id", id);
    if (error) { toast({ title: "Could not save", description: error.message, variant: "destructive" }); load(); return false; }
    return true;
  };
  const bulk = async (ids: string[], patch: Partial<Lead>) => {
    setLeads((ls) => ls.map((l) => (ids.includes(l.id) ? { ...l, ...patch } : l)));
    const { error } = await supabase.from("enquiries").update(patch as never).in("id", ids);
    if (error) { toast({ title: "Could not save", description: error.message, variant: "destructive" }); load(); }
    else toast({ title: `${ids.length} lead(s) updated` });
  };
  const remove = async (ids: string[]) => {
    const { error } = await supabase.from("enquiries").delete().in("id", ids);
    if (error) toast({ title: "Could not delete", description: error.message, variant: "destructive" });
    load();
  };
  const contacted = (id: string) => update(id, { last_contacted_at: new Date().toISOString() });

  const staffName = (id: string | null) => staff.find((s) => s.user_id === id)?.email.split("@")[0];

  const filtered = useMemo(() => leads.filter((l) => {
    const t = q.toLowerCase().trim();
    const okQ = !t || [l.name, l.phone, l.email, l.property_title, l.message, l.preferred_location, l.budget].some((v) => v?.toLowerCase().includes(t));
    const okOwner = owner === "all" || (owner === "me" ? l.assigned_to === user?.id : owner === "none" ? !l.assigned_to : l.assigned_to === owner);
    return okQ && okOwner && (stage === "all" || normalizeStage(l.status) === stage) && (priority === "all" || l.priority === priority) && (source === "all" || (l.source || "website") === source);
  }), [leads, q, stage, priority, owner, source, user?.id]);

  const exportCSV = () => {
    const csv = toCSV(filtered.map((l) => ({
      Name: l.name, Phone: l.phone, Email: l.email, Stage: stageLabel(normalizeStage(l.status)), Priority: l.priority, Purpose: l.purpose,
      Type: l.property_type, BHK: l.bhk, Budget: l.budget, Area: l.preferred_location, Property: l.property_title, Source: l.source,
      Assigned: staffName(l.assigned_to), FollowUp: l.follow_up_at, LostReason: l.lost_reason, Created: l.created_at, Message: l.message,
    })));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const today = new Date().toDateString();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const due = leads.filter((l) => ["overdue", "today"].includes(followUpBucket(l.follow_up_at)) && !["won", "lost"].includes(normalizeStage(l.status))).length;
  const kpis = [
    { label: "Total leads", value: leads.length, icon: Users },
    { label: "New today", value: leads.filter((l) => new Date(l.created_at).toDateString() === today).length, icon: Sparkles },
    { label: "Follow-ups due", value: due, icon: CalendarClock, alert: due > 0 },
    { label: "Visits this week", value: visitsWeek, icon: MapPinned },
    { label: "Won this month", value: leads.filter((l) => normalizeStage(l.status) === "won" && new Date((l as any).updated_at || l.created_at) >= monthStart).length, icon: Trophy },
    { label: "Conversion", value: `${conversionRate(leads.map((l) => l.status))}%`, icon: Percent },
  ];
  const activeFilters = [stage, priority, owner, source].filter((f) => f !== "all").length;
  const openLead = leads.find((l) => l.id === openId) || null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold font-heading">Leads & Pipeline</h2>
          <p className="text-xs text-muted-foreground">Every enquiry from the website, calls and walk-ins</p>
        </div>
        <Button onClick={() => setAdding(true)} className="btn-gold shrink-0"><Plus className="h-4 w-4 sm:mr-1" aria-hidden="true" /><span className="hidden sm:inline">Add lead</span><span className="sr-only sm:hidden">Add lead</span></Button>
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-3 px-3 pb-1 md:grid md:grid-cols-3 xl:grid-cols-6 md:overflow-visible md:mx-0 md:px-0">
        {kpis.map((k) => (
          <div key={k.label} className={`shrink-0 min-w-[140px] rounded-xl border bg-card p-3 ${k.alert ? "border-destructive/40" : "border-border"}`}>
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px]">{k.label}</span><k.icon className={`h-4 w-4 ${k.alert ? "text-destructive" : ""}`} aria-hidden="true" />
            </div>
            <p className={`text-2xl font-bold mt-1 ${k.alert ? "text-destructive" : ""}`}>{loading ? "–" : k.value}</p>
          </div>
        ))}
      </div>

      <div className="sticky top-0 z-20 -mx-3 px-3 py-2 bg-background/95 backdrop-blur border-b border-border space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, area, budget…" className="pl-9 h-10" aria-label="Search leads" />
          </div>
          <Button variant="outline" className="h-10" onClick={exportCSV} aria-label="Export leads to CSV"><Download className="h-4 w-4 md:mr-1" aria-hidden="true" /><span className="hidden md:inline">Export</span></Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs shrink-0" aria-label="Filter by stage"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All stages</SelectItem>{PIPELINE_STAGES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={owner} onValueChange={setOwner}>
            <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs shrink-0" aria-label="Filter by assignee"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Everyone</SelectItem><SelectItem value="me">My leads</SelectItem><SelectItem value="none">Unassigned</SelectItem>
              {userRole !== "agent" && staff.map((s) => <SelectItem key={s.user_id + s.role} value={s.user_id}>{s.email.split("@")[0]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-8 w-auto min-w-[110px] text-xs shrink-0 capitalize" aria-label="Filter by priority"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Any priority</SelectItem>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="h-8 w-auto min-w-[110px] text-xs shrink-0 capitalize" aria-label="Filter by source"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Any source</SelectItem>{LEAD_SOURCES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
          </Select>
          {activeFilters > 0 && <Button variant="ghost" size="sm" className="h-8 text-xs shrink-0" onClick={() => { setStage("all"); setPriority("all"); setOwner("all"); setSource("all"); }}>Clear ({activeFilters})</Button>}
        </div>
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups {due > 0 && <Badge variant="destructive" className="ml-1 h-5 px-1.5">{due}</Badge>}</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4">
          {loading ? <p className="text-center text-muted-foreground py-12">Loading leads…</p>
            : <Pipeline leads={filtered} staffName={staffName} onOpen={setOpenId} onMove={(id, s) => s === "lost" ? setOpenId(id) : update(id, { status: s })} onContact={contacted} />}
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <LeadList leads={filtered} staff={staff} isAdmin={userRole === "admin"} staffName={staffName} onOpen={setOpenId}
            onBulk={bulk} onDelete={remove} onMove={(id, s) => s === "lost" ? setOpenId(id) : update(id, { status: s })} onContact={contacted} />
        </TabsContent>
        <TabsContent value="followups" className="mt-4">
          <FollowUps leads={filtered} onOpen={setOpenId} update={update} />
        </TabsContent>
      </Tabs>

      <LeadDetailSheet lead={openLead} staff={staff} onClose={() => setOpenId(null)} update={update} />
      <LeadFormDialog open={adding} onOpenChange={setAdding} staff={staff} onCreated={load} />
    </div>
  );
};

export default AdminCRM;
