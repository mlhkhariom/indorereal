import { describe, it, expect } from "vitest";
import { PIPELINE_STAGES, normalizeStage, followUpBucket, toCSV } from "@/lib/crm";

describe("CRM rules", () => {
  it("pipeline has the six agreed stages in order", () => {
    expect(PIPELINE_STAGES.map((s) => s.id)).toEqual(["new", "contacted", "site_visit", "negotiation", "won", "lost"]);
  });
  it("legacy closed leads are treated as won", () => {
    expect(normalizeStage("closed")).toBe("won");
    expect(normalizeStage("weird")).toBe("new");
  });
  it("follow-up buckets", () => {
    const now = new Date(2026, 9, 20, 12, 0);
    expect(followUpBucket(new Date(2026, 9, 19, 10).toISOString(), now)).toBe("overdue");
    expect(followUpBucket(new Date(2026, 9, 20, 18).toISOString(), now)).toBe("today");
    expect(followUpBucket(new Date(2026, 9, 22).toISOString(), now)).toBe("upcoming");
    expect(followUpBucket(null, now)).toBe("none");
  });
  it("CSV escapes quotes", () => {
    expect(toCSV([{ a: 'x"y' }])).toBe('a\n"x""y"');
  });
});
