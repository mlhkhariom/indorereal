import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UploadCloud, X, ArrowLeft, ArrowRight, Link2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/** Drag-and-drop multi image uploader with reordering. First image is the cover. */
const ImageUploader = ({ value, onChange, folder = "properties" }: { value: string[]; onChange: (urls: string[]) => void; folder?: string }) => {
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(0);
  const [url, setUrl] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setBusy(list.length);
    const urls: string[] = [];
    for (const f of list) {
      if (f.size > 8 * 1024 * 1024) { toast({ title: `${f.name} is larger than 8MB`, variant: "destructive" }); continue; }
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${f.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("gallery").upload(path, f, { cacheControl: "31536000" });
      if (error) toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      else urls.push(supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl);
      setBusy((b) => b - 1);
    }
    setBusy(0);
    onChange([...value, ...urls]);
  };

  const move = (i: number, d: number) => {
    const n = [...value]; const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; onChange(n);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
        onClick={() => input.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${drag ? "border-secondary bg-secondary/10" : "border-border hover:bg-muted/50"}`}>
        {busy > 0 ? <Loader2 className="h-7 w-7 mx-auto animate-spin text-secondary" aria-hidden="true" /> : <UploadCloud className="h-7 w-7 mx-auto text-muted-foreground" aria-hidden="true" />}
        <p className="text-sm font-medium mt-2">{busy > 0 ? `Uploading ${busy}…` : "Drag photos here or click to choose"}</p>
        <p className="text-xs text-muted-foreground">JPG / PNG / WEBP, up to 8MB each. First photo is the cover.</p>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && upload(e.target.files)} />
      </div>
      <div className="flex gap-2">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste an image link" className="h-9" />
        <Button type="button" variant="outline" size="sm" onClick={() => { if (url.trim()) { onChange([...value, url.trim()]); setUrl(""); } }}><Link2 className="h-4 w-4 mr-1" aria-hidden="true" />Add</Button>
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((u, i) => (
            <div key={u + i} className="relative group rounded-lg overflow-hidden aspect-square bg-muted">
              <img src={u} alt="" className="w-full h-full object-cover" loading="lazy" />
              {i === 0 && <span className="absolute top-1 left-1 text-[10px] font-semibold bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">Cover</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 bg-gradient-to-t from-foreground/70 to-transparent">
                <button type="button" aria-label="Move left" onClick={() => move(i, -1)} className="h-6 w-6 rounded bg-background/90 flex items-center justify-center"><ArrowLeft className="h-3 w-3" aria-hidden="true" /></button>
                <button type="button" aria-label="Remove" onClick={() => onChange(value.filter((_, k) => k !== i))} className="h-6 w-6 rounded bg-destructive text-destructive-foreground flex items-center justify-center"><X className="h-3 w-3" /></button>
                <button type="button" aria-label="Move right" onClick={() => move(i, 1)} className="h-6 w-6 rounded bg-background/90 flex items-center justify-center"><ArrowRight className="h-3 w-3" aria-hidden="true" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
