import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null; content: string;
  cover_image: string | null; category: string; tags: string[]; author_name: string;
  published: boolean; seo_title: string | null; seo_description: string | null;
  seo_keywords: string | null; read_time: number | null; created_at: string;
}

const emptyForm = {
  slug: "", title: "", excerpt: "", content: "", cover_image: "", category: "General",
  tags: "", author_name: "Indore Realty", published: false,
  seo_title: "", seo_description: "", seo_keywords: "", read_time: 5,
};

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data as BlogPost[]);
  };

  useEffect(() => { fetchPosts(); }, []);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      slug: form.slug || generateSlug(form.title),
      title: form.title, excerpt: form.excerpt, content: form.content,
      cover_image: form.cover_image || null, category: form.category,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      author_name: form.author_name, published: form.published,
      seo_title: form.seo_title || null, seo_description: form.seo_description || null,
      seo_keywords: form.seo_keywords || null, read_time: form.read_time,
      created_by: user?.id,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(payload));
    }
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editId ? "Post Updated" : "Post Created" });
      setDialogOpen(false); setForm(emptyForm); setEditId(null);
      fetchPosts();
    }
  };

  const handleEdit = (p: BlogPost) => {
    setEditId(p.id);
    setForm({
      slug: p.slug, title: p.title, excerpt: p.excerpt || "", content: p.content,
      cover_image: p.cover_image || "", category: p.category,
      tags: p.tags?.join(", ") || "", author_name: p.author_name,
      published: p.published, seo_title: p.seo_title || "",
      seo_description: p.seo_description || "", seo_keywords: p.seo_keywords || "",
      read_time: p.read_time || 5,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Post Deleted" }); fetchPosts(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Blog Posts ({posts.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setForm(emptyForm); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="btn-gold"><Plus className="h-4 w-4 mr-1" /> New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit Post" : "New Blog Post"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                <div><Label>Author</Label><Input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} /></div>
                <div><Label>Cover Image URL</Label><Input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} /></div>
                <div><Label>Read Time (min)</Label><Input type="number" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
              <div><Label>Content *</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} required /></div>
              <div><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>

              <div className="border-t pt-4 space-y-3">
                <p className="font-semibold text-sm">SEO Settings</p>
                <div><Label>SEO Title</Label><Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} placeholder="Page title for search engines" /></div>
                <div><Label>SEO Description</Label><Textarea value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} rows={2} placeholder="Meta description" /></div>
                <div><Label>SEO Keywords</Label><Input value={form.seo_keywords} onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })} placeholder="keyword1, keyword2" /></div>
              </div>

              <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /><Label>Published</Label></div>
              <Button type="submit" className="w-full btn-gold" disabled={loading}>{loading ? "Saving..." : editId ? "Update Post" : "Create Post"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {posts.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{p.title}</p>
                  {p.published ? <Eye className="h-3 w-3 text-green-600" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
                </div>
                <p className="text-xs text-muted-foreground">{p.category} • {p.author_name} • {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="outline" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && <p className="text-center text-muted-foreground py-12">No blog posts yet. Create your first post!</p>}
      </div>
    </div>
  );
};

export default AdminBlog;
