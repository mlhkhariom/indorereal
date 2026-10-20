import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, Mail, Send, History, StickyNote } from "lucide-react";
import { PIPELINE_STAGES, PRIORITIES, normalizeStage } from "@/lib/crm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Lead, Staff } from "@/pages/admin/AdminCRM";

interface Props { lead: Lead | null; staff: Staff[]; onClose: () => void; onChanged: () => void; }

const LeadDetailSheet = ({ lead, staff, onClose, onChanged }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<any[]>([]);
  const [acts, setActs] = useState<any[]>([]);
  const [note, setNote] = useState("");

  const load = async (id: string) => {
    const [n, a] = await Promise.all([
      supabase.from("lead_notes").select("*").eq("enquiry_id", id).order("created_at", { ascending: false }),
      supabase.from("lead_activities").select("*").eq("enquiry_id", id).order("created_at", { ascending: false }),
    ]);
    setNotes(n.data || []); setActs(a.data || []);
  };
  useEffect(() => { if (lead) load(lead.id); }, [lead?.id]);

  if (!lead) return null;

  const update = async (patch: any) => {
    const { error } = await supabase.from("enquiries").update(patch).eq("id", lead.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { onChanged(); load(lead.id); }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    const { error } = await supabase.from("lead_notes").insert({ enquiry_id: lead.id, note: note.trim(), author_id: user?.id, author_email: user?.email });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setNote(""); load(lead.id); }
  };

  const wa = `https://wa.me/${lead.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`;
  const fu = lead.follow_up_at ? new Date(lead.follow_up_at).toISOString().slice(0, 16) : "";

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader><SheetTitle className="text-left">{lead.name}</SheetTitle></SheetHeader>
        <div className="space-y-5 mt-4">
          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1" size="sm"><a href={`tel:${lead.phone}`}><Phone className="h-4 w-4 mr-1" aria-hidden="true" />Call</a></Button>
            <Button asChild variant="outline" className="w-full" size="sm"><a href={wa} target="_blank" rel="noopener noreferrer" className="flex-1"><MessageCircle className="h-4 w-4 mr-1" aria-hidden="true" />WhatsApp</a></Button>
            {lead.email && <Button asChild variant="outline" className="flex-1" size="sm"><a href={`mailto:${lead.email}`}><Mail className="h-4 w-4 mr-1" aria-hidden="true" />Email</a></Button>}
          </div>

          <div className="text-sm space-y-1 rounded-lg bg-muted/40 p-3">
            <p><span className="text-muted-foreground">Phone:</span> {lead.phone}</p>
            {lead.email && <p><span className="text-muted-foreground">Email:</span> {lead.email}</p>}
            {lead.property_title && <p><span className="text-muted-foreground">Property:</span> {lead.property_title}</p>}
            <p><span className="text-muted-foreground">Source:</span> {lead.source || "website"}{lead.utm_source ? ` · ${lead.utm_source}` : ""}</p>
            {lead.message && <p className="pt-1">{lead.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Stage</Label>
              <Select value={normalizeStage(lead.status)} onValueChange={(v) => update({ status: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{PIPELINE_STAGES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={lead.priority} onValueChange={(v) => update({ priority: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Assigned to</Label>
              <Select value={lead.assigned_to || "none"} onValueChange={(v) => update({ assigned_to: v === "none" ? null : v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {staff.map((s) => <SelectItem key={s.user_id + s.role} value={s.user_id}>{s.email} ({s.role})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Follow-up</Label>
              <Input type="datetime-local" className="h-9" defaultValue={fu} key={fu}
                onBlur={(e) => { const v = e.target.value; if (v !== fu) update({ follow_up_at: v ? new Date(v).toISOString() : null }); }} />
            </div>
            <div>
              <Label className="text-xs">Budget</Label>
              <Input className="h-9" defaultValue={lead.budget || ""} key={"b" + lead.budget} onBlur={(e) => e.target.value !== (lead.budget || "") && update({ budget: e.target.value || null })} placeholder="e.g. 50L–75L" />
            </div>
            <div>
              <Label className="text-xs">Preferred area</Label>
              <Input className="h-9" defaultValue={lead.preferred_location || ""} key={"l" + lead.preferred_location} onBlur={(e) => e.target.value !== (lead.preferred_location || "") && update({ preferred_location: e.target.value || null })} placeholder="e.g. Vijay Nagar" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm flex items-center gap-1 mb-2"><StickyNote className="h-4 w-4" aria-hidden="true" />Notes</h4>
            <div className="flex gap-2">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add a note about this call or visit…" />
              <Button aria-label="Add note" size="icon" onClick={addNote}><Send className="h-4 w-4" aria-hidden="true" /></Button>
            </div>
            <div className="space-y-2 mt-3">
              {notes.map((n) => (
                <div key={n.id} className="rounded-lg border border-border p-2 text-sm">
                  <p>{n.note}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.author_email} · {new Date(n.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm flex items-center gap-1 mb-2"><History className="h-4 w-4" aria-hidden="true" />Activity</h4>
            <ol className="border-l border-border ml-1 space-y-2">
              {acts.map((a) => (
                <li key={a.id} className="pl-3 text-xs">
                  <Badge variant="secondary" className="text-[10px] mr-1">{a.action}</Badge>{a.details}
                  <span className="block text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailSheet;
