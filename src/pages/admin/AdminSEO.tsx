import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Globe, Search, FileCode } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string | null;
}

const settingsGroups = [
  {
    title: "General SEO",
    icon: Globe,
    keys: [
      { key: "site_title", label: "Site Title", type: "input", help: "Browser tab title (<60 chars, include main keyword)" },
      { key: "site_description", label: "Meta Description", type: "textarea", help: "Search engine description (<160 chars)" },
      { key: "site_keywords", label: "Meta Keywords", type: "textarea", help: "Comma-separated keywords for SEO" },
      { key: "canonical_url", label: "Canonical URL", type: "input", help: "Main website URL (e.g., https://indorerealty.in)" },
    ],
  },
  {
    title: "OpenGraph (Social Sharing)",
    icon: Search,
    keys: [
      { key: "og_title", label: "OG Title", type: "input", help: "Title shown when shared on social media" },
      { key: "og_description", label: "OG Description", type: "textarea", help: "Description for social media shares" },
    ],
  },
  {
    title: "Schema.org (Structured Data)",
    icon: FileCode,
    keys: [
      { key: "schema_org_name", label: "Business Name", type: "input" },
      { key: "schema_org_phone", label: "Phone Number", type: "input" },
      { key: "schema_org_address", label: "Business Address", type: "input" },
      { key: "schema_org_description", label: "Business Description", type: "textarea" },
    ],
  },
  {
    title: "Verification & Contact",
    icon: Globe,
    keys: [
      { key: "google_site_verification", label: "Google Site Verification Code", type: "input", help: "From Google Search Console" },
      { key: "whatsapp_number", label: "WhatsApp Number", type: "input", help: "Without + (e.g., 919876543210)" },
      { key: "phone_number", label: "Phone Number", type: "input" },
      { key: "company_email", label: "Company Email", type: "input" },
    ],
  },
];

const AdminSEO = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const map: Record<string, string> = {};
        (data as Setting[]).forEach((s) => { map[s.setting_key] = s.setting_value || ""; });
        setSettings(map);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("site_settings").upsert(
        { setting_key: key, setting_value: value, updated_by: user?.id },
        { onConflict: "setting_key" }
      );
    }
    setSaving(false);
    toast({ title: "SEO Settings Saved!", description: "Changes will reflect on the website." });
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">SEO & Metadata Settings</h2>
        <Button className="btn-gold" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      {settingsGroups.map((group) => {
        const Icon = group.icon;
        return (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="h-4 w-4 text-secondary" /> {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.keys.map((field) => (
                <div key={field.key}>
                  <Label className="text-sm">{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      rows={2}
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className="mt-1"
                    />
                  )}
                  {field.help && <p className="text-xs text-muted-foreground mt-1">{field.help}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminSEO;
