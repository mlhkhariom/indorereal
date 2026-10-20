import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { CalendarCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ScheduleVisitForm = ({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState("");
  const [loading, setLoading] = useState(false);
  const minDate = new Date(Date.now() + 3600_000).toISOString().slice(0, 16);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^[+\d\s-]{10,15}$/.test(phone.trim()) || !when) {
      toast({ title: "Please enter name, a valid phone and a date", variant: "destructive" }); return;
    }
    setLoading(true);
    const visitAt = new Date(when).toISOString();
    const [v] = await Promise.all([
      supabase.from("site_visits").insert({ property_id: propertyId, property_title: propertyTitle, client_name: name.trim(), client_phone: phone.trim(), visit_at: visitAt }),
      supabase.from("enquiries").insert({ name: name.trim(), phone: phone.trim(), property_id: propertyId, property_title: propertyTitle, source: "site_visit_request", message: `Site visit requested for ${new Date(when).toLocaleString()}`, page_url: window.location.href }),
    ]);
    setLoading(false);
    if (v.error) toast({ title: "Could not book visit", description: "Please call us directly.", variant: "destructive" });
    else { toast({ title: "Visit requested!", description: "We'll call to confirm your slot." }); setName(""); setPhone(""); setWhen(""); }
  };

  return (
    <form onSubmit={submit} className="card-elevated p-5 space-y-3">
      <h4 className="font-heading font-semibold text-card-foreground flex items-center gap-2"><CalendarCheck className="h-4 w-4 text-secondary" /> Schedule a Free Site Visit</h4>
      <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className="h-10 rounded-xl" />
      <Input placeholder="Phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={15} className="h-10 rounded-xl" />
      <Input type="datetime-local" min={minDate} value={when} onChange={(e) => setWhen(e.target.value)} className="h-10 rounded-xl" aria-label="Preferred date and time" />
      <button disabled={loading} className="w-full h-11 btn-gold rounded-xl text-sm disabled:opacity-50">{loading ? "Booking…" : "Book Visit"}</button>
    </form>
  );
};

export default ScheduleVisitForm;
