import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Trash2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Staff } from "./AdminCRM";

const ROLE_INFO: Record<string, string> = {
  admin: "Full access: everything incl. team & settings",
  editor: "Properties, blog, pages, gallery, all leads",
  agent: "Only leads and visits assigned to them",
};

const AdminTeam = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [team, setTeam] = useState<Staff[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("agent");

  const load = () => supabase.rpc("list_staff").then(({ data }) => setTeam((data || []) as Staff[]));
  useEffect(() => { load(); }, []);

  const assign = async (em: string, r: string) => {
    const { error } = await supabase.rpc("assign_role_by_email", { _email: em, _role: r as any });
    if (error) toast({ title: "Could not update", description: error.message, variant: "destructive" });
    else { toast({ title: "Team updated" }); setEmail(""); load(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Remove this person's access?")) return;
    const { error } = await supabase.rpc("remove_team_member", { _user_id: id });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else load();
  };

  if (userRole !== "admin") return <p className="text-muted-foreground">Only admins can manage the team.</p>;

  return (
    <div className="space-y-4 max-w-3xl">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><UserPlus className="h-4 w-4 text-secondary" />Add team member</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">The person must first create an account at <b>/admin/login</b> (Sign up). Then enter their email here and choose a role.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) assign(email.trim(), role); }} className="flex flex-col sm:flex-row gap-2">
            <Input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="editor">Editor</SelectItem><SelectItem value="agent">Agent</SelectItem></SelectContent>
            </Select>
            <Button type="submit" className="btn-gold">Give access</Button>
          </form>
          <div className="grid sm:grid-cols-3 gap-2 pt-1">
            {Object.entries(ROLE_INFO).map(([r, d]) => <div key={r} className="rounded-lg bg-muted/50 p-2 text-xs"><b className="capitalize">{r}</b><p className="text-muted-foreground">{d}</p></div>)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-secondary" />Team ({team.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {team.map((m) => (
            <div key={m.user_id + m.role} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{m.email} {m.user_id === user?.id && <Badge variant="secondary" className="ml-1">You</Badge>}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Select value={m.role} onValueChange={(r) => assign(m.email, r)} disabled={m.user_id === user?.id}>
                  <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="editor">Editor</SelectItem><SelectItem value="agent">Agent</SelectItem></SelectContent>
                </Select>
                {m.user_id !== user?.id && <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" aria-label="Remove" onClick={() => remove(m.user_id)}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminTeam;
