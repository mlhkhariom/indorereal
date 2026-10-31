import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

/**
 * Smart enquiry widget that auto-fills from localStorage and captures
 * the current page/project details for the CRM.
 * source examples: "builder_project", "builder_page", "property_detail", "landing_page", "brochure"
 */
export const EnquiryWidget = ({
  pageTitle,
  button = "Request Call Back",
  source = "builder_page",
  propertyId,
  compact,
  prefill,
}: {
  pageTitle: string;
  button?: string;
  source?: string;
  propertyId?: string;
  compact?: boolean;
  prefill?: { name?: string; phone?: string };
}) => {
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("indorealty_lead");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.name && parsed.phone) {
          setF((p) => ({ ...p, name: parsed.name, phone: parsed.phone }));
          return;
        }
      } catch {}
    }
    if (prefill?.name) setF((prev) => ({ ...prev, name: prefill.name }));
    if (prefill?.phone) setF((prev) => ({ ...prev, phone: prefill.phone }));
  }, [prefill]);

  const storeLead = () => {
    if (f.name.trim() && f.phone.trim()) {
      localStorage.setItem("indorealty_lead", JSON.stringify({
        name: f.name.trim(),
        phone: f.phone.trim(),
        page: window.location.href,
      }));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !/^[+\d\s-]{8,15}$/.test(f.phone.trim())) {
      toast({ title: "Please enter your name and a valid phone number", variant: "destructive" });
      return;
    }
    setBusy(true);
    const q = new URLSearchParams(window.location.search);
    const entry = {
      name: f.name.trim().slice(0, 100),
      phone: f.phone.trim(),
      message: (f.message.trim().slice(0, 1000) || null) as string | null,
      property_title: pageTitle || "",
      property_id: propertyId || null,
      source,
      page_url: window.location.href,
      utm_source: q.get("utm_source"),
      utm_campaign: q.get("utm_campaign"),
    };
    const { error } = await supabase.from("enquiries").insert(entry);
    setBusy(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again or call us.", variant: "destructive" });
      return;
    }
    storeLead();
    toast({ title: "Thank you!", description: "Our team will call you shortly." });
    setF({ name: "", phone: "", message: "" });
  };

  return (
    <form onSubmit={submit} className="space-y-3 text-foreground">
      <Input aria-label="Your name" placeholder="Your name" value={f.name} maxLength={100}
        onChange={(e) => setF({ ...f, name: e.target.value })} />
      <Input aria-label="Phone number" placeholder="Phone number" type="tel" value={f.phone} maxLength={15}
        onChange={(e) => setF({ ...f, phone: e.target.value })} />
      {!compact && <Textarea aria-label="Message" placeholder="Message (optional)" rows={3}
        value={f.message} maxLength={1000} onChange={(e) => setF({ ...f, message: e.target.value })} />}
      <Button type="submit" className="btn-gold w-full" disabled={busy}>{busy ? "Sending..." : button}</Button>
    </form>
  );
};

export default EnquiryWidget;
