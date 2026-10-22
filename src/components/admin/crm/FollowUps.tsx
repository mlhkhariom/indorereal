import { Phone, MessageCircle, Check, AlarmClock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { followUpBucket, isWithinWeek, normalizeStage, stageLabel, snoozeDate, waLink } from "@/lib/crm";
import type { Lead, UpdateLead } from "./types";

interface Props { leads: Lead[]; onOpen: (id: string) => void; update: UpdateLead; }

const active = (l: Lead) => !["won", "lost"].includes(normalizeStage(l.status));

const FollowUps = ({ leads, onOpen, update }: Props) => {
  const sorted = leads.filter((l) => l.follow_up_at && active(l)).sort((a, b) => a.follow_up_at!.localeCompare(b.follow_up_at!));
  const groups = [
    { key: "overdue", title: "Overdue", items: sorted.filter((l) => followUpBucket(l.follow_up_at) === "overdue") },
    { key: "today", title: "Today", items: sorted.filter((l) => followUpBucket(l.follow_up_at) === "today") },
    { key: "week", title: "Next 7 days", items: sorted.filter((l) => isWithinWeek(l.follow_up_at)) },
  ];
  const contacted = (id: string) => update(id, { last_contacted_at: new Date().toISOString() });

  if (groups.every((g) => g.items.length === 0)) return <p className="text-center text-muted-foreground py-12 rounded-xl border border-dashed border-border">No follow-ups planned this week. Set one from a lead's detail.</p>;

  return (
    <div className="space-y-6">
      {groups.filter((g) => g.items.length).map((g) => (
        <section key={g.key} aria-label={`${g.title} follow-ups`}>
          <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${g.key === "overdue" ? "text-destructive" : ""}`}>
            {g.key === "overdue" && <AlertCircle className="h-4 w-4" aria-hidden="true" />}{g.title} <span className="text-muted-foreground font-normal">({g.items.length})</span>
          </h3>
          <div className="grid gap-2 md:grid-cols-2">
            {g.items.map((l) => (
              <Card key={l.id} className={g.key === "overdue" ? "border-destructive/40" : ""}>
                <CardContent className="p-3">
                  <button className="w-full text-left rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => onOpen(l.id)}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{l.name}</p>
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {new Date(l.follow_up_at!).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{stageLabel(normalizeStage(l.status))} · {l.property_title || l.preferred_location || l.message || l.phone}</p>
                  </button>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Button asChild size="sm" variant="outline" className="h-8 flex-1">
                      <a href={`tel:${l.phone}`} onClick={() => contacted(l.id)}><Phone className="h-3.5 w-3.5 mr-1" aria-hidden="true" />Call</a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="h-8 flex-1">
                      <a href={waLink(l.phone, `Hello ${l.name}, this is Indore Realty following up.`)} target="_blank" rel="noopener noreferrer" onClick={() => contacted(l.id)}><MessageCircle className="h-3.5 w-3.5 mr-1" aria-hidden="true" />WhatsApp</a>
                    </Button>
                    <Button size="sm" className="h-8 flex-1" onClick={() => update(l.id, { follow_up_at: null, last_contacted_at: new Date().toISOString() })}>
                      <Check className="h-3.5 w-3.5 mr-1" aria-hidden="true" />Done
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8" aria-label={`Snooze follow-up for ${l.name}`}><AlarmClock className="h-4 w-4" aria-hidden="true" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {[["Tomorrow", 1], ["In 3 days", 3], ["Next week", 7]].map(([label, d]) => (
                          <DropdownMenuItem key={label} onSelect={() => update(l.id, { follow_up_at: snoozeDate(d as number).toISOString() })}>{label}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default FollowUps;
