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

export const LEAD_SOURCES = ["website", "walk-in", "phone", "referral", "99acres", "magicbricks", "facebook", "instagram", "google"] as const;
export const PROPERTY_TYPES = ["Flat", "Villa", "Plot", "Row House", "Commercial", "Office", "Shop"] as const;
export const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"] as const;
export const PURPOSES = ["buy", "rent", "sell"] as const;
export const LOST_REASONS = ["Budget mismatch", "Bought elsewhere", "Not responding", "Location not suitable", "Plan dropped", "Fake / wrong number"] as const;
export const NOTE_TEMPLATES = ["Called, no answer", "Interested, sending options on WhatsApp", "Site visit done", "Asked to call back later", "Negotiating on price"] as const;

/** Upcoming = after today but within the next 7 days. */
export const isWithinWeek = (followUpAt: string | null, now = new Date()) => {
  if (!followUpAt) return false;
  const d = new Date(followUpAt).getTime();
  const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() + 86400000;
  return d >= endToday && d < endToday + 7 * 86400000;
};

/** Snooze from now: keeps 10:00 local time on the target day. */
export const snoozeDate = (days: number, now = new Date()) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, 10, 0, 0);
  return d;
};

/** Won leads as a % of leads that reached a final stage (won + lost). */
export const conversionRate = (statuses: string[]) => {
  const won = statuses.filter((s) => normalizeStage(s) === "won").length;
  const lost = statuses.filter((s) => normalizeStage(s) === "lost").length;
  return won + lost === 0 ? 0 : Math.round((won / (won + lost)) * 100);
};

/** Indian mobile: 10 digits starting 6-9, optional +91 / 0 prefix. */
export const isValidIndianPhone = (phone: string) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ""));

export const waLink = (phone: string, text?: string) => {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "");
  const n = digits.length === 10 ? "91" + digits : digits;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};

export const daysSince = (iso: string, now = new Date()) => Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / 86400000));
export const initials = (s?: string | null) => (s || "?").split(/[@.\s_-]/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
