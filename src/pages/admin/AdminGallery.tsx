import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Image as ImageIcon, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface GalleryImage {
  id: string;
  title: string | null;
  category: string;
  image_url: string;
  sort_order: number;
}

const CATEGORIES = ["Apartments", "Villas", "Homes", "Commercial", "Interiors", "Plots", "General"];

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", category: "General", image_url: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchImages = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
    if (data) setImages(data as GalleryImage[]);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file);
    if (error) {
      toast({ title: "Upload Error", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
    setForm(prev => ({ ...prev, image_url: urlData.publicUrl }));
    setUploading(false);
    toast({ title: "Image uploaded!" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) { toast({ title: "Please add an image", variant: "destructive" }); return; }
    
    const payload = {
      title: form.title || null,
      category: form.category,
      image_url: form.image_url,
      sort_order: images.length + 1,
      created_by: user?.id,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("gallery_images").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("gallery_images").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editId ? "Image Updated" : "Image Added" });
      setDialogOpen(false);
      setForm({ title: "", category: "General", image_url: "" });
      setEditId(null);
      fetchImages();
    }
  };

  const handleEdit = (img: GalleryImage) => {
    setEditId(img.id);
    setForm({ title: img.title || "", category: img.category, image_url: img.image_url });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Image Deleted" }); fetchImages(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Gallery ({images.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setForm({ title: "", category: "General", image_url: "" }); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="btn-gold"><Plus className="h-4 w-4 mr-1" /> Add Image</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editId ? "Edit Image" : "Add Gallery Image"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Image title" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-10 rounded-lg bg-muted/60 border border-border px-3 text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Image</label>
                <div className="space-y-2">
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <Button type="button" variant="outline" className="w-full" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                  <div className="text-xs text-muted-foreground text-center">or paste URL below</div>
                  <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                  {form.image_url && <img src={form.image_url} alt="Preview" className="h-32 w-full object-cover rounded-lg" />}
                </div>
              </div>
              <Button type="submit" className="w-full btn-gold">{editId ? "Update" : "Add Image"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <Card key={img.id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <img src={img.image_url} alt={img.title || ""} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(img)}><Pencil className="h-3 w-3" /></Button>
                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(img.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
            <CardContent className="p-2">
              <p className="text-xs font-medium truncate">{img.title || "Untitled"}</p>
              <p className="text-[10px] text-muted-foreground">{img.category}</p>
            </CardContent>
          </Card>
        ))}
        {images.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No gallery images yet. Add your first image!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
