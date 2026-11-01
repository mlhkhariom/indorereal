import { Block, getDef, normalizeBlocks, uid } from "@/lib/builder";

export const AUTOSAVE_DELAY = 1200;

/** Invalid targets and locked blocks never change the saved ordering. */
export function moveBlock(blocks: Block[], active: string, over: string): Block[] {
  const from = blocks.findIndex((b) => b.id === active);
  const to = blocks.findIndex((b) => b.id === over);
  if (from < 0 || to < 0 || from === to || blocks[from].locked || blocks[to].locked) return blocks;
  const result = [...blocks];
  result.splice(to, 0, result.splice(from, 1)[0]);
  return result;
}

export function duplicateBlock(blocks: Block[], id: string): { blocks: Block[]; id?: string } {
  const index = blocks.findIndex((b) => b.id === id);
  if (index < 0) return { blocks };
  const copy = { ...structuredClone(blocks[index]), id: uid(), locked: false };
  return { blocks: [...blocks.slice(0, index + 1), copy, ...blocks.slice(index + 1)], id: copy.id };
}

/** Import content only; never allow a file to replace a page ID, URL or publication status. */
export function parseBlockImport(text: string): Block[] {
  const value = JSON.parse(text);
  const raw = Array.isArray(value) ? value : value?.blocks;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 200) throw new Error("Choose a file containing 1–200 blocks.");
  if (raw.some((b) => !b || !getDef(b.type) || !b.data || typeof b.data !== "object" || Array.isArray(b.data))) {
    throw new Error("This file contains unsupported or invalid blocks.");
  }
  return normalizeBlocks(raw).map((b) => ({ ...b, id: uid() }));
}