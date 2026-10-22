import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LEAD_SOURCES, PROPERTY_TYPES, BHK_OPTIONS, PURPOSES, PRIORITIES, isValidIndianPhone } from "@/lib/crm";
import type { Staff } from "./types";

const schema = z.object({
  name: z.string().trim().min(2, "Enter the client's name").max(100),
  phone: z.string().trim().refine(isValidIndianPhone, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  source: z.string(), priority: z.string(), purpose: z.string(),
  property_type: z.string().optional(), bhk: z.string().optional(),
  budget: z.string().max(50).optional(), preferred_location: z.string().max(100).optional(),
  assigned_to: z.string().optional(), follow_up_at: z.string().optional(),
  message: z.string().max(1000).optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props { open: boolean; onOpenChange: (o: boolean) => void; staff: Staff[]; onCreated: () => void; }

const LeadFormDialog = ({ open, onOpenChange, staff, onCreated }: Props) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { source: "walk-in", priority: "medium", purpose: "buy" },
  });

  const submit = async (v: FormValues) => {
    setSaving(true);
    const { error } = await supabase.from("enquiries").insert({
      name: v.name, phone: v.phone, email: v.email || null, source: v.source, priority: v.priority, purpose: v.purpose,
      property_type: v.property_type || null, bhk: v.bhk || null, budget: v.budget || null, preferred_location: v.preferred_location || null,
      assigned_to: v.assigned_to && v.assigned_to !== "none" ? v.assigned_to : null,
      follow_up_at: v.follow_up_at ? new Date(v.follow_up_at).toISOString() : null, message: v.message || null, status: "new",
    });
    setSaving(false);
    if (error) return toast({ title: "Could not add lead", description: error.message, variant: "destructive" });
    toast({ title: "Lead added" }); reset(); onOpenChange(false); onCreated();
  };

  const Sel = ({ name, label, opts, placeholder }: { name: keyof FormValues; label: string; opts: { v: string; l: string }[]; placeholder?: string }) => (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={(watch(name) as string) || undefined} onValueChange={(x) => setValue(name, x)}>
        <SelectTrigger className="h-10" aria-label={label}><SelectValue placeholder={placeholder || "Select"} /></SelectTrigger>
        <SelectContent>{opts.map((o) => <SelectItem key={o.v} value={o.v} className="capitalize">{o.l}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
  const Err = ({ k }: { k: keyof FormValues }) => errors[k] ? <p className="text-xs text-destructive mt-1">{errors[k]?.message as string}</p> : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add lead</DialogTitle>
          <DialogDescription>For walk-ins, phone calls, referrals or portal leads.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label htmlFor="lf-name" className="text-xs">Client name *</Label><Input id="lf-name" {...register("name")} className="h-10" /><Err k="name" /></div>
            <div><Label htmlFor="lf-phone" className="text-xs">Mobile *</Label><Input id="lf-phone" inputMode="tel" {...register("phone")} className="h-10" placeholder="98765 43210" /><Err k="phone" /></div>
            <div className="sm:col-span-2"><Label htmlFor="lf-email" className="text-xs">Email</Label><Input id="lf-email" type="email" {...register("email")} className="h-10" /><Err k="email" /></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Sel name="purpose" label="Looking to" opts={PURPOSES.map((p) => ({ v: p, l: p }))} />
            <Sel name="property_type" label="Property type" opts={PROPERTY_TYPES.map((p) => ({ v: p, l: p }))} />
            <Sel name="bhk" label="BHK" opts={BHK_OPTIONS.map((p) => ({ v: p, l: p }))} />
            <div><Label htmlFor="lf-budget" className="text-xs">Budget</Label><Input id="lf-budget" {...register("budget")} className="h-10" placeholder="50L–75L" /></div>
            <div className="col-span-1 sm:col-span-2"><Label htmlFor="lf-area" className="text-xs">Preferred area</Label><Input id="lf-area" {...register("preferred_location")} className="h-10" placeholder="Vijay Nagar" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Sel name="source" label="Source" opts={LEAD_SOURCES.map((p) => ({ v: p, l: p }))} />
            <Sel name="priority" label="Priority" opts={PRIORITIES.map((p) => ({ v: p, l: p }))} />
            <Sel name="assigned_to" label="Assign to" placeholder="Unassigned" opts={[{ v: "none", l: "Unassigned" }, ...staff.map((s) => ({ v: s.user_id, l: s.email }))]} />
            <div><Label htmlFor="lf-fu" className="text-xs">Follow-up</Label><Input id="lf-fu" type="datetime-local" {...register("follow_up_at")} className="h-10" /></div>
          </div>
          <div><Label htmlFor="lf-msg" className="text-xs">Requirement / notes</Label><Textarea id="lf-msg" rows={3} {...register("message")} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Add lead"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormDialog;
