import { describe, it, expect } from "vitest";
import { slugify, isValidSlug, normalizeBlocks, makeBlock, youtubeId, TEMPLATES } from "@/lib/builder";

describe("page builder", () => {
  it("turns names into clean web addresses", () => {
    expect(slugify("Skyline Heights, Phase 2!")).toBe("skyline-heights-phase-2");
    expect(isValidSlug("skyline-heights")).toBe(true);
    expect(isValidSlug("Bad Slug")).toBe(false);
    expect(isValidSlug("-x")).toBe(false);
  });
  it("drops unknown blocks and fills missing fields with defaults", () => {
    const out = normalizeBlocks([{ type: "nope" }, { id: "a", type: "prices", data: { heading: "Rates" } }]);
    expect(out).toHaveLength(1);
    expect(out[0].data.heading).toBe("Rates");
    expect(Array.isArray(out[0].data.items)).toBe(true);
    expect(normalizeBlocks("junk")).toEqual([]);
  });
  it("new blocks don't share data objects", () => {
    const a = makeBlock("amenities"), b = makeBlock("amenities");
    a.data.items.push({ name: "x" });
    expect(b.data.items.length).not.toBe(a.data.items.length);
  });
  it("reads YouTube ids", () => {
    expect(youtubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("hello")).toBeNull();
  });
  it("project template includes price list, floor plans and brochure", () => {
    const types = TEMPLATES.project.blocks().map((b) => b.type);
    expect(types).toEqual(expect.arrayContaining(["prices", "floorplans", "brochure", "enquiry"]));
  });
});
