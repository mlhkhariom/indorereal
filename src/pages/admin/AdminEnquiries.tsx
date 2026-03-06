import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Enquiry {
  id: string; name: string; email: string | null; phone: string; message: string | null;
  property_title: string | null; status: string; source: string | null; created_at: string;
}

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const { toast } = useToast();

  const fetchEnquiries = async () => {
    const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    if (data) setEnquiries(data as Enquiry[]);
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchEnquiries();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Enquiry Deleted" }); fetchEnquiries(); }
  };

  const statusColor = (s: string) => s === "new" ? "destructive" : s === "contacted" ? "default" : "secondary";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Enquiries ({enquiries.length})</h2>
      <div className="grid gap-3">
        {enquiries.map((e) => (
          <Card key={e.id}>
            <CardContent className="py-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{e.name}</p>
                    <Badge variant={statusColor(e.status) as any}>{e.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{e.phone}</span>
                    {e.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{e.email}</span>}
                  </div>
                  {e.property_title && <p className="text-xs text-primary mt-1">Property: {e.property_title}</p>}
                  {e.message && <p className="text-sm mt-2 text-foreground/80">{e.message}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(e.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Select value={e.status} onValueChange={(v) => updateStatus(e.id, v)}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(e.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {enquiries.length === 0 && <p className="text-center text-muted-foreground py-12">No enquiries yet.</p>}
      </div>
    </div>
  );
};

export default AdminEnquiries;
