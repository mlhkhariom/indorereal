import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageShell from "@/components/PageShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, ShieldCheck, Users, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLocations } from "@/hooks/useLocations";
import { PROPERTY_TYPES } from "@/types/property";

const empty = { owner_name: "", owner_phone: "", owner_email: "", title: "", type: "Flat", status: "Sale", location: "", price: "", area: "", bedrooms: "0", description: "" };

const PostProperty = () => {
  const [f, setF] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { data: locs = [] } = useLocations();
  const set = (k: keyof typeof empty) => (e: any) => setF({ ...f, [k]: e?.target ? e.target.value : e });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.owner_name.trim() || !/^[+\d\s-]{10,15}$/.test(f.owner_phone.trim()) || !f.title.trim() || !f.location) {
      toast({ title: "Please fill name, valid phone, title and location", variant: "destructive" }); return;
    }
    setLoading(true);
    const { error } = await supabase.from("property_submissions").insert({
      owner_name: f.owner_name.trim(), owner_phone: f.owner_phone.trim(), owner_email: f.owner_email.trim() || null,
      title: f.title.trim(), type: f.type, status: f.status, location: f.location,
      price: f.price ? Number(f.price) : null, area: f.area ? Number(f.area) : null, bedrooms: Number(f.bedrooms) || 0,
      description: f.description.trim() || null,
    });
    setLoading(false);
    if (error) toast({ title: "Something went wrong", description: "Please try again or call us.", variant: "destructive" });
    else { setDone(true); setF(empty); }
  };

  return (
    <PageShell title="Post Your Property" subtitle="List your flat, plot, house or villa for free. Our team verifies and publishes it within 24 hours."
      seoTitle="Post Property Free in Indore — Sell or Rent | Indore Realty" seoDescription="List your property for sale or rent in Indore for free. Verified buyers, professional photos, quick closure." path="/post-property">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-elevated p-5 sm:p-8">
          {done ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-14 w-14 text-secondary mx-auto" aria-hidden="true" />
              <h2 className="font-heading text-2xl font-bold mt-4">Thank you!</h2>
              <p className="text-muted-foreground mt-2">We've received your property. Our team will call you shortly to verify details.</p>
              <button onClick={() => setDone(false)} className="btn-gold mt-6 px-6 py-3 rounded-xl text-sm">Post another</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h2 className="font-heading text-lg font-bold">Your details</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                <div><Label>Name *</Label><Input value={f.owner_name} onChange={set("owner_name")} maxLength={80} /></div>
                <div><Label>Phone *</Label><Input type="tel" value={f.owner_phone} onChange={set("owner_phone")} maxLength={15} /></div>
                <div><Label>Email</Label><Input type="email" value={f.owner_email} onChange={set("owner_email")} maxLength={120} /></div>
              </div>
              <h2 className="font-heading text-lg font-bold pt-2">Property details</h2>
              <div><Label>Title *</Label><Input value={f.title} onChange={set("title")} placeholder="e.g. 3 BHK flat near C21 Mall" maxLength={120} /></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div><Label>Type</Label>
                  <Select value={f.type} onValueChange={set("type")}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PROPERTY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>For</Label>
                  <Select value={f.status} onValueChange={set("status")}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Sale">Sale</SelectItem><SelectItem value="Rent">Rent</SelectItem></SelectContent></Select></div>
                <div className="col-span-2 sm:col-span-1"><Label>Location *</Label>
                  <Select value={f.location} onValueChange={set("location")}><SelectTrigger><SelectValue placeholder="Choose area" /></SelectTrigger>
                    <SelectContent>{locs.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}<SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
                <div><Label>Expected price (₹)</Label><Input type="number" min={0} value={f.price} onChange={set("price")} /></div>
                <div><Label>Area (sq.ft)</Label><Input type="number" min={0} value={f.area} onChange={set("area")} /></div>
                <div><Label>Bedrooms</Label><Input type="number" min={0} max={10} value={f.bedrooms} onChange={set("bedrooms")} /></div>
              </div>
              <div><Label>Description</Label><Textarea rows={4} value={f.description} onChange={set("description")} maxLength={2000} /></div>
              <button disabled={loading} className="btn-gold w-full sm:w-auto px-8 h-12 rounded-xl text-sm disabled:opacity-50">{loading ? "Submitting…" : "Submit Property"}</button>
            </form>
          )}
        </div>
        <aside className="space-y-4">
          {[[ShieldCheck, "Free listing", "No charges to list. Pay only on successful deal."], [Users, "Verified buyers", "We share your property only with genuine, screened buyers."], [Camera, "Pro photos", "Our team visits and shoots professional photos."]].map(([Icon, t, d]: any) => (
            <div key={t} className="card-elevated p-5 flex gap-4">
              <div className="h-11 w-11 rounded-xl gold-gradient flex items-center justify-center shrink-0"><Icon className="h-5 w-5 text-primary" aria-hidden="true" /></div>
              <div><p className="font-heading font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
            </div>
          ))}
        </aside>
      </div>
    </PageShell>
  );
};
export default PostProperty;
