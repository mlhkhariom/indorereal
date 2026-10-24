import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { Field } from "@/lib/builder";

const FieldInput = ({ f, value, onChange }: { f: Field; value: any; onChange: (v: any) => void }) => {
  switch (f.type) {
    case "textarea": return <Textarea rows={3} value={value || ""} onChange={(e) => onChange(e.target.value)} aria-label={f.label} />;
    case "rich": return <RichTextEditor value={value || ""} onChange={onChange} />;
    case "number": return <Input type="number" value={value ?? ""} onChange={(e) => onChange(Number(e.target.value))} aria-label={f.label} />;
    case "image": return <ImageUploader folder="pages" value={value ? [value] : []} onChange={(u) => onChange(u[u.length - 1] || "")} />;
    case "images": return <ImageUploader folder="pages" value={value || []} onChange={onChange} />;
    case "select": return (
      <Select value={value || f.options![0]} onValueChange={onChange}><SelectTrigger aria-label={f.label}><SelectValue /></SelectTrigger>
        <SelectContent>{f.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>);
    case "list": {
      const items: any[] = Array.isArray(value) ? value : [];
      const set = (next: any[]) => onChange(next);
      return (
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="rounded-lg border border-border p-2 space-y-2 bg-muted/30">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                <div className="flex">
                  <Button type="button" size="icon" variant="ghost" className="h-7 w-7" aria-label="Move up" onClick={() => { const n = [...items]; if (i > 0) [n[i - 1], n[i]] = [n[i], n[i - 1]]; set(n); }}><ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /></Button>
                  <Button type="button" size="icon" variant="ghost" className="h-7 w-7" aria-label="Move down" onClick={() => { const n = [...items]; if (i < n.length - 1) [n[i + 1], n[i]] = [n[i], n[i + 1]]; set(n); }}><ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /></Button>
                  <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive" aria-label="Remove item" onClick={() => set(items.filter((_, k) => k !== i))}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /></Button>
                </div></div>
              {f.itemFields!.map((sf) => (
                <div key={sf.key}><Label className="text-xs">{sf.label}</Label>
                  <FieldInput f={sf} value={it[sf.key]} onChange={(v) => set(items.map((x, k) => (k === i ? { ...x, [sf.key]: v } : x)))} /></div>
              ))}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => set([...items, Object.fromEntries(f.itemFields!.map((sf) => [sf.key, sf.type === "select" ? sf.options![0] : ""]))])}><Plus className="h-4 w-4 mr-1" aria-hidden="true" />Add</Button>
        </div>
      );
    }
    default: return <Input value={value || ""} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} aria-label={f.label} />;
  }
};

const BlockSettings = ({ fields, data, onChange }: { fields: Field[]; data: Record<string, any>; onChange: (d: Record<string, any>) => void }) => (
  <div className="space-y-4">
    {fields.map((f) => (
      <div key={f.key}><Label className="mb-1.5 block">{f.label}</Label><FieldInput f={f} value={data[f.key]} onChange={(v) => onChange({ ...data, [f.key]: v })} /></div>
    ))}
  </div>
);
export default BlockSettings;
