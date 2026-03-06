import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, Trash2, GripVertical, BarChart3, MapPin, MessageSquare, Lightbulb, Footprints } from "lucide-react";

interface ContentItem {
  id?: string;
  section: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: string;
  sort_order: number;
  extra_data: Record<string, any>;
}

const sectionConfig = [
  { key: "hero_stat", label: "Hero Stats", icon: BarChart3, fields: ["title", "subtitle"], extraFields: [] },
  { key: "testimonial", label: "Testimonials", icon: MessageSquare, fields: ["title", "subtitle", "description"], extraFields: ["rating"] },
  { key: "location", label: "Locations", icon: MapPin, fields: ["title", "subtitle", "image"], extraFields: ["count"] },
  { key: "how_it_works", label: "How It Works", icon: Footprints, fields: ["title", "description", "icon"], extraFields: [] },
  { key: "why_choose_us", label: "Why Choose Us", icon: Lightbulb, fields: ["title", "description", "icon"], extraFields: [] },
];

const fieldLabels: Record<string, string> = {
  title: "Title / Value",
  subtitle: "Subtitle / Role",
  description: "Description / Content",
  image: "Image URL",
  icon: "Icon Name",
  rating: "Rating (1-5)",
  count: "Listings Count",
};

const AdminHomepage = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero_stat");
  const { toast } = useToast();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const { data } = await supabase.from("homepage_content").select("*").order("sort_order");
    if (data) setItems(data.map((d: any) => ({ ...d, extra_data: d.extra_data || {} })));
    setLoading(false);
  };

  const sectionItems = items.filter(i => i.section === activeSection).sort((a, b) => a.sort_order - b.sort_order);
  const config = sectionConfig.find(s => s.key === activeSection)!;

  const updateItem = (index: number, field: string, value: string) => {
    setItems(prev => {
      const updated = [...prev];
      const itemIndex = updated.findIndex(i => i === sectionItems[index]);
      if (itemIndex >= 0) {
        if (["rating", "count"].includes(field)) {
          updated[itemIndex] = { ...updated[itemIndex], extra_data: { ...updated[itemIndex].extra_data, [field]: parseInt(value) || 0 } };
        } else {
          (updated[itemIndex] as any)[field] = value;
        }
      }
      return updated;
    });
  };

  const addItem = () => {
    const newItem: ContentItem = {
      section: activeSection,
      title: "",
      subtitle: "",
      description: "",
      image: "",
      icon: "",
      sort_order: sectionItems.length + 1,
      extra_data: {},
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = async (index: number) => {
    const item = sectionItems[index];
    if (item.id) {
      await supabase.from("homepage_content").delete().eq("id", item.id);
    }
    setItems(prev => prev.filter(i => i !== item));
    toast({ title: "Item removed" });
  };

  const handleSave = async () => {
    setSaving(true);
    const toSave = items.filter(i => i.section === activeSection);

    for (const item of toSave) {
      const payload = {
        section: item.section,
        title: item.title || null,
        subtitle: item.subtitle || null,
        description: item.description || null,
        image: item.image || null,
        icon: item.icon || null,
        sort_order: item.sort_order,
        extra_data: item.extra_data,
      };

      if (item.id) {
        await supabase.from("homepage_content").update(payload).eq("id", item.id);
      } else {
        const { data } = await supabase.from("homepage_content").insert(payload).select().single();
        if (data) item.id = (data as any).id;
      }
    }

    setSaving(false);
    toast({ title: "Saved!", description: `${config.label} updated successfully.` });
    fetchAll();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold">Homepage Content Manager</h2>
        <Button className="btn-gold" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {sectionConfig.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeSection === s.key ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}>
              <Icon className="h-4 w-4" /> {s.label}
              <span className="text-xs opacity-60">({items.filter(i => i.section === s.key).length})</span>
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div className="space-y-4">
        {sectionItems.map((item, idx) => (
          <Card key={item.id || `new-${idx}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  {config.label} #{idx + 1}
                </span>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeItem(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.fields.map(field => (
                <div key={field}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{fieldLabels[field]}</label>
                  {field === "description" ? (
                    <Textarea value={(item as any)[field] || ""} onChange={(e) => updateItem(idx, field, e.target.value)} rows={3} />
                  ) : (
                    <Input value={(item as any)[field] || ""} onChange={(e) => updateItem(idx, field, e.target.value)} />
                  )}
                </div>
              ))}
              {config.extraFields.map(field => (
                <div key={field}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{fieldLabels[field]}</label>
                  <Input type="number" value={item.extra_data?.[field] || ""} onChange={(e) => updateItem(idx, field, e.target.value)} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full rounded-xl" onClick={addItem}>
        <Plus className="h-4 w-4 mr-1" /> Add {config.label} Item
      </Button>
    </div>
  );
};

export default AdminHomepage;
