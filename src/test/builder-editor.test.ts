import { describe, expect, it } from "vitest";
import { duplicateBlock, moveBlock, parseBlockImport } from "@/lib/builder-editor";
import { Block, makeBlock, normalizeBlocks } from "@/lib/builder";

const fixture = (): Block[] => ["text", "gallery", "prices"].map((type, i) => ({ ...makeBlock(type), id: String(i) }));
describe("builder editing", () => {
  it("reorders only the intended block without mutating input", () => {
    const blocks = fixture();
    expect(moveBlock(blocks, "0", "2").map(b => b.id)).toEqual(["1", "2", "0"]);
    expect(blocks.map(b => b.id)).toEqual(["0", "1", "2"]);
    expect(moveBlock(blocks, "missing", "1")).toBe(blocks);
  });
  it("locked source and target cannot be moved", () => {
    const blocks = fixture(); blocks[0].locked = true;
    expect(moveBlock(blocks, "0", "2")).toBe(blocks);
    expect(moveBlock(blocks, "2", "0")).toBe(blocks);
  });
  it("duplicates independently with a new identity", () => {
    const blocks = fixture();
    const result = duplicateBlock(blocks, "1");
    expect(result.blocks).toHaveLength(4);
    expect(result.blocks[2].id).not.toBe("1");
    result.blocks[2].data.images.push("new-image");
    expect(blocks[1].data.images).toEqual([]);
  });
  it("imports blocks without page identity or publication data", () => {
    const imported = parseBlockImport(JSON.stringify({ page: { id: "other-page", status: "published" }, blocks: fixture() }));
    expect(imported.map(b => b.type)).toEqual(["text", "gallery", "prices"]);
    expect(imported[0].id).not.toBe("0");
    expect(imported[0]).not.toHaveProperty("status");
    expect(() => parseBlockImport('{"blocks":[{"type":"unsupported","data":{}}]}')).toThrow();
  });
  it("preserves locking, layer names and visibility on save round trips", () => {
    const block = { ...fixture()[0], locked: true, hidden: true, name: "Project overview" };
    expect(normalizeBlocks(JSON.parse(JSON.stringify([block])))[0]).toMatchObject({locked: true, hidden: true, name: "Project overview"});
  });
});