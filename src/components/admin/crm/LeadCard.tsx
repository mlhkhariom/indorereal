import { Phone, MessageCircle, CalendarClock, MapPin, IndianRupee, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PIPELINE_STAGES, followUpBucket, daysSince, initials, waLink, normalizeStage, stageColor } from "@/lib/crm";
import type { Lead } from "./types";

export const PriorityDot = ({ p }: { p: string }) => (
  <span className={`inline-block h-2 w-2 rounded-full ${p === "high" ? "bg-destructive" : p === "low" ? "bg-muted-foreground/40" : "bg-gold"}`} aria-label={`${p} priority`} />
);

export const FollowChip = ({ at }: { at: string | null }) => {
  const fb = followUpBucket(at);
  if (fb === "none") return null;
  const cls = fb === "overdue" ? "bg-destructive/10 text-destructive" : fb === "today" ? "bg-gold/20 text-foreground" : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      <CalendarClock className="h-3 w-3" aria-hidden="true" />
      {fb === "overdue" ? "Overdue · " : fb === "today" ? "Today · " : ""}
      {new Date(at!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
    </span>
  );
};

interface Props {
  lead: Lead; staffName?: string; onOpen: () => void;
  onMove?: (stage: string) => void; onContact?: () => void;
}

const LeadCard = ({ lead, staffName, onOpen, onMove, onContact }: Props) => {
  const age = daysSince(lead.created_at);
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-sm shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeft: `3px solid ${stageColor(lead.status)}` }}>
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={onOpen} className="min-w-0 text-left flex-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <p className="font-semibold truncate flex items-center gap-1.5"><PriorityDot p={lead.priority} />{lead.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{lead.phone}</p>
        </button>
        {onMove && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1" aria-label={`Move ${lead.name} to another stage`} onPointerDown={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Move to</DropdownMenuLabel>
              {PIPELINE_STAGES.filter((s) => s.id !== normalizeStage(lead.status)).map((s) => (
                <DropdownMenuItem key={s.id} onSelect={() => onMove(s.id)}>
                  <span className="h-2 w-2 rounded-full mr-2" style={{ background: stageColor(s.id) }} />{s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {lead.property_title && <p className="text-xs text-primary font-medium truncate mt-2">{lead.property_title}</p>}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
        {lead.budget && <span className="inline-flex items-center gap-0.5"><IndianRupee className="h-3 w-3" aria-hidden="true" />{lead.budget}</span>}
        {lead.preferred_location && <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" aria-hidden="true" />{lead.preferred_location}</span>}
        {(lead.bhk || lead.property_type) && <span>{[lead.bhk, lead.property_type].filter(Boolean).join(" ")}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">{lead.source || "website"}</Badge>
        <FollowChip at={lead.follow_up_at} />
        <span className="text-[10px] text-muted-foreground ml-auto">{age === 0 ? "Today" : `${age}d ago`}</span>
      </div>

      <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border">
        <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold grid place-items-center" title={staffName || "Unassigned"}>
          {staffName ? initials(staffName) : "–"}
        </span>
        <span className="text-[11px] text-muted-foreground truncate flex-1">{staffName || "Unassigned"}</span>
        <Button asChild variant="ghost" size="icon" className="h-8 w-8" onPointerDown={(e) => e.stopPropagation()}>
          <a href={`tel:${lead.phone}`} onClick={onContact} aria-label={`Call ${lead.name}`}><Phone className="h-4 w-4" aria-hidden="true" /></a>
        </Button>
        <Button asChild variant="ghost" size="icon" className="h-8 w-8" onPointerDown={(e) => e.stopPropagation()}>
          <a href={waLink(lead.phone, `Hello ${lead.name}, this is Indore Realty.`)} target="_blank" rel="noopener noreferrer" onClick={onContact} aria-label={`WhatsApp ${lead.name} (opens in new tab)`}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default LeadCard;
