import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Check, X, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/types/property";

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);

const AdminSubmissions = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [tab, setTab] = useState("pending");
  const { user } = useAuth();
  const { toast } = useToast();
  const load = () => supabase.from("property_submissions").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data || []));
  useEffect(() => { load(); }, []);

  const approve = async (s: any) => {
    const { error } = await supabase.from("properties").insert({
      slug: slugify(s.title), title: s.title, price: s.price || 0, location: s.location, type: s.type, status: s.status,
      bedrooms: s.bedrooms || 0, area: s.area || 0, description: s.description, images: s.images || [], created_by: user?.id,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    await supabase.from("property_submissions").update({ review_status: "approved" }).eq("id", s.id);
    toast({ title: "Published", description: "Now edit it in Properties to add photos." }); load();
  };
  const setStatus = async (id: string, review_status: string) => { await supabase.from("property_submissions").update({ review_status }).eq("id", id); load(); };
  const del = async (id: string) => { if (confirm("Delete?")) { await supabase.from("property_submissions").delete().eq("id", id); load(); } };

  const list = rows.filter((r) => r.review_status === tab);
  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>{["pending", "approved", "rejected"].map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t} ({rows.filter((r) => r.review_status === t).length})</TabsTrigger>)}</TabsList>
      </Tabs>
      {list.length === 0 && <p className="text-center text-muted-foreground py-12">Nothing here.</p>}
      <div className="grid gap-3">
        {list.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="font-semibold">{s.title} <Badge variant="outline" className="ml-1">{s.type} · {s.status}</Badge></p>
                <p className="text-sm text-muted-foreground">{s.location}{s.price ? ` · ${formatPrice(Number(s.price), s.status)}` : ""}{s.area ? ` · ${s.area} sq.ft` : ""}{s.bedrooms ? ` · ${s.bedrooms} BHK` : ""}</p>
                {s.description && <p className="text-sm">{s.description}</p>}
                <p className="text-xs text-muted-foreground flex items-center gap-2"><a href={`tel:${s.owner_phone}`} className="flex items-center gap-1 hover:text-secondary"><Phone className="h-3 w-3" aria-hidden="true" />{s.owner_name} · {s.owner_phone}</a> · {new Date(s.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {tab === "pending" && <>
                  <Button size="sm" className="btn-gold" onClick={() => approve(s)}><Check className="h-4 w-4 mr-1" aria-hidden="true" />Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(s.id, "rejected")}><X className="h-4 w-4 mr-1" />Reject</Button>
                </>}
                <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete" onClick={() => del(s.id)}><Trash2 className="h-4 w-4" aria-hidden="true" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default AdminSubmissions;
