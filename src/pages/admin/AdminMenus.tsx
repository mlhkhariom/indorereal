import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Trash2, Plus, Save, RotateCcw } from "lucide-react";
import { DEFAULT_MENUS, MenuLink, parseMenu } from "@/hooks/useMenu";
import { saveSetting } from "@/lib/saveSetting";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const MENUS = [
  { key: "menu_header", label: "Header menu", help: "First 2 links and the last link show in the top bar; the rest go under “Pages”." },
  { key: "menu_footer_quick", label: "Footer: Quick Links", help: "" },
  { key: "menu_footer_useful", label: "Footer: Useful Links", help: "" },
];

const AdminMenus = () => {
  const [menus, setMenus] = useState<Record<string, MenuLink[]>>(DEFAULT_MENUS);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("site_settings").select("setting_key, setting_value").in("setting_key", MENUS.map((m) => m.key)).then(({ data }) => {
      const next = { ...DEFAULT_MENUS };
      data?.forEach((r) => { next[r.setting_key] = parseMenu(r.setting_value || undefined, r.setting_key); });
      setMenus(next);
    });
  }, []);

  const edit = (key: string, fn: (l: MenuLink[]) => MenuLink[]) => setMenus((m) => ({ ...m, [key]: fn([...m[key]]) }));
  const save = async (key: string) => {
    const clean = menus[key].filter((l) => l.label.trim() && l.path.trim());
    const { error } = await saveSetting(key, JSON.stringify(clean), user?.id);
    toast(error ? { title: "Error", description: error.message, variant: "destructive" } : { title: "Menu saved", description: "Refresh the website to see it." });
  };

  return (
    <Tabs defaultValue="menu_header">
      <TabsList className="flex-wrap h-auto">{MENUS.map((m) => <TabsTrigger key={m.key} value={m.key}>{m.label}</TabsTrigger>)}</TabsList>
      {MENUS.map((m) => (
        <TabsContent key={m.key} value={m.key}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <div><CardTitle className="text-base">{m.label}</CardTitle>{m.help && <p className="text-xs text-muted-foreground mt-1">{m.help}</p>}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => edit(m.key, () => DEFAULT_MENUS[m.key])}><RotateCcw className="h-4 w-4 mr-1" />Reset</Button>
                <Button size="sm" className="btn-gold" onClick={() => save(m.key)}><Save className="h-4 w-4 mr-1" />Save</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {menus[m.key].map((l, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 rounded-lg border border-border p-2">
                  <Input value={l.label} placeholder="Label" onChange={(e) => edit(m.key, (a) => { a[i] = { ...a[i], label: e.target.value }; return a; })} />
                  <Input value={l.path} placeholder="/page or https://…" onChange={(e) => edit(m.key, (a) => { a[i] = { ...a[i], path: e.target.value }; return a; })} />
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" aria-label="Move up" onClick={() => edit(m.key, (a) => { if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; })}><ArrowUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label="Move down" onClick={() => edit(m.key, (a) => { if (i < a.length - 1) [a[i + 1], a[i]] = [a[i], a[i + 1]]; return a; })}><ArrowDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label="Remove" className="text-destructive" onClick={() => edit(m.key, (a) => a.filter((_, k) => k !== i))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => edit(m.key, (a) => [...a, { label: "", path: "/" }])}><Plus className="h-4 w-4 mr-1" />Add link</Button>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
export default AdminMenus;
