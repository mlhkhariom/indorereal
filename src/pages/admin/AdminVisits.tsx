import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Phone, Plus, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Staff } from "./AdminCRM";

interface Visit { id: string; client_name: string; client_phone: string; property_title: string | null; visit_at: string; agent_id: string | null; status: string; notes: string | null; }
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const STATUSES = ["scheduled", "confirmed", "completed", "cancelled", "no_show"];

const AdminVisits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [day, setDay] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ client_name: "", client_phone: "", property_title: "", visit_at: "" });
  const { toast } = useToast();

  const load = async () => {
    const [v, s] = await Promise.all([supabase.from("site_visits").select("*").order("visit_at"), supabase.rpc("list_staff")]);
    setVisits((v.data || []) as Visit[]); setStaff((s.data || []) as Staff[]);
  };
  useEffect(() => { load(); }, []);

  const dayVisits = useMemo(() => visits.filter((v) => sameDay(new Date(v.visit_at), day)), [visits, day]);
  const busyDays = useMemo(() => visits.filter((v) => v.status !== "cancelled").map((v) => new Date(v.visit_at)), [visits]);

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("site_visits").update(patch).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else load();
  };
  const remove = async (id: string) => { if (!confirm("Delete this visit?")) return; await supabase.from("site_visits").delete().eq("id", id); load(); };
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.client_name || !f.client_phone || !f.visit_at) return;
    const { error } = await supabase.from("site_visits").insert({ ...f, property_title: f.property_title || null, visit_at: new Date(f.visit_at).toISOString() });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setOpen(false); setF({ client_name: "", client_phone: "", property_title: "", visit_at: "" }); load(); }
  };

  const upcoming = visits.filter((v) => new Date(v.visit_at) >= new Date() && v.status !== "cancelled").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground"><b className="text-foreground">{upcoming}</b> upcoming visits</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="btn-gold" size="sm"><Plus className="h-4 w-4 mr-1" aria-hidden="true" />New visit</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Schedule site visit</DialogTitle></DialogHeader>
            <form onSubmit={add} className="space-y-3">
              <div><Label>Client name</Label><Input value={f.client_name} onChange={(e) => setF({ ...f, client_name: e.target.value })} required /></div>
              <div><Label>Phone</Label><Input value={f.client_phone} onChange={(e) => setF({ ...f, client_phone: e.target.value })} required /></div>
              <div><Label>Property</Label><Input value={f.property_title} onChange={(e) => setF({ ...f, property_title: e.target.value })} /></div>
              <div><Label>Date & time</Label><Input type="datetime-local" value={f.visit_at} onChange={(e) => setF({ ...f, visit_at: e.target.value })} required /></div>
              <Button type="submit" className="w-full btn-gold">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid lg:grid-cols-[auto_1fr] gap-4">
        <Card className="w-fit mx-auto lg:mx-0">
          <Calendar mode="single" selected={day} onSelect={(d) => d && setDay(d)} modifiers={{ busy: busyDays }}
            modifiersClassNames={{ busy: "font-bold underline decoration-secondary decoration-2 underline-offset-4" }} />
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">{day.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {dayVisits.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No visits on this day.</p>}
            {dayVisits.map((v) => (
              <div key={v.id} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{v.client_name} <Badge variant="outline" className="ml-1 capitalize">{v.status.replace("_", " ")}</Badge></p>
                    <p className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden="true" />{new Date(v.visit_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <a href={`tel:${v.client_phone}`} className="flex items-center gap-1 hover:text-secondary"><Phone className="h-3 w-3" aria-hidden="true" />{v.client_phone}</a>
                    </p>
                    {v.property_title && <p className="text-xs text-primary mt-1 truncate">{v.property_title}</p>}
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" aria-label="Delete" onClick={() => remove(v.id)}><Trash2 className="h-4 w-4" aria-hidden="true" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={v.status} onValueChange={(s) => update(v.id, { status: s })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={v.agent_id || "none"} onValueChange={(a) => update(v.id, { agent_id: a === "none" ? null : a })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="none">No agent</SelectItem>{staff.map((s) => <SelectItem key={s.user_id} value={s.user_id}>{s.email}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default AdminVisits;
