import { useMemo, useState } from "react";
import { ArrowUpDown, Trash2, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PIPELINE_STAGES, normalizeStage, stageLabel, stageColor } from "@/lib/crm";
import { useIsMobile } from "@/hooks/use-mobile";
import LeadCard, { PriorityDot, FollowChip } from "./LeadCard";
import type { Lead, Staff } from "./types";

type SortKey = "name" | "status" | "priority" | "budget" | "preferred_location" | "follow_up_at" | "created_at";
const prRank: Record<string, number> = { high: 0, medium: 1, low: 2 };

interface Props {
  leads: Lead[]; staff: Staff[]; isAdmin: boolean; staffName: (id: string | null) => string | undefined;
  onOpen: (id: string) => void; onBulk: (ids: string[], patch: Partial<Lead>) => void; onDelete: (ids: string[]) => void;
  onMove: (id: string, stage: string) => void; onContact: (id: string) => void;
}

const LeadList = ({ leads, staff, isAdmin, staffName, onOpen, onBulk, onDelete, onMove, onContact }: Props) => {
  const isMobile = useIsMobile();
  const [sort, setSort] = useState<{ k: SortKey; asc: boolean }>({ k: "created_at", asc: false });
  const [sel, setSel] = useState<string[]>([]);

  const rows = useMemo(() => [...leads].sort((a, b) => {
    const va = sort.k === "priority" ? prRank[a.priority] ?? 1 : sort.k === "status" ? PIPELINE_STAGES.findIndex((s) => s.id === normalizeStage(a.status)) : (a[sort.k] ?? "");
    const vb = sort.k === "priority" ? prRank[b.priority] ?? 1 : sort.k === "status" ? PIPELINE_STAGES.findIndex((s) => s.id === normalizeStage(b.status)) : (b[sort.k] ?? "");
    return (va < vb ? -1 : va > vb ? 1 : 0) * (sort.asc ? 1 : -1);
  }), [leads, sort]);

  if (isMobile) {
    return (
      <div className="space-y-2.5">
        {rows.map((l) => <LeadCard key={l.id} lead={l} staffName={staffName(l.assigned_to)} onOpen={() => onOpen(l.id)} onMove={(s) => onMove(l.id, s)} onContact={() => onContact(l.id)} />)}
        {rows.length === 0 && <p className="text-center text-muted-foreground py-10">No leads found.</p>}
      </div>
    );
  }

  const H = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <TableHead aria-sort={sort.k === k ? (sort.asc ? "ascending" : "descending") : "none"}>
      <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSort((s) => ({ k, asc: s.k === k ? !s.asc : true }))}>
        {children}<ArrowUpDown className="h-3 w-3" aria-hidden="true" />
      </button>
    </TableHead>
  );
  const allSel = rows.length > 0 && sel.length === rows.length;
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const done = () => setSel([]);

  return (
    <div className="space-y-2">
      {sel.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-2 text-sm">
          <span className="font-medium px-1">{sel.length} selected</span>
          <Select onValueChange={(v) => { onBulk(sel, { status: v }); done(); }}>
            <SelectTrigger className="h-8 w-40" aria-label="Move selected to stage"><SelectValue placeholder="Move to stage" /></SelectTrigger>
            <SelectContent>{PIPELINE_STAGES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select onValueChange={(v) => { onBulk(sel, { assigned_to: v === "none" ? null : v }); done(); }}>
            <SelectTrigger className="h-8 w-44" aria-label="Assign selected"><UserPlus className="h-3.5 w-3.5 mr-1" aria-hidden="true" /><SelectValue placeholder="Assign to" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
              {staff.map((s) => <SelectItem key={s.user_id + s.role} value={s.user_id}>{s.email}</SelectItem>)}
            </SelectContent>
          </Select>
          {isAdmin && <Button size="sm" variant="destructive" className="h-8" onClick={() => { if (confirm(`Delete ${sel.length} lead(s)?`)) { onDelete(sel); done(); } }}><Trash2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />Delete</Button>}
          <Button size="sm" variant="ghost" className="h-8 ml-auto" onClick={done}>Clear</Button>
        </div>
      )}
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"><Checkbox checked={allSel} onCheckedChange={() => setSel(allSel ? [] : rows.map((r) => r.id))} aria-label="Select all leads" /></TableHead>
              <H k="name">Client</H><H k="status">Stage</H><H k="priority">Priority</H><H k="budget">Budget</H>
              <H k="preferred_location">Area</H><TableHead>Assigned</TableHead><H k="follow_up_at">Follow-up</H><H k="created_at">Created</H>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((l) => (
              <TableRow key={l.id} data-state={sel.includes(l.id) ? "selected" : undefined}>
                <TableCell><Checkbox checked={sel.includes(l.id)} onCheckedChange={() => toggle(l.id)} aria-label={`Select ${l.name}`} /></TableCell>
                <TableCell>
                  <button className="text-left rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => onOpen(l.id)}>
                    <span className="font-medium hover:text-primary block">{l.name}</span>
                    <span className="text-xs text-muted-foreground">{l.phone}{l.property_title ? ` · ${l.property_title}` : ""}</span>
                  </button>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2 py-0.5" style={{ background: stageColor(l.status, 0.12) }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: stageColor(l.status) }} />{stageLabel(normalizeStage(l.status))}
                  </span>
                </TableCell>
                <TableCell><span className="inline-flex items-center gap-1.5 capitalize text-xs"><PriorityDot p={l.priority} />{l.priority}</span></TableCell>
                <TableCell className="text-xs">{l.budget || "—"}</TableCell>
                <TableCell className="text-xs">{l.preferred_location || "—"}</TableCell>
                <TableCell className="text-xs">{staffName(l.assigned_to) || "—"}</TableCell>
                <TableCell><FollowChip at={l.follow_up_at} />{!l.follow_up_at && <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleDateString("en-IN")}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-10">No leads found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
      <Badge variant="outline" className="sr-only">{rows.length} leads</Badge>
    </div>
  );
};

export default LeadList;
