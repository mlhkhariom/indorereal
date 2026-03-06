import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";

interface Location {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  listing_count: number;
  sort_order: number;
  active: boolean;
}

const emptyForm = { name: "", description: "", image_url: "", listing_count: 0, sort_order: 0, active: true };

const AdminLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLocations = async () => {
    const { data } = await supabase.from("locations").select("*").order("sort_order");
    if (data) setLocations(data as Location[]);
  };

  useEffect(() => { fetchLocations(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      image_url: form.image_url || null,
      listing_count: form.listing_count,
      sort_order: form.sort_order,
      active: form.active,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("locations").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("locations").insert(payload));
    }
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editId ? "Location Updated" : "Location Added" });
      setDialogOpen(false);
      setForm(emptyForm);
      setEditId(null);
      fetchLocations();
    }
  };

  const handleEdit = (loc: Location) => {
    setEditId(loc.id);
    setForm({
      name: loc.name,
      description: loc.description || "",
      image_url: loc.image_url || "",
      listing_count: loc.listing_count,
      sort_order: loc.sort_order,
      active: loc.active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this location?")) return;
    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Location Deleted" }); fetchLocations(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Locations ({locations.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setForm(emptyForm); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="btn-gold"><Plus className="h-4 w-4 mr-1" /> Add Location</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editId ? "Edit Location" : "Add Location"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Vijay Nagar" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Premium flats & commercial" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Image URL</label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                {form.image_url && <img src={form.image_url} alt="Preview" className="h-24 w-full object-cover rounded-lg mt-2" />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Listing Count</label>
                  <Input type="number" value={form.listing_count} onChange={(e) => setForm({ ...form, listing_count: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Sort Order</label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                <label className="text-sm">Active</label>
              </div>
              <Button type="submit" className="w-full btn-gold" disabled={loading}>
                {loading ? "Saving..." : editId ? "Update Location" : "Add Location"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {locations.map((loc) => (
          <Card key={loc.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4 min-w-0">
                {loc.image_url && <img src={loc.image_url} alt="" className="h-12 w-12 rounded-lg object-cover hidden sm:block" />}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                    <p className="font-semibold text-sm truncate">{loc.name}</p>
                    {!loc.active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{loc.description} • {loc.listing_count}+ listings</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="outline" onClick={() => handleEdit(loc)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(loc.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {locations.length === 0 && <p className="text-center text-muted-foreground py-12">No locations yet.</p>}
      </div>
    </div>
  );
};

export default AdminLocations;
