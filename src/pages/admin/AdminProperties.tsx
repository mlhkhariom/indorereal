import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAllLocations } from "@/hooks/useLocations";
import ImageUploader from "@/components/admin/ImageUploader";
import { Search, Eye } from "lucide-react";

interface Property {
  id: string; slug: string; title: string; price: number; location: string; type: string;
  bedrooms: number; area: number; area_unit: string; description: string | null;
  amenities: string[]; images: string[]; featured: boolean; status: string;
  view_count?: number; latitude?: number | null; longitude?: number | null;
}

const emptyProperty = {
  slug: "", title: "", price: 0, location: "", type: "Flat", bedrooms: 0,
  area: 0, area_unit: "sq.ft", description: "", amenities: "", images: [] as string[],
  featured: false, status: "Sale", latitude: "", longitude: "",
};

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState(emptyProperty);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: locations = [] } = useAllLocations();
  const [q, setQ] = useState("");
  const shown = properties.filter((p) => !q || `${p.title} ${p.location} ${p.type}`.toLowerCase().includes(q.toLowerCase()));

  const fetchProperties = async () => {
    const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (data) setProperties(data as Property[]);
  };

  useEffect(() => { fetchProperties(); }, []);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      slug: form.slug || generateSlug(form.title),
      title: form.title, price: form.price, location: form.location, type: form.type,
      bedrooms: form.bedrooms, area: form.area, area_unit: form.area_unit,
      description: form.description,
      amenities: form.amenities.split(",").map((s: string) => s.trim()).filter(Boolean),
      images: form.images,
      latitude: form.latitude ? Number(form.latitude) : null, longitude: form.longitude ? Number(form.longitude) : null,
      featured: form.featured, status: form.status,
      created_by: user?.id,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("properties").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("properties").insert(payload));
    }
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editId ? "Property Updated" : "Property Added" });
      setDialogOpen(false);
      setForm(emptyProperty);
      setEditId(null);
      fetchProperties();
    }
  };

  const handleEdit = (p: Property) => {
    setEditId(p.id);
    setForm({
      slug: p.slug, title: p.title, price: p.price, location: p.location, type: p.type,
      bedrooms: p.bedrooms, area: p.area, area_unit: p.area_unit, description: p.description || "",
      amenities: p.amenities?.join(", ") || "", images: p.images || [],
      featured: p.featured, status: p.status, latitude: p.latitude?.toString() || "", longitude: p.longitude?.toString() || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Property Deleted" }); fetchProperties(); }
  };

  const formatPrice = (price: number) => price >= 10000000 ? `₹${(price / 10000000).toFixed(1)} Cr` : price >= 100000 ? `₹${(price / 100000).toFixed(1)} L` : `₹${price.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Properties ({properties.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setForm(emptyProperty); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="btn-gold"><Plus className="h-4 w-4 mr-1" aria-hidden="true" /> Add Property</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit Property" : "Add Property"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
                <div><Label>Price *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required /></div>
                <div>
                  <Label>Location *</Label>
                  <Select value={form.location} onValueChange={(v) => setForm({ ...form, location: v })}>
                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                    <SelectContent>
                      {locations.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["Flat", "Plot", "House", "Villa"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Bedrooms</Label><Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} /></div>
                <div><Label>Area *</Label><Input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: Number(e.target.value) })} required /></div>
                <div><Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Sale">Sale</SelectItem><SelectItem value="Rent">Rent</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
              <div><Label>Amenities (comma separated)</Label><Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Pool, Gym, Parking" /></div>
              <div><Label>Photos</Label><ImageUploader value={form.images} onChange={(images) => setForm({ ...form, images })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Map latitude (optional)</Label><Input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="22.7533" /></div>
                <div><Label>Map longitude (optional)</Label><Input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="75.8937" /></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /><Label>Featured</Label></div>
              <Button type="submit" className="w-full btn-gold" disabled={loading}>{loading ? "Saving..." : editId ? "Update Property" : "Add Property"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, area or type…" className="pl-9" />
      </div>
      <div className="grid gap-3">
        {shown.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-4 min-w-0">
                {p.images?.[0] && <img loading="lazy" decoding="async" src={p.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover hidden sm:block" />}
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.location} • {p.type} • {formatPrice(p.price)} {p.featured && <span className="text-primary font-medium">⭐ Featured</span>} <span className="inline-flex items-center gap-0.5 ml-1"><Eye className="h-3 w-3" aria-hidden="true" />{p.view_count || 0}</span></p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="outline" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" aria-hidden="true" /></Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" aria-hidden="true" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {properties.length === 0 && <p className="text-center text-muted-foreground py-12">No properties yet. Add your first property!</p>}
      </div>
    </div>
  );
};

export default AdminProperties;
