import { useEffect, useState } from "react";
import BlockRenderer from "@/components/builder/BlockRenderer";
import { Block, normalizeBlocks } from "@/lib/builder";

/** Rendered inside the editor's iframe so phone/tablet sizes show real layouts. */
const BuilderPreview = () => {
  const [state, setState] = useState<{ blocks: Block[]; title: string; selected?: string }>({ blocks: [], title: "" });
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "builder:update") return;
      setState({ blocks: normalizeBlocks(e.data.blocks), title: e.data.title || "", selected: e.data.selected });
    };
    window.addEventListener("message", on);
    window.parent.postMessage({ type: "builder:ready" }, window.location.origin);
    return () => window.removeEventListener("message", on);
  }, []);
  useEffect(() => {
    if (state.selected) document.querySelector(`[data-block="${state.selected}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state.selected]);
  if (!state.blocks.length) return <div className="min-h-screen flex items-center justify-center text-muted-foreground p-6 text-center">Add a block from the left to start building.</div>;
  return <main><BlockRenderer blocks={state.blocks} pageTitle={state.title} showHidden /></main>;
};
export default BuilderPreview;
