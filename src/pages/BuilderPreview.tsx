import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import BlockRenderer from "@/components/builder/BlockRenderer";
import BuilderCanvasBlock from "@/components/builder/BuilderCanvasBlock";
import { moveBlock } from "@/lib/builder-editor";
import { Block, normalizeBlocks } from "@/lib/builder";

/** Rendered inside the editor's iframe so phone/tablet sizes show real layouts. */
const BuilderPreview = () => {
  const [state, setState] = useState<{ blocks: Block[]; title: string; selected?: string; editing: boolean; kind: "page" | "project" }>({ blocks: [], title: "", editing: true, kind: "page" });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const action = (action: string, id: string, extra?: Record<string, unknown>) => window.parent.postMessage({ type: "builder:action", action, id, ...extra }, window.location.origin);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.source !== window.parent || e.origin !== window.location.origin || e.data?.type !== "builder:update") return;
      setState({ blocks: normalizeBlocks(e.data.blocks), title: e.data.title || "", selected: e.data.selected, editing: e.data.editing !== false, kind: e.data.kind === "project" ? "project" : "page" });
    };
    window.addEventListener("message", on);
    window.parent.postMessage({ type: "builder:ready" }, window.location.origin);
    return () => window.removeEventListener("message", on);
  }, []);
  useEffect(() => {
    if (state.selected) Array.from(document.querySelectorAll("[data-canvas-block]")).find((el) => el.getAttribute("data-canvas-block") === state.selected)?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }, [state.selected]);
  if (!state.blocks.length) return <div className="min-h-screen flex items-center justify-center text-muted-foreground p-6 text-center">Add a block from the left to start building.</div>;
  if (!state.editing) return <main><BlockRenderer blocks={state.blocks} pageTitle={state.title} kind={state.kind} /></main>;
  return <main><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
    if (!over) return;
    const blocks = moveBlock(state.blocks, String(active.id), String(over.id));
    if (blocks !== state.blocks) { setState((s) => ({ ...s, blocks })); action("move", String(active.id), { over: String(over.id) }); }
  }}><SortableContext items={state.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
    {state.blocks.map((block) => <BuilderCanvasBlock key={block.id} block={block} title={state.title} kind={state.kind} selected={state.selected === block.id} action={action} />)}
  </SortableContext></DndContext></main>;
};
export default BuilderPreview;
