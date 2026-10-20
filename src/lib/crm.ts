export const PIPELINE_STAGES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "site_visit", label: "Site Visit" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
] as const;

export type StageId = (typeof PIPELINE_STAGES)[number]["id"];
export const PRIORITIES = ["low", "medium", "high"] as const;

export const stageLabel = (id: string) => PIPELINE_STAGES.find((s) => s.id === id)?.label ?? id;

/** Legacy "closed" leads count as won. Unknown statuses fall back to "new". */
export const normalizeStage = (status: string): StageId => {
  if (status === "closed") return "won";
  return (PIPELINE_STAGES.some((s) => s.id === status) ? status : "new") as StageId;
};

export type FollowUpBucket = "overdue" | "today" | "upcoming" | "none";
export const followUpBucket = (followUpAt: string | null, now = new Date()): FollowUpBucket => {
  if (!followUpAt) return "none";
  const d = new Date(followUpAt);
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endToday = new Date(startToday.getTime() + 86400000);
  if (d < now && d < startToday) return "overdue";
  if (d < endToday) return d < now ? "overdue" : "today";
  return "upcoming";
};

export const toCSV = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
};
