import { useState } from "react";
import { DndContext, useDraggable, useDroppable, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { PIPELINE_STAGES, normalizeStage, stageColor } from "@/lib/crm";
import { useIsMobile } from "@/hooks/use-mobile";
import LeadCard from "./LeadCard";
import type { Lead } from "./types";

interface Props {
  leads: Lead[]; staffName: (id: string | null) => string | undefined;
  onOpen: (id: string) => void; onMove: (id: string, stage: string) => void; onContact: (id: string) => void;
}

const budgetTotal = (items: Lead[]) => items.filter((l) => l.budget).length;

const Draggable = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} aria-roledescription="draggable lead"
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined}
      className={`cursor-grab touch-none rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isDragging ? "opacity-80 z-50 relative rotate-1" : ""}`}>
      {children}
    </div>
  );
};

const Column = ({ id, label, count, withBudget, children }: { id: string; label: string; count: number; withBudget: number; children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <section ref={setNodeRef} aria-label={`${label} stage, ${count} leads`}
      className={`w-[280px] xl:w-auto xl:flex-1 xl:min-w-[220px] shrink-0 rounded-2xl p-2 transition-colors ${isOver ? "ring-2 ring-primary/40" : ""}`}
      style={{ background: stageColor(id, isOver ? 0.12 : 0.06) }}>
      <header className="flex items-center gap-2 px-1.5 pb-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: stageColor(id) }} />
        <h3 className="font-semibold text-sm">{label}</h3>
        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px] bg-background text-foreground">{count}</Badge>
      </header>
      {withBudget > 0 && <p className="px-1.5 pb-2 text-[10px] text-muted-foreground">{withBudget} with budget shared</p>}
      <div className="space-y-2 min-h-[140px]">{children}</div>
    </section>
  );
};

const Pipeline = ({ leads, staffName, onOpen, onMove, onContact }: Props) => {
  const isMobile = useIsMobile();
  const [mobileStage, setMobileStage] = useState<string>("new");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );
  const byStage = (id: string) => leads.filter((l) => normalizeStage(l.status) === id);

  if (isMobile) {
    const items = byStage(mobileStage);
    return (
      <div>
        <div role="tablist" aria-label="Pipeline stages" className="flex gap-2 overflow-x-auto pb-3 -mx-3 px-3 snap-x">
          {PIPELINE_STAGES.map((s) => {
            const active = s.id === mobileStage;
            return (
              <button key={s.id} role="tab" aria-selected={active} onClick={() => setMobileStage(s.id)}
                className={`snap-start shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${active ? "text-background border-transparent" : "bg-card border-border"}`}
                style={active ? { background: stageColor(s.id) } : undefined}>
                {!active && <span className="h-2 w-2 rounded-full" style={{ background: stageColor(s.id) }} />}
                {s.label} <span className="opacity-80">{byStage(s.id).length}</span>
              </button>
            );
          })}
        </div>
        <div className="space-y-2.5">
          {items.map((l) => (
            <LeadCard key={l.id} lead={l} staffName={staffName(l.assigned_to)} onOpen={() => onOpen(l.id)} onMove={(s) => onMove(l.id, s)} onContact={() => onContact(l.id)} />
          ))}
          {items.length === 0 && <p className="text-center text-sm text-muted-foreground py-12 rounded-xl border border-dashed border-border">No leads in this stage.</p>}
        </div>
      </div>
    );
  }

  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id); const to = e.over?.id ? String(e.over.id) : null;
    const lead = leads.find((l) => l.id === id);
    if (to && lead && normalizeStage(lead.status) !== to) onMove(id, to);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((s) => {
          const items = byStage(s.id);
          return (
            <Column key={s.id} id={s.id} label={s.label} count={items.length} withBudget={budgetTotal(items)}>
              {items.map((l) => (
                <Draggable key={l.id} id={l.id}>
                  <LeadCard lead={l} staffName={staffName(l.assigned_to)} onOpen={() => onOpen(l.id)} onMove={(st) => onMove(l.id, st)} onContact={() => onContact(l.id)} />
                </Draggable>
              ))}
            </Column>
          );
        })}
      </div>
    </DndContext>
  );
};

export default Pipeline;
