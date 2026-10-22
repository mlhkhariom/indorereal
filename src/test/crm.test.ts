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

import { snoozeDate, conversionRate, isValidIndianPhone, isWithinWeek } from "@/lib/crm";
describe("CRM rebuild rules", () => {
  const now = new Date(2026, 9, 20, 12, 0);
  it("snooze +1 day lands next day 10:00", () => {
    expect(snoozeDate(1, now)).toEqual(new Date(2026, 9, 21, 10, 0, 0));
    expect(snoozeDate(7, now)).toEqual(new Date(2026, 9, 27, 10, 0, 0));
  });
  it("conversion = won / (won + lost)", () => {
    expect(conversionRate(["won", "lost", "lost", "lost", "new"])).toBe(25);
    expect(conversionRate(["closed", "new"])).toBe(100);
    expect(conversionRate(["new"])).toBe(0);
  });
  it("Indian 10-digit phone validation", () => {
    expect(isValidIndianPhone("98765 43210")).toBe(true);
    expect(isValidIndianPhone("+91 9876543210")).toBe(true);
    expect(isValidIndianPhone("12345 67890")).toBe(false);
    expect(isValidIndianPhone("98765")).toBe(false);
  });
  it("next 7 days bucket excludes today", () => {
    expect(isWithinWeek(new Date(2026, 9, 20, 18).toISOString(), now)).toBe(false);
    expect(isWithinWeek(new Date(2026, 9, 23).toISOString(), now)).toBe(true);
    expect(isWithinWeek(new Date(2026, 9, 29).toISOString(), now)).toBe(false);
  });
});
