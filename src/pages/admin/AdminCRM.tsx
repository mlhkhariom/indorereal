import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Phone, CalendarClock, AlertCircle } from "lucide-react";
import { PIPELINE_STAGES, normalizeStage, stageLabel, followUpBucket, toCSV } from "@/lib/crm";
import LeadDetailSheet from "@/components/admin/LeadDetailSheet";
import { useToast } from "@/hooks/use-toast";

export interface Lead {
  id: string; name: string; phone: string; email: string | null; message: string | null;
  property_title: string | null; status: string; source: string | null; created_at: string;
  assigned_to: string | null; follow_up_at: string | null; priority: string; budget: string | null;
  preferred_location: string | null; utm_source: string | null;
}
export interface Staff { user_id: string; email: string; role: string; }

const priorityVariant = (p: string) => (p === "high" ? "destructive" : p === "low" ? "secondary" : "default") as any;

const LeadCard = ({ lead, onOpen, staffName }: { lead: Lead; onOpen: () => void; staffName?: string }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });
  const fb = followUpBucket(lead.follow_up_at);
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} onClick={onOpen}
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined}
      className={`rounded-lg border border-border bg-card p-3 text-sm shadow-sm cursor-grab touch-none ${isDragging ? "opacity-70 z-50 relative" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold truncate">{lead.name}</p>
        <Badge variant={priorityVariant(lead.priority)} className="text-[10px] capitalize">{lead.priority}</Badge>
      </div>
      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Phone className="h-3 w-3" />{lead.phone}</p>
      {lead.property_title && <p className="text-xs text-primary truncate mt-1">{lead.property_title}</p>}
      <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
        <span className="truncate">{staffName || "Unassigned"}</span>
        {fb !== "none" && <span className={fb === "overdue" ? "text-destructive font-semibold" : ""}><CalendarClock className="inline h-3 w-3 mr-0.5" />{new Date(lead.follow_up_at!).toLocaleDateString()}</span>}
      </div>
    </div>
  );
};

const Column = ({ id, label, children, count }: { id: string; label: string; children: React.ReactNode; count: number }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`w-72 shrink-0 rounded-xl p-2 transition-colors ${isOver ? "bg-primary/10" : "bg-muted/50"}`}>
      <div className="flex items-center justify-between px-1 pb-2">
        <h3 className="font-semibold text-sm">{label}</h3>
        <Badge variant="outline">{count}</Badge>
      </div>
      <div className="space-y-2 min-h-[120px]">{children}</div>
    </div>
  );
};

const AdminCRM = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const { toast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }));

  const load = async () => {
    const [l, s] = await Promise.all([
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }),
      supabase.rpc("list_staff"),
    ]);
    if (l.data) setLeads(l.data as unknown as Lead[]);
    if (s.data) setStaff(s.data as Staff[]);
  };
  useEffect(() => { load(); }, []);

  const staffName = (id: string | null) => staff.find((s) => s.user_id === id)?.email.split("@")[0];

  const filtered = useMemo(() => leads.filter((l) => {
    const t = q.toLowerCase();
    const okQ = !t || [l.name, l.phone, l.email, l.property_title, l.message].some((v) => v?.toLowerCase().includes(t));
    return okQ && (stage === "all" || normalizeStage(l.status) === stage);
  }), [leads, q, stage]);

  const onDragEnd = async (e: DragEndEvent) => {
    const id = String(e.active.id); const to = e.over?.id ? String(e.over.id) : null;
    const lead = leads.find((l) => l.id === id);
    if (!to || !lead || normalizeStage(lead.status) === to) return;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: to } : l)));
    const { error } = await supabase.from("enquiries").update({ status: to }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); load(); }
  };

  const exportCSV = () => {
    const csv = toCSV(filtered.map((l) => ({ Name: l.name, Phone: l.phone, Email: l.email, Stage: stageLabel(normalizeStage(l.status)), Priority: l.priority, Property: l.property_title, Budget: l.budget, Area: l.preferred_location, Source: l.source, FollowUp: l.follow_up_at, Created: l.created_at, Message: l.message })));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const followUps = leads.filter((l) => ["overdue", "today"].includes(followUpBucket(l.follow_up_at)) && !["won", "lost"].includes(normalizeStage(l.status)))
    .sort((a, b) => a.follow_up_at!.localeCompare(b.follow_up_at!));
  const openLead = leads.find((l) => l.id === openId) || null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["Total Leads", leads.length],
          ["New", leads.filter((l) => normalizeStage(l.status) === "new").length],
          ["Follow-ups Due", followUps.length],
          ["Won", leads.filter((l) => normalizeStage(l.status) === "won").length],
        ].map(([k, v]) => (
          <Card key={k as string}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{k}</p><p className="text-2xl font-bold">{v}</p></CardContent></Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, property…" className="pl-9" />
        </div>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {PIPELINE_STAGES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-1" />Export CSV</Button>
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups {followUps.length > 0 && <Badge variant="destructive" className="ml-1 h-5 px-1.5">{followUps.length}</Badge>}</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-3 px-3">
              {PIPELINE_STAGES.map((s) => {
                const items = filtered.filter((l) => normalizeStage(l.status) === s.id);
                return (
                  <Column key={s.id} id={s.id} label={s.label} count={items.length}>
                    {items.map((l) => <LeadCard key={l.id} lead={l} onOpen={() => setOpenId(l.id)} staffName={staffName(l.assigned_to)} />)}
                  </Column>
                );
              })}
            </div>
          </DndContext>
        </TabsContent>

        <TabsContent value="list">
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Property</TableHead><TableHead>Stage</TableHead><TableHead>Priority</TableHead><TableHead>Assigned</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow key={l.id} className="cursor-pointer" onClick={() => setOpenId(l.id)}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell>{l.phone}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{l.property_title || "—"}</TableCell>
                    <TableCell><Badge variant="outline">{stageLabel(normalizeStage(l.status))}</Badge></TableCell>
                    <TableCell><Badge variant={priorityVariant(l.priority)} className="capitalize">{l.priority}</Badge></TableCell>
                    <TableCell>{staffName(l.assigned_to) || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No leads found.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="followups" className="space-y-2">
          {followUps.length === 0 && <p className="text-center text-muted-foreground py-10">No follow-ups due today. 🎉</p>}
          {followUps.map((l) => {
            const overdue = followUpBucket(l.follow_up_at) === "overdue";
            return (
              <Card key={l.id} className="cursor-pointer" onClick={() => setOpenId(l.id)}>
                <CardContent className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{l.name} <span className="text-muted-foreground font-normal">· {l.phone}</span></p>
                    <p className="text-xs text-muted-foreground truncate">{stageLabel(normalizeStage(l.status))} · {l.property_title || l.message || ""}</p>
                  </div>
                  <span className={`text-xs whitespace-nowrap flex items-center gap-1 ${overdue ? "text-destructive font-semibold" : ""}`}>
                    {overdue && <AlertCircle className="h-3 w-3" />}{new Date(l.follow_up_at!).toLocaleString()}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      <LeadDetailSheet lead={openLead} staff={staff} onClose={() => setOpenId(null)} onChanged={load} />
    </div>
  );
};

export default AdminCRM;
