import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, Copy, EyeOff, GripVertical, Lock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlockRenderer from "@/components/builder/BlockRenderer";
import { Block, getDef } from "@/lib/builder";

export default function BuilderCanvasBlock({ block, title, kind, selected, action }: {
  block: Block; title: string; kind: "page" | "project"; selected: boolean;
  action: (action: string, id: string, extra?: Record<string, unknown>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id, disabled: block.locked });
  const label = block.name || getDef(block.type)?.label || block.type;
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
    data-canvas-block={block.id}
    onDragOver={(e) => { if (e.dataTransfer.types.includes("application/builder-block")) e.preventDefault(); }}
    onDrop={(e) => { const type = e.dataTransfer.getData("application/builder-block"); if (getDef(type)) { e.preventDefault(); e.stopPropagation(); action("add", block.id, { blockType: type }); } }}
    className={`relative border-2 ${selected ? "border-primary" : "border-transparent hover:border-primary/40"} ${isDragging ? "z-30 opacity-60" : ""}`}>
    <div className={`sticky top-0 z-20 flex flex-wrap items-center gap-1 border-b border-border px-2 py-1 bg-card text-card-foreground ${selected ? "" : "bg-muted"}`}>
      <Button variant="ghost" size="icon" className="h-8 w-8 touch-none cursor-grab" aria-label={`Drag ${label}`} title={`Drag ${label}`} disabled={block.locked} {...attributes} {...listeners}><GripVertical className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className="min-w-0 flex-1 justify-start truncate" onClick={() => action("select", block.id)}>{label}</Button>
      {block.hidden && <EyeOff className="h-4 w-4 text-muted-foreground" aria-label="Hidden on public page" />}
      {block.locked && <Lock className="h-4 w-4 text-muted-foreground" aria-label="Locked" />}
      {[["up", ArrowUp, "Move up"], ["down", ArrowDown, "Move down"], ["duplicate", Copy, "Duplicate"], ["delete", Trash2, "Delete"]].map(([key, Icon, name]) => {
        const I = Icon as typeof Copy;
        return <Button key={String(key)} variant="ghost" size="icon" className="h-8 w-8" disabled={block.locked} aria-label={`${name} ${label}`} title={String(name)} onClick={() => action(String(key), block.id)}><I className="h-4 w-4" /></Button>;
      })}
    </div>
    <div onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); action("select", block.id); }} className="cursor-pointer" role="button" tabIndex={0} aria-label={`Edit ${label}`} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); action("select", block.id); } }}>
      <div className="pointer-events-none select-none" {...{ inert: "" }}><BlockRenderer blocks={[block]} pageTitle={title} kind={kind} showHidden /></div>
    </div>
    <div className="flex justify-center border-t border-dashed border-border py-1 bg-muted/50"><Button variant="ghost" size="icon" className="h-7 w-7" title="Add block after" aria-label={`Add block after ${label}`} onClick={() => action("insert", block.id)}><Plus className="h-4 w-4" /></Button></div>
  </div>;
}